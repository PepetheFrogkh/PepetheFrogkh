'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import {
  Color,
  Euler,
  type Group,
  type InstancedMesh,
  Matrix4,
  type Mesh,
  NoToneMapping,
  type MeshBasicMaterial,
  Quaternion,
  Vector3,
} from 'three'
import {
  CAMERA,
  CARD_H,
  CARD_W,
  CARD_X,
  CELL,
  DESKTOP_COUNT,
  MOBILE_COUNT,
  buildLayout,
} from './layout'

/**
 * « Le tableur qui se range. »
 *
 * Un seul InstancedMesh de cellules en boites arrondies. Au depart elles
 * forment une feuille de calcul en desordre ; a l'arrivee, les memes cellules
 * composent trois cartes d'application. Rien n'apparait et rien ne disparait :
 * c'est la meme matiere qui se range, ce qui est exactement le propos du
 * studio.
 *
 * Le rangement est ressort, pas lineaire : chaque cellule a sa propre vitesse
 * et son propre rebond, et la vague part du centre vers les bords. La souris
 * agit comme un aimant : les cellules proches du curseur se rangent en avance
 * et se soulevent.
 */

interface SceneProps {
  /** De 0 a 1 : 0 en haut de page, 1 a la fin de la section suivante. */
  progress: () => number
  count: number
  /** Image fixe de l'etat final, sans aucune boucle. */
  still: boolean
  /** L'aimant du curseur : coupe sur mobile, ou le doigt n'a pas de survol. */
  magnet: boolean
}

const matrix = new Matrix4()
const position = new Vector3()
const scale = new Vector3(1, 1, 1)
const quaternion = new Quaternion()
const euler = new Euler()
const colour = new Color()

function Cells({ progress, count, still, magnet: magnetOn }: SceneProps) {
  const meshRef = useRef<InstancedMesh>(null)
  const cells = useMemo(() => buildLayout(count), [count])

  /**
   * L'etat du ressort de chaque cellule : sa position dans le rangement et sa
   * vitesse. Deux tableaux plats plutot que des objets, pour ne rien allouer
   * dans la boucle de rendu.
   */
  const spring = useMemo(
    () => ({ value: new Float32Array(count), velocity: new Float32Array(count) }),
    [count],
  )

  const pointer = useRef({ x: 0, y: 0, inside: 0 })
  const { viewport } = useThree()

  useFrame((state, rawDelta) => {
    const mesh = meshRef.current
    if (!mesh) return

    const delta = Math.min(0.05, rawDelta)
    const target = progress()

    // le curseur en unites de scene, pour l'aimant
    const px = (state.pointer.x * viewport.width) / 2
    const py = (state.pointer.y * viewport.height) / 2
    pointer.current.x += (px - pointer.current.x) * 0.12
    pointer.current.y += (py - pointer.current.y) * 0.12

    for (let i = 0; i < count; i++) {
      const cell = cells[i]

      // ── la cible de cette cellule ───────────────────────────────────────
      // la vague : une cellule proche du centre se range avant les autres
      let local = (target - cell.order * 0.42) / 0.58
      local = local < 0 ? 0 : local > 1 ? 1 : local

      // l'aimant : une cellule proche du curseur se range en avance
      const dx = cell.from.x + (cell.to.x - cell.from.x) * local - pointer.current.x
      const dy = cell.from.y + (cell.to.y - cell.from.y) * local - pointer.current.y
      const reach = 1.25
      const near = Math.max(0, 1 - Math.hypot(dx, dy) / reach)
      const magnet = magnetOn ? near * near : 0
      local = Math.min(1, local + magnet * 0.55)

      // ── le ressort ──────────────────────────────────────────────────────
      let t: number
      if (still) {
        t = 1
      } else {
        // raideur et amortissement : un rebond leger, jamais mecanique
        const stiffness = 92
        const damping = 15
        const force = (local - spring.value[i]) * stiffness - spring.velocity[i] * damping
        spring.velocity[i] += force * delta
        spring.value[i] += spring.velocity[i] * delta
        t = spring.value[i]
      }

      // ── la pose ─────────────────────────────────────────────────────────
      // un depassement doux : la cellule arrive, revient un peu, se pose
      const ease = t
      position.set(
        cell.from.x + (cell.to.x - cell.from.x) * ease,
        cell.from.y + (cell.to.y - cell.from.y) * ease,
        cell.from.z + (cell.to.z - cell.from.z) * ease + magnet * 0.22 * (1 - ease * 0.5),
      )

      euler.set(
        cell.from.rx * (1 - ease),
        cell.from.ry * (1 - ease),
        cell.from.rz * (1 - ease),
      )
      quaternion.setFromEuler(euler)

      // l'echelle d'arrivee : plein pour l'en-tete et les barres, fin pour la
      // trame du fond
      const s = 1 + (cell.toScale - 1) * ease
      scale.set(s, s, 1)

      matrix.compose(position, quaternion, scale)
      mesh.setMatrixAt(i, matrix)

      colour.copy(cell.fromColor).lerp(cell.toColor, Math.min(1, Math.max(0, ease)))
      mesh.setColorAt(i, colour)
    }

    mesh.instanceMatrix.needsUpdate = true
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
  })

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, count]}
      castShadow
      receiveShadow
      frustumCulled={false}
    >
      {/* une cellule de tableur : une boite arrondie, plus large que haute */}
      <boxGeometry args={[CELL.w, CELL.h, CELL.d]} />
      <meshStandardMaterial roughness={0.55} metalness={0} toneMapped={false} />
    </instancedMesh>
  )
}

