# 03 — Guia mestre de produção para novas animações

Este guia transforma a análise dos 14 vídeos em um padrão de produção. Ele **respeita as regras já existentes do canal Escuta Só** (PT-BR; MP4 1080×1920 a 30 fps; narração do próprio usuário; histórias originais; sem "se inscreva"; não parecer feito por IA; traço próprio; HTML/SVG + Playwright + ffmpeg) e acrescenta o que as referências ensinam.

Convenções: **[OBS]** vem da análise; **[HIP]** é hipótese a testar; **[TESTADO]** significa que a sintaxe do comando foi executada com sucesso (o efeito visual ainda precisa ser conferido no seu render).

---

## 1. Princípios (o que absorver, em dez linhas)

1. **A história é uma pergunta que o espectador quer ver respondida**, formulada em até 6 s.
2. **A ideia vira imagem antes de virar frase.** Se o gancho precisa de explicação, a imagem está fraca (V02: o cachorro que se vê leão).
3. **Um problema pessoal pequeno e concreto** aparece cedo (até ~20 s num vídeo de 120 s).
4. **Um medidor visível** mostra o estado da regra sem narração (relógio, espelho, sombra, opacidade).
5. **Plantar e pagar:** todo detalhe estranho dos primeiros 40% volta com sentido novo nos últimos 30%.
6. **Refrão de três** que muda de sentido na última vez.
7. **O herói causa ou agrava o problema** (V04, V12): a reparação custa algo.
8. **A virada muda o significado do que já vimos**, em vez de adicionar fatos novos (≈60–75% do tempo).
9. **O clímax é uma ação física pequena**, sem discurso (religar o fio, escrever no papel, partir o pão).
10. **Final inesperado e feliz, em imagem**, com uma frase curta que devolve o objeto-símbolo. Nunca moral explicada, nunca CTA.

---

## 2. Identidade própria: o que NÃO copiar

| Elemento das referências | Por que evitar | O que fazer no Escuta Só |
|---|---|---|
| Abertura literal "Nesta/Na minha cidade, [regra]" | Está em 14 de 14 vídeos de 5 contas. Vira assinatura dos outros. | Abrir com **uma promessa pessoal + objeto** (seção 3) e dar a regra em seguida. |
| Narrador "Tito, 10 anos", Paçoca, seu Valdir, Duda, vô, pipa, guarita | Elenco de outra conta. | Elenco original e único: cada personagem com rosto, cabelo, corpo, altura e roupa próprios (regra do canal). |
| Premissas já usadas | Não repetir: mentiras que viram verdade, espelhos de autoimagem, preço por salário, placa no peito, validade na nuca, posts, videogame/P2, pontos e níveis, camisa de time, salário em sono, padrinho, inveja que passa talento, palavrão-tijolo, orelhão ao passado. | Checar cada ideia nova contra essa lista (checklist, bloco 1). |
| Moral falada (V08, V10), CTA (V03) | Quebra o clima e contradiz a regra do canal. | Terminar na imagem. |
| Selo "AI-generated" e traço genérico (V13) | O canal não pode parecer IA. | Traço e atuação próprios, revisados quadro a quadro. |

O que **é** livre de copiar: **princípios** (os dez acima) e o repertório técnico de edição.

---

## 3. O gancho (0–3 s)

### 3.1 O que as referências fazem [OBS/MED]
- A **primeira palavra cai em 0,00 s** (14/14), sem título nem silêncio.
- Em ≥ 7 vídeos, o plano 0 é um **close extremo** (rosto, mão, objeto) e, a ~0,6 s, um **corte com borrão** abre para o plano geral.
- A regra é dita em 2,4–6,6 s e **mostrada** em paralelo (feixe rosa em V12, leão no espelho em V02).

### 3.2 Gancho próprio do canal: "promessa + objeto + regra"
Estrutura em 3 batidas (≈ 6–9 s):

| Tempo | Batida | Exemplo (ver seção 11) |
|---|---|---|
| 0,0–3,0 | **Promessa pessoal** ou **ação em andamento**, com um objeto em close no 1º segundo | Mão da menina com a flauta, a luz da janela atravessando os dedos. "Meu pai prometeu chegar antes da última música." |
| 3,0–6,0 | **O problema físico visível** (o medidor) | "…e eu já estava ficando transparente." |
| 6,0–12,0 | **A regra do mundo**, em 1 frase, e 1–2 exemplos em imagem | "Na minha rua, quem espera vai sumindo." |

