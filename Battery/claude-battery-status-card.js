/**
 * Claude Battery Status Card - Home Assistant Custom Card
 * Multi-entity battery monitoring card with dynamic icons and coloring.
 * Supports dark / light / auto themes.
 * Version: 1.0.0
 */

(() => {

    const CARD_VERSION = '1.0.0';

    // ─── Helpers ──────────────────────────────────────────────────────────────────

    function getBatteryIcon(level, charging) {
        if (charging) return 'mdi:battery-charging';
        if (level === null || level === undefined || isNaN(level)) return 'mdi:battery-unknown';

        const rounded = Math.round(level / 10) * 10;
        if (rounded >= 100) return 'mdi:battery';
        if (rounded <= 0) return 'mdi:battery-outline';
        return `mdi:battery-${rounded}`;
    }

    function getBatteryColor(level, isUnavail) {
        if (isUnavail) return 'var(--text-dim)';
        if (level === null || level === undefined || isNaN(level)) return 'var(--text-muted)';

        if (level <= 15) return '#D97757'; // Claude Orange for critical
        if (level <= 30) return '#E0A36E'; // Muted Orange/Yellow
        return '#7EC8A0'; // Muted Green
    }

    // ─── Styles ───────────────────────────────────────────────────────────────────

    const styles = `
  :host {
    --claude-orange: #D97757;
    --claude-radius: 20px;
    --claude-radius-sm: 12px;
    --claude-radius-xs: 8px;
    --transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    display: block;
    font-family: -apple-system, 'Söhne', 'Inter', BlinkMacSystemFont, sans-serif;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  /* ── Dark theme ── */
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

  /* ── Light theme ── */
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

  /* ── Auto theme ── */
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

  .header-subtitle {
    font-size: 12px;
    color: var(--text-muted);
  }

  .separator {
    height: 1px;
    background: var(--border);
    margin-bottom: 10px;
  }

  .battery-list {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .battery-row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 8px;
    border-radius: var(--claude-radius-xs);
    cursor: pointer;
    transition: background 0.2s ease;
  }

  .battery-row:hover { background: var(--row-hover-bg); }

  .battery-row.unavailable { opacity: 0.4; }

  .row-icon {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .row-icon ha-icon { --mdc-icon-size: 20px; }

  .row-info { flex: 1; min-width: 0; }

  .row-name {
    font-size: 13px;
    font-weight: 500;
    color: var(--text);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .row-value {
    font-size: 14px;
    font-weight: 600;
    color: var(--text);
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .unit {
    font-size: 11px;
    font-weight: 400;
    color: var(--text-muted);
    margin-left: 1px;
  }

  /* ── Visualization Styles ── */
  
  /* Linear Bar */
  .linear-bar-wrap {
    width: 60px;
    height: 4px;
    background: var(--surface);
    border-radius: 2px;
    overflow: hidden;
    position: relative;
    border: 1px solid var(--border);
  }
  
  .linear-bar-fill {
    height: 100%;
    width: 0%;
    transition: width 1s ease-out, background-color 0.5s ease;
  }

  /* Circular Progress */
  .circular-wrap {
    width: 28px;
    height: 28px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .circular-wrap svg {
    transform: rotate(-90deg);
    width: 100%;
    height: 100%;
  }

  .circular-bg {
    fill: none;
    stroke: var(--surface);
    stroke-width: 3;
  }

  .circular-fill {
    fill: none;
    stroke: var(--claude-orange);
    stroke-width: 3;
    stroke-linecap: round;
    stroke-dasharray: 69.11; /* 2 * PI * 11 */
    stroke-dashoffset: 69.11;
    transition: stroke-dashoffset 1s ease-out, stroke 0.5s ease;
  }

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

    class ClaudeBatteryStatusCard extends HTMLElement {
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
                title: 'Batteries',
                icon: 'mdi:battery-check',
                theme: 'dark',
                display_type: 'icon', // icon | linear | circular
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

            const rowsHTML = this._entities.map((e, i) => {
                const displayType = (e.display_type || this._config.display_type || 'icon').toLowerCase();

                let vizHTML = '';
                if (displayType === 'icon') {
                    vizHTML = `<div class="row-icon"><ha-icon id="icon-${i}" icon="mdi:battery-unknown"></ha-icon></div>`;
                } else if (displayType === 'circular') {
                    vizHTML = `
          <div class="circular-wrap" id="viz-${i}">
            <svg viewBox="0 0 28 28">
              <circle class="circular-bg" cx="14" cy="14" r="11"></circle>
              <circle id="circle-fill-${i}" class="circular-fill" cx="14" cy="14" r="11"></circle>
            </svg>
          </div>`;
                }

                return `
        <div class="battery-row" data-index="${i}" id="row-${i}">
          ${displayType !== 'linear' ? vizHTML : ''}
          <div class="row-info">
            <div class="row-name" id="name-${i}">${e.name || e.entity}</div>
            ${displayType === 'linear' ? `
              <div class="linear-bar-wrap" style="margin-top: 4px; width: 100%;">
                <div id="linear-fill-${i}" class="linear-bar-fill"></div>
              </div>` : ''}
          </div>
          <div class="row-value" id="value-${i}">—</div>
        </div>
      `;
            }).join('');

            const n = this._entities.length;
            this._card.innerHTML = `
      <div class="header">
        <div class="header-icon-wrap"><ha-icon icon="${this._config.icon}"></ha-icon></div>
        <div class="header-title">${this._config.title}</div>
        <div class="header-subtitle" id="subtitle"></div>
      </div>
      <div class="separator"></div>
      <div class="battery-list">${rowsHTML}</div>
      <div class="footer">
        <div class="footer-info">
          <ha-icon icon="mdi:battery"></ha-icon>
          <span>${n} device${n !== 1 ? 's' : ''}</span>
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

            let lowCount = 0;

            this._entities.forEach((cfg, i) => {
                const stateObj = this._hass.states[cfg.entity];
                const row = this._q(`#row-${i}`);
                if (!row) return;

                if (!stateObj) {
                    this._q(`#name-${i}`).textContent = cfg.name || cfg.entity;
                    this._q(`#value-${i}`).textContent = 'Not found';
                    return;
                }

                // Robust level detection
                let rawState = stateObj.state;
                let level = parseFloat(rawState);

                // Fallback to attributes if state is not a number (common for some integrations)
                if (isNaN(level)) {
                    level = parseFloat(stateObj.attributes.battery_level || stateObj.attributes.battery || stateObj.attributes.level);
                }

                const isUnavail = stateObj.state === 'unavailable' || stateObj.state === 'unknown' || isNaN(level);
                const charging = stateObj.attributes.battery_charging === true ||
                    stateObj.attributes.is_charging === true ||
                    stateObj.attributes.charging === true;

                const displayType = (cfg.display_type || this._config.display_type || 'icon').toLowerCase();

                if (!isUnavail && level <= 20) lowCount++;

                row.classList.toggle('unavailable', isUnavail);
                const color = getBatteryColor(level, isUnavail);

                // Update Name
                const nameEl = this._q(`#name-${i}`);
                if (nameEl) nameEl.textContent = cfg.name || stateObj.attributes.friendly_name || cfg.entity;

                // Update Value
                const valueEl = this._q(`#value-${i}`);
                if (valueEl) {
                    valueEl.innerHTML = isUnavail ? 'N/A' : `${Math.round(level)}<span class="unit">%</span>`;
                    if (!isUnavail) valueEl.style.color = color;
                }

                // Update Visualizations
                if (displayType === 'icon') {
                    const iconEl = this._q(`#icon-${i}`);
                    if (iconEl) {
                        iconEl.setAttribute('icon', getBatteryIcon(level, charging));
                        iconEl.style.color = color;
                    }
                } else if (displayType === 'circular') {
                    const circle = this._q(`#circle-fill-${i}`);
                    if (circle) {
                        const radius = 11;
                        const circum = 2 * Math.PI * radius;
                        const offset = circum - (Math.max(0, Math.min(100, level)) / 100) * circum;
                        circle.style.strokeDashoffset = isUnavail ? circum : offset;
                        circle.style.stroke = color;
                    }
                } else if (displayType === 'linear') {
                    const fill = this._q(`#linear-fill-${i}`);
                    if (fill) {
                        fill.style.width = isUnavail ? '0%' : `${Math.max(0, Math.min(100, level))}%`;
                        fill.style.backgroundColor = color;
                    }
                }
            });

            const subtitle = this._q('#subtitle');
            if (subtitle) {
                subtitle.textContent = lowCount > 0 ? `${lowCount} low` : `${this._entities.length} devices`;
                subtitle.style.color = lowCount > 0 ? 'var(--claude-orange)' : 'var(--text-muted)';
            }
        }

        _bindEvents() {
            this._q('.battery-list')?.addEventListener('click', (e) => {
                const row = e.target.closest('.battery-row');
                if (!row) return;
                const idx = row.dataset.index;
                const entityId = this._entities[idx]?.entity;
                if (entityId) {
                    const ev = new Event('hass-more-info', { bubbles: true, composed: true });
                    ev.detail = { entityId };
                    this.dispatchEvent(ev);
                }
            });
        }

        _q(selector) {
            return this.shadowRoot.querySelector(selector);
        }
    }

    customElements.define('claude-battery-status-card', ClaudeBatteryStatusCard);

    window.customCards = window.customCards || [];
    window.customCards.push({
        type: 'claude-battery-status-card',
        name: 'Claude Battery Status Card',
        description: 'Monitor battery levels with Claude aesthetic.',
        preview: true,
    });

})();
