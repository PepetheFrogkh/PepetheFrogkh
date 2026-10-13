import Link from 'next/link'
import { dict, type CaseStudy } from '@/content'
import { path, type Locale } from '@/lib/i18n'
import CaseCard from '@/components/CaseCard'
import Counter from '@/components/Counter'
import FinalCta from '@/components/FinalCta'
import Heading from '@/components/Heading'
import Reveal from '@/components/Reveal'
import { Tbd, TbdBlock } from '@/components/Tbd'

/**
 * Le gabarit d'une etude de cas : onze blocs, du besoin au resultat verifie.
 *
 * Comme chez TechFlow, le resultat s'annonce des l'en-tete. Ici, seuls des
 * chiffres verifies y figurent : tant qu'ils ne sont pas fournis, l'en-tete
 * porte l'emplacement.
 */
export default function CaseView({ locale, study }: { locale: Locale; study: CaseStudy }) {
  const t = dict(locale)
  const labels = t.caseLabels
  const others = t.work.cases.filter((c) => c.slug !== study.slug)

  return (
    <>
      {/* 1 · en-tete : client, secteur, pays, resultat cle en grand */}
      <section className="hero">
        <div className="container measure">
          <div className="row" style={{ gap: 8 }}>
            <span className="tag">{study.sector}</span>
            <span className="tag">{study.country}</span>
          </div>
          <Heading className="hero__title" text={study.name} as="h1" animate />
          <p className="lead">{study.summary}</p>
          <p className="lead" style={{ color: 'var(--ink)', fontWeight: 700 }}>
            {t.work.resultLabel} : {study.result ?? <Tbd locale={locale} />}
          </p>
        </div>
      </section>

      {/* 2 · la grande capture */}
      <section className="section">
        <div className="container">
          <Reveal>
            {study.shot ? (
              <img
                src={study.shot}
                alt={study.name}
                loading="lazy"
                style={{ borderRadius: 'var(--r-image)', width: '100%' }}
              />
            ) : (
              <TbdBlock
                locale={locale}
                what={locale === 'fr' ? 'capture du projet' : 'project screenshot'}
              />
            )}
          </Reveal>
        </div>
      </section>

      {/* 3 et 4 · le contexte, puis le besoin */}
      <section className="section section--cream">
        <div className="container grid grid--2" style={{ gap: 'var(--s8)' }}>
          <Reveal>
            <h2>{labels.context}</h2>
            <p className="lead" style={{ marginTop: 'var(--s2)' }}>
              {study.context ?? <Tbd locale={locale} />}
            </p>
          </Reveal>
          <Reveal delay={80}>
            <h2>{labels.need}</h2>
            <p className="lead" style={{ marginTop: 'var(--s2)' }}>
              {study.need ?? <Tbd locale={locale} />}
            </p>
          </Reveal>
        </div>
      </section>

      {/* 5 · ce qu'on a construit */}
      <section className="section">
        <div className="container">
          <Reveal>
            <div className="section__head">
              <h2>{labels.built}</h2>
            </div>
            <div className="grid grid--3">
              {(study.built ?? [null, null, null]).map((item, i) => (
                <div className="card" key={i}>
                  {item ? <p style={{ margin: 0 }}>{item}</p> : <Tbd locale={locale} />}
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* 6 · les resultats : chiffres verifies, avant et apres */}
      <section className="section section--cream">
        <div className="container">
          <Reveal>
            <div className="section__head">
              <h2>{labels.results}</h2>
            </div>
            {study.results ? (
              <div className="grid grid--3">
                {study.results.map((figure) => (
                  <Counter key={figure.caption} figure={figure} />
                ))}
              </div>
            ) : (
              <TbdBlock
                locale={locale}
                what={locale === 'fr' ? 'chiffres vérifiés' : 'verified figures'}
              />
            )}
          </Reveal>
        </div>
      </section>

      {/* 7 · la citation, avec l'accord ecrit du client */}
      <section className="section">
        <div className="container measure measure--narrow">
          <Reveal>
            <h2>{labels.quote}</h2>
            {study.quote ? (
              <blockquote
                className="card__quote lead"
                style={{ margin: 'var(--s3) 0 0', padding: 0 }}
              >
                {study.quote.text}
                <footer className="small muted" style={{ marginTop: 'var(--s2)' }}>
                  {study.quote.author}
                </footer>
              </blockquote>
            ) : (
              <div style={{ marginTop: 'var(--s3)' }}>
                <Tbd locale={locale} />
              </div>
            )}
          </Reveal>
        </div>
      </section>

      {/* 8 · autres projets */}
      <section className="section section--cream">
        <div className="container">
          <Reveal>
            <div className="section__head">
              <h2>{t.work.otherProjects}</h2>
            </div>
            <div className="grid grid--3">
              {others.map((other) => (
                <CaseCard key={other.slug} locale={locale} study={other} />
              ))}
            </div>
            <p className="small" style={{ marginTop: 'var(--s4)' }}>
              <Link className="link-more" href={path(locale, 'work')}>
                {t.work.title}
              </Link>
            </p>
          </Reveal>
        </div>
      </section>

      {/* 9 · dernier appel */}
      <FinalCta locale={locale} />
    </>
  )
}
