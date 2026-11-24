# Cânone e continuidade — o que o próximo episódio precisa lembrar

Fonte de verdade legível por máquina: [`canon.json`](canon.json). **Todo roteiro novo começa lendo este arquivo.**

## Ordem dos episódios (importante)
1. **O Prédio das 21 Pizzas**: o Nando ainda vive da nota do app e usa o capacete velho com fita "há dois anos".
2. **Pedido Fantasma**: termina com emprego fixo no Forno Vivo e capacete novo.

> **Recomendação: publicar nesta ordem** (21 Pizzas primeiro). Se for ao contrário, "Pedido Fantasma" entrega o final do Nando antes de o público ver a fase anterior dele. Se o usuário preferir a ordem inversa, o canon continua o mesmo; só as menções entre episódios mudam.

## Estado atual do Nando (depois de "Pedido Fantasma")
- Entregador fixo do **Forno Vivo** (salário R$ 2.350, plano de saúde). Aluguel em dia.
- **Capacete novo** (vermelho, adesivo FORNO VIVO, sem rachadura). O velho, **com a fita**, está numa prateleira ao lado da foto do Zé.
- Decisão de série **(proposta; confirmar com o usuário)**: ele ainda atende pedidos do ZAP nas folgas, para manter a assinatura do app e do cronômetro.
- Quem pode voltar: Dona Cida · seu Aníbal (conserta tudo, grátis) · Dona Lúcia (apto 31) · o porteiro do Edifício Aurora.

## Linha do tempo do cânone
| Fato | Onde |
|---|---|
| Edifício Aurora, apto 82 (8º andar), elevador quebrado, 21 pizzas, 7 viagens, nota 4,52 → 4,9 | Prédio das 21 Pizzas |
| Campainha quebrada há 11 anos, consertada com a **fita do capacete**; vizinhos com 21 pratos; "Eu estava esperando alguém tocar." Cartaz novo: "Toque a campainha. Ela funciona." | Prédio das 21 Pizzas |
| Quinta-feira, 12 de outubro, 23:47; Rua das Acácias, 14 (casa demolida em 1994, "há 30 anos") | Pedido Fantasma |
| 11 pedidos cancelados em 12/10 (2012–2022); cancelar = R$ 340; aluguel R$ 1.250 vence sexta | Pedido Fantasma |
| Dona Cida, dona do Forno Vivo; o marido Zé, 1º entregador, saiu 23:47 de 1994, chegava em 6 min, capacete rachado; o Nando levou 9 min 30 s | Pedido Fantasma |
| Nando **senta** e deixa vencer; ganha emprego fixo e capacete novo; guarda o velho; um ano depois o terreno tem forno, mesa pra dois e um capacete na cadeira; "A casa 14 voltou." | Pedido Fantasma |

## Objetos e imagens-refrão (devem reaparecer)
capacete com fita · notificação do ZAP + cronômetro · luz acesa no escuro · porta/campainha · baú ZAP no bagageiro.
**Cada episódio novo: pelo menos 3 destes aparecem e 1 é *paga* (a fita resolve algo).**

## Fios abertos (ideias prontas para os próximos roteiros)
1. O que aconteceu com o **Zé** depois das 23:47 de 1994? (resolver com muito cuidado ou deixar em aberto)
2. **Seu Aníbal conserta tudo**: pode consertar o capacete velho, ou algo do Forno Vivo (paga a fita).
3. **Dona Lúcia e o berço**: um bebê no prédio.
4. **O porteiro que ria** merece um episódio.
5. Os **outros 11 entregadores** que cancelaram: cada um tinha um motivo.
6. A aposta do próximo episódio **não pode ser só dinheiro** (ele já está estável): usar tempo, confiança, promessa, uma pessoa.

## Como um roteiro novo "lembra" do anterior (obrigatório)
Todo roteiro novo tem a seção **"Herda do cânone"** com: (a) estado do Nando no início; (b) 1–3 referências concretas a episódios anteriores (um objeto, um lugar, uma pessoa, uma frase); (c) o que muda no cânone ao final. Referências são **mostradas**, não explicadas ("o capacete velho na prateleira", não "lembra do episódio 2"). O episódio tem que funcionar também para quem nunca viu os anteriores.

## Como atualizar ao fim de cada episódio
Editar `canon.json` (episódio, fatos, `estado_atual_do_nando`, `fios_abertos`) e este arquivo, e rodar `python3 producao/tools/checar_roteiro.py --apos <slug>` nos roteiros seguintes.
