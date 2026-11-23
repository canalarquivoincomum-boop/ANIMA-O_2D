# 12 — Reinício (v3): diagnóstico das suas críticas, bíblia de escala e a história "Pedido Fantasma"

## 1. Suas críticas, uma a uma, com a causa real

| Crítica | Causa (confirmada no código) | O que mudou no v3 |
|---|---|---|
| Pessoas gigantes e outras pequenas; carros em miniatura | Eu dimensionava cada objeto **no olho**, plano a plano. No v2 o carro tinha 71 u de altura contra 341 u do adulto: **4,8× menor que o real**. O pai na cabine tinha 603 u numa janela de 420 u. | **Bíblia de escala** (seção 2): tudo em metros, posto por profundidade. Moto, carro, poste, prédio, porta e pessoas saem da mesma tabela. |
| Perspectivas erradas | Cada cenário tinha sua própria geometria; nenhuma regra comum de chão e horizonte. | Chão e horizonte únicos; escala = (y − horizonte)/(900 − horizonte); camadas de paralaxe alinhadas por fórmula. |
| Narrador fala o que não acontece | O texto foi escrito antes das imagens ("a mão sumindo" mal aparecia; "a dona Odete espera o filho" não mostrava filho). | **Cada plano nasce de uma frase** (`PH[id]`) e mostra literalmente o que ela diz. Verificação frase × imagem em `producao/v3/narracao_x_imagem.jpg`. Achei 1 erro meu nessa verificação ("abri o histórico" antes da tela) e corrigi. |
| Premissa sem clareza e sentido; protagonista sem sentido | "Quem espera fica transparente" era abstrata e a Ísis não tinha objetivo concreto. | Premissa de uma linha, **com prazo e perda concretos**: um pedido de entrega para uma casa demolida há 30 anos, 11 minutos para entregar, a semana de ganho em jogo, aluguel vencendo. O protagonista **quer** algo. |
| Início fraco | Abria com a mão de vidro e uma frase sobre promessa; o problema só ficava claro aos 6 s. | Gancho com **hora, endereço e impossibilidade** nos primeiros 9 s: 23:47 → pedido → "a casa 14 foi demolida". |
| Cenas lentas e estáticas | Planos de 2–4 s com personagem quase parado. | Mediana de plano 1,65 s; 7 cortes nos primeiros 10 s; relógio do app corre; moto, postes, vento, tremor de câmera; **3% dos quadros parados** (câmera congelada), contra 7% no v2 e 31% no v1. |
| Muito infantil | Criança de 9 anos, cabeção, cores doces, tom de fábula. | Protagonista de 19 anos (motoboy), cena noturna com luz de poste, celular, dinheiro e aluguel. O traço do canal fica; o tom muda. |

## 2. Bíblia de escala e perspectiva (código: `producao/engine/world.js`)

**1 metro = 210 unidades** na profundidade de referência (chão em y = 900). Todo objeto é desenhado nessa unidade e **posto** por `escala = (y − HY)/(900 − HY)`.

| Objeto | Altura real | Unidades (ref.) |
|---|---|---|
| Adulto (Nando) | 1,75 m | 367 (`charScale(1,75)` = 1,35 no rig) |
| Idosa (dona Cida) | 1,58 m | 332 |
| Carro | 1,5 m × 4,2 m | 315 × 882 |
| Moto de entrega | 1,05 m × 2,0 m | 220 × 420 |
| Poste público | 5,5 m | 1155 |
| Andar de prédio | 3,0 m | 630 |
| Mesa / cadeira | 0,75 m / 0,45 m | 158 / 95 |
| Porta | 2,1 m | 441 |

Teste de aceitação (`scaletest.html`): adulto, idosa, criança, carro e moto na mesma calçada. O carro chega ao ombro do adulto, a idosa é menor e a criança menor ainda.

**Limites:** o rig é cabeçudo por estilo (cabeça ≈ 41% da altura), então "1,75 m" é a altura total, não as proporções do corpo. A rua é vista **de lado** (paralaxe), não com ponto de fuga; só a estrada do v2 usava ponto de fuga.

## 3. A história: "Pedido Fantasma" (~110 s, original)

**Premissa em uma linha:** Nando, motoboy, recebe um pedido para uma casa que foi demolida há 30 anos, e a entrega vale a semana dele.

**Protagonista:** Nando, 19 anos, motoboy noturno; precisa pagar o aluguel na sexta. Quer **não perder a semana**.

