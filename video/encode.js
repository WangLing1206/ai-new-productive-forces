/* ============================================================================
 *  成片封装 (encode.js)
 *  1) 依据黑场位置裁掉片头；2) 烧录中文字幕；3) 片尾淡出；
 *  4) 输出 H.264 / yuv420p / faststart 的 MP4，并附一条静音立体声音轨（便于后期配音）。
 *
 *  用法: node video/encode.js
 * ==========================================================================*/
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const DIR = __dirname;
const OUT = path.join(DIR, 'out');
const FF = process.env.FFMPEG || path.join(DIR, 'ffmpeg-9.0.2-essentials_build', 'bin', 'ffmpeg.exe');
const meta = JSON.parse(fs.readFileSync(path.join(OUT, 'progress.json'), 'utf8'));
const L = meta.blackEnd;

/* -------------------------------------------------- 1. 字幕时间轴平移到裁剪后 */
const raw = fs.readFileSync(path.join(OUT, 'subtitles.srt'), 'utf8').replace(/^\uFEFF/, '');
const shift = (str) => {
  const p = str.split(':');
  const h = +p[0], m = +p[1], s = parseFloat(p[2].replace(',', '.'));
  let t = h * 3600 + m * 60 + s - L;
  if (t < 0) t = 0;
  const hh = Math.floor(t / 3600), mm = Math.floor(t % 3600 / 60), ss = Math.floor(t % 60);
  const ms = Math.round((t - Math.floor(t)) * 1000);
  return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')},${String(ms).padStart(3, '0')}`;
};
const rel = raw.split('\n').map((line) => {
  const m = line.match(/^(\d{2}:\d{2}:\d{2},\d{3}) --> (\d{2}:\d{2}:\d{2},\d{3})$/);
  return m ? `${shift(m[1])} --> ${shift(m[2])}` : line;
}).join('\n');
fs.writeFileSync(path.join(OUT, 'subs_rel.srt'), '\uFEFF' + rel, 'utf8');

/* 同步生成"裁剪后时间轴"的 ASS：-ss 之后滤镜看到的时间从 0 开始 */
const assSrc = fs.readFileSync(path.join(OUT, 'subtitles.ass'), 'utf8').replace(/^\uFEFF/, '');
const assT2 = (x) => {
  const h = Math.floor(x / 3600), m = Math.floor(x % 3600 / 60), s = Math.floor(x % 60);
  return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(Math.round((x - Math.floor(x)) * 100)).padStart(2, '0')}`;
};
const shiftAss = (str) => {
  const p = str.split(':');
  const t = (+p[0]) * 3600 + (+p[1]) * 60 + parseFloat(p[2]) - L;
  return assT2(Math.max(0, t));
};
const assRel = assSrc.replace(/^Dialogue: (\d+),(.+?),(.+?),/gm, (all, layer, a, b) => `Dialogue: ${layer},${shiftAss(a)},${shiftAss(b)},`);
fs.writeFileSync(path.join(OUT, 'subs_rel.ass'), '\uFEFF' + assRel, 'utf8');

/* -------------------------------------------------- 2. 编码参数 */
const DUR = Math.round(meta.bodyDuration * 100) / 100;      /* 正文时长（含片尾留白） */
const FADE = 1.2;
const fadeStart = Math.max(0, DUR - FADE - 0.1);

/* 使用自带 PlayRes 1920×1080 的 ASS 文件烧录，字号可控（44px 白字 + 深色描边） */
const vf = `ass=out/subs_rel.ass,fade=t=out:st=${fadeStart.toFixed(2)}:d=${FADE}`;

const outFile = path.join(OUT, '智启新质-演示视频.mp4');
const args = [
  '-hide_banner', '-y',
  '-ss', String(L),
  '-i', path.join(DIR, 'raw', fs.readdirSync(path.join(DIR, 'raw')).find((f) => f.endsWith('.webm'))),
  '-f', 'lavfi', '-i', 'anullsrc=channel_layout=stereo:sample_rate=48000',
  '-t', String(DUR),
  '-map', '0:v:0', '-map', '1:a:0',
  '-vf', vf,
  '-c:v', 'libx264', '-preset', 'medium', '-crf', '20', '-profile:v', 'high', '-level', '4.1',
  '-pix_fmt', 'yuv420p', '-r', '25', '-g', '50',
  '-c:a', 'aac', '-b:a', '128k', '-ac', '2', '-ar', '48000',
  '-movflags', '+faststart',
  outFile
];

console.log('FFmpeg:', FF);
console.log('裁剪起点:', L + 's  正文时长:', DUR + 's  淡出起点:', fadeStart.toFixed(2) + 's');
console.log('输出:', outFile);
console.log('编码中（1080p 约需 1–4 分钟）…\n');

execFileSync(FF, args, { stdio: 'inherit', cwd: path.join(DIR, '..') === process.cwd() ? DIR : DIR });

const size = fs.statSync(outFile).size;
console.log('\n完成：' + (size / 1024 / 1024).toFixed(1) + ' MB');
