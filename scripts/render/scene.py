#!/usr/bin/env python3
"""Build the Hanuman product scene in Blender and render it with Cycles.

This is the offline half of the project. The WebGL page is a realtime
rasteriser and can never produce refraction through curved glass, caustics or
true depth of field; this can. The same measured bottle profile feeds both, so
the two stay the same object.

Run it with the `bpy` module (pip install bpy), not the Blender GUI:

    python3 scripts/render/scene.py --shot hero --res 1920 --samples 256 \
        --tex <texture-dir> --out <file.png>

Geometry notes that matter for realism:
  * The bottle is a real shell — an outer wall, a 2.8 mm glass thickness, a
    thick base and a punt. Zero-thickness glass is the usual shortcut and it
    is exactly why cheap renders look like plastic.
  * The beer is its own closed mesh with a slightly smaller radius, so there
    is a real glass/beer interface for light to bend at.
  * Volume absorption, not surface colour, gives the amber. Beer gets darker
    where it is deeper, which is what the eye reads as liquid.
"""

import argparse
import math
import os
import sys

import bpy  # noqa: F401  — must precede addon_utils, which bpy puts on sys.path
import addon_utils
import bmesh
from mathutils import Vector

# ── the measured bottle (scripts/measure-packshot.py, public/data/) ───────
BOTTLE_H = 0.23
BOTTLE_R = BOTTLE_H / 3.72 / 2

PROFILE = [
    (0.00, 0.000), (0.78, 0.000), (0.93, 0.006), (1.00, 0.018), (0.985, 0.030),
    (0.975, 0.100), (0.973, 0.300), (0.975, 0.500), (0.985, 0.570), (1.00, 0.605),
    (0.995, 0.630), (0.955, 0.665), (0.860, 0.700), (0.730, 0.730), (0.630, 0.757),
    (0.565, 0.785), (0.525, 0.820), (0.500, 0.865), (0.478, 0.915), (0.470, 0.945),
    (0.500, 0.957), (0.520, 0.968), (0.500, 0.980), (0.470, 0.985), (0.470, 1.000),
]

WALL = 0.0028        # 2.8 mm of glass
BASE = 0.009         # thick base
PUNT = 0.004         # the dome pushed up into the base
FILL = 0.80          # how far up the bottle the beer sits

LABEL_BAND = (0.22, 0.60)
COLLAR_BAND = (0.78, 0.95)


def clear():
    bpy.ops.wm.read_factory_settings(use_empty=True)


def radius_at(t):
    for i in range(1, len(PROFILE)):
        r0, t0 = PROFILE[i - 1]
        r1, t1 = PROFILE[i]
        if t0 <= t <= t1:
            k = 0 if t1 == t0 else (t - t0) / (t1 - t0)
            return (r0 + (r1 - r0) * k) * BOTTLE_R
    return BOTTLE_R


def lathe(name, points, segments=256, smooth=True):
    """Spin a 2-D profile (list of (r, y)) into a solid of revolution."""
    mesh = bpy.data.meshes.new(name)
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)

    bm = bmesh.new()
    verts = [bm.verts.new((r, 0.0, y)) for r, y in points]
    edges = [bm.edges.new((verts[i], verts[i + 1])) for i in range(len(verts) - 1)]
    bmesh.ops.spin(
        bm, geom=verts + edges, axis=(0, 0, 1), cent=(0, 0, 0),
        dvec=(0, 0, 0), angle=math.tau, steps=segments, use_merge=True,
    )
    bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=1e-6)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    bm.to_mesh(mesh)
    bm.free()

    if smooth:
        for p in mesh.polygons:
            p.use_smooth = True
        mesh.shade_smooth()
    return obj


def bottle_shell():
    """Outer wall up, over the lip, back down the inside, across the punt."""
    outer = [(r * BOTTLE_R, t * BOTTLE_H) for r, t in PROFILE if r > 0]
    pts = list(outer)

    top_r = outer[-1][0]
    pts.append((top_r - WALL, BOTTLE_H))                       # across the lip

    inner = []
    for r, t in reversed(PROFILE):
        if r <= 0:
            continue
        y = t * BOTTLE_H
        if y < BASE:
            break
        inner.append((max(r * BOTTLE_R - WALL, 0.001), y))
    pts += inner[1:]

    pts.append((radius_at(BASE / BOTTLE_H) - WALL, BASE))      # interior floor
    pts.append((BOTTLE_R * 0.30, BASE + PUNT))                 # punt dome
    pts.append((0.0, BASE + PUNT * 1.25))
    return pts


def bottle_liquid():
    top = FILL * BOTTLE_H
    pts = [(0.0, BASE + PUNT * 1.25), (BOTTLE_R * 0.30, BASE + PUNT)]
    pts.append((radius_at(BASE / BOTTLE_H) - WALL - 0.0002, BASE))
    for r, t in PROFILE:
        y = t * BOTTLE_H
        if BASE < y <= top:
            pts.append((max(r * BOTTLE_R - WALL - 0.0002, 0.001), y))
    pts.append((radius_at(top / BOTTLE_H) - WALL - 0.0002, top))
    pts.append((0.0, top))
    return pts


# ── the glass: a Willi Becher, 0.5 L, as poured across Phnom Penh ──────────
GLASS_H = 0.168
GLASS_R = 0.0375
GLASS_WALL = 0.0022


