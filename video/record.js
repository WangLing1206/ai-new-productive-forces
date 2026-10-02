/* ============================================================================
 *  演示视频录制 (record.js)
 *  以 1920×1080 驱动站点完成脚本化巡览，输出：
 *    video/raw/*.webm       原始录制
 *    video/timeline.json    每场景的实际墙钟边界（供字幕生成对齐）
 *
 *  时间轴对齐方法：
 *    录制开始前在页面覆盖一层纯黑遮罩，抬起遮罩的那一刻记为 t0（liftWall）。
 *    用 ffmpeg blackdetect 从成片中找到"黑场结束"的视频时间点 L，
 *    则 场景在成片中的起点 = L + (场景墙钟起点 - liftWall)。
 * ==========================================================================*/
const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const { TIMELINE } = require('./scenes');

const ROOT = path.resolve(__dirname, '..');
const RAW = path.join(__dirname, 'raw');
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png' };
const W = 1920, H = 1080;

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

/* ------------------------------------------------------------------ 页面内工具 */
const INIT_SCRIPT = () => {
  try { localStorage.setItem('zq-theme', 'dark'); } catch (e) { /* ignore */ }
  const apply = () => {
    if (document.documentElement) document.documentElement.style.scrollBehavior = 'auto';
  };
  apply();
  document.addEventListener('DOMContentLoaded', apply, { once: true });
};

/* 缓动滚动到指定 Y */
async function scrollY(pg, y, dur) {
  if (!dur) { await pg.evaluate((yy) => window.scrollTo(0, yy), y); return; }
  await pg.evaluate(({ to, d }) => new Promise((res) => {
    const from = window.scrollY, t0 = performance.now();
    const ease = (p) => (p < .5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2);
    (function step(now) {
      const p = Math.min(1, (now - t0) / d);
      window.scrollTo(0, Math.round(from + (to - from) * ease(p)));
      if (p < 1) requestAnimationFrame(step); else res();
    })(t0);
  }), { to: y, d: dur });
}

/* 元素定位滚动：elTop 距视口顶部 offset px */
async function scrollToEl(pg, sel, dur, offset) {
  const off = offset === undefined ? 100 : offset;
  const measure = () => pg.evaluate(({ s, o }) => {
    const el = document.getElementById(s) || document.querySelector(s);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return Math.round(r.top + window.scrollY - o);
  }, { s: sel, o: off });
  const delta = () => pg.evaluate(({ s, o }) => {
    const el = document.getElementById(s) || document.querySelector(s);
    if (!el) return null;
    return Math.round(el.getBoundingClientRect().top - o);
  }, { s: sel, o: off });

  let y = await measure();
  if (y === null) { console.warn('  ! element not found: ' + sel); return false; }
  /* 页面在录制过程中会因图表/动画产生回流，滚动后复测并纠正，确保落点准确 */
  for (let attempt = 0; attempt < 4; attempt++) {
    await scrollY(pg, y, attempt === 0 ? dur : Math.min(500, dur));
    await pg.waitForTimeout(attempt === 0 ? 260 : 220);
    const d = await delta();
    if (d === null) return false;
    if (Math.abs(d) <= 26) return true;
    const cur = await pg.evaluate(() => window.scrollY);
    y = Math.max(0, cur + d);
  }
  console.warn('  ! scroll not settled: ' + sel);
  return false;
}

/** 录制前把整页走一遍，促使图表初始化与布局稳定，随后回到顶部 */
async function settlePage(pg) {
  const H = await pg.evaluate(() => document.body.scrollHeight);
  const vh = await pg.evaluate(() => window.innerHeight);
  for (let y = 0; y < H; y += Math.round(vh * 0.85)) {
    await pg.evaluate((yy) => window.scrollTo(0, yy), y);
    await pg.waitForTimeout(110);
  }
  await pg.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await pg.waitForTimeout(900);
  await pg.evaluate(() => window.scrollTo(0, 0));
  await pg.waitForTimeout(700);
}

