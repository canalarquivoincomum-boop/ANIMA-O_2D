// world.js — BÍBLIA DE ESCALA E PERSPECTIVA (v3). Regra: 1 m = 210 unidades na profundidade de referência (y = 900).
// Tudo é desenhado em unidades de "ppm 210" e POSTO por profundidade: escala = (y - HY) / (900 - HY).  Nenhuma escala "no olho".
(function (G) {
  const { f, rnd, noise1, shade, mix, NAVY } = G.L; const { R, C, Pth, lg, rg } = G.SETS;
  const U = 210;                                                    // unidades por metro
  const M = {                                                       // alturas reais (m)
    adult: 1.75, teen: 1.7, elder: 1.58, child: 1.3, car: 1.5, carLen: 4.2, moto: 1.05, motoLen: 2.0, door: 2.1, floor: 3.0,
    lamp: 5.5, curb: 0.15, fence: 1.8, table: 0.75, chair: 0.45, bus: 3.1, plant: 1.2
  };
  const RIG_H = 273;                                                // altura do rig em escala 1 (≈ 1,3 m, criança estilizada)
  const charScale = (heightM) => heightM * U / RIG_H;               // s do personagem para ter heightM metros na profundidade de referência
  const depth = (y, HY, Y0 = 900) => Math.max(0.02, (y - HY) / (Y0 - HY));   // fator de profundidade pela linha do chão
  const m = v => v * U;
  const stroke = 3.8;
  // ---------- peças em metros (desenhadas com origem no chão, centro-x) ----------
  function building(x, wM, floors, col, o = {}) {
    const w = m(wM), h = m(M.floor * floors), seed = (o.seed || 1) + x * 0.013; let s = `<g transform="translate(${f(x)},0)">`;
    s += R(-w / 2, -h, w, h + 700, col, 0, NAVY, stroke) + R(-w / 2 - 10, -h - 22, w + 20, 22, shade(col, -0.18), 0, NAVY, stroke);
    const cols = Math.max(2, Math.round(wM / 3)), ww = m(1.3), wh = m(1.5), gap = (w - cols * ww) / (cols + 1);
    for (let fl = 0; fl < floors; fl++) for (let c = 0; c < cols; c++) {
      const wx = -w / 2 + gap + c * (ww + gap), wy = -h + m(M.floor) * fl + m(0.7), on = rnd(seed * 7 + fl * 3.1 + c * 1.7) > (o.dark || 0.5);
      if (fl === floors - 1 && o.ground) continue;
      s += R(wx, wy, ww, wh, on ? '#ffd88a' : shade(col, -0.35), 3, NAVY, stroke * 0.8);
      if (on) s += `<rect x="${f(wx)}" y="${f(wy)}" width="${f(ww)}" height="${f(wh * 0.5)}" fill="#fff4cc" opacity=".35"/><path d="M${f(wx)},${f(wy + wh)} h${f(ww)}" stroke="${shade(col, -0.4)}" stroke-width="3"/>`;
      else s += `<path d="M${f(wx)},${f(wy + wh * 0.6)} l${f(ww)},${f(-wh * 0.5)}" stroke="#7a86b8" stroke-width="3" opacity=".35"/>`;
      const rr = rnd(seed * 3 + fl * 5.3 + c * 2.9);
      if (rr > 0.78) s += R(wx + ww * 0.2, wy + wh + 6, ww * 0.6, m(0.45), '#b9bfd6', 4, NAVY, 2.4) + `<circle cx="${f(wx + ww * 0.5)}" cy="${f(wy + wh + 6 + m(0.22))}" r="${m(0.15)}" fill="#8a90ac" stroke="${NAVY}" stroke-width="1.8"/>`;
      else if (rr < 0.2) s += `<path d="M${f(wx - 8)},${f(wy + wh + 4)} h${f(ww + 16)} M${f(wx - 8)},${f(wy + wh + 4)} v${f(-m(0.5))} M${f(wx + ww + 8)},${f(wy + wh + 4)} v${f(-m(0.5))}" stroke="#202648" stroke-width="4" fill="none"/>`;
    }
    return s + '</g>';
  }
  function lampPost(x, glow = 1, hOn = 1) {      // poste público 5,5 m, braço para a direita
    const H = m(M.lamp); let s = `<g transform="translate(${f(x)},0)">`;
    s += R(-6, -H, 12, H, '#4d5470', 3, NAVY, stroke) + `<path d="M0,${-H + 8} q0,${-m(0.5)} ${m(1.0)},${-m(0.5)}" fill="none" stroke="#4d5470" stroke-width="12" stroke-linecap="round"/><path d="M0,${-H + 8} q0,${-m(0.5)} ${m(1.0)},${-m(0.5)}" fill="none" stroke="${NAVY}" stroke-width="3.5" stroke-linecap="round" opacity=".5"/>`;
    s += R(m(0.9), -H - m(0.65), m(0.55), 16, '#ffe9a8', 6, NAVY, 3.2);
    return s + '</g>';
  }
  function lampGlow(x, glow = 1) {               // cone/halo + poça de luz no chão (em coordenadas do mundo; chão em y=0)
    const H = m(M.lamp), lx = x + m(1.17), ly = -H - m(0.45);
    return `<g transform="translate(0,0)" opacity="${f(0.9 * glow)}"><defs><radialGradient id="lg${Math.round(x)}" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#fff2b8" stop-opacity=".75"/><stop offset="1" stop-color="#ffd878" stop-opacity="0"/></radialGradient>` +
      `<linearGradient id="lc${Math.round(x)}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe9a8" stop-opacity=".42"/><stop offset="1" stop-color="#ffe9a8" stop-opacity=".02"/></linearGradient></defs>` +
      `<path d="M${f(lx - 14)},${f(ly + 8)} L${f(lx + 14)},${f(ly + 8)} L${f(lx + m(2.6))},0 L${f(lx - m(2.6))},0Z" fill="url(#lc${Math.round(x)})"/><circle cx="${f(lx)}" cy="${f(ly)}" r="${m(1.1)}" fill="url(#lg${Math.round(x)})"/><ellipse cx="${f(lx)}" cy="4" rx="${m(2.7)}" ry="22" fill="#ffe9a8" opacity=".28"/></g>`;
  }
  function car(x, col, o = {}) {                 // sedan/hatch de lado, olhando para a direita; 4,2 m × 1,5 m
    const L = m(M.carLen), H = m(M.car), dir = o.dir || 1; let s = `<g transform="translate(${f(x)},0) scale(${dir},1)">`;
    s += `<ellipse cx="0" cy="6" rx="${f(L * 0.54)}" ry="14" fill="${NAVY}" opacity=".3"/>`;
    s += Pth(`M${-L / 2},${-m(0.35)} L${-L / 2},${-m(0.78)} Q${-L / 2 + 6},${-m(0.92)} ${-L * 0.36},${-m(0.95)} L${-L * 0.24},${-H + 8} Q${-L * 0.2},${-H} ${-L * 0.1},${-H} L${L * 0.12},${-H} Q${L * 0.2},${-H} ${L * 0.26},${-m(1.05)} L${L * 0.38},${-m(0.92)} Q${L / 2},${-m(0.88)} ${L / 2},${-m(0.55)} L${L / 2},${-m(0.35)}Z`, col, NAVY, stroke);
    s += Pth(`M${-L * 0.2},${-H + 26} L${-L * 0.23},${-m(0.98)} L${L * 0.0},${-m(0.98)} L${L * 0.0},${-H + 26}Z`, '#2a3556', NAVY, 3) + Pth(`M${L * 0.04},${-H + 26} L${L * 0.04},${-m(0.98)} L${L * 0.24},${-m(0.98)} L${L * 0.15},${-H + 26}Z`, '#2a3556', NAVY, 3);
    s += `<path d="M${-L * 0.18},${-H + 34} L${-L * 0.02},${-H + 34}" stroke="#7fb0ff" stroke-width="5" opacity=".5" stroke-linecap="round"/><path d="M${-L / 2},${-m(0.62)} L${L / 2},${-m(0.62)}" stroke="${shade(col, -0.3)}" stroke-width="3" opacity=".6"/>` + R(L / 2 - 20, -m(0.7), 18, 22, '#ffe9a8', 5, NAVY, 3) + R(-L / 2, -m(0.7), 12, 20, '#d9503f', 4, NAVY, 3);
    [-L * 0.3, L * 0.3].forEach(wx => { s += C(wx, -m(0.32), m(0.32), '#23263a', NAVY, stroke) + C(wx, -m(0.32), m(0.19), '#aeb3c8', NAVY, 3) + C(wx, -m(0.32), m(0.05), '#6e7390', NAVY, 2.5); });
    return s + '</g>';
  }
  function moto(x, t, spin, o = {}) {            // moto de entregas, olhando para a direita (origem: ground sob o centro)
    const r = m(0.3), wb = m(1.25); let s = `<g transform="translate(${f(x)},0)">`;
    const wheel = cx => { let w = C(cx, -r, r, '#20233a', NAVY, stroke) + C(cx, -r, r * 0.62, '#aab2cf', NAVY, 3); for (let i = 0; i < 6; i++) { const a = spin + i * Math.PI / 3; w += `<line x1="${f(cx)}" y1="${f(-r)}" x2="${f(cx + Math.cos(a) * r * 0.58)}" y2="${f(-r + Math.sin(a) * r * 0.58)}" stroke="#555d7c" stroke-width="3"/>`; } return w + C(cx, -r, 8, '#7a84a8', NAVY, 2.5); };
    s += `<ellipse cx="0" cy="4" rx="${m(1.1)}" ry="12" fill="${NAVY}" opacity=".3"/>`;
    s += wheel(-wb / 2) + wheel(wb / 2);
    s += Pth(`M${wb / 2},${-r} L${wb / 2 - 12},${-m(0.86)}`, 'none', '#6c7496', 9) + Pth(`M${wb / 2 - 10},${-m(0.84)} L${wb / 2 - 2},${-m(0.86)}`, 'none', NAVY, 3);
    s += Pth(`M${-wb / 2 - 10},${-m(0.46)} Q${-wb / 2 - 40},${-m(0.52)} ${-wb / 2 - 52},${-m(0.4)}`, 'none', '#6a6f8a', 7);
    s += Pth(`M${-wb * 0.42},${-m(0.55)} L${-wb * 0.38},${-m(0.78)} L${wb * 0.18},${-m(0.78)} L${wb * 0.3},${-m(0.62)} L${wb * 0.22},${-m(0.4)} L${-wb * 0.2},${-m(0.34)}Z`, '#c9473d', NAVY, stroke);
    s += Pth(`M${-wb * 0.45},${-m(0.82)} Q${-wb * 0.1},${-m(0.9)} ${wb * 0.12},${-m(0.8)} L${wb * 0.12},${-m(0.76)} L${-wb * 0.42},${-m(0.76)}Z`, '#2c2f42', NAVY, 3.2);
    s += R(-wb * 0.16, -m(0.36), m(0.55), m(0.28), '#7d84a2', 6, NAVY, 3) + R(-wb * 0.06, -m(0.3), m(0.35), 8, '#555d7c', 3);
    s += Pth(`M${wb / 2 - 12},${-m(0.86)} L${wb / 2 - 28},${-m(1.0)}`, 'none', '#6c7496', 7) + R(wb / 2 - 42, -m(1.07), 36, 10, '#2c2f42', 4, NAVY, 2.8);
    s += `<ellipse cx="${f(wb / 2 + 8)}" cy="${f(-m(0.84))}" rx="14" ry="12" fill="#fff6cf" stroke="${NAVY}" stroke-width="3"/>`;
    // baú de entregas
    s += R(-wb / 2 - m(0.55), -m(1.12), m(0.52), m(0.42), '#e8553d', 7, NAVY, stroke) + R(-wb / 2 - m(0.55), -m(1.12), m(0.52), 12, '#b9402b', 4, NAVY, 2.8) + `<text x="${f(-wb / 2 - m(0.29))}" y="${f(-m(0.82))}" font-family="Inter" font-weight="800" font-size="30" fill="#fff" text-anchor="middle">ZAP</text>`;
    if (o.beam) s += `<defs><linearGradient id="beam" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff6cf" stop-opacity=".85"/><stop offset="1" stop-color="#fff6cf" stop-opacity="0"/></linearGradient></defs><path d="M${wb / 2 + 20},${-m(0.88)} L${wb / 2 + m(5.5)},${-m(1.9)} L${wb / 2 + m(5.5)},${m(0.1)}Z" fill="url(#beam)" opacity="${o.beam}"/>`;
    return s + '</g>';
  }
  const trafficLight = (x, col) => `<g transform="translate(${f(x)},0)">${R(-5, -m(3.4), 10, m(3.4), '#3a4160', 2, NAVY, 3)}${R(-14, -m(3.4) - 70, 28, 74, '#23263a', 7, NAVY, 3)}${C(0, -m(3.4) - 52, 8, col === 'r' ? '#ff5a4a' : '#552a2a', NAVY, 2)}${C(0, -m(3.4) - 33, 8, col === 'y' ? '#ffd24a' : '#554a2a', NAVY, 2)}${C(0, -m(3.4) - 14, 8, col === 'g' ? '#5aff8a' : '#2a5538', NAVY, 2)}</g>`;
  G.WORLD = { U, M, m, RIG_H, charScale, depth, building, lampPost, lampGlow, car, moto, trafficLight, stroke };
})(window);
