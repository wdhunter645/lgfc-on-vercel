#!/usr/bin/env bash
set -euo pipefail

# Requires a Codespaces/User secret named GH_PAT (fine-grained PAT with repo + actions:write)
: "${GH_PAT:?ERROR: GH_PAT not set. In GitHub → Settings → Codespaces → Secrets, create GH_PAT.}"

# Always replace any ephemeral token with your PAT
gh auth logout -h github.com -y >/dev/null 2>&1 || true
printf '%s\n' "$GH_PAT" | gh auth login --hostname github.com --with-token >/dev/null

# Minimal sanity check: can we read the repo? (quiet failure prints a clear error)
gh repo view >/dev/null || { echo "ERROR: gh repo view failed. Check PAT scopes."; exit 1; }
