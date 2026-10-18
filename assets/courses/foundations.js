/* Course 1: Think Three Moves Ahead. Built from training-library/courses/01-think-three-moves-ahead.md */
(() => {
  const CAFES = {
    rows: ['You charge £3', 'You charge £2'],
    cols: ['They charge £3', 'They charge £2'],
    pay: [[[6, 6], [2, 8]], [[8, 2], [4, 4]]],
    unit: 'daily profit, £100s'
  };
  const GYMS = {
    rows: ['You advertise', 'You don\'t'],
    cols: ['They advertise', 'They don\'t'],
    pay: [[[20, 20], [40, 10]], [[10, 40], [30, 30]]],
    unit: 'January profit, £k'
  };
  const PENALTY = {
    rows: ['You shoot left', 'You shoot right'],
    cols: ['Keeper dives left', 'Keeper dives right'],
    pay: [[[0, 1], [1, 0]], [[1, 0], [0, 1]]],
    unit: '1 = a goal for you, or a save for the keeper'
  };
  const BAR = {
    rows: ['You quote 20', 'You quote 15'],
    cols: ['B quotes 20', 'B quotes 15'],
    pay: [[[100, 100], [0, 150]], [[150, 0], [75, 75]]],
    unit: 'profit per tender, £k'
  };

  (window.GAMBIT_COURSES = window.GAMBIT_COURSES || []).push({
    id: 'foundations', order: 1, track: 'Strategic thinking', title: 'Think Three Moves Ahead', piece: 'pawn',
    free: true,
    status: 'live', level: 'Beginner', minutes: 114,
    summary: 'Game theory foundations in plain English: payoffs, dominant moves, Nash equilibrium, game trees, threats and repeated games, learned by playing them.',
    outcomes: [
      'Spot a strategic situation and turn the story into a payoff matrix or a game tree',
      'Solve simple games with dominance, Nash equilibrium and backward induction',
      'Tell a credible threat from an empty one, and predict which the other side will carry out',
      'Explain why co-operation and collusion survive in repeated games, and what breaks them'
    ],
    modules: [
      {
        title: 'The language of games',
        lessons: [
          {
            id: 'what-is-a-game', title: 'Why incentives bite back', minutes: 10, kind: 'Concept', preview: true,
            steps: [
              { t: 'read', title: 'People react to rules', body: [
                'The story goes that in colonial Delhi, the British authorities wanted fewer cobras on the streets. So they paid a cash reward for every dead cobra people brought in. It sounded like a simple, sensible plan.',
                'The people who designed the reward treated everyone else as fixed, as if they\'d just keep living the way they always had. Before you read on, make a guess: what did the people of Delhi do next?'
              ] },
              { t: 'choice', title: 'The cobra reward', q: 'What happened after the reward was introduced?',
                options: [
                  { text: 'People bred cobras to claim the reward', ok: true, why: 'Right. The reward made cobras valuable. When it was scrapped, the farmed snakes were set loose, and Delhi ended up with more cobras than before.' },
                  { text: 'The cobras were wiped out', why: 'That was the plan. It\'s not what happened.' },
                  { text: 'Nobody bothered, the reward was too small', why: 'It was big enough to start a small industry.' },
                  { text: 'The cobras moved to other cities', why: 'Snakes don\'t read policy papers. People do.' }
                ] },
              { t: 'choice', title: 'The window tax', q: 'From 1696, England taxed houses by their number of windows, so that bigger, richer houses paid more. What did owners do?',
                options: [
                  { text: 'Bricked up windows', ok: true, why: 'Right. The tax raised less than planned, and you can still see bricked-up windows on old houses today. It ran until 1851.' },
                  { text: 'Paid more tax', why: 'Some did, but many changed the house instead.' },
                  { text: 'Moved to flats', why: 'Not in the 1690s.' },
                  { text: 'Nothing: windows are part of the house', why: 'Not for long. A few bricks cost far less than years of tax.' }
                ] },
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
              { t: 'read', title: 'Five things to write down', body: [
                'To describe any game, write down five things. <b>Players</b>: who is choosing. <b>Moves</b>: what each of them can do. <b>Payoffs</b>: what each player ends up with for every combination of moves.',
                '<b>Timing</b>: do you choose at the same time, or one after another, seeing what came before? <b>Structure</b>: is it a one-off, or will you meet again? Both change what a sensible player does, as you\'ll see later in this course.',
                'A model is like a map. A map showing every tree and every house would be as big as the city, and useless. The economist John McMillan (1992) made the point that experience shows you the trees, and game theory shows you the forest.',
                'Five rules to keep run through the whole course: name every player; consider all your options; work out where each one leads; think from the end of the game backwards; and remember there\'s usually a next game too.'
              ] },
              { t: 'choice', title: 'Quick check', q: 'A supermarket and a discounter are each deciding whether to cut milk prices this week. What are the payoffs?',
                options: [
                  { text: 'The two shops', why: 'Those are the players.' },
                  { text: 'Cutting the price or keeping it', why: 'Those are the strategies.' },
                  { text: 'The profit each shop makes for every combination of choices', ok: true, why: 'Right. A payoff is what each player gets in each possible outcome.' },
                  { text: 'The price of a pint of milk', why: 'The price is part of a strategy, not what the shop ends up with.' }
                ] },
              { t: 'choice', title: 'What\'s missing?', q: 'A hotel group plans a big new hotel to win more of the city\'s visitors. It has worked out the building cost and the extra bookings. Which of the five things has it skipped?',
                options: [
                  { text: 'The other players', ok: true, why: 'Right. A rival can build one too. If both do, the visitors are shared and neither hotel pays for itself. You\'ll meet this mistake again in Course 2.' },
                  { text: 'The payoffs', why: 'It has those: the cost and the extra bookings.' },
                  { text: 'Its own moves', why: 'Build or don\'t build. It has those.' },
                  { text: 'Timing', why: 'Timing matters, but the bigger hole is that it thinks it\'s the only player.' }
                ] },
              { t: 'summary', points: ['People react to the rules you set, so predict the reaction before you set them.', 'A game is any situation where your result depends on someone else\'s choice.', 'Describe it with five things: players, moves, payoffs, timing and structure.'] }
            ]
          },
          {
            id: 'payoff-matrix', title: 'Reading a payoff matrix', minutes: 8, kind: 'Concept',
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
              { t: 'read', title: 'Build one yourself', body: [
                'Now turn a story into a matrix. Two gyms on the same high street are each deciding whether to run a January ad campaign. Without any ads, each gym makes £30k in January.',
                'An ad campaign costs £10k. If only one gym advertises, it pulls £20k of members away from the other. If both advertise, the effects cancel out, and each has simply paid for its ad. Work out each cell one at a time.'
              ] },
              { t: 'choice', title: 'Both advertise', q: 'If you both advertise, what does each gym make in January?',
                options: [
                  { text: '£20k each', ok: true, why: 'Right. The ads cancel out, so each keeps its £30k of members and pays £10k for the ad.' },
                  { text: '£30k each', why: 'That\'s if neither advertises. Remember the ad costs £10k whatever happens.' },
                  { text: '£40k each', why: 'Nobody pulls members from anyone when both advertise.' },
                  { text: '£10k each', why: 'Each pays £10k for the ad, but nobody loses members, so each keeps £30k minus £10k.' }
                ] },
              { t: 'choice', title: 'Only you advertise', q: 'You advertise and they don\'t. Which cell is right? (Yours first, theirs second, in £k.)',
                options: [
                  { text: '(40, 10)', ok: true, why: 'Right. You make 30 + 20 minus the 10 for the ad: 40. They lose £20k of members: 10.' },
                  { text: '(50, 10)', why: 'Remember the ad costs you £10k.' },
                  { text: '(40, 30)', why: 'The members you won came from them, so they drop to 10.' },
                  { text: '(20, 20)', why: 'That\'s the cell where you both advertise.' }
                ] },
              { t: 'matrix', task: 'explore', title: 'The finished table', prompt: 'Here\'s the whole gym matrix. Tap three cells and check each one against the story.', ...GYMS },
              { t: 'summary', points: ['Rows are your options, columns are theirs.', 'Each cell shows your payoff first, then theirs.', 'To build a matrix, work out each cell from the story one at a time.'] }
            ]
          }
        ]
      },
      {
        title: 'Solving simple games',
        lessons: [
          {
            id: 'dominant-strategies', title: 'Dominant strategies and the prisoner\'s dilemma', minutes: 12, kind: 'Game',
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
              { t: 'matrix', task: 'nash', title: 'The two robbers', prompt: 'Two robbers dumped the cash in a river, so the only evidence is their guns. The police hold them apart and offer each the same deal: testify and walk free. Tap the cell where they both end up.',
                rows: ['You deny', 'You confess'], cols: ['They deny', 'They confess'],
                pay: [[[-1, -1], [-10, 0]], [[0, -10], [-7, -7]]], unit: 'years in prison, shown as minus numbers so higher is better',
                explain: 'Confess, confess. If the other denies, confessing means walking free instead of a year inside. If the other confesses, confessing means 7 years instead of 10. So both confess and serve 7 years, when 1 year each was on the table. Individual sense, collective nonsense.' },
              { t: 'choice', title: 'Spot it in the wild', q: 'Which of these is a prisoner\'s dilemma?',
                options: [
                  { text: 'Two airlines on one route both adding free checked bags to win customers', ok: true, why: 'Right. Each gains by adding the perk, but when both do it they\'ve given value away and neither wins more customers. The gyms from the last lesson are the same trap: advertising wins either way (40 beats 30, 20 beats 10), so both advertise and make 20 instead of 30.' },
                  { text: 'A shop deciding what time to open on Sundays', why: 'Only one player is choosing here.' },
                  { text: 'Choosing lottery numbers', why: 'That\'s chance. Nobody is reacting to your choice.' }
                ] },
              { t: 'read', title: 'Cross out the losers', body: [
                'Often nobody has a dominant strategy. You can still make progress by crossing out a <b>dominated</b> move: one that\'s always beaten by another of the same player\'s moves, whatever the other side does.',
                'Each crossing-out can reveal a new dominated move, so look again after every one. This only works if you trust the other side to be sensible, and to know that you are too.'
              ] },
              { t: 'matrix', task: 'nash', title: 'Cross it out', prompt: 'You pick the row, they pick the column. Neither of you has a dominant strategy. Find the one stable cell. Hint: start with the column player\'s worst option.',
                rows: ['Up', 'Down'], cols: ['Left', 'Middle', 'Right'],
                pay: [[[2, 1], [2, 3], [0, 2]], [[1, 4], [1, 2], [3, 0]]], unit: 'points',
                explain: 'Right is always beaten by Middle for them (3 beats 2, and 2 beats 0), so cross it out. With Right gone, Up beats Down for you (2 beats 1 twice). Knowing you play Up, they pick Middle. Answer: Up, Middle.' },
              { t: 'summary', points: ['A dominant strategy is best whatever the other player does.', 'When both follow theirs, both can end up worse off: the prisoner\'s dilemma.', 'No dominant strategy? Cross out moves that are always beaten and look again.'] }
            ]
          },
          {
            id: 'nash-equilibrium', title: 'Nash equilibrium', minutes: 12, kind: 'Game',
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
              { t: 'read', title: 'Why trust the prediction?', body: [
                'Three reasons. If two sides agreed an equilibrium in advance, neither would want to break the deal, even with no contract. If an outsider suggested it, neither would ignore the advice. And people who play a game often tend to drift into one.',
                'Now try it on a deal. Two oil producers have agreed to keep their output low. You\'re the small producer: your output barely moves the world price. The big producer\'s output moves it a lot. Does the deal survive?'
              ] },
              { t: 'matrix', task: 'nash', title: 'Two oil producers', prompt: 'You\'re the small producer. Tap every Nash equilibrium.',
                rows: ['You pump low', 'You pump high'], cols: ['Big pumps low', 'Big pumps high'],
                pay: [[[4, 60], [2, 61]], [[8, 55], [4, 52]]], unit: 'profit, $m a month',
                explain: 'You pump high, the big producer pumps low. High always pays you more (8 beats 4, 4 beats 2), so it\'s your dominant strategy. Given that, the big producer does better holding back (55 beats 52). Work out the other side\'s incentives before choosing yours: sometimes the big player is the one who has to adjust.' },
              { t: 'matrix', task: 'nash', title: 'Add a middle option', prompt: 'Now you can also pump a medium amount, and neither of you has an option that always wins. Check each cell with the two questions.',
                rows: ['You pump low', 'You pump medium', 'You pump high'], cols: ['Big pumps low', 'Big pumps high'],
                pay: [[[4, 60], [3, 62]], [[6, 57], [5, 55]], [[8, 50], [2, 46]]], unit: 'profit, $m a month',
                explain: 'Only you high, big low. Medium is your best reply when the big producer pumps high, and low is never your best reply. But the big producer only pumps high if you pump low. The cell-by-cell check still finds the one stable outcome.' },
              { t: 'matrix', task: 'nash', title: 'The subsidy game', prompt: 'You\'re an appliance maker deciding whether to build a new factory. The government decides whether to offer you a subsidy. Tap every Nash equilibrium.',
                rows: ['You invest', 'You don\'t invest'], cols: ['Government subsidises', 'Government doesn\'t'],
                pay: [[[50, 70], [-20, 100]], [[10, -10], [0, 0]]], unit: '£m',
                explain: 'You don\'t invest and there\'s no subsidy. The government is better off not subsidising whatever you do (100 beats 70, 0 beats minus 10), so you don\'t invest. Both lose the (50, 70) deal because the government\'s promise isn\'t believable. That\'s a commitment problem, and Course 2 is about solving those.' },
              { t: 'summary', points: ['A Nash equilibrium is a set of moves where nobody gains by changing on their own.', 'Check every cell with two questions: would I switch? Would they?', 'Stable doesn\'t mean good: (0, 0) can beat (50, 70) when promises can\'t be trusted.'] }
            ]
          },
          {
            id: 'two-thirds-average', title: 'How far ahead do others think?', minutes: 10, kind: 'Game',
            steps: [
              { t: 'read', title: 'Two-thirds of the average', body: [
                'Here\'s a game played in classrooms, labs and newspapers. Everyone picks a whole number from 0 to 100. The winner is whoever is closest to <b>two-thirds of the average</b> of all the numbers picked.',
                'Before any theory, play it. You\'re one of 100 players, and the other 99 guess the way people did in published lab experiments. Pick your number before you look at any theory.'
              ] },
              { t: 'slider', title: 'Make your guess', prompt: 'Set your number. The other 99 players average 36. Move your guess until you\'re within 3 of the winning number.',
                inputs: [ { id: 'guess', label: 'Your number', min: 0, max: 100, step: 1, value: 50 } ],
                outputs: [
                  { id: 'avg', label: 'Average of all 100 guesses', expr: '(36 * 99 + guess) / 100', decimals: 1 },
                  { id: 'target', label: 'Winning number (two-thirds of the average)', expr: 'avg * 2 / 3', decimals: 1 },
                  { id: 'gap', label: 'How far you are from it', expr: 'Math.abs(guess - target)', decimals: 1 }
                ],
                goal: { expr: 'gap <= 3', text: 'Get within 3 of the winning number.' },
                explain: 'This crowd averaged about 36, so the winning number was about 24. That\'s close to what Rosemarie Nagel (1995) found in the lab: first-round averages in the mid-30s, so winning guesses in the low 20s. If you picked 0, you were right in theory and lost in practice.' },
              { t: 'read', title: 'One step, two steps, all the way', body: [
                'Level 0 picks at random, so the average is 50. Level 1 expects that and picks two-thirds of 50: 33. Level 2 expects level 1 and picks 22. Level 3 picks 15. Keep climbing and you reach 0, the only Nash equilibrium.',
                'Real people stop early: most think one or two steps ahead. When the same group plays again, guesses fall towards 0. Experience pushes people towards the game-theory answer. A newspaper contest run with the economist Richard Thaler in 1997 drew thousands of entries, and the winning number was 13.',
                'The lesson for negotiators: theory tells you where the game ends. Your job is to guess where the other side actually is. Give them too much credit and you lose; give them too little and you lose too.'
              ] },
              { t: 'choice', title: 'Round two', q: 'You play again with the same group. Last time the average was 36. What do you pick now?',
                options: [
                  { text: 'About 16', ok: true, why: 'Good. Two-thirds of 36 is 24, but everyone else just saw that too and will shade down. Going one step further than the crowd is the winning habit.' },
                  { text: '24', why: 'That wins only if nobody else learned anything from round one.' },
                  { text: '0', why: 'Correct in theory, but the group won\'t get there in one round. You\'d be too far ahead.' },
                  { text: '36', why: 'That\'s last round\'s average. Everyone will go lower.' }
                ] },
              { t: 'read', title: 'Where you\'ll meet it', body: [
                'The economist John Maynard Keynes compared stock markets to a beauty contest where you win by picking the face other people will pick, not the one you like. Prices depend on what you think others think.',
                'Some tender rules work the same way. Italian public works have used <b>average-bid auctions</b>, where the winning bid is the one closest to an average of all the bids. Francesco Decarolis (2014) studied them. Pricing turns into exactly this guessing game.'
              ] },
              { t: 'choice', title: 'Spot the guessing game', q: 'Which tender rule turns pricing into a two-thirds game?',
                options: [
                  { text: 'The bid closest to the average of all bids wins', ok: true, why: 'Right. Your best price depends on what you think everyone else will bid, not on your costs.' },
                  { text: 'The lowest bid wins', why: 'That\'s a normal sealed-bid auction. Covered in Course 8.' },
                  { text: 'The buyer picks after negotiating with everyone', why: 'That\'s a bidding process with talks. Covered in Course 6.' }
                ] },
              { t: 'summary', points: ['The equilibrium tells you where reasoning ends, not where people stop.', 'Most people think one or two steps ahead; experience pushes them further.', 'Win by staying one step ahead of the actual crowd, not ten.'] }
            ]
          },
          {
            id: 'multiple-equilibria', title: 'When there\'s more than one answer', minutes: 10, kind: 'Game',
            steps: [
              { t: 'read', title: 'Two right answers', body: [
                'In the last lesson, the data-format game had two equilibria. Many games do. Theory tells you it will be one of them, but not which one.',
                'Here\'s another. Two firms are picking a charging connector for a product they both sell into. Each prefers its own design, but both lose badly if they don\'t match. You\'re Firm A.'
              ] },
              { t: 'matrix', task: 'nash', title: 'Whose connector?', prompt: 'Tap every Nash equilibrium.',
                rows: ['You use ours', 'You use theirs'], cols: ['They use ours', 'They use theirs'],
                pay: [[[5, 2], [0, 0]], [[0, 0], [2, 5]]], unit: 'profit, £m',
                explain: 'Both matching cells are equilibria. You prefer one, they prefer the other. Game theory can\'t pick for you, so what happens next depends on conventions, talks or who commits first.' },
              { t: 'read', title: 'How the tie gets broken', body: [
                'Real people pick an equilibrium in four ways. <b>Conventions</b>: we did it this way last time. <b>Focal points</b>: the answer that stands out to both sides, like meeting at the main station at noon, an idea from Thomas Schelling (1960). <b>Talking first</b>. Or <b>moving first</b>, so the other side has to follow.',
                'None of these is guaranteed, but each gives both sides a reason to expect the same answer. Focal points in negotiation get a lesson of their own in Course 3.'
              ] },
              { t: 'choice', title: 'Breaking the tie', q: 'Which move is most likely to settle the connector fight in your favour?',
                options: [
                  { text: 'Announce first and visibly start production on your connector', ok: true, why: 'Right. Once you\'re committed, their best reply is to match you. That\'s the idea behind Course 2.' },
                  { text: 'Wait and see what they do', why: 'Then they get to move first.' },
                  { text: 'Offer to flip a coin', why: 'Fair, but not in your favour.' },
                  { text: 'Ask for their preference', why: 'You already know it: theirs.' }
                ] },
              { t: 'read', title: 'No stable answer', body: [
                'Some games have no stable pair of plain moves at all. Take a penalty kick. You shoot left or right; the keeper dives left or right. If the keeper guesses right, no goal. If wrong, goal. Any fixed habit gets punished.',
                'The answer is to <b>randomise</b>, so the other side can\'t exploit you: 50:50 here. Nash\'s 1950 result is that every game like this has an equilibrium once mixing is allowed. Ignacio Palacios-Huerta (2003) studied real professional penalties and found players\' mixes close to what the theory predicts.',
                'Business has the same games: when to audit, when to run a surprise inspection, when to run a promotion. If you\'re predictable, you\'re exploitable, so build some randomness into the plan.'
              ], figure: PENALTY },
              { t: 'choice', title: 'Your penalty', q: 'You take penalties every week. Last season you shot left 80% of the time. What should the keeper do?',
                options: [
                  { text: 'Dive left every time', ok: true, why: 'Right, and that\'s why you shouldn\'t have a habit. The safe plan is to be unpredictable: about 50:50 here.' },
                  { text: 'Dive at random', why: 'Possible, but the keeper does better exploiting your habit.' },
                  { text: 'Stay in the middle', why: 'Not an option in this simple game.' }
                ] },
              { t: 'summary', points: ['Many games have more than one equilibrium; conventions, focal points and moving first decide which one happens.', 'Some games have no stable plain move: then randomise.', 'If you\'re predictable, you\'re exploitable.'] }
            ]
          }
        ]
      },
      {
        title: 'Moves in turn',
        lessons: [
          {
            id: 'game-trees', title: 'Game trees and backward induction', minutes: 14, kind: 'Game',
            steps: [
              { t: 'read', title: 'When moves take turns', body: [
                'So far everyone moved at the same time. When moves happen one after another and each player sees what came before, draw a <b>game tree</b>: the first mover at the top, a branch for each move, and the payoffs at the tips.',
                'Ernst Zermelo showed in 1913 that every finite game like this, chess included, can be solved by working back from the end. Reinhard Selten sharpened the idea in 1965: a good plan has to make sense at every point in the game, not just at the start.'
              ] },
              { t: 'read', title: 'Start at the end', body: [
                'Five steps. (1) List the players and the order they move. (2) Draw every branch. (3) Write the payoffs at every tip. (4) At the last decision, circle what that player would pick and cut the other branches. (5) Move up a level and repeat until you reach the top.',
                'This is <b>backward induction</b>. What\'s left at the end is the equilibrium of the tree (strictly, a "subgame perfect" equilibrium: no player is relying on a move they wouldn\'t really make when the time came).'
              ] },
              { t: 'read', title: 'Who designs the pump?', body: [
                'A coffee-machine maker needs a pump for its new range and values each pump at £200. Supplier A has done the research and could design one easily. If A designs it, nobody else can match the spec, so A can quote high.',
                'Or the maker designs the pump in-house for £10 a unit. Then five suppliers, A included, all with the same £40 production cost, compete for the order. A high quote is £100, a low one £50.',
                'Two more facts are in the brief: the range of models isn\'t final yet, and there\'s no word on an energy-efficiency grant. Before you draw anything, decide which facts matter.'
              ] },
              { t: 'sort', title: 'Relevant or not?', prompt: 'Half the skill is filtering. Sort each fact from the brief.', buckets: ['Changes a payoff', 'Doesn\'t'],
                items: [
                  { text: 'Supplier A can design the pump easily', bucket: 0, why: 'It means A can lock you in if you let it design.' },
                  { text: 'An in-house design costs £10 a unit', bucket: 0, why: 'That cost comes straight off your payoff on the in-house branch.' },
                  { text: 'Five suppliers with the same £40 cost', bucket: 0, why: 'That\'s the competition the in-house design unlocks.' },
                  { text: 'Quotes of £100 or £50', bucket: 0, why: 'Those set every payoff in the tree.' },
                  { text: 'The range of models isn\'t final', bucket: 1, why: 'It doesn\'t change any number in the tree, so leave it out.' },
                  { text: 'No word on an energy-efficiency grant', bucket: 1, why: 'Nothing has been offered, so it changes no payoff.' }
                ] },
              { t: 'tree', title: 'Solve the pump tree', prompt: 'Payoffs are (maker, Supplier A), £ per pump. A makes 60 at £100 and 10 at £50. After an in-house design, a high quote loses to a rival at £50, and a low quote wins one time in five (an expected 2). Pick what each player does at every point, then check.',
                players: ['Maker', 'Supplier A'], unit: '£ per pump',
                root: { p: 0, options: [
                  { label: 'Let A design it', next: { p: 1, options: [ { label: 'Quote high', pay: [100, 60] }, { label: 'Quote low', pay: [150, 10] } ] } },
                  { label: 'Design in-house', next: { p: 1, options: [ { label: 'Quote high', pay: [140, 0] }, { label: 'Quote low', pay: [140, 2] } ] } } ] },
                explain: 'Start at the end. If A designs, A quotes high (60 beats 10) and you get 100. If you design, you get 140 whatever A does (£200 minus £50 minus your £10). So you design in-house. Paying £10 a unit for the design buys a £50 drop in price, so you\'re £40 a pump better off.' },
              { t: 'choice', title: 'What did the design buy you?', q: 'Why is designing in-house worth £10 a unit?',
                options: [
                  { text: 'It turns one supplier into five competing ones', ok: true, why: 'Right. The design is a ticket to competition. £10 buys you a £50 drop in price, a net £40 a pump.' },
                  { text: 'The pump is cheaper to produce', why: 'Production cost is the same £40 for everyone.' },
                  { text: 'Supplier A would refuse to bid', why: 'A still bids. It just can\'t charge a premium.' }
                ] },
              { t: 'summary', points: ['Draw a tree when moves come in turn and each player sees the last move.', 'Solve from the end: at every point, keep the branch that player prefers.', 'Leave out facts that don\'t change a payoff.'] }
            ]
          },
          {
            id: 'pirates-treasure', title: 'The pirates\' treasure', minutes: 12, kind: 'Game',
            steps: [
              { t: 'read', title: 'Taking to the high seas', body: [
                'Five pirates, numbered 1 to 5 by rank, share 100 gold bars. Pirate 1 proposes a split, and every pirate still alive votes on it.',
                'If <b>half or more</b> vote yes, the split happens: a tie passes, and the proposer votes for his own plan. Otherwise the proposer goes overboard and the next pirate in line proposes.',
                'Each pirate wants first to stay alive, then as much gold as possible. He votes yes only if he gets <b>strictly more</b> than he would by voting no. They never meet again, and they\'re perfectly rational.'
              ] },
              { t: 'choice', title: 'Your prediction', q: 'How will the 100 bars be split?',
                options: [
                  { text: 'Roughly equally, 20 each', why: 'Let\'s find out. The rules reward the proposer far more than that.' },
                  { text: 'Pirate 1 gets most of it', ok: true, why: 'Right, and by a lot. Let\'s find out exactly how much.' },
                  { text: 'Pirate 5 gets most of it', why: 'Let\'s find out. Voting last turns out to be a weak seat.' },
                  { text: 'Pirate 1 is thrown overboard', why: 'Let\'s find out. With the right offer, he survives comfortably.' }
                ] },
              { t: 'choice', title: 'Pick your seat', q: 'Pirate 5 can never be thrown overboard. Does that make his seat better than pirate 1\'s?',
                options: [
                  { text: 'No: whoever proposes sets the terms', ok: true, why: 'Right. Being first, with the whole chain in view, is worth a lot. Pirate 5 is safe but gets only what he\'d get anyway.' },
                  { text: 'Yes: safety beats gold', why: 'Pirate 1 stays safe too, as long as his offer passes, and it will.' },
                  { text: 'They\'re the same', why: 'They\'re not. You\'re about to see pirate 1 keep almost everything.' }
                ] },
              { t: 'slider', title: 'Propose a split', prompt: 'You\'re pirate 1. Give bars to pirates 2 to 5; you keep the rest. You need 3 yes votes out of 5, and your own counts. Hint: a pirate votes yes only if he beats what he\'d get if you went overboard. Then pirate 2 would propose 99 / 0 / 1 / 0 for pirates 2, 3, 4 and 5.',
                inputs: [
                  { id: 'p2', label: 'Pirate 2', min: 0, max: 5, step: 1, value: 0 },
                  { id: 'p3', label: 'Pirate 3', min: 0, max: 5, step: 1, value: 0 },
                  { id: 'p4', label: 'Pirate 4', min: 0, max: 5, step: 1, value: 0 },
                  { id: 'p5', label: 'Pirate 5', min: 0, max: 5, step: 1, value: 0 }
                ],
                outputs: [
                  { id: 'keep', label: 'You keep', expr: '100 - p2 - p3 - p4 - p5', suffix: ' bars' },
                  { id: 'votes', label: 'Yes votes, yours included (3 needed)', expr: '1 + (p2 > 99 ? 1 : 0) + (p3 > 0 ? 1 : 0) + (p4 > 1 ? 1 : 0) + (p5 > 0 ? 1 : 0)' }
                ],
                goal: { expr: 'votes >= 3 && keep >= 97', text: 'Get your split passed while keeping at least 97 bars.' },
                explain: 'Pirates 3 and 5 would get nothing if you went overboard, so 1 bar each buys their votes. Pirate 4 would get 1, so he\'d need 2. Pirate 2 would get 99, so he\'s far too expensive. The cheapest plan that passes is 98 / 0 / 1 / 0 / 1.' },
              { t: 'read', title: 'Solve it from the end', body: [
                '<b>Two left</b> (pirates 4 and 5): pirate 4 votes for himself and a tie passes. He takes 100, pirate 5 gets 0. <b>Three left</b>: pirate 3 needs one more vote. Pirate 5 would get 0 if 3 went overboard, so 1 bar buys him: 99 / 0 / 1.',
                '<b>Four left</b>: pirate 2 needs one more vote. Pirate 4 would get 0 in the three-pirate round, so 1 bar buys him: 99 / 0 / 1 / 0. <b>Five left</b>: pirate 1 needs two more votes. Pirates 3 and 5 would get 0 in the four-pirate round, so 1 bar each: <b>98 / 0 / 1 / 0 / 1</b>.',
                'The pirate who moves first and can see the whole chain sets the terms. The others just get what they\'d have got anyway, plus one bar.'
              ] },
              { t: 'choice', title: 'Change one rule', q: 'Now a tie fails instead of passing. Three pirates are left, and pirate 3 proposes 100 / 0 / 0. What does pirate 4 do?',
                options: [
                  { text: 'Votes yes', ok: true, why: 'Right. If 3 goes overboard, pirate 4 faces pirate 5 alone, and with a tie failing, pirate 5 votes him over. Staying alive beats any gold. Work it all through and the five-pirate split becomes 97 / 0 / 1 / 2 / 0.' },
                  { text: 'Votes no', why: 'Then 3 goes overboard and 4 proposes to pirate 5 alone. A one-all tie now fails, so pirate 5 votes him over.' },
                  { text: 'Asks for 1 bar first', why: 'He has no bargaining power: his alternative is going overboard.' }
                ] },
              { t: 'read', title: 'Theory meets pride', body: [
                'Would pirate 3 really accept 1 bar out of 100? Real people often reject offers they see as insulting, even when it costs them. You\'ll see the evidence in Course 4, lesson 2.',
                'So a practical adviser to pirate 1 might offer his two allies something that feels fairer, nearer a 70:30 split of the gold across the coalition. The theory gives you the logic; people add pride. And small rule changes, like the tie rule, move the payoffs: hold that thought for Course 2.'
              ] },
              { t: 'summary', points: ['Solve long chains from the end, one round at a time.', 'Moving first, with the whole chain in view, is worth a lot.', 'Small rule changes move the payoffs, and real people may refuse offers that theory says they\'ll take.'] }
            ]
          },
          {
            id: 'credible-threats', title: 'Credible and empty threats', minutes: 12, kind: 'Game',
            steps: [
              { t: 'read', title: 'Would they really?', body: [
                'A threat only matters if, when the moment comes, carrying it out is the other side\'s best move. Otherwise it\'s <b>empty</b> (economists say "not credible"). The same goes for promises.',
                'The test is backward induction: go to the moment the threat must be carried out, and ask whether it\'s their best move then. What they say beforehand doesn\'t change the answer.'
              ] },
              { t: 'tree', title: 'IBM and Intel', prompt: 'Early 1980s. Intel was IBM\'s only source of a key chip. IBM can stick with Intel or build a second source, AMD. Intel promises to share the profits fairly, and threatens to stop all deliveries if IBM builds AMD. Payoffs are invented for teaching: shares of the profit, in %. What does IBM do?',
                players: ['IBM', 'Intel'], unit: '% of the profit',
                root: { p: 0, options: [
                  { label: 'Stick with Intel', next: { p: 1, options: [ { label: 'Exploit its monopoly', pay: [10, 90] }, { label: 'Share fairly', pay: [50, 50] } ] } },
                  { label: 'Build AMD', next: { p: 1, options: [ { label: 'Compete', pay: [40, 30] }, { label: 'Stop deliveries', pay: [10, 10] } ] } } ] },
                explain: 'Both of Intel\'s words are empty. If IBM sticks, Intel exploits (90 beats 50), so the promise to share means nothing. If IBM builds AMD, Intel competes (30 beats 10), so the threat to stop deliveries means nothing too. IBM builds AMD and gets 40. Intel ends up with 30 when 50 was available.' },
              { t: 'choice', title: 'Intel\'s position', q: 'Intel ended up with 30. What would have helped it most?',
                options: [
                  { text: 'A way to make its promise not to exploit IBM believable', ok: true, why: 'Right. If IBM trusted the 50:50 promise, it wouldn\'t build AMD, and Intel would get 50. Course 2 shows how Intel did it.' },
                  { text: 'A louder threat to stop deliveries', why: 'Volume doesn\'t help. IBM knows stopping costs Intel more than competing.' },
                  { text: 'Lower prices from the start', why: 'Prices aren\'t the issue. Trust is.' }
                ] },
              { t: 'tree', title: 'The newcomer', prompt: 'A sweetener\'s patent has run out, and a newcomer is thinking about building a plant. The incumbent threatens a price war if it enters. Figures are invented for teaching, in $m a year (newcomer, incumbent). Pick each move, then check.',
                players: ['Newcomer', 'Incumbent'], unit: '$m a year',
                root: { p: 0, options: [
                  { label: 'Stay out', pay: [0, 300] },
                  { label: 'Enter', next: { p: 1, options: [ { label: 'Start a price war', pay: [-20, 40] }, { label: 'Share the market', pay: [30, 150] } ] } } ] },
                explain: 'The newcomer enters. Once the plant is built, a price war gives the incumbent 40 against 150 for sharing, so it would cost 110 a year. It won\'t fight, and the newcomer, seeing that, enters and makes 30.' },
              { t: 'choice', title: 'Believe the threat?', q: 'Should the newcomer believe the price-war threat?',
                options: [
                  { text: 'No: once it has entered, fighting costs the incumbent 110 a year', ok: true, why: 'Right. Test the threat at the moment it must be carried out. Then, sharing is the incumbent\'s best move.' },
                  { text: 'Yes: the incumbent said so publicly', why: 'Saying it costs nothing. Doing it costs 110.' },
                  { text: 'Only if the incumbent is bigger', why: 'Size doesn\'t change the comparison of 40 and 150.' }
                ] },
              { t: 'read', title: 'A twist, and a hijacker', body: [
                'History adds a twist. In the real sweetener market, the incumbent did fight a newcomer hard in Europe, cutting prices sharply, to send a message ahead of its far bigger home market. A threat that\'s empty in a one-off game can be worth carrying out when there\'s a reputation to protect. More on that in the next lesson.',
                'Plain Nash equilibrium can also be fooled by empty threats. A hijacker holds a plane. The government pays a ransom or not; then the hijacker blows up the plane or releases it. Written as a matrix of complete plans, watch what happens.'
              ] },
              { t: 'matrix', task: 'nash', title: 'The hijacker\'s plans', prompt: 'You\'re the government. Each column is a complete plan for the hijacker, saying what it does if paid and if not paid. Tap every Nash equilibrium.',
                rows: ['You pay', 'You don\'t pay'], cols: ['Blow up either way', 'Blow up only if unpaid', 'Blow up only if paid', 'Release either way'],
                pay: [[[-10, -6], [-2, 4], [-10, -6], [-2, 4]], [[-8, -8], [-8, -8], [0, 0], [0, 0]]], unit: 'score, higher is better',
                explain: 'There are three. One has you paying because the hijacker plans to blow up the plane if unpaid. But if you don\'t pay, blowing up gives the hijacker minus 8 against 0 for releasing, so that threat is empty. Solving from the end keeps only the sensible answer: don\'t pay, and the plane is released.' },
              { t: 'summary', points: ['Test a threat at the moment it must be carried out: is it their best move then?', 'Empty threats and empty promises both cost the side that can\'t make them believable.', 'Plain Nash can rest on empty threats; solving the tree from the end removes them.'] }
            ]
          }
        ]
      },
      {
        title: 'Games that repeat',
        lessons: [
          {
            id: 'repeated-games', title: 'Meeting again: repeated games and collusion', minutes: 14, kind: 'Game',
            steps: [
              { t: 'read', title: 'The shadow of the future', body: [
                'In the cafés game, charging £2 was dominant. But real cafés set prices every day, and tomorrow\'s rival remembers what you did today.',
                'When a game repeats, a player can reward co-operation and punish undercutting. That changes the maths.'
              ] },
              { t: 'repeated', title: 'Eight days on one street', prompt: 'Set your price each day. The other café follows a fixed rule you\'ll see at the end.',
                rounds: 8, roundName: 'Day', moves: ['Charge £3', 'Charge £2'], short: ['£3', '£2'], ...CAFES, bot: 'tft' },
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
              { t: 'read', title: 'The hotel bar', body: [
                'The night before a tender, Suppliers A and B meet in a hotel bar and agree to quote 20 a unit instead of 15. The buyer needs 10 units, production costs nothing, equal quotes split the order 50:50, and the lower quote takes it all.',
                'Both quote 20: 100 each. Both quote 15: 75 each. One undercuts: 150 for the cheat, nothing for the other. It\'s a prisoner\'s dilemma, so in a one-off tender the deal collapses by morning.',
                'Now they meet every quarter, and nobody knows which tender will be the last. You\'re Supplier A. Supplier B follows a fixed rule, but not the café\'s rule.'
              ], figure: BAR },
              { t: 'repeated', title: 'Quarterly tenders', prompt: 'Quote each quarter. Supplier B follows a fixed rule you\'ll see at the end. The buyer could stop tendering any quarter, so don\'t count on knowing the last one.',
                rounds: 8, roundName: 'Q', moves: ['Quote 20', 'Quote 15'], short: ['20', '15'], ...BAR, bot: 'grim' },
              { t: 'choice', title: 'Is it worth cheating?', q: 'Supplier B played grim trigger: co-operate until you undercut once, then undercut for ever. You\'ve both quoted 20 for a year. Undercutting next quarter gets you 150 instead of 100, then 75 a quarter for ever. When is it worth it?',
                options: [
                  { text: 'When there\'s less than a 2-in-3 chance of meeting again each quarter', ok: true, why: 'Right. Cheating gains 50 once and loses 25 every quarter after. At a two-thirds chance of meeting again or more, the lost 25s outweigh the 50. Unlike tit-for-tat, grim trigger never forgives.' },
                  { text: 'Always: 150 is the biggest number', why: 'Only if there\'s no future. Every quarter after costs you 25.' },
                  { text: 'Never: you\'ll be punished', why: 'Punishment only bites if there\'s likely to be a future. On a known last tender, both cheat, and the deal unravels backwards from there.' }
                ] },
              { t: 'sort', title: 'Easier or harder to collude?', prompt: 'A price deal holds when today\'s gain from cheating is smaller than tomorrow\'s loss. That\'s easier when the deal is very profitable, cheating gains little, cheating is easy to spot, players meet often and there are few of them. Sort each.',
                buckets: ['Makes collusion easier', 'Makes it harder'],
                items: [
                  { text: 'Three suppliers instead of eight', bucket: 0, why: 'Fewer players means fewer people tempted to cheat. Buyers: add bidders.' },
                  { text: 'Tenders every month instead of every two years', bucket: 0, why: 'Frequent meetings mean punishment comes quickly. Buyers: tender less often, in bigger lots.' },
                  { text: 'Sealed bids nobody else sees', bucket: 1, why: 'Cheating is harder to spot, so it\'s more tempting. Buyers: keep bids sealed.' },
                  { text: 'Open rounds where every price is shown', bucket: 0, why: 'Every undercut is spotted at once and punished.' },
                  { text: 'One big contract worth undercutting for', bucket: 1, why: 'A large prize makes the one-off gain from cheating big. Buyers: make the prize worth fighting for.' },
                  { text: 'A long-term market-share split everyone accepts', bucket: 0, why: 'The agreement is profitable and easy to police.' }
                ] },
              { t: 'summary', points: ['Meeting again lets players punish cheating, so co-operation can survive.', 'It\'s stable when today\'s gain from cheating is smaller than tomorrow\'s loss; a known last round undoes it.', 'Fewer players, frequent meetings and visible prices help cartels; buyers should flip each one.'] }
            ]
          }
        ]
      }
    ],
    exam: {
      pass: 7,
      questions: [
        { q: 'A call centre pays agents a bonus for every call closed in under three minutes. What\'s the most likely side effect?', options: ['Customers get faster, better help', 'Agents rush or cut off difficult calls', 'Agents take longer breaks', 'Nothing changes'], answer: 1, why: 'People respond to what the rule rewards, not what you meant. The bonus pays for short calls, not solved problems.' },
        { q: 'A bakery (rows) and a coffee bar (columns) set opening hours. One cell reads (7, 3). What does the 3 mean?', options: ['The bakery\'s profit', 'The number of customers', 'The difference between them', 'The coffee bar\'s profit'], answer: 3, why: 'The row player\'s payoff comes first, the column player\'s second.' },
        { q: 'Two delivery firms each choose Premium or Budget. If your rival goes Premium you make 5 with Premium and 7 with Budget. If your rival goes Budget you make 1 with Premium and 3 with Budget. What should you do?', options: ['Premium, because it\'s better for the market', 'Copy the rival', 'Budget, whatever the rival does', 'It depends on the rival\'s choice'], answer: 2, why: 'Budget pays more in both cases (7 beats 5, 3 beats 1), so it\'s dominant. You don\'t need to guess.' },
        { q: 'Which statement about Nash equilibrium is true?', options: ['No player gains by changing their move on their own', 'It\'s always the best outcome for everyone', 'Every game has exactly one', 'Only one player is happy with it'], answer: 0, why: 'That\'s the definition. It can still be a poor outcome, and some games have several.' },
        { q: 'Everyone picks 0 to 100 and the winner is closest to half the average. You think everyone else reasons exactly one step. What do you pick?', options: ['50', '25', 'About 12', '0'], answer: 2, why: 'One-step thinkers assume an average of 50 and pick 25. Half of 25 is about 12. Zero is the theory, but it loses to this crowd.' },
        { q: 'A tennis player serves to the opponent\'s backhand on almost every point. What\'s the game-theory advice?', options: ['Keep doing it, it\'s their weak side', 'Mix serves unpredictably so the receiver can\'t lean one way', 'Always serve to the forehand instead', 'Serve harder'], answer: 1, why: 'Any fixed pattern can be exploited. When no plain move is stable, randomise.' },
        { q: 'A landlord chooses Renovate or Don\'t. Then the tenant chooses Renew or Leave. Renovate: Renew (8, 6), Leave (-2, 0). Don\'t: Renew (5, 3), Leave (1, 0). Payoffs are (landlord, tenant). What happens?', options: ['Don\'t renovate, tenant renews', 'Renovate, tenant leaves', 'Don\'t renovate, tenant leaves', 'Renovate, tenant renews'], answer: 3, why: 'The tenant renews in both branches (6 beats 0, 3 beats 0). Knowing that, the landlord compares 8 and 5 and renovates.' },
        { q: 'Three pirates share 100 bars. A tie passes, and a pirate votes yes only if he gets strictly more than by voting no. What does pirate 1 propose?', options: ['34 / 33 / 33', '99 / 0 / 1', '100 / 0 / 0', '50 / 50 / 0'], answer: 1, why: 'With two left, pirate 2 takes everything, so pirate 3 would get 0. One bar buys pirate 3\'s vote, and two votes out of three pass.' },
        { q: 'A supplier threatens to stop all deliveries unless you accept a 15% price rise. Stopping would cost it its biggest customer and £4m a year, and you can switch to another supplier in two weeks. How should you treat the threat?', options: ['As credible: suppliers always mean it', 'As credible, because it was put in writing', 'As probably empty: carrying it out hurts the supplier more than backing down', 'Accept the rise to be safe'], answer: 2, why: 'Test it at the moment of truth. If stopping is the supplier\'s worst option, it won\'t do it.' },
        { q: 'In which market is a price cartel most likely to hold?', options: ['Two sellers, weekly prices posted publicly', 'Many sellers, tenders every few years, sealed bids', 'Ten sellers, one big contract up for grabs', 'Any market, if the agreement is written down'], answer: 0, why: 'Few players, frequent meetings and easy detection make cheating unattractive. Written cartel agreements can\'t be enforced in court, so they don\'t help.' }
      ]
    }
  });
})();
