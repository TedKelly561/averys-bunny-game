# Avery's Bunny Game - technical contract

Browser game. Plain ES modules, HTML5 Canvas 2D, no libraries, no build step, no image files
(everything is drawn with canvas shapes). Logical canvas size is 1280x720. Friendly, cute, bright
storybook look for a young child. No enemies, no danger, no fail states.

## Files
- `index.html`   canvas + `<script type="module" src="src/main.js">`
- `src/state.js` shared game data + save/load (WRITTEN, see below)
- `src/main.js`  game loop and scene switching (WRITTEN)
- `src/input.js` keyboard + Xbox controller input
- `src/draw.js`  all drawing helpers
- `src/meadow.js`, `src/burrow.js`, `src/house.js`  the three scenes

## Scene interface (meadow.js, burrow.js, house.js)
Each scene file has exactly one export: `export const scene = { enter(game) {}, update(dt, game) {}, draw(ctx, game) {} };`
- `dt` is seconds since last frame (max 0.05).
- `game` is `{ state, input, W: 1280, H: 720, time, switchTo(name) }`; `time` is seconds since start,
  `name` is `'meadow' | 'burrow' | 'house'`. `switchTo` calls the new scene's `enter(game)`.
- `draw` must paint the whole 1280x720 canvas every frame.
- Scenes keep their own private module-level variables (camera, timers, particles).

## input.js
`export const input = { x, y, usingGamepad, update(), pressed(name), held(name) }`
- `update()` is called once per frame by main.js BEFORE the scene update. Scenes never call it.
- `x`, `y`: movement, each -1..1 (y positive = down). From left stick (deadzone 0.25), d-pad, WASD, arrow keys.
- `held(name)`: true while down. `pressed(name)`: true only on the frame it went down.
- Names and mappings (standard gamepad button index / keyboard):
  `a` (0 / Space, Enter), `b` (1 / Escape, Backspace), `x` (2 / KeyE), `y` (3 / KeyQ),
  `lb` (4 / KeyZ), `rb` (5 / KeyC), `start` (9 / KeyP),
  `up`,`down`,`left`,`right` (d-pad 12,13,14,15 OR left stick pushed past 0.6 OR arrow keys / WASD).
  For up/down/left/right, `pressed` fires once when the direction is first pushed (menu navigation).
- `usingGamepad`: true if the most recent input came from a controller (used to pick button hint text).

## draw.js (all functions exported by name; every function must `ctx.save()` / `ctx.restore()`)
Coordinates are in pixels. `t` is time in seconds for gentle animation (sway, blink, twinkle).
- `drawBunny(ctx, x, y, o)`: x,y = point on the ground between the feet. Bunny is about 70 wide, 80 tall,
  white/cream with pink inner ears, pink nose, round tail. `o = { facing: 1|-1, pose, t, p }`.
  `pose`: `'idle'` (breathing, ear twitch), `'hop'` (p 0..1 hop phase, body arcs up),
  `'pull'` (leaning back tugging, p 0..1), `'eat'` (sitting, holding a carrot at mouth, cheeks wobble with t),
  `'dig'` (leaning forward, front paws scrabbling with t).
- `drawCarrotPlant(ctx, x, y, pulled, t)`: x,y = ground point. Green leafy top always visible.
  `pulled` 0 = carrot hidden underground; 1 = whole orange carrot lifted above the ground.
- `drawCarrot(ctx, x, y, size, bites)`: loose carrot centred on x,y, `size` = length in px, `bites` 0..3 shortens it.
- `drawFlower(ctx, x, y, color, t, scale = 1)`: stem + leaves + 5 petals + yellow centre; x,y = base of stem;
  `color` is a CSS colour; about 40px tall at scale 1.
- `drawBerryBush(ctx, x, y, hasBerries, t)`: round green bush about 90 wide; red/purple berries if hasBerries.
- `drawRock(ctx, x, y, size)`, `drawTree(ctx, x, y, t)` (about 220 tall), `drawGrassTuft(ctx, x, y, t)`,
  `drawCloud(ctx, x, y, scale)`, `drawSparkle(ctx, x, y, t, size = 10)`,
  `drawBurrowHole(ctx, x, y)` (dark oval hole with a dirt mound, about 90 wide).
- `drawItem(ctx, id, x, y, size)`: icon centred on x,y fitting a `size` square. `id` is one of the ids in
  `ITEMS` from state.js (flowers draw a flower head, others draw a simple cute icon for that item).
- `drawPanel(ctx, x, y, w, h, fill = 'rgba(255,250,235,0.95)')`: rounded box, brown outline.
- `drawText(ctx, text, x, y, size = 28, color = '#5a3a1a', align = 'left')`: bold rounded sans-serif,
  textBaseline 'middle'.
- `drawButtonHint(ctx, button, label, x, y, usingGamepad)`: coloured circle with the button letter
  (A green, B red, X blue, Y yellow; keyboard shows the key name instead) followed by label text.

## state.js (already written - import, never redefine)
```js
STATE_JS_HERE
```

## Controls summary
Left stick / d-pad: move. A: do the thing (pull carrot, pick flower, confirm). B: back / leave.
Y: start digging a burrow (when allowed). LB / RB: previous / next room in the house.
