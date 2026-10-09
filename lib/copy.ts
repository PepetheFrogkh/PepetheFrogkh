import { SCENES } from './scrollState'

/**
 * Every line on screen, in one place.
 *
 * English only, by design: the brief scopes the Khmer version to the full
 * site, and half a translation in front of the client is worse than none.
 * The header keeps the EN | ខ្មែរ switch visible so the intent is on screen,
 * with the Khmer side disabled.
 *
 * House style from the brief: three to six words, in overlay.
 */
export interface PlanCopy {
  eyebrow: string
  title: string
  sub?: string
}

export const PLAN_COPY: Record<string, PlanCopy> = {
  drop: { eyebrow: 'Hanuman', title: 'Greatness in every drop.' },
  condensation: {
    eyebrow: 'Premium Lager',
    title: 'Ice cold. Always.',
    sub: 'Straight from the brewery in Phnom Penh',
  },
  open: { eyebrow: 'Open it', title: 'Pssht.' },
  pour: {
    eyebrow: 'Pour',
    title: 'Golden. Crisp. 4.9%.',
    sub: 'Barley malt · Premium hops',
  },
  black: {
    eyebrow: 'Hanuman Black',
    title: 'Deep. Dark. Smooth.',
    sub: 'Caramel · Honey · Roasted malt',
  },
  cta: {
    eyebrow: 'Double Gold · Monde Selection 2024',
    title: 'Find your Hanuman.',
    sub: 'Greatness in every moment',
  },
}

export const PLANS = SCENES.map((s) => ({ ...s, copy: PLAN_COPY[s.id] }))

export const SOCIALS = [
  { label: 'Facebook', href: 'https://www.facebook.com/HanumanBeverages' },
  { label: 'Instagram', href: 'https://www.instagram.com/hanumanbeverages' },
  { label: 'TikTok', href: 'https://www.tiktok.com/@hanumanbeverages' },
]
