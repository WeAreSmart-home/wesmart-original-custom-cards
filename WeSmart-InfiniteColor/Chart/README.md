# WeSmart Infinite Chart Card

Una card grafico personalizzata per Home Assistant con **Infinite Color Engine**.
La palette visiva completa — sfondo, superfici, linee, tooltip, dot — viene generata
automaticamente da un singolo colore esadecimale definito in YAML.
Supporta singola entità e multi-entità, zoom interattivo, tooltip hover e pill filtro temporale.
Temi **dark**, **light** e **auto**.

---

## Funzionalità

- **Infinite Color Engine** — tutta la palette generata dinamicamente da `color: '#RRGGBB'`
- **Colori multi-entità intelligenti** — ogni entità riceve un colore distinto derivato dal colore base con angolo aureo (~137.5°): percettivamente distribuiti, sempre in armonia con il tema
- **Rilevamento automatico tipo grafico:**
  - Entità numeriche (`sensor.*`) → **grafico a linee SVG** con area fill e gradiente
  - Entità binarie (`binary_sensor.*`, `light.*`, `switch.*`, ecc.) → **barre timeline** per ogni entità
- **Multi-entità** — più entità su un grafico unico sovrapposto
- **Pill filtro temporale:** `1h` · `6h` · `24h` · `7d`
- **Drag-to-zoom** — trascina sull'area del grafico per zoomare in memoria
  - Doppio click per resettare; pulsante "↺ Reset zoom" visibile durante lo zoom
- **Tooltip hover** — linea verticale tratteggiata + box con valore/ora per ogni entità
- **Etichette asse Y** — min/max della prima entità numerica
- **Grid lines opzionali** (`show_grid: true`)
- **Legenda** — dot colorato · nome · stato corrente · range min–max
- **Auto theme** — segue `prefers-color-scheme` del sistema in tempo reale
- `disconnectedCallback()` rimuove i listener per evitare memory leak

---

## Infinite Color Engine — come funziona

```
color: '#60B4D8'  ──→  accent, accent-soft
                  ──→  bg, surface, border
                  ──→  text, text-muted, text-dim
                  ──→  shadow, row-hover, pill-bg
```

1. **HEX → HSL** — Il colore viene convertito in `{ h, s, l }`.
2. **Derivazione palette** — Sfondo, superfici e testi derivati dallo stesso hue con lightness regolata per dark/light.
3. **Iniezione CSS vars** — Tutti i token scritti su `:host` via `element.style.setProperty(...)`.
4. **Multi-entity colors** — Colori aggiuntivi calcolati con rotazione dell'hue per angolo aureo: `hue + i × 137.5°`.

### Rotazione colori multi-entità

