# WeSmart History Card

Una card grafico storico personalizzata per Home Assistant, ispirata all'estetica **Anthropic WeSmart AI**.
Sostituisce la HA History Graph predefinita con una versione migliorata e interattiva.
Supporta i temi **dark**, **light** e **auto**.

## Anteprima

### Tema dark
Sfondo carbone caldo scuro, accento arancione. Barra timeline per sensori binari, grafico a linee fluido con riempimento gradiente per sensori numerici.

### Tema light
Sfondo crema/bianco caldo (`#FFFEFA`), stesso accento arancione `#D97757`, look minimale e pulito.

## Funzionalità

- **Rilevamento automatico tipo grafico:**
  - Entità binarie (luce, switch, binary_sensor…) → **barra timeline arancione** con periodi on/off
  - Entità numeriche (sensor…) → **grafico a linee SVG** con riempimento gradiente sotto la curva
- **Pill intervallo temporale interattivi** nella card: `1h` · `6h` · `24h` · `7d`
- **Badge stato corrente** accanto al nome di ogni entità (arancione quando on/attivo)
- **Stat riepilogativa** per entità:
  - Binario: `Attivo 45%` — percentuale di tempo in stato attivo nell'intervallo selezionato
  - Numerico: `18.2 – 23.5 °C` — min/max nell'intervallo selezionato
- **Etichette asse temporale** sotto ogni grafico (HH:MM per ≤ 48h, giorno+data per 7d)
- Barra loader animata durante il recupero storico
- Tap su una riga → apre dialogo **More Info**
- Entità non disponibili mostrate oscurate e non interattive
- Tre modalità tema: `dark`, `light`, `auto`

## Installazione

1. Copia `wesmart-history-card.js` in:
   ```
   config/www/wesmart-history-card.js
   ```

2. In Home Assistant → **Impostazioni → Dashboard → Risorse**, aggiungi:
   ```
   /local/wesmart-history-card.js   (modulo JavaScript)
   ```

3. Hard refresh del browser (`Cmd+Shift+R` / `Ctrl+Shift+R`).

## Configurazione

```yaml
type: custom:wesmart-history-card
title: Storico Casa
entities:
  - light.soggiorno
  - sensor.temperatura_cucina
  - binary_sensor.porta_ingresso
```

### Tutte le opzioni

| Opzione | Tipo | Default | Descrizione |
|---------|------|---------|-------------|
| `title` | string | `'History'` | Intestazione card |
| `icon` | string | `mdi:chart-line` | Icona header (mdi:*) |
| `theme` | string | `'dark'` | `dark` \| `light` \| `auto` |
| `hours` | number | `24` | Range temporale default (1 · 6 · 24 · 168) |
| `entities` | list | — | **Obbligatorio.** Lista entità da visualizzare |

### Formato entità

Ogni voce in `entities` può essere una stringa semplice o un oggetto:

```yaml
entities:
  - light.soggiorno                        # stringa semplice
  - entity: sensor.temperatura_cucina      # oggetto con sovrascritture
    name: Temperatura Cucina
    icon: mdi:thermometer
  - entity: binary_sensor.porta_ingresso
    name: Porta Ingresso
    icon: mdi:door
```

| Campo entità | Tipo | Default | Descrizione |
|---|---|---|---|
| `entity` | string | — | ID entità (qualsiasi dominio) |
| `name` | string | auto | Sovrascrittura nome visualizzato |
| `icon` | string | auto | Sovrascrittura icona (mdi:*) |

### Domini entità supportati (icona automatica)

| Dominio | Icona automatica |
|---------|-----------------|
| `light` | `mdi:lightbulb` |
| `switch` | `mdi:toggle-switch` |
| `sensor` | `mdi:chart-line` |
| `binary_sensor` | `mdi:motion-sensor` |
| `climate` | `mdi:thermometer` |
| `cover` | `mdi:garage` |
| `fan` | `mdi:fan` |
| `media_player` | `mdi:cast` |
| `input_boolean` | `mdi:toggle-switch` |

