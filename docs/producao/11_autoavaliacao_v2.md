# 11 — Autoavaliação do piloto v2 e conclusões

Comparação com o v1 (documento 09). Os vídeos: `producao/piloto/v1/piloto_v1_1080x1920.mp4` e `producao/piloto/piloto_v2_1080x1920.mp4`. Folha lado a lado: `producao/piloto/comparacao_v1_v2.jpg`.

## 0. Veredito honesto

> **O v2 melhorou de forma real e mensurável a fluidez, a vida do cenário, a luz e o design dos personagens, e ganhou um personagem fixo. Mas não é um salto de categoria.**
> Ele ainda é uma **animação por montagem de peças vetoriais**, com atuação melhor, mas não no nível de uma animação com animadores. Os 3 problemas mais visíveis para quem assistir: **a mão de vidro nos planos dobrados, a mão do pai em close e a imagem um pouco "enevoada" pelos filtros**.

## 1. O que mudou (v1 → v2)

| Área | v1 | v2 |
|---|---|---|
| **Fluidez** | transições `ease`; 31% dos quadros parados sem câmera | **overshoot (mola), antecipação**, peso, saccades, **ciclo de caminhada**; 7% dos quadros parados |
| **Atuação** | 2–3 chaves de expressão por plano | até **6 chaves** (P4, P10); cabeça conduz o olhar; piscada dupla; 2 expressões novas (`hope`, `realize`) |
| **Sombreamento** | flat | **cel-shading** por mascaramento + **luz de contorno**; contorno **colorido** pela cor da peça |
| **Sombra** | elipse | + **sombra projetada** de fatiador no chão (silhueta inclinada) + **oclusão ambiente** (rodapé, sob móveis) |
| **Iluminação** | tint chapado + facho | + **bloom** (janela, sol), **gradação quente/fria**, **vinheta** mais forte, **grão de papel** |
| **Ambientação** | cenários estáticos | **cortinas que balançam**, nuvens, pássaros, **carros que passam**, poeira em luz, vapor de pão, folhas ao vento, figurante andando |
| **Design** | cabelo "touca", rostos iguais | **cabelo volumoso com cachos**, cílios, sardas, **nariz e rugas** nos adultos, listras e bolinhas na roupa |
| **Câmera** | push/pan | + **roll** (inclinação), **tremor de impacto** (shake) no susto, camada de **primeiro plano** |
| **Personagem fixo** | não existia | **Coco** em 6 planos |

## 2. Dados (câmera congelada, sem legenda)

| Métrica | v1 | v2 | Meta (doc. 09) |
|---|---|---|---|
| Quadros quase parados (< 0,05) | **31%** | **7%** | ≤ 8% ✅ |
| Quadros com pouco movimento (< 0,15) | 50% | 24% | — |
| Quadros com movimento visível (> 0,5) | 19% | **45%** | — |
| Mediana de diferença por quadro | 0,147 | **0,417** | — |
| Planos 100% parados | P3, P5, P8a | **nenhum** | nenhum ✅ |
| Planos com ≥ 25% de quadros parados | P2 (82%) | P2 (25%), P13 (25%) | — |
| Personagem que anda | 0 | **2** (figurante, cliente) | ≥ 1 ✅ |
| Planos com sombreamento + luz de contorno | 0 | **todos os com personagem** | todos ✅ |
| Planos com Coco | 0 | **6** | ≥ 3 ✅ |
| QA do MP4 | 0 falhas, 1 aviso | 0 falhas, 1 aviso | — |

**Ressalva:** a métrica de diferença entre quadros mede **quantidade** de movimento, não **qualidade**. Parte do aumento vem de coisas boas (animação real) e parte de elementos que se mexem no fundo (carros, nuvens). Ela indica que **não há mais "slideshow"**, não que a animação seja boa.

**Critérios do documento 09 atingidos:** 4 de 5 (≤ 8% quadros parados; nenhum plano 100% parado; walk cycle; shading em todos; Coco em 3+). **Parcialmente:** "cada plano de reação com ≥ 4 chaves em 2 s" (P4 e P10 sim; P6 e P7 ainda com 3).

## 3. Avaliação crítica por dimensão (nota 0–10, **minha**)

