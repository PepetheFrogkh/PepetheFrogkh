import * as THREE from 'three'
import { NOISE } from './noise.glsl'

/**
 * Condensation, patched into the bottle's own MeshPhysicalMaterial rather than
 * laid on as a decal shell. Transmission plus roughness is already frosted
 * glass in three, so the whole effect is two fragment edits: raise roughness
 * where the bottle has misted over, and drop it back inside each droplet while
 * bending the normal. The droplets are therefore lit, refracted and blurred by
 * the same path as the glass — a separate alpha-blended shell never is.
 *
 * Two fields, deliberately separated. The mist is low-frequency and only ever
 * touches roughness; the droplets are the only thing allowed to move the
 * normal. Letting fine noise into the normal turns a specular product rig into
 * a field of aliasing sparkle, which is the first thing that reads as "CGI".
 */

export interface CondensationUniforms {
  uTime: { value: number }
  /** 0 = dry bottle, 1 = fully misted. */
  uReveal: { value: number }
  /** How far the big droplets have slid. */
  uDrip: { value: number }
  uBumpScale: { value: number }
  uFrost: { value: number }
}

export function makeCondensationUniforms(): CondensationUniforms {
  return {
    uTime: { value: 0 },
    uReveal: { value: 0 },
    uDrip: { value: 0 },
    uBumpScale: { value: 0.55 },
    uFrost: { value: 0.34 },
  }
}

const DROPLETS = /* glsl */ `
// A 330 ml bottle is about 190 mm round and 230 mm tall, so the cell grid is
// stretched to match and the droplets come out circular rather than oval.
const vec2 CELL_ASPECT = vec2(1.0, 1.21);

// One droplet per cell, jittered, sliding downward as uDrip grows. Returns a
// smooth height field: no hard edges, nothing above the pixel frequency.
float dropLayer(vec2 uv, float cells, float seed, float slide, float sizeMul){
  vec2 st = uv * cells * CELL_ASPECT;
  vec2 base = floor(st);
  float h = 0.0;
  for (int j = -1; j <= 1; j++){
    for (int i = -1; i <= 1; i++){
      vec2 cell = base + vec2(float(i), float(j));
      vec2 rnd = hash22(cell + seed);
      // only about half the cells carry a drop, so they never tile
      float live = step(0.46, hash21(cell * 1.7 + seed));
      if (live < 0.5) continue;

      float r = (0.17 + 0.16 * rnd.x) * sizeMul;
      float travel = slide * (0.35 + 0.8 * rnd.y);
      vec2 centre = cell + vec2(0.18 + rnd.x * 0.64, fract(0.2 + rnd.y * 0.6 - travel));

      float d = length(st - centre);
      // smooth dome, flat outside: this is what keeps the derivative tame
      float dome = 1.0 - smoothstep(r * 0.35, r, d);
      dome = dome * dome;

      // the wet trail the drop leaves as it runs
      float dy = st.y - centre.y;
      float trail = smoothstep(r * 0.45, 0.0, abs(st.x - centre.x))
                  * smoothstep(0.0, r * 0.8, dy)
                  * (1.0 - smoothstep(0.0, travel + 0.08, dy))
                  * 0.28;

      h = max(h, dome + trail);
    }
  }
  return h;
}

/** Big and small droplets only — no high-frequency noise in here. */
float dropletHeight(vec2 uv, float drip){
  float big   = dropLayer(uv, 17.0, 7.3, drip, 1.0);
  float small = dropLayer(uv, 31.0, 21.9, drip * 0.4, 0.75);
  return max(big, small * 0.65);
}

/** The haze between the droplets. Roughness only. */
float mistHeight(vec2 uv, float t){
  return fbm(uv * vec2(9.0, 11.0) + vec2(0.0, t * 0.01));
}
`

export function patchCondensation(
  material: THREE.MeshPhysicalMaterial,
  uniforms: CondensationUniforms,
) {
  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms)

    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec2 vCondUv;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvCondUv = uv;')

    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        `#include <common>
         varying vec2 vCondUv;
         uniform float uTime;
         uniform float uReveal;
         uniform float uDrip;
         uniform float uBumpScale;
         uniform float uFrost;
         ${NOISE}
         ${DROPLETS}`,
      )
      // The chill creeps up from the base, so the mist reveals bottom-first.
      .replace(
        '#include <roughnessmap_fragment>',
        `#include <roughnessmap_fragment>
         float condMask = uReveal * smoothstep(0.0, 0.3, uReveal * 1.45 - vCondUv.y * 0.45);
         float condDrops = dropletHeight(vCondUv, uDrip) * condMask;
         float condMist = mistHeight(vCondUv, uTime) * condMask;
         float wet = smoothstep(0.08, 0.5, condDrops);
         roughnessFactor = mix(roughnessFactor, uFrost * (0.6 + condMist * 0.6), condMask);
         roughnessFactor = mix(roughnessFactor, 0.025, wet);`,
      )
      .replace(
        '#include <normal_fragment_maps>',
        `#include <normal_fragment_maps>
         if (condDrops > 0.001) {
           vec3 dpx = dFdx(-vViewPosition);
           vec3 dpy = dFdy(-vViewPosition);
           float dhx = dFdx(condDrops);
           float dhy = dFdy(condDrops);
           vec3 n = normalize(normal);
           vec3 r1 = cross(dpy, n);
           vec3 r2 = cross(n, dpx);
           float det = dot(dpx, r1);
           vec3 surf = sign(det) * (dhx * r1 + dhy * r2);
           normal = normalize(abs(det) * n - uBumpScale * surf);
         }`,
      )
  }
  material.customProgramCacheKey = () => 'hanuman-condensation'
  material.needsUpdate = true
}
