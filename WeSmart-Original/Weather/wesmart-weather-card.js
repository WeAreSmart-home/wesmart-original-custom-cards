/**
 * WeSmart Weather Card — Home Assistant Custom Card
 *
 * Features:
 *   - Current conditions: large icon + temperature + feels like
 *   - Stats strip: humidity, wind speed/direction, pressure, UV index, visibility
 *   - Daily or hourly forecast row (up to 7 slots)
 *   - Fetches forecast via WebSocket API (HA 2023.9+) with fallback to attribute
 *   - Condition-aware icon colors
 *   - Supports dark / light / auto themes
 *
 * Config options:
 *   entity          string   required             weather.* entity
 *   title           string   ''                   Override header title
 *   icon            string   auto                 Override header icon
 *   theme           string   'dark'               dark | light | auto
 *   forecast_type   string   'daily'              daily | hourly
 *   forecast_days   number   5                    1–7 forecast slots to show
 *   show_humidity   boolean  true
 *   show_wind       boolean  true
 *   show_pressure   boolean  false
 *   show_visibility boolean  false
 *
 * Version: 1.0.0
 */

(() => {
  'use strict';

  const CARD_VERSION = '1.0.0';

  // ─── Condition map ───────────────────────────────────────────────────────────

  const CONDITIONS = {
    'sunny':            { icon: 'mdi:weather-sunny',            color: '#F0C060' },
    'clear-night':      { icon: 'mdi:weather-night',            color: '#8890C8' },
    'partlycloudy':     { icon: 'mdi:weather-partly-cloudy',    color: '#C0A878' },
    'cloudy':           { icon: 'mdi:weather-cloudy',           color: '#8890A0' },
    'rainy':            { icon: 'mdi:weather-rainy',            color: '#60B4D8' },
    'pouring':          { icon: 'mdi:weather-pouring',          color: '#4090C0' },
    'snowy':            { icon: 'mdi:weather-snowy',            color: '#A8C8E0' },
    'snowy-rainy':      { icon: 'mdi:weather-snowy-rainy',      color: '#80A8C8' },
    'windy':            { icon: 'mdi:weather-windy',            color: '#8FBC8F' },
    'windy-variant':    { icon: 'mdi:weather-windy-variant',    color: '#8FBC8F' },
    'fog':              { icon: 'mdi:weather-fog',              color: '#A0988A' },
    'hail':             { icon: 'mdi:weather-hail',             color: '#70A8C8' },
    'lightning':        { icon: 'mdi:weather-lightning',        color: '#D4A84B' },
    'lightning-rainy':  { icon: 'mdi:weather-lightning-rainy',  color: '#C07830' },
    'exceptional':      { icon: 'mdi:alert-circle',             color: '#D97757' },
    '_default':         { icon: 'mdi:weather-cloudy',           color: '#A09080' },
  };

  function condDef(condition) {
    return CONDITIONS[condition] || CONDITIONS._default;
  }

  // ─── Helpers ────────────────────────────────────────────────────────────────

  const WIND_DIRS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];

  function windDir(bearing) {
    if (bearing == null) return '';
    return WIND_DIRS[Math.round(bearing / 45) % 8];
  }

  function fmtTemp(val, unit) {
    if (val == null) return '—';
    return `${Math.round(val)}${unit}`;
  }

  function fmtDay(dateStr, type) {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    if (type === 'hourly') return d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: false });
    return d.toLocaleDateString(undefined, { weekday: 'short' });
  }

  function isToday(dateStr) {
    const d = new Date(dateStr);
    const now = new Date();
    return d.getDate() === now.getDate() && d.getMonth() === now.getMonth();
  }

  // ─── Styles ─────────────────────────────────────────────────────────────────

  const CSS = `
    :host {
      --orange:       #D97757;
      --orange-glow:  rgba(217, 119, 87, 0.22);
      --r20: 20px; --r12: 12px; --r8: 8px; --r6: 6px;
      display: block;
      font-family: -apple-system, 'Söhne', 'Inter', BlinkMacSystemFont, sans-serif;
    }

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    /* ── Dark ── */
    .card {
      --bg:    #292524;
      --surf:  #332E2A;
      --bdr:   rgba(255, 255, 255, 0.08);
      --txt:   #F5F0EB;
      --muted: #A09080;
      --dim:   #6B5F56;
      --shad:  0 8px 32px rgba(0, 0, 0, 0.4);
      background: var(--bg);
      border: 1px solid var(--bdr);
      border-radius: var(--r20);
      overflow: hidden;
      box-shadow: var(--shad);
    }

    /* ── Light ── */
    .card.theme-light {
      --bg:    #FFFEFA;
      --surf:  #F5F0EB;
      --bdr:   rgba(28, 25, 23, 0.09);
      --txt:   #1C1917;
      --muted: #6B5F56;
      --dim:   #A09080;
      --shad:  0 2px 16px rgba(0, 0, 0, 0.07), 0 0 0 1px rgba(0, 0, 0, 0.04);
    }

    /* ── Auto ── */
    @media (prefers-color-scheme: light) {
      .card.theme-auto {
        --bg:    #FFFEFA;
        --surf:  #F5F0EB;
        --bdr:   rgba(28, 25, 23, 0.09);
        --txt:   #1C1917;
        --muted: #6B5F56;
        --dim:   #A09080;
        --shad:  0 2px 16px rgba(0, 0, 0, 0.07), 0 0 0 1px rgba(0, 0, 0, 0.04);
      }
    }

    /* ── Header ── */
    .header {
      display: flex; align-items: center; gap: 12px;
      padding: 16px 18px 12px;
    }

    .hdr-icon {
      width: 38px; height: 38px;
      border-radius: var(--r12);
      background: var(--surf); border: 1px solid var(--bdr);
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }

    .hdr-icon ha-icon { --mdc-icon-size: 19px; color: var(--orange); }

    .hdr-titles { flex: 1; min-width: 0; }

    .hdr-title {
      font-size: 14px; font-weight: 600;
      color: var(--txt); letter-spacing: -0.01em;
    }

    .hdr-sub { font-size: 11px; color: var(--muted); margin-top: 2px; }

    /* ── Current conditions ── */
    .current {
      display: flex;
      align-items: center;
      gap: 20px;
      padding: 8px 18px 20px;
    }

    /* Left: big icon */
    .cond-icon-wrap {
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
      width: 80px; height: 80px;
      border-radius: 50%;
      background: var(--surf); border: 1px solid var(--bdr);
      transition: border-color 0.4s, box-shadow 0.4s;
    }

    .cond-icon-wrap ha-icon {
      --mdc-icon-size: 44px;
      transition: color 0.4s;
    }

    /* Right: temp + label */
    .cond-info { flex: 1; min-width: 0; }

    .cond-temp {
      font-size: 58px; font-weight: 700;
      color: var(--txt); letter-spacing: -0.04em;
      line-height: 1; display: flex; align-items: flex-start; gap: 2px;
    }

    .cond-temp-unit {
      font-size: 22px; font-weight: 500;
      color: var(--muted); margin-top: 10px;
    }

    .cond-label {
      font-size: 14px; font-weight: 500;
      color: var(--muted); margin-top: 4px;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }

    .cond-feels {
      font-size: 11px; color: var(--dim); margin-top: 3px;
    }

    /* ── Stats strip ── */
    .stats {
      display: flex;
      gap: 6px;
      padding: 0 18px 18px;
      flex-wrap: wrap;
    }

    .stat-pill {
      display: flex; align-items: center; gap: 5px;
      background: var(--surf); border: 1px solid var(--bdr);
      border-radius: 20px; padding: 5px 10px;
      font-size: 12px; color: var(--muted);
      white-space: nowrap;
    }

    .stat-pill ha-icon { --mdc-icon-size: 13px; color: var(--dim); }

    /* ── Separator ── */
    .sep { height: 1px; background: var(--bdr); margin: 0 18px; }

    /* ── Forecast row ── */
    .forecast {
      padding: 14px 14px 16px;
      display: flex;
      gap: 4px;
      overflow-x: auto;
      scrollbar-width: none;
    }

    .forecast::-webkit-scrollbar { display: none; }

    .fc-item {
      flex: 1; min-width: 52px;
      display: flex; flex-direction: column; align-items: center;
      gap: 4px;
      padding: 10px 6px;
      border-radius: var(--r8);
      background: var(--surf); border: 1px solid var(--bdr);
      transition: border-color 0.2s;
    }

    .fc-item.today { border-color: rgba(217, 119, 87, 0.35); }

    .fc-day {
      font-size: 10px; font-weight: 600;
      color: var(--muted); text-transform: uppercase; letter-spacing: 0.05em;
    }

    .fc-item.today .fc-day { color: var(--orange); }

    .fc-icon { --mdc-icon-size: 20px; }

    .fc-hi {
      font-size: 13px; font-weight: 700;
      color: var(--txt); letter-spacing: -0.02em;
    }

    .fc-lo {
      font-size: 11px; color: var(--dim);
    }

    .fc-rain {
      font-size: 10px; color: #60B4D8;
      display: flex; align-items: center; gap: 2px;
    }

    .fc-rain ha-icon { --mdc-icon-size: 10px; }

    /* Empty forecast */
    .fc-empty {
      width: 100%; text-align: center;
      font-size: 12px; color: var(--dim);
      padding: 12px 0;
    }

    /* ── Footer ── */
    .footer {
      display: flex; align-items: center; justify-content: space-between;
      padding: 10px 18px 14px;
    }

    .footer-txt { font-size: 11px; color: var(--dim); }

    .brand { display: flex; align-items: center; gap: 5px; opacity: 0.4; }
    .brand svg { width: 14px; height: 14px; }
    .brand span { font-size: 10px; color: var(--dim); letter-spacing: 0.05em; }
  `;

  // ─── Custom Element ──────────────────────────────────────────────────────────

  class WeSmartWeatherCard extends HTMLElement {

    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this._config     = {};
      this._hass       = null;
      this._card       = null;
      this._forecast   = null;
      this._lastFetch  = 0;
    }

    // ── HA lifecycle ────────────────────────────────────────────────────────────

    static getStubConfig() {
      return {
        entity: 'weather.home',
        title:  '',
        theme:  'dark',
      };
    }

    setConfig(config) {
      if (!config.entity) throw new Error('entity is required');
      this._config = {
        title:            '',
        icon:             '',
        theme:            'dark',
        forecast_type:    'daily',
        forecast_days:    5,
        show_humidity:    true,
        show_wind:        true,
        show_pressure:    false,
        show_visibility:  false,
        ...config,
      };
      this._forecast  = null;
      this._lastFetch = 0;
      this._render();
    }

    set hass(hass) {
      this._hass = hass;
      this._update();

      // Refetch forecast every 30 min or on first load
      const now = Date.now();
      if (now - this._lastFetch > 30 * 60 * 1000) {
        this._lastFetch = now;
        this._fetchForecast();
      }
    }

    getCardSize() { return 5; }

    // ── Forecast fetch ───────────────────────────────────────────────────────────

    async _fetchForecast() {
      if (!this._hass) return;
      const entityId = this._config.entity;
      try {
        // HA 2023.9+ WebSocket API
        const result = await this._hass.callWS({
          type:          'weather/get_forecasts',
          entity_ids:    [entityId],
          forecast_type: this._config.forecast_type,
        });
        this._forecast = result?.[entityId]?.forecast ?? [];
      } catch {
        // Fallback: legacy forecast attribute
        this._forecast = this._hass.states[entityId]?.attributes?.forecast ?? [];
      }
      this._renderForecast();
    }

    // ── Render ──────────────────────────────────────────────────────────────────

    _render() {
      const root = this.shadowRoot;
      root.innerHTML = '';

      const style = document.createElement('style');
      style.textContent = CSS;
      root.appendChild(style);

      this._card = document.createElement('div');
      this._card.className = `card theme-${this._config.theme}`;
      this._card.innerHTML = this._html();
      root.appendChild(this._card);

      this._update();
      if (this._forecast) this._renderForecast();
    }

    _html() {
      return `
        <!-- Header -->
        <div class="header">
          <div class="hdr-icon">
            <ha-icon id="hdr-icon" icon="mdi:weather-partly-cloudy"></ha-icon>
          </div>
          <div class="hdr-titles">
            <div class="hdr-title" id="hdr-title">Weather</div>
            <div class="hdr-sub" id="hdr-sub">—</div>
          </div>
        </div>

        <!-- Current conditions -->
        <div class="current">
          <div class="cond-icon-wrap" id="cond-icon-wrap">
            <ha-icon id="cond-icon" icon="mdi:weather-cloudy"></ha-icon>
          </div>
          <div class="cond-info">
            <div class="cond-temp">
              <span id="cond-temp">—</span>
              <span class="cond-temp-unit" id="cond-unit">°</span>
            </div>
            <div class="cond-label" id="cond-label">—</div>
            <div class="cond-feels" id="cond-feels"></div>
          </div>
        </div>

        <!-- Stats strip -->
        <div class="stats" id="stats-strip"></div>

        <div class="sep"></div>

        <!-- Forecast row -->
        <div class="forecast" id="forecast-row">
          <div class="fc-empty">Loading forecast…</div>
        </div>

        <div class="sep"></div>

        <!-- Footer -->
        <div class="footer">
          <div class="footer-txt">WeSmart Weather v${CARD_VERSION}</div>
          <div class="brand">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="#D97757"/>
              <circle cx="12" cy="12" r="4" fill="#D97757" opacity="0.6"/>
            </svg>
            <span>WeSmart</span>
          </div>
        </div>
      `;
    }

    // ── Current conditions update ────────────────────────────────────────────────

    _update() {
      if (!this._hass || !this._card) return;

      const s = this._hass.states[this._config.entity];
      if (!s) return;

      const attrs     = s.attributes || {};
      const condition = s.state;
      const def       = condDef(condition);

      // Temperature unit from entity or HA config
      const tempUnit  = attrs.temperature_unit || this._hass.config?.unit_system?.temperature || '°C';

      // ── Header ──
      const friendlyName = attrs.friendly_name || this._config.entity;
      this._setText('hdr-title', this._config.title || friendlyName);
      this._setText('hdr-sub',   condition ? this._capitalize(condition.replace(/-/g, ' ')) : '—');

      // Header icon
      const hdrIcon = this._q('#hdr-icon');
      if (hdrIcon) hdrIcon.setAttribute('icon', this._config.icon || def.icon);

      // ── Condition icon ──
      const iconEl   = this._q('#cond-icon');
      const iconWrap = this._q('#cond-icon-wrap');
      if (iconEl) iconEl.setAttribute('icon', def.icon);
      if (iconEl) iconEl.style.color = def.color;
      if (iconWrap) {
        iconWrap.style.borderColor  = def.color.replace(')', ', 0.5)').replace('rgb', 'rgba').replace(/^#/, '').length > 6
          ? def.color
          : def.color + '80';
        iconWrap.style.borderColor  = def.color;
        iconWrap.style.boxShadow    = `0 0 20px ${def.color}40`;
      }

      // ── Temperature ──
      this._setText('cond-temp', attrs.temperature != null ? Math.round(attrs.temperature) : '—');
      this._setText('cond-unit', tempUnit);

      // ── Condition label ──
      this._setText('cond-label', this._capitalize(condition.replace(/-/g, ' ')));

      // ── Feels like ──
      const feels = attrs.apparent_temperature ?? attrs.feels_like;
      const feelsEl = this._q('#cond-feels');
      if (feelsEl) {
        feelsEl.textContent = feels != null ? `Feels like ${Math.round(feels)}${tempUnit}` : '';
      }

      // ── Stats ──
      this._renderStats(attrs, tempUnit);
    }

    _renderStats(attrs, tempUnit) {
      const c     = this._config;
      const strip = this._q('#stats-strip');
      if (!strip) return;

      const stats = [];

      if (c.show_humidity && attrs.humidity != null) {
        stats.push({ icon: 'mdi:water-percent', value: `${Math.round(attrs.humidity)} %`, title: 'Humidity' });
      }

      if (c.show_wind && attrs.wind_speed != null) {
        const speedUnit = attrs.wind_speed_unit || 'km/h';
        const dir       = windDir(attrs.wind_bearing);
        const dirStr    = dir ? ` ${dir}` : '';
        stats.push({ icon: 'mdi:weather-windy', value: `${Math.round(attrs.wind_speed)} ${speedUnit}${dirStr}`, title: 'Wind' });
      }

      if (c.show_pressure && attrs.pressure != null) {
        const pUnit = attrs.pressure_unit || 'hPa';
        stats.push({ icon: 'mdi:gauge', value: `${Math.round(attrs.pressure)} ${pUnit}`, title: 'Pressure' });
      }

      if (c.show_visibility && attrs.visibility != null) {
        const vUnit = attrs.visibility_unit || 'km';
        stats.push({ icon: 'mdi:eye', value: `${attrs.visibility} ${vUnit}`, title: 'Visibility' });
      }

      if (attrs.uv_index != null) {
        stats.push({ icon: 'mdi:sun-wireless', value: `UV ${attrs.uv_index}`, title: 'UV index' });
      }

      strip.innerHTML = stats.map(st => `
        <div class="stat-pill" title="${st.title}">
          <ha-icon icon="${st.icon}"></ha-icon>
          ${st.value}
        </div>
      `).join('');
    }

    // ── Forecast render ──────────────────────────────────────────────────────────

    _renderForecast() {
      const row = this._q('#forecast-row');
      if (!row) return;

      const forecast = this._forecast ?? [];
      const days     = Math.min(this._config.forecast_days, forecast.length);

      if (days === 0) {
        row.innerHTML = '<div class="fc-empty">No forecast available</div>';
        return;
      }

      const s        = this._hass?.states[this._config.entity];
      const attrs    = s?.attributes || {};
      const tempUnit = attrs.temperature_unit || this._hass?.config?.unit_system?.temperature || '°C';
      const type     = this._config.forecast_type;

      row.innerHTML = forecast.slice(0, days).map(fc => {
        const def    = condDef(fc.condition);
        const today  = isToday(fc.datetime);
        const dayLbl = today ? 'Today' : fmtDay(fc.datetime, type);
        const hi     = fmtTemp(fc.temperature ?? fc.templow, tempUnit);
        const lo     = fc.templow != null ? fmtTemp(fc.templow, tempUnit) : null;

        // precipitation probability
        const rain = fc.precipitation_probability;
        const rainHtml = rain != null && rain > 0
          ? `<div class="fc-rain"><ha-icon icon="mdi:water"></ha-icon>${rain}%</div>`
          : '';

        return `
          <div class="fc-item${today ? ' today' : ''}">
            <div class="fc-day">${dayLbl}</div>
            <ha-icon class="fc-icon" icon="${def.icon}" style="color:${def.color}"></ha-icon>
            <div class="fc-hi">${hi}</div>
            ${lo ? `<div class="fc-lo">${lo}</div>` : ''}
            ${rainHtml}
          </div>
        `;
      }).join('');
    }

    // ── Helpers ──────────────────────────────────────────────────────────────────

    _setText(id, text) {
      const el = this._q(`#${id}`);
      if (el) el.textContent = text ?? '—';
    }

    _capitalize(str) {
      return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
    }

    _q(sel) { return this._card?.querySelector(sel) ?? null; }
  }

  // ─── Config Editor (stub) ────────────────────────────────────────────────────

  class WeSmartWeatherCardEditor extends HTMLElement {
    setConfig(config) { this._config = config; }
    set hass(hass)    { this._hass   = hass; }
  }

  // ─── Register ────────────────────────────────────────────────────────────────

  customElements.define('wesmart-weather-card',        WeSmartWeatherCard);
  customElements.define('wesmart-weather-card-editor', WeSmartWeatherCardEditor);

  window.customCards = window.customCards || [];
  window.customCards.push({
    type:        'wesmart-weather-card',
    name:        'WeSmart Weather Card',
    description: 'Current conditions with large icon + temperature, stats strip and daily/hourly forecast row.',
    preview:     true,
  });

  console.info(
    `%c WESMART WEATHER CARD %c v${CARD_VERSION} `,
    'background:#D97757;color:#fff;font-weight:700;padding:2px 6px;border-radius:4px 0 0 4px',
    'background:#1C1917;color:#D97757;font-weight:600;padding:2px 6px;border-radius:0 4px 4px 0'
  );

})();
