/**
 * Le flux d'automatisation : son modele, sa mise en page, et ce que chaque
 * noeud coute.
 *
 * Un flux est un arbre, pas une liste : une condition a deux suites, « oui » et
 * « non ». C'est ce qui permet de dessiner un vrai canevas plutot qu'une
 * chaine, et de se figurer ce qui se passe.
 *
 * Les prix ne sont pas ici mais dans `lib/prices.ts`, et les libelles dans
 * `content/`, indexes par les memes identifiants. Un noeud dit ce qu'il est,
 * jamais ce qu'il coute.
 */

export const TRIGGERS = ['form', 'email', 'schedule'] as const
export const TOOLS = ['sheet', 'crm', 'accounting', 'pos', 'pms', 'inhouse'] as const
export const ACTIONS = ['invoice', 'followup', 'inventory', 'report', 'ai'] as const

export type TriggerId = (typeof TRIGGERS)[number]
export type ToolId = (typeof TOOLS)[number]
export type ActionId = (typeof ACTIONS)[number]
export type NodeId = TriggerId | ToolId | ActionId | 'condition'

/** La famille d'un noeud, qui decide de sa forme, de sa couleur et de son cout. */
export type Family = 'trigger' | 'tool' | 'condition' | 'action'

export interface FlowNode {
  key: string
  family: Family
  id: NodeId
  /**
   * Pour un outil seulement : l'editeur expose-t-il une API ouverte ?
   * `null` tant que la question n'a pas ete posee, `'unknown'` quand le
   * visiteur repond qu'il ne sait pas. Seul `false` ajoute au prix.
   */
  openApi?: boolean | 'unknown' | null
  /** La suite, pour tout sauf une condition. */
  next?: FlowNode
  /** Les deux suites d'une condition. */
  yes?: FlowNode
  no?: FlowNode
}

export interface Flow {
  key: string
  root: FlowNode
}

/** Ou inserer le prochain noeud : apres quel noeud, et par quelle sortie. */
export type Slot = 'next' | 'yes' | 'no'
export interface Target {
  flow: string
  node: string
  slot: Slot
}

// ── parcours ────────────────────────────────────────────────────────────────

export function walk(node: FlowNode, visit: (node: FlowNode) => void): void {
  visit(node)
  for (const child of [node.next, node.yes, node.no]) {
    if (child) walk(child, visit)
  }
}

/** Le noeud portant cette clef, dans ce flux. */
export function find(node: FlowNode, key: string): FlowNode | null {
  let found: FlowNode | null = null
  walk(node, (item) => {
    if (item.key === key) found = item
  })
  return found
}

/** Une copie du flux avec `fn` appliquee au noeud vise. Rien n'est mute. */
export function update(
  node: FlowNode,
  key: string,
  fn: (node: FlowNode) => FlowNode,
): FlowNode {
  const next: FlowNode = node.key === key ? fn(node) : node
  const rebuild = (child?: FlowNode) => (child ? update(child, key, fn) : undefined)
  return {
    ...next,
    next: rebuild(next.next),
    yes: rebuild(next.yes),
    no: rebuild(next.no),
  }
}

/** Le flux sans ce noeud, ni sa suite. */
export function detach(node: FlowNode, key: string): FlowNode | null {
  if (node.key === key) return null
  const prune = (child?: FlowNode) => (child ? (detach(child, key) ?? undefined) : undefined)
  return { ...node, next: prune(node.next), yes: prune(node.yes), no: prune(node.no) }
}

// ── mise en page ────────────────────────────────────────────────────────────

/** Les mesures du canevas, en pixels. */
export const CANVAS = {
  nodeWidth: 188,
  nodeHeight: 96,
  columnGap: 64,
  rowGap: 20,
}

export interface Placed {
  node: FlowNode
  column: number
  row: number
  x: number
  y: number
}

export interface Edge {
  from: Placed
  to: Placed
  /** « oui » ou « non » quand l'arete sort d'une condition. */
  branch?: 'yes' | 'no'
}

export interface Layout {
  nodes: Placed[]
  edges: Edge[]
  width: number
  height: number
}

/**
 * Place les noeuds en colonnes et en rangees.
 *
 * Une colonne par niveau de profondeur. Une rangee par chemin : un noeud
 * lineaire garde la rangee de sa suite, une condition se centre entre ses deux
 * branches. Les positions sont calculees, jamais glissees a la souris : c'est
 * ce qui garde le canevas utilisable au clavier et au doigt.
 */
export function layout(root: FlowNode): Layout {
  const nodes: Placed[] = []
  const edges: Edge[] = []
  let rows = 0

  const place = (node: FlowNode, column: number): Placed => {
    let row: number

    if (node.family === 'condition') {
      const yes = node.yes ? place(node.yes, column + 1) : null
      const yesRow = yes ? yes.row : rows++
      const no = node.no ? place(node.no, column + 1) : null
      const noRow = no ? no.row : rows++
      row = (yesRow + noRow) / 2

      const self = push(node, column, row)
      if (yes) edges.push({ from: self, to: yes, branch: 'yes' })
      if (no) edges.push({ from: self, to: no, branch: 'no' })
      return self
    }

    const child = node.next ? place(node.next, column + 1) : null
    row = child ? child.row : rows++
    const self = push(node, column, row)
    if (child) edges.push({ from: self, to: child })
    return self
  }

  const push = (node: FlowNode, column: number, row: number): Placed => {
    const placed: Placed = {
      node,
      column,
      row,
      x: column * (CANVAS.nodeWidth + CANVAS.columnGap),
      y: row * (CANVAS.nodeHeight + CANVAS.rowGap),
    }
    nodes.push(placed)
    return placed
  }

  place(root, 0)

  // L'ordre de rendu suit la lecture, de gauche a droite et de haut en bas, et
  // non l'ordre de calcul, qui est un parcours en profondeur : c'est cet ordre
  // la que suit la tabulation.
  nodes.sort((a, b) => a.column - b.column || a.row - b.row)

  const columns = Math.max(...nodes.map((n) => n.column)) + 1
  return {
    nodes,
    edges,
    width: columns * CANVAS.nodeWidth + (columns - 1) * CANVAS.columnGap,
    height: Math.max(1, rows) * CANVAS.nodeHeight + (Math.max(1, rows) - 1) * CANVAS.rowGap,
  }
}

/** La courbe qui relie deux noeuds, comme un cable. */
export function curve(edge: Edge): string {
  const x1 = edge.from.x + CANVAS.nodeWidth
  const y1 = edge.from.y + CANVAS.nodeHeight / 2
  const x2 = edge.to.x
  const y2 = edge.to.y + CANVAS.nodeHeight / 2
  const bend = Math.max(28, (x2 - x1) / 2)
  return `M ${x1} ${y1} C ${x1 + bend} ${y1}, ${x2 - bend} ${y2}, ${x2} ${y2}`
}

// ── ce que compte le simulateur ─────────────────────────────────────────────

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
    walk(flow.root, (node) => {
      if (node.family === 'condition') conditions += 1
      if (node.family === 'tool') {
        apps += 1
        if (node.openApi === false) closedApis += 1
      }
    })
  }
  return { flows: flows.length, conditions, apps, closedApis }
}

/** Les lignes de prix qu'un noeud ajoute, par identifiant de la grille. */
export function nodeLines(node: FlowNode): ('flow' | 'condition' | 'app' | 'noApi')[] {
  if (node.family === 'trigger') return ['flow']
  if (node.family === 'condition') return ['condition']
  if (node.family === 'tool') return node.openApi === false ? ['app', 'noApi'] : ['app']
  return []
}
