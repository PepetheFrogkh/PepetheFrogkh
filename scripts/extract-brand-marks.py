#!/usr/bin/env python3
"""Lift the Hanuman figure and wordmark out of the official logo banner.

The banner is white artwork on the brand navy (rgb 1,62,106), so the distance
from the background colour is the mark's alpha. The result is upscaled and
re-thresholded with a smoothstep, which recovers near-vector edges from a
line-art source — enough to texture a label the camera spends most of the
scroll in close-up on.

    python3 scripts/extract-brand-marks.py logo-banner.jpg public/brand

This is a one-off: the PNGs it produces are committed. Re-run it if the brand
ever sends the vector artwork (in which case, export from that instead).
"""

import os
import sys

import numpy as np
from PIL import Image

NAVY = np.array([1.0, 62.0, 106.0])
# Rows of the banner each mark occupies; re-measure if the source changes.
BANDS = {"hanuman-figure": (80, 440, 768), "hanuman-wordmark": (440, 497, 1024)}


def alpha_of(path: str):
    rgb = np.asarray(Image.open(path).convert("RGB")).astype(np.float32)
    far = np.linalg.norm(np.array([255.0, 255.0, 255.0]) - NAVY)
    return np.clip(np.linalg.norm(rgb - NAVY, axis=2) / far, 0, 1)


def cut(alpha, y0: int, y1: int, width: int, out: str, lo=0.18, hi=0.55):
    band = alpha[y0:y1]
    cols = np.where((band > 0.25).any(axis=0))[0]
    band = band[:, cols.min(): cols.max() + 1]

    h, w = band.shape
    scale = max(1, round(width / w))
    big = Image.fromarray((band * 255).astype(np.uint8), "L").resize(
        (w * scale, h * scale), Image.LANCZOS
    )
    v = np.asarray(big).astype(np.float32) / 255.0
    t = np.clip((v - lo) / (hi - lo), 0, 1)
    t = t * t * (3 - 2 * t)                        # smoothstep re-sharpens the edge

    img = Image.fromarray(
        np.dstack([np.full_like(t, 255), np.full_like(t, 255), np.full_like(t, 255), t * 255])
        .astype(np.uint8),
        "RGBA",
    )
    img = img.resize((width, round(img.height * width / img.width)), Image.LANCZOS)
    img.save(out, optimize=True)
    print(f"{out}: {img.width}×{img.height}, {os.path.getsize(out) // 1024} kB")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        raise SystemExit(__doc__)
    banner, outdir = sys.argv[1], sys.argv[2]
    a = alpha_of(banner)
    for name, (y0, y1, width) in BANDS.items():
        cut(a, y0, y1, width, os.path.join(outdir, f"{name}.png"))
