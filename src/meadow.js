import { state, save, canDig, FLOWER_TYPES, FLOWER_COLORS, QUESTS, SECRET_IDS, ITEMS, BUNNY_COLORS } from './state.js';
import * as draw from './draw.js';

// --- Module Data ---
const WORLD_W = 3200;
const WORLD_H = 2000;

const bunnies = [
  { x: 1600, y: 1000, facing: 1, moving: false, hopT: 0, action: null, actionT: 0, target: null },
  { x: 1680, y: 1000, facing: 1, moving: false, hopT: 0, action: null, actionT: 0, target: null }
];

const carrots = Array.from({ length: 40 }, () => ({
  x: 100 + Math.random() * (WORLD_W - 200),
  y: 100 + Math.random() * (WORLD_H - 200),
  pulled: 0,
  gone: false,
  respawn: 0
}));

const flowers = Array.from({ length: 120 }, () => ({
  x: 100 + Math.random() * (WORLD_W - 200),
  y: 100 + Math.random() * (WORLD_H - 200),
  type: FLOWER_TYPES[Math.floor(Math.random() * FLOWER_TYPES.length)],
  gone: false,
  respawn: 0
}));

const bushes = Array.from({ length: 15 }, () => ({
  x: 100 + Math.random() * (WORLD_W - 200),
  y: 100 + Math.random() * (WORLD_H - 200),
  berries: true,
  respawn: 0
}));

const trees = Array.from({ length: 25 }, () => ({
  x: 100 + Math.random() * (WORLD_W - 200),
  y: 100 + Math.random() * (WORLD_H - 200)
}));

const rocks = Array.from({ length: 10 }, () => ({
  x: 100 + Math.random() * (WORLD_W - 200),
  y: 100 + Math.random() * (WORLD_H - 200),
  searched: false
}));

const tufts = Array.from({ length: 200 }, () => ({
  x: Math.random() * WORLD_W,
  y: Math.random() * WORLD_H
}));

let messages = [];

// --- Helpers ---
const dist = (x1, y1, x2, y2) => Math.hypot(x1 - x2, y1 - y2);
const clamp = (val, min, max) => Math.max(min, Math.min(max, val));

function addMessage(text) {
  messages.push({ text, t: Date.now() });
}

function checkQuest() {
  if (state.questIndex < QUESTS.length) {
    const q = QUESTS[state.questIndex];
    const met = Object.entries(q.need).every(([col, amt]) => state.flowers[col] >= amt);
    if (met) {
      state.prizes.push(q.prize);
      addMessage(`Prize! ${ITEMS[q.prize].name}`);
      state.questIndex++;
      save();
    }
  }
}

