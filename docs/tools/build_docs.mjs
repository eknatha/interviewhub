#!/usr/bin/env node
// Maps every question to official-documentation links and writes docs/<guide>.js (+ docs/coverage.json).
// Usage: node tools/extract.mjs && node tools/build_docs.mjs [--report]      (run from repo root)
//
// Matching: each catalog entry carries a regex. A hit in the question TITLE scores 3 (+1 per extra distinct pattern hit in the title
// is not counted); a body-only hit needs >= 4 occurrences and is only used when no title matched and scores 1. An entry may be restricted to specific guides (4th field).
// Up to MAX links per question, best score first, one link per distinct URL. Questions with no match get the guide's "start here" link.
import fs from 'node:fs';
import { A } from './docs_catalog_a.mjs';
import { B } from './docs_catalog_b.mjs';
import { C } from './docs_catalog_c.mjs';
import { D } from './docs_catalog_d.mjs';
import { E } from './docs_catalog_e.mjs';
import { F } from './docs_catalog_f.mjs';

const MAX = 3;
const CATALOG = [...A, ...B, ...C, ...D, ...E, ...F].map(([label, url, re, guides]) => ({ label, url, re, guides: guides ? new Set(guides.split(',')) : null }));
const GENERIC = /(documentation|user guide|developer guide|manual|overview|reference|\bdocs)$|^(Python Documentation|Azure Kubernetes Service \(AKS\)|Amazon EKS: User guide|Kubernetes: Workloads|Kubernetes: Pods)$/i;
const keyOf = f => f.replace(/\.html$/, '').replace(/_interview_guide$|_guide$/, '');

const HOME = {
  terraform: ['Terraform documentation', 'https://developer.hashicorp.com/terraform/docs'],
  kubernetes: ['Kubernetes documentation', 'https://kubernetes.io/docs/home/'],
  gcp: ['Google Cloud documentation', 'https://cloud.google.com/docs'],
  aws: ['AWS documentation', 'https://docs.aws.amazon.com/'],
  azure: ['Microsoft Azure documentation', 'https://learn.microsoft.com/en-us/azure/'],
  networking: ['Cloudflare Learning Center: networking', 'https://www.cloudflare.com/learning/network-layer/'],
  linux: ['Linux man-pages project', 'https://man7.org/linux/man-pages/'],
  database_performance: ['PostgreSQL documentation', 'https://www.postgresql.org/docs/current/'],
  container_lifecycle: ['Docker documentation', 'https://docs.docker.com/'],
  git_production: ['Git documentation', 'https://git-scm.com/doc'],
  observability: ['Prometheus documentation', 'https://prometheus.io/docs/'],
  cicd: ['GitHub Actions documentation', 'https://docs.github.com/en/actions'],
  sre_reliability: ['Google SRE Book', 'https://sre.google/sre-book/table-of-contents/'],
  product_management: ['CNCF Platforms white paper', 'https://tag-app-delivery.cncf.io/whitepapers/platforms/'],
  coding_scripting: ['Python documentation', 'https://docs.python.org/3/'],
  devsecops_security: ['Kubernetes security checklist', 'https://kubernetes.io/docs/concepts/security/security-checklist/'],
  behavioral_star: ['Amazon Leadership Principles', 'https://www.amazon.jobs/en/principles'],
  sre_devops_scenarios: ['Google SRE Book: Effective Troubleshooting', 'https://sre.google/sre-book/effective-troubleshooting/'],
  architecture_tradeoffs: ['Google Cloud Architecture Framework', 'https://cloud.google.com/architecture/framework'],
  openstack: ['OpenStack documentation', 'https://docs.openstack.org/'],
  ai: ['Hugging Face documentation', 'https://huggingface.co/docs'],
  ansible: ['Ansible documentation', 'https://docs.ansible.com/ansible/latest/'],
  python_sre: ['Python documentation', 'https://docs.python.org/3/'],
  helm: ['Helm documentation', 'https://helm.sh/docs/'],
  system_design: ['Azure Architecture Center: cloud design patterns', 'https://learn.microsoft.com/en-us/azure/architecture/patterns/'],
};

const data = JSON.parse(fs.readFileSync('data/questions.json', 'utf8'));
fs.mkdirSync('docs', { recursive: true });
const report = { generated: data.generated, guides: {}, total: 0, specific: 0, fallback: 0 };
const useCount = new Map();

for (const g of data.guides) {
  const key = keyOf(g.file), out = {};
  let spec = 0, fb = 0;
  for (const q of g.questions) {
    const hits = [];
    CATALOG.forEach((e, idx) => {
      if (e.guides && !e.guides.has(key)) return;
      e.re.lastIndex = 0;
      if (e.re.test(q.q)) { hits.push({ e, idx, s: GENERIC.test(e.label) ? 1.8 : 3 }); return; }
      const m = q.text.match(new RegExp(e.re.source, e.re.flags.replace('g', '') + 'g'));
      if (m && m.length >= 4) hits.push({ e, idx, s: (GENERIC.test(e.label) ? 0.6 : 1) + Math.min(m.length, 6) * 0.05 });
    });
    const titleHits = hits.filter(h => h.s >= 1.5), bodyHits = hits.filter(h => h.s < 1.5);
    // Title matches are precise; body-only matches are only used when the title gave nothing, and capped lower.
    const pool = titleHits.length ? titleHits : bodyHits, cap = titleHits.length ? MAX : 2;
    pool.sort((a, b) => b.s - a.s || a.idx - b.idx);
    const seen = new Set(), links = [];
    for (const h of pool) { if (seen.has(h.e.url)) continue; seen.add(h.e.url); links.push([h.e.label, h.e.url]); if (links.length === cap) break; }
    if (links.length) { spec++; links.forEach(l => useCount.set(l[1], (useCount.get(l[1]) || 0) + 1)); }
    else { fb++; const h = HOME[key]; if (h) links.push([h[0], h[1], 1]); }
    if (links.length) out[q.n] = links;
  }
  fs.writeFileSync(`docs/${key}.js`,
    `// Generated by tools/build_docs.mjs — do not edit by hand. Official documentation links per question number.\n` +
    `(window.DOCS = window.DOCS || {})['${key}'] = ${JSON.stringify(out)};\n`);
  report.guides[key] = { questions: g.count, specific: spec, fallback: fb, pct: Math.round(100 * spec / g.count) };
  report.total += g.count; report.specific += spec; report.fallback += fb;
}
report.pct = Math.round(100 * report.specific / report.total);
report.uniqueUrls = useCount.size;
fs.writeFileSync('docs/coverage.json', JSON.stringify(report, null, 1));
fs.writeFileSync('docs/urls.txt', [...new Set([...CATALOG.map(e => e.url), ...Object.values(HOME).map(h => h[1])])].sort().join('\n') + '\n');
console.log(`catalog ${CATALOG.length} entries | questions with a specific link: ${report.specific}/${report.total} (${report.pct}%) | fallback "start here": ${report.fallback}`);
for (const [k, v] of Object.entries(report.guides)) console.log(`  ${k.padEnd(24)} ${String(v.specific).padStart(3)}/${String(v.questions).padEnd(3)} ${String(v.pct).padStart(3)}%`);
if (process.argv.includes('--report')) {
  const top = [...useCount.entries()].sort((a, b) => b[1] - a[1]).slice(0, 15);
  console.log('\nMost-used links:'); top.forEach(([u, n]) => console.log(' ', String(n).padStart(4), u));
}
