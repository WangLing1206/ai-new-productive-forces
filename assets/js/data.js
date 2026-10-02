/* ============================================================================
 *  智启新质 · 数据层 (data.js)
 *  所有数据的唯一来源。每一条数据均标注来源机构、年份与口径。
 *  口径差异是本研究的重要发现之一，代码中以 note / caliber 字段显式保留。
 * ==========================================================================*/
(function (global) {
  'use strict';

  /* ------------------------------------------------------------------ 站点元信息 */
  const SITE = {
    title: '智启新质',
    subtitle: '人工智能赋能新质生产力 · 全景数据观察',
    desc: '从算力底座到产业跃升，用可核查的数据呈现人工智能作为新质生产力的作用与意义。',
    org: '数据可视化研究报告',
    date: '2026年10月',
    repo: 'ai-new-productive-forces',
    owner: 'WangLing1206',
    version: 'v1.0'
  };

  /* ------------------------------------------------------------------ 核心指标卡 */
  const KPIS = [
    {
      label: '人工智能产业规模',
      value: 1.2, unit: '万亿元', year: '2025年',
      change: '+40%', dir: 'up',
      src: '中国信通院 / 工业和信息化部',
      note: '2025年产业规模超1.2万亿元，同比增速约40%'
    },
    {
      label: '生成式AI备案模型',
      value: 748, unit: '款', year: '2025年底',
      change: '+446款', dir: 'up',
      src: '国家互联网信息办公室',
      note: '2025年当年新增备案446款、新增登记330款'
    },
    {
      label: '智能算力规模',
      value: 1590, unit: 'EFLOPS', year: '2025年',
      change: '口径升级', dir: 'up',
      src: '工业和信息化部',
      note: '2024年底为90 EFLOPS；2025年启用新精度口径后为1590 EFLOPS'
    },
    {
      label: 'AI相关企业数量',
      value: 6600, unit: '家', year: '2026年6月',
      change: '全球占比15%', dir: 'up',
      src: '中国信通院',
      note: '2019年底为2600余家，六年间增长约1.5倍'
    },
    {
      label: '数字经济规模',
      value: 59.2, unit: '万亿元', year: '2024年',
      change: '占GDP 43.8%', dir: 'up',
      src: '中国信通院《中国数字经济发展研究报告(2025年)》',
      note: '全口径数字经济规模，非"数字经济核心产业增加值"口径'
    },
    {
      label: '生成式AI用户规模',
      value: 7, unit: '亿人', year: '2026年上半年',
      change: '普及率超50%', dir: 'up',
      src: '中国互联网络信息中心(CNNIC)',
      note: '生成式人工智能产品用户规模突破7亿人'
    },
    {
      label: '5G基站数量',
      value: 483.8, unit: '万个', year: '2025年底',
      change: '较上年净增58.8万', dir: 'up',
      src: '工业和信息化部《通信业统计公报》',
      note: 'AI规模应用的网络底座'
    },
    {
      label: '工业机器人保有量',
      value: 202.7, unit: '万台', year: '2024年',
      change: '全球占43.5%', dir: 'up',
      src: '国际机器人联合会(IFR)',
      note: '中国连续多年为全球最大工业机器人市场'
    }
  ];

  /* ------------------------------------------------------------------ 时间序列 */
  const SERIES = {
    /* AI核心产业规模（2019—2023，信通院/工信部"核心产业"口径，单位：亿元） */
    aiCoreIndustry: {
      name: '人工智能核心产业规模',
      unit: '亿元',
      caliber: '核心产业规模口径',
      note: '2019—2023年数据为"人工智能核心产业规模"，与2024年起的新口径不可直接衔接。',
      src: '工信部 / 中国信通院 / 中国电子学会',
      data: [
        { y: '2019', v: 510, src: '工信部(苗圩)', label: '超510亿元' },
        { y: '2020', v: 3257, src: '中国电子学会', label: '3257亿元 · +16.7%' },
        { y: '2021', v: 4000, src: '工信部(任爱光)', label: '超4000亿元' },
        { y: '2022', v: 5080, src: '中国信通院', label: '5080亿元 · +18%' },
        { y: '2023', v: 5784, src: '中国信通院《中国互联网发展报告(2024)》', label: '5784亿元' }
      ]
    },
    /* AI产业规模（新口径，2024起，单位：亿元） */
    aiIndustryNew: {
      name: '人工智能产业规模（新口径）',
      unit: '亿元',
      caliber: '产业规模新口径',
      note: '中国信通院2025年9月起启用新测算方法，2024年、2025年数据与新口径一致，2027年为预测值。',
      src: '中国信通院 / 工信部',
      data: [
        { y: '2024', v: 9000, src: '中国信通院', label: '超9000亿元 · +24%' },
        { y: '2025', v: 12000, src: '中国信通院 / 工信部', label: '超1.2万亿元 · +40%' },
        { y: '2027E', v: 20000, src: '中国信通院(预测)', label: '预计2万亿元', forecast: true }
      ]
    },
    /* AI相关企业数量（家） */
    aiCompanies: {
      name: '人工智能相关企业数量',
      unit: '家',
      note: '统计时点不同，部分年份为"超"值。',
      src: '工信部 / 中国信通院',
      data: [
        { y: '2019', v: 2600, label: '超2600家' },
        { y: '2021', v: 3000, label: '超3000家' },
        { y: '2022', v: 4000, label: '超4000家' },
        { y: '2023', v: 4400, label: '超4400家' },
        { y: '2024', v: 4500, label: '超4500家' },
        { y: '2025', v: 5300, label: '超5300家 · 全球占比15%' },
        { y: '2026', v: 6600, label: '超6600家' }
      ]
    },
    /* 算力总规模（工信部口径，EFLOPS） */
    compute: {
      name: '算力总规模',
      unit: 'EFLOPS',
      caliber: '工信部 · FP32为主口径',
      note: '2024年6月底数据为246 EFLOPS，年底达280 EFLOPS。',
      src: '工业和信息化部',
      data: [
        { y: '2021', v: 140, label: '超140 EFLOPS' },
        { y: '2022', v: 180, label: '180 EFLOPS' },
        { y: '2023', v: 230, label: '超230 EFLOPS' },
        { y: '2024', v: 280, label: '280 EFLOPS' }
      ]
    },
    /* 智能算力（EFLOPS）— 显式区分口径 */
    smartCompute: {
      name: '智能算力规模',
      unit: 'EFLOPS',
      note: '2023—2024年与2025—2026年为不同精度口径，2024→2025的跃升主要源于口径变化，不代表同比增速。',
      src: '工业和信息化部',
      data: [
        { y: '2023', v: 70, caliber: '旧口径', label: '70 EFLOPS' },
        { y: '2024', v: 90, caliber: '旧口径', label: '90 EFLOPS · 占比32%' },
        { y: '2025', v: 1590, caliber: '新口径', label: '1590 EFLOPS', flag: true },
        { y: '2026H1', v: 2185, caliber: '新口径(FP16)', label: '2185 EFLOPS · 同比+177%', flag: true }
      ]
    },
    /* 生成式AI备案模型累计数（款） */
    llmFiling: {
      name: '生成式人工智能备案模型累计数',
      unit: '款',
      note: '2025年12月31日累计748款，全年新增备案446款。',
      src: '国家互联网信息办公室',
      data: [
        { y: '2024.12', v: 302, label: '302款' },
        { y: '2025.07', v: 439, label: '439款' },
        { y: '2025.09', v: 538, label: '538款' },
        { y: '2025.11', v: 611, label: '611款' },
        { y: '2025.12', v: 748, label: '748款' }
      ]
    },
    /* 数字经济规模与占GDP比重 */
    digitalEconomy: {
      name: '数字经济规模',
      unit: '万亿元',
      note: '全口径数字经济规模，含数字产业化与产业数字化。',
      src: '中国信通院《中国数字经济发展研究报告》',
      data: [
        { y: '2019', v: 35.8, share: 36.2 },
        { y: '2020', v: 39.2, share: 38.6 },
        { y: '2021', v: 45.5, share: 39.8 },
        { y: '2022', v: 50.2, share: 41.5 },
        { y: '2023', v: 53.9, share: 42.8 },
        { y: '2024', v: 59.2, share: 43.8 }
      ]
    },
    /* 5G基站（万个） */
    g5: {
      name: '5G基站累计建成数',
      unit: '万个',
      src: '工业和信息化部《通信业统计公报》',
      data: [
        { y: '2019', v: 13, label: '超13万个' },
        { y: '2020', v: 71.8 },
        { y: '2021', v: 142.5 },
        { y: '2022', v: 231.2 },
        { y: '2023', v: 337.7 },
        { y: '2024', v: 425.1 },
        { y: '2025', v: 483.8 }
      ]
    },
    /* 全球工业机器人保有量占比（2024） */
    robotsGlobal: {
      name: '2024年全球工业机器人保有量分布',
      unit: '万台',
      src: '国际机器人联合会(IFR)',
      data: [
        { name: '中国', value: 202.7, share: 43.5 },
        { name: '其他国家', value: 263.3, share: 56.5 }
      ]
    },
    /* 全球私营AI投资（2025，Stanford HAI，单位：亿美元） */
    globalInvest: {
      name: '2025年全球私营AI投资额',
      unit: '亿美元',
      note: '仅统计私募/风险投资口径，不包含政府投入与公开市场融资，与国内投融资统计口径不可比。',
      src: '斯坦福大学 HAI《AI Index 2026》',
      data: [
        { name: '美国', value: 2859 },
        { name: '中国', value: 12.4 },
        { name: '英国', value: 45 }
      ]
    },
    /* 生成式AI专利全球分布（2024，WIPO方法） */
    genPatent: {
      name: '2024年全球新公开生成式AI专利分布',
      unit: '件',
      src: '世界知识产权组织(WIPO)检索方法 / 澎湃新闻分析',
      data: [
        { name: '中国', value: 27000, share: 61.5 },
        { name: '美国', value: 7592, share: 17.3 },
        { name: '其他', value: 9308, share: 21.2 }
      ]
    }
  };

  /* ------------------------------------------------------------------ 新质生产力 · 政策与理论 */
  const THEORY = {
    definition: '概括地说，新质生产力是创新起主导作用，摆脱传统经济增长方式、生产力发展路径，具有高科技、高效能、高质量特征，符合新发展理念的先进生产力质态。它由技术革命性突破、生产要素创新性配置、产业深度转型升级而催生，以劳动者、劳动资料、劳动对象及其优化组合的跃升为基本内涵，以全要素生产率大幅提升为核心标志，特点是创新，关键在质优，本质是先进生产力。',
    source: '习近平在中共中央政治局第十一次集体学习时的讲话（2024年1月31日）',
    features: [
      {
        key: '高科技',
        icon: 'chip',
        title: '高科技 · 技术革命性突破',
        desc: '人工智能是新一轮科技革命和产业变革的重要驱动力量。大模型、智能算力、具身智能的连续突破，使知识生产本身被自动化，技术供给从"线性迭代"转向"加速跃迁"。',
        stat: { value: 748, unit: '款', label: '生成式AI备案模型(2025年底)' }
      },
      {
        key: '高效能',
        icon: 'bolt',
        title: '高效能 · 生产要素创新性配置',
        desc: '数据成为新型生产要素，算法成为新型生产工具，算力成为新型基础设施。AI以"数据—算法—算力"三元结构重构要素组合方式，使同样的投入产出更多价值。',
        stat: { value: 59.2, unit: '万亿元', label: '数字经济规模(2024)' }
      },
      {
        key: '高质量',
        icon: 'growth',
        title: '高质量 · 产业深度转型升级',
        desc: 'AI向制造、医疗、能源、农业、交通等实体经济主战场渗透，推动产业从"要素投入驱动"转向"创新与效率驱动"，实现质量的系统性提升。',
        stat: { value: 50, unit: '%', label: '灯塔工厂劳动生产率平均提升' }
      }
    ]
  };

  /* ------------------------------------------------------------------ 政策时间轴 */
  const POLICIES = [
    {
      date: '2017.07', title: '《新一代人工智能发展规划》',
      text: '国务院首次将人工智能上升为国家战略，提出到2030年人工智能理论、技术与应用总体达到世界领先水平。',
      tag: '国家战略'
    },
    {
      date: '2023.09', title: '"新质生产力"首次提出',
      text: '习近平总书记在黑龙江考察时指出："整合科技创新资源，引领发展战略性新兴产业和未来产业，加快形成新质生产力。"',
      tag: '理论创新', highlight: true
    },
    {
      date: '2024.01', title: '中央政治局第十一次集体学习',
      text: '系统阐释新质生产力的内涵：以全要素生产率大幅提升为核心标志，特点是创新，关键在质优，本质是先进生产力。',
      tag: '理论体系', highlight: true
    },
    {
      date: '2024.03', title: '《政府工作报告》首提"人工智能+"',
      text: '"深化大数据、人工智能等研发应用，开展\'人工智能+\'行动，打造具有国际竞争力的数字产业集群。"',
      tag: '行动部署'
    },
    {
      date: '2025.03', title: '持续推进"人工智能+"行动',
      text: '"支持大模型广泛应用，大力发展智能网联新能源汽车、人工智能手机和电脑、智能机器人等新一代智能终端以及智能制造装备。"',
      tag: '行动部署'
    },
    {
      date: '2025.08', title: '国发〔2025〕11号意见印发',
      text: '《关于深入实施"人工智能+"行动的意见》部署六大重点行动：科学技术、产业发展、消费提质、民生福祉、治理能力、全球合作。',
      tag: '顶层设计', highlight: true
    }
  ];

  /* 人工智能+行动 三阶段目标 */
  const ROADMAP = [
    { year: '2027', metric: '应用普及率', value: 70, desc: '率先实现人工智能与6大重点领域广泛深度融合，新一代智能终端、智能体等应用普及率超70%' },
    { year: '2030', metric: '应用普及率', value: 90, desc: '新一代智能终端、智能体等应用普及率超90%，智能经济成为我国经济发展的重要增长极' },
    { year: '2035', metric: '发展阶段', value: 100, desc: '全面步入智能经济和智能社会发展新阶段' }
  ];

  /* 六大重点行动方向 */
  const SIX_ACTIONS = [
    { name: '人工智能+科学技术', desc: '加速科学发现与技术攻关' },
    { name: '人工智能+产业发展', desc: '重塑生产制造与服务体系' },
    { name: '人工智能+消费提质', desc: '培育智能消费新场景' },
    { name: '人工智能+民生福祉', desc: '医疗、教育、养老普惠供给' },
    { name: '人工智能+治理能力', desc: '提升公共治理智能化水平' },
    { name: '人工智能+全球合作', desc: '共建开放包容的智能生态' }
  ];

  /* ------------------------------------------------------------------ 行业应用成效 */
  const CASES = [
    {
      industry: '能源电力', org: '南方电网',
      title: '大瓦特·驭电 电网仿真',
      metric: 30, metricUnit: '倍以上', metricLabel: '仿真效率提升',
      detail: '1小时内完成全年8760个运行方式仿真，效率提升30倍以上；智能巡检机器人效率提升近80倍。',
      src: '人民网 2025-07-28'
    },
    {
      industry: '先进制造', org: '中信戴卡',
      title: 'AI工业X光缺陷检测',
      metric: 40, metricUnit: '%', metricLabel: '缺陷识别效率提升',
      detail: 'AI视觉检测替代人工判片，缺陷识别效率提升40%，漏检率显著下降。',
      src: '人民网 2026-08-18'
    },
    {
      industry: '生物医药', org: '石药集团',
      title: 'AI药物筛选',
      metric: 50, metricUnit: '%', metricLabel: '研发成本降低近一半',
      detail: '新药早期发现时间缩短超30%，研发成本降低近一半，候选化合物筛选准确率提高近3倍。',
      src: '人民网 2026-08-18'
    },
    {
      industry: '钢铁冶金', org: '河北钢铁企业',
      title: '"人工智能+制造"成本优化',
      metric: 97, metricUnit: '元/吨', metricLabel: '单吨钢材成本降低',
      detail: 'AI优化配料与工艺参数，单吨钢材生产成本降低97元，累计减少千万元级浪费。',
      src: '人民网 2026-08-18'
    },
    {
      industry: '智慧交通', org: '贵州高速',
      title: '收费站智能化升级',
      metric: 125, metricUnit: '%', metricLabel: '出口通行效率提升',
      detail: '5个收费站智能化升级后，非ETC车辆出口通行时间缩短20秒，出口通行效率提升125%。',
      src: '人民网 2026-03-23'
    },
    {
      industry: '现代农业', org: '广西蚕桑产业',
      title: '智能蚕具与自动化缫丝',
      metric: 20, metricUnit: '倍', metricLabel: '作业效率提升',
      detail: '智能蚕具效率较人工提升20倍；自动化缫丝线人力精简50%—80%，优质品率从60%升至95%，病发率从40%降至5%以内。',
      src: '人民网 2025-10-27'
    },
    {
      industry: '医疗健康', org: '医疗机构',
      title: 'AI辅助医学影像诊断',
      metric: 12, metricUnit: '%', metricLabel: '低年资医师读图能力提升',
      detail: 'AI辅助下低年资医师读图诊断能力提高约12%；AI组与"金标准"诊断一致率85.5%，对照组为72.9%。',
      src: '人民网 2024-02-29'
    },
    {
      industry: '智能制造', org: '全球灯塔工厂',
      title: '第四次工业革命标杆',
      metric: 50, metricUnit: '%', metricLabel: '劳动生产率平均提升',
      detail: '全球灯塔工厂总数达238座，第十六批新增16家中中国占8家(50%)。新晋灯塔工厂劳动生产率平均提高50%。',
      src: '世界经济论坛(WEF) / 人民网 2026-06-25'
    }
  ];

  /* ------------------------------------------------------------------ 就业与人才 */
  const JOBS = {
    wef: {
      title: '2025—2030年全球就业结构变动（预测）',
      src: '世界经济论坛《未来就业报告2025》',
      created: 170, createdUnit: '百万个', createdLabel: '新增岗位',
      lost: 92, lostUnit: '百万个', lostLabel: '消失岗位',
      net: 78, netUnit: '百万个', netLabel: '净增岗位',
      note: '覆盖研究涉及的12亿个正式岗位，结构性劳动力市场变动达22%；约39%的现有技能将被改变或过时。'
    },
    talent: {
      gap: 500, gapUnit: '万人', gapLabel: '中国AI人才缺口',
      ratio: '1 : 10', ratioLabel: '人才供求比',
      salary: 21439, salaryUnit: '元/月', salaryLabel: '人工智能工程师平均月薪',
      algoGrowth: 54, algoGrowthUnit: '%', algoGrowthLabel: '算法工程师需求同比增速',
      src: '人社部 / 智联招聘《2025年人工智能产业人才发展报告》'
    }
  };

  /* ------------------------------------------------------------------ 国际权威机构测算（预测类） */
  const FORECASTS = [
    {
      org: '普华永道 PwC', year: '2030年', value: 15.7, unit: '万亿美元',
      label: 'AI为全球GDP带来的增量',
      note: '相当于在当前全球经济规模基础上提升约20%',
      src: 'PwC《Sizing the Prize》', forecast: true
    },
    {
      org: '麦肯锡 McKinsey', year: '每年', value: 4.4, unit: '万亿美元',
      label: '生成式AI经济价值上限',
      note: '区间为每年2.6万亿—4.4万亿美元；相当于可自动化当前员工60%—70%的工作时间',
      src: 'McKinsey《The economic potential of generative AI》', forecast: true
    },
    {
      org: '国际货币基金组织 IMF', year: '当前', value: 40, unit: '%',
      label: '受AI影响的全球岗位占比',
      note: '发达经济体约60%，新兴市场约40%，低收入国家约26%',
      src: 'IMF Blog, 2024-01', forecast: true
    },
    {
      org: '经济合作与发展组织 OECD', year: '实证研究', value: 40, unit: '%',
      label: '使用生成式AI的任务表现提升上限',
      note: '在特定工作场所情境下，任务表现提升约20%—40%',
      src: 'OECD AI 专题研究, 2025', forecast: true
    },
    {
      org: '斯坦福大学 HAI', year: '2024—2025', value: 88, unit: '%',
      label: '组织实施AI的比例',
      note: '组织AI使用率由2024年78%升至2025年88%；生成式AI三年内达到53%人口渗透率，快于PC与互联网',
      src: 'Stanford HAI《AI Index 2025 / 2026》'
    },
    {
      org: '中国信通院 CAICT', year: '2035年', value: 1.73, unit: '万亿元',
      label: '中国AI产业规模预测',
      note: '预计届时全球占比约30.6%',
      src: '中国信通院 / 人民日报 2025-05-28', forecast: true
    }
  ];

  /* ------------------------------------------------------------------ 全要素生产率相关 */
  const TFP = {
    title: '关于"全要素生产率"的诚实说明',
    body: '官方将"全要素生产率大幅提升"作为新质生产力的核心标志，但截至目前，国内官方机构尚未公开发布"人工智能对全要素生产率贡献率"的直接测算值。本报告因此同时呈现三类量化视角——AI产业自身的规模增长、AI对其他产业的效率改进、以及国际机构对长期增长贡献的测算——并明确区分"已发生的统计事实"与"未来预测"。',
    points: [
      { label: '研发投入强度(2024)', value: '2.68%', src: '国家统计局' },
      { label: '中国TFP增长率(近年)', value: '低于2%', src: '清华大学互联网产业研究院 引 李国杰院士' },
      { label: 'AI对GDP累计提升(十年)', value: '0.93%—1.56%', src: 'MIT 经济学家 Acemoglu 测算' },
      { label: 'AI年均TFP提升测算', value: '约0.064%', src: 'MIT 经济学家 Acemoglu 测算' }
    ]
  };

  /* ------------------------------------------------------------------ 数据来源清单 */
  const SOURCES = [
    { n: 1, org: '中国政府网', name: '《关于深入实施"人工智能+"行动的意见》(国发〔2025〕11号)', year: '2025-08-26', url: 'https://www.gov.cn/zhengce/zhengceku/202508/content_7037862.htm', type: 'official' },
    { n: 2, org: '中国政府网', name: '《政府工作报告》全文（2024年、2025年）', year: '2024 / 2025', url: 'https://www.gov.cn/yaowen/liebiao/202503/content_7013163.htm', type: 'official' },
    { n: 3, org: '人民网 / 新华社', name: '习近平在中共中央政治局第十一次集体学习时的讲话', year: '2024-02-01', url: 'http://cpc.people.com.cn/n1/2024/0201/c64094-40171173.html', type: 'official' },
    { n: 4, org: '工业和信息化部', name: '《通信业统计公报》(2019—2024)', year: '逐年', url: 'https://www.miit.gov.cn/jgsj/yxj/xxfb/art/2025/art_1ba37f13e02149d4b1cdffc41c78cc68.html', type: 'official' },
    { n: 5, org: '工业和信息化部', name: '人工智能产业规模、智能算力、企业数量发布数据', year: '2025—2026', url: 'http://finance.people.com.cn/n1/2026/0130/c1004-40656081.html', type: 'official' },
    { n: 6, org: '国家互联网信息办公室', name: '生成式人工智能服务备案信息公告', year: '2024—2026', url: 'https://news.gmw.cn/2026-01/10/content_38528831.htm', type: 'official' },
    { n: 7, org: '国家统计局', name: '数字经济核心产业增加值核算数据', year: '2024', url: 'http://finance.china.com.cn/news/20251230/6286812.shtml', type: 'official' },
    { n: 8, org: '国家知识产权局', name: '发明专利有效量及专利密集型产业统计', year: '2025', url: 'http://news.china.com.cn/2026-01/24/content_118297847.shtml', type: 'official' },
    { n: 9, org: '中国互联网络信息中心 CNNIC', name: '生成式人工智能用户规模调查报告', year: '2026', url: 'http://finance.people.com.cn/n1/2026/0929/c1004-40807558.html', type: 'research' },
    { n: 10, org: '中国信息通信研究院 CAICT', name: '人工智能产业规模测算 / 《中国数字经济发展研究报告》/ 算力规模报告', year: '2024—2026', url: 'http://finance.people.com.cn/n1/2025/0924/c1004-40571272.html', type: 'research' },
    { n: 11, org: '中国信息通信研究院 CAICT', name: '《中国数字经济发展研究报告(2025年)》', year: '2026-03', url: 'https://www.cnii.com.cn/yw/202603/t20260326_727471.html', type: 'research' },
    { n: 12, org: '中国电子学会', name: '《人工智能发展白皮书》', year: '2021', url: 'https://www.cnii.com.cn/rmydb/202106/t20210611_285421.html', type: 'research' },
    { n: 13, org: '世界经济论坛 WEF', name: '《未来就业报告2025》(Future of Jobs Report 2025)', year: '2025', url: 'https://www.weforum.org/publications/the-future-of-jobs-report-2025/', type: 'intl' },
    { n: 14, org: '世界经济论坛 WEF', name: '全球灯塔工厂网络报告', year: '2025—2026', url: 'http://ln.people.com.cn/n2/2026/0625/c378317-41620217.html', type: 'intl' },
    { n: 15, org: '国际机器人联合会 IFR', name: '《世界机器人》报告', year: '2025', url: 'https://finance.sina.cn/tech/2025-10-16/detail-inftzhrz3045277.d.html', type: 'intl' },
    { n: 16, org: '斯坦福大学 HAI', name: '《AI Index 2025 / 2026》', year: '2025 / 2026', url: 'https://hai.stanford.edu/ai-index/2026-ai-index-report', type: 'intl' },
    { n: 17, org: '普华永道 PwC', name: '《Sizing the Prize》', year: '2017', url: 'https://www.pwc.com/gx/en/issues/data-and-analytics/publications/artificial-intelligence-study.html', type: 'intl' },
    { n: 18, org: '麦肯锡 McKinsey', name: '《The economic potential of generative AI》', year: '2023', url: 'https://www.mckinsey.com/capabilities/mckinsey-digital/our-insights/the-economic-potential-of-generative-ai-the-next-productivity-frontier', type: 'intl' },
    { n: 19, org: '国际货币基金组织 IMF', name: 'AI Will Transform the Global Economy', year: '2024-01', url: 'https://www.imf.org/en/Blogs/Articles/2024/01/14/ai-will-transform-the-global-economy-lets-make-sure-it-benefits-humanity', type: 'intl' },
    { n: 20, org: '经济合作与发展组织 OECD', name: 'Artificial Intelligence 专题研究', year: '2025', url: 'https://www.oecd.org/en/topics/artificial-intelligence.html', type: 'intl' },
    { n: 21, org: '世界知识产权组织 WIPO', name: '生成式人工智能专利检索分析', year: '2025', url: 'https://finance.china.com.cn/industry/20250218/6214235.shtml', type: 'intl' },
    { n: 22, org: '人民网 / 人民日报', name: '各行业人工智能应用成效系列报道', year: '2024—2026', url: 'http://finance.people.com.cn/n1/2025/0728/c1004-40531156.html', type: 'media' },
    { n: 23, org: '智联招聘', name: '《2025年人工智能产业人才发展报告》', year: '2025-10', url: 'https://www.21jingji.com/article/20251024/herald/99f5deac46722328df0354104c860ed0.html', type: 'research' },
    { n: 24, org: '清华大学互联网产业研究院', name: 'AI与全要素生产率学术观点汇编', year: '2025', url: 'https://www.iii.tsinghua.edu.cn/info/1221/5077.htm', type: 'research' }
  ];

  /* ------------------------------------------------------------------ 口径差异提示（研究诚信亮点） */
  const CALIBER_CAVEATS = [
    {
      title: 'AI产业规模：新旧口径不可直接衔接',
      detail: '2019—2023年为"人工智能核心产业规模"（2023年5784亿元）；2024年起中国信通院启用新方法测算"人工智能产业规模"（2024年超9000亿元）。若强行连线会得出错误的增速，本站在图表中以断裂标记区分。'
    },
    {
      title: '算力规模：三种精度口径并存',
      detail: '工信部FP32口径下2024年底为280 EFLOPS，智能算力为90 EFLOPS；2025年起智能算力数据改用新精度口径，达1590 EFLOPS。数值差数倍源于精度标准与统计边界不同。'
    },
    {
      title: '数字经济：全口径与核心产业口径',
      detail: '全口径数字经济规模2024年为59.2万亿元、占GDP 43.8%（信通院）；数字经济核心产业增加值2024年为14.09万亿元、占GDP 10.5%（国家统计局）。二者含义不同，不可混用。'
    },
    {
      title: '企业数量：AI企业与"用AI的企业"',
      detail: '"人工智能相关企业"（2026年6月超6600家）与"开发或应用AI的企业"（2024年同比增长36%）是两种统计对象，前者指以AI为主业的企业。'
    },
    {
      title: '国际对比：投资口径差异显著',
      detail: '斯坦福HAI统计的"私营AI投资"仅含私募与风险投资，不含政府投入和公开市场融资，因此与国内常引用的AI投融资总额口径不可直接比较。'
    }
  ];

  /* ------------------------------------------------------------------ 六大章节（叙事骨架） */
  const CHAPTERS = [
    { id: 'ch-def', no: '01', title: '理论坐标', subtitle: '新质生产力为何以AI为标志', nav: '理论坐标' },
    { id: 'ch-base', no: '02', title: '底座跃升', subtitle: '算力·网络·数据基础设施', nav: '底座跃升' },
    { id: 'ch-scale', no: '03', title: '规模扩张', subtitle: '产业与经营主体的数量级变化', nav: '规模扩张' },
    { id: 'ch-industry', no: '04', title: '产业转型', subtitle: '从技术供给到实体经济效率', nav: '产业转型' },
    { id: 'ch-people', no: '05', title: '人的维度', subtitle: '就业结构与人才供需', nav: '人的维度' },
    { id: 'ch-future', no: '06', title: '未来路径', subtitle: '"人工智能+"行动路线图', nav: '未来路径' }
  ];

  global.DATA = {
    SITE, KPIS, SERIES, THEORY, POLICIES, ROADMAP, SIX_ACTIONS,
    CASES, JOBS, FORECASTS, TFP, SOURCES, CALIBER_CAVEATS, CHAPTERS
  };
})(window);
