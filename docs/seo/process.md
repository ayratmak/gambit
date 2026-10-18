# SEO process: read before every page

Site: gambitschool.com   Locales: en-GB only   Template page: none yet. The first tool page (Nash equilibrium calculator) becomes the template once Ayrat approves it.

- Build on the template page. Never invent a layout. Same design, title pattern, meta description, H1, FAQ block, interactive element and CTA placement.
- Read the brief in docs/seo/briefs/<slug>.md first. No brief, no page.
- One H1 with the primary keyword. Title (about 60 chars) and meta description (150-160) from the brief.
- Every page has one original element the other results lack: a working game, solver or simulator built on the lesson engine (assets/data.js step types). No original element, no page.
- Public SEO pages are plain static HTML with the content in the markup (visible to curl), not behind the login redirect.
- Add at least 5 internal links to the new page, inside body text of related pages. Anchors match the new page's target keyword. Nav and footer do not count.
- Single locale (en-GB): set html lang="en-GB", self-referencing absolute canonical on https://gambitschool.com, no hreflang needed until a second language exists.
- Add only the structured data that matches what is visible on the page (Organization/WebSite on home; FAQPage only with a visible FAQ; Course only on a public course page).
- Add the URL to the sitemap list in deploy.sh and check it appears in https://gambitschool.com/sitemap.xml after deploy.
- Run the diff gate before publishing: list every element in the old or reference version missing from the new one.
- Publish only after Ayrat says yes. Work in the working tree, deploy with ./deploy.sh only after approval.
- After publishing: request indexing in Search Console by hand, add a line to docs/seo/log.md.
- Cadence: 1 page a week, never more than 1 a day. Hold it, do not burst.
- Bump the ?v= query on asset links when CSS/JS changes.
- Read docs/seo/standards.md before every draft. Those are past rejections; do not repeat them.
- Course pages (/courses/<slug>) are generated at build by tools/build-course-pages.js from assets/courses/*.js. Change titles, descriptions and the "about" copy in tools/course-pages.config.js; lesson titles and teasers come from the course data. They are the template for any future catalogue page.
