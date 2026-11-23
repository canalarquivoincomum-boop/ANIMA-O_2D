import json, re
exec(open("fonte_roteiros.py").read().split("for R in (R1,R2):")[0])   # reusa R1, R2, stats
for R in (R1,R2):
    rows,tw,total=stats(R); R["rows"]=rows; R["palavras"]=tw; R["duracao_est"]=total

V1 = {
"L01":"CLOSE do celular no guidão: tela de bloqueio 23:47 (já mostra a hora); estala a notificação ZAP e o aparelho vibra.",
"L02":"O card do pedido: restaurante FORNO VIVO, 1 pizza grande, 'sem cebola', **Rua das Acácias, 14** destacado.",
"L03":"Mapa: lote hachurado 'TERRENO' com o pino 14 e o aviso vermelho 'Imóvel demolido em 1994'. Corte: Nando lê, sobrancelha sobe.",
"L04":"Cronômetro do app em tela cheia: **11:00** e o anel começa a girar (o 'medidor' da série).",
"L05":"Popup: 'Cancelar entrega? − R$ 340,00 (a sua semana inteira)'. O polegar paira sobre CANCELAR.",
"L06":"Do bolso do casaco, um papel: AVISO DE VENCIMENTO · ALUGUEL · vence SEXTA · carimbo ÚLTIMO AVISO.",
"L07":"Nando fecha a viseira (**o capacete mostra a rachadura segurada com fita isolante**), gira o punho; a moto arranca com whip.",
"L08":"Corrida lateral na rua noturna, postes passando; celular no guidão abre o histórico ('Carregando…').",
"L09":"Lista do histórico: 11 linhas CANCELADO entram uma a uma, em sincronia com 'onze pedidos'.",
"L10":"Zoom nas datas: 12/10/2014, 12/10/2015 … o mesmo dia repetido.",
"L11":"Barra de status do celular: 'sexta, 12 de outubro'. Selo HOJE · 12 OUT.",
"L12":"Moto chega devagar; selo do cronômetro **01:30** acima do capacete.",
"L13":"Vista frontal do terreno: grade, pilar com 14, placa VENDE-SE, mato em tufos, laje vazia. A marca colorida da casa na parede do vizinho.",
"L14":"A lâmpada pisca (estalo, zumbido) e acende lá no fundo. Câmera empurra devagar.",
"L15":"A mesa sob a luz: dois pratos, **uma caixa com laço na cadeira vazia**, vela, caixa 'Forno Vivo — sem cebola'.",
"L16":"CORTE para a dona Cida de perto, **olhando o relógio de pulso** (antebraço levantado na frente do peito, cabeça inclinada).",
"L17":"Reação do Nando (susto, viseira levantada). Corte: Cida olha **para a câmera** e fala; a boca só mexe aqui.",
"L18":"Nando mostra a tela do celular (mapa do terreno) para ela; ela nem olha.",
"L19":"Cida se levanta devagar e **aponta** a parede do vizinho.",
"L20":"Câmera vai da mão dela à parede: azulejo branco-azul, mancha escura do forno, marca diagonal da escada, número 14 na parede.",
"L21":"Plano médio dos dois: ela puxa a cadeira com a mão; no celular dele o cronômetro marca **01:00**.",
"L22":"Insert: cronômetro 00:58, 00:57… e o polegar dele sobre ENTREGAR. Close no rosto dele: a decisão.",
"L23":"Ele **senta**, tira o capacete e põe no colo (a fita isolante fica à vista).",
"L24":"Na cadeira ao lado: uma caixa fechada com laço de fita vermelha (do tamanho de um capacete).",
"L25":"Close nela, sorrindo de lado; o relógio dela e o do app lado a lado: 00:38.",
"L26":"Foto antiga presa à parede-fantasma: um rapaz de moto com capacete **rachado** (o mesmo tipo de fita). Close na foto.",
"L27":"Close do capacete do Nando no colo: a fita isolante sobre a rachadura. Paralelo com a foto.",
"L28":"Ela abre uma caderneta: 11 nomes riscados, um por ano, com data. Câmera passa pelas páginas.",
"L29":"Close do rosto dela, olhos nele, sem piscar. Silêncio de fundo.",
"L30":"Ela tira do bolso do cardigã um **crachá FORNO VIVO · fundadora**; atrás dela, o fantasma do forno acende de leve (calor na parede).",
"L31":"Celular vibra: PEDIDO EXPIRADO − R$ 340. Close no rosto dele (engole seco). Cronômetro vermelho 00:00.",
"L32":"Ela empurra a caixa com laço para ele; ele puxa a fita: **capacete novo**, vermelho, selo de segurança.",
"L33":"Dia seguinte, sexta: ele paga o aluguel; o aviso vira ✔ PAGO; contracheque com 'salário fixo'.",
"L34":"Prateleira: o capacete velho com a fita isolante, guardado como relíquia.",
"L35":"Mesmo terreno, um ano depois, 23:47: **forno de tijolo reconstruído**, mesa para dois, um capacete na cadeira.",
"L36":"Plano final: a placa do pilar agora com a casa desenhada e o 14; a luz do app: ENTREGUE ✔.",
}
V2 = {
"M01":"CLOSE do celular: **'21 pedidos'** empilhados como cartas; o aparelho vibra sem parar.",
"M02":"Os 21 cards com o mesmo endereço: **Edifício Aurora, apto 82**. Um dedo desliza a pilha.",
"M03":"Cronômetro **40:00**. Na entrada do prédio: placa 'Elevador fora de serviço'.",
"M04":"Nando empilha 3 caixas no baú, olha a escada: oito lances. Contador na tela: 7 viagens.",
"M05":"Tela do app: nota **4,52** com a barra; faixa vermelha em 4,50 'abaixo disso, bloqueio'.",
"M06":"Ele sobe correndo; câmera acompanha pela caixa da escada, plano aéreo em espiral.",
"M07":"Porteiro rindo atrás do balcão; Nando aponta o 82; porteiro faz que não com a mão.",
"M08":"Corredor do 8º andar: porta 82 com a observação do app na tela ('bata duas vezes'); ele bate duas vezes. Ofega.",
"M09":"Plano fixo na porta fechada; olho mágico escuro. Silêncio.",
"M10":"Caixas esfriando no corredor; ele vê um papel amarelo preso por fita na caixa de cima.",
"M11":"CLOSE do bilhete, letra cursiva: 'Obrigada pela torneira, seu Aníbal. D. Lúcia, apto 31'.",
"M12":"Passada rápida por bilhetes das outras caixas, cada um com letra e cor diferentes: chuveiro, luz da escada, berço.",
"M13":"Nando sentado no degrau com os bilhetes na mão; olha para a porta 82 como quem entende.",
"M14":"Cronômetro **04:00**; ele sobe as últimas caixas, pernas tremendo (tremor de câmera, respiração pesada).",
"M15":"Ao lado da porta: botão de campainha com **fio solto pendurado** e fita velha escrita 'QUEBRADA — BATA NA PORTA'.",
"M16":"O cartaz desbotado na porta: 'CONSERTO DE TUDO · GRÁTIS · TOQUE A CAMPAINHA'; a poeira sobre o papel.",
"M17":"Close no fio solto e no cartaz alternando; ele entende o círculo vicioso.",
"M18":"Ele tira o capacete: **a fita isolante** da rachadura; corta um pedaço com os dentes e **emenda o fio**.",
"M19":"CLOSE do dedão sobre o botão, suor, cronômetro 01:12.",
"M20":"Som: DIM-DOM. Tela preta por meio segundo, a campainha vibrando em quadro.",
"M21":"Plano aberto da escada em espiral: portas abrem, vizinhos descem e sobem, cada um com um prato.",
"M22":"Cada pessoa com o bilhete correspondente na mão; passa pelos rostos (D. Lúcia, o casal do 61, a menina do berço).",
"M23":"A porta 82 se abre: seu Aníbal, 80 anos, pijama, **cinto de ferramentas** pendurado atrás da porta; ele não se mexe.",
"M24":"Close nele, olhos úmidos; a campainha ainda ressoa ao fundo.",
"M25":"Celular de Nando: 21 estrelas de cinco, nota **4,90**; selo ENTREGUE ✔ vira verde.",
"M26":"Sábado, manhã, plano frontal da porta 82: o cartaz novo, escrito à mão: 'TOQUE A CAMPAINHA. ELA FUNCIONA.'",
}
P1 = [
("Forno Vivo (nome do restaurante no card, L01–L02)","Aparece como detalhe de app e na caixa de pizza","L30: o Forno Vivo é dela","O app que a gente via era o negócio dela; o 'pedido fantasma' era uma seleção de entregadores"),
("Capacete rachado com fita isolante (L07, ao fechar a viseira)","Detalhe visual de um motoboy pobre","L26–L27 (a foto do Zé) e L32 (capacete novo)","O objeto que simboliza a pobreza dele vira o motivo da proteção"),
("Onze pedidos cancelados (L09–L10)","Parece uma maldição/um fantasma","L28: onze rapazes que fracassaram no teste","Não era assombração, era uma seleção"),
("Mesa posta pra dois + caixa com laço na cadeira vazia (L15, L24)","Parece prato para um morto","L32: a caixa é o capacete novo para quem chegar","O segundo prato era do entregador"),
("Hora 23:47 (L01, L26)","Hora do pedido","L26: hora em que o Zé saiu em 94","A hora do pedido é a hora do luto e do teste"),
("'Você demorou' (L17)","Soa como reprimenda","L25: Zé chegava em 6; você, nove e meio","Era o carinho e a régua do marido"),
("Parede-fantasma da casa (L13, L20)","Cenário","L20 (a cozinha) e L35 (o forno volta)","A casa volta no final"),
("Cronômetro do app (L04–L31)","Pressão","L31 vence enquanto ele escolhe ficar","A escolha de escutar custa e rende"),
]
P2 = [
("Observação 'bata duas vezes' nos 21 pedidos (M08)","Parece cuidado com o dono surdo","M17–M23: os vizinhos sabiam que a campainha não funcionava","Era uma instrução para o entregador fazer o que ninguém teve coragem"),
("Bilhetes de agradecimento nas caixas (M10–M12)","Parece cobrança ou golpe","M22: pediram pizza para ter motivo de bater na porta","O 'pedido' é uma carta"),
("Cartaz 'Toque a campainha' desbotado (M16)","Ironia","M26: cartaz novo 'Ela funciona'","O objeto fecha o círculo"),
("Fita isolante no capacete (M18, plantada na cena de abertura, quando ele tira o capacete)","Detalhe de pobreza","M18: emenda o fio da campainha","A ferramenta do herói vem do próprio improviso"),
("Elevador quebrado (M03)","Obstáculo físico","M06–M21: as escadas obrigam todo mundo a se encontrar","A escada vira o palco do encontro"),
("Nota 4,52 e limite 4,50 (M05)","Risco","M25: nota 4,90","A aposta é paga em dobro"),
("Porteiro: 'ninguém fala com ele' (M07)","Fofoca","M24: 'Eu estava esperando alguém tocar'","A solidão era dos dois lados"),
]
def tabela_linhas(R,V):
    s="| Linha | Quem | Narração (o que você grava) | Janela estimada | Imagem literal |\n|---|---|---|---|---|\n"
    for (i,a,q,tx,p,d,w,t0,t1) in R["rows"]:
        s+=f"| {i} | {'Narrador' if q=='N' else q.title()} | {tx} | {t0:.0f}–{t1:.0f} s | {V[i]} |\n"
    return s
