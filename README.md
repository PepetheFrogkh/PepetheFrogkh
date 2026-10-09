# Hanuman — scroll-driven WebGL homepage

A three-day pitch maquette for [Hanuman Beverages](https://hanumanbeverages.com.kh): the
homepage rebuilt around the product instead of the company. One persistent WebGL canvas,
one continuous camera move, six plans driven entirely by scroll.

> The current site is a corporate shop window — brewery, CEO, a minimal carousel. It talks
> about the business. This talks about the beer: cold, gold, carbonated, poured.

---

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

Node 20+. No API keys, no asset downloads at runtime — the HDRI, the labels and the
bottles are all generated in-engine or in the browser.

Deploys to Vercel as-is (`vercel --prod`, framework auto-detected).

---

## What is in the maquette

The brief scopes three days to the four plans that sell, plus a Black teaser and a CTA.
That is exactly what is here.

| Plan | Brief | In this build |
| --- | --- | --- |
| 0 · Age gate | yes | yes — stored in `localStorage` |
| 1 · Drop → bottle | yes | gold drop falls, splashes, the Lager rises out of it |
| 2 · Condensation | the "wow" shot | 180° orbit, mist builds bottom-up, droplets run |
| 3 · Opening | yes | crown lifts and spins off, CO₂ puff |
| 4 · Pour + head | simplified shader | stream, fill, head that overshoots and settles |
| 5 · Ingredients | — | out of scope |
| 6 · Black | one fixed teaser | light falls, the drop goes black, Black turns |
| 7 · Lite | — | out of scope |
| 8 · Medals | — | out of scope (the Monde Selection line is in the CTA copy) |
| 9 · CTA | static | both bottles on a plinth, drop settles, CTA + socials |
| Khmer copy | — | out of scope; the `EN / ខ្មែរ` switch is on screen, Khmer disabled |

Also in, because they cost little and the pitch notices them: the drop-shaped progress
rail, the beer selector, cursor parallax on the lighting rig, `prefers-reduced-motion`
and no-WebGL fallbacks, and server-rendered copy for SEO.

---

## How it is built

```
app/            Next.js App Router — server-rendered copy, fonts, metadata
components/     the HTML layer (gate, overlay, chrome) and the canvas
components/three/
  Director.tsx  ← the storyboard. Every beat in the scroll is a number in here.
  Scene.tsx     the set: bottles, glass, pour, drop, rays, plinth, post
  Bottle.tsx    lathe glass + sleeved label + neck foil + crown
  Tumbler.tsx   the glass, its beer, its bubbles and its head
  shaders/      condensation, shared noise
lib/            scroll driver state, brand constants, label painter, profiles
scripts/        one-off asset preparation (Python)
```

### Scroll

Lenis smooths the wheel, one GSAP `ScrollTrigger` spanning the document converts it to a
single 0 → 1 number, and `Director` turns that number into the whole scene every frame.

Nothing animated is a React prop. The scroll value and all the derived state live in
plain mutable objects (`lib/scrollState.ts`, `lib/stageState.ts`) that components read
inside their own `useFrame`. React re-renders a handful of times across the whole page —
only when the active plan changes, so the overlay copy can cross-fade.

The camera is expressed as an orbit (angle, radius, height, target, fov) that runs
monotonically from 0 to about 2π. There is never a cut, which is the point of the format.

### Why the bottles are not the Meshy GLBs

The four GLBs supplied are 221k–364k triangles and 22–27 MB each — 15× to 24× the budget
— and, worse, Meshy welded the glass and the label into one opaque material with the
label chopped across hundreds of UV islands. You cannot make the glass transmissive
without losing the label, and you cannot replace the label without losing the glass. The
entire hero shot depends on both.

So the bottles are lathes of revolution. The profile is measured off the official
packshots (`scripts/measure-packshot.py`, raw data in `public/data/`) — both bottles come
out at 3.70–3.76 heights per body diameter, which matches a real 330 ml long-neck. The
label and the neck foil are thin cylinders sleeved over the glass, exactly as the real
object is assembled. About 15k triangles each, generated at load, no download.

The GLBs remain useful as a cross-check on proportion, and a decimated one would stand in
for a far background shot. They are not in this repository — they are too large to commit.

### Why the label is painted in the browser

The packshots Hanuman publishes are 335–554 px wide. That is a wireframe asset, not a
texture for a label the camera sits on for half the scroll. `lib/labelTexture.ts` paints
it instead, at 2048 × 1024, from the brand's own parts: the Hanuman figure lifted from the
full-resolution logo and re-sharpened (`scripts/extract-brand-marks.py`), the sunburst,
the Khmer name, the wordmark, the gold rules, the baseline. One 192 kB PNG mask ships; the
rest is canvas.

**This is the one thing to get from the client before the full build**: the vector label
artwork, or photography at 2000 px or better. A soft label is the first thing anyone
notices on their own bottle.

### Lighting

No downloaded HDRI. The environment probe is rendered in-engine from Lightformers — two
tall soft strips either side (exactly what a product photographer rigs to draw the two
bright edges down a bottle), a warm top bounce, a navy floor bounce so shadows are never
neutral grey, and a gold ring behind. `look.warmth` crossfades the whole rig from the
Lager's daylight to Black's bar, so plan 6 is a light change rather than a cut.

### The effects, in the order they matter

1. **Glass** — `MeshPhysicalMaterial`, transmission 1, IOR 1.52, attenuation tuned per
   beer (amber for the Lager, almost opaque for Black).
2. **Condensation** — patched into the bottle's own material rather than laid on as a
   decal shell. Transmission plus roughness is already frosted glass in three, so the
   effect is two fragment edits: raise roughness where the bottle has misted, drop it
   back inside each droplet and bend the normal. The droplets are lit, refracted and
   blurred by the same path as the glass; an alpha-blended shell never is.
3. **Pour** — a tapered cylinder with noise displacement, clipped from the top down by
   progress so it reads as falling. Deliberately not transmissive: that forces a second
   render-target pass every frame and, in motion, looks the same.
4. **Head** — a cylinder with a noise-displaced cap and a bubble field in the fragment
   shader, sheen on, slightly transmissive. It overshoots and settles.
5. **Bubbles** — points, not instanced spheres. A bubble is two or three pixels; a sprite
   with a rim highlight is cheaper and more convincing. Sized in metres and projected
   properly, so they do not blow up at close range.
6. **The drop** — a lathe of the teardrop curve `r = sinθ · sin(θ/2)`. It opens plan 1,
   returns black to hand over to plan 6, and settles between the bottles at the end.

### Performance

- One `<Canvas>`, never remounted. Scenes are groups that fade.
- Capability check at boot picks a quality tier: coarse pointer, small viewport or ≤ 4
  cores drops radial segments, particle counts, shadow maps, MSAA and depth of field, and
  caps DPR at 1.4.
- `AdaptiveDpr` + `AdaptiveEvents` give back resolution under load.
- Total 3D payload: 0 bytes of model data, ~220 kB of brand masks, everything else
  generated. First Load JS is ~530 kB, dominated by three.js.
- `prefers-reduced-motion` skips the canvas entirely and serves the static narrative.

### SEO and accessibility

The current site is close to invisible to a crawler. Here the whole narrative —
every plan's eyebrow, headline and subline, plus the three beers and where they are
brewed — is server-rendered HTML in the document, always. When the canvas runs it is
screen-reader text; without WebGL or with reduced motion it is simply shown. One copy,
no duplication, nothing to keep in sync.

---

## Known gaps, and what they would take

| Gap | Note |
| --- | --- |
| Label artwork | ask the brand for vector or 2000 px photography |
| Khmer copy | needs a translator; the type is already loaded (Noto Sans Khmer) |
| Mobile | checked at 390 × 844 in a headless browser — layout reflows, nav collapses, quality tier drops — but not profiled on a real handset |
| Sound | the "pssht" is a real win and needs a mute control before it ships |
| Ingredients, Lite, medals, export map | plans 5, 7, 8 and the map half of 9 |
| Pre-baked fluid sim | the shader pour is a stand-in for the full site |

## Brand safety

The brief flags the controversy around the Hanuman name in India and with Hindu
associations. Nothing here models, animates or anthropomorphises a deity. The only
depiction used is the brand's own label illustration, reproduced as artwork on the
packaging — never as a 3D figure, never animated, never handling the product.

## Copy note

The cans say "Greatness in every moment"; the site says "Greatness in every drop". Both
are used here: "every drop" opens on the falling drop, "every moment" closes the CTA.
Worth settling with the brand.

## Asset preparation

```bash
python3 scripts/measure-packshot.py packshot.png > public/data/measured-profile-lager.json
python3 scripts/extract-brand-marks.py logo-banner.jpg public/brand
```

Both are one-offs; their output is committed. They need `pillow` and `numpy`.
