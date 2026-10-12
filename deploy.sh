#!/bin/bash
# Build the static site into dist/ and deploy it, with functions/, to Cloudflare Pages.
set -euo pipefail
cd "$(dirname "$0")"
rm -rf dist && mkdir -p dist/assets
cp index.html login.html app.html course.html lesson.html certificate.html privacy.html robots.txt dist/
cp assets/*.css assets/*.js dist/assets/
npx --yes wrangler@3 pages deploy dist --project-name gambit --branch main --commit-dirty=true
