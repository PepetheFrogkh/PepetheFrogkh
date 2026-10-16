# Kuiper Studio

Le site de Kuiper Studio, en français et en anglais : clair, crème et orange, un en-tête
typographique et des animations au défilement. Next.js 15, React 19, TypeScript, GSAP
ScrollTrigger, Lenis. Aucun WebGL, aucune image dans l'en-tête.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
npm run typecheck
```

Node 20 ou plus. La racine redirige vers `/fr` si le navigateur est en français, vers
`/en` sinon.

---

## Modifier les textes

**Tout le texte du site est dans deux fichiers**, et nulle part ailleurs :

| Fichier | Contenu |
| --- | --- |
| `content/fr.ts` | la version française |
| `content/en.ts` | la version anglaise |
| `content/types.ts` | la forme attendue des deux, et rien d'autre |

Pour changer une phrase, ouvrez le fichier de la langue, trouvez le bloc, modifiez la
chaîne. `npm run typecheck` refuse de passer si une langue a oublié un bloc que l'autre
a, donc une traduction ne peut pas disparaître en silence.

Deux conventions d'écriture :

- **Le mot en italique orange terre d'un titre** s'écrit entre astérisques :
  `'Améliorez l’expérience de vos clients. *Mesurez-la.*'`
- **Ce qui n'a pas été fourni** s'écrit `'[À FOURNIR]'` en français, `'[TO PROVIDE]'` en
  anglais, ou `null` quand le champ l'accepte. Le site affiche alors un emplacement
  encadré, visible à la relecture. C'est la règle du cahier : aucun chiffre, logo,
  témoignage ou nom de client qui n'y figure pas, et un trou qui se voit plutôt qu'une
  invention.

---

## Ajouter une étude de cas

Trois étapes, sans toucher au code des pages.

1. **Déposez les images** dans `public/cas/<slug>/`, en WebP ou AVIF.
2. **Ajoutez l'entrée** dans le tableau `work.cases` de `content/fr.ts`, puis la même
   dans `content/en.ts`, **au même rang** : les deux langues se correspondent par
   position.

   ```ts
   {
     slug: 'nom-du-projet',          // identique dans les deux langues
     name: 'Nom du projet',
     sector: 'Hôtellerie',
     country: 'Cambodge',
     summary: 'Une phrase.',
     result: '+18 % de réservations directes', // ou null tant qu'il n'est pas vérifié
     shot: '/cas/nom-du-projet/accueil.webp',  // ou null
     context: 'Qui est le client, en deux phrases.',
     need: 'Ce qui ne fonctionnait pas.',
     built: ['Le site', 'La réservation', 'Les automatisations'],
     results: [
       { value: '18', unit: ' %', caption: 'Réservations directes' },
     ],                               // ou null
     quote: { text: '...', author: '...' }, // seulement avec l'accord écrit du client
   },
   ```

3. C'est tout. La page `/fr/realisations/nom-du-projet` et son équivalent anglais
   existent, le sitemap les contient, et la carte apparaît sur l'accueil et dans la
   liste des réalisations.

Pour **relier une étude de cas à une page situation**, mettez son slug dans le champ
`proof` de la situation, dans `situationPages`. Le bloc « La preuve » affiche alors sa
carte au lieu de l'emplacement.

Pour **retirer une situation du site** (le cahier marque Rentabilité et Groupes en V2),
passez son `published` à `false` dans `situations.cards`. La carte disparaît de
l'accueil ; sa page reste accessible par son adresse.

---

## Les adresses

Les deux langues ont leurs propres adresses, décrites dans une seule table :
`SEGMENTS`, dans `lib/i18n.ts`.

| Page | Français | Anglais |
| --- | --- | --- |
| Accueil | `/fr` | `/en` |
| Situations | `/fr/situations` | `/en/situations` |
| Une situation | `/fr/situations/ecoute-client` | `/en/situations/guest-feedback` |
| Réalisations | `/fr/realisations` | `/en/work` |
| Une étude de cas | `/fr/realisations/wave` | `/en/work/wave` |
| Méthode | `/fr/methode` | `/en/method` |
| À propos | `/fr/a-propos` | `/en/about` |
| Diagnostic | `/fr/diagnostic` | `/en/diagnostic` |
| Mentions légales | `/fr/mentions-legales` | `/en/legal-notice` |
| Confidentialité | `/fr/confidentialite` | `/en/privacy` |

Changer un segment dans `SEGMENTS` suffit : le menu, le pied de page, le sélecteur
FR / EN, les balises `hreflang` et le `sitemap.xml` suivent. Les slugs des situations et
des études de cas se traduisent par position, dans `lib/routes.ts`.

Ces adresses sont une proposition : le plan du site vit dans l'onglet principal du
cahier, qui n'est pas dans ce dépôt. À relire avec Arnaud avant la mise en ligne.

---

## Variables d'environnement

Aucune n'est nécessaire pour faire tourner le site en local. Elles le sont pour que le
formulaire et le lien de réservation fonctionnent vraiment.

| Variable | À quoi elle sert |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | le domaine, pour les `hreflang`, le `sitemap.xml` et les balises Open Graph. Défaut : `https://kuiperstudio.com` |
| `NEXT_PUBLIC_BOOKING_URL` | le lien vers la page de réservation de 30 minutes. Tant qu'elle est vide, chaque bouton « Réserver un appel » affiche `[À FOURNIR]` au lieu d'un lien mort |
| `HUBSPOT_TOKEN` | jeton d'application privée HubSpot, avec les droits sur les contacts, les entreprises et les notes |
| `DIAGNOSTIC_NOTIFY_WEBHOOK` | le webhook qui prévient `arnaud@kuiperstudio.com` d'une nouvelle demande |

