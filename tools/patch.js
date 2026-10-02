const fs = require('fs');
const f = process.argv[2];
let s = fs.readFileSync(f, 'utf8');
const before = s;
s = s.replace(/<b>数据来源<\/b> \$\{s\.foot \|\| ''\}/, "<b>数据来源</b> ${(s.foot || '').replace(/^数据来源[:：]\\s*/, '')}");
if (s === before) { console.log('NO MATCH'); process.exit(1); }
fs.writeFileSync(f, s);
console.log('patched');
