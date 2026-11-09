#!/usr/bin/env python3
"""Generate the «ΑΣ» monogram from Commissioner glyph outlines (no font needed at runtime).

Outputs:
  src/data/logo-mark.svg   inner SVG markup (used inline in the header/footer)
  src/static/favicon.svg   standalone favicon
Run: python3 -I scripts/logo.py
"""
import pathlib
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.transformPen import TransformPen

ROOT = pathlib.Path(__file__).resolve().parent.parent
FONT = ROOT / "src/static/fonts/commissioner-greek-wght.woff2"
TEAL = "#0E5C63"


def glyph_path(font, ch, scale, dx, dy):
    gs = font.getGlyphSet()
    name = font.getBestCmap()[ord(ch)]
    pen = SVGPathPen(gs, ntos=lambda n: (f"{n:.2f}").rstrip("0").rstrip("."))
    # Font units are y-up; SVG is y-down.
    gs[name].draw(TransformPen(pen, (scale, 0, 0, -scale, dx, dy)))
    bp = BoundsPen(gs)
    gs[name].draw(bp)
    return pen.getCommands(), gs[name].width * scale, bp.bounds


def main():
    font = TTFont(FONT)
    font = instantiateVariableFont(font, {"wght": 560})
    upm = font["head"].unitsPerEm
    cap = font["OS/2"].sCapHeight or 700
    size = 40
    target_cap = 15.5  # px cap height inside a 40px box
    s = target_cap / cap
    tracking = -0.6
    # Measure both glyphs to centre the pair.
    _, wA, bA = glyph_path(font, "Α", s, 0, 0)
    _, wS, bS = glyph_path(font, "Σ", s, 0, 0)
    total = (bA[2] - bA[0]) * s + tracking + (bS[2] - bS[0]) * s + (wA - bA[2] * s)
    x0 = (size - total) / 2 - bA[0] * s
    base = size / 2 + target_cap / 2
    pA, wA, _ = glyph_path(font, "Α", s, x0, base)
    pS, _, _ = glyph_path(font, "Σ", s, x0 + wA + tracking, base)
    inner = (
        f'<rect width="40" height="40" rx="11" fill="{TEAL}"/>'
        f'<circle cx="31.5" cy="8.5" r="2.6" fill="#E9A68A"/>'
        f'<path fill="#fff" d="{pA} {pS}"/>'
    )
    (ROOT / "src/data").mkdir(exist_ok=True)
    (ROOT / "src/data/logo-mark.svg").write_text(inner + "\n")
    (ROOT / "src/static/favicon.svg").write_text(
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">{inner}</svg>\n'
    )
    print("logo mark written")


if __name__ == "__main__":
    main()
