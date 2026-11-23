# producao/ — motor de animação e piloto "A Última Música"

Motor 2D em SVG renderizado por quadro (`render(t)`) com Playwright + ffmpeg, no estilo do canal Escuta Só.

- `engine/` — `lib.js`, `ch.js` (rig do personagem), `sets.js` (cenários em camadas), `story_pilot.js` (15 planos), `main.html` (câmera, legenda, whip), `render.js`. `chartest.html` e `fadetest.html` são páginas de teste do rig e da transparência.
- `audio/` — roteiro estruturado, geração da voz-guia, alinhamento de palavras, efeitos. Os `.wav` são regeneráveis e não são versionados.
- `piloto/` — MP4 do piloto (0–29,8 s, 1080×1920) e folha de contato.
- `render_all.sh`, `build_piloto.sh` — render em paralelo e montagem.

Documentação: `docs/producao/05`–`08`. Reprodução: `docs/producao/08_validacao_piloto.md`, seção 9.

A narração é uma **voz-guia sintética provisória**; a final será a do usuário.

## v2
`piloto/piloto_v2_1080x1920.mp4` é a versão atual; o v1 está em `piloto/v1/`. `engine/coco.js` é o personagem fixo; `engine/story_pilot2.js` e `engine/sets2.js` são a re-direção e as camadas de vida/luz do v2. Veja `docs/producao/09`, `10` e `11`.
