Implement input.js exactly as in the contract. Use window keydown/keyup listeners (use event.code, call
preventDefault for arrow keys and Space) and navigator.getGamepads() polled inside updateInputs(). Collect the
connected (non-null) gamepads in order: the first belongs to p1, the second to p2. Write one factory function
makePlayer(keyMap) used for both players. Each player keeps a `down` map for the current frame and a `prev`
map for the previous frame for every name, so pressed(name) = down && !prev. Keyboard and gamepad are combined
(either one counts). Normalise x,y so the length is never more than 1. Guard against navigator.getGamepads
being missing or returning null entries.
