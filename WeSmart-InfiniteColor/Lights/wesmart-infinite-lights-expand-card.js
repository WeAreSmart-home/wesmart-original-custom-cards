/**
 * WeSmart Infinite Lights Expand Card - Home Assistant Custom Card
 * Multi-entity light card with per-row animated inline controls.
 * Part of the WeSmart InfiniteColor system — full palette derived from one base color.
 * Version: 1.0.0
 *
 * Config:
 *   type: custom:wesmart-infinite-lights-expand-card
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
    width:           40px; height: 40px; border-radius: var(--radius-sm);
    background:      var(--surface); border: 1px solid var(--border);
    display:         flex; align-items: center; justify-content: center;
    flex-shrink:     0; transition: var(--transition);
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

  .toggle-switch {
    position: relative; width: 48px; height: 26px; flex-shrink: 0;
    cursor: pointer; -webkit-tap-highlight-color: transparent;
  }

  .toggle-switch input { opacity: 0; width: 0; height: 0; position: absolute; }

  .toggle-track {
    position: absolute; inset: 0; background: var(--track-off);
    border: 1px solid var(--border); border-radius: 13px; transition: var(--transition);
  }

  .toggle-thumb {
    position: absolute; top: 3px; left: 3px; width: 18px; height: 18px; border-radius: 50%;
    background: var(--thumb-off); transition: var(--transition); box-shadow: 0 1px 4px rgba(0,0,0,0.25);
  }

  .toggle-switch.active .toggle-track { background: var(--accent-soft); border-color: var(--accent-border); }
  .toggle-switch.active .toggle-thumb { left: 23px; background: var(--accent); box-shadow: 0 0 10px var(--accent-glow); }

  .separator { height: 1px; background: var(--border); margin: 0 0 10px; }

  .lights-list { display: flex; flex-direction: column; gap: 2px; }

  .light-item { border-radius: var(--radius-xs); overflow: hidden; }

  .light-row {
    display: flex; align-items: center; gap: 12px;
    padding: 9px 8px 9px 6px; border-radius: var(--radius-xs);
    transition: background 0.2s ease, border-radius 0.3s ease;
    cursor: pointer; -webkit-tap-highlight-color: transparent;
  }

  .light-row:hover { background: var(--row-hover); }
  .light-row.light-on { background: var(--row-active); }
  .light-item.expanded .light-row { border-radius: var(--radius-xs) var(--radius-xs) 0 0; }
  .light-row.unavailable { opacity: 0.38; pointer-events: none; }

  .row-icon {
    width: 34px; height: 34px; border-radius: 10px;
    background: var(--surface); border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; transition: var(--transition);
  }

  .light-row.light-on .row-icon { background: var(--accent-soft); border-color: var(--accent-border); }
  .row-icon ha-icon { --mdc-icon-size: 17px; color: var(--text-dim); transition: color 0.25s ease; }
  .light-row.light-on .row-icon ha-icon { color: var(--accent); }

  .row-info { flex: 1; min-width: 0; }

  .row-name {
    font-size: 13px; font-weight: 500; color: var(--text);
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }

  .row-state {
    font-size: 11px; color: var(--text-dim); margin-top: 1px;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis; transition: color 0.2s ease;
  }

  .light-row.light-on .row-state { color: var(--accent); opacity: 0.85; }

  .expand-chevron {
    width: 22px; height: 22px; display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; color: var(--text-dim);
    transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1), color 0.25s ease;
  }

  .expand-chevron ha-icon { --mdc-icon-size: 16px; color: inherit; }
  .light-item.expanded .expand-chevron { transform: rotate(180deg); color: var(--accent); }

  .row-toggle {
    position: relative; width: 44px; height: 24px; flex-shrink: 0;
    cursor: pointer; -webkit-tap-highlight-color: transparent;
  }

  .row-toggle input { opacity: 0; width: 0; height: 0; position: absolute; }
  .row-toggle .toggle-track { border-radius: 12px; }
  .row-toggle .toggle-thumb { width: 16px; height: 16px; top: 3px; left: 3px; }
  .row-toggle.active .toggle-thumb { left: 21px; }

  .expand-panel {
    max-height: 0; overflow: hidden; opacity: 0;
    background: var(--surface); border-top: 1px solid transparent;
    transition:
      max-height   0.4s cubic-bezier(0.4, 0, 0.2, 1),
      opacity      0.3s ease,
      border-color 0.35s ease;
  }

  .light-item.expanded .expand-panel { max-height: 180px; opacity: 1; border-top-color: var(--border); }

  .panel-content {
    padding: 10px 12px 14px 52px; display: flex; flex-direction: column; gap: 12px;
    transform: translateY(-10px); transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .light-item.expanded .panel-content { transform: translateY(0); }

  .panel-off-msg { font-size: 11px; color: var(--text-dim); font-style: italic; padding: 2px 0; }

  .slider-row { display: flex; align-items: center; gap: 10px; }

  .slider-icon {
    width: 16px; height: 16px; display: flex; align-items: center;
    justify-content: center; flex-shrink: 0; color: var(--text-dim);
  }

  .slider-icon ha-icon { --mdc-icon-size: 14px; color: inherit; }

  .slider-track-wrap {
    flex: 1; height: 24px; display: flex; align-items: center;
    cursor: pointer; touch-action: none; user-select: none;
  }

  .slider-track { width: 100%; height: 4px; background: var(--border); border-radius: 2px; position: relative; }

  .slider-fill {
    height: 100%; background: var(--accent); border-radius: 2px; pointer-events: none; min-width: 0;
  }

  .slider-thumb {
    position: absolute; top: 50%; transform: translate(-50%, -50%);
    width: 14px; height: 14px; border-radius: 50%;
    background: #fff; border: 2.5px solid var(--accent);
    box-shadow: 0 0 8px var(--accent-glow); pointer-events: none;
    transition: box-shadow 0.15s ease; will-change: left;
  }

  .slider-track-wrap.dragging .slider-thumb {
    box-shadow: 0 0 0 5px var(--accent-soft), 0 0 14px var(--accent-glow);
  }

  .slider-value {
    font-size: 11px; color: var(--text-muted); width: 40px;
    text-align: right; flex-shrink: 0; font-variant-numeric: tabular-nums;
  }

  .ct-track .slider-track {
    background: linear-gradient(to right, #FFA726, #FFE5A0, #FFFFFF, #C9E4FF);
    height: 5px;
  }

  .ct-track .slider-fill { display: none; }

  .ct-track .slider-thumb { border-color: rgba(180,180,180,0.9); box-shadow: 0 1px 6px rgba(0,0,0,0.28); }
  .ct-track.dragging .slider-thumb { box-shadow: 0 0 0 5px rgba(200,200,200,0.2), 0 2px 10px rgba(0,0,0,0.3); }

  .footer {
    display: flex; align-items: center; justify-content: space-between;
    margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--border);
  }

  .footer-info { font-size: 11px; color: var(--text-dim); display: flex; align-items: center; gap: 4px; }
  .brand-mark { display: flex; align-items: center; gap: 5px; opacity: 0.4; }
  .brand-mark svg { width: 14px; height: 14px; }
  .brand-mark span { font-size: 10px; color: var(--text-dim); letter-spacing: 0.05em; }
  `;

  class WeSmartInfiniteLightsExpandCard extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this._config   = {};
      this._hass     = null;
      this._entities = [];
      this._expanded = null;
      this._dragging = null;
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
        <div class="light-item" data-index="${i}" id="item-${i}">
          <div class="light-row" id="row-${i}">
            <div class="row-icon"><ha-icon id="icon-${i}" icon="mdi:lightbulb-outline"></ha-icon></div>
            <div class="row-info">
              <div class="row-name"  id="name-${i}">${e.name || e.entity}</div>
              <div class="row-state" id="state-${i}">—</div>
            </div>
            <label class="row-toggle" id="toggle-${i}">
              <input type="checkbox" id="input-${i}">
              <div class="toggle-track"></div>
              <div class="toggle-thumb"></div>
            </label>
            <div class="expand-chevron"><ha-icon icon="mdi:chevron-down"></ha-icon></div>
          </div>

          <div class="expand-panel" id="panel-${i}">
            <div class="panel-content">
              <div class="panel-off-msg" id="off-msg-${i}" style="display:none">Turn on to adjust</div>

              <div class="slider-row" id="bri-row-${i}" style="display:none">
                <div class="slider-icon"><ha-icon icon="mdi:brightness-6"></ha-icon></div>
                <div class="slider-track-wrap" id="bri-wrap-${i}" data-index="${i}" data-type="brightness">
                  <div class="slider-track">
                    <div class="slider-fill"  id="bri-fill-${i}"  style="width:0%"></div>
                    <div class="slider-thumb" id="bri-thumb-${i}" style="left:0%"></div>
                  </div>
                </div>
                <div class="slider-value" id="bri-val-${i}">—</div>
              </div>

              <div class="slider-row" id="ct-row-${i}" style="display:none">
                <div class="slider-icon"><ha-icon icon="mdi:thermometer"></ha-icon></div>
                <div class="slider-track-wrap ct-track" id="ct-wrap-${i}" data-index="${i}" data-type="ct">
                  <div class="slider-track">
                    <div class="slider-fill"  id="ct-fill-${i}"  style="width:50%"></div>
                    <div class="slider-thumb" id="ct-thumb-${i}" style="left:50%"></div>
                  </div>
                </div>
                <div class="slider-value" id="ct-val-${i}">—</div>
              </div>
            </div>
          </div>
        </div>
      `).join('');

      return `
        <div class="header">
          <div class="header-left">
            <div class="header-icon-wrap" id="header-icon-wrap"><ha-icon icon="${cfg.icon}"></ha-icon></div>
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

    // ── State ────────────────────────────────────────────────────────────────

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
          if (attrs.color_temp  != null) parts.push(`${Math.round(1000000 / attrs.color_temp)}K`);
          stateText = parts.length ? parts.join(' · ') : 'On';
        }

        const row    = this._q(`#row-${i}`);
        const toggle = this._q(`#toggle-${i}`);
        const input  = this._q(`#input-${i}`);

        if (row) { row.classList.toggle('light-on', isOn && !isUnavail); row.classList.toggle('unavailable', isUnavail); }
        this._q(`#icon-${i}`)?.setAttribute('icon', icon);
        const nameEl  = this._q(`#name-${i}`);  if (nameEl)  nameEl.textContent  = name;
        const stateEl = this._q(`#state-${i}`); if (stateEl) stateEl.textContent = stateText;
        if (toggle) toggle.classList.toggle('active', isOn);
        if (input)  input.checked = isOn;

        this._updateSliders(i, stateObj);
      });

      const subtitle = this._q('#header-subtitle');
      if (subtitle) subtitle.textContent = onCount === 0 ? 'All off' : onCount === validCount ? 'All on' : `${onCount} of ${validCount} on`;
      this._q('#header-icon-wrap')?.classList.toggle('has-active', onCount > 0);
      this._q('#master-toggle')?.classList.toggle('active', onCount > 0);
      const masterInput = this._q('#master-input'); if (masterInput) masterInput.checked = onCount > 0;
    }

    _updateSliders(i, stateObj) {
      const attrs = stateObj.attributes || {};
      const isOn  = stateObj.state === 'on';
      const offMsg = this._q(`#off-msg-${i}`);
      const briRow = this._q(`#bri-row-${i}`);
      const ctRow  = this._q(`#ct-row-${i}`);

      if (offMsg) offMsg.style.display = isOn ? 'none' : '';

      const hasBri = isOn && attrs.brightness != null;
      if (briRow) briRow.style.display = hasBri ? '' : 'none';
      if (hasBri) {
        const pct = Math.round(attrs.brightness / 2.55);
        this._setSlider(i, 'bri', pct);
        const val = this._q(`#bri-val-${i}`); if (val) val.textContent = `${pct}%`;
      }

      const hasCT = isOn && attrs.color_temp != null;
      if (ctRow) ctRow.style.display = hasCT ? '' : 'none';
      if (hasCT) {
        const minMired = attrs.min_mireds || 153, maxMired = attrs.max_mireds || 500;
        const pct = Math.round(((maxMired - attrs.color_temp) / (maxMired - minMired)) * 100);
        this._setSlider(i, 'ct', Math.max(0, Math.min(100, pct)));
        const val = this._q(`#ct-val-${i}`); if (val) val.textContent = `${Math.round(1000000 / attrs.color_temp)}K`;
      }
    }

    _setSlider(i, prefix, pct) {
      const fill  = this._q(`#${prefix}-fill-${i}`);
      const thumb = this._q(`#${prefix}-thumb-${i}`);
      if (fill)  fill.style.width = `${pct}%`;
      if (thumb) thumb.style.left  = `${pct}%`;
    }

    // ── Events ───────────────────────────────────────────────────────────────

    _bindEvents() {
      this._q('#master-toggle').addEventListener('click', () => {
        if (!this._hass) return;
        const anyOn = this._entities.some(c => this._hass.states[c.entity]?.state === 'on');
        const action = anyOn ? 'turn_off' : 'turn_on';
        this._entities.forEach(c => this._hass.callService('light', action, { entity_id: c.entity }));
      });

      this._entities.forEach((cfg, i) => {
        this._q(`#toggle-${i}`)?.addEventListener('click', (e) => {
          e.stopPropagation();
          if (!this._hass) return;
          const s = this._hass.states[cfg.entity];
          if (!s || s.state === 'unavailable') return;
          this._hass.callService('light', s.state === 'on' ? 'turn_off' : 'turn_on', { entity_id: cfg.entity });
        });
      });

      const list = this._q('#lights-list');
      if (!list) return;

      list.addEventListener('click', (e) => {
        if (e.target.closest('.row-toggle') || e.target.closest('.slider-track-wrap')) return;
        const row = e.target.closest('.light-row');
        if (!row) return;
        const item = row.closest('.light-item');
        if (!item) return;
        const idx = parseInt(item.dataset.index, 10);
        if (!isNaN(idx)) this._toggleExpand(idx);
      });

      list.addEventListener('pointerdown', (e) => {
        const wrap = e.target.closest('.slider-track-wrap');
        if (!wrap) return;
        e.preventDefault();
        const idx = parseInt(wrap.dataset.index, 10), type = wrap.dataset.type;
        if (isNaN(idx)) return;
        wrap.setPointerCapture(e.pointerId);
        wrap.classList.add('dragging');
        this._dragging = { idx, type, wrap, value: null };
        this._handleSliderMove(e);
      });

      list.addEventListener('pointermove', (e) => { if (this._dragging) this._handleSliderMove(e); });

      list.addEventListener('pointerup', (e) => {
        if (!this._dragging) return;
        this._handleSliderMove(e);
        this._dragging.wrap.classList.remove('dragging');
        this._applySlider();
        this._dragging = null;
      });

      list.addEventListener('pointercancel', () => {
        if (this._dragging) { this._dragging.wrap.classList.remove('dragging'); this._dragging = null; }
      });
    }

    _toggleExpand(idx) {
      const item = this._q(`#item-${idx}`);
      if (!item) return;
      if (this._expanded === idx) {
        item.classList.remove('expanded');
        this._expanded = null;
      } else {
        if (this._expanded !== null) this._q(`#item-${this._expanded}`)?.classList.remove('expanded');
        item.classList.add('expanded');
        this._expanded = idx;
      }
    }

    _handleSliderMove(e) {
      if (!this._dragging) return;
      const { idx, type, wrap } = this._dragging;
      const rect = wrap.getBoundingClientRect();
      let pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const pctRound = Math.round(pct * 100);

      if (type === 'brightness') {
        this._setSlider(idx, 'bri', pctRound);
        const val = this._q(`#bri-val-${idx}`); if (val) val.textContent = `${pctRound}%`;
        this._dragging.value = Math.round(pct * 255);
      } else {
        const attrs    = this._hass?.states[this._entities[idx]?.entity]?.attributes || {};
        const minMired = attrs.min_mireds || 153, maxMired = attrs.max_mireds || 500;
        const mired    = Math.round(maxMired - pct * (maxMired - minMired));
        this._setSlider(idx, 'ct', pctRound);
        const val = this._q(`#ct-val-${idx}`); if (val) val.textContent = `${Math.round(1000000 / mired)}K`;
        this._dragging.value = mired;
      }
    }

    _applySlider() {
      if (!this._dragging || !this._hass) return;
      const { idx, type, value } = this._dragging;
      const entityId = this._entities[idx]?.entity;
      if (!entityId || value == null) return;
      const params = { entity_id: entityId };
      if (type === 'brightness') params.brightness = value;
      else                       params.color_temp  = value;
      this._hass.callService('light', 'turn_on', params);
    }

    _q(selector) { return this._card?.querySelector(selector) ?? null; }
  }

  customElements.define('wesmart-infinite-lights-expand-card', WeSmartInfiniteLightsExpandCard);

  window.customCards = window.customCards || [];
  window.customCards.push({
    type:        'wesmart-infinite-lights-expand-card',
    name:        'WeSmart Infinite Lights Expand Card',
    description: 'Multi-entity light card with animated per-row controls and dynamic InfiniteColor palette.',
    preview:     true,
  });

  console.info(
    `%c WESMART INFINITE LIGHTS EXPAND CARD %c v${CARD_VERSION} `,
    'background:#D97757;color:#fff;font-weight:700;padding:2px 6px;border-radius:4px 0 0 4px',
    'background:#1C1917;color:#D97757;font-weight:600;padding:2px 6px;border-radius:0 4px 4px 0'
  );
})();
