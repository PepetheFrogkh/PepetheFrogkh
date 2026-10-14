import Link from 'next/link'
import { dict } from '@/content'
import type { ServicePage } from '@/content'
import {
  AUTOMATION,
  BUSINESS_APPS,
  CUSTOM_TEAM,
  DELAYS,
  FEEDBACK,
  OPTIONS,
  PACKS,
  PLANS,
  TRANSFER,
} from '@/lib/prices'
import { path, servicePath, type Locale, type ServiceKey } from '@/lib/i18n'
import { visibleCases } from '@/lib/flags'
import CaseCard from '@/components/CaseCard'
import SiteConfigurator from '@/components/SiteConfigurator'
import Cta from '@/components/Cta'
import Faq from '@/components/Faq'
import FinalCta from '@/components/FinalCta'
import PriceTable, { type Row } from '@/components/PriceTable'
import Reveal from '@/components/Reveal'
import SectionBlock from '@/components/SectionBlock'
import SplitHeading from '@/components/SplitHeading'
import { Tbd, TbdBlock } from '@/components/Tbd'

/**
 * Le gabarit d'une page de service.
 *
 * Les blocs du cahier, dans l'ordre : le probleme, ce qu'on livre, les delais,
 * le prix affiche dans la devise du visiteur, une realisation liee, une FAQ
 * courte, un appel a l'action.
 *
 * Les prix ne sont pas ecrits ici : chaque service choisit les tableaux de
 * `lib/prices.ts` qui le concernent, et les libelles viennent de `content/`,
 * indexes par le meme identifiant. Un bloc que le contenu ne fournit pas
 * affiche son emplacement plutot que de disparaitre en silence.
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

  return (
    <>
      <section className="hero hero--service">
        <div className="container measure">
          <span className="eyebrow">{t.map.services.title}</span>
          <SplitHeading text={page.title} as="h1" className="hero__title" />
          {page.lead ? <p className="lead">{page.lead}</p> : <Tbd locale={locale} />}
        </div>
      </section>

      {/* le probleme, puis ce qu'on livre */}
      <SectionBlock tone="cream">
        <div className="grid grid--2 service__pair">
          <Reveal>
            <h2 className="service__h">{labels.problem}</h2>
            {page.problem ? (
              <ul className="stack">
                {page.problem.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            ) : (
              <TbdBlock locale={locale} what={labels.problem.toLowerCase()} />
            )}
          </Reveal>
          <Reveal delay={80}>
            <h2 className="service__h">{labels.delivers}</h2>
            {page.delivers ? (
              <ul className="stack">
                {page.delivers.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            ) : (
              <TbdBlock locale={locale} what={labels.delivers.toLowerCase()} />
            )}
          </Reveal>
        </div>
      </SectionBlock>

      {/* le prix, dans la devise du visiteur */}
      <SectionBlock id="prix">
        <Reveal>
          <div className="section__head">
            <SplitHeading text={labels.price} />
            <p className="lead">{money.lead}</p>
          </div>
        </Reveal>
        <Reveal>
          <div className="service__prices">{tables(locale, service)}</div>
          <p className="small muted" style={{ marginTop: 'var(--s4)' }}>
            {money.disclaimer}
          </p>
        </Reveal>
        {service === 'sites' ? (
          <Reveal>
            <ul className="stack small muted service__conditions">
              {money.conditions.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
            <div style={{ marginTop: 'var(--s5)' }}>
              <SiteConfigurator locale={locale} />
            </div>
          </Reveal>
        ) : null}
        {service === 'automations' ? (
          <Reveal>
            <div style={{ marginTop: 'var(--s4)' }}>
              <Cta
                locale={locale}
                href="pricing"
                label={t.home.pricing.cta.label}
                event="configurator_start"
              />
            </div>
          </Reveal>
        ) : null}
      </SectionBlock>

      {/* les delais */}
      {page.delays ? (
        <SectionBlock tone="peach">
          <Reveal>
            <div className="section__head">
              <SplitHeading text={labels.delays} />
            </div>
            <p className="lead measure measure--narrow">{page.delays}</p>
          </Reveal>
        </SectionBlock>
      ) : null}

      {/* une realisation liee */}
      <SectionBlock tone="cream">
        <Reveal>
          <div className="section__head">
            <SplitHeading text={labels.proof} />
          </div>
        </Reveal>
        {proof ? (
          <div className="grid grid--3">
            <CaseCard locale={locale} study={proof} />
          </div>
        ) : (
          <Reveal>
            <TbdBlock locale={locale} what={labels.proof.toLowerCase()} />
            <p className="small" style={{ marginTop: 'var(--s3)' }}>
              <Link className="link-more" href={path(locale, 'work')}>
                {t.work.title}
              </Link>
            </p>
          </Reveal>
        )}
      </SectionBlock>

      {/* une FAQ courte */}
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

      {/* les autres services, pour ne pas finir dans une impasse */}
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
      </SectionBlock>

      <FinalCta locale={locale} />
    </>
  )
}

/** Les tableaux de prix qui concernent ce service, et eux seuls. */
function tables(locale: Locale, service: ServiceKey) {
  const money = dict(locale).pricing

  if (service === 'sites') {
    const packs: Row[] = PACKS.map((pack) => ({
      id: pack.id,
      name: money.packs.rows[pack.id].name,
      detail: money.packs.rows[pack.id].detail,
      price: pack.price,
      featured: pack.featured,
    }))
    const options: Row[] = OPTIONS.map((option) => ({
      id: option.id,
      name: money.options.rows[option.id],
      price: option.price,
    }))
    const delays: Row[] = DELAYS.map((delay) => ({
      id: delay.id,
      name: money.delays.rows[delay.id],
      price: delay.price,
    }))
    const plans: Row[] = PLANS.map((plan) => ({
      id: plan.id,
      name: money.plans.rows[plan.id],
      price: plan.price,
      featured: plan.featured,
    }))

    return (
      <>
        <PriceTable locale={locale} caption={money.packs.title} rows={packs} />
        <PriceTable
          locale={locale}
          caption={money.options.title}
          note={money.options.note}
          rows={options}
        />
        <PriceTable locale={locale} caption={money.delays.title} rows={delays} />
        <PriceTable
          locale={locale}
          caption={money.plans.title}
          note={money.plans.note}
          rows={plans}
        />
        <PriceTable
          locale={locale}
          caption={money.transfer}
          rows={[{ id: 'transfer', name: money.transfer, price: TRANSFER }]}
        />
      </>
    )
  }

  if (service === 'automations') {
    const flows: Row[] = [
      { id: 'flow', name: money.automation.rows.flow, price: AUTOMATION.flow },
      { id: 'condition', name: money.automation.rows.condition, price: AUTOMATION.condition },
      { id: 'app', name: money.automation.rows.app, price: AUTOMATION.app },
      { id: 'noApi', name: money.automation.rows.noApi, price: AUTOMATION.noApi },
    ]
    const supervision: Row[] = AUTOMATION.supervision.map((line) => ({
      id: line.id,
      name: money.supervision.rows[line.id],
      price: line.price,
    }))
    return (
      <>
        <PriceTable locale={locale} caption={money.automation.title} rows={flows} />
        <PriceTable locale={locale} caption={money.supervision.title} rows={supervision} />
      </>
    )
  }

  if (service === 'custom') {
    return (
      <PriceTable
        locale={locale}
        caption={money.team.title}
        rows={[{ id: 'team', name: money.team.row, price: CUSTOM_TEAM }]}
      />
    )
  }

  if (service === 'apps') {
    return (
      <PriceTable
        locale={locale}
        caption={money.apps.title}
        rows={[
          { id: 'base', name: money.apps.rows.base, price: BUSINESS_APPS.base },
          { id: 'erp', name: money.apps.rows.erp, price: BUSINESS_APPS.erp },
        ]}
      />
    )
  }

  return (
    <PriceTable
      locale={locale}
      caption={dict(locale).map.services.children.feedback}
      rows={[
        { id: 'feedback', name: dict(locale).map.services.children.feedback, price: FEEDBACK },
      ]}
    />
  )
}
