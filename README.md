# WeSmart Custom Cards — Home Assistant

A premium collection of custom cards for Home Assistant Dashboard, inspired by the **Anthropic WeSmart AI** aesthetic: warm charcoal dark theme, orange accent, and minimal typography.

---

## 📸 Preview

![Lights Preview](asset/images/lights-cards.webp)
![Sensors Preview](asset/images/sensor.webp)

---

## 🚀 Installation

### 1. Copy Files
Copy the `.js` file of each card you want to use into your Home Assistant `config/www/` directory.

### 2. Add Resources
In Home Assistant → **Settings → Dashboards → Resources**, add a new entry for each card:
- **URL**: `/local/wesmart-light-card.js` (example)
- **Type**: `JavaScript module`

### 3. Reload
Perform a hard refresh of your browser (`Cmd+Shift+R` or `Ctrl+Shift+R`).

---

## 🎨 Design System

All cards share a unified design language based on premium "Claude-like" tokens:

| Token | Dark Value | Light Value |
|-------|------------|-------------|
| `--bg` | `#1C1917` | `#FFFEFA` |
| `--surface` | `#292524` | `#F5F0EB` |
| `--accent` | `#D97757` | — |

---

## 🎴 Available Cards

### WeSmart Commander Hub
The flagship central dashboard card. Features a smart greeting, tabbed navigation, and automated system alerts.

### WeSmart Light Card
Single light entity with full controls: toggle, brightness, color temperature, and color (hue).
![Light Card Video](asset/video/light-card.mp4)

### WeSmart Lights & Expand Card
Multiple light entities in a compact list. The "Expand" version features animated inline sliders.
![Lights Expand Video](asset/video/lights-expand-cards.mp4)

### WeSmart Climate & Compact Card
Advanced climate control with target temperature, HVAC modes, and fan speed.
![Climate Preview](asset/images/climate-e-compact-cards.webp)

### WeSmart Sensors & Doors
Compact lists for environmental sensors and binary sensors (doors, windows, motion) with status pills.
![Doors Preview](asset/images/doors.webp)

### WeSmart History & Infinite Color Card
Interactive history graphs. The "Infinite Color" version generates its entire palette from a single base color.
![History Video](asset/video/history-card.mp4)
![Infinite Color Video](asset/video/Infinite-color-card.mp4)

### WeSmart Buttons (Bar & Grid)
Quick-access buttons for lights, scenes, and switches, arranged in horizontal bars or automatic grids.
![Buttons Preview](asset/images/bar-e-grid-button-cards.webp)

### WeSmart Battery Status
Monitor all your devices with circular or linear battery indicators.
![Battery Preview](asset/images/battery-cards.webp)

### WeSmart Clock Card
Sleek ambient clock with entity sidebar or bottom bar info.
![Clock Preview](asset/images/clock-card.webp)

---

## 📁 Project Structure

```
.
├── WeSmart-Original/      # Standard cards (fixed palette)
├── WeSmart-InfiniteColor/ # Dynamic HSL color engine cards
├── asset/                 # Images and videos
└── doc/                   # Documentation source
```

---

*Ispirate all'estetica Anthropic WeSmart AI.*
