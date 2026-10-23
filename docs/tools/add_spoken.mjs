#!/usr/bin/env node
// Merges a JSON batch {"<n>": {"a": "...", "f": ["..",".."]}} into spoken/<key>.js. Usage: node tools/add_spoken.mjs <key> <batch.json>
import fs from 'node:fs'; import vm from 'node:vm';
const [key, batch] = process.argv.slice(2), file = `spoken/${key}.js`;
let cur = {}; if (fs.existsSync(file)) { const c = { window: {} }; vm.runInNewContext(fs.readFileSync(file, 'utf8'), c); cur = c.window.SPOKEN[key]; }
const add = JSON.parse(fs.readFileSync(batch, 'utf8')); Object.assign(cur, add);
const esc = s => s.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
const body = Object.keys(cur).map(Number).sort((a, b) => a - b).map(n => `  ${n}: {\n    a: \`${esc(cur[n].a.trim())}\`,\n    f: ${JSON.stringify(cur[n].f)}\n  }`).join(',\n');
fs.writeFileSync(file, `// Spoken answers (60-90 s) for ${key} guide\n(window.SPOKEN = window.SPOKEN || {})['${key}'] = {\n${body}\n};\n`);
console.log(`${key}: ${Object.keys(cur).length} spoken answers (added ${Object.keys(add).length})`);
