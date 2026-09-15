#!/bin/bash
# Regenerates everything under public/assets from the client's material folders.
#
#   ./scripts/optimize-assets.sh [materials-root]
#
# Requires: ffmpeg, cwebp (brew install ffmpeg webp).
#
# NOTHING HERE RESAMPLES OR RE-ENCODES A PICTURE. The client asked for the
# artwork at the quality they supplied it, so every asset below is either copied
# byte for byte, stream-copied, cropped (which only discards whole pixels), or
# encoded losslessly. Where a source is already a JPEG, its own file ships —
# re-encoding it, even at q100, would only add a second generation of loss, and a
# lossless WebP of it would be larger than the JPEG for no visible gain. So the
# photographic assets carry a single file rather than the usual WebP + fallback
# pair, and their <picture> elements dropped the <source> to match.
#
# Flat artwork (icons, the statement, the map) keeps the pair: there a lossless
# WebP really is smaller than the PNG and pixel-identical to it.
set -euo pipefail

ROOT="${1:-/Users/leosmacbook/Downloads}"
TOP="$ROOT/ 昭和美術印刷LP素材_まとめ/ 昭和美術印刷LP素材_TOP"
ICONS_SRC="$ROOT/ 昭和美術印刷LP素材_まとめ/ 昭和美術印刷LP素材_印刷アイコン"
STATEMENT_SRC="$ROOT/ 昭和美術印刷LP素材_まとめ/ 昭和美術印刷LP素材_ステートメント"
WORKS_SRC="$ROOT/ 昭和美術印刷LP＿ワークス＿JPG"
LID_SRC="$ROOT"                     # ＿流し素材.jpg live loose in the drop
POPUP_SRC="$ROOT/ 昭和美術印刷LP素材_印刷アイコンからのPOPUP表示"
LOGO_SRC="$ROOT/昭和美術印刷＿logo"
NETWORK_COMP="$ROOT/拠点.jpg"

OUT="$(cd "$(dirname "$0")/.." && pwd)/public/assets"
mkdir -p "$OUT"/{video,brand,about,works,icons,service,network}

have () { [ -f "$1" ] || { echo "skip:  $(basename "$1") (not in this drop)"; return 1; }; }

# ---------- video ----------
# The picture is stream-copied: identical frames, identical bitrate, identical
# resolution to the client's master. Only the AAC track is dropped — these play
# muted as decoration and the audio is bytes nobody can ever hear. +faststart
# moves the index to the front so playback can begin before the file is whole,
# which matters a great deal now that material-a is 20MB rather than 1.3MB.
copy_video () {
  local src=$1 name=$2
  have "$src" || return 0
  echo "video: $name (stream copy, $(ffprobe -v error -select_streams v:0 \
    -show_entries stream=width,height -of csv=p=0:s=x "$src"))"

  ffmpeg -y -v error -i "$src" -map 0:v:0 -c:v copy -an -movflags +faststart \
    "$OUT/video/$name.mp4"

  # Poster frame at the video's own size, near-lossless — it stands in for the
  # first frame under prefers-reduced-motion and before the island runs, so it
  # has to survive being looked at rather than merely blur into place.
  ffmpeg -y -v error -i "$src" -frames:v 1 -q:v 2 "$OUT/video/$name-poster.jpg"

  # The VP9 transcodes are gone: a second encode of an already-encoded master is
  # a second generation of loss, and the browser preferred it over the mp4.
  rm -f "$OUT/video/$name.webm"
}

copy_video "$TOP/動画素材A.mp4" material-a  # TOP hero, full-bleed
copy_video "$TOP/動画素材B.mp4" material-b  # NETWORK band
# 動画素材C.mp4 is in the drop but placed nowhere: the WORKS strip that used to
# carry a video tile now runs the client's own photography. Add a copy_video
# line here if a video tile comes back.

# ---------- flat artwork ----------
# Source PNG byte for byte, plus a lossless WebP of it. Both are pixel-identical
# to what the client drew; the WebP is simply the smaller container.
copy_flat () {
  local src=$1 dest=$2
  have "$src" || return 0
  echo "image: $dest (verbatim + lossless webp)"
  cp "$src" "$OUT/$dest.png"
  cwebp -quiet -lossless -z 9 "$OUT/$dest.png" -o "$OUT/$dest.webp"
}

copy_flat "$STATEMENT_SRC/アートボード 14@4x.png" about/about-statement

for pair in \
  "オフリン印刷:offset-printing" "枚葉印刷:sheetfed-printing" \
  "オンデマンド:on-demand" "プリプレス:prepress" "製本折加工:bookbinding"; do
  copy_flat "$ICONS_SRC/昭和美術印刷アイコン＿${pair%%:*}.png" "icons/${pair##*:}"
done

# The brand lockups are not in any of the client's folders — only the final
# rasters already in public/assets/brand, which came from the original handoff
# zip. They stay as they are until the vector or a full-size export turns up.

