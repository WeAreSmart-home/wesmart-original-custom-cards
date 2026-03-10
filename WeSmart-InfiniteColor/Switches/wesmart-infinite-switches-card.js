/**
 * WeSmart Infinite Switches Card - Home Assistant Custom Card
 * Multi-entity switch card with interactive toggle icons.
 * Part of the WeSmart InfiniteColor system — full palette derived from one base color.
 * Version: 1.0.0
 *
 * Config:
 *   type: custom:wesmart-infinite-switches-card
 *   color: "#D97757"    # any hex (optional)
 *   theme: dark | light | auto
 *   title: Switches
 *   entities:
 *     - switch.living_room
 *     - entity: switch.bedroom
 *       name: Bedroom
 */

(() => {
  'use strict';

  const CARD_VERSION = '1.0.0';

  const SWITCH_DEFS = {
    switch:        { icon: 'mdi:toggle-switch'   },
    outlet:        { icon: 'mdi:power-socket-eu' },
    light:         { icon: 'mdi:lightbulb'       },
    fan:           { icon: 'mdi:fan'             },
    input_boolean: { icon: 'mdi:toggle-switch'   },
    _default:      { icon: 'mdi:power'           },
  };

  function getSwitchDef(deviceClass, domain) {
    return SWITCH_DEFS[deviceClass] || SWITCH_DEFS[domain] || SWITCH_DEFS._default;
  }

  const styles = `
  :host {
    --radius:    20px;
    --radius-sm: 12px;
    --radius-xs: 8px;
    --transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    display: block;
    font-family: -apple-system, 'Söhne', 'Inter', BlinkMacSystemFont, sans-serif;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .card {
    background:    var(--bg);
    border:        1px solid var(--border);
    border-radius: var(--radius);
    padding:       18px 18px 0;
    box-shadow:    var(--shadow);
    transition:    var(--transition);
  }

  .header { display: flex; align-items: center; gap: 12px; margin-bottom: 14px; }

  .header-icon-wrap {
    width:           40px;
    height:          40px;
    border-radius:   var(--radius-sm);
    background:      var(--surface);
    border:          1px solid var(--border);
    display:         flex;
    align-items:     center;
    justify-content: center;
  }

  .header-icon-wrap ha-icon { --mdc-icon-size: 20px; color: var(--accent); }

  .header-title { font-size: 15px; font-weight: 600; color: var(--text); flex: 1; }

  .separator { height: 1px; background: var(--border); margin: 0 0 10px; }

  .list { display: flex; flex-direction: column; gap: 2px; }

  .row {
    display:       flex;
    align-items:   center;
    gap:           12px;
    padding:       8px;
    border-radius: var(--radius-xs);
    transition:    background 0.2s ease;
    cursor:        pointer;
  }

  .row:hover { background: var(--row-hover); }
  .row.unavailable { opacity: 0.4; pointer-events: none; }

  .icon-btn {
    width:           36px;
    height:          36px;
    border-radius:   10px;
    background:      var(--surface);
    border:          1px solid var(--border);
    display:         flex;
    align-items:     center;
    justify-content: center;
    transition:      var(--transition);
    cursor:          pointer;
    position:        relative;
    overflow:        hidden;
  }

  .row.on .icon-btn {
    border-color: var(--accent);
    background:   var(--accent-soft);
    box-shadow:   0 0 12px var(--accent-glow);
  }

  .icon-btn ha-icon { --mdc-icon-size: 18px; color: var(--text-dim); transition: var(--transition); }
  .row.on .icon-btn ha-icon { color: var(--accent); }

  .row-info { flex: 1; min-width: 0; }

  .row-name {
    font-size: 13px; font-weight: 500; color: var(--text);
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }

  .row-status { font-size: 11px; color: var(--text-dim); margin-top: 1px; text-transform: capitalize; }

  .status-pill {
    font-size:      10px;
    font-weight:    700;
    padding:        3px 10px;
    border-radius:  20px;
    background:     var(--surface);
    color:          var(--text-dim);
    letter-spacing: 0.03em;
    text-transform: uppercase;
    transition:     var(--transition);
  }

  .row.on .status-pill { background: var(--accent); color: white; }

  .footer {
    display: flex; align-items: center; justify-content: space-between;
    margin-top: 12px; padding: 10px 0 14px; border-top: 1px solid var(--border);
  }

  .footer-info { display: flex; align-items: center; gap: 5px; font-size: 11px; color: var(--text-dim); }
  .footer-info ha-icon { --mdc-icon-size: 13px; }

  .brand-mark { display: flex; align-items: center; gap: 5px; opacity: 0.35; }
  .brand-mark svg  { width: 13px; height: 13px; }
  .brand-mark span { font-size: 10px; font-weight: 700; color: var(--text-muted); letter-spacing: 0.8px; }
  `;

  class WeSmartInfiniteSwitchesCard extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this._config   = {};
      this._hass     = null;
      this._entities = [];
    }

    setConfig(config) {
      if (!config.entities?.length) throw new Error('Add entities');
      this._config = { title: 'Switches', icon: 'mdi:toggle-switch', theme: 'dark', color: '#D97757', ...config };
      this._entities = this._config.entities.map(e => typeof e === 'string' ? { entity: e } : e);
      this._applyPalette();
      this._render();
    }

    set hass(hass) { this._hass = hass; this._updateState(); }
    getCardSize()  { return Math.ceil(this._entities.length * 0.5) + 2; }

    // ── Color Engine ────────────────────────────────────────────────────────

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

    _hsl(h, s, l)       { return `hsl(${h},${s}%,${l}%)`; }
    _hsla(h, s, l, a)   { return `hsla(${h},${s}%,${l}%,${a})`; }
    _clamp(v, min, max) { return Math.min(max, Math.max(min, v)); }

    _buildPalette(hex, isDark) {
      const { h, s, l } = this._hexToHsl(hex);
      const c = this._clamp.bind(this);
      if (isDark) {
        const accentL = c(l, 50, 65);
        return {
          accent:     this._hsl(h, s, accentL),
          accentSoft: this._hsla(h, s, accentL, 0.12),
          accentGlow: this._hsla(h, s, accentL, 0.25),
          bg:         this._hsl(h, c(Math.round(s * 0.35), 25, 45), 11),
          surface:    this._hsl(h, c(Math.round(s * 0.28), 20, 38), 16),
          border:     `hsla(0,0%,100%,0.08)`,
          text:       this._hsl(h, c(Math.round(s * 0.08), 5, 10), 93),
          textMuted:  this._hsl(h, c(Math.round(s * 0.12), 8, 15), 65),
          textDim:    this._hsl(h, c(Math.round(s * 0.10), 6, 12), 42),
          rowHover:   `hsla(0,0%,100%,0.03)`,
          shadow:     `0 8px 32px ${this._hsla(h, s, 5, 0.45)}`,
        };
      } else {
        const accentL = c(l, 35, 52);
        return {
          accent:     this._hsl(h, s, accentL),
          accentSoft: this._hsla(h, s, accentL, 0.10),
          accentGlow: this._hsla(h, s, accentL, 0.20),
          bg:         this._hsl(h, c(Math.round(s * 0.08), 5, 10), 99),
          surface:    this._hsl(h, c(Math.round(s * 0.12), 8, 15), 95),
          border:     this._hsla(h, c(Math.round(s * 0.15), 10, 20), 25, 0.09),
          text:       this._hsl(h, c(Math.round(s * 0.25), 18, 35), 12),
          textMuted:  this._hsl(h, c(Math.round(s * 0.20), 15, 28), 40),
          textDim:    this._hsl(h, c(Math.round(s * 0.15), 10, 20), 60),
          rowHover:   this._hsla(h, c(Math.round(s * 0.15), 10, 20), 25, 0.03),
          shadow:     `0 2px 16px ${this._hsla(h, s, 20, 0.07)}, 0 0 0 1px ${this._hsla(h, s, 20, 0.04)}`,
        };
      }
    }

    _applyPalette() {
      const isDark = this._config.theme === 'auto'
        ? !window.matchMedia('(prefers-color-scheme: light)').matches
        : this._config.theme !== 'light';
      this._palette = this._buildPalette(this._config.color, isDark);
      const p = this._palette;
      this.style.setProperty('--accent',     p.accent);
      this.style.setProperty('--accent-soft',p.accentSoft);
      this.style.setProperty('--accent-glow',p.accentGlow);
      this.style.setProperty('--bg',         p.bg);
      this.style.setProperty('--surface',    p.surface);
      this.style.setProperty('--border',     p.border);
      this.style.setProperty('--text',       p.text);
      this.style.setProperty('--text-muted', p.textMuted);
      this.style.setProperty('--text-dim',   p.textDim);
      this.style.setProperty('--row-hover',  p.rowHover);
      this.style.setProperty('--shadow',     p.shadow);

      if (this._config.theme === 'auto' && !this._mqHandler) {
        this._mqHandler = () => { this._applyPalette(); };
        window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', this._mqHandler);
      }
    }

    _brandSVG() {
      const fill = this._palette?.accent ?? '#D97757';
      return `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.3 2.45a.74.74 0 0 0-1.38 0l-1.18 3.27H11.3L10.1 2.45a.74.74 0 0 0-1.38 0L7.3 6.37 4.1 7.56a.74.74 0 0 0 0 1.38l3.2 1.19.82 2.28-3.26 1.18a.74.74 0 0 0 0 1.38l3.26 1.18L9.3 19.2l-2.1.76a.74.74 0 0 0 0 1.38l3.26 1.18.45 1.24a.74.74 0 0 0 1.38 0l.45-1.24 3.26-1.18a.74.74 0 0 0 0-1.38l-2.1-.76 1.18-3.27 3.26-1.18a.74.74 0 0 0 0-1.38l-3.26-1.18.82-2.28 3.2-1.19a.74.74 0 0 0 0-1.38l-3.2-1.19-1.37-3.92z" fill="${fill}"/>
      </svg>`;
    }

    // ── Render ──────────────────────────────────────────────────────────────

    _render() {
      const shadow = this.shadowRoot;
      shadow.innerHTML = '';

      const style = document.createElement('style');
      style.textContent = styles;
      shadow.appendChild(style);

      this._card = document.createElement('div');
      this._card.className = 'card';

      const rowsHTML = this._entities.map((e, i) => `
        <div class="row" data-index="${i}" id="row-${i}">
          <div class="icon-btn" id="icon-btn-${i}">
            <ha-icon id="icon-${i}" icon="mdi:power"></ha-icon>
          </div>
          <div class="row-info">
            <div class="row-name" id="name-${i}">${e.name || e.entity}</div>
            <div class="row-status" id="status-${i}">—</div>
          </div>
          <div class="status-pill" id="pill-${i}">OFF</div>
        </div>
      `).join('');

      const n = this._entities.length;
      this._card.innerHTML = `
        <div class="header">
          <div class="header-icon-wrap"><ha-icon icon="${this._config.icon}"></ha-icon></div>
          <div class="header-title">${this._config.title}</div>
        </div>
        <div class="separator"></div>
        <div class="list">${rowsHTML}</div>
        <div class="footer">
          <div class="footer-info">
            <ha-icon icon="mdi:toggle-switch"></ha-icon>
            <span>${n} switch${n !== 1 ? 'es' : ''}</span>
          </div>
          <div class="brand-mark">${this._brandSVG()}<span>WeSmart</span></div>
        </div>
      `;

      shadow.appendChild(this._card);
      this._bindEvents();
      this._updateState();
    }

    _updateState() {
      if (!this._hass || !this._card) return;

      this._entities.forEach((cfg, i) => {
        const stateObj = this._hass.states[cfg.entity];
        const row      = this._q(`#row-${i}`);
        if (!row || !stateObj) return;

        const domain    = cfg.entity.split('.')[0];
        const isOn      = stateObj.state === 'on';
        const isUnavail = stateObj.state === 'unavailable' || stateObj.state === 'unknown';
        const attrs     = stateObj.attributes || {};
        const def       = getSwitchDef(attrs.device_class, domain);

        row.classList.toggle('on',          isOn);
        row.classList.toggle('unavailable', isUnavail);

        const iconEl = this._q(`#icon-${i}`);
        if (iconEl) iconEl.setAttribute('icon', cfg.icon || attrs.icon || def.icon);

        const nameEl = this._q(`#name-${i}`);
        if (nameEl) nameEl.textContent = cfg.name || attrs.friendly_name || cfg.entity;

        const statusEl = this._q(`#status-${i}`);
        if (statusEl) statusEl.textContent = isUnavail ? 'Unavailable' : stateObj.state;

        const pillEl = this._q(`#pill-${i}`);
        if (pillEl) pillEl.textContent = isOn ? 'ON' : 'OFF';
      });
    }

    _bindEvents() {
      this._entities.forEach((cfg, i) => {
        this._q(`#icon-btn-${i}`)?.addEventListener('click', (e) => {
          e.stopPropagation();
          this._hass.callService('homeassistant', 'toggle', { entity_id: cfg.entity });
        });
        this._q(`#row-${i}`)?.addEventListener('click', () => {
          const ev = new Event('hass-more-info', { bubbles: true, composed: true });
          ev.detail = { entityId: cfg.entity };
          this.dispatchEvent(ev);
        });
      });
    }

    _q(selector) { return this.shadowRoot.querySelector(selector); }
  }

  customElements.define('wesmart-infinite-switches-card', WeSmartInfiniteSwitchesCard);

  window.customCards = window.customCards || [];
  window.customCards.push({
    type:        'wesmart-infinite-switches-card',
    name:        'WeSmart Infinite Switches Card',
    description: 'Multi-entity toggle card with dynamic InfiniteColor palette.',
    preview:     true,
  });

  console.info(
    `%c WESMART INFINITE SWITCHES CARD %c v${CARD_VERSION} `,
    'background:#D97757;color:#fff;font-weight:700;padding:2px 6px;border-radius:4px 0 0 4px',
    'background:#1C1917;color:#D97757;font-weight:600;padding:2px 6px;border-radius:0 4px 4px 0'
  );

})();
