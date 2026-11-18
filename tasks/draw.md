Implement draw.js with every function listed in the contract, exported by name. Import ITEMS and
FLOWER_COLORS from './state.js' for drawItem. Use only canvas 2D paths (arc, ellipse, quadraticCurveTo,
bezierCurveTo, roundRect, fill, stroke). Make it cute: soft outlines (#5a3a1a, lineWidth 2-3), rounded shapes,
bright colours. The bunny is the star: big head, long ears, big dark eyes with a white highlight, pink nose,
round fluffy tail; honour `facing` using ctx.translate(x, y) then ctx.scale(facing, 1). In the 'eat' pose draw
a small carrot at the mouth. drawItem must handle every id in ITEMS with a distinct simple icon (switch on id).
Never use NaN-prone maths; default missing option fields (o.t || 0, o.p || 0, o.pose || 'idle').
