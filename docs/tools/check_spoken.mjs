#!/usr/bin/env node
// Validates spoken/*.js: question exists, answer is 60-90 s of speech (130-215 words at ~140-150 wpm).
// Usage: node tools/extract.mjs && node tools/check_spoken.mjs     (run from repo root)
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = process.cwd();
const data = JSON.parse(fs.readFileSync(path.join(root, 'data/questions.json'), 'utf8'));
const keyOf = f => f.replace(/\.html$/, '').replace(/_interview_guide$|_guide$/, '');
const byKey = Object.fromEntries(data.guides.map(g => [keyOf(g.file), g]));
const MIN = 130, MAX = 215;

let bad = 0, total = 0;
for (const f of fs.readdirSync(path.join(root, 'spoken')).filter(x => x.endsWith('.js')).sort()) {
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(path.join(root, 'spoken', f), 'utf8'), sandbox);
  const key = f.replace(/\.js$/, '');
  const set = sandbox.window.SPOKEN?.[key];
  const guide = byKey[key];
  if (!set || !guide) { console.error(`FAIL ${f}: key '${key}' not found in file or guides`); bad++; continue; }
  for (const [n, v] of Object.entries(set)) {
    total++;
    const q = guide.questions.find(x => String(x.n) === n);
    const words = v.a.trim().split(/\s+/).length;
    const secs = Math.round(words / 2.4); // ~144 wpm
    const issues = [];
    if (!q) issues.push('no such question');
    if (words < MIN || words > MAX) issues.push(`${words} words (want ${MIN}-${MAX})`);
    if (!Array.isArray(v.f) || v.f.length < 1) issues.push('missing follow-ups');
    console.log(`${issues.length ? 'WARN' : ' ok '} ${key} Q${n} ~${secs}s ${words}w  ${q ? q.q.slice(0, 60) : ''}${issues.length ? '  <- ' + issues.join('; ') : ''}`);
    if (issues.length) bad++;
  }
}
console.log(`\n${total} spoken answers checked, ${bad} issue(s).`);
process.exitCode = bad ? 1 : 0;
