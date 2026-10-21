window.DIAGRAMS = window.DIAGRAMS || {};
window.DIAGRAMS.gcp = {
 1:{t:'flow',title:'GCP IAM',n:['Principal','Role (permissions)','Resource','Inherited down the hierarchy'],e:['bound by policy','on','']},
 10:{t:'tiers',title:'Private GKE',rows:[['Admin via authorized networks'],['Private control plane endpoint'],['Private nodes + Cloud NAT']]},
 13:{t:'flow',title:'Cloud NAT path',n:['VM (no external IP)','Cloud Router','Cloud NAT','Internet'],e:['','','']},
 22:{t:'loop',title:'MIG autoscaling',n:['Metrics','Autoscaler','Add / remove VMs','Health check'],c:'cool-down'},
 28:{t:'flow',title:'Binary Authorization',n:['CI builds image','Attestor signs','Admission checks attestation','Deploy or deny'],e:['','','']},
 46:{t:'cmp',title:'GKE release channels',a:['Rapid / Regular','Newer versions first','More change'],b:['Stable','Slower, tested versions','Fewer surprises']},
 49:{t:'loop',title:'Config Sync',n:['Git repo','Config Sync','Apply to cluster','Report drift'],c:'reconcile'},
 52:{t:'tiers',title:'Firewall hierarchy',rows:[['Organization policy'],['Folder policy'],['VPC firewall rules']]},
 58:{t:'flow',title:'Spot VM',n:['Spot VM running','Preemption notice 30s','Shutdown script','Reschedule elsewhere'],e:['','','']},
 61:{t:'fan',title:'Log sinks',src:'Cloud Logging',mid:['BigQuery','Cloud Storage','Pub/Sub'],dst:'Analysis and archive',l1:'sink filter',l2:''},
 64:{t:'flow',title:'CMEK',n:['Cloud KMS key','Encrypts data key','Service encrypts data','Revoke key: data unreadable'],e:['','','']},
 70:{t:'cmp',title:'BigQuery pricing',a:['On-demand','Pay per TB scanned','Bursty, light use'],b:['Capacity slots','Pay for reserved compute','Steady heavy use']},
 79:{t:'flow',title:'VPC Service Controls',n:['Request','Perimeter check','Access level / ingress rule','Allow or deny'],e:['','','']}
};
