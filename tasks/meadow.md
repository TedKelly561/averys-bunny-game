The meadow scene: top-down view of a big sunny meadow, world size 3200 x 2000 pixels.
Imports: `import { state, save, canDig, FLOWER_TYPES, FLOWER_COLORS, QUESTS, SECRET_IDS, ITEMS, BUNNY_COLORS } from './state.js';`
and the draw functions you use from './draw.js'.

Module data (create once, at module load, with Math.random):
- `bunnies`: array of 2 objects `{ x, y, facing: 1, moving: false, hopT: 0, action: null, actionT: 0, target: null }`
  starting near the world centre (1600, 1000) and (1680, 1000).
- `carrots`: 40 objects `{ x, y, pulled: 0, gone: false, respawn: 0 }` at random positions.
- `flowers`: 120 objects `{ x, y, type, gone: false, respawn: 0 }`, type random from FLOWER_TYPES.
- `bushes`: 15 objects `{ x, y, berries: true, respawn: 0 }`. `trees`: 25 `{ x, y }`. `tufts`: 200 `{ x, y }`.
- `rocks`: 10 objects `{ x, y, searched: false }`.
- `messages`: array of `{ text, t }` popups, shown for 3 seconds each.
Keep everything at least 100px inside the world edges.

enter(game): if state.burrow exists, put both bunnies beside it; clear each bunny's action.

update(dt, game): for each player index i from 0 to game.numPlayers - 1, with `inp = game.inputs[i]`, `b = bunnies[i]`:
- If `b.action` is null: move by inp.x, inp.y at 260 px/s, clamp inside the world, set facing from the sign of
  inp.x, set `b.moving`, and advance `b.hopT` while moving. Then if inp.pressed('a'), find the nearest thing within
  70px and start it, checking in this order:
  1. the home burrow (if state.homeBuilt): `game.switchTo('house')` and return.
  2. a carrot that is not gone: `b.action = 'pull'`, `b.actionT = 0`, `b.target = carrot`.
  3. a flower that is not gone: mark it gone, respawn = 40, `state.flowers[type] += 1`, add message
     "Picked a <type> flower!", call `checkQuest()`, `save()`.
  4. a bush with berries: berries = false, respawn = 30, `state.berries += 3`, message "Yummy berries!", save().
  5. a rock not searched: searched = true; pick the first id in SECRET_IDS that is not in state.secrets; if there is
     one, push it to state.secrets, message "You found a secret: " + ITEMS[id].name + "!", save(); otherwise
     message "Nothing under this rock."
  If inp.pressed('y') and canDig(): `state.digSite = { x: b.x, y: b.y }`, save(), `game.switchTo('burrow')`, return.
- If `b.action === 'pull'`: actionT += dt; `b.target.pulled = Math.min(1, b.actionT / 1.2)`; after 1.2s switch to
  `'eat'` with actionT = 0 and mark the carrot gone with respawn = 45 and pulled = 0.
- If `b.action === 'eat'`: actionT += dt; after 2s: `state.carrotsEaten += 1`, message "Nom nom nom!", save(),
  action = null.
Also every frame: count down `respawn` on gone carrots / gone flowers / empty bushes and bring them back at 0;
age the messages and remove old ones.

`checkQuest()`: if state.questIndex < QUESTS.length and every colour in the current quest's `need` satisfies
`state.flowers[colour] >= amount`, then push quest.prize into state.prizes, add message
"Prize! " + ITEMS[quest.prize].name, and state.questIndex += 1.

draw(ctx, game): if game.numPlayers is 1 call `drawView(ctx, game, 0, 0, 1280)`; otherwise call
`drawView(ctx, game, 0, 0, 640)` and `drawView(ctx, game, 1, 640, 640)` and then fill a 6px wide dark brown
rectangle at x = 637 as the divider. Then draw the shared HUD on top (full screen coordinates).

`drawView(ctx, game, i, viewX, viewW)`: ctx.save(); clip to the rectangle (viewX, 0, viewW, 720); compute camera
`camX = clamp(bunnies[i].x - viewW / 2, 0, 3200 - viewW)`, `camY = clamp(bunnies[i].y - 360, 0, 2000 - 720)`;
`ctx.translate(viewX - camX, -camY)`; fill the visible area with grass green (#8fd16a); then draw in this
order: tufts, the home burrow hole (if state.homeBuilt, at state.burrow), rocks, carrots (not gone) with
drawCarrotPlant, flowers (not gone), bushes, then ALL active bunnies (indexes below game.numPlayers) sorted by
y, then trees. Skip things further than 150px outside the view. Bunny pose: 'pull' or 'eat' from its action,
else 'hop' with p = (hopT * 3) % 1 when moving, else 'idle'. Pass `color: BUNNY_COLORS[index]`. Draw a sparkle
above unsearched rocks. ctx.restore().
Then, in screen coordinates inside this view, draw a button hint near the bottom of the view for what A would
do for this player's bunny right now (e.g. "Pull carrot", "Pick flower", "Eat berries", "Look under rock",
"Go home"), and "Dig a burrow" with button y when canDig().

HUD (drawn once, top of screen): a panel at top-left with the carrot count (state.carrotsEaten), berries, and
for each flower colour a small flower icon via drawItem plus its count; a panel at top-centre with the current
quest text ("Quest: ..." or "All quests done!") and number of prizes; if game.numPlayers is 1, small text at
top-right "Player 2: press A to join". Messages: newest ones centred near y = 150 in panels.

PREVIOUS ATTEMPT FAILED: the file was far too long (650+ lines) and got cut off. Keep the whole file under 400 lines: use small helper functions (dist, clamp, nearest, addMessage) and loops, no repeated code.
