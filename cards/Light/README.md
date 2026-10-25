# WeSmart Light Card — 3-in-1 Unified Suite (`v2.1.0`)

Un **unico file `.js`** (`wesmart-light-card.js`) e **un'unica card** nel selettore di Home Assistant che racchiude **3 modalità di visualizzazione** selezionabili direttamente dall'**Editor Visuale (GUI)** in stile *Bubble Card*, oltre al motore **InfiniteColor** integrato.

---

## ✨ Le 3 Modalità Integrate (`card_type`)

Appena aggiungi **WeSmart Light Card (3-in-1)** nella dashboard di Home Assistant, in cima alla finestra di configurazione trovi il selettore visuale **Tipo di Card**:

| Modalità (`card_type`) | Icona | Descrizione |
|---|---|---|
| **`single`** *(Default)* | 💡 **Singola** | Controllo dedicato per **1 luce** con slider interattivi trascinabili per **Luminosità (1–100%)**, **Temperatura Colore (Kelvin)** e **Colore RGB (Hue 0–360°)**. |
| **`list`** | 📋 **Lista Compatta** | Lista **multi-luce** con **Master Toggle** nell'header (accende/spegne tutto il gruppo), toggle singoli per riga e apertura **More Info** al tap. |
| **`expand`** | 🎚 **Lista Expand** | Lista **multi-luce espandibile a fisarmonica**: cliccando su una riga accesa si apre un pannello animato inline con gli slider di **Luminosità** e **Temperatura Colore** senza uscire dalla card. |

> **Passaggio intelligente tra modalità**: se passi da `single` a `list` o `expand` nell'Editor Visuale, la luce configurata viene automaticamente migrata nella lista `entities` (e viceversa).

---

## 🖥 Editor Visuale GUI Integrato

Non serve scrivere YAML! Tutta la configurazione avviene tramite la finestra dedicata:

1. **Selettore Tipo di Card (`single` / `list` / `expand`)** sempre visibile in alto.
2. **Selettore Entità & Icone nativo HA (`<ha-form>`)** con ricerca istantanea delle luci (`domain: light`) e picker icone MDI.
3. **Gestore Lista Luci Interattivo** (nelle modalità `list` ed `expand`):
   - Aggiungi luci con `+ Aggiungi Luce`
   - Riordina le righe con `↑` e `↓`
   - Espandi `⚙️` per personalizzare **Nome** e **Icona** di ogni singola riga
   - Rimuovi con `✕`
4. **InfiniteColor Palette Studio**:
   - **8 Preset rapidi** (*Claude Orange `#D97757`*, *Ocean Blue `#3B82F6`*, *Forest Green `#10B981`*, *Violet `#8B5CF6`*, *Rose `#EC4899`*, *Amber `#F59E0B`*, *Cyan `#06B6D4`*, *Slate `#64748B`*)
   - **Color Picker nativo + input HEX** per generare la palette dinamica da qualsiasi colore
   - **Selettore Tema** (`Dark`, `Light`, `Auto`)
   - **Colore Dinamico Luce RGB** (`dynamic_light_color`): adatta l'accento della card al colore reale della lampadina RGB accesa.

---

## 📦 Installazione (Un solo file in una sottocartella ordinata)

### 1. Copia il file in Home Assistant
Crea una sottocartella ordinata `wesmart-cards` dentro `/config/www/` e copia **solo questo file**:

```text
/config/www/wesmart-cards/wesmart-light-card.js
```

### 2. Registra la Risorsa in Lovelace
Vai in **Impostazioni → Dashboard → ⋮ (in alto a destra) → Risorse → Aggiungi risorsa**:

- **URL:** `/local/wesmart-cards/wesmart-light-card.js?v=2.1.0`
- **Tipo di risorsa:** `Modulo JavaScript`

*(In alternativa, in `configuration.yaml`)*:
```yaml
lovelace:
  resources:
    - url: /local/wesmart-cards/wesmart-light-card.js?v=2.1.0
      type: module
```

> **Nota importante:** in Home Assistant la cartella fisica `/config/www/` corrisponde sempre all'URL `/local/`.

---

## 🚀 Utilizzo da Interfaccia (Consigliato)

1. Apri la tua Dashboard → **Modifica Dashboard** → **+ Aggiungi Card**.
2. Cerca **WeSmart Light Card (3-in-1)**.
3. Scegli in alto tra **💡 Singola**, **📋 Lista Compatta** o **🎚 Lista Expand** e configura entità, controlli e colori con l'anteprima live!

---

## ⚙️ Esempi YAML (Opzionali)

### Modalità 1: Luce Singola (`card_type: single`)
```yaml
type: custom:wesmart-light-card
card_type: single
entity: light.soggiorno
name: Luce Soggiorno
color: '#D97757'
theme: dark
show_brightness: true
show_color_temp: true
show_color: true
collapse_when_off: false
dynamic_light_color: true
show_footer: true
```

### Modalità 2: Lista Compatta (`card_type: list`)
```yaml
type: custom:wesmart-light-card
card_type: list
title: Luci Zona Giorno
color: '#3B82F6'
theme: dark
dynamic_light_color: false
show_footer: true
entities:
  - light.soggiorno
  - entity: light.cucina
    name: Isola Cucina
    icon: mdi:TrackLight
  - light.ingresso
```

### Modalità 3: Lista Espandibile (`card_type: expand`)
```yaml
type: custom:wesmart-light-card
card_type: expand
title: Luci Camere
color: '#8B5CF6'
theme: auto
dynamic_light_color: true
show_footer: true
entities:
  - entity: light.camera_matrimoniale
    name: Camera Matrimoniale
    icon: mdi:bed-king-outline
  - entity: light.comodino_ sinistra
    name: Comodino SX
  - light.studio
```

---

## 🔄 Retrocompatibilità Totale

Il file `wesmart-light-card.js` registra automaticamente tutti i tag precedenti come alias:
- `custom:wesmart-light-card` / `custom:wesmart-infinite-light-card`
- `custom:wesmart-lights-card` / `custom:wesmart-infinite-lights-card` (forza automaticamente `card_type: list` se non specificato)
- `custom:wesmart-lights-expand-card` / `custom:wesmart-infinite-lights-expand-card` (forza automaticamente `card_type: expand` se non specificato)

Per i dettagli tecnici sull'architettura dell'Editor Visuale (`getConfigElement()`, `<ha-form>`, eventi `config-changed`), consulta [`DOCUMENTATION.md`](./DOCUMENTATION.md).
