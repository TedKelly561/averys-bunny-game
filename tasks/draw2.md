This file `src/draw2.js` replaces two functions of draw.js that looked wrong. Export exactly two functions with
the contract signatures: `drawItem(ctx, id, x, y, size)` and `drawCarrotPlant(ctx, x, y, pulled, t)`.
Import only `import { ITEMS, FLOWER_COLORS } from './state.js';`. Do not import from draw.js. Each function
starts with ctx.save() and ends with ctx.restore(). Outline colour #5a3a1a, lineWidth 2. Always set fillStyle
explicitly before every fill (the previous version drew everything black).

drawItem: `ctx.translate(x, y); const s = size / 100; ctx.scale(s, s);` then draw inside the box -50..50 using
a `switch (id)`. NO background box. Bright, cute, colourful icons:
- red / yellow / blue / pink / white: flower head: 5 petal circles (r 18) on a ring of radius 22 using cos/sin,
  filled FLOWER_COLORS[id], with a yellow (#ffd23f) centre circle r 14.
- ribbon: pink (#ff8fc7) bow: two triangles meeting at a small centre circle, two tails below.
- lantern: glass jar (light yellow #fff3a0 rounded rect) with brown lid and handle and 3 bright yellow dots.
- rug: oval (ellipse 45 x 28) in red (#e8404f) with 3 cream stripes across it.
- teapot: round light-blue (#9fd3f0) body, spout on the right, handle arc on the left, small lid with knob.
- painting: brown frame rect, inside sky blue top half, green bottom half, a yellow sun circle.
- crown: ring of 6 small white daisies (white circle r 9 with yellow centre r 4) on a circle of radius 30.
- acorn: golden (#f0b429) oval nut with a brown (#8b5a2b) cap on top and a little stem.
- feather: slanted blue (#4f8ef7) leaf shape with a white centre line.
- pebble: grey-blue (#9db4c8) smooth blob with a white highlight ellipse.
- shell: tan (#e8c79a) circle with a brown spiral line drawn inside (loop increasing the radius).
- bell: gold (#f6c945) bell shape (dome with flared bottom), small clapper circle below, loop on top.
- default: grey circle.

drawCarrotPlant: x,y is the ground point. `pulled` goes 0..1.
1. Carrot root (orange #ff8a1f): a tapered shape 16 wide at the top and 44 long ending in a point at the
   bottom. Its top is at `y - pulled * 46`. Draw it ONLY above the ground: before drawing the root do
   `ctx.beginPath(); ctx.rect(x - 40, y - 200, 80, 200); ctx.clip();` inside its own save/restore, so when
   pulled is 0 nothing orange is visible and when pulled is 1 the whole carrot is above the ground.
   Add 3 short darker orange lines across the root.
2. Leaves (green #3fae49): 3 feathery leaves fanning out upward from the top of the root (the point
   (x, y - pulled * 46)), each about 26 long, swaying slightly with sin(t * 2 + x).
3. A small brown (#8b5a2b) dirt mound: flat ellipse 22 x 6 at (x, y + 2), drawn BEFORE the root and leaves.
