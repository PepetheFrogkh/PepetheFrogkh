import Link from 'next/link'
import { dict } from '@/content'
import type { ServicePage } from '@/content'
import { path, servicePath, type Locale, type ServiceKey } from '@/lib/i18n'
import { visibleCases } from '@/lib/flags'
import CaseCard from '@/components/CaseCard'
import SiteConfigurator from '@/components/SiteConfigurator'
import Simulator from '@/components/Simulator'
import Faq from '@/components/Faq'
import FinalCta from '@/components/FinalCta'
import { priceGrid } from '@/components/PriceGrid'
import Reveal from '@/components/Reveal'
import SectionBlock from '@/components/SectionBlock'
import SplitHeading from '@/components/SplitHeading'

/**
 * Le gabarit d'une page de service.
 *
 * « Le probleme » et « Ce que nous livrons » vivaient cote a cote dans un seul
 * bloc, sous deux `h2` de meme taille : on lisait une seule zone, et la
 * section des prix qui suivait paraissait detachee de rien. Ils sont
 * maintenant deux blocs distincts, avec deux formes distinctes : le probleme
 * en cartes a filet orange sur peche, ce qu'on livre en liste cochee. Ce sont
 * les memes formes que sur les pages Expertises, pour que le site ait une
 * seule grammaire.
 *
 * Les prix viennent apres, et dans cet ordre : l'estimateur du service quand
 * il en a un, puis le detail de la grille en dessous. C'est l'estimateur qui
 * repond a la question du visiteur ; la grille est la pour verifier.
 *
 * Un bloc sans contenu ne s'affiche pas. Ce qui manque reste releve par
 * `scripts/trous.mjs`.
 */
export default function ServiceView({
  locale,
  service,
  page,
}: {
  locale: Locale
  service: ServiceKey
  page: ServicePage
}) {
  const t = dict(locale)
  const labels = t.serviceLabels
  const money = t.pricing
  const proof = page.proof
    ? visibleCases(t.work.cases).find((c) => c.slug === page.proof)
    : undefined

  /**
   * L'estimateur du service, quand il en a un.
   *
   * Le simulateur de flux vivait seulement sur la page Tarifs : quelqu'un qui
   * lisait la page Automatisations devait la quitter pour chiffrer un flux. Il
   * est maintenant la ou il sert.
   */
  const estimator =
    service === 'sites' ? (
      <SiteConfigurator locale={locale} />
    ) : service === 'automations' ? (
      <Simulator locale={locale} />
    ) : null

  return (
    <>
      <section className="hero hero--service">
        <div className="container measure">
          <span className="eyebrow">{t.map.services.title}</span>
          <SplitHeading text={page.title} as="h1" className="hero__title" />
          {page.lead ? <p className="lead">{page.lead}</p> : null}
        </div>
      </section>

      {/* ── le probleme : les phrases ou le visiteur doit se reconnaitre ── */}
      {page.problem ? (
        <SectionBlock tone="peach">
          <Reveal>
            <div className="section__head">
              <SplitHeading text={labels.problem} />
            </div>
          </Reveal>
          <ul className="pains">
            {page.problem.map((line, i) => (
              <Reveal key={line} delay={i * 60}>
                <li className="pain">{line}</li>
              </Reveal>
            ))}
          </ul>
        </SectionBlock>
      ) : null}

      {/* ── ce que nous livrons : la reponse, cochee ────────────────────── */}
      {page.delivers ? (
        <SectionBlock>
          <Reveal>
            <div className="section__head">
              <SplitHeading text={labels.delivers} />
            </div>
          </Reveal>
          <ul className="offers">
            {page.delivers.map((line, i) => (
              <Reveal key={line} delay={i * 50}>
                <li className="offer">
                  <svg
                    className="offer__tick"
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="m4 10.5 4 4 8-9" />
                  </svg>
                  <span>{line}</span>
                </li>
              </Reveal>
            ))}
          </ul>
        </SectionBlock>
      ) : null}

      {/* ── les delais ─────────────────────────────────────────────────── */}
      {page.delays ? (
        <SectionBlock tone="cream">
          <Reveal>
            <div className="section__head">
              <SplitHeading text={labels.delays} />
            </div>
            <p className="lead measure measure--narrow">{page.delays}</p>
          </Reveal>
        </SectionBlock>
      ) : null}

      {/* ── l'estimateur, puis la grille ───────────────────────────────── */}
      <SectionBlock tone="white" id="prix">
        {estimator ? (
          <>
            <Reveal>
              <div className="section__head">
                <SplitHeading text={money.estimate} />
                <p className="lead">{money.lead}</p>
              </div>
            </Reveal>
            <Reveal>{estimator}</Reveal>
          </>
        ) : (
          <Reveal>
            <div className="section__head">
              <SplitHeading text={labels.price} />
              <p className="lead">{money.lead}</p>
            </div>
          </Reveal>
        )}

        <Reveal>
          <h3 className={`paths__h${estimator ? ' paths__h--grid' : ''}`}>{money.grid}</h3>
          <div className="service__prices">{priceGrid(locale, service)}</div>
          {service === 'sites' ? (
            <ul className="stack small muted service__conditions">
              {money.conditions.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          ) : null}
          <p className="small muted" style={{ marginTop: 'var(--s4)' }}>
            {money.disclaimer}
          </p>
        </Reveal>
      </SectionBlock>

      {/* ── une realisation liee, s'il y en a une ──────────────────────── */}
      {proof ? (
        <SectionBlock tone="cream">
          <Reveal>
            <div className="section__head">
              <SplitHeading text={labels.proof} />
            </div>
          </Reveal>
          <div className="grid grid--3">
            <CaseCard locale={locale} study={proof} />
          </div>
        </SectionBlock>
      ) : null}

      {/* ── une FAQ courte ─────────────────────────────────────────────── */}
      {page.faq ? (
        <SectionBlock>
          <Reveal>
            <div className="section__head">
              <SplitHeading text={labels.faq} />
            </div>
          </Reveal>
          <Faq items={page.faq} />
        </SectionBlock>
      ) : null}

      {/* ── les autres services, pour ne pas finir dans une impasse ────── */}
      <SectionBlock tone="cream">
        <Reveal>
          <div className="section__head">
            <SplitHeading text={t.map.services.title} />
          </div>
        </Reveal>
        <div className="grid grid--3">
          {(Object.keys(t.map.services.children) as ServiceKey[])
            .filter((key) => key !== service)
            .map((key) => (
              <Reveal key={key}>
                <Link className="card card--link" href={servicePath(locale, key)}>
                  <h3 className="card__title">{t.map.services.children[key]}</h3>
                  <p className="muted small">{t.menu.services[key]}</p>
                  <span className="link-more">{t.work.more}</span>
                </Link>
              </Reveal>
            ))}
        </div>
        <Reveal>
          <p className="small xgrid__all">
            <Link className="link-more" href={path(locale, 'work')}>
              {t.work.title}
            </Link>
          </p>
        </Reveal>
      </SectionBlock>

      <FinalCta locale={locale} />
    </>
  )
}
