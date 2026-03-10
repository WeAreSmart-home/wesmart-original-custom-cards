/**
 * WeSmart Infinite Clock Card - Home Assistant Custom Card
 * Sleek ambient clock with optional bottom bar or left sidebar for extra entities.
 * Part of the WeSmart InfiniteColor system — full palette derived from one base color.
 * Max 3 extra entities. Shows only icon + state value.
 * Version: 2.0.0
 *
 * Config:
 *   type: custom:wesmart-infinite-clock-card
 *   color: "#D97757"              # any hex (optional)
 *   theme: dark | light | auto
 *   time_format: 24 | 12
 *   extras_layout: bottom | sidebar
 *   translate_weather: false
 *   extra_entities:
 *     - entity: weather.home
 *     - entity: sensor.temperature
 *       icon: mdi:thermometer
 */

(() => {
  'use strict';

  const CARD_VERSION = '2.0.0';

  const WEATHER_ICONS = {
    'clear-night':     'mdi:weather-night',
    'cloudy':          'mdi:weather-cloudy',
    'fog':             'mdi:weather-fog',
    'hail':            'mdi:weather-hail',
    'lightning':       'mdi:weather-lightning',
    'lightning-rainy': 'mdi:weather-lightning-rainy',
    'partlycloudy':    'mdi:weather-partly-cloudy',
    'pouring':         'mdi:weather-pouring',
    'rainy':           'mdi:weather-rainy',
    'snowy':           'mdi:weather-snowy',
    'snowy-rainy':     'mdi:weather-snowy-rainy',
    'sunny':           'mdi:weather-sunny',
    'windy':           'mdi:weather-windy',
    'windy-variant':   'mdi:weather-windy-variant',
    'exceptional':     'mdi:alert-circle-outline',
  };

  const WEATHER_IT = {
    'clear-night':     'Sereno',
    'cloudy':          'Nuvoloso',
    'fog':             'Nebbia',
    'hail':            'Grandine',
    'lightning':       'Temporale',
    'lightning-rainy': 'Tmp./Pioggia',
    'partlycloudy':    'P. nuvoloso',
    'pouring':         'Pioggia forte',
    'rainy':           'Pioggia',
    'snowy':           'Neve',
    'snowy-rainy':     'Neve/pioggia',
    'sunny':           'Soleggiato',
    'windy':           'Ventoso',
    'windy-variant':   'Ventoso',
    'exceptional':     'Eccezionale',
  };

  const styles = `
  :host {
    --radius:    28px;
    --radius-sm: 14px;
    --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    display: block;
    font-family: -apple-system, 'Söhne', 'Inter', BlinkMacSystemFont, sans-serif;
  }

  .card {
    background:    var(--bg);
    border:        1px solid var(--border);
    border-radius: var(--radius);
    box-shadow:    var(--shadow);
    color:         var(--text);
    position:      relative;
    overflow:      hidden;
    display:       flex;
    flex-direction: column;
    transition:    var(--transition);
  }

  .card::after {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: linear-gradient(145deg, rgba(255,255,255,0.03) 0%, transparent 100%);
    border-radius: inherit;
    z-index: 0;
  }

  .card.layout-sidebar { flex-direction: row; align-items: stretch; }

  .time-section {
    position:        relative;
    z-index:         1;
    flex:            1;
    min-width:       0;
    padding:         40px 24px;
    display:         flex;
    flex-direction:  column;
    align-items:     center;
    justify-content: center;
  }

  .time-text {
    font-size:   84px;
    font-weight: 700;
    letter-spacing: -0.05em;
    line-height: 1;
    color:       var(--text);
    text-shadow: 0 8px 16px rgba(0,0,0,0.15);
    white-space: nowrap;
  }

  .card.layout-sidebar .time-text { font-size: 62px; }

  .date-text {
    font-size:      15px;
    font-weight:    600;
    color:          var(--accent);
    text-transform: uppercase;
    letter-spacing: 0.15em;
    margin-top:     14px;
    opacity:        0.9;
    text-align:     center;
    white-space:    nowrap;
  }

  .extras-bottom {
    position:        relative;
    z-index:         1;
    display:         flex;
    flex-direction:  row;
    background:      var(--surface);
    border-top:      1px solid var(--border-light);
  }

  .extras-bottom .extra-item {
    flex:            1 1 0;
    min-width:       0;
    display:         flex;
    flex-direction:  column;
    align-items:     center;
    justify-content: center;
    padding:         12px 6px;
    gap:             5px;
    cursor:          default;
    transition:      background 0.2s;
  }

  .extras-bottom .extra-item + .extra-item { border-left: 1px solid var(--border-light); }
  .extras-bottom .extra-item:hover { background: var(--surface-2); }

  .extras-sidebar {
    position:        relative;
    z-index:         1;
    display:         flex;
    flex-direction:  column;
    align-items:     center;
    justify-content: center;
    gap:             4px;
    background:      var(--surface);
    border-right:    1px solid var(--border-light);
    padding:         16px 8px;
    width:           78px;
    flex-shrink:     0;
    box-sizing:      border-box;
  }

  .extras-sidebar .extra-item {
    width:           100%;
    display:         flex;
    flex-direction:  column;
    align-items:     center;
    justify-content: center;
    padding:         10px 6px;
    gap:             5px;
    cursor:          default;
    border-radius:   var(--radius-sm);
    transition:      background 0.2s;
  }

  .extras-sidebar .extra-item + .extra-item {
    border-top:    1px solid var(--border-light);
    border-radius: 0;
    padding-top:   12px;
    margin-top:    4px;
  }

  .extras-sidebar .extra-item:hover { background: var(--surface-2); }

  .extra-icon {
    color:           var(--accent);
    --mdc-icon-size: 22px;
    display:         flex;
    align-items:     center;
    justify-content: center;
    flex-shrink:     0;
    transition:      var(--transition);
  }

  .extra-item:hover .extra-icon { transform: scale(1.12); }

  .extra-value {
    font-weight: 700;
    color:       var(--text);
    text-align:  center;
    line-height: 1.2;
    overflow:    hidden;
    max-width:   100%;
  }

  .extras-bottom .extra-value { font-size: 13px; white-space: nowrap; text-overflow: ellipsis; }
  .extras-sidebar .extra-value { font-size: 11px; white-space: normal; word-break: break-word; }
  `;

  class WeSmartInfiniteClockCard extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this._config   = {};
      this._hass     = null;
      this._timer    = null;
      this._entities = [];
    }

    setConfig(config) {
      this._config = {
        theme:             'dark',
        color:             '#D97757',
        time_format:       24,
        extras_layout:     'bottom',
        translate_weather: false,
        extra_entities:    [],
        ...config,
      };
      this._entities = (this._config.extra_entities || [])
        .slice(0, 3)
        .map(e => typeof e === 'string' ? { entity: e } : e);
      this._applyPalette();
      this._render();
    }

    set hass(hass) { this._hass = hass; this._updateExtras(); }

    connectedCallback() {
      this._updateTime();
      this._timer = setInterval(() => this._updateTime(), 1000);
    }

    disconnectedCallback() {
      if (this._timer) { clearInterval(this._timer); this._timer = null; }
      if (this._mqHandler) {
        window.matchMedia('(prefers-color-scheme: light)').removeEventListener('change', this._mqHandler);
      }
    }

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
          accent:      this._hsl(h, s, accentL),
          bg:          this._hsl(h, c(Math.round(s * 0.40), 30, 50), 8),
          surface:     this._hsl(h, c(Math.round(s * 0.35), 25, 45), 11),
          surface2:    this._hsl(h, c(Math.round(s * 0.28), 20, 38), 16),
          border:      `hsla(0,0%,100%,0.08)`,
          borderLight: `hsla(0,0%,100%,0.05)`,
          text:        this._hsl(h, c(Math.round(s * 0.08), 5, 10), 93),
          textMuted:   this._hsl(h, c(Math.round(s * 0.12), 8, 15), 65),
          textDim:     this._hsl(h, c(Math.round(s * 0.10), 6, 12), 42),
          shadow:      `0 12px 48px ${this._hsla(h, s, 5, 0.5)}`,
        };
      } else {
        const accentL = c(l, 35, 52);
        return {
          accent:      this._hsl(h, s, accentL),
          bg:          this._hsl(h, c(Math.round(s * 0.08), 5, 10), 99),
          surface:     this._hsl(h, c(Math.round(s * 0.12), 8, 15), 95),
          surface2:    this._hsl(h, c(Math.round(s * 0.10), 6, 12), 91),
          border:      this._hsla(h, c(Math.round(s * 0.15), 10, 20), 25, 0.09),
          borderLight: this._hsla(h, c(Math.round(s * 0.12), 8, 18), 25, 0.05),
          text:        this._hsl(h, c(Math.round(s * 0.25), 18, 35), 12),
          textMuted:   this._hsl(h, c(Math.round(s * 0.20), 15, 28), 40),
          textDim:     this._hsl(h, c(Math.round(s * 0.15), 10, 20), 60),
          shadow:      `0 4px 20px ${this._hsla(h, s, 20, 0.08)}`,
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
      this.style.setProperty('--bg',           p.bg);
      this.style.setProperty('--surface',      p.surface);
      this.style.setProperty('--surface-2',    p.surface2);
      this.style.setProperty('--border',       p.border);
      this.style.setProperty('--border-light', p.borderLight);
      this.style.setProperty('--text',         p.text);
      this.style.setProperty('--text-muted',   p.textMuted);
      this.style.setProperty('--text-dim',     p.textDim);
      this.style.setProperty('--shadow',       p.shadow);

      if (this._config.theme === 'auto' && !this._mqHandler) {
        this._mqHandler = () => { this._applyPalette(); };
        window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', this._mqHandler);
      }
    }

    // ── Render ──────────────────────────────────────────────────────────────

    _render() {
      const shadow   = this.shadowRoot;
      shadow.innerHTML = '';

      const style = document.createElement('style');
      style.textContent = styles;
      shadow.appendChild(style);

      const layout    = this._config.extras_layout || 'bottom';
      const hasExtra  = this._entities.length > 0;
      const isSidebar = layout === 'sidebar' && hasExtra;
      const isBottom  = layout === 'bottom'  && hasExtra;

      this._card = document.createElement('div');
      this._card.className = `card layout-${layout}`;

      const timeSectionHTML = `
        <div class="time-section">
          <div class="time-text" id="time-text">--:--</div>
          <div class="date-text" id="date-text">---</div>
        </div>
      `;

      if (isSidebar) {
        this._card.innerHTML = `<div class="extras-sidebar" id="extras-container"></div>${timeSectionHTML}`;
      } else if (isBottom) {
        this._card.innerHTML = `${timeSectionHTML}<div class="extras-bottom" id="extras-container"></div>`;
      } else {
        this._card.innerHTML = timeSectionHTML;
      }

      shadow.appendChild(this._card);
      this._updateTime();
      this._updateExtras();
    }

    _updateTime() {
      const timeEl = this.shadowRoot.querySelector('#time-text');
      const dateEl = this.shadowRoot.querySelector('#date-text');
      if (!timeEl) return;
      const now = new Date();
      timeEl.textContent = now.toLocaleTimeString([], {
        hour: '2-digit', minute: '2-digit', hour12: this._config.time_format === 12,
      });
      if (dateEl) {
        dateEl.textContent = now.toLocaleDateString(undefined, {
          weekday: 'long', day: 'numeric', month: 'long',
        });
      }
    }

    _updateExtras() {
      if (!this._hass || !this._card) return;
      const container = this.shadowRoot.querySelector('#extras-container');
      if (!container || !this._entities.length) return;

      container.innerHTML = this._entities.map(cfg => {
        const state = this._hass.states[cfg.entity];
        if (!state) return '';

        const isWeather = cfg.entity.startsWith('weather.');
        const rawState  = state.state;
        const uom       = state.attributes.unit_of_measurement || '';

        const icon = isWeather
          ? (WEATHER_ICONS[rawState] || 'mdi:weather-partly-cloudy')
          : (cfg.icon || state.attributes.icon || this._defaultIcon(cfg.entity));

        let value;
        if (isWeather && this._config.translate_weather) {
          value = WEATHER_IT[rawState] || rawState;
        } else {
          value = rawState + (uom ? '\u202F' + uom : '');
        }

        return `
          <div class="extra-item" title="${state.attributes.friendly_name || cfg.entity}">
            <ha-icon class="extra-icon" icon="${icon}"></ha-icon>
            <div class="extra-value">${value}</div>
          </div>
        `;
      }).join('');
    }

    _defaultIcon(entity_id) {
      if (entity_id.startsWith('sensor.')) {
        if (entity_id.includes('temp'))    return 'mdi:thermometer';
        if (entity_id.includes('humid'))   return 'mdi:water-percent';
        if (entity_id.includes('power'))   return 'mdi:flash';
        if (entity_id.includes('battery')) return 'mdi:battery';
        if (entity_id.includes('co2'))     return 'mdi:molecule-co2';
        if (entity_id.includes('press'))   return 'mdi:gauge';
        if (entity_id.includes('energy'))  return 'mdi:lightning-bolt';
      }
      if (entity_id.startsWith('binary_sensor.')) return 'mdi:radiobox-marked';
      if (entity_id.startsWith('switch.'))        return 'mdi:toggle-switch';
      if (entity_id.startsWith('light.'))         return 'mdi:lightbulb';
      if (entity_id.startsWith('person.'))        return 'mdi:account';
      return 'mdi:information-outline';
    }

    static getStubConfig() {
      return { theme: 'dark', color: '#D97757', time_format: 24, extras_layout: 'bottom', extra_entities: [] };
    }
  }

  customElements.define('wesmart-infinite-clock-card', WeSmartInfiniteClockCard);

  window.customCards = window.customCards || [];
  window.customCards.push({
    type:        'wesmart-infinite-clock-card',
    name:        'WeSmart Infinite Clock Card',
    description: 'Ambient clock with dynamic InfiniteColor palette.',
    preview:     true,
  });

  console.info(
    `%c WESMART INFINITE CLOCK CARD %c v${CARD_VERSION} `,
    'background:#D97757;color:#fff;font-weight:700;padding:2px 6px;border-radius:4px 0 0 4px',
    'background:#1C1917;color:#D97757;font-weight:600;padding:2px 6px;border-radius:0 4px 4px 0'
  );

})();
