import { chromium } from '/opt/node-tools/node_modules/playwright/index.mjs'
import { mkdir, rm } from 'node:fs/promises'

/**
 * Rend la sequence de l'accueil, image par image, en PNG.
 *
 * Quatre jeux : paysage et portrait, chacun en definition simple et en
 * definition double. Le navigateur choisit celui qu'il lui faut selon la
 * largeur du canvas en pixels reels, donc un ecran ordinaire ne telecharge
 * jamais les images retine. Voir `components/sequence/sequence.ts`.
 *
 * La progression ne part pas de zero : a t = 0 les plaques sont encore loin
 * et l'ecran est presque vide, ce que le cahier interdit. Elle part a 0,12,
 * ou il y a deja de quoi regarder, et va jusqu'a 1.
 *
 *     cd scripts/sequence && python3 -m http.server 8099 &
 *     node scripts/sequence/render.mjs <dossier de travail>
 *     python3 scripts/sequence/encode.py <dossier de travail> public/sequence
 */
const START = 0.12
const dir = process.argv[2]
if (!dir) throw new Error('usage: node render.mjs <dossier de travail>')

const SETS = [
  { folder: 'desktop', frames: 144, w: 1920, h: 1080 },
  { folder: 'desktop-2x', frames: 144, w: 3840, h: 2160 },
  { folder: 'mobile', frames: 60, w: 900, h: 1350 },
  { folder: 'mobile-2x', frames: 60, w: 1800, h: 2700 },
]

const b = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'],
})

for (const set of SETS) {
  const out = `${dir}/${set.folder}`
  await rm(out, { recursive: true, force: true })
  await mkdir(out, { recursive: true })
  const ctx = await b.newContext({ viewport: { width: set.w, height: set.h }, deviceScaleFactor: 1 })
  const p = await ctx.newPage()
  p.on('pageerror', (e) => console.log('ERREUR :', e.message))
  await p.goto(`http://127.0.0.1:8099/scene.html?w=${set.w}&h=${set.h}`, { waitUntil: 'load' })
  await p.waitForFunction(() => window.sceneReady === true, { timeout: 120000 })
  const canvas = p.locator('canvas')
  const t0 = Date.now()
  for (let i = 0; i < set.frames; i++) {
    const t = START + (1 - START) * (i / (set.frames - 1))
    await p.evaluate((v) => window.poseFrame(v), t)
    await canvas.screenshot({ path: `${out}/${String(i + 1).padStart(4, '0')}.png` })
  }
  console.log(`${set.folder} : ${set.frames} images ${set.w}x${set.h} en ${Math.round((Date.now() - t0) / 1000)} s`)
  await ctx.close()
}
await b.close()
