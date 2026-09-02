#!/bin/bash
# Regenerates everything under public/assets from the design handoff bundle.
#
#   ./scripts/optimize-assets.sh /path/to/design_handoff_showa_lp [popup-material-dir]
#
# Requires: ffmpeg, cwebp (brew install ffmpeg webp), sips (macOS built-in).
# The handoff ships ~37MB of 1080p video and a 3.9MB comp crop; this reduces the
# set to ~5MB while keeping the rendered sizes the layout actually asks for.
set -euo pipefail

SRC="${1:?usage: optimize-assets.sh <path to design_handoff_showa_lp> [popup-material-dir]}/assets"
POPUP_SRC="${2:-}"
NETWORK_COMP="${3:-}"
OUT="$(cd "$(dirname "$0")/.." && pwd)/public/assets"
mkdir -p "$OUT"/{video,brand,about,works,icons,service,network}

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
encode_video material-b 1600 900 30 34  # NETWORK band
# material-c is unreferenced since the WORKS strip moved to the client's own
# photography. Re-add an encode_video line here if a video tile returns.

# ---------- images ----------
# Widths are 2x the largest size the layout renders each asset at.
# WebP for every asset, plus a resized fallback in its original format.
# Not every asset came from the handoff zip — mail-circle arrived with the
# CONTACT/RECRUIT drop and the WORKS photos in a folder of their own. Skip what
# this bundle does not carry rather than clobbering an already-built file.
convert_png () {
  local rel=$1 dest=$2 width=$3 q=$4
  if [ ! -f "$SRC/$rel" ]; then
    echo "skip:  $rel (not in this bundle)"
    return
  fi
  echo "image: $rel (${width}px)"
  cwebp -quiet -q "$q" -resize "$width" 0 "$SRC/$rel" -o "$OUT/$dest.webp"
  cp "$SRC/$rel" "$OUT/$dest.png"
  sips --resampleWidth "$width" "$OUT/$dest.png" --out "$OUT/$dest.png" >/dev/null
}

convert_png about/about-statement.png about/about-statement 2000 84  # max-width 1000px
# works/japan-map.png is superseded by the annotated map lifted out of 拠点.jpg
# below — the handoff's plain outline is no longer placed anywhere.

# WORKS strip. These come from the client's 昭和美術印刷LP＿ワークス＿JPG folder
# rather than the handoff bundle, so point $1 at whichever holds them.
for work in oshigoto-book ski-jam europe-ken tamuraya; do
  if [ -f "$SRC/works/$work.jpg" ]; then
    echo "image: works/$work.jpg (1600px)"
    cwebp -quiet -q 82 -resize 1600 0 "$SRC/works/$work.jpg" -o "$OUT/works/$work.webp"
    sips -s format jpeg -s formatOptions 82 --resampleWidth 1600 \
      "$SRC/works/$work.jpg" --out "$OUT/works/$work.jpg" >/dev/null
  fi
done
convert_png brand/lockup.png          brand/lockup          456  92  # header, max 152px
convert_png brand/lockup-white.png    brand/lockup-white    840  92  # NETWORK, 420px

for icon in offset-printing sheetfed-printing on-demand prepress bookbinding; do
  convert_png "icons/$icon.png" "icons/$icon" 640 90  # rendered up to 300px
done

# CONTACT / RECRUIT mail button, rendered up to 132px
convert_png icons/mail-circle.png icons/mail-circle 264 90

cp "$SRC/brand/logo.svg" "$OUT/brand/logo.svg"  # favicon / OG

# ---------- SERVICE popups ----------
# The client's popup material ships each panel as one flat composite: the photo
# with the vertical title and body copy already burnt into it. Only the photo is
# taken here — the copy is set as live text in ServiceModal.astro so it stays
# legible on a phone, selectable, and readable by a screen reader.
#
# Every composite places the photo at the same 3432x1974 box, give or take a
# pixel of anti-aliasing, so one crop rectangle with a small inset serves all
# five. The 3px inset trims the seam; --popup-photo-ratio must match the result.
if [ -n "$POPUP_SRC" ]; then
  crop_popup () {
    local file=$1 dest=$2 x=$3 y=$4
    echo "popup: $dest"
    ffmpeg -y -v error -i "$POPUP_SRC/$file" \
      -vf "crop=3426:1968:$((x + 3)):$((y + 3)),scale=1720:-2:flags=lanczos" \
      "$OUT/service/$dest.png"
    cwebp -quiet -q 82 "$OUT/service/$dest.png" -o "$OUT/service/$dest.webp"
    sips -s format jpeg -s formatOptions 82 \
      "$OUT/service/$dest.png" --out "$OUT/service/$dest.jpg" >/dev/null
    rm "$OUT/service/$dest.png"
  }

  crop_popup "昭和美術印刷アイコン＿オフリン印刷_POPUP.png"  offset-printing   292 806
  crop_popup "昭和美術印刷アイコン＿枚葉印刷_POPUP.png"      sheetfed-printing 299 805
  crop_popup "昭和美術印刷アイコン＿オンデマンド_POPUP.png"  on-demand         298 805
  crop_popup "昭和美術印刷アイコン＿プリプレス_POPUP.png"    prepress          298 805
  crop_popup "昭和美術印刷アイコン＿製本折加工_POPUP.png"    bookbinding       292 805

  # The close glyph, cropped out of its hit-area padding. 設備一覧ボタン.png is
  # not used: it is the brand's underlined text link, which already exists as the
  # LinkButton component, so it is set as text rather than shipped as a picture.
  echo "popup: close glyph"
  ffmpeg -y -v error -i "$POPUP_SRC/閉じるボタン.png" \
    -vf "crop=156:157:193:166,scale=128:-2:flags=lanczos" "$OUT/icons/close.png"
  cwebp -quiet -q 90 "$OUT/icons/close.png" -o "$OUT/icons/close.webp"
fi

# ---------- NETWORK map ----------
# The annotated map (outline, leader lines and the five place names) only exists
# burnt into the section comp 拠点.jpg, so it is matted out of it. The artwork is
# neutral white over a saturated blue ground, so the minimum of R/G/B separates
# them cleanly — the ground's 99th percentile is 78 and the ink's 1st is 222.
if [ -n "$NETWORK_COMP" ]; then
  echo "network: japan-map"
  python3 - "$NETWORK_COMP" "$OUT/network/japan-map.png" <<'PY'
import sys
from PIL import Image
Image.MAX_IMAGE_PIXELS = None
src, dest = sys.argv[1], sys.argv[2]
M = 8  # a hair of margin so anti-aliased glyph edges are not clipped
BOX = (992 - M, 688 - M, 2763 + M, 2978 + M)  # ink bounds measured on the comp
crop = Image.open(src).convert("RGB").crop(BOX)
w, h = crop.size
rp, gp, bp = [c.load() for c in crop.split()]
mask = Image.new("L", (w, h))
mp = mask.load()
LO, HI = 90, 235
for y in range(h):
    for x in range(w):
        v = min(rp[x, y], gp[x, y], bp[x, y])
        mp[x, y] = 0 if v <= LO else 255 if v >= HI else int((v - LO) * 255 / (HI - LO))
art = Image.new("RGB", (w, h), (255, 255, 255))
art.putalpha(mask)
art.resize((1400, round(1400 * h / w)), Image.LANCZOS).save(dest, optimize=True)
PY
  cwebp -quiet -q 90 -alpha_q 100 "$OUT/network/japan-map.png" -o "$OUT/network/japan-map.webp"
fi

echo
echo "done — $(du -sh "$OUT" | cut -f1) total"
