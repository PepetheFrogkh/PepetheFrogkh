import { dict, type SituationPage } from '@/content'
import type { Locale } from '@/lib/i18n'
import CaseCard from '@/components/CaseCard'
import Cta from '@/components/Cta'
import Heading from '@/components/Heading'
import Measures from '@/components/Measures'
import Reveal from '@/components/Reveal'
import FinalCta from '@/components/FinalCta'
import { Tbd, TbdBlock } from '@/components/Tbd'

/**
 * Le gabarit des pages situation : neuf blocs, du probleme du client au
 * resultat mesure. Les quatre pages partagent ce fichier ; seuls les textes
 * de `content/` changent.
 */
export default function SituationView({
  locale,
  page,
}: {
  locale: Locale
  page: SituationPage
}) {
  const t = dict(locale)
  const labels = t.situationLabels
  const proof = page.proof ? t.work.cases.find((c) => c.slug === page.proof) : undefined

  return (
    <>
      {/* 1 · en-tete : la phrase du client, puis le titre */}
      <section className="hero">
        <div className="container hero__grid">
          <div>
            <p className="card__quote lead" style={{ marginBottom: 'var(--s3)' }}>
            {page.quote.startsWith('[') ? (
              <Tbd locale={locale} what={locale === 'fr' ? 'phrase du client' : 'client sentence'} />
            ) : (
              page.quote
            )}
          </p>
            <Heading text={page.title} as="h1" animate />
            <div className="row hero__actions">
              <Cta
                locale={locale}
                href="diagnostic"
                label={t.hero.primary.label}
                event="diagnostic_click"
              />
              <Cta
                locale={locale}
                href="booking"
                label={t.finalCta.secondary.label}
                variant="secondary"
                event="book_call_click"
              />
            </div>
          </div>
          <TbdBlock
            locale={locale}
            what={locale === 'fr' ? 'visuel de la situation' : 'situation visual'}
          />
        </div>
      </section>

      {/* 2 · le probleme, dans les mots du client */}
      <section className="section">
        <div className="container measure measure--narrow">
          <Reveal>
            <h2>{labels.problem}</h2>
            <div className="stack" style={{ marginTop: 'var(--s3)' }}>
              {page.problem.map((line, i) => (
                <p className="lead" key={i} style={{ margin: 0 }}>
                  {line.startsWith('[') ? <Tbd locale={locale} /> : line}
                </p>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* 3 · ce qu'on fait : trois etapes numerotees */}
      <section className="section section--cream">
        <div className="container">
          <Reveal>
            <div className="section__head">
              <h2>{labels.steps}</h2>
            </div>
            <div className="grid grid--3">
              {page.steps.map((step, i) => (
                <div className="card" key={i}>
                  <div className="card__num">{String(i + 1).padStart(2, '0')}</div>
                  <p style={{ marginTop: 'var(--s2)', marginBottom: 0 }}>{step}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* 4 · ce que vous mesurez : la promesse de resultat */}
      <section className="section">
        <div className="container">
          <Reveal>
            <div className="section__head">
              <h2>{labels.measures}</h2>
            </div>
            <Measures locale={locale} measures={page.measures} labels={labels} />
          </Reveal>
        </div>
      </section>

      {/* 5 · la preuve */}
      <section className="section section--cream">
        <div className="container">
          <Reveal>
            <div className="section__head">
              <h2>{labels.proof}</h2>
            </div>
            {proof ? (
              <div className="grid grid--3">
                <CaseCard locale={locale} study={proof} />
              </div>
            ) : (
              <TbdBlock
                locale={locale}
                what={locale === 'fr' ? 'étude de cas' : 'case study'}
              />
            )}
          </Reveal>
        </div>
      </section>

      {/* 6 · le prix */}
      <section className="section">
        <div className="container">
          <Reveal>
            <h2>{labels.price}</h2>
            <p className="lead" style={{ marginTop: 'var(--s2)' }}>
              {page.price.includes('[') ? (
                <>
                  {page.price.split('[')[0]}
                  <Tbd locale={locale} />
                </>
              ) : (
                page.price
              )}
            </p>
          </Reveal>
        </div>
      </section>

      {/* 7 · l'appel */}
      <FinalCta locale={locale} />
    </>
  )
}