if have "$LOGO_SRC/昭和美術印刷＿logo.svg"; then
  # Vector, so resolution is moot — but the copy in the repo had been minified,
  # which stripped the <style> block and with it the mark's #040000 fill.
  echo "image: brand/logo.svg (verbatim)"
  cp "$LOGO_SRC/昭和美術印刷＿logo.svg" "$OUT/brand/logo.svg"
fi

# ---------- WORKS strip ----------
# Photographs, supplied as JPEGs. Both the tile and the lid it wears ship exactly
# as delivered — 3274x2304 rather than the 1600px re-encodes they replace.
for pair in \
  "おしごと本パンフ:oshigoto-book" "スキー場:ski-jam" \
  "ヨーロッパ軒:europe-ken" "田村屋素材:tamuraya"; do
  src="${pair%%:*}" dest="${pair##*:}"
  if have "$WORKS_SRC/$src.jpg"; then
    echo "image: works/$dest.jpg (verbatim)"
    cp "$WORKS_SRC/$src.jpg" "$OUT/works/$dest.jpg"
    rm -f "$OUT/works/$dest.webp"
  fi
  if have "$LID_SRC/${src}＿流し素材.jpg"; then
    echo "image: works/$dest-lid.jpg (verbatim)"
    cp "$LID_SRC/${src}＿流し素材.jpg" "$OUT/works/$dest-lid.jpg"
  fi
done

# ---------- SERVICE popups ----------
# Each panel arrives as one flat composite with the vertical title and body copy
# burnt in; only the photograph is taken, because the copy is set as live text in
# ServiceModal.astro. Every composite places that photo in the same 3432x1974
# box give or take a pixel of anti-aliasing, so one rectangle with a 3px inset
# to trim the seam serves all five, and --popup-photo-ratio matches the result.
#
# The crop is the whole operation now: no scale filter, so the pixels inside the
# rectangle are the composite's own. The 1720px q82 JPEGs these replace were half
# the linear resolution of the source.
#
# These are photographs the client happened to deliver as PNG, which is the worst
# possible container for them — the five crops come to 41MB as PNG. Lossless WebP
# stores the identical pixels in 28MB, so that is what ships, and the PNG is only
# an intermediate. Verified per file below: every channel matches exactly.
crop_popup () {
  local file=$1 dest=$2 x=$3 y=$4
  have "$POPUP_SRC/$file" || return 0
  echo "popup: $dest (native crop, lossless)"
  ffmpeg -y -v error -i "$POPUP_SRC/$file" \
    -vf "crop=3426:1968:$((x + 3)):$((y + 3))" "$OUT/service/$dest.png"
  cwebp -quiet -lossless -z 9 "$OUT/service/$dest.png" -o "$OUT/service/$dest.webp"
  rm -f "$OUT/service/$dest.png" "$OUT/service/$dest.jpg"
}

crop_popup "昭和美術印刷アイコン＿オフリン印刷_POPUP.png"  offset-printing   292 806
crop_popup "昭和美術印刷アイコン＿枚葉印刷_POPUP.png"      sheetfed-printing 299 805
crop_popup "昭和美術印刷アイコン＿オンデマンド_POPUP.png"  on-demand         298 805
crop_popup "昭和美術印刷アイコン＿プリプレス_POPUP.png"    prepress          298 805
crop_popup "昭和美術印刷アイコン＿製本折加工_POPUP.png"    bookbinding       292 805

# The close glyph, cropped out of its hit-area padding at its own size.
# 設備一覧ボタン.png is not used: it is the brand's underlined text link, which
# already exists as the LinkButton component, so it is set as text.
if have "$POPUP_SRC/閉じるボタン.png"; then
  echo "popup: close glyph (native crop, lossless)"
  ffmpeg -y -v error -i "$POPUP_SRC/閉じるボタン.png" \
    -vf "crop=156:157:193:166" "$OUT/icons/close.png"
  cwebp -quiet -lossless -z 9 "$OUT/icons/close.png" -o "$OUT/icons/close.webp"
fi

# ---------- NETWORK map ----------
# The annotated map (outline, leader lines and the five place names) only exists
# burnt into the section comp 拠点.jpg, so it is matted out of it. The artwork is
# neutral white over a saturated blue ground, so the minimum of R/G/B separates
# them cleanly — the ground's 99th percentile is 78 and the ink's 1st is 222.
# The matte now runs at the comp's own resolution: the 1400px downscale that used
# to follow it was throwing away a fifth of the leader lines' sharpness.
if have "$NETWORK_COMP"; then
  echo "network: japan-map (native matte, lossless)"
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
art.save(dest, optimize=True)  # native size — no resize step
print(f"       {w}x{h}")
PY
  cwebp -quiet -lossless -z 9 -alpha_q 100 "$OUT/network/japan-map.png" \
    -o "$OUT/network/japan-map.webp"
fi

echo
echo "done — $(du -sh "$OUT" | cut -f1) total"