def glass_profile():
    """Outside up, over the rim, back down inside, across a thick base."""
    def outer(t):
        # slim foot, belly, slight taper back in at the lip
        return GLASS_R * (0.62 + 0.46 * math.sin(min(t, 0.78) / 0.78 * 1.35) - 0.07 * max(t - 0.8, 0))

    pts = [(0.0, 0.0), (GLASS_R * 0.60, 0.0), (GLASS_R * 0.62, 0.0025)]
    N = 36
    for i in range(N + 1):
        t = i / N
        pts.append((outer(t), 0.004 + t * (GLASS_H - 0.004)))
    pts.append((outer(1.0) - GLASS_WALL, GLASS_H))
    for i in range(N, -1, -1):
        t = i / N
        y = 0.004 + t * (GLASS_H - 0.004)
        if y < 0.013:
            break
        pts.append((max(outer(t) - GLASS_WALL, 0.002), y))
    pts.append((GLASS_R * 0.45, 0.013))
    pts.append((0.0, 0.0115))
    return pts


def glass_beer(level):
    """`level` is 0–1 of the usable interior height."""
    def outer(t):
        return GLASS_R * (0.62 + 0.46 * math.sin(min(t, 0.78) / 0.78 * 1.35) - 0.07 * max(t - 0.8, 0))

    top = 0.013 + (GLASS_H - 0.013 - 0.004) * level
    pts = [(0.0, 0.0125), (GLASS_R * 0.45 - 0.0004, 0.0130)]
    N = 36
    for i in range(N + 1):
        t = i / N
        y = 0.004 + t * (GLASS_H - 0.004)
        if 0.013 < y <= top:
            pts.append((max(outer(t) - GLASS_WALL - 0.0003, 0.002), y))
    pts.append((max(outer((top - 0.004) / (GLASS_H - 0.004)) - GLASS_WALL - 0.0003, 0.002), top))
    pts.append((0.0, top))
    return pts, top


# ── materials ──────────────────────────────────────────────────────────────
def node_mat(name):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree
    nt.nodes.clear()
    out = nt.nodes.new("ShaderNodeOutputMaterial")
    out.location = (600, 0)
    return m, nt, out


def amber_glass(name, absorb=(0.42, 0.14, 0.02), density=90.0, rough=0.015):
    """Brown bottle glass: a clear surface with a coloured volume behind it.

    Tinting the surface is the classic mistake — real bottle glass is clear
    glass with pigment through its thickness, so thin parts (the neck) are
    paler than thick parts (the base). Only a volume does that.
    """
    m, nt, out = node_mat(name)
    bsdf = nt.nodes.new("ShaderNodeBsdfPrincipled")
    bsdf.location = (300, 100)
    bsdf.inputs["Base Color"].default_value = (1, 1, 1, 1)
    bsdf.inputs["Roughness"].default_value = rough
    bsdf.inputs["IOR"].default_value = 1.52
    bsdf.inputs["Transmission Weight"].default_value = 1.0
    vol = nt.nodes.new("ShaderNodeVolumeAbsorption")
    vol.location = (300, -200)
    vol.inputs["Color"].default_value = (*absorb, 1)
    vol.inputs["Density"].default_value = density
    nt.links.new(bsdf.outputs[0], out.inputs["Surface"])
    nt.links.new(vol.outputs[0], out.inputs["Volume"])
    return m


def beer_mat(name, absorb=(0.98, 0.73, 0.26), density=55.0):
    m, nt, out = node_mat(name)
    bsdf = nt.nodes.new("ShaderNodeBsdfPrincipled")
    bsdf.location = (300, 100)
    bsdf.inputs["Base Color"].default_value = (1, 1, 1, 1)
    bsdf.inputs["Roughness"].default_value = 0.0
    bsdf.inputs["IOR"].default_value = 1.345
    bsdf.inputs["Transmission Weight"].default_value = 1.0
    vol = nt.nodes.new("ShaderNodeVolumeAbsorption")
    vol.location = (300, -200)
    vol.inputs["Color"].default_value = (*absorb, 1)
    vol.inputs["Density"].default_value = density
    nt.links.new(bsdf.outputs[0], out.inputs["Surface"])
    nt.links.new(vol.outputs[0], out.inputs["Volume"])
    return m


def label_mat(name, tex_dir, variant="lager"):
    m, nt, out = node_mat(name)
    bsdf = nt.nodes.new("ShaderNodeBsdfPrincipled")
    bsdf.location = (300, 0)

    uv = nt.nodes.new("ShaderNodeTexCoord")
    uv.location = (-800, 0)
    mapping = nt.nodes.new("ShaderNodeMapping")
    mapping.location = (-620, 0)
    mapping.inputs["Location"].default_value[0] = -0.5  # centre the emblem on u = 0
    nt.links.new(uv.outputs["UV"], mapping.inputs["Vector"])

    def img(path, non_colour=False):
        n = nt.nodes.new("ShaderNodeTexImage")
        n.image = bpy.data.images.load(path)
        if non_colour:
            n.image.colorspace_settings.name = "Non-Color"
        n.extension = "REPEAT"
        nt.links.new(mapping.outputs["Vector"], n.inputs["Vector"])
        return n

    col = img(os.path.join(tex_dir, f"label_{variant}_color.png"))
    col.location = (-400, 220)
    rough = img(os.path.join(tex_dir, f"label_{variant}_rough.png"), True)
    rough.location = (-400, -40)
    height = img(os.path.join(tex_dir, f"label_{variant}_height.png"), True)
    height.location = (-400, -320)

    bump = nt.nodes.new("ShaderNodeBump")
    bump.location = (-120, -320)
    bump.inputs["Strength"].default_value = 0.22
    bump.inputs["Distance"].default_value = 0.0006
    nt.links.new(height.outputs["Color"], bump.inputs["Height"])

    nt.links.new(col.outputs["Color"], bsdf.inputs["Base Color"])
    nt.links.new(rough.outputs["Color"], bsdf.inputs["Roughness"])
    nt.links.new(bump.outputs["Normal"], bsdf.inputs["Normal"])
    bsdf.inputs["Metallic"].default_value = 0.0
    bsdf.inputs["Coat Weight"].default_value = 0.08
    nt.links.new(bsdf.outputs[0], out.inputs["Surface"])
    return m


