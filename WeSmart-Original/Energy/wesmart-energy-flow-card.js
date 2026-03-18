/**
 * WeSmart Energy Flow Card — Home Assistant Custom Card
 * Real-time energy flow visualization: grid, solar, battery, home.
 * All source nodes are optional (solar, grid, battery).
 * Only home_power is required.
 *
 * Config options:
 *   title           string   'Energy Flow'        Card title
 *   icon            string   'mdi:lightning-bolt-circle'
 *   theme           string   'dark'               dark | light | auto
 *   home_power      string   required             entity_id — home total consumption
 *   grid_power      string   optional             entity_id — positive = importing, negative = exporting
 *   solar_power     string   optional             entity_id — always positive (production)
 *   battery_power   string   optional             entity_id — positive = charging, negative = discharging
 *   battery_invert  boolean  false                true → invert battery sign convention
 *
 * Values can be in W or kW — auto-detected from unit_of_measurement attribute.
 *
 * Version: 1.0.0
 */

(() => {

const CARD_VERSION = '1.0.0';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Read a power entity and return its value normalized to kW.
 * Returns null if unavailable / missing.
 */
function getRawKw(hass, entityId) {
  if (!entityId || !hass) return null;
  const s = hass.states[entityId];
  if (!s) return null;
  if (s.state === 'unavailable' || s.state === 'unknown') return null;
  const val = parseFloat(s.state);
  if (isNaN(val)) return null;
  const unit = (s.attributes?.unit_of_measurement || 'kW').trim();
  return (unit === 'W' || unit === 'w') ? val / 1000 : val;
}

/**
 * Format a kW value for display.
 * ≥ 1 kW → "X.XX kW"
 * < 1 kW → "XXX W"
 * null   → "—"
 */
function fmt(kw) {
  if (kw === null) return '—';
  const abs = Math.abs(kw);
  if (abs >= 10)  return abs.toFixed(1)  + ' kW';
  if (abs >= 1)   return abs.toFixed(2)  + ' kW';
  if (abs >= 0.001) return (abs * 1000).toFixed(0) + ' W';
  return '0 W';
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = `
  :host {
    --orange:       #D97757;
    --orange-glow:  rgba(217, 119, 87, 0.25);
    --solar:        #F0C060;
    --solar-glow:   rgba(240, 192, 96, 0.25);
    --green:        #7EC8A0;
    --green-glow:   rgba(126, 200, 160, 0.22);
    --blue:         #60B4D8;
    --blue-glow:    rgba(96, 180, 216, 0.22);
    --r20: 20px; --r12: 12px; --r8: 8px;
    display: block;
    font-family: -apple-system, 'Söhne', 'Inter', BlinkMacSystemFont, sans-serif;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  /* ── Dark theme (default) ── */
  .card {
    --bg:     #292524;
    --surf:   #332E2A;
    --bdr:    rgba(255, 255, 255, 0.08);
    --txt:    #F5F0EB;
    --muted:  #A09080;
    --dim:    #6B5F56;
    --shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
    background:    var(--bg);
    border:        1px solid var(--bdr);
    border-radius: var(--r20);
    padding:       18px 18px 16px;
    box-shadow:    var(--shadow);
    overflow:      hidden;
  }

  /* ── Light theme ── */
  .card.theme-light {
    --bg:     #FFFEFA;
    --surf:   #F5F0EB;
    --bdr:    rgba(28, 25, 23, 0.09);
    --txt:    #1C1917;
    --muted:  #6B5F56;
    --dim:    #A09080;
    --shadow: 0 2px 16px rgba(0, 0, 0, 0.07), 0 0 0 1px rgba(0, 0, 0, 0.04);
  }

  /* ── Auto theme ── */
  @media (prefers-color-scheme: light) {
    .card.theme-auto {
      --bg:     #FFFEFA;
      --surf:   #F5F0EB;
      --bdr:    rgba(28, 25, 23, 0.09);
      --txt:    #1C1917;
      --muted:  #6B5F56;
      --dim:    #A09080;
      --shadow: 0 2px 16px rgba(0, 0, 0, 0.07), 0 0 0 1px rgba(0, 0, 0, 0.04);
    }
  }

  /* ── Header ── */
  .header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
  }

  .hdr-icon {
    width: 40px; height: 40px;
    border-radius: var(--r12);
    background: var(--surf);
    border: 1px solid var(--bdr);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }

  .hdr-icon ha-icon { --mdc-icon-size: 20px; color: var(--orange); }

  .hdr-titles { flex: 1; min-width: 0; }

  .hdr-title {
    font-size: 15px; font-weight: 600;
    color: var(--txt); letter-spacing: -0.01em;
  }

  .hdr-sub { font-size: 12px; color: var(--muted); margin-top: 2px; }

  .live-pill {
    display: flex; align-items: center; gap: 5px;
    font-size: 11px; color: var(--muted);
    background: var(--surf); border: 1px solid var(--bdr);
    border-radius: 20px; padding: 4px 10px; flex-shrink: 0;
  }

  .live-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: var(--green);
    animation: blink 2s ease-in-out infinite;
  }

  @keyframes blink {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.2; }
  }

  /* ── Flow diagram ── */
  .flow {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 16px;
  }

  /* Solar section — always in DOM, hidden when not configured */
  .solar-section { display: flex; flex-direction: column; align-items: center; }
  .solar-section.hidden { display: none; }

  /* Vertical connector solar → home */
  .v-conn {
    width: 2px; height: 28px;
    border-radius: 1px;
    background: var(--bdr);
    position: relative; overflow: hidden;
    transition: background 0.3s;
  }

  .v-conn.on { background: rgba(240, 192, 96, 0.35); }

  .v-conn.on::after {
    content: '';
    position: absolute; left: 50%; transform: translateX(-50%);
    width: 8px; height: 8px; border-radius: 50%;
    background: var(--solar);
    animation: flow-down 1s linear infinite;
  }

  @keyframes flow-down {
    0%   { top: -8px; }
    100% { top: 100%; }
  }

  /* Nodes row */
  .nodes-row {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
  }

  /* Horizontal connector */
  .h-conn {
    flex: 1; max-width: 60px; min-width: 12px;
    height: 2px; border-radius: 1px;
    background: var(--bdr);
    position: relative; overflow: hidden;
    transition: background 0.3s;
  }

  .h-conn.hidden { display: none; }

  .h-conn.on-orange { background: rgba(217, 119, 87, 0.35); }
  .h-conn.on-green  { background: rgba(126, 200, 160, 0.35); }
  .h-conn.on-blue   { background: rgba(96,  180, 216, 0.35); }

  .h-conn::after {
    content: '';
    position: absolute; top: 50%; transform: translateY(-50%);
    width: 8px; height: 8px; border-radius: 50%;
    opacity: 0; transition: opacity 0.3s;
  }

  /* Grid importing → Home: dot moves right */
  .h-conn.on-orange::after {
    background: var(--orange); opacity: 1;
    animation: flow-right 1s linear infinite;
  }

  /* Grid exporting ← Home: dot moves left */
  .h-conn.on-green::after {
    background: var(--green); opacity: 1;
    animation: flow-left 1s linear infinite;
  }

  /* Battery discharging → Home: dot moves right (battery is on the right) */
  .h-conn.on-blue::after {
    background: var(--blue); opacity: 1;
    animation: flow-left 1s linear infinite;
  }

  /* Battery charging ← Home: dot moves toward battery (right) */
  .h-conn.on-green-batt::after {
    background: var(--green); opacity: 1;
    animation: flow-right 1s linear infinite;
  }

  .h-conn.on-green-batt { background: rgba(126, 200, 160, 0.35); }

  @keyframes flow-right { 0% { left: -8px; } 100% { left: 100%; } }
  @keyframes flow-left  { 0% { left: 100%; } 100% { left: -8px; } }

  /* ── Node ── */
  .node {
    display: flex; flex-direction: column; align-items: center;
    gap: 5px; min-width: 68px;
  }

  .node.hidden { display: none; }

  .node-ring {
    width: 56px; height: 56px; border-radius: 50%;
    background: var(--surf);
    border: 2px solid var(--bdr);
    display: flex; align-items: center; justify-content: center;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
  }

  .node-ring ha-icon {
    --mdc-icon-size: 24px;
    color: var(--dim);
    transition: color 0.3s ease;
  }

  .node-lbl {
    font-size: 10px; font-weight: 600;
    color: var(--muted);
    text-transform: uppercase; letter-spacing: 0.06em;
  }

  .node-val {
    font-size: 13px; font-weight: 700;
    color: var(--txt); letter-spacing: -0.02em;
    text-align: center; min-height: 18px;
    transition: color 0.3s ease;
  }

  /* ── Node accent states via data-state attribute ── */

  /* Solar */
  .node[data-state="solar"] .node-ring     { border-color: var(--solar);  box-shadow: 0 0 16px var(--solar-glow); }
  .node[data-state="solar"] .node-ring ha-icon { color: var(--solar); }
  .node[data-state="solar"] .node-val      { color: var(--solar); }

  /* Grid importing */
  .node[data-state="import"] .node-ring    { border-color: var(--orange); box-shadow: 0 0 16px var(--orange-glow); }
  .node[data-state="import"] .node-ring ha-icon { color: var(--orange); }
  .node[data-state="import"] .node-val     { color: var(--orange); }

  /* Grid exporting */
  .node[data-state="export"] .node-ring    { border-color: var(--green);  box-shadow: 0 0 12px var(--green-glow); }
  .node[data-state="export"] .node-ring ha-icon { color: var(--green); }
  .node[data-state="export"] .node-val     { color: var(--green); }

  /* Battery charging */
  .node[data-state="charging"] .node-ring  { border-color: var(--green);  box-shadow: 0 0 12px var(--green-glow); }
  .node[data-state="charging"] .node-ring ha-icon { color: var(--green); }
  .node[data-state="charging"] .node-val   { color: var(--green); }

  /* Battery discharging */
  .node[data-state="discharging"] .node-ring { border-color: var(--blue); box-shadow: 0 0 12px var(--blue-glow); }
  .node[data-state="discharging"] .node-ring ha-icon { color: var(--blue); }
  .node[data-state="discharging"] .node-val  { color: var(--blue); }

  /* Home active */
  .node[data-state="home"] .node-ring      { border-color: rgba(245, 240, 235, 0.45); box-shadow: 0 0 10px rgba(245, 240, 235, 0.08); }
  .node[data-state="home"] .node-ring ha-icon { color: var(--txt); }

  /* ── Net balance bar ── */
  .sep { height: 1px; background: var(--bdr); margin: 0 0 12px; }

  .net {
    display: flex; align-items: center; justify-content: space-between;
    padding: 9px 12px;
    border-radius: var(--r8);
    background: var(--surf); border: 1px solid var(--bdr);
    margin-bottom: 12px;
  }

  .net-lbl {
    font-size: 12px; color: var(--muted);
    display: flex; align-items: center; gap: 6px;
  }

  .net-lbl ha-icon { --mdc-icon-size: 14px; }

  .net-val { font-size: 14px; font-weight: 700; letter-spacing: -0.02em; }
  .net-val.import  { color: var(--orange); }
  .net-val.export  { color: var(--green); }
  .net-val.none    { color: var(--muted); }

  /* ── Footer ── */
  .footer { display: flex; align-items: center; justify-content: space-between; }

  .footer-txt { font-size: 11px; color: var(--dim); }

  .brand { display: flex; align-items: center; gap: 5px; opacity: 0.4; }
  .brand svg { width: 14px; height: 14px; }
  .brand span { font-size: 10px; color: var(--dim); letter-spacing: 0.05em; }
`;

// ─── Custom Element ────────────────────────────────────────────────────────────

class WeSmartEnergyFlowCard extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._config = {};
    this._hass   = null;
    this._card   = null;
  }

  // ── HA lifecycle ──────────────────────────────────────────────────────────────

  static getStubConfig() {
    return {
      title:         'Energy Flow',
      theme:         'dark',
      home_power:    'sensor.home_power',
      grid_power:    'sensor.grid_power',
      solar_power:   'sensor.solar_power',
      battery_power: 'sensor.battery_power',
    };
  }

  setConfig(config) {
    if (!config.home_power) throw new Error('home_power entity is required');
    this._config = {
      title:          'Energy Flow',
      icon:           'mdi:lightning-bolt-circle',
      theme:          'dark',
      grid_power:     null,
      solar_power:    null,
      battery_power:  null,
      battery_invert: false,   // true → positive value means discharging
      ...config,
    };
    this._render();
  }

  set hass(hass) {
    this._hass = hass;
    this._update();
  }

  getCardSize() { return 4; }

  // ── Render ────────────────────────────────────────────────────────────────────

  _render() {
    const root = this.shadowRoot;
    root.innerHTML = '';

    const style = document.createElement('style');
    style.textContent = styles;
    root.appendChild(style);

    this._card = document.createElement('div');
    this._card.className = `card theme-${this._config.theme}`;
    this._card.innerHTML = this._html();
    root.appendChild(this._card);

    this._update();
  }

  _html() {
    const c          = this._config;
    const hasSolar   = !!c.solar_power;
    const hasGrid    = !!c.grid_power;
    const hasBattery = !!c.battery_power;

    return `
      <!-- Header -->
      <div class="header">
        <div class="hdr-icon">
          <ha-icon icon="${c.icon}"></ha-icon>
        </div>
        <div class="hdr-titles">
          <div class="hdr-title">${c.title}</div>
          <div class="hdr-sub" id="hdr-sub">—</div>
        </div>
        <div class="live-pill">
          <div class="live-dot"></div>
          Live
        </div>
      </div>

      <!-- Flow diagram -->
      <div class="flow">

        <!-- Solar node (optional) -->
        <div class="solar-section${hasSolar ? '' : ' hidden'}" id="solar-section">
          <div class="node" id="node-solar">
            <div class="node-ring">
              <ha-icon icon="mdi:solar-power-variant"></ha-icon>
            </div>
            <div class="node-lbl">Solar</div>
            <div class="node-val" id="val-solar">—</div>
          </div>
          <div class="v-conn" id="conn-solar"></div>
        </div>

        <!-- Nodes row: [Grid] —— [Home] —— [Battery] -->
        <div class="nodes-row">

          <!-- Grid (optional) -->
          <div class="node${hasGrid ? '' : ' hidden'}" id="node-grid">
            <div class="node-ring">
              <ha-icon icon="mdi:transmission-tower"></ha-icon>
            </div>
            <div class="node-lbl">Grid</div>
            <div class="node-val" id="val-grid">—</div>
          </div>

          <!-- Grid ↔ Home connector -->
          <div class="h-conn${hasGrid ? '' : ' hidden'}" id="conn-grid"></div>

          <!-- Home (always) -->
          <div class="node" id="node-home">
            <div class="node-ring">
              <ha-icon icon="mdi:home"></ha-icon>
            </div>
            <div class="node-lbl">Home</div>
            <div class="node-val" id="val-home">—</div>
          </div>

          <!-- Home ↔ Battery connector -->
          <div class="h-conn${hasBattery ? '' : ' hidden'}" id="conn-battery"></div>

          <!-- Battery (optional) -->
          <div class="node${hasBattery ? '' : ' hidden'}" id="node-battery">
            <div class="node-ring">
              <ha-icon id="batt-icon" icon="mdi:battery-medium"></ha-icon>
            </div>
            <div class="node-lbl">Battery</div>
            <div class="node-val" id="val-battery">—</div>
          </div>

        </div>
      </div>

      <!-- Net balance (only if grid is configured) -->
      <div id="net-section"${hasGrid ? '' : ' style="display:none"'}>
        <div class="sep"></div>
        <div class="net">
          <div class="net-lbl">
            <ha-icon icon="mdi:swap-horizontal"></ha-icon>
            Net balance
          </div>
          <div class="net-val none" id="net-val">—</div>
        </div>
      </div>

      <!-- Footer -->
      <div class="footer">
        <div class="footer-txt">WeSmart Energy Flow v${CARD_VERSION}</div>
        <div class="brand">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="#D97757"/>
            <circle cx="12" cy="12" r="4" fill="#D97757" opacity="0.6"/>
          </svg>
          <span>WeSmart</span>
        </div>
      </div>
    `;
  }

  // ── State update ──────────────────────────────────────────────────────────────

  _update() {
    if (!this._hass || !this._card) return;

    const c = this._config;
    const h = this._hass;

    // Normalized kW values (null = unavailable)
    const solar = getRawKw(h, c.solar_power);
    const grid  = getRawKw(h, c.grid_power);   // > 0 = importing, < 0 = exporting
    const home  = getRawKw(h, c.home_power);

    // Battery: normalize sign so that > 0 = charging, < 0 = discharging
    let battRaw = getRawKw(h, c.battery_power);
    const batt  = (battRaw !== null && c.battery_invert) ? -battRaw : battRaw;

    // ── Solar node ──
    if (c.solar_power) {
      const on = solar !== null && solar > 0.01;
      this._setState('node-solar', on ? 'solar' : '');
      this._q('#val-solar').textContent = fmt(solar);
      this._q('#conn-solar').className = `v-conn${on ? ' on' : ''}`;
    }

    // ── Grid node ──
    if (c.grid_power) {
      let state = '';
      if (grid !== null) {
        if (grid >  0.01) state = 'import';
        if (grid < -0.01) state = 'export';
      }
      this._setState('node-grid', state);
      this._q('#val-grid').textContent = fmt(grid);

      // Grid ↔ Home connector
      const conn = this._q('#conn-grid');
      if (conn) {
        conn.className = 'h-conn';
        if (state === 'import') conn.classList.add('on-orange');
        if (state === 'export') conn.classList.add('on-green');
      }

      // Net balance
      const netEl = this._q('#net-val');
      if (netEl) {
        if (grid === null) {
          netEl.className = 'net-val none';
          netEl.textContent = '—';
        } else if (grid > 0.01) {
          netEl.className = 'net-val import';
          netEl.textContent = `Importing ${fmt(grid)}`;
        } else if (grid < -0.01) {
          netEl.className = 'net-val export';
          netEl.textContent = `Exporting ${fmt(grid)}`;
        } else {
          netEl.className = 'net-val none';
          netEl.textContent = 'Balanced';
        }
      }
    }

    // ── Battery node ──
    if (c.battery_power) {
      let state = '';
      let battIcon = 'mdi:battery-medium';

      if (batt !== null) {
        if (batt > 0.01) {
          state = 'charging';
          battIcon = 'mdi:battery-charging';
        } else if (batt < -0.01) {
          state = 'discharging';
          battIcon = 'mdi:battery-arrow-down';
        }
      }

      this._setState('node-battery', state);
      this._q('#val-battery').textContent = fmt(batt !== null ? Math.abs(batt) : null);
      this._q('#batt-icon')?.setAttribute('icon', battIcon);

      // Home ↔ Battery connector
      const conn = this._q('#conn-battery');
      if (conn) {
        conn.className = 'h-conn';
        if (state === 'charging')    conn.classList.add('on-green-batt');
        if (state === 'discharging') conn.classList.add('on-blue');
      }
    }

    // ── Home node ──
    this._setState('node-home', home !== null ? 'home' : '');
    this._q('#val-home').textContent = fmt(home);

    // ── Header subtitle ──
    const sub = this._q('#hdr-sub');
    if (sub) {
      sub.textContent = home !== null
        ? `Consuming ${fmt(home)}`
        : 'Unavailable';
    }
  }

  // ── Helpers ───────────────────────────────────────────────────────────────────

  _setState(nodeId, state) {
    const node = this._q(`#${nodeId}`);
    if (node) node.dataset.state = state;
  }

  _q(selector) {
    return this._card?.querySelector(selector) ?? null;
  }
}

// ─── Config Editor (stub) ─────────────────────────────────────────────────────

class WeSmartEnergyFlowCardEditor extends HTMLElement {
  setConfig(config) { this._config = config; }
  set hass(hass)    { this._hass   = hass; }
}

// ─── Register ─────────────────────────────────────────────────────────────────

customElements.define('wesmart-energy-flow-card',        WeSmartEnergyFlowCard);
customElements.define('wesmart-energy-flow-card-editor', WeSmartEnergyFlowCardEditor);

window.customCards = window.customCards || [];
window.customCards.push({
  type:        'wesmart-energy-flow-card',
  name:        'WeSmart Energy Flow Card',
  description: 'Real-time energy flow visualization: grid, solar, battery and home. All source nodes are optional.',
  preview:     true,
  documentationURL: 'https://github.com/your-repo/wesmart-cards',
});

console.info(
  `%c WESMART ENERGY FLOW CARD %c v${CARD_VERSION} `,
  'background:#D97757;color:#fff;font-weight:700;padding:2px 6px;border-radius:4px 0 0 4px',
  'background:#1C1917;color:#D97757;font-weight:600;padding:2px 6px;border-radius:0 4px 4px 0'
);

})();
