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

## The course app

Every finished course is free during early access, but needs registration (name, email, optional opt-in to course emails). That's how the mailing list for future paid courses gets built.

| Page | What it does |
| --- | --- |
| `login.html` | Register or come back with the same email |
| `app.html` | Dashboard: continue learning, courses, certificates |
| `course.html?c=<id>` | Course overview and syllabus |
| `lesson.html?c=<id>&l=<lesson>` | Interactive lesson player; `&exam=1` runs the final assessment |
| `certificate.html?c=<id>` | Certificate with ID, PDF download and LinkedIn link |
| `privacy.html` | Privacy notice |

Courses and lessons are data in `assets/data.js`. Each lesson is a list of steps (`read`, `sort`, `choice`, `matrix`, `repeated`, `summary`). Paid checkout is still in the code: set `FREE = false` in `assets/core.js` to bring the £19 price back.

**Backend:** Cloudflare Pages with one function (`functions/api/register.js`) writing to a D1 database (`db/schema.sql`). Live at https://gambit-7w4.pages.dev. Deploy with `./deploy.sh`, export the list with `./export-signups.sh` (add `--consented` for marketing-ready emails only). Lesson progress and certificates are still stored in the learner's browser.
