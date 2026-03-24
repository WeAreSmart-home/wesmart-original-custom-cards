# WeSmart Custom Cards — Home Assistant

Una collezione di card personalizzate per il Dashboard di Home Assistant, ispirate all'estetica **Anthropic WeSmart AI**: tema scuro carbone caldo, accento arancione, tipografia minimale.

---

## Card

| Card | File | Tipo entità | Tema |
|------|------|-------------|-------|
| [WeSmart Light Card](#wesmart-light-card) | `Light/wesmart-light-card.js` | `light.*` | Dark / Light / Auto |
| [WeSmart Lights Card](#wesmart-lights-card) | `Lights/wesmart-lights-card.js` | `light.*` (multi) | Dark / Light / Auto |
| [WeSmart Lights Expand Card](#wesmart-lights-expand-card) | `Lights/wesmart-lights-expand-card.js` | `light.*` (multi) | Dark / Light / Auto |
| [WeSmart Climate Card](#wesmart-climate-card) | `Climate/wesmart-climate-card.js` | `climate.*` | Dark / Light / Auto |
| [WeSmart Climate Compact Card](#wesmart-climate-compact-card) | `Climate/wesmart-climate-compact-card.js` | `climate.*` (multi) | Dark / Light / Auto |
| [WeSmart Sensors Card](#wesmart-sensors-card) | `Sensors/wesmart-sensors-card.js` | `sensor.*` (multi) | Dark / Light / Auto |
| [WeSmart Doors Card](#wesmart-doors-card) | `Doors/wesmart-doors-card.js` | `binary_sensor.*` (multi) | Dark / Light / Auto |
| [WeSmart History Card](#wesmart-history-card) | `History/wesmart-history-card.js` | qualsiasi (multi) | Dark / Light / Auto |
| [WeSmart Buttons Bar Card](#wesmart-buttons-bar-card) | `Buttons/wesmart-buttons-bar-card.js` | qualsiasi / service | Dark / Light / Auto |
| [WeSmart Buttons Grid Card](#wesmart-buttons-grid-card) | `Buttons/wesmart-buttons-grid-card.js` | qualsiasi / service | Dark / Light / Auto |
| [WeSmart Battery Status Card](#wesmart-battery-status-card) | `Battery/wesmart-battery-status-card.js` | `sensor.*` (multi) | Dark / Light / Auto |
| [WeSmart Switches Card](#wesmart-switches-card) | `Switches/wesmart-switches-card.js` | `switch.*` (multi) | Dark / Light / Auto |
| [WeSmart Clock Card](#wesmart-clock-card) | `Clock/wesmart-clock-card.js` | qualsiasi (max 3 extra) | Dark / Light / Auto |
| [**WeSmart Energy Flow Card**](#wesmart-energy-flow-card) | `Energy/wesmart-energy-flow-card.js` | `sensor.*` (power/energy) | Dark / Light / Auto |
| [**WeSmart Media Player Card**](#wesmart-media-player-card) | `MediaPlayer/wesmart-media-player-card.js` | `media_player.*` | Dark / Light / Auto |
| [**WeSmart Weather Card**](#wesmart-weather-card) | `Weather/wesmart-weather-card.js` | `weather.*` | Dark / Light / Auto |
| [**WeSmart Chart Card**](#wesmart-chart-card) | `Chart/wesmart-chart-card.js` | qualsiasi / multi | Dark / Light / Auto |
| [**WeSmart Infinite Chart Card**](#wesmart-infinite-chart-card) | `Chart/wesmart-infinite-chart-card.js` | qualsiasi / multi | Palette dinamica |

---

## Installazione

### 1. Copia i file

Copia il file `.js` di ogni card che vuoi usare in `config/www/`:

```
config/www/wesmart-light-card.js
config/www/wesmart-lights-card.js
config/www/wesmart-lights-expand-card.js
config/www/wesmart-climate-card.js
config/www/wesmart-climate-compact-card.js
config/www/wesmart-sensors-card.js
config/www/wesmart-doors-card.js
config/www/wesmart-history-card.js
config/www/wesmart-buttons-bar-card.js
config/www/wesmart-buttons-grid-card.js
config/www/wesmart-battery-status-card.js
config/www/wesmart-switches-card.js
config/www/wesmart-clock-card.js
config/www/wesmart-chart-card.js
config/www/wesmart-infinite-chart-card.js
config/www/wesmart-energy-flow-card.js
config/www/wesmart-media-player-card.js
config/www/wesmart-weather-card.js
```

### 2. Aggiungi le risorse

In Home Assistant → **Impostazioni → Dashboard → Risorse**, aggiungi una voce per card:

| URL | Tipo |
|-----|------|
| `/local/wesmart-light-card.js` | Modulo JavaScript |
| `/local/wesmart-lights-card.js` | Modulo JavaScript |
| `/local/wesmart-lights-expand-card.js` | Modulo JavaScript |
| `/local/wesmart-climate-card.js` | Modulo JavaScript |
| `/local/wesmart-climate-compact-card.js` | Modulo JavaScript |
| `/local/wesmart-sensors-card.js` | Modulo JavaScript |
| `/local/wesmart-doors-card.js` | Modulo JavaScript |
| `/local/wesmart-history-card.js` | Modulo JavaScript |
| `/local/wesmart-buttons-bar-card.js` | Modulo JavaScript |
| `/local/wesmart-buttons-grid-card.js` | Modulo JavaScript |
| `/local/wesmart-battery-status-card.js` | Modulo JavaScript |
| `/local/wesmart-switches-card.js` | Modulo JavaScript |
| `/local/wesmart-clock-card.js` | Modulo JavaScript |
| `/local/wesmart-chart-card.js` | Modulo JavaScript |
| `/local/wesmart-infinite-chart-card.js` | Modulo JavaScript |
| `/local/wesmart-energy-flow-card.js` | Modulo JavaScript |
| `/local/wesmart-media-player-card.js` | Modulo JavaScript |
| `/local/wesmart-weather-card.js` | Modulo JavaScript |

### 3. Ricarica

Hard refresh del browser: `Cmd+Shift+R` (macOS) / `Ctrl+Shift+R` (Windows/Linux).

---

## Token di Design

Tutte le card condividono le stesse proprietà CSS personalizzate:

| Token | Valore | Utilizzo |
|-------|--------|----------|
| `--claude-bg` | `#1C1917` | Sfondo pagina |
| `--claude-surface` | `#292524` | Sfondo card |
| `--claude-surface-2` | `#332E2A` | Superfici interne, slider |
| `--claude-border` | `rgba(255,255,255,0.08)` | Bordi |
| `--claude-orange` | `#D97757` | Accento primario |
| `--claude-blue` | `#60B4D8` | Accento raffreddamento (clima) |
| `--claude-text` | `#F5F0EB` | Testo primario |
| `--claude-text-muted` | `#A09080` | Testo secondario |
| `--claude-text-dim` | `#6B5F56` | Testo terziario, etichette |
| `--claude-radius` | `20px` | Border radius card |
| `--claude-radius-sm` | `12px` | Elementi interni |
| `--claude-radius-xs` | `8px` | Pulsanti, elementi piccoli |

**Tema light** (claude-lights-card, claude-sensors-card, claude-doors-card, claude-history-card):

| Token | Valore |
|-------|--------|
| `--bg` | `#FFFEFA` |
| `--surface` | `#F5F0EB` |
| `--border` | `rgba(28,25,23,0.09)` |
| `--text` | `#1C1917` |

---

## Architettura

Tutte le card seguono lo stesso pattern:

```
Singolo file JS
  └─ class extends HTMLElement
      ├─ attachShadow({ mode: 'open' })    → DOM + stili isolati
      ├─ setConfig(config)                 → parsing config YAML, chiama _render()
      ├─ set hass(hass)                    → riceve aggiornamenti di stato, chiama _updateState()
      ├─ _render()                         → inietta <style> + HTML card nel shadow DOM
      ├─ _updateState()                    → aggiorna DOM da hass.states
      └─ _bindEvents()                     → aggiunge listener click/pointer

customElements.define('claude-*-card', ...)
window.customCards.push({ type, name, description })
```

Nessun build step. Nessuna dipendenza. Vanilla JS puro.

---

## WeSmart Light Card

Entità luce singola con controlli completi. — **v1.3.0**

```yaml
type: custom:wesmart-light-card
entity: light.living_room
```

**Opzioni:**

| Opzione | Tipo | Default | Descrizione |
|---------|------|---------|-------------|
| `entity` | string | — | **Obbligatorio.** Entità `light.*` |
| `name` | string | auto | Sovrascrittura nome visualizzato |
| `icon` | string | auto | Sovrascrittura icona (mdi:*) |
| `theme` | string | `'dark'` | `dark` \| `light` \| `auto` |
| `show_brightness` | boolean | `true` | Slider luminosità |
| `show_color_temp` | boolean | `true` | Slider Kelvin/CT (solo per luci che la supportano) |
| `show_color` | boolean | `true` | Slider tonalità (hue) per luci a colori |
| `collapse_when_off` | boolean | `false` | Nasconde i controlli da spenta; si apre automaticamente all'accensione |

**Funzionalità:** toggle · slider luminosità · slider Kelvin/CT · slider tonalità hue · collasso automatico con animazione · pulse glow quando accesa · overlay non disponibile

**Rileva automaticamente** le capacità da `supported_color_modes`. Supporta attributi Kelvin moderni (`color_temp_kelvin`, `min_color_temp_kelvin`, `max_color_temp_kelvin`) di HA 2022.9+ e legacy mireds. Lo slider hue è minimal, stesso stile degli altri slider.

**Temi:** `dark` · `light` · `auto`

---

## WeSmart Lights Card

Più entità luce in una lista compatta con toggle individuali.

```yaml
type: custom:wesmart-lights-card
title: Soggiorno
theme: dark
entities:
  - light.ceiling
  - entity: light.floor_lamp
    name: Piantana
    icon: mdi:floor-lamp
```

**Opzioni:**

| Opzione | Tipo | Default | Descrizione |
|---------|------|---------|-------------|
| `title` | string | `'Lights'` | Intestazione card |
| `icon` | string | `mdi:lightbulb-group` | Icona header |
| `theme` | string | `'dark'` | `dark` \| `light` \| `auto` |
| `entities` | list | — | **Obbligatorio.** Lista entità luce |

**Campi elemento entità:** `entity` (req) · `name` · `icon`

**Funzionalità:** toggle master · toggle per riga · testo stato (luminosità + CT) · sottotitolo "N di M accese" · tap riga → More Info · oscuramento non disponibile

**Temi:**
- `dark` — carbone caldo (default)
- `light` — crema calda `#FFFEFA`
- `auto` — segue `prefers-color-scheme` di sistema

---

## WeSmart Lights Expand Card

Stesso layout a lista della WeSmart Lights Card, ma cliccando una riga si **espande un pannello inline** con slider animati di luminosità e temperatura colore — senza lasciare il dashboard.

```yaml
type: custom:wesmart-lights-expand-card
title: Soggiorno
theme: dark
entities:
  - light.ceiling
  - entity: light.floor_lamp
    name: Piantana
    icon: mdi:floor-lamp
```

**Opzioni:**

| Opzione | Tipo | Default | Descrizione |
|---------|------|---------|-------------|
| `title` | string | `'Lights'` | Intestazione card |
| `icon` | string | `mdi:lightbulb-group` | Icona header |
| `theme` | string | `'dark'` | `dark` \| `light` \| `auto` |
| `entities` | list | — | **Obbligatorio.** Lista entità luce |

**Campi elemento entità:** `entity` (req) · `name` · `icon`

**Funzionalità:**
- Toggle master (tutte on/off) · toggle per riga
- Clic su una riga (fuori dal toggle) → **pannello espandibile animato**
- Un solo pannello aperto alla volta; clic sulla stessa riga lo chiude
- Il pannello espanso mostra:
  - **Slider luminosità** — visibile solo quando la luce è accesa e supporta la luminosità
  - **Slider temperatura colore** — gradiente caldo→freddo, visibile solo quando `color_temp` è disponibile
  - Suggerimento "Accendi per regolare" quando la luce è spenta
- Il trascinamento degli slider applica le modifiche a HA al rilascio del puntatore
- Sottotitolo header: "N di M accese" / "Tutte accese" / "Tutte spente"
- Entità non disponibili oscurate e non interattive

**Animazioni:**

| Elemento | Effetto |
|---------|--------|
| Icona chevron | Ruota 180° all'espansione (`transform` + `cubic-bezier`) |
| Pannello | Fisarmonica: transizione `max-height` + `opacity` |
| Contenuto pannello | Scorre verso l'alto (`translateY`) |
| Cursore slider | Anello glow durante il trascinamento |
| Bordo pannello | Appare progressivamente all'apertura |

**Temi:** `dark` · `light` · `auto`

---

## WeSmart Climate Card

Entità clima singola con controlli temperatura e selettore modalità.

```yaml
type: custom:wesmart-climate-card
entity: climate.living_room
```

**Opzioni:**

| Opzione | Tipo | Default | Descrizione |
|---------|------|---------|-------------|
| `entity` | string | — | **Obbligatorio.** Entità `climate.*` |
| `name` | string | auto | Sovrascrittura nome visualizzato |
| `icon` | string | auto | Sovrascrittura icona |
| `theme` | string | `'dark'` | `dark` \| `light` \| `auto` |
| `show_fan_mode` | boolean | `true` | Pill modalità ventilatore |
| `temp_step` | number | auto | Passo temperatura (es. `0.5`) |

**Funzionalità:** display temperatura corrente grande · badge umidità · temperatura target con pulsanti +/- · pill modalità HVAC · pill modalità ventilatore · doppio glow caldo/freddo · overlay non disponibile

**Temi:** `dark` · `light` · `auto`

**Modalità HVAC:** `off` · `heat` (glow arancione) · `cool` (glow blu) · `heat_cool` (display range) · `auto` · `dry` · `fan_only`

**Rileva automaticamente** `hvac_modes` e `fan_modes` dagli attributi dell'entità — vengono mostrate solo le modalità supportate.

---

## WeSmart Sensors Card

Più entità sensore in una lista compatta con badge valori e evidenziazione avvisi.

```yaml
type: custom:wesmart-sensors-card
title: Sensori Casa
theme: dark
entities:
  - sensor.temperature_soggiorno
  - sensor.humidity_soggiorno
  - entity: sensor.co2_cucina
    name: CO₂ Cucina
    alert_above: 800
  - entity: sensor.battery_door
    name: Batteria porta
```

**Opzioni:**

| Opzione | Tipo | Default | Descrizione |
|---------|------|---------|-------------|
| `title` | string | `'Sensors'` | Intestazione card |
| `icon` | string | `mdi:chart-line` | Icona header |
| `theme` | string | `'dark'` | `dark` \| `light` \| `auto` |
| `entities` | list | — | **Obbligatorio.** Lista entità sensore |

**Campi elemento entità:**

| Campo | Tipo | Descrizione |
|-------|------|-------------|
| `entity` | string | **Obbligatorio.** Entità `sensor.*` |
| `name` | string | Sovrascrittura nome visualizzato |
| `icon` | string | Sovrascrittura icona (mdi:*) |
| `device_class` | string | Forza device class (rilevata automaticamente se omessa) |
| `unit` | string | Sovrascrittura unità di misura |
| `color` | string | Sovrascrittura colore accento (hex) |
| `meta` | string | Sovrascrittura etichetta tipo sotto il nome |
| `alert_above` | number | Avviso se il valore supera questa soglia |
| `alert_below` | number | Avviso se il valore scende sotto questa soglia |

**Funzionalità:** badge valore con unità · colore per `device_class` · soglie avviso integrate · soglie personalizzate · sottotitolo header "N avvisi" · tap riga → More Info · oscuramento non disponibile

**Soglie avviso integrate** (attivate salvo override):

| device_class | Condizione avviso |
|---|---|
| `temperature` | < 10 °C o > 30 °C |
| `humidity` | < 30 % o > 70 % |
| `co2` | > 1000 ppm |
| `battery` | < 20 % |

**Device class supportate** (con icona + colore automatici):
`temperature` · `humidity` · `pressure` · `co2` · `pm25` · `pm10` · `illuminance` · `battery` · `voltage` · `current` · `power` · `energy` · `gas` · `water` · `signal_strength` · `moisture` · `aqi` · `speed` · `wind_speed`

**Temi:** `dark` · `light` · `auto` (come Lights card)

---

## WeSmart Doors Card

Più sensori binari porta/finestra/contatto in una lista con pill stato aperto/chiuso.

```yaml
type: custom:wesmart-doors-card
title: Porte & Finestre
theme: dark
entities:
  - binary_sensor.porta_ingresso
  - binary_sensor.finestra_cucina
  - entity: binary_sensor.garage
    name: Garage
    device_class: garage_door
```

**Opzioni:**

| Opzione | Tipo | Default | Descrizione |
|---------|------|---------|-------------|
| `title` | string | `'Doors & Windows'` | Intestazione card |
| `icon` | string | `mdi:door` | Icona header |
| `theme` | string | `'dark'` | `dark` \| `light` \| `auto` |
| `entities` | list | — | **Obbligatorio.** Lista entità binary sensor |

**Campi elemento entità:**

| Campo | Tipo | Descrizione |
|-------|------|-------------|
| `entity` | string | **Obbligatorio.** Entità `binary_sensor.*` |
| `name` | string | Sovrascrittura nome visualizzato |
| `icon` | string | Sovrascrittura icona (mdi:*) |
| `device_class` | string | Forza device class (rilevata automaticamente se omessa) |

**Funzionalità:** pill stato Aperto/Chiuso (arancione / verde) · righe aperte evidenziate · header mostra "N aperte" o "Tutte chiuse" · coppie icone per classe · tap riga → More Info · oscuramento non disponibile

**Device class supportate:**

| device_class | Etichetta aperto | Etichetta chiuso |
|---|---|---|
| `door` | Aperta | Chiusa |
| `window` | Aperta | Chiusa |
| `garage_door` | Aperto | Chiuso |
| `opening` | Aperta | Chiusa |
| `lock` | Sbloccata | Bloccata |
| `motion` | Rilevato | Assente |
| `vibration` | Rilevata | Assente |
| `moisture` | Bagnato | Asciutto |
| `smoke` | Rilevato | Assente |
| `gas` | Rilevato | Assente |

> Stato `binary_sensor` `on` = aperto/attivo · `off` = chiuso/assente

**Temi:** `dark` · `light` · `auto`

---

## WeSmart History Card

Card grafico storico multi-entità. Sostituisce la HA History Graph predefinita con una versione migliorata e interattiva.

```yaml
type: custom:wesmart-history-card
title: Storico Casa
theme: dark
hours: 24
entities:
  - light.soggiorno
  - sensor.temperatura_cucina
  - entity: binary_sensor.porta_ingresso
    name: Porta Ingresso
```

**Opzioni:**

| Opzione | Tipo | Default | Descrizione |
|---------|------|---------|-------------|
| `title` | string | `'History'` | Intestazione card |
| `icon` | string | `mdi:chart-line` | Icona header |
| `theme` | string | `'dark'` | `dark` \| `light` \| `auto` |
| `hours` | number | `24` | Range temporale default (`1` · `6` · `24` · `168`) |
| `entities` | list | — | **Obbligatorio.** Qualsiasi tipo di entità |

**Campi elemento entità:** `entity` (req) · `name` · `icon`

**Tipi di grafico (rilevati automaticamente):**
- Entità **binarie** → **barra timeline** arancione — periodi attivi in arancione, inattivi in scuro
- Entità **numeriche** → **grafico a linee SVG** con riempimento gradiente

**Funzionalità:**
- Pill temporali interattivi: `1h` · `6h` · `24h` · `7d`
- Badge stato corrente per entità (arancione quando attivo)
- Stat riepilogativa: `Attivo X%` per binario · `min – max unità` per numerico
- Etichette asse temporale · loader animato · Tap riga → More Info

**Temi:** `dark` · `light` · `auto`

---

## WeSmart Buttons Bar Card

Barra orizzontale compatta di pulsanti azione. Altezza ridotta, larghezza intera — ideale per righe di accesso rapido.

```yaml
type: custom:wesmart-buttons-bar-card
theme: dark
title: Azioni Rapide
buttons:
  - name: Luci
    icon: mdi:lightbulb
    entity: light.soggiorno
  - name: Film
    icon: mdi:movie-open
    service: scene.turn_on
    service_data:
      entity_id: scene.serata_film
  - name: TV
    icon: mdi:television
    entity: switch.tv
```

**Opzioni:**

| Opzione | Tipo | Default | Descrizione |
|---------|------|---------|-------------|
| `theme` | string | `'dark'` | `dark` \| `light` \| `auto` |
| `title` | string | — | Etichetta opzionale sopra i pulsanti |
| `buttons` | list | — | **Obbligatorio.** Lista pulsanti |

**Campi elemento pulsante:**

| Campo | Tipo | Descrizione |
|-------|------|-------------|
| `name` | string | Etichetta pulsante |
| `icon` | string | Icona MDI (es. `mdi:lightbulb`) |
| `entity` | string | Entità opzionale per tracciamento stato + toggle default |
| `service` | string | Service opzionale da chiamare (`dominio.service`) |
| `service_data` | object | Dati opzionali passati al service |

**Logica azione (dedotta):**
- Solo `entity` → chiama `homeassistant.toggle` al clic
- Solo `service` → chiama il service; nessuno stato attivo (animazione pressione al clic)
- Entrambi → chiama il service; l'entità traccia il colore attivo/inattivo
- Nessuno → pulsante decorativo

**Colori stato:**
- **Attivo** (`on`, `open`, `unlocked`, `detected`, `playing`, `armed_*`, …): sfondo arancione + glow
- **Inattivo**: sfondo surface, icona/etichetta attenuata
- **Non disponibile**: oscurato (opacity 0.35), non interattivo

**Temi:** `dark` · `light` · `auto`

---

## WeSmart Buttons Grid Card

Card quadrata con più pulsanti disposti in una griglia automatica. Ideale per stanze con molte azioni.

```yaml
type: custom:wesmart-buttons-grid-card
title: Casa
icon: mdi:home
theme: dark
columns: 3
buttons:
  - name: Luci Soggiorno
    icon: mdi:lightbulb
    entity: light.soggiorno
  - name: Luci Cucina
    icon: mdi:ceiling-light
    entity: light.cucina
  - name: TV
    icon: mdi:television
    entity: switch.tv
  - name: Film
    icon: mdi:movie-open
    service: scene.turn_on
    service_data:
      entity_id: scene.serata_film
  - name: Allarme
    icon: mdi:shield-home
    service: alarm_control_panel.alarm_arm_away
    service_data:
      entity_id: alarm_control_panel.casa
```

**Opzioni:**

| Opzione | Tipo | Default | Descrizione |
|---------|------|---------|-------------|
| `title` | string | — | Intestazione card opzionale |
| `icon` | string | `mdi:gesture-tap` | Icona header (usata quando `title` è impostato) |
| `theme` | string | `'dark'` | `dark` \| `light` \| `auto` |
| `columns` | number | auto | Forza numero fisso di colonne; ometti per `auto-fill` |
| `buttons` | list | — | **Obbligatorio.** Lista pulsanti |

**Campi elemento pulsante:** come Bar card (`name`, `icon`, `entity`, `service`, `service_data`)

**Funzionalità:**
- Griglia auto-fit o numero fisso di colonne
- Header opzionale con icona + titolo
- Stessa logica stati e colori della Bar card
- Animazione pressione per pulsanti service senza stato

**Temi:** `dark` · `light` · `auto`

---

## WeSmart Switches Card

Card toggle multi-entità con controllo icona interattivo.

```yaml
type: custom:wesmart-switches-card
title: Interruttori Cucina
entities:
  - switch.kettle
  - entity: light.counter_light
    name: Sottopensile
    icon: mdi:led-strip-variant
  - input_boolean.coffee_timer
```

**Opzioni:**

| Opzione | Tipo | Default | Descrizione |
|---------|------|---------|-------------|
| `title` | string | `'Switches'` | Intestazione card |
| `icon` | string | `mdi:toggle-switch` | Icona header |
| `theme` | string | `'dark'` | `dark` \| `light` \| `auto` |
| `entities` | list | — | **Obbligatorio.** Entità switch |

**Campi elemento entità:** `entity` (req) · `name` · `icon`

**Funzionalità:**
- **Icone interattive:** Clic sull'icona per cambiare stato; glow arancione quando ON.
- **Etichette stato:** Pill ON/OFF chiari per stato immediato.
- **More Info:** Clic sul testo della riga per aprire il dialogo service HA.

---

## WeSmart Climate Compact Card

Alternativa a righe alla card clima completa, ottimizzata per la gestione multi-zona.

```yaml
type: custom:wesmart-climate-compact-card
title: Riscaldamento Piano Superiore
icon: mdi:thermostat
theme: dark
entities:
  - climate.master_bedroom
  - entity: climate.guest_room
    name: Ospiti
  - climate.bathroom
```

**Opzioni:**

| Opzione | Tipo | Default | Descrizione |
|---------|------|---------|-------------|
| `title` | string | `'Climate Control'` | Intestazione card |
| `icon` | string | `mdi:thermostat` | Icona header |
| `theme` | string | `'dark'` | `dark` \| `light` \| `auto` |
| `entities` | list | — | **Obbligatorio.** Lista entità `climate.*` |

**Campi elemento entità:** `entity` (req) · `name`

**Funzionalità:**
- **Controlli in riga:** Pulsanti +/- regolano la temperatura target; il passo segue `target_temp_step` dell'entità (default 0.5)
- **Badge temperatura corrente:** Mostra la temperatura ambientale in tempo reale
- **Icona dinamica:** Cambia in base a `hvac_action` — fiamma arancione (riscaldamento), fiocco blu (raffreddamento), grigio (idle/off)
- **Modalità `heat_cool`:** Mostra il range `min°–max°`; pulsanti +/- disabilitati
- **Entità `off`:** Pulsanti +/- disabilitati (opacity ridotta)
- **Clic sulla riga** (fuori dai pulsanti) → More Info di HA
- **Entità non disponibili:** Oscurate e non interattive

**Temi:** `dark` · `light` · `auto`

---

## WeSmart Battery Status Card

Card monitoraggio batterie multi-entità con icone dinamiche e opzioni di visualizzazione.

```yaml
type: custom:wesmart-battery-status-card
title: Stato Batterie
display_type: circular
entities:
  - sensor.phone_battery
  - entity: sensor.tablet_battery
    name: Tablet
    display_type: linear
  - entity: sensor.watch_battery
    name: Orologio
    display_type: icon
```

**Opzioni:**

| Opzione | Tipo | Default | Descrizione |
|---------|------|---------|-------------|
| `title` | string | `'Batteries'` | Intestazione card |
| `icon` | string | `mdi:battery-check` | Icona header |
| `theme` | string | `'dark'` | `dark` \| `light` \| `auto` |
| `display_type` | string | `'icon'` | `icon` \| `linear` \| `circular` |
| `entities` | list | — | **Obbligatorio.** Entità sensore batteria |

**Campi elemento entità:** `entity` (req) · `name` · `display_type` (override)

**Funzionalità:**
- **Visualizzazioni:** `icon` (icona MDI dinamica) · `linear` (barra progresso) · `circular` (anello SVG animato)
- **Codice colore:** <15% arancione critico · <30% giallo warning · >30% verde attenuato
- **Header riepilogativo:** "N scariche" in arancione se una batteria è ≤ 20%

---

## WeSmart Clock Card

Orologio ambient elegante con informazioni entità extra opzionali in una barra inferiore o sidebar sinistra.

```yaml
type: custom:wesmart-clock-card
theme: dark
extras_layout: sidebar
translate_weather: true
extra_entities:
  - weather.home
  - entity: sensor.outdoor_temperature
    icon: mdi:thermometer-high
  - entity: sensor.humidity
    icon: mdi:water-percent
```

**Opzioni:**

| Opzione | Tipo | Default | Descrizione |
|---------|------|---------|-------------|
| `theme` | string | `'dark'` | `dark` \| `light` \| `auto` |
| `time_format` | number | `24` | `12` o `24` |
| `extras_layout` | string | `'bottom'` | `bottom` \| `sidebar` — posizione info extra |
| `translate_weather` | boolean | `false` | Traduci stati `weather.*` in italiano |
| `extra_entities` | list | `[]` | Fino a **3** entità da visualizzare |

**Campi elemento entità:** `entity` (req) · `icon` (MDI personalizzato, ignorato per `weather.*`)

**Funzionalità:**
- Barra inferiore: fino a 3 elementi, larghezza intera equamente divisa, senza scorrimento
- Sidebar: colonna sinistra stretta (78px), elementi impilati verticalmente
- Ogni elemento mostra solo **icona + valore stato** — nessun nome o etichetta
- Entità weather: icona automatica; traduzione italiana opzionale
- Responsive: gli elementi restano sempre nei limiti della card

**Temi:** `dark` · `light` · `auto`

---

## WeSmart Infinite Color Card

Card storico con motore HSL che genera l'intera palette da un singolo colore di input.

```yaml
type: custom:wesmart-infinite-color-card
title: Storico Casa
color: '#f73747'
theme: dark
hours: 24
entities:
  - light.soggiorno
  - sensor.temperatura
  - binary_sensor.porta_ingresso
```

**Opzioni:**

| Opzione | Tipo | Default | Descrizione |
|---------|------|---------|-------------|
| `color` | string | `'#D97757'` | Colore base hex — genera l'intera palette |
| `title` | string | `'History'` | Intestazione card |
| `icon` | string | `mdi:chart-line` | Icona header |
| `theme` | string | `'dark'` | `dark` \| `light` \| `auto` |
| `hours` | number | `24` | Range temporale default |
| `entities` | list | — | **Obbligatorio.** Qualsiasi tipo di entità |

**Temi:** `dark` · `light` · `auto`

---

## WeSmart Chart Card

Card grafico singola o multi-entità con drag-to-zoom, tooltip hover e pill filtro temporale.
Accento fisso `#D97757` — stile WeSmart Original.

```yaml
type: custom:wesmart-chart-card
title: Temperatura
icon: mdi:thermometer
theme: dark
entity: sensor.temperatura_soggiorno
```

```yaml
type: custom:wesmart-chart-card
title: Sensori Casa
theme: dark
hours: 24
entities:
  - entity: sensor.temperatura_soggiorno
    name: Temperatura
  - entity: sensor.humidity_bagno
    name: Umidità
```

**Opzioni:**

| Opzione | Tipo | Default | Descrizione |
|---------|------|---------|-------------|
| `title` | string | `'Grafico'` | Titolo card |
| `icon` | string | `mdi:chart-line` | Icona header |
| `theme` | string | `'dark'` | `dark` \| `light` \| `auto` |
| `hours` | number | `24` | Range temporale default (1 · 6 · 24 · 168) |
| `height` | number | `100` | Altezza area grafico in px |
| `show_grid` | boolean | `false` | Grid lines orizzontali |
| `zoom` | boolean | `true` | Abilita drag-to-zoom |
| `entity` | string | — | Entità singola (alternativa a `entities`) |
| `entities` | list | — | Lista entità multi |

**Funzionalità:**
- Grafico a linee SVG per entità numeriche · barre timeline per entità binarie
- Multi-entità sovrapposto — 6 colori fissi (arancione · blu · verde · viola · ambra · rosa)
- Drag-to-zoom in memoria (nessun re-fetch) · doppio click per reset
- Tooltip hover con ora + valori per ogni entità
- Etichette asse Y min/max · asse temporale allineato
- Legenda: dot colorato · stato corrente · range min–max

---

## WeSmart Infinite Chart Card

Stessa card grafico della versione Original ma con **Infinite Color Engine**: l'intera palette
viene generata da un singolo colore hex. I colori multi-entità usano la rotazione dell'hue
con angolo aureo per una distribuzione percettivamente ottimale.

```yaml
type: custom:wesmart-infinite-chart-card
title: Temperature
color: '#60B4D8'
theme: dark
hours: 24
entities:
  - entity: sensor.temperatura_soggiorno
    name: Soggiorno
  - entity: sensor.temperatura_cucina
    name: Cucina
```

**Opzioni:**

| Opzione | Tipo | Default | Descrizione |
|---------|------|---------|-------------|
| `color` | string | `'#D97757'` | Colore base hex — genera tutta la palette |
| `title` | string | `'Grafico'` | Titolo card |
| `icon` | string | `mdi:chart-line` | Icona header |
| `theme` | string | `'dark'` | `dark` \| `light` \| `auto` |
| `hours` | number | `24` | Range temporale default (1 · 6 · 24 · 168) |
| `height` | number | `100` | Altezza area grafico in px |
| `show_grid` | boolean | `false` | Grid lines orizzontali |
| `zoom` | boolean | `true` | Abilita drag-to-zoom |
| `entity` | string | — | Entità singola (alternativa a `entities`) |
| `entities` | list | — | Lista entità multi |

**Differenze rispetto alla versione Original:**
- `color:` guida tutta la palette (sfondo, superfici, testi, tooltip)
- Colori multi-entità calcolati con angolo aureo (`hue + i × 137.5°`) — sempre in armonia con il tema
- `theme: auto` ricalcola la palette in tempo reale al cambio `prefers-color-scheme`
- `disconnectedCallback()` rimuove i listener per evitare memory leak

---

## WeSmart Energy Flow Card

Visualizzazione grafica in tempo reale del flusso energetico: rete, solare, batteria e consumi domestici. I nodi sorgente (grid, solar, battery) sono tutti opzionali — mostrati solo se l'entità è configurata.

```yaml
type: custom:wesmart-energy-flow-card
title: Energy Flow
theme: dark
home_power: sensor.home_power
grid_power: sensor.grid_power
solar_power: sensor.solar_power
battery_power: sensor.battery_power
```

**Layout visivo:**

```
        ☀️ Solar
           ↓
⚡ Grid ── 🏠 Home ── 🔋 Battery
```

Frecce animate con pallini in movimento indicano direzione e fonte del flusso energetico.

**Opzioni:**

| Opzione | Tipo | Default | Descrizione |
|---------|------|---------|-------------|
| `title` | string | `'Energy Flow'` | Titolo della card |
| `icon` | string | `mdi:lightning-bolt-circle` | Icona header |
| `theme` | string | `'dark'` | `dark` \| `light` \| `auto` |
| `home_power` | string | — | **Obbligatorio.** Entità consumo casa (W o kW) |
| `grid_power` | string | — | Opzionale. Entità potenza rete (positivo = import, negativo = export) |
| `solar_power` | string | — | Opzionale. Entità produzione solare (sempre positivo) |
| `battery_power` | string | — | Opzionale. Entità batteria (positivo = carica, negativo = scarica) |
| `battery_invert` | boolean | `false` | `true` → inverte la convenzione dei segni della batteria |

**Unità di misura:**
Auto-rilevate dall'attributo `unit_of_measurement` dell'entità. Supporta sia `W` che `kW`.

**Colori per stato:**

| Stato | Colore |
|-------|--------|
| Solar (produzione) | Giallo `#F0C060` |
| Grid Import (prelievo) | Arancione `#D97757` |
| Grid Export (immissione) | Verde `#7EC8A0` |
| Battery Charging | Verde `#7EC8A0` |
| Battery Discharging | Blu `#60B4D8` |

**Funzionalità:**
- Nodi con anello colorato + glow effect quando attivi
- Connettori animati: pallini in movimento mostrano direzione del flusso
- Nodo Solar solo se `solar_power` configurato
- Nodo Grid solo se `grid_power` configurato
- Nodo Battery solo se `battery_power` configurato
- Barra **Net Balance** (Import / Export / Balanced) — solo se grid configurato
- Pill **Live** con dot verde animato in header
- Valori auto-formattati: `kW` sopra 1 kW, `W` sotto 1 kW

**Temi:** `dark` · `light` · `auto`

---

## WeSmart Media Player Card

Card completa per controllare qualsiasi `media_player.*` con album art, barra di avanzamento animata in tempo reale e controlli adattativi basati su `supported_features`.

```yaml
type: custom:wesmart-media-player-card
entity: media_player.living_room
title: Living Room
theme: dark
show_shuffle: true
show_repeat: true
show_volume: true
show_source: false
```

**Opzioni:**

| Opzione | Tipo | Default | Descrizione |
|---------|------|---------|-------------|
| `entity` | string | — | **Obbligatorio.** Entità `media_player.*` |
| `title` | string | friendly_name | Titolo nell'header |
| `icon` | string | `mdi:music-note` | Icona header |
| `theme` | string | `'dark'` | `dark` \| `light` \| `auto` |
| `show_shuffle` | boolean | `true` | Pulsante shuffle |
| `show_repeat` | boolean | `true` | Pulsante repeat (off / all / one) |
| `show_volume` | boolean | `true` | Slider volume con mute |
| `show_source` | boolean | `false` | Selettore sorgente |

**Funzionalità:**
- Album art come sfondo blurred + thumbnail — fallback con icona se non disponibile
- Barra avanzamento aggiornata ogni secondo con calcolo locale della posizione
- Click sulla barra → seek (se supportato dall'entità)
- Pulsanti adattativi: disabilitati se la feature non è supportata dall'integrazione
- Repeat cicla: `off → all → one`
- Volume slider interattivo con riempimento arancione
- State pill: verde animato (playing), arancione (paused), grigio (idle/off)

**Compatibile con:** Sonos, Spotify, Apple TV, Samsung TV, Chromecast, Plex, Kodi, VLC, MPD e qualsiasi integrazione `media_player.*`

**Temi:** `dark` · `light` · `auto`

---

## WeSmart Weather Card

Condizioni meteo correnti con icona colorata per condizione, temperatura grande, stats e forecast giornaliero o orario.

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

**Opzioni:**

| Opzione | Tipo | Default | Descrizione |
|---------|------|---------|-------------|
| `entity` | string | — | **Obbligatorio.** Entità `weather.*` |
| `title` | string | friendly_name | Titolo header |
| `theme` | string | `'dark'` | `dark` \| `light` \| `auto` |
| `forecast_type` | string | `'daily'` | `daily` \| `hourly` |
| `forecast_days` | number | `5` | Slot forecast da mostrare (1–7) |
| `show_humidity` | boolean | `true` | Umidità nelle stats |
| `show_wind` | boolean | `true` | Vento con direzione cardinale |
| `show_pressure` | boolean | `false` | Pressione |
| `show_visibility` | boolean | `false` | Visibilità |

**Funzionalità:**
- Icona condizione 44px con colore e glow specifici per ogni condizione (soleggiato, nuvoloso, pioggia, neve, ecc.)
- Temperatura in caratteri grandi con "Feels like"
- Stats strip con pills (umidità, vento + direzione, pressione, visibilità, UV index automatico)
- Forecast via **WebSocket API** `weather/get_forecasts` (HA 2023.9+) con fallback automatico all'attributo
- Refresh forecast ogni 30 minuti
- Giorno "Today" evidenziato in arancione
- Probabilità precipitazioni in blu se > 0%
- Unità rilevate automaticamente dall'entità (°C/°F, km/h, hPa…)

**Compatibile con:** Met.no, OpenWeatherMap, AccuWeather, Tomorrow.io, Pirate Weather e qualsiasi `weather.*`

**Temi:** `dark` · `light` · `auto`

---

## Struttura Progetto

```
custom card home assistant/
├── doc/
│   └── README.md                              ← questo file
│
├── WeSmart-Original/                          ← card standard (palette fissa)
│   ├── Light/wesmart-light-card.js
│   ├── Lights/wesmart-lights-card.js + wesmart-lights-expand-card.js
│   ├── Climate/wesmart-climate-card.js + wesmart-climate-compact-card.js
│   ├── Sensors/wesmart-sensors-card.js
│   ├── Doors/wesmart-doors-card.js
│   ├── History/wesmart-history-card.js
│   ├── Buttons/wesmart-buttons-bar-card.js + wesmart-buttons-grid-card.js
│   ├── Battery/wesmart-battery-status-card.js
│   ├── Switches/wesmart-switches-card.js
│   ├── Clock/wesmart-clock-card.js
│   ├── Chart/wesmart-chart-card.js
│   ├── Energy/wesmart-energy-flow-card.js
│   ├── MediaPlayer/wesmart-media-player-card.js
│   └── Weather/wesmart-weather-card.js
│
└── WeSmart-InfiniteColor/
    ├── History/wesmart-infinite-color-card.js
    └── Chart/wesmart-infinite-chart-card.js
```

---
---

# WeSmart Custom Cards — Home Assistant

A collection of custom cards for Home Assistant Dashboard, styled after the **Anthropic WeSmart AI** aesthetic: warm charcoal dark theme, orange accent, minimal typography.

---

## Cards

| Card | File | Entity type | Theme |
|------|------|-------------|-------|
| [WeSmart Light Card](#wesmart-light-card) | `Light/wesmart-light-card.js` | `light.*` | Dark / Light / Auto |
| [WeSmart Lights Card](#wesmart-lights-card) | `Lights/wesmart-lights-card.js` | `light.*` (multi) | Dark / Light / Auto |
| [WeSmart Lights Expand Card](#wesmart-lights-expand-card) | `Lights/wesmart-lights-expand-card.js` | `light.*` (multi) | Dark / Light / Auto |
| [WeSmart Climate Card](#wesmart-climate-card) | `Climate/wesmart-climate-card.js` | `climate.*` | Dark / Light / Auto |
| [WeSmart Climate Compact Card](#wesmart-climate-compact-card) | `Climate/wesmart-climate-compact-card.js` | `climate.*` (multi) | Dark / Light / Auto |
| [WeSmart Sensors Card](#wesmart-sensors-card) | `Sensors/wesmart-sensors-card.js` | `sensor.*` (multi) | Dark / Light / Auto |
| [WeSmart Doors Card](#wesmart-doors-card) | `Doors/wesmart-doors-card.js` | `binary_sensor.*` (multi) | Dark / Light / Auto |
| [WeSmart History Card](#wesmart-history-card) | `History/wesmart-history-card.js` | any (multi) | Dark / Light / Auto |
| [WeSmart Buttons Bar Card](#wesmart-buttons-bar-card) | `Buttons/wesmart-buttons-bar-card.js` | any / service | Dark / Light / Auto |
| [WeSmart Buttons Grid Card](#wesmart-buttons-grid-card) | `Buttons/wesmart-buttons-grid-card.js` | any / service | Dark / Light / Auto |
| [WeSmart Battery Status Card](#wesmart-battery-status-card) | `Battery/wesmart-battery-status-card.js` | `sensor.*` (multi) | Dark / Light / Auto |
| [WeSmart Switches Card](#wesmart-switches-card) | `Switches/wesmart-switches-card.js` | `switch.*` (multi) | Dark / Light / Auto |
| [WeSmart Clock Card](#wesmart-clock-card) | `Clock/wesmart-clock-card.js` | any (max 3 extras) | Dark / Light / Auto |

---

## Installation

### 1. Copy files

Copy the `.js` file of each card you want to use into `config/www/`:

```
config/www/wesmart-light-card.js
config/www/wesmart-lights-card.js
config/www/wesmart-lights-expand-card.js
config/www/wesmart-climate-card.js
config/www/wesmart-climate-compact-card.js
config/www/wesmart-sensors-card.js
config/www/wesmart-doors-card.js
config/www/wesmart-history-card.js
config/www/wesmart-buttons-bar-card.js
config/www/wesmart-buttons-grid-card.js
config/www/wesmart-battery-status-card.js
config/www/wesmart-switches-card.js
config/www/wesmart-clock-card.js
```

### 2. Add resources

In Home Assistant → **Settings → Dashboards → Resources**, add one entry per card:

| URL | Type |
|-----|------|
| `/local/wesmart-light-card.js` | JavaScript module |
| `/local/wesmart-lights-card.js` | JavaScript module |
| `/local/wesmart-lights-expand-card.js` | JavaScript module |
| `/local/wesmart-climate-card.js` | JavaScript module |
| `/local/wesmart-climate-compact-card.js` | JavaScript module |
| `/local/wesmart-sensors-card.js` | JavaScript module |
| `/local/wesmart-doors-card.js` | JavaScript module |
| `/local/wesmart-history-card.js` | JavaScript module |
| `/local/wesmart-buttons-bar-card.js` | JavaScript module |
| `/local/wesmart-buttons-grid-card.js` | JavaScript module |
| `/local/wesmart-battery-status-card.js` | JavaScript module |
| `/local/wesmart-switches-card.js` | JavaScript module |
| `/local/wesmart-clock-card.js` | JavaScript module |

### 3. Reload

Hard refresh the browser: `Cmd+Shift+R` (macOS) / `Ctrl+Shift+R` (Windows/Linux).

---

## Design Tokens

All cards share the same CSS custom properties:

| Token | Value | Usage |
|-------|-------|-------|
| `--claude-bg` | `#1C1917` | Page background |
| `--claude-surface` | `#292524` | Card background |
| `--claude-surface-2` | `#332E2A` | Inner surfaces, sliders |
| `--claude-border` | `rgba(255,255,255,0.08)` | Borders |
| `--claude-orange` | `#D97757` | Primary accent |
| `--claude-blue` | `#60B4D8` | Cooling accent (climate) |
| `--claude-text` | `#F5F0EB` | Primary text |
| `--claude-text-muted` | `#A09080` | Secondary text |
| `--claude-text-dim` | `#6B5F56` | Tertiary text, labels |
| `--claude-radius` | `20px` | Card border radius |
| `--claude-radius-sm` | `12px` | Inner elements |
| `--claude-radius-xs` | `8px` | Buttons, small elements |

**Light theme** (claude-lights-card, claude-sensors-card, claude-doors-card, claude-history-card):

| Token | Value |
|-------|-------|
| `--bg` | `#FFFEFA` |
| `--surface` | `#F5F0EB` |
| `--border` | `rgba(28,25,23,0.09)` |
| `--text` | `#1C1917` |

---

## Architecture

All cards follow the same pattern:

```
Single JS file
  └─ class extends HTMLElement
      ├─ attachShadow({ mode: 'open' })    → isolated DOM + styles
      ├─ setConfig(config)                 → parse YAML config, call _render()
      ├─ set hass(hass)                    → receive state updates, call _updateState()
      ├─ _render()                         → inject <style> + card HTML into shadow DOM
      ├─ _updateState()                    → update DOM from hass.states
      └─ _bindEvents()                     → attach click/pointer listeners

customElements.define('claude-*-card', ...)
window.customCards.push({ type, name, description })
```

No build step. No dependencies. Pure vanilla JS.

---

## WeSmart Light Card

Single light entity with full controls. — **v1.3.0**

```yaml
type: custom:wesmart-light-card
entity: light.living_room
```

**Options:**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `entity` | string | — | **Required.** `light.*` entity |
| `name` | string | auto | Override display name |
| `icon` | string | auto | Override icon (mdi:*) |
| `theme` | string | `'dark'` | `dark` \| `light` \| `auto` |
| `show_brightness` | boolean | `true` | Brightness slider |
| `show_color_temp` | boolean | `true` | Kelvin/CT slider (only for lights that support it) |
| `show_color` | boolean | `true` | Hue slider for color lights |
| `collapse_when_off` | boolean | `false` | Hide controls when off; auto-expands when turned on |

**Features:** toggle · brightness slider · Kelvin/CT slider · hue slider · auto-collapse with animation · pulse glow when on · unavailable overlay

**Auto-detects** capabilities from `supported_color_modes`. Supports modern HA 2022.9+ Kelvin attributes (`color_temp_kelvin`, `min_color_temp_kelvin`, `max_color_temp_kelvin`) with legacy mireds fallback. The hue slider is minimal, matching the style of all other sliders.

**Themes:** `dark` · `light` · `auto`

---

## WeSmart Lights Card

Multiple light entities in a compact list with individual toggles.

```yaml
type: custom:wesmart-lights-card
title: Living Room
theme: dark
entities:
  - light.ceiling
  - entity: light.floor_lamp
    name: Floor Lamp
    icon: mdi:floor-lamp
```

**Options:**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `title` | string | `'Lights'` | Card heading |
| `icon` | string | `mdi:lightbulb-group` | Header icon |
| `theme` | string | `'dark'` | `dark` \| `light` \| `auto` |
| `entities` | list | — | **Required.** Light entity list |

**Entity item fields:** `entity` (req) · `name` · `icon`

**Features:** master toggle · per-row toggle · state text (brightness + CT) · "N of M on" subtitle · tap row → More Info · unavailable dimming

**Themes:**
- `dark` — warm charcoal (default)
- `light` — warm cream `#FFFEFA`
- `auto` — follows system `prefers-color-scheme`

---

## WeSmart Lights Expand Card

Same list layout as WeSmart Lights Card, but clicking a row **expands an inline panel** with animated brightness and color-temperature sliders — without leaving the dashboard.

```yaml
type: custom:wesmart-lights-expand-card
title: Living Room
theme: dark
entities:
  - light.ceiling
  - entity: light.floor_lamp
    name: Floor Lamp
    icon: mdi:floor-lamp
```

**Options:**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `title` | string | `'Lights'` | Card heading |
| `icon` | string | `mdi:lightbulb-group` | Header icon |
| `theme` | string | `'dark'` | `dark` \| `light` \| `auto` |
| `entities` | list | — | **Required.** Light entity list |

**Entity item fields:** `entity` (req) · `name` · `icon`

**Features:**
- Master toggle (all on/off) · per-row toggle
- Click anywhere on a row (outside the toggle) → **animated expand panel**
- Only one panel open at a time; clicking the same row again collapses it
- Expand panel shows:
  - **Brightness slider** — visible only when light is on and supports brightness
  - **Color-temp slider** — warm→cool gradient track, visible only when `color_temp` is available
  - "Turn on to adjust" hint when light is off
- Slider drag applies changes to HA on pointer release
- Header subtitle: "N of M on" / "All on" / "All off"
- Unavailable entities dimmed and non-interactive

**Animations:**

| Element | Effect |
|---------|--------|
| Chevron icon | Rotates 180° on expand (`transform` + `cubic-bezier`) |
| Panel | Accordion: `max-height` + `opacity` transition |
| Panel content | Slides up into view (`translateY`) |
| Slider thumb | Glow ring while dragging |
| Panel border | Fades in as panel opens |

**Themes:** `dark` · `light` · `auto`

---

## WeSmart Climate Card

Single climate entity with temperature controls and mode selector.

```yaml
type: custom:wesmart-climate-card
entity: climate.living_room
```

**Options:**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `entity` | string | — | **Required.** `climate.*` entity |
| `name` | string | auto | Override display name |
| `icon` | string | auto | Override icon |
| `theme` | string | `'dark'` | `dark` \| `light` \| `auto` |
| `show_fan_mode` | boolean | `true` | Fan mode pills |
| `temp_step` | number | auto | Temperature step (e.g. `0.5`) |

**Features:** large current temp display · humidity badge · target temp with +/- buttons · HVAC mode pills · fan mode pills · heat/cool dual glow · unavailable overlay

**Themes:** `dark` · `light` · `auto`

**HVAC modes:** `off` · `heat` (orange glow) · `cool` (blue glow) · `heat_cool` (range display) · `auto` · `dry` · `fan_only`

**Auto-detects** `hvac_modes` and `fan_modes` from entity attributes — only supported modes are shown.

---

## WeSmart Sensors Card

Multiple sensor entities in a compact list with value badges and alert highlighting.

```yaml
type: custom:wesmart-sensors-card
title: Sensori Casa
theme: dark
entities:
  - sensor.temperature_soggiorno
  - sensor.humidity_soggiorno
  - entity: sensor.co2_cucina
    name: CO₂ Cucina
    alert_above: 800
  - entity: sensor.battery_door
    name: Batteria porta
```

**Options:**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `title` | string | `'Sensors'` | Card heading |
| `icon` | string | `mdi:chart-line` | Header icon |
| `theme` | string | `'dark'` | `dark` \| `light` \| `auto` |
| `entities` | list | — | **Required.** Sensor entity list |

**Entity item fields:**

| Field | Type | Description |
|-------|------|-------------|
| `entity` | string | **Required.** `sensor.*` entity |
| `name` | string | Override display name |
| `icon` | string | Override icon (mdi:*) |
| `device_class` | string | Force device class (auto-detected if omitted) |
| `unit` | string | Override unit of measurement |
| `color` | string | Override accent color (hex) |
| `meta` | string | Override the type label below the name |
| `alert_above` | number | Alert if value exceeds this threshold |
| `alert_below` | number | Alert if value drops below this threshold |

**Features:** value badge with unit · color per `device_class` · built-in alert thresholds · custom thresholds · "N alerts" header subtitle · tap row → More Info · unavailable dimming

**Built-in alert thresholds** (triggered unless overridden):

| device_class | Alert condition |
|---|---|
| `temperature` | < 10 °C or > 30 °C |
| `humidity` | < 30 % or > 70 % |
| `co2` | > 1000 ppm |
| `battery` | < 20 % |

**Supported device classes** (with auto icon + color):
`temperature` · `humidity` · `pressure` · `co2` · `pm25` · `pm10` · `illuminance` · `battery` · `voltage` · `current` · `power` · `energy` · `gas` · `water` · `signal_strength` · `moisture` · `aqi` · `speed` · `wind_speed`

**Themes:** `dark` · `light` · `auto` (same as Lights card)

---

## WeSmart Doors Card

Multiple door / window / contact binary sensors in a list with open/closed status pills.

```yaml
type: custom:wesmart-doors-card
title: Porte & Finestre
theme: dark
entities:
  - binary_sensor.porta_ingresso
  - binary_sensor.finestra_cucina
  - entity: binary_sensor.garage
    name: Garage
    device_class: garage_door
```

**Options:**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `title` | string | `'Doors & Windows'` | Card heading |
| `icon` | string | `mdi:door` | Header icon |
| `theme` | string | `'dark'` | `dark` \| `light` \| `auto` |
| `entities` | list | — | **Required.** Binary sensor entity list |

**Entity item fields:**

| Field | Type | Description |
|-------|------|-------------|
| `entity` | string | **Required.** `binary_sensor.*` entity |
| `name` | string | Override display name |
| `icon` | string | Override icon (mdi:*) |
| `device_class` | string | Force device class (auto-detected if omitted) |

**Features:** Open/Closed status pill (orange / green) · open rows highlighted · header shows "N open" or "All closed" · per-class icon pairs (open/closed variants) · tap row → More Info · unavailable dimming

**Supported device classes:**

| device_class | Open label | Closed label |
|---|---|---|
| `door` | Open | Closed |
| `window` | Open | Closed |
| `garage_door` | Open | Closed |
| `opening` | Open | Closed |
| `lock` | Unlocked | Locked |
| `motion` | Detected | Clear |
| `vibration` | Detected | Clear |
| `moisture` | Wet | Dry |
| `smoke` | Detected | Clear |
| `gas` | Detected | Clear |

> `binary_sensor` state `on` = open/active · `off` = closed/clear

**Themes:** `dark` · `light` · `auto`

---

## WeSmart History Card

Multi-entity history graph card. Replaces the default HA History Graph with an improved, interactive version.

```yaml
type: custom:wesmart-history-card
title: Storico Casa
theme: dark
hours: 24
entities:
  - light.soggiorno
  - sensor.temperatura_cucina
  - entity: binary_sensor.porta_ingresso
    name: Porta Ingresso
```

**Options:**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `title` | string | `'History'` | Card heading |
| `icon` | string | `mdi:chart-line` | Header icon |
| `theme` | string | `'dark'` | `dark` \| `light` \| `auto` |
| `hours` | number | `24` | Default time range (`1` · `6` · `24` · `168`) |
| `entities` | list | — | **Required.** Any entity type |

**Entity item fields:** `entity` (req) · `name` · `icon`

**Chart types (auto-detected):**
- **Binary** entities (`on`/`off`, `open`/`closed`, …) → orange **timeline bar** — active periods in orange, inactive in dark
- **Numeric** entities (`sensor.*`, …) → **SVG line chart** with gradient fill

**Features:**
- Interactive time pills in-card: `1h` · `6h` · `24h` · `7d`
- Current state badge per entity (orange when active)
- Summary stat: `Attivo X%` for binary · `min – max unit` for numeric
- Time axis labels (HH:MM for ≤ 48h, weekday for 7d)
- Animated loader during fetch
- Tap row → More Info

**Themes:** `dark` · `light` · `auto`

---

## WeSmart Buttons Bar Card

Compact horizontal bar of action buttons. Low height, full width — ideal for quick-access rows.

```yaml
type: custom:wesmart-buttons-bar-card
theme: dark
title: Quick Actions   # optional
buttons:
  - name: Lights
    icon: mdi:lightbulb
    entity: light.soggiorno
  - name: Film
    icon: mdi:movie-open
    service: scene.turn_on
    service_data:
      entity_id: scene.serata_film
  - name: TV
    icon: mdi:television
    entity: switch.tv
```

**Options:**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `theme` | string | `'dark'` | `dark` \| `light` \| `auto` |
| `title` | string | — | Optional small label above buttons |
| `buttons` | list | — | **Required.** Button list |

**Button item fields:**

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Button label |
| `icon` | string | MDI icon (e.g. `mdi:lightbulb`) |
| `entity` | string | Optional entity for state tracking + default toggle action |
| `service` | string | Optional service to call (`domain.service`) |
| `service_data` | object | Optional data passed to the service |

**Action logic (inferred):**
- `entity` only → calls `homeassistant.toggle` on click
- `service` only → calls the service; no active state (press animation on click)
- Both → calls the service; entity tracks the active/inactive color
- Neither → decorative button only

**State colors:**
- **Active** (`on`, `open`, `unlocked`, `detected`, `playing`, `armed_*`, …): orange background + orange icon/label + glow
- **Inactive**: surface background, muted icon/label
- **Unavailable**: dimmed (opacity 0.35), non-interactive

**Themes:** `dark` · `light` · `auto`

---

## WeSmart Buttons Grid Card

Square-ish card with multiple buttons arranged in an automatic grid. Ideal for rooms with many actions.

```yaml
type: custom:wesmart-buttons-grid-card
title: Casa
icon: mdi:home
theme: dark
columns: 3      # optional — auto-fit if omitted
buttons:
  - name: Luci Soggiorno
    icon: mdi:lightbulb
    entity: light.soggiorno
  - name: Luci Cucina
    icon: mdi:ceiling-light
    entity: light.cucina
  - name: TV
    icon: mdi:television
    entity: switch.tv
  - name: Film
    icon: mdi:movie-open
    service: scene.turn_on
    service_data:
      entity_id: scene.serata_film
  - name: Allarme
    icon: mdi:shield-home
    service: alarm_control_panel.alarm_arm_away
    service_data:
      entity_id: alarm_control_panel.casa
```

**Options:**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `title` | string | — | Optional card heading |
| `icon` | string | `mdi:gesture-tap` | Header icon (used when `title` is set) |
| `theme` | string | `'dark'` | `dark` \| `light` \| `auto` |
| `columns` | number | auto | Force a fixed number of columns; omit for `auto-fill` |
| `buttons` | list | — | **Required.** Button list |

**Button item fields:** same as Bar card (`name`, `icon`, `entity`, `service`, `service_data`)

**Features:**
- Auto-fit grid (columns self-adjust to card width) or fixed column count
- Optional header with icon + title
- Same state logic and colors as Bar card
- Press animation for stateless service buttons

**Themes:** `dark` · `light` · `auto`

---

## WeSmart Switches Card

Multi-entity toggle card with interactive icon control.

```yaml
type: custom:wesmart-switches-card
title: Kitchen Switches
entities:
  - switch.kettle
  - entity: light.counter_light
    name: Under-cabinet
    icon: mdi:led-strip-variant
  - input_boolean.coffee_timer
```

**Options:**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `title` | string | `'Switches'` | Card heading |
| `icon` | string | `mdi:toggle-switch` | Header icon |
| `theme` | string | `'dark'` | `dark` \| `light` \| `auto` |
| `entities` | list | — | **Required.** Switch entities |

**Entity item fields:** `entity` (req) · `name` · `icon`

**Features:**
- **Interactive Icons:** Click the icon to toggle the state; orange glow when ON.
- **State Labels:** Clear ON/OFF pills for at-a-glance status.
- **More Info:** Click the row text to open the HA service dialog.

---

## WeSmart Climate Compact Card

A row-based alternative to the full climate card, optimized for multi-zone management.

```yaml
type: custom:wesmart-climate-compact-card
title: Upstairs Heating
icon: mdi:thermostat
theme: dark
entities:
  - climate.master_bedroom
  - entity: climate.guest_room
    name: Guest
  - climate.bathroom
```

**Options:**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `title` | string | `'Climate Control'` | Card heading |
| `icon` | string | `mdi:thermostat` | Header icon |
| `theme` | string | `'dark'` | `dark` \| `light` \| `auto` |
| `entities` | list | — | **Required.** `climate.*` entity list |

**Entity item fields:** `entity` (req) · `name`

**Features:**
- **In-row Controls:** +/- buttons adjust target temperature; step follows entity's `target_temp_step` (default 0.5)
- **Current temperature badge:** Shows real-time ambient temperature
- **Dynamic icon:** Changes based on `hvac_action` — orange flame (heating), blue snowflake (cooling), muted (idle/off)
- **`heat_cool` mode:** Displays `min°–max°` range; +/- buttons disabled
- **`off` state:** +/- buttons disabled (reduced opacity)
- **Click on row** (outside buttons) → HA More Info dialog
- **Unavailable entities:** Dimmed and non-interactive

**Themes:** `dark` · `light` · `auto`

---

## WeSmart Battery Status Card

Multi-entity battery monitoring card with dynamic icons and visualization options.

```yaml
type: custom:wesmart-battery-status-card
title: Battery Status
display_type: circular  # Visualization: icon | linear | circular
entities:
  - sensor.phone_battery
  - entity: sensor.tablet_battery
    name: Tablet
    display_type: linear  # Linear bar override
  - entity: sensor.watch_battery
    name: Watch
    display_type: icon    # Classic icon override
```

**Options:**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `title` | string | `'Batteries'` | Card heading |
| `icon` | string | `mdi:battery-check` | Header icon |
| `theme` | string | `'dark'` | `dark` \| `light` \| `auto` |
| `display_type` | string | `'icon'` | `icon` \| `linear` \| `circular` |
| `entities` | list | — | **Required.** Battery sensor entities |

**Entity item fields:** `entity` (req) · `name` · `display_type` (override)

**Features:**
- **Visualizations:** 
  - `icon`: Dynamic battery MDI icon (updates every 10%).
  - `linear`: Sleek horizontal progress bar.
  - `circular`: Animated SVG progression ring.
- **Color Coding:** Auto-switches based on level (<15% critical orange, <30% warning yellow, >30% muted green).
- **Summary Header:** Shows "N low" in orange if any battery is ≤ 20%.

---

## WeSmart Clock Card

Sleek ambient clock with optional extra entity info in a bottom bar or left sidebar.

```yaml
type: custom:wesmart-clock-card
theme: dark
extras_layout: sidebar
translate_weather: true
extra_entities:
  - weather.home
  - entity: sensor.outdoor_temperature
    icon: mdi:thermometer-high
  - entity: sensor.humidity
    icon: mdi:water-percent
```

**Options:**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `theme` | string | `'dark'` | `dark` \| `light` \| `auto` |
| `time_format` | number | `24` | `12` or `24` |
| `extras_layout` | string | `'bottom'` | `bottom` \| `sidebar` — position of extra info |
| `translate_weather` | boolean | `false` | Translate `weather.*` states to Italian |
| `extra_entities` | list | `[]` | Up to **3** entities to display |

**Entity item fields:** `entity` (req) · `icon` (custom MDI, ignored for `weather.*`)

**Features:**
- Bottom bar: up to 3 items share the full width equally, no scrolling
- Sidebar: narrow left column (78px), items stacked vertically
- Each item shows **icon + state value only** — no name or label
- Weather entities: icon is automatic (maps from state); optional Italian translation
- Responsive: items always stay inside the card bounds

**Themes:** `dark` · `light` · `auto`

---

## WeSmart Infinite Color Card

History card identica alla `wesmart-history-card` ma con un motore HSL che genera l'intera palette da un singolo colore di input.

```yaml
type: custom:wesmart-infinite-color-card
title: Storico Casa
color: '#f73747'          # colore base — qualsiasi hex
theme: dark               # dark | light | auto
hours: 24
entities:
  - light.soggiorno
  - sensor.temperatura
  - binary_sensor.porta_ingresso
```

**Options:**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `color` | string | `'#D97757'` | Colore base hex — genera l'intera palette |
| `title` | string | `'History'` | Intestazione card |
| `icon` | string | `mdi:chart-line` | Icona header |
| `theme` | string | `'dark'` | `dark` \| `light` \| `auto` |
| `hours` | number | `24` | Range temporale default (`1` · `6` · `24` · `168`) |
| `entities` | list | — | **Required.** Qualsiasi tipo di entità |

**Algoritmo palette (HSL):**

A partire dal colore base vengono generati automaticamente tutti i token:

| Token | Dark theme | Light theme |
|-------|-----------|-------------|
| `--accent` | hue pieno, L normalizzata 50–65% | hue pieno, L 40–55% |
| `--bg` | hue, S 25–45%, L 11% | hue, S 3–8%, L 98% |
| `--surface` | hue, S 20–38%, L 16% | hue, S 5–12%, L 93% |
| `--text` | hue tenue, L 93% | hue tenue, L 10% |
| `--text-muted` | hue tenue, L 65% | hue tenue, L 38% |
| `--text-dim` | hue tenue, L 42% | hue tenue, L 58% |

**Features:** identiche alla History card originale — timeline bar (binary) · line chart SVG (numeric) · time pills 1h/6h/24h/7d · stat summary · More Info on tap

**Themes:** `dark` · `light` · `auto` (auto segue `prefers-color-scheme` e reagisce ai cambi live)

---

## Project Structure

```
custom card home assistant/
├── doc/
│   └── README.md                              ← this file
│
├── WeSmart-Original/                          ← standard cards (fixed palette)
│   ├── Light/
│   │   ├── wesmart-light-card.js
│   │   └── README.md
│   ├── Lights/
│   │   ├── wesmart-lights-card.js             ← list with toggles
│   │   ├── wesmart-lights-expand-card.js      ← list with animated inline sliders
│   │   └── README.md
│   ├── Climate/
│   │   ├── wesmart-climate-card.js
│   │   ├── wesmart-climate-compact-card.js
│   │   └── README.md
│   ├── Sensors/
│   │   ├── wesmart-sensors-card.js
│   │   └── README.md
│   ├── Doors/
│   │   ├── wesmart-doors-card.js
│   │   └── README.md
│   ├── History/
│   │   ├── wesmart-history-card.js
│   │   └── README.md
│   ├── Buttons/
│   │   ├── wesmart-buttons-bar-card.js        ← compact horizontal button bar
│   │   ├── wesmart-buttons-grid-card.js       ← square auto-grid of buttons
│   │   └── README.md
│   ├── Battery/
│   │   ├── wesmart-battery-status-card.js     ← multi-entity battery monitor
│   │   └── README.md
│   ├── Switches/
│   │   ├── wesmart-switches-card.js           ← multi-entity toggle card
│   │   └── README.md
│   ├── Clock/
│   │   ├── wesmart-clock-card.js              ← ambient clock + bottom/sidebar extras
│   │   └── README.md
│   └── Energy/
│       └── wesmart-energy-flow-card.js        ← real-time energy flow diagram
│
└── WeSmart-InfiniteColor/                     ← dynamic color palette cards
    └── History/
        └── wesmart-infinite-color-card.js     ← history card with HSL color engine
```

---

## WeSmart Energy Flow Card

Visualizzazione grafica in tempo reale del flusso energetico: rete, solare, batteria e consumi domestici. I nodi sorgente (grid, solar, battery) sono tutti opzionali — mostrati solo se l'entità è configurata.

```yaml
type: custom:wesmart-energy-flow-card
title: Energy Flow
theme: dark
home_power: sensor.home_power
grid_power: sensor.grid_power
solar_power: sensor.solar_power
battery_power: sensor.battery_power
```

**Layout visivo:**

```
        ☀️ Solar
           ↓
⚡ Grid ── 🏠 Home ── 🔋 Battery
```

Frecce animate con pallini in movimento indicano direzione e fonte del flusso energetico.

**Opzioni:**

| Opzione | Tipo | Default | Descrizione |
|---------|------|---------|-------------|
| `title` | string | `'Energy Flow'` | Titolo della card |
| `icon` | string | `mdi:lightning-bolt-circle` | Icona header |
| `theme` | string | `'dark'` | `dark` \| `light` \| `auto` |
| `home_power` | string | — | **Obbligatorio.** Entità consumo casa (W o kW) |
| `grid_power` | string | — | Opzionale. Entità potenza rete (positivo = import, negativo = export) |
| `solar_power` | string | — | Opzionale. Entità produzione solare (sempre positivo) |
| `battery_power` | string | — | Opzionale. Entità batteria (positivo = carica, negativo = scarica) |
| `battery_invert` | boolean | `false` | `true` → inverte la convenzione dei segni della batteria |

**Unità di misura:**
Auto-rilevate dall'attributo `unit_of_measurement` dell'entità. Supporta sia `W` che `kW`.

**Colori per stato:**

| Stato | Colore |
|-------|--------|
| Solar (produzione) | Giallo `#F0C060` |
| Grid Import (prelievo) | Arancione `#D97757` |
| Grid Export (immissione) | Verde `#7EC8A0` |
| Battery Charging | Verde `#7EC8A0` |
| Battery Discharging | Blu `#60B4D8` |

**Features:**
- Nodi con anello colorato + glow effect quando attivi
- Connettori animati: pallini in movimento mostrano direzione del flusso
- Nodo Solar solo se `solar_power` configurato
- Nodo Grid solo se `grid_power` configurato
- Nodo Battery solo se `battery_power` configurato
- Barra **Net Balance** (Import / Export / Balanced) — solo se grid configurato
- Pill **Live** con dot verde animato in header
- Valori auto-formattati: `kW` sopra 1 kW, `W` sotto 1 kW

**Temi:** `dark` · `light` · `auto`

---

## WeSmart Media Player Card

Card completa per controllare qualsiasi `media_player.*` con album art, barra di avanzamento animata in tempo reale e controlli adattativi basati su `supported_features`.

```yaml
type: custom:wesmart-media-player-card
entity: media_player.living_room
title: Living Room
theme: dark
show_shuffle: true
show_repeat: true
show_volume: true
show_source: false
```

**Opzioni:**

| Opzione | Tipo | Default | Descrizione |
|---------|------|---------|-------------|
| `entity` | string | — | **Obbligatorio.** Entità `media_player.*` |
| `title` | string | friendly_name | Titolo nell'header |
| `icon` | string | `mdi:music-note` | Icona header |
| `theme` | string | `'dark'` | `dark` \| `light` \| `auto` |
| `show_shuffle` | boolean | `true` | Pulsante shuffle |
| `show_repeat` | boolean | `true` | Pulsante repeat (off / all / one) |
| `show_volume` | boolean | `true` | Slider volume con mute |
| `show_source` | boolean | `false` | Selettore sorgente |

**Features:**
- Album art come sfondo blurred + thumbnail — fallback con icona se non disponibile
- Barra avanzamento aggiornata ogni secondo con calcolo locale della posizione
- Click sulla barra → seek (se supportato dall'entità)
- Pulsanti adattativi: disabilitati se la feature non è supportata dall'integrazione
- Repeat cicla: `off → all → one`
- Volume slider interattivo con riempimento arancione
- State pill: verde animato (playing), arancione (paused), grigio (idle/off)

**Compatibile con:** Sonos, Spotify, Apple TV, Samsung TV, Chromecast, Plex, Kodi, VLC, MPD e qualsiasi integrazione `media_player.*`

**Temi:** `dark` · `light` · `auto`

---

## WeSmart Weather Card

Condizioni meteo correnti con icona colorata per condizione, temperatura grande, stats e forecast giornaliero o orario.

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

**Opzioni:**

| Opzione | Tipo | Default | Descrizione |
|---------|------|---------|-------------|
| `entity` | string | — | **Obbligatorio.** Entità `weather.*` |
| `title` | string | friendly_name | Titolo header |
| `theme` | string | `'dark'` | `dark` \| `light` \| `auto` |
| `forecast_type` | string | `'daily'` | `daily` \| `hourly` |
| `forecast_days` | number | `5` | Slot forecast da mostrare (1–7) |
| `show_humidity` | boolean | `true` | Umidità nelle stats |
| `show_wind` | boolean | `true` | Vento con direzione cardinale |
| `show_pressure` | boolean | `false` | Pressione |
| `show_visibility` | boolean | `false` | Visibilità |

**Features:**
- Icona condizione 44px con colore e glow specifici per ogni condizione (soleggiato, nuvoloso, pioggia, neve, ecc.)
- Temperatura in caratteri grandi con "Feels like"
- Stats strip con pills (umidità, vento + direzione, pressione, visibilità, UV index automatico)
- Forecast via **WebSocket API** `weather/get_forecasts` (HA 2023.9+) con fallback automatico all'attributo
- Refresh forecast ogni 30 minuti
- Giorno "Today" evidenziato in arancione
- Probabilità precipitazioni in blu se > 0%
- Unità rilevate automaticamente dall'entità (°C/°F, km/h, hPa…)

**Compatibile con:** Met.no, OpenWeatherMap, AccuWeather, Tomorrow.io, Pirate Weather e qualsiasi `weather.*`

**Temi:** `dark` · `light` · `auto`