| Dimensão | v1 | v2 | Comentário |
|---|---|---|---|
| Fluidez | 3 | **5** | Desapareceu o "slideshow", mas as poses ainda são interpoladas, sem acting de corpo inteiro; ninguém anda *com personalidade* |
| Construção geral | 5 | **6** | Boa lógica de planos; ainda falta variedade de ângulo |
| Emoções | 4 | **5,5** | P4 e P10 comunicam; P6/P7 (o homem do ponto) ainda leem "cansado" em vez de "perdendo-se" |
| Impacto | 4 | **5,5** | Tremor e roll no susto ajudam; o gancho ainda não "soca" |
| Movimentação | 3 | **5** | Peso, mola e saccades; faltam gestos largos |
| Ambientação | 4 | **6,5** | Maior ganho: vida no cenário; ainda há cenários vazios (P8b, P12b) |
| Iluminação | 3 | **6** | Bloom e AO funcionam; a gradação **exagerada** deixa a imagem enevoada em alguns planos |
| Sombreamento | 2 | **5,5** | Cel-shading legível; as sombras projetadas ficaram discretas demais |
| Estilo e design | 4 | **6** | Cabelo, cílios, rugas e Coco ajudaram; mãos em close ainda frágeis |
| Personagem fixo | 0 | **6** | Coco é reconhecível e expressivo em repouso; falta usá-lo num final e dar-lhe som |
| **Média** | **3,6** | **5,7** | Meta de produção final: ≥ 8. **Ainda falta cerca de 2,3 pontos.** |

## 4. Falhas concretas que continuam (por prioridade)

1. 🔴 **Vidro em braço dobrado (P4, P6, P7)** continua um rabisco; o rig de máscara não resolve cotovelos. **Solução:** redesenhar o efeito como **sprite de vidro dedicado** (braço reto com gradiente e refração) em vez de máscara geral.
2. 🔴 **Mão do pai em close (P12b)** parece uma pinça/garra. **Solução:** rig de mão com 5 dedos articulados.
3. 🟠 **Imagem enevoada:** gradação + vinheta + grão + haze somados reduzem contraste. **Solução:** reduzir cada camada em 30–40% e conferir com histograma.
4. 🟠 **Planos P2 e P13** ainda têm 25% de quadros parados.
5. 🟠 **Coco em deslocamento** não foi animado de fato.
6. 🟡 **Sombras projetadas** discretas; **cenários P8b e P12b** vazios.
7. 🟡 **Som do Coco** inexistente; fonte Inter; voz e SFX sintéticos.

## 5. Conclusões

1. **O maior ganho por esforço veio de iluminação, vida ambiente e overshoot**, não de redesenhar personagens. Isso orienta o investimento: continuar nessas três frentes.
2. **A métrica com câmera congelada foi decisiva** para não me enganar: o v1 parecia dinâmico só por causa da câmera.
3. **O personagem fixo precisa de regra de uso** (documento 10), senão vira enfeite. As 3 regras (testemunha, ponte, assinatura) fecham isso.
4. **Para chegar ao nível das referências com identidade própria, o próximo salto é de acting**, não de cenário: gestos de corpo inteiro, antecipação em cada ação do herói, 6+ expressões por reação, e mãos melhores.
5. **Um piloto não equivale ao filme.** A consistência dos 52 planos ainda é risco.

## 6. Plano do v3 (antes de produzir o vídeo completo)

| # | Ação | Impacto esperado |
|---|---|---|
| 1 | Sprite de vidro para braço (reto e dobrado) | corrige a imagem-assinatura |
| 2 | Rig de mão com dedos (grip/aponta/pinça/aberta) | acabamento em close |
| 3 | Reduzir gradação (−35%) e calibrar contraste | nitidez |
| 4 | Acting: 6+ chaves por reação, gestos largos, caminhada com personalidade | fluidez e emoção |
| 5 | Coco rastejando + som próprio + gesto `touched` no final | identidade |
| 6 | Construir elenco e cenários de S4–S9 (Bento, vó, Marlene, varanda, espelho, palco) | filme completo |
| 7 | Narração real, trilha própria, Poppins | acabamento |

**Pergunta para você:** posso seguir esse plano? Se preferir, a ordem pode mudar: por exemplo, começar por **acting + mão** (itens 2 e 4) antes de construir os cenários novos.
