// Base class for all visualizations
export default class VisualizationBase {
  constructor(canvas, audioData, config) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.audioData = audioData;
    this.config = config;
  }
  render() {
    // To be implemented by subclasses
  }
  resize() {
    // Optional: handle canvas resize
  }
}
