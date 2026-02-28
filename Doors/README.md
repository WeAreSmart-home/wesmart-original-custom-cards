# Claude Doors Card

A custom Home Assistant multi-entity binary sensor card styled after the **Anthropic Claude AI** aesthetic. Designed for doors, windows, locks, motion sensors and contact sensors.

## Preview

Compact list of sensor rows. Each row shows the sensor name, type label, and a status pill: green **Closed** or orange **Open**. Open sensors highlight the entire row in a subtle orange tint, and the header subtitle counts how many sensors are open.

- Background: deep warm charcoal `#292524`
- Open / alert accent: Claude orange `#D97757`
- Closed / safe accent: soft green `#7EC8A0`
- Supports dark, light and auto themes

## Features

- Compact row per sensor: icon · name · type label · **status pill**
- Per-class icon pair: different icon when open vs. closed
- Open rows highlighted in orange tint
- Header shows **"N open"** or **"All closed"**
- Tap any row → More Info dialog
- Unavailable / unknown state dimming
- Responsive and touch-friendly

## Installation

### Manual

1. Copy `claude-doors-card.js` to your Home Assistant config folder:
   ```
   config/www/claude-doors-card.js
   ```

2. In Home Assistant → **Settings → Dashboards → Resources**, add:
   ```
   /local/claude-doors-card.js   (JavaScript module)
   ```

3. Reload the browser (hard refresh: Cmd+Shift+R / Ctrl+Shift+R).

## Configuration

```yaml
type: custom:claude-doors-card
title: Doors & Windows
entities:
  - binary_sensor.front_door
  - binary_sensor.kitchen_window
```

### All options

| Option     | Type   | Default              | Description                              |
|------------|--------|----------------------|------------------------------------------|
| `title`    | string | `'Doors & Windows'`  | Card heading                             |
| `icon`     | string | `mdi:door`           | Header icon                              |
| `theme`    | string | `'dark'`             | `dark` \| `light` \| `auto`              |
| `entities` | list   | —                    | **Required.** Binary sensor entity list  |

### Entity item fields

Each entry in `entities` can be a plain string (entity ID) or an object:

| Field          | Type   | Description                                   |
|----------------|--------|-----------------------------------------------|
| `entity`       | string | **Required.** `binary_sensor.*` entity ID     |
| `name`         | string | Override display name                         |
| `icon`         | string | Override icon for both states (`mdi:*`)       |
| `device_class` | string | Force device class (auto-detected if omitted) |

### Example with all options

```yaml
type: custom:claude-doors-card
title: Porte & Finestre
icon: mdi:home-lock
theme: dark
entities:
  - binary_sensor.porta_ingresso
  - binary_sensor.porta_retro
  - entity: binary_sensor.finestra_cucina
    name: Finestra Cucina
  - entity: binary_sensor.finestra_camera
    name: Finestra Camera
  - entity: binary_sensor.garage
    name: Garage
    device_class: garage_door
  - entity: binary_sensor.serratura_principale
    name: Serratura
    device_class: lock
  - entity: binary_sensor.motion_corridoio
    name: Movimento corridoio
    device_class: motion
```

## Supported device classes

The card auto-detects the `device_class` from the entity attributes. You can override it per entity.

| `device_class` | Open label  | Closed label | Open icon                    | Closed icon                           |
|----------------|-------------|--------------|------------------------------|---------------------------------------|
| `door`         | Open        | Closed       | mdi:door-open                | mdi:door-closed                       |
| `window`       | Open        | Closed       | mdi:window-open              | mdi:window-closed                     |
| `garage_door`  | Open        | Closed       | mdi:garage-open              | mdi:garage                            |
| `opening`      | Open        | Closed       | mdi:lock-open                | mdi:lock                              |
| `lock`         | Unlocked    | Locked       | mdi:lock-open                | mdi:lock                              |
| `motion`       | Detected    | Clear        | mdi:motion-sensor            | mdi:motion-sensor-off                 |
| `vibration`    | Detected    | Clear        | mdi:vibrate                  | mdi:vibrate-off                       |
| `moisture`     | Wet         | Dry          | mdi:water                    | mdi:water-off                         |
| `smoke`        | Detected    | Clear        | mdi:smoke-detector-alert     | mdi:smoke-detector                    |
| `gas`          | Detected    | Clear        | mdi:gas-cylinder             | mdi:gas-burner                        |
| _(other)_      | Active      | Inactive     | mdi:alert-circle-outline     | mdi:checkbox-blank-circle-outline     |

> `binary_sensor` state `on` = open / active · `off` = closed / clear

## Visual states

| State        | Row appearance                            | Header subtitle    |
|--------------|-------------------------------------------|--------------------|
| All closed   | Normal rows, green pills                  | "All closed"       |
| Some open    | Open rows highlighted orange, orange pills| "N open" (orange)  |
| Unavailable  | Row dimmed at 38% opacity                 | Not counted        |

## Themes

| Value  | Description                              |
|--------|------------------------------------------|
| `dark` | Warm charcoal `#292524` (default)        |
| `light`| Warm cream `#FFFEFA` with dark text      |
| `auto` | Follows system `prefers-color-scheme`    |
