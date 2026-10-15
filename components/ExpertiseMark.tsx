import type { ExpertiseKey } from '@/lib/i18n'

/**
 * Le pictogramme d'une expertise.
 *
 * Neuf dessins au trait, un par metier, en deux epaisseurs : le trait de la
 * charte pour la structure, l'orange pour le detail qui dit de quel metier il
 * s'agit. Ils sont decoratifs : le titre de la page dit deja le metier, donc
 * `aria-hidden`.
 *
 * Ils tiennent lieu de photographie. Une photographie de banque d'images sur
 * une page de metier dit « site d'agence » et rien d'autre ; un dessin au
 * trait dans la charte dit au moins que quelqu'un l'a dessine. Si de vraies
 * photographies arrivent un jour, elles se posent a cote, ce dessin reste la
 * vignette de la carte.
 *
 * Tous sont dessines dans un carre de 48, trait de 1,6, bouts arrondis : ils
 * se ressemblent assez pour former une famille.
 */

const MARKS: Record<ExpertiseKey, React.ReactNode> = {
  // une assiette, une fourchette, un couteau
  restaurants: (
    <>
      <circle cx="24" cy="26" r="13" />
      <circle cx="24" cy="26" r="7" className="mark__accent" />
      <path d="M8 9v10a3 3 0 0 0 3 3M11 9v13M38 9c-2 0-3 4-3 7s1 5 3 5v10" className="mark__accent" />
    </>
  ),
  // un sac, et son anse
  retail: (
    <>
      <path d="M11 17h26l2 22H9z" />
      <path d="M18 17v-3a6 6 0 0 1 12 0v3" className="mark__accent" />
      <path d="M17 26h14" />
    </>
  ),
  // un lit, et une lampe de chevet
  hotels: (
    <>
      <path d="M7 34V18M7 26h26v8M41 34V26" />
      <path d="M13 21h8v5h-8z" className="mark__accent" />
      <path d="M41 26v-7M37 19h8l-2-5h-4z" className="mark__accent" />
      <path d="M7 38h34" />
    </>
  ),
  // trois engrenages en cascade, la nomenclature
  manufacturing: (
    <>
      <rect x="7" y="8" width="13" height="13" rx="2" />
      <rect x="28" y="8" width="13" height="13" rx="2" />
      <rect x="17" y="28" width="14" height="13" rx="2" className="mark__accent" />
      <path d="M13 21v4h11v3M34 21v4H24v3" />
    </>
  ),
  // une horloge, et un repere de lieu
  teams: (
    <>
      <circle cx="19" cy="21" r="13" />
      <path d="M19 14v7l5 3" className="mark__accent" />
      <path d="M36 24c3 0 6 3 6 6 0 4-6 11-6 11s-6-7-6-11c0-3 3-6 6-6z" className="mark__accent" />
      <circle cx="36" cy="30" r="2" />
    </>
  ),
  // un entonnoir, le pipeline
  crm: (
    <>
      <path d="M7 10h34L28 25v12l-8 5V25z" />
      <path d="M20 25h8" className="mark__accent" />
      <circle cx="24" cy="17" r="2.5" className="mark__accent" />
    </>
  ),
  // un parapluie
  insurance: (
    <>
      <path d="M5 24a19 19 0 0 1 38 0z" />
      <path d="M24 24v12a5 5 0 0 1-10 0" className="mark__accent" />
      <path d="M24 5v4" />
    </>
  ),
  // deux fleches qui bouclent, le flux
  automation: (
    <>
      <path d="M12 18a12 12 0 0 1 21-4" />
      <path d="M36 30a12 12 0 0 1-21 4" />
      <path d="M33 6v9h-9" className="mark__accent" />
      <path d="M15 42v-9h9" className="mark__accent" />
    </>
  ),
  // une etincelle a quatre branches
  ai: (
    <>
      <path d="M24 6c0 9 4 13 13 13-9 0-13 4-13 13 0-9-4-13-13-13 9 0 13-4 13-13z" />
      <path d="M38 30c0 4 2 6 6 6-4 0-6 2-6 6 0-4-2-6-6-6 4 0 6-2 6-6z" className="mark__accent" />
    </>
  ),
}

export default function ExpertiseMark({
  expertise,
  className,
}: {
  expertise: ExpertiseKey
  className?: string
}) {
  return (
    <svg
      className={['mark', className].filter(Boolean).join(' ')}
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {MARKS[expertise]}
    </svg>
  )
}
