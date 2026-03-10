# WeSmart InfiniteColor Cards

> Custom cards for Home Assistant powered by the **Infinite Color Engine** — a chromatic engine that generates a complete visual palette from a single hex color defined in YAML.
>
> 🇮🇹 [Versione italiana disponibile in fondo](#versione-italiana)

---

## Preview

![Clock and Light InfiniteColor Cards](../asset/images/clock-e-light-cards-infinite.png)

![History Card — Blue Theme](../asset/images/history-cards-blue.png)

<details>
<summary>More previews</summary>

![History Card — Yellow Dark](../asset/images/history-cards-yellow-dark.png)
![History Card — Yellow Light](../asset/images/history-cards-yellow-light.png)

</details>

---

## Table of Contents

- [How the Color Engine Works](#how-the-color-engine-works)
- [Setting the Color](#setting-the-color)
- [Themes: dark, light, auto](#themes-dark-light-auto)
- [Fixed Semantic Colors](#fixed-semantic-colors)
- [Available Cards](#available-cards)
- [Installation](#installation)
- [Card Reference](#card-reference)
- [Versione italiana](#versione-italiana)

---

## How the Color Engine Works

Each InfiniteColor card uses no fixed palette. It starts from **a single color** (`color: '#RRGGBB'`) and automatically derives all necessary design tokens:

```
color: '#D97757'  ──→  accent, accent-soft, accent-glow, accent-border
                  ──→  bg, surface, border
                  ──→  text, text-muted, text-dim
                  ──→  shadow
```

### Step-by-step algorithm

**1. HEX → HSL conversion**

The hex color is converted to `{ h, s, l }` (hue, saturation, lightness). This allows perceptual manipulation of each component.

**2. Palette derivation (dark theme)**

```
Accent:             hsl(h, s, clamp(l, 50, 65))
Accent soft:        hsla(h, s, accentL, 0.12)   ← active badge background
Accent glow:        hsla(h, s, accentL, 0.25)   ← luminous shadow
Accent border:      hsla(h, s, accentL, 0.30)   ← active element border

Background (bg):    hsl(h, s×0.35, 11)          ← charcoal tone of the same hue
Surface:            hsl(h, s×0.28, 16)          ← layer above bg
Border:             hsla(0, 0%, 100%, 0.08)      ← low-opacity white

Primary text:       hsl(h, s×0.08, 93)
Secondary text:     hsl(h, s×0.12, 65)
Tertiary text:      hsl(h, s×0.10, 42)

Shadow:             0 8px 32px hsla(h, s, 5, 0.45)
```

**3. Palette derivation (light theme)**

Same hue and saturation values are used, but lightness values are inverted: near-white background, near-black text, darker accent for contrast.

**4. Injection as CSS Custom Properties**

All tokens are written to `:host` via `element.style.setProperty(...)`. CSS rules use `var(--accent)`, `var(--bg)`, etc. — no hardcoded values anywhere.

**5. Auto theme**

With `theme: auto` the card listens to `prefers-color-scheme` and recalculates the palette whenever the OS theme changes. The listener is removed on `disconnectedCallback`.

---

## Setting the Color

Add the `color` property to your card's YAML configuration:

```yaml
type: custom:wesmart-infinite-lights-card
title: Living Room
color: '#D97757'      # ← Your color here
theme: dark
entities:
  - light.living_room
  - light.lamp
```

### Accepted format

The color must be a 6-digit hex with `#`:

```yaml
color: '#D97757'   # ✅ correct
color: '#60B4D8'   # ✅ correct
color: 'D97757'    # ❌ missing #
color: '#D97'      # ❌ needs 6-digit format
```

### Example derived palettes

| Input color | Result |
|---|---|
| `'#D97757'` | Orange/charcoal palette — WeSmart default |
| `'#60B4D8'` | Cool blue palette — ideal for climate |
| `'#7CB87A'` | Green palette — ideal for doors/security |
| `'#A78BFA'` | Purple palette — ideal for scenes/automations |
| `'#F59E0B'` | Amber/gold palette — ideal for sensors/battery |
| `'#EC4899'` | Pink palette |
| `'#14B8A6'` | Teal/seafoam palette |

### Default color

If `color` is omitted, cards use `#D97757` (original WeSmart orange).

---

## Themes: dark, light, auto

All cards support three `theme` values:

| Value | Behavior |
|--------|----------|
| `dark` | Dark charcoal background, light text. **Default.** |
| `light` | White background, dark text. |
| `auto` | Follows the OS `prefers-color-scheme`. Updates in real-time without page reload. |

```yaml
type: custom:wesmart-infinite-clock-card
color: '#60B4D8'
theme: auto          # ← follows the system
```

---

## Fixed Semantic Colors

Some cards keep fixed colors for specific meanings that cannot be derived from the custom accent:

| Color | Code | Used in |
|--------|--------|---------|
| Cool blue | `#60B4D8` | Cooling mode in climate card · Climate tab in Super Dashboard |
| Amber | `#D4A84B` | Lights-on warnings in Commander Hub · Sensors tab in Super Dashboard |
| Green | `#7EC8A0` | Closed state in Doors Card |

These colors have universal semantic meaning (cold = blue, closed = green) and remain fixed regardless of the chosen `accent`.

---

## Available Cards

| Card | File | YAML Tag | Entities |
|------|------|----------|---------|
| History | `History/wesmart-infinite-history-card.js` | `wesmart-infinite-history-card` | any (multi) |
| Lights | `Lights/wesmart-infinite-lights-card.js` | `wesmart-infinite-lights-card` | `light.*` (multi) |
| Lights Expand | `Lights/wesmart-infinite-lights-expand-card.js` | `wesmart-infinite-lights-expand-card` | `light.*` (multi, expandable) |
| Light | `Light/wesmart-infinite-light-card.js` | `wesmart-infinite-light-card` | `light.*` (single) |
| Climate | `Climate/wesmart-infinite-climate-card.js` | `wesmart-infinite-climate-card` | `climate.*` (single) |
| Climate Compact | `Climate/wesmart-infinite-climate-compact-card.js` | `wesmart-infinite-climate-compact-card` | `climate.*` (multi) |
| Sensors | `Sensors/wesmart-infinite-sensors-card.js` | `wesmart-infinite-sensors-card` | `sensor.*` (multi) |
| Doors | `Doors/wesmart-infinite-doors-card.js` | `wesmart-infinite-doors-card` | `binary_sensor.*` (multi) |
| Switches | `Switches/wesmart-infinite-switches-card.js` | `wesmart-infinite-switches-card` | `switch.*` (multi) |
| Buttons Bar | `Buttons/wesmart-infinite-buttons-bar-card.js` | `wesmart-infinite-buttons-bar-card` | any / service |
| Buttons Grid | `Buttons/wesmart-infinite-buttons-grid-card.js` | `wesmart-infinite-buttons-grid-card` | any / service |
| Clock | `Clock/wesmart-infinite-clock-card.js` | `wesmart-infinite-clock-card` | any (max 3 extras) |
| Commander Hub | `Hub/wesmart-infinite-commander-hub.js` | `wesmart-infinite-commander-hub` | Hub / multi |
| Super Dashboard | `Hub/wesmart-infinite-super-dashboard.js` | `wesmart-infinite-super-dashboard` | Auto-discovery |

---

## Installation

### 1. Copy the files

Copy the `.js` files you want to use into `config/www/`:

```
config/www/wesmart-infinite-history-card.js
config/www/wesmart-infinite-lights-card.js
config/www/wesmart-infinite-lights-expand-card.js
config/www/wesmart-infinite-light-card.js
config/www/wesmart-infinite-climate-card.js
config/www/wesmart-infinite-climate-compact-card.js
config/www/wesmart-infinite-sensors-card.js
config/www/wesmart-infinite-doors-card.js
config/www/wesmart-infinite-switches-card.js
config/www/wesmart-infinite-buttons-bar-card.js
config/www/wesmart-infinite-buttons-grid-card.js
config/www/wesmart-infinite-clock-card.js
config/www/wesmart-infinite-commander-hub.js
config/www/wesmart-infinite-super-dashboard.js
```

### 2. Add resources in Home Assistant

**Settings → Dashboards → Resources**, add one entry per file:

| URL | Type |
|-----|------|
| `/local/wesmart-infinite-history-card.js` | JavaScript module |
| `/local/wesmart-infinite-lights-card.js` | JavaScript module |
| `/local/wesmart-infinite-lights-expand-card.js` | JavaScript module |
| `/local/wesmart-infinite-light-card.js` | JavaScript module |
| `/local/wesmart-infinite-climate-card.js` | JavaScript module |
| `/local/wesmart-infinite-climate-compact-card.js` | JavaScript module |
| `/local/wesmart-infinite-sensors-card.js` | JavaScript module |
| `/local/wesmart-infinite-doors-card.js` | JavaScript module |
| `/local/wesmart-infinite-switches-card.js` | JavaScript module |
| `/local/wesmart-infinite-buttons-bar-card.js` | JavaScript module |
| `/local/wesmart-infinite-buttons-grid-card.js` | JavaScript module |
| `/local/wesmart-infinite-clock-card.js` | JavaScript module |
| `/local/wesmart-infinite-commander-hub.js` | JavaScript module |
| `/local/wesmart-infinite-super-dashboard.js` | JavaScript module |

### 3. Reload

Hard refresh: `Cmd+Shift+R` (macOS) · `Ctrl+Shift+R` (Windows/Linux)

---

## Card Reference

---

### wesmart-infinite-history-card

Multi-entity history graph with SVG line charts and binary timeline bars.

![History Card — Blue](../asset/images/history-cards-blue.png)

```yaml
type: custom:wesmart-infinite-history-card
title: Home History
color: '#D97757'
theme: dark
hours: 24
entities:
  - light.living_room
  - sensor.kitchen_temperature
  - entity: binary_sensor.front_door
    name: Front Door
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `color` | string | `'#D97757'` | Base color for the palette |
| `theme` | string | `'dark'` | `dark` \| `light` \| `auto` |
| `title` | string | `'History'` | Card title |
| `icon` | string | `mdi:chart-line` | Header icon |
| `hours` | number | `24` | Time range (`1` · `6` · `24` · `168`) |
| `entities` | list | — | **Required.** Any entity type |

---

### wesmart-infinite-lights-card

Compact light list with master toggle and individual toggles.

```yaml
type: custom:wesmart-infinite-lights-card
title: Living Room Lights
color: '#F59E0B'
theme: dark
entities:
  - light.ceiling
  - entity: light.corner_lamp
    name: Corner Lamp
    icon: mdi:floor-lamp
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `color` | string | `'#D97757'` | Base color for the palette |
| `theme` | string | `'dark'` | `dark` \| `light` \| `auto` |
| `title` | string | `'Lights'` | Card title |
| `icon` | string | `mdi:lightbulb-group` | Header icon |
| `entities` | list | — | **Required.** List of `light.*` entities |

**Entity fields:** `entity` (req) · `name` · `icon`

---

### wesmart-infinite-lights-expand-card

Like the Lights Card but with expandable inline panels for each light. Each row expands to show brightness and color temperature (CT) sliders.

```yaml
type: custom:wesmart-infinite-lights-expand-card
title: Lights with Controls
color: '#A78BFA'
theme: dark
entities:
  - light.ceiling
  - entity: light.led_strip
    name: LED Strip
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `color` | string | `'#D97757'` | Base color for the palette |
| `theme` | string | `'dark'` | `dark` \| `light` \| `auto` |
| `title` | string | `'Lights'` | Card title |
| `entities` | list | — | **Required.** List of `light.*` entities |

**Available sliders (per expanded row):**
- **Brightness** — 0% to 100%, sends `brightness` to `light.turn_on`
- **Color temperature (CT)** — fixed warm→cool gradient, sends `color_temp_kelvin`

The chevron `›` rotates to `↓` when the row is expanded.

---

### wesmart-infinite-light-card

Single light card with full controls: toggle, brightness, Kelvin/CT, hue.

![Clock and Light Cards](../asset/images/clock-e-light-cards-infinite.png)

```yaml
type: custom:wesmart-infinite-light-card
entity: light.living_room_lamp
color: '#D97757'
theme: dark
show_brightness: true
show_color_temp: true
show_color: true
collapse_when_off: false
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `entity` | string | — | **Required.** `light.*` entity |
| `color` | string | `'#D97757'` | Base color for the palette |
| `theme` | string | `'dark'` | `dark` \| `light` \| `auto` |
| `name` | string | auto | Overrides the displayed name |
| `show_brightness` | boolean | `true` | Brightness slider |
| `show_color_temp` | boolean | `true` | Kelvin/CT slider |
| `show_color` | boolean | `true` | Hue slider |
| `collapse_when_off` | boolean | `false` | Hides controls when the light is off |

**CT slider:** fixed warm→cool gradient (`#FFB347 → #B8DAFF`). Supports `color_temp_kelvin` (HA 2022.9+) and legacy mireds.
**Hue slider:** fixed rainbow, thumb color follows `hsl(hue, 100%, 50%)`.
**Brightness slider:** dynamic gradient from `accent-soft` to `accent`.

---

### wesmart-infinite-climate-card

Single climate entity card with target temperature, modes, and heating/cooling animations.

```yaml
type: custom:wesmart-infinite-climate-card
entity: climate.living_room_thermostat
color: '#D97757'
theme: dark
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `entity` | string | — | **Required.** `climate.*` entity |
| `color` | string | `'#D97757'` | Base color for the palette |
| `theme` | string | `'dark'` | `dark` \| `light` \| `auto` |
| `name` | string | auto | Overrides the name |

**Mode colors (fixed):**
- **Heating** → `accent` (your custom color)
- **Cooling** → `#60B4D8` (fixed blue — cold semantics)
- **Off / Idle** → `text-dim`

---

### wesmart-infinite-climate-compact-card

Compact list of multiple climate entities.

```yaml
type: custom:wesmart-infinite-climate-compact-card
title: Thermostats
color: '#60B4D8'
theme: dark
entities:
  - climate.living_room
  - climate.bedroom
  - entity: climate.office
    name: Office
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `color` | string | `'#D97757'` | Base color for the palette |
| `theme` | string | `'dark'` | `dark` \| `light` \| `auto` |
| `title` | string | `'Climate'` | Card title |
| `icon` | string | `mdi:thermostat` | Header icon |
| `entities` | list | — | **Required.** List of `climate.*` entities |

**Entity fields:** `entity` (req) · `name`

---

### wesmart-infinite-sensors-card

Sensor list with type icons and configurable alert thresholds.

```yaml
type: custom:wesmart-infinite-sensors-card
title: Environment
color: '#F59E0B'
theme: dark
entities:
  - entity: sensor.living_room_temperature
    name: Temperature
    alert_above: 28
  - entity: sensor.kitchen_humidity
    name: Humidity
    alert_above: 70
  - sensor.office_co2
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `color` | string | `'#D97757'` | Base color for the palette |
| `theme` | string | `'dark'` | `dark` \| `light` \| `auto` |
| `title` | string | `'Sensors'` | Card title |
| `icon` | string | `mdi:gauge` | Header icon |
| `entities` | list | — | **Required.** List of `sensor.*` entities |

**Entity fields:** `entity` (req) · `name` · `icon` · `alert_above` · `alert_below`

**Fixed semantic sensor colors:**

| `device_class` | Color |
|---|---|
| `temperature` | `#E07B54` (warm orange) |
| `humidity` | `#60B4D8` (blue) |
| `co2` / `carbon_dioxide` | `#7EC8A0` (green) |
| `pressure` | `#A78BFA` (purple) |
| `pm25` / `pm10` | `#F59E0B` (amber) |
| others | `text-muted` |

**Alert state:** when a threshold is exceeded, the entire row uses `accent` (your custom color) to highlight the anomaly.

---

### wesmart-infinite-doors-card

Doors and binary sensor card with badges, open/closed state, and status pills.

```yaml
type: custom:wesmart-infinite-doors-card
title: Security
color: '#7CB87A'
theme: dark
entities:
  - entity: binary_sensor.front_door
    name: Entrance
  - binary_sensor.kitchen_window
  - binary_sensor.outdoor_motion
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `color` | string | `'#D97757'` | Base color for the palette |
| `theme` | string | `'dark'` | `dark` \| `light` \| `auto` |
| `title` | string | `'Doors & Sensors'` | Card title |
| `icon` | string | `mdi:door` | Header icon |
| `entities` | list | — | **Required.** List of `binary_sensor.*` entities |

**Entity fields:** `entity` (req) · `name` · `icon`

**State colors:**
- **Closed / Inactive** → fixed green `#7EC8A0` (security semantics)
- **Open / Active** → `accent` (your custom color)
- **Unavailable** → `text-dim` dimmed

---

### wesmart-infinite-switches-card

Switch list with icon toggle and ON/OFF pill.

```yaml
type: custom:wesmart-infinite-switches-card
title: Switches
color: '#D97757'
theme: dark
entities:
  - switch.kitchen_outlet
  - entity: switch.tv_standby
    name: TV Standby
    icon: mdi:television
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `color` | string | `'#D97757'` | Base color for the palette |
| `theme` | string | `'dark'` | `dark` \| `light` \| `auto` |
| `title` | string | `'Switches'` | Card title |
| `icon` | string | `mdi:toggle-switch` | Header icon |
| `entities` | list | — | **Required.** List of toggle entities |

**Entity fields:** `entity` (req) · `name` · `icon`

**Icon click** → toggle. **Row click** → More Info.

---

### wesmart-infinite-buttons-bar-card

Compact horizontal bar of action buttons.

```yaml
type: custom:wesmart-infinite-buttons-bar-card
color: '#A78BFA'
theme: dark
title: Quick Actions
buttons:
  - name: Lights
    icon: mdi:lightbulb
    entity: light.living_room
  - name: Movie
    icon: mdi:movie-open
    service: scene.turn_on
    service_data:
      entity_id: scene.movie_night
  - name: TV
    icon: mdi:television
    entity: switch.tv
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `color` | string | `'#D97757'` | Base color for the palette |
| `theme` | string | `'dark'` | `dark` \| `light` \| `auto` |
| `title` | string | — | Optional label above buttons |
| `buttons` | list | — | **Required.** Button list |

**Button fields:** `name` · `icon` · `entity` · `service` · `service_data`

**Action logic:** `entity` → toggle; `service` → call the service; both → call service, use entity for active state.

---

### wesmart-infinite-buttons-grid-card

Grid of square buttons, ideal for rooms with many actions.

```yaml
type: custom:wesmart-infinite-buttons-grid-card
title: Bedroom Controls
color: '#14B8A6'
theme: dark
columns: 3
buttons:
  - name: Ceiling Light
    icon: mdi:ceiling-light
    entity: light.bedroom_ceiling
  - name: Bedside Lamp
    icon: mdi:lamp
    entity: light.bedroom_lamp
  - name: Fan
    icon: mdi:fan
    entity: switch.bedroom_fan
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `color` | string | `'#D97757'` | Base color for the palette |
| `theme` | string | `'dark'` | `dark` \| `light` \| `auto` |
| `title` | string | — | Optional card title |
| `columns` | number | `3` | Grid columns |
| `buttons` | list | — | **Required.** Button list |

**Button fields:** `name` · `icon` · `entity` · `service` · `service_data`

---

### wesmart-infinite-clock-card

Ambient clock with date and up to 3 extra entities displayed below or in a sidebar.

![Clock Card](../asset/images/clock-e-light-cards-infinite.png)

```yaml
type: custom:wesmart-infinite-clock-card
color: '#60B4D8'
theme: auto
show_seconds: true
layout: bottom
extras:
  - entity: sensor.outdoor_temperature
    label: Outdoor
  - entity: sensor.living_room_humidity
    label: Humidity
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `color` | string | `'#D97757'` | Base color for the palette |
| `theme` | string | `'dark'` | `dark` \| `light` \| `auto` |
| `show_seconds` | boolean | `false` | Show seconds in the time display |
| `layout` | string | `'bottom'` | `bottom` \| `sidebar` — extra entities position |
| `extras` | list | — | Max 3 extra entities |

**The date** uses `accent` as its color (your custom color).

**Extra fields:** `entity` (req) · `label`

---

### wesmart-infinite-commander-hub

Multifunctional central hub with greeting, tabs, and automated alerts.

```yaml
type: custom:wesmart-infinite-commander-hub
color: '#D97757'
theme: dark
entities:
  - light.living_room
  - switch.kitchen_outlet
stats:
  - sensor.outdoor_temperature
  - sensor.energy_consumption
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `color` | string | `'#D97757'` | Base color for the palette |
| `theme` | string | `'dark'` | `dark` \| `light` \| `auto` |
| `title` | string | `'Commander'` | Title (used internally) |
| `entities` | list | — | Entities for the Controls tab |
| `stats` | list | — | Entities for the Sensors tab |

**Summary tab** — automatic alerts (no configuration required):

| Alert | Threshold | Color |
|-------|-----------|-------|
| Lights on | > 0 | Amber `#D4A84B` |
| Locks open | > 0 | `accent` |
| Blinds/shutters open | > 0 | Blue `#60B4D8` |
| Low batteries | ≤ 20% | `accent` |

---

### wesmart-infinite-super-dashboard

Full-screen dashboard with auto-discovery, 6-tab navigation, and visibility settings.

```yaml
type: custom:wesmart-infinite-super-dashboard
color: '#D97757'
theme: dark
exclude_entities:
  - light.living_room_group
  - sensor.internal_sensor
max_overview_items: 6
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `color` | string | `'#D97757'` | Base color for the palette |
| `theme` | string | `'dark'` | `dark` \| `light` \| `auto` |
| `exclude_entities` | list | `[]` | Entities to always exclude (YAML) |
| `max_overview_items` | number | `6` | Max entities per section in Overview tab |

**Available tabs:**

| Tab | Content |
|-----|---------|
| Overview | Overview of all categories (up to `max_overview_items` per type) |
| Lights | All discovered `light.*` entities |
| Climate | All discovered `climate.*` entities |
| Sensors | All `sensor.*` and `binary_sensor.*` |
| Switches | All `switch.*` |
| Settings | Visibility toggle for each entity (saved in the browser) |

**Auto-discovery:** the card reads `hass.states` and classifies entities by domain. Filters out groups (entities with an `entity_id` array attribute) and internal entities (`entity_category`, `hidden`).

**Local visibility:** exclusions set in the Settings tab are saved in `localStorage` under the key `wesmart_inf_dashboard_hidden`. They are separate from YAML exclusions and reset when browser data is cleared.

---

## Architectural Notes

- **No build step.** Pure vanilla JS, one file per card.
- **Isolated Shadow DOM** — styles never leak into the HA page.
- **Single file** contains styles, logic, and custom element registration.
- **`_applyPalette()`** is called in `setConfig` and, if `theme: auto`, also on every `prefers-color-scheme` change.
- **`disconnectedCallback()`** removes the `matchMedia` listener to prevent memory leaks.
- InfiniteColor cards and Original cards can coexist on the same dashboard without conflicts.

---

---

## Versione italiana

Una collezione di card personalizzate per Home Assistant con **Infinite Color Engine**: un motore cromatico che genera l'intera palette visiva da un singolo colore esadecimale definito nella configurazione YAML.

### Indice

- [Come funziona il motore dei colori](#come-funziona-il-motore-dei-colori)
- [Come impostare il colore](#come-impostare-il-colore)
- [Temi: dark, light, auto](#temi-dark-light-auto)
- [Colori semantici fissi](#colori-semantici-fissi)

---

### Come funziona il motore dei colori

Ogni card InfiniteColor non usa una palette fissa. Parte da **un solo colore** (`color: '#RRGGBB'`) e ne deriva automaticamente tutti i token necessari:

```
color: '#D97757'  ──→  accent, accent-soft, accent-glow, accent-border
                  ──→  bg, surface, border
                  ──→  text, text-muted, text-dim
                  ──→  shadow
```

**Algoritmo passo per passo**

1. **Conversione HEX → HSL** — Il colore viene convertito in `{ h, s, l }` per manipolazione percettiva.
2. **Derivazione palette (tema scuro)** — sfondo carbone, superficie, accento e testi derivati dallo stesso hue.
3. **Derivazione palette (tema chiaro)** — stessi hue e saturation, luminosità invertite: sfondo bianco, testi scuri.
4. **Iniezione CSS Custom Properties** — tutti i token scritti su `:host` via `element.style.setProperty(...)`.
5. **Auto theme** — con `theme: auto` la card ascolta `prefers-color-scheme` e ricalcola la palette in tempo reale.

---

### Come impostare il colore

```yaml
type: custom:wesmart-infinite-lights-card
title: Soggiorno
color: '#D97757'      # ← Qui il tuo colore
theme: dark
entities:
  - light.soggiorno
  - light.lampada
```

Formato accettato: esadecimale a 6 cifre con `#` — `'#D97757'` ✅ · `'D97757'` ❌ · `'#D97'` ❌

Se `color` è omesso, le card usano `#D97757` (arancione WeSmart originale).

---

### Temi: dark, light, auto

| Valore | Comportamento |
|--------|--------------|
| `dark` | Sfondo scuro carbone, testo chiaro. **Default.** |
| `light` | Sfondo bianco, testo scuro. |
| `auto` | Segue `prefers-color-scheme` del sistema operativo. Si aggiorna in tempo reale. |

---

### Colori semantici fissi

| Colore | Codice | Dove viene usato |
|--------|--------|-----------------|
| Blu freddo | `#60B4D8` | Stato raffreddamento clima · Tab Climate nel Super Dashboard |
| Ambra | `#D4A84B` | Avvisi luci accese nel Commander Hub |
| Verde | `#7EC8A0` | Stato porte chiuse nella Doors Card |

Per la documentazione completa delle card in italiano, fare riferimento alla versione inglese con le stesse opzioni YAML — i nomi delle proprietà sono identici.
