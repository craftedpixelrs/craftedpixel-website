#!/usr/bin/env bash
# =============================================================================
# compress-assets.sh
# Run on VPS after every deploy to pre-compress CSS, JS, HTML, SVG, JSON.
# Nginx gzip_static + brotli_static then serve these at zero CPU cost.
#
# Usage: bash scripts/compress-assets.sh
# Requirements:
#   gzip   — pre-installed on every Linux distro
#   brotli — sudo apt install brotli   (Ubuntu 20+)
#
# Run from the web root, e.g.:
#   cd /var/www/html && bash scripts/compress-assets.sh
# =============================================================================

set -euo pipefail

SITE_ROOT="${1:-/var/www/html}"
cd "$SITE_ROOT"

HAS_BROTLI=false
if command -v brotli &>/dev/null; then
  HAS_BROTLI=true
fi

echo "Compressing static assets in: $SITE_ROOT"
echo "Brotli available: $HAS_BROTLI"
echo ""

gzip_count=0
brotli_count=0

compress_file() {
  local file="$1"

  # gzip — level 9, keep original
  gzip -9 -k -f "$file"
  gzip_count=$((gzip_count + 1))

  # brotli — level 11 (max), keep original
  if $HAS_BROTLI; then
    brotli --best -f "$file"
    brotli_count=$((brotli_count + 1))
  fi
}

# ── Text assets: CSS, JS, HTML, SVG, JSON, XML, webmanifest ───────────────────
while IFS= read -r -d '' file; do
  # Skip files that are already compressed sidecars
  [[ "$file" == *.gz ]] && continue
  [[ "$file" == *.br ]] && continue
  compress_file "$file"
done < <(find . \
  -not -path '*/\.*' \
  \( \
    -name '*.css' -o \
    -name '*.js'  -o \
    -name '*.mjs' -o \
    -name '*.html' -o \
    -name '*.svg'  -o \
    -name '*.json' -o \
    -name '*.xml'  -o \
    -name '*.webmanifest' \
  \) \
  -print0)

echo ""
echo "Created $gzip_count .gz files"
if $HAS_BROTLI; then
  echo "Created $brotli_count .br files"
else
  echo "Brotli not installed — install with: sudo apt install brotli"
fi
echo ""
echo "Reload nginx to pick up new sidecar files:"
echo "  sudo systemctl reload nginx"
