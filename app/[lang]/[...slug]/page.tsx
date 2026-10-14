import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { dict } from '@/content'
import {
  EXPERTISES,
  LOCALES,
  SERVICES,
  SITE_URL,
  expertiseOf,
  expertiseSlug,
  isLocale,
  path,
  segment,
  serviceOf,
  serviceSlug,
  type ExpertiseKey,
  type Locale,
  type PageKey,
  type ServiceKey,
} from '@/lib/i18n'
import { alternates } from '@/lib/routes'
import { visibleCases } from '@/lib/flags'
import CaseCard from '@/components/CaseCard'
import ContactForm from '@/components/ContactForm'
import FinalCta from '@/components/FinalCta'
import Heading from '@/components/Heading'
import Reveal from '@/components/Reveal'
import CaseView from '@/components/pages/CaseView'
import ExpertiseView from '@/components/pages/ExpertiseView'
import ServiceView from '@/components/pages/ServiceView'
import { Tbd, TbdBlock } from '@/components/Tbd'

/**
 * Toutes les pages hors accueil.
 *
 * Les adresses ne sont pas les memes dans les deux langues :
 * /fr/services/sites-web et /en/services/websites sont la meme page. Un seul
 * segment attrape-tout les resout contre la table de `lib/i18n`, pour que les
 * adresses, le selecteur de langue, les hreflang et le sitemap viennent d'une
 * seule source.
 *
 * Les pages de service et d'expertise n'ont pas encore leur contenu : elles
 * affichent leur nom et l'emplacement de ce qui manque, plutot qu'un
 * remplissage invente. Leurs gabarits arrivent aux etapes 7 et 9.
 */

type Route =
  | { kind: 'services' }
  | { kind: 'service'; key: ServiceKey }
  | { kind: 'expertises' }
  | { kind: 'expertise'; key: ExpertiseKey }
  | { kind: 'work' }
  | { kind: 'case'; slug: string }
  | { kind: 'page'; page: 'pricing' | 'blog' | 'about' | 'contact' }
  | { kind: 'text'; page: 'legal' | 'privacy' }

function match(locale: Locale, slug: string[]): Route | null {
  const [head, next, ...extra] = slug
  if (!head || extra.length > 0) return null

  const is = (key: PageKey) => head === segment(locale, key)
  const t = dict(locale)

  if (is('services')) {
    if (!next) return { kind: 'services' }
    const key = serviceOf(locale, next)
    return key ? { kind: 'service', key } : null
  }

  if (is('expertises')) {
    if (!next) return { kind: 'expertises' }
    const key = expertiseOf(locale, next)
    return key ? { kind: 'expertise', key } : null
  }

  if (is('work')) {
    if (!next) return { kind: 'work' }
    const study = visibleCases(t.work.cases).find((c) => c.slug === next)
    return study ? { kind: 'case', slug: next } : null
  }

  if (next) return null
  if (is('pricing')) return { kind: 'page', page: 'pricing' }
  if (is('blog')) return { kind: 'page', page: 'blog' }
  if (is('about')) return { kind: 'page', page: 'about' }
  if (is('contact')) return { kind: 'page', page: 'contact' }
  if (is('legal')) return { kind: 'text', page: 'legal' }
  if (is('privacy')) return { kind: 'text', page: 'privacy' }
  return null
}

