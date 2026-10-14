import type { OptionId } from './prices'

/**
 * Le catalogue de blocs du simulateur d'automatisation.
 *
 * Le cahier : declencheurs, outils, conditions, actions. Les prix ne sont pas
 * ici mais dans `lib/prices.ts` : un bloc dit ce qu'il est, pas ce qu'il
 * coute. Les libelles, eux, sont dans `content/`, indexes par ces memes
 * identifiants.
 */

export const TRIGGERS = ['form', 'email', 'schedule'] as const
export const TOOLS = ['sheet', 'crm', 'accounting', 'pos', 'pms', 'inhouse'] as const
export const ACTIONS = ['invoice', 'followup', 'inventory', 'report', 'ai'] as const

export type TriggerId = (typeof TRIGGERS)[number]
export type ToolId = (typeof TOOLS)[number]
export type ActionId = (typeof ACTIONS)[number]

/** La famille d'un bloc, qui decide de ce qu'il coute et d'ou il se branche. */
export type Family = 'trigger' | 'tool' | 'condition' | 'action'

export interface Block {
  /** Unique dans le flux, pour relier les blocs entre eux. */
  key: string
  family: Family
  /** L'identifiant du catalogue, ou `condition` pour une condition. */
  id: TriggerId | ToolId | ActionId | 'condition'
  /**
   * Pour un outil seulement : l'editeur expose-t-il une API ouverte ?
   * `null` tant que la question n'a pas ete posee.
   */
  openApi?: boolean | null
}

/** Un flux : une suite de blocs, du declencheur a l'action. */
export interface Flow {
  key: string
  blocks: Block[]
}

/** Ce que le simulateur compte, pour le recapitulatif. */
export interface Tally {
  flows: number
  conditions: number
  apps: number
  closedApis: number
}

export function tally(flows: Flow[]): Tally {
  let conditions = 0
  let apps = 0
  let closedApis = 0
  for (const flow of flows) {
    for (const block of flow.blocks) {
      if (block.family === 'condition') conditions += 1
      if (block.family === 'tool') {
        apps += 1
        if (block.openApi === false) closedApis += 1
      }
    }
  }
  return { flows: flows.length, conditions, apps, closedApis }
}

/** Les options du configurateur de sites n'ont rien a faire ici. */
export type NotAnOption = Exclude<OptionId, OptionId>
