# Claude Light Card — Documentazione Tecnica

> Custom card per Home Assistant ispirata all'estetica **Anthropic Claude AI**
> Versione: `1.0.0` · Tipo: `custom:claude-light-card` · File: `claude-light-card.js`

---

## Indice

1. [Panoramica](#1-panoramica)
2. [Requisiti](#2-requisiti)
3. [Installazione](#3-installazione)
4. [Configurazione](#4-configurazione)
5. [Opzioni di configurazione](#5-opzioni-di-configurazione)
6. [Funzionalità](#6-funzionalità)
7. [Modalità luce supportate](#7-modalità-luce-supportate)
8. [Palette colori preset](#8-palette-colori-preset)
9. [Design system — Token CSS](#9-design-system--token-css)
10. [Architettura del codice](#10-architettura-del-codice)
11. [Interazioni utente](#11-interazioni-utente)
12. [Stati della card](#12-stati-della-card)
13. [Risoluzione problemi](#13-risoluzione-problemi)
14. [Riferimenti API Home Assistant](#14-riferimenti-api-home-assistant)

---

## 1. Panoramica

**Claude Light Card** è una custom card per il frontend di Home Assistant progettata per controllare entità di tipo `light.*`. L'interfaccia riprende il design system di Anthropic Claude AI: sfondo charcoal caldo, accent arancione `#D97757`, tipografia minimal e animazioni fluide.

### Screenshot concettuale

```
┌──────────────────────────────────────────┐
│  💡  Lampada Soggiorno        [ ●────── ]│
│      72% · On                            │
│                                          │
│  BRIGHTNESS                        72%   │
│  ████████████░░░░░░░░░░░░░░░░░░░         │
│                                          │
│  COLOR TEMPERATURE               3200K   │
│  ░░░░░░░░░░░░████████████░░░░░░░         │
│                                          │
│  COLOR                                   │
│  ● ● ● ● ● ● ● ●                        │
│                                          │
│  ─────────────────────────────────────  │
│  🏠 soggiorno                  ⊙ Claude  │
└──────────────────────────────────────────┘
```

---

## 2. Requisiti

| Requisito | Versione minima |
|-----------|----------------|
| Home Assistant | 2023.1 o superiore |
| Browser | Chrome 90+, Firefox 88+, Safari 14+, Edge 90+ |
| Modalità dashboard | Lovelace (YAML o UI) |

> **Nota:** non sono richieste dipendenze esterne. La card è un singolo file JavaScript vanilla, senza build step.

---

## 3. Installazione

### 3.1 Installazione manuale

**Passo 1** — Copia il file nella cartella pubblica di Home Assistant:

```
/config/www/claude-light-card.js
```

La cartella `www/` espone i file sull'URL `/local/`. Se non esiste, creala.

**Passo 2** — Registra la risorsa in Home Assistant:

Naviga in **Impostazioni → Dashboard → (menu ⋮) → Risorse** e aggiungi:

| Campo | Valore |
|-------|--------|
| URL | `/local/claude-light-card.js` |
| Tipo risorsa | Modulo JavaScript |

In alternativa, aggiungi direttamente nel file `configuration.yaml`:

```yaml
lovelace:
  resources:
    - url: /local/claude-light-card.js
      type: module
```

**Passo 3** — Ricarica il browser con hard refresh:

- **Mac:** `Cmd + Shift + R`
- **Windows/Linux:** `Ctrl + Shift + R`

---

### 3.2 Installazione via HACS (se pubblicata)

1. Apri **HACS → Frontend**
2. Clicca **"+ Esplora e scarica repository"**
3. Cerca `Claude Light Card`
4. Clicca **Scarica**
5. Vai in **Impostazioni → Dashboard → Risorse** e verifica che la risorsa sia presente
6. Hard refresh del browser

---

### 3.3 Verifica installazione

Apri la console del browser (F12 → Console). Dovresti vedere:

```
 CLAUDE LIGHT CARD  v1.0.0
```

con sfondo arancione, a conferma che la card è caricata correttamente.

---

## 4. Configurazione

### 4.1 Configurazione minima

```yaml
type: custom:claude-light-card
entity: light.living_room
```

Questo è sufficiente per un funzionamento completo. La card rileva automaticamente le capacità dell'entità.

---

### 4.2 Configurazione completa

```yaml
type: custom:claude-light-card
entity: light.bedroom_lamp
name: Bedroom Lamp
icon: mdi:floor-lamp
show_brightness: true
show_color_temp: true
show_color: true
```

---

### 4.3 Esempi per tipo di entità

**Lampadina smart semplice (solo on/off):**
```yaml
type: custom:claude-light-card
entity: light.entrance_light
name: Ingresso
show_brightness: false
show_color_temp: false
show_color: false
```

**Striscia LED RGB:**
```yaml
type: custom:claude-light-card
entity: light.led_strip_kitchen
name: Strip LED Cucina
icon: mdi:led-strip-variant
show_brightness: true
show_color_temp: false
show_color: true
```

**Lampadina tunable white (bianco regolabile):**
```yaml
type: custom:claude-light-card
entity: light.desk_lamp
name: Lampada Scrivania
icon: mdi:desk-lamp
show_brightness: true
show_color_temp: true
show_color: false
```

**Lampadina full RGBWW:**
```yaml
type: custom:claude-light-card
entity: light.ceiling_light
name: Plafoniera Salotto
show_brightness: true
show_color_temp: true
show_color: true
```

---

## 5. Opzioni di configurazione

| Opzione | Tipo | Default | Obbligatorio | Descrizione |
|---------|------|---------|:---:|-------------|
| `entity` | `string` | — | ✅ | ID entità luce. Deve iniziare con `light.` |
| `name` | `string` | `friendly_name` | ❌ | Sovrascrive il nome visualizzato |
| `icon` | `string` | auto da HA | ❌ | Icona MDI personalizzata (es. `mdi:floor-lamp`) |
| `show_brightness` | `boolean` | `true` | ❌ | Mostra/nasconde lo slider della luminosità |
| `show_color_temp` | `boolean` | `true` | ❌ | Mostra/nasconde lo slider della temperatura colore |
| `show_color` | `boolean` | `true` | ❌ | Mostra/nasconde la palette dei colori preset |

> **Importante:** le opzioni `show_*` controllano solo la visibilità UI. Se l'entità non supporta una funzionalità, il controllo corrispondente non viene mostrato indipendentemente dall'impostazione.

---

## 6. Funzionalità

### 6.1 Toggle on/off

La luce può essere accesa/spenta in due modi:

- Clic sul **toggle switch** (in alto a destra)
- Clic sull'**icona della lampadina** (in alto a sinistra)

Quando la luce è spenta, i controlli (luminosità, temperatura, colore) diventano semi-trasparenti e non interagibili.

---

### 6.2 Slider luminosità

- **Range:** 1% – 100% (internamente 0–255 per HA)
- **Interazione:** drag mouse o touch
- **Preview live:** il valore percentuale si aggiorna in tempo reale durante il drag
- **Chiamata servizio:** emessa solo al rilascio del drag (`mouseup` / `touchend`), per evitare chiamate eccessive
- **Conversione:** `brightness_ha = Math.round((pct / 100) * 255)`

---

### 6.3 Slider temperatura colore

- **Unità visualizzata:** Kelvin (K)
- **Unità interna HA:** mireds (μrd)
- **Range:** determinato da `min_mireds` e `max_mireds` dell'entità
- **Gradiente visivo:** da blu freddo (`#4A90D9`) a giallo caldo (`#FFD580`)
- **Conversione mireds → Kelvin:** `K = 1.000.000 / mireds`
- **Esempio tipico:** 153 mireds (≈ 6535K, luce fredda) → 500 mireds (≈ 2000K, luce calda)

---

### 6.4 Palette colori preset

8 colori predefiniti in formato `hs_color` (Hue-Saturation):

| # | Nome | RGB | Hue | Sat |
|---|------|-----|-----|-----|
| 1 | Warm White | `rgb(255,228,196)` | 30° | 33% |
| 2 | Cool White | `rgb(220,237,255)` | 210° | 14% |
| 3 | Sunset | `rgb(255,140,60)` | 24° | 76% |
| 4 | Ocean | `rgb(64,164,223)` | 204° | 71% |
| 5 | Forest | `rgb(106,190,120)` | 128° | 44% |
| 6 | Lavender | `rgb(160,140,220)` | 255° | 36% |
| 7 | Rose | `rgb(230,100,130)` | 344° | 57% |
| 8 | Gold | `rgb(255,195,50)` | 44° | 80% |

Il colore selezionato viene evidenziato con un anello arancione (`--claude-orange`).

---

### 6.5 Overlay "Unavailable"

Quando l'entità è nello stato `unavailable`, viene mostrato un overlay con:

- Icona `mdi:lan-disconnect`
- Testo "Unavailable"
- Effetto blur sullo sfondo
- Tutti i controlli disabilitati

---

### 6.6 Animazione glow

Quando la luce è accesa, la card mostra:

- **Gradiente radiale** arancione nella parte superiore (pseudo-elemento `::before`)
- **Animazione `pulse-glow`**: oscilla tra 60px e 80px di glow sul bordo ogni 3 secondi
- **Bordo arancione** semi-trasparente
- **Puntino di stato** arancione con glow nell'intestazione

---

## 7. Modalità luce supportate

La card rileva automaticamente le capacità tramite l'attributo `supported_color_modes` dell'entità.

| `supported_color_modes` | Luminosità | Temp. Colore | Colori |
|-------------------------|:----------:|:------------:|:------:|
| `onoff` | — | — | — |
| `brightness` | ✅ | — | — |
| `color_temp` | ✅ | ✅ | — |
| `hs` | ✅ | — | ✅ |
| `rgb` | ✅ | — | ✅ |
| `rgbw` | ✅ | — | ✅ |
| `rgbww` | ✅ | — | ✅ |
| `xy` | ✅ | — | ✅ |

> **Nota:** alcune lampadine `rgbww` supportano sia colori che temperatura colore. In quel caso HA espone entrambe le modalità e la card mostra entrambi i controlli.

---

## 8. Palette colori preset

I colori preset vengono inviati come `hs_color` tramite il servizio `light.turn_on`. Il formato HS (Hue-Saturation) è lo standard nativo di Home Assistant e garantisce la massima compatibilità con qualsiasi tipo di lampadina RGB.

```javascript
// Esempio chiamata interna
hass.callService('light', 'turn_on', {
  entity_id: 'light.example',
  hs_color: [204, 0.71]   // Ocean Blue: Hue 204°, Saturation 71%
});
```

---

## 9. Design system — Token CSS

La card utilizza CSS Custom Properties (variabili) definite sull'elemento `:host`. È possibile sovrascriverle da Lovelace tramite il tema di HA o stili inline.

| Variabile CSS | Valore default | Utilizzo |
|---------------|---------------|---------|
| `--claude-bg` | `#1C1917` | Sfondo base |
| `--claude-surface` | `#292524` | Superficie card |
| `--claude-surface-2` | `#332E2A` | Superficie secondaria (slider, icona) |
| `--claude-border` | `rgba(255,255,255,0.08)` | Bordi sottili |
| `--claude-orange` | `#D97757` | Colore accent principale |
| `--claude-orange-glow` | `rgba(217,119,87,0.25)` | Glow arancione |
| `--claude-orange-soft` | `rgba(217,119,87,0.15)` | Accent soft (riempimenti) |
| `--claude-text` | `#F5F0EB` | Testo principale |
| `--claude-text-muted` | `#A09080` | Testo secondario |
| `--claude-text-dim` | `#6B5F56` | Testo terziario / disabilitato |
| `--claude-success` | `#7CB87A` | Colore successo (riservato) |
| `--claude-radius` | `20px` | Border radius card |
| `--claude-radius-sm` | `12px` | Border radius elementi interni |
| `--claude-radius-xs` | `8px` | Border radius micro-elementi |
| `--transition` | `all 0.3s cubic-bezier(0.4,0,0.2,1)` | Transizione standard |

### Tipografia

```css
font-family: -apple-system, 'Söhne', 'Inter', BlinkMacSystemFont, sans-serif;
```

Priorità: font di sistema → Söhne (font di Claude) → Inter → fallback.

---

## 10. Architettura del codice

### 10.1 Struttura del file

```
claude-light-card.js
│
├── CARD_VERSION           — costante versione
├── styles (string)        — CSS completo in Shadow DOM
├── COLOR_PRESETS (array)  — 8 colori preset con rgb e hs
│
├── class ClaudeLightCard  — elemento principale
│   ├── constructor()
│   ├── setConfig()        — riceve config YAML da HA
│   ├── set hass()         — riceve aggiornamenti stato da HA
│   ├── getCardSize()      — altezza card (unità HA)
│   ├── _render()          — crea Shadow DOM
│   ├── _getHTML()         — template HTML
│   ├── _updateState()     — sincronizza UI con stato HA
│   ├── _bindEvents()      — attacca listener
│   ├── _bindSlider()      — gestione drag slider (mouse + touch)
│   ├── _setSliderPct()    — helper aggiornamento slider
│   ├── _q()               — querySelector shorthand
│   ├── _toggle()          — chiama turn_on / turn_off
│   └── _callService()     — wrapper hass.callService()
│
├── class ClaudeLightCardEditor  — editor visuale (stub)
│
└── customElements.define()      — registrazione elemento
    window.customCards.push()    — registrazione UI picker HA
```

---

### 10.2 Ciclo di vita Home Assistant

```
HA carica la risorsa JS
        │
        ▼
customElements.define('claude-light-card', ...)
        │
        ▼
HA istanzia l'elemento → constructor()
        │
        ▼
HA chiama setConfig(config)  ← config dal YAML
        │  └─ _render() → crea Shadow DOM + HTML + listener
        │
        ▼
HA chiama set hass(hass)     ← ad ogni cambio di stato
        │  └─ _updateState() → aggiorna UI
        │
        ▼
Utente interagisce
        │  └─ _callService() → hass.callService('light', ...)
        │
        ▼
HA emette nuovo stato → set hass() → _updateState()
```

---

### 10.3 Gestione slider

Gli slider sono implementati senza elementi `<input type="range">` nativi, per garantire controllo totale sull'aspetto visivo.

**Evento mouse:**
```
mousedown → calcola % da clientX → aggiorna UI
    ↓
document.mousemove → aggiorna UI in live
    ↓
document.mouseup → chiama callService → rimuove listener
```

**Evento touch (mobile):**
```
touchstart (passive) → calcola % da touches[0].clientX
    ↓
document.touchmove (passive) → aggiorna UI in live
    ↓
document.touchend → chiama callService → rimuove listener
```

Il flag `_isDraggingBrightness` / `_isDraggingCT` previene che aggiornamenti da HA sovrascrivano la UI mentre l'utente sta trascinando.

---

## 11. Interazioni utente

| Elemento | Azione | Risultato |
|----------|--------|-----------|
| Icona lampadina | Click | Toggle on/off |
| Toggle switch | Click | Toggle on/off |
| Slider luminosità | Drag | Imposta luminosità (0–255) |
| Slider temp. colore | Drag | Imposta color_temp (mireds) |
| Pallino colore | Click | Imposta hs_color |
| Card (body) | — | Nessuna azione diretta |

---

## 12. Stati della card

| Stato entità HA | Comportamento card |
|------|------|
| `on` | Glow arancione, puntino acceso, controlli attivi, animazione pulse |
| `off` | Aspetto neutro, controlli semi-trasparenti (pointer-events: none) |
| `unavailable` | Overlay blur con messaggio, tutto disabilitato |
| `unknown` | Trattato come `off` |
| Entità non trovata | Nessun render, silenzioso |

---

## 13. Risoluzione problemi

### La card non appare nella dashboard

1. Verifica che il file sia in `/config/www/claude-light-card.js`
2. Verifica la risorsa: **Impostazioni → Dashboard → Risorse** → deve esserci `/local/claude-light-card.js` come modulo
3. Esegui hard refresh (`Ctrl+Shift+R`)
4. Controlla la console del browser per errori

---

### Errore "Custom element not defined"

La risorsa è caricata ma la registrazione fallisce. Controlla la console per errori JavaScript nel file.

---

### Lo slider non risponde

- Verifica che la luce sia nello stato `on` (i controlli sono disabilitati quando la luce è spenta)
- Verifica che `supported_color_modes` includa la modalità corrispondente

---

### Il controllo temperatura/colore non appare

La card mostra solo i controlli supportati dall'entità. Controlla gli attributi dell'entità in **Strumenti sviluppatore → Stati**:

```yaml
# Attributi rilevanti da controllare:
supported_color_modes: [color_temp, hs]
min_mireds: 153
max_mireds: 500
```

---

### La card appare ma non invia comandi

- Controlla che l'entità sia nel dominio `light.*`
- Verifica che HA abbia l'integrazione attiva per il dispositivo
- Controlla il log di HA: **Impostazioni → Sistema → Log**

---

## 14. Riferimenti API Home Assistant

### Servizi utilizzati

| Servizio | Quando | Parametri |
|----------|--------|-----------|
| `light.turn_on` | Luce off → on, cambio brightness/color_temp/hs_color | `entity_id`, + parametri opzionali |
| `light.turn_off` | Luce on → off | `entity_id` |

### Attributi letti dall'entità

| Attributo | Tipo | Utilizzo |
|-----------|------|---------|
| `friendly_name` | string | Nome visualizzato (se `name` non specificato) |
| `icon` | string | Icona (se `icon` non specificato) |
| `supported_color_modes` | array | Determina quali controlli mostrare |
| `brightness` | number (0–255) | Posizione slider luminosità |
| `color_temp` | number (mireds) | Posizione slider temperatura |
| `min_mireds` | number | Limite minimo slider temperatura |
| `max_mireds` | number | Limite massimo slider temperatura |
| `hs_color` | [hue, sat] | Colore corrente (non utilizzato per selezione UI) |
| `area_id` | string | Visualizzato nel footer |

---

*Documentazione generata per Claude Light Card v1.0.0*
*Progetto: Custom Card Home Assistant · Stile: Anthropic Claude AI*