Cinco modelos de gancho que **não** são "Nesta cidade":
1. **Promessa quebrada em andamento** ("Meu pai prometeu…").
2. **Objeto que não devia estar ali** ("O bolso do meu irmão pesava mais que ele.").
3. **Contagem regressiva já correndo** ("Faltavam onze minutos…").
4. **Pergunta que o herói não deveria fazer** ("Por que a sombra do zelador chega antes dele?").
5. **Consequência antes da causa** ("A rua inteira floresceu e só eu sabia por quê.").

**Regra de ouro:** o espectador tem de **ver o problema** em ≤ 3 s e **querer saber a causa**. Se precisar da frase para entender a imagem, refaça a imagem.

---

## 4. Estrutura de 120 s (mapa de batidas)

Alvo: **≤ 120 s totais**; fala em **≈ 165–185 palavras/min** (as referências usam 209–225, o que é muito rápido; para a voz do canal e para a emoção, recomendo um pouco mais lento **[HIP]**). Orçamento: **≈ 320–360 palavras** para ~115 s de fala.

| # | Janela | Função | Palavras | Planos (alvo) | Regras |
|---|---|---|---|---|---|
| 1 | 0–6 s | Gancho: promessa + problema visível | 15–20 | 3–4 | Close no 1º segundo; legenda desde o 0,0 s. |
| 2 | 6–18 s | Regra do mundo + **até 2 exemplos** | 35–45 | 6–8 | Um exemplo = uma imagem; o último já é pessoal. |
| 3 | 18–30 s | Protagonista e ferida | 35–45 | 6–8 | Nome, idade e um defeito/hábito visual específico. |
| 4 | 30–40 s | **Gatilho** + pergunta aberta | 25–30 | 5–6 | Gatilho **até ~30 s** (referências: 22–42 s). |
| 5 | 40–75 s | Escalada em **3 tentativas** | 90–100 | 22–28 | Cada tentativa piora ou muda o medidor; pelo menos um plantio. |
| 6 | 75–88 s | Ponto mais baixo | 25–30 | 5–8 | Corte mais longo (2–4 s), ausência de música. |
| 7 | 88–100 s | **Virada** (≈ 70–80% do tempo) | 30–35 | 6–8 | Reinterpreta o plantio; sem fato novo. |
| 8 | 100–114 s | Ação física pequena + reparação | 30–35 | 8–10 | Imagem leva, voz cala. |
| 9 | 114–120 s | **Final em imagem** + 1 frase curta | 8–15 | 2–4 | Devolve o objeto-símbolo ou ecoa o gancho (loop). |

**Duração de plano alvo:** 0,5–2,3 s, mediana **~1,2–1,5 s** (mais lenta que V07/V08, mais rápida que V09). **Mantenha holds de 2–5 s** nos momentos de peso (ponto mais baixo e final) **[HIP]**, o contrário do ritmo constante das referências.

---

## 5. Roteiro: regras de escrita

### 5.1 Frases
- Fragmentos curtos e frases de 5–12 palavras. Quase todas as referências têm **pausa mediana de 0,3 s** entre frases.
- **Substantivo concreto** em lugar de abstrato ("olheira até o queixo", e não "cansaço").
- **Números e prazos** que o espectador possa ver ("7 dias", "3:00").
- Última frase com **3–8 palavras**.

### 5.2 Plantar e pagar (tabela de rastreio obrigatória)
Preencha antes de animar. Se uma linha não tiver pagamento, ou corte o plantio ou invente o pagamento.

| Plantio (tempo) | Aparência no plantio | Pagamento (tempo) | Novo sentido |
|---|---|---|---|
| ex.: avental flutuando com uma flor (0:14) | "mistério decorativo" | ex.: o Bento deixa a flor (1:32) | alguém a vê, por isso ela ainda existe |

Referências de plantio forte: uniforme abotoado até o pescoço (V09), munhequeira (V10), foto cortada + durex + coxinha (V11), olheira/lápis/calo (V06), mala (V05).

### 5.3 Refrão de três
Uma frase curta dita 3 vezes (ex.: "Daqui a pouquinho."). Na terceira ela **muda de sentido** (V05, V11, V13). Pode ser dita por personagens diferentes.

### 5.4 O herói e o dano
Para a emoção ser conquistada, deixe o herói **causar ou agravar um dano pequeno** no ato 1 (V04, V12). A ação do ato 3 repara.

