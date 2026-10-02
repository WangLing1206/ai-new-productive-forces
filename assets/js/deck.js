/* ============================================================================
 *  智启新质 · 翻页式演示 (deck.js)
 *  17 页横滑式演示：键盘 / 滚轮 / 触屏 / 目录跳转 / 自动播放 / 全屏
 * ==========================================================================*/
(function () {
  'use strict';
  const D = window.DATA, ZQ = window.ZQ;
  const { $, $$, fmt } = ZQ;

  ZQ.chrome('deck');
  ZQ.Theme.init();

  const CAL = (t) => `<div class="caliber-note">
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3 2 20h20L12 3z"/><path d="M12 10v4M12 17h.01"/></svg>
      <div><b>口径提示</b>${t}</div></div>`;

  /* ============================================================ 幻灯片定义 */
  const SLIDES = [];
  const S = (o) => SLIDES.push(o);

  /* ---------- 01 封面 ---------- */
  S({
    nav: '封面', desc: '主题与核心命题',
    head: null,
    cls: 'slide-cover',
    html: `
      <div class="s-body vcenter">
        <div class="cover-inner">
          <div class="eyebrow">数据可视化研究报告 · 2026</div>
          <h1 class="cover-title">智启<span class="accent">新质</span></h1>
          <p class="cover-sub">人工智能，正在成为新质生产力的核心引擎</p>
          <p class="cover-en">AI · New Productive Forces</p>
          <div class="cover-meta">
            <div><b>6 章</b>叙事结构</div>
            <div><b>17 页</b>可视化演示</div>
            <div><b>24 项</b>权威数据来源</div>
            <div><b>2019—2026</b>数据时间跨度</div>
          </div>
          <p class="small muted mt34" style="line-height:1.9">
            使用 <span class="kbd">←</span><span class="kbd">→</span> 或滚轮翻页 ·
            <span class="kbd">S</span> 目录 · <span class="kbd">P</span> 自动播放 · <span class="kbd">F</span> 全屏
          </p>
        </div>
      </div>`,
    foot: null
  });

  /* ---------- 02 核心结论 ---------- */
  S({
    nav: '核心结论', desc: '三个判断',
    chap: '导言', title: '核心结论：为什么人工智能是新质生产力',
    sub: '不是"又一项降本增效的工具"，而是重塑生产力三要素组合方式的通用目的技术',
    tag: 'CONCLUSION',
    html: `
      <div class="s-body">
        <div class="s-cards">
          <div class="s-card on">
            <div class="sc-no">01</div>
            <h5>它是"通用目的技术"</h5>
            <p>像蒸汽机、电力、互联网一样，人工智能可渗透几乎所有行业。这种普遍适用性，是新质生产力所要求的"技术革命性突破"。</p>
          </div>
          <div class="s-card on">
            <div class="sc-no">02</div>
            <h5>它同时改变三要素</h5>
            <p>算力成为新的劳动资料，数据成为新的劳动对象，人机协同重塑劳动者。三者"优化组合的跃升"，正是新质生产力的基本内涵。</p>
          </div>
          <div class="s-card on">
            <div class="sc-no">03</div>
            <h5>它的落点是全要素生产率</h5>
            <p>官方将"全要素生产率大幅提升"作为新质生产力的核心标志。本报告以产业规模、效率改进与就业结构三条证据链来检验这一点。</p>
          </div>
        </div>
        <div class="s-quote mt16">
          <p>${D.THEORY.definition.replace('创新起主导作用', '<b>创新起主导作用</b>').replace('高科技、高效能、高质量', '<b>高科技、高效能、高质量</b>').replace('以全要素生产率大幅提升为核心标志', '<b>以全要素生产率大幅提升为核心标志</b>')}</p>
          <div class="sq-src">习近平在中共中央政治局第十一次集体学习时的讲话 · 2024年1月31日</div>
        </div>
      </div>`,
    foot: '数据来源：中国政府网 / 新华社'
  });

  /* ---------- 03 三重特征 ---------- */
  S({
    nav: '三重特征', desc: '高科技·高效能·高质量',
    chap: '01 理论坐标', title: '三重特征与人工智能的技术属性高度同构',
    sub: '高科技、高效能、高质量 —— 新质生产力的特征，恰是人工智能的技术特征',
    tag: 'THEORY',
    html: `
      <div class="s-body">
        <div class="s-cards" style="grid-template-columns:repeat(3,minmax(0,1fr));gap:16px">
          ${D.THEORY.features.map((f, i) => `
            <div class="s-card ${i === 1 ? 'on' : ''}" style="padding:22px">
              <div class="sc-no">0${i + 1} · ${f.key}</div>
              <h5 style="font-size:16px">${f.title.split(' · ')[1]}</h5>
              <p style="font-size:12.5px;line-height:1.9;margin-top:8px">${f.desc}</p>
              <div style="margin-top:16px;padding-top:14px;border-top:1px dashed var(--line)">
                <span class="num num-md" style="color:var(--gold)">${fmt(f.stat.value, String(f.stat.value).includes('.') ? 1 : 0)}</span>
                <span class="num-unit" style="font-size:12px">${f.stat.unit}</span>
                <div class="tiny muted mt8">${f.stat.label}</div>
              </div>
            </div>`).join('')}
        </div>
      </div>`,
    foot: '数据来源：国务院《关于深入实施"人工智能+"行动的意见》/ 中国信通院 / 世界经济论坛'
  });

  /* ---------- 04 三要素 ---------- */
  S({
    nav: '三要素跃升', desc: '劳动者·劳动资料·劳动对象',
    chap: '01 理论坐标', title: '人工智能如何同时改变生产力三要素',
    sub: '新质生产力"以劳动者、劳动资料、劳动对象及其优化组合的跃升为基本内涵"',
    tag: 'MECHANISM',
    html: `
      <div class="s-body">
        <div class="s-cards" style="grid-template-columns:repeat(3,minmax(0,1fr));gap:16px">
          <div class="s-card" style="padding:22px">
            <div class="sc-no">劳动资料 · MEANS</div>
            <h5 style="font-size:16px">从机器到"算力 + 算法"</h5>
            <p style="font-size:12.5px;margin-top:8px">生产工具从机械、电力演进为算力集群与模型。它可复制、可迭代、边际成本趋近于零。</p>
            <ul class="s-bullets mt16">
              <li><i>→</i><span>算力总规模 <b>280 EFLOPS</b>（2024，四年翻番）</span></li>
              <li><i>→</i><span>智能算力 <b>1,590 EFLOPS</b>（2025）</span></li>
              <li><i>→</i><span>备案大模型 <b>748 款</b>（2025年底）</span></li>
            </ul>
          </div>
          <div class="s-card on" style="padding:22px">
            <div class="sc-no">劳动对象 · OBJECT</div>
            <h5 style="font-size:16px">数据成为新型生产要素</h5>
            <p style="font-size:12.5px;margin-top:8px">数据从生产的"副产品"变为可直接加工、增值、复用的劳动对象。</p>
            <ul class="s-bullets mt16">
              <li><i>→</i><span>数字经济规模 <b>59.2 万亿元</b>（2024）</span></li>
              <li><i>→</i><span>占 GDP 比重 <b>43.8%</b></span></li>
              <li><i>→</i><span>存力规模超 <b>1,680 EB</b></span></li>
            </ul>
          </div>
          <div class="s-card" style="padding:22px">
            <div class="sc-no">劳动者 · LABORER</div>
            <h5 style="font-size:16px">从操作机器到与智能协同</h5>
            <p style="font-size:12.5px;margin-top:8px">重复性认知劳动交给模型，判断与创造留给人。这是一次结构性重组。</p>
            <ul class="s-bullets mt16">
              <li><i>→</i><span>到2030年净增岗位 <b>7,800 万个</b></span></li>
              <li><i>→</i><span>中国AI人才缺口超 <b>500 万人</b></span></li>
              <li><i>→</i><span>制造业机器人密度 <b>470 台/万人</b></span></li>
            </ul>
          </div>
        </div>
      </div>`,
    foot: '数据来源：工业和信息化部 / 中国信通院 / 世界经济论坛 / 人力资源和社会保障部'
  });

  /* ---------- 05 算力总规模 ---------- */
  S({
    nav: '算力总规模', desc: '四年翻一番的基础供给',
    chap: '02 底座跃升', title: '算力总规模：四年间从 140 到 280 EFLOPS',
    sub: '算力是人工智能时代最基础的"生产资料供给"，我国规模稳居全球第二',
    tag: 'INFRASTRUCTURE',
    html: `
      <div class="s-body">
        <div class="s-cols">
          <div class="s-col"><div class="fill-chart" id="d_chartCompute"></div></div>
          <div class="s-col">
            <div class="s-kpi" style="grid-template-columns:repeat(2,1fr)">
              <div><div class="k-l">2021年</div><div class="num num-lg">140<span class="num-unit">EFLOPS</span></div></div>
              <div><div class="k-l">2024年</div><div class="num num-lg">280<span class="num-unit">EFLOPS</span></div></div>
            </div>
            <ul class="s-bullets mt16">
              <li><i>01</i><span>近五年年均增速<b>超过 30%</b>，全球排名第二</span></li>
              <li><i>02</i><span>在用算力中心机架达 <b>1,085 万</b>标准机架</span></li>
              <li><i>03</i><span>已建成 <b>42 个</b>万卡级智算集群（2025）</span></li>
              <li><i>04</i><span>存力规模超 <b>1,680 EB</b>，较2023年增长约40%</span></li>
            </ul>
            <div class="mt16">${CAL('工信部口径为FP32精度标准；2025年起智能算力数据改用新精度口径，不可与前期直接比较。')}</div>
          </div>
        </div>
      </div>`,
    foot: '数据来源：工业和信息化部 / 国家能源局 / 国家数据局',
    charts: [{
      sel: '#d_chartCompute',
      render: (inst) => inst.setOption(Object.assign(ZQ.EChartsKit.base(), {
        grid: { left: 8, right: 30, top: 56, bottom: 8, containLabel: true },
        xAxis: { type: 'category', data: ['2021', '2022', '2023', '2024'], axisTick: { show: false }, axisLine: { lineStyle: { color: 'var(--line)' } }, axisLabel: { color: 'var(--ink-3)', fontSize: 12 } },
        yAxis: { type: 'value', name: 'EFLOPS', axisLabel: { color: 'var(--ink-3)', fontSize: 11.5 }, splitLine: { lineStyle: { color: 'var(--line)', type: 'dashed' } } },
        series: [{
          type: 'bar', data: [140, 180, 230, 280], barWidth: '48%',
          itemStyle: { borderRadius: [8, 8, 0, 0], color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: '#45cfe8' }, { offset: 1, color: '#2a5ea8' }] } },
          label: { show: true, position: 'top', color: 'var(--ink-2)', fontSize: 15, fontWeight: 700 },
          emphasis: { itemStyle: { color: '#d8ae4e' } }
        }]
      }))
    }]
  });

  /* ---------- 06 智能算力 ---------- */
  S({
    nav: '智能算力', desc: '口径变更下的真实增量',
    chap: '02 底座跃升', title: '智能算力：成为算力增长的绝对主力',
    sub: '一个必须说明的口径问题 —— 90 到 1590 的跃升，主要来自统计标准变化',
    tag: 'INFRASTRUCTURE',
    html: `
      <div class="s-body">
        <div class="s-cols">
          <div class="s-col"><div class="fill-chart" id="d_chartSmart"></div></div>
          <div class="s-col">
            <div class="s-card" style="border-color:rgba(200,16,46,.34);background:rgba(200,16,46,.07)">
              <h5 style="color:var(--red-hi);font-size:13.5px">为什么要标注"口径变更"？</h5>
              <p style="margin-top:6px">2023—2024年的智能算力数据为旧精度口径（70、90 EFLOPS），2025年起改用新口径（1590 EFLOPS）。两者相差一个数量级，<b style="color:var(--ink)">直接连线会得出错误的增速结论</b>。</p>
            </div>
            <ul class="s-bullets mt16">
              <li><i>01</i><span>2024年底智能算力占总算力 <b>32%</b></span></li>
              <li><i>02</i><span>2026年6月智能算力 <b>2,185 EFLOPS</b>，同比 +177%</span></li>
              <li><i>03</i><span>《算力基础设施高质量发展行动计划》目标：2025年智能算力占比达 <b>35%</b></span></li>
            </ul>
          </div>
        </div>
      </div>`,
    foot: '数据来源：工业和信息化部 · 国新办发布会 / 六部门《算力基础设施高质量发展行动计划》',
    charts: [{
      sel: '#d_chartSmart',
      render: (inst) => inst.setOption(Object.assign(ZQ.EChartsKit.base(), {
        grid: { left: 8, right: 34, top: 62, bottom: 8, containLabel: true },
        xAxis: {
          type: 'category', data: ['2023\n旧口径', '2024\n旧口径', '2025\n新口径', '2026H1\n新口径'],
          axisTick: { show: false }, axisLine: { lineStyle: { color: 'var(--line)' } }, axisLabel: { color: 'var(--ink-3)', fontSize: 11, lineHeight: 15 }
        },
        yAxis: { type: 'value', name: 'EFLOPS', axisLabel: { color: 'var(--ink-3)', fontSize: 11.5 }, splitLine: { lineStyle: { color: 'var(--line)', type: 'dashed' } } },
        series: [{
          type: 'bar', barWidth: '46%',
          data: [
            { value: 70, itemStyle: { color: '#2a5ea8', borderRadius: [8, 8, 0, 0] } },
            { value: 90, itemStyle: { color: '#2a5ea8', borderRadius: [8, 8, 0, 0] } },
            { value: 1590, itemStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: '#f3dda0' }, { offset: 1, color: '#a8801a' }] }, borderRadius: [8, 8, 0, 0] } },
            { value: 2185, itemStyle: { color: '#d8ae4e', borderRadius: [8, 8, 0, 0] } }
          ],
          label: { show: true, position: 'top', color: 'var(--ink-2)', fontSize: 13, fontWeight: 700 },
          markArea: {
            silent: true, itemStyle: { color: 'rgba(200,16,46,.07)' },
            data: [[{ xAxis: '2024\n旧口径', name: '口径变更' }, { xAxis: '2025\n新口径' }]]
          },
          markLine: {
            silent: true, symbol: 'none', lineStyle: { color: '#c8102e', type: 'dashed', width: 1.2 },
            label: { formatter: '统计口径变更', color: '#e8484f', fontSize: 11, position: 'insideEndTop' },
            data: [{ xAxis: '2024\n旧口径' }]
          }
        }]
      }))
    }]
  });

  /* ---------- 07 网络底座 ---------- */
  S({
    nav: '网络与枢纽', desc: '5G基站与算力枢纽',
    chap: '02 底座跃升', title: '网络与枢纽：数据流动的"血管"与"厂房"',
    sub: '5G基站从 13 万个增长到 483.8 万个；算力从企业自建走向国家统筹供给',
    tag: 'INFRASTRUCTURE',
    html: `
      <div class="s-body">
        <div class="s-cols">
          <div class="s-col"><div class="fill-chart" id="d_chartG5"></div></div>
          <div class="s-col">
            <div class="s-kpi" style="grid-template-columns:repeat(2,1fr)">
              <div><div class="k-l">5G基站（2025年底）</div><div class="num num-md">483.8<span class="num-unit">万个</span></div></div>
              <div><div class="k-l">万卡级智算集群</div><div class="num num-md">42<span class="num-unit">个</span></div></div>
              <div><div class="k-l">算力中心机架</div><div class="num num-md">1,085<span class="num-unit">万架</span></div></div>
              <div><div class="k-l">已发布大模型</div><div class="num num-md">1,509<span class="num-unit">个</span></div></div>
            </div>
            <ul class="s-bullets mt16">
              <li><i>01</i><span>"5G+工业互联网"项目达 <b>8,000 个</b>，覆盖工业全部 41 个大类</span></li>
              <li><i>02</i><span>5G在工业领域应用占比超 <b>60%</b></span></li>
              <li><i>03</i><span>2026年6月5G基站达 <b>510.2 万个</b></span></li>
            </ul>
          </div>
        </div>
      </div>`,
    foot: '数据来源：工业和信息化部《通信业统计公报》/ 国家能源局 / 人民日报',
    charts: [{
      sel: '#d_chartG5',
      render: (inst) => inst.setOption(Object.assign(ZQ.EChartsKit.base(), {
        grid: { left: 8, right: 30, top: 56, bottom: 8, containLabel: true },
        xAxis: { type: 'category', boundaryGap: false, data: ['2019', '2020', '2021', '2022', '2023', '2024', '2025'], axisTick: { show: false }, axisLine: { lineStyle: { color: 'var(--line)' } }, axisLabel: { color: 'var(--ink-3)', fontSize: 12 } },
        yAxis: { type: 'value', name: '万个', axisLabel: { color: 'var(--ink-3)', fontSize: 11.5 }, splitLine: { lineStyle: { color: 'var(--line)', type: 'dashed' } } },
        series: [{
          type: 'line', smooth: true, symbolSize: 9, data: [13, 71.8, 142.5, 231.2, 337.7, 425.1, 483.8],
          lineStyle: { width: 3, color: '#45cfe8' }, itemStyle: { color: '#d8ae4e', borderColor: '#45cfe8', borderWidth: 1.6 },
          areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: 'rgba(69,207,232,.44)' }, { offset: 1, color: 'rgba(69,207,232,0)' }] } },
          label: { show: true, position: 'top', color: 'var(--ink-3)', fontSize: 11 }
        }]
      }))
    }]
  });

  /* ---------- 08 产业规模（口径断裂） ---------- */
  S({
    nav: '产业规模', desc: '510亿 → 1.2万亿',
    chap: '03 规模扩张', title: '产业规模：从 510 亿元到 1.2 万亿元',
    sub: '一条刻意保留断点的曲线 —— 口径变化不应被"抹平"成漂亮增长',
    tag: 'SCALE',
    html: `
      <div class="s-body">
        <div class="s-cols">
          <div class="s-col"><div class="fill-chart" id="d_chartIndustry"></div></div>
          <div class="s-col">
            <div class="s-card on">
              <h5 style="font-size:13.5px">两个口径，两个数字</h5>
              <ul class="s-bullets mt8">
                <li><i>旧</i><span><b>核心产业规模</b>：2023年 <b>5,784 亿元</b></span></li>
                <li><i>新</i><span><b>产业规模</b>：2024年超 <b>9,000 亿元</b>（+24%）</span></li>
                <li><i>新</i><span>2025年超 <b>1.2 万亿元</b>（+40%）</span></li>
                <li><i>测</i><span>2027年预计 <b>2 万亿元</b>（信通院预测）</span></li>
              </ul>
            </div>
            <p class="small muted mt16" style="line-height:1.9">
              若把两个口径强行连线，会得出 5784→9000 的"同比+55%"错误结论。
              本站选择在图中央画出断裂标记，并注明原因。
            </p>
          </div>
        </div>
      </div>`,
    foot: '数据来源：中国信通院 / 工业和信息化部 / 中国电子学会 · 2027年为预测值',
    charts: [{
      sel: '#d_chartIndustry',
      render: (inst) => inst.setOption(Object.assign(ZQ.EChartsKit.base(), {
        grid: { left: 8, right: 30, top: 66, bottom: 8, containLabel: true },
        legend: { show: true, data: ['核心产业规模(旧口径)', '产业规模(新口径)', '预测值'] },
        xAxis: { type: 'category', data: ['2019', '2020', '2021', '2022', '2023', '2024', '2025', '2027E'], axisTick: { show: false }, axisLine: { lineStyle: { color: 'var(--line)' } }, axisLabel: { color: 'var(--ink-3)', fontSize: 12 } },
        yAxis: { type: 'value', name: '亿元', axisLabel: { color: 'var(--ink-3)', fontSize: 11.5 }, splitLine: { lineStyle: { color: 'var(--line)', type: 'dashed' } } },
        series: [
          { name: '核心产业规模(旧口径)', type: 'bar', stack: 's', barWidth: '46%', data: [510, 3257, 4000, 5080, 5784, null, null, null], itemStyle: { color: '#2a5ea8', borderRadius: [6, 6, 0, 0] }, label: { show: true, position: 'top', color: 'var(--ink-3)', fontSize: 11 } },
          {
            name: '产业规模(新口径)', type: 'bar', stack: 's', barWidth: '46%', data: [null, null, null, null, null, 9000, 12000, null],
            itemStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: '#f3dda0' }, { offset: 1, color: '#a8801a' }] }, borderRadius: [6, 6, 0, 0] },
            label: { show: true, position: 'top', color: 'var(--ink-2)', fontSize: 11, fontWeight: 700 },
            markLine: { silent: true, symbol: ['none', 'none'], lineStyle: { color: '#c8102e', type: 'dashed', width: 1.2 }, label: { formatter: '口径变更', color: '#e8484f', fontSize: 11, position: 'end' }, data: [{ xAxis: '2023' }] }
          },
          { name: '预测值', type: 'bar', stack: 's', barWidth: '46%', data: [null, null, null, null, null, null, null, 20000], itemStyle: { color: 'rgba(69,207,232,.42)', borderColor: '#45cfe8', borderWidth: 1.4, borderType: 'dashed', borderRadius: [6, 6, 0, 0] }, label: { show: true, position: 'top', color: '#45cfe8', fontSize: 11, formatter: '预测 {c}' } }
        ]
      }))
    }]
  });

  /* ---------- 09 经营主体与模型供给 ---------- */
  S({
    nav: '企业与模型', desc: '6600家企业 / 748款模型',
    chap: '03 规模扩张', title: '经营主体与模型供给：生态的双向扩张',
    sub: '企业数量六年增长约1.5倍；备案大模型一年新增446款',
    tag: 'SCALE',
    html: `
      <div class="s-body">
        <div class="s-cols even">
          <div class="s-col">
            <div class="card-title" style="font-size:14px"><span class="dot"></span>人工智能相关企业数量</div>
            <div class="fill-chart" id="d_chartFirms"></div>
          </div>
          <div class="s-col">
            <div class="card-title" style="font-size:14px"><span class="dot"></span>累计备案生成式AI模型</div>
            <div class="fill-chart" id="d_chartLLM"></div>
          </div>
        </div>
      </div>`,
    foot: '数据来源：中国信通院 / 工业和信息化部 / 国家互联网信息办公室',
    charts: [
      {
        sel: '#d_chartFirms',
        render: (inst) => inst.setOption(Object.assign(ZQ.EChartsKit.base(), {
          grid: { left: 8, right: 26, top: 44, bottom: 8, containLabel: true }, legend: { show: false },
          xAxis: { type: 'category', data: ['2019', '2021', '2022', '2023', '2024', '2025', '2026H1'], axisTick: { show: false }, axisLine: { lineStyle: { color: 'var(--line)' } }, axisLabel: { color: 'var(--ink-3)', fontSize: 11 } },
          yAxis: { type: 'value', name: '家', axisLabel: { color: 'var(--ink-3)', fontSize: 11 }, splitLine: { lineStyle: { color: 'var(--line)', type: 'dashed' } } },
          series: [{ type: 'bar', barWidth: '44%', data: [2600, 3000, 4000, 4400, 4500, 5300, 6600], itemStyle: { borderRadius: [6, 6, 0, 0], color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: '#8b7fe8' }, { offset: 1, color: '#3d3a9e' }] } }, label: { show: true, position: 'top', color: 'var(--ink-3)', fontSize: 11 }, emphasis: { itemStyle: { color: '#d8ae4e' } } }]
        }))
      },
      {
        sel: '#d_chartLLM',
        render: (inst) => inst.setOption(Object.assign(ZQ.EChartsKit.base(), {
          grid: { left: 8, right: 30, top: 44, bottom: 8, containLabel: true }, legend: { show: false },
          xAxis: { type: 'category', boundaryGap: false, data: ['2024.12', '2025.07', '2025.09', '2025.11', '2025.12'], axisTick: { show: false }, axisLine: { lineStyle: { color: 'var(--line)' } }, axisLabel: { color: 'var(--ink-3)', fontSize: 11 } },
          yAxis: { type: 'value', name: '款', axisLabel: { color: 'var(--ink-3)', fontSize: 11 }, splitLine: { lineStyle: { color: 'var(--line)', type: 'dashed' } } },
          series: [{
            type: 'line', smooth: .35, symbolSize: 10, data: [302, 439, 538, 611, 748],
            lineStyle: { width: 3.4, color: { type: 'linear', x: 0, y: 0, x2: 1, y2: 0, colorStops: [{ offset: 0, color: '#3d7fd6' }, { offset: 1, color: '#d8ae4e' }] } },
            itemStyle: { color: '#d8ae4e' },
            areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: 'rgba(216,174,78,.4)' }, { offset: 1, color: 'rgba(216,174,78,0)' }] } },
            label: { show: true, position: 'top', color: 'var(--ink-2)', fontSize: 12, fontWeight: 700 }
          }]
        }))
      }
    ]
  });

  /* ---------- 10 用户规模 ---------- */
  S({
    nav: '用户规模', desc: '7亿人使用生成式AI',
    chap: '03 规模扩张', title: '7 亿人：技术只有被广泛使用才构成生产力',
    sub: '生成式人工智能用户规模突破7亿人，普及率超过50%',
    tag: 'DIFFUSION',
    html: `
      <div class="s-body">
        <div class="s-cols rev">
          <div class="s-col">
            <div class="fill-chart" id="d_chartUser"></div>
          </div>
          <div class="s-col">
            <ul class="s-bullets">
              <li><i>01</i><span>生成式AI用户规模突破 <b>7 亿人</b>，普及率超 <b>50%</b>（2026年上半年，CNNIC）</span></li>
              <li><i>02</i><span><b>76.0%</b> 的用户将生成式AI用于智能问答</span></li>
              <li><i>03</i><span>斯坦福HAI：生成式AI在 <b>3 年内</b>达到 <b>53%</b> 人口渗透率，快于PC与互联网</span></li>
              <li><i>04</i><span>组织实施AI的比例从 78% 升至 <b>88%</b>（2024→2025）</span></li>
            </ul>
            <div class="s-quote mt16">
              <p>技术扩散的速度，决定了生产力释放的速度。生成式AI用三年走完了互联网十余年的用户渗透曲线——<b>这是"新质"最直观的含义</b>。</p>
            </div>
          </div>
        </div>
      </div>`,
    foot: '数据来源：中国互联网络信息中心(CNNIC) / 斯坦福大学 HAI《AI Index 2026》',
    charts: [{
      sel: '#d_chartUser',
      render: (inst) => inst.setOption(Object.assign(ZQ.EChartsKit.base(), {
        series: [{
          type: 'gauge', startAngle: 220, endAngle: -40, min: 0, max: 100, radius: '88%', center: ['50%', '58%'],
          progress: { show: true, width: 22, roundCap: true, itemStyle: { color: { type: 'linear', x: 0, y: 0, x2: 1, y2: 1, colorStops: [{ offset: 0, color: '#3d7fd6' }, { offset: 1, color: '#d8ae4e' }] } } },
          axisLine: { lineStyle: { width: 22, color: [[1, 'rgba(120,150,200,.14)']] } },
          pointer: { show: false }, axisTick: { show: false }, splitLine: { show: false }, axisLabel: { show: false }, anchor: { show: false },
          detail: { offsetCenter: [0, '-4%'], fontSize: 56, fontWeight: 700, color: 'var(--ink)', fontFamily: 'Bahnschrift, sans-serif', formatter: '{value}%' },
          title: { offsetCenter: [0, '26%'], fontSize: 14, color: 'var(--ink-3)' },
          data: [{ value: 50, name: '生成式AI普及率（2026上半年）' }]
        }],
        graphic: [{
          type: 'text', left: 'center', bottom: '8%',
          style: { text: '用户规模 7 亿人 · 76.0%用于智能问答', fontSize: 14, fill: 'var(--ink-4)', fontFamily: 'PingFang SC, Microsoft YaHei, sans-serif' }
        }]
      }))
    }]
  });

  /* ---------- 11 数字经济 ---------- */
  S({
    nav: '数字经济', desc: '占GDP 43.8%的产业母体',
    chap: '04 产业转型', title: '数字经济：人工智能所嵌入的产业母体',
    sub: '2024年我国数字经济规模 59.2 万亿元，占GDP比重 43.8%',
    tag: 'INDUSTRY',
    html: `
      <div class="s-body">
        <div class="s-cols">
          <div class="s-col"><div class="fill-chart" id="d_chartDE"></div></div>
          <div class="s-col">
            <div class="s-kpi" style="grid-template-columns:1fr">
              <div><div class="k-l">数字经济规模（2024）</div><div class="num num-lg">59.2<span class="num-unit">万亿元</span></div></div>
              <div><div class="k-l">数字经济核心产业增加值（2024）</div><div class="num num-lg">14.09<span class="num-unit">万亿元</span></div></div>
            </div>
            <div class="mt16">${CAL('59.2万亿元为"全口径数字经济规模"（信通院）；14.09万亿元为国家统计局核算的"数字经济核心产业增加值"、占GDP 10.5%。两者含义不同，不可混用。')}</div>
          </div>
        </div>
      </div>`,
    foot: '数据来源：中国信通院《中国数字经济发展研究报告(2025年)》/ 国家统计局',
    charts: [{
      sel: '#d_chartDE',
      render: (inst) => inst.setOption(Object.assign(ZQ.EChartsKit.base(), {
        grid: { left: 8, right: 46, top: 60, bottom: 8, containLabel: true },
        legend: { data: ['数字经济规模', '占GDP比重'] },
        xAxis: { type: 'category', data: D.SERIES.digitalEconomy.data.map((x) => x.y), axisTick: { show: false }, axisLine: { lineStyle: { color: 'var(--line)' } }, axisLabel: { color: 'var(--ink-3)', fontSize: 12 } },
        yAxis: [
          { type: 'value', name: '万亿元', axisLabel: { color: 'var(--ink-3)', fontSize: 11.5 }, splitLine: { lineStyle: { color: 'var(--line)', type: 'dashed' } } },
          { type: 'value', min: 30, max: 50, name: '占GDP %', axisLabel: { color: 'var(--ink-3)', fontSize: 11.5, formatter: '{value}%' }, splitLine: { show: false } }
        ],
        series: [
          { name: '数字经济规模', type: 'bar', barWidth: '50%', data: D.SERIES.digitalEconomy.data.map((x) => x.v), itemStyle: { borderRadius: [7, 7, 0, 0], color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: '#45cfe8' }, { offset: 1, color: 'rgba(61,127,214,.32)' }] } }, label: { show: true, position: 'top', color: 'var(--ink-3)', fontSize: 11.5 } },
          { name: '占GDP比重', type: 'line', yAxisIndex: 1, smooth: true, symbolSize: 9, data: D.SERIES.digitalEconomy.data.map((x) => x.share), lineStyle: { width: 3, color: '#d8ae4e' }, itemStyle: { color: '#d8ae4e' }, label: { show: true, position: 'top', color: '#d8ae4e', fontSize: 11, formatter: '{c}%' } }
        ]
      }))
    }]
  });

  /* ---------- 12 智能制造 ---------- */
  S({
    nav: '智能制造', desc: '中国在全球的位置',
    chap: '04 产业转型', title: '智能制造：中国在全球产业格局中的位置',
    sub: '工业机器人是"人工智能+制造"最直观的物理载体',
    tag: 'INDUSTRY',
    html: `
      <div class="s-body">
        <div class="s-cols">
          <div class="s-col"><div class="fill-chart" id="d_chartRobots"></div></div>
          <div class="s-col">
            <ul class="s-bullets">
              <li><i>01</i><span>2024年中国工业机器人安装量 <b>29.5 万台</b>，占全球 <b>54%</b></span></li>
              <li><i>02</i><span>保有量 <b>202.7 万台</b>，占全球 <b>43.5%</b>，连续多年全球第一</span></li>
              <li><i>03</i><span>制造业机器人密度 <b>470 台/万名员工</b>，全球第三（超德、日）</span></li>
              <li><i>04</i><span>已建成基础级智能工厂超 <b>3.5 万家</b>、先进级 7,000 余家、卓越级 230 家</span></li>
            </ul>
            <div class="mt16">${CAL('"制造业机器人密度"全球排名依据IFR《世界机器人报告》；智能工厂分级依据工业和信息化部"十四五"数读口径。')}</div>
          </div>
        </div>
      </div>`,
    foot: '数据来源：国际机器人联合会(IFR)《世界机器人》报告 / 工业和信息化部',
    charts: [{
      sel: '#d_chartRobots',
      render: (inst) => inst.setOption(Object.assign(ZQ.EChartsKit.base(), {
        grid: { left: 8, right: 130, top: 40, bottom: 34, containLabel: true },
        legend: { show: false }, tooltip: { show: false },
        xAxis: { type: 'value', max: 100, show: false },
        yAxis: { type: 'category', data: ['机器人密度(台/万人)', '保有量(万台)', '安装量(万台)'], axisLine: { show: false }, axisTick: { show: false }, axisLabel: { color: 'var(--ink-2)', fontSize: 12.5 } },
        series: [
          { type: 'bar', silent: true, barWidth: 24, data: [100, 100, 100], itemStyle: { color: 'rgba(120,150,200,.12)', borderRadius: 10 }, z: 1 },
          {
            type: 'bar', silent: true, barWidth: 24, z: 2, barGap: '-100%',
            data: [
              { value: 94, itemStyle: { color: '#d8ae4e' } },
              { value: 41, itemStyle: { color: '#3d7fd6' } },
              { value: 54, itemStyle: { color: '#45cfe8' } }
            ],
            itemStyle: { borderRadius: 10 },
            label: { show: true, position: 'right', color: 'var(--ink-2)', fontSize: 13, fontWeight: 700, distance: 10, formatter: (p) => ['470 台/万人 · 全球第3', '202.7 万台 · 占全球 43.5%', '29.5 万台 · 占全球 54%'][p.dataIndex] }
          }
        ]
      }))
    }]
  });

  /* ---------- 13 行业效率样本 ---------- */
  S({
    nav: '行业效率样本', desc: '八个真实场景的效率改进',
    chap: '04 产业转型', title: '行业微观样本：效率提升的八个切片',
    sub: '从电网仿真到蚕桑养殖，人工智能的生产力效应具有跨行业普遍性',
    tag: 'CASES',
    html: `<div class="s-body" id="d_cases"></div>`,
    foot: '数据来源：人民网 / 世界经济论坛(WEF) 公开报道（2024—2026）· 条形长度为量级示意，各案例单位不同，不可横向精确比较',
    after: () => {
      const max = Math.max.apply(null, D.CASES.map((c) => c.metric));
      $('#d_cases').innerHTML = `
        <div class="s-cards" style="grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;flex:1;align-content:stretch">
          ${D.CASES.map((c) => {
            const w = 24 + 72 * (Math.log10(c.metric + 1) / Math.log10(max + 1));
            return `<div class="s-card" style="display:flex;flex-direction:column;padding:16px">
              <div class="sc-no">${c.industry}</div>
              <h5 style="font-size:14px;margin-bottom:10px">${c.title}</h5>
              <div><span class="num num-lg" style="color:var(--gold)">${c.metric}</span><span class="num-unit" style="font-size:12px">${c.metricUnit}</span></div>
              <div class="tiny muted mt8" style="margin-bottom:12px">${c.metricLabel}</div>
              <div style="height:3px;border-radius:3px;background:color-mix(in srgb,var(--ink) 10%,transparent);overflow:hidden;margin-bottom:12px">
                <i style="display:block;height:100%;width:${w.toFixed(0)}%;border-radius:3px;background:linear-gradient(90deg,var(--blue),var(--gold))"></i>
              </div>
              <p style="font-size:11.5px;line-height:1.75;flex:1">${c.detail}</p>
              <div class="tiny" style="color:var(--ink-4);margin-top:10px">来源：${c.src}</div>
            </div>`;
          }).join('')}
        </div>`;
    }
  });

  /* ---------- 14 就业结构 ---------- */
  S({
    nav: '就业结构', desc: '净增7800万个岗位',
    chap: '05 人的维度', title: '就业结构：不是简单替代，而是结构性重组',
    sub: '世界经济论坛测算：到2030年全球新增1.7亿个岗位、消失9,200万个，净增约7,800万个',
    tag: 'EMPLOYMENT',
    html: `
      <div class="s-body">
        <div class="s-cols">
          <div class="s-col"><div class="fill-chart" id="d_chartJobs"></div></div>
          <div class="s-col">
            <ul class="s-bullets">
              <li><i>01</i><span>结构性劳动力市场变动达 <b>22%</b>，涉及研究覆盖的 <b>12 亿</b>个正式岗位</span></li>
              <li><i>02</i><span>员工 <b>39%</b> 的现有技能将被改变或过时</span></li>
              <li><i>03</i><span><b>85%</b> 的雇主计划优先提升员工技能，40% 预计因技能过时减员</span></li>
              <li><i>04</i><span>"AI与大数据"位列增长最快技能 <b>第一</b></span></li>
            </ul>
            <div class="mt16">${CAL('本页数据为世界经济论坛对2025—2030年的预测值，非已发生的统计事实。')}</div>
          </div>
        </div>
      </div>`,
    foot: '数据来源：世界经济论坛(WEF)《Future of Jobs Report 2025》· <b>预测数据</b>',
    charts: [{
      sel: '#d_chartJobs',
      render: (inst) => {
        const J = D.JOBS.wef;
        inst.setOption(Object.assign(ZQ.EChartsKit.base(), {
          grid: { left: 8, right: 30, top: 50, bottom: 8, containLabel: true }, legend: { show: false },
          xAxis: { type: 'category', data: ['新增岗位', '消失岗位', '净增岗位'], axisTick: { show: false }, axisLine: { lineStyle: { color: 'var(--line)' } }, axisLabel: { color: 'var(--ink-2)', fontSize: 13.5 } },
          yAxis: { type: 'value', name: '百万个', max: 200, interval: 50, axisLabel: { color: 'var(--ink-3)', fontSize: 11.5 }, splitLine: { lineStyle: { color: 'var(--line)', type: 'dashed' } } },
          series: [
            { type: 'bar', stack: 'w', silent: true, itemStyle: { color: 'transparent' }, data: [0, J.net, 0], barWidth: '42%' },
            {
              type: 'bar', stack: 'w', barWidth: '42%',
              data: [
                { value: J.created, itemStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: '#35c08e' }, { offset: 1, color: 'rgba(53,192,142,.32)' }] }, borderRadius: [7, 7, 0, 0] } },
                { value: J.lost, itemStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: '#e8484f' }, { offset: 1, color: 'rgba(200,16,46,.32)' }] }, borderRadius: [7, 7, 0, 0] } },
                { value: J.net, itemStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: '#f3dda0' }, { offset: 1, color: '#a8801a' }] }, borderRadius: [7, 7, 0, 0] } }
              ],
              label: { show: true, position: 'top', color: 'var(--ink)', fontSize: 15, fontWeight: 700, formatter: (p) => (p.dataIndex === 1 ? '-' : '+') + p.value }
            }
          ]
        }));
      }
    }]
  });

  /* ---------- 15 国际对比 ---------- */
  S({
    nav: '国际对比', desc: '专利优势与投资差距',
    chap: '05 人的维度', title: '国际对比：优势在专利，差距在资本',
    sub: '同一份报告里的两组数字，说的是完全不同的故事',
    tag: 'GLOBAL',
    html: `
      <div class="s-body">
        <div class="s-cols even">
          <div class="s-col">
            <div class="card-title" style="font-size:14px"><span class="dot"></span>2024年全球新公开生成式AI专利分布</div>
            <div class="fill-chart" id="d_chartPatent"></div>
          </div>
          <div class="s-col">
            <div class="card-title" style="font-size:14px"><span class="dot"></span>2025年全球私营AI投资额（亿美元）</div>
            <div class="fill-chart" id="d_chartInvest"></div>
          </div>
        </div>
        <div>${CAL('"私营AI投资"仅含私募与风险投资，不含政府投入与公开市场融资；与国内常引用的AI投融资总额口径不可直接比较。两份数据均来自斯坦福HAI《AI Index》，但统计对象不同。')}</div>
      </div>`,
    foot: '数据来源：世界知识产权组织(WIPO)检索方法 / 斯坦福大学 HAI《AI Index 2026》',
    charts: [
      {
        sel: '#d_chartPatent',
        render: (inst) => inst.setOption(Object.assign(ZQ.EChartsKit.base(), {
          legend: { show: false }, tooltip: { show: false }, grid: { left: 8, right: 8, top: 20, bottom: 8, containLabel: true },
          series: [{
            type: 'pie', radius: ['46%', '70%'], center: ['50%', '50%'], avoidLabelOverlap: true,
            itemStyle: { borderColor: 'var(--bg-0)', borderWidth: 3, borderRadius: 6 },
            label: { show: true, formatter: '{b}\n{d}%', color: 'var(--ink-2)', fontSize: 13, lineHeight: 19 },
            labelLine: { length: 14, length2: 14, lineStyle: { color: 'var(--line-hi)' } },
            data: D.SERIES.genPatent.data.map((x, i) => ({ name: x.name, value: x.value, itemStyle: { color: ['#d8ae4e', '#3d7fd6', '#6e829e'][i] } }))
          }]
        }))
      },
      {
        sel: '#d_chartInvest',
        render: (inst) => inst.setOption(Object.assign(ZQ.EChartsKit.base(), {
          legend: { show: false }, tooltip: { show: false },
          grid: { left: 12, right: 96, top: 40, bottom: 30, containLabel: true },
          xAxis: { type: 'log', min: 1, max: 10000, show: false },
          yAxis: { type: 'category', data: ['中国', '英国', '美国'], axisLine: { show: false }, axisTick: { show: false }, axisLabel: { color: 'var(--ink-2)', fontSize: 13.5, margin: 14 } },
          series: [
            { type: 'bar', silent: true, barWidth: 26, data: [10000, 10000, 10000], itemStyle: { color: 'rgba(120,150,200,.1)', borderRadius: 10 }, z: 1 },
            {
              type: 'bar', silent: true, barWidth: 26, z: 2, barGap: '-100%',
              data: [
                { value: 12.4, itemStyle: { color: '#6e829e' } },
                { value: 45, itemStyle: { color: '#3d7fd6' } },
                { value: 2859, itemStyle: { color: '#d8ae4e' } }
              ],
              itemStyle: { borderRadius: 10 },
              label: { show: true, position: 'right', color: 'var(--ink-2)', fontSize: 13.5, fontWeight: 700, distance: 12, formatter: (p) => ['12.4 亿美元', '45 亿美元', '2,859 亿美元'][p.dataIndex] }
            }
          ],
          graphic: [{
            type: 'text', left: 12, bottom: 0,
            style: { text: '对数刻度（数值相差230倍，线性刻度无法同图呈现）', fontSize: 11, fill: 'var(--ink-4)', fontFamily: 'PingFang SC, Microsoft YaHei, sans-serif' }
          }]
        }))
      }
    ]
  });

  /* ---------- 16 政策路线 ---------- */
  S({
    nav: '政策路线', desc: '"人工智能+"行动时间表',
    chap: '06 未来路径', title: '"人工智能+"行动：从理论创新到量化目标',
    sub: '2025年8月国务院印发《关于深入实施"人工智能+"行动的意见》（国发〔2025〕11号）',
    tag: 'POLICY',
    html: `
      <div class="s-body">
        <div class="s-timeline" style="margin-bottom:6px">
          ${D.POLICIES.map((p) => `
            <div class="s-tl-item ${p.highlight ? 'hl' : ''}">
              <div class="s-tl-date">${p.date}</div>
              <h5>${p.title}</h5>
              <p>${p.text.slice(0, 62)}${p.text.length > 62 ? '…' : ''}</p>
            </div>`).join('')}
        </div>
        <div class="s-cards" style="grid-template-columns:repeat(3,1fr);gap:16px">
          ${D.ROADMAP.map((r) => `
            <div class="s-card ${r.year === '2030' ? 'on' : ''}" style="display:flex;align-items:center;gap:18px;padding:18px 22px">
              <div style="text-align:center;min-width:78px">
                <div class="num" style="font-size:32px;color:var(--gold);line-height:1">${r.year === '2035' ? '2035' : r.value + '%'}</div>
                <div class="tiny muted mt8">${r.year}</div>
              </div>
              <div><h5 style="font-size:14px;margin-bottom:5px">${r.year === '2035' ? '全面步入智能社会' : '应用普及率超 ' + r.value + '%'}</h5>
              <p style="font-size:11.5px;line-height:1.7">${r.desc}</p></div>
            </div>`).join('')}
        </div>
      </div>`,
    foot: '数据来源：中国政府网 / 新华社 · 《关于深入实施"人工智能+"行动的意见》(国发〔2025〕11号)'
  });

  /* ---------- 17 结语 ---------- */
  S({
    nav: '结语', desc: '结论与展望',
    chap: '结语', title: '当算力像电力一样普及',
    sub: '新质生产力才真正从概念走进现实',
    tag: 'CONCLUSION',
    cls: 'slide-cover',
    html: `
      <div class="s-body vcenter">
        <div class="cover-inner">
          <div class="s-cards" style="grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:30px">
            <div class="s-card on"><div class="sc-no">证据一 · 底座</div><h5>基础设施规模已成气候</h5><p>算力四年翻番至280 EFLOPS，5G基站483.8万个，42个万卡级智算集群。</p></div>
            <div class="s-card on"><div class="sc-no">证据二 · 效率</div><h5>实体经济效率可被测量</h5><p>电网仿真效率提升30倍、药物研发成本降低近一半、灯塔工厂劳动生产率平均提升50%。</p></div>
            <div class="s-card on"><div class="sc-no">证据三 · 扩散</div><h5>7亿人已在使用</h5><p>技术扩散速度超过PC与互联网；数字经济占GDP比重达43.8%。</p></div>
          </div>
          <p class="cover-sub" style="font-size:17px;line-height:2;color:var(--ink-2)">
            人工智能之所以是新质生产力，不在于它本身是一项新技术，而在于它同时改变了
            <b style="color:var(--gold)">劳动资料、劳动对象与劳动者</b>，并因此推动全要素生产率的系统性提升。
            这条路径已由基础设施的规模、产业的增速与真实场景中的效率数字所证明；
            而其最终形态，取决于"人工智能+"行动在千行百业的落地深度。
          </p>
          <div class="hero-cta mt34">
            <a class="btn btn-primary" href="dashboard.html">进入数据看板
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
            </a>
            <a class="btn btn-ghost" href="index.html">返回总览</a>
            <a class="btn btn-ghost" href="sources.html">数据来源与口径</a>
          </div>
        </div>
      </div>`,
    foot: '本报告全部数据均标注来源，详见「数据来源」页'
  });

  /* ============================================================ 渲染 */
  const stage = $('#stage');
  stage.innerHTML = SLIDES.map((s, i) => `
    <section class="slide ${s.cls || ''}" data-i="${i}" aria-label="第${i + 1}页">
      ${s.head === null ? '' : (s.head || (s.title ? `
      <div class="s-head">
        <div class="sh-l">
          <div>
            ${s.chap ? `<span class="sh-chap">${s.chap}</span>` : ''}
            <h2 style="margin-top:6px">${s.title}</h2>
            ${s.sub ? `<div class="sh-sub">${s.sub}</div>` : ''}
          </div>
        </div>
        <div class="sh-r">
          <span class="tag gold">${s.tag || ''}</span>
          <div class="sh-tag" style="margin-top:8px">${String(i + 1).padStart(2, '0')} / ${String(SLIDES.length).padStart(2, '0')}</div>
        </div>
      </div>` : ''))}
      ${s.html}
      ${s.foot === null ? '' : `<div class="s-foot"><div class="sf-src"><b>数据来源</b> ${(s.foot || '').replace(/^数据来源[:：]\s*/, '')}</div><div class="sf-note">智启新质 · 人工智能赋能新质生产力</div></div>`}
    </section>`).join('');

  $('#totNo').textContent = String(SLIDES.length).padStart(2, '0');

  /* 进度刻度 */
  $('#ticks').innerHTML = SLIDES.map(() => '<i></i>').join('');

  /* 目录浮层 */
  $('#navGrid').innerHTML = SLIDES.map((s, i) => `
    <button class="dn-item" data-i="${i}">
      <span class="dn-no">${String(i + 1).padStart(2, '0')}</span>
      <span><span class="dn-t">${s.nav}</span><span class="dn-d">${s.desc}</span></span>
    </button>`).join('');

  /* ============================================================ 导航逻辑 */
  const els = $$('.slide', stage);
  const inited = {};
  let cur = -1;

  function renderCharts(i) {
    const s = SLIDES[i];
    if (inited[i]) { if (s.resize !== false) ZQ.EChartsKit.resize(); return; }
    inited[i] = true;
    requestAnimationFrame(() => {
      (s.charts || []).forEach((c) => {
        const el = $(c.sel, els[i]);
        if (el) ZQ.EChartsKit.make(el, c.render);
      });
      if (s.after) s.after();
      setTimeout(() => ZQ.EChartsKit.resize(), 90);
    });
  }

  function go(n, dir) {
    n = Math.max(0, Math.min(SLIDES.length - 1, n));
    if (n === cur) return;
    const prev = cur;
    cur = n;
    els.forEach((el, i) => {
      el.classList.toggle('active', i === n);
      el.classList.toggle('past', i < n);
    });
    els[n].scrollTop = 0;
    $('#curNo').textContent = String(n + 1).padStart(2, '0');
    $$('#ticks i').forEach((t, i) => t.classList.toggle('done', i <= n));
    $$('#navGrid .dn-item').forEach((t, i) => t.classList.toggle('cur', i === n));
    $('#btnPrev').disabled = n === 0;
    $('#btnNext').disabled = n === SLIDES.length - 1;
    renderCharts(n);
    /* 目录浮层开启时翻页 → 同步 */
  }
  const next = () => go(cur + 1);
  const prev = () => go(cur - 1);

  /* 键盘 */
  document.addEventListener('keydown', (e) => {
    const k = e.key;
    if (k === 'ArrowRight' || k === 'ArrowDown' || k === 'PageDown' || k === ' ') { e.preventDefault(); stopPlay(); next(); }
    else if (k === 'ArrowLeft' || k === 'ArrowUp' || k === 'PageUp') { e.preventDefault(); stopPlay(); prev(); }
    else if (k === 'Home') go(0);
    else if (k === 'End') go(SLIDES.length - 1);
    else if (k === 's' || k === 'S') $('#deckNav').classList.toggle('open');
    else if (k === 'Escape') $('#deckNav').classList.remove('open');
    else if (k === 'p' || k === 'P') togglePlay();
    else if (k === 'f' || k === 'F') toggleFull();
  });

  /* 滚轮（节流） */
  let wheelLock = 0;
  window.addEventListener('wheel', (e) => {
    const now = Date.now();
    if (now - wheelLock < 620) return;
    if (Math.abs(e.deltaY) < 12 && Math.abs(e.deltaX) < 12) return;
    /* 目录浮层内允许正常滚动 */
    if ($('#deckNav').classList.contains('open')) return;
    wheelLock = now;
    const d = (Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY);
    if (d > 0) { stopPlay(); next(); } else { stopPlay(); prev(); }
  }, { passive: true });

  /* 触屏 */
  let tx = 0, ty = 0;
  document.addEventListener('touchstart', (e) => { tx = e.touches[0].clientX; ty = e.touches[0].clientY; }, { passive: true });
  document.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - tx, dy = e.changedTouches[0].clientY - ty;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 50) return;
    if (Math.abs(dx) > Math.abs(dy)) { dx < 0 ? next() : prev(); }
    else { dy < 0 ? next() : prev(); }
  }, { passive: true });

  /* 按钮 */
  $('#btnPrev').addEventListener('click', () => { stopPlay(); prev(); });
  $('#btnNext').addEventListener('click', () => { stopPlay(); next(); });
  $('#btnNav').addEventListener('click', () => $('#deckNav').classList.toggle('open'));
  $('#deckNav').addEventListener('click', (e) => {
    const b = e.target.closest('.dn-item');
    if (!b) return;
    go(+b.dataset.i);
    $('#deckNav').classList.remove('open');
  });

  /* 自动播放 */
  let timer = 0;
  const PLAY_MS = 7000;
  function startPlay() {
    $('#btnPlay').innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 5h4v14H7zM13 5h4v14h-4z"/></svg>';
    timer = setInterval(() => { if (cur >= SLIDES.length - 1) { stopPlay(); return; } next(); }, PLAY_MS);
  }
  function stopPlay() {
    if (!timer) return;
    clearInterval(timer); timer = 0;
    $('#btnPlay').innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
  }
  function togglePlay() { timer ? stopPlay() : startPlay(); }
  $('#btnPlay').addEventListener('click', togglePlay);

  /* 全屏 */
  function toggleFull() {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen().catch(() => {});
    else document.exitFullscreen();
  }
  $('#btnFull').addEventListener('click', toggleFull);

  /* 主题变化 → 重绘当前页图表 */
  ZQ.onTheme(() => { ZQ.EChartsKit.repaint(); });

  /* 初始化 */
  go(Math.max(0, parseInt((location.hash || '#1').slice(1), 10) - 1) || 0);
  ZQ.tips();
  ZQ.EChartsKit.init();
  window.addEventListener('resize', () => ZQ.EChartsKit.resize());
  ZQ.$$('[data-tip]').forEach((el) => el.addEventListener('click', (e) => e.stopPropagation()));
})();
