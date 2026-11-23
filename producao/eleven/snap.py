import sys, json, re, subprocess
slug = sys.argv[1]
out = subprocess.run(["ffmpeg","-v","info","-i",f"{slug}_lax.mp3","-af","silencedetect=noise=-38dB:d=0.15","-f","null","-"],capture_output=True,text=True).stderr
ss = [float(x) for x in re.findall(r"silence_start: ([\d.]+)", out)]
se = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", out)]
F = json.load(open(f"{slug}_frases.json")); W = json.load(open(f"{slug}_words.json"))
ch = 0
for f in F["frases"]:
    c = [e for e in se if abs(e - f["ini"]) < 0.7]
    if c:
        e = min(c, key=lambda e: abs(e - f["ini"]))
        if abs(e - f["ini"]) > 0.08: ch += 1
        f["ini"] = round(e, 3)
    c = [s for s in ss if abs(s - f["fim"]) < 0.7 and s > f["ini"] + 0.2]
    if c:
        s = min(c, key=lambda s: abs(s - f["fim"])); f["fim"] = round(s, 3)
# palavras: limita ao intervalo da frase
for w in W:
    f = next(x for x in F["frases"] if x["id"] == w["id"])
    w["ini"] = round(min(max(w["ini"], f["ini"]), f["fim"]-0.08), 3); w["fim"] = round(max(min(w["fim"], f["fim"]), w["ini"]+0.08), 3)
json.dump(F, open(f"{slug}_frases.json","w"), ensure_ascii=False, indent=1); json.dump(W, open(f"{slug}_words.json","w"), ensure_ascii=False)
print(slug, "ajustadas", ch, "frases")
for f in F["frases"]: print(f["id"], f["ini"], f["fim"])
