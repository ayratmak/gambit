// Public, indexable course pages: one per course at /courses/<slug>, built by tools/build-course-pages.js.
// Titles about 60 characters, descriptions 150-160. Keywords from docs/seo/keywords.md and Google Suggest (no volumes).
module.exports = {
  hub: {
    title: 'Game Theory, Negotiation & Procurement Courses | Gambit',
    description: 'Nine interactive courses on game theory, negotiation, procurement and auctions. Play every game, pass the assessment, earn a certificate. Foundations free.',
  },
  courses: {
    'foundations': {
      slug: 'game-theory-foundations',
      title: 'Game Theory Foundations: Free Beginner Course | Gambit',
      description: 'A free beginner game theory course: payoff matrices, Nash equilibrium, game trees, credible threats and repeated games, learned by playing. With certificate.',
      h1: 'Game theory foundations: a free beginner course',
      about: [
        'Game theory is the study of decisions where your result depends on what someone else does. This course teaches the core toolkit in plain English, with no maths beyond adding up: how to turn a messy situation into a payoff matrix or a game tree, and how to predict what sensible people will do next.',
        'Every lesson starts with a game you play, then names the idea behind it. You will find a Nash equilibrium by tapping cells, split pirate treasure by thinking backwards, and play a price war against a rival who remembers what you did yesterday.'
      ],
      forWho: 'Anyone who negotiates, buys, sells or competes for a living and wants a sharper way to think about the other side. No background needed.'
    },
    'strategy': {
      slug: 'strategic-thinking',
      title: 'Strategic Thinking Course: Commitment & Threats | Gambit',
      description: 'A strategic thinking course built on game theory: change a game you\'re losing, make threats and promises credible, and send signals that people believe.',
      h1: 'Strategic thinking course: changing the game',
      about: [
        'Most strategy advice tells you how to play a game well. This course is about changing the game itself: who plays, what the rules are, when moves happen and what is at stake. It is the difference between haggling harder and making the haggle unnecessary.',
        'You will redesign real business situations by hand: an e-bike maker facing price rises from a locked-in supplier, a hotel group shortlisting furniture suppliers, a food manufacturer claiming damages from a cartel. Each one is solved with game trees you build and check yourself.'
      ],
      forWho: 'Managers, founders and buyers who already know the basics of game theory and want to use commitment, threats and signals deliberately.'
    },
    'negotiation': {
      slug: 'negotiation-bargaining-power',
      title: 'Negotiation Course Online: Bargaining Power | Gambit',
      description: 'An online negotiation course on bargaining power: BATNA, ZOPA, information, deadlines and first offers, taught through game theory and practised by playing.',
      h1: 'Negotiation course: where bargaining power comes from',
      about: [
        'In a one-to-one negotiation there is no auction to set the price, so the result depends on bargaining power. This course shows exactly where that power comes from: competition, information, your best alternative, deadlines and the numbers that become focal points.',
        'You will calculate your BATNA and both walk-away points, test whether a zone of agreement exists issue by issue, design a menu that makes the other side reveal their true costs, and negotiate against scripted counterparts who react to what you say.'
      ],
      forWho: 'Buyers, salespeople, account managers and anyone who negotiates one-to-one with a supplier, a client or an employer.'
    },
    'psychology': {
      slug: 'negotiation-psychology',
      title: 'Negotiation Psychology Course: Anchors & Framing | Gambit',
      description: 'A negotiation psychology course: anchoring, framing, decoys, fairness and risk, plus a tactics toolkit you can use at once and a full haggle to play through.',
      h1: 'Negotiation psychology: how real people decide at the table',
      about: [
        'People at the negotiating table are not calculators. They care about fairness, fear losses more than they value gains, overvalue what they already own and latch onto the first number they hear. The weaker your position, the more these effects matter.',
        'This course walks through the research on each one, from the ultimatum game to the decoy effect, and turns it into practical moves: how to frame an ask, where to set an anchor you can defend, how to build a menu, and how to close without leaving the other side feeling beaten.'
      ],
      forWho: 'Anyone who negotiates and wants to understand, use and resist the behavioural effects that move real deals.'
    },
    'game-plan': {
      slug: 'negotiation-preparation',
      title: 'Negotiation Preparation Course and Planner | Gambit',
      description: 'A negotiation preparation course: build a fact sheet, score your levers, sort must-haves from trades and draw a game plan, then run a full case to the close.',
      h1: 'Negotiation preparation: from facts to game plan',
      about: [
        'Most negotiations are lost before anyone sits down: the facts are thin, the levers untested and the plan stops at the first offer. This course gives you a five-step method, Facts, Power, Plan, Play, Learn, and the planner to go with it.',
        'You will score levers on cost, credibility and impact, sort every issue into must-haves, trades and nice-to-haves, and draw a game plan with an opening menu, a package ladder and an escalation trigger. Then you run a full case: a cinema chain renegotiating with the market-leading ticketing platform.'
      ],
      forWho: 'People who lead important one-to-one negotiations and want a repeatable way to prepare them.'
    },
    'procurement': {
      slug: 'procurement-tender-design',
      title: 'Procurement Course Online: Tender Design | Gambit',
      description: 'An online procurement course on tender design: fix the award rules before suppliers bid, build real competition and hold the line on award day. Certificate.',
      h1: 'Procurement course: designing a winning tender',
      about: [
        'Most tenders leak value because the buyer decides after the bids are in. Suppliers know it, so they hold back their best offer and lobby instead. This course teaches the alternative: a Rules-First Tender, where the award rules are fixed and published before anyone bids.',
        'You will learn the three tests every tender must pass (Race, Ruler, Rulebook), when the extra effort is worth it, how to build baskets that keep suppliers competing, and how to handle the difficult conversations at the rules briefing and on award day.'
      ],
      forWho: 'Buyers, category managers and procurement leads who run competitive tenders and want suppliers to give their best offer first time.'
    },
    'true-price': {
      slug: 'supplier-evaluation-total-cost',
      title: 'Supplier Evaluation and Total Cost of Ownership | Gambit',
      description: 'A supplier evaluation course: compare unequal suppliers on one True Price with credits and charges, whole-life cost in today\'s money and a change price list.',
      h1: 'Supplier evaluation and total cost of ownership',
      about: [
        'Suppliers are never alike. One is cheaper but slower, another better but heavier, a third refuses your terms. Scoring them out of 100 hides the trade-offs; this course shows how to turn every difference into money, so suppliers compete on one number: the True Price.',
        'You will price differences as credits and charges, choose the right benchmark, work out whole-life cost with net present value, and agree a change price list that stops cost creep after the award. The capstone is a sandbox where you bring a supplier under a £45m target in several ways.'
      ],
      forWho: 'Procurement teams, engineers, quality and finance people who have to agree on which supplier is really cheapest.'
    },
    'auctions': {
      slug: 'auction-theory',
      title: 'Auction Theory Course: Formats & Bidding | Gambit',
      description: 'An auction theory course for beginners: English, Dutch, first-price and second-price auctions, how to bid in each and how to beat the winner\'s curse.',
      h1: 'Auction theory course: formats, bidding and the winner\'s curse',
      about: [
        'Auctions decide who wins everything from spectrum licences to supply contracts, and the format changes how people bid. This course covers the four standard formats in both buying and selling versions, and why they so often produce the same price.',
        'You learn by bidding: against simulated rivals in sealed and open auctions, for a jar of coins whose value nobody knows, and in a market of water-meter suppliers. By the end you can pick a format for a real tender and explain why.'
      ],
      forWho: 'Buyers who run reverse auctions, suppliers who bid in them, and anyone curious about how auctions really work.'
    },
    'advanced-auctions': {
      slug: 'advanced-auction-design',
      title: 'Advanced Auction Design: Reserves & Collusion | Gambit',
      description: 'An advanced auction design course: reserve prices, strong favourites, collusion and bid signalling, dual sourcing and long contracts, and how to fix each.',
      h1: 'Advanced auction design: when the textbook breaks',
      about: [
        'Standard auction advice assumes similar bidders, private values and no collusion. Real tenders break those assumptions all the time. This course takes each one in turn and shows what changes: suppliers who must win, a strong favourite, bidders who quietly coordinate, a split award, a long contract.',
        'For each problem you get the design move that fixes it: a handicap, a ceiling price you can commit to, disclosure rules, indexation. You test them with calculators and simulations rather than formulas.'
      ],
      forWho: 'Procurement specialists and analysts who already know the basic auction formats and design tenders for a living.'
    }
  }
};
