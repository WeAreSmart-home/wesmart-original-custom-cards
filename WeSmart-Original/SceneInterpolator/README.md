# WeSmart Scene Interpolator Card

> **Early Development — v1.0.2**
> Questa card è in fase iniziale di sviluppo. Le API YAML, i comportamenti e il design possono cambiare in modo significativo tra versioni. Non è garantita la retrocompatibilità. Usala in ambienti di test o come ispirazione — non in produzione.

---

Una card innovativa per Home Assistant che permette un morphing fluido tra 4 "scene" (stati di luminosità e temperatura colore) tramite un pad XY interattivo.

## Concept

Questa card implementa l'idea "Scene Interpolator": anziché selezionare una scena statica, puoi trascinare un cursore su un pad 2D per mixare dinamicamente le impostazioni di 4 diverse atmosfere luminose.

- **Asse X / Asse Y:** Bilinear interpolation di `brightness` e `color_temp`.
- **Transizioni fluide:** Crea infinite variazioni a partire da 4 scene base.
- **Supporto gruppi:** Rilevamento automatico delle capabilities per gruppi con luci miste.

## Installazione

1. Copia il file `wesmart-scene-interpolator-card.js` nella tua cartella `www` di Home Assistant.
2. Aggiungi la risorsa in Home Assistant (Impostazioni > Plance > Risorse):
   - URL: `/local/wesmart-scene-interpolator-card.js`
   - Tipo: JavaScript Module

## Configurazione YAML

Ecco un esempio di configurazione base:

```yaml
type: custom:wesmart-scene-interpolator-card
entity: light.gruppo_salotto
name: "Atmosfera Salotto"
corners:
  top_left:
    name: "Mattina"
    icon: mdi:weather-sunny
    brightness: 80
    color_temp: 200
  top_right:
    name: "Pomeriggio"
    icon: mdi:weather-partly-cloudy
    brightness: 60
    color_temp: 300
  bottom_left:
    name: "Sera"
    icon: mdi:weather-sunset
    brightness: 40
    color_temp: 400
  bottom_right:
    name: "Notte"
    icon: mdi:weather-night
    brightness: 10
    color_temp: 500
```

### Parametri

| Parametro | Tipo | Descrizione |
|-----------|------|-------------|
| `type` | string | Obbligatorio. `custom:wesmart-scene-interpolator-card` |
| `entity` | string | Obbligatorio. L'entità `light` da controllare. |
| `name` | string | Opzionale. Nome visualizzato nella card. |
| `corners` | object | Opzionale. Personalizza le 4 scene agli angoli (vedi esempio sopra). |
| `color_temp` | boolean | Opzionale. Imposta `false` per disabilitare completamente la temperatura colore. |

Ogni oggetto all'interno di `corners` (`top_left`, `top_right`, `bottom_left`, `bottom_right`) accetta:
- `name` (string): Etichetta mostrata nell'angolo.
- `icon` (string): Icona (es. `mdi:home`).
- `brightness` (number): Da 0 a 100 (%).
- `color_temp` (number): Temperatura colore in mireds.

## Design

Il design segue l'estetica WeSmart, con gradienti ambientali lievi e componenti reattivi al tocco. L'interpolazione avviene in tempo reale mentre trascini il cursore, per un feedback visivo immediato e appagante sulle tue luci.

## Risoluzione dei Problemi

### Errore: `Failed to perform the action light/turn_on. extra keys not allowed @ data['color_temp']`

Questo errore significa che l'entità luce (o gruppo) **non supporta** la temperatura colore, oppure che nel gruppo ci sono luci con capabilities miste.

La card v1.0.2 include tre livelli di protezione:
1. **Controllo preventivo** su `supported_color_modes` e presenza di `min_mireds` prima di inviare `color_temp`.
2. **Blocco per gruppi misti**: se `supported_color_modes` include modalità incompatibili (`hs`, `rgb`, `rgbw`, ecc.), `color_temp` non viene inviato.
3. **Clamping automatico**: il valore `color_temp` viene limitato al range `min_mireds`/`max_mireds` dell'entità.

Se l'errore persiste, aggiungi `color_temp: false` nella configurazione YAML per disabilitarlo esplicitamente:

```yaml
type: custom:wesmart-scene-interpolator-card
entity: light.gruppo_salotto
color_temp: false   # disabilita color_temp per gruppi con luci miste
```

Inoltre:
- Svuota la cache del browser dopo aver aggiornato il file `.js`.
- Verifica che il file copiato in `www/` sia la versione più recente.

---

## Changelog

### v1.0.2
- `_supportsColorTemp()` ora richiede `min_mireds` presente nell'entità (assente su luci/gruppi che non supportano realmente la temperatura colore).
- Blocco aggiuntivo per gruppi con `supported_color_modes` misti (`hs`, `rgb`, `rgbw`, `rgbww`, `xy`).
- Clamping del valore `color_temp` al range `[min_mireds, max_mireds]` dell'entità per evitare errori di validazione HA.

### v1.0.1
- Fallback automatico: se HA restituisce errore su `color_temp`, la card ritenta con solo `brightness`.
- Controllo preventivo su `supported_color_modes` prima di inviare `color_temp`.

### v1.0.0
- Rilascio iniziale: XY pad con interpolazione bilineare tra 4 scene.
