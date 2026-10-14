import { notFound } from 'next/navigation'
import { dict } from '@/content'
import { isLocale, path } from '@/lib/i18n'
import { visibleCases } from '@/lib/flags'
import CaseCard from '@/components/CaseCard'
import ConfiguratorSlot from '@/components/ConfiguratorSlot'
import Counter from '@/components/Counter'
import Cta from '@/components/Cta'
import DiagnosticForm from '@/components/DiagnosticForm'
import Fan from '@/components/Fan'
import Faq from '@/components/Faq'
import FinalCta from '@/components/FinalCta'
import Heading from '@/components/Heading'
import HeroType from '@/components/HeroType'
import LogoStrip from '@/components/LogoStrip'
import MaskReveal from '@/components/MaskReveal'
import PinnedManifesto from '@/components/PinnedManifesto'
import PinnedMethod from '@/components/PinnedMethod'
import Reveal from '@/components/Reveal'
import SectionBlock from '@/components/SectionBlock'
import SituationList from '@/components/SituationList'
import TrackVisible from '@/components/TrackVisible'
import { Tbd, TbdBlock } from '@/components/Tbd'

/**
 * L'accueil, dans l'ordre des dix-sept blocs du wireframe.
 *
 * Chaque section est un `SectionBlock` : un grand bloc aux coins tres
 * arrondis qui glisse par-dessus la precedente au defilement, comme le
 * demande le cahier. Deux sections sont epinglees, le manifeste et la
 * methode, et portent leur propre composant.
 *
 * Tout le texte vient de `content/`. Un bloc dont le contenu n'a pas ete
 * fourni affiche son emplacement [À FOURNIR] plutot que du remplissage.
 */
