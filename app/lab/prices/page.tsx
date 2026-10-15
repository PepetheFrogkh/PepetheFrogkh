import Price from '@/components/Price'
import CurrencySwitch from '@/components/CurrencySwitch'
import {
  AUTOMATION,
  BUSINESS_APPS,
  CUSTOM_START,
  DELAYS,
  FEEDBACK,
  OPTIONS,
  PACKS,
  PLANS,
  TRANSFER,
} from '@/lib/prices'

/**
 * La grille de prix, en entier, dans les deux devises.
 *
 * Elle sert a relire la table d'un coup d'oeil : chaque ligne, son prix en
 * euros et son prix en dollars, et les emplacements [À FIXER] la ou le prix
 * n'a pas ete decide. Le selecteur en haut bascule les deux colonnes.
 */
export default function Page() {
  const rows: { label: string; price: Parameters<typeof Price>[0]['price'] }[] = [
    ...PACKS.map((p) => ({ label: `pack · ${p.id}`, price: p.price })),
    ...OPTIONS.map((o) => ({ label: `option · ${o.id}`, price: o.price })),
    ...DELAYS.map((d) => ({ label: `délai · ${d.id}`, price: d.price })),
    ...PLANS.map((p) => ({ label: `abonnement · ${p.id}`, price: p.price })),
    { label: 'transfert vers un autre hébergeur', price: TRANSFER },
    { label: 'automatisation · flux simple', price: AUTOMATION.flow },
    { label: 'automatisation · condition', price: AUTOMATION.condition },
    { label: 'automatisation · application connectée', price: AUTOMATION.app },
    { label: 'automatisation · outil sans API ouverte', price: AUTOMATION.noApi },
    ...AUTOMATION.supervision.map((s) => ({
      label: `supervision · ${s.id}`,
      price: s.price,
    })),
    { label: 'projet sur mesure · équipe au mois', price: CUSTOM_START },
    { label: 'application métier · de base', price: BUSINESS_APPS.base },
    { label: 'application métier · ERP complet', price: BUSINESS_APPS.erp },
    { label: 'écoute client', price: FEEDBACK },
  ]

  return (
    <main className="container" style={{ paddingBlock: 'var(--s9)' }}>
      <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0 }}>Grille de prix</h1>
        <CurrencySwitch label="Devise" />
      </div>
      <p className="lead">
        Toutes les lignes de <code>lib/prices.ts</code>, dans la devise choisie. Hors taxes. La
        colonne de gauche est le francais, celle de droite l&rsquo;anglais.
      </p>
      <table className="lab-table">
        <tbody>
          {rows.map((row) => (
            <tr key={row.label}>
              <th scope="row">{row.label}</th>
              <td>
                <Price price={row.price} locale="fr" />
              </td>
              <td>
                <Price price={row.price} locale="en" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  )
}
