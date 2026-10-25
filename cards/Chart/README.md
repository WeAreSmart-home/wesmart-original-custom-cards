# WeSmart Chart Card

Una card grafico personalizzata per Home Assistant con stile **WeSmart Original**.
Supporta singola entità e multi-entità su un grafico unico, con zoom interattivo, tooltip hover e pill filtro temporale.
Temi **dark**, **light** e **auto**.

---

## Funzionalità

- **Rilevamento automatico tipo grafico:**
  - Entità numeriche (`sensor.*`) → **grafico a linee SVG** con area fill e gradiente
  - Entità binarie (`binary_sensor.*`, `light.*`, `switch.*`, ecc.) → **barre timeline** per ogni entità
- **Multi-entità** — più entità su un unico grafico sovrapposto, ciascuna con colore distinto
- **Pill filtro temporale interattivi:** `1h` · `6h` · `24h` · `7d`
- **Drag-to-zoom** — trascina sull'area del grafico per zoomare in memoria (nessuna nuova richiesta HA)
  - Doppio click per resettare lo zoom
  - Pulsante "↺ Reset zoom" visibile durante lo zoom
- **Tooltip hover** — linea verticale tratteggiata + box con valore/ora per ogni entità
- **Etichette asse Y** — min/max della prima entità numerica
- **Grid lines opzionali** (`show_grid: true`)
- **Legenda** — una riga per entità con: dot colorato · nome · stato corrente · range min–max
- **Asse temporale** — etichette HH:MM (≤ 48h) o giorno+data (> 48h)
- Barra loader animata durante il fetch
- Clic su riga legenda → apre dialogo **More Info**
- Tre modalità tema: `dark`, `light`, `auto`

---

## Colori multi-entità

La versione Original usa una palette fissa di 6 colori che si ripete:

| Indice | Colore | Uso tipico |
|--------|--------|-----------|
| 0 | `#D97757` Arancione WeSmart | Prima entità |
| 1 | `#60B4D8` Blu freddo | Seconda entità |
| 2 | `#5aad6f` Verde | Terza entità |
| 3 | `#A78BFA` Viola | Quarta entità |
| 4 | `#F59E0B` Ambra | Quinta entità |
| 5 | `#EC4899` Rosa | Sesta entità |

---

## Installazione

1. Copia `wesmart-chart-card.js` in:
   ```
   config/www/wesmart-chart-card.js
   ```

2. In Home Assistant → **Impostazioni → Dashboard → Risorse**, aggiungi:
   ```
   /local/wesmart-chart-card.js   (modulo JavaScript)
   ```

3. Hard refresh del browser (`Cmd+Shift+R` / `Ctrl+Shift+R`).

---

## Configurazione

### Entità singola

```yaml
type: custom:wesmart-chart-card
title: Temperatura Soggiorno
icon: mdi:thermometer
theme: dark
entity: sensor.temperatura_soggiorno
```

### Multi-entità

```yaml
type: custom:wesmart-chart-card
title: Sensori Casa
theme: dark
entities:
  - sensor.temperatura_soggiorno
  - entity: sensor.humidity_bagno
    name: Umidità Bagno
    icon: mdi:water-percent
  - entity: binary_sensor.porta_ingresso
    name: Porta Ingresso
```

### Configurazione completa

```yaml
type: custom:wesmart-chart-card

title: Monitoraggio Casa       # Titolo card
icon: mdi:chart-line           # Icona header (mdi:*)
theme: dark                    # dark | light | auto
hours: 24                      # Intervallo temporale default (1 · 6 · 24 · 168)
height: 100                    # Altezza area grafico in px (default: 100)
show_grid: false               # Mostra grid lines orizzontali (default: false)
zoom: true                     # Abilita drag-to-zoom (default: true)

# Singola entità (alternativa a entities:)
entity: sensor.temperatura_soggiorno
name: Temperatura              # Nome opzionale (override)

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

Ogni voce in `entities` può essere una stringa semplice o un oggetto:

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

## Tipi di grafico

### Grafico a linee (entità numeriche)

Renderizzato automaticamente se lo storico contiene valori numerici.

- Tracciato SVG con tratto colorato (1.8px)
- Area fill con gradiente dal colore a trasparente
- Asse Y con etichette min/max della prima entità numerica
- Ogni entità ha la propria scala Y indipendente → visibilità ottimale per unità diverse
- Grid lines opzionali (`show_grid: true`)

### Barra timeline (entità binarie)

Renderizzato automaticamente se tutte le entità hanno stati non numerici (`on`/`off`, `open`/`closed`, ecc.).

- Una barra per entità, etichettata con il nome
- Segmento colorato = stato attivo (`on`, `open`, `detected`, `unlocked`, `wet`, `active`, `home`, `playing`)
- Stat nella legenda: `Attivo X%` — percentuale del range in stato attivo

---

## Zoom

- **Attivazione:** trascina da sinistra a destra sull'area del grafico
- **Reset:** doppio click sull'area grafico oppure clic sul pulsante "↺ Reset zoom"
- Lo zoom filtra i dati in memoria: **nessuna nuova richiesta** all'API di HA
- Il pill selezionato determina la finestra massima; lo zoom la restringe

---

## Tooltip

Il tooltip hover mostra, per ogni punto del cursore:

- **Ora** (HH:MM per range ≤ 48h, giorno+mese per 7d)
- **Valore** di ogni entità numerica al punto più vicino in tempo
- **Dot colorato** per identificare ogni linea

Il box si posiziona automaticamente a destra del cursore e si capovolge a sinistra vicino al bordo destro del grafico.

---

## Come funziona

La card usa la **history REST API** di Home Assistant:

```
GET /api/history/period/{start}
  ?filter_entity_id={entity_ids}
  &end_time={end}
  &minimal_response=true
  &significant_changes_only=false
```

Lo storico viene recuperato al caricamento e ad ogni cambio di pill temporale.
Lo zoom usa i dati già in cache — nessun re-fetch.
Lo stato corrente in legenda si aggiorna ad ogni cambio di stato HA (via `set hass()`).

---

## Esempi

```yaml
# Monitoraggio temperature multi-stanza
type: custom:wesmart-chart-card
title: Temperature
icon: mdi:thermometer-lines
theme: dark
hours: 24
height: 120
show_grid: true
entities:
  - entity: sensor.temperatura_soggiorno
    name: Soggiorno
  - entity: sensor.temperatura_cucina
    name: Cucina
  - entity: sensor.temperatura_camera
    name: Camera

# Energia e potenza
type: custom:wesmart-chart-card
title: Energia
icon: mdi:lightning-bolt
theme: dark
hours: 24
entities:
  - entity: sensor.power_consumption
    name: Consumo
  - entity: sensor.solar_power
    name: Fotovoltaico

# Solo sensori binari (porte e finestre)
type: custom:wesmart-chart-card
title: Aperture
icon: mdi:door-open
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
