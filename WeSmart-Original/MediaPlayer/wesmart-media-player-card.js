/**
 * WeSmart Media Player Card — Home Assistant Custom Card
 *
 * Features:
 *   - Blurred album art background with thumbnail
 *   - Real-time animated progress bar (updates every second)
 *   - Controls: shuffle, previous, play/pause/stop, next, repeat
 *   - Volume slider with mute toggle
 *   - Source selector (optional)
 *   - State-aware UI: playing / paused / idle / off
 *   - All controls respect supported_features bitmask
 *   - Supports dark / light / auto themes
 *
 * Version: 1.0.0
 */

(() => {
  'use strict';

  const CARD_VERSION = '1.0.0';

  // ─── HA supported_features bitmask ──────────────────────────────────────────

  const FEAT = {
    PAUSE:       1,
    SEEK:        2,
    VOLUME_SET:  4,
    VOLUME_MUTE: 8,
    PREVIOUS:    16,
    NEXT:        32,
    TURN_ON:     128,
    TURN_OFF:    256,
    PLAY:        16384,
    SHUFFLE:     32768,
    REPEAT:      262144,
  };

  function supports(stateObj, feature) {
    return ((stateObj?.attributes?.supported_features ?? 0) & feature) !== 0;
  }

  // ─── Helpers ────────────────────────────────────────────────────────────────

  function fmtTime(seconds) {
    if (seconds == null || isNaN(seconds) || seconds < 0) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  function calcPosition(attrs, state) {
    const base = attrs.media_position ?? 0;
    if (state !== 'playing' || !attrs.media_position_updated_at) return base;
    const elapsed = (Date.now() - new Date(attrs.media_position_updated_at).getTime()) / 1000;
    return base + Math.max(0, elapsed);
  }

  function repeatIcon(mode) {
    if (mode === 'one') return 'mdi:repeat-once';
    if (mode === 'all') return 'mdi:repeat';
    return 'mdi:repeat-off';
  }

  function stateLabel(state) {
    const map = { playing: 'Playing', paused: 'Paused', idle: 'Idle', off: 'Off', buffering: 'Buffering', standby: 'Standby' };
    return map[state] ?? state ?? '—';
  }

  // ─── Styles ─────────────────────────────────────────────────────────────────

  const CSS = `
    :host {
      --orange:        #D97757;
      --orange-glow:   rgba(217, 119, 87, 0.30);
      --orange-soft:   rgba(217, 119, 87, 0.12);
      --green:         #7EC8A0;
      --r20: 20px; --r12: 12px; --r8: 8px; --r6: 6px;
      display: block;
      font-family: -apple-system, 'Söhne', 'Inter', BlinkMacSystemFont, sans-serif;
    }

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    /* ── Dark ── */
    .card {
      --bg:     #292524;
      --surf:   #332E2A;
      --bdr:    rgba(255, 255, 255, 0.08);
      --txt:    #F5F0EB;
      --muted:  #A09080;
      --dim:    #6B5F56;
      --shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
      background: var(--bg);
      border: 1px solid var(--bdr);
      border-radius: var(--r20);
      overflow: hidden;
      box-shadow: var(--shadow);
      position: relative;
    }

    /* ── Light ── */
    .card.theme-light {
      --bg:     #FFFEFA;
      --surf:   #F5F0EB;
      --bdr:    rgba(28, 25, 23, 0.09);
      --txt:    #1C1917;
      --muted:  #6B5F56;
      --dim:    #A09080;
      --shadow: 0 2px 16px rgba(0, 0, 0, 0.07), 0 0 0 1px rgba(0, 0, 0, 0.04);
    }

    /* ── Auto ── */
    @media (prefers-color-scheme: light) {
      .card.theme-auto {
        --bg:     #FFFEFA;
        --surf:   #F5F0EB;
        --bdr:    rgba(28, 25, 23, 0.09);
        --txt:    #1C1917;
        --muted:  #6B5F56;
        --dim:    #A09080;
        --shadow: 0 2px 16px rgba(0, 0, 0, 0.07), 0 0 0 1px rgba(0, 0, 0, 0.04);
      }
    }

    /* ── Header ── */
    .header {
      display: flex; align-items: center; gap: 12px;
      padding: 16px 18px 14px;
    }

    .hdr-icon {
      width: 38px; height: 38px;
      border-radius: var(--r12);
      background: var(--surf); border: 1px solid var(--bdr);
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }

    .hdr-icon ha-icon { --mdc-icon-size: 19px; color: var(--orange); }

    .hdr-titles { flex: 1; min-width: 0; }

    .hdr-title {
      font-size: 14px; font-weight: 600;
      color: var(--txt); letter-spacing: -0.01em;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }

    .hdr-sub { font-size: 11px; color: var(--muted); margin-top: 2px; }

    .state-pill {
      display: flex; align-items: center; gap: 5px;
      font-size: 11px; font-weight: 500;
      border-radius: 20px; padding: 3px 10px;
      background: var(--surf); border: 1px solid var(--bdr);
      color: var(--muted); flex-shrink: 0;
      transition: background 0.3s, color 0.3s;
    }

    .state-dot {
      width: 6px; height: 6px; border-radius: 50%;
      background: var(--dim); flex-shrink: 0;
      transition: background 0.3s;
    }

    .state-pill.playing .state-dot { background: var(--green); animation: blink 2s ease-in-out infinite; }
    .state-pill.playing { color: var(--txt); }
    .state-pill.paused .state-dot  { background: var(--orange); }
    .state-pill.paused  { color: var(--orange); }

    @keyframes blink {
      0%, 100% { opacity: 1; }
      50%       { opacity: 0.25; }
    }

    /* ── Art section ── */
    .art-section {
      position: relative;
      height: 128px;
      overflow: hidden;
      margin: 0;
    }

    /* Blurred background */
    .art-bg {
      position: absolute; inset: 0;
      background-size: cover; background-position: center;
      filter: blur(24px) brightness(0.35) saturate(1.4);
      transform: scale(1.15);
      transition: background-image 0.5s ease;
    }

    .art-bg.no-art {
      background: linear-gradient(135deg, #332E2A 0%, #1C1917 100%);
      filter: none; transform: none;
    }

    /* Gradient overlay — bottom fade to card bg */
    .art-overlay {
      position: absolute; inset: 0;
      background: linear-gradient(
        to bottom,
        rgba(41, 37, 36, 0.1) 0%,
        rgba(41, 37, 36, 0.85) 100%
      );
    }

    .card.theme-light .art-overlay,
    .card.theme-auto .art-overlay {
      background: linear-gradient(
        to bottom,
        rgba(255, 250, 250, 0.05) 0%,
        rgba(255, 250, 250, 0.80) 100%
      );
    }

    /* Art content row */
    .art-content {
      position: relative; z-index: 1;
      display: flex; align-items: center; gap: 14px;
      height: 100%; padding: 16px 18px;
    }

    /* Thumbnail */
    .thumb {
      width: 80px; height: 80px;
      border-radius: var(--r12);
      overflow: hidden; flex-shrink: 0;
      background: var(--surf);
      border: 1px solid rgba(255,255,255,0.10);
      box-shadow: 0 4px 20px rgba(0,0,0,0.5);
      display: flex; align-items: center; justify-content: center;
    }

    .thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }

    .thumb-placeholder ha-icon {
      --mdc-icon-size: 36px;
      color: var(--dim);
    }

    /* Track info */
    .track-info { flex: 1; min-width: 0; }

    .track-title {
      font-size: 16px; font-weight: 700;
      color: var(--txt); letter-spacing: -0.02em;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
      line-height: 1.2;
      text-shadow: 0 1px 8px rgba(0,0,0,0.5);
    }

    .track-artist {
      font-size: 13px; font-weight: 500;
      color: var(--muted); margin-top: 4px;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
      text-shadow: 0 1px 6px rgba(0,0,0,0.4);
    }

    .track-album {
      font-size: 11px; color: var(--dim); margin-top: 2px;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
      text-shadow: 0 1px 6px rgba(0,0,0,0.4);
    }

    /* Nothing playing state */
    .idle-state {
      position: relative; z-index: 1;
      display: flex; align-items: center; justify-content: center;
      height: 100%; gap: 10px; color: var(--dim);
    }

    .idle-state ha-icon { --mdc-icon-size: 22px; }
    .idle-state span { font-size: 13px; }

    /* ── Controls area ── */
    .controls-area { padding: 14px 18px 16px; }

    /* Progress bar */
    .progress-row {
      display: flex; align-items: center; gap: 10px;
      margin-bottom: 14px;
    }

    .time-label {
      font-size: 11px; color: var(--dim); flex-shrink: 0;
      font-variant-numeric: tabular-nums; width: 34px;
    }

    .time-label.end { text-align: right; }

    .progress-track {
      flex: 1; height: 3px; border-radius: 2px;
      background: var(--bdr); position: relative;
      cursor: pointer;
    }

    .progress-track:hover { height: 5px; margin-top: -1px; }
    .progress-track { transition: height 0.15s ease; }

    .progress-fill {
      height: 100%; border-radius: 2px;
      background: var(--orange);
      pointer-events: none;
      transition: width 0.5s linear;
      position: relative;
    }

    .progress-fill::after {
      content: '';
      position: absolute; right: -4px; top: 50%;
      transform: translateY(-50%);
      width: 10px; height: 10px; border-radius: 50%;
      background: var(--orange);
      opacity: 0; transition: opacity 0.15s;
      box-shadow: 0 0 8px var(--orange-glow);
    }

    .progress-track:hover .progress-fill::after { opacity: 1; }

    /* Main buttons row */
    .buttons-row {
      display: flex; align-items: center; justify-content: center;
      gap: 4px; margin-bottom: 14px;
    }

    /* Icon buttons */
    .ctrl-btn {
      width: 40px; height: 40px; border-radius: 50%;
      border: none; cursor: pointer; background: transparent;
      display: flex; align-items: center; justify-content: center;
      color: var(--muted);
      transition: background 0.2s, color 0.2s, transform 0.1s;
      -webkit-tap-highlight-color: transparent;
      flex-shrink: 0;
    }

    .ctrl-btn ha-icon { --mdc-icon-size: 22px; pointer-events: none; }

    .ctrl-btn:hover { background: rgba(255,255,255,0.06); color: var(--txt); }
    .ctrl-btn:active { transform: scale(0.92); }

    .ctrl-btn.active { color: var(--orange); }

    .ctrl-btn.disabled {
      opacity: 0.25;
      pointer-events: none;
    }

    /* Play/Pause — larger, filled */
    .play-btn {
      width: 52px; height: 52px; border-radius: 50%;
      border: none; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      background: var(--orange);
      color: #fff;
      box-shadow: 0 0 20px var(--orange-glow);
      transition: background 0.2s, transform 0.1s, box-shadow 0.2s;
      -webkit-tap-highlight-color: transparent;
      flex-shrink: 0;
    }

    .play-btn ha-icon { --mdc-icon-size: 26px; pointer-events: none; }

    .play-btn:hover { background: #E08060; box-shadow: 0 0 28px var(--orange-glow); }
    .play-btn:active { transform: scale(0.93); }

    .play-btn.paused {
      background: var(--surf);
      border: 1px solid var(--bdr);
      color: var(--orange);
      box-shadow: none;
    }

    .play-btn.off {
      background: var(--surf);
      border: 1px solid var(--bdr);
      color: var(--muted);
      box-shadow: none;
    }

    /* Volume row */
    .volume-row {
      display: flex; align-items: center; gap: 10px;
    }

    .vol-btn {
      width: 32px; height: 32px; border-radius: 50%;
      border: none; cursor: pointer; background: transparent;
      display: flex; align-items: center; justify-content: center;
      color: var(--muted); flex-shrink: 0;
      transition: color 0.2s;
      -webkit-tap-highlight-color: transparent;
    }

    .vol-btn ha-icon { --mdc-icon-size: 18px; pointer-events: none; }
    .vol-btn:hover { color: var(--txt); }
    .vol-btn.muted { color: var(--orange); }

    .vol-pct {
      font-size: 11px; color: var(--dim);
      min-width: 30px; text-align: right; flex-shrink: 0;
      font-variant-numeric: tabular-nums;
    }

    /* Range input — volume slider */
    .vol-slider {
      flex: 1; -webkit-appearance: none; appearance: none;
      height: 3px; border-radius: 2px;
      background: var(--bdr);
      outline: none; cursor: pointer;
    }

    .vol-slider::-webkit-slider-runnable-track {
      height: 3px; border-radius: 2px;
    }

    .vol-slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 14px; height: 14px; border-radius: 50%;
      background: var(--orange);
      margin-top: -5.5px;
      box-shadow: 0 0 8px var(--orange-glow);
      cursor: pointer;
      transition: transform 0.1s;
    }

    .vol-slider::-webkit-slider-thumb:hover { transform: scale(1.25); }

    .vol-slider::-moz-range-thumb {
      width: 14px; height: 14px; border-radius: 50%;
      background: var(--orange); border: none;
      box-shadow: 0 0 8px var(--orange-glow);
      cursor: pointer;
    }

    /* Source selector */
    .source-row {
      display: flex; align-items: center; gap: 8px;
      margin-top: 12px; padding-top: 12px;
      border-top: 1px solid var(--bdr);
    }

    .source-label {
      font-size: 11px; color: var(--dim); flex-shrink: 0;
    }

    .source-select {
      flex: 1;
      background: var(--surf); border: 1px solid var(--bdr);
      border-radius: var(--r6); color: var(--txt);
      font-size: 12px; padding: 5px 8px;
      outline: none; cursor: pointer;
      font-family: inherit;
    }

    /* Separator */
    .sep { height: 1px; background: var(--bdr); margin: 0 18px; }

    /* Footer */
    .footer {
      display: flex; align-items: center; justify-content: space-between;
      padding: 10px 18px 14px;
    }

    .footer-txt { font-size: 11px; color: var(--dim); }

    .brand { display: flex; align-items: center; gap: 5px; opacity: 0.4; }
    .brand svg { width: 14px; height: 14px; }
    .brand span { font-size: 10px; color: var(--dim); letter-spacing: 0.05em; }

    /* Unavailable overlay */
    .unavailable-overlay {
      position: absolute; inset: 0;
      background: rgba(41, 37, 36, 0.7);
      display: flex; align-items: center; justify-content: center;
      font-size: 13px; color: var(--muted); z-index: 10;
      border-radius: var(--r20);
    }
  `;

  // ─── Custom Element ──────────────────────────────────────────────────────────

  class WeSmartMediaPlayerCard extends HTMLElement {

    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this._config        = {};
      this._hass          = null;
      this._card          = null;
      this._progressTimer = null;
      this._seeking       = false;
    }

    // ── HA lifecycle ────────────────────────────────────────────────────────────

    static getStubConfig() {
      return {
        entity: 'media_player.living_room',
        title:  '',
        theme:  'dark',
      };
    }

    setConfig(config) {
      if (!config.entity) throw new Error('entity is required');
      this._config = {
        title:        '',
        icon:         'mdi:music-note',
        theme:        'dark',
        show_shuffle: true,
        show_repeat:  true,
        show_volume:  true,
        show_source:  false,
        ...config,
      };
      this._render();
    }

    set hass(hass) {
      this._hass = hass;
      this._update();
    }

    connectedCallback()    { this._startTimer(); }
    disconnectedCallback() { this._stopTimer(); }

    getCardSize() { return 5; }

    // ── Timer (progress bar live update) ────────────────────────────────────────

    _startTimer() {
      this._stopTimer();
      this._progressTimer = setInterval(() => this._tickProgress(), 1000);
    }

    _stopTimer() {
      if (this._progressTimer) { clearInterval(this._progressTimer); this._progressTimer = null; }
    }

    _tickProgress() {
      if (!this._hass || !this._card) return;
      const s = this._hass.states[this._config.entity];
      if (!s || s.state !== 'playing') return;
      this._renderProgress(s);
    }

    // ── Render ──────────────────────────────────────────────────────────────────

    _render() {
      const root = this.shadowRoot;
      root.innerHTML = '';

      const style = document.createElement('style');
      style.textContent = CSS;
      root.appendChild(style);

      this._card = document.createElement('div');
      this._card.className = `card theme-${this._config.theme}`;
      this._card.innerHTML = this._html();
      root.appendChild(this._card);

      this._bindEvents();
      this._update();
    }

    _html() {
      const c = this._config;
      return `
        <!-- Header -->
        <div class="header">
          <div class="hdr-icon"><ha-icon icon="${c.icon}"></ha-icon></div>
          <div class="hdr-titles">
            <div class="hdr-title" id="hdr-title">${c.title || 'Media Player'}</div>
            <div class="hdr-sub" id="hdr-sub">—</div>
          </div>
          <div class="state-pill" id="state-pill">
            <div class="state-dot"></div>
            <span id="state-label">—</span>
          </div>
        </div>

        <!-- Art section -->
        <div class="art-section" id="art-section">
          <div class="art-bg no-art" id="art-bg"></div>
          <div class="art-overlay"></div>

          <!-- Playing content -->
          <div class="art-content" id="art-content">
            <div class="thumb" id="thumb">
              <div class="thumb-placeholder" id="thumb-placeholder">
                <ha-icon icon="mdi:music-note"></ha-icon>
              </div>
              <img id="thumb-img" src="" alt="" style="display:none">
            </div>
            <div class="track-info">
              <div class="track-title" id="track-title">Nothing playing</div>
              <div class="track-artist" id="track-artist"></div>
              <div class="track-album" id="track-album"></div>
            </div>
          </div>

          <!-- Idle/Off content (shown instead when not playing) -->
          <div class="idle-state" id="idle-state" style="display:none">
            <ha-icon icon="mdi:music-note-off"></ha-icon>
            <span id="idle-label">Nothing playing</span>
          </div>
        </div>

        <div class="sep"></div>

        <!-- Controls -->
        <div class="controls-area">

          <!-- Progress bar -->
          <div class="progress-row" id="progress-row">
            <span class="time-label" id="time-cur">0:00</span>
            <div class="progress-track" id="progress-track">
              <div class="progress-fill" id="progress-fill" style="width:0%"></div>
            </div>
            <span class="time-label end" id="time-dur">0:00</span>
          </div>

          <!-- Play / Pause / Skip buttons -->
          <div class="buttons-row">

            <!-- Shuffle -->
            <button class="ctrl-btn" id="btn-shuffle" title="Shuffle" aria-label="Shuffle">
              <ha-icon icon="mdi:shuffle"></ha-icon>
            </button>

            <!-- Previous -->
            <button class="ctrl-btn" id="btn-prev" title="Previous" aria-label="Previous">
              <ha-icon icon="mdi:skip-previous"></ha-icon>
            </button>

            <!-- Play / Pause -->
            <button class="play-btn off" id="btn-play" title="Play/Pause" aria-label="Play/Pause">
              <ha-icon icon="mdi:play"></ha-icon>
            </button>

            <!-- Next -->
            <button class="ctrl-btn" id="btn-next" title="Next" aria-label="Next">
              <ha-icon icon="mdi:skip-next"></ha-icon>
            </button>

            <!-- Repeat -->
            <button class="ctrl-btn" id="btn-repeat" title="Repeat" aria-label="Repeat">
              <ha-icon icon="mdi:repeat-off"></ha-icon>
            </button>

          </div>

          <!-- Volume -->
          <div class="volume-row" id="volume-row">
            <button class="vol-btn" id="btn-mute" title="Mute" aria-label="Mute">
              <ha-icon icon="mdi:volume-high"></ha-icon>
            </button>
            <input type="range" class="vol-slider" id="vol-slider"
              min="0" max="100" step="1" value="50">
            <span class="vol-pct" id="vol-pct">50%</span>
          </div>

          <!-- Source selector -->
          <div class="source-row" id="source-row" style="display:none">
            <span class="source-label">Source</span>
            <select class="source-select" id="source-select"></select>
          </div>

        </div>

        <div class="sep"></div>

        <!-- Footer -->
        <div class="footer">
          <div class="footer-txt">WeSmart Media Player v${CARD_VERSION}</div>
          <div class="brand">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="#D97757"/>
              <circle cx="12" cy="12" r="4" fill="#D97757" opacity="0.6"/>
            </svg>
            <span>WeSmart</span>
          </div>
        </div>
      `;
    }

    // ── State update ─────────────────────────────────────────────────────────────

    _update() {
      if (!this._hass || !this._card) return;

      const s = this._hass.states[this._config.entity];
      if (!s) return;

      const state  = s.state;
      const attrs  = s.attributes || {};
      const c      = this._config;
      const isOn   = state === 'playing' || state === 'paused' || state === 'buffering';
      const isPlaying = state === 'playing' || state === 'buffering';

      // ── Header ──
      const friendlyName = attrs.friendly_name || c.entity;
      this._setText('hdr-title', c.title || friendlyName);
      this._setText('hdr-sub',   attrs.source || friendlyName);

      // State pill
      const pill = this._q('#state-pill');
      if (pill) {
        pill.className = `state-pill ${state}`;
        this._setText('state-label', stateLabel(state));
      }

      // ── Art section ──
      const artContent  = this._q('#art-content');
      const idleState   = this._q('#idle-state');
      const artBg       = this._q('#art-bg');
      const thumbImg    = this._q('#thumb-img');
      const thumbPh     = this._q('#thumb-placeholder');

      if (isOn) {
        artContent?.style && (artContent.style.display = 'flex');
        idleState?.style  && (idleState.style.display  = 'none');

        const artUrl = attrs.entity_picture;
        if (artUrl && artBg) {
          artBg.style.backgroundImage = `url('${artUrl}')`;
          artBg.className = 'art-bg';
        } else if (artBg) {
          artBg.style.backgroundImage = '';
          artBg.className = 'art-bg no-art';
        }

        if (thumbImg && thumbPh) {
          if (artUrl) {
            thumbImg.src = artUrl;
            thumbImg.style.display = 'block';
            thumbPh.style.display  = 'none';
          } else {
            thumbImg.style.display = 'none';
            thumbPh.style.display  = 'flex';
          }
        }

        this._setText('track-title',  attrs.media_title  || '—');
        this._setText('track-artist', attrs.media_artist || '');
        this._setText('track-album',  attrs.media_album_name || '');

      } else {
        artContent?.style && (artContent.style.display = 'none');
        idleState?.style  && (idleState.style.display  = 'flex');
        if (artBg) { artBg.style.backgroundImage = ''; artBg.className = 'art-bg no-art'; }
        this._setText('idle-label', state === 'off' ? 'Turned off' : 'Nothing playing');
      }

      // ── Progress bar ──
      this._renderProgress(s);

      // ── Play button ──
      const playBtn  = this._q('#btn-play');
      const playIcon = this._q('#btn-play ha-icon');
      if (playBtn && playIcon) {
        if (isPlaying) {
          playBtn.className = 'play-btn playing';
          playIcon.setAttribute('icon', 'mdi:pause');
        } else if (state === 'paused') {
          playBtn.className = 'play-btn paused';
          playIcon.setAttribute('icon', 'mdi:play');
        } else {
          playBtn.className = 'play-btn off';
          playIcon.setAttribute('icon', 'mdi:power');
        }
      }

      // ── Previous / Next ──
      this._q('#btn-prev')?.classList.toggle('disabled', !supports(s, FEAT.PREVIOUS));
      this._q('#btn-next')?.classList.toggle('disabled', !supports(s, FEAT.NEXT));

      // ── Shuffle ──
      const shuffleBtn = this._q('#btn-shuffle');
      if (shuffleBtn) {
        const hasShuffle = supports(s, FEAT.SHUFFLE);
        shuffleBtn.classList.toggle('disabled', !hasShuffle || !c.show_shuffle);
        shuffleBtn.classList.toggle('active', !!attrs.shuffle);
      }

      // ── Repeat ──
      const repeatBtn  = this._q('#btn-repeat');
      const repeatIcon_ = this._q('#btn-repeat ha-icon');
      if (repeatBtn && repeatIcon_) {
        const hasRepeat = supports(s, FEAT.REPEAT);
        repeatBtn.classList.toggle('disabled', !hasRepeat || !c.show_repeat);
        repeatBtn.classList.toggle('active', attrs.repeat && attrs.repeat !== 'off');
        repeatIcon_.setAttribute('icon', repeatIcon(attrs.repeat));
      }

      // ── Volume ──
      const volRow = this._q('#volume-row');
      if (volRow) volRow.style.display = c.show_volume && supports(s, FEAT.VOLUME_SET) ? 'flex' : 'none';

      const volSlider = this._q('#vol-slider');
      const volPct    = this._q('#vol-pct');
      const muteBtn   = this._q('#btn-mute');
      const muteIcon  = this._q('#btn-mute ha-icon');

      if (volSlider && !this._seeking) {
        const vol = Math.round((attrs.volume_level ?? 0.5) * 100);
        volSlider.value = vol;
        // CSS gradient for filled track
        volSlider.style.background = `linear-gradient(to right, var(--orange) ${vol}%, var(--bdr) ${vol}%)`;
        if (volPct) volPct.textContent = `${vol}%`;
      }

      if (muteBtn && muteIcon) {
        const muted = attrs.is_volume_muted;
        muteBtn.classList.toggle('muted', muted);
        muteIcon.setAttribute('icon', muted ? 'mdi:volume-off' : 'mdi:volume-high');
      }

      // ── Source selector ──
      const sourceRow = this._q('#source-row');
      const sourceSelect = this._q('#source-select');
      if (sourceRow && sourceSelect) {
        const sourceList = attrs.source_list;
        const showSrc = c.show_source && supports(s, 0x0800 /* SELECT_SOURCE */) && sourceList?.length;
        sourceRow.style.display = showSrc ? 'flex' : 'none';
        if (showSrc) {
          const cur = attrs.source || '';
          if (sourceSelect.dataset.source !== cur || sourceSelect.options.length !== sourceList.length) {
            sourceSelect.innerHTML = sourceList
              .map(src => `<option value="${src}"${src === cur ? ' selected' : ''}>${src}</option>`)
              .join('');
            sourceSelect.dataset.source = cur;
          }
        }
      }
    }

    _renderProgress(s) {
      if (!s || this._seeking) return;
      const attrs    = s.attributes || {};
      const duration = attrs.media_duration;
      const pos      = calcPosition(attrs, s.state);
      const pct      = duration > 0 ? Math.min(100, (pos / duration) * 100) : 0;

      const fill = this._q('#progress-fill');
      if (fill) fill.style.width = `${pct.toFixed(2)}%`;

      this._setText('time-cur', fmtTime(pos));
      this._setText('time-dur', fmtTime(duration));
    }

    // ── Events ───────────────────────────────────────────────────────────────────

    _bindEvents() {
      const c = this._config;

      // Play / Pause / Turn on
      this._q('#btn-play')?.addEventListener('click', () => {
        const s = this._hass?.states[c.entity];
        if (!s) return;
        if (s.state === 'off' || s.state === 'standby') {
          this._call('media_player', 'turn_on', { entity_id: c.entity });
        } else if (s.state === 'playing') {
          const canPause = supports(s, FEAT.PAUSE);
          this._call('media_player', canPause ? 'media_pause' : 'media_stop', { entity_id: c.entity });
        } else {
          this._call('media_player', 'media_play', { entity_id: c.entity });
        }
      });

      // Previous
      this._q('#btn-prev')?.addEventListener('click', () =>
        this._call('media_player', 'media_previous_track', { entity_id: c.entity }));

      // Next
      this._q('#btn-next')?.addEventListener('click', () =>
        this._call('media_player', 'media_next_track', { entity_id: c.entity }));

      // Shuffle
      this._q('#btn-shuffle')?.addEventListener('click', () => {
        const s = this._hass?.states[c.entity];
        if (!s || !supports(s, FEAT.SHUFFLE)) return;
        this._call('media_player', 'shuffle_set', { entity_id: c.entity, shuffle: !s.attributes.shuffle });
      });

      // Repeat
      this._q('#btn-repeat')?.addEventListener('click', () => {
        const s = this._hass?.states[c.entity];
        if (!s || !supports(s, FEAT.REPEAT)) return;
        const modes = ['off', 'all', 'one'];
        const cur   = s.attributes.repeat || 'off';
        const next  = modes[(modes.indexOf(cur) + 1) % modes.length];
        this._call('media_player', 'repeat_set', { entity_id: c.entity, repeat: next });
      });

      // Mute
      this._q('#btn-mute')?.addEventListener('click', () => {
        const s = this._hass?.states[c.entity];
        if (!s || !supports(s, FEAT.VOLUME_MUTE)) return;
        this._call('media_player', 'volume_mute', {
          entity_id: c.entity,
          is_volume_muted: !s.attributes.is_volume_muted,
        });
      });

      // Volume slider
      const volSlider = this._q('#vol-slider');
      if (volSlider) {
        volSlider.addEventListener('input', (e) => {
          this._seeking = true;
          const vol = parseInt(e.target.value, 10);
          const pct = this._q('#vol-pct');
          if (pct) pct.textContent = `${vol}%`;
          volSlider.style.background = `linear-gradient(to right, var(--orange) ${vol}%, var(--bdr) ${vol}%)`;
        });
        volSlider.addEventListener('change', (e) => {
          this._seeking = false;
          const vol = parseInt(e.target.value, 10) / 100;
          this._call('media_player', 'volume_set', { entity_id: c.entity, volume_level: vol });
        });
      }

      // Progress bar — seek on click
      this._q('#progress-track')?.addEventListener('click', (e) => {
        const s = this._hass?.states[c.entity];
        if (!s || !supports(s, FEAT.SEEK)) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const pct  = (e.clientX - rect.left) / rect.width;
        const dur  = s.attributes.media_duration;
        if (!dur) return;
        this._call('media_player', 'media_seek', { entity_id: c.entity, seek_position: pct * dur });
      });

      // Source select
      this._q('#source-select')?.addEventListener('change', (e) => {
        this._call('media_player', 'select_source', { entity_id: c.entity, source: e.target.value });
      });
    }

    // ── Helpers ──────────────────────────────────────────────────────────────────

    _call(domain, service, data) {
      this._hass?.callService(domain, service, data);
    }

    _setText(id, text) {
      const el = this._q(`#${id}`);
      if (el) el.textContent = text;
    }

    _q(sel) { return this._card?.querySelector(sel) ?? null; }
  }

  // ─── Config Editor (stub) ────────────────────────────────────────────────────

  class WeSmartMediaPlayerCardEditor extends HTMLElement {
    setConfig(config) { this._config = config; }
    set hass(hass)    { this._hass   = hass; }
  }

  // ─── Register ────────────────────────────────────────────────────────────────

  customElements.define('wesmart-media-player-card',        WeSmartMediaPlayerCard);
  customElements.define('wesmart-media-player-card-editor', WeSmartMediaPlayerCardEditor);

  window.customCards = window.customCards || [];
  window.customCards.push({
    type:        'wesmart-media-player-card',
    name:        'WeSmart Media Player Card',
    description: 'Full-featured media player with album art, animated progress bar, playback controls and volume.',
    preview:     true,
  });

  console.info(
    `%c WESMART MEDIA PLAYER CARD %c v${CARD_VERSION} `,
    'background:#D97757;color:#fff;font-weight:700;padding:2px 6px;border-radius:4px 0 0 4px',
    'background:#1C1917;color:#D97757;font-weight:600;padding:2px 6px;border-radius:0 4px 4px 0'
  );

})();
