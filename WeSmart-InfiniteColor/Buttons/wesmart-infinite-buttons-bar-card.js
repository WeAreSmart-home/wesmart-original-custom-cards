/**
 * WeSmart Infinite Buttons Bar Card
 * Compact horizontal bar of action buttons with dynamic state colors.
 * Supports toggle entities and arbitrary service calls.
 * Part of the WeSmart InfiniteColor system — full palette derived from one base color.
 *
 * Config:
 *   type: custom:wesmart-infinite-buttons-bar-card
 *   color: "#D97757"             # any hex color (optional, default Claude orange)
 *   theme: dark | light | auto
 *   title: "Quick Actions"       (optional)
 *   buttons:
 *     - name: Lights
 *       icon: mdi:lightbulb
 *       entity: light.soggiorno
 *     - name: Film
 *       icon: mdi:movie-open
 *       service: scene.turn_on
 *       service_data:
 *         entity_id: scene.serata_film
 */
(function () {
  'use strict';

  const CARD_VERSION = '1.0.0';

  const ACTIVE_STATES = new Set([
    'on', 'open', 'unlocked', 'detected', 'active',
    'home', 'playing', 'occupied', 'true',
  ]);

  function isEntityActive(stateObj) {
    if (!stateObj) return false;
    return ACTIVE_STATES.has(stateObj.state) || stateObj.state.startsWith('armed');
  }

  const styles = `
    :host {
      --radius:      20px;
      --radius-sm:   12px;
      --radius-xs:   8px;
      --transition:  all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      display: block;
      font-family: -apple-system, 'Söhne', 'Inter', BlinkMacSystemFont, sans-serif;
    }

    .card {
      background:    var(--bg);
      border:        1px solid var(--border);
      border-radius: var(--radius);
      padding:       14px 16px;
      box-shadow:    var(--shadow);
      box-sizing:    border-box;
    }

    .title-row {
      font-size:      11px;
      font-weight:    600;
      letter-spacing: 0.07em;
      text-transform: uppercase;
      color:          var(--text-dim);
      margin-bottom:  10px;
    }

    .buttons-row {
      display:        flex;
      flex-direction: row;
      gap:            8px;
      align-items:    stretch;
    }

    .btn {
      flex:             1;
      display:          flex;
      flex-direction:   column;
      align-items:      center;
      justify-content:  center;
      gap:              6px;
      padding:          11px 6px;
      border-radius:    var(--radius-sm);
      background:       var(--surface);
      border:           1px solid transparent;
      cursor:           pointer;
      transition:       var(--transition);
      min-width:        0;
      user-select:      none;
      -webkit-tap-highlight-color: transparent;
      outline:          none;
      appearance:       none;
      -webkit-appearance: none;
      font-family:      inherit;
    }

    .btn:hover:not(.unavailable) {
      background: var(--surface-hover);
    }

    .btn.active {
      background:   var(--accent-soft);
      border-color: var(--accent-border);
      box-shadow:   0 0 14px var(--accent-glow);
    }

    .btn.unavailable {
      opacity:        0.35;
      pointer-events: none;
    }

    .btn.pressing {
      transform:  scale(0.92);
      transition: transform 0.1s ease;
    }

    .btn-icon {
      width:           26px;
      height:          26px;
      color:           var(--text-dim);
      transition:      color 0.2s ease;
      flex-shrink:     0;
      display:         flex;
      align-items:     center;
      justify-content: center;
    }

    .btn.active .btn-icon { color: var(--accent); }

    .btn-label {
      font-size:     10px;
      font-weight:   500;
      color:         var(--text-muted);
      text-align:    center;
      line-height:   1.2;
      overflow:      hidden;
      text-overflow: ellipsis;
      white-space:   nowrap;
      max-width:     100%;
      transition:    color 0.2s ease;
    }

    .btn.active .btn-label { color: var(--accent); }
  `;

  class WeSmartInfiniteButtonsBarCard extends HTMLElement {
    connectedCallback() {
      if (!this.shadowRoot) this.attachShadow({ mode: 'open' });
    }

    setConfig(config) {
      if (!config.buttons?.length) throw new Error('wesmart-infinite-buttons-bar-card: "buttons" array is required');
      this._config  = { theme: 'dark', color: '#D97757', ...config };
      this._buttons = this._config.buttons.map(b => ({ ...b }));
      if (!this.shadowRoot) this.attachShadow({ mode: 'open' });
      this._applyPalette();
      this._render();
    }

    set hass(hass) {
      this._hass = hass;
      this._updateState();
    }

    // ── Color Engine ──────────────────────────────────────────────────────────

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
          accentBorder: this._hsla(h, s, accentL, 0.35),
          bg:           this._hsl(h, c(Math.round(s * 0.35), 25, 45), 11),
          surface:      this._hsl(h, c(Math.round(s * 0.28), 20, 38), 16),
          surfaceHover: this._hsl(h, c(Math.round(s * 0.25), 18, 35), 20),
          border:       `hsla(0,0%,100%,0.08)`,
          text:         this._hsl(h, c(Math.round(s * 0.08), 5, 10), 93),
          textMuted:    this._hsl(h, c(Math.round(s * 0.12), 8, 15), 65),
          textDim:      this._hsl(h, c(Math.round(s * 0.10), 6, 12), 42),
          shadow:       `0 8px 32px ${this._hsla(h, s, 5, 0.45)}`,
        };
      } else {
        const accentL = c(l, 35, 52);
        return {
          accent:       this._hsl(h, s, accentL),
          accentSoft:   this._hsla(h, s, accentL, 0.10),
          accentGlow:   this._hsla(h, s, accentL, 0.20),
          accentBorder: this._hsla(h, s, accentL, 0.30),
          bg:           this._hsl(h, c(Math.round(s * 0.08), 5, 10), 99),
          surface:      this._hsl(h, c(Math.round(s * 0.12), 8, 15), 95),
          surfaceHover: this._hsl(h, c(Math.round(s * 0.10), 6, 12), 91),
          border:       this._hsla(h, c(Math.round(s * 0.15), 10, 20), 25, 0.09),
          text:         this._hsl(h, c(Math.round(s * 0.25), 18, 35), 12),
          textMuted:    this._hsl(h, c(Math.round(s * 0.20), 15, 28), 40),
          textDim:      this._hsl(h, c(Math.round(s * 0.15), 10, 20), 60),
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
      this.style.setProperty('--accent',       p.accent);
      this.style.setProperty('--accent-soft',  p.accentSoft);
      this.style.setProperty('--accent-glow',  p.accentGlow);
      this.style.setProperty('--accent-border',p.accentBorder);
      this.style.setProperty('--bg',           p.bg);
      this.style.setProperty('--surface',      p.surface);
      this.style.setProperty('--surface-hover',p.surfaceHover);
      this.style.setProperty('--border',       p.border);
      this.style.setProperty('--text',         p.text);
      this.style.setProperty('--text-muted',   p.textMuted);
      this.style.setProperty('--text-dim',     p.textDim);
      this.style.setProperty('--shadow',       p.shadow);

      // Auto theme: react to OS changes
      if (this._config.theme === 'auto') {
        if (!this._mqHandler) {
          this._mqHandler = () => { this._applyPalette(); };
          window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', this._mqHandler);
        }
      }
    }

    // ── Render ────────────────────────────────────────────────────────────────

    _q(sel) { return this.shadowRoot.querySelector(sel); }

    _render() {
      const shadow = this.shadowRoot;
      shadow.innerHTML = '';

      const style = document.createElement('style');
      style.textContent = styles;
      shadow.appendChild(style);

      this._card = document.createElement('div');
      this._card.className = 'card';
      this._card.innerHTML = this._buildHTML();
      shadow.appendChild(this._card);

      this._bindEvents();
      if (this._hass) this._updateState();
    }

    _buildHTML() {
      const titleRow = this._config.title
        ? `<div class="title-row">${this._escapeHtml(this._config.title)}</div>`
        : '';

      const buttons = this._buttons.map((b, i) => `
        <button class="btn" id="btn-${i}" aria-label="${this._escapeHtml(b.name || '')}">
          <ha-icon class="btn-icon" id="icon-${i}" icon="${this._escapeHtml(b.icon || 'mdi:gesture-tap')}"></ha-icon>
          <span class="btn-label">${this._escapeHtml(b.name || '')}</span>
        </button>
      `).join('');

      return `${titleRow}<div class="buttons-row">${buttons}</div>`;
    }

    _updateState() {
      if (!this._hass || !this._card) return;

      this._buttons.forEach((cfg, i) => {
        const btn = this._q(`#btn-${i}`);
        if (!btn) return;

        if (!cfg.entity) {
          btn.classList.remove('active', 'unavailable');
          return;
        }

        const stateObj = this._hass.states[cfg.entity];
        const isUnavail = !stateObj
          || stateObj.state === 'unavailable'
          || stateObj.state === 'unknown';
        const active = !isUnavail && isEntityActive(stateObj);

        btn.classList.toggle('active', active);
        btn.classList.toggle('unavailable', isUnavail);
      });
    }

    _handleClick(i) {
      const cfg = this._buttons[i];
      if (!this._hass) return;

      if (cfg.service) {
        const parts = cfg.service.split('.');
        this._hass.callService(parts[0], parts.slice(1).join('.'), cfg.service_data || {});
      } else if (cfg.entity) {
        const stateObj = this._hass.states[cfg.entity];
        if (!stateObj || stateObj.state === 'unavailable') return;
        this._hass.callService('homeassistant', 'toggle', { entity_id: cfg.entity });
      }

      if (!cfg.entity) {
        const btn = this._q(`#btn-${i}`);
        if (btn) {
          btn.classList.add('pressing');
          setTimeout(() => btn.classList.remove('pressing'), 200);
        }
      }
    }

    _bindEvents() {
      this._buttons.forEach((_, i) => {
        const btn = this._q(`#btn-${i}`);
        if (!btn) return;
        btn.addEventListener('click', () => this._handleClick(i));
      });
    }

    _escapeHtml(str) {
      return String(str)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;')
        .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    getCardSize() { return 1; }
  }

  customElements.define('wesmart-infinite-buttons-bar-card', WeSmartInfiniteButtonsBarCard);

  window.customCards = window.customCards || [];
  window.customCards.push({
    type:        'wesmart-infinite-buttons-bar-card',
    name:        'WeSmart Infinite Buttons Bar',
    description: 'Horizontal bar of action buttons with dynamic InfiniteColor palette.',
  });

  console.info(
    `%c WESMART INFINITE BUTTONS BAR %c v${CARD_VERSION} `,
    'background:#D97757;color:#fff;font-weight:700;padding:2px 6px;border-radius:4px 0 0 4px',
    'background:#1C1917;color:#D97757;font-weight:600;padding:2px 6px;border-radius:0 4px 4px 0'
  );
})();
