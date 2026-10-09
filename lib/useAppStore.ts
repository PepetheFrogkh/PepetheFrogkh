'use client'

import { create } from 'zustand'
import type { BeerId } from './brand'

export type Quality = 'high' | 'low'

interface AppState {
  ageOk: boolean
  setAgeOk: (v: boolean) => void
  lang: 'en' | 'km'
  setLang: (v: 'en' | 'km') => void
  /** Index into SCENES — written only when the active plan changes. */
  scene: number
  setScene: (i: number) => void
  quality: Quality
  setQuality: (q: Quality) => void
  reducedMotion: boolean
  setReducedMotion: (v: boolean) => void
  webgl: boolean
  setWebgl: (v: boolean) => void
  loaded: boolean
  setLoaded: (v: boolean) => void
  /** Set by the beer selector; the driver scrolls to that plan and clears it. */
  jumpTo: BeerId | null
  requestJump: (b: BeerId | null) => void
}

export const useApp = create<AppState>((set) => ({
  ageOk: false,
  setAgeOk: (ageOk) => set({ ageOk }),
  lang: 'en',
  setLang: (lang) => set({ lang }),
  scene: 0,
  setScene: (scene) => set({ scene }),
  quality: 'high',
  setQuality: (quality) => set({ quality }),
  reducedMotion: false,
  setReducedMotion: (reducedMotion) => set({ reducedMotion }),
  webgl: true,
  setWebgl: (webgl) => set({ webgl }),
  loaded: false,
  setLoaded: (loaded) => set({ loaded }),
  jumpTo: null,
  requestJump: (jumpTo) => set({ jumpTo }),
}))

export const AGE_KEY = 'hanuman.age.ok'