// --- Scene Interface ---
export const scene = {
  enter(game) {
    if (state.burrow) {
      bunnies[0].x = state.burrow.x - 40;
      bunnies[0].y = state.burrow.y;
      bunnies[1].x = state.burrow.x + 40;
      bunnies[1].y = state.burrow.y;
    }
    bunnies.forEach(b => b.action = null);
  },

  update(dt, game) {
    const now = Date.now();
    messages = messages.filter(m => now - m.t < 3000);

    // Respawn logic
    carrots.forEach(c => {
      if (c.gone) {
        c.respawn -= dt;
        if (c.respawn <= 0) { c.gone = false; c.pulled = 0; }
      }
    });
    flowers.forEach(f => {
      if (f.gone) {
        f.respawn -= dt;
        if (f.respawn <= 0) { f.gone = false; }
      }
    });
    bushes.forEach(b => {
      if (!b.berries) {
        b.respawn -= dt;
        if (b.respawn <= 0) { b.berries = true; }
      }
    });

    for (let i = 0; i < game.numPlayers; i++) {
      const inp = game.inputs[i];
      const b = bunnies[i];

      if (!b.action) {
        b.moving = inp.x !== 0 || inp.y !== 0;
        if (b.moving) {
          const moveX = inp.x * 260 * dt;
          const moveY = inp.y * 260 * dt;
          b.x = clamp(b.x + moveX, 0, WORLD_W);
          b.y = clamp(b.y + moveY, 0, WORLD_H);
          b.facing = inp.x > 0 ? 1 : (inp.x < 0 ? -1 : b.facing);
          b.hopT = (b.hopT + dt * 5) % 1;
        } else {
          b.hopT = 0;
        }

        if (inp.pressed('a')) {
          if (state.homeBuilt) {
            game.switchTo('house');
            return;
          }
          // Find nearest interactable
          let target = null;
          let minDist = 70;

          // Carrot
          carrots.forEach(c => {
            if (!c.gone && dist(b.x, b.y, c.x, c.y) < minDist) {
              minDist = dist(b.x, b.y, c.x, c.y);
              target = { type: 'carrot', obj: c };
            }
          });
          // Flower
          flowers.forEach(f => {
            if (!f.gone && dist(b.x, b.y, f.x, f.y) < minDist) {
              minDist = dist(b.x, b.y, f.x, f.y);
              target = { type: 'flower', obj: f };
            }
          });
          // Bush
          bushes.forEach(bu => {
            if (bu.berries && dist(b.x, b.y, bu.x, bu.y) < minDist) {
              minDist = dist(b.x, b.y, bu.x, bu.y);
              target = { type: 'bush', obj: bu };
            }
          });
          // Rock
          rocks.forEach(r => {
            if (!r.searched && dist(b.x, b.y, r.x, r.y) < minDist) {
              minDist = dist(b.x, b.y, r.x, r.y);
              target = { type: 'rock', obj: r };
            }
          });

          if (target) {
            const obj = target.obj;
            if (target.type === 'carrot') {
              b.action = 'pull';
              b.actionT = 0;
              b.target = obj;
            } else if (target.type === 'flower') {
              obj.gone = true;
              obj.respawn = 40;
              state.flowers[obj.type] += 1;
              addMessage(`Picked a ${obj.type} flower!`);
              checkQuest();
              save();
            } else if (target.type === 'bush') {
              obj.berries = false;
              obj.respawn = 30;
              state.berries += 3;
              addMessage("Yummy berries!");
              save();
            } else if (target.type === 'rock') {
              obj.searched = true;
              const secret = SECRET_IDS.find(id => !state.secrets.includes(id));
              if (secret) {
                state.secrets.push(secret);
                addMessage(`You found a secret: ${ITEMS[secret].name}!`);
              } else {
                addMessage("Nothing under this rock.");
              }
              save();
            }
          }
        }
        if (inp.pressed('y') && canDig()) {
          state.digSite = { x: b.x, y: b.y };
          save();
          game.switchTo('burrow');
          return;
        }
      } else if (b.action === 'pull') {
        b.actionT += dt;
        b.target.pulled = Math.min(1, b.actionT / 1.2);
        if (b.actionT >= 1.2) {
          b.action = 'eat';
          b.actionT = 0;
          b.target.gone = true;
          b.target.respawn = 45;
          b.target.pulled = 0;
        }
      } else if (b.action === 'eat') {
        b.actionT += dt;
        if (b.actionT >= 2) {
          state.carrotsEaten += 1;
          addMessage("Nom nom nom!");
          save();
          b.action = null;
        }
      }
    }
  },

  draw(ctx, game) {
    if (game.numPlayers === 1) {
      drawView(ctx, game, 0, 0, 1280);
    } else {
      drawView(ctx, game, 0, 0, 640);
      drawView(ctx, game, 1, 640, 640);
      ctx.fillStyle = '#3a2410';
      ctx.fillRect(637, 0, 6, 720);
    }

    // HUD
    draw.drawPanel(ctx, 10, 10, 300, 120);
    draw.drawText(ctx, `Carrots: ${state.carrotsEaten}`, 20, 30);
    draw.drawText(ctx, `Berries: ${state.berries}`, 20, 60);
    let yOff = 90;
    for (const [col, count] of Object.entries(state.flowers)) {
      draw.drawItem(ctx, col, 20 + (yOff % 200), 100 + (yOff / 20), 20);
      draw.drawText(ctx, count, 50, 100 + (yOff / 20), 16);
      yOff += 20;
    }

    draw.drawPanel(ctx, 320, 10, 400, 120);
    const q = QUESTS[state.questIndex];
    const qText = q ? q.text : "All quests done!";
    draw.drawText(ctx, `Quest: ${qText}`, 330, 60);
    draw.drawText(ctx, `Prizes: ${state.prizes.length}`, 330, 90);

    if (game.numPlayers === 1) {
      draw.drawText(ctx, "Player 2: press A to join", 1000, 30, 20);
    }

    messages.forEach((m, i) => {
      draw.drawText(ctx, m.text, 640, 150, 32, '#fff');
    });
  }
};

