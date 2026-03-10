// wesmart-infinite-battery-card.js v1.0.0
// WeSmart — Infinite Color Battery Status Card for Home Assistant
// Dynamic palette from a single base color · icon / linear / circular display

(() => {

  const CARD_VERSION = '1.0.0';

  // ─── Helpers ──────────────────────────────────────────────────────────────────

  function getBatteryIcon(level, charging) {
    if (charging) return 'mdi:battery-charging';
    if (level === null || level === undefined || isNaN(level)) return 'mdi:battery-unknown';
    const rounded = Math.round(level / 10) * 10;
    if (rounded >= 100) return 'mdi:battery';
    if (rounded <= 0)   return 'mdi:battery-outline';
    return `mdi:battery-${rounded}`;
  }

  function getBatteryColor(level, isUnavail, accentColor) {
    if (isUnavail) return 'var(--text-dim)';
    if (level === null || level === undefined || isNaN(level)) return 'var(--text-muted)';
    if (level <= 15) return accentColor;  // accent for critical
    if (level <= 30) return '#E0A36E';    // muted amber
    return '#7EC8A0';                     // muted green
  }

  // ─── Styles ───────────────────────────────────────────────────────────────────

  const CSS = `
    :host {
      display: block;
      font-family: -apple-system, 'Söhne', 'Inter', BlinkMacSystemFont, sans-serif;
      --claude-radius:    20px;
      --claude-radius-sm: 12px;
      --claude-radius-xs: 8px;
      --transition:       all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    }

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    .card {
      background:    var(--bg);
      border:        1px solid var(--border);
      border-radius: var(--claude-radius);
      padding:       18px 18px 0;
      box-shadow:    var(--shadow);
    }

    .header {
      display:     flex;
      align-items: center;
      gap:         12px;
      margin-bottom: 14px;
    }

    .header-icon-wrap {
      width:           40px;
      height:          40px;
      border-radius:   var(--claude-radius-sm);
      background:      var(--surface);
      border:          1px solid var(--border);
      display:         flex;
      align-items:     center;
      justify-content: center;
    }

    .header-icon-wrap ha-icon {
      --mdc-icon-size: 20px;
      color: var(--accent);
    }

    .header-title {
      font-size:   15px;
      font-weight: 600;
      color:       var(--text);
      flex:        1;
    }

    .header-subtitle {
      font-size: 12px;
      color:     var(--text-muted);
    }

    .separator {
      height:     1px;
      background: var(--border);
      margin-bottom: 10px;
    }

    .battery-list {
      display:        flex;
      flex-direction: column;
      gap:            2px;
    }

    .battery-row {
      display:       flex;
      align-items:   center;
      gap:           12px;
      padding:       10px 8px;
      border-radius: var(--claude-radius-xs);
      cursor:        pointer;
      transition:    background 0.2s ease;
    }

    .battery-row:hover      { background: var(--row-hover); }
    .battery-row.unavailable { opacity: 0.4; }

    .row-icon {
      width:           32px;
      height:          32px;
      display:         flex;
      align-items:     center;
      justify-content: center;
      flex-shrink:     0;
    }

    .row-icon ha-icon { --mdc-icon-size: 20px; }

    .row-info { flex: 1; min-width: 0; }

    .row-name {
      font-size:     13px;
      font-weight:   500;
      color:         var(--text);
      white-space:   nowrap;
      overflow:      hidden;
      text-overflow: ellipsis;
    }

    .row-value {
      font-size:   14px;
      font-weight: 600;
      color:       var(--text);
      display:     flex;
      align-items: center;
      gap:         8px;
    }

    .unit {
      font-size:   11px;
      font-weight: 400;
      color:       var(--text-muted);
      margin-left: 1px;
    }

    /* Linear Bar */
    .linear-bar-wrap {
      width:         60px;
      height:        4px;
      background:    var(--surface);
      border-radius: 2px;
      overflow:      hidden;
      position:      relative;
      border:        1px solid var(--border);
    }

    .linear-bar-fill {
      height:     100%;
      width:      0%;
      transition: width 1s ease-out, background-color 0.5s ease;
    }

    /* Circular Progress */
    .circular-wrap {
      width:           28px;
      height:          28px;
      position:        relative;
      display:         flex;
      align-items:     center;
      justify-content: center;
    }

    .circular-wrap svg {
      transform: rotate(-90deg);
      width:  100%;
      height: 100%;
    }

    .circular-bg {
      fill:         none;
      stroke:       var(--surface);
      stroke-width: 3;
    }

    .circular-fill {
      fill:              none;
      stroke:            var(--accent);
      stroke-width:      3;
      stroke-linecap:    round;
      stroke-dasharray:  69.11;
      stroke-dashoffset: 69.11;
      transition:        stroke-dashoffset 1s ease-out, stroke 0.5s ease;
    }

    /* Footer */
    .footer {
      display:         flex;
      align-items:     center;
      justify-content: space-between;
      margin-top:      12px;
      padding:         10px 0 14px;
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

    .brand-mark svg  { width: 13px; height: 13px; }
    .brand-mark span {
      font-size:      10px;
      font-weight:    700;
      color:          var(--text-muted);
      letter-spacing: 0.8px;
    }
  `;

  // ─── Custom Element ────────────────────────────────────────────────────────────

  class WeSmartInfiniteBatteryCard extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this._config   = {};
      this._hass     = null;
      this._entities = [];
      this._palette  = {};
      this._mqHandler = null;
    }

    // ── Color Engine ─────────────────────────────────────────────────────────────

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

    _clamp(val, min, max) { return Math.min(max, Math.max(min, val)); }
    _hsl(h, s, l)         { return `hsl(${h}, ${s}%, ${l}%)`; }
    _hsla(h, s, l, a)     { return `hsla(${h}, ${s}%, ${l}%, ${a})`; }

    _buildPalette(hex, isDark) {
      const { h, s, l } = this._hexToHsl(hex);
      const c = this._clamp.bind(this);
      if (isDark) {
        const accentL = c(l, 50, 65);
        return {
          accent:      this._hsl(h, s, accentL),
          accentSoft:  this._hsla(h, s, accentL, 0.12),
          bg:          this._hsl(h, c(Math.round(s * 0.35), 25, 45), 11),
          surface:     this._hsl(h, c(Math.round(s * 0.28), 20, 38), 16),
          border:      `hsla(0, 0%, 100%, 0.08)`,
          text:        this._hsl(h, c(Math.round(s * 0.08), 5, 10), 93),
          textMuted:   this._hsl(h, c(Math.round(s * 0.12), 8, 15), 65),
          textDim:     this._hsl(h, c(Math.round(s * 0.10), 6, 12), 42),
          rowHover:    `hsla(0, 0%, 100%, 0.03)`,
          shadow:      `0 8px 32px ${this._hsla(h, s, 5, 0.45)}`,
        };
      } else {
        const accentL = c(l - 10, 40, 55);
        return {
          accent:      this._hsl(h, s, accentL),
          accentSoft:  this._hsla(h, s, accentL, 0.12),
          bg:          this._hsl(h, c(Math.round(s * 0.05), 3, 8), 98),
          surface:     this._hsl(h, c(Math.round(s * 0.08), 5, 12), 93),
          border:      this._hsla(h, c(Math.round(s * 0.3), 0, 30), 15, 0.09),
          text:        this._hsl(h, c(Math.round(s * 0.15), 8, 20), 10),
          textMuted:   this._hsl(h, c(Math.round(s * 0.12), 6, 15), 38),
          textDim:     this._hsl(h, c(Math.round(s * 0.08), 4, 10), 58),
          rowHover:    this._hsla(h, c(Math.round(s * 0.2), 0, 20), 15, 0.03),
          shadow:      `0 2px 16px ${this._hsla(h, s, 20, 0.07)}, 0 0 0 1px ${this._hsla(h, s, 20, 0.04)}`,
        };
      }
    }

    _applyPalette() {
      if (!this._config) return;
      const isDark = this._config.theme === 'auto'
        ? !window.matchMedia('(prefers-color-scheme: light)').matches
        : this._config.theme !== 'light';
      this._palette = this._buildPalette(this._config.color, isDark);
      const p = this._palette;
      this.style.setProperty('--accent',      p.accent);
      this.style.setProperty('--accent-soft', p.accentSoft);
      this.style.setProperty('--bg',          p.bg);
      this.style.setProperty('--surface',     p.surface);
      this.style.setProperty('--border',      p.border);
      this.style.setProperty('--text',        p.text);
      this.style.setProperty('--text-muted',  p.textMuted);
      this.style.setProperty('--text-dim',    p.textDim);
      this.style.setProperty('--row-hover',   p.rowHover);
      this.style.setProperty('--shadow',      p.shadow);
    }

    _brandSVG() {
      const fill = this._palette?.accent ?? '#D97757';
      return `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.3 2.45a.74.74 0 0 0-1.38 0l-1.18 3.27H11.3L10.1 2.45a.74.74 0 0 0-1.38 0L7.3 6.37 4.1 7.56a.74.74 0 0 0 0 1.38l3.2 1.19.82 2.28-3.26 1.18a.74.74 0 0 0 0 1.38l3.26 1.18L9.3 19.2l-2.1.76a.74.74 0 0 0 0 1.38l3.26 1.18.45 1.24a.74.74 0 0 0 1.38 0l.45-1.24 3.26-1.18a.74.74 0 0 0 0-1.38l-2.1-.76 1.18-3.27 3.26-1.18a.74.74 0 0 0 0-1.38l-3.26-1.18.82-2.28 3.2-1.19a.74.74 0 0 0 0-1.38l-3.2-1.19-1.37-3.92z" fill="${fill}"/>
      </svg>`;
    }

    // ── Lifecycle ─────────────────────────────────────────────────────────────────

    setConfig(config) {
      if (!config.entities?.length) throw new Error('Add entities');
      this._config = {
        title:        'Batteries',
        icon:         'mdi:battery-check',
        theme:        'dark',
        color:        '#D97757',
        display_type: 'icon',
        ...config
      };
      this._entities = this._config.entities.map(e => typeof e === 'string' ? { entity: e } : e);

      this._applyPalette();
      this._render();

      if (this._mqHandler) {
        window.matchMedia('(prefers-color-scheme: light)').removeEventListener('change', this._mqHandler);
      }
      if (this._config.theme === 'auto') {
        this._mqHandler = () => this._applyPalette();
        window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', this._mqHandler);
      }
    }

    set hass(hass) {
      this._hass = hass;
      this._updateState();
    }

    // ── Render ────────────────────────────────────────────────────────────────────

    _render() {
      const shadow = this.shadowRoot;
      shadow.innerHTML = '';

      const style = document.createElement('style');
      style.textContent = CSS;
      shadow.appendChild(style);

      this._card = document.createElement('div');
      this._card.className = 'card';

      const rowsHTML = this._entities.map((e, i) => {
        const displayType = (e.display_type || this._config.display_type || 'icon').toLowerCase();
        let vizHTML = '';
        if (displayType === 'icon') {
          vizHTML = `<div class="row-icon"><ha-icon id="icon-${i}" icon="mdi:battery-unknown"></ha-icon></div>`;
        } else if (displayType === 'circular') {
          vizHTML = `
            <div class="circular-wrap" id="viz-${i}">
              <svg viewBox="0 0 28 28">
                <circle class="circular-bg" cx="14" cy="14" r="11"></circle>
                <circle id="circle-fill-${i}" class="circular-fill" cx="14" cy="14" r="11"></circle>
              </svg>
            </div>`;
        }

        return `
          <div class="battery-row" data-index="${i}" id="row-${i}">
            ${displayType !== 'linear' ? vizHTML : ''}
            <div class="row-info">
              <div class="row-name" id="name-${i}">${e.name || e.entity}</div>
              ${displayType === 'linear' ? `
                <div class="linear-bar-wrap" style="margin-top: 4px; width: 100%;">
                  <div id="linear-fill-${i}" class="linear-bar-fill"></div>
                </div>` : ''}
            </div>
            <div class="row-value" id="value-${i}">—</div>
          </div>
        `;
      }).join('');

      const n = this._entities.length;
      this._card.innerHTML = `
        <div class="header">
          <div class="header-icon-wrap"><ha-icon icon="${this._config.icon}"></ha-icon></div>
          <div class="header-title">${this._config.title}</div>
          <div class="header-subtitle" id="subtitle"></div>
        </div>
        <div class="separator"></div>
        <div class="battery-list">${rowsHTML}</div>
        <div class="footer">
          <div class="footer-info">
            <ha-icon icon="mdi:battery"></ha-icon>
            <span>${n} device${n !== 1 ? 's' : ''}</span>
          </div>
          <div class="brand-mark">${this._brandSVG()}<span>WeSmart</span></div>
        </div>
      `;

      shadow.appendChild(this._card);
      this._bindEvents();
      this._updateState();
    }

    // ── State ─────────────────────────────────────────────────────────────────────

    _updateState() {
      if (!this._hass || !this._card) return;
      const accentColor = this._palette?.accent ?? '#D97757';

      let lowCount = 0;

      this._entities.forEach((cfg, i) => {
        const stateObj = this._hass.states[cfg.entity];
        const row = this._q(`#row-${i}`);
        if (!row) return;

        if (!stateObj) {
          this._q(`#name-${i}`).textContent  = cfg.name || cfg.entity;
          this._q(`#value-${i}`).textContent = 'Not found';
          return;
        }

        let level = parseFloat(stateObj.state);
        if (isNaN(level)) {
          level = parseFloat(
            stateObj.attributes.battery_level ||
            stateObj.attributes.battery ||
            stateObj.attributes.level
          );
        }

        const isUnavail = stateObj.state === 'unavailable' || stateObj.state === 'unknown' || isNaN(level);
        const charging  = stateObj.attributes.battery_charging === true ||
                          stateObj.attributes.is_charging === true ||
                          stateObj.attributes.charging === true;
        const displayType = (cfg.display_type || this._config.display_type || 'icon').toLowerCase();

        if (!isUnavail && level <= 20) lowCount++;
        row.classList.toggle('unavailable', isUnavail);

        const color = getBatteryColor(level, isUnavail, accentColor);

        const nameEl = this._q(`#name-${i}`);
        if (nameEl) nameEl.textContent = cfg.name || stateObj.attributes.friendly_name || cfg.entity;

        const valueEl = this._q(`#value-${i}`);
        if (valueEl) {
          valueEl.innerHTML = isUnavail ? 'N/A' : `${Math.round(level)}<span class="unit">%</span>`;
          if (!isUnavail) valueEl.style.color = color;
        }

        if (displayType === 'icon') {
          const iconEl = this._q(`#icon-${i}`);
          if (iconEl) {
            iconEl.setAttribute('icon', getBatteryIcon(level, charging));
            iconEl.style.color = color;
          }
        } else if (displayType === 'circular') {
          const circle = this._q(`#circle-fill-${i}`);
          if (circle) {
            const circum = 2 * Math.PI * 11;
            const offset = circum - (Math.max(0, Math.min(100, level)) / 100) * circum;
            circle.style.strokeDashoffset = isUnavail ? circum : offset;
            circle.style.stroke           = color;
          }
        } else if (displayType === 'linear') {
          const fill = this._q(`#linear-fill-${i}`);
          if (fill) {
            fill.style.width           = isUnavail ? '0%' : `${Math.max(0, Math.min(100, level))}%`;
            fill.style.backgroundColor = color;
          }
        }
      });

      const subtitle = this._q('#subtitle');
      if (subtitle) {
        subtitle.textContent = lowCount > 0 ? `${lowCount} low` : `${this._entities.length} devices`;
        subtitle.style.color = lowCount > 0 ? 'var(--accent)' : 'var(--text-muted)';
      }
    }

    _bindEvents() {
      this._q('.battery-list')?.addEventListener('click', (e) => {
        const row = e.target.closest('.battery-row');
        if (!row) return;
        const entityId = this._entities[row.dataset.index]?.entity;
        if (entityId) {
          const ev = new Event('hass-more-info', { bubbles: true, composed: true });
          ev.detail = { entityId };
          this.dispatchEvent(ev);
        }
      });
    }

    _q(selector) { return this.shadowRoot.querySelector(selector); }
  }

  customElements.define('wesmart-infinite-battery-card', WeSmartInfiniteBatteryCard);

  window.customCards = window.customCards || [];
  window.customCards.push({
    type:        'wesmart-infinite-battery-card',
    name:        'WeSmart Infinite Battery Card',
    description: 'Monitor battery levels with a dynamic color palette generated from a single base color.',
    preview:     true,
  });

  console.info(
    `%c WESMART INFINITE BATTERY %c v${CARD_VERSION} `,
    'background:#D97757;color:#fff;font-weight:700;padding:2px 6px;border-radius:4px 0 0 4px',
    'background:#1a1625;color:#a5b4fc;font-weight:600;padding:2px 6px;border-radius:0 4px 4px 0'
  );

})();
