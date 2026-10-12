/* Gambit course catalogue. Every lesson is data: a list of steps the lesson player renders.
   Step types: read, sort, choice, matrix (task: explore | nash), repeated, summary.
   Matrices: pay[row][col] = [your payoff, their payoff]. Courses without steps show as "in production". */
(() => {
  const CAFES = {
    rows: ['You charge £3', 'You charge £2'],
    cols: ['They charge £3', 'They charge £2'],
    pay: [[[6, 6], [2, 8]], [[8, 2], [4, 4]]],
    unit: 'daily profit, £100s'
  };

  const foundations = {
    id: 'foundations',
    title: 'Game theory foundations',
    piece: 'pawn',
    price: 19,
    status: 'live',
    level: 'Beginner',
    minutes: 45,
    summary: 'The core ideas in plain English: players, payoffs, dominant moves and Nash equilibrium, learned by playing them.',
    outcomes: ['Spot when a situation is a game', 'Read any two-player payoff matrix', 'Find dominant strategies and Nash equilibria', 'Explain why co-operation survives in repeated games'],
    modules: [
      {
        title: 'The language of games',
        lessons: [
          {
            id: 'what-is-a-game', title: 'What makes something a game', minutes: 6, kind: 'Concept', preview: true,
            steps: [
              { t: 'read', title: 'Your best move depends on theirs', body: [
                'In game theory, a <b>game</b> is any situation where the result of your choice depends on what somebody else chooses, and theirs depends on you.',
                'That covers a lot of everyday life: setting a price next to a competitor, deciding how hard to push for a pay rise, choosing when to set off on a bank holiday.',
                'It doesn\'t cover decisions where nobody else is choosing. Whether to take an umbrella is about the weather, and the weather doesn\'t react to you.'
              ] },
              { t: 'sort', title: 'Game or not?', prompt: 'Sort each situation. Ask yourself: is someone else making a choice that changes my result?',
                buckets: ['A game', 'Not a game'],
                items: [
                  { text: 'Setting your coffee price when a new café opens opposite', bucket: 0, why: 'Their price changes how many customers you get, and yours changes theirs.' },
                  { text: 'Deciding whether to take an umbrella', bucket: 1, why: 'The weather isn\'t choosing anything. That\'s risk, not strategy.' },
                  { text: 'Bidding for a contract against two other suppliers', bucket: 0, why: 'Your chance of winning depends on what they bid.' },
                  { text: 'Driving home on empty roads at 3am', bucket: 1, why: 'With nobody else on the road, no one\'s choices affect yours.' },
                  { text: 'Asking your manager for a pay rise', bucket: 0, why: 'Their answer depends on what you ask, and what you ask should depend on how they\'ll respond.' }
                ] },
              { t: 'read', title: 'Three ingredients', body: [
                'Every game has three parts.',
                '<b>Players</b> are the people or organisations making choices. <b>Strategies</b> are the moves each player can make. <b>Payoffs</b> are what each player ends up with for every combination of moves.',
                'Once you can name those three things, you can start working out what a sensible player would do.'
              ] },
              { t: 'choice', title: 'Quick check', q: 'A supermarket and a discounter are each deciding whether to cut milk prices this week. What are the payoffs?',
                options: [
                  { text: 'The two shops', why: 'Those are the players.' },
                  { text: 'Cutting the price or keeping it', why: 'Those are the strategies.' },
                  { text: 'The profit each shop makes for every combination of choices', ok: true, why: 'Right. A payoff is what each player gets in each possible outcome.' },
                  { text: 'The price of a pint of milk', why: 'The price is part of a strategy, not what the shop ends up with.' }
                ] },
              { t: 'summary', points: ['A game is any situation where your result depends on someone else\'s choice.', 'Every game has players, strategies and payoffs.', 'If nobody else is choosing, it\'s a decision, not a game.'] }
            ]
          },
          {
            id: 'payoff-matrix', title: 'Reading a payoff matrix', minutes: 7, kind: 'Concept',
            steps: [
              { t: 'read', title: 'One table, every outcome', body: [
                'When two players each have a few options, we can show every outcome in one table called a <b>payoff matrix</b>.',
                'You choose the row. The other player chooses the column. Each cell shows two numbers: <b>your payoff first</b>, theirs second.'
              ] },
              { t: 'matrix', task: 'explore', title: 'Two cafés, one street', prompt: 'You and the café opposite each pick tomorrow\'s price for a coffee. Tap three cells to see what each outcome means.', ...CAFES },
              { t: 'choice', title: 'Read the table', q: 'If you charge £3 and they charge £2, how much does the other café make?', figure: CAFES,
                options: [
                  { text: '2', why: 'That\'s your payoff. Yours is always the first number.' },
                  { text: '6', why: 'That\'s the cell where you both charge £3.' },
                  { text: '8', ok: true, why: 'Right. The second number in a cell is always the column player\'s payoff.' },
                  { text: '4', why: 'That\'s the cell where you both charge £2.' }
                ] },
              { t: 'choice', title: 'Best for the street', q: 'Which cell makes the most money for the two cafés added together?', figure: CAFES,
                options: [
                  { text: 'Both charge £3: 6 + 6 = 12', ok: true, why: 'Right, 12 beats every other cell. Hold that thought: in the next lesson you\'ll see why they rarely end up there.' },
                  { text: 'Both charge £2: 4 + 4 = 8', why: 'Together that\'s only 8.' },
                  { text: 'You £2, them £3: 8 + 2 = 10', why: 'Good for you, but the street makes 10, less than 12.' }
                ] },
              { t: 'summary', points: ['Rows are your options, columns are theirs.', 'Each cell shows your payoff first, then theirs.', 'The best outcome for everyone together isn\'t always where players end up.'] }
            ]
          }
        ]
      },
      {
        title: 'Solving simple games',
        lessons: [
          {
            id: 'dominant-strategies', title: 'Dominant strategies', minutes: 8, kind: 'Game',
            steps: [
              { t: 'read', title: 'A move that always wins', body: [
                'Sometimes one of your options beats the others whatever the other player does. That\'s a <b>dominant strategy</b>.',
                'If you have one, you don\'t need to guess what they\'ll do. Let\'s test the idea on the two cafés.'
              ], figure: CAFES },
              { t: 'choice', title: 'If they charge £3', q: 'Suppose the other café charges £3. Which price earns you more?', figure: CAFES, highlightCol: 0,
                options: [
                  { text: 'Charge £3 and make 6', why: 'Charging £2 makes 8, which beats 6.' },
                  { text: 'Charge £2 and make 8', ok: true, why: 'Right. Undercutting a £3 rival wins you most of the street.' }
                ] },
              { t: 'choice', title: 'If they charge £2', q: 'Now suppose they charge £2. Which earns you more?', figure: CAFES, highlightCol: 1,
                options: [
                  { text: 'Charge £3 and make 2', why: 'Charging £2 makes 4, which beats 2.' },
                  { text: 'Charge £2 and make 4', ok: true, why: 'Right. Matching their low price beats losing your customers.' }
                ] },
              { t: 'read', title: '£2 wins either way', body: [
                'Whatever the other café does, £2 earns you more. Charging £2 is your dominant strategy.',
                'The other café reasons the same way and charges £2 too. You both make 4, when you could both have made 6.',
                'This trap is called the <b>prisoner\'s dilemma</b>. Each player does the sensible thing, and both end up worse off.'
              ] },
              { t: 'choice', title: 'Spot it in the wild', q: 'Which of these is a prisoner\'s dilemma?',
                options: [
                  { text: 'Two airlines on one route both adding free checked bags to win customers', ok: true, why: 'Right. Each gains by adding the perk, but when both do it they\'ve given value away and neither wins more customers.' },
                  { text: 'A shop deciding what time to open on Sundays', why: 'Only one player is choosing here.' },
                  { text: 'Choosing lottery numbers', why: 'That\'s chance. Nobody is reacting to your choice.' }
                ] },
              { t: 'summary', points: ['A dominant strategy is best whatever the other player does.', 'When both players follow their dominant strategy, they can both end up worse off.', 'That trap is the prisoner\'s dilemma.'] }
            ]
          },
          {
            id: 'nash-equilibrium', title: 'Nash equilibrium', minutes: 9, kind: 'Game',
            steps: [
              { t: 'read', title: 'Nobody wants to move', body: [
                'Most games don\'t have a dominant strategy. To predict what happens, we look for a <b>Nash equilibrium</b>: a set of moves where no player would gain by changing their move on their own.',
                'It\'s named after John Nash, who proved in 1950 that every game with a finite number of moves has at least one, as long as players are allowed to mix their moves at random.'
              ] },
              { t: 'read', title: 'How to spot one', body: [
                'Take each cell and ask two questions. If I switched my move, would I do better? If they switched theirs, would they do better?',
                'If the answer to both is no, that cell is an equilibrium.'
              ] },
              { t: 'matrix', task: 'nash', title: 'Find the equilibria', prompt: 'Two suppliers each pick a data format for a shared client. They both do better if they pick the same one. Tap every cell you think is a Nash equilibrium, then check.',
                rows: ['You pick format A', 'You pick format B'], cols: ['They pick A', 'They pick B'], pay: [[[4, 4], [0, 0]], [[0, 0], [2, 2]]], unit: 'points',
                explain: 'Both picking A and both picking B are equilibria. In either one, switching on your own drops you to 0. This is a coordination game: the hard part is agreeing which equilibrium to be in.' },
              { t: 'matrix', task: 'nash', title: 'Back to the cafés', prompt: 'Where is the equilibrium in the two cafés game? Tap every cell you think qualifies.', ...CAFES,
                explain: 'Only both charging £2. From both charging £3, either café gains by undercutting, so that cell isn\'t stable even though it pays more.' },
              { t: 'summary', points: ['A Nash equilibrium is a set of moves where nobody gains by changing on their own.', 'Some games have one equilibrium, some have several.', 'Stable doesn\'t mean good for the players.'] }
            ]
          }
        ]
      },
      {
        title: 'Games that repeat',
        lessons: [
          {
            id: 'repeated-games', title: 'Playing the same game again', minutes: 10, kind: 'Game',
            steps: [
              { t: 'read', title: 'The shadow of the future', body: [
                'In the cafés game, charging £2 was dominant. But real cafés set prices every day, and tomorrow\'s rival remembers what you did today.',
                'When a game repeats, a player can reward co-operation and punish undercutting. That changes the maths.'
              ] },
              { t: 'repeated', title: 'Eight days on one street', prompt: 'Set your price each day. The other café follows a fixed rule you\'ll see at the end.',
                rounds: 8, roundName: 'Day', moves: ['Charge £3', 'Charge £2'], short: ['£3', '£2'], ...CAFES },
              { t: 'read', title: 'What just happened', body: [
                'The other café played <b>tit-for-tat</b>: start friendly, then copy whatever you did the day before.',
                'Against tit-for-tat, charging £3 every day earns 48. Each time you undercut, you win one big day and then face a price war.',
                'In 1980 the political scientist Robert Axelrod ran a tournament of strategies for the repeated prisoner\'s dilemma. Tit-for-tat, one of the simplest entries, won.'
              ] },
              { t: 'choice', title: 'The last day', q: 'Why does undercutting on the final day pay off against tit-for-tat?',
                options: [
                  { text: 'There\'s no tomorrow left for it to punish you', ok: true, why: 'Right. The threat of tomorrow keeps prices up, so it disappears on the last day. Contracts with a known end date have the same problem.' },
                  { text: 'Tit-for-tat always charges £3 on the last day', why: 'It copies your previous day, so it charges £3 only if you did.' },
                  { text: 'It doesn\'t pay off', why: 'It does: you make 8 instead of 6, and there\'s no day left for a price war.' }
                ] },
              { t: 'summary', points: ['Repetition lets players reward co-operation and punish cheating.', 'Simple, forgiving rules like tit-for-tat do well.', 'When the end is in sight, co-operation gets fragile.'] }
            ]
          }
        ]
      }
    ],
    exam: {
      pass: 6,
      questions: [
        { q: 'What makes a situation a game in game theory?', options: ['Your result depends on what someone else chooses', 'There is a winner and a loser', 'There is an element of luck', 'Money is involved'], answer: 0, why: 'A game is about strategic interdependence: your outcome depends on another player\'s choice.' },
        { q: 'A payoff matrix cell shows (5, 1). What does the 1 mean?', options: ['Your payoff', 'The column player\'s payoff', 'The chance of this outcome', 'The round number'], answer: 1, why: 'Your payoff comes first, the column player\'s second.' },
        { q: 'A dominant strategy is a move that…', options: ['most players choose', 'gives the highest total for both players', 'is best for you whatever the other player does', 'you must play first'], answer: 2, why: 'Dominant means it beats your other options against every move the other player could make.' },
        { q: 'In a prisoner\'s dilemma, when both players use their dominant strategy…', options: ['both get their best possible payoff', 'both end up worse off than if they had co-operated', 'one player always wins', 'the game ends in a draw'], answer: 1, why: 'That\'s the dilemma: individually sensible moves add up to a worse result for both.' },
        { q: 'Two firms pick a format. Both A pays (4, 4), both B pays (2, 2), and mismatches pay (0, 0). How many Nash equilibria in pure strategies?', options: ['None', 'One', 'Two', 'Four'], answer: 2, why: 'Both A and both B: in each, switching alone drops you to 0.' },
        { q: 'Which statement about Nash equilibrium is true?', options: ['It\'s always the best outcome for everyone', 'No player gains by changing their move on their own', 'Every game has exactly one', 'Only one player is happy with it'], answer: 1, why: 'That\'s the definition. It can still be a poor outcome, and some games have several.' },
        { q: 'Tit-for-tat starts by…', options: ['co-operating, then copying your previous move', 'undercutting, then copying you', 'choosing at random', 'always co-operating whatever you do'], answer: 0, why: 'Nice first, then it mirrors you.' },
        { q: 'Why does co-operation get harder near the end of a repeated game?', options: ['Players get tired', 'Payoffs shrink each round', 'There are fewer future rounds to punish cheating', 'The rules change'], answer: 2, why: 'The future is what makes punishment credible. When it runs out, so does the incentive to co-operate.' }
      ]
    }
  };

  const procurement = {
    id: 'procurement', title: 'Game theory for procurement', piece: 'rook', price: 19, status: 'preview', level: 'Intermediate', minutes: 70,
    summary: 'Tenders, reverse auctions and supplier relationships, seen as the games they are. Built with procurement practitioners.',
    outcomes: ['Keep suppliers honest across repeated tenders', 'Design reverse auctions that avoid the winner\'s curse', 'Price the real cost of supplier lock-in'],
    modules: [
      { title: 'Tenders as games', lessons: [
        { id: 'repeated-tenders', title: 'Repeated tenders', minutes: 10, kind: 'Game', preview: true, steps: [
          { t: 'read', title: 'Same suppliers, every quarter', body: [
            'Most procurement isn\'t a one-off. The same few suppliers bid for your contracts again and again, and they remember how the last round went.',
            'Play the supplier\'s side to feel why that matters. You and one rival bid for the same contract every quarter.'
          ] },
          { t: 'repeated', title: 'Eight quarters', prompt: 'Hold your price or undercut? Your rival follows a fixed rule you\'ll see at the end. Payoffs are margin in £k per quarter.',
            rounds: 8, roundName: 'Q', moves: ['Hold price', 'Undercut'], short: ['H', 'U'],
            rows: ['You hold', 'You undercut'], cols: ['Rival holds', 'Rival undercuts'], pay: [[[3, 3], [0, 5]], [[5, 0], [1, 1]]], unit: 'margin, £k' },
          { t: 'read', title: 'What this means for buyers', body: [
            'Suppliers who meet you every quarter can sustain high prices without ever talking to each other. Each one holds because undercutting would start a price war.',
            'As a buyer you can break that by changing the game: varying contract lengths, adding new bidders, or rewarding the first supplier to cut.'
          ] },
          { t: 'summary', points: ['Repeated tenders let suppliers co-operate without colluding.', 'A known final round weakens that co-operation.', 'Buyers can change the game\'s structure to bring prices down.'] }
        ] },
        { id: 'reverse-auctions', title: 'Reverse auctions and the winner\'s curse', minutes: 12, kind: 'Game' },
        { id: 'sealed-or-open', title: 'Sealed bids or open rounds', minutes: 9, kind: 'Concept' }
      ] },
      { title: 'Supplier relationships', lessons: [
        { id: 'lock-in', title: 'Lock-in and switching costs', minutes: 10, kind: 'Concept' },
        { id: 'hold-up', title: 'The hold-up problem', minutes: 11, kind: 'Game' },
        { id: 'dual-sourcing', title: 'Dual sourcing as a threat', minutes: 9, kind: 'Game' }
      ] }
    ]
  };

  const later = (id, title, piece, minutes, summary, modules) => ({ id, title, piece, price: 19, status: 'production', level: 'Intermediate', minutes, summary, outcomes: [],
    modules: modules.map(([t, ls], mi) => ({ title: t, lessons: ls.map((x, i) => ({ id: id + '-' + mi + '-' + i, title: x, minutes: 8 + (i * 3) % 5, kind: i % 2 ? 'Concept' : 'Game' })) })) });

  window.COURSES = [
    foundations,
    procurement,
    later('negotiation', 'Negotiation', 'knight', 80, 'Walk-away points, anchors and credible threats, practised against live opponents.',
      [['Before the table', ['Your walk-away as a threat point', 'Mapping the zone of agreement']], ['At the table', ['Anchors and first offers', 'Commitment and credible threats', 'When to walk away']]]),
    later('strategy', 'Competitive strategy', 'queen', 60, 'Entry, deterrence and timing: when to move first and when to wait.',
      [['Moving first', ['Market entry and deterrence', 'First mover or fast follower']], ['Signals', ['Capacity you may never use', 'Cheap talk and costly signals']]]),
    later('auctions', 'Auctions and bidding', 'bishop', 55, 'How auction formats change the way people bid, and how to bid well in each.',
      [['Formats', ['Sealed-bid against open ascending', 'Reserve prices']], ['Bidding well', ['Bid shading', 'The winner\'s curse in practice']]]),
    later('alliances', 'Alliances and coalitions', 'king', 50, 'Splitting gains fairly and building partnerships that hold together.',
      [['Splitting the pie', ['The Shapley value, simply', 'Which coalitions are stable']], ['Partnerships', ['Joint ventures and hold-up']]])
  ];
})();
