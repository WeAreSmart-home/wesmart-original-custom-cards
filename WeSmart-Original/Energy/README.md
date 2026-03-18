# WeSmart Energy Flow Card

Card personalizzata per Home Assistant che visualizza in tempo reale il flusso energetico tra rete elettrica, pannelli solari, batterie di accumulo e consumi domestici.

---

## Anteprima layout

```
        ☀️ Solar
        2.4 kW
           ↓ ↓ ↓
⚡ Grid ────── 🏠 Home ────── 🔋 Battery
 0.8 kW       3.2 kW          0.0 kW

 ↔ Net balance   Importing 0.8 kW
```

I nodi Solar, Grid e Battery sono **opzionali**: compaiono nella card solo se l'entità corrispondente è configurata.

---

## Installazione

1. Copia `wesmart-energy-flow-card.js` in `config/www/`
2. In Home Assistant → **Impostazioni → Dashboard → Risorse**, aggiungi:

   | URL | Tipo |
   |-----|------|
   | `/local/wesmart-energy-flow-card.js` | JavaScript module |

3. Hard refresh del browser: `Cmd+Shift+R` (macOS) / `Ctrl+Shift+R` (Windows/Linux)

---

## Configurazione

### Minima (solo consumo casa)

```yaml
type: custom:wesmart-energy-flow-card
home_power: sensor.home_power
```

### Completa

```yaml
type: custom:wesmart-energy-flow-card
title: Energy Flow
icon: mdi:lightning-bolt-circle
theme: dark
home_power: sensor.home_power
grid_power: sensor.grid_power
solar_power: sensor.solar_power
battery_power: sensor.battery_power
battery_invert: false
```

---

## Opzioni

| Opzione | Tipo | Default | Descrizione |
|---------|------|---------|-------------|
| `title` | string | `'Energy Flow'` | Titolo della card |
| `icon` | string | `mdi:lightning-bolt-circle` | Icona nell'header |
| `theme` | string | `'dark'` | `dark` \| `light` \| `auto` |
| `home_power` | string | — | **Obbligatorio.** Entità potenza consumata dalla casa |
| `grid_power` | string | — | Opzionale. Entità potenza rete elettrica |
| `solar_power` | string | — | Opzionale. Entità produzione solare |
| `battery_power` | string | — | Opzionale. Entità potenza batteria |
| `battery_invert` | boolean | `false` | Inverte la convenzione dei segni della batteria |

---

## Entità e unità di misura

Le entità possono avere `unit_of_measurement` pari a **`W`** o **`kW`** — la card rileva e converte automaticamente.

### Convenzioni segni

| Entità | Positivo | Negativo |
|--------|----------|----------|
| `grid_power` | Prelievo dalla rete (import) | Immissione in rete (export) |
| `solar_power` | Produzione (sempre positivo) | — |
| `battery_power` | Carica batteria | Scarica batteria |

Se la tua integrazione usa la convenzione **opposta** per la batteria (positivo = scarica), imposta:

```yaml
battery_invert: true
```

---

## Flusso animato

I connettori tra i nodi mostrano **pallini animati** che si muovono nella direzione del flusso energetico reale:

| Connettore | Condizione | Direzione animazione | Colore |
|------------|------------|----------------------|--------|
| Grid → Home | Import dalla rete | Grid → Home | Arancione |
| Home → Grid | Export in rete | Home → Grid | Verde |
| Solar → Home | Produzione solare | Solar → Home | Giallo |
| Home → Battery | Carica batteria | Home → Battery | Verde |
| Battery → Home | Scarica batteria | Battery → Home | Blu |

---

## Colori e stati

| Stato | Nodo | Colore |
|-------|------|--------|
| Produzione solare | Solar | Giallo `#F0C060` + glow |
| Prelievo rete | Grid | Arancione `#D97757` + glow |
| Immissione rete | Grid | Verde `#7EC8A0` + glow |
| Carica batteria | Battery | Verde `#7EC8A0` + glow |
| Scarica batteria | Battery | Blu `#60B4D8` + glow |
| Consumo attivo | Home | Bianco caldo + glow |

---

## Net Balance

Se `grid_power` è configurato, in basso alla card appare una barra di riepilogo:

| Valore rete | Testo mostrato | Colore |
|-------------|----------------|--------|
| > 0 | `Importing X.XX kW` | Arancione |
| < 0 | `Exporting X.XX kW` | Verde |
| ≈ 0 | `Balanced` | Grigio muted |

---

## Temi

| Tema | Sfondo | Superfici | Descrizione |
|------|--------|-----------|-------------|
| `dark` | `#292524` | `#332E2A` | Carbone caldo scuro (default) |
| `light` | `#FFFEFA` | `#F5F0EB` | Crema chiaro |
| `auto` | — | — | Segue `prefers-color-scheme` del sistema |

---

## Esempi

### Solo consumo + rete

```yaml
type: custom:wesmart-energy-flow-card
title: Consumi Casa
theme: dark
home_power: sensor.shellyem_channel_1_power
grid_power: sensor.shellyem_channel_1_power
```

### Con solare (niente batteria)

```yaml
type: custom:wesmart-energy-flow-card
title: Energia Casa
theme: dark
home_power: sensor.home_consumption_power
grid_power: sensor.grid_power
solar_power: sensor.solar_inverter_power
```

### Impianto completo (rete + solare + batteria)

```yaml
type: custom:wesmart-energy-flow-card
title: Energy Flow
theme: dark
home_power: sensor.home_power_w
grid_power: sensor.grid_power_w
solar_power: sensor.solar_power_w
battery_power: sensor.battery_power_w
battery_invert: false
```

### Tema chiaro

```yaml
type: custom:wesmart-energy-flow-card
title: Energy Flow
theme: light
home_power: sensor.home_power
grid_power: sensor.grid_power
solar_power: sensor.solar_power
```

---

## Architettura

```
wesmart-energy-flow-card.js
  └─ class WeSmartEnergyFlowCard extends HTMLElement
      ├─ attachShadow({ mode: 'open' })   → styling isolato
      ├─ setConfig(config)                → parsing YAML, build HTML
      ├─ set hass(hass)                   → aggiornamento stato reattivo
      ├─ _render()                        → CSS + DOM iniziale
      ├─ _update()                        → aggiorna valori, stati, animazioni
      └─ _setState(nodeId, state)         → applica data-state per colori CSS

customElements.define('wesmart-energy-flow-card', ...)
```

Nessun build step. Nessuna dipendenza. Vanilla JS puro.

---

## Compatibilità

- Home Assistant 2021.6+
- Browser moderni (Chrome, Firefox, Safari, Edge)
- Funziona con qualsiasi integrazione che esponga sensori di potenza (`W` o `kW`)

Integrazioni testate: Shelly EM, SolarEdge, Fronius, Solax, Huawei Solar, Growatt, SMA, Tibber, Enphase.
