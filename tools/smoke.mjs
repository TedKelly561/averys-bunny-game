// Headless smoke test: runs the scenes with a fake canvas and fake controllers.
// usage: node tools/smoke.mjs
const store = {};
globalThis.localStorage = { getItem: (k) => store[k] ?? null, setItem: (k, v) => { store[k] = v; } };
const listeners = {};
globalThis.window = globalThis;
globalThis.addEventListener = (t, f) => { (listeners[t] ||= []).push(f); };
globalThis.document = { addEventListener: globalThis.addEventListener };
let pads = [];
Object.defineProperty(globalThis, 'navigator', { value: { getGamepads: () => pads }, configurable: true });

// Fake 2D context: any method works, gradients too; records NaN arguments and call counts.
let calls = 0; const nanCalls = new Set();
const ctx = new Proxy({}, {
  get(t, p) {
    if (p in t) return t[p];
    if (p === 'measureText') return () => ({ width: 50 });
    return (...a) => { calls++; if (a.some((v) => typeof v === 'number' && !Number.isFinite(v))) nanCalls.add(String(p)); return ctx; };
  },
  set(t, p, v) { t[p] = v; return true; },
});

const fails = [];
const ok = (cond, msg) => { console.log((cond ? 'PASS ' : 'FAIL ') + msg); if (!cond) fails.push(msg); };

const S = await import('../src/state.js');
const { state } = S;
const mk = () => ({ x: 0, y: 0, usingGamepad: true, _p: new Set(), _h: new Set(), pressed(n) { return this._p.has(n); }, held(n) { return this._h.has(n); } });
const scenes = {};
for (const n of ['meadow', 'burrow', 'house']) scenes[n] = (await import(`../src/${n}.js`)).scene;
const game = { state, inputs: [mk(), mk()], numPlayers: 1, W: 1280, H: 720, time: 0, sceneName: '',
  switchTo(n) { this.sceneName = n; scenes[n].enter(this); } };
const step = (n = 1) => { for (let i = 0; i < n; i++) { game.time += 1 / 60; scenes[game.sceneName].update(1 / 60, game); scenes[game.sceneName].draw(ctx, game); for (const i2 of game.inputs) i2._p.clear(); } };
const press = (p, name) => { game.inputs[p]._p.add(name); step(1); };
const safe = (label, fn) => { try { fn(); } catch (e) { ok(false, `${label} threw: ${e.stack.split('\n').slice(0, 3).join(' | ')}`); } };

// --- meadow: wander in a growing spiral mashing A, 1 then 2 players
safe('meadow', () => {
  game.switchTo('meadow');
  step(5);
  ok(calls > 50, 'meadow draws things');
  const wander = (frames) => {
    for (let f = 0; f < frames && game.sceneName === 'meadow'; f++) {
      const a = f / 90; const r = 1;
      game.inputs.forEach((inp, i) => { inp.x = Math.cos(a + i * 2) * r; inp.y = Math.sin(a * 1.3 + i) * r; if (f % 6 === 0) inp._p.add('a'); });
      step(1);
    }
  };
  wander(60 * 120);
  ok(state.carrotsEaten > 0, `1P ate carrots (${state.carrotsEaten})`);
  ok(Object.values(state.flowers).some((v) => v > 0), `1P picked flowers ${JSON.stringify(state.flowers)}`);
  game.numPlayers = 2;
  wander(60 * 600);
  ok(state.berries > 0, `berries eaten (${state.berries})`);
  ok(state.secrets.length > 0, `secrets found (${state.secrets})`);
  ok(state.prizes.length > 0, `prizes won (${state.prizes}) quest ${state.questIndex}`);
  ok(game.sceneName === 'meadow', 'still in meadow before home exists');
});

// --- burrow
safe('burrow', () => {
  state.prizes = ['ribbon', 'lantern', 'rug']; state.homeBuilt = false; state.burrow = null;
  game.switchTo('meadow'); game.inputs.forEach((i) => { i.x = 0; i.y = 0; });
  ok(S.canDig(), 'canDig after prizes');
  press(0, 'y');
  ok(game.sceneName === 'burrow', 'Y starts digging'); ok(!!state.digSite, 'digSite stored');
  game.inputs[0].y = 1; step(60 * 6); game.inputs[0].y = 0; game.inputs[0].x = 1; step(60 * 4); game.inputs[0].x = 0;
  game.inputs[1].x = -1; step(120); game.inputs[1].x = 0; game.inputs[1].y = 1; step(200); game.inputs[1].y = 0;
  step(10);
  press(1, 'b'); step(5); // "keep digging"
  ok(game.sceneName === 'burrow' && !state.homeBuilt, 'B keeps digging');
  game.inputs[0].x = -1; step(60 * 5); game.inputs[0].x = 0; step(5);
  press(0, 'a'); step(60 * 4);
  ok(state.homeBuilt && !!state.burrow, 'home built after saying yes');
  ok(game.sceneName === 'house', 'moved into house');
});

