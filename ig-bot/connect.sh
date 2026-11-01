#!/bin/bash
# Connects the bot to @hayekyeah and its Facebook Page. Run after copying a token from the Graph API Explorer (README step 2):
#   bash ig-bot/connect.sh
# Swaps the copied token (read from the clipboard) for a long-lived one, finds the Facebook Page linked to @hayekyeah,
# stores the Page token as the worker secret and in ~/.config/hayekyeah/page-token (never printed), writes the Instagram
# account ID and Page ID into wrangler.toml, and redeploys. Needs the worker to exist already (README step 1).
set -euo pipefail
cd "$(dirname "$0")"
CONF=~/.config/hayekyeah
mkdir -p "$CONF" && chmod 700 "$CONF"
# the shared "Aigent Mode DM" Meta app; its secret lives with the Aigent Mode config
APP=1544078744194708; S=$(cat ~/.config/aigentmode/meta-app-secret); U=$(pbpaste)
[ -n "$U" ] || { echo "Clipboard is empty: copy the token from the Graph API Explorer first."; exit 1; }
L=$(curl -s -G https://graph.facebook.com/v26.0/oauth/access_token --data-urlencode grant_type=fb_exchange_token \
  --data-urlencode client_id=$APP --data-urlencode client_secret="$S" --data-urlencode fb_exchange_token="$U" \
  | python3 -c "
import json,sys
d=json.load(sys.stdin)
if 'access_token' not in d: sys.exit('Token swap failed: ' + d.get('error',{}).get('message','unknown error') + ' (copy a fresh token and try again)')
print(d['access_token'])")
PAGE=$(curl -sg -H "Authorization: Bearer $L" "https://graph.facebook.com/v26.0/me/accounts?fields=name,access_token,instagram_business_account{id,username}&limit=50" \
  | python3 -c "
import json,sys
for p in json.load(sys.stdin).get('data',[]):
  ig=p.get('instagram_business_account') or {}
  if ig.get('username','').lower()=='hayekyeah': print(ig['id'], p['id'], p['access_token']); break
else: sys.exit('No Page linked to @hayekyeah found. Check that @hayekyeah is linked to the Page and that the pop-up allowed both (README step 2).')")
IG=${PAGE%% *}; REST=${PAGE#* }; PAGE_ID=${REST%% *}; TOKEN=${REST#* }
sed -i '' "s/^IG_ACCOUNT_ID = .*/IG_ACCOUNT_ID = \"$IG\"/" wrangler.toml
# the Facebook Page the bot may act as (fb.js refuses to post or reply as anything else)
sed -i '' "s/^FB_PAGE_ID = .*/FB_PAGE_ID = \"$PAGE_ID\"/" wrangler.toml
( umask 077; printf '%s' "$TOKEN" > "$CONF/page-token" )
printf '%s' "$TOKEN" | npx wrangler@3 secret put IG_ACCESS_TOKEN >/dev/null
# the key for /stats, /queue and /check; kept if it already exists so schedule.mjs keeps working
[ -s "$CONF/ig-stats-key" ] || ( umask 077; openssl rand -hex 16 | tr -d '\n' > "$CONF/ig-stats-key" )
npx wrangler@3 secret put STATS_KEY < "$CONF/ig-stats-key" >/dev/null
npx wrangler@3 deploy >/dev/null
echo "Connected: Instagram account $IG, Facebook Page $PAGE_ID. Health: $(curl -s https://hayek-ig-bot.ayrat-mak.workers.dev/health)"
