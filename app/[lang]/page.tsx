import { notFound } from 'next/navigation'
import Link from 'next/link'
import { dict } from '@/content'
import {
  EXPERTISES,
  SERVICES,
  expertisePath,
  isLocale,
  path,
  servicePath,
} from '@/lib/i18n'
import { visibleCases } from '@/lib/flags'
import { PACKS, AUTOMATION } from '@/lib/prices'
import CaseCard from '@/components/CaseCard'
import Cta from '@/components/Cta'
import Faq from '@/components/Faq'
import FinalCta from '@/components/FinalCta'
import HeroType from '@/components/HeroType'
import MaskReveal from '@/components/MaskReveal'
import Price from '@/components/Price'
import Reveal from '@/components/Reveal'
import ScrollSequence from '@/components/sequence/ScrollSequence'
import { accent } from '@/components/accent'
import SectionBlock from '@/components/SectionBlock'
import SplitHeading from '@/components/SplitHeading'
import Typewriter from '@/components/Typewriter'
import { Tbd } from '@/components/Tbd'

/**
 * L'accueil.
 *
 * Ce que ce fichier porte aujourd'hui : le nouveau positionnement, les cinq
 * services, les six expertises, les realisations, les prix, les temoignages et
 * la FAQ. Rien d'invente : un temoignage non fourni affiche son emplacement.
 *
 * Ce qu'il ne porte pas encore : la sequence cinematique, qui attend sa
 * validation sur /lab/hero ; le globe des realisations ; et la carte video.
 * L'en-tete est donc typographique en attendant, avec le titre, le sous-titre
 * et les deux boutons du cahier.
 */
export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  const t = dict(lang)
  const cases = visibleCases(t.work.cases)
  const pro = PACKS.find((p) => p.id === 'pro')!

  return (
    <>
      <HeroType eyebrow={t.hero.eyebrow} lines={t.hero.titleLines}>
        <p className="lead typo__sub">{t.hero.sub}</p>
        <div className="typo__actions">
          <div className="row">
            <Cta
              locale={lang}
              href={t.hero.primary.href}
              label={t.hero.primary.label}
              event="estimate_click"
            />
            <Cta
              locale={lang}
              href={t.hero.secondary.href}
              label={t.hero.secondary.label}
              variant="secondary"
            />
          </div>
          <p className="hero__note">{t.hero.note}</p>
        </div>
      </HeroType>

      {/* les cinq services */}
      <SectionBlock tone="cream" id="services">
        <Reveal>
          <div className="section__head">
            <SplitHeading text={t.home.services.title} />
            <p className="lead">{t.home.services.lead}</p>
          </div>
        </Reveal>
        <div className="grid grid--3">
          {SERVICES.map((key) => (
            <Reveal key={key}>
              <Link className="card card--link" href={servicePath(lang, key)}>
                <h3 className="card__title">{t.map.services.children[key]}</h3>
                <p className="muted small">{t.menu.services[key]}</p>
                <span className="link-more">{t.work.more}</span>
              </Link>
            </Reveal>
          ))}
        </div>
      </SectionBlock>

      {/* La sequence 3D, epinglee. Elle vient apres le premier ecran et non
          derriere lui : le titre d'accueil est deja le visuel de la page, et
          le poser sur les plaques de l'animation le rendait illisible. Ici
          elle a sa propre section, son propre titre, et le voile creme garde
          le contraste du texte a chaque image. */}
      <ScrollSequence
        level="h2"
        eyebrow={t.home.sequence.eyebrow}
        title={accent(t.home.sequence.title)}
        lead={t.home.sequence.lead}
      />

      {/* la transition tapee a la machine */}
      <Typewriter before={t.home.transition.before} items={t.home.transition.items} />

      {/* les six expertises */}
      <SectionBlock id="expertises">
        <Reveal>
          <div className="section__head">
            <SplitHeading text={t.home.expertises.title} />
            <p className="lead">{t.home.expertises.lead}</p>
          </div>
        </Reveal>
        <div className="grid grid--3">
          {EXPERTISES.map((key) => (
            <Reveal key={key}>
              <Link className="card card--link" href={expertisePath(lang, key)}>
                <h3 className="card__title">{t.map.expertises.children[key]}</h3>
                <p className="muted small">{t.menu.expertises[key]}</p>
                <span className="link-more">{t.work.more}</span>
              </Link>
            </Reveal>
          ))}
        </div>
      </SectionBlock>

      {/* les realisations : le globe prendra la place de cette grille */}
      <SectionBlock tone="cream" id="realisations">
        <Reveal>
          <div className="section__head">
            <SplitHeading text={t.home.work.title} />
            <p className="lead">{t.home.work.lead}</p>
          </div>
        </Reveal>
        <div className="grid grid--3">
          {cases.map((study, i) => (
            <MaskReveal key={study.slug} delay={i * 90}>
              <CaseCard locale={lang} study={study} />
            </MaskReveal>
          ))}
        </div>
      </SectionBlock>

      {/* les prix affiches */}
      <SectionBlock id="tarifs">
        <Reveal>
          <div className="section__head">
            <SplitHeading text={t.home.pricing.title} />
            <p className="lead">{t.home.pricing.lead}</p>
          </div>
        </Reveal>
        <Reveal>
          <div className="grid grid--2">
            <div className="card">
              <h3 className="card__title">{t.map.services.children.sites}</h3>
              <p className="lead" style={{ margin: 0 }}>
                <Price price={pro.price} locale={lang} from />
              </p>
            </div>
            <div className="card">
              <h3 className="card__title">{t.map.services.children.automations}</h3>
              <p className="lead" style={{ margin: 0 }}>
                <Price price={AUTOMATION.flow} locale={lang} from />
              </p>
            </div>
          </div>
          <div style={{ marginTop: 'var(--s4)' }}>
            <Cta
              locale={lang}
              href={t.home.pricing.cta.href}
              label={t.home.pricing.cta.label}
              event="configurator_start"
            />
          </div>
        </Reveal>
      </SectionBlock>

      {/* les temoignages : fournis par le client, ou rien */}
      <SectionBlock tone="peach" id="temoignages">
        <Reveal>
          <div className="section__head">
            <SplitHeading text={t.testimonials.title} />
            <p className="lead">{t.testimonials.note}</p>
          </div>
        </Reveal>
        <div className="grid grid--3">
          {t.testimonials.items.map((item, i) => (
            <Reveal key={i}>
              <div className="card">
                {item.text ? (
                  <>
                    <p className="card__quote">« {item.text} »</p>
                    <p className="muted small" style={{ marginBottom: 0 }}>
                      {item.author}
                      {item.company ? `, ${item.company}` : ''}
                    </p>
                  </>
                ) : (
                  <Tbd locale={lang} what={t.words.testimonial} />
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </SectionBlock>

      {/* la FAQ */}
      <SectionBlock id="faq">
        <Reveal>
          <div className="section__head">
            <SplitHeading text={t.faq.title} />
          </div>
        </Reveal>
        <Faq items={t.faq.items} />
      </SectionBlock>

      <FinalCta locale={lang} />

      {/* le blog et le contact ont leurs pages : l'accueil y renvoie */}
      <SectionBlock tone="cream">
        <Reveal>
          <div className="section__head">
            <SplitHeading text={t.home.blog.title} />
            <p className="lead">{t.home.blog.lead}</p>
          </div>
          <Link className="link-more" href={path(lang, 'blog')}>
            {t.map.blog}
          </Link>
        </Reveal>
      </SectionBlock>
    </>
  )
}
