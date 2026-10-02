/* 线上站点巡检：检查 4 个页面在真实 URL 下的控制台错误、资源加载与关键元素
 * 用法: node tools/verify-live.js [baseUrl]
 */
const { chromium } = require('playwright');

const BASE = process.argv[2] || 'https://wangling1206.github.io/ai-new-productive-forces';
const PAGES = [
  { url: '/', name: 'index', expect: ['.hero-title', '.srow', '.case', '.tl-item', '.radial-node'] },
  { url: '/deck.html', name: 'deck', expect: ['.slide', '#deckNav', '.du-ticks i', '.dn-item'] },
  { url: '/dashboard.html', name: 'dashboard', expect: ['.kpi-card', '.dcard', '.tbl'] },
  { url: '/sources.html', name: 'sources', expect: ['.src-item', '.principle', '.caveat'] }
];

(async () => {
  const browser = await chromium.launch();
  let bad = 0;
  for (const p of PAGES) {
    const ctx = await browser.newContext({ viewport: { width: 1600, height: 950 } });
    const pg = await ctx.newPage();
    const errs = [], failed = [];
    pg.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
    pg.on('pageerror', (e) => errs.push('PAGEERROR: ' + e.message));
    pg.on('requestfailed', (r) => failed.push(r.url() + ' :: ' + (r.failure() || {}).errorText));
    const resp = await pg.goto(BASE + p.url, { waitUntil: 'load', timeout: 60000 });
    await pg.waitForTimeout(2500);
    const counts = await pg.evaluate((sels) => {
      const o = {};
      sels.forEach((s) => { o[s] = document.querySelectorAll(s).length; });
      o.__h = document.body.scrollHeight;
      o.__canvases = document.querySelectorAll('canvas').length;
      return o;
    }, p.expect);
    const missing = p.expect.filter((s) => !counts[s]);
    const ok = resp.status() === 200 && !errs.length && !missing.length;
    if (!ok) bad++;
    console.log(`${ok ? 'OK  ' : 'FAIL'} ${p.name.padEnd(10)} http=${resp.status()} h=${counts.__h} canvas=${counts.__canvases}` +
      (missing.length ? ` MISSING=${missing.join(',')}` : '') +
      (errs.length ? `\n      errors: ${errs.slice(0, 4).join(' | ')}` : '') +
      (failed.length ? `\n      failed: ${failed.slice(0, 4).join(' | ')}` : ''));
    await ctx.close();
  }
  await browser.close();
  console.log(bad ? `\n${bad} page(s) with problems` : '\nall pages OK');
  process.exit(bad ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