def metal_mat(name, colour, rough=0.22):
    m, nt, out = node_mat(name)
    b = nt.nodes.new("ShaderNodeBsdfPrincipled")
    b.location = (300, 0)
    b.inputs["Base Color"].default_value = (*colour, 1)
    b.inputs["Metallic"].default_value = 1.0
    b.inputs["Roughness"].default_value = rough
    nt.links.new(b.outputs[0], out.inputs["Surface"])
    return m


def clear_glass(name, rough=0.01):
    m, nt, out = node_mat(name)
    b = nt.nodes.new("ShaderNodeBsdfPrincipled")
    b.location = (300, 0)
    b.inputs["Base Color"].default_value = (1, 1, 1, 1)
    b.inputs["Roughness"].default_value = rough
    b.inputs["IOR"].default_value = 1.52
    b.inputs["Transmission Weight"].default_value = 1.0
    nt.links.new(b.outputs[0], out.inputs["Surface"])
    return m


def foam_mat(name, colour=(0.97, 0.93, 0.84)):
    """Dense fine-bubble head: bright, rough, and translucent at the edge."""
    m, nt, out = node_mat(name)
    b = nt.nodes.new("ShaderNodeBsdfPrincipled")
    b.location = (300, 0)
    b.inputs["Base Color"].default_value = (*colour, 1)
    b.inputs["Roughness"].default_value = 0.72
    b.inputs["Subsurface Weight"].default_value = 0.35
    b.inputs["Subsurface Radius"].default_value = (0.004, 0.0032, 0.0022)
    noise = nt.nodes.new("ShaderNodeTexNoise")
    noise.location = (-200, -200)
    noise.inputs["Scale"].default_value = 420.0
    noise.inputs["Detail"].default_value = 8.0
    bump = nt.nodes.new("ShaderNodeBump")
    bump.location = (60, -200)
    bump.inputs["Strength"].default_value = 0.45
    bump.inputs["Distance"].default_value = 0.0012
    nt.links.new(noise.outputs["Fac"], bump.inputs["Height"])
    nt.links.new(bump.outputs["Normal"], b.inputs["Normal"])
    nt.links.new(b.outputs[0], out.inputs["Surface"])
    return m


def floor_mat(name):
    """A navy sweep that falls off with height.

    Studios light the subject and the background separately; here the falloff
    is baked into the material instead of rigging a second set of lights, which
    keeps the sweep on-brand instead of blowing out to white paper.
    """
    m, nt, out = node_mat(name)
    b = nt.nodes.new("ShaderNodeBsdfPrincipled")
    b.location = (300, 0)
    b.inputs["Roughness"].default_value = 0.42   # spreads the light pools
    b.inputs["Metallic"].default_value = 0.0
    b.inputs["Specular IOR Level"].default_value = 0.38

    geo = nt.nodes.new("ShaderNodeNewGeometry")
    geo.location = (-760, 0)
    sep = nt.nodes.new("ShaderNodeSeparateXYZ")
    sep.location = (-580, 0)
    nt.links.new(geo.outputs["Position"], sep.inputs["Vector"])

    ramp = nt.nodes.new("ShaderNodeValToRGB")
    ramp.location = (-380, 0)
    ramp.color_ramp.interpolation = "EASE"
    ramp.color_ramp.elements[0].position = 0.0
    ramp.color_ramp.elements[0].color = (0.016, 0.030, 0.050, 1)   # near the bottle
    ramp.color_ramp.elements[1].position = 0.75
    ramp.color_ramp.elements[1].color = (0.002, 0.005, 0.011, 1)   # up the backdrop

    mapr = nt.nodes.new("ShaderNodeMapRange")
    mapr.location = (-520, -200)
    mapr.inputs["From Min"].default_value = 0.0
    mapr.inputs["From Max"].default_value = 1.1
    nt.links.new(sep.outputs["Z"], mapr.inputs["Value"])
    nt.links.new(mapr.outputs["Result"], ramp.inputs["Fac"])
    nt.links.new(ramp.outputs["Color"], b.inputs["Base Color"])
    nt.links.new(b.outputs[0], out.inputs["Surface"])
    return m


def band_mesh(name, band, inset, segments=256):
    """A sleeve hugging the bottle between two height fractions."""
    a, b = band
    pts = []
    N = 24
    for i in range(N + 1):
        t = a + (b - a) * i / N
        pts.append((radius_at(t) + inset, t * BOTTLE_H))
    obj = lathe(name, pts, segments)
    # cylindrical UVs so the label wraps once
    me = obj.data
    me.uv_layers.new(name="UVMap")
    uvl = me.uv_layers.active.data
    for poly in me.polygons:
        for li in poly.loop_indices:
            v = me.vertices[me.loops[li].vertex_index].co
            # u = 0 on the -Y face (the one the camera sees), increasing
            # toward +X, which is screen-right. atan2(-x, -y) runs the other
            # way and prints the label mirrored.
            u = (math.atan2(v.x, -v.y) / math.tau) % 1.0
            vv = (v.z / BOTTLE_H - a) / (b - a)
            uvl[li].uv = (u, vv)
    # mend the seam
    for poly in me.polygons:
        us = [uvl[li].uv[0] for li in poly.loop_indices]
        if max(us) - min(us) > 0.5:
            for li in poly.loop_indices:
                if uvl[li].uv[0] < 0.5:
                    uvl[li].uv[0] += 1.0
    return obj


# ── assembly ───────────────────────────────────────────────────────────────
def assign(obj, mat):
    obj.data.materials.clear()
    obj.data.materials.append(mat)


