/**
 * Claude Light Card - Home Assistant Custom Card
 * Styled after Anthropic Claude AI aesthetic
 * Version: 1.0.0
 */

const CARD_VERSION = '1.0.0';

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = `
  :host {
    --claude-bg: #1C1917;
    --claude-surface: #292524;
    --claude-surface-2: #332E2A;
    --claude-border: rgba(255, 255, 255, 0.08);
    --claude-orange: #D97757;
    --claude-orange-glow: rgba(217, 119, 87, 0.25);
    --claude-orange-soft: rgba(217, 119, 87, 0.15);
    --claude-text: #F5F0EB;
    --claude-text-muted: #A09080;
    --claude-text-dim: #6B5F56;
    --claude-success: #7CB87A;
    --claude-radius: 20px;
    --claude-radius-sm: 12px;
    --claude-radius-xs: 8px;
    --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    display: block;
    font-family: -apple-system, 'Söhne', 'Inter', BlinkMacSystemFont, sans-serif;
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  .card {
    background: var(--claude-surface);
    border: 1px solid var(--claude-border);
    border-radius: var(--claude-radius);
    padding: 20px;
    position: relative;
    overflow: hidden;
    transition: var(--transition);
  }

  .card::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(
      ellipse 60% 50% at 50% -10%,
      var(--claude-orange-soft),
      transparent
    );
    opacity: 0;
    transition: opacity 0.5s ease;
    pointer-events: none;
  }

  .card.light-on::before {
    opacity: 1;
  }

  .card.light-on {
    border-color: rgba(217, 119, 87, 0.2);
    box-shadow: 0 0 0 1px rgba(217, 119, 87, 0.1),
                0 8px 32px rgba(0, 0, 0, 0.4),
                0 0 60px var(--claude-orange-glow);
  }

  /* ── Header ── */
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 18px;
    position: relative;
    z-index: 1;
  }

  .entity-info {
    display: flex;
    align-items: center;
    gap: 12px;
    flex: 1;
    min-width: 0;
  }

  .icon-wrapper {
    width: 44px;
    height: 44px;
    border-radius: var(--claude-radius-sm);
    background: var(--claude-surface-2);
    border: 1px solid var(--claude-border);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: var(--transition);
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .icon-wrapper::after {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--claude-orange-soft);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .card.light-on .icon-wrapper {
    border-color: rgba(217, 119, 87, 0.3);
    background: rgba(217, 119, 87, 0.1);
  }

  .card.light-on .icon-wrapper::after {
    opacity: 1;
  }

  .icon-wrapper ha-icon {
    color: var(--claude-text-muted);
    transition: var(--transition);
    position: relative;
    z-index: 1;
    --mdc-icon-size: 22px;
  }

  .card.light-on .icon-wrapper ha-icon {
    color: var(--claude-orange);
  }

  .entity-details {
    flex: 1;
    min-width: 0;
  }

  .entity-name {
    font-size: 15px;
    font-weight: 600;
    color: var(--claude-text);
    letter-spacing: -0.01em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .entity-state {
    font-size: 12px;
    color: var(--claude-text-muted);
    margin-top: 2px;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .state-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--claude-text-dim);
    transition: var(--transition);
    flex-shrink: 0;
  }

  .card.light-on .state-dot {
    background: var(--claude-orange);
    box-shadow: 0 0 8px var(--claude-orange);
  }

  /* ── Toggle ── */
  .toggle-switch {
    position: relative;
    width: 48px;
    height: 26px;
    flex-shrink: 0;
    cursor: pointer;
  }

  .toggle-switch input {
    opacity: 0;
    width: 0;
    height: 0;
    position: absolute;
  }

  .toggle-track {
    position: absolute;
    inset: 0;
    background: var(--claude-surface-2);
    border: 1px solid var(--claude-border);
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
    background: var(--claude-text-dim);
    transition: var(--transition);
    box-shadow: 0 1px 4px rgba(0,0,0,0.4);
  }

  .toggle-switch.active .toggle-track {
    background: rgba(217, 119, 87, 0.2);
    border-color: rgba(217, 119, 87, 0.4);
  }

  .toggle-switch.active .toggle-thumb {
    left: 23px;
    background: var(--claude-orange);
    box-shadow: 0 0 10px rgba(217, 119, 87, 0.6);
  }

  /* ── Brightness ── */
  .controls {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .control-row {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .control-label {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .control-label span:first-child {
    font-size: 11px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--claude-text-dim);
  }

  .control-value {
    font-size: 13px;
    font-weight: 600;
    color: var(--claude-orange);
    font-variant-numeric: tabular-nums;
  }

  /* ── Slider ── */
  .slider-wrapper {
    position: relative;
    height: 6px;
    border-radius: 3px;
    background: var(--claude-surface-2);
    border: 1px solid var(--claude-border);
    cursor: pointer;
  }

  .slider-fill {
    position: absolute;
    left: 0;
    top: -1px;
    bottom: -1px;
    border-radius: 3px;
    background: linear-gradient(90deg, rgba(217,119,87,0.4), var(--claude-orange));
    transition: width 0.15s ease;
    pointer-events: none;
  }

  .slider-thumb {
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: var(--claude-text);
    border: 2px solid var(--claude-orange);
    box-shadow: 0 0 0 0 var(--claude-orange-glow);
    transition: box-shadow 0.2s ease, transform 0.2s ease;
    pointer-events: none;
  }

  .slider-wrapper:hover .slider-thumb,
  .slider-wrapper.dragging .slider-thumb {
    box-shadow: 0 0 0 6px var(--claude-orange-glow);
    transform: translate(-50%, -50%) scale(1.1);
  }

  /* ── Color Temperature ── */
  .ct-slider .slider-fill {
    background: linear-gradient(90deg, #4A90D9, #FFD580);
  }

  .ct-slider .slider-thumb {
    border-color: var(--claude-text-muted);
  }

  /* ── Color Picker ── */
  .color-section {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .color-grid {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .color-dot {
    width: 26px;
    height: 26px;
    border-radius: 50%;
    cursor: pointer;
    transition: var(--transition);
    border: 2px solid transparent;
    position: relative;
  }

  .color-dot::after {
    content: '';
    position: absolute;
    inset: -3px;
    border-radius: 50%;
    border: 2px solid transparent;
    transition: var(--transition);
  }

  .color-dot:hover {
    transform: scale(1.15);
  }

  .color-dot.selected::after {
    border-color: var(--claude-orange);
  }

  /* ── Footer ── */
  .footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 16px;
    padding-top: 14px;
    border-top: 1px solid var(--claude-border);
    position: relative;
    z-index: 1;
  }

  .footer-info {
    font-size: 11px;
    color: var(--claude-text-dim);
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .unavailable-overlay {
    position: absolute;
    inset: 0;
    background: rgba(28, 25, 23, 0.7);
    backdrop-filter: blur(2px);
    border-radius: var(--claude-radius);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    z-index: 10;
  }

  .unavailable-overlay span {
    font-size: 13px;
    color: var(--claude-text-muted);
    font-weight: 500;
  }

  .unavailable-overlay ha-icon {
    color: var(--claude-text-dim);
    --mdc-icon-size: 28px;
  }

  /* ── Pulse animation for on state ── */
  @keyframes pulse-glow {
    0%, 100% { box-shadow: 0 0 0 1px rgba(217, 119, 87, 0.1), 0 8px 32px rgba(0,0,0,0.4), 0 0 60px var(--claude-orange-glow); }
    50%       { box-shadow: 0 0 0 1px rgba(217, 119, 87, 0.2), 0 8px 32px rgba(0,0,0,0.4), 0 0 80px rgba(217, 119, 87, 0.35); }
  }

  .card.light-on {
    animation: pulse-glow 3s ease-in-out infinite;
  }

  /* ── Action buttons ── */
  .action-buttons {
    display: flex;
    gap: 8px;
  }

  .action-btn {
    width: 30px;
    height: 30px;
    border-radius: var(--claude-radius-xs);
    background: var(--claude-surface-2);
    border: 1px solid var(--claude-border);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: var(--transition);
    color: var(--claude-text-muted);
  }

  .action-btn:hover {
    background: rgba(217, 119, 87, 0.1);
    border-color: rgba(217, 119, 87, 0.3);
    color: var(--claude-orange);
  }

  .action-btn ha-icon {
    --mdc-icon-size: 16px;
  }

  /* ── Divider ── */
  .divider {
    height: 1px;
    background: var(--claude-border);
    margin: 2px 0;
  }

  /* ── Brand mark ── */
  .brand-mark {
    display: flex;
    align-items: center;
    gap: 5px;
    opacity: 0.4;
  }

  .brand-mark svg {
    width: 14px;
    height: 14px;
  }

  .brand-mark span {
    font-size: 10px;
    color: var(--claude-text-dim);
    letter-spacing: 0.05em;
  }
`;

