/**
 * Installe les photographies des pages Expertises.
 *
 *     node scripts/photos.mjs scripts/photos.json
 *
 * Le fichier liste, pour chaque metier, l'adresse de la photo, ce qu'elle
 * montre et son auteur :
 *
 *     {
 *       "restaurants": {
 *         "url": "https://images.unsplash.com/photo-xxxxxxxx",
 *         "alt": "Un cuisinier dresse une assiette au passe",
 *         "credit": "Photo : Prenom Nom, Unsplash"
 *       }
 *     }
 *
 * Le script telecharge, recadre au carre, ecrit deux tailles en WebP dans
 * `public/expertises/` et affiche le bloc a coller dans `content/fr.ts` et
 * `content/en.ts`. Il ne touche pas au contenu lui-meme : un texte ne se
 * modifie pas par un script, il se relit.
 *
 * Les cles possibles sont celles de `EXPERTISES`, dans `lib/i18n.ts`.
 *
 * Si `images.unsplash.com` est refuse par la politique reseau de
 * l'environnement, le script le dit et s'arrete : il ne fabrique rien a la
 * place.
 */

import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'

const run = promisify(execFile)

/** Les deux largeurs servies : l'affichage fait 320 px, retine comprise. */
const TAILLES = [
  { suffixe: '', largeur: 640 },
  { suffixe: '@2x', largeur: 1280 },
]

const source = process.argv[2]
if (!source) {
  console.error('usage : node scripts/photos.mjs <fichier.json>')
  process.exit(1)
}

const liste = JSON.parse(await readFile(source, 'utf8'))
const sortie = new URL('../public/expertises/', import.meta.url)
await mkdir(sortie, { recursive: true })

const contenu = {}

for (const [cle, photo] of Object.entries(liste)) {
  if (!photo?.url) {
    console.error(`${cle} : pas d'adresse, ignore`)
    continue
  }

  // La plus grande des deux tailles, recadree au carre par Unsplash lui-meme
  // quand l'adresse le permet : un recadrage fait a la source evite de
  // telecharger six megaoctets pour en garder un.
  const adresse = new URL(photo.url)
  adresse.searchParams.set('w', String(TAILLES[1].largeur))
  adresse.searchParams.set('h', String(TAILLES[1].largeur))
  adresse.searchParams.set('fit', 'crop')
  adresse.searchParams.set('q', '82')

  let brut
  try {
    const reponse = await fetch(adresse)
    if (!reponse.ok) throw new Error(`HTTP ${reponse.status}`)
    brut = Buffer.from(await reponse.arrayBuffer())
  } catch (erreur) {
    console.error(`${cle} : telechargement impossible (${erreur.message}).`)
    console.error("Si c'est un refus du proxy, le domaine n'est pas encore autorise :")
    console.error('reglages de l’environnement, Network access, Allowed domains.')
    process.exit(2)
  }

  const temporaire = new URL(`./${cle}.src`, sortie)
  await writeFile(temporaire, brut)

  for (const { suffixe, largeur } of TAILLES) {
    const fichier = `${cle}${suffixe}.webp`
    await run('python3', [
      '-c',
      [
        'import sys',
        'from PIL import Image',
        'src, dest, w = sys.argv[1], sys.argv[2], int(sys.argv[3])',
        'im = Image.open(src).convert("RGB")',
        // le carre, pris au centre : un metier se photographie de face
        'cote = min(im.size)',
        'g = (im.width - cote) // 2',
        'h = (im.height - cote) // 2',
        'im = im.crop((g, h, g + cote, h + cote)).resize((w, w), Image.LANCZOS)',
        'im.save(dest, "WEBP", quality=82, method=6)',
      ].join('\n'),
      temporaire.pathname,
      new URL(`./${fichier}`, sortie).pathname,
      String(largeur),
    ])
    console.log(`${fichier} : ${largeur} x ${largeur}`)
  }

  await run('rm', ['-f', temporaire.pathname])
  contenu[cle] = {
    src: `/expertises/${cle}.webp`,
    alt: photo.alt ?? '',
    credit: photo.credit ?? '',
  }
}

console.log('\n── a coller dans content/fr.ts et content/en.ts ──')
for (const [cle, valeur] of Object.entries(contenu)) {
  console.log(`\n  ${cle} :`)
  console.log(`      photo: {`)
  console.log(`        src: '${valeur.src}',`)
  console.log(`        alt: '${valeur.alt.replace(/'/g, '\\u2019')}',`)
  console.log(`        credit: '${valeur.credit.replace(/'/g, '\\u2019')}',`)
  console.log(`      },`)
}
console.log('\nL’« alt » se traduit : il decrit l’image, il n’est pas decoratif.')
