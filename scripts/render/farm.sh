#!/usr/bin/env bash
# Render the film across however many machines or GPUs you have.
#
# Frames are independent — each one rebuilds the scene from its index — so
# there is no cache to share and no order to respect. Split the range and run
# the same command everywhere.
#
#   ./farm.sh <tex-dir> <out-dir> [frames] [res] [samples] [shard] [shards]
#
# One box:              ./farm.sh tex frames 120 3840 256
# Four boxes, box 2:    ./farm.sh tex frames 120 3840 256 1 4
#
# On a machine with a GPU, set CYCLES_DEVICE=GPU. Blender picks OptiX/CUDA/
# HIP/Metal itself; on this container there is no GPU and it stays on CPU.
set -euo pipefail

TEX=${1:?texture dir}
OUT=${2:?output dir}
FRAMES=${3:-120}
RES=${4:-1600}
SAMPLES=${5:-96}
SHARD=${6:-0}
SHARDS=${7:-1}

mkdir -p "$OUT"
for ((i = SHARD; i < FRAMES; i += SHARDS)); do
  f=$(printf %04d "$i")
  [ -f "$OUT/$f.png" ] && continue
  echo "frame $f"
  python3 "$(dirname "$0")/scene.py" \
    --frame "$i" --frames "$FRAMES" --res "$RES" --samples "$SAMPLES" \
    --tex "$TEX" --out "$OUT/$f.png"
done
echo "shard $SHARD/$SHARDS done"
