# WeSmart Custom Cards — Home Assistant

A collection of custom Lovelace cards for Home Assistant, inspired by the **WeSmart AI** aesthetic: warm charcoal dark theme, orange accent, minimal typography. No build step. No dependencies. Pure vanilla JS.

---

## Collections

| | Collection | Cards | Status |
|---|---|---|---|
| ◆ | **WeSmart InfiniteColor** | 14 | Production-ready |
| ■ | **WeSmart Original** | 17 | Production-ready |
| ⚗️ | **WeSmart Labs** | 4 | Experimental |

---

## Preview

![Lights Cards](asset/images/lights-cards.webp)
![Sensors](asset/images/sensor.webp)
![Climate Cards](asset/images/climate-e-compact-cards.webp)

---

## Installation

### 1. Copy files
Copy the `.js` file of each card you want into `config/www/`.

### 2. Add resources
In Home Assistant → **Settings → Dashboards → Resources**, add one entry per file:
- **URL**: `/local/wesmart-light-card.js` (adjust filename)
- **Type**: `JavaScript module`

### 3. Reload
Hard refresh: `Cmd+Shift+R` (macOS) · `Ctrl+Shift+R` (Windows/Linux)

---

---

## ◆ WeSmart InfiniteColor

A chromatic engine that generates a complete visual palette from a single hex color defined in YAML. Every background, surface, text shade, accent, shadow, and multi-entity line color is automatically derived — no hardcoded values anywhere.

```yaml
color: '#60B4D8'  ──→  accent, accent-soft
                  ──→  bg, surface, border
                  ──→  text, text-muted, text-dim
                  ──→  shadow, row-hover, pill-bg
```

Themes `dark`, `light`, and `auto` (follows OS `prefers-color-scheme` in real time) are supported by every card.

![Clock and Light InfiniteColor](asset/images/clock-e-light-cards-infinite.png)
![History Card — Blue Theme](asset/images/history-cards-blue.png)

<details>
<summary>More InfiniteColor previews</summary>

![History Card — Yellow Dark](asset/images/history-cards-yellow-dark.png)
![History Card — Yellow Light](asset/images/history-cards-yellow-light.png)

</details>

Pick any hex color and all InfiniteColor cards instantly adapt:

| Input color | Palette |
|---|---|
| `'#D97757'` | Orange/charcoal — WeSmart default |
| `'#60B4D8'` | Cool blue — ideal for climate/temperature |
| `'#7CB87A'` | Green — ideal for doors/security |
| `'#A78BFA'` | Purple — ideal for scenes/automations |
| `'#F59E0B'` | Amber/gold — ideal for sensors/battery |
| `'#EC4899'` | Pink |
| `'#14B8A6'` | Teal/seafoam |

### Cards

| Card | YAML Tag | Entities |
|------|----------|---------|
| Infinite Chart | `wesmart-infinite-chart-card` | any (single or multi) |
| History | `wesmart-infinite-history-card` | any (multi) |
| Lights | `wesmart-infinite-lights-card` | `light.*` (multi) |
| Lights Expand | `wesmart-infinite-lights-expand-card` | `light.*` (multi, expandable) |
| Light | `wesmart-infinite-light-card` | `light.*` (single) |
| Climate | `wesmart-infinite-climate-card` | `climate.*` (single) |
| Climate Compact | `wesmart-infinite-climate-compact-card` | `climate.*` (multi) |
| Sensors | `wesmart-infinite-sensors-card` | `sensor.*` (multi) |
| Doors | `wesmart-infinite-doors-card` | `binary_sensor.*` (multi) |
| Switches | `wesmart-infinite-switches-card` | `switch.*` (multi) |
| Battery | `wesmart-infinite-battery-card` | `sensor.*` battery (multi) |
| Buttons Bar | `wesmart-infinite-buttons-bar-card` | any / service |
| Buttons Grid | `wesmart-infinite-buttons-grid-card` | any / service |
| Clock | `wesmart-infinite-clock-card` | any (max 3 extras) |

