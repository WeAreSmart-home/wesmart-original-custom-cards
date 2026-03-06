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