/**
 * Les trois plaques blanches sous les cellules.
 *
 * Sans elles les cellules rangees flottent dans le vide et ne se lisent pas
 * comme des cartes. Les plaques n'existent qu'a l'arrivee : elles apparaissent
 * avec la fin du rangement.
 */
function CardPlates({ progress, still }: { progress: () => number; still: boolean }) {
  const group = useRef<Group>(null)

  useFrame(() => {
    const node = group.current
    if (!node) return
    const t = still ? 1 : progress()
    // la plaque n'arrive que sur le dernier tiers du rangement
    const shown = Math.max(0, Math.min(1, (t - 0.62) / 0.34))
    node.visible = shown > 0.01
    node.scale.setScalar(0.92 + shown * 0.08)
    node.children.forEach((child) => {
      const mesh = child as Mesh
      const material = mesh.material as MeshBasicMaterial
      material.opacity = shown
    })
  })

  return (
    <group ref={group} visible={false}>
      {CARD_X.map((x) => (
        <mesh key={x} position={[x, 0, -0.06]} receiveShadow>
          <planeGeometry args={[CARD_W + 0.2, CARD_H + 0.24]} />
          <meshBasicMaterial
            color="#FFFFFF"
            transparent
            opacity={0}
            // Un materiau transparent n'ecrit pas la profondeur par defaut :
            // sans cela, les cellules glissees derriere la plaque se dessinent
            // par-dessus et reapparaissent au milieu de la carte.
            depthWrite
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  )
}

export default function SpreadsheetScene({
  progress,
  mobile = false,
  still = false,
}: {
  progress: () => number
  mobile?: boolean
  still?: boolean
}) {
  const count = mobile ? MOBILE_COUNT : DESKTOP_COUNT

  return (
    <Canvas
      // densite d'affichage plafonnee a 2, comme demande
      dpr={[1, 2]}
      // la camera est legerement inclinee, pas de face
      camera={{ position: [0, 1.05, CAMERA.z], fov: CAMERA.fov, near: 0.1, far: 30 }}
      // Sans cette ligne, le tone mapping par defaut grise les blancs et delave
      // le peche : la charte ne serait plus respectee a l'ecran.
      gl={{ antialias: true, alpha: true, toneMapping: NoToneMapping }}
      // une image fixe ne demande qu'un rendu
      frameloop={still ? 'demand' : 'always'}
      style={{ pointerEvents: 'none' }}
    >
      {/*
        Un eclairage doux, et calibre au pixel.

        Mesure faite sur le rendu : la face avant d'une cellule sortait a 85 %
        de sa couleur de charte, soit un peche brun et un orange terni. Les
        intensites sont donc calees pour que la face avant, celle qu'on lit,
        rende exactement #FF6B00 et #FFE3CF. Le calage se fait en espace
        lineaire, pas en sRGB, d'ou ces valeurs.

        Les biseaux et les faces laterales saturent, et c'est voulu : ce sont
        eux qui donnent le peu de relief, la lecture des cartes prime.
      */}
      <ambientLight intensity={2.47} />
      <directionalLight position={[2.5, 4, 3.5]} intensity={0.75} castShadow={!mobile} />
      <directionalLight position={[-3, 1, 2]} intensity={0.26} />

      <group rotation={[CAMERA.tilt, 0, 0]}>
        <CardPlates progress={progress} still={still} />
        <Cells progress={progress} count={count} still={still} magnet={!mobile} />
      </group>
    </Canvas>
  )
}