def build_bottle(tex_dir, variant="lager", location=(0, 0, 0), rotation_z=0.0,
                 cap_lift=0.0, cap_spin=0.0):
    amber = (0.42, 0.14, 0.02) if variant == "lager" else (0.30, 0.12, 0.04)
    density = 95.0 if variant == "lager" else 420.0
    # the bottle is narrower than the glass, so the same beer needs a lower
    # density to arrive at the same colour through less liquid
    beer_absorb = (0.98, 0.73, 0.26) if variant == "lager" else (0.55, 0.22, 0.05)
    beer_density = 38.0 if variant == "lager" else 520.0
    foil = (0.84, 0.66, 0.28)

    root = bpy.data.objects.new(f"bottle_{variant}", None)
    bpy.context.collection.objects.link(root)
    root.location = location
    root.rotation_euler[2] = rotation_z

    shell = lathe(f"glass_{variant}", bottle_shell())
    assign(shell, amber_glass(f"m_glass_{variant}", amber, density))

    liq = lathe(f"beer_{variant}", bottle_liquid())
    assign(liq, beer_mat(f"m_beer_{variant}", beer_absorb, beer_density))

    lab = band_mesh(f"label_{variant}", LABEL_BAND, 0.00012)
    assign(lab, label_mat(f"m_label_{variant}", tex_dir, variant))

    col = band_mesh(f"collar_{variant}", COLLAR_BAND, 0.00018)
    assign(col, metal_mat(f"m_collar_{variant}", foil, 0.18))

    # crown cap, with its 21 flutes
    cap_r = radius_at(0.99) + 0.0013
    bpy.ops.mesh.primitive_cylinder_add(vertices=21, radius=cap_r, depth=0.0062,
                                        location=(0, 0, BOTTLE_H + 0.0031 + cap_lift))
    cap = bpy.context.active_object
    cap.name = f"cap_{variant}"
    # a crown does not lift straight off, it tips and tumbles
    cap.rotation_euler = (cap_spin * 0.8, cap_spin * 0.45, cap_spin * 0.2)
    bpy.ops.object.shade_auto_smooth()
    assign(cap, metal_mat(f"m_cap_{variant}",
                          (0.02, 0.10, 0.22) if variant == "lager" else (0.75, 0.58, 0.22), 0.30))

    for o in (shell, liq, lab, col, cap):
        o.parent = root
    return root


def build_glass(level=0.74, foam_h=0.022, location=(0, 0, 0), etch=True, tex_dir=None):
    root = bpy.data.objects.new("glass_root", None)
    bpy.context.collection.objects.link(root)
    root.location = location

    g = lathe("tumbler", glass_profile(), 256)
    assign(g, clear_glass("m_tumbler", 0.008))

    beer_pts, top = glass_beer(level)
    b = lathe("glass_beer", beer_pts, 256)
    assign(b, beer_mat("m_glass_beer", (0.98, 0.73, 0.26), 55.0))

    # the head: a slightly domed disc sitting on the beer
    def outer(t):
        return GLASS_R * (0.62 + 0.46 * math.sin(min(t, 0.78) / 0.78 * 1.35) - 0.07 * max(t - 0.8, 0))

    rr = outer((top - 0.004) / (GLASS_H - 0.004)) - GLASS_WALL - 0.0004
    foam_pts = [(0.0, top), (rr, top), (rr, top + foam_h * 0.86)]
    N = 14
    for i in range(1, N + 1):
        k = i / N
        foam_pts.append((rr * math.cos(k * math.pi / 2) ** 0.55,
                         top + foam_h * (0.86 + 0.14 * math.sin(k * math.pi / 2))))
    f = lathe("head", foam_pts, 192)
    assign(f, foam_mat("m_foam"))

    objs = [g, b, f]

    if etch and tex_dir:
        # the Hanuman mark printed on the glass, as the real glassware carries it
        band = (0.46, 0.70)
        pts = []
        for i in range(25):
            t = band[0] + (band[1] - band[0]) * i / 24
            y = 0.004 + t * (GLASS_H - 0.004)
            pts.append((outer(t) + 0.00045, y))
        e = lathe("glass_print", pts, 256)
        me = e.data
        me.uv_layers.new(name="UVMap")
        uvl = me.uv_layers.active.data
        y0 = 0.004 + band[0] * (GLASS_H - 0.004)
        y1 = 0.004 + band[1] * (GLASS_H - 0.004)
        for poly in me.polygons:
            for li in poly.loop_indices:
                v = me.vertices[me.loops[li].vertex_index].co
                uvl[li].uv = ((math.atan2(v.x, -v.y) / math.tau) % 1.0, (v.z - y0) / (y1 - y0))
        for poly in me.polygons:
            us = [uvl[li].uv[0] for li in poly.loop_indices]
            if max(us) - min(us) > 0.5:
                for li in poly.loop_indices:
                    if uvl[li].uv[0] < 0.5:
                        uvl[li].uv[0] += 1.0
        assign(e, glass_print_mat("m_glass_print", tex_dir))
        objs.append(e)

    for o in objs:
        o.parent = root
    return root


