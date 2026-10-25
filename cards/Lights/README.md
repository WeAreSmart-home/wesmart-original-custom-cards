# Lights Cards

Due varianti di card per controllare più entità `light.*`, entrambe ispirate all'estetica **Anthropic WeSmart AI**. Scegli quella più adatta al tuo caso d'uso.

| Card | Tipo | Interazione |
|------|------|-------------|
| WeSmart Lights Card | `custom:wesmart-lights-card` | Tap riga → dialogo More Info |
| WeSmart Lights Expand Card | `custom:wesmart-lights-expand-card` | Tap riga → slider inline (animati) |

---

## WeSmart Lights Card

Lista compatta con toggle individuali. Toccando una riga si apre il dialogo HA More Info.

### Anteprima

**Tema dark** — carbone caldo scuro, accenti arancioni, glow per riga quando accesa.
**Tema light** — crema calda `#FFFEFA`, stesso accento arancione `#D97757`.

### Funzionalità

- Toggle master (tutte on/off contemporaneamente)
- Toggle per riga
- Testo stato in tempo reale: luminosità % + temperatura colore K
- Sottotitolo header: "2 di 4 accese" / "Tutte accese" / "Tutte spente"
- Tap riga → apre dialogo **More Info**
- Entità non disponibili oscurate e non interattive
- Temi: `dark` · `light` · `auto`

### Installazione

1. Copia in `config/www/wesmart-lights-card.js`
2. Aggiungi risorsa `/local/wesmart-lights-card.js` (modulo JavaScript)
3. Hard refresh (`Cmd+Shift+R` / `Ctrl+Shift+R`)

### Configurazione

```yaml
type: custom:wesmart-lights-card
title: Soggiorno
entities:
  - light.ceiling
  - light.floor_lamp
  - light.led_strip
```

**Opzioni:**

| Opzione | Tipo | Default | Descrizione |
|---------|------|---------|-------------|
| `title` | string | `'Lights'` | Intestazione card |
| `icon` | string | `mdi:lightbulb-group` | Icona header (mdi:*) |
| `theme` | string | `'dark'` | `dark` \| `light` \| `auto` |
| `entities` | list | — | **Obbligatorio.** Lista entità luce |

**Campi elemento entità:**

| Campo | Tipo | Descrizione |
|-------|------|-------------|
| `entity` | string | **Obbligatorio.** ID entità `light.*` |
| `name` | string | Sovrascrittura nome visualizzato |
| `icon` | string | Sovrascrittura icona (mdi:*) |

### Esempio completo

```yaml
type: custom:wesmart-lights-card
title: Camera
icon: mdi:bed
theme: light
entities:
  - entity: light.bedroom_ceiling
    name: Soffitto
    icon: mdi:ceiling-light
  - entity: light.bedside_left
    name: Lampada Sinistra
    icon: mdi:lamp
  - entity: light.bedside_right
    name: Lampada Destra
    icon: mdi:lamp
  - entity: light.wardrobe_strip
    name: Armadio
    icon: mdi:led-strip-variant
```

---

## WeSmart Lights Expand Card

Stesso layout a lista, ma toccando una riga si **espande un pannello inline** con slider di luminosità e temperatura colore — senza lasciare il dashboard.

### Anteprima

**Compresso** — identico alla Lights Card standard.
**Espanso** — il pannello scorre verso il basso con:
- Slider luminosità (riempimento + cursore arancione)
- Slider temperatura colore (gradiente caldo → freddo)
- Chevron ruota 180° per indicare lo stato aperto

### Funzionalità

