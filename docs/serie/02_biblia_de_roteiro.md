# Bíblia de roteiro

(Base: estudo dos 14 vídeos de referência em `docs/analise/` + feedback do usuário. Não copiar histórias nem personagens de terceiros.)

## Estrutura (≤ 120 s, ~300–330 palavras na voz Lax a ~3 palavras/s)
| Ato | Tempo | Função |
|---|---|---|
| Gancho | 0–6 s | **hora / endereço / número na tela** + situação impossível. Sem "Nesta cidade…". |
| Aposta | até ~30 s | o que o Nando perde se errar (dinheiro, nota, aluguel) **com contagem visível** (cronômetro do app) |
| Escalada | 30–70% | obstáculos concretos, pistas plantadas, tentativas |
| Virada | **70–80%** | a pessoa que parecia o problema era a solução; revelação em imagem |
| Final | últimos 15% | a **escolha do Nando** (ficar, sentar, tocar) causa o final feliz inesperado; última imagem forte, frase final curta |

## Regras fixas
1. **Fio da série:** toda história tem (a) notificação do app ZAP, (b) uma aposta concreta, (c) o capacete com fita isolante, (d) alguém "na porta" que ninguém escuta, (e) final causado por escolha dele, (f) imagem final curta. Ver `03_canon_e_continuidade.md`.
2. **Plantar e pagar:** cada pista plantada (objeto, número, frase) **precisa ser paga** no final. Manter tabela de pistas no documento do episódio.
3. **Refrão visual/verbal** que volta (a fita, "bata na porta", a luz acesa).
4. **Nada de moral explícita nem pedido de inscrição** ("inscreva-se", "deixe seu like") na narração.
5. **Narrador = Nando, primeira pessoa, passado, ironia seca, frases curtas.** Cansado mas gentil. Não vira herói de ação.
6. **Cada frase tem que ter imagem literal** (o que a frase diz aparece; ver `05_checklist`). Frases longas (> 5 s) ganham dois ou mais planos.
7. **Falas de personagem** vão em linhas próprias, com o nome (`DONA CIDA:`), e a imagem mostra quem fala (boca sincronizada).
8. **Números e datas** seguem o cânone (`canon.json`). Antes de escrever um dia da semana, conferir o cânone: o calendário e o app precisam concordar.
9. **Escrita para a voz** (ElevenLabs `eleven_v4`): números como o usuário escreveria (`14`, `4,52`), pontuação para pausa, tags só quando mudam a entrega: `[firmly]`, `[whispers]`, `[long pause]`, `[elderly voice]`, `[softly]`. Falas de personagem velho: `[elderly voice]`.
10. **Texto-fonte único:** `roteiros/fonte_roteiros.py` (linhas com id L01…/M01…); dali saem texto de gravação, JSON e docs.

## Entrega de cada roteiro
`roteiros/NN_titulo.md` com: sinopse, tabela de pistas (plantio → pagamento), contagem de palavras/tempo, falas de personagem, e a seção **"O que este episódio herda do cânone"** (ver `03`).
