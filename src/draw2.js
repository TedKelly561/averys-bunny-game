import { ITEMS, FLOWER_COLORS } from './state.js';

export function drawItem(ctx, id, x, y, size) {
  ctx.save();
  ctx.translate(x, y);
  const s = size / 100;
  ctx.scale(s, s);

  switch (id) {
    case 'red':
    case 'yellow':
    case 'blue':
    case 'pink':
    case 'white': {
      const color = FLOWER_COLORS[id];
      ctx.fillStyle = color;
      for (let i = 0; i < 5; i++) {
        const angle = (i * 72) * (Math.PI / 180);
        const px = Math.cos(angle) * 22;
        const py = Math.sin(angle) * 22;
        ctx.beginPath();
        ctx.arc(px, py, 18, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = '#ffd23f';
      ctx.beginPath();
      ctx.arc(0, 0, 14, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 'ribbon': {
      ctx.fillStyle = '#ff8fc7';
      // Bow
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(-20, -15);
      ctx.lineTo(-20, 15);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(20, -15);
      ctx.lineTo(20, 15);
      ctx.closePath();
      ctx.fill();
      // Center
      ctx.beginPath();
      ctx.arc(0, 0, 5, 0, Math.PI * 2);
      ctx.fill();
      // Tails
      ctx.beginPath();
      ctx.moveTo(-5, 5);
      ctx.lineTo(-15, 25);
      ctx.lineTo(-5, 25);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(5, 5);
      ctx.lineTo(15, 25);
      ctx.lineTo(5, 25);
      ctx.closePath();
      ctx.fill();
      break;
    }
    case 'lantern': {
      ctx.fillStyle = '#fff3a0';
      ctx.beginPath();
      ctx.roundRect(-15, -20, 30, 40, 8);
      ctx.fill();
      ctx.strokeStyle = '#5a3a1a';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = '#8b5a2b';
      ctx.beginPath();
      ctx.roundRect(-18, -25, 36, 8, 4);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, -22, 4, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = '#ffd23f';
      ctx.beginPath();
      ctx.arc(-5, -5, 3, 0, Math.PI * 2);
      ctx.arc(5, 5, 3, 0, Math.PI * 2);
      ctx.arc(0, 10, 3, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 'rug': {
      ctx.fillStyle = '#e8404f';
      ctx.beginPath();
      ctx.ellipse(0, 0, 45, 28, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#fffaf0';
      ctx.lineWidth = 4;
      for (let i = -1; i <= 1; i++) {
        ctx.beginPath();
        ctx.moveTo(-30, i * 10);
        ctx.lineTo(30, i * 10);
        ctx.stroke();
      }
      break;
    }
    case 'teapot': {
      ctx.fillStyle = '#9fd3f0';
      ctx.beginPath();
      ctx.arc(0, 0, 20, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(18, -5);
      ctx.lineTo(30, -15);
      ctx.lineTo(30, 5);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.arc(-15, -5, 10, 0, Math.PI * 2);
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#9fd3f0';
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, -20, 12, Math.PI, 0);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, -20, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#9fd3f0';
      ctx.fill();
      break;
    }
    case 'painting': {
      ctx.fillStyle = '#8b5a2b';
      ctx.fillRect(-25, -25, 50, 50);
      ctx.fillStyle = '#87ceeb';
      ctx.fillRect(-20, -20, 40, 20);
      ctx.fillStyle = '#228b22';
      ctx.fillRect(-20, 0, 40, 20);
      ctx.fillStyle = '#ffd23f';
      ctx.beginPath();
      ctx.arc(15, -10, 8, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 'crown': {
      ctx.strokeStyle = '#5a3a1a';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, 30, 0, Math.PI * 2);
      ctx.stroke();
      for (let i = 0; i < 6; i++) {
        const angle = (i * 60) * (Math.PI / 180);
        const px = Math.cos(angle) * 30;
        const py = Math.sin(angle) * 30;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(px, py, 9, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffd23f';
        ctx.beginPath();
        ctx.arc(px, py, 4, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }
    case 'acorn': {
      ctx.fillStyle = '#f0b429';
      ctx.beginPath();
      ctx.ellipse(0, 0, 15, 22, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#8b5a2b';
      ctx.beginPath();
      ctx.arc(0, -15, 18, Math.PI, 0);
      ctx.fill();
      ctx.strokeStyle = '#5a3a1a';
      ctx.beginPath();
      ctx.moveTo(0, -20);
      ctx.lineTo(0, -30);
      ctx.stroke();
      break;
    }
    case 'feather': {
      ctx.fillStyle = '#4f8ef7';
      ctx.beginPath();
      ctx.ellipse(-10, 0, 25, 12, -Math.PI / 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-15, 5);
      ctx.lineTo(-5, -5);
      ctx.stroke();
      break;
    }
    case 'pebble': {
      ctx.fillStyle = '#9db4c8';
      ctx.beginPath();
      ctx.ellipse(0, 0, 25, 18, 0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(-5, -5, 10, 5, 0.2, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 'shell': {
      ctx.fillStyle = '#e8c79a';
      ctx.beginPath();
      ctx.arc(0, 0, 25, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#8b5a2b';
      ctx.lineWidth = 3;
      ctx.beginPath();
      for (let r = 0; r < 25; r += 2) {
        const angle = (r * 0.5);
        ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
      }
      ctx.stroke();
      break;
    }
    case 'bell': {
      ctx.fillStyle = '#f6c945';
      ctx.beginPath();
      ctx.arc(0, -10, 20, Math.PI, 0);
      ctx.lineTo(20, 10);
      ctx.lineTo(-20, 10);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.arc(0, 15, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(0, -25, 4, 0, Math.PI * 2);
      ctx.stroke();
      break;
    }
    default: {
      ctx.fillStyle = '#808080';
      ctx.beginPath();
      ctx.arc(0, 0, 20, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
  }
  ctx.restore();
}

export function drawCarrotPlant(ctx, x, y, pulled, t) {
  ctx.save();

  // Dirt mound
  ctx.fillStyle = '#8b5a2b';
  ctx.beginPath();
  ctx.ellipse(x, y + 2, 22, 6, 0, 0, Math.PI * 2);
  ctx.fill();

  // Carrot root
  ctx.save();
  ctx.beginPath();
  ctx.rect(x - 40, y - 200, 80, 200);
  ctx.clip();
  ctx.fillStyle = '#ff8a1f';
  ctx.beginPath();
  ctx.moveTo(x - 16, y - pulled * 46);
  ctx.lineTo(x + 16, y - pulled * 46);
  ctx.lineTo(x, y - pulled * 46 + 44);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#d35400';
  ctx.lineWidth = 2;
  for (let i = 1; i <= 3; i++) {
    ctx.beginPath();
    ctx.moveTo(x - 10, y - pulled * 46 + (i * 12));
    ctx.lineTo(x + 10, y - pulled * 46 + (i * 12));
    ctx.stroke();
  }
  ctx.restore();

  // Leaves
  ctx.save();
  ctx.translate(x, y - pulled * 46);
  ctx.fillStyle = '#3fae49';
  for (let i = 0; i < 3; i++) {
    ctx.save();
    ctx.rotate((i - 1) * 0.6 + Math.sin(t * 2 + x) * 0.1);
    ctx.beginPath();
    ctx.ellipse(0, -13, 6, 26, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  ctx.restore();

  ctx.restore();
}
