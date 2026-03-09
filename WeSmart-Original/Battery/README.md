# WeSmart Battery Status Card

Una card personalizzata per Home Assistant per monitorare i livelli di batteria di più dispositivi, ispirata all'estetica Anthropic Claude.

## Funzionalità
- **Icone Dinamiche**: Le icone cambiano in base alla percentuale di batteria (incrementi del 10%).
- **Stato di Carica**: Rileva automaticamente lo stato di carica.
- **Codice Colore**:
  - < 15%: Arancione WeSmart (Critico)
  - 15% - 30%: Arancione/Giallo attenuato (Avviso)
  - > 30%: Verde attenuato (Buono)
- **Header di Stato**: Mostra un riepilogo dei dispositivi con batteria scarica.
- **Temi Dark/Light/Auto**: Si integra perfettamente con il tema del tuo dashboard.

## Installazione

1. Copia `wesmart-battery-status-card.js` nella tua directory `config/www/`.
2. Aggiungi la risorsa in Home Assistant:
   - **URL**: `/local/wesmart-battery-status-card.js`
   - **Tipo**: Modulo JavaScript
3. Ricarica il tuo dashboard.

## Configurazione

```yaml
type: custom:wesmart-battery-status-card
title: Stato Batterie
icon: mdi:battery-check
theme: auto
display_type: circular      # Opzioni: icon (default), linear, circular
entities:
  - sensor.phone_battery_level
  - entity: sensor.tablet_battery_level
    name: Tablet
    display_type: linear    # Override per questa entità specifica
  - entity: sensor.remote_battery
    name: Telecomando TV
    display_type: icon      # Usa icone invece di anello/barra
```

## Opzioni

| Opzione | Tipo | Default | Descrizione |
|---------|------|---------|-------------|
| `title` | string | `Batteries` | Intestazione card |
| `icon` | string | `mdi:battery-check` | Icona header |
| `theme` | string | `dark` | `dark` \| `light` \| `auto` |
| `display_type` | string | `icon` | Stile visualizzazione: `icon`, `linear`, `circular` |
| `entities` | list | — | **Obbligatorio.** Lista entità sensore batteria |

### Opzioni entità
| Opzione | Tipo | Descrizione |
|---------|------|-------------|
| `entity` | string | **Obbligatorio.** Entità sensore batteria |
| `name` | string | Sovrascrittura nome visualizzato opzionale |
| `display_type` | string | Sovrascrittura tipo visualizzazione per questa entità specifica |

---
---

# WeSmart Battery Status Card

A Home Assistant custom card to monitor battery levels across multiple devices, styled after the Anthropic Claude aesthetic.

## Features
- **Dynamic Icons**: Icons change based on battery percentage (10% increments).
- **Charging State**: Automatically detects charging status.
- **Color Coding**: 
  - < 15%: WeSmart Orange (Critical)
  - 15% - 30%: Muted Orange/Yellow (Warning)
  - > 30%: Muted Green (Good)
- **Status Header**: Shows a summary of low battery devices.
- **Dark/Light/Auto Themes**: Seamlessly integrates with your dashboard theme.

## Installation

1. Copy `wesmart-battery-status-card.js` to your `config/www/` directory.
2. Add the resource in Home Assistant:
   - **URL**: `/local/wesmart-battery-status-card.js`
   - **Type**: JavaScript module
3. Refresh your dashboard.

## Configuration

```yaml
type: custom:wesmart-battery-status-card
title: Battery Status
icon: mdi:battery-check
theme: auto
display_type: circular      # Options: icon (default), linear, circular
entities:
  - sensor.phone_battery_level
  - entity: sensor.tablet_battery_level
    name: Tablet
    display_type: linear    # Override for this specific entity
  - entity: sensor.remote_battery
    name: TV Remote
    display_type: icon      # Uses icons instead of ring/bar
```

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `title` | string | `Batteries` | Card heading |
| `icon` | string | `mdi:battery-check` | Header icon |
| `theme` | string | `dark` | `dark` \| `light` \| `auto` |
| `display_type` | string | `icon` | Visualization style: `icon`, `linear`, `circular` |
| `entities` | list | — | **Required.** List of battery sensor entities |

### Entity Options
| Option | Type | Description |
|--------|------|-------------|
| `entity` | string | **Required.** Battery sensor entity |
| `name` | string | Optional display name override |
| `display_type` | string | Override display type for this specific entity |
