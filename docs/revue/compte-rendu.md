# Revue du 14 octobre 2026 · ce qui a change

Un commit par point, dans l'ordre demande.

| | Point | Commit |
|---|---|---|
| 1 | Titre de l'accueil lisible au defilement | `5f90198` |
| 2 | Premier ecran complet, moitie droite remplie | `4366fef` |
| 3 | Plus d'ecran vide pendant le defilement | `c2f40d5` |
| 4 | `/lab/hero` : tableur a droite du texte, repli, `?debug=1` | `e9fa8da` |
| 5 | Rideau d'ouverture et onde au survol | `0efd1e8` |

## 1. Titre de l'accueil

Supprime : l'agrandissement de la derniere ligne, le trait orange, et toute la
chronologie de defilement de l'en-tete (epinglage, montee des trois premieres
lignes, axes SOFT et WONK de Fraunces).

Reste : l'apparition au chargement, en CSS pur. Chaque ligne glisse du bas vers
le haut dans son propre masque, decalee de 90 ms sur la precedente.

L'approche passe de -0,04 em a -0,015 em, la hauteur de ligne de 0,94 a 0,98,
et le masque recoit du remplissage repris en marge negative pour laisser
passer accents et jambages sans ecarter les lignes.

**Verifie** a 1366x768, 1440x900 et 390x844 : chevauchement de 0 px entre
lignes voisines aux positions de defilement 0, 200, 400, 700, 1000 et 1400.
Aucune erreur de console, aucun debordement horizontal.

## 2. Premier ecran

Le titre passe de `min(8,4vw, 12vh)` a `min(7,6vw, 9,6vh)`. L'ecart titre /
sous-titre passe de `clamp(24px, 4vh, 48px)` a `clamp(16px, 2vh, 32px)`, et la
colonne de texte se centre au lieu de repartir l'espace : la hauteur restante
va au-dessus et en dessous du bloc, jamais entre deux lignes. Le pied repasse
sur une seule colonne, sinon la colonne des boutons prenait toute la largeur et
ecrasait le sous-titre a zero.

Au-dela de 1 200 px, la composition passe en deux colonnes : texte a gauche,
trois cartes en escalier a droite sur une tache de peche. Ces cartes sont
decoratives, `aria-hidden`, sans etiquette, sans chiffre, sans nom, et sans
image a charger. Sous 1 200 px elles disparaissent pour laisser le premier
ecran au texte.

**Verifie** a 1024x768, 1199x768, 1200x768, 1280x800, 1366x768, 1440x900,
1512x982, 1920x1080, 768x1024 et 390x844 : etiquette, titre, sous-titre, les
deux boutons et la note tiennent tous dans le premier ecran. Les trois cartes
aussi.

## 3. Ecrans vides

Quatre causes mesurees.

- Le fondu des blocs se declenchait a 12 % du bloc visible, dans une fenetre
  reduite de 8 % en bas, et durait 500 ms. Il se declenche maintenant a 15 %,
  sans fenetre reduite, et le decalage plus la transition tiennent ensemble
  dans 300 ms. Un bloc deja a l'ecran au chargement n'est plus cache pour etre
  montre ensuite. Le contenu est visible par defaut : l'attribut qui cache
  n'apparait qu'une fois le composant monte, donc sans JavaScript la page se
  lit entierement.
- Le masque des etudes de cas s'ouvrait en 900 ms avec jusqu'a 270 ms de
  decalage. Il tient lui aussi dans 300 ms, et une carte deja visible n'est
  plus masquee du tout.
- L'eventail des realisations posait ses cartes a 35 % d'opacite et 38 % plus
  bas tant que le defilement ne les avait pas deployees. Les cartes sont
  desormais entieres et opaques au repos ; seul l'eventail suit le defilement.
- Les cartes de situation cachaient leur citation, leurs etiquettes et leur
  lien jusqu'au survol : cinq colonnes vides sous le titre. Le corps reste
  visible, la citation est ramenee a trois lignes repliee, et la hauteur passe
  a 560 px pour que la carte la plus chargee tienne en entier.

En plus : le rythme vertical passe de 128 a 96 px et les captures de sites
passent au format paysage. Le document perd 900 px.

**Verifie** par un balayage de toute la page, un demi-ecran a la fois, en
mesurant la part de l'ecran couverte par du contenu reellement visible, a
l'arrivee puis 340 ms plus tard, a 1366x768 et 390x844. Les deux mesures sont
identiques partout sauf a un endroit ou le fondu finit entre les deux : plus
rien n'est invisible au-dela de 300 ms. Verifie aussi sans JavaScript et en
mouvement reduit : aucun bloc cache, aucun masque ferme.

## 4. `/lab/hero`

La scene occupait tout l'ecran, derriere le texte. Elle occupe maintenant la
moitie droite au-dela de 1 000 px, et le bas de l'ecran en dessous. Le texte
reste colle en haut pendant tout le rangement, donc la moitie gauche ne se vide
jamais.

