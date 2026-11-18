Implement input.js exactly as in the contract. Use window keydown/keyup listeners (use event.code, call
preventDefault for arrow keys and Space) and navigator.getGamepads() polled inside update(). Use the first
connected gamepad. Keep a `down` map of the current frame and a `prev` map of the previous frame for every
name so pressed(name) = down && !prev. Combine keyboard and gamepad (either one counts). Normalise x,y so
length is never more than 1. Guard against navigator.getGamepads being missing or returning null entries.
