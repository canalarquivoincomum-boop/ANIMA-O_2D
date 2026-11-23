// kit.js — peças comuns às duas histórias do Nando: elenco extra, objetos (capacete, caixas, celular), fundos desfocados, plano "conversa à mesa",
// lip-sync pelas palavras reais da narração e push-in de câmera para planos 'screen'.
(function (G) {
  const { f, rnd, noise1, E, clamp, lerp, shade, mix, track, NAVY } = G.L; const { R, C, Pth, lg, rg } = G.SETS; const W = G.WORLD, { m } = W;
  const CH = G.CH, { drawChar, EXPR, POSE, POSE0, CAST, path, ell, hand } = CH; const K = {};
  const T = (x, y, s, sz, fill, w = 800, a = 'middle', ex = '') => `<text x="${f(x)}" y="${f(y)}" font-family="Inter" font-weight="${w}" font-size="${sz}" fill="${fill}" text-anchor="${a}" ${ex}>${s}</text>`;
  K.T = T;
  // ---------- elenco extra ----------
  Object.assign(CAST, {
    aniba: { skin: '#c58f6c', hair: '#e6e1dc', cloth: '#a38a62', cloth2: '#85704c', pants: '#4a4258', shoe: '#3a2f2a', sock: '#d8d2c6', W: 56, H: 57, style: 'bald', limb: [36, 34, 20], torso: 'coat', mustache: '#ece8e2', brow: '#a09a95', nose: 1.9, wrinkle: 1, glasses: 1 },
    porteiro: { skin: '#b98a62', hair: '#2a2222', cloth: '#4f6fa8', cloth2: '#3b5886', pants: '#33405e', shoe: '#2a2a30', sock: '#d8d2c6', W: 62, H: 54, style: 'cap', cap: '#3b5886', limb: [38, 36, 21], torso: 'jacket', mustache: '#2a2222', brow: '#2a2222', nose: 1.6 },
    lucia: { longSleeve: 1, skin: '#c4896a', hair: '#3a2a28', cloth: '#6fa383', cloth2: '#54866a', pants: '#4a4a5e', shoe: '#5a4a4a', sock: '#e8e0dc', W: 54, H: 52, style: 'bun', limb: [34, 33, 18], torso: 'dress', brow: '#3a2a28', nose: 1.2, lash: 1 },
    ze: { skin: '#a8714e', hair: '#1c1618', cloth: '#c9473d', cloth2: '#a3352d', pants: '#2b2f45', shoe: '#2a2a30', sock: '#2a2a30', W: 54, H: 50, style: 'short', limb: [38, 36, 21], torso: 'jacket', brow: '#1c1618', nose: 1.3, stripes: 1 },
    v1: { skin: '#e0b090', hair: '#b4572f', cloth: '#d97b8a', cloth2: '#b8566a', pants: '#4a4a6a', shoe: '#6a4f5e', sock: '#fff', W: 56, H: 52, style: 'curly', limb: [34, 33, 18], torso: 'dress', brow: '#b4572f', nose: 1.1, lash: 1, freckles: 1 },
    v2: { skin: '#8a5a3d', hair: '#1c1618', cloth: '#5a9a6a', cloth2: '#437a52', pants: '#3a3f5a', shoe: '#2a2a30', sock: '#d8d2c6', W: 58, H: 54, style: 'bald', limb: [38, 36, 21], torso: 'jacket', brow: '#1c1618', nose: 1.5, mustache: '#1c1618' },
    v3: { skin: '#d9a888', hair: '#6d6a6a', cloth: '#c98a3a', cloth2: '#a66e28', pants: '#4a4f6e', shoe: '#3a2b2a', sock: '#d8d2c6', W: 60, H: 54, style: 'cap', cap: '#4a7fa8', limb: [38, 36, 21], torso: 'coat', brow: '#5a5656', nose: 1.5 },
    v4: { longSleeve: 1, skin: '#b9774f', hair: '#2a1b1d', cloth: '#7a6fb8', cloth2: '#5e5498', pants: '#3a3f5a', shoe: '#6a4f5e', sock: '#e8e0dc', W: 54, H: 52, style: 'curly', limb: [34, 33, 18], torso: 'dress', brow: '#2a1b1d', nose: 1.1, lash: 1 },
    v5: { skin: '#f0c7a5', hair: '#8a6a3a', cloth: '#4aa3b8', cloth2: '#348298', pants: '#3a3f5a', shoe: '#2a2a30', sock: '#d8d2c6', W: 54, H: 52, style: 'short', limb: [38, 36, 21], torso: 'jacket', brow: '#8a6a3a', nose: 1.3 },
    v6: { skin: '#c4896a', hair: '#ece8e6', cloth: '#d9b04a', cloth2: '#b58f32', pants: '#6a4f5e', shoe: '#6a4f5e', sock: '#e8e0dc', W: 54, H: 52, style: 'bun', limb: [34, 33, 18], torso: 'dress', brow: '#b8b2ae', nose: 1.3, wrinkle: 1, glasses: 1 }
  });
  // ---------- boca sincronizada com as palavras reais (só para quem FALA em cena) ----------
  K.mouth = (t, ids) => { const W_ = window.WORDS; for (let i = 0; i < W_.length; i++) { const w = W_[i]; if (ids.includes(w.id) && t >= w.ini - 0.03 && t <= w.fim + 0.02) { const a = 0.3 + 0.5 * Math.abs(Math.sin(t * 15 + i)); return { mo: a, mw: 11 + a * 4, mc: 0.3 }; } } return null; };
  K.wordAt = (id, k) => { const ws = window.WORDS.filter(w => w.id === id); return (ws[Math.min(k, ws.length - 1)] || { ini: 0 }).ini; };   // início da k-ésima palavra da frase
  K.ptr = (cx, cy, z, svg) => { cx = clamp(cx, 288 / z, 576 - 288 / z); cy = clamp(cy, 512 / z, 1024 - 512 / z); return `<g transform="translate(288,512) scale(${f(z)}) translate(${f(-cx)},${f(-cy)})">${svg}</g>`; };
  K.push = (lt, dur, z0, z1, cx = 288, cy = 512) => ({ z: lerp(z0, z1, E.io(clamp(lt / dur))), cx, cy });
  K.pz = (svg, lt, dur, z0, z1, cx = 288, cy = 512) => { const c = K.push(lt, dur, z0, z1, cx, cy); return K.ptr(lerp(288, cx, E.io(clamp(lt / dur))), lerp(512, cy, E.io(clamp(lt / dur))), c.z, svg); };
  // ---------- objetos ----------
  K.helmetProp = (o = {}) => {                 // capacete de lado, olhando p/ direita; origem no centro da base; ~160 × 125
    const shell = o.neo ? '#e24a36' : '#c8483a', dk = shade(shell, -0.35), id = 'hp' + Math.floor(rnd(o.seed || 3) * 1e4);
    const body = 'M-74,0 C-84,-82 -32,-126 24,-120 C80,-114 98,-60 92,-4 C60,8 -40,10 -74,0Z';
    let s = `<path d="${body}" fill="${shell}" stroke="${NAVY}" stroke-width="4.5" stroke-linejoin="round"/>` + CH.lit(body, 7, dk, 0.55, 0.5);
    s += `<path d="M-64,-50 C-30,-100 20,-116 62,-110" stroke="#fff" stroke-width="9" fill="none" opacity=".9" stroke-linecap="round"/><path d="M-50,-30 C-30,-60 -10,-80 6,-92" stroke="#fff" stroke-width="3" fill="none" opacity=".35" stroke-linecap="round"/>`;
    s += `<path d="M28,-88 C62,-92 90,-74 94,-40 L40,-36 C32,-52 28,-70 28,-88Z" fill="#141c38" stroke="${NAVY}" stroke-width="3.4"/><path d="M40,-80 L74,-80 M38,-68 L58,-68" stroke="#9fc4ff" stroke-width="3" opacity=".5" stroke-linecap="round"/>`;
    s += `<path d="M40,-36 L94,-32 L92,-4 C62,6 42,6 30,2Z" fill="${dk}" stroke="${NAVY}" stroke-width="3.4"/>`;
    if (o.neo) s += `<g transform="translate(-30,-36) rotate(-8)"><rect x="-26" y="-12" width="52" height="24" rx="6" fill="#fff6d8" stroke="${NAVY}" stroke-width="2.4"/>${T(0, 4, 'FORNO VIVO', 7.5, '#c33', 800)}</g>`;
    if (o.crack) s += `<path d="M-22,-114 L-10,-94 L-26,-78 L-8,-60 L-20,-44 L-12,-26" fill="none" stroke="${NAVY}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/><path d="M-22,-114 L-10,-94 L-26,-78 L-8,-60 L-20,-44 L-12,-26" fill="none" stroke="#2a1410" stroke-width="1.6" stroke-linejoin="round"/>`;
    if (o.tape) s += `<g transform="translate(-16,-70) rotate(-16)"><rect x="-13" y="-56" width="26" height="112" rx="2" fill="#26262e" stroke="${NAVY}" stroke-width="2.6"/><path d="M-13,-30 L13,-27 M-13,2 L13,5 M-13,30 L13,26" stroke="#4a4a56" stroke-width="2" opacity=".8"/><path d="M-9,-52 L-9,50" stroke="#6a6a7a" stroke-width="2" opacity=".5"/></g>`;
    return s;
  };
  K.phoneProp = (scr = '#4a6bff') => `<g><rect x="-16" y="-34" width="32" height="62" rx="6" fill="#0b0d1c" stroke="${NAVY}" stroke-width="3"/><rect x="-12.5" y="-30" width="25" height="52" rx="4" fill="${scr}"/><rect x="-12.5" y="-30" width="25" height="52" rx="4" fill="#9fb4ff" opacity=".25"/></g>`;
  K.pizzaBox = (w = 210, o = {}) => `<g><path d="M${-w / 2},0 L${w / 2},0 L${w / 2 + 12},${w * 0.3} L${-w / 2 - 12},${w * 0.3}Z" fill="#b8793f" stroke="${NAVY}" stroke-width="3.5"/><path d="M${-w / 2},0 L${w / 2},0 L${w / 2 - 10},${-w * 0.1} L${-w / 2 + 10},${-w * 0.1}Z" fill="#d9a35d" stroke="${NAVY}" stroke-width="3.5"/>${T(0, w * 0.17, 'FORNO VIVO', w * 0.095, '#fff3d6', 800)}${o.sub === false ? '' : T(0, w * 0.26, 'sem cebola', w * 0.066, '#ffe1a8', 700)}</g>`;
  K.giftBox = (w = 200, lid = 0) => { const h = w * 0.62; return `<g><rect x="${-w / 2}" y="${-h}" width="${w}" height="${h}" rx="6" fill="#e9d3a0" stroke="${NAVY}" stroke-width="4"/><rect x="-14" y="${-h}" width="28" height="${h}" fill="#d33f55" stroke="${NAVY}" stroke-width="2.6"/><g transform="translate(${f(-lid * w * 0.5)},${f(-lid * w * 0.22)}) rotate(${f(-lid * 34)} ${-w / 2} ${-h})"><rect x="${-w / 2 - 8}" y="${-h - 28}" width="${w + 16}" height="30" rx="6" fill="#cdb27a" stroke="${NAVY}" stroke-width="4"/><rect x="-14" y="${-h - 28}" width="28" height="30" fill="#d33f55" stroke="${NAVY}" stroke-width="2.6"/><path d="M0,${-h - 28} C-50,${-h - 84} -76,${-h - 30} -8,${-h - 28} M0,${-h - 28} C50,${-h - 84} 76,${-h - 30} 8,${-h - 28}" fill="#d33f55" stroke="${NAVY}" stroke-width="3.4"/><circle cx="0" cy="${-h - 30}" r="9" fill="#b92f44" stroke="${NAVY}" stroke-width="3"/></g></g>`; };
  // braço + luva do Nando entrando em quadro (para planos fechados em objetos): do ponto (x0,y0) até a mão (x1,y1)
  K.armIn = (x0, y0, x1, y1, g = 'mitt', cast = 'nando') => { const c = CAST[cast], t = CH.tube([x0, y0], [(x0 + x1) / 2 + 10, (y0 + y1) / 2 + 30], [x1, y1], 62, 44, 10), ang = Math.atan2(y1 - y0, x1 - x0) * 180 / Math.PI; return CH.colorOutlines(path(t.d, c.cloth) + CH.lit(t.d, 6, c.cloth2, 0.8, 0.2) + path(CH.tube([lerp(x0, x1, 0.82), lerp(y0, y1, 0.82)], [lerp(x0, x1, 0.88), lerp(y0, y1, 0.88)], [lerp(x0, x1, 0.94), lerp(y0, y1, 0.94)], 50, 50, 3).d, shade(c.cloth, 0.3), NAVY, 3) + `<g transform="translate(${f(x1)},${f(y1)}) scale(3.0)">${hand(c, [0, 0], ang, g)}</g>`); };
  // ---------- fundos desfocados ----------
  K.ghostWall = (t) => {    // a cozinha de azulejo que existiu (desfocada) + lâmpada acesa
    const blur = n => `<g filter="url(#bl${n})">`; let s = `<defs><linearGradient id="cwg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a2236"/><stop offset="1" stop-color="#0f0e20"/></linearGradient><radialGradient id="cgl" cx="0.58" cy="0.06" r="0.85"><stop offset="0" stop-color="#ffe6a6" stop-opacity=".85"/><stop offset="0.45" stop-color="#ffc468" stop-opacity=".32"/><stop offset="1" stop-color="#ffb04a" stop-opacity="0"/></radialGradient></defs><rect width="576" height="1024" fill="url(#cwg)"/>`;
    s += blur(12) + R(-40, -40, 330, 760, '#cdb468') + R(280, -40, 340, 760, '#c9d4da') + R(-40, -40, 700, 150, '#c98aa0');
    for (let i = 0; i < 14; i++) s += `<line x1="${280 + i * 28}" y1="110" x2="${280 + i * 28}" y2="720" stroke="#8fa0aa" stroke-width="4"/>`;
    for (let j = 0; j < 12; j++) s += `<line x1="280" y1="${110 + j * 52}" x2="620" y2="${110 + j * 52}" stroke="#8fa0aa" stroke-width="4"/>`;
    s += R(60, 190, 120, 380, '#463a52', 0) + '</g>';
    s += `<rect width="576" height="1024" fill="#0c0a1e" opacity=".52"/><rect width="576" height="1024" fill="url(#cgl)"/>`;
    s += `<circle cx="336" cy="50" r="22" fill="#fff6cf" stroke="${NAVY}" stroke-width="3"/><circle cx="336" cy="50" r="46" fill="#fff0b8" opacity=".35"/><line x1="336" y1="-10" x2="336" y2="30" stroke="#222" stroke-width="3"/>`;
    s += blur(6); for (let i = 0; i < 14; i++) { const x = i < 7 ? -10 + i * 18 : 500 + (i - 7) * 18, h = 260 + (i % 4) * 60; s += `<path d="M${x},760 Q${x + 12 + Math.sin(t + i) * 6},${760 - h * 0.6} ${x + 22 + Math.sin(t * 1.3 + i) * 8},${760 - h} Q${x + 30},${760 - h * 0.5} ${x + 36},760Z" fill="#0d1c1a"/>`; } return s + '</g>';
  };
  K.streetBack = (t) => {   // a rua à noite desfocada, com a moto de entregas estacionada ao fundo
    const blur = n => `<g filter="url(#bl${n})">`; let s = `<defs><linearGradient id="sbg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0d1030"/><stop offset="0.7" stop-color="#2b2f66"/><stop offset="1" stop-color="#1a1d44"/></linearGradient><radialGradient id="sgl" cx="0.85" cy="0.12" r="0.8"><stop offset="0" stop-color="#ffe9a8" stop-opacity=".7"/><stop offset="1" stop-color="#ffd878" stop-opacity="0"/></radialGradient></defs><rect width="576" height="1024" fill="url(#sbg)"/>`;
    s += blur(10) + R(-40, 160, 190, 560, '#3a3478') + R(160, 230, 180, 490, '#6a4062') + R(350, 120, 260, 600, '#2f4f78');
    for (let i = 0; i < 18; i++) s += R(-20 + (i % 6) * 100, 200 + Math.floor(i / 6) * 150, 40, 56, rnd(i * 2.1) > 0.5 ? '#ffcf78' : '#1c2048', 2);
    s += R(-60, 700, 700, 340, '#2e3250') + R(-60, 680, 700, 30, '#6d6f93') + '</g>';
    s += blur(8) + `<g transform="translate(110,720) scale(0.95)">${W.moto(0, t, 0, {})}</g>` + `<g transform="translate(486,720) scale(1.0)">${R(-8, -m(4.6), 16, m(4.6), '#4d5470', 3, NAVY, 4)}${R(0, -m(4.9), 90, 16, '#ffe9a8', 5, NAVY, 3)}</g></g>`;
    s += `<rect width="576" height="1024" fill="#0c0a1e" opacity=".34"/><rect width="576" height="1024" fill="url(#sgl)"/>`;
    for (let i = 0; i < 9; i++) s += `<circle cx="${f(60 + rnd(i * 4.2) * 460)}" cy="${f(120 + rnd(i * 6.6) * 420)}" r="${f(18 + rnd(i) * 30)}" fill="${['#ffd88a', '#9fb4ff', '#ffb870'][i % 3]}" opacity=".13" filter="url(#bl12)"/>`;
    return s;
  };
  // ---------- plano de conversa à mesa (Nando / Cida), cada um atrás da mesa ----------
  // o: bg 'ghost'|'street'; pose, expr (funções de lt ou objetos), look, turn, speakIds (frases em que ESTE personagem fala), items [..], sy (y do personagem)
  K.talk = (who, t, lt, o) => {
    let s = o.bg === 'street' ? K.streetBack(t) : K.ghostWall(t);
    const pose = typeof o.pose === 'function' ? o.pose(lt) : (o.pose || POSE.sit), ex = Object.assign({}, EXPR.calm, typeof o.expr === 'function' ? o.expr(lt) : (o.expr || {}));
    const mo = o.speakIds ? K.mouth(t, o.speakIds) : null; if (mo) Object.assign(ex, mo);
    const look = typeof o.look === 'function' ? o.look(lt) : (o.look || [288, 400]);
    const lightc = who === 'cida' ? { ox: -1, oy: -0.7, rim: '#ffe0a0' } : { ox: 1, oy: -0.8, rim: '#ffe9a8' };
    const ch = drawChar({ cast: who, x: o.cx || 288, y: o.sy || 740, s: o.s || 1.9, flip: 1, t, ph: who === 'cida' ? 2.2 : 0.7, pose: Object.assign({}, POSE0, pose), expr: ex, look, turn: o.turn === undefined ? 0 : (typeof o.turn === 'function' ? o.turn(lt) : o.turn), helmet: o.helmet || 0, light: lightc, propsFn: o.propsFn });
    s += ch.svg;
    // mesa (tampo em perspectiva) + objetos
    s += `<defs><linearGradient id="tw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b98a58"/><stop offset="1" stop-color="#7a5636"/></linearGradient></defs><path d="M-20,628 L596,628 L620,1030 L-44,1030Z" fill="url(#tw)" stroke="${NAVY}" stroke-width="4"/><path d="M-20,628 L596,628" stroke="#e0b985" stroke-width="6"/><path d="M-20,634 L596,634 L598,648 L-20,648Z" fill="#d9ad78" opacity=".5"/>`;
    const items = o.items || ['plates', 'candle'];
    if (items.includes('plates')) s += `<ellipse cx="120" cy="742" rx="92" ry="26" fill="#f4efe0" stroke="${NAVY}" stroke-width="3.5"/><ellipse cx="120" cy="740" rx="62" ry="16" fill="#fff" stroke="#c9c4b4" stroke-width="2"/><ellipse cx="456" cy="742" rx="92" ry="26" fill="#f4efe0" stroke="${NAVY}" stroke-width="3.5"/><ellipse cx="456" cy="740" rx="62" ry="16" fill="#fff" stroke="#c9c4b4" stroke-width="2"/>`;
    if (items.includes('box')) s += `<g transform="translate(288,742)">${K.pizzaBox(210)}</g>`;
    if (items.includes('helmet')) s += `<g transform="translate(300,790) scale(1.25)">${K.helmetProp({ tape: true, crack: true })}</g>`;
    if (items.includes('phone')) s += `<g transform="translate(150,760) rotate(-70) scale(1.5)">${K.phoneProp(o.scr || '#ff5a4a')}</g>`;
    if (items.includes('candle')) { const fl = 0.8 + 0.2 * Math.sin(t * 17) + noise1(t * 9, 4) * 0.12; s += `<g transform="translate(212,676)"><rect x="-6" y="0" width="12" height="40" fill="#f4efe0" stroke="${NAVY}" stroke-width="2.6"/><path d="M0,-4 Q${f(7 * fl)},-20 0,-34 Q${f(-7 * fl)},-20 0,-4Z" fill="#ffcf55" stroke="${NAVY}" stroke-width="2"/><circle cx="0" cy="-18" r="${f(34 * fl)}" fill="#ffd27a" opacity=".22"/></g>`; }
    return s;
  };
  G.KIT = K;
})(window);
