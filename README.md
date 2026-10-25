# WeSmart Custom Cards — Home Assistant

**[Italiano](#italiano)** | **[English](#english)**

Una collezione unificata e completa di custom Lovelace card per Home Assistant, ispirate all'estetica **WeSmart AI**: tema scuro carbone caldo, accenti vivaci, tipografia minimale e motore cromatico dinamico nativo.  
*A unified collection of custom Lovelace cards for Home Assistant, featuring the signature WeSmart warm charcoal aesthetic, minimal typography, and a built-in dynamic color engine.*

**No build step. No dependencies. 100% Pure Vanilla JS.**

---

### Fondatore e Visione / Founder & Vision

**Italiano:**  
Ciao! Sono **Massimo Di Vona** (precedentemente noto come *Max Novadi*), fondatore di [Wearesmart.it](https://www.wearesmart.it).  
Questo progetto nasce come punto di riferimento per la community di Home Assistant, unendo la passione per la domotica con la potenza delle moderne **Intelligenze Artificiali** (*Gemini* e *Claude Code*). Tutte le card integrano nativamente il **motore cromatico dinamico (InfiniteColor)**: con il colore di default mantengono l'iconico stile WeSmart (carbone e arancione `#D97757`), ma permettono a ciascun utente di trasformarle istantaneamente in qualunque palette cromatica desiderata.

**English:**  
Hi! I'm **Massimo Di Vona** (formerly known as *Max Novadi*), founder of [Wearesmart.it](https://www.wearesmart.it).  
This project was born for the Home Assistant community, merging passion for smart homes with modern AI capabilities. All cards natively feature the **Dynamic Color Engine (InfiniteColor)**: by default, they preserve the signature WeSmart warm charcoal and orange (`#D97757`) look, while allowing you to tint them into any color palette via a single hex parameter or visual picker.

---

<a name="italiano"></a>
## Il Passo Successivo: `WeSmart-Card` (All-in-One Studio con Configurazione Grafica UI)

> [!TIP]
> **Nuova Generazione All-in-One ([`WeSmart-Card/wesmart-card.js`](WeSmart-Card/) — `v1.1.0`)**  
> **[`WeSmart-Card/`](WeSmart-Card/)** rappresenta il **passo evolutivo successivo** rispetto alle card singole precedenti. L'obiettivo è migliorare e ottimizzare l'esperienza d'uso introducendo una **UI di configurazione grafica dedicata (Visual Editor)** in stile *Bubble Card*, racchiusa in **un unico file `.js`** (`wesmart-card.js`, tag `custom:wesmart-card`).
>
> **Obiettivo del Progetto (Roadmap):**  
> Portare progressivamente **tutte le card del catalogo WeSmart** dentro questa nuova versione All-in-One dotata di configuratore grafico, migliorarle, ottimizzarle e — dove possibile — **aggiungerne di nuove**.
>
> - **Moduli già attivi nel configuratore (`v1.1.0`)**: **Light (Singola)** · **Lights (Lista)** · **Lights Expand (Slider Inline)** · **Chart (Grafico con Zoom & Tooltip)** · **History (Storico per riga)**
> - **[Vai alla Guida Completa di `WeSmart-Card/`](WeSmart-Card/README.md)** · **[Documentazione Tecnica](WeSmart-Card/DOCUMENTATION.md)**

![WeSmart Card All-in-One Visual Configurator](WeSmart-Card/assets/wesmart-card-configurator.png)

---

## Novità e Riorganizzazione 2.0

> [!IMPORTANT]
> **Suite Unificata (Original + InfiniteColor):**  
> Le collezioni *WeSmart Original* e *WeSmart InfiniteColor* sono state unificate nella cartella [`cards/`](cards/).  
> Grazie al motore dinamico nativo, ogni card riproduce lo stile originale WeSmart per impostazione predefinita ed è compatibile sia con `type: custom:wesmart-[nome]-card` che con `type: custom:wesmart-infinite-[nome]-card` (nessuna rottura delle dashboard esistenti).

> [!NOTE]
> **WeSmart Labs Ufficialmente Chiuso:**  
> Il laboratorio sperimentale dei Labs è giunto al termine.
> - **WeSmart Garbage Solution**: ha completato la fase di incubazione ed è ora una card ufficiale integrata in [`cards/Garbage/`](cards/Garbage/) e disponibile anche come repository standalone ([wesmart-garbage-card](https://github.com/WeAreSmart-home/wesmart-garbage-card) + [wesmart-garbage backend](https://github.com/WeAreSmart-home/wesmart-garbage)).
> - **Prototipi Layout** (*Home Panel, Clean Panel, Surface, Cross Pad*): sono stati ritirati dal branch attivo e archiviati nella cronologia Git del progetto.

---

<a name="english"></a>
## The Next Step: `WeSmart-Card` (All-in-One Studio with Visual Editor GUI)

> [!TIP]
> **Next-Generation All-in-One Suite ([`WeSmart-Card/wesmart-card.js`](WeSmart-Card/#english) — `v1.1.0`)**  
> **[`WeSmart-Card/`](WeSmart-Card/#english)** is the **next evolutionary step** beyond previous standalone cards. Its purpose is to streamline and optimize the user experience by introducing a **dedicated graphical configuration UI (Visual Editor)** inspired by *Bubble Card*, packaged into **a single `.js` file** (`wesmart-card.js`, tag `custom:wesmart-card`).
>
> **Project Goal & Roadmap:**  
> Progressively bring **all cards from the WeSmart catalog** into this new GUI-configured All-in-One version, refine and improve them, and introduce **brand-new card types**.
>
> - **Modules currently active in the configurator (`v1.1.0`)**: **Light (Single)** · **Lights (List)** · **Lights Expand (Inline Sliders)** · **Chart (Zoom & Tooltip Graph)** · **History (Per-row History)**
> - **[Read the `WeSmart-Card/` Guide (EN/IT)](WeSmart-Card/README.md#english)** · **[Technical Documentation (EN/IT)](WeSmart-Card/DOCUMENTATION.md#english)**

> [!IMPORTANT]
> **Unified Catalog (`cards/` — Original + InfiniteColor):**  
> The *WeSmart Original* and *WeSmart InfiniteColor* collections have been unified into [`cards/`](cards/). Every standalone card defaults to the classic `#D97757` WeSmart palette and registers both `wesmart-[name]-card` and `wesmart-infinite-[name]-card` for 100% backwards compatibility. *WeSmart Labs* has been retired; *WeSmart Garbage* has graduated to [`cards/Garbage/`](cards/Garbage/).

---

## Il Motore Cromatico Dinamico / Dynamic Color Engine

Ogni card genera automaticamente l'intera palette di colori (sfondo, superfici, testi a contrasto, ombre, bordi e grafici) a partire da un singolo colore esadecimale (`color: '#HEX'`):  
*Every card automatically computes its entire color palette (background, surfaces, contrast text, shadows, borders, and charts) from a single hex color (`color: '#HEX'`):*

```yaml
color: '#D97757'  -->  WeSmart Orange (default)
color: '#60B4D8'  -->  Ocean Blue (climate / temperature)
color: '#7EC8A0'  -->  Sage Green (doors / security)
color: '#A78BFA'  -->  Royal Purple (scenes / automations)
color: '#F59E0B'  -->  Warm Amber (sensors / energy)
```

Temi supportati / Supported themes: `dark`, `light`, `auto` (system `prefers-color-scheme`).

---

## Catalogo Completo delle Card / Full Card Catalog

| Card | Folder / Cartella | Primary YAML Tag | Backwards-Compatible Alias | Entity / Type |
|------|-------------------|------------------|----------------------------|---------------|
| **WeSmart Card (All-in-One)** | [`WeSmart-Card/`](WeSmart-Card/) | `wesmart-card` | — | **All-in-One with Visual Editor GUI** (`light`, `lights`, `lights-expand`, `chart`, `history` + upcoming modules) |
| **Battery** | [`cards/Battery/`](cards/Battery/) | `wesmart-battery-card` | `wesmart-battery-status-card`, `wesmart-infinite-battery-card` | `sensor.*` (batteries) |
| **Buttons Bar** | [`cards/Buttons/`](cards/Buttons/) | `wesmart-buttons-bar-card` | `wesmart-infinite-buttons-bar-card` | any / service |
| **Buttons Grid** | [`cards/Buttons/`](cards/Buttons/) | `wesmart-buttons-grid-card` | `wesmart-infinite-buttons-grid-card` | any / service |
| **Chart** | [`cards/Chart/`](cards/Chart/) | `wesmart-chart-card` | `wesmart-infinite-chart-card` | any sensor / multi |
| **Climate** | [`cards/Climate/`](cards/Climate/) | `wesmart-climate-card` | `wesmart-infinite-climate-card` | `climate.*` (single) |
| **Climate Compact** | [`cards/Climate/`](cards/Climate/) | `wesmart-climate-compact-card` | `wesmart-infinite-climate-compact-card` | `climate.*` (multi-zone) |
| **Clock** | [`cards/Clock/`](cards/Clock/) | `wesmart-clock-card` | `wesmart-infinite-clock-card` | clock + up to 3 entities |
| **Doors** | [`cards/Doors/`](cards/Doors/) | `wesmart-doors-card` | `wesmart-infinite-doors-card` | `binary_sensor.*` (doors/windows) |
| **Energy Flow** | [`cards/Energy/`](cards/Energy/) | `wesmart-energy-flow-card` | `wesmart-infinite-energy-flow-card` | `sensor.*` (power/energy) |
| **Garbage** | [`cards/Garbage/`](cards/Garbage/) | `wesmart-garbage-card` | `wesmart-infinite-garbage-card` | waste collection calendar |
| **History** | [`cards/History/`](cards/History/) | `wesmart-history-card` | `wesmart-infinite-history-card`, `wesmart-infinite-color-card` | any entity / history |
| **Light** | [`cards/Light/`](cards/Light/) | `wesmart-light-card` | `wesmart-infinite-light-card` | `light.*` (single, dimmer, rgb) |
| **Lights** | [`cards/Lights/`](cards/Lights/) | `wesmart-lights-card` | `wesmart-infinite-lights-card` | `light.*` (multi-light list) |
| **Lights Expand** | [`cards/Lights/`](cards/Lights/) | `wesmart-lights-expand-card` | `wesmart-infinite-lights-expand-card` | `light.*` (expandable inline sliders) |
| **Media Player** | [`cards/MediaPlayer/`](cards/MediaPlayer/) | `wesmart-media-player-card` | `wesmart-infinite-media-player-card` | `media_player.*` |
| **Person** | [`cards/Person/`](cards/Person/) | `wesmart-person-card` | `wesmart-infinite-person-card` | `person.*` (presence & zones) |
| **Scene Interpolator** | [`cards/SceneInterpolator/`](cards/SceneInterpolator/) | `wesmart-scene-interpolator-card` | `wesmart-infinite-scene-interpolator-card` | `light.*` (2D 4-scene morphing) |
| **Sensors** | [`cards/Sensors/`](cards/Sensors/) | `wesmart-sensors-card` | `wesmart-infinite-sensors-card` | `sensor.*` (multi-sensor) |
| **Switches** | [`cards/Switches/`](cards/Switches/) | `wesmart-switches-card` | `wesmart-infinite-switches-card` | `switch.*` (multi-switch) |
| **Weather** | [`cards/Weather/`](cards/Weather/) | `wesmart-weather-card` | `wesmart-infinite-weather-card` | `weather.*` (forecast) |

---

## Installazione Rapida / Quick Installation

### 1. Copia i file JavaScript / Copy the JavaScript files
Crea una sottocartella ordinata `wesmart-cards` dentro `config/www/` del tuo Home Assistant e copia `WeSmart-Card/wesmart-card.js` (o le singole card da [`cards/`](cards/)):  
*Create a clean `wesmart-cards` subfolder inside `config/www/` in Home Assistant and copy `WeSmart-Card/wesmart-card.js` (or standalone cards from [`cards/`](cards/)):*

```text
config/www/wesmart-cards/wesmart-card.js
config/www/wesmart-cards/wesmart-climate-card.js
config/www/wesmart-cards/wesmart-garbage-card.js
...
```

### 2. Aggiungi le Risorse in Lovelace / Register Lovelace Resources
In Home Assistant vai su **Impostazioni → Dashboard → Risorse** (**Settings → Dashboards → Resources**) e aggiungi:
- **URL**: `/local/wesmart-cards/wesmart-card.js`
- **Tipo / Type**: `Modulo JavaScript` (`JavaScript Module`)

### 3. Ricarica la Dashboard / Hard Refresh
- `Cmd + Shift + R` (macOS)
- `Ctrl + Shift + R` (Windows / Linux)

---

## Anteprime Grafiche / Previews

![Garbage Card](asset/images/garbage.png)
![Lights Cards](asset/images/lights-cards.webp)
![Sensors Card](asset/images/sensor.webp)
![Climate Cards](asset/images/climate-e-compact-cards.webp)
![Chart Card](asset/images/graph.png)
![Weather Card](asset/images/meteo-card.png)
![Energy Flow Card](asset/images/energy-card.png)
![Media Player Card](asset/images/media-player-cards.png)

---

## Architettura / Architecture

- **Web Components**: `HTMLElement` + `customElements.define`.
- **Shadow DOM**: isolated CSS via `attachShadow({ mode: 'open' })`.
- **Zero Dependencies**: pure Vanilla JS, no external frameworks, no bundler.
- **Visual Editor Support**: native GUI configuration in `WeSmart-Card` (`static getConfigElement()`) + full YAML support.

Per la guida completa a ciascuna opzione di configurazione YAML, consulta [`WeSmart-Card/DOCUMENTATION.md`](WeSmart-Card/DOCUMENTATION.md) e [`doc/README.md`](doc/README.md).

---

*Created by [Massimo Di Vona](https://www.wearesmart.it) & powered by Artificial Intelligence.*
