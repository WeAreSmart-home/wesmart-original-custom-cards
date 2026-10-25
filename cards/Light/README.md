# WeSmart Light Card — v2.0.0

Una card personalizzata avanzata per Home Assistant dedicata alle entità luce (`light.*`), dotata di **Visual Editor grafico in stile Bubble Card** e **Motore Cromatico Dinamico (InfiniteColor)**.

---

## ✨ Novità v2.0.0 — Visual Configurator & Nuove Customizzazioni

- **🎛️ Visual Editor Integrato (Stile Bubble Card)**:
  Non serve più scrivere codice YAML a mano! Quando aggiungi o modifichi la card dalla dashboard di Home Assistant, si apre automaticamente la **finestra di configurazione visuale dedicata** divisa in 3 sezioni a fisarmonica:
  1. **💡 Entità & Identità**: menu a tendina ufficiale HA con ricerca istantanea delle luci (`light.*`), campo nome personalizzato e selettore visuale delle icone `mdi:*`.
  2. **🎨 Aspetto & Motore InfiniteColor**: selettore visuale per il tema (`🌙 Dark`, `☀️ Light`, `🔄 Auto`), **8 pastiglie colore (Swatches)** cliccabili (incluso l'arancione originale `#D97757`), Color Picker HEX libero e la nuova funzione **Colore dinamico dalla luce (RGB)**.
  3. **⚙️ Controlli & Comportamento**: interruttori rapidi per abilitare/disabilitare slider luminosità, temperatura colore Kelvin, selettore RGB/Hue, compressione da spenta e visibilità del footer.
- **🌈 Sincronizzazione Colore Dinamico (`dynamic_light_color`)**:
  Quando attivo, se la lampadina RGB è accesa, il bagliore (glow) e l'accento della card si adattano in tempo reale al colore effettivo della luce!
- **📐 Footer Opzionale (`show_footer`)**:
  Possibilità di nascondere la barra inferiore per ottenere un layout ancora più compatto.

---

## 📦 Installazione

1. Copia [`wesmart-light-card.js`](wesmart-light-card.js) nella cartella `config/www/` di Home Assistant:
   ```text
   config/www/wesmart-light-card.js
   ```
2. In Home Assistant vai su **Impostazioni → Dashboard → Risorse** e aggiungi:
   ```text
   URL:  /local/wesmart-light-card.js
   Tipo: Modulo JavaScript
   ```
3. Ricarica il browser con **Hard Refresh** (`Cmd+Shift+R` su Mac / `Ctrl+Shift+R` su Windows).

---

## 🖱️ Configurazione da Interfaccia Grafica (Consigliata)

1. Entra in modalità **Modifica Dashboard** in Home Assistant e clicca su **"+ Aggiungi Card"**.
2. Cerca **WeSmart Light Card** nell'elenco: la card selezionerà automaticamente la tua prima luce disponibile per mostrarti subito l'anteprima attiva.
3. Usa i pannelli **1. Entità & Identità**, **2. Aspetto & Motore InfiniteColor** e **3. Controlli & Comportamento** per personalizzare ogni dettaglio in tempo reale.

---

## 📝 Configurazione YAML (Opzionale / Avanzata)

La card mantiene il 100% di compatibilità con la configurazione YAML e supporta sia il tag `custom:wesmart-light-card` sia l'alias `custom:wesmart-infinite-light-card`.

### Configurazione minima
```yaml
type: custom:wesmart-light-card
entity: light.lampada_soggiorno
```

### Configurazione completa con tutte le opzioni v2.0
```yaml
type: custom:wesmart-light-card
entity: light.bedroom_lamp
name: Lampada Camera
icon: mdi:floor-lamp
color: '#D97757'              # Qualsiasi colore HEX (default: #D97757 WeSmart Orange)
theme: dark                   # dark | light | auto
dynamic_light_color: true     # Segue il colore RGB reale della lampadina quando accesa
show_brightness: true         # Mostra slider luminosità (0-100%)
show_color_temp: true         # Mostra slider temperatura colore (Kelvin)
show_color: true              # Mostra slider tonalità colore (Hue RGB)
collapse_when_off: true       # Comprime gli slider quando la luce è spenta
show_footer: true             # Mostra/nasconde la barra inferiore con logo WeSmart
```

### Tabella Parametri

| Opzione | Tipo | Default | Descrizione |
|---------|------|---------|-------------|
| `entity` | `string` | — | **Obbligatorio.** ID entità `light.*` |
| `name` | `string` | `auto` | Sovrascrive il nome visualizzato |
| `icon` | `string` | `auto` | Sovrascrive l'icona (`mdi:*`), configurabile con Icon Picker visuale |
| `color` | `string` | `'#D97757'` | Colore base HEX per il motore **InfiniteColor** |
| `theme` | `string` | `'dark'` | Tema superficie: `dark` \| `light` \| `auto` |
| `dynamic_light_color` | `boolean` | `false` | Se `true`, adatta l'accento della card al colore RGB della luce accesa |
| `show_brightness` | `boolean` | `true` | Mostra lo slider della luminosità |
| `show_color_temp` | `boolean` | `true` | Mostra lo slider Kelvin/temperatura colore (se supportato dalla luce) |
| `show_color` | `boolean` | `true` | Mostra lo slider tonalità (Hue) per luci RGB/HS |
| `collapse_when_off` | `boolean` | `false` | Nasconde i controlli quando la luce è spenta |
| `show_footer` | `boolean` | `true` | Mostra il footer inferiore con ID entità e marchio WeSmart |

---

## 💡 Modalità Luce Rilevate Automaticamente

La card interroga `supported_color_modes` dell'entità e mostra automaticamente solo gli slider pertinenti (con supporto nativo HA 2022.9+ `color_temp_kelvin` e fallback legacy `mireds`):

| Modalità HA | Luminosità | Kelvin / CT | Colore Hue |
|-------------|:----------:|:-----------:|:----------:|
| `onoff` | — | — | — |
| `brightness` | ✓ | — | — |
| `color_temp` | ✓ | ✓ | — |
| `hs` / `rgb` / `rgbw` / `xy` | ✓ | — | ✓ |
| `rgbww` | ✓ | ✓* | ✓ |

---
---

# WeSmart Light Card — v2.0.0 (English)

A custom Home Assistant light card featuring a **Bubble Card-style Visual Configurator** and the **InfiniteColor Dynamic Palette Engine**.

## Key Features (v2.0)
- **Built-in Visual Editor**: Configure entity (`light.*` dropdown), custom name, MDI icon picker, theme (`dark` / `light` / `auto`), 8 InfiniteColor preset swatches, custom HEX color picker, and behavior switches directly from the Home Assistant UI.
- **Dynamic Light Color Sync (`dynamic_light_color`)**: Optionally morph the card's glow and accent color to match the real-time RGB color of the active bulb.
- **Collapsible Controls & Optional Footer**: Hide sliders when the light is off (`collapse_when_off`) or hide the bottom bar (`show_footer: false`).
