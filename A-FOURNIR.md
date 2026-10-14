# Ce qu'il nous faut de votre côté

Relevé le 14 octobre 2026, en parcourant les 24 pages du site une par une.
Chaque trou est **visible à l'écran** sous la forme d'un emplacement
`[À FOURNIR]` (il manque un contenu) ou `[À FIXER]` (il manque une décision de
prix). Rien n'a été inventé pour les combler.

Quand un élément est fourni, il remplace l'emplacement : aucun autre code n'est
à écrire.

---

## 1. Les prix — 26 lignes à fixer

Tous les prix vivent dans un seul fichier, `lib/prices.ts`. Chaque ligne porte
une valeur en euros **et** une valeur en dollars, parce que le site s'affiche
dans la devise du visiteur. Aucune conversion n'est calculée : une valeur
absente devient `[À FIXER]`, jamais un taux de change inventé.

### 1a. 22 lignes ont leur prix en euros, pas en dollars

Un visiteur hors d'Europe voit donc `[À FIXER]` sur presque toute la page
Tarifs et toute la page Sites web. **C'est le trou le plus urgent du site.**

| Ligne | EUR | USD |
|---|---|---|
| Essentiel, 1 page | 499 € | ? |
| Essentiel, jusqu'à 3 pages | 799 € | ? |
| Pro | 1 290 € | ? |
| Complet | 1 999 € | ? |
| Page supplémentaire | 120 € | ? |
| Formulaire avancé | 190 € | ? |
| Langue supplémentaire | 190 € | ? |
| Animations avancées | 250 € | ? |
| Simulateur | 390 € | ? |
| Réservation légère | 390 € | ? |
| Référencement avancé | 390 € | ? |
| Animation 3D | 490 € | ? |
| Transfert vers un autre hébergeur | 1 990 € | ? |
| Hébergement seul, WordPress | 39 €/mois | ? |
| Hébergement seul, Node.js | 59 €/mois | ? |
| Sérénité | 99 €/mois | ? |
| Croissance | 199 €/mois | ? |
| Partenaire | 349 €/mois | ? |
| Chaque condition ajoutée | 80 € | ? |
| Chaque application connectée | 120 € | ? |
| Supervision, jusqu'à 3 flux | 39 €/mois | ? |
| Supervision, jusqu'à 10 flux | 99 €/mois | ? |

### 1b. 4 lignes ont leur prix en dollars, pas en euros

Un visiteur européen voit `[À FIXER]` sur ces quatre-là.

| Ligne | EUR | USD |
|---|---|---|
| Outil sans API ouverte | ? | 3 000 $ |
| Un développeur et un chef de projet, au mois | ? | 5 000 $/mois |
| Application de base (caisse, inventaire, MRP, CRM) | ? | 25 000 à 30 000 $ |
| ERP complet | ? | 100 000 à 150 000 $ |

### 1c. La seule ligne complète

« Flux simple » : 390 € / 400 $. C'est la forme à reproduire pour les 26 autres.

**Ce qu'il nous faut :** les 26 montants manquants. Un tableau, un message, peu
importe la forme.

---

## 2. Les réalisations — 2 études de cas vides

Les deux pages existent (`/fr/realisations/anakut`, `/fr/realisations/mp-massage`)
mais elles n'ont que le nom, la ville et le lien du site. Tout le reste est un
emplacement.

Pour **Anakut** et pour **MP Massage**, il nous faut :

- **Le résultat en une ligne** (celui qui s'affiche sur la carte et en haut de
  la page).
- **Le contexte** : qui est le client, ce qu'il faisait avant.
- **Le besoin** : ce qu'il nous a demandé.
- **Les chiffres**, s'il y en a de vérifiables. Sinon la page le dit, et c'est
  très bien : aucun chiffre ne sera inventé.
- **Le mot du client** : une phrase, avec son nom et son accord pour la publier.
- **Les captures** : une vue ordinateur et une vue téléphone, et une vignette
  pour la carte de la liste. Ou l'autorisation de les prendre nous-mêmes.
- **Une vidéo courte**, si vous en voulez une (muette, elle s'agrandit au
  défilement). Facultatif.

**Et, pour chacun : l'accord écrit du client** pour apparaître sur le site avec
son nom. Sans cet accord, la réalisation reste hors ligne.

---

## 3. Les témoignages — 3 emplacements sur l'accueil

L'accueil et la page Réalisations réservent trois emplacements pour des
témoignages. Il nous faut, pour chacun : **la phrase, le nom, le rôle, la
société, et l'accord de publication**. Un seul témoignage réel vaut mieux que
trois inventés, donc un ou deux suffisent pour commencer.

---

## 4. Les six pages Expertises — le gros du travail de contenu

Les six pages existent et se répondent, mais chacune attend quatre à six blocs.
Ce sont : Restauration, Hôtellerie, Production et manufacturing, Gestion des
équipes, CRM, Assurance et courtage.

Pour **chaque** expertise :

