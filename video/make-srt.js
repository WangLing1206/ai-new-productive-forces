/* ============================================================================
 *  字幕与讲解词生成 (make-srt.js)
 *  输入：video/timeline.json（实际录制边界）+ video/scenes.js（讲解词）
 *  输出：video/out/subtitles.srt       烧录用字幕
 *        video/out/讲解词与时间码.md    配音用脚本（含时码、画面说明、语速）
 *        video/out/progress.json        成片时长等元信息，供封装脚本使用
 *
 *  用法：node video/make-srt.js <blackEndSeconds>
 * ==========================================================================*/
const fs = require('fs');
const path = require('path');
const { SCENES, TIMELINE } = require('./scenes');

const L = parseFloat(process.argv[2] || '0');       /* 成片中黑场结束的时间点，即 t0 */

const tl = JSON.parse(fs.readFileSync(path.join(__dirname, 'timeline.json'), 'utf8'));
const OUT = path.join(__dirname, 'out');
fs.mkdirSync(OUT, { recursive: true });

const CN = (s) => s.replace(/\s/g, '').length;

/* ------------------------------------------------------------------ 断句 */
function splitCues(text, maxPerCue) {
  const parts = text.split(/(?<=[。！？；])/).filter((x) => x.trim());
  const cues = [];
  parts.forEach((p) => {
    if (CN(p) <= maxPerCue) { cues.push(p.trim()); return; }
    const segs = p.split(/(?<=[，、：])/).filter((x) => x.trim());
    let cur = '';
    segs.forEach((s) => {
      if (CN(cur + s) > maxPerCue && cur) { cues.push(cur.trim()); cur = s; }
      else cur += s;
    });
    if (cur.trim()) cues.push(cur.trim());
  });
  return cues;
}

/* 把一条字幕折成 ≤2 行、每行 ≤ maxLine 字 */
function wrap2(text, maxLine) {
  if (CN(text) <= maxLine) return text.trim();
  const segs = text.split(/(?<=[，、：；])/).filter((x) => x.trim());
  let best = null;
  let acc = '';
  for (let i = 0; i < segs.length; i++) {
    acc += segs[i];
    const rest = segs.slice(i + 1).join('');
    if (!rest) break;
    const diff = Math.abs(CN(acc) - CN(rest));
    if (best === null || diff < best.diff) best = { diff, a: acc.trim(), b: rest.trim(), i };
  }
  if (!best) {
    const mid = Math.ceil(CN(text) / 2);
    return text.slice(0, mid).trim() + '\n' + text.slice(mid).trim();
  }
  if (CN(best.b) > maxLine * 2) {
    /* 仍然过长：按字数硬折 */
    const t = best.b;
    const mid = Math.ceil(CN(t) / 2);
    best.b = t.slice(0, mid).trim() + '\n' + t.slice(mid).trim();
  }
  return best.a + '\n' + best.b;
}

/* ------------------------------------------------------------------ 逐场景生成 */
const srt = [];
const script = [];
let n = 0;

TL_LOOP:
for (let si = 0; si < TIMELINE.length; si++) {
  const scene = TIMELINE[si];
  const rec = tl.scenes[si] || { startWall: scene.startMs };
  const sceneStart = L + rec.startWall / 1000;
  const sceneDur = scene.durMs / 1000;

  /* 把讲解词拆成 cue，并按字数比例分配时间 */
  const cues = [];
  scene.nar.forEach((txt) => {
    splitCues(txt, 46).forEach((c) => cues.push(c));
  });
  const totalChars = cues.reduce((a, c) => a + CN(c), 0) || 1;

  let t = sceneStart;
  const rows = [];
  cues.forEach((c, i) => {
    const share = (CN(c) / totalChars) * sceneDur;
    const start = t;
    const end = i === cues.length - 1 ? sceneStart + sceneDur : t + share;
    t = end;
    rows.push({ start, end, text: c });
  });

  /* 场景内的画面说明（配音时的参考） */
  const visuals = {
    S01: '封面：智启新质 + 4 张核心指标卡（数字滚动）',
    S02: '核心判断段 + 新质生产力官方定义原文',
    S03: '第一章标题 / 引文块 / 三张特征卡（高科技·高效能·高质量）',
    S04: '第二章标题 / 堆叠式滚动叙事：算力总规模 280 EFLOPS → 智能算力 1590',
    S05: '5G 基站曲线（483.8 万个）→ 万卡级智算集群 42 个',
    S06: '第三章标题 / 产业规模断裂柱状图（5784 亿 → 9000 亿，口径变更标记）',
    S07: '企业数量 6600 家 → 备案大模型 748 款 → 用户 7 亿人（仪表盘）',
    S08: '数字经济规模 59.2 万亿元（双轴图）→ 智能制造全球位置',
    S09: '行业微观样本：8 张效率提升案例卡',
    S10: '就业结构瀑布图（+1.7 亿 / −9200 万 / 净增 7800 万）+ 人才缺口',
    S11: '2027/2030/2035 三阶段环形图 + 六大行动极坐标图 + 政策时间轴',
    S12: '五处口径差异说明卡',
    S13: '数据来源页：24 项来源清单与可信度分级',
    S14: '翻页演示：封面 → 目录浮层 → 产业规模等图表页连续翻页',
    S15: '数据看板：筛选标签 → 数据表视图 → 浅色/深色主题 → 首页结语'
  };

  script.push({
    id: scene.id, name: scene.name, start: sceneStart, dur: sceneDur,
    visual: visuals[scene.id] || '', cues: rows
  });

  rows.forEach((r) => {
    n++;
    const fmtT = (x) => {
      const h = Math.floor(x / 3600), m = Math.floor(x % 3600 / 60), s = Math.floor(x % 60), ms = Math.round((x - Math.floor(x)) * 1000);
      return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')},${String(ms).padStart(3, '0')}`;
    };
    srt.push(`${n}\n${fmtT(r.start)} --> ${fmtT(r.end)}\n${wrap2(r.text, 24)}\n`);
  });
}