**Roteiro (pilot = S1–S4, em negrito; o resto está só escrito):**
- **S1 Gancho.** "Onze e quarenta e sete da noite. Chegou um pedido. Rua das Acácias, número catorze. Só que a casa catorze foi demolida há trinta anos."
- **S2 Aposta.** "O aplicativo deu onze minutos. Cancelar custava a minha semana inteira. E o aluguel vencia na sexta."
- **S3 Caminho.** "Eu fui. No caminho, abri o histórico daquele endereço. Onze pedidos, todos cancelados. Mesmo endereço, mesmo dia, uma vez por ano. E hoje era doze de outubro."
- **S4 Chegada.** "Cheguei com sete minutos de sobra. Era só mato alto e um portão sem casa. E lá no fundo, uma luz acesa."
- S5 Encontro. Uma mesa posta para dois, uma senhora de bolsa no colo. "Dona Cida. Você demorou. Faltam quatro minutos." "Aqui não tem casa." "Tem pra mim." A pizza, "sem cebola, ele não gostava". Ela serve o segundo prato. A cadeira vazia, o vento, a vela que balança: **o espectador acha que é fantasma**.
- S6 Dúvida. Nando vê um capacete antigo na cadeira vazia, com adesivo "Pizzaria do Zé, 1989". Ela: "O Zé saiu para entregar uma pizza numa noite de outubro e não voltou. Todo ano eu peço a mesma, para o mesmo endereço, para ver se alguém chega." "Onze motoboys cancelaram." (Reaproveita as pistas: o histórico e o "sem cebola".)
- S7 Escolha. O relógio chega a 01:00. Nando pode fechar a entrega e ganhar, ou ficar. **Ele deixa o tempo acabar.** Cancela? Não: o aplicativo cobra o atraso. Ele senta e come com ela. "Ninguém nunca chega" → "Eu cheguei."
- S8 Perda. Ele perde a semana. Mensagem da mãe/colega no celular: o aluguel. Silêncio.
- S9 Virada (inesperada e feliz). **Um ano depois**, 23:47: faróis acendem o terreno, **dez motoboys** (do grupo que ele avisou) chegam, cada um com uma pizza. Último plano: ela, na luz dos faróis; o capacete do Zé na cadeira, e Nando coloca o dele ao lado.
- **Pistas e pagamentos:** "sem cebola" (S1 no card do pedido → S5) · histórico de 11 cancelamentos (S3 → S6) · mesa posta para dois (S4 → S5) · cadeira vazia/capacete (S5 → S6) · hora 23:47 (S1 → S9) · "ninguém chega" (S6 → S7) · a semana perdida (S2 → S8).
- Sem moral falada e sem CTA.

## 4. Resultado do piloto v3 (S1–S4, 36,4 s, 1080×1920)

Arquivo: `producao/v3/piloto_v3_pedido_fantasma_1080x1920.mp4`.

| Métrica | v1 | v2 | v3 |
|---|---|---|---|
| Quadros parados (câmera congelada, < 0,05) | 31% | 7% | **3%** |
| Quadros com movimento visível (> 0,5) | 19% | 45% | **53%** |
| Mediana de plano | 1,7 s | 1,67 s | **1,65 s** |
| Cortes em 0–10 s | 5 | 5 | **7** |
| QA do MP4 | 0 falhas, 1 aviso | 0 falhas, 1 aviso | **0 falhas, 0 avisos** |
| Escala por regra única | não | não | **sim** |
| Frase × imagem verificada | não | não | **sim** (14 frases; 1 erro achado e corrigido) |

## 5. Autocrítica do v3 (o que ainda está fraco)

1. 🔴 **Muito tempo em tela de celular** (≈ 14 s dos 36). É literal e claro, mas é inserto de UI, e o espectador pode achar "app em vez de animação". Preciso intercalar mais atuação do Nando.
2. 🔴 **Nando em pose de moto:** braços e tronco ainda têm forma estranha (o braço lembra um "cotovelo para trás") e a cabeça vira de 3/4 com olhos assimétricos. É o ponto de acabamento mais fraco.
3. 🟠 **O terreno ainda é pouco convincente:** mato em tufos melhorou, mas faltam os restos da casa (laje, degraus, porta solta), que ficaram escondidos atrás dos prédios.
4. 🟠 **Dona Cida** só aparece como silhueta pequena no último plano; falta atuação dela.
5. 🟠 **Fixo vs. narrador:** o **Coco não está neste piloto**. Eu havia interpretado "personagem fixo" como mascote observador. Pelas suas críticas ("protagonista sem sentido"), talvez você queira outra coisa (ver pergunta).
6. 🟡 Voz e sons sintéticos; fonte Inter.
7. 🟡 Só 36 s dos ~110 s foram animados. A consistência do filme inteiro não foi testada.

## 6. Pergunta que preciso que você responda
**O que você entende por "personagem fixo para contar as histórias"?**
(a) um **narrador visível** que aparece em todo vídeo (por exemplo, o Nando, ou outro apresentador); (b) um **mascote** que só reage (o Coco); (c) o **mesmo protagonista** em histórias diferentes.
