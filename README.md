# ANIMA-O_2D

## Estudo avançado — vídeos de referência

Análise de 14 animações verticais de referência (o pedido citava 10) e guia de produção para novas animações originais.

Leia nesta ordem:

1. [`docs/analise/00_metodologia_e_limites.md`](docs/analise/00_metodologia_e_limites.md): o que foi acessado, o que é observação, medição ou hipótese, e o que não foi possível medir.
2. [`docs/analise/01a_analises_individuais_V01-V07.md`](docs/analise/01a_analises_individuais_V01-V07.md) e [`01b`](docs/analise/01b_analises_individuais_V08-V14.md): análise por cena e timestamp de cada vídeo.
3. [`docs/analise/02_comparacao_tecnicas_e_oportunidades.md`](docs/analise/02_comparacao_tecnicas_e_oportunidades.md): padrões, diferenças, pontos fracos e oportunidades.
4. [`docs/analise/03_guia_mestre_producao.md`](docs/analise/03_guia_mestre_producao.md): guia mestre, roteiro-modelo original de 120 s e plano de teste.
5. [`docs/analise/04_checklist_qualidade.md`](docs/analise/04_checklist_qualidade.md): checklist de detecção e correção de erros.

Ferramenta: [`docs/analise/ferramentas/qa_video.py`](docs/analise/ferramentas/qa_video.py) (QA automático de um MP4). Dados: [`docs/analise/dados/metricas_por_video.csv`](docs/analise/dados/metricas_por_video.csv).

## Produção — "A Última Música"

Da teoria à prática: regras de domínio visual, roteiro original, storyboard técnico de 52 planos e **piloto renderizado** (0–29,8 s) com validação.

- [`docs/producao/05_dominio_visual.md`](docs/producao/05_dominio_visual.md): regras técnicas consolidadas.
- [`docs/producao/06_roteiro_original.md`](docs/producao/06_roteiro_original.md): roteiro com tabela de pistas.
- [`docs/producao/07_storyboard_tecnico.md`](docs/producao/07_storyboard_tecnico.md): storyboard plano a plano.
- [`docs/producao/08_validacao_piloto.md`](docs/producao/08_validacao_piloto.md): comparação com as referências, falhas e correções.
- [`producao/`](producao/): motor, áudio e o piloto em MP4.

### v2 — autoavaliação, Coco e melhorias
- [`docs/producao/09_autoavaliacao_v1.md`](docs/producao/09_autoavaliacao_v1.md): crítica do v1, com métrica de fluidez a câmera congelada.
- [`docs/producao/10_coco_personagem_fixo.md`](docs/producao/10_coco_personagem_fixo.md): o personagem fixo.
- [`docs/producao/11_autoavaliacao_v2.md`](docs/producao/11_autoavaliacao_v2.md): resultados do v2 e plano do v3.

### v3 — reinício após as críticas
- [`docs/producao/12_reboot_v3_pedido_fantasma.md`](docs/producao/12_reboot_v3_pedido_fantasma.md): diagnóstico, bíblia de escala, roteiro "Pedido Fantasma" e autocrítica.
- Piloto: `producao/v3/piloto_v3_pedido_fantasma_1080x1920.mp4`; conferência frase × imagem: `producao/v3/narracao_x_imagem.jpg`.

### v4 — revisão após o feedback do v3
- [`docs/producao/13_revisao_v4.md`](docs/producao/13_revisao_v4.md): o que foi corrigido (piloto na moto, capacete, casa demolida, Cida, legenda, profundidade, bugs).
- Vídeo: `producao/v3/piloto_v4_pedido_fantasma_1080x1920.mp4`.

### v5 — profundidade de campo, moto remontada, gancho da idosa
- [`docs/producao/14_revisao_v5.md`](docs/producao/14_revisao_v5.md). Vídeo: `producao/v3/piloto_v5_pedido_fantasma_1080x1920.mp4`.

### Protagonista fixo e roteiros
- [`roteiros/`](roteiros/): bíblia do Nando e dois roteiros completos com texto para gravação.
- [`docs/producao/15_correcao_dona_cida_e_roteiros.md`](docs/producao/15_correcao_dona_cida_e_roteiros.md): conserto do personagem sentado e resumo.

### Produção completa — as duas histórias do Nando, com a voz Lax (ElevenLabs)
- [`docs/producao/16_producao_completa_pedido_fantasma_e_21_pizzas.md`](docs/producao/16_producao_completa_pedido_fantasma_e_21_pizzas.md): voz, alinhamento, planos, ganchos, verificação e limites.
- Vídeos: [`producao/s1/pedido_fantasma_1080x1920.mp4`](producao/s1/pedido_fantasma_1080x1920.mp4) (106 s) e [`producao/s2/predio_21_pizzas_1080x1920.mp4`](producao/s2/predio_21_pizzas_1080x1920.mp4) (103 s).
- Narração e alinhamento: `producao/eleven/` (MP3 originais, textos enviados, tempos por palavra, scripts de trilha/efeitos). Planos: `producao/engine/s1.js`, `s2.js`, `kit.js`.
