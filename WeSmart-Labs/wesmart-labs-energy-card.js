/**
 * WeSmart Labs — Energy Card
 * Advanced energy dashboard with live flow, usage gauge, and device list.
 * Inspired by the "Lumina Automation" / "Human-Centric Technical" aesthetic.
 *
 * STATUS: EXPERIMENTAL
 * YAML tag: wesmart-labs-energy-card
 *
 * @version 0.1.0
 */
(() => {
  'use strict';

  const CARD_TAG = 'wesmart-labs-energy-card';

  // ─── CSS ──────────────────────────────────────────────────────────────────────
  const CSS = `
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');

    :host {
      display: block;
      font-family: 'Space Grotesk', -apple-system, sans-serif;
      --primary: #00685f;
      --primary-soft: rgba(0, 104, 95, 0.08);
      --secondary: #9d4300;
      --secondary-soft: rgba(157, 67, 0, 0.08);
      --bg: #f7f9fb;
      --surface: #ffffff;
      --surface-low: #f2f4f6;
      --on-surface: #191c1e;
      --on-surface-variant: #3d4947;
      --border: #eceef0;
      --shadow: 0 4px 20px rgba(15, 23, 42, 0.05);
      --radius: 16px;
      --radius-sm: 8px;
    }

    .card-container {
      background: var(--bg);
      color: var(--on-surface);
      display: flex;
      flex-direction: column;
      gap: 24px;
      padding: 20px;
      box-sizing: border-box;
    }

    /* ── Utility ── */
    .headline-md { font-size: 24px; font-weight: 600; line-height: 32px; }
    .label-md { font-size: 14px; font-weight: 500; line-height: 20px; letter-spacing: 0.02em; }
    .label-sm { font-size: 12px; font-weight: 600; line-height: 16px; }
    .text-muted { color: var(--on-surface-variant); }
    .text-primary { color: var(--primary); }
    .text-secondary { color: var(--secondary); }

    /* ── Hero Flow ── */
    .section-hero {
      background: var(--surface);
      border-radius: var(--radius);
      padding: 24px;
      box-shadow: var(--shadow);
      border: 1px solid var(--border);
      position: relative;
      overflow: hidden;
    }

    .hero-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .badge-eco {
      background: var(--primary-soft);
      color: var(--primary);
      padding: 4px 12px;
      border-radius: 999px;
    }

    .flow-visual {
      position: relative;
      height: 200px;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .flow-svg {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
    }

    .energy-flow-path {
      stroke-dasharray: 8;
      animation: flow 20s linear infinite;
    }

    @keyframes flow {
      from { stroke-dashoffset: 100; }
      to { stroke-dashoffset: 0; }
    }

    .flow-nodes {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 40px;
      position: relative;
      z-index: 1;
      width: 100%;
    }

    .node {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
    }

    .node-icon-wrap {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid transparent;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
      background: var(--surface);
    }

    .node-solar .node-icon-wrap { background: var(--primary-soft); border-color: #0d9488; }
    .node-home .node-icon-wrap { border-color: var(--primary); box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
    .node-grid .node-icon-wrap { background: var(--secondary-soft); border-color: #f97316; }

    .node-icon { font-size: 32px; }
    .node-home .node-icon { font-size: 40px; color: var(--primary); }
    .node-solar .node-icon { color: #0d9488; }
    .node-grid .node-icon { color: #ea580c; }

    .node-value { font-weight: 600; font-size: 16px; }
    .node-label { font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; color: var(--on-surface-variant); }

    /* ── Bento Grid ── */
    .bento-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 16px;
    }

    @media (min-width: 768px) {
      .bento-grid { grid-template-columns: 1fr 1fr; }
    }

    .bento-card {
      background: var(--surface);
      border-radius: var(--radius);
      padding: 24px;
      box-shadow: var(--shadow);
      border: 1px solid var(--border);
    }

    .bento-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 16px;
    }

    /* ── Gauge ── */
    .gauge-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 8px 0;
    }

    .gauge-wrap {
      position: relative;
      width: 160px;
      height: 96px;
      display: flex;
      align-items: flex-end;
      justify-content: center;
      overflow: hidden;
    }

    .gauge-bg {
      position: absolute;
      width: 160px;
      height: 160px;
      border: 12px solid var(--surface-low);
      border-radius: 50%;
    }

    .gauge-fill {
      position: absolute;
      width: 160px;
      height: 160px;
      border: 12px solid var(--primary);
      border-radius: 50%;
      clip-path: inset(0 100% 0 0); /* Dynamic */
      transform: rotate(-180deg);
      transition: clip-path 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .gauge-text {
      text-align: center;
      padding-bottom: 8px;
    }

    .gauge-stats {
      display: flex;
      width: 100%;
      margin-top: 24px;
    }

    .stat-box {
      flex: 1;
      text-align: center;
    }

    .stat-box:first-child { border-right: 1px solid var(--border); }

    /* ── Split Bar ── */
    .split-badge {
      display: flex;
      align-items: center;
      gap: 4px;
      background: var(--surface-low);
      padding: 4px 8px;
      border-radius: 8px;
    }

    .split-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--primary); }

    .split-bar-container {
      height: 32px;
      width: 100%;
      background: var(--surface-low);
      border-radius: 999px;
      display: flex;
      overflow: hidden;
      margin: 24px 0 16px;
    }

    .split-segment { height: 100%; transition: width 0.8s ease; }
    .seg-solar   { background: #14b8a6; }
    .seg-battery { background: #f97316; }
    .seg-grid    { background: #94a3b8; }

    .split-legend {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
    }

    /* ── Device List ── */
    .section-devices {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .device-row {
      background: var(--surface);
      border-radius: var(--radius);
      padding: 16px;
      border: 1px solid var(--border);
      display: flex;
      align-items: center;
      justify-content: space-between;
      transition: all 0.3s;
      cursor: pointer;
    }

    .device-row:hover {
      box-shadow: 0 4px 12px rgba(0,0,0,0.08);
      transform: translateY(-2px);
    }

    .device-main {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .device-icon-wrap {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      background: var(--surface-low);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--primary);
      transition: background 0.3s, color 0.3s;
    }

    .device-row:hover .device-icon-wrap {
      background: var(--primary);
      color: #fff;
    }

    .device-info .d-name { font-weight: 500; font-size: 14px; }
    .device-info .d-status { font-size: 12px; }

    .device-metrics { text-align: right; }
    .device-metrics .d-power { font-weight: 700; font-size: 14px; }
    .device-metrics .d-today { font-size: 10px; font-weight: 700; text-transform: uppercase; color: var(--on-surface-variant); }

    /* ── Icons ── */
    .material-symbols-outlined {
      font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
    }
  `;

  // ─── Helpers ──────────────────────────────────────────────────────────────
  const formatKW = (val) => {
    const num = parseFloat(val);
    if (isNaN(num)) return '0.0 kW';
    if (Math.abs(num) >= 1000) return (num / 1000).toFixed(1) + ' kW';
    return num.toFixed(0) + ' W';
  };

  const formatKWh = (val) => {
    const num = parseFloat(val);
    return (isNaN(num) ? '0.0' : num.toFixed(1)) + ' kWh';
  };

  // ─── Card Class ───────────────────────────────────────────────────────────
  class WeSmartLabsEnergyCard extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this._config = {};
      this._hass = null;
      this._elements = {};
    }

    setConfig(config) {
      this._config = {
        capacity_w: 6000,
        ...config
      };
      this._render();
    }

    set hass(hass) {
      this._hass = hass;
      this._updateState();
    }

    getCardSize() { return 12; }

    _render() {
      const shadow = this.shadowRoot;
      shadow.innerHTML = '';

      const style = document.createElement('style');
      style.textContent = CSS;
      shadow.appendChild(style);

      const container = document.createElement('div');
      container.className = 'card-container';
      container.innerHTML = this._buildHTML();
      shadow.appendChild(container);
      
      this._elements = {
        solarValue: shadow.querySelector('#solar-val'),
        homeValue: shadow.querySelector('#home-val'),
        gridValue: shadow.querySelector('#grid-val'),
        gaugeFill: shadow.querySelector('#gauge-fill'),
        gaugePct: shadow.querySelector('#gauge-pct'),
        realtimeVal: shadow.querySelector('#realtime-val'),
        peakVal: shadow.querySelector('#peak-val'),
        selfPctBadge: shadow.querySelector('#self-pct'),
        splitSolar: shadow.querySelector('#split-solar'),
        splitBattery: shadow.querySelector('#split-battery'),
        splitGrid: shadow.querySelector('#split-grid'),
        splitSolarVal: shadow.querySelector('#split-solar-val'),
        splitBatteryVal: shadow.querySelector('#split-battery-val'),
        splitGridVal: shadow.querySelector('#split-grid-val'),
        deviceList: shadow.querySelector('#device-list'),
        flowGridPath: shadow.querySelector('#flow-grid-path'),
        flowSolarPath: shadow.querySelector('#flow-solar-path')
      };

      this._bindEvents();
    }

    _buildHTML() {
      const cfg = this._config;

      return `
        <!-- HERO FLOW -->
        <section class="section-hero">
          <div class="hero-header">
            <h2 class="headline-md text-primary">Live Energy Flow</h2>
            <div class="badge-eco label-sm">Eco Mode Active</div>
          </div>
          <div class="flow-visual">
            <svg class="flow-svg" viewBox="0 0 400 200" preserveAspectRatio="none">
              <path id="flow-solar-path" class="energy-flow-path" d="M100 50 Q 200 50 200 100" stroke="#0D9488" stroke-width="2" fill="none"></path>
              <path id="flow-grid-path" class="energy-flow-path" d="M300 100 Q 200 100 200 100" stroke="#94A3B8" stroke-width="2" fill="none"></path>
              <path class="energy-flow-path" d="M200 100 L 200 150" stroke="#EA580C" stroke-width="2" fill="none"></path>
            </svg>
            <div class="flow-nodes">
              <div class="node node-solar">
                <div class="node-icon-wrap">
                  <span class="material-symbols-outlined node-icon">wb_sunny</span>
                </div>
                <span class="node-value" id="solar-val">0.0 kW</span>
                <span class="node-label">Solar</span>
              </div>
              <div class="node node-home">
                <div class="node-icon-wrap">
                  <span class="material-symbols-outlined node-icon">home</span>
                </div>
                <span class="node-value text-primary headline-md" id="home-val">0.0 kW</span>
                <span class="node-label">Usage</span>
              </div>
              <div class="node node-grid">
                <div class="node-icon-wrap">
                  <span class="material-symbols-outlined node-icon">bolt</span>
                </div>
                <span class="node-value" id="grid-val">0.0 kW</span>
                <span class="node-label">Grid</span>
              </div>
            </div>
          </div>
        </section>

        <!-- BENTO STATS -->
        <div class="bento-grid">
          <!-- USAGE GAUGE -->
          <div class="bento-card">
            <div class="bento-header">
              <h3 class="label-md text-muted">Usage Now</h3>
              <span class="material-symbols-outlined text-muted">more_horiz</span>
            </div>
            <div class="gauge-container">
              <div class="gauge-wrap">
                <div class="gauge-bg"></div>
                <div class="gauge-fill" id="gauge-fill"></div>
                <div class="gauge-text">
                  <div class="headline-md text-primary" id="gauge-pct">0%</div>
                  <div class="label-sm text-muted">of capacity</div>
                </div>
              </div>
              <div class="gauge-stats">
                <div class="stat-box">
                  <p class="label-sm text-muted">Real-time</p>
                  <p class="label-md text-primary" id="realtime-val">0 W</p>
                </div>
                <div class="stat-box">
                  <p class="label-sm text-muted">Peak today</p>
                  <p class="label-md" id="peak-val">0 W</p>
                </div>
              </div>
            </div>
          </div>

          <!-- TODAY SPLIT -->
          <div class="bento-card">
            <div class="bento-header">
              <h3 class="label-md text-muted">Today's Split</h3>
              <div class="split-badge">
                <div class="split-dot"></div>
                <span class="label-sm" id="self-pct" style="font-weight:bold; font-size:10px">0% SELF</span>
              </div>
            </div>
            <div class="split-bar-container">
              <div class="split-segment seg-solar" id="split-solar" style="width: 0%"></div>
              <div class="split-segment seg-battery" id="split-battery" style="width: 0%"></div>
              <div class="split-segment seg-grid" id="split-grid" style="width: 0%"></div>
            </div>
            <div class="split-legend">
              <div>
                <p class="label-sm text-muted" style="text-transform:uppercase; font-size:10px">Solar</p>
                <p class="label-md" id="split-solar-val">0.0 kWh</p>
              </div>
              <div>
                <p class="label-sm text-muted" style="text-transform:uppercase; font-size:10px">Battery</p>
                <p class="label-md" id="split-battery-val">0.0 kWh</p>
              </div>
              <div>
                <p class="label-sm text-muted" style="text-transform:uppercase; font-size:10px">Grid</p>
                <p class="label-md" id="split-grid-val">0.0 kWh</p>
              </div>
            </div>
          </div>
        </div>

        <!-- DEVICES -->
        <section class="section-devices">
          <h2 class="headline-md">Active Devices</h2>
          <div class="device-list" id="device-list">
            <!-- List items built in _updateState -->
          </div>
        </section>
      `;
    }

    _updateState() {
      if (!this._hass || !this._elements.solarValue) return;

      const cfg = this._config;
      const h = this._hass.states;

      // 1. Flow
      const solar = cfg.flow?.solar ? parseFloat(h[cfg.flow.solar]?.state || 0) : 0;
      const grid = cfg.flow?.grid ? parseFloat(h[cfg.flow.grid]?.state || 0) : 0;
      const home = cfg.flow?.home ? parseFloat(h[cfg.flow.home]?.state || 0) : (solar - grid);

      this._elements.solarValue.textContent = formatKW(solar);
      this._elements.homeValue.textContent = formatKW(home);
      this._elements.gridValue.textContent = formatKW(grid);

      // Flow direction for Grid (Import/Export)
      if (this._elements.flowGridPath) {
        this._elements.flowGridPath.style.animationDirection = grid > 0 ? 'reverse' : 'normal';
        this._elements.flowGridPath.style.stroke = grid > 0 ? '#94A3B8' : '#EA580C';
      }
      if (this._elements.flowSolarPath) {
        this._elements.flowSolarPath.style.animationPlayState = solar > 10 ? 'running' : 'paused';
      }

      // 2. Gauge
      const cap = cfg.capacity_w || 6000;
      const pct = Math.min(100, Math.round((home / cap) * 100));
      this._elements.gaugePct.textContent = `${pct}%`;
      this._elements.realtimeVal.textContent = home.toFixed(0) + ' W';
      
      // Update clip-path for half-circle gauge
      // We use clip-path inset to reveal the circle from right to left
      // But it's a bit complex with SVG/CSS. A simpler approach for the half circle:
      // The path is already rotated -180deg. 
      // 0% -> inset(0 100% 0 0)
      // 100% -> inset(0 0% 0 0)
      const reveal = 100 - pct;
      this._elements.gaugeFill.style.clipPath = `inset(0 ${reveal}% 0 0)`;

      // 3. Today Split
      const sToday = cfg.split_today?.solar ? parseFloat(h[cfg.split_today.solar]?.state || 0) : 0;
      const bToday = cfg.split_today?.battery ? parseFloat(h[cfg.split_today.battery]?.state || 0) : 0;
      const gToday = cfg.split_today?.grid ? parseFloat(h[cfg.split_today.grid]?.state || 0) : 0;
      const totalToday = sToday + bToday + gToday || 1;

      const pS = (sToday / totalToday * 100);
      const pB = (bToday / totalToday * 100);
      const pG = (gToday / totalToday * 100);

      this._elements.splitSolar.style.width = `${pS}%`;
      this._elements.splitBattery.style.width = `${pB}%`;
      this._elements.splitGrid.style.width = `${pG}%`;

      this._elements.splitSolarVal.textContent = formatKWh(sToday);
      this._elements.splitBatteryVal.textContent = formatKWh(bToday);
      this._elements.splitGridVal.textContent = formatKWh(gToday);

      const selfPct = Math.round(((sToday + bToday) / totalToday) * 100);
      this._elements.selfPctBadge.textContent = `${selfPct}% SELF`;

      // 4. Devices
      this._updateDevices();
    }

    _updateDevices() {
      const devices = this._config.devices || [];
      const list = this._elements.deviceList;
      if (!list) return;

      const html = devices.map((d, i) => {
        const stateObj = this._hass.states[d.entity];
        const powerObj = this._hass.states[d.power_sensor];
        const dailyObj = this._hass.states[d.daily_sensor];

        const isOn = stateObj?.state === 'on' || stateObj?.state === 'active';
        const power = powerObj ? parseFloat(powerObj.state || 0) : 0;
        const daily = dailyObj ? parseFloat(dailyObj.state || 0) : 0;

        return `
          <div class="device-row" data-entity="${d.entity}" style="opacity: ${isOn ? '1' : '0.6'}">
            <div class="device-main">
              <div class="device-icon-wrap" style="${isOn ? 'background: var(--primary-soft)' : ''}">
                <ha-icon icon="${d.icon || 'mdi:power'}"></ha-icon>
              </div>
              <div class="device-info">
                <p class="d-name">${d.name || d.entity.split('.')[1]}</p>
                <p class="d-status ${isOn ? 'text-primary' : 'text-muted'}" style="font-weight: ${isOn ? '500' : '400'}">
                  ${isOn ? (d.active_label || 'Active') : (d.idle_label || 'Idle')}
                </p>
              </div>
            </div>
            <div class="device-metrics">
              <p class="d-power">${power.toFixed(0)} W</p>
              <p class="d-today">Today: ${daily.toFixed(1)} kWh</p>
            </div>
          </div>
        `;
      }).join('');

      list.innerHTML = html;
    }

    _bindEvents() {
      this.shadowRoot.addEventListener('click', e => {
        const row = e.target.closest('.device-row');
        if (row && this._hass) {
          const entityId = row.dataset.entity;
          this._hass.callService('homeassistant', 'toggle', { entity_id: entityId });
        }
      });
    }
  }

  customElements.define(CARD_TAG, WeSmartLabsEnergyCard);

  window.customCards = window.customCards || [];
  window.customCards.push({
    type: CARD_TAG,
    name: 'WeSmart Labs — Energy Card',
    description: '[LABS] Advanced Energy Dashboard with live flow, usage gauge, and device list.',
    preview: false,
  });

  console.info(
    `%c WESMART ENERGY LABS %c 0.1.0 `,
    'background:#00685f;color:#fff;font-weight:700;padding:2px 6px;border-radius:4px 0 0 4px',
    'background:#191c1e;color:#89f5e7;font-weight:600;padding:2px 6px;border-radius:0 4px 4px 0'
  );
})();
