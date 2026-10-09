import fs from 'node:fs'
import path from 'node:path'

import Shell from '@/components/Shell'
import StaticFallback from '@/components/StaticFallback'
import type { FilmManifest } from '@/components/FilmScrubber'

/**
 * The page is server-rendered text wrapped in a client shell. The current
 * hanumanbeverages.com.kh home is a JS carousel with almost nothing for a
 * crawler to read; this one puts the whole narrative in the HTML whether the
 * film runs or not.
 */
function manifest(): FilmManifest {
  const file = path.join(process.cwd(), 'public', 'film', 'manifest.json')
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8')) as FilmManifest
  } catch {
    // the film is rendered out of band; without it the page still serves its
    // copy and its poster rather than failing the build
    return { frames: 0, width: 1600, height: 1000, pattern: '/film/%04d.jpg' }
  }
}

export default function Page() {
  return (
    <div id="top">
      <Shell story={<StaticFallback />} manifest={manifest()} />
    </div>
  )
}
