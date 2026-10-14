import { chromium } from '/opt/node-tools/node_modules/playwright/index.mjs'
import { mkdir } from 'node:fs/promises'

/**
 * Rend la sequence d'images de l'en-tete, image par image.
 *
 * La scene vit dans `scripts/sequence/scene.html` : des plaques dispersees qui
 * s'assemblent en anneau autour d'une planete, et l'anneau tourne. Elle est
 * rendue ici, hors ligne, et le visiteur ne recoit que des WebP : ni Three.js
 * ni WebGL ne partent dans son navigateur.
 *
 * La progression ne part pas de zero : a t = 0 les plaques sont encore loin et
 * l'ecran est presque vide, ce que le cahier interdit. Elle part a 0,12, ou il
 * y a deja de quoi regarder, et va jusqu'a 1.
 *
 * Trois etapes, dans cet ordre :
 *
 *   1. Servir le dossier de la scene, avec une copie de Three.js a cote :
 *        cp node_modules/three/build/three.module.js scripts/sequence/
 *        cp node_modules/three/build/three.core.js scripts/sequence/
 *        (cd scripts/sequence && python3 -m http.server 8099 --bind 127.0.0.1 &)
 *      Un module ES ne se charge pas depuis file:// : le navigateur le refuse
 *      au titre de la politique d'origine. D'ou le serveur local.
 *   2. node scripts/render-sequence.mjs <dossier de sortie>
 *   3. python3 scripts/encode-sequence.py <dossier de sortie>/frames
 */
const START = 0.12
const dir = process.argv[2]
const sets = [
  { folder: 'desktop', frames: 144, w: 1600, h: 900 },
  { folder: 'mobile', frames: 60, w: 800, h: 1200 },
]

const b = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'],
})

for (const set of sets) {
  const out = `${dir}/frames/${set.folder}`
  await mkdir(out, { recursive: true })
  const ctx = await b.newContext({ viewport: { width: set.w, height: set.h }, deviceScaleFactor: 1 })
  const p = await ctx.newPage()
  p.on('pageerror', e => console.log('ERREUR :', e.message))
  await p.goto(`http://127.0.0.1:8099/scene.html?w=${set.w}&h=${set.h}`, { waitUntil: 'load' })
  await p.waitForFunction(() => window.sceneReady === true, { timeout: 60000 })
  const canvas = p.locator('canvas')
  const t0 = Date.now()
  for (let i = 0; i < set.frames; i++) {
    const t = START + (1 - START) * (i / (set.frames - 1))
    await p.evaluate(v => window.poseFrame(v), t)
    await canvas.screenshot({ path: `${out}/${String(i + 1).padStart(4, '0')}.png` })
    if ((i + 1) % 24 === 0) console.log(`  ${set.folder} ${i + 1}/${set.frames}`)
  }
  console.log(`${set.folder} : ${set.frames} images en ${Math.round((Date.now() - t0) / 1000)} s`)
  await ctx.close()
}
await b.close()