def build_stream(p0, p1, r0=0.0048, r1=0.0030, rings=64, segs=28, wobble=0.22):
    """The pour itself: a tapered tube from the bottle mouth to the beer.

    A falling stream necks down as it accelerates and ripples along its
    length; both are modelled here rather than simulated. A real fluid sim is
    the right answer for the finished film — this is what a still needs, and
    it costs one mesh instead of a cache.
    """
    a, b = Vector(p0), Vector(p1)
    axis = b - a
    length = axis.length
    axis.normalize()
    up = Vector((0, 0, 1))
    side = axis.cross(up)
    if side.length < 1e-5:
        side = Vector((1, 0, 0))
    side.normalize()
    other = axis.cross(side).normalized()

    mesh = bpy.data.meshes.new("stream")
    obj = bpy.data.objects.new("stream", mesh)
    bpy.context.collection.objects.link(obj)

    bm = bmesh.new()
    rows = []
    for i in range(rings + 1):
        t = i / rings
        centre = a + axis * (length * t)
        # the stream drifts a little as it falls, and necks down
        drift = (math.sin(t * 5.1) * 0.0016 + math.sin(t * 11.3) * 0.0007) * wobble / 0.22
        centre = centre + side * drift
        r = (r0 + (r1 - r0) * t ** 0.7) * (1.0 + 0.10 * math.sin(t * 17.0 + 1.1))
        ring = []
        for j in range(segs):
            a2 = j / segs * math.tau
            rr = r * (1.0 + 0.07 * math.sin(a2 * 3 + t * 19.0))
            ring.append(bm.verts.new(centre + side * (math.cos(a2) * rr)
                                            + other * (math.sin(a2) * rr)))
        rows.append(ring)
    for i in range(rings):
        for j in range(segs):
            k = (j + 1) % segs
            bm.faces.new((rows[i][j], rows[i][k], rows[i + 1][k], rows[i + 1][j]))
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    bm.to_mesh(mesh)
    bm.free()
    for f in mesh.polygons:
        f.use_smooth = True
    mesh.shade_smooth()
    assign(obj, beer_mat("m_stream", (0.98, 0.72, 0.24), 190.0))
    return obj


def glass_print_mat(name, tex_dir):
    """White + gold screen print on the glass: opaque ink, clear elsewhere."""
    m, nt, out = node_mat(name)
    uv = nt.nodes.new("ShaderNodeTexCoord")
    uv.location = (-900, 0)
    mapping = nt.nodes.new("ShaderNodeMapping")
    mapping.location = (-720, 0)
    mapping.inputs["Location"].default_value[0] = -0.5
    nt.links.new(uv.outputs["UV"], mapping.inputs["Vector"])

    img = nt.nodes.new("ShaderNodeTexImage")
    img.image = bpy.data.images.load(os.path.join(tex_dir, "glass_print.png"))
    img.image.alpha_mode = "CHANNEL_PACKED"
    img.extension = "REPEAT"
    img.location = (-480, 0)
    nt.links.new(mapping.outputs["Vector"], img.inputs["Vector"])

    ink = nt.nodes.new("ShaderNodeBsdfPrincipled")
    ink.location = (-120, 180)
    ink.inputs["Roughness"].default_value = 0.34
    ink.inputs["Metallic"].default_value = 0.25
    nt.links.new(img.outputs["Color"], ink.inputs["Base Color"])

    clear = nt.nodes.new("ShaderNodeBsdfTransparent")
    clear.location = (-120, -120)

    mix = nt.nodes.new("ShaderNodeMixShader")
    mix.location = (200, 0)
    nt.links.new(img.outputs["Alpha"], mix.inputs["Fac"])
    nt.links.new(clear.outputs[0], mix.inputs[1])
    nt.links.new(ink.outputs[0], mix.inputs[2])
    nt.links.new(mix.outputs[0], out.inputs["Surface"])
    return m


def aim(obj, target=(0, 0, 0.10)):
    """Point a light at the subject instead of guessing Euler angles."""
    e = bpy.data.objects.new(obj.name + "_aim", None)
    bpy.context.collection.objects.link(e)
    e.location = target
    c = obj.constraints.new("TRACK_TO")
    c.target = e
    c.track_axis = "TRACK_NEGATIVE_Z"
    c.up_axis = "UP_Y"
    return obj


def area_light(name, loc, size, size_y, energy, colour=(1, 1, 1), target=(0, 0, 0.10)):
    d = bpy.data.lights.new(name, type="AREA")
    d.shape = "RECTANGLE"
    d.size = size
    d.size_y = size_y
    d.energy = energy
    d.color = colour
    o = bpy.data.objects.new(name, d)
    bpy.context.collection.objects.link(o)
    o.location = loc
    aim(o, target)
    return o


def lighting(warm=0.0, target=(0, 0, 0.10)):
    """The standard beverage rig, which is not the standard product rig.

    A bottle of beer is lit mostly from BEHIND. Two narrow strips at the rear
    quarters draw the bright vertical edges that read as glass, and a broad
    soft source directly behind pushes light through the liquid so the beer
    glows instead of going black. Only a weak, very large frontal source lifts
    the label. Light it from the front like a normal product and you get what
    a flat softbox reflection looks like: a white slab across the subject.
    """
    world = bpy.data.worlds.new("w")
    bpy.context.scene.world = world
    world.use_nodes = True
    bg = world.node_tree.nodes["Background"]
    bg.inputs[0].default_value = (0.013, 0.020, 0.032, 1)
    bg.inputs[1].default_value = 1.0

    # the two edge strips — narrow on purpose, so the highlight is a line
    area_light("rim_l", (-0.29, 0.21, 0.19), 0.030, 0.40,
               9.0 * (1 - 0.35 * warm), (1.00, 0.96, 0.90), target)
    area_light("rim_r", (0.29, 0.21, 0.19), 0.026, 0.38,
               6.0 * (1 - 0.40 * warm), (0.93, 0.96, 1.00), target)

    # the glow through the liquid
    # Backlight is the single most sensitive value in the rig: too much and
    # the beer clips to cream, because the view transform rolls blown
    # highlights toward white and takes the amber with it.
    area_light("back", (0.0, 0.42, 0.13), 0.42, 0.34,
               2.0 * (1 + 0.5 * warm), (1.00, 0.84, 0.52), target)

    # The frontal fill is small and far on purpose. A big close softbox in
    # front is what paints a flat white slab across the glass: its reflection
    # subtends more of the surface than the subject does. Small and distant
    # still lifts the label, and its reflection stays a highlight.
    area_light("front", (-0.42, -0.60, 0.26), 0.20, 0.28,
               2.4 * (1 - 0.55 * warm), (1.00, 0.97, 0.93), target)

    # separation on the foam and the shoulders
    area_light("top", (0.04, 0.06, 0.40), 0.26, 0.26,
               2.6 * (1 - 0.3 * warm), (1.00, 0.94, 0.84), target)