## Tipi di grafico

### Barra timeline (binario)

Renderizzata per entità il cui storico contiene stati non numerici (`on`/`off`, `open`/`closed`, `detected`/`clear`, ecc.).

- Segmento **arancione** = stato attivo/on (`on`, `open`, `detected`, `unlocked`, `wet`, `active`, `home`, `playing`)
- Segmento **scuro** = stato inattivo/off
- Stat: `Attivo X%` — percentuale dell'intervallo selezionato in stato attivo

### Grafico a linee (numerico)

Renderizzato per entità il cui storico contiene solo stati numerici.

- Percorso SVG con tratto arancione (`#D97757`, 1.5px)
- Riempimento gradiente da arancione (38% opacità) a trasparente
- Asse Y ridimensionato automaticamente a min/max dei valori nell'intervallo
- Stat: `min – max unità` (es. `18.2 – 23.5 °C`)

## Esempi tema

```yaml
# Dark (default)
theme: dark

# Light (crema calda)
theme: light

# Segue prefers-color-scheme di sistema
theme: auto
```

## Esempio completo

```yaml
type: custom:wesmart-history-card
title: Storico Casa
icon: mdi:chart-line
theme: dark
hours: 24
entities:
  - entity: light.soggiorno
    name: Soggiorno
  - entity: light.cucina
    name: Cucina
  - entity: sensor.temperatura_soggiorno
    name: Temperatura
    icon: mdi:thermometer
  - entity: sensor.humidity_bagno
    name: Umidità Bagno
    icon: mdi:water-percent
  - entity: binary_sensor.porta_ingresso
    name: Porta Ingresso
    icon: mdi:door
  - entity: binary_sensor.finestra_cucina
    name: Finestra Cucina
    icon: mdi:window-closed
```

## Come funziona

La card usa la **history REST API** di Home Assistant:

```
GET /api/history/period/{start}
  ?filter_entity_id={entity_ids}
  &end_time={end}
  &minimal_response=true
  &significant_changes_only=false
```

Lo storico viene recuperato una volta al caricamento della card, e di nuovo ogni volta che cambia il pill intervallo temporale. La card **non si aggiorna automaticamente** — usa gli aggiornamenti di stato integrati di HA per i badge stato corrente.

---
---

# WeSmart History Card

A custom Home Assistant history graph card styled after the **Anthropic WeSmart AI** aesthetic.
Replaces the default HA History Graph card with an improved, interactive version.
Supports **dark**, **light**, and **auto** themes.

## Preview

### Dark theme
Deep warm charcoal background, orange accent. Timeline bar for binary sensors, smooth line chart with gradient fill for numeric sensors.

### Light theme
Warm cream/white background (`#FFFEFA`), same orange accent `#D97757`, clean minimal look.

## Features

- **Automatic chart type detection:**
  - Binary entities (light, switch, binary_sensor…) → **orange timeline bar** showing on/off periods
  - Numeric entities (sensor…) → **SVG line chart** with gradient fill under the curve
- **Interactive time range pills** in-card: `1h` · `6h` · `24h` · `7d`
- **Current state badge** next to each entity name (orange when on/active)
- **Summary stat** per entity:
  - Binary: `Attivo 45%` — percentage of time the entity was active in the selected range
  - Numeric: `18.2 – 23.5 °C` — min/max in the selected range
- **Time axis labels** below each graph (HH:MM for ≤ 48h, weekday+day for 7d)
- Animated loader bar while fetching history
- Tap a row → opens **More Info** dialog
- Unavailable entities shown dimmed and non-interactive
- Three theme modes: `dark`, `light`, `auto`

## Installation

1. Copy `wesmart-history-card.js` to:
   ```
   config/www/wesmart-history-card.js
   ```

2. In Home Assistant → **Settings → Dashboards → Resources**, add:
   ```
   /local/wesmart-history-card.js   (JavaScript module)
   ```