function drawView(ctx, game, pIdx, viewX, viewW) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(viewX, 0, viewW, 720);
  ctx.clip();

  const b = bunnies[pIdx];
  const camX = clamp(b.x - viewW / 2, 0, WORLD_W - viewW);
  const camY = clamp(b.y - 360, 0, WORLD_H - 720);
  ctx.translate(viewX - camX, -camY);

  ctx.fillStyle = '#8fd16a';
  ctx.fillRect(0, 0, WORLD_W, WORLD_H);

  tufts.forEach(t => {
    if (t.x > camX - 100 && t.x < camX + viewW + 100 && t.y > camY - 100 && t.y < camY + 720 + 100) {
      draw.drawGrassTuft(ctx, t.x, t.y, Date.now() / 1000);
    }
  });

  if (state.homeBuilt) {
    draw.drawBurrowHole(ctx, state.burrow.x, state.burrow.y);
  }

  rocks.forEach(r => {
    if (r.x > camX - 100 && r.x < camX + viewW + 100 && r.y > camY - 100 && r.y < camY + 720 + 100) {
      draw.drawRock(ctx, r.x, r.y, 30);
      if (!r.searched) draw.drawSparkle(ctx, r.x, r.y, Date.now() / 1000, 15);
    }
  });

  carrots.forEach(c => {
    if (!c.gone && c.x > camX - 100 && c.x < camX + viewW + 100 && c.y > camY - 100 && c.y < camY + 720 + 100) {
      draw.drawCarrotPlant(ctx, c.x, c.y, c.pulled, Date.now() / 1000);
    }
  });

  flowers.forEach(f => {
    if (!f.gone && f.x > camX - 100 && f.x < camX + viewW + 100 && f.y > camY - 100 && f.y < camY + 720 + 100) {
      draw.drawFlower(ctx, f.x, f.y, FLOWER_COLORS[f.type], Date.now() / 1000);
    }
  });

  bushes.forEach(bu => {
    if (bu.x > camX - 100 && bu.x < camX + viewW + 100 && bu.y > camY - 100 && bu.y < camY + 720 + 100) {
      draw.drawBerryBush(ctx, bu.x, bu.y, bu.berries, Date.now() / 1000);
    }
  });

  trees.forEach(t => {
    if (t.x > camX - 100 && t.x < camX + viewW + 100 && t.y > camY - 100 && t.y < camY + 720 + 100) {
      draw.drawTree(ctx, t.x, t.y, Date.now() / 1000);
    }
  });

  for (let i = 0; i < game.numPlayers; i++) {
    const bunny = bunnies[i];
    if (bunny.x > camX - 100 && bunny.x < camX + viewW + 100 && bunny.y > camY - 100 && bunny.y < camY + 720 + 100) {
      const pose = bunny.action === 'pull' ? 'pull' : (bunny.action === 'eat' ? 'eat' : (bunny.moving ? 'hop' : 'idle'));
      const p = bunny.moving ? (bunny.hopT * 3) % 1 : 0;
      draw.drawBunny(ctx, bunny.x, bunny.y, {
        facing: bunny.facing,
        pose,
        p,
        t: Date.now() / 1000,
        color: BUNNY_COLORS[i]
      });
    }
  }

  // Hints
  let hint = "Look around";
  if (state.homeBuilt) hint = "Go home";
  else if (bunnies[pIdx].action === 'pull') hint = "Eat carrot";
  else if (bunnies[pIdx].action === 'eat') hint = "Eating...";
  else {
    const nearby = carrots.find(c => !c.gone && dist(bunnies[pIdx].x, bunnies[pIdx].y, c.x, c.y) < 70);
    if (nearby) hint = "Pull carrot";
    else {
      const flower = flowers.find(f => !f.gone && dist(bunnies[pIdx].x, bunnies[pIdx].y, f.x, f.y) < 70);
      if (flower) hint = "Pick flower";
      else {
        const bush = bushes.find(bu => bu.berries && dist(bunnies[pIdx].x, bunnies[pIdx].y, bu.x, bu.y) < 70);
        if (bush) hint = "Eat berries";
        else {
          const rock = rocks.find(r => !r.searched && dist(bunnies[pIdx].x, bunnies[pIdx].y, r.x, r.y) < 70);
          if (rock) hint = "Look under rock";
        }
      }
    }
  }

  draw.drawButtonHint(ctx, 'a', hint, viewX + viewW - 200, 650, game.inputs[pIdx].usingGamepad);
  if (canDig()) {
    draw.drawButtonHint(ctx, 'y', "Dig a burrow", viewX + viewW - 200, 680, game.inputs[pIdx].usingGamepad);
  }

  ctx.restore();
}
