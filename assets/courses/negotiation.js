/* Course 3: Bargaining Power. Built from training-library/courses/03-bargaining-power.md */
(window.GAMBIT_COURSES = window.GAMBIT_COURSES || []).push({
  id: 'negotiation', order: 3, track: 'Negotiation', title: 'Bargaining Power', piece: 'knight',
  price: 9.89,
  status: 'live', level: 'Beginner', minutes: 107,
  summary: "The game theory of one-to-one negotiation: where bargaining power really comes from, and how to use every bit of it.",
  outcomes: [
    "Separate growing the pie from splitting it, and spot trades that cost you little and give them a lot",
    "Diagnose where power comes from in a one-to-one deal: competition, information, alternatives, timing and focal points",
    "Calculate your BATNA, both walk-away points and whether a ZOPA exists, issue by issue",
    "Design moves that shift power your way: a screening menu, a take-it-or-leave-it offer, a well-timed first number"
  ],
  modules: [
    {
      title: 'Two of you, one pie',
      lessons: [
        {
          id: 'only-two-of-you', title: 'When there are only two of you', minutes: 10, kind: 'Concept', preview: true,
          steps: [
            { t: 'read', title: 'Two parties, one pie', body: [
              "A <b>bilateral negotiation</b> has exactly two parties: one buyer, one seller, nobody else at the table. That's all the word means. It says nothing yet about who's stronger, or who'll get the better deal.",
              "It isn't the same as facing a monopoly. A monopolist is the only one who can supply the thing, so a deal with one is always bilateral. But plenty of one-to-one talks happen while other suppliers exist: you just haven't put them in the room. No competition in the room doesn't mean no alternatives.",
              "Whatever happens, you're only ever arguing about two things: how <b>big</b> the pie is, and how it's <b>cut</b>. Every tactic you'll ever learn serves one or the other."
            ] },
            { t: 'sort', title: 'Monopoly, or just bilateral?', prompt: "Sort each situation. Ask yourself: could anyone else, in principle, do this?",
              buckets: ['True monopoly', 'Bilateral, but alternatives exist'],
              items: [
                { text: 'The only firm licensed to service your patented machine', bucket: 0, why: "No one else can legally do it." },
                { text: 'Your logistics provider of eight years, renegotiating its rates', bucket: 1, why: "Other providers exist. Switching is painful, not impossible." },
                { text: 'A software vendor whose product your staff all know', bucket: 1, why: "Retraining costs money, but rivals exist." },
                { text: 'The single holder of a drug patent with five years left', bucket: 0, why: "A monopoly for now. Until the patent ends." },
                { text: 'Your landlord at lease renewal', bucket: 1, why: "You could move. That's the alternative." }
              ] },
            { t: 'read', title: 'The power map', body: [
              "Plot your power against theirs, high or low on each side. That's your <b>power map</b>. Strong you and weak them: run a competition (Course 6 shows how). Weak you: a cooperative, carefully prepared one-to-one.",
              "Your power comes from levers, alternatives and dependencies on both sides. Before every offer, ask one question: how will they react when they get this?",
              "The uncomfortable truth: moving from weak to strong is structural work, done months before the meeting, like qualifying a second supplier or changing a design. Ring someone the day before asking to be made stronger by tomorrow and you'll get one honest answer: good luck."
            ] },
            { t: 'choice', title: 'Where should you be?', q: "You're weak and they're strong on the power map. Your negotiation is next Tuesday. What's realistic?",
              options: [
                { text: 'Run a full tender to create competition by Tuesday', why: "Building real competition takes months, not days." },
                { text: 'Use the power you have as well as possible, and start building more for next time', ok: true, why: "Right. Short term you make the most of what you've got; long term you change the structure." },
                { text: "Accept their price; there's nothing you can do", why: "Weak isn't powerless. The rest of this course is the toolkit." },
                { text: 'Threaten to walk away', why: "Only if walking away is real. Lesson 7 is about exactly that." }
              ] },
            { t: 'read', title: 'Five things decide the split', body: [
              "One-to-one deals often cover a big share of what a business spends. Yet colleagues sometimes decide the outcome before anyone speaks (“we can't possibly switch”), and what was learned last time rarely gets written down.",
              "This course takes the five things that decide who gets which slice, one lesson each: <b>competition</b>, <b>information</b>, <b>alternatives</b>, <b>timing</b> and <b>focal points</b>. First, though, you'll play a game about splitting a pie."
            ] },
            { t: 'summary', points: [
              "Bilateral means two parties at the table, not one supplier in the world.",
              "Every negotiation is about the size of the pie and how it's split.",
              "Structural power is built months ahead. At the table you use what you've got."
            ] }
          ]
        },
        {
          id: 'art-of-sharing', title: 'The art of sharing', minutes: 12, kind: 'Game',
          steps: [
            { t: 'read', title: 'Write down a number', body: [
              "John Nash studied this game in 1953, and it's the simplest model of a split there is. Two players each write down how many of 100 points they want, without seeing the other's number.",
              "If the two demands add up to 100 or less, each gets what they asked for. If they add up to more than 100, <b>both get nothing</b>.",
              "So 40 and 60 pays out: 40 to one, 60 to the other. 60 and 60 pays nothing at all. Greed doesn't just cost you a bit, it can wipe out the whole pie."
            ] },
            { t: 'matrix', task: 'nash', title: 'Demand 30, 50 or 70',
              prompt: "Each of you demands 30, 50 or 70 points. Select every cell where neither player could do better by changing only their own number.",
              rows: ['You demand 30', 'You demand 50', 'You demand 70'],
              cols: ['They demand 30', 'They demand 50', 'They demand 70'],
              pay: [
                [[30, 30], [30, 50], [30, 70]],
                [[50, 30], [50, 50], [0, 0]],
                [[70, 30], [0, 0], [0, 0]]
              ],
              unit: 'points',
              explain: "There are three: 30/70, 50/50 and 70/30. Every pair that adds up to exactly 100 is stable, because asking for more gets you zero and asking for less just gives points away. At 30/30, either player could ask for 70 and still be paid, so it isn't an equilibrium. Theory alone can't tell you which of the three you'll get." },
            { t: 'repeated', title: 'Eight rounds against a copycat',
              prompt: "Same game, two moves: ask for 50 or grab 70. Your opponent copies whatever you asked for last round. Try grabbing once and see what it costs you.",
              rounds: 8, roundName: 'R', moves: ['Ask 50', 'Grab 70'], short: ['50', '70'],
              rows: ['You ask 50', 'You grab 70'], cols: ['They ask 50', 'They grab 70'],
              pay: [[[50, 50], [0, 0]], [[0, 0], [0, 0]]], unit: 'points', bot: 'tft' },
            { t: 'read', title: 'Four kinds of opponent', body: [
              "Against <b>Steady</b>, who always asks for 50, your best move is 50 too. Against <b>Timid</b>, who always asks for 30, you could take 70 and still be paid in full.",
              "Against <b>Greedy</b>, who always asks for 70, only 30 earns you anything, and it hurts to give in. Against the <b>Copycat</b> you just met, whatever you grab today comes back at you tomorrow: one grab cost you at least two rounds of zero.",
              "Real negotiators are a mix of all four, and they adjust to what you did last time. Reputation forms in minutes. That's why reading the other side matters."
            ] },
            { t: 'choice', title: 'Facing Greedy', q: "Your opponent has asked for 70 every single round. What earns you the most next round?",
              options: [
                { text: 'Ask for 30', ok: true, why: "Right. 30 plus 70 is exactly 100, so you're paid 30. Anything more and you both get zero. It's the best reply, even if it stings." },
                { text: 'Ask for 50, the fair split', why: "50 plus 70 is 120. Over 100, so you both get nothing." },
                { text: 'Ask for 70 to teach them a lesson', why: "That's zero for both of you. Sometimes worth it if you'll meet again, but it's not what earns most next round." }
              ] },
            { t: 'choice', title: 'Why 50/50?', q: "Most real pairs end at 50/50, even though 30/70 is just as much an equilibrium. Why?",
              options: [
                { text: '50/50 is the only Nash equilibrium', why: "All three exact-100 splits are equilibria. You found them yourself." },
                { text: "It's the split each side expects the other to expect", ok: true, why: "Right. It's a <b>focal point</b>: obvious, fair and safe. Lesson 9 shows how to use focal points on purpose." },
                { text: 'Game theory requires equal splits', why: "It doesn't. That's the point: theory allows many splits, and expectations pick one." },
                { text: 'Players are always generous', why: "They're not. They just don't want to end up with zero." }
              ] },
            { t: 'summary', points: [
              "In a split, many outcomes are stable. Expectations pick which one you get.",
              "Over-demanding can destroy the whole pie, for both of you.",
              "Obvious, fair-looking splits pull hard: that's a lever you can use."
            ] }
          ]
        },
        {
          id: 'grow-the-pie', title: 'Grow the pie before you split it', minutes: 12, kind: 'Concept',
          steps: [
            { t: 'read', title: 'Two ways to win', body: [
              "You can make the pie bigger, or take a bigger slice. Do the first, then the second. Skip the second and the value you created walks out of the door with the other side.",
              "The pie is <b>value minus cost</b>. Say a product feature costs the seller 17 to add and is worth 27 to you. The pie grows by 10. Price it at 22 and each side gains 5.",
              "Some win-wins are <b>easy</b>: both sides gain and nobody gives anything up. Most are <b>subtle</b>: one side is a little worse off, the other a lot better off, so there's room to compensate. The 17/27 feature is a subtle one."
            ] },
            { t: 'slider', title: 'Win-win calculator', prompt: "The supplier has quoted 26 for the feature. Move the price, cost or value and find a deal where both sides gain at least 3.",
              inputs: [
                { id: 'cost', label: 'Cost to the seller', min: 0, max: 40, step: 1, value: 17 },
                { id: 'value', label: 'Value to you, the buyer', min: 0, max: 40, step: 1, value: 27 },
                { id: 'price', label: 'Price agreed', min: 0, max: 40, step: 1, value: 26 }
              ],
              outputs: [
                { id: 'pie', label: 'Size of the pie (value minus cost)', expr: 'value - cost' },
                { id: 'buyer', label: 'Your gain (value minus price)', expr: 'value - price' },
                { id: 'seller', label: "Seller's gain (price minus cost)", expr: 'price - cost' }
              ],
              goal: { expr: 'buyer >= 3 && seller >= 3', text: 'Get both gains to 3 or more.' },
              explain: "Any price between 20 and 24 does it at 17 and 27. Notice the pie stays 10 whatever the price: the price only decides the split. Now try setting the cost above the value. The pie goes negative, and no price makes both sides gain. That's a trade that shouldn't happen." },
            { t: 'read', title: 'Cheap for you, precious to them', body: [
              "American football's all-star game, the Pro Bowl, struggled to attract stars with cash. Moving it to Hawaii and giving each player two first-class tickets worked better. Richard Thaler (1999) used it to show a holiday that cost the league relatively little was worth more to players than a bigger cheque.",
              "Look at both sides' interests. Buyers care about quality, flexibility, security of supply, payment terms and support. Suppliers care about reliable forecasts, full capacity, low stock, lower risk and cheaper money.",
              "A big buyer that also earns in a small foreign supplier's currency has always contracted in its own. A currency swing could sink the supplier, so it quietly adds about 10% as a risk premium. Contract in the supplier's currency and the premium can come off. The rule: trade on anything where your cost is lower than their gain."
            ] },
            { t: 'sort', title: 'Cheap for one, valuable to the other?', prompt: "Sort each move. Does it grow the pie, or just move value from one side to the other?",
              buckets: ['Likely win-win to trade', 'Pure split, someone just loses'],
              items: [
                { text: 'Giving the supplier a 12-month volume forecast', bucket: 0, why: "Costs you an hour of planning; saves them stock and overtime." },
                { text: 'Paying in 30 days instead of 60, for a discount, when your borrowing is cheaper than theirs', bucket: 0, why: "Their cost of money is higher, so the discount can be worth more to you than the early payment costs." },
                { text: 'A 3% price cut, nothing else changes', bucket: 1, why: "Every pound you gain, they lose. The pie is the same size." },
                { text: "Contracting in the supplier's currency when you earn in it too", bucket: 0, why: "It removes their risk premium at little cost to you." },
                { text: 'Dropping a test step neither side values', bucket: 0, why: "Pure waste removed. Both sides are better off." },
                { text: 'Asking the supplier to absorb a freight increase', bucket: 1, why: "The cost doesn't disappear, it just moves to them." }
              ] },
            { t: 'choice', title: 'Where does the 10 go?', q: "The feature costs the supplier 17 and is worth 27 to you. The supplier quotes 26. What's happened?",
              options: [
                { text: "They've grown the pie", why: "The pie is 10 whatever the price. Price only splits it." },
                { text: "They're claiming 9 of the 10", ok: true, why: "Right. 26 minus 17 is 9 for them; 27 minus 26 is 1 for you. The pie has grown, and now the fight is the split." },
                { text: 'You should reject the feature', why: "You'd still gain 1. Negotiate the price, don't kill the value." }
              ] },
            { t: 'summary', points: [
              "The pie is value minus cost. Grow it first.",
              "Trade what's cheap for you and valuable to them.",
              "Once it's grown, split it on purpose, or the extra goes to the other side."
            ] }
          ]
        }
      ]
    },
    {
      title: 'Competition and information',
      lessons: [
        {
          id: 'competition-changes-everything', title: 'Competition changes everything', minutes: 12, kind: 'Game',
          steps: [
            { t: 'read', title: 'The last-stock problem', body: [
              "A games retailer holds the sole UK rights to a classic console until its successor arrives. It earns <b>£100</b> on every unit it sells, and it has pre-sold <b>30,000</b> units.",
              "Three distributors each hold <b>10,000</b> of the last units. No more will ever be made. Any stock a distributor doesn't sell to the retailer is scrapped: worth <b>£0</b>.",
              "Everyone knows all of this, including that every distributor's fallback is zero. You're the retailer. Same stock, same value, same costs throughout: only the structure of the deal will change."
            ] },
            { t: 'choice', title: 'Needing all three', q: "You need all 30,000 units, so you need every distributor. Each knows you can't meet your orders without it. Where does the price usually land?",
              options: [
                { text: 'Close to £0, since unsold stock is scrap', why: "Each distributor knows it's essential. Without any one of them your orders fail, so none of them has to accept crumbs." },
                { text: 'About £50, half the value', ok: true, why: "Right. Each side needs the other equally, so power is symmetric and the £100 tends to split down the middle." },
                { text: 'Close to £100', why: "You'd be giving away all of your margin. You're just as essential to them as they are to you." }
              ] },
            { t: 'dialogue', title: 'Two of three', prompt: "A third of your pre-orders have been cancelled. You now need only 20,000 units: two distributors, not three. Talk to Distributor B.",
              them: 'Distributor B', start: 'a',
              nodes: {
                a: { say: "Good to see you. Same as last time: £60 a unit.", options: [
                  { text: "Things have changed. I need two of you, not three. The two lowest prices get the order.", next: 'b', score: 2, note: "You've told them the new structure. Now each distributor fears being the one left with scrap." },
                  { text: "Could you do £55?", next: 'c', score: 1, note: "Polite, but they still think they're essential. Tell them about the spare seat." },
                  { text: "£60 is fine, let's sign.", next: 'lose', score: 0, note: "You've paid the old price in a market that just turned in your favour." }
                ] },
                b: { say: "I see. We could come down to £40.", options: [
                  { text: "Distributor A has just offered £25.", next: 'd', score: 2, note: "Competition at work. Only say it if it's true: a bluff found out wrecks your credibility." },
                  { text: "£40 works for me.", next: 'ok', score: 1, note: "Better than £60, but they'd go far lower rather than sell nothing." }
                ] },
                c: { say: "£55 is the best we can do.", options: [
                  { text: "Then you should know I only need two of you. The two lowest prices win.", next: 'b', score: 2, note: "Better late than never. The spare seat is your lever." },
                  { text: "Fine, £55.", next: 'lose', score: 0, note: "You've left almost all of the change in structure on the table." }
                ] },
                d: { say: "£25? Then we'll do £15. We'd rather sell at £15 than scrap it all.", options: [
                  { text: "C is at £12. Last call.", next: 'win', score: 2, note: "Each one would rather sell at £10 than not at all. The price keeps falling towards zero." },
                  { text: "Deal at £15.", next: 'good', score: 1, note: "A strong result. Pushing once more might still have moved it." }
                ] },
                win: { end: true, say: "All right. £10, and we're in.", result: "You bought at £10 a unit, down from £50 when you needed all three.", verdict: 'good' },
                good: { end: true, say: "Done at £15.", result: "£15 a unit. One spare seat cut the price by more than two thirds.", verdict: 'good' },
                ok: { end: true, say: "Pleasure doing business.", result: "£40 a unit. Better, but the distributors would have gone much lower rather than be left out.", verdict: 'ok' },
                lose: { end: true, say: "Excellent. See you next season.", result: "You paid £55 to £60 while every distributor feared being left with scrap.", verdict: 'bad' }
              } },
            { t: 'read', title: 'One offer, once', body: [
              "Back to needing all three. This time you try something different: one public offer, say £5 a unit, and a firm commitment that you'll make no other.",
              "Each distributor compares £5 with the £0 it gets from scrap, and accepts. You get the best price of all, without any competition. That's <b>commitment</b> (Course 2 goes deeper): change the rules and you change the outcome.",
              "Commitment comes in two flavours. Positive: “give me that price and the business is definitely yours.” Negative: “if not, you're definitely out.” It only works if it's believed."
            ] },
            { t: 'slider', title: 'Take it or leave it', prompt: "You need all three distributors and make one offer, once, for all 30,000 units. Find an offer that keeps nearly all of the £100 for you.",
              inputs: [ { id: 'offer', label: 'Your one offer per unit', min: 0, max: 60, step: 1, value: 50, prefix: '£' } ],
              outputs: [
                { id: 'theirs', label: 'Each distributor gets per unit (scrap pays £0)', expr: 'offer', prefix: '£' },
                { id: 'margin', label: 'Your margin per unit', expr: '100 - offer', prefix: '£' },
                { id: 'total', label: 'Your total margin on 30,000 units', expr: '30 * (100 - offer)', prefix: '£', suffix: 'k' }
              ],
              goal: { expr: 'offer >= 1 && offer <= 10', text: 'Make an offer between £1 and £10.' },
              explain: "In theory, any offer above zero beats scrap, so a believed take-it-or-leave-it offer at £5 earns you £2.85m against £1.5m at £50. In practice, people turn down offers that feel insulting even when they'd gain (Course 4 shows why), so the very lowest numbers carry risk." },
            { t: 'choice', title: 'What changed?', q: "Between needing all three distributors and needing only two, what changed?",
              options: [
                { text: "The distributors' costs", why: "Costs and fallbacks were identical in both situations." },
                { text: "The retailer's value", why: "Still £100 a unit." },
                { text: 'One distributor became surplus, so each feared being the one left out', ok: true, why: "Right. Competition, not cost, moved the price. That's why it's the strongest of all bargaining factors, and why it's usually missing in one-to-one deals." },
                { text: 'The retailer negotiated harder', why: "Maybe, but the structure did most of the work." }
              ] },
            { t: 'choice', title: 'Why accept £5?', q: "A distributor gets a single, committed offer of £5 a unit. Why does a rational distributor accept?",
              options: [
                { text: "£5 beats the £0 from scrap, and there's no second offer coming", ok: true, why: "Right. The commitment removes the option of waiting for a better deal. All of this relied on knowing their fallback was £0. Take that knowledge away and things get much harder, which is the next lesson." },
                { text: 'Distributors always accept the first offer', why: "They don't. In the first situation they held out for about £50." },
                { text: "It's afraid of the other distributors", why: "You need all three here, so there's no competition between them." }
              ] },
            { t: 'summary', points: [
              "Needing every supplier hands them power. Needing one fewer creates competition.",
              "A credible take-it-or-leave-it offer can beat competition.",
              "Both rely on knowing the other side's fallback."
            ] }
          ]
        },
        {
          id: 'what-they-know', title: 'What they know, what you know', minutes: 14, kind: 'Game',
          steps: [
            { t: 'read', title: 'A secret slip', body: [
              "You're the buyer. A part is worth <b>100</b> to you. The seller's cost is either <b>22</b> or <b>78</b>, and only the seller knows which. You've no idea, and it isn't going to tell you.",
              "When both sides know the cost, deals tend to split the gap: in classroom runs, about <b>61</b> when the cost is 22 and about <b>89</b> when it's 78.",
              "Hide the cost from the buyer and the low-cost seller simply acts high-cost. The price lands near <b>88</b> whatever the true cost, and the low-cost seller pockets about 27 extra. Hide everything from everyone and talks can break down even when a deal would help both."
            ] },
            { t: 'dialogue', title: 'The seller with a secret', prompt: "You don't know the seller's cost. Unknown to you, it's 22. Get the best price you can.",
              them: 'The seller', start: 'a',
              nodes: {
                a: { say: "Our price is 95. Material costs have gone through the roof this year.", options: [
                  { text: "Before we talk price: our cost engineers put this part at 20 to 30 to make. Walk me through your cost build-up.", next: 'c', score: 2, note: "You've brought your own facts. A should-cost estimate takes away the cover of the secret." },
                  { text: "Let's meet in the middle at 85.", next: 'b', score: 1, note: "Splitting the difference from their opening lets their number set the scale." },
                  { text: "Understood. 95 it is.", next: 'lose', score: 0, note: "Cheap talk: a claim that cost them nothing to make, and you paid for it." }
                ] },
                b: { say: "We could just about stretch to 88, given our costs.", options: [
                  { text: "Show me those costs first. Our own estimate is far lower.", next: 'c', score: 2, note: "Good recovery. Ask them to prove the claim rather than take it on trust." },
                  { text: "Fine, 88.", next: 'meh', score: 0, note: "That's the classroom result without information: 27 more than with it." }
                ] },
                c: { say: "Well... our figure may have been cautious. What did you have in mind?", options: [
                  { text: "Given your costs, 55.", next: 'd', score: 2, note: "A number anchored on their cost, not their opening, and you haven't said what the part is worth to you." },
                  { text: "Tell me your lowest price.", next: 'e', score: 1, note: "It hands them the chance to set a fresh anchor." }
                ] },
                d: { say: "We can't go below 62.", options: [
                  { text: "Meet at 60 and we sign today.", next: 'win', score: 2, note: "A small step in return for a firm close." },
                  { text: "This part is worth 100 to us, so 62 is fine.", next: 'leak', score: 0, note: "Never reveal your valuation. Next year's talks will start from it." }
                ] },
                e: { say: "Our lowest would be 75.", options: [
                  { text: "That's well above your cost. 60, and we sign today.", next: 'win', score: 2, note: "Back on your facts." },
                  { text: "All right, 75.", next: 'meh2', score: 1, note: "Better than 88, but their anchor still did a lot of work." }
                ] },
                win: { end: true, say: "Fine. 60 it is.", result: "You paid 60, close to the full-information price of about 61. The should-cost estimate was worth almost 30 a part.", verdict: 'good' },
                leak: { end: true, say: "62 it is. Good to know what it's worth to you.", result: "A decent price at 62, but you gave away your valuation. Expect it to come back at you.", verdict: 'ok' },
                meh2: { end: true, say: "Pleasure.", result: "You paid 75 for a part that cost 22 to make.", verdict: 'ok' },
                meh: { end: true, say: "A fair deal for both of us.", result: "You paid 88, the classroom price without information. The seller kept about 27 extra.", verdict: 'bad' },
                lose: { end: true, say: "Thank you. We'll send the contract over.", result: "You paid 95 for a part that cost 22. The secret was worth 34 to them.", verdict: 'bad' }
              } },
            { t: 'choice', title: 'Who gained from the secret?', q: "Without the facts you'd typically pay about 88 to a seller whose cost was 22. With them, about 61. Who gained from the secret?",
              options: [
                { text: 'Nobody, prices are prices', why: "The part and the cost were the same. Only the information changed, and the price moved by 27." },
                { text: 'The seller, by about 27', ok: true, why: "Right: 88 instead of 61. That's the value of the information you were missing." },
                { text: 'You, because you got the part', why: "You'd have got it with the facts too, for 27 less." }
              ] },
            { t: 'read', title: 'How to get information back', body: [
              "The side without information loses. You can win it back with <b>should-cost</b> engineers who know what things cost to make, or with designs that make the other side reveal it (next lesson, and Courses 6 and 8).",
              "A buyer shortlisted three suppliers for a complex service. Two dropped out on quality. The last one didn't know it was alone, and the buyer made sure no word leaked. It cut its price significantly. How much competition there is counts as strategic information too.",
              "A café chain's incumbent says only it can supply filters for the chain's coffee machines. The chain neither confirms nor denies, keeps its engineers and managers quiet, tests a compatible filter, then lets it be known it has options."
            ] },
            { t: 'sort', title: 'Share it or keep it?', prompt: "You're about to meet a supplier. Sort each piece of information.",
              buckets: ['Share (strategically)', 'Keep to yourself'],
              items: [
                { text: 'Your walk-away price', bucket: 1, why: "Never. Not even after the deal is done. Next year's negotiation remembers." },
                { text: "That you've qualified an alternative supplier", bucket: 0, why: "It strengthens you, so let them know." },
                { text: 'That your launch date is fixed and close', bucket: 1, why: "It's a deadline they can use against you." },
                { text: 'Your volume forecast, in exchange for a price commitment', bucket: 0, why: "Trade information, don't donate it." },
                { text: 'That the other two bidders dropped out', bucket: 1, why: "How much competition there is counts as strategic information." },
                { text: "Your engineers' honest view that their product is the best", bucket: 1, why: "One channel, one message. That view weakens you if it leaks." }
              ] },
            { t: 'read', title: 'Rules for the flow', body: [
              "One named person talks to the other side. Everyone else is briefed. Information leaks through timing, tone, body language and side conversations, and different messages from different departments destroy your credibility.",
              "Their information: gather all you can, ask what their actions reveal, be wary of <b>cheap talk</b> (claims that cost nothing to make), and reward honest sharing.",
              "Your information: don't reveal your interests or targets without reason. Share what strengthens you. Trade it, don't donate it. Sometimes saying nothing beats saying too much, so prepare answers to the hard questions."
            ] },
            { t: 'choice', title: 'One voice', q: "Your engineer, your finance lead and your buyer all speak to the supplier this week. What's the risk?",
              options: [
                { text: 'None, more contact builds the relationship', why: "Relationships matter, but three uncoordinated voices give away far more than they build." },
                { text: 'Mixed messages, and the supplier learns your true position from the weakest link', ok: true, why: "Right. One voice to the other side, everyone else briefed." },
                { text: 'Only that it takes longer', why: "Time is the least of it. The real cost is what leaks." }
              ] },
            { t: 'summary', points: [
              "The side with less information usually loses.",
              "Never give away your valuation or walk-away point. Trade information, don't donate it.",
              "One voice to the other side."
            ] }
          ]
        },
        {
          id: 'screening-menus', title: 'Make them reveal it: screening menus', minutes: 10, kind: 'Game',
          steps: [
            { t: 'read', title: "Everyone says they're expensive", body: [
              "A supplier's unit cost is either <b>10</b> (low-cost) or <b>12</b> (high-cost). Only the supplier knows which, and it has every reason to keep that to itself.",
              "Ask directly and every supplier says 12. Offer a single price and you can't go below 12 without losing the high-cost supplier altogether. So you end up paying 12 to everyone, even the ones whose cost is 10."
            ] },
            { t: 'read', title: 'Offer a menu instead', body: [
              "Instead of one price, offer two contracts and let the supplier pick whichever it likes. <b>Small:</b> 50 units at 13. <b>Large:</b> 200 units at 11.",
              "On the small one, a high-cost supplier makes 50 × (13 - 12) = 50, and a low-cost one makes 50 × 3 = 150. On the large one, a high-cost supplier makes 200 × (11 - 12) = -200, and a low-cost one makes 200 × 1 = 200.",
              "Each type should pick the contract built for it, and by picking, reveal its cost. Don't take that on trust: play the supplier now, once as each type, and see which contract you'd choose."
            ] },
            { t: 'choice', title: "You're the low-cost supplier", q: "Your cost is 10. Which contract do you pick?",
              options: [
                { text: 'Small: 50 units at 13', why: "That makes you 150. The large one makes you 200." },
                { text: 'Large: 200 units at 11', ok: true, why: "Right. 200 beats 150. And by picking it, you've just told the buyer your cost is 10." }
              ] },
            { t: 'choice', title: "You're the high-cost supplier", q: "Your cost is 12. Which contract do you pick?",
              options: [
                { text: 'Small: 50 units at 13', ok: true, why: "Right. 50 profit beats a 200 loss." },
                { text: 'Large: 200 units at 11', why: "At a cost of 12, you'd lose 1 on every one of 200 units: -200." }
              ] },
            { t: 'slider', title: 'Design the menu', prompt: "You're the buyer now. The small contract stays at 50 units for 13. Set the large-lot price so the menu separates the two types, as cheaply as you can.",
              inputs: [ { id: 'p', label: 'Large-lot price (200 units)', min: 9, max: 13, step: 0.25, value: 12.5, prefix: '£' } ],
              outputs: [
                { id: 'lowLarge', label: 'Low-cost profit on the large lot (small lot: 150)', expr: '200 * (p - 10)' },
                { id: 'highLarge', label: 'High-cost profit on the large lot (small lot: 50)', expr: '200 * (p - 12)' },
                { id: 'saving', label: 'Your saving vs paying 12 on all 200 units', expr: '200 * (12 - p)' }
              ],
              goal: { expr: 'lowLarge >= 150 && highLarge <= 50 && p <= 11', text: 'Low-cost picks large, high-cost does not, at a price of 11 or less.' },
              explain: "The low-cost type takes the large lot only if 200 × (p - 10) is at least 150, so p must be at least 10.75. The high-cost type stays away only if 200 × (p - 12) is no more than 50, so p can be at most 12.25. Anything between separates them; 11 is a sensible round number with a margin of safety." },
            { t: 'choice', title: 'What did the choice reveal?', q: "A supplier picks 200 units at 11. What do you now know?",
              options: [
                { text: 'Its cost is 10', ok: true, why: "Right. A supplier with a cost of 12 would lose 200 on that contract. Only the low-cost type takes it." },
                { text: 'Its cost is 12', why: "At a cost of 12, the large lot loses money. It would have picked the small one." },
                { text: 'Nothing, it just likes volume', why: "Volume at a loss is no use to anyone. The choice gives the type away." }
              ] },
            { t: 'choice', title: 'Too greedy', q: "You cut the large-lot price to 10.5. What happens?",
              options: [
                { text: 'The low-cost supplier still takes it', why: "200 × 0.5 = 100, less than the 150 it makes on the small lot." },
                { text: "Both types take the small contract, and you've learned nothing", ok: true, why: "Right. Below 10.75 the menu stops separating. The truth has a price: the low-cost type must be left slightly better off than if it bluffed." },
                { text: 'The high-cost supplier takes it', why: "It would lose 300. It takes the small lot." }
              ] },
            { t: 'summary', points: [
              "A menu lets the other side reveal what it won't tell you.",
              "Each option must be the best choice for the type it's built for.",
              "Truth costs a little: leave the low-cost type slightly better off than if it bluffed."
            ] }
          ]
        }
      ]
    },
    {
      title: 'Alternatives, zones and clocks',
      lessons: [
        {
          id: 'best-alternative', title: 'Your best alternative', minutes: 13, kind: 'Concept',
          steps: [
            { t: 'read', title: 'What happens if you walk?', body: [
              "Your <b>BATNA</b> is your Best Alternative To a Negotiated Agreement: what you'll do if this deal doesn't happen. The better it is, the less you need them.",
              "Say you'd pay up to €1,000 and the seller will accept down to €500. Those are the two walk-away points. Split the gap 50:50 and the price is €750.",
              "Now you find an outside option at €700. Your walk-away point drops to €700, the new midpoint is €600, and you've gained €150 from an alternative you never use. (That assumes the seller has no alternative of its own.)"
            ] },
            { t: 'slider', title: 'BATNA slider', prompt: "Drag your outside option and watch the likely price. Then give the seller one too.",
              inputs: [
                { id: 'alt', label: 'Your outside option (€1,100 = none)', min: 400, max: 1100, step: 10, value: 1100, prefix: '€' },
                { id: 'salt', label: "Seller's outside option (€400 = none)", min: 400, max: 800, step: 10, value: 400, prefix: '€' }
              ],
              outputs: [
                { id: 'bw', label: 'Your walk-away point', expr: 'Math.min(1000, alt)', prefix: '€' },
                { id: 'sw', label: "Seller's walk-away point", expr: 'Math.max(500, salt)', prefix: '€' },
                { id: 'gap', label: 'Gap left to split', expr: 'bw - sw', prefix: '€' },
                { id: 'price', label: 'Likely price (50:50 split)', expr: '(bw + sw) / 2', prefix: '€' }
              ],
              goal: { expr: 'price <= 600 && gap >= 0', text: 'Get the likely price down to €600.' },
              explain: "At €700 your walk-away point drops and the price falls to €600. Now give the seller an option at €650: its walk-away point rises and the price climbs to €675. Both sides' alternatives move the split." },
            { t: 'choice', title: 'Read the slider', q: "Your outside option falls from €700 to €600. The seller's walk-away point is still €500. With a 50:50 split, what's the new price?",
              options: [
                { text: '€550', ok: true, why: "Right. The midpoint of €500 and €600." },
                { text: '€600', why: "That's your new walk-away point, not the split." },
                { text: '€650', why: "That's the midpoint of €500 and €800. Your walk-away point is now €600." },
                { text: '€750', why: "That's the price with no outside option at all." }
              ] },
            { t: 'read', title: 'Always ask who else', body: [
              "A chip company found the perfect joint-venture partner and was ready to sign. Its adviser asked: who else could we partner with? It didn't look. The partner's other suitor did, used the talks as leverage elsewhere, and got a far better deal.",
              "Try this test: is there a supplier you wouldn't use even if they gave you the product free? If not, why is it in your head as an alternative? And which others have you ruled out too fast?",
              "Raise your own: qualify other suppliers, design for flexible technology, hold stock. Lower theirs: bundle deals so losing you is bigger. Before the 1984-85 miners' strike, the UK government built up coal stocks, taking away the union's best lever. Watch the reverse too: Intel's “Intel Inside” campaign (from 1991) had buyers asking for Intel by name, so PC makers lost room to switch."
            ] },
            { t: 'sort', title: 'Raise mine or lower theirs?', prompt: "Sort each move by what it does to the balance of alternatives.",
              buckets: ['Raises your BATNA', 'Lowers their BATNA'],
              items: [
                { text: 'Qualify a second supplier', bucket: 0, why: "You now have somewhere else to go." },
                { text: 'Bundle three contracts into one negotiation', bucket: 1, why: "Losing you now costs them much more." },
                { text: 'Hold three months of safety stock', bucket: 0, why: "You can survive a stand-off, so walking away becomes real." },
                { text: "Offer a four-year contract they'd hate to lose", bucket: 1, why: "Their alternative to your deal looks worse by comparison." },
                { text: 'Redesign the part so two technologies fit', bucket: 0, why: "More suppliers can now serve you." },
                { text: 'Become their biggest customer in a shrinking market', bucket: 1, why: "They'd struggle to replace your revenue." }
              ] },
            { t: 'read', title: 'A threat they believed', body: [
              "A kitchen-appliance maker's supplier earned a fee on every unit sold, on top of cost plus margin. A large exit penalty protected the deal, so switching looked impossible.",
              "The maker's leadership credibly backed a next-generation range, due in 18 months and different enough to fall outside the contract. Facing being phased out, the supplier accepted a longer contract without the fee.",
              "To size up their BATNA, ask: how easily could they replace our revenue? Is their market growing or shrinking? Are we a big fish for them? And remember: their BATNA is strategic information, and so is yours."
            ] },
            { t: 'choice', title: 'The salary version', q: "You earn £100k. A rival firm offers £80k for an equally good job. Your employer would have to pay £120k to replace you. What's your BATNA right now?",
              options: [
                { text: '£120k', why: "That's your employer's alternative, not yours. It tells you their walk-away point." },
                { text: '£100k in your current job', why: "That's the deal you're negotiating over, not the alternative to it." },
                { text: 'The £80k offer', ok: true, why: "Right. If talks fail, that's what you've got. Raising it, with new skills or flexibility on location, is how you raise your power." },
                { text: 'Searching the market', why: "That's a plan. It isn't an alternative until it has a number on it." }
              ] },
            { t: 'summary', points: [
              "Your alternative sets your floor, and so the outcome.",
              "Raise yours and lower theirs, long before the meeting.",
              "Both BATNAs are strategic information."
            ] }
          ]
        },
        {
          id: 'finding-the-zopa', title: 'Finding the zone: ZOPA', minutes: 12, kind: 'Concept',
          steps: [
            { t: 'read', title: 'Mark both lines', body: [
              "For each side, from best to worst: the <b>opening ask</b> (where you start), the <b>target</b> (what you realistically aim for), the <b>walk-away point</b> (the worst deal you'd still sign), and beyond that, your BATNA.",
              "The <b>ZOPA</b>, or Zone Of Possible Agreement, is the range between the two walk-away points. If they overlap, a deal is possible somewhere inside. If they don't, no amount of charm will close it: change the deal or walk.",
              "You'll have to estimate their walk-away point. A best guess beats no guess, and doing the exercise forces you to decide what you really need and what you're merely hoping for."
            ] },
            { t: 'choice', title: 'Payment terms', q: "You open at 120 days and won't accept fewer than 60. The supplier opens at 30 days and won't accept more than 70. Where's the ZOPA?",
              options: [
                { text: '30 to 120 days', why: "Those are the opening asks. The zone sits between the walk-away points." },
                { text: '60 to 70 days', ok: true, why: "Right. You need at least 60; they'll give at most 70. Any deal in between works for both." },
                { text: "There isn't one", why: "60 is below 70, so the walk-away points overlap." }
              ] },
            { t: 'choice', title: 'Price', q: "You open at a 10% price cut and need at least 8%. The supplier opens at 1% and will give at most 4%. What now?",
              options: [
                { text: 'Split the difference at 6%', why: "6% is below your walk-away point of 8%. You'd be signing a deal you said you wouldn't." },
                { text: "There's no ZOPA: find another lever, like a longer contract or more volume, or escalate", ok: true, why: "Right. 8% needed, 4% offered: no overlap. Something about the deal has to change." },
                { text: 'Keep pushing, they always have more room', why: "Maybe your estimate is wrong, but if it's right, charm won't close a 4-point gap." }
              ] },
            { t: 'slider', title: 'ZOPA checker', prompt: "Warranty length. You need at least 24 months; your best guess is the supplier will give at most 18. Find a way to create a ZOPA.",
              inputs: [
                { id: 'mine', label: 'Your walk-away point (least you accept)', min: 12, max: 36, step: 1, value: 24, suffix: ' months' },
                { id: 'theirs', label: 'Their walk-away point (most they give)', min: 12, max: 36, step: 1, value: 18, suffix: ' months' }
              ],
              outputs: [
                { id: 'overlap', label: 'Overlap (negative means no ZOPA)', expr: 'theirs - mine', suffix: ' months' },
                { id: 'mid', label: 'Midpoint of the two walk-away points', expr: '(mine + theirs) / 2', suffix: ' months', decimals: 1 }
              ],
              goal: { expr: 'overlap >= 0', text: 'Make the overlap zero or more.' },
              explain: "With 24 against 18 there's no ZOPA. Either they move to 24 or you drop to 18, and usually something else is traded to make that happen, such as a longer contract for a longer warranty. A thin or missing zone also tells you the talks will need a firmer line." },
            { t: 'choice', title: 'Is there a deal?', q: "You need delivery within 10 days at the latest; you'd love 5. The supplier can do 8 at best and would prefer 14. Is there a ZOPA?",
              options: [
                { text: 'Yes, 8 to 10 days', ok: true, why: "Right. They can do 8 at best, and you'll accept up to 10." },
                { text: 'Yes, 5 to 14 days', why: "Those are the opening asks, not the limits." },
                { text: 'No', why: "8 is inside your limit of 10, so there's an overlap." }
              ] },
            { t: 'read', title: 'The sealed envelope', body: [
              "Splitting the difference works when both sides are in a hurry: a fair-looking midpoint is hard to reject. If you're not in a hurry, firm rejections and patient counter-offers can pull the midpoint your way. But an unreasonable offer can take the split off the table altogether.",
              "An employer and a union had years of long, low-trust wage talks that always ended the same way. So they redesigned the process. Both agreed the three or four issues that really mattered, and each privately gave its walk-away point on each to a notary.",
              "The notary reports only overlap or no overlap on each issue. If every issue overlaps, they conclude fast. If not, they carry on as usual, and nobody has revealed their limit."
            ] },
            { t: 'sort', title: 'What the notary sees', prompt: "You're the employer. Sort each issue by what the notary reports back.",
              buckets: ['Overlap: settle now', 'No overlap: keep talking'],
              items: [
                { text: "Pay rise: you'll give up to 4%; they'll accept 3%", bucket: 0, why: "3% to 4% overlaps. The notary can settle it, say at 3.5%." },
                { text: "Weekly hours: you need at least 38; they'll accept at most 37", bucket: 1, why: "38 is more than 37. No zone, so this one goes back to the table." },
                { text: "Overtime rate: you'll pay up to 1.5x; they need at least 1.25x", bucket: 0, why: "1.25x to 1.5x overlaps." },
                { text: "Holiday: you'll give at most 25 days; they need 27", bucket: 1, why: "25 is less than 27. No overlap." }
              ] },
            { t: 'choice', title: 'Why a notary?', q: "What does the sealed envelope achieve that open haggling doesn't?",
              options: [
                { text: 'It finds out whether a deal exists without either side revealing its limit', ok: true, why: "Right. The notary only reports overlap or no overlap. Nobody ever sees the other side's number." },
                { text: 'It forces both sides to accept the midpoint of their opening asks', why: "It works on walk-away points, not openings, and only settles issues that overlap." },
                { text: "It's cheaper", why: "Perhaps, but that's not the point. The point is protecting each side's limit." }
              ] },
            { t: 'summary', points: [
              "The ZOPA is the overlap between the two walk-away points.",
              "Check it issue by issue: some will have none.",
              "There are ways to find the overlap without showing your hand."
            ] }
          ]
        },
        {
          id: 'clocks-and-focal-points', title: 'Clocks and focal points', minutes: 12, kind: 'Concept',
          steps: [
            { t: 'read', title: 'Cost £8, ceiling £24', body: [
              "A buyer and a supplier both know a part costs <b>£8</b> to make. The buyer won't pay more than <b>£24</b>, or the product won't get built.",
              "Nobody else is involved, there's no competition, and both sides know every number. Before you read on, predict where the price will land. There's no right answer yet."
            ] },
            { t: 'slider', title: 'Price predictor', prompt: "Set your prediction for the agreed price.",
              inputs: [ { id: 'guess', label: 'Your predicted price', min: 8, max: 24, step: 1, value: 20, prefix: '£' } ],
              outputs: [
                { id: 'sup', label: "Supplier's margin per part", expr: 'guess - 8', prefix: '£' },
                { id: 'buy', label: "Buyer's saving against its ceiling", expr: '24 - guess', prefix: '£' }
              ],
              explain: "Most people pick £16: split the £16 pie down the middle, £8 each. That's a focal point at work, the same pull you saw in the demand game." },
            { t: 'choice', title: 'The £10 component', q: "Now the buyer learns that a similar component, useless for this project, sells for £10. In workshops, where do prices tend to go?",
              options: [
                { text: 'Nowhere: the component is irrelevant', why: "It should be. But in workshops it isn't." },
                { text: 'Towards £10', ok: true, why: "Right. A number nobody should care about becomes the reference point. Some outcomes pull harder than any model predicts, through tradition or a sense of fairness." },
                { text: 'Up towards £24', why: "The new number is low, and it drags the price down, not up." }
              ] },
            { t: 'read', title: 'Plant the first number', body: [
              "Focal points in buying include should-cost estimates, last year's price, input-price movements, inflation, benchmarks and a savings target like “double-digit cost-down”. Use justifiable ones to focus the talk, and watch for the ones the other side sets. Once given, they're hard to remove.",
              "Unless you're buying something completely new to you, there's a real first-mover advantage. Put your stick in the ground and make them argue you away from it. Too low and they're insulted; too high and they accept at once. Know your should-cost.",
              "When you don't know the value, be careful. A farmer has an old painting in his barn; a passing collector sees a valuable work by a known artist. The collector can safely open low. The farmer, naming a price first, could ask for far too little."
            ] },
            { t: 'choice', title: 'Who should open?', q: "You're buying the same packaging as last year, from the same supplier, and you know its cost structure well. Who should make the first offer?",
              options: [
                { text: 'You should: plant a well-argued number first', ok: true, why: "Right. You know a lot, so your first credible number becomes the reference everyone argues from." },
                { text: 'Them: let them reveal their position', why: "That works when you know nothing. Here you know a lot." },
                { text: "It doesn't matter", why: "It does. The first credible number becomes the focal point." }
              ] },
            { t: 'choice', title: 'The index push', q: "A supplier says its logistics index rose from 100 to 103, so its price must rise 3%. Best response?",
              options: [
                { text: 'Accept; indices are objective', why: "Suppliers don't buy at index prices, so you shouldn't pay index prices." },
                { text: 'Ask for its actual cost build-up, and point out that index averages include firms less efficient than it', ok: true, why: "Right. Its costs come from its own buying, and many firms beat the index. Ask for “index minus x%”." },
                { text: 'Refuse any discussion', why: "Push back with facts, but don't shut the door." }
              ] },
            { t: 'read', title: 'Clocks, deadlines and six rules', body: [
              "Timing is a lever. Are costs moving your way? Is either company near year-end or results day? Is either negotiator chasing a target? Salespeople near financial year-end get keener, and firms filling capacity early in a season concede more.",
              "A deadline helps the side less hurt by no deal, and only if it's believed. One that has been extended three times teaches everyone it's soft. Set deadlines you'll keep, and line them up with your story, such as a contract expiry.",
              "The six rules of bargaining: <b>enlarge</b> the pie; <b>acquire information</b> and reward its revelation; <b>provide incentives</b> with “if-then” offers; <b>commit</b> to clear rules; <b>improve your BATNA</b>; and <b>increase competition</b> wherever you can."
            ] },
            { t: 'sort', title: 'Pull forward or wait?', prompt: "Sort each situation by when you'd rather negotiate.",
              buckets: ['Negotiate sooner', 'Negotiate later'],
              items: [
                { text: 'Raw material prices are falling and analysts expect more falls', bucket: 1, why: "Let the trend do some of your work, then open with a fact-based price-down story." },
                { text: "The supplier's financial year ends in three weeks", bucket: 0, why: "Their deadline pressure works for you now, not after year-end." },
                { text: "You'll have a second supplier qualified in four months", bucket: 1, why: "Your BATNA is about to get much better. Wait for it." },
                { text: 'Their biggest rival has just announced spare capacity', bucket: 0, why: "Your alternatives just got better. Use it before that capacity fills." },
                { text: 'A large new project you could bundle in starts next quarter', bucket: 1, why: "Tie the talks to the project so there's more at stake for them." }
              ] },
            { t: 'summary', points: [
              "Focal points and first offers set the reference everyone argues from.",
              "Timing is a lever: theirs and yours.",
              "Six rules: enlarge, inform, incentivise, commit, improve your BATNA, compete."
            ] }
          ]
        }
      ]
    }
  ],
  exam: { pass: 7, questions: [
    { q: "A hospital renegotiates with its cleaning contractor of ten years. Other contractors exist, but switching would be messy. This is best described as:",
      options: ['A monopoly negotiation', 'A bilateral negotiation with alternatives', 'A multilateral tender', 'A game with no alternatives'], answer: 1,
      why: "Two parties at the table, but other contractors exist. Messy isn't impossible." },
    { q: "In the demand game, two players each claim a share of 100 points. Which pair of demands is NOT a Nash equilibrium?",
      options: ['20 and 80', '50 and 50', '40 and 40', '65 and 35'], answer: 2,
      why: "At 40/40 either player could ask for 60 and still be paid. Pairs that add up to exactly 100 are equilibria." },
    { q: "An extended warranty costs a supplier £300 and is worth £700 to you. You agree a price of £600. How is the pie split?",
      options: ['You gain £100, the supplier £300', 'You gain £300, the supplier £100', 'You each gain £200', 'Neither gains'], answer: 0,
      why: "The pie is 700 - 300 = 400. You get 700 - 600 = 100; they get 600 - 300 = 300." },
    { q: "A buyer needs 4 of 5 equally placed suppliers instead of all 5. What usually happens to the price?",
      options: ['It rises, because the buyer looks desperate', 'It barely changes', 'It falls sharply, because each supplier fears being the one left out', 'It becomes random'], answer: 2,
      why: "One spare seat creates competition." },
    { q: "Why does a committed take-it-or-leave-it offer work when every supplier's fallback is zero?",
      options: ['Suppliers like simple offers', "Any positive offer beats the fallback, and there's no better offer to wait for", "It's illegal to reject it", 'It creates competition among suppliers'], answer: 1,
      why: "Commitment removes the option of holding out." },
    { q: "A seller knows its cost is low; you don't. What's the most likely result of open haggling?",
      options: ['A fair split of the true gap', 'The seller acts like a high-cost type and captures most of the gap', 'You get the lowest possible price', 'The seller reveals its cost to be helpful'], answer: 1,
      why: "Hidden information goes to whoever holds it, unless you build an incentive to reveal it." },
    { q: "You offer two contracts: 100 units at £9, or 400 units at £7.50. A supplier with a cost of £6 should choose:",
      options: ['100 at £9 (profit £300)', '400 at £7.50 (profit £600)', "Either, they're equal", 'Neither'], answer: 1,
      why: "300 against 600. A screening menu works when each type's best option is the one built for it." },
    { q: "Your walk-away point is £50k. You find a credible alternative at £44k. With an even split and the supplier's walk-away point at £30k, how does the expected price move?",
      options: ['From £40k to £37k', 'From £40k to £44k', 'From £50k to £44k', "It doesn't move"], answer: 0,
      why: "The midpoint of 30 and 50 is 40; of 30 and 44 it's 37." },
    { q: "As the buyer you want long payment terms and won't accept fewer than 45 days. The supplier won't accept more than 40. What should you do?",
      options: ['Push harder, a ZOPA must exist', "Recognise there's no ZOPA on this issue and look for another lever or trade", 'Accept 40 days', 'Split at 42.5 days'], answer: 1,
      why: "45 is more than 40: no overlap. Something else about the deal has to change." },
    { q: "A supplier's salesperson is three weeks from their financial year-end bonus. What does the timing rule suggest?",
      options: ['Delay until next year', 'Their deadline pressure may work in your favour if you negotiate now', "Timing doesn't matter in one-to-one deals", 'Tell them you know about their bonus'], answer: 1,
      why: "Deadline pressure on the other side is a lever. Keep what you know to yourself." }
  ] }
});
