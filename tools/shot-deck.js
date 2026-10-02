/* 翻页演示截图：逐页截图 + 控制台检查
 * 用法: node tools/shot-deck.js [startIndex] [endIndex]
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..');
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.vtt': 'text/vtt' };

function server(port) {
  return new Promise((res) => {
    const s = http.createServer((req, rep) => {
      let p = decodeURIComponent(req.url.split('?')[0]);
      if (p === '/') p = '/index.html';
      const f = path.join(ROOT, p);
      if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { rep.writeHead(404); return rep.end('404'); }
      rep.writeHead(200, { 'Content-Type': MIME[path.extname(f).toLowerCase()] || 'application/octet-stream' });
      fs.createReadStream(f).pipe(rep);
    });
    s.listen(port, () => res(s));
  });
}

(async () => {
  const from = parseInt(process.argv[2] || '1', 10);
  const to = parseInt(process.argv[3] || '99', 10);
  const out = path.join(ROOT, 'build/deck');
  fs.mkdirSync(out, { recursive: true });
  const PORT = 4500 + Math.floor(Math.random() * 200);
  const srv = await server(PORT);

  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 1 });
  const pg = await ctx.newPage();
  const errs = [];
  pg.on('console', (m) => { if (m.type() === 'error') errs.push('CONSOLE: ' + m.text()); });
  pg.on('pageerror', (e) => errs.push('PAGEERROR: ' + e.message));

  await pg.goto(`http://127.0.0.1:${PORT}/deck.html`, { waitUntil: 'load' });
  await pg.waitForTimeout(2000);
  const total = await pg.evaluate(() => document.querySelectorAll('.slide').length);
  console.log('total slides =', total);

  for (let i = Math.max(1, from); i <= Math.min(total, to); i++) {
    await pg.evaluate((n) => {
      /* 直接用键盘事件翻页，走真实交互路径 */
      const cur = document.querySelector('.slide.active');
      const ci = cur ? +cur.dataset.i : 0;
      const delta = n - 1 - ci;
      const key = delta >= 0 ? 'ArrowRight' : 'ArrowLeft';
      for (let k = 0; k < Math.abs(delta); k++) {
        document.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
      }
    }, i);
    await pg.waitForTimeout(1500);
    const f = path.join(out, `deck-${String(i).padStart(2, '0')}.png`);
    await pg.screenshot({ path: f });
  }
  if (errs.length) { console.log('--- ERRORS ---'); errs.slice(0, 20).forEach((e) => console.log(e)); }
  else console.log('no console errors');
  await browser.close();
  srv.close();
})().catch((e) => { console.error(e); process.exit(1); });
