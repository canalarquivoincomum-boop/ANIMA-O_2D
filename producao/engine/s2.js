// s2.js — "O Prédio das 21 Pizzas" (história 2, ~103 s). Cada plano nasce de uma frase da narração real (data_s2.js) e mostra literalmente o que ela diz.
(function (G) {
  const { track, clamp, lerp, E, f, noise1, rnd, NAVY, shade } = G.L; const { drawChar, EXPR, POSE, POSE0, hand, path, ell, tube, CAST } = G.CH;
  const V = G.V3, K = G.KIT, W = G.WORLD, S3 = G.SETS3, UI = G.UI3, { R, C, Pth } = G.SETS, { m } = W, T = K.T; const ex = V.ex;
  const SH = []; const A = id => window.PH[id][0] - 0.06, B = id => window.PH[id][1];
  const add = (id, t0, t1, kind, o) => SH.push(Object.assign({ id, t0, t1, kind }, o));
  const scr = (id, t0, t1, draw) => add(id, t0, t1, 'screen', { draw });
  const wA = (id, k) => K.wordAt(id, k);
  const BG_HALL = '#7d8a78';

  // ============================================================ objetos e UI ============================================================
  const baú = (w = 96, o = {}) => `<g>${R(-w / 2, -w * 0.62, w, w * 0.62, '#e8553d', w * 0.09, NAVY, 3.5)}${R(-w / 2, -w * 0.62, w, w * 0.16, '#b9402b', w * 0.05, NAVY, 3)}${T(0, -w * 0.18, 'ZAP', w * 0.34, '#fff')}${R(-w * 0.09, -w * 0.67, w * 0.18, w * 0.07, '#8d2f21', 2, NAVY, 2)}</g>`;
  const note = (w, h, lines, o = {}) => `<g transform="rotate(${o.rot || 0})"><path d="M${-w / 2},${-h / 2} L${w / 2},${-h / 2} L${w / 2},${h / 2} L${-w / 2},${h / 2}Z" fill="${o.col || '#ffe98a'}" stroke="${NAVY}" stroke-width="3.5"/><rect x="${-w / 2 - 6}" y="${-h / 2 - 12}" width="${w * 0.4}" height="26" fill="#f4efe0" opacity=".85" transform="rotate(-4)"/>${lines.map((l, i) => T(0, -h / 2 + (o.fs || 30) * 1.7 + i * (o.fs || 30) * 1.25, l, o.fs || 30, '#3a3a4a', 700, 'middle', 'font-style="italic"')).join('')}</g>`;
  const order21 = (lt, n) => {
    let s = R(0, 0, 300, 600, '#10142e') + R(0, 44, 300, 52, '#ff5a4a') + T(18, 78, 'NOVO PEDIDO', 21, '#fff', 800, 'start') + T(282, 76, '0:30', 15, '#ffd9d4', 800, 'end');
    s += R(14, 108, 272, 70, '#1b2142', 14, '#2c3466', 2) + T(28, 134, 'Edifício Aurora', 17, '#fff', 800, 'start') + T(28, 160, 'apto 82 • 8º andar', 15, '#ffd24a', 800, 'start');
    for (let i = 0; i < 21; i++) { const k = clamp((lt - i * 0.07) / 0.15); if (k <= 0) continue; const col = i % 7, row = Math.floor(i / 7); s += `<g transform="translate(${f(34 + col * 38)},${f(220 + row * 44 - (1 - k) * 30)})" opacity="${f(k)}">${R(-15, -13, 30, 26, '#b8793f', 4, NAVY, 2)}${R(-15, -13, 30, 8, '#d9a35d', 3, NAVY, 2)}</g>`; }
    s += T(150, 410, String(clamp(Math.floor(lt / 0.07) + 1, 0, 21)), 120, '#ffd24a', 800, 'middle') + T(150, 450, 'pizzas grandes', 20, '#c9d2ff', 700, 'middle') + R(14, 480, 272, 56, '#3ddc84', 14) + T(150, 516, 'R$ 816,90 • 21 itens', 18, '#0b2a18', 800, 'middle');
    return s;
  };
  const rating = (lt, val, o = {}) => {
    const lo = 4.0, hi = 5.0, y = v => 500 - (v - lo) / (hi - lo) * 360, th = 4.5;
    let s = R(0, 0, 300, 600, '#10142e') + T(150, 60, 'SUA NOTA', 16, '#9aa6e8', 700, 'middle') + T(150, 120, val.toFixed(2).replace('.', ','), 62, val >= 4.8 ? '#3ddc84' : (val >= th ? '#ffd24a' : '#ff5a4a'), 800, 'middle') + T(150, 146, '★★★★★', 20, '#ffd24a', 800, 'middle');
    s += `<rect x="60" y="${y(hi)}" width="60" height="${y(lo) - y(hi)}" rx="30" fill="#1b2142" stroke="#2c3466" stroke-width="2"/><rect x="60" y="${y(th)}" width="60" height="${y(lo) - y(th)}" rx="0" fill="#ff5a4a" opacity=".28"/><line x1="40" y1="${y(th)}" x2="260" y2="${y(th)}" stroke="#ff5a4a" stroke-width="3" stroke-dasharray="8 6"/>${T(190, y(th) - 8, 'mínimo 4,5', 16, '#ff9a8d', 800, 'start')}${T(190, y(th) + 24, 'abaixo = fora', 14, '#ff9a8d', 700, 'start')}`;
    s += `<g transform="translate(90,${f(y(val))})"><circle r="${o.pulse ? 16 + 3 * Math.sin(lt * 14) : 14}" fill="${val >= th ? '#ffd24a' : '#ff5a4a'}" stroke="#fff" stroke-width="4"/></g>`;
    return s;
  };
  K.rating = rating;

  // ============================================================ fachada e rua ============================================================
  const tower = (t, o = {}) => {
    const x0 = 288 - 360, w = 720, fl = 630, N = 8; let s = '';
    s += `<defs><linearGradient id="skT" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0d1030"/><stop offset="1" stop-color="#2b2f66"/></linearGradient></defs>` + R(-600, -5200, 1800, 6400, 'url(#skT)');
    for (let i = 0; i < 70; i++) s += `<circle cx="${f(rnd(i * 3.7) * 1500 - 400)}" cy="${f(-4800 + rnd(i * 9.1) * 3600)}" r="${f(1.5 + rnd(i) * 2)}" fill="#fff" opacity="${f(0.3 + 0.5 * Math.abs(Math.sin(t * 0.8 + i)))}"/>`;
    s += R(x0, 900 - fl * N, w, fl * N + 600, '#5b5d8c', 0, NAVY, 4) + R(x0 - 14, 900 - fl * N - 26, w + 28, 26, '#3f4170', 0, NAVY, 4);
    for (let f_ = 0; f_ < N; f_++) { const y = 900 - fl * (f_ + 1); s += `<line x1="${x0}" y1="${y}" x2="${x0 + w}" y2="${y}" stroke="${NAVY}" stroke-width="4" opacity=".5"/>`;
      for (let c = 0; c < 3; c++) { const wx = x0 + 70 + c * 220, wy = y + 160, on = f_ === 7 && c === 1 ? 1 : (rnd(f_ * 7 + c * 3.3) > 0.45), isT = f_ === 7 && c === 1;
        s += R(wx - 10, wy - 10, 150, 200, shade('#5b5d8c', -0.3), 6, NAVY, 3) + R(wx, wy, 130, 180, on ? '#ffcf78' : '#262a58', 4, NAVY, 3) + (on ? `<rect x="${wx}" y="${wy}" width="130" height="180" fill="${isT ? '#fff2b8' : '#f0a850'}" opacity=".55"/><path d="M${wx + 65},${wy} v180 M${wx},${wy + 90} h130" stroke="#7a4a2a" stroke-width="4"/>` : '') + R(wx - 14, wy + 190, 158, 14, '#8a8cb0', 3, NAVY, 3);
        if (isT) s += `<circle cx="${wx + 65}" cy="${wy + 90}" r="${f(150 + 8 * Math.sin(t * 3))}" fill="#ffe9a8" opacity=".18"/><g transform="translate(${wx + 65},${wy - 60})"><rect x="-58" y="-26" width="116" height="48" rx="24" fill="#10142e" stroke="#ffd24a" stroke-width="4"/>${T(0, 10, 'APTO 82', 24, '#ffd24a')}</g>`; }
      s += T(x0 + w - 40, y + 70, String(f_ + 1) + 'º', 40, '#c9d2ff', 800, 'end', 'opacity=".5"'); }
    s += R(288 - 150, 900 - 330, 300, 330, '#2a2f58', 6, NAVY, 4) + R(288 - 120, 900 - 300, 112, 300, '#9fd4ff', 0, NAVY, 3) + R(288 + 8, 900 - 300, 112, 300, '#9fd4ff', 0, NAVY, 3) + `<rect x="168" y="600" width="240" height="14" fill="#c9473d" stroke="${NAVY}" stroke-width="3"/><circle cx="288" cy="680" r="170" fill="#ffe9a8" opacity=".12"/>`;
    s += T(288, 590, 'EDIFÍCIO AURORA', 36, '#fff', 800);
    return s;
  };
  const street = (t) => R(-600, 900, 1800, 700, '#2e3250') + R(-600, 880, 1800, 24, '#8a8cb0', 0, NAVY, 3) + R(-600, 900, 1800, 12, '#5b5d82');
  // M02a: Nando estaciona diante do prédio e olha para cima
  add('H3', A('M02'), A('M02') + 1.34, 'scene', { dof: { far: 0, mid: 0 }, cam: [[0, 300, 560, 1.0], [1.34, 300, 520, 1.0, 'io']], build: (t, lt) => { const r = V.ride(t, lt, { speed: 0, base: 400, helmet: 1, turn: 0.2, poses: [{ t: 0, v: 'rideIdle' }], exprs: [{ t: 0, v: 'shock' }, { t: 0.8, v: 'worry', d: 0.4 }], look: [300, 0], bx: 300, noCars: true });
    return { far: S3.rua.far(0, t), mid: '', near: street(t) + `<g transform="translate(0,0)">${tower(t)}</g>` + r.near, fore: '' }; } });
  // M02b: a câmera sobe pela fachada até a janela do 82
  add('H4', A('M02') + 1.34, B('M02') + 0.1, 'scene', { cam: [[0, 300, 700, 0.9], [0.15, 300, 700, 0.9], [1.55, 330, -3880, 0.62, 'io']], build: (t, lt) => ({ far: S3.rua.far(0, t), mid: '', near: street(t) + tower(t), fore: '' }) });

  // ============================================================ saguão ============================================================
  const lobby = (t, lt, o) => {
    let s = R(0, 0, 576, 1024, BG_HALL) + R(0, 640, 576, 380, '#a7a58a') + R(0, 600, 576, 40, '#5b6a64');
    for (let i = 0; i < 12; i++) for (let j = 0; j < 4; j++) s += R(i * 52 + (j % 2) * 26 - 20, 900 + j * 36, 50, 34, (i + j) % 2 ? '#c9c7ae' : '#8f8d76', 0, '#6a6852', 1.5);
    s += R(0, 880, 576, 20, '#4f5a54') + `<rect x="0" y="0" width="576" height="130" fill="#1d2330" opacity=".35"/>`;
    // luz fluorescente
    s += `<rect x="60" y="30" width="200" height="18" rx="6" fill="#f4fbff" stroke="${NAVY}" stroke-width="3" opacity="${f(0.8 + 0.2 * Math.sin(t * 20))}"/><rect x="330" y="30" width="200" height="18" rx="6" fill="#f4fbff" stroke="${NAVY}" stroke-width="3"/>`;
    // elevador
    s += R(330, 280, 220, 620, '#8a929a', 6, NAVY, 4) + R(344, 300, 192, 600, '#aab4bb', 2, NAVY, 3) + `<line x1="440" y1="300" x2="440" y2="900" stroke="${NAVY}" stroke-width="4"/>` + R(350, 240, 180, 36, '#23263a', 6, NAVY, 3) + T(440, 266, '— —', 24, '#ff5a4a', 800) + R(560, 560, 28, 60, '#c9d2ee', 6, NAVY, 3) + C(574, 580, 6, '#ff5a4a', NAVY, 2);
    const sw = Math.sin(t * 2.2) * 3 * clamp(lt / 0.5);
    s += `<g transform="translate(440,560) rotate(${f(-6 + sw)})">${R(-86, -64, 172, 128, '#fff6d8', 4, NAVY, 3.5)}${T(0, -22, 'ELEVADOR', 26, '#c33')}${T(0, 8, 'FORA DE', 26, '#c33')}${T(0, 40, 'SERVIÇO', 26, '#c33')}<path d="M-98,-72 L98,72 M98,-72 L-98,72" stroke="#ffd24a" stroke-width="10" opacity=".9"/><path d="M-98,-72 L98,72 M98,-72 L-98,72" stroke="${NAVY}" stroke-width="2" stroke-dasharray="14 14"/></g>`;
    // balcão + caixas de correio + porteiro
    for (let r = 0; r < 4; r++) for (let c = 0; c < 6; c++) s += R(20 + c * 42, 300 + r * 40, 38, 36, '#9aa8b0', 2, NAVY, 2) + C(39 + c * 42, 318 + r * 40, 3, '#3a3f5a');
    if (o.porter) s += drawChar({ cast: 'porteiro', x: 135, y: 790, s: 1.55, flip: 1, t, ph: 0.4, pose: Object.assign({}, POSE.stand, o.porterPose ? o.porterPose(lt) : { hL: [-40, -84], hR: [40, -84] }), expr: o.porterExpr ? o.porterExpr(lt) : EXPR.warm, look: [440, 600], turn: 0.3, light: { ox: -1, oy: -0.8, rim: '#e8f4ff' } }).svg;
    s += `<path d="M-10,640 L280,640 L300,900 L-10,900Z" fill="#8d6a42" stroke="${NAVY}" stroke-width="4"/><path d="M-10,640 L280,640 L286,664 L-10,664Z" fill="#c9a06a" stroke="${NAVY}" stroke-width="4"/>${R(20, 676, 230, 150, '#7a5a3a', 6, NAVY, 3)}${T(135, 760, 'PORTARIA', 30, '#f4efe0')}<ellipse cx="236" cy="640" rx="22" ry="5" fill="#1a1d44" opacity=".4"/>`;
    if (o.nando) { const nx = o.nando(lt); s += `<ellipse cx="${f(nx.x)}" cy="912" rx="80" ry="12" fill="#000" opacity=".3"/>` + drawChar({ cast: 'nando', x: nx.x, y: 910, s: 1.55, flip: 1, t, ph: 0.7, pose: Object.assign({}, POSE.stand, { hL: [18, -84], hR: [46, -84], lean: 4 }), walk: nx.walk, expr: nx.expr || EXPR.focus, look: nx.look || [560, 700], turn: nx.turn === undefined ? 0.5 : nx.turn, light: { ox: 1, oy: -0.8, rim: '#e8f4ff' }, propsFn: J => `<g transform="translate(${f((J.hL[0] + J.hR[0]) / 2 + 8)},${f(J.hL[1] + 6)})">${baú(84)}</g>` }).svg; }
    return s;
  };
  scr('S_lob1', A('M03') + 1.76, A('M04'), (t, lt) => K.pz(lobby(t, lt, { nando: l => ({ x: lerp(-120, 150, E.out(clamp(l / 0.7))), walk: l < 0.75 ? { ph: l * 1.8, amp: 0.8 } : undefined, expr: l < 0.9 ? EXPR.focus : EXPR.worry, look: l < 1.0 ? [560, 700] : [440, 560], turn: 0.5 }) }), lt, 1.6, 1.0, 1.08, 400, 560));

  // ============================================================ subida de escada (de lado; a escada rola e as pernas pisam degraus de verdade) ============================================================
  const RUN = 34, RISE = 20, SS = 1.75;
  const climb = (t, lt, o) => {
    const prog = o.prog(lt), cx = 230, cy = 800, rpx = RUN * SS, spx = RISE * SS; const k0 = Math.floor(prog) - 9;
    let s = `<defs><linearGradient id="stw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8a948c"/><stop offset="1" stop-color="#5e6860"/></linearGradient></defs>` + R(0, 0, 576, 1024, 'url(#stw)');
    // parede com faixa e número do andar rolando junto com a escada
    const ox = -prog * rpx * 0.55, oy = prog * spx * 0.55;
    for (let i = -4; i < 14; i++) s += `<path d="M${f(ox + i * 120)},${f(oy - 200)} l0,1400" stroke="#6e7870" stroke-width="3" opacity=".6"/>`;
    s += `<g transform="translate(${f(ox)},${f(oy)})">${[0, 1, 2, 3].map(i => `<g transform="translate(${f(60 + i * 640)},${f(-i * 380 + 380)})"><rect x="-6" y="0" width="140" height="190" rx="4" fill="#fff6d8" stroke="${NAVY}" stroke-width="3"/>${T(64, 140, String(o.floor0 + i), 110, '#c33', 800)}</g>`).join('')}</g>`;
    s += `<rect x="0" y="0" width="576" height="1024" fill="#1d2330" opacity="${f(0.15 + 0.1 * (rnd(Math.floor(t * 9)) > 0.9 ? 1 : 0))}"/>`;
    // degraus
    const stairPts = []; for (let k = k0; k <= k0 + 22; k++) { const x = cx + (k - prog) * rpx, y = cy - (k - prog) * spx; stairPts.push([x, y]); }
    let body = ''; stairPts.forEach(([x, y], i) => { body += `${i ? 'L' : 'M'}${f(x)},${f(y)} L${f(x + rpx)},${f(y)} `; });
    const last = stairPts[stairPts.length - 1], first = stairPts[0];
    s += `<path d="${body} L${f(last[0] + rpx)},1300 L${f(first[0])},1300Z" fill="#7d867f" stroke="${NAVY}" stroke-width="4" stroke-linejoin="round"/>`;
    stairPts.forEach(([x, y]) => { s += `<path d="M${f(x)},${f(y)} L${f(x + rpx)},${f(y)}" stroke="#c9d2c8" stroke-width="7" stroke-linecap="round"/><path d="M${f(x + rpx)},${f(y)} l0,${f(spx)}" stroke="#5a645c" stroke-width="3" opacity=".7"/>`; });
    // corrimão
    s += `<path d="M${f(first[0])},${f(first[1] - 150)} L${f(last[0] + rpx)},${f(last[1] - 150)}" stroke="#2a2f40" stroke-width="12" stroke-linecap="round"/>`;
    stairPts.forEach(([x, y], i) => { if (i % 3 === 0) s += `<path d="M${f(x + rpx * 0.5)},${f(y)} L${f(x + rpx * 0.5)},${f(y - 150)}" stroke="#3a4054" stroke-width="7"/>`; });
    // personagem
    const feet = (ph) => { const q = (prog + ph) / 2, base = Math.floor(q), fr = q - base, sw = clamp((fr - 0.5) * 2), idx = 2 * base + 2 * E.io(sw) - ph; return [(idx - prog) * RUN, -(idx - prog) * RISE - Math.sin(sw * Math.PI) * 9]; };
    const fL = feet(0), fR = feet(1), bob = Math.abs(Math.sin(prog * Math.PI)) * 2.2, trem = o.tremble ? noise1(t * 60, 4) * o.tremble : 0;
    s += `<ellipse cx="${cx + 20}" cy="${cy + 6}" rx="70" ry="10" fill="#000" opacity=".25"/>`;
    s += drawChar({ cast: 'nando', x: cx + trem, y: cy, s: SS, flip: 1, t, ph: 0.7, idle: 0, pose: Object.assign({}, POSE0, { hipDrop: 24 + bob, lean: 8, fL: [fL[0] - 8, fL[1]], fR: [fR[0] + 8, fR[1]], hL: [24, -80 + bob], hR: [48, -80 + bob], headDown: 2 }), expr: o.expr ? o.expr(lt) : EXPR.focus, look: [cx + 300, cy - 260], turn: 0.5, light: { ox: 1, oy: -0.8, rim: '#e8f4ff' }, propsFn: J => `<g transform="translate(${f((J.hL[0] + J.hR[0]) / 2 + 12)},${f(J.hL[1] + 4)})">${baú(86)}<g transform="translate(14,-58) scale(0.3)">${K.helmetProp({ tape: true, crack: true })}</g></g>` }).svg;
    // HUD
    s += `<g transform="translate(288,92)"><rect x="-150" y="-30" width="300" height="60" rx="30" fill="#10142e" stroke="#ffd24a" stroke-width="4"/>${T(0, 12, `VIAGEM ${o.trip}/7`, 32, '#ffd24a')}</g>`;
    if (o.timer) s += `<g transform="translate(288,160)" opacity="${f(0.8 + 0.2 * Math.sin(t * 8))}"><rect x="-90" y="-26" width="180" height="52" rx="26" fill="#3a1f26" stroke="#ff5a4a" stroke-width="4"/>${T(0, 12, o.timer(lt), 32, '#ff5a4a')}</g>`;
    return s;
  };
  const climbShot = (id, t0, t1, o) => scr(id, t0, t1, (t, lt) => K.pz(climb(t, lt, Object.assign({ prog: l => 3 + l * 2.6 }, o)), lt, t1 - t0, 1.0, 1.05, 288, 560));
  climbShot('S_c1', A('M06'), A('M07') + 1.0, { trip: 1, floor0: 1, prog: l => 2 + l * 2.7, expr: EXPR.focus ? l => (l < 1 ? EXPR.focus : EXPR.worry) : null });

  // ============================================================ corredor (perspectiva de 1 ponto) ============================================================
  const CV = { x: 288, y: 440, pm: 300, D: 5 }, csc = d => CV.D / (CV.D + d), cX = (xm, d) => CV.x + xm * CV.pm * csc(d), cY = (d, h) => CV.y + (1.55 - h) * CV.pm * csc(d), cp = (xm, d, h) => `${f(cX(xm, d))},${f(cY(d, h))}`;
  const quadW = (side, d0, d1, h0, h1) => [cp(side * 1.3, d0, h0), cp(side * 1.3, d0, h1), cp(side * 1.3, d1, h1), cp(side * 1.3, d1, h0)].join(' ');
  const corridor = (t, o = {}) => {
    const warm = o.warm || 0; let s = R(0, 0, 576, 1024, '#2a2f40');
    s += `<polygon points="${cp(-1.3, 0, 2.7)} ${cp(1.3, 0, 2.7)} ${cp(1.3, 26, 2.7)} ${cp(-1.3, 26, 2.7)}" fill="#c9d0c8"/>`;
    s += `<polygon points="${cp(-1.3, 0, 0)} ${cp(1.3, 0, 0)} ${cp(1.3, 26, 0)} ${cp(-1.3, 26, 0)}" fill="#8f8a78"/>`;
    for (let d = 0.4; d < 26; d += 0.8) s += `<line x1="${f(cX(-1.3, d))}" y1="${f(cY(d, 0))}" x2="${f(cX(1.3, d))}" y2="${f(cY(d, 0))}" stroke="#6f6a58" stroke-width="${f(2.5 * csc(d) * 2)}"/>`;
    s += `<polygon points="${cp(-0.6, 0, 0.01)} ${cp(0.6, 0, 0.01)} ${cp(0.6, 26, 0.01)} ${cp(-0.6, 26, 0.01)}" fill="#7a3d3d" opacity=".65"/>`;
    s += `<polygon points="${quadW(-1, 0, 26, 0, 2.7)}" fill="#7d8a78"/><polygon points="${quadW(1, 0, 26, 0, 2.7)}" fill="#6f7c6a"/>`;
    s += `<polygon points="${quadW(-1, 0, 26, 0, 0.9)}" fill="#5e6a5c"/><polygon points="${quadW(1, 0, 26, 0, 0.9)}" fill="#55625a"/>`;
    // portas dos dois lados (algumas abertas, com luz quente saindo, conforme o.open(i))
    for (let i = 0; i < 8; i++) { const side = i % 2 ? 1 : -1, d0 = 2.6 + Math.floor(i / 2) * 5.2, op = o.open ? o.open(i) : 0;
      s += `<polygon points="${quadW(side, d0, d0 + 0.95, 0, 2.1)}" fill="${op > 0 ? '#ffd98a' : '#8b5a3c'}" stroke="${NAVY}" stroke-width="${f(3 * csc(d0) * 2)}"/>`;
      if (op > 0) { const dd = d0 + 0.95 * (1 - 0.4 * op); s += `<polygon points="${quadW(side, d0, dd, 0, 2.1)}" fill="#8b5a3c" stroke="${NAVY}" stroke-width="2.4"/>`; s += `<polygon points="${cp(side * 1.3, d0, 0)} ${cp(side * 0.2, d0 - 0.3, 0)} ${cp(side * 0.2, d0 + 1.6, 0)} ${cp(side * 1.3, d0 + 0.9, 0)}" fill="#ffd98a" opacity="${f(0.3 * op)}"/>`; }
      else s += `<circle cx="${f(cX(side * 1.3, d0 + 0.7))}" cy="${f(cY(d0, 1.0))}" r="${f(3 * csc(d0) * 2)}" fill="#e8c36a"/>`; }
    // luzes de teto
    for (let d = 2; d < 24; d += 4.5) s += `<polygon points="${cp(-0.35, d, 2.69)} ${cp(0.35, d, 2.69)} ${cp(0.35, d + 0.9, 2.69)} ${cp(-0.35, d + 0.9, 2.69)}" fill="#f4fbff" opacity="${f(0.85 + 0.15 * Math.sin(t * 17 + d))}"/>`;
    // fundo: porta da escada
    s += `<polygon points="${cp(-1.3, 26, 0)} ${cp(1.3, 26, 0)} ${cp(1.3, 26, 2.7)} ${cp(-1.3, 26, 2.7)}" fill="#4a5a4e" stroke="${NAVY}" stroke-width="3"/>` + `<polygon points="${cp(-0.5, 26, 0)} ${cp(0.5, 26, 0)} ${cp(0.5, 26, 2.1)} ${cp(-0.5, 26, 2.1)}" fill="#2f6f4a" stroke="${NAVY}" stroke-width="3"/>` + `<g transform="translate(${f(cX(0, 26))},${f(cY(26, 2.45))})"><rect x="-22" y="-9" width="44" height="18" fill="#2fe07a"/>${T(0, 6, 'SAÍDA', 12, '#0b2a18')}</g>`;
    s += `<rect width="576" height="1024" fill="#ffb04a" opacity="${f(0.1 * warm)}"/>`;
    return s;
  };
  const people = ['v1', 'v2', 'v3', 'v4', 'v5', 'v6', 'lucia', 'porteiro'];
  const crowd = (t, t0, n, o = {}) => {
    const arr = []; for (let i = 0; i < n; i++) { const ts = t0 + i * (o.gap || 0.16), u = clamp((t - ts) / (o.dur || 2.0)); if (u <= 0) continue; const side = i % 2 ? 1 : -1, d = lerp(o.dFar === undefined ? 20 : o.dFar, o.dNear === undefined ? 1.6 : o.dNear, E.io(u)), xm = side * lerp(1.0, 0.18 + 0.24 * ((i * 37) % 5) / 4, E.io(u)) * (i % 3 === 0 ? 1 : 0.8); arr.push({ i, d, xm, u }); }
    arr.sort((a, b) => b.d - a.d);
    return arr.map(p => { const sc = 1.62 * csc(p.d), y = cY(p.d, 0), x = cX(p.xm, p.d), cast = people[p.i % people.length]; const wk = { ph: t * 1.6 + p.i * 0.3, amp: 0.9 * (p.u < 1 ? 1 : 0) };
      return `<ellipse cx="${f(x)}" cy="${f(y + 3)}" rx="${f(52 * sc)}" ry="${f(8 * sc)}" fill="#000" opacity=".28"/>` + drawChar({ cast, x, y, s: sc, flip: 1, t, ph: p.i * 0.77, pose: Object.assign({}, POSE0, { hR: [58, -92], gR: 'mitt' }), walk: wk, expr: p.i % 3 === 0 ? EXPR.warm : EXPR.smile, look: [288, 600], turn: 0, light: null, propsFn: J => `<g transform="translate(${f(J.hR[0] + 6)},${f(J.hR[1] - 6)})">${plate(p.i)}</g>` }).svg; }).join('');
  };
  const plate = (i) => { const kinds = ['#e8c36a', '#c9473d', '#f4efe0', '#7fb08a', '#d98a5a', '#b89cd9']; return `<ellipse cx="0" cy="0" rx="30" ry="9" fill="#f4efe0" stroke="${NAVY}" stroke-width="2.6"/><ellipse cx="0" cy="-6" rx="19" ry="8" fill="${kinds[i % kinds.length]}" stroke="${NAVY}" stroke-width="2"/><circle cx="-6" cy="-10" r="4" fill="${shade(kinds[i % kinds.length], 0.3)}"/>`; };

  // ============================================================ porta do 82 ============================================================
  const doorFront = (t, lt, o) => {
    const morning = o.morning ? 1 : 0; let s = R(0, 0, 576, 1024, morning ? '#c9c2a0' : '#7d8a78') + R(0, 900, 576, 124, morning ? '#a29a7c' : '#6f6a58') + R(0, 880, 576, 22, '#5e6a5c');
    s += `<rect x="0" y="0" width="576" height="130" fill="#1d2330" opacity="${morning ? 0.1 : 0.3}"/><rect x="0" y="0" width="576" height="1024" fill="${morning ? '#ffe9a8' : '#10142e'}" opacity="${morning ? 0.12 : 0.18}"/>`;
    const dx = 150, dy = 120, dw = 280, dh = 770; const shake = o.shake || 0;
    s += `<g transform="translate(${f(noise1(t * 60, 7) * shake)},0)">` + R(dx - 16, dy - 16, dw + 32, dh + 16, '#5e4430', 4, NAVY, 4) + R(dx, dy, dw, dh, '#8b5a3c', 3, NAVY, 4);
    s += R(dx + 26, dy + 40, dw - 52, 250, '#7a4c30', 6, NAVY, 3) + R(dx + 26, dy + 330, dw - 52, 380, '#7a4c30', 6, NAVY, 3) + `<path d="M${dx + 30},${dy + 44} L${dx + 30},${dy + 286} M${dx + 30},${dy + 334} L${dx + 30},${dy + 706}" stroke="#a87650" stroke-width="3" opacity=".6"/>`;
    s += R(dx + dw / 2 - 40, dy + 70, 80, 70, '#e8c36a', 10, NAVY, 3.5) + T(dx + dw / 2, dy + 124, '82', 56, '#5a3a10') + C(dx + dw / 2, dy + 190, 12, '#2a2418', NAVY, 3) + C(dx + dw / 2, dy + 190, 5, '#9fd4ff', null) + R(dx + dw - 36, dy + 390, 16, 44, '#e8c36a', 6, NAVY, 3);
    if (o.sign !== false) { const nw = o.sign === 'new' && lt >= (o.signAt || 0); const k = nw ? E.spring2(clamp((lt - (o.signAt || 0)) / 0.5)) : 1;
      s += `<g transform="translate(${dx + dw / 2},${dy + 470}) rotate(${nw ? 0 : -2}) scale(${f(k)})"><rect x="-96" y="-130" width="192" height="256" rx="4" fill="${nw ? '#fff6d8' : '#cfc7a8'}" stroke="${NAVY}" stroke-width="3.5" opacity="${nw ? 1 : 0.92}"/>${nw ? `${T(0, -78, 'TOQUE A', 32, '#1d2747')}${T(0, -42, 'CAMPAINHA.', 27, '#1d2747')}<line x1="-70" y1="-18" x2="70" y2="-18" stroke="#c33" stroke-width="4"/>${T(0, 28, 'ELA', 38, '#c33')}${T(0, 70, 'FUNCIONA.', 28, '#c33')}<g transform="translate(0,98)"><path d="M-14,10 q0,-26 14,-26 q14,0 14,26z" fill="#ffd24a" stroke="${NAVY}" stroke-width="2.4"/></g>` : `<g opacity="${f(o.signInk === undefined ? 0.55 : o.signInk)}">${T(0, -70, 'CONSERTO', 30, '#6a6048')}${T(0, -36, 'DE TUDO', 30, '#6a6048')}<line x1="-70" y1="-16" x2="70" y2="-16" stroke="#8a7a5a" stroke-width="3"/>${T(0, 22, 'GRÁTIS', 34, '#6a6048')}${T(0, 66, 'toque a', 22, '#6a6048', 700)}${T(0, 94, 'campainha', 26, '#6a6048', 700)}</g><path d="M-96,-126 q90,40 192,0 M-96,100 q100,30 192,0" fill="none" stroke="#8a7a5a" stroke-width="2" opacity=".3"/>`}</g>`; }
    s += `</g>`;
    // campainha (ao lado da porta)
    const bx = 486, by = 470, bs = o.bell || 'broken';
    if (bs !== 'none') s += R(bx - 34, by - 50, 68, 100, '#9a9488', 6, NAVY, 3.5);
    if (bs === 'none') { /* ainda não percebeu a campainha */ } else if (bs === 'broken') { const sw = Math.sin(t * 2.6) * 6; s += C(bx, by - 14, 15, '#6a6a60', NAVY, 3) + `<path d="M${bx},${by - 14} C${bx + 4},${by + 20} ${bx + sw * 2},${by + 50} ${bx + sw * 3},${by + 92}" stroke="#d9503f" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M${bx + 3},${by - 12} C${bx + 8},${by + 18} ${bx + sw * 2 + 4},${by + 48} ${bx + sw * 3 + 4},${by + 90}" stroke="#2a2a30" stroke-width="3" fill="none"/>` + `<g transform="translate(${bx - 14},${by + 66}) rotate(${f(-8 + sw)})"><rect x="-62" y="-14" width="124" height="38" fill="#e8d9a0" stroke="${NAVY}" stroke-width="2.6"/>${T(0, 2, 'QUEBRADA', 15, '#6a2a2a', 800)}${T(0, 17, 'bata na porta', 12, '#6a2a2a', 700)}</g>`; }
    else { const glow = bs === 'ring' ? 0.5 + 0.5 * Math.sin(t * 40) : 0; s += C(bx, by - 14, 15, '#ffd24a', NAVY, 3) + (glow ? C(bx, by - 14, 30 + glow * 14, '#ffd24a', null).replace('/>', ` opacity="${f(0.3 * glow)}"/>`) : '') + `<path d="M${bx - 14},${by + 14} L${bx + 14},${by + 54}" stroke="#d9503f" stroke-width="5" stroke-linecap="round"/>` + `<g transform="translate(${bx - 6},${by + 34}) rotate(-24)"><rect x="-26" y="-9" width="52" height="18" rx="2" fill="#26262e" stroke="${NAVY}" stroke-width="2.4"/><path d="M-26,-3 L26,-3 M-26,4 L26,4" stroke="#4a4a56" stroke-width="2"/></g>`; }
    // capacho
    s += `<path d="M${dx + 10},${dy + dh + 4} L${dx + dw - 10},${dy + dh + 4} L${dx + dw + 4},${dy + dh + 56} L${dx - 4},${dy + dh + 56}Z" fill="#6a4f3a" stroke="${NAVY}" stroke-width="3"/>`;
    return s;
  };
  // M08: Nando bate duas vezes (punho enquadrado à esquerda) — TOC TOC
  scr('S_knock', A('M08'), A('M08') + 1.7, (t, lt) => { const t0 = lt + A('M08'), k1 = clamp((t0 - wA('M08', 0) + 0.05) / 0.25), k2 = clamp((t0 - wA('M08', 1) - 0.1) / 0.25), hit = (kk, c) => kk > 0 && kk < 1 ? Math.sin(kk * Math.PI) : 0; const kn = Math.max(hit(k1), hit(k2));
    let s = doorFront(t, lt, { shake: 5 * kn, sign: false, bell: 'none' }); s += K.armIn(-120, 760, 120 + 40 * (1 - kn), 470 + 6 * kn, 'fist');
    [[k1, 90, 360], [k2, 120, 320]].forEach(([kk, x, y]) => { if (kk > 0.05 && kk < 1.0) s += `<g transform="translate(${x},${y}) rotate(-12) scale(${f(0.7 + 0.5 * kk)})" opacity="${f(1 - kk)}">${T(0, 0, 'TOC!', 54, '#ffd24a', 800, 'middle', `stroke="${NAVY}" stroke-width="8" paint-order="stroke"`)}</g>`; });
    return K.pz(s, lt, 1.7, 1.0, 1.06, 300, 520); });

  // ============================================================ cortes do prédio (8 andares, 21 pessoas) ============================================================
  const cutaway = (t, lt, o) => {
    let s = R(0, 0, 576, 1024, '#10142e') + UI.bokeh(t * 2).replace(/<rect[^>]*url\(#bkg\)[^>]*\/>/, ''); const x0 = 96, w = 384, fh = 92, base = 910;
    s += R(x0, base - fh * 8, w, fh * 8, '#2a2f58', 6, NAVY, 4);
    for (let i = 0; i < 8; i++) { const y = base - fh * (i + 1); s += R(x0, y, w, fh, i % 2 ? '#2e3566' : '#262c5a', 0, NAVY, 3) + R(x0 + 120, y + 10, w - 140, fh - 14, '#3a4280', 4, null) + T(x0 + w - 24, y + 62, String(i + 1) + 'º', 36, '#c9d2ff', 800, 'end', 'opacity=".55"') + R(x0 + w - 92, y + 20, 40, fh - 22, '#8b5a3c', 3, NAVY, 2.4); }
    // caixa da escada (zigue-zague)
    s += R(x0, base - fh * 8, 118, fh * 8, '#1d2347', 0, NAVY, 3);
    for (let i = 0; i < 8; i++) { const y = base - fh * (i + 1); s += `<path d="M${x0 + 10},${y + fh - 4} L${x0 + 108},${y + fh * 0.5} L${x0 + 10},${y + 6}" fill="none" stroke="#9aa6e8" stroke-width="5" stroke-linejoin="round" opacity=".8"/>`; }
    return s + (o.extra ? o.extra(t, lt, { x0, w, fh, base }) : '');
  };
  scr('S_cut1', A('M04') + 1.62, A('M04') + 2.9, (t, lt) => { const t0 = lt + A('M04') + 1.62; const n = clamp(Math.floor((t0 - wA('M04', 5)) / 0.16) + 1, 0, 8);
    return K.pz(cutaway(t, lt, { extra: (tt, l, g) => { let s = ''; for (let i = 0; i < n; i++) { const y = g.base - g.fh * (i + 1); s += `<rect x="${g.x0}" y="${y}" width="${g.w}" height="${g.fh}" fill="#ffd24a" opacity="${f(0.22 * clamp((t0 - wA('M04', 5) - i * 0.16) / 0.3 * 2) * (1 - 0.7 * (i < n - 1 ? 1 : 0)))}"/>`; } s += `<g transform="translate(${g.x0 + g.w + 6},${g.base - g.fh * 4})">${T(40, 0, String(n), 120, '#ffd24a', 800, 'middle')}${T(40, 40, 'andares', 22, '#c9d2ff', 700, 'middle')}</g>`; return s; } }), lt, 1.28, 1.0, 1.05, 288, 500); });
  scr('S_cut2', A('M04') + 2.9, A('M05'), (t, lt) => { const t0 = lt + A('M04') + 2.9; const n = clamp(Math.floor((t0 - wA('M04', 9)) / 0.12) + 1, 0, 7), q = E.spring(clamp((t0 - wA('M04', 9) + 0.2) / 0.3));
    let s = R(0, 0, 576, 1024, '#10142e') + UI.bokeh(t * 2).replace(/<rect[^>]*url\(#bkg\)[^>]*\/>/, '') + T(288, 220, '21 pizzas ÷ 3 =', 40, '#c9d2ff', 800);
    for (let i = 0; i < 7; i++) { const k = clamp((t0 - wA('M04', 9) - i * 0.12) / 0.2); if (k <= 0) continue; s += `<g transform="translate(${f(78 + i * 70)},${f(520 + (1 - E.spring(k)) * -50)}) scale(${f(0.9 * E.spring(k))})" opacity="${f(k)}">${baú(74)}${T(0, 26, String(i + 1), 26, '#fff')}</g>`; }
    s += `<g transform="translate(288,390) scale(${f(0.6 + 0.4 * q)})" opacity="${f(q)}">${T(0, 0, '7 viagens', 80, '#ffd24a')}</g>`;
    return K.pz(s, lt, 1.08, 1.0, 1.05, 288, 480); });

  // ============================================================ M01–M05: gancho, aposta ============================================================
  scr('H1', 0, 1.4, (t, lt) => { const k = E.spring2(clamp((lt - 0.2) / 0.4)), vib = lt > 0.2 && lt < 1.2 ? 5 * Math.exp(-(lt - 0.2) * 1.6) : 0; const sc = UI.lock(lt, { notifAt: 0.2, time: '23:00' }).replace('sexta-feira, 12 de outubro', 'sexta-feira').replace('Forno Vivo • Rua das Acácias, 14', 'Edifício Aurora • apto 82').replace('1 pizza grande • R$ 38,90', '21 pizzas grandes • R$ 816,90');
    return K.pz(UI.bokeh(t * 3) + UI.phone(288, 392, 1.16, sc, { t, shake: vib }), lt, 1.4, 1.0, 1.1, 288, 420); });
  scr('H2', 1.4, A('M02'), (t, lt) => K.pz(UI.bokeh(t * 3) + UI.phone(288, 392, 1.16, order21(lt, 21), { t, shake: lt < 0.3 ? 3 : 0.4 }), lt, A('M02') - 1.4, 1.0, 1.08, 288, 400));
  scr('S_tmr', A('M03'), A('M03') + 1.76, (t, lt) => K.pz(UI.bokeh(t * 3) + UI.phone(288, 392, lerp(1.14, 1.22, E.io(clamp(lt / 1.7))), UI.timer(lt, { start: 2400, total: 2400, rate: 60 }).replace('Rua das Acácias, 14', 'Edifício Aurora, apto 82').replace('Forno Vivo • sem cebola', '21 pizzas • 8º andar'), { t }), lt, 1.76, 1.0, 1.06, 288, 400));
  scr('S_bau', A('M04'), A('M04') + 1.62, (t, lt) => { const t0 = lt + A('M04');
    let s = R(0, 0, 576, 1024, '#241c30') + `<defs><radialGradient id="bg3" cx="0.5" cy="0.5" r="0.7"><stop offset="0" stop-color="#ffd98a" stop-opacity=".35"/><stop offset="1" stop-color="#0c0a1e" stop-opacity=".85"/></radialGradient></defs><rect width="576" height="1024" fill="url(#bg3)"/>`;
    for (let i = 0; i < 3; i++) { const k = E.spring(clamp((t0 - wA('M04', 3) + 0.05 - i * 0.14) / 0.3)); s += `<g transform="translate(288,${f(500 - i * 52 - (1 - k) * 190)}) scale(1.55)" opacity="${f(clamp(k * 2))}">${K.pizzaBox(190, { sub: false })}</g>`; }
    s += `<g transform="translate(288,740) scale(2.2)">${R(-90, -110, 180, 110, '#e8553d', 12, NAVY, 3.5)}${R(-90, -110, 180, 26, '#b9402b', 8, NAVY, 3)}${T(0, -30, 'ZAP', 54, '#fff')}</g>`;
    return K.pz(s, lt, 1.62, 1.0, 1.06, 288, 560); });
  scr('S_rate1', A('M05'), A('M05') + 2.3, (t, lt) => { const t0 = lt + A('M05'), v = 4.52; return K.pz(UI.bokeh(t * 3) + UI.phone(288, 392, 1.18, rating(lt, v), { t }), lt, 2.3, 1.0, 1.06, 288, 400); });
  scr('S_rate2', A('M05') + 2.3, A('M06'), (t, lt) => { const t0 = lt + A('M05') + 2.3, off = clamp((t0 - wA('M05', 17)) / 0.4);
    let c = rating(lt + 2, 4.52, { pulse: true }); if (off > 0) c += `<g opacity="${f(E.io(off))}">${R(0, 0, 300, 600, '#0a0c1c', 0)}${T(150, 250, '☾', 90, '#9aa6e8')}${T(150, 340, 'FORA DA NOITE', 26, '#ff5a4a')}${T(150, 372, 'conta pausada até amanhã', 14, '#9aa6e8', 700)}</g>`;
    return K.pz(UI.bokeh(t * 3) + UI.phone(288, 392, 1.18, c, { t, shake: lt > 0.4 && lt < 2.5 ? 1.2 : 0 }), lt, A('M06') - (A('M05') + 2.3), 1.06, 1.12, 288, 400); });

  // M06 → M07 : sobe a primeira viagem, o porteiro ri, a porta do 82 ao longe
  scr('S_lob2', A('M07') + 1.0, A('M07') + 3.7, (t, lt) => K.pz(lobby(t, lt, { porter: true, porterPose: l => ({ hL: [-40, -84], hR: lerp(40, 92, E.spring2(clamp((lt - 1.3) / 0.4))) ? [lerp(40, 70, E.spring2(clamp((lt - 1.3) / 0.4))), lerp(-84, -164, E.spring2(clamp((lt - 1.3) / 0.4)))] : [40, -84], gR: 'point' }), porterExpr: l => Object.assign({}, EXPR.happy, { mo: 0.4 + 0.4 * Math.abs(Math.sin(t * 14)), mw: 15 }), nando: l => ({ x: lerp(250, 470, E.io(clamp(l / 2.6))), walk: { ph: l * 1.6, amp: 0.7 }, expr: EXPR.resigned, look: [135, 600], turn: -0.3 }) }), lt, 2.7, 1.0, 1.08, 200, 560));
  scr('S_dst', A('M07') + 3.7, A('M08'), (t, lt) => K.pz(corridor(t, {}) + drawChar({ cast: 'nando', x: cX(0.0, lerp(14, 4, E.io(clamp(lt / 1.6)))), y: cY(lerp(14, 4, E.io(clamp(lt / 1.6))), 0), s: 1.62 * csc(lerp(14, 4, E.io(clamp(lt / 1.6)))), flip: 1, t, ph: 0.7, pose: Object.assign({}, POSE0, { hL: [18, -84], hR: [46, -84] }), walk: { ph: t * 1.6, amp: 0.8 }, expr: EXPR.focus, look: [288, 400], turn: 0, light: null, propsFn: J => `<g transform="translate(${f((J.hL[0] + J.hR[0]) / 2 + 8)},${f(J.hL[1] + 6)})">${baú(84)}</g>` }).svg, lt, 1.68, 1.0, 1.12, 288, 440));
  scr('S_ord', A('M08') + 1.7, A('M09'), (t, lt) => { const c = UI.order(lt, { hl: false }).replace('1× Pizza grande', '21× Pizza grande').replace('Rua das Acácias, 14', 'Edifício Aurora, 82').replace('Jardim Aurora', 'bata 2x · ele escuta mal').replace('3,1 km • R$ 38,90', 'sexta · 23:21').replace('23:47', '23:21'); return K.pz(UI.bokeh(t * 3) + UI.phone(288, 392, 1.18, c, { t }), lt, 1.0, 1.0, 1.05, 288, 400); });
  scr('S_closed', A('M09'), A('M10'), (t, lt) => K.pz(doorFront(t, lt, { sign: false, bell: 'none' }), lt, 1.0, 1.0, 1.08, 290, 470));
  climbShot('S_c3', A('M10'), A('M10') + 1.2, { trip: 3, floor0: 3, prog: l => 20 + l * 2.7 });
  scr('S_bil', A('M10') + 1.2, A('M11'), (t, lt) => { const k = E.spring2(clamp(lt / 0.5)); let s = R(0, 0, 576, 1024, '#241c30') + `<defs><radialGradient id="bg4" cx="0.5" cy="0.45" r="0.7"><stop offset="0" stop-color="#ffd98a" stop-opacity=".3"/><stop offset="1" stop-color="#0c0a1e" stop-opacity=".85"/></radialGradient></defs><rect width="576" height="1024" fill="url(#bg4)"/>`;
    s += `<g transform="translate(288,640) scale(2.0)">${R(-110, -70, 220, 90, '#e8553d', 10, NAVY, 3.5)}${T(0, -10, 'ZAP', 46, '#fff')}</g><g transform="translate(300,${f(520 - (1 - k) * 30)}) rotate(-6) scale(${f(0.8 + 0.2 * k)})">${note(180, 150, ['obrigada', '…'], { rot: 0, fs: 32 })}</g>`;
    return K.pz(s, lt, B('M10') - A('M10') - 1.2, 1.0, 1.1, 300, 540); });
  // M11 — o bilhete lido
  const bilhete = (t, lt, lines, o = {}) => { const t0 = lt + (o.t0 || 0); let s = R(0, 0, 576, 1024, '#241c30') + `<defs><radialGradient id="bg5" cx="0.5" cy="0.4" r="0.8"><stop offset="0" stop-color="#ffd98a" stop-opacity=".35"/><stop offset="1" stop-color="#0c0a1e" stop-opacity=".88"/></radialGradient></defs><rect width="576" height="1024" fill="url(#bg5)"/>`;
    const k = E.spring2(clamp(lt / 0.5)); s += `<g transform="translate(288,${f(420 + (1 - k) * 60)}) rotate(${f(o.rot === undefined ? -3 : o.rot)}) scale(${f(0.92 + 0.08 * k)})"><rect x="-230" y="-250" width="460" height="${o.h || 480}" rx="6" fill="#ffe98a" stroke="${NAVY}" stroke-width="4"/><rect x="-80" y="-268" width="160" height="34" fill="#f4efe0" opacity=".85" transform="rotate(-3)"/>`;
    lines.forEach((l, i) => { const on = clamp((t0 - l.at + 0.05) / 0.45); s += `<g opacity="${f(on)}">${T(-196, -170 + i * (l.gap || 78), l.txt, l.fs || 44, l.col || '#3a3a4a', 700, 'start', 'font-style="italic"')}</g>`; }); return s + '</g>'; };
  scr('S_n1', A('M11'), A('M12'), (t, lt) => K.pz(bilhete(t, lt, [{ txt: 'Obrigada pela', at: wA('M11', 0) }, { txt: 'torneira,', at: wA('M11', 2) }, { txt: 'seu Aníbal.', at: wA('M11', 3), col: '#2a2a6a' }, { txt: '— Dona Lúcia', at: wA('M11', 5), fs: 38 }, { txt: 'apto 31 ♥', at: wA('M11', 7), fs: 38, col: '#c33' }], { t0: A('M11') }), lt, B('M11') - A('M11'), 1.0, 1.08, 288, 420));
  // M12 — todas as caixas tinham bilhete
  scr('S_n2', A('M12'), A('M13'), (t, lt) => { const t0 = lt + A('M12'); let s = R(0, 0, 576, 1024, '#241c30') + `<rect width="576" height="1024" fill="#0c0a1e" opacity=".3"/>`;
    for (let i = 0; i < 7; i++) { const k = E.spring(clamp((t0 - wA('M12', 2) - i * 0.12) / 0.3)); s += `<g transform="translate(${f(96 + (i % 4) * 128)},${f(250 + Math.floor(i / 4) * 130)}) scale(${f(0.78 * k)})" opacity="${f(clamp(k * 2))}">${baú(150)}<g transform="translate(40,-62) rotate(${(i * 23) % 17 - 8}) scale(.5)">${note(120, 90, ['…'], { fs: 28 })}</g></g>`; }
    const lines = [['pelo chuveiro', 'apto 42', wA('M12', 10)], ['pela luz da escada', 'apto 53', wA('M12', 12)], ['pelo berço', 'apto 64', wA('M12', 16)]];
    lines.forEach(([a, b, at], i) => { const k = E.spring2(clamp((t0 - at + 0.1) / 0.4)); s += `<g transform="translate(288,${f(490 + i * 112 + (1 - k) * 40)}) rotate(${[-2, 2, -1][i]}) scale(${f(0.7 + 0.3 * k)})" opacity="${f(clamp(k * 2))}"><rect x="-230" y="-48" width="460" height="100" rx="6" fill="#ffe98a" stroke="${NAVY}" stroke-width="3.5"/>${T(-200, 8, a, 34, '#3a3a4a', 700, 'start', 'font-style="italic"')}${T(-200, 40, b, 22, '#6a5a3a', 700, 'start')}${T(206, 22, '♥', 36, '#c33', 800, 'end')}</g>`; });
    return K.pz(s, lt, B('M12') - A('M12'), 1.0, 1.05, 288, 500); });
  // M13 — pensativo no patamar
  const landing = (t, lt, o) => { let s = R(0, 0, 576, 1024, '#7d867f') + `<rect x="0" y="0" width="576" height="1024" fill="#1d2330" opacity=".25"/>`; for (let i = 0; i < 6; i++) s += `<path d="M${i * 110 - 20},0 L${i * 110 - 20},1024" stroke="#6e7870" stroke-width="3" opacity=".6"/>`;
    s += R(380, 150, 150, 300, '#fff6d8', 4, NAVY, 3) + T(455, 400, '5', 240, '#c33', 800) + R(0, 880, 576, 144, '#5e6860') + R(0, 870, 576, 16, '#c9d2c8');
    s += `<path d="M0,640 L576,640" stroke="#2a2f40" stroke-width="12"/>`; for (let i = 0; i < 5; i++) s += `<path d="M${40 + i * 120},640 L${40 + i * 120},880" stroke="#3a4054" stroke-width="7"/>`;
    s += drawChar({ cast: 'nando', x: 220, y: 880, s: 1.8, flip: 1, t, ph: 0.7, pose: Object.assign({}, POSE0, { hL: [18, -80], hR: [46, -80], lean: 2, headDown: o.down || 0 }), expr: o.expr(lt), look: o.look ? o.look(lt) : [380, 500], turn: o.turn === undefined ? 0.4 : o.turn, light: { ox: 1, oy: -0.8, rim: '#e8f4ff' }, propsFn: J => `<g transform="translate(${f((J.hL[0] + J.hR[0]) / 2 + 10)},${f(J.hL[1] + 4)})">${baú(86)}<g transform="translate(12,-60) rotate(-6)">${note(34, 28, [''], { fs: 8 })}</g></g>` }).svg;
    return s; };
  scr('S_n3', A('M13'), A('M14'), (t, lt) => K.pz(landing(t, lt, { expr: ex([{ t: 0, v: 'focus' }, { t: 1.4, v: 'sad', d: 0.6 }, { t: 3.0, v: 'worry', d: 0.5 }]), look: l => l < 1.5 ? [220, 700] : [520, 460], turn: 0.4, down: 4 }), lt, B('M13') - A('M13') + 0.6, 1.0, 1.1, 230, 640));

  // ============================================================ M14: pressão ============================================================
  const mmss = s_ => { s_ = Math.max(0, s_); return String(Math.floor(s_ / 60)).padStart(2, '0') + ':' + String(Math.floor(s_ % 60)).padStart(2, '0'); };
  climbShot('S_c6', A('M14'), A('M14') + 2.4, { trip: 6, floor0: 5, prog: l => 40 + l * 3.2, timer: l => mmss(250 - l), expr: l => EXPR.worry });
  scr('S_c6b', A('M14') + 2.4, A('M14') + 3.9, (t, lt) => K.pz(doorFront(t, lt, { sign: false, bell: 'none' }) + `<g transform="translate(288,92)" opacity="${f(0.8 + 0.2 * Math.sin(t * 8))}"><rect x="-100" y="-28" width="200" height="56" rx="28" fill="#3a1f26" stroke="#ff5a4a" stroke-width="4"/>${T(0, 13, mmss(238 - lt), 34, '#ff5a4a')}</g>`, lt, 1.5, 1.0, 1.1, 290, 470));
  scr('S_leg', A('M14') + 3.9, A('M15'), (t, lt) => { const base = R(0, 0, 576, 1024, '#6e7870') + R(0, 760, 576, 264, '#5e6860') + R(0, 750, 576, 16, '#c9d2c8');
    const tr = noise1(t * 55, 4) * (2 + lt * 3);
    const j1 = noise1(t * 50, 11) * (2 + lt * 3), j2 = noise1(t * 47, 12) * (2 + lt * 3); const ch = drawChar({ cast: 'nando', x: 288 + tr, y: 760, s: 2.4, flip: 1, t, ph: 0.7, idle: 0, pose: Object.assign({}, POSE0, { hipDrop: 6 + Math.abs(noise1(t * 40, 9)) * 5, fL: [-16 + j1, Math.max(0, j2)], fR: [16 + j2, Math.max(0, j1)], kd: 1, hL: [-18, -84], hR: [18, -84] }), expr: EXPR.worry, look: [288, 400], turn: 0, light: { ox: 1, oy: -0.8, rim: '#e8f4ff' } }).svg;
    return K.ptr(288, 660, 1.75, base + ch); });

  // M15–M17: a campainha, o fio, a fita, o cartaz
  scr('S_bell', A('M15'), A('M16'), (t, lt) => { const t0 = lt + A('M15'); const z = lerp(1.0, 1.9, E.io(clamp(lt / 2.0))), z2 = lerp(z, 1.9, 0), cam = lt < 2.0 ? [lerp(290, 486, E.io(clamp(lt / 2.0))), lerp(470, 500, E.io(clamp(lt / 2.0)))] : [486, 500];
    return K.ptr(cam[0], cam[1], z2, doorFront(t, lt, { sign: true, signInk: 0.5 })); });
  scr('S_sign', A('M16'), A('M17'), (t, lt) => { const t0 = lt + A('M16'), ink = 0.18 + 0.78 * clamp((t0 - wA('M16', 6)) / 3.0);
    return K.ptr(lerp(290, 290, 0), lerp(470, 420, E.io(clamp(lt / 3))), lerp(1.2, 1.9, E.io(clamp(lt / 4.3))), doorFront(t, lt, { signInk: ink, bell: 'broken' })); });
  const tools = (cx, cy, k, t) => { const a = [['🔧', -150, -40], ['💡', 160, -70], ['🚿', -170, 90], ['🛏', 175, 100]]; return ''; };
  scr('S_man', A('M17'), A('M17') + 3.4, (t, lt) => { const t0 = lt + A('M17');
    let s = doorFront(t, lt, { sign: true, signInk: 0.9, bell: 'broken' }) + `<rect width="576" height="1024" fill="#0c0a1e" opacity="0.35"/>`;
    const items = [['torneira', 40, 150], ['luz da escada', 60, 330], ['chuveiro', 20, 520], ['berço', 30, 700]];
    items.forEach(([n, x, y], i) => { const k = E.spring2(clamp((t0 - wA('M17', 3) - 0.05 - i * 0.28) / 0.35)); s += `<g transform="translate(${x + 4},${y}) scale(${f(0.6 + 0.4 * k)})" opacity="${f(k)}"><rect x="0" y="-26" width="190" height="52" rx="26" fill="#10142e" stroke="#3ddc84" stroke-width="3.5"/>${T(34, 8, '✔', 26, '#3ddc84', 800)}${T(60, 9, n, 21, '#fff', 800, 'start')}</g>`; });
    const kb = E.spring2(clamp((t0 - wA('M17', 8)) / 0.4)); s += `<g transform="translate(340,380) scale(${f(0.6 + 0.4 * kb)})" opacity="${f(kb)}"><rect x="0" y="-30" width="196" height="60" rx="30" fill="#10142e" stroke="#ff5a4a" stroke-width="3.5"/>${T(30, 10, '✘', 28, '#ff5a4a', 800)}${T(60, 10, 'campainha', 22, '#fff', 800, 'start')}</g>`;
    return K.pz(s, lt, 3.4, 1.0, 1.06, 288, 500); });
  scr('S_doors', A('M17') + 3.4, A('M18'), (t, lt) => K.pz(corridor(t, {}) + `<g opacity="${f(0.9)}">${[0, 1, 2, 3, 4, 5, 6, 7].map(i => { const side = i % 2 ? 1 : -1, d0 = 2.6 + Math.floor(i / 2) * 5.2, on = clamp((lt - i * 0.12) / 0.3); return `<circle cx="${f(cX(side * 1.3, d0 + 0.55))}" cy="${f(cY(d0, 1.55))}" r="${f(5.5 * csc(d0) * 2.2)}" fill="#ffe9a8" opacity="${f(on)}"/>`; }).join('')}</g>`, lt, A('M18') - (A('M17') + 3.4), 1.0, 1.1, 288, 440));

  // ============================================================ M18–M20: o conserto ============================================================
  const hcl = (t, lt, o) => { let s = R(0, 0, 576, 1024, '#1a1630') + `<defs><radialGradient id="hcg2" cx="0.5" cy="0.45" r="0.7"><stop offset="0" stop-color="#ffd98a" stop-opacity=".5"/><stop offset="1" stop-color="#0c0a1e" stop-opacity=".92"/></radialGradient></defs><rect width="576" height="1024" fill="url(#hcg2)"/>`;
    const pe = clamp((lt - o.peelAt) / 0.9);
    s += `<g transform="translate(268,640) scale(2.55)">${K.helmetProp({ tape: !o.peel, crack: true })}</g>`;
    if (o.peel) s += `<g transform="translate(${f(252 + 40 * E.io(pe))},${f(560 - 80 * E.io(pe))}) rotate(${f(-16 + 70 * E.io(pe))})"><rect x="-34" y="-142" width="68" height="${f(284 * (1 - 0.5 * E.io(pe)))}" rx="4" fill="#26262e" stroke="${NAVY}" stroke-width="4"/><path d="M-34,-60 L34,-52 M-34,10 L34,18" stroke="#4a4a56" stroke-width="3"/></g>`;
    s += K.armIn(640, 1010, 480 - 120 * E.io(clamp(lt / 0.7)), 600 - 20 * E.io(clamp(lt / 0.7)), 'pinch');
    return s; };
  scr('S_hel', A('M18'), A('M18') + 2.2, (t, lt) => K.pz(hcl(t, lt, { peel: lt > 0.8, peelAt: wA('M18', 4) - A('M18') + 0.0 }), lt, 2.2, 1.0, 1.1, 288, 580));
  scr('S_wire', A('M18') + 2.2, A('M19'), (t, lt) => { const t0 = lt + A('M18') + 2.2, w = clamp((t0 - wA('M18', 10)) / 0.7);
    let s = R(0, 0, 576, 1024, '#7d8a78') + R(0, 0, 576, 1024, '#10142e').replace('/>', ' opacity=".35"/>') + R(150, 120, 276, 820, '#9a9488', 10, NAVY, 4) + C(288, 300, 40, '#6a6a60', NAVY, 5);
    const jx = lerp(0, 0, 0); s += `<path d="M288,320 C292,420 280,470 262,560" stroke="#d9503f" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M262,560 L262,590" stroke="#d9503f" stroke-width="12" stroke-linecap="round"/><path d="M288,860 C292,780 300,700 318,640" stroke="#2a2a30" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M318,640 L318,610" stroke="#2a2a30" stroke-width="12" stroke-linecap="round"/>`;
    // fita enrolando
    for (let i = 0; i < Math.floor(8 * w); i++) s += `<path d="M${236 + i * 9},${566 + i * 1.5} l${44},${-8}" stroke="#26262e" stroke-width="16" stroke-linecap="round" opacity=".95" transform="rotate(${-6 + i * 1.2} 290 590)"/>`;
    s += K.armIn(-40, 900, 190 + 20 * w, 600, 'pinch') + `<g transform="scale(-1,1) translate(-576,0)">${K.armIn(-40, 1000, 190 + 40 * w, 620, 'pinch')}</g>`;
    return K.pz(s, lt, A('M19') - (A('M18') + 2.2), 1.0, 1.12, 288, 600); });
  scr('S_btn', A('M19'), 72.0, (t, lt) => { const press = E.io(clamp((lt - 0.5) / 0.35)); let s = doorFront(t, lt, { sign: true, signInk: 0.9, bell: 'taped' });
    s += K.armIn(-60, 1000, 520 - 24 * press, 500 + 14 * press, 'point') + '<rect width="576" height="1024" fill="#0c0a1e" opacity=".15"/>';
    return K.ptr(486, 500, 2.3, s); });
  scr('S_wait', 72.0, 73.0, (t, lt) => { let s = doorFront(t, lt, { sign: true, signInk: 0.9, bell: 'taped' }) + `<rect width="576" height="1024" fill="#0c0a1e" opacity="${f(0.15 + 0.15 * lt)}"/>`; return K.ptr(lerp(486, 400, E.io(clamp(lt))), 500, lerp(2.3, 1.5, E.io(clamp(lt))), s); });
  scr('S_dim', 73.0, A('M21'), (t, lt) => { const k1 = E.spring(clamp(lt / 0.25)), k2 = E.spring(clamp((lt - 0.45) / 0.25)), ring = lt % 0.5; let s = doorFront(t, lt, { sign: true, signInk: 0.9, bell: 'ring' }) + `<rect width="576" height="1024" fill="#fff6d0" opacity="${f(lt < 0.12 ? 0.6 * (1 - lt / 0.12) : lt > 0.45 && lt < 0.55 ? 0.4 * (1 - (lt - 0.45) / 0.1) : 0)}"/>`;
    for (let i = 0; i < 3; i++) { const r = 40 + ((lt * 260 + i * 90) % 300); s += `<circle cx="486" cy="456" r="${f(r)}" fill="none" stroke="#ffd24a" stroke-width="${f(8 - r / 50)}" opacity="${f(clamp(1 - r / 340) * 0.8)}"/>`; }
    s += `<g transform="translate(330,250) rotate(-10) scale(${f(0.6 + 0.6 * k1)})" opacity="${f(clamp(k1 * 2))}">${T(0, 0, 'DIM', 120, '#ffd24a', 800, 'middle', `stroke="${NAVY}" stroke-width="12" paint-order="stroke"`)}</g><g transform="translate(340,410) rotate(8) scale(${f(0.6 + 0.6 * k2)})" opacity="${f(clamp(k2 * 2))}">${T(0, 0, 'DOM', 120, '#ffd24a', 800, 'middle', `stroke="${NAVY}" stroke-width="12" paint-order="stroke"`)}</g>`;
    return K.ptr(lerp(400, 330, E.io(clamp(lt / 1.1))), 480, lerp(1.5, 1.25, E.io(clamp(lt / 1.1))), s); });

  // ============================================================ M21–M22: a multidão ============================================================
  scr('S_cut3', A('M21'), A('M21') + 2.4, (t, lt) => { const t0 = lt + A('M21');
    return K.pz(cutaway(t, lt, { extra: (tt, l, g) => { let s = ''; const cols = ['#d97b8a', '#5a9a6a', '#c98a3a', '#7a6fb8', '#4aa3b8', '#d9b04a'];
      for (let i = 0; i < 21; i++) { const fl = i % 8, ts = A('M21') + 0.15 + i * 0.08, u = clamp((t0 - ts) / 1.9), y0 = g.base - g.fh * (fl + 1) + g.fh - 6, y1 = g.base - g.fh * 8 + g.fh - 6; const k = E.io(u), py = lerp(y0, y1, k), px = lerp(g.x0 + 60 + (i % 3) * 14, g.x0 + g.w - 60 - (i % 4) * 22, E.io(clamp((u - 0.55) / 0.45)));
        s += `<g transform="translate(${f(px)},${f(py)})" opacity="${f(clamp(u * 6))}">${C(0, -34, 8, '#e0b090', NAVY, 2)}${R(-8, -26, 16, 22, cols[i % 6], 5, NAVY, 2)}<ellipse cx="9" cy="-14" rx="8" ry="3" fill="#f4efe0" stroke="${NAVY}" stroke-width="1.6"/></g>`; }
      s += `<g transform="translate(${g.x0 + g.w + 6},${g.base - g.fh * 4})" opacity="${f(clamp((t0 - wA('M21', 12)) / 0.3))}">${T(40, 0, '21', 120, '#ffd24a', 800, 'middle')}${T(40, 40, 'pessoas', 22, '#c9d2ff', 700, 'middle')}</g>`; return s; } }), lt, 2.4, 1.0, 1.05, 288, 500); });
  scr('S_crowd', A('M21') + 2.4, A('M22'), (t, lt) => K.pz(corridor(t, { warm: E.io(clamp(lt / 1.5)), open: i => E.io(clamp((t - (A('M21') + 2.4) - i * 0.15) / 0.5)) }) + crowd(t, A('M21') + 2.4, 14, { gap: 0.17, dur: 2.2, dNear: 1.4 }), lt, 2.7, 1.0, 1.1, 288, 520));
  scr('S_crowd2', A('M22'), A('M23'), (t, lt) => K.pz(corridor(t, { warm: 1, open: i => 1 }) + crowd(t, 0, 14, { gap: 0, dur: 0.01, dNear: 1.0 }), lt, A('M23') - A('M22'), 1.1, 1.3, 288, 560));
  const doorOpenShot = (t, lt, o) => { const open = E.io(clamp((lt - (o.at || 0)) / 0.9)); let s = R(0, 0, 576, 1024, '#7d8a78') + R(0, 900, 576, 124, '#6f6a58') + `<rect x="0" y="0" width="576" height="130" fill="#1d2330" opacity=".3"/>`;
    const dx = 150, dy = 120, dw = 280, dh = 770; s += R(dx - 16, dy - 16, dw + 32, dh + 16, '#5e4430', 4, NAVY, 4) + `<defs><linearGradient id="inl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe6a6"/><stop offset="1" stop-color="#d9a35d"/></linearGradient></defs>` + R(dx, dy, dw, dh, 'url(#inl)') + `<rect x="${dx}" y="${dy}" width="${dw}" height="${dh}" fill="#fff2b8" opacity="${f(0.25 * open)}"/>`;
    s += R(dx, dy + 520, dw, 250, '#8b5a3c', 0).replace('/>', ' opacity=".35"/>');
    // sala: abajur e quadros
    s += `<g opacity="${f(open)}"><circle cx="${dx + 60}" cy="${dy + 330}" r="${f(120 + 6 * Math.sin(t * 3))}" fill="#ffe9a8" opacity=".35"/>${R(dx + 40, dy + 150, 70, 90, '#c9a06a', 3, NAVY, 3)}${R(dx + 150, dy + 120, 90, 60, '#9fd4ff', 3, NAVY, 3)}</g>`;
    if (o.person) s += drawChar({ cast: 'aniba', x: dx + dw / 2 + 10, y: dy + dh + 20, s: o.ps || 1.9, flip: 1, t, ph: 0.9, pose: Object.assign({}, POSE0, { hL: [-40, -84], hR: [40, -84] }), expr: o.expr ? o.expr(lt) : EXPR.calm, look: [288, 700], turn: 0, light: { ox: -1, oy: -0.7, rim: '#fff0c8' } }).svg;
    const a = open * 100; s += `<g transform="translate(${dx + dw},${dy})"><polygon points="0,0 ${f(-dw * Math.cos(a * Math.PI / 180) * 0.9 - 6)},${f(-8 * open)} ${f(-dw * Math.cos(a * Math.PI / 180) * 0.9 - 6)},${f(dh + 8 * open)} 0,${dh}" fill="#8b5a3c" stroke="${NAVY}" stroke-width="4"/></g>`;
    // silhuetas dos vizinhos no primeiro plano, com pratos erguidos
    s += `<g opacity=".9">` + [[40, 1000, 1.5], [510, 1010, 1.6], [150, 1060, 1.3], [420, 1070, 1.4]].map(([x, y, k], i) => `<g transform="translate(${x},${y}) scale(${k})"><ellipse cx="0" cy="-110" rx="46" ry="52" fill="#0c0a1e"/><path d="M-70,0 Q-62,-70 0,-76 Q62,-70 70,0Z" fill="#0c0a1e"/>${i % 2 ? '' : `<ellipse cx="62" cy="-54" rx="34" ry="9" fill="#2a2a3a" stroke="#ffd98a" stroke-width="2"/>`}</g>`).join('') + `</g>`;
    return s; };
  scr('S_open', A('M23'), A('M23') + 1.1, (t, lt) => K.pz(doorOpenShot(t, lt, { at: 0.2, person: false }), lt, 1.1, 1.0, 1.05, 288, 500));
  scr('S_anib', A('M23') + 1.1, A('M24'), (t, lt) => K.pz(doorOpenShot(t, lt + 2, { at: 0, person: true, expr: ex([{ t: 0, v: 'calm' }, { t: 2.0, v: 'sad', d: 1.0 }]) }), lt, A('M24') - A('M23') - 1.1, 1.0, 1.3, 288, 640));
  scr('S_say', A('M24'), B('M24') + 0.5, (t, lt) => { const mo = K.mouth(t, ['M24']); const ex2 = Object.assign({}, EXPR.sad, { mc: 0.2, browA: 12, lid: 0.18 }, mo || {}); const tear = clamp((t - (B('M24') - 0.5)) / 1.2);
    let s = R(0, 0, 576, 1024, '#2a2236') + `<defs><radialGradient id="ag" cx="0.5" cy="0.35" r="0.8"><stop offset="0" stop-color="#ffe6a6" stop-opacity=".7"/><stop offset="1" stop-color="#2a2236" stop-opacity="0"/></radialGradient></defs><rect width="576" height="1024" fill="url(#ag)"/>`;
    s += R(100, 140, 376, 900, '#e0a860', 0).replace('/>', ' opacity=".18"/>') + `<g filter="url(#bl12)">${R(-40, 700, 700, 400, '#5e4430')}</g>`;
    s += drawChar({ cast: 'aniba', x: 288, y: 1040, s: 2.6, flip: 1, t, ph: 0.9, pose: Object.assign({}, POSE0, { hL: [-40, -84], hR: [40, -84] }), expr: ex2, look: [288, 560], turn: 0, light: { ox: -1, oy: -0.7, rim: '#fff0c8' } }).svg;
    s += `<g transform="translate(${f(288 + 66)},${f(430 + 120 * tear)})" opacity="${f(tear > 0 ? 1 - tear * 0.5 : 0)}"><path d="M0,-12 q10,14 0,24 q-10,-10 0,-24z" fill="#bfe3ff" stroke="#6aa0c8" stroke-width="2"/></g>`;
    return K.pz(s, lt, B('M24') + 0.5 - A('M24'), 1.0, 1.12, 288, 560); });
  scr('S_family', B('M24') + 0.5, A('M25'), (t, lt) => { let s = doorOpenShot(t, lt + 3, { at: 0, person: false });
    const who = [['lucia', 120, 960, 1.55, 0.4], ['aniba', 288, 960, 1.55, 0], ['nando', 456, 960, 1.55, -0.4]];
    s += who.map(([c, x, y, k, tn], i) => drawChar({ cast: c, x, y, s: k, flip: 1, t, ph: i, pose: Object.assign({}, POSE0, { hL: [-40, -84], hR: [40, -84] }), expr: c === 'aniba' ? EXPR.warm : EXPR.happy, look: [288, 600], turn: tn, light: { ox: -1, oy: -0.7, rim: '#fff0c8' } }).svg).join('');
    return K.pz(s, lt, A('M25') - B('M24') - 0.5, 1.0, 1.06, 288, 620); });

  // ============================================================ M25–M26: resultado e cartaz ============================================================
  scr('S_vib', A('M25'), A('M25') + 1.3, (t, lt) => { const vib = lt < 0.9 ? 5 * Math.exp(-lt * 1.5) : 0; let c = R(0, 0, 300, 600, '#10142e') + T(150, 70, 'ZAP', 18, '#9aa6e8', 700) + `<g transform="translate(0,${f((1 - E.spring2(clamp((lt - 0.1) / 0.4))) * 200)})">${R(14, 150, 272, 130, '#242b60', 18, '#4a55a8', 2)}${R(28, 164, 38, 38, '#ff5a4a', 10)}${T(47, 190, 'ZAP', 13, '#fff')}${T(80, 186, 'NOVAS AVALIAÇÕES', 16, '#fff', 800, 'start')}${T(28, 236, '21 avaliações', 22, '#ffd24a', 800, 'start')}${T(28, 264, 'do Edifício Aurora', 14, '#aab4ee', 600, 'start')}</g>`;
    return K.pz(UI.bokeh(t * 3) + UI.phone(288, 392, 1.16, c, { t, shake: vib }), lt, 1.3, 1.0, 1.06, 288, 400); });
  scr('S_stars', A('M25') + 1.3, A('M25') + 3.6, (t, lt) => { const t0 = lt + A('M25') + 1.3; let s = R(0, 0, 576, 1024, '#10142e') + UI.bokeh(t * 2).replace(/<rect[^>]*url\(#bkg\)[^>]*\/>/, '');
    for (let i = 0; i < 21; i++) { const k = E.spring(clamp((t0 - wA('M25', 6) - i * 0.06) / 0.25)); if (k <= 0) continue; s += `<g transform="translate(${f(100 + (i % 3) * 188)},${f(130 + Math.floor(i / 3) * 104)}) scale(${f(0.8 * k)})" opacity="${f(clamp(k * 2))}">${R(-100, -40, 200, 80, '#1b2142', 16, '#2c3466', 2)}${T(0, 14, '★★★★★', 34, '#ffd24a', 800)}</g>`; }
    return K.pz(s, lt, 2.3, 1.0, 1.06, 288, 500); });
  scr('S_rate3', A('M25') + 3.6, A('M26'), (t, lt) => { const t0 = lt + A('M25') + 3.6, k = E.io(clamp((t0 - wA('M25', 12)) / 1.3)), v = lerp(4.52, 4.9, k);
    return K.pz(UI.bokeh(t * 3) + UI.phone(288, 392, 1.18, rating(lt, v, { pulse: k < 1 }), { t }), lt, A('M26') - (A('M25') + 3.6), 1.0, 1.06, 288, 400); });
  scr('S_new', A('M26'), 103.2, (t, lt) => { const morning = E.io(clamp(lt / 1.4)); let s = doorFront(t, lt, { morning: true, sign: 'new', signAt: wA('M26', 4) - A('M26') - 0.2, bell: 'taped', signInk: 0.5 });
    return K.pz(s, lt, 3.6, 1.15, 1.0, 290, 470); });

  const SHS = SH.filter(s => s.draw || s.build).sort((a, b) => a.t0 - b.t0); SHS.forEach((s, i) => { s.t1 = i + 1 < SHS.length ? SHS[i + 1].t0 : 103.2; });
  G.STORYX = { SHOTS: SHS };
})(window);
