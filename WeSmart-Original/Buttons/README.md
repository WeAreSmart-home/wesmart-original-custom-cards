# Buttons Cards

Due varianti di card per attivare azioni in Home Assistant, entrambe ispirate all'estetica **Anthropic WeSmart AI**. Scegli il layout più adatto al tuo dashboard.

| Card | Tipo | Layout |
|------|------|--------|
| WeSmart Buttons Bar Card | `custom:wesmart-buttons-bar-card` | Barra orizzontale compatta |
| WeSmart Buttons Grid Card | `custom:wesmart-buttons-grid-card` | Griglia quadrata auto-fit |

Entrambe le card supportano:
- Toggle entità (luci, switch, input_boolean, …)
- Chiamate service arbitrarie (scene, script, automazioni, …)
- Colori stato dinamici — arancione quando attivo, attenuato quando spento
- Temi: `dark` · `light` · `auto`

---

## WeSmart Buttons Bar Card

Barra orizzontale compatta, circa 80px di altezza e larga come una card standard. Ideale per una striscia di azioni rapide in cima o in fondo a una vista.

### Anteprima

```
┌──────────────────────────────────────────────────────────┐
│   💡        📺        🎬        🛡️        🌡️            │
│  Luci       TV       Film    Allarme    Clima            │
└──────────────────────────────────────────────────────────┘
```

I pulsanti attivi brillano arancione; quelli inattivi sono colorati con surface e attenuati.

### Funzionalità

- Numero flessibile di pulsanti (consigliati: 3–6)
- Icona (MDI) + etichetta per pulsante
- Colore stato dinamico: arancione quando l'entità è attiva
- Animazione pressione (scala) per pulsanti service senza stato
- Titolo piccolo opzionale sopra la riga
- Entità non disponibili: oscurate, non interattive
- Temi: `dark` · `light` · `auto`

### Installazione

1. Copia in `config/www/wesmart-buttons-bar-card.js`
2. Aggiungi risorsa `/local/wesmart-buttons-bar-card.js` (modulo JavaScript)
3. Hard refresh (`Cmd+Shift+R` / `Ctrl+Shift+R`)

### Configurazione

```yaml
type: custom:wesmart-buttons-bar-card
theme: dark
buttons:
  - name: Luci
    icon: mdi:lightbulb
    entity: light.soggiorno
  - name: TV
    icon: mdi:television
    entity: switch.tv
```

**Opzioni:**

| Opzione | Tipo | Default | Descrizione |
|---------|------|---------|-------------|
| `theme` | string | `'dark'` | `dark` \| `light` \| `auto` |
| `title` | string | — | Etichetta piccola opzionale sopra i pulsanti |
| `buttons` | list | — | **Obbligatorio.** Lista pulsanti |

**Campi elemento pulsante:**

| Campo | Tipo | Descrizione |
|-------|------|-------------|
| `name` | string | Etichetta pulsante |
| `icon` | string | Icona MDI (es. `mdi:lightbulb`) |
| `entity` | string | Entità per tracciamento stato + azione toggle default |
| `service` | string | Service da chiamare al clic (`dominio.service`) |
| `service_data` | object | Dati passati al service |

**Logica azione:**

| `entity` | `service` | Azione clic | Stato attivo |
|----------|-----------|-------------|--------------|
| ✓ | — | `homeassistant.toggle` | dallo stato entità |
| — | ✓ | chiama service | sempre spento (animazione pressione) |
| ✓ | ✓ | chiama service | dallo stato entità |
| — | — | nessuna | sempre spento |

**Stati attivi** (entità considerata attiva quando lo stato è uno di):
`on` · `open` · `unlocked` · `detected` · `active` · `home` · `playing` · `occupied` · `armed_*`

### Esempio completo