### 5.5 Final inesperado e feliz
Inesperado = o final **não repete o que o espectador previu**, mas é **justo** (as pistas estavam lá). Teste: se alguém previu o final exato aos 60 s, reescreva a virada.
Feliz = **uma emoção calorosa e específica** (calor, alívio, riso), não um sorriso genérico. Em cena triste, ninguém sorri de boca aberta (regra do canal).

### 5.6 Proibido
Moral falada; CTA; narrador explicando a emoção ("senti tristeza"); a mesma estrutura de gancho em dois vídeos seguidos; premissa da lista da seção 2.

---

## 6. Linguagem visual e atuação

Base: **o traço próprio do Escuta Só** (a skill do canal): 2D flat, cabeçudos, olhos grandes com pupila pequena e brilho, sobrancelhas grossas, bochechas rosadas, contorno azul-marinho grosso, corpo em feijão, braços de uma peça com manga+punho+mão, paleta pastel, grão leve e vinheta moderada.

### 6.1 O que as referências ensinam e como superar
| Aprendizado | Como aplicar | Como superar as referências |
|---|---|---|
| **Medidor visível** | Um objeto que mede o estado da regra, mudando de cor/forma conforme a emoção. | Integrar ao cenário (sombra, opacidade, peso do bolso), e não só como UI flutuante. Vira atuação. |
| **Cor com função** | Casa = bege/pastel; esperança = quente/dourado; tristeza = fria e dessaturada; noite = índigo com janelas amarelas; memória = sépia com moldura arredondada. | Fazer a cor **mudar ao longo da cena** com a emoção (ex.: do azul frio ao dourado no último plano). |
| **Closes de olhos e mãos** | Para a virada e para o clímax. | Usar o **olhar com alvo** (para o objeto, para o outro), nunca para a câmera, exceto no gancho/final. |
| **Frontalidade** das referências (poses de "boneco de papel") | — | Poses de 3/4, costas, over-the-shoulder, plano aéreo, personagem pequeno em espaço grande. Pernas sempre visíveis; peso nos pés. |
| **Microatuação** | — | Troca de expressão a cada ~0,3–0,5 s em cenas de reação; "olhar → cabeça → gesto → peso"; ouvinte reage enquanto o outro fala; respiração contínua. |

### 6.2 Composição
- **Regra dos 3 planos** (fundo, médio, frente) e **paralaxe** por camadas: far 0,42; mid 0,78; near 1,0; fore 1,35; câmera `cx, cy, z`.
- **Dupla camada no mesmo quadro** (V07): uma metade mostra a causa e a outra o efeito (mãos no controle × personagem). Excelente para ironia dramática.
- **Moldura/sépia** para memória; **vinheta radial** para medo; **tela dividida** para dois espaços (V14).
- Texto de cena (bilhete, placa) aparece palavra por palavra **um pouco antes da voz** (regra do canal).

### 6.3 Elenco único
Cada personagem com rosto, cabelo, corpo, altura, pele e roupa próprios. Adulto ~1,12 de escala; criança ~0,85. Nunca só trocar a cor.

---

## 7. Edição, câmera, legendas e áudio

### 7.1 Edição e câmera
- **Corte seco** como padrão; **whip-pan com borrão de 2–3 quadros** entre sets; **íris** para memória; nenhuma transição cobre a cena.
- **Mudança visual a cada ~1–1,3 s** (corte, zoom, prop ou expressão), mas **o zoom só quando tem função**: aproxima na tensão, afasta na revelação, para no clímax. **[HIP]** Na amostra analisada, a maioria dos planos longos tinha câmera quase fixa com animação interna; zoom contínuo em ~75% dos planos não foi confirmado (documento 02, seção 4). **Meça os seus renders** (ferramenta de QA).
- **Holds** de 2–5 s no peso emocional; **rajadas curtas** (0,5–1 s) na tensão.
- Cada set reaparece **2–4 vezes** em distâncias diferentes; objetos na **mesma posição** entre cortes.

### 7.2 Legendas (regra do canal)
Fonte arredondada em negrito (tipo Poppins), 44–46 px, 2–4 palavras, branco com contorno escuro, **palavra falada em dourado**, y ≈ 775/1024 (longe da borda da interface do Shorts); rostos e objeto-chave sempre **acima**; nunca fora da tela. As referências usam exatamente esse padrão, o que é um bom sinal de legibilidade.

