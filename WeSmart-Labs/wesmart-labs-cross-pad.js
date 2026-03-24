/**
 * WeSmart Labs — Cross Pad
 * Transparent 4-zone button pad. A cross (vertical + horizontal line)
 * divides the space into four pressable quadrants.
 * No card shell, no border, no background — lives directly on the surface.
 *
 * STATUS: EXPERIMENTAL
 * YAML tag: wesmart-labs-cross-pad
 *
 * Config example:
 *   type: custom:wesmart-labs-cross-pad
 *   color: '#D97757'
 *   theme: auto          # dark | light | auto
 *   size: 160            # height in px (default 160)
 *   buttons:
 *     top_left:
 *       icon: mdi:lightbulb
 *       label: Luci
 *       entity: light.salone        # optional — drives on/off state color
 *     top_right:
 *       icon: mdi:fan
 *       label: Fan
 *       service: switch.toggle
 *       service_data:
 *         entity_id: switch.fan
 *     bottom_left:
 *       icon: mdi:lock
 *       label: Serratura
 *       entity: lock.porta
 *     bottom_right:
 *       icon: mdi:arrow-right
 *       label: Vai
 *       navigate: /lovelace/0
 *
 * @version 0.1.0
 */
(() => {

  // ─── Styles ───────────────────────────────────────────────────────────────
  const styles = `
    :host {
      display: block;
      font-family: -apple-system, 'Inter', BlinkMacSystemFont, 'Söhne', sans-serif;
      -webkit-font-smoothing: antialiased;
    }

    /* ── Wrapper: transparent, no card shell ─────────────────────────── */
    .cross-pad {
      position: relative;
      width: 100%;
      height: var(--pad-size, 160px);
      box-sizing: border-box;
      background: transparent;
    }

    /* ── Cross lines ─────────────────────────────────────────────────── */
    .cross-h,
    .cross-v {
      position: absolute;
      background: var(--border);
      pointer-events: none;
      z-index: 1;
    }

    .cross-h {
      top: 50%;
      left: 0;
      right: 0;
      height: 1px;
      transform: translateY(-0.5px);
    }

    .cross-v {
      left: 50%;
      top: 0;
      bottom: 0;
      width: 1px;
      transform: translateX(-0.5px);
    }

    /* ── Grid of 4 quadrants ─────────────────────────────────────────── */
    .quad-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-template-rows: 1fr 1fr;
      width: 100%;
      height: 100%;
      position: relative;
      z-index: 2;
    }

    /* ── Single quadrant ─────────────────────────────────────────────── */
    .quad {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 6px;
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
      user-select: none;
      position: relative;
      transition: opacity 0.12s ease;
    }

    .quad:active {
      opacity: 0.5;
    }

    /* subtle fill on press */
    .quad::after {
      content: '';
      position: absolute;
      inset: 0;
      background: var(--accent-soft);
      opacity: 0;
      transition: opacity 0.18s ease;
      pointer-events: none;
    }

    .quad:active::after {
      opacity: 1;
    }

    /* ── Icon ────────────────────────────────────────────────────────── */
    .quad ha-icon {
      --mdc-icon-size: 22px;
      color: var(--text-dim);
      transition: color 0.3s ease;
    }

    .quad.on ha-icon {
      color: var(--accent);
    }

    /* ── Label ───────────────────────────────────────────────────────── */
    .quad-label {
      font-size: 10px;
      font-weight: 500;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: var(--text-dim);
      line-height: 1;
      transition: color 0.3s ease;
    }

    .quad.on .quad-label {
      color: var(--text-muted);
    }
  `;

  // ─── Card Class ───────────────────────────────────────────────────────────

  class WeSmartLabsCrossPad extends HTMLElement {

    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this._config   = {};
      this._hass     = null;
      this._el       = null;
      this._rendered = false;
      this._mqHandler = null;
    }

    static getStubConfig() {
      return {
        color: '#D97757',
        theme: 'auto',
        size: 160,
        buttons: {
          top_left:     { icon: 'mdi:lightbulb', label: 'Luci' },
          top_right:    { icon: 'mdi:fan',        label: 'Fan' },
          bottom_left:  { icon: 'mdi:lock',       label: 'Serratura' },
          bottom_right: { icon: 'mdi:cog',        label: 'Config' },
        },
      };
    }

    setConfig(config) {
      this._config = {
        color:   '#D97757',
        theme:   'auto',
        size:    160,
        buttons: {},
        ...config,
      };
      this._applyPalette();
      this._render();
    }

    set hass(hass) {
      this._hass = hass;
      if (this._rendered) this._updateState();
    }

    disconnectedCallback() {
      if (this._mqHandler) {
        window.matchMedia('(prefers-color-scheme: light)')
          .removeEventListener('change', this._mqHandler);
      }
    }

    getCardSize() { return Math.max(1, Math.round((this._config.size || 160) / 50)); }

    // ── Color Engine (InfiniteColor) ───────────────────────────────────────

    _hexToHsl(hex) {
      let r = parseInt(hex.slice(1,3),16)/255;
      let g = parseInt(hex.slice(3,5),16)/255;
      let b = parseInt(hex.slice(5,7),16)/255;
      const max = Math.max(r,g,b), min = Math.min(r,g,b);
      let h, s, l = (max+min)/2;
      if (max === min) { h = s = 0; }
      else {
        const d = max-min;
        s = l > 0.5 ? d/(2-max-min) : d/(max+min);
        switch (max) {
          case r: h = ((g-b)/d + (g<b ? 6:0))/6; break;
          case g: h = ((b-r)/d + 2)/6; break;
          case b: h = ((r-g)/d + 4)/6; break;
        }
      }
      return { h: Math.round(h*360), s: Math.round(s*100), l: Math.round(l*100) };
    }

    _hsl(h,s,l)     { return `hsl(${h},${s}%,${l}%)`; }
    _hsla(h,s,l,a)  { return `hsla(${h},${s}%,${l}%,${a})`; }
    _clamp(v,mn,mx) { return Math.min(mx, Math.max(mn, v)); }

    _buildPalette(hex, isDark) {
      const { h, s, l } = this._hexToHsl(hex);
      const c = this._clamp.bind(this);
      if (isDark) {
        const aL = c(l, 50, 65);
        return {
          accent:     this._hsl(h, s, aL),
          accentSoft: this._hsla(h, s, aL, 0.09),
          border:     `hsla(0,0%,100%,0.10)`,
          textMuted:  this._hsl(h, c(Math.round(s*0.12),8,15), 62),
          textDim:    this._hsl(h, c(Math.round(s*0.10),6,12), 38),
        };
      } else {
        const aL = c(l, 35, 52);
        return {
          accent:     this._hsl(h, s, aL),
          accentSoft: this._hsla(h, s, aL, 0.07),
          border:     this._hsla(h, c(Math.round(s*0.12),8,16), 20, 0.12),
          textMuted:  this._hsl(h, c(Math.round(s*0.18),12,24), 42),
          textDim:    this._hsl(h, c(Math.round(s*0.12),8,16), 60),
        };
      }
    }

    _applyPalette() {
      const isDark = this._config.theme === 'auto'
        ? !window.matchMedia('(prefers-color-scheme: light)').matches
        : this._config.theme !== 'light';
      const p = this._buildPalette(this._config.color || '#D97757', isDark);
      const s = this.style;
      s.setProperty('--accent',      p.accent);
      s.setProperty('--accent-soft', p.accentSoft);
      s.setProperty('--border',      p.border);
      s.setProperty('--text-muted',  p.textMuted);
      s.setProperty('--text-dim',    p.textDim);
      s.setProperty('--pad-size',    `${this._config.size || 160}px`);
      if (this._config.theme === 'auto' && !this._mqHandler) {
        this._mqHandler = () => { this._applyPalette(); if (this._el) this._render(); };
        window.matchMedia('(prefers-color-scheme: light)')
          .addEventListener('change', this._mqHandler);
      }
    }

    // ── Render ────────────────────────────────────────────────────────────

    _render() {
      const shadow = this.shadowRoot;
      shadow.innerHTML = '';

      const styleEl = document.createElement('style');
      styleEl.textContent = styles;
      shadow.appendChild(styleEl);

      this._el = document.createElement('div');
      this._el.className = 'cross-pad';
      this._el.innerHTML = this._buildHTML();
      shadow.appendChild(this._el);

      this._bindEvents();
      this._rendered = true;
      if (this._hass) this._updateState();
    }

    _buildHTML() {
      const b = this._config.buttons || {};
      const positions = ['top_left', 'top_right', 'bottom_left', 'bottom_right'];

      const quads = positions.map(pos => {
        const btn   = b[pos] || {};
        const icon  = btn.icon  ? `<ha-icon icon="${btn.icon}"></ha-icon>` : '';
        const label = btn.label ? `<span class="quad-label">${btn.label}</span>` : '';
        return `<div class="quad" data-pos="${pos}">${icon}${label}</div>`;
      }).join('');

      return `
        <div class="cross-h"></div>
        <div class="cross-v"></div>
        <div class="quad-grid">${quads}</div>
      `;
    }

    // ── Events ────────────────────────────────────────────────────────────

    _bindEvents() {
      this._el.querySelectorAll('.quad').forEach(quad => {
        quad.addEventListener('click', () => this._handleTap(quad.dataset.pos));
      });
    }

    _handleTap(pos) {
      const btn = (this._config.buttons || {})[pos];
      if (!btn) return;

      // Navigate
      if (btn.navigate) {
        history.pushState(null, '', btn.navigate);
        this.dispatchEvent(new Event('location-changed', { bubbles: true, composed: true }));
        return;
      }

      // Explicit service call
      if (btn.service && this._hass) {
        const [domain, service] = btn.service.split('.');
        const data = { ...(btn.service_data || {}) };
        if (btn.entity && !data.entity_id) data.entity_id = btn.entity;
        this._hass.callService(domain, service, data);
        return;
      }

      // Auto toggle from entity
      if (btn.entity && this._hass) {
        const stateObj = this._hass.states[btn.entity];
        if (!stateObj) return;
        const domain = btn.entity.split('.')[0];
        const isOn   = stateObj.state === 'on';
        this._hass.callService(domain, isOn ? 'turn_off' : 'turn_on', { entity_id: btn.entity });
      }
    }

    // ── State Update ──────────────────────────────────────────────────────

    _updateState() {
      if (!this._el || !this._hass) return;
      const b = this._config.buttons || {};
      ['top_left', 'top_right', 'bottom_left', 'bottom_right'].forEach(pos => {
        const btn = b[pos];
        if (!btn?.entity) return;
        const quad = this._el.querySelector(`.quad[data-pos="${pos}"]`);
        if (!quad) return;
        const stateObj = this._hass.states[btn.entity];
        if (!stateObj) return;
        const isOn = ['on', 'open', 'unlocked', 'home', 'playing'].includes(stateObj.state);
        quad.classList.toggle('on', isOn);
      });
    }
  }

  // ─── Registration ──────────────────────────────────────────────────────────

  customElements.define('wesmart-labs-cross-pad', WeSmartLabsCrossPad);

  window.customCards = window.customCards || [];
  window.customCards.push({
    type:        'wesmart-labs-cross-pad',
    name:        'WeSmart Labs — Cross Pad',
    description: 'Transparent 4-zone pad divided by a cross. No card, no border — only two lines.',
    preview:     true,
  });

  console.info(
    `%c WeSmart Labs — Cross Pad %c v0.1.0 `,
    'background:#1C1917;color:#D97757;font-weight:700;border-radius:4px 0 0 4px;padding:2px 6px',
    'background:#D97757;color:#fff;font-weight:400;border-radius:0 4px 4px 0;padding:2px 6px'
  );

})();
