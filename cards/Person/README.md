# WeSmart Person Card

A minimal list card for tracking person presence, zones, and device battery levels.

## Features
- **Avatars**: Automatically uses the Home Assistant `entity_picture` if available, otherwise falls back to a neat material icon.
- **Status Dot**: Green for Home, Orange for Zones, Grey for Away.
- **Battery Tracking**: Optionally link a battery sensor to show real-time battery percentage of the person's device.
- **Theme Support**: Fully supports `dark`, `light`, and `auto` themes from the WeSmart palette.

## Usage

```yaml
type: custom:wesmart-person-card
title: Family
theme: dark # auto | light | dark
entities:
  - entity: person.massimo
    name: Massimo
    battery_entity: sensor.massimo_iphone_battery_level
  - entity: person.giulia
```

## Options

| Name | Type | Requirement | Description |
|------|------|-------------|-------------|
| `type` | string | **Required** | `custom:wesmart-person-card` |
| `title` | string | Optional | Title of the card. Default: `Family` |
| `theme` | string | Optional | `dark`, `light`, or `auto`. Default: `dark` |
| `entities` | list | **Required** | List of entities. |

### Entity Options

| Name | Type | Requirement | Description |
|------|------|-------------|-------------|
| `entity` | string | **Required** | Entity ID of the person (e.g. `person.admin`) or device tracker. |
| `name` | string | Optional | Override the friendly name. |
| `battery_entity`| string | Optional | Entity ID of a battery sensor to display next to the status. |
