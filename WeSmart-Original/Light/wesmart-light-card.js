/**
 * WeSmart Light Card - Home Assistant Custom Card
 * Styled after Anthropic WeSmart AI aesthetic
 * Version: 1.2.0
 */

const CARD_VERSION = '1.3.0';

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = `
  :host {
    --claude-orange: #D97757;
    --claude-orange-glow: rgba(217, 119, 87, 0.25);
    --claude-orange-soft: rgba(217, 119, 87, 0.15);
    --claude-success: #7CB87A;
    --claude-radius: 20px;
    --claude-radius-sm: 12px;
    --claude-radius-xs: 8px;
    --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    display: block;
    font-family: -apple-system, 'Söhne', 'Inter', BlinkMacSystemFont, sans-serif;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  /* ── Themes ── */
  .card {
    --claude-surface:    #292524;
    --claude-surface-2:  #332E2A;
    --claude-border:     rgba(255, 255, 255, 0.08);
    --claude-text:       #F5F0EB;
    --claude-text-muted: #A09080;
    --claude-text-dim:   #6B5F56;
    --overlay-bg:        rgba(28, 25, 23, 0.7);

    background: var(--claude-surface);
    border: 1px solid var(--claude-border);
    border-radius: var(--claude-radius);
    padding: 20px;
    position: relative;
    overflow: hidden;
    transition: var(--transition);
  }

  .card.theme-light {
    --claude-surface:    #FFFEFA;
    --claude-surface-2:  #F5F0EB;
    --claude-border:     rgba(28, 25, 23, 0.09);
    --claude-text:       #1C1917;
    --claude-text-muted: #6B5F56;
    --claude-text-dim:   #A09080;
    --overlay-bg:        rgba(245, 240, 235, 0.8);
  }

  @media (prefers-color-scheme: light) {
    .card.theme-auto {
      --claude-surface:    #FFFEFA;
      --claude-surface-2:  #F5F0EB;
      --claude-border:     rgba(28, 25, 23, 0.09);
      --claude-text:       #1C1917;
      --claude-text-muted: #6B5F56;
      --claude-text-dim:   #A09080;
      --overlay-bg:        rgba(245, 240, 235, 0.8);
    }
  }

  .card::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse 60% 50% at 50% -10%, var(--claude-orange-soft), transparent);
    opacity: 0;
    transition: opacity 0.5s ease;
    pointer-events: none;
  }

  .card.light-on::before { opacity: 1; }

  @keyframes pulse-glow {
    0%, 100% { box-shadow: 0 0 0 1px rgba(217,119,87,0.1), 0 8px 32px rgba(0,0,0,0.4), 0 0 60px var(--claude-orange-glow); }
    50%       { box-shadow: 0 0 0 1px rgba(217,119,87,0.2), 0 8px 32px rgba(0,0,0,0.4), 0 0 80px rgba(217,119,87,0.35); }
  }

  .card.light-on {
    border-color: rgba(217, 119, 87, 0.2);
    animation: pulse-glow 3s ease-in-out infinite;
  }

  /* ── Header ── */
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
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

  .card.light-on .icon-wrapper::after { opacity: 1; }

  .icon-wrapper ha-icon {
    color: var(--claude-text-muted);
    transition: var(--transition);
    position: relative;
    z-index: 1;
    --mdc-icon-size: 22px;
  }

  .card.light-on .icon-wrapper ha-icon { color: var(--claude-orange); }

  .entity-details { flex: 1; min-width: 0; }

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

  /* ── Collapsible controls wrapper ─────────────────────────────────────────── */
  /*
   * overflow: visible so slider thumbs (which extend outside the 6px track)
   * are never clipped. The collapse is achieved via max-height + translateY.
   */
  .controls-wrapper {
    overflow: visible;
    max-height: 600px;
    opacity: 1;
    margin-top: 18px;
    margin-bottom: 4px;
    transition:
      max-height  0.42s cubic-bezier(0.4, 0, 0.2, 1),
      opacity     0.32s ease,
      margin-top  0.38s cubic-bezier(0.4, 0, 0.2, 1),
      margin-bottom 0.38s ease;
  }

  .controls-wrapper.collapsed {
    max-height: 0;
    opacity: 0;
    margin-top: 0;
    margin-bottom: 0;
    /* We can't use overflow:hidden here because that clips thumbs — instead
       the content naturally hides as max-height → 0 with overflow:visible.
       On some browsers the content peeks through at intermediate frames;
       a clip-path keeps it clean without affecting children overflow. */
    clip-path: inset(0);
    pointer-events: none;
  }

  .controls-wrapper:not(.collapsed) {
    clip-path: none;
  }

  /* Slide-in animation for the inner content */
  .controls {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 2px 0 12px;  /* vertical breathing room so slider thumbs aren't flush */
    transition: transform 0.42s cubic-bezier(0.34, 1.18, 0.64, 1);
    transform: translateY(0);
  }

  .controls-wrapper.collapsed .controls {
    transform: translateY(-14px);
  }

  /* ── Control rows ── */
  .control-row {
    display: flex;
    flex-direction: column;
    gap: 10px;
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

  /* ── Brightness slider ── */
  .slider-wrapper {
    position: relative;
    height: 8px;
    border-radius: 4px;
    background: var(--claude-surface-2);
    border: 1px solid var(--claude-border);
    cursor: pointer;
    overflow: visible;   /* thumbs always visible */
  }

  .slider-fill {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    border-radius: 4px;
    background: linear-gradient(90deg, rgba(217,119,87,0.35), var(--claude-orange));
    transition: width 0.1s ease;
    pointer-events: none;
  }

  .slider-thumb {
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: var(--claude-text);
    border: 2.5px solid var(--claude-orange);
    box-shadow: 0 0 0 0 var(--claude-orange-glow), 0 2px 6px rgba(0,0,0,0.35);
    transition: box-shadow 0.2s ease, transform 0.2s ease;
    pointer-events: none;
    z-index: 2;
  }

  .slider-wrapper:hover .slider-thumb,
  .slider-wrapper.dragging .slider-thumb {
    box-shadow: 0 0 0 7px var(--claude-orange-glow), 0 2px 6px rgba(0,0,0,0.35);
    transform: translate(-50%, -50%) scale(1.15);
  }

  /* ── Color Temperature slider ── */
  .ct-slider .slider-fill {
    /* warm (low K, high mireds) on left → cool (high K, low mireds) on right
       Slider moves left=warm, right=cool */
    background: linear-gradient(90deg, #FFB347, #FFDC80, #FFF5CC, #E8F4FF, #B8DAFF);
  }

  .ct-slider .slider-thumb {
    border-color: #c8b080;
    background: #fff;
  }

  /* ── Hue picker — same geometry as brightness slider, rainbow track ── */
  .hue-slider {
    background: linear-gradient(to right,
      hsl(0,80%,45%), hsl(45,80%,45%), hsl(90,80%,40%), hsl(135,80%,40%),
      hsl(180,80%,40%), hsl(225,80%,45%), hsl(270,80%,45%), hsl(315,80%,45%),
      hsl(360,80%,45%));
    border-color: rgba(255,255,255,0.05);
  }

  .hue-slider .slider-fill { display: none; }

  .hue-slider .slider-thumb {
    border-color: rgba(255,255,255,0.85);
    background: hsl(0, 100%, 50%);
    box-shadow: 0 0 0 1px rgba(0,0,0,0.3), 0 2px 5px rgba(0,0,0,0.4);
  }

  .hue-slider:hover .slider-thumb,
  .hue-slider.dragging .slider-thumb {
    box-shadow: 0 0 0 1px rgba(0,0,0,0.3), 0 0 0 5px rgba(255,255,255,0.18), 0 2px 5px rgba(0,0,0,0.4);
    transform: translate(-50%, -50%) scale(1.15);
  }

  /* ── Footer ── */
  .footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 14px;
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

  /* ── Unavailable overlay ── */
  .unavailable-overlay {
    position: absolute;
    inset: 0;
    background: var(--overlay-bg, rgba(28, 25, 23, 0.7));
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

  /* ── Brand mark ── */
  .brand-mark {
    display: flex;
    align-items: center;
    gap: 5px;
    opacity: 0.4;
  }

  .brand-mark svg { width: 14px; height: 14px; }

  .brand-mark span {
    font-size: 10px;
    color: var(--claude-text-dim);
    letter-spacing: 0.05em;
  }
`;

