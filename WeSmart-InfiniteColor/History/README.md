# WeSmart Infinite Color Card

A custom Home Assistant history graph card with a **dynamic HSL color engine**.
Identical in features to `wesmart-history-card` but generates the entire visual palette
automatically from a single base color you provide in the YAML config.

---

## How the color engine works

You supply one hex color (e.g. `#f73747`). The card:

1. Converts hex → RGB → HSL to extract `{ h, s, l }`
2. Keeps the **hue** (H) as the identity of your color
3. Derives every design token by adjusting saturation and lightness mathematically:

| Token | Dark formula | Light formula |
|-------|-------------|---------------|
| `--accent` | `hsl(H, S, clamp(L, 50, 65)%)` | `hsl(H, S, clamp(L-10, 40, 55)%)` |
| `--accent-soft` | accent + 12% opacity | accent + 12% opacity |
| `--bg` | `hsl(H, clamp(S×0.35, 25, 45)%, 11%)` | `hsl(H, clamp(S×0.05, 3, 8)%, 98%)` |
| `--surface` | `hsl(H, clamp(S×0.28, 20, 38)%, 16%)` | `hsl(H, clamp(S×0.08, 5, 12)%, 93%)` |
| `--text` | `hsl(H, clamp(S×0.08, 5, 10)%, 93%)` | `hsl(H, clamp(S×0.15, 8, 20)%, 10%)` |
| `--text-muted` | `hsl(H, clamp(S×0.12, 8, 15)%, 65%)` | `hsl(H, clamp(S×0.12, 6, 15)%, 38%)` |
| `--text-dim` | `hsl(H, clamp(S×0.10, 6, 12)%, 42%)` | `hsl(H, clamp(S×0.08, 4, 10)%, 58%)` |

The tokens are injected as CSS custom properties on the host element at runtime —
no static CSS palette, no build step.

**Example with `#f73747` (red, H=353 S=93 L=58):**

| Token | Result |
|-------|--------|
| `--accent` | `hsl(353, 93%, 58%)` — vivid red |
| `--bg` | `hsl(353, 33%, 11%)` — very dark red-tinted |
| `--surface` | `hsl(353, 26%, 16%)` — dark red-tinted |
| `--text` | `hsl(353, 8%, 93%)` — near-white with warm tint |

---

## Features

- **Dynamic palette** from any hex color — change one value, the entire card re-themes
- **Automatic chart type detection:**
  - Binary entities (`on`/`off`, `open`/`closed`, …) → accent-colored **timeline bar**
  - Numeric entities (`sensor.*`) → **SVG line chart** with gradient fill
- **Interactive time range pills:** `1h` · `6h` · `24h` · `7d`
- **Current state badge** per entity (accent color when active)
- **Summary stat** per entity:
  - Binary: `Attivo X%` — active time percentage
  - Numeric: `min – max unit`
- **Time axis labels** (HH:MM for ≤ 48h, weekday+day for 7d)
- Animated loader bar while fetching
- Tap a row → opens **More Info** dialog
- Unavailable entities dimmed and non-interactive
- `theme: auto` re-applies palette live on system preference change

---

## Installation

1. Copy `wesmart-infinite-color-card.js` to:
   ```
   config/www/wesmart-infinite-color-card.js
   ```

2. In Home Assistant → **Settings → Dashboards → Resources**, add:
   ```
   /local/wesmart-infinite-color-card.js   (JavaScript module)
   ```

3. Hard refresh the browser (`Cmd+Shift+R` / `Ctrl+Shift+R`).

---

## Configuration

```yaml
type: custom:wesmart-infinite-color-card
color: '#f73747'
title: Storico Casa
theme: dark
hours: 24
entities:
  - light.soggiorno
  - sensor.temperatura_cucina
  - binary_sensor.porta_ingresso
```

### All options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `color` | string | `'#D97757'` | **Base color hex** — drives the entire palette |
| `title` | string | `'History'` | Card heading |
| `icon` | string | `mdi:chart-line` | Header icon (mdi:*) |
| `theme` | string | `'dark'` | `dark` \| `light` \| `auto` |
| `hours` | number | `24` | Default time range (1 · 6 · 24 · 168) |
| `entities` | list | — | **Required.** List of entities to display |

> `color` defaults to `#D97757` (WeSmart orange) — identical to the original history card.

### Entity format

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

| Entity field | Type | Default | Description |
|---|---|---|---|
| `entity` | string | — | Entity ID (any domain) |
| `name` | string | auto | Override display name |
| `icon` | string | auto | Override icon (mdi:*) |

---

## Color examples

```yaml
# Red card
color: '#f73747'

# Blue card
color: '#3b82f6'

# Green card
color: '#10b981'

# Purple card
color: '#a855f7'

# Default WeSmart orange (identical to original history card)
color: '#D97757'
```

---

## Theme examples

```yaml
# Dark (default) — very dark background, saturated with hue
theme: dark

# Light — near-white background with light hue tint
theme: light

# Follows system prefers-color-scheme, updates live
theme: auto
```

---

## Full example

```yaml
type: custom:wesmart-infinite-color-card
title: Storico Casa
icon: mdi:chart-line
color: '#3b82f6'
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

---

## How it works (API)

The card uses the Home Assistant **history REST API**:

```
GET /api/history/period/{start}
  ?filter_entity_id={entity_ids}
  &end_time={end}
  &minimal_response=true
  &significant_changes_only=false
```

History is fetched once on load and again on every time range change.
The card does **not** auto-refresh — current state badges update via the `hass` setter.
