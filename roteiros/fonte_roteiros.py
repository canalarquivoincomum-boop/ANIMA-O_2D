# Fonte única dos dois roteiros. Gera: gravacao_*.txt, roteiro_*.json e as contagens usadas nos .md.
# Cada linha: (id, ato, quem, texto, pausa_antes_s, direcao)
import json, re
WPM = 165  # ritmo-alvo de narração (palavras/min); a voz real do usuário define o tempo final

R1 = {"titulo": "Pedido Fantasma", "slug": "pedido_fantasma", "linhas": [
 ("L01","1 GANCHO","N","Onze e quarenta e sete da noite. Chegou um pedido.",0.0,"seco, direto, sem preparar"),
 ("L02","1 GANCHO","N","Rua das Acácias, número catorze.",0.25,"leve estranhamento"),
 ("L03","1 GANCHO","N","Só que a casa catorze foi demolida há trinta anos.",0.30,"cai a voz em 'demolida'"),
 ("L04","2 APOSTA","N","O aplicativo deu onze minutos.",0.40,"neutro, informativo"),
 ("L05","2 APOSTA","N","Cancelar custava a minha semana inteira.",0.20,"pesa em 'semana inteira'"),
 ("L06","2 APOSTA","N","E o aluguel vencia na sexta.",0.30,"cansaço"),
 ("L07","3 CAMINHO","N","Eu fui.",0.45,"decidido, curto"),
 ("L08","3 CAMINHO","N","No caminho, abri o histórico daquele endereço.",0.30,"curiosidade"),
 ("L09","3 CAMINHO","N","Onze pedidos, todos cancelados.",0.30,"cada palavra separada"),
 ("L10","3 CAMINHO","N","Mesmo endereço, mesmo dia, uma vez por ano.",0.20,"acelera e freia no fim"),
 ("L11","3 CAMINHO","N","E hoje era doze de outubro.",0.30,"baixa, quase sussurro"),
 ("L12","4 CHEGADA","N","Cheguei com um minuto e meio de sobra.",0.45,"aliviado, ofegante"),
 ("L13","4 CHEGADA","N","Era só mato alto e um portão sem casa.",0.30,"descrição seca"),
 ("L14","4 CHEGADA","N","E lá no fundo, uma luz acesa.",0.35,"suspende no 'acesa'"),
 ("L15","5 REVELAÇÃO","N","Uma mesa posta pra dois.",0.55,"devagar"),
 ("L16","5 REVELAÇÃO","N","E uma senhora, olhando o relógio.",0.35,"devagar; pausa longa depois"),
 ("L17","5 REVELAÇÃO","DONA CIDA","Você demorou.",0.65,"voz de senhora, calma, sem raiva"),
 ("L18","6 CONFLITO","N","Mostrei o celular. Disse que ali não existia casa.",0.50,"sem graça, educado"),
 ("L19","6 CONFLITO","DONA CIDA","Existe pra mim. A cozinha era ali.",0.30,"firme e doce"),
 ("L20","6 CONFLITO","N","Ela apontou a parede do vizinho: o azulejo, a mancha do forno, a marca da escada.",0.30,"olhando, descobrindo"),
 ("L21","6 CONFLITO","DONA CIDA","Senta. Falta um minuto.",0.30,"convite, não ordem"),
 ("L22","6 CONFLITO","N","O relógio do aplicativo contava. Eu podia entregar e ir embora, ou sentar e deixar vencer.",0.30,"dilema; a última frase mais baixa"),
 ("L23","6 CONFLITO","N","Eu sentei.",0.55,"pausa longa antes; simples"),
 ("L24","7 PISTAS","N","Na cadeira vazia, uma caixa fechada, com laço.",0.40,"curioso"),
 ("L25","7 PISTAS","DONA CIDA","Meu marido, o Zé, chegava em seis minutos. Você levou nove e meio.",0.30,"um sorriso na voz"),
 ("L26","7 PISTAS","DONA CIDA","Primeiro entregador do Forno Vivo. Saiu daqui às onze e quarenta e sete, em noventa e quatro. De capacete rachado.",0.30,"vai ficando grave; 'rachado' quase sem voz"),
 ("L27","7 PISTAS","N","Olhei o meu capacete: a fita isolante segurando a rachadura.",0.55,"percebendo"),
 ("L28","8 VIRADA","DONA CIDA","Faz onze anos que eu peço uma pizza pra cá. Onze rapazes cancelaram.",0.50,"sem acusar"),
 ("L29","8 VIRADA","DONA CIDA","Eu não quero a pizza. Eu procuro quem chegue.",0.35,"a frase central; devagar"),
 ("L30","8 VIRADA","DONA CIDA","O Forno Vivo é meu. Entregador nosso tem salário fixo, plano de saúde e capacete que não racha.",0.35,"leve, quase brincando"),
 ("L31","8 VIRADA","N","O celular vibrou. Pedido expirado. Menos trezentos e quarenta.",0.50,"engole seco"),
 ("L32","8 VIRADA","DONA CIDA","Esse eu pago em dobro. Abre a caixa.",0.35,"calor"),
 ("L33","9 FINAL","N","Na sexta, paguei o aluguel com o primeiro salário fixo da minha vida.",0.70,"voz mais aberta, sorrindo"),
 ("L34","9 FINAL","N","Guardei o capacete velho. Com a fita e tudo.",0.30,"carinho"),
 ("L35","9 FINAL","N","No ano seguinte, no mesmo terreno: um forno, mesa pra dois e um capacete na cadeira.",0.40,"imagem; sem pressa"),
 ("L36","9 FINAL","N","A casa catorze voltou.",0.60,"a última; deixa cair"),
]}

