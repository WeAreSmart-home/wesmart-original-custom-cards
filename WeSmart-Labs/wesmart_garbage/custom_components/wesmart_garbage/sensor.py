from datetime import datetime
from homeassistant.components.sensor import SensorEntity
from homeassistant.helpers.dispatcher import async_dispatcher_connect
from .const import DOMAIN, DEFAULT_ICON

async def async_setup_platform(hass, config, async_add_entities, discovery_info=None):
    """Set up the garbage sensor."""
    async_add_entities([WeSmartGarbageSensor(hass)], True)

class WeSmartGarbageSensor(SensorEntity):
    """Sensor that shows today's collection with reactive properties."""

    def __init__(self, hass):
        self._hass = hass
        self._attr_name = "WeSmart Garbage Today"
        self._attr_unique_id = "wesmart_garbage_today"

    async def async_added_to_hass(self):
        """Register callbacks when added to hass."""
        SIGNAL_UPDATE_GARBAGE = f"{DOMAIN}_update"
        # Force a state write when the signal is received
        self.async_on_remove(
            async_dispatcher_connect(
                self.hass, SIGNAL_UPDATE_GARBAGE, self.async_write_ha_state
            )
        )

    @property
    def native_value(self):
        """Calculate state dynamically from memory."""
        today = str(datetime.now().isoweekday())
        schedule = self._hass.data[DOMAIN].get("schedule", {})
        if today in schedule and schedule[today]:
            items = schedule[today]
            return ", ".join([x["name"] for x in items])
        return "Nothing"

    @property
    def icon(self):
        """Calculate icon dynamically from the first scheduled item."""
        today = str(datetime.now().isoweekday())
        schedule = self._hass.data[DOMAIN].get("schedule", {})
        if today in schedule and schedule[today]:
            return schedule[today][0].get("icon", DEFAULT_ICON)
        return DEFAULT_ICON

    @property
    def extra_state_attributes(self):
        """Always return the latest schedule from memory."""
        return {"schedule": self._hass.data[DOMAIN].get("schedule", {})}

    async def async_update(self):
        """Update is handled by properties and signals. No manual polling needed."""
        pass
