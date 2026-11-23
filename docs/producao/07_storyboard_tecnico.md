# 07 — Etapa 3: Storyboard técnico completo

52 planos, 9 cenas, ~117 s. **S1–S3 (planos P1–P13) estão IMPLEMENTADOS e renderizados** no piloto (`producao/piloto/`): as especificações dessas cenas são exatamente o que foi construído. **S4–S9 estão especificadas** para produção.

## Convenções

- **Tempo:** segundos do vídeo final, ancorados na voz-guia (`producao/audio/guia_frases.json`). Serão reajustados à gravação real.
- **Câmera:** `cx, cy` = centro no mundo da camada *near*; `z` = zoom (1,0 = quadro de 576 unidades). Camadas: far 0,42 · mid 0,78 · near 1,0 · fore 1,35. Micro-balanço sempre ativo.
- **Expressões e poses:** nomes da biblioteca do documento 05.
- **Transparência:** `fade R/L` = fração do braço (da mão ao ombro); `fade body` = corpo.
- **Som:** SFX discretos e justificados pela imagem; trilha só em cenas-chave, com ducking; nunca reaproveitar outra trilha.
- **Transição padrão:** corte seco. **whip** = 4 quadros (2+2) com borrão horizontal.
- **Legenda:** y = 775, palavra falada em dourado; rostos e objeto-chave acima.

**Elenco:** Ísis (I), seu Genaro (pai, G), vó Cota (V), Bento (B), dona Marlene (M), dona Odete (só o avental, O), seu Alcides (extra, A).

**Luz por período:** *tarde* = tint laranja 10%, facho da janela; *manhã* = tint azulado 9%; *noite/palco* = índigo + luz quente de porta; *sépia* = flashback com moldura arredondada.

---

## S1 — GANCHO (0,0–6,4 s) · IMPLEMENTADO
Função da cena: **promessa pessoal + objeto + problema visível**; abrir a pergunta "ela vai sumir antes de ele chegar?".

### P1 · 0,00–0,60 · close extremo da mão
- **Narração:** "Meu pai…"
- **Ação visual:** a mão direita da Ísis, **estendida**, segura a flauta contra a luz da janela. Os dedos são vidro (`fade R` 0,16 → 0,26): a luz atravessa. Partículas sobem.
- **Cenário/perspectiva/luz:** sala, plano frontal; janela alta (300–620); céu dourado; contraluz.
- **Enquadramento/câmera:** close extremo (z 3,0 → 3,3), centro na mão (782,540); parte do rosto à esquerda.
- **Poses/expressões:** `holdOut` (braço estendido p/ a janela), `curious`; olhar para fora (alvo 900,540).
- **Objetos/continuidade:** flauta opaca presa à mão (fora da máscara); banquinho; **mesma composição do último plano (S9)**.
- **Corte/transição/SFX:** whip aos 0,60 s; cintilar de vidro (3136 Hz) suave + partículas.
- **Emoção/função:** estranhamento; promessa visual do problema.

### P2 · 0,60–2,95 · a sala e a promessa
- **Narração:** "…prometeu chegar antes da última música."
- **Ação visual:** plano geral: Ísis no banquinho junto da janela; poster "RECITAL 20h / **ÚLTIMA MÚSICA**" (círculo vermelho desenhado **1,5–2,05 s**, antes da voz); cadeira vazia do pai; jaqueta no cabide.
- **Cenário/perspectiva/luz:** sala frontal; piso de tábuas; facho de luz da janela no chão; tint laranja.
- **Enquadramento/câmera:** abre largo (cx 450, cy 560, **z 0,84**) e empurra até o poster (cx 300, cy 420, z 1,45) em 2,35 s.
- **Poses/expressões:** `stand`, `calm`; perfil para a janela.
- **Objetos/continuidade:** poster, relógio, mesa + estojo de flauta com adesivos, **cadeira vazia**, estante de partitura.
- **Corte/transição/SFX:** pad grave (sala vazia); **motivo da caixa de música (4 notas) em 1,7 s**, justificado pelo círculo no cartaz.
- **Emoção/função:** expectativa solitária; apresenta o espaço e a "última música".

