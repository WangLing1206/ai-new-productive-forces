/* 响应式检查：多断点截图
 * 用法: node tools/shot-responsive.js <page> [widths...]
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
  const widths = (process.argv.slice(3).length ? process.argv.slice(3) : ['1440', '1024', '768', '390']).map(Number);
  const out = path.join(ROOT, 'build/responsive');
  fs.mkdirSync(out, { recursive: true });
  const PORT = 4800 + Math.floor(Math.random() * 200);
  const srv = await server(PORT);
  const browser = await chromium.launch();
  const name = page.replace(/\.html$/, '');

  for (const w of widths) {
    const ctx = await browser.newContext({ viewport: { width: w, height: Math.round(w * 0.72) }, deviceScaleFactor: 1, isMobile: w < 700, hasTouch: w < 700 });
    const pg = await ctx.newPage();
    const errs = [];
    pg.on('pageerror', (e) => errs.push('PAGEERROR: ' + e.message));
    await pg.goto(`http://127.0.0.1:${PORT}/${page}`, { waitUntil: 'load' });
    await pg.waitForTimeout(2000);
    /* 逐屏截图 */
    const H = await pg.evaluate(() => document.body.scrollHeight);
    const vh = Math.round(w * 0.72);
    let i = 0;
    for (let y = 0; y < H && i < 6; y += vh, i++) {
      await pg.evaluate((yy) => window.scrollTo({ top: yy, behavior: 'instant' }), y);
      await pg.waitForTimeout(700);
      await pg.screenshot({ path: path.join(out, `${name}-${w}-${String(i).padStart(2, '0')}.png`) });
    }
    console.log(`w=${w} height=${H} shots=${i}${errs.length ? ' ERR:' + errs.join('|') : ''}`);
    await ctx.close();
  }
  await browser.close();
  srv.close();
})().catch((e) => { console.error(e); process.exit(1); });
