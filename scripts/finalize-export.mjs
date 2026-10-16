/**
 * Ce qu'il reste a faire apres `next build`, en export statique.
 *
 *     node scripts/finalize-export.mjs
 *
 * Deux choses que Next ne sait pas faire seul :
 *
 * - renommer `out/htaccess/index.html` en `out/.htaccess`. Une route ne peut
 *   pas s'appeler `.htaccess` : un segment d'adresse qui commence par un point
 *   n'est pas un segment valide. Elle s'appelle donc `htaccess`, et le fichier
 *   est remis a sa place ici.
 * - verifier qu'aucune route serveur n'a survecu. En export statique une route
 *   dynamique ne leve pas d'erreur, elle disparait en silence : le formulaire
 *   repondrait 404 en production sans que rien ne l'ait dit au build.
 */

import { readFile, readdir, rename, rm, writeFile } from 'node:fs/promises'
import { existsSync, statSync } from 'node:fs'
import { join } from 'node:path'

const OUT = 'out'

if (!existsSync(OUT)) {
  console.error(`${OUT}/ est absent : lancez d'abord "npm run build".`)
  process.exit(1)
}

// ── le .htaccess ──────────────────────────────────────────────────────────
// Selon la version et `trailingSlash`, Next ecrit la route soit en fichier
// `out/htaccess`, soit en `out/htaccess/index.html`. Les deux sont acceptes :
// une mise a jour de Next ne doit pas casser le deploiement en silence.
const candidats = [join(OUT, 'htaccess'), join(OUT, 'htaccess', 'index.html')]
const source = candidats.find((f) => existsSync(f) && statSync(f).isFile())
if (!source) {
  console.error('out/htaccess est absent : app/htaccess/route.ts n a pas ete rendu.')
  process.exit(1)
}

const regles = await readFile(source, 'utf8')
if (!regles.includes('RewriteEngine On')) {
  console.error(`${source} ne contient pas les regles attendues.`)
  process.exit(1)
}
await rm(join(OUT, 'htaccess'), { recursive: true, force: true })
await writeFile(join(OUT, '.htaccess'), regles)
console.log(`.htaccess ecrit, ${regles.split('\n').length} lignes`)

// ── l'API PHP ─────────────────────────────────────────────────────────────
for (const fichier of ['api/lead.php', 'api/lib/notify.php']) {
  if (!existsSync(join(OUT, fichier))) {
    console.error(`${fichier} manque dans l export : il doit vivre dans public/.`)
    process.exit(1)
  }
}
console.log('api/lead.php et sa bibliotheque sont la')

// ── aucune route serveur ───────────────────────────────────────────────────
async function routes(dir) {
  const trouve = []
  for (const entree of await readdir(dir, { withFileTypes: true })) {
    if (entree.name === 'node_modules' || entree.name.startsWith('.')) continue
    const chemin = join(dir, entree.name)
    if (entree.isDirectory()) trouve.push(...(await routes(chemin)))
    else if (entree.name === 'route.ts' || entree.name === 'route.tsx') trouve.push(chemin)
  }
  return trouve
}

const serveur = (await routes('app')).filter((f) => !f.includes('htaccess'))
for (const fichier of serveur) {
  const code = await readFile(fichier, 'utf8')
  if (!code.includes("dynamic = 'force-static'")) {
    console.error(`${fichier} est une route serveur sans force-static : elle ne sera pas exportee.`)
    process.exit(1)
  }
}
console.log(`${serveur.length} route(s) verifiee(s), toutes statiques`)
console.log('Export pret.')
