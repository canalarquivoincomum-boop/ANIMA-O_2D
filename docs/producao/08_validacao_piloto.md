# 08 — Etapa 4: Piloto de validação (0–29,8 s) e comparação com as referências

**Entregável:** `producao/piloto/piloto_A_ultima_musica_1080x1920.mp4` (MP4, 1080×1920, 30 fps, 29,8 s, 20 MB) e `producao/piloto/contato_piloto.jpg` (15 planos).

O piloto cobre as cenas **S1 (gancho), S2 (regra) e S3 (protagonista)**: 15 planos que exercitam todos os recursos críticos do filme: o efeito-assinatura (transparência), atuação com reação (careta), objeto plantado (avental/flor), cenários em 3 planos, estrada em perspectiva, legenda karaokê, whip, e som.

> **Aviso:** a narração é uma **voz-guia sintética** (Piper pt-BR) e os sons são sintetizados. Servem para travar **tempo e sincronia**, não para julgar qualidade de voz ou de som.

---

## 1. O que foi construído

```
producao/
  engine/   lib.js (matemática, trilhas)   ch.js (rig do personagem)   sets.js (cenários em camadas)
            story_pilot.js (15 planos)     main.html (câmera, legenda, whip)   render.js (Playwright)
  audio/    roteiro.json  make_voice.py  align_words.py  refine_words.py  make_sfx.py  → voice/bed/sfx
  render_all.sh   build_piloto.sh   piloto/
```

- **Render:** SVG por `render(t)` + Playwright (Chromium) → PNGs em paralelo (4 processos) → ffmpeg. **893 quadros em 1080×1920 levam ~47 s.** Isso permite iterar várias vezes por hora.
- **Rig:** cabeça grande, olhos com pupila pequena e brilho, 13 expressões interpoladas, IK nos braços e pernas, respiração, piscada automática, olhar com alvo, trança com pêndulo, sombra de contato.
- **Efeito-assinatura:** transparência por **máscara** que avança do fim do membro até o ombro, **borda de vidro** com a forma real da mão e **partículas**; a fita e os objetos ficam opacos (documento 05, seção 8).
- **Som:** voz + cama (pad, ambiente) com *sidechain* + SFX por imagem, normalizado a −14 LUFS.

---

## 2. Método de validação (o que eu realmente fiz)

Conforme a checklist do canal, a validação é **no MP4 exportado**, não no HTML:

| Verificação | Como |
|---|---|
| QA automático | `docs/analise/ferramentas/qa_video.py` no MP4 final |
| Revisão em tamanho cheio | 10 planos em 576×1024 / 1080×1920 (gancho, P4, P6/P7, P2, P8b, P11, P12a/b, P10, P13) |
| Revisão a ~0,1 s | 3 sequências críticas no MP4 final: **careta do desafino** (20,0–20,8 s), **whip** (25,18–25,41 s) e **vidro no braço** (10,85–12,25 s); também a troca da flor, o whip inicial e a progressão do vidro em P4 |
| Contato por plano | 15 planos com tempo (arquivo `contato_piloto.jpg`) |
| Áudio | loudness, nível voz×fundo, silêncios |

**Limite honesto:** **não revi os 893 quadros um a um.** Revisei por amostragem densa nos pontos críticos. Falhas em quadros intermediários podem ter escapado.

---

## 3. Comparação com os padrões técnicos observados nas referências

| Critério | Referências (14) | Piloto | Veredito |
|---|---|---|---|
| Primeira palavra | 0,00 s em 14/14 | 0,00 s (QA: silêncio inicial 0,00 s) | ✅ |
| Gancho: close extremo no plano 0 | ≥ 7/14 | sim (P1, z 3,0) | ✅ |
| Corte/whip do gancho | 0,47–0,70 s | 0,60 s | ✅ |
| Problema visível em ≤ 3 s | V02, V07, V12 (exemplos fortes) | mão de vidro contra a luz em 0,0–0,6 s e na fala "transparente" aos 5 s | ✅ |
| Mediana de plano | 1,2–2,1 s (sensível) | **1,67 s** (QA) / 1,7 s (lista exata) | ✅ |
| Mudanças visuais em 0–10 s | 2–11 (mediana ≈ 7) | 6 (QA) | ✅ (limite inferior) |
| Planos > 4 s | holds só em peso emocional | 1 (a estrada, 4,45 s) | ✅ |
| Loudness | −14,0 LUFS (9/14) | **−14,0 LUFS**, pico −1,5 dBFS | ✅ |
| Voz × fundo | 7–17 dB (maioria 14–17) | **15,5 dB** | ✅ |
| Legenda | 2–4 palavras, ativa dourada, y 775 | idem; largura ≤ 500 medida | ✅ (fonte Inter, não Poppins) |
| Flashes brancos/pretos | existem (trovão em V01) | 0 | ✅ (regra do canal) |
| Trechos congelados > 2,5 s | n/d | 0 | ✅ |
| Silêncios > 0,5 s | 1 em V01 | 3 (pausas de cena da voz-guia, 0,5–0,85 s) | ⚠️ ver 6.4 |
| Velocidade de fala | 209–225 palavras/min | 159 palavras/min (guia) | decisão (documento 06) |
| Plantar e pagar | até 4 objetos por vídeo | **10 linhas** planejadas; 3 plantadas no piloto (flor/avental, para-lama, gesto) | ✅ |
| Resolução e formato | 576×1024 | 1080×1920, 30 fps, MP4 | ✅ |

