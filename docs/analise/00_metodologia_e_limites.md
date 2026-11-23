# 00 — Metodologia, limites de acesso e como ler esta análise

## 0. Aviso principal: vieram 14 vídeos, não 10

O pedido fala em "10 vídeos", mas foram anexados **14 arquivos MP4**. Analisei os 14. Se existirem 10 "oficiais", me diga quais, porque os 4 extras mudam as médias.

A numeração V01–V14 segue a ordem alfabética do nome do arquivo (o hash). Ela não é a ordem em que você os anexou.

| Vídeo | Arquivo (início do hash) | Duração | Marca d'água visível (leitura aproximada) |
|---|---|---|---|
| V01 | 02099005 | 137,1 s | stickerando |
| V02 | 0f3b8c28 | 153,2 s | aprendendocomvitinho |
| V03 | 28e749d2 | 85,2 s | olacashey (leitura incerta) |
| V04 | 8293b7d3 | 159,5 s | aprendendocomvitinho |
| V05 | 8516f571 | 142,1 s | stickerando |
| V06 | 88f00b66 | 162,0 s | stickerando |
| V07 | c66f36d8 | 160,4 s | aprendendocomvitinho |
| V08 | c68e9291 | 170,7 s | aprendendocomvitinho |
| V09 | c8c5dd0c | 143,0 s | stickerando |
| V10 | cef7ef3c | 135,0 s | stickerando |
| V11 | deb06259 | 140,5 s | stickerando |
| V12 | ecd63168 | 153,4 s | aprendendocomvitinho |
| V13 | f425784f | 142,1 s | orbita.curtas + selo "AI-generated" |
| V14 | f5b60608 | 135,0 s | stickerando |

Todos são verticais (576×1024, 30 fps), têm áudio estéreo AAC e terminam com um cartão escuro do TikTok de ~4,3–4,5 s (9,8 s em V13). Esse cartão é do download da plataforma e não faz parte da obra. Nas medições de ritmo ele foi descontado quando possível.

Ou seja: **são cópias baixadas do TikTok, com marca d'água e resolução baixa.** Isso limita o que dá para afirmar sobre acabamento, grão e cor.

## 1. Tags de confiança usadas em todos os documentos

| Tag | Significado |
|---|---|
| **[OBS]** | Observado diretamente em quadros que eu vi ou na transcrição que eu li. |
| **[MED]** | Medido por script, sobre todos os quadros ou todo o áudio. Tem margem de erro explicada. |
| **[HIP]** | Hipótese de ofício, plausível mas **não testada**. Só métricas de retenção confirmariam. |
| **[LIM]** | Algo que eu não consegui acessar ou medir. |

## 2. O que eu realmente acessei

### Quadros (vídeo)
- **[MED]** Todos os ~60 mil quadros (14 vídeos × ~145 s × 30 fps) foram decodificados e entraram nas métricas de diferença entre quadros (detecção de cortes, "intensidade de movimento").
- **[OBS]** Eu **vi com os próprios olhos**:
  - o primeiro quadro de cada plano detectado (~850 quadros, em folhas de contato com timestamp);
  - os 3 primeiros segundos de cada vídeo, em 8 instantes (0; 0,33; 0,67; 1; 1,5; 2; 2,5; 3 s);
  - tiras de 8 quadros em 8 planos longos;
  - 4 quadros em resolução cheia, para o traço.
- **[LIM]** **Não vi todos os 60 mil quadros um a um.** Isso é inviável. Microatuação em 30 fps (piscada, assentimento de 0,2 s, sobrancelha) só foi vista nas amostras. Quando descrevo atuação, ela vem dessas amostras e da narração, não de uma varredura quadro a quadro.

