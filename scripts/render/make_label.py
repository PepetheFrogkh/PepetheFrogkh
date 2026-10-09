#!/usr/bin/env python3
"""Paint the bottle label for the offline (Cycles) render.

Separate from `lib/labelTexture.ts` on purpose. The realtime label is painted
at 2048x1024 and has to stay cheap; this one is 4096x2048 and also emits the
roughness and height maps a raytracer needs — gold foil is smoother than
paper, printed ink sits proud of the stock, and the paper itself has grain.
Those three maps are most of the difference between "a texture" and "a label".

    python3 scripts/render/make_label.py <marks-dir> <fonts-dir> <out-dir>
"""

import math
import os
import sys

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

W, H = 4096, 2048

NAVY = (1, 62, 106)
NAVY_DARK = (1, 32, 56)
GOLD = (217, 164, 65)
GOLD_LIGHT = (244, 213, 141)
GOLD_DEEP = (140, 96, 26)
CREAM = (246, 241, 230)
INK_BLACK = (6, 6, 10)


def load_mark(path, height, colour):
    """A white-on-transparent brand mark, recoloured and scaled."""
    m = Image.open(path).convert("RGBA")
    w = round(m.width * height / m.height)
    m = m.resize((w, height), Image.LANCZOS)
    tint = Image.new("RGBA", m.size, colour + (255,))
    tint.putalpha(m.getchannel("A"))
    return tint


def gold_bar(draw, x0, y0, x1, y1):
    """A vertical gold gradient — foil reads as a gradient, never a flat fill."""
    h = y1 - y0
    for i in range(h):
        t = i / max(h - 1, 1)
        if t < 0.35:
            k = t / 0.35
            c = tuple(round(GOLD_DEEP[j] + (GOLD_LIGHT[j] - GOLD_DEEP[j]) * k) for j in range(3))
        elif t < 0.6:
            k = (t - 0.35) / 0.25
            c = tuple(round(GOLD_LIGHT[j] + (GOLD[j] - GOLD_LIGHT[j]) * k) for j in range(3))
        else:
            k = (t - 0.6) / 0.4
            c = tuple(round(GOLD[j] + (GOLD_DEEP[j] - GOLD[j]) * k) for j in range(3))
        draw.line([(x0, y0 + i), (x1, y0 + i)], fill=c)


