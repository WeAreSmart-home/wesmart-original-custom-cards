/**
 * Claude Lights Card - Home Assistant Custom Card
 * Multi-entity light card with toggles
 * Supports dark and light themes
 * Version: 1.0.0
 */

const CARD_VERSION = '1.0.0';

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

  /* ── Dark theme (default) ── */
  .card {
    --bg:              #292524;
    --surface:         #332E2A;
    --border:          rgba(255, 255, 255, 0.08);
    --text:            #F5F0EB;
    --text-muted:      #A09080;
    --text-dim:        #6B5F56;
    --row-active-bg:   rgba(217, 119, 87, 0.07);
    --row-hover-bg:    rgba(255, 255, 255, 0.03);
    --track-off:       #332E2A;
    --thumb-off:       #6B5F56;
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
    --row-active-bg:   rgba(217, 119, 87, 0.06);
    --row-hover-bg:    rgba(28, 25, 23, 0.03);
    --track-off:       #E8E2DC;
    --thumb-off:       #B8AFA8;
    --shadow:          0 2px 16px rgba(0, 0, 0, 0.07), 0 0 0 1px rgba(0, 0, 0, 0.04);
  }

  /* ── Auto theme (follows system) ── */
  @media (prefers-color-scheme: light) {
    .card.theme-auto {
      --bg:              #FFFEFA;
      --surface:         #F5F0EB;
      --border:          rgba(28, 25, 23, 0.09);
      --text:            #1C1917;
      --text-muted:      #6B5F56;
      --text-dim:        #A09080;
      --row-active-bg:   rgba(217, 119, 87, 0.06);
      --row-hover-bg:    rgba(28, 25, 23, 0.03);
      --track-off:       #E8E2DC;
      --thumb-off:       #B8AFA8;
      --shadow:          0 2px 16px rgba(0, 0, 0, 0.07), 0 0 0 1px rgba(0, 0, 0, 0.04);
    }
  }

  /* ── Header ── */
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 14px;
  }

  .header-left {
    display: flex;
    align-items: center;
    gap: 12px;
    flex: 1;
    min-width: 0;
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

  .header-icon-wrap.has-active {
    background: rgba(217, 119, 87, 0.12);
    border-color: rgba(217, 119, 87, 0.28);
  }

  .header-icon-wrap ha-icon {
    --mdc-icon-size: 20px;
    color: var(--text-dim);
    transition: color 0.3s ease;
  }

  .header-icon-wrap.has-active ha-icon { color: var(--claude-orange); }

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

  /* ── Toggle switch (shared) ── */
  .toggle-switch {
    position: relative;
    width: 48px;
    height: 26px;
    flex-shrink: 0;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }

  .toggle-switch input { opacity: 0; width: 0; height: 0; position: absolute; }

  .toggle-track {
    position: absolute;
    inset: 0;
    background: var(--track-off);
    border: 1px solid var(--border);
    border-radius: 13px;
    transition: var(--transition);
  }

  .toggle-thumb {
    position: absolute;
    top: 3px;
    left: 3px;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: var(--thumb-off);
    transition: var(--transition);
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.25);
  }

  .toggle-switch.active .toggle-track {
    background: rgba(217, 119, 87, 0.18);
    border-color: rgba(217, 119, 87, 0.4);
  }

  .toggle-switch.active .toggle-thumb {
    left: 23px;
    background: var(--claude-orange);
    box-shadow: 0 0 10px rgba(217, 119, 87, 0.5);
  }

  /* ── Separator ── */
  .separator {
    height: 1px;
    background: var(--border);
    margin: 0 0 10px;
  }

  /* ── Light row ── */
  .lights-list {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .light-row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 9px 8px 9px 6px;
    border-radius: var(--claude-radius-xs);
    transition: background 0.2s ease;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }

  .light-row:hover { background: var(--row-hover-bg); }

  .light-row.light-on { background: var(--row-active-bg); }

  .light-row.unavailable {
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

  .light-row.light-on .row-icon {
    background: rgba(217, 119, 87, 0.10);
    border-color: rgba(217, 119, 87, 0.25);
  }

  .row-icon ha-icon {
    --mdc-icon-size: 17px;
    color: var(--text-dim);
    transition: color 0.25s ease;
  }

  .light-row.light-on .row-icon ha-icon { color: var(--claude-orange); }

  /* row info */
  .row-info { flex: 1; min-width: 0; }

  .row-name {
    font-size: 13px;
    font-weight: 500;
    color: var(--text);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: color 0.2s ease;
  }

  .row-state {
    font-size: 11px;
    color: var(--text-dim);
    margin-top: 1px;
    transition: color 0.2s ease;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .light-row.light-on .row-state {
    color: var(--claude-orange);
    opacity: 0.85;
  }

  /* row toggle (smaller variant) */
  .row-toggle {
    position: relative;
    width: 44px;
    height: 24px;
    flex-shrink: 0;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }

  .row-toggle input { opacity: 0; width: 0; height: 0; position: absolute; }

  .row-toggle .toggle-track { border-radius: 12px; }

  .row-toggle .toggle-thumb {
    width: 16px;
    height: 16px;
    top: 3px;
    left: 3px;
  }

  .row-toggle.active .toggle-thumb { left: 21px; }

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

class ClaudeLightsCard extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._config   = {};
    this._hass     = null;
    this._entities = [];
  }

  // ── HA lifecycle ─────────────────────────────────────────────────────────────

  static getConfigElement() {
    return document.createElement('claude-lights-card-editor');
  }

  static getStubConfig() {
    return {
      title:    'Lights',
      entities: ['light.example_1', 'light.example_2'],
    };
  }

  setConfig(config) {
    if (!config.entities?.length) throw new Error('entities array is required');
    this._config = {
      title:  'Lights',
      icon:   'mdi:lightbulb-group',
      theme:  'dark',  // dark | light | auto
      ...config,
    };
    // normalise: strings → objects
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
    return 1 + Math.ceil((this._entities.length * 52 + 100) / 50);
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
      <div class="light-row" data-index="${i}" id="row-${i}">
        <div class="row-icon" id="icon-wrap-${i}">
          <ha-icon id="icon-${i}" icon="mdi:lightbulb-outline"></ha-icon>
        </div>
        <div class="row-info">
          <div class="row-name" id="name-${i}">${e.name || e.entity}</div>
          <div class="row-state" id="state-${i}">—</div>
        </div>
        <label class="row-toggle" id="toggle-${i}">
          <input type="checkbox" id="input-${i}">
          <div class="toggle-track"></div>
          <div class="toggle-thumb"></div>
        </label>
      </div>
    `).join('');

    return `
      <!-- Header -->
      <div class="header">
        <div class="header-left">
          <div class="header-icon-wrap" id="header-icon-wrap">
            <ha-icon icon="${cfg.icon}"></ha-icon>
          </div>
          <div class="header-titles">
            <div class="header-title">${cfg.title}</div>
            <div class="header-subtitle" id="header-subtitle">—</div>
          </div>
        </div>
        <label class="toggle-switch" id="master-toggle">
          <input type="checkbox" id="master-input">
          <div class="toggle-track"></div>
          <div class="toggle-thumb"></div>
        </label>
      </div>

      <div class="separator"></div>

      <!-- Lights list -->
      <div class="lights-list" id="lights-list">
        ${rowsHTML}
      </div>

      <!-- Footer -->
      <div class="footer">
        <div class="footer-info">
          <ha-icon icon="mdi:lightbulb-multiple-outline" style="--mdc-icon-size:13px"></ha-icon>
          <span id="footer-count">${this._entities.length} light${this._entities.length !== 1 ? 's' : ''}</span>
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

    let onCount    = 0;
    let validCount = 0;

    this._entities.forEach((cfg, i) => {
      const stateObj = this._hass.states[cfg.entity];
      if (!stateObj) return;

      validCount++;
      const attrs     = stateObj.attributes || {};
      const isOn      = stateObj.state === 'on';
      const isUnavail = stateObj.state === 'unavailable';
      if (isOn) onCount++;

      // name
      const name = cfg.name
        || attrs.friendly_name
        || cfg.entity.split('.')[1]?.replace(/_/g, ' ')
        || cfg.entity;

      // icon
      const icon = cfg.icon || attrs.icon
        || (isOn ? 'mdi:lightbulb' : 'mdi:lightbulb-outline');

      // state text
      let stateText = 'Off';
      if (isUnavail) {
        stateText = 'Unavailable';
      } else if (isOn) {
        const parts = [];
        if (attrs.brightness != null) parts.push(`${Math.round(attrs.brightness / 2.55)}%`);
        if (attrs.color_temp != null) parts.push(`${Math.round(1000000 / attrs.color_temp)}K`);
        stateText = parts.length ? parts.join(' · ') : 'On';
      }

      // update DOM
      const row    = this._q(`#row-${i}`);
      const toggle = this._q(`#toggle-${i}`);
      const input  = this._q(`#input-${i}`);

      if (row) {
        row.classList.toggle('light-on',    isOn && !isUnavail);
        row.classList.toggle('unavailable', isUnavail);
      }

      this._q(`#icon-${i}`)?.setAttribute('icon', icon);

      const nameEl = this._q(`#name-${i}`);
      if (nameEl) nameEl.textContent = name;

      const stateEl = this._q(`#state-${i}`);
      if (stateEl) stateEl.textContent = stateText;

      if (toggle) toggle.classList.toggle('active', isOn);
      if (input)  input.checked = isOn;
    });

    // header
    const subtitle = this._q('#header-subtitle');
    if (subtitle) {
      subtitle.textContent = onCount === 0
        ? 'All off'
        : onCount === validCount
          ? 'All on'
          : `${onCount} of ${validCount} on`;
    }

    const iconWrap = this._q('#header-icon-wrap');
    if (iconWrap) iconWrap.classList.toggle('has-active', onCount > 0);

    const masterToggle = this._q('#master-toggle');
    const masterInput  = this._q('#master-input');
    if (masterToggle) masterToggle.classList.toggle('active', onCount > 0);
    if (masterInput)  masterInput.checked = onCount > 0;
  }

  // ── Events ───────────────────────────────────────────────────────────────────

  _bindEvents() {
    // master toggle: if any are on → turn all off, else → turn all on
    this._q('#master-toggle').addEventListener('click', () => {
      if (!this._hass) return;
      const anyOn  = this._entities.some(cfg => this._hass.states[cfg.entity]?.state === 'on');
      const action = anyOn ? 'turn_off' : 'turn_on';
      this._entities.forEach(cfg => {
        this._hass.callService('light', action, { entity_id: cfg.entity });
      });
    });

    // individual toggles
    this._entities.forEach((cfg, i) => {
      const toggle = this._q(`#toggle-${i}`);
      if (!toggle) return;
      toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!this._hass) return;
        const stateObj = this._hass.states[cfg.entity];
        if (!stateObj || stateObj.state === 'unavailable') return;
        const action = stateObj.state === 'on' ? 'turn_off' : 'turn_on';
        this._hass.callService('light', action, { entity_id: cfg.entity });
      });
    });

    // tap on the row (not toggle) → open more-info
    this._q('#lights-list').addEventListener('click', (e) => {
      if (e.target.closest('.row-toggle')) return;
      const row = e.target.closest('.light-row');
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

class ClaudeLightsCardEditor extends HTMLElement {
  setConfig(config) { this._config = config; }
  set hass(hass)    { this._hass   = hass; }
}

// ─── Register ─────────────────────────────────────────────────────────────────

customElements.define('claude-lights-card',        ClaudeLightsCard);
customElements.define('claude-lights-card-editor', ClaudeLightsCardEditor);

window.customCards = window.customCards || [];
window.customCards.push({
  type:        'claude-lights-card',
  name:        'Claude Lights Card',
  description: 'Multi-entity light card with toggles. Supports dark and light themes.',
  preview:     true,
  documentationURL: 'https://github.com/your-repo/claude-lights-card',
});

console.info(
  `%c CLAUDE LIGHTS CARD %c v${CARD_VERSION} `,
  'background:#D97757;color:#fff;font-weight:700;padding:2px 6px;border-radius:4px 0 0 4px',
  'background:#1C1917;color:#D97757;font-weight:600;padding:2px 6px;border-radius:0 4px 4px 0'
);
