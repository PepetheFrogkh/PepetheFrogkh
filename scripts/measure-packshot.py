#!/usr/bin/env python3
"""Measure a bottle's silhouette from an official packshot.

The lathe profile in `lib/bottleProfile.ts` is built from these numbers rather
than from the Meshy GLBs: a photo on a white sweep gives a cleaner outline than
a 221k-triangle generated mesh, and it is the same object the client will hold
up next to the screen.

    python3 scripts/measure-packshot.py packshot.png > public/data/profile.json

Writes [radius, height] pairs, both normalised 0–1, bottom to top.
"""

import json
import sys

import numpy as np
from PIL import Image

SAMPLES = 72
# Anything darker than this on a white sweep is the bottle.
WHITE = 235


def measure(path: str):
    img = np.asarray(Image.open(path).convert("RGB")).astype(int)
    mask = img.min(axis=2) < WHITE
    ys, xs = np.where(mask)
    if not len(ys):
        raise SystemExit(f"{path}: nothing but background found")

    sub = mask[ys.min(): ys.max() + 1, xs.min(): xs.max() + 1]
    height = sub.shape[0]

    half = np.zeros(height)
    for row in range(height):
        on = np.where(sub[row])[0]
        if len(on):
            half[row] = (on.max() - on.min() + 1) / 2.0

    widest = half.max()
    points = []
    for i in range(SAMPLES):
        t = i / (SAMPLES - 1)                      # 0 at the base, 1 at the crown
        row = int(round((1 - t) * (height - 1)))
        points.append([round(float(half[row] / widest), 4), round(t, 4)])

    print(
        f"{path}: {sub.shape[1]}×{height} px, "
        f"height/body-diameter = {height / (2 * widest):.3f}",
        file=sys.stderr,
    )
    return points


if __name__ == "__main__":
    if len(sys.argv) != 2:
        raise SystemExit(__doc__)
    json.dump(measure(sys.argv[1]), sys.stdout)
