'use client'

import { useEffect, useState } from 'react'
import type * as THREE from 'three'
import type { Beer } from '@/lib/brand'
import { makeLabelTexture, makeCollarTexture, type LabelFonts } from '@/lib/labelTexture'

const cache = new Map<string, { label: THREE.Texture; collar: THREE.Texture }>()

function families(): LabelFonts {
  const css = getComputedStyle(document.documentElement)
  const pick = (v: string, fallback: string) => css.getPropertyValue(v).trim() || fallback
  return {
    display: pick('--font-display', 'system-ui, sans-serif'),
    script: pick('--font-script', 'Georgia, serif'),
    khmer: pick('--font-khmer', 'system-ui, sans-serif'),
  }
}

/**
 * Label textures are drawn once per beer and cached for the session. Fonts
 * have to be resolved first or the canvas silently falls back to Times.
 */
export function useLabelTextures(beer: Beer) {
  const [tex, setTex] = useState<{ label: THREE.Texture; collar: THREE.Texture } | null>(
    () => cache.get(beer.id) ?? null,
  )

  useEffect(() => {
    const hit = cache.get(beer.id)
    if (hit) {
      setTex(hit)
      return
    }
    let alive = true
    ;(async () => {
      const fonts = families()
      try {
        await document.fonts.ready
        await Promise.all([
          document.fonts.load(`600 86px ${fonts.khmer}`, 'ហនុមាន'),
          document.fonts.load(`italic 400 76px ${fonts.script}`, 'Premium Lager'),
          document.fonts.load(`600 26px ${fonts.display}`, 'GREATNESS'),
        ])
      } catch {
        // fall through on browsers without the Font Loading API
      }
      const [label, collar] = await Promise.all([
        makeLabelTexture(beer, fonts),
        makeCollarTexture(beer, fonts),
      ])
      if (!alive) {
        label.dispose()
        collar.dispose()
        return
      }
      const entry = { label, collar }
      cache.set(beer.id, entry)
      setTex(entry)
    })()
    return () => {
      alive = false
    }
  }, [beer])

  return { label: tex?.label ?? null, collar: tex?.collar ?? null }
}