def sunburst(img, cx, cy, radius, colour, count=56):
    """The rays from the packaging, drawn supersampled so they stay crisp."""
    s = 2
    layer = Image.new("RGBA", (radius * 2 * s, radius * 2 * s), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    c = radius * s
    for i in range(count):
        a = (i / count) * math.tau
        long = i % 2 == 0
        inner = radius * s * 0.40
        outer = radius * s * (1.0 if long else 0.80)
        d.line(
            [
                (c + math.cos(a) * inner, c + math.sin(a) * inner),
                (c + math.cos(a) * outer, c + math.sin(a) * outer),
            ],
            fill=colour + (150 if long else 85,),
            width=int(7 * s) if long else int(4 * s),
        )
    layer = layer.resize((radius * 2, radius * 2), Image.LANCZOS)
    img.alpha_composite(layer, (cx - radius, cy - radius))


def paper_grain(size, strength=7.0, seed=4):
    """Uncoated label stock: fine fibre noise, slightly directional."""
    rng = np.random.default_rng(seed)
    w, h = size
    small = rng.normal(0, 1, (h // 4, w // 4)).astype(np.float32)
    g = np.asarray(
        Image.fromarray(((small - small.min()) / np.ptp(small) * 255).astype(np.uint8))
        .resize((w, h), Image.BICUBIC)
        .filter(ImageFilter.GaussianBlur(0.6)),
        dtype=np.float32,
    )
    fine = rng.normal(0, 1, (h, w)).astype(np.float32)
    g = (g - g.mean()) / (g.std() + 1e-6)
    return (g * 0.7 + fine * 0.3) * strength


def build(marks, fonts, out, dark=False):
    f_disp = lambda s: ImageFont.truetype(os.path.join(fonts, "ArchivoSemiBoldRegular.ttf"), s)
    f_script = lambda s: ImageFont.truetype(os.path.join(fonts, "PlayfairDisplayItalic.ttf"), s)
    f_khmer = lambda s: ImageFont.truetype(os.path.join(fonts, "NotoSansKhmerRegular.ttf"), s)

    bg = INK_BLACK if dark else NAVY
    img = Image.new("RGBA", (W, H), bg + (255,))
    d = ImageDraw.Draw(img)

    # vertical shading: a label on a cylinder is never evenly lit even flat
    shade = Image.new("L", (1, H))
    for y in range(H):
        t = y / (H - 1)
        v = 255 - int(70 * abs(math.cos(t * math.pi)) ** 1.5)
        shade.putpixel((0, y), v)
    shade = shade.resize((W, H))
    img = Image.composite(img, Image.new("RGBA", (W, H), (0, 0, 0, 255)), shade).convert("RGBA")
    d = ImageDraw.Draw(img)

    gold_bar(d, 0, 46, W, 66)
    gold_bar(d, 0, H - 70, W, H - 50)

    cx = W // 2
    fig = load_mark(os.path.join(marks, "hanuman-figure.png"), 880, CREAM)
    word = load_mark(os.path.join(marks, "hanuman-wordmark.png"), 190, GOLD_LIGHT)

    # Khmer name
    t = "ហនុមាន"
    fk = f_khmer(168)
    d.text((cx, 230), t, font=fk, fill=(GOLD if dark else CREAM) + (255,), anchor="mm")

    sunburst(img, cx, 900, 660, GOLD if dark else GOLD_LIGHT)
    img.alpha_composite(fig, (cx - fig.width // 2, 900 - fig.height // 2))
    img.alpha_composite(word, (cx - word.width // 2, 1520 - word.height // 2))

    d = ImageDraw.Draw(img)
    d.text((cx, 1725), "Black" if dark else "Premium Lager",
           font=f_script(152), fill=GOLD_LIGHT + (255,), anchor="mm")

    small = f_disp(52)
    d.text((cx, 1888), "G R E A T N E S S   I N   E V E R Y   M O M E N T",
           font=small, fill=(CREAM if not dark else GOLD_LIGHT) + (210,), anchor="mm")

    # side panels, seen through the glass on a 180° orbit
    for side in (cx - int(W * 0.33), cx + int(W * 0.33)):
        d.text((side, 600), "Finest German Brew", font=f_script(108),
               fill=(GOLD if dark else GOLD_LIGHT) + (255,), anchor="mm")
        gold_bar(d, side - 400, 692, side + 400, 700)
        d.text((side, 824), "P R E M I U M   L A G E R" if not dark else "B L A C K",
               font=f_disp(60), fill=CREAM + (235,), anchor="mm")
        for i, line in enumerate(
            ["BREWED AND BOTTLED BY", "HANUMAN BEVERAGES",
             "SEN SOK · PHNOM PENH · CAMBODIA"]):
            d.text((side, 956 + i * 76), line, font=f_disp(46),
                   fill=CREAM + (175,), anchor="mm")
        gold_bar(d, side - 400, 1192, side + 400, 1200)
        d.text((side, 1300), "ALC. 4.9% VOL." if not dark else "100% MALT",
               font=f_disp(60), fill=(GOLD if dark else GOLD_LIGHT) + (255,), anchor="mm")
        d.text((side, 1404), "330 ML", font=f_disp(44), fill=CREAM + (150,), anchor="mm")
        sunburst(img, side, 1640, 220, (GOLD_DEEP if dark else GOLD), 32)

    rgb = np.asarray(img.convert("RGB")).astype(np.float32)

    # ── paper grain, into colour and height alike ───────────────────────
    grain = paper_grain((W, H))
    colour = np.clip(rgb + grain[..., None], 0, 255).astype(np.uint8)
    Image.fromarray(colour).save(os.path.join(out, f"label_{'black' if dark else 'lager'}_color.png"))

    # ── height: ink sits proud of the stock; grain under everything ─────
    lum = rgb.mean(axis=2)
    ink = np.clip((lum - 40) / 180, 0, 1)        # anything printed
    height = 128 + ink * 42 + grain * 1.6
    Image.fromarray(np.clip(height, 0, 255).astype(np.uint8)).save(
        os.path.join(out, f"label_{'black' if dark else 'lager'}_height.png"))

    # ── roughness: gold foil is glossy, uncoated stock is not ───────────
    r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    goldness = np.clip((r - b) / 90, 0, 1) * np.clip(lum / 150, 0, 1)
    rough = 0.80 - goldness * 0.56 + grain / 255 * 0.5
    Image.fromarray(np.clip(rough * 255, 0, 255).astype(np.uint8)).save(
        os.path.join(out, f"label_{'black' if dark else 'lager'}_rough.png"))

    print(f"{'black' if dark else 'lager'}: colour + height + roughness at {W}x{H}")


if __name__ == "__main__":
    marks, fonts, out = sys.argv[1], sys.argv[2], sys.argv[3]
    os.makedirs(out, exist_ok=True)
    build(marks, fonts, out, dark=False)
    build(marks, fonts, out, dark=True)


def build_glass_print(marks, fonts, out):
    """The mark screen-printed on the glassware: white Hanuman + gold wordmark.

    Transparent everywhere else — the alpha drives a transparent/ink mix in
    the shader, so the glass stays glass between the strokes.
    """
    W2, H2 = 3072, 1536
    img = Image.new("RGBA", (W2, H2), (0, 0, 0, 0))
    cx = W2 // 2

    fig = load_mark(os.path.join(marks, "hanuman-figure.png"), 680, CREAM)
    word = load_mark(os.path.join(marks, "hanuman-wordmark.png"), 150, GOLD_LIGHT)
    img.alpha_composite(fig, (cx - fig.width // 2, 420 - fig.height // 2))
    img.alpha_composite(word, (cx - word.width // 2, 900 - word.height // 2))

    d = ImageDraw.Draw(img)
    d.text((cx, 1040), "Premium Lager",
           font=ImageFont.truetype(os.path.join(fonts, "PlayfairDisplayItalic.ttf"), 96),
           fill=GOLD_LIGHT + (255,), anchor="mm")

    # a fine gold rule above and below, as on the real glassware
    for y in (150, 1180):
        d.rectangle([cx - 420, y, cx + 420, y + 6], fill=GOLD + (255,))

    img.save(os.path.join(out, "glass_print.png"))
    print(f"glass print at {W2}x{H2}")
