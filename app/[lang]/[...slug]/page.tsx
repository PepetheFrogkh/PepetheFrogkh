import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { dict } from '@/content'
import {
  LOCALES,
  SITE_URL,
  isLocale,
  path,
  segment,
  type Locale,
  type PageKey,
} from '@/lib/i18n'
import { alternates } from '@/lib/routes'
import CaseCard from '@/components/CaseCard'
import ConfiguratorSlot from '@/components/ConfiguratorSlot'
import DiagnosticForm from '@/components/DiagnosticForm'
import FinalCta from '@/components/FinalCta'
import Heading from '@/components/Heading'
import Reveal from '@/components/Reveal'
import SituationList from '@/components/SituationList'
import CaseView from '@/components/pages/CaseView'
import SituationView from '@/components/pages/SituationView'
import { Tbd } from '@/components/Tbd'

/**
 * Toutes les pages hors accueil.
 *
 * Les adresses ne sont pas les memes dans les deux langues : /fr/realisations
 * et /en/work sont la meme page. Un seul segment attrape-tout les resout
 * contre la table de `lib/i18n`, pour que les adresses, le selecteur de
 * langue et les hreflang viennent d'une seule source.
 */

type Route =
  | { kind: 'situations' }
  | { kind: 'situation'; slug: string }
  | { kind: 'work' }
  | { kind: 'case'; slug: string }
  | { kind: 'method' }
  | { kind: 'about' }
  | { kind: 'diagnostic' }
  | { kind: 'text'; page: 'legal' | 'privacy' }

function match(locale: Locale, slug: string[]): Route | null {
  const [head, next, ...extra] = slug
  if (!head || extra.length > 0) return null

  const is = (key: PageKey) => head === segment(locale, key)
  const t = dict(locale)

  if (is('situations')) {
    if (!next) return { kind: 'situations' }
    const page = t.situationPages.find((p) => p.slug === next)
    return page ? { kind: 'situation', slug: next } : null
  }
  if (is('work')) {
    if (!next) return { kind: 'work' }
    const study = t.work.cases.find((c) => c.slug === next)
    return study ? { kind: 'case', slug: next } : null
  }
  if (!next && is('method')) return { kind: 'method' }
  if (!next && is('about')) return { kind: 'about' }
  if (!next && is('diagnostic')) return { kind: 'diagnostic' }
  if (!next && is('legal')) return { kind: 'text', page: 'legal' }
  if (!next && is('privacy')) return { kind: 'text', page: 'privacy' }
  return null
}

