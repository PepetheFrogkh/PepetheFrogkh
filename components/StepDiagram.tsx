/**
 * Le schema de chaque etape de la methode.
 *
 * Le cahier demande « une demo a chaque etape ». Les demos reelles, captures
 * et videos, ne sont pas fournies : ces schemas disent ce que l'etape fait,
 * au trait, dans les couleurs de la charte. Ce sont des illustrations du
 * propos, pas des captures de projet, donc ils n'inventent ni chiffre ni
 * preuve client.
 *
 * Chaque trait porte `pathLength="1"` : le dessin se trace au defilement en
 * animant `stroke-dashoffset`, sans dependre de la longueur reelle du chemin.
 */

const COMMON = {
  viewBox: '0 0 120 90',
  fill: 'none' as const,
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

const INK = '#14161F'
const ORANGE = '#FF6B00'
const TERRA = '#C2410C'
const SLATE = '#8A97AB'

/** 01 · Comprendre : des avis en vrac qui convergent vers un constat. */
function Understand() {
  const dots = [
    [14, 18], [30, 10], [46, 24], [20, 40], [38, 48], [12, 60],
    [28, 70], [48, 66], [22, 28], [40, 34],
  ]
  return (
    <svg {...COMMON} role="img" aria-label="Des avis dispersés qui convergent vers un constat">
      {dots.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={2} fill={SLATE} />
          <path
            className="dia__line"
            pathLength="1"
            d={`M ${x} ${y} Q ${(x + 92) / 2} ${(y + 45) / 2 - 6} 92 45`}
            stroke={SLATE}
            strokeOpacity={0.45}
          />
        </g>
      ))}
      <circle cx={92} cy={45} r={9} fill={ORANGE} />
      <path className="dia__line" pathLength="1" d="M 88 45 l 3 3 l 5 -6" stroke={INK} />
    </svg>
  )
}

/** 02 · Cadrer : un perimetre qui se referme sur ce qui compte. */
function Scope() {
  return (
    <svg {...COMMON} role="img" aria-label="Un périmètre qui se referme sur l’essentiel">
      <rect x={10} y={10} width={100} height={70} rx={8} stroke={SLATE} strokeDasharray="4 5" />
      <rect className="dia__grow" x={34} y={26} width={52} height={38} rx={6} stroke={TERRA} />
      <path className="dia__line" pathLength="1" d="M 34 26 l -10 0 l 0 -10" stroke={ORANGE} />
      <path className="dia__line" pathLength="1" d="M 86 26 l 10 0 l 0 -10" stroke={ORANGE} />
      <path className="dia__line" pathLength="1" d="M 34 64 l -10 0 l 0 10" stroke={ORANGE} />
      <path className="dia__line" pathLength="1" d="M 86 64 l 10 0 l 0 10" stroke={ORANGE} />
    </svg>
  )
}

/** 03 · Dessiner : la page prend forme, bloc par bloc. */
function Design() {
  return (
    <svg {...COMMON} role="img" aria-label="Une maquette de page, bloc par bloc">
      <rect x={14} y={10} width={92} height={70} rx={8} stroke={INK} />
      <rect className="dia__grow" x={22} y={20} width={34} height={6} rx={3} fill={ORANGE} />
      <rect className="dia__grow" x={22} y={32} width={76} height={4} rx={2} fill={SLATE} opacity={0.5} />
      <rect className="dia__grow" x={22} y={40} width={58} height={4} rx={2} fill={SLATE} opacity={0.5} />
      <rect className="dia__grow" x={22} y={52} width={22} height={18} rx={4} stroke={TERRA} />
      <rect className="dia__grow" x={50} y={52} width={22} height={18} rx={4} stroke={TERRA} />
      <rect className="dia__grow" x={78} y={52} width={20} height={18} rx={4} stroke={TERRA} />
    </svg>
  )
}

/** 04 · Construire : les briques s'empilent et s'assemblent. */
function Build() {
  return (
    <svg {...COMMON} role="img" aria-label="Des briques qui s’empilent et s’assemblent">
      <rect className="dia__grow" x={20} y={58} width={34} height={18} rx={4} stroke={INK} />
      <rect className="dia__grow" x={62} y={58} width={38} height={18} rx={4} stroke={INK} />
      <rect className="dia__grow" x={30} y={34} width={58} height={18} rx={4} stroke={TERRA} />
      <rect className="dia__grow" x={44} y={10} width={32} height={18} rx={4} fill={ORANGE} />
      <path className="dia__line" pathLength="1" d="M 60 28 l 0 6" stroke={SLATE} />
      <path className="dia__line" pathLength="1" d="M 42 52 l -4 6" stroke={SLATE} />
      <path className="dia__line" pathLength="1" d="M 76 52 l 4 6" stroke={SLATE} />
    </svg>
  )
}

/** 05 · Lancer : le site quitte l'atelier. */
function Launch() {
  return (
    <svg {...COMMON} role="img" aria-label="Le site qui part en ligne">
      <rect x={10} y={22} width={52} height={46} rx={8} stroke={SLATE} strokeDasharray="4 5" />
      <path className="dia__line" pathLength="1" d="M 34 60 L 34 30" stroke={TERRA} />
      <path className="dia__line" pathLength="1" d="M 26 38 L 34 28 L 42 38" stroke={TERRA} />
      <path
        className="dia__line"
        pathLength="1"
        d="M 66 45 C 82 45 86 30 104 30"
        stroke={ORANGE}
      />
      <path className="dia__line" pathLength="1" d="M 97 25 l 8 5 l -8 5" stroke={ORANGE} />
      <circle cx={34} cy={68} r={2.5} fill={INK} />
    </svg>
  )
}

/** 06 · Faire grandir : la courbe monte, mois apres mois. */
function Grow() {
  const points = [
    [16, 70], [34, 62], [52, 52], [70, 44], [88, 28], [104, 18],
  ]
  const d = points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x} ${y}`).join(' ')
  return (
    <svg {...COMMON} role="img" aria-label="Une courbe qui monte, mois après mois">
      <path d="M 12 78 L 108 78" stroke={SLATE} strokeOpacity={0.5} />
      <path d="M 12 78 L 12 12" stroke={SLATE} strokeOpacity={0.5} />
      <path className="dia__line" pathLength="1" d={d} stroke={ORANGE} strokeWidth={2} />
      {points.map(([x, y], i) => (
        <circle className="dia__grow" key={i} cx={x} cy={y} r={2.5} fill={i === points.length - 1 ? TERRA : INK} />
      ))}
    </svg>
  )
}

const DIAGRAMS = [Understand, Scope, Design, Build, Launch, Grow]

export default function StepDiagram({ index }: { index: number }) {
  const Diagram = DIAGRAMS[index] ?? DIAGRAMS[0]
  return (
    <div className="dia">
      <Diagram />
    </div>
  )
}
