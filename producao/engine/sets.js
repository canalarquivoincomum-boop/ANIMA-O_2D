// sets.js — cenários 2D flat em camadas (far .42 / mid .78 / near 1 / fore 1.35). Regra dos 3 planos.
(function (G) {
  const { f, shade, mix, NAVY, rnd } = G.L;
  const R = (x, y, w, h, fill, rx = 0, st = null, sw = 4) => `<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="${rx}" fill="${fill}"${st ? ` stroke="${st}" stroke-width="${sw}" stroke-linejoin="round"` : ''}/>`;
  const C = (x, y, r, fill, st = null, sw = 4) => `<circle cx="${f(x)}" cy="${f(y)}" r="${r}" fill="${fill}"${st ? ` stroke="${st}" stroke-width="${sw}"` : ''}/>`;
  const Pth = (d, fill, st = null, sw = 4, ex = '') => `<path d="${d}" fill="${fill}"${st ? ` stroke="${st}" stroke-width="${sw}" stroke-linejoin="round" stroke-linecap="round"` : ''} ${ex}/>`;
  const T = (x, y, str, size, fill, ex = '') => `<text x="${f(x)}" y="${f(y)}" font-family="Inter" font-weight="800" font-size="${size}" fill="${fill}" text-anchor="middle" ${ex}>${str}</text>`;
  const lg = (id, x1, y1, x2, y2, stops) => `<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">${stops.map(s => `<stop offset="${s[0]}" stop-color="${s[1]}"${s[2] !== undefined ? ` stop-opacity="${s[2]}"` : ''}/>`).join('')}</linearGradient>`;
  const rg = (id, cx, cy, r, stops) => `<radialGradient id="${id}" gradientUnits="userSpaceOnUse" cx="${cx}" cy="${cy}" r="${r}">${stops.map(s => `<stop offset="${s[0]}" stop-color="${s[1]}" stop-opacity="${s[2] === undefined ? 1 : s[2]}"/>`).join('')}</radialGradient>`;

  // ---------- peças reutilizáveis ----------
  function houseBlock(x, y, w, h, col, win = '#ffe9a8', k = 1) { // prédio pastel simples
    let s = R(x, y, w, h, col, 0, NAVY, 3 * k);
    const cols = Math.max(2, Math.floor(w / 46)), rows = Math.max(2, Math.floor(h / 70));
    for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) { const wx = x + 14 + i * ((w - 28) / cols), wy = y + 16 + j * ((h - 30) / rows); s += R(wx, wy, (w - 28) / cols - 12, 30, rnd(i * 7 + j * 3 + x) > 0.35 ? win : shade(col, -0.18), 3, NAVY, 2.5 * k); }
    return s;
  }
  function tree(x, y, s = 1, light = '#7cc48a') { return R(x - 7 * s, y - 70 * s, 14 * s, 74 * s, '#9a6b4b', 3, NAVY, 3.5) + C(x, y - 100 * s, 52 * s, light, NAVY, 4) + C(x - 30 * s, y - 80 * s, 32 * s, shade(light, -0.12), NAVY, 4) + C(x + 30 * s, y - 84 * s, 30 * s, shade(light, 0.12), NAVY, 4); }
  function lamp(x, y, s = 1) { return R(x - 4 * s, y - 220 * s, 8 * s, 224 * s, '#4d5470', 3, NAVY, 3) + Pth(`M${x},${y - 220 * s} q0,-24 ${28 * s},-24`, 'none', NAVY, 7 * s) + R(x + 16 * s, y - 252 * s, 28 * s, 14 * s, '#ffd98a', 5, NAVY, 3); }
  function clockFace(cx, cy, r, h, m, col = '#fffdf4') {
    let s = C(cx, cy, r, col, NAVY, 5);
    for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; s += `<line x1="${f(cx + Math.sin(a) * (r - 5))}" y1="${f(cy - Math.cos(a) * (r - 5))}" x2="${f(cx + Math.sin(a) * (r - 12))}" y2="${f(cy - Math.cos(a) * (r - 12))}" stroke="${NAVY}" stroke-width="3" stroke-linecap="round"/>`; }
    const ha = (h % 12) / 12 * Math.PI * 2 + (m / 60) / 12 * Math.PI * 2, ma = m / 60 * Math.PI * 2;
    s += `<line x1="${cx}" y1="${cy}" x2="${f(cx + Math.sin(ha) * r * 0.5)}" y2="${f(cy - Math.cos(ha) * r * 0.5)}" stroke="${NAVY}" stroke-width="6" stroke-linecap="round"/><line x1="${cx}" y1="${cy}" x2="${f(cx + Math.sin(ma) * r * 0.76)}" y2="${f(cy - Math.cos(ma) * r * 0.76)}" stroke="${NAVY}" stroke-width="4" stroke-linecap="round"/>` + C(cx, cy, 4.5, '#d9503f', NAVY, 2);
    return s;
  }

  const SETS = {};

  // =================== SALA (fim de tarde) ===================
  SETS.sala = {
    w: 900, floor: 700,
    far(t) { // vista pela janela: céu dourado
      return `<defs>${lg('skyS', 0, 0, 0, 700, [[0, '#a9d8ea'], [0.55, '#ffe2b5'], [1, '#ffc58c']])}${rg('sunS', 760, 520, 260, [[0, '#fff3c4', 1], [1, '#ffe9a8', 0]])}</defs>` +
        R(-3000, -3000, 6900, 6800, 'url(#skyS)') + C(700, 500, 240, 'url(#sunS)') +
        Pth('M200,420 q60,-30 130,-8 q50,-26 110,0 q60,-10 100,18 L440,470 L200,470Z', '#ffd1b8', null) + Pth('M600,360 q50,-24 110,-4 q40,-20 90,4 L800,400 L600,400Z', '#ffe0cc', null);
    },
    mid(t) { // quarteirão visto da janela
      let s = ''; const cols = ['#d8c0d8', '#f0c7b4', '#c9d6c0', '#f3dca0', '#c7c8e6'];
      for (let i = 0; i < 7; i++) { const w = 70 + (i % 3) * 22, h = 120 + (i * 53 % 110), x = 330 + i * 78; s += houseBlock(x, 640 - h, w, h, cols[i % 5], '#ffeaa8', 0.8); }
      return s + R(300, 560, 640, 200, '#c9a98a') + R(300, 560, 640, 10, '#9f8268');
    },
    near(t) {
      let s = '';
      // parede com furo de janela
      s += `<path fill-rule="evenodd" d="M-400,-900 H1300 V700 H-400Z M560,300 H830 a14,14 0 0 1 14,14 V606 a14,14 0 0 1 -14,14 H560 a14,14 0 0 1 -14,-14 V314 a14,14 0 0 1 14,-14Z" fill="#f4ddb0"/>`;
      s += R(-400, 640, 1700, 60, '#e6c48c') + `<rect x="-400" y="636" width="1700" height="8" fill="#c99f64"/>`;
      // faixa decorativa
      for (let i = -8; i < 26; i++) s += R(i * 52 + 6, 652, 36, 40, shade('#e6c48c', i % 2 ? -0.05 : 0.04), 4);
      // piso
      s += R(-400, 700, 1700, 800, '#d9a677') + `<rect x="-400" y="692" width="1700" height="16" fill="#b98456" stroke="${NAVY}" stroke-width="3"/>`;
      for (let i = 0; i < 9; i++) s += `<line x1="0" y1="${728 + i * 36}" x2="900" y2="${728 + i * 36}" stroke="#c18f61" stroke-width="2.5"/>`;
      // moldura da janela
      s += R(546, 300, 298, 340, 'none', 14, NAVY, 7) + R(560, 314, 270, 312, 'none', 8, '#fff6dc', 6) + `<line x1="695" y1="314" x2="695" y2="606" stroke="${NAVY}" stroke-width="6"/><line x1="560" y1="410" x2="830" y2="410" stroke="${NAVY}" stroke-width="6"/>`;
      s += R(530, 622, 330, 20, '#f0d8a5', 6, NAVY, 5);
      // poster do recital
      s += R(120, 232, 190, 250, '#fff3d6', 6, NAVY, 5) + R(132, 244, 166, 78, '#9ed6cf', 6, NAVY, 3) + T(215, 282, 'RECITAL', 30, NAVY) + T(215, 312, 'DE FLAUTA', 17, '#2f7d78') + T(215, 366, '20h', 46, '#d9503f') +
        R(138, 386, 154, 26, '#fff', 4, NAVY, 2.5) + T(215, 405, 'ÚLTIMA MÚSICA', 14.5, NAVY) + T(215, 440, 'Escola do Bairro', 14, '#6a5a4e') + C(142, 232, 7, '#d9503f', NAVY, 2.5);
      // relógio
      s += `<g>${clockFace(430, 285, 50, 5, 0)}</g>`;
      // cabide com a jaqueta do pai
      s += R(24, 380, 90, 14, '#8a5a3a', 5, NAVY, 3.5) + C(46, 388, 6, '#d8c0a0', NAVY, 2.5) + C(92, 388, 6, '#d8c0a0', NAVY, 2.5) +
        Pth('M34,392 Q22,440 30,520 L100,520 Q108,440 96,392 Q66,380 34,392Z', '#e2a53b', NAVY, 4) + Pth('M50,394 L66,420 L84,394', '#f3eadb', NAVY, 3) + `<path d="M66,420 L66,520" stroke="${NAVY}" stroke-width="3"/>` + Pth('M30,430 q-14,30 -2,60', 'none', NAVY, 3.5) +
        Pth('M20,330 Q34,300 70,300 Q96,300 112,330Z', '#c9473d', NAVY, 4) + Pth('M70,330 q50,-4 56,12 q-30,6 -56,-8Z', '#a8372f', NAVY, 3.5);
      return s;
    },
    props(t) { // mesa, cadeira vazia, estante de partitura, tapete
      let s = '';
      s += `<ellipse cx="450" cy="880" rx="250" ry="64" fill="#5aa7a2" stroke="${NAVY}" stroke-width="4"/><ellipse cx="450" cy="880" rx="190" ry="44" fill="none" stroke="#fff" stroke-width="4" stroke-dasharray="3 14" stroke-linecap="round" opacity=".8"/>`;
      // mesa
      s += R(60, 628, 330, 26, '#b57a50', 8, NAVY, 4.5) + R(84, 654, 18, 82, '#9a6540', 4, NAVY, 4) + R(346, 654, 18, 82, '#9a6540', 4, NAVY, 4) + R(90, 654, 270, 12, '#8d5a38', 3);
      // cadeira vazia (a do pai)
      s += R(238, 520, 86, 20, '#cf6a50', 7, NAVY, 4.5) + R(244, 540, 12, 188, '#9a6540', 3, NAVY, 4) + R(306, 540, 12, 188, '#9a6540', 3, NAVY, 4) + R(238, 640, 86, 18, '#cf6a50', 6, NAVY, 4.5);
      // estojo de flauta com adesivos + copo + planta
      s += R(110, 604, 112, 24, '#3d4a73', 6, NAVY, 4) + Pth('M130,615 l5,-9 l5,9 l-9,-5.5 h9Z', '#ffcf33', null) + C(170, 615, 6, '#ff7aa8', NAVY, 2) + C(196, 615, 5, '#7bd3c8', NAVY, 2) +
        R(300, 590, 26, 38, '#e8f4f8', 6, NAVY, 3.5) + R(300, 600, 26, 14, '#8fd0e8', 0) + Pth('M350,628 L346,590 L372,590 L368,628Z', '#c96a4d', NAVY, 3.5) + Pth('M358,590 Q340,550 332,540 M358,590 Q366,540 380,530 M358,590 Q360,560 352,540', 'none', '#4f9b62', 6);
      // estante de partitura
      s += R(626, 742, 6, 130, '#5a4a52', 2, NAVY, 3) + Pth('M600,872 L629,848 L658,872', 'none', NAVY, 5) + R(588, 700, 82, 56, '#fffaf0', 4, NAVY, 4) + `<path d="M598,716 h62 M598,728 h62 M598,740 h40" stroke="#7a6a70" stroke-width="2.5"/><circle cx="640" cy="738" r="3" fill="${NAVY}"/>`;
      return s;
    },
    fore(t) { // folhagem em primeiro plano
      return Pth('M-20,1040 Q20,860 90,830 Q60,900 70,1040Z', '#3f8a58', NAVY, 4) + Pth('M30,1040 Q70,900 150,900 Q110,960 120,1040Z', '#52a46a', NAVY, 4);
    },
    light(t) { // facho de luz da janela no chão e na parede
      const k = 0.18 + Math.sin(t * 0.6) * 0.015;
      return `<defs>${lg('shaft', 700, 640, 520, 1000, [[0, '#fff0b8', 0.95], [1, '#ffe08a', 0.0]])}</defs><path d="M560,640 L830,640 L780,1024 L300,1024Z" fill="url(#shaft)" opacity="${f(k * 2.0)}"/>`;
    },
    tint: ['#ffb64d', 0.11]
  };

  // =================== RUA (fim de tarde, plano geral) ===================
  SETS.rua = {
    w: 1500, floor: 800,
    far(t) {
      let s = `<defs>${lg('skyR', 0, 0, 0, 640, [[0, '#9ccfe6'], [0.6, '#ffe0b4'], [1, '#ffc590']])}${rg('sunR', 1050, 560, 330, [[0, '#fff0bb', 1], [1, '#ffe2a0', 0]])}</defs>`;
      s += R(-3000, -3000, 7500, 6800, 'url(#skyR)') + C(1050, 560, 330, 'url(#sunR)');
      s += `<g opacity=".85">${Pth('M80,260 q50,-34 120,-8 q40,-30 100,0 q56,-4 70,24 L80,276Z', '#fff1e6')}${Pth('M900,200 q50,-30 120,-6 q36,-26 96,2 q40,2 56,22 L900,216Z', '#ffe6da')}</g>`;
      const cols = ['#cdb7d9', '#e3bfc0', '#bfd3c9', '#e8d3a2', '#bcc2e4'];
      for (let i = 0; i < 16; i++) { const w = 90 + (i * 37 % 60), h = 150 + (i * 71 % 170); s += houseBlock(-100 + i * 118, 640 - h, w, h, cols[i % 5], '#ffe7a0', 0.7); }
      return s;
    },
    mid(t) {
      let s = '';
      const cols = ['#f1b6ae', '#b8dcc6', '#f6dc9a', '#cabfe6'];
      s += houseBlock(-60, 440, 210, 360, cols[0], '#ffe9a8', 1) + houseBlock(1250, 430, 300, 370, cols[3], '#ffe9a8', 1);
      s += tree(560, 780, 1.1, '#78b985') + tree(800, 780, 0.9, '#8cc593') + lamp(700, 790, 0.9);
      return s;
    },
    near(t) {
      let s = '';
      s += R(-200, 790, 1900, 60, '#e8d4b6') + R(-200, 846, 1900, 8, '#c9a97f');       // calçada
      s += R(-200, 850, 1900, 400, '#9a97ad');                                        // rua
      for (let i = 0; i < 10; i++) s += R(-120 + i * 190, 960, 100, 12, '#f6e7c1', 5);
      // padaria
      s += R(930, 450, 340, 340, '#f2b9a4', 0, NAVY, 5) + R(930, 450, 340, 36, '#cf6a50', 0, NAVY, 5) + R(950, 380, 300, 58, '#fff3d6', 8, NAVY, 5) + T(1100, 420, 'PADARIA DA ODETE', 29, '#b8453a');
      for (let i = 0; i < 10; i++) s += `<path d="M${930 + i * 34},486 h34 v24 q-17,14 -34,0Z" fill="${i % 2 ? '#fff' : '#d9503f'}" stroke="${NAVY}" stroke-width="3.5"/>`;
      s += R(1160, 530, 90, 260, '#7a4a37', 5, NAVY, 5) + R(1172, 544, 66, 120, '#ffd98a', 4, NAVY, 3.5) + C(1178, 720, 5, '#ffcf33', NAVY, 2);
      s += R(960, 530, 180, 130, '#ffe9b8', 6, NAVY, 5) + R(972, 600, 156, 50, '#e9b77a', 4, NAVY, 3);
      for (let i = 0; i < 5; i++) s += `<ellipse cx="${998 + i * 30}" cy="${590}" rx="14" ry="9" fill="#d9954c" stroke="${NAVY}" stroke-width="2.5"/>`;
      s += R(960, 700, 120, 90, '#3d4a6e', 6, NAVY, 4) + T(1020, 752, 'PÃO', 26, '#ffe9b8');
      // ponto de ônibus
      s += R(168, 520, 8, 270, '#4d5470', 2, NAVY, 3.5) + R(398, 520, 8, 270, '#4d5470', 2, NAVY, 3.5) + R(160, 500, 256, 30, '#4c8f9d', 8, NAVY, 5) +
        R(176, 530, 224, 150, '#cfe9ee', 6, NAVY, 4) + `<path d="M190,545 L260,545 L190,610Z" fill="#fff" opacity=".35"/>` +
        R(190, 738, 200, 18, '#a8714b', 6, NAVY, 4.5) + R(204, 756, 12, 44, '#7a5136', 3, NAVY, 3.5) + R(364, 756, 12, 44, '#7a5136', 3, NAVY, 3.5) +
        R(430, 560, 10, 232, '#4d5470', 3, NAVY, 3.5) + C(435, 548, 36, '#fffdf4', NAVY, 5) + R(418, 596, 34, 28, '#3d6f8a', 5, NAVY, 3.5) + T(435, 616, 'ÔN', 14, '#fff');
      return s;
    },
    clock(h, m) { return clockFace(435, 548, 32, h, m); },
    fore(t) { return Pth('M-30,1040 Q10,930 70,920 Q50,980 60,1040Z', '#3f8a58', NAVY, 4); },
    light(t) { return `<defs>${lg('rshaft', 1050, 560, 500, 1000, [[0, '#ffe9a8', 0.5], [1, '#ffe9a8', 0]])}</defs><path d="M900,430 L1300,430 L300,1024 L-200,1024Z" fill="url(#rshaft)" opacity=".22"/>`; },
    tint: ['#ffa94a', 0.10]
  };

  // =================== INTERIOR DA PADARIA ===================
  SETS.padaria = {
    w: 900, floor: 740,
    far(t) { return R(-3000, -3000, 7000, 7000, '#ffd9b8'); },
    mid(t) { return ''; },
    near(t) {
      let s = '';
      s += R(0, 0, 900, 740, '#fbd2ae') + R(0, 520, 900, 220, '#e9a06f') + `<rect x="0" y="516" width="900" height="10" fill="#c9774a"/>`;
      for (let i = 0; i < 13; i++) for (let j = 0; j < 3; j++) s += R(i * 70 + (j % 2) * 30 - 20, 536 + j * 62, 62, 54, shade('#e9a06f', (i + j) % 2 ? -0.07 : 0.05), 6);
      s += R(0, 740, 900, 300, '#a3694f') + `<rect x="0" y="734" width="900" height="14" fill="#7c4c37" stroke="${NAVY}" stroke-width="3"/>`;
      // janela para a rua
      s += R(620, 150, 230, 290, '#ffe3a8', 10, NAVY, 6) + `<line x1="735" y1="150" x2="735" y2="440" stroke="${NAVY}" stroke-width="5"/>` + R(630, 160, 100, 270, '#ffeec0', 6) + Pth('M630,160 L730,160 L630,300Z', '#fff8dc', null, 0, 'opacity=".5"');
      // prateleiras com pães
      for (let r = 0; r < 3; r++) { const y = 210 + r * 96; s += R(40, y + 58, 500, 14, '#8d5a38', 4, NAVY, 3.5); for (let i = 0; i < 9; i++) s += `<ellipse cx="${80 + i * 52}" cy="${y + 46}" rx="${20 + (i % 3) * 3}" ry="${11 + (i % 2) * 2}" fill="${['#d9954c', '#e8b06a', '#c87f3d'][(i + r) % 3]}" stroke="${NAVY}" stroke-width="3"/><path d="M${68 + i * 52},${y + 42} l8,-5 M${80 + i * 52},${y + 42} l8,-5" stroke="#f6d9a0" stroke-width="2.5" stroke-linecap="round"/>`; }
      // retrato do filho (pista) + relógio
      s += R(560, 70, 70, 86, '#8a5a3a', 5, NAVY, 4) + R(568, 78, 54, 70, '#cfe2ee', 3) + C(595, 106, 14, '#c58a5e', NAVY, 2.5) + Pth('M572,148 q23,-36 46,0Z', '#e0793d', NAVY, 2.5);
      s += clockFace(760, 90, 38, 5, 5);
      return s;
    },
    front(t) { // balcão (na frente do avental)
      let s = R(0, 640, 900, 130, '#c8814f', 8, NAVY, 5) + R(0, 628, 900, 22, '#e6b27a', 6, NAVY, 5);
      s += R(40, 556, 420, 74, '#cfe9ee', 8, NAVY, 5) + R(40, 556, 420, 14, '#ffffff', 4) + `<path d="M60,580 L140,580 L60,620Z" fill="#fff" opacity=".4"/>`;
      for (let i = 0; i < 6; i++) s += `<ellipse cx="${80 + i * 64}" cy="${604}" rx="${22}" ry="${12}" fill="${['#d9954c', '#e8b06a', '#c87f3d'][i % 3]}" stroke="${NAVY}" stroke-width="3"/>`;
      s += R(640, 590, 120, 38, '#4d5470', 6, NAVY, 4.5) + R(652, 560, 70, 36, '#aeb7d0', 4, NAVY, 4) + R(664, 570, 46, 14, '#cdeec6', 2);
      return s;
    },
    fore(t) { return ''; },
    light(t) { return `<defs>${lg('pshaft', 740, 300, 420, 800, [[0, '#fff0b8', 0.8], [1, '#ffe08a', 0]])}</defs><path d="M620,150 L850,150 L700,800 L260,800Z" fill="url(#pshaft)" opacity=".34"/>`; },
    tint: ['#ffb44d', 0.10]
  };

  // =================== FRENTE DA CASA (manhã) + CAMINHÃO ===================
  function truck(x, y, s = 1, t = 0, opts = {}) {
    // visto de lado, olhando para a DIREITA; origem no chão sob o centro do baú;
    const jit = opts.idle ? Math.sin(t * 38) * 1.1 : 0;
    let g = `<g transform="translate(${f(x)},${f(y + jit * s)}) scale(${s})">`;
    g += `<ellipse cx="40" cy="6" rx="330" ry="14" fill="#2a2f48" opacity=".28"/>`;
    // baú
    g += R(-300, -250, 400, 190, '#f2efe6', 10, NAVY, 5) + R(-300, -150, 400, 22, '#4c8f9d', 0, NAVY, 4) + R(-300, -122, 400, 62, '#e6e1d4', 0, NAVY, 4);
    g += T(-100, -176, 'TRANSPORTES GENARO', 24, '#2f5a68') + R(-300, -60, 400, 16, '#3a3f5a', 4, NAVY, 4);
    // cabine
    g += Pth('M110,-60 L110,-200 Q112,-236 150,-240 L222,-240 Q262,-236 278,-190 L300,-130 Q310,-110 308,-60Z', '#3d6fb5', NAVY, 5);
    g += Pth('M150,-224 L214,-224 Q246,-220 258,-186 L270,-160 L150,-160Z', '#bfe3f2', NAVY, 4.5);
    g += R(110, -100, 200, 8, '#2b4f86', 0) + R(282, -118, 28, 30, '#ffe9a8', 6, NAVY, 4) + R(300, -78, 20, 16, '#c9c4b8', 4, NAVY, 4);
    // para-choque + rodas
    g += R(-300, -60, 620, 18, '#8a8fa6', 6, NAVY, 4.5);
    [[-210, 1], [-100, 1], [210, 1]].forEach(w => { g += C(w[0], -30, 52, '#2c2f42', NAVY, 5) + C(w[0], -30, 26, '#aeb3c8', NAVY, 4) + C(w[0], -30, 8, '#6e7390', NAVY, 3); });
    // para-lama + lama (flap) com o nome da Ísis
    g += Pth('M-270,-60 Q-210,-130 -150,-60Z', '#3a3f5a', NAVY, 4) + R(-262, -62, 74, 96, '#26293a', 6, NAVY, 4) + T(-225, -8, 'ÍSIS', 26, '#7bd3c8') + Pth('M-225,-34 l5,-10 l5,10 l-10,-6.5 h10Z', '#ffcf33', null);
    return g + '</g>';
  }
  SETS.frente = {
    w: 1400, floor: 820,
    far(t) { return `<defs>${lg('skyF', 0, 0, 0, 700, [[0, '#a8c8e8'], [0.65, '#f8d2d0'], [1, '#ffe2c0']])}</defs>` + R(-3000, -3000, 7500, 6800, 'url(#skyF)') + houseBlock(-40, 380, 140, 300, '#c9bfdc', '#f4e6c8', 0.7) + houseBlock(1100, 360, 170, 320, '#c9d6c6', '#f4e6c8', 0.7) + houseBlock(1260, 420, 140, 260, '#e4c7c2', '#f4e6c8', 0.7); },
    mid(t) { return tree(1180, 800, 1.0, '#8bb98f') + lamp(1020, 810, 0.9); },
    near(t) {
      let s = R(-200, 810, 1900, 60, '#dccfb8') + R(-200, 866, 1900, 8, '#b9a888') + R(-200, 870, 1900, 400, '#8d90a6');
      for (let i = 0; i < 9; i++) s += R(-80 + i * 210, 980, 110, 12, '#eadfc0', 5);
      // casa da Ísis
      s += R(40, 430, 300, 380, '#f6c9b8', 0, NAVY, 5) + Pth('M16,440 L190,330 L364,440Z', '#c9615a', NAVY, 5) + R(80, 500, 90, 100, '#cfe9ee', 6, NAVY, 4.5) + `<line x1="125" y1="500" x2="125" y2="600" stroke="${NAVY}" stroke-width="4"/><line x1="80" y1="550" x2="170" y2="550" stroke="${NAVY}" stroke-width="4"/>` +
        R(210, 560, 84, 250, '#6f9ec0', 5, NAVY, 5) + C(222, 700, 5, '#ffcf33', NAVY, 2) + R(220, 520, 64, 26, '#fff3d6', 4, NAVY, 3) + T(252, 540, '12', 20, NAVY) +
        R(20, 760, 360, 14, '#b8a07f', 3, NAVY, 3.5) + R(20, 700, 8, 110, '#a88e6a', 2, NAVY, 3) + R(372, 700, 8, 110, '#a88e6a', 2, NAVY, 3);
      for (let i = 0; i < 8; i++) s += R(34 + i * 44, 716, 20, 100, '#c8b08a', 3, NAVY, 3);
      return s;
    },
    fore(t) { return ''; },
    light(t) { return `<defs>${lg('fshaft', 1200, 300, 400, 1000, [[0, '#fff0d0', 0.7], [1, '#ffe9c0', 0]])}</defs><path d="M900,0 L1400,0 L700,1024 L100,1024Z" fill="url(#fshaft)" opacity=".16"/>`; },
    tint: ['#9fb4ff', 0.09]
  };

  // =================== ESTRADA (perspectiva de 1 ponto) ===================
  SETS.estrada = {
    w: 576, floor: 760, hy: 470,
    far(t) { return `<defs>${lg('skyE', 0, 0, 0, 480, [[0, '#a8c8e8'], [0.7, '#f8d2d0'], [1, '#ffe6c8']])}${rg('sunE', 288, 470, 280, [[0, '#fff3cf', 1], [1, '#ffe6c8', 0]])}</defs>` + R(-3000, -3000, 6600, 3470, 'url(#skyE)') + C(288, 470, 280, 'url(#sunE)') + Pth('M-300,470 q160,-50 320,-8 q80,-30 160,-4 L-300,470Z', '#d9c5d6') + Pth('M340,470 q80,-40 200,-6 q90,-24 220,2 L340,470Z', '#d2bfd9'); },
    mid(t) { return ''; },
    near(t) {
      const HY = 470, rx = y => 12 + (y - HY) * 0.915;          // meia-largura da estrada na altura y
      let s = R(-3000, HY, 6600, 3000, '#c3d99f') + `<path d="M${288 - rx(1100)},1100 L${288 - rx(HY)},${HY} L${288 + rx(HY)},${HY} L${288 + rx(1100)},1100Z" fill="#8d90a6" stroke="${NAVY}" stroke-width="3"/>`;
      s += `<path d="M${288 - rx(1100) + 40},1100 L${288 - rx(HY) + 1.5},${HY} L${288 - rx(HY) + 3},${HY} L${288 - rx(1100) + 70},1100Z" fill="#f6e7c1" opacity=".9"/><path d="M${288 + rx(1100) - 70},1100 L${288 + rx(HY) - 3},${HY} L${288 + rx(HY) - 1.5},${HY} L${288 + rx(1100) - 40},1100Z" fill="#f6e7c1" opacity=".9"/>`;
      for (let i = 0; i < 12; i++) { const k = Math.pow(i / 12, 1.9), y = HY + 6 + k * 640, w = 1.5 + k * 16, h = 5 + k * 80; s += `<polygon points="${288 - w / 2},${f(y)} ${288 + w / 2},${f(y)} ${288 + w * 0.8},${f(y + h)} ${288 - w * 0.8},${f(y + h)}" fill="#f6e7c1"/>`; }
      const cols = ['#f6c9b8', '#cfe3d0', '#f3dca0', '#cabfe6', '#f1b6ae'];
      for (let i = 0; i < 6; i++) { // casas assentadas no acostamento, diminuindo em direção ao horizonte
        const k = Math.pow((i + 1) / 6, 1.7), y = HY + 8 + k * 520, w = 26 + k * 190, h = 34 + k * 200, xl = 288 - rx(y) - 26 - k * 30, xr = 288 + rx(y) + 26 + k * 30, sw = 1.2 + k * 3.2;
        s += R(xl - w, y - h, w, h, cols[i % 5], 0, NAVY, sw) + R(xl - w * 0.8, y - h * 0.7, w * 0.3, h * 0.24, '#ffe9a8', 1, NAVY, sw * 0.7) + Pth(`M${f(xl - w - 3)},${f(y - h)} L${f(xl - w / 2)},${f(y - h - h * 0.3)} L${f(xl + 3)},${f(y - h)}Z`, '#c9615a', NAVY, sw);
        s += R(xr, y - h, w, h, cols[(i + 2) % 5], 0, NAVY, sw) + R(xr + w * 0.5, y - h * 0.7, w * 0.3, h * 0.24, '#ffe9a8', 1, NAVY, sw * 0.7) + Pth(`M${f(xr - 3)},${f(y - h)} L${f(xr + w / 2)},${f(y - h - h * 0.3)} L${f(xr + w + 3)},${f(y - h)}Z`, '#d98f5a', NAVY, sw);
      }
      // postes e fios convergindo
      let wires = ''; const pts = [];
      for (let i = 0; i < 6; i++) { const k = Math.pow((i + 0.5) / 6, 1.8), y = HY + 6 + k * 640, x = 288 + rx(y) + 14 + k * 20, h = 30 + k * 330; pts.push([x, y, h]); s += R(x - 1 - k * 5, y - h, 2 + k * 10, h, '#6b5a50', 0, NAVY, 0.6 + k * 2) + R(x - 14 - k * 40, y - h + 6 + k * 10, 28 + k * 80, 3 + k * 8, '#6b5a50', 0, NAVY, 0.6 + k * 2); }
      for (let j = -1; j <= 1; j++) wires += `<polyline fill="none" stroke="#3b3550" stroke-width="1.6" opacity=".7" points="${pts.map(p => `${f(p[0] + j * (4 + (p[1] - HY) * 0.1))},${f(p[1] - p[2] + 8)}`).join(' ')}"/>`;
      return s + wires;
    },
    fore(t) { return ''; },
    light(t) { return ''; },
    tint: ['#9fb4ff', 0.09]
  };

  // =================== avental flutuante (dona Odete) ===================
  function apron(x, y, s, t, flowerNew = 0, open = 0) {
    const bob = Math.sin(t * 1.5) * 4, sw = Math.sin(t * 1.1) * 2.2;
    let g = `<g transform="translate(${f(x)},${f(y + bob)}) rotate(${f(sw)}) scale(${s})">`;
    const stripe = (x0, x1) => { let o = ''; for (let i = x0; i < x1; i += 24) o += `<rect x="${i}" y="-10" width="9" height="150" fill="#6f90d8" opacity=".55"/>`; return o; };
    g += `<path d="M-30,-66 Q0,-110 30,-66" fill="none" stroke="${NAVY}" stroke-width="9" stroke-linecap="round"/><path d="M-30,-66 Q0,-110 30,-66" fill="none" stroke="#f4f0e6" stroke-width="5" stroke-linecap="round"/>`;
    g += `<clipPath id="apc"><path d="M-34,-66 L34,-66 L40,-8 Q70,20 78,140 Q0,160 -78,140 Q-70,20 -40,-8Z"/></clipPath>`;
    g += `<path d="M-34,-66 L34,-66 L40,-8 Q70,20 78,140 Q0,160 -78,140 Q-70,20 -40,-8Z" fill="#f4f0e6" stroke="${NAVY}" stroke-width="5" stroke-linejoin="round"/><g clip-path="url(#apc)">${stripe(-80, 80)}</g>`;
    g += `<path d="M-40,-8 Q0,10 40,-8" fill="none" stroke="${NAVY}" stroke-width="4"/><path d="M-78,140 Q0,160 78,140" fill="none" stroke="#d9503f" stroke-width="9" stroke-linecap="round"/>`;
    // laços da cintura flutuando
    g += `<path d="M-40,-4 q-40,${10 + Math.sin(t * 2) * 6} -52,${34 + Math.sin(t * 2.3) * 8}" fill="none" stroke="${NAVY}" stroke-width="9" stroke-linecap="round"/><path d="M-40,-4 q-40,${10 + Math.sin(t * 2) * 6} -52,${34 + Math.sin(t * 2.3) * 8}" fill="none" stroke="#f4f0e6" stroke-width="5" stroke-linecap="round"/>`;
    g += `<path d="M40,-4 q40,${10 + Math.sin(t * 2.2) * 6} 52,${34 + Math.sin(t * 2.6) * 8}" fill="none" stroke="${NAVY}" stroke-width="9" stroke-linecap="round"/><path d="M40,-4 q40,${10 + Math.sin(t * 2.2) * 6} 52,${34 + Math.sin(t * 2.6) * 8}" fill="none" stroke="#f4f0e6" stroke-width="5" stroke-linecap="round"/>`;
    // bolso + flor
    g += `<path d="M-28,70 L28,70 L26,116 Q0,124 -26,116Z" fill="#e9eef9" stroke="${NAVY}" stroke-width="4.5" stroke-linejoin="round"/>`;
    const flower = (fx, fy, col, rot, wilt) => `<g transform="translate(${fx},${fy}) rotate(${rot})"><path d="M0,0 L0,${52}" stroke="#4f9b62" stroke-width="5" stroke-linecap="round"/>` + [0, 72, 144, 216, 288].map(a => `<ellipse cx="0" cy="-12" rx="${wilt ? 8 : 10}" ry="${wilt ? 11 : 14}" transform="rotate(${a + (wilt ? 20 : 0)}) translate(0,${wilt ? 2 : 0})" fill="${col}" stroke="${NAVY}" stroke-width="2.6"/>`).join('') + `<circle cx="0" cy="0" r="6" fill="#ffd54a" stroke="${NAVY}" stroke-width="2.4"/></g>`;
    g += `<g opacity="${f(1 - flowerNew)}">${flower(2, 66, '#c99a8a', -16, true)}</g>`;
    if (flowerNew > 0) g += `<g opacity="${f(flowerNew)}" transform="translate(0,${f((1 - flowerNew) * 10)})">${flower(2, 62, '#ff7aa8', 8, false)}</g>`;
    g += `<path d="M-28,70 L28,70 L26,116 Q0,124 -26,116Z" fill="none" stroke="${NAVY}" stroke-width="4.5" stroke-linejoin="round" transform="translate(0,0)" opacity="0"/>`;
    return g + '</g>';
  }

  G.SETS = { SETS, truck, apron, clockFace, R, C, Pth, T, lg, rg };
})(window);
