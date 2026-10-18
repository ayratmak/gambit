# Lesson step types

Every lesson is a list of steps in `assets/courses/<course-id>.js`. The lesson player (`lesson.html`) renders each one. Run `node tools/validate-courses.js` after any edit; it checks every course against the rules below.

Text fields are plain text unless marked HTML. `read.body` paragraphs may use `<b>` and `<i>`.

## read
```js
{ t: 'read', title: 'Your best move depends on theirs', body: ['Paragraph one.', 'Paragraph <b>two</b>.'], figure: MATRIX /* optional, shows a payoff matrix */ }
```

## choice
One right answer (`ok: true`). Wrong answers can be retried. Every option needs a `why`.
```js
{ t: 'choice', title: 'Quick check', q: 'Question?', figure: MATRIX /* optional */, highlightCol: 0 /* optional */,
  options: [ { text: 'Answer A', ok: true, why: 'Because…' }, { text: 'Answer B', why: 'No, because…' } ] }
```

## sort
Two or three buckets. `bucket` is the index of the right bucket.
```js
{ t: 'sort', title: 'Credit or charge?', prompt: 'Sort each difference.', buckets: ['Credit', 'Charge'],
  items: [ { text: 'Already has the safety approval', bucket: 0, why: 'Saves you money, so it lowers their True Price.' } ] }
```

## matrix
Two players. `pay[row][col] = [row player's payoff, column player's payoff]`. `task: 'explore'` asks for three taps; `task: 'nash'` asks the learner to select every pure Nash equilibrium (worked out automatically) and needs `explain`.
```js
{ t: 'matrix', task: 'nash', title: 'Find the equilibria', prompt: '…', rows: ['You confess', 'You deny'], cols: ['They confess', 'They deny'],
  pay: [[[-7, -7], [0, -10]], [[-10, 0], [-1, -1]]], unit: 'years in prison, as negatives', explain: '…' }
```

## repeated
Eight-ish rounds of a 2x2 game against a fixed rule. Move 0 is the co-operative move. `bot` is `'tft'` (tit-for-tat, default), `'grim'` (co-operates until you defect once, then defects for ever) or `'always'` (always defects).
```js
{ t: 'repeated', title: 'Eight quarters', prompt: '…', rounds: 8, roundName: 'Q', moves: ['Hold price', 'Undercut'], short: ['H', 'U'],
  rows: ['You hold', 'You undercut'], cols: ['Rival holds', 'Rival undercuts'], pay: [[[3, 3], [0, 5]], [[5, 0], [1, 1]]], unit: 'margin, £k', bot: 'tft' }
```

## summary
Exactly three takeaways.
```js
{ t: 'summary', points: ['One.', 'Two.', 'Three.'] }
```

## slider (calculator)
Sliders feed formulas. Outputs are JavaScript expressions over the input ids and earlier output ids (`Math` is available). With `goal`, the learner must reach it to continue; without it, moving any slider is enough.
```js
{ t: 'slider', title: 'Your best alternative', prompt: 'Drag your outside option and watch the price.',
  inputs: [ { id: 'alt', label: 'Your outside option', min: 500, max: 1100, step: 10, value: 1000, prefix: '€' } ],
  outputs: [ { id: 'walk', label: 'Your walk-away point', expr: 'Math.min(1000, alt)', prefix: '€' },
             { id: 'price', label: 'Likely price (50:50 split)', expr: '(500 + walk) / 2', prefix: '€', decimals: 0 } ],
  goal: { expr: 'price <= 600', text: 'Get the likely price down to €600.' } /* optional */,
  explain: 'Shown once the goal is met, or after the first move.' }
```
`decimals` defaults to 0. `suffix` (e.g. `'%'`) is allowed on inputs and outputs.

## tree (game tree)
The learner picks what each player does at every decision point. Check compares their picks with backward induction (each player maximises their own payoff; on a tie either pick counts). `p` is the player index into `players`. Leaves carry `pay` with one number per player.
```js
{ t: 'tree', title: 'Who designs the pump?', prompt: 'Pick what each player does at every point, then check.', players: ['Maker', 'Supplier A'], unit: '£ per pump',
  root: { p: 0, options: [
    { label: 'Let A design it', next: { p: 1, options: [ { label: 'Bid high', pay: [100, 60] }, { label: 'Bid low', pay: [150, 10] } ] } },
    { label: 'Design in-house', next: { p: 1, options: [ { label: 'Bid high', pay: [140, 0] }, { label: 'Bid low', pay: [140, 2] } ] } } ] },
  explain: 'Shown after checking.' }
```
Keep trees to three levels and eight leaves at most so they fit a phone.

## dialogue (branching conversation)
A conversation with a scripted counterpart. Each node has their line (`say`) and your possible replies. Replies carry `score` (0-2) and a coaching `note` shown after picking. End nodes have `end: true`, a closing `say`, a `result` sentence and a `verdict` of `'good'`, `'ok'` or `'bad'`.
```js
{ t: 'dialogue', title: 'The rules briefing', prompt: 'A supplier pushes back. Hold the line.', them: 'Supplier B', start: 'a',
  nodes: {
    a: { say: 'We want to add our own conditions to the offer.', options: [
      { text: 'The calculator shows exactly how much room you have.', next: 'b', score: 2, note: 'Points them back to the rules.' },
      { text: 'Send them over and we will see.', next: 'lose', score: 0, note: 'You just reopened the rules.' } ] },
    b: { end: true, say: 'Fine, we will work within it.', result: 'They signed the Rulebook.', verdict: 'good' },
    lose: { end: true, say: 'Great, expect a long list.', result: 'Every supplier will now ask for exceptions.', verdict: 'bad' } } }
```
Every `next` must exist and every path must reach an end. Four to eight nodes is plenty.

## auction (bidding simulation)
The learner bids against simulated rivals for a few rounds and sees every bid after each round.
- `side: 'buy'` means highest bid wins (you have a value). `side: 'sell'` is a reverse auction: lowest bid wins (you have a cost).
- `mode`: `'first'` (winner pays or gets its own bid), `'second'` (winner pays or gets the runner-up's bid) or `'english'` (same outcome as second-price, shown as a clock).
- Private values: you and each rival draw a value (or cost) uniformly from `range`. Rivals bid the textbook strategy for the mode.
- Common value: set `common: { truth: 216, spread: 0.2 }`. Everyone, you included, gets an estimate within ±spread of the hidden truth; rivals bid their estimate shaded a little, which is what real bidders do. The truth is revealed after each round.
```js
{ t: 'auction', title: 'The jar of coins', prompt: 'Bid for the jar. Highest bid wins and pays its bid.', side: 'buy', mode: 'first',
  rivals: 7, range: [0, 100] /* private values only */, common: { truth: 216, spread: 0.2 } /* optional */, rounds: 3, unit: '£', explain: 'Shown at the end.' }
```

## Exam
Ten questions, four options each, `answer` is the index of the right option, `pass: 7`.
```js
exam: { pass: 7, questions: [ { q: '…', options: ['A', 'B', 'C', 'D'], answer: 2, why: '…' } ] }
```
