"""Trilha + efeitos + voz da história 2 (sincronizados com s2_frases.json / s2_words.json)."""
import json
from sfxlib import *
F = json.load(open("s2_frases.json")); DUR = F["dur"] + 0.8
P = {f["id"]: f["ini"] for f in F["frases"]}; W = json.load(open("s2_words.json"))
def wt(i, k): return [w for w in W if w["id"] == i][k]["ini"]
m = Mix(DUR)
# ---------- trilha ----------
pad(m, 0, 20, [40, 47, 52, 59], 0.011)                     # pressão da aposta
pad(m, 19.5, 52, [38, 45, 50, 57], 0.012, 1.5, 2.0)         # subida
m.b(0, lp(noise(DUR), 900) * 0.010, 1)
pad(m, 62, 12, [43, 50, 55, 62], 0.012, 2.0, 2.5)           # o homem que consertava tudo
pad(m, 73.5, 20, [48, 55, 60, 64, 67], 0.015, 1.0, 2.5)     # depois do dim-dom: abre
pad(m, 92, DUR - 92, [48, 55, 60, 64, 67, 72], 0.017, 2.0, 3.0)
for tm, n in [(89.4, 67), (90.0, 72), (92.7, 76), (93.3, 79), (94.0, 76), (94.8, 72), (96.5, 76), (97.3, 79), (98.1, 84), (99.4, 79), (100.2, 76), (101.0, 72), (101.9, 79)]: m.b(tm, bell(n, 2.2, 0.06), 1, 0.15)
# ---------- gancho / aposta ----------
m.s(0.2, chime(1760, 0.6), 0.06); m.s(0.22, chime(2349, 0.5), 0.04)
for k in range(3): m.s(0.2 + 0.2 * k, buzz(0.12, 170), 0.07)
for i in range(21): m.s(1.5 + i * 0.07, tick(1200 + 40 * i, 0.04), 0.07)
m.s(2.9, thump(55, 0.5, 8), 0.14); m.s(3.56, whoosh(0.5, 150, 1800), 0.05); m.s(3.56, engine(1.4, 50, -0.3, 500) * env(int(1.4 * SR), 0.05, 0.5), 0.06)
m.s(4.9, sweep(1.4, 200, 900), 0.02); m.s(6.54, tick(1500, 0.05), 0.07)
for s_ in range(7, 9): m.s(s_ + 0.3, tick(1500, 0.04), 0.07)
m.s(8.5, sweep(0.18, 700, 450), 0.06); m.s(8.7, sweep(0.3, 450, 250), 0.06)
for i in range(3): m.s(wt("M04", 3) + 0.05 + i * 0.13, thump(120, 0.15, 25), 0.10)
m.s(10.0, bp(noise(0.3), 300, 3000) * np.sin(np.pi * tt(0.3) / 0.3), 0.06)
for i in range(8): m.s(wt("M04", 5) + i * 0.16, tick(1000 + 90 * i, 0.05), 0.07)
for i in range(7): m.s(wt("M04", 9) + i * 0.12, thump(110, 0.12, 25), 0.09); m.s(wt("M04", 9) + i * 0.12, tick(1600, 0.03), 0.05)
m.s(14.7, chime(1500, 0.4), 0.05); m.s(17.4, thump(52, 0.5, 6), 0.12); m.s(18.95, thump(48, 0.9, 3), 0.18); m.s(18.95, sweep(0.6, 500, 120), 0.03)
# ---------- subida (passos na escada, respiração) ----------
def steps(t0, t1, rate, g=0.07):
    t = t0; k = 0
    while t < t1:
        m.s(t, thump(90 + 12 * (k % 2), 0.12, 28), g, 0.15 * (-1) ** k); m.s(t, tick(2600, 0.02), 0.025); t += 1 / rate; k += 1
