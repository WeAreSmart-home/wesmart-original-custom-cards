/**
 * wesmart-infinite-chart-card.js v0.1.0
 * WeSmart InfiniteColor — Chart Card for Home Assistant
 * Single or multi-entity chart: line/area + timeline bars, drag-to-zoom, tooltip, time range pills.
 * Full palette generated from a single base color via the Infinite Color Engine.
 *
 * YAML tag: wesmart-infinite-chart-card
 *
 * @version 0.1.0
 */
(() => {
  'use strict';

  const CARD_VERSION  = '0.1.0';
  const CARD_TAG      = 'wesmart-chart-card';
  const EDITOR_TAG    = 'wesmart-chart-card-editor';

  const HOURS_OPTIONS = [1, 6, 24, 168];
  const HOURS_LABELS  = { 1: '1h', 6: '6h', 24: '24h', 168: '7d' };
  const HOURS_NAMES   = { 1: '1 ora', 6: '6 ore', 24: '24 ore', 168: '7 giorni' };

  // ─── CSS ──────────────────────────────────────────────────────────────────────
  // All color values come from CSS custom properties set dynamically on :host
  // via _applyPalette(). No hardcoded palette here.
  const CSS = `
    :host {
      display: block;
      font-family: -apple-system, 'Söhne', 'Inter', BlinkMacSystemFont, 'Segoe UI', sans-serif;
      --claude-radius:    20px;
      --claude-radius-sm: 12px;
      --transition:       all 0.25s cubic-bezier(0.4,0,0.2,1);
    }
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    /* ── Card shell ────────────────────────────────────────────────── */
    .card {
      background:    var(--bg);
      border-radius: var(--claude-radius);
      border:        1px solid var(--border);
      box-shadow:    var(--shadow);
      overflow:      hidden;
      position:      relative;
    }

    /* ── Loader bar ────────────────────────────────────────────────── */
    .loader {
      position: absolute; top: 0; left: 0; right: 0;
      height:   2px;
      background: linear-gradient(90deg, transparent, var(--accent), transparent);
      opacity: 0; transition: opacity 0.3s;
    }
    .loader.active { opacity: 1; }

    /* ── Header ────────────────────────────────────────────────────── */
    .header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 18px 20px 14px; gap: 12px; flex-wrap: wrap;
    }
    .header-left { display: flex; align-items: center; gap: 12px; }
    .header-icon-wrap {
      width: 40px; height: 40px;
      background: var(--accent-soft); border-radius: var(--claude-radius-sm);
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .header-icon-wrap ha-icon { --mdc-icon-size: 20px; color: var(--accent); }
    .header-title    { font-size: 15px; font-weight: 600; color: var(--text); letter-spacing: -0.2px; }
    .header-subtitle { font-size: 12px; color: var(--text-muted); margin-top: 2px; }

    /* ── Time pills ────────────────────────────────────────────────── */
    .time-pills {
      display: flex; gap: 3px;
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--claude-radius-sm); padding: 3px;
    }
    .time-pill {
      padding: 4px 12px; border-radius: 8px; font-size: 12px; font-weight: 500;
      border: none; cursor: pointer; background: transparent;
      color: var(--text-muted); transition: var(--transition);
    }
    .time-pill.active { background: var(--accent); color: #fff; }
    .time-pill:not(.active):hover { background: var(--pill-bg); color: var(--text); }

    /* ── Separator ─────────────────────────────────────────────────── */
    .separator { height: 1px; background: var(--border); margin: 0 20px; }

    /* ── Chart section ─────────────────────────────────────────────── */
    .chart-section { padding: 12px 20px 10px; }
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
    .agg-pill:not(.active):hover { background: var(--pill-bg); color: var(--text); }

    /* ── Zoom reset button ─────────────────────────────────────────── */
    .zoom-reset {
      display: none;
      padding: 3px 10px;
      background: var(--accent-soft); border: 1px solid var(--accent);
      border-radius: 8px; color: var(--accent); font-size: 10.5px; font-weight: 500;
      cursor: pointer; transition: var(--transition);
    }
    .zoom-reset.visible { display: inline-flex; align-items: center; gap: 4px; }
    .zoom-reset:hover   { background: var(--accent); color: #fff; }

    /* ── Chart layout ──────────────────────────────────────────────── */
    .chart-layout { display: flex; gap: 6px; align-items: stretch; }

    .y-axis {
      width: 48px; flex-shrink: 0;
      display: flex; flex-direction: column; justify-content: space-between;
      padding: 2px 0 22px;
    }
    .y-label { font-size: 10px; color: var(--text-dim); text-align: right; line-height: 1; white-space: nowrap; }
    .y-label-mid { opacity: 0.72; }

    /* ── Chart area (interaction target) ───────────────────────────── */
    .chart-area {
      flex: 1; position: relative;
      cursor: crosshair; touch-action: pan-y;
    }
    .chart-svg { display: block; width: 100%; }

    /* ── Tooltip ───────────────────────────────────────────────────── */
    .tooltip-box {
      position: absolute; top: 4px;
      background: var(--surface); border: 1px solid var(--border);
      border-radius: 8px; padding: 6px 10px;
      font-size: 11px; color: var(--text);
      pointer-events: none; opacity: 0; transition: opacity 0.12s;
      white-space: nowrap; z-index: 10;
      box-shadow: 0 4px 16px rgba(0,0,0,0.25);
    }
    .tt-time { font-size: 10px; color: var(--text-muted); margin-bottom: 4px; }
    .tt-row  { display: flex; align-items: center; gap: 6px; margin-top: 2px; }
    .tt-dot  { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }

    /* ── Time axis ─────────────────────────────────────────────────── */
    .time-axis {
      display: flex; justify-content: space-between;
      margin-top: 5px; margin-left: 50px;
    }
    .time-axis span { font-size: 10px; color: var(--text-dim); }

    /* ── No-data ───────────────────────────────────────────────────── */
    .no-data { font-size: 12px; color: var(--text-dim); text-align: center; padding: 24px 0; }

    /* ── Timeline bars ─────────────────────────────────────────────── */
    .tl-group { position: relative; }
    .tl-wrap  { margin-bottom: 10px; }
    .tl-wrap:last-child { margin-bottom: 0; }
    .tl-label { font-size: 11px; color: var(--text-muted); margin-bottom: 4px; }
    .timeline-bar {
      width: 100%; height: 10px;
      background: var(--surface); border-radius: 5px;
      position: relative; overflow: hidden; border: 1px solid var(--border);
    }
    .tl-seg { position: absolute; top: 0; bottom: 0; }

    /* ── Legend ────────────────────────────────────────────────────── */
    .legend { border-top: 1px solid var(--border); }
    .legend-row {
      display: flex; align-items: center; gap: 10px;
      padding: 10px 20px; border-bottom: 1px solid var(--border);
      cursor: pointer; transition: background 0.2s;
    }
    .legend-row:last-child { border-bottom: none; }
    .legend-row:hover      { background: var(--row-hover); }
    .legend-dot  { width: 9px; height: 9px; border-radius: 50%; flex-shrink: 0; }
    .legend-name {
      font-size: 13px; font-weight: 500; color: var(--text); flex: 1;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .legend-state {
      font-size: 11px; font-weight: 500; color: var(--text-muted);
      background: var(--surface); border: 1px solid var(--border);
      padding: 2px 8px; border-radius: 6px; white-space: nowrap;
    }
    .legend-stat { font-size: 11px; color: var(--text-dim); white-space: nowrap; }

    /* ── Footer ────────────────────────────────────────────────────── */
    .footer {
      display: flex; align-items: center; justify-content: space-between;
      padding: 10px 20px 14px; border-top: 1px solid var(--border);
    }
    .footer-info { display: flex; align-items: center; gap: 5px; font-size: 11px; color: var(--text-dim); }
    .footer-info ha-icon { --mdc-icon-size: 13px; }
    .brand-mark  { display: flex; align-items: center; gap: 5px; opacity: 0.35; }
    .brand-mark svg  { width: 13px; height: 13px; }
    .brand-mark span { font-size: 10px; font-weight: 700; color: var(--text-muted); letter-spacing: 0.8px; }
  `;

  // ─── Main card class ───────────────────────────────────────────────────────────
  class WeSmartInfiniteChartCard extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this._config    = null;
      this._hass      = null;
      this._entities  = [];
      this._history   = {};
      this._hours     = 24;
      this._card      = null;
      this._zoomRange = null;
      this._palette   = {};
      this._mqHandler = null;
      this._uid       = Math.random().toString(36).slice(2, 8);
    }

    _q(sel) { return this._card?.querySelector(sel) ?? null; }

    // ── Infinite Color Engine ─────────────────────────────────────────────────

    _hexToHsl(hex) {
      hex = hex.replace(/^#/, '');
      if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
      const r = parseInt(hex.slice(0, 2), 16) / 255;
      const g = parseInt(hex.slice(2, 4), 16) / 255;
      const b = parseInt(hex.slice(4, 6), 16) / 255;
      const max = Math.max(r, g, b), min = Math.min(r, g, b);
      let h = 0, s = 0;
      const l = (max + min) / 2;
      if (max !== min) {
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

    _clamp(v, lo, hi) { return Math.min(hi, Math.max(lo, v)); }
    _hsl(h, s, l)     { return `hsl(${h}, ${s}%, ${l}%)`; }
    _hsla(h, s, l, a) { return `hsla(${h}, ${s}%, ${l}%, ${a})`; }

    _buildPalette(hex, isDark) {
      const { h, s, l } = this._hexToHsl(hex);
      const c = this._clamp.bind(this);
      if (isDark) {
        const aL = c(l, 50, 65);
        return {
          accent:     this._hsl(h, s, aL),
          accentSoft: this._hsla(h, s, aL, 0.12),
          bg:         this._hsl(h, c(Math.round(s * 0.35), 25, 45), 11),
          surface:    this._hsl(h, c(Math.round(s * 0.28), 20, 38), 16),
          border:     'hsla(0,0%,100%,0.08)',
          text:       this._hsl(h, c(Math.round(s * 0.08), 5, 10), 93),
          textMuted:  this._hsl(h, c(Math.round(s * 0.12), 8, 15), 65),
          textDim:    this._hsl(h, c(Math.round(s * 0.10), 6, 12), 42),
          rowHover:   'hsla(0,0%,100%,0.03)',
          pillBg:     'hsla(0,0%,100%,0.06)',
          shadow:     `0 8px 32px ${this._hsla(h, s, 5, 0.45)}`,
        };
      } else {
        const aL = c(l - 10, 40, 55);
        return {
          accent:     this._hsl(h, s, aL),
          accentSoft: this._hsla(h, s, aL, 0.12),
          bg:         this._hsl(h, c(Math.round(s * 0.05), 3, 8), 98),
          surface:    this._hsl(h, c(Math.round(s * 0.08), 5, 12), 93),
          border:     this._hsla(h, c(Math.round(s * 0.3), 0, 30), 15, 0.09),
          text:       this._hsl(h, c(Math.round(s * 0.15), 8, 20), 10),
          textMuted:  this._hsl(h, c(Math.round(s * 0.12), 6, 15), 38),
          textDim:    this._hsl(h, c(Math.round(s * 0.08), 4, 10), 58),
          rowHover:   this._hsla(h, c(Math.round(s * 0.2), 0, 20), 15, 0.03),
          pillBg:     this._hsla(h, c(Math.round(s * 0.2), 0, 20), 15, 0.06),
          shadow:     `0 2px 16px ${this._hsla(h, s, 20, 0.07)}, 0 0 0 1px ${this._hsla(h, s, 20, 0.04)}`,
        };
      }
    }

    _isDark() {
      const theme = this._config?.theme ?? 'dark';
      return theme === 'auto'
        ? !window.matchMedia('(prefers-color-scheme: light)').matches
        : theme !== 'light';
    }

    _applyPalette() {
      if (!this._config) return;
      this._palette = this._buildPalette(this._config.color, this._isDark());
      const p = this._palette;
      this.style.setProperty('--accent',     p.accent);
      this.style.setProperty('--accent-soft', p.accentSoft);
      this.style.setProperty('--bg',         p.bg);
      this.style.setProperty('--surface',    p.surface);
      this.style.setProperty('--border',     p.border);
      this.style.setProperty('--text',       p.text);
      this.style.setProperty('--text-muted', p.textMuted);
      this.style.setProperty('--text-dim',   p.textDim);
      this.style.setProperty('--row-hover',  p.rowHover);
      this.style.setProperty('--pill-bg',    p.pillBg);
      this.style.setProperty('--shadow',     p.shadow);
    }

    /**
     * Returns a perceptually distributed color for entity at index i.
     * Entity 0 uses the base accent hue; subsequent entities step by the golden angle (≈137.5°).
     */
    _entityColor(i) {
      const custom = this._entities[i]?.color;
      if (custom && /^#[0-9A-Fa-f]{6}$/i.test(custom.trim())) {
        return custom.trim();
      }
      const { h, s } = this._hexToHsl(this._config.color);
      const hue = (h + i * 137.508) % 360;
      const sat = this._clamp(s, 55, 82);
      const lig = this._isDark() ? 62 : 48;
      return this._hsl(hue, sat, lig);
    }

    _getBucketInfo(durMs = null) {
      const [ws, we] = this._winRange();
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

    // ── setConfig ─────────────────────────────────────────────────────────────
    setConfig(config) {
      const raw = config.entities
        ? config.entities.map(e => typeof e === 'string' ? { entity: e } : { ...e })
        : config.entity
          ? [{ entity: config.entity, name: config.name, color: config.entity_color }]
          : null;
      if (!raw?.length) throw new Error('wesmart-infinite-chart-card: "entity" or "entities" is required');

      this._config = {
        title:       config.title       ?? 'Grafico',
        icon:        config.icon        ?? 'mdi:chart-line',
        theme:       config.theme       ?? 'dark',
        color:       config.color       ?? '#D97757',
        hours:       config.hours       ?? 24,
        height:      config.height      ?? 100,
        show_grid:   config.show_grid   ?? false,
        zoom:        config.zoom        !== false,
        aggregation: config.aggregation === 'avg' ? 'avg' : 'raw',
        entities:    raw,
      };
      this._hours       = this._config.hours;
      this._aggregation = this._config.aggregation;
      this._entities    = this._config.entities;

      // Apply palette before render so CSS vars are ready
      this._applyPalette();
      this._render();

      // Re-apply palette + re-render when OS theme changes (theme: auto)
      if (this._mqHandler) {
        window.matchMedia('(prefers-color-scheme: light)').removeEventListener('change', this._mqHandler);
      }
      if (this._config.theme === 'auto') {
        this._mqHandler = () => { this._applyPalette(); this._updateGraphs(); };
        window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', this._mqHandler);
      }
    }

    disconnectedCallback() {
      if (this._mqHandler) {
        window.matchMedia('(prefers-color-scheme: light)').removeEventListener('change', this._mqHandler);
        this._mqHandler = null;
      }
    }

    // ── hass setter ───────────────────────────────────────────────────────────
    set hass(hass) {
      const first = !this._hass;
      this._hass = hass;
      this._updateLegendStates();
      if (first) this._fetchHistory();
    }

    getCardSize() { return 4 + Math.ceil(this._entities.length * 0.7); }

    // ── Render ────────────────────────────────────────────────────────────────
    _render() {
      if (!this._config) return;
      const style = document.createElement('style');
      style.textContent = CSS;
      this._card = document.createElement('div');
      this._card.className = 'card';
      this._card.innerHTML = this._getHTML();
      this.shadowRoot.innerHTML = '';
      this.shadowRoot.appendChild(style);
      this.shadowRoot.appendChild(this._card);
      this._bindEvents();
    }

    _brandSVG() {
      const fill = this._palette.accent ?? '#D97757';
      return `<svg viewBox="0 0 24 24" fill="none"><path d="M17.3 2.45a.74.74 0 0 0-1.38 0l-1.18 3.27H11.3L10.1 2.45a.74.74 0 0 0-1.38 0L7.3 6.37 4.1 7.56a.74.74 0 0 0 0 1.38l3.2 1.19.82 2.28-3.26 1.18a.74.74 0 0 0 0 1.38l3.26 1.18L9.3 19.2l-2.1.76a.74.74 0 0 0 0 1.38l3.26 1.18.45 1.24a.74.74 0 0 0 1.38 0l.45-1.24 3.26-1.18a.74.74 0 0 0 0-1.38l-2.1-.76 1.18-3.27 3.26-1.18a.74.74 0 0 0 0-1.38l-3.26-1.18.82-2.28 3.2-1.19a.74.74 0 0 0 0-1.38l-3.2-1.19-1.37-3.92z" fill="${fill}"/></svg>`;
    }

    _getHTML() {
      const c = this._config;
      const n = this._entities.length;

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
            <div class="header-icon-wrap"><ha-icon icon="${c.icon}"></ha-icon></div>
            <div>
              <div class="header-title">${c.title}</div>
              <div class="header-subtitle" id="sub">${this._getSubtitleText()}</div>
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
                <button class="agg-pill${this._aggregation !== 'avg' ? ' active' : ''}" data-agg="raw">Puntuali</button>
                <button class="agg-pill${this._aggregation === 'avg' ? ' active' : ''}" data-agg="avg">Media</button>
              </div>
            </div>
          </div>
          <div id="chart-container"><div class="no-data">Caricamento…</div></div>
        </div>
        <div class="legend" id="legend">${legendHTML}</div>
        <div class="footer">
          <div class="footer-info">
            <ha-icon icon="mdi:chart-line"></ha-icon>
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

    // ── Events ────────────────────────────────────────────────────────────────
    _bindEvents() {
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
        const ev = new Event('hass-more-info', { bubbles: true, composed: true });
        ev.detail = { entityId: this._entities[idx]?.entity };
        this.dispatchEvent(ev);
      });
    }

    _refreshZoomBtn() {
      const btn = this._q('#zreset');
      if (btn) btn.className = `zoom-reset${this._zoomRange ? ' visible' : ''}`;
    }

    // ── Chart interactions (tooltip + zoom drag) ───────────────────────────────
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
        if (!dragging && zrRect) { zrRect.setAttribute('width', '0'); }
      });

      if (!this._config.zoom) return;

      chartArea.addEventListener('pointerdown', e => {
        if (e.button !== 0) return;
        e.preventDefault();
        chartArea.setPointerCapture(e.pointerId);
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

    _winRange() {
      if (this._zoomRange) return [this._zoomRange.start, this._zoomRange.end];
      const now = Date.now();
      return [now - this._hours * 3600000, now];
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

    // ── History fetch ─────────────────────────────────────────────────────────
    async _fetchHistory() {
      if (!this._hass || !this._config) return;
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
            if (arr?.length > 0 && arr[0].entity_id)
              this._history[arr[0].entity_id] = arr;
          });
        }
        this._updateGraphs();
      } catch (err) {
        console.error('[wesmart-infinite-chart-card] history fetch error:', err);
        const c = this._q('#chart-container');
        if (c) c.innerHTML = '<div class="no-data">Errore nel caricamento dei dati</div>';
      } finally {
        if (loader) loader.classList.remove('active');
      }
    }

    // ── Graph rendering ───────────────────────────────────────────────────────
    _updateGraphs() {
      this._syncCalcUI();
      const container = this._q('#chart-container');
      if (!container) return;

      const histories = this._entities.map(cfg => this._history[cfg.entity] || []);
      const allBinary = histories.every(h => this._isBinary(h));

      if (allBinary) {
        container.innerHTML = this._renderTimelines(histories);
        this._bindChartInteraction(container.querySelector('.chart-area'), []);
      } else {
        container.innerHTML = this._renderLineChart(histories);
        const pts = histories.map((h, i) => this._isBinary(h) ? [] : this._getSeriesPoints(h, this._entities[i]?.entity));
        this._bindChartInteraction(container.querySelector('.chart-area'), pts);
      }

      this._updateLegendStats(histories);
    }

    _toRawPoints(history, entityId, wsOverride = null, weOverride = null) {
      const [ws, we] = (wsOverride !== null && weOverride !== null)
        ? [wsOverride, weOverride]
        : this._winRange();

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
        : this._winRange();
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

    // ── Timeline rendering ────────────────────────────────────────────────────
    _renderTimelines(histories) {
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
        <line class="tt-line" x1="0" y1="0" x2="0" y2="100"
          stroke="rgba(255,255,255,0.25)" stroke-width="1" opacity="0"/>
        <rect class="zr-rect" x="0" y="0" width="0" height="100"
          fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.2)"
          stroke-width="1" opacity="0" rx="2"/>
      </svg>`;

      return `
        <div class="chart-area" style="position:relative;padding:4px 0">
          ${svgOverlay}
          <div class="tl-group" style="position:relative;z-index:1">${barsHTML}</div>
          <div class="tooltip-box"></div>
        </div>
        ${this._timeAxisHTML()}`;
    }

    // ── Line chart rendering ──────────────────────────────────────────────────
    _renderLineChart(histories) {
      const W   = 400;
      const H   = this._config.height;
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
        lines.push(`<path d="${linePts}" fill="none" stroke="${color}" stroke-width="1.8"
          stroke-linejoin="round" stroke-linecap="round"/>`);
      });

      const gridHTML = this._config.show_grid ? [0.25, 0.5, 0.75].map(f => {
        const y = (f * (H - pad * 2) + pad).toFixed(1);
        return `<line x1="0" y1="${y}" x2="${W}" y2="${y}" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>`;
      }).join('') : '';

      const ttColor = this._palette.textDim ?? 'rgba(255,255,255,0.28)';
      const zrFill  = this._palette.rowHover ?? 'rgba(255,255,255,0.06)';

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
              <line class="tt-line" x1="0" y1="0" x2="0" y2="${H}"
                stroke="${ttColor}" stroke-width="1" opacity="0" stroke-dasharray="3 3"/>
              <rect class="zr-rect" x="0" y="0" width="0" height="${H}"
                fill="${zrFill}" stroke="rgba(255,255,255,0.18)"
                stroke-width="1" opacity="0" rx="2"/>
            </svg>
            <div class="tooltip-box"></div>
          </div>
        </div>
        ${this._timeAxisHTML()}`;
    }

    // ── Time axis ─────────────────────────────────────────────────────────────
    _timeAxisHTML() {
      const [ws, we] = this._winRange();
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

    // ── Legend state updates ───────────────────────────────────────────────────
    _updateLegendStates() {
      if (!this._hass || !this._card) return;
      this._entities.forEach((cfg, i) => {
        const el = this._q(`#ls-${i}`);
        if (el) el.textContent = this._formatState(this._hass.states[cfg.entity]);
      });
    }

    _updateLegendStats(histories) {
      histories.forEach((h, i) => {
        const el = this._q(`#lx-${i}`);
        if (!el) return;
        el.textContent = this._isBinary(h)
          ? this._binaryStat(h)
          : this._numericStat(h, this._entities[i].entity);
      });
    }

    // ── Helpers ───────────────────────────────────────────────────────────────
    _isBinary(h) {
      if (!h?.length) return true;
      const valid = h.map(x => x.state).filter(s => s !== 'unavailable' && s !== 'unknown');
      return !valid.length || valid.some(s => isNaN(parseFloat(s)));
    }

    _isOnState(s) {
      return ['on','open','detected','unlocked','wet','active','home','playing'].includes(s);
    }

    _formatState(obj) {
      if (!obj) return '—';
      const { state: s, attributes: a } = obj;
      if (s === 'unavailable') return 'N/D';
      if (s === 'unknown')     return '?';
      const num = parseFloat(s);
      if (!isNaN(num) && a?.unit_of_measurement) return `${num.toFixed(1)} ${a.unit_of_measurement}`;
      const map = { on:'On', off:'Off', open:'Aperto', closed:'Chiuso',
                    detected:'Rilevato', clear:'Libero', locked:'Bloccato', unlocked:'Aperto' };
      return map[s] ?? s.charAt(0).toUpperCase() + s.slice(1);
    }

    _friendlyName(id) {
      return this._hass?.states[id]?.attributes?.friendly_name ?? id.split('.')[1].replace(/_/g, ' ');
    }

    _binaryStat(h) {
      if (!h?.length) return '';
      const [ws, we] = this._winRange();
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
  }

  // ─── Editor stub ──────────────────────────────────────────────────────────────
  class WeSmartInfiniteChartCardEditor extends HTMLElement {
    setConfig(c) { this._config = c; }
    set hass(h)  { this._hass   = h; }
  }

  // ─── Registration ─────────────────────────────────────────────────────────────
  const safeDefine = (tag, cls) => { if (!customElements.get(tag)) customElements.define(tag, cls); };
  safeDefine(CARD_TAG,   WeSmartInfiniteChartCard);
  safeDefine(EDITOR_TAG, WeSmartInfiniteChartCardEditor);
  safeDefine('wesmart-infinite-chart-card', class extends WeSmartInfiniteChartCard {});
  safeDefine('wesmart-infinite-chart-card-editor', class extends WeSmartInfiniteChartCardEditor {});

  window.customCards = window.customCards || [];
  window.customCards.push({
    type:        CARD_TAG,
    name:        'WeSmart Chart Card',
    description: 'Single or multi-entity chart with dynamic palette, drag-to-zoom, tooltip, and time range pills.',
    preview:     false,
  });

  console.info(
    `%c WESMART INFINITE CHART %c v${CARD_VERSION} `,
    'background:#6366f1;color:#fff;font-weight:700;padding:2px 6px;border-radius:4px 0 0 4px',
    'background:#1a1625;color:#a5b4fc;font-weight:600;padding:2px 6px;border-radius:0 4px 4px 0'
  );
})();
