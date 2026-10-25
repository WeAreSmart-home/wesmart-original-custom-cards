/**
 * WeSmart Card (All-in-One Modular Suite) - Home Assistant Custom Card
 * Bubble-Card style single file & single card with Visual Editor GUI.
 * Selectable Card Types (card_type):
 *   - 'light'         (alias 'single') : Single light entity card with brightness, Kelvin/CT, and hue RGB slider
 *   - 'lights'        (alias 'list')   : Multi-entity compact light list with master & per-row toggles
 *   - 'lights-expand' (alias 'expand') : Multi-entity light list with animated inline brightness & CT sliders
 *   (Modular registry ready for Climate, Sensors, Doors, Switches, Buttons, etc.)
 * Infinite Color Engine: full palette derived from a single base color (#D97757 default).
 * Version: 1.0.0
 */

(() => {
  'use strict';

  const CARD_VERSION = '1.0.0';

  // ─── Modular Card Type Registry (Extensible for Climate, Sensors, Doors, etc.) ─
  const CARD_TYPES = [
    { id: 'light',         mode: 'single', category: 'Lights', icon: 'mdi:lightbulb-on',         name: 'Light',         sub: '1 Luce · Slider completi' },
    { id: 'lights',        mode: 'list',   category: 'Lights', icon: 'mdi:format-list-bulleted', name: 'Lights',        sub: 'Multi-luce · Toggle rapidi' },
    { id: 'lights-expand', mode: 'expand', category: 'Lights', icon: 'mdi:tune-vertical',        name: 'Lights Expand', sub: 'Multi-luce · Slider inline' },
  ];

  function resolveModeFromType(cardType) {
    if (!cardType) return null;
    const t = String(cardType).toLowerCase().trim();
    if (t === 'light' || t === 'single') return 'single';
    if (t === 'lights' || t === 'list') return 'list';
    if (t === 'lights-expand' || t === 'lights_expand' || t === 'expand') return 'expand';
    return null;
  }

  function modeToCanonicalType(mode) {
    if (mode === 'list') return 'lights';
    if (mode === 'expand') return 'lights-expand';
    return 'light';
  }

  const PRESET_COLORS = [
    { hex: '#D97757', name: 'WeSmart Orange (Default)' },
    { hex: '#60B4D8', name: 'Ocean Blue' },
    { hex: '#7EC8A0', name: 'Sage Green' },
    { hex: '#A78BFA', name: 'Royal Purple' },
    { hex: '#F59E0B', name: 'Warm Amber' },
    { hex: '#EC4899', name: 'Rose Pink' },
    { hex: '#14B8A6', name: 'Teal' },
    { hex: '#A8A29E', name: 'Warm Stone' },
  ];

  // ─── Unified Styles (Single + List + Expand) ──────────────────────────────────

  const styles = `
  :host {
    --radius: 20px;
    --radius-sm: 12px;
    --radius-xs: 8px;
    --transition: all 0.28s cubic-bezier(0.4, 0, 0.2, 1);
    display: block;
    font-family: -apple-system, 'Söhne', 'Inter', BlinkMacSystemFont, sans-serif;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .card {
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 18px 18px 16px;
    position: relative;
    overflow: hidden;
    transition: var(--transition);
    box-shadow: var(--shadow);
    color: var(--text);
  }

  /* ── Single Mode Glow ── */
  .card.mode-single { padding: 20px; }

  .card.mode-single::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse 60% 50% at 50% -10%, var(--accent-soft), transparent);
    opacity: 0;
    transition: opacity 0.5s ease;
    pointer-events: none;
  }

  .card.mode-single.light-on::before { opacity: 1; }

  @keyframes pulse-glow {
    0%, 100% { box-shadow: var(--shadow), 0 0 60px var(--accent-glow); }
    50%       { box-shadow: var(--shadow), 0 0 80px var(--accent-glow-strong); }
  }

  .card.mode-single.light-on {
    border-color: var(--accent-border);
    animation: pulse-glow 3s ease-in-out infinite;
  }

  /* ── Header (Shared & Single) ── */
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 14px;
    position: relative;
    z-index: 1;
  }

  .entity-info, .header-left {
    display: flex;
    align-items: center;
    gap: 12px;
    flex: 1;
    min-width: 0;
  }

  .icon-wrapper, .header-icon-wrap {
    width: 42px;
    height: 42px;
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
  }

  .card.light-on .icon-wrapper,
  .header-icon-wrap.has-active {
    background: var(--accent-soft);
    border-color: var(--accent-border);
    box-shadow: 0 0 16px var(--accent-glow);
  }

  .icon-wrapper ha-icon, .header-icon-wrap ha-icon {
    color: var(--text-dim);
    transition: var(--transition);
    --mdc-icon-size: 20px;
  }

  .card.light-on .icon-wrapper ha-icon,
  .header-icon-wrap.has-active ha-icon {
    color: var(--accent);
  }

  .entity-details, .header-titles { flex: 1; min-width: 0; }

  .entity-name, .header-title {
    font-size: 15px;
    font-weight: 600;
    color: var(--text);
    letter-spacing: -0.01em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .entity-state, .header-subtitle {
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
    box-shadow: 0 0 6px var(--accent);
  }

  /* ── Toggle Switch ── */
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
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
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

  /* ── Single Mode Controls ── */
  .controls-wrapper {
    overflow: hidden;
    max-height: 300px;
    opacity: 1;
    transition: max-height 0.38s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.28s ease;
  }

  .controls-wrapper.collapsed {
    max-height: 0;
    opacity: 0;
    pointer-events: none;
  }

  .controls {
    display: flex;
    flex-direction: column;
    gap: 14px;
    position: relative;
    z-index: 1;
    padding-top: 4px;
  }

  .control-row { display: flex; flex-direction: column; gap: 8px; }

  .control-label {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 11px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--text-dim);
  }

  .control-value {
    font-size: 12px;
    font-weight: 600;
    color: var(--text-muted);
    font-variant-numeric: tabular-nums;
    letter-spacing: 0;
    text-transform: none;
  }

  .slider-wrapper {
    position: relative;
    height: 36px;
    background: var(--surface);
    border-radius: var(--radius-xs);
    overflow: hidden;
    cursor: pointer;
    border: 1px solid var(--border);
    user-select: none;
    touch-action: none;
  }

  .slider-fill {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    background: linear-gradient(90deg, var(--accent-soft), rgba(255,255,255,0.04));
    border-right: 2px solid var(--accent);
    transition: width 0.05s ease;
    pointer-events: none;
  }

  .slider-wrapper.ct-slider .slider-fill {
    background: linear-gradient(90deg, rgba(96, 180, 216, 0.2), rgba(245, 166, 35, 0.25));
    border-right-color: #F5A623;
  }

  .slider-wrapper.hue-slider {
    background: linear-gradient(to right,
      hsl(0, 85%, 55%), hsl(30, 85%, 55%), hsl(60, 85%, 55%),
      hsl(120, 75%, 50%), hsl(180, 80%, 50%), hsl(240, 85%, 60%),
      hsl(300, 80%, 55%), hsl(360, 85%, 55%)
    );
  }

  .slider-thumb {
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: var(--text);
    box-shadow: 0 1px 6px rgba(0,0,0,0.5);
    pointer-events: none;
    transition: transform 0.15s ease;
  }

  .slider-wrapper.hue-slider .slider-thumb { border: 2px solid #fff; }
  .slider-wrapper:active .slider-thumb,
  .slider-wrapper.dragging .slider-thumb { transform: translate(-50%, -50%) scale(1.25); }

  /* ── List & Expand Modes ── */
  .separator { height: 1px; background: var(--border); margin: 0 0 10px; }
  .lights-list { display: flex; flex-direction: column; gap: 2px; }

  .light-item {
    border-radius: var(--radius-xs);
    transition: background 0.2s ease;
    overflow: hidden;
  }

  .light-item.light-on { background: var(--row-active); }
  .light-item.expanded { background: var(--surface); border: 1px solid var(--border); margin: 2px 0; }
  .light-item.expanded.light-on { background: var(--row-active); border-color: var(--accent-border); }
  .light-item.unavailable { opacity: 0.38; pointer-events: none; }

  .light-row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 9px 8px 9px 6px;
    border-radius: var(--radius-xs);
    transition: background 0.2s ease;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }

  .light-row:hover { background: var(--row-hover); }

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

  .light-row.light-on .row-icon,
  .light-item.light-on .row-icon {
    background: var(--accent-soft);
    border-color: var(--accent-border);
  }

  .row-icon ha-icon { --mdc-icon-size: 17px; color: var(--text-dim); transition: color 0.25s ease; }
  .light-row.light-on .row-icon ha-icon,
  .light-item.light-on .row-icon ha-icon { color: var(--accent); }

  .row-info { flex: 1; min-width: 0; }
  .row-name { font-size: 13px; font-weight: 500; color: var(--text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .row-state { font-size: 11px; color: var(--text-dim); margin-top: 1px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .light-row.light-on .row-state,
  .light-item.light-on .row-state { color: var(--accent); opacity: 0.85; }

  .expand-arrow {
    width: 22px;
    height: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    color: var(--text-dim);
    transition: transform 0.28s cubic-bezier(0.4, 0, 0.2, 1), color 0.2s ease;
  }

  .expand-arrow ha-icon { --mdc-icon-size: 16px; }
  .light-item.expanded .expand-arrow { transform: rotate(180deg); color: var(--accent); }

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
  .row-toggle .toggle-thumb { width: 16px; height: 16px; top: 3px; left: 3px; }
  .row-toggle.active .toggle-thumb { left: 21px; }

  /* ── Expand Panel Inline Sliders ── */
  .expand-panel {
    max-height: 0;
    overflow: hidden;
    opacity: 0;
    transition: max-height 0.32s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.22s ease, padding 0.28s ease;
    padding: 0 10px;
  }

  .light-item.expanded .expand-panel {
    max-height: 200px;
    opacity: 1;
    padding: 6px 10px 12px;
  }

  .panel-divider { height: 1px; background: var(--border); margin-bottom: 12px; }
  .off-hint { font-size: 11px; color: var(--text-dim); text-align: center; padding: 6px 0 2px; }

  .slider-section { display: flex; flex-direction: column; gap: 10px; }
  .exp-slider-row { display: flex; align-items: center; gap: 10px; }
  .slider-icon { width: 20px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; color: var(--text-dim); }
  .slider-icon ha-icon { --mdc-icon-size: 15px; }

  .slider-track-wrap {
    flex: 1;
    height: 20px;
    display: flex;
    align-items: center;
    cursor: pointer;
    position: relative;
    user-select: none;
    -webkit-user-select: none;
    touch-action: none;
  }

  .slider-track { width: 100%; height: 5px; border-radius: 3px; background: var(--track-off); position: relative; overflow: visible; }
  .brightness-track .exp-fill { height: 100%; border-radius: 3px; background: var(--accent); pointer-events: none; }
  .colortemp-track { background: linear-gradient(to right, #E8874A 0%, #F5C890 45%, #FFF4E8 68%, #C8E2FF 100%); }
  .colortemp-track .exp-fill { display: none; }

  .exp-thumb {
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background: #fff;
    border: 2.5px solid var(--accent);
    box-shadow: 0 1px 5px rgba(0,0,0,0.4);
    pointer-events: none;
  }

  .colortemp-track .exp-thumb { border-color: rgba(255,255,255,0.9); box-shadow: 0 1px 6px rgba(0,0,0,0.55); }
  .slider-val { font-size: 11px; font-weight: 500; color: var(--text-muted); min-width: 38px; text-align: right; flex-shrink: 0; font-variant-numeric: tabular-nums; }

  /* ── Footer & Overlay ── */
  .footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid var(--border);
    position: relative;
    z-index: 1;
  }

  .footer-info { font-size: 11px; color: var(--text-dim); display: flex; align-items: center; gap: 4px; }
  .footer-info ha-icon { --mdc-icon-size: 13px; }
  .brand-mark { display: flex; align-items: center; gap: 5px; opacity: 0.4; }
  .brand-mark svg { width: 14px; height: 14px; }
  .brand-mark span { font-size: 10px; color: var(--text-dim); letter-spacing: 0.05em; font-weight: 700; }

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

  .unavailable-overlay span { font-size: 13px; color: var(--text-muted); font-weight: 500; }
  .unavailable-overlay ha-icon { color: var(--text-dim); --mdc-icon-size: 28px; }
  `;

  // ─── Unified All-in-One Custom Element (WeSmartCard) ─────────────────────────

  class WeSmartCard extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this._config     = {};
      this._hass       = null;
      this._entities   = [];
      this._expanded   = null;
      this._dragging   = null;
      this._isDraggingBrightness = false;
      this._isDraggingCT         = false;
      this._isDraggingHue        = false;
      this._palette    = null;
      this._mqHandler  = null;
      this._forcedMode = null; // Used by legacy tag aliases
    }

    static getConfigElement() {
      return document.createElement('wesmart-card-editor');
    }

    static getStubConfig(hass, entities) {
      const allEntities = entities || Object.keys(hass?.states || {});
      const firstLight = allEntities.find(e => e.startsWith('light.')) || 'light.example';
      return {
        card_type:           'light',
        entity:              firstLight,
        color:               '#D97757',
        theme:               'dark',
        show_brightness:     true,
        show_color_temp:     true,
        show_color:          true,
        collapse_when_off:   false,
        dynamic_light_color: false,
        show_footer:         true,
      };
    }

    get _mode() {
      const resolved = resolveModeFromType(this._config.card_type);
      if (resolved) return resolved;
      if (this._forcedMode) return this._forcedMode;
      if (Array.isArray(this._config.entities) && this._config.entities.length > 0 && !this._config.entity) {
        return 'list';
      }
      return 'single';
    }

    setConfig(config) {
      if (!config) throw new Error('Invalid configuration');
      this._config = {
        entity:              '',
        name:                null,
        title:               'Lights',
        icon:                null,
        color:               '#D97757',
        theme:               'dark',
        show_brightness:     true,
        show_color_temp:     true,
        show_color:          true,
        collapse_when_off:   false,
        dynamic_light_color: false,
        show_footer:         true,
        entities:            [],
        ...config,
      };
      const rawEntities = Array.isArray(this._config.entities) ? this._config.entities : [];
      this._entities = rawEntities.map(e => typeof e === 'string' ? { entity: e } : e).filter(e => e && e.entity);
      this._applyPalette();
      this._render();
    }

    set hass(hass) {
      this._hass = hass;
      this._updateState();
    }

    getCardSize() {
      return this._mode === 'single' ? 3 : 1 + Math.ceil((this._entities.length * 52 + 100) / 50);
    }

    disconnectedCallback() {
      if (this._mqHandler) {
        window.matchMedia('(prefers-color-scheme: light)').removeEventListener('change', this._mqHandler);
        this._mqHandler = null;
      }
    }

    // ── InfiniteColor Engine ────────────────────────────────────────────────────

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
          accent:           this._hsl(h, s, aL),
          accentSoft:       this._hsla(h, s, aL, 0.12),
          accentGlow:       this._hsla(h, s, aL, 0.25),
          accentGlowStrong: this._hsla(h, s, aL, 0.40),
          accentBorder:     this._hsla(h, s, aL, 0.30),
          bg:               this._hsl(h, c(Math.round(s * 0.35), 25, 45), 11),
          surface:          this._hsl(h, c(Math.round(s * 0.28), 20, 38), 16),
          border:           'hsla(0,0%,100%,0.08)',
          text:             this._hsl(h, c(Math.round(s * 0.08), 5, 10), 93),
          textMuted:        this._hsl(h, c(Math.round(s * 0.12), 8, 15), 65),
          textDim:          this._hsl(h, c(Math.round(s * 0.10), 6, 12), 42),
          trackOff:         this._hsl(h, c(Math.round(s * 0.28), 20, 38), 16),
          thumbOff:         this._hsl(h, c(Math.round(s * 0.10), 6, 12), 42),
          rowHover:         'hsla(0,0%,100%,0.03)',
          rowActive:        this._hsla(h, s, aL, 0.07),
          overlayBg:        this._hsla(h, c(Math.round(s * 0.20), 15, 25), 9, 0.75),
          shadow:           `0 8px 32px ${this._hsla(h, s, 5, 0.45)}`,
        };
      } else {
        const aL = c(l, 35, 52);
        return {
          accent:           this._hsl(h, s, aL),
          accentSoft:       this._hsla(h, s, aL, 0.10),
          accentGlow:       this._hsla(h, s, aL, 0.20),
          accentGlowStrong: this._hsla(h, s, aL, 0.30),
          accentBorder:     this._hsla(h, s, aL, 0.25),
          bg:               this._hsl(h, c(Math.round(s * 0.06), 4, 8), 99),
          surface:          this._hsl(h, c(Math.round(s * 0.10), 6, 12), 95),
          border:           `hsla(${h},${s}%,${aL}%,0.12)`,
          text:             this._hsl(h, c(Math.round(s * 0.15), 10, 20), 12),
          textMuted:        this._hsl(h, c(Math.round(s * 0.12), 8, 15), 42),
          textDim:          this._hsl(h, c(Math.round(s * 0.10), 6, 12), 62),
          trackOff:         this._hsl(h, c(Math.round(s * 0.10), 6, 12), 88),
          thumbOff:         this._hsl(h, c(Math.round(s * 0.15), 10, 20), 72),
          rowHover:         this._hsla(h, c(Math.round(s * 0.15), 10, 20), 25, 0.03),
          rowActive:        this._hsla(h, s, aL, 0.06),
          overlayBg:        this._hsla(h, c(Math.round(s * 0.10), 6, 12), 95, 0.82),
          shadow:           `0 2px 16px ${this._hsla(h, s, 5, 0.10)}, 0 0 0 1px ${this._hsla(h, s, 5, 0.06)}`,
        };
      }
    }

    _applyPalette(overrideAccentHex = null) {
      const isDark = this._config.theme === 'auto'
        ? !window.matchMedia('(prefers-color-scheme: light)').matches
        : this._config.theme !== 'light';
      const baseColor = /^#[0-9A-Fa-f]{6}$/.test(this._config.color) ? this._config.color : '#D97757';
      this._palette = this._buildPalette(baseColor, isDark);
      const p = this._palette;
      const s = this.style;

      const act = (overrideAccentHex && /^#[0-9A-Fa-f]{6}$/.test(overrideAccentHex))
        ? this._buildPalette(overrideAccentHex, isDark)
        : p;

      s.setProperty('--accent',             act.accent);
      s.setProperty('--accent-soft',        act.accentSoft);
      s.setProperty('--accent-glow',        act.accentGlow);
      s.setProperty('--accent-glow-strong', act.accentGlowStrong);
      s.setProperty('--accent-border',      act.accentBorder);
      s.setProperty('--bg',                 p.bg);
      s.setProperty('--surface',            p.surface);
      s.setProperty('--border',             p.border);
      s.setProperty('--text',               p.text);
      s.setProperty('--text-muted',         p.textMuted);
      s.setProperty('--text-dim',           p.textDim);
      s.setProperty('--track-off',          p.trackOff);
      s.setProperty('--thumb-off',          p.thumbOff);
      s.setProperty('--row-hover',          p.rowHover);
      s.setProperty('--row-active',         p.rowActive);
      s.setProperty('--overlay-bg',         p.overlayBg);
      s.setProperty('--shadow',             p.shadow);

      if (this._config.theme === 'auto' && !this._mqHandler) {
        this._mqHandler = () => this._applyPalette();
        window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', this._mqHandler);
      }
    }

    _rgbToHex(r, g, b) {
      const toHex = (n) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0');
      return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    }

    _brandSVG() {
      const fill = this._palette?.accent ?? '#D97757';
      return `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.3 2.45a.74.74 0 0 0-1.38 0l-1.18 3.27H11.3L10.1 2.45a.74.74 0 0 0-1.38 0L7.3 6.37 4.1 7.56a.74.74 0 0 0 0 1.38l3.2 1.19.82 2.28-3.26 1.18a.74.74 0 0 0 0 1.38l3.26 1.18L9.3 19.2l-2.1.76a.74.74 0 0 0 0 1.38l3.26 1.18.45 1.24a.74.74 0 0 0 1.38 0l.45-1.24 3.26-1.18a.74.74 0 0 0 0-1.38l-2.1-.76 1.18-3.27 3.26-1.18a.74.74 0 0 0 0-1.38l-3.26-1.18.82-2.28 3.2-1.19a.74.74 0 0 0 0-1.38l-3.2-1.19-1.37-3.92z" fill="${fill}"/>
      </svg>`;
    }

    // ── Render Dispatcher ───────────────────────────────────────────────────────

    _render() {
      const shadow = this.shadowRoot;
      shadow.innerHTML = '';

      const style = document.createElement('style');
      style.textContent = styles;
      shadow.appendChild(style);

      const mode = this._mode;
      this._card = document.createElement('div');
      this._card.className = `card mode-${mode}`;

      if (mode === 'single') {
        this._card.innerHTML = this._getSingleHTML();
        shadow.appendChild(this._card);
        this._bindSingleEvents();
      } else if (mode === 'list') {
        this._card.innerHTML = this._getListHTML();
        shadow.appendChild(this._card);
        this._bindListEvents();
      } else {
        this._card.innerHTML = this._getExpandHTML();
        shadow.appendChild(this._card);
        this._bindExpandEvents();
      }

      this._updateState();
    }

    // ── 1. SINGLE MODE HTML & LOGIC ─────────────────────────────────────────────

    _getSingleHTML() {
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

      <div class="footer" style="${this._config.show_footer === false ? 'display:none' : ''}">
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

    _updateSingleState() {
      if (!this._config.entity) {
        this._q('#entity-name').textContent = 'Seleziona entità luce';
        this._q('#state-text').textContent  = 'Configura dalla finestra editor';
        this._q('#entity-icon').setAttribute('icon', 'mdi:lightbulb-question-outline');
        this._q('#controls-wrapper')?.classList.add('collapsed');
        return;
      }
      if (!this._hass) return;

      const stateObj = this._hass.states[this._config.entity];
      if (!stateObj) {
        this._q('#entity-name').textContent = this._config.name || this._config.entity;
        this._q('#state-text').textContent  = 'Entità non trovata';
        return;
      }

      const isOn      = stateObj.state === 'on';
      const isUnavail = stateObj.state === 'unavailable';
      const attrs     = stateObj.attributes || {};
      const name      = this._config.name || attrs.friendly_name || this._config.entity;

      if (this._config.dynamic_light_color && isOn && Array.isArray(attrs.rgb_color) && attrs.rgb_color.length === 3) {
        this._applyPalette(this._rgbToHex(...attrs.rgb_color));
      } else {
        this._applyPalette(null);
      }

      this._card.classList.toggle('light-on', isOn && !isUnavail);
      this._q('#unavailable-overlay').style.display = isUnavail ? 'flex' : 'none';

      const customIcon = this._config.icon || attrs.icon;
      this._q('#entity-icon').setAttribute('icon', customIcon || (isOn ? 'mdi:lightbulb' : 'mdi:lightbulb-outline'));
      this._q('#entity-name').textContent = name;

      const stateLabel = isOn
        ? (attrs.brightness ? `${Math.round(attrs.brightness / 2.55)}% · On` : 'On')
        : (stateObj.state.charAt(0).toUpperCase() + stateObj.state.slice(1));
      this._q('#state-text').textContent = stateLabel;

      this._q('#toggle').classList.toggle('active', isOn);
      this._q('#toggle-input').checked = isOn;

      const wrapper = this._q('#controls-wrapper');
      if (wrapper) {
        wrapper.classList.toggle('collapsed', Boolean(this._config.collapse_when_off && !isOn));
      }

      if (!this._config.collapse_when_off) {
        this._q('#controls').style.opacity       = isOn ? '1' : '0.4';
        this._q('#controls').style.pointerEvents = isOn ? 'auto' : 'none';
      } else {
        this._q('#controls').style.opacity       = '1';
        this._q('#controls').style.pointerEvents = 'auto';
      }

      const colorModes = attrs.supported_color_modes ?? [];
      const supportsBrightness = colorModes.some(m => ['brightness','color_temp','hs','rgb','rgbw','rgbww','xy'].includes(m));
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

      const minK = attrs.min_color_temp_kelvin ?? (attrs.max_mireds ? Math.round(1000000 / attrs.max_mireds) : null);
      const maxK = attrs.max_color_temp_kelvin ?? (attrs.min_mireds ? Math.round(1000000 / attrs.min_mireds) : null);
      const hasKRange = minK != null && maxK != null;
      const supportsColorTemp = colorModes.includes('color_temp') || hasKRange || attrs.color_temp_kelvin != null || attrs.color_temp != null;
      const ctRow = this._q('#ct-row');
      if (this._config.show_color_temp && supportsColorTemp && hasKRange) {
        ctRow.style.display = 'flex';
        if (!this._isDraggingCT) {
          const curK = attrs.color_temp_kelvin ?? (attrs.color_temp ? Math.round(1000000 / attrs.color_temp) : null) ?? Math.round((minK + maxK) / 2);
          const pct = Math.round(((curK - minK) / (maxK - minK)) * 100);
          this._q('#ct-value').textContent = `${curK} K`;
          this._setSliderPct('#ct-fill', '#ct-thumb', Math.max(0, Math.min(100, pct)));
          this._ctMinK = minK;
          this._ctMaxK = maxK;
        }
      } else {
        ctRow.style.display = 'none';
      }

      const supportsColor = colorModes.some(m => ['hs','rgb','rgbw','rgbww','xy'].includes(m));
      const colorRow = this._q('#color-row');
      if (this._config.show_color && supportsColor) {
        colorRow.style.display = 'flex';
        if (!this._isDraggingHue) {
          let hue = 0;
          if (attrs.hs_color) hue = attrs.hs_color[0];
          else if (attrs.rgb_color) hue = this._rgbToHue(...attrs.rgb_color);
          this._setHueThumb(hue);
        }
      } else {
        colorRow.style.display = 'none';
      }

      const parts = this._config.entity.split('.');
      this._q('#footer-text').textContent = parts[1]?.replace(/_/g, ' ') || '—';
    }

    _bindSingleEvents() {
      this._q('#toggle')?.addEventListener('click', () => this._toggleSingle());
      this._q('#icon-btn')?.addEventListener('click', () => this._toggleSingle());

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

    // ── 2. LIST MODE HTML & LOGIC ───────────────────────────────────────────────

    _getListHTML() {
      const cfg = this._config;
      const n   = this._entities.length;
      const hdrIcon = cfg.icon || 'mdi:lightbulb-group';

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
        <div class="header">
          <div class="header-left">
            <div class="header-icon-wrap" id="header-icon-wrap">
              <ha-icon icon="${hdrIcon}"></ha-icon>
            </div>
            <div class="header-titles">
              <div class="header-title">${cfg.title || 'Lights'}</div>
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
        <div class="lights-list" id="lights-list">${rowsHTML}</div>
        <div class="footer" style="${cfg.show_footer === false ? 'display:none' : ''}">
          <div class="footer-info">
            <ha-icon icon="mdi:lightbulb-multiple-outline"></ha-icon>
            <span>${n} light${n !== 1 ? 's' : ''}</span>
          </div>
          <div class="brand-mark">${this._brandSVG()}<span>WeSmart</span></div>
        </div>
      `;
    }

    _updateListState() {
      if (!this._hass) return;
      let onCount = 0, validCount = 0;

      this._entities.forEach((cfg, i) => {
        const stateObj = this._hass.states[cfg.entity];
        if (!stateObj) return;
        validCount++;
        const attrs     = stateObj.attributes || {};
        const isOn      = stateObj.state === 'on';
        const isUnavail = stateObj.state === 'unavailable';
        if (isOn) onCount++;

        const name = cfg.name || attrs.friendly_name || cfg.entity.split('.')[1]?.replace(/_/g, ' ') || cfg.entity;
        const icon = cfg.icon || attrs.icon || (isOn ? 'mdi:lightbulb' : 'mdi:lightbulb-outline');

        let stateText = 'Off';
        if (isUnavail) stateText = 'Unavailable';
        else if (isOn) {
          const parts = [];
          if (attrs.brightness != null) parts.push(`${Math.round(attrs.brightness / 2.55)}%`);
          if (attrs.color_temp != null) parts.push(`${Math.round(1000000 / attrs.color_temp)}K`);
          stateText = parts.length ? parts.join(' · ') : 'On';
        }

        const row    = this._q(`#row-${i}`);
        const toggle = this._q(`#toggle-${i}`);
        const input  = this._q(`#input-${i}`);

        if (row) { row.classList.toggle('light-on', isOn && !isUnavail); row.classList.toggle('unavailable', isUnavail); }
        this._q(`#icon-${i}`)?.setAttribute('icon', icon);
        const nameEl = this._q(`#name-${i}`); if (nameEl) nameEl.textContent = name;
        const stateEl = this._q(`#state-${i}`); if (stateEl) stateEl.textContent = stateText;
        if (toggle) toggle.classList.toggle('active', isOn);
        if (input)  input.checked = isOn;
      });

      const subtitle = this._q('#header-subtitle');
      if (subtitle) subtitle.textContent = onCount === 0 ? 'All off' : onCount === validCount ? 'All on' : `${onCount} of ${validCount} on`;

      this._q('#header-icon-wrap')?.classList.toggle('has-active', onCount > 0);
      this._q('#master-toggle')?.classList.toggle('active', onCount > 0);
      const masterInput = this._q('#master-input');
      if (masterInput) masterInput.checked = onCount > 0;
    }

    _bindListEvents() {
      this._q('#master-toggle')?.addEventListener('click', () => {
        if (!this._hass) return;
        const anyOn = this._entities.some(cfg => this._hass.states[cfg.entity]?.state === 'on');
        const action = anyOn ? 'turn_off' : 'turn_on';
        this._entities.forEach(cfg => this._hass.callService('light', action, { entity_id: cfg.entity }));
      });

      this._entities.forEach((cfg, i) => {
        this._q(`#toggle-${i}`)?.addEventListener('click', (e) => {
          e.stopPropagation();
          if (!this._hass) return;
          const stateObj = this._hass.states[cfg.entity];
          if (!stateObj || stateObj.state === 'unavailable') return;
          this._hass.callService('light', stateObj.state === 'on' ? 'turn_off' : 'turn_on', { entity_id: cfg.entity });
        });
      });

      this._q('#lights-list')?.addEventListener('click', (e) => {
        if (e.target.closest('.row-toggle')) return;
        const row = e.target.closest('.light-row');
        if (!row) return;
        const idx = parseInt(row.dataset.index, 10);
        const entityId = this._entities[idx]?.entity;
        if (!entityId) return;
        const event = new Event('hass-more-info', { bubbles: true, composed: true });
        event.detail = { entityId };
        this.dispatchEvent(event);
      });
    }

    // ── 3. EXPAND MODE HTML & LOGIC ─────────────────────────────────────────────

    _getExpandHTML() {
      const cfg = this._config;
      const n   = this._entities.length;
      const hdrIcon = cfg.icon || 'mdi:lightbulb-group';

      const rowsHTML = this._entities.map((e, i) => `
        <div class="light-item" data-index="${i}" id="item-${i}">
          <div class="light-row" id="row-${i}">
            <div class="row-icon" id="icon-wrap-${i}">
              <ha-icon id="icon-${i}" icon="mdi:lightbulb-outline"></ha-icon>
            </div>
            <div class="row-info">
              <div class="row-name" id="name-${i}">${e.name || e.entity}</div>
              <div class="row-state" id="state-${i}">—</div>
            </div>
            <div class="expand-arrow"><ha-icon icon="mdi:chevron-down"></ha-icon></div>
            <label class="row-toggle" id="toggle-${i}">
              <input type="checkbox" id="input-${i}">
              <div class="toggle-track"></div>
              <div class="toggle-thumb"></div>
            </label>
          </div>
          <div class="expand-panel" id="panel-${i}">
            <div class="panel-divider"></div>
            <div class="off-hint" id="off-hint-${i}" style="display:none">Turn on to adjust controls</div>
            <div class="slider-section" id="sliders-${i}">
              <div class="exp-slider-row" id="bri-row-${i}">
                <div class="slider-icon"><ha-icon icon="mdi:brightness-6"></ha-icon></div>
                <div class="slider-track-wrap" id="bri-wrap-${i}" data-index="${i}" data-type="brightness">
                  <div class="slider-track brightness-track">
                    <div class="exp-fill" id="bri-fill-${i}" style="width:0%"></div>
                    <div class="exp-thumb" id="bri-thumb-${i}" style="left:0%"></div>
                  </div>
                </div>
                <div class="slider-val" id="bri-val-${i}">—</div>
              </div>
              <div class="exp-slider-row" id="ct-row-${i}" style="display:none">
                <div class="slider-icon"><ha-icon icon="mdi:thermometer"></ha-icon></div>
                <div class="slider-track-wrap" id="ct-wrap-${i}" data-index="${i}" data-type="colortemp">
                  <div class="slider-track colortemp-track">
                    <div class="exp-fill"></div>
                    <div class="exp-thumb" id="ct-thumb-${i}" style="left:50%"></div>
                  </div>
                </div>
                <div class="slider-val" id="ct-val-${i}">—</div>
              </div>
            </div>
          </div>
        </div>
      `).join('');

      return `
        <div class="header">
          <div class="header-left">
            <div class="header-icon-wrap" id="header-icon-wrap">
              <ha-icon icon="${hdrIcon}"></ha-icon>
            </div>
            <div class="header-titles">
              <div class="header-title">${cfg.title || 'Lights'}</div>
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
        <div class="lights-list" id="lights-list">${rowsHTML}</div>
        <div class="footer" style="${cfg.show_footer === false ? 'display:none' : ''}">
          <div class="footer-info">
            <ha-icon icon="mdi:lightbulb-multiple-outline"></ha-icon>
            <span>${n} light${n !== 1 ? 's' : ''}</span>
          </div>
          <div class="brand-mark">${this._brandSVG()}<span>WeSmart</span></div>
        </div>
      `;
    }

    _supportsCT(attrs) {
      const modes = attrs.supported_color_modes || [];
      if (modes.includes('color_temp')) return true;
      return ((attrs.supported_features || 0) & 2) !== 0 && attrs.min_mireds != null;
    }

    _updateExpandState() {
      if (!this._hass) return;
      let onCount = 0, validCount = 0;

      this._entities.forEach((cfg, i) => {
        const stateObj = this._hass.states[cfg.entity];
        if (!stateObj) return;
        validCount++;
        const attrs     = stateObj.attributes || {};
        const isOn      = stateObj.state === 'on';
        const isUnavail = stateObj.state === 'unavailable';
        if (isOn) onCount++;

        const name = cfg.name || attrs.friendly_name || cfg.entity.split('.')[1]?.replace(/_/g, ' ') || cfg.entity;
        const icon = cfg.icon || attrs.icon || (isOn ? 'mdi:lightbulb' : 'mdi:lightbulb-outline');

        let stateText = 'Off';
        if (isUnavail) stateText = 'Unavailable';
        else if (isOn) {
          const parts = [];
          if (attrs.brightness != null) parts.push(`${Math.round(attrs.brightness / 2.55)}%`);
          if (attrs.color_temp != null) parts.push(`${Math.round(1000000 / attrs.color_temp)}K`);
          stateText = parts.length ? parts.join(' · ') : 'On';
        }

        const item    = this._q(`#item-${i}`);
        const toggle  = this._q(`#toggle-${i}`);
        const input   = this._q(`#input-${i}`);
        const offHint = this._q(`#off-hint-${i}`);
        const sliders = this._q(`#sliders-${i}`);
        const ctRow   = this._q(`#ct-row-${i}`);

        if (item) { item.classList.toggle('light-on', isOn && !isUnavail); item.classList.toggle('unavailable', isUnavail); }
        this._q(`#icon-${i}`)?.setAttribute('icon', icon);
        const nameEl  = this._q(`#name-${i}`);  if (nameEl)  nameEl.textContent  = name;
        const stateEl = this._q(`#state-${i}`); if (stateEl) stateEl.textContent = stateText;
        if (toggle) toggle.classList.toggle('active', isOn);
        if (input)  input.checked = isOn;

        if (offHint && sliders) {
          offHint.style.display = isOn ? 'none' : 'block';
          sliders.style.display = isOn ? 'flex' : 'none';
        }

        const isDraggingBri = this._dragging?.idx === i && this._dragging?.type === 'brightness';
        if (isOn && !isDraggingBri) {
          const briPct = attrs.brightness != null ? Math.round(attrs.brightness / 2.55) : 100;
          const fill   = this._q(`#bri-fill-${i}`);
          const thumb  = this._q(`#bri-thumb-${i}`);
          const val    = this._q(`#bri-val-${i}`);
          if (fill)  fill.style.width = `${briPct}%`;
          if (thumb) thumb.style.left  = `${briPct}%`;
          if (val)   val.textContent  = `${briPct}%`;
        }

        const hasCT = this._supportsCT(attrs);
        if (ctRow) ctRow.style.display = hasCT ? 'flex' : 'none';

        const isDraggingCT = this._dragging?.idx === i && this._dragging?.type === 'colortemp';
        if (isOn && hasCT && !isDraggingCT && attrs.color_temp != null) {
          const minM    = attrs.min_mireds || 153;
          const maxM    = attrs.max_mireds || 500;
          const ctPct   = ((maxM - attrs.color_temp) / (maxM - minM)) * 100;
          const clamped = this._clamp(ctPct, 0, 100);
          const thumb   = this._q(`#ct-thumb-${i}`);
          const val     = this._q(`#ct-val-${i}`);
          if (thumb) thumb.style.left = `${clamped}%`;
          if (val)   val.textContent  = `${Math.round(1000000 / attrs.color_temp)}K`;
        }
      });

      const subtitle = this._q('#header-subtitle');
      if (subtitle) subtitle.textContent = onCount === 0 ? 'All off' : onCount === validCount ? 'All on' : `${onCount} of ${validCount} on`;

      this._q('#header-icon-wrap')?.classList.toggle('has-active', onCount > 0);
      this._q('#master-toggle')?.classList.toggle('active', onCount > 0);
      const masterInput = this._q('#master-input');
      if (masterInput) masterInput.checked = onCount > 0;
    }

    _bindExpandEvents() {
      this._q('#master-toggle')?.addEventListener('click', () => {
        if (!this._hass) return;
        const anyOn  = this._entities.some(cfg => this._hass.states[cfg.entity]?.state === 'on');
        const action = anyOn ? 'turn_off' : 'turn_on';
        this._entities.forEach(cfg => this._hass.callService('light', action, { entity_id: cfg.entity }));
      });

      this._entities.forEach((cfg, i) => {
        this._q(`#toggle-${i}`)?.addEventListener('click', (e) => {
          e.stopPropagation();
          if (!this._hass) return;
          const stateObj = this._hass.states[cfg.entity];
          if (!stateObj || stateObj.state === 'unavailable') return;
          this._hass.callService('light', stateObj.state === 'on' ? 'turn_off' : 'turn_on', { entity_id: cfg.entity });
        });

        this._q(`#row-${i}`)?.addEventListener('click', (e) => {
          if (e.target.closest('.row-toggle')) return;
          this._toggleExpandItem(i);
        });

        this._bindInlineSlider(this._q(`#bri-wrap-${i}`), i, 'brightness');
        this._bindInlineSlider(this._q(`#ct-wrap-${i}`),  i, 'colortemp');
      });
    }

    _toggleExpandItem(idx) {
      const prev = this._expanded;
      if (prev !== null && prev !== idx) {
        this._q(`#item-${prev}`)?.classList.remove('expanded');
      }
      const item = this._q(`#item-${idx}`);
      if (!item) return;
      const opening  = this._expanded !== idx;
      item.classList.toggle('expanded', opening);
      this._expanded = opening ? idx : null;
    }

    _bindInlineSlider(wrap, idx, type) {
      if (!wrap) return;
      wrap.addEventListener('pointerdown', (e) => {
        e.stopPropagation();
        e.preventDefault();
        wrap.setPointerCapture(e.pointerId);
        this._dragging = { idx, type, wrap, value: null };
        this._processInlineSliderMove(e);

        const onMove = (ev) => this._processInlineSliderMove(ev);
        const onUp   = (ev) => {
          this._processInlineSliderMove(ev);
          this._commitInlineSlider();
          this._dragging = null;
          wrap.removeEventListener('pointermove',   onMove);
          wrap.removeEventListener('pointerup',     onUp);
          wrap.removeEventListener('pointercancel', onUp);
        };
        wrap.addEventListener('pointermove',   onMove);
        wrap.addEventListener('pointerup',     onUp);
        wrap.addEventListener('pointercancel', onUp);
      });
    }

    _processInlineSliderMove(e) {
      if (!this._dragging) return;
      const { idx, type, wrap } = this._dragging;
      const rect = wrap.getBoundingClientRect();
      const pct  = this._clamp(((e.clientX - rect.left) / rect.width) * 100, 0, 100);

      if (type === 'brightness') {
        const fill  = this._q(`#bri-fill-${idx}`);
        const thumb = this._q(`#bri-thumb-${idx}`);
        const val   = this._q(`#bri-val-${idx}`);
        const disp  = Math.max(1, Math.round(pct));
        if (fill)  fill.style.width = `${pct}%`;
        if (thumb) thumb.style.left  = `${pct}%`;
        if (val)   val.textContent  = `${disp}%`;
        this._dragging.value = Math.max(1, Math.round((pct / 100) * 255));
      } else {
        const stateObj = this._hass?.states[this._entities[idx]?.entity];
        const attrs    = stateObj?.attributes || {};
        const minM     = attrs.min_mireds || 153;
        const maxM     = attrs.max_mireds || 500;
        const mireds   = Math.round(maxM - (pct / 100) * (maxM - minM));
        const kelvin   = Math.round(1000000 / mireds);
        const thumb    = this._q(`#ct-thumb-${idx}`);
        const val      = this._q(`#ct-val-${idx}`);
        if (thumb) thumb.style.left = `${pct}%`;
        if (val)   val.textContent  = `${kelvin}K`;
        this._dragging.value = mireds;
      }
    }

    _commitInlineSlider() {
      if (!this._dragging || !this._hass) return;
      const { idx, type, value } = this._dragging;
      const entityId = this._entities[idx]?.entity;
      if (!entityId || value == null) return;
      const params = { entity_id: entityId };
      if (type === 'brightness') params.brightness = value;
      else                       params.color_temp  = value;
      this._hass.callService('light', 'turn_on', params);
    }

    // ── Shared State Update & Helpers ───────────────────────────────────────────

    _updateState() {
      if (!this._card) return;
      const mode = this._mode;
      if (mode === 'single')      this._updateSingleState();
      else if (mode === 'list')   this._updateListState();
      else                        this._updateExpandState();
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

    _setSliderPct(fillSel, thumbSel, pct) {
      const fill  = typeof fillSel  === 'string' ? this._q(fillSel)  : fillSel;
      const thumb = typeof thumbSel === 'string' ? this._q(thumbSel) : thumbSel;
      if (fill)  fill.style.width = `${pct}%`;
      if (thumb) thumb.style.left = `${pct}%`;
    }

    _q(selector) { return this._card?.querySelector(selector) ?? null; }

    _toggleSingle() {
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
      const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
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

  // ─── 3-in-1 Visual Editor (Bubble Card Style) ────────────────────────────────

  const editorStyles = `
    :host {
      display: block;
      font-family: -apple-system, 'Söhne', 'Inter', BlinkMacSystemFont, sans-serif;
      color: var(--primary-text-color, #F5F0EB);
    }
    * { box-sizing: border-box; }
    .editor-container { display: flex; flex-direction: column; gap: 12px; padding: 4px 0 16px; }
    .editor-banner {
      display: flex; align-items: center; justify-content: space-between;
      padding: 12px 16px; border-radius: 14px;
      background: linear-gradient(135deg, rgba(217, 119, 87, 0.16), rgba(217, 119, 87, 0.04));
      border: 1px solid rgba(217, 119, 87, 0.28);
    }
    .banner-title { display: flex; align-items: center; gap: 10px; font-weight: 600; font-size: 14px; }
    .banner-badge { font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 20px; background: #D97757; color: #fff; }

    /* ── Card Type Selector (Bubble Card Style) ── */
    .type-selector-box {
      padding: 14px;
      border-radius: 14px;
      border: 1px solid rgba(217, 119, 87, 0.35);
      background: var(--card-background-color, rgba(41, 37, 36, 0.6));
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .type-cards-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
    }
    .type-card-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 12px 8px;
      border-radius: 12px;
      border: 1.5px solid var(--divider-color, rgba(255, 255, 255, 0.12));
      background: rgba(0, 0, 0, 0.15);
      color: var(--primary-text-color, #F5F0EB);
      cursor: pointer;
      transition: all 0.2s ease;
      text-align: center;
    }
    .type-card-btn:hover {
      border-color: rgba(217, 119, 87, 0.6);
      transform: translateY(-1px);
    }
    .type-card-btn.active {
      background: rgba(217, 119, 87, 0.18);
      border-color: #D97757;
      box-shadow: 0 0 16px rgba(217, 119, 87, 0.22);
    }
    .type-card-btn ha-icon {
      color: var(--secondary-text-color, #A09080);
      --mdc-icon-size: 22px;
    }
    .type-card-btn.active ha-icon {
      color: #D97757;
    }
    .type-card-name {
      font-size: 12.5px;
      font-weight: 700;
      color: var(--primary-text-color, #F5F0EB);
    }
    .type-card-btn.active .type-card-name {
      color: #D97757;
    }
    .type-card-sub {
      font-size: 10.5px;
      color: var(--secondary-text-color, #A09080);
      line-height: 1.2;
    }

    /* ── Accordion Sections ── */
    .section {
      border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.1));
      border-radius: 14px; overflow: hidden;
      background: var(--card-background-color, rgba(41, 37, 36, 0.5));
    }
    .section.open { border-color: rgba(217, 119, 87, 0.35); }
    .section-header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 13px 16px; cursor: pointer; user-select: none; font-weight: 600; font-size: 14px;
      background: rgba(255, 255, 255, 0.02);
    }
    .section-title { display: flex; align-items: center; gap: 10px; }
    .section-title ha-icon { color: #D97757; --mdc-icon-size: 20px; }
    .chevron { transition: transform 0.25s ease; color: var(--secondary-text-color, #A09080); --mdc-icon-size: 20px; }
    .section.open .chevron { transform: rotate(180deg); }
    .section-body {
      display: none; padding: 16px;
      border-top: 1px solid var(--divider-color, rgba(255, 255, 255, 0.08));
      flex-direction: column; gap: 16px;
    }
    .section.open .section-body { display: flex; }
    .field-label {
      font-size: 11.5px; font-weight: 700; text-transform: uppercase;
      letter-spacing: 0.06em; color: var(--secondary-text-color, #A09080); margin-bottom: 6px;
    }
    .theme-pills { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
    .theme-pill {
      display: flex; align-items: center; justify-content: center; gap: 6px;
      padding: 10px 12px; border-radius: 10px;
      border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.12));
      background: transparent; color: var(--primary-text-color, #F5F0EB);
      font-size: 13px; font-weight: 500; cursor: pointer;
    }
    .theme-pill.active { background: rgba(217, 119, 87, 0.18); border-color: #D97757; color: #D97757; font-weight: 600; }
    .swatches-grid { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; }
    .swatch-btn {
      width: 32px; height: 32px; border-radius: 50%; border: 2px solid transparent;
      cursor: pointer; transition: transform 0.2s ease; padding: 0;
    }
    .swatch-btn.active { border-color: #fff; box-shadow: 0 0 0 2px #D97757; transform: scale(1.1); }
    .custom-color-row { display: flex; align-items: center; gap: 10px; margin-top: 8px; }
    .color-input-native { width: 40px; height: 36px; padding: 2px; border-radius: 8px; border: 1px solid var(--divider-color, rgba(255,255,255,0.15)); background: transparent; cursor: pointer; }
    .color-input-hex { flex: 1; height: 36px; padding: 0 12px; border-radius: 8px; border: 1px solid var(--divider-color, rgba(255,255,255,0.15)); background: rgba(0,0,0,0.15); color: var(--primary-text-color, #F5F0EB); font-family: monospace; font-size: 13px; }
    .entity-list { display: flex; flex-direction: column; gap: 8px; }
    .entity-item {
      border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.1));
      border-radius: 10px; padding: 10px 12px; background: rgba(0, 0, 0, 0.12);
      display: flex; flex-direction: column; gap: 10px;
    }
    .entity-item-top { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
    .entity-item-label { font-size: 13px; font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1; }
    .entity-item-actions { display: flex; align-items: center; gap: 4px; }
    .icon-btn {
      width: 28px; height: 28px; border-radius: 7px; border: 1px solid rgba(255,255,255,0.1);
      background: transparent; color: var(--primary-text-color, #F5F0EB); cursor: pointer;
      display: flex; align-items: center; justify-content: center; font-size: 13px;
    }
    .icon-btn:hover { border-color: #D97757; color: #D97757; }
    .entity-item-details {
      display: none; grid-template-columns: 1fr 1fr; gap: 8px;
      padding-top: 8px; border-top: 1px dashed rgba(255,255,255,0.1);
    }
    .entity-item.expanded .entity-item-details { display: grid; }
    .mini-input {
      width: 100%; height: 32px; padding: 0 10px; border-radius: 7px;
      border: 1px solid rgba(255,255,255,0.14); background: rgba(0,0,0,0.2);
      color: var(--primary-text-color, #F5F0EB); font-size: 12px;
    }
    .toggle-row {
      display: flex; align-items: center; justify-content: space-between; gap: 12px;
      padding: 8px 0; border-bottom: 1px solid var(--divider-color, rgba(255, 255, 255, 0.06));
    }
    .toggle-row:last-child { border-bottom: none; }
    .toggle-info { display: flex; flex-direction: column; gap: 2px; }
    .toggle-title { font-size: 13.5px; font-weight: 500; }
    .toggle-desc { font-size: 11.5px; color: var(--secondary-text-color, #A09080); }
    .switch { position: relative; display: inline-block; width: 44px; height: 24px; flex-shrink: 0; }
    .switch input { opacity: 0; width: 0; height: 0; }
    .slider-tog { position: absolute; cursor: pointer; inset: 0; background-color: rgba(160, 144, 128, 0.3); transition: 0.25s; border-radius: 24px; }
    .slider-tog:before { position: absolute; content: ""; height: 18px; width: 18px; left: 3px; bottom: 3px; background-color: #fff; transition: 0.25s; border-radius: 50%; }
    input:checked + .slider-tog { background-color: #D97757; }
    input:checked + .slider-tog:before { transform: translateX(20px); }
  `;

  class WeSmartCardEditor extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this._config = {};
      this._hass = null;
      this._rendered = false;
      this._openSections = { entity: true, theme: true, controls: false };
      this._expandedRow = null;
    }

    _getActiveMode() {
      const resolved = resolveModeFromType(this._config.card_type);
      if (resolved) return resolved;
      if (Array.isArray(this._config.entities) && this._config.entities.length > 0 && !this._config.entity) {
        return 'list';
      }
      return 'single';
    }

    setConfig(config) {
      this._config = {
        entity:              '',
        name:                '',
        title:               'Lights',
        icon:                '',
        color:               '#D97757',
        theme:               'dark',
        show_brightness:     true,
        show_color_temp:     true,
        show_color:          true,
        collapse_when_off:   false,
        dynamic_light_color: false,
        show_footer:         true,
        entities:            [],
        ...config,
      };
      if (!this._rendered) this._buildDOM();
      this._syncUI();
    }

    set hass(hass) {
      this._hass = hass;
      if (!this._rendered) this._buildDOM();
      ['#ha-single-form', '#ha-multi-header-form', '#ha-add-entity-form'].forEach(sel => {
        const el = this.shadowRoot.querySelector(sel);
        if (el) el.hass = hass;
      });
    }

    _getNormalizedEntities() {
      const raw = Array.isArray(this._config.entities) ? this._config.entities : [];
      return raw.map(e => typeof e === 'string' ? { entity: e } : { ...e }).filter(e => e && e.entity);
    }

    _buildDOM() {
      this._rendered = true;
      const shadow = this.shadowRoot;
      shadow.innerHTML = '';

      const style = document.createElement('style');
      style.textContent = editorStyles;
      shadow.appendChild(style);

      const container = document.createElement('div');
      container.className = 'editor-container';
      container.innerHTML = `
        <div class="editor-banner">
          <div class="banner-title">
            <ha-icon icon="mdi:view-dashboard-Edit-outline" style="color:#D97757"></ha-icon>
            <span>WeSmart Card — All-in-One Studio</span>
          </div>
          <span class="banner-badge">v${CARD_VERSION}</span>
        </div>

        <!-- 0. SELETTORE TIPO DI CARD (Stile Bubble Card) -->
        <div class="type-selector-box">
          <div class="field-label" style="margin-bottom:0">Seleziona Tipo di Card (card_type)</div>
          <div class="type-cards-grid">
            ${CARD_TYPES.map(ct => `
              <button type="button" class="type-card-btn" data-type="${ct.id}" data-mode="${ct.mode}">
                <ha-icon icon="${ct.icon}"></ha-icon>
                <span class="type-card-name">${ct.name}</span>
                <span class="type-card-sub">${ct.sub}</span>
              </button>
            `).join('')}
          </div>
        </div>

        <!-- 1. Entità & Configurazione Principale -->
        <div class="section open" id="sec-entity">
          <div class="section-header" data-sec="entity">
            <div class="section-title">
              <ha-icon icon="mdi:lightbulb"></ha-icon>
              <span id="sec-entity-title">1. Entità & Identità</span>
            </div>
            <ha-icon class="chevron" icon="mdi:chevron-down"></ha-icon>
          </div>
          <div class="section-body">
            <!-- Blocco Single -->
            <div id="pane-single">
              <ha-form id="ha-single-form"></ha-form>
            </div>

            <!-- Blocco Multi (List / Expand) -->
            <div id="pane-multi" style="display:none; flex-direction:column; gap:16px">
              <ha-form id="ha-multi-header-form"></ha-form>
              <div>
                <div class="field-label">Elenco Luci Configurate</div>
                <div class="entity-list" id="entity-list"></div>
              </div>
              <div>
                <div class="field-label">➕ Aggiungi Luce alla Lista</div>
                <ha-form id="ha-add-entity-form"></ha-form>
              </div>
            </div>
          </div>
        </div>

        <!-- 2. Aspetto & InfiniteColor -->
        <div class="section open" id="sec-theme">
          <div class="section-header" data-sec="theme">
            <div class="section-title">
              <ha-icon icon="mdi:palette"></ha-icon>
              <span>2. Aspetto & Motore InfiniteColor</span>
            </div>
            <ha-icon class="chevron" icon="mdi:chevron-down"></ha-icon>
          </div>
          <div class="section-body">
            <div>
              <div class="field-label">Tema Superficie</div>
              <div class="theme-pills">
                <button type="button" class="theme-pill" data-theme="dark">🌙 Dark</button>
                <button type="button" class="theme-pill" data-theme="light">☀️ Light</button>
                <button type="button" class="theme-pill" data-theme="auto">🔄 Auto</button>
              </div>
            </div>

            <div>
              <div class="field-label">Colore Accento (InfiniteColor Palette)</div>
              <div class="swatches-grid">
                ${PRESET_COLORS.map(p => `
                  <button type="button" class="swatch-btn" data-hex="${p.hex}" title="${p.name}" style="background:${p.hex}"></button>
                `).join('')}
              </div>
              <div class="custom-color-row">
                <input type="color" class="color-input-native" id="color-native" value="#D97757">
                <input type="text" class="color-input-hex" id="color-hex" maxlength="7" placeholder="#D97757">
              </div>
            </div>

            <div class="toggle-row" id="row-dyn-color">
              <div class="toggle-info">
                <span class="toggle-title">Colore dinamico dalla luce (RGB)</span>
                <span class="toggle-desc">Quando accesa, adatta l'accento della card al colore reale della lampadina</span>
              </div>
              <label class="switch">
                <input type="checkbox" data-toggle="dynamic_light_color">
                <span class="slider-tog"></span>
              </label>
            </div>
          </div>
        </div>

        <!-- 3. Controlli & Opzioni -->
        <div class="section" id="sec-controls">
          <div class="section-header" data-sec="controls">
            <div class="section-title">
              <ha-icon icon="mdi:tune-variant"></ha-icon>
              <span>3. Controlli & Comportamento</span>
            </div>
            <ha-icon class="chevron" icon="mdi:chevron-down"></ha-icon>
          </div>
          <div class="section-body">
            <div id="controls-single-only">
              <div class="toggle-row">
                <div class="toggle-info">
                  <span class="toggle-title">Mostra Slider Luminosità</span>
                  <span class="toggle-desc">Barra di regolazione percentuale luminosità (0–100%)</span>
                </div>
                <label class="switch">
                  <input type="checkbox" data-toggle="show_brightness">
                  <span class="slider-tog"></span>
                </label>
              </div>

              <div class="toggle-row">
                <div class="toggle-info">
                  <span class="toggle-title">Mostra Temperatura Colore (Kelvin)</span>
                  <span class="toggle-desc">Slider bianco caldo/freddo (se supportato dalla luce)</span>
                </div>
                <label class="switch">
                  <input type="checkbox" data-toggle="show_color_temp">
                  <span class="slider-tog"></span>
                </label>
              </div>

              <div class="toggle-row">
                <div class="toggle-info">
                  <span class="toggle-title">Mostra Selettore Colore (Hue RGB)</span>
                  <span class="toggle-desc">Slider arcobaleno per luci RGB/HS</span>
                </div>
                <label class="switch">
                  <input type="checkbox" data-toggle="show_color">
                  <span class="slider-tog"></span>
                </label>
              </div>

              <div class="toggle-row">
                <div class="toggle-info">
                  <span class="toggle-title">Comprimi quando spenta</span>
                  <span class="toggle-desc">Nasconde automaticamente gli slider quando la luce è OFF</span>
                </div>
                <label class="switch">
                  <input type="checkbox" data-toggle="collapse_when_off">
                  <span class="slider-tog"></span>
                </label>
              </div>
            </div>

            <div class="toggle-row">
              <div class="toggle-info">
                <span class="toggle-title">Mostra Footer WeSmart</span>
                <span class="toggle-desc">Barra inferiore con riepilogo e marchio WeSmart</span>
              </div>
              <label class="switch">
                <input type="checkbox" data-toggle="show_footer">
                <span class="slider-tog"></span>
              </label>
            </div>
          </div>
        </div>
      `;

      shadow.appendChild(container);
      this._bindEditorEvents();
    }

    _bindEditorEvents() {
      const shadow = this.shadowRoot;

      // Mode switching (Light / Lights / Lights Expand) with smart entity migration
      shadow.querySelectorAll('.type-card-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const targetMode = btn.dataset.mode;
          const targetType = btn.dataset.type || modeToCanonicalType(targetMode);
          const patch = { card_type: targetType };

          if (targetMode === 'single') {
            if (!this._config.entity) {
              const list = this._getNormalizedEntities();
              if (list.length > 0) {
                patch.entity = list[0].entity;
              } else if (this._hass) {
                const first = Object.keys(this._hass.states).find(k => k.startsWith('light.'));
                if (first) patch.entity = first;
              }
            }
          } else {
            const list = this._getNormalizedEntities();
            if (list.length === 0) {
              if (this._config.entity) {
                patch.entities = [this._config.entity];
              } else if (this._hass) {
                const lights = Object.keys(this._hass.states).filter(k => k.startsWith('light.')).slice(0, 3);
                if (lights.length) patch.entities = lights;
              }
            }
          }
          this._updateConfig(patch);
        });
      });

      // Accordion headers
      shadow.querySelectorAll('.section-header').forEach(hdr => {
        hdr.addEventListener('click', () => {
          const secKey = hdr.dataset.sec;
          this._openSections[secKey] = !this._openSections[secKey];
          shadow.querySelector(`#sec-${secKey}`)?.classList.toggle('open', this._openSections[secKey]);
        });
      });

      // Single mode HA Form
      const singleForm = shadow.querySelector('#ha-single-form');
      if (singleForm) {
        singleForm.schema = [
          { name: 'entity', required: true,  selector: { entity: { domain: 'light' } } },
          { name: 'name',   required: false, selector: { text: {} } },
          { name: 'icon',   required: false, selector: { icon: { placeholder: 'mdi:lightbulb' } } },
        ];
        singleForm.computeLabel = (s) => ({
          entity: 'Entità Luce (light.*)',
          name:   'Nome Personalizzato (opzionale)',
          icon:   'Icona Personalizzata (opzionale)',
        }[s.name] || s.name);
        singleForm.addEventListener('value-changed', (ev) => {
          ev.stopPropagation();
          const v = ev.detail.value || {};
          this._updateConfig({ entity: v.entity || '', name: v.name || null, icon: v.icon || null });
        });
      }

      // Multi mode Header HA Form
      const multiHdrForm = shadow.querySelector('#ha-multi-header-form');
      if (multiHdrForm) {
        multiHdrForm.schema = [
          { name: 'title', required: false, selector: { text: {} } },
          { name: 'icon',  required: false, selector: { icon: { placeholder: 'mdi:lightbulb-group' } } },
        ];
        multiHdrForm.computeLabel = (s) => s.name === 'title' ? 'Titolo Gruppo Luci' : 'Icona Header Gruppo';
        multiHdrForm.addEventListener('value-changed', (ev) => {
          ev.stopPropagation();
          const v = ev.detail.value || {};
          this._updateConfig({ title: v.title || 'Lights', icon: v.icon || null });
        });
      }

      // Multi mode Add Entity HA Form
      const addForm = shadow.querySelector('#ha-add-entity-form');
      if (addForm) {
        addForm.schema = [
          { name: 'new_entity', required: false, selector: { entity: { domain: 'light' } } },
        ];
        addForm.computeLabel = () => 'Cerca e seleziona un\'entità light.* da aggiungere';
        addForm.data = { new_entity: '' };
        addForm.addEventListener('value-changed', (ev) => {
          ev.stopPropagation();
          const picked = ev.detail.value?.new_entity;
          if (picked) {
            const list = this._getNormalizedEntities();
            if (!list.some(item => item.entity === picked)) {
              list.push({ entity: picked });
              this._updateConfig({ entities: list });
            }
            addForm.data = { new_entity: '' };
          }
        });
      }

      // Theme pills
      shadow.querySelectorAll('.theme-pill').forEach(btn => {
        btn.addEventListener('click', () => this._updateConfig({ theme: btn.dataset.theme }));
      });

      // Swatches
      shadow.querySelectorAll('.swatch-btn').forEach(btn => {
        btn.addEventListener('click', () => this._updateConfig({ color: btn.dataset.hex }));
      });

      // Custom Color
      const colorNative = shadow.querySelector('#color-native');
      const colorHex    = shadow.querySelector('#color-hex');
      if (colorNative) {
        colorNative.addEventListener('input', (e) => this._updateConfig({ color: e.target.value.toUpperCase() }));
      }
      if (colorHex) {
        colorHex.addEventListener('change', (e) => {
          let val = e.target.value.trim();
          if (!val.startsWith('#')) val = '#' + val;
          if (/^#[0-9A-Fa-f]{6}$/.test(val)) this._updateConfig({ color: val.toUpperCase() });
        });
      }

      // Boolean toggles
      shadow.querySelectorAll('input[data-toggle]').forEach(chk => {
        chk.addEventListener('change', (e) => {
          this._updateConfig({ [chk.dataset.toggle]: e.target.checked });
        });
      });
    }

    _renderEntityList() {
      const listEl = this.shadowRoot.querySelector('#entity-list');
      if (!listEl) return;
      const items = this._getNormalizedEntities();

      if (!items.length) {
        listEl.innerHTML = `<div style="font-size:12px;color:var(--secondary-text-color,#A09080)">Nessuna luce nella lista. Seleziona un'entità qui sotto per aggiungerla.</div>`;
        return;
      }

      listEl.innerHTML = items.map((item, idx) => `
        <div class="entity-item ${this._expandedRow === idx ? 'expanded' : ''}" data-idx="${idx}">
          <div class="entity-item-top">
            <span class="entity-item-label">${item.name ? `${item.name} (${item.entity})` : item.entity}</span>
            <div class="entity-item-actions">
              <button type="button" class="icon-btn" data-act="up" data-idx="${idx}" title="Sposta su">↑</button>
              <button type="button" class="icon-btn" data-act="down" data-idx="${idx}" title="Sposta giù">↓</button>
              <button type="button" class="icon-btn" data-act="edit" data-idx="${idx}" title="Personalizza nome/icona">⚙️</button>
              <button type="button" class="icon-btn" data-act="del" data-idx="${idx}" title="Rimuovi">✕</button>
            </div>
          </div>
          <div class="entity-item-details">
            <input type="text" class="mini-input" data-field="name" data-idx="${idx}" placeholder="Nome custom" value="${item.name || ''}">
            <input type="text" class="mini-input" data-field="icon" data-idx="${idx}" placeholder="Icona (es. mdi:lamp)" value="${item.icon || ''}">
          </div>
        </div>
      `).join('');

      listEl.querySelectorAll('.icon-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = parseInt(btn.dataset.idx, 10);
          const act = btn.dataset.act;
          const arr = this._getNormalizedEntities();
          if (act === 'up' && idx > 0) {
            [arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]];
            this._updateConfig({ entities: arr });
          } else if (act === 'down' && idx < arr.length - 1) {
            [arr[idx + 1], arr[idx]] = [arr[idx], arr[idx + 1]];
            this._updateConfig({ entities: arr });
          } else if (act === 'edit') {
            this._expandedRow = this._expandedRow === idx ? null : idx;
            this._renderEntityList();
          } else if (act === 'del') {
            arr.splice(idx, 1);
            this._updateConfig({ entities: arr });
          }
        });
      });

      listEl.querySelectorAll('.mini-input').forEach(inp => {
        inp.addEventListener('change', () => {
          const idx   = parseInt(inp.dataset.idx, 10);
          const field = inp.dataset.field;
          const arr   = this._getNormalizedEntities();
          if (arr[idx]) {
            const val = inp.value.trim();
            if (val) arr[idx][field] = val;
            else delete arr[idx][field];
            this._updateConfig({ entities: arr });
          }
        });
      });
    }

    _syncUI() {
      if (!this._rendered) return;
      const shadow = this.shadowRoot;
      const c      = this._config;
      const mode   = this._getActiveMode();
      const isSingle = mode === 'single';

      // Sync Card Type Buttons
      shadow.querySelectorAll('.type-card-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.mode === mode);
      });

      // Toggle Single vs Multi panes
      const paneSingle         = shadow.querySelector('#pane-single');
      const paneMulti          = shadow.querySelector('#pane-multi');
      const secEntityTitle     = shadow.querySelector('#sec-entity-title');
      const rowDynColor        = shadow.querySelector('#row-dyn-color');
      const controlsSingleOnly = shadow.querySelector('#controls-single-only');

      if (paneSingle) paneSingle.style.display = isSingle ? 'block' : 'none';
      if (paneMulti)  paneMulti.style.display  = isSingle ? 'none'  : 'flex';
      if (secEntityTitle) {
        secEntityTitle.textContent = isSingle
          ? '1. Entità & Identità (Luce Singola)'
          : `1. Gruppo & Lista Luci (${mode === 'expand' ? 'Lights Expand' : 'Lights Lista'})`;
      }
      if (rowDynColor)        rowDynColor.style.display        = isSingle ? 'flex'  : 'none';
      if (controlsSingleOnly) controlsSingleOnly.style.display = isSingle ? 'block' : 'none';

      // Sync Forms
      const singleForm = shadow.querySelector('#ha-single-form');
      if (singleForm) {
        if (this._hass) singleForm.hass = this._hass;
        singleForm.data = { entity: c.entity || '', name: c.name || '', icon: c.icon || '' };
      }

      const multiHdrForm = shadow.querySelector('#ha-multi-header-form');
      if (multiHdrForm) {
        if (this._hass) multiHdrForm.hass = this._hass;
        multiHdrForm.data = { title: c.title || 'Lights', icon: c.icon || '' };
      }

      const addForm = shadow.querySelector('#ha-add-entity-form');
      if (addForm && this._hass) addForm.hass = this._hass;

      if (!isSingle) this._renderEntityList();

      // Sync Theme
      const curTheme = c.theme || 'dark';
      shadow.querySelectorAll('.theme-pill').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.theme === curTheme);
      });

      // Sync Color
      const curColor = (c.color || '#D97757').toUpperCase();
      shadow.querySelectorAll('.swatch-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.hex.toUpperCase() === curColor);
      });
      const colorNative = shadow.querySelector('#color-native');
      const colorHex    = shadow.querySelector('#color-hex');
      if (colorNative && /^#[0-9A-Fa-f]{6}$/.test(curColor)) colorNative.value = curColor;
      if (colorHex) colorHex.value = curColor;

      // Sync Toggles
      shadow.querySelectorAll('input[data-toggle]').forEach(chk => {
        const key = chk.dataset.toggle;
        chk.checked = c[key] !== undefined ? Boolean(c[key]) : true;
      });
    }

    _updateConfig(patch) {
      const next = { ...this._config, ...patch };
      if (!next.name) delete next.name;
      if (!next.icon) delete next.icon;
      this._config = next;
      this._syncUI();
      this.dispatchEvent(new CustomEvent('config-changed', {
        detail: { config: next },
        bubbles: true,
        composed: true,
      }));
    }
  }

  // ─── Register WeSmart Card (All-in-One) & Editor ──────────────────────────────

  const safeDefine = (tag, cls) => { if (!customElements.get(tag)) customElements.define(tag, cls); };

  // Primary All-in-One Card & Editor
  safeDefine('wesmart-card', WeSmartCard);
  safeDefine('wesmart-card-editor', WeSmartCardEditor);

  window.customCards = window.customCards || [];
  window.customCards.push({
    type:        'wesmart-card',
    name:        'WeSmart Card (All-in-One)',
    description: 'Modular All-in-One Suite with Visual Editor (Light, Lights, Lights Expand & more).',
    preview:     true,
  });

  console.info(
    `%c WESMART CARD (ALL-IN-ONE) %c v${CARD_VERSION} `,
    'background:#D97757;color:#fff;font-weight:700;padding:2px 6px;border-radius:4px 0 0 4px',
    'background:#1C1917;color:#D97757;font-weight:600;padding:2px 6px;border-radius:0 4px 4px 0'
  );

})();
