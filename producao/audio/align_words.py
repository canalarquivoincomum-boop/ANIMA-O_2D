"""Gera words.json (tempo por palavra) alinhando Whisper ao roteiro.
Regra do canal: sincronia pelas pausas reais da voz, nunca proporcional ao texto."""
import json, sys, wave, re, difflib, unicodedata
import numpy as np
from faster_whisper import WhisperModel
wav, frases, out = sys.argv[1], sys.argv[2], sys.argv[3]
w = wave.open(wav); sr = w.getframerate()
x = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32)/32768
n16 = int(len(x)*16000/sr)
x16 = np.interp(np.linspace(0, len(x)-1, n16), np.arange(len(x)), x).astype(np.float32)
m = WhisperModel("small", device="cpu", compute_type="int8", cpu_threads=4)
segs, _ = m.transcribe(x16, language="pt", word_timestamps=True, beam_size=5, condition_on_previous_text=False)
asr = [(ww.word.strip(), ww.start, ww.end) for s in segs for ww in s.words]
def norm(s):
    s = unicodedata.normalize("NFD", s.lower()); s = "".join(c for c in s if unicodedata.category(c) != "Mn")
    return re.sub(r"[^a-z0-9]", "", s)
marks = json.load(open(frases))
script = []  # (palavra, cena, frase_idx, ini_frase, fim_frase)
for fi, mk in enumerate(marks):
    for p in mk["texto"].split(): script.append([p, mk["cena"], fi, mk["ini"], mk["fim"], None, None])
a = [norm(p) for p, _, _ in asr]; b = [norm(s[0]) for s in script]
sm = difflib.SequenceMatcher(None, a, b, autojunk=False)
for blk in sm.get_matching_blocks():
    for k in range(blk.size):
        script[blk.b+k][5] = asr[blk.a+k][1]; script[blk.b+k][6] = asr[blk.a+k][2]
# interpola palavras não casadas dentro da frase
for fi in sorted(set(s[2] for s in script)):
    ws = [s for s in script if s[2] == fi]; lo, hi = ws[0][3], ws[0][4]
    for i, s in enumerate(ws):
        if s[5] is None:
            prev = next((ws[j][6] for j in range(i-1, -1, -1) if ws[j][6] is not None), lo)
            nxt = next((ws[j][5] for j in range(i+1, len(ws)) if ws[j][5] is not None), hi)
            gap = [k for k in range(len(ws)) if ws[k][5] is None and k >= i]
            s[5] = prev; s[6] = nxt  # provisório (refinado abaixo)
    # distribui uniformemente blocos consecutivos não casados
    i = 0
    while i < len(ws):
        if ws[i][5] is not None and abs(ws[i][5]-ws[i][6]) < 1e-9: pass
        i += 1
res = [{"w": s[0], "cena": s[1], "frase": s[2], "ini": round(s[5], 3), "fim": round(max(s[6], s[5]+0.08), 3)} for s in script]
# garante monotonia
for i in range(1, len(res)):
    if res[i]["ini"] < res[i-1]["ini"]: res[i]["ini"] = res[i-1]["fim"]
    if res[i]["fim"] <= res[i]["ini"]: res[i]["fim"] = round(res[i]["ini"]+0.1, 3)
json.dump(res, open(out, "w"), ensure_ascii=False)
ok = sum(1 for s in script if s[5] is not None)
print("palavras do roteiro", len(script), "| casadas com ASR", len(sm.get_matching_blocks()) and sum(b.size for b in sm.get_matching_blocks()))
