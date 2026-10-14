import Link from 'next/link'
import { dict } from '@/content'
import type { ExpertisePage } from '@/content'
import { expertisePath, path, type ExpertiseKey, type Locale } from '@/lib/i18n'
import { visibleCases } from '@/lib/flags'
import CaseCard from '@/components/CaseCard'
import FinalCta from '@/components/FinalCta'
import Reveal from '@/components/Reveal'
import SectionBlock from '@/components/SectionBlock'
import SplitHeading from '@/components/SplitHeading'
import { Tbd, TbdBlock } from '@/components/Tbd'

/**
 * Le gabarit d'une page d'expertise.
 *
 * Les blocs du cahier : ce qu'on comprend du metier, les problemes typiques,
 * ce qu'on propose, « Notre experience », les realisations liees.
 *
 * « Notre experience » porte l'experience personnelle des fondateurs, et
 * seulement elle. Le cahier est formel : elle n'apparait que sur ces pages,
 * toujours sous cet intitule, et jamais presentee comme une realisation de
 * Kuiper Studio. Le bloc le dit a l'ecran, pour qu'aucune relecture ne puisse
 * s'y tromper.
 */
export default function ExpertiseView({
  locale,
  expertise,
  page,
}: {
  locale: Locale
  expertise: ExpertiseKey
  page: ExpertisePage
}) {
  const t = dict(locale)
  const labels = t.expertiseLabels
  const proofs = (page.proof ?? [])
    .map((slug) => visibleCases(t.work.cases).find((c) => c.slug === slug))
    .filter(Boolean)

  const blocks: { title: string; lines: string[] | null }[] = [
    { title: labels.understand, lines: page.understand },
    { title: labels.problems, lines: page.problems },
    { title: labels.offer, lines: page.offer },
  ]

  return (
    <>
      <section className="hero hero--service">
        <div className="container measure">
          <span className="eyebrow">{t.map.expertises.title}</span>
          <SplitHeading text={page.title} as="h1" className="hero__title" />
          {page.lead ? <p className="lead">{page.lead}</p> : <Tbd locale={locale} />}
        </div>
      </section>

      {blocks.map((block, i) => (
        <SectionBlock tone={i % 2 === 0 ? 'cream' : 'white'} key={block.title}>
          <Reveal>
            <div className="section__head">
              <SplitHeading text={block.title} />
            </div>
            {block.lines ? (
              <ul className="stack measure service__pair">
                {block.lines.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            ) : (
              <TbdBlock locale={locale} what={block.title.toLowerCase()} />
            )}
          </Reveal>
        </SectionBlock>
      ))}

      {/* Notre experience : celle des fondateurs, avant Kuiper Studio. */}
      <SectionBlock tone="peach">
        <Reveal>
          <div className="section__head">
            <SplitHeading text={labels.experience} />
            <p className="lead">{t.expertiseLabels.experienceNote}</p>
          </div>
          {page.experience ? (
            <ul className="stack measure service__pair">
              {page.experience.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          ) : (
            <TbdBlock locale={locale} what={labels.experience.toLowerCase()} />
          )}
        </Reveal>
      </SectionBlock>

      {/* les realisations liees */}
      <SectionBlock tone="cream">
        <Reveal>
          <div className="section__head">
            <SplitHeading text={labels.proof} />
          </div>
        </Reveal>
        {proofs.length > 0 ? (
          <div className="grid grid--3">
            {proofs.map((study) => (
              <CaseCard key={study!.slug} locale={locale} study={study!} />
            ))}
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

      {/* les autres expertises */}
      <SectionBlock>
        <Reveal>
          <div className="section__head">
            <SplitHeading text={t.map.expertises.title} />
          </div>
        </Reveal>
        <div className="grid grid--3">
          {(Object.keys(t.map.expertises.children) as ExpertiseKey[])
            .filter((key) => key !== expertise)
            .map((key) => (
              <Reveal key={key}>
                <Link className="card card--link" href={expertisePath(locale, key)}>
                  <h3 className="card__title">{t.map.expertises.children[key]}</h3>
                  <p className="muted small">{t.menu.expertises[key]}</p>
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
