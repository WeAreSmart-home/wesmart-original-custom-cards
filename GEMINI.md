# Progetto: WeSmart Custom Cards — Home Assistant

## Descrizione Generale
Questo progetto è una vasta collezione di **custom card Lovelace per Home Assistant**. L'obiettivo è fornire un'interfaccia utente curata, ispirata all'estetica "WeSmart AI" (tipografia minimale, toni scuri antracite con accenti colorati o arancioni). 

La caratteristica tecnica principale è che **non c'è alcun processo di build (nessun npm, Webpack o Vite) e nessuna dipendenza esterna**. È tutto scritto in puro **Vanilla JavaScript** utilizzando i Web Components standard.

## Architettura Tecnica
- **Web Components**: Ogni card è un singolo file JavaScript contenente una classe che estende `HTMLElement`.
- **Shadow DOM**: L'interfaccia e gli stili CSS di ogni card sono isolati tramite `attachShadow({ mode: 'open' })`.
- **Metodi Standard**: Le card implementano i metodi richiesti da Home Assistant come `setConfig(config)` per interpretare il file YAML, e il setter `set hass(hass)` per reagire in tempo reale agli aggiornamenti di stato (`hass.states`).
- **Installazione**: Basta copiare i file `.js` nella cartella `www` di Home Assistant e registrarli come moduli JavaScript.

## Collezioni Principali
Il repository è diviso in tre directory/collezioni distinte:

1. **WeSmart InfiniteColor** (`WeSmart-InfiniteColor/`):
   - **14 Card** pronte per la produzione.
   - Utilizza un motore cromatico dinamico che genera un'intera palette (background, testi, ombre, accenti) a partire da un **singolo colore esadecimale** fornito in configurazione.

2. **WeSmart Original** (`WeSmart-Original/`):
   - **20 Card** pronte per la produzione.
   - Utilizzano una palette di colori fissa e predefinita dai toni caldi (carbone e arancione).
   - Include card avanzate come `wesmart-chart-card` (grafici), `wesmart-energy-flow-card` (flussi di energia) e `wesmart-media-player-card`.

3. **WeSmart Labs** (`WeSmart-Labs/`):
   - **4 Card** sperimentali (non consigliate per l'uso in produzione).
   - Esplorano nuovi concetti di layout per dashboard di Home Assistant rompendo il classico formato "a schede" (es. interfacce "Surface" trasparenti e "Home Panel").

## Linee Guida per lo Sviluppo
- Mantenere la natura "Vanilla JS" senza aggiungere dipendenze.
- Rispettare l'estetica e la formattazione CSS presente nelle card esistenti.
- Testare le modifiche aggiornando manualmente la cache (Hard Refresh) nel browser.
- Ogni card deve gestire il parsing YAML per i propri parametri.
