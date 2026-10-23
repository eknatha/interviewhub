import fs from 'node:fs';
const q=JSON.parse(fs.readFileSync('data/questions.json','utf8'));
const k=process.argv[2];const g=q.guides.find(x=>x.file.startsWith(k));
const tags={};g.questions.forEach(x=>tags[x.tag]=(tags[x.tag]||0)+1);
console.log(g.file,g.count,JSON.stringify(tags));
console.log(g.questions.map(x=>x.n+' '+x.q.slice(0,85)).join('\n'));