Sans `HUBSPOT_TOKEN`, l'envoi du formulaire répond 503 en production et le visiteur voit
un message d'erreur qui lui donne l'adresse email. C'est volontaire : une demande ne
doit jamais être perdue en silence. En développement, l'envoi est accepté et le contenu
est écrit dans la console.

---

## Le formulaire de diagnostic

`app/api/diagnostic/route.ts` fait, dans l'ordre : la validation, l'anti-spam, puis la
création dans HubSpot du contact, de l'entreprise, de leur association et d'une note
« Diagnostic demandé », puis l'appel du webhook de notification.

L'anti-spam est invisible, sans captcha : un champ leurre hors écran, et le temps passé
sur le formulaire. Les deux sont vérifiés côté serveur, et un envoi suspect est accepté
puis jeté, pour n'apprendre rien à un robot.

**L'email de confirmation au visiteur est un workflow HubSpot**, déclenché par la note,
pas du code. Il reste à configurer dans HubSpot. La liste de contrôle du cahier demande
de tester la chaîne de bout en bout avant la mise en ligne : HubSpot, notification,
email de confirmation.

---

## Le mouvement

Le mouvement est la signature du site, pas un détail. Tout passe par `lib/motion.ts`,
qui enregistre GSAP et ScrollTrigger une fois et expose trois choses utilisées partout :
`TRIGGER` (le seuil de 15 % du cahier), `reduced()` et `small()`.

Une règle gouverne chaque effet : **le contenu est visible par défaut.** Aucune
animation ne cache un texte plus de 300 ms, rien ne se déclenche avant que 15 % de la
section soit à l'écran, et aucun écran ne reste vide pendant le défilement. Les effets
sont complets sur ordinateur, allégés sur mobile, et coupés quand le visiteur réduit les
animations.

### L'en-tête

`components/HeroType.tsx`. Pas de visuel : le titre est le visuel.

À l'arrivée tout est déjà là, lisible et cliquable : l'étiquette, les quatre lignes du
titre, le sous-titre, les deux boutons. Le défilement ne révèle rien, il **recompose** :
les trois premières lignes montent et s'effacent, chacune à son rythme, tandis que la
dernière grandit, vient se poser à la place de la première et reste seule, soulignée d'un
trait orange. Le pied de l'en-tête ne bouge pas du premier au dernier pixel, donc le
bouton reste cliquable pendant toute la séquence.

Deux points de métier :

- **Les retours de ligne sont un choix**, pas un hasard de largeur : ils vivent dans
  `hero.titleLines`, par langue, parce que « Mesurez-la. » et « Measure it. » ne se
  composent pas pareil.
- **L'échelle de la dernière ligne est mesurée, pas devinée.** Elle est calculée sur la
  largeur réelle du texte et la place disponible, donc la phrase remplit le conteneur
  sans jamais en sortir, dans les deux langues et à toutes les largeurs.

La dernière ligne gagne aussi du `WONK` et du `SOFT`, deux axes de la police variable
Fraunces : la lettre change de caractère en grandissant. C'est le seul endroit du site où
la police bouge.