### P3 · 2,95–4,35 · o relógio
- **Narração:** "Faltavam três horas…"
- **Ação visual:** relógio de parede em 5h; o ponteiro dos minutos avança.
- **Cenário/luz:** parede creme; luz suave.
- **Câmera:** insert (cx 436, cy 292, z 2,6 → 2,85).
- **Som:** 3 tiques (alternando 1700/1400 Hz).
- **Emoção/função:** passagem de tempo; peso da espera.

### P4 · 4,35–6,80 · a mão vira vidro
- **Narração:** "…e eu já estava ficando transparente."
- **Ação visual:** Ísis olha o próprio braço **estendido contra a luz**; `fade R` 0,3 → 0,92; partículas sobem na frente do vidro.
- **Cenário/luz:** a janela é o fundo claro; o corpo permanece opaco, o vidro lê contra o céu.
- **Câmera:** cx 718 → 724, cy 590 → 580, z 1,5 → 1,8; plano médio.
- **Poses/expressões:** `relax` → `inspectOut` (0,45 s); `calm` → `curious` (0,5 s) → `worry` (1,55 s).
- **Objetos/continuidade:** laço amarelo **sempre opaco**; banquinho.
- **Som:** dois cintilares (5,30 e 5,95 s).
- **Emoção/função:** descoberta do problema; ponto de virada do gancho.

---

## S2 — A REGRA (6,8–17,1 s) · IMPLEMENTADO
Função: explicar a regra **mostrando-a** em 3 exemplos curtos (mão → braço → só o avental).

### P5 · 6,80–9,15 · a rua
- **Narração:** "Na minha rua, quem espera vai sumindo."
- **Ação visual:** rua ao entardecer; seu Alcides sentado no ponto de ônibus, sozinho.
- **Cenário/perspectiva/luz:** plano geral frontal; sol baixo; prédios ao fundo.
- **Câmera:** pan do lado da padaria até o ponto (cx 640 → 340, cy 690, z 1,25 → 1,3); **whip de entrada**.
- **Poses/expressões:** `sit`, `resigned`.
- **Som:** whoosh (6,74 s); trânsito distante.
- **Função:** apresenta o mundo e o primeiro "esperando".

### P6 · 9,15–10,80 · "uma hora, a mão"
- **Narração:** "Uma hora, a mão."
- **Ação visual:** a mão do homem, pendurada ao lado do banco, vira vidro (`fade R` 0,2 → 0,32).
- **Câmera:** cx 332 → 336, cy 700 → 706, z 2,0 → 2,15.
- **Poses/expressões:** `hang`, `resigned`.
- **Objetos/continuidade:** relógio do ponto (5h05).
- **Função:** regra em ação (nível 1).

### P7 · 10,80–12,50 · "duas, o braço"
- **Narração:** "Duas, o braço."
- **Ação visual:** mesmo plano, relógio avançou; o braço inteiro até o ombro é vidro (`fade R` 0,78 → 0,86).
- **Câmera:** z 1,95 → 1,75.
- **Som:** whoosh curto + 10 tiques rápidos (passa o tempo).
- **Função:** regra em ação (nível 2); mesma composição de P6 (comparação).

### P8a · 12,50–13,85 · a padaria
- **Narração:** "A dona Odete espera o filho há dez anos."
- **Ação visual:** fachada "PADARIA DA ODETE", toldo, porta.
- **Câmera:** cx 1060 → 1090, z 1,55 → 1,7.
- **Função:** localiza a personagem.

### P8b · 13,85–15,30 · só o avental
- **Narração:** (continuação) "…há dez anos."
- **Ação visual:** atrás do balcão **flutua um avental** (listras azuis, laços balançando); prateleiras de pão; retrato de um menino.
- **Cenário/luz:** interior quente; facho da janela.
- **Câmera:** z 1,5 → 1,9.
- **Som:** tecido balançando (14,3 s).
- **Função:** o primeiro "só ficou o avental".

