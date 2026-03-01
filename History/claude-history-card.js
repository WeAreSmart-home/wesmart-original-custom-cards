// claude-history-card.js v1.0.0
// Claude AI aesthetic — History Graph Card for Home Assistant
// Timeline bar for binary sensors · Line chart for numeric sensors
// Interactive time range pills · Summary stats per entity

(() => {
  'use strict';

  const CARD_VERSION = '1.0.0';
  const CARD_TAG     = 'claude-history-card';
  const EDITOR_TAG   = 'claude-history-card-editor';

  const HOURS_OPTIONS = [1, 6, 24, 168];
  const HOURS_LABELS  = { 1: '1h', 6: '6h', 24: '24h', 168: '7d' };
  const HOURS_NAMES   = { 1: '1 ora', 6: '6 ore', 24: '24 ore', 168: '7 giorni' };

  // ─── Styles ────────────────────────────────────────────────────────────────

  const CSS = `
    :host {
      display: block;
      font-family: -apple-system, 'Söhne', 'Inter', BlinkMacSystemFont, 'Segoe UI', sans-serif;
      --claude-orange:      #D97757;
      --claude-orange-soft: rgba(217, 119, 87, 0.12);
      --claude-radius:      20px;
      --claude-radius-sm:   12px;
      --claude-radius-xs:   8px;
      --transition:         all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    }

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    /* ── Dark theme (default) ─────────────────────────────────── */
    .card {
      --bg:         #292524;
      --surface:    #332E2A;
      --border:     rgba(255, 255, 255, 0.08);
      --text:       #F5F0EB;
      --text-muted: #A09080;
      --text-dim:   #6B5F56;
      --row-hover:  rgba(255, 255, 255, 0.03);
      --pill-bg:    rgba(255, 255, 255, 0.06);
      --shadow:     0 8px 32px rgba(0, 0, 0, 0.4);
    }

    /* ── Light theme ──────────────────────────────────────────── */
    .card.theme-light {
      --bg:         #FFFEFA;
      --surface:    #F5F0EB;
      --border:     rgba(28, 25, 23, 0.09);
      --text:       #1C1917;
      --text-muted: #6B5F56;
      --text-dim:   #A09080;
      --row-hover:  rgba(28, 25, 23, 0.03);
      --pill-bg:    rgba(28, 25, 23, 0.06);
      --shadow:     0 2px 16px rgba(0, 0, 0, 0.07), 0 0 0 1px rgba(0, 0, 0, 0.04);
    }

    /* ── Auto theme ───────────────────────────────────────────── */
    @media (prefers-color-scheme: light) {
      .card.theme-auto {
        --bg:         #FFFEFA;
        --surface:    #F5F0EB;
        --border:     rgba(28, 25, 23, 0.09);
        --text:       #1C1917;
        --text-muted: #6B5F56;
        --text-dim:   #A09080;
        --row-hover:  rgba(28, 25, 23, 0.03);
        --pill-bg:    rgba(28, 25, 23, 0.06);
        --shadow:     0 2px 16px rgba(0, 0, 0, 0.07), 0 0 0 1px rgba(0, 0, 0, 0.04);
      }
    }

    /* ── Card shell ───────────────────────────────────────────── */
    .card {
      background:    var(--bg);
      border-radius: var(--claude-radius);
      border:        1px solid var(--border);
      box-shadow:    var(--shadow);
      overflow:      hidden;
      position:      relative;
    }

    /* ── Loader bar ───────────────────────────────────────────── */
    .loader {
      position:   absolute;
      top: 0; left: 0; right: 0;
      height:     2px;
      background: linear-gradient(90deg, transparent, var(--claude-orange), transparent);
      opacity:    0;
      transition: opacity 0.3s;
    }
    .loader.active { opacity: 1; }

    /* ── Header ───────────────────────────────────────────────── */
    .header {
      display:         flex;
      align-items:     center;
      justify-content: space-between;
      padding:         18px 20px 14px;
      gap:             12px;
      flex-wrap:       wrap;
    }
    .header-left {
      display:     flex;
      align-items: center;
      gap:         12px;
    }
    .header-icon-wrap {
      width:           40px;
      height:          40px;
      background:      var(--claude-orange-soft);
      border-radius:   var(--claude-radius-sm);
      display:         flex;
      align-items:     center;
      justify-content: center;
      flex-shrink:     0;
    }
    .header-icon-wrap ha-icon {
      --mdc-icon-size: 20px;
      color: var(--claude-orange);
    }
    .header-title {
      font-size:      15px;
      font-weight:    600;
      color:          var(--text);
      letter-spacing: -0.2px;
      line-height:    1.2;
    }
    .header-subtitle {
      font-size:  12px;
      color:      var(--text-muted);
      margin-top: 2px;
    }

    /* ── Time range pills ─────────────────────────────────────── */
    .time-pills {
      display:       flex;
      gap:           3px;
      background:    var(--surface);
      border:        1px solid var(--border);
      border-radius: var(--claude-radius-sm);
      padding:       3px;
    }
    .time-pill {
      padding:       4px 12px;
      border-radius: 8px;
      font-size:     12px;
      font-weight:   500;
      border:        none;
      cursor:        pointer;
      background:    transparent;
      color:         var(--text-muted);
      transition:    var(--transition);
    }
    .time-pill.active {
      background: var(--claude-orange);
      color:      #fff;
    }
    .time-pill:not(.active):hover {
      background: var(--pill-bg);
      color:      var(--text);
    }

    /* ── Separator ────────────────────────────────────────────── */
    .separator {
      height:     1px;
      background: var(--border);
      margin:     0 20px;
    }

    /* ── Entity rows ──────────────────────────────────────────── */
    .entity-row {
      padding:       14px 20px;
      border-bottom: 1px solid var(--border);
      cursor:        pointer;
      transition:    background 0.2s;
    }
    .entity-row:last-child { border-bottom: none; }
    .entity-row:hover      { background: var(--row-hover); }
    .entity-row.unavailable {
      opacity:         0.45;
      pointer-events:  none;
    }

    .entity-meta {
      display:     flex;
      align-items: center;
      gap:         10px;
      margin-bottom: 10px;
    }
    .entity-icon-wrap {
      width:           32px;
      height:          32px;
      background:      var(--surface);
      border:          1px solid var(--border);
      border-radius:   10px;
      display:         flex;
      align-items:     center;
      justify-content: center;
      flex-shrink:     0;
    }
    .entity-icon-wrap ha-icon {
      --mdc-icon-size: 16px;
      color: var(--text-muted);
      transition: color 0.2s;
    }
    .entity-name {
      font-size:     13px;
      font-weight:   500;
      color:         var(--text);
      flex:          1;
      white-space:   nowrap;
      overflow:      hidden;
      text-overflow: ellipsis;
    }
    .entity-state {
      font-size:     11px;
      font-weight:   500;
      color:         var(--text-muted);
      background:    var(--surface);
      border:        1px solid var(--border);
      padding:       2px 8px;
      border-radius: 6px;
      white-space:   nowrap;
      transition:    var(--transition);
    }
    .entity-state.state-on {
      color:        var(--claude-orange);
      background:   var(--claude-orange-soft);
      border-color: transparent;
    }
    .entity-stat {
      font-size:   11px;
      color:       var(--text-dim);
      white-space: nowrap;
      flex-shrink: 0;
    }

    /* ── Timeline bar (binary) ────────────────────────────────── */
    .timeline-bar {
      width:         100%;
      height:        10px;
      background:    var(--surface);
      border-radius: 6px;
      position:      relative;
      overflow:      hidden;
      border:        1px solid var(--border);
    }
    .seg {
      position: absolute;
      top: 0; bottom: 0;
    }
    .seg-on  { background: var(--claude-orange); }
    .seg-off { background: transparent; }

    /* ── Line chart (numeric) ─────────────────────────────────── */
    .linechart { width: 100%; }
    .linechart svg {
      display:  block;
      overflow: visible;
    }

    /* ── Time axis ────────────────────────────────────────────── */
    .time-axis {
      display:         flex;
      justify-content: space-between;
      margin-top:      5px;
    }
    .time-axis span {
      font-size: 10px;
      color:     var(--text-dim);
    }

    /* ── No data message ──────────────────────────────────────── */
    .no-data {
      font-size:  12px;
      color:      var(--text-dim);
      text-align: center;
      padding:    14px 0;
    }

    /* ── Footer ───────────────────────────────────────────────── */
    .footer {
      display:         flex;
      align-items:     center;
      justify-content: space-between;
      padding:         10px 20px 14px;
      border-top:      1px solid var(--border);
    }
    .footer-info {
      display:     flex;
      align-items: center;
      gap:         5px;
      font-size:   11px;
      color:       var(--text-dim);
    }
    .footer-info ha-icon { --mdc-icon-size: 13px; }
    .brand-mark {
      display:     flex;
      align-items: center;
      gap:         5px;
      opacity:     0.35;
    }
    .brand-mark svg   { width: 13px; height: 13px; }
    .brand-mark span  {
      font-size:      10px;
      font-weight:    700;
      color:          var(--text-muted);
      letter-spacing: 0.8px;
    }
  `;

  // ─── Brand mark SVG ────────────────────────────────────────────────────────

  const BRAND_SVG = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.3 2.45a.74.74 0 0 0-1.38 0l-1.18 3.27H11.3L10.1 2.45a.74.74 0 0 0-1.38 0L7.3 6.37 4.1 7.56a.74.74 0 0 0 0 1.38l3.2 1.19.82 2.28-3.26 1.18a.74.74 0 0 0 0 1.38l3.26 1.18L9.3 19.2l-2.1.76a.74.74 0 0 0 0 1.38l3.26 1.18.45 1.24a.74.74 0 0 0 1.38 0l.45-1.24 3.26-1.18a.74.74 0 0 0 0-1.38l-2.1-.76 1.18-3.27 3.26-1.18a.74.74 0 0 0 0-1.38l-3.26-1.18.82-2.28 3.2-1.19a.74.74 0 0 0 0-1.38l-3.2-1.19-1.37-3.92z" fill="#D97757"/>
  </svg>`;

  // ─── Main card class ────────────────────────────────────────────────────────

  class ClaudeHistoryCard extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this._config   = null;
      this._hass     = null;
      this._entities = [];
      this._history  = {};
      this._hours    = 24;
      this._card     = null;
    }

    /** Shortcut querySelector on card root */
    _q(sel) { return this._card?.querySelector(sel) ?? null; }

    // ── setConfig ─────────────────────────────────────────────────────────────

    setConfig(config) {
      if (!config.entities || !config.entities.length) {
        throw new Error('claude-history-card: "entities" is required');
      }
      this._config = {
        title:    config.title   ?? 'History',
        icon:     config.icon    ?? 'mdi:chart-line',
        theme:    config.theme   ?? 'dark',
        hours:    config.hours   ?? 24,
        entities: config.entities,
      };
      this._hours    = this._config.hours;
      this._entities = this._config.entities.map(e =>
        typeof e === 'string' ? { entity: e } : { ...e }
      );
      this._render();
    }

    // ── hass setter ───────────────────────────────────────────────────────────

    set hass(hass) {
      const firstTime = !this._hass;
      this._hass = hass;
      this._updateCurrentStates();
      if (firstTime) this._fetchHistory();
    }

    getCardSize() {
      return 2 + Math.ceil(this._entities.length * 1.5);
    }

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

    _getHTML() {
      const c = this._config;

      const pillsHTML = HOURS_OPTIONS.map(h => `
        <button class="time-pill${h === this._hours ? ' active' : ''}" data-hours="${h}">
          ${HOURS_LABELS[h]}
        </button>
      `).join('');

      const rowsHTML = this._entities.map((cfg, i) => {
        const name = cfg.name || this._friendlyName(cfg.entity);
        const icon = cfg.icon || this._iconForEntity(cfg.entity);
        return `
          <div class="entity-row" data-index="${i}">
            <div class="entity-meta">
              <div class="entity-icon-wrap">
                <ha-icon id="icon-${i}" icon="${icon}"></ha-icon>
              </div>
              <span class="entity-name">${name}</span>
              <span class="entity-state" id="state-${i}">—</span>
              <span class="entity-stat"  id="stat-${i}"></span>
            </div>
            <div id="graph-${i}">
              <div class="no-data">Caricamento…</div>
            </div>
          </div>
        `;
      }).join('');

      const n = this._entities.length;
      return `
        <div class="loader" id="loader"></div>
        <div class="header">
          <div class="header-left">
            <div class="header-icon-wrap">
              <ha-icon icon="${c.icon}"></ha-icon>
            </div>
            <div>
              <div class="header-title">${c.title}</div>
              <div class="header-subtitle" id="header-subtitle">
                Ultimi ${HOURS_NAMES[this._hours] ?? this._hours + 'h'}
              </div>
            </div>
          </div>
          <div class="time-pills">${pillsHTML}</div>
        </div>
        <div class="separator"></div>
        <div id="entity-list">${rowsHTML}</div>
        <div class="footer">
          <div class="footer-info">
            <ha-icon icon="mdi:chart-line"></ha-icon>
            <span>${n} entit${n === 1 ? 'à' : 'à'}</span>
          </div>
          <div class="brand-mark">
            ${BRAND_SVG}
            <span>WeSmart</span>
          </div>
        </div>
      `;
    }

    // ── Events ────────────────────────────────────────────────────────────────

    _bindEvents() {
      // Time range pills
      this._card.querySelectorAll('.time-pill').forEach(btn => {
        btn.addEventListener('click', e => {
          e.stopPropagation();
          const h = parseInt(btn.dataset.hours, 10);
          this._hours = h;
          this._card.querySelectorAll('.time-pill').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          const sub = this._q('#header-subtitle');
          if (sub) sub.textContent = `Ultimi ${HOURS_NAMES[h] ?? h + 'h'}`;
          this._fetchHistory();
        });
      });

      // More-info on row click
      this._q('#entity-list')?.addEventListener('click', e => {
        const row = e.target.closest('.entity-row');
        if (!row) return;
        const idx = parseInt(row.dataset.index, 10);
        if (isNaN(idx)) return;
        const entityId = this._entities[idx]?.entity;
        if (!entityId) return;
        const ev = new Event('hass-more-info', { bubbles: true, composed: true });
        ev.detail = { entityId };
        this.dispatchEvent(ev);
      });
    }

    // ── State update ──────────────────────────────────────────────────────────

    _updateCurrentStates() {
      if (!this._hass || !this._config) return;
      this._entities.forEach((cfg, i) => {
        const stateObj = this._hass.states[cfg.entity];
        const stateEl  = this._q(`#state-${i}`);
        const iconEl   = this._q(`#icon-${i}`);
        if (!stateEl) return;

        if (!stateObj) {
          stateEl.textContent = 'N/D';
          stateEl.className   = 'entity-state';
          return;
        }

        const isOn = this._isOnState(stateObj.state);
        stateEl.textContent = this._formatState(stateObj);
        stateEl.className   = `entity-state${isOn ? ' state-on' : ''}`;

        if (iconEl) {
          iconEl.style.color = isOn ? 'var(--claude-orange)' : '';
          if (!cfg.icon) iconEl.setAttribute('icon', this._iconForEntity(cfg.entity));
        }
      });
    }

    _formatState(stateObj) {
      if (!stateObj) return '—';
      const s    = stateObj.state;
      const unit = stateObj.attributes?.unit_of_measurement;
      const num  = parseFloat(s);
      if (s === 'unavailable') return 'N/D';
      if (s === 'unknown')     return '?';
      if (!isNaN(num) && unit) return `${num.toFixed(1)} ${unit}`;
      const labels = { on: 'On', off: 'Off', open: 'Aperto', closed: 'Chiuso',
                       detected: 'Rilevato', clear: 'Libero', locked: 'Bloccato',
                       unlocked: 'Aperto', wet: 'Bagnato', dry: 'Asciutto' };
      return labels[s] ?? s.charAt(0).toUpperCase() + s.slice(1);
    }

    // ── History fetch ─────────────────────────────────────────────────────────

    async _fetchHistory() {
      if (!this._hass || !this._config) return;
      const loader = this._q('#loader');
      if (loader) loader.classList.add('active');

      const ids       = this._entities.map(e => e.entity).join(',');
      const startTime = new Date(Date.now() - this._hours * 3600 * 1000).toISOString();
      const endTime   = new Date().toISOString();
      const path      = `history/period/${startTime}?filter_entity_id=${ids}&end_time=${endTime}&minimal_response=true&significant_changes_only=false`;

      try {
        const data = await this._hass.callApi('GET', path);
        this._history = {};
        if (Array.isArray(data)) {
          data.forEach(arr => {
            if (arr && arr.length > 0 && arr[0].entity_id) {
              this._history[arr[0].entity_id] = arr;
            }
          });
        }
        this._updateGraphs();
      } catch (err) {
        console.error('[claude-history-card] fetch error:', err);
        this._entities.forEach((_, i) => {
          const g = this._q(`#graph-${i}`);
          if (g && g.querySelector('.no-data')) {
            g.innerHTML = '<div class="no-data">Errore nel caricamento dati</div>';
          }
        });
      } finally {
        if (loader) loader.classList.remove('active');
      }
    }

    // ── Graph rendering ───────────────────────────────────────────────────────

    _updateGraphs() {
      this._entities.forEach((cfg, i) => {
        const history   = this._history[cfg.entity] || [];
        const container = this._q(`#graph-${i}`);
        const statEl    = this._q(`#stat-${i}`);
        if (!container) return;

        const isBinary = this._isBinary(history);
        if (isBinary) {
          container.innerHTML = this._renderTimeline(history);
          if (statEl) statEl.textContent = this._binaryStat(history);
        } else {
          container.innerHTML = this._renderLineChart(history, cfg.entity);
          if (statEl) statEl.textContent = this._numericStat(history, cfg.entity);
        }
      });
    }

    _isBinary(history) {
      if (!history || !history.length) return true;
      const valid = history
        .map(h => h.state)
        .filter(s => s !== 'unavailable' && s !== 'unknown');
      if (!valid.length) return true;
      return valid.some(s => isNaN(parseFloat(s)));
    }

    // ── Timeline (binary sensor) ──────────────────────────────────────────────

    _renderTimeline(history) {
      const now   = Date.now();
      const start = now - this._hours * 3600 * 1000;
      const range = now - start;
      const valid = (history || []).filter(h => h.state !== 'unavailable' && h.state !== 'unknown');

      const segsHTML = valid.map((item, i) => {
        const tStart = Math.max(new Date(item.last_changed).getTime(), start);
        const tEnd   = i < valid.length - 1
          ? new Date(valid[i + 1].last_changed).getTime()
          : now;
        if (tEnd <= start || tStart >= now) return '';
        const xPct = ((tStart - start) / range) * 100;
        const wPct = ((Math.min(tEnd, now) - tStart) / range) * 100;
        const cls  = this._isOnState(item.state) ? 'seg-on' : 'seg-off';
        return `<div class="seg ${cls}" style="left:${xPct.toFixed(2)}%;width:${Math.max(wPct, 0.3).toFixed(2)}%"></div>`;
      }).join('');

      if (!segsHTML.trim()) {
        return `<div class="no-data">Nessun dato nel periodo selezionato</div>`;
      }

      return `
        <div class="timeline-bar">${segsHTML}</div>
        ${this._timeAxisHTML()}
      `;
    }

    // ── Line chart (numeric sensor) ───────────────────────────────────────────

    _renderLineChart(history, entityId) {
      const now   = Date.now();
      const start = now - this._hours * 3600 * 1000;
      const points = (history || [])
        .filter(h => h.state !== 'unavailable' && h.state !== 'unknown' && !isNaN(parseFloat(h.state)))
        .map(h => ({ t: new Date(h.last_changed).getTime(), v: parseFloat(h.state) }))
        .filter(p => p.t >= start);

      if (points.length < 2) {
        return `<div class="no-data">Nessun dato nel periodo selezionato</div>`;
      }

      const W = 400, H = 60;
      const pad = 4;
      const minV  = Math.min(...points.map(p => p.v));
      const maxV  = Math.max(...points.map(p => p.v));
      const rangeV = maxV - minV || 1;
      const rangeT = now - start;

      const toX = t => ((t - start) / rangeT * W).toFixed(1);
      const toY = v => (H - ((v - minV) / rangeV) * (H - pad * 2) - pad).toFixed(1);

      const linePath = points
        .map((p, i) => `${i === 0 ? 'M' : 'L'}${toX(p.t)},${toY(p.v)}`)
        .join(' ');
      const areaPath = linePath
        + ` L${toX(points[points.length - 1].t)},${H} L${toX(points[0].t)},${H} Z`;

      // Unique gradient ID to avoid clashes if multiple cards are on the same dashboard
      const gradId = `chg-${entityId.replace(/\W/g, '-')}`;

      return `
        <div class="linechart">
          <svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" style="width:100%;height:60px;">
            <defs>
              <linearGradient id="${gradId}" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stop-color="#D97757" stop-opacity="0.38"/>
                <stop offset="100%" stop-color="#D97757" stop-opacity="0.02"/>
              </linearGradient>
            </defs>
            <path d="${areaPath}" fill="url(#${gradId})"/>
            <path d="${linePath}" fill="none" stroke="#D97757" stroke-width="1.5"
                  stroke-linejoin="round" stroke-linecap="round"/>
          </svg>
        </div>
        ${this._timeAxisHTML()}
      `;
    }

    // ── Time axis ─────────────────────────────────────────────────────────────

    _timeAxisHTML() {
      const now   = Date.now();
      const start = now - this._hours * 3600 * 1000;
      const steps = this._hours <= 6 ? 3 : 4;
      const labels = [];
      for (let i = 0; i <= steps; i++) {
        const t = new Date(start + (i / steps) * (now - start));
        labels.push(
          this._hours <= 48
            ? t.getHours().toString().padStart(2, '0') + ':' + t.getMinutes().toString().padStart(2, '0')
            : t.toLocaleDateString([], { weekday: 'short', day: 'numeric' })
        );
      }
      return `<div class="time-axis">${labels.map(l => `<span>${l}</span>`).join('')}</div>`;
    }

    // ── Summary stats ─────────────────────────────────────────────────────────

    _binaryStat(history) {
      if (!history || !history.length) return '';
      const now   = Date.now();
      const start = now - this._hours * 3600 * 1000;
      let onMs = 0;
      const valid = history.filter(h => h.state !== 'unavailable' && h.state !== 'unknown');
      for (let i = 0; i < valid.length; i++) {
        const t0 = Math.max(new Date(valid[i].last_changed).getTime(), start);
        const t1 = i < valid.length - 1 ? new Date(valid[i + 1].last_changed).getTime() : now;
        if (this._isOnState(valid[i].state) && t1 > start) {
          onMs += Math.min(t1, now) - t0;
        }
      }
      const pct = Math.round((onMs / (this._hours * 3600 * 1000)) * 100);
      return `Attivo ${pct}%`;
    }

    _numericStat(history, entityId) {
      if (!history || !history.length) return '';
      const values = history
        .filter(h => h.state !== 'unavailable' && h.state !== 'unknown' && !isNaN(parseFloat(h.state)))
        .map(h => parseFloat(h.state));
      if (!values.length) return '';
      const min  = Math.min(...values);
      const max  = Math.max(...values);
      const unit = this._hass?.states[entityId]?.attributes?.unit_of_measurement ?? '';
      return `${min.toFixed(1)} – ${max.toFixed(1)} ${unit}`.trim();
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    _isOnState(state) {
      return ['on', 'open', 'detected', 'unlocked', 'wet', 'active', 'home', 'playing'].includes(state);
    }

    _friendlyName(entityId) {
      return this._hass?.states[entityId]?.attributes?.friendly_name
        ?? entityId.split('.')[1].replace(/_/g, ' ');
    }

    _iconForEntity(entityId) {
      const domain = entityId?.split('.')[0] ?? '';
      const map = {
        light:         'mdi:lightbulb',
        switch:        'mdi:toggle-switch',
        sensor:        'mdi:chart-line',
        binary_sensor: 'mdi:motion-sensor',
        climate:       'mdi:thermometer',
        cover:         'mdi:garage',
        fan:           'mdi:fan',
        media_player:  'mdi:cast',
        input_boolean: 'mdi:toggle-switch',
      };
      return map[domain] ?? 'mdi:chart-line';
    }
  }

  // ─── Editor stub ────────────────────────────────────────────────────────────

  class ClaudeHistoryCardEditor extends HTMLElement {
    setConfig(config) { this._config = config; }
    set hass(hass)    { this._hass   = hass;   }
  }

  // ─── Registration ────────────────────────────────────────────────────────────

  customElements.define(CARD_TAG, ClaudeHistoryCard);
  customElements.define(EDITOR_TAG, ClaudeHistoryCardEditor);

  window.customCards = window.customCards || [];
  window.customCards.push({
    type:        CARD_TAG,
    name:        'Claude History Card',
    description: 'History graph with Claude AI aesthetic — timeline bar for binary sensors, line chart for numeric sensors, interactive time range pills.',
    preview:     false,
  });

  console.info(
    `%c CLAUDE HISTORY CARD %c v${CARD_VERSION} `,
    'background:#D97757;color:#fff;font-weight:700;padding:2px 6px;border-radius:4px 0 0 4px',
    'background:#1C1917;color:#D97757;font-weight:600;padding:2px 6px;border-radius:0 4px 4px 0'
  );
})();
