# Lights Cards

Two card variants for controlling multiple `light.*` entities, both styled after the **Anthropic WeSmart AI** aesthetic. Choose the one that fits your use case.

| Card | Type key | Interaction |
|------|----------|-------------|
| WeSmart Lights Card | `custom:wesmart-lights-card` | Tap row → More Info dialog |
| WeSmart Lights Expand Card | `custom:wesmart-lights-expand-card` | Tap row → inline sliders (animated) |

---

## WeSmart Lights Card

Compact list with individual toggles. Tapping a row opens the HA More Info dialog.

### Preview

**Dark theme** — deep warm charcoal, orange accents, per-row glow when on.
**Light theme** — warm cream `#FFFEFA`, same orange accent `#D97757`.

### Features

- Master toggle (all on/off at once)
- Per-row toggle switch
- Live state text: brightness % + color temperature K
- Header subtitle: "2 of 4 on" / "All on" / "All off"
- Tap row → opens **More Info** dialog
- Unavailable entities dimmed and non-interactive
- Themes: `dark` · `light` · `auto`

### Installation

1. Copy to `config/www/wesmart-lights-card.js`
2. Add resource `/local/wesmart-lights-card.js` (JavaScript module)
3. Hard refresh (`Cmd+Shift+R` / `Ctrl+Shift+R`)

### Configuration

```yaml
type: custom:wesmart-lights-card
title: Living Room
entities:
  - light.ceiling
  - light.floor_lamp
  - light.led_strip
```

**Options:**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `title` | string | `'Lights'` | Card heading |
| `icon` | string | `mdi:lightbulb-group` | Header icon (mdi:*) |
| `theme` | string | `'dark'` | `dark` \| `light` \| `auto` |
| `entities` | list | — | **Required.** Light entity list |

**Entity item fields:**

| Field | Type | Description |
|-------|------|-------------|
| `entity` | string | **Required.** `light.*` entity ID |
| `name` | string | Override display name |
| `icon` | string | Override icon (mdi:*) |

### Full example

```yaml
type: custom:wesmart-lights-card
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

---

## WeSmart Lights Expand Card

Same list layout, but tapping a row **expands an inline panel** with brightness and color-temperature sliders — without leaving the dashboard.

### Preview

**Collapsed** — identical to the standard Lights Card.
**Expanded** — panel slides down below the row with:
- Brightness slider (orange fill + thumb)
- Color-temperature slider (warm → cool gradient track)
- Chevron rotates 180° to indicate open state

### Features

- Master toggle (all on/off at once)
- Per-row toggle switch (does not trigger expand)
- Tap row → **animated accordion panel**
  - Only one panel open at a time
  - Tap same row again → closes
- Expand panel (when light is **on**):
  - Brightness slider — drag to adjust, applies on release
  - Color-temp slider — warm→cool gradient, shown only if supported
- "Turn on to adjust" hint when light is off
- Live state text in row: brightness % + color temperature K
- Header subtitle: "N of M on" / "All on" / "All off"
- Unavailable entities dimmed and non-interactive
- Themes: `dark` · `light` · `auto`

### Animations

| Element | Effect |
|---------|--------|
| Chevron | Rotates 180° (`transform cubic-bezier`) |
| Panel | `max-height` + `opacity` accordion |
| Panel content | `translateY` slide-up |
| Slider thumb | Glow ring on drag |
| Panel border | Fades in as panel opens |

### Installation

1. Copy to `config/www/wesmart-lights-expand-card.js`
2. Add resource `/local/wesmart-lights-expand-card.js` (JavaScript module)
3. Hard refresh (`Cmd+Shift+R` / `Ctrl+Shift+R`)

### Configuration

```yaml
type: custom:wesmart-lights-expand-card
title: Living Room
entities:
  - light.ceiling
  - light.floor_lamp
  - light.led_strip
```

**Options:**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `title` | string | `'Lights'` | Card heading |
| `icon` | string | `mdi:lightbulb-group` | Header icon (mdi:*) |
| `theme` | string | `'dark'` | `dark` \| `light` \| `auto` |
| `entities` | list | — | **Required.** Light entity list |

**Entity item fields:**

| Field | Type | Description |
|-------|------|-------------|
| `entity` | string | **Required.** `light.*` entity ID |
| `name` | string | Override display name |
| `icon` | string | Override icon (mdi:*) |

### Full example

```yaml
type: custom:wesmart-lights-expand-card
title: Soggiorno
icon: mdi:sofa
theme: dark
entities:
  - entity: light.soggiorno_soffitto
    name: Soffitto
    icon: mdi:ceiling-light
  - entity: light.soggiorno_piantana
    name: Piantana
    icon: mdi:floor-lamp
  - entity: light.soggiorno_strip
    name: LED Strip
    icon: mdi:led-strip-variant
  - entity: light.soggiorno_tavolo
    name: Tavolo
    icon: mdi:lamp-outline
```

### Notes

- The brightness slider is hidden when the light entity has `onoff` mode only (no `brightness` attribute).
- The color-temp slider is hidden when `color_temp` is not in the entity's state attributes.
- `min_mireds` / `max_mireds` from the entity attributes are respected for CT range; defaults to 153–500 if not available.
- Slider changes are sent to HA on **pointer release** (not on every move) to avoid flooding the bus.
