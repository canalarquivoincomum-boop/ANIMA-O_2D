"""Trilha (bed) + efeitos (sfx) + voz da história 1, sincronizados com os eventos do roteiro (tempos de s1_frases.json)."""
import json, sys
from sfxlib import *
F = json.load(open("s1_frases.json")); DUR = F["dur"] + 0.8
P = {f["id"]: f["ini"] for f in F["frases"]}
W = json.load(open("s1_words.json"))
def wt(i, k): return [w for w in W if w["id"] == i][k]["ini"]
m = Mix(DUR)
# ---------- trilha ----------
pad(m, 0, 31, [38, 45, 50, 57], 0.010)                       # tensão noturna
pad(m, 28.5, 8, [38, 45, 52, 55, 62], 0.013)                  # chegada ao terreno
pad(m, 36, 24, [45, 52, 57, 64], 0.012, 2.0, 2.5)             # a conversa: calor e mistério
pad(m, 60, 17, [43, 50, 55, 62], 0.012, 2.0, 2.5)             # o Zé e o capacete: tristeza
pad(m, 77, 16, [48, 55, 60, 64, 67], 0.014, 2.5, 2.5)         # a virada: abre
pad(m, 92, DUR - 92, [48, 55, 60, 64, 67, 72], 0.016, 2.0, 3.0)  # resolução em dó maior
m.b(0, lp(noise(DUR), 900) * 0.010, 1)                       # cidade à noite
for k, (tm, n) in enumerate([(93.0, 72), (93.6, 76), (94.2, 79), (95.0, 76), (96.4, 72), (97.0, 71), (97.6, 67), (99.0, 72), (99.9, 76), (100.8, 79), (101.7, 84), (103.2, 79), (104.3, 76), (105.0, 72)]): m.b(tm, bell(n, 2.2, 0.06), 1, 0.15)  # melodia simples (esperança)
# ---------- gancho e aposta ----------
m.s(0.02, whoosh(0.5, 200, 2200), 0.07); m.s(0.0, thump(48, 0.7, 5), 0.18)
m.s(1.78, chime(1760, 0.6), 0.06); m.s(1.80, chime(2349, 0.5), 0.04)
for k in range(3): m.s(1.78 + 0.2 * k, buzz(0.12, 170), 0.07)
m.s(2.95, tick(2200, 0.06), 0.08); m.s(5.7, chime(1480, 0.5), 0.04)
m.s(7.04, sweep(0.18, 420, 190), 0.05); m.s(7.48, thump(60, 0.7, 6), 0.20); m.s(7.48, bp(noise(0.35), 400, 4000) * np.sin(np.pi * tt(0.35) / 0.35) ** 2, 0.06)
for s_ in range(9, 11): m.s(s_ + 0.0, tick(1500, 0.04), 0.08)
m.s(10.5, bp(noise(0.25), 400, 3500) * np.sin(np.pi * tt(0.25) / 0.25), 0.05); m.s(11.7, thump(55, 0.4, 9), 0.08)
m.s(12.6, bp(noise(0.5), 800, 5000) * np.sin(np.pi * tt(0.5) / 0.5) ** 2, 0.06); m.s(13.15, thump(70, 0.35, 14), 0.18)
# ---------- caminho ----------
m.s(14.8, tick(900, 0.05), 0.08); m.s(14.55, engine(0.95, 52, 0.1, 500) * env(int(0.95 * SR), 0.05, 0.05), 0.07)
m.s(15.5, engine(10.5, 70, 1.1, 900) * env(int(10.5 * SR), 0.2, 0.8), 0.085)
for tm in [16.2, 17.0, 18.2, 19.4, 21.0, 22.2, 23.6]: m.s(tm, whoosh(0.4, 300, 2800), 0.05, (-1) ** int(tm) * 0.3)
for i in range(11): m.s(17.88 + i * 0.15, tick(1250 + 50 * i, 0.05), 0.07)
m.s(23.25, chime(1480, 0.5), 0.05); m.s(23.30, bell(84, 1.2, 0.5), 0.05)
m.s(25.1, bp(noise(0.6), 1500, 6000) * np.exp(-2.5 * tt(0.6)) * np.sin(np.pi * np.clip(tt(0.6) / 0.6, 0, 1)), 0.04); m.s(25.4, engine(0.8, 48, -0.4, 400) * env(int(0.8 * SR), 0.02, 0.7), 0.07)
m.s(26.3, tick(1700, 0.05), 0.06)
# ---------- terreno ----------
for k in range(36): f0 = 4300 + 300 * (k % 3); m.s(28.4 + k * 0.13, np.sin(2 * np.pi * f0 * tt(0.05)) * env(int(0.05 * SR), 0.003, 0.03), 0.012, (-1) ** k * 0.4)
def click(tm, g=0.12): t = tt(0.04); m.s(tm, noise(0.04) * np.exp(-90 * t) + np.sin(2 * np.pi * 140 * t) * np.exp(-60 * t), g)
for tm in [30.75, 30.95, 31.10, 31.17, 31.30]: click(tm)
m.s(30.75, buzz(0.12, 100), 0.04); m.s(30.95, buzz(0.1, 100), 0.04); m.s(31.17, buzz(2.6, 100), 0.03)
for k, (dt, n) in enumerate([(0, 76), (0.45, 79), (0.9, 81), (1.35, 79)]): m.s(31.9 + dt, bell(n + 12, 1.5, 1), 0.05, 0.15)
m.s(33.7, bp(noise(0.5), 200, 1200) * np.sin(np.pi * tt(0.5) / 0.5), 0.03)
for k in range(5): m.s(34.9 + k * 0.5, tick(2000, 0.03), 0.04)
m.s(36.0, thump(55, 0.9, 2.4), 0.17); m.s(37.0, thump(60, 0.7, 6), 0.20); m.s(37.0, bp(noise(0.35), 400, 4000) * np.sin(np.pi * tt(0.35) / 0.35) ** 2, 0.06)
# ---------- conversa ----------
m.s(37.5, whoosh(0.35, 400, 2000), 0.04); m.s(41.4, sweep(0.9, 300, 900), 0.025); m.s(41.4, whoosh(0.8, 800, 6000), 0.03)
for k in (7, 9, 13): tm = wt("L20", k); m.s(tm - 0.05, bell(88, 0.9, 1), 0.06); m.s(tm - 0.05, thump(150, 0.15, 30), 0.06)
for s_ in range(0, 6): m.s(48.95 + s_ * 0.5 * 2 / 2 + 0.0, tick(1500, 0.04), 0.07)
for k in range(10): m.s(49.5 + k * 0.55, thump(50, 0.25, 14), 0.10)     # batimento (dilema)
m.s(54.5, bp(noise(0.35), 150, 900) * np.sin(np.pi * tt(0.35) / 0.35), 0.06); m.s(54.8, thump(55, 0.4, 12), 0.12)   # cadeira + sentar
m.s(55.4, bell(79, 1.8, 1), 0.05)
m.s(59.35, bp(noise(0.3), 800, 5000) * np.sin(np.pi * tt(0.3) / 0.3) ** 2, 0.05)
m.s(61.0, sweep(0.9, 300, 600), 0.03); m.s(62.0, thump(60, 0.5, 9), 0.12)
for tm in [65.3, 65.8, 66.3]: m.s(tm, tick(1100, 0.05), 0.07)
m.s(67.3, thump(75, 0.35, 14), 0.20); m.s(68.88, crackle(0.35), 0.5); m.s(68.88, thump(90, 0.3, 18), 0.12)
m.s(71.2, bp(noise(0.5), 600, 4000) * np.sin(np.pi * tt(0.5) / 0.5) ** 0.5 * np.exp(-3 * tt(0.5)), 0.10)
for i in range(11):
    m.s(75.5 + i * 0.145, tick(900, 0.04), 0.06); m.s(75.62 + i * 0.145, thump(100, 0.12, 25), 0.08)
