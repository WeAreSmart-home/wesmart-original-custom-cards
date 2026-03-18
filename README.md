# WeSmart Custom Cards — Home Assistant

A collection of custom cards for Home Assistant Dashboard, inspired by the **WeSmart AI** aesthetic: warm charcoal dark theme, orange accent, and minimal typography.

Three collections are available:
- **WeSmart Original** — fixed warm charcoal palette, production-ready
- **WeSmart InfiniteColor** — dynamic HSL color engine, production-ready
- **WeSmart Labs** — experimental concepts, unstable, may contain bugs

---

## Preview

![Lights Preview](asset/images/lights-cards.webp)
![Sensors Preview](asset/images/sensor.webp)
![Weather Card](asset/images/meteo-card.png)
![Energy Flow Card](asset/images/energy-card.png)
![Media Player Card](asset/images/media-player-cards.png)

---

## WeSmart InfiniteColor

The **InfiniteColor** collection features a chromatic engine that generates a complete visual palette from a single hex color you define in YAML. Every background, surface, text shade, accent, and shadow is automatically derived — no hardcoded values, no fixed themes.

```yaml
color: '#D97757'  ──→  accent, accent-soft, accent-glow, accent-border
                  ──→  bg, surface, border
                  ──→  text, text-muted, text-dim
```

![Clock and Light InfiniteColor](asset/images/clock-e-light-cards-infinite.png)
![History Card — Blue Theme](asset/images/history-cards-blue.png)

<details>
<summary>More InfiniteColor previews</summary>

![History Card — Yellow Dark](asset/images/history-cards-yellow-dark.png)
![History Card — Yellow Light](asset/images/history-cards-yellow-light.png)

</details>

Pick any hex color and all InfiniteColor cards instantly adapt their entire palette:

| Input color | Palette |
|---|---|
| `'#D97757'` | Orange/charcoal — WeSmart default |
| `'#60B4D8'` | Cool blue — ideal for climate |
| `'#7CB87A'` | Green — ideal for doors/security |
| `'#A78BFA'` | Purple — ideal for scenes/automations |
| `'#F59E0B'` | Amber/gold — ideal for sensors/battery |

Themes `dark`, `light`, and `auto` (follows OS `prefers-color-scheme`) are supported by every card.

**→ [Full InfiniteColor documentation](WeSmart-InfiniteColor/README.md)**

---

## Installation

### 1. Copy Files
Copy the `.js` file of each card you want to use into your Home Assistant `config/www/` directory.

### 2. Add Resources
In Home Assistant → **Settings → Dashboards → Resources**, add a new entry for each card:
- **URL**: `/local/wesmart-light-card.js` (adjust filename)
- **Type**: `JavaScript module`

### 3. Reload
Perform a hard refresh of your browser (`Cmd+Shift+R` or `Ctrl+Shift+R`).

---

## Design System

### WeSmart Original — Fixed palette

All Original cards share a unified design language:

| Token | Dark Value | Light Value |
|-------|------------|-------------|
| `--bg` | `#1C1917` | `#FFFEFA` |
| `--surface` | `#292524` | `#F5F0EB` |
| `--accent` | `#D97757` | — |

### WeSmart InfiniteColor — Dynamic palette

Every token is computed from a single `color` property. See the [InfiniteColor documentation](WeSmart-InfiniteColor/README.md) for the full algorithm.

---

## Available Cards

### WeSmart InfiniteColor Collection

14 cards with a dynamic HSL color engine. Full documentation → [WeSmart-InfiniteColor/README.md](WeSmart-InfiniteColor/README.md)

| Card | YAML Tag |
|------|----------|
| History | `wesmart-infinite-history-card` |
| Lights | `wesmart-infinite-lights-card` |
| Lights Expand | `wesmart-infinite-lights-expand-card` |
| Light (single) | `wesmart-infinite-light-card` |
| Climate | `wesmart-infinite-climate-card` |
| Climate Compact | `wesmart-infinite-climate-compact-card` |
| Sensors | `wesmart-infinite-sensors-card` |
| Doors | `wesmart-infinite-doors-card` |
| Switches | `wesmart-infinite-switches-card` |
| Buttons Bar | `wesmart-infinite-buttons-bar-card` |
| Buttons Grid | `wesmart-infinite-buttons-grid-card` |
| Clock | `wesmart-infinite-clock-card` |
| Commander Hub | `wesmart-infinite-commander-hub` |
| Super Dashboard | `wesmart-infinite-super-dashboard` |

---

### WeSmart Original Collection

Cards with a fixed warm charcoal palette.

#### WeSmart Weather Card *(new — work in progress)*

> ⚠️ **Experimental.** This card is under active development and may contain bugs or incomplete features. Use with caution and expect breaking changes.

