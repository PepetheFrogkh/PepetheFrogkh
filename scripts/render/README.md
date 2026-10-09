# Offline render pipeline

The WebGL page is a realtime rasteriser. It cannot do refraction through
curved glass, caustics, volumetric absorption or true depth of field — and
those four things are most of what separates "a 3D demo" from "a beer ad".
This directory is the other half of the project: the same bottle, built from
the same measured profile, rendered in Cycles.

## What is here

| File | Does |
| --- | --- |
| `make_label.py` | paints the label at 4096×2048 plus its roughness and height maps |
| `scene.py` | builds the whole set in Blender and renders a shot with Cycles |

Both run against `bpy`, Blender shipped as a Python module — no GUI, no
install, works headless:

```bash
pip install bpy fonttools brotli pillow numpy
python3 scripts/render/make_label.py <marks-dir> <fonts-dir> <tex-dir>
python3 scripts/render/scene.py --shot hero --res 1600 --samples 160 \
    --tex <tex-dir> --out hero.png
```

Shots: `hero`, `glass`, `pour`, `duo`, `black`. Add `--save-blend out.blend`
to get a .blend you can open and keep art-directing by hand.

## The decisions that matter

**Real glass thickness.** The bottle is a shell: outer wall, 2.8 mm of glass,
a thick base and a punt. Zero-thickness glass is the usual shortcut and it is
exactly why cheap renders look like plastic.

**Volume absorption, not surface tint.** Brown bottle glass is clear glass
with pigment through its thickness, so the thin neck is paler than the thick
base. Only a volume does that. Same for the beer: it is darker where it is
deeper, which is what the eye reads as liquid rather than orange paint.

**Backlighting.** A bottle of beer is lit mostly from behind. Two narrow
strips at the rear quarters draw the bright vertical edges that read as
glass; a broad soft source directly behind pushes light through the liquid so
it glows. Only a small, distant frontal source lifts the label. Light it from
the front like an ordinary product and a big softbox reflection paints a
white slab across the subject — which is the single most common tell.

**Khronos PBR Neutral, not AgX.** AgX desaturates hard, which murders a
navy-and-gold identity. Khronos PBR Neutral is built for product rendering:
it keeps hue and saturation and still rolls highlights off gracefully.

**A cyclorama, not a plane.** The floor sweeps up into the backdrop with no
seam, and the softboxes sit close to the subject so inverse-square drops the
backdrop several stops without a second lighting rig.

## Cost, measured on 4 CPU cores with no GPU

| | 256 samples |
| --- | --- |
| 1080p | ~13 min / frame |
| 4K | ~53 min / frame |
| 8K | ~3.5 h / frame |

Measured rate: **1.35 s per megapixel-sample**. A single modern GPU is
roughly 50× that, so a 4K frame is about a minute and a ten-second 4K
sequence at 25 fps is about four and a half hours — a few euros of rented
GPU time. The compute is not the obstacle.

## Not done

Fluid simulation for the pour (the stream here is modelled, not simulated),
condensation as real droplet geometry, bubbles rising in the beer, and motion
blur. All are Blender work rather than new problems.