### P9 · 15,30–17,45 · a flor nova
- **Narração:** "Só dá pra ver o avental."
- **Ação visual:** do lado direito entra uma **mão de manga laranja** com flor rosa; troca a flor murcha do bolso; sai.
- **Câmera:** close (cx 470 → 456, cy 560 → 566, z 2,2 → 2,45).
- **Objetos/continuidade:** **PLANTIO** (a manga laranja nº 7 é do Bento; só o espectador atento nota).
- **Som:** "plick" da flor (16,56 s).
- **Função:** pista central (pagamento em S7).

---

## S3 — A PROTAGONISTA (17,5–28,6 s) · IMPLEMENTADO
Função: apresentar a Ísis com um traço (flauta mal) + o pai e o refrão "daqui a pouquinho".

### P10 · 17,45–20,80 · toca flauta mal
- **Narração:** "Eu sou a Ísis, tenho nove anos e toco flauta mal."
- **Ação visual:** Ísis toca a flauta: **5 notas certas**; em "mal" (20,12 s) a nota desafina, ela se encolhe e depois baixa a flauta, sem graça.
- **Cenário/luz:** sala, perto do tapete e da estante.
- **Câmera:** cx 520 → 508, cy 620 → 612, z 1,62 → 1,85.
- **Poses/expressões:** `play` → `playFlinch` (20,13 s, 0,07 s) → `playLow`; `focus` → `wince` → `sheepish`; trança amortecida 24°.
- **Som:** notas (E5, G5, A5, G5, E5) + **desafino** (20,12 s).
- **Função:** humor e ternura; define o traço da heroína; **motivo musical**.

### P11 · 20,80–22,60 · o caminhão
- **Narração:** "Meu pai dirige caminhão."
- **Ação visual:** rodas e **para-lama com "ÍSIS"**; o motor vibra em marcha lenta.
- **Cenário/luz:** manhã azulada (hábito diário).
- **Câmera:** cx 560 → 520, cy 790 → 835, z 2,0 → 2,45.
- **Som:** motor grave.
- **Função/continuidade:** **PLANTIO** do para-lama (pagamento em S8).

### P12a · 22,60–24,05 · o pai na janela
- **Narração:** "Todo dia ele diz…"
- **Ação visual:** seu Genaro (boné, bigode) debruçado na janela da cabine, olhando para trás com carinho; o braço estendido para fora.
- **Câmera:** cx 262, cy 560 → 556, z 1,28 → 1,42.
- **Poses/expressões:** `pinch` estendido, `warm`.
- **Som:** motor abafado na cabine.

### P12b · 24,05–25,30 · a mão do "pouquinho"
- **Narração:** "…daqui a pouquinho."
- **Ação visual:** **close na mão em pinça** (dedos com fresta); ao fundo, a Ísis pequena no portão olhando para ele.
- **Câmera:** estática com micro-balanço; mão no alto, Ísis **abaixo da legenda**.
- **Som:** buzina amiga "pó-pó" (24,38 s).
- **Função:** **PLANTIO** do gesto (pagamento em S9).

### P13 · 25,30–29,75 · o pouquinho é longe
- **Narração:** "Na minha rua, daqui a pouquinho é um lugar muito longe."
- **Ação visual:** estrada em perspectiva até o horizonte; o caminhão diminui; a Ísis, de costas e pequena, acena.
- **Cenário/perspectiva/luz:** ponto de fuga único, postes com fios; luz fria de manhã.
- **Câmera:** pull-out z 1,35 → 1,0; **whip de entrada** (25,24 s).
- **Som:** vento; motor diminuindo; **pad longo** (5,2 s).
- **Função:** fecho da regra: o tempo vira distância.

---

## S4 — O GATILHO (29,0–36,6 s) · ESPECIFICADO

### P14 · 29,02–30,40 · "Hoje era o recital"
- **Narração:** "Hoje era o recital."
- **Ação visual:** **por cima do ombro** da Ísis, vemos a rua vazia pela janela, sem o caminhão. Ela vira a cabeça devagar para a câmera e depois para o relógio.
- **Cenário/luz:** sala, **tarde dourada**; facho da janela.
- **Câmera:** over-the-shoulder (cx 700, cy 560, z 1,6 → 1,75).
- **Poses/expressões:** `stand`, `curious` → `calm`.
- **Objetos/continuidade:** banquinho, poster ao fundo; **fita amarela** em primeiro plano nítido.
- **Som:** pad; relógio distante.
- **Emoção/função:** expectativa; o dia chegou.

