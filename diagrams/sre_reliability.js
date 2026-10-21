window.DIAGRAMS = window.DIAGRAMS || {};
window.DIAGRAMS.sre_reliability = {
 1:{t:'flow',title:'SRE loop',n:['SLO','Error budget','Release velocity','Reliability work'],e:['','spent?','']},
 9:{t:'flow',title:'Burn-rate alert',n:['SLO 99.9%','Error rate over window','Burn rate = rate / budget','Page if above threshold'],e:['','','']},
 13:{t:'flow',title:'Incident lifecycle',n:['Detect','Triage','Mitigate','Resolve','Postmortem'],e:['','','','']},
 25:{t:'flow',title:'Circuit breaker',n:['Closed','Open','Half-open'],e:['failures > N','timeout, probe']},
 29:{t:'flow',title:'Load shedding',n:['Overload','Reject low-priority','Protect critical path','Recover'],e:['','','']},
 73:{t:'fan',title:'Observability pillars',src:'Service',mid:['Metrics','Logs','Traces'],dst:'Debug',l1:'',l2:''},
 85:{t:'cmp',title:'Safe deployment',a:['Blue-green','Switch all traffic','Fast rollback'],b:['Canary','Gradual exposure','Metric-gated']},
 101:{t:'loop',title:'Chaos experiment',n:['Steady state','Hypothesis','Inject failure','Compare'],c:'limit blast radius'},
 113:{t:'cmp',title:'Redundancy',a:['N+1','One spare','Survives one failure'],b:['N+2','Two spares','Survives failure during maintenance']},
 145:{t:'cmp',title:'Rollback vs roll forward',a:['Roll back','Known good state','Fast, safest default'],b:['Roll forward','Fix in place','When rollback is unsafe (schema)']}
};