La geometrie suit : trois cartes cote a cote dans un cadre deux fois plus haut
que large auraient ete trois timbres. Les cartes sont en paysage et empilees,
et la camera recule juste assez pour que la feuille et la pile tiennent dans le
cadre, a partir du rapport reel du cadre et non d'une valeur figee. Les
cellules occupent tout le pas en largeur et la moitie en hauteur : rangees
elles se touchent et forment des barres continues, en feuille elles s'ecartent
et redeviennent des lignes de tableur.

L'aimant du curseur ne marchait pas : le canvas est decoratif et ne recoit
aucun evenement de pointeur, donc la position restait au centre de la scene. Le
curseur est desormais suivi sur la fenetre et converti en unites de scene avec
la camera du moment.

Il n'y a plus de zone blanche a aucun moment. Une image fixe en CSS, les memes
trois cartes que la moitie droite de l'accueil, tient la place tant que la
scene n'a rien dessine, et reprend la main dans deux cas : pas de contexte
WebGL, ou moins de 30 images par seconde tenues une seconde et demie apres deux
secondes de chauffe.

Le lecteur de mise au point ne s'affiche plus qu'avec `?debug=1`. `?fps=0`
desarme le garde-fou, pour regarder la scene sur une machine sans carte
graphique.

**Verifie** a 1366x768 et 390x844 : feuille en desordre visible des le
chargement a droite du texte, rangement en trois cartes lisibles au defilement,
noms des cartes nets au-dessus de chaque carte, 294 cellules sur grand ecran et
150 sur mobile. Les trois chemins de repli sont verifies un par un. Sans
`?debug=1`, le lecteur est absent. L'aimant est verifie en comparant deux
rendus : curseur loin, aucune cellule en avance ; curseur dans le cadre, un
groupe se range en avance autour de lui.

## 5. Le jeu d'animations

Deja en place, verifies plutot que refaits :

- Lenis branche sur ScrollTrigger.
- Curseur inertiel « Voir » au survol des realisations : s'affiche a
  l'opacite 1 avec le bon mot.
- Boutons aimantes plafonnes a 8 px : deplacement mesure de 4,6 px sur 2,0 px.
- Revelation par masque des images.

Ajoutes :

- **Le rideau d'ouverture** : fond creme, compteur de 0 a 100 en bas a gauche.
  Il est dans le HTML rendu par le serveur, sinon le contenu apparaitrait avant
  lui. Il se leve de deux facons et la plus rapide gagne : par le JavaScript
  des que la page est chargee, ou par la feuille de style sinon, 800 ms
  d'attente puis 400 ms de levee comptes depuis le premier affichage. Verifie
  sans JavaScript : le rideau est parti, en `visibility: hidden`, sans ecouteur
  de clic derriere lui. Il n'existe pas en mouvement reduit.
- **L'onde au survol** des images masquees : un halo orange tres clair qui part
  du point exact touche par le curseur et se dissipe en 600 ms. L'image reste
  lisible pendant toute la duree. Seulement sur un appareil a souris.

## 6. Ce qui n'a pas ete touche

- Aucun fichier de `content/` n'a ete modifie : l'accueil n'est pas migre vers
  le nouveau positionnement, on attend la validation de `/lab/hero`.
- Aucun `[À FOURNIR]` remplace. Les creux de remplissage qui restent sur
  l'accueil sont tous des emplacements : captures de sites, logos clients,
  temoignages, configurateur de prix.
- Aucune particule, aucune orbite, aucune fusee. Aucun fond sombre : la charte
  ne declare toujours aucun theme sombre, pas meme sous
  `prefers-color-scheme`.

## 7. Captures

| Fichier | Ce qu'il montre |
|---|---|
| `accueil-1366x768.png` | premier ecran de `/fr`, 1366x768 |
| `accueil-390x844.png` | premier ecran de `/fr`, 390x844 |
| `lab-hero-1366x768.png` | premier ecran de `/lab/hero`, 1366x768 |
| `lab-hero-390x844.png` | premier ecran de `/lab/hero`, 390x844 |
| `lab-hero-rangement-1366x768.png` | `/lab/hero` en plein rangement des cellules |
| `lab-hero-cartes-1366x768.png` | `/lab/hero` a la fin : les trois cartes |

## Ce qui n'a pas pu etre verifie ici

Le conteneur de travail n'a pas de carte graphique : WebGL y tourne en logiciel
(SwiftShader). Deux consequences.

Les images par seconde mesurees ici ne veulent rien dire. Sur grand ecran la
scene y tombe sous 30 i/s et le repli se declenche de lui-meme, ce qui a au
moins servi a verifier le repli grandeur nature. Les captures de `/lab/hero`
sont donc prises avec `?fps=0`, qui desarme le garde-fou. Le vrai debit est a
mesurer sur votre machine, en ouvrant `/lab/hero?debug=1`.

Le site en ligne `www.kuiperstudio.com` reste inaccessible depuis ce conteneur,
bloque par la politique de sortie reseau : aucune comparaison avec la version
publiee n'a pu etre faite.
