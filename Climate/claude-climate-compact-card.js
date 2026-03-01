/**
 * Claude Climate Compact Card - Home Assistant Custom Card
 * Space-efficient multi-entity climate card.
 * Styled after Claude aesthetic.
 * Version: 1.0.0
 */

(() => {

    const CARD_VERSION = '1.0.0';

    // ─── Constants ────────────────────────────────────────────────────────────────

    const ACTION_COLORS = {
        heating: 'var(--claude-orange)',
        cooling: 'var(--claude-blue)',
        idle: 'var(--text-muted)',
        off: 'var(--text-dim)',
    };

    const ACTION_ICONS = {
        heating: 'mdi:fire',
        cooling: 'mdi:snowflake',
        idle: 'mdi:thermostat',
        off: 'mdi:power-off',
    };

    // ─── Styles ───────────────────────────────────────────────────────────────────

    const styles = `
  :host {
    --claude-orange: #D97757;
    --claude-blue: #60B4D8;
    --claude-radius: 20px;
    --claude-radius-sm: 12px;
    --claude-radius-xs: 8px;
    --transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    display: block;
    font-family: -apple-system, 'Söhne', 'Inter', BlinkMacSystemFont, sans-serif;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  /* ── Themes ── */
  .card {
    --bg:            #292524;
    --surface:       #332E2A;
    --border:        rgba(255, 255, 255, 0.08);
    --text:          #F5F0EB;
    --text-muted:    #A09080;
    --text-dim:      #6B5F56;
    --row-hover-bg:  rgba(255, 255, 255, 0.03);
    --shadow:        0 8px 32px rgba(0, 0, 0, 0.4);

    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: var(--claude-radius);
    padding: 18px 18px 0;
    box-shadow: var(--shadow);
  }

  .card.theme-light {
    --bg:            #FFFEFA;
    --surface:       #F5F0EB;
    --border:        rgba(28, 25, 23, 0.09);
    --text:          #1C1917;
    --text-muted:    #6B5F56;
    --text-dim:      #A09080;
    --row-hover-bg:  rgba(28, 25, 23, 0.03);
    --shadow:        0 2px 16px rgba(0, 0, 0, 0.07), 0 0 0 1px rgba(0, 0, 0, 0.04);
  }

  @media (prefers-color-scheme: light) {
    .card.theme-auto {
      --bg:            #FFFEFA;
      --surface:       #F5F0EB;
      --border:        rgba(28, 25, 23, 0.09);
      --text:          #1C1917;
      --text-muted:    #6B5F56;
      --text-dim:      #A09080;
      --row-hover-bg:  rgba(28, 25, 23, 0.03);
      --shadow:        0 2px 16px rgba(0, 0, 0, 0.07), 0 0 0 1px rgba(0, 0, 0, 0.04);
    }
  }

  /* ── Header ── */
  .header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 14px;
  }

  .header-icon-wrap {
    width: 40px;
    height: 40px;
    border-radius: var(--claude-radius-sm);
    background: var(--surface);
    border: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .header-icon-wrap ha-icon {
    --mdc-icon-size: 20px;
    color: var(--claude-orange);
  }

  .header-title {
    font-size: 15px;
    font-weight: 600;
    color: var(--text);
    flex: 1;
  }

  .separator {
    height: 1px;
    background: var(--border);
    margin-bottom: 10px;
  }

  /* ── List ── */
  .list {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 8px;
    border-radius: var(--claude-radius-xs);
    transition: background 0.2s ease;
    cursor: pointer;
  }

  .row:hover { background: var(--row-hover-bg); }
  .row.unavailable { opacity: 0.4; pointer-events: none; }

  .row-icon-wrap {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    background: var(--surface);
    border: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .row-icon-wrap ha-icon { --mdc-icon-size: 18px; color: var(--text-dim); }

  .row-info { flex: 1; min-width: 0; }

  .row-name {
    font-size: 13px;
    font-weight: 500;
    color: var(--text);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .row-status {
    font-size: 11px;
    color: var(--text-dim);
    margin-top: 1px;
  }

  /* ── Temperature Controls ── */
  .temp-controls {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
  }

  .current-temp-badge {
    font-size: 12px;
    font-weight: 600;
    color: var(--text-muted);
    background: var(--surface);
    padding: 2px 8px;
    border-radius: 12px;
    border: 1px solid var(--border);
    min-width: 42px;
    text-align: center;
  }

  .target-controls {
    display: flex;
    align-items: center;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--claude-radius-xs);
    overflow: hidden;
  }

  .step-btn {
    width: 28px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: var(--text-muted);
    transition: background 0.2s ease;
    border: none;
    background: transparent;
  }

  .step-btn:hover { background: rgba(255,255,255,0.05); color: var(--text); }
  .step-btn:active { transform: scale(0.9); }
  .step-btn ha-icon { --mdc-icon-size: 16px; }

  .target-val {
    min-width: 44px;
    text-align: center;
    font-size: 14px;
    font-weight: 700;
    color: var(--text);
    font-variant-numeric: tabular-nums;
  }

  .unit { font-size: 10px; font-weight: 400; opacity: 0.6; margin-left:1px; }

  /* ── Footer ── */
  .footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 12px;
    padding: 10px 0 14px;
    border-top: 1px solid var(--border);
  }

  .footer-info {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 11px;
    color: var(--text-dim);
  }

  .footer-info ha-icon { --mdc-icon-size: 13px; }

  .brand-mark {
    display: flex;
    align-items: center;
    gap: 5px;
    opacity: 0.35;
  }

  .brand-mark svg  { width: 13px; height: 13px; }
  .brand-mark span {
    font-size: 10px;
    font-weight: 700;
    color: var(--text-muted);
    letter-spacing: 0.8px;
  }
`;

    // ─── Brand mark ───────────────────────────────────────────────────────────────

    const BRAND_SVG = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.3 2.45a.74.74 0 0 0-1.38 0l-1.18 3.27H11.3L10.1 2.45a.74.74 0 0 0-1.38 0L7.3 6.37 4.1 7.56a.74.74 0 0 0 0 1.38l3.2 1.19.82 2.28-3.26 1.18a.74.74 0 0 0 0 1.38l3.26 1.18L9.3 19.2l-2.1.76a.74.74 0 0 0 0 1.38l3.26 1.18.45 1.24a.74.74 0 0 0 1.38 0l.45-1.24 3.26-1.18a.74.74 0 0 0 0-1.38l-2.1-.76 1.18-3.27 3.26-1.18a.74.74 0 0 0 0-1.38l-3.26-1.18.82-2.28 3.2-1.19a.74.74 0 0 0 0-1.38l-3.2-1.19-1.37-3.92z" fill="#D97757"/>
    </svg>`;

    // ─── Custom Element ────────────────────────────────────────────────────────────

    class ClaudeClimateCompactCard extends HTMLElement {
        constructor() {
            super();
            this.attachShadow({ mode: 'open' });
            this._config = {};
            this._hass = null;
            this._entities = [];
        }

        setConfig(config) {
            if (!config.entities?.length) throw new Error('Add entities');
            this._config = {
                title: 'Climate Control',
                icon: 'mdi:thermostat',
                theme: 'dark',
                ...config
            };
            this._entities = this._config.entities.map(e => typeof e === 'string' ? { entity: e } : e);
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
            this._card.className = `card theme-${this._config.theme}`;

            const rowsHTML = this._entities.map((e, i) => `
      <div class="row" data-index="${i}" id="row-${i}">
        <div class="row-icon-wrap" id="icon-wrap-${i}"><ha-icon id="icon-${i}" icon="mdi:thermostat"></ha-icon></div>
        <div class="row-info">
          <div class="row-name" id="name-${i}">${e.name || e.entity}</div>
          <div class="row-status" id="status-${i}">—</div>
        </div>
        <div class="temp-controls">
          <div class="current-temp-badge" id="current-${i}">—°</div>
          <div class="target-controls" id="target-ctrl-${i}">
            <button class="step-btn" id="down-${i}"><ha-icon icon="mdi:minus"></ha-icon></button>
            <div class="target-val" id="target-${i}">—°</div>
            <button class="step-btn" id="up-${i}"><ha-icon icon="mdi:plus"></ha-icon></button>
          </div>
        </div>
      </div>
    `).join('');

            const n = this._entities.length;
            this._card.innerHTML = `
      <div class="header">
        <div class="header-icon-wrap"><ha-icon icon="${this._config.icon}"></ha-icon></div>
        <div class="header-title">${this._config.title}</div>
      </div>
      <div class="separator"></div>
      <div class="list">${rowsHTML}</div>
      <div class="footer">
        <div class="footer-info">
          <ha-icon icon="mdi:thermostat"></ha-icon>
          <span>${n} zone${n !== 1 ? 's' : ''}</span>
        </div>
        <div class="brand-mark">${BRAND_SVG}<span>WeSmart</span></div>
      </div>
    `;

            shadow.appendChild(this._card);
            this._bindEvents();
            this._updateState();
        }

        _updateState() {
            if (!this._hass || !this._card) return;

            this._entities.forEach((cfg, i) => {
                const stateObj = this._hass.states[cfg.entity];
                const row = this._q(`#row-${i}`);
                if (!row || !stateObj) return;

                const attrs = stateObj.attributes || {};
                const action = attrs.hvac_action || stateObj.state;
                const isUnavail = stateObj.state === 'unavailable' || stateObj.state === 'unknown';
                const isOff = stateObj.state === 'off';

                row.classList.toggle('unavailable', isUnavail);

                // Icon & Color
                const iconEl = this._q(`#icon-${i}`);
                if (iconEl) {
                    iconEl.setAttribute('icon', ACTION_ICONS[action] || 'mdi:thermostat');
                    iconEl.style.color = isUnavail ? 'var(--text-dim)' : (ACTION_COLORS[action] || 'var(--text-dim)');
                }

                // Info
                const nameEl = this._q(`#name-${i}`);
                if (nameEl) nameEl.textContent = cfg.name || attrs.friendly_name || cfg.entity;

                const statusEl = this._q(`#status-${i}`);
                if (statusEl) {
                    statusEl.textContent = isUnavail ? 'Unavailable' : (action.charAt(0).toUpperCase() + action.slice(1).replace(/_/g, ' '));
                }

                // Temps
                const currentEl = this._q(`#current-${i}`);
                if (currentEl) currentEl.innerHTML = attrs.current_temperature != null ? `${this._format(attrs.current_temperature)}<span class="unit">°</span>` : '—';

                const targetEl = this._q(`#target-${i}`);
                const stepRow = this._q(`#target-ctrl-${i}`);

                if (stateObj.state === 'heat_cool') {
                    const lo = attrs.target_temp_low;
                    const hi = attrs.target_temp_high;
                    if (targetEl) targetEl.innerHTML = (lo != null && hi != null) ? `${this._format(lo)}<span class="unit">°</span>–${this._format(hi)}<span class="unit">°</span>` : '—';
                    if (stepRow) stepRow.style.opacity = '0.5';
                } else {
                    if (targetEl) targetEl.innerHTML = attrs.temperature != null ? `${this._format(attrs.temperature)}<span class="unit">°</span>` : '—';
                    if (stepRow) {
                        stepRow.style.opacity = isOff ? '0.3' : '1';
                        stepRow.style.pointerEvents = isOff ? 'none' : 'auto';
                    }
                }
            });
        }

        _format(v) { return Number.isInteger(v) ? v : v.toFixed(1); }

        _bindEvents() {
            this._entities.forEach((cfg, i) => {
                // Row Click -> More Info
                this._q(`#row-${i}`)?.addEventListener('click', (e) => {
                    if (e.target.closest('button')) return;
                    const ev = new Event('hass-more-info', { bubbles: true, composed: true });
                    ev.detail = { entityId: cfg.entity };
                    this.dispatchEvent(ev);
                });

                // Step Buttons
                this._q(`#down-${i}`)?.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this._step(cfg.entity, -1);
                });
                this._q(`#up-${i}`)?.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this._step(cfg.entity, 1);
                });
            });
        }

        _step(entityId, dir) {
            const state = this._hass.states[entityId];
            if (!state) return;
            const step = state.attributes.target_temp_step || 0.5;
            const currentTarget = state.attributes.temperature;
            if (currentTarget == null) return;
            const newTarget = currentTarget + (dir * step);
            this._hass.callService('climate', 'set_temperature', { entity_id: entityId, temperature: newTarget });
        }

        _q(s) { return this.shadowRoot.querySelector(s); }
    }

    customElements.define('claude-climate-compact-card', ClaudeClimateCompactCard);

    window.customCards = window.customCards || [];
    window.customCards.push({
        type: 'claude-climate-compact-card',
        name: 'Claude Climate Compact Card',
        description: 'Space-efficient multi-zone climate control.',
        preview: true,
    });

})();
