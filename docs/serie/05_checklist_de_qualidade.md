# Checklist de qualidade — porta de entrega de cada episódio

Marque cada item. **Um episódio com item vermelho não é entregue.**

## Roteiro
- [ ] `checar_roteiro.py` sem erros; avisos entendidos
- [ ] Gancho ≤ 6 s com hora/endereço/número visível
- [ ] Aposta concreta + cronômetro; virada entre 70% e 80%; final por **escolha** do Nando
- [ ] Toda pista plantada foi **paga**; sem moral explícita nem "inscreva-se"
- [ ] Seção **"Herda do cânone"** preenchida; ≥ 1 referência **visual** a episódio anterior; funciona sozinho
- [ ] Datas e dias da semana coerentes com o cânone e entre texto, tela do app e calendário

## Imagem
- [ ] Cada frase mostra literalmente o que diz (conferir frase × imagem)
- [ ] Nenhum plano parado; plano > 4 s só com peso emocional; mediana de plano ≈ 1,7 s
- [ ] Escala certa (sem gigantes/miniaturas), perspectiva coerente
- [ ] Sem "atravessar" objeto, nada flutuando, mão nunca acima do queixo, passos reais
- [ ] Texto em cena legível, não espelhado, dentro da caixa; números sem sobreposição
- [ ] Legenda no rodapé sem cobrir rosto/objeto; ação acima de y≈760
- [ ] Capacete: mesma forma e **fita**; Nando igual aos episódios anteriores (`referencias/elenco.jpg`)
- [ ] Revelações só **depois** de o Nando perceber; boca só mexe em quem fala em cena
- [ ] `regressao_visual.py` sem mudança não intencional nos episódios antigos

## Áudio
- [ ] Voz Lax, uma geração; −14 LUFS, pico ≤ −1 dBFS; trilha abaixa sob a voz
- [ ] Efeitos nos eventos (passos, batida, campainha, estalo da lâmpada…) sem encobrir a fala
- [ ] Sem silêncio inicial; fim com fade ≤ 0,7 s

## Entrega
- [ ] `qa_video.py` sem falhas (avisos justificados no documento do episódio)
- [ ] 1080×1920, 30 fps, ≤ 120 s, MP4 H.264/AAC
- [ ] `canon.json`, `03_canon_e_continuidade.md` e README atualizados; commit e push
