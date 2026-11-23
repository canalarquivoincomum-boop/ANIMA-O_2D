// rider.js — corpo de piloto de moto em perfil (coxa, joelho no tanque, tronco inclinado, braços no guidão). A CABEÇA é a do rig (drawChar).
(function (G) {
  const { f, lerp, clamp, shade, NAVY } = G.L; const CH = G.CH; const { ik, tube, path, ell, lit, setLight, colorOutlines, hand, CAST } = CH;
  const c = CAST.nando;
  function riderBody(o) {
    const lean = o.lean || 0, bob = o.bob || 0, crouch = o.crouch || 0;
    setLight(o.light || { ox: 1, oy: -0.8, rim: '#ffe9a8' });
    const HP = [-34, -172 + bob + crouch * 4], Sp = [HP[0] + 28 + 24 * lean, HP[1] - 102 + 8 * lean + crouch * 6];
    const Hc = [Sp[0] + 20 + 10 * lean, Sp[1] - 68 + 4 * lean];
    const G1 = [88, -198], G2 = [82, -200], PEG = [-4, -92], PEG2 = [6, -94];
    const pants = c.pants, boot = '#26262e';
    const leg = (hip, foot, k) => {
      const r = ik(hip, foot, 92, 92, p => p[0] * 1.0 - p[1] * 0.1), th = tube(hip, [lerp(hip[0], r.mid[0], 0.5), lerp(hip[1], r.mid[1], 0.5)], r.mid, 40, 34, 8), sh = tube(r.mid, [lerp(r.mid[0], r.end[0], 0.5), lerp(r.mid[1], r.end[1], 0.5)], r.end, 33, 27, 8);
      let s = path(th.d, shade(pants, k)) + lit(th.d, 6, shade(pants, k - 0.25), 0.75, 0.3) + ell(r.mid[0], r.mid[1], 19, 19, shade(pants, k), NAVY, 3.4) + path(sh.d, shade(pants, k)) + lit(sh.d, 6, shade(pants, k - 0.25), 0.75, 0.3);
      s += `<g transform="translate(${f(r.end[0])},${f(r.end[1])})">` + path(`M-14,-26 L10,-26 L12,-6 Q34,-6 36,6 L36,14 L-18,14 Q-20,-4 -14,-26Z`, boot, NAVY, 3.4) + `<path d="M-14,8 L36,8" stroke="#555a78" stroke-width="3" opacity=".7"/><path d="M-12,-20 L8,-20" stroke="#e8e8ee" stroke-width="2.2" opacity=".5"/></g>`;
      return { svg: s, knee: r.mid };
    };
    const arm = (S, grip, k, glove) => {
      const r = ik(S, grip, 56, 54, p => p[1] - p[0] * 0.25), up = tube(S, [lerp(S[0], r.mid[0], 0.5), lerp(S[1], r.mid[1], 0.5)], r.mid, 34, 29, 8), lo = tube(r.mid, [lerp(r.mid[0], r.end[0], 0.5), lerp(r.mid[1], r.end[1], 0.5)], r.end, 28, 24, 8);
      const ang = Math.atan2(r.end[1] - r.mid[1], r.end[0] - r.mid[0]) * 180 / Math.PI;
      let s = path(up.d, shade(c.cloth, k)) + lit(up.d, 5, c.cloth2, 0.8, 0.25) + ell(r.mid[0], r.mid[1], 15, 15, shade(c.cloth, k), NAVY, 3.2) + path(lo.d, shade(c.cloth, k)) + lit(lo.d, 5, c.cloth2, 0.8, 0.25);
      s += path(tube(lerp2(r.mid, r.end, 0.4), lerp2(r.mid, r.end, 0.45), lerp2(r.mid, r.end, 0.5), 30, 30, 3).d, '#cfd8f0', NAVY, 2.4) + path(tube(lerp2(r.mid, r.end, 0.78), lerp2(r.mid, r.end, 0.82), lerp2(r.mid, r.end, 0.9), 28, 28, 3).d, shade(c.cloth, 0.25), NAVY, 3);
      s += hand(c, r.end, ang, 'grip');
      return { svg: s, elbow: r.mid };
    };
    const lerp2 = (a, b, k) => [lerp(a[0], b[0], k), lerp(a[1], b[1], k)];
    const farLeg = leg([HP[0] + 14, HP[1] + 2], PEG2, -0.22), nearLeg = leg([HP[0] - 4, HP[1] + 6], PEG, 0);
    const farArm = arm([Sp[0] + 14, Sp[1] + 14], G2, -0.22), nearArm = arm([Sp[0] - 2, Sp[1] + 18], G1, 0);
    // tronco: caminho no eixo (quadril→ombro)
    const vx = Sp[0] - HP[0], vy = Sp[1] - HP[1], L = Math.hypot(vx, vy), phi = Math.atan2(vx, -vy) * 180 / Math.PI;
    const bd = `M-42,2 Q-52,${-L * 0.5} -38,${-L + 6} Q0,${-L - 14} 40,${-L + 6} Q54,${-L * 0.5} 44,2 Q0,18 -42,2Z`;
    let torso = `<g transform="translate(${f(HP[0])},${f(HP[1])}) rotate(${f(phi)})">` + path(bd, c.cloth) + lit(bd, 8, c.cloth2, 0.85, 0.4);
    torso += `<path d="M-48,${-L * 0.62} Q0,${-L * 0.62 + 8} 48,${-L * 0.62} L48,${-L * 0.62 + 12} Q0,${-L * 0.62 + 20} -48,${-L * 0.62 + 12}Z" fill="#e9eef2" stroke="#aab6c2" stroke-width="1.6" opacity=".95"/><path d="M-48,${-L * 0.36} Q0,${-L * 0.36 + 8} 48,${-L * 0.36} L48,${-L * 0.36 + 12} Q0,${-L * 0.36 + 20} -48,${-L * 0.36 + 12}Z" fill="#e9eef2" stroke="#aab6c2" stroke-width="1.6" opacity=".95"/>`;
    torso += `<path d="M30,${-L + 8} L28,-4" stroke="#c9d2ee" stroke-width="2.4" stroke-dasharray="3 3"/><rect x="-8" y="${-L * 0.8}" width="26" height="14" rx="4" fill="#e8553d" stroke="${NAVY}" stroke-width="2" transform="rotate(-4)"/><text x="5" y="${-L * 0.8 + 10}" font-family="Inter" font-weight="800" font-size="9" fill="#fff" text-anchor="middle">ZAP</text>`;
    torso += `<path d="M-30,${-L * 0.3} q-8,10 -2,22 M-10,${-L * 0.7} q10,6 4,16 M20,${-L * 0.5} q8,8 2,18" stroke="${c.cloth2}" stroke-width="2.4" fill="none" opacity=".7" stroke-linecap="round"/>`;
    torso += path(`M-40,${-L + 2} Q0,${-L - 22} 40,${-L + 2} L38,${-L + 18} Q0,${-L - 2} -38,${-L + 18}Z`, shade(c.cloth, -0.15), NAVY, 3) + `</g>`;
    return { back: colorOutlines(farLeg.svg + farArm.svg), front: colorOutlines(torso + nearLeg.svg + nearArm.svg), head: Hc, grip: G1 };
  }
  G.RIDER = { riderBody };
})(window);
