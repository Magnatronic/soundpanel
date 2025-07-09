// AudioProcessor: Handles microphone input and audio analysis
export default class AudioProcessor {
  constructor(config) {
    this.config = config;
    this.audioContext = null;
    this.analyser = null;
    this.dataArray = null;
    this.stream = null;
    this.fftSize = 2048;
    this.smoothing = config.smoothing || 0.8;
  }

  async init() {
    this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = this.fftSize;
    this.analyser.smoothingTimeConstant = this.smoothing;
    const source = this.audioContext.createMediaStreamSource(this.stream);
    source.connect(this.analyser);
    this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
  }

  getFrequencyData() {
    this.analyser.getByteFrequencyData(this.dataArray);
    return this.dataArray;
  }

  getVolume() {
    this.analyser.getByteTimeDomainData(this.dataArray);
    let sum = 0;
    for (let i = 0; i < this.dataArray.length; i++) {
      let val = this.dataArray[i] - 128;
      sum += val * val;
    }
    return Math.sqrt(sum / this.dataArray.length);
  }
}
