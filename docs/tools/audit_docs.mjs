#!/usr/bin/env node
// Audits docs catalog patterns against real question titles. Prints over-broad entries (many title hits) with samples,
// and dead entries (no hits at all) so the catalog can be tuned.  Usage: node tools/audit_docs.mjs [minHits=25]
import fs from 'node:fs';
import { A } from './docs_catalog_a.mjs';
import { B } from './docs_catalog_b.mjs';
import { C } from './docs_catalog_c.mjs';
import { D } from './docs_catalog_d.mjs';
import { E } from './docs_catalog_e.mjs';

const min = +process.argv[2] || 25;
const keyOf = f => f.replace(/\.html$/, '').replace(/_interview_guide$|_guide$/, '');
const data = JSON.parse(fs.readFileSync('data/questions.json', 'utf8'));
const rows = [];
for (const [label, url, re, guides] of [...A, ...B, ...C, ...D, ...E]) {
  const gs = guides ? new Set(guides.split(',')) : null;
  let n = 0, nb = 0; const samples = [];
  for (const g of data.guides) {
    if (gs && !gs.has(keyOf(g.file))) continue;
    for (const q of g.questions) {
      if (re.test(q.q)) { n++; if (samples.length < 4) samples.push(`${keyOf(g.file)}#${q.n} ${q.q.slice(0, 70)}`); }
      else { const m = q.text.match(new RegExp(re.source, re.flags.replace('g', '') + 'g')); if (m && m.length >= 3) nb++; }
    }
  }
  rows.push({ label, n, nb, samples });
}
console.log(`== OVER-BROAD (title hits >= ${min}) ==`);
rows.filter(r => r.n >= min).sort((a, b) => b.n - a.n).forEach(r => { console.log(`${String(r.n).padStart(4)}  ${r.label}`); r.samples.forEach(s => console.log('        ' + s)); });
const dead = rows.filter(r => r.n === 0 && r.nb === 0);
console.log(`\n== DEAD (no title or body hits): ${dead.length} of ${rows.length} ==`);
console.log(dead.map(r => r.label).join(' | '));
