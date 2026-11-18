// Shared game data. Scenes read and change `state` directly, then call save().

export const FLOWER_COLORS = {
  red: '#e8404f', yellow: '#ffd23f', blue: '#4f8ef7', pink: '#ff8fc7', white: '#ffffff',
};
export const BUNNY_COLORS = ['#fffaf0', '#d9b38c']; // player 1, player 2 fur
export const FLOWER_TYPES = Object.keys(FLOWER_COLORS);

// Everything that can be put on a decoration spot in the house.
// kind: 'flower' (uses up one picked flower), 'prize' (won from quests), 'secret' (found in the meadow)
export const ITEMS = {
  red: { name: 'Red Flower', kind: 'flower' },
  yellow: { name: 'Yellow Flower', kind: 'flower' },
  blue: { name: 'Blue Flower', kind: 'flower' },
  pink: { name: 'Pink Flower', kind: 'flower' },
  white: { name: 'White Flower', kind: 'flower' },
  ribbon: { name: 'Silk Ribbon', kind: 'prize' },
  lantern: { name: 'Firefly Lantern', kind: 'prize' },
  rug: { name: 'Cozy Rug', kind: 'prize' },
  teapot: { name: 'Tiny Teapot', kind: 'prize' },
  painting: { name: 'Meadow Painting', kind: 'prize' },
  crown: { name: 'Daisy Crown', kind: 'prize' },
  acorn: { name: 'Golden Acorn', kind: 'secret' },
  feather: { name: 'Bluebird Feather', kind: 'secret' },
  pebble: { name: 'Shiny Pebble', kind: 'secret' },
  shell: { name: 'Snail Shell', kind: 'secret' },
  bell: { name: 'Little Bell', kind: 'secret' },
};
export const SECRET_IDS = Object.keys(ITEMS).filter((k) => ITEMS[k].kind === 'secret');

// Flower quests, done in order. `need` = flowers the bunny must be holding. Flowers are NOT taken away.
export const QUESTS = [
  { text: 'Pick 2 yellow flowers', need: { yellow: 2 }, prize: 'ribbon' },
  { text: 'Pick 3 blue flowers', need: { blue: 3 }, prize: 'lantern' },
  { text: 'Pick 2 red and 2 pink flowers', need: { red: 2, pink: 2 }, prize: 'rug' },
  { text: 'Pick 4 white flowers', need: { white: 4 }, prize: 'teapot' },
  { text: 'Pick 3 of every colour', need: { red: 3, yellow: 3, blue: 3, pink: 3, white: 3 }, prize: 'painting' },
  { text: 'Pick 6 pink and 6 yellow flowers', need: { pink: 6, yellow: 6 }, prize: 'crown' },
];

export const PRIZES_NEEDED_TO_DIG = 2;
export const SLOTS_PER_ROOM = 6;

// Rooms of the house tunnel. `unlock(state)` says whether a locked room may be opened.
export const ROOMS = [
  { id: 'den', name: 'Cozy Den', wall: '#c98f5a', hint: '', unlock: () => true },
  { id: 'bedroom', name: 'Bedroom', wall: '#b9a0d8', hint: 'Win 3 prizes', unlock: (s) => s.prizes.length >= 3 },
  { id: 'pantry', name: 'Carrot Pantry', wall: '#f0b070', hint: 'Eat 15 carrots', unlock: (s) => s.carrotsEaten >= 15 },
  { id: 'treasure', name: 'Treasure Nook', wall: '#8fc7c0', hint: 'Find 3 secrets', unlock: (s) => s.secrets.length >= 3 },
  { id: 'garden', name: 'Garden Room', wall: '#a8d88a', hint: 'Win all 6 prizes', unlock: (s) => s.prizes.length >= 6 },
];

function fresh() {
  return {
    carrotsEaten: 0,
    berries: 0,
    flowers: { red: 0, yellow: 0, blue: 0, pink: 0, white: 0 }, // flowers in the basket
    prizes: [], // item ids won
    secrets: [], // item ids found
    questIndex: 0, // index into QUESTS; QUESTS.length when all are done
    digSite: null, // {x, y} meadow position where the bunny started digging
    homeBuilt: false,
    burrow: null, // {x, y} meadow position of the finished home entrance
    roomsOpen: ['den'], // ids of unlocked rooms
    decor: {}, // roomId -> array of SLOTS_PER_ROOM entries, each an item id or null
  };
}

export const state = fresh();

const KEY = 'averys-bunny-game-save-v1';

export function save() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* ignore */ }
}

export function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) Object.assign(state, fresh(), JSON.parse(raw));
  } catch (e) { /* ignore */ }
}

export function resetGame() {
  Object.assign(state, fresh());
  save();
}

export function canDig() {
  return !state.homeBuilt && state.prizes.length >= PRIZES_NEEDED_TO_DIG;
}

// Slots of a room, created on first use.
export function roomDecor(roomId) {
  if (!state.decor[roomId]) state.decor[roomId] = new Array(SLOTS_PER_ROOM).fill(null);
  return state.decor[roomId];
}

function isPlaced(id) {
  return Object.values(state.decor).some((slots) => slots.includes(id));
}

// Item ids the player could place right now.
export function availableItems() {
  const out = FLOWER_TYPES.filter((f) => state.flowers[f] > 0);
  for (const id of [...state.prizes, ...state.secrets]) if (!isPlaced(id)) out.push(id);
  return out;
}

// Put an item (or null to clear) on a slot, giving back whatever was there.
export function placeItem(roomId, slot, id) {
  const slots = roomDecor(roomId);
  const old = slots[slot];
  if (old && ITEMS[old].kind === 'flower') state.flowers[old] += 1;
  if (id && ITEMS[id].kind === 'flower') state.flowers[id] -= 1;
  slots[slot] = id || null;
  save();
}
