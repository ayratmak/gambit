# Writing a 3D lesson

A 3D lesson is a guided, clickable diorama hosted by Max and Libby (see `docs/CHARACTERS.md`). It runs at
`world.html?w=<world-id>`, and `?step=N` jumps to a step while you're working on it. Each course has one, built on its
free preview lesson, so anyone can play it.

The reference lesson is `assets/world/two-robbers.js`. Read it first.

## Files

| File | What it is | Edit it? |
|---|---|---|
| `assets/world/engine.js` | Renderer, camera, clicking, labels, bubbles, `box()`, `stack()`, `animate()` | No |
| `assets/world/characters.js` | Max, Libby and extras (`CAST`, `makeCharacter`) | No |
| `assets/world/kit.js` | `stage`, `scenery`, `prop`, `cast`, `board`: use these | No |
| `world.html` | The page: guide panel, dialogue, tasks, cards | No |
| `assets/world/<world-id>.js` | **Your lesson** | Yes |

Check your lesson with `node tools/validate-worlds.mjs <world-id>`. It must print ✓.

## What a world file exports

```js
import { stage, scenery, prop, cast, board, V, THREE, box, stack, animate, CAST } from './kit.js';

export const meta = { id: 'my-world', title: 'Short title', course: '<course id>', lesson: '<lesson id>', minutes: 7 };
export function build(w) { /* make the scene, return an api object the steps use */ }
export function card(key, ctx) { /* return { kicker, title, rows: [[label, value], ...], text } for any clickable key */ }
export const steps = [ /* 8 to 14 steps */ ];
```

`ctx` holds `{ api, stepId, reached(stepId) }`. `reached` lets a card say more once the learner has got that far.

## Building the scene

- **The stage:** `stage(w, { width: 26, depth: 18 })` makes the plinth. The floor is at y = 0. Keep things roughly within x -12…12 and z -8…8.
- **Characters:** `cast(w, { max: [x, z], libby: [x, z], detective: [x, z] })` places them. Max and Libby are about 2.1 units tall. A one-off extra is `name: { spec: {...CAST.detective, name: 'Auctioneer', top: '#8C8478', topDark: '#6E675D', hat: null, moustache: false}, at: [x, z] }`. Keep extras in muted colours. Spec fields:
  - `skin`, `blush`, `hair`, `eyes`, `top`, `topDark`, `trousers`, `shoes`, `sole`;
  - `hairStyle` ('quiff', 'buns' or 'short');
  - `coat`, `hoodie`, `jacket` (with `stripeA` and `stripeB`), `glasses`, `hat` (a colour), `moustache`, `height`.
- **What the cast returns:**
  - Speech: `say(who, html, ms)`, `think(who, html)` (a dashed thought that stays up), `clearThoughts()`.
  - Faces: `faces(maxFace, libbyFace)`, using 'happy', 'grin', 'think', 'worried' or 'surprised'.
  - Poses: `poses(a, b)`, using 'idle', 'wave', 'think', 'point', 'cheer' or 'shrug'.
  - Moving: `hop(who, [x, z])`, `walk(who, [x, z])` and `home()`.
  - Other: `name(who, text)`, `outfit(who, { mask, apron })`, `show(who, on)`, and `chars[who]` for a single character's `.face()` or `.pose()`.
- **Clickable things:** `prop(w, key, group, 'Label', labelY)`. Every clickable key needs a real card. Use `show(on)` to hide or show it.
- **Scenery:** `scenery(w, group)` for anything that isn't clickable, such as tables, walls, trees and stalls.
- **Payoff board:** `board(w, { center: [x, z] })`, then `await b.show(game)`, where `game = { rows, cols, pay: [[[max, libby], ...]], fmt }`. Max's stacks are green, Libby's gold. Squares are clickable as `cell-<row><col>`; `b.spot(keys)` dims the rest and `b.hide()` hides the board.
- **Shapes:** `box(w, h, d, material, x, y, z, cornerRadius)` builds from the floor up. Use `stack(n, material)`, any `THREE` geometry, and `animate(ms, k => ...)` for movement (k eases from 0 to 1).
- **Materials:** `w.mat(role)` with a theme role ('raised', 'surface', 'floor', 'wood', 'paper', 'water', 'mask', 'ink', 'muted', 'accent', 'bad' or 'gold'), or a fixed `'#hex'`. Use roles for the set, so it follows light and dark mode. Give each clickable object its own materials, because hover glow is per material.
- **Floating labels:** `w.label(key or null, text, V(x, y, z), cls)`, where `cls` is 'sign' (dashed), 'axis' (plain words), 'player' or 'coin' (a single symbol in a circle).

## Steps

```js
{
  id: 'unique-id', title: 'A plain sentence or short phrase',
  lines: [ { who: 'libby', text: 'What she says. <b>New term</b> in bold the first time.' }, { who: 'max', text: '...' } ],
  cam: { wide: [[camX, camY, camZ], [targetX, targetY, targetZ]], phone: [[...], [...]] },
  task: { click: ['key', ...], all: true, say: 'Click … ' }      // click things (all: every one, or any one)
     or { choice: { q: 'Question?', options: [{ text, why }, { text, ok: true, why: 'Right. …' }] } }
     or { pick: { answer: 'key', say: 'Click the … ', wrong: { key: 'why not' }, why: 'Right answer explained' } },
  async enter(api) { /* set up the scene for this step */ },
  async done(api) { /* reward when the task is solved: a reaction, a move, a reveal */ }
}
```

- **Shape of the tour:** 8 to 14 steps, about 7 minutes in all.
- **The last step** has `summary: [3 points]` and `task: null`.
- **Lines:** at most 200 characters each, with two or three per step. They play as speech bubbles, and Libby defines terms.
- **Each step's enter():** must set up everything that step needs (show the board, set faces), so `?step=N` works. Many steps should reveal or move something.
- **Cameras:** 'wide' is for a scene panel about 1.2 times as wide as it's tall, with a field of view of 32°. 'phone' is for one about 0.8 times as wide, with a field of view of 44°, so pull it further back. A target about 1 unit above the floor centres on people.
- **Content:** use the course's own facts and numbers from `assets/courses/<course>.js`. The 3D lesson teaches the same ideas as the text lesson and must agree with it.
- **Words:** Gambit vocabulary only (see `training-library/courses/GLOSSARY.md` if you have it). Write in British English with no long dashes. Don't use real companies or clients, carmakers or banks.
