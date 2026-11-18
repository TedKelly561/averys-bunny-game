import { FLOWER_COLORS, BUNNY_COLORS, ITEMS } from './state.js';

export function drawBunny(ctx, x, y, o) {
  ctx.save();
  const facing = o.facing || 1;
  const pose = o.pose || 'idle';
  const t = o.t || 0;
  const p = o.p || 0;
  const color = o.color || BUNNY_COLORS[0];
  
  ctx.translate(x, y);
  ctx.scale(facing, 1);
  
  // Base bunny body
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(0, 0, 35, 40, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Head
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(0, -15, 30, 30, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Ears
  ctx.fillStyle = '#ff99b3'; // pink inner ears
  ctx.beginPath();
  ctx.ellipse(-25, -35, 15, 25, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(25, -35, 15, 25, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Eyes
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.ellipse(-10, -20, 5, 8, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(10, -20, 5, 8, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Eye highlights
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.ellipse(-10, -20, 3, 4, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(10, -20, 3, 4, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Nose
  ctx.fillStyle = '#ff99b3';
  ctx.beginPath();
  ctx.ellipse(0, 5, 5, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Tail
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(0, 35, 20, 20, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Tail tip
  ctx.fillStyle = '#ff99b3';
  ctx.beginPath();
  ctx.ellipse(0, 35, 10, 10, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Pose-specific drawing
  switch (pose) {
    case 'hop':
      ctx.save();
      ctx.translate(0, 0);
      ctx.scale(1, p);
      ctx.beginPath();
      ctx.ellipse(0, 0, 35, 40, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      break;
    case 'pull':
      ctx.save();
      ctx.translate(0, 0);
      ctx.scale(1, p);
      ctx.beginPath();
      ctx.ellipse(0, 0, 35, 40, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      break;
    case 'eat':
      ctx.save();
      ctx.translate(0, 0);
      ctx.scale(1, p);
      ctx.beginPath();
      ctx.ellipse(0, 0, 35, 40, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      // Draw carrot in mouth
      ctx.fillStyle = '#ff6600';
      ctx.beginPath();
      ctx.ellipse(0, 0, 10, 5, 0, 0, Math.PI * 2);
      ctx.fill();
      break;
    case 'dig':
      ctx.save();
      ctx.translate(0, 0);
      ctx.scale(1, p);
      ctx.beginPath();
      ctx.ellipse(0, 0, 35, 40, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      break;
    case 'idle':
    default:
      // Default idle pose
      ctx.save();
      ctx.translate(0, 0);
      ctx.scale(1, p);
      ctx.beginPath();
      ctx.ellipse(0, 0, 35, 40, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      break;
  }
  
  ctx.restore();
}

export function drawCarrotPlant(ctx, x, y, pulled, t) {
  ctx.save();
  ctx.translate(x, y);
  
  // Leafy top
  ctx.fillStyle = '#4a9a3a';
  ctx.beginPath();
  ctx.ellipse(0, 0, 20, 30, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Stem
  ctx.fillStyle = '#4a9a3a';
  ctx.beginPath();
  ctx.moveTo(0, 30);
  ctx.lineTo(0, 60);
  ctx.stroke();
  
  // Root
  ctx.fillStyle = '#4a9a3a';
  ctx.beginPath();
  ctx.ellipse(0, 60, 10, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Carrot (when pulled)
  if (pulled === 1) {
    ctx.fillStyle = '#ff6600';
    ctx.beginPath();
    ctx.ellipse(0, 60, 15, 10, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  
  ctx.restore();
}

export function drawCarrot(ctx, x, y, size, bites) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(size / 30, size / 30);
  
  // Carrot body
  ctx.fillStyle = '#ff6600';
  ctx.beginPath();
  ctx.ellipse(0, 0, 15, 10, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Carrot top
  ctx.fillStyle = '#ff6600';
  ctx.beginPath();
  ctx.ellipse(0, -5, 5, 3, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Carrot root
  ctx.fillStyle = '#ff6600';
  ctx.beginPath();
  ctx.ellipse(0, 10, 5, 2, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Bites
  for (let i = 0; i < bites; i++) {
    ctx.fillStyle = '#ff6600';
    ctx.beginPath();
    ctx.ellipse(0, 5 - i * 2, 3, 1, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  
  ctx.restore();
}

export function drawFlower(ctx, x, y, color, t, scale = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  
  // Stem
  ctx.fillStyle = '#4a9a3a';
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, 40);
  ctx.stroke();
  
  // Leaves
  ctx.fillStyle = '#4a9a3a';
  ctx.beginPath();
  ctx.ellipse(-10, 0, 5, 10, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(10, 0, 5, 10, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Petals
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(0, 40);
  ctx.quadraticCurveTo(-15, 60, -30, 40);
  ctx.quadraticCurveTo(-15, 20, 0, 40);
  ctx.fill();
  
  ctx.beginPath();
  ctx.moveTo(0, 40);
  ctx.quadraticCurveTo(15, 60, 30, 40);
  ctx.quadraticCurveTo(15, 20, 0, 40);
  ctx.fill();
  
  ctx.beginPath();
  ctx.moveTo(0, 40);
  ctx.quadraticCurveTo(-10, 50, -20, 40);
  ctx.quadraticCurveTo(-10, 30, 0, 40);
  ctx.fill();
  
  ctx.beginPath();
  ctx.moveTo(0, 40);
  ctx.quadraticCurveTo(10, 50, 20, 40);
  ctx.quadraticCurveTo(10, 30, 0, 40);
  ctx.fill();
  
  ctx.beginPath();
  ctx.moveTo(0, 40);
  ctx.quadraticCurveTo(-5, 45, -10, 40);
  ctx.quadraticCurveTo(-5, 35, 0, 40);
  ctx.fill();
  
  ctx.beginPath();
  ctx.moveTo(0, 40);
  ctx.quadraticCurveTo(5, 45, 10, 40);
  ctx.quadraticCurveTo(5, 35, 0, 40);
  ctx.fill();
  
  // Center
  ctx.fillStyle = '#ffd23f';
  ctx.beginPath();
  ctx.ellipse(0, 40, 5, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.restore();
}

export function drawBerryBush(ctx, x, y, hasBerries, t) {
  ctx.save();
  ctx.translate(x, y);
  
  // Bush
  ctx.fillStyle = '#4a9a3a';
  ctx.beginPath();
  ctx.ellipse(0, 0, 45, 45, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Berries
  if (hasBerries) {
    ctx.fillStyle = '#ff4a4a';
    ctx.beginPath();
    ctx.ellipse(-20, -20, 5, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(20, -20, 5, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(0, 20, 5, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(-10, 0, 5, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(10, 0, 5, 5, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  
  ctx.restore();
}

export function drawRock(ctx, x, y, size) {
  ctx.save();
  ctx.translate(x, y);
  
  // Rock outline
  ctx.fillStyle = '#888';
  ctx.strokeStyle = '#5a3a1a';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.ellipse(0, 0, size / 2, size / 2, 0, 0, Math.PI * 2);
  ctx.stroke();
  
  // Rock fill
  ctx.fillStyle = '#aaa';
  ctx.beginPath();
  ctx.ellipse(0, 0, size / 2 - 2, size / 2 - 2, 0, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.restore();
}

export function drawTree(ctx, x, y, t) {
  ctx.save();
  ctx.translate(x, y);
  
  // Trunk
  ctx.fillStyle = '#888';
  ctx.beginPath();
  ctx.ellipse(0, 0, 10, 30, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Leaves
  ctx.fillStyle = '#4a9a3a';
  ctx.beginPath();
  ctx.ellipse(0, 0, 30, 30, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Leaf details
  ctx.fillStyle = '#4a9a3a';
  ctx.beginPath();
  ctx.ellipse(-15, 0, 5, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(15, 0, 5, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(0, -15, 5, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(0, 15, 5, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.restore();
}

export function drawGrassTuft(ctx, x, y, t) {
  ctx.save();
  ctx.translate(x, y);
  
  // Grass tuft
  ctx.fillStyle = '#4a9a3a';
  ctx.beginPath();
  ctx.ellipse(0, 0, 10, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Grass blades
  ctx.fillStyle = '#4a9a3a';
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, 5);
  ctx.lineTo(5, 0);
  ctx.lineTo(0, 0);
  ctx.fill();
  
  ctx.restore();
}

export function drawCloud(ctx, x, y, scale) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  
  // Cloud shape
  ctx.fillStyle = '#fff';
  ctx.strokeStyle = '#5a3a1a';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(0, 0, 30, 20, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fill();
  
  // Cloud details
  ctx.beginPath();
  ctx.ellipse(-15, -5, 10, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(15, -5, 10, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(0, 10, 10, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.restore();
}

export function drawSparkle(ctx, x, y, t, size = 10) {
  ctx.save();
  ctx.translate(x, y);
  
  // Sparkle
  ctx.fillStyle = '#fff';
  ctx.strokeStyle = '#5a3a1a';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(0, 0, size, size, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fill();
  
  // Sparkle details
  ctx.beginPath();
  ctx.ellipse(0, 0, size / 2, size / 2, 0, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.restore();
}

export function drawBurrowHole(ctx, x, y) {
  ctx.save();
  ctx.translate(x, y);
  
  // Hole
  ctx.fillStyle = '#000';
  ctx.strokeStyle = '#5a3a1a';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.ellipse(0, 0, 45, 30, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fill();
  
  // Dirt mound
  ctx.fillStyle = '#888';
  ctx.beginPath();
  ctx.ellipse(0, 0, 30, 20, 0, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.restore();
}

export function drawItem(ctx, id, x, y, size) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(size / 30, size / 30);
  
  // Draw based on item type
  switch (id) {
    case 'red':
    case 'yellow':
    case 'blue':
    case 'pink':
    case 'white':
      // Draw flower
      ctx.fillStyle = FLOWER_COLORS[id];
      ctx.beginPath();
      ctx.ellipse(0, 0, 15, 10, 0, 0, Math.PI * 2);
      ctx.fill();
      break;
    case 'ribbon':
      // Draw ribbon
      ctx.fillStyle = '#ff6600';
      ctx.beginPath();
      ctx.moveTo(-10, 0);
      ctx.lineTo(10, 0);
      ctx.lineTo(0, 10);
      ctx.lineTo(-10, 0);
      ctx.fill();
      break;
    case 'lantern':
      // Draw lantern
      ctx.fillStyle = '#ffd23f';
      ctx.beginPath();
      ctx.ellipse(0, 0, 10, 10, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(0, 0, 5, 5, 0, 0, Math.PI * 2);
      ctx.fill();
      break;
    case 'rug':
      // Draw rug
      ctx.fillStyle = '#888';
      ctx.beginPath();
      ctx.ellipse(0, 0, 15, 10, 0, 0, Math.PI * 2);
      ctx.fill();
      break;
    case 'teapot':
      // Draw teapot
      ctx.fillStyle = '#888';
      ctx.beginPath();
      ctx.ellipse(0, 0, 10, 10, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(0, 0, 5, 5, 0, 0, Math.PI * 2);
      ctx.fill();
      break;
    case 'painting':
      // Draw painting
      ctx.fillStyle = '#4a9a3a';
      ctx.beginPath();
      ctx.ellipse(0, 0, 15, 10, 0, 0, Math.PI * 2);
      ctx.fill();
      break;
    case 'crown':
      // Draw crown
      ctx.fillStyle = '#ff6600';
      ctx.beginPath();
      ctx.ellipse(0, 0, 10, 5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(0, 0, 5, 5, 0, 0, Math.PI * 2);
      ctx.fill();
      break;
    case 'acorn':
      // Draw acorn
      ctx.fillStyle = '#888';
      ctx.beginPath();
      ctx.ellipse(0, 0, 10, 5, 0, 0, Math.PI * 2);
      ctx.fill();
      break;
    case 'feather':
      // Draw feather
      ctx.fillStyle = '#4a9a3a';
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, 10);
      ctx.lineTo(5, 5);
      ctx.lineTo(0, 0);
      ctx.fill();
      break;
    case 'pebble':
      // Draw pebble
      ctx.fillStyle = '#888';
      ctx.beginPath();
      ctx.ellipse(0, 0, 10, 5, 0, 0, Math.PI * 2);
      ctx.fill();
      break;
    case 'shell':
      // Draw shell
      ctx.fillStyle = '#888';
      ctx.beginPath();
      ctx.ellipse(0, 0, 10, 5, 0, 0, Math.PI * 2);
      ctx.fill();
      break;
    case 'bell':
      // Draw bell
      ctx.fillStyle = '#888';
      ctx.beginPath();
      ctx.ellipse(0, 0, 10, 5, 0, 0, Math.PI * 2);
      ctx.fill();
      break;
    default:
      // Default item
      ctx.fillStyle = '#888';
      ctx.beginPath();
      ctx.ellipse(0, 0, 10, 5, 0, 0, Math.PI * 2);
      ctx.fill();
      break;
  }
  
  ctx.restore();
}

export function drawPanel(ctx, x, y, w, h, fill = 'rgba(255,250,235,0.95)') {
  ctx.save();
  ctx.translate(x, y);
  
  // Panel
  ctx.fillStyle = fill;
  ctx.strokeStyle = '#5a3a1a';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(0, 0, w, h);
  ctx.fill();
  ctx.stroke();
  
  ctx.restore();
}

export function drawText(ctx, text, x, y, size = 28, color = '#5a3a1a', align = 'left') {
  ctx.save();
  ctx.translate(x, y);
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';
  ctx.font = `${size}px Arial, sans-serif`;
  ctx.fillStyle = color;
  ctx.fillText(text, 0, 0);
  
  ctx.restore();
}

export function drawButtonHint(ctx, button, label, x, y, usingGamepad) {
  ctx.save();
  ctx.translate(x, y);
  
  // Button circle
  ctx.fillStyle = '#5a3a1a';
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 0, 20, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fill();
  
  // Button letter
  ctx.fillStyle = '#fff';
  ctx.font = '20px Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(button, 0, 0);
  
  // Label
  ctx.fillStyle = '#5a3a1a';
  ctx.font = '16px Arial, sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, 25, 0);
  
  ctx.restore();
}
