/**
 * Toute la grille de prix du site, et rien d'autre.
 *
 * Deux regles tiennent ce fichier.
 *
 * Une valeur par devise et par ligne. Aucune conversion n'est calculee : si le
 * prix en dollars d'une ligne n'a pas ete fixe, la valeur est `null` et le
 * site affiche l'emplacement [À FIXER] a la place. Un taux de change invente
 * serait un prix invente.
 *
 * Tous les montants sont hors taxes.
 */

export const CURRENCIES = ['EUR', 'USD'] as const
export type Currency = (typeof CURRENCIES)[number]

export function isCurrency(value: string): value is Currency {
  return (CURRENCIES as readonly string[]).includes(value)
}

/** Un montant par devise. `null` veut dire : pas encore fixe. */
export interface Amount {
  EUR: number | null
  USD: number | null
}

/** Ce qui s'ecrit a la place d'un prix. */
export type Price =
  | { kind: 'fixed'; amount: Amount; per?: Per }
  | { kind: 'range'; from: Amount; to: Amount; per?: Per }
  | { kind: 'percent'; value: number }
  | { kind: 'quote' }
  | { kind: 'free' }

/** Ce que le montant compte : par mois, par flux, par page. */
export type Per = 'month' | 'flow' | 'page' | 'app' | 'condition'

const eur = (value: number): Amount => ({ EUR: value, USD: null })
const usd = (value: number): Amount => ({ EUR: null, USD: value })
const both = (value: number, dollars: number): Amount => ({ EUR: value, USD: dollars })

const fixed = (amount: Amount, per?: Per): Price => ({ kind: 'fixed', amount, per })

// ── Sites web ───────────────────────────────────────────────────────────────

/**
 * Les identifiants de chaque ligne, enumeres.
 *
 * Les libelles vivent dans `content/`, et ils sont indexes par ces memes
 * identifiants : une ligne de prix sans libelle, ou un libelle sans ligne de
 * prix, ne compile pas.
 */
export type PackId = 'essentiel-1' | 'essentiel-3' | 'pro' | 'complet' | 'sur-mesure'

export interface Pack {
  id: PackId
  price: Price
  /** Le pack mis en avant dans la grille. */
  featured?: boolean
  /**
   * Le nombre d'options comprises dans le pack. Le configurateur deduit les
   * plus cheres des options choisies : c'est la lecture la plus favorable au
   * client, et elle est annoncee a l'ecran.
   */
  included?: number
  /** Les options deja comprises, qui ne consomment pas un des `included`. */
  free?: OptionId[]
  /**
   * Le nombre de pages que le pack couvre. Absent pour le sur-mesure, qui
   * n'a pas de plafond. C'est cette colonne que lit le configurateur : le
   * visiteur dit combien de pages il lui faut, et le pack s'en deduit, au
   * lieu de lui demander de comprendre la grille avant de l'utiliser.
   */
  pages?: number
}

export const PACKS: Pack[] = [
  { id: 'essentiel-1', price: fixed(eur(499)), pages: 1 },
  { id: 'essentiel-3', price: fixed(eur(799)), pages: 3 },
  { id: 'pro', price: fixed(eur(1290)), featured: true, included: 2, pages: 6 },
  { id: 'complet', price: fixed(eur(1999)), included: 3, free: ['langue'], pages: 10 },
  { id: 'sur-mesure', price: { kind: 'quote' } },
]

/**
 * Le pack qui couvre ce nombre de pages.
 *
 * Au-dela du plus grand plafond, c'est le sur-mesure : un site de quinze
 * pages ne se vend pas en ajoutant cinq pages au pack Complet, il se chiffre.
 */
export function packForPages(pages: number): Pack {
  return PACKS.find((p) => p.pages !== undefined && pages <= p.pages) ?? PACKS[PACKS.length - 1]
}

/** Le plus grand nombre de pages encore couvert par un pack chiffre. */
export const MAX_PAGES = Math.max(...PACKS.map((p) => p.pages ?? 0))

