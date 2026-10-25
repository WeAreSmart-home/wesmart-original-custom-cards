# WeSmart Light Card v2.0.0 — Documentazione Tecnica & Blueprint Visual Editor

> **Versione:** `2.0.0` · **Tag Principale:** `custom:wesmart-light-card` · **Alias:** `custom:wesmart-infinite-light-card` · **File:** `cards/Light/wesmart-light-card.js`

---

## Indice

1. [Panoramica Architetturale](#1-panoramica-architetturale)
2. [Blueprint: Come Funziona il Visual Editor (Stile Bubble Card)](#2-blueprint-come-funziona-il-visual-editor-stile-bubble-card)
3. [Motore Cromatico InfiniteColor & Dynamic Light Sync](#3-motore-cromatico-infinitecolor--dynamic-light-sync)
4. [Opzioni di Configurazione & Schema Dati](#4-opzioni-di-configurazione--schema-dati)
5. [Rilevamento Capacità Entità Home Assistant](#5-rilevamento-capacità-entità-home-assistant)
6. [Retrocompatibilità (`safeDefine`)](#6-retrocompatibilità-safedefine)

---

## 1. Panoramica Architetturale

**WeSmart Light Card v2.0.0** è un singolo modulo JavaScript autonomo (Zero Build Step, Zero Dipendenze esterne) che racchiude due Web Components standard:
1. **`WeSmartInfiniteLightCard`** (`<wesmart-light-card>`): il componente grafico principale renderizzato nella dashboard Lovelace.
2. **`WeSmartLightCardEditor`** (`<wesmart-light-card-editor>`): il configuratore grafico dedicato montato automaticamente da Home Assistant nella finestra modale **"Modifica Card"**.

---

## 2. Blueprint: Come Funziona il Visual Editor (Stile Bubble Card)

Questo pattern architetturale rappresenta lo **standard ufficiale WeSmart v2.0** da replicare su tutte le card della collezione.

### 2.1 Aggancio tra Card e Finestra Modale di Home Assistant

Nella classe della Card vengono esposti due metodi statici:

```javascript
static getConfigElement() {
  return document.createElement('wesmart-light-card-editor');
}

static getStubConfig(hass, entities) {
  const allEntities = entities || Object.keys(hass?.states || {});
  const firstLight = allEntities.find(e => e.startsWith('light.')) || 'light.example';
  return {
    entity:              firstLight,
    color:               '#D97757',
    theme:               'dark',
    show_brightness:     true,
    show_color_temp:     true,
    show_color:          true,
    collapse_when_off:   false,
    dynamic_light_color: false,
    show_footer:         true,
  };
}
```

- Quando l'utente clicca su **"Modifica"**, Lovelace invoca `getConfigElement()`, istanzia `<wesmart-light-card-editor>`, gli passa `editor.hass = hass` e chiama `editor.setConfig(config)`.

### 2.2 Approccio Ibrido: Layout Accordion WeSmart + Selettori Nativi `<ha-form>`

Per offrire sia l'estetica raffinata di **Bubble Card** (sezioni espandibili a fisarmonica, pastiglie colore cliccabili, segmented buttons) sia la potenza dei selettori ufficiali di Home Assistant (ricerca entità con stanze e icone MDI), l'editor adotta un **approccio ibrido**:

1. **Sezioni Accordion Custom (`.section` / `.section-header` / `.section-body`)**:
   - Gestiscono l'apertura/chiusura fluida dei blocchi logici (*1. Entità & Identità*, *2. Aspetto & Motore InfiniteColor*, *3. Controlli & Comportamento*).
2. **Selettori Nativi tramite `<ha-form>`**:
   - All'interno della Sezione 1 viene inserito un elemento `<ha-form id="ha-identity-form">` configurato con gli **HA Selectors**:
     ```javascript
     form.schema = [
       { name: 'entity', required: true,  selector: { entity: { domain: 'light' } } },
       { name: 'name',   required: false, selector: { text: {} } },
       { name: 'icon',   required: false, selector: { icon: { placeholder: 'mdi:lightbulb' } } },
     ];
     ```
   - Questo garantisce che Home Assistant carichi automaticamente in *lazy-loading* il menu a tendina ufficiale delle entità (filtrato sul dominio `light`) e il selettore icone MDI, senza alcun rischio di componenti non registrati.
3. **Emissione dell'evento `config-changed`**:
   - Ogni modifica nell'editor invoca `_updateConfig(patch)`, che aggiorna lo stato interno e scatena:
     ```javascript
     this.dispatchEvent(new CustomEvent('config-changed', {
       detail: { config: next },
       bubbles: true,
       composed: true,
     }));
     ```
   - Home Assistant intercetta l'evento e aggiorna l'anteprima della card a destra in tempo reale, mantenendo il focus sui campi dell'editor.

---

## 3. Motore Cromatico InfiniteColor & Dynamic Light Sync

La funzione `_buildPalette(hex, isDark)` converte qualsiasi colore esadecimale nello spazio colore **HSL** e calcola automaticamente:
- `--accent`, `--accent-soft`, `--accent-glow`, `--accent-glow-strong`, `--accent-border`
- `--bg`, `--surface`, `--border`
- `--text`, `--text-muted`, `--text-dim`, `--overlay-bg`, `--shadow`

Con il colore predefinito `#D97757`, la palette generata corrisponde esattamente al tema **WeSmart Original** (carbone caldo e arancione).

### Dynamic Light Color (`dynamic_light_color: true`)
Quando l'opzione `dynamic_light_color` è attiva e l'entità `light.*` è accesa (`state === 'on'`) con attributo `rgb_color: [r, g, b]`, la card converte i valori RGB in HEX (`_rgbToHex`) e sovrascrive dinamicamente i token `--accent*`, creando un effetto immersivo che riflette il colore reale della lampadina nella stanza.

---

## 4. Opzioni di Configurazione & Schema Dati

| Chiave YAML | Tipo | Default | Sezione Visual Editor |
|-------------|------|---------|-----------------------|
| `entity` | `string` | `''` | 1. Entità & Identità (`entity` selector) |
| `name` | `string` | `null` | 1. Entità & Identità (`text` selector) |
| `icon` | `string` | `null` | 1. Entità & Identità (`icon` selector) |
| `theme` | `'dark' \| 'light' \| 'auto'` | `'dark'` | 2. Aspetto & InfiniteColor (Segmented Pills) |
| `color` | `string` (HEX) | `'#D97757'` | 2. Aspetto & InfiniteColor (Swatches + Color Picker) |
| `dynamic_light_color` | `boolean` | `false` | 2. Aspetto & InfiniteColor (Switch) |
| `show_brightness` | `boolean` | `true` | 3. Controlli & Comportamento (Switch) |
| `show_color_temp` | `boolean` | `true` | 3. Controlli & Comportamento (Switch) |
| `show_color` | `boolean` | `true` | 3. Controlli & Comportamento (Switch) |
| `collapse_when_off` | `boolean` | `false` | 3. Controlli & Comportamento (Switch) |
| `show_footer` | `boolean` | `true` | 3. Controlli & Comportamento (Switch) |

---

## 5. Rilevamento Capacità Entità Home Assistant

La card legge `stateObj.attributes.supported_color_modes` e gli attributi `color_temp_kelvin` / `min_color_temp_kelvin` / `max_color_temp_kelvin` (con fallback a `min_mireds` / `max_mireds`):
- **Brightness**: mostrata se `show_brightness: true` e la luce supporta `brightness`, `color_temp`, `hs`, `rgb`, `rgbw`, `rgbww`, `xy`.
- **Kelvin / Color Temp**: mostrata se `show_color_temp: true` e la luce espone il range Kelvin/Mired.
- **Hue Picker**: mostrato se `show_color: true` e la luce supporta `hs`, `rgb`, `rgbw`, `rgbww`, `xy`.

---

## 6. Retrocompatibilità (`safeDefine`)

Per garantire che nessuna dashboard esistente si interrompa dopo l'unificazione, il modulo registra sia i tag principali sia gli alias storici:
- `wesmart-light-card` e `wesmart-infinite-light-card`
- `wesmart-light-card-editor` e `wesmart-infinite-light-card-editor`
