# Claude Clock Card

Sleek ambient clock card with optional extra entity info displayed in a **bottom bar** or a **left sidebar**. Max 3 extra entities. Each shows only icon + state value.

## Features

- Large easy-to-read local time + date
- Glassmorphic design — `dark` / `light` / `auto` themes
- Two layouts for extra info: **bottom bar** or **left sidebar**
- Max 3 extra entities (extras beyond 3 are ignored)
- Each entity shows **icon only + state value** (no name/label)
- Custom icon override per entity (except weather, which uses automatic icons)
- Weather entity: automatic icon mapped from state; optional **Italian translation** of the state

## Installation

1. Copy `claude-clock-card.js` → `config/www/`
2. Add resource in HA: URL `/local/claude-clock-card.js` — type: JavaScript Module
3. Hard-refresh browser (`Cmd+Shift+R`)

## Configuration

### Basic

```yaml
type: custom:claude-clock-card
theme: dark
time_format: 24
```

### Bottom bar (default)

```yaml
type: custom:claude-clock-card
theme: dark
extras_layout: bottom
extra_entities:
  - weather.home
  - sensor.outdoor_temperature
  - sensor.humidity
```

### Left sidebar

```yaml
type: custom:claude-clock-card
theme: dark
extras_layout: sidebar
extra_entities:
  - weather.home
  - sensor.outdoor_temperature
  - sensor.humidity
```

### With custom icons and weather translation

```yaml
type: custom:claude-clock-card
theme: dark
extras_layout: bottom
translate_weather: true
extra_entities:
  - weather.home                          # icon auto, state in Italian
  - entity: sensor.outdoor_temperature
    icon: mdi:thermometer-high            # custom icon
  - entity: sensor.power_consumption
    icon: mdi:lightning-bolt              # custom icon
```

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `theme` | string | `dark` | `dark` \| `light` \| `auto` |
| `time_format` | number | `24` | `12` or `24` |
| `extras_layout` | string | `bottom` | `bottom` \| `sidebar` — where to place extra info |
| `translate_weather` | boolean | `false` | Translate weather states to Italian |
| `extra_entities` | list | `[]` | Up to 3 entities to display |

## Entity item fields

Each item in `extra_entities` can be a plain string (entity ID) or an object:

| Field | Type | Description |
|-------|------|-------------|
| `entity` | string | **Required.** Entity ID |
| `icon` | string | Custom MDI icon (e.g. `mdi:thermometer`). Ignored for `weather.*` entities (icon is automatic) |

## Weather state translations (Italian)

When `translate_weather: true`, weather states are translated automatically:

| State | Italian |
|-------|---------|
| `sunny` | Soleggiato |
| `partlycloudy` | P. nuvoloso |
| `cloudy` | Nuvoloso |
| `rainy` | Pioggia |
| `pouring` | Pioggia forte |
| `snowy` | Neve |
| `snowy-rainy` | Neve/pioggia |
| `fog` | Nebbia |
| `windy` | Ventoso |
| `lightning` | Temporale |
| `lightning-rainy` | Tmp./Pioggia |
| `clear-night` | Sereno |
| `hail` | Grandine |
| `exceptional` | Eccezionale |
