window.DIAGRAMS = window.DIAGRAMS || {};
window.DIAGRAMS.sre_devops_scenarios = {
 1:{t:'flow',title:'Error-rate spike',n:['Check recent deploys','Roll back if correlated','Find failing dependency','Confirm recovery'],e:['','','']},
 13:{t:'flow',title:'SEV1 at 3am',n:['Acknowledge','Declare incident','Mitigate first','Escalate','Postmortem'],e:['','','','']},
 43:{t:'flow',title:'Deploy 502 window',n:['Pod terminating','Still in endpoints','Requests fail','preStop delay + readiness'],e:['','','']},
 103:{t:'flow',title:'Cache stampede',n:['Hot key expires','Many misses','DB overload','Lock / jitter / early refresh'],e:['','','']},
 133:{t:'flow',title:'PDB blocks drain',n:['kubectl drain','Eviction request','PDB minAvailable','Add replicas or relax PDB'],e:['','','']},
 139:{t:'flow',title:'All targets unhealthy',n:['LB health check','Wrong path or port','All targets out','Fix check, restore'],e:['','','']}
};
