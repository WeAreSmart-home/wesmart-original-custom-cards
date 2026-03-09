# WeSmart Dashboards

Una collezione di card dashboard di punta per Home Assistant.

---

# WeSmart Super Dashboard

Una dashboard automatizzata all-in-one che scopre e organizza automaticamente le tue entità in un'interfaccia moderna e a schermo intero.

## Funzionalità
- **Auto-Discovery**: Trova automaticamente luci, sensori, clima e interruttori.
- **Modalità Schermo Intero / Panel Mode**: Progettata per occupare l'intera vista.
- **Navigazione a Tab**: Panoramica, Luci, Clima, Sensori, Interruttori e Impostazioni.
- **Doppia Persistenza**:
  - **Globale**: Escludi entità permanentemente tramite YAML.
  - **Locale**: Nascondi/mostra entità al volo tramite la tab Impostazioni nella card.

## Configurazione

```yaml
type: custom:wesmart-super-dashboard
title: La Mia Casa
theme: dark
max_overview_items: 6
exclude_entities:
  - light.test_bulb
  - sensor.internal_temp
```

---
---

# WeSmart Dashboards

A collection of flagship dashbord cards for Home Assistant.

---

# WeSmart Super Dashboard

An all-in-one automated dashboard that automatically discovers and organizes your entities into a modern, full-screen interface.

## Features
- **Auto-Discovery**: Automatically finds lights, sensors, climate, and switches.
- **Full-Screen / Panel Mode**: Designed to occupy the entire view.
- **Tabbed Navigation**: Overview, Lights, Climate, Sensors, Switches, and Settings.
- **Dual Persistence**:
  - **Global**: Exclude entities permanently via YAML.
  - **Local**: Hide/show entities on the fly via the in-card Settings tab.

## Configuration

```yaml
type: custom:wesmart-super-dashboard
title: My Home
theme: dark
max_overview_items: 6
exclude_entities:
  - light.test_bulb
  - sensor.internal_temp
```
