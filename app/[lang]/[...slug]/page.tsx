import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { dict } from '@/content'
import {
  LOCALES,
  OG_LOCALE,
  SERVICES,
  SITE_URL,
  expertiseOf,
  expertiseSlug,
  isLocale,
  path,
  segment,
  serviceOf,
  servicePath,
  serviceSlug,
  type ExpertiseKey,
  type Locale,
  type PageKey,
  type ServiceKey,
} from '@/lib/i18n'
import { alternates } from '@/lib/routes'
import { expertiseReady, visibleCases, visibleExpertises } from '@/lib/flags'
import { article, articles, topics } from '@/lib/blog'
import ArticleView from '@/components/pages/ArticleView'
import BlogList from '@/components/pages/BlogList'
import {
  AUTOMATION,
  BUSINESS_APPS,
  DELAYS,
  OPTIONS,
  PACKS,
  PLANS,
} from '@/lib/prices'
import CaseCard from '@/components/CaseCard'
import ContactForm from '@/components/ContactForm'
import FinalCta from '@/components/FinalCta'
import Heading from '@/components/Heading'
import Reveal from '@/components/Reveal'
import SectionBlock from '@/components/SectionBlock'
import Testimonials from '@/components/Testimonials'
import SplitHeading from '@/components/SplitHeading'
import VideoCard from '@/components/VideoCard'
import MaskReveal from '@/components/MaskReveal'
import CaseView from '@/components/pages/CaseView'
import ExpertiseView from '@/components/pages/ExpertiseView'
import ServiceView from '@/components/pages/ServiceView'
import SiteConfigurator from '@/components/SiteConfigurator'
import PricePaths from '@/components/PricePaths'
import TeamTerms from '@/components/TeamTerms'
import { priceGrid } from '@/components/PriceGrid'
import Simulator from '@/components/Simulator'
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
  | { kind: 'blog' }
  | { kind: 'article'; slug: string }
  | { kind: 'page'; page: 'pricing' | 'about' | 'stack' | 'contact' }
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
    // Une expertise sans contenu n'a pas d'adresse : voir `expertiseReady`.
    return key && expertiseReady(t.expertises[key]) ? { kind: 'expertise', key } : null
  }

  if (is('work')) {
    if (!next) return { kind: 'work' }
    const study = visibleCases(t.work.cases).find((c) => c.slug === next)
    return study ? { kind: 'case', slug: next } : null
  }

  if (is('blog')) {
    if (!next) return { kind: 'blog' }
    return { kind: 'article', slug: next }
  }

  if (next) return null
  if (is('pricing')) return { kind: 'page', page: 'pricing' }
  if (is('about')) return { kind: 'page', page: 'about' }
  if (is('stack')) return { kind: 'page', page: 'stack' }
  if (is('contact')) return { kind: 'page', page: 'contact' }
  if (is('legal')) return { kind: 'text', page: 'legal' }
  if (is('privacy')) return { kind: 'text', page: 'privacy' }
  return null
}

/**
 * Toutes les adresses du site, engendrees au build.
 *
 * Elle est asynchrone depuis que les articles en font partie : ils sont lus
 * sur le disque. L'export statique ne rend que ce qui est liste ici, donc une
 * page oubliee ne devient pas lente, elle devient un 404 : les deux articles
 * du blog manquaient, et c'est l'export qui l'a dit.
 */
