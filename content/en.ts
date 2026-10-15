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
        consulting: 'Consulting',
        feedback: 'Guest feedback',
      },
    },
    expertises: {
      title: 'Expertise',
      children: {
        restaurants: 'Restaurants',
        retail: 'Retail',
        hotels: 'Hotels',
        manufacturing: 'Manufacturing',
        teams: 'Team management',
        crm: 'CRM',
        insurance: 'Insurance and brokerage',
        automation: 'Automation',
        ai: 'Artificial intelligence',
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
      consulting: 'Six months to find what is wrong, with figures to back it.',
      feedback: 'Every review of your venue in one place.',
    },
    expertises: {
      restaurants: 'Till, recipes, food cost, guest reviews.',
      retail: 'Accurate stock, full cost price, several outlets.',
      hotels: 'Your systems talk, and their data sits in one place.',
      manufacturing: 'Inventory, MRP, bills of materials, production tracking.',
      teams: 'Clock in with the location, time tracking, invoicing.',
      crm: 'A custom CRM, or we adapt the one you have.',
      insurance: 'The tools brokers use every day.',
      automation: 'Your tools talk to each other, and double entry goes away.',
      ai: 'AI inside your flows, where it saves time, and nowhere else.',
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
    seeAll: 'See all',
    currency: 'Currency',
    language: 'Language',
    skip: 'Skip to content',
    menu: 'Open menu',
    close: 'Close menu',
    view: 'View',
  },

  words: {
    testimonial: 'testimonial',
    desktopShot: 'desktop screenshot',
    phoneShot: 'phone screenshot',
    figures: 'verified figures',
    updatedOn: 'last updated',
    photo: 'photo',
    shot: 'screenshot',
  },

  hero: {
    eyebrow: 'A web agency, for any company',
    title: 'We build websites, automations, business apps.',
    titleLines: ['We build', 'websites.'],
    rotate: [
      'websites.',
      'automations.',
      'business apps.',
      'the missing bridges.',
      'what you are missing.',
    ],
    sub: 'The tools that keep your company running, delivered fast and at listed prices, by a team that knows your trade.',
    primary: { label: 'Estimate my project', href: 'pricing' },
    secondary: { label: 'See our expertise', href: 'expertises' },
    note: 'Listed prices, excluding tax. A two-minute estimate.',
  },

  home: {
    services: {
      title: 'What we do',
      lead: 'Five services, each with a listed price.',
    },
    sequence: {
      eyebrow: 'How it comes together',
      title: 'Your tools, pulled *together*.',
      lead: 'Every piece already exists somewhere: the till, the stock, the website, the spreadsheet. Our job is to make them turn the same way.',
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
      problem: [
        'You asked for a quote for a website, and got a range with nothing to explain it.',
        'The current site was built by a provider who no longer answers, and nobody knows what it runs on.',
        'Every change means an exchange of emails and an invoice.',
        'The site talks to none of your tools: enquiries arrive by email and get retyped by hand.',
      ],
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
      problem: [
        'The same information is entered three times, in three tools, by three people.',
        'Someone spends two hours a week copying rows from one export into another.',
        'Follow-ups happen when someone remembers, so not always.',
        'Your software each has its own export, and none reads the next one’s.',
      ],
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
      lead: 'You have an idea, we build it. Your budget is nothing to be ashamed of: tell us what it is, and we will tell you what fits inside it.',
      problem: [
        'You have an app project, and every quote you received costs several times what you could put in.',
        'Someone offered you a very low price, then delivered half of what was promised.',
        'Nobody will even look at the project until it reaches a certain budget.',
        'You cannot tell whether your idea is expensive because it is complicated, or because nobody took the time to look at it.',
      ],
      delivers: [
        'One developer and one project manager, billed monthly.',
        'You keep control of the priorities, month after month.',
        'A first conversation where we challenge the idea before pricing it: two thirds of the scope can usually wait.',
        'A proposal built around your budget, saying what fits inside it and what does not.',
      ],
      delays: null,
      proof: 'wave',
      faq: [
        {
          question: 'What if my budget is small?',
          answer:
            'Tell us. We would rather build the useful half of a project than refuse to look at it. If nothing useful fits the budget, we say that too.',
        },
        {
          question: 'Fixed price or monthly?',
          answer:
            'Both exist. Fixed price when the scope is clear and the date is firm, monthly when it will move. We propose the one that fits, and you decide.',
        },
      ],
    },
    apps: {
      title: 'Business apps',
      lead: 'Point of sale, inventory, MRP, CRM: for companies that want full control without depending on a vendor.',
      problem: [
        'Your IT estate was built in layers, and nobody knows any more what depends on what.',
        'A provider left before finishing, and a half installed tool remains that nobody dares touch.',
        'Your software vendor bills every change, and refuses access to your own data.',
        'Your tools are too old to be connected, and too embedded to be replaced all at once.',
      ],
      delivers: [
        'A base app, point of sale, inventory, MRP or CRM, as a one-off payment.',
        'A full ERP, only above a certain scope, and on quote.',
      ],
      delays: null,
      proof: 'mp-massage',
      faq: null,
    },
    consulting: {
      title: 'Consulting',
      lead: 'Six months to understand why it is not working, with your figures rather than an opinion. We pull in your data, we read it, and we tell you where the problem is.',
      problem: [
        'Your sales are falling and you cannot tell whether it is the menu, the prices, the service or the location.',
        'The data exists, in the till, the ERP, the CRM and the website, but each one keeps it to itself.',
        'The firms that do this work charge more than the analysis can return.',
        'The surveys you have tried say nothing usable: “did you enjoy your meal” is not a question.',
      ],
      delivers: [
        'Pulling your data out of the tools you already run: till, ERP, CRM, website, and what the web says about you.',
        'A trends dashboard: the hours, the days, the products, the gaps.',
        'A feedback mechanism at the moment of ordering, by QR code, by card or by email, offered to every customer.',
        'Questions that earn their place: what was ordered, when, at which table, served by whom, and the rating given at the end.',
        'Crossing all of it over the period: what links the low ratings to each other, and what does not.',
        'Tracking your public reviews and your response time, because a review left unanswered costs more than the review itself.',
        'At the end, an answer in writing: here is what is wrong, and here is what that conclusion rests on.',
      ],
      delays:
        'Six months. That is the shortest span in which a trend can be told apart from a bad month.',
      proof: null,
      faq: [
        {
          question: 'Why six months?',
          answer:
            'Because below that you are not reading a trend: you are reading the weather, the school holidays and a long weekend. Six months let you compare comparable periods.',
        },
        {
          question: 'Who owns the data collected?',
          answer:
            'You do. It is yours at the start, during and at the end, and it stays with you if we stop there.',
        },
        {
          question: 'What if you do not like the conclusion?',
          answer:
            'We give it anyway. We are paid to find what is wrong, not to confirm what is convenient.',
        },
      ],
    },
    feedback: {
      title: 'Guest feedback',
      lead: 'One page that gathers every review of your venue and brings out what works and what blocks.',
      problem: [
        'Reviews arrive on four platforms, and nobody has time to follow all of them.',
        'A bad review sits for weeks without an answer, and it is the missing answer that shows.',
        'You know service slips on certain evenings, without being able to say which or why.',
        'The surveys you have are only filled in by customers who were already happy.',
      ],
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
      lead: 'We spent years inside restaurant point of sale systems before starting the studio. We know what service sounds like, and what a badly placed tool costs on a Friday night.',
      understand: [
        'A till is not desktop software. It has to work fast, by finger, with both hands busy, and never lose an order because the network dropped.',
        'Food cost is decided in the recipe, not in the accounts. Until a dish is broken down into ingredients, margin is an estimate.',
        'Service data already exists: order time, table, server, delay, amount. It sits in the till and nobody reads it.',
        'A review arrives too late for the guest who wrote it, and right on time for the next hundred.',
      ],
      problems: [
        'The till, the booking system, the accounts and the website do not talk. Every figure is retyped, and every retype is a possible error.',
        'The till software reports revenue, and nothing about what explains it.',
        'Recipes live in a spreadsheet nobody updated after the last menu change.',
        'Reviews land on four different platforms, and nobody answers on any of them.',
      ],
      offer: [
        'Connecting the till, the booking system and the accounts, so a figure is entered once.',
        'Recipes, bills of materials and food cost, kept current with your purchase prices.',
        'Inventory, with stock movements derived from sales.',
        'A dashboard that crosses the hour, the table, the server and the rating, and says where service slips.',
        'Pulling your reviews together, and the support to improve service.',
        'An NFC badge at payment that opens the review page. Offered to every guest, never only to the happy ones.',
      ],
      experience: [
        'Arnaud spent more than five years in point of sale systems, with restaurants of every size, from the single owner to the chain.',
        'Hired to take over a Cambodian vendor’s till product, he rebuilt its foundations from field feedback. That same product now runs in more than six hundred restaurants in Phnom Penh.',
        'Louis spent two years building loyalty programmes for restaurants in Hong Kong, inside a point of sale vendor.',
        'Tills and mobile tills, order kiosks, QR code menus: we installed them, broke them and fixed them before offering them.',
      ],
      proof: null,
    },
    retail: {
      title: 'Retail',
      lead: 'The till, the stock, the purchasing and the delivery are one problem seen from four places. We have worked at all four.',
      understand: [
        'Accurate stock is worth more than a pretty report. Until the inventory gap is explained, no purchasing decision holds.',
        'Margin is made at purchase and lost at markdown. Both are measurable, and rarely in the same tool.',
        'Import and export add delays, duties and currency moves that the sale price has to absorb. A cost price that ignores them is wrong.',
        'What customers buy together says more than what they buy. That means reading the receipt, not just the total.',
      ],
      problems: [
        'The stock in the software and the stock on the shelf are not the same, and nobody knows since when.',
        'Purchasing is decided by eye, because the sales history is not usable.',
        'Cost price stops at the supplier price, without freight, duties or currency.',
        'Several outlets, as many databases, and no overall view.',
      ],
      offer: [
        'Inventory that holds, with gaps tracked and explained.',
        'Full cost price: purchase, freight, duties, currency.',
        'Several outlets consolidated into one view.',
        'Import and export flows, from purchase order to receipt.',
        'A sales dashboard by product, by hour and by store, and what sells together.',
        'Collecting customer reviews, and reading them.',
      ],
      experience: [
        'Arnaud has worked on point of sale, delivery and import export foundations for retail businesses.',
        'Setting up recipes, material costs and margin calculations has been part of his daily work for years.',
      ],
      proof: null,
    },
    hotels: {
      title: 'Hotels',
      lead: 'A hotel runs on five pieces of software that do not talk to each other. Our work starts there: make them talk, then read what they say.',
      understand: [
        'The PMS, the restaurant till, the spa, the online booking engine and the accounts each hold a piece of the truth. None holds all of it.',
        'Hotel data is seasonal and event driven. An annual average teaches nothing; the trend by week and by segment does.',
        'Housekeeping and maintenance are tracked on paper or not at all, and they are the two costs that set the rate.',
        'A bad review costs more the longer it goes unanswered.',
      ],
      problems: [
        'Answering a simple question about last month means opening four interfaces.',
        'The PMS is old and its vendor offers no access to the data, or charges more for it than for the PMS itself.',
        'Nobody knows which room was cleaned, by whom, or at what time.',
        'Reviews arrive on several platforms, and response time is measured nowhere.',
      ],
      offer: [
        'Connecting the systems already in place, and pulling their data into one spot.',
        'Integration with existing PMS, including those with no documented API.',
        'A trends dashboard: occupancy, segments, spend per guest, seasonality.',
        'Housekeeping and maintenance tracking, room by room, with the time and the person.',
        'Team time tracking.',
        'Review collection, an NFC badge, and response time tracking.',
      ],
      experience: [
        'Arnaud has worked with hotels on the restaurant side, then on connecting their systems to each other and centralising their data.',
        'Reading trends and collecting guest reviews has been part of that work from the start.',
        'PMS and systems inherited from the market: we know what to expect when we open them up.',
      ],
      proof: null,
    },
    manufacturing: {
      title: 'Manufacturing',
      lead: 'A wrong bill of materials shows up six months later, in the margin. We work on bills of materials, recipes and production tracking.',
      understand: [
        'A bill of materials is not a shopping list: it is a tree, with levels, losses and yields. A spreadsheet holds the first level, rarely the rest.',
        'Production is planned against what is in stock, what is on order and what is promised. All three belong in the same tool.',
        'In a kitchen as in a workshop, the process matters as much as the recipe: the order, the time, the temperature, who does what.',
        'The cost price of a manufactured product changes with every raw material delivery.',
      ],
      problems: [
        'The bills of materials exist, in a spreadsheet nobody dares edit.',
        'Planning happens from memory, and the shortage is discovered at production time.',
        'Losses and yields are not measured, so the cost price is optimistic.',
        'The workshop and the office do not see the same progress.',
      ],
      offer: [
        'Multi level bills of materials, with losses and yields.',
        'MRP: what to buy, and when, to hold the schedule.',
        'Raw material and work in progress inventory.',
        'Production tracking, from the works order to the finished item.',
        'Cost price recalculated on every material movement.',
        'A yield dashboard, station by station.',
      ],
      experience: [
        'Arnaud has worked on kitchen processes, recipes and bills of materials for a bakery chain in Hong Kong.',
        'Material costs and margin calculations are routine work for him, not a discovery.',
      ],
      proof: null,
    },
    teams: {
      title: 'Team management',
      lead: 'Knowing who started, where, and at what time. It is the request that comes up most often, and the one we handle today for several clients.',
      understand: [
        'On site clock in is not office clock in. A guard takes up a post at a specific place, and the place matters as much as the time.',
        'A team spread across several sites cannot be tracked with a wall mounted clock.',
        'Hours entered by hand get disputed, by the employee and by the client being billed for them.',
        'Tracking tasks is worth as much as tracking hours: knowing a room was cleaned, and by whom.',
      ],
      problems: [
        'Arrivals and departures are written in a notebook, then retyped at month end.',
        'There is no way to prove an officer was on site at the stated time.',
        'Client billing is built from attendance sheets, with the gaps that implies.',
        'No alert when a post goes uncovered.',
      ],
      offer: [
        'Clock in and clock out with the location, for teams spread across several sites.',
        'Time tracking, consolidated by person, by site and by period.',
        'Tracking of the tasks actually done, beyond the hours alone.',
        'Billing built on the hours actually clocked.',
        'Alerts on uncovered posts.',
        'An attendance and variance dashboard.',
      ],
      experience: [
        'A clock in system for field teams, security included, runs today for our clients.',
        'The need came from them, not from a catalogue: several asked us the same question at the same time.',
      ],
      proof: null,
    },
    crm: {
      title: 'CRM',
      lead: 'A CRM exists to tell you where each client stands. Most end up mainly collecting data nobody reads back.',
      understand: [
        'A CRM the team does not fill in is worth nothing. Filling it has to cost less than it returns to the person doing it.',
        'Off the shelf tools cover eighty per cent of the need. The rest is exactly what makes your trade yours.',
        'Client data is already in the till, the website and the mailbox. It does not need retyping, it needs gathering.',
        'Replacing a CRM costs more than adapting it, until it does not. That is a decision to take with figures.',
      ],
      problems: [
        'The CRM is half filled, so the reports are wrong, so nobody fills it in any more.',
        'Quotes, invoices and conversations live somewhere other than the CRM.',
        'The tool imposes a sales process that is not yours.',
        'The licence is expensive for features you do not use.',
      ],
      offer: [
        'A custom CRM, when the need does not fit an off the shelf tool.',
        'Or adapting HubSpot, Microsoft Dynamics and Salesforce, when it does.',
        'Taking over what exists, without losing the history.',
        'Connecting the website, the till and the mailbox, so entry happens once.',
        'Follow up and reminder automations.',
        'A pipeline dashboard that says where deals stall.',
      ],
      experience: [
        'Arnaud spent three years at a data management and automated flow company, moving data between tools that were never designed for it.',
      ],
      proof: null,
    },
    insurance: {
      title: 'Insurance and brokerage',
      lead: null,
      understand: null,
      problems: null,
      offer: null,
      experience: null,
      proof: null,
    },
    automation: {
      title: 'Automation',
      lead: 'Automation replaces nobody. It takes out of the day the gestures none of you chose to make.',
      understand: [
        'Double entry is not a waste of time, it is a loss of reliability. A figure typed twice ends up diverging, and then it is the wrong one that becomes the reference.',
        'A good flow is one that fires without anyone thinking about it. A flow you have to start by hand is one more form.',
        'Most tools already know how to talk. What is missing is almost never the API, it is someone to decide what gets said to whom, and in what order.',
        'A flow has to be able to fail loudly. A silent automation that stops on a Tuesday gets noticed on a Friday, and catching up costs more than the flow did.',
        'Not everything deserves automating. A task done twice a year gets done by hand, and we say so.',
      ],
      problems: [
        'The same order is keyed into the till, then the stock spreadsheet, then the accounts.',
        'Enquiries from the site arrive by email and get retyped into the CRM by hand.',
        'Nobody can say how many hours a week go into retyping, so nobody can say what automating would save.',
        'One tool in the estate has no open API, and its vendor charges more for access than for the tool itself.',
        'An automation exists, left by a supplier who has since gone, and nobody knows what it does any more.',
      ],
      offer: [
        'A survey of what gets retyped, before a single line is written: that is what says which flows are worth it.',
        'The flows themselves, from trigger to action, with their conditions.',
        'The connection between the till, the site, stock, accounting and email.',
        'Dealing with a vendor when a tool exposes no API, with the delay stated up front.',
        'An alert when a flow fails, and a monthly check that they are all still running.',
        'The simulator on the pricing page prices a flow before we even speak.',
      ],
      experience: [
        'Arnaud spent three years at a data management and automated flow company, moving data between tools that were never meant to talk to each other.',
        'At a till vendor, then at another one in Cambodia, we saw up close what a figure entered twice costs: never the typing, always the gap you find three months later.',
      ],
      proof: null,
    },
    ai: {
      title: 'Artificial intelligence',
      lead: 'AI can read, sort and draft. It cannot decide for you, and we do not sell it as though it could.',
      understand: [
        'AI is a step in a flow, not a product. It is worth what surrounds it: what fires it, what checks its output, what happens when it gets things wrong.',
        'It is good where the rule is fuzzy and the stakes are low: classifying an enquiry, pulling an amount off an invoice, summarising a thread, drafting a reply.',
        'It is bad where the figure has to be right. A total, a margin and a stock level are calculated, not estimated.',
        'Any AI output heading for a customer passes a human first. Not on principle, on arithmetic: one wrong answer sent in your name costs more than the minutes saved.',
        'The cost is per call and it rises with use. A poorly bounded AI flow prices well in month one and much less well in month six.',
      ],
      problems: [
        'Someone offered you “AI” without naming the task, or saying what happens when it gets it wrong.',
        'Supplier documents arrive as PDFs and get retyped by hand, one at a time.',
        'Sorting incoming enquiries takes an hour a day from someone whose job it is not.',
        'You tried a generic assistant that knows none of your products, prices or rules.',
        'You do not know what becomes of your data once it is sent to an AI provider.',
      ],
      offer: [
        'An AI step inside an existing flow, on a named task, with what it costs per month.',
        'Pulling data out of documents: invoices, delivery notes, supplier sheets.',
        'Sorting and routing incoming enquiries, with a fallback rule for when confidence is low.',
        'Draft replies, offered to your team, never sent without a read.',
        'The choice of provider and of where your data travels, written down before we start.',
        'And a straight no when AI is not the right answer: often a simple rule does better, for less.',
      ],
      experience: null,
      proof: null,
    },
  },

  expertiseLabels: {
    understand: 'What we understand about the trade',
    problems: 'Typical problems',
    offer: 'What we offer',
    experience: 'Our experience',
    experienceNote: 'What the founders built and ran before Kuiper Studio, elsewhere. These are not Kuiper Studio projects.',
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
        logo: '/clients/anakut.png',
        logoBg: '#100e0d',
        result: 'From 5 to 15 regular clients, without a franc of advertising.',
        shot: '/work/anakut/tableau-de-bord.webp',
        video: null,
        gallery: [
          { src: '/work/anakut/tableau-de-bord.webp', caption: 'The coach’s dashboard: his clients, his sessions, and the sign-up link he shares.' },
          { src: '/work/anakut/seances.webp', caption: 'Sessions, with the remaining pack, the status, the rated performance and payment.' },
          { src: '/work/anakut/progression.webp', caption: 'Physical tracking, client by client, with the change between two measurements.' },
          { src: '/work/anakut/packs.webp', caption: 'The packages, from a taster session to a pack of ten, which the coach manages himself.' },
          { src: '/work/anakut/fidelite.webp', caption: 'Loyalty tiers and their benefits, configured by the coach.' },
        ],
        context:
          'Anakut is an independent personal trainer in Neuchâtel. Before, every new client filled in a paper form, and follow-up lived in spreadsheets and loose sheets that ended up lost. The coach kept his clients’ progress in his head: with five regular clients, that was already a stretch.',
        need:
          'One place where the client books a session and follows their own progress, and where the coach sees his schedule, his session notes and what each person owes him. No payment integration: payment stays direct, it was the follow-up that was missing, not the till.',
        built: [
          'A WordPress site, with a link into the client area.',
          'A client area where each person books their session with the coach.',
          'The coach’s calendar, connected to his Google Calendar: a booked session appears in the diary he already looks at.',
          'Session scheduling, session notes, and performance tracking client by client.',
          'A record of what each client owes, with no payment module.',
        ],
        results: [
          {
            value: '5',
            unit: ' to 15',
            caption: 'regular clients, before and today',
          },
          {
            prefix: '+',
            value: '30',
            unit: '%',
            caption: 'repeat bookings per new client',
          },
          {
            value: '6',
            unit: ' months',
            caption: 'of development',
          },
          {
            value: '20',
            unit: ' to 25,000 $',
            caption: 'the project bracket, excluding tax',
          },
        ],
        quote: {
          text: 'With this tool I can see the performance, and above all I know where to put the effort. Before, I had to remember everything. Today I know a client started at three push-ups, was doing fifteen two months later and seventeen last week. He sees his own progress, and I see what matters to him.',
          author: 'Sarin Preap, founder, Anakut',
        },
      },
      {
        slug: 'mp-massage',
        name: 'MP Massage',
        sector: 'Wellbeing',
        country: 'Switzerland',
        city: 'Neuchâtel',
        coords: { lat: 46.99, lon: 6.93 },
        summary: 'A booking and follow-up app, company accounts, and a site.',
        site: 'mpmassage.ch',
        logo: '/clients/mp-massage.png',
        logoBg: null,
        result: 'Retention up 42%, and no missed appointments left.',
        shot: null,
        video: null,
        gallery: null,
        context:
          'MP Massage is a massage practice in Neuchâtel. Booking ran through off the shelf tools like OneDoc, and it worked: that was not the problem. The problem was everything around it. Most clients took the standard treatment and nothing else, follow-up was done by hand, and nothing connected one session to the next.',
        need:
          'To know, before the client walks in, what hurts and what was done last time. And to open the door to companies, who were asking to book for their teams without having to call.',
        built: [
          'A booking app, where the client takes their appointment and finds their own history.',
          'A record of pains and sessions, readable before the next appointment.',
          'Company accounts: each company books for its teams, with an account per employee and what they are entitled to.',
          'The site in Next.js, and the app in Vue.js on a Laravel back end, with MariaDB.',
        ],
        results: [
          {
            prefix: '+',
            value: '42',
            unit: '%',
            caption: 'retention',
          },
          {
            prefix: '+',
            value: '25',
            unit: '%',
            caption: 'revenue',
          },
          {
            value: '2',
            unit: ' to 0',
            caption: 'missed appointments a month, before and for the last three months',
          },
          {
            value: '8',
            unit: ' months',
            caption: 'of development, spread out to fit the budget',
          },
        ],
        quote: {
          text: 'I was won over by how well this app works. I did not believe in it at first: people had come to sell me similar tools several times, and I had never really believed them. I let Kuiper Studio tempt me, mostly for how flexible they were on budget. I did not have a big budget, and they simply said they could stretch the development time while cutting the cost, delivering in stages. Saving 30 to 35% against two months of extra lead time was all upside. We agreed on that, we built it, we followed it through, and it is exactly what I needed.',
          author: 'Mydai Pongsanith, founder, MP Massage',
        },
      },
      {
        slug: 'ocs',
        name: 'OCS',
        sector: 'Team management',
        country: 'Cambodia',
        city: null,
        coords: null,
        summary: 'Cleaning team tracking in an airport, with clock in and billing.',
        site: null,
        logo: null,
        logoBg: null,
        result: null,
        shot: null,
        video: null,
        gallery: null,
        context:
          'OCS cleans an airport. Its managers knew an officer had turned up, but not whether they had actually been through a given zone, or at what time. On an airport site, that question is not a matter of comfort.',
        need:
          'To prove the visit, zone by zone, to the minute. Not just presence on site: presence at the exact spot that was due to be cleaned.',
        built: [
          'An NFC tag per zone, which an officer taps with their phone on arrival.',
          'A mobile app for the officers, which records the visit, the zone and the time.',
          'A supervision interface showing what was done, where, and by whom.',
        ],
        results: null,
        quote: null,
      },
      {
        slug: 'wave',
        name: 'Wave Network',
        sector: 'Insurance and brokerage',
        country: 'Switzerland',
        city: null,
        coords: null,
        summary:
          'The Wave Pass: the member app, the partner merchant app, and their back office.',
        site: 'wavenetwork.ch',
        logo: '/clients/wave-network.svg',
        logoBg: null,
        result: 'An app quoted at 200,000 dollars elsewhere, delivered for 25,000.',
        shot: null,
        video: null,
        gallery: null,
        context:
          'Wave Network is a Swiss financial advisory firm. Its subscription, the Wave Pass, gives access to a payment card, certified advisors, tax services and a network of partner merchants across Switzerland. On the member side, that access ran on a physical card. It needed an app. The project had been quoted elsewhere, and the quote came back at 200,000 dollars: a figure that closes the subject.',
        need:
          'To get the same thing for what they could actually put in. That meant going through the scope point by point, separating what the app needed in order to exist from what could come later, and building the first version on that sort.',
        built: [
          'The member app: at a partner, the member has their code scanned, and sees what the subscription has saved them.',
          'The partner merchant app, which records the visit from behind the counter.',
          'The web back office that drives both, on Wave Network’s side.',
          'A scope cut for a first launch, with the rest held back rather than sold as options paid for upfront.',
        ],
        results: [
          {
            value: '200',
            unit: ',000 $',
            caption: 'the quote received elsewhere for this project',
          },
          {
            value: '25',
            unit: ',000 $',
            caption: 'what Kuiper Studio charged to deliver it',
          },
          {
            value: '4.5',
            unit: ' months',
            caption: 'of development, delivered on time',
          },
        ],
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
      {
        company: 'Anakut',
        author: 'Sarin Preap',
        role: 'Founder',
        text: 'With this tool I can see the performance, and above all I know where to put the effort. Before, I had to remember everything.',
        photo: '/people/sarin-preap.webp',
      },
      {
        company: 'MP Massage',
        author: 'Mydai Pongsanith',
        role: 'Founder',
        text: 'I did not believe in it at first: people had come to sell me similar tools several times. What decided me was how flexible they were on budget.',
        photo: '/people/mydai-pongsanith.webp',
      },
      // The third waits on Wave Network's testimonial, which has not been
      // given yet. Two real ones beat three with one made up.
      { company: null, author: null, role: null, text: null, photo: null },
    ],
  },

  pricing: {
    title: 'Pricing',
    lead: 'Prices are listed, excluding tax, in your currency.',
    disclaimer: 'An indicative estimate, confirmed in writing after a conversation.',
    packs: {
      title: 'The packs',
      rows: {
        'essentiel-1': { name: 'Essentiel, 1 page', detail: 'Simple animations, free contact form. Express delivery available.' },
        'essentiel-3': { name: 'Essentiel, up to 3 pages', detail: 'Simple animations, free contact form. Express delivery available.' },
        pro: { name: 'Pro', detail: 'Up to 6 pages, advanced animations, 2 options included.' },
        complet: { name: 'Complet', detail: 'Up to 10 pages, parallax, 1 extra language, 3 options included. 3 weeks minimum.' },
        'sur-mesure': { name: 'Custom', detail: 'Web apps, client areas, integrations.' },
      },
    },
    options: {
      title: 'The options',
      note: 'Add any of them to any pack.',
      rows: {
        'formulaire-contact': 'Contact form',
        page: 'Extra page',
        'formulaire-avance': 'Advanced form',
        langue: 'Extra language',
        'animations-avancees': 'Advanced animations',
        simulateur: 'Simulator',
        reservation: 'Light booking',
        referencement: 'Advanced SEO',
      },
    },
    delays: {
      title: 'Lead times',
      rows: {
        economie: 'Economy, delivered within the month',
        standard: 'Standard, 7 days',
        express: 'Express, 72 hours, Essentiel pack only',
      },
    },
    plans: {
      title: 'The subscriptions',
      note: '12-month commitment.',
      rows: {
        'hebergement-wordpress': 'Hosting only, WordPress',
        'hebergement-node': 'Hosting only, custom Node.js',
        serenite: 'Sérénité',
        croissance: 'Croissance',
        partenaire: 'Partenaire',
      },
    },
    automation: {
      title: 'Automations',
      rows: {
        flow: 'Simple flow',
        condition: 'Each added condition',
        app: 'Each connected app',
        noApi: 'Tool without an open API',
      },
    },
    supervision: {
      title: 'Supervision',
      rows: {
        'jusqu-3': 'Up to 3 flows',
        'jusqu-10': 'Up to 10 flows',
        'au-dela': 'More than 10 flows',
      },
    },
    apps: {
      title: 'Business apps',
      rows: {
        base: 'Base app: point of sale, inventory, MRP, CRM',
        erp: 'Full ERP, on quote',
      },
    },
    team: {
      title: 'Custom projects',
      row: 'One developer and one project manager, per month',
    },
    transfer: 'Moving the site to another host',
    conditions: [
      'Payment: 50% on order, 50% on delivery.',
      'Content, copy, photos and logos, is provided by the client.',
      'Automation flows run on Kuiper Studio’s own n8n infrastructure and cannot be moved.',
    ],
    question: 'What do you want to build?',
    estimate: 'Your estimate',
    grid: 'The prices in detail',
  },

  configurator: {
    title: 'Estimate your site',
    lead: 'Pick, and the price updates. No email address asked before that.',
    pack: 'Your pack',
    options: 'Your options',
    delay: 'Your lead time',
    plan: 'Your subscription',
    noPlan: 'None for now',
    included: 'included',
    setup: 'Setup',
    monthly: 'Then, per month',
    includedNote: 'Options that come with the pack are taken off the most expensive ones you picked.',
    quoteNote: 'This pack is priced on quote: tell us what you want to build.',
    send: 'Get this estimate',
    sending: 'Sending…',
    sent: 'Estimate sent. We will get back to you within two working days.',
    failed: 'Sending failed. Try again, or write to us directly.',
    email: 'Your email',
    emailNote: 'So we can send you the breakdown. Nothing else.',
    consent: 'I agree to be contacted about this estimate.',
    steps: [
      {
        short: 'Pages',
        question: 'How many pages?',
        help: 'A home page, a contact page, one page per service. You can add more later.',
      },
      {
        short: 'Options',
        question: 'What do we add?',
        help: 'Take what you need. Your pack already comes with a few of them.',
      },
      {
        short: 'Lead time',
        question: 'By when?',
        help: 'The faster it goes, the more it costs: we reshuffle the team’s schedule.',
      },
      {
        short: 'Care',
        question: 'And after delivery?',
        help: 'Hosting, updates, changes. You can also take the site back and leave.',
      },
      {
        short: 'Price',
        question: 'Your estimate',
        help: 'Excluding tax, no commitment. The final price is confirmed after a conversation.',
      },
    ],
    stepOf: (current, total) => `Step ${current} of ${total}`,
    pagesUnit: (count) => (count > 1 ? 'pages' : 'page'),
    pagesMore: 'and up',
    packIs: 'Your pack',
    noOption: 'No option for now.',
    runningTotal: 'Running total',
    next: 'Next',
    back: 'Back',
    seeResult: 'See the price',
    restart: 'Start over',
    recap: 'What you picked',
    recapPages: 'Pages',
    recapOptions: 'Options',
    recapDelay: 'Lead time',
    recapPlan: 'Care',
    edit: 'Change',
  },
  simulator: {
    title: 'Simulate your automation',
    lead: 'Add blocks, and the price updates. No email address asked before that.',
    addFlow: 'Add a flow',
    removeFlow: 'Remove this flow',
    flow: 'Flow',
    trigger: 'Trigger',
    tool: 'Tool',
    condition: 'Condition',
    action: 'Action',
    add: 'Add',
    remove: 'Remove',
    yes: 'if yes',
    no: 'if no',
    includedInFlow: 'included in the flow',
    addHere: 'Pick the step to add at that point.',
    pickSlot: 'Click a “+” on the canvas to choose where to add a step.',
    apiQuestion: 'Does this tool have an open API?',
    triggerQuestion: 'What starts this flow?',
    apiYes: 'Yes',
    apiNo: 'No',
    apiUnknown: 'Not sure',
    apiWarning: 'Without an open API, access has to be obtained from the vendor: that often takes several weeks of paperwork.',
    apiKnown: 'Public API: nothing to negotiate with the vendor.',
    setup: 'Setup',
    monthly: 'Supervision, per month',
    time: 'Estimated lead time',
    timeValue: 'To confirm after a conversation',
    empty: 'Start by adding a trigger.',
    steps: 'The steps in your flow',
    triggers: {
      form: 'A form',
      email: 'An email',
      schedule: 'A schedule',
      webhook: 'Another tool',
      manual: 'A click',
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
      pos: 'A point of sale',
      pms: 'A PMS',
      inhouse: 'An in-house tool',
    },
    actions: {
      invoice: 'Invoice',
      followup: 'Follow up',
      inventory: 'Update inventory',
      report: 'Produce a report',
      ai: 'An AI task',
    },
  },
  blog: {
    title: 'Blog',
    lead: 'What we learn building tools for other people’s work.',
    all: 'All',
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
        bio: 'Self taught. He came into tech through a point of sale vendor, was hired two years later by another one in Cambodia, and became a product manager early: early enough to make his mistakes while they were still cheap. Two and a half years there, then three years at a data management and automated flow company. He started Kuiper Studio to answer what had annoyed him for years: nobody wanted to look at the small projects. His conviction fits in one sentence, and it is on this site: your budget is nothing to be ashamed of.',
        photo: null,
      },
      {
        name: 'Louis Vezia',
        role: 'Co-founder, technical lead',
        bio: 'An engineer with a master’s degree from France. Around ten years in tech, seven of them in Cambodia, where he has lived since 2019. He worked at a point of sale vendor, spending two years building loyalty programmes for restaurants in Hong Kong, then at an air purification systems company, and on custom builds for clients. He decides how things get built.',
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
    body: 'Kuiper Studio is a two person studio, based in Phnom Penh. We spent the last ten years inside the tools companies use every day: tills, inventories, CRMs, data flows. We built them, took them over, broke them and fixed them, for restaurants, hotels, shops and workshops. We started the studio for one specific reason: too many useful projects get turned away because their budget is judged too small. We would rather look, challenge the idea, and say what fits inside the budget on the table.',
  },
  legal: {
    title: 'Legal notice',
    intro:
      'The information below concerns the publisher of this site. The company registration is under way: the entries that depend on it are flagged and will be filled in as soon as it is issued.',
    updated: '14 October 2026',
    sections: [
      {
        heading: 'Site publisher',
        facts: [
          { label: 'Name', value: 'Kuiper Studio' },
          { label: 'Legal form', value: null },
          { label: 'Registration number', value: null },
          { label: 'Registered office', value: 'Phnom Penh, Cambodia' },
          { label: 'Full address', value: null },
          { label: 'Publication director', value: 'Arnaud Sebire' },
          { label: 'Contact', value: 'arnaud@kuiperstudio.com' },
        ],
      },
      {
        heading: 'Hosting',
        body: ['This site is hosted by Hostinger, on a server located in Singapore.'],
        facts: [
          { label: 'Host', value: 'Hostinger' },
          { label: 'Server location', value: 'Singapore' },
          { label: 'Host’s legal details', value: null },
        ],
      },
      {
        heading: 'Intellectual property',
        body: [
          'The copy, images and code on this site belong to Kuiper Studio, unless stated otherwise on the page concerned.',
          'The names and trademarks of the companies mentioned belong to their respective owners. Mentioning them implies neither a partnership nor an endorsement on their part.',
          'The projects shown here are published with the written consent of the clients concerned. A project without that consent does not appear on this site.',
        ],
      },
      {
        heading: 'Listed prices',
        body: [
          'Prices shown on this site exclude tax.',
          'They are shown in euros for visitors in Europe and in US dollars for everyone else. The dollar amount is calculated from the euro amount at a fixed commercial rate, which is not the market rate.',
          'A listed price indicates a current rate, not a firm offer. The final price of a project is the one on the signed quote.',
        ],
      },
      {
        heading: 'The simulators',
        body: [
          'The site configurator and the automation simulator give an estimate calculated from the published price grid. That estimate does not bind Kuiper Studio: it exists to give an order of magnitude before a conversation.',
        ],
      },
      {
        heading: 'Governing law',
        body: ['This site is published from Cambodia and is governed by Cambodian law.'],
        facts: [{ label: 'Competent jurisdiction', value: null }],
      },
    ],
  },

  privacy: {
    title: 'Privacy',
    intro:
      'What this site collects, why, where it goes, and how to have it deleted. No tracker is set before you agree to it.',
    updated: '14 October 2026',
    sections: [
      {
        heading: 'What we collect',
        body: [
          'Only what you send us yourself, through the contact form, the site configurator or the automation simulator.',
        ],
        facts: [
          { label: 'Contact form', value: 'Name, email address, message, and the fields you fill in.' },
          { label: 'Site configurator', value: 'Email address, and the detail of the estimate you built.' },
          { label: 'Automation simulator', value: 'Email address, and the detail of the flow you built.' },
          { label: 'Browsing', value: 'Nothing, until you have accepted audience measurement.' },
        ],
      },
      {
        heading: 'Why',
        body: [
          'To answer your enquiry, and for that alone. We sell no data, and we send no newsletter.',
          'You consent to being contacted about your enquiry by ticking the box on the form. Without that box ticked, the form is not sent.',
        ],
      },
      {
        heading: 'Where it goes',
        body: [
          'Enquiries are sent to HubSpot, the customer relationship tool Kuiper Studio uses. They are stored there and read by the two founders.',
          'No other company receives this data.',
        ],
        facts: [
          { label: 'Recipient', value: 'HubSpot' },
          { label: 'Location of HubSpot data', value: null },
          { label: 'Retention period', value: null },
        ],
      },
      {
        heading: 'Cookies',
        body: [
          'The site works without cookies. Only one thing is stored in your browser without your agreement: your currency choice and your answer to the cookie banner, so you are not asked again on every page. It serves nothing else and never leaves your browser.',
          'Audience measurement is switched on only if you accept it. Until you answer, or if you decline, no tracker is set and no visit is measured.',
          'You can change your mind at any time from the banner, or by clearing this site’s data in your browser.',
        ],
      },
      {
        heading: 'Your rights',
        body: [
          'You can ask to see the data we hold about you, to have it corrected, or to have it deleted. Write to arnaud@kuiperstudio.com: we answer within two working days.',
          'Deletion is final. We keep no copy just in case.',
        ],
      },
      {
        heading: 'Third party services',
        body: [
          'Fonts are served from this site, not from an outside service: no request is sent to a third party when a page is displayed.',
          'The site contains no share buttons, no social network pixels, and no video embedded from a third party platform.',
        ],
      },
    ],
  },
}
