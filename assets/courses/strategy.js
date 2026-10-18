/* Course 2: Changing the Game. Built from training-library/courses/02-changing-the-game.md */
(window.GAMBIT_COURSES = window.GAMBIT_COURSES || []).push({
  id: 'strategy', order: 2, track: 'Strategic thinking', title: 'Changing the Game', piece: 'queen',
  price: 9.89,
  status: 'live', level: 'Intermediate', minutes: 114,
  summary: "Stop playing a bad game well: change the players, rules, timing or stakes, and make your threats, promises and signals believable.",
  outcomes: [
    'Redesign an unfavourable game by changing its players, rules, timing or stakes',
    "Build commitments that make your threats and promises believable, and spot when the other side's are empty",
    'Price a strategic move: work out when a lever, a second source or a commitment is worth what it costs',
    'Send and read signals that carry real information, and tell them apart from cheap talk'
  ],
  modules: [
    {
      title: 'Redesign the game',
      lessons: [
        {
          id: 'design-the-game', title: "Don't play the game, design it", minutes: 10, kind: 'Concept', preview: true,
          steps: [
            { t: 'read', title: 'From playing to designing', body: [
              "In Course 1 you took each game as given and found the best move. This course is about something bigger: choosing which game gets played in the first place.",
              "Game theory helps in three ways. It helps you <b>avoid mistakes</b> (lesson 8 is all about them). It helps you <b>play the game</b>, picking the best move in the game you're in. And it helps you <b>change the game</b>, reshaping a structure that's working against you.",
              "Most of the value sits in the third one. A brilliant move in a bad game usually loses to an ordinary move in a good one."
            ] },
            { t: 'read', title: 'Four things you can change', body: [
              "<b>Players:</b> bring someone in or take someone out. A second supplier, a new bidder, a partner. <b>Rules:</b> change how decisions get made. In the pirates' game from Course 1, changing only the tie rule moved the split from 98/0/1/0/1 to 97/0/1/2/0.",
              "<b>Timing:</b> change who moves first, when, and how often. The cartel in Course 1 relied on meeting often. <b>The pie:</b> change what's at stake. Bundle, unbundle, add a feature, lengthen the contract.",
              "Brandenburger and Nalebuff's checklist PARTS (<i>Co-opetition</i>, 1996) is worth borrowing: Players, Added value, Rules, Tactics and Scope.",
              "Start early. A buyer once rang an adviser: \"Help me move from a weak position to a strong one, I negotiate tomorrow.\" The answer was \"good luck\". Structural change takes weeks or months, not one evening."
            ] },
            { t: 'sort', title: 'Players or rules?', prompt: 'Which lever does each move pull?', buckets: ['Players', 'Rules'],
              items: [
                { text: 'Invite a supplier from another country to bid', bucket: 0, why: 'You add someone to the game.' },
                { text: 'Announce that the lowest price wins, with no second round', bucket: 1, why: 'You change how the decision gets made.' },
                { text: 'Agree with a partner to buy jointly', bucket: 0, why: 'Two buyers become one bigger player.' },
                { text: 'Publish how bids will be scored before they arrive', bucket: 1, why: 'Everyone now plays under a known rule.' }
              ] },
            { t: 'sort', title: 'Timing or pie?', prompt: 'Now the other two levers.', buckets: ['Timing', 'Pie'],
              items: [
                { text: "Move the tender to the quarter when suppliers' factories are quiet", bucket: 0, why: 'Same game, played at a moment that suits you.' },
                { text: 'Bundle three small contracts into one large one', bucket: 1, why: "You've changed what's at stake." },
                { text: 'Run the tender every two years instead of every year', bucket: 0, why: 'You change how often the game is played.' },
                { text: 'Offer a five-year contract instead of a one-year one', bucket: 1, why: 'A longer contract is a bigger prize.' }
              ] },
            { t: 'choice', title: 'Three or six?', q: "A hotel group is buying 100,000 pieces of bedroom furniture. Its design team can only check samples from 3 of 6 qualified suppliers, unless it pays £150k for extra assessment time. Three bidders should quote about £56 a piece; six, about £50. What should it do?",
              options: [
                { text: "Shortlist three, they're the best anyway", why: 'The best three quote higher when they know there are only three.' },
                { text: 'Pay the £150k and keep all six', ok: true, why: "Right. £6 a piece on 100,000 pieces is £600k, for £150k. Competition is worth paying for." },
                { text: 'Shortlist three and tell them there are six', why: "Bluffing about competition backfires when it's found out. And it usually is." },
                { text: 'Delay the decision', why: "Delay doesn't create more bidders." }
              ] },
            { t: 'summary', points: [
              'Most value is created before the negotiation, by deciding which game gets played.',
              'You can change the players, the rules, the timing or the pie.',
              "Start early: you can't restructure a game the night before."
            ] }
          ]
        },
        {
          id: 'tie-your-hands', title: 'Tie your own hands', minutes: 14, kind: 'Concept',
          steps: [
            { t: 'read', title: 'Less choice, more power', body: [
              "The <b>commitment problem</b>: you can't make a threat or a promise believable, because when the moment comes you'd rather not carry it out. Everyone can see that, so nobody believes you.",
              "Thomas Schelling's answer (<i>The Strategy of Conflict</i>, 1960) sounds odd at first: get rid of some of your own options. If you can't back down, the other side knows what you'll do, and plans around it.",
              "Here's a manufacturer deciding whether to build a plant, and a government that has promised a subsidy if it does."
            ] },
            { t: 'tree', title: 'The plant and the subsidy', prompt: 'The manufacturer moves first, then the government decides whether to pay. Pick what each does at every point, then check.',
              players: ['Manufacturer', 'Government'], unit: 'payoff points',
              root: { p: 0, options: [
                { label: 'Build the plant', next: { p: 1, options: [
                  { label: 'Pay the subsidy', pay: [50, 70] },
                  { label: 'Don\'t pay', pay: [-20, 100] } ] } },
                { label: "Don't build", pay: [0, 0] } ] },
              explain: "Once the plant is built, the government saves money by not paying (100 beats 70). The manufacturer sees that coming and stays out (0 beats -20). Both end up with 0." },
            { t: 'tree', title: 'Pass the law first', prompt: 'Now the government moves first. It can pass a binding subsidy law, which removes its own "don\'t pay" option, or keep its options open.',
              players: ['Manufacturer', 'Government'], unit: 'payoff points',
              root: { p: 1, options: [
                { label: 'Pass a binding law', next: { p: 0, options: [
                  { label: 'Build the plant', pay: [50, 70] },
                  { label: "Don't build", pay: [0, 0] } ] } },
                { label: 'Keep options open', next: { p: 0, options: [
                  { label: 'Build the plant', next: { p: 1, options: [
                    { label: 'Pay the subsidy', pay: [50, 70] },
                    { label: "Don't pay", pay: [-20, 100] } ] } },
                  { label: "Don't build", pay: [0, 0] } ] } } ] },
              explain: "With the law passed, the manufacturer builds (50 beats 0) and the government gets 70. Keeping its options open leads back to 0. So the government ties its own hands, and gets 70 instead of 0." },
            { t: 'choice', title: 'Who gained?', q: 'When the government removed its own option, who was better off?',
              options: [
                { text: 'Only the manufacturer', why: 'The government goes from 0 to 70.' },
                { text: 'Only the government', why: 'The manufacturer goes from 0 to 50.' },
                { text: 'Both of them', ok: true, why: 'Right. The manufacturer gets 50 instead of 0 and the government 70 instead of 0. Commitment can create value, not just move it.' },
                { text: 'Neither: the government lost flexibility', why: 'It lost an option it would have used against itself.' }
              ] },
            { t: 'read', title: 'Burning the ships', body: [
              "The famous parable: in 1519 Cortés landed in Mexico with a small force and destroyed his own ships. His soldiers couldn't retreat, so they'd fight for their lives, and the defenders, facing an enemy that couldn't run, concluded it must be very sure of itself.",
              "History is messier. He scuttled the ships partly to stop deserters, and the effect on the other side is legend. The logic still holds: removing your way out changes what everyone expects you to do.",
              "The 1964 satire <i>Dr Strangelove</i> adds the catch. Its doomsday machine retaliates automatically and can't be switched off, but nobody has been told about it yet. A commitment nobody can see is worth nothing.",
              "Ways to commit: <b>burn a bridge</b> (sell the old plant), a <b>firm policy</b> applied to everyone, <b>contracts</b> with penalty clauses, <b>limited authority</b> for your negotiator, and <b>reputation</b>. Two warnings: if both sides commit to incompatible positions, the deal crashes, like two drivers who've both thrown away the steering wheel. And it only works on someone rational enough to respond."
            ] },
            { t: 'choice', title: 'The secret doomsday machine', q: "A firm sets up an automatic rule: any supplier that reopens an agreed price is removed from the approved list. It tells no one. Does the rule deter price increases?",
              options: [
                { text: 'No: suppliers have to know about it', ok: true, why: 'Right. A commitment changes behaviour only if the other side can see it.' },
                { text: "Yes: it's automatic", why: "Automatic, but invisible. Suppliers won't respond to a rule they've never heard of." },
                { text: 'Only for big suppliers', why: "No supplier can respond to what it doesn't know." }
              ] },
            { t: 'sort', title: 'Commitment or cheap talk?', prompt: 'Which of these would actually change what the other side expects?', buckets: ['Real commitment', 'Cheap talk'],
              items: [
                { text: '"This is our final offer," said in the meeting', bucket: 1, why: 'It costs nothing to say and nothing to drop.' },
                { text: 'A signed most-favoured-customer clause', bucket: 0, why: 'Breaking it has a legal cost.' },
                { text: 'A negotiator with written authority only up to £50', bucket: 0, why: 'Limited authority is a commitment, as long as the limit is real.' },
                { text: 'A price list published and applied to every customer', bucket: 0, why: 'A special deal for one would be seen by all.' },
                { text: '"We\'re talking to lots of other suppliers," with no names', bucket: 1, why: "Anyone can say it, so it tells the other side nothing." },
                { text: 'Selling the old production line before talking to the new supplier', bucket: 0, why: "You've burned the bridge back." }
              ] },
            { t: 'summary', points: [
              'Giving up an option can make you stronger, because others can predict you.',
              'A commitment must be visible and costly to reverse.',
              'Watch for two-sided commitments: they can crash the deal.'
            ] }
          ]
        },
        {
          id: 'commitment-flips-the-game', title: 'Commitment that flips the game', minutes: 12, kind: 'Case',
          steps: [
            { t: 'read', title: "Intel's real problem", body: [
              "Back to IBM and Intel from Course 1. Intel was IBM's only chip source. IBM could stick with Intel, or build up AMD as a rival. Payoffs are shares of the profit pool, invented for teaching.",
              "If IBM sticks, Intel can exploit it (IBM 10, Intel 90) or share fairly (50, 50). If IBM builds AMD, Intel can compete (40, 30) or stop supplies (10, 10). Solve it and IBM builds AMD, leaving Intel with 30.",
              "Intel's problem wasn't an empty threat. It was an empty <b>promise</b>. \"We'll share fairly\" meant nothing, because exploiting paid 90."
            ] },
            { t: 'tree', title: 'The base case', prompt: 'Solve the game from the end. Pick what each player does at every point, then check.',
              players: ['IBM', 'Intel'], unit: '% of the profit pool (invented)',
              root: { p: 0, options: [
                { label: 'Stick with Intel', next: { p: 1, options: [
                  { label: 'Exploit IBM', pay: [10, 90] },
                  { label: 'Share fairly', pay: [50, 50] } ] } },
                { label: 'Build up AMD', next: { p: 1, options: [
                  { label: 'Compete', pay: [40, 30] },
                  { label: 'Stop supplies', pay: [10, 10] } ] } } ] },
              explain: 'If IBM sticks, Intel exploits it (90 beats 50), leaving IBM 10. If IBM builds AMD, Intel competes (30 beats 10), leaving IBM 40. So IBM builds AMD and Intel gets 30.' },
            { t: 'choice', title: 'What should Intel change?', q: 'Intel wants IBM to stick with it. What does it need to change?',
              options: [
                { text: 'Threaten louder to stop deliveries', why: 'IBM already knows stopping costs Intel more than competing.' },
                { text: 'Offer IBM a one-off discount', why: "A discount today doesn't stop exploitation tomorrow." },
                { text: 'Make exploiting IBM less profitable for itself', ok: true, why: 'Right. If exploiting no longer pays, IBM can trust the promise to share.' },
                { text: 'Buy AMD', why: 'That might work, but competition authorities would have something to say.' }
              ] },
            { t: 'tree', title: 'After the licences', prompt: "Intel licenses its designs to other chipmakers. If it ever exploits IBM, IBM can buy Intel-designed chips elsewhere. The exploit branch now pays IBM 30 and Intel 35. Solve it again.",
              players: ['IBM', 'Intel'], unit: '% of the profit pool (invented)',
              root: { p: 0, options: [
                { label: 'Stick with Intel', next: { p: 1, options: [
                  { label: 'Exploit IBM', pay: [30, 35] },
                  { label: 'Share fairly', pay: [50, 50] } ] } },
                { label: 'Build up AMD', next: { p: 1, options: [
                  { label: 'Compete', pay: [40, 30] },
                  { label: 'Stop supplies', pay: [10, 10] } ] } } ] },
              explain: 'Now if IBM sticks, Intel prefers sharing (50 beats 35). IBM compares 50 for sticking with 40 for building AMD, and sticks. Intel earns 50 instead of 30: it gave up a 90 it could never get for a 50 it could.' },
            { t: 'choice', title: 'How far is far enough?', q: "Licensing cut Intel's exploit payoff to 35. Which exploit payoff would NOT have been enough to make the promise believable?",
              options: [
                { text: '45', why: 'Below 50, so sharing wins. That works.' },
                { text: '55', ok: true, why: 'Right. Above 50, exploiting still beats sharing, so IBM still builds AMD.' },
                { text: '20', why: 'Comfortably below 50. That works.' }
              ] },
            { t: 'sort', title: 'Does it make a promise believable?', prompt: 'Does each move make bad behaviour less profitable for the one promising?', buckets: ['Yes', 'No'],
              items: [
                { text: 'A software firm puts its source code in escrow for customers', bucket: 0, why: 'If it lets customers down, they get the code and can go elsewhere.' },
                { text: 'A builder promises "we always finish on time"', bucket: 1, why: 'Nothing happens to the builder if it doesn\'t.' },
                { text: 'A supplier signs a late-delivery penalty of 5% a week', bucket: 0, why: 'Being late now costs the supplier real money.' },
                { text: 'A landlord says "I never raise rents"', bucket: 1, why: 'Words only. Raising the rent later costs nothing extra.' },
                { text: 'A chipmaker publishes its design as an open standard', bucket: 0, why: 'Anyone can make the chip, so squeezing customers stops paying.' }
              ] },
            { t: 'summary', points: [
              'Sometimes the problem is an empty promise, not an empty threat.',
              'Make your own bad behaviour unprofitable and the promise becomes believable.',
              "Intel gave up a monopoly profit it couldn't get for a fair share it could."
            ] }
          ]
        }
      ]
    },
    {
      title: 'Threats and levers',
      lessons: [
        {
          id: 'credible-threat', title: 'Make your threat credible', minutes: 15, kind: 'Case',
          steps: [
            { t: 'read', title: 'The modem problem', body: [
              "A threat counts only if carrying it out is your best move when the time comes. Here's how a game theorist would read a public story from 2019. Payoffs are invented for teaching, in $bn.",
              "Intel made 4G smartphone modems, and Apple was effectively its only customer. The division lost money every day. Apple had just settled its legal fight with Qualcomm and signed a six-year chip deal, so it was in no hurry.",
              "Apple wanted to own modem technology one day. But why buy now, if Intel would sell cheaper later? Intel could threaten to auction the patents to anyone, which would hurt Apple badly if a rival bought them. Would Apple believe it?"
            ] },
            { t: 'tree', title: 'Before the announcement', prompt: 'Intel can keep the division or offer to sell it. If Apple waits, Intel either sells later at a lower price or auctions the patents. Solve it from the end.',
              players: ['Intel', 'Apple'], unit: '$bn (invented)',
              root: { p: 0, options: [
                { label: 'Keep the division', next: { p: 1, options: [
                  { label: 'License the patents', pay: [0.2, 1.8] },
                  { label: 'Walk away', pay: [-0.5, 1.6] } ] } },
                { label: 'Offer to sell', next: { p: 1, options: [
                  { label: 'Buy now', pay: [1.0, 2.0] },
                  { label: 'Wait', next: { p: 0, options: [
                    { label: 'Sell later, cheaper', pay: [0.4, 2.4] },
                    { label: 'Auction the patents', pay: [0.3, -1.0] } ] } } ] } } ] },
              explain: 'If Apple waits, Intel prefers selling cheaply later (0.4 beats 0.3), so the auction threat is empty. Apple compares buying now (2.0) with waiting (2.4) and waits. Intel still prefers offering (0.4) to keeping (0.2), and ends up with 0.4.' },
            { t: 'choice', title: 'Why does Apple wait?', q: 'In that game, why does Apple wait instead of buying now?',
              options: [
                { text: 'Because Intel would rather sell later than auction', ok: true, why: 'Right. The auction would pay Intel 0.3, selling later 0.4. Apple knows the threat is empty.' },
                { text: "Because Apple didn't need modems", why: "It did, eventually. It just didn't need to buy today." },
                { text: 'Because the price was too high', why: "The price isn't the issue. Timing is." }
              ] },
            { t: 'read', title: 'Intel makes the auction real', body: [
              "Intel's move, as a game theorist reads it: bring in an outside auction adviser and announce the sale process publicly. Now backing down has a price. Dropping the auction would cost credibility with investors, staff and every future buyer.",
              "Say that drops the \"sell later\" payoff for Intel from 0.4 to 0.2. That's two levers at once: new players (other bidders, including the one Apple feared most) and a commitment device. Apple bought the business in 2019 for about $1bn."
            ] },
            { t: 'tree', title: 'After the announcement', prompt: 'Same game, but selling later now pays Intel only 0.2. Solve it again.',
              players: ['Intel', 'Apple'], unit: '$bn (invented)',
              root: { p: 0, options: [
                { label: 'Keep the division', next: { p: 1, options: [
                  { label: 'License the patents', pay: [0.2, 1.8] },
                  { label: 'Walk away', pay: [-0.5, 1.6] } ] } },
                { label: 'Offer to sell', next: { p: 1, options: [
                  { label: 'Buy now', pay: [1.0, 2.0] },
                  { label: 'Wait', next: { p: 0, options: [
                    { label: 'Sell later, cheaper', pay: [0.2, 2.4] },
                    { label: 'Auction the patents', pay: [0.3, -1.0] } ] } } ] } } ] },
              explain: 'If Apple waits, Intel now auctions (0.3 beats 0.2). Apple compares 2.0 for buying now with -1.0 for waiting, and buys now. Intel gets 1.0 instead of 0.4.' },
            { t: 'choice', title: 'What made the threat believable?', q: 'What changed between the two games?',
              options: [
                { text: 'The auction raised more money than selling to Apple', why: "It didn't. It paid Intel less. That's why it needed the commitment." },
                { text: 'Announcing it publicly made backing down costly', ok: true, why: 'Right. Once the world knows, dropping the auction costs Intel more than running it.' },
                { text: 'Apple was told about it in private', why: 'A private threat is easy to drop. The public announcement is what changed the payoff.' }
              ] },
            { t: 'read', title: 'Four ways to make a threat credible', body: [
              "<b>1. Make carrying it out cheaper:</b> build the alternative first, for example by qualifying a second supplier before the price talks. <b>2. Make backing down costlier:</b> go public, stake your reputation, sign it.",
              "<b>3. Hand it to someone else:</b> an auctioneer, a contract rule or a board that acts automatically. <b>4. Go in small steps:</b> a threat to move 10% of the volume is easier to carry out, and to believe, than \"all of it\"."
            ] },
            { t: 'choice', title: 'Which way?', q: 'You write a clause into the contract that triggers an automatic re-tender if prices rise above an agreed index. Which of the four ways is that?',
              options: [
                { text: 'Make carrying it out cheaper', why: "That would be building the alternative, like qualifying a second supplier." },
                { text: 'Make backing down costlier', why: "That would be going public, like telling your board and the press." },
                { text: 'Hand it to someone else', ok: true, why: "Right. The rule acts on its own, so there's no moment where you'd rather back down." },
                { text: 'Go in small steps', why: 'That would be moving 10% of the volume now to show you\'ll move more.' }
              ] },
            { t: 'summary', points: [
              'A threat you would rather not carry out is just noise.',
              'Make it credible by making it cheaper to do or costlier to drop.',
              'New players and public commitments together can flip who has the power.'
            ] }
          ]
        },
        {
          id: 'cost-creep', title: 'The cost-creep case: four fixes', minutes: 15, kind: 'Game',
          steps: [
            { t: 'read', title: 'Six months after launch', body: [
              "An e-bike maker buys all its motors from one supplier. Six months after launch, the supplier asks for a big price rise per motor. The maker can pay, and expect more requests, or refuse and move the business. This case is invented, payoffs in £m.",
              "If the supplier doesn't ask: supplier 20, maker 50. If it asks and the maker pays: 30 and 40, because the rise moves 10 from the maker to the supplier. If it asks and the maker moves the business: 0 and 35, because switching costs the maker 15 in delay and re-testing a new motor."
            ] },
            { t: 'tree', title: 'The base case', prompt: 'Solve it from the end. Pick what each player does, then check.',
              players: ['Supplier', 'E-bike maker'], unit: '£m (invented)',
              root: { p: 0, options: [
                { label: "Don't ask", pay: [20, 50] },
                { label: 'Ask for a rise', next: { p: 1, options: [
                  { label: 'Pay it', pay: [30, 40] },
                  { label: 'Move the business', pay: [0, 35] } ] } } ] },
              explain: 'Once asked, paying (40) beats moving the business (35). The supplier knows it and asks (30 beats 20). Cost creep, and the maker pays. Its threat to move the business is empty.' },
            { t: 'read', title: 'Four fixes, one problem', body: [
              "<b>1. Create an outside option.</b> Use two motor suppliers from the start. You lose some volume discount (3), but switching becomes cheap. <b>2. Lower their gain (grim trigger).</b> A rule: any supplier that reopens an agreed price is off the list for future models. If that future business is worth 15 to it, asking leaves it 15, not 20. It stays quiet.",
              "<b>3. Lower your own payoff from paying (a poison pill).</b> Say the buying team's bonus falls by any rise it approves, so paying is worth 30 to the team, not 40. This isn't the takeover-defence poison pill, just a penalty you set on yourself. <b>4. Burn the bridge.</b> Write into the contract that prices can only change through a formal procedure with evidence and sign-off. The \"ask\" branch is gone.",
              "The maker gets 40 in the base case, 47 with two suppliers and 50 with each of the other three. Same idea every time: change the payoffs or the branches, don't argue harder."
            ] },
            { t: 'tree', title: 'Fix 1: two motor suppliers', prompt: 'Each supplier now has half the volume. Not asking: 10 to the supplier, 47 to you. Asking and getting paid: 15 and 42. Asking and losing its share to the other supplier: 0 and 45. Solve it.',
              players: ['Supplier', 'E-bike maker'], unit: '£m (invented)',
              root: { p: 0, options: [
                { label: "Don't ask", pay: [10, 47] },
                { label: 'Ask for a rise', next: { p: 1, options: [
                  { label: 'Pay it', pay: [15, 42] },
                  { label: 'Move the volume', pay: [0, 45] } ] } } ] },
              explain: 'Moving the volume (45) now beats paying (42), so your threat is real. The supplier doesn\'t ask (10 beats 0). You get 47 instead of 40, so two suppliers are worth it as long as they cost you less than 10.' },
            { t: 'choice', title: 'Why does dual sourcing work?', q: 'What actually changed in the tree?',
              options: [
                { text: 'Moving the business became cheap enough to be your best reply', ok: true, why: 'Right. The threat was empty because switching cost 15. Make switching cheap and the threat becomes real.' },
                { text: 'The second supplier is cheaper', why: 'Prices are the same. The difference is what you can credibly do.' },
                { text: 'The supplier feels watched', why: "Feelings aren't in the payoffs. The switching cost is." }
              ] },
            { t: 'tree', title: 'Fix 3: the poison pill', prompt: "Back to one supplier, but your team's bonus falls by any rise it approves, so paying is now worth 30 to you. Solve it.",
              players: ['Supplier', 'E-bike maker'], unit: '£m (invented)',
              root: { p: 0, options: [
                { label: "Don't ask", pay: [20, 50] },
                { label: 'Ask for a rise', next: { p: 1, options: [
                  { label: 'Pay it', pay: [30, 30] },
                  { label: 'Move the business', pay: [0, 35] } ] } } ] },
              explain: 'Now moving the business (35) beats paying (30). The supplier knows it and doesn\'t ask (0 is worse than 20). You get 50, and the penalty never bites because the branch never happens. Any self-penalty above 5 would do it.' },
            { t: 'choice', title: 'The catch', q: 'The poison pill and burning the bridge both cost you nothing in equilibrium. What has to be true for them to work?',
              options: [
                { text: 'The supplier has to agree to them', why: "They're your commitments. The supplier only needs to see them." },
                { text: 'The supplier has to know about them, and they must be set up before it has the leverage', ok: true, why: 'Right. A hidden penalty changes nothing, and a change procedure written in after launch is too late.' },
                { text: 'You need a second supplier as well', why: "That's fix 1. These work with a single source." }
              ] },
            { t: 'sort', title: 'Which fix?', prompt: 'Sort each move into the fix it uses.', buckets: ['Outside option', 'Grim trigger', 'Poison pill'],
              items: [
                { text: 'Qualify a second motor supplier before launch', bucket: 0, why: 'It makes moving the business cheap.' },
                { text: '"Reopen a price and you\'re off the list for new models"', bucket: 1, why: 'It lowers what the supplier gains by asking.' },
                { text: "Publicly tie the buying team's targets to zero price rises", bucket: 2, why: 'It makes giving in hurt you.' },
                { text: 'Keep a second factory tested and ready to take the volume', bucket: 0, why: 'A ready alternative raises your payoff from switching.' },
                { text: 'Tell your board that any rise you approve comes out of your own budget', bucket: 2, why: 'You lower your own payoff from paying, so refusing becomes your best reply.' }
              ] },
            { t: 'summary', points: [
              'One bad equilibrium can be fixed by raising your alternative, lowering their gain, lowering your payoff from giving in, or removing the option.',
              'All four work by changing payoffs or branches, not by arguing harder.',
              'Pick the fix whose cost and conditions fit your situation.'
            ] }
          ]
        },
        {
          id: 'worth-pulling', title: 'When is a lever worth pulling?', minutes: 10, kind: 'Game',
          steps: [
            { t: 'read', title: 'Is it worth it?', body: [
              "A <b>lever</b> is anything you can offer or withhold to change the other side's choice: a carrot adds value for them, a stick takes it away. Course 5 covers listing and mapping them. This lesson asks one question: is this lever worth pulling?",
              "A co-working chain is choosing who furnishes its next ten sites. Supplier A already supplies desks and chairs to the existing sites, at prices above should-cost (what they should cost, from a bottom-up cost model). Closing those gaps would save the chain £8m and cost A the same £8m in margin. Asking nicely changes nothing: 0 beats -8.",
              "The lever: a bigger share of the new-sites award if A closes the gaps. Two numbers matter. What it's worth to A (its <b>value</b>), and what it costs the chain (its <b>cost</b>), for example by accepting a slightly higher price on the new business."
            ] },
            { t: 'read', title: 'Three cases', body: [
              "<b>Value 12, cost 5.</b> A closes the gaps (12 - 8 = 4, more than 0). The chain nets 8 - 5 = 3. Pull it. <b>Value 8, cost 5.</b> A is exactly indifferent (8 - 8 = 0). Closing and not closing are both equilibria, so you can't count on it.",
              "<b>Value 12, cost 10.</b> A closes the gaps, but the chain pays 10 to gain 8. The rule: a lever has to be worth more to them than your ask costs them, <b>and</b> cost you less than the ask is worth to you. Watch the numbers each side gives you: both have reasons to exaggerate."
            ] },
            { t: 'slider', title: 'Lever sliders', prompt: 'Your ask is fixed: close £8m of gaps. Drag the two sliders until the lever works and pays off.',
              inputs: [
                { id: 'value', label: 'Value of the lever to Supplier A', min: 0, max: 20, step: 1, value: 4, prefix: '£', suffix: 'm' },
                { id: 'cost', label: 'Cost of the lever to you', min: 0, max: 20, step: 1, value: 10, prefix: '£', suffix: 'm' }
              ],
              outputs: [
                { id: 'theirs', label: "A's net gain from closing the gaps", expr: 'value - 8', prefix: '£', suffix: 'm' },
                { id: 'mine', label: 'Your net gain (0 if the gaps stay open)', expr: 'value > 8 ? 8 - cost : 0', prefix: '£', suffix: 'm' }
              ],
              goal: { expr: 'value > 8 && mine > 0', text: 'Find a lever that A accepts and that leaves you better off.' },
              explain: "It works on A only when the value is above £8m, and it pays you only when its cost is below £8m. At exactly £8m of value, A is indifferent and may or may not close the gaps. The best levers are cheap for you and valuable to them." },
            { t: 'choice', title: 'Case 2', q: 'The lever is worth exactly £8m to Supplier A. Why is that a problem?',
              options: [
                { text: 'A will always refuse', why: "It's indifferent, not opposed." },
                { text: 'It costs you too much', why: "The cost to you is 5, below the 8 you'd gain. The issue is A's side." },
                { text: 'A is indifferent, so it may or may not close the gaps', ok: true, why: "Right. Two equilibria means you can't plan on it. Make the lever slightly more valuable." }
              ] },
            { t: 'choice', title: 'Pick the lever', q: 'Three levers could win the same £8m ask. Which one should you use?',
              options: [
                { text: 'A price premium on the new business: worth 9 to A, costs you 9', why: 'It works on A, but you pay 9 to gain 8.' },
                { text: 'First call on the next site fit-outs: worth 10 to A, costs you 2', ok: true, why: 'Right. It clears both tests: A gains 2 and you gain 6.' },
                { text: 'Shorter payment terms: worth 6 to A, costs you 1', why: "Cheap, but 6 doesn't cover A's £8m cost. It won't close the gaps." }
              ] },
            { t: 'summary', points: [
              'A lever works only if it is worth more to them than your ask costs them.',
              'It pays only if it costs you less than the ask is worth to you.',
              'Levers that are cheap to give and valuable to receive are gold; check the numbers each side gives you.'
            ] }
          ]
        }
      ]
    },
    {
      title: 'Signals and reputation',
      lessons: [
        {
          id: 'signals', title: 'Signals: making information believable', minutes: 14, kind: 'Concept',
          steps: [
            { t: 'read', title: 'The lemons problem', body: [
              "Many games turn on something only one side knows: a supplier's real quality, a buyer's real budget. The side with the information can try to prove it (<b>signalling</b>). The side without it can design choices that make the other reveal it (<b>screening</b>, in Course 3).",
              "George Akerlof's \"market for lemons\" (1970) shows what goes wrong. Used-car buyers can't tell good cars from bad, so they'll only pay an average price. Owners of good cars won't sell at that price and leave, which drags the average down further. In the extreme, only lemons are left."
            ] },
            { t: 'read', title: 'Cheap talk and costly signals', body: [
              "\"Our quality is excellent\" costs the same to say whether it's true or not, so everyone says it. That's <b>cheap talk</b>.",
              "A <b>signal</b> works when it's costly, and costs less for the type that's telling the truth. Michael Spence (1973) used education: a degree is harder work for less able candidates, so having one tells an employer something even if the course content is irrelevant.",
              "Warranties are the business classic. A high-quality supplier's three-year warranty costs it about £2 a unit in expected claims. A low-quality supplier's costs about £10. What happens depends on the premium buyers pay for a warranty."
            ] },
            { t: 'slider', title: 'The warranty test', prompt: 'Set the premium buyers pay for a product with a warranty. Find the range where the warranty tells buyers something.',
              inputs: [ { id: 'premium', label: 'Premium buyers pay for a warranty', min: 0, max: 15, step: 1, value: 0, prefix: '£' } ],
              outputs: [
                { id: 'high', label: 'High-quality supplier gains from offering it', expr: 'premium - 2', prefix: '£' },
                { id: 'low', label: 'Low-quality supplier gains from offering it', expr: 'premium - 10', prefix: '£' }
              ],
              goal: { expr: 'high > 0 && low < 0', text: 'Make the warranty worth offering for the high-quality supplier only.' },
              explain: "Between £2 and £10, only the high-quality supplier offers the warranty, so it sorts them: at £6, one gains £4 and the other would lose £4. Below £2 nobody offers it. Above £10 everyone does, and it stops meaning anything." },
            { t: 'matrix', task: 'nash', title: 'Which trade fair?', prompt: "You and a partner firm are launching a joint product. You'd both rather be at the same fair, but you prefer London and they prefer Paris. Find every equilibrium.",
              rows: ['You go to London', 'You go to Paris'], cols: ['They go to London', 'They go to Paris'],
              pay: [[[4, 2], [0, 0]], [[0, 0], [2, 4]]], unit: 'payoff points',
              explain: 'Two equilibria: both in London (4, 2) and both in Paris (2, 4). Neither of you wants to go alone, so the question is which one you land on.' },
            { t: 'choice', title: 'Why pay the deposit?', q: 'Before anyone decides, you pay a £1m non-refundable deposit on the London venue (worth 1 point). Why does that help?',
              figure: { rows: ['You go to London', 'You go to Paris'], cols: ['They go to London', 'They go to Paris'], pay: [[[4, 2], [0, 0]], [[0, 0], [2, 4]]], unit: 'payoff points, before the deposit' },
              options: [
                { text: 'It makes London cheaper for you', why: "It makes London more expensive for you. That's the point." },
                { text: "It's a bribe to the other firm", why: 'The money goes to the venue, not to them.' },
                { text: 'It shows you mean London: paying and then going to Paris would make no sense', ok: true, why: 'Right. Paying then picking Paris gives you 2 - 1 = 1, less than the 2 you\'d get without paying. They work out that you only pay if you mean London, go there too, and you net 4 - 1 = 3.' },
                { text: "It's a mistake: you've lost £1m", why: "You've spent 1 and moved from 2 to 4. Net, you're up." }
              ] },
            { t: 'sort', title: 'Signal or cheap talk?', prompt: 'Which of these should change what you believe?', buckets: ['Costly signal', 'Cheap talk'],
              items: [
                { text: 'A supplier offers a 5% penalty for every week of late delivery', bucket: 0, why: 'A late supplier would pay far more than a punctual one.' },
                { text: 'A sales deck says "we never miss a deadline"', bucket: 1, why: 'Free to say, true or not.' },
                { text: 'A buyer publishes its scoring rules and the date of the final round', bucket: 0, why: 'Changing them later would be seen and costly.' },
                { text: 'A start-up offers a 90-day money-back guarantee', bucket: 0, why: 'It costs a bad product far more than a good one.' },
                { text: 'A supplier says "we have plenty of other customers"', bucket: 1, why: 'Anyone can say it.' },
                { text: 'A new restaurant spends heavily on opening adverts', bucket: 0, why: 'It only pays if it expects repeat customers (Nelson 1974; Milgrom and Roberts 1986).' }
              ] },
            { t: 'summary', points: [
              'Hidden information can wreck a market: the lemons problem.',
              'Words are cheap; a signal convinces when it costs more to fake than to mean.',
              "Make your commitments visible and costly to reverse, and read others' costly acts as clues."
            ] }
          ]
        },
        {
          id: 'five-mistakes', title: 'Five mistakes strategists make', minutes: 12, kind: 'Case',
          steps: [
            { t: 'read', title: 'Five ways to lose a game you could have won', body: [
              "Course 1 started with five rules to keep: <b>define all the players</b>, <b>consider all the options</b>, <b>examine the outcomes</b>, <b>think from the end</b>, and <b>anticipate the next game</b>.",
              "Each of the five cases that follow breaks one of them. Each one is cheap to avoid with ten minutes of \"who else is in this game, and what will they do next?\""
            ] },
            { t: 'choice', title: 'Case 1: one-hour delivery', q: 'A supermarket chain invests heavily in one-hour delivery to win market share. Nobody asks whether a rival could do the same. It does, the market is shared and the investment never pays. Which rule was broken?',
              options: [
                { text: 'Examine the outcomes', why: 'The outcome only went wrong because a player was missing from the picture.' },
                { text: 'Define all the players', ok: true, why: "Right. Model the rival's investment too. If it can copy you, you're in a prisoner's dilemma." },
                { text: 'Think from the end', why: 'Thinking ahead would help, but only once the rival is in the game.' },
                { text: 'Anticipate the next game', why: "This is the same game. The rival was simply left out." }
              ] },
            { t: 'choice', title: 'Case 2: no fallback', q: "Short of time for a full tender, a hotel group plans a take-it-or-leave-it offer to its laundry supplier. Nobody asks what happens if the supplier says no. Which rule was broken?",
              options: [
                { text: 'Define all the players', why: 'The players are clear: the hotel group and its supplier.' },
                { text: 'Consider all the options', ok: true, why: "Right. Before making a final offer, decide what you'll do if it's refused, and make sure the supplier believes you." },
                { text: 'Examine the outcomes', why: "The payoffs aren't the issue. A whole branch, \"they say no\", was ignored." },
                { text: 'Anticipate the next game', why: 'The gap is in this game: there\'s no plan for a refusal.' }
              ] },
            { t: 'choice', title: 'Case 3: the cheapest pan', q: 'A kitchenware retailer gives a pan contract to Supplier A for the lowest quoted price. A makes them overseas, B locally, and nobody adds shipping. With shipping included, B was cheaper. Which rule was broken?',
              options: [
                { text: 'Consider all the options', why: 'Both suppliers were considered. Their costs were counted wrongly.' },
                { text: 'Examine the outcomes', ok: true, why: 'Right. Compare total cost, not quoted price. Shipping, quality and payment terms are part of the payoff (Course 7 covers this).' },
                { text: 'Think from the end', why: 'Thinking ahead would not fix a missing cost.' },
                { text: 'Anticipate the next game', why: 'The mistake is in this contract, not the next one.' }
              ] },
            { t: 'choice', title: 'Case 4: the empty threat', q: "A café chain threatens its coffee-machine supplier with losing all future business unless it closes its cost gaps. The supplier knows the chain can't do without it. The threat fails and the relationship sours. Which rule was broken?",
              options: [
                { text: 'Define all the players', why: 'Both players were in the picture.' },
                { text: 'Examine the outcomes', why: 'Close, but the real failure was not asking whether the chain would carry it out.' },
                { text: 'Think from the end', ok: true, why: "Right. Work back from the moment the threat has to be carried out. Only threaten what you'd do. Here a carrot would have worked better than a stick." },
                { text: 'Anticipate the next game', why: 'The threat failed in this game, before any next one.' }
              ] },
            { t: 'choice', title: 'Case 5: the reversed award', q: 'Supplier A wins a well-run tender for office cleaning. Supplier B then rings a director, offering a lower price if the award is reversed. The firm checks it\'s legal and accepts. From then on, no supplier gives its best price in a final round. Which rule was broken?',
              options: [
                { text: 'Consider all the options', why: 'The option was considered and taken. The cost came later.' },
                { text: 'Examine the outcomes', why: 'On this contract the outcome looked better. The damage is in the future.' },
                { text: 'Think from the end', why: 'This game did end well. The trouble is the games after it.' },
                { text: 'Anticipate the next game', ok: true, why: 'Right. Every award teaches suppliers how the next one works. Reversing it cost more in future tenders than it saved.' }
              ] },
            { t: 'choice', title: 'The strongest reason', q: "Case 5 again. The director's lower offer is £200k better on this contract. What's the strongest reason to say no?",
              options: [
                { text: 'It might be illegal', why: "They checked; it was legal. That's not the problem." },
                { text: "Supplier B can't be trusted", why: 'Maybe, but the bigger cost is what everyone else learns.' },
                { text: 'Future suppliers would hold back their best prices, costing far more across every later tender', ok: true, why: "Right. You're in a repeated game. One reversal makes every final round less final." }
              ] },
            { t: 'summary', points: [
              'Five rules, five mistakes: forgetting players, options, payoffs, the end of the game, or the next game.',
              'Most strategic errors are visible in advance with a quick "who else, and what next?"',
              'Every decision teaches the other side how you will behave next time.'
            ] }
          ]
        },
        {
          id: 'cartel-damages', title: 'Credibility over time: the cartel damages case', minutes: 12, kind: 'Case',
          steps: [
            { t: 'read', title: 'The case', body: [
              "A food manufacturer has damages claims against three packaging suppliers that a competition authority fined for running a cartel. Economists have estimated the overcharge. One supplier has already settled. Now the manufacturer negotiates with the main participant. The case and its figures are invented.",
              "Four problems. <b>Information:</b> the cartel knows how big the overcharge was; the manufacturer only has estimates. <b>Bargaining position:</b> these are still important suppliers. <b>Commitment:</b> fixed rules and deadlines are unusual in legal disputes. <b>Credibility:</b> \"settle or we'll sue\" is said so often that nobody believes it."
            ] },
            { t: 'slider', title: 'Settlement calculator', prompt: 'Estimated damages are £30m, with a 60% chance of proving them in court and legal costs of £3m a side. The supplier also faces £2m of extra risk from disclosure and bad publicity. Set the case figures and read off the range.',
              inputs: [
                { id: 'p', label: 'Chance of proving damages', min: 0, max: 100, step: 10, value: 50, suffix: '%' },
                { id: 'damages', label: 'Estimated damages', min: 0, max: 50, step: 5, value: 20, prefix: '£', suffix: 'm' },
                { id: 'costs', label: 'Legal costs, each side', min: 0, max: 5, step: 1, value: 1, prefix: '£', suffix: 'm' }
              ],
              outputs: [
                { id: 'mine', label: 'Court is worth this to you', expr: 'p * damages / 100 - costs', prefix: '£', suffix: 'm', decimals: 1 },
                { id: 'theirs', label: 'Court costs the supplier', expr: 'p * damages / 100 + costs + 2', prefix: '£', suffix: 'm', decimals: 1 },
                { id: 'room', label: 'Width of the settlement range', expr: 'theirs - mine', prefix: '£', suffix: 'm', decimals: 1 }
              ],
              goal: { expr: 'p == 60 && damages == 30 && costs == 3', text: 'Set 60%, £30m and £3m.' },
              explain: 'Court is worth 0.6 x 30 - 3 = £15m to you and costs the supplier 0.6 x 30 + 3 + 2 = £23m. Any settlement between £15m and £23m beats court for both sides.' },
            { t: 'read', title: 'The redesign', body: [
              "<b>Rules, not a bazaar:</b> a few meetings, with the agenda and deadlines set by the claimant. <b>A settlement menu:</b> settle everything for £19m by the first deadline, £21m by the second, and after that the claim is filed. No haggling over the menu.",
              "<b>Break the cartel's silence:</b> the first supplier to disclose gets a better price on the menu, which puts the suppliers in a prisoner's dilemma with each other. <b>Align your own side early:</b> buying and legal must agree, because they still need these suppliers."
            ] },
            { t: 'choice', title: 'Why a menu?', q: 'Why use a fixed settlement menu with deadlines instead of open negotiation?',
              options: [
                { text: "It's quicker to write", why: "It's more work up front. The payoff is credibility." },
                { text: 'It makes your position predictable and the deadlines believable', ok: true, why: 'Right. In open haggling every deadline is negotiable, so none is believed.' },
                { text: 'It hides your damages estimate', why: 'Your menu prices give a lot away. The point is commitment, not secrecy.' }
              ] },
            { t: 'choice', title: 'The offer of £16m', q: 'The main participant takes the menu for a bluff, rejects it and offers £16m. Court is worth £15m to you. Looking only at this case, what should you do?',
              options: [
                { text: 'Accept: 16 beats 15', ok: true, why: "Right, on this case alone. That's exactly why the supplier thinks your threat is empty." },
                { text: 'Sue: 15 beats 16', why: '15 is less than 16.' },
                { text: 'Ask for 23', why: "23 is the most they'd ever pay. They won't, if they don't believe you'll sue." }
              ] },
            { t: 'choice', title: 'The whole game', q: "Now add the two other open proceedings. Every supplier is watching: if you're believed they settle at £8m each, if not at £4m each. What should you do?",
              options: [
                { text: 'Accept 16: a bird in the hand', why: 'That gives 24 in total, against 31.' },
                { text: 'Sue: 15 + 8 + 8 = 31 beats 16 + 4 + 4 = 24', ok: true, why: 'Right. You lose 1 on this case and gain 8 on the others, and you deter the next cartel. The manufacturer sued.' },
                { text: 'Settle the others first', why: "They're watching this case to decide whether you mean it." }
              ] },
            { t: 'summary', points: [
              'Work out the payoffs before you draw a line in the sand.',
              'Fixed menus and deadlines, carried out exactly, turn threats into commitments.',
              'A threat that loses money in one game can pay across the whole repeated game: credibility takes time to build.'
            ] }
          ]
        }
      ]
    }
  ],
  exam: { pass: 7, questions: [
    { q: "A buyer has three suppliers who've split the business the same way for years. Which move changes the game rather than playing it better?",
      options: ["Pushing harder for a discount in this year's talks", 'Inviting two new suppliers to qualify for next year', 'Sending the request for quotes a week earlier', 'Asking each supplier for its best price'], answer: 1,
      why: 'Adding players changes the structure. The others are better play within the same game.' },
    { q: "Why does a public, written \"we never discount\" policy strengthen a shop's hand?",
      options: ['Customers like rules', "It's legally binding on customers", 'Breaking it for one customer would be seen by all, so it is costly to reverse', 'It saves time at the till'], answer: 2,
      why: "A commitment works when it's visible and costly to drop." },
    { q: 'A cloud provider promises not to raise prices on locked-in customers. Which move makes that promise most believable?',
      options: ["Publishing a free tool that moves customers' data to a rival", 'Repeating it in every sales meeting', 'Offering a one-off discount', 'Signing a non-disclosure agreement'], answer: 0,
      why: "Making exploitation unprofitable is what makes the promise believable, as with Intel's licences." },
    { q: 'A seller says it will auction its business if you don\'t buy now, but an auction would pay it less than waiting and selling to you later. What do you do, unless it changes something?',
      options: ['Buy now', 'Offer more', 'Join the auction', 'Wait: the threat is empty'], answer: 3,
      why: "When carrying out the threat is the seller's worse option, it won't. It needs a commitment, like a public announcement, to change that." },
    { q: 'What is a "poison pill" in the cost-creep case?',
      options: ['A penalty clause the supplier pays', 'Using two suppliers', 'A move that lowers your own payoff from giving in, so refusing becomes your best reply', 'Excluding the supplier from future business'], answer: 2,
      why: 'It hurts you in a branch that, as a result, never happens.' },
    { q: 'Closing a cost gap would save you £5m and cost the supplier £4m. A lever is worth £7m to the supplier and costs you £6m. Should you use it?',
      options: ['No: it costs you more than the gap is worth', 'Yes: the supplier will close the gap', 'Yes: £7m is more than £6m', 'Only if the supplier asks'], answer: 0,
      why: "It works on the supplier, but you'd pay £6m to gain £5m." },
    { q: "Which of these tells a buyer most about a new supplier's quality?",
      options: ['Testimonials on its website', 'A glossy brochure', 'A promise of "best-in-class quality"', 'A two-year free-replacement guarantee'], answer: 3,
      why: "A guarantee costs a poor-quality supplier far more than a good one, so it's a costly signal. The rest is cheap talk." },
    { q: 'A retailer opens a large store to dominate a town without asking whether a rival might do the same. Which mistake is this?',
      options: ["Believing you're the only player", 'Getting the payoffs wrong', 'Making an implausible threat', 'Ignoring the long-term game'], answer: 0,
      why: 'If the rival also opens, the market is shared and both stores lose money.' },
    { q: 'After a tender, a losing supplier offers a lower price if you reverse the award. Why do experienced buyers say no?',
      options: ["It's always illegal", 'The losing supplier must be desperate', 'Suppliers would stop giving their best price in future final rounds', 'It creates paperwork'], answer: 2,
      why: "It's a repeated game. Accepting once teaches every supplier there's always another chance." },
    { q: 'Suing a supplier is worth £15m to you; it offers £16m to settle. You have two other similar claims pending. Why might suing still be right?',
      options: ['Courts always award more than expected', 'Carrying out the threat makes your other claims settle higher and deters future cartels', 'Legal costs are tax-deductible', 'Settling would be illegal'], answer: 1,
      why: 'Credibility built in one case pays in the others: a small loss here, a bigger gain across the whole game.' }
  ] }
});
