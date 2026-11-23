"""Gera os stems de som do PILOTO (placeholders sintetizados, cada som justificado pela imagem).
saída: bed.wav (cama/música/ambiente, 44,1 kHz estéreo), sfx.wav, voice.wav (voz-guia recortada)."""
import numpy as np, wave, json, sys
SR = 44100; DUR = 30.4
N = int(DUR * SR); rng = np.random.default_rng(7)
def tt(d): return np.arange(int(d * SR)) / SR
def env(n, a=0.005, r=0.2):
    e = np.ones(n); na = max(1, int(a * SR)); nr = max(1, int(r * SR)); e[:na] = np.linspace(0, 1, na); e[-nr:] = np.minimum(e[-nr:], np.linspace(1, 0, nr)); return e
def put(buf, t0, x, gain=1.0, pan=0.0):
    i = int(t0 * SR); n = min(len(x), N - i)
    if n <= 0: return
    buf[0, i:i+n] += x[:n] * gain * (1 - max(0, pan)); buf[1, i:i+n] += x[:n] * gain * (1 + min(0, pan))
def noise(d): return rng.standard_normal(int(d * SR))
def lp(x, fc):  # filtro passa-baixa 1 polo
    a = np.exp(-2 * np.pi * fc / SR); y = np.zeros_like(x); s = 0.0
    for i in range(len(x)): s = (1 - a) * x[i] + a * s; y[i] = s
    return y
def hp(x, fc): return x - lp(x, fc)
def bp(x, lo, hi): return lp(hp(x, lo), hi)
def midi(m): return 440 * 2 ** ((m - 69) / 12)
def mbox(f, d=1.4):   # caixa de música: parciais inarmônicos com decaimento
    t = tt(d); y = np.zeros_like(t)
    for k, (m, a, dec) in enumerate([(1, 1, 3.5), (2.76, 0.35, 6), (5.4, 0.15, 9), (8.9, 0.06, 12)]): y += a * np.sin(2 * np.pi * f * m * t) * np.exp(-dec * t)
    return y * env(len(t), 0.002, 0.05)
def chime(f, d=1.6):  # cintilar de vidro (mão sumindo)
    t = tt(d); y = (np.sin(2 * np.pi * f * t) + 0.5 * np.sin(2 * np.pi * f * 2.01 * t) + 0.25 * np.sin(2 * np.pi * f * 3.02 * t)) * np.exp(-3.2 * t)
    return y * env(len(t), 0.004, 0.2)
def whoosh(d=0.22, f0=300, f1=3000):
    x = noise(d); t = tt(d); y = bp(x, f0, f1) * np.sin(np.pi * t / d) ** 2; return y / (np.abs(y).max() + 1e-9)
def tick(f=1900, d=0.05): t = tt(d); return np.sin(2 * np.pi * f * t) * np.exp(-90 * t) + 0.3 * noise(d) * np.exp(-120 * t)
def recorder(f, d, vib=0.0, bright=1.0):
    t = tt(d); fr = f * (1 + vib * np.sin(2 * np.pi * 5.5 * t)); ph = 2 * np.pi * np.cumsum(fr) / SR
    y = np.sin(ph) + 0.18 * np.sin(2 * ph) + 0.05 * np.sin(3 * ph) * bright; y += 0.05 * lp(noise(d), 4000)
    return y * env(len(t), 0.03, 0.06)

bed = np.zeros((2, N)); sfx = np.zeros((2, N))
# ---- cama: pad suave + ambientes ----
def pad(t0, d, notes, g, trem=0.25):
    t = tt(d); y = np.zeros_like(t)
    for m in notes: y += np.sin(2 * np.pi * midi(m) * t) + 0.3 * np.sin(2 * np.pi * midi(m) * 2 * t)
    y *= (1 + 0.15 * np.sin(2 * np.pi * trem * t)); put(bed, t0, y * env(len(t), 1.2, 1.8), g)
pad(0.0, 7.2, [43, 50, 59], 0.012)            # S1: sala vazia, espera
pad(25.2, 5.2, [43, 50, 57, 62], 0.014)        # S3 fim: "um lugar muito longe"
for t0, d, g in [(0.0, 6.8, 0.010)]:          # tom de sala
    put(bed, t0, lp(noise(d), 600) * env(int(d * SR), 0.5, 0.8), g)
