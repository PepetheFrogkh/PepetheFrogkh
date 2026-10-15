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
    stack: {
      title: 'Notre stack · Kuiper Studio',
      description:
        'Les technologies sur lesquelles nous nous engageons, et la charge que nous pouvons encaisser.',
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

  stack: {
    title: 'Notre stack',
    lead: 'Ce que nous savons construire, et sur quoi nous nous engageons. Si votre projet tourne sur autre chose, dites-le : nous dirons franchement si nous savons le reprendre ou non.',
    groups: [
      {
        title: 'Mobile',
        note: 'Une application sur les deux magasins, ou une application native quand la plateforme l’exige.',
        items: [
          { name: 'Flutter', logo: '/stack/flutter.svg' },
          { name: 'React Native', logo: '/stack/react.svg' },
          { name: 'Kotlin', logo: '/stack/kotlin.svg' },
          { name: 'Swift', logo: '/stack/swift.svg' },
        ],
      },
      {
        title: 'Web',
        note: 'Du site vitrine à l’application métier qui tourne dans le navigateur.',
        items: [
          { name: 'Next.js', logo: '/stack/nextjs.svg' },
          { name: 'React', logo: '/stack/react.svg' },
          { name: 'TypeScript', logo: '/stack/typescript.svg' },
          { name: 'WebGL', logo: '/stack/webgl.svg' },
        ],
      },
      {
        title: 'Serveur',
        note: 'L’API, les traitements, les tâches de fond.',
        items: [
          { name: 'Laravel', logo: '/stack/laravel.svg' },
          { name: 'PHP', logo: '/stack/php.svg' },
          { name: 'Node.js', logo: '/stack/node.svg' },
          { name: 'Python', logo: '/stack/python.svg' },
        ],
      },
      {
        title: 'Bases de données',
        note: 'Relationnelles, les trois. Votre donnée reste la vôtre, et elle s’exporte.',
        items: [
          { name: 'PostgreSQL', logo: '/stack/postgresql.svg' },
          { name: 'MySQL', logo: '/stack/mysql.svg' },
          { name: 'MariaDB', logo: '/stack/mariadb.svg' },
        ],
      },
      {
        title: 'Automatisation',
        note: 'Pour faire parler vos outils entre eux. Le choix dépend de qui doit pouvoir modifier le flux après nous.',
        items: [
          { name: 'n8n', logo: '/stack/n8n.svg' },
          { name: 'Make', logo: '/stack/make.svg' },
          { name: 'Zapier', logo: '/stack/zapier.svg' },
        ],
      },
      {
        title: 'Intelligence artificielle',
        note: 'Comme étape dans un flux, sur une tâche nommée. Le fournisseur et l’endroit où transite votre donnée sont écrits avant de commencer.',
        items: [
          { name: 'Claude', logo: '/stack/claude.svg' },
          { name: 'GPT', logo: '/stack/openai.svg' },
          { name: 'Gemini', logo: '/stack/gemini.svg' },
          { name: 'Mistral', logo: '/stack/mistral.svg' },
        ],
      },
      {
        title: '3D',
        note: 'Pour produire un visuel, pas pour en mettre partout : l’animation de ce site est rendue hors ligne, et le visiteur ne reçoit que des images.',
        items: [{ name: 'Meshy', logo: null }],
      },
    ],
    capacity: {
      title: 'Combien sommes-nous ?',
      lead: 'Ce n’est pas la bonne question. La bonne, c’est quelle charge nous pouvons encaisser, et à quelle vitesse.',
      items: [
        'Nous avons l’un des plus gros réseaux de développeurs du Cambodge. Plus de cinq cents CV de développeurs que nous connaissons personnellement.',
        'Une semaine après la signature et le premier règlement, les profils sont en poste. Pas un mois de recrutement, une semaine.',
        'Dix, vingt, cinquante développeurs sur un projet ne posent pas de problème de nombre. La question est de savoir qui, et nous savons où les trouver.',
        'Nous recrutons, nous encadrons, nous remplaçons. Vous n’avez pas d’entretien à passer.',
      ],
    },
    kit: {
      title: 'Ce que l’équipe a sous la main',
      items: [
        { label: 'Les bureaux', value: 'Une surface à Phnom Penh, jusqu’à soixante postes.' },
        { label: 'Le matériel', value: 'Un Mac M5 et un écran 27 pouces par personne, plus le bureau et la chaise. Vous n’achetez rien.' },
        { label: 'Les horaires', value: 'De 8 h à 19 h, heure de Phnom Penh. Le pack Support de nuit couvre vos heures à vous.' },
        { label: 'Le remplacement', value: 'Quelqu’un tombe malade, quelqu’un reprend. Tout est documenté chez nous : une à deux heures de reprise au lieu de trois jours. Sur une date ferme, c’est ce détail qui fait la différence.' },
      ],
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
        consulting: 'Accompagnement',
        feedback: 'Écoute client',
      },
    },
    expertises: {
      title: 'Expertises',
      children: {
        restaurants: 'Restauration',
        retail: 'Commerce de détail',
        hotels: 'Hôtellerie',
        manufacturing: 'Production et manufacturing',
        teams: 'Gestion des équipes',
        crm: 'CRM',
        insurance: 'Assurance et courtage',
        automation: 'Automatisation',
        ai: 'Intelligence artificielle',
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
      consulting: 'Six mois pour trouver ce qui cloche, chiffres à l’appui.',
      feedback: 'Tous les avis de votre établissement au même endroit.',
    },
    expertises: {
      restaurants: 'Caisse, recettes, coût matière, avis clients.',
      retail: 'Stock juste, coût de revient complet, plusieurs points de vente.',
      hotels: 'Vos systèmes se parlent, et leur donnée tient en un seul endroit.',
      manufacturing: 'Inventaire, MRP, nomenclatures, suivi de production.',
      teams: 'Pointage avec le lieu, suivi du temps, facturation.',
      crm: 'Un CRM sur mesure, ou l’adaptation du vôtre.',
      insurance: 'Les outils du courtage, au quotidien.',
      automation: 'Vos outils se parlent, et la double saisie disparaît.',
      ai: 'L’IA dans vos flux, là où elle fait gagner du temps, et nulle part ailleurs.',
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
    language: 'Langue',
    skip: 'Aller au contenu',
    menu: 'Ouvrir le menu',
    close: 'Fermer le menu',
    view: 'Voir',
  },

  words: {
    testimonial: 'témoignage',
    desktopShot: 'capture ordinateur',
    phoneShot: 'capture téléphone',
    figures: 'chiffres vérifiés',
    updatedOn: 'date de mise à jour',
    photo: 'photo',
    shot: 'capture',
  },

  hero: {
    eyebrow: 'Agence web, pour toute entreprise',
    title: 'On construit des sites web, des automatisations, des applications métier.',
    titleLines: ['On construit', 'des sites web.'],
    rotate: [
      'des sites web.',
      'des automatisations.',
      'des applications métier.',
      'les ponts qui manquent.',
      'ce qui vous manque.',
    ],
    sub: 'Les outils qui font tourner votre entreprise, livrés vite et à prix affichés, par une équipe qui connaît votre métier.',
    primary: { label: 'Estimer mon projet', href: 'pricing' },
    secondary: { label: 'Voir nos expertises', href: 'expertises' },
    note: 'Prix affichés, hors taxes. Estimation en deux minutes.',
  },

  home: {
    services: {
      title: 'Ce que nous faisons',
      lead: 'Cinq services, et un prix affiché pour chacun.',
    },
    sequence: {
      eyebrow: 'Comment ça s’assemble',
      title: 'Vos outils, mis *ensemble*.',
      lead: 'Chaque pièce existe déjà quelque part : la caisse, le stock, le site, le tableur. Notre travail est de les faire tourner dans le même sens.',
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
      problem: [
        'Vous avez demandé un devis pour un site, et vous avez reçu une fourchette sans rien qui l’explique.',
        'Le site actuel a été fait par un prestataire qui n’est plus joignable, et personne ne sait sur quoi il tourne.',
        'Chaque modification demande un échange de courriels et une facture.',
        'Le site ne parle à aucun de vos outils : les demandes arrivent par email et se ressaisissent à la main.',
      ],
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
      problem: [
        'La même information se saisit trois fois, dans trois outils, par trois personnes.',
        'Quelqu’un passe deux heures par semaine à recopier des lignes d’un export vers un autre.',
        'Les relances se font quand on y pense, donc pas toujours.',
        'Vos logiciels ont chacun leur export, et aucun ne lit celui du voisin.',
      ],
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
      lead: 'Vous avez une idée, on la construit. Votre budget n’est pas une honte : dites-le nous, et nous disons ce qui tient dedans.',
      problem: [
        'Vous avez un projet d’application, et tous les devis reçus coûtent plusieurs fois ce que vous pouviez y mettre.',
        'On vous a proposé un prix très bas, puis livré la moitié de ce qui était promis.',
        'Personne n’accepte de regarder le projet tant qu’il n’atteint pas un certain budget.',
        'Vous ne savez pas si votre idée est chère parce qu’elle est compliquée, ou parce que personne n’a pris le temps de la regarder.',
      ],
      delivers: [
        'Un développeur et un chef de projet, facturés au mois.',
        'Vous gardez la main sur les priorités, mois après mois.',
        'Un premier échange où nous challengeons l’idée avant de la chiffrer : souvent, les deux tiers du périmètre peuvent attendre.',
        'Une proposition calée sur votre budget, qui dit ce qui rentre dedans et ce qui n’y rentre pas.',
      ],
      delays: null,
      proof: 'wave',
      faq: [
        {
          question: 'Et si mon budget est petit ?',
          answer:
            'Dites-le nous. Nous préférons construire la moitié utile d’un projet que refuser de le regarder. Si rien d’utile ne tient dans le budget, nous le disons aussi.',
        },
        {
          question: 'Au forfait ou au mois ?',
          answer:
            'Les deux existent. Au forfait quand le périmètre est clair et la date ferme, au mois quand il va bouger. Nous proposons celui qui correspond, et vous tranchez.',
        },
      ],
    },
    apps: {
      title: 'Applications métier',
      lead: 'Caisse, inventaire, MRP, CRM : pour les entreprises qui veulent le contrôle total sans dépendre d’un éditeur.',
      problem: [
        'Votre parc informatique s’est construit par couches, et plus personne ne sait ce qui dépend de quoi.',
        'Un prestataire est parti avant la fin, et il reste un outil à moitié installé que personne n’ose toucher.',
        'L’éditeur de votre logiciel facture chaque évolution, et refuse l’accès à votre propre donnée.',
        'Vos outils sont trop anciens pour être connectés, et trop installés pour être remplacés d’un coup.',
      ],
      delivers: [
        'Une application de base, caisse, inventaire, MRP ou CRM, en paiement unique.',
        'Un ERP complet, seulement à partir d’un certain périmètre, et sur devis.',
      ],
      delays: null,
      proof: 'mp-massage',
      faq: null,
    },
    consulting: {
      title: 'Accompagnement',
      lead: 'Six mois pour comprendre pourquoi ça ne marche pas, avec vos chiffres et non avec une opinion. Nous récupérons votre donnée, nous la lisons, et nous vous disons où est le problème.',
      problem: [
        'Vos ventes baissent et vous ne savez pas si c’est la carte, les prix, le service ou l’emplacement.',
        'La donnée existe, dans la caisse, l’ERP, le CRM et le site, mais chacun la garde pour lui.',
        'Les cabinets qui font ce travail facturent plus cher que ce que l’analyse peut rapporter.',
        'Les questionnaires que vous avez essayés ne disent rien d’exploitable : « avez-vous passé un bon repas » n’est pas une question.',
      ],
      delivers: [
        'La récupération de votre donnée depuis vos outils existants : caisse, ERP, CRM, site web, et ce que le web dit de vous.',
        'Un tableau de bord des tendances : les heures, les jours, les produits, les écarts.',
        'Un dispositif de recueil d’avis au moment de la commande, par QR code, par carte ou par email, proposé à tous les clients.',
        'Des questions qui servent : ce qui a été commandé, quand, à quelle table, par qui servi, et la note mise à la fin.',
        'Le croisement de tout cela sur la période : ce qui relie les notes basses entre elles, et ce qui ne les relie pas.',
        'Le suivi de vos avis publics et du délai de réponse, parce qu’un avis laissé sans réponse coûte plus cher que l’avis lui-même.',
        'À la fin, une réponse écrite : voilà ce qui ne va pas, et voilà sur quoi s’appuie cette conclusion.',
      ],
      delays:
        'Six mois. C’est la durée minimale pour qu’une tendance se distingue d’un mauvais mois.',
      proof: null,
      faq: [
        {
          question: 'Pourquoi six mois ?',
          answer:
            'Parce qu’en dessous, on ne lit pas une tendance : on lit la météo, les vacances scolaires et un week-end prolongé. Six mois permettent de comparer des périodes comparables.',
        },
        {
          question: 'Qui est propriétaire de la donnée collectée ?',
          answer:
            'Vous. Elle est à vous au début, pendant et à la fin, et elle vous reste si nous nous arrêtons là.',
        },
        {
          question: 'Et si la conclusion ne vous plaît pas ?',
          answer:
            'Nous la donnons quand même. Nous sommes payés pour trouver ce qui cloche, pas pour confirmer ce qui arrange.',
        },
      ],
    },
    feedback: {
      title: 'Écoute client',
      lead: 'Une page qui rassemble tous les avis de votre établissement et fait ressortir les points forts et les points bloquants.',
      problem: [
        'Les avis arrivent sur quatre plateformes, et personne n’a le temps de les suivre toutes.',
        'Un mauvais avis reste des semaines sans réponse, et c’est la réponse manquante qui se voit.',
        'Vous savez que le service se dégrade certains soirs, sans pouvoir dire lesquels ni pourquoi.',
        'Les questionnaires existants ne sont remplis que par les clients déjà contents.',
      ],
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
      lead: 'Nous avons passé des années dans les caisses de restaurant avant de monter le studio. Nous connaissons le bruit du service, et ce qu’un outil mal posé coûte un vendredi soir.',
      understand: [
        'Une caisse n’est pas un logiciel de bureau. Elle doit marcher vite, au doigt, les mains occupées, et ne jamais perdre une commande parce que le réseau a sauté.',
        'Le coût matière se joue à la recette, pas au bilan. Tant que le plat n’est pas décomposé en ingrédients, la marge reste une estimation.',
        'La donnée du service existe déjà : l’heure de la commande, la table, le serveur, le délai, le montant. Elle dort dans la caisse, personne ne la lit.',
        'Un avis client arrive trop tard pour le client qui l’a écrit, mais juste à temps pour les cent suivants.',
      ],
      problems: [
        'La caisse, la réservation, la comptabilité et le site ne se parlent pas. Chaque chiffre se ressaisit à la main, et chaque saisie est une erreur possible.',
        'Les rapports du logiciel de caisse donnent le chiffre d’affaires, et rien sur ce qui l’explique.',
        'Les recettes sont sur un tableur que personne n’a mis à jour depuis le dernier changement de carte.',
        'Les avis tombent sur quatre plateformes différentes, et personne ne répond sur aucune.',
      ],
      offer: [
        'Connecter la caisse, la réservation et la comptabilité, pour que le chiffre se saisisse une seule fois.',
        'Les recettes, les nomenclatures et le coût matière, tenus à jour avec vos prix d’achat.',
        'L’inventaire, avec les sorties déduites des ventes.',
        'Un tableau de bord qui croise l’heure, la table, le serveur et la note, et qui dit où le service se dégrade.',
        'L’agrégation de vos avis, et l’accompagnement pour améliorer le service.',
        'Un badge NFC au moment du paiement, qui ouvre la page d’avis. Proposé à tous les clients, jamais seulement aux clients satisfaits.',
      ],
      experience: [
        'Arnaud a passé plus de cinq ans dans les systèmes de caisse, avec des restaurants de toutes tailles, de l’indépendant à la chaîne.',
        'Recruté pour reprendre la caisse d’un éditeur cambodgien, il en a refait la base à partir des retours du terrain. Ce même produit équipe aujourd’hui plus de six cents restaurants à Phnom Penh.',
        'Louis a passé deux ans à développer des programmes de fidélité pour des restaurants à Hong Kong, dans un éditeur de caisse.',
        'Caisses et caisses mobiles, bornes de commande, menus par QR code : nous les avons installés, cassés et réparés avant de les proposer.',
      ],
      proof: null,
      photo: null,
    },
    retail: {
      title: 'Commerce de détail',
      lead: 'La caisse, le stock, les achats et la livraison sont le même problème vu de quatre endroits. Nous avons travaillé aux quatre.',
      understand: [
        'Un stock juste vaut plus qu’un rapport joli. Tant que l’écart d’inventaire n’est pas expliqué, aucune décision d’achat ne tient.',
        'La marge se fait à l’achat et se perd à la démarque. Les deux se mesurent, et rarement dans le même outil.',
        'L’import et l’export ajoutent des délais, des droits et des changes que le prix de vente doit absorber. Un coût de revient qui les ignore est faux.',
        'Ce que les clients achètent ensemble en dit plus que ce qu’ils achètent. Encore faut-il lire le ticket, pas seulement le total.',
      ],
      problems: [
        'Le stock du logiciel et le stock de la réserve ne sont pas les mêmes, et personne ne sait depuis quand.',
        'Les achats se décident à l’œil, parce que l’historique de ventes n’est pas exploitable.',
        'Le coût de revient s’arrête au prix fournisseur, sans le transport, les droits ni le change.',
        'Plusieurs points de vente, autant de bases de données, et aucune vue d’ensemble.',
      ],
      offer: [
        'Un inventaire qui tient, avec les écarts tracés et expliqués.',
        'Le coût de revient complet : achat, transport, droits, change.',
        'La consolidation de plusieurs points de vente dans une seule vue.',
        'Les flux d’import et d’export, du bon de commande à la réception.',
        'Un tableau de bord des ventes par produit, par heure et par magasin, et ce qui se vend ensemble.',
        'La collecte des avis clients, et leur lecture.',
      ],
      experience: [
        'Arnaud a travaillé sur des bases de caisse, de livraison et d’import export pour des commerces de détail.',
        'La mise en place des recettes, des coûts matière et des calculs de marge fait partie de son travail courant depuis des années.',
      ],
      proof: null,
      photo: null,
    },
    hotels: {
      title: 'Hôtellerie',
      lead: 'Un hôtel tourne sur cinq logiciels qui ne se parlent pas. Notre travail commence là : les faire parler, puis lire ce qu’ils disent.',
      understand: [
        'Le PMS, la caisse du restaurant, le spa, la réservation en ligne et la comptabilité tiennent chacun un bout de la vérité. Aucun ne la tient en entier.',
        'La donnée d’un hôtel est saisonnière et dépend de l’événement. Une moyenne annuelle n’apprend rien ; la tendance par semaine et par segment, si.',
        'Le ménage et la maintenance se suivent sur un cahier ou pas du tout, alors que ce sont les deux postes qui font la note.',
        'Un avis négatif coûte d’autant plus cher qu’il reste sans réponse.',
      ],
      problems: [
        'Il faut ouvrir quatre interfaces pour répondre à une question simple sur le mois dernier.',
        'Le PMS est ancien et son éditeur ne propose pas d’accès à la donnée, ou le facture plus cher que le PMS lui-même.',
        'Personne ne sait quelle chambre a été nettoyée, par qui, ni à quelle heure.',
        'Les avis arrivent sur plusieurs plateformes, et le délai de réponse n’est mesuré nulle part.',
      ],
      offer: [
        'Connecter les systèmes existants, et agréger leur donnée en un seul endroit.',
        'L’intégration aux PMS en place, y compris ceux qui n’ont pas d’API documentée.',
        'Un tableau de bord des tendances : occupation, segments, dépense par client, saisonnalité.',
        'Le suivi du ménage et de la maintenance, chambre par chambre, avec l’heure et la personne.',
        'Le suivi du temps des équipes.',
        'La collecte des avis clients, un badge NFC, et le suivi du délai de réponse.',
      ],
      experience: [
        'Arnaud a accompagné des hôtels sur la partie restauration, puis sur la connexion de leurs systèmes entre eux et la centralisation de leur donnée.',
        'La lecture des tendances et la collecte des avis clients font partie de ce travail depuis le début.',
        'PMS et systèmes hérités du marché : nous savons à quoi nous attendre en ouvrant le capot.',
      ],
      proof: null,
      photo: null,
    },
    manufacturing: {
      title: 'Production et manufacturing',
      lead: 'Une nomenclature fausse se voit six mois plus tard, dans la marge. Nous travaillons sur les nomenclatures, les recettes et le suivi de production.',
      understand: [
        'Une nomenclature n’est pas une liste de courses : c’est un arbre, avec des niveaux, des pertes et des rendements. Un tableur tient le premier niveau, rarement les suivants.',
        'La production se planifie sur ce qui est en stock, ce qui est commandé et ce qui est promis. Les trois doivent être dans le même outil.',
        'En cuisine comme en atelier, le processus compte autant que la recette : l’ordre, le temps, la température, qui fait quoi.',
        'Le coût de revient d’un produit fabriqué change à chaque livraison de matière première.',
      ],
      problems: [
        'Les nomenclatures existent, mais dans un tableur que personne n’ose modifier.',
        'La planification se fait de tête, et le manque se découvre au moment de produire.',
        'Les pertes et les rendements ne sont pas mesurés, donc le coût de revient est optimiste.',
        'L’atelier et le bureau ne voient pas le même état d’avancement.',
      ],
      offer: [
        'Les nomenclatures à plusieurs niveaux, avec les pertes et les rendements.',
        'Le MRP : ce qu’il faut acheter, quand, pour tenir le planning.',
        'L’inventaire des matières premières et des en-cours.',
        'Le suivi de production, de l’ordre de fabrication à la sortie.',
        'Le coût de revient recalculé à chaque mouvement de matière.',
        'Un tableau de bord des rendements, poste par poste.',
      ],
      experience: [
        'Arnaud a travaillé sur les processus de cuisine, les recettes et les nomenclatures pour une chaîne de boulangeries à Hong Kong.',
        'Les coûts matière et les calculs de marge sont pour lui un travail courant, pas une découverte.',
      ],
      proof: null,
      photo: null,
    },
    teams: {
      title: 'Gestion des équipes',
      lead: 'Savoir qui a commencé, où, et à quelle heure. C’est la demande qui revient le plus souvent, et celle que nous traitons aujourd’hui pour plusieurs clients.',
      understand: [
        'Le pointage sur site n’est pas le pointage de bureau. Un gardien prend son poste à un endroit précis, et c’est le lieu autant que l’heure qu’il faut enregistrer.',
        'Une équipe dispersée sur plusieurs sites ne se suit pas avec une pointeuse murale.',
        'Les heures saisies à la main sont contestées, par le salarié comme par le client facturé dessus.',
        'Le suivi des tâches vaut autant que le suivi des heures : savoir qu’une chambre a été nettoyée, et par qui.',
      ],
      problems: [
        'Les arrivées et les départs se notent sur un cahier, et se recopient en fin de mois.',
        'Impossible de prouver qu’un agent était bien sur place à l’heure annoncée.',
        'La facturation au client se prépare à partir de feuilles de présence, avec les écarts que cela suppose.',
        'Aucune alerte quand un poste n’est pas couvert.',
      ],
      offer: [
        'Le pointage d’arrivée et de départ, avec le lieu, pour des équipes réparties sur plusieurs sites.',
        'Le suivi du temps, consolidé par personne, par site et par période.',
        'Le suivi des tâches effectuées, au-delà des seules heures.',
        'La facturation construite sur les heures réellement pointées.',
        'Les alertes sur les postes non couverts.',
        'Un tableau de bord des présences et des écarts.',
      ],
      experience: [
        'Un système de pointage pour des équipes de terrain, gardiennage compris, tourne aujourd’hui pour nos clients.',
        'Le besoin nous est venu d’eux, pas d’un catalogue : plusieurs nous ont posé la même question au même moment.',
      ],
      proof: null,
      photo: null,
    },
    crm: {
      title: 'CRM',
      lead: 'Un CRM sert à savoir où en est chaque client. La plupart servent surtout à saisir des données que personne ne relit.',
      understand: [
        'Un CRM que l’équipe ne remplit pas ne vaut rien. Le remplissage doit coûter moins cher que ce qu’il rapporte à celui qui le fait.',
        'Les outils du marché couvrent quatre-vingts pour cent du besoin. Le reste est précisément ce qui fait votre métier.',
        'La donnée client est déjà dans la caisse, le site et la boîte mail. Elle n’a pas besoin d’être ressaisie, elle a besoin d’être rassemblée.',
        'Changer de CRM coûte plus cher que l’adapter, sauf quand ce n’est plus vrai. C’est une décision à prendre avec des chiffres.',
      ],
      problems: [
        'Le CRM est rempli à moitié, donc les rapports sont faux, donc plus personne ne le remplit.',
        'Les devis, les factures et les échanges vivent ailleurs que dans le CRM.',
        'L’outil impose un processus de vente qui n’est pas le vôtre.',
        'La licence coûte cher pour des fonctions que vous n’utilisez pas.',
      ],
      offer: [
        'Un CRM sur mesure, quand le besoin ne rentre pas dans un outil du marché.',
        'Ou l’adaptation de HubSpot, Microsoft Dynamics et Salesforce, quand il y rentre.',
        'La reprise de l’existant, sans perdre l’historique.',
        'La connexion au site, à la caisse et à la messagerie, pour que la saisie se fasse une fois.',
        'Les automatisations de relance et de suivi.',
        'Un tableau de bord du pipeline qui dit où les affaires s’arrêtent.',
      ],
      experience: [
        'Arnaud a passé trois ans dans une société de gestion de données et de flux automatisés, à faire circuler la donnée entre des outils qui n’étaient pas prévus pour.',
      ],
      proof: null,
      photo: null,
    },
    insurance: {
      title: 'Assurance et courtage',
      lead: null,
      understand: null,
      problems: null,
      offer: null,
      experience: null,
      proof: null,
      photo: null,
    },
    automation: {
      title: 'Automatisation',
      lead: 'Une automatisation ne remplace personne. Elle retire d’une journée les gestes qu’aucun de vous n’a choisi de faire.',
      understand: [
        'La double saisie n’est pas une perte de temps, c’est une perte de fiabilité. Deux chiffres saisis deux fois finissent par diverger, et c’est alors le mauvais qui sert de référence.',
        'Le bon flux est celui qui se déclenche sans qu’on y pense. Un flux qu’il faut lancer à la main est un formulaire de plus.',
        'La plupart des outils savent déjà parler. Ce qui manque n’est presque jamais l’API, c’est quelqu’un pour décider quoi dire à qui, et dans quel ordre.',
        'Un flux doit pouvoir échouer bruyamment. Une automatisation silencieuse qui s’arrête un mardi se découvre un vendredi, et le rattrapage coûte plus cher que le flux.',
        'Tout ne mérite pas d’être automatisé. Une tâche faite deux fois par an se fait à la main, et on l’assume.',
      ],
      problems: [
        'La même commande est saisie dans la caisse, dans le tableur de stock, puis dans la comptabilité.',
        'Les demandes du site arrivent par email et sont recopiées à la main dans le CRM.',
        'Personne ne sait dire combien de temps par semaine part en ressaisie, donc personne ne sait ce qu’une automatisation ferait gagner.',
        'Un outil du parc n’a pas d’API ouverte, et son éditeur facture l’accès plus cher que l’outil lui-même.',
        'Une automatisation existe, posée par un prestataire parti depuis, et plus personne ne sait ce qu’elle fait.',
      ],
      offer: [
        'Le relevé de ce qui se ressaisit, avant d’écrire la moindre ligne : c’est lui qui dit quels flux valent la peine.',
        'Les flux eux-mêmes, du déclencheur à l’action, avec leurs conditions.',
        'La connexion entre la caisse, le site, le stock, la comptabilité et la messagerie.',
        'Les démarches auprès d’un éditeur quand l’outil n’expose pas d’API, délais annoncés d’avance.',
        'Une alerte quand un flux échoue, et une supervision mensuelle qui vérifie qu’ils tournent tous.',
        'Le simulateur de la page Tarifs chiffre un flux avant même qu’on se parle.',
      ],
      experience: [
        'Arnaud a passé trois ans dans une société de gestion de données et de flux automatisés, à faire circuler la donnée entre des outils qui n’étaient pas prévus pour se parler.',
        'Chez un éditeur de caisses, puis chez un autre au Cambodge, nous avons vu de près ce que coûte une donnée saisie deux fois : ce n’est jamais la saisie, c’est l’écart qu’on découvre trois mois plus tard.',
      ],
      proof: null,
      photo: null,
    },
    ai: {
      title: 'Intelligence artificielle',
      lead: 'L’IA sait lire, trier et rédiger. Elle ne sait pas décider à votre place, et nous ne la vendons pas comme si elle le savait.',
      understand: [
        'L’IA est une étape dans un flux, pas un produit. Elle vaut ce que vaut ce qui l’entoure : ce qui la déclenche, ce qui vérifie sa sortie, ce qui se passe quand elle se trompe.',
        'Elle est bonne là où la règle est floue et l’enjeu faible : classer une demande, extraire un montant d’une facture, résumer un échange, proposer un brouillon de réponse.',
        'Elle est mauvaise là où le chiffre doit être juste. Un total, une marge et un stock se calculent, ils ne s’estiment pas.',
        'Toute sortie d’IA qui part vers un client passe devant un humain. Pas par principe moral, par calcul : une réponse fausse envoyée en votre nom coûte plus cher que les minutes gagnées.',
        'Le coût se compte par appel et il monte avec l’usage. Un flux d’IA mal borné se chiffre très bien le premier mois, beaucoup moins le sixième.',
      ],
      problems: [
        'On vous a proposé « de l’IA » sans vous dire sur quelle tâche précise, ni ce qui se passe quand elle se trompe.',
        'Vos documents fournisseurs arrivent en PDF et sont ressaisis à la main, un par un.',
        'Le tri des demandes entrantes prend une heure par jour à quelqu’un dont ce n’est pas le métier.',
        'Vous avez essayé un assistant générique, qui ne connaît ni vos produits, ni vos prix, ni vos règles.',
        'Vous ne savez pas ce que vos données deviennent une fois envoyées à un fournisseur d’IA.',
      ],
      offer: [
        'Une étape d’IA dans un flux existant, sur une tâche nommée, avec ce qu’elle coûte par mois.',
        'L’extraction de données depuis des documents : factures, bons de livraison, fiches fournisseurs.',
        'Le tri et l’aiguillage des demandes entrantes, avec une règle de repli quand la confiance est basse.',
        'Des brouillons de réponse, proposés à votre équipe, jamais envoyés sans relecture.',
        'Le choix du fournisseur et de l’endroit où vos données transitent, écrit noir sur blanc avant de commencer.',
        'Et le refus franc quand l’IA n’est pas la bonne réponse : souvent, une règle simple fait mieux, pour moins cher.',
      ],
      experience: null,
      proof: null,
      photo: null,
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
        logo: '/clients/anakut.png',
        logoBg: '#100e0d',
        result: 'De 5 à 15 clients réguliers, sans un franc de publicité.',
        shot: '/work/anakut/tableau-de-bord.webp',
        video: null,
        gallery: [
          { src: '/work/anakut/tableau-de-bord.webp', caption: 'Le tableau de bord du coach : ses clients, ses séances, et le lien d’inscription qu’il partage.' },
          { src: '/work/anakut/seances.webp', caption: 'Les séances, avec le pack restant, le statut, la performance notée et le règlement.' },
          { src: '/work/anakut/progression.webp', caption: 'Le suivi physique, client par client, avec l’évolution entre deux mesures.' },
          { src: '/work/anakut/packs.webp', caption: 'Les formules, du cours découverte au pack de dix, que le coach gère lui-même.' },
          { src: '/work/anakut/fidelite.webp', caption: 'Les niveaux de fidélité et leurs avantages, configurés par le coach.' },
        ],
        context:
          'Anakut est un coach sportif indépendant à Neuchâtel. Avant, chaque nouveau client remplissait une fiche papier, et le suivi vivait dans des tableurs et des feuilles volantes qui finissaient par se perdre. Le coach tenait la progression de ses clients de mémoire : avec cinq clients réguliers, cela tenait déjà difficilement.',
        need:
          'Un endroit unique où le client réserve sa séance et suit sa progression, et où le coach voit son planning, ses notes de séance et ce que chacun lui doit. Sans intégration de paiement : le règlement reste en direct, c’est le suivi qui manquait, pas la caisse.',
        built: [
          'Un site WordPress, avec un lien vers l’espace client.',
          'Un espace client où chacun réserve sa séance avec le coach.',
          'Le calendrier du coach, connecté à son Google Agenda : une séance réservée apparaît dans l’agenda qu’il consulte déjà.',
          'L’organisation des coachings, les notes de séance, et le suivi de performance client par client.',
          'Le suivi de ce que chaque client doit, sans module de paiement.',
        ],
        results: [
          {
            value: '5',
            unit: ' à 15',
            caption: 'clients réguliers, avant et aujourd’hui',
          },
          {
            prefix: '+',
            value: '30',
            unit: ' %',
            caption: 'de renouvellement de cours par nouveau client',
          },
          {
            value: '6',
            unit: ' mois',
            caption: 'de développement',
          },
          {
            value: '20',
            unit: ' à 25 000 $',
            caption: 'la tranche du projet, hors taxes',
          },
        ],
        quote: {
          text: 'Grâce à cet outil, je vois les performances, et surtout je sais où mettre l’effort. Avant, je devais me souvenir de tout. Aujourd’hui je sais qu’un client a commencé à trois pompes, qu’il en faisait quinze deux mois plus tard et dix-sept la semaine dernière. Lui voit sa progression, et moi je vois ce qui compte pour lui.',
          author: 'Sarin Preap, fondateur, Anakut',
        },
      },
      {
        slug: 'mp-massage',
        name: 'MP Massage',
        sector: 'Bien-être',
        country: 'Suisse',
        city: 'Neuchâtel',
        coords: { lat: 46.99, lon: 6.93 },
        summary: 'Application de réservation et de suivi, espaces entreprises, et site.',
        site: 'mpmassage.ch',
        logo: '/clients/mp-massage.png',
        logoBg: null,
        result: 'Rétention en hausse de 42 %, et plus aucun rendez-vous manqué.',
        shot: null,
        video: null,
        gallery: null,
        context:
          'MP Massage est un cabinet de massage à Neuchâtel. La réservation passait par des outils du marché comme OneDoc, et elle fonctionnait : ce n’était pas le problème. Le problème était tout ce qu’il y avait autour. La plupart des clients prenaient la prestation classique et rien d’autre, le suivi se faisait à la main, et rien ne reliait une séance à la suivante.',
        need:
          'Savoir, avant que le client n’arrive, ce dont il souffre et ce qui a été fait la dernière fois. Et ouvrir la porte aux entreprises, qui demandaient à réserver pour leurs équipes sans avoir à appeler.',
        built: [
          'Une application de réservation, où le client prend son rendez-vous et retrouve son suivi.',
          'Le suivi des douleurs et des séances, consultable avant la séance suivante.',
          'Des espaces entreprise : chaque société réserve pour ses équipes, avec un compte par collaborateur et ce à quoi il a droit.',
          'Le site, en Next.js, et l’application en Vue.js sur une interface Laravel, avec MariaDB.',
        ],
        results: [
          {
            prefix: '+',
            value: '42',
            unit: ' %',
            caption: 'de rétention',
          },
          {
            prefix: '+',
            value: '25',
            unit: ' %',
            caption: 'de chiffre d’affaires',
          },
          {
            value: '2',
            unit: ' à 0',
            caption: 'rendez-vous manqués par mois, avant et depuis trois mois',
          },
          {
            value: '8',
            unit: ' mois',
            caption: 'de développement, étalés pour tenir le budget',
          },
        ],
        quote: {
          text: 'J’ai été subjuguée par l’efficacité de cette application. Je n’y croyais pas au début : on était déjà venu me vendre des outils similaires plusieurs fois, et je n’y avais jamais vraiment cru. Je me suis laissé tenter par Kuiper Studio, surtout pour leur souplesse sur le budget. Je n’avais pas un gros budget, et ils m’ont simplement dit qu’ils pouvaient allonger le temps de développement en le réduisant, en livrant au fur et à mesure. Économiser 30 à 35 % contre deux mois de délai, c’était tout bénéfice. On s’est mis d’accord là-dessus, on a développé, on a suivi, et c’est exactement ce qu’il me fallait.',
          author: 'Mydai Pongsanith, fondatrice, MP Massage',
        },
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
        logo: null,
        logoBg: null,
        result: null,
        shot: null,
        video: null,
        gallery: null,
        context:
          'OCS fait le nettoyage d’un aéroport. Ses responsables savaient qu’un agent était venu, mais pas s’il était réellement passé dans telle zone, ni à quelle heure. Sur un site aéroportuaire, cette question-là n’est pas une question de confort.',
        need:
          'Prouver le passage, zone par zone, et à l’heure près. Pas seulement la présence sur le site : le passage à l’endroit précis qui devait être nettoyé.',
        built: [
          'Une étiquette NFC par zone, qu’un agent approche de son téléphone en arrivant.',
          'Une application mobile pour les agents, qui enregistre le passage, la zone et l’heure.',
          'Une interface de supervision, qui montre ce qui a été fait, où, et par qui.',
        ],
        results: null,
        quote: null,
      },
      {
        slug: 'wave',
        name: 'Wave Network',
        sector: 'Assurance et courtage',
        country: 'Suisse',
        city: null,
        coords: null,
        summary:
          'Le Wave Pass : l’application des membres, celle des commerçants partenaires, et leur back-office.',
        site: 'wavenetwork.ch',
        logo: '/clients/wave-network.svg',
        logoBg: null,
        result: 'Une application chiffrée 200 000 dollars ailleurs, livrée pour 25 000.',
        shot: null,
        video: null,
        gallery: null,
        context:
          'Wave Network est un conseiller financier suisse. Son abonnement, le Wave Pass, donne accès à une carte de paiement, à des conseillers certifiés, à des services fiscaux et à un réseau de commerçants partenaires dans toute la Suisse. Côté membres, cet accès passait par une carte physique. Il fallait une application. Le projet avait été chiffré ailleurs, et le devis reçu était de 200 000 dollars : un montant qui ferme le sujet.',
        need:
          'Obtenir la même chose pour ce qu’ils pouvaient réellement y mettre. Cela a voulu dire reprendre le périmètre point par point, séparer ce dont l’application avait besoin pour exister de ce qui pouvait venir plus tard, et construire la première version sur ce tri.',
        built: [
          'L’application mobile des membres : chez un partenaire, le membre fait scanner son code, et voit ce que son abonnement lui a fait économiser.',
          'L’application mobile des commerçants partenaires, qui enregistre le passage côté comptoir.',
          'Le back-office web qui pilote les deux, côté Wave Network.',
          'Un périmètre taillé pour un premier lancement, le reste en attente plutôt qu’en option payée d’avance.',
        ],
        results: [
          {
            value: '200',
            unit: ' 000 $',
            caption: 'le devis reçu ailleurs pour ce projet',
          },
          {
            value: '25',
            unit: ' 000 $',
            caption: 'ce que Kuiper Studio a facturé pour le livrer',
          },
          {
            value: '4,5',
            unit: ' mois',
            caption: 'de développement, livré dans les délais',
          },
        ],
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
      {
        company: 'Anakut',
        author: 'Sarin Preap',
        role: 'Fondateur',
        text: 'Grâce à cet outil, je vois les performances, et surtout je sais où mettre l’effort. Avant, je devais me souvenir de tout.',
        photo: '/people/sarin-preap.webp',
      },
      {
        company: 'MP Massage',
        author: 'Mydai Pongsanith',
        role: 'Fondatrice',
        text: 'Je n’y croyais pas au début : on était déjà venu me vendre des outils similaires plusieurs fois. Ce qui m’a décidée, c’est leur souplesse sur le budget.',
        photo: '/people/mydai-pongsanith.webp',
      },
      // Le troisieme attend le temoignage de Wave Network, qui n'a pas encore
      // ete donne. Deux vrais valent mieux que trois dont un invente.
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
    profiles: {
      title: 'Une équipe dédiée',
      note: 'Les profils sont les mêmes quelle que soit la technologie. C’est le niveau qui change le prix, pas le langage.',
      start: 'Le plus petit attelage qui tient une livraison. Le développeur est de niveau intermédiaire à confirmé.',
      rows: {
        junior: {
          name: 'Un profil junior, en plus',
          detail: 'Encadré par un profil plus expérimenté de l’équipe.',
        },
        mid: {
          name: 'Un profil intermédiaire, en plus',
          detail: 'Autonome sur une fonctionnalité du début à la fin.',
        },
        senior: {
          name: 'Un profil confirmé, en plus',
          detail: 'Tient une partie du produit, et relit le travail des autres.',
        },
        architect: {
          name: 'Un profil architecte, en plus',
          detail: 'Décide comment le système est construit, et pourquoi.',
        },
        cto: {
          name: 'Un niveau direction technique',
          detail: 'Sur demande seulement. Cela se discute, cela ne se tarife pas.',
        },
      },
      terms: {
        title: 'Ce que cela engage',
        items: [
          'Un profil dédié est détaché pour trois mois au minimum. En dessous, nous ne détachons personne : quelqu’un qui change de projet tous les mois ne connaît aucun des projets qu’il touche. Un chantier plus court reste possible, mais sans profil dédié.',
          'À partir de trois profils, un UI/UX est compris, à notre charge. Un mid et deux juniors, par exemple : le design est assuré, vous ne le payez pas.',
          'Vous composez l’équipe comme vous voulez. Nous proposons un assemblage, vous tranchez.',
          'Nous recrutons. Une semaine après la signature et le premier règlement, les profils sont en poste.',
        ],
      },
      billing: {
        title: 'À l’heure, ou au résultat',
        lead: 'Deux façons d’acheter, et elles ne s’achètent pas pour les mêmes raisons. C’est le point le plus important de cette page.',
        hourly: {
          name: 'À l’heure',
          body: [
            'Chaque heure est relevée, notée et justifiée à chaque étape. Vous savez à tout moment où nous en sommes et sur quoi est passé le temps.',
            'Le travail se concentre sur la période demandée, donc la livraison est plus rapide.',
            'C’est le choix quand la date est serrée et qu’elle ne peut pas bouger.',
            'Les prix de cette page sont ceux d’un engagement au mois : à l’heure, comptez cinquante pour cent de plus.',
          ],
        },
        fixed: {
          name: 'Au résultat',
          body: [
            'Nous regardons le projet, nous répartissons la charge sur notre planning, et nous vous donnons une date.',
            'Si nous sommes en retard, le dépassement est à notre charge, pas à la vôtre.',
            'C’est plus lent, et nous le disons : la charge est répartie, un développeur peut n’y passer qu’une partie de sa journée. Trois mois en continu peuvent devenir quatre et demi.',
            'C’est le choix quand le budget est compté et que la date a de la marge.',
          ],
        },
      },
    },
    care: {
      title: 'Après la livraison',
      note: 'Quatre forfaits, au mois, du plus simple au plus engageant. Aucun n’est obligatoire.',
      rows: {
        basic: {
          name: 'Maintenance',
          detail: 'Nous surveillons, nous mettons à jour, nous nous assurons que cela tourne.',
        },
        changes: {
          name: 'Maintenance et petites modifications',
          detail: 'La maintenance, plus les changements de champ, de texte et de réglage. Un appel d’une heure par mois.',
        },
        retained: {
          name: 'Équipe en réserve',
          detail: 'Quatre jours de développement par mois, soit un jour par semaine : exports, imports, un bouton, une petite fonctionnalité. Un appel et un rapport.',
        },
        night: {
          name: 'Support de nuit',
          detail: 'Un support joignable pendant vos heures à vous, pas les nôtres. Réservé aux projets sur mesure et aux CRM ou ERP.',
        },
      },
    },
    transfer: 'Transfert du site vers un autre hébergeur',
    conditions: [
      'Paiement : 50 % à la commande, 50 % à la livraison.',
      'Les contenus, textes, photos et logos, sont fournis par le client.',
      'Les flux d’automatisation sont hébergés sur l’infrastructure n8n de Kuiper Studio et ne sont pas transférables.',
    ],
    question: 'Que voulez-vous construire ?',
    estimate: 'Votre estimation',
    grid: 'Le détail des prix',
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
    triggerQuestion: 'Qu’est-ce qui déclenche ce flux ?',
    apiYes: 'Oui',
    apiNo: 'Non',
    apiUnknown: 'Je ne sais pas',
    apiWarning: 'Sans API ouverte, il faut obtenir un accès auprès de l’éditeur : cela prend souvent plusieurs semaines de démarches.',
    apiKnown: 'API publique : rien à négocier avec l’éditeur.',
    setup: 'Mise en place',
    monthly: 'Supervision, par mois',
    time: 'Délai estimé',
    timeValue: 'À confirmer après un échange',
    empty: 'Commencez par ajouter un déclencheur.',
    steps: 'Les étapes de votre flux',
    triggers: {
      form: 'Un formulaire',
      email: 'Un email',
      schedule: 'Un horaire',
      webhook: 'Un autre outil',
      manual: 'Un clic',
    },
    tools: {
      excel: 'Excel',
      google: 'Google Workspace',
      teams: 'Teams',
      slack: 'Slack',
      whatsapp: 'WhatsApp',
      telegram: 'Telegram',
      hubspot: 'HubSpot',
      mailchimp: 'Mailchimp',
      odoo: 'Odoo',
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
        bio: 'Autodidacte. Entré dans la tech par un éditeur de caisses, recruté deux ans plus tard par un autre au Cambodge, où il devient chef de produit très tôt : assez tôt pour faire ses erreurs quand elles coûtaient encore peu. Deux ans et demi là-bas, puis trois ans dans une société de gestion de données et de flux automatisés. Il monte Kuiper Studio pour répondre à ce qui l’agaçait depuis des années : les petits projets, personne ne voulait les regarder. Sa conviction tient en une phrase, et elle est sur ce site : votre budget n’est pas une honte.',
        photo: null,
      },
      {
        name: 'Louis Vezia',
        role: 'Cofondateur, direction technique',
        bio: 'Ingénieur, diplômé d’un master en France. Une dizaine d’années dans la tech, dont sept au Cambodge, où il vit depuis 2019. Il a travaillé dans un éditeur de caisses, où il a passé deux ans à développer des programmes de fidélité pour des restaurants à Hong Kong, puis dans une société de systèmes de purification de l’air, et sur des développements sur mesure pour des clients. C’est lui qui décide comment les choses sont construites.',
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
          { label: 'Notre stack', href: 'stack' },
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
    body: 'Kuiper Studio est un studio de deux personnes, basé à Phnom Penh. Nous avons passé les dix dernières années dans les outils que les entreprises utilisent tous les jours : des caisses, des inventaires, des CRM, des flux de données. Nous les avons construits, repris, cassés et réparés, pour des restaurants, des hôtels, des commerces et des ateliers. Nous avons monté le studio pour une raison précise : trop de projets utiles se font refuser parce que leur budget est jugé trop petit. Nous préférons regarder, bousculer l’idée, et dire ce qui tient dans le budget annoncé.',
  },
  legal: {
    title: 'Mentions légales',
    intro:
      'Les informations ci-dessous concernent l’éditeur de ce site. L’enregistrement de la société est en cours : les mentions qui en dépendent sont signalées et seront complétées dès qu’il sera délivré.',
    updated: '14 octobre 2026',
    sections: [
      {
        heading: 'L’éditeur du site',
        facts: [
          { label: 'Dénomination', value: 'Kuiper Studio' },
          { label: 'Forme juridique', value: null },
          { label: 'Numéro d’enregistrement', value: null },
          { label: 'Siège', value: 'Phnom Penh, Cambodge' },
          { label: 'Adresse complète', value: null },
          { label: 'Directeur de la publication', value: 'Arnaud Sebire' },
          { label: 'Contact', value: 'arnaud@kuiperstudio.com' },
        ],
      },
      {
        heading: 'L’hébergeur',
        body: [
          'Le site est hébergé par Hostinger, sur un serveur situé à Singapour.',
        ],
        facts: [
          { label: 'Hébergeur', value: 'Hostinger' },
          { label: 'Localisation du serveur', value: 'Singapour' },
          { label: 'Coordonnées légales de l’hébergeur', value: null },
        ],
      },
      {
        heading: 'La propriété intellectuelle',
        body: [
          'Les textes, les images et le code de ce site appartiennent à Kuiper Studio, sauf mention contraire sur la page concernée.',
          'Les noms et les marques des sociétés citées appartiennent à leurs propriétaires respectifs. Leur mention ne vaut ni partenariat ni recommandation de leur part.',
          'Les réalisations présentées le sont avec l’accord écrit des clients concernés. Une réalisation sans cet accord n’apparaît pas sur ce site.',
        ],
      },
      {
        heading: 'Les prix affichés',
        body: [
          'Les prix indiqués sur ce site sont hors taxes.',
          'Ils sont affichés en euros pour les visiteurs situés en Europe et en dollars américains pour les autres. Le montant en dollars est calculé à partir du montant en euros, à un taux commercial fixe qui n’est pas le taux du marché.',
          'Un prix affiché est une indication de tarif courant, pas une offre ferme. Le prix définitif d’un projet est celui du devis signé.',
        ],
      },
      {
        heading: 'Les simulateurs',
        body: [
          'Le configurateur de site et le simulateur d’automatisation donnent une estimation calculée à partir de la grille de prix publiée. Cette estimation n’engage pas Kuiper Studio : elle sert à donner un ordre de grandeur avant un échange.',
        ],
      },
      {
        heading: 'Le droit applicable',
        body: [
          'Ce site est édité depuis le Cambodge et relève du droit cambodgien.',
        ],
        facts: [{ label: 'Juridiction compétente', value: null }],
      },
    ],
  },

  privacy: {
    title: 'Confidentialité',
    intro:
      'Ce qui est collecté sur ce site, pourquoi, où cela va, et comment le faire supprimer. Aucun traceur n’est déposé avant votre accord.',
    updated: '14 octobre 2026',
    sections: [
      {
        heading: 'Ce que nous collectons',
        body: [
          'Uniquement ce que vous nous envoyez vous-même, par le formulaire de contact, par le configurateur de site ou par le simulateur d’automatisation.',
        ],
        facts: [
          { label: 'Formulaire de contact', value: 'Nom, adresse email, message, et les champs que vous remplissez.' },
          { label: 'Configurateur de site', value: 'Adresse email, et le détail de l’estimation que vous avez construite.' },
          { label: 'Simulateur d’automatisation', value: 'Adresse email, et le détail du flux que vous avez construit.' },
          { label: 'Navigation', value: 'Rien, tant que vous n’avez pas accepté la mesure d’audience.' },
        ],
      },
      {
        heading: 'Pourquoi',
        body: [
          'Pour répondre à votre demande, et pour cela seulement. Nous ne vendons aucune donnée, et nous n’envoyons pas de lettre d’information.',
          'Vous consentez à être recontacté au sujet de votre demande en cochant la case du formulaire. Sans cette case cochée, le formulaire n’est pas envoyé.',
        ],
      },
      {
        heading: 'Où cela va',
        body: [
          'Les demandes sont transmises à HubSpot, l’outil de gestion de la relation client utilisé par Kuiper Studio. Elles y sont conservées et consultées par les deux fondateurs.',
          'Aucune autre société ne reçoit ces données.',
        ],
        facts: [
          { label: 'Destinataire', value: 'HubSpot' },
          { label: 'Localisation des données HubSpot', value: null },
          { label: 'Durée de conservation', value: null },
        ],
      },
      {
        heading: 'Les cookies',
        body: [
          'Le site fonctionne sans cookie. Un seul élément est enregistré dans votre navigateur sans votre accord : votre choix de devise et votre réponse au bandeau de cookies, pour ne pas vous reposer la question à chaque page. Il ne sert à rien d’autre et ne quitte pas votre navigateur.',
          'La mesure d’audience n’est activée que si vous l’acceptez. Tant que vous n’avez pas répondu, ou si vous refusez, aucun traceur n’est déposé et aucune visite n’est mesurée.',
          'Vous pouvez revenir sur votre choix à tout moment depuis le bandeau, ou en effaçant les données du site dans votre navigateur.',
        ],
      },
      {
        heading: 'Vos droits',
        body: [
          'Vous pouvez demander à consulter les données que nous avons sur vous, à les faire corriger, ou à les faire supprimer. Écrivez à arnaud@kuiperstudio.com : nous répondons sous deux jours ouvrés.',
          'Une suppression est définitive. Nous ne gardons pas de copie pour « au cas où ».',
        ],
      },
      {
        heading: 'Les services tiers',
        body: [
          'Les polices de caractères sont servies depuis ce site, et non depuis un service extérieur : aucune requête n’est envoyée à un tiers lors de l’affichage d’une page.',
          'Le site ne contient ni bouton de partage, ni pixel de réseau social, ni vidéo intégrée depuis une plateforme tierce.',
        ],
      },
    ],
  },
}
