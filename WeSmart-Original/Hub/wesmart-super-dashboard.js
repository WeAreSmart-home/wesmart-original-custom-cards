/**
 * WeSmart Super Dashboard - Home Assistant Custom Card
 * An all-in-one automated dashboard with auto-discovery, 
 * tabbed navigation, and Claude-inspired aesthetics.
 * Version: 1.0.0
 */

(() => {
    const CARD_VERSION = '1.0.0';

    const TABS = {
        OVERVIEW: 'overview',
        LIGHTS: 'lights',
        CLIMATE: 'climate',
        SENSORS: 'sensors',
        SWITCHES: 'switches',
        SETTINGS: 'settings'
    };

    const DOMAIN_CONFIG = {
        light: { tab: TABS.LIGHTS, icon: 'mdi:lightbulb', label: 'Luci', color: 'var(--claude-orange)' },
        climate: { tab: TABS.CLIMATE, icon: 'mdi:thermostat', label: 'Clima', color: 'var(--claude-blue)' },
        sensor: { tab: TABS.SENSORS, icon: 'mdi:chart-line', label: 'Sensori', color: 'var(--claude-yellow)' },
        switch: { tab: TABS.SWITCHES, icon: 'mdi:toggle-switch', label: 'Interruttori', color: 'var(--claude-orange)' },
        binary_sensor: { tab: TABS.SENSORS, icon: 'mdi:door', label: 'Sicurezza', color: 'var(--claude-orange)' }
    };

    const styles = `
    :host {
      --claude-orange: #D97757;
      --claude-blue: #60B4D8;
      --claude-yellow: #D4A84B;
      --claude-radius: 28px;
      --claude-radius-sm: 16px;
      --claude-radius-xs: 10px;
      --transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      display: block;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
    }

    .dashboard {
      --bg: #1C1917;
      --surface: #292524;
      --surface-2: #332E2A;
      --border: rgba(255, 255, 255, 0.08);
      --text: #F5F0EB;
      --text-muted: #A09080;
      --text-dim: #6B5F56;
      --shadow: 0 20px 60px rgba(0, 0, 0, 0.6);

      background: var(--bg);
      color: var(--text);
      font-family: -apple-system, 'Söhne', 'Inter', BlinkMacSystemFont, sans-serif;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      position: relative;
      overflow-x: hidden;
      transition: var(--transition);
      padding: 0;
    }

    .dashboard.theme-light {
      --bg: #FFFEFA;
      --surface: #F5F0EB;
      --surface-2: #E8E2DA;
      --border: rgba(28, 25, 23, 0.09);
      --text: #1C1917;
      --text-muted: #6B5F56;
      --text-dim: #A09080;
      --shadow: 0 8px 32px rgba(0,0,0,0.06);
    }

    /* Glow Background */
    .dashboard::before {
      content: '';
      position: fixed;
      top: -100px;
      right: -100px;
      width: 600px;
      height: 600px;
      background: radial-gradient(circle, rgba(217, 119, 87, 0.05), transparent 70%);
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
    }

    .greeting p {
      color: var(--claude-orange);
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
      border-radius: var(--claude-radius-sm);
      border: 1px solid var(--border);
      width: fit-content;
      margin-top: 24px;
      overflow-x: auto;
      scrollbar-width: none;
    }
    .tabs-nav::-webkit-scrollbar { display: none; }

    .tab-btn {
      padding: 10px 20px;
      border-radius: var(--claude-radius-xs);
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

    .tab-btn:hover { color: var(--text-muted); background: rgba(255,255,255,0.03); }
    .tab-btn.active {
      background: var(--surface-2);
      color: var(--text);
      box-shadow: 0 2px 10px rgba(0,0,0,0.15);
    }

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
      to { opacity: 1; transform: translateY(0); }
    }

    /* ── Grid Layouts ── */
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
    }
    .section-header h2 ha-icon { color: var(--claude-orange); }

    .btn-more {
      font-size: 13px;
      font-weight: 600;
      color: var(--claude-orange);
      cursor: pointer;
      text-decoration: underline;
      text-underline-offset: 4px;
    }

    .card-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 16px;
    }

    /* ── Entity Card ── */
    .entity-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--claude-radius-sm);
      padding: 18px;
      display: flex;
      align-items: center;
      gap: 16px;
      transition: var(--transition);
      cursor: pointer;
      position: relative;
    }

    .entity-card:hover { border-color: rgba(255,255,255,0.2); transform: translateY(-2px); }
    
    .icon-box {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      background: var(--surface-2);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: var(--transition);
    }

    .entity-card.on .icon-box { background: var(--claude-orange); color: white; box-shadow: 0 0 20px rgba(217,119,87,0.3); }
    .entity-card.on ha-icon { color: white !important; }

    .info { flex: 1; }
    .name { font-size: 15px; font-weight: 600; margin-bottom: 2px; }
    .status { font-size: 12px; color: var(--text-muted); }

    .toggle {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: var(--surface-2);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    /* ── Settings Row ── */
    .settings-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 0;
      border-bottom: 1px solid var(--border);
    }
    .settings-row:last-child { border: none; }
    
    .switch-ui {
      width: 44px;
      height: 24px;
      background: var(--surface-2);
      border-radius: 12px;
      position: relative;
      cursor: pointer;
      transition: var(--transition);
    }
    .switch-ui.active { background: var(--claude-orange); }
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

    /* Mobile adjustments */
    @media (max-width: 600px) {
      header, main { padding: 24px; }
      .greeting h1 { font-size: 24px; }
      .card-grid { grid-template-columns: 1fr; }
    }
  `;

    class WeSmartSuperDashboard extends HTMLElement {
        constructor() {
            super();
            this.attachShadow({ mode: 'open' });
            this._config = {};
            this._hass = null;
            this._activeTab = TABS.OVERVIEW;
            this._hiddenEntities = JSON.parse(localStorage.getItem('wesmart_dashboard_hidden') || '[]');
        }

        setConfig(config) {
            this._config = {
                title: 'Dashboard',
                theme: 'dark',
                exclude_entities: [],
                max_overview_items: 6,
                ...config
            };
            this._render();
        }

        set hass(hass) {
            const oldHass = this._hass;
            this._hass = hass;

            // Only update if state changed significantly or first time
            if (!oldHass || this._stateChanged(oldHass, hass)) {
                this._updateUI();
            }
        }

        _stateChanged(oldHass, newHass) {
            // Simple heuristic: just update if some relevant entities changed
            // For now, let's keep it simple to ensure reactive UI
            return true;
        }

        _render() {
            const shadow = this.shadowRoot;
            shadow.innerHTML = `
        <style>${styles}</style>
        <div class="dashboard theme-${this._config.theme}">
          <header>
            <div class="header-top">
              <div class="greeting">
                <p id="date-label">Lunedì, 2 Marzo</p>
                <h1 id="greeting-text">Benvenuto</h1>
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
            const now = new Date();
            const hour = now.getHours();
            let greet = 'Buonasera';
            if (hour < 5) greet = 'Buonanotte';
            else if (hour < 12) greet = 'Buongiorno';
            else if (hour < 18) greet = 'Buon pomeriggio';

            const options = { weekday: 'long', day: 'numeric', month: 'long' };
            const dateStr = now.toLocaleDateString('it-IT', options);

            const root = this.shadowRoot;
            root.getElementById('greeting-text').textContent = greet;
            root.getElementById('date-label').textContent = dateStr;
        }

        _renderContent() {
            const root = this.shadowRoot;
            const discovered = this._discoverEntities();

            // Render Overview
            this._renderOverview(root.getElementById(`cnt-${TABS.OVERVIEW}`), discovered);

            // Render Category Tabs
            this._renderCategoryTab(root.getElementById(`cnt-${TABS.LIGHTS}`), 'Luci', discovered.light);
            this._renderCategoryTab(root.getElementById(`cnt-${TABS.CLIMATE}`), 'Clima', discovered.climate);
            this._renderCategoryTab(root.getElementById(`cnt-${TABS.SENSORS}`), 'Sensori & Sicurezza', [...discovered.sensor, ...discovered.binary_sensor]);
            this._renderCategoryTab(root.getElementById(`cnt-${TABS.SWITCHES}`), 'Interruttori', discovered.switch);

            // Render Settings
            this._renderSettings(root.getElementById(`cnt-${TABS.SETTINGS}`), discovered);
        }

        _discoverEntities() {
            const states = this._hass.states;
            const result = { light: [], climate: [], sensor: [], switch: [], binary_sensor: [] };
            const yamlExcluded = this._config.exclude_entities || [];

            Object.keys(states).forEach(eid => {
                const domain = eid.split('.')[1] ? eid.split('.')[0] : '';
                if (result[domain]) {
                    // Check exclusions (YAML and Local)
                    if (yamlExcluded.includes(eid) || this._hiddenEntities.includes(eid)) return;

                    // Filter out groups and internal stuff
                    const attr = states[eid].attributes;
                    if (attr.entity_id && Array.isArray(attr.entity_id)) return; // group
                    if (attr.hidden || attr.entity_category) return; // internal

                    result[domain].push({
                        entity_id: eid,
                        state: states[eid].state,
                        attributes: attr
                    });
                }
            });

            return result;
        }

        _renderOverview(container, discovered) {
            let html = '';
            const limit = this._config.max_overview_items;

            Object.entries(DOMAIN_CONFIG).forEach(([domain, conf]) => {
                const entities = discovered[domain] || [];
                if (entities.length === 0) return;

                const displayEntities = entities.slice(0, limit);

                html += `
          <div class="section-header">
            <h2><ha-icon icon="${conf.icon}"></ha-icon> ${conf.label}</h2>
            ${entities.length > limit ? `<div class="btn-more" data-goto="${conf.tab}">Vedi altri (${entities.length})</div>` : ''}
          </div>
          <div class="card-grid">
            ${displayEntities.map(e => this._renderEntityCard(e)).join('')}
          </div>
        `;
            });

            container.innerHTML = html || '<div class="no-data">Nessuna entità trovata. Verifica i tuoi dispositivi.</div>';
        }

        _renderCategoryTab(container, title, entities) {
            if (!entities || entities.length === 0) {
                container.innerHTML = `
          <div class="section-header"><h2>${title}</h2></div>
          <div class="no-data">Nessuna entità in questa categoria.</div>
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
            const eid = entity.entity_id;
            const state = entity.state;
            const attr = entity.attributes;
            const isOn = state !== 'off' && state !== 'unavailable' && state !== 'closed';
            const domain = eid.split('.')[0];
            const icon = attr.icon || (isOn ? 'mdi:toggle-switch' : 'mdi:toggle-switch-off');

            let statusText = state;
            if (domain === 'climate') statusText = `${attr.current_temperature}°C → ${attr.temperature || '--'}°C`;
            if (domain === 'sensor') statusText = `${state} ${attr.unit_of_measurement || ''}`;

            return `
        <div class="entity-card ${isOn ? 'on' : ''}" data-entity="${eid}">
          <div class="icon-box">
            <ha-icon icon="${icon}"></ha-icon>
          </div>
          <div class="info">
            <div class="name">${attr.friendly_name || eid}</div>
            <div class="status">${statusText.toUpperCase()}</div>
          </div>
          <div class="toggle">
            <ha-icon icon="mdi:chevron-right"></ha-icon>
          </div>
        </div>
      `;
        }

        _renderSettings(container, discovered) {
            // For settings, we show EVERYTHING discovered (even if hidden locally)
            // but NOT those excluded via YAML.
            const yamlExcluded = this._config.exclude_entities || [];
            const allEntities = [];
            const states = this._hass.states;

            Object.keys(states).forEach(eid => {
                const domain = eid.split('.')[0];
                if (DOMAIN_CONFIG[domain] && !yamlExcluded.includes(eid)) {
                    const attr = states[eid].attributes;
                    if (attr.entity_id && Array.isArray(attr.entity_id)) return;
                    allEntities.push({ eid, name: attr.friendly_name || eid, hidden: this._hiddenEntities.includes(eid) });
                }
            });

            container.innerHTML = `
        <div class="section-header"><h2><ha-icon icon="mdi:cog"></ha-icon> Impostazioni Visibilità</h2></div>
        <p style="color: var(--text-muted); font-size: 14px; margin-bottom: 24px;">
          Seleziona quali entità mostrare nella dashboard. Queste impostazioni sono salvate nel browser.
        </p>
        <div class="settings-list">
          ${allEntities.map(e => `
            <div class="settings-row">
              <div class="name">${e.name} <small style="display:block; opacity: 0.5; font-size: 10px;">${e.eid}</small></div>
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

            // Navigate from Overview "View More"
            root.addEventListener('click', e => {
                const more = e.target.closest('.btn-more');
                if (more) this._switchTab(more.dataset.goto);
            });

            // Entity Interaction
            root.addEventListener('click', e => {
                const card = e.target.closest('.entity-card');
                if (card) {
                    const eid = card.dataset.entity;
                    const domain = eid.split('.')[0];

                    if (['light', 'switch', 'input_boolean'].includes(domain)) {
                        this._hass.callService('homeassistant', 'toggle', { entity_id: eid });
                    } else {
                        // Default: fire more-info
                        const event = new CustomEvent('hass-more-info', {
                            detail: { entityId: eid },
                            bubbles: true,
                            composed: true
                        });
                        this.dispatchEvent(event);
                    }
                }
            });

            // Settings Interaction
            root.addEventListener('click', e => {
                const sw = e.target.closest('.switch-ui');
                if (sw) {
                    const eid = sw.dataset.toggleVisibility;
                    this._toggleEntityVisibility(eid);
                }
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
            localStorage.setItem('wesmart_dashboard_hidden', JSON.stringify(this._hiddenEntities));
            this._updateUI();
        }
    }

    customElements.define('wesmart-super-dashboard', WeSmartSuperDashboard);

    window.customCards = window.customCards || [];
    window.customCards.push({
        type: 'wesmart-super-dashboard',
        name: 'WeSmart Super Dashboard',
        description: 'A premium, full-screen dashboard with auto-discovery and Claude-style UI.',
        preview: true,
    });

})();
