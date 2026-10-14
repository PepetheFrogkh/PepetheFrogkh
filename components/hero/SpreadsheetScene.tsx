'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import {
  Color,
  Euler,
  type Group,
  type InstancedMesh,
  Matrix4,
  type Mesh,
  NoToneMapping,
  type MeshBasicMaterial,
  type PerspectiveCamera,
  Quaternion,
  Vector3,
} from 'three'
import {
  CAMERA,
  CARD_H,
  CARD_W,
  CARD_Y,
  DESKTOP_COUNT,
  MOBILE_COUNT,
  buildLayout,
  cellSize,
  fitDistance,
} from './layout'

/**
 * « Le tableur qui se range. »
 *
 * Un seul InstancedMesh de cellules. Au depart elles forment une feuille de
 * calcul en desordre ; a l'arrivee, les memes cellules composent trois cartes
 * d'application empilees. Rien n'apparait et rien ne disparait : c'est la meme
 * matiere qui se range, ce qui est exactement le propos du studio.
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

/**
 * La camera recule juste assez pour que la pile de cartes et la feuille
 * tiennent dans le cadre, quel que soit son rapport.
 */
function FitCamera() {
  const camera = useThree((s) => s.camera) as PerspectiveCamera
  const size = useThree((s) => s.size)

  useEffect(() => {
    camera.position.set(0, 0, fitDistance(size.width / Math.max(1, size.height)))
    camera.updateProjectionMatrix()
  }, [camera, size.width, size.height])

  return null
}

/** Previent la page des que la premiere image est dessinee. */
function FirstFrame({ onPainted }: { onPainted: () => void }) {
  const done = useRef(false)
  useFrame(() => {
    if (done.current) return
    done.current = true
    onPainted()
  })
  return null
}

function Cells({ progress, count, still, magnet: magnetOn }: SceneProps) {
  const meshRef = useRef<InstancedMesh>(null)
  const cells = useMemo(() => buildLayout(count), [count])
  const cell = useMemo(() => cellSize(count), [count])

  /**
   * L'etat du ressort de chaque cellule : sa position dans le rangement et sa
   * vitesse. Deux tableaux plats plutot que des objets, pour ne rien allouer
   * dans la boucle de rendu.
   */
  const spring = useMemo(
    () => ({ value: new Float32Array(count), velocity: new Float32Array(count) }),
    [count],
  )

  const pointer = useRef({ x: 0, y: 0 })
  const ndc = useRef({ x: 0, y: 0 })
  const gl = useThree((s) => s.gl)

  /**
   * Le curseur est suivi sur la fenetre, pas sur le canvas.
   *
   * Le canvas est decoratif et ne recoit aucun evenement de pointeur, sinon il
   * volerait les clics au texte pose par-dessus. Sans cette ecoute, l'aimant
   * resterait collé au centre de la scene.
   */
  useEffect(() => {
    if (!magnetOn) return
    const el = gl.domElement
    const onMove = (event: PointerEvent) => {
      const box = el.getBoundingClientRect()
      if (box.width === 0 || box.height === 0) return
      ndc.current.x = ((event.clientX - box.left) / box.width) * 2 - 1
      ndc.current.y = -(((event.clientY - box.top) / box.height) * 2 - 1)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [gl, magnetOn])

  useFrame((state, rawDelta) => {
    const mesh = meshRef.current
    if (!mesh) return

    const delta = Math.min(0.05, rawDelta)
    const target = progress()

    // le curseur en unites de scene, mesure sur la camera du moment : elle
    // recule selon le rapport du cadre, donc une valeur figee decalerait
    // l'aimant de plusieurs cellules
    const camera = state.camera as PerspectiveCamera
    const halfH = Math.tan(((camera.fov / 2) * Math.PI) / 180) * camera.position.z
    const halfW = halfH * camera.aspect
    const px = ndc.current.x * halfW
    const py = ndc.current.y * halfH
    pointer.current.x += (px - pointer.current.x) * 0.12
    pointer.current.y += (py - pointer.current.y) * 0.12

    for (let i = 0; i < count; i++) {
      const item = cells[i]

      // ── la cible de cette cellule ───────────────────────────────────────
      // la vague : une cellule proche du centre se range avant les autres
      let local = (target - item.order * 0.42) / 0.58
      local = local < 0 ? 0 : local > 1 ? 1 : local

      // l'aimant : une cellule proche du curseur se range en avance
      const dx = item.from.x + (item.to.x - item.from.x) * local - pointer.current.x
      const dy = item.from.y + (item.to.y - item.from.y) * local - pointer.current.y
      const reach = 1.3
      const near = Math.max(0, 1 - Math.hypot(dx, dy) / reach)
      const magnet = magnetOn ? near * near : 0
      local = Math.min(1, local + magnet * 0.62)

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
      const ease = t
      position.set(
        item.from.x + (item.to.x - item.from.x) * ease,
        item.from.y + (item.to.y - item.from.y) * ease,
        item.from.z + (item.to.z - item.from.z) * ease + magnet * 0.3 * (1 - ease * 0.5),
      )

      euler.set(
        item.from.rx * (1 - ease),
        item.from.ry * (1 - ease),
        item.from.rz * (1 - ease),
      )
      quaternion.setFromEuler(euler)

      // l'echelle d'arrivee : plein pour l'en-tete et les barres, fin pour la
      // trame du fond
      const s = 1 + (item.toScale - 1) * ease
      scale.set(s, s, 1)

      matrix.compose(position, quaternion, scale)
      mesh.setMatrixAt(i, matrix)

      colour.copy(item.fromColor).lerp(item.toColor, Math.min(1, Math.max(0, ease)))
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
      {/* une cellule de tableur : une boite, plus large que haute */}
      <boxGeometry args={[cell.w, cell.h, cell.d]} />
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
      {CARD_Y.map((y) => (
        <mesh key={y} position={[0, y, -0.06]} receiveShadow>
          <planeGeometry args={[CARD_W + 0.24, CARD_H + 0.2]} />
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
  onPainted,
}: {
  progress: () => number
  mobile?: boolean
  still?: boolean
  onPainted?: () => void
}) {
  const count = mobile ? MOBILE_COUNT : DESKTOP_COUNT

  return (
    <Canvas
      // densite d'affichage plafonnee a 2, comme demande
      dpr={[1, 2]}
      camera={{ position: [0, 0, fitDistance(1)], fov: CAMERA.fov, near: 0.1, far: 40 }}
      // Sans cette ligne, le tone mapping par defaut grise les blancs et delave
      // le peche : la charte ne serait plus respectee a l'ecran.
      gl={{ antialias: true, alpha: true, toneMapping: NoToneMapping }}
      // une image fixe ne demande qu'un rendu
      frameloop={still ? 'demand' : 'always'}
      style={{ pointerEvents: 'none' }}
    >
      <FitCamera />
      {onPainted ? <FirstFrame onPainted={onPainted} /> : null}

      {/*
        Un eclairage doux, et calibre au pixel.

        Mesure faite sur le rendu : la face avant d'une cellule sortait a 85 %
        de sa couleur de charte, soit un peche brun et un orange terni. Les
        intensites sont donc calees pour que la face avant, celle qu'on lit,
        rende exactement #FF6B00 et #FFE3CF. Le calage se fait en espace
        lineaire, pas en sRGB, d'ou ces valeurs.
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
