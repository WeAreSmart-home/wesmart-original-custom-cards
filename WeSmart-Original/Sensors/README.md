# WeSmart Sensors Card

A custom Home Assistant multi-entity sensor card styled after the **Anthropic WeSmart AI** aesthetic.

## Preview

Compact list of sensor rows, each showing a colored value badge with unit. Out-of-range values are highlighted in orange to signal alerts at a glance.

- Background: deep warm charcoal `#292524`
- Accent per sensor type (temperature → warm orange, humidity → blue, battery → green…)
- Alert highlight: Claude orange `#D97757`
- Supports dark, light and auto themes

## Features

- Compact row per sensor: icon · name · type label · **value + unit**
- Color-coded icon and value per `device_class`
- Built-in alert thresholds (temperature, humidity, CO₂, battery)
- Custom per-entity thresholds via `alert_above` / `alert_below`
- Header subtitle shows **"N alerts"** when any threshold is exceeded
- Tap any row → More Info dialog
- Unavailable / unknown state dimming
- Responsive and touch-friendly

## Installation

### Manual

1. Copy `wesmart-sensors-card.js` to your Home Assistant config folder:
   ```
   config/www/wesmart-sensors-card.js
   ```

2. In Home Assistant → **Settings → Dashboards → Resources**, add:
   ```
   /local/wesmart-sensors-card.js   (JavaScript module)
   ```

3. Reload the browser (hard refresh: Cmd+Shift+R / Ctrl+Shift+R).

## Configuration

```yaml
type: custom:wesmart-sensors-card
title: Sensors
entities:
  - sensor.temperature_indoor
  - sensor.humidity_indoor
```

### All options

| Option     | Type   | Default          | Description                        |
|------------|--------|------------------|------------------------------------|
| `title`    | string | `'Sensors'`      | Card heading                       |
| `icon`     | string | `mdi:chart-line` | Header icon                        |
| `theme`    | string | `'dark'`         | `dark` \| `light` \| `auto`        |
| `entities` | list   | —                | **Required.** Sensor entity list   |

### Entity item fields

Each entry in `entities` can be a plain string (entity ID) or an object:

| Field          | Type   | Description                                      |
|----------------|--------|--------------------------------------------------|
| `entity`       | string | **Required.** `sensor.*` entity ID               |
| `name`         | string | Override display name                            |
| `icon`         | string | Override icon (`mdi:*`)                          |
| `device_class` | string | Force device class (auto-detected if omitted)    |
| `unit`         | string | Override unit of measurement                     |
| `color`        | string | Override accent color (hex, e.g. `#60B4D8`)      |
| `meta`         | string | Override the type label shown below the name     |
| `alert_above`  | number | Trigger alert if value exceeds this threshold    |
| `alert_below`  | number | Trigger alert if value drops below this threshold|

### Example with all options

```yaml
type: custom:wesmart-sensors-card
title: Casa
icon: mdi:home-thermometer
theme: dark
entities:
  - sensor.temperature_soggiorno
  - entity: sensor.humidity_bagno
    name: Umidità bagno
    alert_above: 75
  - entity: sensor.co2_cucina
    name: CO₂ Cucina
    device_class: co2
    alert_above: 800
  - entity: sensor.battery_sensore_porta
    name: Batteria porta
    alert_below: 15
  - entity: sensor.pressione_atmosferica
    name: Pressione
    unit: hPa
    color: "#A09080"
```

## Built-in alert thresholds

These fire automatically unless you set `alert_above` / `alert_below` on the entity:

| `device_class` | Alert condition        |
|----------------|------------------------|
| `temperature`  | < 10 °C or > 30 °C     |
| `humidity`     | < 30 % or > 70 %       |
| `co2`          | > 1000 ppm             |
| `battery`      | < 20 %                 |

## Supported device classes

Each `device_class` provides an automatic icon and accent color:

| device_class      | Icon                    | Color   |
|-------------------|-------------------------|---------|
| `temperature`     | mdi:thermometer         | `#E07B54` |
| `humidity`        | mdi:water-percent       | `#60B4D8` |
| `pressure`        | mdi:gauge               | `#A09080` |
| `co2`             | mdi:molecule-co2        | `#8FBC8F` |
| `pm25` / `pm10`   | mdi:air-filter          | `#8FBC8F` |
| `illuminance`     | mdi:brightness-5        | `#F0C060` |
| `battery`         | mdi:battery             | `#7EC8A0` |
| `voltage`         | mdi:lightning-bolt      | `#D4A84B` |
| `current`         | mdi:current-ac          | `#D4A84B` |
| `power`           | mdi:flash               | `#D4A84B` |
| `energy`          | mdi:counter             | `#D4A84B` |
| `gas`             | mdi:meter-gas           | `#D97757` |
| `water`           | mdi:water               | `#60B4D8` |
| `signal_strength` | mdi:wifi                | `#A09080` |
| `moisture`        | mdi:water-percent       | `#60B4D8` |
| `aqi`             | mdi:air-filter          | `#8FBC8F` |
| `speed`           | mdi:speedometer         | `#A09080` |
| `wind_speed`      | mdi:weather-windy       | `#A09080` |
| _(other)_         | mdi:chart-line          | `#A09080` |

## Themes

| Value  | Description                              |
|--------|------------------------------------------|
| `dark` | Warm charcoal `#292524` (default)        |
| `light`| Warm cream `#FFFEFA` with dark text      |
| `auto` | Follows system `prefers-color-scheme`    |
