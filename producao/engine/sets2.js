// sets2.js — v2: vida e luz nos cenários (decoração animada, oclusão ambiente, brilho, partículas, nuvens, carros, pássaros).
(function (G) {
  const { f, rnd, NAVY, shade } = G.L; const { SETS, R, C, Pth, lg, rg } = G.SETS;
  // sombra projetada no chão (luz vinda da janela/sol baixo): silhueta achatada e inclinada; dir = -1 cai para a esquerda
  G.SETS.castShadow = (x, y, s, dir = -1, op = 0.17, len = 0.6) => `<g transform="translate(${f(x)},${f(y)}) matrix(${s},0,${f(len * dir * s)},${f(-0.13 * s)},0,0)" opacity="${op}"><rect x="-34" y="-150" width="68" height="120" rx="26" fill="${NAVY}"/><circle cx="0" cy="-214" r="58" fill="${NAVY}"/><rect x="-30" y="-40" width="60" height="42" fill="${NAVY}"/></g>`;
  const dust = (t, x0, y0, w, h, n, col = '#fff6d0') => { let s = ''; for (let i = 0; i < n; i++) { const sx = rnd(i * 7.7), sy = rnd(i * 3.3), sp = 0.15 + rnd(i * 1.9) * 0.35, x = x0 + sx * w + Math.sin(t * sp * 2 + i) * 22, y = y0 + (((sy * h - t * 9 * sp * 3) % h) + h) % h, tw = 0.35 + 0.65 * Math.abs(Math.sin(t * 0.9 + i * 1.7)); s += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(1.1 + rnd(i * 5.1) * 2)}" fill="${col}" opacity="${f(tw * 0.75)}"/>`; } return s; };
  const cloud = (x, y, s, col = '#fff6ec') => `<g transform="translate(${f(x)},${f(y)}) scale(${s})" opacity=".92"><ellipse cx="0" cy="0" rx="60" ry="20" fill="${col}"/><ellipse cx="-30" cy="-12" rx="34" ry="22" fill="${col}"/><ellipse cx="20" cy="-18" rx="40" ry="26" fill="${col}"/></g>`;
  const car = (x, y, col, s = 1) => `<g transform="translate(${f(x)},${f(y)}) scale(${s})"><ellipse cx="0" cy="4" rx="86" ry="9" fill="${NAVY}" opacity=".25"/>` + Pth('M-80,-4 L-80,-30 Q-76,-40 -58,-42 L-34,-62 Q-28,-68 -14,-68 L36,-68 Q50,-68 58,-56 L72,-42 Q86,-38 86,-24 L86,-4Z', col, NAVY, 4) + Pth('M-30,-58 L-14,-62 L8,-62 L8,-44 L-44,-44Z', '#cfe9ee', NAVY, 3) + Pth('M16,-62 L38,-62 Q46,-60 52,-48 L52,-44 L16,-44Z', '#cfe9ee', NAVY, 3) + C(-46, -2, 18, '#2c2f42', NAVY, 4) + C(-46, -2, 8, '#aeb3c8', NAVY, 2.5) + C(50, -2, 18, '#2c2f42', NAVY, 4) + C(50, -2, 8, '#aeb3c8', NAVY, 2.5) + R(78, -26, 10, 8, '#ffe9a8', 2, NAVY, 2.5) + '</g>';
  const bird = (x, y, ph, t) => { const w = Math.sin(t * 9 + ph) * 6; return `<path d="M${f(x - 12)},${f(y - w)} Q${f(x - 5)},${f(y - 6 - w)} ${f(x)},${f(y)} Q${f(x + 5)},${f(y - 6 + w)} ${f(x + 12)},${f(y + w)}" fill="none" stroke="#3b3550" stroke-width="2.4" stroke-linecap="round" opacity=".7"/>`; };

  // ---------- SALA ----------
  const sala = SETS.sala, salaFar = sala.far.bind(sala);
  sala.far = t => salaFar(t) + cloud(300 + (t * 7) % 900 - 100, 300, 1.1) + cloud(640 + (t * 4) % 900 - 100, 380, 0.8, '#ffe9dc');
  sala.deco = t => { // cortinas balançando
    const sw = Math.sin(t * 0.9) * 7, sw2 = Math.sin(t * 0.7 + 1) * 6;
    return `<defs>${lg('curt', 0, 300, 0, 650, [[0, '#f0a07c'], [1, '#d9714f']])}</defs>` +
      Pth(`M520,290 L566,290 Q${f(560 + sw)},470 ${f(548 + sw * 1.6)},650 L508,650 Q${f(520 + sw)},470 520,290Z`, 'url(#curt)', NAVY, 4) + `<path d="M536,296 Q${f(534 + sw)},470 ${f(528 + sw * 1.4)},644 M552,296 Q${f(552 + sw)},470 ${f(542 + sw * 1.5)},646" stroke="#c0603f" stroke-width="3" fill="none" opacity=".7"/>` +
      Pth(`M870,290 L824,290 Q${f(830 - sw2)},470 ${f(842 - sw2 * 1.6)},650 L882,650 Q${f(870 - sw2)},470 870,290Z`, 'url(#curt)', NAVY, 4) + `<path d="M856,296 Q${f(858 - sw2)},470 ${f(862 - sw2 * 1.4)},644 M842,296 Q${f(842 - sw2)},470 ${f(848 - sw2 * 1.5)},646" stroke="#c0603f" stroke-width="3" fill="none" opacity=".7"/>` +
      R(500, 282, 396, 14, '#8a5a3a', 6, NAVY, 3.5);
  };
  sala.ao = t => `<defs>${lg('aoW', 0, 600, 0, 700, [[0, '#2a2040', 0], [1, '#2a2040', 0.28]])}${rg('aoF', 0, 0, 1, [[0, '#2a2040', 0.35], [1, '#2a2040', 0]])}</defs>` +
    R(-400, 600, 1700, 100, 'url(#aoW)') + `<ellipse cx="225" cy="742" rx="230" ry="16" fill="#2a2040" opacity=".22"/><ellipse cx="282" cy="728" rx="50" ry="8" fill="#2a2040" opacity=".18"/><ellipse cx="450" cy="880" rx="250" ry="40" fill="#2a2040" opacity=".1"/><ellipse cx="628" cy="872" rx="46" ry="7" fill="#2a2040" opacity=".22"/>`;
  sala.ambient = t => dust(t, 500, 330, 420, 520, 34);
  sala.bloom = t => `<defs>${rg('bl', 695, 450, 330, [[0, '#fff8d2', 0.34], [0.5, '#ffeaa0', 0.10], [1, '#ffe08a', 0]])}</defs><circle cx="695" cy="450" r="330" fill="url(#bl)"/>`;

  // ---------- RUA ----------
  const rua = SETS.rua, ruaFar = rua.far.bind(rua), ruaMid = rua.mid.bind(rua);
  rua.far = t => ruaFar(t) + cloud(100 + (t * 6) % 1800, 300, 1.3) + cloud(700 + (t * 4) % 1800 - 300, 200, 1.0, '#ffe3d6') + cloud(1200 + (t * 5) % 1800 - 500, 350, 0.9, '#ffeee4') + bird(200 + (t * 40) % 1600, 180 + Math.sin(t) * 10, 0, t) + bird(250 + (t * 40) % 1600, 205 + Math.sin(t + 1) * 10, 1.7, t) + bird(300 + (t * 38) % 1600, 170, 3, t);
  rua.deco = t => car(((t * 95 + 300) % 2600) - 500, 930, '#e8795f', 1.05) + car(1900 - ((t * 70 + 900) % 2800), 905, '#5a8fc4', 0.95);
  rua.ao = t => `<defs>${lg('aoR', 0, 790, 0, 850, [[0, '#2a2040', 0.25], [1, '#2a2040', 0]])}</defs>` + R(-200, 785, 1900, 70, 'url(#aoR)') + `<ellipse cx="290" cy="802" rx="160" ry="9" fill="#2a2040" opacity=".25"/><ellipse cx="1100" cy="796" rx="190" ry="8" fill="#2a2040" opacity=".2"/>`;
  rua.ambient = t => dust(t, 0, 300, 1500, 600, 20, '#fff2c0');
  rua.bloom = t => `<defs>${rg('blr', 1050, 560, 380, [[0, '#fff3c0', 0.5], [1, '#ffe39a', 0]])}</defs><circle cx="1050" cy="560" r="380" fill="url(#blr)"/>`;

  // ---------- PADARIA ----------
  const pad = SETS.padaria;
  pad.ao = t => `<defs>${lg('aoP', 0, 700, 0, 740, [[0, '#4a2030', 0], [1, '#4a2030', 0.3]])}</defs>` + R(-200, 690, 1300, 60, 'url(#aoP)');
  pad.ambient = t => { let s = dust(t, 600, 160, 260, 300, 18, '#fff6d0'); for (let k = 0; k < 3; k++) { const x = 90 + k * 150, ph = t * 0.9 + k * 2; s += `<path d="M${x},560 q${f(8 * Math.sin(ph))},-20 ${f(-4 * Math.sin(ph + 1))},-40 q${f(-10 * Math.sin(ph))},-22 ${f(6 * Math.sin(ph + 2))},-44" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity="${f(0.28 + 0.1 * Math.sin(ph))}"/>`; } return s; };
  pad.bloom = t => `<defs>${rg('blp', 735, 300, 300, [[0, '#fff3c0', 0.6], [1, '#ffe39a', 0]])}</defs><circle cx="735" cy="300" r="300" fill="url(#blp)"/>`;

  // ---------- FRENTE ----------
  const fr = SETS.frente;
  fr.ao = t => `<defs>${lg('aoFr', 0, 805, 0, 870, [[0, '#2a2040', 0.28], [1, '#2a2040', 0]])}</defs>` + R(-200, 800, 1900, 70, 'url(#aoFr)');
  fr.ambient = t => dust(t, 0, 300, 1400, 600, 16, '#fff2d6');
  fr.bloom = t => `<defs>${rg('blf', 1200, 250, 400, [[0, '#ffe9d0', 0.35], [1, '#ffe9d0', 0]])}</defs><circle cx="1200" cy="250" r="400" fill="url(#blf)"/>`;
  // ---------- ESTRADA ----------
  const es = SETS.estrada, esFar = es.far.bind(es);
  es.far = t => esFar(t) + cloud(60 + (t * 5) % 900 - 150, 250, 1.1) + cloud(420 + (t * 3) % 900 - 150, 330, 0.8, '#ffe9dc');
  es.ambient = t => { let o = ''; for (let i = 0; i < 16; i++) { const sp = 55 + rnd(i * 2.3) * 70, x = 700 - ((t * sp + rnd(i * 9.1) * 900) % 900), y = 560 + rnd(i * 4.7) * 440 + Math.sin(t * 2.2 + i) * 14, sc = 0.5 + (y - 470) / 600; o += `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(5 * sc)}" ry="${f(2.4 * sc)}" fill="${i % 3 ? '#a9b970' : '#d9a05a'}" opacity=".85" transform="rotate(${f(Math.sin(t * 3 + i) * 50)} ${f(x)} ${f(y)})"/>`; } o += bird(100 + (t * 30) % 700, 220 + Math.sin(t) * 12, 0, t) + bird(150 + (t * 28) % 700, 250, 2, t); return o; };
  es.bloom = t => `<defs>${rg('ble', 288, 470, 300, [[0, '#fff3cf', 0.6], [1, '#ffe6c8', 0]])}</defs><circle cx="288" cy="470" r="300" fill="url(#ble)"/>`;
  // ponteiro dos segundos no relógio da sala
  G.SETS.clockSecond = (cx, cy, r, t) => { const a = (t % 60) * 6 * Math.PI / 180; return `<line x1="${cx}" y1="${cy}" x2="${f(cx + Math.sin(a) * r * 0.82)}" y2="${f(cy - Math.cos(a) * r * 0.82)}" stroke="#d9503f" stroke-width="2.2" stroke-linecap="round"/>`; };
})(window);
