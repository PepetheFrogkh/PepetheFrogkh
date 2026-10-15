# Ce qu'il nous faut de votre côté

Relevé le 15 octobre 2026, en parcourant le site page par page.

**Les emplacements `[À FOURNIR]` ont disparu de l'écran.** Un site public qui
montre ses trous se lit comme un brouillon. Trois règles les remplacent :

- un bloc sans contenu ne s'affiche pas, au lieu d'afficher son emplacement ;
- une page à qui il manque l'essentiel n'a pas d'adresse du tout : ni menu, ni
  liste, ni pied de page, ni sitemap, et 404 à son adresse ;
- ce qui manque reste relevé par `node scripts/trous.mjs`, qui lit les fichiers
  de contenu et liste les manques un par un, et par ce document.

Rien n'a été inventé pour combler quoi que ce soit.

Quand un élément est fourni, il remplace l'emplacement : aucun autre code n'est
à écrire.

**Il ne reste plus aucun `[À FIXER]`.** Les 26 lignes de prix qui n'existaient
que dans une devise sont converties : un prix s'écrit dans une seule devise et
l'autre se calcule, au taux et à l'arrondi fixés dans `lib/prices.ts`.

---

## 1. Les réalisations, et leurs captures

C'est le plus gros poste restant, et il explique la plupart des emplacements
du site : les pages Services et Expertises renvoient toutes vers une
réalisation, et elles attendent donc la même chose.

### Anakut et MP Massage : tout reste à fournir

Les deux pages n'ont que le nom, la ville et le lien du site.

- **Le résultat en une ligne**, celui qui s'affiche sur la carte et en haut de
  la page.
- **Le contexte** : qui est le client, ce qu'il faisait avant.
- **Le besoin** : ce qu'il nous a demandé.
- **Les chiffres**, s'il y en a de vérifiables. Sinon la page le dit, et c'est
  très bien.
- **Le mot du client** : une phrase, son nom, et son accord pour la publier.
- **Les captures** : une vue ordinateur, une vue téléphone, et une vignette
  pour la carte de la liste. Ou l'autorisation de les prendre nous-mêmes.
- **L'accord écrit du client** pour apparaître avec son nom.

### Anakut : complète, côté coach

Les cinq captures de l'espace coach sont en ligne, caviardées. Manquent les
captures de **l'espace client** : vous me les avez montrées, mais elles ne sont
pas arrivées sous forme de fichiers. Renvoyez-les et je les installe.

### MP Massage : écrite, il manque les captures

### Wave : écrite, il manque les images et la citation

Le contexte, le besoin, ce qui a été construit et les deux chiffres sont en
ligne. Manquent :

- **Les captures** de l'application et de son outil de gestion.
- **Le mot du client**, si vous l'obtenez. Sinon la page reste telle quelle.

### Chaque client n'apparaît plus qu'à un seul endroit

Anakut figurait en preuve sur quatre pages, MP Massage et Wave sur deux
chacune. Vous avez raison : trois clients répartis sur huit pages, ça se voit.

Un client, un service, plus la page Réalisations :

| Client | Où il apparaît |
|---|---|
| Anakut | Services, Sites web |
| MP Massage | Services, Applications métier |
| Wave | Services, Projets sur mesure |

**Les pages Expertises ne portent plus de réalisation liée du tout.** Quand
vous aurez d'autres clients, elles en reprendront.

### La règle sur les captures

Toute capture qui montre de la donnée réelle passe par
`scripts/redact-shots.py` avant d'entrer dans le dépôt. On **couvre**, on ne
floute pas : un flou sur du texte se remonte, un aplat non. Sont couverts sans
exception les noms de clients, les montants, les coordonnées, et les données de
santé (poids, IMC). Les zones sont déclarées par image dans le script, donc une
capture refaite se re-caviarde en une commande au lieu d'être retouchée à la
main et oubliée la fois suivante.

### OCS : volontairement éteinte

Rien à fournir pour l'instant. La page répond 404 et le projet n'apparaît ni
dans les listes, ni dans les menus, ni dans le sitemap, comme convenu. Pour
l'ouvrir plus tard il faudra la ville, les coordonnées, le lien et l'accord,
puis `NEXT_PUBLIC_SHOW_OCS=true`.

### Trois vidéos, facultatives

L'accueil accepte jusqu'à trois vidéos courtes, muettes, qui s'agrandissent au
défilement. Aucune n'est nécessaire.

---

## 2. Les témoignages

Trois emplacements sur l'accueil et la page Réalisations. Pour chacun : **la
phrase, le nom, le rôle, la société, et l'accord de publication**. Un seul
témoignage réel vaut mieux que trois inventés.

