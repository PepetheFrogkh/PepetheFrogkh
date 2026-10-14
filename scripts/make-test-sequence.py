"""
Fabrique la sequence d'images de test de l'en-tete.

Ces images ne sont pas la sequence finale : elles existent pour que le
composant soit jugeable avant que l'animation 3D ne soit fournie. Chacune
porte son numero, ce qui permet de verifier d'un coup d'oeil que le defilement
tombe bien sur la bonne image.

Rendu : une pile de plaques vue en trois dimensions, qui pivote et s'ouvre en
eventail au fil de la sequence. Projection perspective ecrite a la main, pas
de moteur 3D : il ne s'agit que de tenir la place.

    python3 scripts/make-test-sequence.py
"""

from __future__ import annotations

import math
from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent.parent / 'public' / 'sequence'

CREAM = (255, 248, 243)
WHITE = (255, 255, 255)
BORDER = (239, 230, 222)
ORANGE = (255, 107, 0)
PEACH = (255, 227, 207)
SLATE = (138, 151, 171)

PLATES = 12
FOCAL = 1.05          # en fraction de la largeur
CAMERA_Z = 9.0


def project(x: float, y: float, z: float, w: int, h: int) -> tuple[float, float]:
    f = FOCAL * w
    d = z + CAMERA_Z
    return (w / 2 + f * x / d, h / 2 - f * y / d)


def turn(x: float, z: float, angle: float) -> tuple[float, float]:
    c, s = math.cos(angle), math.sin(angle)
    return (x * c + z * s, -x * s + z * c)


def quad(x0: float, x1: float, y0: float, y1: float, z: float, angle: float,
         w: int, h: int) -> list[tuple[float, float]]:
    corners = []
    for x, y in ((x0, y0), (x1, y0), (x1, y1), (x0, y1)):
        rx, rz = turn(x, z, angle)
        corners.append(project(rx, y, rz, w, h))
    return corners


def frame(t: float, w: int, h: int) -> Image.Image:
    """t va de 0 a 1 : la pile pivote et s'ouvre."""
    image = Image.new('RGB', (w, h), CREAM)
    draw = ImageDraw.Draw(image)

    angle = -0.42 + t * 0.84
    gap = 0.05 + t * 0.4
    lift = t * 0.34

    plates = []
    for i in range(PLATES):
        z = (i - (PLATES - 1) / 2) * gap
        _, rz = turn(0.0, z, angle)
        plates.append((rz, i, z))
    # les plaques du fond se dessinent les premieres
    plates.sort(reverse=True)

    half_w, half_h = 1.45, 0.9
    for _, i, z in plates:
        y_off = (i - (PLATES - 1) / 2) * lift * 0.18
        body = quad(-half_w, half_w, -half_h + y_off, half_h + y_off, z, angle, w, h)
        draw.polygon(body, fill=WHITE, outline=BORDER)

        # l'entete orange, puis deux barres peche
        top = half_h + y_off
        bar_h = (2 * half_h) * 0.1
        head = quad(-half_w * 0.82, -half_w * 0.1, top - bar_h * 1.9, top - bar_h * 0.9,
                    z, angle, w, h)
        draw.polygon(head, fill=ORANGE)
        for k, width in ((3.4, 0.72), (5.2, 0.52)):
            bar = quad(-half_w * 0.82, -half_w * 0.82 + 2 * half_w * width,
                       top - bar_h * (k + 0.9), top - bar_h * k, z, angle, w, h)
            draw.polygon(bar, fill=PEACH)

    return image


def write(folder: str, count: int, w: int, h: int) -> None:
    out = ROOT / folder
    out.mkdir(parents=True, exist_ok=True)
    for old in out.glob('*.webp'):
        old.unlink()
    for i in range(count):
        t = i / (count - 1)
        image = frame(t, w, h)
        draw = ImageDraw.Draw(image)
        # le numero : il rend la sequence de test reconnaissable au premier
        # coup d'oeil, et sert a verifier le calage sur le defilement
        draw.text((w - 190, h - 40), f'test {i + 1:03d} / {count}', fill=SLATE)
        image.save(out / f'{i + 1:04d}.webp', 'WEBP', quality=72, method=5)
    print(f'{folder}: {count} images de {w}x{h}')


if __name__ == '__main__':
    write('desktop', 144, 1600, 900)
    write('mobile', 60, 800, 1200)
