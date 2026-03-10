/**
 * WeSmart Infinite Doors Card - Home Assistant Custom Card
 * Multi-entity door / window / contact sensor card.
 * Part of the WeSmart InfiniteColor system — full palette derived from one base color.
 * Version: 1.0.0
 *
 * Config:
 *   type: custom:wesmart-infinite-doors-card
 *   color: "#D97757"    # any hex (optional)
 *   theme: dark | light | auto
 *   title: Doors & Windows
 *   entities:
 *     - binary_sensor.front_door
 *     - entity: binary_sensor.kitchen_window
 *       name: Kitchen Window
 */

(() => {
  'use strict';

  const CARD_VERSION = '1.0.0';

  const DEVICE_CLASS_DEFS = {
    door:        { iconOpen: 'mdi:door-open',           iconClosed: 'mdi:door-closed',                  label: 'Door'      },
    window:      { iconOpen: 'mdi:window-open',         iconClosed: 'mdi:window-closed',                label: 'Window'    },
    garage_door: { iconOpen: 'mdi:garage-open',         iconClosed: 'mdi:garage',                       label: 'Garage'    },
    opening:     { iconOpen: 'mdi:lock-open',           iconClosed: 'mdi:lock',                         label: 'Opening'   },
    lock:        { iconOpen: 'mdi:lock-open',           iconClosed: 'mdi:lock',                         label: 'Lock'      },
    motion:      { iconOpen: 'mdi:motion-sensor',       iconClosed: 'mdi:motion-sensor-off',            label: 'Motion'    },
    vibration:   { iconOpen: 'mdi:vibrate',             iconClosed: 'mdi:vibrate-off',                  label: 'Vibration' },
    moisture:    { iconOpen: 'mdi:water',               iconClosed: 'mdi:water-off',                    label: 'Moisture'  },
    smoke:       { iconOpen: 'mdi:smoke-detector-alert',iconClosed: 'mdi:smoke-detector',               label: 'Smoke'     },
    gas:         { iconOpen: 'mdi:gas-cylinder',        iconClosed: 'mdi:gas-burner',                   label: 'Gas'       },
    _default:    { iconOpen: 'mdi:alert-circle-outline',iconClosed: 'mdi:checkbox-blank-circle-outline',label: 'Sensor'    },
  };

  const STATE_LABELS = {
    door:        { open: 'Open',     closed: 'Closed' },
    window:      { open: 'Open',     closed: 'Closed' },
    garage_door: { open: 'Open',     closed: 'Closed' },
    opening:     { open: 'Open',     closed: 'Closed' },
    lock:        { open: 'Unlocked', closed: 'Locked' },
    motion:      { open: 'Detected', closed: 'Clear'  },
    vibration:   { open: 'Detected', closed: 'Clear'  },
    moisture:    { open: 'Wet',      closed: 'Dry'    },
    smoke:       { open: 'Detected', closed: 'Clear'  },
    gas:         { open: 'Detected', closed: 'Clear'  },
    _default:    { open: 'Active',   closed: 'Inactive'},
  };

  function getDef(dc)    { return DEVICE_CLASS_DEFS[dc] || DEVICE_CLASS_DEFS._default; }
  function getLabels(dc) { return STATE_LABELS[dc]      || STATE_LABELS._default; }

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
    padding:       18px 18px 16px;
    position:      relative;
    overflow:      hidden;
    box-shadow:    var(--shadow);
    transition:    border-color 0.3s ease, box-shadow 0.3s ease;
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
    flex-shrink:     0;
    transition:      var(--transition);
  }

  .header-icon-wrap.has-open { background: var(--accent-soft); border-color: var(--accent-border); }

  .header-icon-wrap ha-icon { --mdc-icon-size: 20px; color: var(--text-dim); transition: color 0.3s ease; }
  .header-icon-wrap.has-open ha-icon { color: var(--accent); }

  .header-titles { flex: 1; min-width: 0; }

  .header-title {
    font-size: 15px; font-weight: 600; color: var(--text);
    letter-spacing: -0.01em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }

  .header-subtitle { font-size: 12px; color: var(--text-muted); margin-top: 2px; transition: color 0.3s ease; }
  .header-subtitle.has-open { color: var(--accent); }

  .separator { height: 1px; background: var(--border); margin: 0 0 10px; }

  .doors-list { display: flex; flex-direction: column; gap: 2px; }

  .door-row {
    display:     flex;
    align-items: center;
    gap:         12px;
    padding:     9px 8px 9px 6px;
    border-radius: var(--radius-xs);
    transition:  background 0.2s ease;
    cursor:      pointer;
    -webkit-tap-highlight-color: transparent;
  }

  .door-row:hover { background: var(--row-hover); }
  .door-row.door-open { background: var(--row-open); }
  .door-row.unavailable { opacity: 0.38; pointer-events: none; }

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

  .door-row.door-open .row-icon { background: var(--accent-soft); border-color: var(--accent-border); }
  .row-icon ha-icon { --mdc-icon-size: 17px; color: var(--text-dim); transition: color 0.25s ease; }
  .door-row.door-open .row-icon ha-icon { color: var(--accent); }

  .row-info { flex: 1; min-width: 0; }

  .row-name {
    font-size: 13px; font-weight: 500; color: var(--text);
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }

  .row-state { font-size: 11px; color: var(--text-dim); margin-top: 1px; white-space: nowrap; }
  .door-row.door-open .row-state { color: var(--accent); opacity: 0.85; }

  .status-pill {
    font-size:    11px;
    font-weight:  600;
    padding:      3px 9px;
    border-radius: 20px;
    flex-shrink:  0;
    letter-spacing: 0.01em;
    transition:   var(--transition);
  }

  .status-pill.closed {
    background: rgba(126,200,160,0.12);
    border:     1px solid rgba(126,200,160,0.25);
    color:      var(--closed-color);
  }

  .status-pill.open {
    background:   var(--accent-soft);
    border:       1px solid var(--accent-border);
    color:        var(--accent);
  }

  .status-pill.unavailable {
    background: rgba(160,144,128,0.10);
    border:     1px solid rgba(160,144,128,0.18);
    color:      var(--text-dim);
  }

  .footer {
    display: flex; align-items: center; justify-content: space-between;
    margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--border);
  }

  .footer-info { font-size: 11px; color: var(--text-dim); display: flex; align-items: center; gap: 4px; }
  .brand-mark { display: flex; align-items: center; gap: 5px; opacity: 0.4; }
  .brand-mark svg { width: 14px; height: 14px; }
  .brand-mark span { font-size: 10px; color: var(--text-dim); letter-spacing: 0.05em; }
  `;

  class WeSmartInfiniteDoorsCard extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this._config   = {};
      this._hass     = null;
      this._entities = [];
    }

    static getStubConfig() {
      return { title: 'Doors & Windows', entities: ['binary_sensor.front_door'] };
    }

    setConfig(config) {
      if (!config.entities?.length) throw new Error('entities array is required');
      this._config = { title: 'Doors & Windows', icon: 'mdi:door', theme: 'dark', color: '#D97757', ...config };
      this._entities = this._config.entities.map(e => typeof e === 'string' ? { entity: e } : e);
      this._applyPalette();
      this._render();
    }

    set hass(hass) { this._hass = hass; this._updateState(); }

    getCardSize() { return 1 + Math.ceil((this._entities.length * 52 + 80) / 50); }

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
          accentSoft:   this._hsla(h, s, accentL, 0.10),
          accentBorder: this._hsla(h, s, accentL, 0.25),
          bg:           this._hsl(h, c(Math.round(s * 0.35), 25, 45), 11),
          surface:      this._hsl(h, c(Math.round(s * 0.28), 20, 38), 16),
          border:       `hsla(0,0%,100%,0.08)`,
          text:         this._hsl(h, c(Math.round(s * 0.08), 5, 10), 93),
          textMuted:    this._hsl(h, c(Math.round(s * 0.12), 8, 15), 65),
          textDim:      this._hsl(h, c(Math.round(s * 0.10), 6, 12), 42),
          rowHover:     `hsla(0,0%,100%,0.03)`,
          rowOpen:      this._hsla(h, s, accentL, 0.07),
          closedColor:  '#7EC8A0',
          shadow:       `0 8px 32px ${this._hsla(h, s, 5, 0.45)}`,
        };
      } else {
        const accentL = c(l, 35, 52);
        return {
          accent:       this._hsl(h, s, accentL),
          accentSoft:   this._hsla(h, s, accentL, 0.08),
          accentBorder: this._hsla(h, s, accentL, 0.22),
          bg:           this._hsl(h, c(Math.round(s * 0.08), 5, 10), 99),
          surface:      this._hsl(h, c(Math.round(s * 0.12), 8, 15), 95),
          border:       this._hsla(h, c(Math.round(s * 0.15), 10, 20), 25, 0.09),
          text:         this._hsl(h, c(Math.round(s * 0.25), 18, 35), 12),
          textMuted:    this._hsl(h, c(Math.round(s * 0.20), 15, 28), 40),
          textDim:      this._hsl(h, c(Math.round(s * 0.15), 10, 20), 60),
          rowHover:     this._hsla(h, c(Math.round(s * 0.15), 10, 20), 25, 0.03),
          rowOpen:      this._hsla(h, s, accentL, 0.06),
          closedColor:  '#4CA87A',
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
      this.style.setProperty('--accent-border', p.accentBorder);
      this.style.setProperty('--bg',            p.bg);
      this.style.setProperty('--surface',       p.surface);
      this.style.setProperty('--border',        p.border);
      this.style.setProperty('--text',          p.text);
      this.style.setProperty('--text-muted',    p.textMuted);
      this.style.setProperty('--text-dim',      p.textDim);
      this.style.setProperty('--row-hover',     p.rowHover);
      this.style.setProperty('--row-open',      p.rowOpen);
      this.style.setProperty('--closed-color',  p.closedColor);
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
      const rowsHTML = this._entities.map((e, i) => `
        <div class="door-row" data-index="${i}" id="row-${i}">
          <div class="row-icon" id="icon-wrap-${i}"><ha-icon id="icon-${i}" icon="mdi:door-closed"></ha-icon></div>
          <div class="row-info">
            <div class="row-name" id="name-${i}">${e.name || e.entity}</div>
            <div class="row-state" id="state-type-${i}">—</div>
          </div>
          <div class="status-pill" id="pill-${i}">—</div>
        </div>
      `).join('');

      return `
        <div class="header">
          <div class="header-icon-wrap" id="header-icon-wrap">
            <ha-icon icon="${cfg.icon}"></ha-icon>
          </div>
          <div class="header-titles">
            <div class="header-title">${cfg.title}</div>
            <div class="header-subtitle" id="header-subtitle">—</div>
          </div>
        </div>
        <div class="separator"></div>
        <div class="doors-list" id="doors-list">${rowsHTML}</div>
        <div class="footer">
          <div class="footer-info">
            <ha-icon icon="mdi:door" style="--mdc-icon-size:13px"></ha-icon>
            <span>${this._entities.length} sensor${this._entities.length !== 1 ? 's' : ''}</span>
          </div>
          <div class="brand-mark">${this._brandSVG()}<span>WeSmart</span></div>
        </div>
      `;
    }

    _updateState() {
      if (!this._hass || !this._card) return;

      let openCount = 0;

      this._entities.forEach((cfg, i) => {
        const stateObj = this._hass.states[cfg.entity];
        const row      = this._q(`#row-${i}`);
        if (!row) return;

        if (!stateObj) {
          this._q(`#name-${i}`)?.textContent && (this._q(`#name-${i}`).textContent = cfg.name || cfg.entity);
          this._q(`#state-type-${i}`)?.textContent && (this._q(`#state-type-${i}`).textContent = 'Entity not found');
          const pill = this._q(`#pill-${i}`);
          if (pill) { pill.textContent = '—'; pill.className = 'status-pill unavailable'; }
          return;
        }

        const attrs       = stateObj.attributes || {};
        const isUnavail   = stateObj.state === 'unavailable' || stateObj.state === 'unknown';
        const deviceClass = cfg.device_class || attrs.device_class || 'door';
        const def         = getDef(deviceClass);
        const labels      = getLabels(deviceClass);
        const isOpen      = stateObj.state === 'on';
        if (isOpen && !isUnavail) openCount++;

        const name = cfg.name || attrs.friendly_name || cfg.entity.split('.')[1]?.replace(/_/g, ' ') || cfg.entity;
        const icon = cfg.icon || (isOpen ? def.iconOpen : def.iconClosed);

        row.classList.toggle('door-open',   isOpen && !isUnavail);
        row.classList.toggle('unavailable', isUnavail);

        this._q(`#icon-${i}`)?.setAttribute('icon', icon);

        const nameEl = this._q(`#name-${i}`);
        if (nameEl) nameEl.textContent = name;

        const typeEl = this._q(`#state-type-${i}`);
        if (typeEl) typeEl.textContent = def.label;

        const pill = this._q(`#pill-${i}`);
        if (pill) {
          pill.textContent = isUnavail ? 'N/A' : (isOpen ? labels.open : labels.closed);
          pill.className   = `status-pill ${isUnavail ? 'unavailable' : (isOpen ? 'open' : 'closed')}`;
        }
      });

      const subtitle = this._q('#header-subtitle');
      const iconWrap = this._q('#header-icon-wrap');
      if (subtitle) {
        subtitle.textContent = openCount === 0 ? 'All closed' : `${openCount} open`;
        subtitle.classList.toggle('has-open', openCount > 0);
      }
      if (iconWrap) iconWrap.classList.toggle('has-open', openCount > 0);
    }

    _bindEvents() {
      this._q('#doors-list')?.addEventListener('click', (e) => {
        const row = e.target.closest('.door-row');
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

  customElements.define('wesmart-infinite-doors-card', WeSmartInfiniteDoorsCard);

  window.customCards = window.customCards || [];
  window.customCards.push({
    type:        'wesmart-infinite-doors-card',
    name:        'WeSmart Infinite Doors Card',
    description: 'Door/window sensor card with dynamic InfiniteColor palette.',
    preview:     true,
  });

  console.info(
    `%c WESMART INFINITE DOORS CARD %c v${CARD_VERSION} `,
    'background:#D97757;color:#fff;font-weight:700;padding:2px 6px;border-radius:4px 0 0 4px',
    'background:#1C1917;color:#D97757;font-weight:600;padding:2px 6px;border-radius:0 4px 4px 0'
  );

})();
