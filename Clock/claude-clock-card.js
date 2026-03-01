/**
 * Claude Clock Card - Home Assistant Custom Card
 * Sleek ambient clock with optional bottom bar or left sidebar for extra entities.
 * Max 3 extra entities. Shows only icon + state value (no name/label).
 * Weather entities: automatic icon, optional Italian state translation.
 * Version: 2.0.0
 */

(() => {
  const CARD_VERSION = '2.0.0';

  // ─── Weather maps ─────────────────────────────────────────────────────────────

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

  // ─── Styles ───────────────────────────────────────────────────────────────────

  const styles = `
  :host {
    --claude-orange: #D97757;
    --claude-blue:   #60B4D8;
    --claude-radius: 28px;
    --claude-radius-sm: 14px;
    --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    display: block;
    font-family: -apple-system, 'Söhne', 'Inter', BlinkMacSystemFont, sans-serif;
  }

  /* ── Themes ── */
  .card {
    --bg:           #1C1917;
    --surface:      #292524;
    --surface-2:    #332E2A;
    --border:       rgba(255,255,255,0.08);
    --border-light: rgba(255,255,255,0.05);
    --text:         #F5F0EB;
    --text-muted:   #A09080;
    --text-dim:     #6B5F56;
    --shadow:       0 12px 48px rgba(0,0,0,0.5);

    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: var(--claude-radius);
    box-shadow: var(--shadow);
    color: var(--text);
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    transition: var(--transition);
  }

  .card.theme-light {
    --bg:           #FFFEFA;
    --surface:      #F5F0EB;
    --surface-2:    #E8E2DA;
    --border:       rgba(28,25,23,0.09);
    --border-light: rgba(28,25,23,0.05);
    --text:         #1C1917;
    --text-muted:   #6B5F56;
    --text-dim:     #A09080;
    --shadow:       0 4px 20px rgba(0,0,0,0.08);
  }

  @media (prefers-color-scheme: light) {
    .card.theme-auto {
      --bg:           #FFFEFA;
      --surface:      #F5F0EB;
      --surface-2:    #E8E2DA;
      --border:       rgba(28,25,23,0.09);
      --border-light: rgba(28,25,23,0.05);
      --text:         #1C1917;
      --text-muted:   #6B5F56;
      --text-dim:     #A09080;
      --shadow:       0 4px 20px rgba(0,0,0,0.08);
    }
  }

  /* Glassmorphic inner glow */
  .card::after {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: linear-gradient(145deg, rgba(255,255,255,0.03) 0%, transparent 100%);
    border-radius: inherit;
    z-index: 0;
  }

  /* ── Sidebar layout: card becomes a row ── */
  .card.layout-sidebar {
    flex-direction: row;
    align-items: stretch;
  }

  /* ── Time section ── */
  .time-section {
    position: relative;
    z-index: 1;
    flex: 1;
    min-width: 0;
    padding: 40px 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .time-text {
    font-size: 84px;
    font-weight: 700;
    letter-spacing: -0.05em;
    line-height: 1;
    color: var(--text);
    text-shadow: 0 8px 16px rgba(0,0,0,0.15);
    white-space: nowrap;
  }

  /* Slightly smaller time when sidebar is present (less horizontal space) */
  .card.layout-sidebar .time-text {
    font-size: 62px;
  }

  .date-text {
    font-size: 15px;
    font-weight: 600;
    color: var(--claude-blue);
    text-transform: uppercase;
    letter-spacing: 0.15em;
    margin-top: 14px;
    opacity: 0.9;
    text-align: center;
    white-space: nowrap;
  }

  /* ── Bottom extras bar ── */
  .extras-bottom {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: row;
    background: var(--surface);
    border-top: 1px solid var(--border-light);
  }

  .extras-bottom .extra-item {
    flex: 1 1 0;
    min-width: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 12px 6px;
    gap: 5px;
    cursor: default;
    transition: background 0.2s;
  }

  .extras-bottom .extra-item + .extra-item {
    border-left: 1px solid var(--border-light);
  }

  .extras-bottom .extra-item:hover {
    background: var(--surface-2);
  }

  /* ── Sidebar extras (left column) ── */
  .extras-sidebar {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    background: var(--surface);
    border-right: 1px solid var(--border-light);
    padding: 16px 8px;
    width: 78px;
    flex-shrink: 0;
    box-sizing: border-box;
  }

  .extras-sidebar .extra-item {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 10px 6px;
    gap: 5px;
    cursor: default;
    border-radius: var(--claude-radius-sm);
    transition: background 0.2s;
  }

  .extras-sidebar .extra-item + .extra-item {
    border-top: 1px solid var(--border-light);
    border-radius: 0;
    padding-top: 12px;
    margin-top: 4px;
  }

  .extras-sidebar .extra-item:hover {
    background: var(--surface-2);
  }

  /* ── Shared icon + value ── */
  .extra-icon {
    color: var(--claude-orange);
    --mdc-icon-size: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: var(--transition);
  }

  .extra-item:hover .extra-icon {
    transform: scale(1.12);
  }

  .extra-value {
    font-weight: 700;
    color: var(--text);
    text-align: center;
    line-height: 1.2;
    overflow: hidden;
    max-width: 100%;
  }

  /* Bottom bar: single line, ellipsis if too long */
  .extras-bottom .extra-value {
    font-size: 13px;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  /* Sidebar: allow wrap for multi-word weather states */
  .extras-sidebar .extra-value {
    font-size: 11px;
    white-space: normal;
    word-break: break-word;
  }
  `;

  // ─── Custom Element ────────────────────────────────────────────────────────────

  class ClaudeClockCard extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this._config = {};
      this._hass = null;
      this._timer = null;
      this._entities = [];
    }

    setConfig(config) {
      this._config = {
        theme: 'dark',
        time_format: 24,
        extras_layout: 'bottom',   // 'bottom' | 'sidebar'
        translate_weather: false,
        extra_entities: [],
        ...config
      };
      // Normalize entity configs and cap at 3
      this._entities = (this._config.extra_entities || [])
        .slice(0, 3)
        .map(e => typeof e === 'string' ? { entity: e } : e);
      this._render();
    }

    set hass(hass) {
      this._hass = hass;
      this._updateExtras();
    }

    connectedCallback() {
      this._updateTime();
      this._timer = setInterval(() => this._updateTime(), 1000);
    }

    disconnectedCallback() {
      if (this._timer) { clearInterval(this._timer); this._timer = null; }
    }

    _render() {
      const shadow = this.shadowRoot;
      shadow.innerHTML = '';

      const style = document.createElement('style');
      style.textContent = styles;
      shadow.appendChild(style);

      const layout  = this._config.extras_layout || 'bottom';
      const hasExtra = this._entities.length > 0;
      const isSidebar = layout === 'sidebar' && hasExtra;
      const isBottom  = layout === 'bottom'  && hasExtra;

      this._card = document.createElement('div');
      this._card.className = `card theme-${this._config.theme} layout-${layout}`;

      const timeSectionHTML = `
        <div class="time-section">
          <div class="time-text" id="time-text">--:--</div>
          <div class="date-text" id="date-text">---</div>
        </div>
      `;

      if (isSidebar) {
        this._card.innerHTML = `
          <div class="extras-sidebar" id="extras-container"></div>
          ${timeSectionHTML}
        `;
      } else if (isBottom) {
        this._card.innerHTML = `
          ${timeSectionHTML}
          <div class="extras-bottom" id="extras-container"></div>
        `;
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
        hour: '2-digit',
        minute: '2-digit',
        hour12: this._config.time_format === 12
      });
      if (dateEl) {
        dateEl.textContent = now.toLocaleDateString(undefined, {
          weekday: 'long', day: 'numeric', month: 'long'
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

        // Icon: auto for weather, override or fallback for others
        const icon = isWeather
          ? (WEATHER_ICONS[rawState] || 'mdi:weather-partly-cloudy')
          : (cfg.icon || state.attributes.icon || this._defaultIcon(cfg.entity));

        // Value: Italian translation for weather if enabled
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
      return {
        theme: 'dark',
        time_format: 24,
        extras_layout: 'bottom',
        translate_weather: false,
        extra_entities: []
      };
    }
  }

  customElements.define('claude-clock-card', ClaudeClockCard);

  window.customCards = window.customCards || [];
  window.customCards.push({
    type: 'claude-clock-card',
    name: 'Claude Clock Card',
    description: 'Sleek ambient clock with optional bottom bar or left sidebar for extra entities (max 3).',
    preview: true,
  });

})();
