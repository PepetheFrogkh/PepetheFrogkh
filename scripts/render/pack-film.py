#!/usr/bin/env python3
"""Turn a directory of rendered frames into the web film.

Writes progressive JPEGs plus the manifest the page reads. Frame count,
resolution and quality are all decided here rather than at render time, so
the same master frames can be repacked for a different target without
re-rendering anything.

    python3 scripts/render/pack-film.py <frames-dir> public/film --width 1600

Sizing: the page draws the film to a canvas with cover cropping, so the frame
only has to cover the widest viewport it will be shown on. 1600 px is a good
default — it is sharp on a laptop, and 120 frames of it is a download a
meeting-room connection can actually finish.
"""

import argparse
import json
import os
import glob

from PIL import Image


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("src")
    ap.add_argument("dst")
    ap.add_argument("--width", type=int, default=1600)
    ap.add_argument("--quality", type=int, default=82)
    ap.add_argument("--pattern", default="/film/%04d.jpg")
    ap.add_argument("--video", default="", help="also write an MP4 here")
    a = ap.parse_args()

    frames = sorted(glob.glob(os.path.join(a.src, "*.png")))
    if not frames:
        raise SystemExit(f"no frames in {a.src}")
    os.makedirs(a.dst, exist_ok=True)

    total = 0
    w = h = 0
    for i, f in enumerate(frames):
        im = Image.open(f).convert("RGB")
        if im.width != a.width:
            h = round(im.height * a.width / im.width)
            im = im.resize((a.width, h), Image.LANCZOS)
        w, h = im.size
        im.save(os.path.join(a.dst, f"{i:04d}.jpg"),
                quality=a.quality, optimize=True, progressive=True)
        total += os.path.getsize(os.path.join(a.dst, f"{i:04d}.jpg"))

    manifest = {"frames": len(frames), "width": w, "height": h, "pattern": a.pattern}
    with open(os.path.join(a.dst, "manifest.json"), "w") as fh:
        json.dump(manifest, fh)

    print(f"{len(frames)} frames at {w}×{h}, {total / 1e6:.1f} MB total, "
          f"{total / len(frames) / 1e3:.0f} kB each")

    if a.video:
        make_video(a.dst, a.video)


def make_video(src_dir, out_path, fps=25, crf=18):
    """Also emit an MP4 of the same frames.

    The brief asks for a backup video to show if the room's wifi fails, and
    it costs one ffmpeg call. Every frame is a keyframe (-g 1) so the file can
    also be scrubbed by `video.currentTime` if the image sequence is ever
    swapped for a video element.
    """
    import subprocess
    subprocess.run([
        "ffmpeg", "-y", "-framerate", str(fps),
        "-pattern_type", "glob", "-i", os.path.join(src_dir, "*.jpg"),
        "-c:v", "libx264", "-preset", "slow", "-crf", str(crf),
        "-g", "1", "-pix_fmt", "yuv420p",
        "-vf", "scale=trunc(iw/2)*2:trunc(ih/2)*2",
        out_path,
    ], check=True, capture_output=True)
    print(f"{out_path}: {os.path.getsize(out_path) / 1e6:.1f} MB")


if __name__ == "__main__":
    main()
