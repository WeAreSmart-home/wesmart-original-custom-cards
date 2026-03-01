# WeSmart Battery Status Card

A Home Assistant custom card to monitor battery levels across multiple devices, styled after the Anthropic Claude aesthetic.

## Features
- **Dynamic Icons**: Icons change based on battery percentage (10% increments).
- **Charging State**: Automatically detects charging status.
- **Color Coding**: 
  - < 15%: WeSmart Orange (Critical)
  - 15% - 30%: Muted Orange/Yellow (Warning)
  - > 30%: Muted Green (Good)
- **Status Header**: Shows a summary of low battery devices.
- **Dark/Light/Auto Themes**: Seamlessly integrates with your dashboard theme.

## Installation

1. Copy `wesmart-battery-status-card.js` to your `config/www/` directory.
2. Add the resource in Home Assistant:
   - **URL**: `/local/wesmart-battery-status-card.js`
   - **Type**: JavaScript module
3. Refresh your dashboard.

## Configuration

```yaml
type: custom:wesmart-battery-status-card
title: Battery Status
icon: mdi:battery-check
theme: auto
display_type: circular      # Options: icon (default), linear, circular
entities:
  - sensor.phone_battery_level
  - entity: sensor.tablet_battery_level
    name: Tablet
    display_type: linear    # Override for this specific entity
  - entity: sensor.remote_battery
    name: TV Remote
    display_type: icon      # Uses icons instead of ring/bar
```

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `title` | string | `Batteries` | Card heading |
| `icon` | string | `mdi:battery-check` | Header icon |
| `theme` | string | `dark` | `dark` \| `light` \| `auto` |
| `display_type` | string | `icon` | Visualization style: `icon`, `linear`, `circular` |
| `entities` | list | — | **Required.** List of battery sensor entities |

### Entity Options
| Option | Type | Description |
|--------|------|-------------|
| `entity` | string | **Required.** Battery sensor entity |
| `name` | string | Optional display name override |
| `display_type` | string | Override display type for this specific entity |
