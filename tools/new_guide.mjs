#!/usr/bin/env node
// Creates a new guide page by cloning the observability template (QS emptied) and wiring counts, chips and script tags.
// Usage: node tools/new_guide.mjs <key> "<Title>" <count> "<tag:Label,tag:Label,...>" "<meta description>"
// Then: write newq/<key>.json and run tools/addq.sh <key>.  File name: <key>_interview_guide.html
import fs from 'node:fs';
const [key, title, count, tagSpec, desc] = process.argv.slice(2);
if (!key || !title || !count || !tagSpec) { console.error('usage: new_guide.mjs key title count "tag:Label,..." desc'); process.exit(1); }
const out = `${key}_interview_guide.html`;
if (fs.existsSync(out)) { console.error(out, 'exists'); process.exit(1); }
let h = fs.readFileSync('observability_interview_guide.html', 'utf8');
const esc = s => s.replace(/&(?!amp;)/g, '&amp;');
h = h.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)} — InterviewHub</title>`);
h = h.replace(/<meta name="description" content="[^"]*"/, `<meta name="description" content="${count} production-grade ${esc(desc || title)}"`);
h = h.replace(/observability_interview_guide\.html/g, out);
h = h.replace(/<h1 style="([^"]*)">[\s\S]*?<\/h1>/, `<h1 style="$1">${esc(title)} — InterviewHub</h1>`);
h = h.replace(/>80 questions<\/span>/, `>${count} questions</span>`);
h = h.replace(/All \(80\)/, `All (${count})`).replace(/(<div class="stat-n[^"]*"[^>]*>)80(<\/div>)/g, `$1${count}$2`).replace(/Showing 80 questions/, `Showing ${count} questions`);
const chips = tagSpec.split(',').map(s => s.split(':')).map(([t, l]) => `    <div class="chip" onclick="setFilter('${t}',this)">${esc(l)}</div>`).join('\n');
h = h.replace(/(<div class="chip active"[^\n]*\n)[\s\S]*?(  <\/div>\n\n  <div class="fm-bar")/, `$1${chips}\n$2`);
h = h.replace(/var QS = \[[\s\S]*?\n\];?/, 'var QS = [\n];');
h = h.replace(/\/observability\.js/g, `/${key}.js`).replace(/spoken\/observability/g, `spoken/${key}`).replace(/docs\/observability/g, `docs/${key}`);
const PAL = [['#E6F1FB','#0C447C'],['#E1F5EE','#085041'],['#EEEDFE','#3C3489'],['#FAEEDA','#633806'],['#EAF3DE','#27500A'],['#FCEBEB','#791F1F'],['#F1EFE8','#444441'],['#FBEAF0','#72243E'],['#FAC775','#412402'],['#FAECE7','#712B13']];
const tl = tagSpec.split(',').map(s => s.split(':'));
h = h.replace(/(\.badge\{[^\n]*\n)(?:  \.badge\.[^\n]*\n)+/, (_, a) => a + tl.map(([t], i) => `  .badge.${t}{background:${PAL[i % 10][0]};color:${PAL[i % 10][1]};}\n`).join(''));
h = h.replace(/var L=\{[^\n]*\};/, 'var L={' + tl.map(([t, l]) => `'${t}':'${l.replace(/'/g, "\\'")}'`).join(',') + '};');
h = h.replace(/of 80 questions/, `of ${count} questions`);
fs.writeFileSync(out, h);
if (!fs.existsSync(`diagrams/${key}.js`)) fs.writeFileSync(`diagrams/${key}.js`, `window.DIAGRAMS = window.DIAGRAMS || {};\nwindow.DIAGRAMS.${key} = {\n};\n`);
console.log('created', out);
