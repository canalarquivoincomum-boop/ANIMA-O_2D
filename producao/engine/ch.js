// ch.js (v2) — rig de personagem 2D: sombreamento cel + luz de contorno, contorno colorido, vida ociosa (peso, saccades,
// cabeça que conduz o olhar), ciclo de caminhada, movimento secundário, transparência por partes do corpo.
(function (G) {
  const { clamp, lerp, f, shade, mix, blend, noise1, rnd, NAVY } = G.L;
  const OL = 3.8;
  let UID = 0;

  // ---------- elenco ----------
  const CAST = {
    isis: { skin: '#b9774f', hair: '#2a1b1d', cloth: '#4fb3a9', cloth2: '#3b958d', shoe: '#f0e7d8', sock: '#ffffff', W: 62, H: 56, style: 'curly', limb: [34, 32, 19], torso: 'dress', ribbon: '#ffcf33', brow: '#2a1b1d', lash: 1, freckles: 1, nose: 1 },
    genaro: { skin: '#a8683f', hair: '#6d6a6a', cloth: '#e2a53b', cloth2: '#b9802a', pants: '#37466e', shoe: '#3a2b2a', sock: '#d8d2c6', W: 64, H: 54, style: 'cap', limb: [38, 36, 21], torso: 'jacket', cap: '#c9473d', mustache: '#cfcac4', brow: '#4e4a4a', nose: 1.7, wrinkle: 1, stripes: 1 },
    nando: { glove: '#2b2f48', skin: '#8a5a3d', hair: '#1c1618', cloth: '#2f4a8c', cloth2: '#243a70', pants: '#2b2f45', shoe: '#2a2a30', sock: '#2a2a30', W: 54, H: 50, style: 'short', limb: [38, 36, 21], torso: 'jacket', brow: '#1c1618', nose: 1.35, stripes: 1, stubble: 1 },
    cida: { longSleeve: 1, cardigan: 1, skin: '#d8a888', hair: '#ece8e6', cloth: '#b96a7c', cloth2: '#965468', pants: '#6a4f5e', shoe: '#6a4f5e', sock: '#e8e0dc', W: 54, H: 52, style: 'bun', limb: [34, 33, 18], torso: 'dress', brow: '#b8b2ae', nose: 1.3, wrinkle: 1, glasses: 1 },
    alcides: { skin: '#dba783', hair: '#bdb8b2', cloth: '#7e9482', cloth2: '#627868', pants: '#5c6178', shoe: '#4a3f3a', sock: '#d8d2c6', W: 56, H: 58, style: 'bald', limb: [38, 36, 20], torso: 'coat', mustache: '#e8e4de', brow: '#8f8a85', nose: 1.9, wrinkle: 1 }
  };

  // ---------- expressões ----------
  const BASE = { browY: 0, browA: 0, lid: 0.1, lidB: 0, arc: 0, pup: 1, mw: 14, mc: 0.45, mo: 0, mround: 0, blush: 0.35, nose: 0, brow2: 0 };
  const X = o => Object.assign({}, BASE, o);
  const EXPR = {
    neutral: X({}), calm: X({ mc: 0.3, mw: 12 }),
    curious: X({ browY: -5, browA: 7, mc: 0.1, mw: 10, lid: 0.04 }),
    worry: X({ browY: -7, browA: 15, mc: -0.55, mw: 12, pup: 0.9, blush: 0.2 }),
    wince: X({ lid: 0.72, lidB: 0.5, browY: 5, browA: -9, mw: 21, mc: -0.15, mo: 0.55, nose: 1, blush: 0.5 }),
    sheepish: X({ browY: -3, browA: 11, mc: 0.75, mw: 13, blush: 0.7, lid: 0.16 }),
    smile: X({ mc: 1, mw: 17, lidB: 0.15, blush: 0.6 }), happy: X({ arc: 1, mc: 1.1, mw: 19, mo: 0.45, blush: 0.7 }),
    shock: X({ pup: 0.62, browY: -11, browA: 3, mo: 0.75, mround: 0.85, mw: 7, mc: 0, lid: 0 }),
    sad: X({ browA: 16, browY: -3, mc: -0.85, mw: 11, lid: 0.28, blush: 0.15 }),
    resigned: X({ lid: 0.38, browY: 2, browA: 5, mc: -0.12, mw: 10, blush: 0.1 }),
    warm: X({ lid: 0.3, mc: 0.8, mw: 15, blush: 0.55, browA: 4, browY: -1 }),
    focus: X({ lid: 0.2, browY: 2, browA: -4, mc: 0.05, mw: 9 }),
    hope: X({ browY: -8, browA: 9, lid: 0, mc: 0.6, mw: 12, blush: 0.5, pup: 1.1 }),
    realize: X({ browY: -10, browA: 2, lid: 0, pup: 0.75, mo: 0.35, mw: 9, mc: 0.1 })
  };

  // ---------- poses ----------
  const POSE0 = { hipDrop: 0, lean: 0, headTilt: 0, headTurn: 0, headDown: 0, hL: [-34, -86], hR: [34, -86], fL: [-15, 0], fR: [15, 0], kd: 1, gL: 'mitt', gR: 'mitt', sh: 0, farBehind: 0 };
  const P = o => Object.assign({}, POSE0, o);
  const POSE = {
    stand: P({}), relax: P({ hL: [-36, -80], hR: [36, -80], lean: 1 }),
    holdUp: P({ lean: -2, hR: [36, -204], hL: [-30, -100], gR: 'grip', gL: 'mitt', headTilt: -3 }),
    holdOut: P({ lean: -3, hR: [88, -170], hL: [-30, -100], gR: 'grip', gL: 'mitt', headTilt: -2 }),
    inspectOut: P({ lean: 1, hR: [82, -150], hL: [-30, -92], gR: 'mitt', headTilt: -3 }),
    playFlinch: P({ lean: -5, headTilt: -9, headDown: -5, hL: [24, -128], hR: [42, -96], gR: 'grip', gL: 'grip', fL: [-18, 0], fR: [14, 0] }),
    playLow: P({ lean: 1, headTilt: 3, hL: [16, -116], hR: [34, -94], gR: 'grip', gL: 'grip' }),
    hang: P({ hipDrop: 40, hL: [-26, -62], hR: [40, -30], fL: [-6, 0], fR: [34, 0] }),
    sitKnee: P({ hipDrop: 40, hL: [-26, -62], hR: [36, -66], fL: [-6, 0], fR: [34, 0] }),
    inspect: P({ lean: 2, headTilt: -5, hR: [22, -158], hL: [-30, -92], gR: 'mitt', headDown: 3 }),
    play: P({ lean: 2, hL: [26, -123], hR: [43, -92], gR: 'grip', gL: 'grip', headTilt: 4, fL: [-18, 0], fR: [14, 0] }),
    wave: P({ hR: [52, -190], hL: [-34, -80], gR: 'mitt', lean: -1 }),
    pinch: P({ hR: [56, -150], hL: [-30, -84], gR: 'pinch', lean: 0 }),
    sit: P({ hipDrop: 40, hL: [-30, -66], hR: [30, -66], fL: [-6, 0], fR: [34, 0] }),
    sitHand: P({ hipDrop: 40, hL: [-30, -60], hR: [22, -122], fL: [-6, 0], fR: [36, 0], gR: 'mitt' }),
    drive: P({ hipDrop: 40, hL: [-6, -132], hR: [40, -112], fL: [-6, 0], fR: [34, 0], gR: 'grip', gL: 'grip', lean: 3 }),
    // novas (v2)
    crouchWind: P({ lean: 6, headDown: 4, hL: [-28, -70], hR: [30, -74] }),
    reachOut: P({ lean: -4, hR: [96, -150], hL: [-26, -96], gR: 'open' }),
    turnAway: P({ lean: 2, headTurn: -0.5, hL: [-34, -84], hR: [30, -90] }),
    point: P({ hR: [82, -168], gR: 'point', lean: -2 }),
    handsHip: P({ hL: [-44, -96], hR: [44, -96], lean: 0 }),
    ride: P({ hipDrop: 14, lean: 14, headDown: 6, hL: [54, -70], hR: [58, -73], fL: [-6, 0], fR: [8, 0], gL: 'grip', gR: 'grip', farBehind: 1 }),
    hug: P({ lean: 4, hL: [22, -122], hR: [-22, -122], gL: 'fist', gR: 'fist' })
  };

  // ---------- IK / tubo ----------
  function ik(A, B, l1, l2, pref) {
    const dx = B[0] - A[0], dy = B[1] - A[1], d0 = Math.hypot(dx, dy) || 0.001, d = clamp(d0, 4, l1 + l2 - 0.5);
    const ux = dx / d0, uy = dy / d0, a = (l1 * l1 - l2 * l2 + d * d) / (2 * d), h = Math.sqrt(Math.max(l1 * l1 - a * a, 0));
    const C = [[A[0] + ux * a - uy * h, A[1] + uy * a + ux * h], [A[0] + ux * a + uy * h, A[1] + uy * a - ux * h]];
    return { mid: pref(C[0]) >= pref(C[1]) ? C[0] : C[1], end: [A[0] + ux * d, A[1] + uy * d] };
  }
  function tube(S, E, W, w0, w1, nSeg = 14) {
    const Ec = [2 * E[0] - (S[0] + W[0]) / 2, 2 * E[1] - (S[1] + W[1]) / 2], pts = [];
    for (let i = 0; i <= nSeg; i++) { const t = i / nSeg, a = (1 - t) * (1 - t), b = 2 * (1 - t) * t, c = t * t; pts.push([a * S[0] + b * Ec[0] + c * W[0], a * S[1] + b * Ec[1] + c * W[1]]); }
    const L = [], R = [];
    for (let i = 0; i <= nSeg; i++) {
      const p0 = pts[Math.max(0, i - 1)], p1 = pts[Math.min(nSeg, i + 1)]; let tx = p1[0] - p0[0], ty = p1[1] - p0[1]; const m = Math.hypot(tx, ty) || 1; tx /= m; ty /= m;
      const w = lerp(w0, w1, i / nSeg) / 2; L.push([pts[i][0] - ty * w, pts[i][1] + tx * w]); R.push([pts[i][0] + ty * w, pts[i][1] - tx * w]);
    }
    const poly = L.concat(R.reverse()); let d = 'M' + f(poly[0][0]) + ',' + f(poly[0][1]);
    for (let i = 1; i < poly.length; i++) d += 'L' + f(poly[i][0]) + ',' + f(poly[i][1]);
    return { d: d + 'Z', pts };
  }
  const lerp2 = (a, b, k) => [lerp(a[0], b[0], k), lerp(a[1], b[1], k)];
  const path = (d, fill, stroke = NAVY, sw = OL, extra = '') => `<path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round" stroke-linecap="round" ${extra}/>`;
  const ell = (cx, cy, rx, ry, fill, stroke = NAVY, sw = OL, extra = '') => `<ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${rx}" ry="${ry}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" ${extra}/>`;

  // ---------- luz: sombreamento cel (crescente do lado oposto à luz) + luz de contorno (crescente do lado da luz) ----------
  let LT = null;                       // luz local do personagem {ox, oy, rim}
  function lit(d, k, shCol, shOp, rimOp) {
    if (!LT) return '';
    const ox = LT.ox * k, oy = LT.oy * k, id1 = 's' + (++UID), id2 = 'r' + (++UID);
    const box = 'maskUnits="userSpaceOnUse" x="-420" y="-720" width="840" height="900"', R = '<rect x="-420" y="-720" width="840" height="900" fill="#fff"/>';
    let s = `<mask id="${id1}" ${box}>${R}<path d="${d}" transform="translate(${f(ox)},${f(oy)})" fill="#000"/></mask><path d="${d}" fill="${shCol}" opacity="${shOp}" mask="url(#${id1})"/>`;
    if (rimOp > 0) s += `<mask id="${id2}" ${box}>${R}<path d="${d}" transform="translate(${f(-ox * 0.45)},${f(-oy * 0.45)})" fill="#000"/></mask><path d="${d}" fill="${LT.rim}" opacity="${rimOp}" mask="url(#${id2})"/>`;
    return s;
  }
  function olOf(h) { return /^#[0-9a-f]{6}$/i.test(h) ? mix(shade(h, -0.58), NAVY, 0.42) : NAVY; }   // contorno colorido pela cor da peça
  const colorOutlines = s => s.replace(/fill="(#[0-9a-fA-F]{6})"([^<>]*?)stroke="#1d2747"/g, (m, fl, mid) => `fill="${fl}"${mid}stroke="${olOf(fl)}"`);

  // ---------- mão ----------
  function hand(c, p, ang, g) {
    const sk = c.glove || c.skin, dk = shade(sk, c.glove ? 0.25 : -0.3);
    let s = `<g transform="translate(${f(p[0])},${f(p[1])}) rotate(${f(ang)})">`;
    if (g === 'fist' || g === 'grip') s += ell(2, 0, 14, 13, sk) + `<path d="M-4,-8 Q4,-10 10,-5 M-5,-2 Q4,-4 11,1 M-4,4 Q4,3 10,7" stroke="${dk}" stroke-width="2.4" fill="none" stroke-linecap="round"/>` + path('M-6,-10 Q2,-17 11,-11 Q6,-7 -2,-6Z', sk, NAVY, 3);
    else if (g === 'pinch') s += ell(2, 1, 13.5, 12.5, sk) + path('M7,-6 Q16,-12 21,-9 Q15,-6 10,-3Z', sk, NAVY, 3) + path('M8,5 Q17,10 21,6 Q15,3 10,1Z', sk, NAVY, 3);
    else if (g === 'point') s += ell(0, 2, 12, 11, sk) + path('M6,-3 L26,-5 Q30,-1 26,3 L6,5Z', sk, NAVY, 3) + `<path d="M-2,-6 Q4,-9 8,-6" stroke="${dk}" stroke-width="2.2" fill="none"/>`;
    else if (g === 'open') s += ell(0, 0, 13, 12, sk) + [-14, -5, 4, 12].map((y, i) => path(`M8,${y} Q18,${y - 3 + i * 0.8} 24,${y - 1 + i * 1.6} Q19,${y + 4} 8,${y + 4}Z`, sk, NAVY, 2.8)).join('') + path('M-4,-10 Q2,-22 12,-14 Q8,-8 0,-4Z', sk, NAVY, 3);
    else s += ell(3, 0, 14.5, 12.5, sk) + path('M-2,-9 Q3,-22 13,-14 Q9,-7 3,-3Z', sk, NAVY, 3.2) + `<path d="M12,-4 q5,2 6,8 M9,3 q5,2 6,8" stroke="${dk}" stroke-width="2.2" fill="none" stroke-linecap="round"/>`;
    return s + '</g>';
  }

  // ---------- rosto ----------
  function face(c, e, turn, look, uid) {
    const W = c.W, H = c.H, sk = c.skin, k = 1 - 0.22 * Math.abs(turn), ox = turn * 17, ex = 25 * k, ey = 6, rx = 16.5, ry = 19.5;
    let s = '';
    const eye = (sgn, far) => {
      const cx = sgn * ex + ox, sc = far ? 1 - 0.28 * Math.abs(turn) : 1;
      let g = `<g transform="translate(${f(cx)},${ey}) scale(${f(sc)},1)">`;
      if (e.arc > 0.5) g += `<path d="M${-rx + 2},4 Q0,${-ry * 0.95} ${rx - 2},4" fill="none" stroke="${NAVY}" stroke-width="5" stroke-linecap="round"/>`;
      else {
        const id = `ec${uid}${sgn > 0 ? 'R' : 'L'}`;
        g += `<clipPath id="${id}"><ellipse cx="0" cy="0" rx="${rx}" ry="${ry}"/></clipPath>` + ell(0, 0, rx, ry, '#ffffff', NAVY, 2.6);
        const lx = clamp(look[0], -1, 1) * 6.2 + turn * 4, ly = clamp(look[1], -1, 1) * 7.5, ir = 8.6 * e.pup + 0.4;
        g += `<g clip-path="url(#${id})"><circle cx="${f(lx)}" cy="${f(ly + 1)}" r="${f(ir)}" fill="#2a1a18"/><ellipse cx="${f(lx)}" cy="${f(ly + 1 + ir * 0.35)}" rx="${f(ir * 0.7)}" ry="${f(ir * 0.45)}" fill="#6b3f2a" opacity=".55"/><circle cx="${f(lx + 2.6)}" cy="${f(ly - 3)}" r="2.9" fill="#fff"/><circle cx="${f(lx - 3)}" cy="${f(ly + 4)}" r="1.4" fill="#fff" opacity=".8"/>`;
        const lt = clamp(e.lid, 0, 0.95);
        if (lt > 0.02) { const y = -ry + lt * 2 * ry; g += `<path d="M${-rx - 3},${-ry - 4} L${rx + 3},${-ry - 4} L${rx + 3},${f(y)} Q0,${f(y + 5 * (1 - lt))} ${-rx - 3},${f(y)}Z" fill="${sk}"/><path d="M${-rx - 1},${f(y)} Q0,${f(y + 4.5 * (1 - lt))} ${rx + 1},${f(y)}" fill="none" stroke="${NAVY}" stroke-width="3" stroke-linecap="round"/>`; }
        const lb = clamp(e.lidB, 0, 0.8);
        if (lb > 0.02) { const y = ry - lb * ry * 1.1; g += `<path d="M${-rx - 3},${ry + 4} L${rx + 3},${ry + 4} L${rx + 3},${f(y)} Q0,${f(y - 6 * lb)} ${-rx - 3},${f(y)}Z" fill="${sk}"/><path d="M${-rx},${f(y)} Q0,${f(y - 6 * lb)} ${rx},${f(y)}" fill="none" stroke="${NAVY}" stroke-width="2.4" stroke-linecap="round"/>`; }
        g += '</g>';
        if (c.lash) g += `<path d="M${sgn * (rx - 3)},${-ry * 0.42} l${sgn * 8},-4.5 M${sgn * (rx - 1)},${-ry * 0.12} l${sgn * 8.5},-1.5 M${sgn * (rx - 5)},${-ry * 0.68} l${sgn * 6.5},-6" stroke="${NAVY}" stroke-width="2.6" stroke-linecap="round" fill="none"/>`;
      }
      g += '</g>';
      const by = ey - ry - 10 + e.browY, ang = (e.browA + (sgn > 0 ? e.brow2 : -e.brow2)) * (sgn > 0 ? -1 : 1);
      g += `<g transform="translate(${f(cx)},${f(by)}) rotate(${f(ang)})"><path d="M${-13 * sc},1.5 Q0,${-5.5} ${13 * sc},1.5" fill="none" stroke="${c.brow}" stroke-width="${c.wrinkle ? 8.4 : 6.8}" stroke-linecap="round"/></g>`;
      return g;
    };
    const farSide = turn > 0.05 ? -1 : (turn < -0.05 ? 1 : 0);
    s += eye(-1, farSide === -1) + eye(1, farSide === 1);
    if (e.blush > 0.02) s += ell(-39 * k + ox, 30, 11, 7, '#e8776c', 'none', 0, `opacity="${f(e.blush * 0.55)}"`) + ell(39 * k + ox, 30, 11, 7, '#e8776c', 'none', 0, `opacity="${f(e.blush * 0.55)}"`);
    if (c.freckles) for (let i = 0; i < 5; i++) s += `<circle cx="${f((i % 2 ? 30 : -32) * k + ox + (i - 2) * 3)}" cy="${f(24 + (i % 3) * 4)}" r="1.5" fill="${shade(sk, -0.3)}" opacity=".7"/>`;
    const ny = 25 - e.nose * 3, nz = c.nose || 1;
    s += nz > 1.3 ? `<path d="M${-5 * nz + ox},${ny + 2} Q${-7 * nz + ox},${ny + 10} ${ox},${ny + 9} Q${7 * nz + ox},${ny + 10} ${5 * nz + ox},${ny + 2} Q${ox},${ny - 6} ${-5 * nz + ox},${ny + 2}Z" fill="${shade(sk, -0.1)}" stroke="${shade(sk, -0.5)}" stroke-width="2.4" stroke-linejoin="round"/>`
      : `<path d="M${-4 + ox},${ny} Q${ox},${ny + 6 + e.nose * 2} ${5 + ox},${ny}" fill="none" stroke="${shade(sk, -0.38)}" stroke-width="3.2" stroke-linecap="round"/>`;
    s += `<path d="M${f(ox + 3)},${f(ny - 12)} q-2,7 1,12" stroke="#fff" stroke-width="2.6" fill="none" opacity=".26" stroke-linecap="round"/><path d="M${f(-ex + ox - 12)},${ey + 22} q12,4 24,0 M${f(ex + ox - 12)},${ey + 22} q12,4 24,0" stroke="${shade(sk, -0.3)}" stroke-width="1.9" fill="none" opacity=".55" stroke-linecap="round"/><path d="M${f(ox - 13)},${H - 5} q13,6 26,0" stroke="${shade(sk, -0.3)}" stroke-width="2.2" fill="none" opacity=".4" stroke-linecap="round"/>`;
    if (e.nose > 0.3) s += `<path d="M${-16 + ox},${ny - 3} q4,-3 8,0 M${8 + ox},${ny - 3} q4,-3 8,0" stroke="${shade(sk, -0.4)}" stroke-width="2" fill="none" stroke-linecap="round"/>`;
    if (c.glasses) s += `<g fill="none" stroke="#5a4a52" stroke-width="3.2"><ellipse cx="${f(-ex + ox)}" cy="${ey}" rx="21" ry="23"/><ellipse cx="${f(ex + ox)}" cy="${ey}" rx="21" ry="23"/><path d="M${f(-ex + ox + 21)},${ey - 2} Q${ox},${ey - 8} ${f(ex + ox - 21)},${ey - 2}"/></g><ellipse cx="${f(-ex + ox - 7)}" cy="${ey - 9}" rx="4" ry="9" fill="#fff" opacity=".18"/>`;
    if (c.stubble) s += `<path d="M${-30 * k + ox},38 Q${ox},${58} ${30 * k + ox},38 Q${ox},${51} ${-30 * k + ox},38Z" fill="${shade(sk, -0.28)}" opacity=".55"/>`;
    if (c.wrinkle) s += `<path d="M${-44 * k + ox},12 q-5,8 0,16 M${44 * k + ox},12 q5,8 0,16" stroke="${shade(sk, -0.35)}" stroke-width="2.2" fill="none" stroke-linecap="round"/>`;
    const mw = e.mw * k, my = 45, mx = ox * 0.9;
    if (e.mround > 0.4) s += ell(mx, my + 2, 6 + e.mround * 2.5, 8 + e.mround * 3, '#6a2a2e', NAVY, 2.8);
    else if (e.mo > 0.08) {
      const o = e.mo * 13, cu = e.mc * 7;
      s += `<path d="M${-mw + mx},${my} Q${mx},${my + cu - 2} ${mw + mx},${my} Q${mx},${my + o + cu + 6} ${-mw + mx},${my}Z" fill="#6a2a2e" stroke="${NAVY}" stroke-width="2.8" stroke-linejoin="round"/>`;
      if (e.mo > 0.35) s += `<path d="M${-mw * 0.7 + mx},${my + 1.5} Q${mx},${my + cu * 0.5 + 1} ${mw * 0.7 + mx},${my + 1.5} L${mw * 0.62 + mx},${my + 6} Q${mx},${my + cu * 0.5 + 6} ${-mw * 0.62 + mx},${my + 6}Z" fill="#fff" opacity=".95"/>`;
    } else s += `<path d="M${-mw + mx},${my} Q${mx},${my + e.mc * 15} ${mw + mx},${my}" fill="none" stroke="${NAVY}" stroke-width="3.4" stroke-linecap="round"/>`;
    return s;
  }

  // ---------- cabelo / acessórios ----------
  const headShape = c => { const W = c.W, H = c.H; return `M0,${-H} C${W * 0.62},${-H} ${W},${-H * 0.55} ${W},${-H * 0.05} C${W},${H * 0.5} ${W * 0.62},${H} 0,${H} C${-W * 0.62},${H} ${-W},${H * 0.5} ${-W},${-H * 0.05} C${-W},${-H * 0.55} ${-W * 0.62},${-H} 0,${-H}Z`; };
  function curlyD(c) { // massa de cabelo volumosa com cachos na borda
    const W = c.W * 1.12, H = c.H * 1.14, n = 9; let d = `M${-W - 2},8`;
    for (let i = 0; i <= n; i++) {
      const a = Math.PI + i / n * Math.PI, x = Math.cos(a) * W, y = Math.sin(a) * H * 0.98 - 4, a2 = Math.PI + (i - 0.5) / n * Math.PI;
      if (i === 0) d += `L${f(x)},${f(y)}`; else { const cx = Math.cos(a2) * (W + 15), cy = Math.sin(a2) * (H + 15) - 4; d += ` Q${f(cx)},${f(cy)} ${f(x)},${f(y)}`; }
    }
    return d + ` L${W + 2},8 Q${W * 0.7},${-H * 0.35} ${W * 0.3},${-H * 0.62} Q${-W * 0.05},${-H * 0.5} ${-W * 0.3},${-H * 0.62} Q${-W * 0.7},${-H * 0.35} ${-W - 2},8Z`;
  }
  function hairBack(c, sway) {
    if (c.style === 'curly') {
      let s = ell(0, -c.H * 0.35, c.W * 1.1, c.H * 0.95, c.hair);
      s += `<g transform="translate(${-c.W * 0.78},${c.H * 0.35}) rotate(${f(sway)})">` + path(`M-14,-6 Q-26,40 -10,90 Q4,92 12,86 Q14,30 8,-6Z`, c.hair, NAVY, OL);
      [[0, 8], [-2, 30], [-3, 52], [-2, 72]].forEach(q => { s += `<path d="M${q[0] - 9},${q[1]} Q${q[0]},${q[1] + 12} ${q[0] + 9},${q[1]}" fill="none" stroke="${shade(c.hair, 0.3)}" stroke-width="2.2"/>`; });
      return s + '</g>';
    }
    if (c.style === 'bald') return path(`M${-c.W * 0.96},-4 Q${-c.W * 1.1},${c.H * 0.35} ${-c.W * 0.72},${c.H * 0.45} L${-c.W * 0.8},4Z`, c.hair) + path(`M${c.W * 0.96},-4 Q${c.W * 1.1},${c.H * 0.35} ${c.W * 0.72},${c.H * 0.45} L${c.W * 0.8},4Z`, c.hair);
    return '';
  }
  function ribbonSvg(c, sway) {
    const col = c.ribbon;
    return `<g transform="translate(${-c.W * 0.78},${c.H * 0.35}) rotate(${f(sway)}) translate(-2,90)">` + path('M0,0 C-18,-12 -26,-2 -22,10 C-18,18 -6,10 0,0Z', col, NAVY, 3.2) + path('M0,0 C18,-12 26,-2 22,10 C18,18 6,10 0,0Z', col, NAVY, 3.2) +
      ell(0, 0, 6.5, 6.5, shade(col, -0.12), NAVY, 3) + path('M-4,6 L-12,26 L-3,22Z', col, NAVY, 2.8) + path('M4,6 L12,26 L3,22Z', col, NAVY, 2.8) + '</g>';
  }
  function hairFront(c) {
    const W = c.W, H = c.H;
    if (c.style === 'curly') { const d = curlyD(c); return path(d, c.hair) + lit(d, 8, shade(c.hair, -0.3), 0.7, 0) + `<path d="M${-W * 0.2},${-H * 1.1} Q${W * 0.3},${-H * 1.05} ${W * 0.55},${-H * 0.6}" stroke="${shade(c.hair, 0.4)}" stroke-width="3.2" fill="none" stroke-linecap="round" opacity=".8"/><path d="M${-W * 0.5},${-H * 0.7} Q${-W * 0.3},${-H * 0.9} ${-W * 0.05},${-H * 0.95}" stroke="${shade(c.hair, 0.3)}" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".6"/>`; }
    if (c.style === 'short') { const d = `M${-W - 2},-2 C${-W - 5},${-H * 0.95} ${-W * 0.5},${-H - 8} 0,${-H - 8} C${W * 0.5},${-H - 8} ${W + 5},${-H * 0.95} ${W + 2},-2 Q${W * 0.9},${-H * 0.42} ${W * 0.4},${-H * 0.55} Q0,${-H * 0.4} ${-W * 0.4},${-H * 0.55} Q${-W * 0.9},${-H * 0.42} ${-W - 2},-2Z`; return path(d, c.hair) + lit(d, 8, shade(c.hair, -0.2), 0.7, 0.3) + `<path d="M${-W * 0.2},${-H - 4} Q${W * 0.3},${-H} ${W * 0.55},${-H * 0.62}" stroke="${shade(c.hair, 0.45)}" stroke-width="3" fill="none" stroke-linecap="round" opacity=".7"/>`; }
    if (c.style === 'bun') { const d = `M${-W - 1},4 C${-W - 4},${-H * 0.9} ${-W * 0.5},${-H - 6} 0,${-H - 6} C${W * 0.5},${-H - 6} ${W + 4},${-H * 0.9} ${W + 1},4 Q${W * 0.8},${-H * 0.5} 0,${-H * 0.62} Q${-W * 0.8},${-H * 0.5} ${-W - 1},4Z`; return ell(0, -H - 20, 22, 18, c.hair) + path(d, c.hair) + lit(d, 8, shade(c.hair, -0.25), 0.6, 0.3); }
    if (c.style === 'cap') {
      const cd = `M${-W - 1},-4 C${-W - 4},${-H * 0.95} ${-W * 0.5},${-H - 12} 0,${-H - 12} C${W * 0.5},${-H - 12} ${W + 4},${-H * 0.95} ${W + 1},-4 Q${W * 0.5},${-H * 0.28} 0,${-H * 0.3} Q${-W * 0.5},${-H * 0.28} ${-W - 1},-4Z`;
      return path(cd, c.cap) + lit(cd, 9, shade(c.cap, -0.3), 0.7, 0.35) +
        path(`M${-W * 0.1},${-H * 0.32} Q${W * 0.7},${-H * 0.05} ${W * 1.42},${-H * 0.2} Q${W * 1.35},${-H * 0.42} ${W * 0.5},${-H * 0.44}Z`, shade(c.cap, -0.2)) +
        `<path d="M0,${-H - 11} L0,${-H * 0.32}" stroke="${shade(c.cap, -0.3)}" stroke-width="2.4"/>` + ell(0, -H - 12, 5, 5, shade(c.cap, -0.25), NAVY, 2.6);
    }
    if (c.style === 'bald') return `<path d="M${-W * 0.5},${-H * 0.75} Q${-W * 0.15},${-H * 0.95} ${W * 0.15},${-H * 0.92}" stroke="#fff" stroke-width="4.5" fill="none" opacity=".55" stroke-linecap="round"/>`;
    return '';
  }
  function mustache(c, turn) {
    if (!c.mustache) return '';
    const ox = turn * 17, y = 35;
    return path(`M${ox},${y} Q${-14 + ox},${y - 9} ${-27 + ox},${y + 3} Q${-18 + ox},${y + 12} ${ox},${y + 5}Z`, c.mustache, NAVY, 2.8) + path(`M${ox},${y} Q${14 + ox},${y - 9} ${27 + ox},${y + 3} Q${18 + ox},${y + 12} ${ox},${y + 5}Z`, c.mustache, NAVY, 2.8);
  }

  // ---------- tronco ----------
  function torsoSvg(c) {
    let s = '', bd;
    if (c.torso === 'dress') {
      bd = `M-36,-150 Q-42,-118 -60,-74 Q0,-62 60,-74 Q42,-118 36,-150 Q0,-162 -36,-150Z`;
      s += path(bd, c.cloth) + lit(bd, 8, c.cloth2, 0.85, 0.3) + path(`M-54,-88 Q0,-76 54,-88 L60,-74 Q0,-62 -60,-74Z`, c.cloth2, NAVY, 3) + path(`M-14,-152 Q0,-134 14,-152`, '#fff', NAVY, 3);
      if (c.cardigan) { s += path(`M-36,-150 Q-42,-118 -50,-80 L-8,-82 L-6,-150Z`, shade(c.cloth, 0.1), NAVY, 2.8) + path(`M36,-150 Q42,-118 50,-80 L8,-82 L6,-150Z`, shade(c.cloth, 0.1), NAVY, 2.8) + [-124, -108, -92].map(y => ell(0, y, 3, 3, '#f3eadb', NAVY, 1.6)).join('') + path(`M-8,-152 Q0,-138 8,-152`, '#f3eadb', NAVY, 2.4); }
      [[-24, -112], [-10, -100], [18, -108], [30, -96], [4, -122]].forEach(p => { s += `<circle cx="${p[0]}" cy="${p[1]}" r="3" fill="${shade(c.cloth, 0.45)}" opacity=".9"/>`; });
    } else if (c.torso === 'jacket') {
      bd = `M-40,-152 Q-50,-118 -50,-70 L50,-70 Q50,-118 40,-152 Q0,-164 -40,-152Z`;
      s += path(bd, c.cloth) + lit(bd, 8, c.cloth2, 0.85, 0.3) + `<path d="M0,-156 L0,-72" stroke="${NAVY}" stroke-width="3"/>`;
      if (c.stripes) s += `<path d="M-48,-104 L48,-104 M-48,-92 L48,-92" stroke="#e9eef2" stroke-width="5" opacity=".9"/><path d="M-48,-104 L48,-104 M-48,-92 L48,-92" stroke="#aab6c2" stroke-width="1.6"/>`;
      s += path(`M-14,-153 L0,-136 L14,-153`, '#f3eadb', NAVY, 3);
      if (c.glove) { // motoboy: gola alta, zíper com puxador, bolso com aba, remendo ZAP, dobras e barra canelada
        s += path(`M-24,-156 Q0,-170 24,-156 L22,-140 Q0,-130 -22,-140Z`, shade(c.cloth, -0.15), NAVY, 3) + `<path d="M0,-134 L0,-72" stroke="#c9d2ee" stroke-width="2.4" stroke-dasharray="3 3"/>` + path(`M-3,-132 l6,0 l0,10 l-6,0Z`, '#c9d2ee', NAVY, 1.8) +
          path(`M-38,-100 L-12,-100 L-12,-82 L-38,-82Z`, shade(c.cloth, -0.1), NAVY, 2.6) + path(`M-38,-100 L-12,-100 L-12,-94 L-38,-94Z`, shade(c.cloth, 0.12), NAVY, 2) + `<rect x="14" y="-128" width="26" height="14" rx="4" fill="#e8553d" stroke="${NAVY}" stroke-width="2"/><text x="27" y="-118" font-family="Inter" font-weight="800" font-size="9" fill="#fff" text-anchor="middle">ZAP</text>` +
          `<path d="M-30,-120 q-10,14 -4,28 M30,-100 q8,10 4,22 M-14,-84 q8,6 16,2" stroke="${shade(c.cloth, -0.3)}" stroke-width="2.2" fill="none" opacity=".6" stroke-linecap="round"/>` + path(`M-48,-76 L48,-76 L46,-68 L-46,-68Z`, shade(c.cloth, -0.2), NAVY, 2.4);
      }
    } else {
      bd = `M-38,-152 Q-48,-118 -48,-70 L48,-70 Q48,-118 38,-152 Q0,-164 -38,-152Z`;
      s += path(bd, c.cloth) + lit(bd, 8, c.cloth2, 0.85, 0.25) + `<path d="M0,-156 L0,-72" stroke="${NAVY}" stroke-width="3"/>` + ell(0, -118, 3.2, 3.2, c.cloth2, NAVY, 2) + ell(0, -96, 3.2, 3.2, c.cloth2, NAVY, 2) + path(`M-14,-153 L0,-136 L14,-153`, '#efe6d2', NAVY, 3);
    }
    return s;
  }
  function neckSvg(c) {
    const sk = c.skin; return `<path d="M-16,-176 L-16,-150 Q0,-142 16,-150 L16,-176Z" fill="${sk}" stroke="${NAVY}" stroke-width="3"/><path d="M-16,-160 Q0,-150 16,-160 L16,-150 Q0,-142 -16,-150Z" fill="${shade(sk, -0.22)}" opacity=".7"/>`;
  }
  function legSvg(c, hip, foot, kd) {
    const r = ik(hip, foot, 34, 34, p => p[0] * kd), t = tube(hip, r.mid, r.end, 23, 19), base = c.pants || c.skin;
    let s = path(t.d, base) + lit(t.d, 6, shade(base, -0.22), 0.8, 0.25);
    if (!c.pants) { const t2 = tube(lerp2(r.mid, r.end, 0.45), lerp2(r.mid, r.end, 0.75), r.end, 19.5, 19.5, 6); s += path(t2.d, c.sock, NAVY, 2.8); }
    s += ell(foot[0] + 6, foot[1] - 5, 22, 11, c.shoe, NAVY, 3.4) + `<path d="M${foot[0] - 8},${foot[1] - 8} q8,-6 17,0" stroke="${shade(c.shoe, -0.25)}" stroke-width="2.4" fill="none"/><ellipse cx="${f(foot[0] + 6)}" cy="${f(foot[1] - 0.5)}" rx="21" ry="3.2" fill="${shade(c.shoe, -0.35)}" opacity=".7"/>`;
    return s;
  }


  // ---------- capacete integral (v4): casco + abertura facial + viseira (1 = levantada, 2 = abaixada) + queixeira ----------
  function helmetSvg(c, mode, turn) {
    const W = c.W, H = c.H, ox = turn * 17, shell = '#d9503f', dk = '#9d2f27', id = 'hm' + (++UID);
    const outer = `M${-W - 13},${H * 0.12} C${-W - 16},${-H * 1.05} ${-W * 0.55},${-H - 30} 0,${-H - 30} C${W * 0.55},${-H - 30} ${W + 16},${-H * 1.05} ${W + 13},${H * 0.12} C${W + 12},${H * 0.62} ${W * 0.7},${H * 0.86} 0,${H * 0.88} C${-W * 0.7},${H * 0.86} ${-W - 12},${H * 0.62} ${-W - 13},${H * 0.12}Z`;
    const hx0 = -W * 0.78 + ox * 0.5, hx1 = W * 0.78 + ox * 0.5, hy0 = -H * 0.62, hy1 = H * 0.46;
    const hole = `M${hx0 + 14},${hy0} L${hx1 - 14},${hy0} Q${hx1},${hy0} ${hx1},${hy0 + 16} L${hx1},${hy1 - 20} Q${hx1},${hy1} ${hx1 - 22},${hy1} L${hx0 + 22},${hy1} Q${hx0},${hy1} ${hx0},${hy1 - 20} L${hx0},${hy0 + 16} Q${hx0},${hy0} ${hx0 + 14},${hy0}Z`;
    let s = `<path fill-rule="evenodd" d="${outer} ${hole}" fill="${shell}" stroke="${NAVY}" stroke-width="${OL}" stroke-linejoin="round"/>`;
    s += lit(outer, 8, dk, 0.55, 0.5);
    s += `<path d="M${-W * 0.1},${-H - 28} Q${W * 0.05},${-H * 0.2} ${-W * 0.05},${hy0 - 4}" stroke="#fff" stroke-width="7" fill="none" opacity=".85" stroke-linecap="round"/>` +           // listra central
         `<path d="M${-W * 0.62},${-H * 0.98} Q${-W * 0.25},${-H - 14} ${W * 0.12},${-H - 14}" stroke="#fff" stroke-width="4.5" fill="none" opacity=".5" stroke-linecap="round"/>` + // brilho do casco
         `<path d="M${hx0 - 4},${hy1 + 6} Q0,${hy1 + 20} ${hx1 + 4},${hy1 + 6}" stroke="${dk}" stroke-width="3" fill="none"/><rect x="${f(-W * 0.34 + ox * 0.5)}" y="${f(hy1 + 12)}" width="${f(W * 0.68)}" height="10" rx="5" fill="${dk}" stroke="${NAVY}" stroke-width="2.4"/>` +  // queixeira + respiro
         `<path d="M${hx0 - 5},${hy1 - 8} Q${hx0 - 12},${H * 0.4} ${-W * 0.5},${H * 0.8}" stroke="#2a2a30" stroke-width="4" fill="none" opacity=".7"/>`;                                                 // jugular
    const glass = `M${hx0 + 6},${hy0 + 4} L${hx1 - 6},${hy0 + 4} L${hx1 - 4},${hy1 - 8} L${hx0 + 4},${hy1 - 8}Z`;
    if (mode === 2) {       // viseira abaixada: vidro escuro com reflexo (olhos levemente visíveis)
      s += `<clipPath id="${id}"><path d="${hole}"/></clipPath><g clip-path="url(#${id})"><path d="${glass}" fill="#111a33" opacity=".80"/><path d="M${hx0 + 10},${hy0 + 10} L${hx0 + 52},${hy0 + 10} L${hx0 + 24},${hy1 - 12} L${hx0 + 6},${hy1 - 12}Z" fill="#9fc4ff" opacity=".22"/><path d="M${hx1 - 40},${hy0 + 10} L${hx1 - 22},${hy0 + 10} L${hx1 - 38},${hy1 - 12} L${hx1 - 52},${hy1 - 12}Z" fill="#9fc4ff" opacity=".12"/></g>` + `<path d="${hole}" fill="none" stroke="${NAVY}" stroke-width="3"/>`;
    } else {                // viseira levantada: lente dobrada sobre a testa
      s += `<path d="${hole}" fill="none" stroke="${NAVY}" stroke-width="3"/><path d="M${hx0 + 4},${hy0 - 2} Q${ox * 0.5},${hy0 - 26} ${hx1 - 4},${hy0 - 2} L${hx1 - 10},${hy0 + 8} Q${ox * 0.5},${hy0 - 12} ${hx0 + 10},${hy0 + 8}Z" fill="#1a2440" stroke="${NAVY}" stroke-width="2.6" opacity=".95"/><path d="M${hx0 + 20},${hy0 - 5} Q${ox * 0.5 - 10},${hy0 - 15} ${ox * 0.5 + 10},${hy0 - 13}" stroke="#9fc4ff" stroke-width="3" fill="none" opacity=".6" stroke-linecap="round"/>`;
    }
    return s;
  }

  // ---------- personagem completo ----------
  function drawChar(o) {
    if (o.helmet === undefined && CAST[o.cast].helmet) o.helmet = CAST[o.cast].helmet;
    const c = CAST[o.cast], uid = ++UID, s = o.s || 1, flip = o.flip || 1, t = o.t || 0, ph = o.ph || 0;
    const pose = Object.assign({}, POSE0, o.pose || {}), e = Object.assign({}, BASE, o.expr || {});
    LT = o.light === null ? null : (o.light ? { ox: o.light.ox * flip, oy: o.light.oy, rim: o.light.rim || '#fff1c8' } : { ox: 1 * flip, oy: -0.7, rim: '#fff1c8' });
    let turn = o.turn !== undefined ? o.turn : pose.headTurn;
    const br = Math.sin(t * 2 * Math.PI / 3.3 + ph), bob = br * 1.6, sw = Math.sin(t * 1.9 + ph) * 0.6;
    const ws = noise1(t * 0.32 + ph, 5), wsx = ws * 3.4 * (o.idle === 0 ? 0 : 1);
    const drift = noise1(t * 0.5 + ph, 6) * 1.6, driftT = noise1(t * 0.4 + ph, 9) * 0.07;
    const sd = Math.floor((t + ph) * 1.25), sacc = [(rnd(sd * 3.1 + ph) * 2 - 1) * 0.28, (rnd(sd * 5.7 + ph) * 2 - 1) * 0.2];
    const bp = (t + ph * 0.7) % 3.7, bq = (t + ph) % 11.3, bl = bp < 0.14 ? Math.sin(bp / 0.14 * Math.PI) : ((bq < 0.1 || (bq > 0.26 && bq < 0.36)) ? 0.9 : 0);
    e.lid = clamp(e.lid + bl * (0.95 - e.lid) * (e.arc > 0.5 ? 0 : 1), 0, 0.97);
    let look = [sacc[0], sacc[1]], headLead = 0;
    if (o.look) {
      const hx0 = o.x, hy0 = o.y + s * (-208 + pose.hipDrop), dx = (o.look[0] - hx0) * flip, dy = o.look[1] - hy0, m = Math.max(1, Math.hypot(dx, dy)), k = clamp(m / 90, 0, 1.3);
      look = [dx / m * k + sacc[0] * 0.4, dy / m * k + sacc[1] * 0.4]; headLead = clamp(dx / 320, -0.4, 0.4);
    }
    turn = clamp(turn + driftT + headLead * 0.45, -1, 1);
    let hipBob = 0; const lean = pose.lean + (o.walk ? 3.5 * (o.walk.amp || 1) : 0);
    const fL = pose.fL.slice(), fR = pose.fR.slice(), hL = pose.hL.slice(), hR = pose.hR.slice();
    if (o.walk) {
      const p = o.walk.ph * 2 * Math.PI, a = o.walk.amp || 1;
      fL[0] = -12 + Math.sin(p) * 24 * a; fL[1] = -Math.max(0, Math.cos(p)) * 15 * a; fR[0] = 12 + Math.sin(p + Math.PI) * 24 * a; fR[1] = -Math.max(0, Math.cos(p + Math.PI)) * 15 * a;
      hipBob = -Math.abs(Math.cos(p)) * 4 * a; hL[0] += Math.sin(p + Math.PI) * 14 * a; hR[0] += Math.sin(p) * 14 * a; hL[1] += Math.cos(p) * 3 * a; hR[1] += -Math.cos(p) * 3 * a;
    }
    hL[0] += Math.sin(t * 1.3 + ph) * 1.6; hL[1] += Math.cos(t * 1.1 + ph) * 1.3; hR[0] += Math.cos(t * 1.2 + ph) * 1.6; hR[1] += Math.sin(t * 1.05 + ph) * 1.3;
    const hd = pose.hipDrop, hipY = -66 + hd * 0.9 + hipBob, shY = -146 + hd + bob * 0.4 + hipBob;
    const hip = [[-17 + wsx, hipY], [17 + wsx, hipY]], sh = [[-34 + wsx, shY + 6], [34 + wsx, shY + 6]];
    const [u, lo, aw] = c.limb, prefL = p => -p[0] + p[1] * 0.35, prefR = p => p[0] + p[1] * 0.35;
    const aL = ik(sh[0], hL, u, lo, prefL), aR = ik(sh[1], hR, u, lo, prefR), tL = tube(sh[0], aL.mid, aL.end, aw + 3, aw - 1.5, 14), tR = tube(sh[1], aR.mid, aR.end, aw + 3, aw - 1.5, 14);
    const angL = Math.atan2(aL.end[1] - aL.mid[1], aL.end[0] - aL.mid[0]) * 180 / Math.PI, angR = Math.atan2(aR.end[1] - aR.mid[1], aR.end[0] - aR.mid[0]) * 180 / Math.PI;
    const armSvg = (S, ar, tt, ang, g) => {
      let a = path(tt.d, c.skin) + lit(tt.d, 5, shade(c.skin, -0.25), 0.8, 0.3);
      if (c.torso === 'dress' && !c.longSleeve) { const m = [lerp(S[0], ar.mid[0], 0.55), lerp(S[1], ar.mid[1], 0.55)], sl = tube(S, lerp2(S, m, 0.5), m, aw + 8, aw + 5, 6); a += path(sl.d, c.cloth) + lit(sl.d, 5, c.cloth2, 0.85, 0.2); }
      else { const m = [lerp(ar.mid[0], ar.end[0], 0.82), lerp(ar.mid[1], ar.end[1], 0.82)], tt2 = tube(S, ar.mid, m, aw + 5, aw + 1, 14), cf = tube(lerp2(m, ar.end, -0.1), m, lerp2(m, ar.end, 0.38), aw + 3.5, aw + 3.5, 4); a += path(tt2.d, c.cloth) + lit(tt2.d, 5, c.cloth2, 0.85, 0.2) + path(cf.d, shade(c.cloth, 0.3), NAVY, 3); }
      return a + hand(c, ar.end, ang, g);
    };
    const lag = o.lag ? Object.assign({}, POSE0, o.lag) : pose;
    const braidSw = (o.braid || 0) + sw * 2.2 - pose.lean * 1.2 - (pose.lean - lag.lean) * 3.4 - (pose.headTilt - lag.headTilt) * 1.7 + (o.sway || 0) + (o.walk ? Math.sin(o.walk.ph * 2 * Math.PI) * 9 : 0);
    const hx = wsx * 1.1, hy = -208 + hd + bob + hipBob, tilt = pose.headTilt + sw * 0.8 + turn * 2 + drift + (pose.lean - lag.lean) * -0.8;
    const headT = `translate(${f(hx + pose.lean * 0.9)},${f(hy + pose.headDown)}) rotate(${f(tilt)})`;
    const sq = o.squash || 0;

    let main = (o.bodyless ? '' : ell(2, 3, 46, 9, NAVY, 'none', 0, 'opacity=".2"')) + `<g transform="scale(${f(1 + sq * 0.5)},${f(1 - sq)})">`;
    main += `<g transform="${headT}">${hairBack(c, braidSw)}</g>`;
    if (!o.bodyless) {
    if (pose.farBehind) main += armSvg(sh[0], aL, tL, angL, pose.gL);
    main += legSvg(c, hip[0], fL, pose.kd) + legSvg(c, hip[1], fR, pose.kd);
    main += `<g transform="rotate(${f(lean)} 0 ${f(hipY)})"><g transform="translate(${f(wsx)},${f(bob * 0.5 + hd * 0.9)}) scale(1,${f(1 + br * 0.012)})">${torsoSvg(c)}${neckSvg(c)}</g></g>`;
    if (!pose.farBehind) main += armSvg(sh[0], aL, tL, angL, pose.gL);
    main += armSvg(sh[1], aR, tR, angR, pose.gR);
    }
    let head = '';
    if (!o.back) {
      const hs = headShape(c);
      head += ell(-c.W * 0.97, 5, 11, 13, c.skin) + ell(c.W * 0.97, 5, 11, 13, c.skin) + ell(-c.W * 0.97, 6, 5, 7.5, shade(c.skin, -0.2), 'none', 0) + ell(c.W * 0.97, 6, 5, 7.5, shade(c.skin, -0.2), 'none', 0) + `<ellipse cx="0" cy="${c.H * 0.92}" rx="${c.W * 0.6}" ry="9" fill="#000" opacity=".16"/>` + path(hs, c.skin) + lit(hs, 9, shade(c.skin, -0.24), 0.78, 0.28);
      head += `<g>${face(c, e, turn, look, uid)}${mustache(c, turn)}</g>` + (o.helmet ? '' : hairFront(c));
      if (o.helmet) { head += helmetSvg(c, o.helmet, turn); }
    } else head += path(headShape(c), c.hair) + ((c.style === 'curly' || c.style === 'cap') ? hairFront(c) : '');
    main += `<g transform="${headT}">${head}</g></g>`;

    let maskDef = '', maskAttr = '', glass = '', glassOut = '';
    const fd = o.fade;
    if (fd) {
      const g = '#303030'; let segs = '';
      const partial = (pts, frac) => { let tot = 0; const ls = []; for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); ls.push(l); tot += l; } let rem = frac * tot; const out = [pts[0]]; for (let i = 1; i < pts.length && rem > 0; i++) { const l = ls[i - 1]; if (rem >= l) { out.push(pts[i]); rem -= l; } else { const k = rem / l; out.push([lerp(pts[i - 1][0], pts[i][0], k), lerp(pts[i - 1][1], pts[i][1], k)]); rem = 0; } } return out; };
      const glassArm = (seg, tt, end, ang, gk) => {
        const mid = seg.length === 2 ? [(seg[0][0] + seg[1][0]) / 2, (seg[0][1] + seg[1][1]) / 2] : seg[1], last = seg[seg.length - 1], cid = 'gc' + uid + glass.length;
        const gh = hand({ skin: '#cdeff3' }, end, ang, gk || 'mitt').replace(/stroke="#1d2747"/g, 'stroke="#ffffff"').replace(/stroke="#[0-9a-f]{6}"/g, 'stroke="#ffffff"').replace(/fill="#cdeff3"/g, 'fill="#cdeff3" fill-opacity=".32"');
        const ghD = gh.replace(/stroke="#ffffff"/g, 'stroke="#2f6f8a" stroke-opacity=".7"').replace(/stroke-width="([0-9.]+)"/g, (m, w) => `stroke-width="${(+w + 1.6).toFixed(1)}"`);
        glass += `<clipPath id="${cid}"><path d="${tube(seg[0], mid, last, 46, 46, 10).d}"/><circle cx="${f(seg[0][0])}" cy="${f(seg[0][1])}" r="26"/><circle cx="${f(last[0])}" cy="${f(last[1])}" r="23"/></clipPath><g clip-path="url(#${cid})"><path d="${tt.d}" fill="#cdeff3" fill-opacity=".30" stroke="#2f6f8a" stroke-opacity=".75" stroke-width="3.6" stroke-linejoin="round"/><path d="${tt.d}" fill="none" stroke="#ffffff" stroke-opacity=".9" stroke-width="1.5" stroke-linejoin="round"/></g><g opacity=".95">${ghD}${gh}</g>`;
        glass += `<circle cx="${f(last[0])}" cy="${f(last[1])}" r="34" fill="url(#glow${uid})" opacity=".55"/>`;
        for (let k = 0; k < 7; k++) { const p = ((t * 0.55 + k * 0.151) % 1), x = last[0] + Math.sin(k * 2.3 + t * 1.7) * 15, y = last[1] - p * 38 - 4, r = 1.6 + (k % 3) * 0.9; glass += `<path d="M${f(x)},${f(y - r * 2)} L${f(x + r)},${f(y)} L${f(x)},${f(y + r * 2)} L${f(x - r)},${f(y)}Z" fill="#fff" opacity="${f((1 - p) * 0.95)}"/>`; }
      };
      const addArm = (ar, S, frac, tt, ang, gk) => { if (frac <= 0) return; const seg = partial([ar.end, ar.mid, S], frac); glassArm(seg, tt, ar.end, ang, gk); segs += `<polyline points="${seg.map(p => f(p[0]) + ',' + f(p[1])).join(' ')}" fill="none" stroke="${g}" stroke-width="44" stroke-linecap="round" stroke-linejoin="round"/>`; };
      addArm(aR, sh[1], fd.R || 0, tR, angR, pose.gR); addArm(aL, sh[0], fd.L || 0, tL, angL, pose.gL);
      if (fd.body) { const r = fd.body * 120, bx = fd.bx !== undefined ? fd.bx : 24; segs += `<defs><radialGradient id="rg${uid}"><stop offset="0.55" stop-color="${g}"/><stop offset="1" stop-color="#fff"/></radialGradient></defs><circle cx="${f(bx)}" cy="${f(shY - 20)}" r="${f(r)}" fill="url(#rg${uid})"/>`; }
      if (fd.all) segs += `<rect x="-200" y="-420" width="400" height="460" fill="${g}" opacity="${f(fd.all)}"/>`;
      glassOut = `<defs><radialGradient id="glow${uid}"><stop offset="0" stop-color="#e8fbff" stop-opacity=".9"/><stop offset="1" stop-color="#bfeaf2" stop-opacity="0"/></radialGradient></defs>` + glass;
      maskDef = `<mask id="mk${uid}" maskUnits="userSpaceOnUse" x="-260" y="-460" width="520" height="520"><rect x="-260" y="-460" width="520" height="520" fill="#fff"/>${segs}</mask>`; maskAttr = ` mask="url(#mk${uid})"`;
    }
    let top = glassOut;
    if (c.ribbon) top += `<g transform="${headT}">${ribbonSvg(c, braidSw)}</g>`;
    const J = { hipY, shY, hL: aL.end, hR: aR.end, elbL: aL.mid, elbR: aR.mid, angL, angR, head: [hx, hy], sh };
    const inner = colorOutlines(`${maskDef}<g${maskAttr}>${main}</g>${top}`);
    return { svg: `<g transform="translate(${f(o.x)},${f(o.y)}) scale(${f(flip * s)},${f(s)})">${inner}${o.propsFn ? o.propsFn(J) : ''}</g>`, J };
  }

  function flute(len = 118, rot = 0) {
    let s = `<g transform="rotate(${rot})">`;
    s += path(`M${-len * 0.1},-5 L${len * 0.9},-5.5 L${len * 0.9},5.5 L${-len * 0.1},5 Z`, '#e8ddc7', NAVY, 3.2) + path(`M${-len * 0.1},-7 L${len * 0.02},-7 L${len * 0.02},7 L${-len * 0.1},7 Z`, '#b8754a', NAVY, 3);
    for (let i = 0; i < 6; i++) s += `<circle cx="${len * (0.18 + i * 0.105)}" cy="0" r="2.6" fill="${NAVY}"/>`;
    s += `<path d="M${len * 0.9},-5.5 q6,5.5 0,11" fill="#b8754a" stroke="${NAVY}" stroke-width="3"/><path d="M${-len * 0.1},-3 L${len * 0.9},-3.4" stroke="#fff" stroke-width="2" opacity=".6"/>`;
    return s + '</g>';
  }

  G.CH = { CAST, EXPR, POSE, POSE0, drawChar, flute, path, ell, tube, ik, OL, hand, lit, olOf, colorOutlines, setLight: l => { LT = l; } };
})(window);
