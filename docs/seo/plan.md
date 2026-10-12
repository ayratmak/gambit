# SEO plan: gambitschool.com   Written 2026-10-12   Review weekly

Status: new domain (registered 12 Oct 2026), no Search Console data. Expect little Google traffic for about six months. Single locale (en-GB) on a .com, so no country-code caveat.

The structural problem to solve first: only the landing page is public. Every course, lesson and game sits behind the login redirect, so Google sees one page. SEO growth needs public, static pages that carry real content and an interactive element, each with a sign-up CTA.

## Weeks 1-2: foundations
- Technical fixes from the audit: built and verified locally, awaiting approval to deploy (indexing switch on the live site)
- Search Console: add the domain property for gambitschool.com, verify via Cloudflare DNS, submit https://gambitschool.com/sitemap.xml [Ayrat]
- Analytics: switch on Cloudflare Web Analytics for gambitschool.com so sign-ups per landing page can be measured [Ayrat or Claude with approval]
- Template page: the Nash equilibrium calculator, built first and approved, becomes the template for every tool page

## Weeks 2-4: reference pages (one per pattern, by hand)
| Order | Page | Pattern | Why first | Original element |
|---|---|---|---|---|
| 1 | /nash-equilibrium-calculator | concept calculator | Specific tool queries in Suggest (2x2, 3x3, mixed); the solver already exists in the lesson engine | Working 2x2/3x3 solver with best-response highlighting and a plain-English explanation of the result |
| 2 | /prisoners-dilemma-game | classic game online | "play online / free" variants in Suggest; the repeated game already exists | Playable 8-round game against named strategies (tit-for-tat, always defect, grudger) with a debrief |
| 3 | /courses/game-theory-foundations | topic course free with certificate | Public version of the one finished course: syllabus, outcomes, sample lesson, certificate preview | Embedded free first lesson, playable without sign-up |

## Weeks 4-8: cadence
- 1 page a week, never more than 1 a day: next row in each pattern (3x3 solver variant, mixed-strategy calculator, then other classic games: chicken, stag hunt, ultimatum)
- Internal links: 5+ in-body links to each new page on publish (landing, course pages, related tools)
- Each tool page ends with "learn this properly: free course with certificate" to turn visitors into sign-ups

## Later, gated
- Fix what exists: once 90 days of Search Console data exist (mid-January 2027 at the earliest)
- Links: free tiers (university course pages, game theory resource lists, teacher forums) from month 4, on pages that have had 3 months
- GEO: from month three, fan-out on "best free game theory course 2027" and listicles
- Weekly review: every Monday, once Search Console has data
- GitHub Pages duplicate at ayratmak.github.io/gambit: canonical points to gambitschool.com; consider switching it off
