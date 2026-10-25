# Progetto: WeSmart Custom Cards — Home Assistant

## Descrizione Generale
Questo progetto è la suite unificata e completa di **custom card Lovelace per Home Assistant**, fondata da **Massimo Di Vona** ([Wearesmart.it](https://www.wearesmart.it)). L'obiettivo è fornire un'interfaccia utente curata, moderna e reattiva ispirata all'estetica "WeSmart AI" (tipografia minimale, toni scuri antracite con accenti arancioni o personalizzabili).

La caratteristica tecnica cardine è che **non c'è alcun processo di build (nessun npm, Webpack o Vite) e nessuna dipendenza esterna**. È tutto scritto in puro **Vanilla JavaScript** utilizzando i Web Components standard.

## Architettura Tecnica
- **Web Components**: Ogni card è un singolo file JavaScript contenente una classe che estende `HTMLElement`.
- **Shadow DOM**: L'interfaccia e gli stili CSS di ogni card sono isolati tramite `attachShadow({ mode: 'open' })`.
- **Metodi Standard**: Le card implementano i metodi richiesti da Home Assistant come `setConfig(config)` per interpretare il file YAML, e il setter `set hass(hass)` per reagire in tempo reale agli aggiornamenti di stato (`hass.states`).
- **Motore Cromatico Dinamico (InfiniteColor)**: Integrato nativamente in tutte le card. Genera una palette armonica completa da un singolo colore hex (`color: '#D97757'`). Con il valore di default `#D97757`, le card riproducono esattamente l'estetica classica *WeSmart Original*.
- **Temi Supportati**: `dark`, `light` e `auto` (reattivo al tema del sistema/dispositivo tramite `prefers-color-scheme`).
- **Retrocompatibilità**: Ogni file JS registra sia il tag standard principale (`wesmart-*-card`) che l'alias (`wesmart-infinite-*-card` o vecchie varianti), garantendo che nessuna configurazione Lovelace preesistente venga interrotta.

## Struttura del Repository
- **`cards/`**: Unica directory contenente le 17 categorie di card (oltre 20 card totali):
  `Battery`, `Buttons`, `Chart`, `Climate`, `Clock`, `Doors`, `Energy`, `Garbage`, `History`, `Light`, `Lights`, `MediaPlayer`, `Person`, `SceneInterpolator`, `Sensors`, `Switches`, `Weather`.
- **`asset/`**: Risorse multimediali (immagini, screenshot, video dimostrativi).
- **`doc/`**: Documentazione tecnica dettagliata.
- **`README.md`**: Hub principale del repository.

## Stato dei Progetti Esterni & Labs
- **WeSmart-Labs**: Ufficialmente chiuso e archiviato.
- **WeSmart Garbage**: Uscito dalla fase di sperimentazione ed evoluto in soluzione consolidata, sia inclusa nella suite (`cards/Garbage/`) sia come repository autonomo ([wesmart-garbage-card](https://github.com/WeAreSmart-home/wesmart-garbage-card) + [wesmart-garbage](https://github.com/WeAreSmart-home/wesmart-garbage)).

## Linee Guida per lo Sviluppo
- Mantenere la natura "Vanilla JS" senza aggiungere dipendenze.
- Rispettare l'estetica e la formattazione CSS presente nelle card esistenti.
- Testare le modifiche aggiornando manualmente la cache (Hard Refresh) nel browser.
- Ogni card deve gestire il parsing YAML per i propri parametri e supportare opzionalmente `color` e `theme`.
