/* Course 5: From Facts to Game Plan. Built from training-library/courses/05-facts-to-game-plan.md */
(window.GAMBIT_COURSES = window.GAMBIT_COURSES || []).push({
  id: 'game-plan', order: 5, track: 'Negotiation', title: 'From Facts to Game Plan', piece: 'knight',
  price: 9.89,
  status: 'live', level: 'Intermediate', minutes: 116,
  summary: "Prepare and run a one-to-one negotiation step by step, from the fact sheet to the final offer, on one cinema-chain case.",
  outcomes: [
    'Prepare a one-to-one negotiation with five steps: Facts, Power, Plan, Play, Learn',
    'Score your levers on cost, credibility and impact, and sort every issue into must-haves, trades and nice-to-haves',
    'Draw a game plan with an opening menu, a package ladder, a switch point and an escalation trigger',
    'Run the day with clear roles and scripts, and keep a lessons-learned record that outlives the team'
  ],
  modules: [
    {
      title: 'Facts and power',
      lessons: [
        {
          id: 'why-negotiations-fail', title: 'Why one-to-one negotiations fail', minutes: 8, kind: 'Concept', preview: true,
          steps: [
            { t: 'read', title: 'Four ways it goes wrong', body: [
              "Most one-to-one negotiations that disappoint go wrong in one of four ways. The team didn't prepare enough. Levers were used badly: too early, too weakly, or not at all. Information leaked out of control. Or nobody agreed the target and the walk-away point before the meeting.",
              "Notice that three of the four happen before anyone sits down. The meeting is simply where you find out how well you prepared, and by then it is usually too late to fix it.",
              "This course gives you a method that fixes all four. It borrows from three toolkits you may have met already: bargaining theory finds your levers and tells you how strong they are, strategy puts them in order over time, and behavioural economics predicts how people will react."
            ] },
            { t: 'read', title: 'Five steps', body: [
              "<b>Facts:</b> targets, asks, the situation, the people involved and the history. <b>Power:</b> collect your levers and theirs, and judge each side's real bargaining power. This is the heart of the method.",
              "<b>Plan:</b> strategy, game plan and storyline, meaning which lever you use and when. <b>Play:</b> organise, rehearse and run the negotiation. <b>Learn:</b> capture what worked, and start building power for next time.",
              "The steps overlap and build on each other. For a significant negotiation, give yourself about <b>four weeks</b>. Most failures trace back to Facts or Power."
            ] },
            { t: 'sort', title: 'Where did it go wrong?', prompt: 'Each line comes from a negotiation that disappointed. Was the root cause in preparation or in execution?',
              buckets: ['Preparation (Facts or Power)', 'Execution (Plan or Play)'],
              items: [
                { text: 'Nobody knew the contract had a volume-discount clause', bucket: 0, why: 'A fact that was sitting in the old contract. Reading it is preparation.' },
                { text: 'The team opened with its biggest threat in the first five minutes', bucket: 1, why: 'The lever existed. Using it at the wrong moment is an execution failure.' },
                { text: "We didn't know how much of the supplier's revenue we were", bucket: 0, why: 'How important you are to them is a basic power fact.' },
                { text: 'Someone from product told the supplier we had no alternative', bucket: 1, why: 'Information leaked in the room. That is a Play problem: one voice, agreed lines.' },
                { text: 'We had no agreed walk-away point, so we argued among ourselves in the break', bucket: 0, why: 'The walk-away point should be signed off weeks before the day.' },
                { text: 'The final offer arrived after our deadline and we took it anyway', bucket: 1, why: 'The deadline was set; the team didn\'t stick to it on the day.' }
              ] },
            { t: 'choice', title: 'The heart of it', q: 'Which of the five steps decides what you can realistically achieve?',
              options: [
                { text: 'Facts', why: 'Facts feed it, but facts alone don\'t tell you what you can win.' },
                { text: 'Power: your levers and theirs', ok: true, why: 'Right. The balance of levers sets the range of deals you can reach. Everything after it is about using that power well.' },
                { text: 'Play', why: 'Good play gets you the most out of your power, but it can\'t create power you don\'t have.' },
                { text: 'Learn', why: 'Learning builds power for next time, not for this deal.' }
              ] },
            { t: 'summary', points: ['Most bad outcomes are settled before the meeting starts.', 'Five steps: Facts, Power, Plan, Play, Learn.', 'Power, meaning your levers and theirs, is the heart of the method.'] }
          ]
        },
        {
          id: 'get-the-facts', title: 'Get the facts straight', minutes: 14, kind: 'Case',
          steps: [
            { t: 'read', title: 'The four boxes', body: [
              "Start with a one-page fact sheet in four boxes. <b>Current situation:</b> the cost model, spend and scope, the contract (type, end date, price clauses) and ties to other business. <b>Market:</b> competitors, trends and the other side's alternatives.",
              "<b>History:</b> how the last negotiation went, what was agreed, and what was promised but not delivered. <b>Target:</b> your commercial and non-commercial goals, and your true fallback.",
              "Then profile the other side. Are you a big fish to them? What status do they hold with you? Who really decides? Estimate your <b>room to switch</b>: how much business you could move in 3, 6 and 12 months, and at what cost. That's your BATNA in numbers.",
              "Our case for the next few lessons: <b>Lumen Cinemas</b>, a mid-sized chain, sells most of its tickets through <b>Ticketra</b>, the market-leading ticketing platform. The platform fee is £40m a year and due to rise 5% a year. Lumen wants a freeze. Everything here is invented."
            ] },
            { t: 'sort', title: "Lumen's fact sheet, part 1", prompt: 'Drop each fact into the box where it belongs.',
              buckets: ['Current situation', 'Market', 'History'],
              items: [
                { text: "Lumen sells 22% of the country's cinema tickets", bucket: 0, why: 'Your own scale is part of today\'s situation, and it tells you how much you matter to Ticketra.' },
                { text: "Ticketra's fee rises 5% a year, linked to tickets sold, which keep growing", bucket: 0, why: 'A price clause in the current contract.' },
                { text: 'Ticketra is a preferred supplier and joint development partner', bucket: 0, why: 'Their status today. It is also something you could give or take away later.' },
                { text: 'Lumen decides which booking button its website, app and pre-show adverts point to', bucket: 0, why: 'A fact about today, and a lever in waiting.' },
                { text: '60% of cinema tickets in the country are bought online', bucket: 1, why: 'A market trend that shapes how much both sides need online booking.' },
                { text: "Ticketra handles 55% of online cinema ticket sales, so it leads but isn't a monopoly", bucket: 1, why: 'Competitors exist. That matters for your alternatives.' },
                { text: 'Switching platforms means rebuilding the booking site, the app and every box-office till', bucket: 1, why: 'Your alternatives exist but are expensive. Your room to switch is small and slow.' },
                { text: 'Two years ago a 1% annual rise was agreed, then reopened at the last minute and raised to 5%', bucket: 2, why: 'History. It tells you how Ticketra plays: deals can reopen late.' }
              ] },
            { t: 'sort', title: "Lumen's fact sheet, part 2", prompt: 'Keep what belongs in the target box. Bin the rest.',
              buckets: ['Target', 'Bin it'],
              items: [
                { text: 'Freeze the fee for three years', bucket: 0, why: 'Your goal, stated as a number and a term.' },
                { text: 'Walk-away point: +5% a year with annual upfront payment', bucket: 0, why: 'The worst deal you would still sign. Agree it internally; never say it out loud.' },
                { text: 'Prefer paying in arrears; accept annual upfront if needed', bucket: 0, why: 'A secondary goal, and a possible trade.' },
                { text: "Ticketra's account director supports the same football club as your finance director", bucket: 1, why: 'Nice for small talk. It changes nothing about power.' },
                { text: "Ticketra's office has a new coffee machine", bucket: 1, why: 'Noise. A fact sheet is one page; keep it for facts that move the deal.' },
                { text: 'Your last meeting with them ran 10 minutes over', bucket: 1, why: 'Not a fact that changes what either side can win.' }
              ] },
            { t: 'read', title: 'Your growth is their margin', body: [
              "A supplier earns 100 from you. Variable costs are 70, fixed overhead 20, profit 10: a <b>10% margin</b>. Now your volume grows 30%. Revenue is 130, variable costs 91, and overhead is still 20. Profit is 19: a <b>14.6% margin</b>, from your growth alone.",
              "Even if their overhead rises 10% to 22, profit is 17: a <b>13.1% margin</b>, still 3.1 points up. So you can fairly ask for a price cut that puts their margin back where it was: <b>5.1%</b> with flat overhead, or <b>3.4%</b> with the rise.",
              "And read the old contract. One new negotiation lead conceded a price rise to a fast-growing sole supplier, then found three weeks later that the previous contract had a price-cut-for-growth clause nobody remembered."
            ] },
            { t: 'slider', title: 'Fixed-cost growth calculator', prompt: 'Revenue starts at 100, variable costs at 70% of it and overhead at 20. Set the overhead rise to 10%, then find the price cut that brings the margin back to 10%.',
              inputs: [
                { id: 'g', label: 'Your volume growth', min: 0, max: 50, step: 5, value: 30, suffix: '%' },
                { id: 'o', label: 'Rise in their overhead', min: 0, max: 20, step: 5, value: 0, suffix: '%' },
                { id: 'c', label: 'Price cut you ask for', min: 0, max: 10, step: 0.1, value: 0, suffix: '%' }
              ],
              outputs: [
                { id: 'rev', label: 'Their revenue from you', expr: '100 * (1 + g / 100) * (1 - c / 100)', decimals: 1 },
                { id: 'profit', label: 'Their profit', expr: 'rev - 70 * (1 + g / 100) - 20 * (1 + o / 100)', decimals: 1 },
                { id: 'margin', label: 'Their margin (was 10%)', expr: 'profit / rev * 100', decimals: 1, suffix: '%' }
              ],
              goal: { expr: 'o >= 10 && margin >= 9.9 && margin <= 10.1', text: 'Overhead rise at 10% or more, margin back to 10%.' },
              explain: 'With 30% growth and a 10% overhead rise, a 3.4% price cut puts the margin back to 10%. Their margin is no worse than before, and you get the benefit of the volume you brought them.' },
            { t: 'choice', title: 'Read the calculator', q: 'Volume grows 30% and overhead stays at 20. What price cut keeps the supplier\'s margin at 10%?',
              options: [
                { text: '30%', why: 'That would wipe out far more than the gain from your growth.' },
                { text: 'About 5%', ok: true, why: 'Right. Costs are 91 + 20 = 111. At a 10% margin, revenue must be 111 / 0.9 = 123.3, which is 5.1% below 130.' },
                { text: 'About 1%', why: 'Too little. Their margin would still be well above 10%.' },
                { text: "None: growth doesn't change margins", why: 'It does. Fixed costs don\'t grow with volume, so each extra sale is more profitable.' }
              ] },
            { t: 'summary', points: ['Four boxes: current situation, market, history, target.', 'Room to switch and their mindset are facts too, so estimate them.', 'Your growth is their margin: turn it into a price argument.'] }
          ]
        },
        {
          id: 'carrots-and-sticks', title: 'Carrots, sticks and trades', minutes: 15, kind: 'Concept',
          steps: [
            { t: 'read', title: 'Carrots, sticks, and the trap', body: [
              "A <b>carrot</b> gives the other side something it values: preferred status, new business, a longer contract. A <b>stick</b> takes value away: exclusion from future business, a shorter contract. Both add to your power.",
              "The trap: when you're fighting their price rise, their agreeing to a smaller rise is <i>not</i> your carrot. That's what you're trying to win. A carrot is what <i>you</i> give in exchange.",
              "To find levers, ask: what would we do if they raised the price 20% tomorrow? How fast could we move the business? Where are the win-wins? What does the other side value most? Then check contract terms, status, cost benchmarks, room to switch, current business and new business."
            ] },
            { t: 'sort', title: "Lumen's levers: carrot or stick?", prompt: 'Sort each Lumen lever.',
              buckets: ['Carrot', 'Stick'],
              items: [
                { text: "A joint campaign promoting Ticketra's app in Lumen's foyers and pre-show adverts", bucket: 0, why: 'It grows Ticketra\'s business. Something you give.' },
                { text: 'A longer agreement', bucket: 0, why: 'Security of income is valuable to them.' },
                { text: "Paying the year's fee upfront instead of in arrears", bucket: 0, why: 'Cash early is worth something to Ticketra.' },
                { text: 'Pointing every Lumen booking button to Ticketra only', bucket: 0, why: 'More bookings through their platform.' },
                { text: "Removing Ticketra's preferred-supplier status", bucket: 1, why: 'Takes value away. Lumen\'s strongest believable stick.' },
                { text: "Pushing Lumen's own membership app for bookings instead", bucket: 1, why: 'Moves bookings away from Ticketra.' },
                { text: 'Moving all ticket sales to another platform', bucket: 1, why: 'A stick, but only a perceived one. Rebuilding the site, app and tills makes it hard to believe.' }
              ] },
            { t: 'read', title: 'The lever check', body: [
              "For each lever, ask: is it relevant? What does it cost you? How long does it take to work? How <b>credible</b> is it (1-5)? Can you show commitment? How much money is at stake for them, and what's the <b>impact</b> on them (1-5)?",
              "A quick score: impact x credibility - cost to you (£m). Lumen's four main levers: joint campaign, impact 4, credibility 5, cost £2m. Ticketra-only booking buttons, impact 3, credibility 5, cost £1m. Removing preferred status, impact 3, credibility 4, cost £0m. Moving all ticket sales elsewhere, impact 5, credibility 1, cost £8m.",
              "One rule: never open with a cheap-talk lever, meaning one you can't back up. If they call your bluff, you lose credibility on everything else."
            ] },
            { t: 'choice', title: 'Rank them', q: 'Using impact x credibility - cost, which Lumen lever scores highest?',
              options: [
                { text: 'The joint campaign', ok: true, why: 'Right: 4 x 5 - 2 = 18. Booking buttons score 14, removing status 12, moving everything -3.' },
                { text: 'Ticketra-only booking buttons', why: 'Close, but 3 x 5 - 1 = 14, behind the campaign\'s 18.' },
                { text: 'Removing preferred status', why: '3 x 4 - 0 = 12. Strong and free, but less impact than the campaign.' },
                { text: 'Moving all ticket sales elsewhere', why: 'It sounds the biggest, but 5 x 1 - 8 = -3. Nobody believes it.' }
              ] },
            { t: 'choice', title: 'Cheap talk', q: 'Which lever is cheap talk that Lumen should never open with?',
              options: [
                { text: 'Moving all ticket sales to another platform', ok: true, why: 'Right. Credibility 1: Ticketra knows the switching cost. That\'s perceived power, not actual power.' },
                { text: 'The joint campaign', why: 'Lumen can deliver it next month. Fully credible.' },
                { text: 'Removing preferred status', why: 'Cheap for Lumen to do and believable. A real stick, to be saved for later.' }
              ] },
            { t: 'sort', title: 'The four-box map', prompt: 'Asks are good for you and costly for them, like the fee freeze. Sort these other levers by who gains and who pays.',
              buckets: ['Win-win: use early', 'Trade: swap for an ask', 'Lose-lose: handle with care'],
              items: [
                { text: 'Sharing a 12-month attendance forecast', bucket: 0, why: 'Helps Ticketra plan capacity and costs Lumen nothing.' },
                { text: 'Fixing failed card payments together', bucket: 0, why: 'Both sides lose money on failed bookings.' },
                { text: 'The joint campaign', bucket: 1, why: 'Costs Lumen about £2m, worth about £6m to Ticketra. A trade to swap for the freeze.' },
                { text: 'Ticketra-only booking buttons', bucket: 1, why: 'Costs Lumen about £1m in direct bookings, worth about £4m to Ticketra.' },
                { text: 'Paying the fee upfront', bucket: 1, why: 'Costs Lumen about £1m, worth about £1m to Ticketra.' },
                { text: 'Moving all ticket sales to another platform', bucket: 2, why: 'Hurts Ticketra and hurts Lumen even more. Rarely credible.' },
                { text: 'Stopping online sales altogether', bucket: 2, why: 'Customers would walk. Nobody believes it.' }
              ] },
            { t: 'choice', title: 'When to play it', q: "Your strongest stick is removing Ticketra's preferred status. When should you use it?",
              options: [
                { text: "In the opening, to show you're serious", why: 'It hardens them and leaves you nothing to escalate to.' },
                { text: 'Only after cooperative offers have been rejected, as part of a planned change of tone', ok: true, why: 'Right. Open with carrots; keep sticks in your pocket until you need to change gear.' },
                { text: 'Never', why: "A stick you'd never use isn't a stick. Plan when." }
              ] },
            { t: 'summary', points: ['A carrot is what you give; a stick is what you take away.', 'Score levers on credibility and cost, not on how they sound.', 'Swap trades for asks, and hold the sticks back.'] }
          ]
        }
      ]
    },
    {
      title: 'Building the plan',
      lessons: [
        {
          id: 'must-haves-and-trades', title: 'Must-haves, trades and nice-to-haves', minutes: 10, kind: 'Game',
          steps: [
            { t: 'read', title: 'Three classes', body: [
              "Sort every issue into three classes. A <b>must-have</b> is a show-stopper: without it, no deal. A <b>trade</b> is something you'll give up in exchange for something else. A <b>nice-to-have</b> is good to get but can be given away cheaply.",
              "Do it for both sides: yours from what you know, theirs as your best estimate. Then start with the easy wins: their nice-to-haves that cost you little. They build momentum and goodwill.",
              "This is the grow-the-pie idea applied issue by issue. With dozens of issues, group them into clusters and use one score that values any offer instantly."
            ] },
            { t: 'slider', title: 'Four-issue trade builder', prompt: 'Four issues. Points out of 100 each side: you value payment terms 40, liability 10, KPIs 30, delivery 20. The supplier values them 10, 40, 15, 35. Set who wins each (0 = you, 1 = split, 2 = them). The supplier signs at 50 or more. Get the combined score to 145.',
              inputs: [
                { id: 'p', label: 'Payment terms (0 you, 1 split, 2 them)', min: 0, max: 2, step: 1, value: 1 },
                { id: 'l', label: 'Liability cap (0 you, 1 split, 2 them)', min: 0, max: 2, step: 1, value: 1 },
                { id: 'k', label: 'KPI regime (0 you, 1 split, 2 them)', min: 0, max: 2, step: 1, value: 1 },
                { id: 'd', label: 'Delivery time (0 you, 1 split, 2 them)', min: 0, max: 2, step: 1, value: 1 }
              ],
              outputs: [
                { id: 'you', label: 'Your points', expr: '20 * (2 - p) + 5 * (2 - l) + 15 * (2 - k) + 10 * (2 - d)' },
                { id: 'them', label: "Supplier's points", expr: '5 * p + 20 * l + 7.5 * k + 17.5 * d', decimals: 1 },
                { id: 'total', label: 'Combined', expr: 'you + them', decimals: 1 },
                { id: 'signs', label: 'Supplier signs? (1 yes, 0 no)', expr: 'them >= 50 ? 1 : 0' }
              ],
              goal: { expr: 'them >= 50 && total >= 145', text: 'Reach 145 combined with a deal the supplier signs.' },
              explain: 'Splitting everything gives 50 / 50, total 100. Taking everything gives you 100 and them 0, and they walk. You win payment terms and KPIs, they win liability and delivery: 70 / 75, total 145. Both sides beat the split.' },
            { t: 'choice', title: 'Why does the trade beat the split?', q: "Why is 70 / 75 possible when 'split everything' gives only 50 / 50?",
              options: [
                { text: 'The supplier was generous', why: 'It wasn\'t. It got 75, more than the split.' },
                { text: 'Each side wins the issues it cares about most, so the total grows', ok: true, why: 'Right. Different priorities mean value is created, not just divided.' },
                { text: 'Splitting is always unfair', why: 'Splitting is fair. It just leaves value on the table.' }
              ] },
            { t: 'sort', title: "Lumen's issues", prompt: 'Sort Lumen\'s issues with Ticketra.',
              buckets: ['Must-have for Lumen', 'Trade or nice-to-have'],
              items: [
                { text: 'Fee rise no higher than 5% a year', bucket: 0, why: 'That\'s the walk-away point. Above it, no deal.' },
                { text: 'Paying in arrears', bucket: 1, why: 'Preferred, but Lumen would give it up for a better fee.' },
                { text: 'A three-year term', bucket: 1, why: 'Worth something to both sides. A trade.' },
                { text: 'The joint campaign', bucket: 1, why: 'Costs Lumen 2, worth 6 to Ticketra. A classic trade.' },
                { text: 'Choice over where booking buttons point', bucket: 1, why: 'Lumen controls it and Ticketra values it. A trade.' },
                { text: 'A named Ticketra contact for disputes', bucket: 1, why: 'A nice-to-have. Ask for it early; it costs them little.' }
              ] },
            { t: 'summary', points: ['Classify every issue for both sides: must-have, trade, nice-to-have.', 'Trade what you value less for what you value more.', 'Open with their cheap nice-to-haves to build momentum.'] }
          ]
        },
        {
          id: 'five-questions', title: 'Five questions that set your strategy', minutes: 12, kind: 'Concept',
          steps: [
            { t: 'read', title: 'Five questions', body: [
              "Every one-to-one strategy comes down to five questions. <b>Make the first offer?</b> Usually yes: put your stick in the ground. <b>One offer or several?</b> One, above your best target with some asks you can give away, or a menu that lets them choose.",
              "<b>Allow counter-offers?</b> Yes, at a point you choose. <b>Tone?</b> Start cooperative, and switch to confrontational after your second offer is rejected, as a planned step, not a mood. <b>No agreement?</b> Escalate to management if your minimum is missed or in danger, on a trigger you set in advance.",
              "Set your opening ask by analysis, not preference, and above your maximum target. Order your levers on purpose: each offer worse for them than the last, or benefits first and consequences later. Unlike a Rules-First Tender, you don't reveal the whole process in advance."
            ] },
            { t: 'choice', title: 'Question 1: first offer', q: 'Should Lumen make the first offer?',
              options: [
                { text: 'Yes: Lumen opens', ok: true, why: 'Right. Lumen knows the value well, so it should set the anchor.' },
                { text: 'No: let Ticketra open', why: "You'd be arguing back from its 5%-a-year-plus-extras anchor." },
                { text: 'Wait and see who speaks first', why: 'Decide it in advance. Leaving it to chance usually means they open.' }
              ] },
            { t: 'choice', title: 'Question 2: how many offers', q: 'One offer or several?',
              options: [
                { text: 'A menu of three packages, all at or above Lumen\'s targets', ok: true, why: 'Right. A menu lets Ticketra reveal what it values, and every option is fine for Lumen.' },
                { text: 'One offer at the walk-away point', why: 'Then you have nothing left to give, and they will push past it.' },
                { text: 'As many as they ask for', why: 'Every new offer teaches them that asking pays.' }
              ] },
            { t: 'choice', title: 'Question 3: counter-offers', q: 'Should Lumen allow counter-offers?',
              options: [
                { text: 'Never', why: 'Too rigid. Counter-offers tell you what they value.' },
                { text: 'Yes, after the first menu has been answered', ok: true, why: 'Right. Counter-offers at a point you choose, not whenever they like.' },
                { text: 'Yes, at any time', why: 'Then they control the rhythm of the negotiation.' }
              ] },
            { t: 'choice', title: 'Question 4: tone', q: 'What tone should Lumen plan?',
              options: [
                { text: 'Tough from the start', why: 'It hardens them and leaves nowhere to escalate to.' },
                { text: 'Cooperative first, switching after the second offer is rejected', ok: true, why: 'Right. A planned switch is credible; an emotional one isn\'t.' },
                { text: 'Cooperative throughout, whatever happens', why: 'Then rejecting you costs them nothing.' }
              ] },
            { t: 'choice', title: 'Question 5: escalation', q: 'When should Lumen escalate to management?',
              options: [
                { text: "If Ticketra's offers stay above +5% a year", ok: true, why: 'Right. The trigger is the walk-away point, agreed in advance.' },
                { text: 'As soon as Ticketra says no to anything', why: 'Too early. Escalation is your last gear, not your first.' },
                { text: 'Only after the deal is signed', why: 'Too late to help.' }
              ] },
            { t: 'choice', title: 'The exception', q: 'When might you NOT make the first offer?',
              options: [
                { text: "When you're buying a brand-new technology you can't cost", ok: true, why: 'Right. If you know little about value, you risk anchoring yourself badly. Let them reveal first.' },
                { text: "When you're nervous", why: 'Nerves aren\'t a strategy. Prepare instead.' },
                { text: "When you've done this deal three times before", why: "That's exactly when you should open: you know the value." }
              ] },
            { t: 'summary', points: ['Five questions: first offer, how many, counter-offers, tone, escalation.', 'Decide every answer before the meeting.', 'Order your levers on purpose: benefits first, consequences later.'] }
          ]
        },
        {
          id: 'game-plan-tree', title: 'Drawing the game plan', minutes: 15, kind: 'Concept',
          steps: [
            { t: 'read', title: 'The tree', body: [
              "Drawing your plan as a tree forces 'what if?' thinking, gets your team agreed on concessions before you start, and makes deadlines and consequences clear. It's backward induction applied.",
              "The basic shape: a kick-off where you state the total ask and your first offer, and hint at levers. Their response: acceptable, not acceptable, or refusal. You regroup, then a follow-up round with the ask and clear consequences. Repeat, then escalate.",
              "At the kick-off, ask: is there a first-mover advantage? Are counter-offers allowed? One offer or several? Meeting, call or letter? Have we considered every option?"
            ] },
            { t: 'read', title: "The foam supplier's ladder", body: [
              "A furniture retailer meets its foam supplier at a supplier summit. Foam prices are up 18%. The retailer is about 15% of the supplier's turnover, most of its levers are weak, and punishing the supplier isn't an option. So it builds a ladder of packages.",
              "<b>Partner Plus:</b> 5% off next year's prices; the retailer adds consignment stock and supply-chain finance (paid early). <b>Partner:</b> 5% off plus consignment stock. <b>Standard:</b> 3% off plus lower minimum order quantities. <b>Basic:</b> a one-off 1% payment plus lower minimum orders at one warehouse. Below that: escalation to a management meeting.",
              "Each rung is worse for the supplier than the one before, so every rejection costs it something. That's the whole design: accepting early pays, and holding out to see what comes next never does."
            ] },
            { t: 'tree', title: 'Accept now or hold out?', prompt: 'The foam supplier can take Partner Plus now or hold out. Pick what each side does at every point, then check.', players: ['Retailer', 'Foam supplier'], unit: 'value to each side, points',
              root: { p: 1, options: [
                { label: 'Accept Partner Plus', pay: [10, 6] },
                { label: 'Hold out', next: { p: 0, options: [
                  { label: 'Offer Partner', next: { p: 1, options: [ { label: 'Accept Partner', pay: [8, 4] }, { label: 'Hold out again', pay: [3, 1] } ] } },
                  { label: 'Escalate now', pay: [3, 1] } ] } } ] },
              explain: 'Work back from the end. Offered Partner, the supplier takes it (4 beats 1). So the retailer offers Partner rather than escalating (8 beats 3). Knowing that, holding out gets the supplier only 4, while Partner Plus gets it 6. It accepts straight away. A falling ladder makes holding out a losing move.' },
            { t: 'choice', title: 'Why decreasing?', q: 'Why should each package be worse for the supplier than the last?',
              options: [
                { text: 'To punish them for rejecting', why: 'It isn\'t about punishment. It\'s about what makes accepting their best move.' },
                { text: 'So holding out never pays, and accepting early is their best move', ok: true, why: 'Right. If later offers were better, rejecting would be the smart play.' },
                { text: 'It looks tougher', why: 'Looks don\'t matter. The payoffs do.' }
              ] },
            { t: 'choice', title: 'Spot the broken ladder', q: 'A colleague drafts this ladder for the supplier. Which version breaks the rule?',
              options: [
                { text: 'Partner Plus 5% off with finance, Partner 5% off, Standard 3% off, Basic 1% one-off', why: 'This one works: each rung gives the supplier less support or asks more.' },
                { text: 'Partner 5% off with consignment stock, then Standard 3% off with consignment stock and supply-chain finance', ok: true, why: 'Right. Standard asks less and gives more than Partner, so rejecting Partner pays. Fix it before the day.' },
                { text: 'Any ladder with four rungs', why: 'The number of rungs doesn\'t matter. The order does.' }
              ] },
            { t: 'choice', title: 'Same or different?', q: 'Package A: 5% a year for 5 years. Package B: 5.5% for 3 years, then 4% for 2. Why offer both?',
              options: [
                { text: 'B is much better for the buyer', why: "They're nearly identical: 25% vs 24.5% in simple terms." },
                { text: 'Letting the supplier choose its preferred profile raises acceptance at little cost to you', ok: true, why: 'Right. Equivalent packages framed differently let them pick, and people like choosing.' },
                { text: 'To confuse them', why: 'Confusion breeds distrust. The point is choice.' }
              ] },
            { t: 'summary', points: ['Draw the tree before the meeting.', 'Ladders step down for the other side: choices first, consequences later.', 'Equivalent menus raise acceptance at little cost.'] }
          ]
        },
        {
          id: 'storyline-and-scripts', title: 'Storyline and scripts', minutes: 12, kind: 'Case',
          steps: [
            { t: 'read', title: 'Four parts', body: [
              "Every negotiation needs a storyline in four parts. <b>Focus points:</b> what's changed and why it matters. <b>Facts:</b> the evidence. <b>Requests:</b> what you need. <b>Next steps:</b> what happens now, and what happens if not.",
              "Script two moments word for word: the <b>opener</b>, which sets the tone and states the ask, and the <b>switch point</b>, your planned change of tone. Frame losses, not gains, and speak with one voice.",
              "Then line the story up with the calendar. A date that's already in the diary is far more credible than a threat made up on the day."
            ] },
            { t: 'sort', title: "Lumen's storyline", prompt: 'Which lines belong in Lumen\'s storyline, and which would hurt it?',
              buckets: ['Focus points or facts', 'Requests or next steps', 'Bin it'],
              items: [
                { text: 'The last two years brought sharp fee increases, and our new leadership is focused on cost.', bucket: 0, why: 'A focus point: what\'s changed and why it matters.' },
                { text: "We'd like to continue our partnership and we're willing to invest in it.", bucket: 0, why: 'States the intention behind the facts, and keeps the tone cooperative.' },
                { text: 'For that we need commercial room, and we have other options if you decline.', bucket: 1, why: 'The request, with a hint of a lever but no detail.' },
                { text: 'The level of partnership is your choice.', bucket: 1, why: 'The next step: it sets up the menu.' },
                { text: "We've been told to cut 10% from every supplier.", bucket: 2, why: 'Reveals your target. They\'ll aim just inside it.' },
                { text: "We can't switch, but we'd like a better price.", bucket: 2, why: 'Reveals your weakness. Never say it.' }
              ] },
            { t: 'choice', title: 'The opener', q: 'Which opening line should Lumen use?',
              options: [
                { text: 'Our budget for next year assumes the fee stays where it is. If that\'s not possible, we\'re still prepared to look at a more limited arrangement.', ok: true, why: 'Right. Firm on the freeze, tied to a budget decision, with a door left open.' },
                { text: 'We can live with up to 5% a year, but we\'d like less.', why: 'You just told them your walk-away point. They will take you to it.' },
                { text: 'Freeze the fee or we move every ticket to another platform.', why: 'An opening threat, and an incredible one. It hardens them and burns your credibility.' }
              ] },
            { t: 'read', title: 'The laundry contract', body: [
              "A hotel group's laundry tender drew almost no competition. The only challenger was about 40% dearer, so it couldn't be used to pressure the incumbent openly.",
              "So the group told the incumbent a clear story: we'd like to agree, we don't want transition costs, and there are win-wins as we move to new equipment in three years. But we have an internal reserve price. If there's no agreement by the 9th, a competitive tender starts on the 14th.",
              "The line that did the work: 'It's your choice whether the 14th is a debrief or a tender invitation.' The calendar became part of the story."
            ] },
            { t: 'sort', title: 'Put the laundry timeline in order', prompt: 'Which steps come before the final offer, and which after?',
              buckets: ['Before the final offer', 'After the final offer'],
              items: [
                { text: 'Internal sign-off of a hidden walk-away point', bucket: 0, why: 'First of all. You can\'t check an offer against a mandate you haven\'t agreed.' },
                { text: 'Tell the incumbent the timetable', bucket: 0, why: 'The dates must be known before they make their final offer.' },
                { text: 'Scope session to find win-wins', bucket: 0, why: 'Win-wins raise the offer, so they come first.' },
                { text: 'Debrief the challenger', bucket: 1, why: 'Only once you know whether you need it.' },
                { text: 'Competitive tender, only if needed', bucket: 1, why: 'The consequence, if the final offer misses the mandate.' }
              ] },
            { t: 'summary', points: ['Focus points, facts, requests, next steps.', 'Script the opener and the switch point word for word.', 'Make the calendar part of the story.'] }
          ]
        }
      ]
    },
    {
      title: 'Playing it out',
      lessons: [
        {
          id: 'ticketing-capstone', title: 'Capstone: the ticketing-platform negotiation', minutes: 20, kind: 'Case',
          steps: [
            { t: 'read', title: 'Your brief', body: [
              "You lead for <b>Lumen Cinemas</b>. The Ticketra fee is £40m a year and set to rise 5% a year. <b>Target:</b> a three-year freeze. <b>Walk-away point:</b> +5% a year with annual upfront payment. Lumen prefers paying in arrears. Ticketra doesn't know your walk-away point. Keep it that way.",
              "Three-year values, £m, cost to Lumen / value to Ticketra. <b>Fee rise</b> of 0%, 2% or 5% a year: 0, 4.9 or 12.4 to both. <b>Joint campaign:</b> 2 / 6. <b>Booking buttons</b> Ticketra only: 1 / 4; both: 0 / 2; Lumen's own app only: 0 / -3. <b>Annual upfront payment:</b> 1 / 1.",
              "No deal is expensive for both. Lumen's fallback, a migration to another platform, costs about <b>£20m</b> over the same three years. Ticketra would lose its second-biggest customer. Neither side wants that, which is why there's a deal to be found."
            ] },
            { t: 'read', title: 'The menu and three personalities', body: [
              "Open with a menu: 'the level of partnership is your choice'. <b>A, Full partnership:</b> 0%, in arrears, campaign, Ticketra-only buttons. Lumen 3, Ticketra 10. <b>B, Light partnership:</b> 2%, in arrears, no campaign, both buttons. Lumen 4.9, Ticketra 6.9. <b>C, Plain supply:</b> 5%, in arrears, no campaign, own app only. Lumen 12.4, Ticketra 9.4.",
              "A is best for both if Ticketra values the campaign. B makes A look generous. C is close to your walk-away point, with a sting. Your fallbacks: <b>Revised</b> (2%, arrears, campaign, both buttons: Lumen 6.9, Ticketra 12.9) and the <b>offer of last resort</b> (5%, annual, no campaign, own app only: Lumen 13.4, Ticketra 10.4).",
              "Ticketra can be a <b>Partner</b> (takes A; clue: excitement about growing ticket numbers), a <b>Tester</b> (rejects any first round, then behaves like a Partner) or a <b>Hard case</b> (needs a package worth at least 11). Score: gold at a cost of 4 or less, silver 7, bronze 13.4."
            ] },
            { t: 'dialogue', title: 'Round one: the tester', prompt: "Ticketra's account director is across the table. Open well, read the clue, and don't leak your walk-away point.", them: 'Ticketra', start: 'a',
              nodes: {
                a: { say: "Good to see you. Our renewal proposal is the usual 5% a year. What did you want to discuss?", options: [
                  { text: "We've put together three packages. The level of partnership is your choice.", next: 'b', score: 2, note: 'You opened first, with a menu that lets them show what they value.' },
                  { text: "What's the lowest rise you could live with?", next: 'anchor', score: 0, note: 'You let their 5% stand as the anchor and asked them to bid against nobody.' },
                  { text: "We can't accept anything above 5% a year.", next: 'leak', score: 0, note: 'That is your walk-away point, said out loud in the first minute.' } ] },
                b: { say: "We'll need to see your best offer before we can respond. None of these work for us as they stand.", options: [
                  { text: 'These are our offers. The campaign in Full partnership is available until Friday; after that the slot goes elsewhere.', next: 'd', score: 2, note: 'That was the tester\'s clue. You held the menu and put a deadline on your carrot.' },
                  { text: "Understood. Here's a better one: 2%, the campaign, and both booking buttons.", next: 'revised', score: 0, note: 'You rewarded a rejection. Revised costs 6.9 instead of 3.' },
                  { text: "Then we'll move all our ticket sales to another platform.", next: 'threat', score: 0, note: 'A cheap-talk stick, played far too early.' } ] },
                d: { say: "Friday is tight. Let me check with our side. Out of interest, what happens if we say no to all three?", options: [
                  { text: "Then we move to the next stage of our plan. I'd rather we didn't need to.", next: 'win', score: 2, note: 'Consequences hinted, nothing revealed.' },
                  { text: "Honestly, we'd probably still sign at 5%.", next: 'leak', score: 0, note: 'A probing question, and you answered it with your walk-away point.' } ] },
                win: { end: true, say: "We'll take Full partnership: the freeze, the campaign, and our button on your site.", result: "Deal on package A. Lumen's three-year cost: £3m. Gold.", verdict: 'good' },
                revised: { end: true, say: "That's more like it. We'll sign.", result: 'Deal at £6.9m, £3.9m more than needed. And Ticketra has learned that rejecting your first offer pays. Silver.', verdict: 'ok' },
                threat: { end: true, say: "Rebuilding your site, your app and every till? We'll see you at the renewal date.", result: 'They held at 5% a year and your credibility took a hit. You now have to climb back to the menu.', verdict: 'bad' },
                leak: { end: true, say: "Good to know. Then 5% it is, payable annually up front.", result: 'Walk-away point revealed, and they took you straight to it: £13.4m. Bronze at best.', verdict: 'bad' },
                anchor: { end: true, say: "Five percent a year, plus annual payment up front, plus your booking buttons.", result: 'You let them open. Now every move you make is measured from their anchor.', verdict: 'bad' }
              } },
            { t: 'slider', title: 'Build a package for the hard case', prompt: "A different Ticketra director says: 'Our board wants every major client on annual payment this year.' This one only signs at a value of 11 or more. Build a package that gets there at the lowest cost to Lumen.",
              inputs: [
                { id: 'r', label: 'Fee rise per year', min: 0, max: 5, step: 1, value: 5, suffix: '%' },
                { id: 'camp', label: 'Joint campaign (0 no, 1 yes)', min: 0, max: 1, step: 1, value: 0 },
                { id: 'btn', label: 'Booking buttons (0 Ticketra only, 1 both, 2 own app only)', min: 0, max: 2, step: 1, value: 2 },
                { id: 'ann', label: 'Annual upfront payment (0 no, 1 yes)', min: 0, max: 1, step: 1, value: 0 }
              ],
              outputs: [
                { id: 'fee', label: 'Three-year fee rise', expr: '40 * ((1 + r / 100) + Math.pow(1 + r / 100, 2) + Math.pow(1 + r / 100, 3) - 3)', decimals: 1, prefix: '£', suffix: 'm' },
                { id: 'cost', label: 'Cost to Lumen', expr: 'fee + 2 * camp + (btn == 0 ? 1 : 0) + ann', decimals: 1, prefix: '£', suffix: 'm' },
                { id: 'value', label: 'Value to Ticketra (needs 11)', expr: 'fee + 6 * camp + (btn == 0 ? 4 : (btn == 1 ? 2 : -3)) + ann', decimals: 1, prefix: '£', suffix: 'm' }
              ],
              goal: { expr: 'value >= 11 && cost <= 4', text: 'Value to Ticketra of 11 or more, at a cost to Lumen of £4m or less.' },
              explain: 'The freeze, the campaign, Ticketra-only buttons and annual payment: cost 4, value 11. Annual payment costs Lumen 1 and is worth 1 to Ticketra, exactly what lifts package A from 10 to 11. It beats Revised (cost 6.9) and leaves the fee untouched.' },
            { t: 'dialogue', title: 'Round two: the hard case', prompt: 'Now face the hard case. Use the clue, protect the fee, and keep your walk-away point to yourself.', them: 'Ticketra', start: 'a',
              nodes: {
                a: { say: "Thanks for the menu. Our board wants every major client on annual payment this year, and none of these packages get us there.", options: [
                  { text: "Then let's build around that: the freeze, the campaign, Ticketra-only buttons, and we'll pay annually up front.", next: 'b', score: 2, note: 'You read the clue. Annual payment costs you 1 and lifts their value from 10 to 11.' },
                  { text: "Fine. 2% a year, the campaign and both booking buttons.", next: 'revised', score: 1, note: 'It works: 12.9 for them. But it costs you 6.9, and you ignored what they asked for.' },
                  { text: "Then here's our final offer: 5%, annual payment, no campaign, own app only.", next: 'nodeal', score: 0, note: 'You jumped to the last resort. It is worth only 10.4 to them.' } ] },
                b: { say: "Annual payment helps. But is a freeze really your limit? Would +5% truly be unacceptable?", options: [
                  { text: 'This package is our offer, and the campaign slot is open until Friday. The level of partnership is your choice.', next: 'win', score: 2, note: 'You held the package and kept the deadline on the carrot.' },
                  { text: 'Well, +5% a year is our absolute limit.', next: 'leak', score: 0, note: 'A probing question, answered with your walk-away point.' } ] },
                win: { end: true, say: "Agreed: the freeze, the campaign, our button, annual payment.", result: "Deal at a three-year cost of £4m. Gold.", verdict: 'good' },
                revised: { end: true, say: "We can live with that.", result: 'Deal at £6.9m: inside your walk-away point, but £2.9m more than the package built around their clue. Silver.', verdict: 'ok' },
                nodeal: { end: true, say: "That's worth less to us than what we have today. We'll pass.", result: "No deal. Lumen falls back on its migration plan at about £20m. Walk-away point breached.", verdict: 'bad' },
                leak: { end: true, say: "Then let's settle at 5% a year with annual payment.", result: 'Deal at £13.4m, exactly your walk-away point. Revealing it cost you £9.4m. Bronze.', verdict: 'bad' }
              } },
            { t: 'choice', title: 'What did the hard case want?', q: 'Against the hard case, why did the freeze plus the campaign, Ticketra-only buttons and annual payment work?',
              options: [
                { text: 'Annual payment was worth 1 to Ticketra and cost Lumen only 1, so it closed the gap without touching the fee', ok: true, why: 'Right. The package moved from 10 to 11 for Ticketra for £1m, versus £3.9m extra for Revised.' },
                { text: 'Ticketra gave up', why: 'It got exactly what its board asked for.' },
                { text: 'Ticketra-only buttons are worth more than the fee', why: 'They are worth 4. The 5% fee rise is worth 12.4.' }
              ] },
            { t: 'choice', title: 'The tester', q: 'The tester rejected your menu straight away. Why was offering Revised a mistake?',
              options: [
                { text: 'It taught Ticketra that rejecting gets a better package, and cost Lumen 3.9 extra', ok: true, why: 'Right: 6.9 instead of 3. The clue said they would reject any first round.' },
                { text: 'Revised breaches the walk-away point', why: "It doesn't. It's just worse than you needed." },
                { text: "It wasn't; offering Revised is the textbook move", why: 'The right move depends on the response. Read the clue first.' }
              ] },
            { t: 'summary', points: ['A menu lets the other side reveal what it values.', 'Read the signals before you concede, and trade what\'s cheap for you.', 'Never reward a rejection by accident.'] }
          ]
        },
        {
          id: 'award-day', title: 'Award day and lessons learned', minutes: 10, kind: 'Concept',
          steps: [
            { t: 'read', title: "Who's in the room", body: [
              "Your team needs a <b>negotiation lead</b>, a <b>decision maker</b> (it can be the same person) and an <b>expert</b>. Three role labels help in the room: <b>the note-taker</b> tracks data and every offer, <b>the challenger</b> keeps pushing for a better result, and <b>the closer</b> steps in only near a deal, with small concessions.",
              "Prime each round: let the closer open a round you want to be cooperative, and the challenger one you want to be firm. Don't negotiate alone, but only bring people who add value. One person speaks per point.",
              "Before the day, set the escalation trigger and contact, book a team room for breaks, and look after your guests. Likeability pays, especially when you're locked in."
            ] },
            { t: 'sort', title: 'Challenger or closer?', prompt: 'Who does what?',
              buckets: ['The challenger', 'The closer'],
              items: [
                { text: 'Asks for one more improvement after each offer', bucket: 0, why: 'Always improving the result.' },
                { text: 'Offers a small concession to close', bucket: 1, why: 'The closer makes small moves near the end.' },
                { text: 'Opens the confrontational round', bucket: 0, why: 'The firm voice sets a firm tone.' },
                { text: 'Opens the cooperative round', bucket: 1, why: 'The friendly voice primes cooperation.' },
                { text: 'Suggests the final handshake terms', bucket: 1, why: 'That\'s closing.' },
                { text: 'Questions every number in their cost breakdown', bucket: 0, why: 'Pressure on the facts is the challenger\'s job.' }
              ] },
            { t: 'choice', title: 'Escalation', q: "Half-way through the day, Ticketra's offer is still at +6% a year. What does your plan say?",
              options: [
                { text: 'Improvise a new offer', why: 'Improvising is how concessions leak. Stick to the plan.' },
                { text: 'Follow the pre-agreed trigger: call a break and bring in the escalation contact', ok: true, why: 'Right. +6% is above the walk-away point, which is exactly what the trigger is for.' },
                { text: 'Accept to avoid conflict', why: 'That breaches your walk-away point.' }
              ] },
            { t: 'read', title: 'Four weeks', body: [
              "For a significant negotiation, run a four-week countdown. <b>Week 1:</b> facts and the fact sheet. <b>Week 2:</b> levers and the high-level strategy, then a first review.",
              "<b>Week 3:</b> game plan and storyline, then a second review. <b>Week 4:</b> a dry run with a stress test, and sign-off of the mandate and the walk-away point. Then award day. Then lessons learned.",
              "Commitment can pay later too. A food manufacturer that carried out its threat to claim damages from a packaging cartel lost that round, but deterred future collusion."
            ] },
            { t: 'sort', title: 'What goes in the record?', prompt: 'People move jobs. Which of these belong in your lessons-learned record?',
              buckets: ['Record it', 'Leave it out'],
              items: [
                { text: 'Who really made the decision on their side', bucket: 0, why: 'The next team needs to know who to work on.' },
                { text: 'Which levers worked and which fell flat', bucket: 0, why: 'That\'s next year\'s lever check, half done.' },
                { text: 'The personal incentives in play', bucket: 0, why: 'Targets and bonuses explain behaviour.' },
                { text: 'Any price clauses you agreed, and when they trigger', bucket: 0, why: 'Remember the forgotten volume clause.' },
                { text: "Their account director's home address", bucket: 1, why: 'Personal details have no place in the record.' },
                { text: 'Only the final price', bucket: 1, why: 'The price alone teaches the next team nothing about how you got there.' }
              ] },
            { t: 'read', title: 'Take the planner with you', body: [
              "Everything in this course fits into the <b>Gambit negotiation planner</b>: one tab per step, from the four-box fact sheet and room to switch, through the lever check and must-have, trade and nice-to-have lists, to the five questions, the package ladder, the storyline and award day.",
              "It ends with the lessons-learned record: what went well, what to improve, who really decided, which levers worked, which failed, and the incentives in play. That last tab is the one most teams skip, and the one the next team needs most.",
              "Start filling it in four weeks before your next real negotiation, review it with your team at the end of weeks two and three, and hand it to whoever runs the one after you."
            ] },
            { t: 'summary', points: ['Clear roles and a pre-agreed escalation trigger.', 'Prime each round with the right opener.', 'Write down what worked, so the next team starts stronger.'] }
          ]
        }
      ]
    }
  ],
  exam: { pass: 7, questions: [
    { q: 'Which step of the Gambit method is the heart of preparation?', options: ['Facts', 'Power: levers and bargaining power on both sides', 'Play', 'Learn'], answer: 1, why: 'Your levers and theirs decide what you can realistically achieve.' },
    { q: 'A supplier earns £50m a year from you: variable costs £30m, fixed overhead £15m, profit £5m. Your volume grows 20% at the same prices. Its new margin is about:', options: ['10%', '12.5%', '15%', '20%'], answer: 2, why: 'Revenue 60, variable 36, overhead 15, profit 9: 9 / 60 = 15%, up from 10%.' },
    { q: 'You\'re resisting a price rise. The supplier offers to raise prices by only 3% instead of 6%. Is that a carrot for you to use?', options: ["Yes, it's a concession", 'No: a carrot is something you give them in exchange for their concession', 'Yes, if you accept quickly', "Only if it's in writing"], answer: 1, why: "Their smaller increase is what you're negotiating for, not a lever you hold." },
    { q: 'Which lever belongs in the lose-lose box?', options: ['Sharing a volume forecast', 'Paying invoices earlier for a discount', "Threatening to switch everything to a supplier whose product you can't yet use", 'Extending the contract'], answer: 2, why: "It would hurt you as much as them, so it's rarely credible." },
    { q: 'On payment terms you value the win at 40 points and the supplier at 10. On liability, you value it at 10 and the supplier at 40. What\'s the best trade?', options: ['Split both issues down the middle', 'You win payment terms, they win liability', 'You win both', 'They win both'], answer: 1, why: '80 points in total instead of 50: each side takes what it values most.' },
    { q: 'When should the tone usually switch from cooperative to confrontational?', options: ['At the first sign of resistance', 'In the opening, to set expectations', 'As a planned step after the second offer is rejected', 'Never'], answer: 2, why: "A planned switch is credible; an emotional one isn't." },
    { q: 'Why should each rung of a package ladder be worse for the supplier than the one before?', options: ['So that holding out never pays', 'To show anger', 'Because suppliers prefer variety', "It doesn't matter"], answer: 0, why: 'If later offers are better, rejecting becomes the smart move.' },
    { q: 'Which sentence should NOT appear in your storyline?', options: ['"The level of partnership is your choice"', '"We\'d like to keep working with you and will invest in it"', '"Our absolute limit is a 4% increase"', '"Recent increases have been significant"'], answer: 2, why: 'Never reveal your walk-away point.' },
    { q: 'In a menu negotiation, the supplier rejects all three of your packages on day one with no reason given. What\'s usually wise?', options: ['Immediately offer a better package', 'Hold the menu, add a deadline to your carrot, and look for signals of what they value', 'Jump to your final offer', 'Walk away'], answer: 1, why: 'A quick concession teaches them that rejecting pays.' },
    { q: 'What should a lessons-learned record capture besides what went well?', options: ["The other side's personal details", 'Who really decided, which levers worked, and the incentives in play', 'Only the final price', 'Nothing: every negotiation is different'], answer: 1, why: "That's what the next team needs, especially after people move on." }
  ] }
});