```yaml
type: custom:wesmart-buttons-bar-card
title: Azioni Rapide
theme: dark
buttons:
  - name: Luci Soggiorno
    icon: mdi:lightbulb
    entity: light.soggiorno
  - name: TV
    icon: mdi:television
    entity: switch.tv
  - name: Scena Film
    icon: mdi:movie-open
    service: scene.turn_on
    service_data:
      entity_id: scene.serata_film
  - name: Allarme
    icon: mdi:shield-home
    service: alarm_control_panel.alarm_arm_away
    service_data:
      entity_id: alarm_control_panel.casa
  - name: Ventilatore
    icon: mdi:fan
    entity: switch.ventilatore
```

### Esempio tema light

```yaml
type: custom:wesmart-buttons-bar-card
theme: light
buttons:
  - name: Luci
    icon: mdi:lightbulb
    entity: light.ingresso
  - name: Porta
    icon: mdi:door
    entity: binary_sensor.porta_ingresso
  - name: Suoneria
    icon: mdi:bell
    service: script.suona_campanello
```

---

## WeSmart Buttons Grid Card

Card quadrata con pulsanti disposti in una griglia automatica. Il numero di colonne si adatta alla larghezza della card, o puoi fissarlo con `columns`. Ideale per stanze o pannelli con molte scorciatoie.

### Anteprima

```
┌─────────────────────────┐
│  Azioni Casa             │
│  ┌──────┐ ┌──────┐      │
│  │  💡  │ │  📺  │      │
│  │Luci  │ │ TV   │      │
│  └──────┘ └──────┘      │
│  ┌──────┐ ┌──────┐      │
│  │  🎬  │ │  🛡️ │      │
│  │Film  │ │Alarm │      │
│  └──────┘ └──────┘      │
└─────────────────────────┘
```

### Funzionalità

- Griglia auto-fit (`auto-fill, minmax(80px, 1fr)`) o numero fisso di colonne
- Header opzionale con icona + titolo
- Icona (MDI) + etichetta per pulsante
- Stessa logica stati e colori della Bar card
- Animazione pressione per pulsanti service senza stato
- Entità non disponibili: oscurate, non interattive
- Temi: `dark` · `light` · `auto`

### Installazione

1. Copia in `config/www/wesmart-buttons-grid-card.js`
2. Aggiungi risorsa `/local/wesmart-buttons-grid-card.js` (modulo JavaScript)
3. Hard refresh (`Cmd+Shift+R` / `Ctrl+Shift+R`)

### Configurazione

```yaml
type: custom:wesmart-buttons-grid-card
title: Azioni Casa
icon: mdi:home
theme: dark
buttons:
  - name: Luci
    icon: mdi:lightbulb
    entity: light.soggiorno
  - name: TV
    icon: mdi:television
    entity: switch.tv
```

**Opzioni:**

| Opzione | Tipo | Default | Descrizione |
|---------|------|---------|-------------|
| `title` | string | — | Intestazione card opzionale |
| `icon` | string | `mdi:gesture-tap` | Icona header (mostrata solo quando `title` è impostato) |
| `theme` | string | `'dark'` | `dark` \| `light` \| `auto` |
| `columns` | number | auto | Forza numero fisso di colonne; ometti per auto-fit |
| `buttons` | list | — | **Obbligatorio.** Lista pulsanti |

**Campi elemento pulsante:** come Bar card — `name`, `icon`, `entity`, `service`, `service_data`.

### Esempio completo

```yaml
type: custom:wesmart-buttons-grid-card
title: Soggiorno
icon: mdi:sofa
theme: dark
columns: 3
buttons:
  - name: Soffitto
    icon: mdi:ceiling-light
    entity: light.soggiorno_soffitto
  - name: Piantana
    icon: mdi:floor-lamp
    entity: light.soggiorno_piantana
  - name: LED Strip
    icon: mdi:led-strip-variant
    entity: light.soggiorno_strip
  - name: TV
    icon: mdi:television
    entity: switch.tv
  - name: Scena Film
    icon: mdi:movie-open
    service: scene.turn_on
    service_data:
      entity_id: scene.soggiorno_film
  - name: Scena Lettura
    icon: mdi:book-open
    service: scene.turn_on
    service_data:
      entity_id: scene.soggiorno_lettura
```

