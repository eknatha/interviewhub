#!/usr/bin/env node
// Builds the offline question index + skill vocabulary and injects them into resume_mapper.html.
// Usage: node tools/extract.mjs && node tools/build_mapper.mjs      (run from repo root)
import fs from 'node:fs';
import vm from 'node:vm';
import { VOCAB } from './vocab.mjs';

const data = JSON.parse(fs.readFileSync('data/questions.json', 'utf8'));
const keyOf = f => f.replace(/\.html$/, '').replace(/_interview_guide$|_guide$/, '');

// which questions already have a spoken answer
const spoken = {};
for (const f of fs.existsSync('spoken') ? fs.readdirSync('spoken') : []) {
  const sb = { window: {} }; vm.createContext(sb);
  vm.runInContext(fs.readFileSync(`spoken/${f}`, 'utf8'), sb);
  const [k, v] = Object.entries(sb.window.SPOKEN)[0];
  spoken[k] = new Set(Object.keys(v).map(Number));
}

const shortName = {
  terraform: 'Terraform', kubernetes: 'Kubernetes', gcp: 'GCP', aws: 'AWS', azure: 'Azure', networking: 'Networking',
  linux: 'Linux', database_performance: 'Databases', container_lifecycle: 'Containers', git_production: 'Git',
  observability: 'Observability', cicd: 'CI/CD', sre_reliability: 'SRE', product_management: 'Platform PM',
  coding_scripting: 'Coding', devsecops_security: 'DevSecOps', behavioral_star: 'Behavioral',
  sre_devops_scenarios: 'Scenarios', architecture_tradeoffs: 'Architecture', system_design: 'System design',
};

const tags = [];
const guides = data.guides.map(g => { const k = keyOf(g.file); return [g.file, shortName[k] || k, g.count]; });
const q = [];
data.guides.forEach((g, gi) => {
  const k = keyOf(g.file);
  for (const x of g.questions) {
    let ti = tags.indexOf(x.tag); if (ti < 0) ti = tags.push(x.tag) - 1;
    const inTitle = [], inBody = [];
    VOCAB.forEach(([, , re], id) => {
      if (re.test(x.q)) inTitle.push(id); else if (re.test(x.text)) inBody.push(id);
    });
    q.push([gi, x.n, ti, x.q, inTitle, inBody, spoken[k]?.has(Number(x.n)) ? 1 : 0]);
  }
});

const vocab = VOCAB.map(([label, cat, re]) => [label, cat, re.source, re.flags]);
const index = { g: guides, t: tags, q, built: data.generated };

let html = fs.readFileSync('resume_mapper.html', 'utf8');
const inject = (name, obj) => {
  const re = new RegExp(`/\\*${name}:START\\*/[\\s\\S]*?/\\*${name}:END\\*/`);
  if (!re.test(html)) throw new Error(`marker ${name} missing in resume_mapper.html`);
  html = html.replace(re, () => `/*${name}:START*/${JSON.stringify(obj).replace(/</g, '\\u003c')}/*${name}:END*/`);
};
inject('INDEX', index);
inject('VOCAB', vocab);
fs.writeFileSync('resume_mapper.html', html);
const kb = Math.round(fs.statSync('resume_mapper.html').size / 1024);
console.log(`resume_mapper.html rebuilt: ${q.length} questions, ${VOCAB.length} skills, ${kb} KB`);
