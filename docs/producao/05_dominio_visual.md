# 05 — Etapa 1: Domínio visual (regras técnicas consolidadas)

Este documento fixa o **padrão técnico** do Escuta Só para personagens, expressões, movimento, cenários, luz, câmera, cortes, ritmo e atuação.

**Fontes das regras:**
- **[REF]** — observado nas 14 referências (documentos `docs/analise/01a`, `01b` e `02`).
- **[CANAL]** — regra já existente na skill do canal Escuta Só.
- **[MOTOR]** — valor efetivamente implementado e **testado** no motor `producao/engine/` (os números abaixo são os do código).
- **[HIP]** — hipótese de ofício, ainda não validada com retenção.

Não há nada aqui copiado de elemento criativo exclusivo das referências (personagens, roteiros, cenários). Só se preservam **princípios técnicos**.

---

## 1. Decisão: o que preservar e o que aprimorar

### 1.1 Preservar (princípios que funcionam e são do gênero/ofício)
| Princípio | Fonte | Por que fica |
|---|---|---|
| Quadro vertical 9:16, 30 fps, 1080×1920 | CANAL/REF | Padrão da plataforma. |
| Cabeça grande, olhos grandes com pupila pequena e brilho, contorno grosso azul-marinho, paleta pastel | CANAL/REF | Legibilidade em tela pequena; é o traço do canal. |
| **Medidor visível** (um objeto/efeito que mostra a regra do mundo) | REF | Clareza sem narração. No piloto: a **transparência** do corpo. |
| Close extremo no 1º segundo + abertura para o plano geral a ~0,6 s | REF | Gancho legível; presente em ≥ 7 de 14. |
| Legenda 2–4 palavras, palavra falada em dourado, y ≈ 775/1024 | CANAL/REF | Padrão de legibilidade. |
| Cor com função (casa = quente; noite = índigo; memória = sépia com moldura arredondada) | CANAL/REF | Orienta a emoção sem texto. |
| Regra dos 3 planos + paralaxe por camadas | CANAL | Profundidade com custo baixo. |
| Plantar e pagar, refrão que muda de sentido, clímax em ação física | REF | Núcleo emocional (documento 02). |
| Voz principal; cortar silêncios > 140 ms; trilha nova com ducking | CANAL | Clareza e identidade. |

### 1.2 Aprimorar (onde as referências e o motor podem melhorar)
| Ponto fraco observado | Evidência | Aprimoramento adotado |
|---|---|---|
| Personagens frontais, "bonecos de papel" | REF (documento 02, item 7) | Poses 3/4, costas, perfil; **olhar com alvo**; respiração, piscada e balanço sempre ativos; sombra de contato. |
| Exposição longa antes do personagem | REF | Gancho "promessa + objeto + problema visível" nos 3 primeiros segundos. |
| Moral dita; CTA; selo de IA | REF | Final em **imagem**; nenhum CTA; sem selo. |
| Zoom "padrão" em todos os planos | REF [HIP] | Câmera com função (aproximar na tensão, afastar na revelação). |
| Medidor como **ícone flutuante** (HUD) | REF | Medidor **integrado ao corpo/cenário** (vidro, partículas), que é atuação. |
| Fala rápida (209–225 palavras/min) | REF | 159–170 palavras/min [HIP] para dar espaço à emoção. |

---

## 2. Personagens: proporções e construção

### 2.1 Escala e proporção [MOTOR]
Coordenadas locais do personagem com os pés em (0,0); o quadro tem 576 unidades de largura (render em 1080 = × 1,875).

| Elemento | Valor | Observação |
|---|---|---|
| Altura total (criança, escala 1,0) | ≈ 273 unidades | Cabeça ocupa ≈ 41% (**cabeçudo**). |
| Cabeça | largura 124 × altura 112 (elipse suavizada com mandíbula) | Orelhas r ≈ 11. |
| Tronco | "feijão": vestido de ombros 72 a barra 120; casaco de adulto 100 de largura | Respira ±1,2% em y. |
| Pernas | ≈ 66 de altura, largura 23 → 19, **sempre inteiras**, sapato elíptico 44×22 | Zoom nunca corta o corpo na cintura. |
| Braços | 2 ossos (34 + 32 para criança; 38 + 36 para adulto), largura 19–21, **IK de 2 ossos** | Mão no máx. ao alcance do braço; "nunca cano reto". |
| Mão | mitten 14×13 com polegar; variações `grip`, `fist`, `pinch` | Detalhe que mais precisa de atenção em close. |
| Escala por idade | criança 1,0 · adulto 1,25–1,3 | Alinhado ao canal (adulto ≈ 1,12 / criança ≈ 0,85 ≈ 1,32×). |
| Contorno | **3,8 unidades** (≈ 7,1 px a 1080) | Regra do canal. |
| Cores | pele, cabelo, roupa, sapato e acessório **por personagem** | **Nunca** só trocar a cor: silhueta própria (trança+fita; boné+bigode; careca+bigode branco; coque+óculos). |

