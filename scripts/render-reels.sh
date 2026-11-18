#!/usr/bin/env bash
# Renders every Reel into social/reels/ (npm run render:reels).
# Set BROWSER=/path/to/chrome-headless-shell if Remotion can't download its own.
set -euo pipefail
cd "$(dirname "$0")/.."
OUT=social/reels
FLAGS=(--codec=h264 --pixel-format=yuv420p --log=error)
[ -n "${BROWSER:-}" ] && FLAGS+=(--browser-executable="$BROWSER")

render() { echo "-> $2"; npx remotion render "$1" "$OUT/$2.mp4" "${FLAGS[@]}" "${@:3}"; }

# Website launch announcement, and the shorter website Reel
render LaunchReel website-launch
render LaunchReel website-launch-facebook --props='{"cta":"Shop at the link below"}'
render SiteReel website

# Card reels from website photos (one per entry in src/Social/cards.ts)
for slug in $(node -e 'const s=require("fs").readFileSync("src/Social/cards.ts","utf8");for(const m of s.matchAll(/slug: "([^"]+)"/g))console.log(m[1])'); do
  render "Card-$slug" "card-$slug"
done

# Original mockup reels, now ending on the website address
while IFS='|' read -r name title; do
  props=$(node -e 'console.log(JSON.stringify({title:process.argv[1],photo:`products/${process.argv[2]}.jpg`,video:`products/${process.argv[2]}.mp4`,shop:"elderberrieblue.com"}))' "$title" "$name")
  render ProductReel "$name" --props="$props"
done <<'LIST'
berry|A berry happy birthday
daisy|The happiest of birthdays
duck-teacher|Thank you, teacher
jam|You're my jam
quacking|Have a quacking birthday
ray|To a ray of sunshine
stork|Welcome, little one
sweet-baby|Welcome, sweet baby
teacher|For the best teacher
LIST