**→ [Full InfiniteColor documentation](WeSmart-InfiniteColor/README.md)**

---

---

## ■ WeSmart Original

Fixed warm charcoal palette (`#D97757` accent). 17 production-ready cards.

| Token | Dark | Light |
|-------|------|-------|
| Background | `#292524` | `#FFFEFA` |
| Surface | `#332E2A` | `#F5F0EB` |
| Accent | `#D97757` | `#D97757` |
| Border | `rgba(255,255,255,0.08)` | `rgba(28,25,23,0.09)` |

### Cards

| Card | YAML Tag | Entities |
|------|----------|---------|
| Chart | `wesmart-chart-card` | any (single or multi) |
| History | `wesmart-history-card` | any (multi) |
| Light | `wesmart-light-card` | `light.*` (single) |
| Lights | `wesmart-lights-card` | `light.*` (multi) |
| Lights Expand | `wesmart-lights-expand-card` | `light.*` (multi, expandable) |
| Climate | `wesmart-climate-card` | `climate.*` (single) |
| Climate Compact | `wesmart-climate-compact-card` | `climate.*` (multi) |
| Sensors | `wesmart-sensors-card` | `sensor.*` (multi) |
| Doors | `wesmart-doors-card` | `binary_sensor.*` (multi) |
| Switches | `wesmart-switches-card` | `switch.*` (multi) |
| Battery Status | `wesmart-battery-status-card` | `sensor.*` battery (multi) |
| Buttons Bar | `wesmart-buttons-bar-card` | any / service |
| Buttons Grid | `wesmart-buttons-grid-card` | any / service |
| Clock | `wesmart-clock-card` | any (max 3 extras) |
| Weather | `wesmart-weather-card` | `weather.*` |
| Energy Flow | `wesmart-energy-flow-card` | `sensor.*` power/energy |
| Media Player | `wesmart-media-player-card` | `media_player.*` |

### Highlights

**Chart Card** — Single or multi-entity chart with drag-to-zoom, tooltip hover, and time range pills. Auto-detects line/area for numeric sensors, timeline bars for binary sensors.

![Chart Preview](asset/images/graph.png)

```yaml
type: custom:wesmart-chart-card
title: Temperature
color: '#D97757'
theme: dark
hours: 24
entities:
  - entity: sensor.temperatura_soggiorno
    name: Living Room
  - entity: sensor.temperatura_cucina
    name: Kitchen
```

**Weather Card** — Current conditions, hourly or daily forecast strip, stats bar. Fetches forecasts via WebSocket API (HA 2023.9+).

![Weather Card](asset/images/meteo-card.png)
![Weather Forecast](asset/images/meteo-forecast.png)

**Energy Flow Card** — Real-time energy flow: grid, solar, battery, home consumption. All source nodes optional except `home_power`.

![Energy Flow](asset/images/energy-card.png)

**Media Player Card** — Blurred album art background, animated progress bar, full transport controls, volume slider, source selector.

![Media Player](asset/images/media-player-cards.png)

**Lights / Lights Expand** — Compact light list; the Expand variant shows inline brightness + CT sliders per row.

![Lights](asset/images/lights-cards.webp)

**Climate / Climate Compact** — Target temperature, HVAC modes, fan speed. Compact version lists multiple thermostats.

![Climate](asset/images/climate-e-compact-cards.webp)

**Sensors & Doors** — Environmental sensors with alert thresholds; binary sensors with colored status pills.

![Sensors](asset/images/sensor.webp)
![Doors](asset/images/doors.webp)

**Battery Status** — Circular SVG rings or linear bars, color-coded: green · amber warning · orange critical.

![Battery](asset/images/battery-cards.webp)

**Buttons Bar & Grid** — Quick-access buttons for lights, scenes, switches, service calls.

![Buttons](asset/images/bar-e-grid-button-cards.webp)

**Switches** — Toggle list with icon + ON/OFF pill. Icon click toggles, row click opens More Info.