### 7.3 Áudio
| Item | Meta | Fonte |
|---|---|---|
| Voz | Sempre principal, sem edição da fala. Cortar silêncios > 140 ms; **pausa dramática de 0,3–0,5 s só antes da frase mais importante**. | regra do canal; referências: pausa mediana 0,3 s |
| Ritmo | 165–185 palavras/min **[HIP]** | referências 209–225 |
| Trilha | **Nova por história**, baixa, com **ducking**, só em cenas-chave e **com justificativa na imagem**; nunca reaproveitar outra. Em V04/V09/V14 a trilha não parece contínua **[MED]**. | regra do canal |
| Mix | Fundo ≈ **14–17 dB abaixo da voz** como na maioria das referências **[MED]**. | referências |
| SFX | Discretos, sincronizados, "na pitada certa"; um som por **pagamento** de plantio (portão que range, fio no chão). | regra do canal |
| Loudness final | ≈ **−14 LUFS integrado**, pico real ≤ −1 dBFS. | referências (9 de 14 em −14,0) |

**Comandos ffmpeg [TESTADO — sintaxe executada com sucesso]:**
```bash
# cortar silêncios > 140 ms (ajuste o limiar ao seu ruído de sala)
ffmpeg -i voz.wav -af "silenceremove=stop_periods=-1:stop_duration=0.14:stop_threshold=-45dB" voz_cut.wav

# ducking: a trilha abaixa quando a voz fala
ffmpeg -i voz.wav -i trilha.wav -filter_complex \
 "[0:a]asplit[v1][v2];[1:a]volume=0.5[m];[m][v1]sidechaincompress=threshold=0.03:ratio=8:attack=20:release=400[duck];[v2][duck]amix=inputs=2:weights=1 0.6:normalize=0[out]" \
 -map "[out]" mix.wav

# loudness final (rode 2 passadas se quiser precisão)
ffmpeg -i mix.wav -af "loudnorm=I=-14:TP=-1.5:LRA=11" final.wav
```

---

## 8. Engenharia reversa: como reproduzir cada efeito observado

> **Importante:** não sei com que software as contas fizeram os vídeos, e não presumo. A tabela abaixo diz **como obter o mesmo resultado visual** com a **sua** stack (HTML/SVG por `render(t)` + Playwright + ffmpeg), seguindo as restrições do canal (sem filtros CSS/mix-blend no SVG; grão por PNG; sépia/desfoque/correção de cor no ffmpeg).

| Efeito observado | Onde | Como reproduzir | Estado |
|---|---|---|---|
| **Close extremo → plano geral com borrão a ~0,6 s** | V02, V04, V05, V06, V08, V09, V12 | Dois sets no mesmo `render(t)`: câmera com `z` alto até 0,55 s, corte; 2–3 quadros de borrão horizontal no mux (`gblur=sigma=40:sigmaV=0.1:enable='between(t,T,T+0.1)'` + `tblend=all_mode=average` no mesmo intervalo). | [TESTADO] sintaxe |
| **Whip com ghosting** | V08, V02, V07 | O mesmo comando acima; reduzir `sigma` e o intervalo para um whip mais suave. | [TESTADO] sintaxe |
| **Flashback sépia com moldura arredondada** | V01, V04, V08, V09, V11, V12, V14 | Máscara PNG com canto arredondado (gerada uma vez, 1080×1920) por cima; no ffmpeg: `colorchannelmixer=.393:.769:.189:0:.349:.686:.168:0:.272:.534:.131:0` por intervalo de tempo. | [TESTADO] sintaxe do sépia |
| **Vinheta radial em cena de medo** | V01, V06 | Preferir PNG radial (a skill proíbe filtros CSS); alternativa ffmpeg: `vignette=angle=PI/4:mode=backward`. | [TESTADO] sintaxe |
| **Dessaturação da tristeza** | transversal | `eq=saturation=0.35:brightness=-0.04:enable='between(t,A,B)'`. | [TESTADO] sintaxe |
| **Tela dividida / dupla camada** | V01, V03, V06, V07, V10, V12, V14 | No SVG, dois "viewports" com câmeras independentes; ou no ffmpeg `crop` + `vstack`. | [TESTADO] vstack |
| **Placa/medidor com texto vivo** | V04 (letras embaralham), V10 (relógio), V14 (visor) | Função `valor(t)` no `render(t)`; para a placa, trocar por um glifo aleatório com probabilidade `1-progresso` durante 0,4 s e fixar o texto final. Cor do medidor: interpolação verde→vermelho por `valor`. | Original |
| **Legenda "karaokê"** | todos | `words.json` gerado do `roteiro.txt` e alinhado pelas pausas reais da voz (regra do canal). Palavra ativa em dourado. | Pipeline do canal |
| **Ação de desenhar em tempo real** | V12 | Traço como `stroke-dashoffset` animado por `render(t)`; o lápis acompanha a ponta. | Original |
| **Uma foto/objeto como pista** | V11 (foto cortada), V06 (foto tremida) | Mesmo objeto, mesma posição e escala em todas as aparições (checklist: continuidade). | Original |
| **Multidão (estádio)** | V09, V13 | Instâncias repetidas de SVG com cor e pose variadas; evitar clones idênticos. | Original |

