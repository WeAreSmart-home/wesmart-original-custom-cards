# WeSmart Light Card

Una card personalizzata per Home Assistant per entità luce, ispirata all'estetica **Anthropic WeSmart AI**.

## Anteprima

Card scura con accenti arancioni caldi, animazioni fluide e un design minimale.

- Sfondo: carbone caldo scuro `#292524`
- Accento: arancione Claude `#D97757`
- Tipografia: sans-serif di sistema / Inter
- Effetti glow quando la luce è accesa

## Funzionalità

- Accendi/spegni (clic sul toggle o sull'icona)
- Slider luminosità con anteprima in tempo reale
- Slider temperatura colore Kelvin (supporto HA 2022.9+ e legacy mireds)
- Slider tonalità (hue) minimal per luci a colori
- Animazione di apertura/chiusura fluida dei controlli
- Animazione pulse glow quando la luce è accesa
- Overlay stato non disponibile
- Responsive e touch-friendly

## Installazione

### Manuale

1. Copia `wesmart-light-card.js` nella cartella config di Home Assistant:
   ```
   config/www/wesmart-light-card.js
   ```

2. In Home Assistant → **Impostazioni → Dashboard → Risorse**, aggiungi:
   ```
   /local/wesmart-light-card.js   (modulo JavaScript)
   ```

3. Ricarica il browser (hard refresh: Cmd+Shift+R / Ctrl+Shift+R).

### HACS (se pubblicato)

1. HACS → Frontend → "+ Esplora e Scarica" → cerca **WeSmart Light Card**
2. Scarica e aggiungi alle Risorse.

## Configurazione

```yaml
type: custom:wesmart-light-card
entity: light.living_room
```

### Tutte le opzioni

| Opzione | Tipo | Default | Descrizione |
|---------|------|---------|-------------|
| `entity` | string | — | **Obbligatorio.** Entità `light.*` |
| `name` | string | auto | Sovrascrittura nome visualizzato |
| `icon` | string | auto | Sovrascrittura icona (mdi:*) |
| `show_brightness` | boolean | `true` | Mostra slider luminosità |
| `show_color_temp` | boolean | `true` | Mostra slider Kelvin/temperatura colore (solo per luci che la supportano) |
| `show_color` | boolean | `true` | Mostra slider tonalità (hue) per luci a colori |
| `collapse_when_off` | boolean | `false` | Nasconde i controlli quando la luce è spenta; si apre automaticamente quando si accende |

### Esempio con tutte le opzioni

```yaml
type: custom:wesmart-light-card
entity: light.bedroom_lamp
name: Lampada Camera
icon: mdi:floor-lamp
show_brightness: true
show_color_temp: true
show_color: true
collapse_when_off: true
```

## Modalità luce supportate

La card rileva automaticamente le capacità tramite `supported_color_modes`.
Lo slider Kelvin appare anche per luci che riportano `color_temp` come attributo (es. `rgbww` con bianco regolabile).
Supporta gli attributi moderni di HA 2022.9+ (`color_temp_kelvin`, `min_color_temp_kelvin`, `max_color_temp_kelvin`) con fallback agli attributi legacy (`color_temp`, `min_mireds`, `max_mireds`).

| Modalità | Luminosità | Kelvin/CT | Colore |
|----------|:----------:|:---------:|:------:|
| `onoff` | — | — | — |
| `brightness` | ✓ | — | — |
| `color_temp` | ✓ | ✓ | — |
| `hs` | ✓ | — | ✓ |
| `rgb` | ✓ | — | ✓ |
| `rgbw` | ✓ | — | ✓ |
| `rgbww` | ✓ | ✓* | ✓ |
| `xy` | ✓ | — | ✓ |

*\* Solo se la luce riporta gli attributi Kelvin (`color_temp_kelvin` / `min_color_temp_kelvin` / `max_color_temp_kelvin`) o legacy mireds.*

## Selezione Colore (Hue Slider)

Per le luci che supportano il colore, la card mostra uno **slider tonalità** minimal con gradiente arcobaleno — stesso stile degli altri slider. Trascinando il cursore si invia il colore come `hs_color` al servizio `light.turn_on`.

---
---

# WeSmart Light Card

A custom Home Assistant light entity card styled after the **Anthropic WeSmart AI** aesthetic.

## Preview

Dark card with warm orange accents, smooth animations, and a minimal Claude-inspired design.

- Background: deep warm charcoal `#292524`
- Accent: Claude orange `#D97757`
- Typography: system sans-serif / Inter
- Glow effects when the light is on

## Features

- Toggle on/off (click toggle or icon)
- Brightness slider with live preview
- Color temperature slider in Kelvin (HA 2022.9+ and legacy mireds support)
- Minimal hue slider for color lights
- Smooth open/close animation for the controls section
- Pulse glow animation when light is on
- Unavailable state overlay
- Responsive and touch-friendly

## Installation

### Manual

1. Copy `wesmart-light-card.js` to your Home Assistant config folder:
   ```
   config/www/wesmart-light-card.js
   ```

2. In Home Assistant → **Settings → Dashboards → Resources**, add:
   ```
   /local/wesmart-light-card.js   (JavaScript module)
   ```

3. Reload the browser (hard refresh: Cmd+Shift+R / Ctrl+Shift+R).

### HACS (if published)

1. HACS → Frontend → "+ Explore & Download" → search **WeSmart Light Card**
2. Download and add to Resources.

## Configuration

```yaml
type: custom:wesmart-light-card
entity: light.living_room
```

### All options

| Option             | Type    | Default | Description                         |
|--------------------|---------|---------|-------------------------------------|
| `entity`           | string  | —       | **Required.** `light.*` entity      |
| `name`             | string  | auto    | Override display name               |
| `icon`             | string  | auto    | Override icon (mdi:*)               |
| `show_brightness`   | boolean | `true`  | Show brightness slider              |
| `show_color_temp`   | boolean | `true`  | Show Kelvin/color temperature slider (only for lights that support it) |
| `show_color`        | boolean | `true`  | Show hue slider for color lights    |
| `collapse_when_off` | boolean | `false` | Hide controls when light is off; automatically expands when turned on |

### Example with all options

```yaml
type: custom:wesmart-light-card
entity: light.bedroom_lamp
name: Bedroom Lamp
icon: mdi:floor-lamp
show_brightness: true
show_color_temp: true
show_color: true
collapse_when_off: true
```

## Supported light modes

The card auto-detects capabilities via `supported_color_modes`.
The Kelvin slider also appears for lights that report `color_temp` as an attribute (e.g. `rgbww` with tunable white).
Supports modern HA 2022.9+ attributes (`color_temp_kelvin`, `min_color_temp_kelvin`, `max_color_temp_kelvin`) with fallback to legacy (`color_temp`, `min_mireds`, `max_mireds`).

| Mode         | Brightness | Kelvin/CT | Color |
|--------------|:----------:|:---------:|:-----:|
| `onoff`      | —          | —         | —     |
| `brightness` | ✓          | —         | —     |
| `color_temp` | ✓          | ✓         | —     |
| `hs`         | ✓          | —         | ✓     |
| `rgb`        | ✓          | —         | ✓     |
| `rgbw`       | ✓          | —         | ✓     |
| `rgbww`      | ✓          | ✓*        | ✓     |
| `xy`         | ✓          | —         | ✓     |

*\* Only if the light reports Kelvin attributes (`color_temp_kelvin` / `min_color_temp_kelvin` / `max_color_temp_kelvin`) or legacy mireds.*

## Color Selection (Hue Slider)

For lights that support color, the card shows a minimal **hue slider** with a rainbow gradient — same style as all other sliders. Dragging the thumb sends the color as `hs_color` via `light.turn_on`.
