import type { Dict } from './types'

/**
 * Le site en francais.
 *
 * Vouvoiement, ton direct, aucun tiret long. Aucun chiffre, logo, temoignage
 * ni nom de client invente : ce qui n'a pas ete fourni vaut `null` et
 * l'affichage pose un emplacement visible.
 */
export const fr: Dict = {
  langName: 'Français',

  meta: {
    siteName: 'Kuiper Studio',
    home: {
      title: 'Kuiper Studio · On construit les outils qui font tourner votre entreprise',
      description:
        'Sites web, automatisations, applications métier : livrés vite, à prix affichés, par une équipe qui connaît votre métier.',
    },
    services: {
      title: 'Services · Kuiper Studio',
      description:
        'Sites web, automatisations, projets sur mesure, applications métier, écoute client.',
    },
    expertises: {
      title: 'Expertises · Kuiper Studio',
      description: 'Les domaines où l’équipe est la plus forte, et les offres adaptées à chacun.',
    },
    pricing: {
      title: 'Tarifs · Kuiper Studio',
      description: 'Les prix affichés, et le simulateur d’automatisation.',
    },
    blog: {
      title: 'Blog · Kuiper Studio',
      description: 'Ce que nous apprenons en construisant des outils métier.',
    },
    work: {
      title: 'Réalisations · Kuiper Studio',
      description: 'Ce que nous avons construit, et pour qui.',
    },
    about: {
      title: 'À propos · Kuiper Studio',
      description: 'Deux fondateurs, un seul interlocuteur. Kuiper Studio est basé à Phnom Penh.',
    },
    contact: {
      title: 'Contact · Kuiper Studio',
      description: 'Parlons de votre projet.',
    },
    legal: {
      title: 'Mentions légales · Kuiper Studio',
      description: 'Mentions légales de Kuiper Studio.',
    },
    privacy: {
      title: 'Confidentialité · Kuiper Studio',
      description: 'Comment Kuiper Studio traite vos données.',
    },
  },

  map: {
    services: {
      title: 'Services',
      children: {
        sites: 'Sites web',
        automations: 'Automatisations',
        custom: 'Projets sur mesure',
        apps: 'Applications métier',
        feedback: 'Écoute client',
      },
    },
    expertises: {
      title: 'Expertises',
      children: {
        restaurants: 'Restauration',
        hotels: 'Hôtellerie',
        manufacturing: 'Production et manufacturing',
        teams: 'Gestion des équipes',
        crm: 'CRM',
        insurance: 'Assurance et courtage',
      },
    },
    pricing: 'Tarifs',
    blog: 'Blog',
    contact: 'Contact',
  },

  menu: {
    services: {
      sites: 'Des packs à prix affichés, de la page unique au site complet.',
      automations: 'Vos outils se parlent, et les tâches répétitives disparaissent.',
      custom: 'Vous avez une idée, on la construit, facturée au mois.',
      apps: 'Caisse, inventaire, MRP, CRM : vos outils, sans dépendre d’un éditeur.',
      feedback: 'Tous les avis de votre établissement au même endroit.',
    },
    expertises: {
      restaurants: 'Avis, badge NFC au paiement, inventaire.',
      hotels: 'Temps des équipes, retours clients, intégration à votre PMS.',
      manufacturing: 'Inventaire, MRP, nomenclatures, suivi de production.',
      teams: 'Pointage, suivi du temps, facturation.',
      crm: 'Un CRM sur mesure, ou l’adaptation du vôtre.',
      insurance: 'Les outils du courtage, au quotidien.',
    },
  },

  nav: {
    items: [
      { label: 'Services', href: 'services' },
      { label: 'Expertises', href: 'expertises' },
      { label: 'Réalisations', href: 'work' },
      { label: 'Tarifs', href: 'pricing' },
      { label: 'Blog', href: 'blog' },
      { label: 'À propos', href: 'about' },
      { label: 'Contact', href: 'contact' },
    ],
    cta: 'Estimer mon projet',
    ctaShort: 'Estimer',
    seeAll: 'Tout voir',
    currency: 'Devise',
    skip: 'Aller au contenu',
    menu: 'Ouvrir le menu',
    close: 'Fermer le menu',
  },

  hero: {
    eyebrow: 'Agence web, pour toute entreprise',
    title: 'On construit les outils qui font *tourner* votre entreprise.',
    titleLines: ['On construit', 'les outils', 'qui font *tourner*', 'votre entreprise.'],
    sub: 'Sites web, automatisations, applications métier : livrés vite, à prix affichés, par une équipe qui connaît votre métier.',
    primary: { label: 'Estimer mon projet', href: 'pricing' },
    secondary: { label: 'Voir nos expertises', href: 'expertises' },
    note: 'Prix affichés, hors taxes. Estimation en deux minutes.',
  },

  home: {
    services: {
      title: 'Ce que nous faisons',
      lead: 'Cinq services, et un prix affiché pour chacun.',
    },
    transition: {
      before: 'On construit',
      items: ['des sites web', 'des automatisations', 'des applications métier'],
    },
    expertises: {
      title: 'Les métiers que nous connaissons',
      lead: 'Les domaines où l’équipe est la plus forte, et les offres adaptées à chacun.',
    },
    work: {
      title: 'Nos réalisations',
      lead: 'Ce que nous avons construit, et depuis où.',
    },
    pricing: {
      title: 'Les prix sont affichés',
      lead: 'Pas de devis pour savoir combien coûte un site. Pour une automatisation, le simulateur donne une estimation en deux minutes.',
      cta: { label: 'Ouvrir le simulateur', href: 'pricing' },
    },
    blog: {
      title: 'Ce que nous apprenons',
      lead: 'Des notes de chantier, pas des communiqués.',
    },
    testimonials: {
      title: 'Ce qu’ils en disent',
      lead: 'Publié uniquement avec l’accord écrit du client.',
    },
  },

  services: {
    sites: {
      title: 'Sites web',
      lead: 'Des packs à prix affichés, de la page unique au site complet, avec les options et les délais en clair.',
      problem: null,
      delivers: [
        'Un pack Essentiel, d’une à trois pages, animations simples et formulaire de contact offert.',
        'Un pack Pro jusqu’à six pages, animations avancées, deux options incluses.',
        'Un pack Complet jusqu’à dix pages, parallaxe, une langue supplémentaire, trois options incluses.',
        'Du sur mesure pour une application web, un espace client ou des intégrations.',
      ],
      delays:
        'Économie, livré dans le mois, au prix de base. Standard, sept jours. Express, 72 heures, pour le pack Essentiel uniquement.',
      proof: 'anakut',
      faq: [
        {
          question: 'Qui fournit les contenus ?',
          answer:
            'Vous. Les textes, les photos et les logos sont fournis par vos soins ; nous les mettons en page.',
        },
        {
          question: 'Comment se passe le paiement ?',
          answer: '50 % à la commande, 50 % à la livraison.',
        },
        {
          question: 'Et si je veux partir ailleurs ?',
          answer:
            'Le transfert du site vers un autre hébergeur est possible, à un tarif affiché dans la grille.',
        },
      ],
    },
    automations: {
      title: 'Automatisations',
      lead: 'Vos outils se parlent, et les tâches répétitives disparaissent. Un flux simple a un prix affiché ; le simulateur chiffre le reste.',
      problem: null,
      delivers: [
        'Un flux part d’un déclencheur, formulaire, email ou horaire, et aboutit à une action : facturation, relance, inventaire, rapport.',
        'Chaque condition ajoutée et chaque application connectée ont leur prix.',
        'Un outil sans API ouverte demande un accès auprès de l’éditeur, et cela se paie.',
        'Une supervision mensuelle, selon le nombre de flux.',
      ],
      delays: null,
      proof: null,
      faq: [
        {
          question: 'Où tournent les flux ?',
          answer:
            'Sur l’infrastructure n8n de Kuiper Studio. Ils ne sont pas transférables vers la vôtre.',
        },
        {
          question: 'Pourquoi un outil sans API ouverte coûte plus cher ?',
          answer:
            'Sans API ouverte, il faut obtenir un accès auprès de l’éditeur : cela prend souvent plusieurs semaines de démarches.',
        },
      ],
    },
    custom: {
      title: 'Projets sur mesure',
      lead: 'Vous avez une idée, on la construit.',
      problem: null,
      delivers: [
        'Un développeur et un chef de projet, facturés au mois.',
        'Vous gardez la main sur les priorités, mois après mois.',
      ],
      delays: null,
      proof: null,
      faq: null,
    },
    apps: {
      title: 'Applications métier',
      lead: 'Caisse, inventaire, MRP, CRM : pour les entreprises qui veulent le contrôle total sans dépendre d’un éditeur.',
      problem: null,
      delivers: [
        'Une application de base, caisse, inventaire, MRP ou CRM, en paiement unique.',
        'Un ERP complet, seulement à partir d’un certain périmètre, et sur devis.',
      ],
      delays: null,
      proof: null,
      faq: null,
    },
    feedback: {
      title: 'Écoute client',
      lead: 'Une page qui rassemble tous les avis de votre établissement et fait ressortir les points forts et les points bloquants.',
      problem: null,
      delivers: [
        'Les avis Google, avec votre autorisation.',
        'Les questionnaires de votre établissement.',
        'TripAdvisor, en partie.',
      ],
      delays: null,
      proof: null,
      faq: [
        {
          question: 'Booking est-il inclus ?',
          answer: 'Non. Booking n’est pas inclus.',
        },
      ],
    },
  },

  serviceLabels: {
    problem: 'Le problème',
    delivers: 'Ce qu’on livre',
    delays: 'Les délais',
    price: 'Le prix',
    proof: 'Une réalisation',
    faq: 'Questions fréquentes',
  },

  expertises: {
    restaurants: {
      title: 'Restauration',
      lead: null,
      understand: null,
      problems: null,
      offer: [
        'L’agrégation de vos avis, et l’accompagnement pour améliorer le service.',
        'Un badge NFC au moment du paiement, qui ouvre la page d’avis. Proposé à tous les clients, jamais seulement aux clients satisfaits.',
        'L’inventaire.',
      ],
      experience: [
        'Caisses et caisses mobiles.',
        'Bornes de commande.',
        'Menus par QR code.',
      ],
      proof: null,
    },
    hotels: {
      title: 'Hôtellerie',
      lead: null,
      understand: null,
      problems: null,
      offer: [
        'Le suivi du temps des équipes.',
        'Les retours clients.',
        'Un badge NFC.',
        'L’intégration aux PMS existants.',
      ],
      experience: ['PMS et systèmes hérités du marché.'],
      proof: null,
    },
    manufacturing: {
      title: 'Production et manufacturing',
      lead: null,
      understand: null,
      problems: null,
      offer: [
        'L’inventaire.',
        'Le MRP.',
        'Les nomenclatures, les BOM.',
        'Le suivi de production.',
      ],
      experience: null,
      proof: null,
    },
    teams: {
      title: 'Gestion des équipes',
      lead: null,
      understand: null,
      problems: null,
      offer: [
        'Le pointage d’arrivée et de départ.',
        'Le suivi du temps.',
        'La facturation.',
      ],
      experience: null,
      proof: ['ocs'],
    },
    crm: {
      title: 'CRM',
      lead: null,
      understand: null,
      problems: null,
      offer: [
        'Un CRM sur mesure.',
        'Ou l’adaptation de HubSpot, Microsoft Dynamics et Salesforce.',
      ],
      experience: null,
      proof: null,
    },
    insurance: {
      title: 'Assurance et courtage',
      lead: null,
      understand: null,
      problems: null,
      offer: null,
      experience: null,
      proof: ['wave'],
    },
  },

  expertiseLabels: {
    understand: 'Ce que nous comprenons du métier',
    problems: 'Les problèmes typiques',
    offer: 'Ce que nous proposons',
    experience: 'Notre expérience',
    experienceNote: 'Ce que les fondateurs ont construit et exploité avant Kuiper Studio, chez d’autres. Ce ne sont pas des réalisations de Kuiper Studio.',
    proof: 'Les réalisations liées',
  },

  work: {
    title: 'Réalisations',
    intro: 'Ce que nous avons construit, et pour qui.',
    more: 'En savoir plus',
    resultLabel: 'Résultat',
    otherProjects: 'Autres projets',
    sectorLabel: 'Secteur',
    studio: 'Notre studio',
    cases: [
      {
        slug: 'anakut',
        name: 'Anakut',
        sector: 'Coaching',
        country: 'Suisse',
        city: 'Neuchâtel',
        coords: { lat: 46.99, lon: 6.93 },
        summary: 'Application sur mesure de gestion du coaching, et site WordPress.',
        site: 'anakut.ch',
        result: null,
        shot: null,
        video: null,
        context: null,
        need: null,
        built: ['Une application de gestion du coaching', 'Un site WordPress'],
        results: null,
        quote: null,
      },
      {
        slug: 'mp-massage',
        name: 'MP Massage',
        sector: 'Bien-être',
        country: 'Suisse',
        city: 'Neuchâtel',
        coords: { lat: 46.99, lon: 6.93 },
        summary: 'Application de gestion des massages, et site.',
        site: 'mpmassage.ch',
        result: null,
        shot: null,
        video: null,
        context: null,
        need: null,
        built: ['Une application de gestion des massages', 'Un site'],
        results: null,
        quote: null,
      },
      {
        slug: 'ocs',
        name: 'OCS',
        sector: 'Gestion des équipes',
        country: 'Cambodge',
        city: null,
        coords: null,
        summary:
          'Suivi des équipes de nettoyage dans un aéroport, avec pointage et facturation.',
        site: null,
        result: null,
        shot: null,
        video: null,
        context: null,
        need: null,
        built: ['Le pointage des équipes', 'La facturation'],
        results: null,
        quote: null,
      },
      {
        slug: 'wave',
        name: 'Wave',
        sector: 'Assurance et courtage',
        country: 'Suisse',
        city: null,
        coords: null,
        summary: 'Application mobile de fidélité, et son outil de gestion.',
        site: null,
        result: null,
        shot: null,
        video: null,
        context: null,
        need: null,
        built: ['Une application mobile de fidélité', 'Son outil de gestion'],
        results: null,
        quote: null,
      },
    ],
  },

  caseLabels: {
    context: 'Le contexte',
    need: 'Le besoin',
    built: 'Ce que nous avons construit',
    results: 'Les résultats',
    quote: 'Le mot du client',
  },

  testimonials: {
    title: 'Ce qu’ils en disent',
    note: 'Publié uniquement avec l’accord écrit du client.',
    items: [
      { company: null, author: null, role: null, text: null, photo: null },
      { company: null, author: null, role: null, text: null, photo: null },
      { company: null, author: null, role: null, text: null, photo: null },
    ],
  },

  pricing: {
    title: 'Tarifs',
    lead: 'Les prix sont affichés, hors taxes, dans votre devise.',
    disclaimer: 'Estimation indicative, confirmée par écrit après un échange.',
    packs: {
      title: 'Les packs',
      rows: {
        'essentiel-1': { name: 'Essentiel, 1 page', detail: 'Animations simples, formulaire de contact offert. Livraison express possible.' },
        'essentiel-3': { name: 'Essentiel, jusqu’à 3 pages', detail: 'Animations simples, formulaire de contact offert. Livraison express possible.' },
        pro: { name: 'Pro', detail: 'Jusqu’à 6 pages, animations avancées, 2 options incluses.' },
        complet: { name: 'Complet', detail: 'Jusqu’à 10 pages, parallaxe, 1 langue supplémentaire, 3 options incluses. 3 semaines minimum.' },
        'sur-mesure': { name: 'Sur mesure', detail: 'Applications web, espaces clients, intégrations.' },
      },
    },
    options: {
      title: 'Les options',
      note: 'À ajouter à n’importe quel pack.',
      rows: {
        'formulaire-contact': 'Formulaire de contact',
        page: 'Page supplémentaire',
        'formulaire-avance': 'Formulaire avancé',
        langue: 'Langue supplémentaire',
        'animations-avancees': 'Animations avancées',
        simulateur: 'Simulateur',
        reservation: 'Réservation légère',
        referencement: 'Référencement avancé',
        'animation-3d': 'Animation 3D',
      },
    },
    delays: {
      title: 'Les délais',
      rows: {
        economie: 'Économie, livré dans le mois',
        standard: 'Standard, 7 jours',
        express: 'Express, 72 heures, pack Essentiel uniquement',
      },
    },
    plans: {
      title: 'Les abonnements',
      note: 'Engagement de 12 mois.',
      rows: {
        'hebergement-wordpress': 'Hébergement seul, WordPress',
        'hebergement-node': 'Hébergement seul, Node.js sur mesure',
        serenite: 'Sérénité',
        croissance: 'Croissance',
        partenaire: 'Partenaire',
      },
    },
    automation: {
      title: 'Les automatisations',
      rows: {
        flow: 'Flux simple',
        condition: 'Chaque condition ajoutée',
        app: 'Chaque application connectée',
        noApi: 'Outil sans API ouverte',
      },
    },
    supervision: {
      title: 'La supervision',
      rows: {
        'jusqu-3': 'Jusqu’à 3 flux',
        'jusqu-10': 'Jusqu’à 10 flux',
        'au-dela': 'Au-delà de 10 flux',
      },
    },
    apps: {
      title: 'Les applications métier',
      rows: {
        base: 'Application de base : caisse, inventaire, MRP, CRM',
        erp: 'ERP complet, sur devis',
      },
    },
    team: {
      title: 'Les projets sur mesure',
      row: 'Un développeur et un chef de projet, au mois',
    },
    transfer: 'Transfert du site vers un autre hébergeur',
    conditions: [
      'Paiement : 50 % à la commande, 50 % à la livraison.',
      'Les contenus, textes, photos et logos, sont fournis par le client.',
      'Les flux d’automatisation sont hébergés sur l’infrastructure n8n de Kuiper Studio et ne sont pas transférables.',
    ],
  },

  configurator: {
    title: 'Estimez votre site',
    lead: 'Choisissez, le prix se met à jour. Aucune adresse email demandée avant.',
    pack: 'Votre pack',
    options: 'Vos options',
    delay: 'Votre délai',
    plan: 'Votre abonnement',
    noPlan: 'Aucun pour le moment',
    included: 'incluse',
    setup: 'Mise en place',
    monthly: 'Puis, par mois',
    includedNote: 'Les options comprises dans le pack sont déduites des plus chères que vous avez choisies.',
    quoteNote: 'Ce pack se chiffre sur devis : dites-nous ce que vous voulez construire.',
    send: 'Recevoir cette estimation',
    sending: 'Envoi…',
    sent: 'Estimation envoyée. Nous revenons vers vous sous deux jours ouvrés.',
    failed: 'L’envoi a échoué. Réessayez, ou écrivez-nous directement.',
    email: 'Votre email',
    emailNote: 'Pour recevoir le détail de cette estimation. Rien d’autre.',
    consent: 'J’accepte d’être recontacté au sujet de cette estimation.',
    steps: [
      {
        short: 'Pages',
        question: 'Combien de pages ?',
        help: 'Une page d’accueil, une page de contact, une page par service. Vous pourrez en ajouter plus tard.',
      },
      {
        short: 'Options',
        question: 'On ajoute quoi ?',
        help: 'Prenez ce dont vous avez besoin. Votre pack en comprend déjà quelques-unes.',
      },
      {
        short: 'Délai',
        question: 'Pour quand ?',
        help: 'Plus c’est rapide, plus ça coûte : nous réorganisons le planning de l’équipe.',
      },
      {
        short: 'Suivi',
        question: 'Et après la livraison ?',
        help: 'Hébergement, mises à jour, modifications. Vous pouvez aussi reprendre le site et partir.',
      },
      {
        short: 'Prix',
        question: 'Votre estimation',
        help: 'Hors taxes, sans engagement. Le prix définitif est confirmé après un échange.',
      },
    ],
    stepOf: (current, total) => `Étape ${current} sur ${total}`,
    pagesUnit: (count) => (count > 1 ? 'pages' : 'page'),
    pagesMore: 'et plus',
    packIs: 'Votre pack',
    noOption: 'Aucune option pour le moment.',
    runningTotal: 'Total en cours',
    next: 'Suivant',
    back: 'Retour',
    seeResult: 'Voir le prix',
    restart: 'Tout recommencer',
    recap: 'Ce que vous avez choisi',
    recapPages: 'Pages',
    recapOptions: 'Options',
    recapDelay: 'Délai',
    recapPlan: 'Suivi',
    edit: 'Modifier',
  },
  simulator: {
    title: 'Simulez votre automatisation',
    lead: 'Ajoutez des blocs, le prix se met à jour. Aucune adresse email demandée avant.',
    addFlow: 'Ajouter un flux',
    removeFlow: 'Retirer ce flux',
    flow: 'Flux',
    trigger: 'Déclencheur',
    tool: 'Outil',
    condition: 'Condition',
    action: 'Action',
    add: 'Ajouter',
    remove: 'Retirer',
    yes: 'si oui',
    no: 'si non',
    includedInFlow: 'compris dans le flux',
    addHere: 'Choisissez l’étape à ajouter à cet endroit.',
    pickSlot: 'Cliquez un « + » sur le canevas pour choisir où ajouter une étape.',
    apiQuestion: 'Cet outil a-t-il une API ouverte ?',
    apiYes: 'Oui',
    apiNo: 'Non',
    apiUnknown: 'Je ne sais pas',
    apiWarning: 'Sans API ouverte, il faut obtenir un accès auprès de l’éditeur : cela prend souvent plusieurs semaines de démarches.',
    setup: 'Mise en place',
    monthly: 'Supervision, par mois',
    time: 'Délai estimé',
    timeValue: 'À confirmer après un échange',
    empty: 'Commencez par ajouter un déclencheur.',
    steps: 'Les étapes de votre flux',
    triggers: { form: 'Un formulaire', email: 'Un email', schedule: 'Un horaire' },
    tools: {
      sheet: 'Un tableur',
      crm: 'Un CRM',
      accounting: 'Une comptabilité',
      pos: 'Une caisse',
      pms: 'Un PMS',
      inhouse: 'Un outil maison',
    },
    actions: {
      invoice: 'Facturer',
      followup: 'Relancer',
      inventory: 'Mettre à jour l’inventaire',
      report: 'Produire un rapport',
      ai: 'Une tâche d’IA',
    },
  },
  blog: {
    title: 'Blog',
    lead: 'Ce que nous apprenons en construisant des outils métier.',
    all: 'Tous',
    readingTime: 'min de lecture',
    share: 'Partager',
    empty: 'Aucun article pour le moment.',
  },

  contact: {
    title: 'Parlons de votre projet',
    body: 'Dites-nous ce que vous voulez construire. Nous répondons sous deux jours ouvrés.',
    form: {
      company: 'Votre entreprise',
      city: 'Ville',
      need: 'Votre besoin',
      needs: [
        'Un site web',
        'Une automatisation',
        'Un projet sur mesure',
        'Une application métier',
        'De l’écoute client',
        'Je ne sais pas encore',
      ],
      name: 'Votre nom',
      email: 'Votre email',
      message: 'Votre message',
      consent: 'J’accepte d’être recontacté au sujet de ma demande.',
      submit: 'Envoyer',
      sending: 'Envoi…',
      success: 'Message reçu. Nous revenons vers vous sous deux jours ouvrés.',
      error: 'L’envoi a échoué. Réessayez, ou écrivez-nous directement.',
      required: 'Ce champ est requis.',
      invalidEmail: 'Cette adresse email ne semble pas valide.',
    },
  },

  founders: {
    title: 'Les fondateurs',
    people: [
      {
        name: 'Arnaud Sebire',
        role: 'Cofondateur, produit et relation client',
        bio: null,
        photo: null,
      },
      {
        name: 'Louis Vezia',
        role: 'Cofondateur, direction technique',
        bio: null,
        photo: null,
      },
    ],
  },

  faq: {
    title: 'Questions fréquentes',
    items: [
      {
        question: 'Travaillez-vous avec toutes les entreprises ?',
        answer:
          'Oui. Kuiper Studio est une agence web généraliste. Les pages Expertises montrent les domaines où l’équipe est la plus forte.',
      },
      {
        question: 'Les prix affichés sont-ils hors taxes ?',
        answer: 'Oui, tous les prix du site sont hors taxes.',
      },
      {
        question: 'En euros ou en dollars ?',
        answer:
          'En euros pour les visiteurs d’Europe, en dollars ailleurs. Le sélecteur de l’en-tête permet de changer à tout moment.',
      },
      {
        question: 'Combien de temps pour un site ?',
        answer:
          'Dans le mois en Économie, sept jours en Standard, 72 heures en Express pour le pack Essentiel.',
      },
    ],
  },

  finalCta: {
    title: 'On construit quoi, ensemble ?',
    sub: 'Dites-nous où ça coince. Nous vous répondons avec un prix et un délai.',
    primary: { label: 'Estimer mon projet', href: 'pricing' },
    secondary: { label: 'Nous écrire', href: 'contact' },
  },

  footer: {
    columns: [
      {
        title: 'Le studio',
        links: [
          { label: 'Réalisations', href: 'work' },
          { label: 'Tarifs', href: 'pricing' },
          { label: 'Blog', href: 'blog' },
          { label: 'À propos', href: 'about' },
          { label: 'Contact', href: 'contact' },
        ],
      },
      {
        title: 'Légal',
        links: [
          { label: 'Mentions légales', href: 'legal' },
          { label: 'Confidentialité', href: 'privacy' },
        ],
      },
    ],
    legal: 'Kuiper Studio, Phnom Penh.',
    tagline: 'On construit les outils qui font tourner votre entreprise.',
  },

  cookies: {
    title: 'Cookies',
    body: 'Nous utilisons des cookies pour faire fonctionner le site et, si vous l’acceptez, pour mesurer son audience. Aucun traceur n’est déposé avant votre accord.',
    accept: 'Accepter',
    refuse: 'Refuser',
    customize: 'Personnaliser',
    save: 'Enregistrer',
    necessary: {
      title: 'Nécessaires',
      body: 'Indispensables au fonctionnement du site. Toujours actifs.',
    },
    analytics: {
      title: 'Mesure d’audience',
      body: 'Pour savoir quelles pages sont lues. Désactivés tant que vous n’avez pas accepté.',
    },
  },

  about: {
    title: 'À propos',
    body: null,
  },
  legal: { title: 'Mentions légales', body: null },
  privacy: { title: 'Confidentialité', body: null },
}