### P15a · 30,61–32,20 · a escolha (insert)
- **Narração:** "Eu escolhi a última música…"
- **Ação visual:** o **programa do recital** sobre a mesa; a mão da Ísis, com as pontas dos dedos de vidro, **apaga** o nome da posição 2 e **escreve "Ísis — flauta" na última linha**.
- **Cenário/luz:** mesa de madeira; luz lateral.
- **Câmera:** insert top-down inclinado (z 2,4).
- **Objetos/continuidade:** lápis com a ponta no papel; letra de criança.
- **Som:** lápis, borracha.
- **Função:** **o herói agrava o dano** com a própria escolha.

### P15b · 32,20–33,81 · "…pra ele chegar a tempo"
- **Narração:** "…pra ele chegar a tempo de ouvir."
- **Ação visual:** rosto da Ísis; pequeno sorriso calculista, olhos fecham um segundo.
- **Câmera:** close (cx 700, cy 570, z 2,1).
- **Poses/expressões:** `warm` com rubor alto.
- **Função:** esperança ingênua (contraste com o que virá).

### P16 · 34,11–36,60 · a fita amarela
- **Narração:** "A vó prendeu a minha trança com a fita amarela."
- **Ação visual:** vó Cota (coque, óculos) ata a fita; a mão dela no ombro da Ísis; a fita **ganha um brilho dourado** sutil.
- **Cenário/luz:** sala, luz de contorno quente.
- **Câmera:** close no laço (z 2,6), depois abre para os dois (z 1,4).
- **Poses/expressões:** vó `warm`; Ísis de costas (`sit`).
- **Som:** tecido, respiração.
- **Função:** estabelece a **fita como âncora** e a vó como presença.

---

## S5 — TRÊS TENTATIVAS (37,1–63,1 s) · ESPECIFICADO
Escalada: cada tentativa piora o medidor (cotovelo → ombro → quase invisível). Ritmo: planos de 1,2–2,4 s, expressões a cada 0,4 s.

### T1 · varanda

**P17 · 37,05–38,79 — "Primeiro, fiquei na varanda."**
- **Ação:** Ísis sentada no degrau da varanda olhando a rua longa; poeira no ar.
- **Cenário/luz:** varanda de madeira, grade, tarde dourada.
- **Câmera:** plano geral baixo (z 1,1), leve push.
- **Poses:** `sit`, `worry`; olhar para a rua.
- **Som:** vento; cigarra.

**P18 · 39,04–41,43 — "A vó sentou do meu lado e segurou a minha mão."**
- **Ação:** vó senta ao lado; **mãos unidas em close**: enquanto vó segura, a cor **volta** ao pulso (`fade R` 0,5 → 0,15). A narração **não comenta** isso.
- **Câmera:** close nas mãos (z 2,6).
- **Objetos/continuidade:** **PLANTIO** (cor volta com companhia).
- **Som:** soft "swell" caloroso (1 s).

**P19 · 41,73–43,40 — "Quando ela levantou pra mexer a panela,"**
- **Ação:** vó sai de campo (de costas); ao soltar, a **cor recua** em 0,4 s.
- **Câmera:** plano médio, fixa.
- **Som:** cintilar descendente.

**P20 · 43,40–45,18 — "…eu já estava no cotovelo."**
- **Ação:** close do cotovelo glassy; Ísis olha, preocupada; o laço balança.
- **Câmera:** z 2,3.
- **Poses:** `inspectOut`, `worry`.

### T2 · ensaio sozinha

**P21 · 45,58–47,50 — "Depois, ensaiei sozinha."**
- **Ação:** Ísis ensaia diante da estante; a luz da janela muda de dourado para laranja (tempo passando).
- **Câmera:** plano médio (z 1,5).
- **Poses:** `play`, `focus`.
- **Som:** flauta hesitante.

**P22 · 47,75–49,67 — "No espelho, só a flauta tocava."**
- **Ação:** **espelho frontal**: o reflexo mostra só **a flauta e a fita** flutuando; o corpo é vidro (`fade all` 0,75).
- **Cenário/luz:** espelho de corredor; luz fria.
- **Câmera:** frontal, estática, simetria (z 1,3).
- **Objetos:** flauta e fita opacas fora da máscara.
- **Som:** notas sem respiração (só a flauta).
- **Função:** **imagem-chave** da cena; mostra "sozinha = some mais rápido".

