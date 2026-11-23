// story_v3.js — "Pedido Fantasma" (piloto S1–S4, 0–36 s). Cada plano nasce de uma FRASE da narração (PH[id]) e mostra
// literalmente o que ela diz. Tudo posto pela bíblia de escala (world.js): nada dimensionado "no olho".
(function (G) {
  const { track, clamp, lerp, E, f, noise1, rnd, NAVY } = G.L;
  const { drawChar, EXPR, POSE, POSE0 } = G.CH; const W = G.WORLD, S3 = G.SETS3, UI = G.UI3, { R, C, Pth } = G.SETS, { m } = W;
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
  function ride(t, lt, o) {
    const scroll = (o.base || 0) + (o.scrollFn ? o.scrollFn(lt) : (o.speed || 0) * lt), bx = o.bx || 290;
    const far = S3.rua.far(scroll, t), mid = S3.rua.mid(scroll, t), near = S3.rua.near(scroll, t, { parked: o.parked });
    const sh = S3.shadowFrom(bx, 900, 420, S3.rua._lamps, 1), pitch = o.pitch ? o.pitch(lt) : 0, spin = scroll / 63;
    const pk = o.poses || [{ t: 0, v: 'rideIdle' }], ek = o.exprs || [{ t: 0, v: 'calm' }];
    const rider = drawChar({ cast: 'nando', x: bx + 20, y: 900 - 95, s: W.charScale(1.75), flip: 1, t, ph: 0.7, pose: po(pk)(lt), lag: po(pk)(Math.max(0, lt - 0.12)), expr: ex(ek)(lt), look: o.look ? (typeof o.look === 'function' ? o.look(lt) : o.look) : [bx + 700, 820], turn: o.turn === undefined ? 0.75 : o.turn, helmet: typeof o.helmet === 'function' ? o.helmet(lt) : (o.helmet === undefined ? 1 : o.helmet), light: { ox: sh.ox, oy: -0.8, rim: '#ffe9a8' }, idle: o.speed ? 0 : 1 }).svg;
    let g = sh.svg + `<g transform="rotate(${f(pitch)} ${bx - 131} ${900 - 63})"><g transform="translate(${f(bx)},900)">${W.moto(0, t, spin, { beam: o.beam === undefined ? 0.5 : o.beam })}</g>${phoneOnBar(bx, lt, o.scr)}${rider}</g>`;
    if (o.speed || o.scrollFn) for (let i = 0; i < 9; i++) { const y = 560 + (i * 83 % 420), len = 120 + (i * 37 % 200), x = ((i * 217 - scroll * 2.2) % 1100 + 1100) % 1100 - 250; g += `<rect x="${f(x)}" y="${y}" width="${len}" height="3" rx="1.5" fill="#fff" opacity="${f(0.08 + (i % 3) * 0.05)}"/>`; }
    // luz do celular no rosto do Nando (azulada) quando ele olha para a tela
    if (o.faceGlow) g += `<defs><radialGradient id="fgl"><stop offset="0" stop-color="#8fb0ff" stop-opacity="${o.faceGlow}"/><stop offset="1" stop-color="#8fb0ff" stop-opacity="0"/></radialGradient></defs><circle cx="${f(bx + 78)}" cy="${f(900 - 345)}" r="90" fill="url(#fgl)"/>`;
    return { far, mid, near: near + g };
  }
  // ---------- terreno (o gap entre prédios) ----------
  function lotScene(t, lt, o) {
    const sway = x => Math.sin(t * 1.6 + x * 0.05) * 5 + noise1(t * 1.1 + x * 0.02, 7) * 4;
    const far = S3.rua.far(0, t);
    // mid: prédio à esquerda, prédio à direita, e o terreno entre eles (mato + fundo escuro + a luz acesa lá no fundo)
    let mid = `<g transform="translate(-63.4,-112.6)">`;
    mid += `<g transform="translate(0,845) scale(0.82)">${W.building(-520, 9, 3, '#46407e', { seed: 1, dark: 0.5 })}${W.building(1560, 9, 3, '#35625e', { seed: 5, dark: 0.52 })}</g>`;
    // restos da casa demolida: laje de concreto, degraus que não levam a lugar nenhum e uma porta solta em pé (escala: 2,1 m)
    const ds0 = 0.78, gy = 846;
    mid += `<g transform="translate(0,${gy}) scale(${ds0})">` + R(m(0.2), -14, m(5.2), 14, '#6a6f90', 0, NAVY, 3.5) + R(m(0.2) + m(0.35), -34, m(0.9), 20, '#5d6282', 0, NAVY, 3) + R(m(0.2) + m(0.2), -22, m(0.5), 8, '#6a6f90', 0, NAVY, 3) +
      `<g transform="translate(${m(1.9)},-14)">${R(-m(0.5), -m(2.1), 10, m(2.1), '#7a5a3a', 1, NAVY, 3.5)}${R(m(0.4), -m(2.1), 10, m(2.1), '#7a5a3a', 1, NAVY, 3.5)}${R(-m(0.5), -m(2.1), m(0.95), 10, '#7a5a3a', 1, NAVY, 3.5)}<rect x="${-m(0.45) + 8}" y="${-m(2.1) + 10}" width="${m(0.85) - 6}" height="${m(2.1) - 10}" fill="#1a1f44" opacity=".85"/></g>` +
      `<path d="M${m(3.1)},-14 L${m(3.1)},-${m(0.6)}" stroke="#5d6282" stroke-width="8"/><path d="M${m(3.1)},-${m(0.6)} l24,-30 M${m(3.1)},-${m(0.5)} l-22,-24" stroke="#5d6282" stroke-width="6" fill="none"/>` + '</g>';
    // luz acesa no fundo: lâmpada pendurada + mesa + cadeiras (escala de profundidade menor que a da calçada)
    const lx = o.lightX || 640, ly = 835, ds = 0.55;
    mid += `<defs><radialGradient id="warm" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#ffe2a0" stop-opacity=".95"/><stop offset="0.45" stop-color="#ffc468" stop-opacity=".45"/><stop offset="1" stop-color="#ffb04a" stop-opacity="0"/></radialGradient></defs>`;
    mid += `<circle cx="${lx}" cy="${ly - m(1.5) * ds}" r="${o.glowR || 230}" fill="url(#warm)" opacity="${f(o.glowA === undefined ? 1 : o.glowA)}"/>`;
    mid += `<g transform="translate(${lx},${ly}) scale(${ds})">` + `<line x1="0" y1="${-m(2.9)}" x2="0" y2="${-m(2.2)}" stroke="#222" stroke-width="4"/><circle cx="0" cy="${-m(2.12)}" r="16" fill="#fff4cc" stroke="${NAVY}" stroke-width="3"/>` + R(-m(0.55), -m(0.75), m(1.1), 12, '#c9a06a', 4, NAVY, 3) + R(-m(0.5), -m(0.75) + 12, 10, m(0.75) - 12, '#8d6a42', 2) + R(m(0.4), -m(0.75) + 12, 10, m(0.75) - 12, '#8d6a42', 2) + R(-m(0.55) + 4, -m(0.82), m(1.1) - 8, 8, '#fff', 3, NAVY, 2) +
      C(-m(0.2), -m(0.86), 12, '#fff', NAVY, 2.5) + C(m(0.2), -m(0.86), 12, '#fff', NAVY, 2.5) + C(0, -m(0.9), 4, '#ffe8a0', NAVY, 1.5) +
      R(-m(0.95), -m(0.45), m(0.4), 10, '#7a5a3a', 3, NAVY, 2.5) + R(-m(0.92), -m(0.45), 6, m(0.45), '#7a5a3a', 1) + R(m(0.6), -m(0.45), m(0.4), 10, '#7a5a3a', 3, NAVY, 2.5) + R(m(0.93), -m(0.45), 6, m(0.45), '#7a5a3a', 1) + '</g>';
    if (o.cida) mid += `<g>${drawChar({ cast: 'cida', x: lx + m(0.78) * ds, y: ly - 3, s: W.charScale(1.58) * ds, flip: -1, t, ph: 2.2, pose: o.cidaPose || POSE.sit, expr: EXPR.calm, look: [lx - 300, ly - 120], turn: 0.4, light: { ox: -1, oy: -0.6, rim: '#ffe0a0' } }).svg}</g>`;
    // mato alto em tufos (até 1,5 m), balançando; vários talos por tufo
    const grass = (x0, x1, base, hMin, hMax, cols, seed, step = 30) => { let g = ''; for (let x = x0; x < x1; x += step) { const r0 = rnd(x * 0.31 + seed); for (let k = 0; k < 6; k++) { const r = rnd(x * 0.17 + k * 3.1 + seed), h = hMin + r * (hMax - hMin), lean = sway(x + k * 7) + (k - 2.5) * 9 + (r - 0.5) * 16, bx = x + (k - 3) * 5; g += `<path d="M${f(bx - 4)},${base} Q${f(bx + lean * 0.3)},${f(base - h * 0.6)} ${f(bx + lean)},${f(base - h)} Q${f(bx + lean * 0.4 + 5)},${f(base - h * 0.5)} ${f(bx + 4)},${base}Z" fill="${cols[(k + (r0 * 3 | 0)) % cols.length]}" stroke="#0e1a1c" stroke-width="1"/>`; } } return g; };
    const gc = ['#3c6a54', '#2f5a48', '#4a7a5c', '#33624f'];
    mid += grass(330, lx - 150, 848, 70, 250, gc, 1) + grass(lx + 170, 960, 848, 70, 250, gc, 5);   // clareira em volta da mesa: ela mantém o lugar limpo
    mid += `</g>`;
    // near: calçada, grade/portão, pilares com a placa 14, e o resto da rua (sem postes passando)
    let near = S3.rua.near(o.scroll || 0, t, { parked: null });
    const px = o.pillarX || 440;
    let fence = ''; for (let x = px + 30; x < px + 560; x += 22) fence += `<line x1="${x}" y1="${846 - 150}" x2="${x}" y2="846" stroke="#8a90b8" stroke-width="2" opacity=".8"/>`;
    fence += `<line x1="${px}" y1="${846 - 150}" x2="${px + 590}" y2="${846 - 150}" stroke="#6d749c" stroke-width="5"/><line x1="${px}" y1="${846 - 70}" x2="${px + 590}" y2="${846 - 70}" stroke="#6d749c" stroke-width="3"/>`;
    for (let x = px; x < px + 590; x += 40) fence += `<path d="M${x},${846 - 150} L${x + 40},${846 - 70} L${x},${846}" stroke="#6d749c" stroke-width="1.6" fill="none" opacity=".55"/>`;
    const pil = (x) => `<g transform="translate(${x},846)">` + R(-17, -330, 34, 330, '#7a7f9e', 2, NAVY, W.stroke) + R(-22, -342, 44, 16, '#5d6282', 2, NAVY, 3.5) + '</g>';
    fence += pil(px) + pil(px + 590);
    // placa de número: 14
    fence += `<g transform="translate(${px},846)">` + R(-14, -300, 28, 38, '#f4efe0', 3, NAVY, 3) + `<text x="0" y="-270" font-family="Inter" font-weight="800" font-size="20" fill="#c33" text-anchor="middle">14</text></g>`;
    // portão sem folha (aberto, caído)
    fence += `<path d="M${px + 20},${846 - 2} L${px + 120},${846 - 150} L${px + 118},${846 - 70}Z" fill="none" stroke="#5d6282" stroke-width="3" opacity=".0"/>`;
    near += fence;
    // luz da moto invade o terreno
    const fore = grass(-60, 120, 1040, 110, 300, ['#1d3a30', '#244a3a'], 9, 40) + grass(470, 640, 1040, 110, 300, ['#1d3a30', '#244a3a'], 19, 40);
    return { far, mid, near, fore };
  }
  // helper: rider+moto estacionados na esquerda do terreno
  function lotBike(t, lt, o) {
    const bx = o.bx || 150, sh = S3.shadowFrom(bx, 900, 420, [], 0), pk = o.poses || [{ t: 0, v: 'rideIdle' }], ek = o.exprs || [{ t: 0, v: 'calm' }];
    const rider = drawChar({ cast: 'nando', x: bx + 20, y: 900 - 95, s: W.charScale(1.75), flip: 1, t, ph: 0.7, pose: po(pk)(lt), lag: po(pk)(Math.max(0, lt - 0.12)), expr: ex(ek)(lt), look: o.look || [bx + 800, 760], turn: 0.7, helmet: o.helmet === undefined ? 1 : o.helmet, light: { ox: 1, oy: -0.7, rim: '#ffe0a0' } }).svg;
    return `<ellipse cx="${bx}" cy="906" rx="250" ry="14" fill="${NAVY}" opacity=".35"/><g transform="translate(${bx},900)">${W.moto(0, t, 0, { beam: o.beam === undefined ? 0.55 : o.beam })}</g>${phoneOnBar(bx, lt, '#4a6bff')}${rider}`;
  }

  // =========================================================== PLANOS ===========================================================
  // A (0,12–3,34) "Onze e quarenta e sete da noite. Chegou um pedido."
  SH.push({ id: 'P1', t0: 0, t1: 1.35, kind: 'screen', draw: (t, lt) => UI.bokeh(t) + UI.phone(288, 520, 1.38, UI.lock(lt, { notifAt: 9 }), { t, shake: 0 }) + `<text x="288" y="135" font-family="Inter" font-weight="800" font-size="30" fill="#9fb4ff" text-anchor="middle" opacity=".0">23:47</text>` });
  SH.push({ id: 'P2', t0: 1.35, t1: 2.55, kind: 'screen', draw: (t, lt) => { const lt2 = lt + 1.35, buzz = lt2 > 1.38 && lt2 < 2.4 ? 5 * Math.exp(-(lt2 - 1.38) * 1.6) : 0; return UI.bokeh(t) + UI.phone(288, 520, 1.38, UI.lock(lt2, { notifAt: 1.38 }), { t, shake: buzz }); } });
  SH.push({ id: 'P2b', t0: 2.55, t1: 3.45, kind: 'scene', cam: [[0, 352, 640, 1.5], [0.9, 352, 636, 1.62, 'io']],
    build: (t, lt) => ride(t, lt, { speed: 0, base: 700, helmet: 0, turn: 0.45, poses: [{ t: 0, v: 'rideIdle' }, { t: 0.25, v: 'checkPhone', d: 0.35, e: 'spring2' }], exprs: [{ t: 0, v: 'calm' }, { t: 0.35, v: 'curious', d: 0.2 }], look: lt => lt < 0.3 ? [700, 820] : [394, 690], faceGlow: 0.55 }) });
  // B (3,59–5,75) "Rua das Acácias, número catorze."
  SH.push({ id: 'P3', t0: 3.45, t1: 4.9, kind: 'screen', draw: (t, lt) => UI.bokeh(t) + UI.phone(288, 520, lerp(1.38, 1.5, E.io(clamp(lt / 1.45))), UI.order(lt, { hl: lt > 0.3 }), { t, shake: 0 }) });
  SH.push({ id: 'P3b', t0: 4.9, t1: 5.85, kind: 'scene', cam: [[0, 352, 640, 1.55], [0.95, 352, 636, 1.7, 'io']],
    build: (t, lt) => ride(t, lt, { speed: 0, base: 700, helmet: 0, turn: 0.45, poses: [{ t: 0, v: 'checkPhone' }], exprs: [{ t: 0, v: 'focus' }, { t: 0.4, v: 'curious', d: 0.25 }], look: [394, 690], faceGlow: 0.55 }) });
  // C (6,04–8,99) "Só que a casa catorze foi demolida há trinta anos."
  SH.push({ id: 'P4', t0: 5.85, t1: 7.5, kind: 'screen', draw: (t, lt) => UI.bokeh(t) + UI.phone(288, 520, 1.38, UI.map(lt, { zoom: lerp(1, 1.6, E.io(clamp(lt / 1.6))) }), { t }) });
  SH.push({ id: 'P5', t0: 7.5, t1: 9.25, kind: 'scene', cam: [[0, 352, 640, 1.6], [1.75, 348, 626, 2.0, 'io']], shake: [[0.45, 2.2, 0.3]],
    build: (t, lt) => ride(t, lt, { speed: 0, base: 400, helmet: 0, turn: 0.45, poses: [{ t: 0, v: 'checkPhone' }, { t: 1.0, v: 'rideIdle', d: 0.5, e: 'spring2' }], exprs: [{ t: 0, v: 'curious' }, { t: 0.45, v: 'realize', d: 0.12, e: 'spring' }, { t: 0.85, v: 'shock', d: 0.1 }, { t: 1.25, v: 'worry', d: 0.25 }], look: lt => lt < 1.0 ? [394, 690] : [560, 820], faceGlow: 0.5, bx: 290 }) });
  // D (9,39–11,55) "O aplicativo deu onze minutos."
  SH.push({ id: 'P6', t0: 9.25, t1: 11.2, kind: 'screen', draw: (t, lt) => UI.bokeh(t) + UI.phone(288, 520, lerp(1.38, 1.5, E.io(clamp(lt / 1.95))), UI.timer(lt, { start: 660 }), { t }) });
  // E (11,75–13,94) "Cancelar custava a minha semana inteira."
  SH.push({ id: 'P7', t0: 11.2, t1: 13.2, kind: 'screen', draw: (t, lt) => { const th = E.io(clamp((lt - 0.2) / 0.9)), tr = lt > 1.1 ? Math.sin(lt * 13) * 3 : 0; return UI.bokeh(t) + UI.phone(288, 520, lerp(1.42, 1.5, E.io(clamp(lt / 2.0))), UI.cancel(lt), { t }) + `<g transform="translate(${f(lerp(520, 394, th) + tr)},${f(lerp(1000, 770, th) + tr * 0.6)}) rotate(${-24 + tr})"><ellipse rx="44" ry="26" fill="#8a5a3d" stroke="${NAVY}" stroke-width="4"/><path d="M-30,-8 q22,-10 52,-4" stroke="#6d4129" stroke-width="3" fill="none" stroke-linecap="round"/></g>`; } });
  SH.push({ id: 'P7b', t0: 13.2, t1: 14.05, kind: 'scene', cam: [[0, 352, 640, 1.6], [0.85, 352, 636, 1.75, 'io']],
    build: (t, lt) => ride(t, lt, { speed: 0, base: 700, helmet: 0, turn: 0.45, poses: [{ t: 0, v: 'checkPhone' }], exprs: [{ t: 0, v: 'worry' }, { t: 0.4, v: 'sad', d: 0.25 }], look: [394, 690], faceGlow: 0.5 }) });
  // F (14,24–16,29) "E o aluguel vencia na sexta."
  SH.push({ id: 'P8', t0: 14.05, t1: 15.7, kind: 'screen', draw: (t, lt) => UI.bokeh(t) + UI.paper(288, 470, 1.14 + lt * 0.03, lt) + `<g transform="translate(${f(120 + lt * 8)},880)"><ellipse rx="70" ry="44" fill="#8a5a3d" stroke="${NAVY}" stroke-width="4"/><path d="M-40,-14 q38,-20 86,-6" stroke="#6d4129" stroke-width="3" fill="none" stroke-linecap="round"/></g>` });
  SH.push({ id: 'P8b', t0: 15.7, t1: 16.75, kind: 'scene', cam: [[0, 352, 640, 1.7], [1.05, 350, 630, 2.0, 'io']],
    build: (t, lt) => ride(t, lt, { speed: 0, base: 400, helmet: 0, turn: 0.5, poses: [{ t: 0, v: 'rideIdle' }], exprs: [{ t: 0, v: 'worry' }, { t: 0.4, v: 'focus', d: 0.3 }, { t: 0.8, v: 'resigned', d: 0.2 }], look: [700, 800] }) });
  // G (16,69–17,57) "Eu fui."  -> viseira desce, o punho gira, a moto arranca
  SH.push({ id: 'P9', t0: 16.75, t1: 18.0, kind: 'scene', whipIn: false, cam: [[0, 330, 640, 1.9], [0.45, 350, 650, 1.6, 'io'], [1.25, 420, 660, 1.0, 'io']], shake: [[0.62, 3.2, 0.4]],
    build: (t, lt) => ride(t, lt, { helmet: lt => lt < 0.3 ? 1 : 2, scrollFn: lt => 400 + (lt > 0.55 ? 0.5 * 5200 * Math.pow(lt - 0.55, 2) : 0), pitch: lt => lt > 0.55 && lt < 1.2 ? -7 * Math.sin(Math.min(1, (lt - 0.55) / 0.65) * Math.PI) : 0, poses: [{ t: 0, v: 'rideIdle' }, { t: 0.3, v: 'rideCrouch', d: 0.2 }, { t: 0.55, v: 'rideWind', d: 0.18, e: 'anticip' }], exprs: [{ t: 0, v: 'resigned' }, { t: 0.3, v: 'focus', d: 0.2 }], beam: 0.75, bx: 290 }) });
  // H (17,87–20,47) "No caminho, abri o histórico daquele endereço."
  SH.push({ id: 'P10', t0: 18.0, t1: 18.95, kind: 'scene', cam: [[0, 288, 512, 0.62], [0.95, 292, 530, 0.74, 'io']],
    build: (t, lt) => ride(t, lt, { base: 2200, scrollFn: lt => 2200 + 2100 * lt, helmet: 2, poses: [{ t: 0, v: 'rideWind' }, { t: 0.5, v: 'rideGo', d: 0.5 }], beam: 0.7, bx: 270 }) });
  SH.push({ id: 'P11', t0: 18.95, t1: 20.65, kind: 'screen', draw: (t, lt) => UI.bokeh(t * 4) + UI.phone(288, 520, 1.4, UI.history(lt, { t0: 99 }), { t, shake: 1.4 }) });
  // I (20,77–22,97) "Onze pedidos, todos cancelados."  (as linhas aparecem uma a uma, em sincronia com a contagem)
  SH.push({ id: 'P12', t0: 20.65, t1: 23.1, kind: 'screen', draw: (t, lt) => { const sc = clamp((lt - 1.0) / 1.4) * 330; return UI.bokeh(t * 4) + UI.phone(288, 520, 1.4, UI.history(lt, { t0: 0.1, dt: 0.19, n11: 1, scroll: sc }), { t, shake: 1.0 }); } });
  // J (23,17–25,98) "Mesmo endereço, mesmo dia, uma vez por ano."
  SH.push({ id: 'P13', t0: 23.1, t1: 24.9, kind: 'screen', draw: (t, lt) => { const z = lerp(1.4, 1.9, E.io(clamp(lt / 1.8))); return UI.bokeh(t * 4) + UI.phone(288, lerp(520, 640, E.io(clamp(lt / 1.8))), z, UI.history(lt + 3, { t0: 0, dt: 0.01, n11: 1, scroll: 330 - clamp(lt / 1.8) * 330 }), { t, shake: 0.8 }); } });
  SH.push({ id: 'P14', t0: 24.9, t1: 26.2, kind: 'scene', cam: [[0, 380, 640, 1.45], [1.3, 372, 632, 1.7, 'io']],
    build: (t, lt) => ride(t, lt, { scrollFn: lt => 9000 + 2300 * lt, helmet: 1, poses: [{ t: 0, v: 'rideGo' }, { t: 0.7, v: 'checkPhone', d: 0.4 }], exprs: [{ t: 0, v: 'focus' }, { t: 0.8, v: 'worry', d: 0.3 }], beam: 0.7, faceGlow: 0.45, look: lt => lt < 0.7 ? [900, 800] : [394, 690], turn: 0.5 }) });
  // K (26,28–28,00) "E hoje era doze de outubro."
  SH.push({ id: 'P15', t0: 26.2, t1: 28.3, kind: 'screen', draw: (t, lt) => { const k = E.spring2(clamp(lt / 0.5)); return UI.bokeh(t * 3) + UI.phone(288, 520, 1.38, UI.lock(5, { notifAt: 99 }), { t }) + `<g transform="translate(288,${f(210 - (1 - k) * 30)}) scale(${f(0.6 + 0.4 * k)})" opacity="${f(k)}"><rect x="-216" y="-44" width="432" height="86" rx="43" fill="#ffd24a" stroke="${NAVY}" stroke-width="5"/><text x="0" y="16" font-family="Inter" font-weight="800" font-size="40" fill="#1d2747" text-anchor="middle">HOJE · 12 OUT</text></g>`; } });
  // L (28,45–30,49) "Cheguei com sete minutos de sobra."
  SH.push({ id: 'P16', t0: 28.3, t1: 30.6, kind: 'scene', cam: [[0, 288, 512, 0.7], [2.3, 330, 540, 0.95, 'io']], shake: [[1.3, 1.6, 0.3]],
    build: (t, lt) => { const v = Math.max(0, 1 - E.io(clamp((lt - 0.2) / 1.1))); const scr = 11000 + 2300 * (0.2 * 0 + (lt < 0.2 ? lt : 0.2) + 0.55 * 1.1 * (1) * (1 - Math.pow(1 - clamp((lt - 0.2) / 1.1), 2))); const r = ride(t, lt, { scrollFn: () => scr, helmet: 1, pitch: lt => lt > 0.9 && lt < 1.5 ? 4 * Math.sin(clamp((lt - 0.9) / 0.6) * Math.PI) : 0, poses: [{ t: 0, v: 'rideGo' }, { t: 1.0, v: 'rideCrouch', d: 0.3 }, { t: 1.5, v: 'rideIdle', d: 0.4, e: 'spring2' }], exprs: [{ t: 0, v: 'focus' }, { t: 1.4, v: 'resigned', d: 0.4 }], beam: 0.6, bx: 290 });
      const sec = Math.max(7 * 60, 660 - (lt + 19.0 + 9.25 - 9.25) * 0), tm = 7 * 60 + (2.3 - lt); const mm = '07', ss = String(Math.max(0, Math.floor(tm % 60))).padStart(2, '0');
      r.near += `<g transform="translate(288,${f(700)})" opacity="${f(clamp((lt - 1.1) / 0.3))}"><rect x="-120" y="-34" width="240" height="68" rx="34" fill="#10142e" stroke="#ffd24a" stroke-width="5"/><text x="0" y="14" font-family="Inter" font-weight="800" font-size="40" fill="#ffd24a" text-anchor="middle">${mm}:${ss}</text></g>`; return r; } });
  // M (30,79–33,38) "Era só mato alto e um portão sem casa."
  SH.push({ id: 'P17', t0: 30.6, t1: 32.4, kind: 'scene', cam: [[0, 330, 560, 0.62], [1.8, 400, 580, 0.74, 'io']],
    build: (t, lt) => { const L = lotScene(t, lt, { glowA: 0.0, lightX: 680 }); L.near += lotBike(t, lt, { bx: 150, poses: [{ t: 0, v: 'rideIdle' }], exprs: [{ t: 0, v: 'worry' }], helmet: 1 }); return L; } });
  SH.push({ id: 'P17b', t0: 32.4, t1: 33.8, kind: 'scene', cam: [[0, 520, 700, 2.0], [1.4, 548, 690, 2.2]],
    build: (t, lt) => { const L = lotScene(t, lt, { glowA: 0.0, lightX: 680 }); return L; } });
  // N (33,73–35,87) "E lá no fundo, uma luz acesa."
  SH.push({ id: 'P18', t0: 33.8, t1: 36.4, kind: 'scene', cam: [[0, 420, 590, 0.8], [2.6, 760, 640, 1.75, 'io']],
    build: (t, lt) => { const k = E.io(clamp((lt - 0.2) / 1.2)); const L = lotScene(t, lt, { glowA: k, glowR: 230, lightX: 680, cida: k > 0.35 });
      L.near += lotBike(t, lt, { bx: 150, poses: [{ t: 0, v: 'rideIdle' }, { t: 0.3, v: 'rideCrouch', d: 0.3 }], exprs: [{ t: 0, v: 'worry' }, { t: 0.5, v: 'realize', d: 0.2, e: 'spring' }], helmet: 1, look: [680, 800] }); return L; } });

  G.STORY3 = { SHOTS: SH };
})(window);
