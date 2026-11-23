// story_pilot.js — piloto (0–29,7 s): S1 gancho, S2 a regra, S3 a protagonista. Tempos = palavras da voz-guia.
(function (G) {
  const { track, clamp, lerp, E, f, noise1, NAVY } = G.L;
  const { drawChar, EXPR, POSE, flute, tube, path, ell, hand, CAST } = G.CH;
  const { SETS, truck, apron, R, C, Pth, T } = G.SETS;
  const rim = '#fff3c4';
  const stool = (x, y) => R(x - 48, y, 96, 16, '#b57a50', 6, NAVY, 4.5) + R(x - 40, y + 16, 12, 66, '#9a6540', 3, NAVY, 4) + R(x + 28, y + 16, 12, 66, '#9a6540', 3, NAVY, 4);
  const ex = (keys) => (lt) => track(keys, lt, n => EXPR[n]);
  const po = (keys) => (lt) => track(keys, lt, n => Object.assign({}, G.CH.POSE0, POSE[n]));

  // flauta presa à mão/boca (fora da máscara de transparência)
  const fluteHold = (J, kind) => kind === 'up'
    ? `<g transform="translate(${f(J.hR[0] - 5)},${f(J.hR[1] + 50)}) rotate(-88)">${flute(138, 0)}</g>`
    : `<g transform="translate(8,-158) rotate(62)">${flute(108, 0)}</g>`;

  const SHOTS = [];
  // ---------- P1 · 0,00–0,60 · close extremo: a luz atravessa os dedos ----------
  SHOTS.push({ id: 'P1', t0: 0, t1: 0.60, set: 'sala', cam: [[0, 782, 540, 3.0], [0.6, 786, 532, 3.3]],
    actors: (t, lt) => [drawChar({ cast: 'isis', x: 700, y: 722, s: 1, flip: 1, t, ph: 0.4, turn: 0.55, pose: Object.assign({}, POSE.holdOut), expr: EXPR.curious, look: [900, 540],
      fade: { R: 0.16 + lt * 0.1 }, propsFn: J => fluteHold(J, 'up') }).svg, stool(700, 722)] });
  // ---------- P2 · 0,72–2,95 · sala: a espera ----------
  SHOTS.push({ id: 'P2', t0: 0.60, t1: 2.95, set: 'sala', whipIn: true, cam: [[0, 450, 560, 0.84], [2.35, 300, 420, 1.45, 'io']],
    actors: (t, lt) => [drawChar({ cast: 'isis', x: 700, y: 722, s: 1, flip: 1, t, ph: 0.4, turn: 0.8, pose: Object.assign({}, POSE.stand, { hL: [-30, -100], hR: [40, -96], lean: 2 }), expr: EXPR.calm, look: [900, 560], fade: { R: 0.2 } }).svg, stool(700, 722)],
    world: (t, lt) => { // círculo vermelho na "ÚLTIMA MÚSICA" desenhado um pouco ANTES da voz (1,55 s)
      const p = clamp((t - 1.5) / 0.55); const L = 400;
      return `<ellipse cx="215" cy="396" rx="92" ry="22" fill="none" stroke="#d9503f" stroke-width="5.5" stroke-linecap="round" stroke-dasharray="${f(L)}" stroke-dashoffset="${f(L * (1 - E.out(p)))}" transform="rotate(-2 215 396)"/>`;
    } });
  // ---------- P3 · 2,95–4,35 · relógio: três horas ----------
  SHOTS.push({ id: 'P3', t0: 2.95, t1: 4.35, set: 'sala', cam: [[0, 436, 292, 2.6], [1.4, 436, 292, 2.85]],
    actors: () => [], world: (t, lt) => `<g>${G.SETS.clockFace(430, 285, 50, 5, lt * 1.2)}</g>` });
  // ---------- P4 · 4,35–6,75 · Ísis olha a própria mão ----------
  SHOTS.push({ id: 'P4', t0: 4.35, t1: 6.80, set: 'sala', cam: [[0, 718, 590, 1.5], [2.45, 724, 580, 1.8, 'io']],
    actors: (t, lt) => [stool(690, 722), drawChar({ cast: 'isis', x: 690, y: 722, s: 1, flip: 1, t, ph: 1.1, turn: -0.15,
      pose: po([{ t: 0, v: 'relax' }, { t: 0.35, v: 'inspectOut', d: 0.45 }])(lt), expr: ex([{ t: 0, v: 'calm' }, { t: 0.5, v: 'curious', d: 0.25 }, { t: 1.55, v: 'worry', d: 0.35 }])(lt),
      look: lt < 0.5 ? [840, 560] : [774, 575], fade: { R: lerp(0.3, 0.92, E.io(clamp(lt / 2.2))), L: 0.0 } }).svg] });
  // ---------- P5 · 6,82–9,15 · rua: plano geral ----------
  SHOTS.push({ id: 'P5', t0: 6.80, t1: 9.15, set: 'rua', whipIn: true, cam: [[0, 640, 690, 1.25], [2.35, 340, 690, 1.3, 'io']],
    actors: (t, lt) => [man(t, { fade: 0.0, pose: 'sit' })], world: ruaClock(5, 0) });
  // ---------- P6 · 9,20–10,78 · uma hora, a mão ----------
  SHOTS.push({ id: 'P6', t0: 9.15, t1: 10.80, set: 'rua', cam: [[0, 332, 700, 2.0], [1.65, 336, 706, 2.15]],
    actors: (t, lt) => [man(t, { fade: 0.2 + lt * 0.12, pose: 'hang', exprName: 'resigned' })], world: ruaClock(5, 5) });
  // ---------- P7 · 10,83–12,45 · duas horas, o braço ----------
  SHOTS.push({ id: 'P7', t0: 10.80, t1: 12.50, set: 'rua', cam: [[0, 336, 706, 1.95], [1.7, 340, 700, 1.75]],
    actors: (t, lt) => [man(t, { fade: lerp(0.6, 1.0, E.io(clamp(lt / 1.5))), pose: 'hang', exprName: 'resigned', look: [700, 790] })], world: ruaClock(7, 5) });
  // ---------- P8a · 12,56–13,85 · padaria (fora) ----------
  SHOTS.push({ id: 'P8a', t0: 12.50, t1: 13.85, set: 'rua', cam: [[0, 1060, 620, 1.55], [1.35, 1090, 620, 1.7]], actors: () => [], world: () => '' });
  // ---------- P8b · 13,85–15,30 · balcão: só o avental ----------
  SHOTS.push({ id: 'P8b', t0: 13.85, t1: 15.30, set: 'padaria', cam: [[0, 450, 540, 1.5], [1.45, 440, 540, 1.9]],
    actors: (t, lt) => [apron(430, 480, 1.2, t, 0)], front: true });
  // ---------- P9 · 15,35–17,45 · uma mão troca a flor ----------
  SHOTS.push({ id: 'P9', t0: 15.30, t1: 17.45, set: 'padaria', cam: [[0, 470, 560, 2.2], [2.15, 456, 566, 2.45]],
    actors: (t, lt) => [apron(430, 480, 1.2, t, clamp((lt - 1.15) / 0.3)), bentoHand(t, lt)], front: true });
  // ---------- P10 · 17,51–20,80 · Ísis toca mal ----------
  SHOTS.push({ id: 'P10', t0: 17.45, t1: 20.80, set: 'sala', cam: [[0, 520, 620, 1.62], [3.35, 508, 612, 1.85, 'io']],
    actors: (t, lt) => {
      const low = E.ease(clamp((lt - 3.1) / 0.25));
      const fl = J => `<g transform="translate(${f(lerp(8, 12, low))},${f(lerp(-158, -122, low))}) rotate(${f(lerp(62, 72, low))})">${flute(108, 0)}</g>`;
      return [drawChar({ cast: 'isis', x: 500, y: 800, s: 1.05, flip: 1, t, ph: 0.2, turn: 0.35,
        pose: po([{ t: 0, v: 'play' }, { t: 2.68, v: 'playFlinch', d: 0.07 }, { t: 3.1, v: 'playLow', d: 0.22 }])(lt),
        expr: ex([{ t: 0, v: 'focus' }, { t: 2.68, v: 'wince', d: 0.06 }, { t: 3.12, v: 'sheepish', d: 0.2 }])(lt), look: lt < 3.0 ? [640, 720] : [560, 650],
        braid: lt > 2.68 ? 24 * Math.exp(-(lt - 2.68) * 3.2) * Math.cos((lt - 2.68) * 18) : 0, propsFn: fl }).svg];
    } });
  // ---------- P11 · 20,83–22,60 · o caminhão com o nome dela ----------
  SHOTS.push({ id: 'P11', t0: 20.80, t1: 22.60, set: 'frente', cam: [[0, 560, 790, 2.0], [1.8, 520, 835, 2.45, 'io']],
    actors: (t, lt) => [truck(720, 866, 1.0, t, { idle: true })], world: () => '' });
  // ---------- P12a · 22,61–24,00 · pai na janela ----------
  SHOTS.push({ id: 'P12a', t0: 22.60, t1: 24.05, set: 'cabine', cam: [[0, 262, 560, 1.28], [1.45, 262, 556, 1.42]], actors: (t, lt) => [], special: 'cabine' });
  // ---------- P12b · 24,05–25,30 · a mão do "pouquinho" ----------
  SHOTS.push({ id: 'P12b', t0: 24.05, t1: 25.30, set: 'cabine', cam: [[0, 288, 512, 1.0]], actors: () => [], special: 'pinch' });
  // ---------- P13 · 25,37–29,75 · o "pouquinho" fica longe ----------
  SHOTS.push({ id: 'P13', t0: 25.30, t1: 29.75, set: 'estrada', whipIn: true, cam: [[0, 288, 600, 1.35], [4.45, 288, 520, 1.0, 'io']],
    actors: (t, lt) => [truckRear(288 + lerp(10, 0, E.io(clamp(lt / 4.4))), lerp(640, 478, E.out(clamp(lt / 4.4))), lerp(2.1, 0.55, E.out(clamp(lt / 4.4))), t), drawChar({ cast: 'isis', x: 104, y: 706, s: 0.5, flip: 1, t, ph: 0.6, back: true, turn: 0,
      pose: Object.assign({}, POSE.wave, { hR: [50 + Math.sin(t * 5.2) * 8, -196 + Math.sin(t * 5.2) * 6] }), expr: EXPR.calm }).svg] });

  // ---------- atores auxiliares ----------
  function man(t, o) {
    const pose = Object.assign({}, G.CH.POSE0, POSE[o.pose || 'sit']);
    return drawChar({ cast: 'alcides', x: 300, y: 800, s: 1.25, flip: 1, t, ph: 2.3, turn: 0.45, pose, expr: EXPR[o.exprName || 'resigned'], look: o.look || [700, 790],
      fade: { R: o.fade || 0 }, propsFn: () => '' }).svg;
  }
  function ruaClock(h, m) { return (t, lt) => `<g>${SETS.rua.clock(h, m + lt * 0.8)}</g>`; }
  function bentoHand(t, lt) {
    // mão (manga laranja, camisa de time) entra pela direita, troca a flor velha pela nova e sai
    const a = E.io(clamp(lt / 0.95)), b = E.io(clamp((lt - 1.5) / 0.55)), k = a * (1 - b);
    const hx = lerp(700, 436, k), hy = lerp(470, 560, k) + Math.sin(lt * 9) * 1.4 * k;
    const wr = [hx + 34, hy + 2], S = [900, 400];
    let g = '';
    const sleeve = tube(S, [(S[0] + wr[0]) / 2 + 30, (S[1] + wr[1]) / 2 - 10], [wr[0] + 40, wr[1] - 2], 120, 76, 14);
    g += path(sleeve.d, '#f08a3c') + `<path d="M${f(wr[0] + 96)},${f(wr[1] - 40)} L${f(wr[0] + 150)},${f(wr[1] - 54)}" stroke="#fff" stroke-width="9" stroke-linecap="round"/>`;
    const cuff = tube([wr[0] + 62, wr[1] - 5], [wr[0] + 50, wr[1] - 3], [wr[0] + 40, wr[1] - 2], 80, 76, 3); g += path(cuff.d, '#ffe2c2', NAVY, 3.5);
    const fl = (lt > 0.25 && lt < 1.32);
    if (fl) g += `<g transform="translate(${f(hx - 6)},${f(hy - 2)}) rotate(-82)"><path d="M0,0 L0,58" stroke="${NAVY}" stroke-width="9" stroke-linecap="round"/><path d="M0,0 L0,58" stroke="#4f9b62" stroke-width="5" stroke-linecap="round"/>${[0, 72, 144, 216, 288].map(r => `<ellipse cx="0" cy="-12" rx="10" ry="14" transform="rotate(${r})" fill="#ff7aa8" stroke="${NAVY}" stroke-width="2.6"/>`).join('')}<circle r="6" fill="#ffd54a" stroke="${NAVY}" stroke-width="2.4"/></g>`;
    // punho + polegar
    g += `<ellipse cx="${f(wr[0] + 4)}" cy="${f(wr[1])}" rx="30" ry="26" fill="#b57b52" stroke="${NAVY}" stroke-width="3.8"/><path d="M${f(wr[0] - 14)},${f(wr[1] - 14)} q-18,-6 -22,12 q8,12 24,6" fill="#b57b52" stroke="${NAVY}" stroke-width="3.4" stroke-linejoin="round"/><path d="M${f(wr[0] - 8)},${f(wr[1] + 6)} q8,6 18,2" stroke="#8d5c3b" stroke-width="2.4" fill="none" stroke-linecap="round"/>`;
    return g;
  }
  function truckRear(x, y, s, t) {
    let g = `<g transform="translate(${f(x)},${f(y)}) scale(${f(s)})">`;
    g += `<ellipse cx="0" cy="2" rx="30" ry="4" fill="#2a2f48" opacity=".3"/>` + R(-20, -36, 40, 32, '#f2efe6', 2, NAVY, 1.6) + R(-20, -14, 40, 5, '#3a3f5a', 0) + R(-18, -9, 6, 6, '#d9503f', 1, NAVY, 1) + R(12, -9, 6, 6, '#d9503f', 1, NAVY, 1) + R(-22, -4, 8, 6, '#26293a', 1) + R(14, -4, 8, 6, '#26293a', 1);
    return g + '</g>';
  }
  // cena especial: cabine do caminhão (dia, luz fria da manhã)
  function cabine(t, lt, mode) {
    let s = `<defs>${G.SETS.lg('skyC', 0, 0, 0, 1024, [[0, '#a8c8e8'], [0.6, '#f8d2d0'], [1, '#ffe2c0']])}</defs>` + R(-100, -100, 800, 1300, 'url(#skyC)');
    if (mode === 'cabine') {
      s += `<g opacity=".9">${R(20, 360, 120, 300, '#c9bfdc', 0, NAVY, 3)}${R(150, 400, 100, 260, '#f6c9b8', 0, NAVY, 3)}${R(420, 380, 140, 280, '#c9d6c6', 0, NAVY, 3)}</g>`;
      s += R(-20, 560, 640, 500, '#8d90a6') ;
      // interior da cabine
      s += R(70, 170, 440, 480, '#3b3040', 24) + R(70, 170, 440, 80, '#4a3d50', 24) + R(200, 420, 150, 250, '#5a4a5e', 18) + R(400, 520, 70, 150, '#6f5d72', 10);
      const fl = Math.sin(t * 2.0) * 1.5;
      const pt = Object.assign({}, G.CH.POSE0, POSE.pinch, { hR: [90, -128 + Math.sin(lt * 7) * 3], hL: [-20, -92], lean: -4, headTilt: 4 });
      s += `<clipPath id="cabClip"><rect x="0" y="0" width="576" height="640"/></clipPath><g clip-path="url(#cabClip)">` +
        drawChar({ cast: 'genaro', x: 300, y: 760 + fl, s: 1.7, flip: -1, t, ph: 3, turn: 0.45, pose: pt, expr: EXPR.warm, look: [-100, 520] }).svg + '</g>';
      // porta e montantes (na frente do ator)
      s += Pth('M-20,640 L596,640 L596,1100 L-20,1100Z', '#3d6fb5', NAVY, 6) + R(-20, 640, 616, 26, '#2b4f86', 0, NAVY, 5) + R(60, 760, 120, 24, '#c9c4b8', 10, NAVY, 5) + R(-20, 120, 90, 540, '#3d6fb5', 0, NAVY, 6) + R(-20, 100, 616, 80, '#3d6fb5', 0, NAVY, 6);
      s += R(500, 330, 120, 150, '#2b4f86', 18, NAVY, 5) + R(512, 342, 96, 126, '#bfe3f2', 12, NAVY, 3.5);
    } else { // close da mão que faz o "pouquinho"
      s += `<g opacity=".95">${R(40, 520, 140, 500, '#c9bfdc', 0, NAVY, 3)}${R(380, 560, 200, 460, '#f6c9b8', 0, NAVY, 3)}</g>`;
      s += R(-60, 560, 330, 520, '#f6c9b8', 0, NAVY, 4) + R(40, 640, 120, 130, '#cfe9ee', 6, NAVY, 4) + R(-60, 1000, 700, 100, '#8d90a6') + R(290, 700, 8, 240, '#a88e6a', 2, NAVY, 3) + R(-60, 930, 360, 12, '#b8a07f', 3, NAVY, 3.5);
      s += drawChar({ cast: 'isis', x: 120, y: 1014, s: 0.56, flip: 1, t, ph: 0.8, back: false, turn: 0.2, pose: POSE.relax, expr: EXPR.calm, look: [600, 520] }).svg;
      const sl = tube([760, 700], [600, 640], [440, 560], 190, 150, 14);
      s += path(sl.d, '#e2a53b');
      const cu = tube([500, 590], [440, 566], [388, 548], 150, 140, 6); s += path(cu.d, '#b9802a');
      const wob = Math.sin(lt * 7) * 1.6, sk = '#a8683f', ol = NAVY;
      const fing = (d, w) => `<path d="${d}" fill="none" stroke="${ol}" stroke-width="${w + 8}" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${sk}" stroke-width="${w}" stroke-linecap="round"/>`;
      const gap = 7 + Math.sin(lt * 5) * 1.5;            // fresta do "pouquinho"
      s += `<g transform="translate(300,${f(560 + wob)}) rotate(-8) scale(3.5)">` +
        `<ellipse cx="36" cy="4" rx="26" ry="24" fill="${sk}" stroke="${ol}" stroke-width="3.6"/>` +
        `<ellipse cx="44" cy="26" rx="13" ry="9.5" fill="${sk}" stroke="${ol}" stroke-width="3.2"/><ellipse cx="55" cy="10" rx="12" ry="9.5" fill="${sk}" stroke="${ol}" stroke-width="3.2"/><ellipse cx="56" cy="-6" rx="11" ry="9" fill="${sk}" stroke="${ol}" stroke-width="3.2"/>` +
        fing(`M18,-13 L-30,-13`, 12) + fing(`M16,19 Q-6,18 -29,${f(-13 + 12 + gap)}`, 12) + `</g>`;
    }
    return s;
  }

  G.PILOT = { SHOTS, cabine };
})(window);
