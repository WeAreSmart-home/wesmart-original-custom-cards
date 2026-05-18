/**
 * WeSmart Infinite Garbage Card - Unified Lab Edition
 * Version: 1.2.1
 * Features: Optimistic UI, Theme Listener, Multi-Waste Support, Real Persistence, Optional Upcoming List.
 */

(() => {
  'use strict';

  const CARD_VERSION = '1.2.1';

  const styles = `
  :host {
    --radius: 20px;
    --radius-sm: 12px;
    --radius-xs: 8px;
    --transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    display: block;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }

  .card {
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 18px;
    box-shadow: var(--shadow);
    transition: var(--transition);
    position: relative;
    overflow: hidden;
  }

  .header { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; }
  .header-icon-wrap {
    width: 40px; height: 40px; border-radius: var(--radius-sm);
    background: var(--surface); border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center;
  }
  .header-icon-wrap ha-icon { --mdc-icon-size: 20px; color: var(--accent); }
  .header-titles { flex: 1; min-width: 0; }
  .header-title { font-size: 16px; font-weight: 700; color: var(--text); }
  .header-subtitle { font-size: 11px; color: var(--text-muted); }

  .btn-config {
    width: 32px; height: 32px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: var(--transition);
    color: var(--text-dim);
  }
  .btn-config:hover { background: var(--surface); color: var(--accent); }
  .btn-config.active { color: var(--accent); transform: rotate(45deg); }

  /* Hero Mode */
  .hero-container {
    background: var(--surface); border-radius: var(--radius-sm);
    border: 1px solid var(--border); padding: 24px;
    display: flex; flex-direction: column; align-items: center; text-align: center;
    min-height: 160px; justify-content: center;
  }
  .hero-items { display: flex; gap: 24px; justify-content: center; flex-wrap: wrap; margin-bottom: 16px; }
  .hero-item { display: flex; flex-direction: column; align-items: center; gap: 10px; }
  .hero-icon-wrap {
    width: 68px; height: 60px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    position: relative;
  }
  .hero-icon-wrap ha-icon { --mdc-icon-size: 32px; z-index: 1; }
  .hero-glow {
    position: absolute; top: 0; left: 0; right: 0; bottom: 0; border-radius: 50%;
    opacity: 0.15; filter: blur(10px); animation: pulse 3s infinite ease-in-out;
  }
  @keyframes pulse {
    0% { transform: scale(0.95); opacity: 0.1; }
    50% { transform: scale(1.15); opacity: 0.3; }
    100% { transform: scale(0.95); opacity: 0.1; }
  }
  .hero-label { font-size: 14px; font-weight: 700; color: var(--text); }
  .hero-status { font-size: 20px; font-weight: 800; color: var(--text); margin-top: 10px; letter-spacing: -0.02em; }
  .hero-empty { font-size: 14px; color: var(--text-dim); font-style: italic; }

  /* List Section */
  .list-title {
    font-size: 11px;
    font-weight: 700;
    color: var(--text-dim);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin: 20px 4px 10px;
  }

  .waste-list {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .waste-row-view {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 12px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-xs);
    transition: var(--transition);
  }

  .row-icon-wrap {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .row-icon-wrap ha-icon { --mdc-icon-size: 18px; }

  .row-info { flex: 1; min-width: 0; }
  .row-name {
    font-size: 13px;
    font-weight: 600;
    color: var(--text);
  }
  .row-days {
    font-size: 11px;
    color: var(--text-muted);
  }

  .row-time {
    font-size: 12px;
    font-weight: 700;
    color: var(--text-dim);
  }

  /* Config Mode */
  .config-container { display: flex; flex-direction: column; gap: 12px; animation: fadeIn 0.3s ease; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
  
  .waste-row {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--radius-sm); padding: 12px;
  }
  .waste-info { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
  .waste-name { font-size: 14px; font-weight: 600; color: var(--text); }
  .days-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 6px; }
  .day-btn {
    height: 36px; border-radius: var(--radius-xs); border: 1px solid var(--border);
    background: var(--bg); color: var(--text-muted); font-size: 11px; font-weight: 700;
    display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s ease;
    user-select: none;
  }
  .day-btn:active { transform: scale(0.92); }
  .day-btn.active { 
    background: var(--btn-accent, var(--accent)); 
    color: #fff; 
    border-color: var(--btn-accent, var(--accent)); 
    box-shadow: 0 0 12px var(--btn-accent, var(--accent)); 
  }

  .footer { display: none; }
  `;

  class WeSmartInfiniteGarbageLabCard extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this._editMode = false;
      this._wasteTypes = [
        { name: 'Umido', icon: 'mdi:leaf', color: '#8B4513' },
        { name: 'Plastica', icon: 'mdi:recycle', color: '#F59E0B' },
        { name: 'Carta', icon: 'mdi:package-variant', color: '#60B4D8' },
        { name: 'Vetro', icon: 'mdi:bottle-wine', color: '#7EC8A0' },
        { name: 'Indifferenziata', icon: 'mdi:delete-empty', color: '#6B5F56' }
      ];
      this._darkListener = (e) => this._applyPalette();
    }

    connectedCallback() {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', this._darkListener);
    }

    disconnectedCallback() {
      window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', this._darkListener);
    }

    setConfig(config) {
      this._config = {
        title: 'Raccolta Rifiuti',
        icon: 'mdi:trash-can',
        color: '#D97757',
        theme: 'auto',
        show_weekly_schedule: true,
        ...config
      };
      this._applyPalette();
    }

    set hass(hass) {
      this._hass = hass;
      const sensor = hass.states['sensor.wesmart_garbage_today'];
      if (!this._optimisticTimeout) {
        this._schedule = sensor ? sensor.attributes.schedule || {} : {};
      }
      this._render();
    }

    _getNextCollection() {
      if (!this._schedule) return null;
      const now = new Date();
      const currentDay = now.getDay() || 7;
      
      for (let i = 0; i < 7; i++) {
        let checkDay = (currentDay + i);
        if (checkDay > 7) checkDay -= 7;
        
        const items = this._schedule[checkDay.toString()];
        if (items && items.length > 0) {
          return { daysUntil: i, items };
        }
      }
      return null;
    }

    _getDayLabel(daysUntil) {
      if (daysUntil === 0) return 'Oggi';
      if (daysUntil === 1) return 'Domani';
      const days = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
      const target = new Date();
      target.setDate(target.getDate() + daysUntil);
      return days[target.getDay()];
    }

    _getDayLabelShort(daysUntil) {
      if (daysUntil === 0) return 'Oggi';
      if (daysUntil === 1) return 'Domani';
      const days = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];
      const target = new Date();
      target.setDate(target.getDate() + daysUntil);
      return days[target.getDay()];
    }

    async _toggleDay(day, waste) {
      const dayStr = day.toString();
      if (!this._schedule[dayStr]) this._schedule[dayStr] = [];
      
      const idx = this._schedule[dayStr].findIndex(x => x.name === waste.name);
      if (idx > -1) {
        this._schedule[dayStr].splice(idx, 1);
      } else {
        this._schedule[dayStr].push({ name: waste.name, icon: waste.icon });
      }

      clearTimeout(this._optimisticTimeout);
      this._optimisticTimeout = setTimeout(() => { this._optimisticTimeout = null; }, 2000);
      
      this._render();

      try {
        await this._hass.callService('wesmart_garbage', 'update_schedule', {
          day: parseInt(day),
          waste_type: waste.name,
          icon: waste.icon
        });
      } catch (err) {
        console.error("Garbage Service Error:", err);
      }
    }

    _hexToHsl(hex) {
      let r = parseInt(hex.slice(1, 3), 16) / 255;
      let g = parseInt(hex.slice(3, 5), 16) / 255;
      let b = parseInt(hex.slice(5, 7), 16) / 255;
      const max = Math.max(r, g, b), min = Math.min(r, g, b);
      let h, s, l = (max + min) / 2;
      if (max === min) h = s = 0;
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
      const isDark = this._config.theme === 'auto'
        ? !window.matchMedia('(prefers-color-scheme: light)').matches
        : this._config.theme !== 'light';
      
      const { h, s, l } = this._hexToHsl(this._config.color);
      const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
      
      const p = isDark ? {
        accent: `hsl(${h},${s}%,${clamp(l, 50, 65)}%)`,
        bg: `hsl(${h},${clamp(s * 0.35, 25, 45)}%, 11%)`,
        surface: `hsl(${h},${clamp(s * 0.28, 20, 38)}%, 16%)`,
        border: `hsla(0,0%,100%,0.08)`,
        text: `hsl(${h}, 5%, 93%)`,
        textMuted: `hsl(${h}, 8%, 65%)`,
        textDim: `hsl(${h}, 6%, 42%)`,
        rowHover: `hsla(0,0%,100%,0.03)`,
        shadow: `0 8px 32px hsla(${h},${s}%,5%,0.45)`
      } : {
        accent: `hsl(${h},${s}%,${clamp(l, 35, 52)}%)`,
        bg: `hsl(${h}, 5%, 99%)`,
        surface: `hsl(${h}, 8%, 95%)`,
        border: `hsla(${h},15%,25%,0.09)`,
        text: `hsl(${h}, 18%, 12%)`,
        textMuted: `hsl(${h}, 15%, 40%)`,
        textDim: `hsl(${h}, 10%, 60%)`,
        rowHover: `hsla(${h}, 10%, 25%, 0.03)`,
        shadow: `0 2px 16px hsla(${h},${s}%,20%,0.07)`
      };
      Object.entries(p).forEach(([k, v]) => this.style.setProperty(`--${k.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`)}`, v));
    }

    _render() {
      const shadow = this.shadowRoot;
      if (!shadow.querySelector('style')) shadow.innerHTML = `<style>${styles}</style>`;
      
      let container = shadow.querySelector('.card');
      if (!container) {
        container = document.createElement('div');
        container.className = 'card';
        shadow.appendChild(container);
      }
      
      const next = this._getNextCollection();
      const daysArr = ['L', 'M', 'M', 'G', 'V', 'S', 'D'];

      // Get all upcoming collections for the list
      const upcoming = [];
      const now = new Date();
      const currentDay = now.getDay() || 7;
      
      for (let i = 0; i < 7; i++) {
        let checkDay = (currentDay + i);
        if (checkDay > 7) checkDay -= 7;
        const items = this._schedule[checkDay.toString()] || [];
        if (items.length > 0) {
          upcoming.push({ daysUntil: i, items });
        }
      }

      container.innerHTML = `
        <div class="header">
          <div class="header-icon-wrap"><ha-icon icon="${this._config.icon}"></ha-icon></div>
          <div class="header-titles">
            <div class="header-title">${this._config.title}</div>
            <div class="header-subtitle">${this._editMode ? 'Programmazione' : 'Stato Ritiro'}</div>
          </div>
          <div class="btn-config ${this._editMode ? 'active' : ''}"><ha-icon icon="mdi:cog"></ha-icon></div>
        </div>

        ${this._editMode ? `
          <div class="config-container">
            ${this._wasteTypes.map(waste => {
              const wasteColor = waste.color;
              return `
                <div class="waste-row">
                  <div class="waste-info">
                    <ha-icon icon="${waste.icon}" style="color: ${wasteColor}; --mdc-icon-size: 18px;"></ha-icon>
                    <div class="waste-name">${waste.name}</div>
                  </div>
                  <div class="days-grid">
                    ${daysArr.map((label, i) => {
                      const dayNum = (i + 1).toString();
                      const isActive = (this._schedule[dayNum] || []).some(x => x.name === waste.name);
                      return `<div class="day-btn ${isActive ? 'active' : ''}" 
                                   style="${isActive ? `--btn-accent: ${wasteColor}` : ''}"
                                   data-day="${dayNum}" 
                                   data-waste='${JSON.stringify(waste)}'>${label}</div>`;
                    }).join('')}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        ` : `
          <div class="hero-container">
            ${next ? `
              <div class="hero-items">
                ${next.items.map(item => {
                  const color = this._wasteTypes.find(w => w.name === item.name)?.color || '#D97757';
                  return `
                    <div class="hero-item">
                      <div class="hero-icon-wrap" style="background: ${color}20;">
                        <div class="hero-glow" style="background: ${color};"></div>
                        <ha-icon icon="${item.icon}" style="color: ${color};"></ha-icon>
                      </div>
                      <div class="hero-label">${item.name}</div>
                    </div>
                  `;
                }).join('')}
              </div>
              <div class="hero-status">
                ${next.daysUntil === 0 ? 'Esporre oggi' : next.daysUntil === 1 ? 'Esporre stasera' : `Prossimo: ${this._getDayLabel(next.daysUntil)}`}
              </div>
            ` : `<div class="hero-empty">Nessun ritiro programmato</div>`}
          </div>

          ${this._config.show_weekly_schedule && upcoming.length > 0 ? `
            <div class="list-title">Calendario Settimanale</div>
            <div class="waste-list">
              ${upcoming.map(day => `
                ${day.items.map(item => {
                  const color = this._wasteTypes.find(w => w.name === item.name)?.color || '#D97757';
                  return `
                    <div class="waste-row-view">
                      <div class="row-icon-wrap" style="background: ${color}15;">
                        <ha-icon icon="${item.icon}" style="color: ${color};"></ha-icon>
                      </div>
                      <div class="row-info">
                        <div class="row-name">${item.name}</div>
                        <div class="row-days">${this._getDayLabelShort(day.daysUntil)}</div>
                      </div>
                      <div class="row-time">${day.daysUntil === 0 ? 'Oggi' : day.daysUntil === 1 ? 'Domani' : `Tra ${day.daysUntil} gg`}</div>
                    </div>
                  `;
                }).join('')}
              `).join('')}
            </div>
          ` : ''}
        `}
      `;

      container.querySelector('.btn-config').onclick = (e) => {
        e.stopPropagation();
        this._editMode = !this._editMode;
        this._render();
      };

      container.querySelectorAll('.day-btn').forEach(btn => {
        btn.onclick = (e) => {
          e.stopPropagation();
          const day = btn.dataset.day;
          const waste = JSON.parse(btn.dataset.waste);
          this._toggleDay(day, waste);
        };
      });
    }
  }

  customElements.define('wesmart-infinite-garbage-lab-card', WeSmartInfiniteGarbageLabCard);
})();
