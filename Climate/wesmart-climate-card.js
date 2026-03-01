/**
 * WeSmart Climate Card - Home Assistant Custom Card
 * Styled after Anthropic Claude AI aesthetic
 * Version: 1.0.0
 */

const CARD_VERSION = '1.0.0';

// ─── HVAC mode definitions ─────────────────────────────────────────────────────

const HVAC_MODE_CONFIG = {
  off:       { icon: 'mdi:power-off',           label: 'Off'   },
  heat:      { icon: 'mdi:fire',                label: 'Heat'  },
  cool:      { icon: 'mdi:snowflake',           label: 'Cool'  },
  heat_cool: { icon: 'mdi:sun-snowflake',       label: 'Range' },
  auto:      { icon: 'mdi:thermostat-auto',     label: 'Auto'  },
  dry:       { icon: 'mdi:water-off-outline',   label: 'Dry'   },
  fan_only:  { icon: 'mdi:fan',                 label: 'Fan'   },
};

const ACTION_ICON = {
  heating: 'mdi:fire',
  cooling: 'mdi:snowflake',
  drying:  'mdi:water-percent',
  fan:     'mdi:fan',
  idle:    'mdi:thermostat',
  off:     'mdi:thermostat',
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = `
  :host {
    --claude-orange: #D97757;
    --claude-orange-glow: rgba(217, 119, 87, 0.25);
    --claude-orange-soft: rgba(217, 119, 87, 0.15);
    --claude-blue: #60B4D8;
    --claude-blue-glow: rgba(96, 180, 216, 0.25);
    --claude-blue-soft: rgba(96, 180, 216, 0.12);
    --claude-radius: 20px;
    --claude-radius-sm: 12px;
    --claude-radius-xs: 8px;
    --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    display: block;
    font-family: -apple-system, 'Söhne', 'Inter', BlinkMacSystemFont, sans-serif;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  /* ── Themes ── */
  .card {
    --claude-surface: #292524;
    --claude-surface-2: #332E2A;
    --claude-border: rgba(255, 255, 255, 0.08);
    --claude-text: #F5F0EB;
    --claude-text-muted: #A09080;
    --claude-text-dim: #6B5F56;
    --overlay-bg: rgba(28, 25, 23, 0.7);

    background: var(--claude-surface);
    border: 1px solid var(--claude-border);
    border-radius: var(--claude-radius);
    padding: 20px;
    position: relative;
    overflow: hidden;
    transition: var(--transition);
  }

  .card.theme-light {
    --claude-surface: #FFFEFA;
    --claude-surface-2: #F5F0EB;
    --claude-border: rgba(28, 25, 23, 0.09);
    --claude-text: #1C1917;
    --claude-text-muted: #6B5F56;
    --claude-text-dim: #A09080;
    --overlay-bg: rgba(245, 240, 235, 0.8);
  }

  @media (prefers-color-scheme: light) {
    .card.theme-auto {
      --claude-surface: #FFFEFA;
      --claude-surface-2: #F5F0EB;
      --claude-border: rgba(28, 25, 23, 0.09);
      --claude-text: #1C1917;
      --claude-text-muted: #6B5F56;
      --claude-text-dim: #A09080;
      --overlay-bg: rgba(245, 240, 235, 0.8);
    }
  }

  /* ── Radial glow overlay ── */
  .card::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse 60% 50% at 50% -10%, transparent, transparent);
    opacity: 0;
    transition: opacity 0.5s ease;
    pointer-events: none;
  }

  .card.climate-heating::before {
    background: radial-gradient(ellipse 60% 50% at 50% -10%, var(--claude-orange-soft), transparent);
    opacity: 1;
  }

  .card.climate-cooling::before {
    background: radial-gradient(ellipse 60% 50% at 50% -10%, var(--claude-blue-soft), transparent);
    opacity: 1;
  }

  /* ── Glow animations ── */
  @keyframes pulse-heat {
    0%, 100% { box-shadow: 0 0 0 1px rgba(217,119,87,0.1), 0 8px 32px rgba(0,0,0,0.4), 0 0 60px rgba(217,119,87,0.25); }
    50%       { box-shadow: 0 0 0 1px rgba(217,119,87,0.2), 0 8px 32px rgba(0,0,0,0.4), 0 0 80px rgba(217,119,87,0.35); }
  }

  @keyframes pulse-cool {
    0%, 100% { box-shadow: 0 0 0 1px rgba(96,180,216,0.1), 0 8px 32px rgba(0,0,0,0.4), 0 0 60px rgba(96,180,216,0.2); }
    50%       { box-shadow: 0 0 0 1px rgba(96,180,216,0.2), 0 8px 32px rgba(0,0,0,0.4), 0 0 80px rgba(96,180,216,0.3); }
  }

  .card.climate-heating {
    border-color: rgba(217,119,87,0.2);
    animation: pulse-heat 3s ease-in-out infinite;
  }

  .card.climate-cooling {
    border-color: rgba(96,180,216,0.2);
    animation: pulse-cool 3s ease-in-out infinite;
  }

  /* ── Header ── */
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 18px;
    position: relative;
    z-index: 1;
  }

  .entity-info {
    display: flex;
    align-items: center;
    gap: 12px;
    flex: 1;
    min-width: 0;
  }

  .icon-wrapper {
    width: 44px;
    height: 44px;
    border-radius: var(--claude-radius-sm);
    background: var(--claude-surface-2);
    border: 1px solid var(--claude-border);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: var(--transition);
    position: relative;
    overflow: hidden;
  }

  .icon-wrapper::after {
    content: '';
    position: absolute;
    inset: 0;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .card.climate-heating .icon-wrapper {
    border-color: rgba(217,119,87,0.3);
    background: rgba(217,119,87,0.1);
  }
  .card.climate-heating .icon-wrapper::after {
    background: var(--claude-orange-soft);
    opacity: 1;
  }

  .card.climate-cooling .icon-wrapper {
    border-color: rgba(96,180,216,0.3);
    background: rgba(96,180,216,0.1);
  }
  .card.climate-cooling .icon-wrapper::after {
    background: var(--claude-blue-soft);
    opacity: 1;
  }

  .icon-wrapper ha-icon {
    color: var(--claude-text-muted);
    transition: var(--transition);
    position: relative;
    z-index: 1;
    --mdc-icon-size: 22px;
  }

  .card.climate-heating .icon-wrapper ha-icon { color: var(--claude-orange); }
  .card.climate-cooling .icon-wrapper ha-icon { color: var(--claude-blue); }

  .entity-details { flex: 1; min-width: 0; }

  .entity-name {
    font-size: 15px;
    font-weight: 600;
    color: var(--claude-text);
    letter-spacing: -0.01em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .entity-state {
    font-size: 12px;
    color: var(--claude-text-muted);
    margin-top: 2px;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .state-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--claude-text-dim);
    transition: var(--transition);
    flex-shrink: 0;
  }

  .card.climate-heating .state-dot {
    background: var(--claude-orange);
    box-shadow: 0 0 8px var(--claude-orange);
  }
  .card.climate-cooling .state-dot {
    background: var(--claude-blue);
    box-shadow: 0 0 8px var(--claude-blue);
  }

  /* ── Toggle ── */
  .toggle-switch {
    position: relative;
    width: 48px;
    height: 26px;
    flex-shrink: 0;
    cursor: pointer;
  }

  .toggle-switch input { opacity: 0; width: 0; height: 0; position: absolute; }

  .toggle-track {
    position: absolute;
    inset: 0;
    background: var(--claude-surface-2);
    border: 1px solid var(--claude-border);
    border-radius: 13px;
    transition: var(--transition);
  }

  .toggle-thumb {
    position: absolute;
    top: 3px;
    left: 3px;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: var(--claude-text-dim);
    transition: var(--transition);
    box-shadow: 0 1px 4px rgba(0,0,0,0.4);
  }

  .toggle-switch.active .toggle-track {
    background: rgba(217,119,87,0.2);
    border-color: rgba(217,119,87,0.4);
  }

  .toggle-switch.active .toggle-thumb {
    left: 23px;
    background: var(--claude-orange);
    box-shadow: 0 0 10px rgba(217,119,87,0.6);
  }

  /* ── Temperature display ── */
  .temp-display {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 8px 0 22px;
    position: relative;
    z-index: 1;
  }

  .temp-current-label {
    font-size: 10px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--claude-text-dim);
    margin-bottom: 4px;
  }

  .temp-current {
    font-size: 62px;
    font-weight: 200;
    color: var(--claude-text);
    letter-spacing: -0.04em;
    line-height: 1;
    font-variant-numeric: tabular-nums;
  }

  .temp-humidity {
    font-size: 12px;
    color: var(--claude-text-dim);
    margin-top: 6px;
    display: flex;
    align-items: center;
    gap: 3px;
  }

  .temp-humidity ha-icon { --mdc-icon-size: 13px; }

  .temp-target-row {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-top: 18px;
    transition: opacity 0.3s ease;
  }

  .temp-btn {
    width: 38px;
    height: 38px;
    border-radius: var(--claude-radius-xs);
    background: var(--claude-surface-2);
    border: 1px solid var(--claude-border);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: var(--claude-text-muted);
    transition: var(--transition);
  }

  .temp-btn:hover {
    background: rgba(217,119,87,0.1);
    border-color: rgba(217,119,87,0.3);
    color: var(--claude-orange);
  }

  .temp-btn:active { transform: scale(0.92); }

  .temp-btn ha-icon { --mdc-icon-size: 18px; }

  .temp-target-wrapper { text-align: center; min-width: 80px; }

  .temp-target {
    font-size: 28px;
    font-weight: 600;
    color: var(--claude-orange);
    letter-spacing: -0.02em;
    font-variant-numeric: tabular-nums;
    transition: color 0.3s ease;
  }

  .card.climate-cooling .temp-target { color: var(--claude-blue); }

  .temp-target-label {
    font-size: 10px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--claude-text-dim);
    margin-top: 3px;
  }

  /* ── Controls ── */
  .controls {
    display: flex;
    flex-direction: column;
    gap: 14px;
    position: relative;
    z-index: 1;
  }

  .control-section {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .section-label {
    font-size: 11px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--claude-text-dim);
  }

  /* ── Mode pills ── */
  .mode-row {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
  }

  .mode-pill {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 5px 11px 5px 8px;
    border-radius: 20px;
    background: var(--claude-surface-2);
    border: 1px solid var(--claude-border);
    font-size: 11px;
    font-weight: 500;
    color: var(--claude-text-muted);
    cursor: pointer;
    transition: var(--transition);
    white-space: nowrap;
    user-select: none;
  }

  .mode-pill ha-icon { --mdc-icon-size: 13px; }

  .mode-pill:hover {
    border-color: rgba(217,119,87,0.3);
    color: var(--claude-text);
  }

  .mode-pill.active {
    background: rgba(217,119,87,0.12);
    border-color: rgba(217,119,87,0.35);
    color: var(--claude-orange);
  }

  .mode-pill.active[data-mode="cool"] {
    background: rgba(96,180,216,0.12);
    border-color: rgba(96,180,216,0.35);
    color: var(--claude-blue);
  }

  .mode-pill.active[data-mode="off"] {
    background: rgba(107,95,86,0.12);
    border-color: rgba(107,95,86,0.25);
    color: var(--claude-text-muted);
  }

  /* ── Fan pills ── */
  .fan-pill {
    padding: 4px 11px;
    border-radius: 20px;
    background: var(--claude-surface-2);
    border: 1px solid var(--claude-border);
    font-size: 11px;
    font-weight: 500;
    color: var(--claude-text-muted);
    cursor: pointer;
    transition: var(--transition);
    white-space: nowrap;
    user-select: none;
  }

  .fan-pill:hover { border-color: rgba(217,119,87,0.3); color: var(--claude-text); }

  .fan-pill.active {
    background: rgba(217,119,87,0.08);
    border-color: rgba(217,119,87,0.3);
    color: var(--claude-orange);
  }

  /* ── Footer ── */
  .footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 16px;
    padding-top: 14px;
    border-top: 1px solid var(--claude-border);
    position: relative;
    z-index: 1;
  }

  .footer-info {
    font-size: 11px;
    color: var(--claude-text-dim);
    display: flex;
    align-items: center;
    gap: 4px;
  }

  /* ── Unavailable overlay ── */
  .unavailable-overlay {
    position: absolute;
    inset: 0;
    background: var(--overlay-bg, rgba(28, 25, 23, 0.7));
    backdrop-filter: blur(2px);
    border-radius: var(--claude-radius);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    z-index: 10;
  }

  .unavailable-overlay span {
    font-size: 13px;
    color: var(--claude-text-muted);
    font-weight: 500;
  }

  .unavailable-overlay ha-icon {
    color: var(--claude-text-dim);
    --mdc-icon-size: 28px;
  }

  /* ── Brand mark ── */
  .brand-mark {
    display: flex;
    align-items: center;
    gap: 5px;
    opacity: 0.4;
  }

  .brand-mark svg { width: 14px; height: 14px; }

  .brand-mark span {
    font-size: 10px;
    color: var(--claude-text-dim);
    letter-spacing: 0.05em;
  }
`;

// ─── Custom Element ────────────────────────────────────────────────────────────

class WeSmartClimateCard extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._config    = {};
    this._hass      = null;
    this._targetTemp = null;
    this._minTemp   = null;
    this._maxTemp   = null;
    this._tempStep  = 0.5;
    this._hvacMode  = 'off';
  }

  // ── HA lifecycle ─────────────────────────────────────────────────────────────

  static getConfigElement() {
    return document.createElement('wesmart-climate-card-editor');
  }

  static getStubConfig() {
    return { entity: 'climate.example' };
  }

  setConfig(config) {
    if (!config.entity) throw new Error('entity is required');
    this._config = {
      name:          null,
      icon:          null,
      show_fan_mode: true,
      temp_step:     null,
      theme:         'dark',
      ...config,
    };
    this._render();
  }

  set hass(hass) {
    this._hass = hass;
    this._updateState();
  }

  getCardSize() { return 4; }

  // ── Render ───────────────────────────────────────────────────────────────────

  _render() {
    const shadow = this.shadowRoot;
    shadow.innerHTML = '';

    const style = document.createElement('style');
    style.textContent = styles;
    shadow.appendChild(style);

    this._card = document.createElement('div');
    this._card.className = 'card theme-' + (this._config.theme || 'dark');
    this._card.innerHTML = this._getHTML();
    shadow.appendChild(this._card);

    this._bindEvents();
    this._updateState();
  }

  _getHTML() {
    return `
      <!-- Header -->
      <div class="header">
        <div class="entity-info">
          <div class="icon-wrapper">
            <ha-icon id="entity-icon" icon="mdi:thermostat"></ha-icon>
          </div>
          <div class="entity-details">
            <div class="entity-name" id="entity-name">—</div>
            <div class="entity-state">
              <span class="state-dot"></span>
              <span id="state-text">unknown</span>
            </div>
          </div>
        </div>
        <label class="toggle-switch" id="toggle">
          <input type="checkbox" id="toggle-input">
          <div class="toggle-track"></div>
          <div class="toggle-thumb"></div>
        </label>
      </div>

      <!-- Temperature display -->
      <div class="temp-display">
        <div class="temp-current-label">Current</div>
        <div class="temp-current" id="temp-current">—°</div>
        <div class="temp-humidity" id="temp-humidity" style="display:none">
          <ha-icon icon="mdi:water-percent"></ha-icon>
          <span id="humidity-value">—%</span>
        </div>
        <div class="temp-target-row" id="temp-target-row">
          <button class="temp-btn" id="temp-down" aria-label="Decrease temperature">
            <ha-icon icon="mdi:minus"></ha-icon>
          </button>
          <div class="temp-target-wrapper">
            <div class="temp-target" id="temp-target">—°</div>
            <div class="temp-target-label">Target</div>
          </div>
          <button class="temp-btn" id="temp-up" aria-label="Increase temperature">
            <ha-icon icon="mdi:plus"></ha-icon>
          </button>
        </div>
      </div>

      <!-- Controls -->
      <div class="controls" id="controls">

        <!-- HVAC mode -->
        <div class="control-section" id="mode-section">
          <div class="section-label">Mode</div>
          <div class="mode-row" id="mode-row"></div>
        </div>

        <!-- Fan mode -->
        <div class="control-section" id="fan-section" style="display:none">
          <div class="section-label">Fan</div>
          <div class="mode-row" id="fan-row"></div>
        </div>

      </div>

      <!-- Footer -->
      <div class="footer">
        <div class="footer-info">
          <ha-icon icon="mdi:home" style="--mdc-icon-size:13px"></ha-icon>
          <span id="footer-text">—</span>
        </div>
        <div class="brand-mark">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="#D97757"/>
            <circle cx="12" cy="12" r="4" fill="#D97757" opacity="0.6"/>
          </svg>
          <span>WeSmart</span>
        </div>
      </div>

      <!-- Unavailable overlay -->
      <div class="unavailable-overlay" id="unavailable-overlay" style="display:none">
        <ha-icon icon="mdi:lan-disconnect"></ha-icon>
        <span>Unavailable</span>
      </div>
    `;
  }

  // ── State update ─────────────────────────────────────────────────────────────

  _updateState() {
    if (!this._hass || !this._config.entity || !this._card) return;

    const stateObj = this._hass.states[this._config.entity];
    if (!stateObj) return;

    const attrs        = stateObj.attributes || {};
    const hvacMode     = stateObj.state;
    const hvacAction   = attrs.hvac_action || 'off';
    const isOff        = hvacMode === 'off';
    const isUnavail    = hvacMode === 'unavailable';
    const friendlyName = this._config.name || attrs.friendly_name || this._config.entity;

    // card classes
    this._card.classList.toggle('climate-heating', hvacAction === 'heating');
    this._card.classList.toggle('climate-cooling', hvacAction === 'cooling');

    // unavailable overlay
    this._q('#unavailable-overlay').style.display = isUnavail ? 'flex' : 'none';

    // icon
    const actionIcon = ACTION_ICON[hvacAction] || 'mdi:thermostat';
    const icon = this._config.icon || attrs.icon || actionIcon;
    this._q('#entity-icon').setAttribute('icon', icon);

    // name & state text
    this._q('#entity-name').textContent = friendlyName;
    const actionLabel = { heating: 'Heating', cooling: 'Cooling', drying: 'Drying', fan: 'Fan', idle: 'Idle', off: 'Off' };
    const modeLabel   = HVAC_MODE_CONFIG[hvacMode]?.label || hvacMode;
    this._q('#state-text').textContent = isOff ? 'Off' : (actionLabel[hvacAction] || modeLabel);

    // toggle
    this._q('#toggle').classList.toggle('active', !isOff);
    this._q('#toggle-input').checked = !isOff;

    // controls opacity
    const controls = this._q('#controls');
    controls.style.opacity      = isOff ? '0.45' : '1';
    controls.style.pointerEvents = isOff ? 'none' : 'auto';

    // current temperature
    const currentTemp = attrs.current_temperature;
    this._q('#temp-current').textContent = currentTemp != null
      ? `${this._formatTemp(currentTemp)}°`
      : '—';

    // humidity
    const humidity   = attrs.current_humidity;
    const humidityEl = this._q('#temp-humidity');
    if (humidity != null) {
      humidityEl.style.display = 'flex';
      this._q('#humidity-value').textContent = `${Math.round(humidity)}%`;
    } else {
      humidityEl.style.display = 'none';
    }

    // target temperature
    this._minTemp   = attrs.min_temp;
    this._maxTemp   = attrs.max_temp;
    this._tempStep  = this._config.temp_step || attrs.target_temp_step || 0.5;
    this._hvacMode  = hvacMode;

    const targetRow = this._q('#temp-target-row');

    if (hvacMode === 'heat_cool') {
      // show range, hide +/- buttons
      const lo = attrs.target_temp_low;
      const hi = attrs.target_temp_high;
      this._q('#temp-target').textContent = (lo != null && hi != null)
        ? `${this._formatTemp(lo)}°–${this._formatTemp(hi)}°`
        : '—';
      targetRow.style.opacity = '0.7';
      this._q('#temp-down').style.display = 'none';
      this._q('#temp-up').style.display   = 'none';
    } else {
      const target = attrs.temperature;
      this._targetTemp = target;
      this._q('#temp-target').textContent = target != null
        ? `${this._formatTemp(target)}°`
        : '—';
      targetRow.style.opacity = '1';
      this._q('#temp-down').style.display = '';
      this._q('#temp-up').style.display   = '';
    }

    // HVAC mode pills
    const hvacModes = attrs.hvac_modes || [];
    this._renderModePills(hvacModes, hvacMode);

    // fan mode pills
    const fanModes = attrs.fan_modes;
    const fanMode  = attrs.fan_mode;
    const showFan  = this._config.show_fan_mode !== false && fanModes?.length > 0;
    this._q('#fan-section').style.display = showFan ? 'flex' : 'none';
    if (showFan) this._renderFanPills(fanModes, fanMode);

    // footer
    const entityPart = this._config.entity.split('.')[1]?.replace(/_/g, ' ') || '—';
    this._q('#footer-text').textContent = entityPart;
  }

  _formatTemp(val) {
    const n = parseFloat(val);
    if (isNaN(n)) return '—';
    return Number.isInteger(n) ? String(n) : n.toFixed(1);
  }

  // ── Mode pills rendering ──────────────────────────────────────────────────────

  _renderModePills(modes, activeMode) {
    const row = this._q('#mode-row');
    if (!row) return;
    row.innerHTML = modes.map(mode => {
      const cfg    = HVAC_MODE_CONFIG[mode] || { icon: 'mdi:thermostat', label: mode };
      const active = mode === activeMode;
      return `
        <div class="mode-pill ${active ? 'active' : ''}" data-mode="${mode}">
          <ha-icon icon="${cfg.icon}"></ha-icon>
          ${cfg.label}
        </div>
      `;
    }).join('');
  }

  _renderFanPills(fanModes, activeFan) {
    const row = this._q('#fan-row');
    if (!row) return;
    row.innerHTML = fanModes.map(mode => {
      const label = mode.charAt(0).toUpperCase() + mode.slice(1).replace(/_/g, ' ');
      return `<div class="fan-pill ${mode === activeFan ? 'active' : ''}" data-fan="${mode}">${label}</div>`;
    }).join('');
  }

  // ── Events ───────────────────────────────────────────────────────────────────

  _bindEvents() {
    // Toggle power
    this._q('#toggle').addEventListener('click', () => this._togglePower());

    // Temperature +/-
    this._q('#temp-up').addEventListener('click',   () => this._adjustTemp(+1));
    this._q('#temp-down').addEventListener('click', () => this._adjustTemp(-1));

    // HVAC mode pills (delegated)
    this._q('#mode-row').addEventListener('click', (e) => {
      const pill = e.target.closest('.mode-pill');
      if (!pill) return;
      const mode = pill.dataset.mode;
      if (mode) this._callService('climate', 'set_hvac_mode', { hvac_mode: mode });
    });

    // Fan mode pills (delegated)
    this._q('#fan-row').addEventListener('click', (e) => {
      const pill = e.target.closest('.fan-pill');
      if (!pill) return;
      const mode = pill.dataset.fan;
      if (mode) this._callService('climate', 'set_fan_mode', { fan_mode: mode });
    });
  }

  _togglePower() {
    if (!this._hass || !this._config.entity) return;
    const stateObj = this._hass.states[this._config.entity];
    if (!stateObj || stateObj.state === 'unavailable') return;

    if (stateObj.state === 'off') {
      const modes      = stateObj.attributes.hvac_modes || [];
      const firstActive = modes.find(m => m !== 'off') || 'heat';
      this._callService('climate', 'set_hvac_mode', { hvac_mode: firstActive });
    } else {
      this._callService('climate', 'set_hvac_mode', { hvac_mode: 'off' });
    }
  }

  _adjustTemp(direction) {
    if (this._targetTemp == null) return;
    const step   = this._tempStep || 0.5;
    let newTemp  = Math.round((this._targetTemp + direction * step) * 10) / 10;
    if (this._minTemp != null) newTemp = Math.max(this._minTemp, newTemp);
    if (this._maxTemp != null) newTemp = Math.min(this._maxTemp, newTemp);
    if (newTemp === this._targetTemp) return;

    this._targetTemp = newTemp;
    this._q('#temp-target').textContent = `${this._formatTemp(newTemp)}°`;
    this._callService('climate', 'set_temperature', { temperature: newTemp });
  }

  // ── Helpers ──────────────────────────────────────────────────────────────────

  _q(selector) {
    return this._card?.querySelector(selector) ?? null;
  }

  _callService(domain, service, data) {
    this._hass.callService(domain, service, {
      entity_id: this._config.entity,
      ...data,
    });
  }
}

// ─── Config Editor (stub) ─────────────────────────────────────────────────────

class WeSmartClimateCardEditor extends HTMLElement {
  setConfig(config) { this._config = config; }
  set hass(hass)    { this._hass   = hass; }
}

// ─── Register ─────────────────────────────────────────────────────────────────

customElements.define('wesmart-climate-card',        WeSmartClimateCard);
customElements.define('wesmart-climate-card-editor', WeSmartClimateCardEditor);

window.customCards = window.customCards || [];
window.customCards.push({
  type:        'wesmart-climate-card',
  name:        'Claude Climate Card',
  description: 'A sleek climate entity card styled after the Anthropic Claude AI aesthetic.',
  preview:     true,
  documentationURL: 'https://github.com/your-repo/claude-climate-card',
});

console.info(
  `%c CLAUDE CLIMATE CARD %c v${CARD_VERSION} `,
  'background:#D97757;color:#fff;font-weight:700;padding:2px 6px;border-radius:4px 0 0 4px',
  'background:#1C1917;color:#D97757;font-weight:600;padding:2px 6px;border-radius:0 4px 4px 0'
);
