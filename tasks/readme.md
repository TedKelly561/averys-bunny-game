Write README.md for this game in plain friendly Markdown, under 60 lines. Sections: what the game is (bunny in
a meadow pulls and eats carrots, picks flowers for quests and prizes, finds secrets under rocks, digs a burrow
after 2 prizes, turns it into a home, decorates rooms, unlocks 5 rooms); How to play (double-click
`start-game.bat`, or run `node tools/serve.mjs` and open http://localhost:8123 in Edge or Chrome; plug in Xbox
controllers and press a button so the browser sees them); Two players (player 2 presses A or Start on the second
controller; the meadow splits into two halves; everything is shared); a Controls table with columns Action /
Xbox controller / Keyboard P1 / Keyboard P2 using the mappings in the contract; For developers (files in src/,
`node tools/smoke.mjs` runs the headless test, `tools/delegate.mjs` hands a task file in tasks/ to a local
Ollama model). Do not invent features that are not in the contract.
