/**
 * wesmart-chart-card.js v0.1.0
 * WeSmart Original — Chart Card for Home Assistant
 * Single or multi-entity chart: line/area + timeline bars, drag-to-zoom, tooltip, time range pills.
 *
 * YAML tag: wesmart-chart-card
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

  // Fixed multi-entity line colors (WeSmart Original palette)
  const LINE_COLORS = ['#D97757', '#60B4D8', '#5aad6f', '#A78BFA', '#F59E0B', '#EC4899'];

  // ─── CSS ──────────────────────────────────────────────────────────────────────
  const CSS = `
    :host {
      display: block;
      font-family: -apple-system, 'Söhne', 'Inter', BlinkMacSystemFont, 'Segoe UI', sans-serif;
      --claude-radius:    20px;
      --claude-radius-sm: 12px;
      --transition:       all 0.25s cubic-bezier(0.4,0,0.2,1);
    }
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    /* ── Dark theme (default) ──────────────────────────────────────── */
    .card {
      --bg:          #292524;
      --surface:     #332E2A;
      --border:      rgba(255,255,255,0.08);
      --text:        #F5F0EB;
      --text-muted:  #A09080;
      --text-dim:    #6B5F56;
      --row-hover:   rgba(255,255,255,0.03);
      --pill-bg:     rgba(255,255,255,0.06);
      --shadow:      0 8px 32px rgba(0,0,0,0.4);
      --accent:      #D97757;
      --accent-soft: rgba(217,119,87,0.12);
    }

    /* ── Light theme ───────────────────────────────────────────────── */
    .card.theme-light {
      --bg:          #FFFEFA;
      --surface:     #F5F0EB;
      --border:      rgba(28,25,23,0.09);
      --text:        #1C1917;
      --text-muted:  #6B5F56;
      --text-dim:    #A09080;
      --row-hover:   rgba(28,25,23,0.03);
      --pill-bg:     rgba(28,25,23,0.06);
      --shadow:      0 2px 16px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.04);
      --accent:      #D97757;
      --accent-soft: rgba(217,119,87,0.12);
    }

    /* ── Auto theme ────────────────────────────────────────────────── */
    @media (prefers-color-scheme: light) {
      .card.theme-auto {
        --bg:          #FFFEFA;
        --surface:     #F5F0EB;
        --border:      rgba(28,25,23,0.09);
        --text:        #1C1917;
        --text-muted:  #6B5F56;
        --text-dim:    #A09080;
        --row-hover:   rgba(28,25,23,0.03);
        --pill-bg:     rgba(28,25,23,0.06);
        --shadow:      0 2px 16px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.04);
        --accent:      #D97757;
        --accent-soft: rgba(217,119,87,0.12);
      }
    }

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
    .chart-section { padding: 16px 20px 10px; }

    /* ── Zoom reset button ─────────────────────────────────────────── */
    .zoom-reset {
      display: none; margin: 0 0 10px;
      padding: 3px 12px;
      background: var(--accent-soft); border: 1px solid var(--accent);
      border-radius: 8px; color: var(--accent); font-size: 11px; font-weight: 500;
      cursor: pointer; transition: var(--transition);
    }
    .zoom-reset.visible { display: inline-flex; align-items: center; gap: 4px; }
    .zoom-reset:hover   { background: var(--accent); color: #fff; }

    /* ── Chart layout (y-axis + chart area) ────────────────────────── */
    .chart-layout { display: flex; gap: 6px; align-items: stretch; }

    .y-axis {
      width: 44px; flex-shrink: 0;
      display: flex; flex-direction: column; justify-content: space-between;
      padding-bottom: 22px; /* aligns with time-axis gap */
    }
    .y-label { font-size: 10px; color: var(--text-dim); text-align: right; line-height: 1; }

    /* ── Chart area (interaction target) ───────────────────────────── */
    .chart-area {
      flex: 1; position: relative;
      cursor: crosshair; touch-action: pan-y;
    }
    .chart-svg { display: block; width: 100%; }

    /* ── Tooltip box ───────────────────────────────────────────────── */
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

    /* ── No-data placeholder ───────────────────────────────────────── */
    .no-data { font-size: 12px; color: var(--text-dim); text-align: center; padding: 24px 0; }

    /* ── Timeline bars (binary sensors) ───────────────────────────── */
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
  class WeSmartChartCard extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this._config    = null;
      this._hass      = null;
      this._entities  = [];
      this._history   = {};
      this._hours     = 24;
      this._card      = null;
      this._zoomRange = null;   // { start: ms, end: ms } or null
      this._uid       = Math.random().toString(36).slice(2, 8);
    }

    _q(sel) { return this._card?.querySelector(sel) ?? null; }

    // ── setConfig ─────────────────────────────────────────────────────────────
    setConfig(config) {
      const raw = config.entities
        ? config.entities.map(e => typeof e === 'string' ? { entity: e } : { ...e })
        : config.entity
          ? [{ entity: config.entity, name: config.name }]
          : null;
      if (!raw?.length) throw new Error('wesmart-chart-card: "entity" or "entities" is required');

      this._config = {
        title:     config.title     ?? 'Grafico',
        icon:      config.icon      ?? 'mdi:chart-line',
        theme:     config.theme     ?? 'dark',
        hours:     config.hours     ?? 24,
        height:    config.height    ?? 100,
        show_grid: config.show_grid ?? false,
        zoom:      config.zoom      !== false,
        entities:  raw,
      };
      this._hours    = this._config.hours;
      this._entities = this._config.entities;
      this._render();
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
      this._card.className = `card theme-${this._config.theme}`;
      this._card.innerHTML = this._getHTML();
      this.shadowRoot.innerHTML = '';
      this.shadowRoot.appendChild(style);
      this.shadowRoot.appendChild(this._card);
      this._bindEvents();
    }

    _brandSVG() {
      return `<svg viewBox="0 0 24 24" fill="none"><path d="M17.3 2.45a.74.74 0 0 0-1.38 0l-1.18 3.27H11.3L10.1 2.45a.74.74 0 0 0-1.38 0L7.3 6.37 4.1 7.56a.74.74 0 0 0 0 1.38l3.2 1.19.82 2.28-3.26 1.18a.74.74 0 0 0 0 1.38l3.26 1.18L9.3 19.2l-2.1.76a.74.74 0 0 0 0 1.38l3.26 1.18.45 1.24a.74.74 0 0 0 1.38 0l.45-1.24 3.26-1.18a.74.74 0 0 0 0-1.38l-2.1-.76 1.18-3.27 3.26-1.18a.74.74 0 0 0 0-1.38l-3.26-1.18.82-2.28 3.2-1.19a.74.74 0 0 0 0-1.38l-3.2-1.19-1.37-3.92z" fill="var(--accent)"/></svg>`;
    }

    _getHTML() {
      const c = this._config;
      const n = this._entities.length;

      const pillsHTML = HOURS_OPTIONS.map(h =>
        `<button class="time-pill${h === this._hours ? ' active' : ''}" data-hours="${h}">${HOURS_LABELS[h]}</button>`
      ).join('');

      const legendHTML = this._entities.map((cfg, i) => {
        const color = LINE_COLORS[i % LINE_COLORS.length];
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
              <div class="header-subtitle" id="sub">Ultimi ${HOURS_NAMES[this._hours] ?? this._hours + 'h'}</div>
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
        <div class="footer">
          <div class="footer-info">
            <ha-icon icon="mdi:chart-line"></ha-icon>
            <span>${n} entit${n === 1 ? 'à' : 'à'}</span>
          </div>
          <div class="brand-mark">${this._brandSVG()}<span>WeSmart</span></div>
        </div>`;
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
        if (maxPct - minPct < 0.04) return;   // drag too small → ignore

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
        const col  = LINE_COLORS[i % LINE_COLORS.length];
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
      // Flip tooltip to left side when near right edge
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
        console.error('[wesmart-chart-card] history fetch error:', err);
        const c = this._q('#chart-container');
        if (c) c.innerHTML = '<div class="no-data">Errore nel caricamento dei dati</div>';
      } finally {
        if (loader) loader.classList.remove('active');
      }
    }

    // ── Graph rendering ───────────────────────────────────────────────────────
    _updateGraphs() {
      const container = this._q('#chart-container');
      if (!container) return;

      const histories = this._entities.map(cfg => this._history[cfg.entity] || []);
      const allBinary = histories.every(h => this._isBinary(h));

      if (allBinary) {
        container.innerHTML = this._renderTimelines(histories);
        this._bindChartInteraction(container.querySelector('.chart-area'), []);
      } else {
        container.innerHTML = this._renderLineChart(histories);
        const pts = histories.map(h => this._isBinary(h) ? [] : this._toPoints(h));
        this._bindChartInteraction(container.querySelector('.chart-area'), pts);
      }

      this._updateLegendStats(histories);
    }

    _toPoints(history) {
      const [ws, we] = this._winRange();
      return (history || [])
        .filter(h => h.state !== 'unavailable' && h.state !== 'unknown' && !isNaN(parseFloat(h.state)))
        .map(h => ({ t: new Date(h.last_changed).getTime(), v: parseFloat(h.state) }))
        .filter(p => p.t >= ws - 3600000 && p.t <= we + 60000);
    }

    // ── Timeline rendering (binary sensors) ───────────────────────────────────
    _renderTimelines(histories) {
      const W       = 400;
      const TL_H    = 10; // timeline bar viewBox height
      const [ws, we] = this._winRange();
      const dur     = we - ws;

      const barsHTML = histories.map((h, i) => {
        const color = LINE_COLORS[i % LINE_COLORS.length];
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

      // Invisible SVG overlay for tooltip-line and zoom-rect (covers full area via absolute)
      const svgOverlay = `<svg class="chart-svg" viewBox="0 0 ${W} 100" preserveAspectRatio="none"
        style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none;opacity:1">
        <line class="tt-line" x1="0" y1="0" x2="0" y2="100"
          stroke="rgba(255,255,255,0.25)" stroke-width="1" opacity="0"/>
        <rect class="zr-rect" x="0" y="0" width="0" height="100"
          fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.2)" stroke-width="1" opacity="0" rx="2"/>
      </svg>`;

      return `
        <div class="chart-area" style="position:relative;padding:4px 0">
          ${svgOverlay}
          <div class="tl-group" style="position:relative;z-index:1">${barsHTML}</div>
          <div class="tooltip-box"></div>
        </div>
        ${this._timeAxisHTML()}`;
    }

    // ── Line chart rendering (numeric sensors) ────────────────────────────────
    _renderLineChart(histories) {
      const W   = 400;
      const H   = this._config.height;
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

        const color  = LINE_COLORS[i % LINE_COLORS.length];
        const vals   = pts.map(p => p.v);
        const minV   = Math.min(...vals);
        const maxV   = Math.max(...vals);
        const rangeV = maxV - minV || 1;

        // Y-axis labels use the first numeric entity
        if (yMin === null) {
          yMin  = minV;
          yMax  = maxV;
          yUnit = this._hass?.states[this._entities[i].entity]?.attributes?.unit_of_measurement ?? '';
        }

        const linePts = pts.map((p, j) => `${j === 0 ? 'M' : 'L'}${toX(p.t)},${toY(p.v, minV, rangeV)}`).join(' ');
        const areaPts = `${linePts} L${toX(pts[pts.length - 1].t)},${H} L${toX(pts[0].t)},${H} Z`;
        const gid     = `wcg-${uid}-${i}`;

        defs.push(`<linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stop-color="${color}" stop-opacity="0.35"/>
          <stop offset="100%" stop-color="${color}" stop-opacity="0.02"/>
        </linearGradient>`);
        areas.push(`<path d="${areaPts}" fill="url(#${gid})"/>`);
        lines.push(`<path d="${linePts}" fill="none" stroke="${color}" stroke-width="1.8"
          stroke-linejoin="round" stroke-linecap="round"/>`);
      });

      if (!areas.length) {
        return `<div class="no-data">Nessun dato nel periodo selezionato</div>`;
      }

      const gridHTML = this._config.show_grid ? [0.25, 0.5, 0.75].map(f => {
        const y = (f * (H - pad * 2) + pad).toFixed(1);
        return `<line x1="0" y1="${y}" x2="${W}" y2="${y}" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>`;
      }).join('') : '';

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
              <line class="tt-line" x1="0" y1="0" x2="0" y2="${H}"
                stroke="rgba(255,255,255,0.28)" stroke-width="1" opacity="0" stroke-dasharray="3 3"/>
              <rect class="zr-rect" x="0" y="0" width="0" height="${H}"
                fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.18)"
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
      if (!h?.length) return '';
      const vals = h
        .filter(x => x.state !== 'unavailable' && x.state !== 'unknown' && !isNaN(parseFloat(x.state)))
        .map(x => parseFloat(x.state));
      if (!vals.length) return '';
      const unit = this._hass?.states[entityId]?.attributes?.unit_of_measurement ?? '';
      return `${Math.min(...vals).toFixed(1)} – ${Math.max(...vals).toFixed(1)} ${unit}`.trim();
    }
  }

  // ─── Editor stub ──────────────────────────────────────────────────────────────
  class WeSmartChartCardEditor extends HTMLElement {
    setConfig(c) { this._config = c; }
    set hass(h)  { this._hass   = h; }
  }

  // ─── Registration ─────────────────────────────────────────────────────────────
  customElements.define(CARD_TAG,   WeSmartChartCard);
  customElements.define(EDITOR_TAG, WeSmartChartCardEditor);

  window.customCards = window.customCards || [];
  window.customCards.push({
    type:        CARD_TAG,
    name:        'WeSmart Chart Card',
    description: 'Single or multi-entity chart with drag-to-zoom, tooltip, and time range pills.',
    preview:     false,
  });

  console.info(
    `%c WESMART CHART %c v${CARD_VERSION} `,
    'background:#D97757;color:#fff;font-weight:700;padding:2px 6px;border-radius:4px 0 0 4px',
    'background:#292524;color:#F5F0EB;font-weight:600;padding:2px 6px;border-radius:0 4px 4px 0'
  );
})();
