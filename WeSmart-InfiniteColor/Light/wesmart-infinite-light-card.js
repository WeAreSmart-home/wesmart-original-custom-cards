/**
 * WeSmart Infinite Light Card - Home Assistant Custom Card
 * Single light entity card with brightness, Kelvin/CT, and hue color picker.
 * Infinite Color Engine: full palette derived from a single base color.
 * Version: 1.0.0
 */

(() => {

  const CARD_VERSION = '1.0.0';

  // ─── Styles ───────────────────────────────────────────────────────────────────

  const styles = `
  :host {
    --radius: 20px;
    --radius-sm: 12px;
    --radius-xs: 8px;
    --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    display: block;
    font-family: -apple-system, 'Söhne', 'Inter', BlinkMacSystemFont, sans-serif;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .card {
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 20px;
    position: relative;
    overflow: hidden;
    transition: var(--transition);
    box-shadow: var(--shadow);
    color: var(--text);
  }

  /* Radial glow when light is on */
  .card::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse 60% 50% at 50% -10%, var(--accent-soft), transparent);
    opacity: 0;
    transition: opacity 0.5s ease;
    pointer-events: none;
  }

  .card.light-on::before { opacity: 1; }

  @keyframes pulse-glow {
    0%, 100% { box-shadow: var(--shadow), 0 0 60px var(--accent-glow); }
    50%       { box-shadow: var(--shadow), 0 0 80px var(--accent-glow-strong); }
  }

  .card.light-on {
    border-color: var(--accent-border);
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
    border-radius: var(--radius-sm);
    background: var(--surface);
    border: 1px solid var(--border);
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
    background: var(--accent-soft);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .card.light-on .icon-wrapper {
    border-color: var(--accent-border);
    background: var(--accent-soft);
  }

  .card.light-on .icon-wrapper::after { opacity: 1; }

  .icon-wrapper ha-icon {
    color: var(--text-muted);
    transition: var(--transition);
    position: relative;
    z-index: 1;
    --mdc-icon-size: 22px;
  }

  .card.light-on .icon-wrapper ha-icon { color: var(--accent); }

  .entity-details { flex: 1; min-width: 0; }

  .entity-name {
    font-size: 15px;
    font-weight: 600;
    color: var(--text);
    letter-spacing: -0.01em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .entity-state {
    font-size: 12px;
    color: var(--text-muted);
    margin-top: 2px;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .state-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--text-dim);
    transition: var(--transition);
    flex-shrink: 0;
  }

  .card.light-on .state-dot {
    background: var(--accent);
    box-shadow: 0 0 8px var(--accent-glow);
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
    background: var(--surface);
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
    background: var(--text-dim);
    transition: var(--transition);
    box-shadow: 0 1px 4px rgba(0,0,0,0.4);
  }

  .toggle-switch.active .toggle-track {
    background: var(--accent-soft);
    border-color: var(--accent-border);
  }

  .toggle-switch.active .toggle-thumb {
    left: 23px;
    background: var(--accent);
    box-shadow: 0 0 10px var(--accent-glow);
  }

  /* ── Collapsible controls wrapper ── */
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
    clip-path: inset(0);
    pointer-events: none;
  }

  .controls-wrapper:not(.collapsed) { clip-path: none; }

  .controls {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 2px 0 12px;
    transition: transform 0.42s cubic-bezier(0.34, 1.18, 0.64, 1);
    transform: translateY(0);
  }

  .controls-wrapper.collapsed .controls { transform: translateY(-14px); }

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
    color: var(--text-dim);
  }

  .control-value {
    font-size: 13px;
    font-weight: 600;
    color: var(--accent);
    font-variant-numeric: tabular-nums;
  }

  /* ── Brightness slider ── */
  .slider-wrapper {
    position: relative;
    height: 8px;
    border-radius: 4px;
    background: var(--surface);
    border: 1px solid var(--border);
    cursor: pointer;
    overflow: visible;
  }

  .slider-fill {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    border-radius: 4px;
    background: linear-gradient(90deg, var(--accent-soft), var(--accent));
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
    background: var(--text);
    border: 2.5px solid var(--accent);
    box-shadow: 0 0 0 0 var(--accent-glow), 0 2px 6px rgba(0,0,0,0.35);
    transition: box-shadow 0.2s ease, transform 0.2s ease;
    pointer-events: none;
    z-index: 2;
  }

  .slider-wrapper:hover .slider-thumb,
  .slider-wrapper.dragging .slider-thumb {
    box-shadow: 0 0 0 7px var(--accent-glow), 0 2px 6px rgba(0,0,0,0.35);
    transform: translate(-50%, -50%) scale(1.15);
  }

  /* ── Color Temperature slider ── */
  .ct-slider .slider-fill {
    background: linear-gradient(90deg, #FFB347, #FFDC80, #FFF5CC, #E8F4FF, #B8DAFF);
  }

  .ct-slider .slider-thumb {
    border-color: #c8b080;
    background: #fff;
  }

  /* ── Hue picker ── */
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
    border-top: 1px solid var(--border);
    position: relative;
    z-index: 1;
  }

  .footer-info {
    font-size: 11px;
    color: var(--text-dim);
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .footer-info ha-icon { --mdc-icon-size: 13px; }

  /* ── Unavailable overlay ── */
  .unavailable-overlay {
    position: absolute;
    inset: 0;
    background: var(--overlay-bg, rgba(28, 25, 23, 0.7));
    backdrop-filter: blur(2px);
    border-radius: var(--radius);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    z-index: 10;
  }

  .unavailable-overlay span {
    font-size: 13px;
    color: var(--text-muted);
    font-weight: 500;
  }

  .unavailable-overlay ha-icon {
    color: var(--text-dim);
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
    color: var(--text-dim);
    letter-spacing: 0.05em;
    font-weight: 700;
  }
`;

  // ─── Custom Element ────────────────────────────────────────────────────────────

  class WeSmartInfiniteLightCard extends HTMLElement {

    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this._config = {};
      this._hass   = null;
      this._isDraggingBrightness = false;
      this._isDraggingCT         = false;
      this._isDraggingHue        = false;
      this._palette = null;
      this._mqHandler = null;
    }

    // ── HA lifecycle ─────────────────────────────────────────────────────────────

    static getStubConfig() {
      return { entity: 'light.example', color: '#D97757' };
    }

    setConfig(config) {
      if (!config.entity) throw new Error('entity is required');
      this._config = {
        name:              null,
        icon:              null,
        color:             '#D97757',
        show_brightness:   true,
        show_color_temp:   true,
        show_color:        true,
        theme:             'dark',
        collapse_when_off: false,
        ...config,
      };
      this._applyPalette();
      this._render();
    }

    set hass(hass) {
      this._hass = hass;
      this._updateState();
    }

    getCardSize() { return 3; }

    disconnectedCallback() {
      if (this._mqHandler) {
        window.matchMedia('(prefers-color-scheme: light)').removeEventListener('change', this._mqHandler);
        this._mqHandler = null;
      }
    }

    // ── Color Engine ─────────────────────────────────────────────────────────────

    _hexToHsl(hex) {
      let r = parseInt(hex.slice(1, 3), 16) / 255;
      let g = parseInt(hex.slice(3, 5), 16) / 255;
      let b = parseInt(hex.slice(5, 7), 16) / 255;
      const max = Math.max(r, g, b), min = Math.min(r, g, b);
      let h, s, l = (max + min) / 2;
      if (max === min) { h = s = 0; }
      else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
          case g: h = ((b - r) / d + 2) / 6; break;
          case b: h = ((r - g) / d + 4) / 6; break;
        }
      }
      return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
    }

    _clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
    _hsl(h, s, l)       { return `hsl(${h},${s}%,${l}%)`; }
    _hsla(h, s, l, a)   { return `hsla(${h},${s}%,${l}%,${a})`; }

    _buildPalette(hex, isDark) {
      const { h, s, l } = this._hexToHsl(hex);
      const c = this._clamp.bind(this);
      if (isDark) {
        const aL = c(l, 50, 65);
        return {
          accent:          this._hsl(h, s, aL),
          accentSoft:      this._hsla(h, s, aL, 0.12),
          accentGlow:      this._hsla(h, s, aL, 0.25),
          accentGlowStrong:this._hsla(h, s, aL, 0.40),
          accentBorder:    this._hsla(h, s, aL, 0.30),
          bg:              this._hsl(h, c(Math.round(s * 0.35), 25, 45), 11),
          surface:         this._hsl(h, c(Math.round(s * 0.28), 20, 38), 16),
          border:          'hsla(0,0%,100%,0.08)',
          text:            this._hsl(h, c(Math.round(s * 0.08), 5, 10), 93),
          textMuted:       this._hsl(h, c(Math.round(s * 0.12), 8, 15), 65),
          textDim:         this._hsl(h, c(Math.round(s * 0.10), 6, 12), 42),
          overlayBg:       this._hsla(h, c(Math.round(s * 0.20), 15, 25), 9, 0.75),
          shadow:          `0 8px 32px ${this._hsla(h, s, 5, 0.45)}`,
        };
      } else {
        const aL = c(l, 35, 52);
        return {
          accent:          this._hsl(h, s, aL),
          accentSoft:      this._hsla(h, s, aL, 0.10),
          accentGlow:      this._hsla(h, s, aL, 0.20),
          accentGlowStrong:this._hsla(h, s, aL, 0.30),
          accentBorder:    this._hsla(h, s, aL, 0.25),
          bg:              this._hsl(h, c(Math.round(s * 0.06), 4, 8), 99),
          surface:         this._hsl(h, c(Math.round(s * 0.10), 6, 12), 95),
          border:          `hsla(${h},${s}%,${aL}%,0.12)`,
          text:            this._hsl(h, c(Math.round(s * 0.15), 10, 20), 12),
          textMuted:       this._hsl(h, c(Math.round(s * 0.12), 8, 15), 42),
          textDim:         this._hsl(h, c(Math.round(s * 0.10), 6, 12), 62),
          overlayBg:       this._hsla(h, c(Math.round(s * 0.10), 6, 12), 95, 0.82),
          shadow:          `0 2px 16px ${this._hsla(h, s, 5, 0.10)}, 0 0 0 1px ${this._hsla(h, s, 5, 0.06)}`,
        };
      }
    }

    _applyPalette() {
      const isDark = this._config.theme === 'auto'
        ? !window.matchMedia('(prefers-color-scheme: light)').matches
        : this._config.theme !== 'light';
      this._palette = this._buildPalette(this._config.color || '#D97757', isDark);
      const p = this._palette;
      const s = this.style;
      s.setProperty('--accent',           p.accent);
      s.setProperty('--accent-soft',      p.accentSoft);
      s.setProperty('--accent-glow',      p.accentGlow);
      s.setProperty('--accent-glow-strong', p.accentGlowStrong);
      s.setProperty('--accent-border',    p.accentBorder);
      s.setProperty('--bg',               p.bg);
      s.setProperty('--surface',          p.surface);
      s.setProperty('--border',           p.border);
      s.setProperty('--text',             p.text);
      s.setProperty('--text-muted',       p.textMuted);
      s.setProperty('--text-dim',         p.textDim);
      s.setProperty('--overlay-bg',       p.overlayBg);
      s.setProperty('--shadow',           p.shadow);

      if (this._config.theme === 'auto' && !this._mqHandler) {
        this._mqHandler = () => this._applyPalette();
        window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', this._mqHandler);
      }
    }

    _brandSVG() {
      const fill = this._palette?.accent ?? '#D97757';
      return `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.3 2.45a.74.74 0 0 0-1.38 0l-1.18 3.27H11.3L10.1 2.45a.74.74 0 0 0-1.38 0L7.3 6.37 4.1 7.56a.74.74 0 0 0 0 1.38l3.2 1.19.82 2.28-3.26 1.18a.74.74 0 0 0 0 1.38l3.26 1.18L9.3 19.2l-2.1.76a.74.74 0 0 0 0 1.38l3.26 1.18.45 1.24a.74.74 0 0 0 1.38 0l.45-1.24 3.26-1.18a.74.74 0 0 0 0-1.38l-2.1-.76 1.18-3.27 3.26-1.18a.74.74 0 0 0 0-1.38l-3.26-1.18.82-2.28 3.2-1.19a.74.74 0 0 0 0-1.38l-3.2-1.19-1.37-3.92z" fill="${fill}"/>
      </svg>`;
    }

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
              <div class="slider-thumb" id="hue-thumb" style="left:0%"></div>
            </div>
          </div>

        </div>
      </div>

      <div class="footer">
        <div class="footer-info" id="footer-info">
          <ha-icon icon="mdi:home"></ha-icon>
          <span id="footer-text">—</span>
        </div>
        <div class="brand-mark">${this._brandSVG()}<span>WeSmart</span></div>
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

      this._card.classList.toggle('light-on', isOn && !isUnavail);
      this._q('#unavailable-overlay').style.display = isUnavail ? 'flex' : 'none';

      this._q('#entity-icon').setAttribute('icon', isOn ? 'mdi:lightbulb' : 'mdi:lightbulb-outline');
      this._q('#entity-name').textContent = name;

      const stateLabel = isOn
        ? (attrs.brightness ? `${Math.round(attrs.brightness / 2.55)}% · On` : 'On')
        : (stateObj.state.charAt(0).toUpperCase() + stateObj.state.slice(1));
      this._q('#state-text').textContent = stateLabel;

      this._q('#toggle').classList.toggle('active', isOn);
      this._q('#toggle-input').checked = isOn;

      const wrapper = this._q('#controls-wrapper');
      if (wrapper) {
        const shouldCollapse = this._config.collapse_when_off && !isOn;
        wrapper.classList.toggle('collapsed', shouldCollapse);
      }

      if (!this._config.collapse_when_off) {
        this._q('#controls').style.opacity       = isOn ? '1' : '0.4';
        this._q('#controls').style.pointerEvents = isOn ? 'auto' : 'none';
      } else {
        this._q('#controls').style.opacity       = '1';
        this._q('#controls').style.pointerEvents = 'auto';
      }

      // Brightness
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

      // Color Temperature (Kelvin)
      const minK = attrs.min_color_temp_kelvin ?? (attrs.max_mireds ? Math.round(1000000 / attrs.max_mireds) : null);
      const maxK = attrs.max_color_temp_kelvin ?? (attrs.min_mireds ? Math.round(1000000 / attrs.min_mireds) : null);
      const hasKRange = minK != null && maxK != null;
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

      // Hue picker
      const supportsColor = colorModes.some(m => ['hs','rgb','rgbw','rgbww','xy'].includes(m));
      const colorRow = this._q('#color-row');
      if (this._config.show_color && supportsColor) {
        colorRow.style.display = 'flex';
        if (!this._isDraggingHue) {
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

      // Footer
      const parts = this._config.entity.split('.');
      this._q('#footer-text').textContent = parts[1]?.replace(/_/g, ' ') || '—';
    }

    // ── Events ───────────────────────────────────────────────────────────────────

    _bindEvents() {
      this._q('#toggle').addEventListener('click', () => this._toggle());
      this._q('#icon-btn').addEventListener('click', () => this._toggle());

      this._bindSlider(
        '#brightness-slider',
        (pct) => {
          this._isDraggingBrightness = true;
          this._q('#brightness-value').textContent = `${Math.round(pct)}%`;
        },
        (pct) => {
          this._isDraggingBrightness = false;
          this._callService('light', 'turn_on', { brightness: Math.round((pct / 100) * 255) });
        }
      );

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
            this._callService('light', 'turn_on', { color_temp_kelvin: this._pendingCTK });
          }
        }
      );

      this._bindHuePicker();
    }

    _bindHuePicker() {
      const track = this._q('#hue-track');
      if (!track) return;

      const getHue = (clientX) => {
        const rect = track.getBoundingClientRect();
        return Math.max(0, Math.min(360, ((clientX - rect.left) / rect.width) * 360));
      };

      const onMove = (e) => {
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const hue = getHue(clientX);
        this._isDraggingHue = true;
        this._pendingHue    = hue;
        this._setHueThumb(hue);
        track.classList.add('dragging');
      };

      const onEnd = () => {
        track.classList.remove('dragging');
        this._isDraggingHue = false;
        if (this._pendingHue != null) {
          this._callService('light', 'turn_on', { hs_color: [Math.round(this._pendingHue), 1.0] });
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
      thumb.style.left       = `${pct}%`;
      thumb.style.background = `hsl(${Math.round(hue)}, 100%, 50%)`;
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
        const pct = getPct(clientX);
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
      this._hass.callService(domain, service, { entity_id: this._config.entity, ...data });
    }

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

  // ─── Register ─────────────────────────────────────────────────────────────────

  customElements.define('wesmart-infinite-light-card', WeSmartInfiniteLightCard);

  window.customCards = window.customCards || [];
  window.customCards.push({
    type:        'wesmart-infinite-light-card',
    name:        'WeSmart Infinite Light Card',
    description: 'Single light card with brightness, Kelvin/CT, and hue color picker. Infinite Color Engine.',
    preview:     true,
  });

  console.info(
    `%c WESMART INFINITE LIGHT CARD %c v${CARD_VERSION} `,
    'background:#D97757;color:#fff;font-weight:700;padding:2px 6px;border-radius:4px 0 0 4px',
    'background:#1C1917;color:#D97757;font-weight:600;padding:2px 6px;border-radius:0 4px 4px 0'
  );

})();
