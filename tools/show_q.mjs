#!/usr/bin/env node
// Prints questions still lacking a spoken answer with a condensed answer text. Usage: node tools/show_q.mjs <key> [count=25] [chars=900]
import fs from 'node:fs'; import vm from 'node:vm';
const [key, cnt = 25, chars = 900] = process.argv.slice(2);
const keyOf = f => f.replace(/\.html$/, '').replace(/_interview_guide$|_guide$/, '');
const d = JSON.parse(fs.readFileSync('data/questions.json', 'utf8')), g = d.guides.find(x => keyOf(x.file) === key);
let have = new Set(); if (fs.existsSync(`spoken/${key}.js`)) { const c = { window: {} }; vm.runInNewContext(fs.readFileSync(`spoken/${key}.js`, 'utf8'), c); have = new Set(Object.keys(c.window.SPOKEN[key])); }
const todo = g.questions.filter(q => !have.has(String(q.n)));
console.log(`# ${key}: ${todo.length} remaining of ${g.count}`);
for (const q of todo.slice(0, +cnt)) console.log(`\n## ${q.n}. ${q.q}\n${q.text.replace(/\s+/g, ' ').slice(0, +chars)}`);