Full weather card with current conditions, forecast strip (daily or hourly), and stats bar.
Fetches forecasts via WebSocket API (HA 2023.9+).
![Weather Preview](asset/images/meteo-card.png)

#### WeSmart Energy Flow Card *(new — work in progress)*

> ⚠️ **Experimental.** This card is under active development and may contain bugs or incomplete features. Use with caution and expect breaking changes.

Real-time energy flow visualization: grid, solar, battery, home consumption.
All source nodes (solar, grid, battery) are optional — only `home_power` is required.
![Energy Preview](asset/images/energy-card.png)

#### WeSmart Media Player Card *(new)*
Blurred album art background, animated progress bar, full transport controls (shuffle, previous, play/pause, next, repeat), volume slider, source selector.
Respects HA `supported_features` bitmask.
![Media Player Preview](asset/images/media-player-cards.png)

#### WeSmart Commander Hub
The flagship central dashboard card. Features a smart greeting, tabbed navigation, and automated system alerts.

#### WeSmart Light Card
Single light entity with full controls: toggle, brightness, color temperature, and color (hue).

#### WeSmart Lights & Expand Card
Multiple light entities in a compact list. The "Expand" version features animated inline sliders.

#### WeSmart Climate & Compact Card
Advanced climate control with target temperature, HVAC modes, and fan speed.
![Climate Preview](asset/images/climate-e-compact-cards.webp)

#### WeSmart Sensors & Doors
Compact lists for environmental sensors and binary sensors (doors, windows, motion) with status pills.
![Doors Preview](asset/images/doors.webp)

#### WeSmart History Card
Interactive history graphs.

#### WeSmart Buttons (Bar & Grid)
Quick-access buttons for lights, scenes, and switches, arranged in horizontal bars or automatic grids.
![Buttons Preview](asset/images/bar-e-grid-button-cards.webp)

#### WeSmart Battery Status
Monitor all your devices with circular or linear battery indicators.
![Battery Preview](asset/images/battery-cards.webp)

#### WeSmart Clock Card
Sleek ambient clock with entity sidebar or bottom bar info.
![Clock Preview](asset/images/clock-card.webp)

---

### ⚗️ WeSmart Labs Collection

> **⚠️ EXPERIMENTAL — Do not use in production.**
>
> These cards are proofs of concept and active design experiments.
> They **may contain bugs**, incomplete features, and breaking YAML changes without notice.
> No backwards compatibility is guaranteed.

The Labs collection explores new layout concepts beyond the standard card metaphor.

Full documentation → [WeSmart-Labs/README.md](WeSmart-Labs/README.md)

#### Home Panel (`wesmart-labs-home-panel`)
A dense tablet dashboard in a single card covering five rows: weather + presence, KPI tiles, light controls, climate + security, system updates + AI tasks. All sections are YAML-configured.

#### Clean Panel (`wesmart-labs-clean-panel`)
A refined overview card inspired by the Anthropic / Claude AI light aesthetic. Weather and climate side by side, interactive light rows with brightness bar and color-temperature badge, door chip grid.

#### Surface (`wesmart-labs-surface`)
**The cardless dashboard.** Eliminates the card container concept entirely — content floats directly on the background surface. Hierarchy is expressed only through scale, weight, color, and whitespace. A single thin accent gradient rule is the only decoration.

| Labs Card | YAML Tag | Status |
|-----------|----------|--------|
| Home Panel | `wesmart-labs-home-panel` | ⚗️ Experimental |
| Clean Panel | `wesmart-labs-clean-panel` | ⚗️ Experimental |
| Surface | `wesmart-labs-surface` | ⚗️ Experimental |

---

## Project Structure

```
.
├── WeSmart-Original/      # Standard cards (fixed palette)
│   ├── Hub/               # Commander Hub, Super Dashboard
│   ├── Lights/            # Light card, Lights card, Lights Expand
│   ├── Climate/           # Climate card, Climate Compact
│   ├── Sensors/           # Sensors card
│   ├── Doors/             # Doors card
│   ├── Switches/          # Switches card
│   ├── Buttons/           # Bar and Grid button cards
│   ├── Battery/           # Battery status card
│   ├── Clock/             # Clock card
│   ├── Weather/           # Weather card (new)
│   ├── Energy/            # Energy flow card (new)
│   └── MediaPlayer/       # Media player card (new)
├── WeSmart-InfiniteColor/ # Dynamic HSL color engine cards
├── WeSmart-Labs/          # ⚗️ Experimental — unstable, may contain bugs
├── asset/                 # Images and preview videos
└── doc/                   # Documentation source
```

---

*Inspired by the WeSmart AI aesthetic.*
