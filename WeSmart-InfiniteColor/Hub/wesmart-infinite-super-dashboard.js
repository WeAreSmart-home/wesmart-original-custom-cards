/**
 * WeSmart Infinite Super Dashboard - Home Assistant Custom Card
 * An all-in-one automated dashboard with auto-discovery,
 * tabbed navigation, and Infinite Color Engine aesthetics.
 * Version: 1.0.0
 */

(() => {
  const CARD_VERSION = '1.0.0';

  const TABS = {
    OVERVIEW:  'overview',
    LIGHTS:    'lights',
    CLIMATE:   'climate',
    SENSORS:   'sensors',
    SWITCHES:  'switches',
    SETTINGS:  'settings'
  };

  // Fixed semantic colors per domain — blue for climate, amber for sensors
  const DOMAIN_CONFIG = {
    light:         { tab: TABS.LIGHTS,   icon: 'mdi:lightbulb',      label: 'Lights',    colorVar: 'var(--accent)' },
    climate:       { tab: TABS.CLIMATE,  icon: 'mdi:thermostat',     label: 'Climate',   colorVar: '#60B4D8' },
    sensor:        { tab: TABS.SENSORS,  icon: 'mdi:chart-line',     label: 'Sensors',   colorVar: '#D4A84B' },
    switch:        { tab: TABS.SWITCHES, icon: 'mdi:toggle-switch',  label: 'Switches',  colorVar: 'var(--accent)' },
    binary_sensor: { tab: TABS.SENSORS,  icon: 'mdi:door',           label: 'Security',  colorVar: 'var(--accent)' },
  };

  // ─── Styles ───────────────────────────────────────────────────────────────────

  const styles = `
  :host {
    --radius: 28px;
    --radius-sm: 16px;
    --radius-xs: 10px;
    --transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    display: block;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    font-family: -apple-system, 'Söhne', 'Inter', BlinkMacSystemFont, sans-serif;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .dashboard {
    background: var(--bg);
    color: var(--text);
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    position: relative;
    overflow-x: hidden;
    transition: var(--transition);
  }

  /* Accent radial glow in background */
  .dashboard::before {
    content: '';
    position: fixed;
    top: -100px;
    right: -100px;
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, var(--accent-glow-bg), transparent 70%);
    pointer-events: none;
    z-index: 0;
  }

  /* ── Header ── */
  header {
    padding: 40px 40px 24px 40px;
    z-index: 10;
  }

  .header-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
  }

  .greeting h1 {
    font-size: 32px;
    font-weight: 700;
    margin: 0;
    letter-spacing: -0.03em;
    color: var(--text);
  }

  .greeting p {
    color: var(--accent);
    font-weight: 600;
    text-transform: uppercase;
    font-size: 13px;
    letter-spacing: 0.1em;
    margin: 4px 0 0 0;
  }

  /* ── Tabs ── */
  .tabs-nav {
    display: flex;
    gap: 8px;
    background: var(--surface);
    padding: 6px;
    border-radius: var(--radius-sm);
    border: 1px solid var(--border);
    width: fit-content;
    margin-top: 24px;
    overflow-x: auto;
    scrollbar-width: none;
  }
  .tabs-nav::-webkit-scrollbar { display: none; }

  .tab-btn {
    padding: 10px 20px;
    border-radius: var(--radius-xs);
    font-size: 14px;
    font-weight: 600;
    color: var(--text-dim);
    cursor: pointer;
    white-space: nowrap;
    transition: var(--transition);
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .tab-btn:hover { color: var(--text-muted); background: var(--surface-hover); }

  .tab-btn.active {
    background: var(--surface2);
    color: var(--text);
    box-shadow: 0 2px 10px rgba(0,0,0,0.15);
  }

  .tab-btn ha-icon { --mdc-icon-size: 16px; }

  /* ── Content ── */
  main {
    flex: 1;
    padding: 0 40px 40px 40px;
    z-index: 5;
  }

  .tab-content {
    display: none;
    animation: slideUp 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .tab-content.active { display: block; }

  @keyframes slideUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── Section headers ── */
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 32px 0 16px 0;
  }

  .section-header h2 {
    font-size: 18px;
    font-weight: 600;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 10px;
    color: var(--text);
  }

  .section-header h2 ha-icon { color: var(--accent); --mdc-icon-size: 20px; }

  .btn-more {
    font-size: 13px;
    font-weight: 600;
    color: var(--accent);
    cursor: pointer;
    text-decoration: underline;
    text-underline-offset: 4px;
  }

  /* ── Card grid ── */
  .card-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 16px;
  }

  /* ── Entity card ── */
  .entity-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    padding: 18px;
    display: flex;
    align-items: center;
    gap: 16px;
    transition: var(--transition);
    cursor: pointer;
    position: relative;
  }

  .entity-card:hover {
    border-color: var(--accent-border);
    transform: translateY(-2px);
  }

  .icon-box {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    background: var(--surface2);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: var(--transition);
    flex-shrink: 0;
  }

  .icon-box ha-icon { --mdc-icon-size: 22px; color: var(--text-muted); transition: var(--transition); }

  .entity-card.on .icon-box {
    background: var(--accent);
    box-shadow: 0 0 20px var(--accent-glow);
  }

  .entity-card.on .icon-box ha-icon { color: white; }

  .info { flex: 1; min-width: 0; }
  .name { font-size: 15px; font-weight: 600; margin-bottom: 2px; color: var(--text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .status { font-size: 12px; color: var(--text-muted); }

  .toggle-arrow {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: var(--surface2);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .toggle-arrow ha-icon { --mdc-icon-size: 16px; color: var(--text-dim); }

  .no-data {
    padding: 48px 0;
    text-align: center;
    color: var(--text-dim);
    font-style: italic;
  }

  /* ── Settings ── */
  .settings-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 0;
    border-bottom: 1px solid var(--border);
  }
  .settings-row:last-child { border: none; }

  .settings-row .name { font-size: 14px; font-weight: 500; color: var(--text); }

  .switch-ui {
    width: 44px;
    height: 24px;
    background: var(--surface2);
    border-radius: 12px;
    position: relative;
    cursor: pointer;
    transition: var(--transition);
    flex-shrink: 0;
  }

  .switch-ui.active { background: var(--accent); }

  .switch-ui::after {
    content: '';
    position: absolute;
    top: 2px;
    left: 2px;
    width: 20px;
    height: 20px;
    background: white;
    border-radius: 50%;
    transition: var(--transition);
  }

  .switch-ui.active::after { left: 22px; }

  /* Mobile */
  @media (max-width: 600px) {
    header, main { padding: 24px; }
    .greeting h1 { font-size: 24px; }
    .card-grid { grid-template-columns: 1fr; }
  }
`;

  // ─── Custom Element ────────────────────────────────────────────────────────────

  class WeSmartInfiniteSuperDashboard extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this._config          = {};
      this._hass            = null;
      this._activeTab       = TABS.OVERVIEW;
      this._hiddenEntities  = JSON.parse(localStorage.getItem('wesmart_inf_dashboard_hidden') || '[]');
      this._palette         = null;
      this._mqHandler       = null;
    }

    setConfig(config) {
      this._config = {
        title:              'Dashboard',
        color:              '#D97757',
        theme:              'dark',
        exclude_entities:   [],
        max_overview_items: 6,
        ...config
      };
      this._applyPalette();
      this._render();
    }

    set hass(hass) {
      this._hass = hass;
      this._updateUI();
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
          accentGlow:   this._hsla(h, s, aL, 0.25),
          accentGlowBg: this._hsla(h, s, aL, 0.05),
          accentBorder: this._hsla(h, s, aL, 0.28),
          bg:           this._hsl(h, c(Math.round(s * 0.30), 20, 40), 8),
          surface:      this._hsl(h, c(Math.round(s * 0.25), 18, 35), 13),
          surface2:     this._hsl(h, c(Math.round(s * 0.20), 15, 28), 18),
          surfaceHover: this._hsla(h, s, aL, 0.04),
          border:       'hsla(0,0%,100%,0.08)',
          text:         this._hsl(h, c(Math.round(s * 0.08), 5, 10), 93),
          textMuted:    this._hsl(h, c(Math.round(s * 0.12), 8, 15), 65),
          textDim:      this._hsl(h, c(Math.round(s * 0.10), 6, 12), 42),
        };
      } else {
        const aL = c(l, 35, 52);
        return {
          accent:       this._hsl(h, s, aL),
          accentGlow:   this._hsla(h, s, aL, 0.20),
          accentGlowBg: this._hsla(h, s, aL, 0.04),
          accentBorder: this._hsla(h, s, aL, 0.22),
          bg:           this._hsl(h, c(Math.round(s * 0.05), 3, 6), 99),
          surface:      this._hsl(h, c(Math.round(s * 0.08), 5, 10), 95),
          surface2:     this._hsl(h, c(Math.round(s * 0.10), 6, 12), 90),
          surfaceHover: this._hsla(h, s, aL, 0.04),
          border:       `hsla(${h},${s}%,${aL}%,0.12)`,
          text:         this._hsl(h, c(Math.round(s * 0.15), 10, 20), 12),
          textMuted:    this._hsl(h, c(Math.round(s * 0.12), 8, 15), 42),
          textDim:      this._hsl(h, c(Math.round(s * 0.10), 6, 12), 62),
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
      s.setProperty('--accent',          p.accent);
      s.setProperty('--accent-glow',     p.accentGlow);
      s.setProperty('--accent-glow-bg',  p.accentGlowBg);
      s.setProperty('--accent-border',   p.accentBorder);
      s.setProperty('--bg',              p.bg);
      s.setProperty('--surface',         p.surface);
      s.setProperty('--surface2',        p.surface2);
      s.setProperty('--surface-hover',   p.surfaceHover);
      s.setProperty('--border',          p.border);
      s.setProperty('--text',            p.text);
      s.setProperty('--text-muted',      p.textMuted);
      s.setProperty('--text-dim',        p.textDim);

      if (this._config.theme === 'auto' && !this._mqHandler) {
        this._mqHandler = () => this._applyPalette();
        window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', this._mqHandler);
      }
    }

    // ── Render ───────────────────────────────────────────────────────────────────

    _render() {
      const shadow = this.shadowRoot;
      shadow.innerHTML = `
        <style>${styles}</style>
        <div class="dashboard">
          <header>
            <div class="header-top">
              <div class="greeting">
                <p id="date-label">—</p>
                <h1 id="greeting-text">Welcome</h1>
              </div>
            </div>
            <div class="tabs-nav" id="tabs-nav">
              <div class="tab-btn active" data-tab="${TABS.OVERVIEW}"><ha-icon icon="mdi:view-dashboard"></ha-icon> Overview</div>
              <div class="tab-btn" data-tab="${TABS.LIGHTS}"><ha-icon icon="mdi:lightbulb"></ha-icon> Lights</div>
              <div class="tab-btn" data-tab="${TABS.CLIMATE}"><ha-icon icon="mdi:thermostat"></ha-icon> Climate</div>
              <div class="tab-btn" data-tab="${TABS.SENSORS}"><ha-icon icon="mdi:chart-line"></ha-icon> Sensors</div>
              <div class="tab-btn" data-tab="${TABS.SWITCHES}"><ha-icon icon="mdi:toggle-switch"></ha-icon> Switches</div>
              <div class="tab-btn" data-tab="${TABS.SETTINGS}"><ha-icon icon="mdi:cog"></ha-icon> Settings</div>
            </div>
          </header>
          <main>
            <div class="tab-content active" id="cnt-${TABS.OVERVIEW}"></div>
            <div class="tab-content" id="cnt-${TABS.LIGHTS}"></div>
            <div class="tab-content" id="cnt-${TABS.CLIMATE}"></div>
            <div class="tab-content" id="cnt-${TABS.SENSORS}"></div>
            <div class="tab-content" id="cnt-${TABS.SWITCHES}"></div>
            <div class="tab-content" id="cnt-${TABS.SETTINGS}"></div>
          </main>
        </div>
      `;
      this._bindEvents();
      this._updateUI();
    }

    _updateUI() {
      if (!this._hass || !this.shadowRoot) return;
      this._updateGreeting();
      this._renderContent();
    }

    _updateGreeting() {
      const now  = new Date();
      const hour = now.getHours();
      let greet  = 'Good evening';
      if (hour < 5)  greet = 'Good night';
      else if (hour < 12) greet = 'Good morning';
      else if (hour < 18) greet = 'Good afternoon';

      const options = { weekday: 'long', day: 'numeric', month: 'long' };
      const dateStr = now.toLocaleDateString(undefined, options);

      const root = this.shadowRoot;
      root.getElementById('greeting-text').textContent = greet;
      root.getElementById('date-label').textContent    = dateStr;
    }

    _renderContent() {
      const root       = this.shadowRoot;
      const discovered = this._discoverEntities();

      this._renderOverview(root.getElementById(`cnt-${TABS.OVERVIEW}`), discovered);
      this._renderCategoryTab(root.getElementById(`cnt-${TABS.LIGHTS}`),   'Lights',             discovered.light);
      this._renderCategoryTab(root.getElementById(`cnt-${TABS.CLIMATE}`),  'Climate',            discovered.climate);
      this._renderCategoryTab(root.getElementById(`cnt-${TABS.SENSORS}`),  'Sensors & Security', [...(discovered.sensor || []), ...(discovered.binary_sensor || [])]);
      this._renderCategoryTab(root.getElementById(`cnt-${TABS.SWITCHES}`), 'Switches',           discovered.switch);
      this._renderSettings(root.getElementById(`cnt-${TABS.SETTINGS}`),    discovered);
    }

    _discoverEntities() {
      const states       = this._hass.states;
      const result       = { light: [], climate: [], sensor: [], switch: [], binary_sensor: [] };
      const yamlExcluded = this._config.exclude_entities || [];

      Object.keys(states).forEach(eid => {
        const domain = eid.split('.')[0];
        if (!result[domain]) return;
        if (yamlExcluded.includes(eid) || this._hiddenEntities.includes(eid)) return;

        const attr = states[eid].attributes;
        if (attr.entity_id && Array.isArray(attr.entity_id)) return; // group
        if (attr.hidden || attr.entity_category)              return; // internal

        result[domain].push({
          entity_id:  eid,
          state:      states[eid].state,
          attributes: attr,
        });
      });

      return result;
    }

    _renderOverview(container, discovered) {
      let html   = '';
      const limit = this._config.max_overview_items;

      Object.entries(DOMAIN_CONFIG).forEach(([domain, conf]) => {
        const entities = discovered[domain] || [];
        if (entities.length === 0) return;

        const display = entities.slice(0, limit);
        html += `
          <div class="section-header">
            <h2><ha-icon icon="${conf.icon}"></ha-icon> ${conf.label}</h2>
            ${entities.length > limit ? `<div class="btn-more" data-goto="${conf.tab}">View all (${entities.length})</div>` : ''}
          </div>
          <div class="card-grid">
            ${display.map(e => this._renderEntityCard(e)).join('')}
          </div>
        `;
      });

      container.innerHTML = html || '<div class="no-data">No entities found. Check your devices.</div>';
    }

    _renderCategoryTab(container, title, entities) {
      if (!entities || entities.length === 0) {
        container.innerHTML = `
          <div class="section-header"><h2>${title}</h2></div>
          <div class="no-data">No entities in this category.</div>
        `;
        return;
      }

      container.innerHTML = `
        <div class="section-header"><h2>${title}</h2></div>
        <div class="card-grid">
          ${entities.map(e => this._renderEntityCard(e)).join('')}
        </div>
      `;
    }

    _renderEntityCard(entity) {
      const eid    = entity.entity_id;
      const state  = entity.state;
      const attr   = entity.attributes;
      const isOn   = state !== 'off' && state !== 'unavailable' && state !== 'closed';
      const domain = eid.split('.')[0];
      const icon   = attr.icon || (isOn ? 'mdi:toggle-switch' : 'mdi:toggle-switch-off');

      let statusText = state;
      if (domain === 'climate') statusText = `${attr.current_temperature}°C → ${attr.temperature || '--'}°C`;
      if (domain === 'sensor')  statusText = `${state} ${attr.unit_of_measurement || ''}`;

      return `
        <div class="entity-card ${isOn ? 'on' : ''}" data-entity="${eid}">
          <div class="icon-box">
            <ha-icon icon="${icon}"></ha-icon>
          </div>
          <div class="info">
            <div class="name">${attr.friendly_name || eid}</div>
            <div class="status">${statusText.toUpperCase()}</div>
          </div>
          <div class="toggle-arrow">
            <ha-icon icon="mdi:chevron-right"></ha-icon>
          </div>
        </div>
      `;
    }

    _renderSettings(container, discovered) {
      const yamlExcluded = this._config.exclude_entities || [];
      const allEntities  = [];
      const states       = this._hass.states;

      Object.keys(states).forEach(eid => {
        const domain = eid.split('.')[0];
        if (!DOMAIN_CONFIG[domain] || yamlExcluded.includes(eid)) return;
        const attr = states[eid].attributes;
        if (attr.entity_id && Array.isArray(attr.entity_id)) return;
        allEntities.push({
          eid,
          name:   attr.friendly_name || eid,
          hidden: this._hiddenEntities.includes(eid),
        });
      });

      container.innerHTML = `
        <div class="section-header">
          <h2><ha-icon icon="mdi:cog"></ha-icon> Visibility Settings</h2>
        </div>
        <p style="color: var(--text-muted); font-size: 14px; margin-bottom: 24px;">
          Choose which entities are shown in the dashboard. Settings are stored in the browser.
        </p>
        <div class="settings-list">
          ${allEntities.map(e => `
            <div class="settings-row">
              <div class="name">
                ${e.name}
                <small style="display:block; opacity:0.5; font-size:10px;">${e.eid}</small>
              </div>
              <div class="switch-ui ${!e.hidden ? 'active' : ''}" data-toggle-visibility="${e.eid}"></div>
            </div>
          `).join('')}
        </div>
      `;
    }

    _bindEvents() {
      const root = this.shadowRoot;

      // Tabs
      root.getElementById('tabs-nav').addEventListener('click', e => {
        const btn = e.target.closest('.tab-btn');
        if (btn) this._switchTab(btn.dataset.tab);
      });

      // "View all" from overview
      root.addEventListener('click', e => {
        const more = e.target.closest('.btn-more');
        if (more) this._switchTab(more.dataset.goto);
      });

      // Entity cards
      root.addEventListener('click', e => {
        const card = e.target.closest('.entity-card');
        if (card) {
          const eid    = card.dataset.entity;
          const domain = eid.split('.')[0];
          if (['light', 'switch', 'input_boolean'].includes(domain)) {
            this._hass.callService('homeassistant', 'toggle', { entity_id: eid });
          } else {
            const ev = new CustomEvent('hass-more-info', {
              detail:   { entityId: eid },
              bubbles:  true,
              composed: true,
            });
            this.dispatchEvent(ev);
          }
        }
      });

      // Settings toggles
      root.addEventListener('click', e => {
        const sw = e.target.closest('.switch-ui[data-toggle-visibility]');
        if (sw) this._toggleEntityVisibility(sw.dataset.toggleVisibility);
      });
    }

    _switchTab(tabId) {
      this._activeTab = tabId;
      const root = this.shadowRoot;
      root.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === tabId));
      root.querySelectorAll('.tab-content').forEach(c => c.classList.toggle('active', c.id === `cnt-${tabId}`));
    }

    _toggleEntityVisibility(eid) {
      if (this._hiddenEntities.includes(eid)) {
        this._hiddenEntities = this._hiddenEntities.filter(id => id !== eid);
      } else {
        this._hiddenEntities.push(eid);
      }
      localStorage.setItem('wesmart_inf_dashboard_hidden', JSON.stringify(this._hiddenEntities));
      this._updateUI();
    }
  }

  customElements.define('wesmart-infinite-super-dashboard', WeSmartInfiniteSuperDashboard);

  window.customCards = window.customCards || [];
  window.customCards.push({
    type:        'wesmart-infinite-super-dashboard',
    name:        'WeSmart Infinite Super Dashboard',
    description: 'Full-screen auto-discovery dashboard with Infinite Color Engine and tabbed navigation.',
    preview:     true,
  });

  console.info(
    `%c WESMART INFINITE SUPER DASHBOARD %c v${CARD_VERSION} `,
    'background:#D97757;color:#fff;font-weight:700;padding:2px 6px;border-radius:4px 0 0 4px',
    'background:#1C1917;color:#D97757;font-weight:600;padding:2px 6px;border-radius:0 4px 4px 0'
  );

})();
