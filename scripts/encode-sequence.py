"""
Encode la sequence de l'en-tete en WebP.

Les images sont rendues en PNG par `scripts/render-sequence.mjs`, puis
converties ici : le WebP divise le poids par cinq a l'oeil nu sur ce genre
d'aplats, et c'est le format que le cahier demande.

    python3 scripts/encode-sequence.py <dossier des png>
"""

from __future__ import annotations

import shutil
import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent / 'public' / 'sequence'
QUALITY = 82


def encode(src: Path, dest: Path) -> int:
    """Convertit un dossier de PNG en WebP, et rend le poids total en octets."""
    if dest.exists():
        shutil.rmtree(dest)
    dest.mkdir(parents=True)
    total = 0
    for png in sorted(src.glob('*.png')):
        out = dest / (png.stem + '.webp')
        with Image.open(png) as im:
            # aplats et degrades doux : la methode 6 cherche plus longtemps et
            # gagne encore quelques pour cent sur ce type d'image
            im.convert('RGB').save(out, 'WEBP', quality=QUALITY, method=6)
        total += out.stat().st_size
    return total


def main() -> None:
    frames = Path(sys.argv[1])
    for folder in ('desktop', 'mobile'):
        src = frames / folder
        if not src.is_dir():
            raise SystemExit(f'dossier introuvable : {src}')
        size = encode(src, ROOT / folder)
        count = len(list((ROOT / folder).glob('*.webp')))
        print(f'{folder} : {count} images, {size / 1024 / 1024:.2f} Mo')


if __name__ == '__main__':
    main()