fs.writeFileSync(path.join(OUT, 'subtitles.srt'), '\uFEFF' + srt.join('\n'), 'utf8');

/* ------------------------------------------------------------------ ASS（烧录用）
 * 直接给 libass 明确的 PlayRes 1920×1080，避免 SRT 走默认 288 行分辨率导致字号被放大。
 */
const assT = (x) => {
  const h = Math.floor(x / 3600), m = Math.floor(x % 3600 / 60), s = Math.floor(x % 60);
  return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(Math.round((x - Math.floor(x)) * 100)).padStart(2, '0')}`;
};
const assHead = `[Script Info]
; 智启新质 · 演示视频字幕
ScriptType: v4.00+
WrapStyle: 0
ScaledBorderAndShadow: yes
YCbCr Matrix: TV.601
PlayResX: 1920
PlayResY: 1080

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Main,Microsoft YaHei,44,&H00FFFFFF,&H000000FF,&H00101010,&H7A000000,-1,0,0,0,100,100,0.6,0,1,2.2,1.0,2,80,80,72,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
`;
const assEvents = [];
script.forEach((s) => {
  s.cues.forEach((c) => {
    const text = wrap2(c.text, 24).split('\n').join('\\N');
    assEvents.push(`Dialogue: 0,${assT(c.start)},${assT(c.end)},Main,,0,0,0,,${text}`);
  });
});
fs.writeFileSync(path.join(OUT, 'subtitles.ass'), '\uFEFF' + assHead + assEvents.join('\n') + '\n', 'utf8');

/* ------------------------------------------------------------------ 讲解词脚本 */
const mmss = (x) => `${String(Math.floor(x / 60)).padStart(2, '0')}:${String(Math.floor(x % 60)).padStart(2, '0')}`;
let md = `# 《智启新质》演示视频 · 讲解词与时间码

> 用途：**配音脚本**。视频已烧录中文字幕，音轨为静音，直接添加音轨照本朗读即可。
> 站点地址：https://wangling1206.github.io/ai-new-productive-froces/  （见 README 中的正式地址）
> 正文总长：${mmss(TIMELINE[TIMELINE.length - 1].endMs / 1000)}，语速基准：**5.0 字/秒**（约 300 字/分钟）。
> 若你的语速偏慢，可整体把视频放慢或用剪辑软件微调；字幕文件 \`subtitles.srt\` 可单独替换。

---

`;
script.forEach((s, i) => {
  md += `## ${s.id} · ${s.name}\n\n`;
  md += `**时码** \`${mmss(s.start)} – ${mmss(s.start + s.dur)}\`（时长 ${s.dur.toFixed(1)}s）\n\n`;
  md += `**画面**：${s.visual}\n\n`;
  md += `**念白**：\n\n`;
  s.cues.forEach((c) => {
    md += `- \`${mmss(c.start)} – ${mmss(c.end)}\` ${c.text}\n`;
  });
  md += `\n`;
  if (i === script.length - 1) {
    const total = TIMELINE[TIMELINE.length - 1].endMs / 1000;
    const chars = TIMELINE.reduce((a, x) => a + x.chars, 0);
    md += `---\n\n**合计**：${total.toFixed(1)} 秒 · ${chars} 字 · 平均 ${(chars / total).toFixed(2)} 字/秒\n`;
  }
});

fs.writeFileSync(path.join(OUT, '讲解词与时间码.md'), md, 'utf8');

/* ------------------------------------------------------------------ 元信息 */
const bodyEnd = L + (tl.totalWall / 1000);
fs.writeFileSync(path.join(OUT, 'progress.json'), JSON.stringify({
  blackEnd: L,
  bodyDuration: tl.totalWall / 1000,
  timelineDuration: TIMELINE[TIMELINE.length - 1].endMs / 1000,
  cueCount: n,
  sceneCount: TIMELINE.length
}, null, 2));

console.log(`黑场结束（成片 t0）= ${L}s`);
console.log(`场景正文时长 = ${(tl.totalWall / 1000).toFixed(1)}s`);
console.log(`字幕条数 = ${n}`);
console.log('已生成：video/out/subtitles.srt、video/out/讲解词与时间码.md');
