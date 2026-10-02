/* ============================================================================
 *  智启新质 · 首页逻辑 (home.js)
 *  滚动叙事 / 堆叠式仪表盘 / 自定义 SVG 可视化 / 政策时间轴 / 环形图
 * ==========================================================================*/
(function () {
  'use strict';
  const D = window.DATA, ZQ = window.ZQ;
  const { $, $$, fmt } = ZQ;

  ZQ.chrome('home');
  ZQ.Theme.init();

  /* ================================================================== 工具 */
  /** 迷你 SVG 柱状/折线图 */
  function sparkSVG(values, opt) {
    opt = opt || {};
    const W = 300, H = 34, gap = opt.gap === undefined ? 4 : opt.gap;
    const n = values.length;
    const max = Math.max.apply(null, values);
    const min = Math.min(...(opt.log ? [0] : values));
    const colors = opt.colors || ['#3d7fd6', '#45cfe8', '#d8ae4e', '#35c08e'];
    if (opt.type === 'meter') {
      const pct = Math.max(0, Math.min(100, opt.pct || 0));
      return `<svg class="spark-svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">
        <rect x="0" y="${H / 2 - 4}" width="${W}" height="8" rx="4" fill="currentColor" fill-opacity=".1"/>
        <rect class="area" x="0" y="${H / 2 - 4}" width="${W * pct / 100}" height="8" rx="4" fill="url(#meterGrad)"/>
        <defs><linearGradient id="meterGrad" x1="0" x2="1"><stop offset="0" stop-color="#3d7fd6"/><stop offset="1" stop-color="#d8ae4e"/></linearGradient></defs>
      </svg>`;
    }
    const norm = (v) => {
      const t = opt.log ? Math.log10(v + 1) / Math.log10(max + 1) : (max === min ? 1 : (v - min) / (max - min));
      return 5 + t * (H - 9);
    };
    const bw = (W - gap * (n - 1)) / n;
    let out = `<svg class="spark-svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">`;
    if (opt.type !== 'line') {
      values.forEach((v, i) => {
        const bh = norm(v);
        const x = i * (bw + gap);
        const c = colors[i % colors.length];
        out += `<rect class="bar" x="${x.toFixed(1)}" y="${(H - bh).toFixed(1)}" width="${bw.toFixed(1)}" height="${bh.toFixed(1)}"
          rx="1.6" fill="${c}" fill-opacity=".82"/>`;
      });
    }
    if (opt.type === 'line') {
      const pts = values.map((v, i) => [i * (bw + gap) + bw / 2, H - norm(v)]);
      const d = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
      const gid = 'sf' + Math.random().toString(36).slice(2, 8);
      out += `<path class="area" d="${d} L${pts[n - 1][0].toFixed(1)} ${H} L${pts[0][0].toFixed(1)} ${H} Z" fill="url(#${gid})"/>
        <defs><linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#45cfe8" stop-opacity=".55"/><stop offset="1" stop-color="#45cfe8" stop-opacity="0"/></linearGradient></defs>
        <path class="line" d="${d}" stroke="#45cfe8" vector-effect="non-scaling-stroke"/>`;
      pts.forEach((p, i) => {
        const last = i === n - 1;
        out += `<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="${last ? 2.4 : 1.5}" fill="${last ? '#d8ae4e' : '#9fd8e8'}"/>`;
      });
    }
    return out + '</svg>';
  }

  /* ================================================================== 封面 */
  ZQ.neuralCanvas($('#heroCanvas'), { density: 0.00007, max: 92, lineAlpha: .26 });

  const heroKpis = [D.KPIS[0], D.KPIS[2], D.KPIS[1], D.KPIS[4]];
  $('#heroKpis').innerHTML = heroKpis.map((k, i) => `
    <div class="hero-kpi reveal d${i + 1}">
      <div class="hk-label">${k.label}</div>
      <div class="hk-value num num-lg">
        <span data-count="${k.value}" data-dec="${String(k.value).includes('.') ? 1 : 0}">0</span>
        <span class="num-unit">${k.unit}</span>
      </div>
      <div class="hk-foot">${k.year} · ${k.change}</div>
    </div>`).join('');

  /* ================================================================== 核心论点 */
  const THESIS = [
    { no: '01', t: '改变劳动资料：从机器到"算力+算法"', d: '传统生产工具是机械与电力，人工智能时代的核心生产工具是算力集群与模型算法。它可复制、可迭代、边际成本趋近于零——这是生产力工具史上罕见的属性。' },
    { no: '02', t: '改变劳动对象：数据成为新型生产要素', d: '数据此前只是生产的"副产品"，如今成为可加工、可增值、可复用的直接劳动对象。2024年我国数字经济规模达59.2万亿元，占GDP比重43.8%，正是数据要素化的宏观刻度。' },
    { no: '03', t: '改变劳动者：从操作机器到与智能协同', d: 'AI把重复性认知劳动交给模型，把判断与创造留给人类。世界经济论坛测算，到2030年全球将新增1.7亿个岗位、消失9200万个，净增约7800万个——这是一次结构重组，而非单纯替代。' },
    { no: '04', t: '结果：全要素生产率的大幅提升', d: '前三条的叠加效应，最终体现为全要素生产率的提升——这正是新质生产力被官方定义为"以全要素生产率大幅提升为核心标志"的原因，也是人工智能区别于一般信息化工具的根本所在。' }
  ];
  $('#thesisList').innerHTML = THESIS.map((x) => `
    <div class="thesis-row">
      <div class="tr-no">${x.no}</div>
      <div><h4>${x.t}</h4><p>${x.d}</p></div>
    </div>`).join('');

  /* ================================================================== 第一章 */
  $('#defQuote').innerHTML = D.THEORY.definition
    .replace('创新起主导作用', '<b>创新起主导作用</b>')
    .replace('高科技、高效能、高质量', '<b>高科技、高效能、高质量</b>')
    .replace('以全要素生产率大幅提升为核心标志', '<b>以全要素生产率大幅提升为核心标志</b>');
  $('#defSrc').textContent = D.THEORY.source;

  const ICONS = {
    chip: '<svg viewBox="0 0 24 24" fill="none" stroke="#d8ae4e" stroke-width="1.6" stroke-linecap="round"><rect x="7" y="7" width="10" height="10" rx="2"/><path d="M10 3v4M14 3v4M10 17v4M14 17v4M3 10h4M3 14h4M17 10h4M17 14h4"/></svg>',
    bolt: '<svg viewBox="0 0 24 24" fill="none" stroke="#45cfe8" stroke-width="1.6" stroke-linejoin="round"><path d="M13 2 4.5 13.5H11L10 22l8.5-11.5H12z"/></svg>',
    growth: '<svg viewBox="0 0 24 24" fill="none" stroke="#35c08e" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 17l6-6 4 4 8-8"/><path d="M15 7h6v6"/></svg>'
  };
  $('#featGrid').innerHTML = D.THEORY.features.map((f, i) => `
    <article class="card feat corner reveal d${i + 1}">
      <div class="f-bg">0${i + 1}</div>
      <div class="f-icon">${ICONS[f.icon] || ''}</div>
      <h3><span>${f.key}</span>${f.title.split(' · ')[1] || ''}</h3>
      <p>${f.desc}</p>
      <div class="f-stat">
        <span class="num num-md" data-count="${f.stat.value}" data-dec="${String(f.stat.value).includes('.') ? 1 : 0}">0</span>
        <span class="num-unit" style="font-size:13px">${f.stat.unit}</span>
        <small>${f.stat.label}</small>
      </div>
    </article>`).join('');

  const ELEMENTS = [
    { k: '劳动者', v: '人机协同', d: 'AI承担重复性认知劳动，劳动者转向判断、创造与监督。人才缺口超500万人，反映的是能力结构而非数量短缺。', c: 'var(--blue)' },
    { k: '劳动资料', v: '算力 + 算法', d: '智能算力从2023年的70 EFLOPS增至2025年的1590 EFLOPS；备案大模型从302款增至748款。', c: 'var(--gold)' },
    { k: '劳动对象', v: '数据要素', d: '数据从生产副产品变为直接加工对象。全国在用算力中心机架1085万架，存力超1680 EB。', c: 'var(--cyan)' }
  ];
  $('#threeElements').innerHTML = ELEMENTS.map((e) => `
    <div class="flex gap12 center" style="padding:12px 0;border-bottom:1px dashed var(--line)">
      <span style="width:4px;height:34px;border-radius:3px;background:${e.c};flex-shrink:0"></span>
      <div style="flex:1">
        <div class="flex between center gap12"><b style="font-size:14px">${e.k}</b><span class="num" style="font-size:14px;color:var(--gold)">${e.v}</span></div>
        <p class="tiny muted mt8" style="line-height:1.75">${e.d}</p>
      </div>
    </div>`).join('');

  $('#actionGrid').innerHTML = [
    { v: '6', u: '大重点领域', l: '重点行动' },
    { v: '70', u: '%', l: '2027年应用普及率' },
    { v: '90', u: '%', l: '2030年应用普及率' },
    { v: '2035', u: '', l: '全面步入智能社会' }
  ].map((x) => `
    <div class="card" style="padding:14px;text-align:center;border-radius:10px">
      <div class="num num-md" style="color:var(--gold)">${x.v}<span class="num-unit" style="font-size:11px">${x.u}</span></div>
      <div class="tiny muted mt8" style="line-height:1.5">${x.l}</div>
    </div>`).join('');

  /* ================================================================== 第二章 / 第三章 滚动叙事 */
  function buildScrolly(cfg) {
    const stepsEl = $(cfg.stepsSel), stackEl = $(cfg.stackSel), detailEl = $(cfg.detailSel), footEl = $(cfg.footSel);

    /* 左：文字步 */
    stepsEl.innerHTML = cfg.steps.map((s) => `
      <div class="step" data-i="${s.i}" id="${cfg.prefix}-step-${s.i}">
        <div class="step-no">${s.no}</div>
        <h3>${s.title}</h3>
        <p>${s.text}</p>
        <div class="step-stat">
          <span class="num num-lg" data-count="${s.stat.v}" data-dec="${String(s.stat.v).includes('.') ? 1 : 0}">0</span>
          <span class="num-unit" style="font-size:15px">${s.stat.u}</span>
          <small>${s.stat.l}</small>
        </div>
        <div class="src-line"><b>来源</b> ${s.src}</div>
      </div>`).join('');

    /* 右：堆叠指标行（堆叠式结构） */
    stackEl.innerHTML = cfg.steps.map((s) => `
      <div class="srow ${s.i === 0 ? 'on' : ''}" data-i="${s.i}" role="button" tabindex="0">
        <div class="sr-name">${s.row.name}</div>
        <div class="sr-val">${s.row.value}<small>${s.row.unit}</small></div>
        <div class="sr-spark">${sparkSVG(s.row.series, { type: s.row.type, pct: s.row.pct, log: s.row.log, gap: 5 })}</div>
      </div>`).join('');

    /* 点击堆叠行 → 滚动到对应步 */
    $$('.srow', stackEl).forEach((r) => r.addEventListener('click', () => {
      const t = document.getElementById(cfg.prefix + '-step-' + r.dataset.i);
      if (t) t.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }));

    /* 详情图 */
    let cur = -1;
    const chart = ZQ.EChartsKit.make(detailEl, (inst) => { inst.setOption(cfg.steps[Math.max(0, cur)].detail()); });
    function activate(i, smooth) {
      if (i === cur) return;
      cur = i;
      $$('.srow', stackEl).forEach((r) => r.classList.toggle('on', +r.dataset.i === i));
      $$('.step', stepsEl).forEach((s) => s.classList.toggle('on', +s.dataset.i === i));
      if (chart) chart.setOption(cfg.steps[i].detail(), { notMerge: true, lazyUpdate: true });
      if (footEl) footEl.textContent = '数据来源：' + cfg.steps[i].src;
    }
    /* 首次：主题变化后重绘 */
    ZQ.onTheme(() => { const i = cur; cur = -1; if (chart) { ZQ.EChartsKit.repaint(); } activate(Math.max(0, i)); });

    const io = new IntersectionObserver((ents) => {
      ents.forEach((e) => { if (e.isIntersecting) activate(+e.target.dataset.i); });
    }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });
    $$('.step', stepsEl).forEach((s) => io.observe(s));

    /* 初始激活最靠上的可见步 */
    setTimeout(() => activate(0), 60);
  }

  /* ---- 第二章数据 ---- */
  const v = (arr) => arr;
  buildScrolly({
    prefix: 'base', stepsSel: '#stepsBase', stackSel: '#stackBase', detailSel: '#detailBase', footSel: '#footBase',
    steps: [
      {
        i: 0, no: '02.1 算力总规模', title: '算力总规模：四年间从 140 到 280 EFLOPS',
        text: '算力是人工智能时代最基础的"生产资料供给"。工业和信息化部数据显示，我国算力总规模从2021年的140 EFLOPS增长到2024年底的280 EFLOPS，四年翻了一番，近五年年均增速超过30%，稳居全球第二。',
        stat: { v: 280, u: 'EFLOPS', l: '2024年底算力总规模（FP32口径）' },
        src: '工业和信息化部',
        row: { name: '算力总规模', value: '280', unit: 'EFLOPS', series: [140, 180, 230, 280], type: 'line' },
        detail: () => Object.assign(ZQ.EChartsKit.base(), {
          xAxis: { type: 'category', data: ['2021', '2022', '2023', '2024'], axisLine: { lineStyle: { color: 'var(--line)' } }, axisTick: { show: false }, axisLabel: { color: 'var(--ink-3)', fontSize: 12 } },
          yAxis: { type: 'value', name: 'EFLOPS', nameTextStyle: { color: 'var(--ink-4)', fontSize: 11 }, axisLabel: { color: 'var(--ink-3)', fontSize: 11 }, splitLine: { lineStyle: { color: 'var(--line)', type: 'dashed' } } },
          tooltip: { trigger: 'axis', valueFormatter: (x) => x + ' EFLOPS' },
          series: [{
            type: 'bar', data: [140, 180, 230, 280], barWidth: '46%',
            itemStyle: { borderRadius: [6, 6, 0, 0], color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: '#45cfe8' }, { offset: 1, color: '#2a5ea8' }] } },
            label: { show: true, position: 'top', color: 'var(--ink-2)', fontSize: 12, fontWeight: 700, formatter: '{c}' },
            markPoint: { symbol: 'none' },
            emphasis: { itemStyle: { color: '#d8ae4e' } }
          }]
        })
      },
      {
        i: 1, no: '02.2 智能算力', title: '智能算力：两年内成为绝对增量主力',
        text: '智能算力（面向大模型训练与推理的算力）是人工智能的专用"引擎"。它在算力总规模中的占比由2024年的32%快速上升。请注意：2025年起官方数据改用新的精度口径（FP16），因此 90→1590 的跃升主要来自统计口径变化，不宜直接解读为增速。',
        stat: { v: 1590, u: 'EFLOPS', l: '2025年智能算力规模（新口径）' },
        src: '工业和信息化部',
        row: { name: '智能算力规模', value: '1590', unit: 'EFLOPS', series: [70, 90, 1590, 2185], type: 'line', log: true },
        detail: () => Object.assign(ZQ.EChartsKit.base(), {
          xAxis: { type: 'category', data: ['2023\n旧口径', '2024\n旧口径', '2025\n新口径', '2026H1\n新口径'], axisTick: { show: false }, axisLine: { lineStyle: { color: 'var(--line)' } }, axisLabel: { color: 'var(--ink-3)', fontSize: 11, lineHeight: 15 } },
          yAxis: { type: 'value', name: 'EFLOPS', nameTextStyle: { color: 'var(--ink-4)', fontSize: 11 }, axisLabel: { color: 'var(--ink-3)', fontSize: 11 }, splitLine: { lineStyle: { color: 'var(--line)', type: 'dashed' } } },
          tooltip: { trigger: 'axis', valueFormatter: (x) => x + ' EFLOPS' },
          series: [{
            type: 'bar', barWidth: '46%',
            data: [
              { value: 70, itemStyle: { color: '#2a5ea8', borderRadius: [6, 6, 0, 0] } },
              { value: 90, itemStyle: { color: '#2a5ea8', borderRadius: [6, 6, 0, 0] } },
              { value: 1590, itemStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: '#f3dda0' }, { offset: 1, color: '#a8801a' }] }, borderRadius: [6, 6, 0, 0] } },
              { value: 2185, itemStyle: { color: '#d8ae4e', borderRadius: [6, 6, 0, 0] } }
            ],
            label: { show: true, position: 'top', color: 'var(--ink-2)', fontSize: 11.5, fontWeight: 700 },
            markArea: {
              silent: true,
              itemStyle: { color: 'rgba(200,16,46,.07)' },
              data: [[{ xAxis: '2024\n旧口径', name: '口径变更' }, { xAxis: '2025\n新口径' }]]
            },
            markLine: {
              silent: true, symbol: 'none',
              lineStyle: { color: '#c8102e', type: 'dashed', width: 1 },
              label: { formatter: '统计口径变更', color: '#e8484f', fontSize: 10.5, position: 'insideEndTop' },
              data: [{ xAxis: '2024\n旧口径' }]
            }
          }]
        })
      },
      {
        i: 2, no: '02.3 网络底座', title: '5G 基站：从 13 万到 483.8 万个',
        text: '数据要流动，网络是血管。我国5G基站累计建成数从2019年底的13万个增长到2025年底的483.8万个；"5G+工业互联网"项目已覆盖工业全部41个大类，5G在工业领域应用占比超过60%。没有这样的连接密度，AI的规模落地无从谈起。',
        stat: { v: 483.8, u: '万个', l: '2025年底5G基站累计建成数' },
        src: '工业和信息化部《通信业统计公报》',
        row: { name: '5G基站累计建成', value: '483.8', unit: '万个', series: [13, 71.8, 142.5, 231.2, 337.7, 425.1, 483.8], type: 'line' },
        detail: () => Object.assign(ZQ.EChartsKit.base(), {
          xAxis: { type: 'category', boundaryGap: false, data: ['2019', '2020', '2021', '2022', '2023', '2024', '2025'], axisTick: { show: false }, axisLine: { lineStyle: { color: 'var(--line)' } }, axisLabel: { color: 'var(--ink-3)', fontSize: 11.5 } },
          yAxis: { type: 'value', name: '万个', nameTextStyle: { color: 'var(--ink-4)', fontSize: 11 }, axisLabel: { color: 'var(--ink-3)', fontSize: 11 }, splitLine: { lineStyle: { color: 'var(--line)', type: 'dashed' } } },
          tooltip: { trigger: 'axis', valueFormatter: (x) => x + ' 万个' },
          series: [{
            type: 'line', smooth: true, symbolSize: 7, data: [13, 71.8, 142.5, 231.2, 337.7, 425.1, 483.8],
            lineStyle: { width: 2.6, color: '#45cfe8' },
            itemStyle: { color: '#d8ae4e', borderColor: '#45cfe8', borderWidth: 1.6 },
            areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: 'rgba(69,207,232,.42)' }, { offset: 1, color: 'rgba(69,207,232,0)' }] } },
            label: { show: true, position: 'top', color: 'var(--ink-3)', fontSize: 10.5 }
          }]
        })
      },
      {
        i: 3, no: '02.4 智算集群', title: '万卡级集群与算力枢纽：把算力变成公共供给',
        text: '截至2025年，全国已建成42个万卡级智算集群，在用算力中心机架达1085万标准机架，存力规模超1680 EB。算力正从"企业自建"走向"国家统筹、像水电一样按需供给"，这是生产资料公共化的重要一步。',
        stat: { v: 42, u: '个', l: '已建成万卡级智算集群（2025年）' },
        src: '国家能源局 / 工业和信息化部 / 国家数据局',
        row: { name: '万卡级智算集群', value: '42', unit: '个', series: [42], type: 'meter', pct: 78 },
        detail: () => {
          const items = [
            { name: '万卡级智算集群', val: 42, unit: '个', pct: 78 },
            { name: '算力中心机架', val: 1085, unit: '万架', pct: 92 },
            { name: '存力规模', val: 1680, unit: 'EB', pct: 86 },
            { name: '已发布大模型数', val: 1509, unit: '个', pct: 70 }
          ];
          return Object.assign(ZQ.EChartsKit.base(), {
            grid: { left: 8, right: 60, top: 20, bottom: 8, containLabel: true },
            legend: { show: false },
            tooltip: { show: false },
            xAxis: { type: 'value', max: 100, show: false },
            yAxis: { type: 'category', data: items.map((x) => x.name).reverse(), axisLine: { show: false }, axisTick: { show: false }, axisLabel: { color: 'var(--ink-2)', fontSize: 12 } },
            series: [
              { type: 'bar', silent: true, barWidth: 11, data: items.map(() => 100).reverse(), itemStyle: { color: 'rgba(120,150,200,.13)', borderRadius: 6 }, z: 1 },
              {
                type: 'bar', silent: true, barWidth: 11, z: 2, barGap: '-100%',
                data: items.map((x) => x.pct).reverse(),
                itemStyle: { borderRadius: 6, color: { type: 'linear', x: 0, y: 0, x2: 1, y2: 0, colorStops: [{ offset: 0, color: '#3d7fd6' }, { offset: 1, color: '#d8ae4e' }] } },
                label: { show: true, position: 'right', color: 'var(--ink-2)', fontSize: 12, fontWeight: 700, formatter: (p) => fmt(items.slice().reverse()[p.dataIndex].val) + ' ' + items.slice().reverse()[p.dataIndex].unit }
              }
            ]
          });
        }
      }
    ]
  });

  /* ---- 第三章数据 ---- */
  buildScrolly({
    prefix: 'scale', stepsSel: '#stepsScale', stackSel: '#stackScale', detailSel: '#detailScale', footSel: '#footScale',
    steps: [
      {
        i: 0, no: '03.1 产业规模', title: '产业规模：从 510 亿元到 1.2 万亿元',
        text: '2019年我国人工智能核心产业规模超510亿元，2023年达5784亿元。2024年起中国信通院启用新测算方法，当年"人工智能产业规模"超9000亿元、同比增长24%，2025年超1.2万亿元、同比增长40%。图中刻意保留了断点——口径变化不应被"抹平"。',
        stat: { v: 1.2, u: '万亿元', l: '2025年人工智能产业规模' },
        src: '中国信通院 / 工业和信息化部 / 中国电子学会',
        row: { name: '人工智能产业规模', value: '1.2', unit: '万亿元', series: [510, 3257, 4000, 5080, 5784], type: 'line' },
        detail: () => Object.assign(ZQ.EChartsKit.base(), {
          grid: { left: 8, right: 20, top: 54, bottom: 8, containLabel: true },
          legend: { show: true, data: ['核心产业规模(旧口径)', '产业规模(新口径)', '预测值'] },
          tooltip: {
            trigger: 'axis', formatter: (ps) => {
              const p = ps[0];
              const it = D.SERIES.aiCoreIndustry.data.concat(D.SERIES.aiIndustryNew.data).find((d) => d.y === p.name);
              return ZQ.EChartsKit.tip(p.name + (it && it.forecast ? ' （预测）' : ''), [['规模', fmt(p.value) + ' 亿元'], ['口径', it ? (it.forecast ? '新口径预测' : (['2019', '2020', '2021', '2022', '2023'].includes(p.name) ? '核心产业规模' : '产业规模')) : '—']]);
            }
          },
          xAxis: { type: 'category', data: ['2019', '2020', '2021', '2022', '2023', '2024', '2025', '2027E'], axisTick: { show: false }, axisLine: { lineStyle: { color: 'var(--line)' } }, axisLabel: { color: 'var(--ink-3)', fontSize: 11.5 } },
          yAxis: { type: 'value', name: '亿元', nameTextStyle: { color: 'var(--ink-4)', fontSize: 11 }, axisLabel: { color: 'var(--ink-3)', fontSize: 11 }, splitLine: { lineStyle: { color: 'var(--line)', type: 'dashed' } } },
          series: [
            {
              name: '核心产业规模(旧口径)', type: 'bar', stack: 's', barWidth: '44%',
              data: [510, 3257, 4000, 5080, 5784, null, null, null],
              itemStyle: { color: '#2a5ea8', borderRadius: [6, 6, 0, 0] },
              label: { show: true, position: 'top', color: 'var(--ink-3)', fontSize: 10 }
            },
            {
              name: '产业规模(新口径)', type: 'bar', stack: 's', barWidth: '44%',
              data: [null, null, null, null, null, 9000, 12000, null],
              itemStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: '#f3dda0' }, { offset: 1, color: '#a8801a' }] }, borderRadius: [6, 6, 0, 0] },
              label: { show: true, position: 'top', color: 'var(--ink-2)', fontSize: 10, fontWeight: 700 },
              markLine: {
                silent: true, symbol: ['none', 'none'],
                lineStyle: { color: '#c8102e', type: 'dashed', width: 1.2 },
                label: { formatter: '口径变更', color: '#e8484f', fontSize: 10.5, position: 'end' },
                data: [{ xAxis: '2023' }]
              }
            },
            {
              name: '预测值', type: 'bar', stack: 's', barWidth: '44%',
              data: [null, null, null, null, null, null, null, 20000],
              itemStyle: { color: 'rgba(69,207,232,.45)', borderColor: '#45cfe8', borderWidth: 1.4, borderType: 'dashed', borderRadius: [6, 6, 0, 0] },
              label: { show: true, position: 'top', color: '#45cfe8', fontSize: 10, formatter: '预测 {c}' }
            }
          ]
        })
      },
      {
        i: 1, no: '03.2 经营主体', title: '企业数量：六年间从 2600 家到超 6600 家',
        text: '经营主体是产业生态的细胞。我国人工智能相关企业数量从2019年底的超2600家增长至2026年6月的超6600家，全球占比约15%。北京、广东、上海、浙江、山东五省市合计占比超过80%，产业集聚特征明显。',
        stat: { v: 6600, u: '家', l: '人工智能相关企业数量（2026年6月）' },
        src: '中国信通院 / 工业和信息化部',
        row: { name: '人工智能相关企业', value: '6600', unit: '家', series: [2600, 3000, 4000, 4400, 4500, 5300, 6600], type: 'line' },
        detail: () => Object.assign(ZQ.EChartsKit.base(), {
          xAxis: { type: 'category', data: ['2019', '2021', '2022', '2023', '2024', '2025', '2026H1'], axisTick: { show: false }, axisLine: { lineStyle: { color: 'var(--line)' } }, axisLabel: { color: 'var(--ink-3)', fontSize: 11.5 } },
          yAxis: { type: 'value', name: '家', nameTextStyle: { color: 'var(--ink-4)', fontSize: 11 }, axisLabel: { color: 'var(--ink-3)', fontSize: 11 }, splitLine: { lineStyle: { color: 'var(--line)', type: 'dashed' } } },
          tooltip: { trigger: 'axis', valueFormatter: (x) => '超 ' + fmt(x) + ' 家' },
          series: [{
            type: 'bar', barWidth: '42%', data: [2600, 3000, 4000, 4400, 4500, 5300, 6600],
            itemStyle: { borderRadius: [6, 6, 0, 0], color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: '#8b7fe8' }, { offset: 1, color: '#3d3a9e' }] } },
            label: { show: true, position: 'top', color: 'var(--ink-3)', fontSize: 11 },
            emphasis: { itemStyle: { color: '#d8ae4e' } }
          }]
        })
      },
      {
        i: 2, no: '03.3 模型供给', title: '大模型备案：一年新增 446 款',
        text: '大模型是人工智能的"能力供给端"。截至2025年12月31日，国家网信办累计完成生成式人工智能服务备案748款，当年新增备案446款、新增应用或功能登记330款。模型供给从"百模大战"走向合规化、常态化。',
        stat: { v: 748, u: '款', l: '累计备案生成式AI模型（2025年底）' },
        src: '国家互联网信息办公室',
        row: { name: '备案生成式AI模型', value: '748', unit: '款', series: [302, 439, 538, 611, 748], type: 'line' },
        detail: () => Object.assign(ZQ.EChartsKit.base(), {
          xAxis: { type: 'category', boundaryGap: false, data: ['2024.12', '2025.07', '2025.09', '2025.11', '2025.12'], axisTick: { show: false }, axisLine: { lineStyle: { color: 'var(--line)' } }, axisLabel: { color: 'var(--ink-3)', fontSize: 11.5 } },
          yAxis: { type: 'value', name: '款', nameTextStyle: { color: 'var(--ink-4)', fontSize: 11 }, axisLabel: { color: 'var(--ink-3)', fontSize: 11 }, splitLine: { lineStyle: { color: 'var(--line)', type: 'dashed' } } },
          tooltip: { trigger: 'axis', valueFormatter: (x) => x + ' 款（累计）' },
          series: [{
            type: 'line', smooth: .35, symbolSize: 8, data: [302, 439, 538, 611, 748],
            lineStyle: { width: 3, color: { type: 'linear', x: 0, y: 0, x2: 1, y2: 0, colorStops: [{ offset: 0, color: '#3d7fd6' }, { offset: 1, color: '#d8ae4e' }] } },
            itemStyle: { color: '#d8ae4e', borderColor: 'rgba(255,255,255,.5)', borderWidth: 1.4 },
            areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: 'rgba(216,174,78,.4)' }, { offset: 1, color: 'rgba(216,174,78,0)' }] } },
            label: { show: true, position: 'top', color: 'var(--ink-2)', fontSize: 11.5, fontWeight: 700 }
          }]
        })
      },
      {
        i: 3, no: '03.4 用户规模', title: '7 亿人：生成式AI 成为大众工具',
        text: '技术只有被广泛使用才构成生产力。截至2026年上半年，我国生成式人工智能用户规模突破7亿人，普及率超过50%，其中76.0%的用户用于智能问答。斯坦福HAI的数据显示，生成式AI在3年内达到53%的人口渗透率，速度快于PC与互联网。',
        stat: { v: 7, u: '亿人', l: '生成式AI用户规模（2026H1）' },
        src: '中国互联网络信息中心(CNNIC) / 斯坦福HAI',
        row: { name: '生成式AI用户规模', value: '7', unit: '亿人', series: [50], type: 'meter', pct: 50 },
        detail: () => Object.assign(ZQ.EChartsKit.base(), {
          series: [{
            type: 'gauge', startAngle: 220, endAngle: -40, min: 0, max: 100, radius: '96%', center: ['50%', '62%'],
            progress: { show: true, width: 16, roundCap: true, itemStyle: { color: { type: 'linear', x: 0, y: 0, x2: 1, y2: 1, colorStops: [{ offset: 0, color: '#3d7fd6' }, { offset: 1, color: '#d8ae4e' }] } } },
            axisLine: { lineStyle: { width: 16, color: [[1, 'rgba(120,150,200,.14)']] } },
            pointer: { show: false }, axisTick: { show: false }, splitLine: { show: false }, axisLabel: { show: false },
            anchor: { show: false },
            detail: { valueAnimation: true, offsetCenter: [0, '-2%'], fontSize: 34, fontWeight: 700, color: 'var(--ink)', fontFamily: 'Bahnschrift, sans-serif', formatter: '{value}%' },
            title: { offsetCenter: [0, '26%'], fontSize: 12.5, color: 'var(--ink-3)' },
            data: [{ value: 50, name: '生成式AI普及率（2026H1）' }]
          }],
          graphic: [{
            type: 'text', left: 'center', bottom: 6,
            style: { text: '用户规模 7 亿人 · 76.0% 用于智能问答', fontSize: 12, fill: 'var(--ink-4)', fontFamily: 'PingFang SC, Microsoft YaHei, sans-serif' }
          }]
        })
      }
    ]
  });

  /* ================================================================== 第四章 */
  /* 数字经济：柱 + 折线双轴 */
  ZQ.EChartsKit.make($('#chartDigitalEconomy'), (inst) => {
    const d = D.SERIES.digitalEconomy.data;
    inst.setOption(Object.assign(ZQ.EChartsKit.base(), {
      legend: { data: ['数字经济规模', '占GDP比重'] },
      tooltip: {
        trigger: 'axis', formatter: (ps) => ZQ.EChartsKit.tip(ps[0].name + ' 年', [
          ['数字经济规模', fmt(ps[0].value, 1) + ' 万亿元'],
          ['占GDP比重', (ps[1] ? ps[1].value : '—') + ' %']
        ])
      },
      xAxis: { type: 'category', data: d.map((x) => x.y), axisTick: { show: false }, axisLine: { lineStyle: { color: 'var(--line)', color: 'var(--line)' } }, axisLabel: { color: 'var(--ink-3)', fontSize: 11.5 } },
      yAxis: [
        { type: 'value', name: '万亿元', axisLabel: { color: 'var(--ink-3)', fontSize: 11 }, splitLine: { lineStyle: { color: 'var(--line)', type: 'dashed' } } },
        { type: 'value', min: 30, max: 50, name: '占GDP %', axisLabel: { color: 'var(--ink-3)', fontSize: 11, formatter: '{value}%' }, splitLine: { show: false } }
      ],
      series: [
        {
          name: '数字经济规模', type: 'bar', barWidth: '48%', data: d.map((x) => x.v),
          itemStyle: { borderRadius: [6, 6, 0, 0], color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: '#45cfe8' }, { offset: 1, color: 'rgba(61,127,214,.35)' }] } },
          label: { show: true, position: 'top', color: 'var(--ink-3)', fontSize: 10.5, formatter: '{c}' }
        },
        {
          name: '占GDP比重', type: 'line', yAxisIndex: 1, smooth: true, symbolSize: 8, data: d.map((x) => x.share),
          lineStyle: { width: 2.8, color: '#d8ae4e' }, itemStyle: { color: '#d8ae4e' },
          label: { show: true, position: 'bottom', color: '#d8ae4e', fontSize: 10.5, formatter: '{c}%' }
        }
      ]
    }));
  });

  /* 智能制造：中国的全球位置 */
  ZQ.EChartsKit.make($('#chartRobots'), (inst) => {
    inst.setOption(Object.assign(ZQ.EChartsKit.base(), {
      grid: { left: 8, right: 96, top: 40, bottom: 34, containLabel: true },
      legend: { show: false },
      tooltip: { show: false },
      xAxis: { type: 'value', max: 500, show: false },
      yAxis: {
        type: 'category', data: ['机器人密度\n(台/万人)', '保有量\n(万台)', '安装量\n(万台)'],
        axisLine: { show: false }, axisTick: { show: false }, axisLabel: { color: 'var(--ink-2)', fontSize: 11.5, lineHeight: 15 }
      },
      series: [
        { type: 'bar', silent: true, barWidth: 17, data: [500, 500, 500], itemStyle: { color: 'rgba(120,150,200,.12)', borderRadius: 8 }, z: 1 },
        {
          type: 'bar', silent: true, barWidth: 17, z: 2, barGap: '-100%',
          data: [
            { value: 470, itemStyle: { color: '#d8ae4e' } },
            { value: 202.7, itemStyle: { color: '#3d7fd6' } },
            { value: 29.5, itemStyle: { color: '#45cfe8' } }
          ],
          itemStyle: { borderRadius: 8 },
          label: {
            show: true, position: 'right', color: 'var(--ink-2)', fontSize: 11.5, fontWeight: 700, distance: 8,
            formatter: (p) => ['470 台/万人 · 全球第3', '202.7 万台 · 占全球 43.5%', '29.5 万台 · 占全球 54%'][p.dataIndex]
          }
        }
      ],
      graphic: [{
        type: 'text', left: 6, bottom: 4,
        style: { text: '数据来源：国际机器人联合会(IFR) 《世界机器人》报告 · 2023—2024年', fontSize: 11, fill: 'var(--ink-4)', fontFamily: 'PingFang SC, Microsoft YaHei, sans-serif' }
      }]
    }));
  });

  /* 案例网格 */
  const maxMetric = Math.max.apply(null, D.CASES.map((c) => c.metric));
  $('#caseGrid').innerHTML = D.CASES.map((c, i) => {
    const w = 22 + 74 * (Math.log10(c.metric + 1) / Math.log10(maxMetric + 1));
    return `<article class="card case corner reveal d${(i % 4) + 1}" style="--w:${w.toFixed(1)}%">
      <div class="cs-top">
        <span class="tag gold">${c.industry}</span>
        <span class="cs-org">${c.org}</span>
      </div>
      <h4>${c.title}</h4>
      <div class="cs-metric">
        <span class="num num-lg" data-count="${c.metric}" data-dec="${String(c.metric).includes('.') ? 1 : 0}">0</span>
        <span class="num-unit" style="font-size:14px">${c.metricUnit}</span>
      </div>
      <div class="cs-mlabel">${c.metricLabel}</div>
      <div class="cs-bar"><i></i></div>
      <p>${c.detail}</p>
      <div class="cs-src">来源：${c.src}</div>
    </article>`;
  }).join('');

  /* ================================================================== 第五章 */
  /* WEF 就业瀑布图 */
  ZQ.EChartsKit.make($('#chartJobs'), (inst) => {
    const J = D.JOBS.wef;
    inst.setOption(Object.assign(ZQ.EChartsKit.base(), {
      grid: { left: 8, right: 24, top: 36, bottom: 8, containLabel: true },
      legend: { show: false },
      tooltip: {
        trigger: 'axis', axisPointer: { type: 'shadow' },
        formatter: (ps) => {
          const i = ps[0].dataIndex;
          const info = [
            ['新增岗位', '+' + J.created + ' 百万个', '占当前就业14%'],
            ['消失岗位', '-' + J.lost + ' 百万个', '占当前就业8%'],
            ['净增岗位', '+' + J.net + ' 百万个', '占当前就业7%']
          ][i];
          return ZQ.EChartsKit.tip(info[0], [['规模', info[1]], ['备注', info[2]]]);
        }
      },
      xAxis: {
        type: 'category', data: ['新增岗位', '消失岗位', '净增岗位'],
        axisTick: { show: false }, axisLine: { lineStyle: { color: 'var(--line)' } },
        axisLabel: { color: 'var(--ink-2)', fontSize: 12.5 }
      },
      yAxis: { type: 'value', name: '百万个', nameTextStyle: { color: 'var(--ink-4)', fontSize: 11 }, axisLabel: { color: 'var(--ink-3)', fontSize: 11 }, splitLine: { lineStyle: { color: 'var(--line)', type: 'dashed' } } },
      series: [
        { type: 'bar', stack: 'w', silent: true, itemStyle: { color: 'transparent' }, data: [0, J.net, 0], barWidth: '40%' },
        {
          type: 'bar', stack: 'w', barWidth: '40%',
          data: [
            { value: J.created, itemStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: '#35c08e' }, { offset: 1, color: 'rgba(53,192,142,.35)' }] }, borderRadius: [6, 6, 0, 0] } },
            { value: J.lost, itemStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: '#e8484f' }, { offset: 1, color: 'rgba(200,16,46,.35)' }] }, borderRadius: [6, 6, 0, 0] } },
            { value: J.net, itemStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: '#f3dda0' }, { offset: 1, color: '#a8801a' }] }, borderRadius: [6, 6, 0, 0] } }
          ],
          label: {
            show: true, position: 'top', color: 'var(--ink)', fontSize: 13, fontWeight: 700,
            formatter: (p) => (p.dataIndex === 1 ? '-' : '+') + p.value
          }
        }
      ],
      graphic: [{
        type: 'text', right: 8, top: 4,
        style: { text: '净变动 = +7,800 万', fontSize: 11.5, fill: 'var(--ink-4)', fontFamily: 'PingFang SC, sans-serif' }
      }]
    }));
  });

  /* 人才面板 */
  const T = D.JOBS.talent;
  $('#talentPanel').innerHTML = `
    <div class="grid g-2" style="gap:12px">
      <div class="card" style="padding:16px;border-radius:10px;border-color:rgba(200,16,46,.34)">
        <div class="tiny muted">人才缺口</div>
        <div class="num num-lg mt8" style="color:var(--red-hi)"><span data-count="${T.gap}">0</span><span class="num-unit" style="font-size:13px">万人</span></div>
        <div class="tiny muted mt8">供求比约 ${T.ratio}</div>
      </div>
      <div class="card" style="padding:16px;border-radius:10px">
        <div class="tiny muted">人工智能工程师平均月薪</div>
        <div class="num num-lg mt8" style="color:var(--gold)"><span data-count="${T.salary}">0</span><span class="num-unit" style="font-size:13px">元</span></div>
        <div class="tiny muted mt8">算法工程师需求同比 +${T.algoGrowth}%</div>
      </div>
    </div>
    <p class="small muted mt16" style="line-height:1.9">
      人才缺口反映的不是"岗位数量不足"，而是<strong style="color:var(--ink-2)">能力结构的错配</strong>：
      2025年前三季度，人工智能行业招聘职位数同比仅增长3%，而求职人数同比增长39%，
      但算法工程师等高技能岗位需求仍增长54%。这说明结构性矛盾集中在高端能力供给上。
    </p>`;
  const l = D.JOBS.talent;
  $('#laborShift').innerHTML = [
    { v: '470', u: '台/万人', l: '制造业机器人密度（2023，全球第三）' },
    { v: '202.7', u: '万台', l: '工业机器人保有量（2024，占全球43.5%）' },
    { v: '230', u: '家', l: '卓越级智能工厂（全国已建成）' },
    { v: '50—80', u: '%', l: '自动化产线一线人力精简幅度（案例）' }
  ].map((x) => `
    <div class="card" style="padding:14px;border-radius:10px">
      <div class="num num-md" style="color:var(--gold)">${x.v}<span class="num-unit" style="font-size:11px">${x.u}</span></div>
      <div class="tiny muted mt8" style="line-height:1.55">${x.l}</div>
    </div>`).join('');

  $('#tfpPanel').innerHTML = `
    <div class="caveat" style="border-left-color:var(--cyan);padding:16px 18px">
      <h4 style="font-size:13.5px">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#45cfe8" stroke-width="1.7"><circle cx="12" cy="12" r="9"/><path d="M12 8h.01M11 12h1v5h1"/></svg>
        为什么本站不做"AI对全要素生产率贡献率"的单一数字
      </h4>
      <p style="font-size:12px">${D.TFP.body}</p>
    </div>
    <div class="mt16">
      ${D.TFP.points.map((p) => `
        <div class="vs-row">
          <span class="muted">${p.label}</span>
          <b style="color:var(--gold)">${p.value}</b>
        </div>`).join('')}
    </div>
    <div class="small muted mt16" style="line-height:1.9">
      国际机构测算存在显著分歧：普华永道预计到2030年AI为全球GDP带来15.7万亿美元增量，
      而MIT经济学家Acemoglu测算十年累计提升仅0.93%—1.56%。本报告并列呈现两种判断，
      并倾向于认为：<strong style="color:var(--ink-2)">生产力的最终跃升取决于技术向实体经济的渗透深度，而非技术本身</strong>。
    </div>`;

  /* ================================================================== 第六章 */
  /* 路线图 */
  $('#roadmap').innerHTML = D.ROADMAP.map((r, i) => {
    const R = 56, C = 2 * Math.PI * R;
    const off = C * (1 - r.value / 100);
    return `<article class="card rm-card corner reveal d${i + 1}">
      <span class="tag ${r.year === '2035' ? 'red' : 'gold'} rm-badge">阶段目标</span>
      <div class="rm-ring">
        <svg width="128" height="128" viewBox="0 0 128 128">
          <circle class="rm-track" cx="64" cy="64" r="${R}"/>
          <circle class="rm-prog" cx="64" cy="64" r="${R}" stroke-dasharray="${C.toFixed(1)}" stroke-dashoffset="${C.toFixed(1)}" data-off="${off.toFixed(1)}"/>
        </svg>
        <div class="rm-center">
          <div class="rm-year">${r.year}</div>
          <div class="num" style="font-size:26px;color:var(--gold)">${r.year === '2035' ? '新阶段' : r.value + '%'}</div>
        </div>
      </div>
      <h4>${r.year === '2035' ? '全面步入智能社会' : '应用普及率超 ' + r.value + '%'}</h4>
      <p>${r.desc}</p>
    </article>`;
  }).join('');

  /* 六大行动 环形布局（极坐标定位） */
  (function radial() {
    const el = $('#radial');
    const n = D.SIX_ACTIONS.length;
    const R = 36;                     /* 节点中心距圆心的半径（容器百分比） */
    const nodes = D.SIX_ACTIONS.map((a, i) => {
      const ang = (Math.PI * 2 / n) * i - Math.PI / 2;
      const x = 50 + R * Math.cos(ang);
      const y = 50 + R * Math.sin(ang);
      return `<div class="radial-node" style="left:${x.toFixed(2)}%;top:${y.toFixed(2)}%">
        <div class="rn-inner">
          <div class="rn-ico">0${i + 1}</div>
          <h5>${a.name}</h5>
          <p>${a.desc}</p>
        </div>
      </div>`;
    }).join('');
    el.innerHTML = `
      <svg class="radial-rings" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="16.5" stroke-dasharray="1.6 2.4" stroke-width=".4"/>
        <circle cx="50" cy="50" r="20" stroke-width=".28" stroke-dasharray=".6 1.4"/>
      </svg>
      <div class="radial-core">
        <div>
          <div class="rc-1">人工智能 +</div>
          <div class="rc-2">SIX ACTIONS</div>
        </div>
      </div>
      ${nodes}`;
  })();

  /* 时间轴 */
  $('#timeline').innerHTML = D.POLICIES.map((p) => `
    <div class="tl-item ${p.highlight ? 'hl' : ''} reveal">
      <div class="tl-card card corner">
        <div class="tl-date">${p.date}</div>
        <h4>${p.title}</h4>
        <p>${p.text}</p>
        <div class="tl-tag"><span class="tag ${p.highlight ? 'gold' : ''}">${p.tag}</span></div>
      </div>
      <div class="tl-node"><span class="tl-dot"></span></div>
    </div>`).join('');

  /* ================================================================== 第七章 */
  $('#caveats').innerHTML = D.CALIBER_CAVEATS.map((c, i) => `
    <div class="card caveat reveal d${(i % 3) + 1}">
      <h4>
        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="#e8484f" stroke-width="1.7"><path d="M12 3 2 20h20L12 3z"/><path d="M12 10v4M12 17h.01"/></svg>
        ${c.title}
      </h4>
      <p>${c.detail}</p>
    </div>`).join('');

  /* ================================================================== 收尾 */
  ZQ.chapterNav(D.CHAPTERS.concat([{ id: 'caveat', nav: '数据口径' }]));

  /* 路线图动画 + 揭示 + 数字 */
  const rmIO = new IntersectionObserver((ents) => {
    ents.forEach((e) => {
      if (!e.isIntersecting) return;
      $$('.rm-prog', e.target).forEach((c, i) => {
        setTimeout(() => { c.style.strokeDashoffset = c.dataset.off; }, 220 + i * 260);
      });
      rmIO.unobserve(e.target);
    });
  }, { threshold: .4 });
  const rm = $('#roadmap');
  if (rm) rmIO.observe(rm);

  ZQ.reveal();
  ZQ.autoCount();
  ZQ.tips();
  ZQ.EChartsKit.init();
  /* 图表进入视口后再刷新尺寸，避免 display 变化导致的尺寸错误 */
  setTimeout(() => ZQ.EChartsKit.resize(), 400);
})();
