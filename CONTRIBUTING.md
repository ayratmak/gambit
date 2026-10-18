# Working on Gambit

Gambit is a plain static website: HTML, CSS and JavaScript files, no framework and no build step. Live at **https://gambitschool.com**. Every push to GitHub deploys automatically, so you never need a Cloudflare account.

## 1. Get set up (once)

1. Accept the invite: GitHub emails it to you, or open https://github.com/ayratmak/gambit/invitations.
2. Clone the repo and run it on your machine:

   ```bash
   git clone https://github.com/ayratmak/gambit.git
   cd gambit
   python3 -m http.server 8000
   ```

3. Open http://localhost:8000. Edit any file, refresh the browser, and you see the change. Nothing goes live until you push.

**Heads-up on sign-ups:** registering on your local copy writes a real row to the live sign-up database. Use your own email, and untick the "email me" box.

## 2. How changes go live

| You push to... | What happens | Where to see it |
|---|---|---|
| a branch, e.g. `new-lesson` | Deploys a private preview, hidden from Google | `https://new-lesson.gambit-7w4.pages.dev` |
| `main` | Goes live on gambitschool.com in about a minute | https://gambitschool.com |

The default way to work:

```bash
git checkout -b new-lesson        # start a branch
# ...edit, check on localhost...
git add -A && git commit -m "Add lesson on bargaining"
git push -u origin new-lesson     # preview URL appears in the Actions tab
```

Then open a pull request on GitHub. Merging it into `main` publishes it. Small fixes like typos can go straight to `main`.

To see whether a deploy worked, open the repo's **Actions** tab. Green means done, and the run summary shows the URL. If it's red, open the run and read the error, or send it to Ayrat.

## 3. Where things live

| File | What it is |
|---|---|
| `index.html` | The landing page at gambitschool.com |
| `login.html` | Registration (name, email, optional emails opt-in) |
| `app.html` | Dashboard after signing in |
| `course.html` | One course: overview and syllabus |
| `lesson.html` | The lesson player, and the final assessment |
| `certificate.html` | The certificate page |
| `privacy.html` | Privacy notice |
| `assets/data.js` | **All course and lesson content.** This is where most of the work happens |
| `assets/core.js` | Shared code: the chess piece drawings, the free/paid switch, sign-up calls |
| `assets/app.css` | Shared styles and colours for the app pages |
| `functions/api/register.js` | The sign-up API. It stores people's names and emails, so check with Ayrat before changing it |
| `.github/workflows/deploy.yml` | The automatic deploy. Don't change it without asking |
| `docs/seo/` | SEO plan, keywords and the process for new public pages |

## 4. Adding or editing lessons

Courses and lessons are plain data in `assets/data.js`, not code. Each lesson is a list of **steps** the player turns into screens:

| Step type | What it shows |
|---|---|
| `read` | A title and a few short paragraphs, with an optional payoff table |
| `choice` | A multiple-choice question. Each option has an explanation; mark the right one with `ok: true` |
| `sort` | Sort items into two buckets ("A game" / "Not a game") |
| `matrix` | A clickable payoff table: `task: 'explore'` to read cells, `task: 'nash'` to find equilibria (worked out automatically) |
| `repeated` | Play several rounds against tit-for-tat |
| `summary` | Three key takeaways at the end |

The easiest way to start is to copy an existing lesson in "Game theory foundations" and change the words. A course appears as "In production" until its lessons have `steps`. The final assessment is the `exam` block at the end of a course.

## 5. A few rules

- **Bump the version after CSS or JS changes.** Browsers cache old files. When you change anything in `assets/`, raise the `?v=` number on the asset links in every HTML page, e.g. `app.css?v=4` becomes `app.css?v=5`.
- **Check it on your phone too.** Every page has to work at phone width.
- **Search engine settings belong to Ayrat.** Don't change `robots.txt`, the `noindex` tags or the canonical links without asking. They decide what Google sees.
- **No secrets in the repo.** It's public. Never commit passwords, API keys or the sign-up list.
- **Courses are free for now.** Don't flip `FREE` in `assets/core.js`; paid courses aren't switched on yet.
