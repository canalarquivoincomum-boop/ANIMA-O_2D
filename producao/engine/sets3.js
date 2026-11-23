// sets3.js — cenários noturnos do v3, todos dimensionados pela bíblia de escala (world.js).
(function (G) {
  const { f, rnd, noise1, shade, NAVY } = G.L; const { R, C, Pth, lg, rg } = G.SETS; const W = G.WORLD; const { m, M } = W;
  const HY = 560;
  const S = { HY };
  const wrap = (x, period) => ((x % period) + period) % period;
  // rua de lado. scroll em unidades: perto = scroll, médio = scroll*0.78, longe = scroll*0.3 (já embutido aqui; câmera fica fixa nos planos de corrida)
  S.rua = {
    far(scroll, t) {
      let s = `<defs>${lg('skN', 0, -400, 0, 700, [[0, '#0f1330'], [0.55, '#2b2f66'], [1, '#6b5a86']])}${rg('moon', 430, 150, 160, [[0, '#f4f0d8', 1], [1, '#f4f0d8', 0]])}</defs>` + R(-3000, -3000, 7000, 3800, 'url(#skN)') + C(430, 150, 150, 'url(#moon)') + C(430, 150, 34, '#f6f1d4', null);
      for (let i = 0; i < 40; i++) { const sx = (rnd(i * 3.7) * 2400) - 600, sy = rnd(i * 9.1) * 420 - 80; s += `<circle cx="${f(sx)}" cy="${f(sy)}" r="${f(1 + rnd(i) * 1.6)}" fill="#fff" opacity="${f(0.3 + 0.5 * Math.abs(Math.sin(t * 0.8 + i)))}"/>`; }
      const P = 2600, off = scroll * 0.3;                              // silhueta da cidade, longe (escala 0,34)
      for (let k = -1; k < 3; k++) for (let i = 0; i < 9; i++) { const wx = i * 330 + k * P - wrap(off, P) + 40, wM = 8 + (i * 5 % 7), fl = 5 + (i * 3 % 8); s += `<g transform="translate(0,720) scale(0.34)">${W.building(wx / 0.34, wM, fl, '#2c3270', { seed: i + 3, dark: 0.45 })}</g>`; }
      return `<g transform="translate(-167,-297)">${s}</g>`;
    },
    mid(scroll, t) {
      let s = ''; const P = 3600, off = scroll * 0.78;                // fachadas junto à calçada (escala 0,82, chão y=845)
      const defs = [[0, 9, 3, '#46407e'], [1, 7, 2, '#6a4062'], [2, 11, 3, '#2f4f78'], [3, 8, 2, '#6b4d52'], [4, 10, 3, '#35625e']];
      for (let k = -1; k < 2; k++) defs.forEach(([i, wM, fl, col]) => { const wx = i * 760 + k * P - wrap(off, P) + 200; s += `<g transform="translate(0,845) scale(0.82)">${W.building(wx / 0.82, wM, fl, col, { seed: i + 1, ground: 0, dark: 0.52 })}</g>`; });
      return `<g transform="translate(-63.4,-112.6)">${s}</g>`;
    },
    near(scroll, t, o = {}) {
      const y0 = 900; let s = R(-3000, y0, 7000, 1400, '#2e3250') + R(-3000, 846, 7000, 40, '#6d6f93', 0, NAVY, 3) + R(-3000, 880, 7000, 20, '#8a8cb0', 0, NAVY, 3) + R(-3000, 846, 7000, 34, '#5b5d82');
      const P = 1890 * 4, spacing = m(9) * 0.88;
      let lamps = [];
      for (let k = -2; k < 4; k++) lamps.push(k * spacing - wrap(scroll, spacing * 6) + 120 + (k < 0 ? 0 : 0));
      // posta nos pontos reais (período = 6 postes)
      lamps = []; for (let i = -1; i < 9; i++) lamps.push(i * spacing - wrap(scroll, spacing) + 40);
      // faixas de pista
      for (let i = -2; i < 12; i++) { const x = i * 300 - wrap(scroll, 300); s += R(x, 962, 170, 12, '#d9d2b4', 5); }
      s += `<g>${lamps.map(x => W.lampGlow(x, o.glow === undefined ? 1 : o.glow).replace('translate(0,0)', 'translate(0,858) scale(0.88)')).join('')}</g>`;
      lamps.forEach(x => { s += `<g transform="translate(${f(x)},858) scale(0.88)">${W.lampPost(0)}</g>`; });
      const carCols = ['#5aa0c8', '#c97b5a', '#8f96c8', '#7fb08a', '#d1a04a'];
      for (let k = -1; k < 9; k++) { const cx = k * 2350 + 900 - wrap(scroll, 2350 * 1) + (k % 2) * 300; if (o.noCars) break; s += `<g transform="translate(${f(cx)},880) scale(0.93)">${W.car(0, carCols[((k % 5) + 5) % 5])}</g>`; }
      lamps.forEach(x => { const lx = x + m(1.17) * 0.88; s += `<ellipse cx="${f(lx)}" cy="946" rx="16" ry="74" fill="#ffe9a8" opacity=".20"/><ellipse cx="${f(lx)}" cy="912" rx="120" ry="10" fill="#ffe9a8" opacity=".16"/>`; });
      for (let i = 0; i < 6; i++) s += `<rect x="${f(-200 + i * 330 - wrap(scroll * 0.2, 330))}" y="${f(930 + (i % 3) * 22)}" width="${f(120 + i * 12)}" height="3" rx="1.5" fill="#8fa0e8" opacity=".10"/>`;
      S.rua._lamps = lamps; return s;
    }
  };
  // sombra projetada por poste: devolve elipse + clima luminoso para o personagem
  S.shadowFrom = (x, y, widthU, lamps, strength = 1) => {
    let best = null; (lamps || []).forEach(lx => { const lampX = lx + m(1.17) * 0.88, d = x - lampX; if (best === null || Math.abs(d) < Math.abs(best)) best = d; });
    if (best === null) return { svg: '', ox: 1 };
    const away = Math.sign(best) || 1, len = Math.min(1, Math.abs(best) / 700), op = 0.34 * strength * (1 - Math.min(1, Math.abs(best) / 1400));
    return { svg: `<ellipse cx="${f(x + away * widthU * (0.12 + 0.5 * len))}" cy="${f(y + 6)}" rx="${f(widthU * (0.55 + 0.7 * len))}" ry="${f(14 + 6 * len)}" fill="${NAVY}" opacity="${f(op)}"/>`, ox: -away };
  };
  G.SETS3 = S;
})(window);
