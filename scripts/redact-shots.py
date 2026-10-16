"""
Caviarde les captures d'application avant publication.

Les captures des outils que nous avons construits montrent de vraies donnees :
des noms de clients, des montants, des poids, des adresses. Rien de tout cela
ne doit sortir, et la regle est simple : on couvre, on ne floute pas. Un flou
sur du texte se remonte, un aplat non.

Les zones sont declarees ici, image par image, en pixels de l'original. Le
script est rejouable : si une capture est refaite, on ajuste ses zones et on
relance, plutot que de retoucher a la main une fois et d'oublier la suivante.

    python3 scripts/redact-shots.py <dossier des originaux> <dossier de sortie>

Chaque zone est (gauche, haut, droite, bas). `label` pose un libelle discret
au milieu du bloc, pour que le lecteur comprenne que c'est volontaire.
"""

from __future__ import annotations

import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

# La teinte des blocs : celle du fond de l'application, un peu eclaircie, pour
# que le caviardage se lise comme un choix et non comme un bug d'affichage.
INK = (28, 28, 30)
EDGE = (62, 58, 48)
# le fond du graphique du tableau de bord, releve sur l'image
CHART = (16, 16, 17)

ZONES: dict[str, list[dict]] = {
    # ── Tableau de bord ────────────────────────────────────────────────────
    # Le lien d'inscription porte un jeton : c'est un secret, pas une donnee
    # d'affichage. Les revenus du mois et l'axe des montants du graphique
    # partent aussi : le frere du fondateur a demande que ses revenus ne
    # sortent pas, et c'est la moindre des choses.
    '5.png': [
        {'box': (300, 230, 1326, 260), 'label': 'lien privé'},
        {'box': (1082, 318, 1225, 346), 'label': 'montant'},
        # L'axe des montants, a droite du graphique. Repeint au fond du
        # graphique comme les barres : un aplat plus clair y dessinerait un
        # rectangle au milieu d'une zone vide, ce qui se voit plus que l'axe.
        {'box': (1390, 756, 1484, 992), 'fill': CHART, 'label': ''},
        # Les barres de revenus elles-memes, repeintes au fond du graphique :
        # sans elles il ne reste que les seances, qui ne sont pas de l'argent.
        # Leurs abscisses ont ete relevees sur l'image, pas estimees a l'oeil.
        {'box': (434, 800, 500, 975), 'fill': CHART, 'label': ''},
        {'box': (786, 865, 852, 975), 'fill': CHART, 'label': ''},
        {'box': (867, 758, 909, 776), 'fill': CHART, 'label': ''},
        {'box': (962, 931, 1028, 975), 'fill': CHART, 'label': ''},
        {'box': (1138, 887, 1203, 975), 'fill': CHART, 'label': ''},
        {'box': (1314, 963, 1379, 975), 'fill': CHART, 'label': ''},
        # la legende « Revenus (CHF) », qui nomme la serie disparue
        {'box': (865, 755, 1002, 782), 'fill': CHART, 'label': ''},
    ],
    # ── Seances ────────────────────────────────────────────────────────────
    # Toute la colonne des clients, de l'en-tete au bas de l'image.
    '6.png': [
        {'box': (290, 232, 500, 1175), 'label': 'clients'},
    ],
    # ── Packs ──────────────────────────────────────────────────────────────
    # Les prix des prestations.
    '7.png': [
        {'box': (888, 130, 1012, 782), 'label': 'prix'},
    ],
    # ── Progression ────────────────────────────────────────────────────────
    # Des noms, et surtout des poids et des IMC : de la donnee de sante sur des
    # personnes identifiables. Les intitules restent, les valeurs partent.
    # Les blocs partent du bord gauche de la carte moins deux pixels : cales
    # plus a droite, ils laissaient voir le liisere dore de la pastille
    # d'initiale, qui depassait sur deux des six cartes.
    '8.png': [
        {'box': (56, 143, 352, 187), 'label': 'client'},
        {'box': (388, 143, 684, 187), 'label': 'client'},
        {'box': (720, 143, 1016, 187), 'label': 'client'},
        {'box': (1052, 143, 1348, 187), 'label': 'client'},
        {'box': (56, 309, 352, 353), 'label': 'client'},
        {'box': (388, 309, 684, 353), 'label': 'client'},
        {'box': (56, 212, 352, 268), 'label': ''},
        {'box': (388, 212, 684, 268), 'label': ''},
        {'box': (720, 212, 1016, 268), 'label': ''},
        {'box': (1052, 212, 1348, 268), 'label': ''},
        {'box': (56, 378, 352, 434), 'label': ''},
        {'box': (388, 378, 684, 434), 'label': ''},
    ],
    # 9.png ne contient ni nom, ni montant, ni donnee de sante : les niveaux de
    # fidelite sont le produit d'Anakut, pas la donnee de ses clients.
}


def font(size: int) -> ImageFont.ImageFont:
    for name in (
        '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',
        '/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf',
    ):
        if Path(name).exists():
            return ImageFont.truetype(name, size)
    return ImageFont.load_default()


def redact(src: Path, dest: Path, zones: list[dict]) -> None:
    with Image.open(src) as im:
        im = im.convert('RGB')
        draw = ImageDraw.Draw(im)
        for zone in zones:
            box = zone['box']
            own = zone.get('fill')
            # Une zone repeinte au fond de son conteneur n'a pas de contour :
            # elle doit disparaitre, pas se signaler.
            draw.rectangle(box, fill=own or INK, outline=None if own else EDGE, width=1)
            text = zone.get('label') or ''
            if not text:
                continue
            height = box[3] - box[1]
            f = font(max(11, min(15, height - 14)))
            left, top, right, bottom = draw.textbbox((0, 0), text, font=f)
            x = box[0] + (box[2] - box[0] - (right - left)) / 2
            y = box[1] + (height - (bottom - top)) / 2
            draw.text((x, y), text, font=f, fill=(138, 151, 171))
        im.save(dest, optimize=True)
        print(f'{dest.name} : {len(zones)} zone(s) couverte(s)')


def main() -> None:
    src_dir, out_dir = Path(sys.argv[1]), Path(sys.argv[2])
    out_dir.mkdir(parents=True, exist_ok=True)
    for name, zones in ZONES.items():
        redact(src_dir / name, out_dir / name, zones)
    # les captures sans donnee sensible passent telles quelles
    for name in sorted(p.name for p in src_dir.glob('*.png')):
        if name not in ZONES and (src_dir / name).is_file():
            with Image.open(src_dir / name) as im:
                im.convert('RGB').save(out_dir / name, optimize=True)
            print(f'{name} : aucune zone, copiee telle quelle')


if __name__ == '__main__':
    main()
