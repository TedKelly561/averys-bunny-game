import { state, save, ROOMS, ITEMS, SLOTS_PER_ROOM, BUNNY_COLORS, roomDecor, availableItems, placeItem } from './state.js';
import { drawBunny, drawItem, drawPanel, drawText, drawButtonHint } from './draw.js';

export const scene = {
  enter(game) {
    this.roomIndex = 0;
    this.players = [
      { slot: 0, picking: false, pickIndex: 0, options: [] },
      { slot: 3, picking: false, pickIndex: 0, options: [] }
    ];
  },

  update(dt, game) {
    const room = ROOMS[this.roomIndex];
    const open = state.roomsOpen.includes(room.id);

    for (let i = 0; i < game.numPlayers; i++) {
      const inp = game.inputs[i];
      const p = this.players[i];

      if (p.picking) {
        if (inp.pressed('up')) {
          p.pickIndex = (p.pickIndex - 1 + p.options.length) % p.options.length;
        }
        if (inp.pressed('down')) {
          p.pickIndex = (p.pickIndex + 1) % p.options.length;
        }
        if (inp.pressed('a')) {
          placeItem(room.id, p.slot, p.options[p.pickIndex]);
          p.picking = false;
        }
        if (inp.pressed('b')) {
          p.picking = false;
        }
        continue;
      }

      if (inp.pressed('rb')) {
        this.roomIndex = (this.roomIndex + 1) % ROOMS.length;
        for (let j = 0; j < game.numPlayers; j++) {
          this.players[j].picking = false;
        }
      }
      if (inp.pressed('lb')) {
        this.roomIndex = (this.roomIndex - 1 + ROOMS.length) % ROOMS.length;
        for (let j = 0; j < game.numPlayers; j++) {
          this.players[j].picking = false;
        }
      }

      if (open) {
        if (inp.pressed('left')) {
          p.slot = (p.slot - 1 + SLOTS_PER_ROOM) % SLOTS_PER_ROOM;
        }
        if (inp.pressed('right')) {
          p.slot = (p.slot + 1) % SLOTS_PER_ROOM;
        }
        if (inp.pressed('a')) {
          p.options = [...availableItems(), null];
          p.pickIndex = 0;
          p.picking = true;
        }
      } else {
        if (inp.pressed('a') && room.unlock(state)) {
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
    ctx.fillStyle = '#3b2616';
    ctx.fillRect(0, 0, 1280, 720);

    const room = ROOMS[this.roomIndex];
    const open = state.roomsOpen.includes(room.id);

    // Draw room background
    ctx.save();
    ctx.fillStyle = room.wall;
    ctx.beginPath();
    ctx.roundRect(90, 110, 1190, 610);
    ctx.fill();
    ctx.restore();

    // Draw floor band
    ctx.fillStyle = '#2a1a0d';
    ctx.fillRect(90, 500, 1190, 220);

    // Draw tunnel doorways
    ctx.fillStyle = '#3b2616';
    ctx.beginPath();
    ctx.roundRect(90, 110, 100, 500);
    ctx.fill();
    ctx.beginPath();
    ctx.roundRect(1190 - 100, 110, 100, 500);
    ctx.fill();

    // Draw room title
    drawText(ctx, `${room.name} - Room ${this.roomIndex + 1} of 5`, 640, 60, 36, '#5a3a1a', 'center');

    // Draw button hints
    drawButtonHint(ctx, 'lb', 'Change room', 100, 660, game.inputs[0].usingGamepad);
    drawButtonHint(ctx, 'rb', 'Change room', 100, 660, game.inputs[0].usingGamepad);
    drawButtonHint(ctx, 'a', 'Decorate', 100, 660, game.inputs[0].usingGamepad);
    drawButtonHint(ctx, 'b', 'Back to the meadow', 100, 660, game.inputs[0].usingGamepad);

    // Draw room slots
    if (open) {
      for (let slot = 0; slot < SLOTS_PER_ROOM; slot++) {
        const x = 215 + slot * 170;
        const y = 430;

        // Draw shelf
        ctx.save();
        ctx.fillStyle = '#8b5a3a';
        ctx.beginPath();
        ctx.roundRect(x - 10, y - 10, 150, 30);
        ctx.fill();
        ctx.restore();

        // Draw item or placeholder
        const item = roomDecor(room.id)[slot];
        if (item) {
          drawItem(ctx, item, x, y - 45, 90);
        } else {
          ctx.strokeStyle = '#8b5a3a';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.roundRect(x - 10, y - 10, 150, 30);
          ctx.stroke();
        }
      }

      // Draw bunnies
      for (let i = 0; i < game.numPlayers; i++) {
        const p = this.players[i];
        const x = 215 + p.slot * 170;
        drawBunny(ctx, x, 590, {
          facing: 1,
          pose: 'idle',
          t: game.time,
          p: 0,
          color: BUNNY_COLORS[i]
        });
        ctx.save();
        ctx.strokeStyle = BUNNY_COLORS[i];
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.roundRect(x - 10, 580, 150, 30);
        ctx.stroke();
        ctx.restore();
      }
    } else {
      // Draw locked room
      ctx.save();
      ctx.fillStyle = '#3b2616';
      ctx.beginPath();
      ctx.roundRect(590, 260, 100, 100);
      ctx.fill();
      ctx.restore();

      drawText(ctx, `Locked: ${room.hint}`, 640, 360, 36, '#5a3a1a', 'center');

      if (room.unlock(state)) {
        drawButtonHint(ctx, 'a', 'Open this room!', 640, 660, game.inputs[0].usingGamepad);
      }
    }

    // Draw picking panel
    for (let i = 0; i < game.numPlayers; i++) {
      if (this.players[i].picking) {
        const p = this.players[i];
        const x = i === 0 ? 140 : 740;
        const y = 130;
        const w = 400;
        drawPanel(ctx, x, y, w, 400, '#f0f0f0');

        const options = p.options;
        const maxOptions = Math.min(options.length, 7);
        for (let j = 0; j < maxOptions; j++) {
          const item = options[j];
          const isSelected = j === p.pickIndex;
          ctx.save();
          ctx.fillStyle = isSelected ? '#d9b38c' : '#ffffff';
          ctx.fillRect(x + 10, y + 40 + j * 60, w - 20, 50);
          ctx.restore();

          drawItem(ctx, item, x + 10 + 10, y + 40 + j * 60, 36);
          drawText(ctx, ITEMS[item]?.name || (item === null ? 'Take it away' : 'Unknown'), x + 10 + 10 + 36 + 10, y + 40 + j * 60 + 25, 24, '#5a3a1a', 'left');
        }

        if (options.length === 1 && options[0] === null) {
          drawText(ctx, 'Find flowers and prizes in the meadow!', x + 10, y + 40 + maxOptions * 60 + 10, 24, '#5a3a1a', 'left');
        }
      }
    }
  }
};
