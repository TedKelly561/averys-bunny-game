The burrow digging scene: side-on cross-section of the ground, one shared screen for both bunnies.
Imports: `import { state, save, BUNNY_COLORS } from './state.js';` and the draw functions you use from './draw.js'.

Grid: cells are 40px. 32 columns (0..31), 18 rows (0..17). Rows 0-3 are sky. Rows 4-17 are dirt, the grass
line is at y = 160 (top of row 4). `dug` is a Set of "col,row" strings for dug-out cells.
Module data: `diggers`: 2 objects `{ col, row, px, py, moveT: 0, facing: 1, digging: false }` (px, py = smooth
pixel position; the centre of cell (col,row) is (col*40+20, row*40+20)); `particles` array of
`{ x, y, vx, vy, life }`; `asking` (boolean); `askedAt` (number); `building` (seconds, 0 when not building).

enter(game): clear `dug`; put digger 0 at col 15 and digger 1 at col 17, both at row 3 (standing on the
surface); set px, py to match; asking = false; askedAt = 0; building = 0.

update(dt, game):
- If building > 0: building -= dt; when it reaches 0 or less: `state.homeBuilt = true`,
  `state.burrow = state.digSite`, save(), `game.switchTo('house')`. Return.
- If asking: if any active player's input pressed('a') then building = 2.5 and asking = false; if any pressed('b')
  then asking = false and `askedAt = dug.size`. Return.
- For each active player i (below game.numPlayers): always slide px, py smoothly toward the centre of the
  digger's cell. If moveT > 0, count it down. Otherwise read the direction from inp.x / inp.y (take the stronger
  axis, it must be past 0.5) and work out the target cell. The target must stay inside columns 0..31 and rows
  3..17. Row 3 (the surface) is always open to walk along. A dirt cell (row >= 4) that is not dug gets dug: add
  it to `dug`, moveT = 0.3, digging = true, spawn 8 brown particles. An already open cell: moveT = 0.15,
  digging = false. Then set the digger's col,row to the target cell and facing from the x direction.
- If inp.pressed('b') while the digger is on row 3: `game.switchTo('meadow')` and return (leave without a home).
- Update particles (gravity, life) and remove dead ones.
- If not asking and dug.size >= 14 and some active digger is at row >= 9 and dug.size >= askedAt + 6: asking = true.

draw(ctx, game): sky gradient with a sun and two clouds (drawCloud) in rows 0-3; brown dirt (#8b5a2b) from
y = 160 down with a darker band at the bottom; a green grass strip along y = 160; dug cells drawn as rounded
dark-brown (#4a2f17) squares, slightly larger than the cell so neighbours join up; a few flowers (drawFlower)
standing on the surface at fixed x positions; particles; each active digger with drawBunny at
(px, py + 20), pose 'dig' while digging and moveT > 0, else 'idle', colour BUNNY_COLORS[i].
A top panel with the text "Dig, dig, dig! Move to dig tunnels." and a hint "B: back to the meadow (from the top)".
When asking: a big centred panel with "Would you like this to be where your house is?" and two button hints:
A "Yes, build my home!" and B "Keep digging". When building: a centred panel "Building your cozy home..." with
sparkles (drawSparkle) twinkling around it.

PREVIOUS ATTEMPT FAILED: (1) up/down input moved the digger sideways - compute `dc` and `dr` separately:
if |inp.x| >= |inp.y| and |inp.x| > 0.5 then dc = sign(inp.x), dr = 0; else if |inp.y| > 0.5 then dc = 0,
dr = sign(inp.y); target = (col + dc, row + dr). (2) It stored diggers/dug/particles/asking/building on the
imported `state` object - they MUST be private module-level variables (`let asking = false;` etc.), never
properties of `state`. (3) It used FLOWER_COLORS without importing it - import everything you use.
Moving on the surface row 3 also needs moveT = 0.15 so the bunny does not teleport.
