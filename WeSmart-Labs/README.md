# WeSmart Labs

Experimental cards under active development. These cards are not production-ready and may change significantly or be discontinued.

> **Status:** Experimental — APIs and YAML config may change without notice. No guarantee of stability or backwards compatibility.

---

## Cards

| Card | Tag | File |
|------|-----|------|
| Home Panel | `wesmart-labs-home-panel` | `wesmart-labs-home-panel.js` |
| Clean Panel | `wesmart-labs-clean-panel` | `wesmart-labs-clean-panel.js` |
| Surface | `wesmart-labs-surface` | `wesmart-labs-surface.js` |

---

## wesmart-labs-home-panel

Tablet dashboard panel in a single card. Displays five rows:

- **Row 1** — Weather (MET.NO) + Presence
- **Row 2** — KPI tiles: lights on, climate, security, updates
- **Row 3** — Light controls with brightness bar and color temperature
- **Row 4** — Climate (TRV) + Security (alarm + door)
- **Row 5** — System updates + AI tasks

### Installation

1. Copy `wesmart-labs-home-panel.js` to `config/www/`
2. HA → Settings → Dashboards → Resources → Add:
   - URL: `/local/wesmart-labs-home-panel.js`
   - Type: `JavaScript module`
3. Hard refresh the browser (`Cmd+Shift+R` / `Ctrl+Shift+R`)

---

### YAML — Minimal

Only weather and presence are required. All other sections are optional and will show a placeholder if omitted.

```yaml
type: custom:wesmart-labs-home-panel
color: '#D97757'
theme: dark
name: Massimo
location: Sora
weather:
  entity: weather.forecast_home
presence:
  entity: person.massimo
```

---

### YAML — Complete

```yaml
type: custom:wesmart-labs-home-panel

# ── Palette & theme ────────────────────────────────────────────────────────
color: '#D97757'          # Any hex color — drives the entire InfiniteColor palette
theme: dark               # dark | light | auto (follows OS prefers-color-scheme)

# ── Header ─────────────────────────────────────────────────────────────────
name: Massimo             # Name shown in the greeting ("Buongiorno, Massimo")
location: Sora            # Location shown next to the date in the header

# ── Row 1 — Weather ────────────────────────────────────────────────────────
weather:
  entity: weather.forecast_home       # Main weather entity (MET.NO or any HA weather)
  internal_sensor: sensor.temp_home   # Optional: indoor temperature sensor

# ── Row 1 — Presence ───────────────────────────────────────────────────────
presence:
  entity: person.massimo              # person.* entity
  zone: zone.home                     # Optional: zone shown as badge when at home

# ── Row 2 — KPI (optional overrides) ───────────────────────────────────────
# By default KPI values are auto-discovered from hass.states.
# Use kpi: to override specific values.
kpi:
  lights:
    total: 6              # Override total light count (default: auto-count all light.*)
  climate:
    entity: climate.aqara_trv_e1      # Override climate entity for KPI tile
  security:
    alarm: alarm_control_panel.ezviz  # Override alarm entity for KPI tile
    door: binary_sensor.portone       # Override door sensor for KPI tile

# ── Row 3 — Light controls ─────────────────────────────────────────────────
# Each entry shows state, brightness bar, and color temperature badge.
# Clicking a card toggles the light.
lights:
  - entity: light.cucina_parete_yeelight
    name: Cucina — Parete Yeelight
  - entity: light.camera_da_letto
    name: Camera da letto
  - entity: light.cortesia_rientro
    name: Cortesia Rientro

# ── Row 4 — Climate ────────────────────────────────────────────────────────
climate:
  entity: climate.aqara_trv_e1
  name: Riscaldamento — Aqara TRV E1  # Label shown above the temperatures
  external_temp: sensor.temperature_ext # Optional: outdoor sensor shown below

# ── Row 4 — Security ───────────────────────────────────────────────────────
security:
  alarm: alarm_control_panel.ezviz    # Alarm control panel entity
  door: binary_sensor.portone         # Binary sensor for door/gate
  yaml_link: /lovelace/sicurezza      # Optional: link button at the bottom of the card

# ── Row 5 — System updates ─────────────────────────────────────────────────
# Shows installed version and highlights pending updates in amber.
updates:
  - entity: update.zigbee2mqtt
    name: Zigbee2MQTT
  - entity: update.matter_server
    name: Matter Server
  - entity: update.mosquitto_broker
    name: Mosquitto broker
  - entity: update.mini_graph_card
    name: mini-graph-card

# ── Row 5 — AI tasks ───────────────────────────────────────────────────────
# Shows state of any sensor/entity (e.g. "pronto", "on", "running").
ai_tasks:
  - entity: sensor.claude_ai_task
    name: Claude AI Task
  - entity: sensor.deepseek_r1
    name: DeepSeek R1 (free)

ai_tasks_yaml_link: /lovelace/ai      # Optional: link button at the bottom of the card
```

---

