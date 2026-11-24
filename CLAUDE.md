# ANIMA-O_2D — instruções permanentes para o Claude

Projeto: série de animações verticais (1080×1920, ≤ 120 s) do **Nando, o motoboy**, com narração ElevenLabs (voz Lax). Responder sempre em **português do Brasil**.

## Antes de criar ou alterar QUALQUER episódio, roteiro ou arte
1. Ler `docs/serie/00_leia_primeiro.md` e, nesta ordem: `03_canon_e_continuidade.md` (+ `canon.json`), `02_biblia_de_roteiro.md`, `01_biblia_visual.md`.
2. Abrir `docs/serie/referencias/` (`elenco.jpg`, `estilo_*.jpg`): o padrão visual **não pode cair** em relação a esses quadros.
3. **Todo roteiro novo lembra do anterior**: seção "Herda do cânone" (estado do Nando, 1–3 referências visuais a episódios passados, o que muda no cânone). Funciona também para quem não viu os anteriores. Nunca contradizer o cânone (capacete, emprego, datas, números).

## Regras de qualidade (não negociáveis)
- Seguir `docs/serie/04_producao_passo_a_passo.md` e a checklist `05_checklist_de_qualidade.md`. **Não entregar vídeo sem** inspecionar folhas de contato de TODA a linha do tempo, `producao/tools/checar_roteiro.py`, `producao/tools/regressao_visual.py` e `docs/analise/ferramentas/qa_video.py`.
- **Reutilizar o motor** (`producao/engine/`, mapa em `01_biblia_visual.md §7`) em vez de redesenhar. Mudança de estilo só com decisão explícita do usuário; nesse caso atualizar a bíblia visual e regerar as referências (`regressao_visual.py --gerar`).
- Mesmos erros proibidos de sempre: escala errada, cena parada, legenda cobrindo a ação, mão acima do queixo, objeto flutuando/atravessando, texto espelhado, revelar antes de o Nando perceber, datas incoerentes.
- A fita isolante no capacete é a assinatura; Nando sempre igual (`elenco.jpg`).

## ElevenLabs (créditos do usuário)
Voz Lax `tS45q0QcrDHqHoaWdCDR`, modelo `eleven_v4`, **`generations_count=1`**, estimar antes (`estimate_only`) e **nunca repetir uma geração**. Plano gratuito: 10.000 créditos/mês. Não clonar nem imitar pessoa real.

## Convenções do repositório
- Desenvolver na branch indicada pela sessão; **não abrir PR** a menos que o usuário peça. Terminar commits com as linhas de atribuição da sessão.
- Quadros intermediários e vídeos temporários ficam fora do repositório (pasta temporária). Vão para o git: roteiros, motor, MP4 finais, MP3 da narração, JSON de tempos, docs.
- Ao fim de cada episódio: atualizar `docs/serie/canon.json` e `03_canon_e_continuidade.md`.
