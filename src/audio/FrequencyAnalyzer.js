// FrequencyAnalyzer: Utility for splitting frequency data into bands
export default class FrequencyAnalyzer {
  constructor(analyser) {
    this.analyser = analyser;
    this.dataArray = new Uint8Array(analyser.frequencyBinCount);
  }

  getBands() {
    this.analyser.getByteFrequencyData(this.dataArray);
    // Example: split into bass, mid, treble
    const bass = this.average(0, 10);
    const mid = this.average(10, 100);
    const treble = this.average(100, 200);
    return { bass, mid, treble };
  }

  average(start, end) {
    let sum = 0;
    for (let i = start; i < end; i++) {
      sum += this.dataArray[i];
    }
    return sum / (end - start);
  }
}
