// Radial Burst Visualization
import VisualizationBase from './VisualizationBase.js';
import { hslColor } from '../utils/ColorUtils.js';

export default class RadialBurst extends VisualizationBase {
  render(audioData) {
    const { ctx, canvas, config } = this;
    // Persistent radial fade
    ctx.globalAlpha = 0.13;
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 1.0;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    // Make the burst fill more of the screen by increasing the multiplier
    const maxRadius = Math.min(centerX, centerY) * 1.8;
    const bands = 64;
    const step = Math.floor(audioData.length / bands);
    // Animate a trailing effect by storing previous radii
    if (!this.prevRadii) this.prevRadii = new Array(bands).fill(maxRadius * 0.2);
    for (let i = 0; i < bands; i++) {
      const value = (audioData[i * step] - 128) * 2 * (config.sensitivity || 1.0);
      const minRadius = maxRadius * 0.06;
      let radius = Math.max((value / 255) * maxRadius, minRadius);
      // Smooth radius for fluidity
      radius = this.prevRadii[i] = this.prevRadii[i] * 0.7 + radius * 0.3;
      const angle = (i / bands) * 2 * Math.PI;
      const hue = (i / bands) * 240 + (radius * 0.2);
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.arc(0, 0, radius, -Math.PI / bands, Math.PI / bands);
      ctx.strokeStyle = hslColor(hue % 360, 80, 60);
      ctx.lineWidth = 6 + 4 * Math.sin(performance.now() / 600 + i);
      ctx.shadowBlur = 18;
      ctx.shadowColor = ctx.strokeStyle;
      ctx.stroke();
      ctx.restore();
    }
  }
}
