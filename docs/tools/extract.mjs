#!/usr/bin/env node
// Extracts every guide's question data into data/questions.json and prints real counts.
// Usage: node tools/extract.mjs           (run from repo root)
// Handles 3 formats: `const|var QS = [...]` literals, and <script id="qs-data" type="application/json">.
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const guides = fs.readdirSync(root).filter(f => f.endsWith('_guide.html')).sort();

function matchBracket(src, start) {
  // src[start] === '['. Returns index of the matching ']', skipping strings/template literals/comments.
  let depth = 0;
  for (let i = start; i < src.length; i++) {
    const c = src[i];
    if (c === '"' || c === "'" || c === '`') {
      const q = c;
      i++;
      while (i < src.length && src[i] !== q) { if (src[i] === '\\') i++; i++; }
    } else if (c === '/' && src[i + 1] === '/') { while (i < src.length && src[i] !== '\n') i++; }
    else if (c === '/' && src[i + 1] === '*') { i = src.indexOf('*/', i + 2) + 1; }
    else if (c === '[') depth++;
    else if (c === ']') { depth--; if (depth === 0) return i; }
  }
  throw new Error('unbalanced brackets');
}

function load(file) {
  const html = fs.readFileSync(path.join(root, file), 'utf8');
  const jsonTag = html.match(/<script[^>]*id=["']qs-data["'][^>]*>([\s\S]*?)<\/script>/);
  if (jsonTag) return JSON.parse(jsonTag[1]);
  const m = html.match(/(?:const|var|let)\s+QS\s*=\s*\[/);
  if (!m) throw new Error('no QS array found');
  const start = m.index + m[0].length - 1;
  const end = matchBracket(html, start);
  return new Function('return ' + html.slice(start, end + 1))();
}

const strip = h => String(h || '').replace(/<[^>]+>/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&amp;/g, '&').replace(/&#?\w+;/g, ' ').replace(/\s+/g, ' ').trim();

const out = { generated: new Date().toISOString().slice(0, 10), guides: [] };
let total = 0;
for (const file of guides) {
  try {
    const qs = load(file);
    const html = fs.readFileSync(path.join(root, file), 'utf8');
    const title = (html.match(/<title>([^<]*)<\/title>/) || [])[1] || file;
    out.guides.push({
      file, title, count: qs.length,
      questions: qs.map((x, i) => ({
        n: x.n ?? i + 1, tag: x.tag || '', q: strip(x.q),
        text: strip(x.body || x.a || x.answer || '').slice(0, 1500),
      })),
    });
    total += qs.length;
    console.log(String(qs.length).padStart(5), file);
  } catch (e) {
    console.error('FAIL', file, e.message);
    process.exitCode = 1;
  }
}
out.total = total;
fs.mkdirSync(path.join(root, 'data'), { recursive: true });
fs.writeFileSync(path.join(root, 'data/questions.json'), JSON.stringify(out));
console.log(String(total).padStart(5), 'TOTAL  ->  data/questions.json');