def frame_subject(height, lens, fill=0.78, aspect=16 / 10):
    """Distance at which a subject of `height` fills `fill` of the frame."""
    sensor_v = 36.0 / aspect
    vfov = 2 * math.atan(sensor_v / 2 / lens)
    return (height / fill) / (2 * math.tan(vfov / 2))


def orbit(az_deg, elev_deg, dist, target):
    """A camera position on a sphere round the subject. Azimuth 0 is -Y."""
    az, el = math.radians(az_deg), math.radians(elev_deg)
    return (
        target[0] + dist * math.cos(el) * math.sin(az),
        target[1] - dist * math.cos(el) * math.cos(az),
        target[2] + dist * math.sin(el),
    )


def camera(loc, look_at, lens=100.0, fstop=4.0):
    d = bpy.data.cameras.new("cam")
    d.lens = lens
    d.dof.use_dof = True
    d.dof.aperture_fstop = fstop
    o = bpy.data.objects.new("cam", d)
    bpy.context.collection.objects.link(o)
    o.location = loc
    tgt = bpy.data.objects.new("focus", None)
    bpy.context.collection.objects.link(tgt)
    tgt.location = look_at
    c = o.constraints.new("TRACK_TO")
    c.target = tgt
    c.track_axis = "TRACK_NEGATIVE_Z"
    c.up_axis = "UP_Y"
    d.dof.focus_object = tgt
    bpy.context.scene.camera = o
    return o


# ── shots ──────────────────────────────────────────────────────────────────
def floor(cyc=True, radius=3.0, height=2.6):
    """A cyclorama: the floor sweeps up into the backdrop with no seam.

    A flat infinite plane leaves a hard horizon and a single hot reflection of
    the key light. A curved sweep is what every product studio actually has,
    and it is most of why a render reads as "shot" rather than "made".
    """
    if not cyc:
        bpy.ops.mesh.primitive_plane_add(size=6, location=(0, 0, 0))
        p = bpy.context.active_object
        p.name = "floor"
        assign(p, floor_mat("m_floor"))
        return p

    mesh = bpy.data.meshes.new("cyclorama")
    obj = bpy.data.objects.new("cyclorama", mesh)
    bpy.context.collection.objects.link(obj)

    bm = bmesh.new()
    fillet = 1.70   # the sweep sits far behind the subject on purpose: with
                    # the softboxes pulled in close, inverse-square alone
                    # drops the backdrop several stops without a flag or a
                    # second lighting rig
    prof = [(-radius, 0.0)]
    N = 28
    for i in range(N + 1):
        a = (i / N) * (math.pi / 2)
        prof.append((fillet * (1 - math.sin(a)) * 0.0 + fillet - fillet * math.cos(a) * 0 + 0,
                     0))  # placeholder, replaced below
    prof = [(-radius, 0.0), (fillet, 0.0)]
    for i in range(1, N + 1):
        a = (i / N) * (math.pi / 2)
        prof.append((fillet + fillet * math.sin(a) * 0.0 + fillet * (1 - math.cos(a)),
                     fillet * math.sin(a)))
    prof.append((prof[-1][0], height))

    half = radius * 1.9
    rows = []
    for y, z in prof:
        rows.append([bm.verts.new((-half, y, z)), bm.verts.new((half, y, z))])
    for i in range(len(rows) - 1):
        bm.faces.new((rows[i][0], rows[i][1], rows[i + 1][1], rows[i + 1][0]))
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    bm.to_mesh(mesh)
    bm.free()
    for f in mesh.polygons:
        f.use_smooth = True
    mesh.shade_smooth()
    assign(obj, floor_mat("m_floor"))
    return obj


# ── the film: one continuous timeline, one scene rebuilt per frame ────────
#
# There are no Blender keyframes here. Each frame rebuilds the whole set from
# its position in the scroll, which means any frame can be rendered on any
# machine with no shared state — the render farm is just the same command with
# a different index. Building the meshes costs about a second; the render
# costs minutes.


def ease(t):
    t = min(max(t, 0.0), 1.0)
    return t * t * (3 - 2 * t)


def seg(t, a, b):
    """Normalise t within [a, b], clamped."""
    return min(max((t - a) / (b - a), 0.0), 1.0) if b > a else 0.0


def key(t, frames):
    """Piecewise interpolation over (time, value) pairs, smoothstepped.

    Values may be numbers or equal-length tuples.
    """
    if t <= frames[0][0]:
        return frames[0][1]
    for i in range(1, len(frames)):
        t0, v0 = frames[i - 1]
        t1, v1 = frames[i]
        if t <= t1:
            k = ease(seg(t, t0, t1))
            if isinstance(v0, (tuple, list)):
                return tuple(a + (b - a) * k for a, b in zip(v0, v1))
            return v0 + (v1 - v0) * k
    return frames[-1][1]


# The six plans of the brief, as time ranges on one unbroken shot.
PLAN_DROP = (0.00, 0.17)
PLAN_COLD = (0.17, 0.35)
PLAN_NECK = (0.35, 0.47)
PLAN_POUR = (0.47, 0.70)
PLAN_BLACK = (0.70, 0.87)
PLAN_CTA = (0.87, 1.00)

GLASS_X = 0.062