| Entità | Rotazione hue |
|--------|---------------|
| 0 (prima) | hue base (stesso dell'accento) |
| 1 | hue + 137.5° |
| 2 | hue + 275° |
| 3 | hue + 52.5° |
| … | continua con angolo aureo |

---

## Installazione

1. Copia `wesmart-infinite-chart-card.js` in:
   ```
   config/www/wesmart-infinite-chart-card.js
   ```

2. In Home Assistant → **Impostazioni → Dashboard → Risorse**, aggiungi:
   ```
   /local/wesmart-infinite-chart-card.js   (modulo JavaScript)
   ```

3. Hard refresh del browser (`Cmd+Shift+R` / `Ctrl+Shift+R`).

---

## Configurazione

### Entità singola

```yaml
type: custom:wesmart-infinite-chart-card
title: Temperatura Soggiorno
icon: mdi:thermometer
color: '#D97757'
theme: dark
entity: sensor.temperatura_soggiorno
```

### Multi-entità

```yaml
type: custom:wesmart-infinite-chart-card
title: Sensori Casa
color: '#60B4D8'
theme: dark
entities:
  - sensor.temperatura_soggiorno
  - entity: sensor.humidity_bagno
    name: Umidità Bagno
  - entity: binary_sensor.porta_ingresso
    name: Porta Ingresso
```

### Configurazione completa

```yaml
type: custom:wesmart-infinite-chart-card

color: '#D97757'               # Colore base — guida tutta la palette (default: '#D97757')
title: Monitoraggio Casa       # Titolo card
icon: mdi:chart-line           # Icona header (mdi:*)
theme: dark                    # dark | light | auto
hours: 24                      # Intervallo temporale default (1 · 6 · 24 · 168)
height: 100                    # Altezza area grafico in px (default: 100)
show_grid: false               # Grid lines orizzontali (default: false)
zoom: true                     # Abilita drag-to-zoom (default: true)

# Singola entità (alternativa a entities:)
entity: sensor.temperatura_soggiorno
name: Temperatura              # Nome opzionale

# Oppure lista multi-entità
entities:
  - sensor.temperatura_soggiorno
  - entity: sensor.humidity_bagno
    name: Umidità Bagno
    icon: mdi:water-percent
  - entity: binary_sensor.porta_ingresso
    name: Porta Ingresso
    icon: mdi:door
```

---

## Tutte le opzioni

| Opzione | Tipo | Default | Descrizione |
|---------|------|---------|-------------|
| `color` | string | `'#D97757'` | Colore base per la palette InfiniteColor |
| `title` | string | `'Grafico'` | Titolo card |
| `icon` | string | `mdi:chart-line` | Icona header (mdi:*) |
| `theme` | string | `'dark'` | `dark` \| `light` \| `auto` |
| `hours` | number | `24` | Range temporale default (1 · 6 · 24 · 168) |
| `height` | number | `100` | Altezza area grafico in px |
| `show_grid` | boolean | `false` | Mostra grid lines orizzontali |
| `zoom` | boolean | `true` | Abilita drag-to-zoom |
| `entity` | string | — | Entità singola (alternativa a `entities`) |
| `entities` | list | — | Lista entità (alternativa a `entity`) |

### Formato entità

```yaml
entities:
  - sensor.temperatura_soggiorno             # stringa semplice
  - entity: sensor.humidity_bagno            # oggetto con override
    name: Umidità Bagno
    icon: mdi:water-percent
```

| Campo entità | Tipo | Default | Descrizione |
|---|---|---|---|
| `entity` | string | — | ID entità (obbligatorio) |
| `name` | string | auto | Override nome visualizzato |
| `icon` | string | auto | Override icona (mdi:*) |

---

## Esempi per colore

```yaml
# Arancione WeSmart — energia/consumi
color: '#D97757'
title: Energia

# Blu freddo — clima/temperatura
color: '#60B4D8'
title: Temperatura

# Verde — aperture/sicurezza
color: '#7CB87A'
title: Porte e Finestre

# Viola — scene/automazioni
color: '#A78BFA'
title: Automazioni

# Ambra — batterie/sensori
color: '#F59E0B'
title: Batterie
```

---

## Differenze rispetto alla versione Original

| Caratteristica | WeSmart Original | WeSmart InfiniteColor |
|----------------|------------------|-----------------------|
| Colore accento | Fisso `#D97757` | Qualsiasi `color: '#RRGGBB'` |
| Palette | Hardcoded nel CSS | Generata dinamicamente |
| Colori multi-entità | Palette fissa 6 colori | Rotazione hue angolo aureo |
| Auto theme live | No (solo al caricamento) | Sì — ricalcola la palette al cambio OS |
| Memory management | — | `disconnectedCallback()` rimuove listener |

---

## Tipi di grafico

### Grafico a linee (entità numeriche)

- Tracciato SVG con tratto colorato (1.8px) — colore specifico per entità
- Area fill con gradiente
- Asse Y con min/max della prima entità numerica
- Scala Y indipendente per ogni entità → visibilità ottimale per unità diverse

### Barra timeline (entità binarie)

- Una barra per entità con etichetta
- Segmento colorato = stato attivo
- Stat legenda: `Attivo X%`

---

## Zoom

- **Attivazione:** drag sinistra → destra sull'area grafico
- **Reset:** doppio click oppure "↺ Reset zoom"
- Filtra i dati già in cache — **nessun re-fetch**

---

## Tooltip

- Linea verticale tratteggiata sul cursore
- Box con ora + valori di ogni entità numerica
- Si capovolge automaticamente vicino al bordo destro

---

## Come funziona

```
GET /api/history/period/{start}
  ?filter_entity_id={entity_ids}
  &end_time={end}
  &minimal_response=true
  &significant_changes_only=false
```

Lo storico viene recuperato al caricamento e ad ogni cambio di pill temporale.
Lo zoom usa i dati già in cache.
Lo stato corrente in legenda si aggiorna ad ogni cambio di stato HA.

---

## Esempi completi

```yaml
# Multi-temperatura con tema blu
type: custom:wesmart-infinite-chart-card
title: Temperature
color: '#60B4D8'
theme: dark
hours: 24
height: 120
show_grid: true
entities:
  - entity: sensor.temperatura_soggiorno
    name: Soggiorno
  - entity: sensor.temperatura_cucina
    name: Cucina
  - entity: sensor.temperatura_ext
    name: Esterno

# Energia fotovoltaica con tema ambra
type: custom:wesmart-infinite-chart-card
title: Energia
color: '#F59E0B'
theme: auto
hours: 24
entities:
  - entity: sensor.solar_power
    name: Fotovoltaico
  - entity: sensor.power_consumption
    name: Consumo

# Aperture con tema verde
type: custom:wesmart-infinite-chart-card
title: Porte e Finestre
color: '#7CB87A'
theme: dark
hours: 24
entities:
  - entity: binary_sensor.porta_ingresso
    name: Porta ingresso
  - entity: binary_sensor.finestra_cucina
    name: Finestra cucina
  - entity: binary_sensor.finestra_soggiorno
    name: Finestra soggiorno
```
