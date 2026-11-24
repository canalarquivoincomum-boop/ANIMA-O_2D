# Bíblia visual — o estilo da animação (não mudar sem decisão explícita)

Padrão de referência: `referencias/estilo_*.jpg` e `referencias/elenco.jpg`. Código: `producao/engine/`.

## 1. Linguagem
- **Vetorial 2D (SVG) renderizado quadro a quadro** em Chromium (Playwright) e montado com ffmpeg. Formas chapadas com **sombreamento cel** (crescente de sombra do lado oposto à luz) e **luz de contorno**.
- **Contorno grosso azul-noite `#1d2747`**; nas peças coloridas o contorno é uma versão escura da própria cor (`colorOutlines`).
- **Personagens "chibi"**: cabeça grande (L 54–64, A 50–58 unidades de rig), corpo curto (rig total = 273 unidades), olhos grandes com brilho, bochechas, nariz e rugas nos mais velhos. Elenco: `referencias/elenco.jpg` (`CAST` em `ch.js` e `kit.js`).
- **Mundo: cidade à noite** com luz de poste. Mesma paleta em todos os episódios.

## 2. Paleta
| Uso | Cores |
|---|---|
| Contorno | `#1d2747` |
| Céu/fundo noturno | `#0d1030` → `#2b2f66` → `#6b5a86` |
| Luz de poste/lâmpada | `#ffe9a8`, `#ffd878`, `#ffcf78` (janelas acesas) |
| Pele do Nando | `#8a5a3d` (barba por fazer) |
| Jaqueta do Nando | azul `#2f4a8c` com faixas refletivas e remendo vermelho **ZAP** `#e8553d` |
| Capacete / moto | vermelho `#d9503f` / `#c9473d`, listra branca, viseira `#141c38`, **fita isolante `#26262e`** |
| UI do app | fundo `#10142e`, cartão `#1b2142`, vermelho `#ff5a4a`, verde `#3ddc84`, amarelo `#ffd24a` |
| Legenda | branca, palavra ativa `#FFC93C`, contorno `#1a2038` |

## 3. Formato e câmera
- **1080×1920, 30 fps**, viewBox **576×1024**. Planos `scene` usam `SHIFT=150` (a ação sobe 150); planos `screen` usam coordenadas absolutas.
- **Legenda** no rodapé (y=850, Inter 800, 44 px, faixa escura a partir de y=744). **A ação principal fica acima de y≈760.** Legenda nunca cobre o rosto nem o objeto da história.
- **Camadas e paralaxe:** longe 0,42 · meio 0,78 · perto 1 · primeiro plano 1,35; desfoque de profundidade (`dof`), névoa, vinheta e grão.
- **Todo plano tem movimento**: push-in lento (`KIT.pz`, 1,0 → 1,05–1,3), tremor no susto (`shake`), roll, balanço de mão do celular. Nenhum plano 100% parado.
- **Ritmo:** mediana de plano 1,0–2,4 s (hoje ≈ 1,7 s). Plano > 4 s só com peso emocional. Cortes começam **60 ms antes** da frase.
- **Diálogo:** campo/contracampo (`KIT.talk`), com inserts (foto, cartão, UI, objeto) enquanto a voz continua. Fim: fade para preto ≤ 0,7 s.

## 4. Escala e perspectiva (bíblia de escala, `world.js`)
- **1 m = 210 unidades** na profundidade de referência (chão em y=900). `charScale(altura_m)`, `depth(y,HY)`. Prédios, postes, carros e moto são desenhados em metros.
- Corpo chibi tem quadril baixo ⇒ mobiliário na escala do elenco: **assento 0,30 m, tampo de mesa 0,62 m**, mesa com toalha que esconde as pernas.
- Terreno em perspectiva de 1 ponto (`lot4.js`), corredor em 1 ponto (`s2.js` → `corridor`). **Nada é dimensionado "no olho".**