### Áudio
- **[OBS]** Transcrevi a narração com Whisper `small` (CPU, int8), com timestamp por palavra. Conferi o texto contra as **legendas queimadas** que apareceram nos quadros. Nomes próprios saem trocados na transcrição (por exemplo "vô" virou "voo"/"vodita", "Paçoca" virou "Pássoca"). Usei a legenda como verdade quando houve conflito.
- **[MED]** Medi, por vídeo: velocidade de fala (palavras/min), pausas entre frases, loudness integrado (EBU R128), nível da voz e nível do "fundo" nas lacunas de fala.
- **[LIM]** **Eu não "ouço".** Não consigo julgar timbre, emoção da voz, melodia, qualidade da música ou o desenho de som dos efeitos. Falo só de números (volume, pausas, ritmo da fala) e do que o texto e a imagem sugerem. Entonação (altura/pitch) **não foi medida**.
- **[LIM]** Não separei música de efeitos de ambiente. O nível de fundo mostra *se há som além da voz*, não *o que é*.

## 3. Resultados que descartei por falta de confiabilidade

1. **Classificação automática de movimento de câmera (push-in/pull-out/pan).**
   - Rodei dois métodos (fluxo óptico e estimativa de escala entre o primeiro e o último quadro do plano) e validei com tiras de quadros.
   - Os dois erraram: um "pull" era um push-in, um "static" era um pull-out, e a maioria dos planos caiu em "complexo" porque o personagem se mexe e o plano pode esconder cortes.
   - **Não uso nenhum percentual de zoom.** O que afirmo sobre câmera vem só da inspeção visual (seção 4 do documento 02).
2. **Contagem de cortes.** É heurística, por diferença de quadros. Apresento duas versões:
   - **"cortes duros" (conservadora)**: perde trocas suaves e inclui poucos falsos positivos;
   - **"mudanças visuais" (sensível)**: pega mais trocas, mas também borrões de transição e animação rápida (falsos positivos prováveis, na casa de dezenas por vídeo).
   O valor real fica entre as duas. A mediana de duração de plano, nas duas leituras, fica entre ~1,2 e ~2,7 s, conforme o vídeo.

## 4. Correlação não é causa

- **Não recebi nenhum dado de views, retenção, curtidas ou tempo assistido.** Você mencionou "milhares de visualizações" nas regras, mas sem números por vídeo.
- Portanto, **nada aqui prova que uma técnica "causa" engajamento.**
- O que a análise faz é: (a) descrever o que os 14 vídeos têm em comum; (b) explicar o mecanismo narrativo plausível de cada técnica; (c) marcar **[HIP]** onde só dá para saber com retenção por segundo.
- Padrões comuns a 14 vídeos podem ser a fórmula do gênero (o que "todo mundo copia"), e não o que gerou os melhores resultados.
- Para separar uma coisa da outra, o guia traz um **plano de teste A/B** (documento 03, seção 10).

## 5. Nota sobre o ambiente (transparência)

Para baixar o modelo de transcrição foi preciso liberar hosts do Hugging Face. Criei, com a sua aprovação, o ambiente pessoal **`anima-o-2d-audio`** (hosts liberados: `huggingface.co`, `cdn-lfs.huggingface.co`, `cdn-lfs-us-1.hf.co`, `cas-bridge.xethub.hf.co`, `transfer.xethub.hf.co`, `us.aws.cdn.hf.co`). Ele só vale para sessões que o usem. Se não quiser mantê-lo, remova-o nas configurações de ambientes.

## 6. Direitos autorais e originalidade

- Os 14 vídeos são obras de terceiros. **Não incluí no repositório** as transcrições completas, os quadros extraídos nem as folhas de contato, só análise, números e citações curtas.
- Os documentos descrevem **princípios**. As histórias, os personagens e os cenários de exemplo do guia (documento 03) são **originais**, criados para este projeto, e foram checados contra os 14 roteiros para não repetir premissa nem elenco.
- Ponto de atenção: **a fórmula "Nesta cidade, [regra absurda]…" é compartilhada por quase todos os 14 vídeos**, de contas diferentes. É um gênero, mas usá-la igual faz o seu canal parecer um dos outros. O guia propõe uma assinatura própria.
