#!/usr/bin/env bash
set -e

REPO="wdhunter645/lgfc-on-vercel"
ENV_FILE=".env"

# require gh login
gh auth status >/dev/null 2>&1 || { echo "ERROR: gh not logged in. Run: gh auth login"; exit 1; }
# require .env
[ -f "$ENV_FILE" ] || { echo "ERROR: .env not found"; exit 1; }

# read .env, ignore blanks/comments, handle export, strip quotes, strip CR
while IFS= read -r raw || [ -n "$raw" ]; do
  [ -z "$raw" ] && continue
  case "$raw" in \#*) continue;; esac
  line="${raw#export }"
  key="${line%%=*}"
  val="${line#*=}"

  # trim CR
  val="${val%$'\r'}"

  # strip surrounding double quotes
  if [ "${val#\"}" != "$val" ] && [ "${val%\"}" != "$val" ]; then
    val="${val#\"}"; val="${val%\"}"
  fi
  # strip surrounding single quotes
  if [ "${val#\'}" != "$val" ] && [ "${val%\'}" != "$val" ]; then
    val="${val#\'}"; val="${val%\'}"
  fi

  [ -z "$key" ] && continue
  printf %s "$val" | gh secret set "$key" --repo "$REPO" --app actions --body-file - >/dev/null
  echo "set $key"
done < <(tr -d '\r' < "$ENV_FILE")

echo "done"
