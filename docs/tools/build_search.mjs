#!/usr/bin/env node
// Builds search_index.js (window.SEARCH_INDEX) from data/questions.json for search.html. Run after tools/extract.mjs.
import fs from 'node:fs';
const d = JSON.parse(fs.readFileSync('data/questions.json', 'utf8'));
const clean = t => t.replace(/ — InterviewHub.*$/, '').replace(/ Interview Guide.*$/i, '').replace(/ Guide$/i, '').trim();
const idx = { g: [], q: [] };
d.guides.forEach((g, gi) => {
  idx.g.push([g.file, clean(g.title)]);
  g.questions.forEach(q => idx.q.push([gi, q.n, q.tag, q.q, q.text.slice(0, 520)]));
});
fs.writeFileSync('search_index.js', 'window.SEARCH_INDEX=' + JSON.stringify(idx) + ';\n');
console.log('search_index.js:', idx.q.length, 'questions,', idx.g.length, 'guides,', (fs.statSync('search_index.js').size / 1024 | 0), 'KB');
