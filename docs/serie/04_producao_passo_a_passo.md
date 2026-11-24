# Produção de um episódio, passo a passo

Pré-requisitos: node + playwright, ffmpeg, Python 3 com `numpy`, `Pillow`, `faster-whisper`. Conector ElevenLabs. Frames e vídeos intermediários vão para uma pasta temporária (não para o repositório).

## 0. Antes de escrever
Ler `03_canon_e_continuidade.md`, `02_biblia_de_roteiro.md` e abrir `referencias/estilo_*.jpg`. Escrever a seção **"Herda do cânone"**.

## 1. Roteiro
1. Adicionar o episódio em `roteiros/fonte_roteiros.py` (linhas `("L01","1 GANCHO","N","texto",pausa,"direção")`). *Cuidado:* importar esse arquivo grava arquivos no diretório atual; rode a partir de `roteiros/`.
2. `python3 producao/tools/checar_roteiro.py roteiros/gravacao_<slug>.txt --apos pedido_fantasma` (ajuste `--apos`). Corrija os avisos.
3. Escrever o texto para a voz (números como `14`, `4,52`; tags `[firmly]`, `[whispers]`, `[long pause]`, `[elderly voice]`) em `producao/eleven/sN_prompt.txt`.

## 2. Voz (ElevenLabs, plano gratuito ⇒ poupar créditos)
- Voz: **Lax** (`voice_id tS45q0QcrDHqHoaWdCDR`), modelo `eleven_v4`, **`generations_count=1`**, **nunca repetir a chamada** (cobra de novo). Primeiro `estimate_only`. Cerca de 2.000 créditos por episódio de ~100 s.
- `creative_create_flow` → `creative_generate_speech` → `creative_get_flow_run_status` até `all_completed` → baixar `content_url` (`curl`) para `producao/eleven/sN_lax.mp3`.
- Orçamento: free tier = 10.000 créditos/mês; conferir com `account_get_usage`.

## 3. Alinhamento
```
cd producao/eleven
python3 align_el.py sN sN_lax.mp3     # Whisper → sN_words.json / sN_frases.json   (adaptar fonte/rótulo no script para o episódio novo)
python3 snap.py sN                    # cola os limites de frase nas pausas reais (silêncio a -38 dB)
python3 make_data.py                  # → engine/data_sN.js (PH por frase, WORDS por palavra)
```
Conferir os tempos de frases com silêncio longo (`[long pause]`): o Whisper erra aí; corrigir à mão (ex.: "Dim-dom" em 73,02 s).

## 4. Planos (`producao/engine/sN.js`)
- Copiar a estrutura de `s1.js`/`s2.js`: um plano por trecho de frase, `A(id)` = início − 0,06 s; `K.wordAt(id,k)` para gestos no tempo da palavra (**k é o índice 0-based da palavra na frase**: conferir contando).
- Reutilizar `KIT.talk` (conversa), `climb`, `corridor`, `doorFront`, `cutaway`, UIs; **não reinventar** peças que já existem (ver mapa em `01_biblia_visual.md`).
- Os planos devem cobrir **toda** a linha do tempo sem buracos (o fim de um é o início do próximo; ver o trecho final de `s2.js`).
- Adicionar `'sN'` ao `main_s.html` só se mudar o esquema de nomes (ele carrega `data_sN`/`sN` pelo `?s=N`).

## 5. Verificação visual (obrigatória, antes de renderizar tudo)
```
producao/eleven/shots.sh N T0 T1 PASSO /pasta/folha.jpg 6   # folha de contato (um quadro a cada PASSO s)
```
Olhar **todo o episódio** a cada 1–1,7 s e quadros críticos em tela cheia. Procurar os erros de `01_biblia_visual.md §8`. Corrigir e re-renderizar só os trechos alterados (`node render.js main_s.html SAIDA --w 1080 --h 1920 --q s=N --from F0 --to F1`).

## 6. Render e áudio
```
Q='s=N' ./producao/render_all.sh engine/main_s.html /tmp/fr_sN <último_frame> 1080 1920   # 4 processos; ~1 quadro/0,4 s no total
python3 producao/eleven/make_sfx_sN.py                                                   # copiar make_sfx_s1/s2: trilha + efeitos por evento
producao/eleven/build_s.sh sN /tmp/fr_sN producao/sN/<slug>_1080x1920.mp4 <duracao>       # voz + trilha com sidechain + efeitos, -14 LUFS
```
(`render_all.sh` roda em segundo plano; aguardar com um laço `until grep -q "frames:" log`, **sem `sleep` encadeado**.)

## 7. Fechamento
`python3 docs/analise/ferramentas/qa_video.py <mp4>` · `python3 producao/tools/regressao_visual.py` · checklist `05_checklist_de_qualidade.md` · atualizar `canon.json`/`03` · documento do episódio em `docs/producao/NN_*.md` · commit na branch de trabalho (sem abrir PR a menos que peçam).

## Armadilhas já encontradas
- Importar `fonte_roteiros.py` escreve arquivos no diretório atual.
- Rodar Python com `-I` impede `import` local (`sfxlib`).
- Frases com `[long pause]`: tempo do Whisper não confiável; conferir com silencedetect.
- `K.wordAt('X', k)`: índice 0-based por palavra, **inclui palavras pequenas** ("a", "de"); errar o índice atrasa o gesto.
- Planos `scene` usam `SHIFT=150`; para corredor/porta use planos `screen` com `K.pz`.
- Render de 3.000+ quadros leva ~30 min; corrigir erros em folha de contato **antes**.