/* 虚拟鼠标指针（让点击操作在视频里可见） */
async function injectCursor(pg) {
  await pg.evaluate(() => {
    if (document.getElementById('zqCursor')) return;
    const d = document.createElement('div');
    d.id = 'zqCursor';
    d.innerHTML = '<i></i>';
    Object.assign(d.style, {
      position: 'fixed', left: '0', top: '0', width: '26px', height: '26px',
      marginLeft: '-13px', marginTop: '-13px', borderRadius: '50%',
      border: '2px solid rgba(216,174,78,.95)', background: 'rgba(216,174,78,.22)',
      boxShadow: '0 0 16px rgba(216,174,78,.75)', pointerEvents: 'none',
      zIndex: 99999, transition: 'transform .38s cubic-bezier(.22,.61,.36,1)', transform: 'translate(-100px,-100px)'
    });
    document.body.appendChild(d);
    const style = document.createElement('style');
    style.textContent = '@keyframes zqRipple{0%{transform:scale(.4);opacity:.9}100%{transform:scale(2.6);opacity:0}}'
      + '#zqCursor i{position:absolute;inset:-3px;border-radius:50%;border:2px solid rgba(216,174,78,.9);opacity:0}'
      + '#zqCursor.ping i{animation:zqRipple .6s ease-out}';
    document.head.appendChild(style);
  });
}
async function moveCursor(pg, x, y) {
  await pg.evaluate(({ x, y }) => {
    const d = document.getElementById('zqCursor');
    if (d) d.style.transform = `translate(${x}px, ${y}px)`;
  }, { x, y });
  await pg.waitForTimeout(420);
}
async function clickEl(pg, sel, useCursor) {
  const box = await pg.evaluate((s) => {
    const el = document.querySelector(s);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { x: Math.round(r.left + r.width / 2), y: Math.round(r.top + r.height / 2) };
  }, sel);
  if (!box) { console.warn('  ! click target not found: ' + sel); return; }
  if (useCursor) await moveCursor(pg, box.x, box.y);
  await pg.mouse.click(box.x, box.y);
  await pg.evaluate(() => {
    const d = document.getElementById('zqCursor');
    if (!d) return;
    d.classList.remove('ping'); void d.offsetWidth; d.classList.add('ping');
  });
}
async function press(pg, key) {
  await pg.keyboard.press(key);
  await pg.waitForTimeout(120);
}

/* ------------------------------------------------------------------ 场景内的自定义动作 */
const SEQS = {
  /* 第五章：先在算力，再滑到 5G / 集群 */
  S05: async (pg, at) => {
    await at(5200, () => scrollToEl(pg, 'base-step-3', 1500, 120));
  },

  /* 第七章：企业 → 大模型 → 用户规模 微滚动 */
  S07: async (pg, at) => {
    await at(5200, () => scrollToEl(pg, 'scale-step-2', 1300, 120));
    await at(9400, () => scrollToEl(pg, 'scale-step-3', 1300, 120));
  },

  /* 翻转演示：封面 → 目录 → 连续翻页 */
  S14: async (pg, at, h) => {
    await injectCursor(pg);
    await at(2400, () => clickEl(pg, '#btnNav', true));           /* 打开目录 */
    await at(5000, () => clickEl(pg, '.dn-item[data-i="7"]', true)); /* 跳到"产业规模" */
    await at(8200, () => press(pg, 'ArrowRight'));
    await at(10100, () => press(pg, 'ArrowRight'));
    await at(12000, () => press(pg, 'ArrowRight'));
    await at(13900, () => press(pg, 'ArrowRight'));
    await at(15700, () => press(pg, 'ArrowRight'));
  },

  /* 数据看板：筛选 → 数据表 → 双主题 → 回到首页结语 */
  S15: async (pg, at, h) => {
    await injectCursor(pg);
    await at(3400, () => clickEl(pg, '.chip[data-cat="infra"]', true));
    await at(5700, () => clickEl(pg, '.chip[data-cat="scale"]', true));
    await at(8000, () => clickEl(pg, '.chip[data-cat="all"]', true));
    await at(9700, () => clickEl(pg, '#viewSeg button[data-view="table"]', true));
    await at(11700, () => scrollY(pg, 420, 1100));
    await at(13200, () => clickEl(pg, '#viewSeg button[data-view="chart"]', true));
    await at(14400, () => clickEl(pg, '#themeToggle', true));      /* → 浅色 */
    await at(17400, () => clickEl(pg, '#themeToggle', true));      /* → 深色 */
    await at(18600, async () => {                                   /* 回到首页结语 */
      await pg.goto(h.base + '/index.html', { waitUntil: 'load' });
      await pg.waitForTimeout(500);
      await injectCursor(pg);
      await scrollToEl(pg, '.cta-band', 1300, 200);
    });
  }
};

