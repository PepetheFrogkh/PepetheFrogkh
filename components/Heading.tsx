import type { ElementType } from 'react'

/**
 * Un titre, avec le mot entre asterisques en italique orange terre.
 *
 * Quand `animate` est vrai, les mots apparaissent un par un, du flou au net,
 * a 60 ms d'intervalle. L'animation est en CSS pure et les delais sont poses
 * ici : le titre est donc rendu par le serveur, lisible sans JavaScript, et
 * deja net si le visiteur reduit les animations.
 */
export default function Heading({
  text,
  as: Tag = 'h2',
  animate = false,
  className,
  id,
}: {
  text: string
  as?: ElementType
  animate?: boolean
  className?: string
  id?: string
}) {
  // « Ameliorez l'experience. *Mesurez-la.* » → segments accentues ou non
  const segments = text.split(/(\*[^*]+\*)/).filter(Boolean)
  let word = 0

  return (
    <Tag className={className} id={id}>
      {segments.map((segment, s) => {
        const accent = segment.startsWith('*') && segment.endsWith('*')
        const body = accent ? segment.slice(1, -1) : segment
        const words = body.split(/(\s+)/)

        return (
          <span key={s} className={accent ? 'accent' : undefined}>
            {words.map((piece, i) => {
              if (/^\s+$/.test(piece)) return piece
              if (!animate) return <span key={i}>{piece}</span>
              const delay = word++ * 60
              return (
                <span key={i} className="word" style={{ animationDelay: `${delay}ms` }}>
                  {piece}
                </span>
              )
            })}
          </span>
        )
      })}
    </Tag>
  )
}