export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  const t = dict(lang)

  return (
    <>
      {/* 2 · en-tete : le titre est le visuel, le defilement le recompose */}
      <HeroType eyebrow={t.hero.eyebrow} lines={t.hero.titleLines}>
        <p className="lead typo__sub">{t.hero.sub}</p>
        <div className="typo__actions">
          <div className="row">
            <Cta
              locale={lang}
              href={t.hero.primary.href}
              label={t.hero.primary.label}
              event="diagnostic_click"
            />
            <Cta
              locale={lang}
              href={t.hero.secondary.href}
              label={t.hero.secondary.label}
              variant="secondary"
              event="book_call_click"
            />
          </div>
          <p className="hero__note">{t.hero.note}</p>
        </div>
      </HeroType>

      {/* 3 · eventail de realisations : les ecrans montent de l'horizon */}
      <SectionBlock tone="cream">
        <Reveal>
          <div className="section__head">
            <h2>{t.showcase.title}</h2>
            <p className="lead">{t.showcase.note}</p>
          </div>
        </Reveal>
        <Fan locale={lang} shots={visibleCases(t.work.cases)} />
      </SectionBlock>

      {/* 4 et 5 · logos clients, puis les chiffres verifies */}
      <SectionBlock>
        <Reveal>
          <LogoStrip locale={lang} />
        </Reveal>
        <Reveal delay={80}>
          <div className="grid grid--3" style={{ marginTop: 'var(--s8)' }}>
            {t.proof.figures.map((figure) => (
              <Counter key={figure.caption} figure={figure} />
            ))}
          </div>
        </Reveal>
      </SectionBlock>

      {/* 6 · votre situation : le coeur du site */}
      <SectionBlock tone="cream" id="situations">
        <Reveal>
          <div className="section__head">
            <Heading text={t.situations.title} as="h2" />
          </div>
        </Reveal>
        <Reveal delay={80}>
          <SituationList locale={lang} />
        </Reveal>
      </SectionBlock>

      {/* 7 · manifeste : section epinglee, le texte se colore au defilement */}
      <PinnedManifesto text={t.manifesto} />

      {/* 8 · les fondateurs */}
      <SectionBlock tone="cream">
        <Reveal>
          <div className="section__head">
            <h2>{t.founders.title}</h2>
          </div>
          <div className="grid grid--2">
            {t.founders.people.map((person) => (
              <div className="card" key={person.name}>
                <div className="row" style={{ gap: 'var(--s3)' }}>
                  {person.photo ? (
                    <img
                      className="portrait"
                      src={person.photo}
                      alt={person.name}
                      width={88}
                      height={88}
                      loading="lazy"
                    />
                  ) : (
                    <span className="portrait portrait--empty" aria-hidden="true" />
                  )}
                  <div>
                    <h3>{person.name}</h3>
                    <p className="small" style={{ margin: 0, fontWeight: 700 }}>
                      {person.role ?? <Tbd locale={lang} />}
                    </p>
                  </div>
                </div>
                <p className="muted" style={{ marginTop: 'var(--s3)', marginBottom: 0 }}>
                  {person.bio ?? <Tbd locale={lang} />}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </SectionBlock>

      {/* 9 · nos offres, avec prix, et l'emplacement du configurateur */}
      <SectionBlock id="offres">
        <Reveal>
          <div className="section__head">
            <h2>{t.offers.title}</h2>
            <p className="lead">{t.offers.note}</p>
          </div>
          <div className="grid grid--3">
            {t.offers.items.map((offer) => (
              <div className="card card--lift" key={offer.title}>
                <h3>{offer.title}</h3>
                <p className="muted" style={{ marginTop: 8 }}>
                  {offer.body ?? <Tbd locale={lang} />}
                </p>
                <p
                  className="small"
                  style={{ fontWeight: 700, marginTop: 'var(--s3)', marginBottom: 0 }}
                >
                  {offer.price.startsWith('[') ? <Tbd locale={lang} /> : offer.price}
                </p>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 'var(--s5)' }}>
            <ConfiguratorSlot locale={lang} />
          </div>
          <TrackVisible event="price_shown" />
        </Reveal>
      </SectionBlock>

      {/* 10 · realisations : images revelees par un masque, curseur « Voir » */}
      <SectionBlock tone="cream">
        <Reveal>
          <div className="section__head">
            <h2>{t.work.title}</h2>
            <p className="lead">{t.work.intro}</p>
          </div>
          <div className="row" style={{ gap: 8, marginBottom: 'var(--s5)' }}>
            <span className="tag" style={{ background: 'var(--peach)', color: 'var(--ink)' }}>
              {t.work.all}
            </span>
            {t.work.filters.map((filter) => (
              <span className="tag" key={filter}>
                {filter}
              </span>
            ))}
          </div>
        </Reveal>
        <div className="grid grid--3">
          {visibleCases(t.work.cases).map((study, i) => (
            <MaskReveal key={study.slug} delay={i * 90}>
              <CaseCard locale={lang} study={study} />
            </MaskReveal>
          ))}
        </div>
      </SectionBlock>

      {/* 11 · convictions */}
      <SectionBlock>
        <Reveal>
          <div className="section__head">
            <h2>{t.convictions.title}</h2>
          </div>
          <div className="grid grid--3">
            {t.convictions.items.map((item, i) => (
              <div key={i}>
                <div className="card__num">{String(i + 1).padStart(2, '0')}</div>
                <h3 style={{ marginTop: 8, fontFamily: 'var(--font-display)', fontWeight: 600 }}>
                  {item.title.startsWith('[') ? <Tbd locale={lang} /> : item.title}
                </h3>
                <p className="muted" style={{ marginTop: 'var(--s2)' }}>
                  {item.body ?? <Tbd locale={lang} />}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </SectionBlock>

      {/* 12 · methode : section epinglee, une etape par cran de defilement */}
      <PinnedMethod title={t.method.title} intro={t.method.intro} steps={t.method.steps} />

      {/* 13 · temoignages : rien sans l'accord ecrit du client */}
      <SectionBlock>
        <Reveal>
          <div className="section__head">
            <h2>{t.testimonials.title}</h2>
            <p className="lead">{t.testimonials.note}</p>
          </div>
          <div className="grid grid--3">
            <TbdBlock locale={lang} what={lang === 'fr' ? 'vidéo' : 'video'} />
            <TbdBlock locale={lang} what={lang === 'fr' ? 'avis écrit' : 'written review'} />
            <TbdBlock locale={lang} what={lang === 'fr' ? 'avis écrit' : 'written review'} />
          </div>
        </Reveal>
      </SectionBlock>

      {/* 14 · diagnostic gratuit : la porte d'entree du site */}
      <SectionBlock tone="cream">
        <div className="grid grid--2" style={{ gap: 'var(--s8)', alignItems: 'start' }}>
          <Reveal>
            <h2>{t.diagnostic.title}</h2>
            <p className="lead" style={{ marginTop: 'var(--s2)' }}>
              {t.diagnostic.body}
            </p>
            <div className="card" style={{ marginTop: 'var(--s4)' }}>
              <div className="small" style={{ fontWeight: 700 }}>
                {t.diagnostic.preview.title}
              </div>
              <ul className="stack" style={{ marginTop: 'var(--s2)', paddingLeft: '1.1rem' }}>
                {t.diagnostic.preview.lines.map((line) => (
                  <li key={line} className="muted">
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <div className="card">
              <DiagnosticForm locale={lang} />
            </div>
          </Reveal>
        </div>
      </SectionBlock>

      {/* 15 · questions frequentes */}
      <SectionBlock>
        <div className="measure">
          <Reveal>
            <div className="section__head">
              <h2>{t.faq.title}</h2>
            </div>
            <Faq items={t.faq.items} />
            <p className="small muted" style={{ marginTop: 'var(--s4)' }}>
              <a href={path(lang, 'contact')}>{t.nav.cta}</a>
            </p>
          </Reveal>
        </div>
      </SectionBlock>

      {/* 16 · dernier appel */}
      <FinalCta locale={lang} />
    </>
  )
}
