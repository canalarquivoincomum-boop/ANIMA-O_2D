"""Alinha a narração ElevenLabs ao roteiro (fonte_roteiros.py): gera <slug>_words.json (palavras) e <slug>_frases.json (ini/fim por id)."""
import sys, json, re, difflib, unicodedata
sys.path.insert(0, "../../roteiros")
import numpy as np, subprocess
from faster_whisper import WhisperModel
from fonte_roteiros import R1, R2
slug, mp3 = sys.argv[1], sys.argv[2]
R = {"s1": R1, "s2": R2}[slug]
raw = subprocess.run(["ffmpeg","-v","error","-i",mp3,"-f","f32le","-ac","1","-ar","16000","-"],capture_output=True).stdout
x = np.frombuffer(raw, np.float32)
dur = len(x)/16000
m = WhisperModel("small", device="cpu", compute_type="int8", cpu_threads=4)
segs,_ = m.transcribe(x, language="pt", word_timestamps=True, beam_size=5, condition_on_previous_text=False)
asr = [(w.word.strip(), w.start, w.end) for s in segs for w in s.words]
U = "zero um dois três quatro cinco seis sete oito nove dez onze doze treze catorze quinze dezesseis dezessete dezoito dezenove".split()
def norm(s):
    s = unicodedata.normalize("NFD", s.lower()); s = "".join(c for c in s if unicodedata.category(c) != "Mn")
    return re.sub(r"[^a-z0-9]", "", s)
def expand(w):
    d = re.sub(r"[^0-9,]", "", w)
    if not d: return [w]
    m_ = {"14":["catorze"],"21":["vinte","e","uma"],"82":["oitenta","e","dois"],"31":["trinta","e","um"],"4,52":["quatro","virgula","cinquenta","e","dois"],"4,5":["quatro","virgula","cinco"],"4,9":["quatro","virgula","nove"],"94":["noventa","e","quatro"],"4":["quatro"],"8":["oito"],"3":["três"],"7":["sete"],"11":["onze"],"12":["doze"],"340":["trezentos","e","quarenta"]}
    return m_.get(d, [w])
atok = []
for w, s, e in asr:
    ex = expand(w)
    for i, t in enumerate(ex): atok.append((t, s + (e-s)*i/len(ex), s + (e-s)*(i+1)/len(ex)))
script = []
for fi, l in enumerate(R["linhas"]):
    for p in l[3].split(): script.append([p, l[0], fi, None, None])
a = [norm(t) for t,_,_ in atok]; b = [norm(s[0]) for s in script]
sm = difflib.SequenceMatcher(None, a, b, autojunk=False)
n = 0
for blk in sm.get_matching_blocks():
    for k in range(blk.size):
        script[blk.b+k][3] = atok[blk.a+k][1]; script[blk.b+k][4] = atok[blk.a+k][2]; n += 1
print(f"{slug}: dur {dur:.2f}s | script {len(script)} palavras | casadas {n}")
# interpola não casadas
i = 0
while i < len(script):
    if script[i][3] is None:
        j = i
        while j < len(script) and script[j][3] is None: j += 1
        lo = script[i-1][4] if i > 0 else 0.0
        hi = script[j][3] if j < len(script) else dur
        for k in range(i, j):
            script[k][3] = lo + (hi-lo)*(k-i)/(j-i); script[k][4] = lo + (hi-lo)*(k-i+1)/(j-i)
        i = j
    else: i += 1
words = [{"w":s[0],"id":s[1],"frase":s[2],"ini":round(s[3],3),"fim":round(max(s[4],s[3]+0.08),3)} for s in script]
fr = []
for l in R["linhas"]:
    ws = [w for w in words if w["id"] == l[0]]
    fr.append({"id":l[0],"quem":l[2],"texto":l[3],"ini":ws[0]["ini"],"fim":ws[-1]["fim"]})
json.dump(words, open(f"{slug}_words.json","w"), ensure_ascii=False)
json.dump({"dur":round(dur,3),"frases":fr}, open(f"{slug}_frases.json","w"), ensure_ascii=False, indent=1)
for f in fr: print(f["id"], f'{f["ini"]:7.2f} {f["fim"]:7.2f}', f["texto"][:60])
