// lib.js — utilidades: matemática, easing, trilhas por keyframe, cores, ruído.
(function (G) {
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, k) => a + (b - a) * k;
  const E = {
    lin: k => k,
    ease: k => k * k * (3 - 2 * k),
    out: k => 1 - Math.pow(1 - k, 3),
    in: k => k * k * k,
    io: k => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2),
    back: k => { const c = 1.70158; return 1 + (c + 1) * Math.pow(k - 1, 3) + c * Math.pow(k - 1, 2); },
    snap: k => 1 - Math.pow(1 - k, 5)
  };
  // mistura recursiva de números / arrays / objetos
  function blend(a, b, k) {
    if (typeof a === 'number' && typeof b === 'number') return lerp(a, b, k);
    if (Array.isArray(a) && Array.isArray(b)) return a.map((v, i) => blend(v, b[i], k));
    if (a && b && typeof a === 'object' && typeof b === 'object') {
      const o = {}; const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
      keys.forEach(key => { o[key] = (key in a && key in b) ? blend(a[key], b[key], k) : (key in b ? b[key] : a[key]); });
      return o;
    }
    return k < 0.5 ? a : b;
  }
  // trilha: [{t, v, d(duração da transição ATÉ este key), e(easing)}]; v pode ser nome (resolvido por res)
  function track(keys, t, res) {
    const r = v => (typeof v === 'string' && res ? res(v) : v);
    if (!keys.length) return null;
    if (t <= keys[0].t) return r(keys[0].v);
    for (let i = 1; i < keys.length; i++) {
      const k = keys[i], p = keys[i - 1];
      if (t < k.t) return r(p.v);                       // segura o valor anterior até começar a transição
      const d = k.d === undefined ? 0.18 : k.d;
      if (t < k.t + d) {
        const u = clamp((t - k.t) / Math.max(d, 1e-6));
        return blend(r(p.v), r(k.v), (E[k.e || 'ease'])(u));
      }
      if (i === keys.length - 1) return r(k.v);
      if (t < keys[i + 1].t) return r(k.v);
    }
    return r(keys[keys.length - 1].v);
  }
  // ruído determinístico
  function rnd(n) { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); }
  function noise1(x, seed = 0) { const i = Math.floor(x), f = x - i; const a = rnd(i + seed * 17), b = rnd(i + 1 + seed * 17); return lerp(a, b, f * f * (3 - 2 * f)) * 2 - 1; }
  // cores
  function hex2rgb(h) { h = h.replace('#', ''); return [0, 2, 4].map(i => parseInt(h.substr(i, 2), 16)); }
  function rgb2hex(r) { return '#' + r.map(v => Math.round(clamp(v, 0, 255)).toString(16).padStart(2, '0')).join(''); }
  function shade(h, k) { const c = hex2rgb(h); return rgb2hex(k < 0 ? c.map(v => v * (1 + k)) : c.map(v => v + (255 - v) * k)); }
  function mix(h1, h2, k) { const a = hex2rgb(h1), b = hex2rgb(h2); return rgb2hex(a.map((v, i) => lerp(v, b[i], k))); }
  const f = n => (Math.round(n * 100) / 100);
  G.L = { clamp, lerp, E, blend, track, rnd, noise1, hex2rgb, rgb2hex, shade, mix, f, NAVY: '#1d2747' };
})(window);
