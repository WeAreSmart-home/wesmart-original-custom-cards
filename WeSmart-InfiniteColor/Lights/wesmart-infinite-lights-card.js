/**
 * WeSmart Infinite Lights Card - Home Assistant Custom Card
 * Multi-entity light card with toggles.
 * Part of the WeSmart InfiniteColor system — full palette derived from one base color.
 * Version: 1.0.0
 *
 * Config:
 *   type: custom:wesmart-infinite-lights-card
 *   color: "#D97757"    # any hex (optional)
 *   theme: dark | light | auto
 *   title: Lights
 *   entities:
 *     - light.example_1
 *     - entity: light.example_2
 *       name: Bedroom
 */

(function () {
  'use strict';

  const CARD_VERSION = '1.0.0';

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
    background:  var(--bg);
    border:      1px solid var(--border);
    border-radius: var(--radius);
    padding:     18px 18px 16px;
    position:    relative;
    overflow:    hidden;
    box-shadow:  var(--shadow);
    transition:  border-color 0.3s ease, box-shadow 0.3s ease;
  }

  .header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }

  .header-left { display: flex; align-items: center; gap: 12px; flex: 1; min-width: 0; }

  .header-icon-wrap {
    width:           40px;
    height:          40px;
    border-radius:   var(--radius-sm);
    background:      var(--surface);
    border:          1px solid var(--border);
    display:         flex;
    align-items:     center;
    justify-content: center;
    flex-shrink:     0;
    transition:      var(--transition);
  }

  .header-icon-wrap.has-active { background: var(--accent-soft); border-color: var(--accent-border); }
  .header-icon-wrap ha-icon { --mdc-icon-size: 20px; color: var(--text-dim); transition: color 0.3s ease; }
  .header-icon-wrap.has-active ha-icon { color: var(--accent); }

  .header-titles { flex: 1; min-width: 0; }

  .header-title {
    font-size: 15px; font-weight: 600; color: var(--text);
    letter-spacing: -0.01em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }

  .header-subtitle { font-size: 12px; color: var(--text-muted); margin-top: 2px; transition: color 0.3s ease; }

  /* Toggle switch */
  .toggle-switch {
    position: relative; width: 48px; height: 26px; flex-shrink: 0;
    cursor: pointer; -webkit-tap-highlight-color: transparent;
  }

  .toggle-switch input { opacity: 0; width: 0; height: 0; position: absolute; }

  .toggle-track {
    position: absolute; inset: 0;
    background: var(--track-off); border: 1px solid var(--border);
    border-radius: 13px; transition: var(--transition);
  }

  .toggle-thumb {
    position: absolute; top: 3px; left: 3px;
    width: 18px; height: 18px; border-radius: 50%;
    background: var(--thumb-off); transition: var(--transition);
    box-shadow: 0 1px 4px rgba(0,0,0,0.25);
  }

  .toggle-switch.active .toggle-track { background: var(--accent-soft); border-color: var(--accent-border); }
  .toggle-switch.active .toggle-thumb { left: 23px; background: var(--accent); box-shadow: 0 0 10px var(--accent-glow); }

  .separator { height: 1px; background: var(--border); margin: 0 0 10px; }

  .lights-list { display: flex; flex-direction: column; gap: 2px; }

  .light-row {
    display:       flex;
    align-items:   center;
    gap:           12px;
    padding:       9px 8px 9px 6px;
    border-radius: var(--radius-xs);
    transition:    background 0.2s ease;
    cursor:        pointer;
    -webkit-tap-highlight-color: transparent;
  }

  .light-row:hover { background: var(--row-hover); }
  .light-row.light-on { background: var(--row-active); }
  .light-row.unavailable { opacity: 0.38; pointer-events: none; }

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

  .light-row.light-on .row-icon { background: var(--accent-soft); border-color: var(--accent-border); }
  .row-icon ha-icon { --mdc-icon-size: 17px; color: var(--text-dim); transition: color 0.25s ease; }
  .light-row.light-on .row-icon ha-icon { color: var(--accent); }

  .row-info { flex: 1; min-width: 0; }

  .row-name {
    font-size: 13px; font-weight: 500; color: var(--text);
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis; transition: color 0.2s ease;
  }

  .row-state {
    font-size: 11px; color: var(--text-dim); margin-top: 1px;
    transition: color 0.2s ease; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }

  .light-row.light-on .row-state { color: var(--accent); opacity: 0.85; }

  /* Row toggle (smaller) */
  .row-toggle {
    position: relative; width: 44px; height: 24px; flex-shrink: 0;
    cursor: pointer; -webkit-tap-highlight-color: transparent;
  }

  .row-toggle input { opacity: 0; width: 0; height: 0; position: absolute; }
  .row-toggle .toggle-track { border-radius: 12px; }
  .row-toggle .toggle-thumb { width: 16px; height: 16px; top: 3px; left: 3px; }
  .row-toggle.active .toggle-thumb { left: 21px; }

  .footer {
    display: flex; align-items: center; justify-content: space-between;
    margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--border);
  }

  .footer-info { font-size: 11px; color: var(--text-dim); display: flex; align-items: center; gap: 4px; }
  .brand-mark { display: flex; align-items: center; gap: 5px; opacity: 0.4; }
  .brand-mark svg { width: 14px; height: 14px; }
  .brand-mark span { font-size: 10px; color: var(--text-dim); letter-spacing: 0.05em; }
  `;

  class WeSmartInfiniteLightsCard extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this._config   = {};
      this._hass     = null;
      this._entities = [];
    }

    static getStubConfig() {
      return { title: 'Lights', entities: ['light.example_1', 'light.example_2'] };
    }

    setConfig(config) {
      if (!config.entities?.length) throw new Error('entities array is required');
      this._config = { title: 'Lights', icon: 'mdi:lightbulb-group', theme: 'dark', color: '#D97757', ...config };
      this._entities = this._config.entities.map(e => typeof e === 'string' ? { entity: e } : e);
      this._applyPalette();
      this._render();
    }

    set hass(hass) { this._hass = hass; this._updateState(); }

    getCardSize() { return 1 + Math.ceil((this._entities.length * 52 + 100) / 50); }

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
          accent:       this._hsl(h, s, accentL),
          accentSoft:   this._hsla(h, s, accentL, 0.12),
          accentGlow:   this._hsla(h, s, accentL, 0.25),
          accentBorder: this._hsla(h, s, accentL, 0.28),
          bg:           this._hsl(h, c(Math.round(s * 0.35), 25, 45), 11),
          surface:      this._hsl(h, c(Math.round(s * 0.28), 20, 38), 16),
          border:       `hsla(0,0%,100%,0.08)`,
          text:         this._hsl(h, c(Math.round(s * 0.08), 5, 10), 93),
          textMuted:    this._hsl(h, c(Math.round(s * 0.12), 8, 15), 65),
          textDim:      this._hsl(h, c(Math.round(s * 0.10), 6, 12), 42),
          trackOff:     this._hsl(h, c(Math.round(s * 0.28), 20, 38), 16),
          thumbOff:     this._hsl(h, c(Math.round(s * 0.10), 6, 12), 42),
          rowHover:     `hsla(0,0%,100%,0.03)`,
          rowActive:    this._hsla(h, s, accentL, 0.07),
          shadow:       `0 8px 32px ${this._hsla(h, s, 5, 0.45)}`,
        };
      } else {
        const accentL = c(l, 35, 52);
        return {
          accent:       this._hsl(h, s, accentL),
          accentSoft:   this._hsla(h, s, accentL, 0.10),
          accentGlow:   this._hsla(h, s, accentL, 0.20),
          accentBorder: this._hsla(h, s, accentL, 0.25),
          bg:           this._hsl(h, c(Math.round(s * 0.08), 5, 10), 99),
          surface:      this._hsl(h, c(Math.round(s * 0.12), 8, 15), 95),
          border:       this._hsla(h, c(Math.round(s * 0.15), 10, 20), 25, 0.09),
          text:         this._hsl(h, c(Math.round(s * 0.25), 18, 35), 12),
          textMuted:    this._hsl(h, c(Math.round(s * 0.20), 15, 28), 40),
          textDim:      this._hsl(h, c(Math.round(s * 0.15), 10, 20), 60),
          trackOff:     this._hsl(h, c(Math.round(s * 0.10), 6, 12), 88),
          thumbOff:     this._hsl(h, c(Math.round(s * 0.15), 10, 20), 72),
          rowHover:     this._hsla(h, c(Math.round(s * 0.15), 10, 20), 25, 0.03),
          rowActive:    this._hsla(h, s, accentL, 0.06),
          shadow:       `0 2px 16px ${this._hsla(h, s, 20, 0.07)}, 0 0 0 1px ${this._hsla(h, s, 20, 0.04)}`,
        };
      }
    }

    _applyPalette() {
      const isDark = this._config.theme === 'auto'
        ? !window.matchMedia('(prefers-color-scheme: light)').matches
        : this._config.theme !== 'light';
      this._palette = this._buildPalette(this._config.color, isDark);
      const p = this._palette;
      this.style.setProperty('--accent',        p.accent);
      this.style.setProperty('--accent-soft',   p.accentSoft);
      this.style.setProperty('--accent-glow',   p.accentGlow);
      this.style.setProperty('--accent-border', p.accentBorder);
      this.style.setProperty('--bg',            p.bg);
      this.style.setProperty('--surface',       p.surface);
      this.style.setProperty('--border',        p.border);
      this.style.setProperty('--text',          p.text);
      this.style.setProperty('--text-muted',    p.textMuted);
      this.style.setProperty('--text-dim',      p.textDim);
      this.style.setProperty('--track-off',     p.trackOff);
      this.style.setProperty('--thumb-off',     p.thumbOff);
      this.style.setProperty('--row-hover',     p.rowHover);
      this.style.setProperty('--row-active',    p.rowActive);
      this.style.setProperty('--shadow',        p.shadow);

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
      this._card.innerHTML = this._getHTML();
      shadow.appendChild(this._card);

      this._bindEvents();
      this._updateState();
    }

    _getHTML() {
      const cfg = this._config;
      const n   = this._entities.length;

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
        <div class="lights-list" id="lights-list">${rowsHTML}</div>
        <div class="footer">
          <div class="footer-info">
            <ha-icon icon="mdi:lightbulb-multiple-outline" style="--mdc-icon-size:13px"></ha-icon>
            <span>${n} light${n !== 1 ? 's' : ''}</span>
          </div>
          <div class="brand-mark">${this._brandSVG()}<span>WeSmart</span></div>
        </div>
      `;
    }

    _updateState() {
      if (!this._hass || !this._card) return;

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
        if (isUnavail) { stateText = 'Unavailable'; }
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

    _bindEvents() {
      this._q('#master-toggle').addEventListener('click', () => {
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

      this._q('#lights-list').addEventListener('click', (e) => {
        if (e.target.closest('.row-toggle')) return;
        const row = e.target.closest('.light-row');
        if (!row) return;
        const idx = parseInt(row.dataset.index, 10);
        if (isNaN(idx)) return;
        const entityId = this._entities[idx]?.entity;
        if (!entityId) return;
        const event = new Event('hass-more-info', { bubbles: true, composed: true });
        event.detail = { entityId };
        this.dispatchEvent(event);
      });
    }

    _q(selector) { return this._card?.querySelector(selector) ?? null; }
  }

  customElements.define('wesmart-infinite-lights-card', WeSmartInfiniteLightsCard);

  window.customCards = window.customCards || [];
  window.customCards.push({
    type:        'wesmart-infinite-lights-card',
    name:        'WeSmart Infinite Lights Card',
    description: 'Multi-entity light card with dynamic InfiniteColor palette.',
    preview:     true,
  });

  console.info(
    `%c WESMART INFINITE LIGHTS CARD %c v${CARD_VERSION} `,
    'background:#D97757;color:#fff;font-weight:700;padding:2px 6px;border-radius:4px 0 0 4px',
    'background:#1C1917;color:#D97757;font-weight:600;padding:2px 6px;border-radius:0 4px 4px 0'
  );
})();
