/**
 * WeSmart Buttons Bar Card
 * Compact horizontal bar of action buttons with dynamic state colors.
 * Supports toggle entities and arbitrary service calls.
 *
 * Config:
 *   type: custom:claude-buttons-bar-card
 *   theme: dark | light | auto
 *   title: "Quick Actions"   (optional)
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
      padding:       14px 16px;
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

    /* ── Optional title row ───────────────────────────────── */
    .title-row {
      font-size:      11px;
      font-weight:    600;
      letter-spacing: 0.07em;
      text-transform: uppercase;
      color:          var(--text-dim);
      margin-bottom:  10px;
    }

    /* ── Button row ───────────────────────────────────────── */
    .buttons-row {
      display:         flex;
      flex-direction:  row;
      gap:             8px;
      align-items:     stretch;
    }

    /* ── Individual button ────────────────────────────────── */
    .btn {
      flex:             1;
      display:          flex;
      flex-direction:   column;
      align-items:      center;
      justify-content:  center;
      gap:              6px;
      padding:          11px 6px;
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
      background:  var(--claude-orange-soft);
      border-color: var(--claude-orange-border);
      box-shadow:  0 0 14px var(--claude-orange-glow);
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
      width:      26px;
      height:     26px;
      color:      var(--text-dim);
      transition: color 0.2s ease;
      flex-shrink: 0;
      display:    flex;
      align-items: center;
      justify-content: center;
    }

    .btn.active .btn-icon {
      color: var(--claude-orange);
    }

    /* ── Label ────────────────────────────────────────────── */
    .btn-label {
      font-size:     10px;
      font-weight:   500;
      color:         var(--text-muted);
      text-align:    center;
      line-height:   1.2;
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

  class WeSmartButtonsBarCard extends HTMLElement {
    connectedCallback() {
      if (!this.shadowRoot) this.attachShadow({ mode: 'open' });
    }

    setConfig(config) {
      if (!config.buttons?.length) throw new Error('wesmart-buttons-bar-card: "buttons" array is required');
      this._config  = { theme: 'dark', ...config };
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

      this._bindEvents();
      if (this._hass) this._updateState();
    }

    _buildHTML() {
      const titleRow = this._config.title
        ? `<div class="title-row">${this._escapeHtml(this._config.title)}</div>`
        : '';

      const buttons = this._buttons.map((b, i) => `
        <button class="btn" id="btn-${i}" aria-label="${this._escapeHtml(b.name || '')}">
          <ha-icon class="btn-icon" id="icon-${i}" icon="${this._escapeHtml(b.icon || 'mdi:gesture-tap')}"></ha-icon>
          <span class="btn-label">${this._escapeHtml(b.name || '')}</span>
        </button>
      `).join('');

      return `
        ${titleRow}
        <div class="buttons-row">${buttons}</div>
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

    getCardSize() { return 1; }
  }

  customElements.define('wesmart-buttons-bar-card', WeSmartButtonsBarCard);

  window.customCards = window.customCards || [];
  window.customCards.push({
    type:        'wesmart-buttons-bar-card',
    name:        'Claude Buttons Bar',
    description: 'Compact horizontal bar of action buttons with dynamic state colors.',
  });
})();
