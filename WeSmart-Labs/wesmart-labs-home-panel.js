/**
 * WeSmart Labs — Home Panel
 * Tablet dashboard panel: meteo, presenza, KPI, luci, clima, sicurezza, sistema, AI tasks.
 *
 * STATUS: EXPERIMENTAL — APIs may change without notice.
 * YAML tag: wesmart-labs-home-panel
 *
 * @version 0.1.0
 */
(() => {

  // ─── Styles ───────────────────────────────────────────────────────────────
  const styles = `
    :host {
      display: block;
      font-family: -apple-system, 'Inter', BlinkMacSystemFont, sans-serif;
      --radius: 16px;
      --radius-sm: 10px;
      --gap: 12px;
    }

    .panel {
      background: var(--bg);
      color: var(--text);
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: var(--gap);
      min-height: 100%;
      box-sizing: border-box;
    }

    /* ── Header ─────────────────────────────────────────────────────── */
    .panel-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 4px;
    }

    .panel-label {
      font-size: 10px;
      font-weight: 500;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--text-dim);
      margin-bottom: 4px;
    }

    .panel-greeting {
      font-size: 22px;
      font-weight: 600;
      color: var(--text);
    }

    .panel-header .right {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 6px;
    }

    .presence-badge {
      display: flex;
      align-items: center;
      gap: 6px;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 20px;
      padding: 5px 12px;
      font-size: 12px;
      font-weight: 500;
      color: var(--text);
    }

    .presence-dot      { width: 8px; height: 8px; border-radius: 50%; background: #4caf50; }
    .presence-dot.away { background: var(--text-dim); }

    .panel-date {
      font-size: 12px;
      color: var(--text-muted);
    }

    /* ── Row labels ─────────────────────────────────────────────────── */
    .row-label {
      font-size: 9px;
      font-weight: 600;
      letter-spacing: 0.10em;
      text-transform: uppercase;
      color: var(--text-dim);
      margin-bottom: 2px;
    }

    /* ── Layout rows ────────────────────────────────────────────────── */
    .row-2col        { display: grid; grid-template-columns: 3fr 2fr; gap: var(--gap); }
    .row-2col.equal  { grid-template-columns: 1fr 1fr; }
    .row-kpi         { display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--gap); }
    .row-lights      { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: var(--gap); }

    /* ── Base card ──────────────────────────────────────────────────── */
    .card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 16px;
      box-sizing: border-box;
    }

    .card-label {
      font-size: 9px;
      font-weight: 600;
      letter-spacing: 0.10em;
      text-transform: uppercase;
      color: var(--text-dim);
      margin-bottom: 10px;
    }

    /* ── Weather ────────────────────────────────────────────────────── */
    .weather-temp      { font-size: 40px; font-weight: 300; color: var(--text); line-height: 1; margin-bottom: 6px; }
    .weather-condition { font-size: 13px; color: var(--text-muted); margin-bottom: 8px; }
    .weather-details   { display: flex; flex-direction: column; gap: 3px; font-size: 11px; color: var(--text-muted); }

    .weather-internal {
      margin-top: 12px;
      padding-top: 12px;
      border-top: 1px solid var(--border);
    }
    .weather-internal .int-label  { font-size: 9px; font-weight: 600; letter-spacing: 0.10em; text-transform: uppercase; color: var(--text-dim); margin-bottom: 4px; }
    .weather-internal .int-value  { font-size: 22px; font-weight: 300; color: var(--text); }
    .weather-internal .int-name   { font-size: 10px; color: var(--text-dim); margin-top: 2px; }

    /* ── Presence card ──────────────────────────────────────────────── */
    .presence-person  { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }

    .person-avatar {
      width: 36px; height: 36px; border-radius: 50%;
      background: var(--accent-soft); border: 1px solid var(--accent-border);
      display: flex; align-items: center; justify-content: center;
      font-size: 16px; font-weight: 600; color: var(--accent); flex-shrink: 0;
    }

    .person-info .p-name { font-size: 14px; font-weight: 500; color: var(--text); }

    .person-status {
      display: flex; align-items: center; gap: 5px;
      margin-top: 3px; font-size: 11px; color: var(--text-muted);
    }

    .status-dot       { width: 6px; height: 6px; border-radius: 50%; background: #4caf50; }
    .status-dot.away  { background: var(--text-dim); }

    .zone-badge {
      background: var(--accent-soft); border: 1px solid var(--accent-border);
      color: var(--accent); border-radius: 20px;
      padding: 2px 8px; font-size: 10px; font-weight: 500;
    }

    .presence-meta     { font-size: 11px; color: var(--text-muted); line-height: 1.6; }
    .presence-meta strong { color: var(--text); font-weight: 600; }
    .presence-coords   { font-size: 11px; color: var(--text-dim); margin-top: 2px; }

    /* ── KPI tiles ──────────────────────────────────────────────────── */
    .kpi-tile  { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 14px; }
    .kpi-label { font-size: 9px; font-weight: 600; letter-spacing: 0.10em; text-transform: uppercase; color: var(--text-dim); margin-bottom: 8px; }
    .kpi-value { font-size: 26px; font-weight: 600; color: var(--text); line-height: 1; margin-bottom: 4px; }
    .kpi-value.ok { color: var(--accent); }
    .kpi-sub   { font-size: 11px; color: var(--text-muted); }

    /* ── Light control cards ────────────────────────────────────────── */
    .light-card { cursor: pointer; transition: border-color 0.15s; }
    .light-card:hover { border-color: var(--accent-border); }

    .light-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; }

    .light-status { display: flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 500; color: var(--text); }
    .light-dot    { width: 8px; height: 8px; border-radius: 50%; background: var(--accent); }
    .light-dot.off { background: var(--text-dim); }

    .light-meta { font-size: 11px; color: var(--text-muted); margin-bottom: 8px; }

    .light-bar-track { height: 4px; background: var(--border); border-radius: 2px; overflow: hidden; }
    .light-bar-fill  { height: 100%; background: var(--accent); border-radius: 2px; transition: width 0.3s ease; }

    .light-colortemp {
      display: inline-block; background: var(--accent-soft); border: 1px solid var(--accent-border);
      border-radius: 12px; padding: 2px 8px; font-size: 10px; font-weight: 500; color: var(--accent);
    }
    .light-auto-badge {
      display: inline-block; background: var(--surface); border: 1px solid var(--border);
      border-radius: 12px; padding: 2px 8px; font-size: 10px; color: var(--text-dim);
    }

    /* ── Climate card ───────────────────────────────────────────────── */
    .climate-temps { display: flex; align-items: flex-end; gap: 20px; margin: 8px 0 4px; }

    .climate-col { display: flex; flex-direction: column; }
    .climate-temp-current { font-size: 36px; font-weight: 300; color: var(--text); line-height: 1; }
    .climate-temp-target  { font-size: 28px; font-weight: 300; color: var(--accent); line-height: 1; }
    .climate-sublabel     { font-size: 10px; color: var(--text-dim); margin-top: 2px; }

    .climate-badge {
      display: inline-flex; align-items: center; gap: 4px;
      background: var(--accent-soft); border: 1px solid var(--accent-border);
      color: var(--accent); border-radius: 20px;
      padding: 3px 10px; font-size: 11px; font-weight: 500;
      margin: 8px 0 4px;
    }
    .climate-ext { font-size: 11px; color: var(--text-muted); }

    /* ── Security card ──────────────────────────────────────────────── */
    .security-list { display: flex; flex-direction: column; gap: 8px; margin-bottom: 12px; }
    .security-row  { display: flex; justify-content: space-between; align-items: center; }
    .security-item { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--text); }

    .security-indicator       { width: 8px; height: 8px; border-radius: 50%; background: #4caf50; }
    .security-indicator.alert { background: #e57373; }

    .badge-ok    { background: rgba(76,175,80,0.12); border: 1px solid rgba(76,175,80,0.25); color: #4caf50; border-radius: 12px; padding: 2px 8px; font-size: 10px; font-weight: 500; }
    .badge-alert { background: rgba(229,115,115,0.12); border: 1px solid rgba(229,115,115,0.25); color: #e57373; border-radius: 12px; padding: 2px 8px; font-size: 10px; font-weight: 500; }

    .yaml-link {
      display: block; text-align: center; padding: 8px;
      border: 1px solid var(--border); border-radius: var(--radius-sm);
      font-size: 11px; color: var(--text-muted); cursor: pointer;
      text-decoration: none; transition: all 0.15s;
    }
    .yaml-link:hover { border-color: var(--accent-border); color: var(--accent); }

    /* ── System updates ─────────────────────────────────────────────── */
    .update-list { display: flex; flex-direction: column; gap: 8px; }
    .update-row  { display: flex; justify-content: space-between; align-items: center; }
    .update-name { font-size: 12px; color: var(--text); }

    .version-badge         { font-size: 10px; font-weight: 500; background: var(--accent-soft); border: 1px solid var(--accent-border); color: var(--accent); border-radius: 12px; padding: 2px 8px; }
    .version-badge.ok      { background: rgba(76,175,80,0.10); border-color: rgba(76,175,80,0.22); color: #4caf50; }
    .version-badge.pending { background: rgba(255,167,38,0.12); border-color: rgba(255,167,38,0.25); color: #ffa726; }

    /* ── AI Tasks ───────────────────────────────────────────────────── */
    .ai-list { display: flex; flex-direction: column; gap: 8px; margin-bottom: 12px; }
    .ai-row  { display: flex; justify-content: space-between; align-items: center; }
    .ai-item { display: flex; align-items: center; gap: 6px; }
    .ai-dot  { width: 8px; height: 8px; border-radius: 50%; background: #4caf50; }
    .ai-name { font-size: 12px; color: var(--text); }
    .ai-badge {
      font-size: 10px; font-weight: 500;
      background: var(--accent-soft); border: 1px solid var(--accent-border);
      color: var(--accent); border-radius: 12px; padding: 2px 8px;
    }

    /* ── Empty state ────────────────────────────────────────────────── */
    .empty-hint { font-size: 12px; color: var(--text-dim); }
  `;

  // ─── Helpers ──────────────────────────────────────────────────────────────

  function bearingToCompass(deg) {
    if (deg == null || isNaN(Number(deg))) return '';
    const dirs = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSO','SO','OSO','O','ONO','NO','NNO'];
    return dirs[Math.round(Number(deg) / 22.5) % 16];
  }

  function weatherLabel(state) {
    const map = {
      'clear-night':      'Cielo sereno',
      'cloudy':           'Nuvoloso',
      'fog':              'Nebbia',
      'hail':             'Grandine',
      'lightning':        'Temporale',
      'lightning-rainy':  'Temporale con pioggia',
      'partlycloudy':     'Parz. nuvoloso',
      'pouring':          'Pioggia intensa',
      'rainy':            'Pioggia',
      'snowy':            'Neve',
      'snowy-rainy':      'Misto neve/pioggia',
      'sunny':            'Soleggiato',
      'windy':            'Ventoso',
      'windy-variant':    'Molto ventoso',
      'exceptional':      'Eccezionale',
    };
    return map[state] || state || '—';
  }

  function formatDate(location) {
    const d = new Date();
    const months = ['gen','feb','mar','apr','mag','giu','lug','ago','set','ott','nov','dic'];
    const loc = location ? `${location} · ` : '';
    return `${loc}${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  }

  function greeting(name) {
    const h = new Date().getHours();
    const g = h < 12 ? 'Buongiorno' : h < 18 ? 'Buon pomeriggio' : 'Buonasera';
    return `${g}, ${name || ''}`;
  }

  // ─── Card Class ───────────────────────────────────────────────────────────

  class WeSmartLabsHomePanel extends HTMLElement {

    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this._config   = {};
      this._hass     = null;
      this._panel    = null;
      this._rendered = false;
    }

    setConfig(config) {
      this._config = {
        color:    '#D97757',
        theme:    'dark',
        name:     'Massimo',
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

    getCardSize() { return 14; }

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
          accentBorder: this._hsla(h, s, aL, 0.25),
          bg:           this._hsl(h, c(Math.round(s*0.35),25,45), 11),
          surface:      this._hsl(h, c(Math.round(s*0.28),20,38), 16),
          border:       `hsla(0,0%,100%,0.08)`,
          text:         this._hsl(h, c(Math.round(s*0.08),5,10), 93),
          textMuted:    this._hsl(h, c(Math.round(s*0.12),8,15), 65),
          textDim:      this._hsl(h, c(Math.round(s*0.10),6,12), 42),
          rowHover:     `hsla(0,0%,100%,0.03)`,
          shadow:       `0 8px 32px ${this._hsla(h,s,5,0.45)}`,
        };
      } else {
        const aL = c(l,35,52);
        return {
          accent:       this._hsl(h, s, aL),
          accentSoft:   this._hsla(h, s, aL, 0.08),
          accentBorder: this._hsla(h, s, aL, 0.22),
          bg:           this._hsl(h, c(Math.round(s*0.08),5,10), 99),
          surface:      this._hsl(h, c(Math.round(s*0.12),8,15), 95),
          border:       this._hsla(h, c(Math.round(s*0.15),10,20), 25, 0.09),
          text:         this._hsl(h, c(Math.round(s*0.25),18,35), 12),
          textMuted:    this._hsl(h, c(Math.round(s*0.20),15,28), 40),
          textDim:      this._hsl(h, c(Math.round(s*0.15),10,20), 60),
          rowHover:     this._hsla(h, c(Math.round(s*0.15),10,20), 25, 0.03),
          shadow:       `0 2px 16px ${this._hsla(h,s,20,0.07)}, 0 0 0 1px ${this._hsla(h,s,20,0.04)}`,
        };
      }
    }

    _applyPalette() {
      const isDark = this._config.theme === 'auto'
        ? !window.matchMedia('(prefers-color-scheme: light)').matches
        : this._config.theme !== 'light';
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
      this.style.setProperty('--row-hover',     p.rowHover);
      this.style.setProperty('--shadow',        p.shadow);
      if (this._config.theme === 'auto' && !this._mqHandler) {
        this._mqHandler = () => this._applyPalette();
        window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', this._mqHandler);
      }
    }

    // ── Render ────────────────────────────────────────────────────────────

    _render() {
      const shadow = this.shadowRoot;
      shadow.innerHTML = '';

      const style = document.createElement('style');
      style.textContent = styles;
      shadow.appendChild(style);

      this._panel = document.createElement('div');
      this._panel.className = 'panel';
      this._panel.innerHTML = this._getHTML();
      shadow.appendChild(this._panel);

      this._bindEvents();
      this._rendered = true;
      if (this._hass) this._updateState();
    }

    _getHTML() {
      const cfg    = this._config;
      const lights  = cfg.lights  || [];
      const updates = cfg.updates || [];
      const aiTasks = Array.isArray(cfg.ai_tasks) ? cfg.ai_tasks : [];

      const lightCardsHTML = lights.length
        ? lights.map((l, i) => `
            <div class="card light-card" data-light-idx="${i}">
              <div class="card-label">${l.name || l.entity}</div>
              <div class="light-header">
                <div class="light-status">
                  <div class="light-dot off" id="lc-dot-${i}"></div>
                  <span id="lc-state-${i}">—</span>
                </div>
                <div>
                  <span class="light-colortemp" id="lc-ct-${i}" style="display:none">—</span>
                  <span class="light-auto-badge" id="lc-auto-${i}" style="display:none">auto</span>
                </div>
              </div>
              <div class="light-meta" id="lc-meta-${i}">—</div>
              <div class="light-bar-track">
                <div class="light-bar-fill" id="lc-bar-${i}" style="width:0%"></div>
              </div>
            </div>
          `).join('')
        : '<div class="card empty-hint">Nessuna luce configurata in YAML (lights: [])</div>';

      const updateRowsHTML = updates.length
        ? updates.map((u, i) => `
            <div class="update-row">
              <span class="update-name">${u.name || u.entity}</span>
              <span class="version-badge" id="upd-badge-${i}">—</span>
            </div>
          `).join('')
        : '<div class="empty-hint">Nessun update configurato</div>';

      const aiRowsHTML = aiTasks.length
        ? aiTasks.map((t, i) => `
            <div class="ai-row">
              <div class="ai-item">
                <div class="ai-dot" id="ai-dot-${i}"></div>
                <span class="ai-name">${t.name || t.entity}</span>
              </div>
              <span class="ai-badge" id="ai-badge-${i}">—</span>
            </div>
          `).join('')
        : '<div class="empty-hint">Nessun AI task configurato</div>';

      const secLink = cfg.security?.yaml_link
        ? `<a class="yaml-link" data-nav="${cfg.security.yaml_link}">YAML sicurezza ↗</a>` : '';

      const aiLink = cfg.ai_tasks_yaml_link
        ? `<a class="yaml-link" data-nav="${cfg.ai_tasks_yaml_link}">YAML AI cards ↗</a>` : '';

      return `
        <!-- HEADER -->
        <div class="panel-header">
          <div class="left">
            <div class="panel-label">HOME ASSISTANT — TABLET</div>
            <div class="panel-greeting" id="greeting">${greeting(cfg.name)}</div>
          </div>
          <div class="right">
            <div class="presence-badge">
              <div class="presence-dot" id="hdr-dot"></div>
              <span id="hdr-status">—</span>
            </div>
            <div class="panel-date" id="hdr-date">${formatDate(cfg.location)}</div>
          </div>
        </div>

        <!-- RIGA 1 — METEO + PRESENZA -->
        <div class="row-label">RIGA 1 — METEO + PRESENZA</div>
        <div class="row-2col">

          <div class="card">
            <div class="card-label">METEO — FORECAST HOME (MET.NO)</div>
            <div class="weather-temp" id="w-temp">—</div>
            <div class="weather-condition" id="w-cond">—</div>
            <div class="weather-details">
              <div id="w-detail1">—</div>
              <div id="w-detail2">—</div>
            </div>
            <div class="weather-internal" id="w-internal" style="display:none">
              <div class="int-label">SENSORE INTERNO</div>
              <div class="int-value" id="w-int-val">—</div>
              <div class="int-name" id="w-int-name">—</div>
            </div>
          </div>

          <div class="card">
            <div class="card-label">PRESENZA</div>
            <div class="presence-person">
              <div class="person-avatar" id="pr-avatar">?</div>
              <div class="person-info">
                <div class="p-name" id="pr-name">—</div>
                <div class="person-status">
                  <div class="status-dot" id="pr-dot"></div>
                  <span id="pr-status">—</span>
                  <span class="zone-badge" id="pr-zone" style="display:none">—</span>
                </div>
              </div>
            </div>
            <div class="presence-meta">
              Zona prossimità: <strong id="pr-nearby">—</strong>
            </div>
            <div class="presence-coords" id="pr-coords"></div>
          </div>

        </div>

        <!-- RIGA 2 — KPI RAPIDI -->
        <div class="row-label">RIGA 2 — KPI RAPIDI</div>
        <div class="row-kpi">
          <div class="kpi-tile">
            <div class="kpi-label">LUCI ACCESE</div>
            <div class="kpi-value" id="kpi-lights-val">—</div>
            <div class="kpi-sub" id="kpi-lights-sub">—</div>
          </div>
          <div class="kpi-tile">
            <div class="kpi-label">CLIMA TRV</div>
            <div class="kpi-value" id="kpi-climate-val">—</div>
            <div class="kpi-sub" id="kpi-climate-sub">—</div>
          </div>
          <div class="kpi-tile">
            <div class="kpi-label">SICUREZZA</div>
            <div class="kpi-value" id="kpi-security-val">—</div>
            <div class="kpi-sub" id="kpi-security-sub">—</div>
          </div>
          <div class="kpi-tile">
            <div class="kpi-label">AGGIORNAMENTI</div>
            <div class="kpi-value ok" id="kpi-updates-val">—</div>
            <div class="kpi-sub" id="kpi-updates-sub">—</div>
          </div>
        </div>

        <!-- RIGA 3 — CONTROLLO LUCI -->
        <div class="row-label">RIGA 3 — CONTROLLO LUCI</div>
        <div class="row-lights">${lightCardsHTML}</div>

        <!-- RIGA 4 — CLIMA + SICUREZZA -->
        <div class="row-label">RIGA 4 — CLIMA + SICUREZZA</div>
        <div class="row-2col equal">

          <div class="card">
            <div class="card-label" id="cl-label">${cfg.climate?.name || 'RISCALDAMENTO'}</div>
            <div class="climate-temps">
              <div class="climate-col">
                <div class="climate-temp-current" id="cl-current">—</div>
                <div class="climate-sublabel">attuale</div>
              </div>
              <div class="climate-col">
                <div class="climate-temp-target" id="cl-target">—</div>
                <div class="climate-sublabel">target</div>
              </div>
            </div>
            <div class="climate-badge" id="cl-badge" style="display:none">
              <span id="cl-action">—</span>
            </div>
            <div class="climate-ext" id="cl-ext" style="display:none">
              Temp. esterna: <span id="cl-ext-val">—</span>
            </div>
          </div>

          <div class="card">
            <div class="card-label">SICUREZZA</div>
            <div class="security-list">
              <div class="security-row">
                <div class="security-item">
                  <div class="security-indicator" id="sec-alarm-dot"></div>
                  <span id="sec-alarm-lbl">Allarme —</span>
                </div>
                <span class="badge-ok" id="sec-alarm-badge">—</span>
              </div>
              <div class="security-row">
                <div class="security-item">
                  <div class="security-indicator" id="sec-door-dot"></div>
                  <span id="sec-door-lbl">Portone —</span>
                </div>
                <span class="badge-ok" id="sec-door-badge">—</span>
              </div>
            </div>
            ${secLink}
          </div>

        </div>

        <!-- RIGA 5 — SISTEMA + AI TASKS -->
        <div class="row-label">RIGA 5 — SISTEMA + AI TASKS</div>
        <div class="row-2col equal">

          <div class="card">
            <div class="card-label">AGGIORNAMENTI SISTEMA</div>
            <div class="update-list">${updateRowsHTML}</div>
          </div>

          <div class="card">
            <div class="card-label">AI TASKS</div>
            <div class="ai-list">${aiRowsHTML}</div>
            ${aiLink}
          </div>

        </div>
      `;
    }

    // ── State Updates ─────────────────────────────────────────────────────

    _q(id) { return this._panel ? this._panel.querySelector(id) : null; }

    _updateState() {
      if (!this._hass || !this._panel) return;
      this._updateHeader();
      this._updateWeather();
      this._updatePresence();
      this._updateKpi();
      this._updateLights();
      this._updateClimate();
      this._updateSecurity();
      this._updateSystemUpdates();
      this._updateAiTasks();
    }

    _updateHeader() {
      const cfg = this._config;
      const greetEl = this._q('#greeting');
      if (greetEl) greetEl.textContent = greeting(cfg.name);

      const dateEl = this._q('#hdr-date');
      if (dateEl) dateEl.textContent = formatDate(cfg.location);

      const pEid = cfg.presence?.entity;
      if (pEid && this._hass.states[pEid]) {
        const isHome = this._hass.states[pEid].state === 'home';
        const dot = this._q('#hdr-dot');
        const lbl = this._q('#hdr-status');
        if (dot) dot.className = `presence-dot${isHome ? '' : ' away'}`;
        if (lbl) lbl.textContent = isHome ? 'In casa' : 'Fuori casa';
      }
    }

    _updateWeather() {
      const wEid = this._config.weather?.entity;
      if (!wEid || !this._hass.states[wEid]) return;
      const s = this._hass.states[wEid];
      const a = s.attributes || {};

      const tempEl = this._q('#w-temp');
      if (tempEl) tempEl.textContent = a.temperature != null ? `${a.temperature}°` : '—';

      const condEl = this._q('#w-cond');
      if (condEl) {
        const hum = a.humidity != null ? ` · umidità ${a.humidity}%` : '';
        condEl.textContent = `${weatherLabel(s.state)}${hum}`;
      }

      const d1 = this._q('#w-detail1');
      if (d1) {
        const dir = bearingToCompass(a.wind_bearing);
        const wind = a.wind_speed != null ? `Vento ${dir} ${a.wind_speed} km/h` : '';
        const uv   = a.uv_index   != null ? ` · UV ${a.uv_index}` : '';
        const pres = a.pressure   != null ? ` · Press. ${a.pressure}` : '';
        d1.textContent = `${wind}${uv}${pres}` || '—';
      }

      const d2 = this._q('#w-detail2');
      if (d2) {
        const dew = a.dew_point       != null ? `Punto di rugiada ${a.dew_point}°` : '';
        const cov = a.cloud_coverage  != null ? ` · Copertura ${a.cloud_coverage}%` : '';
        d2.textContent = `${dew}${cov}` || '';
      }

      const intEid = this._config.weather?.internal_sensor;
      if (intEid && this._hass.states[intEid]) {
        const iS = this._hass.states[intEid];
        const iA = iS.attributes || {};
        const unit = iA.unit_of_measurement || '°';
        const intBlock = this._q('#w-internal');
        const intVal   = this._q('#w-int-val');
        const intName  = this._q('#w-int-name');
        if (intBlock) intBlock.style.display = '';
        if (intVal)   intVal.textContent = `${parseFloat(iS.state).toFixed(1)}${unit}`;
        if (intName)  intName.textContent = iA.friendly_name || intEid;
      }
    }

    _updatePresence() {
      const pEid = this._config.presence?.entity;
      if (!pEid || !this._hass.states[pEid]) return;
      const s = this._hass.states[pEid];
      const a = s.attributes || {};
      const isHome = s.state === 'home';
      const name = a.friendly_name || pEid.split('.')[1];

      const avatarEl = this._q('#pr-avatar');
      if (avatarEl) avatarEl.textContent = name.charAt(0).toUpperCase();

      const nameEl = this._q('#pr-name');
      if (nameEl) nameEl.textContent = name;

      const dot = this._q('#pr-dot');
      if (dot) dot.className = `status-dot${isHome ? '' : ' away'}`;

      const statusEl = this._q('#pr-status');
      if (statusEl) statusEl.textContent = isHome ? 'In casa' : s.state;

      const zoneEl = this._q('#pr-zone');
      if (zoneEl) {
        const zEid = this._config.presence?.zone;
        if (zEid && isHome) {
          zoneEl.style.display = '';
          zoneEl.textContent = zEid.replace('zone.', '');
        } else {
          zoneEl.style.display = 'none';
        }
      }

      const nearbyEl = this._q('#pr-nearby');
      if (nearbyEl) {
        const nearby = Object.values(this._hass.states)
          .filter(st => st.entity_id.startsWith('person.') && st.entity_id !== pEid && st.state === 'home')
          .length;
        nearbyEl.textContent = nearby;
      }

      const coordsEl = this._q('#pr-coords');
      if (coordsEl && a.latitude != null && a.longitude != null) {
        coordsEl.textContent = `Raggio home: 100 m · ${parseFloat(a.latitude).toFixed(2)}° N ${parseFloat(a.longitude).toFixed(2)}° E`;
      }
    }

    _updateKpi() {
      const cfg  = this._config;
      const hass = this._hass;

      // Lights
      const allLights  = Object.values(hass.states)
        .filter(s => s.entity_id.startsWith('light.') && !Array.isArray(s.attributes?.entity_id));
      const lightsOn   = allLights.filter(s => s.state === 'on');
      const totalCount = cfg.kpi?.lights?.total ?? allLights.length;

      const lightsVal = this._q('#kpi-lights-val');
      if (lightsVal) lightsVal.textContent = `${lightsOn.length}/${totalCount}`;

      const lightsSub = this._q('#kpi-lights-sub');
      if (lightsSub) {
        const names = lightsOn.slice(0,3)
          .map(s => (s.attributes?.friendly_name || s.entity_id.split('.')[1]).split(' ')[0]);
        lightsSub.textContent = names.join(', ') || 'Nessuna';
      }

      // Climate
      const clEid = cfg.kpi?.climate?.entity || cfg.climate?.entity;
      if (clEid && hass.states[clEid]) {
        const cl = hass.states[clEid];
        const ca = cl.attributes || {};
        const climVal = this._q('#kpi-climate-val');
        if (climVal) climVal.textContent = `${ca.current_temperature ?? '—'}° / ${ca.temperature ?? '—'}°`;
        const climSub = this._q('#kpi-climate-sub');
        if (climSub) climSub.textContent = ca.friendly_name || clEid.split('.')[1];
      }

      // Security
      const alarmEid = cfg.kpi?.security?.alarm || cfg.security?.alarm;
      const doorEid  = cfg.kpi?.security?.door  || cfg.security?.door;
      const secVal   = this._q('#kpi-security-val');
      const secSub   = this._q('#kpi-security-sub');

      if (alarmEid && hass.states[alarmEid] && secVal) {
        const alSt = hass.states[alarmEid].state;
        const labels = { disarmed: 'Disarmato', armed_home: 'Armato casa', armed_away: 'Armato fuori', armed_night: 'Armato notte' };
        secVal.textContent = labels[alSt] || alSt;
      }
      if (doorEid && hass.states[doorEid] && secSub) {
        const dSt = hass.states[doorEid];
        const dName = (dSt.attributes?.friendly_name || 'Portone');
        const isOpen = dSt.state === 'on' || dSt.state === 'open';
        secSub.textContent = isOpen ? `${dName} aperto` : `${dName} chiuso`;
      }

      // Updates
      const allUpdates = Object.values(hass.states).filter(s => s.entity_id.startsWith('update.'));
      const pending    = allUpdates.filter(s => s.state === 'on');
      const updVal     = this._q('#kpi-updates-val');
      const updSub     = this._q('#kpi-updates-sub');
      if (updVal) {
        updVal.textContent = pending.length === 0 ? 'Tutto ok' : `${pending.length} da aggiornare`;
        updVal.className   = `kpi-value${pending.length === 0 ? ' ok' : ''}`;
      }
      if (updSub) updSub.textContent = `${allUpdates.length} entità aggiornate`;
    }

    _updateLights() {
      const lights = this._config.lights || [];
      lights.forEach((lCfg, i) => {
        const s = this._hass.states[lCfg.entity];
        if (!s) return;
        const a    = s.attributes || {};
        const isOn = s.state === 'on';

        const dot = this._q(`#lc-dot-${i}`);
        if (dot) dot.className = `light-dot${isOn ? '' : ' off'}`;

        const stateEl = this._q(`#lc-state-${i}`);
        if (stateEl) stateEl.textContent = isOn ? 'On' : 'Off';

        const metaEl = this._q(`#lc-meta-${i}`);
        if (metaEl) {
          if (isOn && a.brightness != null) {
            metaEl.textContent = `Luminosità ${Math.round(a.brightness/255*100)}%`;
          } else {
            const lc = s.last_changed
              ? new Date(s.last_changed).toLocaleTimeString('it-IT', {hour:'2-digit', minute:'2-digit'})
              : '';
            metaEl.textContent = lc ? `Ultima: ${lc}` : '—';
          }
        }

        const bar = this._q(`#lc-bar-${i}`);
        if (bar) bar.style.width = (isOn && a.brightness != null)
          ? `${Math.round(a.brightness/255*100)}%` : '0%';

        const ctEl   = this._q(`#lc-ct-${i}`);
        const autoEl = this._q(`#lc-auto-${i}`);
        if (isOn && a.color_temp_kelvin) {
          if (ctEl)   { ctEl.style.display = ''; ctEl.textContent = `${a.color_temp_kelvin} K`; }
          if (autoEl) autoEl.style.display = 'none';
        } else {
          if (ctEl)   ctEl.style.display   = 'none';
          if (autoEl && !isOn) { autoEl.style.display = ''; }
          else if (autoEl)     autoEl.style.display = 'none';
        }
      });
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

      const badge  = this._q('#cl-badge');
      const action = this._q('#cl-action');
      if (badge && a.hvac_action && a.hvac_action !== 'off') {
        badge.style.display = '';
        const actionMap = { heating: 'Riscaldamento', cooling: 'Raffreddamento', idle: 'Inattivo', fan: 'Ventilazione' };
        if (action) action.textContent = actionMap[a.hvac_action] || a.hvac_action;
      }

      const extEid = this._config.climate?.external_temp;
      if (extEid && this._hass.states[extEid]) {
        const extS   = this._hass.states[extEid];
        const extBlk = this._q('#cl-ext');
        const extVal = this._q('#cl-ext-val');
        if (extBlk) extBlk.style.display = '';
        if (extVal) extVal.textContent = `${parseFloat(extS.state).toFixed(1)}°`;
      }
    }

    _updateSecurity() {
      const cfg  = this._config.security || {};
      const hass = this._hass;

      // Alarm
      if (cfg.alarm && hass.states[cfg.alarm]) {
        const alSt  = hass.states[cfg.alarm].state;
        const isOk  = alSt === 'disarmed';
        const labels = { disarmed: 'Allarme disarmato', armed_home: 'Allarme armato casa', armed_away: 'Allarme armato', armed_night: 'Allarme armato notte' };
        const dot   = this._q('#sec-alarm-dot');
        const lbl   = this._q('#sec-alarm-lbl');
        const badge = this._q('#sec-alarm-badge');
        if (dot)   dot.className   = `security-indicator${isOk ? '' : ' alert'}`;
        if (lbl)   lbl.textContent = labels[alSt] || `Allarme ${alSt}`;
        if (badge) { badge.className = isOk ? 'badge-ok' : 'badge-alert'; badge.textContent = isOk ? 'ok' : '!'; }
      }

      // Door
      if (cfg.door && hass.states[cfg.door]) {
        const dSt   = hass.states[cfg.door];
        const isOpen = dSt.state === 'on' || dSt.state === 'open';
        const dName  = dSt.attributes?.friendly_name || 'Portone';
        const dot    = this._q('#sec-door-dot');
        const lbl    = this._q('#sec-door-lbl');
        const badge  = this._q('#sec-door-badge');
        if (dot)   dot.className   = `security-indicator${isOpen ? ' alert' : ''}`;
        if (lbl)   lbl.textContent = isOpen ? `${dName} aperto` : `${dName} chiuso`;
        if (badge) { badge.className = isOpen ? 'badge-alert' : 'badge-ok'; badge.textContent = isOpen ? '!' : 'ok'; }
      }
    }

    _updateSystemUpdates() {
      const updates = this._config.updates || [];
      updates.forEach((u, i) => {
        const badge = this._q(`#upd-badge-${i}`);
        if (!badge || !this._hass.states[u.entity]) return;
        const s   = this._hass.states[u.entity];
        const a   = s.attributes || {};
        const ver = a.installed_version || a.latest_version || s.state || '—';
        badge.textContent = ver;
        badge.className   = `version-badge${s.state === 'on' ? ' pending' : ' ok'}`;
      });
    }

    _updateAiTasks() {
      const aiTasks = Array.isArray(this._config.ai_tasks) ? this._config.ai_tasks : [];
      aiTasks.forEach((t, i) => {
        const badge = this._q(`#ai-badge-${i}`);
        const dot   = this._q(`#ai-dot-${i}`);
        if (!badge) return;
        if (this._hass.states[t.entity]) {
          const state = this._hass.states[t.entity].state;
          badge.textContent = state;
          const isActive = ['on','ready','pronto','running'].includes(state);
          if (dot) dot.style.background = isActive ? '#4caf50' : 'var(--text-dim)';
        } else {
          badge.textContent = 'n/d';
          if (dot) dot.style.background = 'var(--text-dim)';
        }
      });
    }

    // ── Events ────────────────────────────────────────────────────────────

    _bindEvents() {
      this._panel.addEventListener('click', e => {
        // Light toggle
        const lCard = e.target.closest('.light-card');
        if (lCard && this._hass) {
          const idx  = parseInt(lCard.dataset.lightIdx, 10);
          const lCfg = (this._config.lights || [])[idx];
          if (lCfg) this._hass.callService('homeassistant', 'toggle', { entity_id: lCfg.entity });
          return;
        }

        // YAML nav links
        const navLink = e.target.closest('[data-nav]');
        if (navLink) {
          e.preventDefault();
          const path = navLink.getAttribute('data-nav');
          if (path) {
            history.pushState(null, '', path);
            window.dispatchEvent(new CustomEvent('location-changed', { bubbles: true, composed: true, detail: { replace: false } }));
          }
        }
      });
    }

    // ── Stub config for HA card picker ────────────────────────────────────

    static getStubConfig() {
      return {
        color:    '#D97757',
        theme:    'dark',
        name:     'Massimo',
        location: 'Sora',
        weather:  { entity: 'weather.forecast_home', internal_sensor: 'sensor.temperature_home' },
        presence: { entity: 'person.massimo', zone: 'zone.home' },
        climate:  { entity: 'climate.aqara_trv_e1', name: 'Riscaldamento — Aqara TRV E1', external_temp: 'sensor.temperature_ext' },
        security: { alarm: 'alarm_control_panel.ezviz', door: 'binary_sensor.portone', yaml_link: '/lovelace/sicurezza' },
        lights:   [
          { entity: 'light.cucina_parete_yeelight', name: 'Cucina — Parete Yeelight' },
          { entity: 'light.camera_da_letto',        name: 'Camera da letto' },
          { entity: 'light.cortesia_rientro',       name: 'Cortesia Rientro' },
        ],
        updates:  [
          { entity: 'update.zigbee2mqtt',    name: 'Zigbee2MQTT' },
          { entity: 'update.matter_server',  name: 'Matter Server' },
          { entity: 'update.mosquitto_broker', name: 'Mosquitto broker' },
          { entity: 'update.mini_graph_card', name: 'mini-graph-card' },
        ],
        ai_tasks: [
          { entity: 'sensor.claude_ai_task', name: 'Claude AI Task' },
          { entity: 'sensor.deepseek_r1',   name: 'DeepSeek R1 (free)' },
        ],
        ai_tasks_yaml_link: '/lovelace/ai',
      };
    }
  }

  customElements.define('wesmart-labs-home-panel', WeSmartLabsHomePanel);

  window.customCards = window.customCards || [];
  window.customCards.push({
    type:        'wesmart-labs-home-panel',
    name:        'WeSmart Labs — Home Panel',
    description: '[LABS] Tablet dashboard panel: meteo, presenza, KPI, luci, clima, sicurezza, sistema, AI tasks.',
    preview:     false,
  });

})();
