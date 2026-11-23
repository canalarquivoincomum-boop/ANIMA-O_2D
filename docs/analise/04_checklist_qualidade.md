# 04 — Checklist de qualidade: detectar e corrigir erros antes da entrega

Use na ordem. **Bloco 7 é obrigatório**: assistir ao MP4 exportado inteiro. Este checklist inclui os erros recorrentes que o canal já registrou (skill do Escuta Só) e os que a análise das 14 referências evidenciou.

Legenda de método: **[AUTO]** = a ferramenta `ferramentas/qa_video.py` mede; **[OLHO]** = só revisão humana; **[MESA]** = revisão do roteiro/planilha antes de animar.

---

## Bloco 1 — Premissa e originalidade [MESA]

- [ ] A premissa **não está** na lista de premissas já usadas pelas 14 referências (documento 03, seção 2).
- [ ] O gancho **não começa** com "Nesta/Na minha cidade, [regra]" literal.
- [ ] Nenhum nome, personagem, cenário ou frase-assinatura das referências (Tito, Paçoca, seu Valdir, Duda, "Lava essa boca, Creusa", "Vamos ver", "Tava passando" etc.).
- [ ] Elenco novo: cada personagem com rosto, cabelo, corpo, altura, pele e roupa próprios.
- [ ] Sem selo, marca d'água ou logotipo de outra conta; sem aparência de saída padrão de IA.
- [ ] A história cabe em **≤ 120 s** de vídeo.

## Bloco 2 — Roteiro [MESA]

- [ ] **Teste dos 3 s:** alguém que lê só o primeiro parágrafo entende qual é o problema?
- [ ] Problema pessoal e concreto aparece **até ~20 s**; **gatilho até ~30 s**.
- [ ] Máximo de **3 exemplos** da regra antes do protagonista.
- [ ] **Tabela de plantio/pagamento preenchida**; nenhuma linha sem pagamento.
- [ ] **Refrão de três** que muda de sentido na última vez (ou justificativa de por que não há).
- [ ] O herói **contribui** para o dano de alguma forma.
- [ ] A **virada** reinterpreta o que já vimos e cai em ~60–80% do tempo.
- [ ] O **clímax é uma ação física pequena** sem discurso.
- [ ] O final é **feliz e inesperado, mas justo**: as pistas estavam lá. (Teste: peça a alguém para adivinhar o final aos 60%.)
- [ ] **Sem moral falada. Sem CTA** ("se inscreva", "siga").
- [ ] Orçamento de palavras: **320–360** para ~115 s a 165–185 palavras/min.
- [ ] Toda frase abstrata tem uma **imagem concreta** correspondente.
- [ ] **Narração e imagem nunca se contradizem.**

## Bloco 3 — Prévia visual [OLHO]

- [ ] Prévia em imagens aprovada **antes** de animar.
- [ ] O medidor visível está legível em tela pequena (celular).
- [ ] A paleta tem **função** (casa, medo, esperança, memória) e muda com a emoção.
- [ ] Cada set tem **3 planos** (fundo, médio, frente) e linha de chão; parede nunca vazia; céu azul de dia.
- [ ] Cada set reaparece 2–4 vezes em distâncias diferentes; móveis/objetos **na mesma posição** entre cortes.
- [ ] Inserts de objeto têm **fundo do ambiente**, não bege liso; poucos inserts sem personagem.

## Bloco 4 — Animação e atuação [OLHO, 0,1 s nas cenas críticas]

| Erro a detectar | Como detectar | Como corrigir |
|---|---|---|
| Mesmo rosto sorrindo para a câmera | Ver 10 s em silêncio; contar quantas vezes o personagem olha para a lente. | Olhar com alvo (objeto/outro); câmera só no gancho e no final. |
| Boca mexendo durante a narração | Quadros a 0,1 s. | Só mexe quando o personagem fala; reação por olhar, sobrancelha, corpo. |
| Cena triste com sorriso de boca aberta | Revisar expressões do ato 3. | Trocar por meia-pálpebra, olhar para baixo, queixo tenso. |
| **Troca de expressão lenta** | Cena de reação sem mudança por > 0,5 s. | Sequência olhar → cabeça → gesto → peso; construir a expressão em 0,5–1 s. |
| Ouvinte parado enquanto o outro fala | Ver o personagem que não fala. | Reação do ouvinte (olhar, respiração, peso). |
| Personagem congelado | `qa_video.py`: "trechos congelados > 2,5 s" [AUTO]. | Respiração, balanço, piscada automática. |
| **Pernas cortadas** ou zoom que corta na cintura | Revisar closes. | Corpo inteiro visível; sentado com coxas/joelhos/canelas/sapatos. |
| **Mão desconectada** do corpo | Quadros a 0,1 s quando o personagem pega algo. | Alvo da mão ≤ comprimento natural do braço; reposicionar o corpo. |
| Braço duplicado ou "cano" reto | Revisar poses. | Braço curvo de uma peça (manga + punho + mão). |
| Objeto "teletransporta" | Acompanhar cada objeto móvel. | Transição contínua; mesma posição e escala de chegada. |
| Mão/objeto sobrepõe o rosto | Closes. | Mão/objeto fora do contorno da cabeça (cabeça por cima dos braços). |
| Nada atravessa nada | Procurar pernas na parede, mala no ar, móvel dentro de móvel. | Camadas corretas (atrás do balcão: desenhar antes da frente; janela: clip). |
| **Escala inconsistente** (objeto muda de tamanho entre cenas; cachorro, criança, adulto) | Comparar o mesmo objeto em dois cortes. | Tabela de escala (adulto ~1,12; criança ~0,85; objetos fixos). |
| Lápis com ponta errada, etc. | Cenas de desenho. | Ponta no papel; o lápis acompanha o traço. |
| Personagens colados lado a lado | Planos em dupla. | Espaço entre eles; over-the-shoulder em cliente/atendente. |
| Rótulos/ícones/corações flutuando no lugar da atuação | Revisar. | Substituir por atuação; o medidor é o único ícone permitido. |
| Piscadas/flashes brancos ou pretos | `qa_video.py` "flashes" [AUTO] (eles existem nas referências, p.ex. trovão). | Retirar ou suavizar; só com justificativa na imagem. |

