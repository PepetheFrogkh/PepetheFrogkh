# La sequence d'images de l'en-tete

Ce dossier contient aujourd'hui une **sequence de test**, fabriquee par
`scripts/make-test-sequence.py`. Chaque image porte son numero, ce qui permet
de verifier que le defilement tombe bien sur la bonne.

## Deposer la vraie sequence

1. Exportez l'animation en WebP, numerotee a partir de 1, sur quatre chiffres :
   `0001.webp`, `0002.webp`, et ainsi de suite.
2. `desktop/` : 120 a 180 images, environ 1 600 px de large.
   `mobile/` : 60 images, en portrait.
3. Si le nombre d'images change, mettez `DESKTOP.frames` et `MOBILE.frames` a
   jour dans `components/sequence/sequence.ts`.
4. Passez `PROVIDED` a `true` dans ce meme fichier : l'emplacement
   [À FOURNIR] pose par-dessus le canvas disparait.

## A savoir

Le fond doit etre le creme de la charte, `#FFF8F3`, et les tons orange ceux de
la charte : `#FF6B00` et `#FFE3CF`. La sequence est dessinee en « couvrir »,
donc elle est recadree sur les bords selon le format de l'ecran : gardez le
sujet au centre.

Chaque image est chargee telle quelle par le navigateur. A 1 600 px, visez
moins de 60 ko par image, sinon la sequence complete pese plusieurs dizaines
de megaoctets.
