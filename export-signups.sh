#!/bin/bash
# Export Gambit sign-ups to signups.csv. Pass --consented to export only people who opted in to marketing emails.
set -euo pipefail
cd "$(dirname "$0")"
where=""; [ "${1:-}" = "--consented" ] && where="WHERE marketing_consent = 1"
npx --yes wrangler@3 d1 execute gambit --remote --json --command "SELECT email, name, marketing_consent, consent_at, created_at, last_seen_at, visits FROM signups $where ORDER BY created_at" \
 | python3 -c 'import json,sys,csv; rows=json.load(sys.stdin)[0]["results"]; w=csv.writer(open("signups.csv","w",newline="")); w.writerow(["email","name","marketing_consent","consent_at","created_at","last_seen_at","visits"]); [w.writerow([r[k] for k in ["email","name","marketing_consent","consent_at","created_at","last_seen_at","visits"]]) for r in rows]; print(f"{len(rows)} sign-ups written to signups.csv")'