export function generateStaticParams() {
  const params: { lang: Locale; slug: string[] }[] = []
  for (const lang of LOCALES) {
    const t = dict(lang)
    const simple: PageKey[] = [
      'services',
      'expertises',
      'work',
      'pricing',
      'blog',
      'about',
      'contact',
      'legal',
      'privacy',
    ]
    for (const key of simple) params.push({ lang, slug: [segment(lang, key)] })
    for (const key of SERVICES) {
      params.push({ lang, slug: [segment(lang, 'services'), serviceSlug(lang, key)] })
    }
    for (const key of EXPERTISES) {
      params.push({ lang, slug: [segment(lang, 'expertises'), expertiseSlug(lang, key)] })
    }
    for (const study of visibleCases(t.work.cases)) {
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
  let title = t.meta.services.title
  let description = t.meta.services.description

  if (route.kind === 'service') {
    title = `${t.map.services.children[route.key]} · ${t.meta.siteName}`
    description = t.meta.services.description
  } else if (route.kind === 'expertises') {
    title = t.meta.expertises.title
    description = t.meta.expertises.description
  } else if (route.kind === 'expertise') {
    title = `${t.map.expertises.children[route.key]} · ${t.meta.siteName}`
    description = t.meta.expertises.description
  } else if (route.kind === 'work') {
    title = t.meta.work.title
    description = t.meta.work.description
  } else if (route.kind === 'case') {
    const study = visibleCases(t.work.cases).find((c) => c.slug === route.slug)!
    title = `${study.name} · ${t.meta.siteName}`
    description = study.summary
  } else if (route.kind === 'page' || route.kind === 'text') {
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

  if (route.kind === 'case') {
    const study = visibleCases(t.work.cases).find((c) => c.slug === route.slug)!
    return <CaseView locale={lang} study={study} />
  }

  if (route.kind === 'service') {
    return <ServiceView locale={lang} service={route.key} page={t.services[route.key]} />
  }

  if (route.kind === 'expertise') {
    return <ExpertiseView locale={lang} expertise={route.key} page={t.expertises[route.key]} />
  }

  if (route.kind === 'work') {
    return (
      <>
        <Head locale={lang} title={t.work.title} lead={t.work.intro} />
        <section className="section">
          <div className="container">
            <div className="grid grid--3">
              {visibleCases(t.work.cases).map((study) => (
                <CaseCard key={study.slug} locale={lang} study={study} />
              ))}
            </div>
          </div>
        </section>
        <FinalCta locale={lang} />
      </>
    )
  }

  if (route.kind === 'page' && route.page === 'about') {
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

  if (route.kind === 'page' && route.page === 'contact') {
    return (
      <>
        <Head locale={lang} title={t.contact.title} lead={t.contact.body} />
        <section className="section">
          <div className="container measure measure--narrow">
            <Reveal>
              <div className="card">
                <ContactForm locale={lang} />
              </div>
            </Reveal>
          </div>
        </section>
      </>
    )
  }

  if (route.kind === 'text') {
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

  // ── les pages dont le contenu n'est pas encore ecrit ─────────────────────
  // Elles existent, elles sont dans le menu, dans le sitemap et dans les
  // hreflang, et elles disent ce qui leur manque. Leurs gabarits arrivent aux
  // etapes suivantes.
  const title =
    route.kind === 'services'
      ? t.map.services.title
      : route.kind === 'expertises'
        ? t.map.expertises.title
        : t.map[route.page as 'pricing' | 'blog' | 'contact']

  return (
    <>
      <Head locale={lang} title={title} />
      <section className="section">
        <div className="container">
          {route.kind === 'services' ? (
            <Index locale={lang} kind="services" />
          ) : route.kind === 'expertises' ? (
            <Index locale={lang} kind="expertises" />
          ) : (
            <Reveal>
              <TbdBlock locale={lang} what={title.toLowerCase()} />
            </Reveal>
          )}
        </div>
      </section>
      <FinalCta locale={lang} />
    </>
  )
}

/** La liste des services, ou celle des expertises. */
function Index({ locale, kind }: { locale: Locale; kind: 'services' | 'expertises' }) {
  const t = dict(locale)
  const keys = kind === 'services' ? SERVICES : EXPERTISES
  const children = t.map[kind].children as Record<string, string>
  const slugOf = (key: string) =>
    kind === 'services'
      ? serviceSlug(locale, key as ServiceKey)
      : expertiseSlug(locale, key as ExpertiseKey)

  return (
    <div className="grid grid--3">
      {keys.map((key) => (
        <Link
          className="card card--link"
          href={path(locale, kind, slugOf(key))}
          key={key}
        >
          <h2 className="card__title">{children[key]}</h2>
          <span className="link-more">{t.work.more}</span>
        </Link>
      ))}
    </div>
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