export function generateStaticParams() {
  const params: { lang: Locale; slug: string[] }[] = []
  for (const lang of LOCALES) {
    const t = dict(lang)
    const simple: PageKey[] = ['situations', 'work', 'method', 'about', 'diagnostic', 'legal', 'privacy']
    for (const key of simple) params.push({ lang, slug: [segment(lang, key)] })
    for (const page of t.situationPages) {
      params.push({ lang, slug: [segment(lang, 'situations'), page.slug] })
    }
    for (const study of t.work.cases) {
      params.push({ lang, slug: [segment(lang, 'work'), study.slug] })
    }
  }
  return params
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string[] }>
}): Promise<Metadata> {
  const { lang, slug } = await params
  if (!isLocale(lang)) return {}
  const route = match(lang, slug)
  if (!route) return {}
  const t = dict(lang)
  const here = '/' + [lang, ...slug].join('/')

  // un titre et une description propres a chaque page et a chaque langue
  let title = t.meta.situations.title
  let description = t.meta.situations.description

  if (route.kind === 'situation') {
    const page = t.situationPages.find((p) => p.slug === route.slug)!
    title = `${page.title} · ${t.meta.siteName}`
    description = page.steps.join(' ')
  } else if (route.kind === 'work') {
    title = t.meta.work.title
    description = t.meta.work.description
  } else if (route.kind === 'case') {
    const study = t.work.cases.find((c) => c.slug === route.slug)!
    title = `${study.name} · ${t.meta.siteName}`
    description = study.summary
  } else if (route.kind === 'method') {
    title = t.meta.method.title
    description = t.meta.method.description
  } else if (route.kind === 'about') {
    title = t.meta.about.title
    description = t.meta.about.description
  } else if (route.kind === 'diagnostic') {
    title = t.meta.diagnostic.title
    description = t.meta.diagnostic.description
  } else if (route.kind === 'text') {
    title = t.meta[route.page].title
    description = t.meta[route.page].description
  }

  return {
    title,
    description,
    alternates: alternates(here),
    openGraph: {
      siteName: t.meta.siteName,
      title,
      description,
      locale: lang === 'fr' ? 'fr_FR' : 'en_GB',
      type: 'website',
      url: SITE_URL + here,
    },
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string; slug: string[] }>
}) {
  const { lang, slug } = await params
  if (!isLocale(lang)) notFound()
  const route = match(lang, slug)
  if (!route) notFound()
  const t = dict(lang)

  if (route.kind === 'situation') {
    const page = t.situationPages.find((p) => p.slug === route.slug)!
    return <SituationView locale={lang} page={page} />
  }

  if (route.kind === 'case') {
    const study = t.work.cases.find((c) => c.slug === route.slug)!
    return <CaseView locale={lang} study={study} />
  }

  if (route.kind === 'situations') {
    return (
      <>
        <Head locale={lang} title={t.situations.title} />
        <section className="section">
          <div className="container">
            <SituationList locale={lang} />
          </div>
        </section>
        <FinalCta locale={lang} />
      </>
    )
  }

  if (route.kind === 'work') {
    return (
      <>
        <Head locale={lang} title={t.work.title} lead={t.work.intro} />
        <section className="section">
          <div className="container">
            <div className="row" style={{ gap: 8, marginBottom: 'var(--s5)' }}>
              <span className="tag" style={{ background: 'var(--peach)', color: 'var(--ink)' }}>
                {t.work.all}
              </span>
              {t.work.filters.map((filter) => (
                <span className="tag" key={filter}>
                  {filter}
                </span>
              ))}
            </div>
            <div className="grid grid--3">
              {t.work.cases.map((study) => (
                <CaseCard key={study.slug} locale={lang} study={study} />
              ))}
            </div>
          </div>
        </section>
        <FinalCta locale={lang} />
      </>
    )
  }

  if (route.kind === 'method') {
    return (
      <>
        <Head locale={lang} title={t.method.title} lead={t.method.intro} />
        <section className="section">
          <div className="container">
            <ol className="steps" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {t.method.steps.map((step) => (
                <li className="step" key={step.title}>
                  <div className="step__title">{step.title}</div>
                  <p className="small muted" style={{ marginTop: 8 }}>
                    {step.body ?? <Tbd locale={lang} />}
                  </p>
                  {/* une demo a chaque etape, comme le demande le wireframe */}
                  <div className="step__demo">
                    {step.demo ? (
                      <img src={step.demo} alt={step.title} loading="lazy" />
                    ) : (
                      <Tbd locale={lang} what={lang === 'fr' ? 'démo' : 'demo'} />
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>
        <FinalCta locale={lang} />
      </>
    )
  }

  if (route.kind === 'about') {
    return (
      <>
        <Head locale={lang} title={t.about.title} />
        <section className="section">
          <div className="container measure measure--narrow">
            <Reveal>
              <p className="lead">{t.about.body ?? <Tbd locale={lang} />}</p>
              <div className="grid grid--2" style={{ marginTop: 'var(--s6)' }}>
                {t.founders.people.map((person) => (
                  <div className="card" key={person.name}>
                    <h3>{person.name}</h3>
                    <p className="muted small" style={{ marginTop: 8, marginBottom: 0 }}>
                      {person.role ?? <Tbd locale={lang} />}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>
        <FinalCta locale={lang} />
      </>
    )
  }

  if (route.kind === 'diagnostic') {
    return (
      <>
        <Head locale={lang} title={t.diagnostic.title} lead={t.diagnostic.body} />
        <section className="section">
          <div className="container grid grid--2" style={{ gap: 'var(--s8)', alignItems: 'start' }}>
            <Reveal>
              <div className="card">
                <DiagnosticForm locale={lang} />
              </div>
            </Reveal>
            <Reveal delay={80}>
              <div className="card">
                <div className="small" style={{ fontWeight: 700 }}>
                  {t.diagnostic.preview.title}
                </div>
                <ul className="stack" style={{ marginTop: 'var(--s2)', paddingLeft: '1.1rem' }}>
                  {t.diagnostic.preview.lines.map((line) => (
                    <li key={line} className="muted">
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
              <div style={{ marginTop: 'var(--s3)' }}>
                <ConfiguratorSlot locale={lang} />
              </div>
            </Reveal>
          </div>
        </section>
      </>
    )
  }

  const text = t[route.page]
  return (
    <>
      <Head locale={lang} title={text.title} />
      <section className="section">
        <div className="container measure measure--narrow">
          <p className="lead">{text.body ?? <Tbd locale={lang} />}</p>
          <p className="small" style={{ marginTop: 'var(--s5)' }}>
            <Link className="link-more" href={path(lang, 'home')}>
              Kuiper Studio
            </Link>
          </p>
        </div>
      </section>
    </>
  )
}

/** L'en-tete commune des pages secondaires. */
function Head({ locale, title, lead }: { locale: Locale; title: string; lead?: string }) {
  return (
    <section className="hero" style={{ paddingBottom: 'var(--s9)' }}>
      <div className="container measure">
        <span className="eyebrow">{dict(locale).hero.eyebrow}</span>
        <Heading className="hero__title" text={title} as="h1" animate />
        {lead ? <p className="lead">{lead}</p> : null}
      </div>
    </section>
  )
}
