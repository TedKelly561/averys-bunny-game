# Avery's Bunny Game

A cozy, storybook-style co-op adventure where you play as two adorable bunnies. Explore a peaceful meadow, collect treasures, and build a beautiful home together.

## The Adventure
- **Meadow Exploration**: Pull carrots from the earth, eat them to get full, and pick colorful flowers.
- **Quests & Prizes**: Complete flower-gathering quests to earn special prizes like silk ribbons and tiny teapots.
- **Secrets**: Find hidden treasures like golden acorns and shiny pebbles hidden under rocks.
- **The Burrow**: Once you collect enough prizes, dig a burrow to create your home.
- **Home Decor**: Unlock and decorate 5 different rooms in your burrow using your collected flowers and prizes.

## How to Play
1. **Start**: Double-click `start-game.bat` or run `node tools/serve.mjs` and open `http://localhost:8123` in Edge or Chrome.
2. **Controllers**: Plug in Xbox controllers and press any button so the browser recognizes them.
3. **Multiplayer**: Player 2 joins by pressing **A** or **Start** on the second controller. The meadow will split into two screens.

## Controls
| Action | Xbox Controller | Keyboard P1 | Keyboard P2 |
| :--- | :--- | :--- | :--- |
| **Move** | Left Stick / D-Pad | WASD | Arrow Keys |
| **Action (Pull/Pick/Confirm)** | A | Space | Enter |
| **Back / Leave** | B | Escape | Backspace |
| **Dig Burrow** | Y | Q | , (comma) |
| **Prev / Next Room** | LB / RB | Z / C | [ / ] |

## For Developers
- **Source Code**: All logic is located in the `src/` directory.
- **Headless Test**: Run `node tools/smoke.mjs` to execute the automated test suite.
- **AI Delegation**: Use `node tools/delegate.mjs` to hand a task file from the `tasks/` folder to a local Ollama model.
