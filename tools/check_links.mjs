#!/usr/bin/env node
// Checks every URL in docs/urls.txt (HEAD, then GET fallback). Usage: node tools/check_links.mjs [--fail]
// Needs outbound web access (run in CI, not in a sandbox). Exits 1 on dead links when --fail is given.
import fs from 'node:fs';
const urls = fs.readFileSync('docs/urls.txt', 'utf8').split('\n').filter(Boolean);
const bad = []; let i = 0;
async function check(u) {
  for (const method of ['HEAD', 'GET']) {
    try {
      const r = await fetch(u, { method, redirect: 'follow', signal: AbortSignal.timeout(20000), headers: { 'user-agent': 'interview-prep-linkcheck' } });
      if (r.ok || r.status === 403 || r.status === 429 || r.status === 999) return null; // 403/429: bot-blocked, not dead
      if (method === 'GET') return r.status;
    } catch (e) { if (method === 'GET') return String(e.cause?.code || e.message); }
  }
}
async function worker() { while (i < urls.length) { const u = urls[i++]; const r = await check(u); if (r) bad.push([u, r]); } }
await Promise.all(Array.from({ length: 8 }, worker));
console.log(`${urls.length} URLs checked, ${bad.length} failing`);
bad.sort().forEach(([u, r]) => console.log(' ', r, u));
if (bad.length && process.argv.includes('--fail')) process.exit(1);
