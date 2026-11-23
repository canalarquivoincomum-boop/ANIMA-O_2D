#!/bin/bash
# render_all.sh PAGINA SAIDA_DIR FRAME_FINAL [WIDTH HEIGHT] — 4 processos em paralelo
PAGE=$1; OUT=$2; LAST=$3; W=${4:-576}; H=${5:-1024}
rm -rf "$OUT"; mkdir -p "$OUT"; N=4; STEP=$(( (LAST+1+N-1)/N ))
for i in $(seq 0 $((N-1))); do A=$((i*STEP)); B=$(( (i+1)*STEP-1 )); [ $B -gt $LAST ] && B=$LAST
  node "$(dirname $0)/engine/render.js" "$PAGE" "$OUT" --from $A --to $B --w $W --h $H & done; wait
echo "frames: $(ls $OUT | wc -l)"
