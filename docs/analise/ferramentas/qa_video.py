#!/usr/bin/env python3
"""
QA automático de um MP4 de animação (checklist técnico do documento 04).

Uso:
    pip install opencv-python-headless numpy
    # ffmpeg e ffprobe precisam estar no PATH
    python3 qa_video.py meu_video.mp4 [--max-seg 120] [--story-end 118.0]

O que mede (todos os números são heurísticas; veja docs/analise/00):
  - formato: resolução, fps, duração, áudio
  - loudness integrado (LUFS), pico real e LRA
  - silêncios > 140 ms no áudio (regra do canal: cortar silêncios > 140 ms)
  - mudanças visuais (heurística por diferença de quadros): mediana de plano,
    quantas nos primeiros 10 s, planos > 3 s (candidatos a "hold" ou a plano morto)
  - flashes: saltos bruscos de luminância média (a regra do canal proíbe
    piscadas/flashes brancos ou pretos)
  - trechos congelados: > 2,5 s com quase nenhuma mudança (cena "morta";
    o guia pede movimento contínuo mesmo em cena parada)
Não substitui assistir ao vídeo inteiro (quadros a cada ~0,1 s nas cenas críticas).
"""
import argparse
import json
import re
import subprocess
import sys

import cv2
import numpy as np


def run(cmd):
    return subprocess.run(cmd, capture_output=True, text=True)


def probe(path):
    r = run(["ffprobe", "-v", "error", "-show_entries",
             "format=duration:stream=codec_type,width,height,r_frame_rate",
             "-of", "json", path])
    d = json.loads(r.stdout)
    v = next(s for s in d["streams"] if s["codec_type"] == "video")
    has_audio = any(s["codec_type"] == "audio" for s in d["streams"])
    num, den = v["r_frame_rate"].split("/")
    return {
        "w": int(v["width"]), "h": int(v["height"]),
        "fps": float(num) / float(den), "dur": float(d["format"]["duration"]),
        "audio": has_audio,
    }


def loudness(path):
    r = run(["ffmpeg", "-nostats", "-i", path, "-af", "ebur128=peak=true",
             "-f", "null", "-"]).stderr
    I = re.findall(r"I:\s+(-?[\d.]+) LUFS", r)
    LRA = re.findall(r"LRA:\s+([\d.]+) LU", r)
    TP = re.findall(r"Peak:\s+(-?[\d.]+) dBFS", r)
    return (float(I[-1]) if I else None, float(LRA[-1]) if LRA else None,
            float(TP[-1]) if TP else None)


def silences(path, min_len=0.14, noise_db=-40):
    r = run(["ffmpeg", "-nostats", "-i", path, "-af",
             f"silencedetect=noise={noise_db}dB:d={min_len}", "-f", "null", "-"]).stderr
    starts = [float(x) for x in re.findall(r"silence_start: ([\d.]+)", r)]
    ends = re.findall(r"silence_end: ([\d.]+) \| silence_duration: ([\d.]+)", r)
    return starts, [(float(e), float(d)) for e, d in ends]


def video_stats(path):
    cap = cv2.VideoCapture(path)
    fps = cap.get(cv2.CAP_PROP_FPS) or 30.0
    prev = None
    diffs, lum = [], []
    while True:
        ok, f = cap.read()
        if not ok:
            break
        g = cv2.cvtColor(cv2.resize(f, (72, 128)), cv2.COLOR_BGR2GRAY).astype(np.float32)
        lum.append(float(g.mean()))
        diffs.append(0.0 if prev is None else float(np.abs(g - prev).mean()))
        prev = g
    return fps, np.array(diffs), np.array(lum)


