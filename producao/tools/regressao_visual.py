#!/usr/bin/env python3
"""Regressão visual do ESTILO da série: renderiza quadros fixos das histórias já publicadas e compara com os quadros de referência
guardados em docs/serie/referencias/golden/. Se uma mudança no motor (ch.js, world.js, lot4.js, kit.js…) alterar o visual de um episódio
antigo, este teste avisa ANTES de você renderizar o episódio novo.

Uso:
    python3 producao/tools/regressao_visual.py            # compara (sai com código 1 se algum quadro mudou além do limite)
    python3 producao/tools/regressao_visual.py --gerar    # recria as referências (só depois de uma mudança de estilo APROVADA)
    python3 producao/tools/regressao_visual.py --limite 6 # limite de diferença média por pixel (0–255); padrão 6
Requer: node + playwright (já usados pelo motor) e Pillow.
"""
import argparse, os, subprocess, sys, tempfile
from PIL import Image, ImageChops
RAIZ = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
ENGINE = os.path.join(RAIZ, "producao", "engine"); GOLD = os.path.join(RAIZ, "docs", "serie", "referencias", "golden")
# (história, tempos em segundos): cobrem gancho, personagens, cenário, inserts, UI, luz e final de cada episódio
QUADROS = {
    "s1": [1.0, 3.5, 7.0, 16.0, 28.5, 31.0, 35.0, 41.0, 46.0, 57.0, 60.0, 65.5, 76.0, 83.0, 91.8, 97.0, 101.5, 105.0],
    "s2": [1.0, 4.2, 6.0, 9.4, 13.0, 20.8, 22.7, 26.0, 36.5, 45.0, 52.5, 58.5, 69.0, 73.4, 80.0, 86.5, 89.5, 91.8, 96.5, 101.5],
}
def renderizar(hist, tempos, saida):
    n = hist[1]
    r = subprocess.run(["node", "render.js", "main_s.html", saida, "--w", "576", "--h", "1024", "--q", f"s={n}", "--times", ",".join(f"{t:.2f}" for t in tempos)], cwd=ENGINE, capture_output=True, text=True)
    if r.returncode or "PAGEERROR" in (r.stderr or ""): sys.exit("falha ao renderizar " + hist + ": " + (r.stderr or r.stdout)[:400])
def main():
    ap = argparse.ArgumentParser(); ap.add_argument("--gerar", action="store_true"); ap.add_argument("--limite", type=float, default=6.0); a = ap.parse_args()
    os.makedirs(GOLD, exist_ok=True); ruim = 0
    for hist, tempos in QUADROS.items():
        with tempfile.TemporaryDirectory() as tmp:
            renderizar(hist, tempos, tmp)
            for t in tempos:
                nome = f"{hist}_{t:06.2f}.jpg"; novo = Image.open(os.path.join(tmp, f"t{t:.2f}.png")).convert("RGB").resize((288, 512), Image.LANCZOS)
                if a.gerar: novo.save(os.path.join(GOLD, nome), quality=86); continue
                ref_p = os.path.join(GOLD, nome)
                if not os.path.exists(ref_p): print(f"[FALTA ] {nome}: sem referência (rode --gerar)"); ruim += 1; continue
                d = ImageChops.difference(novo, Image.open(ref_p).convert("RGB")).convert("L"); m = sum(i * c for i, c in enumerate(d.histogram())) / (288 * 512)
                st = "OK    " if m <= a.limite else "MUDOU "; ruim += m > a.limite; print(f"[{st}] {nome}: diferença média {m:5.2f}")
    if a.gerar: print("referências gravadas em", GOLD); return
    print("\nRESULTADO:", "visual preservado" if not ruim else f"{ruim} quadro(s) mudaram — confira antes de seguir (foi proposital?)"); sys.exit(1 if ruim else 0)
if __name__ == "__main__": main()
