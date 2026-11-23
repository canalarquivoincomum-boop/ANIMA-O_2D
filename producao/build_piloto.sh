#!/bin/bash
# build_piloto.sh FRAMES_DIR SAIDA.mp4 — monta vídeo (whip blur + grão) e áudio (voz + cama com ducking + sfx, -14 LUFS)
FR=$1; OUT=$2; WID=${3:-576}; A=$(dirname $0)/audio; SIG=$((30*WID/576))
WH="between(t,0.533,0.667)+between(t,6.733,6.867)+between(t,25.233,25.367)"
ffmpeg -v error -y -framerate 30 -i "$FR/f%05d.png" -i $A/voice.wav -i $A/bed.wav -i $A/sfx.wav -filter_complex "
[0:v]gblur=sigma=${SIG}:sigmaV=0.1:enable='${WH}',noise=alls=4:allf=t,format=yuv420p[v];
[1:a]asplit=2[vo][vsc];
[2:a][vsc]sidechaincompress=threshold=0.02:ratio=6:attack=15:release=350[bedd];
[vo][bedd][3:a]amix=inputs=3:weights=1 1 1:normalize=0,alimiter=limit=0.95,loudnorm=I=-14:TP=-1.5:LRA=9[a]" \
 -map "[v]" -map "[a]" -t 29.77 -c:v libx264 -preset slow -crf 20 -maxrate 10M -bufsize 20M -r 30 -c:a aac -b:a 192k -movflags +faststart "$OUT"
echo "ok $OUT"; ffprobe -v error -show_entries format=duration:stream=width,height,r_frame_rate -of compact "$OUT"