def cuts_from_diffs(px):
    cuts = []
    for i in range(1, len(px)):
        lo = max(0, i - 6)
        loc = np.median(px[lo:i]) if i > lo else 0
        if px[i] > max(6, loc * 3.0) and (px[i] > 10):
            if not cuts or i - cuts[-1] > 4:
                cuts.append(i)
    return cuts


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("video")
    ap.add_argument("--max-seg", type=float, default=120.0, help="duração máxima (s)")
    ap.add_argument("--story-end", type=float, default=None,
                    help="fim da história em s (ignora cartão final, se houver)")
    a = ap.parse_args()

    results = []  # (status, item, detalhe)

    def add(ok, item, detail, warn=False):
        results.append(("OK" if ok else ("AVISO" if warn else "FALHA"), item, detail))

    p = probe(a.video)
    dur = a.story_end or p["dur"]
    add((p["w"], p["h"]) == (1080, 1920), "Resolução 1080x1920", f"{p['w']}x{p['h']}")
    add(abs(p["fps"] - 30) < 0.1, "30 fps", f"{p['fps']:.2f}")
    add(p["audio"], "Tem áudio", str(p["audio"]))
    add(dur <= a.max_seg + 0.5, f"Duração ≤ {a.max_seg:.0f} s", f"{dur:.1f} s", warn=True)

    if p["audio"]:
        I, LRA, TP = loudness(a.video)
        add(I is not None and -16.5 <= I <= -12.5, "Loudness integrado ≈ -14 LUFS (±2)",
            f"{I} LUFS (LRA {LRA}, pico {TP} dBFS)", warn=True)
        add(TP is None or TP <= -1.0, "Pico real ≤ -1 dBFS", f"{TP} dBFS")
        st, en = silences(a.video)
        # descarta silêncios depois do fim da história (ex.: cartão final de plataforma)
        en = [(e, d) for e, d in en if e - d < dur]
        st = [s for s in st if s < dur]
        long_ = [d for _, d in en if d > 0.5]
        add(len(long_) == 0,
            "Sem silêncios > 0,5 s (exceto pausa dramática deliberada de 0,3–0,5 s)",
            f"{len(en)} silêncios > 140 ms; {len(long_)} > 0,5 s; "
            f"maior = {max([d for _, d in en], default=0):.2f} s", warn=True)
        # o vídeo deve começar falando (referências: primeira palavra em 0,00 s)
        lead = st[0] if st and st[0] < 0.05 and en else 0.0
        lead_len = en[0][1] if (st and st[0] < 0.05 and en) else 0.0
        add(lead_len < 0.4, "Começa direto, sem silêncio inicial > 0,4 s",
            f"silêncio inicial = {lead_len:.2f} s", warn=True)

    fps, px, lum = video_stats(a.video)
    cuts = cuts_from_diffs(px)
    t = np.array([0] + [c / fps for c in cuts] + [len(px) / fps])
    seg = np.diff(t)
    seg = seg[t[:-1] < dur]
    if len(seg):
        med = float(np.median(seg))
        add(1.0 <= med <= 2.4, "Mediana de plano entre ~1,0 e 2,4 s (referências: 1,2–2,1 s)",
            f"{med:.2f} s ({len(cuts)} mudanças visuais; heurístico)", warn=True)
        n10 = sum(1 for c in cuts if c / fps <= 10)
        add(n10 >= 3, "≥ 3 mudanças visuais nos primeiros 10 s", f"{n10}", warn=True)
        starts = t[:-1][t[:-1] < dur]
        longs = [(round(float(s), 1), round(float(l), 1)) for s, l in zip(starts, seg) if l > 4.0]
        add(len(longs) <= 2, "Poucos planos > 4 s (só holds de peso emocional)",
            f"{len(longs)}: {longs[:6]}", warn=True)

    # flashes: salto de luminância média > 45 em 1 quadro e retorno em ≤ 4 quadros
    flashes = []
    for i in range(1, len(lum) - 4):
        if abs(lum[i] - lum[i - 1]) > 45:
            if min(abs(lum[i + k] - lum[i - 1]) for k in range(1, 5)) < 20:
                flashes.append(round(i / fps, 2))
    add(len(flashes) == 0, "Sem flashes brancos/pretos", f"{flashes[:10]}")

    # trechos congelados
    frozen, run_start = [], None
    for i, v in enumerate(px):
        if v < 0.15:
            run_start = i if run_start is None else run_start
        else:
            if run_start is not None and (i - run_start) / fps > 2.5:
                frozen.append((round(run_start / fps, 1), round((i - run_start) / fps, 1)))
            run_start = None
    add(len(frozen) == 0, "Sem trechos congelados > 2,5 s (movimento contínuo)",
        f"{frozen[:6]}", warn=True)

    w = max(len(r[1]) for r in results)
    print(f"\nQA — {a.video}\n" + "-" * (w + 40))
    for status, item, detail in results:
        print(f"[{status:6}] {item:<{w}}  {detail}")
    bad = [r for r in results if r[0] == "FALHA"]
    print("-" * (w + 40))
    print(f"{len(bad)} falha(s), {sum(r[0] == 'AVISO' for r in results)} aviso(s).")
    print("Lembrete: isto não substitui assistir ao MP4 inteiro (0,1 s nas cenas críticas).")
    sys.exit(1 if bad else 0)


if __name__ == "__main__":
    main()
