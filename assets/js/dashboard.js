/* ============================================================================
 *  智启新质 · 响应式数据看板 (dashboard.js)
 *  12 组图表 + 8 张指标卡 + 4 张数据表 + 分类筛选
 * ==========================================================================*/
(function () {
  'use strict';
  const D = window.DATA, ZQ = window.ZQ;
  const { $, $$, fmt } = ZQ;

  ZQ.chrome('dashboard');
  ZQ.Theme.init();

  const C = (n) => (getComputedStyle(document.documentElement).getPropertyValue(n) || '').trim();
  const INK3 = '#6d82a0', INK4 = '#4a5c78';

  /* 梯级色 */
  const GRAD = (a, b) => ({ type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: a }, { offset: 1, color: b }] });
  const GRADX = (a, b) => ({ type: 'linear', x: 0, y: 0, x2: 1, y2: 0, colorStops: [{ offset: 0, color: a }, { offset: 1, color: b }] });

  /* ============================================================ 分类 */
  const CATS = [
    { id: 'all', name: '全部' },
    { id: 'infra', name: '基础设施' },
    { id: 'scale', name: '产业规模' },
    { id: 'innov', name: '创新与效率' },
    { id: 'jobs', name: '就业与人才' },
    { id: 'global', name: '综合对比' }
  ];

  /* ============================================================ 图表定义 */
  const CARDS = [];

  /* ---- 1. AI产业规模（口径断裂） ---- */
  CARDS.push({
    id: 'industry', cat: 'scale', w: 7, title: '人工智能产业规模：两个口径，一条断裂线',
    sub: '2019—2023年为"核心产业规模"口径，2024年起中国信通院启用"产业规模"新口径，二者不可直接衔接',
    src: '中国信通院 / 工业和信息化部 / 中国电子学会', h: 340,
    opt: () => Object.assign(ZQ.EChartsKit.base(), {
      grid: { left: 8, right: 26, top: 66, bottom: 8, containLabel: true },
      legend: { show: true, data: ['核心产业规模（旧口径）', '产业规模（新口径）', '预测值'] },
      tooltip: {
        trigger: 'axis',
        formatter: (ps) => ZQ.EChartsKit.tip(ps[0].name, [
          ['规模', fmt(ps[0].value) + ' 亿元'],
          ['口径', ['2019', '2020', '2021', '2022', '2023'].includes(ps[0].name) ? '核心产业规模（旧）' : (ps[0].name === '2027E' ? '预测（新口径）' : '产业规模（新）')]
        ])
      },
      xAxis: { type: 'category', data: ['2019', '2020', '2021', '2022', '2023', '2024', '2025', '2027E'], axisTick: { show: false }, axisLine: { lineStyle: { color: C('--line') } }, axisLabel: { color: INK3, fontSize: 12 } },
      yAxis: { type: 'value', name: '亿元', axisLabel: { color: INK3, fontSize: 11.5 }, splitLine: { lineStyle: { color: C('--line'), type: 'dashed' } } },
      series: [
        { name: '核心产业规模（旧口径）', type: 'bar', stack: 's', barWidth: '46%', data: [510, 3257, 4000, 5080, 5784, null, null, null], itemStyle: { color: '#2a5ea8', borderRadius: [6, 6, 0, 0] }, label: { show: true, position: 'top', color: INK3, fontSize: 11 } },
        {
          name: '产业规模（新口径）', type: 'bar', stack: 's', barWidth: '46%', data: [null, null, null, null, null, 9000, 12000, null],
          itemStyle: { color: GRAD('#f3dda0', '#a8801a'), borderRadius: [6, 6, 0, 0] },
          label: { show: true, position: 'top', color: 'var(--ink-2)', fontSize: 11.5, fontWeight: 700 },
          markLine: { silent: true, symbol: ['none', 'none'], lineStyle: { color: '#c8102e', type: 'dashed', width: 1.2 }, label: { formatter: '口径变更', color: '#e8484f', fontSize: 11, position: 'end' }, data: [{ xAxis: '2023' }] }
        },
        { name: '预测值', type: 'bar', stack: 's', barWidth: '46%', data: [null, null, null, null, null, null, null, 20000], itemStyle: { color: 'rgba(69,207,232,.42)', borderColor: '#45cfe8', borderWidth: 1.4, borderType: 'dashed', borderRadius: [6, 6, 0, 0] }, label: { show: true, position: 'top', color: '#45cfe8', fontSize: 11, formatter: '预测 {c}' } }
      ]
    })
  });

  /* ---- 2. 增长倍数对比 ---- */
  const MULTIS = [
    { name: '5G基站累计建成', mult: 37.2, period: '2019 → 2025', raw: '13 万个 → 483.8 万个' },
    { name: '人工智能相关企业', mult: 2.5, period: '2019 → 2026', raw: '2,600 家 → 6,600 家' },
    { name: '备案生成式AI模型', mult: 2.5, period: '2024.12 → 2025.12', raw: '302 款 → 748 款' },
    { name: '算力总规模', mult: 2.0, period: '2021 → 2024', raw: '140 → 280 EFLOPS' },
    { name: '数字经济规模', mult: 1.65, period: '2019 → 2024', raw: '35.8 → 59.2 万亿元' },
    { name: '智能算力（可比期间）', mult: 1.29, period: '2023 → 2024 旧口径', raw: '70 → 90 EFLOPS' }
  ];
  CARDS.push({
    id: 'growth', cat: 'global', w: 5, title: '增长倍数：基础设施跑在总量之前',
    sub: '各指标相对基期的增长倍数（无量纲，可比）。5G基站的 37 倍与数字经济的 1.65 倍并列，说明"底座"的扩张速度显著快于经济总量的扩张速度',
    src: '工业和信息化部 / 中国信通院', h: 340,
    opt: () => Object.assign(ZQ.EChartsKit.base(), {
      grid: { left: 8, right: 76, top: 30, bottom: 30, containLabel: true },
      legend: { show: false },
      tooltip: {
        trigger: 'axis', axisPointer: { type: 'shadow' },
        formatter: (ps) => {
          const d = MULTIS.slice().sort((a, b) => a.mult - b.mult)[ps[0].dataIndex];
          return ZQ.EChartsKit.tip(d.name, [['增长倍数', d.mult + ' ×'], ['区间', d.period], ['原始值', d.raw]]);
        }
      },
      xAxis: { type: 'log', min: 1, max: 100, show: false },
      yAxis: { type: 'category', data: MULTIS.slice().sort((a, b) => a.mult - b.mult).map((d) => d.name), axisLine: { show: false }, axisTick: { show: false }, axisLabel: { color: 'var(--ink-2)', fontSize: 11.5 } },
      series: [{
        type: 'bar', barWidth: 17,
        data: MULTIS.slice().sort((a, b) => a.mult - b.mult).map((d) => ({ value: d.mult, itemStyle: { color: d.mult > 3 ? '#d8ae4e' : GRADX('#3d7fd6', '#45cfe8') } })),
        itemStyle: { borderRadius: 8 },
        label: { show: true, position: 'right', color: 'var(--ink-2)', fontSize: 12, fontWeight: 700, distance: 8, formatter: (p) => p.value + ' ×' }
      }],
      graphic: [{ type: 'text', left: 4, bottom: 2, style: { text: '横轴为对数刻度（1×–100×）', fontSize: 11, fill: INK4, fontFamily: 'PingFang SC, sans-serif' } }]
    })
  });

  /* ---- 3. 算力总规模 + 智能算力 ---- */
  CARDS.push({
    id: 'compute', cat: 'infra', w: 6, title: '算力总规模与智能算力',
    sub: '总规模四年翻番；智能算力因统计口径变更出现跨数量级跃升（2025年起为FP16新口径）。纵轴为对数刻度，否则旧口径数据在图中不可见',
    src: '工业和信息化部', h: 320,
    opt: () => Object.assign(ZQ.EChartsKit.base(), {
      grid: { left: 8, right: 30, top: 62, bottom: 8, containLabel: true },
      legend: { data: ['算力总规模', '智能算力'] },
      tooltip: { trigger: 'axis', valueFormatter: (v) => (v === null || v === undefined ? '—' : v + ' EFLOPS') },
      xAxis: { type: 'category', data: ['2021', '2022', '2023', '2024', '2025', '2026H1'], axisTick: { show: false }, axisLine: { lineStyle: { color: C('--line') } }, axisLabel: { color: INK3, fontSize: 12 } },
      yAxis: {
        type: 'log', min: 50, max: 3000, name: 'EFLOPS',
        axisLabel: { color: INK3, fontSize: 11.5, formatter: (v) => (v >= 1000 ? v / 1000 + 'k' : v) },
        splitLine: { lineStyle: { color: C('--line'), type: 'dashed' } }
      },
      series: [
        { name: '算力总规模', type: 'bar', barWidth: '30%', data: [140, 180, 230, 280, null, null], itemStyle: { color: GRAD('#8fb6e8', '#2a5ea8'), borderRadius: [6, 6, 0, 0] }, label: { show: true, position: 'top', color: INK3, fontSize: 10.5 } },
        {
          name: '智能算力', type: 'line', smooth: true, symbolSize: 8, data: [null, null, 70, 90, 1590, 2185],
          lineStyle: { width: 3, color: '#d8ae4e' }, itemStyle: { color: '#d8ae4e' },
          label: { show: true, position: 'top', color: 'var(--ink-2)', fontSize: 11, fontWeight: 700 },
          markLine: {
            silent: true, symbol: 'none', lineStyle: { color: '#c8102e', type: 'dashed', width: 1.1 },
            label: { formatter: '口径变更', color: '#e8484f', fontSize: 10.5, position: 'insideEndTop' },
            data: [{ xAxis: '2024' }]
          }
        }
      ]
    })
  });

  /* ---- 4. 5G基站 ---- */
  CARDS.push({
    id: 'g5', cat: 'infra', w: 6, title: '5G基站累计建成数',
    sub: '从 13 万个增长到 483.8 万个，构建起人工智能规模化落地的连接底座',
    src: '工业和信息化部《通信业统计公报》', h: 320,
    opt: () => Object.assign(ZQ.EChartsKit.base(), {
      grid: { left: 8, right: 26, top: 40, bottom: 8, containLabel: true },
      legend: { show: false },
      tooltip: { trigger: 'axis', valueFormatter: (v) => v + ' 万个' },
      xAxis: { type: 'category', boundaryGap: false, data: D.SERIES.g5.data.map((x) => x.y), axisTick: { show: false }, axisLine: { lineStyle: { color: C('--line') } }, axisLabel: { color: INK3, fontSize: 12 } },
      yAxis: { type: 'value', name: '万个', axisLabel: { color: INK3, fontSize: 11.5 }, splitLine: { lineStyle: { color: C('--line'), type: 'dashed' } } },
      series: [{
        type: 'line', smooth: true, symbolSize: 9, data: D.SERIES.g5.data.map((x) => x.v),
        lineStyle: { width: 3.2, color: GRADX('#3d7fd6', '#45cfe8') },
        itemStyle: { color: '#d8ae4e', borderColor: '#45cfe8', borderWidth: 1.4 },
        areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: 'rgba(69,207,232,.42)' }, { offset: 1, color: 'rgba(69,207,232,0)' }] } },
        label: { show: true, position: 'top', color: INK3, fontSize: 11 }
      }]
    })
  });

  /* ---- 5. 企业数量 ---- */
  CARDS.push({
    id: 'firms', cat: 'scale', w: 6, title: '人工智能相关企业数量',
    sub: '从 2019 年底的 2,600 余家增长至 2026 年 6 月的 6,600 家，全球占比约 15%',
    src: '中国信通院 / 工业和信息化部', h: 300,
    opt: () => Object.assign(ZQ.EChartsKit.base(), {
      grid: { left: 8, right: 26, top: 40, bottom: 8, containLabel: true },
      legend: { show: false },
      tooltip: { trigger: 'axis', valueFormatter: (v) => '超 ' + fmt(v) + ' 家' },
      xAxis: { type: 'category', data: D.SERIES.aiCompanies.data.map((x) => x.y), axisTick: { show: false }, axisLine: { lineStyle: { color: C('--line') } }, axisLabel: { color: INK3, fontSize: 12 } },
      yAxis: { type: 'value', name: '家', axisLabel: { color: INK3, fontSize: 11.5 }, splitLine: { lineStyle: { color: C('--line'), type: 'dashed' } } },
      series: [{
        type: 'bar', barWidth: '44%', data: D.SERIES.aiCompanies.data.map((x) => x.v),
        itemStyle: { borderRadius: [6, 6, 0, 0], color: GRAD('#a79ff0', '#3d3a9e') },
        label: { show: true, position: 'top', color: INK3, fontSize: 11 },
        emphasis: { itemStyle: { color: '#d8ae4e' } }
      }]
    })
  });

  /* ---- 6. 备案大模型 ---- */
  CARDS.push({
    id: 'llm', cat: 'scale', w: 6, title: '累计备案生成式AI模型',
    sub: '截至 2025 年 12 月 31 日累计 748 款，当年新增备案 446 款、新增登记 330 款',
    src: '国家互联网信息办公室', h: 300,
    opt: () => Object.assign(ZQ.EChartsKit.base(), {
      grid: { left: 8, right: 30, top: 40, bottom: 8, containLabel: true },
      legend: { show: false },
      tooltip: { trigger: 'axis', valueFormatter: (v) => v + ' 款（累计）' },
      xAxis: { type: 'category', boundaryGap: false, data: D.SERIES.llmFiling.data.map((x) => x.y), axisTick: { show: false }, axisLine: { lineStyle: { color: C('--line') } }, axisLabel: { color: INK3, fontSize: 12 } },
      yAxis: { type: 'value', name: '款', axisLabel: { color: INK3, fontSize: 11.5 }, splitLine: { lineStyle: { color: C('--line'), type: 'dashed' } } },
      series: [{
        type: 'line', smooth: .35, symbolSize: 10, data: D.SERIES.llmFiling.data.map((x) => x.v),
        lineStyle: { width: 3.4, color: GRADX('#3d7fd6', '#d8ae4e') }, itemStyle: { color: '#d8ae4e' },
        areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: 'rgba(216,174,78,.4)' }, { offset: 1, color: 'rgba(216,174,78,0)' }] } },
        label: { show: true, position: 'top', color: 'var(--ink-2)', fontSize: 12, fontWeight: 700 }
      }]
    })
  });

  /* ---- 7. 数字经济 ---- */
  CARDS.push({
    id: 'de', cat: 'scale', w: 7, title: '数字经济规模及其占 GDP 比重',
    sub: '全口径数字经济规模 2024 年达 59.2 万亿元、占 GDP 43.8%（信通院口径，与"数字经济核心产业增加值"不同）',
    src: '中国信通院《中国数字经济发展研究报告(2025年)》', h: 320,
    opt: () => Object.assign(ZQ.EChartsKit.base(), {
      grid: { left: 8, right: 46, top: 60, bottom: 8, containLabel: true },
      legend: { data: ['数字经济规模', '占GDP比重'] },
      tooltip: {
        trigger: 'axis', formatter: (ps) => ZQ.EChartsKit.tip(ps[0].name + ' 年', [
          ['数字经济规模', fmt(ps[0].value, 1) + ' 万亿元'],
          ['占GDP比重', (ps[1] ? ps[1].value : '—') + ' %']
        ])
      },
      xAxis: { type: 'category', data: D.SERIES.digitalEconomy.data.map((x) => x.y), axisTick: { show: false }, axisLine: { lineStyle: { color: C('--line') } }, axisLabel: { color: INK3, fontSize: 12 } },
      yAxis: [
        { type: 'value', name: '万亿元', axisLabel: { color: INK3, fontSize: 11.5 }, splitLine: { lineStyle: { color: C('--line'), type: 'dashed' } } },
        { type: 'value', min: 30, max: 50, name: '占GDP %', axisLabel: { color: INK3, fontSize: 11.5, formatter: '{value}%' }, splitLine: { show: false } }
      ],
      series: [
        { name: '数字经济规模', type: 'bar', barWidth: '50%', data: D.SERIES.digitalEconomy.data.map((x) => x.v), itemStyle: { borderRadius: [7, 7, 0, 0], color: GRAD('#45cfe8', 'rgba(61,127,214,.3)') }, label: { show: true, position: 'top', color: INK3, fontSize: 11.5 } },
        { name: '占GDP比重', type: 'line', yAxisIndex: 1, smooth: true, symbolSize: 9, data: D.SERIES.digitalEconomy.data.map((x) => x.share), lineStyle: { width: 3, color: '#d8ae4e' }, itemStyle: { color: '#d8ae4e' }, label: { show: true, position: 'top', color: '#d8ae4e', fontSize: 11, formatter: '{c}%' } }
      ]
    })
  });

  /* ---- 8. 工业机器人 ---- */
  CARDS.push({
    id: 'robots', cat: 'innov', w: 5, title: '智能制造：中国在全球的位置',
    sub: '工业机器人安装量占全球 54%，保有量占 43.5%，制造业机器人密度居全球第三',
    src: '国际机器人联合会(IFR)《世界机器人》报告', h: 320,
    opt: () => Object.assign(ZQ.EChartsKit.base(), {
      grid: { left: 8, right: 132, top: 30, bottom: 30, containLabel: true },
      legend: { show: false }, tooltip: { show: false },
      xAxis: { type: 'value', max: 100, show: false },
      yAxis: { type: 'category', data: ['机器人密度', '保有量', '安装量'], axisLine: { show: false }, axisTick: { show: false }, axisLabel: { color: 'var(--ink-2)', fontSize: 12.5 } },
      series: [
        { type: 'bar', silent: true, barWidth: 24, data: [100, 100, 100], itemStyle: { color: 'rgba(120,150,200,.12)', borderRadius: 10 }, z: 1 },
        {
          type: 'bar', silent: true, barWidth: 24, z: 2, barGap: '-100%',
          data: [{ value: 94, itemStyle: { color: '#d8ae4e' } }, { value: 41, itemStyle: { color: '#3d7fd6' } }, { value: 54, itemStyle: { color: '#45cfe8' } }],
          itemStyle: { borderRadius: 10 },
          label: { show: true, position: 'right', color: 'var(--ink-2)', fontSize: 12.5, fontWeight: 700, distance: 10, formatter: (p) => ['470 台/万人 · 全球第3', '202.7 万台 · 占全球43.5%', '29.5 万台 · 占全球54%'][p.dataIndex] }
        }
      ],
      graphic: [{ type: 'text', left: 4, bottom: 2, style: { text: '条形按各项指标的相对水平示意，单位不同', fontSize: 11, fill: INK4, fontFamily: 'PingFang SC, sans-serif' } }]
    })
  });

  /* ---- 9. 效率提升倍率 ---- */
  const EFI = [
    { name: '电力智能巡检（南方电网）', mult: 80, raw: '巡检机器人效率提升近 80 倍' },
    { name: '电网仿真 大瓦特·驭电', mult: 30, raw: '1小时完成全年 8,760 个运行方式仿真，效率提升 30 倍以上' },
    { name: '智能蚕具作业（广西）', mult: 20, raw: '作业效率较人工提升 20 倍' },
    { name: '高速收费站通行（贵州）', mult: 2.25, raw: '出口通行效率提升 125%（换算为 2.25 倍）' },
    { name: '灯塔工厂劳动生产率', mult: 1.5, raw: '新晋灯塔工厂劳动生产率平均提高 50%' },
    { name: '工业X光缺陷检测（中信戴卡）', mult: 1.4, raw: '缺陷识别效率提升 40%' },
    { name: 'AI辅助医学影像诊断', mult: 1.12, raw: '低年资医师读图诊断能力提高约 12%' }
  ];
  CARDS.push({
    id: 'cases', cat: 'innov', w: 7, title: '效率提升倍率：把百分比指标换算到同一把尺子上',
    sub: '将"提升 X%"类指标统一换算为倍率（1 + X%），使不同行业的效率改进可横向比较；成本类指标（药物研发成本降低近一半、单吨钢材成本降97元）不适用倍率表述，未纳入本图',
    src: '人民网 / 世界经济论坛(WEF) 公开报道（2024—2026）', h: 320,
    opt: () => Object.assign(ZQ.EChartsKit.base(), {
      grid: { left: 8, right: 82, top: 30, bottom: 30, containLabel: true },
      legend: { show: false },
      tooltip: {
        trigger: 'axis', axisPointer: { type: 'shadow' },
        formatter: (ps) => {
          const d = EFI.slice().sort((a, b) => a.mult - b.mult)[ps[0].dataIndex];
          return ZQ.EChartsKit.tip(d.name, [['效率倍率', d.mult + ' ×'], ['原始表述', d.raw]]);
        }
      },
      xAxis: { type: 'log', min: 1, max: 100, show: false },
      yAxis: { type: 'category', data: EFI.slice().sort((a, b) => a.mult - b.mult).map((d) => d.name), axisLine: { show: false }, axisTick: { show: false }, axisLabel: { color: 'var(--ink-2)', fontSize: 11.5 } },
      series: [{
        type: 'bar', barWidth: 17,
        data: EFI.slice().sort((a, b) => a.mult - b.mult).map((d) => ({ value: d.mult, itemStyle: { color: d.mult >= 5 ? GRADX('#3d7fd6', '#d8ae4e') : '#3d7fd6' } })),
        itemStyle: { borderRadius: 8 },
        label: { show: true, position: 'right', color: 'var(--ink-2)', fontSize: 12, fontWeight: 700, distance: 8, formatter: (p) => p.value + ' ×' }
      }],
      graphic: [{ type: 'text', left: 4, bottom: 2, style: { text: '横轴为对数刻度；各案例统计时点与统计口径不同，仅作量级参考', fontSize: 11, fill: INK4, fontFamily: 'PingFang SC, sans-serif' } }]
    })
  });

  /* ---- 10. 生成式AI专利分布 ---- */
  CARDS.push({
    id: 'patent', cat: 'innov', w: 5, title: '2024年全球新公开生成式AI专利分布',
    sub: '中国 2.7 万件、占 61.5%，美国 7,592 件居第二（按 WIPO 检索方法统计）',
    src: '世界知识产权组织(WIPO)检索方法 / 澎湃新闻分析', h: 320,
    opt: () => Object.assign(ZQ.EChartsKit.base(), {
      legend: { show: false }, tooltip: {
        trigger: 'item',
        formatter: (p) => ZQ.EChartsKit.tip(p.name, [['专利件数', fmt(p.value) + ' 件'], ['全球占比', p.percent + '%']])
      },
      grid: { left: 8, right: 8, top: 10, bottom: 8, containLabel: true },
      series: [{
        type: 'pie', radius: ['46%', '70%'], center: ['50%', '52%'], avoidLabelOverlap: true,
        itemStyle: { borderColor: C('--bg-0'), borderWidth: 3, borderRadius: 6 },
        label: { show: true, formatter: '{b}\n{d}%', color: 'var(--ink-2)', fontSize: 13, lineHeight: 19 },
        labelLine: { length: 14, length2: 14, lineStyle: { color: C('--line-hi') } },
        data: D.SERIES.genPatent.data.map((x, i) => ({ name: x.name, value: x.value, itemStyle: { color: ['#d8ae4e', '#3d7fd6', '#6e829e'][i] } }))
      }]
    })
  });

  /* ---- 11. 就业结构 ---- */
  CARDS.push({
    id: 'jobs', cat: 'jobs', w: 6, title: '2025—2030年全球就业结构变动（预测）',
    sub: '新增 1.7 亿个岗位、消失 9,200 万个，净增约 7,800 万个；覆盖研究涉及的 12 亿个正式岗位',
    src: '世界经济论坛(WEF)《Future of Jobs Report 2025》· 预测数据', h: 320,
    opt: () => {
      const J = D.JOBS.wef;
      return Object.assign(ZQ.EChartsKit.base(), {
        grid: { left: 8, right: 26, top: 44, bottom: 8, containLabel: true },
        legend: { show: false },
        tooltip: {
          trigger: 'axis', axisPointer: { type: 'shadow' },
          formatter: (ps) => {
            const info = [['新增岗位', '+' + J.created + ' 百万个', '占当前就业 14%'], ['消失岗位', '-' + J.lost + ' 百万个', '占当前就业 8%'], ['净增岗位', '+' + J.net + ' 百万个', '占当前就业 7%']][ps[0].dataIndex];
            return ZQ.EChartsKit.tip(info[0], [['规模', info[1]], ['备注', info[2]]]);
          }
        },
        xAxis: { type: 'category', data: ['新增岗位', '消失岗位', '净增岗位'], axisTick: { show: false }, axisLine: { lineStyle: { color: C('--line') } }, axisLabel: { color: 'var(--ink-2)', fontSize: 13 } },
        yAxis: { type: 'value', name: '百万个', max: 200, interval: 50, axisLabel: { color: INK3, fontSize: 11.5 }, splitLine: { lineStyle: { color: C('--line'), type: 'dashed' } } },
        series: [
          { type: 'bar', stack: 'w', silent: true, itemStyle: { color: 'transparent' }, data: [0, J.net, 0], barWidth: '42%' },
          {
            type: 'bar', stack: 'w', barWidth: '42%',
            data: [
              { value: J.created, itemStyle: { color: GRAD('#35c08e', 'rgba(53,192,142,.3)'), borderRadius: [7, 7, 0, 0] } },
              { value: J.lost, itemStyle: { color: GRAD('#e8484f', 'rgba(200,16,46,.3)'), borderRadius: [7, 7, 0, 0] } },
              { value: J.net, itemStyle: { color: GRAD('#f3dda0', '#a8801a'), borderRadius: [7, 7, 0, 0] } }
            ],
            label: { show: true, position: 'top', color: 'var(--ink)', fontSize: 14, fontWeight: 700, formatter: (p) => (p.dataIndex === 1 ? '-' : '+') + p.value }
          }
        ],
        graphic: [{ type: 'text', right: 12, top: 4, style: { text: '净变动 = +7,800 万', fontSize: 11.5, fill: INK4, fontFamily: 'PingFang SC, sans-serif' } }]
      });
    }
  });

  /* ---- 12. 私营AI投资 ---- */
  CARDS.push({
    id: 'invest', cat: 'global', w: 6, title: '2025年全球私营AI投资额（对数刻度）',
    sub: '美国 2,859 亿美元、英国 45 亿美元、中国 12.4 亿美元 —— 仅含私募与风险投资，不含政府投入与公开市场融资',
    src: '斯坦福大学 HAI《AI Index 2026》', h: 320,
    opt: () => Object.assign(ZQ.EChartsKit.base(), {
      legend: { show: false }, tooltip: { show: false },
      grid: { left: 12, right: 104, top: 34, bottom: 30, containLabel: true },
      xAxis: { type: 'log', min: 1, max: 10000, show: false },
      yAxis: { type: 'category', data: ['中国', '英国', '美国'], axisLine: { show: false }, axisTick: { show: false }, axisLabel: { color: 'var(--ink-2)', fontSize: 13.5, margin: 14 } },
      series: [
        { type: 'bar', silent: true, barWidth: 26, data: [10000, 10000, 10000], itemStyle: { color: 'rgba(120,150,200,.1)', borderRadius: 10 }, z: 1 },
        {
          type: 'bar', silent: true, barWidth: 26, z: 2, barGap: '-100%',
          data: [{ value: 12.4, itemStyle: { color: '#6e829e' } }, { value: 45, itemStyle: { color: '#3d7fd6' } }, { value: 2859, itemStyle: { color: '#d8ae4e' } }],
          itemStyle: { borderRadius: 10 },
          label: { show: true, position: 'right', color: 'var(--ink-2)', fontSize: 13.5, fontWeight: 700, distance: 12, formatter: (p) => ['12.4 亿美元', '45 亿美元', '2,859 亿美元'][p.dataIndex] }
        }
      ],
      graphic: [{ type: 'text', left: 12, bottom: 0, style: { text: '对数刻度：数值相差 230 倍，线性刻度无法同图呈现', fontSize: 11, fill: INK4, fontFamily: 'PingFang SC, sans-serif' } }]
    })
  });

  /* ============================================================ 渲染：KPI */
  const KPI_CATS = ['scale', 'infra', 'scale', 'scale', 'scale', 'scale', 'infra', 'innov'];
  const KPI_COLORS = ['#d8ae4e', '#45cfe8', '#8b7fe8', '#35c08e', '#3d7fd6', '#ef9440', '#6e829e', '#c8102e'];
  /* 来源简称：截取到书名号或斜线之前 */
  const shortSrc = (s) => s.split('《')[0].split('/')[0].split('（')[0].trim();
  $('#kpiGrid').innerHTML = D.KPIS.map((k, i) => `
    <div class="kpi-card reveal d${(i % 4) + 1}" data-cat="${KPI_CATS[i]}" style="--c:${KPI_COLORS[i]}">
      <div class="kc-top">
        <span class="kc-label">${k.label}</span>
        <span class="tag nowrap">${k.year}</span>
      </div>
      <div class="kc-val num num-lg">
        <span data-count="${k.value}" data-dec="${String(k.value).includes('.') ? 1 : 0}">0</span>
        <span class="num-unit">${k.unit}</span>
      </div>
      <div class="kc-foot">
        <span class="up nowrap">${k.change}</span>
        <span class="tr" data-tip="${k.src}">${shortSrc(k.src)}</span>
      </div>
    </div>`).join('');

  /* ============================================================ 渲染：图表卡 */
  $('#dash').innerHTML = CARDS.map((c) => `
    <article class="dcard w${c.w} reveal" data-cat="${c.cat}">
      <div class="dcard-head">
        <h3><i></i>${c.title}</h3>
        <span class="tag ${c.cat === 'infra' ? 'cyan' : c.cat === 'jobs' ? 'green' : 'gold'}">${(CATS.find((x) => x.id === c.cat) || {}).name || ''}</span>
      </div>
      <p class="dcard-sub">${c.sub}</p>
      <div class="chart" id="dc_${c.id}" style="height:${c.h}px"></div>
      <div class="src-line"><b>来源</b> ${c.src}</div>
    </article>`).join('');

  /* 图表实例（延迟到滚动可见时初始化，避免一次性渲染 12 张图） */
  const io = new IntersectionObserver((ents) => {
    ents.forEach((e) => {
      if (!e.isIntersecting) return;
      const id = e.target.dataset.chart;
      const card = CARDS.find((c) => c.id === id);
      if (!card || e.target.dataset.done) return;
      e.target.dataset.done = '1';
      ZQ.EChartsKit.make(e.target, (inst) => inst.setOption(card.opt()));
      io.unobserve(e.target);
    });
  }, { rootMargin: '160px' });
  CARDS.forEach((c) => { const el = $('#dc_' + c.id); if (el) { el.dataset.chart = c.id; io.observe(el); } });

  /* ============================================================ 渲染：筛选 */
  function countOf(cat) { return cat === 'all' ? CARDS.length : CARDS.filter((c) => c.cat === cat).length; }
  $('#chips').innerHTML = CATS.map((c, i) => `
    <button class="chip ${i === 0 ? 'on' : ''}" data-cat="${c.id}">
      ${c.name}<span class="cnt">${countOf(c.id)}</span>
    </button>`).join('');

  let curCat = 'all';
  function applyFilter(cat) {
    curCat = cat;
    $$('#chips .chip').forEach((b) => b.classList.toggle('on', b.dataset.cat === cat));
    $$('.dcard').forEach((el) => el.classList.toggle('hide', cat !== 'all' && el.dataset.cat !== cat));
    $$('.kpi-card').forEach((el) => el.classList.toggle('hidden', cat !== 'all' && el.dataset.cat !== cat));
    setTimeout(() => ZQ.EChartsKit.resize(), 80);
  }
  $('#chips').addEventListener('click', (e) => {
    const b = e.target.closest('.chip');
    if (b) applyFilter(b.dataset.cat);
  });

  /* ============================================================ 数据表视图 */
  (function tables() {
    const th = (t) => `<div class="table-card"><table class="tbl"><caption><i></i>${t}</caption>`;
    let html = '';

    /* A. 核心时间序列 */
    html += `<div class="card card-pad-lg" style="margin-bottom:26px"><table class="tbl"><caption><i></i>A · 核心时间序列（含统计口径）</caption>
      <thead><tr><th>指标</th><th>时点</th><th>数值</th><th>单位</th><th>口径与备注</th><th>数据来源</th></tr></thead><tbody>`;
    const allSeries = [
      ['人工智能核心产业规模（旧口径）', D.SERIES.aiCoreIndustry.data, '亿元', D.SERIES.aiCoreIndustry.note, D.SERIES.aiCoreIndustry.src],
      ['人工智能产业规模（新口径）', D.SERIES.aiIndustryNew.data, '亿元', D.SERIES.aiIndustryNew.note, D.SERIES.aiIndustryNew.src],
      ['人工智能相关企业数量', D.SERIES.aiCompanies.data, '家', D.SERIES.aiCompanies.note, D.SERIES.aiCompanies.src],
      ['算力总规模', D.SERIES.compute.data, 'EFLOPS', D.SERIES.compute.note, D.SERIES.compute.src],
      ['智能算力规模', D.SERIES.smartCompute.data, 'EFLOPS', D.SERIES.smartCompute.note, D.SERIES.smartCompute.src],
      ['累计备案生成式AI模型', D.SERIES.llmFiling.data, '款', D.SERIES.llmFiling.note, D.SERIES.llmFiling.src],
      ['数字经济规模', D.SERIES.digitalEconomy.data, '万亿元', '占GDP比重见括号内百分比', D.SERIES.digitalEconomy.src],
      ['5G基站累计建成数', D.SERIES.g5.data, '万个', '—', D.SERIES.g5.src]
    ];
    allSeries.forEach(([name, rows, unit, note, src]) => {
      rows.forEach((r, i) => {
        html += `<tr>
          ${i === 0 ? `<td rowspan="${rows.length}"><b style="color:var(--ink)">${name}</b></td>` : ''}
          <td class="n">${r.y}</td>
          <td class="n">${fmt(r.v, String(r.v).includes('.') ? 1 : 0)}${r.share ? '（' + r.share + '%）' : ''}${r.forecast ? ' E' : ''}</td>
          <td>${unit}</td>
          ${i === 0 ? `<td rowspan="${rows.length}" style="font-size:12px">${note || '—'}</td>` : ''}
          ${i === 0 ? `<td rowspan="${rows.length}" style="font-size:12px">${src}</td>` : ''}
        </tr>`;
      });
    });
    html += '</tbody></table></div>';

    /* B. 核心指标卡 */
    html += `<div class="card card-pad-lg" style="margin-bottom:26px"><table class="tbl"><caption><i></i>B · 核心指标（最新值）</caption>
      <thead><tr><th>指标</th><th>数值</th><th>单位</th><th>年份</th><th>变化</th><th>数据来源</th></tr></thead><tbody>
      ${D.KPIS.map((k) => `<tr><td><b style="color:var(--ink)">${k.label}</b></td><td class="n">${fmt(k.value, String(k.value).includes('.') ? 1 : 0)}</td><td>${k.unit}</td><td class="n">${k.year}</td><td>${k.change}</td><td style="font-size:12px">${k.src}<br><span class="muted">${k.note}</span></td></tr>`).join('')}
      </tbody></table></div>`;

    /* C. 行业效率案例 */
    html += `<div class="card card-pad-lg" style="margin-bottom:26px"><table class="tbl"><caption><i></i>C · 行业效率提升案例</caption>
      <thead><tr><th>行业</th><th>机构</th><th>案例</th><th>成效数值</th><th>说明</th><th>来源</th></tr></thead><tbody>
      ${D.CASES.map((c) => `<tr><td><span class="tag">${c.industry}</span></td><td>${c.org}</td><td><b style="color:var(--ink)">${c.title}</b></td><td class="n">${c.metric} ${c.metricUnit}</td><td style="font-size:12px">${c.detail}</td><td style="font-size:12px">${c.src}</td></tr>`).join('')}
      </tbody></table></div>`;

    /* D. 国际机构测算 */
    html += `<div class="card card-pad-lg" style="margin-bottom:26px"><table class="tbl"><caption><i></i>D · 国际权威机构测算（区分统计与预测）</caption>
      <thead><tr><th>机构</th><th>指标</th><th>数值</th><th>单位</th><th>时点</th><th>性质</th><th>备注</th></tr></thead><tbody>
      ${D.FORECASTS.map((f) => `<tr>
        <td><b style="color:var(--ink)">${f.org}</b></td><td>${f.label}</td>
        <td class="n">${fmt(f.value, String(f.value).includes('.') ? 1 : 0)}</td><td>${f.unit}</td><td class="n">${f.year}</td>
        <td>${f.forecast ? '<span class="tag red">预测</span>' : '<span class="tag green">统计</span>'}</td>
        <td style="font-size:12px">${f.note}</td></tr>`).join('')}
      </tbody></table></div>`;

    $('#tableWrap').innerHTML = html;
  })();

  /* 视图切换 */
  $('#viewSeg').addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    $$('#viewSeg button').forEach((x) => x.classList.toggle('on', x === b));
    const isTable = b.dataset.view === 'table';
    $('#tableWrap').classList.toggle('on', isTable);
    $('#dash').classList.toggle('off', isTable);
    $('#kpiGrid').classList.toggle('hidden', isTable);
    if (!isTable) setTimeout(() => ZQ.EChartsKit.resize(), 80);
  });

  $('#btnPrint').addEventListener('click', () => window.print());

  /* ============================================================ 脚注 */
  $('#footnotes').innerHTML = D.CALIBER_CAVEATS.map((c, i) => `
    <div class="fn-item">
      <div class="fn-no">${String(i + 1).padStart(2, '0')}</div>
      <div><b style="color:var(--ink-2)">${c.title}</b><br>${c.detail}</div>
    </div>`).join('') + `
    <div class="fn-item">
      <div class="fn-no">06</div>
      <div><b style="color:var(--ink-2)">统计事实与预测数据的区分</b><br>
      本看板中以 <span class="tag red">预测</span> 标记的数据为机构对未来时点的测算或规划目标，不是已发生的统计事实。
      包括：世界经济论坛 2025—2030 年就业变动、普华永道与麦肯锡的长期经济价值测算、中国信通院 2027 年产业规模预测、以及《"人工智能+"行动意见》中的 2027/2030/2035 年目标。</div>
    </div>`;

  /* ============================================================ 收尾 */
  ZQ.reveal();
  ZQ.autoCount();
  ZQ.tips();
  ZQ.EChartsKit.init();
  new ResizeObserver(() => { /* 触发 ECharts 自适应 */ }).observe(document.body);
})();
