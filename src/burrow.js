import { state, save, BUNNY_COLORS } from './state.js';
import { drawBunny, drawCarrotPlant, drawFlower, drawRock, drawTree, drawGrassTuft, drawCloud, drawSparkle, drawBurrowHole, drawItem, drawPanel, drawText, drawButtonHint } from './draw.js';

export const scene = {
  enter(game) {
    state.dug = new Set();
    state.diggers = [
      { col: 15, row: 3, px: 15 * 40 + 20, py: 3 * 40 + 20, moveT: 0, facing: 1, digging: false },
      { col: 17, row: 3, px: 17 * 40 + 20, py: 3 * 40 + 20, moveT: 0, facing: 1, digging: false }
    ];
    state.particles = [];
    state.asking = false;
    state.askedAt = 0;
    state.building = 0;
  },

  update(dt, game) {
    // Building phase
    if (state.building > 0) {
      state.building -= dt;
      if (state.building <= 0) {
        state.homeBuilt = true;
        state.burrow = state.digSite;
        save();
        game.switchTo('house');
        return;
      }
    }

    // Asking phase
    if (state.asking) {
      const inputs = game.inputs;
      let anyPressedA = false;
      let anyPressedB = false;
      for (let i = 0; i < game.numPlayers; i++) {
        if (inputs[i].pressed('a')) anyPressedA = true;
        if (inputs[i].pressed('b')) anyPressedB = true;
      }
      if (anyPressedA) {
        state.building = 2.5;
        state.asking = false;
      } else if (anyPressedB) {
        state.asking = false;
        state.askedAt = state.dug.size;
      }
      return;
    }

    // Update diggers
    const diggers = state.diggers;
    const inputs = game.inputs;
    for (let i = 0; i < game.numPlayers; i++) {
      const digger = diggers[i];
      const inp = inputs[i];

      // Smooth movement toward cell center
      const targetX = digger.col * 40 + 20;
      const targetY = digger.row * 40 + 20;
      const dx = targetX - digger.px;
      const dy = targetY - digger.py;
      const speed = 3;
      digger.px += dx * speed * dt;
      digger.py += dy * speed * dt;

      // Handle movement input
      if (digger.moveT > 0) {
        digger.moveT -= dt;
      } else {
        // Determine direction from input
        let targetCol = digger.col;
        let targetRow = digger.row;
        let direction = 0;
        if (Math.abs(inp.x) > 0.5) {
          direction = inp.x > 0 ? 1 : -1;
        } else if (Math.abs(inp.y) > 0.5) {
          direction = inp.y > 0 ? 1 : -1;
        }

        // Calculate target cell
        if (direction !== 0) {
          if (direction > 0) {
            targetCol = Math.min(digger.col + 1, 31);
          } else {
            targetCol = Math.max(digger.col - 1, 0);
          }
          targetRow = digger.row;
          // Check if target is within bounds
          if (targetRow >= 0 && targetRow <= 17 && targetCol >= 0 && targetCol <= 31) {
            // Check if target is dug or not
            const key = `${targetCol},${targetRow}`;
            if (targetRow === 3) {
              // Surface is always open
              digger.col = targetCol;
              digger.row = targetRow;
              digger.facing = direction;
              digger.moveT = 0;
              digger.digging = false;
            } else if (targetRow >= 4) {
              if (state.dug.has(key)) {
                // Already dug, just move
                digger.col = targetCol;
                digger.row = targetRow;
                digger.facing = direction;
                digger.moveT = 0.15;
                digger.digging = false;
              } else {
                // New dig
                state.dug.add(key);
                digger.col = targetCol;
                digger.row = targetRow;
                digger.facing = direction;
                digger.moveT = 0.3;
                digger.digging = true;
                // Spawn particles
                for (let p = 0; p < 8; p++) {
                  state.particles.push({
                    x: targetX + (Math.random() - 0.5) * 10,
                    y: targetY + (Math.random() - 0.5) * 10,
                    vx: (Math.random() - 0.5) * 2,
                    vy: (Math.random() - 0.5) * 2,
                    life: 1
                  });
                }
              }
            }
          }
        }
      }
    }

    // Update particles
    const particles = state.particles;
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.vx += (Math.random() - 0.5) * 0.1;
      p.vy += 0.05;
      p.life -= dt;
      if (p.life <= 0) {
        particles.splice(i, 1);
      } else {
        p.x += p.vx;
        p.y += p.vy;
      }
    }

    // Check if asking condition is met
    if (!state.asking && state.dug.size >= 14) {
      for (let i = 0; i < game.numPlayers; i++) {
        const digger = state.diggers[i];
        if (digger.row >= 9 && state.dug.size >= state.askedAt + 6) {
          state.asking = true;
          state.askedAt = state.dug.size;
          break;
        }
      }
    }

    // Handle back button
    for (let i = 0; i < game.numPlayers; i++) {
      if (inputs[i].pressed('b') && state.diggers[i].row === 3) {
        game.switchTo('meadow');
        return;
      }
    }
  },

  draw(ctx, game) {
    const W = 1280;
    const H = 720;

    // Clear canvas
    ctx.clearRect(0, 0, W, H);

    // Draw sky gradient
    ctx.save();
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(0, 0, W, 160);
    ctx.restore();

    // Draw sun
    ctx.save();
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(W / 2, 80, 30, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Draw clouds
    drawCloud(ctx, 200, 50, 1.5);
    drawCloud(ctx, 800, 70, 1.2);

    // Draw dirt
    ctx.save();
    ctx.fillStyle = '#8b5a2b';
    ctx.fillRect(0, 160, W, H - 160);
    ctx.restore();

    // Draw grass strip
    ctx.save();
    ctx.fillStyle = '#4b862a';
    ctx.fillRect(0, 160, W, 10);
    ctx.restore();

    // Draw dug cells
    ctx.save();
    ctx.fillStyle = '#4a2f17';
    ctx.strokeStyle = '#4a2f17';
    ctx.lineWidth = 2;
    for (let col = 0; col < 32; col++) {
      for (let row = 4; row < 18; row++) {
        const key = `${col},${row}`;
        if (state.dug.has(key)) {
          const x = col * 40 + 10;
          const y = row * 40 + 10;
          const w = 20;
          const h = 20;
          ctx.beginPath();
          ctx.roundRect(x, y, w, h);
          ctx.fill();
          ctx.stroke();
        }
      }
    }
    ctx.restore();

    // Draw flowers
    const flowerPositions = [
      { x: 100, y: 160 },
      { x: 200, y: 160 },
      { x: 300, y: 160 },
      { x: 400, y: 160 },
      { x: 500, y: 160 },
      { x: 600, y: 160 },
      { x: 700, y: 160 },
      { x: 800, y: 160 },
      { x: 900, y: 160 },
      { x: 1000, y: 160 },
      { x: 1100, y: 160 },
      { x: 1200, y: 160 }
    ];
    for (let i = 0; i < flowerPositions.length; i++) {
      const pos = flowerPositions[i];
      const color = FLOWER_COLORS.red;
      drawFlower(ctx, pos.x, pos.y, color, 0, 0.8);
    }

    // Draw particles
    for (let p of state.particles) {
      ctx.save();
      ctx.fillStyle = '#8b5a2b';
      ctx.beginPath();
      ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Draw bunnies
    const diggers = state.diggers;
    for (let i = 0; i < game.numPlayers; i++) {
      const digger = diggers[i];
      const color = BUNNY_COLORS[i];
      const pose = digger.digging && digger.moveT > 0 ? 'dig' : 'idle';
      drawBunny(ctx, digger.px, digger.py + 20, {
        facing: digger.facing,
        pose,
        t: 0,
        p: 0,
        color
      });
    }

    // Draw top panel
    drawPanel(ctx, 0, 0, W, 60, 'rgba(255,230,180,0.9)');
    drawText(ctx, 'Dig, dig, dig! Move to dig tunnels.', 20, 30, 24, '#5a3a1a', 'left');
    drawText(ctx, 'B: back to the meadow (from the top)', 20, 55, 18, '#5a3a1a', 'left');

    // Draw asking panel
    if (state.asking) {
      drawPanel(ctx, 0, 0, W, H, 'rgba(255,230,180,0.9)');
      drawText(ctx, 'Would you like this to be where your house is?', W / 2, H / 2 - 40, 36, '#5a3a1a', 'center');
      drawButtonHint(ctx, 'a', 'Yes, build my home!', W / 2 - 100, H / 2 + 20, false);
      drawButtonHint(ctx, 'b', 'Keep digging', W / 2 + 100, H / 2 + 20, false);
    }

    // Draw building panel
    if (state.building > 0) {
      drawPanel(ctx, 0, 0, W, H, 'rgba(255,230,180,0.9)');
      drawText(ctx, 'Building your cozy home...', W / 2, H / 2 - 40, 36, '#5a3a1a', 'center');
      for (let i = 0; i < 10; i++) {
        drawSparkle(ctx, W / 2 + (i % 2 === 0 ? 20 : -20), H / 2 + (i % 2 === 0 ? 20 : -20), 0.1 + i * 0.05, 10);
      }
    }
  }
};