3. Hard refresh the browser (`Cmd+Shift+R` / `Ctrl+Shift+R`).

## Configuration

```yaml
type: custom:wesmart-history-card
title: Storico Casa
entities:
  - light.soggiorno
  - sensor.temperatura_cucina
  - binary_sensor.porta_ingresso
```

### All options

| Option     | Type   | Default           | Description                               |
|------------|--------|-------------------|-------------------------------------------|
| `title`    | string | `'History'`       | Card heading                              |
| `icon`     | string | `mdi:chart-line`  | Header icon (mdi:*)                       |
| `theme`    | string | `'dark'`          | `dark` \| `light` \| `auto`              |
| `hours`    | number | `24`              | Default time range (1 · 6 · 24 · 168)    |
| `entities` | list   | —                 | **Required.** List of entities to display |

### Entity format

Each item in `entities` can be a plain string or an object:

```yaml
entities:
  - light.soggiorno                        # simple string
  - entity: sensor.temperatura_cucina      # object with overrides
    name: Temperatura Cucina
    icon: mdi:thermometer
  - entity: binary_sensor.porta_ingresso
    name: Porta Ingresso
    icon: mdi:door
```

| Entity field | Type   | Default | Description                            |
|--------------|--------|---------|----------------------------------------|
| `entity`     | string | —       | Entity ID (any domain)                 |
| `name`       | string | auto    | Override display name                  |
| `icon`       | string | auto    | Override icon (mdi:*)                  |

### Supported entity domains (auto icon)

| Domain          | Auto icon              |
|-----------------|------------------------|
| `light`         | `mdi:lightbulb`        |
| `switch`        | `mdi:toggle-switch`    |
| `sensor`        | `mdi:chart-line`       |
| `binary_sensor` | `mdi:motion-sensor`    |
| `climate`       | `mdi:thermometer`      |
| `cover`         | `mdi:garage`           |
| `fan`           | `mdi:fan`              |
| `media_player`  | `mdi:cast`             |
| `input_boolean` | `mdi:toggle-switch`    |

## Chart types

### Timeline bar (binary)

Rendered for entities whose history contains non-numeric states (`on`/`off`, `open`/`closed`, `detected`/`clear`, etc.).

- **Orange** segment = active/on state (`on`, `open`, `detected`, `unlocked`, `wet`, `active`, `home`, `playing`)
- **Dark** segment = inactive/off state
- Stat: `Attivo X%` — percentage of the selected range spent in active state

### Line chart (numeric)

Rendered for entities whose history contains only numeric states.

- SVG path with orange stroke (`#D97757`, 1.5px)
- Gradient fill from orange (38% opacity) to transparent
- Y axis auto-scaled to min/max of values in range
- Stat: `min – max unit` (e.g., `18.2 – 23.5 °C`)

## Theme examples

```yaml
# Dark (default)
theme: dark

# Light (warm cream)
theme: light

# Follows system prefers-color-scheme
theme: auto
```

## Full example

```yaml
type: custom:wesmart-history-card
title: Storico Casa
icon: mdi:chart-line
theme: dark
hours: 24
entities:
  - entity: light.soggiorno
    name: Soggiorno
  - entity: light.cucina
    name: Cucina
  - entity: sensor.temperatura_soggiorno
    name: Temperatura
    icon: mdi:thermometer
  - entity: sensor.humidity_bagno
    name: Umidità Bagno
    icon: mdi:water-percent
  - entity: binary_sensor.porta_ingresso
    name: Porta Ingresso
    icon: mdi:door
  - entity: binary_sensor.finestra_cucina
    name: Finestra Cucina
    icon: mdi:window-closed
```

## How it works

The card uses the Home Assistant **history REST API**:

```
GET /api/history/period/{start}
  ?filter_entity_id={entity_ids}
  &end_time={end}
  &minimal_response=true
  &significant_changes_only=false
```

History is fetched once when the card loads, and again each time the time range pill changes. The card does **not** auto-refresh — use HA's built-in state updates for current state badges.
