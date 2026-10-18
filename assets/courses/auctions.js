/* Course 8: Auctions Decoded. Built from training-library/courses/08-auctions-decoded.md */
(window.GAMBIT_COURSES = window.GAMBIT_COURSES || []).push({
  id: "auctions", order: 8, track: "Auctions", title: "Auctions Decoded", piece: "bishop",
  price: 9.89,
  status: "live", level: "Beginner", minutes: 114,
  summary: "The four auction formats, how to bid in each, why they often tie, and how to dodge the winner's curse, learned by bidding.",
  outcomes: [
    "Tell the four standard auction formats apart, in selling and buying versions",
    "Bid your true cost in a second-price auction and shade sensibly in a first-price one",
    "Explain why formats often tie and why one more bidder matters more than the format",
    "Spot a common-value auction and pick a format that tames the winner's curse"
  ],
  modules: [
    {
      title: "The four formats",
      lessons: [
        {
          id: "four-formats", title: "Four formats in one grid", minutes: 10, kind: "Concept", preview: true,
          steps: [
            { t: "read", title: "Same painting, four rule books", body: [
              "Picture one painting, three bidders and four different rule books. Before anyone raises a hand, the rules have already shaped who wins and what they pay.",
              "An auction is a game whose rules are announced before anyone bids, and the best offer wins. That's what sets it apart from an open-ended haggle.",
              "Two questions sort almost every format. <b>Can you see the other bids?</b> Open means you watch a price move; sealed means one hidden offer each. <b>What does the winner pay?</b> Its own bid, or roughly the runner-up's."
            ] },
            { t: "sort", title: "Open or sealed?", prompt: "Can the bidders see what the others are doing?",
              buckets: ["Open", "Sealed"],
              items: [
                { text: "Price ticks down on a screen until a supplier accepts", bucket: 0, why: "Everyone watches the price move." },
                { text: "Each supplier emails one PDF offer by Friday noon", bucket: 1, why: "One hidden offer each, opened together." },
                { text: "Bidders raise paddles as the auctioneer calls higher prices", bucket: 0, why: "You can see who's still in." },
                { text: "Highest envelope wins and pays the second-highest envelope", bucket: 1, why: "Envelopes are sealed until the end." },
                { text: "A flower clock falls until a buyer presses the button", bucket: 0, why: "The clock is public: everyone sees it fall." }
              ] },
            { t: "sort", title: "Pay your bid, or pay the runner-up?", prompt: "What does the winner end up paying (or getting paid)?",
              buckets: ["Winner pays its own bid", "Winner pays about the runner-up's price"],
              items: [
                { text: "Dutch: a falling clock, first to press wins", bucket: 0, why: "You pay the price on the clock when you pressed." },
                { text: "English: a rising price, last bidder left wins", bucket: 1, why: "The price stops where the last rival quit, so the runner-up sets it." },
                { text: "First-price sealed bid", bucket: 0, why: "You pay what you wrote in the envelope." },
                { text: "Second-price sealed bid (Vickrey)", bucket: 1, why: "You win with your envelope but pay the next one down." },
                { text: "Reverse English ticker for a supply contract", bucket: 1, why: "You win at the price where the second-to-last supplier dropped out." }
              ] },
            { t: "read", title: "Twins, and flipping it for buying", body: [
              "Put the answers together and you get a grid of four. <b>English</b> (open, pay about the runner-up) behaves like <b>second-price sealed</b>: in both, the winner pays what it took to beat the runner-up. <b>Dutch</b> (open, pay your bid) behaves like <b>first-price sealed</b>: in both, you pick a number blind and pay it. The twins hold when each bidder's value is its own; Lesson 7 shows where they break.",
              "In a <b>reverse auction</b> a buyer buys and suppliers compete on price. Reverse English: the price falls, suppliers drop out, the last one standing wins at that price. Reverse Dutch: the price rises from low until the first supplier accepts. Sealed versions: lowest bid wins, paid its own bid or the second-lowest."
            ] },
            { t: "choice", title: "Name the format", q: "A buyer runs a ticker where the price falls by £1 a step. Suppliers click to stay in. It ends when only one supplier remains. Which format is this?",
              options: [
                { text: "Reverse English", ok: true, why: "Right. Falling price, and the last supplier standing wins at that price." },
                { text: "Reverse Dutch", why: "Reverse Dutch starts low and rises until the first supplier accepts." },
                { text: "First-price sealed bid", why: "Nothing is sealed here: everyone sees the price move." },
                { text: "Fixed-price auction", why: "In a fixed-price auction the price is frozen and suppliers compete on other terms." }
              ] },
            { t: "read", title: "The format zoo", body: [
              "Buyers use a few more names in practice. An <b>English ticker</b> moves the price in fixed steps; you accept each step to stay in, and it ends when the second-to-last supplier drops. <b>Open outcry</b> lets suppliers type any lower offer, so it needs an ending rule.",
              "A <b>fixed-price auction</b> freezes the price and suppliers compete on everything else: payment terms, warranty, service. A <b>True Price auction</b> ranks bids on quoted price plus charges minus credits, so a better supplier can win with a higher quote.",
              "<b>Combinatorial</b> auctions let suppliers bid on bundles, and the buyer picks the cheapest combination. Hybrids such as <b>Anglo-Dutch</b> run an open round to narrow the field, then take sealed final offers. Paul Klemperer's rule of thumb sums it up: auction design is \"horses for courses\"."
            ] },
            { t: "choice", title: "Which animal is it?", q: "The budget is fixed at £2m. Suppliers compete on warranty length, payment terms and service levels. Which format is this?",
              options: [
                { text: "Fixed-price auction", ok: true, why: "Right. The price is frozen, so all the competition goes into the terms." },
                { text: "True Price auction", why: "A True Price auction still has suppliers bidding on price, then adjusts for credits and charges." },
                { text: "Reverse English ticker", why: "A ticker moves the price. Here the price never moves." },
                { text: "Combinatorial auction", why: "There are no bundles to choose between here, just one fixed-price contract." }
              ] },
            { t: "summary", points: [
              "Open or sealed, and pay-your-bid or pay-the-runner-up, sort the four basic formats.",
              "English is a twin of second-price; Dutch is a twin of first-price.",
              "Reverse auctions are the same formats with suppliers competing to sell."
            ] }
          ]
        },
        {
          id: "water-meter-market", title: "The water-meter market: falling, rising, sealed", minutes: 14, kind: "Game",
          steps: [
            { t: "read", title: "Seven slots, ten suppliers", body: [
              "A water company must replace <b>7 million</b> household meters after a safety flaw. It earns £100 on each meter it gets back into service. Meters it can't replace earn nothing.",
              "Ten approved suppliers each hold <b>1 million</b> meters in stock, and nobody can make more in time. A supplier that doesn't sell has to scrap its stock, which is worth £0.",
              "So there's more supply (10 million) than demand (7 million). Three suppliers will go home empty-handed. You're Supplier 4, and the buyer will run the same market three ways."
            ] },
            { t: "choice", title: "Predict: the falling price", q: "Round one is a falling price. It starts at £100 and drops £1 at a time. Suppliers stay in or drop out. When only 7 remain, they all get that price. Where does it end?",
              options: [
                { text: "Close to £0", ok: true, why: "Right. While 8 or more are still in, someone will always stay in at a lower price, because selling at £1 beats scrapping at £0." },
                { text: "Close to £100", why: "Only if three suppliers drop out early, and none of them has a reason to: their fallback is £0." },
                { text: "Around £50", why: "There's nothing special about halfway. The price keeps falling while there's spare supply." },
                { text: "It can't be predicted", why: "It can: spare capacity and a £0 fallback push it right down." }
              ] },
            { t: "choice", title: "Predict: the rising price", q: "Round two is a rising price. It starts at £1 and climbs. Each supplier stops the clock for itself by accepting. The first 7 to accept win, each at the price it accepted. Where does it tend to end?",
              options: [
                { text: "Often close to £100", ok: true, why: "Right. Accepting early locks in a low price, so everyone wants to wait. If everyone waits, the clock climbs." },
                { text: "Close to £0", why: "That's the falling round. Here nobody wants to be the one who accepts at £3." },
                { text: "Exactly £50", why: "There's no reason it would stop halfway. Waiting pays all the way up." },
                { text: "The same as the falling round", why: "Same suppliers, same costs, very different price. That's the point of the game." }
              ] },
            { t: "read", title: "What groups tend to do", body: [
              "When groups play this game, the falling round usually ends near zero, the rising round often ends close to £100, and sealed bids, where each supplier writes one price and the 7 lowest win at their own bids, land somewhere in between. Later rounds get shaped by what people saw in earlier ones.",
              "The rising format quietly rewards everyone for holding back. Nobody has to talk for prices to stay high. That's <b>tacit collusion by format</b>: the rules did the colluding.",
              "There's a twist for the buyer. In a one-to-one negotiation you'd need to know each supplier's fallback to push hard. In the falling auction you needed to know nothing. Competition did the work."
            ] },
            { t: "choice", title: "Why so high?", q: "In the rising-price round, why did prices end up so high?",
              options: [
                { text: "Each supplier gains by waiting, so nobody wants to accept early", ok: true, why: "Right. Accepting early locks in a low price. If everyone waits, the clock climbs and the buyer pays for it." },
                { text: "The suppliers' costs were high", why: "Every supplier's fallback was £0." },
                { text: "There were too few suppliers", why: "There were 10 suppliers for 7 slots, the same as in the falling round." },
                { text: "The suppliers agreed a price in secret", why: "No one talked. The format alone made waiting pay." }
              ] },
            { t: "choice", title: "The buyer's chair", q: "As the buyer in the falling-price round, what did you need to know about suppliers' fallbacks to get a low price?",
              options: [
                { text: "Nothing: the spare capacity drove the price down", ok: true, why: "Right. Competition revealed the price for you." },
                { text: "Each supplier's exact fallback", why: "That's what a one-to-one negotiation needs. The auction didn't." },
                { text: "The average fallback", why: "Even that wasn't needed. You just had to keep more suppliers in than slots." }
              ] },
            { t: "summary", points: [
              "The same market can clear near £0 or near £100 depending on the format.",
              "Formats that reward waiting invite tacit collusion without anyone talking.",
              "Auctions need far less information about suppliers than negotiation does."
            ] }
          ]
        }
      ]
    },
    {
      title: "Bidding well",
      lessons: [
        {
          id: "second-price", title: "Second-price: tell the truth", minutes: 12, kind: "Game",
          steps: [
            { t: "read", title: "You decide whether, not how much", body: [
              "A retailer is buying 10,000 handheld scanners by sealed bid. You're a supplier, and the lowest bid wins. Your full cost per unit is somewhere between £290 and £340, and so is each rival's.",
              "In a <b>first-price</b> round the winner is paid its own bid. In a <b>second-price</b> round the winner is paid the second-lowest bid. That one change matters more than it looks.",
              "In second-price, your bid decides only <b>whether</b> you win. The runner-up sets <b>how much</b> you're paid. Recall from Course 1: a dominant strategy is best whatever the others do. Bidding your true cost is one."
            ] },
            { t: "auction", title: "Round A: first-price", prompt: "Lowest bid wins and is paid its own bid. Your cost is shown. Bid to make money, not just to win.",
              side: "sell", mode: "first", rivals: 4, range: [290, 340], rounds: 3, unit: "£",
              explain: "In first-price you're paid what you ask, so you have to add a margin. Bid your cost and you win nothing even when you win. The rivals added a margin that shrinks as their cost nears the top of the range." },
            { t: "auction", title: "Round B: second-price", prompt: "Lowest bid wins but is paid the second-lowest bid. Try bidding exactly your cost.",
              side: "sell", mode: "second", rivals: 4, range: [290, 340], rounds: 3, unit: "£",
              explain: "The rivals bid their true cost, which is the dominant strategy here. If you bid your cost too, you never win at a loss and never lose a deal you'd have wanted." },
            { t: "choice", title: "Padding the bid", q: "Your cost is £312. In the second-price round, a colleague says bid £318 \"to be safe\". What does that change?",
              options: [
                { text: "It only loses you deals where the runner-up bids between £312 and £318, which you'd have won at a profit", ok: true, why: "Right. Your bid never changes your price, only whether you win." },
                { text: "It raises the price you're paid", why: "No. The runner-up's bid sets your price." },
                { text: "It protects you against a loss", why: "Bidding your cost already guarantees you never win at a loss." },
                { text: "Nothing at all", why: "It costs you some profitable wins." }
              ] },
            { t: "choice", title: "Undercutting yourself", q: "Same cost of £312, second-price. What if you bid £305 to make sure you win?",
              options: [
                { text: "You might win a contract paying less than £312 and lose money", ok: true, why: "Right. If the runner-up bids £308, you win at £308, below your cost." },
                { text: "You win more and earn more", why: "You win more often, but the extra wins are the loss-making ones." },
                { text: "It makes no difference", why: "It does, in exactly the cases where it hurts." }
              ] },
            { t: "read", title: "So why does nobody use it?", body: [
              "Sealed second-price is rare in real buying. It's hard to justify to colleagues and auditors (\"we paid more than the winner asked\"), and suppliers find it hard to understand, so they don't trust it.",
              "It also shows the buyer every supplier's true cost, which suppliers fear will be used against them next time. A 2020 survey of senior procurement advisers reported by Gretschko and Pollrich found sealed second-price used in close to none of their projects.",
              "The good news: an <b>English ticker</b> gives you the same truthful logic in a form people understand. You stay in until the price hits your cost, then drop out."
            ] },
            { t: "sort", title: "Why second-price is rare", prompt: "Real reason or myth?",
              buckets: ["Real reason", "Myth"],
              items: [
                { text: "It's hard to justify paying more than the lowest bid", bucket: 0, why: "Auditors and colleagues see a price above the winning bid." },
                { text: "It shows the buyer suppliers' true costs", bucket: 0, why: "Suppliers worry that information will be used in the next deal." },
                { text: "Suppliers find it hard to understand", bucket: 0, why: "And a format nobody trusts doesn't get truthful bids." },
                { text: "Suppliers bid higher than in first-price", bucket: 1, why: "They bid lower, closer to cost. The price paid is the second bid." },
                { text: "It's illegal in public procurement", bucket: 1, why: "It isn't. It's just rarely chosen." }
              ] },
            { t: "summary", points: [
              "In a second-price auction, bidding your true value or cost is dominant.",
              "Shading or padding only changes whether you win, and always in the wrong cases.",
              "It's rarely used sealed, but the English ticker delivers the same truthful logic."
            ] }
          ]
        },
        {
          id: "first-price-shading", title: "First-price: how much to shade", minutes: 12, kind: "Concept",
          steps: [
            { t: "read", title: "Paid what you ask", body: [
              "In a first-price auction, bidding your true value earns nothing even when you win. You have to <b>shade</b>: bid below your value when buying, or above your cost when selling.",
              "Every pound of shade trades margin against your chance of winning. Shade more and you earn more when you win, but you win less often.",
              "For the textbook case, with values spread evenly from 0 to 100 and everyone rational, there's a clean rule: bid <b>(N - 1)/N</b> of your value, where N is the number of bidders. Value 60 with one rival (N = 2): bid 30. Value 60 with nine rivals (N = 10): bid 54."
            ] },
            { t: "slider", title: "Find your best bid", prompt: "You're a supplier with a cost of 40. Rivals' costs are spread evenly from 0 to 100, and the buyer pays at most 100. Lowest bid wins and is paid its bid.",
              inputs: [
                { id: "r", label: "Number of rivals", min: 1, max: 9, step: 1, value: 1 },
                { id: "b", label: "Your bid", min: 40, max: 100, step: 1, value: 90 }
              ],
              outputs: [
                { id: "win", label: "Chance you win", expr: "100 * Math.pow(Math.min(1, (r + 1) * (100 - b) / (100 * r)), r)", suffix: "%", decimals: 0 },
                { id: "margin", label: "Margin if you win", expr: "b - 40" },
                { id: "profit", label: "Expected profit", expr: "margin * win / 100", decimals: 2 }
              ],
              goal: { expr: "r == 4 && b >= 51 && b <= 53", text: "Set four rivals, then find the bid that earns the most." },
              explain: "With four rivals the best bid is 52. The rule for this case is cost plus (100 - cost)/N: 70 with one rival, 52 with four, 46 with nine. More rivals squeeze your margin." },
            { t: "choice", title: "Use the rule", q: "You're selling. Your value is 80 and you face three equally strong rivals, all spread 0 to 100. What's the textbook first-price bid?",
              options: [
                { text: "60", ok: true, why: "Right. N is 4, so bid three quarters of 80." },
                { text: "80", why: "That's your value. Win and you make nothing." },
                { text: "40", why: "That's the bid with one rival. With three you must bid closer to your value." },
                { text: "70", why: "Close, but the rule gives 60." }
              ] },
            { t: "read", title: "What really drives shading", body: [
              "Three things decide how much you shade: how many rivals you face (more rivals, less shading), what you believe about their costs (rivals you think are close to you, less shading), and how badly you need the deal.",
              "So first-price bids are driven by <b>beliefs</b>. That's a lever for buyers: what suppliers believe about the competition moves their bids, whatever the competition really looks like. Tell them the field is strong and they shade less.",
              "Dutch is the twin. On a falling clock you decide in advance where you'd press, which is the same as writing that number in a sealed envelope."
            ] },
            { t: "choice", title: "New rivals arrive", q: "A supplier learns that two extra rivals have entered a sealed first-price tender. What should happen to its bid?",
              options: [
                { text: "It should move closer to its cost", ok: true, why: "Right. More rivals means less room to shade." },
                { text: "It should rise to protect its margin", why: "That cuts its chance of winning just when it's already falling." },
                { text: "Nothing, since its cost hasn't changed", why: "Its cost hasn't, but its chance of winning at any price has." }
              ] },
            { t: "summary", points: [
              "In first-price auctions you must shade, trading margin against your chance of winning.",
              "More rivals, or rivals you think are close to you, mean less shading.",
              "First-price bids are driven by beliefs, which is something a buyer can influence."
            ] }
          ]
        },
        {
          id: "tie-and-one-more-bidder", title: "The surprising tie, and the value of one more bidder", minutes: 14, kind: "Concept",
          steps: [
            { t: "choice", title: "Predict first", q: "Two bidders, values spread evenly from 0 to 100. Second-price: everyone bids their value, the winner pays the runner-up's bid. First-price: everyone bids half their value. Which earns the seller more on average?",
              options: [
                { text: "They earn the same", ok: true, why: "Right, and surprising. Both average 33.3." },
                { text: "Second-price, because bids are higher", why: "Bids are higher, but the winner pays the lower one, which averages 33.3." },
                { text: "First-price, because the winner pays its own bid", why: "The winner pays its own bid, but that bid is shaded to half. The higher value averages 66.7, so the price averages 33.3." }
              ] },
            { t: "read", title: "The revenue tie", body: [
              "That's the <b>revenue equivalence theorem</b> (Vickrey 1961; Myerson 1981; Riley and Samuelson 1981). When bidders are similar, independent, risk-neutral and know their own values, every standard format earns the same on average. Why? Bidders adjust their bids to the rules so precisely that the rules wash out.",
              "With more bidders the tie still holds, and the price rises: 33.3 for 2 bidders, 50 for 3, 60 for 4, 81.8 for 10. The formula is (N - 1)/(N + 1) × 100."
            ] },
            { t: "slider", title: "Watch the formats tie", prompt: "Values spread evenly from 0 to 100. Change the number of bidders and compare the seller's average price under each format.",
              inputs: [ { id: "n", label: "Number of bidders", min: 2, max: 10, step: 1, value: 2 } ],
              outputs: [
                { id: "sp", label: "Second-price or English: average price", expr: "100 * (n - 1) / (n + 1)", decimals: 1 },
                { id: "fp", label: "First-price or Dutch: average price", expr: "(100 * n / (n + 1)) * (n - 1) / n", decimals: 1 }
              ],
              explain: "Whatever the number of bidders, the two columns match. Second-price: the runner-up's value. First-price: the top value, shaded by (N - 1)/N. Same average." },
            { t: "read", title: "Five conditions, and one more bidder", body: [
              "Formats tie on average when: 1) bidders are similar and there are more than three of them, 2) there's no strong common value, 3) the deal isn't strategically vital to bidders, 4) there's one lot, and 5) there's no real risk of collusion.",
              "When those hold, stop worrying about the format and get more bidders in. Say suppliers' costs are spread evenly from 60 to 100. The expected price is 86.7 with 2 suppliers, 80.0 with 3, 76.0 with 4, 73.3 with 5 and 71.4 with 6: savings of about 8%, 5%, 3.5% and 2.6% for each extra supplier.",
              "Going from 2 to 3 suppliers, the price drops 6.7, roughly half from each of two effects. The <b>cost effect</b>: the cheapest supplier is likely cheaper (73.3 to 70.0). The <b>competition effect</b>: everyone's margin shrinks (13.3 to 10.0)."
            ] },
            { t: "slider", title: "The value of one more supplier", prompt: "Suppliers' costs are spread evenly from 60 to 100. Add suppliers and watch the expected price split into cost and margin.",
              inputs: [ { id: "n", label: "Number of suppliers", min: 2, max: 10, step: 1, value: 2 } ],
              outputs: [
                { id: "price", label: "Expected price paid", expr: "60 + 80 / (n + 1)", decimals: 1 },
                { id: "cost", label: "Expected lowest cost", expr: "60 + 40 / (n + 1)", decimals: 1 },
                { id: "margin", label: "Winner's expected margin", expr: "price - cost", decimals: 1 },
                { id: "saving", label: "Saving from the last supplier added", expr: "100 * (80 / n - 80 / (n + 1)) / (60 + 80 / n)", suffix: "%", decimals: 1 }
              ],
              goal: { expr: "price < 75", text: "Get the expected price below 75." },
              explain: "Five suppliers get you to 73.3. Notice the saving from each new supplier shrinks: big at first, then fading. Shortlisting from five to three to save time can cost more than any format choice saves." },
            { t: "sort", title: "Tie or no tie?", prompt: "Should the standard formats tie here, or is one of the five conditions broken?",
              buckets: ["Formats should tie", "A condition is broken"],
              items: [
                { text: "Six similar suppliers bid for a standard bolt contract", bucket: 0, why: "Similar, independent, private costs, one lot." },
                { text: "Three suppliers bid to drill an oil field whose size nobody knows", bucket: 1, why: "Common value: the field is worth the same unknown amount to everyone." },
                { text: "One supplier will close a factory if it loses", bucket: 1, why: "The deal is strategically vital, so that supplier bids differently." },
                { text: "The same two suppliers meet in every monthly auction", bucket: 1, why: "Collusion risk, and only two bidders." },
                { text: "Ten painters bid for one office redecoration", bucket: 0, why: "Many similar bidders, private costs, one job." }
              ] },
            { t: "choice", title: "Where to spend your effort", q: "You can either switch from first-price to English, or add a fourth supplier to a three-supplier tender. The conditions for the tie hold. Which matters more?",
              options: [
                { text: "Adding the fourth supplier", ok: true, why: "Right. Under the tie, the format change is worth about nothing; the extra supplier is worth about 5%." },
                { text: "Switching format", why: "With the five conditions met, formats tie on average." },
                { text: "Both the same", why: "The extra bidder wins clearly." }
              ] },
            { t: "summary", points: [
              "Under five clear conditions, every standard format earns the same on average.",
              "When they hold, the number of bidders matters far more than the format.",
              "Each extra bidder helps through lower costs and thinner margins, with the biggest gains from the first few."
            ] }
          ]
        }
      ]
    },
    {
      title: "Strong bidders, shared values and traps",
      lessons: [
        {
          id: "mona-lisa", title: "The Mona Lisa: strong vs weak bidders", minutes: 10, kind: "Case",
          steps: [
            { t: "read", title: "Three bidders, one masterpiece", body: [
              "A thought experiment: the Mona Lisa goes under the hammer. There are three bidders. A private collector whose limit is <b>€40m</b>. A museum whose limit is <b>€50m</b>. And an agent buying for a new national gallery, whose limit is <b>€100m</b> because her career rides on bringing the painting home.",
              "Each bidder knows its own limit, not the others'. The seller can run an English auction (price rises) or a Dutch one (a clock starts at €150m and falls)."
            ] },
            { t: "choice", title: "Predict: English", q: "In the English auction, the price rises until one bidder is left. Roughly what does the painting sell for?",
              options: [
                { text: "About €50m", ok: true, why: "Right. The collector quits at 40, the museum at 50, and the agent wins at about €50m plus one step." },
                { text: "About €100m", why: "The agent never has to go that high. The price stops once the museum quits." },
                { text: "About €40m", why: "The museum is still in at 40, so the price keeps rising to 50." }
              ] },
            { t: "choice", title: "Why only €50m?", q: "In the English auction, why does the agent pay only about €50m?",
              options: [
                { text: "The price stops rising once the museum quits", ok: true, why: "Right. In an open rising auction the winner pays what it took to beat the runner-up." },
                { text: "The agent bid cleverly", why: "It didn't need to. It just stayed in." },
                { text: "English auctions favour weak bidders", why: "It's the other way round here: the strong bidder kept most of its surplus." }
              ] },
            { t: "choice", title: "The Dutch clock", q: "In the Dutch version, the clock falls from €150m and in our version the agent stops it at €95m. What made her press so early?",
              options: [
                { text: "She couldn't see rivals and feared losing a painting she valued at €100m", ok: true, why: "Right. Pay-your-bid plus uncertainty turns the strong bidder's fear into the seller's revenue." },
                { text: "The rules forced her", why: "The rules let her wait. Fear didn't." },
                { text: "She knew the museum's limit was €50m", why: "If she knew that, she'd have waited until just above 50." }
              ] },
            { t: "read", title: "When the twins stop being twins", body: [
              "So with one strong bidder and private values, pay-your-bid formats can earn the seller far more: €95m against €50m here. With unequal bidders the revenue tie breaks. Theory has no general ranking, but one robust finding is that in first-price formats the weak bidder bids more aggressively than the strong one, relative to its value (Maskin and Riley, 2000).",
              "The gap shrinks if the strong bidder is spending its own money, so it fears losing less, or if a close substitute exists, such as another masterpiece that would do just as well.",
              "Now the twist. Suppose nobody is sure the painting is genuine. Its value is partly <b>common</b>. In English, each bidder watches others stay in, learns that they believe in it too, and dares to go higher."
            ] },
            { t: "choice", title: "The twist", q: "Now the painting's authenticity is uncertain and every bidder has a different expert's opinion. Which format would you expect to earn more?",
              options: [
                { text: "English, because bidders learn from who's still in", ok: true, why: "Right. Watching rivals stay in reassures everyone, so bids rise." },
                { text: "Dutch, for the same reason as before", why: "With common values, fear of overpaying makes sealed and Dutch bidders cautious." },
                { text: "It makes no difference", why: "Common values break the tie." }
              ] },
            { t: "summary", points: [
              "With one strong bidder and private values, pay-your-bid formats can earn far more than English.",
              "The strong bidder's fear of losing is the seller's friend.",
              "When values are partly common, English usually comes out ahead because bidders learn from each other."
            ] }
          ]
        },
        {
          id: "jar-of-coins", title: "Common values: the jar of coins", minutes: 14, kind: "Game",
          steps: [
            { t: "read", title: "Worth the same, known to no one", body: [
              "With a <b>private value</b>, each bidder's value is its own: a supplier's cost of making a standard part, say. With a <b>common value</b>, the prize is worth about the same to everyone, but nobody knows exactly how much: drilling rights to an oil field, or a new product whose true development cost will only show up later.",
              "Here's the test: with a common value, hearing a rival's estimate would improve yours. With a private value, it wouldn't change a thing. Most real deals are a mix of both, part private and part common."
            ] },
            { t: "sort", title: "Private or common?", prompt: "Is the value mostly the bidder's own, or the same unknown amount for everyone?",
              buckets: ["Mostly private", "Mostly common"],
              items: [
                { text: "A supplier's cost to make a standard bolt", bucket: 0, why: "Each supplier knows its own cost; a rival's cost tells it nothing new." },
                { text: "Rights to an unexplored oil field", bucket: 1, why: "The oil is the same for everyone; nobody knows how much there is." },
                { text: "A first-of-its-kind sensor whose cost nobody can know until it's built", bucket: 1, why: "Every supplier faces the same unknown cost." },
                { text: "A house you want because it's near your mother", bucket: 0, why: "That reason is yours alone." },
                { text: "A pallet of returned electronics, contents unknown", bucket: 1, why: "What's in the pallet is the same for every bidder." }
              ] },
            { t: "auction", title: "The jar of coins: 3 bidders", prompt: "A jar of coins is up for sale. You get an honest estimate of what's inside. So do two rivals. Highest bid wins and pays its bid.",
              side: "buy", mode: "first", rivals: 2, common: { truth: 10, spread: 0.5 }, rounds: 3, unit: "£",
              explain: "The jar holds exactly £10. Every estimate is honest but can be up to £5 out either way. Notice whose estimate tends to win: the highest one." },
            { t: "auction", title: "The jar of coins: 12 bidders", prompt: "Same jar, but now eleven rivals bid against you. Think about what winning would tell you.",
              side: "buy", mode: "first", rivals: 11, common: { truth: 10, spread: 0.5 }, rounds: 3, unit: "£",
              explain: "With twelve bidders, the highest estimate is almost always well above £10. If you bid close to your estimate and won, you probably overpaid." },
            { t: "read", title: "The winner's curse", body: [
              "Suppose everyone bids their own estimate. With 3 bidders, the winning estimate averages <b>£12.50</b>: the winner loses £2.50 on average and loses money nearly 9 times out of 10. With 12 bidders it averages <b>£14.23</b>, and the winner loses almost every time.",
              "That's the <b>winner's curse</b>. Winning is bad news about your estimate: \"I won\" means \"everyone else thought it was worth less than I did\". The more bidders there are, the more extreme the winning estimate tends to be.",
              "The fix is to bid as if you already know you're the most optimistic. With 3 bidders, bidding 75% of your estimate leaves the winner about £0.63 on average. With 12, even 75% loses about £0.67. Classroom jar auctions (Bazerman and Samuelson, 1983) and offshore oil lease sales (Capen, Clapp and Campbell, 1971) show the same pattern."
            ] },
            { t: "choice", title: "You won. Now what?", q: "You've just won the jar auction against 11 others. What should winning tell you?",
              options: [
                { text: "That your estimate was probably the highest, and so probably too high", ok: true, why: "Right. Winning selects the most optimistic guess." },
                { text: "That you're the best estimator", why: "Maybe, but more likely you were the luckiest optimist." },
                { text: "Nothing, because everyone's estimates are honest", why: "Honest on average still means the highest of twelve is too high." }
              ] },
            { t: "choice", title: "More bidders join", q: "More bidders join a common-value auction. What should a sensible bidder do?",
              options: [
                { text: "Shade further below its estimate", ok: true, why: "Right. The more rivals, the more optimistic the winner's estimate is likely to be." },
                { text: "Bid closer to its estimate, as in private-value auctions", why: "That's right for private values, and exactly wrong for common values." },
                { text: "Stop bidding", why: "Shading enough is the answer, not quitting." }
              ] },
            { t: "summary", points: [
              "With common values, the most optimistic estimate wins, so winners tend to overpay.",
              "The curse gets worse as more bidders join.",
              "Bid as if you've already learned you're the most optimistic: shade more, and more with more rivals."
            ] }
          ]
        },
        {
          id: "taming-the-curse", title: "Taming the winner's curse", minutes: 10, kind: "Concept",
          steps: [
            { t: "read", title: "Under-priced is not a bargain", body: [
              "Eight suppliers quote for a first-of-its-kind heat-pump module. The true unit cost will turn out to be <b>£216</b>, but nobody knows that yet. Each supplier's engineering estimate is honest and within 10% of the truth.",
              "The lowest of eight estimates averages about <b>£199</b>, nearly 8% below the true cost. A supplier that quotes its estimate plus a £5 margin wins with about £204, then loses about £12 a unit. You're one of the eight. Try it."
            ] },
            { t: "auction", title: "Quote for the module", prompt: "Lowest quote wins and is paid its quote. Your estimate of the unit cost is shown; the true cost is revealed after each round.",
              side: "sell", mode: "first", common: { truth: 216, spread: 0.1 }, rivals: 7, rounds: 3, unit: "£",
              explain: "The true cost was £216 every time. Winning tends to mean your estimate was the lowest of eight, so probably too low. A sensible bid sits well above your estimate." },
            { t: "choice", title: "Supplier C's dilemma", q: "You're Supplier C. Your estimate is £198 and you'd normally add £5. What's the risk if you win at £203?",
              options: [
                { text: "Winning means you were probably the lowest estimate, and the true cost is likely higher", ok: true, why: "Right. Among eight honest estimates, the lowest is usually too low." },
                { text: "None, since your estimate is honest", why: "Honest isn't the same as right, and winning selects the most optimistic." },
                { text: "The buyer will reject the bid", why: "The buyer will be delighted. That's the problem." }
              ] },
            { t: "choice", title: "The buyer's problem", q: "Why should the buyer care that the winner under-priced?",
              options: [
                { text: "Under-pricing leads to cost creep, claims or failure, and teaches suppliers to add risk premiums", ok: true, why: "Right. The curse comes back to the buyer as higher prices later." },
                { text: "It shouldn't", why: "In a one-off with no follow-on, maybe. Real supply relationships aren't one-offs." },
                { text: "Because it's illegal to accept a bid below cost", why: "Not in general. The problem is commercial, not legal." }
              ] },
            { t: "read", title: "Three remedies", body: [
              "<b>Share information.</b> Give every supplier your should-cost model, drawings, volume history and test data. Less uncertainty means smaller risk premiums. The \"linkage principle\" (Milgrom and Weber, 1982) says revealing information about the common value pays on average.",
              "<b>Use an open format.</b> In an English ticker, suppliers watch rivals drop out and learn from it. With common values, English tends to beat second-price, which beats first-price. <b>Reduce the common part.</b> Pay the unknown raw-material cost through an index, so suppliers compete on what they can know.",
              "Watch out for <b>toeholds</b>: an incumbent who already knows the part makes rivals fear the curse more, and can win cheaply (Bulow, Huang and Klemperer, 1999). Levelling information levels the field."
            ] },
            { t: "sort", title: "Does it reduce the winner's curse?", prompt: "Sort each buyer action.",
              buckets: ["Reduces it", "Makes it worse"],
              items: [
                { text: "Share the should-cost model with every supplier", bucket: 0, why: "Less uncertainty, smaller risk premiums." },
                { text: "Run an English ticker where drop-outs are visible", bucket: 0, why: "Suppliers learn from each other as the price moves." },
                { text: "Index the volatile raw-material cost", bucket: 0, why: "It takes the unknowable part out of the price." },
                { text: "Invite twelve suppliers to a sealed first-price round for an unproven technology", bucket: 1, why: "More bidders and no learning: the lowest estimate will be badly wrong." },
                { text: "Let the incumbent keep its test data to itself", bucket: 1, why: "That's a toehold: rivals fear the curse more and back off." }
              ] },
            { t: "summary", points: [
              "The winner's curse looks like a bargain for the buyer, but it returns as cost creep and risk premiums.",
              "Share information and use open formats so bidders can learn.",
              "Take the unknowable part out of the price, for example through indexation."
            ] }
          ]
        },
        {
          id: "pound-auction", title: "The escalation trap: the pound auction", minutes: 8, kind: "Game",
          steps: [
            { t: "read", title: "A £10 note for sale", body: [
              "The rules, after Martin Shubik's \"dollar auction\" (1971): a £10 note is auctioned in open bidding, in steps of £1. The highest bidder gets the note and pays its bid. <b>The second-highest bidder also pays its bid, and gets nothing.</b>",
              "Bids of £1, £2, £3 look like free money. Then someone bids £9, and the runner-up at £8 faces a choice: quit and lose £8, or bid £10 and maybe break even. Each step looks rational on its own. Classroom runs often end well above £10."
            ] },
            { t: "tree", title: "Raise or quit?", prompt: "You've bid £8 and your rival has bid £9. You each have £12 to spend, so nobody can bid above £12. Payoffs are your net result: prize minus what you've paid. Pick each move, then check.",
              players: ["You", "Rival"], unit: "£ net",
              root: { p: 0, options: [
                { label: "Quit at £8", pay: [-8, 1] },
                { label: "Raise to £10", next: { p: 1, options: [
                  { label: "Quit at £9", pay: [0, -9] },
                  { label: "Raise to £11", next: { p: 0, options: [
                    { label: "Quit at £10", pay: [-10, -1] },
                    { label: "Raise to £12", pay: [-2, -11] }
                  ] } }
                ] } }
              ] },
              explain: "Work back from the end. At £11 you'd raise to £12 (lose £2, not £10), and the rival can't go higher. So the rival should quit at £9 rather than end up £11 down. So you raise to £10 and break even. Only what's ahead counted: with known budgets, the bidder who can go further wins, and the rival should never have bid £9 (O'Neill, 1986). Real players rarely reason this far." },
            { t: "choice", title: "The real question", q: "You've bid £8. Your rival just bid £9. Ignoring what you've already bid, what's the real question?",
              options: [
                { text: "Is paying £2 more to win £10 likely to pay, given your rival might raise again?", ok: true, why: "Right. The £8 is gone whatever you do. Only the next step's cost and chance count." },
                { text: "How do I get my £8 back?", why: "You can't. That's what makes the trap work." },
                { text: "Can I afford to lose?", why: "Affordability isn't the issue; whether the next pound pays is." }
              ] },
            { t: "choice", title: "Spot it in business", q: "Which business situation is most like the pound auction?",
              options: [
                { text: "Two firms spend on a patent race where only the first to file gets the patent", ok: true, why: "Right. Both pay; only one wins." },
                { text: "A sealed first-price tender with free bidding", why: "Losers pay nothing there." },
                { text: "A take-it-or-leave-it offer", why: "There's no escalation in a single offer." }
              ] },
            { t: "read", title: "Sunk is sunk", body: [
              "Once you've sunk money, quitting feels like losing it. It isn't: the money's gone either way, whatever you do next. Only future costs and future gains should decide your next move.",
              "The pattern shows up in price wars, patent races, bidding wars for a company, and \"we've already spent £3m on this supplier, we can't switch now\". If you design tenders, all-pay structures such as unpaid pitches or costly bid preparation push suppliers into this mindset, and the best ones stop coming back."
            ] },
            { t: "summary", points: [
              "When losers pay too, every step can look rational while the total is ruinous.",
              "Sunk costs are gone; decide only on what's ahead.",
              "Watch out for all-pay structures, whether you're bidding or designing."
            ] }
          ]
        }
      ]
    },
    {
      title: "Choosing a format",
      lessons: [
        {
          id: "pick-the-format", title: "Capstone: pick the format", minutes: 10, kind: "Case",
          steps: [
            { t: "read", title: "Six questions, one format", body: [
              "1) Are values mostly private or mostly common? Common: lean English and share information. 2) Is one bidder much stronger? With private values, lean sealed first-price, or level the field with credits and charges (Course 7). 3) Is the deal strategically vital to suppliers? Lean first-price.",
              "4) Is collusion a risk, with few suppliers who meet often? Lean sealed first-price and avoid open formats that let bidders signal. 5) Do you need to justify the award simply? Avoid sealed second-price. 6) Otherwise, formats tie, so spend your effort on getting more bidders.",
              "And the specialists: a <b>fixed-price auction</b> when the budget is set and you want suppliers to compete on terms; an <b>Anglo-Dutch</b> hybrid to discover the price in the open, then stop a strong bidder coasting with a sealed round."
            ] },
            { t: "choice", title: "Scenario 1: packaging", q: "Twelve similar suppliers bid for a standard packaging contract. No one dominates and they rarely meet. What do you do?",
              options: [
                { text: "Any standard format; focus on keeping all twelve in", ok: true, why: "Right. The conditions for the tie hold, so bidder numbers are what count." },
                { text: "Sealed second-price, because it's truthful", why: "True, but it gains nothing under the tie and is hard to explain." },
                { text: "Negotiate one-to-one with the cheapest", why: "That throws away the competition you already have." }
              ] },
            { t: "choice", title: "Scenario 2: an unknown cost", q: "Five suppliers quote for a first-generation heat-pump module whose cost nobody really knows. What do you do?",
              options: [
                { text: "English ticker, plus sharing your should-cost data", ok: true, why: "Right. Common value: let suppliers learn and cut their uncertainty." },
                { text: "Sealed first-price", why: "That invites the winner's curse and risk premiums." },
                { text: "Dutch", why: "Same problem as sealed first-price: nobody learns anything until it's over." }
              ] },
            { t: "choice", title: "Scenario 3: a strong incumbent", q: "One incumbent is far cheaper than two newcomers. Values are private. What do you do?",
              options: [
                { text: "Sealed first-price (or Dutch), so the incumbent can't just shadow the runner-up", ok: true, why: "Right. Not knowing the others' prices, the incumbent bids more of its advantage away." },
                { text: "English ticker", why: "The incumbent wins at the newcomers' price plus a step." },
                { text: "Exclude the newcomers", why: "Then there's no competition at all." }
              ] },
            { t: "choice", title: "Scenario 4: the old club", q: "The same three suppliers have shared the market for years and meet in every quarterly auction. What do you do?",
              options: [
                { text: "Sealed first-price with a firm reserve price", ok: true, why: "Right. Sealed bids stop real-time signalling, and the reserve caps what a quiet club can get away with." },
                { text: "English ticker", why: "It lets them signal and punish each other in real time." },
                { text: "Sealed second-price", why: "It makes collusion easier to sustain." }
              ] },
            { t: "choice", title: "Scenario 5: a fixed budget", q: "The budget is fixed at £2m and you want the best service package for it. What do you do?",
              options: [
                { text: "Fixed-price auction", ok: true, why: "Right. Freeze the price and let suppliers compete on what they offer for it." },
                { text: "English ticker on price", why: "The price is already fixed; there's nothing for a ticker to move." },
                { text: "Dutch", why: "Same problem: a price clock makes no sense with a fixed budget." }
              ] },
            { t: "summary", points: [
              "Start with values: private or common?",
              "Then ask about strength, stakes and collusion.",
              "If nothing breaks the tie, spend your effort on more bidders, not on the format."
            ] }
          ]
        }
      ]
    }
  ],
  exam: { pass: 7, questions: [
    { q: "A tender runs on a screen: the price rises from £50 until the first supplier clicks \"accept\", and that supplier wins at that price. Which format is it?",
      options: ["Reverse English", "Reverse Dutch", "Second-price sealed bid", "Fixed-price auction"], answer: 1,
      why: "A rising price that the first acceptor stops is the reverse Dutch." },
    { q: "Ten suppliers whose fallback is zero compete for seven slots in a falling-price auction. What price does theory predict?",
      options: ["Close to zero", "Close to the buyer's maximum", "Exactly half the buyer's maximum", "It can't be predicted"], answer: 0,
      why: "While eight or more are still in, someone always stays in at a lower price, so it runs down towards the fallback." },
    { q: "Your cost is £70 in a sealed second-price reverse auction. What should you bid?",
      options: ["£75, to be safe", "£70", "£65, to win more", "It depends on how many rivals there are"], answer: 1,
      why: "Your bid only decides whether you win; the runner-up sets the price. Bidding your cost is dominant." },
    { q: "In a first-price auction, a bidder hears that three more rivals have entered. What should happen to its shading?",
      options: ["It should shade more", "It should shade less", "No change", "It should bid its full value"], answer: 1,
      why: "More rivals cut your chance of winning at any shaded bid, so you move closer to your value or cost." },
    { q: "Five similar, independent, risk-neutral suppliers with private costs. Which change most improves the buyer's expected price?",
      options: ["Switching from Dutch to English", "Switching from first-price to second-price", "Adding a sixth comparable supplier", "Asking everyone for a best and final offer before the auction"], answer: 2,
      why: "Under revenue equivalence the formats tie; the extra bidder lowers the expected price." },
    { q: "Which of these breaks the conditions for revenue equivalence?",
      options: ["Eight suppliers bidding for a standard part", "A deal that one supplier must win to keep a plant open", "A single lot", "Suppliers who've never met"], answer: 1,
      why: "Strategic importance changes how hard bidders push in first-price formats." },
    { q: "One collector values a rare violin at £2m; two others at £1.1m and £0.9m. Values are private and nobody can see the others' limits. Which format is likely to earn the seller more?",
      options: ["English", "Dutch", "They'll tie", "Second-price sealed bid"], answer: 1,
      why: "In English the strong bidder pays about the runner-up's £1.1m; in Dutch its fear of losing makes it stop the clock higher." },
    { q: "Fifteen firms bid for rights to a mine whose ore content is uncertain. Each has an honest, noisy estimate. What's the likely result if each bids its estimate?",
      options: ["The winner pays about the true value", "The winner pays well over the true value", "The winner pays below the true value", "Nobody bids"], answer: 1,
      why: "The highest of fifteen honest estimates is usually well above the truth: the winner's curse, worse with more bidders." },
    { q: "Which buyer action best reduces the winner's curse in a tender for an unproven component?",
      options: ["Keep the cost model secret so suppliers bid lower", "Use a sealed first-price round with more bidders", "Share the should-cost model and run an English ticker", "Award to the lowest bid, whatever it is"], answer: 2,
      why: "Shared information and visible drop-outs cut uncertainty, so suppliers need smaller risk premiums." },
    { q: "In a pound auction you've bid £7 and been outbid at £8. What's the right way to think about your £7?",
      options: ["Raise to recover it", "It's sunk; decide only whether the next bid is worth it", "Quit only once you've bid £10", "Always match the rival"], answer: 1,
      why: "The £7 is lost either way; escalation feeds on treating it as recoverable." }
  ] }
});