steps(19.7, 21.4, 2.7); steps(29.7, 30.9, 2.7); steps(46.1, 48.5, 3.2, 0.08)
m.s(19.68, whoosh(0.4, 200, 2500), 0.07)
for tm in (21.9, 22.2, 22.5, 22.8): m.s(tm, bp(noise(0.16), 400, 1800) * np.sin(np.pi * tt(0.16) / 0.16), 0.06)       # a risada do porteiro
m.s(21.4, steps(0, 0, 1) if False else thump(80, 0.2, 18), 0.06)
for k in range(8): m.s(21.5 + k * 0.33, thump(85, 0.1, 30), 0.05)    # passos no saguão
m.s(25.5, thump(140, 0.18, 24), 0.22); m.s(25.5, tick(3000, 0.02), 0.07); m.s(25.85, thump(135, 0.18, 24), 0.22); m.s(25.85, tick(3000, 0.02), 0.07)
m.s(27.1, chime(1480, 0.5), 0.04); m.s(31.0, bp(noise(0.4), 800, 5000) * np.sin(np.pi * tt(0.4) / 0.4) ** 2, 0.05)
for tm in (33.0, 34.4, 35.1): m.s(tm, bell(84, 1.0, 1), 0.03, 0.1)
for i in range(7): m.s(wt("M12", 2) + i * 0.12, tick(1100 + 80 * i, 0.04), 0.06)
for k in (10, 12, 16): m.s(wt("M12", k), bell(79 + (k % 3) * 2, 1.0, 1), 0.04)
for i in range(18): m.s(46.2 + i * 0.58, thump(50, 0.25, 14), 0.07 + 0.003 * i)    # batimento, acelera
for s_ in range(0, 4): m.s(47.2 + s_ * 1.0, tick(1700, 0.05), 0.06)
t = tt(1.5); m.s(50.1, lp(noise(1.5), 600) * (0.5 + 0.5 * np.sin(2 * np.pi * 14 * t)), 0.05)  # pernas tremendo
# ---------- campainha ----------
m.s(51.6, bp(noise(0.5), 1500, 6000) * np.sin(np.pi * tt(0.5) / 0.5) ** 2, 0.04); m.s(52.9, tick(1800, 0.03), 0.04); m.s(55.4, bp(noise(0.4), 800, 5000) * np.sin(np.pi * tt(0.4) / 0.4) ** 2, 0.05)
for i, k in enumerate((8, 14, 18)): pass
m.s(wt("M16", 7), thump(70, 0.5, 5), 0.07)
m.s(wt("M17", 8), sweep(0.25, 400, 140), 0.05)
m.s(wt("M18", 4), bp(noise(0.7), 500, 5000) * np.exp(-2 * tt(0.7)) * np.sin(np.pi * np.clip(tt(0.7) / 0.7, 0, 1)) ** 0.5, 0.11)    # fita descolando
for k in range(6): m.s(69.5 + k * 0.17, bp(noise(0.12), 600, 4000) * np.exp(-14 * tt(0.12)), 0.06)
m.s(71.45, tick(900, 0.04), 0.12); m.s(71.45, thump(100, 0.1, 30), 0.10)
t = tt(1.4); m.b(71.6, np.sin(2 * np.pi * (50 + 14 * t / 1.4) * t) * env(len(t), 0.2, 0.05), 0.02)   # silêncio que aperta
def ding(t0, n, g=0.15): m.s(t0, bell(n, 3.0, 1.0), g); m.s(t0, bell(n + 12, 2.4, 0.5), g * 0.5)
ding(73.02, 88, 0.18); ding(73.46, 84, 0.18); m.s(73.0, whoosh(0.5, 300, 5000), 0.06); m.s(73.0, thump(48, 0.9, 5), 0.2)
# ---------- a multidão ----------
for i in range(8): m.s(74.3 + i * 0.28, bp(noise(0.35), 150, 900) * np.sin(np.pi * tt(0.35) / 0.35) * (1 + (i % 2)) * 0.6, 0.05)   # portas
for k in range(46): m.s(76.5 + k * 0.1, thump(95 + 10 * (k % 3), 0.07, 40), 0.03 + 0.01 * (k % 3), (-1) ** k * 0.3)
t = tt(9); m.s(77.0, bp(noise(9), 200, 1200) * (0.5 + 0.5 * np.sin(2 * np.pi * 1.7 * t)) * env(len(t), 1.0, 1.5), 0.035)     # murmúrio
for k in range(8): m.s(78.3 + k * 0.1, tick(3400 + 100 * k, 0.04), 0.03)       # pratos
m.s(84.4, bp(noise(0.9), 120, 700) * np.sin(np.pi * tt(0.9) / 0.9), 0.08)       # porta abrindo
m.s(84.4, sweep(1.5, 300, 600), 0.015)
# ---------- resultado ----------
m.s(92.65, buzz(0.5, 170), 0.07); m.s(92.65, chime(1760, 0.5), 0.05)
for i in range(21): m.s(wt("M25", 6) + i * 0.06, bell(84 + i % 5, 0.5, 1), 0.02 + 0.001 * i, (-1) ** i * 0.3)
m.s(wt("M25", 12), sweep(1.3, 300, 1200), 0.03)
for n in (72, 76, 79, 84): m.s(98.0 + (n - 72) * 0.02, bell(n, 2.5, 1), 0.06)
m.s(99.78, bp(noise(0.3), 800, 5000) * np.sin(np.pi * tt(0.3) / 0.3) ** 2, 0.05); m.s(99.78, thump(80, 0.2, 18), 0.08)
ding(101.7, 84, 0.07)
wr("s2_bed.wav", m.bed); wr("s2_sfx.wav", m.sfx); voice_wav("s2_lax.mp3", "s2_voice.wav", m.N); print("ok", DUR)
