# WeSmart Weather Card

Card personalizzata per Home Assistant che mostra le condizioni meteo correnti e il forecast giornaliero o orario, in stile WeSmart dark carbone con icona colorata per condizione.

---

## Anteprima layout

```
┌─────────────────────────────────────────┐
│ ⛅ Meteo                                │
│    Milano · Partly Cloudy               │
├─────────────────────────────────────────┤
│                                         │
│  ( ⛅ )    18°C                         │
│            Partly Cloudy                │
│            Feels like 16°C              │
│                                         │
│  💧 65%   💨 12 km/h NE   ☀️ UV 3      │
├─────────────────────────────────────────┤
│  ┌──────┬──────┬──────┬──────┬──────┐  │
│  │Today │ Tue  │ Wed  │ Thu  │ Fri  │  │
│  │  ⛅  │  ☀️  │  🌧️  │  ☀️  │  ⛅  │  │
│  │ 18°  │ 24°  │ 15°  │ 23°  │ 20°  │  │
│  │ 12°  │ 14°  │  9°  │ 14°  │ 13°  │  │
│  │  40% │      │  80% │      │  20% │  │
│  └──────┴──────┴──────┴──────┴──────┘  │
└─────────────────────────────────────────┘
```

---

## Installazione

1. Copia `wesmart-weather-card.js` in `config/www/`
2. In Home Assistant → **Impostazioni → Dashboard → Risorse**, aggiungi:

   | URL | Tipo |
   |-----|------|
   | `/local/wesmart-weather-card.js` | JavaScript module |

3. Hard refresh: `Cmd+Shift+R` (macOS) / `Ctrl+Shift+R` (Windows/Linux)

---

## Configurazione

### Minima

```yaml
type: custom:wesmart-weather-card
entity: weather.home
```

### Completa

```yaml
type: custom:wesmart-weather-card
entity: weather.home
title: Milano
theme: dark
forecast_type: daily
forecast_days: 5
show_humidity: true
show_wind: true
show_pressure: false
show_visibility: false
```

### Forecast orario

```yaml
type: custom:wesmart-weather-card
entity: weather.home
forecast_type: hourly
forecast_days: 6
```

---

## Opzioni

| Opzione | Tipo | Default | Descrizione |
|---------|------|---------|-------------|
| `entity` | string | — | **Obbligatorio.** Entità `weather.*` |
| `title` | string | friendly_name | Titolo nell'header |
| `icon` | string | auto | Override icona header (altrimenti usa icona condizione) |
| `theme` | string | `'dark'` | `dark` \| `light` \| `auto` |
| `forecast_type` | string | `'daily'` | `daily` \| `hourly` |
| `forecast_days` | number | `5` | Numero di slot forecast (1–7) |
| `show_humidity` | boolean | `true` | Mostra umidità nelle stats |
| `show_wind` | boolean | `true` | Mostra vento nelle stats |
| `show_pressure` | boolean | `false` | Mostra pressione nelle stats |
| `show_visibility` | boolean | `false` | Mostra visibilità nelle stats |

---

## Funzionalità

### Condizioni correnti
- **Icona condizione** grande (44px) con colore specifico per condizione + glow effect sull'anello
- **Temperatura** a caratteri grandi (58px) con unità
- **Feels like** (apparent_temperature) se disponibile
- **Label condizione** testo leggibile (es. "Partly cloudy")

