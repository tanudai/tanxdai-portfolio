#!/bin/bash
# Render service films one at a time (fanless laptop friendly).
#   ./render.sh 01            → out/01.mp4
#   ./render.sh 01 09 14      → several, sequentially
#   ./render.sh all           → all 18
#   ./render.sh still 01 5000 → out/01-t5000.png (frame at t ms, for parity checks)
set -euo pipefail
cd "$(dirname "$0")"
if [ "${1:-}" = "still" ]; then
  frame=$(( ${3:-5000} * 30 / 1000 ))
  npx remotion still src/index.jsx "film-$2" "out/$2-t${3:-5000}.png" --frame="$frame"
  exit 0
fi
ids=("$@")
[ "${1:-}" = "all" ] && ids=(01 02 03 04 05 06 07 08 09 10 11 12 13 14 15 16 17 18)
for id in "${ids[@]}"; do
  start=$(date +%s)
  npx remotion render src/index.jsx "film-$id" "out/$id.mp4" --codec=h264 --crf=20
  echo "film $id rendered in $(( $(date +%s) - start ))s"
done
