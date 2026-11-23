"""Sintetiza a VOZ-GUIA provisória (Piper pt-BR) a partir de roteiro.json.
Serve só para travar tempos de legenda/corte. A narração final é a do usuário.
Uso: python3 make_voice.py MODELO.onnx saida.wav [length_scale]"""
import sys, json, wave
import numpy as np
from piper import PiperVoice, SynthesisConfig
model, out = sys.argv[1], sys.argv[2]
ls = float(sys.argv[3]) if len(sys.argv) > 3 else 1.0
voice = PiperVoice.load(model)
sr = voice.config.sample_rate
cfg = SynthesisConfig(length_scale=ls, noise_scale=0.6, noise_w_scale=0.7)
r = json.load(open("roteiro.json"))
audio = []; t = 0.0; marks = []
def sil(sec):
    global t
    n = int(sec*sr); audio.append(np.zeros(n, np.int16)); t += n/sr
sil(0.12)
for c in r["cenas"]:
    for i, f in enumerate(c["frases"]):
        if f["pausa"] > 0: sil(f["pausa"])
        chunks = [ch.audio_int16_array for ch in voice.synthesize(f["t"], syn_config=cfg)]
        a = np.concatenate(chunks); st = t
        audio.append(a); t += len(a)/sr
        marks.append({"cena": c["id"], "texto": f["t"], "ini": round(st,3), "fim": round(t,3)})
sil(0.4)
wav = np.concatenate(audio)
with wave.open(out, "wb") as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr); w.writeframes(wav.tobytes())
json.dump(marks, open(out.replace(".wav", "_frases.json"), "w"), ensure_ascii=False, indent=1)
words = sum(len(m["texto"].split()) for m in marks)
print(f"duração {t:.1f}s  palavras {words}  ritmo {words/(t)*60:.0f} palavras/min  sr {sr}")
