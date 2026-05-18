/**
 * WeSmart Infinite Garbage Config Card
 * Interactive configuration card for the wesmart_garbage integration.
 * Allows selecting waste types and days with real persistence.
 */

(() => {
  'use strict';

  const styles = `
  :host {
    --radius: 20px;
    --radius-sm: 12px;
    --radius-xs: 8px;
    display: block;
  }

  .card {
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 18px;
    box-shadow: var(--shadow);
  }

  .header { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; }
  .header-icon { color: var(--accent); }
  .header-title { font-size: 16px; font-weight: 700; color: var(--text); }

  .config-grid { display: flex; flex-direction: column; gap: 16px; }

  .waste-row {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    padding: 12px;
  }

  .waste-info { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
  .waste-name { font-size: 14px; font-weight: 600; color: var(--text); }
  .waste-icon { color: var(--text-muted); }

  .days-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 6px;
  }

  .day-btn {
    height: 36px;
    border-radius: var(--radius-xs);
    border: 1px solid var(--border);
    background: var(--bg);
    color: var(--text-muted);
    font-size: 11px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    user-select: none;
  }

  .day-btn:hover { background: var(--row-hover); }

  .day-btn.active {
    background: var(--accent);
    color: #fff;
    border-color: var(--accent);
    box-shadow: 0 0 10px var(--accent);
  }

  .day-btn.active.waste-colored {
    box-shadow: 0 0 12px var(--waste-color);
  }

  .footer {
    margin-top: 20px;
    padding-top: 16px;
    border-top: 1px solid var(--border);
    font-size: 10px;
    color: var(--text-dim);
    text-align: center;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  `;

  class WeSmartInfiniteGarbageConfigCard extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this._wasteTypes = [
        { name: 'Umido', icon: 'mdi:leaf', color: '#8B4513' },
        { name: 'Plastica', icon: 'mdi:recycle', color: '#F59E0B' },
        { name: 'Carta', icon: 'mdi:package-variant', color: '#60B4D8' },
        { name: 'Vetro', icon: 'mdi:bottle-wine', color: '#7EC8A0' },
        { name: 'Indifferenziata', icon: 'mdi:delete-empty', color: '#6B5F56' }
      ];
    }

    setConfig(config) {
      this._config = {
        title: 'Configurazione Rifiuti',
        color: '#D97757',
        theme: 'dark',
        ...config
      };
      this._applyPalette();
    }

    set hass(hass) {
      this._hass = hass;
      const sensor = hass.states['sensor.wesmart_garbage_today'];
      this._currentSchedule = sensor ? sensor.attributes.schedule || {} : {};
      this._render();
    }

    async _toggleDay(day, waste) {
      // If this day is already set to this waste, we'd ideally "unset" it.
      // But our service currently only "updates". For now, we just update.
      await this._hass.callService('wesmart_garbage', 'update_schedule', {
        day: parseInt(day),
        waste_type: waste.name,
        icon: waste.icon
      });
    }

    // ── InfiniteColor Engine ────────────────────────────────────────────────
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

    _applyPalette() {
      const isDark = this._config.theme !== 'light';
      const { h, s, l } = this._hexToHsl(this._config.color);
      const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

      const p = isDark ? {
        accent: `hsl(${h}, ${s}%, ${clamp(l, 50, 65)}%)`,
        bg: `hsl(${h}, ${clamp(s * 0.35, 25, 45)}%, 11%)`,
        surface: `hsl(${h}, ${clamp(s * 0.28, 20, 38)}%, 16%)`,
        border: `hsla(0,0%,100%,0.08)`,
        text: `hsl(${h}, 5%, 93%)`,
        textMuted: `hsl(${h}, 8%, 65%)`,
        textDim: `hsl(${h}, 6%, 42%)`,
        rowHover: `hsla(0,0%,100%,0.03)`,
        shadow: `0 8px 32px hsla(${h}, ${s}%, 5%, 0.45)`
      } : {
        accent: `hsl(${h}, ${s}%, ${clamp(l, 35, 52)}%)`,
        bg: `hsl(${h}, 5%, 99%)`,
        surface: `hsl(${h}, 8%, 95%)`,
        border: `hsla(${h}, 15%, 25%, 0.09)`,
        text: `hsl(${h}, 18%, 12%)`,
        textMuted: `hsl(${h}, 15%, 40%)`,
        textDim: `hsl(${h}, 10%, 60%)`,
        rowHover: `hsla(${h}, 10%, 25%, 0.03)`,
        shadow: `0 2px 16px hsla(${h}, ${s}%, 20%, 0.07)`
      };

      Object.entries(p).forEach(([k, v]) => this.style.setProperty(`--${k.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`)}`, v));
    }

    _render() {
      const days = ['L', 'M', 'M', 'G', 'V', 'S', 'D'];
      const shadow = this.shadowRoot;
      shadow.innerHTML = `
        <style>${styles}</style>
        <div class="card">
          <div class="header">
            <ha-icon class="header-icon" icon="mdi:cog"></ha-icon>
            <div class="header-title">${this._config.title}</div>
          </div>
          <div class="config-grid">
            ${this._wasteTypes.map(waste => `
              <div class="waste-row" style="--waste-color: ${waste.color}">
                <div class="waste-info">
                  <ha-icon class="waste-icon" icon="${waste.icon}" style="color: ${waste.color}"></ha-icon>
                  <div class="waste-name">${waste.name}</div>
                </div>
                <div class="days-grid">
                  ${days.map((label, i) => {
                    const dayNum = (i + 1).toString();
                    const isActive = this._currentSchedule[dayNum]?.name === waste.name;
                    return `
                      <div class="day-btn ${isActive ? 'active waste-colored' : ''}" 
                           style="${isActive ? `--accent: ${waste.color}` : ''}"
                           data-day="${dayNum}" 
                           data-waste='${JSON.stringify(waste)}'>
                        ${label}
                      </div>
                    `;
                  }).join('')}
                </div>
              </div>
            `).join('')}
          </div>
          <div class="footer">WeSmart Labs • Real Persistence Engine</div>
        </div>
      `;

      shadow.querySelectorAll('.day-btn').forEach(btn => {
        btn.onclick = () => {
          const day = btn.dataset.day;
          const waste = JSON.parse(btn.dataset.waste);
          this._toggleDay(day, waste);
        };
      });
    }
  }

  customElements.define('wesmart-infinite-garbage-config-card', WeSmartInfiniteGarbageConfigCard);
})();
