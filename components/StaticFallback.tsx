import { PLANS } from '@/lib/copy'
import { BEERS, BREWERY } from '@/lib/brand'

/**
 * Served to everyone, always. It is the page's real content: a crawler, and
 * anyone on `prefers-reduced-motion`, get exactly the words the film is
 * narrating, in the same order.
 */
export default function StaticFallback() {
  return (
    <>
      {PLANS.map((plan) => (
        <section key={plan.id} id={plan.id === 'cta' ? 'find' : plan.id}>
          <p className="plan__eyebrow">{plan.copy.eyebrow}</p>
          <h2>{plan.copy.title}</h2>
          {plan.copy.sub && <p>{plan.copy.sub}</p>}
        </section>
      ))}
      <section id="beers">
        <h2>Our beers</h2>
        {BEERS.map((b) => (
          <p key={b.id}>
            <strong>{b.name}</strong>
            {b.abv ? ` — ${b.abv}` : ''} — {b.notes}
          </p>
        ))}
        <p>{BREWERY}</p>
      </section>
    </>
  )
}