### 2.2 Anatomia do rosto [MOTOR]
| Parte | Especificação |
|---|---|
| Esclera | elipse 33×39, branca, contorno 2,6 |
| Pupila/íris | disco escuro r ≈ 8,6 (varia com `pup`: choque = 0,62); **brilho** r 2,9 no alto à direita + brilho menor embaixo |
| Pálpebra superior | `lid` 0–0,97 (cobre de cima p/ baixo, com linha de contorno); piscada automática a cada ~3,7 s (0,14 s) |
| Pálpebra inferior | `lidB` 0–0,8 (sorriso/careta) |
| Olho fechado feliz | `arc` = 1 → arco "^ ^" |
| Sobrancelha | traço de 6,8, ângulo (`browA`) e altura (`browY`); assimetria opcional (`brow2`) |
| Bochecha | elipses rosadas, `blush` 0–1 |
| Nariz | curva simples; vinca ao franzir (`nose`) |
| Boca | fechada com curva (`mc`), aberta com dentes (`mo`) ou "o" (`mround`) |
| Giro da cabeça | `turn` −1…1 desloca traços e achata o olho distante; perfil = ±1 |

**Regra:** a boca **não mexe durante a narração**. Só se mexe quando o personagem fala por si (o Bento, uma única frase curta).

### 2.3 Elenco do projeto
**Já implementados no motor:** Ísis, seu Genaro, seu Alcides e o avental da dona Odete. **Ainda por construir:** Bento, vó Cota e dona Marlene (especificados abaixo para manter a identidade).
| Personagem | Silhueta/traços próprios | Escala |
|---|---|---|
| Ísis (9 anos) | cabelo escuro com franja, **trança lateral com laço amarelo**, vestido verde-água, tênis claro | 1,0 |
| Seu Genaro (pai) | **boné vermelho**, bigode grisalho, jaqueta mostarda, calça azul-marinho | 1,3 |
| Seu Alcides (extra, ponto de ônibus) | careca com brilho, bigode branco, casaco verde-acinzentado | 1,25 |
| Dona Odete | **só o avental flutuante** (listras azuis, bolso com flor) | 1,2 |
| Bento (10 anos) | camisa de time laranja nº 7, cabelo crespo curto | 1,05 |
| Vó Cota | coque, óculos, cardigã | 1,15 |
| Dona Marlene | prancheta, óculos, cardigã bordô | 1,2 |

---

## 3. Expressões

### 3.1 Biblioteca [MOTOR]
| Nome | Quando usar | Chaves principais |
|---|---|---|
| `neutral`, `calm` | base; espera | boca em curva leve |
| `curious` | descobre algo | sobrancelha alta e inclinada, boca pequena |
| `worry` | preocupação | sobrancelhas em "V" invertido, boca para baixo, pupila menor |
| `wince` | dor/vergonha súbita | olhos apertados, franzir de nariz, boca esticada com dentes |
| `sheepish` | sem graça | sorriso torto, rubor alto |
| `smile`, `happy` | alegria (`happy` = olhos "^ ^") | `lidB`, `blush` |
| `shock` | choque | pupila 0,62, boca em "o" |
| `sad` | tristeza | sobrancelha 16°, pálpebra caída, boca invertida |
| `resigned` | cansaço sereno | pálpebra a 38%, sobrancelha baixa |
| `warm` | ternura | meia pálpebra, sorriso largo |
| `focus` | concentração | pálpebra 20%, sobrancelha reta |

### 3.2 Regras de atuação [CANAL + MOTOR]
1. **Nunca** o mesmo rosto sorrindo para a câmera. Olhar com **alvo** (objeto, outro personagem). Câmera só no gancho e no final, se fizer sentido.
2. Em cena triste, **ninguém sorri de boca aberta**.
3. Cada reação é uma **sequência**: olhar → cabeça → gesto → peso. A expressão se constrói em **0,5–1 s**; em cenas de reação, uma troca a cada **0,3–0,5 s**.
4. Transições entre expressões de **0,06 s** (choque/careta) a **0,45 s** (lenta/ternura).
5. O ouvinte reage enquanto o outro fala.
6. Corpo conta: encolher (flinch), abraçar o próprio corpo, inclinar para o outro, peso nos pés.
7. **Nada de ícones, corações ou brilhos no lugar da atuação.** O único "ícone" permitido é o medidor (aqui, o vidro).

