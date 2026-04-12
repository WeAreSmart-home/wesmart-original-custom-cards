/**
 * WeSmart Person Card - Home Assistant Custom Card
 * Multi-entity presence and tracking card
 * Supports dark / light / auto themes
 * Version: 1.0.0
 */

(() => {

const CARD_VERSION = '1.0.0';

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = `
  :host {
    --claude-orange: #D97757;
    --claude-orange-glow: rgba(217, 119, 87, 0.25);
    --claude-orange-soft: rgba(217, 119, 87, 0.12);
    --claude-green: #7EC8A0;
    --claude-green-soft: rgba(126, 200, 160, 0.12);
    --claude-radius: 20px;
    --claude-radius-sm: 12px;
    --claude-radius-xs: 8px;
    --transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    display: block;
    font-family: -apple-system, 'Söhne', 'Inter', BlinkMacSystemFont, sans-serif;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  /* ── Dark theme (default) ── */
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
    position: relative;
    overflow: hidden;
    box-shadow: var(--shadow);
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
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
    flex-shrink: 0;
  }

  .header-icon-wrap ha-icon {
    --mdc-icon-size: 20px;
    color: var(--claude-orange);
  }

  .header-titles { flex: 1; min-width: 0; }

  .header-title {
    font-size: 15px;
    font-weight: 600;
    color: var(--text);
    letter-spacing: -0.01em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .header-subtitle {
    font-size: 12px;
    color: var(--text-muted);
    margin-top: 2px;
  }

  /* ── Separator ── */
  .separator {
    height: 1px;
    background: var(--border);
    margin: 0 0 10px;
  }

  /* ── Person list ── */
  .person-list {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .person-row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 9px 8px 9px 6px;
    border-radius: var(--claude-radius-xs);
    transition: background 0.2s ease;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }

  .person-row:hover { background: var(--row-hover-bg); }

  .person-row.unavailable {
    opacity: 0.38;
    pointer-events: none;
  }

  /* row icon / avatar */
  .row-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: var(--surface);
    border: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    overflow: hidden;
    position: relative;
  }
  
  .row-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .row-avatar ha-icon {
    --mdc-icon-size: 20px;
    color: var(--text-dim);
  }

  /* Status Indicator dot */
  .status-dot {
    position: absolute;
    bottom: -2px;
    right: -2px;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: var(--surface);
    border: 2px solid var(--bg);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: var(--transition);
  }
  
  .status-dot.home {
    background: var(--claude-green);
  }
  
  .status-dot.away {
    background: var(--text-dim);
  }
  
  .status-dot.zone {
    background: var(--claude-orange);
  }

  /* row info */
  .row-info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .row-name {
    font-size: 14px;
    font-weight: 500;
    color: var(--text);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .row-meta {
    font-size: 12px;
    color: var(--text-muted);
    margin-top: 2px;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  /* battery info */
  .battery-info {
    display: flex;
    align-items: center;
    gap: 2px;
  }
  .battery-info ha-icon {
    --mdc-icon-size: 12px;
  }

  /* ── Footer ── */
  .footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid var(--border);
  }

  .footer-info {
    font-size: 11px;
    color: var(--text-dim);
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .brand-mark {
    display: flex;
    align-items: center;
    gap: 5px;
    opacity: 0.4;
  }

  .brand-mark svg { width: 14px; height: 14px; }

  .brand-mark span {
    font-size: 10px;
    color: var(--text-dim);
    letter-spacing: 0.05em;
  }
`;

// ─── Custom Element ────────────────────────────────────────────────────────────

class WeSmartPersonCard extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._config   = {};
    this._hass     = null;
    this._entities = [];
  }

  // ── HA lifecycle ─────────────────────────────────────────────────────────────

  static getStubConfig() {
    return {
      title:    'Family',
      entities: ['person.admin'],
    };
  }

  setConfig(config) {
    if (!config.entities?.length) throw new Error('entities array is required');
    this._config = {
      title:  'Family',
      icon:   'mdi:account-group',
      theme:  'dark',   // dark | light | auto
      ...config,
    };
    
    // Normalize entities
    this._entities = this._config.entities.map(e =>
      typeof e === 'string' ? { entity: e } : e
    );
    
    this._render();
  }

  set hass(hass) {
    this._hass = hass;
    this._updateState();
  }

  getCardSize() {
    return 1 + Math.ceil((this._entities.length * 58 + 80) / 50);
  }

  // ── Render ───────────────────────────────────────────────────────────────────

  _render() {
    const shadow = this.shadowRoot;
    shadow.innerHTML = '';

    const style = document.createElement('style');
    style.textContent = styles;
    shadow.appendChild(style);

    this._card = document.createElement('div');
    this._card.className = `card theme-${this._config.theme}`;
    this._card.innerHTML = this._getHTML();
    shadow.appendChild(this._card);

    this._bindEvents();
    if (this._hass) {
      this._updateState();
    }
  }

  _getHTML() {
    const cfg = this._config;

    const rowsHTML = this._entities.map((e, i) => `
      <div class="person-row" data-index="${i}" id="row-${i}">
        <div class="row-avatar" id="avatar-${i}">
          <ha-icon icon="mdi:account"></ha-icon>
          <div class="status-dot away" id="status-dot-${i}"></div>
        </div>
        <div class="row-info">
          <div class="row-name" id="name-${i}">${e.name || e.entity}</div>
          <div class="row-meta">
            <span id="state-${i}">—</span>
            <span class="battery-info" id="battery-wrap-${i}" style="display:none">
              <ha-icon id="battery-icon-${i}" icon="mdi:battery"></ha-icon>
              <span id="battery-val-${i}"></span>
            </span>
          </div>
        </div>
      </div>
    `).join('');

    return `
      <!-- Header -->
      <div class="header">
        <div class="header-icon-wrap">
          <ha-icon icon="${cfg.icon}"></ha-icon>
        </div>
        <div class="header-titles">
          <div class="header-title">${cfg.title}</div>
          <div class="header-subtitle" id="header-subtitle">${this._entities.length} person${this._entities.length !== 1 ? 's' : ''}</div>
        </div>
      </div>

      <div class="separator"></div>

      <!-- Person list -->
      <div class="person-list" id="person-list">
        ${rowsHTML}
      </div>

      <!-- Footer -->
      <div class="footer">
        <div class="footer-info">
          <ha-icon icon="mdi:account-group" style="--mdc-icon-size:13px"></ha-icon>
          <span id="footer-count">${this._entities.length} person${this._entities.length !== 1 ? 's' : ''}</span>
        </div>
        <div class="brand-mark">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="#D97757"/>
            <circle cx="12" cy="12" r="4" fill="#D97757" opacity="0.6"/>
          </svg>
          <span>WeSmart</span>
        </div>
      </div>
    `;
  }

  // ── Update ───────────────────────────────────────────────────────────────────

  _updateState() {
    if (!this._hass || !this._card) return;

    let homeCount = 0;

    this._entities.forEach((config, index) => {
      const entityId = config.entity;
      const stateObj = this._hass.states[entityId];

      const rowEl = this.shadowRoot.getElementById(`row-${index}`);
      if (!rowEl) return;

      if (!stateObj) {
        rowEl.classList.add('unavailable');
        return;
      }
      rowEl.classList.remove('unavailable');

      const stateStr = stateObj.state;
      const isHome = stateStr === 'home';
      const isNotHome = stateStr === 'not_home';
      
      if (isHome) homeCount++;

      // Update name
      const nameEl = this.shadowRoot.getElementById(`name-${index}`);
      if (nameEl) {
        nameEl.textContent = config.name || stateObj.attributes.friendly_name || entityId;
      }

      // Update state text
      const stateEl = this.shadowRoot.getElementById(`state-${index}`);
      if (stateEl) {
        if (isHome) {
          stateEl.textContent = 'Home';
          stateEl.style.color = 'var(--claude-green)';
        } else if (isNotHome) {
          stateEl.textContent = 'Away';
          stateEl.style.color = 'var(--text-muted)';
        } else {
          // Probably a specific zone
          stateEl.textContent = stateStr.charAt(0).toUpperCase() + stateStr.slice(1);
          stateEl.style.color = 'var(--claude-orange)';
        }
      }

      // Update avatar
      const avatarEl = this.shadowRoot.getElementById(`avatar-${index}`);
      if (avatarEl) {
        const picture = stateObj.attributes.entity_picture;
        // Check if we need to inject an img or update it
        let img = avatarEl.querySelector('img');
        const icon = avatarEl.querySelector('ha-icon');
        
        if (picture) {
          if (!img) {
            img = document.createElement('img');
            avatarEl.insertBefore(img, avatarEl.firstChild);
          }
          img.src = picture;
          if (icon) icon.style.display = 'none';
        } else {
          if (img) img.style.display = 'none';
          if (icon) icon.style.display = '';
        }
      }

      // Update status dot
      const dotEl = this.shadowRoot.getElementById(`status-dot-${index}`);
      if (dotEl) {
        dotEl.className = 'status-dot'; // reset
        if (isHome) dotEl.classList.add('home');
        else if (isNotHome) dotEl.classList.add('away');
        else dotEl.classList.add('zone');
      }

      // Battery handling if configured
      const batteryWrap = this.shadowRoot.getElementById(`battery-wrap-${index}`);
      if (config.battery_entity && batteryWrap) {
        const battStateObj = this._hass.states[config.battery_entity];
        if (battStateObj) {
          batteryWrap.style.display = 'flex';
          const valEl = this.shadowRoot.getElementById(`battery-val-${index}`);
          const iconEl = this.shadowRoot.getElementById(`battery-icon-${index}`);
          
          const level = parseInt(battStateObj.state, 10);
          if (!isNaN(level)) {
            valEl.textContent = level + '%';
            // Simple battery icon logic
            if (level > 90) iconEl.icon = 'mdi:battery';
            else if (level > 80) iconEl.icon = 'mdi:battery-90';
            else if (level > 70) iconEl.icon = 'mdi:battery-80';
            else if (level > 60) iconEl.icon = 'mdi:battery-70';
            else if (level > 50) iconEl.icon = 'mdi:battery-60';
            else if (level > 40) iconEl.icon = 'mdi:battery-50';
            else if (level > 30) iconEl.icon = 'mdi:battery-40';
            else if (level > 20) iconEl.icon = 'mdi:battery-30';
            else if (level > 10) iconEl.icon = 'mdi:battery-20';
            else iconEl.icon = 'mdi:battery-10';
            
            if (level <= 20) {
              batteryWrap.style.color = 'var(--claude-orange)';
            } else {
              batteryWrap.style.color = 'var(--text-dim)';
            }
          }
        } else {
          batteryWrap.style.display = 'none';
        }
      }
    });

    // Update header subtitle
    const subtitleEl = this.shadowRoot.getElementById('header-subtitle');
    if (subtitleEl) {
      subtitleEl.textContent = `${homeCount} home · ${this._entities.length} total`;
    }
  }

  // ── Events ───────────────────────────────────────────────────────────────────

  _bindEvents() {
    this._entities.forEach((config, index) => {
      const row = this.shadowRoot.getElementById(`row-${index}`);
      if (!row) return;

      row.addEventListener('click', () => {
        this._fireEvent('hass-more-info', { entityId: config.entity });
      });
    });
  }

  _fireEvent(type, detail) {
    const event = new CustomEvent(type, {
      bubbles: true,
      cancelable: false,
      composed: true,
      detail: detail,
    });
    this.dispatchEvent(event);
  }
}

customElements.define('wesmart-person-card', WeSmartPersonCard);

// ─── Register Card in Custom Cards ──────────────────────────────────────────────

window.customCards = window.customCards || [];
window.customCards.push({
  type: 'wesmart-person-card',
  name: 'WeSmart Person Card',
  description: 'A minimal card to display person presence and zones.',
  preview: true
});

})();