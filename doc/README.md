# Claude Custom Cards — Home Assistant

A collection of custom cards for Home Assistant Dashboard, styled after the **Anthropic Claude AI** aesthetic: warm charcoal dark theme, orange accent, minimal typography.

---

## Cards

| Card | File | Entity type | Theme |
|------|------|-------------|-------|
| [Claude Light Card](#claude-light-card) | `Light/claude-light-card.js` | `light.*` | Dark only |
| [Claude Lights Card](#claude-lights-card) | `Lights/claude-lights-card.js` | `light.*` (multi) | Dark / Light / Auto |
| [Claude Climate Card](#claude-climate-card) | `Climate/claude-climate-card.js` | `climate.*` | Dark only |
| [Claude Sensors Card](#claude-sensors-card) | `Sensors/claude-sensors-card.js` | `sensor.*` (multi) | Dark / Light / Auto |
| [Claude Doors Card](#claude-doors-card) | `Doors/claude-doors-card.js` | `binary_sensor.*` (multi) | Dark / Light / Auto |
| [Claude History Card](#claude-history-card) | `History/claude-history-card.js` | any (multi) | Dark / Light / Auto |

---

## Installation

### 1. Copy files

Copy the `.js` file of each card you want to use into `config/www/`:

```
config/www/claude-light-card.js
config/www/claude-lights-card.js
config/www/claude-climate-card.js
config/www/claude-sensors-card.js
config/www/claude-doors-card.js
config/www/claude-history-card.js
```

### 2. Add resources

In Home Assistant → **Settings → Dashboards → Resources**, add one entry per card:

| URL | Type |
|-----|------|
| `/local/claude-light-card.js` | JavaScript module |
| `/local/claude-lights-card.js` | JavaScript module |
| `/local/claude-climate-card.js` | JavaScript module |
| `/local/claude-sensors-card.js` | JavaScript module |
| `/local/claude-doors-card.js` | JavaScript module |
| `/local/claude-history-card.js` | JavaScript module |

### 3. Reload

Hard refresh the browser: `Cmd+Shift+R` (macOS) / `Ctrl+Shift+R` (Windows/Linux).

---

## Design Tokens

All cards share the same CSS custom properties:

| Token | Value | Usage |
|-------|-------|-------|
| `--claude-bg` | `#1C1917` | Page background |
| `--claude-surface` | `#292524` | Card background |
| `--claude-surface-2` | `#332E2A` | Inner surfaces, sliders |
| `--claude-border` | `rgba(255,255,255,0.08)` | Borders |
| `--claude-orange` | `#D97757` | Primary accent |
| `--claude-blue` | `#60B4D8` | Cooling accent (climate) |
| `--claude-text` | `#F5F0EB` | Primary text |
| `--claude-text-muted` | `#A09080` | Secondary text |
| `--claude-text-dim` | `#6B5F56` | Tertiary text, labels |
| `--claude-radius` | `20px` | Card border radius |
| `--claude-radius-sm` | `12px` | Inner elements |
| `--claude-radius-xs` | `8px` | Buttons, small elements |

**Light theme** (claude-lights-card, claude-sensors-card, claude-doors-card, claude-history-card):

| Token | Value |
|-------|-------|
| `--bg` | `#FFFEFA` |
| `--surface` | `#F5F0EB` |
| `--border` | `rgba(28,25,23,0.09)` |
| `--text` | `#1C1917` |

---

## Architecture

All cards follow the same pattern:

```
Single JS file
  └─ class extends HTMLElement
      ├─ attachShadow({ mode: 'open' })    → isolated DOM + styles
      ├─ setConfig(config)                 → parse YAML config, call _render()
      ├─ set hass(hass)                    → receive state updates, call _updateState()
      ├─ _render()                         → inject <style> + card HTML into shadow DOM
      ├─ _updateState()                    → update DOM from hass.states
      └─ _bindEvents()                     → attach click/pointer listeners

customElements.define('claude-*-card', ...)
window.customCards.push({ type, name, description })
```

No build step. No dependencies. Pure vanilla JS.

---

## Claude Light Card

Single light entity with full controls.

```yaml
type: custom:claude-light-card
entity: light.living_room
```

**Options:**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `entity` | string | — | **Required.** `light.*` entity |
| `name` | string | auto | Override display name |
| `icon` | string | auto | Override icon (mdi:*) |
| `show_brightness` | boolean | `true` | Brightness slider |
| `show_color_temp` | boolean | `true` | Color temperature slider |
| `show_color` | boolean | `true` | Color preset palette (8 presets) |

**Features:** toggle · brightness slider · color temp slider · 8 color presets · pulse glow when on · unavailable overlay

**Auto-detects** capabilities from `supported_color_modes` — sliders only appear if the light supports them.

---

## Claude Lights Card

Multiple light entities in a compact list with individual toggles.

```yaml
type: custom:claude-lights-card
title: Living Room
theme: dark
entities:
  - light.ceiling
  - entity: light.floor_lamp
    name: Floor Lamp
    icon: mdi:floor-lamp
```

**Options:**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `title` | string | `'Lights'` | Card heading |
| `icon` | string | `mdi:lightbulb-group` | Header icon |
| `theme` | string | `'dark'` | `dark` \| `light` \| `auto` |
| `entities` | list | — | **Required.** Light entity list |

**Entity item fields:** `entity` (req) · `name` · `icon`

**Features:** master toggle · per-row toggle · state text (brightness + CT) · "N of M on" subtitle · tap row → More Info · unavailable dimming

**Themes:**
- `dark` — warm charcoal (default)
- `light` — warm cream `#FFFEFA`
- `auto` — follows system `prefers-color-scheme`

---

## Claude Climate Card

Single climate entity with temperature controls and mode selector.

```yaml
type: custom:claude-climate-card
entity: climate.living_room
```

**Options:**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `entity` | string | — | **Required.** `climate.*` entity |
| `name` | string | auto | Override display name |
| `icon` | string | auto | Override icon |
| `show_fan_mode` | boolean | `true` | Fan mode pills |
| `temp_step` | number | auto | Temperature step (e.g. `0.5`) |

**Features:** large current temp display · humidity badge · target temp with +/- buttons · HVAC mode pills · fan mode pills · heat/cool dual glow · unavailable overlay

**HVAC modes:** `off` · `heat` (orange glow) · `cool` (blue glow) · `heat_cool` (range display) · `auto` · `dry` · `fan_only`

**Auto-detects** `hvac_modes` and `fan_modes` from entity attributes — only supported modes are shown.

---

## Claude Sensors Card

Multiple sensor entities in a compact list with value badges and alert highlighting.

```yaml
type: custom:claude-sensors-card
title: Sensori Casa
theme: dark
entities:
  - sensor.temperature_soggiorno
  - sensor.humidity_soggiorno
  - entity: sensor.co2_cucina
    name: CO₂ Cucina
    alert_above: 800
  - entity: sensor.battery_door
    name: Batteria porta
```

**Options:**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `title` | string | `'Sensors'` | Card heading |
| `icon` | string | `mdi:chart-line` | Header icon |
| `theme` | string | `'dark'` | `dark` \| `light` \| `auto` |
| `entities` | list | — | **Required.** Sensor entity list |

**Entity item fields:**

| Field | Type | Description |
|-------|------|-------------|
| `entity` | string | **Required.** `sensor.*` entity |
| `name` | string | Override display name |
| `icon` | string | Override icon (mdi:*) |
| `device_class` | string | Force device class (auto-detected if omitted) |
| `unit` | string | Override unit of measurement |
| `color` | string | Override accent color (hex) |
| `meta` | string | Override the type label below the name |
| `alert_above` | number | Alert if value exceeds this threshold |
| `alert_below` | number | Alert if value drops below this threshold |

**Features:** value badge with unit · color per `device_class` · built-in alert thresholds · custom thresholds · "N alerts" header subtitle · tap row → More Info · unavailable dimming

**Built-in alert thresholds** (triggered unless overridden):

| device_class | Alert condition |
|---|---|
| `temperature` | < 10 °C or > 30 °C |
| `humidity` | < 30 % or > 70 % |
| `co2` | > 1000 ppm |
| `battery` | < 20 % |

**Supported device classes** (with auto icon + color):
`temperature` · `humidity` · `pressure` · `co2` · `pm25` · `pm10` · `illuminance` · `battery` · `voltage` · `current` · `power` · `energy` · `gas` · `water` · `signal_strength` · `moisture` · `aqi` · `speed` · `wind_speed`

**Themes:** `dark` · `light` · `auto` (same as Lights card)

---

## Claude Doors Card

Multiple door / window / contact binary sensors in a list with open/closed status pills.

```yaml
type: custom:claude-doors-card
title: Porte & Finestre
theme: dark
entities:
  - binary_sensor.porta_ingresso
  - binary_sensor.finestra_cucina
  - entity: binary_sensor.garage
    name: Garage
    device_class: garage_door
```

**Options:**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `title` | string | `'Doors & Windows'` | Card heading |
| `icon` | string | `mdi:door` | Header icon |
| `theme` | string | `'dark'` | `dark` \| `light` \| `auto` |
| `entities` | list | — | **Required.** Binary sensor entity list |

**Entity item fields:**

| Field | Type | Description |
|-------|------|-------------|
| `entity` | string | **Required.** `binary_sensor.*` entity |
| `name` | string | Override display name |
| `icon` | string | Override icon (mdi:*) |
| `device_class` | string | Force device class (auto-detected if omitted) |

**Features:** Open/Closed status pill (orange / green) · open rows highlighted · header shows "N open" or "All closed" · per-class icon pairs (open/closed variants) · tap row → More Info · unavailable dimming

**Supported device classes:**

| device_class | Open label | Closed label |
|---|---|---|
| `door` | Open | Closed |
| `window` | Open | Closed |
| `garage_door` | Open | Closed |
| `opening` | Open | Closed |
| `lock` | Unlocked | Locked |
| `motion` | Detected | Clear |
| `vibration` | Detected | Clear |
| `moisture` | Wet | Dry |
| `smoke` | Detected | Clear |
| `gas` | Detected | Clear |

> `binary_sensor` state `on` = open/active · `off` = closed/clear

**Themes:** `dark` · `light` · `auto`

---

## Claude History Card

Multi-entity history graph card. Replaces the default HA History Graph with an improved, interactive version.

```yaml
type: custom:claude-history-card
title: Storico Casa
theme: dark
hours: 24
entities:
  - light.soggiorno
  - sensor.temperatura_cucina
  - entity: binary_sensor.porta_ingresso
    name: Porta Ingresso
```

**Options:**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `title` | string | `'History'` | Card heading |
| `icon` | string | `mdi:chart-line` | Header icon |
| `theme` | string | `'dark'` | `dark` \| `light` \| `auto` |
| `hours` | number | `24` | Default time range (`1` · `6` · `24` · `168`) |
| `entities` | list | — | **Required.** Any entity type |

**Entity item fields:** `entity` (req) · `name` · `icon`

**Chart types (auto-detected):**
- **Binary** entities (`on`/`off`, `open`/`closed`, …) → orange **timeline bar** — active periods in orange, inactive in dark
- **Numeric** entities (`sensor.*`, …) → **SVG line chart** with gradient fill

**Features:**
- Interactive time pills in-card: `1h` · `6h` · `24h` · `7d`
- Current state badge per entity (orange when active)
- Summary stat: `Attivo X%` for binary · `min – max unit` for numeric
- Time axis labels (HH:MM for ≤ 48h, weekday for 7d)
- Animated loader during fetch
- Tap row → More Info

**Themes:** `dark` · `light` · `auto`

---

## Project Structure

```
custom card home assistant/
├── doc/
│   └── README.md            ← this file
├── Light/
│   ├── claude-light-card.js
│   └── README.md
├── Lights/
│   ├── claude-lights-card.js
│   └── README.md
├── Climate/
│   ├── claude-climate-card.js
│   └── README.md
├── Sensors/
│   ├── claude-sensors-card.js
│   └── README.md
├── Doors/
│   ├── claude-doors-card.js
│   └── README.md
└── History/
    ├── claude-history-card.js
    └── README.md
```
