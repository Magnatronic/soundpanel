import AudioProcessor from './audio/AudioProcessor.js';
import FrequencyAnalyzer from './audio/FrequencyAnalyzer.js';
import BeatDetector from './audio/BeatDetector.js';
import { resizeCanvasToDisplaySize } from './utils/CanvasUtils.js';
import FrequencyBars from './visualizations/FrequencyBars.js';
import RadialBurst from './visualizations/RadialBurst.js';
import ParticleSystem from './visualizations/ParticleSystem.js';
import Waveform from './visualizations/Waveform.js';
import FluidSimulation from './visualizations/FluidSimulation.js';

// Mount the new title bar and modal UI

// Inject TitleBar.html contents into the DOM at runtime (no import)
fetch(import.meta.env.BASE_URL + 'TitleBar.html')
  .then(r => r.text())
  .then(html => {
    const temp = document.createElement('div');
    temp.innerHTML = html;
    // Move style to head
    const style = temp.querySelector('style');
    if (style) document.head.appendChild(style);
    // Move titleBar and settingsModal to body
    const titleBar = temp.querySelector('#titleBar');
    const settingsModal = temp.querySelector('#settingsModal');
    if (titleBar) {
      const oldBar = document.getElementById('titleBar');
      if (oldBar) oldBar.replaceWith(titleBar);
      else document.body.prepend(titleBar);
    }
    if (settingsModal) {
      const oldModal = document.getElementById('settingsModal');
      if (oldModal) oldModal.replaceWith(settingsModal);
      else document.body.appendChild(settingsModal);
    }
    // Re-run UI event handler setup after DOM injection
    setupUIEventHandlers();
  });

function setupUIEventHandlers() {
  setActiveModeIcon(mode);
  document.getElementById('mode-frequencyBars').onclick = () => { switchVisualization('frequencyBars'); setActiveModeIcon('frequencyBars'); };
  document.getElementById('mode-radialBurst').onclick = () => { switchVisualization('radialBurst'); setActiveModeIcon('radialBurst'); };
  document.getElementById('mode-particleSystem').onclick = () => { switchVisualization('particleSystem'); setActiveModeIcon('particleSystem'); };
  document.getElementById('mode-waveform').onclick = () => { switchVisualization('waveform'); setActiveModeIcon('waveform'); };
  document.getElementById('mode-fluidSimulation').onclick = () => { switchVisualization('fluidSimulation'); setActiveModeIcon('fluidSimulation'); };

  document.getElementById('fullscreenBtn').onclick = () => {
    const canvas = document.getElementById('visualizer');
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else if (canvas && canvas.requestFullscreen) {
      canvas.requestFullscreen();
    }
  };

  document.getElementById('pauseBtn').onclick = () => {
    paused = !paused;
    document.getElementById('pauseBtn').textContent = paused ? 'play_arrow' : 'pause';
  };

  document.getElementById('settingsBtn').onclick = () => {
    document.getElementById('settingsModal').classList.remove('hidden');
  };
  document.getElementById('closeSettings').onclick = () => {
    document.getElementById('settingsModal').classList.add('hidden');
  };

  document.getElementById('sensitivityRange').oninput = (e) => {
    config.sensitivity = parseFloat(e.target.value);
  };
  document.getElementById('colorThemeSelect').onchange = (e) => {
    config.colorTheme = e.target.value;
  };
}

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
let audioProcessor, freqAnalyzer, beatDetector;
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
  switchVisualization(mode);
  window.addEventListener('resize', handleResize);
  resizeCanvasToDisplaySize(canvas);
  render();
}

function handleResize() {
  resizeCanvasToDisplaySize(canvas);
  if (currentVisualization && typeof currentVisualization.resize === 'function') {
    currentVisualization.resize();
  }
}

window.addEventListener('resize', handleResize);
canvas.addEventListener('fullscreenchange', handleResize);
resizeCanvasToDisplaySize(canvas);

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

// --- UI Event Handlers ---
function setActiveModeIcon(mode) {
  document.querySelectorAll('.mode-icon').forEach(icon => icon.classList.remove('active'));
  const icon = document.getElementById('mode-' + mode);
  if (icon) icon.classList.add('active');
}

init();
