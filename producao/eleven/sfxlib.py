"""sfxlib.py — síntese simples de trilha (bed) e efeitos (sfx) a partir de listas de eventos. Tudo é gerado, nada é amostra de terceiros."""
import numpy as np, wave, subprocess
SR = 44100
rng = np.random.default_rng(7)
class Mix:
    def __init__(self, dur):
        self.N = int(dur * SR); self.bed = np.zeros((2, self.N)); self.sfx = np.zeros((2, self.N))
    def put(self, buf, t0, x, g=1.0, pan=0.0):
        i = int(t0 * SR)
        if i < 0 or i >= self.N: return
        n = min(len(x), self.N - i)
        buf[0, i:i + n] += x[:n] * g * (1 - max(0, pan)); buf[1, i:i + n] += x[:n] * g * (1 + min(0, pan))
    def s(self, t0, x, g=0.1, pan=0.0): self.put(self.sfx, t0, x, g, pan)
    def b(self, t0, x, g=0.1, pan=0.0): self.put(self.bed, t0, x, g, pan)
tt = lambda d: np.arange(int(d * SR)) / SR
def env(n, a=0.005, r=0.2):
    e = np.ones(n); na = max(1, int(a * SR)); nr = max(1, int(r * SR)); e[:na] = np.linspace(0, 1, na); e[-nr:] = np.minimum(e[-nr:], np.linspace(1, 0, nr)); return e
def noise(d): return rng.standard_normal(int(d * SR))
def lp(x, fc):
    a = np.exp(-2 * np.pi * fc / SR); y = np.empty_like(x); s = 0.0
    # filtro de 1 polo, vetorizado por blocos via lfilter-like recursão (rápido o bastante p/ trechos curtos)
    for i in range(len(x)): s = (1 - a) * x[i] + a * s; y[i] = s
    return y
def hp(x, fc): return x - lp(x, fc)
def bp(x, lo, hi): return lp(hp(x, lo), hi)
def midi(m): return 440 * 2 ** ((m - 69) / 12)
def tick(f=1900, d=0.05): t = tt(d); return np.sin(2 * np.pi * f * t) * np.exp(-90 * t) + 0.3 * noise(d) * np.exp(-120 * t)
def chime(f, d=0.6): t = tt(d); return (np.sin(2 * np.pi * f * t) + 0.4 * np.sin(2 * np.pi * f * 2.01 * t)) * np.exp(-6 * t) * env(len(t), 0.003, 0.1)
def bell(m, d=1.6, g=1.0): t = tt(d); f = midi(m); return sum(a * np.sin(2 * np.pi * f * mm * t) * np.exp(-dd * t) for mm, a, dd in [(1, 1, 2.6), (2.76, .3, 5), (5.4, .12, 8)]) * env(len(t), 0.002, 0.2) * g
def thump(f=60, d=0.5, k=9): t = tt(d); return np.sin(2 * np.pi * f * t) * np.exp(-k * t) + 0.4 * lp(noise(d), 300) * np.exp(-k * 1.4 * t)
def whoosh(d=0.5, lo=300, hi=3000): return bp(noise(d), lo, hi) * np.sin(np.pi * tt(d) / d) ** 2
def buzz(d=0.5, f=170): t = tt(d); return (np.sin(2 * np.pi * f * t) * env(len(t), 0.004, 0.05) + 0.3 * lp(noise(d), 400))
def pad(m, t0, d, notes, g, a=1.5, r=2.0):
    t = tt(d); y = sum(np.sin(2 * np.pi * midi(n) * t) + 0.3 * np.sin(2 * np.pi * midi(n) * 2 * t) for n in notes) * (1 + 0.12 * np.sin(2 * np.pi * 0.23 * t)); m.b(t0, y * env(len(t), a, r), g)
def engine(d, f0, rise=0.0, fc=700):
    t = tt(d); fr = f0 * (1 + rise * t / d); ph = 2 * np.pi * np.cumsum(fr) / SR; am = 0.6 + 0.4 * np.sin(2 * np.pi * np.cumsum(fr * 0.5) / SR)
    return lp((np.sin(ph) + 0.5 * np.sin(2 * ph) + 0.25 * np.sin(3 * ph) + 0.2 * np.sign(np.sin(ph * 0.5))) * am, fc) + 0.1 * lp(noise(d), 500)
def crackle(d=0.3): x = noise(d); x[np.abs(x) < 2.6] = 0; return lp(x, 4000) * np.exp(-12 * tt(d))
def sweep(d, f0, f1, k=0): t = tt(d); fr = np.linspace(f0, f1, len(t)); return np.sin(2 * np.pi * np.cumsum(fr) / SR) * env(len(t), 0.01, 0.1)
def wr(path, a):
    a = np.clip(a, -1, 1); i16 = (a.T * 32767).astype(np.int16)
    with wave.open(path, 'wb') as w: w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(i16.tobytes())
def voice_wav(mp3, out, N):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", mp3, "-f", "f32le", "-ac", "1", "-ar", str(SR), "-"], capture_output=True).stdout
    x = np.frombuffer(raw, np.float32); v = np.zeros((2, N)); n = min(N, len(x)); v[0, :n] = x[:n]; v[1, :n] = x[:n]; wr(out, v * 0.95)
