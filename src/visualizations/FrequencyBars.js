// Frequency Bars Visualization
import VisualizationBase from './VisualizationBase.js';
import { hslColor } from '../utils/ColorUtils.js';

export default class FrequencyBars extends VisualizationBase {
  render(audioData) {
    const { ctx, canvas, config } = this;
    // Fade effect for persistent bars
    ctx.globalAlpha = 0.18;
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 1.0;
    // Make bars blockier by grouping frequency bins and increasing bar width
    const groupSize = 6; // Number of frequency bins per bar (higher = blockier)
    const numBars = Math.floor(audioData.length / groupSize);
    const barWidth = Math.max(8, Math.floor(canvas.width / numBars));
    const sensitivity = config.sensitivity || 1.0;
    for (let i = 0; i < numBars; i++) {
      // Average the group of frequency bins for each bar
      let sum = 0;
      for (let j = 0; j < groupSize; j++) {
        sum += audioData[i * groupSize + j];
      }
      let value = (sum / groupSize - 128) * 2 * sensitivity;
      value = Math.max(0, value);
      // Always show a minimum bar height
      const minHeight = canvas.height * 0.04;
      const percent = value / 255;
      const height = Math.max(percent * canvas.height, minHeight);
      const hue = (i / numBars) * 240;
      ctx.save();
      ctx.globalAlpha = 0.7 + 0.3 * Math.sin(performance.now() / 400 + i);
      ctx.fillStyle = hslColor(hue, 80, 50);
      ctx.fillRect(i * barWidth, canvas.height - height, barWidth - 2, height);
      ctx.restore();
    }
  }
}
