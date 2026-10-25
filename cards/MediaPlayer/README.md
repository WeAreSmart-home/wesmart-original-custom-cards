# WeSmart Media Player Card

Card personalizzata per Home Assistant con album art, barra di avanzamento animata in tempo reale e controlli completi di riproduzione.

---

## Anteprima layout

```
┌─────────────────────────────────────────┐
│ 🎵 Living Room Speaker      ● Playing  │
├─────────────────────────────────────────┤
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │  ← album art sfumata come sfondo
│ ░  ┌──────┐  Dark Side of the Moon   ░ │
│ ░  │  🎵  │  Pink Floyd              ░ │
│ ░  │ art  │  The Dark Side...        ░ │
│ ░  └──────┘                          ░ │
├─────────────────────────────────────────┤
│  0:42  ━━━━━━━━●━━━━━━━━━━━━  5:01    │
│                                         │
│       ⇄    ⏮    ▶    ⏭    🔁         │
│                                         │
│  🔊  ━━━━━━━━━━●━━━━━  70%            │
└─────────────────────────────────────────┘
```

---

## Installazione

1. Copia `wesmart-media-player-card.js` in `config/www/`
2. In Home Assistant → **Impostazioni → Dashboard → Risorse**, aggiungi:

   | URL | Tipo |
   |-----|------|
   | `/local/wesmart-media-player-card.js` | JavaScript module |

3. Hard refresh: `Cmd+Shift+R` (macOS) / `Ctrl+Shift+R` (Windows/Linux)

---

## Configurazione

### Minima

```yaml
type: custom:wesmart-media-player-card
entity: media_player.living_room
```

### Completa

```yaml
type: custom:wesmart-media-player-card
entity: media_player.living_room
title: Living Room
icon: mdi:speaker
theme: dark
show_shuffle: true
show_repeat: true
show_volume: true
show_source: false
```

---

## Opzioni

| Opzione | Tipo | Default | Descrizione |
|---------|------|---------|-------------|
| `entity` | string | — | **Obbligatorio.** Entità `media_player.*` |
| `title` | string | nome entità | Titolo nell'header (se omesso usa `friendly_name`) |
| `icon` | string | `mdi:music-note` | Icona nell'header |
| `theme` | string | `'dark'` | `dark` \| `light` \| `auto` |
| `show_shuffle` | boolean | `true` | Mostra pulsante shuffle |
| `show_repeat` | boolean | `true` | Mostra pulsante repeat |
| `show_volume` | boolean | `true` | Mostra slider volume |
| `show_source` | boolean | `false` | Mostra selettore sorgente |

---

## Funzionalità

### Album Art
- L'immagine dell'album viene usata come **sfondo sfumato e blurred** nella sezione art
- La stessa immagine appare come **thumbnail** (80×80 px) con angoli arrotondati
- Se l'entità non ha album art: placeholder con icona musicale su sfondo gradient
- Transizione fluida al cambio brano

