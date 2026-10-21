window.DIAGRAMS = window.DIAGRAMS || {};
window.DIAGRAMS.architecture_tradeoffs = {
 17:{t:'cmp',title:'Multi-region patterns',a:['Active-passive','Standby, failover on loss','Cheaper, slower recovery'],b:['Active-active','All regions serve','Costly, data conflicts']},
 33:{t:'cmp',title:'Monolith vs microservices',a:['Monolith','One deploy, simple ops','Coupled scaling'],b:['Microservices','Independent deploys','Network and ops cost']},
 45:{t:'flow',title:'Cache decision',n:['Measure slow reads','Cache hot data','Define invalidation','Watch hit rate'],e:['','','']},
 53:{t:'flow',title:'Sharding ladder',n:['Index + query tuning','Read replicas','Vertical scale','Shard last'],e:['','','']},
 105:{t:'cmp',title:'Cloud strategy',a:['Single cloud, deep','Use managed services fully','Faster delivery, lock-in'],b:['Portable multi-cloud','Common abstractions','Slower, more ops']},
 137:{t:'cmp',title:'Queue vs log',a:['Message queue','Consume and delete','Task distribution'],b:['Log-based stream','Retained and replayable','Many consumers']}
};
