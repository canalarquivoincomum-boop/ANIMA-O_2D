# 09 — Autoavaliação crítica do piloto v1

Escrita **antes** de qualquer correção, para que as conclusões não sejam moldadas pelo que eu consigo consertar depois. O piloto v1 é `producao/piloto/piloto_A_ultima_musica_1080x1920.mp4`.

## 0. Veredito

> **O piloto v1 prova que o pipeline funciona. Não prova que a animação tem qualidade de produção.**
> Em tela, ele parece **imagens vetoriais bem organizadas com a câmera se mexendo**, e não personagens vivos num mundo com luz.

O documento 08 foi **generoso demais** em dois pontos: dizer "no patamar das referências" em legibilidade e tratar atuação/ângulos como "abaixo do alvo" sem quantificar. Abaixo, o que os números e as imagens realmente mostram.

## 1. Evidência quantitativa: fluidez

Método: renderizei o piloto com a **câmera congelada e sem legenda** e medi a diferença média entre quadros consecutivos (72×128, cinza, região acima da legenda). Isso isola o que a *animação* faz, sem o efeito dos push-ins.

| Métrica (v1) | Resultado |
|---|---|
| Quadros com movimento ≈ 0 (< 0,05) | **31%** |
| Quadros com pouquíssimo movimento (< 0,15) | **50%** |
| Quadros com movimento visível (> 0,5) | 19% |
| Planos 100% parados sem a câmera | **P3, P5, P8a** (relógio, rua, fachada) |
| Planos com ≥ 80% de quadros parados | P2 (82%) |
| Personagens que **andam** no piloto | **nenhum** |

Observação: a métrica global de diferença entre quadros (2,87) parecia **alta** e me favorecia, mas é inflada pela câmera e pela legenda. Esse é um caso em que o número "bom" era enganoso.

## 2. Autocrítica por dimensão

Gravidade: 🔴 grave (impede a qualidade pedida) · 🟠 importante · 🟡 menor.

### 2.1 Fluidez e movimento 🔴
- **Personagens são "bonecos de pose".** Entre uma pose e outra há só `ease`, sem **antecipação, exagero, overshoot, assentamento** (os 12 princípios da animação). Os braços chegam ao lugar e param.
- **Sem peso:** não há transferência de peso entre os pés, nem balanço do quadril; a respiração é um pulso de ±1,4 unidade (quase invisível).
- **Sem locomoção:** ninguém anda, sobe, senta, vira o corpo. Nada de ciclo de caminhada.
- **Movimento secundário mínimo:** só a trança (pêndulo simples). Não há atraso de cabeça/ombros, mãos sem vida própria.
- **Vida do cenário quase zero:** relógio e cortina estáticos; nada de poeira, nuvem, carro passando.

### 2.2 Emoções e atuação 🔴
- **Poucas chaves de expressão:** P4 tem 3 em 2,4 s. O alvo era uma troca a cada 0,3–0,5 s em cenas de reação.
- **Cabeça não conduz o olhar.** O olho se mexe, a cabeça fica; num humano a cabeça antecipa o olhar. Parece que olha com o rosto "de máscara".
- **Rostos simétricos e inexpressivos nos adultos:** o seu Genaro e o seu Alcides **reaproveitam o molde de cabeça** da Ísis (mesmas proporções do rosto).
- **Sem squash & stretch**, sem acento corporal numa reação (a careta do desafino é o único momento com flinch).

### 2.3 Impacto 🟠
- O **gancho** tem uma boa imagem (a mão de vidro contra a luz), mas o **impacto** é só visual: sem choque de câmera, sem congelamento, sem stinger sonoro marcado.
- **Os "pontos de impacto"** (a flauta que desafina, a voz que some) não têm tratamento de montagem: cortam como qualquer outro plano.
- **O efeito de vidro é pequeno** na tela (mão e antebraço); falta brilho/bloom que o faça "vender" a ideia.

### 2.4 Ambientação 🟠
- Cenários **limpos demais**, com poucos objetos (a rua só tem 2 prédios, bancos e um ponto de ônibus). Sensação de "clip-art".
- **Sem profundidade atmosférica** (os planos distantes não perdem contraste/ganham névoa).
- **Sem vida:** não há figurantes, trânsito, pássaros, folhas.

