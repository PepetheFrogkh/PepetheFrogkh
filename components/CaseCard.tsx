import Link from 'next/link'
import { dict, type CaseStudy } from '@/content'
import { path, type Locale } from '@/lib/i18n'
import { Tbd, TbdBlock } from './Tbd'

/**
 * Une carte d'etude de cas : la capture, le secteur, le pays, le nom, une
 * phrase, et le resultat verifie. Le resultat absent reste un emplacement
 * visible, jamais un chiffre de remplissage.
 */
export default function CaseCard({ locale, study }: { locale: Locale; study: CaseStudy }) {
  const t = dict(locale).work

  return (
    <Link
      className="card card--lift"
      href={path(locale, 'work', study.slug)}
      style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
    >
      {study.shot ? (
        <img
          src={study.shot}
          alt={study.name}
          loading="lazy"
          style={{ borderRadius: 'var(--r-image)', marginBottom: 'var(--s3)' }}
        />
      ) : (
        <div style={{ marginBottom: 'var(--s3)' }}>
          <TbdBlock locale={locale} what="capture" />
        </div>
      )}

      <div className="row" style={{ gap: 8, marginBottom: 'var(--s2)' }}>
        <span className="tag">{study.sector}</span>
        <span className="tag">{study.country}</span>
      </div>

      <h3>{study.name}</h3>
      <p className="muted" style={{ marginTop: 8 }}>
        {study.summary}
      </p>

      <div className="small" style={{ marginTop: 'var(--s2)', fontWeight: 700 }}>
        {t.resultLabel} : {study.result ?? <Tbd locale={locale} />}
      </div>
    </Link>
  )
}
