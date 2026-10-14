# La sequence d'images de l'en-tete

Ce dossier contient la sequence de l'accueil : 144 images en paysage pour le
bureau, 60 en portrait pour le telephone, dessinees une par une sur un canvas
selon la progression du defilement.

## Ce qu'elle montre

Des plaques dispersees, les outils, qui s'assemblent en anneau autour d'une
planete, puis tournent autour d'elle. C'est le titre de la page, « on construit
les outils qui font tourner votre entreprise », pris au mot.

Fond creme `#FFF8F3`, plaques en blanc et peche, accents orange `#FF6B00` et
ardoise `#8A97AB` : la charte, et rien d'autre.

## La refabriquer

La scene est du code, pas un fichier binaire : elle se modifie et se rend a
nouveau. Elle vit dans `scripts/sequence/scene.html`, en Three.js.

```sh
# 1. une copie de Three.js a cote de la scene, et un serveur local :
#    un module ES ne se charge pas depuis file://
cp node_modules/three/build/three.module.js scripts/sequence/
cp node_modules/three/build/three.core.js scripts/sequence/
(cd scripts/sequence && python3 -m http.server 8099 --bind 127.0.0.1 &)

# 2. le rendu, en PNG
node scripts/render-sequence.mjs /tmp/seq

# 3. l'encodage en WebP, qui remplit ce dossier
python3 scripts/encode-sequence.py /tmp/seq/frames
```

Le rendu prend une quarantaine de secondes pour les 204 images, en WebGL
logiciel. Rien de tout cela ne part dans le navigateur du visiteur : il ne
recoit que les WebP.

## Si le nombre d'images change

Mettre `DESKTOP.frames` et `MOBILE.frames` a jour dans
`components/sequence/sequence.ts`, et le nombre d'images de
`scripts/render-sequence.mjs` avec.

## Le poids

Environ 2,7 Mo pour le bureau et 0,9 Mo pour le telephone. Les dix premieres
images se chargent avant de rendre la main, le reste arrive derriere : la page
reste lisible pendant le chargement.
