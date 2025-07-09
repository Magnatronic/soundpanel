// ControlPanel: Renders and manages the UI controls
export default class ControlPanel {
  constructor(container, config, onChange) {
    this.container = container;
    this.config = config;
    this.onChange = onChange;
    this.render();
  }

  render() {
    this.container.innerHTML = `
      <label>Visualization Mode
        <select id="mode">
          <option value="frequencyBars">Frequency Bars</option>
          <option value="radialBurst">Radial Burst</option>
          <option value="particleSystem">Particle System</option>
          <option value="waveform">Waveform</option>
          <option value="fluidSimulation">Fluid Simulation</option>
        </select>
      </label>
      <label>Sensitivity
        <input type="range" id="sensitivity" min="0.1" max="2" step="0.01" value="${this.config.sensitivity}" />
      </label>
      <label>Color Theme
        <select id="colorTheme">
          <option value="rainbow">Rainbow</option>
          <option value="neon">Neon</option>
          <option value="pastel">Pastel</option>
          <option value="mono">Monochrome</option>
        </select>
      </label>
      <div style="display:flex;gap:0.5rem;">
        <button id="fullscreen">Full Screen</button>
        <button id="pause">Pause/Play</button>
      </div>
      <div style="margin-top:1rem;display:flex;gap:0.5rem;">
        <input id="presetName" type="text" placeholder="Preset name" style="flex:1;" />
        <button id="savePreset">Save Preset</button>
        <button id="loadPreset">Load Preset</button>
      </div>
      <select id="presetList" style="width:100%;margin-top:0.5rem;"></select>
    `;
    this.addListeners();
  }

  addListeners() {
    this.container.querySelector('#mode').addEventListener('change', e => {
      this.onChange('mode', e.target.value);
    });
    this.container.querySelector('#sensitivity').addEventListener('input', e => {
      this.onChange('sensitivity', parseFloat(e.target.value));
    });
    this.container.querySelector('#colorTheme').addEventListener('change', e => {
      this.onChange('colorTheme', e.target.value);
    });
    this.container.querySelector('#fullscreen').addEventListener('click', () => {
      const canvas = document.getElementById('visualizer');
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else if (canvas && canvas.requestFullscreen) {
        canvas.requestFullscreen();
      }
    });
    this.container.querySelector('#pause').addEventListener('click', () => {
      this.onChange('pause');
    });
  }
}
