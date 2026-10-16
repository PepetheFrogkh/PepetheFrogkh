# Le déploiement

Le site part en **export statique** : un dossier de fichiers, sans serveur
Node. C'est ce que sert l'hébergement de Kuiper Studio, et ce n'est pas un
détail d'hébergeur, c'est une contrainte qui décide de trois choses dans le
code.

## Comment ça marche

```
push sur main  →  GitHub Actions  →  npm run build  →  out/
                                  →  push de out/ sur la branche deploy
                                  →  Hostinger sert deploy/ dans public_html
```

`npm run build` fait deux choses : `next build`, qui remplit `out/`, puis
`node scripts/finalize-export.mjs`, qui finit le travail et **échoue si quelque
chose manque**. Un déploiement cassé doit l'être au build, pas en production.

## Les trois conséquences

### 1. Pas de route serveur

Le formulaire ne peut pas poster sur une route Next. Il poste sur `/api/lead`,
et c'est **`public/api/lead.php`** qui répond : contact HubSpot, note avec le
détail, alerte Telegram. Les trois formulaires du site passent par là, par
`lib/lead.ts`.

En développement il n'y a pas de PHP : `sendLead` affiche le détail dans la
console au lieu de l'envoyer dans le vide.

**Les secrets ne sont pas dans le dépôt.** Ils vivent dans un fichier
`kuiper-secrets.php` placé **un cran au-dessus de `public_html`**, donc jamais
servi par le web et jamais écrasé par le déploiement Git. Le modèle est dans
`deploy/kuiper-secrets.example.php`.

Toute route Next doit porter `export const dynamic = 'force-static'`. Sans
elle, le build échoue — et c'est voulu : en export, une route dynamique
disparaît en silence, et le formulaire répondrait 404 sans que rien ne l'ait
dit.

### 2. Pas de middleware

Le choix de la langue à l'arrivée et les redirections des anciennes adresses
sont dans le **`.htaccess`**, engendré au build par `app/htaccess/route.ts`
depuis **les mêmes tables que les pages**. Un segment d'adresse qui change dans
`lib/i18n.ts` change dans le `.htaccess` au prochain build, sans que personne
ait à y penser.

Il s'appelle `htaccess` et non `.htaccess` parce qu'un segment d'adresse ne peut
pas commencer par un point : `finalize-export.mjs` le renomme.

La devise, elle, n'a plus besoin du serveur : elle se détermine dans le
navigateur, au fuseau horaire, avant le premier affichage.

### 3. Pas d'optimiseur d'images

`images: { unoptimized: true }`. Les images sont déjà en WebP, aux tailles
servies : il n'y avait rien à optimiser à la volée.

## Vérifier avant de pousser

```sh
npm run build                       # échoue si l'export est incomplet
(cd out && python3 -m http.server 8111 --bind 127.0.0.1 &)
```

Le serveur de test **ne lit pas le `.htaccess`** : la racine et les
redirections ne s'y vérifient pas. Tout le reste si, et c'est là que se cachent
les surprises d'un export — une image dont le chemin a changé, une page que
`generateStaticParams` a oubliée. Les deux articles du blog manquaient, et
c'est l'export qui l'a dit.

## À poser sur l'hébergement, une fois

| Où | Quoi |
|---|---|
| `~/domains/<domaine>/kuiper-secrets.php` | Copie remplie de `deploy/kuiper-secrets.example.php` |
| hPanel → Git | La branche `deploy`, déployée dans `public_html` |
| Dépôt → Settings → Secrets | `HOSTINGER_DEPLOY_WEBHOOK`, facultatif : l'URL « Auto deployment » de hPanel |

Le jeton HubSpot est à régénérer avant la mise en ligne : l'ancien a circulé.
