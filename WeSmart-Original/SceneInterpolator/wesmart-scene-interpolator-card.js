/**
 * WeSmart Scene Interpolator Card - Home Assistant Custom Card
 * Styled after Anthropic WeSmart AI aesthetic
 * Version: 1.0.0
 */

const CARD_VERSION = '1.0.2';

class WeSmartSceneInterpolatorCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.isDragging = false;
    this.currentX = 0.5;
    this.currentY = 0.5;
    
    // Default corners if none provided
    this.defaultCorners = {
      top_left: { name: 'Mattina', brightness: 80, color_temp: 200, icon: 'mdi:weather-sunny' },
      top_right: { name: 'Pomeriggio', brightness: 60, color_temp: 300, icon: 'mdi:weather-partly-cloudy' },
      bottom_left: { name: 'Sera', brightness: 40, color_temp: 400, icon: 'mdi:weather-sunset' },
      bottom_right: { name: 'Notte', brightness: 10, color_temp: 500, icon: 'mdi:weather-night' }
    };
  }

  set hass(hass) {
    this._hass = hass;
    if (!this.content) {
      this.render();
      this.setupPad();
    }
  }

  setConfig(config) {
    if (!config.entity) {
      throw new Error('You need to define an entity (light or light group)');
    }
    this.config = config;
    
    this.corners = {
      top_left: { ...this.defaultCorners.top_left, ...(config.corners?.top_left || {}) },
      top_right: { ...this.defaultCorners.top_right, ...(config.corners?.top_right || {}) },
      bottom_left: { ...this.defaultCorners.bottom_left, ...(config.corners?.bottom_left || {}) },
      bottom_right: { ...this.defaultCorners.bottom_right, ...(config.corners?.bottom_right || {}) }
    };
  }

  getCardSize() {
    return 4;
  }

  render() {
    const stateObj = this._hass.states[this.config.entity];
    const isOn = stateObj && stateObj.state === 'on';

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          --claude-orange: #D97757;
          --claude-orange-glow: rgba(217, 119, 87, 0.25);
          --claude-surface: #292524;
          --claude-surface-2: #332E2A;
          --claude-border: rgba(255, 255, 255, 0.08);
          --claude-text: #F5F0EB;
          --claude-text-muted: #A09080;
          --claude-radius: 20px;
          --claude-radius-sm: 12px;
          display: block;
          font-family: -apple-system, 'Söhne', 'Inter', BlinkMacSystemFont, sans-serif;
        }

        .card {
          background: var(--claude-surface);
          border: 1px solid var(--claude-border);
          border-radius: var(--claude-radius);
          padding: 20px;
          color: var(--claude-text);
          transition: all 0.3s ease;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .title {
          font-size: 16px;
          font-weight: 500;
        }

        .subtitle {
          font-size: 13px;
          color: var(--claude-text-muted);
          margin-top: 4px;
        }

        .pad-container {
          position: relative;
          width: 100%;
          aspect-ratio: 1;
          background: var(--claude-surface-2);
          border-radius: var(--claude-radius-sm);
          border: 1px solid var(--claude-border);
          overflow: hidden;
          touch-action: none;
        }

        .corner {
          position: absolute;
          padding: 12px;
          color: var(--claude-text-muted);
          font-size: 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          pointer-events: none;
          z-index: 1;
          user-select: none;
        }

        .corner ha-icon {
          --mdc-icon-size: 20px;
        }

        .top-left { top: 0; left: 0; }
        .top-right { top: 0; right: 0; }
        .bottom-left { bottom: 0; left: 0; }
        .bottom-right { bottom: 0; right: 0; }

        .thumb {
          position: absolute;
          width: 44px;
          height: 44px;
          background: var(--claude-surface);
          border: 2px solid var(--claude-orange);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          box-shadow: 0 4px 12px rgba(0,0,0,0.3), 0 0 20px var(--claude-orange-glow);
          z-index: 10;
          cursor: grab;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.1s ease;
        }

        .thumb:active {
          cursor: grabbing;
          transform: translate(-50%, -50%) scale(1.1);
          box-shadow: 0 8px 20px rgba(0,0,0,0.4), 0 0 30px var(--claude-orange-glow);
        }

        .thumb::after {
          content: '';
          width: 12px;
          height: 12px;
          background: var(--claude-orange);
          border-radius: 50%;
        }

        .pad-bg {
          position: absolute;
          inset: 0;
          background: 
            radial-gradient(circle at 0% 0%, rgba(135,206,235,0.05) 0%, transparent 50%),
            radial-gradient(circle at 100% 0%, rgba(255,223,186,0.05) 0%, transparent 50%),
            radial-gradient(circle at 0% 100%, rgba(255,183,130,0.05) 0%, transparent 50%),
            radial-gradient(circle at 100% 100%, rgba(25,25,112,0.05) 0%, transparent 50%);
          pointer-events: none;
        }
      </style>
      <div class="card">
        <div class="header">
          <div>
            <div class="title">${this.config.name || stateObj?.attributes?.friendly_name || 'Scene Interpolator'}</div>
            <div class="subtitle">Trascina per mixare le scene</div>
          </div>
          <ha-icon icon="mdi:palette"></ha-icon>
        </div>
        
        <div class="pad-container" id="pad">
          <div class="pad-bg"></div>
          
          <div class="corner top-left">
            <ha-icon icon="${this.corners.top_left.icon}"></ha-icon>
            <span>${this.corners.top_left.name}</span>
          </div>
          <div class="corner top-right">
            <ha-icon icon="${this.corners.top_right.icon}"></ha-icon>
            <span>${this.corners.top_right.name}</span>
          </div>
          <div class="corner bottom-left">
            <ha-icon icon="${this.corners.bottom_left.icon}"></ha-icon>
            <span>${this.corners.bottom_left.name}</span>
          </div>
          <div class="corner bottom-right">
            <ha-icon icon="${this.corners.bottom_right.icon}"></ha-icon>
            <span>${this.corners.bottom_right.name}</span>
          </div>

          <div class="thumb" id="thumb" style="left: 50%; top: 50%;"></div>
        </div>
      </div>
    `;

    this.content = this.shadowRoot.querySelector('.card');
    this.pad = this.shadowRoot.getElementById('pad');
    this.thumb = this.shadowRoot.getElementById('thumb');
  }

  setupPad() {
    const handleMove = (e) => {
      if (!this.isDragging) return;
      e.preventDefault();
      
      const rect = this.pad.getBoundingClientRect();
      let x = e.clientX || (e.touches && e.touches[0].clientX);
      let y = e.clientY || (e.touches && e.touches[0].clientY);
      
      let normX = (x - rect.left) / rect.width;
      let normY = (y - rect.top) / rect.height;
      
      normX = Math.max(0, Math.min(1, normX));
      normY = Math.max(0, Math.min(1, normY));
      
      this.currentX = normX;
      this.currentY = normY;
      
      this.updateThumbPosition();
      this.interpolateAndApply();
    };

    const startDrag = (e) => {
      this.isDragging = true;
      handleMove(e);
      
      document.addEventListener('mousemove', handleMove);
      document.addEventListener('touchmove', handleMove, { passive: false });
      document.addEventListener('mouseup', stopDrag);
      document.addEventListener('touchend', stopDrag);
    };

    const stopDrag = () => {
      this.isDragging = false;
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('touchmove', handleMove);
      document.removeEventListener('mouseup', stopDrag);
      document.removeEventListener('touchend', stopDrag);
    };

    this.pad.addEventListener('mousedown', startDrag);
    this.pad.addEventListener('touchstart', startDrag, { passive: false });
  }

  updateThumbPosition() {
    this.thumb.style.left = `${this.currentX * 100}%`;
    this.thumb.style.top = `${this.currentY * 100}%`;
  }

  interpolateAndApply() {
    if (this._updateTimeout) {
      clearTimeout(this._updateTimeout);
    }
    this._updateTimeout = setTimeout(() => {
      this._applyInterpolation();
    }, 100); 
  }

  _supportsColorTemp() {
    // Explicit override in config (color_temp: false disables it entirely)
    if (this.config.color_temp === false) return false;

    const stateObj = this._hass.states[this.config.entity];
    if (!stateObj) return false;

    const attrs = stateObj.attributes || {};
    const supportedColorModes = attrs.supported_color_modes || [];

    if (!supportedColorModes.includes('color_temp')) return false;

    // For light groups, supported_color_modes is the UNION of all members.
    // If the group also has other modes (e.g. 'hs', 'rgb', 'onoff'), some
    // members don't support color_temp → HA will reject the call.
    // We require min_mireds to be defined (only present on lights/groups
    // where color_temp is truly applicable) AND that color_temp is the
    // only non-white mode (or explicitly the only mode) to be safe.
    if (attrs.min_mireds === undefined) return false;

    // If the group exposes any mode that implies colour-only lights (no temp),
    // play it safe and skip color_temp to avoid the "extra keys" error.
    const incompatibleModes = ['hs', 'rgb', 'rgbw', 'rgbww', 'xy'];
    if (incompatibleModes.some(m => supportedColorModes.includes(m))) return false;

    return true;
  }

  _applyInterpolation() {
    const x = this.currentX;
    const y = this.currentY;
    const c = this.corners;

    const interp = (valTL, valTR, valBL, valBR) => {
      return (valTL * (1 - x) * (1 - y)) +
             (valTR * x * (1 - y)) +
             (valBL * (1 - x) * y) +
             (valBR * x * y);
    };

    const targetBrightness = Math.round(interp(
      c.top_left.brightness, c.top_right.brightness,
      c.bottom_left.brightness, c.bottom_right.brightness
    ));

    const brightness255 = Math.round((targetBrightness / 100) * 255);

    const serviceData = {
      entity_id: this.config.entity,
      brightness: Math.max(1, brightness255),
    };

    const supportsColorTemp = this._supportsColorTemp();

    if (supportsColorTemp) {
      const stateObj = this._hass.states[this.config.entity];
      const minMireds = stateObj?.attributes?.min_mireds ?? 153;
      const maxMireds = stateObj?.attributes?.max_mireds ?? 500;
      const targetColorTemp = Math.round(interp(
        c.top_left.color_temp, c.top_right.color_temp,
        c.bottom_left.color_temp, c.bottom_right.color_temp
      ));
      // Clamp to entity's supported mired range to avoid HA validation errors
      serviceData.color_temp = Math.max(minMireds, Math.min(maxMireds, targetColorTemp));
    }

    // Primary call — with color_temp if supported
    this._hass.callService('light', 'turn_on', serviceData).catch?.(() => {
      // Fallback: retry without color_temp in case the entity rejected it
      if (serviceData.color_temp !== undefined) {
        const fallbackData = { entity_id: serviceData.entity_id, brightness: serviceData.brightness };
        this._hass.callService('light', 'turn_on', fallbackData);
      }
    });
  }
}

customElements.define('wesmart-scene-interpolator-card', WeSmartSceneInterpolatorCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: 'wesmart-scene-interpolator-card',
  name: 'WeSmart Scene Interpolator',
  preview: true,
  description: 'Interpolazione fluida su XY pad tra 4 scene (luminosità e temperatura colore). v1.0.2',
});