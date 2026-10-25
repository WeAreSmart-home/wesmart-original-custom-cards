# Claude Climate Compact Card

A space-efficient Home Assistant custom card for managing multiple climate zones in a list format, styled after the Anthropic Claude aesthetic.

## Features
- **Compact List Layout**: Manage multiple thermostats without taking up much vertical space.
- **Integrated Controls**: Adjust target temperature directly from the list using plus/minus buttons.
- **Visual State Feedback**: Icons glow orange for heating and blue for cooling.
- **Current & Target Temps**: Displays both at a glance.
- **Detailed Info**: Click any row to open the full Home Assistant thermostat dialog.

## Installation

1. Copy `claude-climate-compact-card.js` to your `config/www/` directory.
2. Add the resource in Home Assistant:
   - **URL**: `/local/claude-climate-compact-card.js`
   - **Type**: JavaScript module
3. Refresh your dashboard.

## Configuration

```yaml
type: custom:claude-climate-compact-card
title: Home Zones
icon: mdi:thermostat
theme: auto
entities:
  - climate.living_room
  - entity: climate.bedroom
    name: Master Bedroom
  - climate.kitchen
```

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `title` | string | `Climate Control` | Card heading |
| `icon` | string | `mdi:thermostat` | Header icon |
| `theme` | string | `dark` | `dark` \| `light` \| `auto` |
| `entities` | list | — | **Required.** List of climate entities |

### Entity Options
| Option | Type | Description |
|--------|------|-------------|
| `entity` | string | **Required.** Entity ID |
| `name` | string | Optional display name override |
