/**
 * WeSmart Infinite Climate Compact Card - Home Assistant Custom Card
 * Space-efficient multi-entity climate card.
 * Part of the WeSmart InfiniteColor system — full palette derived from one base color.
 * Cooling uses fixed blue (#60B4D8) as semantic secondary.
 * Version: 1.0.0
 *
 * Config:
 *   type: custom:wesmart-infinite-climate-compact-card
 *   color: "#D97757"    # any hex (optional)
 *   theme: dark | light | auto
 *   title: "Climate Control"
 *   entities:
 *     - entity: climate.soggiorno
 *       name: Soggiorno (optional)
 */

(() => {
  'use strict';

  const CARD_VERSION = '1.0.0';

  const ACTION_ICONS = {
    heating: 'mdi:fire',
    cooling: 'mdi:snowflake',
    idle:    'mdi:thermostat',
    off:     'mdi:power-off',
  };

  const styles = `
  :host {
    --blue:       #60B4D8;
    --radius:     20px;
    --radius-sm:  12px;
    --radius-xs:  8px;
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
  }

  .header { display: flex; align-items: center; gap: 12px; margin-bottom: 14px; }

  .header-icon-wrap {
    width: 40px; height: 40px; border-radius: var(--radius-sm);
    background: var(--surface); border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center;
  }

  .header-icon-wrap ha-icon { --mdc-icon-size: 20px; color: var(--accent); }

  .header-title { font-size: 15px; font-weight: 600; color: var(--text); flex: 1; }

  .separator { height: 1px; background: var(--border); margin-bottom: 10px; }

  .list { display: flex; flex-direction: column; gap: 4px; }

  .row {
    display: flex; align-items: center; gap: 12px;
    padding: 10px 8px; border-radius: var(--radius-xs);
    transition: background 0.2s ease; cursor: pointer;
  }

  .row:hover { background: var(--row-hover); }
  .row.unavailable { opacity: 0.4; pointer-events: none; }

  .row-icon-wrap {
    width: 36px; height: 36px; border-radius: 10px;
    background: var(--surface); border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }

  .row-icon-wrap ha-icon { --mdc-icon-size: 18px; color: var(--text-dim); }

  .row-info { flex: 1; min-width: 0; }

  .row-name {
    font-size: 13px; font-weight: 500; color: var(--text);
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }

  .row-status { font-size: 11px; color: var(--text-dim); margin-top: 1px; }

  .temp-controls { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }

  .current-temp-badge {
    font-size: 12px; font-weight: 600; color: var(--text-muted);
    background: var(--surface); padding: 2px 8px; border-radius: 12px;
    border: 1px solid var(--border); min-width: 42px; text-align: center;
  }

  .target-controls {
    display: flex; align-items: center;
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--radius-xs); overflow: hidden;
  }

  .step-btn {
    width: 28px; height: 32px; display: flex; align-items: center;
    justify-content: center; cursor: pointer; color: var(--text-muted);
    transition: background 0.2s ease; border: none; background: transparent;
  }

  .step-btn:hover { background: rgba(255,255,255,0.05); color: var(--text); }
  .step-btn:active { transform: scale(0.9); }
  .step-btn ha-icon { --mdc-icon-size: 16px; }

  .target-val {
    min-width: 44px; text-align: center; font-size: 14px;
    font-weight: 700; color: var(--text); font-variant-numeric: tabular-nums;
  }

  .unit { font-size: 10px; font-weight: 400; opacity: 0.6; margin-left: 1px; }

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

  class WeSmartInfiniteClimateCompactCard extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this._config   = {};
      this._hass     = null;
      this._entities = [];
    }

    setConfig(config) {
      if (!config.entities?.length) throw new Error('Add entities');
      this._config = {
        title: 'Climate Control', icon: 'mdi:thermostat',
        theme: 'dark', color: '#D97757',
        ...config,
      };
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
          accent:   this._hsl(h, s, accentL),
          bg:       this._hsl(h, c(Math.round(s * 0.35), 25, 45), 11),
          surface:  this._hsl(h, c(Math.round(s * 0.28), 20, 38), 16),
          border:   `hsla(0,0%,100%,0.08)`,
          text:     this._hsl(h, c(Math.round(s * 0.08), 5, 10), 93),
          textMuted:this._hsl(h, c(Math.round(s * 0.12), 8, 15), 65),
          textDim:  this._hsl(h, c(Math.round(s * 0.10), 6, 12), 42),
          rowHover: `hsla(0,0%,100%,0.03)`,
          shadow:   `0 8px 32px ${this._hsla(h, s, 5, 0.45)}`,
        };
      } else {
        const accentL = c(l, 35, 52);
        return {
          accent:   this._hsl(h, s, accentL),
          bg:       this._hsl(h, c(Math.round(s * 0.08), 5, 10), 99),
          surface:  this._hsl(h, c(Math.round(s * 0.12), 8, 15), 95),
          border:   this._hsla(h, c(Math.round(s * 0.15), 10, 20), 25, 0.09),
          text:     this._hsl(h, c(Math.round(s * 0.25), 18, 35), 12),
          textMuted:this._hsl(h, c(Math.round(s * 0.20), 15, 28), 40),
          textDim:  this._hsl(h, c(Math.round(s * 0.15), 10, 20), 60),
          rowHover: this._hsla(h, c(Math.round(s * 0.15), 10, 20), 25, 0.03),
          shadow:   `0 2px 16px ${this._hsla(h, s, 20, 0.07)}, 0 0 0 1px ${this._hsla(h, s, 20, 0.04)}`,
        };
      }
    }

    _applyPalette() {
      const isDark = this._config.theme === 'auto'
        ? !window.matchMedia('(prefers-color-scheme: light)').matches
        : this._config.theme !== 'light';
      this._palette = this._buildPalette(this._config.color, isDark);
      const p = this._palette;
      this.style.setProperty('--accent',    p.accent);
      this.style.setProperty('--bg',        p.bg);
      this.style.setProperty('--surface',   p.surface);
      this.style.setProperty('--border',    p.border);
      this.style.setProperty('--text',      p.text);
      this.style.setProperty('--text-muted',p.textMuted);
      this.style.setProperty('--text-dim',  p.textDim);
      this.style.setProperty('--row-hover', p.rowHover);
      this.style.setProperty('--shadow',    p.shadow);

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
          <div class="row-icon-wrap"><ha-icon id="icon-${i}" icon="mdi:thermostat"></ha-icon></div>
          <div class="row-info">
            <div class="row-name" id="name-${i}">${e.name || e.entity}</div>
            <div class="row-status" id="status-${i}">—</div>
          </div>
          <div class="temp-controls">
            <div class="current-temp-badge" id="current-${i}">—°</div>
            <div class="target-controls" id="target-ctrl-${i}">
              <button class="step-btn" id="down-${i}"><ha-icon icon="mdi:minus"></ha-icon></button>
              <div class="target-val" id="target-${i}">—°</div>
              <button class="step-btn" id="up-${i}"><ha-icon icon="mdi:plus"></ha-icon></button>
            </div>
          </div>
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
            <ha-icon icon="mdi:thermostat"></ha-icon>
            <span>${n} zone${n !== 1 ? 's' : ''}</span>
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
        const row = this._q(`#row-${i}`);
        if (!row || !stateObj) return;

        const attrs    = stateObj.attributes || {};
        const action   = attrs.hvac_action || stateObj.state;
        const isUnavail = stateObj.state === 'unavailable' || stateObj.state === 'unknown';
        const isOff    = stateObj.state === 'off';

        row.classList.toggle('unavailable', isUnavail);

        const iconEl = this._q(`#icon-${i}`);
        if (iconEl) {
          iconEl.setAttribute('icon', ACTION_ICONS[action] || 'mdi:thermostat');
          if (isUnavail) {
            iconEl.style.color = 'var(--text-dim)';
          } else if (action === 'heating') {
            iconEl.style.color = 'var(--accent)';
          } else if (action === 'cooling') {
            iconEl.style.color = 'var(--blue)';
          } else {
            iconEl.style.color = 'var(--text-dim)';
          }
        }

        const nameEl = this._q(`#name-${i}`);
        if (nameEl) nameEl.textContent = cfg.name || attrs.friendly_name || cfg.entity;

        const statusEl = this._q(`#status-${i}`);
        if (statusEl) statusEl.textContent = isUnavail ? 'Unavailable' : (action.charAt(0).toUpperCase() + action.slice(1).replace(/_/g, ' '));

        const currentEl = this._q(`#current-${i}`);
        if (currentEl) currentEl.innerHTML = attrs.current_temperature != null ? `${this._format(attrs.current_temperature)}<span class="unit">°</span>` : '—';

        const targetEl = this._q(`#target-${i}`);
        const stepRow  = this._q(`#target-ctrl-${i}`);

        if (stateObj.state === 'heat_cool') {
          const lo = attrs.target_temp_low, hi = attrs.target_temp_high;
          if (targetEl) targetEl.innerHTML = (lo != null && hi != null) ? `${this._format(lo)}<span class="unit">°</span>–${this._format(hi)}<span class="unit">°</span>` : '—';
          if (stepRow) stepRow.style.opacity = '0.5';
        } else {
          if (targetEl) targetEl.innerHTML = attrs.temperature != null ? `${this._format(attrs.temperature)}<span class="unit">°</span>` : '—';
          if (stepRow) {
            stepRow.style.opacity       = isOff ? '0.3' : '1';
            stepRow.style.pointerEvents = isOff ? 'none' : 'auto';
          }
        }
      });
    }

    _format(v) { return Number.isInteger(v) ? v : v.toFixed(1); }

    _bindEvents() {
      this._entities.forEach((cfg, i) => {
        this._q(`#row-${i}`)?.addEventListener('click', (e) => {
          if (e.target.closest('button')) return;
          const ev = new Event('hass-more-info', { bubbles: true, composed: true });
          ev.detail = { entityId: cfg.entity };
          this.dispatchEvent(ev);
        });

        this._q(`#down-${i}`)?.addEventListener('click', (e) => { e.stopPropagation(); this._step(cfg.entity, -1); });
        this._q(`#up-${i}`)?.addEventListener('click',   (e) => { e.stopPropagation(); this._step(cfg.entity, +1); });
      });
    }

    _step(entityId, dir) {
      const state = this._hass.states[entityId];
      if (!state) return;
      const step   = state.attributes.target_temp_step || 0.5;
      const target = state.attributes.temperature;
      if (target == null) return;
      this._hass.callService('climate', 'set_temperature', { entity_id: entityId, temperature: target + dir * step });
    }

    _q(s) { return this.shadowRoot.querySelector(s); }
  }

  customElements.define('wesmart-infinite-climate-compact-card', WeSmartInfiniteClimateCompactCard);

  window.customCards = window.customCards || [];
  window.customCards.push({
    type:        'wesmart-infinite-climate-compact-card',
    name:        'WeSmart Infinite Climate Compact Card',
    description: 'Space-efficient multi-zone climate with dynamic InfiniteColor palette.',
    preview:     true,
  });

  console.info(
    `%c WESMART INFINITE CLIMATE COMPACT %c v${CARD_VERSION} `,
    'background:#D97757;color:#fff;font-weight:700;padding:2px 6px;border-radius:4px 0 0 4px',
    'background:#1C1917;color:#D97757;font-weight:600;padding:2px 6px;border-radius:0 4px 4px 0'
  );

})();
