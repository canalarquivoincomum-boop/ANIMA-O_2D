// render.js — Playwright: renderiza uma página com window.render(t) em PNGs.
// uso: node render.js pagina.html saida_dir --from 0 --to 100 --fps 30 --w 1080 --h 1920 [--single t out.png]
const { chromium } = require('playwright');
const path = require('path'), fs = require('fs');
(async () => {
  const a = process.argv.slice(2); const page_ = path.resolve(a[0]); const out = a[1];
  const opt = k => { const i = a.indexOf('--' + k); return i >= 0 ? a[i + 1] : null; };
  const W = +(opt('w') || 1080), H = +(opt('h') || 1920), fps = +(opt('fps') || 30);
  const from = +(opt('from') || 0), to = opt('to') !== null ? +opt('to') : from;
  const times = opt('times') ? opt('times').split(',').map(Number) : null;
  const browser = await chromium.launch(); const ctx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  const p = await ctx.newPage(); p.on('pageerror', e => console.error('PAGEERROR', e.message)); p.on('console', m => { if (m.type() === 'error') console.error('CONSOLE', m.text()); });
  await p.goto('file://' + page_ + (opt('q') ? '?' + opt('q') : '')); await p.waitForTimeout(150);
  fs.mkdirSync(out, { recursive: true });
  if (times) { for (const t of times) { await p.evaluate(t => render(t), t); await p.screenshot({ path: path.join(out, 't' + t.toFixed(2) + '.png') }); } }
  else for (let i = from; i <= to; i++) { await p.evaluate(t => render(t), i / fps); await p.screenshot({ path: path.join(out, 'f' + String(i).padStart(5, '0') + '.png') }); }
  await browser.close();
})();
