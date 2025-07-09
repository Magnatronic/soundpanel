// Fluid Simulation Visualization (simple metaball effect)
import VisualizationBase from './VisualizationBase.js';
import { hslColor } from '../utils/ColorUtils.js';

export default class FluidSimulation extends VisualizationBase {
  constructor(canvas, audioData, config) {
    super(canvas, audioData, config);
    this.balls = Array.from({ length: 8 }, (_, i) => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: 40 + Math.random() * 40,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2
    }));
  }
  render(audioData) {
    const { ctx, canvas, config } = this;
    // Persistent fade for fluid effect
    ctx.globalAlpha = 0.13;
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 1.0;
    // Animate balls with more fluid motion and more balls
    if (!this.balls || this.balls.length < 18) {
      this.balls = Array.from({ length: 18 }, (_, i) => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: 40 + Math.random() * 40,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2
      }));
    }
    for (let i = 0; i < this.balls.length; i++) {
      const b = this.balls[i];
      b.x += b.vx * 1.2;
      b.y += b.vy * 1.2;
      b.vx += (Math.random() - 0.5) * 0.1;
      b.vy += (Math.random() - 0.5) * 0.1;
      b.vx *= 0.98;
      b.vy *= 0.98;
      if (b.x < b.r || b.x > canvas.width - b.r) b.vx *= -1;
      if (b.y < b.r || b.y > canvas.height - b.r) b.vy *= -1;
      // Modulate radius with audio, always show a minimum
      const idx = Math.floor((i / this.balls.length) * audioData.length);
      const minR = 30;
      b.r = Math.max(minR, 40 + ((audioData[idx] - 128) * 2.5 * (config.sensitivity || 1.0)));
    }
    // Draw metaballs (simple alpha blending)
    for (let i = 0; i < this.balls.length; i++) {
      const b = this.balls[i];
      ctx.save();
      ctx.globalAlpha = 0.45;
      ctx.beginPath();
      ctx.arc(b.x, b.y, Math.abs(b.r), 0, 2 * Math.PI);
      ctx.fillStyle = hslColor(200 + i * 20 + b.r * 2, 80, 60);
      ctx.shadowBlur = 30;
      ctx.shadowColor = ctx.fillStyle;
      ctx.fill();
      ctx.restore();
    }
  }
}
