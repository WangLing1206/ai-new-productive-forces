/* ============================================================================
 *  智启新质 · 公共运行时 (common.js)
 *  主题切换 / 站点框架注入 / 数字动画 / 滚动揭示 / 神经网络背景 / ECharts 主题
 * ==========================================================================*/
(function (global) {
  'use strict';

  const D = global.DATA;
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));

  /* ------------------------------------------------------------ 数字格式 */
  const fmt = (n, dec) => {
    if (n === null || n === undefined || n === '') return '—';
    const d = dec === undefined ? (Math.abs(n) < 10 && !Number.isInteger(n) ? 1 : 0) : dec;
    return Number(n).toLocaleString('zh-CN', { minimumFractionDigits: d, maximumFractionDigits: d });
  };

  /* ------------------------------------------------------------ 主题 */
  const Theme = {
    key: 'zq-theme',
    get() {
      try { return localStorage.getItem(this.key) || 'dark'; } catch (e) { return 'dark'; }
    },
    set(t, anim) {
      document.documentElement.setAttribute('data-theme', t);
      try { localStorage.setItem(this.key, t); } catch (e) { /* ignore */ }
      invalidateVars();
      if (anim !== false) {
        document.body.classList.add('theme-anim');
        setTimeout(() => document.body.classList.remove('theme-anim'), 520);
      }
      const btn = $('#themeToggle');
      if (btn) btn.setAttribute('aria-label', t === 'dark' ? '切换到浅色主题' : '切换到深色主题');
      listeners.forEach((fn) => { try { fn(t); } catch (e) { console.warn(e); } });
      EChartsKit.repaint();
    },
    toggle() { this.set(this.get() === 'dark' ? 'light' : 'dark'); },
    init() { document.documentElement.setAttribute('data-theme', this.get()); }
  };
  const listeners = [];
  const onTheme = (fn) => listeners.push(fn);

  /* ------------------------------------------------------------ 站点框架 */
  const LOGO = `<svg viewBox="0 0 24 24" fill="none" stroke="#d8ae4e" stroke-width="1.6" stroke-linecap="round">
      <circle cx="12" cy="12" r="3.2"/><circle cx="4.5" cy="6" r="1.9"/><circle cx="19.5" cy="6" r="1.9"/>
      <circle cx="4.5" cy="18" r="1.9"/><circle cx="19.5" cy="18" r="1.9"/>
      <path d="M6 7.2 9.6 10M18 7.2 14.4 10M6 16.8 9.6 14M18 16.8 14.4 14"/></svg>`;

  const PAGES = [
    { id: 'home', href: 'index.html', label: '总览' },
    { id: 'deck', href: 'deck.html', label: '翻页演示' },
    { id: 'dashboard', href: 'dashboard.html', label: '数据看板' },
    { id: 'sources', href: 'sources.html', label: '数据来源' }
  ];

  function chrome(active) {
    /* 顶栏 */
    const bar = document.createElement('header');
    bar.className = 'topbar';
    bar.innerHTML = `
      <a class="brand" href="index.html" aria-label="返回首页">
        <span class="brand-mark">${LOGO}</span>
        <span class="brand-text">
          <span class="brand-title">智启<em>新质</em></span>
          <span class="brand-sub">AI · New Productive Forces</span>
        </span>
      </a>
      <nav class="navlinks" id="navlinks">
        ${PAGES.map((p) => `<a href="${p.href}" class="${p.id === active ? 'active' : ''}">${p.label}</a>`).join('')}
      </nav>
      <div class="nav-tools">
        <button class="theme-toggle" id="themeToggle" aria-label="切换主题"><i>☾</i></button>
        <button class="nav-burger" id="navBurger" aria-label="菜单"><span></span><span></span><span></span></button>
      </div>`;
    document.body.prepend(bar);

    /* 阅读进度条 */
    const rb = document.createElement('div');
    rb.className = 'readbar';
    document.body.appendChild(rb);

    /* 页脚 */
    const f = document.createElement('footer');
    f.className = 'footer';
    f.innerHTML = `
      <div class="wrap">
        <div class="footer-inner">
          <div>
            <h4>关于本报告</h4>
            <p class="footer-desc">${D.SITE.desc}<br>
            本页所有数据均来自政府统计公报、国家部委发布口径与国际权威机构公开报告，逐条标注来源与统计口径。统计数据与预测数据的区分见"数据来源"页。</p>
            <div class="flex gap8 wrapf mt16">
              <span class="tag gold">数据可视化</span>
              <span class="tag">新质生产力</span>
              <span class="tag">人工智能+</span>
            </div>
          </div>
          <div>
            <h4>浏览导航</h4>
            <ul class="footer-list">
              ${PAGES.map((p) => `<li><a href="${p.href}">${p.label}</a></li>`).join('')}
              <li><a href="index.html#ch-future">人工智能+ 行动路线</a></li>
            </ul>
          </div>
          <div>
            <h4>数据口径</h4>
            <ul class="footer-list">
              <li>统计年度：2019 — 2026</li>
              <li>数据截至：2026年10月</li>
              <li>共引用 ${D.SOURCES.length} 项权威来源</li>
              <li><a href="sources.html#caveats">口径差异说明 →</a></li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          <span>${D.SITE.title} · ${D.SITE.subtitle} — ${D.SITE.date}</span>
          <span>本报告为数据可视化研究作品，数据版权归原发布机构所有</span>
        </div>
      </div>`;
    document.body.appendChild(f);

    /* 交互绑定 */
    const t1 = $('#themeToggle');
    if (t1) { t1.querySelector('i').textContent = Theme.get() === 'dark' ? '☾' : '☀'; }
    onTheme((t) => { const i = $('#themeToggle i'); if (i) i.textContent = t === 'dark' ? '☾' : '☀'; });
    if (t1) t1.addEventListener('click', () => Theme.toggle());

    const burger = $('#navBurger');
    const links = $('#navlinks');
    if (burger) burger.addEventListener('click', () => links.classList.toggle('open'));
    $$('#navlinks a').forEach((a) => a.addEventListener('click', () => links.classList.remove('open')));

    /* 滚动状态 */
    const onScroll = () => {
      const st = global.scrollY || document.documentElement.scrollTop;
      bar.classList.toggle('scrolled', st > 20);
      const h = document.documentElement.scrollHeight - global.innerHeight;
      rb.style.width = (h > 0 ? Math.min(100, (st / h) * 100) : 0) + '%';
    };
    global.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ------------------------------------------------------------ 数字滚动 */
  function countUp(el, to, opt) {
    opt = opt || {};
    const dur = opt.duration || 1500;
    const dec = opt.decimals === undefined ? (Math.abs(to) < 10 && !Number.isInteger(to) ? 1 : 0) : opt.decimals;
    const from = opt.from === undefined ? 0 : opt.from;
    const delay = opt.delay || 0;
    const done = () => {
      const t0 = performance.now();
      const step = (now) => {
        const p = Math.min(1, (now - t0) / dur);
        const e = 1 - Math.pow(1 - p, 4); /* easeOutQuart */
        const v = from + (to - from) * e;
        el.textContent = opt.raw ? String(Math.round(v)) : fmt(v, dec);
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = opt.raw ? String(to) : fmt(to, dec);
      };
      requestAnimationFrame(step);
    };
    if (delay) setTimeout(done, delay); else done();
  }

  /** 扫描带 data-count 的元素并绑定进入视口后播放 */
  function autoCount(scope) {
    const els = $$('[data-count]', scope || document);
    if (!els.length) return;
    const io = new IntersectionObserver((ents) => {
      ents.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target;
        io.unobserve(el);
        countUp(el, parseFloat(el.dataset.count), {
          decimals: el.dataset.dec === undefined ? undefined : parseFloat(el.dataset.dec),
          duration: parseFloat(el.dataset.dur || 1600),
          delay: parseFloat(el.dataset.delay || 0),
          raw: el.dataset.raw === '1'
        });
      });
    }, { threshold: .25, rootMargin: '0px 0px -8% 0px' });
    els.forEach((el) => io.observe(el));
  }

  /* ------------------------------------------------------------ 滚动揭示 */
  function reveal(scope) {
    const els = $$('.reveal, .reveal-l, .reveal-r, .reveal-s', scope || document);
    const io = new IntersectionObserver((ents) => {
      ents.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add('in');
        io.unobserve(e.target);
      });
    }, { threshold: .12, rootMargin: '0px 0px -6% 0px' });
    els.forEach((el) => io.observe(el));
  }

  /* ------------------------------------------------------------ 神经网络背景 */
  function neuralCanvas(canvas, opt) {
    opt = opt || {};
    const ctx = canvas.getContext('2d');
    const density = opt.density || 0.00009;
    let W = 0, H = 0, dpr = 1, nodes = [], raf = 0, t = 0;
    const pointer = { x: -9999, y: -9999 };
    const COLORS = opt.colors || ['#3d7fd6', '#45cfe8', '#d8ae4e'];

    function build() {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(global.devicePixelRatio || 1, 2);
      W = rect.width; H = rect.height;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.max(28, Math.min(opt.max || 120, Math.round(W * H * density)));
      nodes = Array.from({ length: n }, (_, i) => ({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - .5) * .24, vy: (Math.random() - .5) * .24,
        r: Math.random() * 1.6 + .8,
        c: COLORS[i % COLORS.length],
        pulse: Math.random() * Math.PI * 2
      }));
    }

    function frame() {
      t += .01;
      ctx.clearRect(0, 0, W, H);
      const maxD = Math.min(190, Math.max(110, W / 9));
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        if (!opt.static) {
          a.x += a.vx; a.y += a.vy;
          if (a.x < 0 || a.x > W) a.vx *= -1;
          if (a.y < 0 || a.y > H) a.vy *= -1;
          a.x = Math.max(0, Math.min(W, a.x));
          a.y = Math.max(0, Math.min(H, a.y));
        }
        a.pulse += .02;
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d = Math.hypot(dx, dy);
          if (d < maxD) {
            const al = (1 - d / maxD) * (opt.lineAlpha || .3);
            ctx.strokeStyle = `rgba(90,150,225,${al})`;
            ctx.lineWidth = .7;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
        /* 鼠标联动 */
        const pd = Math.hypot(a.x - pointer.x, a.y - pointer.y);
        if (pd < 170) {
          ctx.strokeStyle = `rgba(216,174,78,${(1 - pd / 170) * .42})`;
          ctx.lineWidth = .85;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(pointer.x, pointer.y); ctx.stroke();
        }
        const glow = 1 + Math.sin(a.pulse) * .34;
        ctx.beginPath();
        ctx.arc(a.x, a.y, a.r * glow, 0, Math.PI * 2);
        ctx.fillStyle = a.c;
        ctx.globalAlpha = .78;
        ctx.fill();
        ctx.globalAlpha = 1;
      }
      raf = requestAnimationFrame(frame);
    }

    build();
    if (opt.static) { frame(); cancelAnimationFrame(raf); }
    else frame();

    global.addEventListener('resize', () => { cancelAnimationFrame(raf); build(); if (opt.static) { frame(); cancelAnimationFrame(raf); } else frame(); });
    if (opt.interactive !== false) {
      canvas.parentElement.addEventListener('mousemove', (e) => {
        const r = canvas.getBoundingClientRect();
        pointer.x = e.clientX - r.left; pointer.y = e.clientY - r.top;
      });
      canvas.parentElement.addEventListener('mouseleave', () => { pointer.x = pointer.y = -9999; });
    }
    return { rebuild: () => { cancelAnimationFrame(raf); build(); frame(); } };
  }

  /* ------------------------------------------------------------ ECharts 封装 */
  /** 构建 CSS 变量 → 计算值的映射。
   *  ECharts 使用 canvas 渲染，无法解析 var(--x)，必须在 setOption 前替换为具体色值。 */
  function cssVarMap() {
    if (_vmap) return _vmap;
    const cs = getComputedStyle(document.documentElement);
    const m = {};
    for (let i = 0; i < cs.length; i++) {
      const k = cs[i];
      if (k && k.slice(0, 2) === '--') m['var(' + k + ')'] = cs.getPropertyValue(k).trim();
    }
    _vmap = m;
    return m;
  }
  let _vmap = null;
  const invalidateVars = () => { _vmap = null; };
  /** 深度替换选项对象中的 var(--x) 字符串 */
  function resolveVars(o, map) {
    if (typeof o === 'string') return map[o] === undefined ? o : map[o];
    if (Array.isArray(o)) { for (let i = 0; i < o.length; i++) o[i] = resolveVars(o[i], map); return o; }
    if (o && typeof o === 'object') {
      Object.keys(o).forEach((k) => { o[k] = resolveVars(o[k], map); });
      return o;
    }
    return o;
  }

  const EChartsKit = {
    reg: [],
    /** 注册一张图表：render 函数在主题变化/尺寸变化时会被重新调用 */
    make(el, renderFn) {
      if (!el || !global.echarts) return null;
      const inst = global.echarts.init(el, null, { renderer: 'canvas' });
      const wrapped = (i) => renderFn(i);
      const item = { inst, renderFn: wrapped, el };
      this.reg.push(item);
      /* 用解析后的具体色值渲染：canvas 无法解析 CSS 变量 */
      const orig = inst.setOption.bind(inst);
      inst.setOption = function (opt, notMerge) {
        try { resolveVars(opt, cssVarMap()); } catch (e) { /* ignore */ }
        return orig(opt, notMerge);
      };
      renderFn(inst);
      return inst;
    },
    repaint() {
      this.reg.forEach(({ inst, renderFn, el }) => {
        if (!el.isConnected) return;
        try { inst.clear(); renderFn(inst); } catch (e) { console.warn(e); }
      });
      this.resize();
    },
    resize() { this.reg.forEach(({ inst, el }) => { if (el.isConnected) inst.resize(); }); },
    init() {
      let to = 0;
      global.addEventListener('resize', () => { clearTimeout(to); to = setTimeout(() => this.resize(), 160); });
      if (global.ResizeObserver) {
        const ro = new ResizeObserver(() => { clearTimeout(to); to = setTimeout(() => this.resize(), 120); });
        ro.observe(document.body);
      }
    },
    /** 统一的图表基底样式 */
    base(extra) {
      const cs = getComputedStyle(document.documentElement);
      const v = (k, fb) => (cs.getPropertyValue(k) || fb).trim();
      const ink2 = v('--ink-2', '#a9bcd6'), ink3 = v('--ink-3', '#6d82a0'), ink4 = v('--ink-4', '#4a5c78');
      const line = v('--line', 'rgba(122,163,224,.17)'), panel = v('--panel-solid', '#0c1830');
      const ink = v('--ink', '#eef3fb');
      const o = Object.assign({
        color: ['#3d7fd6', '#d8ae4e', '#45cfe8', '#35c08e', '#c8102e', '#8b7fe8', '#ef9440', '#6e829e'],
        textStyle: { fontFamily: '"PingFang SC","Microsoft YaHei",system-ui,sans-serif', color: ink2 },
        animationDuration: 900,
        animationEasing: 'cubicOut',
        grid: { left: 8, right: 20, top: 58, bottom: 8, containLabel: true },
        tooltip: {
          trigger: 'axis',
          backgroundColor: panel,
          borderColor: line,
          borderWidth: 1,
          padding: [10, 14],
          textStyle: { color: ink, fontSize: 12.5, lineHeight: 20 },
          extraCssText: 'border-radius:10px;box-shadow:0 10px 30px rgba(0,0,0,.35);backdrop-filter:blur(10px);',
          axisPointer: { type: 'shadow', shadowStyle: { color: 'rgba(61,127,214,.1)' } }
        },
        legend: {
          top: 4, right: 4, icon: 'roundRect', itemWidth: 10, itemHeight: 10, itemGap: 14,
          textStyle: { color: ink2, fontSize: 12 }
        },
        xAxis: {
          type: 'category',
          axisLine: { lineStyle: { color: line } },
          axisTick: { show: false },
          axisLabel: { color: ink3, fontSize: 11.5, margin: 12 },
          splitLine: { show: false }
        },
        yAxis: {
          type: 'value',
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: { color: ink3, fontSize: 11.5 },
          splitLine: { lineStyle: { color: line, type: 'dashed' } }
        }
      }, extra || {});

      /* 统一轴名位置，避免与顶部刻度标签重叠 */
      const fixName = (ax) => {
        if (Array.isArray(ax)) return ax.forEach(fixName);
        if (ax && ax.name) {
          if (ax.nameGap === undefined) ax.nameGap = 16;
          const isY = ax.type === 'value' || ax.type === 'log' || (!ax.type && ax.name && !ax.data);
          ax.nameTextStyle = Object.assign({
            color: ink4, fontSize: 11, fontWeight: 500,
            align: isY ? 'left' : 'center', verticalAlign: 'bottom'
          }, ax.nameTextStyle || {});
        }
      };
      fixName(o.yAxis);
      fixName(o.xAxis);
      return o;
    },
    /* 生成 HTML 富文本 tooltip（用于统一观感） */
    tip(title, lines) {
      let h = `<div style="font-weight:700;font-size:13px;margin-bottom:6px;letter-spacing:.02em">${title}</div>`;
      lines.forEach((l) => {
        h += `<div style="display:flex;justify-content:space-between;gap:18px;font-size:12.5px;line-height:1.8">
          <span style="opacity:.75">${l[0]}</span>
          <span style="font-family:var(--font-num);font-weight:700">${l[1]}</span></div>`;
      });
      return h;
    }
  };

  /* ------------------------------------------------------------ 提示气泡初始化 */
  function tips(scope) {
    $$('[data-tip]', scope || document).forEach((el) => el.classList.add('tip'));
  }

  /* ------------------------------------------------------------ 章节侧边导航 */
  function chapterNav(chapters) {
    const nav = document.createElement('aside');
    nav.className = 'chapnav';
    nav.innerHTML = chapters.map((c) => `<a href="#${c.id}" data-ch="${c.id}"><i></i><span>${c.nav}</span></a>`).join('');
    document.body.appendChild(nav);
    const io = new IntersectionObserver((ents) => {
      ents.forEach((e) => {
        if (e.isIntersecting) {
          $$('.chapnav a').forEach((a) => a.classList.toggle('on', a.dataset.ch === e.target.id));
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    chapters.forEach((c) => { const s = document.getElementById(c.id); if (s) io.observe(s); });
    return nav;
  }

  global.ZQ = {
    $, $$, fmt, Theme, onTheme, chrome, countUp, autoCount, reveal,
    neuralCanvas, EChartsKit, tips, chapterNav, LOGO
  };

  Theme.init();
})(window);
