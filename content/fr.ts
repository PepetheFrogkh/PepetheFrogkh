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
      proof: null,
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
      proof: null,
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
      proof: ['ocs'],
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
