// Track landing pages (/for/<slug>), built by tools/build-track-pages.js. One per audience, each selling a bundle.
// Claims stay honest: no invented testimonials, numbers or urgency. Keywords from Google Suggest (no volumes).
module.exports = [
  {
    slug: 'procurement', bundle: 'procurement-track', piece: 'rook', main: true,
    title: 'Procurement Negotiation Training Online | Gambit',
    description: 'Procurement negotiation training for buyers and category managers: tender design, supplier evaluation, auctions and negotiation. Six courses, one price.',
    eyebrow: 'For procurement professionals',
    h1: 'Procurement negotiation training that <em>moves the numbers</em>',
    sub: 'Run tenders suppliers can\'t game, compare unequal suppliers on one price, and walk into every negotiation with a plan. Six interactive courses built from the trainings large companies pay consultancies for.',
    proof: ['6 courses', 'About 12 hours', '6 certificates', 'First lesson free'],
    pains: [
      { h: 'Suppliers hold back their best price', p: 'If your award rules change after the bids arrive, suppliers learn to wait. You\'ll learn to fix the rules first, so the first offer is the best one.' },
      { h: 'Scorecards hide the real cost', p: 'A supplier scoring 82/100 can still be the expensive one. You\'ll turn every difference into money and compare suppliers on one True Price.' },
      { h: 'One-to-one talks drift', p: 'With a sole supplier there\'s no auction to lean on. You\'ll know your walk-away point, your levers and your next three moves before you sit down.' }
    ],
    path: [
      { id: 'foundations', why: 'The free warm-up: payoffs, Nash equilibrium and thinking backwards.' },
      { id: 'procurement', why: 'Run a Rules-First Tender: decide first, then let suppliers bid.' },
      { id: 'true-price', why: 'Compare unequal suppliers with credits, charges and whole-life cost.' },
      { id: 'auctions', why: 'Pick the right auction format and stop the winner\'s curse biting you later.' },
      { id: 'negotiation', why: 'Where bargaining power comes from when there\'s only one supplier.' },
      { id: 'game-plan', why: 'Prepare and run a big renegotiation, from fact sheet to final offer.' },
      { id: 'advanced-auctions', why: 'Reserve prices, strong favourites, collusion and long contracts.' }
    ],
    demo: {
      label: 'Try it: 30 seconds',
      q: 'Three suppliers quote for the same contract. A quotes £100k but needs £12k of your engineers\' time. B quotes £106k, ready to go. C quotes £97k, but a late delivery would cost you about £10k on average. Who is really cheapest?',
      options: [
        { t: 'Supplier A: lowest number after C', why: 'A is £100k plus £12k of your own engineering time: £112k. The dearest of the three.' },
        { t: 'Supplier B: £106k, nothing to add', ok: true, why: 'Right. A is really £112k and C £107k once you price the late-delivery risk. B has the lowest True Price. That\'s Course 7 in one question.' },
        { t: 'Supplier C: the lowest quote', why: 'C\'s £97k becomes about £107k once you price the delivery risk. Cheapest quote, not cheapest supplier.' }
      ]
    },
    forYou: ['Buyers and category managers running tenders or renegotiations', 'Procurement leads who want their team to stop leaving money on the table', 'Anyone preparing for a senior procurement role and wanting a sharper commercial toolkit'],
    team: true,
    faq: [
      ['Is this a CIPS qualification?', 'No. Gambit gives you a certificate of completion for each course, which you can log as CPD and add to your LinkedIn profile. It sits well alongside a CIPS qualification: CIPS teaches the process, Gambit teaches the strategy.'],
      ['How is it different from other procurement training?', 'Every lesson starts with a game you play: you run the auction, price the suppliers, make the offer. The ideas come from game theory, explained in plain English with worked numbers, and the cases are procurement cases.'],
      ['Can I train my whole team?', 'Yes. Email hello@gambitschool.com with your team size and we\'ll set up seats, a company invoice and progress reporting.'],
      ['How long does it take?', 'Each course is about two hours, self-paced, in short lessons. The whole track is about 12 hours, and you can stop after any lesson.'],
      ['What if I only want one course?', 'Every course can be bought on its own for £9.89. The track is the better deal if you plan to take three or more.']
    ],
    close: { h: 'Your next tender could be the one that <em>pays for this</em>', p: 'Start with the free lesson. If it doesn\'t change how you think about your next negotiation, you\'ve lost ten minutes.' },
    related: ['sales', 'students']
  },
  {
    slug: 'sales', bundle: 'sales-track', piece: 'knight',
    title: 'Sales Negotiation Training Online, With Certificate | Gambit',
    description: 'Sales negotiation training for account managers and bid teams: anchoring, bargaining power, preparation and bidding in tenders. Five courses, one price.',
    eyebrow: 'For sales and account managers',
    h1: 'Sales negotiation training for people who <em>hate discounting</em>',
    sub: 'See the deal the way the buyer\'s team sees it. Learn where your power comes from, how to anchor, how to bid in a tender without giving away margin, and how to close without a last-minute discount.',
    proof: ['5 courses', 'About 10 hours', '5 certificates', 'First lesson free'],
    pains: [
      { h: 'Discounts leak out at the end', p: 'The last-minute "can you do a bit better?" is a tactic. You\'ll learn the playbook behind it and how to hold your price with a reason.' },
      { h: 'Tenders feel like a lottery', p: 'Sealed bids, e-auctions and best-and-final rounds each reward a different bid. You\'ll learn how much to shade and when to stop.' },
      { h: 'Key accounts run the show', p: 'A big client feels all-powerful. You\'ll map both sides\' alternatives and find the trades that cost you little and are worth a lot to them.' }
    ],
    path: [
      { id: 'foundations', why: 'The free warm-up: how the other side thinks, in payoffs and moves.' },
      { id: 'negotiation', why: 'Where power comes from in a one-to-one deal, and how to shift it.' },
      { id: 'psychology', why: 'Anchors, framing and decoys: set the number before they do.' },
      { id: 'auctions', why: 'How to bid in sealed tenders and e-auctions without leaving margin behind.' },
      { id: 'game-plan', why: 'Prepare a key-account negotiation step by step, then run it.' },
      { id: 'strategy', why: 'Commitments, credible threats and signals for long-term accounts.' }
    ],
    demo: {
      label: 'Try it: 30 seconds',
      q: 'A buyer asks you to name your price first. You think £50,000 is fair and you have no idea of their budget. What do you open with?',
      options: [
        { t: '"£50,000." Fair and simple.', why: 'A round number at your target tells them there\'s room to move, and you\'ve no room left to give.' },
        { t: '"What budget do you have in mind?"', why: 'Fine if they answer, but most buyers won\'t, and you\'ve handed them the first move.' },
        { t: '"£57,400, based on the scope we agreed."', ok: true, why: 'Right. An ambitious, precise number with a reason is the strongest anchor: it pulls the final price up and sounds calculated, not invented. That\'s Course 4 in one question.' }
      ]
    },
    forYou: ['Account managers and key account managers', 'Bid and proposal teams answering tenders', 'Founders and freelancers who negotiate their own prices'],
    team: true,
    faq: [
      ['Is this only for B2B sales?', 'It\'s strongest for B2B, where you face professional buyers and tenders. The negotiation and psychology courses work for any deal, including your own salary.'],
      ['Why learn the buyer\'s side?', 'Because they have trained for it. Several lessons show you the buyer\'s playbook from the inside, so you recognise the moves when they come.'],
      ['Can my sales team take it together?', 'Yes. Email hello@gambitschool.com with your team size and we\'ll set up seats, invoicing and progress reporting.'],
      ['How long does it take?', 'About two hours per course in short, interactive lessons. The track is about 10 hours, self-paced.'],
      ['Do I get a certificate?', 'Yes, one for each course you complete and pass, with a verification ID you can share on LinkedIn.']
    ],
    close: { h: 'Protect your margin in the <em>next</em> negotiation', p: 'Play the first lesson free. No card, no account needed to start.' },
    related: ['procurement', 'students']
  },
  {
    slug: 'students', bundle: 'student-track', piece: 'pawn',
    title: 'Game Theory for Students: Courses & Certificates | Gambit',
    description: 'Game theory for students: learn strategic thinking, negotiation and auctions with interactive games, earn certificates for your CV and get ready for real work.',
    eyebrow: 'For students and graduates',
    h1: 'Game theory for students who want an <em>unfair advantage</em>',
    sub: 'Learn the strategic thinking that consultants, bankers and buyers use every day, by playing it. Earn certificates for your CV and LinkedIn, and walk into interviews with stories nobody else has.',
    proof: ['Free first course', '4 more for £24', 'Certificates for your CV', 'No maths needed'],
    pains: [
      { h: 'Every CV looks the same', p: 'Five certificates in strategy, negotiation and auctions say something a generic online course doesn\'t: you think in moves.' },
      { h: 'Case interviews reward structure', p: 'Game trees, payoff tables and "what will they do next?" are exactly how case interviewers want you to think out loud.' },
      { h: 'Your first salary is a negotiation', p: 'Most graduates accept the first offer. You\'ll know your walk-away point, your alternatives and how to ask for more without risking the job.' }
    ],
    path: [
      { id: 'foundations', why: 'Free: Nash equilibrium, game trees and the pirates\' treasure puzzle.' },
      { id: 'strategy', why: 'Commitment, credible threats and signals: the ideas behind real strategy.' },
      { id: 'negotiation', why: 'BATNA, ZOPA and bargaining power, ready for your first salary talk.' },
      { id: 'psychology', why: 'Anchors, framing and fairness: how real people actually decide.' },
      { id: 'auctions', why: 'How auctions work, from eBay to spectrum licences, by bidding in them.' }
    ],
    demo: {
      label: 'Try it: 30 seconds',
      q: 'Five pirates split 100 gold coins. The most senior proposes a split; if half or more agree it stands, otherwise he walks the plank and the next one proposes. Everyone is ruthless and clever. How many coins does the first pirate keep?',
      options: [
        { t: '20, an equal split', why: 'Fairness doesn\'t enter it here. Think backwards from the last two pirates.' },
        { t: '98', ok: true, why: 'Right. Working backwards, he only needs two votes, and two pirates who\'d get nothing later will take one coin each. That\'s backward induction, from the free course.' },
        { t: 'None, he always walks the plank', why: 'He survives comfortably. Solve it from the end: with two pirates left, the senior one keeps everything.' }
      ]
    },
    forYou: ['Economics, business and maths students', 'Graduates preparing for consulting, finance or commercial interviews', 'Anyone who wants to think more clearly about competition and negotiation'],
    team: false,
    faq: [
      ['Do I need to be good at maths?', 'No. Everything is explained in plain English with small, worked numbers. If you can compare two prices, you can do this.'],
      ['Will the certificates help my CV?', 'Each certificate has your name, the course and a verification ID, and you can add it to LinkedIn in one click. More useful still: you\'ll have concrete examples to talk about in interviews.'],
      ['How is this different from a university module?', 'It\'s shorter, practical and interactive. You play every game before learning its name, and the examples come from business, not textbooks.'],
      ['Is the first course really free?', 'Yes. Think Three Moves Ahead is free, certificate included. The student track adds four more courses for £24.'],
      ['How long does it take?', 'About two hours per course in short lessons you can do between lectures.']
    ],
    close: { h: 'Start thinking <em>three moves ahead</em>', p: 'The first course is free, with a certificate. Most people finish it in an afternoon.' },
    related: ['procurement', 'sales']
  }
];
