import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { dict } from '@/content'
import type { Article } from '@/lib/blog'
import { SITE_URL, path, type Locale } from '@/lib/i18n'
import FinalCta from '@/components/FinalCta'
import SplitHeading from '@/components/SplitHeading'

/**
 * Un article.
 *
 * Le corps est du Markdown, rendu par le serveur : l'article est une page
 * statique, lisible sans JavaScript, et il n'y a pas d'editeur a maintenir.
 *
 * Le partage n'utilise aucun script tiers : ce sont des liens, et un lien ne
 * depose pas de traceur.
 */
export default function ArticleView({
  locale,
  article,
}: {
  locale: Locale
  article: Article
}) {
  const t = dict(locale)
  const url = `${SITE_URL}/${locale}/blog/${article.slug}`

  return (
    <>
      <section className="hero hero--service">
        <div className="container measure">
          <span className="eyebrow">{t.map.blog}</span>
          <SplitHeading text={article.title} as="h1" className="hero__title" />
          <p className="blog__meta">
            <time dateTime={article.date}>{article.date}</time>
            <span>
              {article.minutes} {t.blog.readingTime}
            </span>
          </p>
          {article.summary ? <p className="lead">{article.summary}</p> : null}
        </div>
      </section>

      <section className="section">
        <div className="container measure measure--narrow prose">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{article.body}</ReactMarkdown>

          <p className="blog__share small">
            <span className="muted">{t.blog.share} </span>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
              rel="noopener noreferrer"
              target="_blank"
            >
              LinkedIn
            </a>
            <a
              href={`mailto:?subject=${encodeURIComponent(article.title)}&body=${encodeURIComponent(url)}`}
            >
              Email
            </a>
          </p>

          <p className="small" style={{ marginTop: 'var(--s5)' }}>
            <Link className="link-more" href={path(locale, 'blog')}>
              {t.map.blog}
            </Link>
          </p>
        </div>
      </section>

      <FinalCta locale={locale} />
    </>
  )
}
