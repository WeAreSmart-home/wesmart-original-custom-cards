# WeSmart Card (`wesmart-card.js` v1.1.0) — All-in-One Modular Suite

**`WeSmart-Card`** è il nuovo sistema **All-in-One** per Home Assistant ispirato al paradigma *Bubble Card*: **un solo file `.js` da installare** (`wesmart-card.js`) e **una sola card da aggiungere** (`custom:wesmart-card`), con una **finestra di configurazione visuale (GUI)** da cui selezionare il tipo di card (`card_type`), le entità e la palette **InfiniteColor**.

---

## ✨ Tipi di Card Disponibili (`card_type`)

Nella versione **v1.1.0**, il selettore visuale in cima all'editor include **5 tipologie**:

| `card_type` | Icona | Nome | Descrizione |
|---|---|---|---|
| **`light`** *(Default)* | 💡 | **Light (Singola)** | Controllo completo per **1 luce** con slider interattivi per **Luminosità (1–100%)**, **Temperatura Colore (Kelvin)** e **Colore RGB (Hue 0–360°)**. |
| **`lights`** | 📋 | **Lights (Lista)** | Lista **multi-luce compatta** con **Master Toggle** di gruppo nell'header, toggle singoli per riga e apertura **More Info** al tap. |
| **`lights-expand`** | 🎚 | **Lights Expand** | Lista **multi-luce espandibile a fisarmonica**: cliccando su una riga accesa si apre un pannello animato inline con slider di **Luminosità** e **Temperatura Colore**. |
| **`chart`** | 📈 | **Chart (Grafico)** | Grafico interattivo per **1 o più entità sovrapposte** (sensori numerici o binari) con **Drag-to-Zoom**, **Tooltip hover**, pill temporali (`1h` / `6h` / `24h` / `7d`), altezza regolabile e griglia. |
| **`history`** | 📊 | **History (Storico)** | Lista storica **multi-entità** dove **ogni riga ha il proprio mini-grafico dedicato** (curva SVG con `min – max` per sensori numerici, barra timeline con `Attivo X%` per entità binarie). |

> 🔜 **Prossimi Moduli pronti per l'integrazione in `wesmart-card.js`**: `climate`, `climate-compact`, `sensors`, `doors`, `switches`, `buttons-bar`, `buttons-grid`, `media-player`, `weather`, `energy-flow`.

---

## 📦 Installazione su Home Assistant

### 1. Copia il file `.js` in una sottocartella ordinata
Dentro la cartella `/config/www/` di Home Assistant, crea la sottocartella `wesmart-cards` e copia al suo interno **solo il file `wesmart-card.js`**:

```text
/config/www/wesmart-cards/wesmart-card.js
```

### 2. Aggiungi la Risorsa in Home Assistant
Vai su **Impostazioni → Dashboard → ⋮ (in alto a destra) → Risorse → + Aggiungi risorsa**:

- **URL:** `/local/wesmart-cards/wesmart-card.js?v=1.1.0`
- **Tipo di risorsa:** `Modulo JavaScript`

*(Ricorda: in Home Assistant la cartella `/config/www/` corrisponde sempre all'indirizzo web `/local/`).*

### 3. Aggiungi la Card dalla Dashboard (Zero YAML!)
1. Apri qualsiasi Dashboard → **Modifica Dashboard** → **+ Aggiungi Card**.
2. Cerca e clicca su **WeSmart Card (All-in-One)**.
3. In cima alla finestra dell'Editor Visuale, scegli il **Tipo di Card**:
   - **💡 Light** · **📋 Lights** · **🎚 Lights Expand** · **📈 Chart** · **📊 History**
4. Seleziona le tue entità dal menu a tendina, scegli il colore dalla palette **InfiniteColor** e clicca su **Salva**!

---

## ⚙️ Esempi YAML (Opzionali)

### 1. Luce Singola (`card_type: light`)
```yaml
type: custom:wesmart-card
card_type: light
entity: light.soggiorno
name: Lampada Soggiorno
color: '#D97757'
theme: dark
show_brightness: true
show_color_temp: true
show_color: true
collapse_when_off: false
dynamic_light_color: true
show_footer: true
```

### 2. Lista Luci Compatta (`card_type: lights`)
```yaml
type: custom:wesmart-card
card_type: lights
title: Luci Zona Giorno
color: '#60B4D8'
theme: dark
entities:
  - light.soggiorno
  - entity: light.cucina
    name: Isola Cucina
    icon: mdi:ceiling-light
```

### 3. Lista Luci Espandibile (`card_type: lights-expand`)
```yaml
type: custom:wesmart-card
card_type: lights-expand
title: Luci Zona Notte
color: '#A78BFA'
theme: auto
entities:
  - entity: light.camera_matrimoniale
    name: Camera Matrimoniale
  - light.comodino_sx
```

### 4. Grafico Interattivo con Drag-to-Zoom (`card_type: chart`)
```yaml
type: custom:wesmart-card
card_type: chart
title: Temperature Casa
icon: mdi:chart-areaspline
color: '#F59E0B'
theme: dark
hours: 24
height: 120
show_grid: true
zoom: true
entities:
  - entity: sensor.temperatura_soggiorno
    name: Soggiorno
  - entity: sensor.temperatura_camera
    name: Camera
```

### 5. Storico Multi-Riga (`card_type: history`)
```yaml
type: custom:wesmart-card
card_type: history
title: Storico Sensori & Porte
icon: mdi:chart-timeline
color: '#7EC8A0'
theme: dark
hours: 24
entities:
  - sensor.temperatura_soggiorno
  - binary_sensor.porta_ingresso
  - light.soggiorno
```

---

## 📖 Documentazione Tecnica
Consulta [`DOCUMENTATION.md`](./DOCUMENTATION.md) per tutti i dettagli sull'architettura modulare `CARD_TYPES`, sul ciclo di vita di `getConfigElement()` e su tutti i parametri disponibili.
