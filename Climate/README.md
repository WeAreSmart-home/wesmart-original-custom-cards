# Claude Climate Card

A custom Home Assistant climate entity card styled after the **Anthropic Claude AI** aesthetic.

## Preview

Dark card with warm orange (heating) or cool blue (cooling) accents, smooth animations, and a minimal Claude-inspired design.

- Background: deep warm charcoal `#292524`
- Heating accent: Claude orange `#D97757`
- Cooling accent: Claude blue `#60B4D8`
- Pulse glow animation during active heating/cooling

## Features

- Toggle on/off (toggle switch in header)
- Large current temperature display
- Target temperature with **+** / **−** buttons
- Humidity display (if reported by the entity)
- HVAC mode selector (Heat, Cool, Auto, Dry, Fan…)
- Fan mode selector (optional)
- Range display for `heat_cool` mode (low–high)
- Unavailable state overlay
- Responsive and touch-friendly

## Installation

### Manual

1. Copy `claude-climate-card.js` to your Home Assistant config folder:
   ```
   config/www/claude-climate-card.js
   ```

2. In Home Assistant → **Settings → Dashboards → Resources**, add:
   ```
   /local/claude-climate-card.js   (JavaScript module)
   ```

3. Reload the browser (hard refresh: Cmd+Shift+R / Ctrl+Shift+R).

## Configuration

```yaml
type: custom:claude-climate-card
entity: climate.living_room
```

### All options

| Option           | Type    | Default | Description                              |
|------------------|---------|---------|------------------------------------------|
| `entity`         | string  | —       | **Required.** `climate.*` entity         |
| `name`           | string  | auto    | Override display name                    |
| `icon`           | string  | auto    | Override icon (mdi:*)                    |
| `show_fan_mode`  | boolean | `true`  | Show fan mode selector                   |
| `temp_step`      | number  | auto    | Override temperature step (e.g. `0.5`)   |

### Example with all options

```yaml
type: custom:claude-climate-card
entity: climate.bedroom_ac
name: Bedroom AC
icon: mdi:air-conditioner
show_fan_mode: true
temp_step: 0.5
```

## HVAC modes

The card renders only the modes reported by the entity via `hvac_modes`.

| Mode        | Icon                    | Label |
|-------------|-------------------------|-------|
| `off`       | mdi:power-off           | Off   |
| `heat`      | mdi:fire                | Heat  |
| `cool`      | mdi:snowflake           | Cool  |
| `heat_cool` | mdi:sun-snowflake       | Range |
| `auto`      | mdi:thermostat-auto     | Auto  |
| `dry`       | mdi:water-off-outline   | Dry   |
| `fan_only`  | mdi:fan                 | Fan   |

## Visual states

| HVAC action | Card effect                         |
|-------------|-------------------------------------|
| `heating`   | Orange glow + pulse animation       |
| `cooling`   | Blue glow + pulse animation         |
| `idle`      | No glow, neutral colours            |
| `off`       | Controls dimmed, toggle off         |
| `unavailable` | Frosted overlay with disconnect icon |