- **L'accroche** : deux ou trois phrases en haut de page.
- **Ce que nous comprenons du métier** : trois ou quatre points.
- **Les problèmes typiques** : trois ou quatre points, concrets.
- **Ce que nous proposons** (manquant sur Assurance et courtage).
- **« Notre expérience »** : manquant sur Production, Gestion des équipes, CRM,
  Assurance. C'est le bloc où va votre vécu personnel — caisses, bornes, menus
  par QR code, PMS, inventaire. Il reste sous cet intitulé et n'est jamais
  présenté comme une réalisation de Kuiper Studio, comme convenu.
- **Les réalisations liées** : quelles études de cas rattacher à cette
  expertise. Dépend du point 2.

C'est beaucoup. Si vous voulez démarrer petit, donnez-moi **une seule
expertise complète** : je la rédige, vous la relisez, et elle sert de modèle
aux cinq autres.

---

## 5. Les cinq pages Services — un bloc chacune

Moins lourd : chaque page Service a son contenu, sauf deux blocs.

| Page | Ce qui manque |
|---|---|
| Sites web | Le problème qu'elle résout, en haut de page |
| Automatisations | Le problème, et une réalisation à montrer |
| Projets sur mesure | Le problème, et une réalisation |
| Applications métier | Le problème, et une réalisation |
| Écoute client | Le problème, et une réalisation |

« Le problème » = trois ou quatre phrases qui disent ce qui fait mal avant
qu'on intervienne. Les réalisations dépendent du point 2.

---

## 6. Les fondateurs — page À propos

- **Votre biographie** et celle de Louis : trois ou quatre lignes chacune.
- **Vos deux photos**.

Les noms et les rôles sont déjà là.

---

## 7. Les pages légales — deux pages à rédiger

`/fr/mentions-legales` et `/fr/confidentialite` n'ont que leur titre.

Il nous faut la **raison sociale exacte**, le **numéro d'enregistrement**,
l'**adresse du siège**, l'**email de contact légal**, le **nom de
l'hébergeur**, et pour la confidentialité : **quelles données sont collectées,
combien de temps, et à qui elles sont transmises** (HubSpot, et l'outil de
mesure d'audience si vous en activez un).

Ce sont des textes qui engagent juridiquement : je peux les rédiger à partir de
vos informations, mais je ne les invente pas, et un juriste devrait les relire.

---

## 8. L'animation de l'accueil — la séquence d'images

Le dossier `public/sequence/` contient aujourd'hui **une séquence de test** :
144 images numérotées en desktop, 60 en mobile, qui affichent leur propre
numéro. Elles servent à vérifier que le défilement tombe sur la bonne image.
Un bandeau `[À FOURNIR]` est posé par-dessus pour que personne ne les prenne
pour le vrai rendu.

Il nous faut **la vraie animation 3D**, exportée en WebP :

- `desktop/` : 120 à 180 images, environ 1 600 px de large, numérotées
  `0001.webp`, `0002.webp`…
- `mobile/` : 60 images, en portrait.
- Fond crème `#FFF8F3`, tons orange de la charte.

Dès qu'elles sont déposées, je bascule un interrupteur dans
`components/sequence/sequence.ts` et le bandeau disparaît.

---

## 9. Les deux clients sous interrupteur — OCS et Wave

Ils sont dans le code mais **invisibles partout** tant que `SHOW_OCS` et
`SHOW_WAVE` valent `false`, comme convenu. Pour les allumer, il faut d'abord :

- **OCS** : la ville, les coordonnées, le lien du site, et l'accord de
  publication.
- **Wave** : la même chose.

Puis `NEXT_PUBLIC_SHOW_OCS=true` / `NEXT_PUBLIC_SHOW_WAVE=true` sur le serveur.

---

## 10. Les réglages du serveur — cinq variables

À poser sur Hostinger avant la mise en ligne. Sans elles le site tourne, mais
les formulaires ne partent nulle part.

| Variable | À quoi elle sert |
|---|---|
| `HUBSPOT_TOKEN` | Le jeton privé HubSpot. Sans lui, aucun formulaire n'arrive. |
| `NEXT_PUBLIC_SITE_URL` | `https://www.kuiperstudio.com`, pour les liens canoniques et le plan du site. |
| `NEXT_PUBLIC_BOOKING_URL` | Le lien de prise de rendez-vous, si vous en voulez un. Sinon le bouton ne s'affiche pas. |
| `LEAD_NOTIFY_WEBHOOK` | Facultatif : une alerte Slack ou email à chaque demande. |
| `NEXT_PUBLIC_SHOW_OCS` / `_WAVE` | Voir le point 9. Laissez-les absentes pour l'instant. |

---

## Par quoi commencer

Dans l'ordre d'impact, si vous ne deviez traiter que trois points :

1. **Les 22 prix en dollars** (point 1a). C'est une heure de décision et ça
   répare la moitié du site pour tout visiteur hors d'Europe.
2. **Une réalisation complète**, Anakut ou MP Massage (point 2), avec l'accord
   du client. Sans aucune réalisation, l'accueil et quatre pages Services ont
   un trou visible.
3. **Une expertise complète** (point 4), pour servir de modèle aux cinq autres.

Le reste peut suivre à votre rythme : le site est en ligne et lisible avec ses
emplacements, qui se remplissent un par un.