def film(t, tex_dir):
    """Build the frame of the film at normalised scroll position `t`."""
    floor()

    # ── the Lager: upright, tipped over the glass, then set down ─────────
    # Position is given as the base of the bottle and the mouth derived from
    # it, so the tip and the travel stay consistent with each other at every
    # value of t instead of being two animations that have to agree.
    tilt = key(t, [(0.00, 0.0), (0.49, 0.0), (0.61, math.radians(62)),
                   (0.665, math.radians(62)), (0.725, 0.0)])
    base = (key(t, [(0.00, 0.0), (0.47, 0.0), (0.61, -0.151), (0.725, -0.090)]),
            0.0,
            key(t, [(0.00, 0.0), (0.47, 0.0), (0.61, 0.192), (0.725, 0.0)]))
    spin = key(t, [(0.00, 13.0), (0.47, 13.0), (0.55, 0.0), (0.74, 0.0), (1.0, -3.0)])

    # The crown comes off during the neck macro and keeps going, out of
    # frame. It is the one beat in the brief that needs a moving part, and it
    # costs two numbers because the cap is already its own object.
    cap_lift = key(t, [(0.00, 0.0), (0.395, 0.0), (0.425, 0.013),
                       (0.47, 0.090), (0.55, 0.45)])
    cap_spin = key(t, [(0.00, 0.0), (0.395, 0.0), (0.55, 7.5)])

    lager = build_bottle(tex_dir, "lager", location=base,
                         rotation_z=math.radians(spin) if tilt < 1e-4 else 0.0,
                         cap_lift=cap_lift, cap_spin=cap_spin)
    if tilt > 1e-4:
        lager.rotation_euler = (0.0, tilt, 0.0)

    # ── Black walks on during the light dip, so the swap is never seen ───
    swap = 0.755
    if t >= swap:
        build_bottle(tex_dir, "black",
                     location=(key(t, [(swap, 0.0), (0.90, 0.0)]), 0.012, 0),
                     rotation_z=math.radians(key(t, [(swap, 13.0), (1.0, 11.0)])))

    # ── the glass: wheeled in for the pour, kept for the line-up ─────────
    glass_x = key(t, [(0.50, GLASS_X), (0.725, GLASS_X), (0.90, 0.090)])
    if t >= 0.50:
        level = key(t, [(0.52, 0.02), (0.655, 0.70), (1.0, 0.70)])
        foam_h = key(t, [(0.52, 0.004), (0.60, 0.034), (0.70, 0.024), (1.0, 0.022)])
        build_glass(level, foam_h, location=(glass_x, 0, 0), tex_dir=tex_dir)

        if 0.555 <= t <= 0.655:
            beer_top = 0.013 + (GLASS_H - 0.013 - 0.004) * level
            mouth = Vector(base) + Vector((BOTTLE_H * math.sin(tilt), 0.0,
                                           BOTTLE_H * math.cos(tilt)))
            build_stream(tuple(mouth + Vector((0.004, 0, -0.004))),
                         (glass_x + 0.002, 0.0, beer_top + foam_h * 0.45))

    # ── light: warm studio, a dip to near-black at the cut, then the bar ──
    warm = key(t, [(0.00, 0.0), (0.70, 0.0), (swap, 0.9), (1.0, 0.55)])
    dip = key(t, [(0.715, 1.0), (swap - 0.012, 0.03), (swap + 0.012, 0.03), (0.825, 1.0)])
    lighting(warm, target=(0.0, 0, 0.12))
    for name in ("rim_l", "rim_r", "back", "front", "top"):
        bpy.data.lights[name].energy *= dip
    bpy.context.scene.world.node_tree.nodes["Background"].inputs[1].default_value = dip

    # ── camera: one orbit, never cut ─────────────────────────────────────
    az = key(t, [(0.00, 14), (0.17, 22), (0.35, 178), (0.47, 196),
                 (0.61, 9), (0.70, 3), (swap, 9), (1.0, 5)])
    elev = key(t, [(0.00, 9), (0.35, 4), (0.47, 13), (0.70, 4), (1.0, 8)])
    lens = key(t, [(0.00, 100), (0.35, 100), (0.47, 135), (0.61, 85),
                   (0.70, 100), (1.0, 105)])
    subject = key(t, [(0.00, 0.30), (0.17, 0.245), (0.35, 0.245), (0.47, 0.085),
                      (0.61, 0.345), (0.70, 0.30), (0.87, 0.30), (1.0, 0.40)])
    tz = key(t, [(0.00, 0.118), (0.35, 0.118), (0.47, 0.214), (0.61, 0.145),
                 (0.70, 0.112), (1.0, 0.108)])
    tx = key(t, [(0.00, 0.0), (0.47, 0.0), (0.61, 0.012), (0.70, 0.0),
                 (0.90, 0.010), (1.0, 0.010)])

    tgt = (tx, 0.0, tz)
    d = frame_subject(subject, lens, fill=0.84)
    camera(orbit(az, elev, d, tgt), tgt, lens=lens,
           fstop=key(t, [(0.00, 5.0), (0.47, 3.2), (0.70, 4.5), (1.0, 7.5)]))


SHOTS = {}


def shot(fn):
    SHOTS[fn.__name__] = fn
    return fn


@shot
def hero(tex_dir):
    """Plan 1–2: the Lager alone, three-quarter, full height."""
    floor()
    build_bottle(tex_dir, "lager", rotation_z=math.radians(13))
    lighting(0.0)
    tgt = (0, 0, 0.118)
    d = frame_subject(BOTTLE_H, 100, fill=0.88)
    camera(orbit(16, 5, d, tgt), tgt, lens=100, fstop=4.5)


