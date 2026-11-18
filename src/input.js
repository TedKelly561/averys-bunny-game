const keys = new Set();

window.addEventListener('keydown', (e) => {
  keys.add(e.code);
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
    e.preventDefault();
  }
});

window.addEventListener('keyup', (e) => {
  keys.delete(e.code);
});

const KEY_MAPS = {
  p1: {
    a: 'Space',
    b: 'Escape',
    x: 'KeyE',
    y: 'KeyQ',
    lb: 'KeyZ',
    rb: 'KeyC',
    start: 'KeyP',
    up: 'KeyW',
    down: 'KeyS',
    left: 'KeyA',
    right: 'KeyD'
  },
  p2: {
    a: 'Enter',
    b: 'Backspace',
    x: 'Period',
    y: 'Comma',
    lb: 'BracketLeft',
    rb: 'BracketRight',
    start: 'Backslash',
    up: 'ArrowUp',
    down: 'ArrowDown',
    left: 'ArrowLeft',
    right: 'ArrowRight'
  }
};

function makePlayer(keyMap) {
  const player = {
    x: 0,
    y: 0,
    usingGamepad: false,
    down: {},
    prev: {},
    pressed: (name) => player.down[name] && !player.prev[name],
    held: (name) => player.down[name]
  };

  // Initialize all possible names
  const names = ['a', 'b', 'x', 'y', 'lb', 'rb', 'start', 'up', 'down', 'left', 'right'];
  names.forEach(name => {
    player.down[name] = false;
    player.prev[name] = false;
  });

  return player;
}

const p1 = makePlayer(KEY_MAPS.p1);
const p2 = makePlayer(KEY_MAPS.p2);

export const inputs = [p1, p2];

export function updateInputs() {
  const pads = Array.from(navigator.getGamepads ? navigator.getGamepads() : []).filter(Boolean);

  [p1, p2].forEach((player, idx) => {
    const keyMap = idx === 0 ? KEY_MAPS.p1 : KEY_MAPS.p2;
    const pad = pads[idx];

    // Shift current state to previous
    for (const name in player.down) {
      player.prev[name] = player.down[name];
    }

    let stickX = 0;
    let stickY = 0;
    let padActive = false;

    if (pad) {
      // Sticks
      let rawX = pad.axes[0] || 0;
      let rawY = pad.axes[1] || 0;
      
      // Deadzone 0.25
      if (Math.abs(rawX) < 0.25) rawX = 0;
      if (Math.abs(rawY) < 0.25) rawY = 0;
      
      stickX = rawX;
      stickY = rawY;

      // Check buttons
      const buttons = pad.buttons.map(b => b.pressed);
      const btnMap = {
        a: 0, b: 1, x: 2, y: 3, lb: 4, rb: 5, start: 9,
        up: 12, down: 13, left: 14, right: 15
      };

      for (const name in keyMap) {
        if (buttons[btnMap[name]]) {
          player.down[name] = true;
          padActive = true;
        } else {
          player.down[name] = false;
        }
      }

      // Stick direction logic (past 0.6)
      if (stickX > 0.6) player.down['right'] = true;
      else if (stickX < -0.6) player.down['left'] = true;
      if (stickY > 0.6) player.down['down'] = true;
      else if (stickY < -0.6) player.down['up'] = true;
    } else {
      // No gamepad, only keyboard
      for (const name in keyMap) {
        player.down[name] = keys.has(keyMap[name]);
      }
    }

    // Movement calculation
    let moveX = 0;
    let moveY = 0;

    // Keyboard/D-Pad contribution
    if (player.down['up']) moveY -= 1;
    if (player.down['down']) moveY += 1;
    if (player.down['left']) moveX -= 1;
    if (player.down['right']) moveX += 1;

    // Stick contribution
    moveX += stickX;
    moveY += stickY;

    // Clamp and normalize
    let mag = Math.sqrt(moveX * moveX + moveY * moveY);
    if (mag > 1) {
      moveX /= mag;
      moveY /= mag;
    }

    player.x = moveX;
    player.y = moveY;

    // usingGamepad logic
    // True if pad exists and (any button pressed OR stick outside deadzone)
    // False if any keyboard key for this player is held
    let anyKeyHeld = false;
    for (const name in keyMap) {
      if (keys.has(keyMap[name])) {
        anyKeyHeld = true;
        break;
      }
    }

    if (pad && (padActive || Math.abs(stickX) > 0.25 || Math.abs(stickY) > 0.25)) {
      player.usingGamepad = true;
    } else {
      player.usingGamepad = false;
    }
    
    // If any keyboard key is held, it overrides the gamepad status for the "hint" logic
    if (anyKeyHeld) player.usingGamepad = false;
  });
}
