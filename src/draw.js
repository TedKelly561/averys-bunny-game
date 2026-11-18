import { FLOWER_COLORS, ITEMS } from './state.js';

const STROKE_COLOR = '#5a3a1a';
const STROKE_WIDTH = 2.5;

export function drawBunny(ctx, x, y, o) {
  const { facing = 1, pose = 'idle', t = 0, p = 0, color = '#fffaf0' } = o;
  
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(facing, 1);

  // Shadow
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(0, 0, 35, 12, 0, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
  ctx.fill();
  ctx.restore();

  let bodyY = -28;
  let bodyScale = 1;

  if (pose === 'hop') {
    bodyY += Math.sin(p * Math.PI) * 18;
    bodyScale = 1 + Math.sin(p * Math.PI) * 0.1;
  } else if (pose === 'pull') {
    ctx.rotate(-0.25 + Math.sin(t * 30) * 0.02);
  } else if (pose === 'dig') {
    ctx.rotate(0.3);
  } else if (pose === 'idle') {
    bodyScale = 1 + Math.sin(t * 2) * 0.03;
  }

  // Body
  ctx.save();
  ctx.translate(0, bodyY);
  ctx.scale(bodyScale, bodyScale);
  ctx.beginPath();
  ctx.ellipse(0, 0, 26, 24, 0, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.strokeStyle = STROKE_COLOR;
  ctx.lineWidth = STROKE_WIDTH;
  ctx.stroke();

  // Tail
  ctx.beginPath();
  ctx.arc(-26, -24, 9, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.stroke();

  // Feet
  ctx.beginPath();
  ctx.ellipse(-15, -3, 8, 4, 0, 0, Math.PI * 2);
  ctx.ellipse(15, -3, 8, 4, 0, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  // Head
  ctx.save();
  ctx.translate(14, -56);
  if (pose === 'idle' && Math.sin(t * 5) > 0.8) {
    // Ear twitch logic handled by drawing slightly different ear positions
  }
  
  ctx.beginPath();
  ctx.arc(0, 0, 20, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.stroke();

  // Ears
  const drawEar = (ex, ey, rot) => {
    ctx.save();
    ctx.translate(ex, ey);
    ctx.rotate(rot);
    ctx.beginPath();
    ctx.ellipse(0, -12, 7, 22, 0, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.stroke();
    // Inner ear
    ctx.beginPath();
    ctx.ellipse(0, -12, 4, 16, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#ffb6c9';
    ctx.fill();
    ctx.restore();
  };
  drawEar(-10, -34, -0.1);
  drawEar(10, -34, 0.1);

  // Eyes
  const drawEye = (ex, ey) => {
    ctx.beginPath();
    ctx.arc(ex, ey, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#222';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(ex + 1, ey - 1, 1.5, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();
  };
  drawEye(6, -60);
  drawEye(12, -60);

  // Nose & Blush
  ctx.beginPath();
  ctx.arc(19, -53, 3, 0, Math.PI * 2);
  ctx.fillStyle = '#ffb6c9';
  ctx.fill();
  ctx.beginPath();
  ctx.arc(12, -48, 4, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255, 182, 199, 0.4)';
  ctx.fill();

  // Paws
  ctx.beginPath();
  ctx.ellipse(10, -15, 6, 4, 0.5, 0, Math.PI * 2);
  if (pose === 'dig') {
    ctx.translate(Math.sin(t * 25) * 2, 0);
  }
  ctx.fillStyle = color;
  ctx.fill();
  ctx.stroke();

  ctx.restore();

  if (pose === 'eat') {
    ctx.save();
    ctx.translate(36, -48);
    ctx.rotate(Math.sin(t * 10) * 0.1);
    // Small carrot
    ctx.beginPath();
    ctx.moveTo(-3, 0);
    ctx.lineTo(3, 0);
    ctx.lineTo(0, -10);
    ctx.closePath();
    ctx.fillStyle = '#e67e22';
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-4, -10);
    ctx.lineTo(4, -10);
    ctx.lineTo(0, -15);
    ctx.closePath();
    ctx.fillStyle = '#27ae60';
    ctx.fill();
    ctx.restore();
  }

  ctx.restore();
}

export function drawCarrotPlant(ctx, x, y, pulled, t) {
  ctx.save();
  ctx.translate(x, y);
  
  // Leaves
  ctx.fillStyle = '#27ae60';
  ctx.strokeStyle = STROKE_COLOR;
  ctx.lineWidth = 2;
  for (let i = 0; i < 3; i++) {
    ctx.save();
    ctx.rotate((i - 1) * 0.5);
    ctx.beginPath();
    ctx.ellipse(0, -15, 6, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  // Carrot
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(-7, 0);
  ctx.lineTo(7, 0);
  ctx.lineTo(4, -40);
  ctx.lineTo(-4, -40);
  ctx.closePath();
  ctx.fillStyle = '#e67e22';
  ctx.fill();
  ctx.stroke();
  
  // Lift effect
  ctx.translate(0, -pulled * 40);
  ctx.restore();

  // Dirt mound
  ctx.beginPath();
  ctx.ellipse(0, 0, 15, 8, 0, 0, Math.PI * 2);
  ctx.fillStyle = '#6d4c41';
  ctx.fill();
  ctx.restore();
}

export function drawCarrot(ctx, x, y, size, bites) {
  ctx.save();
  ctx.translate(x, y);
  ctx.beginPath();
  ctx.moveTo(-size / 4, 0);
  ctx.lineTo(size / 4, 0);
  ctx.lineTo(size / 3, -size);
  ctx.lineTo(-size / 3, -size);
  ctx.closePath();
  ctx.fillStyle = '#e67e22';
  ctx.fill();
  ctx.strokeStyle = STROKE_COLOR;
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // Bites
  for (let i = 0; i < bites; i++) {
    ctx.beginPath();
    ctx.arc(-size / 4 + (i * 5), -size * 0.7, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#6d4c41';
    ctx.fill();
  }

  // Top
  ctx.beginPath();
  ctx.moveTo(-size / 3, -size);
  ctx.lineTo(size / 3, -size);
  ctx.lineTo(0, -size - 8);
  ctx.closePath();
  ctx.fillStyle = '#27ae60';
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

export function drawFlower(ctx, x, y, color, t, scale = 1) {
  ctx.save();
  ctx.translate(x, y);
  const sway = Math.sin(t * 2 + x * 0.01) * 0.05;
  ctx.rotate(sway);
  ctx.scale(scale, scale);

  // Stem
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, -28);
  ctx.strokeStyle = '#2d5a27';
  ctx.lineWidth = 3;
  ctx.stroke();

  // Leaves
  ctx.fillStyle = '#2d5a27';
  ctx.beginPath();
  ctx.ellipse(-5, -10, 4, 8, -0.5, 0, Math.PI * 2);
  ctx.ellipse(5, -15, 4, 8, 0.5, 0, Math.PI * 2);
  ctx.fill();

  // Petals
  ctx.fillStyle = color;
  ctx.strokeStyle = STROKE_COLOR;
  ctx.lineWidth = 1.5;
  for (let i = 0; i < 5; i++) {
    ctx.save();
    ctx.translate(0, -28);
    ctx.rotate((i * 2 * Math.PI) / 5);
    ctx.beginPath();
    ctx.arc(8, 0, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  // Center
  ctx.beginPath();
  ctx.arc(0, -28, 5, 0, Math.PI * 2);
  ctx.fillStyle = '#ffd700';
  ctx.fill();
  ctx.stroke();

  ctx.restore();
}

export function drawBerryBush(ctx, x, y, hasBerries, t) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = '#1e4d2b';
  ctx.strokeStyle = STROKE_COLOR;
  ctx.lineWidth = 2;

  const circles = [
    [0, -30, 30], [-20, -15, 25], [20, -15, 25], [0, -5, 30]
  ];
  circles.forEach(c => {
    ctx.beginPath();
    ctx.arc(c[0], c[1], c[2], 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  });

  if (hasBerries) {
    ctx.fillStyle = '#c0392b';
    for (let i = 0; i < 6; i++) {
      const ang = (i * Math.PI * 2) / 6;
      ctx.beginPath();
      ctx.arc(Math.cos(ang) * 25, -30 + Math.sin(ang) * 15, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
  }
  ctx.restore();
}

export function drawRock(ctx, x, y, size) {
  ctx.save();
  ctx.translate(x, y);
  ctx.beginPath();
  ctx.moveTo(-size, 0);
  ctx.quadraticCurveTo(-size, -size/2, 0, -size/2);
  ctx.quadraticCurveTo(size, -size/2, size, 0);
  ctx.quadraticCurveTo(size, size/2, 0, size/2);
  ctx.quadraticCurveTo(-size, size/2, -size, 0);
  ctx.closePath();
  ctx.fillStyle = '#7f8c8d';
  ctx.fill();
  ctx.strokeStyle = STROKE_COLOR;
  ctx.lineWidth = 2;
  ctx.stroke();
  
  ctx.beginPath();
  ctx.ellipse(-size/3, -size/4, size/3, size/6, -0.5, 0, Math.PI * 2);
  ctx.fillStyle = '#bdc3c7';
  ctx.fill();
  ctx.restore();
}

export function drawTree(ctx, x, y, t) {
  ctx.save();
  ctx.translate(x, y);
  
  // Trunk
  ctx.fillStyle = '#5d4037';
  ctx.strokeStyle = STROKE_COLOR;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(-15, -90, 30, 90, 5);
  ctx.fill();
  ctx.stroke();

  // Crown
  ctx.fillStyle = '#2e7d32';
  const circles = [
    [0, -130, 50], [-30, -110, 40], [30, -110, 40], 
    [0, -160, 45], [-20, -180, 35], [20, -180, 35]
  ];
  circles.forEach(c => {
    ctx.beginPath();
    ctx.arc(c[0], c[1], c[2], 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  });
  ctx.restore();
}

export function drawGrassTuft(ctx, x, y, t) {
  ctx.save();
  ctx.translate(x, y);
  ctx.strokeStyle = '#4caf50';
  ctx.lineWidth = 2;
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(-10 + i * 5, -10 + Math.sin(t + i) * 2, -5 + i * 10, -15);
    ctx.stroke();
  }
  ctx.restore();
}

export function drawCloud(ctx, x, y, scale) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.fillStyle = '#fff';
  ctx.strokeStyle = '#ddd';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 0, 30, 0, Math.PI * 2);
  ctx.arc(35, 5, 35, 0, Math.PI * 2);
  ctx.arc(70, 0, 30, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

export function drawSparkle(ctx, x, y, t, size = 10) {
  ctx.save();
  ctx.translate(x, y);
  const alpha = 0.5 + 0.5 * Math.sin(t * 5);
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = '#ffd700';
  ctx.lineWidth = 2;
  for (let i = 0; i < 4; i++) {
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(i * Math.PI / 2) * size, Math.sin(i * Math.PI / 2) * size);
    ctx.stroke();
  }
  ctx.restore();
}

export function drawBurrowHole(ctx, x, y) {
  ctx.save();
  ctx.translate(x, y);
  ctx.beginPath();
  ctx.ellipse(0, 0, 45, 25, 0, 0, Math.PI * 2);
  ctx.fillStyle = '#3e2723';
  ctx.fill();
  ctx.strokeStyle = STROKE_COLOR;
  ctx.lineWidth = 2;
  ctx.stroke();
  
  ctx.beginPath();
  ctx.ellipse(10, -10, 30, 15, 0, 0, Math.PI * 2);
  ctx.fillStyle = '#5d4037';
  ctx.fill();
  ctx.restore();
}

export function drawItem(ctx, id, x, y, size) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(size / 64, size / 64);
  ctx.strokeStyle = STROKE_COLOR;
  ctx.lineWidth = 3;

  const item = ITEMS[id];
  if (item.kind === 'flower') {
    const color = FLOWER_COLORS[id];
    ctx.fillStyle = color;
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.arc(Math.cos(i * 2 * Math.PI / 5) * 8, Math.sin(i * 2 * Math.PI / 5) * 8, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.arc(0, 0, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#ffd700';
    ctx.fill();
    ctx.stroke();
  } else {
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.roundRect(-20, -20, 40, 40, 8);
    ctx.fill();
    ctx.stroke();
    
    ctx.fillStyle = '#333';
    switch (id) {
      case 'ribbon':
        ctx.beginPath(); ctx.moveTo(-10, -5); ctx.lineTo(10, -5); ctx.lineTo(0, 5); ctx.fill();
        break;
      case 'lantern':
        ctx.beginPath(); ctx.arc(0, -5, 10, 0, Math.PI * 2); ctx.fill();
        break;
      case 'rug':
        ctx.fillRect(-15, -10, 30, 20);
        break;
      case 'teapot':
        ctx.beginPath(); ctx.arc(0, 0, 12, 0, Math.PI * 2); ctx.fill();
        break;
      case 'painting':
        ctx.fillRect(-15, -15, 30, 30);
        break;
      case 'crown':
        ctx.beginPath(); ctx.moveTo(-15, 0); ctx.lineTo(15, 0); ctx.lineTo(0, -15); ctx.fill();
        break;
      case 'acorn':
        ctx.beginPath(); ctx.arc(0, 0, 10, 0, Math.PI * 2); ctx.fill();
        break;
      case 'feather':
        ctx.beginPath(); ctx.ellipse(0, 0, 5, 15, 0.3, 0, Math.PI * 2); ctx.fill();
        break;
      case 'pebble':
        ctx.beginPath(); ctx.ellipse(0, 0, 12, 8, 0.5, 0, Math.PI * 2); ctx.fill();
        break;
      case 'shell':
        ctx.beginPath(); ctx.arc(0, 0, 12, 0, Math.PI * 2); ctx.stroke();
        break;
      case 'bell':
        ctx.beginPath(); ctx.arc(0, 0, 10, 0, Math.PI * 2); ctx.fill();
        break;
    }
  }
  ctx.restore();
}

export function drawPanel(ctx, x, y, w, h, fill = 'rgba(255,250,235,0.95)') {
  ctx.save();
  ctx.translate(x, y);
  ctx.beginPath();
  ctx.roundRect(0, 0, w, h, 15);
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.strokeStyle = '#5a3a1a';
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.restore();
}

export function drawText(ctx, text, x, y, size = 28, color = '#5a3a1a', align = 'left') {
  ctx.save();
  ctx.translate(x, y);
  if (align === 'center') ctx.textAlign = 'center';
  else ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.font = `bold ${size}px sans-serif`;
  ctx.fillStyle = color;
  ctx.fillText(text, 0, 0);
  ctx.restore();
}

export function drawButtonHint(ctx, button, label, x, y, usingGamepad) {
  ctx.save();
  ctx.translate(x, y);
  const colors = { a: '#4caf50', b: '#f44336', x: '#2196f3', y: '#ffeb3b' };
  const color = colors[button.toLowerCase()] || '#9e9e9e';
  
  ctx.beginPath();
  ctx.arc(0, 0, 15, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.strokeStyle = STROKE_COLOR;
  ctx.lineWidth = 2;
  ctx.stroke();
  
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 14px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(button.toUpperCase(), 0, 0);
  
  ctx.fillStyle = '#5a3a1a';
  ctx.font = '14px sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, 35, 0);
  ctx.restore();
}
