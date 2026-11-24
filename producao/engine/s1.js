// s1.js — "Pedido Fantasma" (história 1, ~106 s). Cada plano nasce de uma FRASE da narração real (data_s1.js: PH + WORDS) e mostra
// literalmente o que ela diz. A parte A reaproveita os planos validados do piloto (story_v3.js) reponderados no tempo; a B é nova.
(function (G) {
  const { track, clamp, lerp, E, f, noise1, rnd, NAVY } = G.L; const { drawChar, EXPR, POSE, POSE0, hand, path, ell, tube } = G.CH;
  const V = G.V3, K = G.KIT, W = G.WORLD, S3 = G.SETS3, UI = G.UI3, L4 = G.LOT4, { R, C, Pth } = G.SETS, { m } = W, T = K.T;
  const PH = window.PH; PH.Q = PH.L17;
  const P = {}; G.STORY3.SHOTS.forEach(s => { P[s.id] = s; });
  const SH = [];
  const clone = (id, t0, t1, extra) => { const s = Object.assign({}, P[id], { t0, t1 }, extra || {}); SH.push(s); return s; };
  const ex = V.ex, po = V.po;
  const lot = (t, o) => ({ far: S3.rua.far(0, t), mid: '', near: L4.lotFront(t, o) + V.streetFront(t), fore: '' });
  const kpz = K.pz;

  // ============================================================ PARTE A: gancho, aposta, caminho, chegada (0 – 37,4 s) ============================================================
  SH.push({ id: 'T0', t0: 0, t1: 0.3, kind: 'screen', draw: (t, lt) => `<rect width="576" height="1024" fill="#04050e"/><defs><radialGradient id="tg"><stop offset="0" stop-color="#fff2b8" stop-opacity="${f(0.9 * (lt < 0.1 ? 1 : lt < 0.16 ? 0.1 : 1))}"/><stop offset="1" stop-color="#ffb04a" stop-opacity="0"/></radialGradient></defs><circle cx="288" cy="420" r="${f(70 + lt * 260)}" fill="url(#tg)"/><circle cx="288" cy="420" r="${f(8 + lt * 30)}" fill="#fffbe0"/>` });
  clone('P1', 0.3, 1.72, { draw: (t, lt) => kpz(P.P1.draw(t, lt), lt, 1.42, 1.0, 1.12, 288, 400) });
  clone('P2', 1.72, 2.9);
  clone('P3', 2.9, 4.45);
  clone('P3b', 4.45, 5.62);
  clone('P4', 5.62, 7.45, { draw: (t, lt) => UI.bokeh(t) + UI.phone(288, 392, 1.14, UI.map(lt, { zoom: lerp(1, 1.6, E.io(clamp(lt / 1.7))), warnAt: 1.4 }), { t, shake: lt > 1.42 && lt < 1.8 ? 3 : 0 }) });
  clone('P5', 7.45, 8.74, { build: (t, lt) => P.P5.build(t, lt + 0.45), shake: [[0.03, 2.4, 0.3]], cam: [[0, 352, 640, 1.7], [1.29, 348, 626, 2.0, 'io']] });
  clone('P6', 8.74, 10.5);
  clone('P7', 10.5, 12.55);
  clone('P8', 12.55, 13.95);
  clone('P8b', 13.95, 14.5);
  clone('P9', 14.5, 15.8);
  clone('P10', 15.8, 16.75);
  clone('P11', 16.75, 17.78);
  clone('P12', 17.78, 19.78, { draw: (t, lt) => { const sc = clamp((lt - 0.9) / 1.0) * 330; return UI.bokeh(t * 4) + UI.phone(288, 392, 1.15, UI.history(lt, { t0: 0.1, dt: 0.15, n11: 1, scroll: sc }), { t, shake: 1.0 }); } });
  clone('P13', 19.78, 21.5, { draw: (t, lt) => { const u = E.io(clamp(lt / 1.7)); return UI.bokeh(t * 4) + UI.phone(288, lerp(392, 360, u), lerp(1.15, 1.36, u), UI.history(lt + 3, { t0: 0, dt: 0.01, n11: 1, scroll: 330 - clamp(lt / 1.7) * 330 }), { t, shake: 0.8 }); } });
  clone('P14', 21.5, 22.75);
  const calPage = (lt) => { let c = R(0, 0, 300, 600, '#10142e') + R(20, 110, 260, 70, '#c33', 14, NAVY, 3) + T(150, 158, 'OUTUBRO', 40, '#fff'); const names = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']; names.forEach((n, i) => { c += T(36 + i * 38, 214, n, 16, '#9aa6e8', 700); });
    for (let d = 1; d <= 31; d++) { const idx = d - 1, cx = 36 + (idx % 7) * 38, cy = 252 + Math.floor(idx / 7) * 52; c += T(cx, cy + 6, String(d), d === 12 ? 24 : 20, d === 12 ? '#fff' : '#c9d2ff', d === 12 ? 800 : 600); }
    const idx = 11, cx = 36 + (idx % 7) * 38, cy = 252 + Math.floor(idx / 7) * 52, k = clamp((lt - 0.5) / 0.5);
    c += `<circle cx="${cx}" cy="${cy}" r="25" fill="none" stroke="#ff5a4a" stroke-width="6" pathLength="1" stroke-dasharray="1" stroke-dashoffset="${f(1 - E.io(k))}" transform="rotate(-90 ${cx} ${cy})"/>`; return c; };
  clone('P15', 22.75, 25.3, { draw: (t, lt) => { const k = E.spring2(clamp((lt - 0.5) / 0.5)); return UI.bokeh(t * 3) + UI.phone(288, 392, 1.14, calPage(lt), { t }) + `<g transform="translate(288,${f(660 - (1 - k) * 30)}) scale(${f(0.6 + 0.4 * k)})" opacity="${f(k)}"><rect x="-216" y="-44" width="432" height="86" rx="43" fill="#ffd24a" stroke="${NAVY}" stroke-width="5"/>${T(0, 16, 'HOJE · 12 OUT', 40, '#1d2747')}</g>`; } });
  clone('P16', 25.3, 27.45, { build: (t, lt) => { const scr = 11000 + 2300 * ((lt < 0.2 ? lt : 0.2) + 0.55 * 1.1 * (1 - Math.pow(1 - clamp((lt - 0.2) / 1.1), 2))); const r = V.ride(t, lt, { scrollFn: () => scr, helmet: 1, pitch: lt => lt > 0.9 && lt < 1.5 ? 4 * Math.sin(clamp((lt - 0.9) / 0.6) * Math.PI) : 0, poses: [{ t: 0, v: 'rideGo' }, { t: 1.0, v: 'rideCrouch', d: 0.3 }, { t: 1.5, v: 'rideIdle', d: 0.4, e: 'spring2' }], exprs: [{ t: 0, v: 'focus' }, { t: 1.4, v: 'resigned', d: 0.4 }], beam: 0.6, bx: 290 });
      const tm = 90 - Math.max(0, lt - 0.9), ss = String(Math.max(0, Math.floor(tm % 60))).padStart(2, '0'); r.near += `<g transform="translate(330,405)" opacity="${f(clamp((lt - 0.9) / 0.3))}"><rect x="-120" y="-34" width="240" height="68" rx="34" fill="#10142e" stroke="#ffd24a" stroke-width="5"/>${T(0, 14, '01:' + ss, 40, '#ffd24a')}</g>`; return r; } });
  clone('P17', 27.45, 29.75);
  clone('P18', 29.75, 31.8, { build: (t, lt) => { const l = V.flick(lt - 0.3); const L = lot(t, { glowA: lt < 0.3 ? 0 : l }); if (lt < 1.0) L.near += V.lotBike(t, lt, { bx: 440, poses: [{ t: 0, v: 'rideIdle' }], exprs: [{ t: 0, v: 'worry' }, { t: 0.5, v: 'curious', d: 0.2 }], helmet: 1, turn: -0.35, look: [300, 600] }); return L; }, cam: [[0, 288, 560, 0.95], [2.05, 296, 556, 2.2, 'io']] });
  clone('P19', 31.8, 33.65, { cam: [[0, 292, 558, 3.0], [1.85, 304, 556, 3.5, 'io']], build: (t, lt) => lot(t, { glowA: 1, cida: true, cidaDim: 0.62 }) });
  clone('P20', 33.65, 35.95, { draw: (t, lt) => V.cidaClose(t, lt - 0.8, { mode: 'watch' }) });
  clone('P22', 35.95, 37.0, { draw: (t, lt) => V.cidaClose(t, lt + 1.0, { mode: 'speak' }) });
  clone('P21', 37.0, 37.4);

  // ============================================================ PARTE B: conflito, pistas, virada, final (37,4 – 106 s) ============================================================
  const standNando = { propsFn: J => `<g transform="translate(${f(J.hR[0] + 4)},${f(J.hR[1] - 6)}) rotate(-10)">${K.phoneProp('#4a6bff')}</g>` };
  // L18 — mostra o celular para ela
  SH.push({ id: 'B1a', t0: 37.4, t1: 38.5, kind: 'screen', draw: (t, lt) => {
    let s = K.ghostWall(t) + '<g filter="url(#bl6)">' + drawChar({ cast: 'cida', x: 400, y: 800, s: 1.9, flip: 1, t, ph: 2.2, pose: POSE.sit, expr: EXPR.curious, look: [200, 520], turn: -0.35, light: { ox: -1, oy: -0.7, rim: '#ffe0a0' } }).svg + '</g>';
    const k = E.spring2(clamp(lt / 0.45)), px = lerp(-100, 190, k);
    s += K.armIn(-120 + 40 * k, 1000, px + 20, 640 - 40 * k) + `<g transform="translate(${f(px)},${f(430 - 20 * k)}) rotate(-6)">${UI.phone(0, 0, 0.82, UI.map(lt, { zoom: 1.2, warnAt: 0 }), { t })}</g>`;
    return K.pz(s, lt, 1.1, 1.0, 1.06, 288, 512);
  } });
  SH.push({ id: 'B1b', t0: 38.5, t1: 40.12, kind: 'screen', draw: (t, lt) => K.pz(K.talk('nando', t, lt, { bg: 'street', pose: Object.assign({}, POSE.stand, { hL: [-40, -84], hR: [58, -92], gR: 'grip' }), expr: ex([{ t: 0, v: 'sheepish' }, { t: 1.0, v: 'worry', d: 0.4 }]), look: [180, 520], turn: 0.25, propsFn: J => `<g transform="translate(${f(J.hR[0] + 6)},${f(J.hR[1] - 4)}) rotate(-12)">${K.phoneProp('#4a6bff')}</g>`, items: ['plates', 'candle'] }), lt, 1.62, 1.0, 1.07) });
  // L19 — "Existe pra mim. A cozinha era ali."
  SH.push({ id: 'B2a', t0: 40.12, t1: 41.38, kind: 'screen', draw: (t, lt) => K.pz(K.talk('cida', t, lt, { bg: 'ghost', speakIds: ['L19'], pose: POSE.sit, expr: ex([{ t: 0, v: 'warm' }]), look: [150, 560], turn: -0.12, items: ['plates', 'box', 'candle'] }), lt, 1.26, 1.0, 1.08, 288, 470) });
  const ghost = (t, a) => {
    const { X, Y } = L4; const pt = (xm, d, h) => `${f(X(xm, d))},${f(Y(d, h))}`, fl = 0.85 + 0.15 * Math.sin(t * 9); let s = `<g opacity="${f(a * fl)}">`;
    const face = (pts, fill, op) => `<polygon points="${pts.join(' ')}" fill="${fill}" fill-opacity="${op}" stroke="#ffe6a6" stroke-width="1.1" stroke-opacity=".7" stroke-linejoin="round"/>`;
    const box = (x0, x1, d0, d1, h0, h1, op = 0.16) => face([pt(x0, d0, h0), pt(x0, d0, h1), pt(x1, d0, h1), pt(x1, d0, h0)], '#ffe6a6', op) + face([pt(x0, d0, h1), pt(x1, d0, h1), pt(x1, d1, h1), pt(x0, d1, h1)], '#fff2c8', op * 1.4);
        s += box(-1.9, 0.9, 11.8, 12.5, 0, 0.9) + box(-1.9, -0.2, 12.2, 12.6, 1.5, 2.2) + box(1.0, 1.7, 11.8, 12.5, 0, 1.8);
    s += `<path d="M${f(X(-0.05, 12.1))},${f(Y(12.1, 0.95))} q-4,-12 0,-22 q4,10 0,22" fill="#ffb04a" opacity=".85"/>`;
    s += `<polygon points="${[pt(0.25, 12.69, 1.2), pt(1.1, 12.69, 1.2), pt(1.1, 12.69, 2.2), pt(0.25, 12.69, 2.2)].join(' ')}" fill="#9fd4ff" fill-opacity=".18" stroke="#ffe6a6" stroke-width="2"/><path d="M${pt(0.675, 12.69, 1.2)} L${pt(0.675, 12.69, 2.2)} M${pt(0.25, 12.69, 1.7)} L${pt(1.1, 12.69, 1.7)}" stroke="#ffe6a6" stroke-width="1.6"/>`;
    return s + '</g>';
  };
  SH.push({ id: 'B2b', t0: 41.38, t1: 42.6, kind: 'scene', cam: [[0, 292, 550, 2.0], [1.22, 292, 548, 2.5, 'io']], build: (t, lt) => { const L = lot(t, { glowA: 1, cida: true }); L.near += ghost(t, E.io(clamp(lt / 0.45))); return L; } });
  // L20 — "Ela apontou a parede do vizinho: o azulejo, a mancha do forno, a marca da escada."
  SH.push({ id: 'B3a', t0: 42.6, t1: 44.28, kind: 'screen', draw: (t, lt) => K.pz(K.talk('cida', t, lt, { bg: 'ghost', pose: lt => Object.assign({}, POSE.sit, { hL: [lerp(-30, -96, E.spring2(clamp(lt / 0.45))), lerp(-66, -126, E.spring2(clamp(lt / 0.45)))], gL: 'point', lean: -2 }), expr: ex([{ t: 0, v: 'calm' }, { t: 0.5, v: 'curious', d: 0.3 }]), look: [20, 470], turn: -0.3, items: ['plates', 'box', 'candle'] }), lt, 1.68, 1.0, 1.06) });
  const wallIns = (t, lt) => {
    const t0 = lt + 44.28; let s = `<defs><radialGradient id="wl" cx="0.55" cy="0.4" r="1.0"><stop offset="0" stop-color="#ffe9b0" stop-opacity=".30"/><stop offset="1" stop-color="#0c0a1e" stop-opacity=".78"/></radialGradient><radialGradient id="sg" cx="0.5" cy="0.62" r="0.62"><stop offset="0" stop-color="#05040a" stop-opacity="1"/><stop offset="0.7" stop-color="#0c0a14" stop-opacity=".85"/><stop offset="1" stop-color="#0c0a14" stop-opacity="0"/></radialGradient></defs>` + R(0, 0, 576, 1024, '#a79cb4');
    for (let i = 0; i < 60; i++) s += `<circle cx="${f(rnd(i * 3.1) * 576)}" cy="${f(rnd(i * 7.7) * 1024)}" r="${f(2 + rnd(i) * 6)}" fill="#8f84a0" opacity=".5"/>`;
    for (let r = 0; r < 7; r++) for (let c = 0; c < 8; c++) { const miss = (r * 7 + c * 3) % 11 === 0; s += R(40 + c * 38, 90 + r * 38, 36, 36, miss ? '#a79cb4' : (((r + c) % 2) ? '#cfe0e8' : '#f2f7f8'), 2, '#7d909a', 1.6); }
    s += R(30, 82, 322, 8, '#7d909a') + R(30, 356, 322, 8, '#7d909a');
    s += `<path d="M180,860 L180,640 Q180,470 320,470 Q460,470 460,640 L460,860Z" fill="url(#sg)"/><path d="M215,860 L215,650 Q215,520 320,520 Q425,520 425,650 L425,860Z" fill="none" stroke="#2a2438" stroke-width="12" opacity=".8"/><path d="M320,470 Q310,400 330,350" stroke="#0c0a14" stroke-width="34" fill="none" opacity=".8" stroke-linecap="round"/>`;
    let st = ''; for (let i = 0; i < 6; i++) st += `<path d="M${60 + i * 66},${1000 - i * 40} L${126 + i * 66},${1000 - i * 40} L${126 + i * 66},1024 L${60 + i * 66},1024Z" fill="#4c4262"/>`;
    s += st + `<path d="M50,950 L500,740" stroke="#4c4262" stroke-width="12"/>`;
    s += `<text x="500" y="640" font-family="Inter" font-weight="800" font-size="90" fill="#fff4d6" opacity=".35" text-anchor="middle">14</text><rect width="576" height="1024" fill="url(#wl)"/>`;
    const ring = (cx, cy, rx, ry, a0, label, ly) => { const k = clamp((t0 - a0) / 0.3), off = clamp((t0 - a0 - 1.1) / 0.4); return k > 0 ? `<ellipse cx="${cx}" cy="${cy}" rx="${f(rx * (0.75 + 0.25 * E.spring(k)))}" ry="${f(ry * (0.75 + 0.25 * E.spring(k)))}" fill="none" stroke="#ffd24a" stroke-width="7" opacity="${f(k * (1 - off * 0.6))}"/><g opacity="${f(k * (1 - off))}" transform="translate(${cx},${ly})"><rect x="-124" y="-26" width="248" height="46" rx="23" fill="#10142e" stroke="#ffd24a" stroke-width="3"/>${T(0, 7, label, 23, '#ffd24a')}</g>` : ''; };
    s += ring(190, 226, 188, 150, K.wordAt('L20', 7), 'AZULEJO', 52) + ring(320, 660, 168, 210, K.wordAt('L20', 9), 'MANCHA DO FORNO', 420) + ring(275, 900, 250, 120, K.wordAt('L20', 13), 'MARCA DA ESCADA', 760);
    const a = clamp((t0 - K.wordAt('L20', 7) + 0.4) / 0.5), b = clamp((t0 - K.wordAt('L20', 9) + 0.3) / 0.5), c = clamp((t0 - K.wordAt('L20', 13) + 0.3) / 0.5);
    const c0 = [288, 512, 1.0], c1 = [220, 260, 1.25], c2 = [320, 560, 1.2], c3 = [288, 780, 1.1], mix3 = (A, B, k) => A.map((v, i) => lerp(v, B[i], E.io(k)));
    const cam = c > 0 ? mix3(c2, c3, c) : (b > 0 ? mix3(c1, c2, b) : mix3(c0, c1, a));
    return K.ptr(cam[0], cam[1], cam[2], s);
  };
  SH.push({ id: 'B3b', t0: 44.28, t1: 47.28, kind: 'screen', draw: wallIns });
  // L21 — "Senta. Falta um minuto."
  SH.push({ id: 'B4', t0: 47.28, t1: 48.92, kind: 'screen', draw: (t, lt) => K.pz(K.talk('cida', t, lt, { bg: 'ghost', speakIds: ['L21'], pose: lt => Object.assign({}, POSE.sit, { hR: [lerp(30, 92, E.spring2(clamp((lt - 0.5) / 0.4))), lerp(-66, -112, E.spring2(clamp((lt - 0.5) / 0.4)))], gR: 'open' }), expr: ex([{ t: 0, v: 'warm' }]), look: [470, 560], turn: 0.12, items: ['plates', 'box', 'candle'] }), lt, 1.64, 1.0, 1.07) });
  // L22 — o dilema: o relógio do app conta; olha a moto, olha a mesa
  SH.push({ id: 'B5a', t0: 48.92, t1: 50.65, kind: 'screen', draw: (t, lt) => kpz(UI.bokeh(t * 3) + UI.phone(288, 392, lerp(1.14, 1.22, E.io(clamp(lt / 1.7))), UI.timer(lt + 0.4, { start: 60 }), { t, shake: 0.5 }), lt, 1.73, 1.0, 1.06, 288, 400) });
  SH.push({ id: 'B5b', t0: 50.65, t1: 54.42, kind: 'screen', draw: (t, lt) => K.pz(K.talk('nando', t, lt, { bg: 'street', pose: Object.assign({}, POSE.stand, { hL: [-40, -86], hR: [46, -92] }), expr: ex([{ t: 0, v: 'worry' }, { t: 1.7, v: 'focus', d: 0.4 }, { t: 2.6, v: 'resigned', d: 0.5 }, { t: 3.3, v: 'hope', d: 0.4 }]), look: lt => lt < 1.9 ? [40, 560] : [520, 600], turn: lt => lt < 1.9 ? -0.45 : 0.45, items: ['plates', 'candle'] }), lt, 3.77, 1.0, 1.1) });
  // L23 — "Eu sentei."
  SH.push({ id: 'B6', t0: 54.42, t1: 55.22, kind: 'screen', draw: (t, lt) => K.pz(K.talk('nando', t, lt, { bg: 'street', pose: lt => { const k = E.spring(clamp((lt - 0.12) / 0.4)); return Object.assign({}, POSE.stand, { hipDrop: lerp(0, 40, k), hL: [lerp(-40, -30, k), lerp(-86, -66, k)], hR: [lerp(46, 30, k), lerp(-92, -66, k)], headDown: lerp(0, 4, k) }); }, expr: ex([{ t: 0, v: 'resigned' }, { t: 0.4, v: 'calm', d: 0.3 }]), look: [288, 560], turn: 0.15, items: ['plates', 'candle'] }), lt, 0.8, 1.04, 1.0) });
  // L24 — a caixa com laço na cadeira vazia
  SH.push({ id: 'B7', t0: 55.22, t1: 58.12, kind: 'scene', cam: [[0, 252, 586, 5.0], [0.5, 252, 586, 5.0], [2.9, 288, 572, 3.0, 'io']], build: (t, lt) => lot(t, { glowA: 1, cida: true, chairBox: true, nando: { x: 0.05, turn: -0.3, expr: EXPR.calm, look: [252, 586] } }) });
  // L25 — "Meu marido, o Zé, chegava em seis minutos. Você levou nove e meio."
  SH.push({ id: 'B8a', t0: 58.12, t1: 59.4, kind: 'screen', draw: (t, lt) => K.pz(K.talk('cida', t, lt, { bg: 'ghost', speakIds: ['L25'], pose: POSE.sit, expr: ex([{ t: 0, v: 'warm' }, { t: 0.8, v: 'smile', d: 0.4 }]), look: [288, 520], turn: 0, items: ['plates', 'box', 'candle'] }), lt, 1.28, 1.0, 1.07) });
  const zePhoto = (t, lt) => {
    let s = K.ghostWall(t).replace(/<g filter="url\(#bl6\)">[\s\S]*$/, '') + '<rect width="576" height="1024" fill="#0c0a1e" opacity=".55"/>';
    const k = E.spring2(clamp(lt / 0.5));
    s += `<g transform="translate(288,${f(440 + (1 - k) * 60)}) rotate(${f(-5 + (1 - k) * 8)}) scale(${f(0.9 + 0.1 * k)})"><rect x="-210" y="-270" width="420" height="540" rx="6" fill="#f4efe0" stroke="${NAVY}" stroke-width="4"/>`;
    s += `<clipPath id="phc"><rect x="-188" y="-248" width="376" height="430"/></clipPath><g clip-path="url(#phc)"><rect x="-188" y="-248" width="376" height="430" fill="#c9a572"/><rect x="-188" y="-248" width="376" height="180" fill="#8a6a4a"/>`;
    for (let r = 0; r < 5; r++) for (let c = 0; c < 8; c++) s += R(-190 + c * 50 + (r % 2) * 25, -248 + r * 36, 48, 34, '#a8553f', 2, '#7a3828', 1.6);
    s += `<rect x="-188" y="-68" width="376" height="250" fill="#7a6a58"/>`;
    s += `<g transform="translate(80,60) scale(0.85)">${W.moto(0, t, 0, {})}</g>`;
    s += drawChar({ cast: 'ze', x: -90, y: 176, s: 1.0, flip: 1, t, ph: 1.3, pose: Object.assign({}, POSE.stand, { hR: [60, -64], hL: [-44, -90], gR: 'grip' }), expr: EXPR.happy, look: [0, 0], turn: 0.1, helmet: 0, light: { ox: -1, oy: -0.7, rim: '#ffe0a0' }, propsFn: J => `<g transform="translate(${f(J.hR[0] + 18)},${f(J.hR[1] - 4)}) scale(0.52)">${K.helmetProp({ crack: true, seed: 5 })}</g>` }).svg;
    s += `<rect x="-188" y="-248" width="376" height="430" fill="#7a5a2a" opacity=".38" style="mix-blend-mode:multiply"/></g>`;
    s += T(0, 232, 'Zé — 1994', 34, '#5a4a3a', 700, 'middle', 'font-style="italic"') + '</g>';
    return K.pz(s, lt, 1.6, 1.0, 1.08, 288, 460);
  };
  SH.push({ id: 'B8b', t0: 59.4, t1: 60.92, kind: 'screen', draw: zePhoto });
  SH.push({ id: 'B8c', t0: 60.92, t1: 62.58, kind: 'screen', draw: (t, lt) => {
    let s = R(0, 0, 576, 1024, '#10142e') + UI.bokeh(t * 2).replace(/<rect[^>]*url\(#bkg\)[^>]*\/>/, '');
    const k1 = E.io(clamp(lt / 0.55)), k2 = E.io(clamp((lt - 0.45) / 1.0));
    s += T(288, 250, '⏱', 120, '#ffd24a') + T(288, 330, 'TEMPO DE ENTREGA', 26, '#9aa6e8', 700);
    s += R(60, 400, 456, 110, '#1b2142', 20, '#2c3466', 2) + R(60, 400, f(456 * 0.63 * k1) + 0.01, 110, '#ffc93c', 20) + T(86, 470, 'ZÉ', 44, '#fff', 800, 'start', `stroke="${NAVY}" stroke-width="7" paint-order="stroke"`) + T(490, 470, '06:00', 44, '#fff', 800, 'end', `stroke="${NAVY}" stroke-width="7" paint-order="stroke"`);
    s += R(60, 560, 456, 110, '#1b2142', 20, '#2c3466', 2) + R(60, 560, f(456 * k2) + 0.01, 110, '#ff5a4a', 20) + T(86, 630, 'VOCÊ', 44, '#fff', 800, 'start') + T(490, 630, `${Math.floor(9.5 * k2)}:${String(Math.floor(((9.5 * k2) % 1) * 60)).padStart(2, '0')}`, 44, '#fff', 800, 'end');
    return K.pz(s, lt, 1.66, 1.0, 1.06, 288, 500);
  } });
  // L26 — primeiro entregador, "23:47 · 1994", capacete rachado
  SH.push({ id: 'B9a', t0: 62.58, t1: 64.68, kind: 'screen', draw: (t, lt) => K.pz(K.talk('cida', t, lt, { bg: 'ghost', speakIds: ['L26'], pose: POSE.sit, expr: ex([{ t: 0, v: 'warm' }, { t: 1.2, v: 'calm', d: 0.5 }]), look: [288, 520], turn: 0.03, items: ['plates', 'box', 'candle'] }), lt, 2.1, 1.0, 1.07) });
  SH.push({ id: 'B9b', t0: 64.68, t1: 67.7, kind: 'screen', draw: (t, lt) => {
    const t0 = lt + 64.68; let s = R(0, 0, 576, 1024, '#2a2236') + `<defs><radialGradient id="cvg" cx="0.5" cy="0.4" r="0.8"><stop offset="0" stop-color="#ffd98a" stop-opacity=".35"/><stop offset="1" stop-color="#0c0a1e" stop-opacity=".8"/></radialGradient></defs><rect width="576" height="1024" fill="url(#cvg)"/>`;
    const k = E.spring2(clamp(lt / 0.5));
    s += `<g transform="translate(288,${f(430 + (1 - k) * 80)}) rotate(${f(-3)}) scale(${f(0.85 + 0.15 * k)})"><rect x="-230" y="-290" width="460" height="580" rx="8" fill="#efe4c8" stroke="${NAVY}" stroke-width="4"/><rect x="-230" y="-290" width="460" height="96" rx="8" fill="#c33" stroke="${NAVY}" stroke-width="4"/>${T(0, -226, 'FORNO VIVO', 54, '#fff4d6')}${T(0, -208, 'PIZZARIA · ENTREGAS', 18, '#ffd9d4', 700)}`;
    s += T(-196, -150, 'ENTREGADOR Nº 1', 28, '#3a3a4a', 800, 'start') + `<line x1="-196" y1="-132" x2="196" y2="-132" stroke="#b9b4a4" stroke-width="3"/>`;
    s += T(-196, -78, 'PEDIDO', 20, '#8a8478', 700, 'start') + T(-196, -46, 'Pizza grande, sem cebola', 28, '#3a3a4a', 700, 'start');
    s += T(-196, 20, 'SAÍDA', 20, '#8a8478', 700, 'start');
    const h = clamp((t0 - K.wordAt('L26', 8)) / 0.5), y = clamp((t0 - K.wordAt('L26', 14)) / 0.5);
    s += `<g opacity="${f(h)}">${T(-196, 100, '23:47', 88, '#c33', 800, 'start')}</g><g opacity="${f(y)}" transform="translate(${f(lerp(30, 0, y))},0)">${T(-196, 190, 'em 1994', 54, '#3a3a4a', 800, 'start')}</g>`;
    s += `<g transform="translate(110,230) rotate(-8) scale(${f(0.5 + 0.5 * E.spring(clamp((t0 - K.wordAt('L26', 14) - 0.3) / 0.3)))})" opacity="${f(clamp((t0 - K.wordAt('L26', 14) - 0.3) / 0.15))}"><rect x="-130" y="-34" width="260" height="68" rx="8" fill="none" stroke="#c33" stroke-width="7"/>${T(0, 14, 'ENTREGUE', 40, '#c33')}</g></g>`;
    return K.pz(s, lt, 3.0, 1.0, 1.07, 288, 440);
  } });
  const helmetClose = (t, lt, o) => {
    let s = R(0, 0, 576, 1024, '#1a1630') + `<defs><radialGradient id="hcg" cx="0.5" cy="0.45" r="0.7"><stop offset="0" stop-color="#ffd98a" stop-opacity=".5"/><stop offset="1" stop-color="#0c0a1e" stop-opacity=".92"/></radialGradient></defs><rect width="576" height="1024" fill="url(#hcg)"/>`;
    const cr = o.crackAt === undefined ? 1 : clamp((lt - o.crackAt) / 0.5);
    s += `<g transform="translate(268,640) scale(2.55)">${K.helmetProp({ tape: o.tape, crack: false })}<path d="M-22,-114 L-10,-94 L-26,-78 L-8,-60 L-20,-44 L-12,-26" pathLength="1" stroke-dasharray="1" stroke-dashoffset="${f(1 - cr)}" fill="none" stroke="${NAVY}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/></g>`;
    if (o.tape) s += `<g opacity="${f(clamp((lt - 0.2) / 0.3))}">` + K.armIn(640, 1020, 470 - 90 * E.io(clamp((lt - 0.2) / 0.8)), 560, 'point') + '</g>';
    return s;
  };
  SH.push({ id: 'B9c', t0: 67.7, t1: 69.88, kind: 'screen', draw: (t, lt) => K.pz(helmetClose(t, lt, { crackAt: K.wordAt('L26', 19) - 67.7 - 0.2 }), lt, 2.18, 1.0, 1.1, 288, 560) });
  // L27 — o capacete do Nando (a mesma composição: a fita segurando a rachadura)
  SH.push({ id: 'B10a', t0: 69.88, t1: 70.95, kind: 'screen', draw: (t, lt) => K.pz(K.talk('nando', t, lt, { bg: 'street', pose: POSE.sit, expr: ex([{ t: 0, v: 'calm' }, { t: 0.3, v: 'realize', d: 0.15, e: 'spring' }]), look: [300, 790], turn: 0.1, items: ['plates', 'helmet', 'candle'] }), lt, 1.07, 1.0, 1.06) });
  SH.push({ id: 'B10b', t0: 70.95, t1: 73.08, kind: 'screen', draw: (t, lt) => K.pz(helmetClose(t, lt, { tape: true, crackAt: -1 }), lt, 2.13, 1.1, 1.0, 288, 560) });
  // L28 — onze anos, onze cancelados
  SH.push({ id: 'B11a', t0: 73.08, t1: 75.5, kind: 'screen', draw: (t, lt) => K.pz(K.talk('cida', t, lt, { bg: 'ghost', speakIds: ['L28'], pose: POSE.sit, expr: ex([{ t: 0, v: 'calm' }, { t: 1.5, v: 'sad', d: 0.6 }]), look: [288, 520], turn: 0.02, items: ['plates', 'box', 'candle'] }), lt, 2.42, 1.0, 1.07) });
  SH.push({ id: 'B11b', t0: 75.5, t1: 77.2, kind: 'screen', draw: (t, lt) => {
    let s = R(0, 0, 576, 1024, '#10142e') + UI.bokeh(t * 2).replace(/<rect[^>]*url\(#bkg\)[^>]*\/>/, '');
    const n = clamp(Math.floor(lt / 0.145) + 1, 1, 11);
    for (let i = 0; i < n; i++) { const a = E.spring(clamp((lt - i * 0.145) / 0.2)), cx = 110 + (i % 3) * 178, cy = 190 + Math.floor(i / 3) * 190;
      s += `<g transform="translate(${cx},${cy}) rotate(${f(((i * 37) % 9) - 4)}) scale(${f(a)})">` + R(-78, -72, 156, 148, '#f4efe0', 10, NAVY, 3.5) + R(-78, -72, 156, 36, '#c33', 10, NAVY, 3.5) + T(0, -46, 'OUTUBRO', 22, '#fff') + T(0, 6, '12', 62, '#222') + T(0, 52, String(2012 + i), 26, '#6a6a7a', 700) + `<g transform="rotate(-12)" opacity="${f(clamp((lt - i * 0.145 - 0.12) / 0.1))}"><rect x="-70" y="-20" width="140" height="40" rx="6" fill="none" stroke="#d33" stroke-width="5"/>${T(0, 10, 'CANCELADO', 22, '#d33')}</g></g>`; }
    return K.pz(s, lt, 1.7, 1.0, 1.06, 288, 400);
  } });
  // L29 — a frase central
  SH.push({ id: 'B12', t0: 77.2, t1: 80.02, kind: 'screen', draw: (t, lt) => K.pz(K.talk('cida', t, lt, { bg: 'ghost', speakIds: ['L29'], pose: POSE.sit, expr: ex([{ t: 0, v: 'calm' }, { t: 1.4, v: 'warm', d: 0.6 }]), look: [288, 500], turn: 0, items: ['plates', 'box', 'candle'] }), lt, 2.82, 1.0, 1.16, 288, 470) });
  // L30 — a proposta: três cartões
  const card = (cx, cy, k, icon, l1, l2, col) => `<g transform="translate(${cx},${f(cy + (1 - k) * 50)}) scale(${f(0.7 + 0.3 * k)})" opacity="${f(clamp(k * 2))}">${R(-230, -64, 460, 128, '#f4efe0', 24, NAVY, 4)}${R(-230, -64, 112, 128, col, 24, NAVY, 4)}${icon}${T(-92, -6, l1, 34, '#1d2747', 800, 'start')}${T(-92, 36, l2, 22, '#6a6a7a', 700, 'start')}</g>`;
  SH.push({ id: 'B13a', t0: 80.02, t1: 81.5, kind: 'screen', draw: (t, lt) => K.pz(K.talk('cida', t, lt, { bg: 'ghost', speakIds: ['L30'], pose: POSE.sit, expr: ex([{ t: 0, v: 'warm' }, { t: 0.8, v: 'smile', d: 0.4 }]), look: [288, 520], turn: 0, items: ['plates', 'box', 'candle'] }), lt, 1.48, 1.0, 1.06) });
  SH.push({ id: 'B13b', t0: 81.5, t1: 86.0, kind: 'screen', draw: (t, lt) => {
    const t0 = lt + 81.5; let s = K.ghostWall(t) + '<rect width="576" height="1024" fill="#0c0a1e" opacity=".5"/>';
    const k1 = E.spring2(clamp((t0 - K.wordAt('L30', 8) + 0.1) / 0.45)), k2 = E.spring2(clamp((t0 - K.wordAt('L30', 10) + 0.1) / 0.45)), k3 = E.spring2(clamp((t0 - K.wordAt('L30', 14) + 0.1) / 0.45));
    const coin = `<g transform="translate(-174,0)"><circle r="34" fill="#ffd24a" stroke="${NAVY}" stroke-width="4"/>${T(0, 14, '$', 40, '#8a5a00')}</g>`, cross = `<g transform="translate(-174,0)"><rect x="-32" y="-12" width="64" height="24" rx="6" fill="#fff"/><rect x="-12" y="-32" width="24" height="64" rx="6" fill="#fff"/><rect x="-32" y="-12" width="64" height="24" rx="6" fill="none" stroke="${NAVY}" stroke-width="3"/></g>`, hm = `<g transform="translate(-174,16) scale(0.46)">${K.helmetProp({ neo: true })}</g>`;
    s += card(288, 300, k1, coin, 'SALÁRIO FIXO', 'todo mês, dia certo', '#3aa86b') + card(288, 500, k2, cross, 'PLANO DE SAÚDE', 'pra você e a família', '#3a7fd9') + card(288, 700, k3, hm, 'CAPACETE NOVO', 'que não racha', '#e24a36');
    return K.pz(s, lt, 4.5, 1.0, 1.05, 288, 500);
  } });
  // L31 — pedido expirado, menos 340
  SH.push({ id: 'B14', t0: 86.0, t1: 89.72, kind: 'screen', draw: (t, lt) => {
    const t0 = lt + 86.0, vib = lt > 0.08 && lt < 0.9 ? 5 * Math.exp(-(lt - 0.08) * 1.2) : 0, ex1 = E.spring2(clamp((t0 - K.wordAt('L31', 3) + 0.05) / 0.4)), ex2 = E.spring2(clamp((t0 - K.wordAt('L31', 5) + 0.05) / 0.4));
    const scr = R(0, 0, 300, 600, '#10142e') + `<rect x="0" y="0" width="300" height="600" fill="#10142e"/>` + T(150, 70, 'Forno Vivo · Rua das Acácias, 14', 14, '#9aa6e8', 700) + `<g opacity="${f(clamp((lt - 0.05) / 0.2))}"><rect x="20" y="100" width="260" height="64" rx="14" fill="#242b60"/><rect x="32" y="112" width="38" height="38" rx="10" fill="#ff5a4a"/>${T(51, 138, 'ZAP', 13, '#fff')}${T(84, 130, 'Pedido expirado', 16, '#fff', 800, 'start')}${T(84, 150, 'agora', 12, '#9aa6e8', 600, 'start')}</g>` +
      `<g transform="translate(150,${f(240 + (1 - ex1) * -40)}) rotate(${f(-8 * ex1)}) scale(${f(0.6 + 0.4 * ex1)})" opacity="${f(ex1)}"><rect x="-130" y="-48" width="260" height="96" rx="14" fill="#2a2f4c" stroke="#8a90b8" stroke-width="3"/>${T(0, 14, 'PEDIDO EXPIRADO', 28, '#c9d2ff')}</g>` +
      `<g opacity="${f(ex2)}" transform="translate(150,${f(430 - (1 - ex2) * -30)}) scale(${f(0.7 + 0.3 * ex2)})">${T(0, 0, '− R$ 340,00', 42, '#ff5a4a')}${T(0, 36, 'taxa de cancelamento', 17, '#ffb4a8', 700)}</g>`;
    return kpz(UI.bokeh(t * 3) + UI.phone(288, 392, 1.18, scr, { t, shake: vib }), lt, 3.72, 1.0, 1.06, 288, 392);
  } });
  // L32 — "Esse eu pago em dobro. Abre a caixa."
  SH.push({ id: 'B15a', t0: 89.72, t1: 91.1, kind: 'screen', draw: (t, lt) => K.pz(K.talk('cida', t, lt, { bg: 'ghost', speakIds: ['L32'], pose: POSE.sit, expr: ex([{ t: 0, v: 'warm' }, { t: 0.7, v: 'smile', d: 0.4 }]), look: [288, 520], turn: 0, items: ['plates', 'box', 'candle'] }), lt, 1.38, 1.0, 1.07) });
  SH.push({ id: 'B15b', t0: 91.1, t1: 92.3, kind: 'screen', draw: (t, lt) => {
    const lid = E.spring2(clamp((lt - 0.4) / 0.4)), rise = E.spring(clamp((lt - 0.6) / 0.5));
    let s = K.ghostWall(t) + '<rect width="576" height="1024" fill="#0c0a1e" opacity=".45"/>';
    s += `<defs><radialGradient id="ray" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#fff2b8" stop-opacity=".9"/><stop offset="1" stop-color="#ffd27a" stop-opacity="0"/></radialGradient></defs>`;
    s += `<circle cx="288" cy="560" r="${f(60 + 300 * lid)}" fill="url(#ray)" opacity="${f(lid * 0.85)}"/>`;
    for (let i = 0; i < 9; i++) { const a = -Math.PI / 2 + (i - 4) * 0.22, L = 480 * lid; s += `<path d="M288,620 L${f(288 + Math.cos(a - 0.05) * L)},${f(620 + Math.sin(a - 0.05) * L)} L${f(288 + Math.cos(a + 0.05) * L)},${f(620 + Math.sin(a + 0.05) * L)}Z" fill="#fff2b8" opacity="${f(0.16 * lid)}"/>`; }
    s += `<g transform="translate(288,${f(700 - 210 * rise)}) scale(1.45) rotate(${f(-4 + 6 * rise)})">${K.helmetProp({ neo: true })}</g>`;
    s += `<g transform="translate(288,740) scale(1.35)">${K.giftBox(220, lid)}</g>`;

    s += K.armIn(-60, 1000, 110 + 30 * lid, 700 - 40 * lid) + `<g transform="scale(-1,1) translate(-576,0)">${K.armIn(-60, 1000, 110 + 30 * lid, 700 - 40 * lid)}</g>`;
    return K.pz(s, lt, 1.2, 1.0, 1.08, 288, 640);
  } });
  // L33 — o primeiro salário fixo paga o aluguel
  SH.push({ id: 'B16a', t0: 92.3, t1: 93.3, kind: 'screen', draw: (t, lt) => {
    const k = E.spring2(clamp(lt / 0.4)); const scr = R(0, 0, 300, 600, '#10142e') + T(150, 80, 'Forno Vivo', 18, '#9aa6e8', 700) + `<g transform="translate(150,${f(210 + (1 - k) * 60)})" opacity="${f(k)}">${R(-124, -60, 248, 120, '#1b2142', 16, '#2c3466', 2)}${T(0, -22, 'SALÁRIO', 20, '#9aa6e8', 700)}${T(0, 34, '+ R$ 2.350', 44, '#3ddc84')}</g>` + `<g opacity="${f(clamp((lt - 0.4) / 0.3))}">${T(150, 360, 'primeiro salário fixo', 18, '#c9d2ff', 700)}</g>`;
    return kpz(UI.bokeh(t * 2) + UI.phone(288, 392, 1.16, scr, { t }), lt, 1.0, 1.0, 1.05, 288, 392);
  } });
  SH.push({ id: 'B16b', t0: 93.3, t1: 95.3, kind: 'screen', draw: (t, lt) => {
    const st = E.spring(clamp((lt - 0.35) / 0.3)); let s = UI.bokeh(t) + UI.paper(288, 400, 1.04, 5);
    s += `<g transform="translate(300,540) rotate(-10) scale(${f(0.4 + 0.6 * st)})" opacity="${f(clamp(st))}"><rect x="-150" y="-50" width="300" height="100" rx="12" fill="none" stroke="#2db36a" stroke-width="10"/><rect x="-142" y="-42" width="284" height="84" rx="8" fill="#2db36a" opacity=".14"/>${T(0, 20, 'PAGO ✔', 64, '#2db36a')}</g>`;
    return K.pz(s, lt, 2.0, 1.0, 1.06, 288, 440);
  } });
  SH.push({ id: 'B16c', t0: 95.3, t1: 96.12, kind: 'screen', draw: (t, lt) => K.pz(K.talk('nando', t, lt, { bg: 'street', pose: POSE.sit, expr: ex([{ t: 0, v: 'happy' }]), look: [288, 500], turn: 0.05, helmet: 1, items: ['plates', 'candle'] }), lt, 0.82, 1.0, 1.05) });
  // L34 — o capacete velho guardado, com a fita
  SH.push({ id: 'B17', t0: 96.12, t1: 98.9, kind: 'screen', draw: (t, lt) => {
    const t0 = lt + 96.12; let s = R(0, 0, 576, 1024, '#2a2236') + `<defs><radialGradient id="shg" cx="0.5" cy="0.4" r="0.8"><stop offset="0" stop-color="#ffd98a" stop-opacity=".5"/><stop offset="1" stop-color="#0c0a1e" stop-opacity=".9"/></radialGradient></defs><rect width="576" height="1024" fill="url(#shg)"/>`;
    s += R(-20, 600, 616, 30, '#8d6a42', 0, NAVY, 4) + R(-20, 630, 616, 14, '#6a4c30') + R(60, 630, 14, 120, '#6a4c30') + R(500, 630, 14, 120, '#6a4c30');
    s += `<g transform="translate(130,602) scale(0.8)"><rect x="-70" y="-190" width="140" height="170" rx="6" fill="#f4efe0" stroke="${NAVY}" stroke-width="4"/><clipPath id="shp"><rect x="-58" y="-178" width="116" height="116"/></clipPath><g clip-path="url(#shp)"><rect x="-58" y="-178" width="116" height="116" fill="#c9a572"/>${drawChar({ cast: 'ze', x: 0, y: -40, s: 0.52, flip: 1, t, ph: 1.3, pose: Object.assign({}, POSE.stand), expr: EXPR.happy, look: [0, 0], turn: 0.1, light: null }).svg}</g>${T(0, -36, 'Zé', 22, '#5a4a3a', 700)}</g>`;
    s += `<g transform="translate(420,602) scale(0.7)"><path d="M-30,0 L-24,-70 L24,-70 L30,0Z" fill="#a8553f" stroke="${NAVY}" stroke-width="4"/><path d="M0,-70 C-20,-110 -50,-90 -40,-130 M0,-70 C10,-120 40,-110 44,-150 M0,-70 C20,-96 56,-84 54,-116" stroke="#3c8a54" stroke-width="9" fill="none" stroke-linecap="round"/></g>`;
    const k = E.spring2(clamp((lt - 0.1) / 0.7)), hx = lerp(560, 300, E.io(clamp(lt / 0.8))), hy = 602;
    s += `<g transform="translate(${f(hx)},${f(hy)}) scale(1.35)">${K.helmetProp({ tape: true, crack: true })}</g>` + `<g opacity="${f(1 - E.io(clamp((lt - 0.8) / 0.4)))}">${K.armIn(760, 960, hx + 60, hy - 30, 'grip')}</g>`;
    const glow = clamp((t0 - K.wordAt('L34', 7) + 0.2) / 0.4); s += `<circle cx="300" cy="540" r="${f(190 * glow)}" fill="#ffd98a" opacity="${f(0.2 * glow)}"/>`;
    return K.pz(s, lt, 2.78, 1.0, 1.12, 300, 560);
  } });
  // L35 — um ano depois, no mesmo terreno
  SH.push({ id: 'B18', t0: 98.9, t1: 103.9, kind: 'scene', cam: [[0, 288, 540, 1.0], [1.8, 288, 540, 1.0], [2.6, 215, 548, 1.9, 'io'], [3.6, 250, 566, 2.6, 'io'], [5.0, 262, 580, 3.8, 'io']], build: (t, lt) => lot(t, { glowA: 1, built: true, moto: true, helmetChair: true }) });
  // L36 — "A casa catorze voltou."
  SH.push({ id: 'B19', t0: 103.9, t1: 106.3, kind: 'scene', cam: [[0, 262, 560, 2.2], [2.4, 288, 540, 1.0, 'io']], build: (t, lt) => lot(t, { glowA: 1, built: true, moto: true, helmetChair: true, houseGlow: E.io(clamp((lt - 0.2) / 1.2)) }) });

  G.STORYX = { SHOTS: SH };
})(window);
