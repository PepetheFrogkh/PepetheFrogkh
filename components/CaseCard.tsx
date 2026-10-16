import Link from 'next/link'
import type { CSSProperties } from 'react'
import { dict, type CaseStudy } from '@/content'
import { path, type Locale } from '@/lib/i18n'
import { Tbd, TbdBlock } from './Tbd'

/**
 * Une carte d'etude de cas : la capture, le secteur, le pays, le nom, une
 * phrase, et le resultat verifie. Le resultat absent reste un emplacement
 * visible, jamais un chiffre de remplissage.
 *
 * Quand la capture manque mais que le client nous a donne son logo, la carte
 * montre le logo : il dit de qui il s'agit, ce qu'un rectangle vide ne fait
 * pas. L'emplacement [À FOURNIR] ne revient que lorsqu'il n'y a ni l'un ni
 * l'autre, parce qu'un logo n'est pas une preuve de ce qui a ete construit.
 */
export default function CaseCard({ locale, study }: { locale: Locale; study: CaseStudy }) {
  const t = dict(locale).work

  return (
    <Link
      className="card card--lift"
      href={path(locale, 'work', study.slug)}
      data-cursor="voir"
      style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
    >
      {study.shot ? (
        <img
          src={study.shot}
          alt={study.name}
          loading="lazy"
          style={{ borderRadius: 'var(--r-image)', marginBottom: 'var(--s3)' }}
        />
      ) : study.logo ? (
        <div
          className="case__logo"
          data-own-bg={study.logoBg ? '' : undefined}
          style={study.logoBg ? ({ '--logo-bg': study.logoBg } as CSSProperties) : undefined}
        >
          <img src={study.logo} alt={study.name} loading="lazy" />
        </div>
      ) : (
        <div style={{ marginBottom: 'var(--s3)' }}>
          <TbdBlock locale={locale} what={dict(locale).words.shot} />
        </div>
      )}

      <div className="row" style={{ gap: 8, marginBottom: 'var(--s2)' }}>
        <span className="tag">{study.sector}</span>
        <span className="tag">{study.country}</span>
      </div>

      <h3>{study.name}</h3>
      {study.site ? <div className="small muted">{study.site}</div> : null}
      <p className="muted" style={{ marginTop: 8 }}>
        {study.summary}
      </p>

      <div className="small" style={{ marginTop: 'var(--s2)', fontWeight: 700 }}>
        {t.resultLabel} : {study.result ?? <Tbd locale={locale} />}
      </div>
    </Link>
  )
}
