/**
 * WeSmart Labs — Clean Panel
 * Modern home overview: weather, climate, lights, doors.
 * Design inspired by Anthropic / Claude AI light aesthetic.
 *
 * STATUS: EXPERIMENTAL
 * YAML tag: wesmart-labs-clean-panel
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

    /* ── Panel shell ────────────────────────────────────────────────── */
    .panel {
      background: var(--bg);
      padding: 24px 20px 20px;
      display: flex;
      flex-direction: column;
      gap: 14px;
      min-height: 100%;
      box-sizing: border-box;
    }

    /* ── Cards ──────────────────────────────────────────────────────── */
    .card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 20px;
      padding: 20px;
      box-sizing: border-box;
      box-shadow: 0 1px 3px var(--shadow-sm), 0 4px 16px var(--shadow-md);
    }

    /* ── Header ─────────────────────────────────────────────────────── */
    .ph {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 0 4px 6px;
    }

    .ph-eyebrow {
      font-size: 10px;
      font-weight: 600;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--text-dim);
      margin-bottom: 5px;
    }

    .ph-greeting {
      font-size: 26px;
      font-weight: 500;
      color: var(--text);
      line-height: 1.1;
      letter-spacing: -0.01em;
    }

    .ph-presence {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-top: 6px;
      font-size: 12px;
      color: var(--text-muted);
    }

    .ph-dot {
      width: 7px; height: 7px;
      border-radius: 50%;
      background: #5aad6f;
      flex-shrink: 0;
    }
    .ph-dot.away { background: var(--text-dim); }

    .ph-right {
      text-align: right;
      flex-shrink: 0;
      padding-top: 2px;
    }

    .ph-time {
      font-size: 34px;
      font-weight: 300;
      color: var(--text);
      letter-spacing: -0.02em;
      line-height: 1;
      font-variant-numeric: tabular-nums;
    }

    .ph-date {
      font-size: 12px;
      color: var(--text-muted);
      margin-top: 4px;
      text-align: right;
    }

    /* ── Two-column grid ────────────────────────────────────────────── */
    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px;
    }

    /* ── Section headers ────────────────────────────────────────────── */
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }

    .section-label {
      font-size: 10px;
      font-weight: 600;
      letter-spacing: 0.10em;
      text-transform: uppercase;
      color: var(--text-dim);
    }

    .section-count {
      font-size: 11px;
      font-weight: 500;
      color: var(--text-muted);
    }

    /* ── Detail link ────────────────────────────────────────────────── */
    .detail-link {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 4px;
      margin-top: 14px;
      padding-top: 14px;
      border-top: 1px solid var(--border);
      font-size: 12px;
      font-weight: 500;
      color: var(--text-muted);
      cursor: pointer;
      text-decoration: none;
      transition: color 0.15s;
      user-select: none;
    }
    .detail-link:hover { color: var(--accent); }
    .detail-link::after { content: '→'; font-size: 13px; }

    /* ── Weather card ───────────────────────────────────────────────── */
    .w-temp {
      font-size: 52px;
      font-weight: 300;
      color: var(--text);
      letter-spacing: -0.03em;
      line-height: 1;
      margin: 4px 0 6px;
    }

    .w-condition {
      font-size: 13px;
      color: var(--text-muted);
      margin-bottom: 10px;
      font-weight: 400;
    }

    .w-metrics {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .w-metric {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      color: var(--text-muted);
    }

    .w-metric-icon {
      width: 14px;
      height: 14px;
      opacity: 0.5;
      flex-shrink: 0;
    }

    .w-internal {
      margin-top: 14px;
      padding-top: 14px;
      border-top: 1px solid var(--border);
      display: flex;
      align-items: baseline;
      gap: 8px;
    }

    .w-internal-val {
      font-size: 22px;
      font-weight: 300;
      color: var(--text);
      letter-spacing: -0.01em;
    }

    .w-internal-label {
      font-size: 11px;
      color: var(--text-dim);
    }

    /* ── Climate card ───────────────────────────────────────────────── */
    .cl-temps {
      display: flex;
      align-items: baseline;
      gap: 10px;
      margin: 6px 0 10px;
    }

    .cl-current {
      font-size: 46px;
      font-weight: 300;
      color: var(--text);
      letter-spacing: -0.03em;
      line-height: 1;
    }

    .cl-sep {
      font-size: 18px;
      color: var(--text-dim);
      font-weight: 300;
    }

    .cl-target {
      font-size: 32px;
      font-weight: 300;
      color: var(--accent);
      letter-spacing: -0.02em;
      line-height: 1;
    }

    .cl-labels {
      display: flex;
      gap: 20px;
      font-size: 10px;
      color: var(--text-dim);
      letter-spacing: 0.03em;
      margin-bottom: 12px;
    }

    .cl-mode {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      font-size: 11px;
      font-weight: 500;
      color: var(--accent);
      background: var(--accent-soft);
      border: 1px solid var(--accent-border);
      border-radius: 20px;
      padding: 4px 10px;
    }

    .cl-mode-dot {
      width: 6px; height: 6px;
      border-radius: 50%;
      background: var(--accent);
    }

    .cl-idle {
      color: var(--text-dim);
      background: transparent;
      border-color: var(--border);
    }
    .cl-idle .cl-mode-dot { background: var(--text-dim); }

    /* ── Lights card ────────────────────────────────────────────────── */
    .light-row {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 0;
      border-bottom: 1px solid var(--border);
      cursor: pointer;
      transition: opacity 0.15s;
    }
    .light-row:last-of-type { border-bottom: none; }
    .light-row:hover { opacity: 0.75; }

    .light-row-dot {
      width: 9px; height: 9px;
      border-radius: 50%;
      background: var(--accent);
      flex-shrink: 0;
      transition: background 0.2s;
    }
    .light-row-dot.off { background: var(--border); }

    .light-row-name {
      font-size: 13px;
      font-weight: 500;
      color: var(--text);
      flex: 1;
      min-width: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .light-row.off .light-row-name { color: var(--text-muted); }

    .light-row-right {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-shrink: 0;
    }

    .light-bar {
      width: 64px;
      height: 3px;
      border-radius: 2px;
      background: var(--border);
      overflow: hidden;
    }

    .light-bar-fill {
      height: 100%;
      border-radius: 2px;
      background: var(--accent);
      transition: width 0.3s ease;
    }

    .light-pct {
      font-size: 11px;
      font-weight: 500;
      color: var(--text-muted);
      font-variant-numeric: tabular-nums;
      min-width: 28px;
      text-align: right;
    }

    .light-kt {
      font-size: 10px;
      font-weight: 500;
      padding: 2px 7px;
      border-radius: 10px;
      border: 1px solid;
      min-width: 48px;
      text-align: center;
    }

    /* ── Doors card ─────────────────────────────────────────────────── */
    .doors-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }

    .door-chip {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 12px;
      border-radius: 12px;
      background: var(--bg);
      border: 1px solid var(--border);
      transition: border-color 0.15s;
    }

    .door-chip.open {
      border-color: #e5736330;
      background: #e5736308;
    }

    .door-chip-dot {
      width: 8px; height: 8px;
      border-radius: 50%;
      background: #5aad6f;
      flex-shrink: 0;
    }
    .door-chip-dot.open { background: #e57363; }

    .door-chip-info { min-width: 0; }

    .door-chip-name {
      font-size: 12px;
      font-weight: 500;
      color: var(--text);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .door-chip-status {
      font-size: 10px;
      color: var(--text-dim);
      margin-top: 1px;
    }
    .door-chip.open .door-chip-status { color: #e57363; }
  `;

  // ─── Helpers ──────────────────────────────────────────────────────────────

  function weatherLabel(state) {
    const map = {
      'clear-night': 'Cielo sereno', 'cloudy': 'Nuvoloso', 'fog': 'Nebbia',
      'hail': 'Grandine', 'lightning': 'Temporale', 'lightning-rainy': 'Temporale con pioggia',
      'partlycloudy': 'Parz. nuvoloso', 'pouring': 'Pioggia intensa', 'rainy': 'Pioggia',
      'snowy': 'Neve', 'snowy-rainy': 'Misto neve/pioggia', 'sunny': 'Soleggiato',
      'windy': 'Ventoso', 'windy-variant': 'Molto ventoso',
    };
    return map[state] || state || '—';
  }

  function bearingToCompass(deg) {
    if (deg == null) return '';
    const d = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSO','SO','OSO','O','ONO','NO','NNO'];
    return d[Math.round(Number(deg) / 22.5) % 16];
  }

  function greeting(name) {
    const h = new Date().getHours();
    const g = h < 12 ? 'Buongiorno' : h < 18 ? 'Buon pomeriggio' : 'Buonasera';
    return `${g}${name ? ', ' + name : ''}`;
  }

  function formatDate(location) {
    const d = new Date();
    const months = ['gen','feb','mar','apr','mag','giu','lug','ago','set','ott','nov','dic'];
    const day = `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
    return location ? `${day} · ${location}` : day;
  }

  function formatTime() {
    const d = new Date();
    return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
  }

  // Color temperature → warm/cool badge style
  function ktStyle(kelvin) {
    if (!kelvin) return { color: '#888', border: '#ccc', bg: 'transparent' };
    const k = Number(kelvin);
    if      (k < 2500) return { color: '#C8712A', border: '#C8712A40', bg: '#C8712A10' };
    else if (k < 3500) return { color: '#D4943A', border: '#D4943A40', bg: '#D4943A10' };
    else if (k < 4500) return { color: '#C2A255', border: '#C2A25540', bg: '#C2A25510' };
    else if (k < 5500) return { color: '#8899AA', border: '#8899AA40', bg: '#8899AA10' };
    else               return { color: '#6688CC', border: '#6688CC40', bg: '#6688CC10' };
  }

  // ─── Card Class ───────────────────────────────────────────────────────────

  class WeSmartLabsCleanPanel extends HTMLElement {

    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this._config   = {};
      this._hass     = null;
      this._panel    = null;
      this._rendered = false;
      this._clockInterval = null;
    }

    setConfig(config) {
      this._config = {
        color:    '#D97757',
        theme:    'auto',
        name:     '',
        location: '',
        ...config,
      };
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

    // ── Color Engine (WeSmart InfiniteColor) ──────────────────────────────

    _hexToHsl(hex) {
      let r = parseInt(hex.slice(1,3),16)/255;
      let g = parseInt(hex.slice(3,5),16)/255;
      let b = parseInt(hex.slice(5,7),16)/255;
      const max = Math.max(r,g,b), min = Math.min(r,g,b);
      let h, s, l = (max+min)/2;
      if (max === min) { h = s = 0; }
      else {
        const d = max - min;
        s = l > 0.5 ? d/(2-max-min) : d/(max+min);
        switch (max) {
          case r: h = ((g-b)/d + (g<b ? 6 : 0)) / 6; break;
          case g: h = ((b-r)/d + 2) / 6; break;
          case b: h = ((r-g)/d + 4) / 6; break;
        }
      }
      return { h: Math.round(h*360), s: Math.round(s*100), l: Math.round(l*100) };
    }

    _hsl(h,s,l)    { return `hsl(${h},${s}%,${l}%)`; }
    _hsla(h,s,l,a) { return `hsla(${h},${s}%,${l}%,${a})`; }
    _clamp(v,mn,mx){ return Math.min(mx, Math.max(mn, v)); }

    _buildPalette(hex, isDark) {
      const {h,s,l} = this._hexToHsl(hex);
      const c = this._clamp.bind(this);
      if (isDark) {
        const aL = c(l,50,65);
        return {
          accent:       this._hsl(h, s, aL),
          accentSoft:   this._hsla(h, s, aL, 0.10),
          accentBorder: this._hsla(h, s, aL, 0.22),
          bg:           this._hsl(h, c(Math.round(s*0.35),25,45), 11),
          surface:      this._hsl(h, c(Math.round(s*0.28),20,38), 16),
          border:       `hsla(0,0%,100%,0.07)`,
          text:         this._hsl(h, c(Math.round(s*0.08),5,10), 93),
          textMuted:    this._hsl(h, c(Math.round(s*0.12),8,15), 62),
          textDim:      this._hsl(h, c(Math.round(s*0.10),6,12), 40),
          shadowSm:     `hsla(0,0%,0%,0.18)`,
          shadowMd:     `hsla(0,0%,0%,0.10)`,
        };
      } else {
        const aL = c(l,35,52);
        return {
          accent:       this._hsl(h, s, aL),
          accentSoft:   this._hsla(h, s, aL, 0.08),
          accentBorder: this._hsla(h, s, aL, 0.20),
          bg:           this._hsl(h, c(Math.round(s*0.06),4,8), 98),
          surface:      this._hsl(h, c(Math.round(s*0.04),3,6), 100),
          border:       this._hsla(h, c(Math.round(s*0.15),10,20), 25, 0.07),
          text:         this._hsl(h, c(Math.round(s*0.25),18,35), 13),
          textMuted:    this._hsl(h, c(Math.round(s*0.18),12,25), 42),
          textDim:      this._hsl(h, c(Math.round(s*0.12),8,16), 62),
          shadowSm:     `hsla(${h},${Math.round(s*0.5)}%,20%,0.04)`,
          shadowMd:     `hsla(${h},${Math.round(s*0.5)}%,20%,0.03)`,
        };
      }
    }

    _applyPalette() {
      const isDark = this._config.theme === 'auto'
        ? !window.matchMedia('(prefers-color-scheme: light)').matches
        : this._config.theme !== 'light';
      this._isDark = isDark;
      this._palette = this._buildPalette(this._config.color, isDark);
      const p = this._palette;
      this.style.setProperty('--accent',        p.accent);
      this.style.setProperty('--accent-soft',   p.accentSoft);
      this.style.setProperty('--accent-border', p.accentBorder);
      this.style.setProperty('--bg',            p.bg);
      this.style.setProperty('--surface',       p.surface);
      this.style.setProperty('--border',        p.border);
      this.style.setProperty('--text',          p.text);
      this.style.setProperty('--text-muted',    p.textMuted);
      this.style.setProperty('--text-dim',      p.textDim);
      this.style.setProperty('--shadow-sm',     p.shadowSm);
      this.style.setProperty('--shadow-md',     p.shadowMd);
      if (this._config.theme === 'auto' && !this._mqHandler) {
        this._mqHandler = () => { this._applyPalette(); if (this._panel) this._render(); };
        window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', this._mqHandler);
      }
    }

    // ── Render ────────────────────────────────────────────────────────────

    _render() {
      if (this._clockInterval) clearInterval(this._clockInterval);
      const shadow = this.shadowRoot;
      shadow.innerHTML = '';

      const style = document.createElement('style');
      style.textContent = styles;
      shadow.appendChild(style);

      this._panel = document.createElement('div');
      this._panel.className = 'panel';
      this._panel.innerHTML = this._getHTML();
      shadow.appendChild(this._panel);

      this._startClock();
      this._bindEvents();
      this._rendered = true;
      if (this._hass) this._updateState();
    }

    _getHTML() {
      const cfg   = this._config;
      const lights = cfg.lights || [];
      const doors  = cfg.doors  || [];

      const lightRowsHTML = lights.map((l, i) => `
        <div class="light-row off" data-light-idx="${i}" id="lr-${i}">
          <div class="light-row-dot off" id="lr-dot-${i}"></div>
          <div class="light-row-name">${l.name || l.entity}</div>
          <div class="light-row-right">
            <div class="light-bar" id="lr-bar-track-${i}" style="display:none">
              <div class="light-bar-fill" id="lr-bar-${i}" style="width:0%"></div>
            </div>
            <div class="light-pct" id="lr-pct-${i}"></div>
            <div class="light-kt" id="lr-kt-${i}" style="display:none">—</div>
          </div>
        </div>
      `).join('');

      const doorChipsHTML = doors.map((d, i) => `
        <div class="door-chip" id="dc-${i}">
          <div class="door-chip-dot" id="dc-dot-${i}"></div>
          <div class="door-chip-info">
            <div class="door-chip-name">${d.name || d.entity}</div>
            <div class="door-chip-status" id="dc-status-${i}">—</div>
          </div>
        </div>
      `).join('');

      const lightsDetailLink = cfg.lights?.details_link
        ? `<a class="detail-link" data-nav="${cfg.lights.details_link}">Tutte le luci</a>` : '';

      const doorsDetailLink = cfg.doors?.details_link
        ? `<a class="detail-link" data-nav="${cfg.doors.details_link}">Sicurezza</a>` : '';

      const hasWeather  = !!cfg.weather?.entity;
      const hasClimate  = !!cfg.climate?.entity;
      const hasLights   = lights.length > 0;
      const hasDoors    = doors.length > 0;

      return `
        <!-- ── Header ── -->
        <header class="ph">
          <div class="ph-left">
            <div class="ph-eyebrow">HOME</div>
            <div class="ph-greeting" id="ph-greeting">${greeting(cfg.name)}</div>
            <div class="ph-presence">
              <span class="ph-dot" id="ph-pdot"></span>
              <span id="ph-ploc">—</span>
            </div>
          </div>
          <div class="ph-right">
            <div class="ph-time" id="ph-time">${formatTime()}</div>
            <div class="ph-date" id="ph-date">${formatDate(cfg.location)}</div>
          </div>
        </header>

        ${(hasWeather || hasClimate) ? `
        <!-- ── Weather + Climate ── -->
        <div class="grid-2">

          ${hasWeather ? `
          <div class="card">
            <div class="section-label" id="w-section-label">METEO</div>
            <div class="w-temp" id="w-temp">—</div>
            <div class="w-condition" id="w-condition">—</div>
            <div class="w-metrics">
              <div class="w-metric" id="w-m1" style="display:none">
                <svg class="w-metric-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M4 12l8-8 8 8v2h-2v7h-4v-4h-4v4H6v-7H4v-2z"/></svg>
                <span id="w-m1-text">—</span>
              </div>
              <div class="w-metric" id="w-m2" style="display:none">
                <svg class="w-metric-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2m0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16m-1-11h2v5h-2zm0 6h2v2h-2z"/></svg>
                <span id="w-m2-text">—</span>
              </div>
            </div>
            <div class="w-internal" id="w-internal" style="display:none">
              <div class="w-internal-val" id="w-int-val">—</div>
              <div class="w-internal-label" id="w-int-label">interno</div>
            </div>
          </div>
          ` : '<div></div>'}

          ${hasClimate ? `
          <div class="card">
            <div class="section-label">${cfg.climate?.name || 'CLIMA'}</div>
            <div class="cl-temps">
              <div class="cl-current" id="cl-current">—</div>
              <div class="cl-sep">→</div>
              <div class="cl-target" id="cl-target">—</div>
            </div>
            <div class="cl-labels">
              <span>attuale</span>
              <span>target</span>
            </div>
            <div class="cl-mode" id="cl-mode" style="display:none">
              <div class="cl-mode-dot"></div>
              <span id="cl-mode-text">—</span>
            </div>
          </div>
          ` : '<div></div>'}

        </div>
        ` : ''}

        ${hasLights ? `
        <!-- ── Lights ── -->
        <div class="card">
          <div class="section-header">
            <span class="section-label">LUCI</span>
            <span class="section-count" id="lights-count">—</span>
          </div>
          ${lightRowsHTML}
          ${lightsDetailLink}
        </div>
        ` : ''}

        ${hasDoors ? `
        <!-- ── Doors ── -->
        <div class="card">
          <div class="section-header">
            <span class="section-label">PORTE & INGRESSI</span>
            <span class="section-count" id="doors-count"></span>
          </div>
          <div class="doors-grid">${doorChipsHTML}</div>
          ${doorsDetailLink}
        </div>
        ` : ''}
      `;
    }

    // ── Clock ─────────────────────────────────────────────────────────────

    _startClock() {
      const tick = () => {
        const el = this._q('#ph-time');
        if (el) el.textContent = formatTime();
        const ge = this._q('#ph-greeting');
        if (ge) ge.textContent = greeting(this._config.name);
        const de = this._q('#ph-date');
        if (de) de.textContent = formatDate(this._config.location);
      };
      tick();
      this._clockInterval = setInterval(tick, 30000);
    }

    // ── State Updates ─────────────────────────────────────────────────────

    _q(sel) { return this._panel ? this._panel.querySelector(sel) : null; }

    _updateState() {
      if (!this._hass || !this._panel) return;
      this._updatePresence();
      this._updateWeather();
      this._updateClimate();
      this._updateLights();
      this._updateDoors();
    }

    _updatePresence() {
      const pEid = this._config.presence?.entity;
      if (!pEid || !this._hass.states[pEid]) return;
      const s = this._hass.states[pEid];
      const isHome = s.state === 'home';
      const dot = this._q('#ph-pdot');
      const loc = this._q('#ph-ploc');
      if (dot) dot.className = `ph-dot${isHome ? '' : ' away'}`;
      if (loc) {
        const zone = this._config.presence?.zone?.replace('zone.','') || '';
        loc.textContent = isHome ? (zone || 'In casa') : 'Fuori casa';
      }
    }

    _updateWeather() {
      const wEid = this._config.weather?.entity;
      if (!wEid || !this._hass.states[wEid]) return;
      const s = this._hass.states[wEid];
      const a = s.attributes || {};

      const tempEl = this._q('#w-temp');
      if (tempEl) tempEl.textContent = a.temperature != null ? `${a.temperature}°` : '—';

      const condEl = this._q('#w-condition');
      if (condEl) condEl.textContent = weatherLabel(s.state);

      // Metric 1: Wind + humidity
      const m1 = this._q('#w-m1');
      const m1t = this._q('#w-m1-text');
      if (m1 && a.wind_speed != null) {
        m1.style.display = '';
        const dir = bearingToCompass(a.wind_bearing);
        const hum = a.humidity != null ? ` · ${a.humidity}% umidità` : '';
        if (m1t) m1t.textContent = `Vento ${dir} ${a.wind_speed} km/h${hum}`;
      }

      // Metric 2: UV + pressure
      const m2 = this._q('#w-m2');
      const m2t = this._q('#w-m2-text');
      if (m2 && (a.uv_index != null || a.pressure != null)) {
        m2.style.display = '';
        const uv   = a.uv_index  != null ? `UV ${a.uv_index}` : '';
        const sep  = uv && a.pressure != null ? ' · ' : '';
        const pres = a.pressure  != null ? `${a.pressure} hPa` : '';
        if (m2t) m2t.textContent = `${uv}${sep}${pres}`;
      }

      // Internal sensor
      const intEid = this._config.weather?.internal_sensor;
      if (intEid && this._hass.states[intEid]) {
        const iS    = this._hass.states[intEid];
        const unit  = iS.attributes?.unit_of_measurement || '°';
        const block = this._q('#w-internal');
        const val   = this._q('#w-int-val');
        const lbl   = this._q('#w-int-label');
        if (block) block.style.display = '';
        if (val)   val.textContent  = `${parseFloat(iS.state).toFixed(1)}${unit}`;
        if (lbl)   lbl.textContent  = iS.attributes?.friendly_name || 'interno';
      }
    }

    _updateClimate() {
      const clEid = this._config.climate?.entity;
      if (!clEid || !this._hass.states[clEid]) return;
      const s = this._hass.states[clEid];
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
        mode.className = idle ? 'cl-mode cl-idle' : 'cl-mode';
        const labels = { heating: 'Riscaldamento', cooling: 'Raffreddamento', idle: 'In attesa', fan: 'Ventilazione', off: 'Spento' };
        if (modeTxt) modeTxt.textContent = labels[a.hvac_action] || a.hvac_action;
      }
    }

    _updateLights() {
      const lights = this._config.lights || [];
      let onCount = 0;

      lights.forEach((lCfg, i) => {
        const s = this._hass.states[lCfg.entity];
        if (!s) return;
        const a    = s.attributes || {};
        const isOn = s.state === 'on';
        if (isOn) onCount++;

        const row  = this._q(`#lr-${i}`);
        const dot  = this._q(`#lr-dot-${i}`);
        const bar  = this._q(`#lr-bar-${i}`);
        const barT = this._q(`#lr-bar-track-${i}`);
        const pct  = this._q(`#lr-pct-${i}`);
        const kt   = this._q(`#lr-kt-${i}`);

        if (row) row.className = `light-row${isOn ? '' : ' off'}`;
        if (dot) dot.className = `light-row-dot${isOn ? '' : ' off'}`;

        if (isOn && a.brightness != null) {
          const p = Math.round(a.brightness / 255 * 100);
          if (barT) barT.style.display = '';
          if (bar)  bar.style.width = `${p}%`;
          if (pct)  pct.textContent  = `${p}%`;
        } else {
          if (barT) barT.style.display = 'none';
          if (pct)  pct.textContent = '';
        }

        if (isOn && a.color_temp_kelvin) {
          const k   = a.color_temp_kelvin;
          const sty = ktStyle(k);
          if (kt) {
            kt.style.display = '';
            kt.textContent   = `${k} K`;
            kt.style.color   = sty.color;
            kt.style.borderColor = sty.border;
            kt.style.background  = sty.bg;
          }
        } else {
          if (kt) kt.style.display = 'none';
        }
      });

      const countEl = this._q('#lights-count');
      if (countEl) {
        countEl.textContent = onCount > 0 ? `${onCount} accesa${onCount > 1 ? 'e' : ''}` : 'Tutte spente';
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

        const chip   = this._q(`#dc-${i}`);
        const dot    = this._q(`#dc-dot-${i}`);
        const status = this._q(`#dc-status-${i}`);

        if (chip)   chip.className   = `door-chip${isOpen ? ' open' : ''}`;
        if (dot)    dot.className    = `door-chip-dot${isOpen ? ' open' : ''}`;
        if (status) status.textContent = isOpen ? 'Aperto' : 'Chiuso';
      });

      const countEl = this._q('#doors-count');
      if (countEl) {
        countEl.textContent = openCount > 0 ? `${openCount} aperta${openCount > 1 ? 'e' : ''}` : '';
        countEl.style.color = openCount > 0 ? '#e57363' : '';
      }
    }

    // ── Events ────────────────────────────────────────────────────────────

    _bindEvents() {
      this._panel.addEventListener('click', e => {
        // Toggle light
        const lr = e.target.closest('.light-row');
        if (lr && this._hass) {
          const idx  = parseInt(lr.dataset.lightIdx, 10);
          const lCfg = (this._config.lights || [])[idx];
          if (lCfg) this._hass.callService('homeassistant', 'toggle', { entity_id: lCfg.entity });
          return;
        }

        // Navigate
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
        weather:  { entity: 'weather.forecast_home', internal_sensor: 'sensor.temperature_home' },
        presence: { entity: 'person.massimo', zone: 'zone.home' },
        climate:  { entity: 'climate.aqara_trv_e1', name: 'CLIMA' },
        lights: [
          { entity: 'light.cucina_parete_yeelight', name: 'Cucina — Yeelight' },
          { entity: 'light.camera_da_letto',        name: 'Camera da letto' },
          { entity: 'light.cortesia_rientro',       name: 'Cortesia Rientro' },
        ],
        doors: [
          { entity: 'binary_sensor.portone',         name: 'Portone d\'ingresso' },
          { entity: 'binary_sensor.finestra_cucina', name: 'Finestra cucina' },
        ],
      };
    }
  }

  customElements.define('wesmart-labs-clean-panel', WeSmartLabsCleanPanel);

  window.customCards = window.customCards || [];
  window.customCards.push({
    type:        'wesmart-labs-clean-panel',
    name:        'WeSmart Labs — Clean Panel',
    description: '[LABS] Modern home overview. Weather, climate, lights, doors. Claude AI aesthetic.',
    preview:     false,
  });

})();
