import * as THREE from 'three'
import { BRAND, type Beer } from './brand'

/**
 * The label is painted at runtime on a 2048×1024 canvas rather than sampled
 * from a photo. The packshots Hanuman publishes are 335–554 px wide, which is
 * far too small to texture a label that spends most of the scroll in close-up.
 * The one element that cannot be redrawn — the Hanuman figure — is lifted from
 * the official logo at full resolution and re-sharpened (see scripts/).
 */

const MASKS = {
  figure: '/brand/hanuman-figure.png',
  wordmark: '/brand/hanuman-wordmark.png',
} as const

type MaskId = keyof typeof MASKS

const maskCache = new Map<MaskId, HTMLCanvasElement>()

/** White-on-transparent PNG → an offscreen canvas we can tint. */
async function loadMask(id: MaskId): Promise<HTMLCanvasElement> {
  const cached = maskCache.get(id)
  if (cached) return cached

  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const el = new Image()
    el.onload = () => resolve(el)
    el.onerror = () => reject(new Error(`mask ${id} failed to load`))
    el.src = MASKS[id]
  })

  const c = document.createElement('canvas')
  c.width = img.width
  c.height = img.height
  const ctx = c.getContext('2d')!
  ctx.drawImage(img, 0, 0)
  maskCache.set(id, c)
  return c
}

function tinted(mask: HTMLCanvasElement, color: string) {
  const c = document.createElement('canvas')
  c.width = mask.width
  c.height = mask.height
  const ctx = c.getContext('2d')!
  ctx.drawImage(mask, 0, 0)
  ctx.globalCompositeOperation = 'source-in'
  ctx.fillStyle = color
  ctx.fillRect(0, 0, c.width, c.height)
  return c
}

function drawMask(
  ctx: CanvasRenderingContext2D,
  mask: HTMLCanvasElement,
  color: string,
  cx: number,
  cy: number,
  height: number,
) {
  const w = (mask.width / mask.height) * height
  ctx.drawImage(tinted(mask, color), cx - w / 2, cy - height / 2, w, height)
}

/** The sunburst behind the figure, straight off the can. */
function drawRays(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  color: string,
  count = 56,
) {
  ctx.save()
  ctx.translate(cx, cy)
  ctx.strokeStyle = color
  ctx.lineCap = 'round'
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2
    const long = i % 2 === 0
    ctx.beginPath()
    ctx.lineWidth = long ? 5 : 3
    ctx.globalAlpha = long ? 0.55 : 0.3
    ctx.moveTo(Math.cos(a) * radius * 0.42, Math.sin(a) * radius * 0.42)
    ctx.lineTo(
      Math.cos(a) * radius * (long ? 1 : 0.82),
      Math.sin(a) * radius * (long ? 1 : 0.82),
    )
    ctx.stroke()
  }
  ctx.restore()
}

function goldSheen(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  const g = ctx.createLinearGradient(x, y, x, y + h)
  g.addColorStop(0, BRAND.goldDeep)
  g.addColorStop(0.35, BRAND.goldLight)
  g.addColorStop(0.55, BRAND.gold)
  g.addColorStop(1, BRAND.goldDeep)
  ctx.fillStyle = g
  ctx.fillRect(x, y, w, h)
}

export interface LabelFonts {
  display: string
  script: string
  khmer: string
}

/**
 * Renders the wrap-around body label. The emblem sits at u = 0.5 so the front
 * of the bottle faces the camera at rotation 0.
 */
