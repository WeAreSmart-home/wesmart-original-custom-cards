# Claude Lights Card

A custom Home Assistant multi-entity light card styled after the **Anthropic Claude AI** aesthetic.
Supports both **dark** and **light** themes.

## Preview

### Dark theme
Deep warm charcoal background, orange accents, smooth per-row glow when lights are on.

### Light theme
Warm cream/white background (`#FFFEFA`), same orange accent `#D97757`, clean minimal look.

## Features

- Master toggle (turns all lights on/off at once)
- Per-light toggle switch for each entity
- Live state text: brightness % + color temperature K when on
- Header subtitle: "2 of 4 on" / "All on" / "All off"
- Tap a row (outside the toggle) → opens **More Info** dialog
- Unavailable entities shown dimmed and non-interactive
- Three theme modes: `dark`, `light`, `auto`

## Installation

1. Copy `claude-lights-card.js` to:
   ```
   config/www/claude-lights-card.js
   ```

2. In Home Assistant → **Settings → Dashboards → Resources**, add:
   ```
   /local/claude-lights-card.js   (JavaScript module)
   ```

3. Hard refresh the browser (Cmd+Shift+R / Ctrl+Shift+R).

## Configuration

```yaml
type: custom:claude-lights-card
title: Living Room
entities:
  - light.ceiling
  - light.floor_lamp
  - light.led_strip
```

### All options

| Option     | Type            | Default              | Description                          |
|------------|-----------------|----------------------|--------------------------------------|
| `title`    | string          | `'Lights'`           | Card heading                         |
| `icon`     | string          | `mdi:lightbulb-group`| Header icon (mdi:*)                  |
| `theme`    | string          | `'dark'`             | `dark` \| `light` \| `auto`          |
| `entities` | list            | —                    | **Required.** List of light entities |

### Entity format

Each item in `entities` can be a plain string or an object:

```yaml
entities:
  - light.ceiling                  # simple string
  - entity: light.floor_lamp       # object with overrides
    name: Floor Lamp
    icon: mdi:floor-lamp
  - entity: light.strip
    name: LED Strip
    icon: mdi:led-strip-variant
```

| Entity field | Type   | Default | Description           |
|--------------|--------|---------|-----------------------|
| `entity`     | string | —       | `light.*` entity ID   |
| `name`       | string | auto    | Override display name |
| `icon`       | string | auto    | Override icon (mdi:*) |

## Theme examples

```yaml
# Dark (default)
theme: dark

# Light (warm cream)
theme: light

# Follows system prefers-color-scheme
theme: auto
```

## Full example

```yaml
type: custom:claude-lights-card
title: Bedroom
icon: mdi:bed
theme: light
entities:
  - entity: light.bedroom_ceiling
    name: Ceiling
    icon: mdi:ceiling-light
  - entity: light.bedside_left
    name: Left Lamp
    icon: mdi:lamp
  - entity: light.bedside_right
    name: Right Lamp
    icon: mdi:lamp
  - entity: light.wardrobe_strip
    name: Wardrobe
    icon: mdi:led-strip-variant
```