export async function generateStaticParams() {
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
      'stack',
      'contact',
      'legal',
      'privacy',
    ]
    for (const key of simple) params.push({ lang, slug: [segment(lang, key)] })
    for (const key of SERVICES) {
      params.push({ lang, slug: [segment(lang, 'services'), serviceSlug(lang, key)] })
    }
    for (const key of visibleExpertises(t)) {
      params.push({ lang, slug: [segment(lang, 'expertises'), expertiseSlug(lang, key)] })
    }
    for (const study of visibleCases(t.work.cases)) {
      params.push({ lang, slug: [segment(lang, 'work'), study.slug] })
    }
    for (const item of await articles(lang)) {
      params.push({ lang, slug: [segment(lang, 'blog'), item.slug] })
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
  } else if (route.kind === 'blog') {
    title = t.meta.blog.title
    description = t.meta.blog.description
  } else if (route.kind === 'article') {
    const found = await article(lang, route.slug)
    if (!found) return {}
    title = `${found.title} · ${t.meta.siteName}`
    description = found.summary
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
      locale: OG_LOCALE[lang],
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
    const cases = visibleCases(t.work.cases)
    // Pas plus de trois videos, comme le demande le cahier, et seulement celles
    // qui ont ete fournies : une carte video sans video ne s'epingle pas.
    const films = cases.filter((study) => study.video).slice(0, 3)

    return (
      <>
        <Head locale={lang} title={t.work.title} lead={t.work.intro} />
        <section className="section">
          <div className="container">
            <div className="grid grid--3">
              {cases.map((study, i) => (
                <MaskReveal key={study.slug} delay={i * 90}>
                  <CaseCard locale={lang} study={study} />
                </MaskReveal>
              ))}
            </div>
          </div>
        </section>

        {films.map((study) => (
          <VideoCard
            key={study.slug}
            locale={lang}
            src={study.video}
            poster={study.shot}
            label={study.name}
          />
        ))}

        {/* les temoignages, fournis par le client ou rien */}
        <SectionBlock tone="peach">
          <Testimonials locale={lang} />
        </SectionBlock>

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
            </Reveal>
            <Reveal>
              <h2 className="legal__heading" style={{ marginTop: 'var(--s7)' }}>
                {t.founders.title}
              </h2>
              <div className="founders">
                {t.founders.people.map((person) => (
                  <article className="founder" key={person.name}>
                    {/* Sans photo, pas de cadre vide : la biographie prend
                        toute la largeur. */}
                    {person.photo ? (
                      <div className="founder__photo">
                        <Image src={person.photo} alt="" width={256} height={256} />
                      </div>
                    ) : null}
                    <div className="founder__text">
                      <h3 className="founder__name">{person.name}</h3>
                      <p className="founder__role">{person.role ?? <Tbd locale={lang} />}</p>
                      <p className="founder__bio">{person.bio ?? <Tbd locale={lang} />}</p>
                    </div>
                  </article>
                ))}
              </div>
            </Reveal>
          </div>
        </section>
        <FinalCta locale={lang} />
      </>
    )
  }

  if (route.kind === 'article') {
    const found = await article(lang, route.slug)
    if (!found) notFound()
    return <ArticleView locale={lang} article={found} />
  }

  if (route.kind === 'blog') {
    const [list, tags] = await Promise.all([articles(lang), topics(lang)])
    return (
      <>
        <Head locale={lang} title={t.blog.title} lead={t.blog.lead} />
        <section className="section">
          <div className="container">
            <BlogList
              locale={lang}
              articles={list}
              topics={tags}
              all={t.blog.all}
              readingTime={t.blog.readingTime}
              empty={t.blog.empty}
            />
          </div>
        </section>
        <FinalCta locale={lang} />
      </>
    )
  }

  if (route.kind === 'page' && route.page === 'pricing') {
    /**
     * Un panneau par besoin : l'estimateur du chemin, puis le detail de ses
     * prix. L'estimateur passe devant la grille parce que c'est lui qui repond
     * a la question posee ; la grille est la pour qui veut verifier le detail.
     */
    const panel = (key: ServiceKey) => (
      <>
        {key === 'sites' || key === 'automations' ? (
          <>
            <Reveal>
              <h3 className="paths__h">{t.pricing.estimate}</h3>
            </Reveal>
            <Reveal>
              {key === 'sites' ? (
                <SiteConfigurator locale={lang} />
              ) : (
                <Simulator locale={lang} />
              )}
            </Reveal>
          </>
        ) : null}

        <Reveal>
          <h3 className="paths__h paths__h--grid">{t.pricing.grid}</h3>
          <div className="service__prices">{priceGrid(lang, key)}</div>
          {key === 'sites' ? (
            <ul className="stack small muted service__conditions">
              {t.pricing.conditions.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          ) : null}
          <p className="small muted" style={{ marginTop: 'var(--s4)' }}>
            {t.pricing.disclaimer}
          </p>
        </Reveal>

        {/* Les engagements et les deux facons d'acheter : ils ne valent que
            pour une equipe dediee, donc ils ne s'affichent que la. */}
        {key === 'custom' ? <TeamTerms locale={lang} /> : null}

        <Reveal>
          <p className="paths__link small">
            <Link className="link-more" href={servicePath(lang, key)}>
              {t.map.services.children[key]}
            </Link>
          </p>
        </Reveal>
      </>
    )

    return (
      <>
        <Head locale={lang} title={t.pricing.title} lead={t.pricing.lead} />

        <SectionBlock tone="cream" id="tarifs">
          <PricePaths
            question={t.pricing.question}
            initial="sites"
            options={SERVICES.map((key) => ({
              key,
              name: t.map.services.children[key],
              desc: t.menu.services[key],
            }))}
            panels={Object.fromEntries(SERVICES.map((key) => [key, panel(key)]))}
          />
        </SectionBlock>

        <FinalCta locale={lang} />
      </>
    )
  }

  if (route.kind === 'page' && route.page === 'stack') {
    const stack = t.stack
    return (
      <>
        <Head locale={lang} title={stack.title} lead={stack.lead} />

        {/* ── ce que nous savons construire ─────────────────────────────── */}
        <SectionBlock tone="cream">
          <div className="stack">
            {stack.groups.map((group, i) => (
              <Reveal key={group.title} delay={i * 50}>
                <div className="stack__group">
                  <h2 className="stack__title">{group.title}</h2>
                  <p className="stack__note">{group.note}</p>
                  <ul className="stack__items">
                    {group.items.map((item) => (
                      <li className="tool" key={item.name}>
                        {item.logo ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            className="tool__logo"
                            src={item.logo}
                            alt=""
                            width={18}
                            height={18}
                          />
                        ) : null}
                        {item.name}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </SectionBlock>

        {/* ── combien sommes-nous : la mauvaise question ────────────────── */}
        <SectionBlock>
          <Reveal>
            <div className="section__head">
              <SplitHeading text={stack.capacity.title} />
              <p className="lead">{stack.capacity.lead}</p>
            </div>
          </Reveal>
          <ol className="facts">
            {stack.capacity.items.map((line, i) => (
              <Reveal key={line} delay={i * 60}>
                <li className="fact">
                  <span className="fact__n" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p className="fact__text">{line}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </SectionBlock>

        {/* ── ce que l'equipe a sous la main ────────────────────────────── */}
        <SectionBlock tone="peach">
          <Reveal>
            <div className="section__head">
              <SplitHeading text={stack.kit.title} />
            </div>
          </Reveal>
          <dl className="kit">
            {stack.kit.items.map((item, i) => (
              <Reveal key={item.label} delay={i * 50}>
                <div className="kit__row">
                  <dt className="kit__label">{item.label}</dt>
                  <dd className="kit__value">{item.value}</dd>
                </div>
              </Reveal>
            ))}
          </dl>
        </SectionBlock>

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
            <p className="lead">{text.intro}</p>
            {/* La date dit de quand parle la page. Sans elle, un avis legal ne
                vaut rien : le lecteur ne sait pas ce qu'il lit. */}
            {text.updated ? (
              <p className="small muted legal__date">{text.updated}</p>
            ) : (
              <p className="small legal__date">
                <Tbd locale={lang} what={t.words.updatedOn} />
              </p>
            )}

            {text.sections ? (
              text.sections.map((part) => (
                <section className="legal__part" key={part.heading}>
                  <h2 className="legal__heading">{part.heading}</h2>
                  {part.body?.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                  {/* Les faits sont une liste de definitions, pas des
                      paragraphes : un numero d'enregistrement se cherche a
                      l'oeil, il ne se lit pas dans une phrase. */}
                  {part.facts ? (
                    <dl className="legal__facts">
                      {part.facts.map((fact) => (
                        <div key={fact.label}>
                          <dt>{fact.label}</dt>
                          <dd>{fact.value ?? <Tbd locale={lang} />}</dd>
                        </div>
                      ))}
                    </dl>
                  ) : null}
                </section>
              ))
            ) : (
              <TbdBlock locale={lang} what={text.title.toLowerCase()} />
            )}

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
  const keys = kind === 'services' ? SERVICES : visibleExpertises(t)
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

/** Toute la grille, pour la page Tarifs. */
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
