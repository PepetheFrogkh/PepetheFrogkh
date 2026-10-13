import type { Dict } from './types'

/**
 * The English text of the site, in one place.
 *
 * Same rules as the French file: direct and simple, no em dashes, prices
 * always excluding VAT, and no figure, logo or testimonial that is not in the
 * brief. Anything missing is a visible [TO PROVIDE] slot, never an invention.
 *
 * In a heading, the word between asterisks is set in italic terracotta.
 */
export const en: Dict = {
  langName: 'English',

  meta: {
    siteName: 'Kuiper Studio',
    home: {
      title: 'Kuiper Studio · Improve your guests’ experience. Measure it.',
      description:
        'Kuiper Studio helps independent hotels, restaurants and retailers understand what their customers think, fix what goes wrong and improve their margins, with the right digital tools.',
    },
    situations: {
      title: 'Your situation · Kuiper Studio',
      description:
        'Guest feedback, opening, profitability, groups: the entry point that matches your venue.',
    },
    work: {
      title: 'Work · Kuiper Studio',
      description: 'What we have built for hotels, restaurants and independent owners.',
    },
    method: {
      title: 'Method · Kuiper Studio',
      description: 'Six steps, no surprises: understand, scope, design, build, launch, grow.',
    },
    about: {
      title: 'About · Kuiper Studio',
      description: 'Two founders, one point of contact. Kuiper Studio is based in Phnom Penh.',
    },
    diagnostic: {
      title: 'Free review diagnostic · Kuiper Studio',
      description:
        'Tell us your venue: within two business days, you receive a summary of your public reviews. Free, no commitment.',
    },
    legal: { title: 'Legal notice · Kuiper Studio', description: 'Legal notice for Kuiper Studio.' },
    privacy: { title: 'Privacy · Kuiper Studio', description: 'How Kuiper Studio handles your data.' },
  },

  nav: {
    items: [
      { label: 'Your situation', href: '#situations' },
      { label: 'Our offers', href: '#offres' },
      { label: 'Work', href: 'work' },
      { label: 'Method', href: 'method' },
      { label: 'About', href: 'about' },
    ],
    cta: 'Free diagnostic',
    ctaShort: 'Diagnostic',
    skip: 'Skip to content',
    menu: 'Open the menu',
    close: 'Close the menu',
  },

  hero: {
    eyebrow: 'Hospitality, restaurants and retail',
    title: 'Improve your guests’ experience. *Measure it.*',
    titleLines: [
      'Improve your',
      'customers\u2019',
      'experience.',
      '*Measure it.*',
    ],
    sub: 'Kuiper Studio helps independent hotels, restaurants and retailers understand what their customers think, fix what goes wrong and improve their margins, with the right digital tools.',
    primary: { label: 'Free review diagnostic', href: 'diagnostic' },
    secondary: { label: 'Book a call', href: 'booking' },
    note: '30 minutes with Arnaud, free, no commitment',
  },

  proof: {
    logosTitle: 'They chose us',
    figures: [
      { prefix: 'from ', value: '499', unit: ' € excl. VAT', caption: 'Listed prices' },
      { value: '72', unit: ' hours', caption: 'For our fastest delivery' },
      { value: '2', unit: ' founders', caption: 'One point of contact' },
    ],
  },

  showcase: {
    title: 'Our work',
    note: 'Project screenshots',
  },

  situations: {
    title: 'What’s your situation?',
    more: 'Learn more',
    cards: [
      {
        slug: 'guest-feedback',
        index: '01',
        photo: null,
        title: 'Finally know what your customers think of you.',
        quote: 'I don\u2019t know what\u2019s going wrong.',
        tags: ['Reviews', 'Surveys', 'Alerts'],
        published: true,
        link: null,
      },
      {
        slug: 'opening',
        index: '02',
        photo: null,
        title: 'Open with everything you need, from day one.',
        quote: 'I need everything, fast.',
        tags: ['Website', 'Booking', 'Automations'],
        published: true,
        link: null,
      },
      {
        slug: 'profitability',
        index: '03',
        photo: null,
        title: 'Customers, yes. Margin too.',
        quote: 'I have customers, but no margin.',
        tags: ['Inventory', 'Waste', 'Margins'],
        published: true,
        link: null,
      },
      {
        slug: 'groups',
        index: '04',
        photo: null,
        title: 'Keep your customers loyal across every venue.',
        quote: 'I want loyalty at scale.',
        tags: ['Loyalty', 'Dashboards', 'Integrations'],
        published: true,
        link: null,
      },
      {
        slug: 'visibility',
        index: '05',
        photo: null,
        title: 'A good-looking site, right away.',
        quote: 'I just want to be visible.',
        tags: ['Website', 'Listed price', 'Fast delivery'],
        published: true,
        link: 'home#offres',
      },
    ],
  },

  manifesto: 'Guest experience isn’t guesswork. It can be measured, and it improves with the right tools.',

  founders: {
    title: 'The founders',
    people: [
      {
        name: 'Arnaud Sebire',
        role: 'Co-founder, product and client relations',
        bio: 'Around ten years on operational products: functional design, business processes, development teams.',
        photo: '/equipe/arnaud-sebire.webp',
      },
      {
        name: 'Louis Vezia',
        role: 'Co-founder, technical direction',
        bio: 'Around ten years on architecture, data, performance and security, including several complex CRM projects.',
        photo: '/equipe/louis-vezia.webp',
      },
    ],
  },

  offers: {
    title: 'Our offers',
    note: 'The configurator gives an estimate in two minutes. Prices exclude VAT.',
    items: [
      {
        title: 'Websites',
        body: 'An animated, carefully built site, delivered in 72 hours, a week or a month, hosted and maintained by us.',
        price: 'From €499 excl. VAT',
      },
      {
        title: 'Automations',
        body: 'Your tools connected to each other: less typing, fewer things forgotten, monitored by us.',
        price: 'From €390 excl. VAT per flow',
      },
      {
        title: 'Custom',
        body: 'Apps, client portals and integrations, when nothing off the shelf fits.',
        price: 'On quote',
      },
    ],
  },

  work: {
    title: 'What we’ve built',
    intro: 'Three delivered projects. Every result published here is verified, or flagged as missing.',
    filters: ['Loyalty', 'Coaching', 'Wellness'],
    all: 'All',
    resultLabel: 'Result',
    otherProjects: 'Other projects',
    sectorLabel: 'Sector',
    cases: [
      {
        slug: 'wave',
        name: 'Wave',
        sector: 'Loyalty',
        country: 'Switzerland',
        site: 'wavenetwork.ch',
        summary:
          'The Wave Pass mobile app, a member benefits programme used at partner venues, and the management tool that runs it.',
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
        country: 'Neuchâtel, Switzerland',
        site: 'anakut.ch',
        summary: 'A custom app to run a coaching business, and the WordPress site of a boxing coach.',
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
        sector: 'Wellness',
        country: 'Neuchâtel, Switzerland',
        site: 'mpmassage.ch',
        summary: 'An app to run a massage business, and the site of a Thai massage practitioner.',
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
    title: 'What we believe',
    items: [
      {
        title: 'A price is shown, not hidden.',
        body: 'You know the price before you talk to us; the quote only confirms it, in writing.',
      },
      {
        title: 'Fast does not mean sloppy.',
        body: 'A short method and proven foundations let us deliver in days rather than months.',
      },
      {
        title: 'Going live is not the end.',
        body: 'A site lives, gets updated and monitored; we stay around, every month.',
      },
    ],
  },

  method: {
    title: 'Six steps, no surprises',
    intro: 'The clock starts when we receive your content.',
    steps: [
      { title: 'Understand', body: null, demo: null },
      { title: 'Scope', body: null, demo: null },
      { title: 'Design', body: null, demo: null },
      { title: 'Build', body: null, demo: null },
      { title: 'Launch', body: null, demo: null },
      { title: 'Grow', body: null, demo: null },
    ],
  },

  testimonials: {
    title: 'What they say',
    note: 'One video and two written reviews, published with the client’s written consent.',
  },

  diagnostic: {
    title: 'What your guests really think',
    body: 'Tell us your venue: within two business days, you receive a summary of your public reviews, what guests love and what keeps coming up. Free, no commitment.',
    preview: {
      title: 'Your summary will contain',
      lines: [
        'A summary of your public reviews',
        'What your guests love',
        'What keeps coming up as negative',
      ],
    },
    form: {
      venue: 'Venue name',
      city: 'City',
      type: 'Type',
      types: ['Hotel', 'Restaurant', 'Retail', 'Other'],
      maps: 'Google Maps link',
      mapsHint: 'Optional',
      name: 'Your name',
      email: 'Your email',
      consent:
        'I agree that Kuiper Studio may contact me about this diagnostic and keep this information.',
      submit: 'Get my diagnostic',
      sending: 'Sending',
      success:
        'That’s recorded. You will receive your review summary within two business days, and a confirmation email right away.',
      error: 'The form could not be sent. Write to arnaud@kuiperstudio.com and we will take it from there.',
      required: 'This field is required.',
      invalidEmail: 'This email address does not look valid.',
    },
  },

  faq: {
    title: 'Frequently asked questions',
    items: [
      {
        question: 'Is the diagnostic really free?',
        answer: 'Yes. You receive a summary of your public reviews, with no commitment and no pushy follow-up.',
      },
      {
        question: 'Do you work with a single restaurant?',
        answer: 'Yes. Our offers are built for the single venue as much as for groups.',
      },
      {
        question: 'How much does a website cost?',
        answer: 'From €499 excl. VAT; the configurator gives an estimate in two minutes.',
      },
      {
        question: 'How long does it take?',
        answer: 'From 72 hours to a month depending on the project; the clock starts when we receive your content.',
      },
      {
        question: 'Why a subscription?',
        answer:
          'Because a website and automations need hosting, monitoring and changes, every month.',
      },
    ],
  },

  finalCta: {
    title: 'Let’s talk about your guests.',
    sub: 'Thirty minutes, free, no commitment.',
    primary: { label: 'Free diagnostic', href: 'diagnostic' },
    secondary: { label: 'Book a call', href: 'booking' },
  },

  footer: {
    columns: [
      {
        title: 'Situations',
        links: [
          { label: 'Guest feedback', href: 'situations/guest-feedback' },
          { label: 'Opening', href: 'situations/opening' },
          { label: 'Profitability', href: 'situations/profitability' },
          { label: 'Groups and chains', href: 'situations/groups' },
          { label: 'A good-looking site, right away', href: 'home#offres' },
        ],
      },
      {
        title: 'Offers',
        links: [
          { label: 'Work', href: 'work' },
          { label: 'Method', href: 'method' },
          { label: 'Free diagnostic', href: 'diagnostic' },
        ],
      },
      {
        title: 'Studio',
        links: [
          { label: 'About', href: 'about' },
          { label: 'Legal notice', href: 'legal' },
          { label: 'Privacy', href: 'privacy' },
        ],
      },
      {
        title: 'Contact',
        links: [
          { label: 'arnaud@kuiperstudio.com', href: 'mailto:arnaud@kuiperstudio.com' },
          { label: 'Phnom Penh, Cambodia', href: '' },
        ],
      },
    ],
    legal: 'Kuiper Studio, Phnom Penh. All prices exclude VAT.',
    tagline: 'Guest experience can be measured.',
  },

  cookies: {
    title: 'Cookies',
    body: 'We use cookies to run the site and, if you accept, to measure its audience. No tracker is set before you agree.',
    accept: 'Accept',
    refuse: 'Refuse',
    customize: 'Customise',
    save: 'Save my choices',
    necessary: { title: 'Necessary', body: 'Required for the site to work. Always on.' },
    analytics: { title: 'Audience measurement', body: 'Tells us which pages are read, without identifying you.' },
  },

  situationPages: [
    {
      slug: 'guest-feedback',
      quote: '[TO PROVIDE]',
      title: 'Finally know what your guests think of you.',
      problem: ['[TO PROVIDE]'],
      steps: [
        'We gather your reviews and your surveys.',
        'We identify the topics that keep coming up.',
        'Every Monday, a summary, and an alert on every negative review.',
      ],
      measures: ['Average Google rating', 'Reviews per month', 'Share of comments by theme'],
      price: 'After the free diagnostic, price [TO SET with Louis]',
      proof: null,
    },
    {
      slug: 'opening',
      quote: '[TO PROVIDE]',
      title: 'Open with everything you need, from day one.',
      problem: ['[TO PROVIDE]'],
      steps: [
        'The website, the booking and the widgets.',
        'The automations.',
        'Your tools connected to each other.',
      ],
      measures: ['Direct bookings', 'Enquiries received through the site'],
      price: 'From €1,290 excl. VAT',
      proof: null,
    },
    {
      slug: 'profitability',
      quote: '[TO PROVIDE]',
      title: 'Guests, yes. Margin too.',
      problem: ['[TO PROVIDE]'],
      steps: [
        'We analyse inventory, waste and margins.',
        'We build the tooling that is missing.',
        'We track the results.',
      ],
      measures: ['Waste', 'Margin per product', 'Stockouts'],
      price: 'On quote, after an audit',
      proof: null,
    },
    {
      slug: 'groups',
      quote: '[TO PROVIDE]',
      title: 'Keep your guests loyal across every venue.',
      problem: ['[TO PROVIDE]'],
      steps: [
        'A loyalty app.',
        'Shared dashboards.',
        'Integrations with the till and the hotel software.',
      ],
      measures: ['Returning guests', 'Benefits redeemed', 'Figures per venue'],
      price: 'On quote, from 10 venues',
      proof: null,
    },
  ],

  situationLabels: {
    before: 'Before',
    after: 'After',
    problem: 'The problem',
    steps: 'What we do',
    measures: 'What you measure',
    proof: 'The proof',
    price: 'The price',
  },

  caseLabels: {
    context: 'The context',
    need: 'The need',
    built: 'What we built',
    results: 'The results',
    quote: 'The quote',
  },

  about: { title: 'Two founders, one point of contact', body: null },
  legal: { title: 'Legal notice', body: null },
  privacy: { title: 'Privacy', body: null },
}