---

## 3. Deux expertises incomplètes

Elles sont neuf désormais, Automatisation et Intelligence artificielle
comprises.

### Assurance et courtage : hors du site, faute de contenu

Vous ne m'avez rien donné dessus, donc **la page n'existe plus** : elle ne
figure ni dans le menu, ni dans la liste des expertises, ni dans le pied de
page, ni dans le sitemap, et son adresse répond 404. Mieux vaut une page de
moins qu'une page vide.

Il faut l'accroche, ce que nous comprenons du métier, les problèmes typiques,
ce que nous proposons, et « Notre expérience » si vous en avez une à y mettre.
Dès que l'accroche et l'un des trois blocs sont là, la page revient toute
seule.

Si Wave est votre seule entrée dans ce secteur, dites-le et je rédige la page
autour de ce projet.

### Intelligence artificielle : écrite, sauf « Notre expérience »

La page est rédigée : ce que nous comprenons du métier, les problèmes typiques,
ce que nous proposons. Deux blocs ne s'affichent pas, faute de contenu.

- **« Notre expérience »**. Vous ne m'avez parlé d'aucun travail d'IA, ni chez
  vous, ni chez Louis, et je n'en ai inventé aucun. Si l'un de vous a mis une
  étape d'IA en production quelque part, dites-le moi et la page le dira.
- **Une réalisation liée**. Voir ci-dessous : les expertises n'en portent plus.

Le reste est écrit sur une ligne de conduite précise, que vous pouvez refuser :
l'IA y est présentée comme une étape dans un flux, jamais comme un produit, et
la page dit franchement là où elle est mauvaise. Si vous voulez un discours
plus vendeur, c'est à vous de le dire, mais je vous le déconseille : sur ce
sujet précis, tous vos concurrents promettent la lune.

### Automatisation : complète

Rien à fournir. « Notre expérience » s'appuie sur vos trois ans en gestion de
données et de flux automatisés, et sur les deux éditeurs de caisses. La page
renvoie vers Anakut.

---

## 4. Des photographies, pour les pages Expertises

Vous m'avez demandé des photos Unsplash. **La politique réseau de cet
environnement les refuse toutes** : `images.unsplash.com`, `unsplash.com`,
`pexels.com`, `picsum.photos`, toutes répondent par un refus du proxy avant
même qu'une requête parte. Je ne peux donc en télécharger aucune d'ici.

Deux façons d'avancer :

1. **Ouvrir le domaine** : ajouter `images.unsplash.com` dans **Network
   access** des réglages de l'environnement, sous Allowed domains. Les étapes
   sont sur <https://code.claude.com/docs/en/cloud-environments#network-access>.
   Je les installe ensuite moi-même.
2. **Me les envoyer** : neuf images, une par métier, en 1600 px de large au
   moins. C'est de toute façon mieux : une photo de banque d'images dit « site
   d'agence » et rien d'autre, alors qu'une photo d'un vrai service, d'un vrai
   atelier, d'une vraie réception vaut dix fois plus.

En attendant, chaque métier a **son pictogramme**, dessiné au trait dans la
charte : en grand dans l'en-tête de sa page, en vignette sur les cartes. Ce
n'est pas un emplacement vide, c'est un parti pris qui tient debout tout seul.

---

## 5. Les deux photos des fondateurs

Les biographies sont écrites. Il manque **votre portrait et celui de Louis**.
L'emplacement garde déjà sa place dans la mise en page, donc rien ne bougera
quand elles arriveront.

---

## 6. Cinq faits légaux

Ils engagent la société : ils ne s'inventent pas. L'introduction de la page dit
au lecteur que l'enregistrement est en cours.

| Page | Ce qui manque |
|---|---|
| Mentions légales | La forme juridique |
| Mentions légales | Le numéro d'enregistrement |
| Mentions légales | L'adresse complète du siège |
| Mentions légales | Les coordonnées légales de Hostinger |
| Mentions légales | La juridiction compétente |
| Confidentialité | Où HubSpot héberge les données |
| Confidentialité | La durée de conservation que vous retenez |

Tout le reste y est : la dénomination, le siège à Phnom Penh, le directeur de
la publication, le contact, l'hébergeur et la localisation du serveur, la
propriété intellectuelle, les prix, les simulateurs, les cookies et les droits
du visiteur.

**Un juriste devrait relire ces deux pages avant la mise en ligne.** Elles sont
rédigées à partir de ce que vous m'avez dit et de ce que le code fait
réellement, mais ce sont des textes qui engagent.

---

## 7. Trois points de votre dictée que je n'ai pas devinés

