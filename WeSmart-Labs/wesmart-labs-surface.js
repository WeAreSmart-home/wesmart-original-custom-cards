/**
 * WeSmart Labs — Surface
 * Cardless dashboard. No containers — content lives directly on the surface.
 * Hierarchy through space, scale, and color. Zero borders, zero boxes.
 *
 * STATUS: EXPERIMENTAL
 * YAML tag: wesmart-labs-surface
 *
 * @version 0.1.0
 */
(() => {

  // ─── Styles ───────────────────────────────────────────────────────────────
  const styles = `
    :host {
      display: block;
      font-family: -apple-system, 'Inter', BlinkMacSystemFont, 'Söhne', sans-serif;
      -webkit-font-smoothing: antialiased;
    }

    /* ── Surface (no card, no shadow, no border) ────────────────────── */
    .surface {
      background: var(--bg);
      min-height: 100%;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
    }

    /* ── Header ─────────────────────────────────────────────────────── */
    .s-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 32px 28px 26px;
    }

    .s-eyebrow {
      font-size: 10px;
      font-weight: 600;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--text-dim);
      margin-bottom: 7px;
    }

    .s-greeting {
      font-size: 30px;
      font-weight: 500;
      color: var(--text);
      letter-spacing: -0.015em;
      line-height: 1.1;
    }

    .s-presence {
      display: flex;
      align-items: center;
      gap: 7px;
      margin-top: 8px;
      font-size: 12px;
      color: var(--text-muted);
    }

    .s-pdot {
      width: 7px; height: 7px;
      border-radius: 50%;
      background: var(--text-dim);
      flex-shrink: 0;
      transition: background 0.4s;
    }
    .s-pdot.home {
      background: #5aad6f;
      animation: pulse-home 3.5s ease-in-out infinite;
    }
    .s-pdot.away { background: var(--text-dim); }

    @keyframes pulse-home {
      0%, 100% { opacity: 1; }
      50%       { opacity: 0.4; }
    }

    .s-time {
      font-size: 42px;
      font-weight: 200;
      color: var(--text);
      letter-spacing: -0.04em;
      line-height: 1;
      font-variant-numeric: tabular-nums;
      text-align: right;
    }

    .s-date {
      font-size: 12px;
      color: var(--text-muted);
      margin-top: 6px;
      text-align: right;
    }

    /* ── Accent rule — the only decoration ──────────────────────────── */
    .accent-rule {
      height: 1px;
      margin: 0 28px;
      background: linear-gradient(to right, var(--accent) 0%, transparent 65%);
      opacity: 0.45;
    }

    /* ── Thin separator between sections ───────────────────────────── */
    .sep {
      height: 1px;
      margin: 0 28px;
      background: var(--border);
    }

    /* ── Atmosphere block (weather + climate, side by side) ─────────── */
    .s-atmosphere {
      display: grid;
      grid-template-columns: 1fr 1fr;
      padding: 0;
    }

    .atm-col {
      padding: 26px 28px;
    }
    .atm-col + .atm-col {
      border-left: 1px solid var(--border);
    }

    .atm-kicker {
      font-size: 10px;
      font-weight: 600;
      letter-spacing: 0.10em;
      text-transform: uppercase;
      color: var(--text-dim);
      margin-bottom: 4px;
    }

    .atm-temp {
      font-size: 58px;
      font-weight: 200;
      color: var(--text);
      letter-spacing: -0.045em;
      line-height: 0.95;
      margin: 2px 0 10px;
    }

    .atm-condition {
      font-size: 13px;
      font-weight: 400;
      color: var(--text-muted);
      margin-bottom: 12px;
    }

    .atm-metric {
      font-size: 11px;
      color: var(--text-dim);
      line-height: 1.7;
    }

    .atm-internal {
      margin-top: 16px;
      padding-top: 16px;
      border-top: 1px solid var(--border);
      display: flex;
      align-items: baseline;
      gap: 8px;
    }

    .atm-int-val   { font-size: 22px; font-weight: 300; color: var(--text); letter-spacing: -0.02em; }
    .atm-int-label { font-size: 11px; color: var(--text-dim); }

    /* Climate column */
    .cl-temps {
      display: flex;
      align-items: baseline;
      gap: 8px;
      margin: 4px 0 6px;
    }

    .cl-current {
      font-size: 52px;
      font-weight: 200;
      color: var(--text);
      letter-spacing: -0.04em;
      line-height: 0.95;
    }

    .cl-arrow {
      font-size: 18px;
      font-weight: 300;
      color: var(--text-dim);
      margin: 0 2px;
    }

    .cl-target {
      font-size: 34px;
      font-weight: 300;
      color: var(--accent);
      letter-spacing: -0.025em;
      line-height: 0.95;
    }

    .cl-sublabels {
      display: flex;
      gap: 18px;
      font-size: 10px;
      color: var(--text-dim);
      letter-spacing: 0.04em;
      margin-bottom: 14px;
    }

    .cl-mode {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      font-weight: 500;
      color: var(--accent);
    }
    .cl-mode-dot {
      width: 6px; height: 6px;
      border-radius: 50%;
      background: var(--accent);
    }
    .cl-mode.idle { color: var(--text-dim); }
    .cl-mode.idle .cl-mode-dot { background: var(--text-dim); }

    /* ── Nav link ────────────────────────────────────────────────────── */
    .nav-link {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      margin-top: 16px;
      font-size: 12px;
      font-weight: 500;
      color: var(--text-dim);
      cursor: pointer;
      text-decoration: none;
      transition: color 0.15s;
      user-select: none;
    }
    .nav-link:hover { color: var(--accent); }
    .nav-link::after { content: ' ↗'; }

    /* ── Lights section ─────────────────────────────────────────────── */
    .s-lights { padding: 24px 28px; }

    .section-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }

    .section-kicker {
      font-size: 10px;
      font-weight: 600;
      letter-spacing: 0.10em;
      text-transform: uppercase;
      color: var(--text-dim);
    }

    .section-count {
      font-size: 11px;
      color: var(--text-muted);
      transition: color 0.3s;
    }

    /* Light rows bleed to panel edges on hover — the key "no card" effect */
    .light-row {
      display: flex;
      align-items: center;
      gap: 13px;
      padding: 13px 28px;
      margin: 0 -28px;
      cursor: pointer;
      border-bottom: 1px solid var(--border);
      transition: background 0.12s;
    }
    .light-row:last-of-type { border-bottom: none; }
    .light-row:hover        { background: var(--row-hover); }
    .light-row:active       { background: var(--accent-soft); }

    .lr-dot {
      width: 8px; height: 8px;
      border-radius: 50%;
      background: var(--accent);
      flex-shrink: 0;
      transition: background 0.25s, opacity 0.25s;
    }
    .lr-dot.off { background: var(--text-dim); opacity: 0.35; }

    .lr-name {
      font-size: 13px;
      font-weight: 500;
      color: var(--text);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      min-width: 90px;
      max-width: 175px;
      transition: color 0.2s;
    }
    .light-row.off .lr-name { color: var(--text-muted); }

    /* Full-stretch bar — grows to fill all remaining space */
    .lr-bar-wrap { flex: 1; min-width: 0; }

    .lr-bar-track {
      height: 2px;
      background: var(--border);
      border-radius: 1px;
      overflow: hidden;
    }

    .lr-bar-fill {
      height: 100%;
      border-radius: 1px;
      background: var(--accent);
      transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .lr-pct {
      font-size: 11px;
      font-weight: 500;
      color: var(--text-dim);
      min-width: 28px;
      text-align: right;
      font-variant-numeric: tabular-nums;
    }

    /* Tiny color-temp dot — warm orange to cool blue */
    .lr-kt {
      width: 8px; height: 8px;
      border-radius: 50%;
      flex-shrink: 0;
      transition: background 0.4s;
    }

    /* ── Doors section ──────────────────────────────────────────────── */
    .s-doors { padding: 24px 28px; }

    .door-row {
      display: flex;
      align-items: center;
      gap: 11px;
      padding: 12px 0;
      border-bottom: 1px solid var(--border);
      transition: opacity 0.2s;
    }
    .door-row:last-child { border-bottom: none; }

    .dr-dot {
      width: 7px; height: 7px;
      border-radius: 50%;
      background: #5aad6f;
      flex-shrink: 0;
      transition: background 0.3s;
    }
    .dr-dot.open { background: #e57363; }

    .dr-name {
      font-size: 13px;
      font-weight: 500;
      color: var(--text);
      flex: 1;
    }

    .dr-status {
      font-size: 11px;
      color: var(--text-dim);
      transition: color 0.3s;
    }
    .door-row.open .dr-status { color: #e57363; font-weight: 500; }
  `;

  // ─── Helpers ──────────────────────────────────────────────────────────────

  const WEATHER_LABELS = {
    'clear-night':'Cielo sereno','cloudy':'Nuvoloso','fog':'Nebbia','hail':'Grandine',
    'lightning':'Temporale','lightning-rainy':'Temporale con pioggia',
    'partlycloudy':'Parz. nuvoloso','pouring':'Pioggia intensa','rainy':'Pioggia',
    'snowy':'Neve','snowy-rainy':'Misto neve/pioggia','sunny':'Soleggiato',
    'windy':'Ventoso','windy-variant':'Molto ventoso',
  };

  function weatherLabel(s) { return WEATHER_LABELS[s] || s || '—'; }

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

  // Color temperature → a small spectrum dot color
  function ktColor(kelvin) {
    const k = Number(kelvin);
    if (k < 2500) return '#C8712A';
    if (k < 3200) return '#D4943A';
    if (k < 4200) return '#C2A255';
    if (k < 5500) return '#8899AA';
    return '#6688CC';
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
      this._config = { color: '#D97757', theme: 'auto', name: '', location: '', ...config };
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

    // ── Color Engine ──────────────────────────────────────────────────────

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
      const c = this._clamp.bind(this);
      if (isDark) {
        const aL = c(l, 50, 65);
        return {
          accent:    this._hsl(h, s, aL),
          accentSoft:this._hsla(h, s, aL, 0.09),
          bg:        this._hsl(h, c(Math.round(s*0.35),25,45), 10),
          border:    `hsla(0,0%,100%,0.07)`,
          text:      this._hsl(h, c(Math.round(s*0.08),5,10), 93),
          textMuted: this._hsl(h, c(Math.round(s*0.12),8,15), 62),
          textDim:   this._hsl(h, c(Math.round(s*0.10),6,12), 38),
          rowHover:  `hsla(0,0%,100%,0.03)`,
        };
      } else {
        const aL = c(l, 35, 52);
        return {
          accent:    this._hsl(h, s, aL),
          accentSoft:this._hsla(h, s, aL, 0.07),
          bg:        this._hsl(h, c(Math.round(s*0.05),3,6), 98),
          border:    this._hsla(h, c(Math.round(s*0.12),8,16), 20, 0.08),
          text:      this._hsl(h, c(Math.round(s*0.25),18,35), 12),
          textMuted: this._hsl(h, c(Math.round(s*0.18),12,24), 42),
          textDim:   this._hsl(h, c(Math.round(s*0.12),8,16), 60),
          rowHover:  this._hsla(h, c(Math.round(s*0.12),8,16), 20, 0.03),
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
        <div class="light-row off" data-light-idx="${i}" id="lr-${i}">
          <div class="lr-dot off" id="lr-dot-${i}"></div>
          <div class="lr-name">${l.name || l.entity}</div>
          <div class="lr-bar-wrap">
            <div class="lr-bar-track" id="lr-track-${i}" style="display:none">
              <div class="lr-bar-fill" id="lr-bar-${i}" style="width:0%"></div>
            </div>
          </div>
          <div class="lr-pct" id="lr-pct-${i}"></div>
          <div class="lr-kt" id="lr-kt-${i}" style="display:none"></div>
        </div>
      `).join('');

      /* ── door rows ── */
      const doorRowsHTML = doors.map((d, i) => `
        <div class="door-row" id="dr-${i}">
          <div class="dr-dot" id="dr-dot-${i}"></div>
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
            <div class="s-eyebrow">HOME</div>
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

        <!-- one thin accent line, the only decoration -->
        <div class="accent-rule"></div>

        <!-- ────── Weather + Climate ────── -->
        ${(hasW || hasCl) ? `
        <div class="s-atmosphere">

          ${hasW ? `
          <div class="atm-col">
            <div class="atm-kicker">METEO</div>
            <div class="atm-temp" id="w-temp">—</div>
            <div class="atm-condition" id="w-cond">—</div>
            <div class="atm-metric" id="w-m1" style="display:none">—</div>
            <div class="atm-metric" id="w-m2" style="display:none">—</div>
            ${cfg.weather?.internal_sensor ? `
            <div class="atm-internal" id="w-internal" style="display:none">
              <div class="atm-int-val" id="w-int-val">—</div>
              <div class="atm-int-label" id="w-int-label">interno</div>
            </div>` : ''}
            ${wNav}
          </div>
          ` : '<div></div>'}

          ${hasCl ? `
          <div class="atm-col">
            <div class="atm-kicker">${cfg.climate?.name || 'CLIMA'}</div>
            <div class="cl-temps">
              <div class="cl-current" id="cl-current">—</div>
              <div class="cl-arrow">→</div>
              <div class="cl-target"  id="cl-target">—</div>
            </div>
            <div class="cl-sublabels"><span>attuale</span><span>target</span></div>
            <div class="cl-mode" id="cl-mode" style="display:none">
              <div class="cl-mode-dot"></div>
              <span id="cl-mode-text">—</span>
            </div>
          </div>
          ` : '<div></div>'}

        </div>
        ` : ''}

        <!-- ────── Lights ────── -->
        ${hasL ? `
        <div class="sep"></div>
        <div class="s-lights">
          <div class="section-row">
            <span class="section-kicker">LUCI</span>
            <span class="section-count" id="lights-count"></span>
          </div>
          ${lightRowsHTML}
          ${lNav}
        </div>
        ` : ''}

        <!-- ────── Doors ────── -->
        ${hasD ? `
        <div class="sep"></div>
        <div class="s-doors">
          <div class="section-row">
            <span class="section-kicker">PORTE & INGRESSI</span>
            <span class="section-count" id="doors-count"></span>
          </div>
          ${doorRowsHTML}
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
        loc.textContent = isHome ? (zone || 'In casa') : 'Fuori casa';
      }
    }

    _updateWeather() {
      const eid = this._config.weather?.entity;
      if (!eid || !this._hass.states[eid]) return;
      const s = this._hass.states[eid];
      const a = s.attributes || {};

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

      const intEid = this._config.weather?.internal_sensor;
      if (intEid && this._hass.states[intEid]) {
        const iS   = this._hass.states[intEid];
        const unit = iS.attributes?.unit_of_measurement || '°';
        const blk  = this._q('#w-internal');
        const val  = this._q('#w-int-val');
        const lbl  = this._q('#w-int-label');
        if (blk) blk.style.display = '';
        if (val) val.textContent = `${parseFloat(iS.state).toFixed(1)}${unit}`;
        if (lbl) lbl.textContent = iS.attributes?.friendly_name || 'interno';
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
      if (mode && a.hvac_action) {
        const idle = a.hvac_action === 'idle' || a.hvac_action === 'off';
        mode.style.display = '';
        mode.className = idle ? 'cl-mode idle' : 'cl-mode';
        const MAP = { heating:'Riscaldamento', cooling:'Raffreddamento', idle:'In attesa', fan:'Ventilazione', off:'Spento' };
        if (modeTxt) modeTxt.textContent = MAP[a.hvac_action] || a.hvac_action;
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
        const dot   = this._q(`#lr-dot-${i}`);
        const track = this._q(`#lr-track-${i}`);
        const bar   = this._q(`#lr-bar-${i}`);
        const pct   = this._q(`#lr-pct-${i}`);
        const kt    = this._q(`#lr-kt-${i}`);

        if (row) row.className = `light-row${isOn ? '' : ' off'}`;
        if (dot) dot.className = `lr-dot${isOn ? '' : ' off'}`;

        if (isOn && a.brightness != null) {
          const p = Math.round(a.brightness / 255 * 100);
          if (track) track.style.display = '';
          if (bar)   bar.style.width     = `${p}%`;
          if (pct)   pct.textContent     = `${p}%`;
        } else {
          if (track) track.style.display = 'none';
          if (pct)   pct.textContent     = '';
        }

        if (isOn && a.color_temp_kelvin) {
          if (kt) { kt.style.display = ''; kt.style.background = ktColor(a.color_temp_kelvin); }
        } else {
          if (kt) kt.style.display = 'none';
        }
      });

      const countEl = this._q('#lights-count');
      if (countEl) {
        countEl.textContent = on > 0 ? `${on} acces${on > 1 ? 'e' : 'a'}` : 'Tutte spente';
        countEl.style.color = on > 0 ? 'var(--accent)' : '';
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
        const dot    = this._q(`#dr-dot-${i}`);
        const status = this._q(`#dr-status-${i}`);

        if (row)    row.className    = `door-row${isOpen ? ' open' : ''}`;
        if (dot)    dot.className    = `dr-dot${isOpen ? ' open' : ''}`;
        if (status) status.textContent = isOpen ? 'Aperto' : 'Chiuso';
      });

      const countEl = this._q('#doors-count');
      if (countEl) {
        countEl.textContent = openCount > 0 ? `${openCount} apert${openCount > 1 ? 'e' : 'a'}` : '';
        countEl.style.color = openCount > 0 ? '#e57363' : '';
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
        color:    '#D97757',
        theme:    'auto',
        name:     'Massimo',
        location: 'Sora',
        weather:  { entity: 'weather.forecast_home', internal_sensor: 'sensor.temperature_home', details_link: '/lovelace/meteo' },
        presence: { entity: 'person.massimo', zone: 'zone.home' },
        climate:  { entity: 'climate.aqara_trv_e1', name: 'CLIMA' },
        lights: [
          { entity: 'light.cucina_parete_yeelight', name: 'Cucina — Yeelight' },
          { entity: 'light.camera_da_letto',        name: 'Camera da letto' },
          { entity: 'light.cortesia_rientro',       name: 'Cortesia Rientro' },
        ],
        doors: [
          { entity: 'binary_sensor.portone',         name: "Portone d'ingresso" },
          { entity: 'binary_sensor.finestra_cucina', name: 'Finestra cucina' },
        ],
      };
    }
  }

  customElements.define('wesmart-labs-surface', WeSmartLabsSurface);

  window.customCards = window.customCards || [];
  window.customCards.push({
    type:        'wesmart-labs-surface',
    name:        'WeSmart Labs — Surface',
    description: '[LABS] Cardless dashboard. No containers — content lives directly on the surface.',
    preview:     false,
  });

})();
