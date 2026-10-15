import { dict } from '@/content'
import type { Locale, ServiceKey } from '@/lib/i18n'
import {
  AUTOMATION,
  BUSINESS_APPS,
  CARE,
  CONSULTING,
  CUSTOM_START,
  DELAYS,
  FEEDBACK,
  OPTIONS,
  PACKS,
  PLANS,
  PROFILES,
  TRANSFER,
} from '@/lib/prices'
import PriceTable, { type Row } from './PriceTable'

/**
 * Les tableaux de prix d'un service, et eux seuls.
 *
 * Ils vivaient en double : une fois dans la page Tarifs, qui les affichait
 * tous les huit a la suite, une fois dans le gabarit des pages Service. Deux
 * copies d'une grille de prix finissent par diverger, et c'est la pire chose
 * qui puisse diverger sur un site.
 *
 * Les montants viennent de `lib/prices.ts`, les libelles de `content/`,
 * indexes par le meme identifiant : une ligne sans libelle ne compile pas.
 */
export function priceGrid(locale: Locale, service: ServiceKey) {
  const money = dict(locale).pricing
  const rows = (
    list: { id: string; price: Row['price'] }[],
    name: (id: string) => string,
  ): Row[] => list.map((item) => ({ id: item.id, name: name(item.id), price: item.price }))

  if (service === 'sites') {
    return (
      <>
        <PriceTable
          locale={locale}
          caption={money.packs.title}
          rows={PACKS.map((pack) => ({
            id: pack.id,
            name: money.packs.rows[pack.id].name,
            detail: money.packs.rows[pack.id].detail,
            price: pack.price,
            featured: pack.featured,
          }))}
        />
        <PriceTable
          locale={locale}
          caption={money.options.title}
          note={money.options.note}
          rows={rows(OPTIONS, (id) => money.options.rows[id as keyof typeof money.options.rows])}
        />
        <PriceTable
          locale={locale}
          caption={money.delays.title}
          rows={rows(DELAYS, (id) => money.delays.rows[id as keyof typeof money.delays.rows])}
        />
        <PriceTable
          locale={locale}
          caption={money.plans.title}
          note={money.plans.note}
          rows={PLANS.map((plan) => ({
            id: plan.id,
            name: money.plans.rows[plan.id],
            price: plan.price,
            featured: plan.featured,
          }))}
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
    return (
      <>
        <PriceTable
          locale={locale}
          caption={money.automation.title}
          rows={[
            { id: 'flow', name: money.automation.rows.flow, price: AUTOMATION.flow },
            { id: 'condition', name: money.automation.rows.condition, price: AUTOMATION.condition },
            { id: 'app', name: money.automation.rows.app, price: AUTOMATION.app },
            { id: 'noApi', name: money.automation.rows.noApi, price: AUTOMATION.noApi },
          ]}
        />
        <PriceTable
          locale={locale}
          caption={money.supervision.title}
          rows={AUTOMATION.supervision.map((line) => ({
            id: line.id,
            name: money.supervision.rows[line.id],
            price: line.price,
          }))}
        />
      </>
    )
  }

  if (service === 'custom') {
    return (
      <>
        <PriceTable
          locale={locale}
          caption={money.profiles.title}
          note={money.profiles.note}
          rows={[
            {
              id: 'start',
              name: money.team.row,
              detail: money.profiles.start,
              price: CUSTOM_START,
              featured: true,
            },
            ...PROFILES.map((profile) => ({
              id: profile.id,
              name: money.profiles.rows[profile.id].name,
              detail: money.profiles.rows[profile.id].detail,
              price: profile.price,
            })),
          ]}
        />
        <PriceTable
          locale={locale}
          caption={money.care.title}
          note={money.care.note}
          rows={CARE.map((plan) => ({
            id: plan.id,
            name: money.care.rows[plan.id].name,
            detail: money.care.rows[plan.id].detail,
            price: plan.price,
          }))}
        />
      </>
    )
  }

  if (service === 'apps') {
    return (
      <>
        <PriceTable
          locale={locale}
          caption={money.apps.title}
          rows={[
            { id: 'base', name: money.apps.rows.base, price: BUSINESS_APPS.base },
            { id: 'erp', name: money.apps.rows.erp, price: BUSINESS_APPS.erp },
          ]}
        />
        <PriceTable
          locale={locale}
          caption={money.care.title}
          note={money.care.note}
          rows={CARE.map((plan) => ({
            id: plan.id,
            name: money.care.rows[plan.id].name,
            detail: money.care.rows[plan.id].detail,
            price: plan.price,
          }))}
        />
      </>
    )
  }

  const name = dict(locale).map.services.children[service]
  return (
    <PriceTable
      locale={locale}
      caption={name}
      rows={[{ id: service, name, price: service === 'consulting' ? CONSULTING : FEEDBACK }]}
    />
  )
}