---

## 4. Movimento [MOTOR]

| Camada de movimento | Especificação |
|---|---|
| **Respiração** | ciclo de 3,3 s; ±1,4 unidade no corpo, ±1,2% em y no tronco (sempre ativa) |
| **Piscada automática** | a cada ~3,7 s com fase por personagem, 0,14 s |
| **Balanço de cabeça** | ±0,6° (senoide) + 2° por giro |
| **Trança/laço** | pêndulo (graus) + atraso ao movimento; reação a susto: 24° amortecido (`exp(−3,2 t)·cos(18 t)`) |
| **Poses** | mistura entre poses nomeadas em **0,2–0,45 s** (`ease`); IK nos braços e pernas |
| **Olhar com alvo** | vetor mundo→local; pupila se move até ±6,2 (x) / ±7,5 (y) |
| **Câmera** | micro-balanço (ruído ±1,2 px, zoom ±0,3%) para **nunca** parecer rígida |
| **Cena parada** | nunca congelada: respiração + piscada + balanço bastam (QA: "sem trechos congelados > 2,5 s") |

---

## 5. Cenários

### 5.1 Regra dos 3 planos e paralaxe [CANAL + MOTOR]
Camadas com fator de câmera: **far 0,42 · mid 0,78 · near 1,0 · fore 1,35**; tela = `centro + (X − cx·f)·(1 + (z−1)·f)`. Os atores ficam na camada *near*.
- **Fundo longe:** céu/prédios/janela vista de fora.
- **Plano médio:** mesa, banco, estante, poste.
- **Frente:** personagem/objeto sobre **linha de chão** visível.
- Parede nunca vazia (poster, relógio, cabide); **céu azul de dia** (laranja só no entardecer com função).
- Tudo que encosta no personagem (banco, banquinho, mesa) fica na **mesma camada** dele.

### 5.2 Perspectiva
- Interiores: frontais, piso com tábuas (leve convergência), plano de chão a y ≈ 700.
- Exteriores: **ponto de fuga único** na estrada (horizonte y = 470; meia-largura da pista `12 + (y−470)·0,915`); casas e postes diminuindo em potência ~1,7–1,9.
- Personagem pequeno em espaço enorme para dar escala (estrada, palco).

### 5.3 Continuidade [CANAL]
- Cada set reaparece 2–4 vezes em distâncias diferentes.
- Objetos sempre na **mesma posição** entre cortes (poster, relógio, mesa, cadeira vazia, estante de partitura).
- Texto de cena (cartaz, bilhete) aparece **um pouco antes** da fala (círculo vermelho desenhado a 1,5 s para a voz em 1,7 s).

---

## 6. Iluminação e cor

| Situação | Tratamento [MOTOR] | Função emocional |
|---|---|---|
| Fim de tarde (a espera) | tint laranja 10–11%, **facho de luz** da janela (gradiente) sob os atores, vinheta | calor com ansiedade |
| Manhã (hábito do pai) | tint azulado 9%, céu azul→rosa | frieza/rotina (distância) |
| Noite / medo | índigo + janelas amarelas | vigília |
| Memória | **sépia dentro de moldura arredondada** (ffmpeg `colorchannelmixer` + máscara) | passado |
| Tristeza | dessaturar (`eq=saturation=0.35`) por trecho | frieza |
| Esperança | quente/dourado, luz crescendo | alívio |

Camadas de luz, de baixo para cima: cenário → **facho de luz** → atores → tint → vinheta radial (alfa 0 → 0,34) → legenda.

**Lição aprendida:** o facho desenhado **sobre** os atores desbotava a cor. Ele agora fica **atrás** deles.

**Sombra de contato:** elipse r 46×9 a 20% sob cada personagem (nada flutua).
**Grão:** `noise=alls=4:allf=t` no ffmpeg (leve; a skill pede PNG de grão, equivalente).

---

## 7. Câmera, cortes e ritmo