Tout le reste de ce que vous m'avez donné est en ligne. Ces trois-là ne le sont
pas, ou pas comme vous l'avez dit, parce que deviner un nom de produit ou une
durée d'engagement sur un site commercial ne se fait pas.

### L'outil vidéo

Vous avez dit « du **Xfield** pour tout ce qui peut être vidéo ». Je n'ai pas
trouvé de produit de ce nom, et je ne l'ai donc pas publié. Si c'est
**Higgsfield**, dites-le et je l'ajoute à la famille 3D de la page, qui devient
« 3D et vidéo ». Si c'est autre chose, donnez-moi le nom exact.

### Mistral

Vous avez dit « **Nostra** ». J'ai publié **Mistral**, qui est le seul modèle
connu dont le nom s'en approche, et qui a sa place à côté de Claude, GPT et
Gemini. Si ce n'était pas lui, c'est un mot à changer.

### Trois mois, ou quatre ?

Vous avez dit trois mois minimum deux fois, puis « voire même pas, c'est au
minimum sur **quatre** mois d'engagement ». **J'ai publié trois.** C'est le
chiffre que vous avez donné en premier et le plus souvent, mais votre dernière
phrase le corrige, et c'est un engagement contractuel : il faut trancher.

C'est une seule valeur à changer, `MIN_MONTHS` dans `lib/prices.ts`, plus la
phrase correspondante dans les deux fichiers de contenu.

---

## 8. Les neuf marques du simulateur

Le simulateur d'automatisation nomme désormais les outils au lieu de citer des
catégories : Excel, Google Workspace, Teams, Slack, WhatsApp, Telegram,
HubSpot, Mailchimp et Odoo, chacun avec son logo.

C'est un usage référentiel, celui qui consiste à nommer un produit que l'on
sait brancher, sans prétendre ni partenariat ni agrément. C'est courant et
généralement admis, mais chaque marque publie ses propres règles, et
**Microsoft et Slack sont parmi les plus strictes**.

**Une décision vous revient, et elle n'est pas technique** : garder ces neuf
marques après lecture de leurs chartes, n'en garder que certaines, ou revenir
à des catégories sans marque. Le détail, et ce qu'il faut toucher pour en
retirer une, sont dans `public/tools/README.md`.

---

## 9. Les réglages du serveur

À poser sur Hostinger avant la mise en ligne. Les valeurs de développement sont
déjà dans `.env.local`, qui n'est jamais poussé sur GitHub.

| Variable | État |
|---|---|
| `HUBSPOT_TOKEN` | Fournie. **À régénérer** avant la mise en ligne. |
| `MESHY_API_KEY` | Fournie, mais inutilisée : voir plus bas. |
| `NEXT_PUBLIC_SITE_URL` | `https://www.kuiperstudio.com` |
| `NEXT_PUBLIC_BOOKING_URL` | Facultative. Sans elle, le bouton de prise de rendez-vous ne s'affiche pas. |
| `LEAD_NOTIFY_WEBHOOK` | Facultative : une alerte à chaque demande reçue. |
| `NEXT_PUBLIC_SHOW_OCS` | À laisser absente tant qu'OCS n'est pas fini. |
| `NEXT_PUBLIC_SHOW_WAVE` | À laisser absente : Wave est ouverte par défaut. La poser à `false` la referme. |

---

## 10. Deux décisions qui vous reviennent

### Le taux euro vers dollar

Il est à **1,02 dollar par euro** dans `lib/prices.ts`, déduit du seul point
fixe que vous m'avez donné : 399 $ pour un flux à 390 €. Le change réel est
autour de 1,15, donc un client en dollars paie environ **11 % moins cher**
qu'un client en euros.

Si c'est voulu, rien à faire. Sinon, **une seule ligne à changer** et toute la
grille suit.

### Le prix de l'accompagnement

La page annonce « sur devis ». Vous ne m'avez pas donné de montant, et une
mission de six mois dépend du nombre d'outils à brancher. Si vous voulez un
forfait affiché, donnez-le moi.

C'est maintenant le dernier « sur devis » décidé, avec l'écoute client et le
niveau direction technique. L'ERP en est un aussi, mais par choix : vous avez
demandé que son prix ne soit plus affiché.

---

## 11. La traduction khmère

Le site parle trois langues et le sélecteur les propose toutes les trois, mais
**les pages `/km` servent encore le texte anglais**, avec un bandeau qui le dit
au visiteur. Elles sont volontairement hors du sitemap, des balises hreflang et
de l'index des moteurs : annoncer une traduction qui n'existe pas ferait traiter
la version khmère comme un doublon de la version anglaise.

