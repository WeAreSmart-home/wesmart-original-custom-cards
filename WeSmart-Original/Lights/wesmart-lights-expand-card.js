/**
 * WeSmart Lights Expand Card - Home Assistant Custom Card
 * Multi-entity light card with per-row animated inline controls
 * Click a row to expand brightness + color-temp sliders
 * Supports dark / light / auto themes
 * Version: 1.0.0
 */

const EXPAND_CARD_VERSION = '1.0.0';

// ─── Styles ───────────────────────────────────────────────────────────────────

const expandStyles = `
  :host {
    --claude-orange:      #D97757;
    --claude-orange-glow: rgba(217, 119, 87, 0.25);
    --claude-orange-soft: rgba(217, 119, 87, 0.12);
    --claude-radius:      20px;
    --claude-radius-sm:   12px;
    --claude-radius-xs:   8px;
    --transition:         all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    display: block;
    font-family: -apple-system, 'Söhne', 'Inter', BlinkMacSystemFont, sans-serif;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  /* ── Dark theme (default) ── */
  .card {
    --bg:            #292524;
    --surface:       #332E2A;
    --border:        rgba(255, 255, 255, 0.08);
    --text:          #F5F0EB;
    --text-muted:    #A09080;
    --text-dim:      #6B5F56;
    --row-active-bg: rgba(217, 119, 87, 0.07);
    --row-hover-bg:  rgba(255, 255, 255, 0.03);
    --track-off:     #332E2A;
    --thumb-off:     #6B5F56;
    --shadow:        0 8px 32px rgba(0, 0, 0, 0.4);

    background:    var(--bg);
    border:        1px solid var(--border);
    border-radius: var(--claude-radius);
    padding:       18px 18px 16px;
    position:      relative;
    overflow:      hidden;
    box-shadow:    var(--shadow);
    transition:    border-color 0.3s ease, box-shadow 0.3s ease;
  }

  /* ── Light theme ── */
  .card.theme-light {
    --bg:            #FFFEFA;
    --surface:       #F5F0EB;
    --border:        rgba(28, 25, 23, 0.09);
    --text:          #1C1917;
    --text-muted:    #6B5F56;
    --text-dim:      #A09080;
    --row-active-bg: rgba(217, 119, 87, 0.06);
    --row-hover-bg:  rgba(28, 25, 23, 0.03);
    --track-off:     #E8E2DC;
    --thumb-off:     #B8AFA8;
    --shadow:        0 2px 16px rgba(0, 0, 0, 0.07), 0 0 0 1px rgba(0, 0, 0, 0.04);
  }

  /* ── Auto theme ── */
  @media (prefers-color-scheme: light) {
    .card.theme-auto {
      --bg:            #FFFEFA;
      --surface:       #F5F0EB;
      --border:        rgba(28, 25, 23, 0.09);
      --text:          #1C1917;
      --text-muted:    #6B5F56;
      --text-dim:      #A09080;
      --row-active-bg: rgba(217, 119, 87, 0.06);
      --row-hover-bg:  rgba(28, 25, 23, 0.03);
      --track-off:     #E8E2DC;
      --thumb-off:     #B8AFA8;
      --shadow:        0 2px 16px rgba(0, 0, 0, 0.07), 0 0 0 1px rgba(0, 0, 0, 0.04);
    }
  }

  /* ── Header ── */
  .header {
    display:         flex;
    align-items:     center;
    justify-content: space-between;
    margin-bottom:   14px;
  }

  .header-left {
    display:     flex;
    align-items: center;
    gap:         12px;
    flex:        1;
    min-width:   0;
  }

  .header-icon-wrap {
    width:          40px;
    height:         40px;
    border-radius:  var(--claude-radius-sm);
    background:     var(--surface);
    border:         1px solid var(--border);
    display:        flex;
    align-items:    center;
    justify-content:center;
    flex-shrink:    0;
    transition:     var(--transition);
  }

  .header-icon-wrap.has-active {
    background:   rgba(217, 119, 87, 0.12);
    border-color: rgba(217, 119, 87, 0.28);
  }

  .header-icon-wrap ha-icon {
    --mdc-icon-size: 20px;
    color:      var(--text-dim);
    transition: color 0.3s ease;
  }

  .header-icon-wrap.has-active ha-icon { color: var(--claude-orange); }

  .header-titles { flex: 1; min-width: 0; }

  .header-title {
    font-size:      15px;
    font-weight:    600;
    color:          var(--text);
    letter-spacing: -0.01em;
    white-space:    nowrap;
    overflow:       hidden;
    text-overflow:  ellipsis;
  }

  .header-subtitle {
    font-size:  12px;
    color:      var(--text-muted);
    margin-top: 2px;
    transition: color 0.3s ease;
  }

  /* ── Master toggle ── */
  .toggle-switch {
    position:                  relative;
    width:                     48px;
    height:                    26px;
    flex-shrink:               0;
    cursor:                    pointer;
    -webkit-tap-highlight-color: transparent;
  }

  .toggle-switch input { opacity: 0; width: 0; height: 0; position: absolute; }

  .toggle-track {
    position:      absolute;
    inset:         0;
    background:    var(--track-off);
    border:        1px solid var(--border);
    border-radius: 13px;
    transition:    var(--transition);
  }

  .toggle-thumb {
    position:      absolute;
    top:           3px;
    left:          3px;
    width:         18px;
    height:        18px;
    border-radius: 50%;
    background:    var(--thumb-off);
    transition:    var(--transition);
    box-shadow:    0 1px 4px rgba(0, 0, 0, 0.25);
  }

  .toggle-switch.active .toggle-track {
    background:   rgba(217, 119, 87, 0.18);
    border-color: rgba(217, 119, 87, 0.4);
  }

  .toggle-switch.active .toggle-thumb {
    left:       23px;
    background: var(--claude-orange);
    box-shadow: 0 0 10px rgba(217, 119, 87, 0.5);
  }

  /* ── Separator ── */
  .separator {
    height:     1px;
    background: var(--border);
    margin:     0 0 10px;
  }

  /* ── Lights list ── */
  .lights-list {
    display:        flex;
    flex-direction: column;
    gap:            2px;
  }

  /* ── Light item (row + panel wrapper) ── */
  .light-item {
    border-radius: var(--claude-radius-xs);
    overflow:      hidden;
  }

  /* ── Light row ── */
  .light-row {
    display:                   flex;
    align-items:               center;
    gap:                       12px;
    padding:                   9px 8px 9px 6px;
    border-radius:             var(--claude-radius-xs);
    transition:                background 0.2s ease, border-radius 0.3s ease;
    cursor:                    pointer;
    -webkit-tap-highlight-color: transparent;
  }

  .light-row:hover   { background: var(--row-hover-bg); }
  .light-row.light-on { background: var(--row-active-bg); }

  /* flatten bottom corners when panel is open */
  .light-item.expanded .light-row {
    border-radius: var(--claude-radius-xs) var(--claude-radius-xs) 0 0;
  }

  .light-row.unavailable {
    opacity:        0.38;
    pointer-events: none;
  }

  /* row icon */
  .row-icon {
    width:           34px;
    height:          34px;
    border-radius:   10px;
    background:      var(--surface);
    border:          1px solid var(--border);
    display:         flex;
    align-items:     center;
    justify-content: center;
    flex-shrink:     0;
    transition:      var(--transition);
  }

  .light-row.light-on .row-icon {
    background:   rgba(217, 119, 87, 0.10);
    border-color: rgba(217, 119, 87, 0.25);
  }

  .row-icon ha-icon {
    --mdc-icon-size: 17px;
    color:      var(--text-dim);
    transition: color 0.25s ease;
  }

  .light-row.light-on .row-icon ha-icon { color: var(--claude-orange); }

  /* row info */
  .row-info  { flex: 1; min-width: 0; }

  .row-name {
    font-size:     13px;
    font-weight:   500;
    color:         var(--text);
    white-space:   nowrap;
    overflow:      hidden;
    text-overflow: ellipsis;
  }

  .row-state {
    font-size:     11px;
    color:         var(--text-dim);
    margin-top:    1px;
    white-space:   nowrap;
    overflow:      hidden;
    text-overflow: ellipsis;
    transition:    color 0.2s ease;
  }

  .light-row.light-on .row-state {
    color:   var(--claude-orange);
    opacity: 0.85;
  }

  /* ── Chevron (animated) ── */
  .expand-chevron {
    width:       22px;
    height:      22px;
    display:     flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    color:       var(--text-dim);
    transition:  transform 0.35s cubic-bezier(0.4, 0, 0.2, 1),
                 color     0.25s ease;
  }

  .expand-chevron ha-icon {
    --mdc-icon-size: 16px;
    color: inherit;
  }

  /* ↓ rotate on expand */
  .light-item.expanded .expand-chevron {
    transform: rotate(180deg);
    color:     var(--claude-orange);
  }

  /* ── Row toggle (small) ── */
  .row-toggle {
    position:                  relative;
    width:                     44px;
    height:                    24px;
    flex-shrink:               0;
    cursor:                    pointer;
    -webkit-tap-highlight-color: transparent;
  }

  .row-toggle input { opacity: 0; width: 0; height: 0; position: absolute; }

  .row-toggle .toggle-track  { border-radius: 12px; }
  .row-toggle .toggle-thumb  { width: 16px; height: 16px; top: 3px; left: 3px; }
  .row-toggle.active .toggle-thumb { left: 21px; }

  /* ── Expand panel ────────────────────────────────────────────────────────── */
  .expand-panel {
    max-height:   0;
    overflow:     hidden;
    opacity:      0;
    background:   var(--surface);
    border-top:   1px solid transparent;

    /* three properties animated together */
    transition:
      max-height   0.4s  cubic-bezier(0.4, 0, 0.2, 1),
      opacity      0.3s  ease,
      border-color 0.35s ease;
  }

  .light-item.expanded .expand-panel {
    max-height:        180px;
    opacity:           1;
    border-top-color:  var(--border);
  }

  /* panel content slides up into place */
  .panel-content {
    padding:    10px 12px 14px 52px;
    display:    flex;
    flex-direction: column;
    gap:        12px;
    transform:  translateY(-10px);
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .light-item.expanded .panel-content {
    transform: translateY(0);
  }

  /* message when light is off */
  .panel-off-msg {
    font-size:   11px;
    color:       var(--text-dim);
    font-style:  italic;
    padding:     2px 0;
  }

  /* ── Slider row ── */
  .slider-row {
    display:     flex;
    align-items: center;
    gap:         10px;
  }

  .slider-icon {
    width:           16px;
    height:          16px;
    display:         flex;
    align-items:     center;
    justify-content: center;
    flex-shrink:     0;
    color:           var(--text-dim);
  }

  .slider-icon ha-icon {
    --mdc-icon-size: 14px;
    color: inherit;
  }

  /* invisible hit area around the actual track */
  .slider-track-wrap {
    flex:         1;
    height:       24px;
    display:      flex;
    align-items:  center;
    cursor:       pointer;
    touch-action: none;
    user-select:  none;
  }

  .slider-track {
    width:         100%;
    height:        4px;
    background:    var(--border);
    border-radius: 2px;
    position:      relative;
  }

  .slider-fill {
    height:        100%;
    background:    var(--claude-orange);
    border-radius: 2px;
    pointer-events:none;
    min-width:     0;
  }

  .slider-thumb {
    position:      absolute;
    top:           50%;
    transform:     translate(-50%, -50%);
    width:         14px;
    height:        14px;
    border-radius: 50%;
    background:    #fff;
    border:        2.5px solid var(--claude-orange);
    box-shadow:    0 0 8px rgba(217, 119, 87, 0.35);
    pointer-events:none;
    transition:    box-shadow 0.15s ease;
    will-change:   left;
  }

  /* thumb glow while dragging */
  .slider-track-wrap.dragging .slider-thumb {
    box-shadow: 0 0 0 5px rgba(217, 119, 87, 0.18),
                0 0 14px rgba(217, 119, 87, 0.55);
  }

  .slider-value {
    font-size:           11px;
    color:               var(--text-muted);
    width:               40px;
    text-align:          right;
    flex-shrink:         0;
    font-variant-numeric:tabular-nums;
  }

  /* ── Color-temperature slider ── */
  .ct-track .slider-track {
    /* warm → neutral → cool gradient replaces the fill bar */
    background: linear-gradient(to right, #FFA726, #FFE5A0, #FFFFFF, #C9E4FF);
    height:     5px;
  }

  .ct-track .slider-fill { display: none; }

  .ct-track .slider-thumb {
    border-color: rgba(180, 180, 180, 0.9);
    box-shadow:   0 1px 6px rgba(0, 0, 0, 0.28);
    background:   #fff;
  }

  .ct-track.dragging .slider-thumb {
    box-shadow: 0 0 0 5px rgba(200, 200, 200, 0.2),
                0 2px 10px rgba(0, 0, 0, 0.3);
  }

  /* ── Footer ── */
  .footer {
    display:         flex;
    align-items:     center;
    justify-content: space-between;
    margin-top:      12px;
    padding-top:     12px;
    border-top:      1px solid var(--border);
  }

  .footer-info {
    font-size:   11px;
    color:       var(--text-dim);
    display:     flex;
    align-items: center;
    gap:         4px;
  }

  .brand-mark {
    display:     flex;
    align-items: center;
    gap:         5px;
    opacity:     0.4;
  }

  .brand-mark svg   { width: 14px; height: 14px; }

  .brand-mark span {
    font-size:       10px;
    color:           var(--text-dim);
    letter-spacing:  0.05em;
  }
`;

