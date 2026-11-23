# 10 — Coco, o personagem fixo do canal

**Pedido:** um personagem fixo para contar as histórias.
**Implementação:** `producao/engine/coco.js` (rig) e `producao/engine/cocotest.html` (folha de expressões).

## 1. Conceito

**Coco é um caracol que escuta.** A concha em espiral funciona como uma orelha enorme: é o símbolo do canal (**Escuta Só**). Ele aparece em toda história como **testemunha**, e a emoção do espectador se ancora nele.

| Pergunta de design | Decisão | Por quê |
|---|---|---|
| Humano ou não-humano? | **Não-humano (caracol)** | O elenco das histórias é humano e varia. Um personagem de outra espécie é reconhecível em 1 frame, não se confunde com ninguém do elenco e tem custo de animação baixo. |
| Como expressa emoção? | Pela **postura das hastes oculares** + pálpebra + boca | Hastes sobem (curiosidade), caem (tristeza), se esticam (susto), uma se dobra para a concha (escuta). É um vocabulário próprio, legível a distância, que **não depende de ter rosto humano**. |
| Fala? | **Nunca** | Quem narra é você. Ele reage. Isso preserva a regra "personagem não mexe a boca durante a narração" e dá a ele um papel: ser a **audiência dentro da cena**. |
| Interage com a história? | Observa e reage; **não resolve** o conflito | O herói da história continua sendo o herói. Coco é o "espelho" do espectador. |
| Identidade visual | Concha laranja-queimado com espiral creme, corpo areia, **cachecol azul** que balança | 3 cores distintas e uma silhueta (concha + hastes) inconfundível, mesmo pequena no quadro. |

## 2. Três modos de uso (para a série ter regra)

1. **Testemunha** (padrão): aparece em 3–5 planos, pequeno, num canto do cenário, reagindo ao que o herói sente. No piloto: P1, P2, P4, P8b, P10, P13.
2. **Ponte emocional**: em 1 plano de cada vídeo, em primeiro plano grande, vive a emoção do momento (no piloto: P13, cabisbaixo na estrada quando "o pouquinho é longe").
3. **Assinatura**: no último plano de **todo** vídeo, Coco olha para a câmera, ou para o herói, e faz o gesto **"escutar"**: uma haste se dobra para a concha e ondas sonoras entram nela. É o fecho do canal (sem CTA).

**Regra de ouro:** Coco **nunca rouba a cena do herói**. Escala ≤ 0,55 nos planos de atuação do herói; só cresce em primeiro plano quando o herói não está em atuação principal.

## 3. Vocabulário de expressões (implementado)

| Nome | Hastes | Pálpebra / boca | Uso |
|---|---|---|---|
| `neutral` | levemente à frente | 10% / sorriso suave | repouso |
| `curious` | altas, inclinadas à frente | aberta / reta | descobre algo |
| `worried` | **recuadas e baixas** | 35% / curva para baixo | preocupação |
| `happy` | altas, olhos em "^ ^" | arco / sorriso aberto | alegria |
| `sad` | **caídas** | 50% / invertida + **lágrima que desce** | tristeza |
| `surprise` | **esticadas** (+60% de comprimento) | 0% / "o" | susto |
| `listen` | uma haste **dobra para a concha**, a outra fica atenta; **ondas sonoras** entram na espiral | 12% | escuta |
| `touched` | como `listen` + olhos em arco + lágrima | arco / sorriso | emoção boa (final) |

**Vida ociosa** (sempre ativa): respiração do corpo, piscada a cada ~3,4 s, as duas hastes balançam independentemente (ruído), cachecol ondulando.
**Passos:** rastejar = alongar e comprimir o corpo (squash & stretch) com brilho da gosma.

## 4. O que o piloto mostra e o que ainda falta

**Mostra (visto em imagens):**
- Silhueta reconhecível em 6 planos, em tamanhos de 0,4 a 1,35.
- O susto do P4 (haste estica) e a murchada do P10 (depois do desafino) comunicam a mesma emoção da heroína com outra gramática.
- O plano P13, com Coco em primeiro plano, dá escala à estrada vazia.

**Ainda falta:**
- O gesto-assinatura `touched` ainda não foi usado num final (porque o piloto termina antes).
- Coco está **bem desenhado em repouso**, mas **pouco animado em deslocamento** (rastejar só foi testado como parâmetro).
- Falta **som próprio** (um "bip-bip" de haste, um som de concha) para virar identidade sonora.
- **Hipótese não testada [HIP]:** que um personagem fixo aumente a retenção entre vídeos. Só dá para saber com métricas de série.
