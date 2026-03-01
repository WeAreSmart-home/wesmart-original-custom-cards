# WeSmart Custom Cards — Home Assistant

A collection of custom cards for Home Assistant Dashboard, styled after the **Anthropic WeSmart AI** aesthetic: warm charcoal dark theme, orange accent, minimal typography.

---

## Cards

| Card | File | Entity type | Theme |
|------|------|-------------|-------|
| [**WeSmart Commander Hub**](#wesmart-commander-hub) | `Hub/wesmart-commander-hub.js` | **Hub / multi** | Dark / Light / Auto |
| [WeSmart Light Card](#wesmart-light-card) | `Light/wesmart-light-card.js` | `light.*` | Dark / Light / Auto |
| [WeSmart Lights Card](#wesmart-lights-card) | `Lights/wesmart-lights-card.js` | `light.*` (multi) | Dark / Light / Auto |
| [WeSmart Lights Expand Card](#wesmart-lights-expand-card) | `Lights/wesmart-lights-expand-card.js` | `light.*` (multi) | Dark / Light / Auto |
| [WeSmart Climate Card](#wesmart-climate-card) | `Climate/wesmart-climate-card.js` | `climate.*` | Dark / Light / Auto |
| [WeSmart Climate Compact Card](#wesmart-climate-compact-card) | `Climate/wesmart-climate-compact-card.js` | `climate.*` (multi) | Dark / Light / Auto |
| [WeSmart Sensors Card](#wesmart-sensors-card) | `Sensors/wesmart-sensors-card.js` | `sensor.*` (multi) | Dark / Light / Auto |
| [WeSmart Doors Card](#wesmart-doors-card) | `Doors/wesmart-doors-card.js` | `binary_sensor.*` (multi) | Dark / Light / Auto |
| [WeSmart History Card](#wesmart-history-card) | `History/wesmart-history-card.js` | any (multi) | Dark / Light / Auto |
| [WeSmart Buttons Bar Card](#wesmart-buttons-bar-card) | `Buttons/wesmart-buttons-bar-card.js` | any / service | Dark / Light / Auto |
| [WeSmart Buttons Grid Card](#wesmart-buttons-grid-card) | `Buttons/wesmart-buttons-grid-card.js` | any / service | Dark / Light / Auto |
| [WeSmart Battery Status Card](#wesmart-battery-status-card) | `Battery/wesmart-battery-status-card.js` | `sensor.*` (multi) | Dark / Light / Auto |
| [WeSmart Switches Card](#wesmart-switches-card) | `Switches/wesmart-switches-card.js` | `switch.*` (multi) | Dark / Light / Auto |
| [WeSmart Clock Card](#wesmart-clock-card) | `Clock/wesmart-clock-card.js` | any (max 3 extras) | Dark / Light / Auto |

---

## Installation

### 1. Copy files

Copy the `.js` file of each card you want to use into `config/www/`:

```
config/www/wesmart-commander-hub.js
config/www/wesmart-light-card.js
config/www/wesmart-lights-card.js
config/www/wesmart-lights-expand-card.js
config/www/wesmart-climate-card.js
config/www/wesmart-climate-compact-card.js
config/www/wesmart-sensors-card.js
config/www/wesmart-doors-card.js
config/www/wesmart-history-card.js
config/www/wesmart-buttons-bar-card.js
config/www/wesmart-buttons-grid-card.js
config/www/wesmart-battery-status-card.js
config/www/wesmart-switches-card.js
config/www/wesmart-clock-card.js
```

### 2. Add resources

In Home Assistant → **Settings → Dashboards → Resources**, add one entry per card:

| URL | Type |
|-----|------|
| `/local/wesmart-commander-hub.js` | JavaScript module |
| `/local/wesmart-light-card.js` | JavaScript module |
| `/local/wesmart-lights-card.js` | JavaScript module |
| `/local/wesmart-lights-expand-card.js` | JavaScript module |
| `/local/wesmart-climate-card.js` | JavaScript module |
| `/local/wesmart-climate-compact-card.js` | JavaScript module |
| `/local/wesmart-sensors-card.js` | JavaScript module |
| `/local/wesmart-doors-card.js` | JavaScript module |
| `/local/wesmart-history-card.js` | JavaScript module |
| `/local/wesmart-buttons-bar-card.js` | JavaScript module |
| `/local/wesmart-buttons-grid-card.js` | JavaScript module |
| `/local/wesmart-battery-status-card.js` | JavaScript module |
| `/local/wesmart-switches-card.js` | JavaScript module |
| `/local/wesmart-clock-card.js` | JavaScript module |

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

## WeSmart Commander Hub

The flagship central dashboard card. Features a smart greeting, tabbed navigation, and automated system alerts.

```yaml
type: custom:wesmart-commander-hub
title: System Overview
entities:
  - light.living_room
  - switch.kettle
stats:
  - sensor.outdoor_temperature
  - sensor.energy_consumption
```

**Tabs:**
- **Summary**: Auto-scans for active lights, unlocked doors, and low batteries.
- **Controls**: Quick access to your favorite toggles.
- **Sensors**: Environmental tracking and statistics.

**Features:**
- Real-time greeting and clock.
- Premium glassmorphic UI with radial glow effects.
- Unified alert system.

---

## WeSmart Light Card

Single light entity with full controls.

```yaml
type: custom:wesmart-light-card
entity: light.living_room
```

**Options:**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `entity` | string | — | **Required.** `light.*` entity |
| `name` | string | auto | Override display name |
| `icon` | string | auto | Override icon (mdi:*) |
| `theme` | string | `'dark'` | `dark` \| `light` \| `auto` |
| `show_brightness` | boolean | `true` | Brightness slider |
| `show_color_temp` | boolean | `true` | Color temperature slider |
| `show_color` | boolean | `true` | Color preset palette (8 presets) |

**Features:** toggle · brightness slider · color temp slider · 8 color presets · pulse glow when on · unavailable overlay

**Auto-detects** capabilities from `supported_color_modes` — sliders only appear if the light supports them.

**Themes:** `dark` · `light` · `auto`

---

## WeSmart Lights Card

Multiple light entities in a compact list with individual toggles.

```yaml
type: custom:wesmart-lights-card
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

## WeSmart Lights Expand Card

Same list layout as WeSmart Lights Card, but clicking a row **expands an inline panel** with animated brightness and color-temperature sliders — without leaving the dashboard.

```yaml
type: custom:wesmart-lights-expand-card
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

**Features:**
- Master toggle (all on/off) · per-row toggle
- Click anywhere on a row (outside the toggle) → **animated expand panel**
- Only one panel open at a time; clicking the same row again collapses it
- Expand panel shows:
  - **Brightness slider** — visible only when light is on and supports brightness
  - **Color-temp slider** — warm→cool gradient track, visible only when `color_temp` is available
  - "Turn on to adjust" hint when light is off
- Slider drag applies changes to HA on pointer release
- Header subtitle: "N of M on" / "All on" / "All off"
- Unavailable entities dimmed and non-interactive

**Animations:**

| Element | Effect |
|---------|--------|
| Chevron icon | Rotates 180° on expand (`transform` + `cubic-bezier`) |
| Panel | Accordion: `max-height` + `opacity` transition |
| Panel content | Slides up into view (`translateY`) |
| Slider thumb | Glow ring while dragging |
| Panel border | Fades in as panel opens |

**Themes:** `dark` · `light` · `auto`

---

## WeSmart Climate Card

Single climate entity with temperature controls and mode selector.

```yaml
type: custom:wesmart-climate-card
entity: climate.living_room
```

**Options:**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `entity` | string | — | **Required.** `climate.*` entity |
| `name` | string | auto | Override display name |
| `icon` | string | auto | Override icon |
| `theme` | string | `'dark'` | `dark` \| `light` \| `auto` |
| `show_fan_mode` | boolean | `true` | Fan mode pills |
| `temp_step` | number | auto | Temperature step (e.g. `0.5`) |

**Features:** large current temp display · humidity badge · target temp with +/- buttons · HVAC mode pills · fan mode pills · heat/cool dual glow · unavailable overlay

**Themes:** `dark` · `light` · `auto`

**HVAC modes:** `off` · `heat` (orange glow) · `cool` (blue glow) · `heat_cool` (range display) · `auto` · `dry` · `fan_only`

**Auto-detects** `hvac_modes` and `fan_modes` from entity attributes — only supported modes are shown.

---

## WeSmart Sensors Card

Multiple sensor entities in a compact list with value badges and alert highlighting.

```yaml
type: custom:wesmart-sensors-card
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

## WeSmart Doors Card

Multiple door / window / contact binary sensors in a list with open/closed status pills.

```yaml
type: custom:wesmart-doors-card
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

## WeSmart History Card

Multi-entity history graph card. Replaces the default HA History Graph with an improved, interactive version.

```yaml
type: custom:wesmart-history-card
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

## WeSmart Buttons Bar Card

Compact horizontal bar of action buttons. Low height, full width — ideal for quick-access rows.

```yaml
type: custom:wesmart-buttons-bar-card
theme: dark
title: Quick Actions   # optional
buttons:
  - name: Lights
    icon: mdi:lightbulb
    entity: light.soggiorno
  - name: Film
    icon: mdi:movie-open
    service: scene.turn_on
    service_data:
      entity_id: scene.serata_film
  - name: TV
    icon: mdi:television
    entity: switch.tv
```

**Options:**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `theme` | string | `'dark'` | `dark` \| `light` \| `auto` |
| `title` | string | — | Optional small label above buttons |
| `buttons` | list | — | **Required.** Button list |

**Button item fields:**

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Button label |
| `icon` | string | MDI icon (e.g. `mdi:lightbulb`) |
| `entity` | string | Optional entity for state tracking + default toggle action |
| `service` | string | Optional service to call (`domain.service`) |
| `service_data` | object | Optional data passed to the service |

**Action logic (inferred):**
- `entity` only → calls `homeassistant.toggle` on click
- `service` only → calls the service; no active state (press animation on click)
- Both → calls the service; entity tracks the active/inactive color
- Neither → decorative button only

**State colors:**
- **Active** (`on`, `open`, `unlocked`, `detected`, `playing`, `armed_*`, …): orange background + orange icon/label + glow
- **Inactive**: surface background, muted icon/label
- **Unavailable**: dimmed (opacity 0.35), non-interactive

**Themes:** `dark` · `light` · `auto`

---

## WeSmart Buttons Grid Card

Square-ish card with multiple buttons arranged in an automatic grid. Ideal for rooms with many actions.

```yaml
type: custom:wesmart-buttons-grid-card
title: Casa
icon: mdi:home
theme: dark
columns: 3      # optional — auto-fit if omitted
buttons:
  - name: Luci Soggiorno
    icon: mdi:lightbulb
    entity: light.soggiorno
  - name: Luci Cucina
    icon: mdi:ceiling-light
    entity: light.cucina
  - name: TV
    icon: mdi:television
    entity: switch.tv
  - name: Film
    icon: mdi:movie-open
    service: scene.turn_on
    service_data:
      entity_id: scene.serata_film
  - name: Allarme
    icon: mdi:shield-home
    service: alarm_control_panel.alarm_arm_away
    service_data:
      entity_id: alarm_control_panel.casa
```

**Options:**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `title` | string | — | Optional card heading |
| `icon` | string | `mdi:gesture-tap` | Header icon (used when `title` is set) |
| `theme` | string | `'dark'` | `dark` \| `light` \| `auto` |
| `columns` | number | auto | Force a fixed number of columns; omit for `auto-fill` |
| `buttons` | list | — | **Required.** Button list |

**Button item fields:** same as Bar card (`name`, `icon`, `entity`, `service`, `service_data`)

**Features:**
- Auto-fit grid (columns self-adjust to card width) or fixed column count
- Optional header with icon + title
- Same state logic and colors as Bar card
- Press animation for stateless service buttons

**Themes:** `dark` · `light` · `auto`

---

## WeSmart Switches Card

Multi-entity toggle card with interactive icon control.

```yaml
type: custom:wesmart-switches-card
title: Kitchen Switches
entities:
  - switch.kettle
  - entity: light.counter_light
    name: Under-cabinet
    icon: mdi:led-strip-variant
  - input_boolean.coffee_timer
```

**Options:**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `title` | string | `'Switches'` | Card heading |
| `icon` | string | `mdi:toggle-switch` | Header icon |
| `theme` | string | `'dark'` | `dark` \| `light` \| `auto` |
| `entities` | list | — | **Required.** Switch entities |

**Entity item fields:** `entity` (req) · `name` · `icon`

**Features:**
- **Interactive Icons:** Click the icon to toggle the state; orange glow when ON.
- **State Labels:** Clear ON/OFF pills for at-a-glance status.
- **More Info:** Click the row text to open the HA service dialog.

---

## WeSmart Climate Compact Card

A row-based alternative to the full climate card, optimized for multi-zone management.

```yaml
type: custom:wesmart-climate-compact-card
title: Upstairs Heating
entities:
  - climate.master_bedroom
  - entity: climate.guest_room
    name: Guest
  - climate.bathroom
```

**Options:**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `title` | string | `'Climate Control'` | Card heading |
| `icon` | string | `mdi:thermostat` | Header icon |
| `theme` | string | `'dark'` | `dark` \| `light` \| `auto` |
| `entities` | list | — | **Required.** Climate entities |

**Features:**
- **In-row Controls:** Adjust target temperature using integrated +/- buttons.
- **Current Temperature:** Small badge showing real-time temperature.
- **State Coloring:** Icons glow orange (heating), blue (cooling), or muted.

---

## WeSmart Battery Status Card

Multi-entity battery monitoring card with dynamic icons and visualization options.

```yaml
type: custom:wesmart-battery-status-card
title: Battery Status
display_type: circular  # Visualization: icon | linear | circular
entities:
  - sensor.phone_battery
  - entity: sensor.tablet_battery
    name: Tablet
    display_type: linear  # Linear bar override
  - entity: sensor.watch_battery
    name: Watch
    display_type: icon    # Classic icon override
```

**Options:**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `title` | string | `'Batteries'` | Card heading |
| `icon` | string | `mdi:battery-check` | Header icon |
| `theme` | string | `'dark'` | `dark` \| `light` \| `auto` |
| `display_type` | string | `'icon'` | `icon` \| `linear` \| `circular` |
| `entities` | list | — | **Required.** Battery sensor entities |

**Entity item fields:** `entity` (req) · `name` · `display_type` (override)

**Features:**
- **Visualizations:** 
  - `icon`: Dynamic battery MDI icon (updates every 10%).
  - `linear`: Sleek horizontal progress bar.
  - `circular`: Animated SVG progression ring.
- **Color Coding:** Auto-switches based on level (<15% critical orange, <30% warning yellow, >30% muted green).
- **Summary Header:** Shows "N low" in orange if any battery is ≤ 20%.

---

## WeSmart Clock Card

Sleek ambient clock with optional extra entity info in a bottom bar or left sidebar.

```yaml
type: custom:wesmart-clock-card
theme: dark
extras_layout: sidebar
translate_weather: true
extra_entities:
  - weather.home
  - entity: sensor.outdoor_temperature
    icon: mdi:thermometer-high
  - entity: sensor.humidity
    icon: mdi:water-percent
```

**Options:**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `theme` | string | `'dark'` | `dark` \| `light` \| `auto` |
| `time_format` | number | `24` | `12` or `24` |
| `extras_layout` | string | `'bottom'` | `bottom` \| `sidebar` — position of extra info |
| `translate_weather` | boolean | `false` | Translate `weather.*` states to Italian |
| `extra_entities` | list | `[]` | Up to **3** entities to display |

**Entity item fields:** `entity` (req) · `icon` (custom MDI, ignored for `weather.*`)

**Features:**
- Bottom bar: up to 3 items share the full width equally, no scrolling
- Sidebar: narrow left column (78px), items stacked vertically
- Each item shows **icon + state value only** — no name or label
- Weather entities: icon is automatic (maps from state); optional Italian translation
- Responsive: items always stay inside the card bounds

**Themes:** `dark` · `light` · `auto`

---

## Project Structure

```
custom card home assistant/
├── doc/
│   └── README.md                      ← this file
├── Hub/
    ├── wesmart-commander-hub.js        ← flagship central hub
    └── README.md
├── Light/
│   ├── wesmart-light-card.js
│   └── README.md
├── Lights/
│   ├── wesmart-lights-card.js          ← list with toggles
│   ├── wesmart-lights-expand-card.js   ← list with animated inline sliders
│   └── README.md
├── Climate/
│   ├── wesmart-climate-card.js
│   └── README.md
├── Sensors/
│   ├── wesmart-sensors-card.js
│   └── README.md
├── Doors/
│   ├── wesmart-doors-card.js
│   └── README.md
├── History/
│   ├── wesmart-history-card.js
│   └── README.md
└── Buttons/
    ├── wesmart-buttons-bar-card.js     ← compact horizontal button bar
    ├── wesmart-buttons-grid-card.js    ← square auto-grid of buttons
    └── README.md
└── Battery/
    ├── wesmart-battery-status-card.js  ← multi-entity battery monitor
    └── README.md
├── Switches/
│   ├── wesmart-switches-card.js        ← multi-entity toggle card
│   └── README.md
└── Clock/
    ├── wesmart-clock-card.js           ← ambient clock + bottom/sidebar extras
    └── README.md
```
