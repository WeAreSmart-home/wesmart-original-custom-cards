/**
 * Claude Switches Card - Home Assistant Custom Card
 * Multi-entity switch card with interactive toggle icons.
 * Styled after Claude aesthetic, based on the sensor card design.
 * Version: 1.0.0
 */

(() => {

    const CARD_VERSION = '1.0.0';

    // ─── Default definitions ─────────────────────────────────────────────────────

    const SWITCH_DEFS = {
        switch: { icon: 'mdi:switch', color: '#D97757' },
        outlet: { icon: 'mdi:power-socket-eu', color: '#D97757' },
        light: { icon: 'mdi:lightbulb', color: '#D97757' },
        fan: { icon: 'mdi:fan', color: '#60B4D8' },
        input_boolean: { icon: 'mdi:toggle-switch', color: '#D97757' },
        _default: { icon: 'mdi:power', color: '#D97757' },
    };

    function getSwitchDef(deviceClass, domain) {
        return SWITCH_DEFS[deviceClass] || SWITCH_DEFS[domain] || SWITCH_DEFS._default;
    }

    // ─── Styles ───────────────────────────────────────────────────────────────────

    const styles = `
  :host {
    --claude-orange: #D97757;
    --claude-orange-glow: rgba(217, 119, 87, 0.25);
    --claude-orange-soft: rgba(217, 119, 87, 0.12);
    --claude-radius: 20px;
    --claude-radius-sm: 12px;
    --claude-radius-xs: 8px;
    --transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    display: block;
    font-family: -apple-system, 'Söhne', 'Inter', BlinkMacSystemFont, sans-serif;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  /* ── Themes (Dark default) ── */
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
    padding: 18px 18px 16px;
    box-shadow: var(--shadow);
    transition: var(--transition);
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
    margin: 0 0 10px;
  }

  /* ── List ── */
  .list {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 8px;
    border-radius: var(--claude-radius-xs);
    transition: background 0.2s ease;
    cursor: pointer;
  }

  .row:hover { background: var(--row-hover-bg); }
  .row.unavailable { opacity: 0.4; pointer-events: none; }

  /* Icon Button */
  .icon-btn {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    background: var(--surface);
    border: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: var(--transition);
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .row.on .icon-btn {
    border-color: var(--claude-orange);
    background: var(--claude-orange-soft);
    box-shadow: 0 0 12px var(--claude-orange-glow);
  }

  .icon-btn ha-icon {
    --mdc-icon-size: 18px;
    color: var(--text-dim);
    transition: var(--transition);
  }

  .row.on .icon-btn ha-icon {
    color: var(--claude-orange);
  }

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
    text-transform: capitalize;
  }

  /* Toggle Pill (Visual Only) */
  .status-pill {
    font-size: 10px;
    font-weight: 700;
    padding: 3px 10px;
    border-radius: 20px;
    background: var(--surface);
    color: var(--text-dim);
    letter-spacing: 0.03em;
    text-transform: uppercase;
    transition: var(--transition);
  }

  .row.on .status-pill {
    background: var(--claude-orange);
    color: white;
  }
`;

    // ─── Custom Element ────────────────────────────────────────────────────────────

    class ClaudeSwitchesCard extends HTMLElement {
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
                title: 'Switches',
                icon: 'mdi:toggle-switch',
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
        <div class="icon-btn" id="icon-btn-${i}">
          <ha-icon id="icon-${i}" icon="mdi:power"></ha-icon>
        </div>
        <div class="row-info" id="info-${i}">
          <div class="row-name" id="name-${i}">${e.name || e.entity}</div>
          <div class="row-status" id="status-${i}">—</div>
        </div>
        <div class="status-pill" id="pill-${i}">OFF</div>
      </div>
    `).join('');

            this._card.innerHTML = `
      <div class="header">
        <div class="header-icon-wrap"><ha-icon icon="${this._config.icon}"></ha-icon></div>
        <div class="header-title">${this._config.title}</div>
      </div>
      <div class="separator"></div>
      <div class="list">${rowsHTML}</div>
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

                const domain = cfg.entity.split('.')[1];
                const isOn = stateObj.state === 'on';
                const isUnavail = stateObj.state === 'unavailable' || stateObj.state === 'unknown';
                const attrs = stateObj.attributes || {};
                const def = getSwitchDef(attrs.device_class, domain);

                row.classList.toggle('on', isOn);
                row.classList.toggle('unavailable', isUnavail);

                const iconEl = this._q(`#icon-${i}`);
                if (iconEl) iconEl.setAttribute('icon', cfg.icon || attrs.icon || def.icon);

                const nameEl = this._q(`#name-${i}`);
                if (nameEl) nameEl.textContent = cfg.name || attrs.friendly_name || cfg.entity;

                const statusEl = this._q(`#status-${i}`);
                if (statusEl) statusEl.textContent = isUnavail ? 'Unavailable' : stateObj.state;

                const pillEl = this._q(`#pill-${i}`);
                if (pillEl) pillEl.textContent = isOn ? 'ON' : 'OFF';
            });
        }

        _bindEvents() {
            this._entities.forEach((cfg, i) => {
                // Icon click -> Toggle
                this._q(`#icon-btn-${i}`)?.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this._hass.callService('homeassistant', 'toggle', { entity_id: cfg.entity });
                });

                // Row click -> More Info
                this._q(`#row-${i}`)?.addEventListener('click', () => {
                    const ev = new Event('hass-more-info', { bubbles: true, composed: true });
                    ev.detail = { entityId: cfg.entity };
                    this.dispatchEvent(ev);
                });
            });
        }

        _q(selector) {
            return this.shadowRoot.querySelector(selector);
        }
    }

    customElements.define('claude-switches-card', ClaudeSwitchesCard);

    window.customCards = window.customCards || [];
    window.customCards.push({
        type: 'claude-switches-card',
        name: 'Claude Switches Card',
        description: 'Multi-entity toggle card with interactive icons.',
        preview: true,
    });

})();
