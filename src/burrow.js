import { state, save, BUNNY_COLORS } from './state.js';
import * as draw from './draw.js';

let dug = new Set();
let diggers = [
  { col: 0, row: 0, px: 0, py: 0, moveT: 0, facing: 1, digging: false },
  { col: 0, row: 0, px: 0, py: 0, moveT: 0, facing: 1, digging: false }
];
let particles = [];
let asking = false;
let askedAt = 0;
let building = 0;

export const scene = {
  enter(game) {
    dug.clear();
    // Digger 0 at col 15, row 3; Digger 1 at col 17, row 3
    diggers[0] = { col: 15, row: 3, px: 15 * 40 + 20, py: 3 * 40 + 20, moveT: 0, facing: 1, digging: false };
    diggers[1] = { col: 17, row: 3, px: 17 * 40 + 20, py: 3 * 40 + 20, moveT: 0, facing: 1, digging: false };
    asking = false;
    askedAt = 0;
    building = 0;
  },

  update(dt, game) {
    if (building > 0) {
      building -= dt;
      if (building <= 0) {
        state.homeBuilt = true;
        state.burrow = state.digSite;
        save();
        game.switchTo('house');
        return;
      }
    }

    if (asking) {
      let anyA = false;
      let anyB = false;
      for (let i = 0; i < game.numPlayers; i++) {
        if (game.inputs[i].pressed('a')) anyA = true;
        if (game.inputs[i].pressed('b')) anyB = true;
      }
      if (anyA) {
        building = 2.5;
        asking = false;
      } else if (anyB) {
        asking = false;
        askedAt = dug.size;
      }
      return;
    }

    for (let i = 0; i < game.numPlayers; i++) {
      const inp = game.inputs[i];
      const d = diggers[i];

      if (d.moveT > 0) {
        d.moveT -= dt;
        continue;
      }

      let dc = 0;
      let dr = 0;
      if (Math.abs(inp.x) >= Math.abs(inp.y) && Math.abs(inp.x) > 0.5) {
        dc = inp.x > 0 ? 1 : -1;
        dr = 0;
      } else if (Math.abs(inp.y) > 0.5) {
        dc = 0;
        dr = inp.y > 0 ? 1 : -1;
      }

      const targetCol = Math.max(0, Math.min(31, d.col + dc));
      const targetRow = Math.max(3, Math.min(17, d.row + dr));

      if (targetCol !== d.col || targetRow !== d.row) {
        const key = `${targetCol},${targetRow}`;
        if (targetRow >= 4 && !dug.has(key)) {
          dug.add(key);
          d.moveT = 0.3;
          d.digging = true;
          for (let j = 0; j < 8; j++) {
            particles.push({
              x: d.px,
              y: d.py,
              vx: (Math.random() - 0.5) * 40,
              vy: (Math.random() - 0.5) * 40,
              life: 1.0
            });
          }
        } else {
          d.moveT = 0.15;
          d.digging = false;
        }
        d.col = targetCol;
        d.row = targetRow;
        d.facing = dc >= 0 ? 1 : -1;
      }

      // Smooth slide
      const targetX = d.col * 40 + 20;
      const targetY = d.row * 40 + 20;
      d.px += (targetX - d.px) * 0.2;
      d.py += (targetY - d.py) * 0.2;
    }

    // Check for back to meadow
    for (let i = 0; i < game.numPlayers; i++) {
      if (game.inputs[i].pressed('b') && diggers[i].row === 3) {
        game.switchTo('meadow');
        return;
      }
    }

    // Update particles
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.5; // gravity
      p.life -= 0.02;
      if (p.life <= 0) particles.splice(i, 1);
    }

    // Check for asking condition
    if (!asking && dug.size >= 14) {
      let anyDeep = false;
      for (let i = 0; i < game.numPlayers; i++) {
        if (diggers[i].row >= 9) anyDeep = true;
      }
      if (anyDeep && dug.size >= askedAt + 6) {
        asking = true;
      }
    }
  },

  draw(ctx, game) {
    const { W, H } = game;

    // Sky
    const skyGrad = ctx.createLinearGradient(0, 0, 0, 160);
    skyGrad.addColorStop(0, '#87CEEB');
    skyGrad.addColorStop(1, '#E0F6FF');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, W, 160);

    // Sun
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(100, 60, 40, 0, Math.PI * 2);
    ctx.fill();

    // Clouds
    draw.drawCloud(ctx, 200, 50, 1.2);
    draw.drawCloud(ctx, 800, 80, 1.0);

    // Dirt
    ctx.fillStyle = '#8b5a2b';
    ctx.fillRect(0, 160, W, H - 160);
    ctx.fillStyle = '#6d4320';
    ctx.fillRect(0, H - 40, W, 40);

    // Grass strip
    ctx.fillStyle = '#4a7c2c';
    ctx.fillRect(0, 155, W, 10);

    // Dug cells
    ctx.fillStyle = '#4a2f17';
    for (const cell of dug) {
      const [col, row] = cell.split(',').map(Number);
      const x = col * 40;
      const y = row * 40;
      ctx.beginPath();
      ctx.roundRect(x - 2, y - 2, 44, 44, 4);
      ctx.fill();
    }

    // Flowers on surface
    draw.drawFlower(ctx, 100, 155, '#e8404f', game.time);
    draw.drawFlower(ctx, 400, 155, '#ffd23f', game.time);
    draw.drawFlower(ctx, 700, 155, '#4f8ef7', game.time);
    draw.drawFlower(ctx, 1100, 155, '#ff8fc7', game.time);

    // Particles
    particles.forEach(p => {
      ctx.fillStyle = `rgba(139, 90, 43, ${p.life})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
      ctx.fill();
    });

    // Bunnies
    for (let i = 0; i < game.numPlayers; i++) {
      const d = diggers[i];
      const pose = (d.digging || d.moveT > 0) ? 'dig' : 'idle';
      draw.drawBunny(ctx, d.px, d.py, {
        facing: d.facing,
        pose,
        t: game.time,
        p: 0,
        color: BUNNY_COLORS[i]
      });
    }

    // UI Panels
    if (asking) {
      ctx.fillStyle = 'rgba(0,0,0,0.4)';
      ctx.fillRect(0, 0, W, H);
      draw.drawPanel(ctx, W / 2 - 200, H / 2 - 100, 400, 200);
      draw.drawText(ctx, "Would you like this to be where your house is?", W / 2, H / 2 - 40, 32, 'center');
      draw.drawButtonHint(ctx, 'a', 'Yes, build my home!', W / 2 - 120, H / 2 + 40, game.numPlayers > 1 ? false : false); // Simplified for logic
      draw.drawButtonHint(ctx, 'b', 'Keep digging', W / 2 + 120, H / 2 + 40, game.numPlayers > 1 ? false : false);
    } else if (building) {
      draw.drawPanel(ctx, W / 2 - 200, H / 2 - 100, 400, 200);
      draw.drawText(ctx, "Building your cozy home...", W / 2, H / 2, 32, 'center');
      draw.drawSparkle(ctx, W / 2, H / 2 + 50, game.time, 15);
    } else {
      draw.drawPanel(ctx, 20, 20, 400, 60);
      draw.drawText(ctx, "Dig, dig, dig! Move to dig tunnels.", 220, 50, 24);
      draw.drawText(ctx, "B: back to the meadow (from the top)", 220, 80, 18, 'left');
    }
  }
};
