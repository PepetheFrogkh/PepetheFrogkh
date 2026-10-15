/**
 * Toute la grille de prix du site, et rien d'autre.
 *
 * Un prix s'ecrit dans une seule devise, et l'autre se calcule : le site
 * s'affiche en euros pour un visiteur europeen, en dollars pour les autres,
 * et il n'y a pas deux grilles a tenir a jour. Le taux et la regle d'arrondi
 * sont ecrits une fois, juste en dessous, et s'appliquent a tout.
 *
 * Une ligne peut toujours forcer ses deux montants en ecrivant l'objet a la
 * main, quand le prix affiche doit etre decide et non calcule.
 *
 * Tous les montants sont hors taxes.
 */

/**
 * Le taux applique, dollars par euro.
 *
 * Ce n'est pas un taux de marche : au change d'octobre 2026, un euro vaut
 * environ 1,15 dollar. C'est un taux commercial, choisi pour que la grille en
 * dollars reste proche de la grille en euros, parce que les deux marches ne
 * sont pas les memes. Le changer ici change tous les prix en dollars du site,
 * d'un coup et sans rien oublier.
 */
export const USD_PER_EUR = 1.02

/**
 * L'arrondi commercial.
 *
 * Un prix converti tombe sur 397,80 : ce n'est pas un prix, c'est un calcul.
 * La regle ramene au plus proche multiple de dix moins un, donc toujours a un
 * chiffre qui finit par 9, et 397,80 devient 399.
 *
 * Au-dela de 2 500 un prix ne finit plus par 9 sans paraitre racoleur : on
 * arrondit a la centaine, et a partir de 50 000 au millier.
 */
function commercial(value: number): number {
  if (value >= 50_000) return Math.round(value / 1_000) * 1_000
  if (value >= 2_500) return Math.round(value / 100) * 100
  return Math.round(value / 10) * 10 - 1
}

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

/** Un prix decide en euros ; les dollars se calculent. */
const eur = (value: number): Amount => ({
  EUR: value,
  USD: commercial(value * USD_PER_EUR),
})

/** Un prix decide en dollars ; les euros se calculent. */
const usd = (value: number): Amount => ({
  EUR: commercial(value / USD_PER_EUR),
  USD: value,
})

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
  flow: fixed(eur(390), 'flow'),
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

export const BUSINESS_APPS = {
  /** Caisse, inventaire, MRP, CRM : un paiement unique. */
  base: { kind: 'range', from: usd(25000), to: usd(30000) } as Price,
  /**
   * L'ERP complet se chiffre apres un echange, et son prix n'est pas affiche.
   *
   * Il l'etait, de cent a cent cinquante mille dollars. Un montant pareil
   * affiche sans contexte fait fuir avant la premiere question, alors qu'un
   * ERP se dimensionne : ce n'est pas le meme chantier selon le nombre de
   * sites, de magasins et d'annees de donnee a reprendre. Il se dit en
   * conversation, pas sur une page.
   */
  erp: { kind: 'quote' } as Price,
}

// ── Une equipe dediee ───────────────────────────────────────────────────────

/**
 * Le depart d'un projet sur mesure : un developpeur et un chef de projet.
 *
 * Le developpeur est de niveau intermediaire a confirme, et le chef de projet
 * va avec : c'est le plus petit attelage qui tient une livraison. Tout le
 * reste s'ajoute par profil, ci-dessous.
 */
export const CUSTOM_START: Price = fixed(usd(5000), 'month')

export const PROFILES = [
  { id: 'junior', price: fixed(usd(1000), 'month') },
  {
    id: 'mid',
    price: { kind: 'range', from: usd(2000), to: usd(2500), per: 'month' } as Price,
  },
  { id: 'senior', price: fixed(usd(5000), 'month') },
  {
    id: 'architect',
    price: { kind: 'range', from: usd(8000), to: usd(10000), per: 'month' } as Price,
  },
  /** Un niveau direction technique se discute, il ne se tarife pas. */
  { id: 'cto', price: { kind: 'quote' } as Price },
] as const

export type ProfileId = (typeof PROFILES)[number]['id']

/**
 * Le coefficient applique a la facturation a l'heure.
 *
 * Les prix de la grille sont ceux d'un engagement au mois, ou la charge se
 * repartit. A l'heure, chaque heure est relevee et justifiee a chaque etape,
 * et le travail se concentre sur la periode demandee : c'est ce que paie le
 * coefficient.
 */
export const HOURLY_UPLIFT = 1.5

/**
 * L'engagement minimum pour un profil dedie, en mois.
 *
 * En dessous, nous ne detachons pas quelqu'un : un developpeur qui change de
 * projet tous les mois ne connait aucun des projets qu'il touche. Un chantier
 * plus court reste possible, mais sans profil dedie.
 */
export const MIN_MONTHS = 3

/** A partir de combien de profils un UI/UX est compris, a notre charge. */
export const UX_FROM_PROFILES = 3

// ── Support et maintenance ──────────────────────────────────────────────────

/**
 * Ce qui se passe apres la livraison, au mois.
 *
 * Quatre forfaits, du plus simple au plus engageant. Le dernier, la nuit, ne
 * concerne que les projets sur mesure et les CRM ou ERP : c'est la que le
 * decalage horaire coute vraiment quelque chose.
 */
export const CARE = [
  { id: 'basic', price: fixed(usd(350), 'month') },
  { id: 'changes', price: fixed(usd(550), 'month') },
  { id: 'retained', price: fixed(usd(1500), 'month') },
  { id: 'night', price: fixed(usd(5500), 'month') },
] as const

export type CareId = (typeof CARE)[number]['id']

export const FEEDBACK: Price = { kind: 'quote' }

/**
 * L'accompagnement, sur six mois.
 *
 * Aucun montant n'a ete fixe : la mission depend du nombre d'outils a
 * brancher et du volume de donnee a reprendre, et elle se chiffre apres un
 * premier echange. Le jour ou un forfait sera decide, il remplace cette ligne.
 */
export const CONSULTING: Price = { kind: 'quote' }
