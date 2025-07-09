import AudioProcessor from './audio/AudioProcessor.js';
import FrequencyAnalyzer from './audio/FrequencyAnalyzer.js';
import BeatDetector from './audio/BeatDetector.js';
import ControlPanel from './ui/ControlPanel.js';
import PresetManager from './ui/PresetManager.js';
import FrequencyBars from './visualizations/FrequencyBars.js';
import RadialBurst from './visualizations/RadialBurst.js';
import ParticleSystem from './visualizations/ParticleSystem.js';
import Waveform from './visualizations/Waveform.js';
// import GeometricPatterns from './visualizations/GeometricPatterns.js';
import FluidSimulation from './visualizations/FluidSimulation.js';
import { resizeCanvasToDisplaySize } from './utils/CanvasUtils.js';

const config = {
  sensitivity: 1.0,
  colorTheme: 'rainbow',
  smoothing: 0.8,
  particleCount: 1000,
  fadeSpeed: 0.05,
  minThreshold: 10,
  maxThreshold: 200
};

const canvas = document.getElementById('visualizer');
const controlPanel = document.getElementById('controlPanel');
let audioProcessor, freqAnalyzer, beatDetector, presetManager;
let currentVisualization, animationId;
let mode = 'frequencyBars';
let paused = false;

const visualizations = {
  frequencyBars: FrequencyBars,
  radialBurst: RadialBurst,
  particleSystem: ParticleSystem,
  waveform: Waveform,
  // geometricPatterns: GeometricPatterns,
  fluidSimulation: FluidSimulation
};

function switchVisualization(newMode) {
  if (visualizations[newMode]) {
    mode = newMode;
    currentVisualization = new visualizations[mode](canvas, [], config);
  }
}

function onControlChange(key, value) {
  if (key === 'mode') switchVisualization(value);
  if (key === 'sensitivity') config.sensitivity = value;
  if (key === 'colorTheme') config.colorTheme = value;
  if (key === 'pause') paused = !paused;
}

async function init() {
  audioProcessor = new AudioProcessor(config);
  await audioProcessor.init();
  freqAnalyzer = new FrequencyAnalyzer(audioProcessor.analyser);
  beatDetector = new BeatDetector(config.minThreshold);
  presetManager = new PresetManager();
  switchVisualization(mode);
  new ControlPanel(controlPanel, config, onControlChange);
  setupPresetUI();
function handleResize() {
  resizeCanvasToDisplaySize(canvas);
  if (currentVisualization && typeof currentVisualization.resize === 'function') {
    currentVisualization.resize();
  }
}
window.addEventListener('resize', handleResize);
canvas.addEventListener('fullscreenchange', handleResize);
resizeCanvasToDisplaySize(canvas);
  render();
}

function setupPresetUI() {
  const presetList = document.getElementById('presetList');
  const presetName = document.getElementById('presetName');
  const saveBtn = document.getElementById('savePreset');
  const loadBtn = document.getElementById('loadPreset');
  function refreshList() {
    presetList.innerHTML = '';
    for (const name of presetManager.getPresetNames()) {
      const opt = document.createElement('option');
      opt.value = name;
      opt.textContent = name;
      presetList.appendChild(opt);
    }
  }
  saveBtn.onclick = () => {
    if (presetName.value) {
      presetManager.savePreset(presetName.value, { ...config });
      refreshList();
    }
  };
  loadBtn.onclick = () => {
    const name = presetList.value;
    const preset = presetManager.loadPreset(name);
    if (preset) {
      Object.assign(config, preset);
      switchVisualization(config.mode || mode);
    }
  };
  refreshList();
}

function render() {
  if (paused) {
    animationId = requestAnimationFrame(render);
    return;
  }
  resizeCanvasToDisplaySize(canvas);
  const freqData = audioProcessor.getFrequencyData();
  // Debug: Log average volume to console
  const volume = audioProcessor.getVolume();
  if (window.DEBUG_AUDIO !== false) {
    if (!window._lastLog || performance.now() - window._lastLog > 500) {
      console.log('Volume:', volume, 'First 8 freq bins:', Array.from(freqData).slice(0, 8));
      window._lastLog = performance.now();
    }
  }
  currentVisualization.render(freqData);
  animationId = requestAnimationFrame(render);
}

init();