### Barra di avanzamento
- Si aggiorna **ogni secondo** in tempo reale anche senza aggiornamenti da HA
- Calcola la posizione corrente da `media_position` + `media_position_updated_at`
- **Click sulla barra** → seek alla posizione (se l'entità supporta `SEEK`)
- Mostra tempo corrente e durata totale

### Controlli riproduzione

| Pulsante | Azione | Visibile se |
|----------|--------|-------------|
| Shuffle | Attiva/disattiva shuffle | `supported_features` include SHUFFLE e `show_shuffle: true` |
| Previous | Traccia precedente | `supported_features` include PREVIOUS |
| Play/Pause | Play, Pausa, o accensione | Sempre |
| Next | Traccia successiva | `supported_features` include NEXT |
| Repeat | Cicla: off → all → one | `supported_features` include REPEAT e `show_repeat: true` |

I pulsanti non supportati dall'entità vengono mostrati in grigio e disabilitati.

### Play/Pause — comportamento smart

| Stato entità | Click sul pulsante | Azione |
|-------------|-------------------|--------|
| `off` / `standby` | Power icon | `media_player.turn_on` |
| `playing` | Pausa icon | `media_player.media_pause` (o `media_stop` se non supporta pausa) |
| `paused` / `idle` | Play icon | `media_player.media_play` |

### Volume
- Slider interattivo da 0 a 100%
- Il riempimento arancione segue il valore in tempo reale
- Click sull'icona volume → mute/unmute
- Icona muta diventa arancione quando attiva

### Selettore sorgente (opzionale)
Attivabile con `show_source: true`. Mostra un dropdown con tutte le sorgenti disponibili (`source_list`). Visibile solo se l'entità supporta `SELECT_SOURCE`.

---

## Stati della card

| Stato | Comportamento |
|-------|---------------|
| `playing` | Pill verde animato · Art sfondo+thumbnail · Barra avanza · Pulsante pausa arancione |
| `paused` | Pill arancione · Art sfondo+thumbnail · Barra ferma · Pulsante play outline |
| `buffering` | Come `playing` ma può mostrare caricamento |
| `idle` | Sezione art con "Nothing playing" · Controlli presenti |
| `off` | Sezione art con "Turned off" · Pulsante power |

---

## Repeat — stati

| Valore | Icona | Descrizione |
|--------|-------|-------------|
| `off` | `mdi:repeat-off` | Nessuna ripetizione |
| `all` | `mdi:repeat` | Ripete tutta la playlist |
| `one` | `mdi:repeat-once` | Ripete il brano corrente |

Click sul pulsante cicla nell'ordine: `off → all → one → off`.

---

## Temi

| Tema | Sfondo | Note |
|------|--------|------|
| `dark` | `#292524` carbone caldo | Default |
| `light` | `#FFFEFA` crema | Overlay art adattato |
| `auto` | — | Segue `prefers-color-scheme` |

---

## Esempi

### Speaker Soggiorno

```yaml
type: custom:wesmart-media-player-card
entity: media_player.sonos_living_room
title: Soggiorno
icon: mdi:speaker
theme: dark
```

### TV con sorgente

```yaml
type: custom:wesmart-media-player-card
entity: media_player.samsung_tv
title: TV Salotto
icon: mdi:television-play
theme: dark
show_shuffle: false
show_repeat: false
show_source: true
```

### Spotify (tema auto)

```yaml
type: custom:wesmart-media-player-card
entity: media_player.spotify
title: Spotify
icon: mdi:spotify
theme: auto
show_volume: true
show_shuffle: true
show_repeat: true
```

---

## Compatibilità

Funziona con qualsiasi entità `media_player.*` in Home Assistant.

Integrazioni testate: Sonos, Spotify, Apple TV, Samsung TV, Chromecast, Plex, VLC, MPD, Squeezebox, Kodi, Jellyfin.

I pulsanti si adattano automaticamente a `supported_features` — se una funzione non è supportata dall'integrazione, il pulsante viene disabilitato.

---

## Architettura

```
wesmart-media-player-card.js
  └─ class WeSmartMediaPlayerCard extends HTMLElement
      ├─ attachShadow({ mode: 'open' })       → styling isolato
      ├─ setConfig(config)                    → parsing YAML, build HTML
      ├─ set hass(hass)                       → aggiornamento stato reattivo
      ├─ connectedCallback / disconnectedCallback → gestione timer
      ├─ _startTimer / _stopTimer / _tickProgress → progress bar ogni 1s
      ├─ _render()                            → CSS + DOM iniziale
      ├─ _update()                            → aggiorna art, stato, controlli
      ├─ _renderProgress(s)                   → calcola e aggiorna barra
      └─ _bindEvents()                        → click handlers per tutti i controlli

customElements.define('wesmart-media-player-card', ...)
```

Nessun build step. Nessuna dipendenza. Vanilla JS puro.
