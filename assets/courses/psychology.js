/* Course 4: The Psychology of the Deal. Built from training-library/courses/04-psychology-of-the-deal.md */
(window.GAMBIT_COURSES = window.GAMBIT_COURSES || []).push({
  id: 'psychology', order: 4, track: 'Negotiation', title: 'The Psychology of the Deal', piece: 'king',
  price: 9.89,
  status: 'live', level: 'Beginner', minutes: 110,
  summary: "Behavioural economics at the table: fairness, risk, framing, anchors and decoys, and how to use and resist them in a real haggle.",
  outcomes: [
    "Recognise fairness, risk attitude, endowment, framing, anchoring and decoys in your own reactions and the other side's",
    "Reframe an ask as a loss to avoid, and choose an opening anchor you can defend",
    "Build a menu with a decoy that makes your preferred option the obvious choice",
    "Pick the right tactic for each stage of a negotiation, and close without leaving the other side feeling beaten"
  ],
  modules: [
    {
      title: 'How real people decide',
      lessons: [
        {
          id: 'fast-and-slow', title: 'Fast and slow thinking at the table', minutes: 8, kind: 'Concept', preview: true,
          steps: [
            { t: 'read', title: 'Where the textbook ends', body: [
              "Game theory assumes every player is perfectly rational. <b>Behavioural economics</b> studies where real people predictably depart from that: how psychological, social and emotional factors shape the choices they make.",
              "There are three drivers. <b>Social</b>: fairness and reputation. <b>Cognitive</b>: mental shortcuts and biases. <b>Emotional</b>: pride, fear and excitement. All three are in the room at every negotiation, on both sides of the table.",
              "One rule from practice runs through this course: <b>the weaker your bargaining position, the more the behavioural tools matter.</b> When you lack competition and alternatives, the way you present things is much of the power you've got."
            ] },
            { t: 'choice', title: 'Quick one', q: "A bat and a ball cost £1.10 together. The bat costs £1 more than the ball. How much is the ball? Answer as fast as you can.",
              options: [
                { text: '10p', why: "That's the fast answer, and it's wrong. If the ball were 10p, the bat would be £1.10 and the total £1.20." },
                { text: '5p', ok: true, why: "Right. The bat is £1.05 and the ball 5p, which makes £1.10. Most people's first instinct says 10p (Frederick, 2005)." },
                { text: '1p', why: "Then the bat would be £1.01 and the total £1.02, not £1.10." },
                { text: '55p', why: "Then the bat would be £1.55 and the total £2.10." }
              ] },
            { t: 'read', title: 'Two systems', body: [
              "Daniel Kahneman (2011, <i>Thinking, Fast and Slow</i>) describes two modes of thinking. <b>System 1</b> is automatic, intuitive, fast and effortless. It gave you 10p. <b>System 2</b> is deliberate, slow and effortful. It checks the sum and finds 5p.",
              "Negotiation pressure pushes you into System 1. Deadlines, a tense room and a counterpart who wants an answer now all make the quick, intuitive reply feel right. The other side often knows this and uses it.",
              "So: wait, wait, wait. Don't rush to close, don't show you're eager or short of time, and take your time over decisions. Let them be the one who makes the System 1 mistake."
            ] },
            { t: 'choice', title: 'Under pressure', q: "The supplier says: 'This price is only valid until 5pm today.' What's the System 2 response?",
              options: [
                { text: 'Accept before it expires', why: "That's exactly what the deadline is for. It wants a System 1 yes." },
                { text: 'Ask for time, check the offer against your walk-away point, and test whether the deadline is real', ok: true, why: "Right. Slow the decision down and check the facts. Many deadlines quietly move when tested." },
                { text: 'Reject it to show strength', why: "Also a fast reaction. Think first, then decide." }
              ] },
            { t: 'summary', points: [
              "Real people depart from rational models in predictable ways.",
              "The weaker your position, the more these effects are your toolkit.",
              "Slow down: pressure is designed to keep you in fast mode."
            ] }
          ]
        },
        {
          id: 'ultimatum-game', title: 'Fair and square: the ultimatum game', minutes: 12, kind: 'Game',
          steps: [
            { t: 'read', title: 'Six coins', body: [
              "Remember the pirates' treasure in Course 1? Pure logic said the junior pirates would accept a single coin. Would real people? The <b>ultimatum game</b> tests exactly that.",
              "There are 6 coins to split. Player 1 offers either a <b>fair</b> split (3 each) or an <b>unfair</b> one (5 for Player 1, 1 for Player 2). Player 2 then accepts, or rejects so that both get nothing."
            ] },
            { t: 'tree', title: 'What does logic predict?', prompt: 'Pick what each player does at every point, assuming both only care about coins. Then check.',
              players: ['Player 1', 'Player 2'], unit: 'coins',
              root: { p: 0, options: [
                { label: 'Offer fair (3/3)', next: { p: 1, options: [ { label: 'Accept', pay: [3, 3] }, { label: 'Reject', pay: [0, 0] } ] } },
                { label: 'Offer unfair (5/1)', next: { p: 1, options: [ { label: 'Accept', pay: [5, 1] }, { label: 'Reject', pay: [0, 0] } ] } }
              ] },
              explain: "Work backwards. Player 2 is better off accepting either offer, because 1 coin beats 0 and 3 beats 0. Knowing that, Player 1 offers the unfair split and keeps 5. That's the textbook answer. Now see what real people do." },
            { t: 'choice', title: 'You\'re Player 2', q: "Player 1 offers you 1 coin and keeps 5. In experiments, what do many real responders do?",
              options: [
                { text: 'Always accept, as the theory says', why: "Some do, but far from all. Low offers are rejected surprisingly often." },
                { text: 'Reject it, giving up the coin to punish the unfair split', ok: true, why: "Right. Since Güth, Schmittberger and Schwarze (1982), study after study finds responders often reject low offers. People will pay to enforce fairness." },
                { text: 'Ask for a re-run', why: "The rules don't allow it, and the point is what people do with one shot." }
              ] },
            { t: 'slider', title: 'Five responders, one offer', prompt: "Now you're Player 1 in a £100 version. Five people will each see the same offer and accept only if it meets their hidden fairness line. Drag your offer to earn the most in total.",
              inputs: [ { id: 'offer', label: 'Your offer to each responder', min: 0, max: 100, step: 5, value: 10, prefix: '£' } ],
              outputs: [
                { id: 'yes', label: 'Responders who accept (out of 5)', expr: '(offer >= 10) + (offer >= 30) + (offer >= 35) + (offer >= 40) + (offer >= 55)' },
                { id: 'earned', label: 'Your total earnings', expr: 'yes * (100 - offer)', prefix: '£' }
              ],
              goal: { expr: 'earned >= 240', text: 'Find the offer that earns you £240.' },
              explain: "The hidden lines were £10, £30, £35, £40 and £55. Offering £10 gets one yes and £90. Offering £40 gets four yeses and £240, the best you can do. Offers well below a third of the pot are often rejected: nothing is better than too little." },
            { t: 'choice', title: 'Why offer more?', q: "Theory says offer £10. Why did an offer of £40 earn more against the five responders?",
              options: [
                { text: 'The responders were irrational', why: "They had a preference for fairness. That's a payoff too, just not one measured in pounds." },
                { text: 'Low offers got rejected often enough that their expected value was lower', ok: true, why: "Right. A fairer offer wins more often, and that more than pays for the bigger share you give away." },
                { text: 'Bigger offers are always better', why: "£55 wins all five but earns only £225. You need enough, not the most." }
              ] },
            { t: 'read', title: 'Fairness at the table', body: [
              "A supplier who feels cheated will sometimes reject a deal that's still profitable for it. Or it accepts and claws the value back later, through slow service, surprise extras or a hard renegotiation.",
              "So make the process feel fair as well as the price. Be transparent, keep your commitments and explain your numbers. People accept a tough outcome far more readily when they understand how it was reached."
            ] },
            { t: 'summary', points: [
              "People reject offers they see as unfair, even when it costs them.",
              "Your best offer accounts for that, so it's rarely the textbook minimum.",
              "A process that feels fair makes deals stick."
            ] }
          ]
        },
        {
          id: 'risk-attitude', title: 'Feeling lucky? Risk attitude', minutes: 10, kind: 'Game',
          steps: [
            { t: 'choice', title: 'Pick one', q: "You're offered £5,000 for certain, or a coin toss for £10,000 or nothing. What's the coin toss worth on average?",
              options: [
                { text: '£5,000, exactly the same as the sure thing', ok: true, why: "Right. Half of £10,000 plus half of nothing is £5,000. Same expected value, yet most people strongly prefer one or the other. That preference is your risk attitude." },
                { text: '£10,000', why: "That's the best case. Half the time you get nothing." },
                { text: 'Less than £5,000, because it\'s risky', why: "Risk changes how much you like it, not its average. The average is £5,000." }
              ] },
            { t: 'read', title: 'Three attitudes', body: [
              "If you'd take the sure £5,000, and even a bit less, you're <b>risk-averse</b>. If you'd toss the coin even against a guaranteed amount above £5,000, you're <b>risk-seeking</b>. If you genuinely don't mind which, you're <b>risk-neutral</b>.",
              "Your <b>certainty equivalent</b> is the guaranteed amount that makes you indifferent to the gamble. If it's £3,500, you'd give up £1,500 to avoid the risk. That £1,500 is your <b>risk premium</b>."
            ] },
            { t: 'slider', title: 'Your certainty equivalent', prompt: "What's the lowest guaranteed amount you'd take instead of each coin toss? Set both honestly: £10,000 or nothing, then £100,000 or nothing.",
              inputs: [
                { id: 'ce', label: 'Sure amount instead of a toss for £10,000', min: 0, max: 10000, step: 250, value: 5000, prefix: '£' },
                { id: 'ce10', label: 'Sure amount instead of a toss for £100,000', min: 0, max: 100000, step: 2500, value: 50000, prefix: '£' }
              ],
              outputs: [
                { id: 'prem', label: 'Your risk premium, small stakes', expr: '5000 - ce', prefix: '£' },
                { id: 'share', label: 'Premium as a share of the average, small stakes', expr: '(5000 - ce) / 50', suffix: '%' },
                { id: 'share10', label: 'Premium as a share of the average, stakes x 10', expr: '(50000 - ce10) / 500', suffix: '%' }
              ],
              explain: "A positive premium means you're risk-averse, zero means neutral, and negative means risk-seeking. For most people the premium grows as a share when the stakes go up ten times. Binswanger (1980) found the same with farmers in India playing for real money: risk aversion rises with the stakes." },
            { t: 'read', title: 'Suppliers hate risk too', body: [
              "Suppliers are often risk-averse, so they add a premium for uncertainty to their price, as in the currency example in Course 3. Remove the uncertainty and that premium can come out of the price.",
              "The flip side is a strong carrot. Committing to a longer contract or a fixed share of volume is valuable to a supplier precisely because it removes risk. You can also steer choices under uncertainty with credits and charges (Course 7). Course 9 shows what risk aversion does to auctions."
            ] },
            { t: 'choice', title: 'The supplier\'s premium', q: "A supplier faces a raw material whose price could swing 30% either way. What's the cheapest way for you to get a lower price?",
              options: [
                { text: 'Demand a 10% cut', why: "It'll price the risk back in somewhere, in the spec, the terms or the next renewal." },
                { text: 'Share or remove the risk, for example with an index clause, and ask for the risk premium back', ok: true, why: "Right. Take the uncertainty off the table and the premium has no reason to stay in the price." },
                { text: 'Switch suppliers', why: "The next one faces the same raw-material risk and will price it the same way." }
              ] },
            { t: 'summary', points: [
              "Same expected value, different choices: that's risk attitude.",
              "Risk-averse people pay to avoid uncertainty, and more so when the stakes rise.",
              "Reduce the other side's risk and you can take the premium."
            ] }
          ]
        },
        {
          id: 'endowment', title: 'Mine is worth more: endowment and status quo', minutes: 10, kind: 'Concept',
          steps: [
            { t: 'read', title: 'The mug experiment', body: [
              "Give half a room a mug. Ask the owners the lowest price they'd sell it for, and ask everyone else the most they'd pay. Kahneman, Knetsch and Thaler (1990) ran exactly this. Sellers asked roughly <b>twice</b> what buyers offered.",
              "Owning something, even for a few minutes, makes it feel more valuable. That's the <b>endowment effect</b> (a term Thaler coined in 1980). In negotiation, the incumbent supplier 'owns' your business and values it more than an outsider would."
            ] },
            { t: 'choice', title: 'Owner or buyer?', q: "You've just been handed a branded notebook. A colleague without one is asked what they'd pay for it. What does the research predict?",
              options: [
                { text: 'You\'ll both put the same value on it', why: "That's the rational answer, but owners consistently ask more." },
                { text: 'You\'ll ask for about twice what they offer', ok: true, why: "Right. Owning it makes giving it up feel like a loss, and losses loom larger than equal gains." },
                { text: 'They\'ll offer more, because they want it', why: "The pattern runs the other way: owners value it above buyers." }
              ] },
            { t: 'read', title: 'The status quo is the reference point', body: [
              "Every gain and loss is measured against what someone already has. Try two ways of saying the same thing to an incumbent supplier.",
              "\"If you don't improve your price, you won't receive the 50% additional business.\" Their reaction: nothing to lose, so why move? \"If you don't improve your price, 50% of your current business will go to other suppliers.\" Their reaction: alarm.",
              "The consequence is identical in your spreadsheet and very different in theirs. The second line threatens what they already own. To understand your supplier, know its status quo, and aim your levers at it."
            ] },
            { t: 'choice', title: 'Which line moves the incumbent?', q: "You want a 5% price cut from your sole supplier. Which line is most likely to work?",
              options: [
                { text: 'Cut 5% and we\'ll consider giving you some of our new projects', why: "A possible gain. They lose nothing by ignoring it." },
                { text: 'Cut 5% or we\'ll move half of your current volume to the challenger we\'ve qualified', ok: true, why: "Right. It's a loss of what they already have, and it's backed by a real alternative." },
                { text: 'We\'d really appreciate a 5% cut', why: "Polite, but it gives them no reason to move." }
              ] },
            { t: 'choice', title: 'Your own endowment', q: "Why do buyers often overrate their incumbent supplier?",
              options: [
                { text: 'Incumbents are always better', why: "Sometimes they are, but you can't know without testing the market." },
                { text: 'The relationship feels like something you own, so switching feels like a loss', ok: true, why: "Right. The endowment effect works on buyers too. Check whether you're protecting a supplier or a habit." },
                { text: 'Switching is always impossible', why: "Rarely true. Course 3 shows how to build an alternative." }
              ] },
            { t: 'summary', points: [
              "Owners value what they own above its market value.",
              "Frame your lever as a loss of their status quo, not a missed gain.",
              "Watch for the same bias in yourself when you defend an incumbent."
            ] }
          ]
        }
      ]
    },
    {
      title: 'Steering the choice',
      lessons: [
        {
          id: 'framing', title: 'Same facts, different choice: framing', minutes: 14, kind: 'Concept',
          steps: [
            { t: 'read', title: 'Frame one', body: [
              "An outbreak threatens 600 people. You must choose a response. <b>Programme A</b> saves 200 people for certain. <b>Programme B</b> has a 1/3 chance of saving all 600 and a 2/3 chance of saving nobody.",
              "Before you go on, decide which one you'd choose, and keep it in mind. This is the disease problem from Tversky and Kahneman (1981)."
            ] },
            { t: 'read', title: 'Frame two', body: [
              "Same outbreak, same 600 people, two new options. With <b>Programme C</b>, 400 people die for certain. With <b>Programme D</b>, there's a 1/3 chance nobody dies and a 2/3 chance all 600 die.",
              "Again, decide which one you'd choose before you go on."
            ] },
            { t: 'choice', title: 'Look again', q: "How do Programmes A and C compare?",
              options: [
                { text: 'A is better: it saves people', why: "Read C again. If 400 of 600 die, 200 are saved. It's the same outcome." },
                { text: 'They\'re identical: 200 saved, 400 die', ok: true, why: "Right. And B and D are identical too: each saves 600 x 1/3 = 200 on average. Only the words changed." },
                { text: 'C is better: it\'s more honest', why: "Both describe exactly the same result, just from opposite ends." }
              ] },
            { t: 'read', title: 'You\'ve just been framed', body: [
              "In the original study, 72% picked the sure thing, A, in the gain frame. In the loss frame, 78% picked the gamble, D. If you switched between the two frames, you're in good company.",
              "The pattern is reliable: people are <b>risk-averse when choices are framed as gains</b> and <b>risk-seeking when framed as losses</b>. Losses loom larger than gains of the same size."
            ] },
            { t: 'read', title: 'Framing at the table', body: [
              "<b>Loss aversion</b>: \"We've already paid you £Xm for this claim\" lands softer than \"this claim has cost our business £Xm\". \"We'll go to market\" is weaker than \"you'll lose your exclusive position\".",
              "<b>Ordering</b>: show basic £X, standard £XX and full £XXX, and the middle feels moderate. <b>Time</b>: \"£Xm in year one\" feels bigger than \"£Xm, spread over three years\". Everyday life is full of it: half full or half empty, second-hand or pre-loved, contribution or tax.",
              "The bid-sheet rule: spell out what happens if they reject, frame rejecting as the supplier taking a gamble, and encourage them not to gamble."
            ] },
            { t: 'sort', title: 'Gain or loss frame?', prompt: 'Sort each line a buyer might use with a supplier.', buckets: ['Gain frame', 'Loss frame'],
              items: [
                { text: 'Accept and you\'ll keep your preferred-supplier status', bucket: 1, why: "The subtle one. It's about keeping what they already have, so it's a loss frame." },
                { text: 'Accept and you could win new projects next year', bucket: 0, why: "A possible extra. Nothing they hold is at stake." },
                { text: 'Reject and you\'ll lose your exclusive position on this part', bucket: 1, why: "Losing something they own: a loss frame." },
                { text: 'This offer gives you a 2% improvement', bucket: 0, why: "Framed as something they gain." },
                { text: 'Rejecting means betting your whole share on a tender you might lose', bucket: 1, why: "It makes rejecting feel like a risky loss, exactly what the bid-sheet rule asks for." }
              ] },
            { t: 'choice', title: 'Rewrite the bid sheet', q: "Your draft says: 'Please send us your best price by Friday.' Which rewrite follows the bid-sheet rule best?",
              options: [
                { text: 'Please send us your very best price by Friday. We value our partnership.', why: "Friendlier, but there's still no consequence and no loss frame." },
                { text: 'If we don\'t receive a price within our target by Friday, we\'ll award the volume elsewhere. You\'d be gambling your current share on the outcome. We\'d rather you didn\'t take that risk.', ok: true, why: "Right. It has a consequence, a loss frame, a deadline and an invitation to avoid the gamble." },
                { text: 'Send your best price by Friday or you\'re out.', why: "It has a consequence and a deadline, but it reads as a threat rather than a risk they can avoid." }
              ] },
            { t: 'summary', points: [
              "Gains make people cautious; losses make them gamble.",
              "Frame your ask as avoiding a loss for them.",
              "Frame rejection as a gamble they'd be wise not to take."
            ] }
          ]
        },
        {
          id: 'anchoring', title: 'Who speaks first: anchoring', minutes: 14, kind: 'Game',
          steps: [
            { t: 'read', title: 'The rigged wheel', body: [
              "Tversky and Kahneman (1974) spun a wheel of fortune in front of people. It was rigged to stop at either 10 or 65. Then they asked people to estimate the percentage of African countries in the United Nations.",
              "Everyone could see the wheel's number was random. It still moved their answers."
            ] },
            { t: 'choice', title: 'What happened?', q: "One group saw the wheel stop at 10, the other at 65. What were the typical (median) estimates?",
              options: [
                { text: 'The same in both groups: people ignored a random number', why: "That's what should happen. It isn't what did." },
                { text: '25% after seeing 10, and 45% after seeing 65', ok: true, why: "Right. A number everyone knew was meaningless pulled the estimates by 20 points. That's anchoring." },
                { text: '10% and 65%: people copied the wheel', why: "The anchor pulled, but people still adjusted away from it, just not far enough." }
              ] },
            { t: 'read', title: 'Anchors everywhere', body: [
              "A wine list with a £150 bottle at the top makes the £35 bottle feel sensible, even if it cost the restaurant £7. \"Regular price £60\" leaves you cold; \"regular price £120, now £60\" feels like free money.",
              "In a dispute, a £450m settlement looks far more reasonable next to £600m than next to £300m. And focal points, from Course 3, are anchoring at work in one-to-one deals."
            ] },
            { t: 'choice', title: 'Which settlement offer?', q: "You need the other side to accept £450m. Which framing helps most?",
              options: [
                { text: 'Open with £300m and concede up', why: "£450m will then look like a big jump from £300m." },
                { text: 'Show it next to the £600m their own lawyers estimated', ok: true, why: "Right. Against £600m, £450m looks like a concession." },
                { text: 'Say nothing about other numbers', why: "Then they'll supply the anchor." }
              ] },
            { t: 'read', title: 'Set an anchor, resist one', body: [
              "<b>To anchor:</b> speak first when you know enough. Make the number look realistic and back it: \"Our team has costed this at £X. What can you offer?\" Good sources are a clean-sheet cost model, last year's price, input-price trends, benchmarks and savings targets.",
              "<b>To defend:</b> name the anchor for what it is, go back to your own facts, and don't argue the details of their number, because arguing keeps it in the room. Beware the classic: \"You pay £300 today. Skip the tender and we'll drop it to £250.\" The real cost may be nearer £150."
            ] },
            { t: 'sort', title: 'The filter order', prompt: "You're buying coffee-machine filters for your café chain from the incumbent. Last year's price was £2 a filter. You'll make the first offer. Which make good anchors?", buckets: ['Useful anchor', 'Weak or risky'],
              items: [
                { text: 'A clean-sheet cost model', bucket: 0, why: "Built from the real cost of materials and making them. Hard to dismiss." },
                { text: 'Last year\'s £2, adjusted for falling input costs', bucket: 0, why: "Their own history, moved by a trend they can check." },
                { text: 'Your company\'s 8% savings target', bucket: 0, why: "Useful as a justified target, as long as you can explain where it comes from." },
                { text: 'A competitor\'s price for a different, cheaper filter', bucket: 1, why: "Easy to dismiss as not comparable." },
                { text: 'A random round number that feels low', bucket: 1, why: "It can't be defended, and round numbers signal room to move." },
                { text: 'Market prices from three distributors', bucket: 0, why: "Independent evidence of what the market charges." }
              ] },
            { t: 'choice', title: 'They anchor first', q: "The supplier opens: 'Industry standard is £3.20 a filter.' What's your best response?",
              options: [
                { text: 'Counter at £2.80, close to their anchor', why: "You've let their number set the range." },
                { text: 'Set the £3.20 aside and present your own cost-based number with its logic', ok: true, why: "Right. Replace their anchor rather than debating it." },
                { text: 'Ask them to justify £3.20 line by line', why: "This keeps their anchor at the centre of the conversation." }
              ] },
            { t: 'summary', points: [
              "First numbers pull every estimate after them, even random ones.",
              "Anchor first, with a number you can defend.",
              "When they anchor, don't debate it: replace it."
            ] }
          ]
        },
        {
          id: 'decoys', title: 'The option nobody picks: decoys and menus', minutes: 14, kind: 'Concept',
          steps: [
            { t: 'read', title: 'Two options, then three', body: [
              "Dan Ariely (2008) showed students a weekly magazine's subscription menu: digital only at $59, or print plus digital at $125. Most chose digital: 68% against 32%.",
              "Then he added a third option: <b>print only at $125</b>, the same price as print plus digital. Nobody would rationally choose it. Think about what it might do to the other two before you go on."
            ] },
            { t: 'choice', title: 'Three options', q: "With 'print only at $125' on the menu, nobody chose it. What happened to the other two?",
              options: [
                { text: 'Nothing: an option nobody picks can\'t matter', why: "That's the rational view. The students didn't behave that way." },
                { text: 'Print plus digital jumped to 84%, and digital fell to 16%', ok: true, why: "Right. The useless option made print plus digital look like a bargain: everything print only gives you, plus digital, for nothing extra." },
                { text: 'Digital rose, because the menu looked expensive', why: "The shift went the other way, towards the dearer option." }
              ] },
            { t: 'read', title: 'How a decoy works, and target lines', body: [
              "The decoy is <b>clearly worse than one option</b> (print plus digital) but not easy to compare with the other (digital). It gives your target option something to beat.",
              "Buyers can use the same idea. A hotel group is re-tendering its laundry contract in three regional baskets. It asks the incumbent to re-quote basket 1 against three target lines. <b>Line 1</b> at £6.6m: win basket 1 and compete for basket 2 later. <b>Line 2</b> at £6.3m: all that, plus a direct place in the final round for basket 2. <b>Line 3</b> at £6.0m: all that, plus the final round for baskets 2 and 3.",
              "Missing line 1 rules the supplier out of basket 2. Lines 2 and 3 make line 1 look like the easy, safe yes."
            ] },
            { t: 'choice', title: 'Spot the decoy', q: "A supplier offers: Standard service £40k; Premium £55k; Premium with 24/7 support £55k. Which option is the decoy, and what's it for?",
              options: [
                { text: 'Standard: it makes Premium look expensive', why: "Standard is a genuine, cheaper choice. It isn't dominated by anything." },
                { text: 'Premium without 24/7: it makes Premium with 24/7 look like a free upgrade', ok: true, why: "Right. It's the same price for less, so nobody picks it, but it pushes people to the 24/7 option." },
                { text: 'There\'s no decoy', why: "Look at the two £55k options. One is strictly worse than the other." }
              ] },
            { t: 'read', title: 'Productivity options', body: [
              "A food manufacturer agrees a 3-year packaging contract and asks the supplier to pick one yearly price-reduction path. <b>Option 1</b>: 5% a year. <b>Option 2</b>: 7.5% in year 1, 7.5% in year 2, nothing in year 3. <b>Option 3</b>: 14% in year 1, nothing after.",
              "Start the price index at 100. After three years: Option 1 ends at 85.7, Option 2 at 85.6, Option 3 at 86.0. They look almost the same.",
              "But the money saved over the three years is very different: Option 1 saves 5 + 9.75 + 14.26 = 29.0 index points, Option 2 saves 7.5 + 14.4 + 14.4 = 36.4, and Option 3 saves 14 x 3 = 42.0. Front-loading favours the buyer; deferral favours the supplier."
            ] },
            { t: 'slider', title: 'The productivity calculator', prompt: "Set the yearly price cuts and a discount rate. Try Option 1 (5, 5, 5), then Option 3 (14, 0, 0). Then find a path that ends at about the same price but saves you much more.",
              inputs: [
                { id: 'y1', label: 'Cut in year 1', min: 0, max: 15, step: 0.5, value: 5, suffix: '%' },
                { id: 'y2', label: 'Cut in year 2', min: 0, max: 15, step: 0.5, value: 5, suffix: '%' },
                { id: 'y3', label: 'Cut in year 3', min: 0, max: 15, step: 0.5, value: 5, suffix: '%' },
                { id: 'r', label: 'Discount rate', min: 0, max: 15, step: 1, value: 5, suffix: '%' }
              ],
              outputs: [
                { id: 'i1', label: 'Price index, year 1', expr: '100 * (1 - y1 / 100)', decimals: 1 },
                { id: 'i2', label: 'Price index, year 2', expr: 'i1 * (1 - y2 / 100)', decimals: 1 },
                { id: 'i3', label: 'Price index, year 3', expr: 'i2 * (1 - y3 / 100)', decimals: 1 },
                { id: 'saved', label: 'Total saved over 3 years (index points)', expr: '300 - i1 - i2 - i3', decimals: 1 },
                { id: 'pv', label: 'Saved in today\'s money', expr: '(100 - i1) / (1 + r / 100) + (100 - i2) / Math.pow(1 + r / 100, 2) + (100 - i3) / Math.pow(1 + r / 100, 3)', decimals: 1 }
              ],
              goal: { expr: 'i3 >= 85.5 && saved >= 40', text: 'End at an index of 85.5 or higher, but save at least 40 points.' },
              explain: "The earlier the cut, the more years you enjoy it. A path like 14, 0, 0 ends at almost the same price as 5, 5, 5 but saves 42 points instead of 29. Raise the discount rate and the gap widens further, because money saved sooner is worth more today (Course 7 covers this)." },
            { t: 'choice', title: 'Which will the supplier prefer?', q: "Offered all three productivity options, which one is the supplier most likely to choose, and why is that fine for you?",
              options: [
                { text: 'Option 3, because it\'s simplest', why: "It's the one that costs the supplier most. They'll avoid it." },
                { text: 'Option 1: next to the front-loaded options it looks like the gentle choice, and you\'ve built a menu where every answer is acceptable to you', ok: true, why: "Right. The front-loaded options act as decoys that make Option 1 the easy yes, and rejecting all three rules them out of basket 2." },
                { text: 'None: suppliers reject menus', why: "A menu gives them a sense of choice and control, which makes a yes more likely, not less." }
              ] },
            { t: 'summary', points: [
              "An option nobody picks can change what everybody picks.",
              "A good decoy is clearly worse than your target and hard to compare with the rest.",
              "Front-loaded savings are worth more to you; make the option you can live with look like the easy yes."
            ] }
          ]
        }
      ]
    },
    {
      title: 'At the table',
      lessons: [
        {
          id: 'tactics-toolkit', title: 'The tactics toolkit', minutes: 14, kind: 'Concept',
          steps: [
            { t: 'read', title: 'Four families', body: [
              "There are hundreds of negotiation tactics. They fall into four families, roughly in the order you'd use them. <b>1. Foster a co-operative discussion</b>, early on. <b>2. Steer emotions</b>, throughout. <b>3. Move them to your position</b>, once it turns into haggling. <b>4. Change the game</b>, late, when you need to reset the terms.",
              "Most come from a handful of published authors, credited as we go. Everything here is paraphrased: read the originals if a technique works for you."
            ] },
            { t: 'read', title: 'Open the talks well', body: [
              "<b>Build trust.</b> Listen actively, don't attack, show you understand. Attend to people's core concerns: appreciation, affiliation, autonomy, status and role (after Fisher and Shapiro, 2005). <b>Grow the pie.</b> Look for complementary differences: form vs substance, now vs later, precedent vs one-off gain, prestige vs results, high vs low risk (after Fisher and Ury, 1981).",
              "<b>Use objective criteria</b> as focal points: explain why your standard is fair and invite theirs. <b>Name their objections first</b>: open your request with the reasons they'll think it's unfair, which Voss (2016) calls an accusation audit. <b>Mirror</b>: repeat their last few words as a question, and they'll explain more. Ask questions that invite a 'no', such as \"Would it be a bad idea to...?\""
            ] },
            { t: 'read', title: 'Haggle and change the game', body: [
              "<b>Precise numbers.</b> Round numbers signal room to move; £87.32 or 8.3% signals a calculated limit. Mason and co-authors (2013) found precise first offers anchor more strongly. Add framing and decoys from the last two lessons, and <b>nudging</b>: make your preferred outcome the default, so they must actively opt out (Thaler and Sunstein, 2008).",
              "<b>Easy wins</b>: add a few giveaways, nice-to-haves you present as important, so you have something to concede. <b>Limited authority</b>: your senior sets a tight walk-away point you genuinely can't go beyond, which shrinks the ZOPA towards your target (a cousin of commitment, Course 2).",
              "<b>Take a break</b> after forced concessions or when emotions run high. <b>Introduce a deadline</b>, so they feel the coming loss of control, but only one you'll keep."
            ] },
            { t: 'sort', title: 'Early or late?', prompt: 'When would you use each tactic?', buckets: ['Opening the talks', 'Haggling and closing'],
              items: [
                { text: 'Mirroring their last three words', bucket: 0, why: "A listening tactic that gets them talking and explaining." },
                { text: 'A precise counter-offer of £87.32', bucket: 1, why: "Precise numbers belong to the haggle, where they signal a calculated limit." },
                { text: 'Asking what fair standard they\'d use', bucket: 0, why: "Agreeing objective criteria early builds a fair frame for everything after." },
                { text: 'Bringing in your director\'s hard limit', bucket: 1, why: "Limited authority changes the game late, when you need to hold a line." },
                { text: 'Listing their objections before your first request', bucket: 0, why: "It draws the sting before the talks get going." },
                { text: 'Dropping a nice-to-have in exchange for their concession', bucket: 1, why: "Giveaways are currency for the haggle." }
              ] },
            { t: 'choice', title: 'Pick the tactic', q: "The supplier has just made two big concessions and looks rattled. You're tempted to push for a third. What's wisest?",
              options: [
                { text: 'Push now while they\'re weak', why: "A rattled counterpart may harden, or agree and claw it back later." },
                { text: 'Call a short break, regroup, and come back with your next ask framed calmly', ok: true, why: "Right. A break resets the balance and keeps the relationship intact." },
                { text: 'Concede something big to be nice', why: "Kindness is good; giving away value you don't need to is not." }
              ] },
            { t: 'read', title: 'Likeable, honest, in control', body: [
              "Being likeable creates value. Given the same ZOPA, people concede more to someone they like. A known tough guy gets no extra concessions, while someone with an easy-going reputation can switch gear to great effect.",
              "A stance worth adopting: compete <i>and</i> collaborate; business and people go together; empathy, not harshness; never lie, though you can stay silent; think about their alternatives as well as yours; be proactive. And propose the agenda yourself: you set the atmosphere, the order of topics and how time is used."
            ] },
            { t: 'choice', title: 'Who sets the agenda?', q: "What's the best way to start a negotiation meeting?",
              options: [
                { text: 'Ask them to propose the agenda: information is key', why: "You learn a little and give away control." },
                { text: 'Propose the agenda yourself', ok: true, why: "Right. You control the order, the atmosphere and the timing." },
                { text: 'Agree one together from scratch', why: "Collaborative, but you lose the sequencing." }
              ] },
            { t: 'choice', title: 'Bluff?', q: "They ask: 'Is there any other supplier who can do this?' You have none yet. What's consistent with 'never lie'?",
              options: [
                { text: 'Say yes, three are lined up', why: "A lie that can be discovered destroys your credibility." },
                { text: 'Say you\'re reviewing all options and won\'t discuss them', ok: true, why: "Right. It's true, and it keeps your BATNA private." },
                { text: 'Admit you have none', why: "True, but it gives away strategic information for nothing." }
              ] },
            { t: 'summary', points: [
              "Build trust and grow the pie early; haggle and change the game late.",
              "Listen, label and mirror; anchor with precise, defensible numbers.",
              "Be likeable and never lie: silence is not a lie."
            ] }
          ]
        },
        {
          id: 'anatomy-of-a-haggle', title: 'Anatomy of a haggle', minutes: 14, kind: 'Case',
          steps: [
            { t: 'read', title: 'The yard', body: [
              "An original scene, written for Gambit. Maya, 19, has come to settle her late father's affairs with Hollis, who runs a used-equipment yard. Her father bought a generator from Hollis for $200 and left it in the yard to collect.",
              "It was stolen from there, along with his tool chest, worth $100. Maya has also had to hire a van to come out, for $25. Hollis would rather pay nothing. You'll play Maya: pick her lines, and watch which ideas from this course each one uses."
            ] },
            { t: 'dialogue', title: 'You\'re Maya', prompt: 'Get what your father was owed, and leave Hollis able to shake your hand.', them: 'Hollis', start: 'a',
              nodes: {
                a: { say: "You're his daughter? Sorry about your dad. So, what can I do for you?", options: [
                  { text: "My father paid you $200 for that generator. His tool chest was worth $100. The van here cost me $25. That's $325. You can keep his old trailer, too. I won't be needing it.", next: 'b', score: 2, note: "Anchoring with a precise, itemised number, plus a decoy: the trailer sounds like a gift but is worth nothing to him." },
                  { text: "Dad lost some things here. What do you think would be fair?", next: 'gesture', score: 0, note: "You've handed him the anchor." } ] },
                b: { say: "The theft wasn't my doing. Thieves don't ask permission.", options: [
                  { text: "It was in your yard, behind your gate. You were responsible for it until he collected it.", next: 'c', score: 2, note: "Information: she's done her homework on who carried the risk." },
                  { text: "I suppose that's true, but it still feels unfair.", next: 'gesture', score: 0, note: "You've conceded the key fact he was testing." } ] },
                c: { say: "You're a kid. Go home and let a grown-up deal with this.", options: [
                  { text: "If we can't agree, my father's lawyer, Mr Reyes, will take it to the small-claims court. He's handled cases against this yard before.", next: 'd', score: 2, note: "BATNA: she ignores the personal attack and shows a credible alternative." },
                  { text: "I'm 19, and I'm perfectly capable of this!", next: 'gesture', score: 0, note: "He attacked the person and you defended the person. The claim didn't move." } ] },
                d: { say: "Courts take months. I'll give you $250, and the trailer goes with you. Or $225 and I keep it.", options: [
                  { text: "I'll take the trailer. $300, and that's the end of it. Otherwise I'm calling Mr Reyes this afternoon.", next: 'e', score: 2, note: "Commitment: a take-it-or-leave-it offer with a deadline she'll keep. His two offers showed being rid of the trailer is worth only $25 to him." },
                  { text: "$250 with the trailer. Fine.", next: 'quick', score: 0, note: "You took his first real offer, when your alternative was stronger than his." } ] },
                e: { say: "I don't have $300 in cash today. End of the month.", options: [
                  { text: "Then it's $320. $20 now, the rest by the 30th. Waiting costs me, so it costs you.", next: 'f', score: 2, note: "Future discounting: money later is worth less, so the delay has a price." },
                  { text: "OK, the end of the month is fine.", next: 'late', score: 1, note: "You gave the delay away for free." } ] },
                f: { say: "You drive a hard bargain.", options: [
                  { text: "I learned from my father.", next: 'win', score: 2, note: "Framing: she turns a jab into a compliment and lets him keep his pride." },
                  { text: "And you tried to short-change a grieving family.", next: 'sour', score: 0, note: "True or not, rubbing it in invites him to claw value back." } ] },
                win: { end: true, say: "Ha. He'd be proud. $20 now, the rest by the 30th.", result: "$320 and the trailer. Hollis is grumbling, but not humiliated: he feels he's survived it.", verdict: 'good' },
                sour: { end: true, say: "Then maybe the rest takes a bit longer than the 30th.", result: "You won the number but lost the goodwill. Expect the money late.", verdict: 'ok' },
                late: { end: true, say: "Good. End of the month, then.", result: "$300 a month from now: worth less than $300 today, and the delay cost him nothing.", verdict: 'ok' },
                quick: { end: true, say: "Done. Pleasure doing business.", result: "$250. His own offers showed he expected to pay more.", verdict: 'bad' },
                gesture: { end: true, say: "Tell you what. $150 as a gesture, and that's generous.", result: "You never set the terms, so he did: $150.", verdict: 'bad' }
              } },
            { t: 'read', title: 'What the scene shows', body: [
              "Hollis was unprepared about his legal position; Maya was prepared. The trailer was a decoy: Hollis pays roughly the same with or without it, but haggling over it showed his hand. His commitment was weak (\"courts take months\"); hers was set in stone.",
              "The split is unequal, and she adds value at the end by trading time for money. The arithmetic: $200 + $100 + $25 = $325 opening; his $250 or $225; her $300 take-it-or-leave-it; $320 with $20 upfront when he asks to pay later."
            ] },
            { t: 'choice', title: 'The trailer', q: "Why did Maya give up the trailer so easily?",
              options: [
                { text: 'She felt sorry for Hollis', why: "Nothing in the scene suggests sympathy drove it. It was a calculated move." },
                { text: 'His two offers showed that being rid of the trailer was worth only $25 to him. Taking it costs her nothing, and she still asks $50 more than his best offer', ok: true, why: "Right. She concedes what's cheap for her and keeps pressing on the number that matters." },
                { text: 'She\'d forgotten about it', why: "She raised it herself in her opening line." }
              ] },
            { t: 'choice', title: 'Why $320?', q: "Hollis agreed to $300 but wanted to pay later. Why was Maya right to ask for $320?",
              options: [
                { text: 'To punish him', why: "Punishment isn't the point, and it risks the deal." },
                { text: 'Money later is worth less to her, and the delay is a concession he should pay for', ok: true, why: "Right. Time has a price. Charging for it turns his request into extra value for her." },
                { text: 'Round numbers are bad', why: "Precise numbers help when anchoring, but this is about the cost of waiting." }
              ] },
            { t: 'choice', title: 'The closing mood', q: "When you agree a deal, how would you prefer your counterpart to feel?",
              options: [
                { text: 'Very happy: it\'s a win-win', why: "Then you may have left value on the table." },
                { text: 'Happy but a little puzzled, still weighing their wins and losses', ok: true, why: "Right. Feel good, but not too good. If they sense how big your win was, they'll claw it back later." },
                { text: 'Sad: you got the best out of them', why: "Expect them to claw it back." }
              ] },
            { t: 'read', title: 'Same haggle, different room', body: [
              "Organisations and countries differ on a few things worth checking before you sit down. How directly people say what they mean. Hierarchy: who actually decides, and who's just in the room. Commitment: is a handshake final, or a starting point?",
              "And time: how fast decisions are made, and how much effort spent changes willingness to concede. Your solution won't always work in a different culture. Ask, observe and adapt, and don't rely on stereotypes."
            ] },
            { t: 'choice', title: 'Different room', q: "You're meeting a new counterpart for the first time. Their senior person hardly speaks, while a junior colleague does all the talking. What's the safest move?",
              options: [
                { text: 'Address the junior, who\'s clearly leading', why: "They may not be the decision-maker." },
                { text: 'Find out before the next meeting who decides and how approval works', ok: true, why: "Right. Check how decisions are made rather than guessing from who talks most." },
                { text: 'Assume it\'s a national habit and carry on', why: "Ask, don't stereotype." }
              ] },
            { t: 'summary', points: [
              "A good haggle chains anchor, information, alternative, commitment and framing.",
              "Concede what's cheap for you, and charge for time.",
              "Close with them feeling fine, not beaten, and adapt your playbook to the room."
            ] }
          ]
        }
      ]
    }
  ],
  exam: { pass: 7, questions: [
    { q: "Your weakest negotiations are the ones where behavioural tools matter most. Why?",
      options: ['Weak positions involve more emotional people', 'With little competition or alternatives, presentation is much of the power you have', 'Biases only affect weak negotiators', 'They don\'t; it\'s the reverse'],
      answer: 1, why: "When structure gives you little, framing, anchoring and fairness carry more weight." },
    { q: "In a £100 ultimatum game, you propose. Theory says offer £1. What's usually the best-earning offer against real people?",
      options: ['£1', '£10', 'Around £35-45', '£90'],
      answer: 2, why: "Low offers are often rejected, so a fairer offer has the higher expected value." },
    { q: "You'd swap a coin toss for £20,000 or nothing for a guaranteed £7,000. You are:",
      options: ['risk-seeking', 'risk-neutral', 'risk-averse', 'irrational'],
      answer: 2, why: "The gamble's expected value is £10,000; you'd give up £3,000 to avoid the risk." },
    { q: "Which line best uses the incumbent's status quo?",
      options: ['"You could win our new site\'s volume"', '"A third of your current volume will move to the challenger if we can\'t agree"', '"We\'d value a gesture"', '"Prices in the market are falling"'],
      answer: 1, why: "Threatening what they already own triggers loss aversion." },
    { q: "A supplier must choose: a sure loss of 3% margin, or a 50% chance of losing 6% and a 50% chance of losing nothing. What do Tversky and Kahneman's findings predict most will do?",
      options: ['Take the sure 3% loss', 'Gamble', 'Refuse both', 'Be indifferent'],
      answer: 1, why: "Framed as losses, people tend to take the risk." },
    { q: "The other side opens with an extreme number. What's the best defence?",
      options: ['Meet them halfway', 'Argue every line of their number', 'Put your own well-reasoned number on the table and work from that', 'Walk out'],
      answer: 2, why: "Debating their anchor keeps it in the room. Replace it." },
    { q: "A gym offers: off-peak £20, full access £35, full access without the pool £35. The third option is there to:",
      options: ['attract swimmers', 'make full access look like the obvious choice', 'reduce choice', 'increase off-peak sales'],
      answer: 1, why: "It's dominated by full access at the same price: a decoy." },
    { q: "Several productivity menus all end at roughly 14% lower prices after three years. Which is worth most to the buyer?",
      options: ['5% a year, every year', '14% in year one, nothing after', 'Nothing in years one and two, 14% in year three', 'They\'re all worth the same'],
      answer: 1, why: "Front-loaded savings are enjoyed for longer and are worth more today." },
    { q: "Repeating the last few words your counterpart said, as a question, is called:",
      options: ['anchoring', 'mirroring', 'framing', 'nudging'],
      answer: 1, why: "A listening tactic, popularised by Voss (2016), that gets people to explain more." },
    { q: "You've just closed a deal well above your target. What should you let the other side see?",
      options: ['Your delight: it builds rapport', 'A calm, slightly reluctant satisfaction', 'Disappointment, so they feel they won', 'Your internal target, to prove they did well'],
      answer: 1, why: "Feel good, but not too good: if they sense your win, they'll try to claw it back." }
  ] }
});
