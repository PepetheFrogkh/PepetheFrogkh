import { PLANS } from '@/lib/copy'

/**
 * Served to everyone, always. It is the page's real content: the crawler, a
 * browser without WebGL and anyone on `prefers-reduced-motion` get exactly
 * the same words the canvas is narrating, in the same order.
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
        <p>
          <strong>Hanuman Premium Lager</strong> — 4.9% — brewed from barley malt and a blend of
          premium hops. Gold medal, Monde Selection 2024.
        </p>
        <p>
          <strong>Hanuman Black</strong> — a 100% malt dark beer in the German tradition, with
          caramel and honey notes, a fine bead and a rounded, hop-finished palate. Gold medal,
          Monde Selection 2024.
        </p>
        <p>
          <strong>Hanuman Lite</strong> — 3.9% — naturally fermented and German-lagered, light and
          soft.
        </p>
        <p>Brewed in Sen Sok, Phnom Penh, Cambodia.</p>
      </section>
    </>
  )
}
