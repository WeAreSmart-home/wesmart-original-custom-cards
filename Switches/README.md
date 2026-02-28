# Claude Switches Card

A Home Assistant custom card to control and monitor multiple switches, styled after the Anthropic Claude aesthetic.

## Features
- **Interactive Toggles**: Click the icon directly to toggle the entity (ON/OFF).
- **State Feedback**: Icons glow orange when the entity is ON.
- **Detailed Info**: Click the row (outside the icon) to open the standard "More Info" dialog.
- **Support**: Works with `switch.*`, `light.*`, `input_boolean.*`, `fan.*`, and more.
- **Dark/Light/Auto Themes**: Matches the project's design system.

## Installation

1. Copy `claude-switches-card.js` to your `config/www/` directory.
2. Add the resource in Home Assistant:
   - **URL**: `/local/claude-switches-card.js`
   - **Type**: JavaScript module
3. Refresh your dashboard.

## Configuration

```yaml
type: custom:claude-switches-card
title: Living Room Switches
icon: mdi:power-settings
theme: auto
entities:
  - switch.living_room_light
  - entity: switch.coffee_maker
    name: Coffee Machine
    icon: mdi:coffee
  - input_boolean.guest_mode
```

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `title` | string | `Switches` | Card heading |
| `icon` | string | `mdi:toggle-switch` | Header icon |
| `theme` | string | `dark` | `dark` \| `light` \| `auto` |
| `entities` | list | — | **Required.** List of switch/toggle entities |

### Entity Options
| Option | Type | Description |
|--------|------|-------------|
| `entity` | string | **Required.** Entity ID |
| `name` | string | Optional display name override |
| `icon` | string | Optional icon override |
