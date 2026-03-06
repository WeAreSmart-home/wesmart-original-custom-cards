/**
 * WeSmart Buttons Grid Card
 * Square-ish card with multiple action buttons in an auto-fit grid.
 * Supports toggle entities and arbitrary service calls.
 *
 * Config:
 *   type: custom:claude-buttons-grid-card
 *   title: "Quick Actions"   (optional)
 *   icon: mdi:gesture-tap    (optional, shown in header if title is set)
 *   theme: dark | light | auto
 *   columns: 3               (optional, overrides auto-fit)
 *   buttons:
 *     - name: Lights
 *       icon: mdi:lightbulb
 *       entity: light.soggiorno          # tracked for state + toggle
 *     - name: Film
 *       icon: mdi:movie-open
 *       service: scene.turn_on           # explicit service call
 *       service_data:
 *         entity_id: scene.serata_film
 *     - name: TV
 *       icon: mdi:television
 *       entity: switch.tv
 *       service: switch.turn_on          # entity tracks state, service overrides action
 *       service_data:
 *         entity_id: switch.tv
 */
(function () {
  'use strict';

  const ACTIVE_STATES = new Set([
    'on', 'open', 'unlocked', 'detected', 'active',
    'home', 'playing', 'occupied', 'true',
  ]);

  function isEntityActive(stateObj) {
    if (!stateObj) return false;
    return ACTIVE_STATES.has(stateObj.state) || stateObj.state.startsWith('armed');
  }

  const styles = `
    :host {
      --claude-orange:        #D97757;
      --claude-orange-glow:   rgba(217, 119, 87, 0.25);
      --claude-orange-soft:   rgba(217, 119, 87, 0.12);
      --claude-orange-border: rgba(217, 119, 87, 0.35);
      --claude-radius:        20px;
      --claude-radius-sm:     12px;
      --claude-radius-xs:     8px;
      --transition:           all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      display: block;
      font-family: -apple-system, 'Söhne', 'Inter', BlinkMacSystemFont, sans-serif;
    }

    /* ── Dark theme (default) ─────────────────────────────── */
    .card {
      --bg:            #292524;
      --surface:       #332E2A;
      --surface-hover: #3D3530;
      --border:        rgba(255, 255, 255, 0.08);
      --text:          #F5F0EB;
      --text-muted:    #A09080;
      --text-dim:      #6B5F56;
      --shadow:        0 8px 32px rgba(0, 0, 0, 0.4);

      background:    var(--bg);
      border:        1px solid var(--border);
      border-radius: var(--claude-radius);
      padding:       18px 18px 16px;
      box-shadow:    var(--shadow);
      box-sizing:    border-box;
    }

    /* ── Light theme ──────────────────────────────────────── */
    .card.theme-light {
      --bg:            #FFFEFA;
      --surface:       #F5F0EB;
      --surface-hover: #EDE8E2;
      --border:        rgba(28, 25, 23, 0.09);
      --text:          #1C1917;
      --text-muted:    #6B5F56;
      --text-dim:      #A09080;
      --shadow:        0 2px 16px rgba(0, 0, 0, 0.07), 0 0 0 1px rgba(0, 0, 0, 0.04);
    }

    /* ── Auto theme ───────────────────────────────────────── */
    @media (prefers-color-scheme: light) {
      .card.theme-auto {
        --bg:            #FFFEFA;
        --surface:       #F5F0EB;
        --surface-hover: #EDE8E2;
        --border:        rgba(28, 25, 23, 0.09);
        --text:          #1C1917;
        --text-muted:    #6B5F56;
        --text-dim:      #A09080;
        --shadow:        0 2px 16px rgba(0, 0, 0, 0.07), 0 0 0 1px rgba(0, 0, 0, 0.04);
      }
    }

    /* ── Header (optional) ────────────────────────────────── */
    .header {
      display:       flex;
      align-items:   center;
      gap:           10px;
      margin-bottom: 14px;
    }

    .icon-wrap {
      width:           36px;
      height:          36px;
      border-radius:   var(--claude-radius-xs);
      background:      var(--surface);
      border:          1px solid var(--border);
      display:         flex;
      align-items:     center;
      justify-content: center;
      flex-shrink:     0;
      transition:      background 0.3s ease, border-color 0.3s ease;
    }

    .icon-wrap ha-icon {
      color:  var(--text-dim);
      width:  20px;
      height: 20px;
    }

    .title {
      flex:          1;
      min-width:     0;
      font-size:     14px;
      font-weight:   600;
      color:         var(--text);
      white-space:   nowrap;
      overflow:      hidden;
      text-overflow: ellipsis;
    }

    /* ── Buttons grid ─────────────────────────────────────── */
    .buttons-grid {
      display:               grid;
      grid-template-columns: repeat(var(--cols, auto-fill), minmax(var(--col-min, 80px), 1fr));
      gap:                   10px;
    }

    /* ── Individual button ────────────────────────────────── */
    .btn {
      display:          flex;
      flex-direction:   column;
      align-items:      center;
      justify-content:  center;
      gap:              8px;
      padding:          16px 8px;
      border-radius:    var(--claude-radius-sm);
      background:       var(--surface);
      border:           1px solid transparent;
      cursor:           pointer;
      transition:       var(--transition);
      min-width:        0;
      user-select:      none;
      -webkit-tap-highlight-color: transparent;
      /* reset browser button styles */
      outline:          none;
      appearance:       none;
      -webkit-appearance: none;
      font-family:      inherit;
    }

    .btn:hover:not(.unavailable) {
      background: var(--surface-hover);
    }

    .btn.active {
      background:   var(--claude-orange-soft);
      border-color: var(--claude-orange-border);
      box-shadow:   0 0 14px var(--claude-orange-glow);
    }

    .btn.unavailable {
      opacity:        0.35;
      pointer-events: none;
    }

    .btn.pressing {
      transform:  scale(0.92);
      transition: transform 0.1s ease;
    }

    /* ── Icon ─────────────────────────────────────────────── */
    .btn-icon {
      width:           28px;
      height:          28px;
      color:           var(--text-dim);
      transition:      color 0.2s ease;
      flex-shrink:     0;
      display:         flex;
      align-items:     center;
      justify-content: center;
    }

    .btn.active .btn-icon {
      color: var(--claude-orange);
    }

    /* ── Label ────────────────────────────────────────────── */
    .btn-label {
      font-size:     11px;
      font-weight:   500;
      color:         var(--text-muted);
      text-align:    center;
      line-height:   1.3;
      overflow:      hidden;
      text-overflow: ellipsis;
      white-space:   nowrap;
      max-width:     100%;
      transition:    color 0.2s ease;
    }

    .btn.active .btn-label {
      color: var(--claude-orange);
    }
  `;

  class WeSmartButtonsGridCard extends HTMLElement {
    connectedCallback() {
      if (!this.shadowRoot) this.attachShadow({ mode: 'open' });
    }

    setConfig(config) {
      if (!config.buttons?.length) throw new Error('wesmart-buttons-grid-card: "buttons" array is required');
      this._config  = { theme: 'dark', icon: 'mdi:gesture-tap', ...config };
      this._buttons = this._config.buttons.map(b => ({ ...b }));
      if (!this.shadowRoot) this.attachShadow({ mode: 'open' });
      this._render();
    }

    set hass(hass) {
      this._hass = hass;
      this._updateState();
    }

    _q(sel) { return this.shadowRoot.querySelector(sel); }

    _render() {
      const shadow = this.shadowRoot;
      shadow.innerHTML = '';

      const style = document.createElement('style');
      style.textContent = styles;
      shadow.appendChild(style);

      this._card = document.createElement('div');
      this._card.className = `card theme-${this._config.theme}`;
      this._card.innerHTML = this._buildHTML();
      shadow.appendChild(this._card);

      // Apply fixed column count if configured
      if (this._config.columns) {
        const grid = this._q('.buttons-grid');
        if (grid) {
          grid.style.setProperty('--cols', this._config.columns);
          grid.style.setProperty('--col-min', '60px');
          grid.style.gridTemplateColumns = `repeat(${this._config.columns}, 1fr)`;
        }
      }

      this._bindEvents();
      if (this._hass) this._updateState();
    }

    _buildHTML() {
      const header = this._config.title ? `
        <div class="header">
          <div class="icon-wrap">
            <ha-icon icon="${this._escapeHtml(this._config.icon)}"></ha-icon>
          </div>
          <div class="title">${this._escapeHtml(this._config.title)}</div>
        </div>
      ` : '';

      const buttons = this._buttons.map((b, i) => `
        <button class="btn" id="btn-${i}" aria-label="${this._escapeHtml(b.name || '')}">
          <ha-icon class="btn-icon" id="icon-${i}" icon="${this._escapeHtml(b.icon || 'mdi:gesture-tap')}"></ha-icon>
          <span class="btn-label">${this._escapeHtml(b.name || '')}</span>
        </button>
      `).join('');

      return `
        ${header}
        <div class="buttons-grid" id="buttons-grid">${buttons}</div>
      `;
    }

    _updateState() {
      if (!this._hass || !this._card) return;

      this._buttons.forEach((cfg, i) => {
        const btn = this._q(`#btn-${i}`);
        if (!btn) return;

        if (!cfg.entity) {
          btn.classList.remove('active', 'unavailable');
          return;
        }

        const stateObj = this._hass.states[cfg.entity];
        const isUnavail = !stateObj
          || stateObj.state === 'unavailable'
          || stateObj.state === 'unknown';
        const active = !isUnavail && isEntityActive(stateObj);

        btn.classList.toggle('active', active);
        btn.classList.toggle('unavailable', isUnavail);
      });
    }

    _handleClick(i) {
      const cfg = this._buttons[i];
      if (!this._hass) return;

      if (cfg.service) {
        // Explicit service call
        const parts = cfg.service.split('.');
        const domain = parts[0];
        const service = parts.slice(1).join('.');
        this._hass.callService(domain, service, cfg.service_data || {});
      } else if (cfg.entity) {
        // Default: toggle the entity
        const stateObj = this._hass.states[cfg.entity];
        if (!stateObj || stateObj.state === 'unavailable') return;
        this._hass.callService('homeassistant', 'toggle', { entity_id: cfg.entity });
      }

      // Brief press animation for stateless buttons (no entity tracking)
      if (!cfg.entity) {
        const btn = this._q(`#btn-${i}`);
        if (btn) {
          btn.classList.add('pressing');
          setTimeout(() => btn.classList.remove('pressing'), 200);
        }
      }
    }

    _bindEvents() {
      this._buttons.forEach((_, i) => {
        const btn = this._q(`#btn-${i}`);
        if (!btn) return;
        btn.addEventListener('click', () => this._handleClick(i));
      });
    }

    _escapeHtml(str) {
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    }

    getCardSize() {
      const rows = this._config.columns
        ? Math.ceil(this._buttons.length / this._config.columns)
        : Math.ceil(this._buttons.length / 3);
      return rows + (this._config.title ? 1 : 0);
    }
  }

  customElements.define('wesmart-buttons-grid-card', WeSmartButtonsGridCard);

  window.customCards = window.customCards || [];
  window.customCards.push({
    type:        'wesmart-buttons-grid-card',
    name:        'Claude Buttons Grid',
    description: 'Square grid of action buttons with dynamic state colors.',
  });
})();
