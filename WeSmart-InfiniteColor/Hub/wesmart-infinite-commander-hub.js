/**
 * WeSmart Infinite Commander Hub - Home Assistant Custom Card
 * Flagship multifunctional central dashboard hub.
 * Features: Smart greeting, Tabbed interface, Automated alerts.
 * Infinite Color Engine: full palette derived from a single base color.
 * Version: 1.0.0
 */

(() => {

  const CARD_VERSION = '1.0.0';

  // ─── Constants ────────────────────────────────────────────────────────────────

  const TABS = {
    SUMMARY:  'summary',
    CONTROLS: 'controls',
    STATS:    'stats'
  };

  // Fixed semantic colors — cannot be derived from a single accent
  const ALERT_COLOR_LIGHTS  = '#D4A84B'; // amber  — lights on
  const ALERT_COLOR_COVERS  = '#60B4D8'; // blue   — covers open
  const ALERT_COLOR_DEFAULT = 'var(--accent)'; // accent — locks, battery

  const ALERT_DEFINITIONS = {
    lights:  { domain: 'light',  state: 'on',       icon: 'mdi:lightbulb-on',         color: ALERT_COLOR_LIGHTS,  label: 'Lights On' },
    locks:   { domain: 'lock',   state: 'unlocked',  icon: 'mdi:lock-open',            color: ALERT_COLOR_DEFAULT, label: 'Unlocked' },
    covers:  { domain: 'cover',  state: 'open',      icon: 'mdi:window-shutter-open',  color: ALERT_COLOR_COVERS,  label: 'Covers Open' },
    battery: { domain: 'sensor', device_class: 'battery', threshold: 20, icon: 'mdi:battery-alert', color: ALERT_COLOR_DEFAULT, label: 'Low Battery' },
  };

  // ─── Styles ───────────────────────────────────────────────────────────────────

  const styles = `
  :host {
    --radius: 24px;
    --radius-sm: 14px;
    --radius-xs: 8px;
    --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    display: block;
    font-family: -apple-system, 'Söhne', 'Inter', BlinkMacSystemFont, sans-serif;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .card {
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 24px;
    box-shadow: var(--shadow);
    color: var(--text);
    position: relative;
    overflow: hidden;
    min-height: 380px;
    display: flex;
    flex-direction: column;
    transition: var(--transition);
  }

  /* Glassmorphic radial overlay */
  .card::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 50% -20%, var(--accent-glow), transparent 70%);
    pointer-events: none;
  }

  /* ── Greeting ── */
  .greeting-section {
    margin-bottom: 24px;
    position: relative;
    z-index: 1;
  }

  .greeting-time {
    font-size: 13px;
    font-weight: 500;
    color: var(--accent);
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  .greeting-text {
    font-size: 28px;
    font-weight: 700;
    letter-spacing: -0.02em;
    margin-top: 4px;
    color: var(--text);
  }

  /* ── Tabs ── */
  .tabs-nav {
    display: flex;
    background: var(--surface);
    padding: 4px;
    border-radius: var(--radius-sm);
    border: 1px solid var(--border);
    margin-bottom: 24px;
    position: relative;
    z-index: 1;
  }

  .tab-item {
    flex: 1;
    padding: 10px;
    text-align: center;
    font-size: 13px;
    font-weight: 600;
    color: var(--text-dim);
    cursor: pointer;
    border-radius: 10px;
    transition: var(--transition);
    user-select: none;
  }

  .tab-item:hover { color: var(--text-muted); }

  .tab-item.active {
    background: var(--surface2);
    color: var(--text);
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  }

  /* ── Content Area ── */
  .tab-content {
    flex: 1;
    position: relative;
    z-index: 1;
    display: none;
    animation: fadeIn 0.4s ease;
  }

  .tab-content.active { display: flex; flex-direction: column; }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── Summary View ── */
  .summary-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  .summary-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    transition: var(--transition);
  }

  .summary-card:hover { border-color: var(--accent-border); }
  .summary-card ha-icon { --mdc-icon-size: 24px; }
  .summary-card .count { font-size: 20px; font-weight: 700; color: var(--text); }
  .summary-card .label { font-size: 12px; color: var(--text-muted); }

  .no-alerts {
    grid-column: span 2;
    text-align: center;
    padding: 32px;
    color: var(--text-dim);
    font-style: italic;
  }

  /* ── Controls View ── */
  .controls-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .control-row {
    display: flex;
    align-items: center;
    gap: 12px;
    background: var(--surface);
    border: 1px solid var(--border);
    padding: 12px 16px;
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition: var(--transition);
  }

  .control-row:hover { background: var(--surface2); }
  .control-row ha-icon { color: var(--text-dim); transition: var(--transition); --mdc-icon-size: 20px; }
  .row-active ha-icon { color: var(--accent); }

  .control-name  { flex: 1; font-size: 14px; font-weight: 500; color: var(--text); }
  .control-status { font-size: 12px; font-weight: 600; }

  /* ── Stats View ── */
  .stats-wrap {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .stat-block {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .stat-icon {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    background: var(--surface2);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--accent);
    flex-shrink: 0;
  }

  .stat-icon ha-icon { --mdc-icon-size: 22px; }

  .stat-info  { flex: 1; }
  .stat-label { font-size: 11px; color: var(--text-dim); text-transform: uppercase; letter-spacing: 0.05em; }
  .stat-value { font-size: 18px; font-weight: 600; color: var(--text); margin-top: 2px; }

  /* ── Brand ── */
  .brand-mark {
    display: flex;
    align-items: center;
    gap: 5px;
    opacity: 0.35;
    margin-top: auto;
    padding-top: 16px;
    position: relative;
    z-index: 1;
  }

  .brand-mark svg  { width: 13px; height: 13px; }
  .brand-mark span {
    font-size: 10px;
    font-weight: 700;
    color: var(--text-muted);
    letter-spacing: 0.8px;
  }
`;

  // ─── Custom Element ────────────────────────────────────────────────────────────

  class WeSmartInfiniteCommanderHub extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this._config    = {};
      this._hass      = null;
      this._activeTab = TABS.SUMMARY;
      this._palette   = null;
      this._mqHandler = null;
    }

    setConfig(config) {
      this._config = {
        title:    'Commander',
        color:    '#D97757',
        theme:    'dark',
        entities: [],
        stats:    [],
        ...config
      };
      this._applyPalette();
      this._render();
    }

    set hass(hass) {
      this._hass = hass;
      this._updateState();
    }

    disconnectedCallback() {
      if (this._mqHandler) {
        window.matchMedia('(prefers-color-scheme: light)').removeEventListener('change', this._mqHandler);
        this._mqHandler = null;
      }
    }

    // ── Color Engine ─────────────────────────────────────────────────────────────

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

    _clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
    _hsl(h, s, l)       { return `hsl(${h},${s}%,${l}%)`; }
    _hsla(h, s, l, a)   { return `hsla(${h},${s}%,${l}%,${a})`; }

    _buildPalette(hex, isDark) {
      const { h, s, l } = this._hexToHsl(hex);
      const c = this._clamp.bind(this);
      if (isDark) {
        const aL = c(l, 50, 65);
        return {
          accent:       this._hsl(h, s, aL),
          accentSoft:   this._hsla(h, s, aL, 0.08),
          accentGlow:   this._hsla(h, s, aL, 0.20),
          accentBorder: this._hsla(h, s, aL, 0.28),
          bg:           this._hsl(h, c(Math.round(s * 0.30), 20, 40), 9),
          surface:      this._hsl(h, c(Math.round(s * 0.25), 18, 35), 14),
          surface2:     this._hsl(h, c(Math.round(s * 0.20), 15, 28), 19),
          border:       'hsla(0,0%,100%,0.08)',
          text:         this._hsl(h, c(Math.round(s * 0.08), 5, 10), 93),
          textMuted:    this._hsl(h, c(Math.round(s * 0.12), 8, 15), 65),
          textDim:      this._hsl(h, c(Math.round(s * 0.10), 6, 12), 42),
          shadow:       `0 12px 48px ${this._hsla(h, s, 5, 0.50)}`,
        };
      } else {
        const aL = c(l, 35, 52);
        return {
          accent:       this._hsl(h, s, aL),
          accentSoft:   this._hsla(h, s, aL, 0.08),
          accentGlow:   this._hsla(h, s, aL, 0.15),
          accentBorder: this._hsla(h, s, aL, 0.22),
          bg:           this._hsl(h, c(Math.round(s * 0.05), 3, 6), 99),
          surface:      this._hsl(h, c(Math.round(s * 0.08), 5, 10), 95),
          surface2:     this._hsl(h, c(Math.round(s * 0.10), 6, 12), 90),
          border:       `hsla(${h},${s}%,${aL}%,0.12)`,
          text:         this._hsl(h, c(Math.round(s * 0.15), 10, 20), 12),
          textMuted:    this._hsl(h, c(Math.round(s * 0.12), 8, 15), 42),
          textDim:      this._hsl(h, c(Math.round(s * 0.10), 6, 12), 62),
          shadow:       `0 4px 20px ${this._hsla(h, s, 5, 0.08)}, 0 0 0 1px ${this._hsla(h, s, 5, 0.05)}`,
        };
      }
    }

    _applyPalette() {
      const isDark = this._config.theme === 'auto'
        ? !window.matchMedia('(prefers-color-scheme: light)').matches
        : this._config.theme !== 'light';
      this._palette = this._buildPalette(this._config.color || '#D97757', isDark);
      const p = this._palette;
      const s = this.style;
      s.setProperty('--accent',        p.accent);
      s.setProperty('--accent-soft',   p.accentSoft);
      s.setProperty('--accent-glow',   p.accentGlow);
      s.setProperty('--accent-border', p.accentBorder);
      s.setProperty('--bg',            p.bg);
      s.setProperty('--surface',       p.surface);
      s.setProperty('--surface2',      p.surface2);
      s.setProperty('--border',        p.border);
      s.setProperty('--text',          p.text);
      s.setProperty('--text-muted',    p.textMuted);
      s.setProperty('--text-dim',      p.textDim);
      s.setProperty('--shadow',        p.shadow);

      if (this._config.theme === 'auto' && !this._mqHandler) {
        this._mqHandler = () => this._applyPalette();
        window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', this._mqHandler);
      }
    }

    _brandSVG() {
      const fill = this._palette?.accent ?? '#D97757';
      return `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.3 2.45a.74.74 0 0 0-1.38 0l-1.18 3.27H11.3L10.1 2.45a.74.74 0 0 0-1.38 0L7.3 6.37 4.1 7.56a.74.74 0 0 0 0 1.38l3.2 1.19.82 2.28-3.26 1.18a.74.74 0 0 0 0 1.38l3.26 1.18L9.3 19.2l-2.1.76a.74.74 0 0 0 0 1.38l3.26 1.18.45 1.24a.74.74 0 0 0 1.38 0l.45-1.24 3.26-1.18a.74.74 0 0 0 0-1.38l-2.1-.76 1.18-3.27 3.26-1.18a.74.74 0 0 0 0-1.38l-3.26-1.18.82-2.28 3.2-1.19a.74.74 0 0 0 0-1.38l-3.2-1.19-1.37-3.92z" fill="${fill}"/>
      </svg>`;
    }

    // ── Render ───────────────────────────────────────────────────────────────────

    _render() {
      const shadow = this.shadowRoot;
      shadow.innerHTML = '';

      const style = document.createElement('style');
      style.textContent = styles;
      shadow.appendChild(style);

      this._card = document.createElement('div');
      this._card.className = 'card';

      this._card.innerHTML = `
      <div class="greeting-section">
        <div class="greeting-time" id="greeting-time">System Active</div>
        <div class="greeting-text" id="greeting-text">Welcome back</div>
      </div>

      <div class="tabs-nav">
        <div class="tab-item ${this._activeTab === TABS.SUMMARY  ? 'active' : ''}" data-tab="${TABS.SUMMARY}">Summary</div>
        <div class="tab-item ${this._activeTab === TABS.CONTROLS ? 'active' : ''}" data-tab="${TABS.CONTROLS}">Controls</div>
        <div class="tab-item ${this._activeTab === TABS.STATS    ? 'active' : ''}" data-tab="${TABS.STATS}">Sensors</div>
      </div>

      <div class="tab-content ${this._activeTab === TABS.SUMMARY  ? 'active' : ''}" id="content-summary">
        <div class="summary-grid" id="summary-grid"></div>
      </div>

      <div class="tab-content ${this._activeTab === TABS.CONTROLS ? 'active' : ''}" id="content-controls">
        <div class="controls-list" id="controls-list"></div>
      </div>

      <div class="tab-content ${this._activeTab === TABS.STATS    ? 'active' : ''}" id="content-stats">
        <div class="stats-wrap" id="stats-list"></div>
      </div>

      <div class="brand-mark">${this._brandSVG()}<span>WeSmart</span></div>
    `;

      shadow.appendChild(this._card);
      this._bindEvents();
      this._updateState();
    }

    _updateState() {
      if (!this._hass || !this._card) return;

      this._updateGreeting();

      if (this._activeTab === TABS.SUMMARY)  this._updateSummary();
      if (this._activeTab === TABS.CONTROLS) this._updateControls();
      if (this._activeTab === TABS.STATS)    this._updateStats();
    }

    _updateGreeting() {
      const hour = new Date().getHours();
      let greet = 'Good evening';
      if (hour < 12) greet = 'Good morning';
      else if (hour < 18) greet = 'Good afternoon';

      const timeText = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      this._q('#greeting-time').textContent = timeText;
      this._q('#greeting-text').textContent = greet;
    }

    _updateSummary() {
      const grid = this._q('#summary-grid');
      if (!grid) return;

      const alerts = [];

      const lightsOn = this._countEntities('light', 'on');
      if (lightsOn > 0) alerts.push({ ...ALERT_DEFINITIONS.lights, count: lightsOn });

      const locksOpen = this._countEntities('lock', 'unlocked');
      if (locksOpen > 0) alerts.push({ ...ALERT_DEFINITIONS.locks, count: locksOpen });

      const coversOpen = this._countEntities('cover', 'open');
      if (coversOpen > 0) alerts.push({ ...ALERT_DEFINITIONS.covers, count: coversOpen });

      const lowBatt = Object.values(this._hass.states).filter(s =>
        s.attributes.device_class === 'battery' && parseFloat(s.state) <= 20
      ).length;
      if (lowBatt > 0) alerts.push({ ...ALERT_DEFINITIONS.battery, count: lowBatt });

      if (alerts.length === 0) {
        grid.innerHTML = '<div class="no-alerts">Everything looks optimal. No active alerts.</div>';
      } else {
        grid.innerHTML = alerts.map(a => `
          <div class="summary-card">
            <ha-icon icon="${a.icon}" style="color: ${a.color}"></ha-icon>
            <div class="count">${a.count}</div>
            <div class="label">${a.label}</div>
          </div>
        `).join('');
      }
    }

    _countEntities(domain, state) {
      return Object.values(this._hass.states).filter(s => {
        if (!s.entity_id.startsWith(`${domain}.`)) return false;
        if (s.state !== state) return false;
        const attrs = s.attributes || {};
        if (attrs.entity_id && Array.isArray(attrs.entity_id)) return false;
        if (attrs.is_hue_group) return false;
        return true;
      }).length;
    }

    _updateControls() {
      const list = this._q('#controls-list');
      if (!list) return;

      const entities = this._config.entities || [];
      list.innerHTML = entities.map(eid => {
        const state = this._hass.states[eid];
        if (!state) return '';
        const on = state.state === 'on' || state.state === 'open';
        return `
        <div class="control-row ${on ? 'row-active' : ''}" data-entity="${eid}">
          <ha-icon icon="${state.attributes.icon || 'mdi:toggle-switch-outline'}"></ha-icon>
          <div class="control-name">${state.attributes.friendly_name || eid}</div>
          <div class="control-status" style="color: ${on ? 'var(--accent)' : 'var(--text-dim)'}">${state.state.toUpperCase()}</div>
        </div>
      `;
      }).join('');
    }

    _updateStats() {
      const list = this._q('#stats-list');
      if (!list) return;

      const stats = this._config.stats || [];
      list.innerHTML = stats.map(eid => {
        const state = this._hass.states[eid];
        if (!state) return '';
        return `
        <div class="stat-block">
          <div class="stat-icon"><ha-icon icon="${state.attributes.icon || 'mdi:chart-line'}"></ha-icon></div>
          <div class="stat-info">
            <div class="stat-label">${state.attributes.friendly_name || eid}</div>
            <div class="stat-value">${state.state}${state.attributes.unit_of_measurement || ''}</div>
          </div>
        </div>
      `;
      }).join('');
    }

    _bindEvents() {
      this.shadowRoot.querySelectorAll('.tab-item').forEach(tab => {
        tab.addEventListener('click', () => {
          this._activeTab = tab.dataset.tab;
          this._render();
        });
      });

      this._q('#controls-list')?.addEventListener('click', (e) => {
        const row = e.target.closest('.control-row');
        if (row) {
          this._hass.callService('homeassistant', 'toggle', { entity_id: row.dataset.entity });
        }
      });
    }

    _q(s) { return this.shadowRoot.querySelector(s); }
  }

  customElements.define('wesmart-infinite-commander-hub', WeSmartInfiniteCommanderHub);

  window.customCards = window.customCards || [];
  window.customCards.push({
    type:        'wesmart-infinite-commander-hub',
    name:        'WeSmart Infinite Commander Hub',
    description: 'Smart multifunctional dashboard hub with automated alerts and tabbed controls. Infinite Color Engine.',
    preview:     true,
  });

  console.info(
    `%c WESMART INFINITE COMMANDER HUB %c v${CARD_VERSION} `,
    'background:#D97757;color:#fff;font-weight:700;padding:2px 6px;border-radius:4px 0 0 4px',
    'background:#1C1917;color:#D97757;font-weight:600;padding:2px 6px;border-radius:0 4px 4px 0'
  );

})();