Il faut la **traduction complète**, environ trois cents chaînes. Le plus simple
est que je vous exporte le texte français ou anglais dans un fichier à remplir.
Dites-moi lequel des deux sert de source.

Aucune phrase khmère n'a été écrite de notre propre chef.

---

## 12. L'anneau nomme maintenant les outils

Vous m'avez demandé de poser de vrais logos sur les plaques de l'anneau, pour
montrer qu'on sait faire le lien. C'est fait : une plaque sur trois porte un
logo, et ces plaques-là sont blanches, parce que sur l'ardoise et sur l'orange
vif un logo de marque ne se lit plus. Les neuf se suivent dans l'ordre, donc on
les lit tous en un tour.

Ce sont les **mêmes fichiers que le simulateur**, donc la décision du point 7
vaut aussi pour l'anneau : si vous retirez une marque, elle disparaît des deux
endroits d'un coup.

---

## 13. Meshy, et l'animation 3D

Vous m'avez donné deux clés Meshy. **Aucune des deux n'a servi**, et la raison
n'a rien à voir avec les clés.

### Le réseau refuse le domaine

La politique réseau de cet environnement refuse `api.meshy.ai` : la connexion
est coupée par le proxy avant même qu'une requête parte, donc la clé ne quitte
jamais la machine. C'est pour cela que la seconde clé a donné exactement le
même résultat que la première.

Pour l'autoriser, il faut ajouter ce domaine dans **Network access** des
réglages de l'environnement (le menu de l'environnement dans la barre de titre,
puis Edit), sous Allowed domains, en laissant la case des gestionnaires de
paquets cochée. Les étapes sont sur
<https://code.claude.com/docs/en/cloud-environments#network-access>.

**Les deux clés sont à régénérer.** Elles ont circulé dans une conversation,
et la seconde en clair. Elles ne sont dans aucun fichier du dépôt.

### Et ce n'est de toute façon pas le bon outil

Meshy fabrique des **modèles** 3D, alors que l'accueil a besoin d'une
**séquence d'images rendue**. Un modèle Meshy ne se pose pas sur une page : il
faut encore une scène, des lumières, une caméra, une animation et un rendu
image par image. C'est exactement ce travail-là qui fait l'animation, et le
modèle n'en est qu'une pièce.

Elle est donc produite ici, en Three.js : des plaques dispersées, les outils,
qui s'assemblent en anneau autour d'une planète, puis tournent. La scène est du
code, dans `scripts/sequence/scene.html`, et se refabrique en deux commandes.

**Elle est maintenant rendue en 4K.** Elle était à 1600 pixels de large, ce qui
était trop peu : un canvas plein écran sur un portable rétine en fait 2880, et
l'image y était étirée d'un tiers. D'où le flou que vous avez vu. Quatre jeux
existent désormais, 1920 et 3840 en paysage, 900 et 1800 en portrait, et le
navigateur ne télécharge que celui qui correspond à l'écran.

**Rien à fournir.** Si l'animation ne vous plaît pas, dites ce qui ne va pas :
c'est une scène, elle se modifie.

### Et l'en-tête a maintenant sa vague WebGL

C'est une seconde animation, distincte de la séquence, et celle-là tourne
vraiment dans le navigateur : une nappe de 34 000 points dont la hauteur est
calculée par la carte graphique à chaque image. Elle réagit au curseur et au
défilement.

Elle occupe la moitié droite du premier écran et s'éteint en dégradé là où le
titre se lit : le texte est posé sur du crème pur à toutes les largeurs, dans
les deux langues, et c'est mesuré, pas estimé. C'était le défaut qui l'avait
fait retirer la première fois.

Quatre cas la remplacent par une image fixe en CSS, sans jamais laisser de zone
blanche : pas de WebGL, machine qui tient moins de 30 images par seconde,
visiteur qui demande moins d'animation, visiteur en économie de données. Hors
de l'écran, la boucle s'arrête.

Elle vit dans `components/hero/`, et sa route de test est `/lab/vague`.

---

## Par quoi commencer

Dans l'ordre d'impact :

1. **Une réalisation complète**, Anakut ou MP Massage, avec l'accord du client.
   C'est le poste qui débloque le plus de pages d'un coup : l'accueil, les cinq
   pages Services et les six pages Expertises attendent toutes une réalisation
   à montrer.
2. **Les cinq faits légaux**, dès que l'enregistrement est délivré.
3. **Vos deux photos**, qui prennent cinq minutes.
4. **La traduction khmère**, quand vous voudrez, puisqu'elle ne bloque rien :
   le site fonctionne en français et en anglais, et les pages khmères sont
   honnêtes sur leur état.
