'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import type { Article } from '@/lib/blog'
import type { Locale } from '@/lib/i18n'
import Reveal from '@/components/Reveal'

/**
 * La liste des articles, avec ses filtres par theme.
 *
 * Le filtre est dans le navigateur et non dans l'adresse : il n'y a qu'une
 * page d'articles, et une adresse par filtre creerait des pages a indexer qui
 * disent toutes la meme chose. Les articles sont tous dans le HTML, donc la
 * liste complete se lit sans JavaScript.
 */
export default function BlogList({
  locale,
  articles,
  topics,
  all,
  readingTime,
  empty,
}: {
  locale: Locale
  articles: Article[]
  topics: string[]
  all: string
  readingTime: string
  empty: string
}) {
  const [topic, setTopic] = useState<string | null>(null)
  const shown = useMemo(
    () => (topic ? articles.filter((a) => a.tags.includes(topic)) : articles),
    [articles, topic],
  )

  if (articles.length === 0) {
    return <p className="lead">{empty}</p>
  }

  return (
    <>
      {topics.length > 0 ? (
        <div className="row blog__filters" role="group">
          <button
            className="tag"
            type="button"
            aria-pressed={topic === null}
            onClick={() => setTopic(null)}
          >
            {all}
          </button>
          {topics.map((item) => (
            <button
              className="tag"
              type="button"
              key={item}
              aria-pressed={topic === item}
              onClick={() => setTopic(item)}
            >
              {item}
            </button>
          ))}
        </div>
      ) : null}

      <div className="grid grid--3 blog__list">
        {shown.map((item, i) => (
          <Reveal key={item.slug} delay={i * 80}>
            <Link className="card card--link" href={`/${locale}/blog/${item.slug}`}>
              <span className="blog__meta">
                <time dateTime={item.date}>{item.date}</time>
                <span>
                  {item.minutes} {readingTime}
                </span>
              </span>
              <h3 className="card__title">{item.title}</h3>
              <p className="muted small">{item.summary}</p>
              <span className="row blog__tags">
                {item.tags.map((tag) => (
                  <span className="tag" key={tag}>
                    {tag}
                  </span>
                ))}
              </span>
            </Link>
          </Reveal>
        ))}
      </div>
    </>
  )
}
