#!/usr/bin/env python3
"""Confere um roteiro NOVO contra a bíblia de roteiro e o cânone da série (docs/serie/canon.json).

Uso:
    python3 producao/tools/checar_roteiro.py roteiros/gravacao_pedido_fantasma.txt
    python3 producao/tools/checar_roteiro.py meu_roteiro.txt --apos pedido_fantasma
Formato do texto: uma frase por linha. Aceita ids no começo (L01, M12…), (direções) no fim, [pausas] e cabeçalhos "== ATO ==".
Não substitui ler o roteiro: avisos (AVISO) pedem decisão; erros (ERRO) bloqueiam a entrega.
"""
import argparse, json, os, re, sys
RAIZ = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
CANON = json.load(open(os.path.join(RAIZ, "docs", "serie", "canon.json"), encoding="utf-8"))["regras_lint"]
def linhas(path):
    bruto = [r.rstrip("\n") for r in open(path, encoding="utf-8")]
    ini = next((i + 1 for i, r in enumerate(bruto) if r.strip().startswith("-----")), 0)   # o conteúdo começa depois da linha tracejada, se houver
    out = []
    for raw in bruto[ini:]:
        s = raw.strip()
        if not s or s.startswith(("==", "[", "---")): continue
        s = re.sub(r"^[A-Z]\d{1,3}\s+", "", s); s = re.sub(r"\s*\([^)]*\)\s*$", "", s)
        out.append(s)
    return out
def main():
    ap = argparse.ArgumentParser(); ap.add_argument("roteiro"); ap.add_argument("--apos", help="slug do último episódio publicado (ex.: pedido_fantasma)"); a = ap.parse_args()
    L = linhas(a.roteiro); texto = "\n".join(L); falas = [re.sub(r"^[A-ZÁÉÍÓÚÂÊÔÃÕÇ ]{3,}:\s*", "", l) for l in L]
    n = sum(len(f.split()) for f in falas); seg = n / CANON["palavras_por_segundo"]; erros = avisos = 0
    def rel(ok, nivel, msg, det=""):
        nonlocal erros, avisos
        st = "OK    " if ok else ("ERRO  " if nivel == "erro" else "AVISO ")
        if not ok: erros += nivel == "erro"; avisos += nivel != "erro"
        print(f"[{st}] {msg}" + (f"  → {det}" if det else ""))
    print(f"{len(L)} linhas · {n} palavras · ≈ {seg:.0f} s na voz Lax\n")
    rel(n <= CANON["max_palavras"], "erro", f"tamanho ≤ {CANON['max_palavras']} palavras (≤ 120 s)", f"{n} palavras ≈ {seg:.0f} s")
    rel(n >= 200, "aviso", "tamanho ≥ 200 palavras (≥ ~70 s)", f"{n}")
    rel(bool(re.search(CANON["gancho_regex_nas_3_primeiras_linhas"], " ".join(L[:3]), re.I)), "erro", "gancho com hora/endereço/número nas 3 primeiras linhas", " | ".join(L[:3])[:140])
    for ch, rx in CANON["assinatura"].items(): rel(bool(re.search(rx, texto, re.I)), "aviso", f"assinatura da série: {ch}")
    for fr in CANON["frases_proibidas"]: rel(fr not in texto.lower(), "erro", f"sem a frase proibida '{fr}'")
    dias = re.findall(r"\b(segunda|terça|quarta|quinta|sexta|sábado|domingo)(?:-feira)?\b", texto, re.I)
    if dias: rel(False, "aviso", "há dia da semana no texto: confira o cânone (calendário, app e roteiro precisam concordar)", ", ".join(sorted(set(d.lower() for d in dias))))
    if a.apos:
        regras = CANON["contradicoes_apos"]
        for slug in ([a.apos] if a.apos in regras else []):
            for r in regras[slug]:
                m = re.search(r["regex"], texto, re.I); rel(not m, "aviso", f"coerência com o cânone após '{slug}'", (r["aviso"] + f" (trecho: '{m.group(0)}')") if m else "")
        if a.apos not in regras: print(f"[AVISO ] slug '{a.apos}' sem regras de contradição em canon.json")
    falas_c = [l for l in L if re.match(r"^[A-ZÁÉÍÓÚÂÊÔÃÕÇ ]{3,}:", l)]
    print(f"\nFalas de personagem: {len(falas_c)} (cada uma precisa de personagem sincronizado na imagem).")
    print(f"\nRESULTADO: {erros} erro(s), {avisos} aviso(s)"); sys.exit(1 if erros else 0)
if __name__ == "__main__": main()