**P23 · 49,92–51,32 — "Já estava no ombro."**
- **Ação:** close no ombro: a frente da transparência atravessa; ela para de tocar.
- **Câmera:** z 2,4.
- **Poses:** `inspectOut` → mão cai; `sad`.

### T3 · telefonemas

**P24 · 51,72–54,28 — "Liguei pro meu pai. Caixa postal."**
- **Ação:** celular: foto do caminhão **com ÍSIS no para-lama**; toca 2 vezes; "Caixa postal"; o polegar dela é vidro.
- **Câmera:** insert (z 2,8).
- **Som:** chamada, bip.

**P25 · 54,48–56,35 — "Daqui a pouquinho, ele disse."**
- **Ação:** **cutaway da cabine** do pai: de costas, boné e retrovisor com os olhos; celular tocando no painel; **a mão do pai fica fora do quadro**. **A voz do pai (gravada): "Fala, Ísis! Daqui a pouquinho eu ligo."** em volume normal.
- **Cenário/luz:** cabine; engarrafamento visto pelo para-brisa; pôr do sol e lanternas vermelhas.
- **Câmera:** atrás do ombro (z 1,3), sutil push.
- **Objetos/continuidade:** celular, volante, para-brisa, **plantio**: a mão **não aparece**.
- **Função:** primeira revelação do pai preso (o espectador só entende depois).

**P26 · 56,70–57,85 — "Liguei de novo."**
- **Ação:** Ísis na janela, celular no ouvido; o vidro já alcança o ombro.
- **Poses:** `worry`; **expressões** trocam a cada 0,4 s (esperança → dúvida).

**P27 · 58,10–59,76 — "A voz estava mais baixa."**
- **Ação:** plano geral da estrada engarrafada ao pôr do sol; o caminhão minúsculo. **A voz do pai: segunda reprise, 40% mais baixa.**
- **Câmera:** pull-out lento (z 1,5 → 1,0).
- **Função:** **PLANTIO** (voz enfraquecendo).

**P28 · 60,06–63,05 — "Na terceira, tive que encostar o telefone no ouvido."**
- **Ação:** close do rosto com o celular colado à orelha; vidro sobe pelo pescoço; olhos atentos; pausa de 0,6 s. **Terceira reprise: quase inaudível.**
- **Câmera:** close (z 2,3).
- **Poses:** `worry` → `sad`.
- **Som:** o ar da sala some; só o fio de voz.
- **Transição:** corte seco para o colégio.

---

## S6 — O PONTO MAIS BAIXO (63,6–73,6 s) · ESPECIFICADO
Ritmo: planos **longos** (2,2–3 s), sem música.

### P29 · 63,55–65,99 — "No colégio, a dona Marlene leu o programa."
- **Ação:** salão do colégio à noite; palco com cortina; fileiras de cadeiras; dona Marlene no púlpito. **A porta dos fundos se abre sozinha e só entra um laço amarelo, flutuando.**
- **Cenário/luz:** índigo + janelas quentes + luz de palco branca.
- **Câmera:** plano geral baixo, simétrico (z 1,0), push lento.
- **Objetos:** laço, flauta (opaca).
- **Som:** murmúrio de plateia.

### P30 · 66,24–68,76 — "Bento. Camila. Joaquim."
- **Ação:** **três closes rápidos** (≈ 0,8 s cada) levantando a mão: **Bento** (camisa laranja nº 7), Camila, Joaquim.
- **Poses:** `smile`, `shock`, `sheepish`.
- **Câmera:** estática; **corte seco entre os três**.
- **Função:** ritmo em rajada; apresenta o Bento.

### P31 · 69,21–71,07 — "Passou pelo meu nome sem parar."
- **Ação:** over-the-shoulder da Marlene: o dedo percorre a lista; **passa pela linha "Ísis (flauta)"** sem parar; o olhar dela atravessa o laço.
- **Câmera:** z 2,0, travada.
- **Função:** o momento de maior solidão.

