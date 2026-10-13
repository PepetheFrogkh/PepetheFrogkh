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
        'Kuiper Studio helps independent hotels and restaurants understand what their guests think, fix what goes wrong and improve their margins, with the right digital tools.',
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
    eyebrow: 'Hospitality and restaurants',
    title: 'Improve your guests’ experience. *Measure it.*',
    sub: 'Kuiper Studio helps independent hotels and restaurants understand what their guests think, fix what goes wrong and improve their margins, with the right digital tools.',
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
        title: 'Finally know what your guests think of you.',
        quote: '[TO PROVIDE]',
        tags: ['Reviews', 'Surveys', 'Alerts'],
        published: true,
      },
      {
        slug: 'opening',
        index: '02',
        title: 'Open with everything you need, from day one.',
        quote: '[TO PROVIDE]',
        tags: ['Website', 'Booking', 'Automations'],
        published: true,
      },
      {
        slug: 'profitability',
        index: '03',
        title: 'Guests, yes. Margin too.',
        quote: '[TO PROVIDE]',
        tags: ['Inventory', 'Waste', 'Margins'],
        published: true,
      },
      {
        slug: 'groups',
        index: '04',
        title: 'Keep your guests loyal across every venue.',
        quote: '[TO PROVIDE]',
        tags: ['Loyalty', 'Dashboards', 'Integrations'],
        published: true,
      },
    ],
  },

  manifesto: 'Guest experience isn’t guesswork. It can be measured, and it improves with the right tools.',

  founders: {
    title: 'The founders',
    people: [
      { name: 'Arnaud', role: null, photo: null },
      { name: 'Louis', role: null, photo: null },
    ],
  },

  offers: {
    title: 'Our offers',
    note: 'The configurator gives an estimate in two minutes. Prices exclude VAT.',
    items: [
      { title: 'Websites', body: null, price: 'From €499 excl. VAT' },
      { title: 'Automations', body: null, price: '[TO PROVIDE]' },
      { title: 'Custom', body: null, price: 'On quote' },
    ],
  },

  work: {
    title: 'What we’ve built',
    intro: 'Three delivered projects. Every result published here is verified, or flagged as missing.',
    filters: ['Hotels', 'Restaurants', 'Wellness'],
    all: 'All',
    resultLabel: 'Result',
    otherProjects: 'Other projects',
    sectorLabel: 'Sector',
    cases: [
      {
        slug: 'wave',
        name: 'Wave',
        sector: '[TO PROVIDE]',
        country: '[TO PROVIDE]',
        summary: '[TO PROVIDE]',
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
        sector: '[TO PROVIDE]',
        country: '[TO PROVIDE]',
        summary: '[TO PROVIDE]',
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
        sector: '[TO PROVIDE]',
        country: '[TO PROVIDE]',
        summary: '[TO PROVIDE]',
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
      { title: '[TO PROVIDE]', body: null },
      { title: '[TO PROVIDE]', body: null },
      { title: '[TO PROVIDE]', body: null },
    ],
  },

  method: {
    title: 'Six steps, no surprises',
    intro: 'The clock starts when we receive your content.',
    steps: [
      { title: 'Understand', body: null },
      { title: 'Scope', body: null },
      { title: 'Design', body: null },
      { title: 'Build', body: null },
      { title: 'Launch', body: null },
      { title: 'Grow', body: null },
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
      types: ['Hotel', 'Restaurant', 'Other'],
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
