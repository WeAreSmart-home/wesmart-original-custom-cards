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
 * Version: 1.3.0
 */

(() => {
  'use strict';

  const CARD_VERSION = '1.4.0-exp';

  const HOURS_OPTIONS = [1, 6, 24, 168];
  const HOURS_LABELS  = { 1: '1h', 6: '6h', 24: '24h', 168: '7d' };
  const HOURS_NAMES   = { 1: '1 ora', 6: '6 ore', 24: '24 ore', 168: '7 giorni' };

  const ENTITY_COLOR_SWATCHES = [
    '#D97757', '#3B82F6', '#10B981', '#F59E0B', '#EF4444',
    '#A855F7', '#EC4899', '#14B8A6', '#6366F1', '#84CC16',
  ];

  const BG_PRESET_COLORS = [
    { hex: '#141210', name: 'WeSmart Carbon (Dark)' },
    { hex: '#000000', name: 'Nero Puro (OLED)' },
    { hex: '#0F172A', name: 'Blu Notte (Slate)' },
    { hex: '#18181B', name: 'Grafite (Zinc)' },
    { hex: '#1C1917', name: 'Pietra Calda (Stone)' },
    { hex: '#1E293B', name: 'Ardesia Scuro' },
    { hex: '#FFFFFF', name: 'Bianco Puro (Light)' },
    { hex: '#F5F0EB', name: 'Crema Caldo (Light)' },
  ];

  // ─── Modular Card Type Registry (Extensible for Climate, Sensors, Doors, etc.) ─
  const CARD_TYPES = [
    { id: 'light',         mode: 'single',  category: 'Lights',   icon: 'mdi:lightbulb-on',         name: 'Light',         sub: '1 Luce · Slider completi' },
    { id: 'lights',        mode: 'list',    category: 'Lights',   icon: 'mdi:format-list-bulleted', name: 'Lights',        sub: 'Multi-luce · Toggle rapidi' },
    { id: 'lights-expand', mode: 'expand',  category: 'Lights',   icon: 'mdi:tune-vertical',        name: 'Lights Expand', sub: 'Multi-luce · Slider inline' },
    { id: 'button',        mode: 'button',  category: 'Controls', icon: 'mdi:gesture-tap-button',   name: 'Button Pad',    sub: 'Tasto Mixer 1x1 / 2x2 · LED' },
    { id: 'chart',         mode: 'chart',   category: 'Graphs',   icon: 'mdi:chart-areaspline',     name: 'Chart',         sub: 'Grafico Zoom & Tooltip' },
    { id: 'history',       mode: 'history', category: 'Graphs',   icon: 'mdi:chart-timeline',       name: 'History',       sub: 'Storico per ogni riga' },
  ];

  function resolveModeFromType(cardType) {
    if (!cardType) return null;
    const t = String(cardType).toLowerCase().trim();
    if (t === 'light' || t === 'single') return 'single';
    if (t === 'lights' || t === 'list') return 'list';
    if (t === 'lights-expand' || t === 'lights_expand' || t === 'expand') return 'expand';
    if (t === 'button' || t === 'pad' || t === 'switch') return 'button';
    if (t === 'chart' || t === 'graph') return 'chart';
    if (t === 'history') return 'history';
    return null;
  }

  function modeToCanonicalType(mode) {
    if (mode === 'list') return 'lights';
    if (mode === 'expand') return 'lights-expand';
    if (mode === 'button') return 'button';
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
    border: 1px solid var(--card-border, var(--border));
    border-radius: var(--radius);
    padding: 18px 18px 16px;
    position: relative;
    overflow: hidden;
    transition: var(--transition);
    box-shadow: var(--shadow);
    color: var(--text);
  }

  .card.no-border {
    border-color: transparent !important;
    box-shadow: none !important;
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
  .card.mode-single.no-bg::before { display: none; }

  @keyframes pulse-glow {
    0%, 100% { box-shadow: var(--shadow), 0 0 60px var(--accent-glow); }
    50%       { box-shadow: var(--shadow), 0 0 80px var(--accent-glow-strong); }
  }

  .card.mode-single.light-on:not(.no-border) {
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
  .chart-meta-bar {
    display: flex; align-items: center; justify-content: flex-end;
    gap: 8px; margin-bottom: 6px; flex-wrap: wrap;
  }
  .chart-meta-right { display: flex; align-items: center; gap: 6px; margin-left: auto; }
  .agg-pills {
    display: inline-flex; gap: 2px; background: var(--surface);
    border: 1px solid var(--border); border-radius: 8px; padding: 2px;
  }
  .agg-pill {
    padding: 2px 8px; border-radius: 6px; font-size: 10.5px; font-weight: 500;
    border: none; cursor: pointer; background: transparent;
    color: var(--text-muted); transition: var(--transition);
  }
  .agg-pill.active { background: var(--accent); color: #fff; }
  .agg-pill:not(.active):hover { background: var(--row-hover); color: var(--text); }
  .zoom-reset {
    display: none; padding: 3px 10px;
    background: var(--accent-soft); border: 1px solid var(--accent);
    border-radius: 8px; color: var(--accent); font-size: 10.5px; font-weight: 500;
    cursor: pointer; transition: var(--transition);
  }
  .zoom-reset.visible { display: inline-flex; align-items: center; gap: 4px; }
  .zoom-reset:hover { background: var(--accent); color: #fff; }
  .chart-layout { display: flex; gap: 6px; align-items: stretch; }
  .y-axis {
    width: 48px; flex-shrink: 0; display: flex; flex-direction: column;
    justify-content: space-between; padding: 2px 0 22px;
  }
  .y-label { font-size: 10px; color: var(--text-dim); text-align: right; line-height: 1; white-space: nowrap; }
  .y-label-mid { opacity: 0.72; }
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

  /* ── 6. Tactile Mixer Button / Pad Mode (mode-button) ── */
  .card.mode-button {
    padding: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    user-select: none;
    -webkit-user-select: none;
  }
  .card.mode-button.size-1x1 {
    width: 136px;
    height: 136px;
    max-width: 100%;
    aspect-ratio: 1 / 1;
    margin: 0 auto;
    border-radius: 22px;
  }
  .card.mode-button.size-2x2 {
    width: 220px;
    height: 220px;
    max-width: 100%;
    aspect-ratio: 1 / 1;
    margin: 0 auto;
    border-radius: 26px;
    padding: 12px;
  }
  .card.mode-button.size-full {
    width: 100%;
    min-height: 140px;
    border-radius: 22px;
  }
  .mixer-well {
    width: 100%;
    height: 100%;
    min-height: 112px;
    flex: 1;
    border-radius: 16px;
    padding: 4px;
    background: rgba(0, 0, 0, 0.38);
    box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.65), 0 1px 0 rgba(255, 255, 255, 0.05);
    display: flex;
  }
  .card.no-bg .mixer-well {
    background: rgba(0, 0, 0, 0.22);
  }
  .mixer-cap {
    position: relative;
    width: 100%;
    height: 100%;
    flex: 1;
    border-radius: 13px;
    background: linear-gradient(180deg, var(--surface) 0%, var(--bg) 100%);
    border: 1px solid rgba(255, 255, 255, 0.10);
    box-shadow:
      inset 0 1px 1px rgba(255, 255, 255, 0.16),
      inset 0 -3px 0 rgba(0, 0, 0, 0.45),
      0 4px 10px rgba(0, 0, 0, 0.42);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 14px 12px 12px;
    cursor: pointer;
    transition: transform 0.09s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.15s ease, border-color 0.2s ease, background 0.2s ease;
    -webkit-tap-highlight-color: transparent;
    overflow: hidden;
  }
  .mixer-cap::after {
    content: '';
    position: absolute;
    top: -20%;
    right: -20%;
    width: 75%;
    height: 75%;
    background: radial-gradient(circle, var(--accent-Glow, var(--accent-glow)) 0%, transparent 70%);
    opacity: 0;
    transition: opacity 0.25s ease;
    pointer-events: none;
  }
  .card.mode-button.btn-active .mixer-cap {
    border-color: var(--accent-border);
    box-shadow:
      inset 0 1px 2px rgba(255, 255, 255, 0.22),
      inset 0 -2px 0 rgba(0, 0, 0, 0.4),
      0 2px 12px var(--accent-glow);
  }
  .card.mode-button.btn-active .mixer-cap::after {
    opacity: 0.85;
  }
  .mixer-cap:active,
  .mixer-cap.pressing {
    transform: translateY(2.5px) scale(0.985);
    box-shadow:
      inset 0 2px 4px rgba(0, 0, 0, 0.45),
      inset 0 -1px 0 rgba(0, 0, 0, 0.3),
      0 1px 3px rgba(0, 0, 0, 0.35) !important;
  }

  /* Recessed Top-Right Corner LED */
  .mixer-led-bezel {
    position: absolute;
    top: 10px;
    right: 10px;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.55);
    border: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: inset 0 1.5px 3px rgba(0, 0, 0, 0.85);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;
  }
  .card.mode-button.size-2x2 .mixer-led-bezel {
    top: 14px;
    right: 14px;
    width: 17px;
    height: 17px;
  }
  .mixer-led {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.14);
    box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.5);
    transition: background 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
  }
  .card.mode-button.size-2x2 .mixer-led {
    width: 9px;
    height: 9px;
  }
  .card.mode-button.btn-active .mixer-led {
    background: var(--accent);
    box-shadow:
      0 0 6px var(--accent),
      0 0 14px var(--accent),
      0 0 22px var(--accent-glow-strong),
      inset 0 0 2.5px #ffffff;
    transform: scale(1.06);
  }

  /* Mixer Button Icon & Labels */
  .mixer-icon-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-muted);
    transition: color 0.22s ease, transform 0.22s ease, filter 0.22s ease;
    z-index: 1;
  }
  .mixer-icon-wrap ha-icon {
    --mdc-icon-size: 28px;
  }
  .card.mode-button.size-2x2 .mixer-icon-wrap ha-icon {
    --mdc-icon-size: 44px;
  }
  .card.mode-button.icon-only .mixer-icon-wrap ha-icon {
    --mdc-icon-size: 36px;
  }
  .card.mode-button.size-2x2.icon-only .mixer-icon-wrap ha-icon {
    --mdc-icon-size: 58px;
  }
  .card.mode-button.btn-active .mixer-icon-wrap {
    color: var(--accent);
    filter: drop-shadow(0 0 8px var(--accent-glow));
  }
  .mixer-texts {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    max-width: 100%;
    gap: 2px;
    z-index: 1;
  }
  .mixer-name {
    font-size: 12.5px;
    font-weight: 600;
    color: var(--text);
    line-height: 1.2;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  .card.mode-button.size-2x2 .mixer-name {
    font-size: 15px;
  }
  .card.mode-button.text-only .mixer-name {
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 0.01em;
  }
  .card.mode-button.size-2x2.text-only .mixer-name {
    font-size: 18px;
  }
  .mixer-state {
    font-size: 10.5px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--text-dim);
  }
  .card.mode-button.btn-active .mixer-state {
    color: var(--accent);
  }
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
      this._aggregation = 'raw';
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
        bg_color:            null,
        bg_opacity:          100,
        show_border:         true,
        show_brightness:     true,
        show_color_temp:     true,
        show_color:          true,
        collapse_when_off:   false,
        dynamic_light_color: false,
        show_footer:         true,
        button_size:         '1x1',
        show_icon:           true,
        show_name:           true,
        show_state:          true,
        tap_action:          'toggle',
        hold_action:         'more-info',
        tap_service:         '',
        hold_service:        '',
        hours:               24,
        height:              100,
        show_grid:           false,
        zoom:                true,
        aggregation:         'raw',
        entities:            [],
        ...config,
      };
      this._hours = Number(this._config.hours) || 24;
      this._aggregation = this._config.aggregation === 'avg' ? 'avg' : 'raw';
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
      if (m === 'button')  return this._config.button_size === '2x2' ? 3 : 2;
      if (m === 'single')  return 3;
      if (m === 'chart')   return 4 + Math.ceil(this._entities.length * 0.7);
      if (m === 'history') return 2 + Math.ceil(this._entities.length * 1.5);
      return 1 + Math.ceil((this._entities.length * 52 + 100) / 50);
    }

    getGridOptions() {
      if (this._mode === 'button') {
        const sz = this._config.button_size || '1x1';
        if (sz === '2x2') return { columns: 6, rows: 3, min_columns: 4, min_rows: 2 };
        if (sz === '1x1') return { columns: 3, rows: 2, min_columns: 2, min_rows: 2 };
      }
      return { columns: 12, min_columns: 6 };
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

      // Custom Style: bg_color, bg_opacity (0–100%), show_border
      const { h, s: bS, l: bL } = this._hexToHsl(baseColor);
      const c = this._clamp.bind(this);
      let bgH = h;
      let bgS = isDark ? c(Math.round(bS * 0.35), 25, 45) : c(Math.round(bS * 0.06), 4, 8);
      let bgL = isDark ? 11 : 99;
      let surfH = h;
      let surfS = isDark ? c(Math.round(bS * 0.28), 20, 38) : c(Math.round(bS * 0.10), 6, 12);
      let surfL = isDark ? 16 : 95;

      const customBgHex = typeof this._config.bg_color === 'string' ? this._config.bg_color.trim() : '';
      if (/^#[0-9A-Fa-f]{6}$/i.test(customBgHex)) {
        const customHsl = this._hexToHsl(customBgHex);
        bgH   = customHsl.h;
        bgS   = customHsl.s;
        bgL   = customHsl.l;
        surfH = customHsl.h;
        surfS = c(Math.round(customHsl.s * 0.85), 0, 100);
        surfL = customHsl.l < 50 ? c(customHsl.l + 6, 0, 100) : c(customHsl.l - 5, 0, 100);
      }

      const rawOp = (this._config.bg_opacity !== undefined && this._config.bg_opacity !== null)
        ? Number(this._config.bg_opacity)
        : 100;
      const bgOpacity = c(Number.isFinite(rawOp) ? rawOp : 100, 0, 100);
      const alpha     = bgOpacity / 100;
      const hasBorder = this._config.show_border !== false && bgOpacity > 0;

      let bgCss, surfaceCss, borderCss, cardBorderCss, shadowCss, trackOffCss;
      if (bgOpacity <= 0) {
        bgCss         = 'transparent';
        surfaceCss    = 'transparent';
        borderCss     = 'transparent';
        cardBorderCss = 'transparent';
        shadowCss     = 'none';
        trackOffCss   = isDark ? 'hsla(0,0%,100%,0.08)' : 'hsla(0,0%,0%,0.08)';
      } else {
        const aRound    = Number(alpha.toFixed(2));
        const surfAlpha = Number(Math.max(0.08, alpha * 0.88).toFixed(2));
        bgCss           = aRound >= 1 ? this._hsl(bgH, bgS, bgL) : this._hsla(bgH, bgS, bgL, aRound);
        surfaceCss      = aRound >= 1 ? this._hsl(surfH, surfS, surfL) : this._hsla(surfH, surfS, surfL, surfAlpha);
        trackOffCss     = surfaceCss;

        const baseBorderAlpha = isDark ? 0.08 : 0.12;
        const effBorderAlpha  = Number((baseBorderAlpha * alpha).toFixed(3));
        const aL              = isDark ? c(bL, 50, 65) : c(bL, 35, 52);
        borderCss             = isDark
          ? `hsla(0,0%,100%,${effBorderAlpha})`
          : `hsla(${h},${bS}%,${aL}%,${effBorderAlpha})`;
        cardBorderCss         = hasBorder ? borderCss : 'transparent';

        if (!hasBorder) {
          shadowCss = 'none';
        } else if (isDark) {
          shadowCss = `0 8px 32px ${this._hsla(h, bS, 5, Number((0.45 * alpha).toFixed(2)))}`;
        } else {
          shadowCss = `0 2px 16px ${this._hsla(h, bS, 5, Number((0.10 * alpha).toFixed(2)))}, 0 0 0 1px ${this._hsla(h, bS, 5, Number((0.06 * alpha).toFixed(2)))}`;
        }
      }

      s.setProperty('--accent',             act.accent);
      s.setProperty('--accent-soft',        act.accentSoft);
      s.setProperty('--accent-glow',        act.accentGlow);
      s.setProperty('--accent-glow-strong', act.accentGlowStrong);
      s.setProperty('--accent-border',      hasBorder ? act.accentBorder : 'transparent');
      s.setProperty('--bg',                 bgCss);
      s.setProperty('--surface',            surfaceCss);
      s.setProperty('--border',             borderCss);
      s.setProperty('--card-border',        cardBorderCss);
      s.setProperty('--text',               p.text);
      s.setProperty('--text-muted',         p.textMuted);
      s.setProperty('--text-dim',           p.textDim);
      s.setProperty('--track-off',          trackOffCss);
      s.setProperty('--thumb-off',          p.thumbOff);
      s.setProperty('--row-hover',          p.rowHover);
      s.setProperty('--row-active',         p.rowActive);
      s.setProperty('--overlay-bg',         p.overlayBg);
      s.setProperty('--shadow',             shadowCss);

      if (this._card) {
        this._card.classList.toggle('no-bg', bgOpacity <= 0);
        this._card.classList.toggle('no-border', !hasBorder);
      }

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
      const rawOp = (this._config.bg_opacity !== undefined && this._config.bg_opacity !== null)
        ? Number(this._config.bg_opacity)
        : 100;
      const bgOpacity = this._clamp(Number.isFinite(rawOp) ? rawOp : 100, 0, 100);
      const hasBorder = this._config.show_border !== false && bgOpacity > 0;
      const btnSizeCls = mode === 'button' ? ` size-${this._config.button_size || '1x1'}` : '';
      this._card = document.createElement('div');
      this._card.className = `card mode-${mode}${btnSizeCls}${bgOpacity <= 0 ? ' no-bg' : ''}${!hasBorder ? ' no-border' : ''}`;

      if (mode === 'single') {
        this._card.innerHTML = this._getSingleHTML();
        shadow.appendChild(this._card);
        this._bindSingleEvents();
      } else if (mode === 'button') {
        this._card.innerHTML = this._getButtonHTML();
        shadow.appendChild(this._card);
        this._bindButtonEvents();
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
      const custom = this._entities[i]?.color;
      if (custom && /^#[0-9A-Fa-f]{6}$/i.test(custom.trim())) {
        return custom.trim();
      }
      const baseColor = /^#[0-9A-Fa-f]{6}$/i.test(this._config.color) ? this._config.color : '#D97757';
      const { h, s } = this._hexToHsl(baseColor);
      const hue = (h + i * 137.508) % 360;
      const sat = this._clamp(s, 55, 82);
      const isDark = this._config.theme === 'auto'
        ? !window.matchMedia('(prefers-color-scheme: light)').matches
        : this._config.theme !== 'light';
      const lig = isDark ? 62 : 48;
      return this._hsl(hue, sat, lig);
    }

    _getBucketInfo(durMs = null) {
      const [ws, we] = this._mode === 'chart' ? this._winRange() : [Date.now() - this._hours * 3600000, Date.now()];
      const dur = durMs ?? (we - ws);
      const hours = dur / 3600000;
      if (hours <= 2)  return { ms: 5 * 60000,   label: '5m' };
      if (hours <= 8)  return { ms: 15 * 60000,  label: '15m' };
      if (hours <= 36) return { ms: 30 * 60000,  label: '30m' };
      return                  { ms: 180 * 60000, label: '3h' };
    }

    _getSubtitleText() {
      const period = HOURS_NAMES[this._hours] ?? `${this._hours}h`;
      const calc   = this._aggregation === 'avg'
        ? `Media (${this._getBucketInfo().label})`
        : 'Valori puntuali';
      return `Ultimi ${period} · ${calc}`;
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
          <span class="legend-dot" id="ldot-${i}" style="background:${color}"></span>
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
              <div class="header-sub" id="sub">${this._getSubtitleText()}</div>
            </div>
          </div>
          <div class="time-pills">${pillsHTML}</div>
        </div>
        <div class="separator"></div>
        <div class="chart-section">
          <div class="chart-meta-bar">
            <div class="chart-meta-right">
              <button class="zoom-reset" id="zreset">
                <ha-icon icon="mdi:magnify-minus-outline" style="--mdc-icon-size:13px"></ha-icon>
                <span>Reset zoom</span>
              </button>
              <div class="agg-pills">
                <button class="agg-pill${this._aggregation !== 'avg' ? ' active' : ''}" data-agg="raw" title="Mostra ogni singola variazione reale del sensore">Puntuali</button>
                <button class="agg-pill${this._aggregation === 'avg' ? ' active' : ''}" data-agg="avg" title="Mostra la media ponderata per intervallo di tempo">Media</button>
              </div>
            </div>
          </div>
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
        const customCol = (cfg.color && /^#[0-9A-Fa-f]{6}$/i.test(cfg.color.trim())) ? cfg.color.trim() : '';
        return `
          <div class="hist-row" data-index="${i}">
            <div class="hist-meta">
              <div class="hist-icon-wrap" style="${customCol ? `border-color:${customCol}55` : ''}">
                <ha-icon id="hicon-${i}" icon="${entIcon}" style="${customCol ? `color:${customCol}` : ''}"></ha-icon>
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
              <div class="header-sub" id="sub">${this._getSubtitleText()}</div>
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

    _syncCalcUI() {
      const sub = this._q('#sub');
      if (sub) sub.textContent = this._getSubtitleText();
      this._card?.querySelectorAll('.agg-pill').forEach(b => {
        b.classList.toggle('active', b.dataset.agg === this._aggregation);
      });
    }

    _bindChartEvents() {
      this._card.querySelectorAll('.time-pill').forEach(btn => {
        btn.addEventListener('click', e => {
          e.stopPropagation();
          this._hours = parseInt(btn.dataset.hours, 10);
          this._zoomRange = null;
          this._card.querySelectorAll('.time-pill').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this._syncCalcUI();
          this._refreshZoomBtn();
          this._fetchHistory();
        });
      });

      this._card.querySelectorAll('.agg-pill').forEach(btn => {
        btn.addEventListener('click', e => {
          e.stopPropagation();
          this._aggregation = btn.dataset.agg === 'avg' ? 'avg' : 'raw';
          this._syncCalcUI();
          this._updateGraphs();
        });
      });

      this._q('#zreset')?.addEventListener('click', () => {
        this._zoomRange = null;
        this._syncCalcUI();
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
          this._syncCalcUI();
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
      this._syncCalcUI();
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
          const pts = histories.map((h, i) => this._isBinary(h) ? [] : this._getSeriesPoints(h, this._entities[i]?.entity));
          this._bindChartInteraction(container.querySelector('.chart-area'), pts);
        }

        histories.forEach((h, i) => {
          const dot = this._q(`#ldot-${i}`);
          if (dot) dot.style.background = this._entityColor(i);
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
            container.innerHTML = this._renderHistoryTimeline(history, i);
            if (statEl) statEl.textContent = this._binaryStat(history);
          } else {
            container.innerHTML = this._renderHistoryLineChart(history, cfg.entity, i);
            if (statEl) statEl.textContent = this._numericStat(history, cfg.entity);
          }
        });
      }
    }

    /**
     * Extracts valid numeric points in [ws, we], anchoring the active state at ws
     * (if the entity already had a state at/before ws) and extending the last valid
     * state up to we so steady sensors never truncate midway across the chart.
     */
    _toRawPoints(history, entityId, wsOverride = null, weOverride = null) {
      const [ws, we] = (wsOverride !== null && weOverride !== null)
        ? [wsOverride, weOverride]
        : (this._mode === 'chart' ? this._winRange() : [Date.now() - this._hours * 3600000, Date.now()]);

      const all = (history || [])
        .filter(h => h.state !== 'unavailable' && h.state !== 'unknown' && !isNaN(parseFloat(h.state)))
        .map(h => ({ t: new Date(h.last_changed || h.last_updated).getTime(), v: parseFloat(h.state) }))
        .filter(p => !isNaN(p.t))
        .sort((a, b) => a.t - b.t);

      if (!all.length) {
        const curVal = parseFloat(this._hass?.states[entityId]?.state);
        if (!isNaN(curVal)) {
          return [{ t: ws, v: curVal }, { t: we, v: curVal }];
        }
        return [];
      }

      let beforeWs = null;
      for (const p of all) {
        if (p.t <= ws) beforeWs = p;
        else break;
      }

      const inside = all.filter(p => p.t > ws && p.t <= we);
      const pts = [];

      if (beforeWs) {
        pts.push({ t: ws, v: beforeWs.v });
      }
      for (const p of inside) {
        pts.push({ t: p.t, v: p.v });
      }

      if (pts.length > 0) {
        const last = pts[pts.length - 1];
        if (last.t < we) {
          pts.push({ t: we, v: last.v });
        } else if (pts.length === 1) {
          pts.unshift({ t: Math.max(ws, last.t - 60000), v: last.v });
        }
      }

      return pts;
    }

    _timeWeightedAvg(rawPts, tA, tB) {
      if (!rawPts?.length) return null;
      let weightedSum = 0;
      let totalDur = 0;
      for (let i = 0; i < rawPts.length - 1; i++) {
        const p0 = rawPts[i];
        const p1 = rawPts[i + 1];
        const s0 = Math.max(tA, p0.t);
        const s1 = Math.min(tB, p1.t);
        if (s1 > s0) {
          const dt = s1 - s0;
          weightedSum += p0.v * dt;
          totalDur += dt;
        }
      }
      if (totalDur > 0) return weightedSum / totalDur;
      let near = rawPts[0], minD = Infinity;
      const mid = (tA + tB) / 2;
      for (const p of rawPts) {
        const d = Math.abs(p.t - mid);
        if (d < minD) { minD = d; near = p; }
      }
      return near.v;
    }

    _getSeriesPoints(history, entityId, wsOverride = null, weOverride = null) {
      const raw = this._toRawPoints(history, entityId, wsOverride, weOverride);
      if (this._aggregation !== 'avg' || raw.length < 2) return raw;

      const tStart = raw[0].t;
      const tEnd   = raw[raw.length - 1].t;
      const span   = tEnd - tStart;
      if (span <= 0) return raw;

      const [ws, we] = (wsOverride !== null && weOverride !== null)
        ? [wsOverride, weOverride]
        : (this._mode === 'chart' ? this._winRange() : [Date.now() - this._hours * 3600000, Date.now()]);
      const { ms: bucketMs } = this._getBucketInfo(we - ws);

      const buckets = [];
      let cur = tStart;
      while (cur < tEnd) {
        const next = Math.min(cur + bucketMs, tEnd);
        const avg  = this._timeWeightedAvg(raw, cur, next);
        if (avg !== null) {
          const tPoint = cur === tStart ? tStart : (next === tEnd ? tEnd : Math.round((cur + next) / 2));
          buckets.push({ t: tPoint, v: avg });
        }
        cur = next;
      }

      if (buckets.length === 1) {
        buckets.push({ t: tEnd, v: buckets[0].v });
      } else if (buckets.length > 1 && buckets[buckets.length - 1].t < tEnd) {
        buckets.push({ t: tEnd, v: buckets[buckets.length - 1].v });
      }

      return buckets.length >= 2 ? buckets : raw;
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
      const pad = 6;
      const uid = this._uid;
      const [ws, we] = this._winRange();
      const rangeT = we - ws;

      const toX = t => ((t - ws) / rangeT * W).toFixed(1);
      const toY = (v, minV, rv) => (H - ((v - minV) / rv) * (H - pad * 2) - pad).toFixed(1);

      const seriesList = [];
      histories.forEach((h, i) => {
        if (this._isBinary(h)) return;
        const entityId = this._entities[i]?.entity;
        const pts = this._getSeriesPoints(h, entityId, ws, we);
        if (pts.length < 2) return;
        seriesList.push({ pts, i, entityId });
      });

      if (!seriesList.length) {
        return `<div class="no-data">Nessun dato nel periodo selezionato</div>`;
      }

      // Unified Shared Y-Axis across all visible numeric series
      const allVals     = seriesList.flatMap(s => s.pts.map(p => p.v));
      const globalMin   = Math.min(...allVals);
      const globalMax   = Math.max(...allVals);
      const globalRange = (globalMax - globalMin) || 1;
      const yUnit       = this._hass?.states[seriesList[0].entityId]?.attributes?.unit_of_measurement ?? '';

      const defs  = [];
      const areas = [];
      const lines = [];

      seriesList.forEach(({ pts, i }) => {
        const color   = this._entityColor(i);
        const linePts = pts.map((p, j) => `${j === 0 ? 'M' : 'L'}${toX(p.t)},${toY(p.v, globalMin, globalRange)}`).join(' ');
        const areaPts = `${linePts} L${toX(pts[pts.length - 1].t)},${H} L${toX(pts[0].t)},${H} Z`;
        const gid     = `wicg-${uid}-${i}`;

        defs.push(`<linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stop-color="${color}" stop-opacity="0.32"/>
          <stop offset="100%" stop-color="${color}" stop-opacity="0.02"/>
        </linearGradient>`);
        areas.push(`<path d="${areaPts}" fill="url(#${gid})"/>`);
        lines.push(`<path d="${linePts}" fill="none" stroke="${color}" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/>`);
      });

      const gridHTML = this._config.show_grid ? [0.25, 0.5, 0.75].map(f => {
        const y = (f * (H - pad * 2) + pad).toFixed(1);
        return `<line x1="0" y1="${y}" x2="${W}" y2="${y}" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>`;
      }).join('') : '';

      const ttColor = this._palette?.textDim ?? 'rgba(255,255,255,0.28)';
      const zrFill  = this._palette?.rowHover ?? 'rgba(255,255,255,0.06)';

      const globalMid = (globalMax + globalMin) / 2;
      const yLabels = `
        <div class="y-axis">
          <span class="y-label">${globalMax.toFixed(1)} ${yUnit}</span>
          <span class="y-label y-label-mid">${globalMid.toFixed(1)} ${yUnit}</span>
          <span class="y-label">${globalMin.toFixed(1)} ${yUnit}</span>
        </div>`;

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
        if (t < pts[0].t - 60000 || t > pts[pts.length - 1].t + 60000) return null;
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
      const modeTag = this._aggregation === 'avg' ? `Media ${this._getBucketInfo(dur).label}` : 'Puntuale';

      const rowsHTML = rows.map(({ near, i }) => {
        const cfg  = this._entities[i];
        const col  = this._entityColor(i);
        const name = cfg.name || this._friendlyName(cfg.entity);
        const unit = this._hass?.states[cfg.entity]?.attributes?.unit_of_measurement ?? '';
        return `<div class="tt-row">
          <span class="tt-dot" style="background:${col}"></span>
          <span style="color:var(--text-muted);font-size:10px;max-width:85px;overflow:hidden;text-overflow:ellipsis">${name}</span>
          <span style="font-weight:600;margin-left:auto">${near.v.toFixed(1)} ${unit}</span>
        </div>`;
      }).join('');

      ttBox.innerHTML = `<div class="tt-time">${lbl} · ${modeTag}</div>${rowsHTML}`;
      ttBox.style.opacity = '1';
      ttBox.style.left = pct > 0.65
        ? `calc(${pct * 100}% - ${(ttBox.offsetWidth || 120) + 14}px)`
        : `calc(${pct * 100}% + 12px)`;
    }

    _renderHistoryTimeline(history, idx = 0) {
      const now   = Date.now();
      const start = now - this._hours * 3600000;
      const range = now - start;
      const valid = (history || []).filter(h => h.state !== 'unavailable' && h.state !== 'unknown');
      const customCol = this._entities[idx]?.color;
      const barColor  = (customCol && /^#[0-9A-Fa-f]{6}$/i.test(customCol.trim())) ? customCol.trim() : '';

      const segsHTML = valid.map((item, i) => {
        const tStart = Math.max(new Date(item.last_changed).getTime(), start);
        const tEnd   = i < valid.length - 1 ? new Date(valid[i + 1].last_changed).getTime() : now;
        if (tEnd <= start || tStart >= now) return '';
        const xPct = ((tStart - start) / range) * 100;
        const wPct = ((Math.min(tEnd, now) - tStart) / range) * 100;
        const isOn = this._isOnState(item.state);
        const cls  = isOn ? 'seg-on' : 'seg-off';
        const colStyle = (isOn && barColor) ? `;background:${barColor}` : '';
        return `<div class="seg ${cls}" style="left:${xPct.toFixed(2)}%;width:${Math.max(wPct, 0.3).toFixed(2)}%${colStyle}"></div>`;
      }).join('');

      if (!segsHTML.trim()) return `<div class="no-data">Nessun dato nel periodo selezionato</div>`;
      return `<div class="timeline-bar">${segsHTML}</div>${this._timeAxisHTML()}`;
    }

    _renderHistoryLineChart(history, entityId, idx = 0) {
      const now    = Date.now();
      const start  = now - this._hours * 3600000;
      const points = this._getSeriesPoints(history, entityId, start, now);

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
      const gradId   = `wic-${this._uid}-${idx}-${entityId.replace(/\W/g, '-')}`;
      const customCol = this._entities[idx]?.color;
      const accent   = (customCol && /^#[0-9A-Fa-f]{6}$/i.test(customCol.trim()))
        ? customCol.trim()
        : (this._palette?.accent ?? '#D97757');

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
      const raw = this._toRawPoints(h, entityId);
      if (!raw.length) return '';
      const vals = raw.map(p => p.v);
      const minV = Math.min(...vals);
      const maxV = Math.max(...vals);
      const avgV = this._timeWeightedAvg(raw, raw[0].t, raw[raw.length - 1].t)
        ?? (vals.reduce((a, b) => a + b, 0) / vals.length);
      const unit = this._hass?.states[entityId]?.attributes?.unit_of_measurement ?? '';
      return `Media ${avgV.toFixed(1)}${unit ? ' ' + unit : ''} · ${minV.toFixed(1)}–${maxV.toFixed(1)} ${unit}`.trim();
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

    // ── 6. BUTTON PAD / TACTILE MIXER MODE HTML & LOGIC ─────────────────────────

    _getButtonHTML() {
      const showIcon  = this._config.show_icon !== false;
      const showName  = this._config.show_name !== false;
      const showState = this._config.show_state !== false;
      return `
        <div class="mixer-well">
          <div class="mixer-cap" id="mixer-cap">
            <div class="mixer-led-bezel" title="Stato">
              <div class="mixer-led" id="mixer-led"></div>
            </div>
            <div class="mixer-icon-wrap" id="mixer-icon-wrap" style="${showIcon ? '' : 'display:none'}">
              <ha-icon id="mixer-icon" icon="mdi:power"></ha-icon>
            </div>
            <div class="mixer-texts" id="mixer-texts" style="${(showName || showState) ? '' : 'display:none'}">
              <div class="mixer-name" id="mixer-name" style="${showName ? '' : 'display:none'}">—</div>
              <div class="mixer-state" id="mixer-state" style="${showState ? '' : 'display:none'}">—</div>
            </div>
          </div>
        </div>
        <div class="unavailable-overlay" id="unavailable-overlay" style="display:none">
          <ha-icon icon="mdi:lan-disconnect"></ha-icon>
          <span>N/D</span>
        </div>
      `;
    }

    _updateButtonState() {
      if (!this._card) return;
      const c = this._config;
      const entityId = c.entity || (this._entities[0]?.entity ?? '');
      const showIcon  = c.show_icon !== false;
      const showName  = c.show_name !== false;
      const showState = c.show_state !== false;

      this._card.classList.toggle('icon-only', showIcon && !showName && !showState);
      this._card.classList.toggle('text-only', !showIcon && (showName || showState));

      const iconWrap = this._q('#mixer-icon-wrap');
      const iconEl   = this._q('#mixer-icon');
      const textsEl  = this._q('#mixer-texts');
      const nameEl   = this._q('#mixer-name');
      const stateEl  = this._q('#mixer-state');
      const unavail  = this._q('#unavailable-overlay');

      if (iconWrap) iconWrap.style.display = showIcon ? 'flex' : 'none';
      if (textsEl)  textsEl.style.display  = (showName || showState) ? 'flex' : 'none';
      if (nameEl)   nameEl.style.display   = showName ? '-webkit-box' : 'none';
      if (stateEl)  stateEl.style.display  = showState ? 'block' : 'none';

      if (!entityId) {
        if (nameEl)  nameEl.textContent  = c.name || 'Tasto Mixer';
        if (stateEl) stateEl.textContent = 'Scegli entità';
        if (iconEl)  iconEl.setAttribute('icon', c.icon || 'mdi:gesture-tap-button');
        this._card.classList.remove('btn-active');
        return;
      }

      const stateObj = this._hass?.states?.[entityId];
      if (!stateObj) {
        if (nameEl)  nameEl.textContent  = c.name || entityId;
        if (stateEl) stateEl.textContent = 'Non trovata';
        if (iconEl)  iconEl.setAttribute('icon', c.icon || this._iconForEntity(entityId));
        return;
      }

      const domain    = entityId.split('.')[0];
      const attrs     = stateObj.attributes || {};
      const isUnavail = stateObj.state === 'unavailable';
      const isStateless = domain === 'scene' || domain === 'button' || domain === 'input_button';
      const isOn      = Boolean(this._flashActive) || (!isStateless && this._isOnState(stateObj.state));

      if (c.dynamic_light_color && isOn && Array.isArray(attrs.rgb_color) && attrs.rgb_color.length === 3) {
        this._applyPalette(this._rgbToHex(...attrs.rgb_color));
      } else {
        this._applyPalette(null);
      }

      this._card.classList.toggle('btn-active', isOn && !isUnavail);
      if (unavail) unavail.style.display = isUnavail ? 'flex' : 'none';

      const name = c.name || attrs.friendly_name || this._friendlyName(entityId);
      if (nameEl) nameEl.textContent = name;

      let defaultIcon = attrs.icon || this._iconForEntity(entityId);
      if (domain === 'light') defaultIcon = isOn ? 'mdi:lightbulb' : 'mdi:lightbulb-outline';
      else if (domain === 'scene') defaultIcon = 'mdi:palette-outline';
      else if (domain === 'script') defaultIcon = 'mdi:script-text-play-outline';
      else if (domain === 'switch' || domain === 'input_boolean') defaultIcon = isOn ? 'mdi:toggle-switch' : 'mdi:toggle-switch-off-outline';
      if (iconEl) iconEl.setAttribute('icon', c.icon || defaultIcon);

      if (stateEl) {
        if (isUnavail) {
          stateEl.textContent = 'N/D';
        } else if (domain === 'scene') {
          stateEl.textContent = this._flashActive ? 'Attivata' : 'Scena';
        } else if (domain === 'script') {
          stateEl.textContent = (isOn || this._flashActive) ? 'In esecuzione' : 'Script';
        } else if (domain === 'button' || domain === 'input_button') {
          stateEl.textContent = this._flashActive ? 'Premuto' : 'Premi';
        } else if (domain === 'light' && isOn && attrs.brightness != null) {
          stateEl.textContent = `ON · ${Math.round(attrs.brightness / 2.55)}%`;
        } else {
          stateEl.textContent = isOn ? 'ON' : (stateObj.state === 'off' ? 'OFF' : this._formatEntityState(stateObj));
        }
      }
    }

    _bindButtonEvents() {
      const cap = this._q('#mixer-cap');
      if (!cap) return;

      let holdTimer = null;
      let held      = false;

      const clearHold = () => {
        if (holdTimer) {
          clearTimeout(holdTimer);
          holdTimer = null;
        }
        cap.classList.remove('pressing');
      };

      cap.addEventListener('pointerdown', (e) => {
        if (e.button !== undefined && e.button !== 0) return;
        held = false;
        cap.classList.add('pressing');
        holdTimer = setTimeout(() => {
          held = true;
          cap.classList.remove('pressing');
          this._executeButtonAction('hold');
        }, 520);
      });

      cap.addEventListener('pointerup', () => {
        const wasHeld = held;
        clearHold();
        if (!wasHeld) {
          this._executeButtonAction('tap');
        }
      });

      cap.addEventListener('pointerleave', clearHold);
      cap.addEventListener('pointercancel', clearHold);
      cap.addEventListener('contextmenu', (e) => e.preventDefault());
    }

    _triggerMomentaryLed() {
      this._flashActive = true;
      this._updateButtonState();
      if (this._flashTimer) clearTimeout(this._flashTimer);
      this._flashTimer = setTimeout(() => {
        this._flashActive = false;
        this._updateButtonState();
      }, 1400);
    }

    _executeButtonAction(which) {
      if (!this._hass) return;
      const c = this._config;
      const entityId = c.entity || (this._entities[0]?.entity ?? '');
      const action   = which === 'hold' ? (c.hold_action || 'more-info') : (c.tap_action || 'toggle');

      if (action === 'none') return;

      if (action === 'more-info') {
        if (!entityId) return;
        const ev = new Event('hass-more-info', { bubbles: true, composed: true });
        ev.detail = { entityId };
        this.dispatchEvent(ev);
        return;
      }

      if (action === 'call-service') {
        const srvRaw = (which === 'hold' ? c.hold_service : c.tap_service) || '';
        const [srvDomain, srvName] = srvRaw.trim().split('.');
        if (srvDomain && srvName) {
          const payload = entityId ? { entity_id: entityId } : {};
          this._hass.callService(srvDomain, srvName, payload);
          this._triggerMomentaryLed();
        }
        return;
      }

      if (!entityId) return;
      const domain = entityId.split('.')[0];

      if (domain === 'scene') {
        this._hass.callService('scene', 'turn_on', { entity_id: entityId });
        this._triggerMomentaryLed();
        return;
      }
      if (domain === 'button' || domain === 'input_button') {
        this._hass.callService(domain, 'press', { entity_id: entityId });
        this._triggerMomentaryLed();
        return;
      }
      if (domain === 'script') {
        const srv = action === 'turn_off' ? 'turn_off' : 'turn_on';
        this._hass.callService('script', srv, { entity_id: entityId });
        this._triggerMomentaryLed();
        return;
      }

      if (action === 'turn_on') {
        this._hass.callService('homeassistant', 'turn_on', { entity_id: entityId });
      } else if (action === 'turn_off') {
        this._hass.callService('homeassistant', 'turn_off', { entity_id: entityId });
      } else {
        this._hass.callService('homeassistant', 'toggle', { entity_id: entityId });
      }
    }

    // ── Shared State Update & Helpers ───────────────────────────────────────────

    _updateState() {
      if (!this._card) return;
      const mode = this._mode;
      if (mode === 'single')       this._updateSingleState();
      else if (mode === 'button')  this._updateButtonState();
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
    .entity-color-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; border: 1px solid rgba(255,255,255,0.25); }
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
    .entity-color-picker {
      grid-column: 1 / -1; display: flex; flex-direction: column; gap: 6px;
      padding-top: 4px; border-top: 1px solid rgba(255,255,255,0.06);
    }
    .entity-color-header {
      display: flex; align-items: center; justify-content: space-between;
      font-size: 11px; color: var(--secondary-text-color, #A09080); font-weight: 600;
    }
    .entity-color-status { font-family: monospace; color: var(--primary-text-color, #F5F0EB); font-weight: 500; }
    .entity-color-controls { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
    .entity-auto-btn {
      height: 26px; padding: 0 10px; border-radius: 6px;
      border: 1px solid rgba(255,255,255,0.16); background: rgba(0,0,0,0.2);
      color: var(--primary-text-color, #F5F0EB); font-size: 11px; font-weight: 600; cursor: pointer;
    }
    .entity-auto-btn.active { border-color: #D97757; background: rgba(217, 119, 87, 0.2); color: #D97757; }
    .entity-swatch {
      width: 22px; height: 22px; border-radius: 50%; border: 2px solid transparent;
      cursor: pointer; padding: 0; transition: transform 0.15s ease;
    }
    .entity-swatch.active { border-color: #fff; box-shadow: 0 0 0 2px #D97757; transform: scale(1.12); }
    .entity-color-native {
      width: 28px; height: 26px; padding: 1px; border-radius: 6px;
      border: 1px solid rgba(255,255,255,0.16); background: transparent; cursor: pointer;
    }
    .entity-color-hex { width: 84px; height: 26px; font-family: monospace; font-size: 11.5px; }
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
    .editor-select {
      width: 100%; height: 38px; padding: 0 12px; border-radius: 10px;
      border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.14));
      background: rgba(0, 0, 0, 0.22); color: var(--primary-text-color, #F5F0EB);
      font-size: 13px; font-weight: 500; cursor: pointer; outline: none;
    }
    .editor-select:focus { border-color: #D97757; }
    .editor-select option { background: #1C1917; color: #F5F0EB; }
  `;

  class WeSmartCardEditor extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this._config = {};
      this._hass = null;
      this._rendered = false;
      this._openSections = { entity: true, theme: true, style: true, controls: true };
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
        bg_color:            null,
        bg_opacity:          100,
        show_border:         true,
        show_brightness:     true,
        show_color_temp:     true,
        show_color:          true,
        collapse_when_off:   false,
        dynamic_light_color: false,
        show_footer:         true,
        button_size:         '1x1',
        show_icon:           true,
        show_name:           true,
        show_state:          true,
        tap_action:          'toggle',
        hold_action:         'more-info',
        tap_service:         '',
        hold_service:        '',
        hours:               24,
        height:              100,
        show_grid:           false,
        zoom:                true,
        aggregation:         'raw',
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
            <ha-icon icon="mdi:view-dashboard-edit-outline" style="color:#D97757"></ha-icon>
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
                <div class="field-label" id="add-label">Aggiungi Entità alla Lista</div>
                <ha-form id="ha-add-entity-form"></ha-form>
              </div>
            </div>
          </div>
        </div>

        <!-- 2. Aspetto, Stile & InfiniteColor -->
        <div class="section open" id="sec-theme">
          <div class="section-header" data-sec="theme">
            <div class="section-title">
              <ha-icon icon="mdi:palette"></ha-icon>
              <span>2. Aspetto, Stile & Motore InfiniteColor</span>
            </div>
            <ha-icon class="chevron" icon="mdi:chevron-down"></ha-icon>
          </div>
          <div class="section-body">
            <div>
              <div class="field-label">Tema Superficie</div>
              <div class="theme-pills">
                <button type="button" class="theme-pill" data-theme="dark"><ha-icon icon="mdi:weather-night" style="--mdc-icon-size:16px"></ha-icon><span>Dark</span></button>
                <button type="button" class="theme-pill" data-theme="light"><ha-icon icon="mdi:white-balance-sunny" style="--mdc-icon-size:16px"></ha-icon><span>Light</span></button>
                <button type="button" class="theme-pill" data-theme="auto"><ha-icon icon="mdi:theme-light-dark" style="--mdc-icon-size:16px"></ha-icon><span>Auto</span></button>
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

            <div style="border-top:1px solid rgba(255,255,255,0.1);padding-top:14px;display:flex;flex-direction:column;gap:14px">
              <div style="display:flex;align-items:center;gap:8px;font-size:13px;font-weight:700;color:#D97757">
                <ha-icon icon="mdi:brush-variant" style="--mdc-icon-size:18px;color:#D97757"></ha-icon>
                <span>STILE CARD: SFONDO, OPACITÀ & BORDI</span>
              </div>

              <div>
                <div class="field-label" style="display:flex;justify-content:space-between;align-items:center">
                  <span>Colore di Sfondo Card (bg_color)</span>
                  <span id="bg-color-status" style="color:#D97757;text-transform:none;font-family:monospace">Default Tema</span>
                </div>
                <div class="swatches-grid" style="margin-bottom:8px">
                  <button type="button" class="entity-auto-btn active" id="bg-auto-btn" title="Usa lo sfondo automatico del tema InfiniteColor">Auto (Default)</button>
                  ${BG_PRESET_COLORS.map(p => `
                    <button type="button" class="swatch-btn bg-swatch-btn" data-bg-hex="${p.hex}" title="${p.name} (${p.hex})" style="background:${p.hex};border-color:rgba(255,255,255,0.22)"></button>
                  `).join('')}
                </div>
                <div class="custom-color-row">
                  <input type="color" class="color-input-native" id="bg-color-native" value="#141210" title="Scegli colore di sfondo personalizzato">
                  <input type="text" class="color-input-hex" id="bg-color-hex" maxlength="7" placeholder="Default tema (es. #0F172A)">
                </div>
              </div>

              <div>
                <div class="field-label" style="display:flex;justify-content:space-between;align-items:center">
                  <span>Opacità Sfondo Card (bg_opacity)</span>
                  <span id="bg-opacity-lbl" style="color:#D97757;text-transform:none">100% (Solido)</span>
                </div>
                <input type="range" id="bg-opacity-range" min="0" max="100" step="1" value="100" style="width:100%;accent-color:#D97757;margin-bottom:8px">
                <div class="theme-pills" style="grid-template-columns:repeat(5,1fr)">
                  <button type="button" class="theme-pill op-preset-pill" data-op="100" style="padding:7px 6px;font-size:12px">100%</button>
                  <button type="button" class="theme-pill op-preset-pill" data-op="75"  style="padding:7px 6px;font-size:12px">75%</button>
                  <button type="button" class="theme-pill op-preset-pill" data-op="50"  style="padding:7px 6px;font-size:12px">50%</button>
                  <button type="button" class="theme-pill op-preset-pill" data-op="25"  style="padding:7px 6px;font-size:12px">25%</button>
                  <button type="button" class="theme-pill op-preset-pill" data-op="0"   style="padding:7px 6px;font-size:12px" title="Trasparenza totale senza sfondo né bordi">0% Invisibile</button>
                </div>
              </div>

              <div class="toggle-row" id="row-show-border">
                <div class="toggle-info">
                  <span class="toggle-title">Mostra Bordi e Ombra Card</span>
                  <span class="toggle-desc" id="desc-show-border">Disattiva per rimuovere contorno e ombra (a opacità 0% vengono rimossi automaticamente)</span>
                </div>
                <label class="switch">
                  <input type="checkbox" data-toggle="show_border">
                  <span class="slider-tog"></span>
                </label>
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

            <!-- Controlli per Button Pad (Tasto Fisico Mixer) -->
            <div id="controls-button-only" style="display:none; flex-direction:column; gap:14px">
              <div>
                <div class="field-label">Formato & Dimensione Tasto (button_size)</div>
                <div class="theme-pills" style="grid-template-columns:repeat(3,1fr)">
                  <button type="button" class="theme-pill btn-size-pill" data-bsize="1x1" title="Quadrato Compatto 136x136px">
                    <ha-icon icon="mdi:crop-square" style="--mdc-icon-size:16px"></ha-icon>
                    <span>1x1 Pad</span>
                  </button>
                  <button type="button" class="theme-pill btn-size-pill" data-bsize="2x2" title="Quadrato Grande Studio 220x220px">
                    <ha-icon icon="mdi:vector-square" style="--mdc-icon-size:16px"></ha-icon>
                    <span>2x2 Grande</span>
                  </button>
                  <button type="button" class="theme-pill btn-size-pill" data-bsize="full" title="Tutta larghezza colonna">
                    <ha-icon icon="mdi:arrow-expand-horizontal" style="--mdc-icon-size:16px"></ha-icon>
                    <span>Full Width</span>
                  </button>
                </div>
              </div>

              <div>
                <div class="field-label">Azione Pressione Breve (tap_action)</div>
                <select class="editor-select" id="tap-action-select">
                  <option value="toggle">Toggle (Accendi / Spegni / Attiva Scena)</option>
                  <option value="more-info">More Info (Apri Dettagli Entità)</option>
                  <option value="turn_on">Turn On (Forza Accensione / Attivazione)</option>
                  <option value="turn_off">Turn Off (Forza Spegnimento)</option>
                  <option value="call-service">Call Service (Servizio Personalizzato)</option>
                  <option value="none">Nessuna Azione (Disabilitato)</option>
                </select>
                <div id="tap-service-row" style="display:none; margin-top:8px">
                  <input type="text" class="mini-input" id="tap-service-input" style="width:100%;height:34px" placeholder="es. scene.turn_on oppure script.cinema">
                </div>
              </div>

              <div>
                <div class="field-label">Azione Pressione Prolungata (hold_action)</div>
                <select class="editor-select" id="hold-action-select">
                  <option value="more-info">More Info (Apri Dettagli Entità)</option>
                  <option value="toggle">Toggle (Accendi / Spegni / Attiva Scena)</option>
                  <option value="turn_on">Turn On (Forza Accensione / Attivazione)</option>
                  <option value="turn_off">Turn Off (Forza Spegnimento)</option>
                  <option value="call-service">Call Service (Servizio Personalizzato)</option>
                  <option value="none">Nessuna Azione (Disabilitato)</option>
                </select>
                <div id="hold-service-row" style="display:none; margin-top:8px">
                  <input type="text" class="mini-input" id="hold-service-input" style="width:100%;height:34px" placeholder="es. light.turn_off oppure script.buonanotte">
                </div>
              </div>

              <div class="toggle-row">
                <div class="toggle-info">
                  <span class="toggle-title">Mostra Icona sul Tasto</span>
                  <span class="toggle-desc">Nascondi per avere un tasto solo testuale</span>
                </div>
                <label class="switch">
                  <input type="checkbox" data-toggle="show_icon">
                  <span class="slider-tog"></span>
                </label>
              </div>

              <div class="toggle-row">
                <div class="toggle-info">
                  <span class="toggle-title">Mostra Nome / Testo sul Tasto</span>
                  <span class="toggle-desc">Nascondi per avere un pad minimale con sola icona centrale e LED</span>
                </div>
                <label class="switch">
                  <input type="checkbox" data-toggle="show_name">
                  <span class="slider-tog"></span>
                </label>
              </div>

              <div class="toggle-row">
                <div class="toggle-info">
                  <span class="toggle-title">Mostra Riga Stato (ON / OFF / % / Scena)</span>
                  <span class="toggle-desc">Mostra il pallino e lo stato sotto al nome</span>
                </div>
                <label class="switch">
                  <input type="checkbox" data-toggle="show_state">
                  <span class="slider-tog"></span>
                </label>
              </div>
            </div>

            <!-- Controlli per Grafici (Chart / History) -->
            <div id="controls-graph-only" style="display:none; flex-direction:column; gap:14px">
              <div>
                <div class="field-label">Calcolo Valori Grafico (aggregation)</div>
                <div class="theme-pills" style="grid-template-columns:repeat(2,1fr)">
                  <button type="button" class="theme-pill agg-editor-pill" data-agg="raw">
                    <ha-icon icon="mdi:pulse" style="--mdc-icon-size:16px"></ha-icon>
                    <span>Valori Puntuali (Raw)</span>
                  </button>
                  <button type="button" class="theme-pill agg-editor-pill" data-agg="avg">
                    <ha-icon icon="mdi:function-variant" style="--mdc-icon-size:16px"></ha-icon>
                    <span>Media Ponderata (Avg)</span>
                  </button>
                </div>
              </div>

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

            <div class="toggle-row" id="row-show-footer">
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

          if (targetMode === 'single' || targetMode === 'button') {
            if (!this._config.entity) {
              const list = this._getNormalizedEntities();
              if (list.length > 0) {
                patch.entity = list[0].entity;
              } else if (this._hass) {
                const first = Object.keys(this._hass.states).find(k =>
                  targetMode === 'button'
                    ? (k.startsWith('light.') || k.startsWith('switch.') || k.startsWith('scene.') || k.startsWith('script.'))
                    : k.startsWith('light.')
                );
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

      // Single / Button mode HA Form
      const singleForm = shadow.querySelector('#ha-single-form');
      if (singleForm) {
        singleForm.computeLabel = (s) => ({
          entity: this._getActiveMode() === 'button'
            ? 'Entità Tasto (Luce, Scena, Switch, Script, ecc.)'
            : 'Entità Luce (light.*)',
          name:   'Nome / Etichetta Personalizzata (opzionale)',
          icon:   'Icona Personalizzata (opzionale)',
        }[s.name] || s.name);
        singleForm.addEventListener('value-changed', (ev) => {
          ev.stopPropagation();
          const v = ev.detail.value || {};
          this._updateConfig({ entity: v.entity || '', name: v.name || null, icon: v.icon || null });
        });
      }

      // Button Pad controls (button_size, tap_action, hold_action, services)
      shadow.querySelectorAll('.btn-size-pill').forEach(btn => {
        btn.addEventListener('click', () => {
          this._updateConfig({ button_size: btn.dataset.bsize });
        });
      });

      const tapSelect = shadow.querySelector('#tap-action-select');
      if (tapSelect) {
        tapSelect.addEventListener('change', (e) => {
          this._updateConfig({ tap_action: e.target.value });
        });
      }
      const tapSrvInput = shadow.querySelector('#tap-service-input');
      if (tapSrvInput) {
        tapSrvInput.addEventListener('change', (e) => {
          this._updateConfig({ tap_service: e.target.value.trim() || null });
        });
      }

      const holdSelect = shadow.querySelector('#hold-action-select');
      if (holdSelect) {
        holdSelect.addEventListener('change', (e) => {
          this._updateConfig({ hold_action: e.target.value });
        });
      }
      const holdSrvInput = shadow.querySelector('#hold-service-input');
      if (holdSrvInput) {
        holdSrvInput.addEventListener('change', (e) => {
          this._updateConfig({ hold_service: e.target.value.trim() || null });
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

      // Aggregation pills (Chart / History)
      shadow.querySelectorAll('.agg-editor-pill').forEach(btn => {
        btn.addEventListener('click', () => {
          this._updateConfig({ aggregation: btn.dataset.agg });
        });
      });

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

      // Theme pills (exclude .hours-pill, .agg-editor-pill, .op-preset-pill, .btn-size-pill)
      shadow.querySelectorAll('.theme-pill:not(.hours-pill):not(.agg-editor-pill):not(.op-preset-pill):not(.btn-size-pill)').forEach(btn => {
        btn.addEventListener('click', () => this._updateConfig({ theme: btn.dataset.theme }));
      });

      // Swatches (Accent color only, exclude .bg-swatch-btn)
      shadow.querySelectorAll('.swatch-btn:not(.bg-swatch-btn)').forEach(btn => {
        btn.addEventListener('click', () => this._updateConfig({ color: btn.dataset.hex }));
      });

      // Custom Accent Color
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

      // Style: Background Color (bg_color)
      const bgAutoBtn     = shadow.querySelector('#bg-auto-btn');
      const bgColorNative = shadow.querySelector('#bg-color-native');
      const bgColorHex    = shadow.querySelector('#bg-color-hex');
      if (bgAutoBtn) {
        bgAutoBtn.addEventListener('click', () => this._updateConfig({ bg_color: null }));
      }
      shadow.querySelectorAll('.bg-swatch-btn').forEach(btn => {
        btn.addEventListener('click', () => this._updateConfig({ bg_color: btn.dataset.bgHex.toUpperCase() }));
      });
      if (bgColorNative) {
        bgColorNative.addEventListener('input', (e) => this._updateConfig({ bg_color: e.target.value.toUpperCase() }));
      }
      if (bgColorHex) {
        bgColorHex.addEventListener('change', (e) => {
          let val = e.target.value.trim();
          if (!val) {
            this._updateConfig({ bg_color: null });
            return;
          }
          if (!val.startsWith('#')) val = '#' + val;
          if (/^#[0-9A-Fa-f]{6}$/.test(val)) this._updateConfig({ bg_color: val.toUpperCase() });
        });
      }

      // Style: Background Opacity (bg_opacity)
      const bgOpacityRange = shadow.querySelector('#bg-opacity-range');
      if (bgOpacityRange) {
        bgOpacityRange.addEventListener('input', (e) => {
          const val = parseInt(e.target.value, 10);
          const lbl = shadow.querySelector('#bg-opacity-lbl');
          if (lbl) {
            lbl.textContent = val === 0
              ? '0% (Trasparente · Senza bordi)'
              : val === 100
                ? '100% (Solido)'
                : `${val}%`;
          }
          this._updateConfig({ bg_opacity: val });
        });
      }
      shadow.querySelectorAll('.op-preset-pill').forEach(btn => {
        btn.addEventListener('click', () => {
          const val = parseInt(btn.dataset.op, 10);
          this._updateConfig({ bg_opacity: val });
        });
      });

      // Boolean toggles
      shadow.querySelectorAll('input[data-toggle]').forEach(chk => {
        chk.addEventListener('change', (e) => {
          this._updateConfig({ [chk.dataset.toggle]: e.target.checked });
        });
      });
    }

    _computeAutoEntityColor(idx) {
      const baseHex = /^#[0-9A-Fa-f]{6}$/i.test(this._config.color) ? this._config.color : '#D97757';
      let r = parseInt(baseHex.slice(1, 3), 16) / 255;
      let g = parseInt(baseHex.slice(3, 5), 16) / 255;
      let b = parseInt(baseHex.slice(5, 7), 16) / 255;
      const max = Math.max(r, g, b), min = Math.min(r, g, b);
      let h = 0, s = 0, l = (max + min) / 2;
      if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
          case g: h = ((b - r) / d + 2) / 6; break;
          case b: h = ((r - g) / d + 4) / 6; break;
        }
      }
      const hue = Math.round((h * 360 + idx * 137.508) % 360);
      const sat = Math.max(55, Math.min(82, Math.round(s * 100)));
      const isDark = this._config.theme === 'auto'
        ? !window.matchMedia('(prefers-color-scheme: light)').matches
        : this._config.theme !== 'light';
      const lig = isDark ? 62 : 48;
      return `hsl(${hue},${sat}%,${lig}%)`;
    }

    _renderEntityList() {
      const listEl = this.shadowRoot.querySelector('#entity-list');
      if (!listEl) return;
      const items = this._getNormalizedEntities();

      if (!items.length) {
        listEl.innerHTML = `<div style="font-size:12px;color:var(--secondary-text-color,#A09080)">Nessuna entità nella lista. Seleziona un'entità qui sotto per aggiungerla.</div>`;
        return;
      }

      listEl.innerHTML = items.map((item, idx) => {
        const hasCustomColor = Boolean(item.color && /^#[0-9A-Fa-f]{6}$/i.test(item.color.trim()));
        const customHex      = hasCustomColor ? item.color.trim().toUpperCase() : '';
        const previewColor   = hasCustomColor ? customHex : this._computeAutoEntityColor(idx);

        return `
        <div class="entity-item ${this._expandedRow === idx ? 'expanded' : ''}" data-idx="${idx}">
          <div class="entity-item-top">
            <span class="entity-color-dot" style="background:${previewColor}" title="${hasCustomColor ? 'Colore personalizzato: ' + customHex : 'Colore automatico'}"></span>
            <span class="entity-item-label">${item.name ? `${item.name} (${item.entity})` : item.entity}</span>
            <div class="entity-item-actions">
              <button type="button" class="icon-btn" data-act="up" data-idx="${idx}" title="Sposta su"><ha-icon icon="mdi:arrow-up" style="--mdc-icon-size:15px"></ha-icon></button>
              <button type="button" class="icon-btn" data-act="down" data-idx="${idx}" title="Sposta giù"><ha-icon icon="mdi:arrow-down" style="--mdc-icon-size:15px"></ha-icon></button>
              <button type="button" class="icon-btn" data-act="edit" data-idx="${idx}" title="Personalizza nome, icona e colore"><ha-icon icon="mdi:tune" style="--mdc-icon-size:15px"></ha-icon></button>
              <button type="button" class="icon-btn" data-act="del" data-idx="${idx}" title="Rimuovi"><ha-icon icon="mdi:close" style="--mdc-icon-size:15px"></ha-icon></button>
            </div>
          </div>
          <div class="entity-item-details">
            <input type="text" class="mini-input" data-field="name" data-idx="${idx}" placeholder="Nome custom" value="${item.name || ''}">
            <input type="text" class="mini-input" data-field="icon" data-idx="${idx}" placeholder="Icona (es. mdi:chart-line)" value="${item.icon || ''}">
            <div class="entity-color-picker">
              <div class="entity-color-header">
                <span>Colore Entità (Grafico / Storico)</span>
                <span class="entity-color-status">${hasCustomColor ? customHex : 'Automatico'}</span>
              </div>
              <div class="entity-color-controls">
                <button type="button" class="entity-auto-btn ${!hasCustomColor ? 'active' : ''}" data-color-auto="${idx}" title="Usa il colore calcolato in automatico">Auto</button>
                ${ENTITY_COLOR_SWATCHES.map(hex => `
                  <button type="button" class="entity-swatch ${hasCustomColor && customHex === hex ? 'active' : ''}" data-color-swatch="${hex}" data-idx="${idx}" style="background:${hex}" title="${hex}"></button>
                `).join('')}
                <input type="color" class="entity-color-native" data-color-native="${idx}" value="${hasCustomColor ? customHex : '#D97757'}" title="Scegli colore personalizzato">
                <input type="text" class="mini-input entity-color-hex" data-field="color" data-idx="${idx}" maxlength="7" placeholder="#RRGGBB" value="${customHex}">
              </div>
            </div>
          </div>
        </div>`;
      }).join('');

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

      listEl.querySelectorAll('[data-color-auto]').forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = parseInt(btn.dataset.colorAuto, 10);
          const arr = this._getNormalizedEntities();
          if (arr[idx]) {
            delete arr[idx].color;
            this._updateConfig({ entities: arr });
          }
        });
      });

      listEl.querySelectorAll('[data-color-swatch]').forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = parseInt(btn.dataset.idx, 10);
          const hex = btn.dataset.colorSwatch;
          const arr = this._getNormalizedEntities();
          if (arr[idx] && hex) {
            arr[idx].color = hex.toUpperCase();
            this._updateConfig({ entities: arr });
          }
        });
      });

      listEl.querySelectorAll('[data-color-native]').forEach(inp => {
        inp.addEventListener('input', (e) => {
          const idx = parseInt(inp.dataset.colorNative, 10);
          const arr = this._getNormalizedEntities();
          if (arr[idx]) {
            arr[idx].color = e.target.value.toUpperCase();
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
            let val = inp.value.trim();
            if (field === 'color' && val) {
              if (!val.startsWith('#')) val = '#' + val;
              if (!/^#[0-9A-Fa-f]{6}$/.test(val)) return;
              val = val.toUpperCase();
            }
            if (val) arr[idx][field] = val;
            else delete arr[idx][field];
            this._updateConfig({ entities: arr });
          }
        });
      });
    }

    _syncUI() {
      if (!this._rendered) return;
      const shadow        = this.shadowRoot;
      const c             = this._config;
      const mode          = this._getActiveMode();
      const isSingle      = mode === 'single';
      const isButton      = mode === 'button';
      const isSingleOrBtn = isSingle || isButton;
      const isGraph       = mode === 'chart' || mode === 'history';
      const isChart       = mode === 'chart';

      // Sync Card Type Buttons
      shadow.querySelectorAll('.type-card-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.mode === mode);
      });

      // Toggle Single vs Multi vs Graph vs Button panes
      const paneSingle         = shadow.querySelector('#pane-single');
      const paneMulti          = shadow.querySelector('#pane-multi');
      const secEntityTitle     = shadow.querySelector('#sec-entity-title');
      const secEntityIcon      = shadow.querySelector('#sec-entity-icon');
      const rowDynColor        = shadow.querySelector('#row-dyn-color');
      const controlsSingleOnly = shadow.querySelector('#controls-single-only');
      const controlsButtonOnly = shadow.querySelector('#controls-button-only');
      const controlsGraphOnly  = shadow.querySelector('#controls-graph-only');
      const controlsChartOnly  = shadow.querySelector('#controls-chart-only');
      const rowShowFooter      = shadow.querySelector('#row-show-footer');

      if (paneSingle) paneSingle.style.display = isSingleOrBtn ? 'block' : 'none';
      if (paneMulti)  paneMulti.style.display  = isSingleOrBtn ? 'none'  : 'flex';
      if (secEntityIcon) {
        const iconMap = {
          single:  'mdi:lightbulb',
          button:  'mdi:gesture-tap-button',
          chart:   'mdi:chart-areaspline',
          history: 'mdi:chart-timeline',
        };
        secEntityIcon.setAttribute('icon', iconMap[mode] || 'mdi:lightbulb-group');
      }
      if (secEntityTitle) {
        const modeLabels = {
          single:  '1. Entità & Identità (Luce Singola)',
          button:  '1. Entità & Etichetta Tasto (Button Pad)',
          list:    '1. Gruppo & Lista Luci (Lights)',
          expand:  '1. Gruppo & Lista Luci (Lights Expand)',
          chart:   '1. Titolo & Entità del Grafico (Chart)',
          history: '1. Titolo & Entità dello Storico (History)',
        };
        secEntityTitle.textContent = modeLabels[mode] || '1. Entità & Identità';
      }
      if (rowDynColor)        rowDynColor.style.display        = isSingleOrBtn ? 'flex'  : 'none';
      if (controlsSingleOnly) controlsSingleOnly.style.display = isSingle      ? 'block' : 'none';
      if (controlsButtonOnly) controlsButtonOnly.style.display = isButton      ? 'flex'  : 'none';
      if (controlsGraphOnly)  controlsGraphOnly.style.display  = isGraph       ? 'flex'  : 'none';
      if (controlsChartOnly)  controlsChartOnly.style.display  = isChart       ? 'flex'  : 'none';
      if (rowShowFooter)      rowShowFooter.style.display      = isButton      ? 'none'  : 'flex';

      // Sync Forms
      const singleForm = shadow.querySelector('#ha-single-form');
      if (singleForm) {
        if (this._hass) singleForm.hass = this._hass;
        singleForm.schema = [
          {
            name: 'entity',
            required: true,
            selector: isButton ? { entity: {} } : { entity: { domain: 'light' } },
          },
          { name: 'name', required: false, selector: { text: {} } },
          {
            name: 'icon',
            required: false,
            selector: { icon: { placeholder: isButton ? 'mdi:gesture-tap-button' : 'mdi:lightbulb' } },
          },
        ];
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

      if (!isSingleOrBtn) this._renderEntityList();

      // Sync Button Pad Controls
      const curBtnSize = ['1x1', '2x2', 'full'].includes(c.button_size) ? c.button_size : '1x1';
      shadow.querySelectorAll('.btn-size-pill').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.bsize === curBtnSize);
      });
      const tapSelect    = shadow.querySelector('#tap-action-select');
      const tapSrvRow    = shadow.querySelector('#tap-service-row');
      const tapSrvInput  = shadow.querySelector('#tap-service-input');
      const curTapAction = c.tap_action || 'toggle';
      if (tapSelect)   tapSelect.value = curTapAction;
      if (tapSrvRow)   tapSrvRow.style.display = curTapAction === 'call-service' ? 'block' : 'none';
      if (tapSrvInput) tapSrvInput.value = c.tap_service || '';

      const holdSelect    = shadow.querySelector('#hold-action-select');
      const holdSrvRow    = shadow.querySelector('#hold-service-row');
      const holdSrvInput  = shadow.querySelector('#hold-service-input');
      const curHoldAction = c.hold_action || 'more-info';
      if (holdSelect)   holdSelect.value = curHoldAction;
      if (holdSrvRow)   holdSrvRow.style.display = curHoldAction === 'call-service' ? 'block' : 'none';
      if (holdSrvInput) holdSrvInput.value = c.hold_service || '';

      // Sync Graph Controls
      const curAgg = c.aggregation === 'avg' ? 'avg' : 'raw';
      shadow.querySelectorAll('.agg-editor-pill').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.agg === curAgg);
      });
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
      shadow.querySelectorAll('.theme-pill:not(.hours-pill):not(.agg-editor-pill):not(.op-preset-pill):not(.btn-size-pill)').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.theme === curTheme);
      });

      // Sync Accent Color
      const curColor = (c.color || '#D97757').toUpperCase();
      shadow.querySelectorAll('.swatch-btn:not(.bg-swatch-btn)').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.hex.toUpperCase() === curColor);
      });
      const colorNative = shadow.querySelector('#color-native');
      const colorHex    = shadow.querySelector('#color-hex');
      if (colorNative && /^#[0-9A-Fa-f]{6}$/.test(curColor)) colorNative.value = curColor;
      if (colorHex) colorHex.value = curColor;

      // Sync Style: Background Color (bg_color) & Opacity (bg_opacity)
      const rawBgColor = typeof c.bg_color === 'string' && /^#[0-9A-Fa-f]{6}$/i.test(c.bg_color.trim())
        ? c.bg_color.trim().toUpperCase()
        : '';
      const bgAutoBtn     = shadow.querySelector('#bg-auto-btn');
      const bgColorStatus = shadow.querySelector('#bg-color-status');
      const bgColorNative = shadow.querySelector('#bg-color-native');
      const bgColorHex    = shadow.querySelector('#bg-color-hex');
      if (bgAutoBtn)     bgAutoBtn.classList.toggle('active', !rawBgColor);
      if (bgColorStatus) bgColorStatus.textContent = rawBgColor || 'Default Tema';
      shadow.querySelectorAll('.bg-swatch-btn').forEach(btn => {
        btn.classList.toggle('active', Boolean(rawBgColor) && btn.dataset.bgHex.toUpperCase() === rawBgColor);
      });
      if (bgColorNative) bgColorNative.value = rawBgColor || (curTheme === 'light' ? '#FFFFFF' : '#141210');
      if (bgColorHex)    bgColorHex.value    = rawBgColor;

      const rawOp = (c.bg_opacity !== undefined && c.bg_opacity !== null) ? Number(c.bg_opacity) : 100;
      const curOp = Number.isFinite(rawOp) ? Math.max(0, Math.min(100, Math.round(rawOp))) : 100;
      const bgOpRange = shadow.querySelector('#bg-opacity-range');
      const bgOpLbl   = shadow.querySelector('#bg-opacity-lbl');
      if (bgOpRange) bgOpRange.value = curOp;
      if (bgOpLbl) {
        bgOpLbl.textContent = curOp === 0
          ? '0% (Trasparente · Senza bordi)'
          : curOp === 100
            ? '100% (Solido)'
            : `${curOp}%`;
      }
      shadow.querySelectorAll('.op-preset-pill').forEach(btn => {
        btn.classList.toggle('active', parseInt(btn.dataset.op, 10) === curOp);
      });

      // Sync Toggles
      shadow.querySelectorAll('input[data-toggle]').forEach(chk => {
        const key = chk.dataset.toggle;
        const def = (key === 'collapse_when_off' || key === 'dynamic_light_color' || key === 'show_grid') ? false : true;
        if (key === 'show_border' && curOp === 0) {
          chk.checked  = false;
          chk.disabled = true;
        } else {
          chk.disabled = false;
          chk.checked  = c[key] !== undefined ? Boolean(c[key]) : def;
        }
      });
    }

    _updateConfig(patch) {
      const next = { ...this._config, ...patch };
      if (!next.name) delete next.name;
      if (!next.icon) delete next.icon;
      if (!next.bg_color) delete next.bg_color;
      if (!next.tap_service) delete next.tap_service;
      if (!next.hold_service) delete next.hold_service;
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

  const safeDefine = (tag, cls) => {
    const existing = customElements.get(tag);
    if (!existing) {
      customElements.define(tag, cls);
    } else {
      Object.getOwnPropertyNames(cls.prototype).forEach(k => {
        if (k !== 'constructor') {
          const desc = Object.getOwnPropertyDescriptor(cls.prototype, k);
          if (desc) Object.defineProperty(existing.prototype, k, desc);
        }
      });
      Object.getOwnPropertyNames(cls).forEach(k => {
        if (k !== 'length' && k !== 'name' && k !== 'prototype') {
          const desc = Object.getOwnPropertyDescriptor(cls, k);
          if (desc) Object.defineProperty(existing, k, desc);
        }
      });
    }
  };

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
