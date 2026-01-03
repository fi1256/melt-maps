#!/usr/bin/env bash
set -euo pipefail

# Usage:
#   ./geojson-to-pmtiles.sh input.geojson output.pmtiles

INPUT="$1"
OUTPUT="$2"

# Temp mbtiles
TMP_MB="$(mktemp -t tiles.XXXXXX.mbtiles)"

# Tile parameters
MIN_ZOOM=0
MAX_ZOOM=12
LAYER_NAME="data"

echo "▶ Generating MBTiles with tippecanoe..."

tippecanoe \
  -o "$TMP_MB" \
  -l "$LAYER_NAME" \
  --minimum-zoom=7 \
  --maximum-zoom=12 \
  --base-zoom=7 \
  --no-feature-limit \
  --no-tile-size-limit \
  --no-simplification \
  --no-line-simplification \
  --no-tiny-polygon-reduction \
  --force \
  "$INPUT"

echo "▶ Converting MBTiles → PMTiles..."

pmtiles convert "$TMP_MB" "$OUTPUT"

rm -f "$TMP_MB"

echo "✔ PMTiles written to $OUTPUT"