### 2.5 Iluminação 🔴
- A luz é: **tint chapado** + **vinheta** + **um facho no chão**. Os personagens **não interagem com a luz**: sem luz de contorno (rim), sem sombra projetada, sem brilho nos olhos além do ponto.
- Não há **contraste quente/frio** na mesma cena. A janela é "clara", mas **não irradia luz** (sem brilho/bloom).

### 2.5.1 Sombreamento 🔴
- Os personagens são **100% flat**: um único tom por parte. A única "sombra" é uma elipse sob os pés.
- Nenhuma **oclusão ambiente** nos cenários (sob móveis, junto às paredes).

### 2.6 Estilo e design geral 🔴
- **Genérico:** os personagens parecem *stock vector*. A cabeça redonda com olhos grandes é o "molde padrão" e funciona, mas **não é memorável**.
- **Contorno uniforme em azul-marinho** em tudo (pele, roupa, cabelo): lê como "adesivo", sem a riqueza de um contorno colorido.
- **Sem textura** (nenhum papel, grão de pintura, pincel).
- **Mãos fracas** (a "pinça" e a mão do Bento).
- **Cabelo e roupa sem detalhe** (a cabeça de cabelo é uma "touca" com franja; roupas lisas).
- **Não existe personagem fixo.** Cada vídeo teria de inventar a sua "cara"; falta uma âncora de identidade do canal.

### 2.7 Direção e composição 🟠
- Muitos planos **centrados e simétricos**; pouca diagonal, pouco primeiro plano, **sem elemento em primeiro plano desfocado** que crie profundidade.
- **Câmera só empurra e desliza.** Falta roll, pequeno impacto, câmera na mão em tensão.

### 2.8 Som 🟡 (placeholder)
- Voz-guia sintética e SFX sintetizados; nenhum juízo possível sobre qualidade final.

## 3. Onde o v1 está bem (para não jogar fora)

- **Ideia visual do medidor** (transparência) é forte e legível.
- **Gancho e ritmo** dentro das faixas das referências.
- **Pipeline** rápido (47 s por render completo) e **reprodutível**.
- **Legenda** correta e legível.
- **Sincronia** palavra a palavra.

## 4. Conclusões

1. **Para chegar ao nível de uma animação de verdade, o problema não é o roteiro nem o ritmo, e sim a atuação, a luz e o design.** São as dimensões em que o v1 é mais fraco e em que o espectador **sente** a qualidade.
2. **A câmera estava escondendo a falta de animação.** Qualquer v2 precisa ser medido **com câmera congelada**.
3. **Um personagem fixo é necessário** como âncora de identidade, e deve ser **barato de animar e muito expressivo** (para carregar emoção onde os humanos do elenco ainda são rígidos).
4. **Sombreamento + luz de contorno + sombra projetada + brilho** dão a maior melhora visual com o menor custo (são o que faz "vetor flat" virar "ilustração animada").
5. **A segunda passada precisa focar nos princípios da animação** (antecipação, overshoot, peso, movimento secundário, ciclo de caminhada), não em mais cenários.

## 5. Plano do v2 (ordem de prioridade)

| # | Ação | Dimensão |
|---|---|---|
| 1 | **Coco**, o personagem fixo (design + rig) | identidade/estilo |
| 2 | Animação: spring/overshoot, antecipação, peso, saccades, cabeça conduz o olhar, ciclo de caminhada, movimento secundário | fluidez/atuação |
| 3 | Sombreamento cel + luz de contorno + contorno colorido; sombra projetada; oclusão ambiente | sombreamento/iluminação |
| 4 | Brilho/bloom, grading quente/frio, feixes animados; poeira | iluminação/impacto |
| 5 | Vida no cenário: nuvens, carros, cortina, relógio, figurantes | ambientação |
| 6 | Design: cabelo volumoso, roupas com detalhe, rostos distintos por idade, textura de papel | estilo |
| 7 | Câmera: roll, impacto, primeiro plano em desfoque | direção/impacto |
| 8 | Re-direção dos 15 planos com mais ação e mais chaves de expressão | tudo |

**Critério de sucesso do v2 (mensurável):** com a câmera congelada, ≤ 8% dos quadros com movimento < 0,05 e nenhum plano 100% parado; todos os personagens com sombreamento e luz de contorno; ≥ 1 ciclo de caminhada; cada plano de reação com ≥ 4 chaves de expressão em 2 s; Coco presente em 3 planos.
