# @hayekyeah comment-to-DM bot and Reel scheduler

Someone comments **GAME THEORY** on a post or reel on @hayekyeah or the hayekyeah Facebook Page, and within about a
minute they get one DM with the free guide (the free interactive game theory course at gambitschool.com/free), plus a
short public "Sent! Check your DMs 📘" reply under their comment. It also queues finished videos as Reels on both, at the
minute you pick.

Same design as the live Cornerlot bot (`cphq-ig-bot`) and the @aigentmode one: a Cloudflare Worker (`hayek-ig-bot`) polls
Instagram and Facebook every minute, and D1 `hayek-ig` remembers who already got the link (one DM per person per post).
No ManyChat, nothing to pay.

## What triggers a DM

- **"game theory" anywhere in the comment**, any case, with a space, a hyphen or nothing between the words: "Game theory
  please", "GAMETHEORY", "game-theory", "#gametheory" all count.
- **"guide" or "course" as whole words**, any case: "guide!", "the course pls". Not "guided", "courses" or "coursework".
- **"of course" is ignored**, so "of course he lost" sends nothing.
- **One DM per person per post.** A second matching comment from the same person on the same post gets nothing. Comments
  older than 7 days, and the account's own comments, are skipped.

The DM link is `https://gambitschool.com/free?utm_source=instagram|facebook&utm_medium=dm&utm_campaign=<slug>`. The slug
is the video's name when it went out through `schedule.mjs` (e.g. `twenty-pound-auction`), otherwise the post ID.

Wording and keywords: `src/copy.js`. Change it, run `node test.mjs`, then `npx wrangler@3 deploy` from `ig-bot/`.

## Steps only Ayrat can do (once)

Run everything from the repo root unless it says `cd ig-bot`.

**0. Check the accounts.** @hayekyeah must be a Professional (Creator or Business) account, linked to the hayekyeah
Facebook Page (Instagram → Settings → Accounts Center, or Page settings → Linked accounts → Instagram). In the Instagram
app, also turn on Settings → Messages and story replies → Message controls → Connected tools → **Allow access to
messages**, or the API can't send DMs.

**1. Create the Cloudflare pieces and deploy** (approve each command):

    cd ig-bot
    npx wrangler@3 d1 create hayek-ig
    # paste the database_id it prints into wrangler.toml, replacing PLACEHOLDER-run-wrangler-d1-create-hayek-ig
    npx wrangler@3 d1 execute hayek-ig --remote --file=schema.sql
    npx wrangler@3 r2 bucket create hayek-media
    npx wrangler@3 deploy

The deploy is harmless before step 3: with no token and no account IDs the bot does nothing.
`https://hayek-ig-bot.ayrat-mak.workers.dev/health` answers "no token yet: run connect.sh". Commit the wrangler.toml change.

**2. Get a token.** Open developers.facebook.com/tools/explorer/1544078744194708/ (the existing "Aigent Mode DM" app,
reused). Under Permissions add:

- `pages_show_list`, `pages_read_engagement`, `business_management`
- `instagram_basic`, `instagram_manage_comments`, `instagram_manage_messages`, `instagram_content_publish`
- `pages_manage_posts`, `pages_read_user_content`, `pages_manage_engagement`, `pages_messaging` (the Facebook side)

Click **Generate Access Token**. In the pop-up, tick the **hayekyeah Facebook Page** and the **@hayekyeah Instagram
account**. **Keep every Page and account that's already ticked ticked** (Aigent Mode, Cornerlot / x.how.money.works,
Everyone To Mars): unticking one can cut off its bot. Copy the token.

**3. Connect.** With the token still on the clipboard:

    bash ig-bot/connect.sh

It prints "Connected: Instagram account …, Facebook Page …" and `{"ok":true,...,"page_matches":true}`. It writes the two
IDs into `ig-bot/wrangler.toml` (commit that), stores the Page token as the worker secret and in
`~/.config/hayekyeah/page-token`, and the stats key in `~/.config/hayekyeah/ig-stats-key`. Nothing is printed.

**4. Test.** From an account that isn't @hayekyeah (ideally one with no role on the Meta app), comment "game theory" on
a recent post, on Instagram and on Facebook. The DM and the public reply arrive within a minute or two.

## Checks

- Token health: https://hayek-ig-bot.ayrat-mak.workers.dev/health
- DMs per post: `curl "https://hayek-ig-bot.ayrat-mak.workers.dev/stats?key=$(cat ~/.config/hayekyeah/ig-stats-key)"`
- What Instagram shows the bot: `.../check?key=...`. Can the token publish Reels: `.../probe?key=...`.
- Logs: `cd ig-bot && npx wrangler@3 tail`
- The Page token doesn't expire, but stops if your Facebook password changes or the app loses the Page. Then redo steps 2-3.

## Scheduled Reels

Instagram's API publishes Reels but can't schedule them, so the worker keeps its own queue (`src/publish.js`, D1 table
`ig_queue`, files in the R2 bucket `hayek-media`, served at `/media/<key>`). About 15 minutes before the time it creates
the Instagram Reel container and publishes on the minute. Facebook gets the reel about 20 minutes early as a scheduled
post, with cover.jpg as its thumbnail. On both, the pinned-comment text goes up as the first comment once the post is
live (pinning stays manual in the app).

Give it a final folder (video.mp4, cover.jpg, post.md) and a time. The caption is post.md's "## Description (paste as
is)" section, and the first comment is its "## Pinned comment".

    node ig-bot/schedule.mjs "final/2026-11-07 ticket-touts" "2026-11-07 18:00 UK" --dry-run   # check, upload nothing
    node ig-bot/schedule.mjs "final/2026-11-07 ticket-touts" "2026-11-07 18:00 UK"             # Instagram and Facebook
    node ig-bot/schedule.mjs ticket-touts "2026-11-07 18:00 UK" --ig-only                      # finds the folder by slug
    node ig-bot/schedule.mjs list
    node ig-bot/schedule.mjs cancel ticket-touts        # Instagram; fb:ticket-touts for Facebook
    node ig-bot/schedule.mjs cover fb:ticket-touts      # re-apply the cover to a Facebook reel that went out without it

Run it from the checkout that holds `final/` (it isn't in git). Times take `UK`, `ET` or `UTC`, and British Summer Time
is handled. Without a final folder it falls back to `video/out/<slug>.mp4` and `video/out/<slug>-cover.jpg`, but it still
needs a post.md, so pass the folder. Re-running for the same slug replaces a queued, failed or cancelled entry.

## Files

- `src/index.js`: Instagram comment poll, `/health`, `/stats`, `/check`, `/probe`.
- `src/fb.js`: Facebook comment poll and Facebook reel publishing.
- `src/publish.js`: the Reel queue, `/media`, `/queue`.
- `src/match.js`: keyword matching and the tracked link. `src/copy.js`: wording.
- `schedule.mjs`, `connect.sh`, `schema.sql`, `test.mjs` (offline, fakes Meta and Cloudflare: `node ig-bot/test.mjs`).
