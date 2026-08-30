#!/bin/bash
# Regenerates everything under public/assets from the design handoff bundle.
#
#   ./scripts/optimize-assets.sh /path/to/design_handoff_showa_lp
#
# Requires: ffmpeg, cwebp (brew install ffmpeg webp), sips (macOS built-in).
# The handoff ships ~37MB of 1080p video and a 3.9MB comp crop; this reduces the
# set to ~5MB while keeping the rendered sizes the layout actually asks for.
set -euo pipefail

SRC="${1:?usage: optimize-assets.sh <path to design_handoff_showa_lp>}/assets"
OUT="$(cd "$(dirname "$0")/.." && pwd)/public/assets"
mkdir -p "$OUT"/{video,brand,about,works,icons}

# ---------- video ----------
# Decorative loops: audio stripped, downscaled, plus a WebM and a poster frame.
encode_video () {
  local name=$1 width=$2 height=$3 crf=$4 vpxcrf=$5
  echo "video: $name (${width}x${height})"

  ffmpeg -y -v error -i "$SRC/video/$name.mp4" \
    -an -vf "scale=${width}:${height}:flags=lanczos" \
    -c:v libx264 -profile:v high -pix_fmt yuv420p \
    -crf "$crf" -preset slow -movflags +faststart -g 60 \
    "$OUT/video/$name.mp4"

  ffmpeg -y -v error -i "$SRC/video/$name.mp4" \
    -an -vf "scale=${width}:${height}:flags=lanczos" \
    -c:v libvpx-vp9 -crf "$vpxcrf" -b:v 0 -row-mt 1 -cpu-used 2 -deadline good \
    "$OUT/video/$name.webm"

  ffmpeg -y -v error -i "$SRC/video/$name.mp4" \
    -vf "scale=${width}:${height}:flags=lanczos" -frames:v 1 -q:v 7 \
    "$OUT/video/$name-poster.jpg"
}

encode_video material-a 1600 900 30 44  # TOP hero, full-bleed
encode_video material-b 1600 900 30 34  # NETWORK band + one WORKS tile
encode_video material-c 1280 720 31 35  # WORKS tile only

# ---------- images ----------
# Widths are 2x the largest size the layout renders each asset at.
# WebP for every asset, plus a resized fallback in its original format.
convert_png () {
  local rel=$1 dest=$2 width=$3 q=$4
  echo "image: $rel (${width}px)"
  cwebp -quiet -q "$q" -resize "$width" 0 "$SRC/$rel" -o "$OUT/$dest.webp"
  cp "$SRC/$rel" "$OUT/$dest.png"
  sips --resampleWidth "$width" "$OUT/$dest.png" --out "$OUT/$dest.png" >/dev/null
}

convert_png about/about-statement.png about/about-statement 2000 84  # max-width 1000px
convert_png works/japan-map.png       works/japan-map       760  88  # max-width 380px
convert_png brand/lockup.png          brand/lockup          456  92  # header, max 152px
convert_png brand/lockup-white.png    brand/lockup-white    840  92  # NETWORK, 420px

for icon in offset-printing sheetfed-printing on-demand prepress bookbinding; do
  convert_png "icons/$icon.png" "icons/$icon" 440 90  # rendered up to 220px
done

# The one work photo is opaque, so its fallback is JPEG rather than a 1.7MB PNG.
convert_png works/works-center.png works/works-center 1800 82
sips -s format jpeg -s formatOptions 82 "$OUT/works/works-center.png" \
  --out "$OUT/works/works-center.jpg" >/dev/null
rm "$OUT/works/works-center.png"

cp "$SRC/brand/logo.svg" "$OUT/brand/logo.svg"  # favicon / OG

echo
echo "done — $(du -sh "$OUT" | cut -f1) total"
