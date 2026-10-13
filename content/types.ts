/**
 * La forme du contenu, identique dans les deux langues.
 *
 * Tout le texte du site vit dans `content/fr.ts` et `content/en.ts`. Ce
 * fichier ne decrit que leur forme, pour qu'une langue ne puisse pas oublier
 * un bloc que l'autre a.
 *
 * Convention d'ecriture : dans un titre, le mot entre asterisques passe en
 * italique orange terre. « Ameliorez l'experience. *Mesurez-la.* »
 */

/** Ce qui manque devient un emplacement visible, jamais une invention. */
export const TBD = {
  fr: '[À FOURNIR]',
  en: '[TO PROVIDE]',
} as const

export interface Cta {
  label: string
  href: string
}

export interface Figure {
  /** La partie qui defile : « 499 », « 72 », « 2 ». */
  value: string
  /** Ce qui l'entoure et ne defile pas : « € HT », « heures ». */
  unit?: string
  prefix?: string
  caption: string
}

export interface SituationCard {
  slug: string
  /** Le numero affiche dans la carte. */
  index: string
  title: string
  /** La phrase du client, rendue en italique. */
  quote: string
  tags: string[]
  /** Le cahier marque Rentabilite et Groupes en V2 : mettre false pour les
   *  retirer du site sans toucher au code. */
  published: boolean
}

export interface SituationPage {
  slug: string
  /** Reprise de la carte, pour l'en-tete de la page. */
  quote: string
  title: string
  /** Deux ou trois phrases, dans les mots du client. */
  problem: string[]
  /** Trois etapes numerotees. */
  steps: string[]
  /** Les indicateurs suivis avant et apres. */
  measures: string[]
  /** Le prix : « a partir de », ou « sur devis ». */
  price: string
  /** Le slug de l'etude de cas qui sert de preuve, ou null pour un
   *  emplacement [À FOURNIR]. */
  proof: string | null
}

export interface CaseStudy {
  slug: string
  name: string
  sector: string
  country: string
  /** Une phrase. */
  summary: string
  /** Le resultat verifie, ou null : la carte affiche alors [À FOURNIR]. */
  result: string | null
  /** La capture du projet, ou null. */
  shot: string | null
  context: string | null
  need: string | null
  built: string[] | null
  /** Les chiffres verifies, avant et apres. */
  results: Figure[] | null
  /** La citation, publiee seulement avec l'accord ecrit du client. */
  quote: { text: string; author: string } | null
}

export interface MethodStep {
  title: string
  body: string | null
}

export interface FaqItem {
  question: string
  answer: string
}

export interface FooterColumn {
  title: string
  links: Cta[]
}

export interface Dict {
  /** Le nom de la langue, pour le selecteur et les hreflang. */
  langName: string
  meta: {
    siteName: string
    home: { title: string; description: string }
    situations: { title: string; description: string }
    work: { title: string; description: string }
    method: { title: string; description: string }
    about: { title: string; description: string }
    diagnostic: { title: string; description: string }
    legal: { title: string; description: string }
    privacy: { title: string; description: string }
  }
  nav: {
    items: Cta[]
    cta: string
    /** Le libelle court du bouton, sous 560 px. */
    ctaShort: string
    skip: string
    menu: string
    close: string
  }
  hero: {
    eyebrow: string
    title: string
    sub: string
    primary: Cta
    secondary: Cta
    note: string
  }
  proof: {
    logosTitle: string
    figures: Figure[]
  }
  showcase: { title: string; note: string }
  situations: {
    title: string
    more: string
    cards: SituationCard[]
  }
  manifesto: string
  founders: {
    title: string
    people: { name: string; role: string | null; photo: string | null }[]
  }
  offers: {
    title: string
    note: string
    items: { title: string; body: string | null; price: string }[]
  }
  work: {
    title: string
    intro: string
    filters: string[]
    all: string
    cases: CaseStudy[]
    resultLabel: string
    otherProjects: string
    sectorLabel: string
  }
  convictions: {
    title: string
    items: { title: string; body: string | null }[]
  }
  method: {
    title: string
    intro: string
    steps: MethodStep[]
  }
  testimonials: {
    title: string
    note: string
  }
  diagnostic: {
    title: string
    body: string
    preview: { title: string; lines: string[] }
    form: {
      venue: string
      city: string
      type: string
      types: string[]
      maps: string
      mapsHint: string
      name: string
      email: string
      consent: string
      submit: string
      sending: string
      success: string
      error: string
      required: string
      invalidEmail: string
    }
  }
  faq: {
    title: string
    items: FaqItem[]
  }
  finalCta: {
    title: string
    sub: string
    primary: Cta
    secondary: Cta
  }
  footer: {
    columns: FooterColumn[]
    legal: string
    tagline: string
  }
  cookies: {
    title: string
    body: string
    accept: string
    refuse: string
    customize: string
    save: string
    necessary: { title: string; body: string }
    analytics: { title: string; body: string }
  }
  situationPages: SituationPage[]
  /** Les blocs du gabarit d'une page situation. */
  situationLabels: {
    problem: string
    steps: string
    measures: string
    proof: string
    price: string
  }
  caseLabels: {
    context: string
    need: string
    built: string
    results: string
    quote: string
  }
  about: {
    title: string
    body: string | null
  }
  legal: { title: string; body: string | null }
  privacy: { title: string; body: string | null }
}
