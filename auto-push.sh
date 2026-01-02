#!/bin/bash
set -e

cd "$(dirname "$0")" || exit 1
echo "Watching... Ctrl+C to stop"

# כמה לחכות אחרי אירוע שמירה, כדי להבטיח שהקובץ נכתב עד הסוף
DELAY=1.0

fswatch -o style.css script.js hidden.css | while read -r _; do
  sleep "$DELAY"

  git add -A

  # אין שינוי אמיתי? לא דוחפים
  if git diff --cached --quiet; then
    continue
  fi

  git commit -m "auto: save" >/dev/null 2>&1 || true

  # תן ל-git רגע, ואז דחוף
  git push >/dev/null 2>&1 || true

  echo "Pushed."
done