// ─── Custom Element ────────────────────────────────────────────────────────────

class WeSmartLightsExpandCard extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._config   = {};
    this._hass     = null;
    this._entities = [];
    this._expanded = null;   // index of currently expanded row (or null)
    this._dragging = null;   // { idx, type, wrap, value }
  }

  // ── HA lifecycle ─────────────────────────────────────────────────────────────

  static getConfigElement() {
    return document.createElement('wesmart-lights-expand-card-editor');
  }

  static getStubConfig() {
    return {
      title:    'Lights',
      entities: ['light.example_1', 'light.example_2'],
    };
  }

  setConfig(config) {
    if (!config.entities?.length) throw new Error('entities array is required');
    this._config = {
      title: 'Lights',
      icon:  'mdi:lightbulb-group',
      theme: 'dark',
      ...config,
    };
    this._entities = this._config.entities.map(e =>
      typeof e === 'string' ? { entity: e } : e
    );
    this._render();
  }

  set hass(hass) {
    this._hass = hass;
    this._updateState();
  }

  getCardSize() {
    return 1 + Math.ceil((this._entities.length * 52 + 100) / 50);
  }

  // ── Render ───────────────────────────────────────────────────────────────────

  _render() {
    const shadow = this.shadowRoot;
    shadow.innerHTML = '';

    const style = document.createElement('style');
    style.textContent = expandStyles;
    shadow.appendChild(style);

    this._card = document.createElement('div');
    this._card.className = `card theme-${this._config.theme}`;
    this._card.innerHTML = this._getHTML();
    shadow.appendChild(this._card);

    this._bindEvents();
    this._updateState();
  }

  _getHTML() {
    const cfg = this._config;

    const rowsHTML = this._entities.map((e, i) => `
      <div class="light-item" data-index="${i}" id="item-${i}">

        <div class="light-row" id="row-${i}">
          <div class="row-icon">
            <ha-icon id="icon-${i}" icon="mdi:lightbulb-outline"></ha-icon>
          </div>
          <div class="row-info">
            <div class="row-name"  id="name-${i}">${e.name || e.entity}</div>
            <div class="row-state" id="state-${i}">—</div>
          </div>
          <label class="row-toggle" id="toggle-${i}">
            <input type="checkbox" id="input-${i}">
            <div class="toggle-track"></div>
            <div class="toggle-thumb"></div>
          </label>
          <div class="expand-chevron">
            <ha-icon icon="mdi:chevron-down"></ha-icon>
          </div>
        </div>

        <div class="expand-panel" id="panel-${i}">
          <div class="panel-content">

            <div class="panel-off-msg" id="off-msg-${i}" style="display:none">
              Turn on to adjust
            </div>

            <!-- Brightness slider -->
            <div class="slider-row" id="bri-row-${i}" style="display:none">
              <div class="slider-icon">
                <ha-icon icon="mdi:brightness-6"></ha-icon>
              </div>
              <div class="slider-track-wrap"
                   id="bri-wrap-${i}"
                   data-index="${i}"
                   data-type="brightness">
                <div class="slider-track">
                  <div class="slider-fill"  id="bri-fill-${i}"  style="width:0%"></div>
                  <div class="slider-thumb" id="bri-thumb-${i}" style="left:0%"></div>
                </div>
              </div>
              <div class="slider-value" id="bri-val-${i}">—</div>
            </div>

            <!-- Color-temperature slider -->
            <div class="slider-row" id="ct-row-${i}" style="display:none">
              <div class="slider-icon">
                <ha-icon icon="mdi:thermometer"></ha-icon>
              </div>
              <div class="slider-track-wrap ct-track"
                   id="ct-wrap-${i}"
                   data-index="${i}"
                   data-type="ct">
                <div class="slider-track">
                  <div class="slider-fill"  id="ct-fill-${i}"  style="width:50%"></div>
                  <div class="slider-thumb" id="ct-thumb-${i}" style="left:50%"></div>
                </div>
              </div>
              <div class="slider-value" id="ct-val-${i}">—</div>
            </div>

          </div>
        </div>

      </div>
    `).join('');

    return `
      <div class="header">
        <div class="header-left">
          <div class="header-icon-wrap" id="header-icon-wrap">
            <ha-icon icon="${cfg.icon}"></ha-icon>
          </div>
          <div class="header-titles">
            <div class="header-title">${cfg.title}</div>
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

      <div class="lights-list" id="lights-list">
        ${rowsHTML}
      </div>

      <div class="footer">
        <div class="footer-info">
          <ha-icon icon="mdi:lightbulb-multiple-outline" style="--mdc-icon-size:13px"></ha-icon>
          <span>${this._entities.length} light${this._entities.length !== 1 ? 's' : ''}</span>
        </div>
        <div class="brand-mark">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="#D97757"/>
            <circle cx="12" cy="12" r="4" fill="#D97757" opacity="0.6"/>
          </svg>
          <span>WeSmart</span>
        </div>
      </div>
    `;
  }

  // ── State update ─────────────────────────────────────────────────────────────

  _updateState() {
    if (!this._hass || !this._card) return;

    let onCount    = 0;
    let validCount = 0;

    this._entities.forEach((cfg, i) => {
      const stateObj = this._hass.states[cfg.entity];
      if (!stateObj) return;

      validCount++;
      const attrs     = stateObj.attributes || {};
      const isOn      = stateObj.state === 'on';
      const isUnavail = stateObj.state === 'unavailable';
      if (isOn) onCount++;

      const name = cfg.name
        || attrs.friendly_name
        || cfg.entity.split('.')[1]?.replace(/_/g, ' ')
        || cfg.entity;

      const icon = cfg.icon || attrs.icon
        || (isOn ? 'mdi:lightbulb' : 'mdi:lightbulb-outline');

      let stateText = 'Off';
      if (isUnavail) {
        stateText = 'Unavailable';
      } else if (isOn) {
        const parts = [];
        if (attrs.brightness != null) parts.push(`${Math.round(attrs.brightness / 2.55)}%`);
        if (attrs.color_temp  != null) parts.push(`${Math.round(1000000 / attrs.color_temp)}K`);
        stateText = parts.length ? parts.join(' · ') : 'On';
      }

      const row    = this._q(`#row-${i}`);
      const toggle = this._q(`#toggle-${i}`);
      const input  = this._q(`#input-${i}`);

      if (row) {
        row.classList.toggle('light-on',    isOn && !isUnavail);
        row.classList.toggle('unavailable', isUnavail);
      }

      this._q(`#icon-${i}`)?.setAttribute('icon', icon);

      const nameEl = this._q(`#name-${i}`);
      if (nameEl) nameEl.textContent = name;

      const stateEl = this._q(`#state-${i}`);
      if (stateEl) stateEl.textContent = stateText;

      if (toggle) toggle.classList.toggle('active', isOn);
      if (input)  input.checked = isOn;

      this._updateSliders(i, stateObj);
    });

    // header subtitle
    const subtitle = this._q('#header-subtitle');
    if (subtitle) {
      subtitle.textContent = onCount === 0
        ? 'All off'
        : onCount === validCount
          ? 'All on'
          : `${onCount} of ${validCount} on`;
    }

    const iconWrap = this._q('#header-icon-wrap');
    if (iconWrap) iconWrap.classList.toggle('has-active', onCount > 0);

    const masterToggle = this._q('#master-toggle');
    const masterInput  = this._q('#master-input');
    if (masterToggle) masterToggle.classList.toggle('active', onCount > 0);
    if (masterInput)  masterInput.checked = onCount > 0;
  }

  _updateSliders(i, stateObj) {
    const attrs  = stateObj.attributes || {};
    const isOn   = stateObj.state === 'on';

    const offMsg = this._q(`#off-msg-${i}`);
    const briRow = this._q(`#bri-row-${i}`);
    const ctRow  = this._q(`#ct-row-${i}`);

    // "turn on" hint
    if (offMsg) offMsg.style.display = isOn ? 'none' : '';

    // ── brightness ──
    const hasBri = isOn && attrs.brightness != null;
    if (briRow) briRow.style.display = hasBri ? '' : 'none';
    if (hasBri) {
      const pct = Math.round(attrs.brightness / 2.55);
      this._setSlider(i, 'bri', pct);
      const val = this._q(`#bri-val-${i}`);
      if (val) val.textContent = `${pct}%`;
    }

    // ── color temperature ──
    const hasCT = isOn && attrs.color_temp != null;
    if (ctRow) ctRow.style.display = hasCT ? '' : 'none';
    if (hasCT) {
      const minMired = attrs.min_mireds || 153;
      const maxMired = attrs.max_mireds || 500;
      // pct=0 → warm (maxMired), pct=100 → cool (minMired)
      const pct = Math.round(((maxMired - attrs.color_temp) / (maxMired - minMired)) * 100);
      this._setSlider(i, 'ct', Math.max(0, Math.min(100, pct)));
      const kelvin = Math.round(1000000 / attrs.color_temp);
      const val    = this._q(`#ct-val-${i}`);
      if (val) val.textContent = `${kelvin}K`;
    }
  }

  _setSlider(i, prefix, pct) {
    const fill  = this._q(`#${prefix}-fill-${i}`);
    const thumb = this._q(`#${prefix}-thumb-${i}`);
    if (fill)  fill.style.width = `${pct}%`;
    if (thumb) thumb.style.left  = `${pct}%`;
  }

  // ── Events ───────────────────────────────────────────────────────────────────

  _bindEvents() {
    // master toggle
    this._q('#master-toggle').addEventListener('click', () => {
      if (!this._hass) return;
      const anyOn  = this._entities.some(c => this._hass.states[c.entity]?.state === 'on');
      const action = anyOn ? 'turn_off' : 'turn_on';
      this._entities.forEach(c => {
        this._hass.callService('light', action, { entity_id: c.entity });
      });
    });

    // per-row toggle (stopPropagation so it doesn't trigger expand)
    this._entities.forEach((cfg, i) => {
      const toggle = this._q(`#toggle-${i}`);
      if (!toggle) return;
      toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!this._hass) return;
        const s = this._hass.states[cfg.entity];
        if (!s || s.state === 'unavailable') return;
        this._hass.callService('light', s.state === 'on' ? 'turn_off' : 'turn_on', { entity_id: cfg.entity });
      });
    });

    const list = this._q('#lights-list');
    if (!list) return;

    // row click → expand / collapse panel
    list.addEventListener('click', (e) => {
      if (e.target.closest('.row-toggle'))       return;
      if (e.target.closest('.slider-track-wrap')) return;
      const row  = e.target.closest('.light-row');
      if (!row) return;
      const item = row.closest('.light-item');
      if (!item) return;
      const idx = parseInt(item.dataset.index, 10);
      if (!isNaN(idx)) this._toggleExpand(idx);
    });

    // ── slider drag (pointer events delegated to the list) ──

    list.addEventListener('pointerdown', (e) => {
      const wrap = e.target.closest('.slider-track-wrap');
      if (!wrap) return;
      e.preventDefault();
      const idx  = parseInt(wrap.dataset.index, 10);
      const type = wrap.dataset.type;
      if (isNaN(idx)) return;
      wrap.setPointerCapture(e.pointerId);
      wrap.classList.add('dragging');
      this._dragging = { idx, type, wrap, value: null };
      this._handleSliderMove(e);
    });

    list.addEventListener('pointermove', (e) => {
      if (!this._dragging) return;
      this._handleSliderMove(e);
    });

    list.addEventListener('pointerup', (e) => {
      if (!this._dragging) return;
      this._handleSliderMove(e);
      this._dragging.wrap.classList.remove('dragging');
      this._applySlider();
      this._dragging = null;
    });

    list.addEventListener('pointercancel', () => {
      if (this._dragging) {
        this._dragging.wrap.classList.remove('dragging');
        this._dragging = null;
      }
    });
  }

  // ── Expand / collapse ─────────────────────────────────────────────────────────

  _toggleExpand(idx) {
    const item = this._q(`#item-${idx}`);
    if (!item) return;

    if (this._expanded === idx) {
      item.classList.remove('expanded');
      this._expanded = null;
    } else {
      // close previously open item
      if (this._expanded !== null) {
        this._q(`#item-${this._expanded}`)?.classList.remove('expanded');
      }
      item.classList.add('expanded');
      this._expanded = idx;
    }
  }

  // ── Slider logic ──────────────────────────────────────────────────────────────

  _handleSliderMove(e) {
    if (!this._dragging) return;
    const { idx, type, wrap } = this._dragging;

    const rect = wrap.getBoundingClientRect();
    let pct = (e.clientX - rect.left) / rect.width;
    pct = Math.max(0, Math.min(1, pct));
    const pctRound = Math.round(pct * 100);

    if (type === 'brightness') {
      this._setSlider(idx, 'bri', pctRound);
      const val = this._q(`#bri-val-${idx}`);
      if (val) val.textContent = `${pctRound}%`;
      this._dragging.value = Math.round(pct * 255);

    } else { // ct
      const attrs    = this._hass?.states[this._entities[idx]?.entity]?.attributes || {};
      const minMired = attrs.min_mireds || 153;
      const maxMired = attrs.max_mireds || 500;
      // pct=0 → warm (maxMired), pct=1 → cool (minMired)
      const mired  = Math.round(maxMired - pct * (maxMired - minMired));
      const kelvin = Math.round(1000000 / mired);
      this._setSlider(idx, 'ct', pctRound);
      const val = this._q(`#ct-val-${idx}`);
      if (val) val.textContent = `${kelvin}K`;
      this._dragging.value = mired;
    }
  }

  _applySlider() {
    if (!this._dragging || !this._hass) return;
    const { idx, type, value } = this._dragging;
    const entityId = this._entities[idx]?.entity;
    if (!entityId || value == null) return;

    const params = { entity_id: entityId };
    if (type === 'brightness') params.brightness  = value;
    else                       params.color_temp   = value;

    this._hass.callService('light', 'turn_on', params);
  }

  // ── Helper ────────────────────────────────────────────────────────────────────

  _q(selector) {
    return this._card?.querySelector(selector) ?? null;
  }
}

// ─── Config Editor (stub) ─────────────────────────────────────────────────────

class WeSmartLightsExpandCardEditor extends HTMLElement {
  setConfig(config) { this._config = config; }
  set hass(hass)    { this._hass   = hass;   }
}

// ─── Register ─────────────────────────────────────────────────────────────────

customElements.define('wesmart-lights-expand-card',        WeSmartLightsExpandCard);
customElements.define('wesmart-lights-expand-card-editor', WeSmartLightsExpandCardEditor);

window.customCards = window.customCards || [];
window.customCards.push({
  type:        'wesmart-lights-expand-card',
  name:        'Claude Lights Expand Card',
  description: 'Multi-entity light card with animated per-row inline controls (brightness + color temp).',
  preview:     true,
});

console.info(
  `%c CLAUDE LIGHTS EXPAND CARD %c v${EXPAND_CARD_VERSION} `,
  'background:#D97757;color:#fff;font-weight:700;padding:2px 6px;border-radius:4px 0 0 4px',
  'background:#1C1917;color:#D97757;font-weight:600;padding:2px 6px;border-radius:0 4px 4px 0'
);
