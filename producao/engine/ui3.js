// ui3.js — telas do celular e objetos de inserto (o "medidor visível" desta história: o relógio do aplicativo).
(function (G) {
  const { f, rnd, noise1, E, clamp, shade, NAVY } = G.L; const { R, C, Pth } = G.SETS;
  const T = (x, y, s, sz, fill, w = 700, a = 'start', ex = '') => `<text x="${f(x)}" y="${f(y)}" font-family="Inter" font-weight="${w}" font-size="${sz}" fill="${fill}" text-anchor="${a}" ${ex}>${s}</text>`;
  const BG = '#10142e', CARD = '#1b2142', LINE = '#2c3466', RED = '#ff5a4a', GREEN = '#3ddc84', YEL = '#ffd24a';
  const status = (time) => T(18, 24, time, 15, '#dfe6ff', 700) + T(282, 24, '▮▮▮ 5G ▭', 12, '#dfe6ff', 600, 'end');
  const UI = {};
  UI.lock = (lt, o = {}) => { // tela bloqueada com relógio grande + notificação
    let s = R(0, 0, 300, 600, '#161a3a') + `<defs><linearGradient id="lkg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a3170"/><stop offset="1" stop-color="#0f1230"/></linearGradient></defs>` + R(0, 0, 300, 600, 'url(#lkg)');
    s += status('') + T(150, 150, o.time || '23:47', 92, '#ffffff', 800, 'middle') + T(150, 186, 'quinta-feira, 12 de outubro', 17, '#b9c3ff', 600, 'middle');
    const k = E.spring2(clamp((lt - (o.notifAt || 1.35)) / 0.5)); if (k > 0.01) { const y = 600 - 215 * k; s += `<g transform="translate(0,${f(y)})">` + R(14, 0, 272, 110, '#242b60', 18, '#4a55a8', 2) + R(28, 14, 34, 34, RED, 9) + T(45, 38, 'ZAP', 11, '#fff', 800, 'middle') + T(74, 28, 'NOVO PEDIDO', 15, '#fff', 800) + T(74, 48, 'agora', 12, '#9aa6e8', 600) + T(28, 78, 'Forno Vivo • Rua das Acácias, 14', 14, '#e4e9ff', 700) + T(28, 98, '1 pizza grande • R$ 38,90', 13, '#aab4ee', 600) + '</g>'; }
    return s;
  };
  UI.order = (lt, o = {}) => {
    let s = R(0, 0, 300, 600, BG) + status('23:47') + R(0, 44, 300, 52, RED) + T(18, 78, 'NOVO PEDIDO', 21, '#fff', 800) + T(282, 76, '0:30', 15, '#ffd9d4', 800, 'end');
    s += R(14, 112, 272, 112, CARD, 14, LINE, 2) + T(28, 142, 'Forno Vivo Pizzaria', 17, '#fff', 800) + T(28, 166, '1× Pizza grande', 14, '#c9d2ff', 600) + R(28, 178, 150, 28, '#3a2a2a', 8) + T(38, 198, 'sem cebola', 14, '#ffb4a8', 700);
    const hl = o.hl ? 0.5 + 0.5 * Math.sin(lt * 9) : 0;
    s += R(14, 240, 272, 134, CARD, 14, o.hl ? YEL : LINE, o.hl ? 3 : 2) + T(28, 268, 'ENTREGAR EM', 12, '#8d99e6', 700) + T(28, 304, 'Rua das Acácias, 14', 24, '#fff', 800) + T(28, 330, 'Jardim Aurora', 14, '#c9d2ff', 600) + T(28, 358, '3,1 km • R$ 38,90', 15, GREEN, 800);
    if (o.hl) s += `<rect x="20" y="276" width="260" height="36" rx="8" fill="${YEL}" opacity="${f(0.18 * hl)}"/>`;
    s += R(14, 396, 130, 56, '#2a3160', 14) + T(79, 432, 'RECUSAR', 16, '#c9d2ff', 800, 'middle') + R(156, 396, 130, 56, GREEN, 14) + T(221, 432, 'ACEITAR', 16, '#0b2a18', 800, 'middle');
    return s;
  };
  UI.map = (lt, o = {}) => {
    let s = R(0, 0, 300, 600, '#1a2148') + status('23:48');
    const z = o.zoom || 1; s += `<g transform="translate(150,330) scale(${z}) translate(-150,-330)">`;
    for (let i = 0; i < 6; i++) s += `<rect x="${-40 + i * 70}" y="${60 + (i % 2) * 20}" width="58" height="100" fill="#222a5a" rx="4"/><rect x="${-40 + i * 70}" y="${420 + (i % 3) * 14}" width="58" height="140" fill="#222a5a" rx="4"/>`;
    s += R(-40, 175, 400, 18, '#3b4488') + R(-40, 380, 400, 18, '#3b4488') + R(128, 40, 18, 600, '#3b4488') + R(40, 40, 14, 600, '#2f3878') + R(230, 40, 14, 600, '#2f3878');
    // lote vazio, hachurado
    s += `<defs><pattern id="ht" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(40)"><line x1="0" y1="0" x2="0" y2="9" stroke="#6b7bd8" stroke-width="3"/></pattern></defs>`;
    s += R(148, 205, 78, 160, '#26306a') + R(148, 205, 78, 160, 'url(#ht)', 0, '#8d99e6', 3);
    s += T(187, 290, 'TERRENO', 13, '#cfd6ff', 800, 'middle') + C(187, 232, 13, RED, '#fff', 3) + T(187, 237, '14', 12, '#fff', 800, 'middle');
    { const wk = o.warnAt === undefined ? 1 : E.spring2(clamp((lt - o.warnAt) / 0.35)); s += `</g>` + `<g transform="translate(0,${f((1 - wk) * -70)})">` + R(0, 44, 300, 60, '#3a1f26') + T(16, 70, '⚠ Endereço sem edificação', 16, '#ffb4a8', 800) + T(16, 92, 'Imóvel demolido em 1994', 14, '#ffcfc8', 600) + '</g>'; }
    return s;
  };
  UI.timer = (lt, o = {}) => {
    const sec = Math.max(0, (o.start === undefined ? 660 : o.start) - lt * (o.rate === undefined ? 1 : o.rate)), mm = Math.floor(sec / 60), ss = Math.floor(sec % 60), txt = String(mm).padStart(2, '0') + ':' + String(ss).padStart(2, '0');
    const frac = Math.min(1, sec / (o.total || 660)), col = sec < 180 ? RED : YEL;
    let s = R(0, 0, 300, 600, BG) + status('23:48') + T(150, 120, 'TEMPO PARA ENTREGAR', 15, '#9aa6e8', 700, 'middle');
    s += `<circle cx="150" cy="270" r="112" fill="none" stroke="#242c5e" stroke-width="16"/><circle cx="150" cy="270" r="112" fill="none" stroke="${col}" stroke-width="16" stroke-linecap="round" stroke-dasharray="${f(704 * frac)} 800" transform="rotate(-90 150 270)"/>`;
    s += T(150, 296, txt, 76, '#fff', 800, 'middle') + T(150, 440, 'Rua das Acácias, 14', 18, '#fff', 800, 'middle') + T(150, 466, 'Forno Vivo • sem cebola', 14, '#aab4ee', 600, 'middle') + R(40, 510, 220, 52, '#2a3160', 14) + T(150, 544, 'CANCELAR PEDIDO', 15, '#ff9a8d', 800, 'middle');
    return s;
  };
  UI.cancel = (lt) => {
    const k = E.spring2(clamp(lt / 0.4)); let s = UI.timer(lt, { start: 660 - 2 });
    s += R(0, 0, 300, 600, '#000', 0, null, 0).replace('/>', ' opacity=".62"/>') + `<g transform="translate(0,${f((1 - k) * 80)})" opacity="${f(k)}">` + R(18, 170, 264, 250, '#222a5c', 20, '#4a55a8', 2) + T(150, 212, 'Cancelar entrega?', 20, '#fff', 800, 'middle') + R(34, 232, 232, 84, '#3a1f26', 12) + T(150, 266, 'Taxa de cancelamento', 13, '#ffcfc8', 600, 'middle') + T(150, 298, '− R$ 340,00', 32, RED, 800, 'middle') + T(150, 338, '(a sua semana inteira de ganhos)', 12, '#c9d2ff', 600, 'middle') + R(34, 356, 108, 48, '#3a4390', 12) + T(88, 387, 'VOLTAR', 14, '#fff', 800, 'middle') + R(158, 356, 108, 48, '#7b2a2a', 12, '#ff5a4a', 2 + 2 * Math.sin(lt * 9)) + T(212, 387, 'CANCELAR', 14, '#ffb4a8', 800, 'middle') + '</g>';
    return s;
  };
  UI.history = (lt, o = {}) => {
    const n = clamp(Math.floor((lt - (o.t0 || 0)) / (o.dt || 0.2)) + 1, 0, 11), sc = o.scroll || 0;
    let s = R(0, 0, 300, 600, BG) + status('23:56') + T(16, 70, 'Histórico do endereço', 19, '#fff', 800) + T(16, 92, 'Rua das Acácias, 14', 13, '#9aa6e8', 600);
    s += `<clipPath id="hcl"><rect x="0" y="104" width="300" height="496"/></clipPath><g clip-path="url(#hcl)"><g transform="translate(0,${f(-sc)})">`;
    for (let i = 0; i < 11; i++) { const y = 112 + i * 62, on = i < n, a = on ? 1 : 0; if (!on) continue; const pop = E.spring2(clamp((lt - (o.t0 || 0) - i * (o.dt || 0.2)) / 0.25));
      s += `<g opacity="${f(a)}" transform="translate(${f((1 - pop) * 40)},0)">` + R(12, y, 276, 54, CARD, 12, LINE, 1.5) + T(26, y + 24, '12/10/' + (2012 + i), 17, '#fff', 800) + T(26, y + 44, 'Forno Vivo • pizza grande', 12, '#9aa6e8', 600) + R(190, y + 14, 88, 26, '#4a1f26', 13) + T(234, y + 32, 'CANCELADO', 11, '#ff8a7c', 800, 'middle') + '</g>'; }
    if (n === 0) s += T(150, 310, 'Carregando histórico…', 17, '#9aa6e8', 700, 'middle') + `<circle cx="150" cy="350" r="16" fill="none" stroke="#6b7bd8" stroke-width="5" stroke-dasharray="30 80" transform="rotate(${(lt * 360) % 360} 150 350)"/>`;
    s += '</g></g>' + R(0, 540, 300, 60, '#1b2142') + T(150, 576, n === 0 ? 'endereço: Rua das Acácias, 14' : (n === 1 ? '1 cancelado' : `${n} cancelados`), 18, RED, 800, 'middle');
    return s;
  };
  // desenha o celular com um conteúdo; (cx, cy) centro em unidades da tela; k escala
  UI.phone = (cx, cy, k, content, o = {}) => {
    const hh = o.t === undefined ? [0, 0, 0] : [noise1(o.t * 0.9, 11) * 5, noise1(o.t * 0.8, 12) * 5, noise1(o.t * 0.7, 13) * 1.3];
    const shk = o.shake ? [noise1(o.t * 70, 3) * o.shake + hh[0], noise1(o.t * 80, 4) * o.shake + hh[1]] : [hh[0], hh[1]];
    return `<g transform="translate(${f(cx + shk[0])},${f(cy + shk[1])}) rotate(${(o.rot || 0) + hh[2]}) scale(${k}) translate(-150,-300)"><rect x="-12" y="-12" width="324" height="624" rx="42" fill="#0b0d1c" stroke="#2a3060" stroke-width="3"/><clipPath id="scr"><rect x="0" y="0" width="300" height="600" rx="32"/></clipPath><g clip-path="url(#scr)">${content}</g><rect x="0" y="0" width="300" height="600" rx="32" fill="none" stroke="#000" stroke-width="2" opacity=".6"/><path d="M20,20 L120,6 L84,40Z" fill="#fff" opacity=".05"/></g>`;
  };
  UI.bokeh = (t, w = 576, h = 1024, cols = ['#ffd88a', '#ffb870', '#9fb4ff']) => { let s = `<defs><linearGradient id="bkg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0d1030"/><stop offset="1" stop-color="#262c64"/></linearGradient></defs>` + R(0, 0, w, h, 'url(#bkg)'); for (let i = 0; i < 18; i++) { const x = ((rnd(i * 3.3) * (w + 200)) - (t * 40 * (0.5 + rnd(i))) % (w + 200) + (w + 200)) % (w + 200) - 100, y = 100 + rnd(i * 7.7) * (h - 200), r = 26 + rnd(i * 1.3) * 60; s += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" fill="${cols[i % 3]}" opacity="${f(0.10 + rnd(i * 5) * 0.14)}"/>`; } return s; };
  UI.paper = (cx, cy, k, lt) => { const st = E.spring(clamp((lt - 0.55) / 0.3));
    return `<g transform="translate(${cx},${cy}) rotate(-7) scale(${k})">` + `<rect x="-206" y="-158" width="412" height="316" rx="6" fill="#f4efe0" stroke="${NAVY}" stroke-width="4"/>` + T(0, -112, 'AVISO DE VENCIMENTO', 22, '#6a6a7a', 800, 'middle') + `<line x1="-176" y1="-92" x2="176" y2="-92" stroke="#b9b4a4" stroke-width="3"/>` + T(0, -34, 'ALUGUEL', 62, '#222', 800, 'middle') + T(0, 22, 'vence SEXTA-FEIRA', 30, '#c33', 800, 'middle') + T(0, 78, 'R$ 1.250,00', 38, '#222', 800, 'middle') + `<g transform="translate(60,96) rotate(-14) scale(${f(0.4 + 0.6 * st)})" opacity="${f(clamp(st))}"><rect x="-120" y="-30" width="240" height="60" rx="8" fill="none" stroke="#d33" stroke-width="7"/>${T(0, 14, 'ÚLTIMO AVISO', 34, '#d33', 800, 'middle')}</g></g>`; };
  G.UI3 = UI;
})(window);
