import type { Locale } from '@/lib/i18n'
import type { Dict } from './types'
import { fr } from './fr'
import { en } from './en'
import { km } from './km'

const DICTS: Record<Locale, Dict> = { fr, en, km }

/** Le texte du site dans une langue. */
export function dict(locale: Locale): Dict {
  return DICTS[locale]
}

export type { Dict }
export * from './types'
