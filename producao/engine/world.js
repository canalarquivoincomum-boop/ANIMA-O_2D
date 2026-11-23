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
      s += R(wx - 7, wy - 7, ww + 14, wh + 14, shade(col, -0.28), 3, NAVY, stroke * 0.8) + R(wx, wy, ww, wh, on ? '#ffcf78' : shade(col, -0.45), 2, NAVY, 2.4);
      if (on) s += `<defs><linearGradient id="wg${Math.round(wx)}_${Math.round(wy)}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff0c0"/><stop offset="1" stop-color="#f0a850"/></linearGradient></defs><rect x="${f(wx)}" y="${f(wy)}" width="${f(ww)}" height="${f(wh)}" fill="url(#wg${Math.round(wx)}_${Math.round(wy)})"/><rect x="${f(wx)}" y="${f(wy)}" width="${f(ww * 0.34)}" height="${f(wh)}" fill="#c9733a" opacity=".55"/><path d="M${f(wx + ww / 2)},${f(wy)} v${f(wh)} M${f(wx)},${f(wy + wh * 0.5)} h${f(ww)}" stroke="#7a4a2a" stroke-width="3"/><path d="M${f(wx - 9)},${f(wy + wh + 8)} h${f(ww + 18)}" stroke="${shade(col, 0.2)}" stroke-width="6" stroke-linecap="round"/>`;
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
  function moto(x, t, spin, o = {}) {            // moto de entregas, olhando para a direita (origem: chão sob o centro); 2,0 m × 1,05 m
    const r = m(0.3), wb = m(1.25); let s = `<g transform="translate(${f(x)},0)">`;
    const wheel = cx => { let w = C(cx, -r, r, '#1b1e34', NAVY, stroke) + C(cx, -r, r * 0.66, '#9aa3c4', NAVY, 3) + C(cx, -r, r * 0.5, '#2a2f4c', null); for (let i = 0; i < 8; i++) { const a = spin + i * Math.PI / 4; w += `<line x1="${f(cx)}" y1="${f(-r)}" x2="${f(cx + Math.cos(a) * r * 0.64)}" y2="${f(-r + Math.sin(a) * r * 0.64)}" stroke="#d3d9ee" stroke-width="2.6" opacity=".85"/>`; } return w + C(cx, -r, 9, '#7a84a8', NAVY, 2.5) + `<path d="M${f(cx - r * 0.9)},${f(-r - 6)} A${f(r * 0.9)},${f(r * 0.9)} 0 0 1 ${f(cx - r * 0.2)},${f(-r - r * 0.9)}" fill="none" stroke="#fff" stroke-width="3.4" opacity=".28" stroke-linecap="round"/>`; };
    s += `<ellipse cx="0" cy="4" rx="${m(1.1)}" ry="12" fill="${NAVY}" opacity=".3"/>`;
    s += wheel(-wb / 2);
    // para-lama traseiro + rabeta
    s += Pth(`M${-wb / 2 - r * 1.05},${-r * 1.1} Q${-wb / 2},${-r * 2.05} ${-wb / 2 + r * 1.1},${-r * 1.15} L${-wb / 2 + r * 1.1},${-r * 1.0} Q${-wb / 2},${-r * 1.82} ${-wb / 2 - r * 1.05},${-r * 0.98}Z`, '#b93d33', NAVY, 3.2);
    s += wheel(wb / 2);
    // garfo, amortecedor, disco, para-lama dianteiro
    s += Pth(`M${wb / 2},${-r} L${wb / 2 - 14},${-m(0.88)}`, 'none', '#6c7496', 10) + Pth(`M${wb / 2 + 7},${-r} L${wb / 2 - 7},${-m(0.88)}`, 'none', '#aab3d4', 4) + C(wb / 2, -r, r * 0.34, 'none', '#d9dff2', 3) + Pth(`M${wb / 2 - r * 0.9},${-r * 1.55} Q${wb / 2},${-r * 2.15} ${wb / 2 + r * 1.0},${-r * 1.5} L${wb / 2 + r * 0.9},${-r * 1.42} Q${wb / 2},${-r * 1.98} ${wb / 2 - r * 0.8},${-r * 1.42}Z`, '#b93d33', NAVY, 3);
    // escapamento + corrente
    s += Pth(`M${-wb * 0.2},${-m(0.4)} Q${-wb * 0.5},${-m(0.3)} ${-wb * 0.5 - m(0.62)},${-m(0.46)}`, 'none', '#757c9c', 9) + Pth(`M${-wb * 0.2},${-m(0.4)} Q${-wb * 0.5},${-m(0.3)} ${-wb * 0.5 - m(0.62)},${-m(0.46)}`, 'none', '#c9d0ea', 3) + `<path d="M${-wb / 2},${-r + 8} L${-wb * 0.12},${-m(0.4)}" stroke="#2a2f4c" stroke-width="3" opacity=".8"/>`;
    // motor e quadro
    s += R(-wb * 0.2, -m(0.5), m(0.6), m(0.36), '#7d84a2', 8, NAVY, 3.2) + R(-wb * 0.1, -m(0.42), m(0.34), 10, '#555d7c', 3) + C(-wb * 0.02, -m(0.3), 12, '#9aa3c4', NAVY, 2.5);
    s += Pth(`M${-wb * 0.38},${-m(0.58)} L${-wb * 0.34},${-m(0.8)} L${wb * 0.2},${-m(0.8)} L${wb * 0.32},${-m(0.64)} L${wb * 0.24},${-m(0.46)} L${-wb * 0.18},${-m(0.42)}Z`, '#c9473d', NAVY, stroke);
    s += `<path d="M${-wb * 0.3},${-m(0.7)} L${wb * 0.22},${-m(0.7)}" stroke="#fff" stroke-width="5" opacity=".35" stroke-linecap="round"/>`;
    // banco
    s += Pth(`M${-wb * 0.5},${-m(0.82)} Q${-wb * 0.1},${-m(0.9)} ${wb * 0.14},${-m(0.8)} L${wb * 0.14},${-m(0.75)} L${-wb * 0.46},${-m(0.75)}Z`, '#26293c', NAVY, 3.2);
    // guidão + espelho + farol
    s += Pth(`M${wb / 2 - 14},${-m(0.88)} L${wb / 2 - 30},${-m(1.02)}`, 'none', '#6c7496', 8) + R(wb / 2 - 44, -m(1.09), 38, 11, '#2c2f42', 5, NAVY, 2.8) + Pth(`M${wb / 2 - 36},${-m(1.09)} L${wb / 2 - 46},${-m(1.3)}`, 'none', '#6c7496', 3.5) + `<ellipse cx="${f(wb / 2 - 50)}" cy="${f(-m(1.34))}" rx="12" ry="7" fill="#aab3d4" stroke="${NAVY}" stroke-width="2.6"/>`;
    s += `<path d="M${f(wb / 2 - 10)},${f(-m(0.9))} L${f(wb / 2 + 16)},${f(-m(0.97))} L${f(wb / 2 + 16)},${f(-m(0.74))} L${f(wb / 2 - 10)},${f(-m(0.78))}Z" fill="#d9503f" stroke="${NAVY}" stroke-width="3"/><ellipse cx="${f(wb / 2 + 14)}" cy="${f(-m(0.85))}" rx="9" ry="14" fill="#fff6cf" stroke="${NAVY}" stroke-width="3"/>`;
    // bagageiro + baú de entregas PRESO (barras da rabeta ao baú)
    const bx0 = -wb / 2 - m(0.5), bx1 = -wb / 2 + m(0.12), by0 = -m(1.22), by1 = -m(0.82);
    s += `<path d="M${-wb * 0.46},${-m(0.78)} L${bx1 - 8},${by1} M${-wb / 2 - r * 0.9},${-r * 1.7} L${bx0 + 12},${by1} M${-wb * 0.5},${-m(0.76)} L${-wb / 2 - r * 0.95},${-r * 1.85}" stroke="#3a3f5e" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M${bx0 - 8},${by1 + 6} L${bx1 + 8},${by1 + 6}" stroke="#3a3f5e" stroke-width="9" stroke-linecap="round"/>`;
    s += R(bx0, by0, bx1 - bx0, by1 - by0, '#e8553d', 9, NAVY, stroke) + R(bx0, by0, bx1 - bx0, 14, '#b9402b', 5, NAVY, 2.8) + `<path d="M${bx0 + 8},${by0 + 24} L${bx1 - 8},${by0 + 24}" stroke="#fff" stroke-width="3" opacity=".25"/><text x="${f((bx0 + bx1) / 2)}" y="${f(by0 + (by1 - by0) * 0.74)}" font-family="Inter" font-weight="800" font-size="34" fill="#fff" text-anchor="middle">ZAP</text>` + R(bx0 + (bx1 - bx0) * 0.42, by0 - 4, (bx1 - bx0) * 0.16, 8, '#8d2f21', 3, NAVY, 2);
    s += `<rect x="${f(-wb / 2 - m(0.58))}" y="${f(-m(0.62))}" width="22" height="14" rx="3" fill="#ff5a4a" stroke="${NAVY}" stroke-width="2.4"/>`;  // lanterna
    if (o.beam) s += `<defs><linearGradient id="beam" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff6cf" stop-opacity=".8"/><stop offset="1" stop-color="#fff6cf" stop-opacity="0"/></linearGradient></defs><path d="M${wb / 2 + 22},${-m(0.88)} L${wb / 2 + m(5.5)},${-m(1.9)} L${wb / 2 + m(5.5)},${m(0.1)}Z" fill="url(#beam)" opacity="${o.beam}"/>`;
    return s + '</g>';
  }
  const trafficLight = (x, col) => `<g transform="translate(${f(x)},0)">${R(-5, -m(3.4), 10, m(3.4), '#3a4160', 2, NAVY, 3)}${R(-14, -m(3.4) - 70, 28, 74, '#23263a', 7, NAVY, 3)}${C(0, -m(3.4) - 52, 8, col === 'r' ? '#ff5a4a' : '#552a2a', NAVY, 2)}${C(0, -m(3.4) - 33, 8, col === 'y' ? '#ffd24a' : '#554a2a', NAVY, 2)}${C(0, -m(3.4) - 14, 8, col === 'g' ? '#5aff8a' : '#2a5538', NAVY, 2)}</g>`;
  G.WORLD = { U, M, m, RIG_H, charScale, depth, building, lampPost, lampGlow, car, moto, trafficLight, stroke };
})(window);
