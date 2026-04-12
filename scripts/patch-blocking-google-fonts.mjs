/**
 * patch-blocking-google-fonts.mjs — RETIRED / NO-OP
 *
 * This script used to revert the async font-load pattern back to a blocking
 * <link rel="stylesheet"> for Google Fonts. That pattern was causing ~1,200 ms
 * render-blocking penalty on every page (confirmed via Lighthouse).
 *
 * It has been replaced by the non-blocking preload+onload pattern across all
 * HTML files (done via a bulk PowerShell patch in April 2026).
 *
 * Long-term: run scripts/setup-self-hosted-fonts.sh + patch-google-fonts-to-local.mjs
 * to remove the Google Fonts CDN dependency entirely.
 *
 * This file is kept as a no-op so it doesn't break any existing npm/build scripts
 * that reference it by name.
 */

console.log('[patch-blocking-google-fonts] No-op — Google Fonts are now loaded non-blocking. Nothing to do.');
