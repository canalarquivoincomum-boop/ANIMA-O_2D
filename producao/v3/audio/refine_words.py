"""Refina words.json: o tempo de cada FRASE é exato (vem da síntese); dentro da frase usa o tempo do ASR só quando coerente
(dentro dos limites, monótono, sem palavras coladas); senão distribui por tamanho de palavra (aprox. de sílabas).
A narração real do usuário deve ser realinhada pelas pausas reais da voz (regra do canal)."""
import json, re
w = json.load(open("words.json")); fr = json.load(open("guia_frases.json"))
out = []; bad = 0
def syl(s): return max(1, len(re.findall(r"[aeiouáéíóúâêôãõà]+", s.lower())))
for fi, m in enumerate(fr):
    ws = [x for x in w if x["frase"] == fi]
    lo, hi = m["ini"], m["fim"]
    ok = all(lo - 0.12 <= x["ini"] and x["fim"] <= hi + 0.12 for x in ws) and all(ws[i]["ini"] >= ws[i-1]["ini"] for i in range(1, len(ws))) and all(x["fim"] - x["ini"] > 0.06 for x in ws)
    if ok:
        for x in ws: out.append({**x, "ini": max(lo, x["ini"]), "fim": min(hi, x["fim"])})
    else:
        bad += 1; tot = sum(syl(x["w"]) + 0.4 for x in ws); t = lo
        for x in ws:
            d = (syl(x["w"]) + 0.4) / tot * (hi - lo); out.append({**x, "ini": round(t, 3), "fim": round(t + d, 3)}); t += d
json.dump(out, open("words.json", "w"), ensure_ascii=False)
print("frases refeitas por proporção de sílabas:", bad, "de", len(fr))
