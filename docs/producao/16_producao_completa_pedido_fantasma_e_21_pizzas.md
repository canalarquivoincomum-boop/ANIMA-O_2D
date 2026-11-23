# 16 — Produção completa: "Pedido Fantasma" e "O Prédio das 21 Pizzas"

Duas animações verticais (1080×1920, 30 fps) com o **Nando**, o motoboy, como protagonista fixo, narradas com a voz **Lax** do ElevenLabs.

| | Pedido Fantasma | O Prédio das 21 Pizzas |
|---|---|---|
| Duração | 106,3 s | 103,1 s |
| Narração | 105,5 s | 102,3 s |
| Palavras | 310 | 306 |
| Planos | ver `producao/engine/s1.js` | ver `producao/engine/s2.js` |
| Arquivo | `producao/s1/pedido_fantasma_1080x1920.mp4` | `producao/s2/predio_21_pizzas_1080x1920.mp4` |

## 1. A voz
- Voz: **"Lax – Funny, Sarcastic and Smooth"** (`voice_id tS45q0QcrDHqHoaWdCDR`), uma voz da **biblioteca do ElevenLabs** disponível no workspace do usuário. **Não é clone nem imitação de nenhuma pessoa real**: é a voz de biblioteca de nome Lax, pedida pelo usuário.
- Modelo `eleven_v4`, **uma geração por história** (sem repetir chamadas, para não gastar créditos): 2.053 + 1.959 = 4.012 créditos. Os textos exatos enviados estão em `producao/eleven/s1_prompt.txt` e `s2_prompt.txt`.
- A mesma voz faz todos os personagens; as falas de personagem usam marcas de interpretação (`[elderly voice]`, `[softly]`, `[whispers]`…), em vez de vozes extras (o plano gratuito não comportava).
- MP3 originais: `producao/eleven/s1_lax.mp3`, `s2_lax.mp3`.

## 2. Como cada plano nasceu da fala
1. O áudio real foi transcrito (Whisper `small`, palavra a palavra) e **alinhado ao roteiro** (`producao/eleven/align_el.py`). Os limites de frase foram **ajustados às pausas reais** da voz (`snap.py`, detecção de silêncio a −38 dB).
2. `make_data.py` gera `engine/data_s1.js` e `data_s2.js`: tempo de cada frase (`PH`) e de cada palavra (`WORDS`).
3. Cada plano começa 60 ms antes da frase e mostra literalmente o que ela diz. Os **gestos de imagem usam o tempo da palavra** (ex.: o anel "AZULEJO" acende em *azulejo*; "DIM" em *dim*; os 21 cartões de avaliação em *avaliações*).
4. A boca só se mexe quando **o personagem fala em cena** (Dona Cida, seu Aníbal), sincronizada às palavras reais (`KIT.mouth`). Quando o Nando narra, ele não mexe a boca.

## 3. O que foi construído
- **Motor** (`producao/engine/`): `kit.js` (elenco extra, objetos, fundos desfocados, plano de conversa, push-in), `s1.js`, `s2.js`, `main_s.html` (renderizador comum), `lot4.js` ampliado (mobiliário na escala do elenco, mesa com toalha, terreno "um ano depois" com forno, varal de lâmpadas e moto).
- **Escada de verdade** (história 2): a escada rola e os pés pisam em degraus reais (cada pé segue um ciclo de apoio/passo, o quadril acompanha). Bug típico evitado: pé flutuando.
- **Corredor em perspectiva de 1 ponto** com 8 portas, luzes de teto e 14 pessoas caminhando com pratos (escala por profundidade).
- **Áudio**: trilha e efeitos sintetizados e sincronizados por evento (`make_sfx_s1.py`, `make_sfx_s2.py`, `sfxlib.py`): passos na escada, batidas na porta, "dim-dom", fita descolando, relógio do app, batimento do dilema… A trilha **abaixa sob a voz** (sidechain) e o conjunto sai a −14 LUFS.

## 4. Ganchos e estrutura (aplicando o estudo)
| | Pedido Fantasma | 21 Pizzas |
|---|---|---|
| Gancho (≤ 6 s) | 23:47 + endereço + "casa demolida há 30 anos" (5,7 s) | 21 pizzas para o mesmo apartamento (3 s) |
| Aposta | cancelar custa a semana inteira; aluguel vence | 40 min, elevador quebrado, nota 4,52 (mínimo 4,5) |
| Viragem | "Eu sentei." (54 s) | "Dim-dom." (73 s, 71% do vídeo) |
| Pistas plantadas e pagas | fita no capacete → fita no capacete do Zé; "Senta" → "Abre a caixa"; relógio → "chegava em seis minutos" | fita isolante no capacete → conserta a campainha; bilhetes → 21 pratos |
| Final | a casa 14 volta | o cartaz muda: "Toque a campainha. Ela funciona." |

## 5. Verificação (bugs, proporção, "atravessando coisas")
QA automático do MP4 (`docs/analise/ferramentas/qa_video.py`):

| Item | Pedido Fantasma | 21 Pizzas |
|---|---|---|
| Resolução / fps | 1080×1920 / 30 | 1080×1920 / 30 |
| Loudness / pico | −14,0 LUFS / −1,1 dBFS | −14,5 LUFS / −1,4 dBFS |
| Mudanças visuais | 57 (mediana de plano 1,68 s) | 44 (mediana 1,73 s) |
| Mudanças nos primeiros 10 s | 7 | 6 |
| Flashes / trechos congelados | nenhum / nenhum | nenhum / nenhum |
| Resultado | 0 falhas, 0 avisos | 0 falhas, 1 aviso (6 planos > 4 s, todos de peso emocional: nota 4,52, bilhetes, perna tremendo, campainha, cartaz, multidão) |

Inspeção visual:
- Folhas de contato a cada 1–1,7 s de **toda** a linha do tempo das duas histórias, inspecionadas plano a plano; quadros críticos conferidos em resolução cheia.
- Corrigidos nesta rodada: texto estourando o cartaz, "23:471994" sobreposto, helmet flutuando acima da prateleira, moto espelhada com "ZAP" invertido, legenda por cima do telefone no zoom, campainha e cartaz **revelados antes da hora**, câmera que não chegava à janela do 82, anéis de destaque adiantados em relação às palavras, mato alto no terreno reformado, olhos "em círculo" na transição de expressão sob o capacete, número do relógio do app.
- Regras mantidas: a mão nunca sobe acima do queixo; personagens sentados atrás da mesa (toalha esconde as pernas); capacete sempre com a mesma rachadura e a mesma fita.

## 6. Limites assumidos (sem fingir)
- A cozinha-fantasma do plano "A cozinha era ali" é **abstrata** (contornos luminosos de bancada/armário), não uma reconstrução fotográfica.
- Multidões de plano aberto usam um elenco de 8 variações recombinadas; a mesma pessoa pode aparecer duas vezes.
- Corpo de personagem é "chibi" (cabeça grande): cadeiras e mesas foram desenhadas na escala desse corpo, não em metros reais.
- A voz única para todos os personagens é uma limitação de orçamento, não de criação.
