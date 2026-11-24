# Série do Nando — leia isto antes de criar QUALQUER episódio novo

Este diretório é a **memória da série**: guarda o estilo visual, a regra de roteiro, a continuidade entre os episódios e o passo a passo de produção. O objetivo é que **cada episódio novo pareça do mesmo canal e lembre do anterior**, sem perder qualidade.

## Ordem de leitura
1. [`03_canon_e_continuidade.md`](03_canon_e_continuidade.md) (e `canon.json`): **o que já aconteceu**, o estado atual do Nando, objetos que se repetem, fios abertos. É o que o novo roteiro precisa "lembrar".
2. [`02_biblia_de_roteiro.md`](02_biblia_de_roteiro.md): estrutura, gancho, plantio e pagamento, tom, limites de tamanho.
3. [`01_biblia_visual.md`](01_biblia_visual.md): estilo da animação, escala, luz, câmera, regras de pose e lista de bugs proibidos.
4. [`04_producao_passo_a_passo.md`](04_producao_passo_a_passo.md): comandos, na ordem, da voz ao MP4.
5. [`05_checklist_de_qualidade.md`](05_checklist_de_qualidade.md): a **porta de qualidade**: nada é entregue sem passar por ela.
6. [`06_marca_do_canal.md`](06_marca_do_canal.md): nome, foto de perfil, banner e descrições.

## Referências visuais (abra antes de desenhar)
- [`referencias/elenco.jpg`](referencias/elenco.jpg): todos os personagens, lado a lado.
- [`referencias/estilo_pedido_fantasma.jpg`](referencias/estilo_pedido_fantasma.jpg) e [`estilo_predio_21_pizzas.jpg`](referencias/estilo_predio_21_pizzas.jpg): folhas de contato dos dois episódios publicados (um quadro a cada 4 s). **É o padrão de qualidade mínimo.**
- `referencias/golden/`: quadros de teste usados pela regressão visual.

## Ferramentas de proteção (rode sempre)
| Ferramenta | Para quê |
|---|---|
| `python3 producao/tools/checar_roteiro.py <texto.txt>` | confere o roteiro novo contra a regra e o cânone (gancho, tamanho, assinatura, contradições) |
| `python3 producao/tools/regressao_visual.py` | garante que uma mudança no motor **não estragou o visual dos episódios já publicados** |
| `python3 docs/analise/ferramentas/qa_video.py <mp4>` | QA técnico do vídeo final (loudness, ritmo de cortes, flashes, trechos parados) |

## Regras de manutenção (obrigatórias ao fim de TODO episódio)
1. Atualizar `03_canon_e_continuidade.md` e `canon.json` (o que aconteceu, o que mudou no Nando, fios abertos).
2. Se o estilo mudou **de propósito**: atualizar `01_biblia_visual.md` e rodar `regressao_visual.py --gerar`; se mudou **sem querer**, desfazer.
3. Rodar a checklist de qualidade e anexar o resultado do QA ao documento do episódio.