// ─── Color Presets ─────────────────────────────────────────────────────────────

const COLOR_PRESETS = [
  { name: 'Warm White',  rgb: [255, 228, 196], hs: [30,  0.33] },
  { name: 'Cool White',  rgb: [220, 237, 255], hs: [210, 0.14] },
  { name: 'Sunset',      rgb: [255, 140,  60], hs: [24,  0.76] },
  { name: 'Ocean',       rgb: [ 64, 164, 223], hs: [204, 0.71] },
  { name: 'Forest',      rgb: [106, 190, 120], hs: [128, 0.44] },
  { name: 'Lavender',    rgb: [160, 140, 220], hs: [255, 0.36] },
  { name: 'Rose',        rgb: [230, 100, 130], hs: [344, 0.57] },
  { name: 'Gold',        rgb: [255, 195,  50], hs: [44,  0.80] },
];

// ─── Custom Element ────────────────────────────────────────────────────────────

class ClaudeLightCard extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._config = {};
    this._hass   = null;
    this._isDraggingBrightness = false;
    this._isDraggingCT         = false;
    this._selectedColor        = null;
  }

  // ── HA lifecycle ─────────────────────────────────────────────────────────────

  static getConfigElement() {
    return document.createElement('claude-light-card-editor');
  }

  static getStubConfig() {
    return { entity: 'light.example' };
  }

  setConfig(config) {
    if (!config.entity) throw new Error('entity is required');
    this._config = {
      name: null,
      icon: null,
      show_brightness: true,
      show_color_temp: true,
      show_color: true,
      ...config,
    };
    this._render();
  }

  set hass(hass) {
    this._hass = hass;
    this._updateState();
  }

  getCardSize() { return 3; }

  // ── Render ───────────────────────────────────────────────────────────────────

  _render() {
    const shadow = this.shadowRoot;
    shadow.innerHTML = '';

    const style = document.createElement('style');
    style.textContent = styles;
    shadow.appendChild(style);

    this._card = document.createElement('div');
    this._card.className = 'card';
    this._card.innerHTML = this._getHTML();
    shadow.appendChild(this._card);

    this._bindEvents();
    this._updateState();
  }

  _getHTML() {
    const cfg = this._config;

    const colorDotsHTML = COLOR_PRESETS.map((c, i) => `
      <div class="color-dot"
           data-color-index="${i}"
           style="background: rgb(${c.rgb.join(',')});"
           title="${c.name}">
      </div>
    `).join('');

    return `
      <div class="header">
        <div class="entity-info">
          <div class="icon-wrapper" id="icon-btn">
            <ha-icon id="entity-icon" icon="mdi:lightbulb"></ha-icon>
          </div>
          <div class="entity-details">
            <div class="entity-name" id="entity-name">—</div>
            <div class="entity-state">
              <span class="state-dot"></span>
              <span id="state-text">unknown</span>
            </div>
          </div>
        </div>
        <label class="toggle-switch" id="toggle">
          <input type="checkbox" id="toggle-input">
          <div class="toggle-track"></div>
          <div class="toggle-thumb"></div>
        </label>
      </div>

      <div class="controls" id="controls">

        <!-- Brightness -->
        <div class="control-row" id="brightness-row">
          <div class="control-label">
            <span>Brightness</span>
            <span class="control-value" id="brightness-value">100%</span>
          </div>
          <div class="slider-wrapper" id="brightness-slider">
            <div class="slider-fill" id="brightness-fill"></div>
            <div class="slider-thumb" id="brightness-thumb"></div>
          </div>
        </div>

        <!-- Color Temperature -->
        <div class="control-row" id="ct-row" style="display:none">
          <div class="control-label">
            <span>Color Temperature</span>
            <span class="control-value" id="ct-value">—</span>
          </div>
          <div class="slider-wrapper ct-slider" id="ct-slider">
            <div class="slider-fill" id="ct-fill"></div>
            <div class="slider-thumb" id="ct-thumb"></div>
          </div>
        </div>

        <!-- Color Presets -->
        <div class="control-row" id="color-row" style="display:none">
          <div class="control-label">
            <span>Color</span>
          </div>
          <div class="color-section">
            <div class="color-grid" id="color-grid">
              ${colorDotsHTML}
            </div>
          </div>
        </div>

      </div>

      <div class="footer">
        <div class="footer-info" id="footer-info">
          <ha-icon icon="mdi:home" style="--mdc-icon-size:13px"></ha-icon>
          <span id="footer-text">—</span>
        </div>
        <div class="brand-mark">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="#D97757"/>
            <circle cx="12" cy="12" r="4" fill="#D97757" opacity="0.6"/>
          </svg>
          <span>Claude</span>
        </div>
      </div>

      <div class="unavailable-overlay" id="unavailable-overlay" style="display:none">
        <ha-icon icon="mdi:lan-disconnect"></ha-icon>
        <span>Unavailable</span>
      </div>
    `;
  }

  // ── State update ─────────────────────────────────────────────────────────────

  _updateState() {
    if (!this._hass || !this._config.entity || !this._card) return;

    const stateObj = this._hass.states[this._config.entity];
    if (!stateObj) return;

    const isOn         = stateObj.state === 'on';
    const isUnavail    = stateObj.state === 'unavailable';
    const attrs        = stateObj.attributes || {};
    const friendlyName = this._config.name || attrs.friendly_name || this._config.entity;
    const icon         = this._config.icon || attrs.icon || 'mdi:lightbulb';

    // card class
    this._card.classList.toggle('light-on',  isOn && !isUnavail);

    // unavailable overlay
    this._q('#unavailable-overlay').style.display = isUnavail ? 'flex' : 'none';

    // icon & name
    this._q('#entity-icon').setAttribute('icon', isOn ? 'mdi:lightbulb' : 'mdi:lightbulb-outline');
    this._q('#entity-name').textContent = friendlyName;

    // state text
    const stateLabel = isOn
      ? (attrs.brightness ? `${Math.round(attrs.brightness / 2.55)}% · On` : 'On')
      : stateObj.state.charAt(0).toUpperCase() + stateObj.state.slice(1);
    this._q('#state-text').textContent = stateLabel;

    // toggle
    const toggle = this._q('#toggle');
    toggle.classList.toggle('active', isOn);
    this._q('#toggle-input').checked = isOn;

    // controls visibility
    this._q('#controls').style.opacity = isOn ? '1' : '0.4';
    this._q('#controls').style.pointerEvents = isOn ? 'auto' : 'none';

    // brightness
    const supportsBrightness = attrs.supported_color_modes?.some(m =>
      ['brightness','color_temp','hs','rgb','rgbw','rgbww','xy'].includes(m)
    );
    const brightnessRow = this._q('#brightness-row');
    if (this._config.show_brightness && supportsBrightness) {
      brightnessRow.style.display = 'flex';
      if (!this._isDraggingBrightness) {
        const pct = attrs.brightness ? Math.round(attrs.brightness / 2.55) : 100;
        this._q('#brightness-value').textContent = `${pct}%`;
        this._setSliderPct('#brightness-fill', '#brightness-thumb', pct);
      }
    } else {
      brightnessRow.style.display = 'none';
    }

    // color temperature
    const supportsColorTemp = attrs.supported_color_modes?.includes('color_temp');
    const ctRow = this._q('#ct-row');
    if (this._config.show_color_temp && supportsColorTemp && attrs.min_mireds && attrs.max_mireds) {
      ctRow.style.display = 'flex';
      if (!this._isDraggingCT) {
        const mireds   = attrs.color_temp || attrs.min_mireds;
        const min      = attrs.min_mireds;
        const max      = attrs.max_mireds;
        const kelvin   = Math.round(1000000 / mireds);
        const pct      = Math.round(((mireds - min) / (max - min)) * 100);
        this._q('#ct-value').textContent = `${kelvin}K`;
        this._setSliderPct('#ct-fill', '#ct-thumb', pct);
        this._ctMin    = min;
        this._ctMax    = max;
      }
    } else {
      ctRow.style.display = 'none';
    }

    // color presets
    const supportsColor = attrs.supported_color_modes?.some(m =>
      ['hs','rgb','rgbw','rgbww','xy'].includes(m)
    );
    this._q('#color-row').style.display =
      this._config.show_color && supportsColor ? 'flex' : 'none';

    // footer
    const area  = stateObj.area_id || '';
    const parts = this._config.entity.split('.');
    this._q('#footer-text').textContent = area || parts[1]?.replace(/_/g, ' ') || '—';
  }

  // ── Events ───────────────────────────────────────────────────────────────────

  _bindEvents() {
    // Toggle
    this._q('#toggle').addEventListener('click', () => this._toggle());
    this._q('#icon-btn').addEventListener('click', () => this._toggle());

    // Brightness slider
    this._bindSlider(
      '#brightness-slider',
      (pct) => {
        this._q('#brightness-value').textContent = `${Math.round(pct)}%`;
        this._isDraggingBrightness = true;
      },
      (pct) => {
        this._isDraggingBrightness = false;
        this._callService('light', 'turn_on', {
          brightness: Math.round((pct / 100) * 255),
        });
      }
    );

    // Color temperature slider
    this._bindSlider(
      '#ct-slider',
      (pct) => {
        const min    = this._ctMin || 153;
        const max    = this._ctMax || 500;
        const mireds = Math.round(min + (pct / 100) * (max - min));
        const kelvin = Math.round(1000000 / mireds);
        this._q('#ct-value').textContent = `${kelvin}K`;
        this._isDraggingCT = true;
        this._pendingCT    = mireds;
      },
      () => {
        this._isDraggingCT = false;
        if (this._pendingCT) {
          this._callService('light', 'turn_on', { color_temp: this._pendingCT });
        }
      }
    );

    // Color presets
    this._q('#color-grid').addEventListener('click', (e) => {
      const dot = e.target.closest('.color-dot');
      if (!dot) return;
      const idx = parseInt(dot.dataset.colorIndex, 10);
      if (isNaN(idx)) return;

      this._q('#color-grid').querySelectorAll('.color-dot')
        .forEach(d => d.classList.remove('selected'));
      dot.classList.add('selected');

      const color = COLOR_PRESETS[idx];
      this._callService('light', 'turn_on', {
        hs_color: color.hs,
      });
    });
  }

  _bindSlider(selector, onMove, onEnd) {
    const wrapper = this._q(selector);
    if (!wrapper) return;

    const getPercent = (clientX) => {
      const rect = wrapper.getBoundingClientRect();
      const raw  = (clientX - rect.left) / rect.width;
      return Math.max(0, Math.min(100, raw * 100));
    };

    const moveHandler = (e) => {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const pct     = getPercent(clientX);
      this._setSliderPct(
        selector + ' .slider-fill',
        selector + ' .slider-thumb',
        pct
      );
      wrapper.classList.add('dragging');
      onMove(pct);
    };

    const endHandler = (e) => {
      wrapper.classList.remove('dragging');
      const clientX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
      const pct     = getPercent(clientX);
      onEnd(pct);
      document.removeEventListener('mousemove', moveHandler);
      document.removeEventListener('mouseup',   endHandler);
      document.removeEventListener('touchmove', moveHandler);
      document.removeEventListener('touchend',  endHandler);
    };

    wrapper.addEventListener('mousedown', (e) => {
      moveHandler(e);
      document.addEventListener('mousemove', moveHandler);
      document.addEventListener('mouseup',   endHandler);
    });

    wrapper.addEventListener('touchstart', (e) => {
      moveHandler(e);
      document.addEventListener('touchmove', moveHandler, { passive: true });
      document.addEventListener('touchend',  endHandler);
    }, { passive: true });
  }

  // ── Helpers ──────────────────────────────────────────────────────────────────

  _setSliderPct(fillSel, thumbSel, pct) {
    const fill  = typeof fillSel  === 'string' ? this._q(fillSel)  : fillSel;
    const thumb = typeof thumbSel === 'string' ? this._q(thumbSel) : thumbSel;
    if (fill)  fill.style.width = `${pct}%`;
    if (thumb) thumb.style.left = `${pct}%`;
  }

  _q(selector) {
    return this._card?.querySelector(selector) ?? null;
  }

  _toggle() {
    if (!this._hass || !this._config.entity) return;
    const stateObj = this._hass.states[this._config.entity];
    if (!stateObj || stateObj.state === 'unavailable') return;
    const action = stateObj.state === 'on' ? 'turn_off' : 'turn_on';
    this._callService('light', action, {});
  }

  _callService(domain, service, data) {
    this._hass.callService(domain, service, {
      entity_id: this._config.entity,
      ...data,
    });
  }
}

// ─── Config Editor (optional) ─────────────────────────────────────────────────

class ClaudeLightCardEditor extends HTMLElement {
  setConfig(config) { this._config = config; }
  set hass(hass)    { this._hass   = hass; }
}

// ─── Register ─────────────────────────────────────────────────────────────────

customElements.define('claude-light-card',        ClaudeLightCard);
customElements.define('claude-light-card-editor', ClaudeLightCardEditor);

window.customCards = window.customCards || [];
window.customCards.push({
  type:        'claude-light-card',
  name:        'Claude Light Card',
  description: 'A sleek light entity card styled after the Anthropic Claude AI aesthetic.',
  preview:     true,
  documentationURL: 'https://github.com/your-repo/claude-light-card',
});

console.info(
  `%c CLAUDE LIGHT CARD %c v${CARD_VERSION} `,
  'background:#D97757;color:#fff;font-weight:700;padding:2px 6px;border-radius:4px 0 0 4px',
  'background:#1C1917;color:#D97757;font-weight:600;padding:2px 6px;border-radius:0 4px 4px 0'
);
