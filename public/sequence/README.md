# La séquence d'images de l'accueil

Ce dossier contient l'animation de l'accueil, dessinée image par image sur un
canvas selon la progression du défilement.

Quatre jeux, deux orientations et deux définitions :

| Dossier | Images | Taille | Poids |
|---|---|---|---|
| `desktop` | 144 | 1920 × 1080 | 3,2 Mo |
| `desktop-2x` | 144 | 3840 × 2160 | 7,8 Mo |
| `mobile` | 60 | 900 × 1350 | 0,9 Mo |
| `mobile-2x` | 60 | 1800 × 2700 | 2,2 Mo |

Le navigateur n'en télécharge qu'un. Il mesure la largeur réelle du canvas,
en pixels, et prend le premier jeu qui la couvre : un portable rétine de 1440
points demande 2880 pixels et reçoit donc le jeu double, un écran ordinaire de
1440 points reçoit le jeu simple. C'est `pick()`, dans
`components/sequence/sequence.ts`.

## Ce qu'elle montre

Des plaques dispersées, les outils, qui s'assemblent en anneau autour d'une
planète, puis tournent autour d'elle. C'est le titre de la page, « on construit
les outils qui font tourner votre entreprise », pris au mot.

Fond crème `#FFF8F3`, plaques en blanc et pêche, accents orange `#FF6B00` et
ardoise `#8A97AB` : la charte, et rien d'autre.

## La refabriquer

La scène est du code, pas un fichier binaire : elle se modifie et se rend à
nouveau. Elle vit dans `scripts/sequence/scene.html`, en Three.js.

```sh
# 1. une copie de Three.js à côté de la scène, et un serveur local :
#    un module ES ne se charge pas depuis file://
cp node_modules/three/build/three.module.js scripts/sequence/
cp node_modules/three/build/three.core.js scripts/sequence/
(cd scripts/sequence && python3 -m http.server 8099 --bind 127.0.0.1 &)

# 2. le rendu, en PNG
node scripts/sequence/render.mjs /tmp/seq

# 3. l'encodage en WebP, qui remplit ce dossier
python3 scripts/sequence/encode.py /tmp/seq public/sequence
```

Le rendu prend un peu plus de deux minutes pour les 408 images, en WebGL
logiciel, et l'encodage environ autant. Rien de tout cela ne part dans le
navigateur du visiteur : il ne reçoit que les WebP.

## Si le nombre d'images change

Mettre `frames` à jour aux deux endroits : `DESKTOP` et `MOBILE` dans
`components/sequence/sequence.ts`, et `SETS` dans
`scripts/sequence/render.mjs`.

## Le chargement

Les dix premières images partent en premier ; dès que la première est décodée,
elle est dessinée et la section devient utilisable. Le reste arrive derrière,
six à la fois. Tant qu'une image manque, c'est la plus proche déjà chargée qui
est dessinée : la séquence est grossière au début, jamais vide. Le texte, lui,
est dans le HTML par-dessus, et lisible avant la première image.