### 7.1 Movimentos de câmera [MOTOR]
| Movimento | Uso | Valores usados |
|---|---|---|
| Push-in lento | tensão/atenção | z +10 a +25% ao longo do plano (ex.: 1,5 → 1,85) |
| Pull-out | revelação | z 1,35 → 1,0 (estrada) |
| Pan | leitura de espaço | 250–300 unidades em 2,3 s |
| Close extremo | gancho/detalhe | z 3,0–3,4 (limite: sem estourar o contorno) |
| Fixa com respiração | peso emocional | ± micro-balanço |
| Whip | troca de cena | **4 quadros**: 2 de saída (desliza 340 unidades) + 2 de entrada, com `gblur` horizontal no ffmpeg |

**Limite:** as referências usam salto de escala no corte (punch-in) em alguns planos; o motor **não** usa zoom contínuo como padrão, só quando há função [HIP].

### 7.2 Ritmo [REF + CANAL]
- Planos de **0,5–2,3 s** (mediana alvo ≈ 1,2–1,7 s); **holds de 2–5 s** no peso emocional.
- Mudança visual a cada ~1–1,3 s (corte, movimento, expressão, objeto).
- Primeira troca com borrão aos ~0,6 s (gancho).
- Cenas de espera: mais lentas; tensão: rajadas curtas; clímax: parar.

### 7.3 Legenda [CANAL]
Inter ExtraBold 44 (no lugar de Poppins, que não existe no ambiente), contorno escuro 9, 2–4 palavras, **largura máxima 500** (medida com `measureText`), palavra ativa em `#FFC93C`, y = 775. Rostos e objeto-chave **acima** da legenda.

---

## 8. Interpretação (o que o corpo conta)

| Emoção | Como o motor a produz |
|---|---|
| Espera | olhar fixo para fora (alvo na janela), peso nos pés, respiração lenta |
| Preocupação | `worry`, cabeça levemente baixa, mão que se observa |
| Vergonha/desafino | `wince` + **flinch** (lean −5°, cabeça −9°, trança 24°) por 0,4 s → `sheepish` |
| Resignação | `resigned`, ombros caídos, olhar para baixo |
| Ternura | `warm`, cabeça levemente inclinada, mão no ombro do outro |
| Alívio | `happy`/`smile`, cor voltando (efeito) |

**O efeito-assinatura (transparência):** é atuação, não ícone.
1. **Máscara de luminância** no grupo do personagem (cinza 19% ≈ "fantasma"), com polilinhas que cobrem do **fim do membro até um ponto de frente** (`fade.R/L` = fração do braço) e um gradiente radial para o corpo (`fade.body`).
2. **Borda de vidro** (fora da máscara): contorno branco do braço e da **mão com a forma real**, preenchimento azulado 30%, recortado à zona transparente.
3. **Partículas** em losango que sobem na frente da transparência (6 por membro).
4. **Exceções opacas:** a **fita amarela** e os **objetos seguros** (flauta) são desenhados fora da máscara. A fita é o "ponto de ancoragem" visual e a pista do herói.

---

## 9. Checklist técnico de domínio (resumo executável)

- [ ] Pernas inteiras, mãos presas ao corpo, objetos na mão real; sombra de contato.
- [ ] Olhar com alvo; nenhuma troca de expressão com mais de 0,5 s de intervalo em cena de reação.
- [ ] Respiração/piscada ativas em todo plano.
- [ ] 3 planos, linha de chão, parede nunca vazia, objetos na mesma posição entre cortes.
- [ ] Facho de luz atrás dos atores; vinheta; tint do período do dia.
- [ ] Legenda ≤ 500 de largura, y 775, rosto acima.
- [ ] Gancho: close no 1º segundo, whip aos ~0,6 s.
- [ ] Clímax e final sem moral, sem CTA.

---

## 10. Limites do motor atual (backlog técnico honesto)

| Limite | Efeito | Plano |
|---|---|---|
| Rostos quase frontais; `turn` limitado a ±0,8 | pouca variedade de ângulo | Adicionar poses de perfil e costas completas (pernas, mãos). |
| Mão em close ainda estilizada (a "pinça") | menos refinada que o resto | Segunda passada de desenho da mão em `pinch`/`grip`. |
| Contorno de vidro irregular em cotovelos fechados | leitura menos limpa em poses dobradas | Preferir **braços estendidos** em cenas de transparência. |
| Expressão com 2–3 chaves por plano | abaixo do alvo de 0,3–0,5 s em reação | Mais chaves de expressão nas cenas de reação (S5, S7). |
| Fundos quase estáticos (só facho e partículas leves) | pouca vida ambiente | Adicionar elementos animados leves (cortina, poeira). |
| Tipografia: Inter, não Poppins | pequena diferença de identidade | Instalar Poppins localmente. |
| Voz-guia sintética; som sintetizado | só serve para travar tempos | Narração real e trilha própria. |
