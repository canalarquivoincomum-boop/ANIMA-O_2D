// ch.js — rig de personagem 2D flat (traço Escuta Só): cabeçudo, olho grande c/ pupila pequena e brilho,
// braços de uma peça (manga+punho+mão) por IK, pernas sempre visíveis, transparência por partes do corpo.
(function (G) {
  const { clamp, lerp, f, shade, blend, NAVY } = G.L;
  const OL = 3.8;                       // contorno (576 de largura)
  let UID = 0;

  // ---------- elenco ----------
  const CAST = {
    isis: { skin: '#b9774f', hair: '#2a1b1d', cloth: '#4fb3a9', cloth2: '#3b958d', shoe: '#f0e7d8', sock: '#ffffff', W: 62, H: 56, style: 'braid', limb: [34, 32, 19], torso: 'dress', ribbon: '#ffcf33', brow: '#2a1b1d' },
    genaro: { skin: '#a8683f', hair: '#6d6a6a', cloth: '#e2a53b', cloth2: '#b9802a', pants: '#37466e', shoe: '#3a2b2a', sock: '#d8d2c6', W: 60, H: 54, style: 'cap', limb: [38, 36, 21], torso: 'jacket', cap: '#c9473d', mustache: '#cfcac4', brow: '#4e4a4a', S: 1.0 },
    alcides: { skin: '#dba783', hair: '#bdb8b2', cloth: '#7e9482', cloth2: '#627868', pants: '#5c6178', shoe: '#4a3f3a', sock: '#d8d2c6', W: 58, H: 54, style: 'bald', limb: [38, 36, 20], torso: 'coat', mustache: '#e8e4de', brow: '#8f8a85' }
  };

  // ---------- expressões ----------
  const BASE = { browY: 0, browA: 0, lid: 0.1, lidB: 0, arc: 0, pup: 1, mw: 14, mc: 0.45, mo: 0, mround: 0, blush: 0.35, nose: 0, brow2: 0 };
  const X = o => Object.assign({}, BASE, o);
  const EXPR = {
    neutral: X({}),
    calm: X({ mc: 0.3, mw: 12 }),
    curious: X({ browY: -5, browA: 7, mc: 0.1, mw: 10, lid: 0.04 }),
    worry: X({ browY: -7, browA: 15, mc: -0.55, mw: 12, pup: 0.9, blush: 0.2 }),
    wince: X({ lid: 0.72, lidB: 0.5, browY: 5, browA: -9, mw: 21, mc: -0.15, mo: 0.55, nose: 1, blush: 0.5 }),
    sheepish: X({ browY: -3, browA: 11, mc: 0.75, mw: 13, blush: 0.7, lid: 0.16 }),
    smile: X({ mc: 1, mw: 17, lidB: 0.15, blush: 0.6 }),
    happy: X({ arc: 1, mc: 1.1, mw: 19, mo: 0.45, blush: 0.7 }),
    shock: X({ pup: 0.62, browY: -11, browA: 3, mo: 0.75, mround: 0.85, mw: 7, mc: 0, lid: 0 }),
    sad: X({ browA: 16, browY: -3, mc: -0.85, mw: 11, lid: 0.28, blush: 0.15 }),
    resigned: X({ lid: 0.38, browY: 2, browA: 5, mc: -0.12, mw: 10, blush: 0.1 }),
    warm: X({ lid: 0.3, mc: 0.8, mw: 15, blush: 0.55, browA: 4, browY: -1 }),
    focus: X({ lid: 0.2, browY: 2, browA: -4, mc: 0.05, mw: 9 })
  };

  // ---------- poses (coords locais; pés em (0,0); +x = direção do olhar) ----------
  const POSE0 = { hipDrop: 0, lean: 0, headTilt: 0, headTurn: 0, headDown: 0, hL: [-34, -86], hR: [34, -86], fL: [-15, 0], fR: [15, 0], kd: 1, gL: 'mitt', gR: 'mitt', sh: 0, farBehind: 0 };
  const P = o => Object.assign({}, POSE0, o);
  const POSE = {
    stand: P({}),
    relax: P({ hL: [-36, -80], hR: [36, -80], lean: 1 }),
    // flauta contra a luz, mão direita erguida
    holdUp: P({ lean: -2, hR: [36, -204], hL: [-30, -100], gR: 'grip', gL: 'mitt', headTilt: -3 }),
    holdOut: P({ lean: -3, hR: [88, -170], hL: [-30, -100], gR: 'grip', gL: 'mitt', headTilt: -2 }),
    inspectOut: P({ lean: 1, hR: [82, -150], hL: [-30, -92], gR: 'mitt', headTilt: -3 }),
    playFlinch: P({ lean: -5, headTilt: -9, headDown: -5, hL: [24, -128], hR: [42, -96], gR: 'grip', gL: 'grip', fL: [-18, 0], fR: [14, 0] }),
    playLow: P({ lean: 1, headTilt: 3, hL: [16, -116], hR: [34, -94], gR: 'grip', gL: 'grip' }),
    hang: P({ hipDrop: 40, hL: [-26, -62], hR: [40, -30], fL: [-6, 0], fR: [34, 0] }),
    inspect: P({ lean: 2, headTilt: -5, hR: [22, -158], hL: [-30, -92], gR: 'mitt', headDown: 3 }),
    play: P({ lean: 2, hL: [26, -123], hR: [43, -92], gR: 'grip', gL: 'grip', headTilt: 4, fL: [-18, 0], fR: [14, 0] }),
    wave: P({ hR: [52, -190], hL: [-34, -80], gR: 'mitt', lean: -1 }),
    pinch: P({ hR: [56, -150], hL: [-30, -84], gR: 'pinch', lean: 0 }),
    sit: P({ hipDrop: 40, hL: [-30, -66], hR: [30, -66], fL: [-6, 0], fR: [34, 0], sh: 0 }),
    sitKnee: P({ hipDrop: 40, hL: [-26, -62], hR: [36, -66], fL: [-6, 0], fR: [34, 0] }),
    sitHand: P({ hipDrop: 40, hL: [-30, -60], hR: [22, -122], fL: [-6, 0], fR: [36, 0], gR: 'mitt' }),
    sitFore: P({ hipDrop: 40, hL: [-30, -60], hR: [42, -112], fL: [-6, 0], fR: [36, 0], gR: 'mitt' }),
    sitFade: P({ hipDrop: 40, hL: [-30, -60], hR: [38, -128], fL: [-6, 0], fR: [36, 0], gR: 'mitt' }),
    drive: P({ hipDrop: 40, hL: [-6, -132], hR: [40, -112], fL: [-6, 0], fR: [34, 0], gR: 'grip', gL: 'grip', lean: 3 })
  };

  // ---------- IK ----------
  function ik(A, B, l1, l2, pref) {
    const dx = B[0] - A[0], dy = B[1] - A[1];
    const d0 = Math.hypot(dx, dy) || 0.001, d = clamp(d0, 4, l1 + l2 - 0.5);
    const ux = dx / d0, uy = dy / d0, a = (l1 * l1 - l2 * l2 + d * d) / (2 * d), h = Math.sqrt(Math.max(l1 * l1 - a * a, 0));
    const C = [[A[0] + ux * a - uy * h, A[1] + uy * a + ux * h], [A[0] + ux * a + uy * h, A[1] + uy * a - ux * h]];
    const sc = p => pref(p);
    const mid = sc(C[0]) >= sc(C[1]) ? C[0] : C[1];
    const end = [A[0] + ux * d, A[1] + uy * d];
    return { mid, end };
  }
  // tubo afunilado em volta de uma curva S→E→W
  function tube(S, E, W, w0, w1, nSeg = 14) {
    const Ec = [2 * E[0] - (S[0] + W[0]) / 2, 2 * E[1] - (S[1] + W[1]) / 2];
    const pts = [];
    for (let i = 0; i <= nSeg; i++) { const t = i / nSeg, a = (1 - t) * (1 - t), b = 2 * (1 - t) * t, c = t * t; pts.push([a * S[0] + b * Ec[0] + c * W[0], a * S[1] + b * Ec[1] + c * W[1]]); }
    const L = [], R = [];
    for (let i = 0; i <= nSeg; i++) {
      const p0 = pts[Math.max(0, i - 1)], p1 = pts[Math.min(nSeg, i + 1)];
      let tx = p1[0] - p0[0], ty = p1[1] - p0[1]; const m = Math.hypot(tx, ty) || 1; tx /= m; ty /= m;
      const w = lerp(w0, w1, i / nSeg) / 2; L.push([pts[i][0] - ty * w, pts[i][1] + tx * w]); R.push([pts[i][0] + ty * w, pts[i][1] - tx * w]);
    }
    const poly = L.concat(R.reverse()); let d = 'M' + f(poly[0][0]) + ',' + f(poly[0][1]);
    for (let i = 1; i < poly.length; i++) d += 'L' + f(poly[i][0]) + ',' + f(poly[i][1]);
    return { d: d + 'Z', pts };
  }
  const path = (d, fill, stroke = NAVY, sw = OL, extra = '') => `<path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round" stroke-linecap="round" ${extra}/>`;
  const ell = (cx, cy, rx, ry, fill, stroke = NAVY, sw = OL, extra = '') => `<ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${rx}" ry="${ry}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" ${extra}/>`;

  // ---------- mão ----------
  function hand(c, p, ang, g, side) {
    const sk = c.skin, dk = shade(c.skin, -0.18);
    let s = `<g transform="translate(${f(p[0])},${f(p[1])}) rotate(${f(ang)})">`;
    if (g === 'fist' || g === 'grip') {
      s += ell(2, 0, 14, 13, sk) + `<path d="M-3,-7 Q4,-9 9,-5 M-4,0 Q4,-2 10,2" stroke="${dk}" stroke-width="2.4" fill="none" stroke-linecap="round"/>`;
    } else if (g === 'pinch') {
      s += ell(2, 1, 13.5, 12.5, sk) + path('M7,-6 Q16,-12 21,-9 Q15,-6 10,-3Z', sk, NAVY, 3) + path('M8,5 Q17,10 21,6 Q15,3 10,1Z', sk, NAVY, 3);
    } else {
      s += ell(3, 0, 14.5, 12.5, sk) + path('M-2,-9 Q3,-22 13,-14 Q9,-7 3,-3Z', sk, NAVY, 3.2);
    }
    return s + '</g>';
  }

  // ---------- rosto ----------
  function face(c, e, turn, look, uid) {
    const W = c.W, H = c.H, sk = c.skin;
    const k = 1 - 0.22 * Math.abs(turn), ox = turn * 17;
    const ex = 25 * k, ey = 6, rx = 16.5, ry = 19.5;
    let s = '';
    const eye = (sgn, far) => {
      const cx = sgn * ex + ox, sc = far ? 1 - 0.28 * Math.abs(turn) : 1;
      let g = `<g transform="translate(${f(cx)},${ey}) scale(${f(sc)},1)">`;
      if (e.arc > 0.5) {
        g += `<path d="M${-rx + 2},4 Q0,${-ry * 0.95} ${rx - 2},4" fill="none" stroke="${NAVY}" stroke-width="5" stroke-linecap="round"/>`;
      } else {
        const id = `ec${uid}${sgn > 0 ? 'R' : 'L'}`;
        g += `<clipPath id="${id}"><ellipse cx="0" cy="0" rx="${rx}" ry="${ry}"/></clipPath>`;
        g += ell(0, 0, rx, ry, '#ffffff', NAVY, 2.6);
        const lx = clamp(look[0], -1, 1) * 6.2 + turn * 4, ly = clamp(look[1], -1, 1) * 7.5;
        const ir = 8.6 * e.pup + 0.4;
        g += `<g clip-path="url(#${id})">` + `<circle cx="${f(lx)}" cy="${f(ly + 1)}" r="${f(ir)}" fill="#2a1a18"/><circle cx="${f(lx + 2.6)}" cy="${f(ly - 3)}" r="2.9" fill="#fff"/><circle cx="${f(lx - 3)}" cy="${f(ly + 4)}" r="1.4" fill="#fff" opacity=".8"/>`;
        const lt = clamp(e.lid, 0, 0.95);
        if (lt > 0.02) { const y = -ry + lt * 2 * ry; g += `<path d="M${-rx - 3},${-ry - 4} L${rx + 3},${-ry - 4} L${rx + 3},${f(y)} Q0,${f(y + 5 * (1 - lt))} ${-rx - 3},${f(y)}Z" fill="${sk}"/><path d="M${-rx - 1},${f(y)} Q0,${f(y + 4.5 * (1 - lt))} ${rx + 1},${f(y)}" fill="none" stroke="${NAVY}" stroke-width="3" stroke-linecap="round"/>`; }
        const lb = clamp(e.lidB, 0, 0.8);
        if (lb > 0.02) { const y = ry - lb * ry * 1.1; g += `<path d="M${-rx - 3},${ry + 4} L${rx + 3},${ry + 4} L${rx + 3},${f(y)} Q0,${f(y - 6 * lb)} ${-rx - 3},${f(y)}Z" fill="${sk}"/><path d="M${-rx},${f(y)} Q0,${f(y - 6 * lb)} ${rx},${f(y)}" fill="none" stroke="${NAVY}" stroke-width="2.4" stroke-linecap="round"/>`; }
        g += '</g>';
      }
      g += '</g>';
      // sobrancelha
      const by = ey - ry - 10 + e.browY, ang = (e.browA + (sgn > 0 ? e.brow2 : -e.brow2)) * (sgn > 0 ? -1 : 1);
      g += `<g transform="translate(${f(cx)},${f(by)}) rotate(${f(ang)})"><path d="M${-13 * sc},1.5 Q0,${-5.5} ${13 * sc},1.5" fill="none" stroke="${c.brow}" stroke-width="6.8" stroke-linecap="round"/></g>`;
      return g;
    };
    // olho distante primeiro quando virado
    const farSide = turn > 0.05 ? -1 : (turn < -0.05 ? 1 : 0);
    s += eye(-1, farSide === -1) + eye(1, farSide === 1);
    // bochechas
    if (e.blush > 0.02) s += ell(-39 * k + ox, 30, 11, 7, '#e8776c', 'none', 0, `opacity="${f(e.blush * 0.55)}"`) + ell(39 * k + ox, 30, 11, 7, '#e8776c', 'none', 0, `opacity="${f(e.blush * 0.55)}"`);
    // nariz
    const ny = 25 - e.nose * 3;
    s += `<path d="M${-4 + ox},${ny} Q${ox},${ny + 6 + e.nose * 2} ${5 + ox},${ny}" fill="none" stroke="${shade(sk, -0.38)}" stroke-width="3.2" stroke-linecap="round"/>`;
    if (e.nose > 0.3) s += `<path d="M${-16 + ox},${ny - 3} q4,-3 8,0 M${8 + ox},${ny - 3} q4,-3 8,0" stroke="${shade(sk, -0.4)}" stroke-width="2" fill="none" stroke-linecap="round"/>`;
    // boca
    const mw = e.mw * k, my = 45, mx = ox * 0.9;
    if (e.mround > 0.4) {
      s += ell(mx, my + 2, 6 + e.mround * 2.5, 8 + e.mround * 3, '#6a2a2e', NAVY, 2.8);
    } else if (e.mo > 0.08) {
      const o = e.mo * 13, cu = e.mc * 7;
      s += `<path d="M${-mw + mx},${my} Q${mx},${my + cu - 2} ${mw + mx},${my} Q${mx},${my + o + cu + 6} ${-mw + mx},${my}Z" fill="#6a2a2e" stroke="${NAVY}" stroke-width="2.8" stroke-linejoin="round"/>`;
      if (e.mo > 0.35) s += `<path d="M${-mw * 0.7 + mx},${my + 1.5} Q${mx},${my + cu * 0.5 + 1} ${mw * 0.7 + mx},${my + 1.5} L${mw * 0.62 + mx},${my + 6} Q${mx},${my + cu * 0.5 + 6} ${-mw * 0.62 + mx},${my + 6}Z" fill="#fff" opacity=".95"/>`;
    } else {
      s += `<path d="M${-mw + mx},${my} Q${mx},${my + e.mc * 15} ${mw + mx},${my}" fill="none" stroke="${NAVY}" stroke-width="3.4" stroke-linecap="round"/>`;
    }
    if (e.sweat) s += `<path d="M${W * 0.78},-18 q-7,14 0,17 q7,-3 0,-17Z" fill="#bfe6ff" stroke="${NAVY}" stroke-width="2"/>`;
    return s;
  }

  // ---------- cabelo / acessórios ----------
  function headShape(c) {
    const W = c.W, H = c.H;
    return `M0,${-H} C${W * 0.62},${-H} ${W},${-H * 0.55} ${W},${-H * 0.05} C${W},${H * 0.5} ${W * 0.62},${H} 0,${H} C${-W * 0.62},${H} ${-W},${H * 0.5} ${-W},${-H * 0.05} C${-W},${-H * 0.55} ${-W * 0.62},${-H} 0,${-H}Z`;
  }
  function hairBack(c, sway) {
    if (c.style === 'braid') {
      // trança do lado esquerdo do personagem (que cai pelas costas); balanço em graus
      let s = `<g transform="translate(${-c.W * 0.78},${c.H * 0.35}) rotate(${f(sway)})">`;
      const seg = [[0, 0, 12, 15], [-2, 24, 11.5, 14], [-3, 47, 10.5, 13.5], [-2, 69, 9.5, 12.5]];
      s += path(`M-14,-6 Q-26,40 -10,90 Q4,92 12,86 Q14,30 8,-6Z`, c.hair, NAVY, OL);
      seg.forEach(q => { s += `<path d="M${q[0] - 9},${q[1] + 8} Q${q[0]},${q[1] + 18} ${q[0] + 9},${q[1] + 8}" fill="none" stroke="${shade(c.hair, 0.25)}" stroke-width="2.2"/>`; });
      return s + '</g>';
    }
    if (c.style === 'bald') {
      return path(`M${-c.W * 0.96},-4 Q${-c.W * 1.1},${c.H * 0.35} ${-c.W * 0.72},${c.H * 0.45} L${-c.W * 0.8},4Z`, c.hair) + path(`M${c.W * 0.96},-4 Q${c.W * 1.1},${c.H * 0.35} ${c.W * 0.72},${c.H * 0.45} L${c.W * 0.8},4Z`, c.hair);
    }
    return '';
  }
  function ribbonSvg(c, sway) {
    // laço amarelo no fim da trança: SEMPRE desenhado fora da máscara de transparência
    const col = c.ribbon;
    return `<g transform="translate(${-c.W * 0.78},${c.H * 0.35}) rotate(${f(sway)}) translate(-2,90)">` +
      path('M0,0 C-18,-12 -26,-2 -22,10 C-18,18 -6,10 0,0Z', col, NAVY, 3.2) + path('M0,0 C18,-12 26,-2 22,10 C18,18 6,10 0,0Z', col, NAVY, 3.2) +
      ell(0, 0, 6.5, 6.5, shade(col, -0.12), NAVY, 3) + path('M-4,6 L-12,26 L-3,22Z', col, NAVY, 2.8) + path('M4,6 L12,26 L3,22Z', col, NAVY, 2.8) + '</g>';
  }
  function hairFront(c) {
    const W = c.W, H = c.H;
    if (c.style === 'braid') {
      return path(`M${-W - 3},6 C${-W - 8},${-H * 0.85} ${-W * 0.5},${-H - 9} 0,${-H - 7} C${W * 0.5},${-H - 9} ${W + 8},${-H * 0.85} ${W + 3},6 C${W * 0.95},${-H * 0.32} ${W * 0.62},${-H * 0.30} ${W * 0.52},${-H * 0.52} Q${W * 0.3},${-H * 0.2} ${-W * 0.02},${-H * 0.42} Q${-W * 0.38},${-H * 0.22} ${-W * 0.62},${-H * 0.44} Q${-W * 0.9},${-H * 0.2} ${-W - 3},6Z`, c.hair) +
        `<path d="M${W * 0.15},${-H - 3} Q${W * 0.3},${-H * 0.7} ${W * 0.12},${-H * 0.5}" stroke="${shade(c.hair, 0.28)}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
    }
    if (c.style === 'cap') {
      return path(`M${-W - 1},-4 C${-W - 4},${-H * 0.95} ${-W * 0.5},${-H - 12} 0,${-H - 12} C${W * 0.5},${-H - 12} ${W + 4},${-H * 0.95} ${W + 1},-4 Q${W * 0.5},${-H * 0.28} 0,${-H * 0.3} Q${-W * 0.5},${-H * 0.28} ${-W - 1},-4Z`, c.cap) +
        path(`M${-W * 0.1},${-H * 0.32} Q${W * 0.7},${-H * 0.05} ${W * 1.42},${-H * 0.2} Q${W * 1.35},${-H * 0.42} ${W * 0.5},${-H * 0.44}Z`, shade(c.cap, -0.2)) +
        `<path d="M0,${-H - 11} L0,${-H * 0.32}" stroke="${shade(c.cap, -0.3)}" stroke-width="2.4"/>` + ell(0, -H - 12, 5, 5, shade(c.cap, -0.25), NAVY, 2.6);
    }
    if (c.style === 'bald') {
      return `<path d="M${-W * 0.5},${-H * 0.75} Q${-W * 0.15},${-H * 0.95} ${W * 0.15},${-H * 0.92}" stroke="#fff" stroke-width="4.5" fill="none" opacity=".55" stroke-linecap="round"/>`;
    }
    return '';
  }
  function mustache(c, turn) {
    if (!c.mustache) return '';
    const ox = turn * 17, y = 35;
    return path(`M${ox},${y} Q${-14 + ox},${y - 9} ${-27 + ox},${y + 3} Q${-18 + ox},${y + 12} ${ox},${y + 5}Z`, c.mustache, NAVY, 2.8) + path(`M${ox},${y} Q${14 + ox},${y - 9} ${27 + ox},${y + 3} Q${18 + ox},${y + 12} ${ox},${y + 5}Z`, c.mustache, NAVY, 2.8);
  }

  // ---------- tronco ----------
  function torsoSvg(c, br) {
    const sk = c.skin;
    let s = '';
    if (c.torso === 'dress') {
      s += path(`M-36,-150 Q-42,-118 -60,-74 Q0,-62 60,-74 Q42,-118 36,-150 Q0,-162 -36,-150Z`, c.cloth);
      s += path(`M-54,-88 Q0,-76 54,-88 L60,-74 Q0,-62 -60,-74Z`, c.cloth2, NAVY, 3);
      s += path(`M-14,-152 Q0,-134 14,-152`, '#fff', NAVY, 3);
    } else if (c.torso === 'jacket') {
      s += path(`M-40,-152 Q-50,-118 -50,-70 L50,-70 Q50,-118 40,-152 Q0,-164 -40,-152Z`, c.cloth);
      s += `<path d="M0,-156 L0,-72" stroke="${NAVY}" stroke-width="3"/><path d="M-28,-110 L-8,-108 M8,-108 L28,-110" stroke="${c.cloth2}" stroke-width="5" stroke-linecap="round"/>`;
      s += path(`M-14,-153 L0,-136 L14,-153`, '#f3eadb', NAVY, 3);
    } else {
      s += path(`M-38,-152 Q-48,-118 -48,-70 L48,-70 Q48,-118 38,-152 Q0,-164 -38,-152Z`, c.cloth);
      s += `<path d="M0,-156 L0,-72" stroke="${NAVY}" stroke-width="3"/>` + ell(0, -118, 3.2, 3.2, c.cloth2, NAVY, 2) + ell(0, -96, 3.2, 3.2, c.cloth2, NAVY, 2);
      s += path(`M-14,-153 L0,-136 L14,-153`, '#efe6d2', NAVY, 3);
    }
    return s;
  }
  function legSvg(c, hip, foot, kd) {
    const l1 = 34, l2 = 34;
    const r = ik(hip, foot, l1, l2, p => p[0] * kd * 1 + 0);
    const t = tube(hip, r.mid, r.end, 23, 19);
    const pants = c.pants || c.skin, cuff = c.pants ? c.pants : c.sock;
    let s = path(t.d, c.pants || c.skin);
    if (!c.pants) { // meia branca na canela
      const t2 = tube(lerp2(r.mid, r.end, 0.45), lerp2(r.mid, r.end, 0.75), r.end, 19.5, 19.5, 6); s += path(t2.d, c.sock, NAVY, 2.8);
    }
    s += ell(foot[0] + 6, foot[1] - 5, 22, 11, c.shoe, NAVY, 3.4) + `<path d="M${foot[0] - 8},${foot[1] - 8} q8,-6 17,0" stroke="${shade(c.shoe, -0.25)}" stroke-width="2.4" fill="none"/>`;
    return s;
  }
  const lerp2 = (a, b, k) => [lerp(a[0], b[0], k), lerp(a[1], b[1], k)];

  // ---------- personagem completo ----------
  // o = {cast, x, y, s, flip, pose, expr, look:[wx,wy], fade:{R,L,body}, turn, back, t, sway, blink}
  function drawChar(o) {
    const c = CAST[o.cast], uid = ++UID, s = o.s || 1, flip = o.flip || 1, t = o.t || 0;
    const pose = Object.assign({}, POSE0, o.pose || {}), e = Object.assign({}, BASE, o.expr || {});
    const turn = clamp(o.turn !== undefined ? o.turn : pose.headTurn, -1, 1);
    // respiração e microbalanço (movimento contínuo)
    const br = Math.sin(t * 2 * Math.PI / 3.3 + (o.ph || 0)), bob = br * 1.4, sw = Math.sin(t * 1.9 + (o.ph || 0)) * 0.6;
    // piscada automática
    const bp = (t + (o.ph || 0) * 0.7) % 3.7; const bl = bp < 0.14 ? Math.sin(bp / 0.14 * Math.PI) : 0;
    e.lid = clamp(e.lid + bl * (0.95 - e.lid) * (e.arc > 0.5 ? 0 : 1), 0, 0.97);
    // olhar com alvo (world → local)
    let look = [0, 0];
    if (o.look) {
      const hx = o.x + flip * s * 0, hy = o.y + s * (-208 + pose.hipDrop);
      const dx = (o.look[0] - hx) * flip, dy = o.look[1] - hy; const m = Math.max(1, Math.hypot(dx, dy)); look = [dx / m * clamp(m / 90, 0, 1.3), dy / m * clamp(m / 90, 0, 1.3)];
    }
    const hd = pose.hipDrop, hipY = -66 + hd * 0.9;
    const shY = -146 + hd + bob * 0.4;
    const hip = [[-17, hipY], [17, hipY]];
    const fL = pose.fL.slice(), fR = pose.fR.slice();
    const sh = [[-34, shY + 6], [34, shY + 6]];
    const [u, lo, aw] = c.limb;
    const prefL = p => -p[0] * 1.0 + p[1] * 0.35, prefR = p => p[0] * 1.0 + p[1] * 0.35;
    const aL = ik(sh[0], pose.hL, u, lo, prefL), aR = ik(sh[1], pose.hR, u, lo, prefR);
    const tubeArm = (S, ar, side) => {
      const t1 = tube(S, ar.mid, ar.end, aw + 3, aw - 1.5, 14); return t1;
    };
    const tL = tubeArm(sh[0], aL, -1), tR = tubeArm(sh[1], aR, 1);
    const angL = Math.atan2(aL.end[1] - aL.mid[1], aL.end[0] - aL.mid[0]) * 180 / Math.PI, angR = Math.atan2(aR.end[1] - aR.mid[1], aR.end[0] - aR.mid[0]) * 180 / Math.PI;
    const sleeve = (S, ar, tt) => { // manga: trecho inicial do braço com a cor da roupa + punho
      if (c.torso === 'dress') { const m = [lerp(S[0], ar.mid[0], 0.55), lerp(S[1], ar.mid[1], 0.55)]; const sl = tube(S, lerp2(S, m, 0.5), m, aw + 8, aw + 5, 6); return path(sl.d, c.cloth) + ''; }
      const m = [lerp(ar.mid[0], ar.end[0], 0.82), lerp(ar.mid[1], ar.end[1], 0.82)];
      const tt2 = tube(S, ar.mid, m, aw + 5, aw + 1, 14); const cf = tube(lerp2(m, ar.end, -0.1), m, lerp2(m, ar.end, 0.38), aw + 3.5, aw + 3.5, 4);
      return path(tt2.d, c.cloth) + path(cf.d, shade(c.cloth, 0.3), NAVY, 3);
    };
    const armSvg = (S, ar, tt, ang, g) => path(tt.d, c.skin) + sleeve(S, ar, tt) + hand(c, ar.end, ang, g);

    // transform da cabeça
    const hx = 0, hy = -208 + hd + bob, tilt = pose.headTilt + sw * 0.8 + turn * 2;
    const headT = `translate(${hx + pose.lean * 0.9},${f(hy + pose.headDown)}) rotate(${f(tilt)})`;
    const braidSw = (o.braid !== undefined ? o.braid : 0) + sw * 2.2 - pose.lean * 1.2 + (o.sway || 0);

    let main = ell(2, 3, 46, 9, NAVY, 'none', 0, 'opacity=".2"');
    // tronco inclinado
    const body = (inner) => `<g transform="rotate(${f(pose.lean)} 0 ${hipY})">${inner}</g>`;
    // trança atrás
    main += `<g transform="${headT}">${hairBack(c, braidSw)}</g>`;
    if (pose.farBehind) main += armSvg(sh[0], aL, tL, angL, pose.gL);
    main += legSvg(c, hip[0], fL, pose.kd) + legSvg(c, hip[1], fR, pose.kd);
    main += body(`<g transform="translate(0,${f(bob * 0.5)}) scale(1,${f(1 + br * 0.012)})" >${torsoSvg(c, br)}</g>`);
    if (!pose.farBehind) main += armSvg(sh[0], aL, tL, angL, pose.gL);
    main += armSvg(sh[1], aR, tR, angR, pose.gR);
    // cabeça
    let head = '';
    if (!o.back) {
      head += ell(-c.W * 0.97, 5, 11, 13, c.skin) + ell(c.W * 0.97, 5, 11, 13, c.skin);
      head += path(headShape(c), c.skin);
      head += `<g>${face(c, e, turn, look, uid)}${mustache(c, turn)}</g>`;
      head += hairFront(c);
    } else {
      head += path(headShape(c), c.hair) + (c.style === 'cap' ? hairFront(c) : '');
    }
    main += `<g transform="${headT}">${head}</g>`;

    // máscara de transparência (coords locais): avança da ponta da mão para o ombro
    let maskDef = '', maskAttr = '', glassOut = '';
    const fd = o.fade;
    if (fd) {
      const g = '#303030'; let segs = ''; let glass = '';
      const partial = (pts, frac) => { // pts: da mão ao ombro; devolve polilinha cobrindo frac do comprimento
        let tot = 0; const ls = []; for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); ls.push(l); tot += l; }
        let rem = frac * tot, out = [pts[0]]; for (let i = 1; i < pts.length && rem > 0; i++) { const l = ls[i - 1]; if (rem >= l) { out.push(pts[i]); rem -= l; } else { const k = rem / l; out.push([lerp(pts[i - 1][0], pts[i][0], k), lerp(pts[i - 1][1], pts[i][1], k)]); rem = 0; } } return out;
      };
      const glassArm = (seg, tt, end, ang, gk) => { // borda de vidro: contorno claro do braço e da MÃO, recortado à zona transparente
        const mid = seg.length === 2 ? [(seg[0][0] + seg[1][0]) / 2, (seg[0][1] + seg[1][1]) / 2] : seg[1], last = seg[seg.length - 1];
        const cp = tube(seg[0], mid, last, 46, 46, 10).d;
        const cid = 'gc' + uid + (glass.length);
        const gh = hand({ skin: '#cdeff3' }, end, ang, gk || 'mitt', 1).replace(/stroke="#1d2747"/g, 'stroke="#ffffff"').replace(/stroke="#[0-9a-f]{6}"/g, 'stroke="#ffffff"').replace(/fill="#cdeff3"/g, 'fill="#cdeff3" fill-opacity=".32"');
        glass += `<clipPath id="${cid}"><path d="${cp}"/><circle cx="${f(seg[0][0])}" cy="${f(seg[0][1])}" r="26"/><circle cx="${f(last[0])}" cy="${f(last[1])}" r="23"/></clipPath>` +
          `<g clip-path="url(#${cid})"><path d="${tt.d}" fill="#cdeff3" fill-opacity=".26" stroke="#ffffff" stroke-opacity=".85" stroke-width="2.4" stroke-linejoin="round"/></g><g opacity=".9">${gh}</g>`;
        // partículas de vidro se desfazendo na frente da transparência
        for (let k = 0; k < 6; k++) {
          const ph = ((t * 0.55 + k * 0.173) % 1), x = last[0] + Math.sin(k * 2.3 + t * 1.7) * 14, y = last[1] - ph * 34 - 4, r = 1.6 + (k % 3) * 0.9, al = (1 - ph) * 0.9;
          glass += `<path d="M${f(x)},${f(y - r * 2)} L${f(x + r)},${f(y)} L${f(x)},${f(y + r * 2)} L${f(x - r)},${f(y)}Z" fill="#fff" opacity="${f(al)}"/>`;
        }
      };
      const addArm = (ar, S, frac, tt, ang, gk) => { if (frac <= 0) return; const pts = [ar.end, ar.mid, S]; const seg = partial(pts, frac); glassArm(seg, tt, ar.end, ang, gk); segs += `<polyline points="${seg.map(p => f(p[0]) + ',' + f(p[1])).join(' ')}" fill="none" stroke="${g}" stroke-width="44" stroke-linecap="round" stroke-linejoin="round"/>`; };
      addArm(aR, sh[1], fd.R || 0, tR, angR, pose.gR); addArm(aL, sh[0], fd.L || 0, tL, angL, pose.gL);
      if (fd.body) { const r = fd.body * 120, bx = fd.bx !== undefined ? fd.bx : 24; segs += `<defs><radialGradient id="rg${uid}"><stop offset="0.55" stop-color="${g}"/><stop offset="1" stop-color="#fff"/></radialGradient></defs><circle cx="${f(bx)}" cy="${f(shY - 20)}" r="${f(r)}" fill="url(#rg${uid})"/>`; }
      if (fd.all) { segs += `<rect x="-200" y="-420" width="400" height="460" fill="${g}" opacity="${f(fd.all)}"/>`; }
      glassOut = glass;
      maskDef = `<mask id="mk${uid}" maskUnits="userSpaceOnUse" x="-260" y="-460" width="520" height="520"><rect x="-260" y="-460" width="520" height="520" fill="#fff"/>${segs}</mask>`;
      maskAttr = ` mask="url(#mk${uid})"`;
    }
    // elementos sempre opacos (fita, objetos): coordenadas locais
    let top = glassOut;
    if (c.ribbon && !o.back || (c.ribbon && o.back)) top += `<g transform="${headT}">${ribbonSvg(c, braidSw)}</g>`;
    const J = { hipY, shY, hL: aL.end, hR: aR.end, elbL: aL.mid, elbR: aR.mid, angL, angR, head: [hx, hy], sh };
    const svg = `<g transform="translate(${f(o.x)},${f(o.y)}) scale(${f(flip * s)},${f(s)})">${maskDef}<g${maskAttr}>${main}</g>${top}${o.propsFn ? o.propsFn(J) : ''}</g>`;
    return { svg, J };
  }

  // ---------- objetos ----------
  function flute(len = 118, rot = 0) { // flauta doce
    let s = `<g transform="rotate(${rot})">`;
    s += path(`M${-len * 0.1},-5 L${len * 0.9},-5.5 L${len * 0.9},5.5 L${-len * 0.1},5 Z`, '#e8ddc7', NAVY, 3.2);
    s += path(`M${-len * 0.1},-7 L${len * 0.02},-7 L${len * 0.02},7 L${-len * 0.1},7 Z`, '#b8754a', NAVY, 3);
    for (let i = 0; i < 6; i++) s += `<circle cx="${len * (0.18 + i * 0.105)}" cy="0" r="2.6" fill="${NAVY}"/>`;
    s += `<path d="M${len * 0.9},-5.5 q6,5.5 0,11" fill="#b8754a" stroke="${NAVY}" stroke-width="3"/>`;
    return s + '</g>';
  }

  G.CH = { CAST, EXPR, POSE, POSE0, drawChar, flute, path, ell, tube, ik, OL, hand };
})(window);