### Config reference

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `color` | string | `#D97757` | Base hex color for the InfiniteColor palette |
| `theme` | string | `dark` | `dark`, `light`, or `auto` |
| `name` | string | `Massimo` | Name used in the header greeting |
| `location` | string | — | Location label shown next to the date |
| `weather.entity` | string | — | Main weather entity (required) |
| `weather.internal_sensor` | string | — | Indoor temperature sensor |
| `presence.entity` | string | — | `person.*` entity |
| `presence.zone` | string | — | Zone entity shown as badge |
| `kpi.lights.total` | number | auto | Override total light count |
| `kpi.climate.entity` | string | same as `climate.entity` | Override climate entity in KPI |
| `kpi.security.alarm` | string | same as `security.alarm` | Override alarm entity in KPI |
| `kpi.security.door` | string | same as `security.door` | Override door entity in KPI |
| `lights` | list | — | Light entities for Row 3 |
| `climate.entity` | string | — | Climate entity for Row 4 |
| `climate.name` | string | `RISCALDAMENTO` | Label above temperatures |
| `climate.external_temp` | string | — | Outdoor temperature sensor |
| `security.alarm` | string | — | Alarm control panel entity |
| `security.door` | string | — | Door binary sensor |
| `security.yaml_link` | string | — | Navigation link in security card |
| `updates` | list | — | `update.*` entities for Row 5 |
| `ai_tasks` | list | — | Sensor/entity list for AI tasks |
| `ai_tasks_yaml_link` | string | — | Navigation link in AI tasks card |

---

### Light card states

| Attribute | Shown as |
|-----------|----------|
| `state: on` | Green dot + "On" + brightness bar filled |
| `state: off` | Dim dot + "Off" + last changed time |
| `attributes.brightness` | Percentage label + bar fill (0–100%) |
| `attributes.color_temp_kelvin` | Amber badge with K value (when on) |

### Security badge colors

| State | Color |
|-------|-------|
| Alarm `disarmed` | Green dot · `ok` badge |
| Alarm any other state | Red dot · `!` badge |
| Door `off` / `closed` | Green dot · `ok` badge |
| Door `on` / `open` | Red dot · `!` badge |

### Update badge colors

| Entity state | Badge color |
|-------------|-------------|
| `off` (up to date) | Green |
| `on` (update available) | Amber |

---

*When this card matures, it will graduate to [WeSmart-InfiniteColor](../WeSmart-InfiniteColor/).*

---

## wesmart-labs-clean-panel

Modern home overview card with a minimal, breathing layout inspired by the Anthropic / Claude AI light aesthetic. Designed for tablet use in panel mode.

**Sections:**
- **Header** — live clock, greeting, presence status
- **Weather + Climate** — side by side, large numbers, minimal text
- **Lights** — slim interactive rows with brightness bar and color temperature badge
- **Doors & Entries** — chip grid, color-coded open/closed state

Clicking a light row toggles the entity. Navigation links scroll to other Lovelace views.

### Installation

Same as Home Panel — copy the `.js` file to `config/www/` and add the resource in HA Settings → Dashboards → Resources.

---

### YAML — Minimal

```yaml
type: custom:wesmart-labs-clean-panel
color: '#D97757'
theme: auto
name: Massimo
weather:
  entity: weather.forecast_home
presence:
  entity: person.massimo
lights:
  - entity: light.cucina_parete_yeelight
    name: Cucina
doors:
  - entity: binary_sensor.portone
    name: Portone
```

---

### YAML — Complete

```yaml
type: custom:wesmart-labs-clean-panel

# ── Palette & theme ────────────────────────────────────────────────────────
color: '#D97757'          # Hex color — drives the InfiniteColor palette
theme: auto               # dark | light | auto

# ── Header ─────────────────────────────────────────────────────────────────
name: Massimo             # Greeting name — "Buongiorno, Massimo"
location: Sora            # Shown next to the date in the header

# ── Presence (header dot) ──────────────────────────────────────────────────
presence:
  entity: person.massimo
  zone: zone.home         # Optional: shown as location text when at home

# ── Weather ────────────────────────────────────────────────────────────────
weather:
  entity: weather.forecast_home
  internal_sensor: sensor.temperature_home  # Optional: indoor sensor

# ── Climate ────────────────────────────────────────────────────────────────
climate:
  entity: climate.aqara_trv_e1
  name: CLIMA             # Optional label (default: CLIMA)

# ── Lights ─────────────────────────────────────────────────────────────────
# Each row shows: state dot · name · brightness bar · % · K badge
# Clicking a row toggles the light.
lights:
  details_link: /lovelace/luci          # Optional: "Tutte le luci →" link
  - entity: light.cucina_parete_yeelight
    name: Cucina — Yeelight
  - entity: light.camera_da_letto
    name: Camera da letto
  - entity: light.cortesia_rientro
    name: Cortesia Rientro

# ── Doors ──────────────────────────────────────────────────────────────────
# Displayed as a 2-column chip grid. Green = closed, red = open.
doors:
  details_link: /lovelace/sicurezza     # Optional: "Sicurezza →" link
  - entity: binary_sensor.portone
    name: Portone d'ingresso
  - entity: binary_sensor.finestra_cucina
    name: Finestra cucina
  - entity: binary_sensor.finestra_soggiorno
    name: Finestra soggiorno
```