## 5. Regras de atuação e pose (aprendidas com erros reais)
1. **A mão nunca sobe acima do queixo** (a cabeça é desenhada por cima do braço e "esconde" o gesto).
2. **Sentado:** o tronco desce junto com o quadril (`hipDrop`), com pescoço; personagens sentados ficam **atrás da mesa**.
3. **Quem narra não mexe a boca.** Só quem **fala em cena** (Dona Cida, seu Aníbal) tem boca sincronizada às palavras reais (`KIT.mouth`).
4. **Passos de verdade:** em escada, cada pé segue um ciclo apoio/passo em degrau real (`climb` em `s2.js`); no chão, ciclo de caminhada do rig. Nada de pé flutuando ou "deslizando".
5. **Objetos seguram-se em mãos/superfícies:** capacete sobre a prateleira encosta nela (base = linha da prateleira); baú nas mãos fica sob elas.
6. **Texto em cena nunca espelhado** (cuidado ao inverter a moto com `scale(-1,1)`: o ZAP do baú inverte; só inverta sem texto).
7. **Capacete do Nando:** sempre vermelho, listra branca, viseira; **fita isolante em diagonal sobre a rachadura** (marca da série). Quando a viseira está abaixada os olhos quase somem; usar viseira levantada para atuar.
8. **Expressão em transição:** não misturar expressão de olho aberto com olho "em arco" (`happy`) no meio de uma troca: o rosto vira "dois círculos". Para cortar de/para `happy`, trocar direto.
9. **Moto:** perfil de piloto próprio (`rider.js`), baú **ZAP preso ao bagageiro**, farol com feixe.

## 6. Luz
- Luz **quente** de poste em cima/lado, **fria** do celular/azul de rua nas sombras; sempre luz de contorno do lado da fonte.
- Objeto importante recebe **brilho/halo** (lâmpada, bell, caixa que abre). Cenas de dia/manhã só no final de episódio (ex.: cartaz novo de manhã) para marcar a resolução.

## 7. Mapa do motor (o que reutilizar antes de criar algo novo)
| Arquivo | Conteúdo |
|---|---|
| `lib.js` | easing (mola, antecipação), keyframes, ruído |
| `ch.js` | rig de personagem, elenco antigo, expressões (`EXPR`), poses (`POSE`), mãos, capacete (`helmetSvg`) |
| `rider.js`, `world.js` | piloto na moto, moto, carro, poste, prédio em metros |
| `sets3.js`, `lot4.js` | rua noturna em camadas, terreno/lote com mesa, forno, varal (`built`) |
| `ui3.js` | telas do celular (bloqueio, pedido, mapa, cronômetro, cancelar, histórico), cartas, bokeh |
| `kit.js` | elenco novo (aniba, porteiro, lucia, ze, v1–v6), objetos (capacete, caixa de pizza, caixa de presente, braço da luva), fundos desfocados, `KIT.talk`, lip-sync, push-in |
| `story_v3.js` | planos validados do 1º episódio (`G.V3.ride`, `lotScene`, `cidaClose`…) |
| `s1.js`, `s2.js` | os dois episódios, **o melhor exemplo de como montar um novo** |
| `main_s.html` | renderizador comum (`?s=N`), legendas por palavra, DOF, fade final |
| `brand.html`, `elenco.html` | marca do canal e folha do elenco |

## 8. Erros proibidos (cada um já aconteceu e foi corrigido)
gigantes/miniaturas (escala errada) · perspectiva errada · cena parada · narração falando de algo que não aparece · legenda por cima da ação · braço atrás da cabeça · personagem "atravessando" objeto · objeto flutuando · texto espelhado/estourando a caixa · números sobrepostos · **revelar antes de o Nando perceber** (campainha, cartaz) · **data/dia da semana incoerente com o roteiro** · expressão "em círculos" em transição · mato/lixo visual em cena de "tudo reformado" · cor/forma do capacete diferente de um episódio para outro.
