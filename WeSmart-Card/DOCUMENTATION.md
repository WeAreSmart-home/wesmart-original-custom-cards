# WeSmart Card (`wesmart-card.js` v1.1.0) — Technical Documentation & Architecture

**[Italiano](#italiano)** | **[English](#english)**

![WeSmart Card All-in-One Visual Configurator](./assets/wesmart-card-configurator.png)

---

<a name="italiano"></a>
## Italiano

Questa guida documenta nel dettaglio l'architettura modulare di **`WeSmart-Card/wesmart-card.js`** (`type: custom:wesmart-card`), che rappresenta il passo evolutivo successivo rispetto alle card standalone precedenti: un **unico file JavaScript** che espone **un'unica card** nel selettore di Home Assistant e permette di scegliere, ottimizzare e configurare ogni tipologia di card (`card_type`) tramite il **Visual Editor GUI** integrato (`<wesmart-card-editor>`).

> **Obiettivo del Progetto**: Portare progressivamente tutte le card del catalogo WeSmart dentro questa nuova architettura All-in-One con configurazione grafica, migliorandole e aggiungendone di nuove.

---

### 1. Architettura Modulare `CARD_TYPES`

All'interno di `wesmart-card.js`, il registro `CARD_TYPES` definisce le tipologie di card selezionabili in cima alla finestra del configuratore visuale:

```js
const CARD_TYPES = [
  { id: 'light',         mode: 'single',  category: 'Lights', icon: 'mdi:lightbulb-on',         name: 'Light',         sub: '1 Luce · Slider completi' },
  { id: 'lights',        mode: 'list',    category: 'Lights', icon: 'mdi:format-list-bulleted', name: 'Lights',        sub: 'Multi-luce · Toggle rapidi' },
  { id: 'lights-expand', mode: 'expand',  category: 'Lights', icon: 'mdi:tune-vertical',        name: 'Lights Expand', sub: 'Multi-luce · Slider inline' },
  { id: 'chart',         mode: 'chart',   category: 'Graphs', icon: 'mdi:chart-areaspline',     name: 'Chart',         sub: 'Grafico Zoom & Tooltip' },
  { id: 'history',       mode: 'history', category: 'Graphs', icon: 'mdi:chart-timeline',       name: 'History',       sub: 'Storico per ogni riga' },
];
```

#### Adattamento dinamico dell'Editor Visuale (`WeSmartCardEditor`)
Quando l'utente seleziona un `card_type` nel configuratore:
- **Modalità `light`**: mostra il selettore entità singola (`domain: light`) e i toggle dedicati agli slider luce (*Luminosità*, *Kelvin*, *Hue RGB*, *Comprimi da spenta*, *Colore Dinamico RGB*).
- **Modalità `lights` / `lights-expand`**: mostra l'elenco multi-entità con selettore filtrato su `domain: light`.
- **Modalità `chart` / `history`**:
  - Sblocca automaticamente il selettore di aggiunta entità su **tutti i domini** di Home Assistant (`sensor.*`, `binary_sensor.*`, `light.*`, `switch.*`, `climate.*`, ecc.).
  - Nella sezione **3. Controlli & Comportamento**, sostituisce le opzioni delle luci con i controlli dedicati ai grafici:
    - **Intervallo Temporale (`hours`)**: `1h`, `6h`, `24h`, `7d`
    - **Altezza Area Grafico (`height`, px)**: Slider da `60px` a `220px` (modalità `chart`)
    - **Mostra Griglia Orizzontale (`show_grid`)** (modalità `chart`)
    - **Abilita Drag-to-Zoom (`zoom`)** (modalità `chart`)

---

### 2. Ciclo di Vita del Visual Editor in Home Assistant (`getConfigElement`)

```mermaid
sequenceDiagram
    participant User as Utente (Browser)
    participant HA as Home Assistant Dialog
    participant Card as WeSmartCard (wesmart-card)
    participant Editor as WeSmartCardEditor (wesmart-card-editor)

    User->>HA: Clicca "Aggiungi Card" -> "WeSmart Card (All-in-One)"
    HA->>Card: Chiama static getConfigElement()
    Card-->>HA: Restituisce document.createElement('wesmart-card-editor')
    HA->>Editor: Imposta editor.hass = hass
    HA->>Editor: Chiama editor.setConfig(config)
    Editor-->>User: Mostra griglia CARD_TYPES (Light / Lights / Lights Expand / Chart / History)
    User->>Editor: Clicca un Tipo di Card, sceglie Entità, Opzioni o Colore
    Editor->>HA: Dispara CustomEvent('config-changed', { detail: { config: newConfig } })
    HA->>Card: Chiama card.setConfig(newConfig) (Anteprima Live immediata)
```

---

### 3. Riferimento Parametri (`custom:wesmart-card`)

#### Opzioni Comuni a tutti i `card_type`

| Proprietà | Tipo | Default | Descrizione |
|---|---|---|---|
| `type` | `string` | **Obbligatorio** | `custom:wesmart-card` |
| `card_type` | `string` | `'light'` | Tipo di card: `'light'`, `'lights'`, `'lights-expand'`, `'chart'`, `'history'`. |
| `color` | `string` | `'#D97757'` | Colore base esadecimale (`#RRGGBB`) per il motore **InfiniteColor**. |
| `theme` | `string` | `'dark'` | Tema superficie: `'dark'`, `'light'` oppure `'auto'`. |
| `show_footer` | `boolean` | `true` | Mostra o nasconde il footer WeSmart. |

#### Opzioni per `card_type: light` (Luce Singola)

| Proprietà | Tipo | Default | Descrizione |
|---|---|---|---|
| `entity` | `string` | **Obbligatorio** | Entità `light.*` (es. `light.soggiorno`). |
| `name` | `string` | `null` | Nome personalizzato. |
| `icon` | `string` | `null` | Icona MDI personalizzata (es. `mdi:floor-lamp`). |
| `show_brightness` | `boolean` | `true` | Mostra lo slider Luminosità (1–100%). |
| `show_color_temp` | `boolean` | `true` | Mostra lo slider Temperatura Colore (Kelvin), se supportato. |
| `show_color` | `boolean` | `true` | Mostra lo slider Colore RGB (Hue 0–360°), se supportato. |
| `collapse_when_off` | `boolean` | `false` | Nasconde gli slider quando la luce è spenta. |
| `dynamic_light_color` | `boolean` | `false` | Adatta l'accento della card al colore reale RGB della lampadina accesa. |

#### Opzioni per `card_type: lights` e `card_type: lights-expand` (Multi-Luce)

| Proprietà | Tipo | Default | Descrizione |
|---|---|---|---|
| `title` | `string` | `'Lights'` | Titolo del gruppo mostrato nell'header. |
| `icon` | `string` | `'mdi:lightbulb-group'` | Icona mostrata nell'header del gruppo. |
| `entities` | `array` | **Obbligatorio** | Array di stringhe (`light.id`) o oggetti `{ entity, name, icon }`. |

#### Opzioni per `card_type: chart` e `card_type: history` (Grafici & Storico)

| Proprietà | Tipo | Default | Descrizione |
|---|---|---|---|
| `title` | `string` | `'Grafico'` / `'History'` | Titolo mostrato nell'header della card. |
| `icon` | `string` | `'mdi:chart-areaspline'` | Icona mostrata nell'header. |
| `entities` | `array` | **Obbligatorio** | Lista di qualsiasi entità (`sensor.*`, `binary_sensor.*`, `light.*`, ecc.) come stringa o `{ entity, name, icon }`. |
| `hours` | `number` | `24` | Intervallo temporale iniziale in ore (`1`, `6`, `24`, `168`). |
| `height` | `number` | `100` | *(Solo `chart`)* Altezza in pixel dell'area del grafico SVG (`60` – `220`). |
| `show_grid` | `boolean` | `false` | *(Solo `chart`)* Mostra le linee guida orizzontali dietro il grafico. |
| `zoom` | `boolean` | `true` | *(Solo `chart`)* Abilita il Drag-to-Zoom interattivo col mouse o touch (doppio clic per resettare). |

---

<a name="english"></a>
## English

This guide documents the modular architecture of **`WeSmart-Card/wesmart-card.js`** (`type: custom:wesmart-card`), which represents the next evolutionary step beyond standalone WeSmart cards: a **single JavaScript file** that registers **a single card** in the Home Assistant card picker and lets users select, optimize, and configure every card type (`card_type`) via the built-in **Visual Editor GUI** (`<wesmart-card-editor>`).

> **Project Goal**: Progressively migrate all cards from the WeSmart catalog into this unified All-in-One architecture with graphical configuration, improving existing cards and introducing new ones.

---

### 1. Modular `CARD_TYPES` Architecture

Inside `wesmart-card.js`, the `CARD_TYPES` registry defines the card types selectable at the top of the visual configurator:

```js
const CARD_TYPES = [
  { id: 'light',         mode: 'single',  category: 'Lights', icon: 'mdi:lightbulb-on',         name: 'Light',         sub: '1 Luce · Slider completi' },
  { id: 'lights',        mode: 'list',    category: 'Lights', icon: 'mdi:format-list-bulleted', name: 'Lights',        sub: 'Multi-luce · Toggle rapidi' },
  { id: 'lights-expand', mode: 'expand',  category: 'Lights', icon: 'mdi:tune-vertical',        name: 'Lights Expand', sub: 'Multi-luce · Slider inline' },
  { id: 'chart',         mode: 'chart',   category: 'Graphs', icon: 'mdi:chart-areaspline',     name: 'Chart',         sub: 'Grafico Zoom & Tooltip' },
  { id: 'history',       mode: 'history', category: 'Graphs', icon: 'mdi:chart-timeline',       name: 'History',       sub: 'Storico per ogni riga' },
];
```

#### Dynamic Adaptation in the Visual Editor (`WeSmartCardEditor`)
When the user selects a `card_type` in the configurator:
- **`light` mode**: displays the single-entity picker (`domain: light`) and dedicated light slider toggles (*Brightness*, *Kelvin*, *Hue RGB*, *Collapse when off*, *Dynamic RGB light color*).
- **`lights` / `lights-expand` modes**: displays the multi-entity list manager with the entity picker filtered to `domain: light`.
- **`chart` / `history` modes**:
  - Automatically unlocks the entity picker across **all Home Assistant domains** (`sensor.*`, `binary_sensor.*`, `light.*`, `switch.*`, `climate.*`, etc.).
  - In section **3. Controls & Behavior**, replaces light-specific toggles with chart controls:
    - **Default Time Range (`hours`)**: `1h`, `6h`, `24h`, `7d`
    - **Chart Area Height (`height`, px)**: Slider from `60px` to `220px` (`chart` mode)
    - **Show Horizontal Grid (`show_grid`)** (`chart` mode)
    - **Enable Drag-to-Zoom (`zoom`)** (`chart` mode)

---

### 2. Visual Editor Lifecycle in Home Assistant (`getConfigElement`)

1. **`static getConfigElement()`**: Called by Home Assistant Lovelace when opening the card configuration dialog; returns `document.createElement('wesmart-card-editor')`.
2. **`static getStubConfig(hass, entities)`**: Provides the initial default configuration (`card_type: 'light'`, `color: '#D97757'`, `theme: 'dark'`).
3. **`config-changed` CustomEvent**: Fired by `WeSmartCardEditor` whenever any option is modified, updating the live card preview in real time.

---

### 3. Configuration Parameters Reference (`custom:wesmart-card`)

#### Global Options (Shared across all `card_type` modes)

| Property | Type | Default | Description |
|---|---|---|---|
| `type` | `string` | **Required** | `custom:wesmart-card` |
| `card_type` | `string` | `'light'` | Card mode: `'light'`, `'lights'`, `'lights-expand'`, `'chart'`, `'history'`. |
| `color` | `string` | `'#D97757'` | Base HEX color (`#RRGGBB`) for the **InfiniteColor** engine. |
| `theme` | `string` | `'dark'` | Surface theme: `'dark'`, `'light'`, or `'auto'`. |
| `show_footer` | `boolean` | `true` | Shows or hides the bottom WeSmart status bar. |

#### Options for `card_type: light` (Single Light)

| Property | Type | Default | Description |
|---|---|---|---|
| `entity` | `string` | **Required** | `light.*` entity ID (e.g. `light.living_room`). |
| `name` | `string` | `null` | Custom display name override. |
| `icon` | `string` | `null` | Custom MDI icon override (e.g. `mdi:floor-lamp`). |
| `show_brightness` | `boolean` | `true` | Displays the Brightness slider (1–100%). |
| `show_color_temp` | `boolean` | `true` | Displays the Color Temperature slider (Kelvin), if supported. |
| `show_color` | `boolean` | `true` | Displays the RGB Hue slider (0–360°), if supported. |
| `collapse_when_off` | `boolean` | `false` | Collapses all sliders when the light is turned off. |
| `dynamic_light_color` | `boolean` | `false` | Tints the card accent with the real RGB color of the active bulb. |

#### Options for `card_type: lights` & `card_type: lights-expand` (Multi-Light)

| Property | Type | Default | Description |
|---|---|---|---|
| `title` | `string` | `'Lights'` | Group title displayed in the card header. |
| `icon` | `string` | `'mdi:lightbulb-group'` | Header icon for the group. |
| `entities` | `array` | **Required** | Array of entity ID strings (`light.id`) or objects `{ entity, name, icon }`. |

#### Options for `card_type: chart` & `card_type: history` (Graphs & History)

| Property | Type | Default | Description |
|---|---|---|---|
| `title` | `string` | `'Grafico'` / `'History'` | Header title. |
| `icon` | `string` | `'mdi:chart-areaspline'` | Header icon. |
| `entities` | `array` | **Required** | List of any entities (`sensor.*`, `binary_sensor.*`, `light.*`, etc.) as strings or `{ entity, name, icon }`. |
| `hours` | `number` | `24` | Default time range in hours (`1`, `6`, `24`, `168`). |
| `height` | `number` | `100` | *(`chart` only)* Height in pixels of the SVG chart area (`60` – `220`). |
| `show_grid` | `boolean` | `false` | *(`chart` only)* Renders horizontal guide lines behind the chart. |
| `zoom` | `boolean` | `true` | *(`chart` only)* Enables interactive mouse/touch Drag-to-Zoom (double-click to reset). |
