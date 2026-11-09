#!/usr/bin/env python3
"""Photo pipeline: crop, blur sensitive areas, strip ALL metadata, export WebP.

Run:  npm run images   (or: python3 -I scripts/images.py)

Input:  assets-src/photos/*.jpg   (raw photos, never deployed)
Output: src/static/img/<name>-<width>.webp + src/data/images.json (sizes for width/height attrs)

Images are never upscaled: the originals are only 600-800 px wide, so the
largest variant is the native width. Ask the doctor for full-resolution
originals and add 960/1600 to WIDTHS when they arrive.
"""
import json
import pathlib
from PIL import Image, ImageFilter, ImageOps

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / "assets-src" / "photos"
OUT = ROOT / "src" / "static" / "img"
DATA = ROOT / "src" / "data" / "images.json"
WIDTHS = [480, 960, 1600]  # only widths <= native width are produced
MAX_BYTES = 200 * 1024

# name: (source file, crop box or None, list of blur boxes in ORIGINAL coordinates)
JOBS = {
    # Hero: the doctor next to the digital dermatoscopy system. The monitor
    # shows a dermoscopic image and a patient panel, so it is blurred.
    "giatros-portreto": ("giatros-dermatoskopio.jpg", (40, 175, 540, 800), [(386, 203, 548, 320)]),
    # Wide version for the moles page.
    "giatros-dermatoskopisi": ("giatros-dermatoskopio.jpg", None, [(386, 203, 548, 320)]),
    "exetastirio": ("exetastirio.jpg", None, []),
    # Crop the right edge: a seasonal Christmas tree stands there.
    "xoros-anamonis": ("xoros-anamonis.jpg", (0, 30, 720, 570), []),
    "diadromos": ("diadromos-vivliothiki.jpg", None, []),
    "eisodos-rampa": ("eisodos-rampa.jpg", None, []),
    # Remove the parked cars at the bottom.
    "ktirio": ("ktirio-menelaou-74.jpg", (0, 40, 600, 650), []),
}


def blur_box(im, box, radius=16, feather=6):
    """Blur a region with a feathered edge so it reads as out of focus."""
    from PIL import ImageDraw
    blurred = im.filter(ImageFilter.GaussianBlur(radius))
    mask = Image.new("L", im.size, 0)
    ImageDraw.Draw(mask).rectangle(box, fill=255)
    mask = mask.filter(ImageFilter.GaussianBlur(feather))
    im.paste(blurred, (0, 0), mask)


def clean_copy(im):
    """Return a pixel-only copy: no EXIF, XMP, ICC or other metadata."""
    data = im.convert("RGB")
    out = Image.new("RGB", data.size)
    out.paste(data)
    return out


def encode(im, path):
    for q in (82, 78, 74, 70, 65, 60):
        im.save(path, "WEBP", quality=q, method=6)
        if path.stat().st_size <= MAX_BYTES:
            return q
    raise SystemExit(f"{path} is still > 200 KB")


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    DATA.parent.mkdir(parents=True, exist_ok=True)
    manifest = {}
    for name, (src, crop, blurs) in JOBS.items():
        im = ImageOps.exif_transpose(Image.open(SRC / src))
        im = clean_copy(im)
        for b in blurs:
            blur_box(im, b)
        if crop:
            im = im.crop(crop)
        native_w, native_h = im.size
        widths = sorted({w for w in WIDTHS if w <= native_w * 0.8} | {native_w})
        variants = []
        for w in widths:
            h = round(native_h * w / native_w)
            v = im if w == native_w else im.resize((w, h), Image.LANCZOS)
            path = OUT / f"{name}-{w}.webp"
            q = encode(v, path)
            variants.append({"w": w, "h": h, "src": f"/img/{path.name}"})
            print(f"{path.name:36} {w}x{h}  q{q}  {path.stat().st_size // 1024} KB")
        manifest[name] = {"w": native_w, "h": native_h, "variants": variants}
    DATA.write_text(json.dumps(manifest, indent=2) + "\n")

    # Verify: no metadata survived.
    for f in OUT.glob("*.webp"):
        info = Image.open(f).info
        leaked = [k for k in ("exif", "xmp", "icc_profile") if info.get(k)]
        if leaked:
            raise SystemExit(f"{f.name} still has {leaked}")
    print("OK: no EXIF/XMP/ICC in output")


if __name__ == "__main__":
    main()
