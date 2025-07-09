// Particle System Visualization
import VisualizationBase from './VisualizationBase.js';
import { hslColor } from '../utils/ColorUtils.js';

class Particle {
  constructor(x, y, vx, vy, color, size) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.color = color;
    this.life = 1.0;
    this.size = size;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vx *= 0.99; // friction
    this.vy *= 0.99;
    this.life -= 0.008;
  }
}

export default class ParticleSystem extends VisualizationBase {
  constructor(canvas, audioData, config) {
    super(canvas, audioData, config);
    this.particles = [];
  }
  render(audioData) {
    const { ctx, canvas, config } = this;
    // Fade the canvas instead of clearing it completely
    ctx.save();
    ctx.globalAlpha = 0.18;
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();

    // Calculate average volume
    const avg = audioData.reduce((a, b) => a + Math.abs(b - 128), 0) / audioData.length;
    // Scale maxParticles and spawnCount with canvas area
    const area = canvas.width * canvas.height;
    const baseParticles = 1200;
    const maxParticles = Math.floor(baseParticles * (area / (1280 * 720)));
    const spawnCount = Math.floor((10 + avg * (config.sensitivity || 1.0) * 0.2) * (area / (1280 * 720)));
    // Spawn from a disk around the center, with radius scaling to canvas size
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const spawnRadius = Math.min(canvas.width, canvas.height) * 0.18;
    for (let i = 0; i < spawnCount; i++) {
      const angle = Math.random() * 2 * Math.PI;
      const r = Math.random() * spawnRadius;
      const x = centerX + Math.cos(angle) * r;
      const y = centerY + Math.sin(angle) * r;
      // Speed and direction
      const speed = (1 + Math.random() * 1.5 + avg * 0.02) * (Math.min(canvas.width, canvas.height) / 720);
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;
    // Color and size modulated by frequency and theme
    const freqIdx = Math.floor(Math.random() * audioData.length);
    const freqVal = audioData[freqIdx];
    let color;
    if (config.theme === 'light') {
      color = hslColor((freqVal * 2 + avg * 2) % 360, 70, 45);
    } else {
      color = hslColor((freqVal * 2 + avg * 2) % 360, 90, 60);
    }
    const size = 0.7 + (freqVal - 128) * 0.02 * (Math.min(canvas.width, canvas.height) / 720);
    this.particles.push(new Particle(x, y, vx, vy, color, size));
    }
    // Update and draw particles
    this.particles = this.particles.filter(p => p.life > 0);
    // Limit total particles for performance
    if (this.particles.length > maxParticles) {
      this.particles.splice(0, this.particles.length - maxParticles);
    }
    for (const p of this.particles) {
      p.update();
      ctx.save();
      ctx.globalAlpha = p.life * 0.8 + 0.2;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(1, p.size), 0, 2 * Math.PI);
      ctx.fill();
      ctx.restore();
    }
  }
}
