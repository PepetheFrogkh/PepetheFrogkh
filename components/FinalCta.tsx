import { dict } from '@/content'
import type { Locale } from '@/lib/i18n'
import Cta from './Cta'
import Heading from './Heading'

/** Le dernier appel : bloc orange vif arrondi, titre, deux boutons. */
export default function FinalCta({ locale }: { locale: Locale }) {
  const t = dict(locale).finalCta

  return (
    <section className="section">
      <div className="container">
        <div className="final">
          <Heading text={t.title} as="h2" />
          <p className="lead" style={{ color: 'var(--ink)', marginTop: 'var(--s2)' }}>
            {t.sub}
          </p>
          <div className="row final__actions">
            <Cta
              locale={locale}
              href={t.primary.href}
              label={t.primary.label}
              event="diagnostic_click"
            />
            <Cta
              locale={locale}
              href={t.secondary.href}
              label={t.secondary.label}
              variant="secondary"
              event="book_call_click"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
