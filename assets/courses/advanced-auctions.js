/* Course 9: When the Textbook Breaks. Built from training-library/courses/09-when-the-textbook-breaks.md */
(window.GAMBIT_COURSES = window.GAMBIT_COURSES || []).push({
  id: 'advanced-auctions', order: 9, track: 'Auctions', title: 'When the Textbook Breaks', piece: 'bishop',
  price: 9.89,
  status: 'live', level: 'Advanced', minutes: 113,
  summary: "Where standard auction advice stops working: strong favourites, suppliers who must win, rings, hidden fields, split awards and long contracts, and the design moves that fix each one.",
  outcomes: [
    'Diagnose which revenue-equivalence condition a real tender breaks, and what that means for the format',
    'Design handicaps, ceiling prices and disclosure rules that lower the expected price without wrecking credibility',
    'Detect and pre-empt tacit collusion, bid signalling and demand reduction',
    'Protect long-term contracts from the ratchet effect by choosing what the tender reveals and indexing prices'
  ],
  modules: [
    {
      title: 'When the tie breaks',
      lessons: [
        {
          id: 'revenue-equivalence-breaks', title: 'When revenue equivalence breaks', minutes: 8, kind: 'Concept', preview: true,
          steps: [
            { t: 'read', title: 'A theorem as a checklist', body: [
              "Course 8 showed the surprising tie: when bidders are similar, independent, risk-neutral and know their own values, every standard auction format earns the same on average. Sealed or open, first-price or second-price, it doesn't matter which you pick.",
              "In practice that tie rests on five conditions. Bidders are <b>similar</b>, and there are more than three. There's <b>no strong common value</b>. The deal <b>isn't strategically vital</b> to them. There's <b>one lot</b>. And there's <b>no collusion risk</b>.",
              "Real tenders rarely meet all five. That's useful, not depressing: each broken condition tells you which design lever to reach for, and this course takes them one at a time."
            ] },
            { t: 'sort', title: 'Which condition breaks?', prompt: 'Sort each tender by the condition it breaks.',
              buckets: ['Similar bidders', 'Not strategically vital', 'No collusion risk'],
              items: [
                { text: 'One incumbent has twice the capacity and half the cost of anyone else', bucket: 0, why: "A strong favourite breaks the similar-bidders condition. Lessons 3 and 4 deal with it." },
                { text: 'Only two suppliers qualified, and one is far bigger than the other', bucket: 0, why: 'Two very different bidders: the formats stop tying.' },
                { text: "A supplier's plant closes if it loses this contract", bucket: 1, why: 'Losing would hurt it badly, so it behaves differently. Lesson 2 shows how.' },
                { text: 'A sales director needs this deal to hit the annual target', bucket: 1, why: 'Another must-win supplier. Fear of losing changes its bids.' },
                { text: 'The same three suppliers have met in every monthly auction for four years', bucket: 2, why: 'A small field that meets often can hold a ring together. Lesson 5.' },
                { text: 'Two of the bidders openly share a parent company', bucket: 2, why: "They can co-ordinate without even trying. That's a collusion risk." }
              ] },
            { t: 'choice', title: 'One more condition', q: "You're buying 70% of the volume from one supplier and 30% from another. Which condition breaks?",
              options: [
                { text: 'One lot', ok: true, why: 'Right. Shares and multiple units break it. Lessons 5 and 7 show what that costs and how bidders exploit it.' },
                { text: 'Similar bidders', why: 'Nothing here says the suppliers differ. The award itself has changed.' },
                { text: 'No strong common value', why: "That's about uncertain costs everyone shares, which Course 8 covered." },
                { text: 'Nothing breaks', why: 'Splitting the award is exactly what the one-lot condition rules out.' }
              ] },
            { t: 'read', title: 'Two more quiet assumptions', body: [
              "The textbook also assumes two things real procurement breaks all the time. First, that <b>bidders know how many rivals they face</b>. Often they don't, and lesson 6 shows how that changes their bids.",
              "Second, that <b>the auction is the end of the story</b>. In long contracts it's only round one: what you learn in the tender gets used in the renegotiation, and suppliers know it. Lessons 8 and 9 deal with that.",
              "The mindset to keep: when nothing is broken, chase more bidders, because that's the lever that works. When something is broken, the format and the rules start to matter a lot."
            ] },
            { t: 'choice', title: 'Where to spend your time', q: "A tender has six similar suppliers, private costs, one lot, no repeat play and nothing strategic at stake. What's the best use of your design time?",
              options: [
                { text: 'Bring in a seventh and eighth supplier', ok: true, why: "Right. Nothing's broken, so the formats tie and more bidders is the lever that works." },
                { text: 'Switch from first-price to English', why: "Under the tie, that's worth nothing on average." },
                { text: 'Add a hidden ceiling price', why: 'It could help a little, but more bidders help more here.' },
                { text: 'Split the award 70/30', why: 'That adds cost for no reason when nothing calls for a second source.' }
              ] },
            { t: 'summary', points: ['Use the revenue-equivalence conditions as a diagnostic checklist.', 'Each broken condition points to a specific design lever.', 'Real procurement adds two more: unknown competition and life after the auction.'] }
          ]
        },
        {
          id: 'fear-of-losing', title: 'Fear of losing: risk aversion', minutes: 10, kind: 'Concept',
          steps: [
            { t: 'read', title: 'Insurance against losing', body: [
              "Recap from Course 8: in a first-price tender you shade, adding margin to your cost and trading some chance of winning for profit when you do win. Course 4 showed that people's attitudes to risk differ a lot.",
              "Shading is a gamble. A supplier that hates losing, because it has a plant to fill, a strategic customer or a sales target, gives up margin to make losing less likely. It <b>buys insurance by shading less</b>.",
              "In a second-price or English auction nothing changes. Bidding your true cost is still the best move whatever your attitude to risk, because your own bid never sets the price you're paid."
            ] },
            { t: 'slider', title: 'The pain of losing', prompt: "Two suppliers, costs spread evenly from 0 to 100, and you'll pay at most 100. Turn up the pain of losing and watch a supplier with a cost of 40.",
              inputs: [ { id: 'pain', label: 'Pain of losing (1 relaxed, 2 keen, 3 must-win, 4 desperate)', min: 1, max: 4, step: 1, value: 1 } ],
              outputs: [
                { id: 'fp', label: 'Its first-price bid', expr: '100 - 60 / (1 + [1, 0.75, 0.5, 0.25][pain - 1])', decimals: 0 },
                { id: 'sp', label: 'Its second-price bid', expr: '40 + 0 * pain', decimals: 0 },
                { id: 'avgfp', label: "Buyer's average price, first-price", expr: '100 - (200 / 3) / (1 + [1, 0.75, 0.5, 0.25][pain - 1])', decimals: 1 },
                { id: 'avgsp', label: "Buyer's average price, second-price", expr: '200 / 3 + 0 * pain', decimals: 1 }
              ],
              goal: { expr: 'avgfp < 56', text: 'Find the settings where first-price saves the buyer more than 10 a unit against second-price.' },
              explain: "Relaxed suppliers bid 70 and the buyer averages 66.7 in both formats. Keen: a bid of 66 and an average of 61.9. Must-win: 60 and 55.6. Desperate: 52 and 46.7. The second-price bid stays at 40 and the average at 66.7 throughout." },
            { t: 'choice', title: 'We have to win this one', q: "A supplier's sales director says, 'We have to win this one.' In which format does that help the buyer most?",
              options: [
                { text: 'Sealed first-price', ok: true, why: 'Right. Pay-your-bid plus fear of losing pushes bids down.' },
                { text: 'Sealed second-price', why: 'There it bids its cost regardless. The pressure changes nothing.' },
                { text: 'English auction', why: 'English works like second-price: it stays in until its cost, whatever its mood.' }
              ] },
            { t: 'choice', title: 'Why second-price is immune', q: "Why doesn't risk aversion change bids in a second-price auction?",
              options: [
                { text: 'Bidding your true cost is best whatever your attitude to risk', ok: true, why: "Right. Your bid never sets your price, so there's no margin to trade for safety." },
                { text: "Suppliers can't be risk-averse in sealed bids", why: "They can. It just doesn't change their best move here." },
                { text: 'Because the buyer pays more', why: "That's an effect, not a reason." }
              ] },
            { t: 'read', title: 'Use it, but watch the floor', body: [
              "The rule of thumb: if the business is strategically important to suppliers, prefer sealed first-price, or a Dutch auction, to English. Theory backs it: Holt (1980) and Maskin and Riley (1984) showed risk-averse bidders make first-price earn the buyer more.",
              "The flip side is real. Suppliers who badly want the deal may bid below what they can sustain, then come back for more money later. Pair this with Course 8's warning about the winner's curse and check every low bid against your should-cost."
            ] },
            { t: 'choice', title: 'A bid that looks too good', q: 'In your first-price tender, a must-win supplier bids 25% below everyone else. What should you do first?',
              options: [
                { text: 'Check the bid against your should-cost before you award', ok: true, why: "Right. Fear of losing can push bids below a sustainable level, and an unsustainable price comes back as claims later." },
                { text: 'Accept at once before it changes its mind', why: "If it can't deliver at that price, you'll pay the difference later in claims or failures." },
                { text: 'Rerun it as a second-price auction', why: 'Changing the rules after the bids destroys your credibility.' },
                { text: 'Nothing: low bids are always good news', why: "Not when the price can't cover the cost." }
              ] },
            { t: 'summary', points: ['Suppliers who hate losing shade less in first-price auctions.', "Second-price and English bids don't move with risk attitude.", 'When the deal is strategically vital to suppliers, prefer first-price, and watch for unsustainable bids.'] }
          ]
        }
      ]
    },
    {
      title: 'Strong bidders and ceilings',
      lessons: [
        {
          id: 'handicap-the-favourite', title: 'Handicap the favourite: optimal auctions', minutes: 12, kind: 'Game',
          steps: [
            { t: 'read', title: 'Same value, different bids', body: [
              "A puzzle. You're selling a contract worth exactly 1 to Bidder Strong. Bidder Weak values it at 1 half the time and at 0 the other half. Bids can be 0, 0.25, 0.5, 0.75 or 1. Highest bid wins and pays its bid; ties are a coin flip.",
              "Here's one equilibrium. Strong bids 0.25. Weak bids 0.5 when its value is 1, and 0 when its value is 0. Notice what that means: when both value the contract at exactly 1, they don't bid the same amount."
            ] },
            { t: 'choice', title: 'Who bids more?', q: 'Strong values the contract at 1 for sure. Weak values it at 1 half the time. When both value it at 1, who bids more?',
              options: [
                { text: 'Weak', ok: true, why: "Right. Weak bids 0.5 and Strong only 0.25. Strong knows it's often unopposed and shades hard." },
                { text: 'Strong', why: 'Strong has the same value but more reason to shade.' },
                { text: 'They bid the same', why: 'Same value, different situations: so the bids differ.' }
              ] },
            { t: 'read', title: 'Check it yourself', body: [
              "Strong faces a Weak that bids 0 or 0.5, each half the time. Bidding 0 earns Strong 0.25 on average. Bidding 0.25 earns 0.375. Bidding 0.5 also earns 0.375. Bidding 0.75 earns 0.25, and bidding 1 earns nothing. So 0.25 is a best reply.",
              "It isn't the only equilibrium, but it shows the general result (Maskin and Riley, 2000): the strong bidder, often unopposed, shades heavily, while the weak one must fight.",
              "A side point: a second-price auction here would earn 0.5 on average, against 0.375 for first-price. With unequal bidders there's no general ranking of formats."
            ] },
            { t: 'choice', title: "Weak's best reply", q: "Weak values the contract at 1 and knows Strong bids 0.25. What's Weak's best bid?",
              options: [
                { text: '0.25', why: 'That ties with Strong and wins only half the time: 0.5 x 0.75 = 0.375.' },
                { text: '0.5', ok: true, why: 'Right. It wins for sure and keeps 0.5. Nothing else earns as much.' },
                { text: '0.75', why: 'It wins for sure but keeps only 0.25.' },
                { text: '0', why: 'It loses every time against 0.25 and earns nothing.' }
              ] },
            { t: 'read', title: 'Make the favourite work for it', body: [
              "The theory of the revenue-maximising auction (Myerson, 1981) says, in plain words: <b>never let the strong bidder win easily</b>. Make it compete as if the weaker bidder were closer.",
              "Our procurement example. Supplier S has a cost somewhere between 40 and 100. Supplier W has a cost between 60 and 100. You must buy, and you run an English auction. With no handicap, S usually wins at W's cost, and your expected price is <b>84.4</b>.",
              "Now add a handicap h: S must beat W's price by at least h to win. Too small and nothing changes; too big and you keep handing the contract to the dearer supplier. How big should h be?"
            ] },
            { t: 'slider', title: 'Set the handicap', prompt: 'Move the handicap on Supplier S and watch the expected price and who wins.',
              inputs: [ { id: 'h', label: 'Handicap on Supplier S', min: 0, max: 20, step: 2, value: 0 } ],
              outputs: [
                { id: 'price', label: 'Expected price', expr: '[84.44, 83.84, 83.38, 83.04, 82.84, 82.78, 82.84, 83.04, 83.38, 83.84, 84.44][h / 2]', decimals: 1 },
                { id: 'swin', label: 'S wins', expr: '[66.7, 63.3, 60, 56.7, 53.3, 50, 46.7, 43.3, 40, 36.7, 33.3][h / 2]', decimals: 0, suffix: '%' },
                { id: 'wrong', label: 'Higher-cost supplier wins', expr: '[0, 3.3, 6.7, 10, 13.3, 16.7, 20, 23.3, 26.7, 30, 33.3][h / 2]', decimals: 0, suffix: '%' }
              ],
              goal: { expr: 'price < 82.8', text: 'Find the handicap that gives the lowest expected price.' },
              explain: "The best handicap is 10: half the gap between where the two cost ranges start (40 against 60). It cuts the expected price from 84.4 to 82.8. The price: the higher-cost supplier now wins about 1 time in 6. Push to 20 and you've thrown the whole saving away." },
            { t: 'choice', title: 'Same logic for quality', q: "Supplier A's quality is worth £20 a unit more than B's. Fair credits and charges give A a £20 credit. What would a purely revenue-maximising buyer give?",
              options: [
                { text: 'About £10', ok: true, why: 'Right. Research by Gretschko and co-authors shows the optimal procurement auction gives quality differences only about half their true weight.' },
                { text: '£20', why: "That's the efficient, best-value rule." },
                { text: '£40', why: 'That would favour the strong supplier even more, the opposite of the logic.' },
                { text: 'Nothing', why: 'That ignores a real quality difference entirely and is too harsh.' }
              ] },
            { t: 'read', title: 'Before you try this for real', body: [
              "Handicaps need firm commitment: suppliers must believe the rule is fixed before anyone bids. They also depend on your beliefs about suppliers' cost ranges being roughly right.",
              "And the winner isn't always the best-value offer, which you'll have to defend internally. Pricing the difference fairly with credits and charges lives in Course 7. Use the handicap knowingly, as a deliberate trade of efficiency for price."
            ] },
            { t: 'summary', points: ['Weak bidders bid harder than strong ones in first-price formats.', 'Handicapping the favourite lowers the expected price, best at about half its advantage.', 'It costs efficiency and needs firm commitment, so use it knowingly.'] }
          ]
        },
        {
          id: 'reserve-prices', title: 'Reserve prices: set, hide, commit', minutes: 12, kind: 'Concept',
          steps: [
            { t: 'read', title: 'Risk losing to pay less', body: [
              "Recap from Course 3: your walk-away point comes from your best alternative to a deal. Here's a twist: you can set your ceiling price <b>below</b> your true walk-away, on purpose.",
              "Our numbers. You can make a part in-house for 100 a unit. Two suppliers have costs spread evenly between 0 and 100, and you run an English auction. With no ceiling, you pay the higher of the two costs: <b>66.7</b> on average."
            ] },
            { t: 'read', title: 'A ceiling of 50', body: [
              "Now exclude any supplier above 50. One time in four both are under 50, and you pay the higher of two costs under 50: 33.3 on average. One time in two exactly one is under 50, and you pay 50.",
              "One time in four neither is, so there's no deal and you make it in-house at 100. Average: 8.3 + 25 + 25 = <b>58.3</b>. That's a saving of 8.3 a unit (12.5%), even though one time in four you lose the deal entirely."
            ] },
            { t: 'slider', title: 'Find the best ceiling', prompt: 'Drag the ceiling, and try changing your in-house cost too.',
              inputs: [
                { id: 'ceil', label: 'Ceiling price', min: 0, max: 100, step: 5, value: 100, prefix: '£' },
                { id: 'inhouse', label: 'Your in-house cost', min: 80, max: 120, step: 20, value: 100, prefix: '£' }
              ],
              outputs: [
                { id: 'cost', label: 'Expected cost per unit', expr: '(ceil / 100) * (ceil / 100) * (2 * ceil / 3) + 2 * (ceil / 100) * (1 - ceil / 100) * ceil + (1 - ceil / 100) * (1 - ceil / 100) * inhouse', prefix: '£', decimals: 1 },
                { id: 'nodeal', label: 'Chance of no deal', expr: '100 * (1 - ceil / 100) * (1 - ceil / 100)', suffix: '%', decimals: 0 }
              ],
              goal: { expr: 'inhouse == 100 && cost < 58.4', text: 'With your in-house cost at £100, find the ceiling that gives the lowest expected cost.' },
              explain: "Ceilings of 30, 40, 50, 60 and 70 give 63.4, 59.5, 58.3, 59.2 and 61.3. The best ceiling is half your in-house cost: 50 here, 40 if in-house costs 80, 60 if it costs 120. The ceiling bites when only one supplier is cheap, and stops it pricing up to the other's cost." },
            { t: 'choice', title: 'Where the saving comes from', q: 'With a ceiling of 50, which case delivers the saving?',
              options: [
                { text: "Only one supplier is under 50, so it's paid 50 instead of the other supplier's higher cost", ok: true, why: 'Right. The ceiling replaces a weak runner-up.' },
                { text: 'Both suppliers are under 50', why: "Then the ceiling doesn't bind; they compete each other down anyway." },
                { text: 'Neither is under 50', why: "That's the cost of the ceiling, not the saving." }
              ] },
            { t: 'read', title: 'Show it, hide it, keep it', body: [
              "The general result: with similar bidders, the revenue-maximising auction is a standard auction plus the right ceiling, and that ceiling <b>doesn't depend on the number of bidders</b> (Myerson, 1981; Riley and Samuelson, 1981). A bonus: a ceiling caps what a supplier ring can gain.",
              "A <b>shown</b> ceiling is clear and credible, but suppliers anchor on it and bid just under. A <b>hidden</b> one has no anchor, but suppliers only respect it if they believe you'll really walk away. Your track record does the work.",
              "Either way, if you announce a ceiling and then accept a bid above it, every future ceiling is worthless. Course 2 showed why: a commitment you break once is a commitment nobody believes again."
            ] },
            { t: 'choice', title: 'Just this once', q: "You publish a ceiling of £50. The best bid comes in at £53. Your team wants to accept 'just this once'. What's the main cost?",
              options: [
                { text: "Suppliers learn your ceilings aren't real, so future ones stop working", ok: true, why: 'Right. A ceiling is only as good as your record of walking away.' },
                { text: '£3 a unit', why: "That's the visible cost. The invisible one is far bigger." },
                { text: 'None, if no one finds out', why: 'Suppliers usually do find out.' }
              ] },
            { t: 'sort', title: 'Shown or hidden ceiling?', prompt: 'Sort each situation by what it argues for.',
              buckets: ['Argues for showing it', 'Argues for hiding it'],
              items: [
                { text: 'Suppliers tend to bid just under any published number', bucket: 1, why: 'A shown ceiling becomes an anchor. Hiding it removes the target.' },
                { text: 'You have no record of walking away', bucket: 0, why: "A hidden ceiling won't be believed, so show it and stick to it." },
                { text: 'Public rules require you to publish your budget', bucket: 0, why: "Then you have to show it. Check your rules before you design." },
                { text: 'You want to deter a supplier ring', bucket: 0, why: 'A firm, known ceiling caps what a ring can gain.' }
              ] },
            { t: 'summary', points: ['A ceiling below your true walk-away lowers the expected price, at the cost of sometimes losing the deal.', "With similar bidders, the best ceiling doesn't depend on how many there are.", 'Shown ceilings anchor; hidden ones need credibility. Never break your own.'] }
          ]
        }
      ]
    },
    {
      title: 'Rings, beliefs and splits',
      lessons: [
        {
          id: 'collusion-and-signalling', title: 'Collusion and signalling in auctions', minutes: 15, kind: 'Case',
          steps: [
            { t: 'read', title: 'Collusion without a phone call', body: [
              "Recap from Course 1: collusion survives when the future gain from co-operating beats today's gain from cheating. It's easier with few players, frequent meetings, easy detection, a big shared prize and a small prize for cheating. Auctions add a sixth: whether bidders can see and talk through each other's bids.",
              "Commitment matters too. Research by Gretschko and co-authors ran repeated tenders in the lab. When the buyer kept the right to decide after seeing the bids, prices crept up round by round. When the buyer committed to its award rule up front, prices stayed far lower. Here's our own version."
            ] },
            { t: 'matrix', task: 'nash', title: 'Mode A: the buyer decides afterwards', prompt: "Two suppliers, both with a cost of £40; the buyer pays up to £150. The buyer hasn't committed to taking the lowest bid, so a high bid still wins quite often. Find every equilibrium.",
              rows: ['You hold high', 'You undercut'], cols: ['Rival holds high', 'Rival undercuts'],
              pay: [[[55, 55], [30, 50]], [[50, 30], [20, 20]]], unit: 'expected profit per tender, £',
              explain: "Only both holding high is an equilibrium. Undercutting earns 50 against 55 for holding, because the buyer may still pick the higher bid. Without commitment, nobody gains by breaking ranks, so prices drift up towards the buyer's maximum." },
            { t: 'matrix', task: 'nash', title: 'Mode B: lowest bid wins', prompt: 'Same suppliers, but now the buyer commits up front: lowest bid wins, full stop. Find every equilibrium.',
              rows: ['You hold high', 'You undercut'], cols: ['Rival holds high', 'Rival undercuts'],
              pay: [[[55, 55], [0, 80]], [[80, 0], [20, 20]]], unit: 'expected profit per tender, £',
              explain: 'Now undercutting is dominant: 80 beats 55, and 20 beats 0. The only equilibrium is both undercutting, and prices fall. A committed award rule turns a cosy ring into a race.' },
            { t: 'read', title: 'Talking through bids', body: [
              "Open, multi-round auctions let bidders talk through their numbers. Germany, 1999, a mobile spectrum auction with 10 blocks and a 10% minimum raise. Mannesmann opened with DM 36.36m on blocks 1 to 5 and DM 40m on blocks 6 to 9. And 36.36 plus 10% is 40.",
              "The message to its big rival: raise me once on the first five, leave me the rest, and we're done. The rival did, the smaller bidders were squeezed out, and it closed after three rounds at low prices (Grimm, Riedel and Wolfstetter, 2003; Klemperer, 2002).",
              "In US spectrum auctions in the mid-1990s, bidders used the last digits of their bids to name the licence they were defending: keep off my territory (Cramton and Schwartz, 2000). The regulator's fix was to allow only pre-set bid amounts."
            ] },
            { t: 'choice', title: 'Decode the signal', q: "In an open spectrum auction with a 10% minimum raise, a bidder bids 36.36 on half the blocks and 40 on the others. What's it saying?",
              options: [
                { text: "'Raise me once to 40 on the first half, leave the rest to me'", ok: true, why: 'Right. 36.36 plus 10% is 40, an invitation to split the blocks and stop.' },
                { text: 'It made a typing error', why: 'Odd figures like 36.36 are rarely accidents in these auctions.' },
                { text: 'It values the first half less', why: 'Possibly, but the exact 10% gap gives the game away.' }
              ] },
            { t: 'read', title: 'Asking for less', body: [
              "In multi-unit auctions, bidders can keep prices low by simply asking for less. Germany, August 2000: 12 third-generation licence blocks, 7 bidders, each wanting 2 or 3. Once the seventh dropped out, the six left could have stopped at 2 each. Two big incumbents kept bidding for 3 until they gave up.",
              "It ended with six winners of 2 blocks and about DM 99bn (about €50bn), roughly €615 per person. Austria, November 2000, a similar design: an incumbent said publicly it would be happy with two blocks. The auction ended near the reserve at about €830m, roughly €100 per person (Klemperer, 2002).",
              "Design rules: have more suppliers than lots, use fixed bid steps, hide bidder identities, and make awards unequal. And prefer sealed first-price: in second-price a ring's chosen winner can bid high safely, while in first-price a cheat can undercut by a whisker (Robinson, 1985)."
            ] },
            { t: 'choice', title: 'Enough to go round', q: "Twelve blocks, six bidders, and everyone can win two or three. What's the risk?",
              options: [
                { text: 'Everyone settles for two, and prices stay near the reserve', ok: true, why: 'Right. When there are enough lots to go round, bidders reduce demand instead of competing.' },
                { text: 'Bidders overpay', why: 'With lots to go round, the opposite happens.' },
                { text: 'No risk if bids are open', why: 'Open bidding makes demand reduction easier to co-ordinate.' }
              ] },
            { t: 'sort', title: 'Harder or easier to collude?', prompt: 'Sort each design choice.',
              buckets: ['Makes collusion harder', 'Makes collusion easier'],
              items: [
                { text: 'Sealed first-price bids', bucket: 0, why: "A ring can't watch in real time, and a cheat can undercut by a whisker." },
                { text: 'Open rounds showing bidder names', bucket: 1, why: 'Names make it easy to reward and punish.' },
                { text: 'Free-form bid amounts', bucket: 1, why: 'Room for coded digits and jump bids.' },
                { text: 'Fewer lots than bidders', bucket: 0, why: 'Someone has to go home empty-handed, so they compete.' },
                { text: 'A firm, published ceiling', bucket: 0, why: 'It caps what a ring can gain.' },
                { text: 'Monthly auctions with the same three bidders', bucket: 1, why: 'Few players meeting often is the classic recipe for a ring.' }
              ] },
            { t: 'summary', points: ['Without commitment, repeated tenders drift towards collusive prices.', 'Open formats let bidders signal and share out lots.', 'Use sealed first-price, fixed bid steps, fewer lots than bidders and a firm reserve.'] }
          ]
        },
        {
          id: 'hiding-the-number-of-bidders', title: 'Let them guess: hiding the number of bidders', minutes: 12, kind: 'Game',
          steps: [
            { t: 'read', title: 'Bidding against a belief', body: [
              "In a sealed first-price tender, a supplier doesn't bid against its rivals. It bids against what it <b>thinks</b> its rivals are. That makes beliefs a design lever.",
              "The insight comes from research by Gretschko and co-authors: in first-price auctions, bidders compete with their beliefs. A supplier that doesn't know how many rivals it faces bids somewhere between what it would bid alone and what it would bid against real competition."
            ] },
            { t: 'read', title: 'Our numbers', body: [
              "A supplier has a cost of 40. You'll pay up to 100. If it has a rival, that rival's bid lands somewhere between 50 and 100.",
              "Its best bid depends on its belief that a rival exists. Sure it's alone: 100. A 50% belief: 95. 75%: 78. 90%: 73. Sure of competition: 70. So a supplier that's actually alone but believes there's a 75% chance of a rival bids 78, not 100. You save 22 without any competition at all."
            ] },
            { t: 'slider', title: 'Move the belief', prompt: "Set the supplier's belief that it faces a rival, and watch its best bid.",
              inputs: [ { id: 'p', label: 'Belief that a rival exists', min: 0, max: 100, step: 5, value: 0, suffix: '%' } ],
              outputs: [
                { id: 'bid', label: 'Its best bid', expr: 'Math.min(100, 25 * (1 + 1.8 * p / 100) / Math.max(p / 100, 0.0001))', decimals: 0 },
                { id: 'margin', label: 'Its margin if it wins', expr: 'bid - 40', decimals: 0 },
                { id: 'saving', label: 'Your saving if it is actually alone', expr: '100 - bid', decimals: 0 }
              ],
              goal: { expr: 'bid <= 80', text: "Find a belief that pulls the lone supplier's bid down to 80 or less." },
              explain: "Below a belief of about 45%, the supplier bids the full 100. Above it, the bid falls fast: 95 at 50%, 78 at 75%, 73 at 90%, 70 when it's sure of competition. Every point of that is a saving if it's really alone." },
            { t: 'read', title: 'Which format, when?', body: [
              "You know how many suppliers you have; they don't. With <b>many suppliers</b>, use an English auction: real competition shows itself as drop-outs, and the price falls to the runner-up's cost.",
              "With <b>one or two</b>, use sealed first-price and don't announce the field. In an English auction a lone supplier would see the auction end the moment it started. In the lab, buyers learned to choose this way quickly, and suppliers facing first-price tenders believed competition was far more likely than it really was."
            ] },
            { t: 'choice', title: 'Play the buyer: round 1', q: 'You have four qualified, similar suppliers for this order. Which format do you choose?',
              options: [
                { text: 'An English auction', ok: true, why: 'Right. Real competition shows itself as drop-outs and pushes the price to the runner-up\'s cost. Save the undisclosed sealed format for when you need it.' },
                { text: 'Sealed first-price, field not disclosed', why: "It works, but if suppliers learn that sealed tenders mean big fields, the format stops helping you on the day you have only one supplier." }
              ] },
            { t: 'choice', title: 'Play the buyer: round 2', q: 'Next order: you have only one qualified supplier for a tooling contract. Which approach is most likely to get a good price honestly?',
              options: [
                { text: 'A sealed first-price request without disclosing how many suppliers were invited', ok: true, why: 'Right. The supplier must price against the chance of competition.' },
                { text: 'An English auction', why: "The auction would end the moment it opened, and the supplier would know it's alone." },
                { text: 'Tell the supplier three others are bidding', why: "That's a lie. It's unethical, legally risky, and it ruins trust once found out." },
                { text: 'A one-to-one negotiation, opening with your budget', why: 'That tells the supplier exactly what it can charge.' }
              ] },
            { t: 'read', title: 'Not disclosing is not lying', body: [
              "Never state a false number of bidders, invent rivals or show fake bids. That's deception: it can breach contract and procurement law, and it destroys trust the moment a supplier finds out.",
              "Simply don't publish the number. Many tenders don't, and if a supplier asks, your answer can be 'we don't disclose the field'. Public buyers should check their rules first. And don't over-use it: if sealed first-price always means 'you're alone', suppliers will work that out."
            ] },
            { t: 'choice', title: 'Why it wears off', q: "Why can't a buyer use 'sealed first-price means you're alone' forever?",
              options: [
                { text: 'Suppliers learn the pattern and update their beliefs', ok: true, why: 'Right. Beliefs drive bids, and beliefs learn.' },
                { text: "Because it's illegal", why: "Not disclosing the field generally isn't. Lying about it is." },
                { text: 'Because first-price always costs more', why: 'When competition is uncertain, it can cost less.' }
              ] },
            { t: 'summary', points: ['In first-price formats, suppliers bid against their beliefs about competition.', 'With few suppliers, sealed bids and an undisclosed field can lower prices; with many, an English auction lets real competition show.', 'Not disclosing is legitimate; inventing rivals is not.'] }
          ]
        },
        {
          id: 'single-vs-dual-sourcing', title: 'Single vs dual sourcing: the price of security', minutes: 10, kind: 'Concept',
          steps: [
            { t: 'read', title: 'The price of a second source', body: [
              "Recap from Course 6: splitting an award into unequal shares keeps competition alive. Like Olympic medals, unequal prizes keep everyone racing. But a second source isn't free.",
              "The question: four suppliers, costs spread evenly between 0 and 100. You award 70% of the volume to the cheapest and 30% to the second cheapest. With winner-takes-all you'd pay 40 a unit on average. What does the split cost?"
            ] },
            { t: 'choice', title: 'Predict first', q: 'Four suppliers. Single sourcing costs 40 a unit on average. Roughly what does a 70/30 split cost?',
              options: [
                { text: 'About 52', ok: true, why: 'Right: about 30% more. The next step shows how to work it out.' },
                { text: 'About 40', why: 'Splitting always costs something.' },
                { text: 'About 43, just a little more', why: 'More than that. You buy 30% from a pricier supplier and soften the race.' },
                { text: 'About 70', why: "That's too high. Even 50/50 averages 60." }
              ] },
            { t: 'read', title: 'Building blocks', body: [
              "Revenue equivalence gives a shortcut: your expected cost depends only on who gets how much, not on the format. Winner-takes-all costs, on average, the second-lowest cost: 40. A 50/50 split costs the third-lowest: 60.",
              "70/30 sits 40% of the way to winner-takes-all and 60% of the way to 50/50: 0.4 x 40 + 0.6 x 60 = <b>52</b>. So 70/30 costs about 30% more than single sourcing and 50/50 about 50% more. With evenly spread costs, those percentages don't change with the number of suppliers.",
              "The extra goes two places: you buy 30% from a supplier who really is dearer, and the race for the big share is softer because losing it still leaves a consolation prize."
            ] },
            { t: 'slider', title: 'Price the split', prompt: 'Set the share and the number of suppliers. The premium is for 100,000 units a year.',
              inputs: [
                { id: 'share', label: 'Share to the cheapest supplier', min: 50, max: 100, step: 5, value: 100, suffix: '%' },
                { id: 'n', label: 'Number of suppliers', min: 3, max: 6, step: 1, value: 4 }
              ],
              outputs: [
                { id: 'single', label: 'Single-sourcing cost per unit', expr: '200 / (n + 1)', decimals: 1 },
                { id: 'cost', label: 'Cost per unit with this split', expr: '((share - 50) / 50) * 200 / (n + 1) + (1 - (share - 50) / 50) * 300 / (n + 1)', decimals: 1 },
                { id: 'premium', label: 'Yearly premium', expr: '(cost - single) * 100', prefix: '£', suffix: 'k', decimals: 0 }
              ],
              goal: { expr: 'share < 100 && premium <= 750', text: 'A supply failure would cost you £750k a year in expectation. Find a split whose premium is below that.' },
              explain: "With four suppliers, 70/30 costs 52 against 40: a £1.2m premium a year. Only lopsided splits, around 85/15 or more, come in under £750k. The cost ratio stays at 1.3 for 70/30 and 1.5 for 50/50 whatever the number of suppliers." },
            { t: 'read', title: 'When security is worth it', body: [
              "Pay for a second source when a supply failure would cost more than the premium. Decide and agree the premium you'll accept <b>before</b> the auction, not on the day.",
              "Make the shares unequal so the race for the big share still matters. Consider letting the runner-up match the winner's price for its share. And remember what you're buying: the second source is your credible threat in every later negotiation, and this is what that threat costs."
            ] },
            { t: 'choice', title: 'Should you dual source?', q: 'A supply failure would cost £15m, with a 5% chance a year if you single source and almost none if you dual source. The 70/30 premium is £1.2m a year. Should you dual source?',
              options: [
                { text: 'No: the expected failure cost (£0.75m) is below the premium', ok: true, why: "Right, on expected values. You might still pay it if the business couldn't survive a stoppage." },
                { text: 'Yes, always', why: 'Security has a price. Here the price exceeds the expected loss.' },
                { text: 'Yes, because 70/30 is free', why: "It isn't: about 30% dearer in our example." }
              ] },
            { t: 'summary', points: ['Splitting volume costs money: about 30% more for 70/30 and 50% more for 50/50 in our example.', 'Revenue equivalence lets you price any split from simple building blocks.', 'Pay for a second source when the risk it removes is worth more than the premium, and decide that before the auction.'] }
          ]
        }
      ]
    },
    {
      title: 'Life after the award',
      lessons: [
        {
          id: 'ratchet-effect', title: 'The ratchet effect: what the tender reveals', minutes: 14, kind: 'Game',
          steps: [
            { t: 'read', title: 'The tender is round one', body: [
              "Many manufacturers buy in more than half of what their products cost. Take an appliance maker launching a new range: a key component is often single-sourced after a competitive tender, for a range that runs several years, with prices revisited along the way.",
              "How often? A survey of 70 procurement experts by Fugger, Gretschko and Pollrich (2018) put the median chance that the first price gets renegotiated at <b>50%</b>, with the first price agreement lasting a median of about <b>two years</b>: roughly a fifth of the project's life.",
              "The problem in one sentence: what you learn in the tender, you'll be tempted to use in the renegotiation, and suppliers know it. So they bid with the renegotiation in mind."
            ] },
            { t: 'read', title: 'Our numbers', body: [
              "Suppliers are either low-cost (50) or high-cost (80). The part is worth 100 to you. Each renegotiation, you make a take-it-or-leave-it offer. Offer 80: everyone accepts, you gain 20. Offer 50: only a low-cost supplier accepts. You gain 50 if it does, nothing if not. So offering 50 pays once you believe there's at least a <b>40%</b> chance the supplier is low-cost, because 50 x 40% = 20."
            ] },
            { t: 'choice', title: 'Your renegotiation offer', q: "You believe there's a 30% chance your supplier is low-cost (50) rather than high-cost (80). The part is worth 100. What should you offer?",
              options: [
                { text: '80', ok: true, why: 'Right. Offering 50 earns 0.3 x 50 = 15 on average, less than the sure 20 from offering 80.' },
                { text: '50', why: 'Below a 40% belief, the risk of a refusal outweighs the saving.' },
                { text: '65', why: 'A high-cost supplier refuses anything below 80 and a low-cost one accepts 50, so 65 just gives away margin.' }
              ] },
            { t: 'read', title: 'Hiding in the crowd', body: [
              "So anything in the tender that pushes your belief above 40% wipes out a low-cost supplier's margin, 30 a unit, on all the follow-on volume. Its answer is to <b>pool</b>: bid like a high-cost supplier so it doesn't give itself away. That's the <b>ratchet effect</b>, a term from planning economics, where good performance earns tougher targets.",
              "Check it with three suppliers, a first order of 1 and follow-on volume Q. If everyone pools at the high-cost price, each wins one time in three and keeps 30 on 1 + Q units. If a low-cost supplier undercuts, it wins for sure, gets 30 on the first order, then nothing more."
            ] },
            { t: 'slider', title: 'Bid low or hide?', prompt: "You're the low-cost supplier. Set the follow-on volume, as a multiple of the first order, and the number of suppliers.",
              inputs: [
                { id: 'q', label: 'Follow-on volume (times the first order)', min: 0, max: 5, step: 0.5, value: 0 },
                { id: 'n', label: 'Number of suppliers', min: 2, max: 5, step: 1, value: 3 }
              ],
              outputs: [
                { id: 'low', label: 'Lifetime margin: bid low and win', expr: '30 + 0 * q', decimals: 1 },
                { id: 'pool', label: 'Lifetime margin: bid like a high-cost supplier', expr: '(1 + q) * 30 / n', decimals: 1 }
              ],
              goal: { expr: 'q > 0 && Math.abs(pool - low) < 0.01', text: 'Find a follow-on volume where hiding and winning outright pay exactly the same.' },
              explain: "With three suppliers the tipping point is a follow-on volume of 2 times the first order. With N suppliers it's N - 1 times. Above that, hiding pays, which matches the research result: first-price tenders collapse into pooling once follow-on volume passes N - 1 times the first order." },
            { t: 'choice', title: 'What does it bid?', q: 'Three suppliers, follow-on volume four times the first order. A low-cost supplier is choosing its tender bid. What does it do?',
              options: [
                { text: 'Bids like a high-cost supplier, to hide its cost', ok: true, why: 'Right. Pooling is worth (1 + 4) / 3, about 1.7 times the first-order margin: more than winning outright and being squeezed later.' },
                { text: 'Bids low to win for sure', why: 'It wins the first order and loses its margin on four times as much.' },
                { text: 'Bids its true cost', why: "That reveals everything and earns nothing at all." }
              ] },
            { t: 'read', title: 'Design what you see', body: [
              "When pooling happens, a first-price tender tells you nothing and you pay the high-cost price: the worst case. The fixes, from Fugger, Gretschko and Pollrich, are about information.",
              "<b>Reveal less.</b> Use a second-price or English auction where you see only the price paid, not the winner's own bid. Losers' drop-outs set the price; the winner's cost stays hidden, so it can bid truthfully. An intermediary who passes on only the price does the same.",
              "<b>Manage your own beliefs.</b> The research's best design reveals only some of the time whether the winner was well below the price: enough to help you, not enough to make low-cost suppliers hide."
            ] },
            { t: 'choice', title: 'Protect yourself', q: 'Which tender design best protects you from the ratchet effect?',
              options: [
                { text: "An English auction where you see only the final price, not the winner's own bid", ok: true, why: 'Right. The winner\'s cost stays hidden, so it has no reason to hide.' },
                { text: 'A sealed first-price tender with an open-book clause', why: 'Open books make hiding even more attractive.' },
                { text: "Promising suppliers you won't use the information", why: 'Hard to make credible when the renegotiation comes round.' }
              ] },
            { t: 'summary', points: ["In long contracts, the tender reveals information you'll be tempted to use later.", 'Low-cost suppliers then hide, and first-price tenders can tell you nothing.', 'Design what you see: English or second-price formats, an intermediary, or deliberate limits on disclosure.'] }
          ]
        },
        {
          id: 'index-dont-renegotiate', title: "Index, don't renegotiate", minutes: 12, kind: 'Case',
          steps: [
            { t: 'read', title: 'Let the index do the arguing', body: [
              "Recap from Course 7: once you're locked in, the supplier can hold you up, so a change price list belongs in the contract. But some changes nobody can price in advance.",
              "Steel, energy, labour and tariffs move in ways nobody can predict, and writing every contingency into the contract is too costly or impossible. So contracts stay incomplete. When costs move with something public, like a steel or energy index, tie the price to it at the start. Then there's nothing to renegotiate and nothing to exploit."
            ] },
            { t: 'read', title: 'What practitioners report', body: [
              "A survey of 20 senior procurement experts by Gretschko and Pollrich (2020), read approximately: most expect a better-than-even chance of renegotiation. The commonest reasons are design changes, in around half of projects, and input-cost changes, also around half. In roughly a quarter, input costs were the only reason.",
              "Price indices could have been used far more often than they were. Switching supplier mid-project is rare. And every respondent said buyers use the information suppliers reveal."
            ] },
            { t: 'read', title: 'Auction first, then index', body: [
              "The research result in plain words: when the main uncertainty is a public cost driver, you get the best outcome with an <b>English auction up front, plus an index-linked price</b> for later periods, capped by an index-linked ceiling. The auction reveals the losers' costs but never the winner's, and the index moves the price for you.",
              "Our numbers: steel is 40% of a bracket's cost. The auction clears at £100 with the steel index at 100, and your ceiling was £120. Next year's price = £100 x (0.6 + 0.4 x index / 100). Steel at 125: factor 1.10, price £110, ceiling £132. Steel at 80: factor 0.92, price £92, a saving without a fight."
            ] },
            { t: 'slider', title: 'Build the index clause', prompt: "Steel is really 40% of the supplier's cost. Set how much of the price you link to the steel index, then move the index.",
              inputs: [
                { id: 'share', label: 'Share of the price linked to the steel index', min: 0, max: 80, step: 10, value: 0, suffix: '%' },
                { id: 'idx', label: 'Steel index (100 at award)', min: 60, max: 140, step: 5, value: 125 }
              ],
              outputs: [
                { id: 'price', label: 'Indexed price', expr: '100 * (1 - share / 100 + (share / 100) * idx / 100)', prefix: '£', decimals: 0 },
                { id: 'cap', label: 'Indexed ceiling', expr: '120 * (1 - share / 100 + (share / 100) * idx / 100)', prefix: '£', decimals: 0 },
                { id: 'fair', label: "Price that tracks the supplier's real cost", expr: '100 * (0.6 + 0.4 * idx / 100)', prefix: '£', decimals: 0 },
                { id: 'gap', label: 'Gap: pressure to renegotiate', expr: 'price - fair', prefix: '£', decimals: 0 }
              ],
              goal: { expr: 'idx != 100 && Math.abs(gap) < 0.01', text: 'Close the gap with steel away from 100, then move the index to check it holds.' },
              explain: "With 40% indexed, the price follows the supplier's real cost wherever steel goes: £110 at 125, £92 at 80. Index too little and the supplier comes back when steel rises; index too much and you overpay it, and it keeps quiet." },
            { t: 'choice', title: 'Work out the price', q: "Steel is 40% of a part's cost. The auction price was £100 at an index of 100. The index rises to 110. What's the indexed price?",
              options: [
                { text: '£104', ok: true, why: 'Right: 100 x (0.6 + 0.4 x 1.10) = 104.' },
                { text: '£110', why: 'That would index the whole price, but only 40% is steel.' },
                { text: '£100', why: 'Then the supplier absorbs the whole steel rise and will come back to renegotiate.' },
                { text: '£140', why: "That's adding the steel share, not indexing it." }
              ] },
            { t: 'sort', title: 'Index it or contract for it?', prompt: 'Sort each cost driver.',
              buckets: ['A public index works', 'Needs a fuller contract'],
              items: [
                { text: 'Aluminium price swings', bucket: 0, why: 'Public, published and outside both sides\' control.' },
                { text: 'Energy costs at a smelter', bucket: 0, why: 'Energy prices have public indices.' },
                { text: "The supplier's own factory efficiency", bucket: 1, why: "A private shock: no public index shows it, and indexing it would reward inefficiency." },
                { text: 'National minimum-wage rises', bucket: 0, why: 'Public and announced in advance.' },
                { text: 'Your option to switch supplier in year 3', bucket: 1, why: 'That needs terms written into the contract, not an index.' }
              ] },
            { t: 'choice', title: 'Why English?', q: 'Why pair indexing with an English auction rather than sealed first-price?',
              options: [
                { text: "The English auction never reveals the winner's own cost, so there's less to exploit later", ok: true, why: "Right. Losers drop out and set the price; the winner's cost stays private. Protecting the losers' information too is still an open question in the research." },
                { text: 'English auctions always give lower prices', why: 'Not always. This is about information, not price alone.' },
                { text: 'Indexing is illegal with first-price', why: "It isn't. The point is what the auction reveals." }
              ] },
            { t: 'summary', points: ['Contracts stay incomplete because costs move unpredictably.', 'Index public cost drivers instead of renegotiating them.', "Pair indexing with a format that hides the winner's cost, like an English auction."] }
          ]
        },
        {
          id: 'stopping-rules-bid-steps', title: 'Stopping rules, bid steps and display', minutes: 8, kind: 'Concept',
          steps: [
            { t: 'read', title: 'Small rules, big effects', body: [
              "The format is the headline. The stopping rule, bid steps and what you display decide how bidders actually behave. A <b>hard close</b> at a fixed time invites sniping: everyone bids in the last seconds. Roth and Ockenfels (2002) compared eBay's hard close with Amazon's old soft close and found far more last-minute bidding on eBay.",
              "It's an old trick. In 17th-century England some auctions ended when an inch of candle burned out, and Samuel Pepys's diary describes a bidder who watched for the flicker just before the flame died. A <b>soft close</b>, where each late bid extends the clock, restores real price discovery."
            ] },
            { t: 'choice', title: 'Ten seconds to go', q: 'An online auction ends at exactly 17:00 and most bids arrive in the last ten seconds. What has it effectively become?',
              options: [
                { text: 'A sealed second-price auction', ok: true, why: "Right. Nobody can respond to the last bids, so the high bidder pays about the runner-up's last-second bid." },
                { text: 'An English auction with price discovery', why: 'Not when everyone waits until the end.' },
                { text: 'A Dutch auction', why: "The price isn't falling; it's sealed in effect." }
              ] },
            { t: 'read', title: 'Steps, activity and display', body: [
              "<b>Activity rules</b> make you bid in each round to stay eligible, which stops bidders hiding until the end. <b>Fixed bid steps</b> that bidders click to accept leave no room for coded digits. Too big and you leave money on the table; too small and the auction drags. Gaps between steps let suppliers go back to their bosses for a better price.",
              "<b>Display</b> matters too: rank only, the best price, or nothing. Showing how many bidders are active signals competition but helps a ring co-ordinate, and showing names makes punishment easy. Set tie-breaks, number of winners and lot order too, and publish every rule before the event."
            ] },
            { t: 'sort', title: 'A field of three that might collude', prompt: 'Does each setting help or hurt you against a collusion-prone field of three?',
              buckets: ['Helps', 'Hurts'],
              items: [
                { text: 'Fixed click-to-accept price steps', bucket: 0, why: 'No room for coded digits.' },
                { text: 'Live display of bidder names and bids', bucket: 1, why: 'Makes signalling and punishment easy.' },
                { text: 'Soft close with extensions', bucket: 0, why: 'No last-second sniping, though watch for signalling in the extra time.' },
                { text: 'Showing how many bidders are still active', bucket: 1, why: 'A ring can see exactly who has kept to the deal.' },
                { text: 'Rank-only feedback', bucket: 0, why: 'Enough to keep bidders racing, too little to co-ordinate on.' },
                { text: 'Free-form bid amounts', bucket: 1, why: 'Room for messages hidden in the digits.' }
              ] },
            { t: 'summary', points: ['Hard closes cause sniping; soft closes restore price discovery.', 'Fixed bid steps and limited display make signalling and collusion harder.', 'Set every rule before the event and publish it.'] }
          ]
        }
      ]
    }
  ],
  exam: { pass: 7, questions: [
    { q: 'A tender has two suppliers, one of them much cheaper and bigger than the other. Which revenue-equivalence condition is broken?',
      options: ['One lot', 'Similar bidders', 'No common value', 'No strategic importance'], answer: 1,
      why: 'A strong favourite breaks the similar-bidders condition.' },
    { q: 'A supplier says its plant will close if it loses your contract. In which format does that pressure most lower your price?',
      options: ['English auction', 'Sealed second-price', 'Sealed first-price', 'It lowers the price equally in all formats'], answer: 2,
      why: "Fear of losing makes it shade less when it's paid its own bid; in second-price and English it bids its cost anyway." },
    { q: "Supplier S's costs start well below Supplier W's. What does auction theory say about handicapping S?",
      options: ['Never handicap: always pick the cheapest', 'Handicap S by its full cost advantage', 'Handicap S by about half its advantage', 'Exclude S so W has a chance'], answer: 2,
      why: 'A moderate handicap makes S compete harder; the full advantage over-corrects and wastes too much efficiency.' },
    { q: 'Your in-house cost is £200 a unit. Two suppliers have costs spread evenly between £0 and £200. Where does the textbook put the best ceiling price?',
      options: ['£200', '£150', '£100', '£50'], answer: 2,
      why: 'With evenly spread costs the best ceiling is half your in-house cost, whatever the number of bidders.' },
    { q: "You published a ceiling of £80 last year and then accepted £84. What's the biggest cost?",
      options: ['£4 a unit', 'Suppliers stop believing your ceilings', 'Legal penalties', 'None'], answer: 1,
      why: 'A ceiling only works if it\'s credible; breaking it once devalues every future one.' },
    { q: "In an open multi-round auction with a 10% minimum raise, a bidder bids 45.45 on lots 1 to 4 and 50 on lots 5 to 8. What's the most likely reading?",
      options: ['A typing error', 'An invitation to split the lots: raise me once on 1 to 4 and leave me 5 to 8', 'It values lots 5 to 8 more', 'It wants to leave the auction'], answer: 1,
      why: '45.45 plus 10% is 50. Coded bids like this are how rings co-ordinate; fixed bid steps stop it.' },
    { q: 'You have only one qualified supplier. Which approach is honest and most likely to get a good price?',
      options: ['Tell it two others are bidding', 'Run an English auction', 'Run a sealed first-price request without disclosing the field', 'Share your budget to save time'], answer: 2,
      why: "It must price against the chance of competition. Inventing rivals would be a lie; an English auction would show it's alone." },
    { q: 'Five suppliers, costs spread evenly. Single sourcing averages £50 a unit. Roughly what does a 50/50 split cost on average?',
      options: ['£50', '£55', '£75', '£100'], answer: 2,
      why: 'A 50/50 split costs about 50% more than single sourcing in this set-up.' },
    { q: "Four suppliers bid in a sealed first-price tender for a part with follow-on volume five times the first order. The buyer renegotiates yearly. What's the risk?",
      options: ['Low-cost suppliers bid like high-cost ones to hide their costs', 'Suppliers bid below cost', 'Nobody bids', 'None: first-price is always safe'], answer: 0,
      why: 'Follow-on volume above N - 1 (here 3) times the first order makes hiding pay: the ratchet effect.' },
    { q: "Energy is 50% of a component's cost and moves with a public index. What's the best way to handle it in a five-year contract?",
      options: ['Renegotiate each year', 'Fix the price for five years', 'Link half the price to the energy index, with an indexed ceiling', 'Ask for open books every quarter'], answer: 2,
      why: "Indexing public cost drivers removes the need to renegotiate and the temptation to exploit what you've learned." }
  ] }
});