put(bed, 6.7, lp(noise(6.0), 900) * env(int(6.0 * SR), 0.6, 0.8), 0.016)           # rua (S2): trânsito distante
put(bed, 12.4, lp(noise(5.0), 500) * env(int(5.0 * SR), 0.4, 0.6), 0.012)          # padaria: ar
put(bed, 17.4, lp(noise(3.5), 700) * env(int(3.5 * SR), 0.4, 0.5), 0.010)          # sala (tocando)
put(bed, 25.2, bp(noise(5.2), 300, 2500) * env(int(5.2 * SR), 0.6, 1.4), 0.007)    # vento na estrada
# ---- música: o motivo da "última música" (caixa de música), justificado pelo círculo vermelho no cartaz ----
for k, (dt, m) in enumerate([(0, 76), (0.34, 79), (0.68, 81), (1.02, 79)]): put(bed, 1.72 + dt, mbox(midi(m + 12)), 0.05, 0.1)
# ---- efeitos ----
put(sfx, 0.00, chime(3136), 0.045, 0.3); put(sfx, 0.12, chime(2349), 0.03, -0.2)                   # P1: vidro nos dedos
put(sfx, 0.54, whoosh(0.2), 0.13); put(sfx, 6.74, whoosh(0.2), 0.13); put(sfx, 25.24, whoosh(0.2), 0.13)
for i, tm in enumerate([3.05, 3.55, 4.05, 4.55][:3]): put(sfx, tm, tick(1700 if i % 2 == 0 else 1400), 0.10)   # P3: relógio
put(sfx, 5.30, chime(2637, 1.2), 0.03, 0.2); put(sfx, 5.95, chime(3136, 1.2), 0.03, -0.2)                    # P4: a mão fica vidro
put(sfx, 10.78, whoosh(0.35, 800, 5000), 0.05)                                                                # P6→P7: duas horas se passam
for i in range(10): put(sfx, 10.80 + i * 0.045, tick(2200, 0.03), 0.05)
put(sfx, 14.3, bp(noise(0.7), 200, 1500) * np.sin(np.pi * tt(0.7) / 0.7) ** 2, 0.07)                           # avental balançando
put(sfx, 16.56, chime(1568, 0.9), 0.05, 0.1); put(sfx, 16.58, bp(noise(0.05), 800, 4000) * np.exp(-60 * tt(0.05)), 0.1)  # flor nova no bolso
for tm, fr in [(17.9, 659), (18.3, 784), (18.7, 880), (19.1, 784), (19.55, 659)]: put(sfx, tm, recorder(fr, 0.34, 0.012), 0.07)     # P10: flauta (notas certas)
t = tt(0.28); fr = 1300 + 900 * (t / 0.28) ** 2 + 60 * np.sin(2 * np.pi * 19 * t); sq = np.sin(2 * np.pi * np.cumsum(fr) / SR) * env(len(t), 0.01, 0.05)
put(sfx, 20.12, sq, 0.09)                                                                                     # ... e o desafino ("mal")
put(sfx, 20.5, bp(noise(0.22), 400, 2500) * np.sin(np.pi * tt(0.22) / 0.22), 0.04)                           # respiro sem graça
# caminhão: motor em marcha lenta (P11), abafado na cabine (P12), afastando (P13)
def engine(d, f0=46, g=1.0, fc=420):
    t = tt(d); am = 0.55 + 0.45 * np.sin(2 * np.pi * 13 * t); y = (np.sin(2 * np.pi * f0 * t) + 0.5 * np.sin(2 * np.pi * f0 * 2 * t) + 0.3 * ((2 * ((f0 * 3 * t) % 1) - 1))) * am
    return lp(y, fc) * g + 0.15 * lp(noise(d), 300)
put(sfx, 20.8, engine(1.9, 46, 1.0, 600) * env(int(1.9 * SR), 0.1, 0.1), 0.075)
put(sfx, 22.6, engine(2.7, 44, 1.0, 260) * env(int(2.7 * SR), 0.05, 0.1), 0.085)
for k, (dt, f) in enumerate([(0, 430), (0.2, 540)]):                                                         # buzina amiga "pó-pó"
    t = tt(0.16); put(sfx, 24.38 + dt, (np.sin(2 * np.pi * f * t) + 0.5 * np.sin(2 * np.pi * f * 2 * t) + 0.2 * np.sin(2 * np.pi * f * 3 * t)) * env(len(t), 0.01, 0.04), 0.06)
d = 4.4; t = tt(d); eng = engine(d, 44, 1.0, 400) * np.linspace(1, 0.05, len(t)) ** 1.6; put(sfx, 25.35, eng, 0.075)
# Coco: reações (boing de susto no P4; murchar no P10), passos, pulos
t = tt(0.16); put(sfx, 5.30, np.sin(2 * np.pi * np.cumsum(500 + 1100 * (t / 0.16)) / SR) * env(len(t), 0.005, 0.05), 0.05, -0.3)
t = tt(0.34); put(sfx, 20.17, np.sin(2 * np.pi * np.cumsum(900 - 520 * (t / 0.34) + 40 * np.sin(2 * np.pi * 18 * t)) / SR) * env(len(t), 0.01, 0.1), 0.05, 0.3)
def step(tm, g=0.05): put(sfx, tm, lp(noise(0.06), 600) * np.exp(-60 * tt(0.06)), g)
for k in range(8): step(6.95 + k * 0.278)
for k in range(5): step(12.55 + k * 0.296, 0.04)
for k in range(2): put(sfx, 24.05 + 0.85 * (k + 1) - 0.02, lp(noise(0.08), 400) * np.exp(-45 * tt(0.08)), 0.05)
# ---- escreve ----
def wr(path, a):
    a = np.clip(a, -1, 1); i16 = (a.T * 32767).astype(np.int16)
    with wave.open(path, 'wb') as w: w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(i16.tobytes())
wr("bed.wav", bed); wr("sfx.wav", sfx)
# voz-guia (22,05 kHz mono) → 44,1 kHz estéreo, recortada
w = wave.open("guia.wav"); sr = w.getframerate(); x = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32768; x = x[:int(DUR * sr)]
y = np.interp(np.linspace(0, len(x) - 1, int(len(x) * SR / sr)), np.arange(len(x)), x); v = np.zeros((2, N)); v[0, :len(y)] = y[:N]; v[1, :len(y)] = y[:N]
wr("voice.wav", v * 0.9)
print("stems ok", DUR, "s")
