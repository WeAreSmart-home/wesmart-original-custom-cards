# WeSmart Commander Hub

The "Flagship" card of the Claude custom card collection. A central control center for your Home Assistant dashboard.

## Features
- **Smart Greeting**: Welcomes you based on the time of day with a real-time clock.
- **Automated Summary**: Automatically scans your system for active lights, unlocked doors, open covers, and low batteries.
- **Modular Tabs**:
  - **Summary**: At-a-glance status of system alerts.
  - **Controls**: A list of frequently used toggles/actions.
  - **Sensors**: Environmental data and sensor tracking.
- **Glassmorphic Design**: Premium visual effects with radial glows and sleek transitions.

## Installation

1. Copy `wesmart-commander-hub.js` to your `config/www/` directory.
2. Add the resource in Home Assistant:
   - **URL**: `/local/wesmart-commander-hub.js`
   - **Type**: JavaScript module
3. Refresh your dashboard.

## Configuration

```yaml
type: custom:wesmart-commander-hub
title: Command Center
entities:
  - light.living_room
  - switch.kettle
  - lock.front_door
stats:
  - sensor.indoor_temperature
  - sensor.indoor_humidity
  - sensor.energy_usage_today
```

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `title` | string | `Commander` | Header title |
| `icon` | string | `mdi:toggle-switch` | (Internal) |
| `entities` | list | `[]` | List of entity IDs for the **Controls** tab |
| `stats` | list | `[]` | List of entity IDs for the **Sensors** tab |

## Automatic Detection logic
The **Summary** tab automatically displays alerts if:
- Any `light` is `on`.
- Any `lock` is `unlocked`.
- Any `cover` is `open`.
- Any battery sensor is `< 20%`.