---

## 9. Ciclo de produção (resumo operacional)

1. **Memória e checklist:** ler `/topics/feedback-animacoes-checklist.md` e o histórico (regra do canal) e mostrar a lista ao usuário para confirmar. *(Esse arquivo de memória não existia no repositório desta sessão; se ele estiver só no seu ambiente, forneça-o.)*
2. **Premissa:** checar contra a lista de premissas usadas (seção 2).
3. **Ficha da história:** regra, medidor, ferida, gatilho, tabela de plantio/pagamento, virada, final em imagem.
4. **Roteiro com orçamento de palavras** (seção 4).
5. **Prévia em imagens** aprovada antes de animar (regra do canal).
6. **Áudio** → words.json → **animação** → **mux** (whip, íris, fade).
7. **QA automático:** `python3 docs/analise/ferramentas/qa_video.py final.mp4`.
8. **Revisão quadro a quadro** (0,1 s nas cenas críticas) e checklist do documento 04.
9. **Relatório de melhorias** em relação ao vídeo anterior (regra do canal), baseado no scorecard (seção 12).

---

## 10. Plano de aprendizado: separar gênero de causa

Sem métricas, nada aqui é prova. Quando você publicar, **varie uma coisa por vez** e guarde os números.

| Variável | A | B | Métrica |
|---|---|---|---|
| Gancho | Promessa pessoal + objeto (seção 3.2) | Regra falada primeiro | Retenção aos 3 s, 15 s e 30 s |
| Momento do gatilho | ≈ 20 s | ≈ 35 s | Queda de retenção entre 15 e 45 s |
| Duração | ≤ 100 s | 120 s | % que chega ao fim; reprise |
| Final | Imagem + frase curta | Frase de fechamento maior | Comentários que citam a imagem; compartilhamentos |
| Ritmo | Mediana 1,2 s | Mediana 1,8 s | Retenção por segundo na escalada |
| Trilha | Só cenas-chave | Contínua e baixa | Retenção ao redor das cenas-chave |

**Registro por vídeo:** retenção por segundo, % assistido, reprise, compartilhamentos, comentários; e a ficha de plantio/pagamento. **Critério de decisão:** só adote uma mudança se ela melhorar em ≥ 3 vídeos.

---

## 11. Roteiro-modelo original de 120 s: "A Última Música"

> Premissa **original**, criada para este guia e conferida contra as 14 referências (nenhuma usa transparência por espera). **É uma proposta**: valide com o usuário antes de produzir.

**Regra do mundo:** na rua da Ísis, quem espera alguém vai ficando transparente, uma parte do corpo por hora. **Medidor visível:** a **opacidade** do corpo (e a luz atravessando).
**Ferida:** o pai caminhoneiro prometeu chegar antes da última música do recital.
**Elenco novo:** Ísis (9 anos, flauta doce, trança com fita amarela); pai, seu Genaro (caminhoneiro, bigode grisalho, boné); vó Cota (óculos, coque); Bento (10 anos, vizinho, camiseta de time de várzea, sempre opaco); dona Marlene, a professora; dona Odete, a padeira vizinha (avental que flutua).

