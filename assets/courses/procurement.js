/* Course 6: Designing a Winning Tender. Built from training-library/courses/06-designing-a-winning-tender.md */
(window.GAMBIT_COURSES = window.GAMBIT_COURSES || []).push({
  id: 'procurement', order: 6, track: 'Procurement', title: 'Designing a Winning Tender', piece: 'rook',
  price: 9.89,
  status: 'live', level: 'Intermediate', minutes: 113,
  summary: "Run tenders where the rules are fixed before anyone bids, so suppliers give their best offer first time instead of holding back.",
  outcomes: [
    "Diagnose why a decide-later tender leaks value, and spot a missing Race, Ruler or Rulebook",
    "Redesign a sourcing process so you decide first, then bid, and judge when it's worth the effort",
    "Use commitment, transparency and well-built baskets to make suppliers compete on your terms",
    "Hold the line with suppliers at the rules briefing and on award day without giving anything away"
  ],
  modules: [
    { title: 'Why tenders leak', lessons: [

      { id: 'why-tenders-leak', title: 'Why most tenders leak value', minutes: 10, kind: 'Concept', preview: true, steps: [
        { t: 'read', title: 'The tender that taught suppliers to wait', body: [
          "An appliance maker tenders a contract for washing-machine drums. Three suppliers quote. Buying negotiates with them for two weeks. Then engineering, quality and finance meet to 'decide', and the incumbent gets it, as usual.",
          "Ask what each supplier just learned. The incumbent learned it doesn't need to move. The challengers learned that their best price wasn't what decided it. Next time, all three will hold back.",
          "<b>If the final call is made after the bids, on criteria nobody wrote down, the best bid isn't what wins. Suppliers notice.</b> This course is about undoing that: deciding the rules before anyone bids."
        ] },
        { t: 'choice', title: 'The veto', q: "Your engineering lead says: 'Run the tender, but we want a final veto on the winner.' What happens to supplier incentives?",
          options: [
            { text: 'Nothing, a veto is just a safety net', why: "Suppliers can't see a safety net, they see a back door. A veto means a sharper price might still lose." },
            { text: 'Suppliers bid harder to impress engineering', why: "They'll lobby engineering, not cut price. Effort goes into influence, not into the offer." },
            { text: 'Suppliers hold back, because their price may not decide the result', ok: true, why: "Right. If price and performance don't decide it, there's no reason to give your best number." },
            { text: 'Only the incumbent is affected', why: "Everyone is. Challengers suspect the outcome is fixed, so they don't bother sharpening their pencils." }
          ] },
        { t: 'read', title: 'Five ways a decision leaks', body: [
          "The traditional process has three habits. It <b>favours the incumbent</b>, it gives suppliers <b>no reason to move</b>, and <b>the loudest voice wins</b>. When the decision rests on rumours, preferences and price alone, the same five things keep going wrong.",
          "A high-quality supplier is dropped purely on cost. A supplier is vetoed on a rumour, or on one person's comment with no analysis. Suppliers are judged without input from the people who'll live with the part.",
          "One supplier is overvalued and the award turns into an internal fight. And the supplier with the best whole-life cost is quietly eliminated. The root cause is the same every time: the decision comes <b>after</b> the offers and isn't bound to them."
        ] },
        { t: 'sort', title: 'Leaks value or protects value?', prompt: 'Sort each habit. Ask yourself: does it tell suppliers their offer decides the result?',
          buckets: ['Leaks value', 'Protects value'],
          items: [
            { text: 'Stakeholders agree the award rules before quotes arrive', bucket: 1, why: 'The decision is made before the bids, so the bids decide the winner.' },
            { text: "A supplier is excluded after someone says 'I heard their plant is struggling'", bucket: 0, why: 'A rumour with no analysis. Every supplier learns that gossip can beat a good offer.' },
            { text: 'Suppliers are told exactly how the winner will be chosen', bucket: 1, why: 'If they know what wins, they can aim for it.' },
            { text: 'The final decision meeting happens after negotiations close', bucket: 0, why: "That's the classic leak: the offers don't bind the decision." },
            { text: 'Quality differences between suppliers are priced in money before bidding', bucket: 1, why: 'Priced differences mean suppliers can compare offers like for like.' },
            { text: "The incumbent is invited to 'match the best offer' at the end", bucket: 0, why: "Challengers learn their bids only set the incumbent's price, so next time they won't bother." }
          ] },
        { t: 'summary', points: [
          'Most tenders decide after the bids, so suppliers learn to hold back.',
          'The traditional process favours the incumbent and the loudest voice.',
          'The fix is to set the rules before anyone bids.'
        ] }
      ] },

      { id: 'bidding-vs-auction', title: 'Bidding vs auction', minutes: 12, kind: 'Game', steps: [
        { t: 'read', title: 'Bidding or auction?', body: [
          "Two words that sound alike. In a <b>bidding</b>, suppliers send offers, then the buyer decides on criteria nobody knows. In an <b>auction</b>, the rules are announced first and the best offer under those rules wins. In this course we call that second kind a <b>Rules-First Tender</b>.",
          "Same suppliers, very different game. In a bidding, suppliers learn not to show their hand. If a low price doesn't guarantee a win, all it does is tell the buyer the work could be done cheaper, which invites a squeeze.",
          "<b>In a bidding, the buyer chooses after the offers. In an auction, the rules choose, and the buyer committed to them first.</b> Play the supplier for a moment and you'll see why that matters."
        ] },
        { t: 'slider', title: 'Play the supplier in a bidding', prompt: "Your cost is £80. The buyer decides on things you can't see, so a lower bid barely improves your chances. Find the bid that earns most on average.",
          inputs: [ { id: 'bid', label: 'Your bid', min: 80, max: 110, step: 1, value: 85, prefix: '£' } ],
          outputs: [
            { id: 'margin', label: 'Margin if you win', expr: 'bid - 80', prefix: '£' },
            { id: 'chance', label: 'Chance of winning', expr: '(145 - bid) / 150 * 100', suffix: '%' },
            { id: 'avg', label: 'Expected margin', expr: 'chance / 100 * margin', prefix: '£', decimals: 2 }
          ],
          goal: { expr: 'avg >= 6', text: 'Get your expected margin to £6 or more.' },
          explain: "At £85 you win 40% of the time and make £5: £2 on average. At £100 you win 30% of the time and make £20: £6 on average. When price barely moves your chances, a fat margin wins, and every supplier does the same sum. That's why biddings drift upwards." },
        { t: 'choice', title: 'Do the sum', q: 'Your cost is £80. In a bidding, a £100 bid gives you a 30% chance and an £85 bid gives 40%. Which bid earns more on average?',
          options: [
            { text: '£100: expected margin £6 vs £2', ok: true, why: "Right. 0.3 × £20 = £6 beats 0.4 × £5 = £2. A small chance at a high price beats a slightly better chance at a low price." },
            { text: '£85: a better chance of winning is always worth it', why: '0.4 × £5 = £2, which is less than 0.3 × £20 = £6.' },
            { text: "They're the same", why: 'Work out chance × margin for each: £6 against £2.' },
            { text: 'Bid £80 to be safe', why: 'Winning at cost earns nothing.' }
          ] },
        { t: 'read', title: 'An auction flips the sum', body: [
          "Now commit to a rule: the lowest True Price wins, full stop. A £100 bid loses to any rival at £85. Each supplier now faces a prisoner's dilemma with its rivals: all would do better holding high, but each does better by undercutting. That's good news for you.",
          "There's a second advantage. Negotiating well needs good information about each supplier's walk-away point, which is hard to get. An auction needs far less, because competition makes suppliers reveal how low they'll go."
        ] },
        { t: 'choice', title: 'Negotiator or auction?', q: "Researchers had buyers negotiate by chat with two suppliers, then compared the price with a simple sealed-bid auction for the same item. If you'd been one of the professional buyers, where would your price most likely have landed?",
          options: [
            { text: "Well below the auction's average", why: "A few stars managed it. In the study, only about one negotiator in six beat the auction's average price." },
            { text: 'Higher on average than the auction, and much less predictable', ok: true, why: "Right. The auction's prices sat in a tight band. Professionals were spread more widely and paid more on average, and students were spread wider still. Only about one negotiator in six beat the auction." },
            { text: 'About the same, give or take a pound', why: 'The auction was lower on average than both groups of negotiators, and far more consistent.' },
            { text: 'Exactly the same every time', why: "Negotiated prices varied a lot from buyer to buyer. That spread is part of the cost of negotiating." }
          ] },
        { t: 'read', title: 'What the lab found', body: [
          "Research by Gretschko and co-authors compared chat negotiations with a simple sealed-bid auction. Buyers, some professionals and some students, negotiated with two suppliers and then took best-and-final offers.",
          "On average the auction got a lower price than both groups of negotiators, and its results were far more consistent. Only around one negotiator in six beat the auction's average. A few stars can out-negotiate an auction. Most of us can't, and we can't tell in advance which we are."
        ] },
        { t: 'choice', title: 'Why less information?', q: 'Why does a committed auction need less information than a negotiation?',
          options: [
            { text: 'Suppliers are legally required to disclose costs', why: 'Nobody has to tell you their costs.' },
            { text: "Competition makes suppliers reveal how low they'll go", ok: true, why: "Right. You don't need to guess each walk-away point; rivals push each other towards it." },
            { text: 'Auctions only work when you already know the costs', why: "It's the other way round. The auction discovers the price for you." },
            { text: "Negotiators can't ask questions in an auction", why: "You can ask, but you don't need to rely on the answers." }
          ] },
        { t: 'summary', points: [
          'A bidding decides after the offers; an auction decides by rules fixed first.',
          'Biddings reward high bids and quiet collusion.',
          'In lab tests, most negotiators did worse than a simple auction.'
        ] }
      ] }
    ] },

    { title: 'Decide first, then bid', lessons: [

      { id: 'race-ruler-rulebook', title: 'Race, Ruler, Rulebook: decide first, then bid', minutes: 12, kind: 'Concept', steps: [
        { t: 'read', title: 'Race, Ruler, Rulebook', body: [
          "A strong tender needs three things. A <b>Race</b>: real competition between suppliers who can all win, set up under rules agreed in advance. A <b>Ruler</b>: one like-for-like measure of every supplier in money, the True Price, so decisions rest on facts.",
          "And a <b>Rulebook</b>: full commitment to the rules before the final round, so honest bidding becomes each supplier's best move. Without it, the race isn't real.",
          "<b>A tender is only as strong as the weakest of the three.</b> Credits and charges build the Ruler (Course 7). The Rulebook document gives you commitment. Award day runs the Race."
        ] },
        { t: 'read', title: 'Decide first, then bid', body: [
          "Traditional order: strategy, supplier set, request for quotation (RFQ), quote summary, negotiations, <b>then</b> the stakeholder decision, then the award. The decision comes after the bids.",
          "Rules-First order: strategy, supplier set, RFQ, quote summary, then <b>price the differences and get stakeholders to sign</b>, design the final round, brief suppliers on the rules, and run <b>award day</b>, where the binding round awards the business.",
          "Typical timings: 4-8 weeks to price the differences and build the True Price calculators, about 2 weeks to design the final round, about 2 weeks for internal sign-off, and 2-4 weeks for rules briefings and award day, including a two-week sign-up window."
        ] },
        { t: 'sort', title: 'Before or on award day?', prompt: 'In a Rules-First Tender, where does each step happen?',
          buckets: ['Before award day', 'On award day'],
          items: [
            { text: 'Stakeholders sign off how the winner will be chosen', bucket: 0, why: "That's the whole point: the decision moves before the bids." },
            { text: 'First quotes come in and are summarised', bucket: 0, why: 'Early quotes give you the facts to price the differences.' },
            { text: 'Credits and charges are priced for every supplier', bucket: 0, why: 'The Ruler has to exist before anyone bids against it.' },
            { text: 'Each supplier hears the rules at a rules briefing', bucket: 0, why: 'Suppliers need time to understand the rules and sign up.' },
            { text: 'The binding round runs and decides the winner', bucket: 1, why: 'On award day, what suppliers do decides the result directly.' },
            { text: 'The contract is signed', bucket: 1, why: 'Signing on the day keeps everyone to the commitment.' }
          ] },
        { t: 'choice', title: 'Spot the leak', q: 'In a traditional tender, where does the stakeholder decision sit?',
          options: [
            { text: 'Before the request for quotation goes out', why: "That's closer to a Rules-First Tender. In the traditional order it comes much later." },
            { text: 'After the negotiations have closed', ok: true, why: "Right. That's the leak: suppliers know their offers don't bind the decision, so they lobby and hold back." },
            { text: 'There is no stakeholder decision', why: "There is one, it's just made last, on criteria suppliers never see." },
            { text: 'At the same time as the first quotes', why: 'No, it comes after the haggling is over.' }
          ] },
        { t: 'choice', title: 'Which one is missing?', q: "Suppliers are told the rules and everyone signs, but quality differences are left to 'judgement on the day'. Which is weakest?",
          options: [
            { text: 'Race', why: "There are rivals. The problem is how they're compared." },
            { text: 'Ruler', ok: true, why: "Right. 'Judgement on the day' means suppliers can't compare offers like for like, so they can't tell what wins." },
            { text: 'Rulebook', why: 'Everyone signed. But signing up to a vague rule is weak, and the vagueness is a Ruler problem.' },
            { text: "None, it's fine", why: 'An unpriced difference is a back door.' }
          ] },
        { t: 'choice', title: 'Why move the decision?', q: 'Why does pulling the stakeholder decision forward help competition?',
          options: [
            { text: 'Suppliers know their offer, not their lobbying, decides the result', ok: true, why: 'Right. Effort goes into price and performance instead of influence.' },
            { text: "It's faster", why: "It's usually slower to prepare. The gain is in how suppliers behave." },
            { text: 'Stakeholders stop caring', why: 'They care more, because they set the rules.' }
          ] },
        { t: 'summary', points: [
          'A tender needs a Race, a Ruler and a Rulebook.',
          'Decide first, then bid: the stakeholder decision moves before the offers.',
          "The extra preparation buys suppliers' best offers."
        ] }
      ] },

      { id: 'when-to-use-it', title: 'When to use it, and when not', minutes: 8, kind: 'Concept', steps: [
        { t: 'read', title: 'Worth it or not?', body: [
          "<b>Use a Rules-First Tender when</b> more than one supplier could genuinely win, you have enough people across functions to prepare, the product is complex or attractive to suppliers, and the lifetime contract value is high.",
          "<b>Don't use it when</b> stakeholders or seniors won't commit to the process and its result, someone wants to pick a supplier or make a 'strategic' award, the deadline leaves no time for the steps, or you can't get solid data before award day.",
          "The first 'don't' is the killer. If your stakeholders won't be bound by the result, the commitment is fake, and suppliers will spot it. A fake Rules-First Tender is worse than an honest bidding. <b>If your own side won't be bound by the result, don't pretend it will.</b>"
        ] },
        { t: 'sort', title: 'Rules-First or something else?', prompt: 'Sort each situation.',
          buckets: ['Rules-First Tender', 'Something else'],
          items: [
            { text: 'A five-year £30m contract for washing-machine motors, four capable suppliers, a team of six across functions', bucket: 0, why: 'High value, a real race and people to prepare. Ideal.' },
            { text: 'A £15k office furniture order needed next week', bucket: 1, why: 'Low value and no time for the steps.' },
            { text: 'The CEO has already promised the work to a partner firm', bucket: 1, why: "A strategic award. There's no real race, so don't pretend there is." },
            { text: 'A new coffee-machine sensor three suppliers are keen to win, nine months before it is needed', bucket: 0, why: 'Attractive work, several contenders and time to prepare.' },
            { text: "Engineering can't freeze the scope until after the award", bucket: 1, why: 'No solid data. Fix the scope first, or agree a change price list (Course 7).' },
            { text: 'Two qualified suppliers, high value, finance and engineering both willing to sign the rules', bucket: 0, why: 'Two real contenders and a side that will commit. Enough.' }
          ] },
        { t: 'choice', title: 'Tight deadline', q: 'A high-value contract, four capable suppliers, a committed team, but the contract has to be signed in three weeks. Rules-First Tender?',
          options: [
            { text: 'Yes, the value justifies it', why: 'Value matters, but pricing the differences alone typically takes 4-8 weeks. Rushed, the Ruler will be wrong.' },
            { text: "No, there isn't time for the steps, so run something simpler now and plan a Rules-First Tender for next time", ok: true, why: 'Right. A deadline that skips the preparation breaks the Ruler and the Rulebook. Start earlier next time.' },
            { text: 'Yes, but skip the rules briefings', why: "Suppliers who haven't heard and signed the rules aren't bound by them." },
            { text: 'Yes, but leave credits and charges for after the award', why: "Then the award is decided after the bids again, which is the leak you're trying to fix." }
          ] },
        { t: 'choice', title: 'The half-hearted sponsor', q: "Your finance director says: 'Run it, but if the result looks odd we'll overrule it.' What now?",
          options: [
            { text: "Run it anyway and hope they don't overrule", why: 'Suppliers will hear about the escape hatch, and bid as if it were a bidding.' },
            { text: 'Get a firm commitment first, or run an honest bidding instead', ok: true, why: "Right. A Rules-First Tender only works if your side is bound. If it won't be, don't pretend." },
            { text: "Keep the overrule secret from suppliers", why: "Then you're promising suppliers something you can't deliver, and your next tender pays for it." },
            { text: 'Add more suppliers to make up for it', why: "More suppliers won't fix a missing commitment. They'll still hold back." }
          ] },
        { t: 'summary', points: [
          'Use it for high-value, contestable work with time and people to prepare.',
          "Skip it when your own side won't commit.",
          'Fake commitment costs more than none.'
        ] }
      ] },

      { id: 'tying-your-hands', title: 'Tying your hands in a tender', minutes: 12, kind: 'Game', steps: [
        { t: 'read', title: 'Same suppliers, every quarter', body: [
          "Most procurement isn't a one-off. The same few suppliers bid for your contracts again and again, year after year, and they remember exactly how the last round went and who blinked first.",
          "Play the supplier's side to feel why that matters. You and one rival bid for the same contract every quarter. Hold your price, or undercut and grab the work?"
        ] },
        { t: 'repeated', title: 'Eight quarters', prompt: "Hold your price or undercut? Your rival follows a fixed rule you'll see at the end. Payoffs are margin in £k per quarter.",
          rounds: 8, roundName: 'Q', moves: ['Hold price', 'Undercut'], short: ['H', 'U'],
          rows: ['You hold', 'You undercut'], cols: ['Rival holds', 'Rival undercuts'], pay: [[[3, 3], [0, 5]], [[5, 0], [1, 1]]], unit: 'margin, £k', bot: 'tft' },
        { t: 'read', title: 'Now switch chairs', body: [
          "Your rival played tit-for-tat: it copied whatever you did last quarter. Against that rule, holding your price pays, because every undercut starts a price war. Suppliers who meet every quarter can keep prices high without ever talking.",
          "<b>That quiet co-operation is paid for by the buyer. Next: how commitment breaks it.</b> The trick is old: you strengthen your position by removing your own options, as Cortés did when he scuttled his ships."
        ] },
        { t: 'read', title: 'Burn the second round', body: [
          "In a tender, the option to give up is the <b>second round</b>: haggling with the winner after the award. Say a supplier's cost is £80. If you've committed to 'lowest True Price wins, no second round', competition pushes the winning bid to about £85.",
          "If suppliers expect a squeeze after the award, a sharp £85 bid would be squeezed below cost. So they bid £100 with a cushion and give £8 away in the 'final' round. You pay £92 and feel clever.",
          "<b>If suppliers expect you to haggle after the award, they'll keep something back to give you.</b> Work out what that costs you in the game below."
        ] },
        { t: 'tree', title: 'Commit or keep the second round?', prompt: 'You move first, then the supplier bids. Pick what each player does at every point, then check. The buyer\'s payoff is the price paid, as a negative; the supplier\'s is its margin.',
          players: ['Buyer', 'Supplier'], unit: '£ per unit',
          root: { p: 0, options: [
            { label: 'Commit: no second round', next: { p: 1, options: [
              { label: 'Bid sharp at £85', pay: [-85, 5] },
              { label: 'Bid £100 with a cushion', pay: [-85, 0] } ] } },
            { label: 'Keep a second round', next: { p: 1, options: [
              { label: 'Bid sharp at £85', pay: [-77, -3] },
              { label: 'Bid £100 with a cushion', pay: [-92, 12] } ] } } ] },
          explain: "Solve it backwards. If you commit, a £100 bid loses to a rival at £85, so the supplier bids sharp: you pay £85. If you keep a second round, a sharp bid gets squeezed to £77, below its £80 cost, so it bids £100 and gives back £8: you pay £92. Committing is worth £7 a unit. With it, suppliers can predict you, so they compete." },
        { t: 'choice', title: 'What do you pay?', q: "The buyer announces 'lowest True Price wins, no second round', and sticks to it. Roughly what price does it end up paying?",
          options: [
            { text: '£100, suppliers always bid high', why: 'Only when they expect a squeeze. Here there is nothing to protect against.' },
            { text: '£92, the same as before', why: "That's the result without commitment." },
            { text: 'About £85', ok: true, why: 'Right. With no second round to protect against, rivals compete the cushion away.' },
            { text: '£80', why: 'No supplier wins work at cost; competition stops a little above it.' }
          ] },
        { t: 'choice', title: 'What the lab found', q: "Research by Gretschko and co-authors ran repeated auctions in which prices crept up round after round towards the most the buyer would pay. What stopped it?",
          options: [
            { text: 'Adding more rounds', why: 'More rounds gave suppliers more chances to settle into quiet co-operation.' },
            { text: 'The buyer committing to its scoring rule before each auction', ok: true, why: "Right. When the buyer decided after each auction, prices crept up. Once the rule was fixed in advance, undercutting really won, and prices stayed far lower." },
            { text: "Telling suppliers each other's names", why: 'That makes quiet collusion easier, not harder.' },
            { text: 'Putting less weight on quality', why: 'The fix was commitment, not the weighting.' }
          ] },
        { t: 'summary', points: [
          'Giving up the second round makes suppliers bid their best first.',
          'Every broken rule teaches suppliers to hold back next time.',
          'Commitment breaks quiet collusion in repeated tenders.'
        ] }
      ] }
    ] },

    { title: 'Building the Rulebook', lessons: [

      { id: 'the-rulebook', title: 'The Rulebook', minutes: 12, kind: 'Concept', steps: [
        { t: 'read', title: 'One document, two signatures', body: [
          "<b>The Rulebook</b> is the document you send suppliers before award day. It makes the process transparent and shows that your side is committed to both the process and the outcome.",
          "It carries two signature pages. One is signed by everyone on your side who could otherwise reopen the decision: buying, engineering, product, finance, quality and logistics. The other is signed by the supplier, which commits it to the process too.",
          "Signatures are a commitment device: they remove the option to back out, and suppliers can see that. <b>A signature page is a branch of the game tree you've cut off, in ink.</b>"
        ] },
        { t: 'read', title: 'What goes in, what stays out', body: [
          "In: the project overview (scope, specification, volumes by year, launch date); each supplier's credits and charges, and the logic of anything it can still improve; engineering and logistics assumptions; what to quote (unit price, yearly price reductions, design and testing costs, tooling).",
          "Also in: the change price list, general terms, the award design (format, baskets, who can win what, timeline), both signature pages and contacts. Anything unusual, like shared tooling or payment schedules, gets cleared by your legal team first.",
          "Out: your target price, your walk-away point, your should-cost estimates and your view of who's favourite. Loose lips sink ships. <b>Share the rules, never your targets.</b>"
        ] },
        { t: 'sort', title: 'In the Rulebook or internal?', prompt: 'Sort each item.',
          buckets: ['Goes in the Rulebook', 'Stays internal'],
          items: [
            { text: 'How the winner will be chosen', bucket: 0, why: 'This is the heart of the Rulebook.' },
            { text: "Your finance team's target price", bucket: 1, why: "Reveal it and it becomes everyone's floor." },
            { text: 'Annual volumes by year', bucket: 0, why: 'Suppliers need them to price properly.' },
            { text: "Each supplier's total credits and charges", bucket: 0, why: 'Each supplier needs to know how its differences were priced.' },
            { text: 'Your should-cost estimate for the part', bucket: 1, why: 'It tells suppliers how low you think they can go. Keep it.' },
            { text: 'The logic of a criterion the supplier can still improve, like warranty length', bucket: 0, why: 'Share it so they can act on it and improve their True Price.' },
            { text: 'Which supplier engineering secretly prefers', bucket: 1, why: "Keep it out. And if the preference is real, it should already be priced as a credit or charge, not secret." },
            { text: 'Signature page for your engineering, quality and finance leads', bucket: 0, why: 'Suppliers seeing those signatures is what makes the commitment credible.' }
          ] },
        { t: 'choice', title: 'Why show your signatures?', q: "Why include your own stakeholders' signatures in a document suppliers will read?",
          options: [
            { text: "It's a legal requirement", why: "It isn't. It's strategy." },
            { text: 'It shows suppliers nobody on your side can reopen the decision', ok: true, why: 'Right. A visible commitment changes what suppliers expect, so it changes how they bid.' },
            { text: 'So suppliers know who to lobby', why: "The opposite: it tells them lobbying won't work." },
            { text: 'To share the blame if it goes wrong', why: "That's not why it works." }
          ] },
        { t: 'summary', points: [
          'The Rulebook makes the rules public and the commitment visible.',
          'Signatures on both sides remove the back doors.',
          'Share the rules, never your targets.'
        ] }
      ] },

      { id: 'who-can-win-what', title: 'Who can win what: baskets and supplier sets', minutes: 10, kind: 'Game', steps: [
        { t: 'read', title: 'Who can win what', body: [
          "Before you pick a format, decide <b>who can win what</b>: how the business splits into baskets, which suppliers may bid for each, and whether you want one supplier or several. As the economist Paul Klemperer puts it, roughly, good auction design isn't one size fits all.",
          "Here's a grid for three suppliers and three baskets. <b>Housings:</b> A and B can supply. <b>Brackets:</b> A and C can supply. <b>Covers:</b> only C can supply."
        ] },
        { t: 'choice', title: 'Find the gap', q: 'Housings: A and B. Brackets: A and C. Covers: only C. Which basket has no competition?',
          options: [
            { text: 'Housings', why: 'A and B both qualify, so there is a race.' },
            { text: 'Brackets', why: 'A and C both qualify, so there is a race.' },
            { text: 'Covers', ok: true, why: 'Right. Only C can win covers, so C can name its price.' },
            { text: 'All three are fine', why: 'Covers has a single contender. Uncontested baskets are where prices leak.' }
          ] },
        { t: 'choice', title: 'The smallest fix', q: 'What is the smallest change that puts covers back in a race?',
          options: [
            { text: "Admit Supplier A to covers, with a priced charge for any gap ('yes, if')", ok: true, why: 'Right. One change gives covers two contenders, and the charge keeps the comparison fair.' },
            { text: 'Drop covers from the tender', why: "You still need covers. You've just postponed the problem." },
            { text: 'Tell C that others are interested', why: "A bluff that breaks your rules if it's false, and C may know it is." },
            { text: 'Give C covers in return for a discount on brackets', why: "That's a side deal, not a race. Bundling covers with brackets in the rules could work, but not a private trade." }
          ] },
        { t: 'read', title: 'More athletes than medals', body: [
          "Think of the Olympics. Don't hold the games too often. You need more athletes than medals, or everyone medals. And the medals must be unequal, or nobody fights for gold.",
          "Three suppliers, three equal shares: everyone sits back and wins a share at a high price. Three suppliers, two unequal shares of 60% and 40%: one supplier goes home empty-handed, and the big share is worth fighting for. <b>If everyone is sure to win something, nobody needs to try.</b>"
        ] },
        { t: 'choice', title: 'Split the business', q: 'You have three qualified suppliers and want security of supply. Which split creates the most competition?',
          options: [
            { text: 'Three equal shares of 33%', why: "Everyone's guaranteed a share, so nobody needs to cut price." },
            { text: 'Two shares, 60% and 40%', ok: true, why: 'Right. Someone loses, and the bigger prize is worth fighting for. You still have two sources.' },
            { text: 'One supplier for 100%, the others on standby', why: 'Competitive, but you lose the security of supply you wanted.' },
            { text: 'Let suppliers pick any share they like', why: "Sometimes sensible when they know their costs best, but here they'd pick comfortable shares." }
          ] },
        { t: 'summary', points: [
          'Decide who can win what before you pick a format.',
          'Every basket needs at least two real contenders.',
          'More suppliers than shares, and unequal shares.'
        ] }
      ] }
    ] },

    { title: 'Award day', lessons: [

      { id: 'holding-the-line', title: 'Holding the line: supplier conversations', minutes: 15, kind: 'Game', steps: [
        { t: 'read', title: 'Answer everything, change nothing', body: [
          "At the <b>rules briefing</b> you meet each supplier separately and walk through the Rulebook and its True Price calculator. It does three jobs: everyone gets the same <b>information</b>, your stakeholders are there to <b>clarify</b> questions, and it sends a <b>signal</b>.",
          "<b>Explaining the rules in front of witnesses is part of what makes them binding.</b> Afterwards, answer leftover questions in writing and send each supplier its Rulebook and a locked calculator. Then comes the <b>sign-up window</b>: suppliers take the Rulebook back, get their seniors to sign, and may requote.",
          "The governing line: suppliers' concerns get answered, but they don't change the process. Come prepared, make your commitment clear, make no concessions, stay honest and polite, and reveal nothing strategic."
        ] },
        { t: 'dialogue', title: 'The rules briefing', prompt: 'A supplier pushes back during the briefing. Answer every concern without changing the rules.', them: 'Supplier B', start: 'a',
          nodes: {
            a: { say: 'Before we go on, we want to add our own conditions to the offer.', options: [
              { text: 'Your True Price calculator shows exactly how much room you have, and what each change is worth.', next: 'b', score: 2, note: 'Strong. Points them back to the rules, which already price their choices.' },
              { text: "Send them over and we'll see.", next: 'b', score: 1, note: 'Weak. It invites a list of exceptions you will then have to refuse.' },
              { text: "Fine, we'll factor them in somehow.", next: 'loseConditions', score: 0, note: 'Damaging. You just reopened the rules for one supplier.' } ] },
            b: { say: 'Why have you changed how you buy, anyway?', options: [
              { text: 'This approach suits this project, and you benefit from knowing exactly how the business will be awarded.', next: 'c', score: 2, note: "Strong. Frames the rules as good for them too." },
              { text: 'Head office told us to.', next: 'c', score: 1, note: "Weak. Sounds like you don't own the process." },
              { text: "Honestly, we're not sure it'll stick.", next: 'loseDoubt', score: 0, note: 'Damaging. If you doubt the commitment, so will they.' } ] },
            c: { say: "We can't commit until our seniors agree.", options: [
              { text: "You've got two weeks to review and sign. Only suppliers who sign take part on award day.", next: 'd', score: 2, note: 'Strong. Clear deadline, clear consequence.' },
              { text: 'Commit when you can.', next: 'd', score: 1, note: 'Weak. An open-ended window lets them wait and see.' },
              { text: 'You can join anyway and decide later.', next: 'loseJoin', score: 0, note: "Damaging. A supplier who hasn't signed isn't bound by anything." } ] },
            d: { say: 'Will you really hold the timeline?', options: [
              { text: 'Yes. Every key stakeholder has signed the process and the dates; you can see their signatures.', next: 'good', score: 2, note: 'Strong. Visible signatures do the talking.' },
              { text: "We'll try.", next: 'ok', score: 1, note: 'Weak. Trying is not committing.' },
              { text: 'Depends how the bids look.', next: 'loseDoubt', score: 0, note: "Damaging. You've told them the decision comes after the bids after all." } ] },
            good: { end: true, say: "Clear enough. We'll take it to our board and sign.", result: 'Supplier B leaves knowing the rules are fixed and that its offer decides the result.', verdict: 'good' },
            ok: { end: true, say: "Right. We'll see how it goes.", result: "You got through it, but your soft answers left room for doubt. Expect a cushion in their bid.", verdict: 'ok' },
            loseConditions: { end: true, say: "Great, we'll send a long list.", result: 'Every supplier will now ask for exceptions, and the Ruler stops measuring like for like.', verdict: 'bad' },
            loseDoubt: { end: true, say: "Then we'll keep a little back, just in case.", result: "You signalled that the rules may bend, so suppliers will bid as if it's a bidding.", verdict: 'bad' },
            loseJoin: { end: true, say: "Perfect, we'll decide once we see where it lands.", result: "An unsigned supplier can walk away or reopen terms at any point. The commitment is gone.", verdict: 'bad' }
          } },
        { t: 'read', title: 'On the day, the questions get sharper', body: [
          "On award day suppliers test you again, now with real money on the table. Some will threaten to walk out, some will fish for information about rivals, and some will just say your prices are impossible.",
          "The principle doesn't change. You hold the line by pointing to commitments already made, theirs and yours. You never reveal what the rules don't say you'll reveal, and you never invent a new rule on the spot."
        ] },
        { t: 'dialogue', title: 'Award day', prompt: 'The final round is running. Hold the line.', them: 'Supplier C', start: 'e',
          nodes: {
            e: { say: "We're out. Here's our final walk-away offer.", options: [
              { text: "You're free to stop, but your seniors signed up to how the business is awarded. Are you sure?", next: 'f', score: 2, note: 'Strong. Points to their signed commitment and changes nothing.' },
              { text: 'Let me see what I can do with that.', next: 'f', score: 1, note: "Weak. Hints there's a side door." },
              { text: "Hold on, let's talk about it separately.", next: 'loseSide', score: 0, note: 'Damaging. A private talk is a second round outside the rules.' } ] },
            f: { say: "How do we know we're not bidding against ourselves?", options: [
              { text: 'The process follows the rules we showed you at the rules briefing.', next: 'g', score: 2, note: 'Strong. Refers back to the rules, reveals nothing.' },
              { text: 'Trust us.', next: 'g', score: 1, note: 'Weak. Asking for trust instead of pointing to the rules.' },
              { text: 'There are definitely three others.', next: 'loseLeak', score: 0, note: 'Damaging. You revealed information the rules never promised to share.' } ] },
            g: { say: 'Your prices are miles from what we can accept.', options: [
              { text: "You're free to decline any step; the rules pick the best supplier.", next: 'good', score: 2, note: 'Strong. Calm, honest, and the rules do the work.' },
              { text: "I hear you, let's see where the others land.", next: 'ok', score: 1, note: "Weak. Hints you'll adjust depending on rivals." },
              { text: 'Maybe we can lower the next step for you.', next: 'loseSide', score: 0, note: 'Damaging. Changing a step for one supplier breaks the rules for all.' } ] },
            good: { end: true, say: "Fine. We'll accept this step.", result: 'The round ran exactly as announced, and the supplier stayed in on your terms.', verdict: 'good' },
            ok: { end: true, say: "We'll think about it.", result: 'Nothing broke, but your hints gave the supplier a reason to test you again next time.', verdict: 'ok' },
            loseSide: { end: true, say: "Good. Let's sort something out between us.", result: "You've opened a side deal, and the other suppliers' bids no longer decide the result.", verdict: 'bad' },
            loseLeak: { end: true, say: "Three? Then we'll pace ourselves.", result: 'Information outside the rules lets suppliers calculate how little they need to give.', verdict: 'bad' }
          } },
        { t: 'summary', points: [
          'Give everyone the same information, in front of witnesses.',
          'Answer every concern; change nothing in the process.',
          'Point back to commitments already signed.'
        ] }
      ] },

      { id: 'award-day-playbook', title: 'Award day playbook', minutes: 10, kind: 'Concept', steps: [
        { t: 'read', title: 'Separate rooms, one Rulebook', body: [
          "Face to face: one large team room for your side and one room per supplier, as far apart as possible, ideally on different floors. No shared social spaces, lunch in the rooms, helpers to carry messages, staggered arrivals, and a reception desk that knows nothing detailed.",
          "Online: a team room plus an all-day video call per supplier, cameras on. Either way, bring the schedule, bid sheets, every supplier's True Price calculator, your summary of whole-life costs and the draft contract, which suppliers should already have.",
          "<b>Everything about the venue is designed so suppliers learn only what the rules say they should.</b> Security matters too: clear the team room when you leave, mind the windows, and check no supplier is in the corridor."
        ] },
        { t: 'read', title: 'On the day and after', body: [
          "Arrive first. Welcome each supplier with the whole team, stakeholders included, and re-explain the process. Keep to the schedule. When a supplier accepts a price step, check its True Price calculator before you announce anything. Then tell the winner, notify the others, and sign the contract that day.",
          "Afterwards: write a results note, archive the Rulebook, change price list and winning quote, and offer every supplier a debrief on how its credits and charges were priced. Whatever format you chose (Course 8), run it exactly as announced."
        ] },
        { t: 'sort', title: 'Do or don\'t?', prompt: 'Sort each award day choice.',
          buckets: ['Do', "Don't"],
          items: [
            { text: 'Put supplier rooms on different floors', bucket: 0, why: 'Suppliers who never meet learn only what the rules tell them.' },
            { text: 'Serve lunch in the hotel restaurant for everyone', bucket: 1, why: 'Suppliers meet, talk and compare notes.' },
            { text: "Check the supplier's True Price calculator before announcing the winner", bucket: 0, why: 'Announce the wrong winner and your credibility is gone.' },
            { text: "Tell a slow supplier 'the others are well ahead of you'", bucket: 1, why: "It's information the rules don't promise, and if it's a bluff it breaks your rules." },
            { text: 'Send the draft contract before the day', bucket: 0, why: 'Then there is nothing left to haggle over when it is time to sign.' },
            { text: 'Agree to finalise the contract next week', bucket: 1, why: "You lose the day's commitment and invite a second round." }
          ] },
        { t: 'choice', title: 'Four o\'clock', q: "At 4pm the winning supplier says: 'We can't sign today, our director is travelling.' Best reply?",
          options: [
            { text: 'No problem, sign next week', why: "You've just reopened the deal for a week." },
            { text: 'You committed to bringing your decision makers. The contract is signed today.', ok: true, why: 'Right. Their commitment is in writing in the Rulebook. Use it.' },
            { text: "Then we'll go to the runner-up", why: "Only if your announced rules say so. Don't invent rules on the day." },
            { text: "Let's agree a small discount for the delay", why: "That's a second round, the thing you promised not to run." }
          ] },
        { t: 'summary', points: [
          'Keep suppliers apart and information controlled.',
          'Check before you announce, and sign on the day.',
          'Debrief every supplier afterwards; it builds your reputation for next time.'
        ] }
      ] },

      { id: 'colour-display-case', title: 'Case: the colour-display tender', minutes: 12, kind: 'Case', steps: [
        { t: 'read', title: 'The favourite problem', body: [
          "You buy for a fast-growing smartwatch maker. Next year's model needs its first colour touch display. It's new technology: nobody, suppliers included, really knows what it costs to make. Eight suppliers across five regions are interested, but their technologies differ and only a few meet the full specification.",
          "Your engineers have been building prototypes with Supplier A, and everyone believes A will win. The others say: 'You obviously want A, so why should we sharpen our pencils?' <b>When everyone knows who'll win, only the winner has a reason to bid.</b>",
          "You have four problems: no Race, no Ruler, suppliers who can't cover the full volume or specification, and so many suppliers and regions that everyone could be promised something. Make four design decisions."
        ] },
        { t: 'choice', title: 'Decision 1 of 4', q: 'How do you get the challengers to try?',
          options: [
            { text: "Tell them A isn't really the favourite", why: "Nobody will believe it. Words don't change a visible favourite." },
            { text: 'Split the specification into a high-end and a low-end version', ok: true, why: 'Right. Suppliers with other technologies now have a prize they can genuinely win. Sharing more information helps here: it shows there is a real prize.' },
            { text: 'Exclude Supplier A', why: 'You lose your best supplier, and the others know you need it.' }
          ] },
        { t: 'choice', title: 'Decision 2 of 4', q: 'How do you compare displays built on different technologies?',
          options: [
            { text: 'A 100-point score for each supplier', why: "Points can't be compared with pounds, so suppliers can't tell what a better offer is worth (Course 7)." },
            { text: 'Price every difference in money with credits and charges, and compare True Prices', ok: true, why: 'Right. One Ruler in pounds lets different technologies compete fairly.' },
            { text: 'Ignore the differences and go on quoted price', why: "You'd risk picking a display that fails." }
          ] },
        { t: 'choice', title: 'Decision 3 of 4', q: 'What do you do with Supplier A?',
          options: [
            { text: 'Let A into the auction for everything', why: 'The challengers give up again: they still expect A to win.' },
            { text: 'Make A a committed take-it-or-leave-it offer for a fixed share', ok: true, why: "Right. Ring-fencing A's share shows the challengers that the rest is genuinely open." },
            { text: 'Promise A the whole contract', why: "That's no Race at all, and A knows it." }
          ] },
        { t: 'choice', title: 'Decision 4 of 4', q: 'How much do you award now?',
          options: [
            { text: '100%, split equally three ways', why: 'Everyone medals, so nobody needs to fight.' },
            { text: '60% now in two blocks, 40% held back', ok: true, why: 'Right. Not everyone can be served, so the blocks are worth fighting for, and you keep an option on the rest.' },
            { text: '100% to the auction winner', why: 'No security of supply, and Supplier A walks away.' }
          ] },
        { t: 'read', title: 'What happened', body: [
          "The design: a short beauty contest to qualify suppliers. Then a take-it-or-leave-it offer to Supplier A for <b>30%</b> of the volume at a committed <b>£18 a unit</b>. Then an auction among everyone else for <b>another 30%</b>, where suppliers who couldn't meet the top spec bid with the low-end version. <b>40%</b> was held back.",
          "A accepted the £18 offer on the spot. The challengers, seeing a real 30% at stake, competed hard. Then the smartwatch market slumped, and the last 40% was never awarded. Holding it back meant the buyer never had to buy volume it no longer needed."
        ] },
        { t: 'choice', title: 'Reading the instant yes', q: 'Supplier A accepted the take-it-or-leave-it offer straight away. What does that tell you?',
          options: [
            { text: 'The design failed', why: 'No. A took a share and the challengers still competed.' },
            { text: 'The price was probably generous', ok: true, why: 'Right. An instant yes means A would have taken less. Use the auction prices to set the next offer.' },
            { text: 'A had no other customers', why: "Possible, but you can't tell that from this." },
            { text: 'Take-it-or-leave-it offers always work', why: "Only when you've priced them well and can walk away." }
          ] },
        { t: 'summary', points: [
          'A favourite kills competition unless you ring-fence it.',
          'Split specs and price differences so challengers can win.',
          'Holding volume back keeps your options open.'
        ] }
      ] }
    ] }
  ],
  exam: { pass: 7, questions: [
    { q: "A council collects three quotes for a cleaning contract, negotiates with all three, then lets a committee choose 'on overall merit'. What kind of process is this?",
      options: ['A Rules-First Tender', 'A first-price sealed bid', 'A bidding', 'A take-it-or-leave-it offer'], answer: 2,
      why: "The award is decided after the offers, on criteria suppliers can't see." },
    { q: 'Your cost is £50. In a bidding, a £70 bid wins 25% of the time and a £55 bid 35%. Which earns more on average?',
      options: ['£70 (£5 vs £1.75)', '£55', "They're equal", 'It depends on the format'], answer: 0,
      why: '0.25 × £20 = £5; 0.35 × £5 = £1.75. Biddings reward fat margins.' },
    { q: "A hospital trust tells suppliers the award rules, but will rate 'clinical preference' on the day. Which of Race, Ruler and Rulebook is weakest?",
      options: ['Race', 'Ruler', 'Rulebook', 'None'], answer: 1,
      why: "An unpriced preference means suppliers can't compare offers like for like." },
    { q: "What's the core change in 'decide first, then bid'?",
      options: ['Negotiate before sending the RFQ', 'Get the stakeholder decision before suppliers bid', 'Let suppliers set the rules', 'Skip the quote summary'], answer: 1,
      why: 'Commitment moves ahead of the final round, so the offers decide the result.' },
    { q: 'When is a Rules-First Tender a bad idea?',
      options: ['A high-value contract with four capable suppliers', 'A complex product suppliers want', "The managing director has already promised the work to a friend's firm", 'Nine months before the contract is needed'], answer: 2,
      why: "If your side won't be bound by the result, the commitment is fake." },
    { q: 'A buyer is known to haggle with the winner after every tender. What do suppliers do?',
      options: ['Bid at cost', 'Build in a cushion to give away later', 'Refuse to bid', 'Bid exactly as they would otherwise'], answer: 1,
      why: 'Anticipating the squeeze, they keep something back.' },
    { q: 'Which item belongs in the Rulebook you send suppliers?',
      options: ['Your target price', 'Your should-cost estimate', 'How the winner will be chosen', 'Which supplier engineering prefers'], answer: 2,
      why: 'Share the rules, never your targets.' },
    { q: "Four suppliers, four equal shares of a contract. What's the risk?",
      options: ['Too much competition', 'Everyone wins a share without cutting price', 'Nobody bids', 'The lowest bidder gets too much'], answer: 1,
      why: 'You need more athletes than medals, and unequal medals.' },
    { q: "On award day a supplier says: 'We're out, here's our final offer.' What's the strongest reply?",
      options: ["'Let's talk privately about it.'", "'I'll see what I can do.'", "'You're free to stop, but your seniors signed up to how this is awarded. Are you sure?'", "'The others are well ahead anyway.'"], answer: 2,
      why: 'Point to their commitment; change nothing; reveal nothing.' },
    { q: 'A favourite supplier accepts your take-it-or-leave-it offer for a ring-fenced share in seconds. Best conclusion?',
      options: ['The design failed', 'Offer it more volume', 'Your price was probably generous; use the auction results to calibrate next time', 'Cancel the auction'], answer: 2,
      why: 'An instant yes means it would have taken less.' }
  ] }
});
