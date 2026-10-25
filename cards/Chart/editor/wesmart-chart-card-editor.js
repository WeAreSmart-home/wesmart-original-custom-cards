const fireEvent = (node, type, detail, options) => {
  options = options || {};
  detail = detail === null || detail === undefined ? {} : detail;
  const event = new Event(type, {
    bubbles: options.bubbles === undefined ? true : options.bubbles,
    cancelable: Boolean(options.cancelable),
    composed: options.composed === undefined ? true : options.composed,
  });
  event.detail = detail;
  node.dispatchEvent(event);
  return event;
};

class WeSmartChartCardEditor extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._config = {};
    this._hass = null;
    this._initialized = false;
  }

  setConfig(config) {
    this._config = config;
    if (!this._initialized) {
      this.render();
    } else {
      this.updateValues();
    }
  }

  set hass(hass) {
    this._hass = hass;
    if (!this._initialized) {
      this.render();
    } else {
      const el = this.shadowRoot.querySelector('#entity');
      if (el) el.hass = hass;
    }
  }

  render() {
    if (!this._hass || !this._config) return;
    this._initialized = true;

    const c = this._config;
    
    // We expect c.entity or c.entities array.
    const entity = c.entity || (c.entities && c.entities[0] ? (typeof c.entities[0] === 'string' ? c.entities[0] : c.entities[0].entity) : '');
    
    this.shadowRoot.innerHTML = `
      <style>
        .card-config { display: flex; flex-direction: column; gap: 16px; margin-top: 16px; }
        .row { display: flex; flex-direction: column; gap: 4px; }
        .row label { font-size: 14px; font-weight: 500; }
        .row-inline { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
        ha-textfield, ha-select, ha-entity-picker, ha-icon-picker { width: 100%; }
      </style>
      <div class="card-config">
        <ha-entity-picker 
          label="Entità (Entity)" 
          allow-custom-entity
          id="entity"
        ></ha-entity-picker>

        <ha-textfield 
          label="Titolo (Title)" 
          id="title"
        ></ha-textfield>

        <ha-icon-picker 
          label="Icona (Icon)" 
          id="icon"
        ></ha-icon-picker>

        <ha-select label="Tema (Theme)" id="theme">
          <mwc-list-item value="dark">Scuro (Dark)</mwc-list-item>
          <mwc-list-item value="light">Chiaro (Light)</mwc-list-item>
          <mwc-list-item value="auto">Automatico</mwc-list-item>
        </ha-select>
        
        <ha-textfield 
          label="Ore predefinite (Hours)" 
          type="number"
          id="hours"
        ></ha-textfield>

        <ha-textfield 
          label="Altezza grafico (Height)" 
          type="number"
          id="height"
        ></ha-textfield>

        <div class="row-inline">
          <label>Mostra Griglia (Show Grid)</label>
          <ha-switch id="show_grid"></ha-switch>
        </div>

        <div class="row-inline">
          <label>Zoom abilitato (Zoom)</label>
          <ha-switch id="zoom"></ha-switch>
        </div>
      </div>
    `;

    this.updateValues();

    // Attach listeners
    const q = (sel) => this.shadowRoot.querySelector(sel);
    
    ['entity', 'title', 'icon', 'theme', 'hours', 'height'].forEach(id => {
      const el = q('#' + id);
      if(el) {
        // ha- components usually fire 'value-changed' or 'change' or 'closed'
        el.addEventListener('value-changed', (e) => this._valueChanged(id, e.detail.value));
        el.addEventListener('change', (e) => {
          if (e.target.value !== undefined) this._valueChanged(id, e.target.value);
        });
      }
    });
    
    ['show_grid', 'zoom'].forEach(id => {
      const el = q('#' + id);
      if(el) el.addEventListener('change', (e) => this._valueChanged(id, e.target.checked));
    });
  }

  updateValues() {
    const c = this._config;
    const q = (sel) => this.shadowRoot.querySelector(sel);
    const entity = c.entity || (c.entities && c.entities[0] ? (typeof c.entities[0] === 'string' ? c.entities[0] : c.entities[0].entity) : '');
    
    if(q('#entity')) { q('#entity').hass = this._hass; q('#entity').value = entity; }
    if(q('#title')) q('#title').value = c.title || '';
    if(q('#icon')) q('#icon').value = c.icon || '';
    if(q('#theme')) q('#theme').value = c.theme || 'dark';
    if(q('#hours')) q('#hours').value = String(c.hours || 24);
    if(q('#height')) q('#height').value = String(c.height || 100);
    if(q('#show_grid')) q('#show_grid').checked = !!c.show_grid;
    if(q('#zoom')) q('#zoom').checked = c.zoom !== false;
  }

  _valueChanged(key, value) {
    if (!this._config) return;

    let newVal = value;
    if(key === 'hours' || key === 'height') {
       newVal = Number(value);
    }
    
    // Avoid redundant updates
    if (this._config[key] === newVal) return;
    if (key === 'entity' && this._config.entity === newVal) return;

    const config = { ...this._config };
    
    if (key === 'entity') {
      config.entity = newVal; 
      delete config.entities; 
    } else {
      config[key] = newVal;
    }

    fireEvent(this, 'config-changed', { config });
  }
}

customElements.define("wesmart-chart-card-editor", WeSmartChartCardEditor);
