#!/usr/bin/env bash
# Builds the scroll-scrubbed hero frames from the five transition clips.
#
#   scripts/build-sequence.sh <dir-with-t1.mp4..t5.mp4>
#
# Each clip runs from one stage keyframe to the next (generated with
# start/end-frame video interpolation). We take FRAMES_PER_CLIP evenly spaced
# frames from each clip, drop each clip's last frame (it equals the next
# clip's first) except on the final clip, and write two sizes of WebP into
# public/sequence/{sm,lg}/NNN.webp. Keep FRAMES_PER_CLIP in sync with
# src/content/sequence.ts (framesPerStage).
set -euo pipefail

SRC="${1:?pass the directory containing t1.mp4 … t5.mp4}"
FRAMES_PER_CLIP=16
OUT="$(cd "$(dirname "$0")/.." && pwd)/public/sequence"
TMP="$(mktemp -d)"
trap 'rm -rf -- "$TMP"' EXIT

mkdir -p "$OUT/sm" "$OUT/lg"
index=0
clips=("$SRC"/t1.mp4 "$SRC"/t2.mp4 "$SRC"/t3.mp4 "$SRC"/t4.mp4 "$SRC"/t5.mp4)

for c in "${!clips[@]}"; do
  clip="${clips[$c]}"
  total=$(ffprobe -v error -count_frames -select_streams v:0 -show_entries stream=nb_read_frames -of csv=p=0 "$clip")
  last=$((total - 1))
  mkdir -p "$TMP/$c"
  ffmpeg -v error -i "$clip" "$TMP/$c/%04d.png"

  count=$FRAMES_PER_CLIP
  if [ "$c" -eq $((${#clips[@]} - 1)) ]; then count=$((FRAMES_PER_CLIP + 1)); fi

  for ((i = 0; i < count; i++)); do
    n=$(( (i * last + FRAMES_PER_CLIP / 2) / FRAMES_PER_CLIP ))
    frame=$(printf "%s/%s/%04d.png" "$TMP" "$c" $((n + 1)))
    name=$(printf "%03d.webp" "$index")
    ffmpeg -v error -y -i "$frame" -vf "scale=1440:-2:flags=lanczos" -c:v libwebp -quality 50 -compression_level 6 "$OUT/lg/$name"
    ffmpeg -v error -y -i "$frame" -vf "scale=768:-2:flags=lanczos" -c:v libwebp -quality 50 -compression_level 6 "$OUT/sm/$name"
    index=$((index + 1))
  done
done

echo "Wrote $index frames to $OUT"
du -sh "$OUT/sm" "$OUT/lg"