![Switches](asset/images/switches-cards.webp)

**Clock Card** — Ambient clock with entity info in bottom bar or sidebar (up to 3 extra entities).

![Clock](asset/images/clock-card.webp)

---

---

## ⚗️ WeSmart Labs

> **EXPERIMENTAL — Do not use in production.**
> May contain bugs, incomplete features, and breaking YAML changes without notice. No backwards compatibility guaranteed.

Proofs of concept exploring new layout patterns beyond the standard card metaphor.

**→ [Full Labs documentation](WeSmart-Labs/README.md)**

### Cards

| Card | YAML Tag | Status |
|------|----------|--------|
| Home Panel | `wesmart-labs-home-panel` | ⚗️ Experimental |
| Clean Panel | `wesmart-labs-clean-panel` | ⚗️ Experimental |
| Surface | `wesmart-labs-surface` | ⚗️ Experimental |
| Cross Pad | `wesmart-labs-cross-pad` | ⚗️ Experimental |

**Home Panel** — Dense tablet dashboard: weather + presence, KPI tiles, light controls, climate + security, system updates + AI tasks.

![Home Panel](asset/images/labs/labs-home-panel.png)

**Clean Panel** — Refined overview inspired by Claude AI light aesthetic. Weather and climate side by side, interactive light rows with brightness bar.

**Surface** — The cardless dashboard. Content floats directly on the background. No card container, no border.

![Surface](asset/images/labs/labs-surface.png)

**Cross Pad** — Transparent button pad. A single cross divides space into four pressable quadrants. No card shell.

---

## Project Structure

```
.
├── WeSmart-Original/        # Fixed palette — 17 cards
│   ├── Light/               # Single light card
│   ├── Lights/              # Lights list + Lights Expand
│   ├── Climate/             # Climate + Climate Compact
│   ├── Sensors/             # Sensors card
│   ├── Doors/               # Doors card
│   ├── Switches/            # Switches card
│   ├── Buttons/             # Bar + Grid button cards
│   ├── Battery/             # Battery status card
│   ├── Clock/               # Clock card
│   ├── History/             # History graph card
│   ├── Weather/             # Weather card
│   ├── Energy/              # Energy flow card
│   ├── MediaPlayer/         # Media player card
│   └── Chart/               # Chart card
│
├── WeSmart-InfiniteColor/   # Dynamic HSL color engine — 14 cards
│   ├── Light/ Lights/       # Light cards
│   ├── Climate/             # Climate cards
│   ├── Sensors/ Doors/      # Sensor cards
│   ├── Switches/ Battery/   # Switch + battery cards
│   ├── Buttons/             # Bar + Grid button cards
│   ├── Clock/ History/      # Clock + history cards
│   └── Chart/               # Infinite Chart card
│
├── WeSmart-Labs/            # ⚗️ Experimental — 4 cards
│   ├── wesmart-labs-home-panel.js
│   ├── wesmart-labs-clean-panel.js
│   ├── wesmart-labs-surface.js
│   └── wesmart-labs-cross-pad.js
│
├── asset/
│   ├── images/              # Preview screenshots
│   └── video/               # Demo videos
│
└── doc/
    └── README.md            # Full technical documentation
```

---

## Architecture

All cards follow the same pattern — no build step, no dependencies:

```
Single JS file (IIFE)
  └─ class extends HTMLElement
      ├─ attachShadow({ mode: 'open' })   → isolated DOM + styles
      ├─ setConfig(config)                → parse YAML, call _render()
      ├─ set hass(hass)                   → receive state updates, call _updateState()
      ├─ _render()                        → inject <style> + HTML into shadow DOM
      ├─ _updateState()                   → update DOM from hass.states
      └─ _bindEvents()                    → add click/pointer listeners

customElements.define('wesmart-*-card', ...)
window.customCards.push({ type, name, description })
```

---

*Inspired by the WeSmart AI aesthetic.*
