/**
 * Releve tout ce qui manque dans le contenu, langue par langue.
 *
 * Les emplacements « [À FOURNIR] » ont disparu de l'ecran : un site public qui
 * montre ses trous se lit comme un brouillon. Ils ne doivent pas disparaitre
 * de la vue de l'equipe pour autant, sinon un manque se transforme en oubli.
 * C'est le role de ce script, et de A-FOURNIR.md qu'il sert a tenir a jour.
 *
 *     node --experimental-strip-types scripts/trous.mjs
 *
 * Il lit les fichiers de contenu comme du texte, sans demarrer Next : une
 * verification qui demande un serveur ne se lance jamais.
 */

import { readFileSync } from 'node:fs'

const LANGUES = ['fr', 'en']

/** Les chemins a verifier, et ce qu'ils representent pour le lecteur. */
const CHAMPS = [
  ['expertises', 'lead', 'l’accroche'],
  ['expertises', 'understand', 'ce que nous comprenons du métier'],
  ['expertises', 'problems', 'les problèmes typiques'],
  ['expertises', 'offer', 'ce que nous proposons'],
  ['expertises', 'experience', '« Notre expérience »'],
  ['expertises', 'proof', 'une réalisation liée'],
  ['services', 'problem', 'le problème'],
  ['services', 'delivers', 'ce que nous livrons'],
  ['services', 'delays', 'les délais'],
  ['services', 'proof', 'une réalisation liée'],
  ['services', 'faq', 'la FAQ'],
]

/**
 * Les cles dont la valeur est `null`, dans un bloc nomme.
 *
 * On lit le source plutot que d'importer le module : importer du TypeScript
 * demande une passe de compilation, et ce script doit rester lancable seul.
 */
function nuls(source, bloc) {
  const debut = source.indexOf(`\n  ${bloc}: {`)
  if (debut < 0) return {}
  const fin = source.indexOf('\n  },\n', debut)
  const corps = source.slice(debut, fin)

  const trouve = {}
  let page = null
  for (const ligne of corps.split('\n')) {
    const entree = ligne.match(/^    (\w[\w-]*): \{$/)
    if (entree) {
      page = entree[1]
      trouve[page] = []
      continue
    }
    const vide = ligne.match(/^      (\w+): null,$/)
    if (vide && page) trouve[page].push(vide[1])
  }
  return trouve
}

let total = 0
for (const langue of LANGUES) {
  const source = readFileSync(new URL(`../content/${langue}.ts`, import.meta.url), 'utf8')
  const lignes = []
  for (const [bloc, champ, libelle] of CHAMPS) {
    for (const [page, manquants] of Object.entries(nuls(source, bloc))) {
      if (manquants.includes(champ)) lignes.push(`  ${bloc}/${page} : ${libelle}`)
    }
  }
  lignes.sort()
  total += lignes.length
  console.log(`\n── ${langue} ── ${lignes.length} manque(s)`)
  for (const ligne of lignes) console.log(ligne)
}

console.log(`\n${total} manque(s) au total, sur ${LANGUES.length} langues.`)
console.log('Le détail et ce qu’il faut fournir sont dans A-FOURNIR.md.')
