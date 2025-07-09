// Waveform Visualization
import VisualizationBase from './VisualizationBase.js';
import { hslColor } from '../utils/ColorUtils.js';

export default class Waveform extends VisualizationBase {
  render(audioData) {
    const { ctx, canvas, config } = this;
    // Persistent fade for waveform
    ctx.globalAlpha = 0.18;
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 1.0;
    ctx.save();
    ctx.translate(0, canvas.height / 2);
    ctx.beginPath();
    for (let i = 0; i < audioData.length; i++) {
      const x = (i / audioData.length) * canvas.width;
      // Always show a minimum amplitude
      const minAmp = canvas.height * 0.03;
      let y = (audioData[i] - 128) * (canvas.height / 256) * (config.sensitivity || 1.0);
      if (Math.abs(y) < minAmp) y = y < 0 ? -minAmp : minAmp;
      // Multicolour: hue based on position and audio
      const hue = (i / audioData.length) * 360 + (audioData[i] - 128) * 1.5;
      ctx.strokeStyle = hslColor(hue % 360, 80, 60);
      if (i === 0) ctx.moveTo(x, y);
      else {
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
      }
    }
    ctx.restore();
  }
}
