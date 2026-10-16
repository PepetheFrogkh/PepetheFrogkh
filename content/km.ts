import type { Dict } from './types'
import { en } from './en'

/**
 * Le texte du site en khmer.
 *
 * La traduction n'est pas encore fournie. Plutot que de poser un emplacement
 * [À FOURNIR] sur chacune des quelques centaines de chaines du site, ce qui
 * rendrait les pages khmeres illisibles et inutilisables, elles servent le
 * texte anglais, et un bandeau en haut de page le dit au visiteur.
 *
 * Le reste du code en tient compte honnetement : tant que `KM_TRANSLATED` vaut
 * `false` dans `lib/i18n`, les pages khmeres sortent du sitemap, des balises
 * hreflang et de l'index des moteurs. Annoncer une traduction qui n'existe pas
 * ferait passer la page khmere pour un doublon de la page anglaise.
 *
 * Quand la traduction arrivera, ce fichier se remplit cle par cle, en gardant
 * la forme de `en` : la verification de types refuse la moindre cle oubliee ou
 * en trop. Il suffira ensuite de passer `KM_TRANSLATED` a `true`.
 *
 * Aucune tournure khmere n'est ecrite ici de notre propre chef. Le seul mot
 * khmer du site est le nom de la langue dans le selecteur, « ភាសាខ្មែរ »,
 * dans `lib/i18n`.
 */
export const km: Dict = en
