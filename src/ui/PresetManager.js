// PresetManager: Handles saving/loading visualization presets
export default class PresetManager {
  constructor() {
    this.presets = JSON.parse(localStorage.getItem('soundToLightPresets') || '{}');
  }

  savePreset(name, config) {
    this.presets[name] = config;
    localStorage.setItem('soundToLightPresets', JSON.stringify(this.presets));
  }

  loadPreset(name) {
    return this.presets[name] || null;
  }

  getPresetNames() {
    return Object.keys(this.presets);
  }

  deletePreset(name) {
    delete this.presets[name];
    localStorage.setItem('soundToLightPresets', JSON.stringify(this.presets));
  }

  clearPresets() {
    this.presets = {};
    localStorage.removeItem('soundToLightPresets');
  }
}