### Note

- `columns` forza una griglia fissa; senza, la griglia riempie le colonne automaticamente in base alla larghezza disponibile (minimo 80px ciascuna).
- I pulsanti con solo `service` (nessuna `entity`) mostrano una breve animazione pressione al clic — nessun colore attivo persistente poiché non c'è stato da tracciare.
- Puoi combinare `entity` + `service` per tracciare lo stato visivamente pur chiamando un service personalizzato invece del toggle default (utile per `input_select`, `alarm_control_panel`, `media_player`, ecc.).

---
---

# Buttons Cards

Two card variants for triggering actions in Home Assistant, both styled after the **Anthropic WeSmart AI** aesthetic. Choose the layout that fits your dashboard.

| Card | Type key | Layout |
|------|----------|--------|
| WeSmart Buttons Bar Card | `custom:wesmart-buttons-bar-card` | Compact horizontal bar |
| WeSmart Buttons Grid Card | `custom:wesmart-buttons-grid-card` | Auto-fit square grid |

Both cards support:
- Toggle entities (lights, switches, input_boolean, …)
- Arbitrary service calls (scenes, scripts, automations, …)
- Dynamic state colors — orange when active, muted when off
- Themes: `dark` · `light` · `auto`

---

## WeSmart Buttons Bar Card

Compact horizontal bar, roughly 80 px tall and as wide as a standard card. Ideal for a quick-action strip at the top or bottom of a view.

### Preview

```
┌──────────────────────────────────────────────────────────┐
│   💡        📺        🎬        🛡️        🌡️            │
│  Luci       TV       Film    Allarme    Clima            │
└──────────────────────────────────────────────────────────┘
```

Active buttons glow orange; inactive buttons are surface-colored and muted.

### Features

- Flexible number of buttons (recommended: 3–6)
- Icon (MDI) + label per button
- Dynamic state color: orange when entity is active
- Press animation (scale) for stateless service buttons
- Optional small title above the row
- Unavailable entities: dimmed, non-interactive
- Themes: `dark` · `light` · `auto`

### Installation

1. Copy to `config/www/wesmart-buttons-bar-card.js`
2. Add resource `/local/wesmart-buttons-bar-card.js` (JavaScript module)
3. Hard refresh (`Cmd+Shift+R` / `Ctrl+Shift+R`)

### Configuration

```yaml
type: custom:wesmart-buttons-bar-card
theme: dark
buttons:
  - name: Luci
    icon: mdi:lightbulb
    entity: light.soggiorno
  - name: TV
    icon: mdi:television
    entity: switch.tv
```

**Options:**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `theme` | string | `'dark'` | `dark` \| `light` \| `auto` |
| `title` | string | — | Optional small label above the buttons |
| `buttons` | list | — | **Required.** Button list |

**Button item fields:**

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Button label |
| `icon` | string | MDI icon (e.g. `mdi:lightbulb`) |
| `entity` | string | Entity for state tracking + default toggle action |
| `service` | string | Service to call on click (`domain.service`) |
| `service_data` | object | Data passed to the service |

**Action logic:**

| `entity` | `service` | Click action | Active state |
|----------|-----------|--------------|--------------|
| ✓ | — | `homeassistant.toggle` | from entity state |
| — | ✓ | calls service | always off (press animation) |
| ✓ | ✓ | calls service | from entity state |
| — | — | none | always off |

**Active states** (entity considered active when state is one of):
`on` · `open` · `unlocked` · `detected` · `active` · `home` · `playing` · `occupied` · `armed_*`

### Full example

```yaml
type: custom:wesmart-buttons-bar-card
title: Azioni Rapide
theme: dark
buttons:
  - name: Luci Soggiorno
    icon: mdi:lightbulb
    entity: light.soggiorno
  - name: TV
    icon: mdi:television
    entity: switch.tv
  - name: Scena Film
    icon: mdi:movie-open
    service: scene.turn_on
    service_data:
      entity_id: scene.serata_film
  - name: Allarme
    icon: mdi:shield-home
    service: alarm_control_panel.alarm_arm_away
    service_data:
      entity_id: alarm_control_panel.casa
  - name: Ventilatore
    icon: mdi:fan
    entity: switch.ventilatore
```

