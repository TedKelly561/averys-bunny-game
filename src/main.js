import { state, load } from './state.js';
import { inputs, updateInputs } from './input.js';
import { scene as meadow } from './meadow.js';
import { scene as burrow } from './burrow.js';
import { scene as house } from './house.js';

const W = 1280;
const H = 720;
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
canvas.width = W;
canvas.height = H;

const scenes = { meadow, burrow, house };
let current = null;

const game = {
  state, inputs, numPlayers: 1, W, H, time: 0,
  sceneName: '',
  switchTo(name) {
    current = scenes[name];
    game.sceneName = name;
    current.enter(game);
  },
};
window.game = game; // handy for testing

load();
game.switchTo('meadow');

let last = performance.now();
function frame(now) {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  game.time += dt;
  updateInputs();
  if (game.numPlayers === 1 && (inputs[1].pressed('a') || inputs[1].pressed('start'))) game.numPlayers = 2;
  current.update(dt, game);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalAlpha = 1;
  current.draw(ctx, game);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
