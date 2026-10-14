import type { Dict } from './types'

/**
 * Le site en anglais.
 *
 * Meme forme qu'en francais, mot pour mot : un bloc ne peut pas manquer d'un
 * cote et exister de l'autre. Aucun chiffre, logo, temoignage ni nom de client
 * invente.
 */
export const en: Dict = {
  langName: 'English',

  meta: {
    siteName: 'Kuiper Studio',
    home: {
      title: 'Kuiper Studio · We build the tools that keep your company running',
      description:
        'Websites, automations, business apps: delivered fast, at listed prices, by a team that knows your trade.',
    },
    services: {
      title: 'Services · Kuiper Studio',
      description: 'Websites, automations, custom projects, business apps, guest feedback.',
    },
    expertises: {
      title: 'Expertise · Kuiper Studio',
      description: 'The fields the team knows best, and the offers that fit each one.',
    },
    pricing: {
      title: 'Pricing · Kuiper Studio',
      description: 'Listed prices, and the automation simulator.',
    },
    blog: {
      title: 'Blog · Kuiper Studio',
      description: 'What we learn building tools for other people’s work.',
    },
    work: {
      title: 'Work · Kuiper Studio',
      description: 'What we have built, and for whom.',
    },
    about: {
      title: 'About · Kuiper Studio',
      description: 'Two founders, one point of contact. Kuiper Studio is based in Phnom Penh.',
    },
    contact: {
      title: 'Contact · Kuiper Studio',
      description: 'Let’s talk about your project.',
    },
    legal: {
      title: 'Legal notice · Kuiper Studio',
      description: 'Legal notice for Kuiper Studio.',
    },
    privacy: {
      title: 'Privacy · Kuiper Studio',
      description: 'How Kuiper Studio handles your data.',
    },
  },

  map: {
    services: {
      title: 'Services',
      children: {
        sites: 'Websites',
        automations: 'Automations',
        custom: 'Custom projects',
        apps: 'Business apps',
        feedback: 'Guest feedback',
      },
    },
    expertises: {
      title: 'Expertise',
      children: {
        restaurants: 'Restaurants',
        hotels: 'Hotels',
        manufacturing: 'Manufacturing',
        teams: 'Team management',
        crm: 'CRM',
        insurance: 'Insurance and brokerage',
      },
    },
    pricing: 'Pricing',
    blog: 'Blog',
    contact: 'Contact',
  },

  menu: {
    services: {
      sites: 'Packs at listed prices, from a single page to a full site.',
      automations: 'Your tools talk to each other, and repetitive tasks disappear.',
      custom: 'You have an idea, we build it, billed monthly.',
      apps: 'Point of sale, inventory, MRP, CRM: your tools, no vendor lock-in.',
      feedback: 'Every review of your venue in one place.',
    },
    expertises: {
      restaurants: 'Reviews, an NFC badge at payment, inventory.',
      hotels: 'Team hours, guest feedback, integration with your PMS.',
      manufacturing: 'Inventory, MRP, bills of materials, production tracking.',
      teams: 'Clock in and out, time tracking, invoicing.',
      crm: 'A custom CRM, or we adapt the one you have.',
      insurance: 'The tools brokers use every day.',
    },
  },

  nav: {
    items: [
      { label: 'Services', href: 'services' },
      { label: 'Expertise', href: 'expertises' },
      { label: 'Work', href: 'work' },
      { label: 'Pricing', href: 'pricing' },
      { label: 'Blog', href: 'blog' },
      { label: 'About', href: 'about' },
      { label: 'Contact', href: 'contact' },
    ],
    cta: 'Estimate my project',
    ctaShort: 'Estimate',
    currency: 'Currency',
    skip: 'Skip to content',
    menu: 'Open menu',
    close: 'Close menu',
  },

  hero: {
    eyebrow: 'A web agency, for any company',
    title: 'We build the tools that keep your company *running*.',
    titleLines: ['We build the tools', 'that keep your', 'company *running*.'],
    sub: 'Websites, automations, business apps: delivered fast, at listed prices, by a team that knows your trade.',
    primary: { label: 'Estimate my project', href: 'pricing' },
    secondary: { label: 'See our expertise', href: 'expertises' },
    note: 'Listed prices, excluding tax. A two-minute estimate.',
  },

  home: {
    services: {
      title: 'What we do',
      lead: 'Five services, each with a listed price.',
    },
    expertises: {
      title: 'The trades we know',
      lead: 'The fields the team knows best, and the offers that fit each one.',
    },
    work: {
      title: 'Our work',
      lead: 'What we have built, and where from.',
    },
    pricing: {
      title: 'Prices are listed',
      lead: 'No quote needed to find out what a website costs. For an automation, the simulator gives you an estimate in two minutes.',
      cta: { label: 'Open the simulator', href: 'pricing' },
    },
    blog: {
      title: 'What we learn',
      lead: 'Notes from the workshop, not press releases.',
    },
    testimonials: {
      title: 'What they say',
      lead: 'Published only with the client’s written consent.',
    },
  },

  services: {
    sites: {
      title: 'Websites',
      lead: 'Packs at listed prices, from a single page to a full site, with options and lead times in plain sight.',
      problem: null,
      delivers: [
        'An Essentiel pack, one to three pages, simple animations and a free contact form.',
        'A Pro pack up to six pages, advanced animations, two options included.',
        'A Complet pack up to ten pages, parallax, one extra language, three options included.',
        'Custom work for a web app, a client area or integrations.',
      ],
      delays:
        'Economy, delivered within the month, at the base price. Standard, seven days. Express, 72 hours, for the Essentiel pack only.',
      proof: 'anakut',
      faq: [
        {
          question: 'Who provides the content?',
          answer: 'You do. Copy, photos and logos come from you; we lay them out.',
        },
        {
          question: 'How does payment work?',
          answer: '50% on order, 50% on delivery.',
        },
        {
          question: 'What if I want to move elsewhere?',
          answer:
            'Moving the site to another host is possible, at a price listed in the grid.',
        },
      ],
    },
    automations: {
      title: 'Automations',
      lead: 'Your tools talk to each other, and repetitive tasks disappear. A simple flow has a listed price; the simulator prices the rest.',
      problem: null,
      delivers: [
        'A flow starts from a trigger, a form, an email or a schedule, and ends in an action: invoicing, follow-up, inventory, a report.',
        'Every added condition and every connected app has its own price.',
        'A tool without an open API needs access from its vendor, and that costs.',
        'Monthly supervision, based on how many flows you run.',
      ],
      delays: null,
      proof: null,
      faq: [
        {
          question: 'Where do the flows run?',
          answer:
            'On Kuiper Studio’s own n8n infrastructure. They cannot be moved to yours.',
        },
        {
          question: 'Why does a tool without an open API cost more?',
          answer:
            'Without an open API, access has to be obtained from the vendor: that often takes several weeks of paperwork.',
        },
      ],
    },
    custom: {
      title: 'Custom projects',
      lead: 'You have an idea, we build it.',
      problem: null,
      delivers: [
        'One developer and one project manager, billed monthly.',
        'You keep control of the priorities, month after month.',
      ],
      delays: null,
      proof: null,
      faq: null,
    },
    apps: {
      title: 'Business apps',
      lead: 'Point of sale, inventory, MRP, CRM: for companies that want full control without depending on a vendor.',
      problem: null,
      delivers: [
        'A base app, point of sale, inventory, MRP or CRM, as a one-off payment.',
        'A full ERP, only above a certain scope, and on quote.',
      ],
      delays: null,
      proof: null,
      faq: null,
    },
    feedback: {
      title: 'Guest feedback',
      lead: 'One page that gathers every review of your venue and brings out what works and what blocks.',
      problem: null,
      delivers: [
        'Google reviews, with your authorisation.',
        'Your venue’s own questionnaires.',
        'TripAdvisor, in part.',
      ],
      delays: null,
      proof: null,
      faq: [
        {
          question: 'Is Booking included?',
          answer: 'No. Booking is not included.',
        },
      ],
    },
  },

  serviceLabels: {
    problem: 'The problem',
    delivers: 'What we deliver',
    delays: 'Lead times',
    price: 'The price',
    proof: 'A project',
    faq: 'Frequently asked',
  },

  expertises: {
    restaurants: {
      title: 'Restaurants',
      lead: null,
      understand: null,
      problems: null,
      offer: [
        'Your reviews in one place, and support to improve service.',
        'An NFC badge at payment that opens the review page. Offered to every guest, never only to the happy ones.',
        'Inventory.',
      ],
      experience: [
        'Point of sale, fixed and mobile.',
        'Self-order kiosks.',
        'QR code menus.',
      ],
      proof: null,
    },
    hotels: {
      title: 'Hotels',
      lead: null,
      understand: null,
      problems: null,
      offer: [
        'Tracking team hours.',
        'Guest feedback.',
        'An NFC badge.',
        'Integration with existing PMS.',
      ],
      experience: ['PMS and legacy systems on the market.'],
      proof: null,
    },
    manufacturing: {
      title: 'Manufacturing',
      lead: null,
      understand: null,
      problems: null,
      offer: ['Inventory.', 'MRP.', 'Bills of materials.', 'Production tracking.'],
      experience: null,
      proof: null,
    },
    teams: {
      title: 'Team management',
      lead: null,
      understand: null,
      problems: null,
      offer: ['Clock in and clock out.', 'Time tracking.', 'Invoicing.'],
      experience: null,
      proof: ['ocs'],
    },
    crm: {
      title: 'CRM',
      lead: null,
      understand: null,
      problems: null,
      offer: [
        'A custom CRM.',
        'Or adapting HubSpot, Microsoft Dynamics and Salesforce.',
      ],
      experience: null,
      proof: null,
    },
    insurance: {
      title: 'Insurance and brokerage',
      lead: null,
      understand: null,
      problems: null,
      offer: null,
      experience: null,
      proof: ['wave'],
    },
  },

  expertiseLabels: {
    understand: 'What we understand about the trade',
    problems: 'Typical problems',
    offer: 'What we offer',
    experience: 'Our experience',
    proof: 'Related work',
  },

  work: {
    title: 'Work',
    intro: 'What we have built, and for whom.',
    more: 'Read more',
    resultLabel: 'Result',
    otherProjects: 'Other projects',
    sectorLabel: 'Sector',
    studio: 'Our studio',
    cases: [
      {
        slug: 'anakut',
        name: 'Anakut',
        sector: 'Coaching',
        country: 'Switzerland',
        city: 'Neuchâtel',
        coords: { lat: 46.99, lon: 6.93 },
        summary: 'A custom coaching management app, and a WordPress site.',
        site: 'anakut.ch',
        result: null,
        shot: null,
        video: null,
        context: null,
        need: null,
        built: ['A coaching management app', 'A WordPress site'],
        results: null,
        quote: null,
      },
      {
        slug: 'mp-massage',
        name: 'MP Massage',
        sector: 'Wellbeing',
        country: 'Switzerland',
        city: 'Neuchâtel',
        coords: { lat: 46.99, lon: 6.93 },
        summary: 'A massage management app, and a site.',
        site: 'mpmassage.ch',
        result: null,
        shot: null,
        video: null,
        context: null,
        need: null,
        built: ['A massage management app', 'A site'],
        results: null,
        quote: null,
      },
      {
        slug: 'ocs',
        name: 'OCS',
        sector: 'Team management',
        country: 'Cambodia',
        city: null,
        coords: null,
        summary: 'Tracking cleaning teams at an airport, with clock-in and invoicing.',
        site: null,
        result: null,
        shot: null,
        video: null,
        context: null,
        need: null,
        built: ['Team clock-in', 'Invoicing'],
        results: null,
        quote: null,
      },
      {
        slug: 'wave',
        name: 'Wave',
        sector: 'Insurance and brokerage',
        country: 'Switzerland',
        city: null,
        coords: null,
        summary: 'A mobile loyalty app, and the tool that runs it.',
        site: null,
        result: null,
        shot: null,
        video: null,
        context: null,
        need: null,
        built: ['A mobile loyalty app', 'Its management tool'],
        results: null,
        quote: null,
      },
    ],
  },

  caseLabels: {
    context: 'The context',
    need: 'The need',
    built: 'What we built',
    results: 'Results',
    quote: 'In their words',
  },

  testimonials: {
    title: 'What they say',
    note: 'Published only with the client’s written consent.',
    items: [
      { company: null, author: null, role: null, text: null, photo: null },
      { company: null, author: null, role: null, text: null, photo: null },
      { company: null, author: null, role: null, text: null, photo: null },
    ],
  },

  pricing: {
    title: 'Pricing',
    lead: 'Prices are listed, excluding tax, in your currency.',
    disclaimer: 'An indicative estimate, confirmed in writing after a conversation.',
  },

  blog: {
    title: 'Blog',
    lead: 'What we learn building tools for other people’s work.',
    readingTime: 'min read',
    share: 'Share',
    empty: 'No articles yet.',
  },

  contact: {
    title: 'Let’s talk about your project',
    body: 'Tell us what you want to build. We answer within two working days.',
    form: {
      company: 'Your company',
      city: 'City',
      need: 'What you need',
      needs: [
        'A website',
        'An automation',
        'A custom project',
        'A business app',
        'Guest feedback',
        'Not sure yet',
      ],
      name: 'Your name',
      email: 'Your email',
      message: 'Your message',
      consent: 'I agree to be contacted about my enquiry.',
      submit: 'Send',
      sending: 'Sending…',
      success: 'Message received. We will get back to you within two working days.',
      error: 'Sending failed. Try again, or write to us directly.',
      required: 'This field is required.',
      invalidEmail: 'That email address does not look valid.',
    },
  },

  founders: {
    title: 'The founders',
    people: [
      {
        name: 'Arnaud Sebire',
        role: 'Co-founder, product and client relations',
        bio: null,
        photo: null,
      },
      {
        name: 'Louis Vezia',
        role: 'Co-founder, technical lead',
        bio: null,
        photo: null,
      },
    ],
  },

  faq: {
    title: 'Frequently asked',
    items: [
      {
        question: 'Do you work with any company?',
        answer:
          'Yes. Kuiper Studio is a generalist web agency. The Expertise pages show the fields the team knows best.',
      },
      {
        question: 'Are listed prices excluding tax?',
        answer: 'Yes, every price on this site is excluding tax.',
      },
      {
        question: 'Euros or dollars?',
        answer:
          'Euros for visitors in Europe, dollars elsewhere. The switch in the header changes it at any time.',
      },
      {
        question: 'How long does a website take?',
        answer:
          'Within the month on Economy, seven days on Standard, 72 hours on Express for the Essentiel pack.',
      },
    ],
  },

  finalCta: {
    title: 'What are we building together?',
    sub: 'Tell us where it hurts. We answer with a price and a lead time.',
    primary: { label: 'Estimate my project', href: 'pricing' },
    secondary: { label: 'Write to us', href: 'contact' },
  },

  footer: {
    columns: [
      {
        title: 'Services',
        links: [
          { label: 'Websites', href: 'services' },
          { label: 'Automations', href: 'services' },
          { label: 'Custom projects', href: 'services' },
          { label: 'Business apps', href: 'services' },
          { label: 'Guest feedback', href: 'services' },
        ],
      },
      {
        title: 'Expertise',
        links: [
          { label: 'Restaurants', href: 'expertises' },
          { label: 'Hotels', href: 'expertises' },
          { label: 'Manufacturing', href: 'expertises' },
          { label: 'Team management', href: 'expertises' },
          { label: 'CRM', href: 'expertises' },
          { label: 'Insurance and brokerage', href: 'expertises' },
        ],
      },
      {
        title: 'The studio',
        links: [
          { label: 'Work', href: 'work' },
          { label: 'Pricing', href: 'pricing' },
          { label: 'Blog', href: 'blog' },
          { label: 'About', href: 'about' },
          { label: 'Contact', href: 'contact' },
        ],
      },
      {
        title: 'Legal',
        links: [
          { label: 'Legal notice', href: 'legal' },
          { label: 'Privacy', href: 'privacy' },
        ],
      },
    ],
    legal: 'Kuiper Studio, Phnom Penh.',
    tagline: 'We build the tools that keep your company running.',
  },

  cookies: {
    title: 'Cookies',
    body: 'We use cookies to run the site and, if you agree, to measure its audience. No tracker is set before you agree.',
    accept: 'Accept',
    refuse: 'Refuse',
    customize: 'Customise',
    save: 'Save',
    necessary: {
      title: 'Necessary',
      body: 'Required for the site to work. Always on.',
    },
    analytics: {
      title: 'Audience measurement',
      body: 'To know which pages get read. Off until you accept.',
    },
  },

  about: {
    title: 'About',
    body: null,
  },
  legal: { title: 'Legal notice', body: null },
  privacy: { title: 'Privacy', body: null },
}