**Resultado do QA automático no MP4 final:** 0 falhas, 1 aviso (silêncios das pausas de cena da voz-guia).

---

## 4. Falhas concretas encontradas e o que foi feito

Todas foram encontradas **vendo imagens**, nenhuma pela revisão do roteiro ou do storyboard. Esse é o ponto da etapa: um roteiro bem escrito não garante uma animação bem executada.

| # | Falha (evidência) | Causa | Correção | Estado |
|---|---|---|---|---|
| 1 | **Faixa preta no topo** em vários planos | camadas `far` curtas demais quando a câmera afasta/desloca | coberturas gigantes no fundo (±3000) e parede da sala estendida | ✅ |
| 2 | **Gancho mostrava o rosto, não a mão** contra a luz | janela alta demais para a mão da criança; câmera mal centrada | **banquinho** (motiva a altura), janela mais baixa, braço estendido, câmera na mão | ✅ |
| 3 | **Vidro virava "mancha desbotada"** | só máscara com alfa baixo, sem contorno | **borda de vidro** com a forma real da mão e do braço + partículas | ✅ |
| 4 | Mão transparente junto do rosto parecia **bolha na frente da boca** (P4) | pose com a mão perto do rosto | pose `inspectOut`: **braço estendido** contra a luz | ✅ |
| 5 | Braço dobrado do homem virava um **"D" ilegível** (P6/P7) | tubo dobrado em ângulo fechado | pose `hang`: **braço pendurado, reto**; progressão visível dentro do plano | ✅ |
| 6 | **Mão do Bento** (P9) era um bloco laranja quebrado | geometria de manga e mão errada | refeita (manga em tubo + punho + polegar + flor carregada) | ✅ |
| 7 | **Flauta cruzava o rosto** (P10) | ponto de ancoragem na altura do nariz | âncora na **boca** (y −158) + mãos na flauta | ✅ |
| 8 | **Careta antes da palavra "mal"** (19,0 s vs 20,2 s) | tempo escrito antes de alinhar à voz | careta e desafino a **20,12 s** (sincronizados) + **flinch corporal** + abaixa a flauta | ✅ |
| 9 | **Beliscão do pai parecia pinça/garra** (P12b) | várias iterações de desenho | dedos retos e paralelos com fresta + outros dedos recolhidos | ✅ (aceitável, ainda estilizado) |
| 10 | **Ísis cortada na borda / cabeça sob a legenda** (P12b, P13) | posição e escala | reposicionada **abaixo** (P12b) e **acima** (P13) da faixa da legenda | ✅ |
| 11 | **Legenda ultrapassava a tela** ("Meu pai prometeu chegar") | agrupamento por nº de palavras, não por largura | agrupamento por **largura medida (≤ 500)** | ✅ |
| 12 | Legenda da cena seguinte entrava cedo ("Hoje era o recital" aos 28,6 s) | alinhamento por palavra errado no fim da S3 | `refine_words.py`: limites exatos da frase + sílabas | ✅ |
| 13 | **Facho de luz desbotava** os personagens | desenhado por cima dos atores | movido para **atrás** dos atores | ✅ |
| 14 | **Nada tinha sombra** (personagens "flutuavam") | ausente | **sombra de contato** em todo personagem | ✅ |
| 15 | **Faixa preta no whip** (visto em revisão a 0,03 s) | cena deslizando deixa a borda descoberta | cena duplicada com deslocamento para preencher | ✅ |
| 16 | **Arquivo de 240 MB** | grão em CRF 17 explode o bitrate | CRF 20 + `maxrate 10M`: **20 MB** | ✅ |
| 17 | **Pontas de vidro do braço** irregulares em cotovelos | polígono de recorte por segmentos | mitigado com poses estendidas | ⚠️ parcial |

---

## 5. O que o piloto prova — e o que não prova

### Prova
- O **motor consegue** entregar o traço do canal de forma consistente (mesmo contorno, mesmas proporções, paleta coesa) em 5 cenários + a cabine, 3 personagens articulados (Ísis, seu Genaro, seu Alcides), o avental da dona Odete e a mão do Bento, ao longo de 15 planos.
- O **efeito-assinatura** (transparência com vidro e partículas) funciona e é **legível em 1080×1920**, mesmo com a fita e a flauta opacas.
- O **gancho** segue o padrão observado (close extremo → whip aos 0,6 s) e entrega "promessa + objeto + problema visível" em < 6 s.
- A **sincronia** voz/legenda/SFX é controlável por palavra (o desafino cai em "mal").
- O **ritmo e a mixagem** ficam dentro das faixas medidas nas 14 referências.