---

### Config reference

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `color` | string | `#D97757` | Base hex color |
| `theme` | string | `auto` | `dark`, `light`, or `auto` |
| `name` | string | — | Name in the greeting |
| `location` | string | — | Location in the date line |
| `presence.entity` | string | — | `person.*` entity for header dot |
| `presence.zone` | string | — | Zone label when at home |
| `weather.entity` | string | — | Weather entity |
| `weather.internal_sensor` | string | — | Indoor temperature sensor |
| `climate.entity` | string | — | Climate entity |
| `climate.name` | string | `CLIMA` | Section label |
| `lights` | list | — | Light entities (each needs `entity`, optional `name`) |
| `lights.details_link` | string | — | Navigation path for "Tutte le luci →" |
| `doors` | list | — | Binary sensor entities |
| `doors.details_link` | string | — | Navigation path for "Sicurezza →" |

### Color temperature badge scale

| Range | Color | Tone |
|-------|-------|------|
| < 2500 K | Amber | Candlelight |
| 2500–3500 K | Warm orange | Incandescent |
| 3500–4500 K | Gold | Warm white |
| 4500–5500 K | Slate | Neutral white |
| > 5500 K | Blue-grey | Daylight |

---

*When this card matures, it will graduate to [WeSmart-InfiniteColor](../WeSmart-InfiniteColor/).*

---

## wesmart-labs-surface

**The cardless dashboard.** No containers, no borders, no shadows. Content lives directly on the background — hierarchy expressed only through scale, weight, color, and space.

**What makes it different from every other card:**
- Zero card containers — all elements float on the panel background
- A single thin **accent gradient rule** after the header — the only decoration
- Sections divided by a 1px hairline and whitespace, not boxes
- Light rows **bleed to the panel edges on hover** — the whole row feels interactive
- Temperature numbers at 58px weight 200 — dominant and effortless
- Color temp shown as a tiny 8px spectrum dot (warm → cool), not a text badge

```
  HOME                                  18:42
  Buongiorno, Massimo        18 mar · Sora
  ● In casa
  ─────────── (accent gradient, fades right)
  METEO               CLIMA
  7.8°                21° → 20°
  Parz. nuvoloso · 67%     att.   target
  Vento N 7.9 km/h         ● Riscaldamento
  ─────────────────────────────────────────
  LUCI                            2 accese
  ● Cucina       ────────────   75%  ⬤warm
  ● Camera       ───────        30%  ⬤warm
  ○ Cortesia                         Tutte le luci ↗
  ─────────────────────────────────────────
  PORTE & INGRESSI
  ● Portone d'ingresso              Chiuso
  ● Finestra cucina                 Chiusa
                                    Sicurezza ↗
```

### Installation

Copy `wesmart-labs-surface.js` to `config/www/`, add it as a JavaScript module resource in HA → Settings → Dashboards → Resources, then hard refresh.

---

### YAML — Minimal

```yaml
type: custom:wesmart-labs-surface
color: '#D97757'
theme: auto
name: Massimo
weather:
  entity: weather.forecast_home
presence:
  entity: person.massimo
lights:
  - entity: light.cucina_parete_yeelight
    name: Cucina
doors:
  - entity: binary_sensor.portone
    name: Portone
```

---

### YAML — Complete

```yaml
type: custom:wesmart-labs-surface

color: '#D97757'    # Any hex — drives the entire InfiniteColor palette
theme: auto         # dark | light | auto

name: Massimo       # Greeting name
location: Sora      # Shown next to the date

presence:
  entity: person.massimo
  zone: zone.home                        # Zone label shown when at home

weather:
  entity: weather.forecast_home
  internal_sensor: sensor.temperature_home   # Indoor sensor (optional)
  details_link: /lovelace/meteo              # Nav link "Previsioni ↗" (optional)

climate:
  entity: climate.aqara_trv_e1
  name: CLIMA                                # Kicker label (optional)

# Rows: dot · name · full-width brightness bar · % · color-temp dot
# Clicking a row toggles the light.
lights:
  details_link: /lovelace/luci               # Nav link "Tutte le luci ↗" (optional)
  - entity: light.cucina_parete_yeelight
    name: Cucina — Yeelight
  - entity: light.camera_da_letto
    name: Camera da letto
  - entity: light.cortesia_rientro
    name: Cortesia Rientro

# Rows: dot · name · status text (Chiuso / Aperto)
doors:
  details_link: /lovelace/sicurezza          # Nav link "Sicurezza ↗" (optional)
  - entity: binary_sensor.portone
    name: Portone d'ingresso
  - entity: binary_sensor.finestra_cucina
    name: Finestra cucina
```
