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

Nine courses. "Think Three Moves Ahead" (foundations) is free; the other eight cost £9.89 each, with the first lesson of each free to try. Everyone registers (name, email, optional opt-in to course emails).

| Page | What it does |
| --- | --- |
| `login.html` | Register or come back with the same email |
| `app.html` | Dashboard: continue learning, courses, certificates |
| `course.html?c=<id>` | Course overview and syllabus |
| `lesson.html?c=<id>&l=<lesson>` | Interactive lesson player; `&exam=1` runs the final assessment |
| `certificate.html?c=<id>` | Certificate with ID, PDF download and LinkedIn link |
| `privacy.html` | Privacy notice |

Each course is data in `assets/courses/<id>.js`; lessons are lists of steps documented in `docs/STEP-TYPES.md`. Check them with `node tools/validate-courses.js`.

Payments: `functions/api/checkout.js` opens Stripe Checkout and `functions/api/confirm.js` records the purchase in D1 (`purchases`). Until the Pages secret `STRIPE_SECRET_KEY` is set, the buy button records interest in the `interest` table and tells the buyer payments open soon.

**Backend:** Cloudflare Pages with one function (`functions/api/register.js`) writing to a D1 database (`db/schema.sql`). Live at https://gambit-7w4.pages.dev. Deploy with `./deploy.sh`, export the list with `./export-signups.sh` (add `--consented` for marketing-ready emails only). Lesson progress and certificates are still stored in the learner's browser.

## How changes go live

Every push to GitHub deploys automatically to Cloudflare Pages (`.github/workflows/deploy.yml`):

- **Push to `main`:** goes live on https://gambitschool.com within about a minute.
- **Push to any other branch:** gets its own preview at `https://<branch>.gambit-7w4.pages.dev`, kept out of search engines. Use a branch and a pull request for anything you want checked before it's live.

The run and its URL show under the repo's **Actions** tab. No Cloudflare account is needed to contribute.

After editing CSS or JS in `assets/`, bump the `?v=` number on the asset links in the HTML pages so browsers fetch the new version.

Working on the site with someone else? See [CONTRIBUTING.md](CONTRIBUTING.md).