### P32 · 71,42–73,60 — "De mim, só ficou a fita amarela."
- **Ação:** no corredor, **só a fita e a flauta** visíveis; hold de 2,2 s.
- **Câmera:** push muito lento (z 1,4 → 1,55).
- **Poses:** o corpo é vidro (`fade all`); nada de expressão visível, só o laço balança.
- **Som:** silêncio + um fio de som grave.
- **Função:** **ponto mais baixo**.

---

## S7 — A VIRADA (74,2–90,4 s) · ESPECIFICADO

### P33 · 74,20–76,14 — "O Bento olhou direto pra fita."
- **Ação:** close do Bento; os olhos **travam** na fita; push até os olhos.
- **Poses:** `focus` → `warm`.
- **Câmera:** z 2,0 → 2,5.
- **Som:** um acorde quente (única entrada de música desta cena).

### P34 · 76,39–79,20 — "Tô vendo você, ele disse, e sentou do meu lado."
- **Ação:** o Bento diz a frase (**boca mexe: ele fala por si**) e senta ao lado da fita. A silhueta da Ísis é vidro.
- **Câmera:** dois planos médios; corte sobre o gesto de sentar.
- **Poses:** `smile` curto.

### P35 · 79,55–81,05 — "A cor voltou no pulso."
- **Ação:** close do pulso: **partículas fluem para dentro** (inverso do efeito anterior) e a cor volta; a luz cresce.
- **Câmera:** z 2,8.
- **Som:** cintilar ascendente.
- **Função:** imagem-espelho do efeito inicial.

### P36 · 81,45–82,64 — "Aí eu entendi."
- **Ação:** Ísis vira o rosto para o Bento; **três expressões em 1,2 s**: surpresa → compreensão → alívio.
- **Poses:** `shock` → `curious` → `warm`.
- **Câmera:** close (z 2,2).

### P37 · 82,89–84,33 — "A vó, na varanda."
- **Ação:** **flashback sépia com moldura arredondada**: o mesmo enquadramento de P18; a cor volta ao pulso quando a vó segura.
- **Câmera:** idêntica à de P18 (pagamento visual).
- **Transição:** íris para a memória.

### P38 · 84,58–87,74 — "O avental da dona Odete, com uma flor nova todo dia."
- **Ação:** **flashback sépia**: o plano de P9 é refeito, agora **abrindo** para mostrar o dono da mão: o **Bento**, na camiseta laranja nº 7, com um dedo nos lábios.
- **Câmera:** pull-out sobre o mesmo enquadramento.
- **Função:** **pagamento principal** (revela quem punha a flor).

### P39 · 88,09–90,43 — "A espera só apaga quem espera sozinha."
- **Ação:** de volta ao salão; Ísis e Bento lado a lado; a cor sobe até o ombro dela; sorriso contido.
- **Câmera:** dois planos, fixa (hold 2,3 s).
- **Luz:** calor cresce.
- **Função:** formulação da regra completa; ela é **descoberta**, não lição.

---

## S8 — A AÇÃO (91,0–105,3 s) · ESPECIFICADO

### P40 · 90,98–94,04 — "Subi no palco e toquei a última música pra eles."
- **Ação:** palco com Ísis pequena; **plateia de três**: o Bento, a vó Cota (chegou) e **uma cadeira com o avental da dona Odete** (com uma flor nova). Ela toca o motivo (E–G–A–G).
- **Cenário/luz:** palco em luz quente; salão em penumbra.
- **Câmera:** POV da plateia, push lento (z 1,0 → 1,25).
- **Som:** a música **entra de verdade** (flauta ao vivo + pad).

### P41 · 94,44–95,95 — "A porta do fundo abriu."
- **Ação:** do palco, a Ísis (com a flauta na boca) vê o fundo: **a porta se abre e a luz da noite entra**; os olhos arregalam no meio da nota.
- **Câmera:** close do rosto, depois POV da porta.
- **Poses:** `shock`; flauta continua.
- **Som:** porta; música cai 6 dB.

