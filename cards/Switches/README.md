# WeSmart Switches Card

Una card personalizzata per Home Assistant per controllare e monitorare più interruttori, ispirata all'estetica Anthropic Claude.

## Funzionalità
- **Toggle Interattivi**: Clicca direttamente sull'icona per attivare/disattivare l'entità (ON/OFF).
- **Feedback Stato**: Le icone brillano arancione quando l'entità è ON.
- **Informazioni Dettagliate**: Clicca sulla riga (fuori dall'icona) per aprire il dialogo "More Info" standard.
- **Supporto**: Funziona con `switch.*`, `light.*`, `input_boolean.*`, `fan.*` e altri.
- **Temi Dark/Light/Auto**: Si abbina al design system del progetto.

## Installazione

1. Copia `wesmart-switches-card.js` nella tua directory `config/www/`.
2. Aggiungi la risorsa in Home Assistant:
   - **URL**: `/local/wesmart-switches-card.js`
   - **Tipo**: Modulo JavaScript
3. Ricarica il tuo dashboard.

## Configurazione

```yaml
type: custom:wesmart-switches-card
title: Interruttori Soggiorno
icon: mdi:power-settings
theme: auto
entities:
  - switch.living_room_light
  - entity: switch.coffee_maker
    name: Macchina del Caffè
    icon: mdi:coffee
  - input_boolean.guest_mode
```

## Opzioni

| Opzione | Tipo | Default | Descrizione |
|---------|------|---------|-------------|
| `title` | string | `Switches` | Intestazione card |
| `icon` | string | `mdi:toggle-switch` | Icona header |
| `theme` | string | `dark` | `dark` \| `light` \| `auto` |
| `entities` | list | — | **Obbligatorio.** Lista entità switch/toggle |

### Opzioni entità
| Opzione | Tipo | Descrizione |
|---------|------|-------------|
| `entity` | string | **Obbligatorio.** ID entità |
| `name` | string | Sovrascrittura nome visualizzato opzionale |
| `icon` | string | Sovrascrittura icona opzionale |

---
---

# WeSmart Switches Card

A Home Assistant custom card to control and monitor multiple switches, styled after the Anthropic Claude aesthetic.

## Features
- **Interactive Toggles**: Click the icon directly to toggle the entity (ON/OFF).
- **State Feedback**: Icons glow orange when the entity is ON.
- **Detailed Info**: Click the row (outside the icon) to open the standard "More Info" dialog.
- **Support**: Works with `switch.*`, `light.*`, `input_boolean.*`, `fan.*`, and more.
- **Dark/Light/Auto Themes**: Matches the project's design system.

## Installation

1. Copy `wesmart-switches-card.js` to your `config/www/` directory.
2. Add the resource in Home Assistant:
   - **URL**: `/local/wesmart-switches-card.js`
   - **Type**: JavaScript module
3. Refresh your dashboard.

## Configuration

```yaml
type: custom:wesmart-switches-card
title: Living Room Switches
icon: mdi:power-settings
theme: auto
entities:
  - switch.living_room_light
  - entity: switch.coffee_maker
    name: Coffee Machine
    icon: mdi:coffee
  - input_boolean.guest_mode
```

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `title` | string | `Switches` | Card heading |
| `icon` | string | `mdi:toggle-switch` | Header icon |
| `theme` | string | `dark` | `dark` \| `light` \| `auto` |
| `entities` | list | — | **Required.** List of switch/toggle entities |

### Entity Options
| Option | Type | Description |
|--------|------|-------------|
| `entity` | string | **Required.** Entity ID |
| `name` | string | Optional display name override |
| `icon` | string | Optional icon override |
