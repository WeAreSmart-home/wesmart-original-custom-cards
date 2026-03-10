/**
 * WeSmart Infinite Climate Card - Home Assistant Custom Card
 * Part of the WeSmart InfiniteColor system — full palette derived from one base color.
 * Cooling state uses a fixed blue (#60B4D8) as semantic secondary — heating uses the accent.
 * Version: 1.0.0
 *
 * Config:
 *   type: custom:wesmart-infinite-climate-card
 *   entity: climate.example
 *   color: "#D97757"    # any hex (optional)
 *   theme: dark | light | auto
 */

(function () {
'use strict';

const CARD_VERSION = '1.0.0';

const HVAC_MODE_CONFIG = {
  off:       { icon: 'mdi:power-off',         label: 'Off'   },
  heat:      { icon: 'mdi:fire',              label: 'Heat'  },
  cool:      { icon: 'mdi:snowflake',         label: 'Cool'  },
  heat_cool: { icon: 'mdi:sun-snowflake',     label: 'Range' },
  auto:      { icon: 'mdi:thermostat-auto',   label: 'Auto'  },
  dry:       { icon: 'mdi:water-off-outline', label: 'Dry'   },
  fan_only:  { icon: 'mdi:fan',               label: 'Fan'   },
};

const ACTION_ICON = {
  heating: 'mdi:fire',
  cooling: 'mdi:snowflake',
  drying:  'mdi:water-percent',
  fan:     'mdi:fan',
  idle:    'mdi:thermostat',
  off:     'mdi:thermostat',
};

const styles = `
  :host {
    --blue:        #60B4D8;
    --blue-glow:   rgba(96, 180, 216, 0.25);
    --blue-soft:   rgba(96, 180, 216, 0.12);
    --radius:      20px;
    --radius-sm:   12px;
    --radius-xs:   8px;
    --transition:  all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    display: block;
    font-family: -apple-system, 'Söhne', 'Inter', BlinkMacSystemFont, sans-serif;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .card {
    background:    var(--bg);
    border:        1px solid var(--border);
    border-radius: var(--radius);
    padding:       20px;
    position:      relative;
    overflow:      hidden;
    transition:    var(--transition);
  }

  /* Radial glow overlay */
  .card::before {
    content:    '';
    position:   absolute;
    inset:      0;
    background: radial-gradient(ellipse 60% 50% at 50% -10%, transparent, transparent);
    opacity:    0;
    transition: opacity 0.5s ease;
    pointer-events: none;
  }

  .card.climate-heating::before {
    background: radial-gradient(ellipse 60% 50% at 50% -10%, var(--accent-soft), transparent);
    opacity: 1;
  }

  .card.climate-cooling::before {
    background: radial-gradient(ellipse 60% 50% at 50% -10%, var(--blue-soft), transparent);
    opacity: 1;
  }

  @keyframes pulse-heat {
    0%, 100% { box-shadow: 0 0 0 1px var(--accent-border-faint), var(--shadow), 0 0 60px var(--accent-glow); }
    50%       { box-shadow: 0 0 0 1px var(--accent-border),       var(--shadow), 0 0 80px var(--accent-glow-strong); }
  }

  @keyframes pulse-cool {
    0%, 100% { box-shadow: 0 0 0 1px rgba(96,180,216,0.1), var(--shadow), 0 0 60px rgba(96,180,216,0.2); }
    50%       { box-shadow: 0 0 0 1px rgba(96,180,216,0.2), var(--shadow), 0 0 80px rgba(96,180,216,0.3); }
  }

  .card.climate-heating { border-color: var(--accent-border); animation: pulse-heat 3s ease-in-out infinite; }
  .card.climate-cooling { border-color: rgba(96,180,216,0.2); animation: pulse-cool 3s ease-in-out infinite; }

  /* Header */
  .header {
    display:         flex;
    align-items:     center;
    justify-content: space-between;
    margin-bottom:   18px;
    position:        relative;
    z-index:         1;
  }

  .entity-info { display: flex; align-items: center; gap: 12px; flex: 1; min-width: 0; }

  .icon-wrapper {
    width:           44px;
    height:          44px;
    border-radius:   var(--radius-sm);
    background:      var(--surface);
    border:          1px solid var(--border);
    display:         flex;
    align-items:     center;
    justify-content: center;
    flex-shrink:     0;
    transition:      var(--transition);
    position:        relative;
    overflow:        hidden;
  }

  .icon-wrapper::after {
    content: ''; position: absolute; inset: 0; opacity: 0; transition: opacity 0.3s ease;
  }

  .card.climate-heating .icon-wrapper { border-color: var(--accent-border); background: var(--accent-soft); }
  .card.climate-heating .icon-wrapper::after { background: var(--accent-soft); opacity: 1; }
  .card.climate-cooling .icon-wrapper { border-color: rgba(96,180,216,0.3); background: rgba(96,180,216,0.1); }
  .card.climate-cooling .icon-wrapper::after { background: var(--blue-soft); opacity: 1; }

  .icon-wrapper ha-icon {
    color: var(--text-muted);
    transition: var(--transition);
    position: relative;
    z-index: 1;
    --mdc-icon-size: 22px;
  }

  .card.climate-heating .icon-wrapper ha-icon { color: var(--accent); }
  .card.climate-cooling .icon-wrapper ha-icon { color: var(--blue); }

  .entity-details { flex: 1; min-width: 0; }

  .entity-name {
    font-size: 15px; font-weight: 600; color: var(--text);
    letter-spacing: -0.01em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }

  .entity-state {
    font-size: 12px; color: var(--text-muted);
    margin-top: 2px; display: flex; align-items: center; gap: 6px;
  }

  .state-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: var(--text-dim); transition: var(--transition); flex-shrink: 0;
  }

  .card.climate-heating .state-dot { background: var(--accent); box-shadow: 0 0 8px var(--accent); }
  .card.climate-cooling .state-dot { background: var(--blue);   box-shadow: 0 0 8px var(--blue); }

  /* Toggle */
  .toggle-switch { position: relative; width: 48px; height: 26px; flex-shrink: 0; cursor: pointer; }
  .toggle-switch input { opacity: 0; width: 0; height: 0; position: absolute; }

  .toggle-track {
    position: absolute; inset: 0;
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 13px; transition: var(--transition);
  }

  .toggle-thumb {
    position: absolute; top: 3px; left: 3px;
    width: 18px; height: 18px; border-radius: 50%;
    background: var(--text-dim); transition: var(--transition);
    box-shadow: 0 1px 4px rgba(0,0,0,0.4);
  }

  .toggle-switch.active .toggle-track { background: var(--accent-soft); border-color: var(--accent-border); }
  .toggle-switch.active .toggle-thumb { left: 23px; background: var(--accent); box-shadow: 0 0 10px var(--accent-glow); }

  /* Temperature display */
  .temp-display {
    display: flex; flex-direction: column; align-items: center;
    padding: 8px 0 22px; position: relative; z-index: 1;
  }

  .temp-current-label {
    font-size: 10px; font-weight: 500; text-transform: uppercase;
    letter-spacing: 0.1em; color: var(--text-dim); margin-bottom: 4px;
  }

  .temp-current {
    font-size: 62px; font-weight: 200; color: var(--text);
    letter-spacing: -0.04em; line-height: 1; font-variant-numeric: tabular-nums;
  }

  .temp-humidity {
    font-size: 12px; color: var(--text-dim); margin-top: 6px;
    display: flex; align-items: center; gap: 3px;
  }

  .temp-humidity ha-icon { --mdc-icon-size: 13px; }

  .temp-target-row {
    display: flex; align-items: center; gap: 20px;
    margin-top: 18px; transition: opacity 0.3s ease;
  }

  .temp-btn {
    width: 38px; height: 38px; border-radius: var(--radius-xs);
    background: var(--surface); border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: var(--text-muted); transition: var(--transition);
  }

  .temp-btn:hover { background: var(--accent-soft); border-color: var(--accent-border); color: var(--accent); }
  .temp-btn:active { transform: scale(0.92); }
  .temp-btn ha-icon { --mdc-icon-size: 18px; }

  .temp-target-wrapper { text-align: center; min-width: 80px; }

  .temp-target {
    font-size: 28px; font-weight: 600; color: var(--accent);
    letter-spacing: -0.02em; font-variant-numeric: tabular-nums; transition: color 0.3s ease;
  }

  .card.climate-cooling .temp-target { color: var(--blue); }

  .temp-target-label {
    font-size: 10px; font-weight: 500; text-transform: uppercase;
    letter-spacing: 0.08em; color: var(--text-dim); margin-top: 3px;
  }

  /* Controls */
  .controls { display: flex; flex-direction: column; gap: 14px; position: relative; z-index: 1; }

  .control-section { display: flex; flex-direction: column; gap: 8px; }

  .section-label {
    font-size: 11px; font-weight: 500; text-transform: uppercase;
    letter-spacing: 0.08em; color: var(--text-dim);
  }

  /* Mode pills */
  .mode-row { display: flex; gap: 6px; flex-wrap: wrap; }

  .mode-pill {
    display: flex; align-items: center; gap: 5px;
    padding: 5px 11px 5px 8px; border-radius: 20px;
    background: var(--surface); border: 1px solid var(--border);
    font-size: 11px; font-weight: 500; color: var(--text-muted);
    cursor: pointer; transition: var(--transition); white-space: nowrap; user-select: none;
  }

  .mode-pill ha-icon { --mdc-icon-size: 13px; }
  .mode-pill:hover { border-color: var(--accent-border); color: var(--text); }

  .mode-pill.active { background: var(--accent-soft); border-color: var(--accent-border); color: var(--accent); }
  .mode-pill.active[data-mode="cool"] { background: rgba(96,180,216,0.12); border-color: rgba(96,180,216,0.35); color: var(--blue); }
  .mode-pill.active[data-mode="off"]  { background: rgba(107,95,86,0.12);  border-color: rgba(107,95,86,0.25);  color: var(--text-muted); }

  /* Fan pills */
  .fan-pill {
    padding: 4px 11px; border-radius: 20px;
    background: var(--surface); border: 1px solid var(--border);
    font-size: 11px; font-weight: 500; color: var(--text-muted);
    cursor: pointer; transition: var(--transition); white-space: nowrap; user-select: none;
  }

  .fan-pill:hover { border-color: var(--accent-border); color: var(--text); }
  .fan-pill.active { background: var(--accent-soft); border-color: var(--accent-border); color: var(--accent); }

  /* Footer */
  .footer {
    display: flex; align-items: center; justify-content: space-between;
    margin-top: 16px; padding-top: 14px; border-top: 1px solid var(--border);
    position: relative; z-index: 1;
  }

  .footer-info { font-size: 11px; color: var(--text-dim); display: flex; align-items: center; gap: 4px; }

  /* Unavailable overlay */
  .unavailable-overlay {
    position: absolute; inset: 0; background: var(--overlay-bg);
    backdrop-filter: blur(2px); border-radius: var(--radius);
    display: flex; flex-direction: column; align-items: center;
    justify-content: center; gap: 8px; z-index: 10;
  }

  .unavailable-overlay span { font-size: 13px; color: var(--text-muted); font-weight: 500; }
  .unavailable-overlay ha-icon { color: var(--text-dim); --mdc-icon-size: 28px; }

  /* Brand */
  .brand-mark { display: flex; align-items: center; gap: 5px; opacity: 0.4; }
  .brand-mark svg { width: 14px; height: 14px; }
  .brand-mark span { font-size: 10px; color: var(--text-dim); letter-spacing: 0.05em; }
`;

class WeSmartInfiniteClimateCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._config     = {};
    this._hass       = null;
    this._targetTemp = null;
    this._minTemp    = null;
    this._maxTemp    = null;
    this._tempStep   = 0.5;
    this._hvacMode   = 'off';
  }

  static getStubConfig() { return { entity: 'climate.example' }; }

  setConfig(config) {
    if (!config.entity) throw new Error('entity is required');
    this._config = {
      name: null, icon: null, show_fan_mode: true, temp_step: null,
      theme: 'dark', color: '#D97757',
      ...config,
    };
    this._applyPalette();
    this._render();
  }

  set hass(hass) { this._hass = hass; this._updateState(); }
  getCardSize() { return 4; }

  // ── Color Engine ──────────────────────────────────────────────────────────

  _hexToHsl(hex) {
    let r = parseInt(hex.slice(1, 3), 16) / 255;
    let g = parseInt(hex.slice(3, 5), 16) / 255;
    let b = parseInt(hex.slice(5, 7), 16) / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    if (max === min) { h = s = 0; }
    else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
  }

  _hsl(h, s, l)       { return `hsl(${h},${s}%,${l}%)`; }
  _hsla(h, s, l, a)   { return `hsla(${h},${s}%,${l}%,${a})`; }
  _clamp(v, min, max) { return Math.min(max, Math.max(min, v)); }

  _buildPalette(hex, isDark) {
    const { h, s, l } = this._hexToHsl(hex);
    const c = this._clamp.bind(this);
    if (isDark) {
      const accentL = c(l, 50, 65);
      return {
        accent:            this._hsl(h, s, accentL),
        accentSoft:        this._hsla(h, s, accentL, 0.15),
        accentGlow:        this._hsla(h, s, accentL, 0.25),
        accentGlowStrong:  this._hsla(h, s, accentL, 0.35),
        accentBorder:      this._hsla(h, s, accentL, 0.20),
        accentBorderFaint: this._hsla(h, s, accentL, 0.10),
        bg:                this._hsl(h, c(Math.round(s * 0.35), 25, 45), 11),
        surface:           this._hsl(h, c(Math.round(s * 0.28), 20, 38), 16),
        border:            `hsla(0,0%,100%,0.08)`,
        text:              this._hsl(h, c(Math.round(s * 0.08), 5, 10), 93),
        textMuted:         this._hsl(h, c(Math.round(s * 0.12), 8, 15), 65),
        textDim:           this._hsl(h, c(Math.round(s * 0.10), 6, 12), 42),
        overlayBg:         `rgba(28,25,23,0.7)`,
        shadow:            `0 8px 32px ${this._hsla(h, s, 5, 0.45)}`,
      };
    } else {
      const accentL = c(l, 35, 52);
      return {
        accent:            this._hsl(h, s, accentL),
        accentSoft:        this._hsla(h, s, accentL, 0.12),
        accentGlow:        this._hsla(h, s, accentL, 0.20),
        accentGlowStrong:  this._hsla(h, s, accentL, 0.30),
        accentBorder:      this._hsla(h, s, accentL, 0.25),
        accentBorderFaint: this._hsla(h, s, accentL, 0.12),
        bg:                this._hsl(h, c(Math.round(s * 0.08), 5, 10), 99),
        surface:           this._hsl(h, c(Math.round(s * 0.12), 8, 15), 95),
        border:            this._hsla(h, c(Math.round(s * 0.15), 10, 20), 25, 0.09),
        text:              this._hsl(h, c(Math.round(s * 0.25), 18, 35), 12),
        textMuted:         this._hsl(h, c(Math.round(s * 0.20), 15, 28), 40),
        textDim:           this._hsl(h, c(Math.round(s * 0.15), 10, 20), 60),
        overlayBg:         `rgba(245,240,235,0.8)`,
        shadow:            `0 2px 16px ${this._hsla(h, s, 20, 0.07)}, 0 0 0 1px ${this._hsla(h, s, 20, 0.04)}`,
      };
    }
  }

  _applyPalette() {
    const isDark = this._config.theme === 'auto'
      ? !window.matchMedia('(prefers-color-scheme: light)').matches
      : this._config.theme !== 'light';
    this._palette = this._buildPalette(this._config.color, isDark);
    const p = this._palette;
    this.style.setProperty('--accent',             p.accent);
    this.style.setProperty('--accent-soft',        p.accentSoft);
    this.style.setProperty('--accent-glow',        p.accentGlow);
    this.style.setProperty('--accent-glow-strong', p.accentGlowStrong);
    this.style.setProperty('--accent-border',      p.accentBorder);
    this.style.setProperty('--accent-border-faint',p.accentBorderFaint);
    this.style.setProperty('--bg',                 p.bg);
    this.style.setProperty('--surface',            p.surface);
    this.style.setProperty('--border',             p.border);
    this.style.setProperty('--text',               p.text);
    this.style.setProperty('--text-muted',         p.textMuted);
    this.style.setProperty('--text-dim',           p.textDim);
    this.style.setProperty('--overlay-bg',         p.overlayBg);
    this.style.setProperty('--shadow',             p.shadow);

    if (this._config.theme === 'auto' && !this._mqHandler) {
      this._mqHandler = () => { this._applyPalette(); };
      window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', this._mqHandler);
    }
  }

  _brandSVG() {
    const fill = this._palette?.accent ?? '#D97757';
    return `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.3 2.45a.74.74 0 0 0-1.38 0l-1.18 3.27H11.3L10.1 2.45a.74.74 0 0 0-1.38 0L7.3 6.37 4.1 7.56a.74.74 0 0 0 0 1.38l3.2 1.19.82 2.28-3.26 1.18a.74.74 0 0 0 0 1.38l3.26 1.18L9.3 19.2l-2.1.76a.74.74 0 0 0 0 1.38l3.26 1.18.45 1.24a.74.74 0 0 0 1.38 0l.45-1.24 3.26-1.18a.74.74 0 0 0 0-1.38l-2.1-.76 1.18-3.27 3.26-1.18a.74.74 0 0 0 0-1.38l-3.26-1.18.82-2.28 3.2-1.19a.74.74 0 0 0 0-1.38l-3.2-1.19-1.37-3.92z" fill="${fill}"/>
    </svg>`;
  }

  // ── Render ────────────────────────────────────────────────────────────────

  _render() {
    const shadow = this.shadowRoot;
    shadow.innerHTML = '';

    const style = document.createElement('style');
    style.textContent = styles;
    shadow.appendChild(style);

    this._card = document.createElement('div');
    this._card.className = 'card';
    this._card.innerHTML = this._getHTML();
    shadow.appendChild(this._card);

    this._bindEvents();
    this._updateState();
  }

  _getHTML() {
    return `
      <div class="header">
        <div class="entity-info">
          <div class="icon-wrapper"><ha-icon id="entity-icon" icon="mdi:thermostat"></ha-icon></div>
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

      <div class="controls" id="controls">
        <div class="control-section" id="mode-section">
          <div class="section-label">Mode</div>
          <div class="mode-row" id="mode-row"></div>
        </div>
        <div class="control-section" id="fan-section" style="display:none">
          <div class="section-label">Fan</div>
          <div class="mode-row" id="fan-row"></div>
        </div>
      </div>

      <div class="footer">
        <div class="footer-info">
          <ha-icon icon="mdi:home" style="--mdc-icon-size:13px"></ha-icon>
          <span id="footer-text">—</span>
        </div>
        <div class="brand-mark">
          ${this._brandSVG()}
          <span>WeSmart</span>
        </div>
      </div>

      <div class="unavailable-overlay" id="unavailable-overlay" style="display:none">
        <ha-icon icon="mdi:lan-disconnect"></ha-icon>
        <span>Unavailable</span>
      </div>
    `;
  }

  // ── State update ──────────────────────────────────────────────────────────

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

    this._card.classList.toggle('climate-heating', hvacAction === 'heating');
    this._card.classList.toggle('climate-cooling', hvacAction === 'cooling');

    this._q('#unavailable-overlay').style.display = isUnavail ? 'flex' : 'none';

    const actionIcon = ACTION_ICON[hvacAction] || 'mdi:thermostat';
    this._q('#entity-icon').setAttribute('icon', this._config.icon || attrs.icon || actionIcon);
    this._q('#entity-name').textContent = friendlyName;

    const actionLabel = { heating: 'Heating', cooling: 'Cooling', drying: 'Drying', fan: 'Fan', idle: 'Idle', off: 'Off' };
    const modeLabel   = HVAC_MODE_CONFIG[hvacMode]?.label || hvacMode;
    this._q('#state-text').textContent = isOff ? 'Off' : (actionLabel[hvacAction] || modeLabel);

    this._q('#toggle').classList.toggle('active', !isOff);
    this._q('#toggle-input').checked = !isOff;

    const controls = this._q('#controls');
    controls.style.opacity      = isOff ? '0.45' : '1';
    controls.style.pointerEvents = isOff ? 'none' : 'auto';

    const currentTemp = attrs.current_temperature;
    this._q('#temp-current').textContent = currentTemp != null ? `${this._formatTemp(currentTemp)}°` : '—';

    const humidity   = attrs.current_humidity;
    const humidityEl = this._q('#temp-humidity');
    if (humidity != null) {
      humidityEl.style.display = 'flex';
      this._q('#humidity-value').textContent = `${Math.round(humidity)}%`;
    } else {
      humidityEl.style.display = 'none';
    }

    this._minTemp  = attrs.min_temp;
    this._maxTemp  = attrs.max_temp;
    this._tempStep = this._config.temp_step || attrs.target_temp_step || 0.5;
    this._hvacMode = hvacMode;

    const targetRow = this._q('#temp-target-row');

    if (hvacMode === 'heat_cool') {
      const lo = attrs.target_temp_low, hi = attrs.target_temp_high;
      this._q('#temp-target').textContent = (lo != null && hi != null) ? `${this._formatTemp(lo)}°–${this._formatTemp(hi)}°` : '—';
      targetRow.style.opacity = '0.7';
      this._q('#temp-down').style.display = 'none';
      this._q('#temp-up').style.display   = 'none';
    } else {
      const target = attrs.temperature;
      this._targetTemp = target;
      this._q('#temp-target').textContent = target != null ? `${this._formatTemp(target)}°` : '—';
      targetRow.style.opacity = '1';
      this._q('#temp-down').style.display = '';
      this._q('#temp-up').style.display   = '';
    }

    this._renderModePills(attrs.hvac_modes || [], hvacMode);

    const fanModes = attrs.fan_modes, fanMode = attrs.fan_mode;
    const showFan  = this._config.show_fan_mode !== false && fanModes?.length > 0;
    this._q('#fan-section').style.display = showFan ? 'flex' : 'none';
    if (showFan) this._renderFanPills(fanModes, fanMode);

    this._q('#footer-text').textContent = this._config.entity.split('.')[1]?.replace(/_/g, ' ') || '—';
  }

  _formatTemp(val) {
    const n = parseFloat(val);
    if (isNaN(n)) return '—';
    return Number.isInteger(n) ? String(n) : n.toFixed(1);
  }

  _renderModePills(modes, activeMode) {
    const row = this._q('#mode-row');
    if (!row) return;
    row.innerHTML = modes.map(mode => {
      const cfg = HVAC_MODE_CONFIG[mode] || { icon: 'mdi:thermostat', label: mode };
      return `<div class="mode-pill ${mode === activeMode ? 'active' : ''}" data-mode="${mode}">
        <ha-icon icon="${cfg.icon}"></ha-icon>${cfg.label}
      </div>`;
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

  // ── Events ────────────────────────────────────────────────────────────────

  _bindEvents() {
    this._q('#toggle').addEventListener('click', () => this._togglePower());
    this._q('#temp-up').addEventListener('click',   () => this._adjustTemp(+1));
    this._q('#temp-down').addEventListener('click', () => this._adjustTemp(-1));

    this._q('#mode-row').addEventListener('click', (e) => {
      const pill = e.target.closest('.mode-pill');
      if (pill?.dataset.mode) this._callService('climate', 'set_hvac_mode', { hvac_mode: pill.dataset.mode });
    });

    this._q('#fan-row').addEventListener('click', (e) => {
      const pill = e.target.closest('.fan-pill');
      if (pill?.dataset.fan) this._callService('climate', 'set_fan_mode', { fan_mode: pill.dataset.fan });
    });
  }

  _togglePower() {
    if (!this._hass || !this._config.entity) return;
    const stateObj = this._hass.states[this._config.entity];
    if (!stateObj || stateObj.state === 'unavailable') return;
    if (stateObj.state === 'off') {
      const firstActive = (stateObj.attributes.hvac_modes || []).find(m => m !== 'off') || 'heat';
      this._callService('climate', 'set_hvac_mode', { hvac_mode: firstActive });
    } else {
      this._callService('climate', 'set_hvac_mode', { hvac_mode: 'off' });
    }
  }

  _adjustTemp(direction) {
    if (this._targetTemp == null) return;
    let newTemp = Math.round((this._targetTemp + direction * this._tempStep) * 10) / 10;
    if (this._minTemp != null) newTemp = Math.max(this._minTemp, newTemp);
    if (this._maxTemp != null) newTemp = Math.min(this._maxTemp, newTemp);
    if (newTemp === this._targetTemp) return;
    this._targetTemp = newTemp;
    this._q('#temp-target').textContent = `${this._formatTemp(newTemp)}°`;
    this._callService('climate', 'set_temperature', { temperature: newTemp });
  }

  _q(selector) { return this._card?.querySelector(selector) ?? null; }

  _callService(domain, service, data) {
    this._hass.callService(domain, service, { entity_id: this._config.entity, ...data });
  }
}

customElements.define('wesmart-infinite-climate-card', WeSmartInfiniteClimateCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type:        'wesmart-infinite-climate-card',
  name:        'WeSmart Infinite Climate Card',
  description: 'Climate card with dynamic InfiniteColor palette.',
  preview:     true,
});

console.info(
  `%c WESMART INFINITE CLIMATE CARD %c v${CARD_VERSION} `,
  'background:#D97757;color:#fff;font-weight:700;padding:2px 6px;border-radius:4px 0 0 4px',
  'background:#1C1917;color:#D97757;font-weight:600;padding:2px 6px;border-radius:0 4px 4px 0'
);

})();
