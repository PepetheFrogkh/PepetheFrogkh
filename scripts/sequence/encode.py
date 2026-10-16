"""
Encode en WebP les images rendues par `render.mjs`.

    python3 scripts/sequence/encode.py <dossier de travail> public/sequence

La qualite est a 80 : au-dessus, le poids monte vite pour un rendu 3D lisse
sans que l'oeil y gagne ; en dessous, les degrades du fond se ternissent. La
methode 6 est la plus lente des six, et la plus econome : la sequence n'est
encodee qu'une fois, le visiteur la telecharge a chaque visite.
"""

from __future__ import annotations

import shutil
import sys
from pathlib import Path

from PIL import Image

QUALITY = 80
SETS = ('desktop', 'desktop-2x', 'mobile', 'mobile-2x')


def main() -> None:
    src, out = Path(sys.argv[1]), Path(sys.argv[2])
    for name in SETS:
        folder = out / name
        if folder.exists():
            shutil.rmtree(folder)
        folder.mkdir(parents=True)
        total = 0
        frames = sorted((src / name).glob('*.png'))
        for frame in frames:
            with Image.open(frame) as im:
                dest = folder / (frame.stem + '.webp')
                im.convert('RGB').save(dest, 'WEBP', quality=QUALITY, method=6)
                total += dest.stat().st_size
        size = Image.open(frames[0]).size if frames else (0, 0)
        print(
            f'{name} : {len(frames)} images {size[0]}x{size[1]}, '
            f'{total / 1024 / 1024:.1f} Mo, {total // max(1, len(frames)) // 1024} Ko par image'
        )


if __name__ == '__main__':
    main()
