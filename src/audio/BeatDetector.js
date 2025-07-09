// BeatDetector: Simple beat detection based on volume threshold
export default class BeatDetector {
  constructor(threshold = 30) {
    this.threshold = threshold;
    this.lastVolume = 0;
    this.lastBeat = 0;
    this.cooldown = 200; // ms
  }

  detect(volume, now = performance.now()) {
    if (volume > this.threshold && now - this.lastBeat > this.cooldown) {
      this.lastBeat = now;
      return true;
    }
    this.lastVolume = volume;
    return false;
  }
}
