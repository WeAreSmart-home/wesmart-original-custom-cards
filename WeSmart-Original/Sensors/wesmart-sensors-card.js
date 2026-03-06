/**
 * WeSmart Sensors Card - Home Assistant Custom Card
 * Multi-entity sensor card (temperature, humidity, pressure, CO2, etc.)
 * Supports dark / light / auto themes
 * Version: 1.0.0
 */

(() => {

const CARD_VERSION = '1.0.0';

// ─── Icon & color map by device_class ─────────────────────────────────────────

const SENSOR_DEFS = {
  temperature:  { icon: 'mdi:thermometer',            unit: '°C', color: '#E07B54' },
  humidity:     { icon: 'mdi:water-percent',           unit: '%',  color: '#60B4D8' },
  pressure:     { icon: 'mdi:gauge',                   unit: 'hPa',color: '#A09080' },
  co2:          { icon: 'mdi:molecule-co2',            unit: 'ppm',color: '#8FBC8F' },
  pm25:         { icon: 'mdi:air-filter',              unit: 'µg/m³', color: '#8FBC8F' },
  pm10:         { icon: 'mdi:air-filter',              unit: 'µg/m³', color: '#8FBC8F' },
  illuminance:  { icon: 'mdi:brightness-5',            unit: 'lx', color: '#F0C060' },
  battery:      { icon: 'mdi:battery',                 unit: '%',  color: '#7EC8A0' },
  voltage:      { icon: 'mdi:lightning-bolt',          unit: 'V',  color: '#D4A84B' },
  current:      { icon: 'mdi:current-ac',              unit: 'A',  color: '#D4A84B' },
  power:        { icon: 'mdi:flash',                   unit: 'W',  color: '#D4A84B' },
  energy:       { icon: 'mdi:counter',                 unit: 'kWh',color: '#D4A84B' },
  gas:          { icon: 'mdi:meter-gas',               unit: 'm³', color: '#D97757' },
  water:        { icon: 'mdi:water',                   unit: 'L',  color: '#60B4D8' },
  signal_strength: { icon: 'mdi:wifi',                 unit: 'dBm',color: '#A09080' },
  moisture:     { icon: 'mdi:water-percent',           unit: '%',  color: '#60B4D8' },
  aqi:          { icon: 'mdi:air-filter',              unit: '',   color: '#8FBC8F' },
  speed:        { icon: 'mdi:speedometer',             unit: 'm/s',color: '#A09080' },
  wind_speed:   { icon: 'mdi:weather-windy',           unit: 'km/h',color: '#A09080' },
  _default:     { icon: 'mdi:chart-line',              unit: '',   color: '#A09080' },
};

function getSensorDef(deviceClass) {
  return SENSOR_DEFS[deviceClass] || SENSOR_DEFS._default;
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = `
  :host {
    --claude-orange: #D97757;
    --claude-orange-glow: rgba(217, 119, 87, 0.25);
    --claude-orange-soft: rgba(217, 119, 87, 0.12);
    --claude-radius: 20px;
    --claude-radius-sm: 12px;
    --claude-radius-xs: 8px;
    --transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    display: block;
    font-family: -apple-system, 'Söhne', 'Inter', BlinkMacSystemFont, sans-serif;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  /* ── Dark theme (default) ── */
  .card {
    --bg:            #292524;
    --surface:       #332E2A;
    --border:        rgba(255, 255, 255, 0.08);
    --text:          #F5F0EB;
    --text-muted:    #A09080;
    --text-dim:      #6B5F56;
    --row-hover-bg:  rgba(255, 255, 255, 0.03);
    --shadow:        0 8px 32px rgba(0, 0, 0, 0.4);

    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: var(--claude-radius);
    padding: 18px 18px 16px;
    position: relative;
    overflow: hidden;
    box-shadow: var(--shadow);
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
  }

  /* ── Light theme ── */
  .card.theme-light {
    --bg:            #FFFEFA;
    --surface:       #F5F0EB;
    --border:        rgba(28, 25, 23, 0.09);
    --text:          #1C1917;
    --text-muted:    #6B5F56;
    --text-dim:      #A09080;
    --row-hover-bg:  rgba(28, 25, 23, 0.03);
    --shadow:        0 2px 16px rgba(0, 0, 0, 0.07), 0 0 0 1px rgba(0, 0, 0, 0.04);
  }

  /* ── Auto theme ── */
  @media (prefers-color-scheme: light) {
    .card.theme-auto {
      --bg:            #FFFEFA;
      --surface:       #F5F0EB;
      --border:        rgba(28, 25, 23, 0.09);
      --text:          #1C1917;
      --text-muted:    #6B5F56;
      --text-dim:      #A09080;
      --row-hover-bg:  rgba(28, 25, 23, 0.03);
      --shadow:        0 2px 16px rgba(0, 0, 0, 0.07), 0 0 0 1px rgba(0, 0, 0, 0.04);
    }
  }

  /* ── Header ── */
  .header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 14px;
  }

  .header-icon-wrap {
    width: 40px;
    height: 40px;
    border-radius: var(--claude-radius-sm);
    background: var(--surface);
    border: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .header-icon-wrap ha-icon {
    --mdc-icon-size: 20px;
    color: var(--claude-orange);
  }

  .header-titles { flex: 1; min-width: 0; }

  .header-title {
    font-size: 15px;
    font-weight: 600;
    color: var(--text);
    letter-spacing: -0.01em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .header-subtitle {
    font-size: 12px;
    color: var(--text-muted);
    margin-top: 2px;
  }

  /* ── Separator ── */
  .separator {
    height: 1px;
    background: var(--border);
    margin: 0 0 10px;
  }

  /* ── Sensor list ── */
  .sensors-list {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .sensor-row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 9px 8px 9px 6px;
    border-radius: var(--claude-radius-xs);
    transition: background 0.2s ease;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }

  .sensor-row:hover { background: var(--row-hover-bg); }

  .sensor-row.unavailable {
    opacity: 0.38;
    pointer-events: none;
  }

  /* row icon */
  .row-icon {
    width: 34px;
    height: 34px;
    border-radius: 10px;
    background: var(--surface);
    border: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: var(--transition);
  }

  .row-icon ha-icon {
    --mdc-icon-size: 17px;
    color: var(--text-dim);
    transition: color 0.25s ease;
  }

  /* row info */
  .row-info {
    flex: 1;
    min-width: 0;
  }

  .row-name {
    font-size: 13px;
    font-weight: 500;
    color: var(--text);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .row-meta {
    font-size: 11px;
    color: var(--text-dim);
    margin-top: 1px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* value badge */
  .row-value {
    font-size: 16px;
    font-weight: 600;
    color: var(--text);
    letter-spacing: -0.02em;
    white-space: nowrap;
    flex-shrink: 0;
    text-align: right;
    min-width: 56px;
    transition: color 0.25s ease;
  }

  .row-value .unit {
    font-size: 11px;
    font-weight: 400;
    color: var(--text-muted);
    margin-left: 2px;
  }

  /* alert accent when value out of range */
  .sensor-row.alert .row-icon {
    background: rgba(217, 119, 87, 0.10);
    border-color: rgba(217, 119, 87, 0.25);
  }

  .sensor-row.alert .row-icon ha-icon { color: var(--claude-orange); }
  .sensor-row.alert .row-value { color: var(--claude-orange); }

  /* ── Footer ── */
  .footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid var(--border);
  }

  .footer-info {
    font-size: 11px;
    color: var(--text-dim);
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .brand-mark {
    display: flex;
    align-items: center;
    gap: 5px;
    opacity: 0.4;
  }

  .brand-mark svg { width: 14px; height: 14px; }

  .brand-mark span {
    font-size: 10px;
    color: var(--text-dim);
    letter-spacing: 0.05em;
  }
`;

// ─── Custom Element ────────────────────────────────────────────────────────────

class WeSmartSensorsCard extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._config   = {};
    this._hass     = null;
    this._entities = [];
  }

  // ── HA lifecycle ─────────────────────────────────────────────────────────────

  static getConfigElement() {
    return document.createElement('wesmart-sensors-card-editor');
  }

  static getStubConfig() {
    return {
      title:    'Sensors',
      entities: ['sensor.temperature_indoor', 'sensor.humidity_indoor'],
    };
  }

  setConfig(config) {
    if (!config.entities?.length) throw new Error('entities array is required');
    this._config = {
      title:  'Sensors',
      icon:   'mdi:chart-line',
      theme:  'dark',   // dark | light | auto
      ...config,
    };
    this._entities = this._config.entities.map(e =>
      typeof e === 'string' ? { entity: e } : e
    );
    this._render();
  }

  set hass(hass) {
    this._hass = hass;
    this._updateState();
  }

  getCardSize() {
    return 1 + Math.ceil((this._entities.length * 52 + 80) / 50);
  }

  // ── Render ───────────────────────────────────────────────────────────────────

  _render() {
    const shadow = this.shadowRoot;
    shadow.innerHTML = '';

    const style = document.createElement('style');
    style.textContent = styles;
    shadow.appendChild(style);

    this._card = document.createElement('div');
    this._card.className = `card theme-${this._config.theme}`;
    this._card.innerHTML = this._getHTML();
    shadow.appendChild(this._card);

    this._bindEvents();
    this._updateState();
  }

  _getHTML() {
    const cfg = this._config;

    const rowsHTML = this._entities.map((e, i) => `
      <div class="sensor-row" data-index="${i}" id="row-${i}">
        <div class="row-icon" id="icon-wrap-${i}">
          <ha-icon id="icon-${i}" icon="mdi:chart-line"></ha-icon>
        </div>
        <div class="row-info">
          <div class="row-name" id="name-${i}">${e.name || e.entity}</div>
          <div class="row-meta" id="meta-${i}">—</div>
        </div>
        <div class="row-value" id="value-${i}">—</div>
      </div>
    `).join('');

    return `
      <!-- Header -->
      <div class="header">
        <div class="header-icon-wrap">
          <ha-icon icon="${cfg.icon}"></ha-icon>
        </div>
        <div class="header-titles">
          <div class="header-title">${cfg.title}</div>
          <div class="header-subtitle" id="header-subtitle">${this._entities.length} sensor${this._entities.length !== 1 ? 's' : ''}</div>
        </div>
      </div>

      <div class="separator"></div>

      <!-- Sensors list -->
      <div class="sensors-list" id="sensors-list">
        ${rowsHTML}
      </div>

      <!-- Footer -->
      <div class="footer">
        <div class="footer-info">
          <ha-icon icon="mdi:chart-line" style="--mdc-icon-size:13px"></ha-icon>
          <span id="footer-count">${this._entities.length} sensor${this._entities.length !== 1 ? 's' : ''}</span>
        </div>
        <div class="brand-mark">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="#D97757"/>
            <circle cx="12" cy="12" r="4" fill="#D97757" opacity="0.6"/>
          </svg>
          <span>WeSmart</span>
        </div>
      </div>
    `;
  }

  // ── State update ─────────────────────────────────────────────────────────────

  _updateState() {
    if (!this._hass || !this._card) return;

    let alertCount = 0;

    this._entities.forEach((cfg, i) => {
      const stateObj = this._hass.states[cfg.entity];
      const row      = this._q(`#row-${i}`);
      if (!row) return;

      if (!stateObj) {
        this._q(`#name-${i}`)  && (this._q(`#name-${i}`).textContent  = cfg.name || cfg.entity);
        this._q(`#meta-${i}`)  && (this._q(`#meta-${i}`).textContent  = 'Entity not found');
        this._q(`#value-${i}`) && (this._q(`#value-${i}`).innerHTML   = '—');
        return;
      }

      const attrs      = stateObj.attributes || {};
      const isUnavail  = stateObj.state === 'unavailable' || stateObj.state === 'unknown';
      const deviceClass = cfg.device_class || attrs.device_class || '';
      const def        = getSensorDef(deviceClass);

      // name
      const name = cfg.name
        || attrs.friendly_name
        || cfg.entity.split('.')[1]?.replace(/_/g, ' ')
        || cfg.entity;

      // icon & color
      const icon  = cfg.icon  || attrs.icon  || def.icon;
      const color = cfg.color || def.color;

      // unit
      const unit = cfg.unit !== undefined
        ? cfg.unit
        : (attrs.unit_of_measurement || def.unit || '');

      // formatted value
      let rawVal = stateObj.state;
      let displayVal = '—';
      let displayUnit = unit;

      if (!isUnavail && rawVal !== null && rawVal !== undefined) {
        const num = parseFloat(rawVal);
        if (!isNaN(num)) {
          // round decimals: 1 decimal for temp/hum, 0 for others unless small
          const decimals = ['temperature','humidity','moisture'].includes(deviceClass) ? 1
                         : num < 10 ? 2 : 0;
          displayVal = num.toFixed(decimals);
        } else {
          displayVal = rawVal;
          displayUnit = '';
        }
      }

      // alert logic (optional thresholds per entity)
      const isAlert = this._checkAlert(cfg, deviceClass, rawVal);
      if (isAlert) alertCount++;

      // meta text: device class label or custom
      const metaText = cfg.meta
        || (deviceClass ? deviceClass.charAt(0).toUpperCase() + deviceClass.slice(1) : 'Sensor');

      // update DOM
      row.classList.toggle('unavailable', isUnavail);
      row.classList.toggle('alert', isAlert && !isUnavail);

      const iconEl = this._q(`#icon-${i}`);
      if (iconEl) {
        iconEl.setAttribute('icon', icon);
        iconEl.style.color = isAlert ? '' : color;
      }

      const nameEl = this._q(`#name-${i}`);
      if (nameEl) nameEl.textContent = name;

      const metaEl = this._q(`#meta-${i}`);
      if (metaEl) metaEl.textContent = isUnavail ? 'Unavailable' : metaText;

      const valueEl = this._q(`#value-${i}`);
      if (valueEl) {
        if (isUnavail) {
          valueEl.innerHTML = '<span style="font-size:11px;color:var(--text-dim)">N/A</span>';
        } else {
          valueEl.innerHTML = displayVal + (displayUnit ? `<span class="unit">${displayUnit}</span>` : '');
          valueEl.style.color = isAlert ? '' : color;
        }
      }
    });

    // header subtitle
    const subtitle = this._q('#header-subtitle');
    if (subtitle) {
      subtitle.textContent = alertCount > 0
        ? `${alertCount} alert${alertCount !== 1 ? 's' : ''}`
        : `${this._entities.length} sensor${this._entities.length !== 1 ? 's' : ''}`;
    }
  }

  // Check if a value triggers an optional threshold alert
  _checkAlert(cfg, deviceClass, rawVal) {
    const num = parseFloat(rawVal);
    if (isNaN(num)) return false;

    // user-defined thresholds per entity
    if (cfg.alert_above !== undefined && num > cfg.alert_above) return true;
    if (cfg.alert_below !== undefined && num < cfg.alert_below) return true;

    // built-in defaults
    if (deviceClass === 'temperature' && (num > 30 || num < 10)) return true;
    if (deviceClass === 'humidity'    && (num > 70 || num < 30)) return true;
    if (deviceClass === 'co2'         && num > 1000)             return true;
    if (deviceClass === 'battery'     && num < 20)               return true;

    return false;
  }

  // ── Events ───────────────────────────────────────────────────────────────────

  _bindEvents() {
    this._q('#sensors-list')?.addEventListener('click', (e) => {
      const row = e.target.closest('.sensor-row');
      if (!row) return;
      const idx = parseInt(row.dataset.index, 10);
      if (isNaN(idx)) return;
      const entityId = this._entities[idx]?.entity;
      if (!entityId) return;
      const event = new Event('hass-more-info', { bubbles: true, composed: true });
      event.detail = { entityId };
      this.dispatchEvent(event);
    });
  }

  // ── Helpers ──────────────────────────────────────────────────────────────────

  _q(selector) {
    return this._card?.querySelector(selector) ?? null;
  }
}

// ─── Config Editor (stub) ─────────────────────────────────────────────────────

class WeSmartSensorsCardEditor extends HTMLElement {
  setConfig(config) { this._config = config; }
  set hass(hass)    { this._hass   = hass; }
}

// ─── Register ─────────────────────────────────────────────────────────────────

customElements.define('wesmart-sensors-card',        WeSmartSensorsCard);
customElements.define('wesmart-sensors-card-editor', WeSmartSensorsCardEditor);

window.customCards = window.customCards || [];
window.customCards.push({
  type:        'wesmart-sensors-card',
  name:        'Claude Sensors Card',
  description: 'Multi-entity sensor card (temperature, humidity, CO2, etc.) with alert thresholds. Supports dark and light themes.',
  preview:     true,
  documentationURL: 'https://github.com/your-repo/claude-sensors-card',
});

console.info(
  `%c CLAUDE SENSORS CARD %c v${CARD_VERSION} `,
  'background:#D97757;color:#fff;font-weight:700;padding:2px 6px;border-radius:4px 0 0 4px',
  'background:#1C1917;color:#D97757;font-weight:600;padding:2px 6px;border-radius:0 4px 4px 0'
);

})();