// ─── Custom Element ────────────────────────────────────────────────────────────

class WeSmartLightCard extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._config = {};
    this._hass   = null;
    this._isDraggingBrightness = false;
    this._isDraggingCT         = false;
    this._isDraggingHue        = false;
  }

  // ── HA lifecycle ─────────────────────────────────────────────────────────────

  static getConfigElement() {
    return document.createElement('wesmart-light-card-editor');
  }

  static getStubConfig() {
    return { entity: 'light.example' };
  }

  setConfig(config) {
    if (!config.entity) throw new Error('entity is required');
    this._config = {
      name:             null,
      icon:             null,
      show_brightness:  true,
      show_color_temp:  true,
      show_color:       true,
      theme:            'dark',
      collapse_when_off: false,
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
    this._card.className = 'card theme-' + (this._config.theme || 'dark');
    this._card.innerHTML = this._getHTML();
    shadow.appendChild(this._card);

    this._bindEvents();
    this._updateState();
  }

  _getHTML() {
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

      <div class="controls-wrapper" id="controls-wrapper">
        <div class="controls" id="controls">

          <!-- Brightness -->
          <div class="control-row" id="brightness-row" style="display:none">
            <div class="control-label">
              <span>Brightness</span>
              <span class="control-value" id="brightness-value">—</span>
            </div>
            <div class="slider-wrapper" id="brightness-slider">
              <div class="slider-fill" id="brightness-fill"></div>
              <div class="slider-thumb" id="brightness-thumb"></div>
            </div>
          </div>

          <!-- Color Temperature / Kelvin -->
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

          <!-- Hue / Color picker -->
          <div class="control-row" id="color-row" style="display:none">
            <div class="control-label">
              <span>Color</span>
              <span class="control-value" id="hue-value">—</span>
            </div>
            <div class="slider-wrapper hue-slider" id="hue-track">
              <div class="slider-fill" style="display:none"></div>
              <div class="slider-thumb hue-thumb" id="hue-thumb" style="left:0%"></div>
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
          <span>WeSmart</span>
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

    const isOn      = stateObj.state === 'on';
    const isUnavail = stateObj.state === 'unavailable';
    const attrs     = stateObj.attributes || {};
    const name      = this._config.name || attrs.friendly_name || this._config.entity;

    // ── Card state ──────────────────────────────────────────────────────────
    this._card.classList.toggle('light-on', isOn && !isUnavail);
    this._q('#unavailable-overlay').style.display = isUnavail ? 'flex' : 'none';

    // ── Icon & name ─────────────────────────────────────────────────────────
    this._q('#entity-icon').setAttribute('icon', isOn ? 'mdi:lightbulb' : 'mdi:lightbulb-outline');
    this._q('#entity-name').textContent = name;

    // ── State text ──────────────────────────────────────────────────────────
    let stateLabel = isOn
      ? (attrs.brightness ? `${Math.round(attrs.brightness / 2.55)}% · On` : 'On')
      : (stateObj.state.charAt(0).toUpperCase() + stateObj.state.slice(1));
    this._q('#state-text').textContent = stateLabel;

    // ── Toggle ──────────────────────────────────────────────────────────────
    this._q('#toggle').classList.toggle('active', isOn);
    this._q('#toggle-input').checked = isOn;

    // ── Collapse when off ───────────────────────────────────────────────────
    const wrapper = this._q('#controls-wrapper');
    if (wrapper) {
      const shouldCollapse = this._config.collapse_when_off && !isOn;
      wrapper.classList.toggle('collapsed', shouldCollapse);
    }

    // ── Dim/disable controls when off (non-collapse mode) ──────────────────
    if (!this._config.collapse_when_off) {
      this._q('#controls').style.opacity      = isOn ? '1' : '0.4';
      this._q('#controls').style.pointerEvents = isOn ? 'auto' : 'none';
    } else {
      this._q('#controls').style.opacity      = '1';
      this._q('#controls').style.pointerEvents = 'auto';
    }

    // ── Brightness ──────────────────────────────────────────────────────────
    const colorModes = attrs.supported_color_modes ?? [];
    const supportsBrightness = colorModes.some(m =>
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

    // ── Color Temperature (Kelvin) ──────────────────────────────────────────
    // HA 2022.9+ reports color_temp_kelvin, min_color_temp_kelvin, max_color_temp_kelvin
    // Older HA uses color_temp (mireds), min_mireds, max_mireds
    // Accept both — kelvin-native takes priority
    const minK = attrs.min_color_temp_kelvin
      ?? (attrs.max_mireds ? Math.round(1000000 / attrs.max_mireds) : null);
    const maxK = attrs.max_color_temp_kelvin
      ?? (attrs.min_mireds ? Math.round(1000000 / attrs.min_mireds) : null);
    const hasKRange = minK != null && maxK != null;

    // Also accept lights that just expose color_temp_kelvin without explicit range
    const supportsColorTemp = colorModes.includes('color_temp')
      || hasKRange
      || attrs.color_temp_kelvin != null
      || attrs.color_temp != null;

    const ctRow = this._q('#ct-row');

    if (this._config.show_color_temp && supportsColorTemp && hasKRange) {
      ctRow.style.display = 'flex';
      if (!this._isDraggingCT) {
        const curK = attrs.color_temp_kelvin
          ?? (attrs.color_temp ? Math.round(1000000 / attrs.color_temp) : null)
          ?? Math.round((minK + maxK) / 2);
        const pct = Math.round(((curK - minK) / (maxK - minK)) * 100);
        this._q('#ct-value').textContent = `${curK} K`;
        this._setSliderPct('#ct-fill', '#ct-thumb', Math.max(0, Math.min(100, pct)));
        this._ctMinK = minK;
        this._ctMaxK = maxK;
      }
    } else {
      ctRow.style.display = 'none';
    }

    // ── Hue picker ──────────────────────────────────────────────────────────
    const supportsColor = colorModes.some(m =>
      ['hs','rgb','rgbw','rgbww','xy'].includes(m)
    );
    const colorRow = this._q('#color-row');

    if (this._config.show_color && supportsColor) {
      colorRow.style.display = 'flex';
      if (!this._isDraggingHue) {
        // Read current hue from hs_color, rgb_color or xy_color
        let hue = 0;
        if (attrs.hs_color) {
          hue = attrs.hs_color[0];
        } else if (attrs.rgb_color) {
          hue = this._rgbToHue(...attrs.rgb_color);
        }
        this._setHueThumb(hue);
      }
    } else {
      colorRow.style.display = 'none';
    }

    // ── Footer ──────────────────────────────────────────────────────────────
    const parts = this._config.entity.split('.');
    this._q('#footer-text').textContent = parts[1]?.replace(/_/g, ' ') || '—';
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
        this._isDraggingBrightness = true;
        this._q('#brightness-value').textContent = `${Math.round(pct)}%`;
      },
      (pct) => {
        this._isDraggingBrightness = false;
        this._callService('light', 'turn_on', {
          brightness: Math.round((pct / 100) * 255),
        });
      }
    );

    // CT slider — works in kelvin natively
    this._bindSlider(
      '#ct-slider',
      (pct) => {
        this._isDraggingCT = true;
        const minK   = this._ctMinK || 2700;
        const maxK   = this._ctMaxK || 6500;
        const kelvin = Math.round(minK + (pct / 100) * (maxK - minK));
        this._q('#ct-value').textContent = `${kelvin} K`;
        this._pendingCTK = kelvin;
      },
      () => {
        this._isDraggingCT = false;
        if (this._pendingCTK) {
          // Send kelvin (HA 2022.9+); also send mireds for older HA
          this._callService('light', 'turn_on', {
            color_temp_kelvin: this._pendingCTK,
          });
        }
      }
    );

    // Hue picker
    this._bindHuePicker();
  }

  _bindHuePicker() {
    const track = this._q('#hue-track');
    if (!track) return;

    const getHue = (clientX) => {
      const rect = track.getBoundingClientRect();
      const raw  = (clientX - rect.left) / rect.width;
      return Math.max(0, Math.min(360, raw * 360));
    };

    const onMove = (e) => {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const hue     = getHue(clientX);
      this._isDraggingHue = true;
      this._pendingHue    = hue;
      this._setHueThumb(hue);
      track.classList.add('dragging');
    };

    const onEnd = () => {
      track.classList.remove('dragging');
      this._isDraggingHue = false;
      if (this._pendingHue != null) {
        this._callService('light', 'turn_on', {
          hs_color: [Math.round(this._pendingHue), 1.0],
        });
      }
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup',   onEnd);
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('touchend',  onEnd);
    };

    track.addEventListener('mousedown', (e) => {
      onMove(e);
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup',   onEnd);
    });

    track.addEventListener('touchstart', (e) => {
      onMove(e);
      document.addEventListener('touchmove', onMove, { passive: true });
      document.addEventListener('touchend',  onEnd);
    }, { passive: true });
  }

  _setHueThumb(hue) {
    const pct   = (hue / 360) * 100;
    const thumb = this._q('#hue-thumb');
    if (!thumb) return;
    thumb.style.left            = `${pct}%`;
    thumb.style.background      = `hsl(${Math.round(hue)}, 100%, 50%)`;
    // Show hue as a warm label (e.g. "Red 0°" is too verbose — just show K-like value)
    this._q('#hue-value').textContent = `${Math.round(hue)}°`;
  }

  // ── Slider helper ─────────────────────────────────────────────────────────────

  _bindSlider(selector, onMove, onEnd) {
    const wrapper = this._q(selector);
    if (!wrapper) return;

    const getPct = (clientX) => {
      const rect = wrapper.getBoundingClientRect();
      return Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    };

    const moveHandler = (e) => {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const pct     = getPct(clientX);
      this._setSliderPct(selector + ' .slider-fill', selector + ' .slider-thumb', pct);
      wrapper.classList.add('dragging');
      onMove(pct);
    };

    const endHandler = (e) => {
      wrapper.classList.remove('dragging');
      const clientX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
      onEnd(getPct(clientX));
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
    this._callService('light', stateObj.state === 'on' ? 'turn_off' : 'turn_on', {});
  }

  _callService(domain, service, data) {
    this._hass.callService(domain, service, {
      entity_id: this._config.entity,
      ...data,
    });
  }

  /** Convert RGB (0–255 each) to hue (0–360) */
  _rgbToHue(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const d   = max - min;
    if (d === 0) return 0;
    let h;
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      default: h = ((r - g) / d + 4) / 6;
    }
    return Math.round(h * 360);
  }
}

// ─── Config Editor (stub) ─────────────────────────────────────────────────────

class WeSmartLightCardEditor extends HTMLElement {
  setConfig(config) { this._config = config; }
  set hass(hass)    { this._hass   = hass; }
}

// ─── Register ─────────────────────────────────────────────────────────────────

customElements.define('wesmart-light-card',        WeSmartLightCard);
customElements.define('wesmart-light-card-editor', WeSmartLightCardEditor);

window.customCards = window.customCards || [];
window.customCards.push({
  type:        'wesmart-light-card',
  name:        'WeSmart Light Card',
  description: 'Light entity card with brightness, Kelvin/CT, and hue color picker. Supports collapse_when_off.',
  preview:     true,
  documentationURL: 'https://github.com/your-repo/wesmart-light-card',
});

console.info(
  `%c WESMART LIGHT CARD %c v${CARD_VERSION} `,
  'background:#D97757;color:#fff;font-weight:700;padding:2px 6px;border-radius:4px 0 0 4px',
  'background:#1C1917;color:#D97757;font-weight:600;padding:2px 6px;border-radius:0 4px 4px 0'
);
