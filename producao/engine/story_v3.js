// story_v3.js — "Pedido Fantasma" (piloto S1–S4, 0–36 s). Cada plano nasce de uma FRASE da narração (PH[id]) e mostra
// literalmente o que ela diz. Tudo posto pela bíblia de escala (world.js): nada dimensionado "no olho".
(function (G) {
  const { track, clamp, lerp, E, f, noise1, rnd, NAVY } = G.L;
  const { drawChar, EXPR, POSE, POSE0 } = G.CH; const L4 = G.LOT4; const W = G.WORLD, S3 = G.SETS3, UI = G.UI3, { R, C, Pth } = G.SETS, { m } = W;
  const PH = window.PH, a = id => PH[id][0], b = id => PH[id][1];
  const SH = [];
  // poses novas
  POSE.rideIdle = Object.assign({}, POSE.ride, { lean: 3, headDown: 10, headTilt: 3 });
  POSE.rideGo = Object.assign({}, POSE.ride, { lean: 17, headDown: 4 });
  POSE.rideWind = Object.assign({}, POSE.ride, { lean: 24, headDown: 2 });
  POSE.rideCrouch = Object.assign({}, POSE.ride, { lean: 4, headDown: 12 });
  POSE.checkPhone = Object.assign({}, POSE.ride, { lean: 8, headDown: 14, headTilt: 4 });
  POSE.pocket = Object.assign({}, POSE.ride, { lean: 6, headDown: 8, hR: [20, -92], gR: 'grip' });
  const po = k => lt => track(k, lt, n => Object.assign({}, POSE0, POSE[n])), ex = k => lt => track(k, lt, n => EXPR[n]);
  const NIGHT = { ox: 1, oy: -0.8, rim: '#ffe9a8' };

  // ---------- cena de rua com moto + Nando ----------
  function phoneOnBar(bx, lt, scr) { // celular fixo no guidão (o MESMO objeto em todos os planos)
    return `<g transform="translate(${f(bx + 96)},${f(900 - 218)}) rotate(-8)"><rect x="-16" y="-34" width="32" height="62" rx="6" fill="#0b0d1c" stroke="${NAVY}" stroke-width="3"/><rect x="-12.5" y="-30" width="25" height="52" rx="4" fill="${scr || '#4a6bff'}"/><rect x="-12.5" y="-30" width="25" height="52" rx="4" fill="#9fb4ff" opacity=".25"/></g>`;
  }
  // moto + piloto (corpo de perfil próprio + cabeça do rig); lean vem da pose nomeada
  function bikeRider(bx, t, lt, o) {
    const pose = po(o.poses || [{ t: 0, v: 'rideIdle' }])(lt), ek = o.exprs || [{ t: 0, v: 'calm' }], lean = clamp((pose.lean - 3) / 21, 0, 1), moving = !!(o.speed || o.scrollFn);
    const bob = Math.sin(t * (moving ? 31 : 2.2)) * (moving ? 1.6 : 0.9), light = o.light || { ox: 1, oy: -0.8, rim: '#ffe9a8' };
    const rb = G.RIDER.riderBody({ lean, bob, crouch: pose.lean < 6 ? 1 : 0, light }), s = W.charScale(1.75);
    const hp = Object.assign({}, POSE0, { headDown: pose.headDown * 0.5, headTilt: pose.headTilt - 2 + lean * -4 });
    const head = drawChar({ cast: 'nando', bodyless: true, x: rb.head[0], y: rb.head[1] + 208 * s, s, flip: 1, t, ph: 0.7, pose: hp, expr: ex(ek)(lt), look: o.look ? (typeof o.look === 'function' ? o.look(lt) : o.look) : [bx + 700, 800], turn: o.turn === undefined ? 0.72 : o.turn, helmet: typeof o.helmet === 'function' ? o.helmet(lt) : (o.helmet === undefined ? 1 : o.helmet), light, idle: moving ? 0 : 1 }).svg;
    const phoneBar = `<g transform="translate(88,-216) rotate(-8)"><rect x="-17" y="-36" width="34" height="64" rx="6" fill="#0b0d1c" stroke="${NAVY}" stroke-width="3"/><rect x="-13.5" y="-32" width="27" height="54" rx="4" fill="${o.scr || '#4a6bff'}"/><rect x="-13.5" y="-32" width="27" height="54" rx="4" fill="#9fb4ff" opacity=".25"/></g>`;
    return { svg: `<g transform="translate(${f(bx)},900)">${rb.back}${W.moto(0, t, o.spin || 0, { beam: o.beam === undefined ? 0.5 : o.beam })}${phoneBar}${rb.front}${head}</g>`, head: [bx + rb.head[0], 900 + rb.head[1]] };
  }
  function ride(t, lt, o) {
    const scroll = (o.base || 0) + (o.scrollFn ? o.scrollFn(lt) : (o.speed || 0) * lt), bx = o.bx || 290;
    const far = S3.rua.far(scroll, t), mid = S3.rua.mid(scroll, t), near = S3.rua.near(scroll, t, { noCars: o.noCars !== undefined ? o.noCars : !(o.speed || o.scrollFn) });
    const sh = S3.shadowFrom(bx, 900, 420, S3.rua._lamps, 1), pitch = o.pitch ? o.pitch(lt) : 0;
    const br = bikeRider(bx, t, lt, Object.assign({ spin: scroll / 63, light: { ox: sh.ox, oy: -0.8, rim: '#ffe9a8' } }, o));
    let g = sh.svg + `<g transform="rotate(${f(pitch)} ${bx - 131} ${900 - 63})">${br.svg}</g>`;
    if (o.speed || o.scrollFn) for (let i = 0; i < 9; i++) { const y = 560 + (i * 83 % 420), len = 120 + (i * 37 % 200), x = ((i * 217 - scroll * 2.2) % 1100 + 1100) % 1100 - 250; g += `<rect x="${f(x)}" y="${y}" width="${len}" height="3" rx="1.5" fill="#fff" opacity="${f(0.08 + (i % 3) * 0.05)}"/>`; }
    if (o.faceGlow) g += `<defs><radialGradient id="fgl"><stop offset="0" stop-color="#8fb0ff" stop-opacity="${o.faceGlow}"/><stop offset="1" stop-color="#8fb0ff" stop-opacity="0"/></radialGradient></defs><circle cx="${f(br.head[0] + 40)}" cy="${f(br.head[1] + 10)}" r="95" fill="url(#fgl)"/>`;
    // primeiro plano: poste escuro que passa rápido (paralaxe 1,35)
    let fore = ''; if (o.speed || o.scrollFn) { for (let k = -1; k < 6; k++) { const x = k * 2600 - ((scroll * 1.35) % 2600) + 700; fore += `<rect x="${f(x)}" y="-400" width="26" height="2200" fill="#080a22" opacity=".92"/><rect x="${f(x - 12)}" y="760" width="50" height="14" fill="#080a22" opacity=".92"/>`; } }
    return { far, mid, near: near + g, fore };
  }
  // ---------- terreno (vista frontal) ----------
  function streetFront(t) {
    let s = R(-400, 806, 1400, 900, '#2e3250') + R(-400, 806, 1400, 12, '#9a9dc2', 0, NAVY, 3);
    for (let i = -1; i < 6; i++) s += R(i * 230 + 20, 968, 130, 11, '#d9d2b4', 5);
    s += `<ellipse cx="110" cy="830" rx="170" ry="22" fill="#ffe9a8" opacity=".16"/>`;
    return s;
  }
  function lotScene(t, lt, o) {
    const far = `<g transform="translate(-167,-297)">${S3.rua.far(0, t).replace(/^<g transform="translate\(-167,-297\)">/, '').replace(/<\/g>$/, '')}</g>`;
    let near = L4.lotFront(t, { glowA: o.glowA, cida: o.cida, cidaDim: o.cidaDim, cidaExpr: o.cidaExpr }) + streetFront(t);
    return { far: S3.rua.far(0, t), mid: '', near, fore: '' };
  }
  function lotBike(t, lt, o) {
    const bx = o.bx || 120, br = bikeRider(bx, t, lt, Object.assign({ scr: '#4a6bff', light: { ox: 1, oy: -0.7, rim: '#ffe0a0' } }, o));
    return `<ellipse cx="${bx}" cy="906" rx="250" ry="14" fill="${NAVY}" opacity=".35"/>${br.svg}`;
  }


  // plano fechado da dona Cida, sentada à mesa, diante da PAREDE-FANTASMA (a cozinha de azulejo da casa que existiu), desfocada
  function cidaClose(t, lt, o) {
    const blur = n => `<g filter="url(#bl${n})">`;
    let s = `<defs><linearGradient id="cwg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a2236"/><stop offset="1" stop-color="#0f0e20"/></linearGradient><radialGradient id="cgl" cx="0.58" cy="0.06" r="0.85"><stop offset="0" stop-color="#ffe6a6" stop-opacity=".85"/><stop offset="0.45" stop-color="#ffc468" stop-opacity=".32"/><stop offset="1" stop-color="#ffb04a" stop-opacity="0"/></radialGradient></defs><rect width="576" height="1024" fill="url(#cwg)"/>`;
    s += blur(12) + R(-40, -40, 330, 760, '#cdb468') + R(280, -40, 340, 760, '#c9d4da') + R(-40, -40, 700, 150, '#c98aa0');
    for (let i = 0; i < 14; i++) s += `<line x1="${280 + i * 28}" y1="110" x2="${280 + i * 28}" y2="720" stroke="#8fa0aa" stroke-width="4"/>`;
    for (let j = 0; j < 12; j++) s += `<line x1="280" y1="${110 + j * 52}" x2="620" y2="${110 + j * 52}" stroke="#8fa0aa" stroke-width="4"/>`;
    s += R(60, 190, 120, 380, '#463a52', 0) + '</g>';
    s += `<rect width="576" height="1024" fill="#0c0a1e" opacity=".52"/><rect width="576" height="1024" fill="url(#cgl)"/>`;
    s += `<circle cx="336" cy="50" r="22" fill="#fff6cf" stroke="${NAVY}" stroke-width="3"/><circle cx="336" cy="50" r="46" fill="#fff0b8" opacity=".35"/><line x1="336" y1="-10" x2="336" y2="30" stroke="#222" stroke-width="3"/>`;
    // mato desfocado nas bordas (primeiro plano)
    s += blur(6); for (let i = 0; i < 14; i++) { const x = i < 7 ? -10 + i * 18 : 500 + (i - 7) * 18, h = 260 + (i % 4) * 60; s += `<path d="M${x},760 Q${x + 12 + Math.sin(t + i) * 6},${760 - h * 0.6} ${x + 22 + Math.sin(t * 1.3 + i) * 8},${760 - h} Q${x + 30},${760 - h * 0.5} ${x + 36},760Z" fill="#0d1c1a"/>`; } s += '</g>';
    // ela
    const watching = o.mode === 'watch', talk = o.mode === 'speak', sp = G.PH ? G.PH : PH;
    const tq = t - PH.Q[0], speaking = talk && tq > -0.02 && tq < PH.Q[1] - PH.Q[0] + 0.05;
    const raise = watching ? E.spring2(clamp(lt / 0.5)) * (1 - E.io(clamp((lt - 1.7) / 0.35))) : 0;
    const look = watching ? [288 - 30, 470 + (1 - raise) * 40] : (lt < 0.25 ? [288 - 40, 520] : [288, 345]);
    const up = !watching ? E.io(clamp((lt - 0.1) / 0.5)) : 0;
    const ex = Object.assign({}, EXPR.calm, { browY: -2 - up * 4, browA: 3 + up * 3, mc: 0.12, blush: 0.4, lid: watching ? 0.2 : 0.1 });
    if (speaking) { const a = 0.25 + 0.5 * Math.abs(Math.sin((t - PH.Q[0]) * 13)); ex.mo = a; ex.mw = 11 + a * 4; ex.mc = 0.3; }
    const pose = Object.assign({}, POSE0, POSE.sit, { hipDrop: 40, hL: [lerp(-30, 8, raise), lerp(-60, -84, raise)], hR: [lerp(30, 24, raise * 0.5), -58], lean: watching ? raise * 2 : 0, headTilt: watching ? -3 * raise : 1, headDown: watching ? raise * 9 : 0, gL: raise > 0.3 ? 'mitt' : 'mitt' });
    const wrist = J => `<g transform="translate(${f(J.hL[0] + 4)},${f(J.hL[1] + 8)}) rotate(${f(J.angL)})"><rect x="-8" y="-6" width="18" height="12" rx="2" fill="#6b4a2f" stroke="${NAVY}" stroke-width="2"/><circle cx="12" cy="0" r="9" fill="#e8c36a" stroke="${NAVY}" stroke-width="2.6"/><circle cx="12" cy="0" r="6" fill="#fffbe8"/><path d="M12,0 L12,-4.5 M12,0 L15,1.5" stroke="${NAVY}" stroke-width="1.6" stroke-linecap="round"/></g>`;
    s += drawChar({ cast: 'cida', x: 288, y: 740, s: 1.9, flip: 1, t, ph: 2.2, pose, expr: ex, look, turn: 0.0, light: { ox: -1, oy: -0.7, rim: '#ffe0a0' }, propsFn: J => wrist(J) }).svg;
    // mesa na frente: tampo, dois pratos, caixa de pizza com o rótulo do pedido, vela e a bolsa no colo
    s += `<defs><linearGradient id="tw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b98a58"/><stop offset="1" stop-color="#7a5636"/></linearGradient></defs>` + `<path d="M-20,628 L596,628 L620,1030 L-44,1030Z" fill="url(#tw)" stroke="${NAVY}" stroke-width="4"/><path d="M-20,628 L596,628" stroke="#e0b985" stroke-width="6"/><path d="M-20,634 L596,634 L598,648 L-20,648Z" fill="#d9ad78" opacity=".5"/>`;
    s += `<ellipse cx="120" cy="742" rx="92" ry="26" fill="#f4efe0" stroke="${NAVY}" stroke-width="3.5"/><ellipse cx="120" cy="740" rx="62" ry="16" fill="#fff" stroke="#c9c4b4" stroke-width="2"/>` + `<ellipse cx="456" cy="742" rx="92" ry="26" fill="#f4efe0" stroke="${NAVY}" stroke-width="3.5"/><ellipse cx="456" cy="740" rx="62" ry="16" fill="#fff" stroke="#c9c4b4" stroke-width="2"/>`;
    s += `<g transform="translate(288,740)"><path d="M-92,0 L92,0 L104,64 L-104,64Z" fill="#b8793f" stroke="${NAVY}" stroke-width="3.5"/><path d="M-92,0 L92,0 L82,-22 L-82,-22Z" fill="#d9a35d" stroke="${NAVY}" stroke-width="3.5"/><text x="0" y="34" font-family="Inter" font-weight="800" font-size="20" fill="#fff3d6" text-anchor="middle">FORNO VIVO</text><text x="0" y="54" font-family="Inter" font-weight="700" font-size="14" fill="#ffe1a8" text-anchor="middle">sem cebola</text></g>`;
    const fl = 0.8 + 0.2 * Math.sin(t * 17) + noise1(t * 9, 4) * 0.12;
    s += `<g transform="translate(212,676)"><rect x="-6" y="0" width="12" height="40" fill="#f4efe0" stroke="${NAVY}" stroke-width="2.6"/><path d="M0,-4 Q${f(7 * fl)},-20 0,-34 Q${f(-7 * fl)},-20 0,-4Z" fill="#ffcf55" stroke="${NAVY}" stroke-width="2"/><circle cx="0" cy="-18" r="${f(34 * fl)}" fill="#ffd27a" opacity=".22"/></g>`;
    return s;
  }

  // =========================================================== PLANOS ===========================================================
  // A (0,12–3,34) "Onze e quarenta e sete da noite. Chegou um pedido."
  SH.push({ id: 'P1', t0: 0, t1: 1.35, kind: 'screen', draw: (t, lt) => UI.bokeh(t) + UI.phone(288, 392, 1.14, UI.lock(lt, { notifAt: 9 }), { t, shake: 0 }) + `<text x="288" y="135" font-family="Inter" font-weight="800" font-size="30" fill="#9fb4ff" text-anchor="middle" opacity=".0">23:47</text>` });
  SH.push({ id: 'P2', t0: 1.35, t1: 2.55, kind: 'screen', draw: (t, lt) => { const lt2 = lt + 1.35, buzz = lt2 > 1.38 && lt2 < 2.4 ? 5 * Math.exp(-(lt2 - 1.38) * 1.6) : 0; return UI.bokeh(t) + UI.phone(288, 392, 1.14, UI.lock(lt2, { notifAt: 1.38 }), { t, shake: buzz }); } });
  SH.push({ id: 'P2b', dof: { far: 8, mid: 6 }, t0: 2.55, t1: 3.45, kind: 'scene', cam: [[0, 352, 640, 1.5], [0.9, 352, 636, 1.62, 'io']],
    build: (t, lt) => ride(t, lt, { speed: 0, base: 700, helmet: 0, turn: 0.45, poses: [{ t: 0, v: 'rideIdle' }, { t: 0.25, v: 'checkPhone', d: 0.35, e: 'spring2' }], exprs: [{ t: 0, v: 'calm' }, { t: 0.35, v: 'curious', d: 0.2 }], look: lt => lt < 0.3 ? [700, 820] : [394, 690], faceGlow: 0.55 }) });
  // B (3,59–5,75) "Rua das Acácias, número catorze."
  SH.push({ id: 'P3', t0: 3.45, t1: 4.9, kind: 'screen', draw: (t, lt) => UI.bokeh(t) + UI.phone(288, 392, lerp(1.14, 1.22, E.io(clamp(lt / 1.45))), UI.order(lt, { hl: lt > 0.3 }), { t, shake: 0 }) });
  SH.push({ id: 'P3b', dof: { far: 8, mid: 6 }, t0: 4.9, t1: 5.85, kind: 'scene', cam: [[0, 352, 640, 1.55], [0.95, 352, 636, 1.7, 'io']],
    build: (t, lt) => ride(t, lt, { speed: 0, base: 700, helmet: 0, turn: 0.45, poses: [{ t: 0, v: 'checkPhone' }], exprs: [{ t: 0, v: 'focus' }, { t: 0.4, v: 'curious', d: 0.25 }], look: [394, 690], faceGlow: 0.55 }) });
  // C (6,04–8,99) "Só que a casa catorze foi demolida há trinta anos."
  SH.push({ id: 'P4', t0: 5.85, t1: 7.5, kind: 'screen', draw: (t, lt) => UI.bokeh(t) + UI.phone(288, 392, 1.14, UI.map(lt, { zoom: lerp(1, 1.6, E.io(clamp(lt / 1.6))) }), { t }) });
  SH.push({ id: 'P5', dof: { far: 8, mid: 6 }, t0: 7.5, t1: 9.25, kind: 'scene', cam: [[0, 352, 640, 1.6], [1.75, 348, 626, 2.0, 'io']], shake: [[0.45, 2.2, 0.3]],
    build: (t, lt) => ride(t, lt, { speed: 0, base: 400, helmet: 0, turn: 0.45, poses: [{ t: 0, v: 'checkPhone' }, { t: 1.0, v: 'rideIdle', d: 0.5, e: 'spring2' }], exprs: [{ t: 0, v: 'curious' }, { t: 0.45, v: 'realize', d: 0.12, e: 'spring' }, { t: 0.85, v: 'shock', d: 0.1 }, { t: 1.25, v: 'worry', d: 0.25 }], look: lt => lt < 1.0 ? [394, 690] : [560, 820], faceGlow: 0.5, bx: 290 }) });
  // D (9,39–11,55) "O aplicativo deu onze minutos."
  SH.push({ id: 'P6', t0: 9.25, t1: 11.2, kind: 'screen', draw: (t, lt) => UI.bokeh(t) + UI.phone(288, 392, lerp(1.14, 1.22, E.io(clamp(lt / 1.95))), UI.timer(lt, { start: 660 }), { t }) });
  // E (11,75–13,94) "Cancelar custava a minha semana inteira."
  SH.push({ id: 'P7', t0: 11.2, t1: 13.2, kind: 'screen', draw: (t, lt) => { const th = E.io(clamp((lt - 0.2) / 0.9)), tr = lt > 1.1 ? Math.sin(lt * 13) * 3 : 0; return UI.bokeh(t) + UI.phone(288, 392, lerp(1.16, 1.22, E.io(clamp(lt / 2.0))), UI.cancel(lt), { t }) + `<g transform="translate(${f(lerp(520, 394, th) + tr)},${f(lerp(900, 640, th) + tr * 0.6)}) rotate(${-24 + tr})"><ellipse rx="44" ry="26" fill="#8a5a3d" stroke="${NAVY}" stroke-width="4"/><path d="M-30,-8 q22,-10 52,-4" stroke="#6d4129" stroke-width="3" fill="none" stroke-linecap="round"/></g>`; } });
  SH.push({ id: 'P7b', dof: { far: 8, mid: 6 }, t0: 13.2, t1: 14.05, kind: 'scene', cam: [[0, 352, 640, 1.6], [0.85, 352, 636, 1.75, 'io']],
    build: (t, lt) => ride(t, lt, { speed: 0, base: 700, helmet: 0, turn: 0.45, poses: [{ t: 0, v: 'checkPhone' }], exprs: [{ t: 0, v: 'worry' }, { t: 0.4, v: 'sad', d: 0.25 }], look: [394, 690], faceGlow: 0.5 }) });
  // F (14,24–16,29) "E o aluguel vencia na sexta."
  SH.push({ id: 'P8', t0: 14.05, t1: 15.7, kind: 'screen', draw: (t, lt) => UI.bokeh(t) + UI.paper(288, 360, 1.0 + lt * 0.03, lt) + `<g transform="translate(${f(120 + lt * 8)},740)"><ellipse rx="70" ry="44" fill="#8a5a3d" stroke="${NAVY}" stroke-width="4"/><path d="M-40,-14 q38,-20 86,-6" stroke="#6d4129" stroke-width="3" fill="none" stroke-linecap="round"/></g>` });
  SH.push({ id: 'P8b', dof: { far: 8, mid: 6 }, t0: 15.7, t1: 16.75, kind: 'scene', cam: [[0, 352, 640, 1.7], [1.05, 350, 630, 2.0, 'io']],
    build: (t, lt) => ride(t, lt, { speed: 0, base: 400, helmet: 0, turn: 0.5, poses: [{ t: 0, v: 'rideIdle' }], exprs: [{ t: 0, v: 'worry' }, { t: 0.4, v: 'focus', d: 0.3 }, { t: 0.8, v: 'resigned', d: 0.2 }], look: [700, 800] }) });
  // G (16,69–17,57) "Eu fui."  -> viseira desce, o punho gira, a moto arranca
  SH.push({ id: 'P9', dof: { far: 6, mid: 4 }, t0: 16.75, t1: 18.0, kind: 'scene', whipIn: false, noCarsX: 1, cam: [[0, 330, 640, 1.9], [0.45, 350, 650, 1.6, 'io'], [1.25, 420, 660, 1.0, 'io']], shake: [[0.62, 3.2, 0.4]],
    build: (t, lt) => ride(t, lt, { noCars: true, helmet: lt => lt < 0.3 ? 1 : 2, scrollFn: lt => 400 + (lt > 0.55 ? 0.5 * 5200 * Math.pow(lt - 0.55, 2) : 0), pitch: lt => lt > 0.55 && lt < 1.2 ? -7 * Math.sin(Math.min(1, (lt - 0.55) / 0.65) * Math.PI) : 0, poses: [{ t: 0, v: 'rideIdle' }, { t: 0.3, v: 'rideCrouch', d: 0.2 }, { t: 0.55, v: 'rideWind', d: 0.18, e: 'anticip' }], exprs: [{ t: 0, v: 'resigned' }, { t: 0.3, v: 'focus', d: 0.2 }], beam: 0.75, bx: 290 }) });
  // H (17,87–20,47) "No caminho, abri o histórico daquele endereço."
  SH.push({ id: 'P10', t0: 18.0, t1: 18.95, kind: 'scene', cam: [[0, 288, 512, 0.62], [0.95, 292, 530, 0.74, 'io']],
    build: (t, lt) => ride(t, lt, { base: 2200, scrollFn: lt => 2200 + 2100 * lt, helmet: 2, poses: [{ t: 0, v: 'rideWind' }, { t: 0.5, v: 'rideGo', d: 0.5 }], beam: 0.7, bx: 270 }) });
  SH.push({ id: 'P11', t0: 18.95, t1: 20.65, kind: 'screen', draw: (t, lt) => UI.bokeh(t * 4) + UI.phone(288, 392, 1.15, UI.history(lt, { t0: 99 }), { t, shake: 1.4 }) });
  // I (20,77–22,97) "Onze pedidos, todos cancelados."  (as linhas aparecem uma a uma, em sincronia com a contagem)
  SH.push({ id: 'P12', t0: 20.65, t1: 23.1, kind: 'screen', draw: (t, lt) => { const sc = clamp((lt - 1.0) / 1.4) * 330; return UI.bokeh(t * 4) + UI.phone(288, 392, 1.15, UI.history(lt, { t0: 0.1, dt: 0.19, n11: 1, scroll: sc }), { t, shake: 1.0 }); } });
  // J (23,17–25,98) "Mesmo endereço, mesmo dia, uma vez por ano."
  SH.push({ id: 'P13', t0: 23.1, t1: 24.9, kind: 'screen', draw: (t, lt) => { const z = lerp(1.4, 1.9, E.io(clamp(lt / 1.8))); return UI.bokeh(t * 4) + UI.phone(288, lerp(392, 470, E.io(clamp(lt / 1.8))), z * 0.82, UI.history(lt + 3, { t0: 0, dt: 0.01, n11: 1, scroll: 330 - clamp(lt / 1.8) * 330 }), { t, shake: 0.8 }); } });
  SH.push({ id: 'P14', dof: { far: 6, mid: 4 }, t0: 24.9, t1: 26.2, kind: 'scene', cam: [[0, 380, 640, 1.45], [1.3, 372, 632, 1.7, 'io']],
    build: (t, lt) => ride(t, lt, { noCars: true, scrollFn: lt => 9000 + 2300 * lt, helmet: 1, poses: [{ t: 0, v: 'rideGo' }, { t: 0.7, v: 'checkPhone', d: 0.4 }], exprs: [{ t: 0, v: 'focus' }, { t: 0.8, v: 'worry', d: 0.3 }], beam: 0.7, faceGlow: 0.45, look: lt => lt < 0.7 ? [900, 800] : [394, 690], turn: 0.5 }) });
  // K (26,28–28,00) "E hoje era doze de outubro."
  SH.push({ id: 'P15', t0: 26.2, t1: 28.3, kind: 'screen', draw: (t, lt) => { const k = E.spring2(clamp(lt / 0.5)); return UI.bokeh(t * 3) + UI.phone(288, 392, 1.14, UI.lock(5, { notifAt: 99 }), { t }) + `<g transform="translate(288,${f(660 - (1 - k) * 30)}) scale(${f(0.6 + 0.4 * k)})" opacity="${f(k)}"><rect x="-216" y="-44" width="432" height="86" rx="43" fill="#ffd24a" stroke="${NAVY}" stroke-width="5"/><text x="0" y="16" font-family="Inter" font-weight="800" font-size="40" fill="#1d2747" text-anchor="middle">HOJE · 12 OUT</text></g>`; } });
  // L (28,45–30,49) "Cheguei com sete minutos de sobra."
  SH.push({ id: 'P16', t0: 28.3, t1: 30.6, kind: 'scene', cam: [[0, 288, 512, 0.7], [2.3, 330, 540, 0.95, 'io']], shake: [[1.3, 1.6, 0.3]],
    build: (t, lt) => { const v = Math.max(0, 1 - E.io(clamp((lt - 0.2) / 1.1))); const scr = 11000 + 2300 * (0.2 * 0 + (lt < 0.2 ? lt : 0.2) + 0.55 * 1.1 * (1) * (1 - Math.pow(1 - clamp((lt - 0.2) / 1.1), 2))); const r = ride(t, lt, { scrollFn: () => scr, helmet: 1, pitch: lt => lt > 0.9 && lt < 1.5 ? 4 * Math.sin(clamp((lt - 0.9) / 0.6) * Math.PI) : 0, poses: [{ t: 0, v: 'rideGo' }, { t: 1.0, v: 'rideCrouch', d: 0.3 }, { t: 1.5, v: 'rideIdle', d: 0.4, e: 'spring2' }], exprs: [{ t: 0, v: 'focus' }, { t: 1.4, v: 'resigned', d: 0.4 }], beam: 0.6, bx: 290 });
      const sec = Math.max(7 * 60, 660 - (lt + 19.0 + 9.25 - 9.25) * 0), tm = 7 * 60 + (2.3 - lt); const mm = '07', ss = String(Math.max(0, Math.floor(tm % 60))).padStart(2, '0');
      r.near += `<g transform="translate(330,${f(405)})" opacity="${f(clamp((lt - 1.1) / 0.3))}"><rect x="-120" y="-34" width="240" height="68" rx="34" fill="#10142e" stroke="#ffd24a" stroke-width="5"/><text x="0" y="14" font-family="Inter" font-weight="800" font-size="40" fill="#ffd24a" text-anchor="middle">${mm}:${ss}</text></g>`; return r; } });
  // M (30,71–33,18) "Era só mato alto e um portão sem casa."
  SH.push({ id: 'P17', t0: 30.6, t1: 32.3, kind: 'scene', cam: [[0, 288, 560, 0.92], [1.7, 288, 540, 1.02, 'io']],
    build: (t, lt) => { const L = lotScene(t, lt, { glowA: 0.0 }); L.near += lotBike(t, lt, { bx: 440, poses: [{ t: 0, v: 'rideIdle' }], exprs: [{ t: 0, v: 'worry' }], helmet: 1, turn: -0.35, look: [140, 640] }); return L; } });
  SH.push({ id: 'P17b', t0: 32.3, t1: 33.5, kind: 'scene', cam: [[0, 110, 560, 2.1], [1.2, 100, 430, 1.9, 'io']], build: (t, lt) => lotScene(t, lt, { glowA: 0.0 }) });
  // N (33,53–35,70) "E lá no fundo, uma luz acesa."  -> a lâmpada PISCA e acende (estalo + zumbido), a câmera empurra para a luz
  const flick = lt => lt < 0.7 ? 0 : lt < 0.8 ? 1 : lt < 0.9 ? 0.08 : lt < 1.05 ? 1 : lt < 1.12 ? 0.2 : 1;
  SH.push({ id: 'P18', t0: 33.5, t1: 36.2, kind: 'scene', cam: [[0, 288, 560, 0.95], [2.7, 296, 556, 2.2, 'io']],
    build: (t, lt) => { const L = lotScene(t, lt, { glowA: flick(lt) }); if (lt < 0.9) L.near += lotBike(t, lt, { bx: 440, poses: [{ t: 0, v: 'rideIdle' }], exprs: [{ t: 0, v: 'worry' }, { t: 0.5, v: 'curious', d: 0.2 }], helmet: 1, turn: -0.35, look: [300, 600] }); return L; } });
  // O (36,25–38,10) "Uma mesa posta pra dois."  -> a mesa, dois pratos, a caixa de pizza e uma vela; uma figura na sombra
  SH.push({ id: 'P19', t0: 36.2, t1: 38.4, kind: 'scene', cam: [[0, 292, 558, 3.4], [2.2, 304, 556, 3.0, 'io']],
    build: (t, lt) => lotScene(t, lt, { glowA: 1, cida: true, cidaDim: 0.62 }) });
  // P (38,45–40,49) "E uma senhora, olhando o relógio."  -> a dona Cida, de perto, confere o relógio de pulso
  SH.push({ id: 'P20', t0: 38.4, t1: 40.5, kind: 'screen', draw: (t, lt) => cidaClose(t, lt, { mode: 'watch' }) });
  // reação do Nando
  SH.push({ id: 'P21', t0: 40.5, t1: 41.12, dof: { far: 8, mid: 6 }, kind: 'scene', cam: [[0, 352, 640, 1.75], [0.62, 352, 632, 1.95, 'io']], shake: [[0.0, 2.4, 0.3]],
    build: (t, lt) => ride(t, lt, { speed: 0, base: 700, helmet: 1, turn: 0.4, poses: [{ t: 0, v: 'rideIdle' }], exprs: [{ t: 0, v: 'shock' }], look: [700, 700] }) });
  // Q (41,14–42,18) "Você demorou."  (fala da dona Cida; a boca só se mexe aqui)
  SH.push({ id: 'P22', t0: 41.12, t1: 43.4, kind: 'screen', draw: (t, lt) => cidaClose(t, lt, { mode: 'speak' }) });
  SH.push({ id: 'END', t0: 43.4, t1: 44.0, kind: 'screen', draw: () => `<rect width="576" height="1024" fill="#05060f"/>` });

  G.STORY3 = { SHOTS: SH };
})(window);
