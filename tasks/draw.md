Implement draw.js with every function listed in the contract, exported by name. Import ITEMS and
FLOWER_COLORS from './state.js' for drawItem. Use only canvas 2D paths (arc, ellipse, quadraticCurveTo,
bezierCurveTo, roundRect, fill, stroke). Make it cute: soft outlines (#5a3a1a, lineWidth 2-3), rounded shapes,
bright colours. The bunny is the star: big head, long ears, big dark eyes with a white highlight, pink nose,
round fluffy tail; honour `facing` using ctx.translate(x, y) then ctx.scale(facing, 1). In the 'eat' pose draw
a small carrot at the mouth. drawItem must handle every id in ITEMS with a distinct simple icon (switch on id).
Never use NaN-prone maths; default missing option fields (o.t || 0, o.p || 0, o.pose || 'idle').

Sizes and look (the previous attempt looked crude: flowers like bow-ties, trees like lollipops, tiny bunny):
- drawBunny, drawn in local coordinates after translate(x, y) and scale(facing, 1), feet at y = 0, facing right:
  a soft shadow ellipse on the ground; body = ellipse centred (0, -28) radii 26 x 24; fluffy white tail circle
  r 9 at (-26, -24); two back feet ellipses at y = -3; head = circle r 20 centred (14, -56); two long upright
  ears = ellipses radii 7 x 22 centred (6, -90) and (20, -92), slightly tilted, each with a smaller pink
  (#ffb6c9) inner ellipse; eye = dark circle r 4 at (22, -60) with a tiny white highlight; pink nose r 3 at
  (33, -53); pink cheek blush; small front paw. Fill with o.color, outline #5a3a1a lineWidth 2.5.
  'hop': lift the whole bunny by sin(p * PI) * 18 and stretch slightly (shadow stays on the ground).
  'pull': rotate the body about -0.25 rad (leaning back) and shake by sin(t * 30). 'eat': draw a small orange
  carrot with green top held at the mouth (36, -48) and wobble the cheek. 'dig': rotate +0.3 rad forward and
  move the front paws with sin(t * 25). 'idle': body scale breathing with sin(t * 2), occasional ear twitch.
- drawFlower: green stem 28px tall with two small leaves, then FIVE round petals (circles r 7) arranged in a
  ring of radius 8 around the top of the stem (use cos/sin of i * 2PI / 5), yellow centre circle r 5; sway the
  top a little with sin(t * 2 + x).
- drawTree: brown trunk 30 wide and 90 tall from the ground point up, with a big fluffy crown made of 5-6
  overlapping green circles (r 45-60) in two shades, total height about 220.
- drawBerryBush: 4 overlapping green circles forming a mound about 90 wide and 60 tall, 6 berries (r 5).
- drawRock: grey rounded blob with a lighter highlight. drawGrassTuft: 3 short curved blades.
- drawCarrotPlant: 3 feathery green leaves fanning up from (x, y); the orange carrot is a tapered triangle
  shape 14 wide and 40 long, drawn rising above the ground by pulled * 40 px (clip so the part still under
  the ground line y is hidden), plus a small dirt mound.
- drawItem: for flower ids draw a 5-petal flower head in FLOWER_COLORS[id] filling the square. Distinct icons:
  ribbon (pink bow), lantern (yellow glowing jar), rug (striped oval), teapot, painting (framed landscape),
  crown (ring of daisies), acorn (golden), feather (blue), pebble (shiny grey-blue), shell (spiral), bell (gold).
Keep the file under 600 lines.
