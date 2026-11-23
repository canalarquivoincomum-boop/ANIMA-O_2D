#!/bin/bash
# shots.sh S T0 T1 STEP OUTJPG [cols] — renderiza quadros de teste e monta a folha
S=$1; A=$2; B=$3; ST=$4; OUT=$5; C=${6:-6}
TM=$(python3 -c "import numpy as n;print(','.join('%.2f'%x for x in n.arange($A,$B+1e-6,$ST)))")
rm -rf /tmp/ts_$S; cd /home/user/ANIMA-O_2D/producao/engine && node render.js main_s.html /tmp/ts_$S --w 576 --h 1024 --q s=$S --times $TM 2>&1 | grep -v "^$" | head -5
python3 ../eleven/sheet.py /tmp/ts_$S $OUT $C
