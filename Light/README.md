# Claude Light Card

A custom Home Assistant light entity card styled after the **Anthropic Claude AI** aesthetic.

## Preview

Dark card with warm orange accents, smooth animations, and a minimal Claude-inspired design.

- Background: deep warm charcoal `#292524`
- Accent: Claude orange `#D97757`
- Typography: system sans-serif / Inter
- Glow effects when the light is on

## Features

- Toggle on/off (click toggle or icon)
- Brightness slider with live preview
- Color temperature slider (mireds → Kelvin)
- Color preset palette (8 colors)
- Pulse glow animation when light is on
- Unavailable state overlay
- Responsive and touch-friendly

## Installation

### Manual

1. Copy `claude-light-card.js` to your Home Assistant config folder:
   ```
   config/www/claude-light-card.js
   ```

2. In Home Assistant → **Settings → Dashboards → Resources**, add:
   ```
   /local/claude-light-card.js   (JavaScript module)
   ```

3. Reload the browser (hard refresh: Cmd+Shift+R / Ctrl+Shift+R).

### HACS (if published)

1. HACS → Frontend → "+ Explore & Download" → search **Claude Light Card**
2. Download and add to Resources.

## Configuration

```yaml
type: custom:claude-light-card
entity: light.living_room
```

### All options

| Option             | Type    | Default | Description                         |
|--------------------|---------|---------|-------------------------------------|
| `entity`           | string  | —       | **Required.** `light.*` entity      |
| `name`             | string  | auto    | Override display name               |
| `icon`             | string  | auto    | Override icon (mdi:*)               |
| `show_brightness`  | boolean | `true`  | Show brightness slider              |
| `show_color_temp`  | boolean | `true`  | Show color temperature slider       |
| `show_color`       | boolean | `true`  | Show color preset palette           |

### Example with all options

```yaml
type: custom:claude-light-card
entity: light.bedroom_lamp
name: Bedroom Lamp
icon: mdi:floor-lamp
show_brightness: true
show_color_temp: true
show_color: true
```

## Supported light modes

The card auto-detects capabilities via `supported_color_modes`:

| Mode       | Brightness | Color Temp | Color |
|------------|:----------:|:----------:|:-----:|
| `onoff`    | —          | —          | —     |
| `brightness` | ✓        | —          | —     |
| `color_temp` | ✓        | ✓          | —     |
| `hs`       | ✓          | —          | ✓     |
| `rgb`      | ✓          | —          | ✓     |
| `rgbw`     | ✓          | —          | ✓     |
| `rgbww`    | ✓          | —          | ✓     |
| `xy`       | ✓          | —          | ✓     |

## Color Presets

| Name        | Hex       |
|-------------|-----------|
| Warm White  | `#FFE4C4` |
| Cool White  | `#DCF0FF` |
| Sunset      | `#FF8C3C` |
| Ocean       | `#40A4DF` |
| Forest      | `#6ABE78` |
| Lavender    | `#A08CDC` |
| Rose        | `#E66482` |
| Gold        | `#FFC332` |
