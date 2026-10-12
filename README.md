# Gambit

Landing page concept for Gambit, an online game theory training platform: practitioner-led courses on procurement, negotiation, strategy, auctions, pricing and alliances, built around interactive games.

Live version: https://ayratmak.github.io/gambit/ (landing) and https://ayratmak.github.io/gambit/login.html (the course app).

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

## The course app (prototype)

| Page | What it does |
| --- | --- |
| `login.html` | Sign in or create an account (name goes on certificates) |
| `app.html` | Dashboard: continue learning, my courses, catalogue, certificates |
| `course.html?c=<id>` | Course overview, syllabus, £19 checkout |
| `lesson.html?c=<id>&l=<lesson>` | Interactive lesson player; `&exam=1` runs the final assessment |
| `certificate.html?c=<id>` | Certificate with ID, PDF download and LinkedIn link |

Courses and lessons are data in `assets/data.js`. Each lesson is a list of steps (`read`, `sort`, `choice`, `matrix`, `repeated`, `summary`), so adding content means writing data, not code.

This is a front-end prototype: accounts, purchases and progress are stored in the browser's localStorage, no payment is taken, and passwords are never stored. Real sign-in, Stripe payments and certificate verification need a backend.
