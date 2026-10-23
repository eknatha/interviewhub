#!/usr/bin/env node
// Resolves diagram specs authored against question text into diagrams/<key>.js keyed by question number.
// Usage: node tools/build_diagrams_new.mjs <key>   (reads newq/diag_<key>.json: [{q:"question prefix", t:"flow", ...spec}], needs data/questions.json)
import fs from 'node:fs';
const key = process.argv[2];
if (!key) { console.error('usage: build_diagrams_new.mjs <key>'); process.exit(1); }
const data = JSON.parse(fs.readFileSync('data/questions.json', 'utf8'));
const g = data.guides.find(x => x.file.replace(/(_interview)?_guide\.html$/, '') === key);
if (!g) { console.error('no guide', key); process.exit(1); }
const specs = JSON.parse(fs.readFileSync(`newq/diag_${key}.json`, 'utf8'));
const out = []; let bad = 0; const seen = new Set();
for (const s of specs) {
  const { q, ...spec } = s;
  const hits = g.questions.filter(x => x.q.startsWith(q));
  if (hits.length !== 1) { console.error(hits.length ? 'AMBIGUOUS' : 'NOT FOUND', JSON.stringify(q), hits.length); bad++; continue; }
  const n = hits[0].n; if (seen.has(n)) { console.error('DUPLICATE n', n, q); bad++; continue; } seen.add(n);
  out.push([n, spec]);
}
out.sort((a, b) => a[0] - b[0]);
const body = out.map(([n, s]) => ` ${n}:${JSON.stringify(s)}`).join(',\n');
fs.writeFileSync(`diagrams/${key}.js`, `window.DIAGRAMS = window.DIAGRAMS || {};\nwindow.DIAGRAMS.${key} = {\n${body}\n};\n`);
console.log(key, out.length, 'diagrams written', bad ? `(${bad} problems)` : '');
process.exit(bad ? 1 : 0);
