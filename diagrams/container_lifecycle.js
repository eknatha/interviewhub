window.DIAGRAMS = window.DIAGRAMS || {};
window.DIAGRAMS.container_lifecycle = {
 1:{t:'cmp',title:'Container vs VM',a:['Virtual machine','Own guest kernel','Heavier, strong isolation'],b:['Container','Shares host kernel','Light, fast start']},
 7:{t:'tiers',title:'Image layers',rows:[['Writable container layer (CoW)'],['App layer (read-only)'],['Dependencies layer'],['Base image layer']]},
 10:{t:'flow',title:'Image scanning',n:['Build image','Scan CVEs','Fail on severity','Push to registry'],e:['','','']},
 13:{t:'tiers',title:'Runtime stack',rows:[['Kubernetes / Docker CLI'],['containerd'],['runc'],['Linux namespaces + cgroups']]},
 16:{t:'flow',title:'Container networking',n:['Container eth0','veth pair','docker0 / bridge','NAT to host'],e:['','','']},
 19:{t:'cmp',title:'Storage types',a:['Volume','Managed by Docker, persistent','Best for data'],b:['Bind mount / tmpfs','Host path / memory','Dev use / scratch']},
 22:{t:'flow',title:'Blue-green',n:['Blue serving','Start green','Switch traffic','Retire blue'],e:['','','']},
 28:{t:'cmp',title:'Privileged container',a:['Normal','Dropped capabilities','Isolated'],b:['Privileged','All host devices and caps','Container escape risk']},
 34:{t:'tiers',title:'Sidecar pattern',rows:[['Pod'],['App container','Sidecar: proxy / logs'],['Shared network + volumes']]},
 37:{t:'flow',title:'Container pipeline',n:['Build','Test','Scan','Push','Deploy'],e:['','','','']},
 43:{t:'flow',title:'Distributed tracing',n:['Request + trace id','Service A span','Service B span','Collector','Trace UI'],e:['propagate','','','']},
 46:{t:'cmp',title:'Distroless',a:['Full base image','Shell, package manager','Bigger attack surface'],b:['Distroless','App + runtime only','Smaller, fewer CVEs']},
 61:{t:'cmp',title:'Tag vs digest',a:['Tag','Mutable pointer','Can change underneath you'],b:['Digest','Immutable sha256','Reproducible deploys']},
 67:{t:'flow',title:'Container lifecycle',n:['Pull image','Create','Start','Running','Stop','Remove'],e:['','','','','']},
 79:{t:'flow',title:'Graceful shutdown',n:['SIGTERM','Stop accepting','Finish in-flight','Exit 0'],e:['','','']},
 94:{t:'flow',title:'Scan, sign, promote',n:['Build','Scan','Sign','Promote to prod registry'],e:['','','']}
};
