import { RIPPLES } from './wave'

/**
 * Les nuanceurs de la vague.
 *
 * GLSL ES 1.00, donc pas d'indexation dynamique de tableau : la boucle sur les
 * ondes a des bornes constantes, ce que le compilateur deroule.
 */

export const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uAmplitude;
  uniform float uSize;
  uniform float uPixelRatio;
  // une onde par ligne : x, z, age en secondes, force
  uniform vec4 uRipples[${RIPPLES}];
  /**
   * Le fondu qui degage le texte, en fraction d'ecran.
   *
   * x et y : debut et fin du degrade. z : 0 pour un fondu horizontal, de la
   * gauche vers la droite, 1 pour un fondu vertical, du haut vers le bas.
   * w : l'opacite generale de la nappe.
   *
   * Il etait fait en CSS, par un "mask-image" sur la couche. Un masque plein
   * ecran force une passe de composition a chaque image : la nappe en
   * devenait saccadee au defilement et au survol. Ici il ne coute rien, c'est
   * une interpolation de plus sur un sommet.
   */
  uniform vec4 uMask;

  varying float vHeight;
  varying float vFade;

  /** La houle de fond : trois sinusoides croisees, lentes. */
  float swell(vec2 p) {
    float h = sin(p.x * 0.52 + uTime * 0.42) * 0.55;
    h += sin(p.y * 0.44 - uTime * 0.31) * 0.45;
    h += sin((p.x + p.y) * 0.29 + uTime * 0.2) * 0.3;
    return h;
  }

  void main() {
    vec2 p = vec2(position.x, position.z);

    float h = swell(p);

    // les ondes du curseur : un anneau qui s'eloigne du point touche et
    // s'eteint avec la distance et avec l'age
    for (int i = 0; i < ${RIPPLES}; i++) {
      vec4 r = uRipples[i];
      if (r.w <= 0.0) continue;
      float d = distance(p, r.xy);
      float ring = sin(d * 2.1 - r.z * 4.6);
      // Une seule exponentielle : exp(-a) * exp(-b) vaut exp(-(a + b)), et une
      // exponentielle par onde et par sommet, c'est 87 000 de moins par image.
      float decay = exp(-(d * 0.42 + r.z * 1.25));
      h += ring * decay * r.w * 1.15;
    }

    vec3 pos = position;
    pos.y += h * uAmplitude;

    vHeight = h;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;

    // La place du point a l'ecran, de 0 a 1. "gl_Position.w" peut etre nul ou
    // negatif derriere la camera : on le borne, sinon la division explose et
    // le point part a l'infini.
    float w = max(0.0001, gl_Position.w);
    vec2 screen = (gl_Position.xy / w + 1.0) * 0.5;
    float along = mix(screen.x, 1.0 - screen.y, step(0.5, uMask.z));
    float clear = smoothstep(uMask.x, uMask.y, along);

    // La nappe s'eteint deux fois : au loin, pour qu'elle ne soit pas coupee
    // net a l'horizon, et tout pres de la camera, pour qu'elle ne devienne
    // pas un tapis qui couvre le bas de l'ecran et passe sous le texte.
    float far = 1.0 - smoothstep(5.2, 8.1, length(p));
    float near = smoothstep(1.8, 4.6, -mv.z);
    vFade = far * near * clear * uMask.w;

    // la taille suit la perspective, mais plafonnee : sans cela les points du
    // premier rang deviennent des taches
    gl_PointSize = min(uSize * uPixelRatio / max(0.25, -mv.z), 4.2 * uPixelRatio);
  }
`

export const fragmentShader = /* glsl */ `
  precision mediump float;

  uniform vec3 uLow;
  uniform vec3 uHigh;

  varying float vHeight;
  varying float vFade;

  void main() {
    // Un point rond, aux bords adoucis : un carre se verrait a cette taille.
    // Pas de "discard" : il desactive le test de profondeur anticipe sur
    // beaucoup de cartes, et le materiau n'ecrit de toute facon pas dans la
    // profondeur. L'alpha fait le meme travail pour moins cher.
    float d = length(gl_PointCoord - 0.5);
    float edge = smoothstep(0.5, 0.16, d);

    // du peche dans les creux, de l'orange vif sur les cretes
    vec3 colour = mix(uLow, uHigh, clamp(vHeight * 0.45 + 0.5, 0.0, 1.0));

    gl_FragColor = vec4(colour, edge * vFade * 0.92);
  }
`
