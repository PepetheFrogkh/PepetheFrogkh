# Les logos des outils

Les marques qui apparaissent dans le simulateur d'automatisation, sur le
canevas et dans son catalogue. Elles disent ce que nous savons brancher.

## D'où ils viennent

Tous de [Simple Icons](https://simpleicons.org), un jeu de pictogrammes
monochromes publié sous CC0. Le fichier est repris tel quel, avec un seul
ajout : la couleur officielle de la marque, posée en `fill` sur le `<svg>`.

| Fichier | Marque | Couleur | Version de Simple Icons |
|---|---|---|---|
| `excel.svg` | Microsoft Excel | `#217346` | 9.21.0 |
| `teams.svg` | Microsoft Teams | `#6264A7` | 9.21.0 |
| `slack.svg` | Slack | `#4A154B` | 13.21.0 |
| `whatsapp.svg` | WhatsApp | `#25D366` | courante |
| `telegram.svg` | Telegram | `#26A5E4` | courante |
| `google.svg` | Google | `#4285F4` | courante |
| `hubspot.svg` | HubSpot | `#FF7A59` | courante |
| `mailchimp.svg` | Mailchimp | `#1C1C1E` | courante |
| `odoo.svg` | Odoo | `#714B67` | courante |

Deux écarts, et leurs raisons.

**Mailchimp n'est pas à sa couleur de marque.** Le jaune Cavendish `#FFE01B`
contraste à 1,25 contre le crème du site : le singe disparaît purement et
simplement. Mailchimp publie une variante noire pour les fonds clairs, et
c'est celle-là qui est servie.

**Excel, Teams et Slack viennent de versions anciennes.** Ces trois
pictogrammes ne sont plus dans la version courante de Simple Icons. Nous
n'avons pas trouvé trace publique de la raison du retrait, et nous ne la
devinons pas ici. Ce qui est vérifié : ils étaient là en 9.21.0 pour les deux
premiers, en 13.21.0 pour le troisième, et ils n'y sont plus.

## À vérifier avant la mise en ligne

Un logo de marque sur un site commercial relève de l'usage référentiel : on
nomme un produit que l'on sait brancher, on ne prétend ni partenariat, ni
agrément. C'est un usage courant et généralement admis, mais chaque marque
publie ses propres règles, et **Microsoft et Slack sont parmi les plus
strictes**. Leurs trois pictogrammes sont justement ceux qui ont disparu de
Simple Icons.

Avant la mise en ligne, il faut donc trancher trois choses, et c'est une
décision de la société, pas une décision technique :

1. Garder ces neuf marques, après lecture de leurs chartes respectives.
2. Ou n'en garder que celles dont la charte autorise explicitement l'usage
   référentiel.
3. Ou revenir à des catégories sans marque — « un tableur », « une
   messagerie » — ce que faisait le simulateur avant.

Retirer une marque demande deux lignes : son entrée dans `TOOLS` et dans
`TOOL_INFO`, tous deux dans `lib/simulator.ts`, et son libellé dans
`content/fr.ts` et `content/en.ts`. La vérification de types signale ce qui
manque.
