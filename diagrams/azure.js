window.DIAGRAMS = window.DIAGRAMS || {};
window.DIAGRAMS.azure = {
 1:{t:'flow',title:'Entra ID and Azure RBAC',n:['User / identity','Role assignment','Role definition','Scope: sub / RG / resource'],e:['','','']},
 4:{t:'cmp',title:'AKS responsibility',a:['Azure manages','Control plane, etcd','API server SLA'],b:['You manage','Node pools, upgrades','Workloads, networking policy']},
 19:{t:'loop',title:'HPA on AKS',n:['Metrics server','HPA controller','Scale pods','Cluster autoscaler adds nodes'],c:'CPU / custom'},
 22:{t:'cmp',title:'Front Door vs App Gateway',a:['Front Door','Global, anycast edge','Multi-region routing, WAF'],b:['Application Gateway','Regional L7','In-VNet, WAF, ingress']},
 31:{t:'tiers',title:'Hub and spoke',rows:[['On-prem'],['Hub VNet: firewall, gateway'],['Spoke: prod','Spoke: dev','Spoke: shared']],lab:['VPN / ExpressRoute','peering']},
 34:{t:'cmp',title:'Azure load balancers',a:['Load Balancer','L4, regional','Layer 4 TCP/UDP'],b:['App Gateway / Front Door / Traffic Manager','L7 / global L7 / DNS-based','Pick by scope and layer']},
 37:{t:'flow',title:'Conditional Access',n:['Sign-in','Signals: user, device, location','Policy decision','Grant, MFA or block'],e:['','','']},
 40:{t:'tiers',title:'Private AKS',rows:[['Admin via VPN / jump host'],['Private endpoint: API server'],['Nodes in private subnet']]},
 43:{t:'flow',title:'Workload Identity',n:['Pod SA token','Entra federated credential','Access token','Azure resource'],e:['','','']},
 46:{t:'flow',title:'Egress control',n:['AKS nodes','UDR 0.0.0.0/0','Azure Firewall','Internet allowlist'],e:['','','']},
 49:{t:'flow',title:'AKS upgrade',n:['Control plane','Add surge node','Cordon + drain','Replace node','Repeat'],e:['','','','']},
 52:{t:'cmp',title:'Compute choice',a:['Container Apps / App Service','Less ops, faster start','Fewer knobs'],b:['AKS','Full Kubernetes control','More ops cost']},
 55:{t:'flow',title:'Supply chain',n:['Build','Scan','Sign + ACR','Policy admits signed images'],e:['','','']},
 61:{t:'fan',title:'KEDA event scaling',src:'Event source',mid:['Queue depth','Event Hub lag','HTTP rate'],dst:'Scale pods 0 to N',l1:'scalers',l2:''},
 85:{t:'tiers',title:'HA and DR',rows:[['Traffic Manager / Front Door'],['Region A primary','Region B secondary'],['Geo-replicated data']]},
 103:{t:'flow',title:'OIDC deploy',n:['GitHub Actions','OIDC token','Federated credential','Deploy to AKS'],e:['','','']},
 124:{t:'flow',title:'NSG evaluation',n:['Packet','NSG rules by priority','First match wins','Allow or deny'],e:['','','']},
 142:{t:'flow',title:'Slot swap',n:['Deploy to staging slot','Warm up','Swap','Instant rollback by swapping back'],e:['','','']}
};
