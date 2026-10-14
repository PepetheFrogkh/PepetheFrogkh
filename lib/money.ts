import type { Locale } from './i18n'
import type { Amount, Currency, Per, Price } from './prices'

/**
 * L'ecriture d'un prix.
 *
 * Les nombres passent par Intl : c'est lui qui sait qu'un prix en euros
 * s'ecrit « 1 290 € » en francais et « €1,290 » en anglais, et il n'y a pas de
 * raison de le reecrire a la main.
 *
 * Une valeur absente ne devient jamais une conversion : la fonction rend
 * `null`, et c'est a l'affichage de poser l'emplacement [À FIXER].
 */

/** Les mots autour du nombre. A fondre dans `content/` quand il sera reecrit. */
const WORDS: Record<Locale, Record<string, string>> = {
  fr: {
    excl: 'HT',
    quote: 'sur devis',
    free: 'offert',
    month: 'par mois',
    flow: 'par flux',
    page: 'par page',
    app: 'par application',
    condition: 'par condition',
    to: 'à',
    from: 'à partir de',
    base: 'prix de base',
  },
  // Le khmer n'est pas traduit : les mots autour du nombre restent ceux de
  // l'anglais, comme tout le texte des pages khmeres, et le bandeau de la page
  // le dit. Inventer une tournure khmere serait pire qu'un mot anglais lisible.
  km: {
    excl: 'excl. tax',
    quote: 'on quote',
    free: 'free',
    month: 'per month',
    flow: 'per flow',
    page: 'per page',
    app: 'per app',
    condition: 'per condition',
    to: 'to',
    from: 'from',
    base: 'base price',
  },
  en: {
    excl: 'excl. tax',
    quote: 'on quote',
    free: 'free',
    month: 'per month',
    flow: 'per flow',
    page: 'per page',
    app: 'per app',
    condition: 'per condition',
    to: 'to',
    from: 'from',
    base: 'base price',
  },
}

/**
 * L'etiquette passee a `Intl`, par langue.
 *
 * Le khmer prend celle de l'anglais, et ce n'est pas un raccourci : Node et
 * Chrome n'embarquent pas la meme version d'ICU, et pour `km-KH` elles ne
 * placent pas le symbole du meme cote. Le serveur ecrivait « 799 € » et le
 * navigateur « €799 », ce qui cassait l'hydratation de toute la page. Les
 * pages khmeres servent deja le texte anglais ; leurs nombres le suivent,
 * jusqu'a ce qu'une regle d'ecriture khmere soit fournie avec la traduction.
 */
const TAG: Record<Locale, string> = { fr: 'fr-FR', en: 'en-GB', km: 'en-GB' }

/** Un montant seul, sans la mention hors taxes. */
export function formatAmount(
  amount: Amount,
  currency: Currency,
  locale: Locale,
): string | null {
  const value = amount[currency]
  if (value === null) return null
  return new Intl.NumberFormat(TAG[locale], {
    style: 'currency',
    currency,
    // « 400 $ » et non « 400 $US » : en francais, Intl ecrit le dollar en
    // toutes lettres par defaut, ce qui alourdit une grille de prix
    currencyDisplay: 'narrowSymbol',
    maximumFractionDigits: 0,
  }).format(value)
}

function unit(per: Per | undefined, locale: Locale): string {
  return per ? ` ${WORDS[locale][per]}` : ''
}

/**
 * Un prix entier, pret a lire.
 *
 * Rend `null` quand le montant n'est pas fixe dans cette devise : l'appelant
 * affiche alors l'emplacement [À FIXER].
 */
export function formatPrice(price: Price, currency: Currency, locale: Locale): string | null {
  const w = WORDS[locale]

  if (price.kind === 'quote') return w.quote
  if (price.kind === 'free') return w.free
  if (price.kind === 'percent') {
    const sign = price.value > 0 ? '+' : ''
    const space = locale === 'fr' ? ' ' : ''
    return `${sign}${price.value}${space}%`
  }

  if (price.kind === 'range') {
    const from = formatAmount(price.from, currency, locale)
    const to = formatAmount(price.to, currency, locale)
    if (from === null || to === null) return null
    return `${from} ${w.to} ${to} ${w.excl}${unit(price.per, locale)}`
  }

  const value = formatAmount(price.amount, currency, locale)
  if (value === null) return null
  return `${value} ${w.excl}${unit(price.per, locale)}`
}

/** « à partir de 499 € HT ». */
export function formatFrom(price: Price, currency: Currency, locale: Locale): string | null {
  const text = formatPrice(price, currency, locale)
  if (text === null) return null
  if (price.kind === 'quote' || price.kind === 'free' || price.kind === 'percent') return text
  return `${WORDS[locale].from} ${text}`
}
