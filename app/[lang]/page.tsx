import { notFound } from 'next/navigation'
import { dict } from '@/content'
import { isLocale, path } from '@/lib/i18n'
import Belt from '@/components/Belt'
import CaseCard from '@/components/CaseCard'
import ConfiguratorSlot from '@/components/ConfiguratorSlot'
import Counter from '@/components/Counter'
import Cta from '@/components/Cta'
import DiagnosticForm from '@/components/DiagnosticForm'
import Faq from '@/components/Faq'
import FinalCta from '@/components/FinalCta'
import Heading from '@/components/Heading'
import LogoStrip from '@/components/LogoStrip'
import Reveal from '@/components/Reveal'
import SituationList from '@/components/SituationList'
import TrackVisible from '@/components/TrackVisible'
import { Tbd, TbdBlock } from '@/components/Tbd'

/**
 * L'accueil, dans l'ordre des dix-sept blocs du wireframe.
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
      {/* 2 · en-tete : titre revele mot a mot, deux boutons, particules */}
      <section className="hero">
        <div className="container hero__grid">
          <div>
            <span className="eyebrow">{t.hero.eyebrow}</span>
            <Heading className="hero__title" text={t.hero.title} as="h1" animate />
            <p className="lead">{t.hero.sub}</p>
            <div className="row hero__actions">
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
          <Belt
            label={
              lang === 'fr'
                ? 'Une ceinture de particules orange en orbite autour d’un petit soleil'
                : 'A belt of orange particles orbiting a small sun'
            }
          />
        </div>
      </section>

      {/* 3 · eventail de realisations : captures sur ecrans */}
      <section className="section section--cream">
        <div className="container">
          <Reveal>
            <div className="section__head">
              <h2>{t.showcase.title}</h2>
              <p className="lead">{t.showcase.note}</p>
            </div>
            <div className="grid grid--3">
              {t.work.cases.map((study) => (
                <TbdBlock key={study.slug} locale={lang} what={study.name} />
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* 4 et 5 · logos clients, puis les chiffres verifies */}
      <section className="section">
        <div className="container">
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
        </div>
      </section>

      {/* 6 · votre situation : le coeur du site */}
      <section className="section section--cream" id="situations">
        <div className="container">
          <Reveal>
            <div className="section__head">
              <Heading text={t.situations.title} as="h2" />
            </div>
          </Reveal>
          <Reveal delay={80}>
            <SituationList locale={lang} />
          </Reveal>
        </div>
      </section>

      {/* 7 · manifeste */}
      <section className="section">
        <div className="container">
          <Reveal>
            <p
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 600,
                fontSize: 'clamp(28px, 4vw, 44px)',
                lineHeight: 1.15,
                letterSpacing: '-0.015em',
                maxWidth: '22ch',
                margin: 0,
              }}
            >
              {t.manifesto}
            </p>
          </Reveal>
        </div>
      </section>

      {/* 8 · les fondateurs */}
      <section className="section section--cream">
        <div className="container">
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
                        src={person.photo}
                        alt={person.name}
                        width={72}
                        height={72}
                        loading="lazy"
                        style={{ borderRadius: '50%' }}
                      />
                    ) : (
                      <span
                        aria-hidden="true"
                        style={{
                          width: 72,
                          height: 72,
                          borderRadius: '50%',
                          border: '1px dashed var(--terra)',
                          background: 'var(--cream)',
                          flex: 'none',
                        }}
                      />
                    )}
                    <div>
                      <h3>{person.name}</h3>
                      <p className="muted small" style={{ margin: 0 }}>
                        {person.role ?? <Tbd locale={lang} what="rôle" />}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* 9 · nos offres, avec prix, et l'emplacement du configurateur */}
      <section className="section" id="offres">
        <div className="container">
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
                    {offer.price.startsWith('[') ? <Tbd locale={lang} what="prix" /> : offer.price}
                  </p>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 'var(--s5)' }}>
              <ConfiguratorSlot locale={lang} />
            </div>
            <TrackVisible event="price_shown" />
          </Reveal>
        </div>
      </section>

      {/* 10 · realisations */}
      <section className="section section--cream">
        <div className="container">
          <Reveal>
            <div className="section__head">
              <h2>{t.work.title}</h2>
              <p className="lead">{t.work.intro}</p>
            </div>
            <div className="grid grid--3">
              {t.work.cases.map((study) => (
                <CaseCard key={study.slug} locale={lang} study={study} />
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* 11 · convictions */}
      <section className="section">
        <div className="container">
          <Reveal>
            <div className="section__head">
              <h2>{t.convictions.title}</h2>
            </div>
            <div className="grid grid--3">
              {t.convictions.items.map((item, i) => (
                <div key={i}>
                  <div className="card__num">{String(i + 1).padStart(2, '0')}</div>
                  <h3 style={{ marginTop: 8 }}>
                    <Tbd locale={lang} />
                  </h3>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* 12 · methode, en frise */}
      <section className="section section--cream">
        <div className="container">
          <Reveal>
            <div className="section__head">
              <h2>{t.method.title}</h2>
              <p className="lead">{t.method.intro}</p>
            </div>
            <ol className="steps" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {t.method.steps.map((step) => (
                <li className="step" key={step.title}>
                  <div className="step__title">{step.title}</div>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      {/* 13 · temoignages : rien sans l'accord ecrit du client */}
      <section className="section">
        <div className="container">
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
        </div>
      </section>

      {/* 14 · diagnostic gratuit : la porte d'entree du site */}
      <section className="section section--cream">
        <div className="container">
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
        </div>
      </section>

      {/* 15 · questions frequentes */}
      <section className="section">
        <div className="container measure">
          <Reveal>
            <div className="section__head">
              <h2>{t.faq.title}</h2>
            </div>
            <Faq items={t.faq.items} />
            <p className="small muted" style={{ marginTop: 'var(--s4)' }}>
              <a href={path(lang, 'diagnostic')}>{t.nav.cta}</a>
            </p>
          </Reveal>
        </div>
      </section>

      {/* 16 · dernier appel */}
      <FinalCta locale={lang} />
    </>
  )
}
