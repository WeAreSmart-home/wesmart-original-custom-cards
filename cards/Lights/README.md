# WeSmart Lights Cards (Multi-Luce) — v2.0.0

Due varianti di card per controllare gruppi o liste di entità `light.*`, entrambe dotate di **Visual Editor grafico in stile Bubble Card** e **Motore Cromatico Dinamico (InfiniteColor)**:

| Card | Tag Principale | Alias Retrocompatibile | Interazione Riga |
|------|----------------|------------------------|------------------|
| **WeSmart Lights Card** | `custom:wesmart-lights-card` | `custom:wesmart-infinite-lights-card` | Tap riga → apre dialogo More Info |
| **WeSmart Lights Expand Card** | `custom:wesmart-lights-expand-card` | `custom:wesmart-infinite-lights-expand-card` | Tap riga → espande slider inline animati (Luminosità + Kelvin) |

---

## ✨ Novità v2.0.0 — Visual Entity List Manager (Stile Bubble Card)

Entrambe le card includono ora un **configuratore visuale completo** direttamente nella finestra "Modifica Card" di Home Assistant:
1. **🏷️ 1. Intestazione & Motore InfiniteColor**:
   - Configurazione visuale di **Titolo** (`title`) e **Icona Header** (con Icon Picker MDI).
   - Selettore visuale del **Tema** (`🌙 Dark` · `☀️ Light` · `🔄 Auto`).
   - **8 Swatches Preset InfiniteColor** cliccabili (incluso `#D97757` WeSmart Original) + **Color Picker HEX** libero.
2. **💡 2. Gestione Lista Luci Interattiva**:
   - **Aggiunta rapida**: menu a tendina ufficiale di Home Assistant filtrato su `light.*` per cercare e aggiungere luci con un clic.
   - **Riordino senza YAML**: pulsanti `↑` e `↓` su ogni riga per cambiare l'ordine delle luci.
   - **Personalizzazione per singola luce (`⚙️`)**: clicca sull'ingranaggio di una riga per impostare un **Nome** o un'**Icona** personalizzata per quella specifica luce.
   - **Rimozione (`✕`)**: elimina rapidamente una luce dalla lista.

---

## 📦 Installazione

1. Copia [`wesmart-lights-card.js`](wesmart-lights-card.js) e/o [`wesmart-lights-expand-card.js`](wesmart-lights-expand-card.js) in `config/www/`.
2. Aggiungi le risorse in **Impostazioni → Dashboard → Risorse**:
   - `/local/wesmart-lights-card.js` (`Modulo JavaScript`)
   - `/local/wesmart-lights-expand-card.js` (`Modulo JavaScript`)
3. Esegui un Hard Refresh del browser (`Cmd+Shift+R` / `Ctrl+Shift+R`).

---

## 📝 Configurazione YAML (Opzionale)

### Esempio WeSmart Lights Card (Lista Compatta)
```yaml
type: custom:wesmart-lights-card
title: Luci Soggiorno
icon: mdi:lightbulb-group
color: '#D97757'
theme: dark
entities:
  - light.plafoniera_soggiorno
  - entity: light.lampada_lettura
    name: Angolo Lettura
    icon: mdi:floor-lamp
  - entity: light.striscia_led_tv
    name: Retroilluminazione TV
    icon: mdi:led-strip-variant
```

### Esempio WeSmart Lights Expand Card (Con Slider Inline Espandibili)
```yaml
type: custom:wesmart-lights-expand-card
title: Illuminazione Camera
icon: mdi:bed
color: '#A78BFA'
theme: auto
entities:
  - entity: light.camera_soffitto
    name: Lampadario
  - entity: light.abat_jour_ sinistra
    name: Comodino SX
    icon: mdi:lamp
  - entity: light.abat_jour_destra
    name: Comodino DX
    icon: mdi:lamp
```

### Parametri Supportati

| Opzione | Tipo | Default | Descrizione |
|---------|------|---------|-------------|
| `title` | `string` | `'Lights'` | Titolo nell'intestazione della card |
| `icon` | `string` | `'mdi:lightbulb-group'` | Icona nell'intestazione della card |
| `color` | `string` | `'#D97757'` | Colore base HEX per il motore **InfiniteColor** |
| `theme` | `string` | `'dark'` | `dark` \| `light` \| `auto` |
| `entities` | `list` | — | Lista di ID entità `light.*` o oggetti `{ entity, name, icon }` |

---
---

# WeSmart Lights & Lights Expand Cards — v2.0.0 (English)

Two multi-entity `light.*` cards featuring the **InfiniteColor Dynamic Palette Engine** and a built-in **Bubble Card-style Visual Entity List Manager**:
- **`wesmart-lights-card`**: Compact list with master toggle, individual toggles, and More Info dialog on row tap.
- **`wesmart-lights-expand-card`**: Same compact list, but tapping a row smoothly expands inline **Brightness** and **Color Temperature (Kelvin)** sliders right inside the card.
