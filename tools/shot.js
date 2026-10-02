/* 本地静态服务器 + Playwright 截图 / 控制台检查工具
 * 用法: node tools/shot.js [page] [outDir]
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..');
const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.woff2': 'font/woff2', '.vtt': 'text/vtt',
  '.srt': 'text/plain; charset=utf-8', '.md': 'text/markdown; charset=utf-8'
};

function server(port) {
  return new Promise((res) => {
    const s = http.createServer((req, rep) => {
      let p = decodeURIComponent(req.url.split('?')[0]);
      if (p === '/') p = '/index.html';
      const f = path.join(ROOT, p);
      if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) {
        rep.writeHead(404); return rep.end('404');
      }
      rep.writeHead(200, { 'Content-Type': MIME[path.extname(f).toLowerCase()] || 'application/octet-stream' });
      fs.createReadStream(f).pipe(rep);
    });
    s.listen(port, () => res(s));
  });
}

(async () => {
  const page = process.argv[2] || 'index.html';
  const out = path.join(ROOT, process.argv[3] || 'build/shots');
  fs.mkdirSync(out, { recursive: true });
  const PORT = 4173 + Math.floor(Math.random() * 200);
  const srv = await server(PORT);

  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 1 });
  const pg = await ctx.newPage();
  const errs = [];
  pg.on('console', (m) => { if (m.type() === 'error') errs.push('CONSOLE: ' + m.text()); });
  pg.on('pageerror', (e) => errs.push('PAGEERROR: ' + e.message));

  await pg.goto(`http://127.0.0.1:${PORT}/${page}`, { waitUntil: 'load' });
  await pg.waitForTimeout(2200);

  const name = page.replace(/\.html$/, '');
  const H = await pg.evaluate(() => document.body.scrollHeight);
  console.log(`page=${page} height=${H}px`);
  const shots = [];
  const step = 1000;
  for (let y = 0, i = 0; y < H && i < 24; y += step, i++) {
    await pg.evaluate((yy) => window.scrollTo({ top: yy, behavior: 'instant' }), y);
    await pg.waitForTimeout(900);
    const f = path.join(out, `${name}-${String(i).padStart(2, '0')}.png`);
    await pg.screenshot({ path: f });
    shots.push(f);
  }
  console.log('shots:', shots.length);
  if (errs.length) { console.log('\n--- ERRORS ---'); errs.slice(0, 30).forEach((e) => console.log(e)); }
  else console.log('no console errors');

  await browser.close();
  srv.close();
})().catch((e) => { console.error(e); process.exit(1); });
