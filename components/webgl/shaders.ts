/**
 * Les shaders du champ de particules de l'en-tete.
 *
 * Tout le mouvement est calcule par la carte graphique, dans le vertex
 * shader : la position au repos, la respiration par bruit, la gravite du
 * curseur, l'onde de choc du clic et la morphologie vers les cadres d'ecrans
 * au defilement. Le processeur ne fait que pousser cinq uniformes par image,
 * ce qui permet de tenir 20 000 particules sans y laisser le fil principal.
 *
 * Le fond du site est clair : le melange est donc normal et non additif, sinon
 * les particules blanchiraient sur le creme au lieu de s'y poser.
 */

/** Bruit simplex 3D, pour la respiration de la ceinture. */
const SIMPLEX = /* glsl */ `
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);

  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;

  i = mod289(i);
  vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
    + i.x + vec4(0.0, i1.x, i2.x, 1.0));

  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);

  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);

  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}
`

export const VERTEX = /* glsl */ `
precision highp float;

attribute float aRing;    // 0, 1 ou 2 : l'orbite d'origine
attribute float aAngle;   // l'angle de depart sur l'orbite
attribute float aSpread;  // la dispersion autour de l'orbite
attribute float aSize;    // 1 a 3 px
attribute float aSeed;    // pour que chaque particule respire autrement
attribute vec3 aColor;
attribute vec3 aTarget;   // la place de la particule dans les cadres d'ecrans

uniform float uTime;
uniform float uTilt;
uniform vec2 uPointer;        // en unites de scene
uniform float uPointerActive; // 0 hors de la zone, 1 dedans
uniform vec2 uBurstOrigin;
uniform float uBurst;         // 1 au clic, retombe a 0 en une seconde
uniform float uMorph;         // 0 ceinture, 1 cadres d'ecrans
uniform float uIntro;         // 1 au chargement, retombe a 0 : l'arrivee
uniform float uPixelRatio;
uniform float uScale;

varying vec3 vColor;
varying float vAlpha;

${SIMPLEX}

/** Les trois orbites : demi-grand axe, demi-petit axe, et vitesse relative. */
vec3 ringParams(float ring) {
  if (ring < 0.5) return vec3(0.72, 0.22, 1.00);
  if (ring < 1.5) return vec3(0.95, 0.30, 0.90);
  return vec3(1.18, 0.38, 0.80);
}

void main() {
  vec3 params = ringParams(aRing);

  // ── la ceinture au repos ────────────────────────────────────────────────
  float angle = aAngle + uTime * 0.085 * params.z;
  vec2 ellipse = vec2(cos(angle) * params.x, sin(angle) * params.y) * aSpread * uScale;

  // l'inclinaison de la ceinture
  float c = cos(uTilt);
  float s = sin(uTilt);
  vec3 belt = vec3(ellipse.x * c - ellipse.y * s, ellipse.x * s + ellipse.y * c, 0.0);

  // la profondeur : la moitie avant de l'orbite passe devant le soleil
  float depth = sin(angle);
  belt.z = depth * params.y * 0.55 * uScale;

  // la respiration : un bruit lent, de faible amplitude, qui evite que la
  // ceinture ait l'air rigide
  float n = snoise(vec3(belt.xy * 1.6, uTime * 0.12 + aSeed * 8.0));
  belt += normalize(belt + vec3(0.001)) * n * 0.028 * uScale;

  // ── la morphologie vers les cadres d'ecrans ─────────────────────────────
  float morph = smoothstep(0.0, 1.0, uMorph);
  vec3 pos = mix(belt, aTarget * uScale, morph);

  // ── la gravite du curseur ───────────────────────────────────────────────
  // Les particules s'ecartent autour du curseur et s'enroulent dans son
  // sillage : une composante radiale qui repousse, une tangentielle qui fait
  // tourner. L'effet s'eteint avec la morphologie, pour ne pas desorganiser
  // les cadres.
  vec2 toPointer = pos.xy - uPointer;
  float dist = length(toPointer);
  float reach = 0.42 * uScale;
  float pull = (1.0 - smoothstep(0.0, reach, dist)) * uPointerActive * (1.0 - morph);
  if (pull > 0.001) {
    vec2 radial = normalize(toPointer + vec2(0.0001));
    vec2 swirl = vec2(-radial.y, radial.x);
    pos.xy += radial * pull * 0.3 * uScale;
    pos.xy += swirl * pull * pull * 0.22 * uScale;
    pos.z += pull * 0.1 * uScale;
  }

  // ── l'onde de choc du clic ──────────────────────────────────────────────
  // Un anneau d'impulsion part du curseur et s'eloigne : chaque particule
  // n'est poussee que lorsque le front la traverse.
  if (uBurst > 0.001) {
    vec2 toBurst = pos.xy - uBurstOrigin;
    float d = length(toBurst);
    float front = (1.0 - uBurst) * 1.9 * uScale;
    float band = 1.0 - smoothstep(0.0, 0.16 * uScale, abs(d - front));
    pos.xy += normalize(toBurst + vec2(0.0001)) * band * uBurst * 0.30 * uScale;
    pos.z += band * uBurst * 0.08 * uScale;
  }

  // ── l'arrivee ───────────────────────────────────────────────────────────
  // Au chargement, les particules viennent de loin et se posent sur leur
  // orbite. L'ecart part de la position finale, donc la ceinture se construit
  // au lieu d'apparaitre, et rien ne cache le texte de l'en-tete, qui est
  // dans une autre colonne.
  if (uIntro > 0.001) {
    float ease = uIntro * uIntro;
    vec3 outward = normalize(pos + vec3(0.0, 0.0, 0.2));
    pos += outward * ease * 2.6 * uScale;
    // une rotation supplementaire pendant la convergence
    float spin = ease * 1.1;
    float cs = cos(spin);
    float sn = sin(spin);
    pos.xy = vec2(pos.x * cs - pos.y * sn, pos.x * sn + pos.y * cs);
  }

  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mv;

  // Les plus grosses devant, pour la profondeur. Le facteur ramene la taille
  // a 1 a 3 px au plan de la ceinture, comme la charte le demande : une
  // perspective brute donnerait des disques de quarante pixels et la ceinture
  // deviendrait un bloc plein.
  float front = (depth + 1.0) * 0.5;
  float size = aSize * mix(0.7, 1.3, front) * mix(1.0, 0.85, morph);
  gl_PointSize = size * uPixelRatio * (3.2 / max(0.1, -mv.z));

  vColor = aColor;
  vAlpha = mix(0.45, 1.0, front) * mix(1.0, 0.85, morph) * (1.0 - uIntro * 0.75);
}
`

export const FRAGMENT = /* glsl */ `
precision mediump float;

varying vec3 vColor;
varying float vAlpha;

void main() {
  // un disque aux bords fondus : sans lui les particules sont des carres
  float d = length(gl_PointCoord - vec2(0.5));
  float alpha = smoothstep(0.5, 0.12, d) * vAlpha;
  if (alpha < 0.01) discard;
  gl_FragColor = vec4(vColor, alpha);
}
`
