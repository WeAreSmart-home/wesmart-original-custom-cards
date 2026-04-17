/**
 * WeSmart Labs — Surface
 * Professional cardless dashboard. Elegantly structured for tablet & desktop.
 * Uses CSS Grid, semantic colors, and MDI icons for high readability.
 *
 * STATUS: EXPERIMENTAL
 * YAML tag: wesmart-labs-surface
 *
 * @version 0.3.0
 */
(() => {

  // ─── Styles ───────────────────────────────────────────────────────────────
  const styles = `
    :host {
      display: block;
      font-family: -apple-system, 'Inter', BlinkMacSystemFont, 'Söhne', sans-serif;
      -webkit-font-smoothing: antialiased;
      
      /* Fluid spacing variables */
      --sp-xs: clamp(4px, 1vw, 8px);
      --sp-sm: clamp(8px, 2vw, 16px);
      --sp-md: clamp(16px, 3vw, 24px);
      --sp-lg: clamp(24px, 4vw, 32px);
      --sp-xl: clamp(32px, 5vw, 48px);
      --sp-edge: clamp(20px, 4vw, 40px);

      /* Semantic Colors */
      --color-light-on: #f59e0b; /* Warm amber */
      --color-door-open: #ef4444; /* Soft coral/red */
    }

    /* ── Surface ────────────────────────────────────────────────────── */
    .surface {
      background: var(--bg);
      min-height: 100%;
      box-sizing: border-box;
      padding: var(--sp-xl) var(--sp-edge);
      display: flex;
      flex-direction: column;
      gap: var(--sp-xl);
    }

    /* Tablet/Desktop Layout using CSS Grid */
    @media (min-width: 768px) {
      .surface {
        display: grid;
        grid-template-columns: repeat(12, 1fr);
        grid-auto-rows: min-content;
        gap: var(--sp-xl) var(--sp-lg);
        align-items: start;
      }
      .s-header { grid-column: span 12; }
      
      /* Subtle separation for the Atmosphere section on larger screens */
      .s-atmosphere { 
        grid-column: span 12; 
        padding-bottom: var(--sp-lg);
        border-bottom: 1px solid var(--border);
      }
      .s-lights { grid-column: span 7; }
      .s-doors { grid-column: span 5; }
    }

    @media (min-width: 1024px) {
      .s-atmosphere { 
        grid-column: span 4; 
        border-bottom: none;
        border-right: 1px solid var(--border);
        padding-bottom: 0;
        padding-right: var(--sp-lg);
      }
      .s-lights { grid-column: span 4; }
      .s-doors { grid-column: span 4; }
    }

    /* ── Header ─────────────────────────────────────────────────────── */
    .s-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    .s-eyebrow {
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: var(--text-dim);
      margin-bottom: var(--sp-xs);
    }

    .s-greeting {
      font-size: clamp(28px, 4vw, 36px);
      font-weight: 400;
      color: var(--text);
      letter-spacing: -0.02em;
      line-height: 1.1;
    }

    .s-presence {
      display: flex;
      align-items: center;
      gap: var(--sp-sm);
      margin-top: var(--sp-sm);
      font-size: 13px;
      color: var(--text-muted);
    }

    .s-pdot {
      width: 6px; height: 6px;
      border-radius: 50%;
      background: var(--text-dim);
      flex-shrink: 0;
      transition: background 0.4s;
    }
    .s-pdot.home {
      background: var(--text);
      box-shadow: 0 0 8px var(--text-muted);
    }

    .s-time {
      font-size: clamp(36px, 5vw, 48px);
      font-weight: 300;
      color: var(--text);
      letter-spacing: -0.03em;
      line-height: 1;
      font-variant-numeric: tabular-nums;
      text-align: right;
    }

    .s-date {
      font-size: 13px;
      color: var(--text-muted);
      margin-top: var(--sp-sm);
      text-align: right;
    }

    /* ── Atmosphere block (weather + climate) ─────────── */
    .s-atmosphere {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: var(--sp-lg);
    }

    .atm-col {
      display: flex;
      flex-direction: column;
    }

    .atm-kicker {
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: var(--text-dim);
      margin-bottom: var(--sp-sm);
      display: flex;
      align-items: center;
      gap: 6px;
    }
    
    .atm-kicker ha-icon {
      --mdc-icon-size: 14px;
    }

    .atm-temp {
      font-size: clamp(48px, 6vw, 64px);
      font-weight: 200;
      color: var(--text);
      letter-spacing: -0.04em;
      line-height: 1;
      margin: 0 0 var(--sp-sm);
    }

    .atm-condition {
      font-size: 14px;
      font-weight: 400;
      color: var(--text-muted);
      margin-bottom: var(--sp-md);
    }

    .atm-metric {
      font-size: 12px;
      color: var(--text-dim);
      line-height: 1.6;
    }

    /* Climate specific */
    .cl-temps {
      display: flex;
      align-items: baseline;
      gap: var(--sp-sm);
      margin-bottom: var(--sp-xs);
    }

    .cl-current {
      font-size: clamp(40px, 5vw, 56px);
      font-weight: 200;
      color: var(--text);
      letter-spacing: -0.04em;
      line-height: 1;
    }

    .cl-arrow {
      font-size: 18px;
      font-weight: 300;
      color: var(--text-dim);
      margin: 0 2px;
    }

    .cl-target {
      font-size: clamp(28px, 4vw, 36px);
      font-weight: 300;
      color: var(--accent);
      letter-spacing: -0.02em;
      line-height: 1;
    }

    .cl-sublabels {
      display: flex;
      gap: 24px;
      font-size: 11px;
      color: var(--text-dim);
      letter-spacing: 0.05em;
      margin-bottom: var(--sp-md);
      text-transform: uppercase;
    }

    .cl-mode {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      font-weight: 500;
      color: var(--accent);
      margin-top: auto;
    }
    .cl-mode ha-icon {
      --mdc-icon-size: 16px;
    }
    .cl-mode.idle { color: var(--text-dim); }

    /* ── Nav link ────────────────────────────────────────────────────── */
    .nav-link {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      margin-top: var(--sp-md);
      font-size: 13px;
      font-weight: 500;
      color: var(--text-dim);
      cursor: pointer;
      text-decoration: none;
      transition: color 0.2s;
      user-select: none;
    }
    .nav-link:hover { color: var(--text); }
    .nav-link::after { content: '→'; font-size: 14px; }

    /* ── List Sections (Lights, Doors) ──────────────────────────────── */
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: var(--sp-md);
    }

    .section-kicker {
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: var(--text-dim);
    }

    .section-count {
      font-size: 12px;
      color: var(--text-muted);
      transition: color 0.3s;
    }

    .list-container {
      display: flex;
      flex-direction: column;
    }

    /* ── Item Rows (With Separators) ───────────────────────────────── */
    .row {
      display: flex;
      align-items: center;
      gap: var(--sp-md);
      padding: var(--sp-md) 0;
      border-bottom: 1px solid var(--border);
      cursor: pointer;
      transition: background 0.2s, padding 0.2s;
      user-select: none;
    }
    .row:last-child {
      border-bottom: none;
    }
    /* Add horizontal padding on hover to create a highlight effect without permanent boxes */
    .row:hover { 
      background: var(--row-hover); 
      padding-left: var(--sp-sm);
      padding-right: var(--sp-sm);
      margin: 0 calc(var(--sp-sm) * -1);
      border-radius: 8px;
      border-color: transparent;
    }
    .row:active { background: var(--accent-soft); }

    /* Icons */
    .row ha-icon {
      color: var(--text-dim);
      transition: color 0.3s, transform 0.2s;
    }

    /* Light Row */
    .light-row.on ha-icon {
      color: var(--color-light-on);
      transform: scale(1.1);
    }
    .light-row.off ha-icon {
      opacity: 0.5;
    }

    .lr-name {
      font-size: 14px;
      font-weight: 400;
      color: var(--text);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      flex: 0 1 auto;
      min-width: 80px;
      transition: color 0.3s, font-weight 0.3s;
    }
    .light-row.on .lr-name { font-weight: 500; }
    .light-row.off .lr-name { color: var(--text-muted); }

    .lr-bar-wrap { flex: 1; min-width: 20px; display: flex; align-items: center; }

    .lr-bar-track {
      width: 100%;
      height: 2px;
      background: transparent;
      border-radius: 1px;
      overflow: hidden;
    }
    .light-row.on .lr-bar-track { background: var(--border); }

    .lr-bar-fill {
      height: 100%;
      border-radius: 1px;
      background: var(--color-light-on);
      transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .lr-pct {
      font-size: 12px;
      font-weight: 400;
      color: var(--text-dim);
      min-width: 32px;
      text-align: right;
      font-variant-numeric: tabular-nums;
    }
    .light-row.on .lr-pct { color: var(--text); }

    /* Door Row */
    .door-row.open ha-icon {
      color: var(--color-door-open);
      transform: scale(1.1);
    }

    .dr-name {
      font-size: 14px;
      font-weight: 400;
      color: var(--text);
      flex: 1;
      transition: color 0.3s, font-weight 0.3s;
    }
    .door-row.open .dr-name { font-weight: 500; }

    .dr-status {
      font-size: 12px;
      color: var(--text-dim);
      transition: color 0.3s;
      text-transform: lowercase;
    }
    .door-row.open .dr-status { color: var(--color-door-open); font-weight: 500; }
  `;

  // ─── Helpers ──────────────────────────────────────────────────────────────

  const WEATHER_LABELS = {
    'clear-night':'Sereno','cloudy':'Nuvoloso','fog':'Nebbia','hail':'Grandine',
    'lightning':'Temporale','lightning-rainy':'Temporale/Pioggia',
    'partlycloudy':'Parz. nuvoloso','pouring':'Rovescio','rainy':'Pioggia',
    'snowy':'Neve','snowy-rainy':'Neve/Pioggia','sunny':'Soleggiato',
    'windy':'Ventoso','windy-variant':'Molto ventoso',
  };

  const WEATHER_ICONS = {
    'clear-night':'mdi:weather-night', 'cloudy':'mdi:weather-cloudy', 'fog':'mdi:weather-fog', 'hail':'mdi:weather-hail',
    'lightning':'mdi:weather-lightning', 'lightning-rainy':'mdi:weather-lightning-rainy',
    'partlycloudy':'mdi:weather-partly-cloudy', 'pouring':'mdi:weather-pouring', 'rainy':'mdi:weather-rainy',
    'snowy':'mdi:weather-snowy', 'snowy-rainy':'mdi:weather-snowy-rainy', 'sunny':'mdi:weather-sunny',
    'windy':'mdi:weather-windy', 'windy-variant':'mdi:weather-windy-variant',
  };

  function weatherLabel(s) { return WEATHER_LABELS[s] || s || '—'; }
  function weatherIcon(s)  { return WEATHER_ICONS[s] || 'mdi:weather-cloudy'; }

  function bearingToCompass(deg) {
    if (deg == null) return '';
    const d = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSO','SO','OSO','O','ONO','NO','NNO'];
    return d[Math.round(Number(deg) / 22.5) % 16];
  }

  function greeting(name) {
    const h = new Date().getHours();
    const g = h < 12 ? 'Buongiorno' : h < 18 ? 'Buon pomeriggio' : 'Buonasera';
    return name ? `${g}, ${name}` : g;
  }

  function formatDate(location) {
    const d = new Date();
    const mo = ['gen','feb','mar','apr','mag','giu','lug','ago','set','ott','nov','dic'];
    const s = `${d.getDate()} ${mo[d.getMonth()]} ${d.getFullYear()}`;
    return location ? `${s} · ${location}` : s;
  }

  function formatTime() {
    const d = new Date();
    return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
  }

  // ─── Card Class ───────────────────────────────────────────────────────────

  class WeSmartLabsSurface extends HTMLElement {

    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this._config  = {};
      this._hass    = null;
      this._el      = null;   // root div inside shadow
      this._rendered = false;
      this._clockInterval = null;
    }

    setConfig(config) {
      this._config = { color: '#a3a3a3', theme: 'auto', name: '', location: '', ...config };
      this._applyPalette();
      this._render();
    }

    set hass(hass) {
      this._hass = hass;
      if (this._rendered) this._updateState();
    }

    disconnectedCallback() {
      if (this._clockInterval) clearInterval(this._clockInterval);
      if (this._mqHandler) {
        window.matchMedia('(prefers-color-scheme: light)').removeEventListener('change', this._mqHandler);
      }
    }

    getCardSize() { return 10; }

    // ── Color Engine (Professional Monochromatic + Accent) ─────────────────

    _hexToHsl(hex) {
      let r = parseInt(hex.slice(1,3),16)/255;
      let g = parseInt(hex.slice(3,5),16)/255;
      let b = parseInt(hex.slice(5,7),16)/255;
      const max = Math.max(r,g,b), min = Math.min(r,g,b);
      let h, s, l = (max+min)/2;
      if (max === min) { h = s = 0; }
      else {
        const d = max-min;
        s = l > 0.5 ? d/(2-max-min) : d/(max+min);
        switch (max) {
          case r: h = ((g-b)/d + (g<b ? 6:0))/6; break;
          case g: h = ((b-r)/d + 2)/6; break;
          case b: h = ((r-g)/d + 4)/6; break;
        }
      }
      return { h:Math.round(h*360), s:Math.round(s*100), l:Math.round(l*100) };
    }

    _hsl(h,s,l)    { return `hsl(${h},${s}%,${l}%)`; }
    _hsla(h,s,l,a) { return `hsla(${h},${s}%,${l}%,${a})`; }
    _clamp(v,mn,mx){ return Math.min(mx, Math.max(mn, v)); }

    _buildPalette(hex, isDark) {
      const { h, s, l } = this._hexToHsl(hex);
      
      // Professional slate/zinc base palette with the user's accent
      if (isDark) {
        return {
          accent:    this._hsl(h, s, l),
          accentSoft:this._hsla(h, s, l, 0.1),
          bg:        `#121212`, // Deep anthracite
          border:    `rgba(255,255,255,0.08)`,
          text:      `#f3f4f6`,
          textMuted: `#9ca3af`,
          textDim:   `#6b7280`,
          rowHover:  `rgba(255,255,255,0.04)`,
        };
      } else {
        return {
          accent:    this._hsl(h, s, l),
          accentSoft:this._hsla(h, s, l, 0.08),
          bg:        `#fafafa`, // Off-white/pearl
          border:    `rgba(0,0,0,0.08)`,
          text:      `#111827`,
          textMuted: `#4b5563`,
          textDim:   `#9ca3af`,
          rowHover:  `rgba(0,0,0,0.03)`,
        };
      }
    }

    _applyPalette() {
      const isDark = this._config.theme === 'auto'
        ? !window.matchMedia('(prefers-color-scheme: light)').matches
        : this._config.theme !== 'light';
      const p = this._buildPalette(this._config.color, isDark);
      this.style.setProperty('--accent',     p.accent);
      this.style.setProperty('--accent-soft',p.accentSoft);
      this.style.setProperty('--bg',         p.bg);
      this.style.setProperty('--border',     p.border);
      this.style.setProperty('--text',       p.text);
      this.style.setProperty('--text-muted', p.textMuted);
      this.style.setProperty('--text-dim',   p.textDim);
      this.style.setProperty('--row-hover',  p.rowHover);
      if (this._config.theme === 'auto' && !this._mqHandler) {
        this._mqHandler = () => { this._applyPalette(); if (this._el) this._render(); };
        window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', this._mqHandler);
      }
    }

    // ── Render ────────────────────────────────────────────────────────────

    _render() {
      if (this._clockInterval) clearInterval(this._clockInterval);
      const shadow = this.shadowRoot;
      shadow.innerHTML = '';

      const styleEl = document.createElement('style');
      styleEl.textContent = styles;
      shadow.appendChild(styleEl);

      this._el = document.createElement('div');
      this._el.className = 'surface';
      this._el.innerHTML = this._buildHTML();
      shadow.appendChild(this._el);

      this._startClock();
      this._bindEvents();
      this._rendered = true;
      if (this._hass) this._updateState();
    }

    _buildHTML() {
      const cfg    = this._config;
      const lights = cfg.lights || [];
      const doors  = cfg.doors  || [];

      /* ── light rows ── */
      const lightRowsHTML = lights.map((l, i) => `
        <div class="row light-row off" data-light-idx="${i}" id="lr-${i}">
          <ha-icon icon="${l.icon || 'mdi:lightbulb-outline'}" id="lr-icon-${i}"></ha-icon>
          <div class="lr-name">${l.name || l.entity}</div>
          <div class="lr-bar-wrap">
            <div class="lr-bar-track" id="lr-track-${i}">
              <div class="lr-bar-fill" id="lr-bar-${i}" style="width:0%"></div>
            </div>
          </div>
          <div class="lr-pct" id="lr-pct-${i}"></div>
        </div>
      `).join('');

      /* ── door rows ── */
      const doorRowsHTML = doors.map((d, i) => `
        <div class="row door-row" id="dr-${i}">
          <ha-icon icon="${d.icon || 'mdi:door-closed'}" id="dr-icon-${i}"></ha-icon>
          <div class="dr-name">${d.name || d.entity}</div>
          <div class="dr-status" id="dr-status-${i}">—</div>
        </div>
      `).join('');

      /* ── nav links ── */
      const wNav  = cfg.weather?.details_link  ? `<a class="nav-link" data-nav="${cfg.weather.details_link}">Previsioni</a>`    : '';
      const lNav  = cfg.lights?.details_link   ? `<a class="nav-link" data-nav="${cfg.lights.details_link}">Tutte le luci</a>` : '';
      const dNav  = cfg.doors?.details_link    ? `<a class="nav-link" data-nav="${cfg.doors.details_link}">Sicurezza</a>`      : '';

      const hasW  = !!cfg.weather?.entity;
      const hasCl = !!cfg.climate?.entity;
      const hasL  = lights.length > 0;
      const hasD  = doors.length  > 0;

      return `
        <!-- ────── Header ────── -->
        <header class="s-header">
          <div>
            <div class="s-eyebrow">Dashboard</div>
            <div class="s-greeting" id="s-greeting">${greeting(cfg.name)}</div>
            <div class="s-presence">
              <span class="s-pdot" id="s-pdot"></span>
              <span id="s-ploc">—</span>
            </div>
          </div>
          <div>
            <div class="s-time" id="s-time">${formatTime()}</div>
            <div class="s-date" id="s-date">${formatDate(cfg.location)}</div>
          </div>
        </header>

        <!-- ────── Weather + Climate ────── -->
        ${(hasW || hasCl) ? `
        <div class="s-atmosphere">

          ${hasW ? `
          <div class="atm-col">
            <div class="atm-kicker">
              <ha-icon icon="mdi:weather-partly-cloudy" id="w-icon"></ha-icon>
              Meteo
            </div>
            <div class="atm-temp" id="w-temp">—</div>
            <div class="atm-condition" id="w-cond">—</div>
            <div class="atm-metric" id="w-m1" style="display:none">—</div>
            <div class="atm-metric" id="w-m2" style="display:none">—</div>
            ${wNav}
          </div>
          ` : ''}

          ${hasCl ? `
          <div class="atm-col">
            <div class="atm-kicker">
              <ha-icon icon="mdi:thermostat"></ha-icon>
              ${cfg.climate?.name || 'Clima'}
            </div>
            <div class="cl-temps">
              <div class="cl-current" id="cl-current">—</div>
              <div class="cl-arrow">→</div>
              <div class="cl-target"  id="cl-target">—</div>
            </div>
            <div class="cl-sublabels"><span>Attuale</span><span>Target</span></div>
            <div class="cl-mode" id="cl-mode" style="display:none">
              <ha-icon icon="mdi:power" id="cl-mode-icon"></ha-icon>
              <span id="cl-mode-text">—</span>
            </div>
          </div>
          ` : ''}

        </div>
        ` : ''}

        <!-- ────── Lights ────── -->
        ${hasL ? `
        <div class="s-lights">
          <div class="section-header">
            <span class="section-kicker">Illuminazione</span>
            <span class="section-count" id="lights-count"></span>
          </div>
          <div class="list-container">
            ${lightRowsHTML}
          </div>
          ${lNav}
        </div>
        ` : ''}

        <!-- ────── Doors ────── -->
        ${hasD ? `
        <div class="s-doors">
          <div class="section-header">
            <span class="section-kicker">Accessi</span>
            <span class="section-count" id="doors-count"></span>
          </div>
          <div class="list-container">
            ${doorRowsHTML}
          </div>
          ${dNav}
        </div>
        ` : ''}
      `;
    }

    // ── Clock ─────────────────────────────────────────────────────────────

    _startClock() {
      const tick = () => {
        const t = this._q('#s-time');    if (t) t.textContent = formatTime();
        const g = this._q('#s-greeting'); if (g) g.textContent = greeting(this._config.name);
        const d = this._q('#s-date');    if (d) d.textContent = formatDate(this._config.location);
      };
      tick();
      this._clockInterval = setInterval(tick, 30000);
    }

    // ── State Updates ─────────────────────────────────────────────────────

    _q(sel) { return this._el ? this._el.querySelector(sel) : null; }

    _updateState() {
      if (!this._hass || !this._el) return;
      this._updatePresence();
      this._updateWeather();
      this._updateClimate();
      this._updateLights();
      this._updateDoors();
    }

    _updatePresence() {
      const eid = this._config.presence?.entity;
      if (!eid || !this._hass.states[eid]) return;
      const isHome = this._hass.states[eid].state === 'home';
      const dot = this._q('#s-pdot');
      const loc = this._q('#s-ploc');
      if (dot) dot.className = `s-pdot ${isHome ? 'home' : 'away'}`;
      if (loc) {
        const zone = this._config.presence?.zone?.replace('zone.', '') || '';
        loc.textContent = isHome ? (zone || 'In casa') : 'Fuori';
      }
    }

    _updateWeather() {
      const eid = this._config.weather?.entity;
      if (!eid || !this._hass.states[eid]) return;
      const s = this._hass.states[eid];
      const a = s.attributes || {};

      const iconEl = this._q('#w-icon');
      if (iconEl) iconEl.setAttribute('icon', weatherIcon(s.state));

      const tempEl = this._q('#w-temp');
      if (tempEl) tempEl.textContent = a.temperature != null ? `${a.temperature}°` : '—';

      const condEl = this._q('#w-cond');
      if (condEl) {
        const hum = a.humidity != null ? ` · ${a.humidity}% umidità` : '';
        condEl.textContent = `${weatherLabel(s.state)}${hum}`;
      }

      const m1 = this._q('#w-m1');
      if (m1 && a.wind_speed != null) {
        const dir = bearingToCompass(a.wind_bearing);
        const uv  = a.uv_index  != null ? ` · UV ${a.uv_index}`  : '';
        const pr  = a.pressure  != null ? ` · ${a.pressure} hPa` : '';
        m1.style.display = '';
        m1.textContent = `Vento ${dir} ${a.wind_speed} km/h${uv}${pr}`;
      }

      const m2 = this._q('#w-m2');
      if (m2 && (a.dew_point != null || a.cloud_coverage != null)) {
        const dp = a.dew_point      != null ? `Rugiada ${a.dew_point}°` : '';
        const cc = a.cloud_coverage != null ? `${dp ? ' · ' : ''}Copertura ${a.cloud_coverage}%` : '';
        m2.style.display = '';
        m2.textContent = `${dp}${cc}`;
      }
    }

    _updateClimate() {
      const eid = this._config.climate?.entity;
      if (!eid || !this._hass.states[eid]) return;
      const s = this._hass.states[eid];
      const a = s.attributes || {};

      const cur = this._q('#cl-current');
      if (cur) cur.textContent = a.current_temperature != null ? `${a.current_temperature}°` : '—';

      const tgt = this._q('#cl-target');
      if (tgt) tgt.textContent = a.temperature != null ? `${a.temperature}°` : '—';

      const mode    = this._q('#cl-mode');
      const modeTxt = this._q('#cl-mode-text');
      const modeIco = this._q('#cl-mode-icon');
      if (mode && a.hvac_action) {
        const idle = a.hvac_action === 'idle' || a.hvac_action === 'off';
        mode.style.display = '';
        mode.className = idle ? 'cl-mode idle' : 'cl-mode';
        
        const MAP_TXT = { heating:'Riscaldamento', cooling:'Raffreddamento', idle:'Attesa', fan:'Ventilazione', off:'Spento' };
        if (modeTxt) modeTxt.textContent = MAP_TXT[a.hvac_action] || a.hvac_action;

        const MAP_ICO = { heating:'mdi:fire', cooling:'mdi:snowflake', idle:'mdi:sleep', fan:'mdi:fan', off:'mdi:power' };
        if (modeIco) modeIco.setAttribute('icon', MAP_ICO[a.hvac_action] || 'mdi:thermostat');
      }
    }

    _updateLights() {
      const lights = this._config.lights || [];
      let on = 0;

      lights.forEach((lCfg, i) => {
        const s = this._hass.states[lCfg.entity];
        if (!s) return;
        const a    = s.attributes || {};
        const isOn = s.state === 'on';
        if (isOn) on++;

        const row   = this._q(`#lr-${i}`);
        const icon  = this._q(`#lr-icon-${i}`);
        const bar   = this._q(`#lr-bar-${i}`);
        const pct   = this._q(`#lr-pct-${i}`);

        if (row) row.className = `row light-row${isOn ? ' on' : ' off'}`;
        
        // Update icon based on state (can use provided on/off icons or default MDI)
        if (icon) {
          if (isOn) {
            icon.setAttribute('icon', lCfg.icon_on || lCfg.icon || 'mdi:lightbulb-on');
          } else {
            icon.setAttribute('icon', lCfg.icon_off || lCfg.icon || 'mdi:lightbulb-outline');
          }
        }

        if (isOn && a.brightness != null) {
          const p = Math.round(a.brightness / 255 * 100);
          if (bar) bar.style.width = `${p}%`;
          if (pct) pct.textContent = `${p}%`;
        } else {
          if (bar) bar.style.width = `0%`;
          if (pct) pct.textContent = '';
        }
      });

      const countEl = this._q('#lights-count');
      if (countEl) {
        countEl.textContent = on > 0 ? `${on} attiv${on > 1 ? 'e' : 'a'}` : 'Spente';
        countEl.style.color = on > 0 ? 'var(--text)' : '';
      }
    }

    _updateDoors() {
      const doors = this._config.doors || [];
      let openCount = 0;

      doors.forEach((dCfg, i) => {
        const s = this._hass.states[dCfg.entity];
        if (!s) return;
        const isOpen = s.state === 'on' || s.state === 'open';
        if (isOpen) openCount++;

        const row    = this._q(`#dr-${i}`);
        const icon   = this._q(`#dr-icon-${i}`);
        const status = this._q(`#dr-status-${i}`);

        if (row) row.className = `row door-row${isOpen ? ' open' : ''}`;
        
        if (icon) {
          if (isOpen) {
            icon.setAttribute('icon', dCfg.icon_open || dCfg.icon || 'mdi:door-open');
          } else {
            icon.setAttribute('icon', dCfg.icon_closed || dCfg.icon || 'mdi:door-closed');
          }
        }

        if (status) status.textContent = isOpen ? 'Aperto' : 'Chiuso';
      });

      const countEl = this._q('#doors-count');
      if (countEl) {
        countEl.textContent = openCount > 0 ? `${openCount} apert${openCount > 1 ? 'e' : 'a'}` : 'Tutte chiuse';
        countEl.style.color = openCount > 0 ? 'var(--color-door-open)' : '';
      }
    }

    // ── Events ────────────────────────────────────────────────────────────

    _bindEvents() {
      this._el.addEventListener('click', e => {
        // Light toggle
        const lr = e.target.closest('.light-row');
        if (lr && this._hass) {
          const idx  = parseInt(lr.dataset.lightIdx, 10);
          const lCfg = (this._config.lights || [])[idx];
          if (lCfg) this._hass.callService('homeassistant', 'toggle', { entity_id: lCfg.entity });
          return;
        }
        // Navigation
        const nav = e.target.closest('[data-nav]');
        if (nav) {
          e.preventDefault();
          const path = nav.getAttribute('data-nav');
          if (path) {
            history.pushState(null, '', path);
            window.dispatchEvent(new CustomEvent('location-changed', {
              bubbles: true, composed: true, detail: { replace: false },
            }));
          }
        }
      });
    }

    static getStubConfig() {
      return {
        color:    '#a3a3a3', // Neutral elegant accent
        theme:    'auto',
        name:     'Massimo',
        location: 'Sora',
        weather:  { entity: 'weather.forecast_home', details_link: '/lovelace/meteo' },
        presence: { entity: 'person.massimo', zone: 'zone.home' },
        climate:  { entity: 'climate.aqara_trv_e1', name: 'Clima' },
        lights: [
          { entity: 'light.cucina_parete_yeelight', name: 'Cucina', icon: 'mdi:ceiling-light' },
          { entity: 'light.camera_da_letto',        name: 'Camera', icon: 'mdi:lamp' },
          { entity: 'light.cortesia_rientro',       name: 'Cortesia', icon: 'mdi:lightbulb-group' },
        ],
        doors: [
          { entity: 'binary_sensor.portone',         name: 'Ingresso', icon: 'mdi:door' },
          { entity: 'binary_sensor.finestra_cucina', name: 'Finestra cucina', icon: 'mdi:window-closed' },
        ],
      };
    }
  }

  customElements.define('wesmart-labs-surface', WeSmartLabsSurface);

  window.customCards = window.customCards || [];
  window.customCards.push({
    type:        'wesmart-labs-surface',
    name:        'WeSmart Labs — Surface',
    description: '[LABS] Professional cardless dashboard. Optimized for tablet, structured.',
    preview:     false,
  });

})();
