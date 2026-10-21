#!/usr/bin/env node
// Validates trees_data.js: node references resolve, no orphans/cycles, and every leaf link points to an existing question.
import fs from 'node:fs'; import vm from 'node:vm';
const ctx = { window: {} }; vm.runInNewContext(fs.readFileSync('trees_data.js', 'utf8'), ctx);
const keyOf = f => f.replace(/\.html$/, '').replace(/_interview_guide$|_guide$/, '');
const data = JSON.parse(fs.readFileSync('data/questions.json', 'utf8'));
const have = new Set(); data.guides.forEach(g => g.questions.forEach(q => have.add(keyOf(g.file) + '#' + q.n)));
let bad = 0, leaves = 0, links = 0; const err = m => { bad++; console.log('ERR', m); };
for (const t of ctx.window.TREES) {
  const seen = new Set();
  (function walk(id, path) {
    const n = t.n[id]; if (!n) return err(`${t.id}: missing node ${id}`);
    if (path.includes(id)) return err(`${t.id}: cycle at ${id}`);
    seen.add(id);
    if (n.o) n.o.forEach(([, nx]) => walk(nx, [...path, id]));
    else { leaves++; if (!n.t || !n.s?.length) err(`${t.id}.${id} incomplete leaf`); (n.l || []).forEach(([g, q]) => { links++; if (!have.has(g + '#' + q)) err(`${t.id}.${id} bad link ${g}#${q}`); }); }
  })(t.start, []);
  Object.keys(t.n).filter(k => !seen.has(k)).forEach(k => err(`${t.id}: orphan node ${k}`));
}
console.log(`${ctx.window.TREES.length} trees, ${leaves} leaves, ${links} links, ${bad} errors`); process.exit(bad ? 1 : 0);
