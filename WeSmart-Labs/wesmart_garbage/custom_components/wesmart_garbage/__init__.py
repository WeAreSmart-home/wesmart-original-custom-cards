import logging
from homeassistant.core import HomeAssistant
from homeassistant.helpers.typing import ConfigType
from homeassistant.helpers.storage import Store
from homeassistant.helpers import discovery
from homeassistant.helpers.dispatcher import async_dispatcher_send
from .const import DOMAIN, STORAGE_KEY, STORAGE_VERSION

_LOGGER = logging.getLogger(__name__)
SIGNAL_UPDATE_GARBAGE = f"{DOMAIN}_update"

async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    """Set up the WeSmart Garbage integration."""
    store = Store(hass, STORAGE_VERSION, STORAGE_KEY)
    
    # Load data from storage. Data is saved in /config/.storage/wesmart_garbage.storage
    data = await store.async_load() or {"schedule": {}}
    
    schedule = data.get("schedule", {})
    # Migrate old dict entries to lists if needed
    for day in schedule:
        if isinstance(schedule[day], dict):
            schedule[day] = [schedule[day]]
    
    hass.data[DOMAIN] = {
        "store": store,
        "schedule": schedule
    }

    async def update_schedule(call):
        """Update the garbage schedule with Toggle support."""
        day = str(call.data.get("day"))
        waste_name = call.data.get("waste_type")
        icon = call.data.get("icon")

        if not day or not waste_name:
            return

        if day not in hass.data[DOMAIN]["schedule"]:
            hass.data[DOMAIN]["schedule"][day] = []

        current_day_list = hass.data[DOMAIN]["schedule"][day]
        # Check if this waste type already exists for this day
        exists_idx = next((i for i, x in enumerate(current_day_list) if x["name"] == waste_name), -1)

        if exists_idx > -1:
            # Toggle OFF: Remove it
            current_day_list.pop(exists_idx)
        else:
            # Toggle ON: Add it
            current_day_list.append({
                "name": waste_name,
                "icon": icon
            })

        # Persist to disk
        await store.async_save({"schedule": hass.data[DOMAIN]["schedule"]})
        
        # Notify sensor to update immediately
        async_dispatcher_send(hass, SIGNAL_UPDATE_GARBAGE)

    hass.services.async_register(DOMAIN, "update_schedule", update_schedule)
    
    # Load sensor platform
    hass.async_create_task(
        discovery.async_load_platform(hass, "sensor", DOMAIN, {}, config)
    )

    return True
