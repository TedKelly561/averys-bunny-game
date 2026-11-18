The house scene: side-on view inside the bunny's house tunnel, one shared screen for both bunnies.
Imports: `import { state, save, ROOMS, ITEMS, SLOTS_PER_ROOM, BUNNY_COLORS, roomDecor, availableItems, placeItem } from './state.js';`
and the draw functions you use from './draw.js'.

Module data: `roomIndex` (index into ROOMS, start 0); `players`: 2 objects
`{ slot: 0, picking: false, pickIndex: 0, options: [] }` (player 2 starts on slot 3).
Slot positions on screen (6 slots): x = 215 + slot * 170, y = 430.

enter(game): roomIndex = 0; picking = false for both players.

update(dt, game): `room = ROOMS[roomIndex]`, `open = state.roomsOpen.includes(room.id)`.
For each active player i (below game.numPlayers) with `inp = game.inputs[i]`, `p = players[i]`:
- If p.picking: up/down (inp.pressed) change p.pickIndex with wrap-around over p.options; inp.pressed('a'):
  `placeItem(room.id, p.slot, p.options[p.pickIndex])` (an option of null means "take it away") then
  p.picking = false; inp.pressed('b'): p.picking = false. Then `continue` to the next player.
- inp.pressed('rb'): roomIndex = (roomIndex + 1) % ROOMS.length; inp.pressed('lb'): previous room with
  wrap-around. When the room changes set picking = false for both players.
- If the room is open: left/right (inp.pressed) move p.slot within 0..SLOTS_PER_ROOM-1. inp.pressed('a'):
  p.options = [...availableItems(), null], p.pickIndex = 0, p.picking = true.
- If the room is not open and inp.pressed('a') and room.unlock(state) is true: push room.id into
  state.roomsOpen and save().
- inp.pressed('b') (when not picking): `game.switchTo('meadow')` and return.

draw(ctx, game): dark earth background (#3b2616) over the whole screen; a big rounded room shape from (90, 110)
to (1190, 610) filled with room.wall, with a darker floor band below y = 500 and round tunnel doorways on the
left and right walls; the room name as a title at the top centre plus "Room N of 5"; button hints at the
bottom: LB / RB "Change room", A "Decorate", B "Back to the meadow".
If the room is open: for each slot draw a small wooden shelf at its position; if `roomDecor(room.id)[slot]` has
an item id draw it with `drawItem(ctx, id, x, y - 45, 90)`, otherwise a faint dashed circle. For each active
player draw their bunny (drawBunny, pose 'idle', colour BUNNY_COLORS[i]) standing at (slotX, 590) under their
slot, and a thick rounded outline around their slot in their bunny colour.
If a player is picking: draw a panel (player 1 at x = 140, player 2 at x = 740, y = 130, 400 wide) listing up
to 7 options around pickIndex, each row with the item icon (drawItem, size 36) and ITEMS[id].name (or
"Take it away" for null), with the selected row highlighted. If the only option is null also show
"Find flowers and prizes in the meadow!".
If the room is not open: draw a big padlock shape in the middle and the text "Locked: " + room.hint; if
room.unlock(state) is true show the button hint A "Open this room!" instead.

PREVIOUS ATTEMPT looked bad. Fix all of these:
- Title was unreadable: draw the title with drawText in a light colour ('#fff3d6'), size 40, centred at y = 60.
- The room must be one clean rounded rectangle (ctx.roundRect(90, 110, 1100, 500, 40)) filled with room.wall,
  outlined in dark brown, with the floor band (darker, 'rgba(90,58,26,0.35)') from y = 500 to y = 610 clipped
  inside the room. Doorways: dark ovals (#3b2616) at the left wall (90, 520) and right wall (1190, 520),
  radii 40 x 70.
- Do NOT draw any white box behind items; just the shelf (brown rounded rect 120 wide, 14 tall, centred on
  the slot x at y = 440) and the item above it at (x, 385) with size 90.
- Bunnies stand on the floor at (slotX, 590). Selection outline: ctx.strokeRect-style rounded rectangle around
  the slot item area (x - 65, 325, 130, 135), lineWidth 6, in the player's bunny colour, with a small label
  "P1" / "P2" above it.
- Bottom hints: one row at y = 665 using drawButtonHint with light text; spread at x = 120, 420, 720, 980. Draw
  a drawPanel behind the row (x 90, y 635, w 1100, h 60) so the hint text is readable.
- Add a little charm: two small round windows or a hanging lamp on the back wall, drawn with simple shapes.