### Stats strip
Pills compatte con le statistiche disponibili:
- Umidità `💧`
- Vento `💨` con velocità, unità e direzione cardinale (N, NE, E…)
- Pressione `🌡` (opzionale)
- Visibilità `👁` (opzionale)
- UV Index (mostrato automaticamente se disponibile nell'entità)

### Forecast
- Fetch via **WebSocket API** `weather/get_forecasts` (HA 2023.9+)
- **Fallback automatico** all'attributo `forecast` per integrazioni più vecchie
- Refresh ogni **30 minuti**
- Ogni slot mostra:
  - Giorno abbreviato (Mon, Tue…) o orario (hourly)
  - **"Today"** evidenziato in arancione per il giorno corrente
  - Icona condizione colorata
  - Temperatura massima (in grassetto)
  - Temperatura minima (in grigio scuro)
  - Probabilità precipitazioni in blu (solo se > 0%)

---

## Colori per condizione

| Condizione | Icona | Colore |
|------------|-------|--------|
| `sunny` | `mdi:weather-sunny` | Giallo `#F0C060` |
| `clear-night` | `mdi:weather-night` | Viola `#8890C8` |
| `partlycloudy` | `mdi:weather-partly-cloudy` | Caldo `#C0A878` |
| `cloudy` | `mdi:weather-cloudy` | Grigio `#8890A0` |
| `rainy` | `mdi:weather-rainy` | Blu `#60B4D8` |
| `pouring` | `mdi:weather-pouring` | Blu scuro `#4090C0` |
| `snowy` | `mdi:weather-snowy` | Ghiaccio `#A8C8E0` |
| `snowy-rainy` | `mdi:weather-snowy-rainy` | Blu ghiaccio `#80A8C8` |
| `windy` | `mdi:weather-windy` | Verde `#8FBC8F` |
| `fog` | `mdi:weather-fog` | Grigio caldo `#A0988A` |
| `hail` | `mdi:weather-hail` | Blu `#70A8C8` |
| `lightning` | `mdi:weather-lightning` | Ambra `#D4A84B` |
| `lightning-rainy` | `mdi:weather-lightning-rainy` | Arancione `#C07830` |
| `exceptional` | `mdi:alert-circle` | Arancione WeSmart `#D97757` |

---

## Unità di misura

Auto-rilevate dagli attributi dell'entità:

| Dato | Attributo HA | Fallback |
|------|-------------|---------|
| Temperatura | `temperature_unit` | `°C` |
| Vento | `wind_speed_unit` | `km/h` |
| Pressione | `pressure_unit` | `hPa` |
| Visibilità | `visibility_unit` | `km` |

---

## Temi

| Tema | Sfondo | Superfici |
|------|--------|-----------|
| `dark` | `#292524` | `#332E2A` |
| `light` | `#FFFEFA` | `#F5F0EB` |
| `auto` | — | Segue `prefers-color-scheme` |

---

## Esempi

### Meteo casa (classico)

```yaml
type: custom:wesmart-weather-card
entity: weather.home
title: Casa
theme: dark
```

### Forecast esteso con tutte le stats

```yaml
type: custom:wesmart-weather-card
entity: weather.home
forecast_days: 7
show_humidity: true
show_wind: true
show_pressure: true
show_visibility: true
```

### Forecast orario

```yaml
type: custom:wesmart-weather-card
entity: weather.home
title: Prossime ore
forecast_type: hourly
forecast_days: 6
show_pressure: false
```

### Tema chiaro

```yaml
type: custom:wesmart-weather-card
entity: weather.openweathermap
title: Meteo
theme: light
forecast_days: 5
```

---

## Compatibilità

Funziona con qualsiasi integrazione `weather.*` in Home Assistant.

**Forecast WebSocket API** (HA 2023.9+): `weather/get_forecasts`
**Fallback automatico** all'attributo `forecast` per integrazioni precedenti.

Integrazioni testate: Met.no, OpenWeatherMap, AccuWeather, Météo-France, SMHI, Yr, Bureau of Meteorology, Tomorrow.io, Pirate Weather.

---

## Architettura

```
wesmart-weather-card.js
  └─ class WeSmartWeatherCard extends HTMLElement
      ├─ attachShadow({ mode: 'open' })     → styling isolato
      ├─ setConfig(config)                  → parsing YAML, build HTML
      ├─ set hass(hass)                     → _update() + fetch forecast se scaduto
      ├─ _fetchForecast()                   → async WS API + fallback attributo
      ├─ _render()                          → CSS + DOM iniziale
      ├─ _update()                          → aggiorna condizioni correnti + stats
      ├─ _renderStats(attrs, unit)          → pills dinamiche per ogni stat
      └─ _renderForecast()                  → row forecast con icone e temp

customElements.define('wesmart-weather-card', ...)
```

Nessun build step. Nessuna dipendenza. Vanilla JS puro.
