Implement input.js exactly as in the contract. Use window keydown/keyup listeners (use event.code, call
preventDefault for arrow keys and Space) and navigator.getGamepads() polled inside updateInputs(). Collect the
connected (non-null) gamepads in order: the first belongs to p1, the second to p2. Write one factory function
makePlayer(keyMap) used for both players. Each player keeps a `down` map for the current frame and a `prev`
map for the previous frame for every name, so pressed(name) = down && !prev. Keyboard and gamepad are combined
(either one counts). Normalise x,y so the length is never more than 1. Guard against navigator.getGamepads
being missing or returning null entries.

PREVIOUS ATTEMPT FAILED: it declared `inputs` twice (SyntaxError: Identifier inputs has already been declared). Declare every name exactly once; create p1 and p2 first, then `export const inputs = [p1, p2];` once.

PREVIOUS ATTEMPT FAILED these tests: keyboard did nothing (updateInputs wiped the key state every frame), WASD
was missing, and the stick was turned into only -1/0/1. Required design:
- Module-level `const keys = new Set();` keydown adds event.code, keyup deletes it. Nothing else in the listeners.
- KEY_MAPS per player: `{ a, b, x, y, lb, rb, start, up, down, left, right }` as event.code strings.
  Player 1: up KeyW, down KeyS, left KeyA, right KeyD, a Space, b Escape, x KeyE, y KeyQ, lb KeyZ, rb KeyC, start KeyP.
  Player 2: up ArrowUp, down ArrowDown, left ArrowLeft, right ArrowRight, a Enter, b Backspace, x Period,
  y Comma, lb BracketLeft, rb BracketRight, start Backslash.
- In updateInputs(), for each player: copy `down` into `prev`; then recompute every name from scratch:
  `down[name] = keys.has(keyMap[name]) || gamepadButtonPressed(name)`; for up/down/left/right also true when the
  stick is past 0.6 in that direction.
- x, y: start with the analog stick values (0 inside the 0.25 deadzone, otherwise the real axis value), add
  -1/+1 for d-pad buttons and movement keys, clamp each to -1..1, then normalise if the length is over 1.
- usingGamepad: set true when the pad has any button pressed or stick outside the deadzone; set false when any
  of the player's keyboard keys is held.
- Gamepads: `const pads = Array.from(navigator.getGamepads ? navigator.getGamepads() : []).filter(Boolean);`
  pads[0] is player 1's, pads[1] is player 2's.