@shot
def pour(tex_dir):
    """Plan 4: the bottle tipped over a full 0.5 L glass."""
    floor()
    # Tip about Y, toward the glass at +X. The mouth then lands at
    # location + (H·sin b, 0, H·cos b), which is how the position below was
    # chosen rather than nudged by eye.
    tilt = math.radians(62)
    mouth_off = Vector((BOTTLE_H * math.sin(tilt), 0.0, BOTTLE_H * math.cos(tilt)))
    mouth = Vector((0.052, 0.0, 0.300))
    b = build_bottle(tex_dir, "lager", location=tuple(mouth - mouth_off))
    b.rotation_euler = (0.0, tilt, 0.0)

    glass_x = 0.062
    level, foam_h = 0.52, 0.030
    build_glass(level, foam_h, location=(glass_x, 0, 0), tex_dir=tex_dir)
    beer_top = 0.013 + (GLASS_H - 0.013 - 0.004) * level

    build_stream(tuple(mouth + Vector((0.004, 0, -0.004))),
                 (glass_x + 0.002, 0.0, beer_top + foam_h * 0.45))

    lighting(0.0, target=(0.02, 0, 0.14))
    tgt = (0.0, 0, 0.145)
    d = frame_subject(0.34, 85, fill=0.84)
    camera(orbit(9, 4, d, tgt), tgt, lens=85, fstop=4.0)


@shot
def glass(tex_dir):
    """The glass on its own — the shot that has to look like a photograph."""
    floor()
    build_glass(0.76, 0.026, tex_dir=tex_dir)
    lighting(0.0)
    tgt = (0, 0, 0.088)
    d = frame_subject(GLASS_H, 100, fill=0.84)
    camera(orbit(12, 6, d, tgt), tgt, lens=100, fstop=4.0)


@shot
def duo(tex_dir):
    """Plan 9: the line-up."""
    floor()
    build_bottle(tex_dir, "lager", location=(-0.048, 0, 0), rotation_z=math.radians(-2))
    build_bottle(tex_dir, "black", location=(0.048, 0.014, 0), rotation_z=math.radians(12))
    lighting(0.45)
    tgt = (0, 0, 0.112)
    d = frame_subject(BOTTLE_H, 100, fill=0.70)
    camera(orbit(6, 7, d, tgt), tgt, lens=100, fstop=6.0)


@shot
def black(tex_dir):
    floor()
    build_bottle(tex_dir, "black", rotation_z=math.radians(13))
    lighting(0.9)
    tgt = (0, 0, 0.118)
    d = frame_subject(BOTTLE_H, 100, fill=0.88)
    camera(orbit(16, 5, d, tgt), tgt, lens=100, fstop=4.5)


def configure(res, samples, threads=0, caustics=True):
    sc = bpy.context.scene
    addon_utils.enable("cycles", default_set=True)
    sc.render.engine = "CYCLES"
    # CYCLES_DEVICE=GPU on a machine that has one; Blender picks the backend
    # (OptiX, CUDA, HIP, Metal) itself.
    want_gpu = os.environ.get("CYCLES_DEVICE", "CPU").upper() == "GPU"
    if want_gpu:
        prefs = bpy.context.preferences.addons["cycles"].preferences
        prefs.refresh_devices()
        for dev in prefs.devices:
            dev.use = dev.type != "CPU"
        sc.cycles.device = "GPU"
    else:
        sc.cycles.device = "CPU"
    sc.cycles.samples = samples
    sc.cycles.use_adaptive_sampling = True
    sc.cycles.adaptive_threshold = 0.012
    sc.cycles.use_denoising = True
    sc.cycles.max_bounces = 32
    sc.cycles.transmission_bounces = 24      # glass inside glass inside beer
    sc.cycles.transparent_max_bounces = 24
    sc.cycles.glossy_bounces = 8
    sc.cycles.caustics_reflective = caustics
    sc.cycles.caustics_refractive = caustics
    sc.cycles.blur_glossy = 0.6

    sc.render.resolution_x = res
    sc.render.resolution_y = round(res * 10 / 16)
    sc.render.resolution_percentage = 100
    sc.render.film_transparent = False
    sc.render.image_settings.file_format = "PNG"
    sc.render.image_settings.color_depth = "16"
    if threads:
        sc.render.threads_mode = "FIXED"
        sc.render.threads = threads

    # AgX desaturates hard, which murders a navy-and-gold identity. Khronos
    # PBR Neutral is built for product rendering: it keeps hue and saturation
    # and still rolls highlights off gracefully.
    sc.view_settings.view_transform = "Khronos PBR Neutral"
    sc.view_settings.exposure = -0.40


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--shot", default="hero",
                    help="a still from SHOTS, or 'film' with --frame")
    ap.add_argument("--frame", type=int, default=-1,
                    help="film frame index; implies --shot film")
    ap.add_argument("--frames", type=int, default=160, help="length of the film")
    ap.add_argument("--res", type=int, default=1280)
    ap.add_argument("--samples", type=int, default=128)
    ap.add_argument("--tex", required=True)
    ap.add_argument("--out", required=True)
    ap.add_argument("--threads", type=int, default=0)
    ap.add_argument("--no-caustics", action="store_true")
    ap.add_argument("--save-blend", default="")
    a = ap.parse_args()

    clear()
    configure(a.res, a.samples, a.threads, not a.no_caustics)
    if a.frame >= 0:
        film(a.frame / max(a.frames - 1, 1), a.tex)
    else:
        if a.shot not in SHOTS:
            raise SystemExit(f"unknown shot {a.shot!r}; have {sorted(SHOTS)}")
        SHOTS[a.shot](a.tex)

    if a.save_blend:
        bpy.ops.wm.save_as_mainfile(filepath=os.path.abspath(a.save_blend))

    bpy.context.scene.render.filepath = os.path.abspath(a.out)
    bpy.ops.render.render(write_still=True)
    print(f"wrote {a.out}")


if __name__ == "__main__":
    main()
