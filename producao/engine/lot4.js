// lot4.js — o terreno visto de frente, em perspectiva de 1 ponto. A casa demolida aparece como MARCA FANTASMA na parede do vizinho
// (quartos, azulejos, escada, número 14), laje com degraus que não levam a lugar nenhum, porta solta, mato e a mesa com luz ao fundo.
(function (G) {
  const { f, rnd, noise1, shade, mix, NAVY } = G.L; const { R, C, Pth, lg, rg } = G.SETS; const W = G.WORLD; const { drawChar, EXPR, POSE } = G.CH;
  const HY = 520, D0 = 8, Y0 = 710, HALF = 2.6;
  const sc = d => 0.5 * D0 / (D0 + d), gy = d => HY + 380 * sc(d), PX = d => 210 * sc(d);
  const X = (xm, d) => 288 + xm * PX(d), Y = (d, h) => gy(d) - h * PX(d);
  const pt = (xm, d, h) => `${f(X(xm, d))},${f(Y(d, h))}`;
  // polígono sobre uma parede lateral (lado -1 esquerda, +1 direita) entre profundidades d0..d1 e alturas h0..h1 (bordas amostradas p/ manter a perspectiva)
  function wallQuad(side, d0, d1, h0, h1, n = 10, jag = 0, seed = 1) {
    const xm = side * HALF, pts = [];
    for (let i = 0; i <= n; i++) { const d = d0 + (d1 - d0) * i / n; pts.push(`${f(X(xm, d))},${f(Y(d, h0) + (jag ? (rnd(seed + i) - 0.5) * jag * sc(d) : 0))}`); }
    for (let i = n; i >= 0; i--) { const d = d0 + (d1 - d0) * i / n; pts.push(`${f(X(xm, d))},${f(Y(d, h1) + (jag ? (rnd(seed * 3 + i) - 0.5) * jag * sc(d) : 0))}`); }
    return pts.join(' ');
  }
  const poly = (pts, fill, op = 1, st = null, sw = 2) => `<polygon points="${pts}" fill="${fill}" opacity="${op}"${st ? ` stroke="${st}" stroke-width="${sw}" stroke-linejoin="round"` : ''}/>`;
  const wallText = (side, d0, h0, d1, h1, text, fill, size) => { // texto "colado" na parede em perspectiva (matriz afim aproximada)
    const xm = side * HALF, x0 = X(xm, d0), y0 = Y(d0, h0), x1 = X(xm, d1), y1 = Y(d1, h0), xv = X(xm, d0), yv = Y(d0, h1), w = 100, h = 100;
    const a = (x1 - x0) / w, b = (y1 - y0) / w, c = (xv - x0) / h, d = (yv - y0) / h;
    return `<g transform="matrix(${f(a)},${f(b)},${f(c)},${f(d)},${f(x0)},${f(y0)})"><text x="0" y="0" font-family="Inter" font-weight="800" font-size="${size}" fill="${fill}">${text}</text></g>`;
  };
  function grassClump(x, y, hpx, seed, t, cols) {
    let g = ''; for (let k = 0; k < 7; k++) { const r = rnd(seed * 7.3 + k), h = hpx * (0.45 + r * 0.75), lean = (k - 3) * h * 0.12 + Math.sin(t * 1.5 + seed + k) * h * 0.06 + noise1(t * 0.9 + seed, 3) * h * 0.05, bx = x + (k - 3) * hpx * 0.05, w = hpx * 0.055 + 1.2;
      g += `<path d="M${f(bx - w)},${f(y)} Q${f(bx + lean * 0.3)},${f(y - h * 0.6)} ${f(bx + lean)},${f(y - h)} Q${f(bx + lean * 0.5 + w)},${f(y - h * 0.5)} ${f(bx + w)},${f(y)}Z" fill="${cols[(k + (seed | 0)) % cols.length]}" stroke="#0e1a1c" stroke-width="${f(Math.max(0.6, hpx * 0.012))}"/>`; }
    return g;
  }
  function lotFront(t, o = {}) {
    const glowA = o.glowA === undefined ? 1 : o.glowA; let s = '';
    // fundo: parede cega do prédio de trás + janelas apagadas
    const bx0 = X(-HALF, 14), bx1 = X(HALF, 14), by0 = Y(14, 0), by1 = Y(14, 4.4);
    s += R(bx0, by1, bx1 - bx0, by0 - by1, '#262a58', 0, null, 0) + R(bx0, by1, bx1 - bx0, 9, '#1a1d44');
    for (let c = 0; c < 3; c++) s += R(bx0 + 22 + c * 58, by1 + 22, 24, 26, rnd(c * 2.3) > 0.55 ? '#e9c27a' : '#1c2048', 2, '#12153a', 2);
    s += R(bx0 - 3, by1 - 6, bx1 - bx0 + 6, 8, '#14183c', 0, null, 0);
    // chão (terra) + laje de concreto (fundação) com rachaduras
    s += `<defs>${lg('soil', 0, Y(14, 0), 0, Y0 + 4, [[0, '#1d2328'], [1, '#33383a']])}</defs>` + poly(`${pt(-HALF, 14, 0)} ${pt(HALF, 14, 0)} ${pt(HALF, 0, 0)} ${pt(-HALF, 0, 0)}`, 'url(#soil)');
    const slab = `${pt(-2.0, 10.8, 0)} ${pt(2.0, 10.8, 0)} ${pt(2.0, 1.4, 0)} ${pt(-2.0, 1.4, 0)}`;
    s += poly(slab, '#6e7391', 1, '#3b3f63', 2.5);
    for (let i = 0; i < 5; i++) { const d = 2.2 + i * 1.8, x0 = -1.6 + (i * 0.83) % 3.0; s += `<path d="M${pt(x0, d, 0)} L${pt(x0 + 0.35, d + 0.18, 0)} L${pt(x0 + 0.2, d + 0.5, 0)}" stroke="#4a4e70" stroke-width="${f(0.9 + 1.2 * sc(d))}" fill="none" stroke-linecap="round"/>`; }
    for (let i = 2; i < 11; i += 2.2) s += `<line x1="${f(X(-2.0, i))}" y1="${f(gy(i))}" x2="${f(X(2.0, i))}" y2="${f(gy(i))}" stroke="#565b7c" stroke-width="1.2" opacity=".6"/>`;
    // parede ESQUERDA: a casa que existiu (marca fantasma)
    s += poly(wallQuad(-1, 0, 14, 0, 11, 12), '#675b80', 1, '#2a2548', 2.5);
    s += poly(wallQuad(-1, 0.9, 10.4, 0, 7.6, 10, 10, 4), '#5a4f72', 0.8);                                  // mancha da silhueta (empena do telhado)
    s += poly(wallQuad(-1, 1.0, 5.3, 0, 3.0, 8, 12, 5), '#d3b86a', 0.92) + poly(wallQuad(-1, 5.3, 10.2, 0, 3.0, 8, 12, 9), '#c9d4da', 0.92);       // sala amarela, cozinha de azulejo
    s += poly(wallQuad(-1, 1.0, 4.7, 3.1, 6.0, 8, 12, 12), '#d68ea4', 0.92) + poly(wallQuad(-1, 4.7, 10.2, 3.1, 6.0, 8, 12, 15), '#6aa7cd', 0.92);   // quarto rosa, banheiro azul
    for (let i = 0; i <= 8; i++) { const d = 5.3 + i * 0.6; s += `<polyline points="${wallQuad(-1, d, d, 0, 3.0, 1).split(' ').join(' ')}" fill="none" stroke="#9aa8b0" stroke-width="1.2" opacity=".7"/>`; }   // junta do azulejo da cozinha
    for (let i = 0; i <= 6; i++) { const h = i * 0.5; s += `<polyline points="${wallQuad(-1, 4.7, 10.2, h, h, 5).split(' ').slice(0, 6).join(' ')}" fill="none" stroke="#3f7ba6" stroke-width="1.2" opacity=".7"/>`; }
    s += poly(wallQuad(-1, 5.3, 6.0, 3.0, 3.1, 2), '#3a3350', 0.9);
    // escada fantasma: faixa diagonal entre os pavimentos
    s += `<polygon points="${[0, 1, 2, 3, 4, 5, 6].map(i => `${f(X(-HALF, 5.6 + i * 0.55))},${f(Y(5.6 + i * 0.55, 0.5 + i * 0.4))}`).join(' ')} ${[6, 5, 4, 3, 2, 1, 0].map(i => `${f(X(-HALF, 5.6 + i * 0.55))},${f(Y(5.6 + i * 0.55, 0.0 + i * 0.4))}`).join(' ')}" fill="#4b4262" opacity=".85"/>`;
    s += poly(wallQuad(-1, 2.3, 3.2, 0, 2.1, 4), '#463a52', 0.9) + poly(wallQuad(-1, 7.2, 8.6, 1.2, 2.2, 4), '#463a52', 0.7);   // marca de porta e janela
    s += wallText(-1, 1.3, 1.1, 4.6, 2.5, '14', '#fff4d6', 118);
    // parede DIREITA: prédio vizinho, vivo (janelas acesas)
    s += poly(wallQuad(1, 0, 14, 0, 11, 12), '#34476e', 1, '#1d2748', 2.5);
    for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) { const d0 = 1.6 + c * 2.9, h0 = 1.2 + r * 3.0, on = rnd(r * 5 + c * 1.3) > 0.45; s += poly(wallQuad(1, d0, d0 + 1.5, h0, h0 + 1.5, 4), on ? '#ffd88a' : '#1e2850', 1, '#14183a', 1.6); }
    // restos: degraus que não levam a lugar algum + porta solta
    for (let k = 0; k < 3; k++) { const d = 3.6 + k * 0.7, hh = 0.18 * (k + 1); s += poly(`${pt(-2.0, d, 0)} ${pt(-0.7, d, 0)} ${pt(-0.7, d, hh)} ${pt(-2.0, d, hh)}`, shade('#7a7f9c', -k * 0.08), 1, '#34385c', 2) + poly(`${pt(-2.0, d, hh)} ${pt(-0.7, d, hh)} ${pt(-0.7, d + 0.7, hh)} ${pt(-2.0, d + 0.7, hh)}`, '#8d92ae', 1, '#34385c', 1.5); }
    { const dd = 6.4, x0 = -1.75, w = 0.95, h = 2.1; s += poly(`${pt(x0, dd, 0)} ${pt(x0 + w, dd, 0)} ${pt(x0 + w, dd, h)} ${pt(x0, dd, h)}`, '#171b40', 0.6) + `<polyline points="${pt(x0, dd, 0)} ${pt(x0, dd, h)} ${pt(x0 + w, dd, h)} ${pt(x0 + w, dd, 0)}" fill="none" stroke="#8a6a44" stroke-width="${f(8 * sc(dd) * 2.2)}" stroke-linejoin="round"/><polyline points="${pt(x0, dd, 0)} ${pt(x0, dd, h)} ${pt(x0 + w, dd, h)} ${pt(x0 + w, dd, 0)}" fill="none" stroke="${NAVY}" stroke-width="1.6" opacity=".6"/>`; }
    // mato: tufos por profundidade (de trás para frente), com clareira em volta da mesa (ela mantém o lugar limpo)
    const cols = ['#3c6a54', '#2f5a48', '#4a7a5c', '#33624f'];
    const clumps = []; for (let i = 0; i < 90; i++) { const d = 0.5 + rnd(i * 2.1) * 13, xm = (rnd(i * 5.7) * 2 - 1) * (HALF - 0.1); if (d > 8.6 && Math.abs(xm - 0.1) < 1.35) continue; if (d < 10.8 && Math.abs(xm - 0.7) < 1.7) continue; if (d > 1.4 && d < 10.8 && Math.abs(xm) < 1.9 && rnd(i * 9) > 0.18) continue; clumps.push([d, xm, i]); }
    clumps.sort((a, b) => b[0] - a[0]);
    // mesa + luz ao fundo
    const dT = 11.3, tx = 0.1; const tpx = PX(dT), tgy = gy(dT);
    const bulbY = Y(dT, 2.35), bulbX = X(tx, dT);
    s += `<defs>${rg('warmL', bulbX, bulbY, tpx * 3.2, [[0, '#fff0b8', 0.95], [0.35, '#ffd27a', 0.5], [1, '#ffb04a', 0]])}${lg('cone', 0, bulbY, 0, tgy, [[0, '#ffe9a8', 0.55], [1, '#ffe9a8', 0.0]])}</defs>`;
    s += `<g opacity="${f(glowA)}"><circle cx="${f(bulbX)}" cy="${f(bulbY)}" r="${f(tpx * 3.2)}" fill="url(#warmL)"/><polygon points="${f(bulbX - 7)},${f(bulbY + 6)} ${f(bulbX + 7)},${f(bulbY + 6)} ${f(bulbX + tpx * 1.9)},${f(tgy)} ${f(bulbX - tpx * 1.9)},${f(tgy)}" fill="url(#cone)"/><ellipse cx="${f(bulbX)}" cy="${f(tgy + 2)}" rx="${f(tpx * 2.0)}" ry="${f(tpx * 0.28)}" fill="#ffe9a8" opacity=".35"/></g>`;
    const table = () => { let g = `<g transform="translate(${f(bulbX)},${f(tgy)}) scale(${f(tpx / 210)})">`;
      g += `<ellipse cx="0" cy="6" rx="${m(1.2)}" ry="9" fill="#000" opacity=".3"/>` + R(-m(0.3), -m(0.45), m(0.4), 10, '#7a5a3a', 3, NAVY, 3) + R(-m(0.28), -m(0.45), 8, m(0.45), '#7a5a3a', 1) + R(-m(1.0), -m(0.45), m(0.4), 10, '#7a5a3a', 3, NAVY, 3) + R(-m(0.98), -m(0.45), 8, m(0.45), '#7a5a3a', 1);
      return g + '</g>'; };
    const m = W.m;
    // poste de madeira com fio e lâmpada
    s += `<g opacity="1">` + `<g transform="translate(${f(X(1.55, dT - 0.4))},${f(gy(dT - 0.4))}) scale(${f(PX(dT - 0.4) / 210)})">${R(-6, -m(2.9), 12, m(2.9), '#6b4d34', 2, NAVY, 3.5)}<path d="M0,${-m(2.85)} Q${-m(0.8)},${-m(2.95)} ${-m(1.45)},${-m(2.4)}" fill="none" stroke="#222" stroke-width="3"/></g>`;
    s += `<g transform="translate(${f(bulbX)},${f(bulbY)}) scale(${f(Math.max(0.5, tpx / 210))})"><circle r="${16}" fill="#fff6cf" stroke="${NAVY}" stroke-width="3"/><circle r="26" fill="#fff0b8" opacity=".5"/></g></g>`;
    // atrás: cadeira vazia (a dele) e prato; depois dona Cida e a mesa na frente dela
    const cs = W.charScale(1.58) * sc(dT), chairL = bulbX - m(0.95) * tpx / 210, chairR = bulbX + m(0.95) * tpx / 210;
    const u = tpx / 210;
    s += `<g transform="translate(${f(bulbX)},${f(tgy)}) scale(${f(u)})">` + R(-m(1.14), -m(0.5), m(0.42), 8, '#7a5a3a', 3, NAVY, 2.5) + R(-m(1.12), -m(0.5), 6, m(0.5), '#7a5a3a', 1) + R(-m(0.72), -m(0.5), 6, m(0.5), '#7a5a3a', 1) + R(-m(1.14), -m(0.95), 6, m(0.46), '#7a5a3a', 1) + '</g>';       // cadeira vazia (esquerda)
    s += o.cida ? (o.cidaDim ? `<g opacity="${o.cidaDim}">` : '<g>') + drawChar({ cast: 'cida', x: bulbX + m(0.85) * u, y: tgy - 3 * u, s: cs, flip: 1, t, ph: 2.2, pose: POSE.sit, expr: o.cidaExpr || EXPR.calm, look: [288, 760], turn: -0.05, light: { ox: -1, oy: -0.6, rim: '#ffe0a0' } }).svg + '</g>' : '';
    s += `<g transform="translate(${f(bulbX)},${f(tgy)}) scale(${f(u)})">` + R(-m(0.55), -m(0.82), m(1.15), 12, '#c9a06a', 4, NAVY, 3) + R(-m(0.5), -m(0.82) + 12, 10, m(0.82) - 12, '#8d6a42', 2) + R(m(0.45), -m(0.82) + 12, 10, m(0.82) - 12, '#8d6a42', 2) + R(-m(0.55) + 3, -m(0.88), m(1.15) - 6, 7, '#f4efe0', 3, NAVY, 2) +
      `<ellipse cx="${-m(0.3)}" cy="${-m(0.9)}" rx="${m(0.17)}" ry="8" fill="#fff" stroke="${NAVY}" stroke-width="2.4"/><ellipse cx="${m(0.35)}" cy="${-m(0.9)}" rx="${m(0.17)}" ry="8" fill="#fff" stroke="${NAVY}" stroke-width="2.4"/>` + R(-m(0.05), -m(1.0), m(0.2), 16, '#e8553d', 2, NAVY, 2) + R(m(0.05), -m(1.18), 5, 16, '#fff', 1, NAVY, 1.6) + C(m(0.07) + 2, -m(1.2), 4, '#ffcf55', null) + '</g>';       // prato dele, prato dela, caixa de pizza e vela
    // mato por cima do chão, de trás para a frente
    clumps.forEach(([d, xm, i]) => { const hm = d < 4 ? 0.35 + rnd(i) * 0.4 : 0.6 + rnd(i) * 0.95; s += grassClump(X(xm, d), gy(d), hm * PX(d), i + 1, t, cols); });
    // calçada, grade e pilares na frente do terreno
    s += R(-300, Y0, 1200, 100, '#6a6d91', 0, null, 0) + R(-300, Y0, 1200, 8, '#8c90b4') + R(-300, 806, 1200, 14, '#9a9dc2', 0, NAVY, 3) + `<ellipse cx="420" cy="772" rx="24" ry="7" fill="#3d4066" stroke="${NAVY}" stroke-width="2.5"/>`;
    for (let i = 0; i < 18; i++) s += `<line x1="${f(40 + i * 28)}" y1="${f(Y0 - 140)}" x2="${f(40 + i * 28)}" y2="${Y0}" stroke="#8a90b8" stroke-width="0.7" opacity=".3"/>`;
    s += `<line x1="20" y1="${Y0 - 2}" x2="556" y2="${Y0 - 2}" stroke="#6d749c" stroke-width="3"/>`;
    
    const pil = (x) => `<g transform="translate(${x},${Y0})">` + R(-17, -240, 34, 240, '#7a7f9e', 2, NAVY, W.stroke) + R(-22, -252, 44, 14, '#5d6282', 2, NAVY, 3.5) + '</g>';
    s += pil(16) + pil(560);
    s += `<g transform="translate(16,${Y0})">` + R(-13, -205, 26, 34, '#f4efe0', 3, NAVY, 2.6) + `<text x="0" y="-180" font-family="Inter" font-weight="800" font-size="18" fill="#c33" text-anchor="middle">14</text></g>`;
    s += `<g transform="translate(472,${Y0 - 92})">` + R(-62, -34, 124, 64, '#f4efe0', 4, NAVY, 3) + R(-62, -34, 124, 18, '#c0392b', 3, NAVY, 3) + `<text x="0" y="-21" font-family="Inter" font-weight="800" font-size="11" fill="#fff" text-anchor="middle">VENDE-SE</text><text x="0" y="3" font-family="Inter" font-weight="800" font-size="14" fill="#1d2747" text-anchor="middle">TERRENO</text><text x="0" y="21" font-family="Inter" font-weight="700" font-size="9" fill="#555" text-anchor="middle">Tel. 3322-1994</text></g>`;
    s += `<g transform="translate(40,${Y0})"><path d="M0,-4 L74,-136 L82,-130 L10,2Z" fill="none" stroke="#5d6282" stroke-width="5"/><path d="M14,-12 L70,-112 M28,-20 L78,-110" stroke="#5d6282" stroke-width="2.4"/></g>`;   // folha do portão caída
    return s;
  }
  G.LOT4 = { lotFront, sc, gy, PX, X, Y, HY, Y0 };
})(window);