| Tempo | Batida | Imagem | Fala-âncora (rascunho) |
|---|---|---|---|
| 0:00–0:06 | Gancho | Close da mão da Ísis segurando a flauta contra a janela; a luz atravessa os dedos. Corte com borrão para a sala: relógio, cadeira vazia. | "Meu pai prometeu chegar antes da última música. Faltavam três horas, e eu já estava ficando transparente." |
| 0:06–0:18 | Regra + exemplos | Rua: o avental da dona Odete flutua sozinho, com uma flor presa no bolso (**plantio**). Um carteiro "vira vidro" até o cotovelo. | "Na minha rua, quem espera vai sumindo: uma hora, a mão; duas, o braço." |
| 0:18–0:30 | Protagonista | Ísis sentada com a flauta; a vó trançando o cabelo (a mão atravessa de leve); Bento, **sempre opaco**, passa com uma bola. | "Eu sou a Ísis, tenho nove anos e toco flauta mal. Meu pai dirige caminhão e diz 'daqui a pouquinho'." |
| 0:30–0:40 | Gatilho + pergunta | Cartaz do recital; a "última música" circulada em vermelho; relógio da cozinha. | "Escolhi a última música para ele chegar a tempo de ouvir." |
| 0:40–1:15 | **3 tentativas** (refrão "daqui a pouquinho") | (1) A vó tenta segurá-la e a mão passa; (2) ensaia no espelho: o espelho mostra só a flauta; (3) liga para o pai, caixa postal com a voz dele: "daqui a pouquinho". Cada vez, mais transparente (cotovelo, ombro, peito). | "Daqui a pouquinho." (3×) |
| 1:15–1:28 | **Ponto mais baixo** | Na escola, a professora chama a chamada e **pula o nome dela**; a lista tem um espaço em branco; hold de 3 s no corredor vazio, sem música. | "A professora não me viu. Riscou meu nome." |
| 1:28–1:40 | **Virada** | Bento, na primeira fila, olha direto para o lugar dela e diz "Eu vejo você". A cor volta do punho. **Pagamento:** a dona Odete está sentada ao lado dele na plateia (ele é quem põe a flor no bolso do avental dela toda tarde). | "A espera só apaga quem espera sozinho." |
| 1:40–1:52 | Ação física | Ísis sobe ao palco e toca; Bento, a vó e a dona Odete são a plateia. A porta do fundo abre: o pai, **transparente até o ombro**, ofegante (quem corre para chegar também espera). | (Silêncio; só a flauta.) |
| 1:52–2:00 | Final em imagem | Ela toca olhando para ele; a cor volta do ombro à mão dele. Último plano: a mão dela contra a janela, **agora fazendo sombra** (eco do gancho). | "Hoje a minha mão faz sombra." |

**Plantio e pagamento:** (1) flor no avental → Bento; (2) Bento sempre opaco → "só apaga quem espera sozinho"; (3) mão contra a janela → sombra; (4) "daqui a pouquinho" ×3 → o pai chega de verdade.
**Culpa do herói (opcional, versão 2):** no ato 1, Ísis diz ao Bento que ele "nunca espera ninguém" (e magoa).
**Final inesperado e feliz:** o pai também estava transparente. O reencontro é recíproco.

### Duas sementes adicionais (esboço)
- **O Bolso dos Obrigados:** o "obrigado" não dito vira pedra no bolso; medidor = a calça que arria e a coluna do menino; plantio = o sapateiro de prateleira cheia de pedras; final = as pedras entregues viram sementes e a rua floresce.
- **A Sombra que Chega Primeiro:** a sombra chega à escola 5 min antes e mostra o humor real; a protagonista esconde a tristeza no rosto, mas a sombra chora; plantio = a sombra do zelador sempre com a mão no ombro de outras sombras; final = a sombra dela chega sorrindo, e o motivo é a mão do zelador.

---

## 12. Scorecard por vídeo (para evoluir a cada entrega)

Pontue 0–2 (0 = ausente, 1 = parcial, 2 = forte) e registre a nota ao lado da versão anterior. A meta é **nunca cair** em um critério e **subir pelo menos um** a cada vídeo novo.

| Critério | Pergunta |
|---|---|
| Gancho | O problema fica visível em ≤ 3 s sem explicação? |
| Gatilho | Aparece até ~30 s? |
| Medidor | Existe um objeto que mostra a regra? |
| Plantar/pagar | Cada plantio tem pagamento? |
| Refrão | Há uma frase de 3× que muda de sentido? |
| Dano do herói | O herói contribui para o problema? |
| Virada | Reinterpreta o que já vimos (sem fato novo)? |
| Ação física | O clímax é um gesto sem fala? |
| Final | Imagem + frase curta, sem moral? |
| Atuação | Troca de expressão a cada 0,3–0,5 s; olhar com alvo? |
| Continuidade | Escalas, posições e mãos consistentes? |
| Áudio | Pausa dramática só antes da frase-chave; trilha com ducking? |

**Lista de melhorias entregues** (regra do canal): ao fim de cada vídeo, escrever 3–6 linhas "melhorou X em relação ao vídeo Y".
