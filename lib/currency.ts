import { type Currency, isCurrency } from './prices'

/**
 * La devise du visiteur.
 *
 * Le cahier : euros pour l'Europe, dollars pour l'Asie et le reste du monde,
 * detection par le pays du visiteur cote serveur, puis un selecteur toujours
 * visible, memorise.
 *
 * La detection se fait dans le middleware, a partir de l'en-tete de pays que
 * pose le proxy, et le resultat est ecrit dans un cookie. Les pages restent
 * donc statiques : elles affichent les deux devises, et un attribut sur la
 * balise html decide laquelle se voit. C'est ce qui permet de garder le site
 * en cache chez l'hebergeur tout en montrant le bon prix.
 *
 * Aucun hebergeur ne pose cet en-tete tout seul. Cloudflare le fait des le
 * plan gratuit, avec `cf-ipcountry`, une fois IP Geolocation active. Sans
 * en-tete du tout, un repli sur le fuseau horaire du navigateur prend le
 * relais, avant le premier affichage.
 */

export const CURRENCY_COOKIE = 'kuiper-currency'

/** Un an : le choix du visiteur ne se redemande pas a chaque visite. */
export const CURRENCY_MAX_AGE = 60 * 60 * 24 * 365

/**
 * Les en-tetes de pays, dans l'ordre ou on les lit.
 *
 * `cf-ipcountry` vient de Cloudflare, `x-vercel-ip-country` de Vercel, les
 * autres de proxys courants. Le premier trouve gagne.
 */
export const COUNTRY_HEADERS = [
  'cf-ipcountry',
  'x-vercel-ip-country',
  'x-geoip-country',
  'x-country-code',
  'x-appengine-country',
] as const

/**
 * Les pays qui paient en euros.
 *
 * L'Union europeenne au complet, l'AELE, le Royaume-Uni et les Balkans : le
 * cahier dit « Europe », pas « zone euro ». Un visiteur suisse ou britannique
 * voit donc un prix en euros, ce qui est bien ce qui est pratique ici.
 */
const EUROPE = new Set([
  'AD', 'AL', 'AT', 'BA', 'BE', 'BG', 'BY', 'CH', 'CY', 'CZ', 'DE', 'DK', 'EE',
  'ES', 'FI', 'FO', 'FR', 'GB', 'GG', 'GI', 'GR', 'HR', 'HU', 'IE', 'IM', 'IS',
  'IT', 'JE', 'LI', 'LT', 'LU', 'LV', 'MC', 'MD', 'ME', 'MK', 'MT', 'NL', 'NO',
  'PL', 'PT', 'RO', 'RS', 'SE', 'SI', 'SK', 'SM', 'UA', 'VA', 'XK',
])

/** La devise d'un code pays ISO a deux lettres. */
export function currencyFor(country: string | null | undefined): Currency {
  if (!country) return DEFAULT_CURRENCY
  return EUROPE.has(country.trim().toUpperCase()) ? 'EUR' : 'USD'
}

/**
 * La devise par defaut, quand rien ne permet de trancher.
 *
 * L'euro, parce que la grille de prix est ecrite en euros : c'est la devise
 * dont le plus de lignes sont fixees, donc celle qui affiche le moins
 * d'emplacements [À FIXER].
 */
export const DEFAULT_CURRENCY: Currency = 'EUR'

/** La devise lisible dans une chaine de cookies, s'il y en a une. */
export function currencyFromCookie(cookie: string | null | undefined): Currency | null {
  if (!cookie) return null
  const match = cookie.match(new RegExp(`(?:^|; )${CURRENCY_COOKIE}=([^;]*)`))
  const value = match?.[1]
  return value && isCurrency(value) ? value : null
}
