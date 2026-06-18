#!/bin/sh
# Run from project root: sh scripts/install-hooks.sh

HOOKS_DIR=".git/hooks"

install_hook() {
  local name="$1"
  local body="$2"
  printf '#!/bin/sh\n%s\n' "$body" > "$HOOKS_DIR/$name"
  chmod +x "$HOOKS_DIR/$name"
  echo "installed: $HOOKS_DIR/$name"
}

# ── hooks ────────────────────────────────────────────────────────────────────

install_hook "pre-commit" "
  git diff --cached --name-only --diff-filter=ACM | xargs pnpm prettier --write --ignore-unknown
"

install_hook "pre-push" "
  git diff --cached --name-only --diff-filter=ACM | xargs pnpm prettier --write --ignore-unknown
"

# ─────────────────────────────────────────────────────────────────────────────
echo "done."
