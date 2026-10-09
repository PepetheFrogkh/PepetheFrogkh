import Shell from '@/components/Shell'
import StaticFallback from '@/components/StaticFallback'

/**
 * The page is server-rendered text wrapped in a client shell. The current
 * hanumanbeverages.com.kh home is a JS carousel with almost nothing for a
 * crawler to read; this one puts the whole narrative in the HTML whether the
 * canvas runs or not.
 */
export default function Page() {
  return (
    <div id="top">
      <Shell story={<StaticFallback />} />
    </div>
  )
}
