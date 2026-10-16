import Link from 'next/link'
import { dict } from '@/content'
import type { ExpertisePage } from '@/content'
import { expertisePath, path, type ExpertiseKey, type Locale } from '@/lib/i18n'
import { visibleCases, visibleExpertises } from '@/lib/flags'
import CaseCard from '@/components/CaseCard'
import Cta from '@/components/Cta'
import ExpertiseMark from '@/components/ExpertiseMark'
import FinalCta from '@/components/FinalCta'
import Reveal from '@/components/Reveal'
import SectionBlock from '@/components/SectionBlock'
import SplitHeading from '@/components/SplitHeading'

/**
 * Le gabarit d'une page d'expertise.
 *
 * Les quatre blocs du cahier, mais chacun avec sa forme. La page empilait
 * quatre listes a puces identiques sous quatre intertitres identiques, sur des
 * fonds qui alternaient : on la lisait comme un formulaire rempli, pas comme
 * un texte. Chaque bloc a desormais sa mise en page :
 *
 * - ce qu'on comprend du metier devient des constats numerotes, en deux
 *   colonnes, parce qu'on les lit un par un et non comme une enumeration ;
 * - les problemes typiques deviennent des cartes a filet orange, sur peche :
 *   ce sont les phrases dans lesquelles le visiteur doit se reconnaitre, et
 *   elles doivent se detacher du reste ;
 * - ce qu'on propose devient une liste cochee, en reponse directe, avec
 *   l'appel a l'action au bout ;
 * - « Notre experience » devient une citation, parce que c'en est une : ce
 *   sont les fondateurs qui parlent, avant Kuiper Studio.
 *
 * Un bloc sans contenu ne s'affiche pas. La page ne montre plus d'emplacement
 * « [À FOURNIR] » : un site public qui montre ses trous se lit comme un
 * brouillon. Ce qui manque reste releve par `scripts/trous.mjs` et dans
 * A-FOURNIR.md, et une page a qui il manque l'essentiel n'a pas d'adresse du
 * tout, voir `expertiseReady`.
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
    .filter((study): study is NonNullable<typeof study> => Boolean(study))
  const others = visibleExpertises(t).filter((key) => key !== expertise)

  return (
    <>
      {/* ── l'en-tete : le metier, et son pictogramme ──────────────────── */}
      <section className="xhero">
        <div className="container xhero__inner">
          <div className="xhero__text">
            <span className="eyebrow">{t.map.expertises.title}</span>
            <SplitHeading text={page.title} as="h1" className="xhero__title" />
            {page.lead ? <p className="lead xhero__lead">{page.lead}</p> : null}
          </div>
          {/* La photographie du metier quand il y en a une, son pictogramme
              sinon. Pas d'emplacement vide : le pictogramme est dessine pour
              tenir cette place, ce n'est pas un pis-aller. */}
          {page.photo ? (
            <figure className="xhero__photo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={page.photo.src} alt={page.photo.alt} width={416} height={416} />
              <figcaption className="xhero__credit small muted">{page.photo.credit}</figcaption>
            </figure>
          ) : (
            <div className="xhero__mark">
              <ExpertiseMark expertise={expertise} />
            </div>
          )}
        </div>
      </section>

      {/* ── ce que nous comprenons du metier ───────────────────────────── */}
      {page.understand ? (
        <SectionBlock tone="cream">
          <Reveal>
            <div className="section__head">
              <SplitHeading text={labels.understand} />
            </div>
          </Reveal>
          <ol className="facts">
            {page.understand.map((line, i) => (
              <Reveal key={line} delay={i * 60}>
                <li className="fact">
                  <span className="fact__n" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p className="fact__text">{line}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </SectionBlock>
      ) : null}

      {/* ── les problemes typiques ─────────────────────────────────────── */}
      {page.problems ? (
        <SectionBlock tone="peach">
          <Reveal>
            <div className="section__head">
              <SplitHeading text={labels.problems} />
            </div>
          </Reveal>
          <ul className="pains">
            {page.problems.map((line, i) => (
              <Reveal key={line} delay={i * 60}>
                <li className="pain">{line}</li>
              </Reveal>
            ))}
          </ul>
        </SectionBlock>
      ) : null}

      {/* ── ce que nous proposons ──────────────────────────────────────── */}
      {page.offer ? (
        <SectionBlock>
          <Reveal>
            <div className="section__head">
              <SplitHeading text={labels.offer} />
            </div>
          </Reveal>
          <ul className="offers">
            {page.offer.map((line, i) => (
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
          <Reveal>
            <div className="offers__cta">
              <Cta
                locale={locale}
                href="contact"
                label={t.nav.cta}
                event="contact_submit"
              />
            </div>
          </Reveal>
        </SectionBlock>
      ) : null}

      {/* ── notre experience, celle des fondateurs, avant Kuiper Studio ── */}
      {page.experience ? (
        <SectionBlock tone="cream">
          <Reveal>
            <div className="said-block">
              <span className="eyebrow">{labels.experience}</span>
              {page.experience.map((line) => (
                <p className="said-block__line" key={line}>
                  {line}
                </p>
              ))}
              <p className="said-block__note small muted">{labels.experienceNote}</p>
            </div>
          </Reveal>
        </SectionBlock>
      ) : null}

      {/* ── les realisations liees, s'il y en a ────────────────────────── */}
      {proofs.length > 0 ? (
        <SectionBlock tone="cream">
          <Reveal>
            <div className="section__head">
              <SplitHeading text={labels.proof} />
            </div>
          </Reveal>
          <div className="grid grid--3">
            {proofs.map((study) => (
              <CaseCard key={study.slug} locale={locale} study={study} />
            ))}
          </div>
        </SectionBlock>
      ) : null}

      {/* ── les autres metiers ─────────────────────────────────────────── */}
      {others.length > 0 ? (
        <SectionBlock>
          <Reveal>
            <div className="section__head">
              <SplitHeading text={t.map.expertises.title} />
            </div>
          </Reveal>
          <div className="xgrid">
            {others.map((key, i) => (
              <Reveal key={key} delay={i * 40}>
                <Link className="xcard" href={expertisePath(locale, key)}>
                  <ExpertiseMark expertise={key} className="xcard__mark" />
                  <h3 className="xcard__title">{t.map.expertises.children[key]}</h3>
                  <p className="xcard__desc">{t.menu.expertises[key]}</p>
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
      ) : null}

      <FinalCta locale={locale} />
    </>
  )
}
