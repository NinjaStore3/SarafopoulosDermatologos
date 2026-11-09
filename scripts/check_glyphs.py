#!/usr/bin/env python3
"""Check that every character rendered on the site exists in the self-hosted fonts.

Arrows (→ ↗) and some typographic marks are missing from Latin subsets; anything
missing would silently fall back to a system font. Run after `npm run build`.
"""
import html
import pathlib
import re
import sys
from fontTools.ttLib import TTFont

ROOT = pathlib.Path(__file__).resolve().parent.parent
FONTS = ROOT / "src/static/fonts"
DIST = ROOT / "dist"

cmap = set()
for f in FONTS.glob("*.woff2"):
    cmap |= set(TTFont(f).getBestCmap())

missing = {}
for page in sorted(DIST.rglob("*.html")):
    src = page.read_text(encoding="utf-8")
    body = src.split("<body", 1)[1]
    body = re.sub(r"<(script|style|svg)\b.*?</\1>", " ", body, flags=re.S)
    text = html.unescape(re.sub(r"<[^>]+>", " ", body))
    # <title> is rendered by the browser chrome, not our font — skip it.
    for ch in text:
        if ch.isspace() or ord(ch) in cmap:
            continue
        missing.setdefault(ch, set()).add(str(page.relative_to(DIST)))

if missing:
    print("Glyphs missing from the web fonts:")
    for ch, pages in missing.items():
        print(f"  U+{ord(ch):04X} {ch!r} in {', '.join(sorted(pages))}")
    sys.exit(1)
print(f"Glyph check OK: every rendered character is in the font files ({len(cmap)} code points).")