### Light theme example

```yaml
type: custom:wesmart-buttons-bar-card
theme: light
buttons:
  - name: Luci
    icon: mdi:lightbulb
    entity: light.ingresso
  - name: Porta
    icon: mdi:door
    entity: binary_sensor.porta_ingresso
  - name: Suoneria
    icon: mdi:bell
    service: script.suona_campanello
```

---

## WeSmart Buttons Grid Card

Square-ish card with buttons arranged in an automatic grid. The number of columns adapts to the card width, or you can fix it with `columns`. Best for rooms or panels with many shortcuts.

### Preview

```
┌─────────────────────────┐
│  Azioni Casa             │
│  ┌──────┐ ┌──────┐      │
│  │  💡  │ │  📺  │      │
│  │Luci  │ │ TV   │      │
│  └──────┘ └──────┘      │
│  ┌──────┐ ┌──────┐      │
│  │  🎬  │ │  🛡️ │      │
│  │Film  │ │Alarm │      │
│  └──────┘ └──────┘      │
└─────────────────────────┘
```

### Features

- Auto-fit grid (`auto-fill, minmax(80px, 1fr)`) or fixed column count
- Optional header with icon + title
- Icon (MDI) + label per button
- Same state logic and colors as Bar card
- Press animation for stateless service buttons
- Unavailable entities: dimmed, non-interactive
- Themes: `dark` · `light` · `auto`

### Installation

1. Copy to `config/www/wesmart-buttons-grid-card.js`
2. Add resource `/local/wesmart-buttons-grid-card.js` (JavaScript module)
3. Hard refresh (`Cmd+Shift+R` / `Ctrl+Shift+R`)

### Configuration

```yaml
type: custom:wesmart-buttons-grid-card
title: Azioni Casa
icon: mdi:home
theme: dark
buttons:
  - name: Luci
    icon: mdi:lightbulb
    entity: light.soggiorno
  - name: TV
    icon: mdi:television
    entity: switch.tv
```

**Options:**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `title` | string | — | Optional card heading |
| `icon` | string | `mdi:gesture-tap` | Header icon (shown only when `title` is set) |
| `theme` | string | `'dark'` | `dark` \| `light` \| `auto` |
| `columns` | number | auto | Fix the number of columns; omit for auto-fit |
| `buttons` | list | — | **Required.** Button list |

**Button item fields:** same as Bar card — `name`, `icon`, `entity`, `service`, `service_data`.

### Full example

```yaml
type: custom:wesmart-buttons-grid-card
title: Soggiorno
icon: mdi:sofa
theme: dark
columns: 3
buttons:
  - name: Soffitto
    icon: mdi:ceiling-light
    entity: light.soggiorno_soffitto
  - name: Piantana
    icon: mdi:floor-lamp
    entity: light.soggiorno_piantana
  - name: LED Strip
    icon: mdi:led-strip-variant
    entity: light.soggiorno_strip
  - name: TV
    icon: mdi:television
    entity: switch.tv
  - name: Scena Film
    icon: mdi:movie-open
    service: scene.turn_on
    service_data:
      entity_id: scene.soggiorno_film
  - name: Scena Lettura
    icon: mdi:book-open
    service: scene.turn_on
    service_data:
      entity_id: scene.soggiorno_lettura
```

### Notes

- `columns` forces a fixed grid; without it, the grid fills columns automatically based on available width (minimum 80 px each).
- Buttons with only `service` (no `entity`) show a brief press animation on click — no persistent active color since there is no state to track.
- You can combine `entity` + `service` to track state visually while calling a custom service instead of the default toggle (useful for `input_select`, `alarm_control_panel`, `media_player`, etc.).
