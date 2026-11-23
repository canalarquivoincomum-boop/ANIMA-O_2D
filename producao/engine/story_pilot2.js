// story_pilot2.js — piloto v2 (0–29,8 s): mesmos tempos/voz do v1, re-dirigido com princípios de animação,
// luz/sombra, vida no cenário e o Coco (personagem fixo) como testemunha.
(function (G) {
  const { track, clamp, lerp, E, f, noise1, NAVY } = G.L;
  const { drawChar, EXPR, POSE, POSE0, flute, tube, path, ell, hand, CAST } = G.CH;
  const { drawCoco, CE } = G.COCO;
  const { SETS, truck, apron, R, C, Pth, T } = G.SETS;
  const Sh = G.SETS.castShadow;

  // elenco extra (figurantes)
  CAST.passer = Object.assign({}, CAST.genaro, { skin: '#c58a5e', cloth: '#8a79c4', cloth2: '#6c5ba6', pants: '#4a4f6a', cap: '#4c8f9d', mustache: null, stripes: 0, nose: 1.2, wrinkle: 0 });
  CAST.cust = Object.assign({}, CAST.genaro, { skin: '#8f5a3a', cloth: '#d98a6a', cloth2: '#b9694c', pants: '#3f4a63', cap: '#e8c24a', mustache: null, stripes: 0, nose: 1.1, wrinkle: 0 });
  // poses derivadas
  POSE.hangLook = Object.assign({}, POSE.hang, { headTilt: -7, headDown: 5 });
  POSE.hangSigh = Object.assign({}, POSE.hang, { lean: 3, headDown: 3 });
  POSE.sitWatch = Object.assign({}, POSE.sit, { hR: [24, -116], headDown: 5, lean: 2 });
  POSE.fatherWave = Object.assign({}, POSE.pinch, { hR: [90, -128], lean: -4, headTilt: 4 });
  POSE.fatherWind = Object.assign({}, POSE.pinch, { hR: [60, -110], lean: 3, headTilt: -2 });

  const L_TARDE = { ox: 1, oy: -0.7, rim: '#fff3c4' }, L_MANHA = { ox: 1, oy: -0.55, rim: '#e0ebff' };
  const po = keys => lt => track(keys, lt, n => Object.assign({}, POSE0, POSE[n]));
  const ex = keys => lt => track(keys, lt, n => EXPR[n]);
  const cx_ = keys => lt => track(keys, lt, n => CE[n]);

  function person(cast, t, lt, c) {
    const pk = c.poses || [{ t: 0, v: 'stand' }], ek = c.exprs || [{ t: 0, v: 'calm' }];
    let pose = po(pk)(lt); const lag = po(pk)(Math.max(0, lt - 0.12));
    if (c.mod) pose = c.mod(pose, lt);
    const look = typeof c.look === 'function' ? c.look(lt) : c.look, fade = typeof c.fade === 'function' ? c.fade(lt) : c.fade;
    let s = c.shadow !== undefined ? Sh(c.x, c.y + (c.dy || 0), c.s || 1, c.shadow) : '';
    s += drawChar({ cast, x: c.x, y: c.y + (c.dy || 0), s: c.s, flip: c.flip, t, ph: c.ph, pose, lag, expr: ex(ek)(lt), look, turn: c.turn, fade, walk: c.walk, propsFn: c.props, braid: c.braid, light: c.light || L_TARDE, squash: c.squash, back: c.back }).svg;
    return s;
  }
  const coco = (t, lt, c) => drawCoco({ x: c.x, y: c.y, s: c.s, flip: c.flip, t, ph: c.ph || 1, expr: cx_(c.exprs)(lt), look: c.look, light: c.light || L_TARDE, rot: c.rot, crawl: c.crawl });

  const fluteHold = (J, kind) => kind === 'up'
    ? `<g transform="translate(${f(J.hR[0] - 5)},${f(J.hR[1] + 50)}) rotate(-88)">${flute(138, 0)}</g>`
    : `<g transform="translate(8,-158) rotate(62)">${flute(108, 0)}</g>`;

  const SHOTS = [];
  // ---------- P1 · 0,00–0,60 · close extremo: a luz atravessa os dedos (Coco espia no peitoril) ----------
  SHOTS.push({ id: 'P1', t0: 0, t1: 0.60, set: 'sala', cam: [[0, 782, 540, 3.0], [0.6, 786, 532, 3.3]], shake: [[0, 2.5, 0.25]],
    actors: (t, lt) => [coco(t, lt, { x: 846, y: 626, s: 0.5, exprs: [{ t: 0, v: 'curious' }], look: [-0.6, -0.5], flip: -1 }),
      person('isis', t, lt, { x: 700, y: 722, s: 1, ph: 0.4, turn: 0.55, shadow: -1, poses: [{ t: 0, v: 'holdOut' }], exprs: [{ t: 0, v: 'curious' }], look: [900, 540], fade: lt => 0.16 + lt * 0.1, props: J => fluteHold(J, 'up') }), ] });
  // ---------- P2 · 0,60–2,95 · a sala e a promessa ----------
  SHOTS.push({ id: 'P2', t0: 0.60, t1: 2.95, set: 'sala', whipIn: true, cam: [[0, 450, 560, 0.84], [2.35, 300, 420, 1.45, 'io']],
    actors: (t, lt) => [stool(700, 722), coco(t, lt, { x: 618, y: 626, s: 0.5, exprs: [{ t: 0, v: 'neutral' }, { t: 0.8, v: 'curious', d: 0.3 }, { t: 1.5, v: 'listen', d: 0.4 }], look: [0.7, -0.5] }),
      person('isis', t, lt, { x: 700, y: 722, s: 1, ph: 0.4, turn: 0.8, shadow: -1,
        poses: [{ t: 0, v: 'stand' }, { t: 0.75, v: 'relax', d: 0.5, e: 'spring2' }, { t: 1.6, v: 'stand', d: 0.7 }], exprs: [{ t: 0, v: 'calm' }, { t: 0.7, v: 'curious', d: 0.25 }, { t: 1.5, v: 'sad', d: 0.5 }],
        look: lt => lt < 0.7 ? [900, 560] : (lt < 1.5 ? [430, 285] : [900, 580]), fade: { R: 0.2 } })],
    world: (t, lt) => { const p = clamp((t - 1.5) / 0.55), L = 400; return `<ellipse cx="215" cy="396" rx="92" ry="22" fill="none" stroke="#d9503f" stroke-width="5.5" stroke-linecap="round" stroke-dasharray="${f(L)}" stroke-dashoffset="${f(L * (1 - E.out(p)))}" transform="rotate(-2 215 396)"/>`; } });
  // ---------- P3 · 2,95–4,35 · o relógio (tempo acelerado, tique que balança) ----------
  SHOTS.push({ id: 'P3', t0: 2.95, t1: 4.35, set: 'sala', cam: [[0, 436, 292, 2.6], [1.4, 436, 292, 2.85]], shake: [[0.1, 1.2, 0.12], [0.6, 1.2, 0.12], [1.1, 1.2, 0.12]],
    actors: () => [], world: (t, lt) => { const tick = Math.floor(lt / 0.5), jolt = Math.sin((lt % 0.5) * 38) * Math.exp(-(lt % 0.5) * 22) * 1.8;
      return `<g transform="translate(0,${f(jolt)})">${G.SETS.clockFace(430, 285, 50, 5, lt * 2.4)}${G.SETS.clockSecond(430, 285, 50, lt * 5)}</g>` + `<ellipse cx="${f(300 + lt * 60)}" cy="330" rx="90" ry="140" fill="#fff0c0" opacity=".10" transform="rotate(14 300 330)"/>`; } });
  // ---------- P4 · 4,35–6,80 · a mão vira vidro; Coco reage ----------
  SHOTS.push({ id: 'P4', t0: 4.35, t1: 6.80, set: 'sala', roll: [[0, 0], [1.0, -0.4], [2.45, -1.6]], cam: [[0, 716, 612, 2.15], [2.45, 726, 570, 2.55, 'io']],
    actors: (t, lt) => [stool(690, 722), coco(t, lt, { x: 606, y: 626, s: 0.52, exprs: [{ t: 0, v: 'neutral' }, { t: 0.9, v: 'surprise', d: 0.18, e: 'spring' }, { t: 1.8, v: 'worried', d: 0.4 }], look: [0.8, -0.4] }),
      person('isis', t, lt, { x: 690, y: 722, s: 1, ph: 1.1, turn: -0.15, shadow: -1,
        poses: [{ t: 0, v: 'relax' }, { t: 0.3, v: 'inspectOut', d: 0.6, e: 'anticip' }], exprs: [{ t: 0, v: 'calm' }, { t: 0.45, v: 'curious', d: 0.2 }, { t: 0.95, v: 'realize', d: 0.12, e: 'spring' }, { t: 1.4, v: 'worry', d: 0.3 }, { t: 2.0, v: 'sad', d: 0.4 }],
        look: lt => lt < 0.4 ? [840, 560] : [774, 575], fade: lt => ({ R: lerp(0.3, 0.92, E.io(clamp(lt / 2.2))) }) })] });
  // ---------- P5 · 6,80–9,15 · a rua (carros, pássaros, figurante andando) ----------
  SHOTS.push({ id: 'P5', t0: 6.80, t1: 9.15, set: 'rua', whipIn: true, cam: [[0, 560, 690, 1.25], [2.35, 400, 690, 1.3, 'io']],
    actors: (t, lt) => [passerWalk(t, lt, 390 + lt * 72, 846, 0.72), man(t, lt, { fade: 0, poses: [{ t: 0, v: 'sit' }, { t: 0.9, v: 'sitWatch', d: 0.45, e: 'spring2' }, { t: 1.7, v: 'sit', d: 0.5 }], exprs: [{ t: 0, v: 'resigned' }, { t: 0.9, v: 'curious', d: 0.25 }, { t: 1.8, v: 'resigned', d: 0.5 }], look: lt < 0.8 ? [700, 790] : [330, 700] })], world: ruaClock(5, 0) });
  // ---------- P6 · 9,15–10,80 · uma hora, a mão ----------
  SHOTS.push({ id: 'P6', t0: 9.15, t1: 10.80, set: 'rua', cam: [[0, 332, 700, 2.0], [1.65, 336, 706, 2.15]],
    actors: (t, lt) => [man(t, lt, { fade: lt => 0.2 + lt * 0.12, poses: [{ t: 0, v: 'hang' }, { t: 0.45, v: 'hangLook', d: 0.45, e: 'spring2' }], exprs: [{ t: 0, v: 'resigned' }, { t: 0.5, v: 'curious', d: 0.2 }, { t: 1.1, v: 'worry', d: 0.3 }], look: lt => lt < 0.4 ? [700, 790] : [360, 770] })], world: ruaClock(5, 5) });
  // ---------- P7 · 10,80–12,50 · duas horas, o braço ----------
  SHOTS.push({ id: 'P7', t0: 10.80, t1: 12.50, set: 'rua', cam: [[0, 336, 706, 1.95], [1.7, 340, 700, 1.75]],
    actors: (t, lt) => [man(t, lt, { fade: lt => lerp(0.6, 1.0, E.io(clamp(lt / 1.5))), poses: [{ t: 0, v: 'hangLook' }, { t: 0.9, v: 'hangSigh', d: 0.5, e: 'spring2' }], exprs: [{ t: 0, v: 'worry' }, { t: 0.8, v: 'sad', d: 0.4 }, { t: 1.4, v: 'resigned', d: 0.3 }], look: lt => lt < 0.7 ? [360, 770] : [700, 790] })], world: ruaClock(7, 5) });
  // ---------- P8a · 12,50–13,85 · a padaria (um cliente sai andando) ----------
  SHOTS.push({ id: 'P8a', t0: 12.50, t1: 13.85, set: 'rua', cam: [[0, 1060, 620, 1.55], [1.35, 1090, 620, 1.7]],
    actors: (t, lt) => [person('cust', t, lt, { x: 1212 - lt * 85, y: 822, s: 0.7, ph: 0.2, flip: -1, shadow: -1, walk: { ph: lt * 1.7, amp: 0.9 }, props: J => `<g transform="translate(${f(J.hR[0] + 8)},${f(J.hR[1] + 12)})">${R(-12, -4, 24, 34, '#e8c898', 3, NAVY, 3)}</g>`, light: { ox: 1, oy: -0.5, rim: '#ffe0a0' } })], world: () => '' });
  // ---------- P8b · 13,85–15,30 · só o avental (Coco no balcão) ----------
  SHOTS.push({ id: 'P8b', t0: 13.85, t1: 15.30, set: 'padaria', cam: [[0, 450, 540, 1.5], [1.45, 440, 540, 1.9]],
    actors: (t, lt) => [coco(t, lt, { x: 548, y: 626, s: 0.44, exprs: [{ t: 0, v: 'neutral' }, { t: 0.5, v: 'curious', d: 0.3 }], look: [-0.7, -0.35], flip: -1 }), apron(430, 480, 1.2, t, 0)], front: true });
  // ---------- P9 · 15,30–17,45 · uma mão troca a flor ----------
  SHOTS.push({ id: 'P9', t0: 15.30, t1: 17.45, set: 'padaria', cam: [[0, 470, 560, 2.2], [2.15, 456, 566, 2.45]],
    actors: (t, lt) => [apron(430, 480, 1.2, t, clamp((lt - 1.15) / 0.3)), bentoHand(t, lt)], front: true });
  // ---------- P10 · 17,45–20,80 · toca flauta mal (Coco no suporte reage) ----------
  SHOTS.push({ id: 'P10', t0: 17.45, t1: 20.80, set: 'sala', cam: [[0, 520, 620, 1.62], [3.35, 508, 612, 1.85, 'io']], shake: [[2.68, 3.2, 0.32]], roll: [[0, 0], [2.6, 0], [2.74, -1.5], [3.35, 0]],
    actors: (t, lt) => {
      const low = E.ease(clamp((lt - 3.1) / 0.25)), fl = J => `<g transform="translate(${f(lerp(8, 12, low))},${f(lerp(-158, -122, low))}) rotate(${f(lerp(62, 72, low))})">${flute(108, 0)}</g>`;
      return [coco(t, lt, { x: 632, y: 706, s: 0.42, exprs: [{ t: 0, v: 'happy' }, { t: 2.68, v: 'worried', d: 0.08, e: 'spring' }, { t: 3.2, v: 'curious', d: 0.3 }], look: [-0.8, -0.2], flip: -1, rot: lt > 2.68 && lt < 3.2 ? Math.sin((lt - 2.68) * 40) * 5 : 0 }),
        person('isis', t, lt, { x: 500, y: 800, s: 1.05, ph: 0.2, turn: 0.35, shadow: -1, poses: [{ t: 0, v: 'play' }, { t: 2.68, v: 'playFlinch', d: 0.07 }, { t: 3.1, v: 'playLow', d: 0.22, e: 'spring2' }],
          exprs: [{ t: 0, v: 'focus' }, { t: 1.0, v: 'hope', d: 0.3 }, { t: 1.8, v: 'focus', d: 0.3 }, { t: 2.68, v: 'wince', d: 0.06 }, { t: 3.12, v: 'sheepish', d: 0.2 }], look: lt < 3.0 ? [640, 720] : [380, 650],
          mod: (p, lt2) => { if (lt2 < 2.68) { p.lean += Math.sin(lt2 * 7.4) * 1.7; p.fR = [p.fR[0], p.fR[1] - Math.max(0, Math.sin(lt2 * 7.4 + 1)) * 5]; p.headTilt += Math.sin(lt2 * 3.7) * 1.4; } return p; },
          braid: lt > 2.68 ? 24 * Math.exp(-(lt - 2.68) * 3.2) * Math.cos((lt - 2.68) * 18) : 0, props: fl })]; } });
  // ---------- P11 · 20,80–22,60 · o caminhão com o nome dela ----------
  SHOTS.push({ id: 'P11', t0: 20.80, t1: 22.60, set: 'frente', cam: [[0, 560, 790, 2.0], [1.8, 520, 835, 2.45, 'io']],
    actors: (t, lt) => [truck(720, 866, 1.0, t, { idle: true }) + exhaust(t, 430, 700)], world: () => '' });
  // ---------- P12a · 22,60–24,05 · o pai na janela ----------
  SHOTS.push({ id: 'P12a', t0: 22.60, t1: 24.05, set: 'cabine', cam: [[0, 262, 560, 1.28], [1.45, 262, 556, 1.42]], actors: () => [], special: 'cabine' });
  // ---------- P12b · 24,05–25,30 · a mão do "pouquinho" (Ísis pula e acena) ----------
  SHOTS.push({ id: 'P12b', t0: 24.05, t1: 25.30, set: 'cabine', cam: [[0, 288, 512, 1.0]], shake: [[0, 1.6, 0.2]], actors: () => [], special: 'pinch' });
  // ---------- P13 · 25,30–29,75 · o pouquinho fica longe (Coco em primeiro plano) ----------
  SHOTS.push({ id: 'P13', t0: 25.30, t1: 29.75, set: 'estrada', whipIn: true, roll: [[0, 0], [2.2, 0.9], [4.45, 0]], cam: [[0, 288, 600, 1.35], [4.45, 288, 520, 1.0, 'io']],
    foreFn: (t, lt) => { const z = lerp(1.35, 1.0, E.io(clamp(lt / 4.45))), cy = lerp(600, 520, E.io(clamp(lt / 4.45))), sl = 1 + (z - 1) * 1.45, X = 288 * 1.45 + (470 - 288) / sl, Y = cy * 1.45 + (1000 - 512) / sl;
      return coco(t, lt, { x: X, y: Y, s: 1.35 / sl, flip: -1, exprs: [{ t: 0, v: 'neutral' }, { t: 1.4, v: 'worried', d: 0.8 }, { t: 3.2, v: 'sad', d: 1.0 }], look: [-0.9, -0.7], light: L_MANHA }); },
    actors: (t, lt) => [truckRear(288 + lerp(10, 0, E.io(clamp(lt / 4.4))), lerp(640, 478, E.out(clamp(lt / 4.4))), lerp(2.1, 0.55, E.out(clamp(lt / 4.4))), t),
      person('isis', t, lt, { x: 104, y: 706, s: 0.5, ph: 0.6, back: true, turn: 0, light: L_MANHA, shadow: -1, poses: [{ t: 0, v: 'wave' }], exprs: [{ t: 0, v: 'calm' }],
        mod: (p, lt2) => { p.hR = [50 + Math.sin(lt2 * 5.2) * 8, -196 + Math.sin(lt2 * 5.2) * 6]; return p; } })] });

  // ---------- auxiliares ----------
  function stool(x, y) { return Sh(x, y + 82, 0.55, -1, 0.14) + R(x - 48, y, 96, 16, '#b57a50', 6, NAVY, 4.5) + R(x - 40, y + 16, 12, 66, '#9a6540', 3, NAVY, 4) + R(x + 28, y + 16, 12, 66, '#9a6540', 3, NAVY, 4) + `<path d="M${x - 44},${y + 4} h88" stroke="#d9a06c" stroke-width="3" opacity=".8"/>`; }
  function man(t, lt, o) { return person('alcides', t, lt, Object.assign({ x: 300, y: 800, s: 1.25, ph: 2.3, turn: 0.45, shadow: -1, light: { ox: 1, oy: -0.5, rim: '#ffe0a0' } }, o)); }
  function passerWalk(t, lt, x, y, s) { return person('passer', t, lt, { x, y, s, ph: 1.4, walk: { ph: lt * 1.8, amp: 0.95 }, shadow: -1, poses: [{ t: 0, v: 'stand' }], exprs: [{ t: 0, v: 'calm' }], light: { ox: 1, oy: -0.5, rim: '#ffe0a0' } }); }
  function ruaClock(h, m) { return (t, lt) => `<g>${SETS.rua.clock(h, m + lt * 0.8)}</g>`; }
  function exhaust(t, x, y) { let s = ''; for (let i = 0; i < 6; i++) { const p = ((t * 0.9 + i / 6) % 1); s += `<circle cx="${f(x - p * 40 + Math.sin(t * 3 + i) * 4)}" cy="${f(y - p * 70)}" r="${f(6 + p * 16)}" fill="#c9c4d6" opacity="${f((1 - p) * 0.5)}"/>`; } return s; }
  function bentoHand(t, lt) {
    const a = E.spring2(clamp(lt / 0.95)), b = E.io(clamp((lt - 1.5) / 0.55)), k = a * (1 - b);
    const hx = lerp(700, 436, k), hy = lerp(470, 560, k) + Math.sin(lt * 9) * 1.4 * clamp(k, 0, 1), wr = [hx + 34, hy + 2], S = [900, 400];
    let g = '';
    const sleeve = tube(S, [(S[0] + wr[0]) / 2 + 30, (S[1] + wr[1]) / 2 - 10], [wr[0] + 40, wr[1] - 2], 120, 76, 14);
    g += path(sleeve.d, '#f08a3c') + `<path d="M${f(wr[0] + 96)},${f(wr[1] - 40)} L${f(wr[0] + 150)},${f(wr[1] - 54)}" stroke="#fff" stroke-width="9" stroke-linecap="round"/>`;
    const cuff = tube([wr[0] + 62, wr[1] - 5], [wr[0] + 50, wr[1] - 3], [wr[0] + 40, wr[1] - 2], 80, 76, 3); g += path(cuff.d, '#ffe2c2', NAVY, 3.5);
    if (lt > 0.25 && lt < 1.32) g += `<g transform="translate(${f(hx - 6)},${f(hy - 2)}) rotate(-82)"><path d="M0,0 L0,58" stroke="${NAVY}" stroke-width="9" stroke-linecap="round"/><path d="M0,0 L0,58" stroke="#4f9b62" stroke-width="5" stroke-linecap="round"/>${[0, 72, 144, 216, 288].map(r => `<ellipse cx="0" cy="-12" rx="10" ry="14" transform="rotate(${r})" fill="#ff7aa8" stroke="${NAVY}" stroke-width="2.6"/>`).join('')}<circle r="6" fill="#ffd54a" stroke="${NAVY}" stroke-width="2.4"/></g>`;
    g += `<ellipse cx="${f(wr[0] + 4)}" cy="${f(wr[1])}" rx="30" ry="26" fill="#b57b52" stroke="${NAVY}" stroke-width="3.8"/><path d="M${f(wr[0] - 14)},${f(wr[1] - 14)} q-18,-6 -22,12 q8,12 24,6" fill="#b57b52" stroke="${NAVY}" stroke-width="3.4" stroke-linejoin="round"/><path d="M${f(wr[0] - 8)},${f(wr[1] + 6)} q8,6 18,2" stroke="#8d5c3b" stroke-width="2.4" fill="none" stroke-linecap="round"/><path d="M${f(wr[0] + 10)},${f(wr[1] - 16)} q10,-4 16,4" stroke="#fff1c8" stroke-width="4" fill="none" opacity=".5" stroke-linecap="round"/>`;
    return g;
  }
  function truckRear(x, y, s, t) {
    let g = `<g transform="translate(${f(x)},${f(y)}) scale(${f(s)})">`;
    g += `<ellipse cx="0" cy="2" rx="30" ry="4" fill="#2a2f48" opacity=".3"/>` + R(-20, -36, 40, 32, '#f2efe6', 2, NAVY, 1.6) + R(-20, -14, 40, 5, '#3a3f5a', 0) + R(-18, -9, 6, 6, '#d9503f', 1, NAVY, 1) + R(12, -9, 6, 6, '#d9503f', 1, NAVY, 1) + R(-22, -4, 8, 6, '#26293a', 1) + R(14, -4, 8, 6, '#26293a', 1);
    for (let i = 0; i < 4; i++) { const p = ((t * 0.7 + i / 4) % 1); g += `<circle cx="${f(Math.sin(t * 2 + i) * 6)}" cy="${f(-6 - p * 26)}" r="${f(3 + p * 9)}" fill="#d8cfc4" opacity="${f((1 - p) * 0.5)}"/>`; }
    return g + '</g>';
  }
  function cabine(t, lt, mode) {
    let s = `<defs>${G.SETS.lg('skyC', 0, 0, 0, 1024, [[0, '#a8c8e8'], [0.6, '#f8d2d0'], [1, '#ffe2c0']])}</defs>` + R(-100, -100, 800, 1300, 'url(#skyC)');
    if (mode === 'cabine') {
      s += `<g opacity=".9">${R(20, 360, 120, 300, '#c9bfdc', 0, NAVY, 3)}${R(150, 400, 100, 260, '#f6c9b8', 0, NAVY, 3)}${R(420, 380, 140, 280, '#c9d6c6', 0, NAVY, 3)}</g>` + R(-20, 560, 640, 500, '#8d90a6');
      s += R(70, 170, 440, 480, '#3b3040', 24) + R(70, 170, 440, 80, '#4a3d50', 24) + R(200, 420, 150, 250, '#5a4a5e', 18) + R(400, 520, 70, 150, '#6f5d72', 10);
      const fl = Math.sin(t * 2.0) * 1.5;
      s += `<clipPath id="cabClip"><rect x="0" y="0" width="576" height="640"/></clipPath><g clip-path="url(#cabClip)">` +
        person('genaro', t, lt, { x: 300, y: 760 + fl, s: 1.7, flip: -1, ph: 3, turn: 0.45, light: L_MANHA, poses: [{ t: 0, v: 'fatherWind' }, { t: 0.4, v: 'fatherWave', d: 0.4, e: 'anticip' }], exprs: [{ t: 0, v: 'warm' }, { t: 0.5, v: 'smile', d: 0.3 }, { t: 1.1, v: 'warm', d: 0.3 }], look: [-100, 520],
          mod: (p, lt2) => { p.hR = [p.hR[0], p.hR[1] + Math.sin(lt2 * 7) * 3]; return p; } }) + '</g>';
      s += Pth('M-20,640 L596,640 L596,1100 L-20,1100Z', '#3d6fb5', NAVY, 6) + R(-20, 640, 616, 26, '#2b4f86', 0, NAVY, 5) + R(60, 760, 120, 24, '#c9c4b8', 10, NAVY, 5) + R(-20, 120, 90, 540, '#3d6fb5', 0, NAVY, 6) + R(-20, 100, 616, 80, '#3d6fb5', 0, NAVY, 6) + R(500, 330, 120, 150, '#2b4f86', 18, NAVY, 5) + R(512, 342, 96, 126, '#bfe3f2', 12, NAVY, 3.5);
    } else {
      s += `<g opacity=".95">${R(40, 520, 140, 500, '#c9bfdc', 0, NAVY, 3)}${R(380, 560, 200, 460, '#f6c9b8', 0, NAVY, 3)}</g>` + [[60, 200, 1.2], [380, 150, 0.9], [250, 330, 0.7]].map(c => `<g transform="translate(${c[0] + lt * 8},${c[1]}) scale(${c[2]})" opacity=".9"><ellipse rx="70" ry="22" fill="#fff6ec"/><ellipse cx="-34" cy="-14" rx="38" ry="24" fill="#fff6ec"/><ellipse cx="24" cy="-20" rx="44" ry="28" fill="#fff6ec"/></g>`).join('') + R(430, 380, 24, 200, '#9a6b4b', 4, NAVY, 3.5) + C(442, 360, 88, '#8bc49a', NAVY, 4) + C(392, 410, 56, '#74b585', NAVY, 4) + C(500, 400, 58, '#9bd0a8', NAVY, 4) + Pth('M-80,470 L130,330 L330,470Z', '#c9615a', NAVY, 4);
      s += R(-60, 560, 330, 520, '#f6c9b8', 0, NAVY, 4) + R(40, 640, 120, 130, '#cfe9ee', 6, NAVY, 4) + R(-60, 1000, 700, 100, '#8d90a6') + R(290, 700, 8, 240, '#a88e6a', 2, NAVY, 3) + R(-60, 930, 360, 12, '#b8a07f', 3, NAVY, 3.5);
      const u = (lt % 0.85) / 0.85, jy = -Math.sin(Math.PI * u) * 26, sq = u < 0.12 ? 0.13 * (1 - u / 0.12) : (u > 0.88 ? 0.13 * (u - 0.88) / 0.12 : 0);
      s += person('isis', t, lt, { x: 140, y: 1022 + jy * 0.72, s: 0.72, ph: 0.8, turn: 0.2, light: L_MANHA, squash: sq, poses: [{ t: 0, v: 'wave' }], exprs: [{ t: 0, v: 'happy' }], look: [600, 520], mod: (p, l2) => { p.hR = [52 + Math.sin(l2 * 8) * 9, -192 + Math.sin(l2 * 8) * 7]; return p; } });
      const sl = tube([760, 700], [600, 640], [440, 560], 190, 150, 14); s += path(sl.d, '#e2a53b'); const cu = tube([500, 590], [440, 566], [388, 548], 150, 140, 6); s += path(cu.d, '#b9802a');
      const wob = Math.sin(lt * 7) * 2.2 + Math.sin(lt * 17) * 0.8, sk = '#a8683f', ol = NAVY, gap = 8 + Math.sin(lt * 9) * 4.5;
      const fing = (d, w) => `<path d="${d}" fill="none" stroke="${ol}" stroke-width="${w + 8}" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${sk}" stroke-width="${w}" stroke-linecap="round"/>`;
      s += `<g transform="translate(300,${f(560 + wob)}) rotate(-8) scale(3.5)"><ellipse cx="36" cy="4" rx="26" ry="24" fill="${sk}" stroke="${ol}" stroke-width="3.6"/><ellipse cx="44" cy="26" rx="13" ry="9.5" fill="${sk}" stroke="${ol}" stroke-width="3.2"/><ellipse cx="55" cy="10" rx="12" ry="9.5" fill="${sk}" stroke="${ol}" stroke-width="3.2"/><ellipse cx="56" cy="-6" rx="11" ry="9" fill="${sk}" stroke="${ol}" stroke-width="3.2"/>` +
        fing(`M18,-13 L-30,-13`, 12) + fing(`M16,19 Q-6,18 -29,${f(-13 + 12 + gap)}`, 12) + `<path d="M-6,-20 L-20,-20" stroke="#ffe9c8" stroke-width="3" opacity=".6" stroke-linecap="round"/></g>`;
    }
    return s;
  }

  G.PILOT = { SHOTS, cabine };
})(window);