export async function makeLabelTexture(beer: Beer, fonts: LabelFonts) {
  const W = 2048
  const H = 1024
  const c = document.createElement('canvas')
  c.width = W
  c.height = H
  const ctx = c.getContext('2d')!

  const dark = beer.id === 'black'
  const bg = beer.labelBg

  ctx.fillStyle = bg
  ctx.fillRect(0, 0, W, H)

  // subtle vertical shading so the label does not read as flat vinyl
  const shade = ctx.createLinearGradient(0, 0, 0, H)
  shade.addColorStop(0, 'rgba(0,0,0,0.35)')
  shade.addColorStop(0.45, 'rgba(255,255,255,0.06)')
  shade.addColorStop(1, 'rgba(0,0,0,0.45)')
  ctx.fillStyle = shade
  ctx.fillRect(0, 0, W, H)

  // gold rules top and bottom, as on the packaging
  goldSheen(ctx, 0, 26, W, 10)
  goldSheen(ctx, 0, H - 36, W, 10)

  const cx = W / 2
  const [figure, wordmark] = await Promise.all([loadMask('figure'), loadMask('wordmark')])

  // Khmer name — ហនុមាន sits above the emblem on both labels
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = dark ? BRAND.gold : BRAND.cream
  ctx.font = `600 86px ${fonts.khmer}`
  ctx.fillText(beer.khmer, cx, 118)

  // emblem: rays + figure
  drawRays(ctx, cx, 450, 330, dark ? BRAND.gold : BRAND.goldLight)
  drawMask(ctx, figure, dark ? BRAND.cream : BRAND.cream, cx, 450, 430)

  // wordmark
  drawMask(ctx, wordmark, dark ? BRAND.gold : BRAND.goldLight, cx, 760, 96)

  // variant line
  ctx.fillStyle = dark ? BRAND.goldLight : BRAND.goldLight
  ctx.font = `italic 400 76px ${fonts.script}`
  ctx.fillText(dark ? 'Black' : 'Premium Lager', cx, 862)

  // baseline, in the brand's own words
  ctx.fillStyle = dark ? 'rgba(244,213,141,0.85)' : 'rgba(246,241,230,0.8)'
  ctx.font = `600 26px ${fonts.display}`
  ctx.letterSpacing = '7px'
  ctx.fillText('GREATNESS IN EVERY MOMENT', cx, 942)
  ctx.letterSpacing = '0px'

  // The back of the wrap. The camera orbits a full half-turn in plan 2, so
  // these panels are on screen as long as the emblem is and have to hold up.
  const ink = dark ? BRAND.goldLight : BRAND.cream
  for (const side of [cx - W * 0.33, cx + W * 0.33]) {
    ctx.save()
    ctx.translate(side, 0)

    ctx.fillStyle = dark ? BRAND.gold : BRAND.goldLight
    ctx.font = `italic 400 54px ${fonts.script}`
    ctx.fillText('Finest German Brew', 0, 300)

    goldSheen(ctx, -200, 346, 400, 4)

    ctx.fillStyle = ink
    ctx.font = `600 30px ${fonts.display}`
    ctx.letterSpacing = '8px'
    ctx.fillText(beer.name.toUpperCase(), 0, 412)

    ctx.globalAlpha = 0.72
    ctx.font = `400 24px ${fonts.display}`
    ctx.letterSpacing = '4px'
    ctx.fillText('BREWED AND BOTTLED BY', 0, 478)
    ctx.fillText('HANUMAN BEVERAGES', 0, 516)
    ctx.fillText('SEN SOK · PHNOM PENH · CAMBODIA', 0, 554)
    ctx.globalAlpha = 1

    goldSheen(ctx, -200, 596, 400, 4)

    ctx.fillStyle = dark ? BRAND.gold : BRAND.goldLight
    ctx.font = `600 30px ${fonts.display}`
    ctx.letterSpacing = '8px'
    ctx.fillText(beer.abv ? `ALC. ${beer.abv} VOL.` : '100% MALT', 0, 660)

    ctx.fillStyle = ink
    ctx.globalAlpha = 0.6
    ctx.font = `400 22px ${fonts.display}`
    ctx.letterSpacing = '3px'
    ctx.fillText('330 ML', 0, 716)
    ctx.globalAlpha = 1

    // the sunburst again, small, so the panel is never flat
    drawRays(ctx, 0, 818, 110, dark ? BRAND.goldDeep : 'rgba(244,213,141,0.55)', 32)
    ctx.restore()
  }

  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 8
  tex.wrapS = THREE.RepeatWrapping
  // three's CylinderGeometry starts its u at +Z, which is where the camera
  // sits at rotation 0 — shift half a turn so the emblem faces front.
  tex.offset.x = 0.5
  tex.needsUpdate = true
  return tex
}

/** The gold foil collar with the crowned H, wrapped round the neck. */
export async function makeCollarTexture(beer: Beer, fonts: LabelFonts) {
  const W = 1024
  const H = 256
  const c = document.createElement('canvas')
  c.width = W
  c.height = H
  const ctx = c.getContext('2d')!

  goldSheen(ctx, 0, 0, W, H)
  if (beer.id === 'black') {
    ctx.fillStyle = 'rgba(0,0,0,0.55)'
    ctx.fillRect(0, 0, W, H)
    goldSheen(ctx, 0, 0, W, 8)
    goldSheen(ctx, 0, H - 8, W, 8)
  }

  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = beer.id === 'black' ? BRAND.gold : BRAND.navy
  ctx.font = `700 120px ${fonts.display}`
  ctx.fillText('H', W / 2, 96)
  ctx.font = `italic 400 44px ${fonts.script}`
  ctx.fillText('Finest German Brew', W / 2, 190)

  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 8
  tex.wrapS = THREE.RepeatWrapping
  tex.offset.x = 0.5
  return tex
}
