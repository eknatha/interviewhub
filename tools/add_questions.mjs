#!/usr/bin/env node
// Appends new questions to a guide and keeps every hard-coded count in step.
// Usage: node tools/add_questions.mjs <guide-key>        (reads newq/<guide-key>.json, run from repo root)
//
// newq/<key>.json is an array of items. Common fields: tag (must be an existing tag of that guide), q, a (60-90 s spoken answer),
// f (follow-up questions), kind ('core' | 'scenario', only used for the two sub-total tiles, default: first half core).
// Answer body fields depend on the guide style:
//   default guides:  p (HTML paragraph), cmds (array of plain-text lines, optional), tip (HTML, optional), tipLabel (default "Interview tip:")
//   sre_devops_scenarios:   sym, inv (cmd lines), cause, fix (cmd lines), prev, tip
//   architecture_tradeoffs: ctx, clar (lines), trade (lines), why, rec, rev, risk (lines), tip
//   behavioral_star:        cues, demo, show, trap, example, (tip optional)
// Re-running is safe: an item whose `q` already exists in the guide replaces that entry.
import fs from 'node:fs'; import vm from 'node:vm';

const key = process.argv[2];
if (!key) { console.error('usage: add_questions.mjs <guide-key>'); process.exit(1); }
const file = fs.readdirSync('.').find(f => f.endsWith('_guide.html') && f.replace(/(_interview)?_guide\.html$/, '') === key);
if (!file) { console.error('no guide for key', key); process.exit(1); }
const items = JSON.parse(fs.readFileSync(`newq/${key}.json`, 'utf8'));
let html = fs.readFileSync(file, 'utf8');

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const cmds = (arr, cls) => arr && arr.length ? `<div class="${cls}">${arr.map(c => `<div class="cmd">${esc(c)}</div>`).join('')}</div>` : '';
const cmdCls = (/\.cmd-list\s*\{/.test(html) && !/\.cmds\s*\{/.test(html)) ? 'cmd-list' : 'cmds';
const tip = it => it.tip ? `<div class="tip"><b>${it.tipLabel || 'Interview tip:'}</b> ${it.tip}</div>` : '';

function body(it) {
  if (key === 'sre_devops_scenarios') {
    return `<div class="star-step s-sym"><div class="star-label">Symptom</div><p>${it.sym}</p></div>` +
      `<div class="star-step s-inv"><div class="star-label">Investigation</div>${cmds(it.inv, 'cmds')}${it.invNote ? `<p>${it.invNote}</p>` : ''}</div>` +
      `<div class="star-step s-cause"><div class="star-label">Root cause</div><p>${it.cause}</p></div>` +
      `<div class="star-step s-fix"><div class="star-label">Fix / mitigation</div>${cmds(it.fix, 'cmds')}</div>` +
      `<div class="star-step s-prev"><div class="star-label">Prevention</div><div class="good">${it.prev}</div></div>${tip(it)}`;
  }
  if (key === 'architecture_tradeoffs') {
    return `<div class="dec-step d-ctx"><div class="dec-label">Context</div><p>${it.ctx}</p></div>` +
      `<div class="dec-step d-clar"><div class="dec-label">Clarify first</div>${cmds(it.clar, 'cmds')}</div>` +
      `<div class="dec-step d-trade"><div class="dec-label">Trade-offs</div>${cmds(it.trade, 'cmds')}${it.why ? `<p>${it.why}</p>` : ''}</div>` +
      `<div class="dec-step d-rec"><div class="dec-label">Recommendation</div><p>${it.rec}</p></div>` +
      `<div class="dec-step d-rev"><div class="dec-label">Reversibility</div><div class="info">${it.rev}</div></div>` +
      `<div class="dec-step d-risk"><div class="dec-label">De-risk</div>${cmds(it.risk, 'cmds')}</div>${tip(it)}`;
  }
  if (key === 'behavioral_star') {
    return `<div class="info"><b>STAR cues:</b> ${it.cues}</div><p><b>What to demonstrate:</b> ${it.demo}</p>` +
      `<div class="good"><b>Show:</b> ${it.show}</div><div class="warn"><b>Trap:</b> ${it.trap}</div>` +
      `<p><b>Worked example:</b> ${it.example}</p>${tip(it)}`;
  }
  return `<p>${it.p}</p>${it.arch ? `<div class="arch-box">${esc(it.arch)}</div>` : ''}${cmds(it.cmds, cmdCls)}${it.p2 ? `<p>${it.p2}</p>` : ''}${tip(it)}`;
}

// ---- locate + parse QS -------------------------------------------------------------------------------------------------------
function matchBracket(src, start) {
  let depth = 0;
  for (let i = start; i < src.length; i++) {
    const c = src[i];
    if (c === '"' || c === "'" || c === '`') { const q = c; i++; while (i < src.length && src[i] !== q) { if (src[i] === '\\') i++; i++; } }
    else if (c === '/' && src[i + 1] === '/') { while (i < src.length && src[i] !== '\n') i++; }
    else if (c === '/' && src[i + 1] === '*') { i = src.indexOf('*/', i + 2) + 1; }
    else if (c === '[') depth++;
    else if (c === ']') { depth--; if (depth === 0) return i; }
  }
  throw new Error('unbalanced');
}
const jsonTag = html.match(/(<script[^>]*id=["']qs-data["'][^>]*>)([\s\S]*?)(<\/script>)/);
let qs, start, end;
if (jsonTag) { qs = JSON.parse(jsonTag[2]); }
else {
  const m = html.match(/(?:const|var|let)\s+QS\s*=\s*\[/);
  start = m.index + m[0].length - 1; end = matchBracket(html, start);
  qs = new Function('return ' + html.slice(start, end + 1))();
}
const htmlCount = +(html.match(/All \((\d+)\)/) || [])[1];
const baseArg = process.argv.indexOf('--base'); const BASE = baseArg > 0 ? +process.argv[baseArg + 1] : 0;
if (BASE && qs.length > BASE) qs = qs.slice(0, BASE);  // re-run from the original size (drops earlier additions)
const before = qs.length;
const half = Math.floor(items.length / 2);
const added = []; let coreAdded = 0, scenAdded = 0;
items.forEach((it, i) => {
  if (!it.tag || !it.q || !it.a) throw new Error(`item ${i + 1}: tag, q and a are required (${it.q || ''})`);
  if (!qs.some(x => x.tag === it.tag)) throw new Error(`item ${i + 1}: unknown tag '${it.tag}'`);
  const wordsA = it.a.trim().split(/\s+/).length;
  const ex = qs.findIndex(x => (x.q || '').replace(/\s+/g, ' ').trim() === it.q.trim());
  const entry = { n: ex >= 0 ? qs[ex].n : qs.length + 1, tag: it.tag, q: it.q.trim(), body: body(it) };
  if (ex >= 0) qs[ex] = entry; else { qs.push(entry); added.push(entry.n); const core = (it.kind || (i < half ? 'core' : 'scenario')) === 'core'; core ? coreAdded++ : scenAdded++; }
  it._n = entry.n;
});

// ---- write QS back -----------------------------------------------------------------------------------------------------------
if (jsonTag) {
  html = html.replace(jsonTag[0], () => jsonTag[1] + JSON.stringify(qs) + jsonTag[3]);
} else {
  const lit = qs.map(q => JSON.stringify(q).replace(/^\{"n":(\d+),"tag":("[^"]*"),"q":/, '{n:$1,tag:$2,q:').replace(/,"body":/, ',body:')).join(',\n  ');
  html = html.slice(0, start + 1) + '\n  ' + lit + '\n' + html.slice(end);
}

// ---- counts ------------------------------------------------------------------------------------------------------------------
const now = qs.length;
if (htmlCount && htmlCount !== now) {
  const o = htmlCount, n = now, rx = s => new RegExp(s, 'g'), unit = '(questions|scenarios|decisions)';
  const rep = [
    [`content="${o} production-grade`, `content="${n} production-grade`],
    [`\\(${o} Q&amp;A\\)`, `(${n} Q&amp;A)`],
    [`>${o} ${unit}</span>`, `>${n} $1</span>`],
    [`All \\(${o}\\)`, `All (${n})`],
    [`(class="stat-n[^"]*"[^>]*>)${o}(</div><div class="stat-l">(?:Total|Showing))`, `$1${n}$2`],
    [`Showing ${o} ${unit}`, `Showing ${n} $1`],
    [`of ${o} ${unit}`, `of ${n} $1`],
    [`(<b style="color:var\\(--text\\);">)${o} (architecture decision|real production)`, `$1${n} $2`],
    [`(q-pill">)${o} questions`, `$1${n} questions`],
  ];
  rep.forEach(([a, b]) => { html = html.replace(rx(a), b); });
  // sub-total tiles (core / scenario), only for guides that have them
  const tile = (label, delta) => { if (!delta) return; html = html.replace(new RegExp(`(<div class="stat-n[^"]*">)(\\d+)(</div><div class="stat-l">${label}</div>)`), (_, a, v, c) => a + (+v + delta) + c); };
  tile('(?:Core concepts|Core operations|Design problems)', coreAdded); tile('(?:Production scenarios|Trade-off deep dives)', scenAdded);
  const stale = [...html.matchAll(new RegExp(`(?<![\\d.,-])${o}(?= (?:production-grade|questions|scenarios|decisions|Q&amp;A)|\\))`, 'g'))].length;
  if (stale) console.warn(`  note: ${stale} possible stale "${o}" mentions remain in ${file}`);
}
fs.writeFileSync(file, html);
{ const used = new Set(); items.forEach(it => { const b = qs.find(x => x.n === it._n).body; for (const m of b.matchAll(/class="([^"]+)"/g)) m[1].split(/\s+/).forEach(c => used.add(c)); });
  const css = html.replace(/<script[\s\S]*?<\/script>/g, '');
  const missing = [...used].filter(c => !new RegExp('\\.' + c + '(?![\\w-])').test(css));
  if (missing.length) console.warn('  WARN css classes with no style in ' + file + ': ' + missing.join(', ')); }

// ---- spoken answers ----------------------------------------------------------------------------------------------------------
const sf = `spoken/${key}.js`; let cur = {};
if (fs.existsSync(sf)) { const c = { window: {} }; vm.runInNewContext(fs.readFileSync(sf, 'utf8'), c); cur = c.window.SPOKEN[key]; if (BASE) Object.keys(cur).forEach(k => { if (+k > BASE) delete cur[k]; }); }
items.forEach(it => { cur[it._n] = { a: it.a, f: it.f || [] }; });
const sesc = s => s.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
const sbody = Object.keys(cur).map(Number).sort((a, b) => a - b).map(n => `  ${n}: {\n    a: \`${sesc(cur[n].a.trim())}\`,\n    f: ${JSON.stringify(cur[n].f)}\n  }`).join(',\n');
fs.writeFileSync(sf, `// Spoken answers (60-90 s) for ${key} guide\n(window.SPOKEN = window.SPOKEN || {})['${key}'] = {\n${sbody}\n};\n`);
console.log(`${key}: ${before} -> ${now} questions (+${added.length} new, ${items.length - added.length} replaced); spoken ${Object.keys(cur).length}`);