// --- house
safe('house', () => {
  if (game.sceneName !== 'house') game.switchTo('house');
  state.flowers.blue = 2; step(3);
  press(0, 'right'); press(0, 'a'); step(2); press(0, 'a'); step(2);
  const den = S.roomDecor('den');
  ok(den.some(Boolean), `P1 placed an item (${den})`);
  press(1, 'a'); step(2); press(1, 'down'); press(1, 'a'); step(2);
  ok(den.filter(Boolean).length >= 2, `P2 placed an item (${den})`);
  press(0, 'rb'); step(3); press(0, 'a'); step(3);
  ok(state.roomsOpen.includes('bedroom'), 'bedroom unlocked with 3 prizes');
  press(0, 'rb'); step(3); press(0, 'a'); step(3);
  ok(!state.roomsOpen.includes('pantry') || state.carrotsEaten >= 15, 'pantry stays locked until 15 carrots');
  press(0, 'b'); step(3);
  ok(game.sceneName === 'meadow', 'B returns to meadow');
  // go home again: bunnies start beside the burrow
  for (let f = 0; f < 240 && game.sceneName === 'meadow'; f++) { const a = f / 20; game.inputs[0].x = Math.cos(a); game.inputs[0].y = Math.sin(a); if (f % 3 === 0) game.inputs[0]._p.add('a'); step(1); }
  ok(game.sceneName === 'house', 'A at the burrow goes home');
});

// --- real input.js with keyboard events and a fake gamepad
await (async () => {
  try {
    const { inputs, updateInputs } = await import('../src/input.js');
    const fire = (t, code) => (listeners[t] || []).forEach((f) => f({ code, key: code, preventDefault() {} }));
    updateInputs();
    fire('keydown', 'KeyD'); fire('keydown', 'Space'); updateInputs();
    ok(inputs[0].x > 0.5 && inputs[0].pressed('a') && inputs[0].pressed('right'), 'keyboard P1: D moves right, Space = A');
    updateInputs(); ok(!inputs[0].pressed('a') && inputs[0].held('a'), 'pressed is one frame, held stays');
    fire('keyup', 'KeyD'); fire('keyup', 'Space');
    fire('keydown', 'ArrowUp'); fire('keydown', 'Enter'); updateInputs();
    ok(inputs[1].y < -0.5 && inputs[1].pressed('a') && inputs[0].x === 0, 'keyboard P2: arrows + Enter');
    fire('keyup', 'ArrowUp'); fire('keyup', 'Enter');
    const pad = (ax, ay, down) => ({ connected: true, axes: [ax, ay, 0, 0], buttons: Array.from({ length: 17 }, (_, i) => ({ pressed: down.includes(i), value: down.includes(i) ? 1 : 0 })) });
    pads = [pad(0, 0, []), pad(0, 0, [])]; updateInputs();
    pads = [pad(-1, 0, [3]), pad(0, 1, [0, 5])]; updateInputs();
    ok(inputs[0].x < -0.5 && inputs[0].pressed('y') && inputs[0].pressed('left') && inputs[0].usingGamepad, 'gamepad 1 -> P1 (stick, Y)');
    ok(inputs[1].y > 0.5 && inputs[1].pressed('a') && inputs[1].pressed('rb') && inputs[1].pressed('down'), 'gamepad 2 -> P2 (stick, A, RB)');
    pads = [null, pad(0.1, 0.1, [])]; updateInputs();
    ok(inputs[0].x === 0 && inputs[0].y === 0, 'deadzone + null pad handled');
  } catch (e) { ok(false, 'input.js threw: ' + e.stack.split('\n').slice(0, 3).join(' | ')); }
})();

ok(nanCalls.size === 0, 'no NaN passed to canvas' + (nanCalls.size ? ` (${[...nanCalls]})` : ''));
console.log(fails.length ? `\n${fails.length} FAILED` : '\nALL PASSED');
process.exit(fails.length ? 1 : 0);
