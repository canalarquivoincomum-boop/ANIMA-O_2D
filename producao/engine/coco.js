// coco.js — Coco, o caracol que escuta: personagem FIXO do canal. Concha em espiral = orelha; olhos em hastes = emoção.
// Barato de animar, muito expressivo: o corpo é hastes + olhos + concha, então a emoção vem da POSTURA das hastes.
(function (G) {
  const { clamp, lerp, f, shade, mix, noise1, rnd, NAVY } = G.L; const { path, ell, tube, lit, colorOutlines, setLight } = G.CH;
  const COCO = { body: '#f3cfa6', belly: '#fbe6cc', shell: '#e9825a', shell2: '#f6b78c', swirl: '#fff0d8', scarf: '#6f86df', blush: '#f08a78' };
  // expressões por POSTURA das hastes (ângulos em graus; + = para a frente), comprimento, pálpebra, boca
  const CE = {
    neutral: { a1: 8, a2: -4, L: 30, lid: 0.1, mc: 0.6, mo: 0, arc: 0, tear: 0, pup: 1, listen: 0 },
    curious: { a1: 24, a2: 4, L: 36, lid: 0.02, mc: 0.2, mo: 0, arc: 0, tear: 0, pup: 1.05, listen: 0 },
    worried: { a1: -16, a2: -26, L: 25, lid: 0.35, mc: -0.5, mo: 0, arc: 0, tear: 0, pup: 0.9, listen: 0 },
    happy: { a1: 16, a2: -10, L: 36, lid: 0.1, mc: 1, mo: 0.35, arc: 1, tear: 0, pup: 1, listen: 0 },
    sad: { a1: -32, a2: -40, L: 20, lid: 0.5, mc: -0.9, mo: 0, arc: 0, tear: 1, pup: 0.95, listen: 0 },
    surprise: { a1: 6, a2: -8, L: 48, lid: 0, mc: 0, mo: 0.9, arc: 0, tear: 0, pup: 0.7, listen: 0 },
    listen: { a1: 10, a2: -74, L: 40, lid: 0.12, mc: 0.4, mo: 0, arc: 0, tear: 0, pup: 1, listen: 1 },
    touched: { a1: 10, a2: -60, L: 34, lid: 0.3, mc: 0.9, mo: 0, arc: 1, tear: 1, pup: 1, listen: 1 }
  };
  function drawCoco(o) {
    const t = o.t || 0, ph = o.ph || 0, s = o.s || 1, flip = o.flip || 1;
    const e = Object.assign({}, CE.neutral, typeof o.expr === 'string' ? CE[o.expr] : (o.expr || {}));
    const light = o.light || { ox: 1, oy: -0.7, rim: '#fff1c8' }; setLight({ ox: light.ox * flip, oy: light.oy, rim: light.rim || '#fff1c8' });
    const br = Math.sin(t * 2.1 + ph) * 0.03, crawl = o.crawl !== undefined ? o.crawl : 0;
    const stretch = 1 + Math.sin(crawl * 2 * Math.PI) * 0.09, sq = 1 - Math.sin(crawl * 2 * Math.PI) * 0.06 + br;
    const bp = (t + ph) % 3.4, bl = bp < 0.13 ? Math.sin(bp / 0.13 * Math.PI) : 0;
    const lid = clamp(e.lid + bl * (0.95 - e.lid) * (e.arc > 0.5 ? 0 : 1), 0, 0.97);
    const lk = o.look || [0.4, -0.1];
    // hastes: posições-base na cabeça; atraso (follow-through) por ruído
    const hx = 50 * stretch, hy = -34 * sq, sway1 = noise1(t * 0.9 + ph, 3) * 5, sway2 = noise1(t * 0.8 + ph, 4) * 5;
    const stalk = (bx, by, ang, L, k) => {
      const a = (ang + (k ? sway2 : sway1)) * Math.PI / 180, tip = [bx + Math.sin(a) * L * 1.1, by - Math.cos(a) * L], mid = [bx + Math.sin(a) * L * 0.4 - 6 * (ang < 0 ? -1 : 1) * 0, by - Math.cos(a) * L * 0.5];
      return { tip, mid, bx, by };
    };
    const s1 = stalk(hx - 17, hy - 12, e.a2 - 4, e.L * (e.listen ? 1.15 : 1), 0), s2 = stalk(hx + 11, hy - 14, e.a1 + 6, e.L, 1);
    const shellC = [-12 * stretch, -64 * sq - 6], shellR = 44;
    let g = `<ellipse cx="0" cy="3" rx="${f(70 * stretch)}" ry="8" fill="${NAVY}" opacity=".2"/>`;
    // rastro de gosma (brilho) quando rasteja
    if (crawl) g += `<path d="M${f(-70 * stretch - 40)},-3 L${f(-70 * stretch)},-3" stroke="#fff" stroke-width="4" opacity=".35" stroke-linecap="round"/>`;
    // corpo (pé) + cabeça
    const body = `M${f(-72 * stretch)},0 Q${f(-80 * stretch)},${f(-14 * sq)} ${f(-50 * stretch)},${f(-22 * sq)} Q${f(0)},${f(-30 * sq)} ${f(30 * stretch)},${f(-30 * sq)} Q${f(62 * stretch)},${f(-34 * sq)} ${f(68 * stretch)},${f(-12 * sq)} Q${f(70 * stretch)},0 ${f(50 * stretch)},0Z`;
    g += path(body, COCO.body) + lit(body, 7, shade(COCO.body, -0.2), 0.8, 0.35) + `<path d="M${f(-60 * stretch)},-3 Q${f(0)},${f(-8 * sq)} ${f(55 * stretch)},-4" stroke="${COCO.belly}" stroke-width="7" fill="none" stroke-linecap="round" opacity=".9"/>`;
    const head = `M${f(hx - 28)},${f(hy + 6)} Q${f(hx - 30)},${f(hy - 30)} ${f(hx)},${f(hy - 30)} Q${f(hx + 30)},${f(hy - 30)} ${f(hx + 28)},${f(hy + 6)} Q${f(hx + 22)},${f(hy + 20)} ${f(hx)},${f(hy + 18)} Q${f(hx - 22)},${f(hy + 20)} ${f(hx - 28)},${f(hy + 6)}Z`;
    // concha (orelha em espiral) — atrás da cabeça
    const sh = `M${f(shellC[0] + shellR)},${f(shellC[1])} A${shellR},${shellR} 0 1 0 ${f(shellC[0] - shellR)},${f(shellC[1])} A${shellR},${shellR * 0.96} 0 0 0 ${f(shellC[0] + shellR)},${f(shellC[1])}Z`;
    g += path(sh, COCO.shell) + lit(sh, 8, shade(COCO.shell, -0.25), 0.8, 0.35);
    let sp = ''; for (let i = 0; i <= 40; i++) { const a = i / 40 * 6.4, r = 4 + i * 0.85; sp += (i ? 'L' : 'M') + f(shellC[0] + Math.cos(a) * r) + ',' + f(shellC[1] + Math.sin(a) * r * 0.96); }
    g += `<path d="${sp}" fill="none" stroke="${COCO.swirl}" stroke-width="5.4" stroke-linecap="round" opacity=".95"/><path d="${sp}" fill="none" stroke="${shade(COCO.shell, -0.4)}" stroke-width="1.6" stroke-linecap="round" opacity=".5" transform="translate(1.5,1.5)"/>`;
    g += `<ellipse cx="${f(shellC[0] - 4)}" cy="${f(shellC[1] - 4)}" rx="9" ry="7" fill="${COCO.shell2}" opacity=".55"/>`;
    g += path(head, COCO.body) + lit(head, 6, shade(COCO.body, -0.2), 0.8, 0.35);
    // cachecol que balança
    const fl = Math.sin(t * 3 + ph) * 4 + (crawl ? 6 : 0);
    g += path(`M${f(hx - 24)},${f(hy + 10)} Q${f(hx)},${f(hy + 24)} ${f(hx + 26)},${f(hy + 10)} L${f(hx + 24)},${f(hy + 22)} Q${f(hx)},${f(hy + 34)} ${f(hx - 22)},${f(hy + 22)}Z`, COCO.scarf, NAVY, 3.2) + path(`M${f(hx - 20)},${f(hy + 24)} q${-14 + fl},12 ${-12 + fl * 1.5},30 q10,-6 18,-6Z`, COCO.scarf, NAVY, 3.2);
    // hastes e olhos
    const eyeAt = (st, k) => {
      const [tx, ty] = st.tip, tb = tube([st.bx, st.by], st.mid, st.tip, 14, 8, 8);
      let o2 = path(tb.d, COCO.body, NAVY, 3);
      const rr = 13.5, id = 'ce' + k + Math.floor(rnd(ph + k) * 1e5);
      o2 += `<g transform="translate(${f(tx)},${f(ty)})">` + `<clipPath id="${id}"><circle r="${rr}"/></clipPath>` + ell(0, 0, rr, rr, '#fff', NAVY, 3);
      if (e.arc > 0.5) o2 += `<path d="M-9,3 Q0,-9 9,3" fill="none" stroke="${NAVY}" stroke-width="4" stroke-linecap="round"/>`;
      else {
        const px = clamp(lk[0], -1, 1) * 5, py = clamp(lk[1], -1, 1) * 5, ir = 5.6 * e.pup + 0.8;
        o2 += `<g clip-path="url(#${id})"><circle cx="${f(px)}" cy="${f(py)}" r="${f(ir)}" fill="#2a1a18"/><circle cx="${f(px + 1.8)}" cy="${f(py - 2)}" r="2.1" fill="#fff"/>`;
        if (lid > 0.02) { const y = -rr + lid * 2 * rr; o2 += `<path d="M-16,-16 L16,-16 L16,${f(y)} Q0,${f(y + 3)} -16,${f(y)}Z" fill="${COCO.body}"/><path d="M-14,${f(y)} Q0,${f(y + 3)} 14,${f(y)}" stroke="${NAVY}" stroke-width="2.4" fill="none" stroke-linecap="round"/>`; }
        o2 += '</g>';
        if (e.tear && k === 0) o2 += `<path d="M6,10 q-6,12 0,15 q6,-3 0,-15Z" fill="#bfe6ff" stroke="${NAVY}" stroke-width="1.8" transform="translate(0,${f(((t * 0.8) % 1) * 12)})"/>`;
      }
      return o2 + '</g>';
    };
    g += eyeAt(s1, 0) + eyeAt(s2, 1);
    // boca e bochecha
    const mx = hx + 12, my = hy + 6;
    g += `<ellipse cx="${f(hx + 4)}" cy="${f(hy + 8)}" rx="9" ry="5.5" fill="${COCO.blush}" opacity=".5"/>`;
    if (e.mo > 0.5) g += ell(mx, my + 2, 5, 6.5, '#6a2a2e', NAVY, 2.4); else g += `<path d="M${f(mx - 8)},${f(my)} Q${f(mx)},${f(my + e.mc * 9)} ${f(mx + 8)},${f(my)}" fill="none" stroke="${NAVY}" stroke-width="3" stroke-linecap="round"/>`;
    // ondas sonoras quando escuta (o gesto-assinatura): arcos viajando até a concha
    if (e.listen > 0.3) for (let i = 0; i < 3; i++) { const p = ((t * 0.9 + i / 3) % 1), r = 20 + p * 48; g += `<path d="M${f(shellC[0] + 6 + r * 0.55)},${f(shellC[1] - r * 0.8)} A${f(r)},${f(r)} 0 0 1 ${f(shellC[0] + 6 + r * 0.55)},${f(shellC[1] + r * 0.8)}" fill="none" stroke="#fff6dc" stroke-width="3" stroke-linecap="round" opacity="${f((1 - p) * 0.8)}"/>`; }
    const inner = colorOutlines(g);
    return `<g transform="translate(${f(o.x)},${f(o.y)}) scale(${f(flip * s)},${f(s)})${o.rot ? ` rotate(${o.rot})` : ''}">${inner}</g>`;
  }
  G.COCO = { drawCoco, CE, COCO };
})(window);