- Toggle master (tutte on/off contemporaneamente)
- Toggle per riga (non attiva l'espansione)
- Tap riga → **pannello accordion animato**
  - Un solo pannello aperto alla volta
  - Tap sulla stessa riga → chiude
- Pannello espanso (quando la luce è **accesa**):
  - Slider luminosità — trascinamento per regolare, applicato al rilascio
  - Slider temperatura colore — gradiente caldo→freddo, mostrato solo se supportato
- Suggerimento "Accendi per regolare" quando la luce è spenta
- Testo stato in riga: luminosità % + temperatura colore K
- Sottotitolo header: "N di M accese" / "Tutte accese" / "Tutte spente"
- Entità non disponibili oscurate e non interattive
- Temi: `dark` · `light` · `auto`

### Animazioni

| Elemento | Effetto |
|---------|--------|
| Chevron | Ruota 180° (`transform cubic-bezier`) |
| Pannello | Accordion `max-height` + `opacity` |
| Contenuto pannello | `translateY` slide-up |
| Cursore slider | Anello glow al trascinamento |
| Bordo pannello | Appare progressivamente all'apertura |

### Installazione

1. Copia in `config/www/wesmart-lights-expand-card.js`
2. Aggiungi risorsa `/local/wesmart-lights-expand-card.js` (modulo JavaScript)
3. Hard refresh (`Cmd+Shift+R` / `Ctrl+Shift+R`)

### Configurazione

```yaml
type: custom:wesmart-lights-expand-card
title: Soggiorno
entities:
  - light.ceiling
  - light.floor_lamp
  - light.led_strip
```

**Opzioni:**

| Opzione | Tipo | Default | Descrizione |
|---------|------|---------|-------------|
| `title` | string | `'Lights'` | Intestazione card |
| `icon` | string | `mdi:lightbulb-group` | Icona header (mdi:*) |
| `theme` | string | `'dark'` | `dark` \| `light` \| `auto` |
| `entities` | list | — | **Obbligatorio.** Lista entità luce |

**Campi elemento entità:**

| Campo | Tipo | Descrizione |
|-------|------|-------------|
| `entity` | string | **Obbligatorio.** ID entità `light.*` |
| `name` | string | Sovrascrittura nome visualizzato |
| `icon` | string | Sovrascrittura icona (mdi:*) |

### Esempio completo

```yaml
type: custom:wesmart-lights-expand-card
title: Soggiorno
icon: mdi:sofa
theme: dark
entities:
  - entity: light.soggiorno_soffitto
    name: Soffitto
    icon: mdi:ceiling-light
  - entity: light.soggiorno_piantana
    name: Piantana
    icon: mdi:floor-lamp
  - entity: light.soggiorno_strip
    name: LED Strip
    icon: mdi:led-strip-variant
  - entity: light.soggiorno_tavolo
    name: Tavolo
    icon: mdi:lamp-outline
```

### Note

- Lo slider luminosità è nascosto quando l'entità luce ha solo modalità `onoff` (nessun attributo `brightness`).
- Lo slider temperatura colore è nascosto quando `color_temp` non è tra gli attributi di stato dell'entità.
- `min_mireds` / `max_mireds` dagli attributi dell'entità vengono rispettati per il range CT; default 153–500 se non disponibili.
- Le modifiche degli slider vengono inviate a HA al **rilascio del puntatore** (non ad ogni movimento) per evitare di sovraccaricare il bus.

---
---

# Lights Cards

Two card variants for controlling multiple `light.*` entities, both styled after the **Anthropic WeSmart AI** aesthetic. Choose the one that fits your use case.

| Card | Type key | Interaction |
|------|----------|-------------|
| WeSmart Lights Card | `custom:wesmart-lights-card` | Tap row → More Info dialog |
| WeSmart Lights Expand Card | `custom:wesmart-lights-expand-card` | Tap row → inline sliders (animated) |

---

## WeSmart Lights Card

Compact list with individual toggles. Tapping a row opens the HA More Info dialog.

### Preview

**Dark theme** — deep warm charcoal, orange accents, per-row glow when on.
**Light theme** — warm cream `#FFFEFA`, same orange accent `#D97757`.

### Features

- Master toggle (all on/off at once)
- Per-row toggle switch
- Live state text: brightness % + color temperature K
- Header subtitle: "2 of 4 on" / "All on" / "All off"
- Tap row → opens **More Info** dialog
- Unavailable entities dimmed and non-interactive
- Themes: `dark` · `light` · `auto`

### Installation

1. Copy to `config/www/wesmart-lights-card.js`
2. Add resource `/local/wesmart-lights-card.js` (JavaScript module)
3. Hard refresh (`Cmd+Shift+R` / `Ctrl+Shift+R`)

### Configuration

```yaml
type: custom:wesmart-lights-card
title: Living Room
entities:
  - light.ceiling
  - light.floor_lamp
  - light.led_strip
```

**Options:**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `title` | string | `'Lights'` | Card heading |
| `icon` | string | `mdi:lightbulb-group` | Header icon (mdi:*) |
| `theme` | string | `'dark'` | `dark` \| `light` \| `auto` |
| `entities` | list | — | **Required.** Light entity list |

**Entity item fields:**

| Field | Type | Description |
|-------|------|-------------|
| `entity` | string | **Required.** `light.*` entity ID |
| `name` | string | Override display name |
| `icon` | string | Override icon (mdi:*) |

### Full example

```yaml
type: custom:wesmart-lights-card
title: Bedroom
icon: mdi:bed
theme: light
entities:
  - entity: light.bedroom_ceiling
    name: Ceiling
    icon: mdi:ceiling-light
  - entity: light.bedside_left
    name: Left Lamp
    icon: mdi:lamp
  - entity: light.bedside_right
    name: Right Lamp
    icon: mdi:lamp
  - entity: light.wardrobe_strip
    name: Wardrobe
    icon: mdi:led-strip-variant
```

---

## WeSmart Lights Expand Card

Same list layout, but tapping a row **expands an inline panel** with brightness and color-temperature sliders — without leaving the dashboard.

### Preview

**Collapsed** — identical to the standard Lights Card.
**Expanded** — panel slides down below the row with:
- Brightness slider (orange fill + thumb)
- Color-temperature slider (warm → cool gradient track)
- Chevron rotates 180° to indicate open state

### Features

- Master toggle (all on/off at once)
- Per-row toggle switch (does not trigger expand)
- Tap row → **animated accordion panel**
  - Only one panel open at a time
  - Tap same row again → closes
- Expand panel (when light is **on**):
  - Brightness slider — drag to adjust, applies on release
  - Color-temp slider — warm→cool gradient, shown only if supported
- "Turn on to adjust" hint when light is off
- Live state text in row: brightness % + color temperature K
- Header subtitle: "N of M on" / "All on" / "All off"
- Unavailable entities dimmed and non-interactive
- Themes: `dark` · `light` · `auto`

### Animations

| Element | Effect |
|---------|--------|
| Chevron | Rotates 180° (`transform cubic-bezier`) |
| Panel | `max-height` + `opacity` accordion |
| Panel content | `translateY` slide-up |
| Slider thumb | Glow ring on drag |
| Panel border | Fades in as panel opens |

### Installation

1. Copy to `config/www/wesmart-lights-expand-card.js`
2. Add resource `/local/wesmart-lights-expand-card.js` (JavaScript module)
3. Hard refresh (`Cmd+Shift+R` / `Ctrl+Shift+R`)

### Configuration

```yaml
type: custom:wesmart-lights-expand-card
title: Living Room
entities:
  - light.ceiling
  - light.floor_lamp
  - light.led_strip
```

**Options:**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `title` | string | `'Lights'` | Card heading |
| `icon` | string | `mdi:lightbulb-group` | Header icon (mdi:*) |
| `theme` | string | `'dark'` | `dark` \| `light` \| `auto` |
| `entities` | list | — | **Required.** Light entity list |

**Entity item fields:**

| Field | Type | Description |
|-------|------|-------------|
| `entity` | string | **Required.** `light.*` entity ID |
| `name` | string | Override display name |
| `icon` | string | Override icon (mdi:*) |

### Full example

```yaml
type: custom:wesmart-lights-expand-card
title: Soggiorno
icon: mdi:sofa
theme: dark
entities:
  - entity: light.soggiorno_soffitto
    name: Soffitto
    icon: mdi:ceiling-light
  - entity: light.soggiorno_piantana
    name: Piantana
    icon: mdi:floor-lamp
  - entity: light.soggiorno_strip
    name: LED Strip
    icon: mdi:led-strip-variant
  - entity: light.soggiorno_tavolo
    name: Tavolo
    icon: mdi:lamp-outline
```

### Notes

- The brightness slider is hidden when the light entity has `onoff` mode only (no `brightness` attribute).
- The color-temp slider is hidden when `color_temp` is not in the entity's state attributes.
- `min_mireds` / `max_mireds` from the entity attributes are respected for CT range; defaults to 153–500 if not available.
- Slider changes are sent to HA on **pointer release** (not on every move) to avoid flooding the bus.
