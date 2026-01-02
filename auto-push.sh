#!/bin/bash
cd "$(dirname "$0")" || exit 1
echo "Watching style.css / script.js / hidden.css... (Ctrl+C to stop)"

fswatch -o style.css script.js hidden.css | while read -r _; do
  git add -A
  if git diff --cached --quiet; then
    continue
  fi
  git commit -m "auto update" >/dev/null 2>&1 || true
  git push >/dev/null 2>&1 || true
  echo "Pushed."
done