export type OptionId =
  | 'formulaire-contact'
  | 'page'
  | 'formulaire-avance'
  | 'langue'
  | 'animations-avancees'
  | 'simulateur'
  | 'reservation'
  | 'referencement'
  | 'animation-3d'

export interface Option {
  id: OptionId
  price: Price
}

export const OPTIONS: Option[] = [
  { id: 'formulaire-contact', price: { kind: 'free' } },
  { id: 'page', price: fixed(eur(120), 'page') },
  { id: 'formulaire-avance', price: fixed(eur(190)) },
  { id: 'langue', price: fixed(eur(190)) },
  { id: 'animations-avancees', price: fixed(eur(250)) },
  { id: 'simulateur', price: fixed(eur(390)) },
  { id: 'reservation', price: fixed(eur(390)) },
  { id: 'referencement', price: fixed(eur(390)) },
  { id: 'animation-3d', price: fixed(eur(490)) },
]

export type DelayId = 'economie' | 'standard' | 'express'

export interface Delay {
  id: DelayId
  price: Price
  /** Le delai express ne vaut que pour le pack Essentiel. */
  only?: PackId[]
}

export const DELAYS: Delay[] = [
  { id: 'economie', price: { kind: 'percent', value: 0 } },
  { id: 'standard', price: { kind: 'percent', value: 25 } },
  { id: 'express', price: { kind: 'percent', value: 50 }, only: ['essentiel-1', 'essentiel-3'] },
]

export type PlanId =
  | 'hebergement-wordpress'
  | 'hebergement-node'
  | 'serenite'
  | 'croissance'
  | 'partenaire'

export interface Plan {
  id: PlanId
  price: Price
  featured?: boolean
}

/** Abonnements, engagement de douze mois. */
export const PLANS: Plan[] = [
  { id: 'hebergement-wordpress', price: fixed(eur(39), 'month') },
  { id: 'hebergement-node', price: fixed(eur(59), 'month') },
  { id: 'serenite', price: fixed(eur(99), 'month') },
  { id: 'croissance', price: fixed(eur(199), 'month'), featured: true },
  { id: 'partenaire', price: fixed(eur(349), 'month') },
]

/** Le transfert du site vers un autre hebergeur. */
export const TRANSFER: Price = fixed(eur(1990))

// ── Automatisations ─────────────────────────────────────────────────────────

export const AUTOMATION = {
  /** Le premier flux simple. */
  flow: fixed(both(390, 400), 'flow'),
  condition: fixed(eur(80), 'condition'),
  app: fixed(eur(120), 'app'),
  /**
   * Un outil sans API ouverte. Le prix a ete fixe en dollars : il faut
   * obtenir un acces aupres de l'editeur, ce qui prend souvent plusieurs
   * semaines de demarches.
   */
  noApi: fixed(usd(3000)),
  supervision: [
    { id: 'jusqu-3', flows: 3, price: fixed(eur(39), 'month') },
    { id: 'jusqu-10', flows: 10, price: fixed(eur(99), 'month') },
    { id: 'au-dela', flows: Infinity, price: { kind: 'quote' } as Price },
  ] as { id: SupervisionId; flows: number; price: Price }[],
}

export type AutomationId = 'flow' | 'condition' | 'app' | 'noApi'
export type SupervisionId = 'jusqu-3' | 'jusqu-10' | 'au-dela'
export type AppId = 'base' | 'erp'

// ── Projets sur mesure, applications metier, ecoute client ──────────────────

/** Un developpeur et un chef de projet, au mois. */
export const CUSTOM_TEAM: Price = fixed(usd(5000), 'month')

export const BUSINESS_APPS = {
  /** Caisse, inventaire, MRP, CRM : un paiement unique. */
  base: { kind: 'range', from: usd(25000), to: usd(30000) } as Price,
  /** Un ERP complet ne se lance pas en dessous. */
  erp: { kind: 'range', from: usd(100000), to: usd(150000) } as Price,
}

export const FEEDBACK: Price = { kind: 'quote' }
