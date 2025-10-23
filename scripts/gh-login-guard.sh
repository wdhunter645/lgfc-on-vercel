#!/usr/bin/env bash
set -euo pipefail

# Use the PAT from your Codespaces/User secret
# The secret must be named GITHUB_TOKEN and set in
# GitHub → Settings → Codespaces → Secrets → New secret → Name: GITHUB_TOKEN
: "${GITHUB_TOKEN:?ERROR: GITHUB_TOKEN not set. Add it as a Codespaces Secret.}"

# Logout the ephemeral token and log in using your PAT
gh auth logout -h github.com -y >/dev/null 2>&1 || true
echo "$GITHUB_TOKEN" | gh auth login --hostname github.com --with-token >/dev/null

echo "✅ Authenticated with account-level PAT for GitHub CLI"
