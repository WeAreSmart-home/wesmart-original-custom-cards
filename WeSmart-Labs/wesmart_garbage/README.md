# WeSmart Garbage — Home Assistant Custom Integration

Questa è un'integrazione personalizzata per Home Assistant progettata per gestire il calendario della raccolta rifiuti con **persistenza reale**. A differenza delle semplici card, questa integrazione salva i dati nel database interno di HA, garantendo che le tue impostazioni sopravvivano ai riavvii.

## Caratteristiche
- **Persistenza Reale**: Utilizza il sistema `Store` di Home Assistant per salvare i dati in `/config/.storage/wesmart_garbage.json`.
- **Sensore Dinamico**: Crea un'entità `sensor.wesmart_garbage_today` che mostra automaticamente il ritiro del giorno corrente.
- **Servizio di Scrittura**: Espone un servizio per aggiornare il calendario direttamente da dashboard o automazioni.

## Installazione

1. Copia la cartella `wesmart_garbage` (quella contenente `manifest.json`) nella cartella `custom_components/` del tuo Home Assistant.
2. Aggiungi la seguente riga al tuo file `configuration.yaml`:
   ```yaml
   wesmart_garbage:
   ```
3. Riavvia Home Assistant.

## Utilizzo

### 1. Scrivere i dati (Persistenza)
L'integrazione non richiede sensori esterni. Puoi impostare tu il calendario chiamando il servizio `wesmart_garbage.update_schedule`.

**Esempio di chiamata servizio:**
```yaml
service: wesmart_garbage.update_schedule
data:
  day: 1               # 1=Lunedì, 7=Domenica
  waste_type: "Umido"
  icon: "mdi:leaf"
```

### 2. Leggere i dati (Sensore)
L'integrazione crea automaticamente:
- `sensor.wesmart_garbage_today`: Lo stato è il tipo di rifiuto di oggi (es. "Umido" o "Nothing").
- **Attributi**: Il sensore contiene l'intero schema salvato negli attributi, utile per card avanzate.

### 3. Esempio Card Lovelace
Puoi usare una card per mostrare il ritiro di oggi puntando al sensore:

```yaml
type: entity
entity: sensor.wesmart_garbage_today
name: Ritiro Oggi
```

Oppure usare uno script/pulsante per cambiare il calendario:
```yaml
type: button
name: Imposta Lunedì -> Carta
tap_action:
  action: call-service
  service: wesmart_garbage.update_schedule
  data:
    day: 1
    waste_type: "Carta"
    icon: "mdi:package-variant"
```

## Struttura Tecnica
- `__init__.py`: Gestisce il caricamento dei dati e la persistenza JSON.
- `sensor.py`: Calcola lo stato del sensore basandosi sul giorno della settimana (ISO 8601).
- `const.py`: Contiene le definizioni di dominio e versionamento storage.

---
Creato da **Massimo Di Vona** per l'ecosistema **WeSmart Labs**.
