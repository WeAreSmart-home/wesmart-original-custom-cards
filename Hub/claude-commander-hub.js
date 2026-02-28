/**
 * Claude Commander Hub - Home Assistant Custom Card
 * Flagship multifunctional central dashboard hub.
 * Features: Smart greeting, Tabbed interface, Automated alerts.
 * Version: 1.0.0
 */

(() => {

    const CARD_VERSION = '1.0.0';

    // ─── Constants ────────────────────────────────────────────────────────────────

    const TABS = {
        SUMMARY: 'summary',
        CONTROLS: 'controls',
        STATS: 'stats'
    };

    const ALERT_DEFINITIONS = {
        lights: { domain: 'light', state: 'on', icon: 'mdi:lightbulb-on', color: '#D4A84B', label: 'Lights' },
        locks: { domain: 'lock', state: 'unlocked', icon: 'mdi:lock-open', color: '#D97757', label: 'Unlocked' },
        covers: { domain: 'cover', state: 'open', icon: 'mdi:window-shutter-open', color: '#60B4D8', label: 'Covers' },
        battery: { domain: 'sensor', device_class: 'battery', threshold: 20, icon: 'mdi:battery-alert', color: '#D97757', label: 'Low Battery' },
    };

    // ─── Styles ───────────────────────────────────────────────────────────────────

    const styles = `
  :host {
    --claude-orange: #D97757;
    --claude-blue: #60B4D8;
    --claude-yellow: #D4A84B;
    --claude-radius: 24px;
    --claude-radius-sm: 14px;
    --claude-radius-xs: 8px;
    --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    display: block;
    font-family: -apple-system, 'Söhne', 'Inter', BlinkMacSystemFont, sans-serif;
  }

  /* ── Themes ── */
  .card {
    --bg:            #1C1917;
    --surface:       #292524;
    --surface-2:     #332E2A;
    --border:        rgba(255, 255, 255, 0.08);
    --text:          #F5F0EB;
    --text-muted:    #A09080;
    --text-dim:      #6B5F56;
    --shadow:        0 12px 48px rgba(0, 0, 0, 0.5);

    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: var(--claude-radius);
    padding: 24px;
    box-shadow: var(--shadow);
    color: var(--text);
    position: relative;
    overflow: hidden;
    min-height: 380px;
    display: flex;
    flex-direction: column;
  }

  /* Glassmorphic overlay */
  .card::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 50% -20%, rgba(217, 119, 87, 0.08), transparent 70%);
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
    color: var(--claude-orange);
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  .greeting-text {
    font-size: 28px;
    font-weight: 700;
    letter-spacing: -0.02em;
    margin-top: 4px;
  }

  /* ── Tabs ── */
  .tabs-nav {
    display: flex;
    background: var(--surface);
    padding: 4px;
    border-radius: var(--claude-radius-sm);
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
    background: var(--surface-2);
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
    to { opacity: 1; transform: translateY(0); }
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
    border-radius: var(--claude-radius-sm);
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    transition: var(--transition);
  }

  .summary-card:hover { border-color: rgba(255,255,255,0.15); }

  .summary-card ha-icon { --mdc-icon-size: 24px; }
  .summary-card .count { font-size: 20px; font-weight: 700; }
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
    border-radius: var(--claude-radius-sm);
    cursor: pointer;
    transition: var(--transition);
  }

  .control-row:hover { background: var(--surface-2); }
  
  .control-row ha-icon { color: var(--text-dim); transition: var(--transition); }
  .row-active ha-icon { color: var(--claude-orange); }

  .control-name { flex: 1; font-size: 14px; font-weight: 500; }

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
    background: var(--surface-2);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--claude-blue);
  }

  .stat-info { flex: 1; }
  .stat-label { font-size: 11px; color: var(--text-dim); text-transform: uppercase; letter-spacing: 0.05em; }
  .stat-value { font-size: 18px; font-weight: 600; }
`;

    // ─── Custom Element ────────────────────────────────────────────────────────────

    class ClaudeCommanderHub extends HTMLElement {
        constructor() {
            super();
            this.attachShadow({ mode: 'open' });
            this._config = {};
            this._hass = null;
            this._activeTab = TABS.SUMMARY;
        }

        setConfig(config) {
            this._config = {
                title: 'Commander',
                entities: [], // Controls
                stats: [],    // Stats
                ...config
            };
            this._render();
        }

        set hass(hass) {
            this._hass = hass;
            this._updateState();
        }

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
        <div class="tab-item ${this._activeTab === TABS.SUMMARY ? 'active' : ''}" data-tab="${TABS.SUMMARY}">Summary</div>
        <div class="tab-item ${this._activeTab === TABS.CONTROLS ? 'active' : ''}" data-tab="${TABS.CONTROLS}">Controls</div>
        <div class="tab-item ${this._activeTab === TABS.STATS ? 'active' : ''}" data-tab="${TABS.STATS}">Sensors</div>
      </div>

      <div class="tab-content ${this._activeTab === TABS.SUMMARY ? 'active' : ''}" id="content-summary">
        <div class="summary-grid" id="summary-grid"></div>
      </div>

      <div class="tab-content ${this._activeTab === TABS.CONTROLS ? 'active' : ''}" id="content-controls">
        <div class="controls-list" id="controls-list"></div>
      </div>

      <div class="tab-content ${this._activeTab === TABS.STATS ? 'active' : ''}" id="content-stats">
        <div class="stats-wrap" id="stats-list"></div>
      </div>
    `;

            shadow.appendChild(this._card);
            this._bindEvents();
            this._updateState();
        }

        _updateState() {
            if (!this._hass || !this._card) return;

            this._updateGreeting();

            if (this._activeTab === TABS.SUMMARY) this._updateSummary();
            if (this._activeTab === TABS.CONTROLS) this._updateControls();
            if (this._activeTab === TABS.STATS) this._updateStats();
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

            // Logic for lights
            const lightsOn = Object.values(this._hass.states).filter(s => s.entity_id.startsWith('light.') && s.state === 'on').length;
            if (lightsOn > 0) alerts.push({ ...ALERT_DEFINITIONS.lights, count: lightsOn });

            // Logic for locks
            const locksOpen = Object.values(this._hass.states).filter(s => s.entity_id.startsWith('lock.') && s.state === 'unlocked').length;
            if (locksOpen > 0) alerts.push({ ...ALERT_DEFINITIONS.locks, count: locksOpen });

            // Logic for covers
            const coversOpen = Object.values(this._hass.states).filter(s => s.entity_id.startsWith('cover.') && s.state === 'open').length;
            if (coversOpen > 0) alerts.push({ ...ALERT_DEFINITIONS.covers, count: coversOpen });

            // Logic for low batteries
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
          <div class="control-status" style="color: ${on ? 'var(--claude-orange)' : 'var(--text-dim)'}">${state.state.toUpperCase()}</div>
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
            // Tab switching
            this.shadowRoot.querySelectorAll('.tab-item').forEach(tab => {
                tab.addEventListener('click', () => {
                    const target = tab.dataset.tab;
                    this._activeTab = target;
                    this._render(); // Re-render to clear/show tabs
                });
            });

            // Control toggles
            this._q('#controls-list')?.addEventListener('click', (e) => {
                const row = e.target.closest('.control-row');
                if (row) {
                    const eid = row.dataset.entity;
                    this._hass.callService('homeassistant', 'toggle', { entity_id: eid });
                }
            });
        }

        _q(s) { return this.shadowRoot.querySelector(s); }
    }

    customElements.define('claude-commander-hub', ClaudeCommanderHub);

    window.customCards = window.customCards || [];
    window.customCards.push({
        type: 'claude-commander-hub',
        name: 'Claude Commander Hub',
        description: 'Smart multifunctional dashboard hub with automated alerts and tabbed controls.',
        preview: true,
    });

})();
