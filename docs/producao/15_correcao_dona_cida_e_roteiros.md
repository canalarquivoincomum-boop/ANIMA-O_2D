# 15 — Correção da dona Cida e os dois roteiros do Nando

## A causa dos defeitos da Cida (corrigida no motor, vale para todo personagem sentado)
1. **Tronco não descia junto com o quadril.** Em `sit`, cabeça e ombros desciam 40 unidades, mas o desenho do tronco ficava onde estava em pé; a cabeça "sentava" em cima de um tronco achatado.
   - **Correção:** o tronco acompanha `hipDrop` (`translate(0, hd*0.9)`).
2. **Faltava pescoço.** A cabeça encostava nos ombros. **Correção:** pescoço com sombra sob o queixo.
3. **O braço do relógio ia para uma posição acima do queixo.** A cabeça é desenhada por cima dos braços, então o braço "ia para trás da cabeça".
   - **Correção:** regra de pose: **a mão nunca sobe acima do queixo**. O gesto do relógio agora é antebraço levantado na frente do peito, com a cabeça inclinada olhando o pulso.
4. **Mangas de "vestido" (gomos soltos nos ombros).** **Correção:** manga comprida de cardigã com punho (`longSleeve`).
5. **O mato escondia parte dela** no plano aberto. **Correção:** corredor livre até a mesa.

Vídeo: `producao/v3/piloto_v6_cida_corrigida_1080x1920.mp4`. A voz, a pista "sete minutos" e o cronômetro 07:00 desse vídeo ainda são do **texto antigo**; o roteiro novo muda para "um minuto e meio" (ver `roteiros/`).

## Roteiros (pasta `roteiros/`)
- Protagonista fixo: **Nando, o motoboy** (`00_biblia_do_nando.md`).
- Roteiro 1: **Pedido Fantasma**, completo: a senhora é a dona do restaurante e o "pedido impossível" é um teste para achar quem chegue.
- Roteiro 2: **O Prédio das 21 Pizzas**: os vizinhos pedem 21 pizzas para ter um motivo de bater na porta do homem que consertava tudo e nunca teve a campainha consertada.
- Textos para gravação: `roteiros/gravacao_*.txt`.
