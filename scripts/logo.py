#!/usr/bin/env python3
"""Logo: a «Σ» monogram whose top and bottom bars are drawn as gentle skin lines,
with a small apricot dot (a mole under examination). Σ for Σαραφόπουλος.

Outputs
  src/data/logo-mark.svg   inner markup used inline in the header/footer (classes allow a dark variant)
  src/static/favicon.svg   standalone favicon
  brand/*.svg              logo files for print, Google Business Profile, cards
                           (text converted to outlines with HarfBuzz kerning: no font needed)
PNG exports of the brand files are rendered by `npm run og`.
Run: python3 -I scripts/logo.py   (needs: pip install fonttools brotli uharfbuzz)
"""
import io
import pathlib

import uharfbuzz as hb
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

ROOT = pathlib.Path(__file__).resolve().parent.parent
FONTS = ROOT / "src/static/fonts"
BRAND = ROOT / "brand"

TEAL, INK, MUTED, APRICOT, WHITE = "#0E5C63", "#0C2A30", "#4C6066", "#E9A68A", "#FFFFFF"

# ── The mark (48×48) ─────────────────────────────────────────────────────────
STROKES = (
    '<path d="M13.6 13.4C19.4 10.9 27.6 15.9 34.4 13.4"/>'  # top bar: skin line
    '<path d="M15.2 14.6 25.4 24 15.2 33.4"/>'  # Σ chevron
    '<path d="M13.6 34.6C19.4 32.1 27.6 37.1 34.4 34.6"/>'  # bottom bar: skin line
)


def mark(bg=TEAL, fg=WHITE, dot=APRICOT, classes=True):
    c = (lambda n: f' class="{n}"') if classes else (lambda n: "")
    return (
        f'<rect{c("mk-bg")} width="48" height="48" rx="13" fill="{bg}"/>'
        f'<g{c("mk-fg")} fill="none" stroke="{fg}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">{STROKES}</g>'
        f'<circle{c("mk-dot")} cx="33.2" cy="24" r="3.3" fill="{dot}"/>'
    )


# ── Text to outlines ─────────────────────────────────────────────────────────
class Face:
    def __init__(self, path, wght):
        tt = instantiateVariableFont(TTFont(path), {"wght": wght})
        tt.flavor = None
        buf = io.BytesIO()
        tt.save(buf)
        self.tt = tt
        self.cmap = tt.getBestCmap()
        self.order = tt.getGlyphOrder()
        self.glyphs = tt.getGlyphSet()
        self.upm = tt["head"].unitsPerEm
        self.hb = hb.Font(hb.Face(buf.getvalue()))


def faces(wght):
    return [Face(FONTS / "commissioner-greek-wght.woff2", wght), Face(FONTS / "commissioner-latin-wght.woff2", wght)]


def runs(text, fs):
    """Split text into runs by the font subset that contains each character."""
    out = []
    for ch in text:
        f = next((f for f in fs if ord(ch) in f.cmap and (ch != " " or not out)), None)
        if ch == " " and out:
            f = out[-1][0] if ord(" ") in out[-1][0].cmap else fs[1]
        if f is None:
            raise SystemExit(f"glyph missing for {ch!r}")
        if out and out[-1][0] is f:
            out[-1][1] += ch
        else:
            out.append([f, ch])
    return out


def nts(n):
    return f"{n:.2f}".rstrip("0").rstrip(".")


def text_path(text, fs, size, x, y, tracking=0.0):
    d, pen_x = [], x
    for face, run in runs(text, fs):
        s = size / face.upm
        buf = hb.Buffer()
        buf.add_str(run)
        buf.guess_segment_properties()
        hb.shape(face.hb, buf, {"kern": True, "liga": True})
        for info, pos in zip(buf.glyph_infos, buf.glyph_positions):
            name = face.order[info.codepoint]
            pen = SVGPathPen(face.glyphs, ntos=nts)
            gx, gy = pen_x + pos.x_offset * s, y - pos.y_offset * s
            face.glyphs[name].draw(TransformPen(pen, (s, 0, 0, -s, gx, gy)))
            d.append(pen.getCommands())
            pen_x += pos.x_advance * s + tracking
    return " ".join(p for p in d if p), pen_x - x


def lockup(name, role, dark=False):
    name_fs, role_fs = faces(640), faces(440)
    n_path, n_w = text_path(name, name_fs, 21, 62, 22.5, -0.15)
    r_path, r_w = text_path(role, role_fs, 13.2, 62, 40.5, 0.1)
    w = 62 + max(n_w, r_w) + 2
    m = mark(WHITE, TEAL, APRICOT, classes=False) if dark else mark(classes=False)
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {nts(w)} 48" width="{nts(w * 4)}" height="192">'
        f"{m}"
        f'<path fill="{WHITE if dark else INK}" d="{n_path}"/>'
        f'<path fill="{"#C3D6D2" if dark else MUTED}" d="{r_path}"/></svg>\n'
    )


def main():
    (ROOT / "src/data").mkdir(exist_ok=True)
    BRAND.mkdir(exist_ok=True)
    (ROOT / "src/data/logo-mark.svg").write_text(mark() + "\n")
    standalone = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">{mark(classes=False)}</svg>\n'
    (ROOT / "src/static/favicon.svg").write_text(standalone)
    (BRAND / "logo-mark.svg").write_text(standalone.replace('viewBox="0 0 48 48"', 'viewBox="0 0 48 48" width="512" height="512"'))
    (BRAND / "logo-el.svg").write_text(lockup("Ανδρέας Σαραφόπουλος", "Δερματολόγος – Αφροδισιολόγος"))
    (BRAND / "logo-el-dark.svg").write_text(lockup("Ανδρέας Σαραφόπουλος", "Δερματολόγος – Αφροδισιολόγος", dark=True))
    (BRAND / "logo-en.svg").write_text(lockup("Dr Andreas Sarafopoulos", "Dermatologist – Venereologist"))
    (BRAND / "logo-en-dark.svg").write_text(lockup("Dr Andreas Sarafopoulos", "Dermatologist – Venereologist", dark=True))
    print("logo mark, favicon and brand/*.svg written")


if __name__ == "__main__":
    main()