def tabela_pistas(P):
    s="| Plantio | Como o público lê na hora | Pagamento | Novo sentido |\n|---|---|---|---|\n"
    for r in P: s+="| "+" | ".join(r)+" |\n"
    return s
open("README.md","w",encoding="utf-8").write("""# roteiros/ — protagonista fixo: Nando, o motoboy

- `00_biblia_do_nando.md`: quem é o protagonista, o que se repete em toda história e as regras da série.
- `01_pedido_fantasma.md` e `02_predio_das_21_pizzas.md`: os dois roteiros, com a imagem de cada frase, as pistas e o que precisa ser construído.
- `gravacao_pedido_fantasma.txt` e `gravacao_predio_21_pizzas.txt`: **os textos para você gravar** (um arquivo por história).
- `roteiro_*.json`: os mesmos textos para o meu pipeline (alinhamento por palavra).
- `fonte_roteiros.py`: fonte única; qualquer edição de texto sai daqui, então os números dos documentos nunca divergem.
""")
open("00_biblia_do_nando.md","w",encoding="utf-8").write("""# Bíblia do Nando (protagonista fixo)

## Quem é
**Nando, 19 anos, motoboy noturno** de entregas de um aplicativo chamado ZAP. Mora de aluguel e vive de gorjeta e de nota. Ele **escuta**: o canal é Escuta Só, e o que o diferencia dos outros entregadores é que ele **para e escuta** a pessoa na porta.

## O que se repete em TODA história (assinatura da série)
1. **O aplicativo é o medidor visível.** Toda história abre com uma notificação do ZAP e tem um **cronômetro** que acompanha a tensão. Ele funciona como o 'medidor' dos 14 vídeos de referência: o público lê o drama sem precisar de narração.
2. **Uma aposta concreta de dinheiro ou de nota** (a semana, o aluguel, a nota 4,5). O Nando sempre tem algo a perder.
3. **O capacete rachado com fita isolante.** A fita resolve um problema na história (plantio e pagamento). Na história 1 ele ganha um capacete novo; a fita velha é guardada como relíquia.
4. **Uma pessoa na porta que ninguém escuta.** A virada é sempre sobre alguém que parecia o problema e era a solução.
5. **O final feliz inesperado vem de uma ESCOLHA dele** (ficar, tocar, sentar), nunca de sorte.
6. **Última imagem: o app marca ENTREGUE ✔**, e a frase final é curta.

## Personalidade (para a atuação)
Cansado mas gentil; fala pouco; ironia seca na narração; no rosto, a sobrancelha esquerda sobe quando desconfia. **Nunca** vira herói de ação: resolve com atenção.

## Regras de produção
- Gancho em até 6 s com **hora/endereço/contagem** na tela. Sem "Nesta cidade…".
- Gatilho até ~30 s, virada entre 70% e 80% do tempo, final em imagem.
- Mundo: **cidade à noite** com luz de poste; escala real (bíblia de escala do motor).
- Moto: perfil de piloto próprio, baú ZAP preso ao bagageiro.
- A legenda fica no rodapé, sobre a rua; a ação fica acima de 75% da altura.
- **Personagens secundários sentados** (dona Cida, seu Aníbal) seguem a regra: tronco desce junto com o quadril e **a mão nunca sobe acima do queixo** (a cabeça cobre o braço).

## Elenco recorrente
Nando · o porteiro · a dona Cida (história 1) · seu Aníbal e os vizinhos (história 2). Novos personagens entram a cada história; o Nando é o fio.
""")
for R,V,P,fn,logline,extra in [
 (R1,V1,P1,"01_pedido_fantasma.md","Nando recebe um pedido para uma casa que foi demolida há 30 anos. A entrega vale a semana dele. No terreno vazio há uma mesa posta e uma senhora esperando por alguém que **chegue**.",
  "**Surpresa:** a mulher que o público achava ser uma viúva fantasmagórica é a **dona do restaurante** e usa o 'pedido impossível' como teste para encontrar quem se importe. **Final feliz:** emprego com salário fixo, capacete novo e a casa 14 reconstruída como forno."),
 (R2,V2,P2,"02_predio_das_21_pizzas.md","O aplicativo manda ao Nando 21 pizzas para o mesmo apartamento de um prédio sem elevador, com 40 minutos para entregar. A nota dele está no limite.",
  "**Surpresa:** ninguém queria comer: os 21 vizinhos pediram pizza para ter um **motivo de bater** na porta do homem que conserta tudo e nunca teve a própria campainha consertada. **Final feliz:** o Nando conserta a campainha com a fita do capacete e a nota sobe.")]:
    t=f"# {R['titulo']}\n\n**{R['palavras']} palavras · ≈ {R['duracao_est']:.0f} s a 165 palavras/min** (a 180 palavras/min: ≈ {R['duracao_est']*165/180:.0f} s). Meta do canal: ≤ 120 s.\n\n"
    t+=f"## Premissa\n{logline}\n\n{extra}\n\n"
    t+="## Estrutura (pelo estudo das 14 referências)\n"
    m={r[0]:(r[7],r[8]) for r in R["rows"]}; d=R["duracao_est"]
    if R is R1:
        t+=f"| Função | Linhas | Janela | % |\n|---|---|---|---|\n| Gancho (hora + endereço + impossível) | L01–L03 | 0–{m['L03'][1]:.0f} s | 0–{m['L03'][1]/d*100:.0f}% |\n| Aposta (prazo + dinheiro) | L04–L06 | até {m['L06'][1]:.0f} s | {m['L06'][1]/d*100:.0f}% |\n| Pergunta aberta (11 cancelados) | L08–L11 | até {m['L11'][1]:.0f} s | {m['L11'][1]/d*100:.0f}% |\n| **Gatilho: a luz e a senhora** | L14–L17 | {m['L14'][0]:.0f}–{m['L17'][1]:.0f} s | {m['L17'][1]/d*100:.0f}% |\n| Conflito: ficar ou entregar | L18–L23 | até {m['L23'][1]:.0f} s | {m['L23'][1]/d*100:.0f}% |\n| Pistas | L24–L27 | até {m['L27'][1]:.0f} s | {m['L27'][1]/d*100:.0f}% |\n| **Virada** | L28–L32 | {m['L28'][0]:.0f}–{m['L32'][1]:.0f} s | {m['L28'][0]/d*100:.0f}–{m['L32'][1]/d*100:.0f}% |\n| Final | L33–L36 | até {d:.0f} s | 100% |\n\n"
    else:
        t+=f"| Função | Linhas | Janela | % |\n|---|---|---|---|\n| Gancho (21 pizzas, mesmo apartamento) | M01–M02 | 0–{m['M02'][1]:.0f} s | {m['M02'][1]/d*100:.0f}% |\n| Aposta (40 min, elevador quebrado, nota) | M03–M06 | até {m['M06'][1]:.0f} s | {m['M06'][1]/d*100:.0f}% |\n| Escalada (viagens, bilhetes) | M07–M13 | até {m['M13'][1]:.0f} s | {m['M13'][1]/d*100:.0f}% |\n| Pressão (4 min, campainha quebrada) | M14–M17 | até {m['M17'][1]:.0f} s | {m['M17'][1]/d*100:.0f}% |\n| **Virada** | M18–M24 | {m['M18'][0]:.0f}–{m['M24'][1]:.0f} s | {m['M18'][0]/d*100:.0f}–{m['M24'][1]/d*100:.0f}% |\n| Final | M25–M26 | até {d:.0f} s | 100% |\n\n"
    t+="## Texto e imagem, frase a frase\nCada imagem mostra **literalmente** o que a frase diz (regra aprendida no v3).\n\n"+tabela_linhas(R,V)+"\n"
    t+="## Plantio e pagamento\n"+tabela_pistas(P)+"\n"
    t+="## Como gravar\n- Texto limpo, sem direção: `gravacao_"+R['slug']+".txt`. Leia uma linha por vez.\n- As falas de personagem podem ser a mesma voz com outro tom.\n- Pausas marcadas `[pausa]` são **de verdade** (0,4–0,7 s); fora delas, corto qualquer silêncio > 140 ms.\n- Grave cada ato em takes separados; o ruído de sala deve ser constante.\n\n"
    open(fn,"w",encoding="utf-8").write(t)
print("ok")