### P42 · 96,25–97,16 — "Meu pai."
- **Ação:** **silhueta** do pai na porta, em contraluz; **pausa dramática de 0,3–0,5 s**.
- **Câmera:** fixa; plano frontal simétrico.
- **Som:** silêncio total por 0,4 s.

### P43 · 97,46–99,06 — "Transparente até o ombro."
- **Ação:** o pai entra na luz: o **braço, a mão e parte do peito são vidro** (`fade R` 1,0, `body` 0,5). O boné e o bigode continuam opacos. Ele faz o **gesto da pinça** com a fresta ainda aberta.
- **Câmera:** dolly-in suave (z 1,2 → 1,5).
- **Poses:** `pinch` / `warm` com cansaço.
- **Função:** **reviravolta**: o pai também sumiu.

### P44 · 99,41–102,03 — "A voz baixinha do telefone não era sinal ruim."
- **Ação:** **reprise do plano P25** (cabine), agora com a câmera um pouco mais baixa: **a mão do pai no volante é vidro**. A voz reprisa em baixo volume.
- **Câmera:** mesmo enquadramento de P25 (pagamento).
- **Som:** a voz do pai, baixa.

### P45 · 102,28–105,30 — "Ele também tinha esperado, sozinho, no engarrafamento."
- **Ação:** plano geral da estrada engarrafada ao pôr do sol; o caminhão **com o para-lama "ÍSIS"** parado entre centenas de carros; dentro da cabine, quase nada visível.
- **Câmera:** pull-out lento (z 1,6 → 1,0), hold 1 s.
- **Som:** pad de espera; buzinas ao fundo.
- **Função:** fecha o paralelo (os dois esperando sozinhos).

---

## S9 — O FINAL (105,9–114,0 s + 3 s) · ESPECIFICADO

### P46 · 105,85–107,43 — "Toquei olhando pra ele."
- **Ação:** Ísis toca, **olhando para o pai** (alvo fora de quadro, não para a câmera).
- **Câmera:** plano médio, push lento (z 1,5 → 1,75).
- **Poses:** `play`, `warm`.
- **Som:** o motivo completo, calor.

### P47 · 107,73–109,85 — "A cor foi descendo do ombro até a mão."
- **Ação:** o pai: a cor **desce** do ombro até a mão; partículas entram no corpo.
- **Câmera:** plano médio no pai (z 1,6), depois close na mão.
- **Som:** cintilar ascendente em 3 degraus.

### P48 · 110,30–111,81 — "O pouquinho tinha chegado."
- **Ação:** **close da mão em pinça**: a fresta entre os dedos **fecha** (7 → 0): os dedos se tocam.
- **Câmera:** mesmo enquadramento de P12b (pagamento visual).
- **Som:** um toque de caixa de música.
- **Função:** pagamento do gesto plantado em S3.

### P49 · 112,36–117,00 — "Hoje a minha mão faz sombra."
- **Ação:** **retorno ao plano de abertura** (P1): a mão dela com a flauta contra a luz da janela, agora **opaca e projetando uma sombra** no peitoril; hold depois da frase (≈ 3 s).
- **Câmera:** z 3,0, lenta; final sem fade.
- **Som:** o motivo se resolve na última nota; silêncio; sem CTA.
- **Função:** **fecho em loop** (primeiro e último plano espelhados).

---

## Resumo por cena

| Cena | Tempo | Planos | Mediana de plano (alvo) | Papel narrativo |
|---|---|---|---|---|
| S1 | 0,0–6,4 | 4 | 1,4 s | gancho |
| S2 | 6,8–17,1 | 6 | 1,65 s | regra |
| S3 | 17,5–28,6 | 5 | 1,8 s | protagonista |
| S4 | 29,0–36,6 | 4 | 1,6 s | gatilho + escolha |
| S5 | 37,1–63,1 | 12 | 1,9 s | escalada |
| S6 | 63,6–73,6 | 4 | 2,4 s | ponto mais baixo |
| S7 | 74,2–90,4 | 7 | 2,3 s | virada |
| S8 | 91,0–105,3 | 6 | 2,4 s | ação |
| S9 | 105,9–117,0 | 4 | 2,3 s | final em loop |
| **Total** | **~117 s** | **52** | **≈ 2,0 s (referências: 1,2–2,1)** | |
