#!/bin/bash
# Build the static site into dist/ and deploy it, with functions/, to Cloudflare Pages.
set -euo pipefail
cd "$(dirname "$0")"
rm -rf dist && mkdir -p dist/assets
cp index.html login.html app.html course.html lesson.html certificate.html privacy.html robots.txt site.webmanifest \
   favicon.ico favicon.svg favicon-32.png apple-touch-icon.png icon-192.png icon-512.png og-image.png dist/
cp assets/*.css assets/*.js dist/assets/
# Sitemap: indexable pages only, lastmod from the file's last commit
# uncommitted edits count as today; otherwise the date of the last commit touching the file
lastmod() { if [ -n "$(git status --porcelain -- "$1")" ]; then date +%F; else d=$(git log -1 --format=%cs -- "$1"); echo "${d:-$(date +%F)}"; fi; }
{
  echo '<?xml version="1.0" encoding="UTF-8"?>'
  echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
  echo "  <url><loc>https://gambitschool.com/</loc><lastmod>$(lastmod index.html)</lastmod></url>"
  echo '</urlset>'
} > dist/sitemap.xml
[ "${1:-}" = "--build" ] && exit 0
# DEPLOY_BRANCH is set by the GitHub workflow; local runs deploy main (live)
npx --yes wrangler@3 pages deploy dist --project-name gambit --branch "${DEPLOY_BRANCH:-main}" --commit-dirty=true
