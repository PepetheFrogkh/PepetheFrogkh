import type { ExpertiseKey, ServiceKey } from '@/lib/i18n'
import type { ActionId, ToolId, TriggerId } from '@/lib/simulator'
import type {
  AppId,
  AutomationId,
  DelayId,
  OptionId,
  PackId,
  PlanId,
  SupervisionId,
} from '@/lib/prices'

/**
 * La forme du contenu, identique dans les deux langues.
 *
 * Tout le texte du site vit dans `content/fr.ts` et `content/en.ts`. Ce
 * fichier ne decrit que leur forme, pour qu'une langue ne puisse pas oublier
 * un bloc que l'autre a.
 *
 * Deux conventions d'ecriture. Dans un titre, le mot entre asterisques passe
 * en italique orange terre : « On construit les outils qui font *tourner*
 * votre entreprise. » Et `null` ne veut jamais dire « vide » : il veut dire
 * « pas encore fourni », et l'affichage pose un emplacement visible.
 */

/** Ce qui manque devient un emplacement visible, jamais une invention. */
export const TBD = {
  fr: '[À FOURNIR]',
  en: '[TO PROVIDE]',
  // la page khmere sert encore le texte anglais, son emplacement aussi
  km: '[TO PROVIDE]',
} as const

/** Un prix qui n'a pas encore ete fixe. Jamais une conversion inventee. */
export const TBF = {
  fr: '[À FIXER]',
  en: '[TO SET]',
  km: '[TO SET]',
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

export interface FaqItem {
  question: string
  answer: string
}

export interface FooterColumn {
  title: string
  links: Cta[]
}

/**
 * Une realisation.
 *
 * `slug` sert aussi de clef d'accord : OCS et Wave ne sortent que si
 * SHOW_OCS et SHOW_WAVE valent true, et le filtre est dans `lib/flags.ts`.
 */
export interface CaseStudy {
  slug: string
  name: string
  sector: string
  country: string
  /** La ville, pour le globe des realisations. */
  city: string | null
  /** Les coordonnees pour le globe, ou null. */
  coords: { lat: number; lon: number } | null
  /** Une phrase. */
  summary: string
  /** Le site du projet, affiche sous sa capture. */
  site: string | null
  /**
   * Le logo du client, quand il nous l'a donne.
   *
   * Distinct de `shot` : un logo est une marque, une capture est une preuve de
   * ce qui a ete construit. L'un ne remplace pas l'autre, et la carte montre le
   * logo en attendant la capture plutot qu'un rectangle vide.
   */
  logo: string | null
  /**
   * La couleur de fond sur laquelle le logo a ete livre, quand il n'est pas
   * detoure.
   *
   * Le logo d'Anakut nous est arrive en or sur noir, et pose sur le creme du
   * site il dessinait un rectangle sombre au milieu de la carte. La tuile
   * prend donc la couleur du logo plutot que l'inverse. `null` quand le fond
   * est transparent, et c'est le creme du site qui sert.
   */
  logoBg: string | null
  /** Le resultat verifie, ou null : la carte affiche alors [À FOURNIR]. */
  result: string | null
  /** La capture du projet, ou null. */
  shot: string | null
  /** La video de la carte plein ecran, ou null. */
  video: string | null
  /**
   * Les captures de l'outil livre, legendees.
   *
   * Une seule capture ne dit pas grand-chose d'une application a plusieurs
   * ecrans. Celles qui montrent de la donnee reelle sont caviardees avant
   * d'entrer ici, par `scripts/redact-shots.py` : ni nom de client, ni
   * montant, ni donnee de sante ne doivent sortir, et la regle est de couvrir
   * et non de flouter, un flou sur du texte se remontant.
   */
  gallery: { src: string; caption: string }[] | null
  context: string | null
  need: string | null
  built: string[] | null
  /** Les chiffres verifies, avant et apres. */
  results: Figure[] | null
  /** La citation, publiee seulement avec l'accord ecrit du client. */
  quote: { text: string; author: string } | null
}

/**
 * Un temoignage.
 *
 * Le cahier interdit d'en inventer un : tant que le texte et la photo n'ont
 * pas ete fournis, les deux valent null et la carte affiche son emplacement.
 */
export interface Testimonial {
  /** Le nom de l'entreprise, ou null tant qu'il n'est pas autorise. */
  company: string | null
  author: string | null
  role: string | null
  text: string | null
  photo: string | null
}

/**
 * Une page de service : le gabarit de la section 5 du cahier.
 *
 * Le prix ne vient pas d'ici mais de `lib/prices.ts` : un prix ne doit pas
 * pouvoir etre ecrit deux fois a deux endroits.
 */
export interface ServicePage {
  title: string
  lead: string | null
  /** Le probleme, dans les mots du client. */
  problem: string[] | null
  /** Ce qu'on livre. */
  delivers: string[] | null
  /** Les delais annonces. */
  delays: string | null
  /** Le slug de la realisation liee, ou null. */
  proof: string | null
  /** Une FAQ courte. */
  faq: FaqItem[] | null
}

/**
 * Une page d'expertise : le gabarit de la section 6 du cahier.
 *
 * `experience` porte l'experience personnelle des fondateurs, et seulement
 * elle. Le cahier est formel : elle n'apparait que sur ces pages, toujours
 * sous l'intitule « Notre experience », et jamais presentee comme une
 * realisation de Kuiper Studio.
 */
export interface ExpertisePage {
  title: string
  lead: string | null
  /** Ce qu'on comprend du metier. */
  understand: string[] | null
  /** Les problemes typiques. */
  problems: string[] | null
  /** Ce qu'on propose. */
  offer: string[] | null
  /** Notre experience, celle des fondateurs, avant Kuiper Studio. */
  experience: string[] | null
  /** Les slugs des realisations liees. */
  proof: string[] | null
}

export interface Dict {
  /** Le nom de la langue, pour le selecteur et les hreflang. */
  langName: string
  meta: {
    siteName: string
    home: { title: string; description: string }
    work: { title: string; description: string }
    services: { title: string; description: string }
    expertises: { title: string; description: string }
    pricing: { title: string; description: string }
    blog: { title: string; description: string }
    about: { title: string; description: string }
    contact: { title: string; description: string }
    legal: { title: string; description: string }
    privacy: { title: string; description: string }
  }

  /**
   * Le nom de chaque page du plan du site.
   *
   * Rien que des noms : ce que chaque page raconte vient de son propre bloc.
   * Les adresses, elles, sont dans la table de `lib/i18n`.
   */
  map: {
    services: { title: string; children: Record<ServiceKey, string> }
    expertises: { title: string; children: Record<ExpertiseKey, string> }
    pricing: string
    blog: string
    contact: string
  }

  /** La ligne de description sous chaque entree des menus deroulants. */
  menu: {
    services: Record<ServiceKey, string>
    expertises: Record<ExpertiseKey, string>
  }

  nav: {
    items: Cta[]
    cta: string
    /** Le libelle court du bouton, sous 560 px. */
    ctaShort: string
    /** Le lien au bas d'un menu deroulant, vers la liste complete. */
    seeAll: string
    /** Le nom du groupe de boutons du selecteur de devise. */
    currency: string
    /** Ce que choisit le menu deroulant du selecteur de langue. */
    language: string
    skip: string
    menu: string
    close: string
    /** Le mot du curseur de survol sur une carte cliquable. */
    view: string
  }

  /**
   * Les mots qui nomment un emplacement manquant.
   *
   * Ils etaient ecrits en dur dans les composants, avec un ternaire sur la
   * langue : a deux langues cela passait, a trois cela se casse. Ils vivent
   * donc ici, comme tout le reste du texte.
   */
  words: {
    testimonial: string
    desktopShot: string
    phoneShot: string
    figures: string
    /** « date de mise a jour », pour l'emplacement des pages legales. */
    updatedOn: string
    /** « photo », pour l'emplacement d'un portrait non fourni. */
    photo: string
    /** « capture », pour l'emplacement d'une capture d'ecran non fournie. */
    shot: string
  }

  hero: {
    eyebrow: string
    title: string
    /**
     * Le titre decoupe en lignes. Les retours sont un choix de composition,
     * pas un hasard de largeur : ils changent d'une langue a l'autre.
     */
    titleLines: string[]
    sub: string
    primary: Cta
    secondary: Cta
    note: string
  }

  /** Les en-tetes des sections de l'accueil. */
  home: {
    services: { title: string; lead: string }
    /**
     * La transition tapee a la machine : « On construit » suivi de chaque mot
     * qui s'ecrit puis s'efface.
     */
    transition: { before: string; items: string[] }
    /**
     * La section epinglee de la sequence 3D. Elle a son propre titre : sur
     * l'accueil elle n'est pas le premier ecran, c'est une section parmi les
     * autres, et elle doit dire ce qu'elle montre.
     */
    sequence: { eyebrow: string; title: string; lead: string }
    expertises: { title: string; lead: string }
    work: { title: string; lead: string }
    pricing: { title: string; lead: string; cta: Cta }
    blog: { title: string; lead: string }
    testimonials: { title: string; lead: string }
  }

  services: Record<ServiceKey, ServicePage>
  /** Les intitules du gabarit d'une page de service. */
  serviceLabels: {
    problem: string
    delivers: string
    delays: string
    price: string
    proof: string
    faq: string
  }

  expertises: Record<ExpertiseKey, ExpertisePage>
  /** Les intitules du gabarit d'une page d'expertise. */
  expertiseLabels: {
    understand: string
    problems: string
    offer: string
    /** Toujours « Notre experience », jamais autre chose. */
    experience: string
    /**
     * La phrase qui dit de qui est cette experience. Elle est affichee, pas
     * seulement commentee : le cahier interdit de la faire passer pour une
     * realisation de Kuiper Studio.
     */
    experienceNote: string
    proof: string
  }

  work: {
    title: string
    intro: string
    more: string
    cases: CaseStudy[]
    resultLabel: string
    otherProjects: string
    sectorLabel: string
    /** Le libelle du point du studio sur le globe. */
    studio: string
  }
  caseLabels: {
    context: string
    need: string
    built: string
    results: string
    quote: string
  }

  testimonials: {
    title: string
    note: string
    items: Testimonial[]
  }

  pricing: {
    title: string
    lead: string
    /** La mention qui accompagne toute estimation. */
    disclaimer: string
    /**
     * Les libelles de la grille, indexes par les identifiants de
     * `lib/prices.ts`. Une ligne de prix sans libelle, ou un libelle sans
     * ligne de prix, ne compile pas.
     */
    packs: { title: string; rows: Record<PackId, { name: string; detail: string }> }
    options: { title: string; note: string; rows: Record<OptionId, string> }
    delays: { title: string; rows: Record<DelayId, string> }
    plans: { title: string; note: string; rows: Record<PlanId, string> }
    automation: { title: string; rows: Record<AutomationId, string> }
    supervision: { title: string; rows: Record<SupervisionId, string> }
    apps: { title: string; rows: Record<AppId, string> }
    team: { title: string; row: string }
    transfer: string
    /** Les conditions generales affichees sous la grille des sites. */
    conditions: string[]
    /** La question qui ouvre la page : « que voulez-vous construire ». */
    question: string
    /** L'intertitre de l'estimateur du chemin choisi. */
    estimate: string
    /** L'intertitre du detail des prix, sous l'estimateur. */
    grid: string
  }

  /** Les libelles du configurateur de sites. */
  configurator: {
    title: string
    lead: string
    pack: string
    options: string
    delay: string
    plan: string
    noPlan: string
    included: string
    setup: string
    monthly: string
    includedNote: string
    quoteNote: string
    send: string
    sending: string
    sent: string
    failed: string
    email: string
    emailNote: string
    consent: string
    /** Les quatre etapes et l'ecran de resultat, dans l'ordre. */
    steps: { short: string; question: string; help: string }[]
    /** « Etape 2 sur 5 ». */
    stepOf: (current: number, total: number) => string
    pagesUnit: (count: number) => string
    pagesMore: string
    packIs: string
    noOption: string
    runningTotal: string
    next: string
    back: string
    seeResult: string
    restart: string
    recap: string
    recapPages: string
    recapOptions: string
    recapDelay: string
    recapPlan: string
    edit: string
  }

  /** Les libelles du simulateur d'automatisation. */
  simulator: {
    title: string
    lead: string
    addFlow: string
    removeFlow: string
    flow: string
    trigger: string
    tool: string
    condition: string
    action: string
    add: string
    remove: string
    yes: string
    no: string
    includedInFlow: string
    addHere: string
    pickSlot: string
    apiQuestion: string
    /** Ce qui est demande sur la carte du declencheur. */
    triggerQuestion: string
    apiYes: string
    apiNo: string
    apiUnknown: string
    apiWarning: string
    /** Ce que l'on dit d'un outil dont on sait qu'il a une API publique. */
    apiKnown: string
    setup: string
    monthly: string
    time: string
    timeValue: string
    empty: string
    steps: string
    triggers: Record<TriggerId, string>
    tools: Record<ToolId, string>
    actions: Record<ActionId, string>
  }

  blog: {
    title: string
    lead: string
    /** Le filtre qui n'en est pas un : tous les themes. */
    all: string
    /** Le temps de lecture : « 4 min de lecture ». */
    readingTime: string
    share: string
    empty: string
  }

  contact: {
    title: string
    body: string
    form: {
      company: string
      city: string
      need: string
      needs: string[]
      name: string
      email: string
      message: string
      consent: string
      submit: string
      sending: string
      success: string
      error: string
      required: string
      invalidEmail: string
    }
  }

  founders: {
    title: string
    people: { name: string; role: string | null; bio: string | null; photo: string | null }[]
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

  about: {
    title: string
    body: string | null
  }
  legal: LegalPage
  privacy: LegalPage
}

/**
 * Une page legale : des sections, et des faits.
 *
 * Un avis legal n'est pas un paragraphe : c'est une suite de rubriques, dont
 * certaines sont des couples intitule / valeur. Une valeur `null` reste un
 * emplacement visible, parce qu'inventer un numero d'enregistrement ou une
 * duree de conservation engagerait la societe sur un fait faux.
 */
export interface LegalSection {
  heading: string
  /** Les paragraphes de la rubrique. */
  body?: string[]
  /** Les lignes « intitule : valeur ». `null` devient un emplacement. */
  facts?: { label: string; value: string | null }[]
}

export interface LegalPage {
  title: string
  intro: string
  sections: LegalSection[] | null
  /**
   * La date a laquelle le texte a ete ecrit, telle quelle. Une page legale
   * sans date ne vaut rien : le lecteur doit savoir de quand elle parle. A
   * remettre a jour a chaque modification de fond.
   */
  updated: string | null
}
