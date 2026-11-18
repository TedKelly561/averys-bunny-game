import { state, save, ROOMS, ITEMS, SLOTS_PER_ROOM, BUNNY_COLORS, roomDecor, availableItems, placeItem } from './state.js';
import { 
  drawBunny, 
  drawItem, 
  drawPanel, 
  drawText, 
  drawButtonHint 
} from './draw.js';

let roomIndex = 0;
const players = [
  { slot: 0, picking: false, pickIndex: 0, options: [] },
  { slot: 3, picking: false, pickIndex: 0, options: [] }
];

export const scene = {
  enter(game) {
    roomIndex = 0;
    players.forEach(p => {
      p.picking = false;
      p.pickIndex = 0;
      p.options = [];
    });
  },

  update(dt, game) {
    const room = ROOMS[roomIndex];
    const isOpen = state.roomsOpen.includes(room.id);

    for (let i = 0; i < game.numPlayers; i++) {
      const inp = game.inputs[i];
      const p = players[i];

      if (p.picking) {
        if (inp.pressed('up')) {
          p.pickIndex = (p.pickIndex - 1 + p.options.length) % p.options.length;
        } else if (inp.pressed('down')) {
          p.pickIndex = (p.pickIndex + 1) % p.options.length;
        } else if (inp.pressed('a')) {
          placeItem(room.id, p.slot, p.options[p.pickIndex]);
          p.picking = false;
        } else if (inp.pressed('b')) {
          p.picking = false;
        }
        continue;
      }

      if (inp.pressed('rb')) {
        roomIndex = (roomIndex + 1) % ROOMS.length;
        players.forEach(pl => pl.picking = false);
      } else if (inp.pressed('lb')) {
        roomIndex = (roomIndex - 1 + ROOMS.length) % ROOMS.length;
        players.forEach(pl => pl.picking = false);
      } else if (isOpen) {
        if (inp.pressed('right')) {
          p.slot = (p.slot + 1) % SLOTS_PER_ROOM;
        } else if (inp.pressed('left')) {
          p.slot = (p.slot - 1 + SLOTS_PER_ROOM) % SLOTS_PER_ROOM;
        } else if (inp.pressed('a')) {
          p.options = [...availableItems(), null];
          p.pickIndex = 0;
          p.picking = true;
        }
      } else if (inp.pressed('a') && room.unlock(state)) {
        if (!state.roomsOpen.includes(room.id)) {
          state.roomsOpen.push(room.id);
          save();
        }
      }

      if (inp.pressed('b')) {
        game.switchTo('meadow');
        return;
      }
    }
  },

  draw(ctx, game) {
    const room = ROOMS[roomIndex];
    const isOpen = state.roomsOpen.includes(room.id);

    // Background
    ctx.fillStyle = '#3b2616';
    ctx.fillRect(0, 0, game.W, game.H);

    // Room Shape
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(90, 110, 1100, 500, 40);
    ctx.fillStyle = room.wall;
    ctx.fill();
    ctx.strokeStyle = '#4a2c12';
    ctx.lineWidth = 8;
    ctx.stroke();
    ctx.clip();

    // Floor band
    ctx.fillStyle = 'rgba(90,58,26,0.35)';
    ctx.fillRect(90, 500, 1100, 110);

    // Doorways
    ctx.fillStyle = '#3b2616';
    ctx.beginPath();
    ctx.ellipse(90, 520, 40, 70, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(1190, 520, 40, 70, 0, 0, Math.PI * 2);
    ctx.fill();

    // Decorations (Windows/Lamps)
    ctx.fillStyle = '#fff3d6';
    ctx.beginPath();
    ctx.arc(300, 200, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(980, 200, 15, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    // Title
    drawText(ctx, room.name, game.W / 2, 60, 40, '#fff3d6', 'center');
    drawText(ctx, `Room ${roomIndex + 1} of 5`, game.W / 2, 100, 24, '#fff3d6', 'center');

    // Slots and Items
    for (let s = 0; s < SLOTS_PER_ROOM; s++) {
      const slotX = 215 + s * 170;
      const slotY = 430;
      
      // Shelf
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(slotX - 60, slotY, 120, 14, 5);
      ctx.fillStyle = '#8b5a2b';
      ctx.fill();
      ctx.strokeStyle = '#4a2c12';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();

      const item = roomDecor(room.id)[s];
      if (item) {
        drawItem(ctx, item, slotX, slotY - 45, 90);
      } else {
        ctx.save();
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.arc(slotX, slotY - 45, 30, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255,255,255,0.3)';
        ctx.stroke();
        ctx.restore();
      }
    }

    // Players
    for (let i = 0; i < game.numPlayers; i++) {
      const p = players[i];
      const slotX = 215 + p.slot * 170;
      const slotY = 430;

      // Selection Outline
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(slotX - 65, slotY - 110, 130, 135, 10);
      ctx.strokeStyle = BUNNY_COLORS[i];
      ctx.lineWidth = 6;
      ctx.stroke();
      drawText(ctx, `P${i + 1}`, slotX, slotY - 125, 20, BUNNY_COLORS[i], 'center');
      ctx.restore();

      drawBunny(ctx, slotX, 590, {
        facing: 1,
        pose: 'idle',
        t: game.time,
        p: 0,
        color: BUNNY_COLORS[i]
      });
    }

    // Picking UI
    for (let i = 0; i < game.numPlayers; i++) {
      const p = players[i];
      if (p.picking) {
        const px = i === 0 ? 140 : 740;
        drawPanel(ctx, px, 130, 400, 330);
        
        p.options.forEach((opt, idx) => {
          const rowY = 200 + idx * 50;
          const isSelected = idx === p.pickIndex;
          
          if (isSelected) {
            ctx.save();
            ctx.fillStyle = 'rgba(255, 255, 0, 0.3)';
            ctx.fillRect(px, rowY - 10, 380, 45);
            ctx.restore();
          }

          if (opt) {
            drawItem(ctx, opt, px + 40, rowY, 36);
            drawText(ctx, ITEMS[opt].name, px + 100, rowY, 24, '#5a3a1a');
          } else {
            drawText(ctx, "Take it away", px + 40, rowY, 24, '#5a3a1a');
          }
        });

        if (p.options.length === 1 && p.options[0] === null) {
          drawText(ctx, "Find flowers and prizes in the meadow!", px + 40, 450, 20, '#5a3a1a');
        }
      }
    }

    // Locked State
    if (!isOpen) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(game.W / 2, 350, 50, 0, Math.PI * 2);
      ctx.fillStyle = '#7a3a1a';
      ctx.fill();
      ctx.strokeStyle = '#3b2616';
      ctx.lineWidth = 5;
      ctx.stroke();
      ctx.restore();

      drawText(ctx, "Locked: " + room.hint, game.W / 2, 420, 30, '#fff3d6', 'center');
      if (room.unlock(state)) {
        drawButtonHint(ctx, 'a', 'Open this room!', game.W / 2, 480, game.inputs[0].usingGamepad);
      }
    }

    // Bottom Hints
    drawPanel(ctx, 90, 635, 1100, 60);
    drawButtonHint(ctx, 'lb', 'Change room', 120, 665, game.inputs[0].usingGamepad);
    drawButtonHint(ctx, 'rb', 'Change room', 420, 665, game.inputs[0].usingGamepad);
    drawButtonHint(ctx, 'a', 'Decorate', 720, 665, game.inputs[0].usingGamepad);
    drawButtonHint(ctx, 'b', 'Back to the meadow', 980, 665, game.inputs[0].usingGamepad);
  }
};
