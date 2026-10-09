# Hanuman — scroll-driven product film

A pitch maquette for [Hanuman Beverages](https://hanumanbeverages.com.kh): the homepage
rebuilt around the product instead of the company. A raytraced film, scrubbed by the
scroll — one continuous camera move, six plans, no cut.

> The current site is a corporate shop window — brewery, CEO, a minimal carousel. It talks
> about the business. This talks about the beer: cold, gold, carbonated, poured.

**The hero is not realtime 3D.** It was, for a first pass, and it could not be made to
look like a beer ad: a browser rasteriser has no refraction through curved glass, no
caustics and no volumetric absorption, and those are most of the difference between "a 3D
demo" and "a photograph". The frames now come out of Cycles (`scripts/render/`) and the
page simply scrubs them, the way Apple's product pages do. The site ships 157 kB of
JavaScript instead of 530 kB, needs no WebGL at all, and looks the same on every device.

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
components/     the page: age gate, the scrubber, the overlay, the chrome
  FilmScrubber  decodes and draws the rendered frames against scroll
lib/            scroll driver, scene timings, brand facts, copy
public/film/    the frames and their manifest
public/stills/  one high-quality still per plan, and the reduced-motion poster
scripts/render/ the Blender/Cycles pipeline that makes all of the above
```

### Scroll

Lenis smooths the wheel, one GSAP `ScrollTrigger` spanning the document converts it to a
single 0 → 1 number, and that number picks a frame. The overlay copy is the only thing
React re-renders, and only when the active plan changes.

The scene timings in `lib/scrollState.ts` must match the plan boundaries in
`scripts/render/scene.py` — the copy is timed to what the frames are actually showing.

### The film

`scripts/render/scene.py` builds the whole set and renders it. There are no Blender
keyframes: each frame rebuilds the scene from its position in the scroll, so any frame can
be rendered on any machine with no shared state and the render farm is just the same
command with a different index.

```bash
python3 scripts/render/scene.py --frame 42 --frames 120 --res 1600 --samples 96 \
    --tex <tex-dir> --out 0042.png
python3 scripts/render/pack-film.py <frames-dir> public/film --width 1600 \
    --video public/film/hanuman.mp4
```

`scripts/render/README.md` covers why the glass has real thickness, why the colour comes
from volume absorption rather than surface tint, and why the rig is lit from behind.

### Loading

Frames load out of order: every eighth first, so the whole film is coarsely scrubbable
within about a second, then the gaps fill in. Until a frame has decoded the nearest one
that has is drawn, so scrolling is never blocked on a download. 120 frames at 1600 px is
about 6 MB in total, and none of it is on the critical path.

### Performance

- No WebGL, no 3D runtime, no shader compilation. A canvas and decoded JPEGs.
- 157 kB First Load JS, almost all of it Next and React.
- `prefers-reduced-motion` skips the sequence entirely and serves one still behind the
  static narrative.
- The heaviest thing on the page is the film, and it streams in coarse-to-fine.

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
| Mobile | checked at 390 × 844 in a headless browser, not profiled on a handset |
| Sound | the "pssht" is a real win and needs a mute control before it ships |
| Ingredients, Lite, medals, export map | plans 5, 7, 8 and the map half of 9 |
| Fluid simulation | the pour is a modelled stream, not a sim |
| Bubbles, condensation droplets | geometry-nodes work in Blender, not yet done |
| Motion blur | off, to keep render times down while art-directing |

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
