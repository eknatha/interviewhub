window.DIAGRAMS = window.DIAGRAMS || {};
window.DIAGRAMS.cicd = {
 1:{t:'flow',title:'CI vs CD',n:['Commit','CI: build + test','Artifact','CD: deploy','Production'],e:['','','','']},
 4:{t:'tiers',title:'GitHub Actions',rows:[['Workflow (on: push)'],['Job A','Job B'],['Steps: run / uses']]},
 10:{t:'tiers',title:'App-of-Apps',rows:[['Root Application'],['App: api','App: web','App: db'],['Cluster resources']]},
 13:{t:'flow',title:'Shift-left security',n:['Commit: secrets scan','Build: SAST + deps','Image: scan + sign','Deploy: policy check'],e:['','','']},
 16:{t:'flow',title:'Rollback',n:['Deploy fails check','Revert / redeploy previous artifact','Verify health'],e:['','']},
 19:{t:'flow',title:'Speeding up CI',n:['Measure stages','Cache dependencies','Parallelize tests','Run only what changed'],e:['','','']},
 28:{t:'flow',title:'Pipeline as code',n:['Pipeline file in repo','Reviewed in PR','Tested on branch','Merged'],e:['','','']},
 31:{t:'cmp',title:'Trunk vs long branches',a:['Trunk-based','Small, frequent merges','Feature flags'],b:['Long-lived branches','Big painful merges','Late integration']},
 52:{t:'loop',title:'ArgoCD self-heal',n:['Git desired state','Compare live','Detect drift','Auto sync'],c:'continuous'},
 58:{t:'flow',title:'GitOps rollback',n:['git revert','Argo detects new commit','Sync to previous state','Audited in history'],e:['','','']},
 67:{t:'tiers',title:'Pipeline hardening',rows:[['Pinned actions and images'],['Least-privilege tokens, OIDC'],['Isolated ephemeral runners'],['Signed artifacts']]},
 70:{t:'flow',title:'Blue-green',n:['Blue live','Deploy green','Test green','Switch router','Keep blue for rollback'],e:['','','','']},
 73:{t:'loop',title:'Metric-based rollback',n:['Deploy canary','Watch SLO metrics','Breach?','Auto rollback'],c:'analysis'},
 76:{t:'flow',title:'Promotion',n:['dev','staging','Approval gate','prod'],e:['same artifact','tests pass','']}
};
