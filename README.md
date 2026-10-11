# Gambit

Landing page concept for Gambit, an online game theory training platform: practitioner-led courses on procurement, negotiation, strategy, auctions, pricing and alliances, built around interactive games.

The hero is a live 3D constellation of chess pieces that rearranges into a coalition network, a game tree and a payoff matrix. Further down there's a playable sample lesson (a repeated tender against a tit-for-tat rival).

## Run it locally

It's a single static HTML file with no build step and no dependencies. Fonts load from Google Fonts, so you need an internet connection.

```bash
git clone https://github.com/ayratmak/gambit.git
cd gambit
python3 -m http.server 8000
```

Then open http://localhost:8000.

You can also just double-click `index.html` to open it in a browser.