for k in (8, 10, 14): tm = wt("L30", k); m.s(tm - 0.05, bell(84 + (k % 3) * 2, 1.2, 1), 0.06)
m.s(86.15, buzz(0.5, 170), 0.07); m.s(86.15, chime(1760, 0.5), 0.05)
m.s(wt("L31", 3), sweep(0.25, 500, 200), 0.05); m.s(wt("L31", 5), thump(55, 0.6, 7), 0.16)
m.s(91.35, bp(noise(0.3), 300, 3000) * np.sin(np.pi * tt(0.3) / 0.3), 0.08); m.s(91.6, sweep(0.9, 400, 1600), 0.03)
for k in range(8): m.s(91.7 + k * 0.07, bell(84 + (k * 3) % 12, 0.6, 1), 0.03, ((-1) ** k) * 0.4)
m.s(92.4, chime(1320, 0.6), 0.06); m.s(92.45, chime(1760, 0.6), 0.05); m.s(93.45, thump(70, 0.35, 14), 0.20)
m.s(97.05, thump(110, 0.25, 22), 0.16); m.s(96.85, bp(noise(0.3), 300, 1500) * np.sin(np.pi * tt(0.3) / 0.3), 0.04)
# ---------- um ano depois ----------
m.b(98.9, lp(noise(DUR - 98.9), 600) * 0.010, 1)
for k in range(30): m.s(99.0 + k * 0.17, crackle(0.12), 0.05 * (0.5 + rng.random()), (-1) ** k * 0.3)
m.s(100.82, thump(70, 0.7, 5), 0.10); m.s(100.82, whoosh(0.6, 200, 1500), 0.05)
m.s(104.2, bell(72, 3.0, 1), 0.07); m.s(104.2, bell(79, 3.0, 1), 0.06); m.s(104.3, bell(84, 3.0, 1), 0.05)
wr("s1_bed.wav", m.bed); wr("s1_sfx.wav", m.sfx); voice_wav("s1_lax.mp3", "s1_voice.wav", m.N); print("ok", DUR)
