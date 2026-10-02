/* 浅色主题截图检查
 * 用法: node tools/shot-light.js <page> [shots]
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..');
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png' };
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
  const page = process.argv[2] || 'index.html';
  const maxShots = parseInt(process.argv[3] || '6', 10);
  const out = path.join(ROOT, 'build/light');
  fs.mkdirSync(out, { recursive: true });
  const PORT = 5200 + Math.floor(Math.random() * 200);
  const srv = await server(PORT);
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1600, height: 950 }, deviceScaleFactor: 1 });
  /* 预置浅色主题 */
  await ctx.addInitScript(() => { try { localStorage.setItem('zq-theme', 'light'); } catch (e) {} });
  const pg = await ctx.newPage();
  const errs = [];
  pg.on('pageerror', (e) => errs.push('PAGEERROR: ' + e.message));
  await pg.goto(`http://127.0.0.1:${PORT}/${page}`, { waitUntil: 'load' });
  await pg.waitForTimeout(2200);
  const name = page.replace(/\.html$/, '');
  const H = await pg.evaluate(() => document.body.scrollHeight);
  let i = 0;
  for (let y = 0; y < H && i < maxShots; y += 950, i++) {
    await pg.evaluate((yy) => window.scrollTo({ top: yy, behavior: 'instant' }), y);
    await pg.waitForTimeout(900);
    await pg.screenshot({ path: path.join(out, `${name}-light-${String(i).padStart(2, '0')}.png`) });
  }
  console.log(`light ${page}: height=${H} shots=${i}${errs.length ? ' ERR:' + errs.join('|') : ''}`);
  await browser.close();
  srv.close();
})().catch((e) => { console.error(e); process.exit(1); });