## Bloco 5 — Edição e câmera [AUTO + OLHO]

- [ ] **[AUTO]** Mediana de plano 1,0–2,4 s (referências: 1,2–2,1 s).
- [ ] **[AUTO]** ≥ 3 mudanças visuais nos primeiros 10 s.
- [ ] **[AUTO]** Poucos planos > 4 s (só holds de peso emocional, 2–5 s).
- [ ] Planos de **0,5–2,3 s** nas rajadas de tensão; **holds** de 2–5 s no ponto mais baixo e no final.
- [ ] Zoom e empurrão **têm função** (aproximar na tensão, afastar na revelação, parar no clímax); sem zoom exagerado em rostos; sem rostos sobrepostos.
- [ ] Ângulos variados (costas, aéreo, split-screen, tilt, over-the-shoulder, personagem pequeno em espaço grande).
- [ ] Transições: corte seco como padrão; whip-pan de 2–3 quadros; íris para memória; **nenhuma transição cobre a cena**.
- [ ] Após trocar um elemento compartilhado (set, legenda, placa): **re-renderizar TODAS as cenas que o usam**.

## Bloco 6 — Legendas e texto na tela [OLHO]

- [ ] Fonte arredondada negrita (~44–46 px), 2–4 palavras, branco com contorno escuro, **palavra falada em dourado**.
- [ ] **y ≈ 775/1024**, longe da borda da interface; **nunca cobre rostos** nem o objeto-chave; nunca sai da tela.
- [ ] Texto cabe na placa (largura medida).
- [ ] Texto de bilhete/placa aparece **palavra por palavra ligeiramente antes da voz**.
- [ ] A voz **nunca vem adiantada** em relação à imagem.
- [ ] Números e contagens visíveis quando a história os cita.

## Bloco 7 — Áudio [AUTO + OUVIDO]

- [ ] **[AUTO]** Loudness integrado ≈ **−14 LUFS** (±2) e pico real ≤ **−1 dBFS**.
- [ ] **[AUTO]** Começa **direto**, sem silêncio inicial > 0,4 s.
- [ ] **[AUTO]** Sem silêncios > 0,5 s além da **pausa dramática deliberada de 0,3–0,5 s** antes da frase-chave.
- [ ] Silêncios > 140 ms **cortados**; fala **sem edição que soe artificial** (respirações naturais mantidas).
- [ ] Trilha **nova** para esta história, **baixa, com ducking**, só em cenas-chave e **com justificativa na imagem**.
- [ ] **Medir música × voz:** fundo ≈ 14–17 dB abaixo da voz; ouvir os trechos com efeito.
- [ ] SFX discretos, **um som por pagamento de plantio**; sincronizados com a imagem.
- [ ] Ouvir **só o áudio** (olhos fechados): a história se entende e emociona?

## Bloco 8 — Revisão do MP4 exportado (obrigatória) [OLHO]

- [ ] **Assistir ao MP4 exportado inteiro**, não o HTML nem quadros soltos.
- [ ] Quadros sequenciais a **cada ~0,1 s nas cenas críticas**, nas **transições** e nos **planos de detalhe**.
- [ ] **Assistir em silêncio:** o gancho, o problema e a virada se entendem só pela imagem?
- [ ] **Assistir sem olhar o vídeo** (só áudio) e depois **com legenda**, conferindo sincronia.
- [ ] **Teste com um espectador frio** (alguém que não viu o roteiro): pergunte aos 3 s "o que está acontecendo?" e aos 60% "qual será o final?".
- [ ] Conferir o MP4 **item a item** contra a lista de feedback acumulada do canal e dizer o que foi conferido.
- [ ] Formato: **MP4, 1080×1920, 30 fps**.
- [ ] **[AUTO]** `python3 docs/analise/ferramentas/qa_video.py final.mp4` sem "FALHA" (explicar cada "AVISO").

## Bloco 9 — Entrega e registro

- [ ] Relatório curto: **quais foram as melhorias** em relação ao vídeo anterior (3–6 linhas).
- [ ] Scorecard de 12 critérios preenchido (documento 03, seção 12), sem queda em nenhum item.
- [ ] Tabela de plantio/pagamento arquivada com o projeto.
- [ ] Cada nova crítica do usuário **entra na memória e neste checklist no mesmo dia**.
- [ ] Apagar os PNGs de quadros de vídeos já exportados antes de renderizar o próximo (espaço em disco).

---

## Apêndice: o que a ferramenta `qa_video.py` não faz

Ela **não** avalia: atuação, escala e continuidade, qualidade da voz, se a trilha atrapalha, se a legenda cobre rosto, lógica da história. Também usa heurísticas por diferença de quadros para contar cortes (pode contar borrões e animação rápida como "mudança visual") e para flashes (pode detectar trovões/relâmpagos legítimos). Trate-a como **alarme**, não como juiz.
