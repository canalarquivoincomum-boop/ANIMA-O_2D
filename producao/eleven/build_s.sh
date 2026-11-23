#!/bin/bash
# build_s.sh SLUG FRAMES_DIR OUT.mp4 DUR — mistura voz (ElevenLabs) + trilha + efeitos (sidechain: a trilha abaixa sob a voz) e codifica
S=$1; FR=$2; OUT=$3; D=$4; A=$(dirname $0)
ffmpeg -v error -y -framerate 30 -i "$FR/f%05d.png" -i $A/${S}_voice.wav -i $A/${S}_bed.wav -i $A/${S}_sfx.wav -filter_complex "
[0:v]noise=alls=3:allf=t,format=yuv420p[v];
[1:a]asplit=2[vo][vsc];
[2:a][vsc]sidechaincompress=threshold=0.02:ratio=6:attack=15:release=350[bedd];
[vo][bedd][3:a]amix=inputs=3:weights=1 1 1:normalize=0,alimiter=limit=0.95,loudnorm=I=-14:TP=-1.5:LRA=9[a]" \
 -map "[v]" -map "[a]" -t $D -c:v libx264 -preset medium -crf 20 -maxrate 10M -bufsize 20M -r 30 -c:a aac -b:a 192k -movflags +faststart "$OUT"
echo "ok $OUT"
