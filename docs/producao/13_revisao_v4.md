# 13 — Revisão v4 (a partir do feedback sobre o v3)

Vídeo: `producao/v3/piloto_v4_pedido_fantasma_1080x1920.mp4` (36,4 s). Conferência frase × imagem: `producao/v3/narracao_x_imagem_v4.jpg`.

## O que você apontou → o que foi feito

| Feedback | Causa | Correção |
|---|---|---|
| Ele senta estranho na moto | Eu forçava o corpo **frontal** do rig numa pose de moto (braços e pernas sem apoio). | `rider.js`: corpo de piloto **de perfil**: coxa, joelho junto ao tanque, bota no pedal, tronco inclinado com a jaqueta, braços alcançando o guidão com luvas. A cabeça continua a do Nando (mesmo traço). A inclinação do tronco acompanha as poses (parado, arrancada, vento). |
| Capacete bugado | Era uma cúpula sobre o rosto sem abertura, com a "viseira" desenhada como uma faixa. | Capacete novo: casco com **abertura facial**, listra, brilho, queixeira com respiro, jugular; **viseira levantada** (lente dobrada na testa) e **abaixada** (vidro escuro com reflexo, olhos levemente visíveis). |
| A casa/prédio demolido é difícil de entender | Era um "buraco escuro" entre prédios. | Terreno visto **de frente em perspectiva de 1 ponto**. A casa aparece como **marca fantasma na parede do vizinho** (sala amarela, quarto rosa, banheiro azul de azulejo, escada, silhueta do telhado), mais laje rachada, **degraus que não levam a lugar nenhum**, porta solta em pé, folha de portão caída, pilar com "14" e placa **"VENDE-SE TERRENO"**. |
| Mato e idosa difíceis de entender | Mato em "lanças" sobre a moto; a luz ficava fora do quadro; a Cida era uma silhueta. | Mato em **tufos** com escala por profundidade, **corredor livre** até a mesa e **clareira** em volta dela. A câmera termina **centrada** na mesa: dona Cida de cardigã e óculos, prato dele e dela, caixa de pizza, vela, cadeira vazia e lâmpada pendurada com cone de luz. |
| Legenda sempre bem posicionada | A legenda ficava sobre a moto e o celular. | Todo o mundo sobe 150 unidades: a **ação fica acima de y ≈ 760** e a legenda (y = 850) cai sobre a **rua vazia**, com faixa escura de leitura. O celular foi reduzido e subido. |
| Construção dos elementos e personagens simples | Pouco detalhe. | Nando: gola alta, zíper com puxador, bolso com aba, remendo ZAP, dobras, barra canelada, luvas, faixas refletivas no braço. Rosto: realce no nariz, linha da pálpebra inferior, queixo, sombra sob a cabeça, orelha interna. Cida: cardigã com botões. Prédios: ar-condicionado, sacadas. |
| Noção de profundidade | Camadas sem atmosfera. | Névoa gradual com a distância, carros estacionados na escala certa, reflexos de poste no asfalto molhado, poste escuro em primeiro plano passando em paralaxe, brilho de luz nas janelas. |
| Bugs visuais | — | Cabeçalho do app sobrepondo "aceitar em 0:30"; selo "HOJE" cobrindo o relógio; selo do prazo cobrindo o baú; rachaduras da laje virando "setas"; carro de trás parecendo terceira roda; placa cobrindo a mesa; mato cobrindo a Cida; poste cortando a marca da casa. |

## Medições (câmera congelada, sem legenda)
| | v3 | v4 |
|---|---|---|
| Quadros parados (< 0,05) | 3% | 3% |
| Movimento visível (> 0,5) | 53% | 50% |
| Mediana de plano | 1,65 s | 1,63 s |
| QA do MP4 | 0 falhas | 0 falhas, 0 avisos |

A fluidez se manteve; o ganho do v4 é de **leitura e acabamento**, que esta métrica não mede.

## O que continua fraco
1. **Dois planos do Nando parado** (4,9–5,85 s e 13,2–14,05 s) têm 30% e 55% de quadros parados sem a câmera. A atuação ali é só respiração e troca de expressão.
2. **Cabeça grande demais** em relação ao corpo de piloto (o estilo cabeçudo do canal, mas ao lado de um corpo mais realista pesa).
3. **Dona Cida ainda é pequena** no plano final e parte dela fica atrás do mato à direita.
4. **Muita tela de celular** (≈ 14 s dos 36 s).
5. Só 36 s dos ~110 s estão animados; voz e sons são provisórios.
6. Ainda falta resposta sobre o que é o "personagem fixo" (ver doc 12, seção 6).