### Não prova
- **Consistência em 52 planos.** São 15 de 52; faltam Bento, vó e dona Marlene, o palco, a varanda, o espelho, a cabine em detalhe e os flashbacks sépia.
- **A emoção do clímax.** O piloto não contém a virada nem o final.
- **A qualidade da narração e da trilha.** Voz-guia e sons sintéticos.
- **Retenção.** Nenhum dado; a comparação é de **padrões técnicos**, não de resultado.

---

## 6. Fraquezas que continuam (sem maquiagem)

1. **Microatuação abaixo do alvo do documento 05.** Em P4 há 3 chaves de expressão em 2,4 s (alvo em cena de reação: uma troca a cada 0,3–0,5 s). Só P10 chega perto, e por ter uma reação-evento.
2. **Pouca variedade de ângulos.** Predominam frontais e 3/4; há costas só na estrada. Falta perfil completo, over-the-shoulder e plano aéreo.
3. **Mão estilizada demais em close** (a "pinça" e a mão do Bento). Aceitável no piloto, mas é o ponto que mais denuncia "SVG gerado".
4. **Vidro em cotovelo fechado** (falha 17): preferir braço estendido ou pendurado.
5. **Fundos quase estáticos.** Só facho, vinheta e partículas; falta vida ambiente (cortina, poeira, trânsito).
6. **Silêncios das pausas de cena** (0,5–0,85 s) passam do que a regra permite fora da pausa dramática. A narração real deve ser cortada conforme o canal.
7. **Fonte:** Inter ExtraBold, não Poppins.
8. **Câmera só com pushes e pans suaves.** Falta mais variação (por exemplo, trilho lateral, câmera na mão leve em momentos de tensão).
9. **Som sintético.** A caixa de música, a flauta e o motor são placeholders.

---

## 7. Avaliação direta: "domínio real da animação"?

| Dimensão | Avaliação | Evidência |
|---|---|---|
| Legibilidade e identidade visual | **No patamar das referências, com identidade própria** | consistência de traço, 3 planos, cor com função, legenda |
| Direção (ideia visual, medidor integrado, plantar/pagar) | **Acima das referências** em intenção | efeito-assinatura integrado ao corpo; 10 pistas rastreadas |
| Ritmo e montagem | **Dentro das faixas medidas** | QA e métricas |
| Atuação e variedade de ângulos | **Abaixo do alvo que nos impusemos** | seção 6 (itens 1–3) |
| Acabamento (mão, vidro em dobras) | **Em progresso** | seção 6 (itens 3–4) |
| Prontidão para produção completa | **Parcial** | faltam elenco e cenários + ajustes de atuação |

O piloto demonstra que o **método funciona e escala**, não que o filme já esteja no nível final.

---

## 8. Recomendação antes de produzir o vídeo completo

**Avançar, mas com 5 ações antes** (para evitar refação):

1. **Aprovar** com o usuário o roteiro, os nomes e a virada (documento 06, seção 8).
2. **Construir o elenco que falta** (Bento, vó Cota, dona Marlene) e os cenários de S4–S9 (varanda, espelho, cabine, colégio/palco).
3. **Segunda passada de atuação:** mais chaves de expressão em S5 e S7; poses de perfil e costas; refinar a mão em `pinch`/`grip`.
4. **Gravar a narração real** do usuário (e a mensagem de voz do pai), realinhar palavra a palavra e cortar silêncios > 140 ms.
5. **Trilha e SFX próprios**; instalar Poppins; revisão quadro a quadro de 0,1 s em **todas** as cenas críticas do filme.

**Risco de refação:** baixo para cenários e elenco (o motor já os suporta); médio para atuação (depende de quanto refino se quer na segunda passada).

---

## 9. Como reproduzir

```bash
cd producao
# 1) voz-guia e tempos (precisa baixar a voz do Piper uma vez; ver audio/make_voice.py)
python3 audio/make_voice.py PT_BR-faber-medium.onnx audio/guia.wav 0.9
HF_HUB_DISABLE_XET=1 python3 -I audio/align_words.py audio/guia.wav audio/guia_frases.json audio/words.json
python3 audio/refine_words.py && python3 audio/make_sfx.py
# 2) render (4 processos) e montagem
./render_all.sh engine/main.html /tmp/pilot_hi 892 1080 1920
./build_piloto.sh /tmp/pilot_hi piloto/piloto_A_ultima_musica_1080x1920.mp4 1080
# 3) QA
python3 -I ../docs/analise/ferramentas/qa_video.py piloto/piloto_A_ultima_musica_1080x1920.mp4 --story-end 29.0
```

Dependências: Node + Playwright (Chromium), ffmpeg, Python (`piper-tts`, `faster-whisper`, `numpy`, `opencv-python-headless`).
