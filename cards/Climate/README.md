# WeSmart Climate Card

Una card personalizzata per Home Assistant per entità clima, ispirata all'estetica **Anthropic WeSmart AI**.

## Anteprima

Card scura con accenti arancioni caldi (riscaldamento) o blu freddi (raffreddamento), animazioni fluide e design minimale.

- Sfondo: carbone caldo scuro `#292524`
- Accento riscaldamento: arancione Claude `#D97757`
- Accento raffreddamento: blu Claude `#60B4D8`
- Animazione pulse glow durante riscaldamento/raffreddamento attivo

## Funzionalità

- Accendi/spegni (toggle nell'header)
- Display temperatura corrente grande
- Temperatura target con pulsanti **+** / **−**
- Display umidità (se riportato dall'entità)
- Selettore modalità HVAC (Caldo, Freddo, Auto, Asciutto, Ventilatore…)
- Selettore modalità ventilatore (opzionale)
- Display range per modalità `heat_cool` (min–max)
- Overlay stato non disponibile
- Responsive e touch-friendly

## Installazione

### Manuale

1. Copia `wesmart-climate-card.js` nella cartella config di Home Assistant:
   ```
   config/www/wesmart-climate-card.js
   ```

2. In Home Assistant → **Impostazioni → Dashboard → Risorse**, aggiungi:
   ```
   /local/wesmart-climate-card.js   (modulo JavaScript)
   ```

3. Ricarica il browser (hard refresh: Cmd+Shift+R / Ctrl+Shift+R).

## Configurazione

```yaml
type: custom:wesmart-climate-card
entity: climate.living_room
```

### Tutte le opzioni

| Opzione | Tipo | Default | Descrizione |
|---------|------|---------|-------------|
| `entity` | string | — | **Obbligatorio.** Entità `climate.*` |
| `name` | string | auto | Sovrascrittura nome visualizzato |
| `icon` | string | auto | Sovrascrittura icona (mdi:*) |
| `show_fan_mode` | boolean | `true` | Mostra selettore modalità ventilatore |
| `temp_step` | number | auto | Sovrascrittura passo temperatura (es. `0.5`) |

### Esempio con tutte le opzioni

```yaml
type: custom:wesmart-climate-card
entity: climate.bedroom_ac
name: Clima Camera
icon: mdi:air-conditioner
show_fan_mode: true
temp_step: 0.5
```

## Modalità HVAC

La card visualizza solo le modalità riportate dall'entità tramite `hvac_modes`.

| Modalità | Icona | Etichetta |
|----------|-------|-----------|
| `off` | mdi:power-off | Off |
| `heat` | mdi:fire | Caldo |
| `cool` | mdi:snowflake | Freddo |
| `heat_cool` | mdi:sun-snowflake | Range |
| `auto` | mdi:thermostat-auto | Auto |
| `dry` | mdi:water-off-outline | Asciutto |
| `fan_only` | mdi:fan | Ventilatore |

## Stati visivi

| Azione HVAC | Effetto card |
|-------------|-------------|
| `heating` | Glow arancione + animazione pulse |
| `cooling` | Glow blu + animazione pulse |
| `idle` | Nessun glow, colori neutri |
| `off` | Controlli attenuati, toggle off |
| `unavailable` | Overlay con icona disconnessione |

---
---

# WeSmart Climate Card

A custom Home Assistant climate entity card styled after the **Anthropic WeSmart AI** aesthetic.

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

1. Copy `wesmart-climate-card.js` to your Home Assistant config folder:
   ```
   config/www/wesmart-climate-card.js
   ```

2. In Home Assistant → **Settings → Dashboards → Resources**, add:
   ```
   /local/wesmart-climate-card.js   (JavaScript module)
   ```

3. Reload the browser (hard refresh: Cmd+Shift+R / Ctrl+Shift+R).

## Configuration

```yaml
type: custom:wesmart-climate-card
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
type: custom:wesmart-climate-card
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
