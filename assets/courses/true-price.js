/* Course 7: Apples and Pears: True Price. Built from training-library/courses/07-apples-and-pears.md */
(window.GAMBIT_COURSES = window.GAMBIT_COURSES || []).push({
  id: 'true-price', order: 7, track: 'Procurement', title: 'Apples and Pears: True Price', piece: 'rook',
  price: 9.89,
  status: 'live', level: 'Intermediate', minutes: 113,
  summary: 'Compare suppliers that aren\'t alike on one number, the True Price: credits and charges for every difference, whole-life cost in today\'s money, and a change price list that stops cost creep.',
  outcomes: [
    'Turn every difference between suppliers into credits and charges, so they compete on one True Price',
    'Classify a criterion as absolute or relative, fixed or variable, go or no-go',
    'Build a whole-life True Price with net present value and find several routes to a target',
    'Stop cost creep after the award with a change price list agreed before it'
  ],
  modules: [
    {
      title: 'One number to compete on',
      lessons: [
        {
          id: 'unequal-suppliers', title: 'Unequal suppliers and why scores fail', minutes: 10, kind: 'Concept', preview: true,
          steps: [
            { t: 'read', title: 'Apples and pears', body: [
              'Real suppliers are never alike. One has better quality, another makes a lighter part, a third won\'t accept your terms. Any tender has to handle that, or it ends up comparing apples with pears.',
              'There are three ways to compare. <b>Traffic lights</b> (red, amber, green) are quick, but how much is "amber" worth? <b>Scores</b> like 82/100 look precise and aren\'t. <b>Money</b> turns every difference into pounds, so you can add them up and compare.',
              'A score tells you who\'s better. Money tells you by how much, and whether it\'s worth paying for.'
            ] },
            { t: 'choice', title: 'Points or pounds?', q: 'Supplier X scores 82/100 at £10.00 a part. Supplier Y scores 74/100 at £9.40. Who\'s better value?',
              options: [
                { text: 'X, it scores higher', why: 'Higher, but is it 60p a part better? The score can\'t say.' },
                { text: 'Y, it\'s cheaper', why: 'Maybe, if the 8 points are worth less than 60p a part to you. You don\'t know that yet.' },
                { text: 'You can\'t tell until the 8 points are priced in money', ok: true, why: 'Right. Scores rank suppliers; they don\'t price the difference.' },
                { text: 'Average the score and the price', why: 'You can\'t average points and pounds. They\'re different units.' }
              ] },
            { t: 'read', title: 'What goes wrong without money', body: [
              'When differences aren\'t priced, the same things keep happening. Good suppliers get dropped on cost alone. Someone vetoes a supplier on a rumour. Suppliers are judged without the people who\'ll actually use the part. The award turns into an internal fight.',
              'The fix is one idea: <b>turn a "No" into a "Yes, if…"</b>. "We can\'t use them, their warranty\'s too short" becomes "We can use them if their price is £120k lower, which is what the shorter warranty costs us." More suppliers stay in, so the race gets harder.'
            ] },
            { t: 'sort', title: 'No, or yes if?', prompt: 'Sort each objection. Can it be priced, or is it a hard stop?',
              buckets: ['"No" stays "No"', '"Yes, if…"'],
              items: [
                { text: 'The supplier\'s warranty is 2 years; you wanted 3', bucket: 1, why: 'Price the risk of the missing year and add it as a charge.' },
                { text: 'The supplier has no approval to make safety-critical parts', bucket: 0, why: 'You can\'t price away a legal requirement.' },
                { text: 'Their factory is 400 miles further away', bucket: 1, why: 'Price the extra shipping.' },
                { text: 'They won\'t accept one clause of your terms', bucket: 1, why: 'Estimate what the clause is worth to you and charge it.' },
                { text: 'They failed the quality audit outright', bucket: 0, why: 'Below the minimum is a no-go until it\'s fixed.' }
              ] },
            { t: 'read', title: 'The Ruler', body: [
              'Everything in this course builds the <b>Ruler</b>, the second part of Race, Ruler, Rulebook from Course 6: one measure that compares every supplier like for like.',
              'The Ruler is money. In the next lesson you\'ll see the single number it produces, and what happens when suppliers bid on it.'
            ] },
            { t: 'summary', points: ['Suppliers differ, and price alone can\'t compare them.', 'Scores rank suppliers but don\'t price the difference.', 'Money turns "No" into "Yes, if…", which keeps more suppliers in the race.'] }
          ]
        },
        {
          id: 'true-price-formula', title: 'True Price', minutes: 12, kind: 'Game',
          steps: [
            { t: 'read', title: 'One number to compete on', body: [
              '<b>True Price = quoted price + charges - credits.</b> A <b>charge</b> pushes a supplier\'s price up for comparison, because something about it costs you. A <b>credit</b> pulls it down, because it\'s worth more to you.',
              'An example: a quoted price of £100, plus a £3 charge for slow payment terms, plus a £2 charge for extra work your team would need, minus a £4 credit for better quality. The True Price is £101.',
              'You pay the quoted price. You compare on the True Price. The lowest True Price wins.'
            ] },
            { t: 'read', title: 'A price clock on True Price', body: [
              'You can run an auction on it. In a falling-price auction, a price clock ticks down, and the price on the clock is the <b>True Price</b>. Each supplier\'s actual price is the clock plus its credit, or minus its charge.',
              'Say the clock stands at £100. Supplier A has a £5 credit (cables already fitted), so A would be paid £105. Supplier B has a £10 charge (it needs extra technical support), so B would be paid £90.',
              'So B only wins if its actual price is more than £15 below A\'s: its own £10 charge plus A\'s £5 credit.'
            ] },
            { t: 'slider', title: 'Run the clock', prompt: 'A has a £5 credit and a walk-away price of £95. B has a £10 charge and a walk-away of £72. Lower the clock in £5 steps.',
              inputs: [ { id: 'clock', label: 'Price on the clock (True Price)', min: 70, max: 120, step: 5, value: 120, prefix: '£' } ],
              outputs: [
                { id: 'aPaid', label: 'A would be paid', expr: 'clock + 5', prefix: '£' },
                { id: 'bPaid', label: 'B would be paid', expr: 'clock - 10', prefix: '£' },
                { id: 'aRoom', label: 'A\'s room above its walk-away', expr: 'aPaid - 95', prefix: '£' },
                { id: 'bRoom', label: 'B\'s room above its walk-away', expr: 'bPaid - 72', prefix: '£' }
              ],
              goal: { expr: 'aRoom < 0 && bRoom >= 0', text: 'Find the clock price where A drops out but B is still in.' },
              explain: 'A\'s floor on the clock is £95 - £5 = £90. B\'s is £72 + £10 = £82. At £85, A would have to supply at £90, below its walk-away, so it drops out. B accepts £85 and wins at an actual price of £75, £3 above its walk-away. One more step, to £80, and B would be paid £70: too low for B too.' },
            { t: 'choice', title: 'The gap', q: 'A has a £5 credit and B a £10 charge. A quotes £105. To win, B must quote less than…',
              options: [
                { text: '£105', why: 'That ignores both adjustments.' },
                { text: '£95', why: 'That accounts only for B\'s charge, not A\'s credit.' },
                { text: '£90', ok: true, why: 'Right. A\'s True Price is £105 - £5 = £100. B needs a True Price under £100, so a quote under £100 - £10 = £90.' },
                { text: '£80', why: 'You\'ve counted the credit twice.' }
              ] },
            { t: 'read', title: 'A footnote from theory', body: [
              'A buyer purely out to pay as little as possible would give quality differences a little less weight than they\'re truly worth, to make the race tighter. That\'s the optimal-auction idea in Course 9, lesson 3.',
              'In this course we use the honest value. It\'s simpler to defend, and it picks the supplier who really is best for you.'
            ] },
            { t: 'summary', points: ['True Price = quoted price + charges - credits.', 'Suppliers compete on True Price but are paid their quoted price.', 'The gap one supplier must beat equals the sum of both suppliers\' adjustments.'] }
          ]
        },
        {
          id: 'pricing-the-difference', title: 'Pricing the difference: four steps', minutes: 10, kind: 'Concept',
          steps: [
            { t: 'read', title: 'Four steps, one rule', body: [
              'Building the credits and charges is called <b>pricing the difference</b>. It has four steps: <b>list, separate, price, publish</b>.',
              '<b>List:</b> each team names its must-haves and its goals, and workshops turn them into measurable criteria. <b>Separate:</b> check each criterion spots a real difference between suppliers, and that no two overlap. <b>Price:</b> each team sets the logic and baseline for its criteria. <b>Publish:</b> everyone who could veto signs the Rulebook.',
              'Every criterion must spot a real difference, and no difference gets counted twice.'
            ] },
            { t: 'read', title: 'Who sits at the table', body: [
              'Expect 4-8 weeks, depending on how complex the purchase is, and usually 4-8 sessions. One team at a time is quicker than everyone in one room.',
              'The teams are buying, engineering, product, finance, quality and logistics. Engineering often gives the most input. The buying team\'s job is to check every criterion is valued fairly and the same way for every supplier.'
            ] },
            { t: 'choice', title: 'Spot the overlap', q: 'Which two criteria are pricing the same thing?',
              options: [
                { text: 'Payment terms and shipping distance', why: 'One is cash timing, the other is transport cost. Distinct.' },
                { text: 'Quality audit score and expected warranty claims', ok: true, why: 'Right. Both are a stand-in for defect risk. Price it once, or a weak supplier pays twice for the same problem.' },
                { text: 'Part weight and tooling cost', why: 'Different things: one runs for every part made, the other is a one-off.' },
                { text: 'Engineering support hours and payment terms', why: 'Distinct. One is your team\'s time, the other is cash timing.' }
              ] },
            { t: 'read', title: 'What suppliers get told', body: [
              'Suppliers get <b>only their total credits and charges</b>, with one exception: for any criterion they can still change, share the logic too. Then they know exactly what to improve.',
              'How many criteria? As many as it takes to be complete and distinct. Is there a cap on the total? No, as long as it truly reflects what the differences are worth to you.'
            ] },
            { t: 'sort', title: 'Logic or total?', prompt: 'For each criterion, what do you tell the supplier?',
              buckets: ['Share the logic', 'Share only the total'],
              items: [
                { text: 'A charge for not accepting your liability clause, which they could still accept', bucket: 0, why: 'They can act on it, so show them how it\'s priced.' },
                { text: 'A charge for the distance from their factory to yours', bucket: 1, why: 'They can\'t move the factory before award day.' },
                { text: 'A credit for a longer warranty, which they could still offer', bucket: 0, why: 'A lever they can pull, so share the logic.' },
                { text: 'A charge for unsettled claims on a past project', bucket: 1, why: 'History can\'t change now. Share the total only.' },
                { text: 'A charge for payment terms they could still improve', bucket: 0, why: 'They can still improve them, so tell them what each day is worth.' }
              ] },
            { t: 'summary', points: ['Pricing the difference: list, separate, price, publish.', 'Every criterion must be distinct; nothing gets counted twice.', 'Share the logic only where suppliers can still act on it.'] }
          ]
        }
      ]
    },
    {
      title: 'Putting a price on it',
      lessons: [
        {
          id: 'classifying-criteria', title: 'Classifying criteria', minutes: 12, kind: 'Concept',
          steps: [
            { t: 'read', title: 'Two questions per criterion', body: [
              '<b>Absolute or relative?</b> An absolute criterion is a sum of money: a quality band worth £80k a year. A relative one is a percentage of the supplier\'s price: refusing part of your terms costs you 1% of the contract.',
              '<b>Fixed or variable?</b> A fixed criterion is one the supplier can\'t influence during the tender. You set it beforehand and share only the total. A variable one, like offering a longer warranty, can still change, so you share the value and the logic.',
              'Is it a sum or a percentage? Can the supplier still change it? Most criteria turn out absolute and fixed.'
            ] },
            { t: 'sort', title: 'Sum, percentage or stop?', prompt: 'Is each criterion a sum of money, a percentage of the price, or a no-go?',
              buckets: ['Sum of money (absolute)', 'Percentage of price (relative)', 'No-go'],
              items: [
                { text: 'Weight above target', bucket: 0, why: 'Priced per kg over, so a sum of money.' },
                { text: 'Unsettled claims from a past project', bucket: 0, why: 'A known sum at stake.' },
                { text: 'Expected cost creep, from past experience with this supplier', bucket: 1, why: 'Creep grows with the contract, so it\'s a percentage of their price.' },
                { text: 'Partial acceptance of your terms', bucket: 1, why: 'Priced as a share of the contract.' },
                { text: 'Warranty length, which the supplier can extend', bucket: 0, why: 'Each extra year is worth a set sum to you.' },
                { text: 'No approval to make safety parts', bucket: 2, why: 'A legal requirement. No price fixes it.' }
              ] },
            { t: 'sort', title: 'Fixed or variable?', prompt: 'Can the supplier still change it before award day?',
              buckets: ['Fixed: share the total', 'Variable: share the logic'],
              items: [
                { text: 'Weight above target', bucket: 0, why: 'The design is set; it won\'t change before award day.' },
                { text: 'Extra features already in their product', bucket: 0, why: 'They\'re there or they aren\'t.' },
                { text: 'Expected cost creep from past experience', bucket: 0, why: 'Based on history, which they can\'t change on the day.' },
                { text: 'Partial acceptance of your terms', bucket: 1, why: 'They can accept more clauses at any time.' },
                { text: 'Warranty length they can extend', bucket: 1, why: 'A lever they can pull.' },
                { text: 'Payment terms they can still improve', bucket: 1, why: 'Another lever they can pull.' }
              ] },
            { t: 'read', title: 'Go, no-go, and the zero line', body: [
              '<b>No-go</b> criteria exclude: "No" stays "No" (no approval for the site, quality below the minimum) until the problem is fixed. <b>Go</b> criteria can be priced: "Yes, if…".',
              'Then pick the zero line. Measure everyone against the best supplier and everyone else gets a charge: negative feedback. Measure against the worst and everyone else gets a credit: positive feedback. You could also use the market standard, or your own expectation.',
              'Same ranking, different message. Lesson 7.6 shows why that message matters.'
            ] },
            { t: 'choice', title: 'The benchmark\'s message', q: 'You benchmark every supplier against your best one. What message does that send?',
              options: [
                { text: 'Everyone\'s good', why: 'That\'s what benchmarking against the worst says.' },
                { text: 'Everyone except the best has a gap to close', ok: true, why: 'Right. Every other supplier gets a charge, a signal to improve.' },
                { text: 'Nothing, the benchmark doesn\'t matter', why: 'The ranking doesn\'t change, but the message does.' },
                { text: 'The best supplier will win', why: 'Not necessarily. Price still counts.' }
              ] },
            { t: 'summary', points: ['Ask two questions: absolute or relative, fixed or variable.', 'No-go stays no; a go criterion becomes "Yes, if…".', 'Your choice of benchmark changes the message, not the ranking.'] }
          ]
        },
        {
          id: 'pricing-in-practice', title: 'Pricing criteria in practice', minutes: 14, kind: 'Game',
          steps: [
            { t: 'read', title: 'Rules you agree once', body: [
              'Standard rules save arguments. Three typical ones. <b>Terms (buying):</b> the estimated cost of the clauses refused, capped at 1.5% of the quoted price. If nobody can estimate it, a flat 0.5% <b>nudge charge</b>, a small charge for a gap that\'s real but hard to price.',
              '<b>Weight (engineering):</b> kg over target × £5 per kg × lifetime parts. <b>Quality index, 0-100 (quality):</b> below 60 is a no-go unless a quality review admits them; 60-74 is a £200k a year charge; 75-89 is £80k a year; 90 and above, no charge.',
              'Keep bands clean: the top band carries nothing, rather than a charge cancelled by a credit. Agree the rule before you see the suppliers, and the arguments are over before they start.'
            ] },
            { t: 'read', title: 'Three suppliers, one contract', body: [
              'A 4-year contract for 100,000 parts a year: <b>400,000 lifetime parts</b>. Each quoted price is the lifetime price in today\'s money (lesson 7.7 shows how).',
              '<b>Supplier A</b> quotes £10.00m, has a quality index of 92, is 0.10 kg over target and accepts all your terms. <b>Supplier B</b> quotes £9.60m, index 78, on target, and refuses your liability cap, which you estimate costs you 1%.',
              '<b>Supplier C</b> quotes £9.30m, index 64, is 0.05 kg under target (a £100k credit) and refuses two clauses nobody can put a cost on. Work them out.'
            ] },
            { t: 'choice', title: 'A\'s weight', q: 'Supplier A is 0.10 kg over target. What\'s its weight charge?',
              options: [
                { text: '£50k', why: 'That\'s one year of parts. The rule uses all 400,000 lifetime parts.' },
                { text: '£200k', ok: true, why: 'Right. 0.10 kg × £5 × 400,000 = £200k. With a quality index of 92 and all terms accepted, A\'s True Price is £10.00m + £0.2m = £10.200m.' },
                { text: '£20k', why: 'Check the zeros: 0.10 × 5 × 400,000 is 200,000.' },
                { text: '£500k', why: 'That\'s more than the rule gives. 0.10 × £5 × 400,000 = £200k.' }
              ] },
            { t: 'choice', title: 'C\'s terms', q: 'Supplier C refuses two clauses and nobody can estimate their cost. What\'s its terms charge?',
              options: [
                { text: '£46.5k, the 0.5% nudge charge', ok: true, why: 'Right. 0.5% × £9.30m = £46.5k. With a quality charge of £200k × 4 = £800k and the £100k weight credit, C\'s True Price is £9.30m + £0.8m - £0.1m + £0.0465m = £10.0465m.' },
                { text: '£139.5k, the 1.5% cap', why: 'The cap limits an estimate. When nobody can estimate, the rule is the flat 0.5%.' },
                { text: '£0, it can\'t be priced', why: 'That\'s exactly what the nudge charge is for: a real gap that\'s hard to price.' },
                { text: 'Exclude C', why: 'Refusing clauses is a go criterion. Price it, don\'t exclude.' }
              ] },
            { t: 'choice', title: 'Who wins?', q: 'B\'s charges are £80k × 4 = £320k for quality and 1% of £9.60m = £96k for terms. Who has the lowest True Price?',
              options: [
                { text: 'A, the best quality', why: 'A is last at £10.200m. Its weight charge sinks it.' },
                { text: 'B, at £10.016m', ok: true, why: 'Right. £9.60m + £0.32m + £0.096m = £10.016m, £30.5k ahead of C. The cheapest quote didn\'t win, and nobody had to veto anyone.' },
                { text: 'C, the cheapest quote', why: 'C\'s True Price is £10.0465m, £30.5k behind B.' },
                { text: 'It\'s a tie', why: 'Add each one up: A £10.200m, B £10.016m, C £10.0465m.' }
              ] },
            { t: 'choice', title: 'B moves', q: 'Supplier B now accepts your liability cap. What happens?',
              options: [
                { text: 'Nothing, terms are fixed', why: 'Terms are variable. B can still change them.' },
                { text: 'B\'s True Price falls by £96k to £9.92m and it pulls further ahead', ok: true, why: 'Right. Variable criteria are levers suppliers can pull before award day.' },
                { text: 'C wins', why: 'C\'s True Price is unchanged at £10.0465m.' },
                { text: 'B is excluded', why: 'Accepting terms helps. It doesn\'t exclude anyone.' }
              ] },
            { t: 'summary', points: ['Standard rules turn every team\'s concerns into pounds.', 'The cheapest quote often isn\'t the lowest True Price.', 'Variable criteria give suppliers a way to improve.'] }
          ]
        },
        {
          id: 'credit-or-charge', title: 'Credit or charge: does it matter?', minutes: 10, kind: 'Game',
          steps: [
            { t: 'read', title: 'Same sum, different feeling', body: [
              'You can give the better supplier a credit, or give the worse one a charge. On paper it makes no difference.',
              'Take two suppliers. A is worth £10 more to you than B. Their walk-away prices are A £70 and B £50. The clock falls in £10 steps on True Price.',
              'On paper a credit and a charge are twins. In a sealed bid, a credit can go to a supplier\'s head. First, the paper.'
            ] },
            { t: 'slider', title: 'Run it both ways', prompt: 'Set the framing (0 = a £10 credit for A, 1 = a £10 charge for B), then lower the clock. Try both.',
              inputs: [
                { id: 'clock', label: 'Price on the clock (True Price)', min: 40, max: 100, step: 10, value: 100, prefix: '£' },
                { id: 'frame', label: 'Framing: 0 credit for A, 1 charge for B', min: 0, max: 1, step: 1, value: 0 }
              ],
              outputs: [
                { id: 'aPaid', label: 'A would be paid', expr: 'clock + 10 * (1 - frame)', prefix: '£' },
                { id: 'bPaid', label: 'B would be paid', expr: 'clock - 10 * frame', prefix: '£' },
                { id: 'aRoom', label: 'A\'s room above its £70 walk-away', expr: 'aPaid - 70', prefix: '£' },
                { id: 'bRoom', label: 'B\'s room above its £50 walk-away', expr: 'bPaid - 50', prefix: '£' }
              ],
              goal: { expr: 'aRoom < 0 && bRoom >= 0', text: 'Find the clock price where A drops out and B is still in.' },
              explain: 'With a credit for A, A stays in down to a clock of £60 and drops out at £50; B wins, paid £50. With a charge for B, B stays in down to £60, A drops out at £60, and B wins, paid £60 - £10 = £50. Same winner, same price.' },
            { t: 'read', title: 'What real bidders do', body: [
              'In practice it can matter. A credit is nicer to tell a supplier about. But research by Gretschko and co-authors found that in first-price sealed-bid auctions, suppliers judged their rivals\' advantages as smaller than they really were. Their guesses shrank towards zero.',
              'So a supplier told "you have a credit" thinks it\'s further ahead than it is, and bids higher. Suppliers carrying a charge take the competition more seriously.',
              'The rule: in first-price formats, frame differences as <b>charges</b>, or tell suppliers more about where rivals stand. And a roughly right value always beats leaving a criterion out.'
            ] },
            { t: 'choice', title: 'Frame it', q: 'You\'re running a first-price sealed-bid tender. Supplier A is £10 better. How should you frame it?',
              options: [
                { text: 'A £10 credit for A, it\'s friendlier', why: 'Friendlier, but A may feel safe and bid high.' },
                { text: 'A £10 charge for the others', ok: true, why: 'Right. Charges keep suppliers\' sense of the competition sharp.' },
                { text: 'Don\'t mention it', why: 'Then suppliers can\'t see what wins, and you\'ve lost the Ruler.' },
                { text: 'It never matters', why: 'In the maths, no. In human bidding, it can.' }
              ] },
            { t: 'choice', title: 'Which format?', q: 'In which format does the framing change nothing, even with real bidders?',
              options: [
                { text: 'A first-price sealed bid', why: 'That\'s where the overconfidence was found: bidders guess their own margin.' },
                { text: 'A falling price clock everyone can watch', ok: true, why: 'Right. Each supplier simply stays in until the clock passes its walk-away, so there\'s nothing to misjudge about rivals.' },
                { text: 'Any format with more than three bidders', why: 'The number of bidders isn\'t the issue. Guessing rivals\' advantages is.' },
                { text: 'None, it always matters', why: 'On an open clock bidders don\'t need to guess, so it doesn\'t.' }
              ] },
            { t: 'summary', points: ['A credit and a charge give the same result in theory.', 'Suppliers underestimate rivals\' advantages, so a credit can breed overconfidence.', 'In first-price formats, frame differences as charges or share more.'] }
          ]
        }
      ]
    },
    {
      title: 'Whole-life cost',
      lessons: [
        {
          id: 'whole-life-cost', title: 'Whole-life cost and NPV', minutes: 12, kind: 'Concept',
          steps: [
            { t: 'read', title: 'Whole-life cost, not piece price', body: [
              '<b>Whole-life cost</b> is everything a supplier choice costs you over the contract\'s life, in today\'s money, not just the piece price. It\'s what should drive the decision.',
              'It builds up in three rungs. <b>Total piece price:</b> for each model, piece price × volume, added up. <b>Quoted price:</b> the net present value (NPV) of the piece prices, plus design and testing, plus tooling. <b>True Price:</b> the quoted price, plus charges, minus credits, minus today\'s value of any extras like a lump sum.',
              'Anything you leave out of the True Price, you\'ll pay for later at a monopolist\'s price.'
            ] },
            { t: 'read', title: 'Money later is worth less', body: [
              'NPV in one line: £1 next year is worth less than £1 today, because you could have invested it. At 10% a year, £1 in a year is worth about 91p today.',
              'Supplier X wants £500 now, then £6,000, £10,000 and £10,000 over the next three years: £26,500 in all. At 10%, that\'s £500 + £5,455 + £8,264 + £7,513 = <b>£21,732</b> today.',
              'Supplier Y wants the same £26,500, front-loaded: £11,000, £5,000, £5,000 and £5,500. Undiscounted, the two are identical. Are they?'
            ] },
            { t: 'slider', title: 'Turn up the rate', prompt: 'Drag the discount rate and watch both offers shrink into today\'s money.',
              inputs: [ { id: 'r', label: 'Discount rate', min: 0, max: 20, step: 1, value: 0, suffix: '%' } ],
              outputs: [
                { id: 'x', label: 'Supplier X in today\'s money', expr: '500 + 6000 / (1 + r / 100) + 10000 / Math.pow(1 + r / 100, 2) + 10000 / Math.pow(1 + r / 100, 3)', prefix: '£' },
                { id: 'y', label: 'Supplier Y in today\'s money', expr: '11000 + 5000 / (1 + r / 100) + 5000 / Math.pow(1 + r / 100, 2) + 5500 / Math.pow(1 + r / 100, 3)', prefix: '£' },
                { id: 'gap', label: 'How much more Y costs you', expr: 'y - x', prefix: '£' }
              ],
              explain: 'At 0% they\'re equal at £26,500. As the rate rises, Y gets steadily dearer, because more of its money comes early, when money is worth most. At 10%, Y costs £23,810 and X £21,732: a gap of £2,078.' },
            { t: 'choice', title: 'Which is cheaper?', q: 'At 10%, which supplier is cheaper in today\'s money?',
              options: [
                { text: 'X: £21,732 vs £23,810', ok: true, why: 'Right. Y asks for more of the money earlier, when it\'s worth most.' },
                { text: 'Y, it finishes paying off sooner', why: 'The total is the same, and Y\'s money comes earlier, which costs you more.' },
                { text: 'They\'re equal, both total £26,500', why: 'Only at a 0% rate.' },
                { text: 'Can\'t tell without the piece price', why: 'These are the full payments. Nothing else is needed.' }
              ] },
            { t: 'read', title: 'Close every back door', body: [
              'After the award, the winner is your only supplier. Any cost you left out of the True Price, a test rig, a packaging change, a support fee, will come back later at a monopolist\'s price.',
              'So a True Price calculator has to pass three tests: <b>complete</b> (nothing left out), <b>like for like</b> (every supplier measured the same way) and <b>easy to use</b> (one spreadsheet per supplier that turns every input into one figure).'
            ] },
            { t: 'summary', points: ['Compare whole-life cost, not piece price.', 'NPV puts money from different years into today\'s pounds.', 'Leave nothing out of the True Price, or it creeps back after the award.'] }
          ]
        },
        {
          id: 'the-45m-challenge', title: 'The £45m challenge', minutes: 15, kind: 'Game',
          steps: [
            { t: 'read', title: 'Get under £45m', body: [
              'An appliance maker is launching a new range of washing machines: a compact model and a family-size one. It has offered the whole motor contract, both models, for a True Price of <b>£45m</b>. You\'re Supplier A, the motor maker. Your current offer comes to <b>£47.23m</b>.',
              'Your base: 200,000 compact motors a year at £48 and 100,000 family motors a year at £80, for three years from launch. Design and testing (£0.8m) and tooling (£1.2m) are paid before launch. Charges: £0.4m for shipping distance, 1% of your quoted price for not accepting the terms, £0.6m for no extended warranty.',
              'You\'re the supplier. The buyer has told you the target. How many ways can you get there?'
            ] },
            { t: 'read', title: 'What each lever is worth', body: [
              'At 10%, the three years of sales are worth 2.4869 times one year in today\'s money. So £17.6m a year of motors is £43.77m. Add design and testing and tooling: a quoted price of £45.77m. Add charges of £0.4m + £0.458m + £0.6m: a True Price of £47.23m, £2.23m over.',
              'Roughly: £1 off the compact motor is worth £0.50m, £1 off the family motor £0.25m. Accepting the terms is worth £0.46m, the warranty £0.60m. Every £1 of lump sum, or £1 cut from design and testing or tooling, is worth £1. Every £1 a year off the motors you already supply is worth about £2.49.'
            ] },
            { t: 'slider', title: 'The True Price calculator', prompt: 'Pull any levers you like. For the two switches, 1 means yes. Get the True Price under £45m, then try to find a second route.',
              inputs: [
                { id: 'm1', label: 'Compact motor price', min: 40, max: 50, step: 1, value: 48, prefix: '£' },
                { id: 'm2', label: 'Family motor price', min: 70, max: 82, step: 1, value: 80, prefix: '£' },
                { id: 'cut', label: 'Yearly price cut after launch', min: 0, max: 5, step: 1, value: 0, suffix: '%' },
                { id: 'des', label: 'Design and testing, £m', min: 0, max: 0.8, step: 0.1, value: 0.8, prefix: '£', suffix: 'm' },
                { id: 'tool', label: 'Tooling, £m', min: 0, max: 1.2, step: 0.1, value: 1.2, prefix: '£', suffix: 'm' },
                { id: 'lump', label: 'Lump-sum payment, £m', min: 0, max: 3, step: 0.1, value: 0, prefix: '£', suffix: 'm' },
                { id: 'old', label: 'Yearly cut on motors you already supply, £m', min: 0, max: 1, step: 0.1, value: 0, prefix: '£', suffix: 'm' },
                { id: 'terms', label: 'Accept the terms (0 no, 1 yes)', min: 0, max: 1, step: 1, value: 0 },
                { id: 'war', label: 'Offer the extended warranty (0 no, 1 yes)', min: 0, max: 1, step: 1, value: 0 }
              ],
              outputs: [
                { id: 'motors', label: 'Motors over three years, today\'s money', expr: '(0.2 * m1 + 0.1 * m2) * (1 / 1.1 + (1 - cut / 100) / 1.21 + Math.pow(1 - cut / 100, 2) / 1.331)', prefix: '£', suffix: 'm', decimals: 2 },
                { id: 'quoted', label: 'Quoted price, whole life', expr: 'motors + des + tool', prefix: '£', suffix: 'm', decimals: 2 },
                { id: 'charges', label: 'Charges', expr: '0.4 + (1 - terms) * 0.01 * quoted + (1 - war) * 0.6', prefix: '£', suffix: 'm', decimals: 2 },
                { id: 'credits', label: 'Credits (lump sum + cuts on existing motors)', expr: 'lump + old * (1 / 1.1 + 1 / 1.21 + 1 / 1.331)', prefix: '£', suffix: 'm', decimals: 2 },
                { id: 'tp', label: 'True Price', expr: 'quoted + charges - credits', prefix: '£', suffix: 'm', decimals: 2 }
              ],
              goal: { expr: 'tp < 45', text: 'Get the True Price under £45m.' },
              explain: 'There are many routes. Accept terms + warranty + a £1.2m lump sum: £44.97m. Cut the compact motor to £46 and the family motor to £75, nothing else: £44.97m. A 3% yearly cut + terms + warranty: £44.95m. £0.5m a year off existing motors + terms + warranty: £44.93m. Tooling £0.2m and design £0.4m + terms + warranty: £44.77m. Or a £2.3m lump sum alone: £44.93m.' },
            { t: 'choice', title: 'Which route works?', q: 'Which of these gets Supplier A under £45m?',
              options: [
                { text: 'Cut the compact motor to £45 and offer the warranty', why: 'A near miss: £45.12m. Close, not enough.' },
                { text: 'Accept the terms and offer the warranty, nothing else', why: 'That\'s worth about £1.06m, leaving you at £46.17m.' },
                { text: 'A £2.3m lump sum, nothing else', ok: true, why: 'Right. £47.23m - £2.3m = £44.93m.' },
                { text: 'Cut the family motor to £75, nothing else', why: '£5 off the family motor is worth about £1.25m, so you land at £45.97m.' }
              ] },
            { t: 'choice', title: 'Who picks the lever?', q: 'Why let the supplier choose how to reach the target, rather than telling it to cut its motor price?',
              options: [
                { text: 'It\'s less work for the buyer', why: 'True, but not the main reason.' },
                { text: 'The supplier knows which lever costs it least, so it can go further', ok: true, why: 'Right. One number, many levers: the supplier finds the cheapest way to give you value. Maybe tooling is cheap for it, or it has slack on the motors it already supplies.' },
                { text: 'Motor price doesn\'t matter', why: 'It matters a lot. It\'s just one lever.' },
                { text: 'Lump sums are always best', why: 'Only if they\'re the cheapest lever for that supplier.' }
              ] },
            { t: 'summary', points: ['A True Price turns many levers into one number.', 'There are always several routes to a target.', 'Let suppliers pick the route: they know their own costs.'] }
          ]
        }
      ]
    },
    {
      title: 'After the award',
      lessons: [
        {
          id: 'change-price-list', title: 'Stopping cost creep: the change price list', minutes: 12, kind: 'Concept',
          steps: [
            { t: 'read', title: 'Price the changes before you\'re locked in', body: [
              'You often pick a supplier before the specification is final. Then changes come, under time pressure, and you negotiate them with a supplier you can no longer replace. Costs creep.',
              'This is the <b>hold-up problem</b>: once you\'re locked in, the other side can hold you to ransom. (Redesigning the game against cost creep is Course 2, lesson 5.)',
              'After the award, every change is negotiated with a monopolist. Before it, with competitors. So agree a <b>change price list</b> in the tender, make suppliers compete on it, and bind the winner to it.'
            ] },
            { t: 'read', title: 'What goes on the list', body: [
              'There are two kinds of change. <b>Functional:</b> the heating element must now withstand 110°C instead of 90°C. <b>Design:</b> the part must be 25 mm shorter.',
              'List every likely change from experience, estimate its cost and likelihood, and separate changes you ask for from changes the supplier causes. Set what you\'ll pay towards piece price, design and testing, and tooling, and agree a fall-back process for anything the list doesn\'t cover.',
              'Typical rules: extra material from your change is paid at a rate agreed at the award; a missed weight target means a set deduction per kg; tooling rework needed to make the part at all is never paid; launch delays flagged early can be refused.'
            ] },
            { t: 'sort', title: 'Who pays?', prompt: 'Under a typical change price list, who carries each cost?',
              buckets: ['You pay', 'Supplier carries it'],
              items: [
                { text: 'You ask for a heavier-gauge material', bucket: 0, why: 'Your change, paid at the agreed material rate.' },
                { text: 'The supplier switches machines to cut its own costs', bucket: 1, why: 'Its own manufacturing choice: no price change.' },
                { text: 'The tool needs reworking because the first design couldn\'t be made', bucket: 1, why: 'Making the part at all was the supplier\'s job. Never paid.' },
                { text: 'You change the part\'s length after the tool is cut', bucket: 0, why: 'Your change after the tool exists. Paid, at a negotiated price.' },
                { text: 'The supplier misses the committed weight', bucket: 1, why: 'A set deduction per kg off the piece price.' }
              ] },
            { t: 'read', title: 'When a supplier says no to a rule', body: [
              'If a supplier won\'t accept a rule, don\'t exclude it: price it. <b>Charge = probability the change happens × what it would cost you.</b>',
              'Three rules: material changes at the agreed rate (60% likely, £250k: a £150k charge); no payment for tooling rework needed to make the part (40%, £400k: £160k); the weight deduction (25%, £200k: £50k).',
              'Supplier 3 rejects rule 2: a £160k charge. Supplier 4 rejects all three: £360k, or exclusion if your Rulebook says so. Competition does the rest: rejected rules often get accepted in the second offer.'
            ] },
            { t: 'choice', title: 'Price the refusal', q: 'A supplier rejects a rule covering a change with a 30% chance of happening and a £500k cost. What\'s the charge?',
              options: [
                { text: '£500k', why: 'That assumes the change is certain.' },
                { text: '£150k', ok: true, why: 'Right. 30% × £500k = £150k: the expected cost of the risk it\'s handing back to you.' },
                { text: '£0, rules are optional', why: 'Then every supplier would reject them.' },
                { text: 'Exclude the supplier', why: 'Possible if your Rulebook says so, but pricing it keeps the race going.' }
              ] },
            { t: 'choice', title: 'Why before?', q: 'Why agree change prices before the award rather than when changes come up?',
              options: [
                { text: 'Changes are cheaper to make early', why: 'Sometimes, but the point is who you\'re negotiating with.' },
                { text: 'Before the award, suppliers compete on them; after it, the winner is a monopolist', ok: true, why: 'Right. The same change costs less when a rival could still win the contract.' },
                { text: 'It stops all changes happening', why: 'Changes still happen. You\'ve just agreed their price.' },
                { text: 'Suppliers prefer it', why: 'Often they don\'t. It takes away their best chance to recover margin.' }
              ] },
            { t: 'summary', points: ['Changes after the award are bought from a monopolist.', 'Put a change price list into the tender and make suppliers compete on it.', 'A rejected rule costs its probability times its cost.'] }
          ]
        },
        {
          id: 'sceptical-stakeholders', title: 'Winning over sceptical stakeholders', minutes: 6, kind: 'Concept',
          steps: [
            { t: 'read', title: 'Four objections you\'ll hear', body: [
              '"I don\'t agree with the total." The total is your company\'s willingness to pay for the differences between suppliers, criterion by criterion. Which one do you think is wrong?',
              '"We can\'t put a price on this!" Use a precedent from a similar criterion on a past project. A rough value beats leaving it out. "Why not just exclude them?" Turn the "No" into a "Yes, if…": more suppliers, more competition.',
              '"We\'ll still want final approval of the winner." The Rulebook decides. Bring colleagues into the pricing, and they\'ll defend the result.'
            ] },
            { t: 'choice', title: 'The finance lead', q: 'Finance says: "I don\'t agree with the total." Best response?',
              options: [
                { text: 'Fair enough, let\'s halve it', why: 'Cutting the total without a reason makes every criterion look arbitrary.' },
                { text: 'The total is what we\'d pay for these differences. Which criterion looks wrong to you?', ok: true, why: 'Right. Move the argument from the total to a single criterion, where it can be settled with facts.' },
                { text: 'The suppliers have already seen it', why: 'True or not, it doesn\'t answer the concern, and it shuts a colleague out.' },
                { text: 'Let\'s go back to scores', why: 'Scores hide the same disagreement without settling it.' }
              ] },
            { t: 'choice', title: 'The engineer', q: 'An engineer says: "You can\'t put a pound value on design maturity." Best response?',
              options: [
                { text: 'Then we\'ll leave it out', why: 'A missing criterion is a back door. It\'ll come up after the award.' },
                { text: 'Let\'s use how we valued something similar on the last project, and refine it', ok: true, why: 'Right. A roughly right value beats none.' },
                { text: 'Give it 10 points instead', why: 'You\'re back to scores that don\'t price.' },
                { text: 'Finance will decide', why: 'The engineer\'s knowledge is exactly what you need.' }
              ] },
            { t: 'choice', title: 'The director', q: 'A director says: "Fine, but I\'ll sign off the winner myself at the end." What\'s the risk?',
              options: [
                { text: 'None, directors should sign off', why: 'They sign the Rulebook up front, not the winner afterwards.' },
                { text: 'Suppliers see a back door and hold back their best offers', ok: true, why: 'Right. An after-the-fact veto turns your auction back into a haggle (Course 6, lesson 5).' },
                { text: 'The tender will take longer', why: 'True, but the real cost is weaker bids.' },
                { text: 'It breaks competition law', why: 'It doesn\'t. It just weakens your position.' }
              ] },
            { t: 'summary', points: ['The total is your willingness to pay for the differences.', 'Use precedents: a rough value beats none.', 'No final veto: the Rulebook decides.'] }
          ]
        }
      ]
    }
  ],
  exam: { pass: 7, questions: [
    { q: 'A council rates two cleaning firms 88/100 and 81/100. The second is £12k a year cheaper. What do you need to decide?',
      options: ['Nothing, pick the 88', 'Nothing, pick the cheaper one', 'What the 7 points are worth in pounds', 'Average the two scores'], answer: 2,
      why: 'Scores rank; only money compares against price.' },
    { q: 'A laptop supplier has a £20 credit and its rival a £15 charge. The first quotes £400. Below what must the rival quote to win?',
      options: ['£400', '£385', '£365', '£420'], answer: 2,
      why: 'The first one\'s True Price is £380. The rival needs a True Price under £380, so a quote under £365: the gap is the sum of both adjustments, £35.' },
    { q: 'Which pair of criteria would double count?',
      options: ['Delivery distance and payment terms', 'Supplier\'s defect rate and expected warranty claims', 'Part weight and tooling cost', 'Licence fees and training hours'], answer: 1,
      why: 'Both price the same defect risk. Count it once.' },
    { q: 'A software vendor\'s support hours can still be increased before award day. The criterion is…',
      options: ['Fixed', 'Variable', 'No-go', 'Relative by definition'], answer: 1,
      why: 'The supplier can still influence it, so it\'s variable: share its logic.' },
    { q: 'You benchmark all suppliers against the weakest. What do suppliers hear?',
      options: ['Everyone has a gap to close', 'Everyone else is ahead: they all get credits', 'The weakest will win', 'Nothing changes'], answer: 1,
      why: 'Same ranking, positive framing.' },
    { q: 'The rule is £4 per kg over target, and there are 500,000 lifetime parts. A supplier is 0.2 kg over. What\'s the charge?',
      options: ['£40,000', '£400,000', '£100,000', '£2,000,000'], answer: 1,
      why: '0.2 × £4 × 500,000 = £400,000.' },
    { q: 'In a first-price sealed-bid tender, why might you frame a difference as a charge rather than a credit?',
      options: ['Charges are cheaper', 'It changes the winner in theory', 'Suppliers with a credit tend to underestimate rivals and bid high', 'Credits aren\'t allowed'], answer: 2,
      why: 'The maths is the same; the psychology isn\'t.' },
    { q: 'Two suppliers each want £30,000 in total. P wants £20,000 now and £10,000 in Year 3. Q wants £10,000 now and £20,000 in Year 3. Which is cheaper in today\'s money at 8%?',
      options: ['P', 'Q', 'They\'re equal', 'You need the piece price'], answer: 1,
      why: 'Money paid later is worth less today: P is about £27,938, Q about £25,877.' },
    { q: 'A supplier\'s True Price is £1.2m over your target. Which is a sensible reaction?',
      options: ['Insist it cuts its piece price', 'Exclude it', 'Let it choose among levers: price, yearly cuts, tooling, lump sum, terms', 'Raise the target'], answer: 2,
      why: 'It knows which lever costs it least, so it can go further.' },
    { q: 'A supplier refuses a rule on your change price list covering a 20% chance of a £300k cost. What\'s the charge?',
      options: ['£300k', '£0', '£60k', '£240k'], answer: 2,
      why: '20% × £300k = £60k.' }
  ] }
});