Le cahier v2 demande un champ de particules WebGL dans l'en-tête. Ce choix-là a été
arbitré autrement, en revue : l'en-tête est typographique et Three.js a été retiré des
dépendances. À reconfirmer avec Louis.

### Les effets de section

| Section | Effet | Fichier |
| --- | --- | --- |
| Titre principal | les lignes entrent par un masque, puis la dernière grandit et reste seule | `HeroType.tsx` |
| Transitions | chaque section est un grand bloc aux coins très arrondis qui glisse par-dessus la précédente | `SectionBlock.tsx` |
| Éventail de réalisations | les écrans montent d'une courbe d'horizon crème et se déploient pendant le défilement | `Fan.tsx` |
| Manifeste | section épinglée, le très grand texte se colore mot après mot en orange terre | `PinnedManifesto.tsx` |
| Méthode | section épinglée, six cartes qui défilent horizontalement, chaque schéma se trace | `PinnedMethod.tsx`, `StepDiagram.tsx` |
| Réalisations | images révélées par un masque, curseur personnalisé « Voir » | `MaskReveal.tsx`, `ViewCursor.tsx` |
| Boutons | aimantés, 8 px au plus pour que la cible reste cliquable | `Magnetic.tsx` |
| Chiffres | compteurs qui défilent jusqu'à leur valeur | `Counter.tsx` |
| Toute la page | défilement amorti, branché sur ScrollTrigger | `SmoothScroll.tsx` |

Les deux sections épinglées sont pilotées par la progression du défilement, pas par une
suite de callbacks : avec un scrub, un `onComplete` par étape se déclenche en rafale et
les six s'allument d'un coup.

## Mesure d'audience et cookies

Aucun traceur n'est déposé avant consentement. Le bandeau propose accepter, refuser,
personnaliser, et son choix vit dans le stockage local ; l'absence de choix vaut refus.

`lib/analytics.ts` expose un seul `track()`, qui refuse d'envoyer quoi que ce soit sans
consentement et ne charge aucune balise : il dépose l'évènement dans `window.dataLayer`,
que l'outil de mesure lira quand il sera branché. Les évènements sont ceux du cahier :
`diagnostic_click`, `diagnostic_submit`, `book_call_click`, `configurator_start`,
`price_shown`.

---

## Ce qui reste à faire avant la mise en ligne

Ce qui dépend d'une décision ou d'un contenu, et non du code :

- **Le configurateur de prix.** Le cahier demande de réutiliser celui du site actuel,
  pas d'en écrire un autre. Son emplacement est en place
  (`components/ConfiguratorSlot.tsx`) ; le composant qui l'incarnera doit appeler
  `track('configurator_start')` à la première interaction et `track('price_shown')`
  quand il affiche une estimation.
- **La technologie.** Le cahier dit de garder celle du site actuel, à confirmer avec
  Louis. Ce dépôt part sur Next.js.
- **Le contenu manquant**, listé par les emplacements `[À FOURNIR]` : les captures des
  trois projets, les photos plein cadre des cinq cartes de situation, les images
  d'ambiance, les logos clients (Wave attendu fin octobre, Anakut et MP Massage à
  confirmer, OCS à ne pas afficher), les résultats vérifiés des études de cas, les
  blocs « Le problème » des situations, les témoignages, le prix de l'écoute client, les
  mentions légales et la page de confidentialité.
- **Les portraits des fondateurs** font 256 × 256 px : à remplacer par les originaux,
  au moins 1 200 px de côté, avant la mise en ligne.
- **Le lien de réservation** de 30 minutes.
- **La cinquième carte de situation.** Le cahier annonce cinq cartes et n'en décrit que
  quatre.
- **Les textes légaux** et la déclaration du site dans Google Search Console.

---

## Structure

```
app/
  [lang]/layout.tsx        l'en-tête, le pied de page, les polices, les données structurées
  [lang]/page.tsx          l'accueil, dans l'ordre des dix-sept blocs du wireframe
  [lang]/[...slug]/        toutes les autres pages, résolues contre la table des adresses
  api/diagnostic/          l'envoi vers HubSpot
  globals.css              la charte : couleurs, typographie, grille de 8 px, animations
  sitemap.ts robots.ts
components/                un composant par élément du cahier, réutilisé partout
  pages/                   les deux gabarits : une situation, une étude de cas
content/                   tout le texte, en français et en anglais
lib/                       langues, adresses, liens, consentement, mesure d'audience
middleware.ts              la langue d'arrivée
```