R2 = {"titulo": "O Prédio das 21 Pizzas", "slug": "predio_21_pizzas", "linhas": [
 ("M01","1 GANCHO","N","Sexta, onze da noite. O aplicativo me mandou vinte e uma pizzas.",0.0,"incrédulo, rápido"),
 ("M02","1 GANCHO","N","Para o mesmo prédio. O mesmo apartamento. Oitenta e dois.",0.25,"cada item separado"),
 ("M03","2 APOSTA","N","Quarenta minutos para entregar tudo. E o elevador estava quebrado.",0.40,"ritmo de contagem"),
 ("M04","2 APOSTA","N","Meu baú leva três pizzas. Oito andares de escada. Sete viagens.",0.25,"fazendo a conta"),
 ("M05","2 APOSTA","N","A minha nota era quatro vírgula cinquenta e dois. Abaixo de quatro e meio, o aplicativo me tirava da noite.",0.30,"o risco, sem drama"),
 ("M06","2 APOSTA","N","Subi.",0.45,"curto, decidido"),
 ("M07","3 ESCALADA","N","Na primeira viagem, o porteiro riu: o oitenta e dois é do seu Aníbal, e ninguém fala com ele.",0.40,"divertido"),
 ("M08","3 ESCALADA","N","Bati duas vezes, como pedia o pedido: ele escuta mal.",0.30,"ofegante"),
 ("M09","3 ESCALADA","N","Ninguém abriu.",0.35,"seco"),
 ("M10","3 ESCALADA","N","Na terceira viagem, vi o bilhete preso numa das caixas.",0.45,"ofegante, curioso"),
 ("M11","3 ESCALADA","VIZINHA","Obrigada pela torneira, seu Aníbal. Dona Lúcia, apartamento trinta e um.",0.30,"lendo o bilhete, voz suave"),
 ("M12","3 ESCALADA","N","Todas as caixas tinham bilhete, cada um com uma letra: pelo chuveiro, pela luz da escada, pelo berço.",0.30,"lendo rápido, descobrindo"),
 ("M13","3 ESCALADA","N","Alguém ali devia muito àquele homem. E ninguém tinha coragem de dizer.",0.40,"pensativo"),
 ("M14","4 PRESSÃO","N","Na sexta viagem, faltavam quatro minutos e a porta seguia fechada. As minhas pernas tremiam.",0.50,"exausto, acelerando"),
 ("M15","4 PRESSÃO","N","Foi aí que eu vi a campainha. Um fio solto, pendurado, e uma fita velha: quebrada, bata na porta.",0.35,"descobrindo"),
 ("M16","4 PRESSÃO","N","E, na porta, um cartaz desbotado: conserto de tudo, grátis, toque a campainha.",0.30,"lendo devagar"),
 ("M17","4 PRESSÃO","N","O homem que consertava tudo nunca teve a campainha consertada. E por isso ninguém ia pedir nada.",0.45,"a frase-chave; devagar"),
 ("M18","5 VIRADA","N","No meu capacete tem fita isolante há dois anos. Eu emendei o fio com ela.",0.55,"mão na massa, rápido"),
 ("M19","5 VIRADA","N","Apertei o botão.",0.50,"quase sussurro"),
 ("M20","5 VIRADA","N","Dim-dom.",0.70,"o som, simples"),
 ("M21","5 VIRADA","N","Das escadas, dos andares de cima e de baixo, saíram vinte e uma pessoas, cada uma com um prato.",0.55,"surpresa crescendo"),
 ("M22","5 VIRADA","N","Ninguém tinha pedido pizza pra comer. Pediram pra ter um motivo de bater naquela porta.",0.40,"a descoberta; devagar"),
 ("M23","5 VIRADA","N","Seu Aníbal abriu. Ficou parado. Fazia onze anos que ninguém tocava aquela campainha.",0.45,"terno"),
 ("M24","5 VIRADA","SEU ANÍBAL","Eu estava esperando alguém tocar.",0.50,"voz de velho, emocionado, baixa"),
 ("M25","6 FINAL","N","O celular vibrou: vinte e uma avaliações, todas de cinco estrelas. Nota: quatro vírgula nove.",0.65,"alegria contida"),
 ("M26","6 FINAL","N","No sábado, o cartaz mudou. Toque a campainha. Ela funciona.",0.60,"a última; deixa cair"),
]}