/* ------------------------------------------------------------------ 主流程 */
(async () => {
  fs.mkdirSync(RAW, { recursive: true });
  const PORT = 5600 + Math.floor(Math.random() * 200);
  const srv = await server(PORT);
  const base = `http://127.0.0.1:${PORT}`;

  const browser = await chromium.launch({ args: ['--force-device-scale-factor=1', '--hide-scrollbars'] });
  const ctx = await browser.newContext({
    viewport: { width: W, height: H },
    deviceScaleFactor: 1,
    recordVideo: { dir: RAW, size: { width: W, height: H } }
  });
  await ctx.addInitScript(INIT_SCRIPT);
  const pg = await ctx.newPage();
  pg.on('pageerror', (e) => console.warn('PAGEERROR:', e.message));
  const video = pg.video();

  console.log('→ 载入首页并预热 …');
  await pg.goto(base + '/index.html', { waitUntil: 'load' });
  await pg.waitForTimeout(2200);
  console.log('→ 整页预走一遍，让图表与布局稳定 …');
  await settlePage(pg);

  /* 黑色遮罩：用于在成片中精确定位 t0 */
  await pg.evaluate(() => {
    const d = document.createElement('div');
    d.id = 'zqCurtain';
    Object.assign(d.style, { position: 'fixed', inset: '0', background: '#000', zIndex: 99998 });
    document.body.appendChild(d);
  });
  console.log('→ 黑场 1.8s …');
  await pg.waitForTimeout(1800);

  /* 抬起遮罩：重置首页入场动画，使镜头到达时动画重新播放 */
  const liftWall = Date.now();
  await pg.evaluate(() => {
    document.querySelectorAll('.reveal,.reveal-l,.reveal-r,.reveal-s').forEach((el) => el.classList.remove('in'));
    document.querySelectorAll('[data-count]').forEach((el) => { el.textContent = '0'; });
    const d = document.getElementById('zqCurtain');
    if (d) d.remove();
    if (window.ZQ) { window.ZQ.reveal(); window.ZQ.autoCount(); }
  });

  const bounds = [];
  for (const S of TIMELINE) {
    const sceneStart = Date.now();
    bounds.push({ id: S.id, name: S.name, startWall: sceneStart - liftWall, planned: S.durMs, nar: S.nar });
    process.stdout.write(`→ ${S.id} ${S.name} (${(S.durMs / 1000).toFixed(1)}s)… `);

    /* 跨页导航 */
    if (S.scroll && S.scroll.nav) {
      await pg.goto(base + '/' + S.page, { waitUntil: 'load' });
      await pg.waitForTimeout(600);
      if (S.page === 'deck.html' || S.page === 'dashboard.html') await injectCursor(pg);
      /* 滚动型页面先预走一遍，稳定布局（翻页演示为定高页面，跳过） */
      if (S.page !== 'deck.html') await settlePage(pg);
      /* 让入场动画在镜头到达时重新播放 */
      if (S.scroll.resetAnim) {
        await pg.evaluate(() => {
          document.querySelectorAll('.reveal,.reveal-l,.reveal-r,.reveal-s').forEach((el) => el.classList.remove('in'));
          document.querySelectorAll('[data-count]').forEach((el) => { el.textContent = '0'; });
          if (window.ZQ) {
            window.ZQ.reveal();
            window.ZQ.autoCount();
            window.ZQ.EChartsKit.repaint();
          }
        });
      }
    }
    /* 镜头运动（target 兼容 sel / y 两种写法） */
    if (S.scroll) {
      const tgt = S.scroll.sel !== undefined ? S.scroll.sel : S.scroll.y;
      if (typeof tgt === 'string') await scrollToEl(pg, tgt, S.scroll.dur || 1600, 110);
      else if (typeof tgt === 'number') await scrollY(pg, tgt, S.scroll.dur || 0);
    }
    /* 自定义动作 */
    const at = (offset, fn) => (async () => {
      const target = sceneStart + offset;
      const wait = target - Date.now();
      if (wait > 0) await pg.waitForTimeout(wait);
      try { await fn(); } catch (e) { console.warn('  ! action error @' + offset + 'ms:', e.message); }
    })();
    const pending = [];
    if (SEQS[S.id]) pending.push(SEQS[S.id](pg, at, { base, scrollY, scrollToEl, clickEl, press }));
    await Promise.all(pending);

    /* 补足计划时长 */
    const remain = S.durMs - (Date.now() - sceneStart);
    if (remain > 0) await pg.waitForTimeout(remain);
    console.log('done');
  }

  /* 片尾留白 + 淡出用 */
  await pg.waitForTimeout(1200);
  const totalWall = Date.now() - liftWall;

  await ctx.close();
  await browser.close();
  srv.close();

  const dir = await video.path().then((p) => path.dirname(p)).catch(() => RAW);
  const vpath = await video.path().catch(() => null);

  fs.writeFileSync(path.join(__dirname, 'timeline.json'), JSON.stringify({
    liftWall,
    totalWall,
    videoFile: vpath ? path.basename(vpath) : null,
    videoDir: dir,
    videoSize: { width: W, height: H },
    scenes: bounds
  }, null, 2));

  console.log('\n录制完成：');
  console.log('  原始视频：' + (vpath || '(见 ' + RAW + ')'));
  console.log('  时间轴  ：video/timeline.json');
  console.log('  计划时长：' + (TIMELINE[TIMELINE.length - 1].endMs / 1000).toFixed(1) + 's，实际墙钟：' + (totalWall / 1000).toFixed(1) + 's');
})().catch((e) => { console.error(e); process.exit(1); });
