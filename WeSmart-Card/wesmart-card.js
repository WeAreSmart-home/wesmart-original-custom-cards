/**
 * WeSmart Card (All-in-One Modular Suite) - Home Assistant Custom Card
 * Bubble-Card style single file & single card with Visual Editor GUI.
 * Selectable Card Types (card_type):
 *   - 'light'         (alias 'single') : Single light entity card with brightness, Kelvin/CT, and hue RGB slider
 *   - 'lights'        (alias 'list')   : Multi-entity compact light list with master & per-row toggles
 *   - 'lights-expand' (alias 'expand') : Multi-entity light list with animated inline brightness & CT sliders
 *   - 'chart'                          : Interactive single/multi-entity chart with drag-to-zoom, tooltip & time pills
 *   - 'history'                        : Multi-entity history card with per-row SVG line chart or binary timeline bar
 * Infinite Color Engine: full palette derived from a single base color (#D97757 default).
 * Version: 1.1.0
 */

(() => {
  'use strict';

  const CARD_VERSION = '1.1.0';

  const HOURS_OPTIONS = [1, 6, 24, 168];
  const HOURS_LABELS  = { 1: '1h', 6: '6h', 24: '24h', 168: '7d' };
  const HOURS_NAMES   = { 1: '1 ora', 6: '6 ore', 24: '24 ore', 168: '7 giorni' };

  // ─── Modular Card Type Registry (Extensible for Climate, Sensors, Doors, etc.) ─
  const CARD_TYPES = [
    { id: 'light',         mode: 'single',  category: 'Lights', icon: 'mdi:lightbulb-on',         name: 'Light',         sub: '1 Luce · Slider completi' },
    { id: 'lights',        mode: 'list',    category: 'Lights', icon: 'mdi:format-list-bulleted', name: 'Lights',        sub: 'Multi-luce · Toggle rapidi' },
    { id: 'lights-expand', mode: 'expand',  category: 'Lights', icon: 'mdi:tune-vertical',        name: 'Lights Expand', sub: 'Multi-luce · Slider inline' },
    { id: 'chart',         mode: 'chart',   category: 'Graphs', icon: 'mdi:chart-areaspline',     name: 'Chart',         sub: 'Grafico Zoom & Tooltip' },
    { id: 'history',       mode: 'history', category: 'Graphs', icon: 'mdi:chart-timeline',       name: 'History',       sub: 'Storico per ogni riga' },
  ];

  function resolveModeFromType(cardType) {
    if (!cardType) return null;
    const t = String(cardType).toLowerCase().trim();
    if (t === 'light' || t === 'single') return 'single';
    if (t === 'lights' || t === 'list') return 'list';
    if (t === 'lights-expand' || t === 'lights_expand' || t === 'expand') return 'expand';
    if (t === 'chart' || t === 'graph') return 'chart';
    if (t === 'history') return 'history';
    return null;
  }

  function modeToCanonicalType(mode) {
    if (mode === 'list') return 'lights';
    if (mode === 'expand') return 'lights-expand';
    if (mode === 'chart') return 'chart';
    if (mode === 'history') return 'history';
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

  /* ── Chart & History Modes ── */
  .loader {
    position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent, var(--accent), transparent);
    opacity: 0; transition: opacity 0.3s; z-index: 5;
  }
  .loader.active { opacity: 1; }
  .time-pills {
    display: flex; gap: 3px; background: var(--surface);
    border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 3px;
  }
  .time-pill {
    padding: 4px 10px; border-radius: 8px; font-size: 11.5px; font-weight: 500;
    border: none; cursor: pointer; background: transparent;
    color: var(--text-muted); transition: var(--transition);
  }
  .time-pill.active { background: var(--accent); color: #fff; }
  .time-pill:not(.active):hover { background: var(--row-hover); color: var(--text); }
  .chart-section { padding: 4px 0 8px; }
  .zoom-reset {
    display: none; margin: 0 0 10px; padding: 3px 12px;
    background: var(--accent-soft); border: 1px solid var(--accent);
    border-radius: 8px; color: var(--accent); font-size: 11px; font-weight: 500;
    cursor: pointer; transition: var(--transition);
  }
  .zoom-reset.visible { display: inline-flex; align-items: center; gap: 4px; }
  .zoom-reset:hover { background: var(--accent); color: #fff; }
  .chart-layout { display: flex; gap: 6px; align-items: stretch; }
  .y-axis {
    width: 44px; flex-shrink: 0; display: flex; flex-direction: column;
    justify-content: space-between; padding-bottom: 22px;
  }
  .y-label { font-size: 10px; color: var(--text-dim); text-align: right; line-height: 1; }
  .chart-area { flex: 1; position: relative; cursor: crosshair; touch-action: pan-y; }
  .chart-svg { display: block; width: 100%; }
  .tooltip-box {
    position: absolute; top: 4px; background: var(--surface); border: 1px solid var(--border);
    border-radius: 8px; padding: 6px 10px; font-size: 11px; color: var(--text);
    pointer-events: none; opacity: 0; transition: opacity 0.12s; white-space: nowrap; z-index: 10;
    box-shadow: 0 4px 16px rgba(0,0,0,0.25);
  }
  .tt-time { font-size: 10px; color: var(--text-muted); margin-bottom: 4px; }
  .tt-row { display: flex; align-items: center; gap: 6px; margin-top: 2px; }
  .tt-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
  .time-axis { display: flex; justify-content: space-between; margin-top: 5px; }
  .mode-chart .time-axis { margin-left: 50px; }
  .time-axis span { font-size: 10px; color: var(--text-dim); }
  .no-data { font-size: 12px; color: var(--text-dim); text-align: center; padding: 20px 0; }
  .tl-group { position: relative; }
  .tl-wrap { margin-bottom: 10px; }
  .tl-wrap:last-child { margin-bottom: 0; }
  .tl-label { font-size: 11px; color: var(--text-muted); margin-bottom: 4px; }
  .timeline-bar {
    width: 100%; height: 10px; background: var(--surface); border-radius: 5px;
    position: relative; overflow: hidden; border: 1px solid var(--border);
  }
  .tl-seg, .seg { position: absolute; top: 0; bottom: 0; }
  .seg-on { background: var(--accent); }
  .seg-off { background: transparent; }
  .legend { border-top: 1px solid var(--border); margin-top: 6px; padding-top: 4px; }
  .legend-row {
    display: flex; align-items: center; gap: 10px; padding: 8px 6px;
    border-bottom: 1px solid var(--border); cursor: pointer; transition: background 0.2s; border-radius: 8px;
  }
  .legend-row:last-child { border-bottom: none; }
  .legend-row:hover { background: var(--row-hover); }
  .legend-dot { width: 9px; height: 9px; border-radius: 50%; flex-shrink: 0; }
  .legend-name { font-size: 13px; font-weight: 500; color: var(--text); flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .legend-state, .hist-state {
    font-size: 11px; font-weight: 500; color: var(--text-muted); background: var(--surface);
    border: 1px solid var(--border); padding: 2px 8px; border-radius: 6px; white-space: nowrap;
  }
  .hist-state.state-on { color: var(--accent); background: var(--accent-soft); border-color: transparent; }
  .legend-stat, .hist-stat { font-size: 11px; color: var(--text-dim); white-space: nowrap; }
  .hist-row {
    padding: 12px 4px; border-bottom: 1px solid var(--border); cursor: pointer; transition: background 0.2s;
  }
  .hist-row:last-child { border-bottom: none; }
  .hist-row:hover { background: var(--row-hover); }
  .hist-meta { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
  .hist-icon-wrap {
    width: 32px; height: 32px; background: var(--surface); border: 1px solid var(--border);
    border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .hist-icon-wrap ha-icon { --mdc-icon-size: 16px; color: var(--text-muted); }
  .linechart { width: 100%; }
  .linechart svg { display: block; overflow: visible; }
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
      this._history    = {};
      this._hours      = 24;
      this._zoomRange  = null;
      this._uid        = Math.random().toString(36).slice(2, 8);
      this._lastHistKey = '';
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
        title:               null,
        icon:                null,
        color:               '#D97757',
        theme:               'dark',
        show_brightness:     true,
        show_color_temp:     true,
        show_color:          true,
        collapse_when_off:   false,
        dynamic_light_color: false,
        show_footer:         true,
        hours:               24,
        height:              100,
        show_grid:           false,
        zoom:                true,
        entities:            [],
        ...config,
      };
      this._hours = Number(this._config.hours) || 24;
      const rawEntities = Array.isArray(this._config.entities) && this._config.entities.length > 0
        ? this._config.entities
        : (this._config.entity ? [{ entity: this._config.entity, name: this._config.name, icon: this._config.icon }] : []);
      this._entities = rawEntities.map(e => typeof e === 'string' ? { entity: e } : { ...e }).filter(e => e && e.entity);
      this._applyPalette();
      this._render();
      if (this._hass && (this._mode === 'chart' || this._mode === 'history')) {
        this._fetchHistory();
      }
    }

    set hass(hass) {
      const first = !this._hass;
      this._hass = hass;
      this._updateState();
      if (this._mode === 'chart' || this._mode === 'history') {
        const histKey = `${this._mode}:${this._hours}:${this._entities.map(e => e.entity).join(',')}`;
        if (first || histKey !== this._lastHistKey) {
          this._lastHistKey = histKey;
          this._fetchHistory();
        }
      }
    }

    getCardSize() {
      const m = this._mode;
      if (m === 'single')  return 3;
      if (m === 'chart')   return 4 + Math.ceil(this._entities.length * 0.7);
      if (m === 'history') return 2 + Math.ceil(this._entities.length * 1.5);
      return 1 + Math.ceil((this._entities.length * 52 + 100) / 50);
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
      } else if (mode === 'expand') {
        this._card.innerHTML = this._getExpandHTML();
        shadow.appendChild(this._card);
        this._bindExpandEvents();
      } else if (mode === 'chart') {
        this._card.innerHTML = this._getChartHTML();
        shadow.appendChild(this._card);
        this._bindChartEvents();
      } else if (mode === 'history') {
        this._card.innerHTML = this._getHistoryHTML();
        shadow.appendChild(this._card);
        this._bindHistoryEvents();
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

    // ── 4. CHART & 5. HISTORY MODES HTML & LOGIC ────────────────────────────────

    _entityColor(i) {
      const baseColor = /^#[0-9A-Fa-f]{6}$/.test(this._config.color) ? this._config.color : '#D97757';
      const { h, s } = this._hexToHsl(baseColor);
      const hue = (h + i * 137.508) % 360;
      const sat = this._clamp(s, 55, 82);
      const isDark = this._config.theme === 'auto'
        ? !window.matchMedia('(prefers-color-scheme: light)').matches
        : this._config.theme !== 'light';
      const lig = isDark ? 62 : 48;
      return this._hsl(hue, sat, lig);
    }

    _getChartHTML() {
      const c = this._config;
      const n = this._entities.length;
      const title = c.title || 'Grafico';
      const icon  = c.icon  || 'mdi:chart-areaspline';

      const pillsHTML = HOURS_OPTIONS.map(h =>
        `<button class="time-pill${h === this._hours ? ' active' : ''}" data-hours="${h}">${HOURS_LABELS[h]}</button>`
      ).join('');

      const legendHTML = this._entities.map((cfg, i) => {
        const color = this._entityColor(i);
        const name  = cfg.name || this._friendlyName(cfg.entity);
        return `<div class="legend-row" data-index="${i}">
          <span class="legend-dot" style="background:${color}"></span>
          <span class="legend-name">${name}</span>
          <span class="legend-state" id="ls-${i}">—</span>
          <span class="legend-stat"  id="lx-${i}"></span>
        </div>`;
      }).join('');

      return `
        <div class="loader" id="loader"></div>
        <div class="header">
          <div class="header-left">
            <div class="header-icon-wrap"><ha-icon icon="${icon}"></ha-icon></div>
            <div class="header-titles">
              <div class="header-title">${title}</div>
              <div class="header-sub" id="sub">Ultimi ${HOURS_NAMES[this._hours] ?? this._hours + 'h'}</div>
            </div>
          </div>
          <div class="time-pills">${pillsHTML}</div>
        </div>
        <div class="separator"></div>
        <div class="chart-section">
          <button class="zoom-reset" id="zreset">↺ Reset zoom</button>
          <div id="chart-container"><div class="no-data">Caricamento…</div></div>
        </div>
        <div class="legend" id="legend">${legendHTML}</div>
        <div class="footer" style="${c.show_footer === false ? 'display:none' : ''}">
          <div class="footer-info">
            <ha-icon icon="mdi:chart-line"></ha-icon>
            <span>${n} entit${n === 1 ? 'à' : 'à'}</span>
          </div>
          <div class="brand-mark">${this._brandSVG()}<span>WeSmart</span></div>
        </div>`;
    }

    _getHistoryHTML() {
      const c = this._config;
      const n = this._entities.length;
      const title = c.title || 'History';
      const icon  = c.icon  || 'mdi:chart-timeline';

      const pillsHTML = HOURS_OPTIONS.map(h =>
        `<button class="time-pill${h === this._hours ? ' active' : ''}" data-hours="${h}">${HOURS_LABELS[h]}</button>`
      ).join('');

      const rowsHTML = this._entities.map((cfg, i) => {
        const name = cfg.name || this._friendlyName(cfg.entity);
        const entIcon = cfg.icon || this._iconForEntity(cfg.entity);
        return `
          <div class="hist-row" data-index="${i}">
            <div class="hist-meta">
              <div class="hist-icon-wrap">
                <ha-icon id="hicon-${i}" icon="${entIcon}"></ha-icon>
              </div>
              <span class="legend-name">${name}</span>
              <span class="hist-state" id="hstate-${i}">—</span>
              <span class="hist-stat"  id="hstat-${i}"></span>
            </div>
            <div id="hgraph-${i}">
              <div class="no-data">Caricamento…</div>
            </div>
          </div>`;
      }).join('');

      return `
        <div class="loader" id="loader"></div>
        <div class="header">
          <div class="header-left">
            <div class="header-icon-wrap"><ha-icon icon="${icon}"></ha-icon></div>
            <div class="header-titles">
              <div class="header-title">${title}</div>
              <div class="header-sub" id="sub">Ultimi ${HOURS_NAMES[this._hours] ?? this._hours + 'h'}</div>
            </div>
          </div>
          <div class="time-pills">${pillsHTML}</div>
        </div>
        <div class="separator"></div>
        <div id="hist-list">${rowsHTML}</div>
        <div class="footer" style="${c.show_footer === false ? 'display:none' : ''}">
          <div class="footer-info">
            <ha-icon icon="mdi:chart-timeline"></ha-icon>
            <span>${n} entit${n === 1 ? 'à' : 'à'}</span>
          </div>
          <div class="brand-mark">${this._brandSVG()}<span>WeSmart</span></div>
        </div>`;
    }

    _bindChartEvents() {
      this._card.querySelectorAll('.time-pill').forEach(btn => {
        btn.addEventListener('click', e => {
          e.stopPropagation();
          this._hours = parseInt(btn.dataset.hours, 10);
          this._zoomRange = null;
          this._card.querySelectorAll('.time-pill').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          const sub = this._q('#sub');
          if (sub) sub.textContent = `Ultimi ${HOURS_NAMES[this._hours] ?? this._hours + 'h'}`;
          this._refreshZoomBtn();
          this._fetchHistory();
        });
      });

      this._q('#zreset')?.addEventListener('click', () => {
        this._zoomRange = null;
        this._refreshZoomBtn();
        this._updateGraphs();
      });

      this._q('#legend')?.addEventListener('click', e => {
        const row = e.target.closest('.legend-row');
        if (!row) return;
        const idx = parseInt(row.dataset.index, 10);
        if (isNaN(idx)) return;
        const entityId = this._entities[idx]?.entity;
        if (entityId) {
          this.dispatchEvent(new CustomEvent('hass-more-info', {
            bubbles: true, composed: true, detail: { entityId }
          }));
        }
      });
    }

    _bindHistoryEvents() {
      this._card.querySelectorAll('.time-pill').forEach(btn => {
        btn.addEventListener('click', e => {
          e.stopPropagation();
          this._hours = parseInt(btn.dataset.hours, 10);
          this._card.querySelectorAll('.time-pill').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          const sub = this._q('#sub');
          if (sub) sub.textContent = `Ultimi ${HOURS_NAMES[this._hours] ?? this._hours + 'h'}`;
          this._fetchHistory();
        });
      });

      this._q('#hist-list')?.addEventListener('click', e => {
        const row = e.target.closest('.hist-row');
        if (!row) return;
        const idx = parseInt(row.dataset.index, 10);
        if (isNaN(idx)) return;
        const entityId = this._entities[idx]?.entity;
        if (entityId) {
          this.dispatchEvent(new CustomEvent('hass-more-info', {
            bubbles: true, composed: true, detail: { entityId }
          }));
        }
      });
    }

    _refreshZoomBtn() {
      const btn = this._q('#zreset');
      if (btn) btn.className = `zoom-reset${this._zoomRange ? ' visible' : ''}`;
    }

    _winRange() {
      if (this._zoomRange) return [this._zoomRange.start, this._zoomRange.end];
      const now = Date.now();
      return [now - this._hours * 3600000, now];
    }

    async _fetchHistory() {
      if (!this._hass || !this._entities.length) return;
      const loader = this._q('#loader');
      if (loader) loader.classList.add('active');

      const ids   = this._entities.map(e => e.entity).join(',');
      const start = new Date(Date.now() - this._hours * 3600000).toISOString();
      const end   = new Date().toISOString();
      const path  = `history/period/${start}?filter_entity_id=${ids}&end_time=${end}&minimal_response=true&significant_changes_only=false`;

      try {
        const data = await this._hass.callApi('GET', path);
        this._history = {};
        if (Array.isArray(data)) {
          data.forEach(arr => {
            if (arr?.length > 0 && arr[0].entity_id) {
              this._history[arr[0].entity_id] = arr;
            }
          });
        }
        this._updateGraphs();
      } catch (err) {
        console.error('[wesmart-card] history fetch error:', err);
        const c = this._q('#chart-container');
        if (c) c.innerHTML = '<div class="no-data">Errore nel caricamento dei dati</div>';
      } finally {
        if (loader) loader.classList.remove('active');
      }
    }

    _updateGraphs() {
      if (this._mode === 'chart') {
        const container = this._q('#chart-container');
        if (!container) return;
        const histories = this._entities.map(cfg => this._history[cfg.entity] || []);
        const allBinary = histories.every(h => this._isBinary(h));

        if (allBinary) {
          container.innerHTML = this._renderChartTimelines(histories);
          this._bindChartInteraction(container.querySelector('.chart-area'), []);
        } else {
          container.innerHTML = this._renderChartLines(histories);
          const pts = histories.map(h => this._isBinary(h) ? [] : this._toPoints(h));
          this._bindChartInteraction(container.querySelector('.chart-area'), pts);
        }

        histories.forEach((h, i) => {
          const el = this._q(`#lx-${i}`);
          if (el) el.textContent = this._isBinary(h) ? this._binaryStat(h) : this._numericStat(h, this._entities[i].entity);
        });
      } else if (this._mode === 'history') {
        this._entities.forEach((cfg, i) => {
          const history   = this._history[cfg.entity] || [];
          const container = this._q(`#hgraph-${i}`);
          const statEl    = this._q(`#hstat-${i}`);
          if (!container) return;

          if (this._isBinary(history)) {
            container.innerHTML = this._renderHistoryTimeline(history);
            if (statEl) statEl.textContent = this._binaryStat(history);
          } else {
            container.innerHTML = this._renderHistoryLineChart(history, cfg.entity);
            if (statEl) statEl.textContent = this._numericStat(history, cfg.entity);
          }
        });
      }
    }

    _toPoints(history) {
      const [ws, we] = this._winRange();
      return (history || [])
        .filter(h => h.state !== 'unavailable' && h.state !== 'unknown' && !isNaN(parseFloat(h.state)))
        .map(h => ({ t: new Date(h.last_changed).getTime(), v: parseFloat(h.state) }))
        .filter(p => p.t >= ws - 3600000 && p.t <= we + 60000);
    }

    _renderChartTimelines(histories) {
      const W        = 400;
      const [ws, we] = this._winRange();
      const dur      = we - ws;

      const barsHTML = histories.map((h, i) => {
        const color = this._entityColor(i);
        const name  = this._entities[i].name || this._friendlyName(this._entities[i].entity);
        const valid = (h || []).filter(x => x.state !== 'unavailable' && x.state !== 'unknown');
        const segs  = valid.map((item, j) => {
          const t0 = Math.max(new Date(item.last_changed).getTime(), ws);
          const t1 = j < valid.length - 1 ? new Date(valid[j + 1].last_changed).getTime() : we;
          if (t1 <= ws || t0 >= we) return '';
          const x = ((t0 - ws) / dur * 100).toFixed(2);
          const w = ((Math.min(t1, we) - t0) / dur * 100).toFixed(2);
          return this._isOnState(item.state)
            ? `<div class="tl-seg" style="left:${x}%;width:${Math.max(parseFloat(w), 0.3)}%;background:${color}"></div>`
            : '';
        }).join('');

        return `<div class="tl-wrap">
          <div class="tl-label">${name}</div>
          <div class="timeline-bar">${segs || ''}</div>
        </div>`;
      }).join('');

      const svgOverlay = `<svg class="chart-svg" viewBox="0 0 ${W} 100" preserveAspectRatio="none"
        style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none">
        <line class="tt-line" x1="0" y1="0" x2="0" y2="100" stroke="rgba(255,255,255,0.25)" stroke-width="1" opacity="0"/>
        <rect class="zr-rect" x="0" y="0" width="0" height="100" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.2)" stroke-width="1" opacity="0" rx="2"/>
      </svg>`;

      return `
        <div class="chart-area" style="position:relative;padding:4px 0">
          ${svgOverlay}
          <div class="tl-group" style="position:relative;z-index:1">${barsHTML}</div>
          <div class="tooltip-box"></div>
        </div>
        ${this._timeAxisHTML()}`;
    }

    _renderChartLines(histories) {
      const W   = 400;
      const H   = Number(this._config.height) || 100;
      const pad = 5;
      const uid = this._uid;
      const [ws, we] = this._winRange();
      const rangeT = we - ws;

      const toX = t => ((t - ws) / rangeT * W).toFixed(1);
      const toY = (v, minV, rv) => (H - ((v - minV) / rv) * (H - pad * 2) - pad).toFixed(1);

      const defs  = [];
      const areas = [];
      const lines = [];
      let yMin = null, yMax = null, yUnit = '';

      histories.forEach((h, i) => {
        if (this._isBinary(h)) return;
        const pts = this._toPoints(h);
        if (pts.length < 2) return;

        const color  = this._entityColor(i);
        const vals   = pts.map(p => p.v);
        const minV   = Math.min(...vals);
        const maxV   = Math.max(...vals);
        const rangeV = maxV - minV || 1;

        if (yMin === null) {
          yMin  = minV;
          yMax  = maxV;
          yUnit = this._hass?.states[this._entities[i].entity]?.attributes?.unit_of_measurement ?? '';
        }

        const linePts = pts.map((p, j) => `${j === 0 ? 'M' : 'L'}${toX(p.t)},${toY(p.v, minV, rangeV)}`).join(' ');
        const areaPts = `${linePts} L${toX(pts[pts.length - 1].t)},${H} L${toX(pts[0].t)},${H} Z`;
        const gid     = `wicg-${uid}-${i}`;

        defs.push(`<linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stop-color="${color}" stop-opacity="0.35"/>
          <stop offset="100%" stop-color="${color}" stop-opacity="0.02"/>
        </linearGradient>`);
        areas.push(`<path d="${areaPts}" fill="url(#${gid})"/>`);
        lines.push(`<path d="${linePts}" fill="none" stroke="${color}" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/>`);
      });

      if (!areas.length) {
        return `<div class="no-data">Nessun dato nel periodo selezionato</div>`;
      }

      const gridHTML = this._config.show_grid ? [0.25, 0.5, 0.75].map(f => {
        const y = (f * (H - pad * 2) + pad).toFixed(1);
        return `<line x1="0" y1="${y}" x2="${W}" y2="${y}" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>`;
      }).join('') : '';

      const ttColor = this._palette?.textDim ?? 'rgba(255,255,255,0.28)';
      const zrFill  = this._palette?.rowHover ?? 'rgba(255,255,255,0.06)';

      const yLabels = yMin !== null ? `
        <div class="y-axis">
          <span class="y-label">${yMax.toFixed(1)} ${yUnit}</span>
          <span class="y-label">${yMin.toFixed(1)} ${yUnit}</span>
        </div>` : '<div class="y-axis"></div>';

      return `
        <div class="chart-layout">
          ${yLabels}
          <div class="chart-area">
            <svg class="chart-svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" style="height:${H}px">
              <defs>${defs.join('')}</defs>
              ${gridHTML}
              ${areas.join('')}
              ${lines.join('')}
              <line class="tt-line" x1="0" y1="0" x2="0" y2="${H}" stroke="${ttColor}" stroke-width="1" opacity="0" stroke-dasharray="3 3"/>
              <rect class="zr-rect" x="0" y="0" width="0" height="${H}" fill="${zrFill}" stroke="rgba(255,255,255,0.18)" stroke-width="1" opacity="0" rx="2"/>
            </svg>
            <div class="tooltip-box"></div>
          </div>
        </div>
        ${this._timeAxisHTML()}`;
    }

    _bindChartInteraction(chartArea, allEntityPoints) {
      if (!chartArea) return;
      const svg    = chartArea.querySelector('svg');
      const ttLine = svg?.querySelector('.tt-line');
      const zrRect = svg?.querySelector('.zr-rect');
      const ttBox  = chartArea.querySelector('.tooltip-box');
      if (!svg || !ttLine || !ttBox) return;

      const W = 400;
      let dragging  = false;
      let dragStart = 0;

      const pctOf = e => {
        const r = chartArea.getBoundingClientRect();
        return Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
      };

      chartArea.addEventListener('pointermove', e => {
        const pct  = pctOf(e);
        const svgX = (pct * W).toFixed(1);
        ttLine.setAttribute('x1', svgX);
        ttLine.setAttribute('x2', svgX);
        ttLine.setAttribute('opacity', '1');

        if (dragging && zrRect) {
          const minX = Math.min(dragStart, pct) * W;
          const wX   = Math.abs(pct - dragStart) * W;
          zrRect.setAttribute('x', minX.toFixed(1));
          zrRect.setAttribute('width', wX.toFixed(1));
        }
        if (!dragging) this._showTooltip(ttBox, pct, allEntityPoints);
      });

      chartArea.addEventListener('pointerleave', () => {
        ttLine.setAttribute('opacity', '0');
        ttBox.style.opacity = '0';
        if (!dragging && zrRect) zrRect.setAttribute('width', '0');
      });

      if (this._config.zoom === false) return;

      chartArea.addEventListener('pointerdown', e => {
        if (e.button !== 0) return;
        e.preventDefault();
        if (chartArea.setPointerCapture) chartArea.setPointerCapture(e.pointerId);
        dragStart = pctOf(e);
        dragging  = true;
        if (zrRect) {
          zrRect.setAttribute('x', (dragStart * W).toFixed(1));
          zrRect.setAttribute('width', '0');
          zrRect.setAttribute('opacity', '1');
        }
        ttBox.style.opacity = '0';
      });

      chartArea.addEventListener('pointerup', e => {
        if (!dragging) return;
        dragging = false;
        const endPct = pctOf(e);
        if (zrRect) { zrRect.setAttribute('opacity', '0'); zrRect.setAttribute('width', '0'); }
        const minPct = Math.min(dragStart, endPct);
        const maxPct = Math.max(dragStart, endPct);
        if (maxPct - minPct < 0.04) return;
        const [ws, we] = this._winRange();
        const dur = we - ws;
        this._zoomRange = { start: ws + minPct * dur, end: ws + maxPct * dur };
        this._refreshZoomBtn();
        this._updateGraphs();
      });

      chartArea.addEventListener('dblclick', () => {
        this._zoomRange = null;
        this._refreshZoomBtn();
        this._updateGraphs();
      });
    }

    _showTooltip(ttBox, pct, allEntityPoints) {
      if (!ttBox || !allEntityPoints.some(p => p?.length)) { ttBox.style.opacity = '0'; return; }
      const [ws, we] = this._winRange();
      const t = ws + pct * (we - ws);

      const rows = allEntityPoints.map((pts, i) => {
        if (!pts?.length) return null;
        let near = pts[0], minD = Infinity;
        for (const p of pts) { const d = Math.abs(p.t - t); if (d < minD) { minD = d; near = p; } }
        return { near, i };
      }).filter(Boolean);

      if (!rows.length) { ttBox.style.opacity = '0'; return; }

      const d   = new Date(t);
      const dur = we - ws;
      const lbl = dur <= 172800000
        ? d.getHours().toString().padStart(2,'0') + ':' + d.getMinutes().toString().padStart(2,'0')
        : d.toLocaleDateString([], { weekday: 'short', day: 'numeric', month: 'short' });

      const rowsHTML = rows.map(({ near, i }) => {
        const cfg  = this._entities[i];
        const col  = this._entityColor(i);
        const name = cfg.name || this._friendlyName(cfg.entity);
        const unit = this._hass?.states[cfg.entity]?.attributes?.unit_of_measurement ?? '';
        return `<div class="tt-row">
          <span class="tt-dot" style="background:${col}"></span>
          <span style="color:var(--text-muted);font-size:10px;max-width:80px;overflow:hidden;text-overflow:ellipsis">${name}</span>
          <span style="font-weight:600;margin-left:auto">${near.v.toFixed(1)} ${unit}</span>
        </div>`;
      }).join('');

      ttBox.innerHTML = `<div class="tt-time">${lbl}</div>${rowsHTML}`;
      ttBox.style.opacity = '1';
      ttBox.style.left = pct > 0.65
        ? `calc(${pct * 100}% - ${(ttBox.offsetWidth || 120) + 14}px)`
        : `calc(${pct * 100}% + 12px)`;
    }

    _renderHistoryTimeline(history) {
      const now   = Date.now();
      const start = now - this._hours * 3600000;
      const range = now - start;
      const valid = (history || []).filter(h => h.state !== 'unavailable' && h.state !== 'unknown');

      const segsHTML = valid.map((item, i) => {
        const tStart = Math.max(new Date(item.last_changed).getTime(), start);
        const tEnd   = i < valid.length - 1 ? new Date(valid[i + 1].last_changed).getTime() : now;
        if (tEnd <= start || tStart >= now) return '';
        const xPct = ((tStart - start) / range) * 100;
        const wPct = ((Math.min(tEnd, now) - tStart) / range) * 100;
        const cls  = this._isOnState(item.state) ? 'seg-on' : 'seg-off';
        return `<div class="seg ${cls}" style="left:${xPct.toFixed(2)}%;width:${Math.max(wPct, 0.3).toFixed(2)}%"></div>`;
      }).join('');

      if (!segsHTML.trim()) return `<div class="no-data">Nessun dato nel periodo selezionato</div>`;
      return `<div class="timeline-bar">${segsHTML}</div>${this._timeAxisHTML()}`;
    }

    _renderHistoryLineChart(history, entityId) {
      const now   = Date.now();
      const start = now - this._hours * 3600000;
      const points = (history || [])
        .filter(h => h.state !== 'unavailable' && h.state !== 'unknown' && !isNaN(parseFloat(h.state)))
        .map(h => ({ t: new Date(h.last_changed).getTime(), v: parseFloat(h.state) }))
        .filter(p => p.t >= start);

      if (points.length < 2) return `<div class="no-data">Nessun dato nel periodo selezionato</div>`;

      const W = 400, H = 60, pad = 4;
      const minV   = Math.min(...points.map(p => p.v));
      const maxV   = Math.max(...points.map(p => p.v));
      const rangeV = maxV - minV || 1;
      const rangeT = now - start;

      const toX = t => ((t - start) / rangeT * W).toFixed(1);
      const toY = v => (H - ((v - minV) / rangeV) * (H - pad * 2) - pad).toFixed(1);

      const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${toX(p.t)},${toY(p.v)}`).join(' ');
      const areaPath = `${linePath} L${toX(points[points.length - 1].t)},${H} L${toX(points[0].t)},${H} Z`;
      const gradId   = `wic-${this._uid}-${entityId.replace(/\W/g, '-')}`;
      const accent   = this._palette?.accent ?? '#D97757';

      return `
        <div class="linechart">
          <svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" style="width:100%;height:60px">
            <defs>
              <linearGradient id="${gradId}" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stop-color="${accent}" stop-opacity="0.38"/>
                <stop offset="100%" stop-color="${accent}" stop-opacity="0.02"/>
              </linearGradient>
            </defs>
            <path d="${areaPath}" fill="url(#${gradId})"/>
            <path d="${linePath}" fill="none" stroke="${accent}" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round"/>
          </svg>
        </div>
        ${this._timeAxisHTML()}`;
    }

    _timeAxisHTML() {
      const [ws, we] = this._mode === 'chart' ? this._winRange() : [Date.now() - this._hours * 3600000, Date.now()];
      const dur   = we - ws;
      const hours = dur / 3600000;
      const steps = hours <= 3 ? 3 : hours <= 24 ? 4 : 5;
      const labels = Array.from({ length: steps + 1 }, (_, i) => {
        const t = new Date(ws + (i / steps) * dur);
        return hours <= 48
          ? t.getHours().toString().padStart(2,'0') + ':' + t.getMinutes().toString().padStart(2,'0')
          : t.toLocaleDateString([], { weekday: 'short', day: 'numeric' });
      });
      return `<div class="time-axis">${labels.map(l => `<span>${l}</span>`).join('')}</div>`;
    }

    _isBinary(h) {
      if (!h?.length) return true;
      const valid = h.map(x => x.state).filter(s => s !== 'unavailable' && s !== 'unknown');
      return !valid.length || valid.some(s => isNaN(parseFloat(s)));
    }

    _isOnState(s) {
      return ['on', 'open', 'detected', 'unlocked', 'wet', 'active', 'home', 'playing'].includes(s);
    }

    _formatEntityState(obj) {
      if (!obj) return '—';
      const { state: s, attributes: a } = obj;
      if (s === 'unavailable') return 'N/D';
      if (s === 'unknown')     return '?';
      const num = parseFloat(s);
      if (!isNaN(num) && a?.unit_of_measurement) return `${num.toFixed(1)} ${a.unit_of_measurement}`;
      const map = { on: 'On', off: 'Off', open: 'Aperto', closed: 'Chiuso', detected: 'Rilevato', clear: 'Libero', locked: 'Bloccato', unlocked: 'Aperto' };
      return map[s] ?? s.charAt(0).toUpperCase() + s.slice(1);
    }

    _friendlyName(id) {
      if (!id) return '';
      return this._hass?.states[id]?.attributes?.friendly_name ?? (id.split('.')[1] || id).replace(/_/g, ' ');
    }

    _iconForEntity(entityId) {
      const domain = entityId?.split('.')[0] ?? '';
      const map = {
        light: 'mdi:lightbulb', switch: 'mdi:toggle-switch', sensor: 'mdi:chart-line',
        binary_sensor: 'mdi:motion-sensor', climate: 'mdi:thermometer', cover: 'mdi:garage',
        fan: 'mdi:fan', media_player: 'mdi:cast', input_boolean: 'mdi:toggle-switch',
      };
      return map[domain] ?? 'mdi:chart-line';
    }

    _binaryStat(h) {
      if (!h?.length) return '';
      const [ws, we] = this._mode === 'chart' ? this._winRange() : [Date.now() - this._hours * 3600000, Date.now()];
      const dur = we - ws;
      let on = 0;
      const valid = h.filter(x => x.state !== 'unavailable' && x.state !== 'unknown');
      for (let i = 0; i < valid.length; i++) {
        const t0 = Math.max(new Date(valid[i].last_changed).getTime(), ws);
        const t1 = i < valid.length - 1 ? new Date(valid[i + 1].last_changed).getTime() : we;
        if (this._isOnState(valid[i].state) && t1 > ws) on += Math.min(t1, we) - t0;
      }
      return `Attivo ${Math.round(on / dur * 100)}%`;
    }

    _numericStat(h, entityId) {
      if (!h?.length) return '';
      const vals = h
        .filter(x => x.state !== 'unavailable' && x.state !== 'unknown' && !isNaN(parseFloat(x.state)))
        .map(x => parseFloat(x.state));
      if (!vals.length) return '';
      const unit = this._hass?.states[entityId]?.attributes?.unit_of_measurement ?? '';
      return `${Math.min(...vals).toFixed(1)} – ${Math.max(...vals).toFixed(1)} ${unit}`.trim();
    }

    _updateChartState() {
      if (!this._hass || !this._card) return;
      this._entities.forEach((cfg, i) => {
        const el = this._q(`#ls-${i}`);
        if (el) el.textContent = this._formatEntityState(this._hass.states[cfg.entity]);
      });
    }

    _updateHistoryState() {
      if (!this._hass || !this._card) return;
      this._entities.forEach((cfg, i) => {
        const stateObj = this._hass.states[cfg.entity];
        const stateEl  = this._q(`#hstate-${i}`);
        const iconEl   = this._q(`#hicon-${i}`);
        if (!stateEl) return;
        if (!stateObj) {
          stateEl.textContent = 'N/D';
          stateEl.className   = 'hist-state';
          return;
        }
        const isOn = this._isOnState(stateObj.state);
        stateEl.textContent = this._formatEntityState(stateObj);
        stateEl.className   = `hist-state${isOn ? ' state-on' : ''}`;
        if (iconEl) iconEl.style.color = isOn ? 'var(--accent)' : '';
      });
    }

    // ── Shared State Update & Helpers ───────────────────────────────────────────

    _updateState() {
      if (!this._card) return;
      const mode = this._mode;
      if (mode === 'single')       this._updateSingleState();
      else if (mode === 'list')    this._updateListState();
      else if (mode === 'expand')  this._updateExpandState();
      else if (mode === 'chart')   this._updateChartState();
      else if (mode === 'history') this._updateHistoryState();
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
        title:               '',
        icon:                '',
        color:               '#D97757',
        theme:               'dark',
        show_brightness:     true,
        show_color_temp:     true,
        show_color:          true,
        collapse_when_off:   false,
        dynamic_light_color: false,
        show_footer:         true,
        hours:               24,
        height:              100,
        show_grid:           false,
        zoom:                true,
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
              <ha-icon icon="mdi:lightbulb" id="sec-entity-icon"></ha-icon>
              <span id="sec-entity-title">1. Entità & Identità</span>
            </div>
            <ha-icon class="chevron" icon="mdi:chevron-down"></ha-icon>
          </div>
          <div class="section-body">
            <!-- Blocco Single -->
            <div id="pane-single">
              <ha-form id="ha-single-form"></ha-form>
            </div>

            <!-- Blocco Multi (List / Expand / Chart / History) -->
            <div id="pane-multi" style="display:none; flex-direction:column; gap:16px">
              <ha-form id="ha-multi-header-form"></ha-form>
              <div>
                <div class="field-label" id="list-label">Elenco Entità Configurate</div>
                <div class="entity-list" id="entity-list"></div>
              </div>
              <div>
                <div class="field-label" id="add-label">➕ Aggiungi Entità alla Lista</div>
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

            <!-- Controlli per Grafici (Chart / History) -->
            <div id="controls-graph-only" style="display:none; flex-direction:column; gap:14px">
              <div>
                <div class="field-label">Intervallo Temporale Predefinito (hours)</div>
                <div class="theme-pills" style="grid-template-columns:repeat(4,1fr)">
                  ${HOURS_OPTIONS.map(h => `
                    <button type="button" class="theme-pill hours-pill" data-hours="${h}">${HOURS_LABELS[h]}</button>
                  `).join('')}
                </div>
              </div>

              <div id="controls-chart-only" style="display:none; flex-direction:column; gap:8px">
                <div>
                  <div class="field-label" style="display:flex;justify-content:space-between">
                    <span>Altezza Area Grafico (px)</span>
                    <span id="height-val-lbl" style="color:#D97757">100px</span>
                  </div>
                  <input type="range" id="chart-height-range" min="60" max="220" step="10" value="100" style="width:100%;accent-color:#D97757">
                </div>

                <div class="toggle-row">
                  <div class="toggle-info">
                    <span class="toggle-title">Mostra Griglia Orizzontale</span>
                    <span class="toggle-desc">Linee guida orizzontali dietro il grafico</span>
                  </div>
                  <label class="switch">
                    <input type="checkbox" data-toggle="show_grid">
                    <span class="slider-tog"></span>
                  </label>
                </div>

                <div class="toggle-row">
                  <div class="toggle-info">
                    <span class="toggle-title">Abilita Drag-to-Zoom</span>
                    <span class="toggle-desc">Seleziona un intervallo col mouse/touch per ingrandire</span>
                  </div>
                  <label class="switch">
                    <input type="checkbox" data-toggle="zoom">
                    <span class="slider-tog"></span>
                  </label>
                </div>
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

      // Mode switching with smart entity migration
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
                const prefix = (targetMode === 'chart' || targetMode === 'history') ? 'sensor.' : 'light.';
                let picks = Object.keys(this._hass.states).filter(k => k.startsWith(prefix)).slice(0, 2);
                if (!picks.length) picks = Object.keys(this._hass.states).filter(k => k.startsWith('light.')).slice(0, 2);
                if (picks.length) patch.entities = picks;
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
        multiHdrForm.computeLabel = (s) => s.name === 'title' ? 'Titolo Card' : 'Icona Header';
        multiHdrForm.addEventListener('value-changed', (ev) => {
          ev.stopPropagation();
          const v = ev.detail.value || {};
          this._updateConfig({ title: v.title || null, icon: v.icon || null });
        });
      }

      // Multi mode Add Entity HA Form
      const addForm = shadow.querySelector('#ha-add-entity-form');
      if (addForm) {
        addForm.computeLabel = () => 'Cerca e seleziona un\'entità da aggiungere';
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

      // Hours pills (Chart / History)
      shadow.querySelectorAll('.hours-pill').forEach(btn => {
        btn.addEventListener('click', () => {
          this._updateConfig({ hours: parseInt(btn.dataset.hours, 10) });
        });
      });

      // Chart height range
      const heightRange = shadow.querySelector('#chart-height-range');
      if (heightRange) {
        heightRange.addEventListener('input', (e) => {
          const lbl = shadow.querySelector('#height-val-lbl');
          if (lbl) lbl.textContent = `${e.target.value}px`;
        });
        heightRange.addEventListener('change', (e) => {
          this._updateConfig({ height: parseInt(e.target.value, 10) });
        });
      }

      // Theme pills (exclude .hours-pill)
      shadow.querySelectorAll('.theme-pill:not(.hours-pill)').forEach(btn => {
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
        listEl.innerHTML = `<div style="font-size:12px;color:var(--secondary-text-color,#A09080)">Nessuna entità nella lista. Seleziona un'entità qui sotto per aggiungerla.</div>`;
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
            <input type="text" class="mini-input" data-field="icon" data-idx="${idx}" placeholder="Icona (es. mdi:chart-line)" value="${item.icon || ''}">
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
      const shadow   = this.shadowRoot;
      const c        = this._config;
      const mode     = this._getActiveMode();
      const isSingle = mode === 'single';
      const isGraph  = mode === 'chart' || mode === 'history';
      const isChart  = mode === 'chart';

      // Sync Card Type Buttons
      shadow.querySelectorAll('.type-card-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.mode === mode);
      });

      // Toggle Single vs Multi vs Graph panes
      const paneSingle         = shadow.querySelector('#pane-single');
      const paneMulti          = shadow.querySelector('#pane-multi');
      const secEntityTitle     = shadow.querySelector('#sec-entity-title');
      const secEntityIcon      = shadow.querySelector('#sec-entity-icon');
      const rowDynColor        = shadow.querySelector('#row-dyn-color');
      const controlsSingleOnly = shadow.querySelector('#controls-single-only');
      const controlsGraphOnly  = shadow.querySelector('#controls-graph-only');
      const controlsChartOnly  = shadow.querySelector('#controls-chart-only');

      if (paneSingle) paneSingle.style.display = isSingle ? 'block' : 'none';
      if (paneMulti)  paneMulti.style.display  = isSingle ? 'none'  : 'flex';
      if (secEntityIcon) {
        secEntityIcon.setAttribute('icon', isGraph ? 'mdi:chart-areaspline' : 'mdi:lightbulb');
      }
      if (secEntityTitle) {
        const modeLabels = {
          single:  '1. Entità & Identità (Luce Singola)',
          list:    '1. Gruppo & Lista Luci (Lights)',
          expand:  '1. Gruppo & Lista Luci (Lights Expand)',
          chart:   '1. Titolo & Entità del Grafico (Chart)',
          history: '1. Titolo & Entità dello Storico (History)',
        };
        secEntityTitle.textContent = modeLabels[mode] || '1. Entità & Identità';
      }
      if (rowDynColor)        rowDynColor.style.display        = isSingle ? 'flex'  : 'none';
      if (controlsSingleOnly) controlsSingleOnly.style.display = isSingle ? 'block' : 'none';
      if (controlsGraphOnly)  controlsGraphOnly.style.display  = isGraph  ? 'flex'  : 'none';
      if (controlsChartOnly)  controlsChartOnly.style.display  = isChart  ? 'flex'  : 'none';

      // Sync Forms
      const singleForm = shadow.querySelector('#ha-single-form');
      if (singleForm) {
        if (this._hass) singleForm.hass = this._hass;
        singleForm.data = { entity: c.entity || '', name: c.name || '', icon: c.icon || '' };
      }

      const multiHdrForm = shadow.querySelector('#ha-multi-header-form');
      if (multiHdrForm) {
        if (this._hass) multiHdrForm.hass = this._hass;
        const defaultTitle = isChart ? 'Grafico' : mode === 'history' ? 'History' : 'Lights';
        multiHdrForm.data = { title: c.title || defaultTitle, icon: c.icon || '' };
      }

      const addForm = shadow.querySelector('#ha-add-entity-form');
      if (addForm) {
        if (this._hass) addForm.hass = this._hass;
        addForm.schema = [
          {
            name: 'new_entity',
            required: false,
            selector: isGraph ? { entity: {} } : { entity: { domain: 'light' } },
          },
        ];
      }

      if (!isSingle) this._renderEntityList();

      // Sync Graph Controls
      const curHours = Number(c.hours) || 24;
      shadow.querySelectorAll('.hours-pill').forEach(btn => {
        btn.classList.toggle('active', parseInt(btn.dataset.hours, 10) === curHours);
      });
      const heightRange = shadow.querySelector('#chart-height-range');
      const heightLbl   = shadow.querySelector('#height-val-lbl');
      const curHeight   = Number(c.height) || 100;
      if (heightRange) heightRange.value = curHeight;
      if (heightLbl)   heightLbl.textContent = `${curHeight}px`;

      // Sync Theme
      const curTheme = c.theme || 'dark';
      shadow.querySelectorAll('.theme-pill:not(.hours-pill)').forEach(btn => {
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
        const def = (key === 'collapse_when_off' || key === 'dynamic_light_color' || key === 'show_grid') ? false : true;
        chk.checked = c[key] !== undefined ? Boolean(c[key]) : def;
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