def stats(R):
    out=[]; t=0.0; total_words=0
    for (i,ato,q,tx,p,d) in R["linhas"]:
        w=len(re.findall(r"\S+",tx)); dur=w/WPM*60; p=round(max(p*0.8,0.0),2) if p<0.6 else round(p*0.85,2); t+=p; out.append((i,ato,q,tx,p,d,w,round(t,1),round(t+dur,1))); t+=dur; total_words+=w
    return out,total_words,round(t,1)

for R in (R1,R2):
    rows,tw,total=stats(R); R["rows"]=rows; R["palavras"]=tw; R["duracao_est"]=total
    with open(f"gravacao_{R['slug']}.txt","w",encoding="utf-8") as f:
        f.write(f"{R['titulo'].upper()} — TEXTO PARA GRAVAÇÃO\n")
        f.write(f"{tw} palavras · duração estimada {total:.0f} s a {WPM} palavras/min\n")
        f.write("Como gravar: leia uma linha por vez, com um respiro natural entre as linhas; [pausa] = deixe 0,3–0,7 s de silêncio de verdade; (direção) não se lê.\n")
        f.write("As falas de personagens estão marcadas: grave com a voz indicada (pode ser a mesma voz, mudando só o tom).\n"+"-"*78+"\n")
        ato=None
        for (i,a,q,tx,p,d,w,t0,t1) in R["rows"]:
            if a!=ato: f.write(f"\n== ATO {a} ==\n"); ato=a
            if p>=0.45: f.write("[pausa]\n")
            tag="" if q=="N" else f"{q}: "
            f.write(f"{i}  {tag}{tx}   ({d})\n")
    json.dump({"titulo":R["titulo"],"palavras":tw,"duracao_est_s":total,"linhas":[{"id":i,"ato":a,"quem":q,"texto":tx,"pausa":p,"direcao":d,"inicio_est":t0,"fim_est":t1} for (i,a,q,tx,p,d,w,t0,t1) in R["rows"]]},open(f"roteiro_{R['slug']}.json","w",encoding="utf-8"),ensure_ascii=False,indent=1)
    print(R["titulo"],"→",tw,"palavras,",total,"s estimados")
    # marcos
    for (i,a,q,tx,p,d,w,t0,t1) in R["rows"]:
        if a.startswith(("1","2")) and i in ("L03","M02","L06","M06"): print("  gancho/aposta termina em",t1,"s")
json.dump({R["slug"]:{"palavras":R["palavras"],"duracao":R["duracao_est"],"marcos":{r[0]:(r[7],r[8]) for r in R["rows"]}} for R in (R1,R2)},open("_marcos.json","w"),ensure_ascii=False)
