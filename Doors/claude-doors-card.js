/**
 * Claude Doors Card - Home Assistant Custom Card
 * Multi-entity door / window / contact sensor card
 * Supports dark / light / auto themes
 * Version: 1.0.0
 */

(() => {

const CARD_VERSION = '1.0.0';

// ─── Icon map by device_class ─────────────────────────────────────────────────

const DEVICE_CLASS_DEFS = {
  door:         { iconOpen: 'mdi:door-open',           iconClosed: 'mdi:door-closed',          label: 'Door'    },
  window:       { iconOpen: 'mdi:window-open',         iconClosed: 'mdi:window-closed',         label: 'Window'  },
  garage_door:  { iconOpen: 'mdi:garage-open',         iconClosed: 'mdi:garage',                label: 'Garage'  },
  opening:      { iconOpen: 'mdi:lock-open',           iconClosed: 'mdi:lock',                  label: 'Opening' },
  lock:         { iconOpen: 'mdi:lock-open',           iconClosed: 'mdi:lock',                  label: 'Lock'    },
  motion:       { iconOpen: 'mdi:motion-sensor',       iconClosed: 'mdi:motion-sensor-off',     label: 'Motion'  },
  vibration:    { iconOpen: 'mdi:vibrate',             iconClosed: 'mdi:vibrate-off',           label: 'Vibration' },
  moisture:     { iconOpen: 'mdi:water',               iconClosed: 'mdi:water-off',             label: 'Moisture' },
  smoke:        { iconOpen: 'mdi:smoke-detector-alert',iconClosed: 'mdi:smoke-detector',        label: 'Smoke'   },
  gas:          { iconOpen: 'mdi:gas-cylinder',        iconClosed: 'mdi:gas-burner',            label: 'Gas'     },
  _default:     { iconOpen: 'mdi:alert-circle-outline',iconClosed: 'mdi:checkbox-blank-circle-outline', label: 'Sensor' },
};

// open-state text per device_class
const STATE_LABELS = {
  door:        { open: 'Open',      closed: 'Closed'    },
  window:      { open: 'Open',      closed: 'Closed'    },
  garage_door: { open: 'Open',      closed: 'Closed'    },
  opening:     { open: 'Open',      closed: 'Closed'    },
  lock:        { open: 'Unlocked',  closed: 'Locked'    },
  motion:      { open: 'Detected',  closed: 'Clear'     },
  vibration:   { open: 'Detected',  closed: 'Clear'     },
  moisture:    { open: 'Wet',       closed: 'Dry'       },
  smoke:       { open: 'Detected',  closed: 'Clear'     },
  gas:         { open: 'Detected',  closed: 'Clear'     },
  _default:    { open: 'Active',    closed: 'Inactive'  },
};

function getDef(deviceClass) {
  return DEVICE_CLASS_DEFS[deviceClass] || DEVICE_CLASS_DEFS._default;
}

function getLabels(deviceClass) {
  return STATE_LABELS[deviceClass] || STATE_LABELS._default;
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = `
  :host {
    --claude-orange: #D97757;
    --claude-orange-soft: rgba(217, 119, 87, 0.12);
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
    --bg:              #292524;
    --surface:         #332E2A;
    --border:          rgba(255, 255, 255, 0.08);
    --text:            #F5F0EB;
    --text-muted:      #A09080;
    --text-dim:        #6B5F56;
    --row-hover-bg:    rgba(255, 255, 255, 0.03);
    --row-open-bg:     rgba(217, 119, 87, 0.07);
    --closed-color:    #7EC8A0;
    --shadow:          0 8px 32px rgba(0, 0, 0, 0.4);

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
    --bg:              #FFFEFA;
    --surface:         #F5F0EB;
    --border:          rgba(28, 25, 23, 0.09);
    --text:            #1C1917;
    --text-muted:      #6B5F56;
    --text-dim:        #A09080;
    --row-hover-bg:    rgba(28, 25, 23, 0.03);
    --row-open-bg:     rgba(217, 119, 87, 0.06);
    --closed-color:    #4CA87A;
    --shadow:          0 2px 16px rgba(0, 0, 0, 0.07), 0 0 0 1px rgba(0, 0, 0, 0.04);
  }

  /* ── Auto theme ── */
  @media (prefers-color-scheme: light) {
    .card.theme-auto {
      --bg:              #FFFEFA;
      --surface:         #F5F0EB;
      --border:          rgba(28, 25, 23, 0.09);
      --text:            #1C1917;
      --text-muted:      #6B5F56;
      --text-dim:        #A09080;
      --row-hover-bg:    rgba(28, 25, 23, 0.03);
      --row-open-bg:     rgba(217, 119, 87, 0.06);
      --closed-color:    #4CA87A;
      --shadow:          0 2px 16px rgba(0, 0, 0, 0.07), 0 0 0 1px rgba(0, 0, 0, 0.04);
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
    transition: var(--transition);
  }

  .header-icon-wrap.has-open {
    background: rgba(217, 119, 87, 0.12);
    border-color: rgba(217, 119, 87, 0.28);
  }

  .header-icon-wrap ha-icon {
    --mdc-icon-size: 20px;
    color: var(--text-dim);
    transition: color 0.3s ease;
  }

  .header-icon-wrap.has-open ha-icon { color: var(--claude-orange); }

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
    transition: color 0.3s ease;
  }

  .header-subtitle.has-open { color: var(--claude-orange); }

  /* ── Separator ── */
  .separator {
    height: 1px;
    background: var(--border);
    margin: 0 0 10px;
  }

  /* ── Door list ── */
  .doors-list {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .door-row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 9px 8px 9px 6px;
    border-radius: var(--claude-radius-xs);
    transition: background 0.2s ease;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }

  .door-row:hover { background: var(--row-hover-bg); }

  .door-row.door-open { background: var(--row-open-bg); }

  .door-row.unavailable {
    opacity: 0.38;
    pointer-events: none;
  }

  /* row icon */
  .row-icon {
    width: 34px;
    height: 34px;
    border-radius: 10px;
    background: var(--surface);
    border: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: var(--transition);
  }

  .door-row.door-open .row-icon {
    background: rgba(217, 119, 87, 0.10);
    border-color: rgba(217, 119, 87, 0.25);
  }

  .row-icon ha-icon {
    --mdc-icon-size: 17px;
    color: var(--text-dim);
    transition: color 0.25s ease;
  }

  .door-row.door-open .row-icon ha-icon { color: var(--claude-orange); }

  /* row info */
  .row-info { flex: 1; min-width: 0; }

  .row-name {
    font-size: 13px;
    font-weight: 500;
    color: var(--text);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .row-state {
    font-size: 11px;
    color: var(--text-dim);
    margin-top: 1px;
    white-space: nowrap;
  }

  .door-row.door-open .row-state { color: var(--claude-orange); opacity: 0.85; }

  /* status pill */
  .status-pill {
    font-size: 11px;
    font-weight: 600;
    padding: 3px 9px;
    border-radius: 20px;
    flex-shrink: 0;
    letter-spacing: 0.01em;
    transition: var(--transition);
  }

  .status-pill.closed {
    background: rgba(126, 200, 160, 0.12);
    border: 1px solid rgba(126, 200, 160, 0.25);
    color: var(--closed-color);
  }

  .status-pill.open {
    background: rgba(217, 119, 87, 0.12);
    border: 1px solid rgba(217, 119, 87, 0.30);
    color: var(--claude-orange);
  }

  .status-pill.unavailable {
    background: rgba(160, 144, 128, 0.10);
    border: 1px solid rgba(160, 144, 128, 0.18);
    color: var(--text-dim);
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

class ClaudeDoorsCard extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._config   = {};
    this._hass     = null;
    this._entities = [];
  }

  // ── HA lifecycle ─────────────────────────────────────────────────────────────

  static getConfigElement() {
    return document.createElement('claude-doors-card-editor');
  }

  static getStubConfig() {
    return {
      title:    'Doors & Windows',
      entities: ['binary_sensor.front_door', 'binary_sensor.kitchen_window'],
    };
  }

  setConfig(config) {
    if (!config.entities?.length) throw new Error('entities array is required');
    this._config = {
      title:  'Doors & Windows',
      icon:   'mdi:door',
      theme:  'dark',   // dark | light | auto
      ...config,
    };
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
    return 1 + Math.ceil((this._entities.length * 52 + 80) / 50);
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
    this._updateState();
  }

  _getHTML() {
    const cfg = this._config;

    const rowsHTML = this._entities.map((e, i) => `
      <div class="door-row" data-index="${i}" id="row-${i}">
        <div class="row-icon" id="icon-wrap-${i}">
          <ha-icon id="icon-${i}" icon="mdi:door-closed"></ha-icon>
        </div>
        <div class="row-info">
          <div class="row-name" id="name-${i}">${e.name || e.entity}</div>
          <div class="row-state" id="state-type-${i}">—</div>
        </div>
        <div class="status-pill" id="pill-${i}">—</div>
      </div>
    `).join('');

    return `
      <!-- Header -->
      <div class="header">
        <div class="header-icon-wrap" id="header-icon-wrap">
          <ha-icon icon="${cfg.icon}"></ha-icon>
        </div>
        <div class="header-titles">
          <div class="header-title">${cfg.title}</div>
          <div class="header-subtitle" id="header-subtitle">—</div>
        </div>
      </div>

      <div class="separator"></div>

      <!-- Doors list -->
      <div class="doors-list" id="doors-list">
        ${rowsHTML}
      </div>

      <!-- Footer -->
      <div class="footer">
        <div class="footer-info">
          <ha-icon icon="mdi:door" style="--mdc-icon-size:13px"></ha-icon>
          <span id="footer-count">${this._entities.length} sensor${this._entities.length !== 1 ? 's' : ''}</span>
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

  // ── State update ─────────────────────────────────────────────────────────────

  _updateState() {
    if (!this._hass || !this._card) return;

    let openCount  = 0;
    let validCount = 0;

    this._entities.forEach((cfg, i) => {
      const stateObj = this._hass.states[cfg.entity];
      const row      = this._q(`#row-${i}`);
      if (!row) return;

      if (!stateObj) {
        this._q(`#name-${i}`)       && (this._q(`#name-${i}`).textContent       = cfg.name || cfg.entity);
        this._q(`#state-type-${i}`) && (this._q(`#state-type-${i}`).textContent = 'Entity not found');
        const pill = this._q(`#pill-${i}`);
        if (pill) { pill.textContent = '—'; pill.className = 'status-pill unavailable'; }
        return;
      }

      validCount++;
      const attrs       = stateObj.attributes || {};
      const isUnavail   = stateObj.state === 'unavailable' || stateObj.state === 'unknown';
      const deviceClass = cfg.device_class || attrs.device_class || 'door';
      const def         = getDef(deviceClass);
      const labels      = getLabels(deviceClass);

      // binary_sensor: on = open/detected, off = closed/clear
      const isOpen = stateObj.state === 'on';
      if (isOpen && !isUnavail) openCount++;

      // name
      const name = cfg.name
        || attrs.friendly_name
        || cfg.entity.split('.')[1]?.replace(/_/g, ' ')
        || cfg.entity;

      // icon
      const icon = cfg.icon
        || (isOpen ? def.iconOpen : def.iconClosed);

      // type label
      const typeLabel = def.label;

      // pill state
      let pillText  = isUnavail ? 'N/A' : (isOpen ? labels.open : labels.closed);
      let pillClass = isUnavail ? 'unavailable' : (isOpen ? 'open' : 'closed');

      // update DOM
      row.classList.toggle('door-open',   isOpen && !isUnavail);
      row.classList.toggle('unavailable', isUnavail);

      this._q(`#icon-${i}`)?.setAttribute('icon', icon);

      const nameEl = this._q(`#name-${i}`);
      if (nameEl) nameEl.textContent = name;

      const typeEl = this._q(`#state-type-${i}`);
      if (typeEl) typeEl.textContent = typeLabel;

      const pill = this._q(`#pill-${i}`);
      if (pill) {
        pill.textContent = pillText;
        pill.className   = `status-pill ${pillClass}`;
      }
    });

    // header
    const subtitle  = this._q('#header-subtitle');
    const iconWrap  = this._q('#header-icon-wrap');

    if (subtitle) {
      if (openCount === 0) {
        subtitle.textContent = 'All closed';
        subtitle.classList.remove('has-open');
      } else {
        subtitle.textContent = `${openCount} open`;
        subtitle.classList.add('has-open');
      }
    }

    if (iconWrap) iconWrap.classList.toggle('has-open', openCount > 0);
  }

  // ── Events ───────────────────────────────────────────────────────────────────

  _bindEvents() {
    this._q('#doors-list')?.addEventListener('click', (e) => {
      const row = e.target.closest('.door-row');
      if (!row) return;
      const idx = parseInt(row.dataset.index, 10);
      if (isNaN(idx)) return;
      const entityId = this._entities[idx]?.entity;
      if (!entityId) return;
      const event = new Event('hass-more-info', { bubbles: true, composed: true });
      event.detail = { entityId };
      this.dispatchEvent(event);
    });
  }

  // ── Helpers ──────────────────────────────────────────────────────────────────

  _q(selector) {
    return this._card?.querySelector(selector) ?? null;
  }
}

// ─── Config Editor (stub) ─────────────────────────────────────────────────────

class ClaudeDoorsCardEditor extends HTMLElement {
  setConfig(config) { this._config = config; }
  set hass(hass)    { this._hass   = hass; }
}

// ─── Register ─────────────────────────────────────────────────────────────────

customElements.define('claude-doors-card',        ClaudeDoorsCard);
customElements.define('claude-doors-card-editor', ClaudeDoorsCardEditor);

window.customCards = window.customCards || [];
window.customCards.push({
  type:        'claude-doors-card',
  name:        'Claude Doors Card',
  description: 'Multi-entity door/window sensor card with open/closed state and alert highlight. Supports dark and light themes.',
  preview:     true,
  documentationURL: 'https://github.com/your-repo/claude-doors-card',
});

console.info(
  `%c CLAUDE DOORS CARD %c v${CARD_VERSION} `,
  'background:#D97757;color:#fff;font-weight:700;padding:2px 6px;border-radius:4px 0 0 4px',
  'background:#1C1917;color:#D97757;font-weight:600;padding:2px 6px;border-radius:0 4px 4px 0'
);

})();
