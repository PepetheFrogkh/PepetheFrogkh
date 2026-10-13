import type { Dict } from './types'

/**
 * Le texte francais du site, en un seul endroit.
 *
 * Regles du cahier respectees ici : ton direct, simple, vouvoiement ; aucun
 * tiret long ; prix toujours hors taxes ; aucun chiffre, logo ou temoignage
 * qui ne figure pas dans le cahier. Ce qui manque est un emplacement
 * [À FOURNIR] visible, pas une invention.
 *
 * Dans un titre, le mot entre asterisques passe en italique orange terre.
 */
export const fr: Dict = {
  langName: 'Français',

  meta: {
    siteName: 'Kuiper Studio',
    home: {
      title: 'Kuiper Studio · Améliorez l’expérience de vos clients. Mesurez-la.',
      description:
        'Kuiper Studio aide les hôtels, les restaurants et les commerces indépendants à comprendre ce que pensent leurs clients, à corriger ce qui coince et à gagner en rentabilité, avec les bons outils numériques.',
    },
    situations: {
      title: 'Votre situation · Kuiper Studio',
      description:
        'Écoute client, ouverture, rentabilité, groupes : la porte d’entrée qui correspond à votre établissement.',
    },
    work: {
      title: 'Réalisations · Kuiper Studio',
      description: 'Ce que nous avons construit pour des hôtels, des restaurants et des indépendants.',
    },
    method: {
      title: 'Méthode · Kuiper Studio',
      description: 'Six étapes, sans surprise : comprendre, cadrer, dessiner, construire, lancer, faire grandir.',
    },
    about: {
      title: 'À propos · Kuiper Studio',
      description: 'Deux fondateurs, un seul interlocuteur. Kuiper Studio est basé à Phnom Penh.',
    },
    diagnostic: {
      title: 'Diagnostic gratuit de vos avis · Kuiper Studio',
      description:
        'Indiquez votre établissement : sous 48 heures ouvrées, vous recevez le résumé de vos avis publics. Gratuit, sans engagement.',
    },
    legal: { title: 'Mentions légales · Kuiper Studio', description: 'Mentions légales de Kuiper Studio.' },
    privacy: {
      title: 'Confidentialité · Kuiper Studio',
      description: 'Comment Kuiper Studio traite vos données.',
    },
  },

  nav: {
    items: [
      { label: 'Votre situation', href: '#situations' },
      { label: 'Nos offres', href: '#offres' },
      { label: 'Réalisations', href: 'work' },
      { label: 'Méthode', href: 'method' },
      { label: 'À propos', href: 'about' },
    ],
    cta: 'Diagnostic gratuit',
    ctaShort: 'Diagnostic',
    skip: 'Aller au contenu',
    menu: 'Ouvrir le menu',
    close: 'Fermer le menu',
  },

  hero: {
    eyebrow: 'Hôtellerie, restauration et commerce',
    title: 'Améliorez l’expérience de vos clients. *Mesurez-la.*',
    sub: 'Kuiper Studio aide les hôtels, les restaurants et les commerces indépendants à comprendre ce que pensent leurs clients, à corriger ce qui coince et à gagner en rentabilité, avec les bons outils numériques.',
    primary: { label: 'Diagnostic gratuit de vos avis', href: 'diagnostic' },
    secondary: { label: 'Réserver un appel', href: 'booking' },
    note: '30 minutes avec Arnaud, gratuit et sans engagement',
  },

  proof: {
    logosTitle: 'Ils nous ont choisis',
    figures: [
      { prefix: 'dès ', value: '499', unit: ' € HT', caption: 'Prix affichés' },
      { value: '72', unit: ' heures', caption: 'Pour la livraison la plus rapide' },
      { value: '2', unit: ' fondateurs', caption: 'Un seul interlocuteur' },
    ],
  },

  showcase: {
    title: 'Nos réalisations',
    note: 'Captures des projets',
  },

  situations: {
    title: 'Quelle est votre situation ?',
    more: 'En savoir plus',
    cards: [
      {
        slug: 'ecoute-client',
        index: '01',
        photo: null,
        title: 'Sachez enfin ce que vos clients pensent de vous.',
        quote: 'Je ne sais pas ce qui ne va pas.',
        tags: ['Avis', 'Questionnaires', 'Alertes'],
        published: true,
        link: null,
      },
      {
        slug: 'ouverture',
        index: '02',
        photo: null,
        title: 'Ouvrez avec tout ce qu\u2019il faut, dès le premier jour.',
        quote: 'Il me faut tout, vite.',
        tags: ['Site', 'Réservation', 'Automatisations'],
        published: true,
        link: null,
      },
      {
        slug: 'rentabilite',
        index: '03',
        photo: null,
        title: 'Des clients, oui. De la marge, aussi.',
        quote: 'J\u2019ai des clients, mais pas de marge.',
        tags: ['Inventaire', 'Pertes', 'Marges'],
        published: true,
        link: null,
      },
      {
        slug: 'groupes',
        index: '04',
        photo: null,
        title: 'Fidélisez vos clients dans tous vos établissements.',
        quote: 'Je veux fidéliser à grande échelle.',
        tags: ['Fidélité', 'Tableaux de bord', 'Intégrations'],
        published: true,
        link: null,
      },
      {
        slug: 'visibilite',
        index: '05',
        photo: null,
        title: 'Un beau site, tout de suite.',
        quote: 'Je veux juste être visible.',
        tags: ['Site', 'Prix affiché', 'Livraison rapide'],
        published: true,
        link: 'home#offres',
      },
    ],
  },

  manifesto:
    'L’expérience client ne se devine pas. Elle se mesure, et elle s’améliore avec les bons outils.',

  /**
   * Les trois propositions du manifeste, une par acte de l'en-tete. Elles
   * doivent rester la phrase du cahier, decoupee : c'est le meme texte.
   */
  story: [
    'L\u2019expérience client ne se devine pas.',
    'Elle se mesure,',
    'et elle s\u2019améliore avec les bons outils.',
  ],

  founders: {
    title: 'Les fondateurs',
    people: [
      {
        name: 'Arnaud Sebire',
        role: 'Cofondateur, produit et relation client',
        bio: 'Une dizaine d\u2019années sur les produits opérationnels : conception fonctionnelle, processus métier, équipes de développement.',
        photo: '/equipe/arnaud-sebire.webp',
      },
      {
        name: 'Louis Vezia',
        role: 'Cofondateur, direction technique',
        bio: 'Une dizaine d\u2019années sur l\u2019architecture, la donnée, la performance et la sécurité, dont plusieurs projets CRM complexes.',
        photo: '/equipe/louis-vezia.webp',
      },
    ],
  },

  offers: {
    title: 'Nos offres',
    note: 'Le configurateur donne une estimation en deux minutes. Prix hors taxes.',
    items: [
      {
        title: 'Sites',
        body: 'Un site animé et soigné, livré en 72 heures, une semaine ou un mois, hébergé et entretenu par nous.',
        price: 'À partir de 499 € HT',
      },
      {
        title: 'Automatisations',
        body: 'Vos outils connectés entre eux : moins de saisie, moins d\u2019oublis, supervisés par nous.',
        price: 'À partir de 390 € HT par flux',
      },
      {
        title: 'Sur mesure',
        body: 'Applications, espaces clients et intégrations, quand rien du marché ne colle.',
        price: 'Sur devis',
      },
    ],
  },

  work: {
    title: 'Ce que nous avons construit',
    intro: 'Trois projets livrés. Les résultats publiés ici sont vérifiés, ou signalés comme manquants.',
    filters: ['Fidélité', 'Coaching', 'Bien-être'],
    all: 'Tous',
    resultLabel: 'Résultat',
    otherProjects: 'Autres projets',
    sectorLabel: 'Secteur',
    cases: [
      {
        slug: 'wave',
        name: 'Wave',
        sector: 'Fidélité',
        country: 'Suisse',
        site: 'wavenetwork.ch',
        summary:
          'L\u2019application mobile du Wave Pass, un programme d\u2019avantages pour les membres utilisé chez des établissements partenaires, et l\u2019outil de gestion qui la pilote.',
        result: null,
        shot: null,
        context: null,
        need: null,
        built: null,
        results: null,
        quote: null,
      },
      {
        slug: 'anakut',
        name: 'Anakut',
        sector: 'Coaching',
        country: 'Neuchâtel, Suisse',
        site: 'anakut.ch',
        summary:
          'Une application sur mesure pour gérer l\u2019activité de coaching, et le site WordPress d\u2019un coach de boxe.',
        result: null,
        shot: null,
        context: null,
        need: null,
        built: null,
        results: null,
        quote: null,
      },
      {
        slug: 'mp-massage',
        name: 'MP Massage',
        sector: 'Bien-être',
        country: 'Neuchâtel, Suisse',
        site: 'mpmassage.ch',
        summary:
          'Une application pour gérer l\u2019activité de massage, et le site d\u2019une praticienne en massage thaï.',
        result: null,
        shot: null,
        context: null,
        need: null,
        built: null,
        results: null,
        quote: null,
      },
    ],
  },

  convictions: {
    title: 'Nos convictions',
    items: [
      {
        title: 'Un prix se montre, il ne se cache pas.',
        body: 'Vous connaissez le prix avant de nous parler ; le devis ne fait que le confirmer, par écrit.',
      },
      {
        title: 'Vite ne veut pas dire bâclé.',
        body: 'Une méthode courte et des bases éprouvées permettent de livrer en jours plutôt qu\u2019en mois.',
      },
      {
        title: 'La mise en ligne n\u2019est pas la fin.',
        body: 'Un site vit, se met à jour, se surveille ; nous restons là, chaque mois.',
      },
    ],
  },

  method: {
    title: 'Six étapes, sans surprise',
    intro: 'Le délai démarre à la réception de vos contenus.',
    steps: [
      { title: 'Comprendre', body: null, demo: null },
      { title: 'Cadrer', body: null, demo: null },
      { title: 'Dessiner', body: null, demo: null },
      { title: 'Construire', body: null, demo: null },
      { title: 'Lancer', body: null, demo: null },
      { title: 'Faire grandir', body: null, demo: null },
    ],
  },

  testimonials: {
    title: 'Ce qu’ils en disent',
    note: 'Une vidéo et deux avis écrits, publiés avec l’accord écrit du client.',
  },

  diagnostic: {
    title: 'Ce que vos clients pensent vraiment',
    body: 'Indiquez votre établissement : sous 48 heures ouvrées, vous recevez le résumé de vos avis publics, ce qu’ils aiment et ce qui revient en négatif. Gratuit, sans engagement.',
    preview: {
      title: 'Votre résumé contiendra',
      lines: [
        'Le résumé de vos avis publics',
        'Ce que vos clients aiment',
        'Ce qui revient en négatif',
      ],
    },
    form: {
      venue: 'Nom de l’établissement',
      city: 'Ville',
      type: 'Type',
      types: ['Hôtel', 'Restaurant', 'Commerce', 'Autre'],
      maps: 'Lien Google Maps',
      mapsHint: 'Facultatif',
      name: 'Votre nom',
      email: 'Votre email',
      consent:
        'J’accepte que Kuiper Studio me contacte au sujet de ce diagnostic et conserve ces informations.',
      submit: 'Recevoir mon diagnostic',
      sending: 'Envoi en cours',
      success:
        'C’est enregistré. Vous recevez le résumé de vos avis sous 48 heures ouvrées, et un email de confirmation tout de suite.',
      error: 'L’envoi a échoué. Écrivez à arnaud@kuiperstudio.com et nous prenons le relais.',
      required: 'Ce champ est obligatoire.',
      invalidEmail: 'Cette adresse email ne semble pas valide.',
    },
  },

  faq: {
    title: 'Questions fréquentes',
    items: [
      {
        question: 'Le diagnostic est-il vraiment gratuit ?',
        answer:
          'Oui. Vous recevez le résumé de vos avis publics, sans engagement et sans relance insistante.',
      },
      {
        question: 'Travaillez-vous avec un seul restaurant ?',
        answer: 'Oui. Nos offres sont pensées pour l’établissement unique comme pour les groupes.',
      },
      {
        question: 'Combien coûte un site ?',
        answer: 'À partir de 499 € HT ; le configurateur donne une estimation en deux minutes.',
      },
      {
        question: 'En combien de temps ?',
        answer:
          'De 72 heures à un mois selon le projet ; le délai démarre à la réception de vos contenus.',
      },
      {
        question: 'Pourquoi un abonnement ?',
        answer:
          'Parce qu’un site et des automatisations s’hébergent, se surveillent et évoluent, chaque mois.',
      },
    ],
  },

  finalCta: {
    title: 'Parlons de vos clients.',
    sub: 'Trente minutes, gratuites et sans engagement.',
    primary: { label: 'Diagnostic gratuit', href: 'diagnostic' },
    secondary: { label: 'Réserver un appel', href: 'booking' },
  },

  footer: {
    columns: [
      {
        title: 'Situations',
        links: [
          { label: 'Écoute client', href: 'situations/ecoute-client' },
          { label: 'Ouverture', href: 'situations/ouverture' },
          { label: 'Rentabilité', href: 'situations/rentabilite' },
          { label: 'Groupes et chaînes', href: 'situations/groupes' },
          { label: 'Un beau site, tout de suite', href: 'home#offres' },
        ],
      },
      {
        title: 'Offres',
        links: [
          { label: 'Réalisations', href: 'work' },
          { label: 'Méthode', href: 'method' },
          { label: 'Diagnostic gratuit', href: 'diagnostic' },
        ],
      },
      {
        title: 'Studio',
        links: [
          { label: 'À propos', href: 'about' },
          { label: 'Mentions légales', href: 'legal' },
          { label: 'Confidentialité', href: 'privacy' },
        ],
      },
      {
        title: 'Contact',
        links: [
          { label: 'arnaud@kuiperstudio.com', href: 'mailto:arnaud@kuiperstudio.com' },
          { label: 'Phnom Penh, Cambodge', href: '' },
        ],
      },
    ],
    legal: 'Kuiper Studio, Phnom Penh. Tous les prix sont hors taxes.',
    tagline: 'L’expérience client se mesure.',
  },

  cookies: {
    title: 'Cookies',
    body: 'Nous utilisons des cookies pour faire fonctionner le site et, si vous l’acceptez, pour mesurer son audience. Aucun traceur n’est déposé avant votre accord.',
    accept: 'Accepter',
    refuse: 'Refuser',
    customize: 'Personnaliser',
    save: 'Enregistrer mes choix',
    necessary: {
      title: 'Nécessaires',
      body: 'Indispensables au fonctionnement du site. Toujours actifs.',
    },
    analytics: {
      title: 'Mesure d’audience',
      body: 'Nous indiquent les pages consultées, sans vous identifier.',
    },
  },

  situationPages: [
    {
      slug: 'ecoute-client',
      quote: '[À FOURNIR]',
      title: 'Sachez enfin ce que vos clients pensent de vous.',
      problem: ['[À FOURNIR]'],
      steps: [
        'On rassemble vos avis et vos questionnaires.',
        'On identifie les sujets qui reviennent.',
        'Chaque lundi, un résumé et une alerte à chaque avis négatif.',
      ],
      measures: ['Note Google moyenne', 'Nombre d’avis par mois', 'Part des remarques par thème'],
      price: 'Après le diagnostic gratuit, prix [À FIXER avec Louis]',
      proof: null,
    },
    {
      slug: 'ouverture',
      quote: '[À FOURNIR]',
      title: 'Ouvrez avec tout ce qu’il faut, dès le premier jour.',
      problem: ['[À FOURNIR]'],
      steps: [
        'Le site, la réservation et les widgets.',
        'Les automatisations.',
        'Vos outils connectés entre eux.',
      ],
      measures: ['Réservations directes', 'Demandes reçues par le site'],
      price: 'À partir de 1 290 € HT',
      proof: null,
    },
    {
      slug: 'rentabilite',
      quote: '[À FOURNIR]',
      title: 'Des clients, oui. De la marge, aussi.',
      problem: ['[À FOURNIR]'],
      steps: [
        'On analyse l’inventaire, les pertes et les marges.',
        'On outille ce qui manque.',
        'On suit les résultats.',
      ],
      measures: ['Pertes', 'Marge par produit', 'Ruptures de stock'],
      price: 'Sur devis, après un audit',
      proof: null,
    },
    {
      slug: 'groupes',
      quote: '[À FOURNIR]',
      title: 'Fidélisez vos clients dans tous vos établissements.',
      problem: ['[À FOURNIR]'],
      steps: [
        'Une application de fidélité.',
        'Des tableaux de bord communs.',
        'Des intégrations avec la caisse et le logiciel hôtelier.',
      ],
      measures: ['Clients qui reviennent', 'Avantages utilisés', 'Chiffres par établissement'],
      price: 'Sur devis, à partir de 10 établissements',
      proof: null,
    },
  ],

  situationLabels: {
    before: 'Avant',
    after: 'Après',
    problem: 'Le problème',
    steps: 'Ce qu’on fait',
    measures: 'Ce que vous mesurez',
    proof: 'La preuve',
    price: 'Le prix',
  },

  caseLabels: {
    context: 'Le contexte',
    need: 'Le besoin',
    built: 'Ce qu’on a construit',
    results: 'Les résultats',
    quote: 'La citation',
  },

  about: {
    title: 'Deux fondateurs, un seul interlocuteur',
    body: null,
  },

  legal: { title: 'Mentions légales', body: null },
  privacy: { title: 'Confidentialité', body: null },
}
