import json, sys
for s in ("s1","s2"):
    F = json.load(open(f"{s}_frases.json")); W = json.load(open(f"{s}_words.json"))
    PH = {f["id"]: [f["ini"], f["fim"]] for f in F["frases"]}
    words = [{"w": w["w"], "ini": w["ini"], "fim": w["fim"], "frase": w["frase"], "id": w["id"]} for w in W]
    open(f"../engine/data_{s}.js","w").write("window.PH=%s;window.WORDS=%s;window.DUR=%s;" % (json.dumps(PH), json.dumps(words, ensure_ascii=False), F["dur"]))
    print(s, len(words))
