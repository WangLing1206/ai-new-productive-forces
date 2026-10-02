/* ============================================================================
 *  智启新质 · 数据来源页 (sources.js)
 * ==========================================================================*/
(function () {
  'use strict';
  const D = window.DATA, ZQ = window.ZQ;
  const { $, $$ } = ZQ;

  ZQ.chrome('sources');
  ZQ.Theme.init();

  /* ---------------------------------------------------------- 口径差异 */
  $('#caveatsList').innerHTML = D.CALIBER_CAVEATS.map((c, i) => `
    <div class="card caveat reveal d${(i % 3) + 1}">
      <h4>
        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="#e8484f" stroke-width="1.7"><path d="M12 3 2 20h20L12 3z"/><path d="M12 10v4M12 17h.01"/></svg>
        ${c.title}
      </h4>
      <p>${c.detail}</p>
    </div>`).join('');

  /* ---------------------------------------------------------- 来源类型分布 */
  const TYPE_META = {
    official: { name: '官方统计（政府/部委）', color: '#c8102e', cls: 't-official', label: '官方统计' },
    research: { name: '研究机构 / 智库', color: '#45cfe8', cls: 't-research', label: '研究机构' },
    intl: { name: '国际组织 / 权威机构', color: '#8b7fe8', cls: 't-intl', label: '国际组织' },
    media: { name: '权威媒体报道', color: '#35c08e', cls: 't-media', label: '权威媒体' }
  };
  const counts = {};
  D.SOURCES.forEach((s) => { counts[s.type] = (counts[s.type] || 0) + 1; });
  const typeRows = Object.keys(TYPE_META).map((k) => ({ key: k, name: TYPE_META[k].name, value: counts[k] || 0, color: TYPE_META[k].color }));

  ZQ.EChartsKit.make($('#chartSrcTypes'), (inst) => inst.setOption(Object.assign(ZQ.EChartsKit.base(), {
    grid: { left: 8, right: 74, top: 34, bottom: 30, containLabel: true },
    legend: { show: false },
    tooltip: {
      trigger: 'axis', axisPointer: { type: 'shadow' },
      formatter: (ps) => ZQ.EChartsKit.tip(ps[0].name, [['数量', ps[0].value + ' 项'], ['占比', Math.round(ps[0].value / D.SOURCES.length * 100) + '%']])
    },
    xAxis: { type: 'value', max: 10, show: false },
    yAxis: {
      type: 'category', data: typeRows.map((r) => r.name).reverse(),
      axisLine: { show: false }, axisTick: { show: false },
      axisLabel: { color: 'var(--ink-2)', fontSize: 12 }
    },
    series: [
      { type: 'bar', silent: true, barWidth: 16, data: typeRows.map(() => 10).reverse(), itemStyle: { color: 'rgba(120,150,200,.12)', borderRadius: 8 }, z: 1 },
      {
        type: 'bar', silent: true, barWidth: 16, z: 2, barGap: '-100%',
        data: typeRows.map((r) => ({ value: r.value, itemStyle: { color: r.color } })).reverse(),
        itemStyle: { borderRadius: 8 },
        label: {
          show: true, position: 'right', color: 'var(--ink-2)', fontSize: 12.5, fontWeight: 700, distance: 10,
          formatter: (p) => {
            const r = typeRows.slice().reverse()[p.dataIndex];
            return r.value + ' 项 · ' + Math.round(r.value / D.SOURCES.length * 100) + '%';
          }
        }
      }
    ],
    graphic: [{ type: 'text', left: 4, bottom: 0, style: { text: '共 ' + D.SOURCES.length + ' 项来源', fontSize: 11, fill: 'var(--ink-4)', fontFamily: 'PingFang SC, sans-serif' } }]
  })));

  /* ---------------------------------------------------------- 来源清单 */
  $('#srcList').innerHTML = D.SOURCES.map((s) => {
    const m = TYPE_META[s.type] || TYPE_META.research;
    return `<div class="src-item reveal">
      <div class="si-no">${String(s.n).padStart(2, '0')}</div>
      <div class="si-body">
        <div class="si-org">
          <span>${s.org}</span>
          <span class="tag ${m.cls}" style="font-size:10.5px">${m.label}</span>
        </div>
        <div class="si-name">${s.name}</div>
        <div class="si-foot">
          <span class="si-year">${s.year}</span>
          <a class="si-link" href="${s.url}" target="_blank" rel="noopener noreferrer" title="${s.url}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M10 6H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4M14 4h6v6M20 4l-8 8"/></svg>
            <span class="si-url">${s.url.replace(/^https?:\/\//, '')}</span>
          </a>
        </div>
      </div>
    </div>`;
  }).join('');

  /* ---------------------------------------------------------- 收尾 */
  ZQ.reveal();
  ZQ.tips();
  ZQ.EChartsKit.init();
})();
