#!/bin/sh
# usage: tools/addq.sh <key>   -> validates JSON, adds questions, re-extracts, checks spoken answers for that guide
cd "$(dirname "$0")/.." || exit 1
node -e "const a=JSON.parse(require('fs').readFileSync('newq/$1.json','utf8'));console.log('items',a.length,'scenario',a.filter(x=>x.kind==='scenario').length);a.forEach((x,i)=>{const w=x.a.trim().split(/\s+/).length;if(w<132||w>212)console.log('  words',i+1,w,x.q.slice(0,50))})" || exit 1
node tools/add_questions.mjs "$1" ${2:+--base $2} && node tools/extract.mjs >/dev/null 2>&1 && node tools/check_spoken.mjs 2>&1 | grep -v '^ ok' | grep -i "$1\|checked"
