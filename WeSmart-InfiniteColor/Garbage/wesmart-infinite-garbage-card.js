/**
 * WeSmart Infinite Garbage Card - Home Assistant Custom Card
 * Self-contained garbage collection calendar card.
 * Part of the WeSmart InfiniteColor system — full palette derived from one base color.
 * No sensors required — logic is handled internally based on YAML schedule.
 * Version: 1.0.0
 *
 * Config:
 *   type: custom:wesmart-infinite-garbage-card
 *   color: "#A09080"    # base interface color (InfiniteColor engine)
 *   theme: dark | light | auto
 *   title: Raccolta Rifiuti
 *   schedule:
 *     - name: Umido
 *       icon: mdi:leaf
 *       waste_color: "#8B4513"
 *       days: [1, 4] # 1=Mon, 4=Thu
 */

(() => {
  'use strict';

  const CARD_VERSION = '1.0.0';

  const styles = `
  :host {
    --radius:    20px;
    --radius-sm: 12px;
    --radius-xs: 8px;
    --transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    display: block;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .card {
    background:  var(--bg);
    border:      1px solid var(--border);
    border-radius: var(--radius);
    padding:     18px;
    position:    relative;
    overflow:    hidden;
    box-shadow:  var(--shadow);
    transition:  border-color 0.3s ease, box-shadow 0.3s ease;
  }

  .header { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; }

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
  }

  .header-icon-wrap ha-icon { --mdc-icon-size: 20px; color: var(--accent); }

  .header-titles { flex: 1; min-width: 0; }
  .header-title {
    font-size: 16px; font-weight: 700; color: var(--text);
    letter-spacing: -0.01em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .header-subtitle { font-size: 12px; color: var(--text-muted); margin-top: 2px; }

  /* Hero Section */
  .hero-container {
    background: var(--surface);
    border-radius: var(--radius-sm);
    border: 1px solid var(--border);
    padding: 20px;
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    position: relative;
    overflow: hidden;
  }

  .hero-items {
    display: flex;
    gap: 24px;
    justify-content: center;
    flex-wrap: wrap;
    margin-bottom: 12px;
  }

  .hero-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }

  .hero-icon-wrap {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    transition: var(--transition);
  }

  .hero-icon-wrap ha-icon {
    --mdc-icon-size: 32px;
    z-index: 1;
  }

  .hero-glow {
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    border-radius: 50%;
    opacity: 0.15;
    filter: blur(8px);
    animation: pulse 3s infinite ease-in-out;
  }

  @keyframes pulse {
    0% { transform: scale(0.95); opacity: 0.1; }
    50% { transform: scale(1.1); opacity: 0.25; }
    100% { transform: scale(0.95); opacity: 0.1; }
  }

  .hero-label {
    font-size: 14px;
    font-weight: 600;
    color: var(--text);
  }

  .hero-badge {
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-top: 4px;
  }

  .hero-time {
    font-size: 18px;
    font-weight: 800;
    color: var(--text);
    margin-top: 4px;
    letter-spacing: -0.02em;
  }

  /* List Section */
  .list-title {
    font-size: 11px;
    font-weight: 700;
    color: var(--text-dim);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin: 0 4px 10px;
  }

  .waste-list {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .waste-row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 12px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-xs);
    transition: var(--transition);
  }

  .waste-row:hover {
    background: var(--row-hover);
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

  .footer {
    display: flex; align-items: center; justify-content: space-between;
    margin-top: 16px; padding-top: 16px; border-top: 1px solid var(--border);
  }

  .brand-mark { display: flex; align-items: center; gap: 5px; opacity: 0.4; }
  .brand-mark svg { width: 14px; height: 14px; }
  .brand-mark span { font-size: 10px; color: var(--text-dim); letter-spacing: 0.05em; font-weight: 700; }
  `;

  class WeSmartInfiniteGarbageCard extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this._config = {};
    }

    static getStubConfig() {
      return {
        title: 'Raccolta Rifiuti',
        schedule: [
          { name: 'Umido', icon: 'mdi:leaf', waste_color: '#8B4513', days: [1, 4] },
          { name: 'Plastica', icon: 'mdi:recycle', waste_color: '#F59E0B', days: [3] }
        ]
      };
    }

    setConfig(config) {
      if (!config.schedule || !Array.isArray(config.schedule)) {
        throw new Error('Please define a schedule array');
      }
      this._config = {
        title: 'Raccolta Rifiuti',
        icon: 'mdi:trash-can',
        theme: 'dark',
        color: '#A09080',
        ...config
      };
      this._applyPalette();
      this._render();
    }

    set hass(hass) {
      // This card doesn't rely on hass for state, but we need it for icons and themes
      this._hass = hass;
      // We re-render if the day has changed since last render
      const today = new Date().toDateString();
      if (this._lastRenderDay !== today) {
        this._render();
      }
    }

    // ── Calendar Logic ──────────────────────────────────────────────────────

    _getCalculatedSchedule() {
      const now = new Date();
      const currentDay = now.getDay() || 7; // 1=Mon, ..., 7=Sun

      const schedule = this._config.schedule.map(item => {
        let minDays = 99;
        const days = Array.isArray(item.days) ? item.days : [item.days];
        
        days.forEach(d => {
          let diff = d - currentDay;
          if (diff < 0) diff += 7;
          if (diff < minDays) minDays = diff;
        });

        return { ...item, daysUntil: minDays };
      });

      return schedule.sort((a, b) => a.daysUntil - b.daysUntil);
    }

    _getDayLabel(daysUntil) {
      if (daysUntil === 0) return 'Oggi';
      if (daysUntil === 1) return 'Domani';
      if (daysUntil < 7) {
        const days = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + daysUntil);
        return days[targetDate.getDay()];
      }
      return `Tra ${daysUntil} giorni`;
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

    _hsl(h, s, l) { return `hsl(${h},${s}%,${l}%)`; }
    _hsla(h, s, l, a) { return `hsla(${h},${s}%,${l}%,${a})`; }
    _clamp(v, min, max) { return Math.min(max, Math.max(min, v)); }

    _applyPalette() {
      const isDark = this._config.theme === 'auto'
        ? !window.matchMedia('(prefers-color-scheme: light)').matches
        : this._config.theme !== 'light';
      
      const { h, s, l } = this._hexToHsl(this._config.color);
      const c = this._clamp.bind(this);

      const p = isDark ? {
        accent:       this._hsl(h, s, c(l, 50, 65)),
        bg:           this._hsl(h, c(Math.round(s * 0.35), 25, 45), 11),
        surface:      this._hsl(h, c(Math.round(s * 0.28), 20, 38), 16),
        border:       `hsla(0,0%,100%,0.08)`,
        text:         this._hsl(h, c(Math.round(s * 0.08), 5, 10), 93),
        textMuted:    this._hsl(h, c(Math.round(s * 0.12), 8, 15), 65),
        textDim:      this._hsl(h, c(Math.round(s * 0.10), 6, 12), 42),
        rowHover:     `hsla(0,0%,100%,0.03)`,
        shadow:       `0 8px 32px ${this._hsla(h, s, 5, 0.45)}`,
      } : {
        accent:       this._hsl(h, s, c(l, 35, 52)),
        bg:           this._hsl(h, c(Math.round(s * 0.08), 5, 10), 99),
        surface:      this._hsl(h, c(Math.round(s * 0.12), 8, 15), 95),
        border:       this._hsla(h, c(Math.round(s * 0.15), 10, 20), 25, 0.09),
        text:         this._hsl(h, c(Math.round(s * 0.25), 18, 35), 12),
        textMuted:    this._hsl(h, c(Math.round(s * 0.20), 15, 28), 40),
        textDim:      this._hsl(h, c(Math.round(s * 0.15), 10, 20), 60),
        rowHover:     this._hsla(h, c(Math.round(s * 0.15), 10, 20), 25, 0.03),
        shadow:       `0 2px 16px ${this._hsla(h, s, 20, 0.07)}, 0 0 0 1px ${this._hsla(h, s, 20, 0.04)}`,
      };

      this.style.setProperty('--accent', p.accent);
      this.style.setProperty('--bg', p.bg);
      this.style.setProperty('--surface', p.surface);
      this.style.setProperty('--border', p.border);
      this.style.setProperty('--text', p.text);
      this.style.setProperty('--text-muted', p.textMuted);
      this.style.setProperty('--text-dim', p.textDim);
      this.style.setProperty('--row-hover', p.rowHover);
      this.style.setProperty('--shadow', p.shadow);
    }

    _brandSVG() {
      const fill = this.style.getPropertyValue('--accent') || '#D97757';
      return `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.3 2.45a.74.74 0 0 0-1.38 0l-1.18 3.27H11.3L10.1 2.45a.74.74 0 0 0-1.38 0L7.3 6.37 4.1 7.56a.74.74 0 0 0 0 1.38l3.2 1.19.82 2.28-3.26 1.18a.74.74 0 0 0 0 1.38l3.26 1.18L9.3 19.2l-2.1.76a.74.74 0 0 0 0 1.38l3.26 1.18.45 1.24a.74.74 0 0 0 1.38 0l.45-1.24 3.26-1.18a.74.74 0 0 0 0-1.38l-2.1-.76 1.18-3.27 3.26-1.18a.74.74 0 0 0 0-1.38l-3.26-1.18.82-2.28 3.2-1.19a.74.74 0 0 0 0-1.38l-3.2-1.19-1.37-3.92z" fill="${fill}"/>
      </svg>`;
    }

    // ── Rendering ───────────────────────────────────────────────────────────

    _render() {
      this._lastRenderDay = new Date().toDateString();
      const shadow = this.shadowRoot;
      shadow.innerHTML = '';

      const style = document.createElement('style');
      style.textContent = styles;
      shadow.appendChild(style);

      const schedule = this._getCalculatedSchedule();
      const minDays = schedule[0]?.daysUntil ?? 0;
      
      const heroItems = schedule.filter(item => item.daysUntil === minDays);
      const listItems = schedule.filter(item => item.daysUntil !== minDays);

      const container = document.createElement('div');
      container.className = 'card';
      container.innerHTML = `
        <div class="header">
          <div class="header-icon-wrap"><ha-icon icon="${this._config.icon}"></ha-icon></div>
          <div class="header-titles">
            <div class="header-title">${this._config.title}</div>
            <div class="header-subtitle">Calendario settimanale</div>
          </div>
        </div>

        <div class="hero-container">
          <div class="hero-items">
            ${heroItems.map(item => `
              <div class="hero-item">
                <div class="hero-icon-wrap" style="background: ${item.waste_color}20;">
                  <div class="hero-glow" style="background: ${item.waste_color};"></div>
                  <ha-icon icon="${item.icon}" style="color: ${item.waste_color};"></ha-icon>
                </div>
                <div class="hero-label">${item.name}</div>
                <div class="hero-badge" style="background: ${item.waste_color}; color: #fff;">
                  ${this._getDayLabel(item.daysUntil)}
                </div>
              </div>
            `).join('')}
          </div>
          <div class="hero-time">
            ${minDays === 0 ? 'Esporre oggi' : minDays === 1 ? 'Esporre stasera' : `Prossimo: ${this._getDayLabel(minDays)}`}
          </div>
        </div>

        ${listItems.length > 0 ? `
          <div class="list-title">Prossimi ritiri</div>
          <div class="waste-list">
            ${listItems.map(item => `
              <div class="waste-row">
                <div class="row-icon-wrap" style="background: ${item.waste_color}15;">
                  <ha-icon icon="${item.icon}" style="color: ${item.waste_color};"></ha-icon>
                </div>
                <div class="row-info">
                  <div class="row-name">${item.name}</div>
                  <div class="row-days">${item.days.map(d => ['Lun','Mar','Mer','Gio','Ven','Sab','Dom'][d-1]).join(', ')}</div>
                </div>
                <div class="row-time">${this._getDayLabel(item.daysUntil)}</div>
              </div>
            `).join('')}
          </div>
        ` : ''}

        <div class="footer">
          <div class="brand-mark">${this._brandSVG()}<span>WeSmart</span></div>
        </div>
      `;

      shadow.appendChild(container);
    }
  }

  customElements.define('wesmart-infinite-garbage-card', WeSmartInfiniteGarbageCard);

  window.customCards = window.customCards || [];
  window.customCards.push({
    type: 'wesmart-infinite-garbage-card',
    name: 'WeSmart Infinite Garbage Card',
    description: 'Calendario raccolta differenziata autonomo con estetica InfiniteColor.',
    preview: true,
  });

  console.info(
    `%c WESMART GARBAGE CARD %c v${CARD_VERSION} `,
    'background:#D97757;color:#fff;font-weight:700;padding:2px 6px;border-radius:4px 0 0 4px',
    'background:#1C1917;color:#D97757;font-weight:600;padding:2px 6px;border-radius:0 4px 4px 0'
  );
})();
