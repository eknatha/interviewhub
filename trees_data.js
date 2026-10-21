/* Decision-tree data for decision_trees.html. Node: {q, o:[[label,nextId],...]} or leaf {t, s:[steps], l:[[guideKey, questionNumber],...]}.
 * Leaf links deep-link to guide cards; tools/check_trees.mjs verifies every number exists. */
window.TREES = [
 { id:'pod', title:'Pod won’t run', icon:'☸', start:'a', n:{
  a:{q:'What does `kubectl get pod` show?',o:[['Pending','p'],['CrashLoopBackOff / Error','c'],['ImagePullBackOff / ErrImagePull','i'],['Running but not Ready','r'],['OOMKilled / Evicted','m']]},
  p:{q:'`kubectl describe pod` → Events: what does the scheduler say?',o:[['Insufficient cpu/memory','p1'],['Taints / affinity / nodeSelector mismatch','p2'],['Unbound PVC','p3']]},
  p1:{t:'Not enough room',s:['Compare pod requests with node allocatable (`kubectl describe node`).','Lower over-sized requests, or add nodes.','If autoscaler should have added a node, check its logs and node-group limits.'],l:[['kubernetes',1],['sre_devops_scenarios',27],['sre_devops_scenarios',32]]},
  p2:{t:'Scheduling constraints',s:['Read the exact event text: untolerated taint, affinity, or nodeSelector.','Add a toleration or relax the rule; check topology spread constraints.'],l:[['kubernetes',1],['sre_devops_scenarios',27]]},
  p3:{t:'Storage not bound',s:['`kubectl get pvc`, then describe it: StorageClass exists? provisioner healthy? zone mismatch?','Use WaitForFirstConsumer to avoid zone traps.'],l:[['kubernetes',11],['kubernetes',61]]},
  c:{q:'`kubectl logs --previous`: what do you see?',o:[['App error / config / missing env','c1'],['Nothing, killed fast','c2'],['Probe failing (liveness)','c3']]},
  c1:{t:'Application or config failure',s:['Fix the error shown (bad env var, secret, DB unreachable).','Check ConfigMap/Secret mounts and the command/args.'],l:[['kubernetes',2],['sre_devops_scenarios',26]]},
  c2:{q:'Exit code in `describe pod` (Last State)?',o:[['137','m'],['1 / 2 / 126 / 127','c1']]},
  c3:{t:'Bad liveness probe',s:['A too-aggressive liveness probe restarts a healthy-but-slow app.','Add a startupProbe; raise timeout/threshold; never make liveness depend on downstream services.'],l:[['kubernetes',40],['kubernetes',2]]},
  i:{t:'Image cannot be pulled',s:['Typo in image/tag? Does the tag exist?','Private registry: imagePullSecrets present in the pod’s namespace and ServiceAccount?','Node egress/NAT or registry rate limits?'],l:[['kubernetes',3],['sre_devops_scenarios',30]]},
  r:{q:'Which probe fails?',o:[['Readiness','r1'],['Startup','c3']]},
  r1:{t:'Readiness failing',s:['`kubectl describe pod`: probe path/port/timeouts.','Exec in and curl the probe endpoint locally.','Check dependencies the probe touches; stuck rollouts follow from this.'],l:[['kubernetes',40],['kubernetes',4],['sre_devops_scenarios',29]]},
  m:{t:'Out of memory / eviction',s:['OOMKilled = container hit its memory limit (exit 137). Evicted = node pressure.','Leak vs bad limit vs traffic: watch memory over time; remember non-heap, page cache, and threads count against the limit.','Set requests = realistic usage; limit with headroom.'],l:[['kubernetes',50],['kubernetes',18],['sre_devops_scenarios',28],['sre_devops_scenarios',42]]}
 }},
 { id:'svc', title:'Service unreachable', icon:'⇄', start:'a', n:{
  a:{q:'Where does the failure start?',o:[['Inside the cluster (pod → Service)','b'],['From outside (Ingress / LB)','x']]},
  b:{q:'`kubectl get endpoints <svc>` — any addresses?',o:[['Empty','e'],['Has endpoints','d']]},
  e:{t:'Selector or readiness problem',s:['Service selector must match pod labels exactly.','Pods must be Ready; fix failing readiness probes.','Check targetPort vs containerPort.'],l:[['kubernetes',7]]},
  d:{q:'Does the Service name resolve from a debug pod?',o:[['No / slow','n'],['Yes, but connection fails','np']]},
  n:{t:'DNS problem',s:['`nslookup kubernetes.default` from a pod; check CoreDNS pods and logs.','Look for ndots search-path amplification and conntrack races (5 s delays).','Check NetworkPolicy allows UDP/TCP 53 to kube-dns.'],l:[['kubernetes',8],['kubernetes',55],['kubernetes',58],['networking',7]]},
  np:{t:'NetworkPolicy or app port',s:['Test pod-IP directly vs Service IP to split kube-proxy from app.','List NetworkPolicies selecting the destination; remember default-allow becomes deny once any policy selects the pod.'],l:[['kubernetes',10],['kubernetes',57],['networking',106]]},
  x:{q:'Ingress controller returns?',o:[['404 / default backend','x1'],['502 / 503 / 504','x2'],['Times out','x3']]},
  x1:{t:'Rule or host mismatch',s:['Check host/path, ingressClassName, and TLS secret.','Controller logs show which rule matched.'],l:[['kubernetes',9],['kubernetes',56]]},
  x2:{t:'Backend problem',s:['502 = bad upstream response, 503 = no healthy targets, 504 = upstream timeout.','Verify endpoints, readiness, and LB/idle timeouts.'],l:[['networking',79],['sre_devops_scenarios',44],['kubernetes',9]]},
  x3:{t:'Path to the LB',s:['Security groups/firewall, LB health checks, node ports reachable, LB provisioned?','Trace layer by layer with curl -v, traceroute/mtr.'],l:[['networking',106],['sre_devops_scenarios',60]]}
 }},
 { id:'lat', title:'High latency / slow service', icon:'⏱', start:'a', n:{
  a:{q:'What do the numbers say?',o:[['p99 bad, p50 fine','t'],['Everything slow','u'],['Slow only in one region/client','g'],['Exactly N seconds every time','k']]},
  t:{t:'Tail latency',s:['Find the slow subset: instance, endpoint, tenant. Compare traces.','Suspects: GC pauses, CPU throttling, retries, lock contention, noisy neighbours, cold caches.','Averages hide this — use histograms.'],l:[['kubernetes',98],['sre_devops_scenarios',108],['observability',20],['observability',29]]},
  u:{q:'USE method on the host: which resource is saturated?',o:[['CPU / run queue','cpu'],['Memory / swapping','mem'],['Disk I/O','io'],['None of them','dep']]},
  cpu:{t:'CPU bound or throttled',s:['`top`, load vs cores, %steal, cgroup throttling.','Profile with perf/flame graphs to find the hot function.'],l:[['linux',18],['linux',49],['linux',90],['sre_devops_scenarios',35]]},
  mem:{t:'Memory pressure',s:['`free -m` (available, not free), swap in/out, OOM kills in dmesg.','Reduce footprint or add memory; tune swappiness.'],l:[['linux',88],['linux',19],['sre_devops_scenarios',80]]},
  io:{t:'Disk bottleneck',s:['`iostat -x`: await, %util, queue depth.','Find the process (iotop); check noisy neighbours and burst credits.'],l:[['linux',87],['linux',20]]},
  dep:{t:'Look past the host',s:['Downstream dependency slow? Pool exhaustion? DNS? Lock contention?','Follow a trace across services; check connection pools and timeouts.'],l:[['linux',93],['sre_devops_scenarios',3],['sre_devops_scenarios',12],['networking',117]]},
  g:{t:'Path-dependent issue',s:['Compare traceroute/mtr from good and bad vantage points.','Check CDN/anycast routing, regional dependencies, DNS geo answers.'],l:[['networking',110],['networking',34],['sre_devops_scenarios',61]]},
  k:{t:'A fixed delay is a timeout',s:['Exactly 5 s often means a DNS timeout/retry or conntrack race; 1 s/3 s are TCP SYN retries.','Check resolv.conf, AAAA lookups, and ndots.'],l:[['sre_devops_scenarios',7],['kubernetes',58],['networking',7]]}
 }},
 { id:'disk', title:'Disk full', icon:'💾', start:'a', n:{
  a:{q:'`df -h` says full. What does `df -i` say?',o:[['Inodes 100%','i'],['Inodes fine','b']]},
  i:{t:'Out of inodes',s:['Millions of tiny files (sessions, mail, cache).','`find / -xdev -type f | cut -d/ -f2 | sort | uniq -c`, then clean up the offending directory.'],l:[['linux',59]]},
  b:{q:'Does `du` add up to roughly the `df` figure?',o:[['No, du is much smaller','d'],['Yes','f']]},
  d:{t:'Deleted-but-open files',s:['`lsof +L1` shows deleted files held open.','Restart or truncate via /proc/<pid>/fd/<n>.'],l:[['linux',61],['linux',7],['sre_devops_scenarios',6]]},
  f:{q:'What is growing?',o:[['Logs','l'],['Database / data files','db'],['Containers / images','ci']]},
  l:{t:'Runaway logs',s:['`du -xh --max-depth=1 /var | sort -h`; truncate, don’t rm, an active log.','Fix rotation (logrotate, journald limits); fix the log spam at source.'],l:[['linux',43],['linux',65],['linux',105]]},
  db:{t:'Database growth',s:['Check bloat, WAL/binlog retention, unarchived replication slots.','Extend the volume online before cleaning.'],l:[['database_performance',34]]},
  ci:{t:'Container storage',s:['`docker system df`; prune images/volumes; set log-driver limits.','On nodes: image GC thresholds and ephemeral-storage limits.'],l:[['linux',65]]}
 }},
 { id:'node', title:'Node NotReady', icon:'🖥', start:'a', n:{
  a:{q:'`kubectl describe node` → Conditions',o:[['MemoryPressure / DiskPressure / PIDPressure','p'],['Ready=Unknown (kubelet silent)','u'],['NetworkUnavailable','n']]},
  p:{t:'Resource pressure',s:['Free disk/memory; check eviction thresholds and image GC.','Cordon the node while fixing.'],l:[['kubernetes',18],['kubernetes',20]]},
  u:{t:'Kubelet or host down',s:['Can you SSH? `systemctl status kubelet`, `journalctl -u kubelet`.','Certificates expired? container runtime hung? instance dead?','Pods reschedule after ~5 min of the not-ready taint (tolerationSeconds).'],l:[['kubernetes',20],['kubernetes',92],['sre_devops_scenarios',33]]},
  n:{t:'CNI problem',s:['Check the CNI daemonset pod on that node and its logs.','Verify node can reach the API server and peers.'],l:[['kubernetes',20]]}
 }},
 { id:'rollout', title:'Rollout stuck', icon:'🚀', start:'a', n:{
  a:{q:'`kubectl rollout status` — new pods?',o:[['Not created','a1'],['Created but not Ready','a2'],['Ready, but errors for users','a3']]},
  a1:{t:'ReplicaSet can’t create pods',s:['Quota, LimitRange, admission webhook rejection, PSA.','`kubectl describe rs` shows the reason.'],l:[['kubernetes',4]]},
  a2:{t:'Readiness failing',s:['Check pod events and logs; compare with the old version’s config.','Roll back with `kubectl rollout undo` while investigating; check maxUnavailable/progressDeadlineSeconds.'],l:[['kubernetes',4],['sre_devops_scenarios',29],['kubernetes',40]]},
  a3:{t:'Bad release in production',s:['Roll back first, investigate second.','If rollback doesn’t recover, look for migrations, caches, or queue state that outlived the deploy.','Zero-downtime errors during rollout: preStop sleep, graceful shutdown, readiness gates.'],l:[['sre_devops_scenarios',5],['sre_devops_scenarios',43],['kubernetes',38],['kubernetes',111]]}
 }},
 { id:'pipe', title:'Pipeline failing', icon:'🔧', start:'a', n:{
  a:{q:'How does it fail?',o:[['Fails every time','e'],['Intermittently / only in CI','f'],['Hangs','h'],['Green but prod broken','g']]},
  e:{t:'Deterministic failure',s:['Read the first error, not the last. Reproduce with the same container image.','Check recent changes: dependency, runner image, secret expiry.'],l:[['kubernetes',30],['cicd',5]]},
  f:{t:'Flaky or environment-specific',s:['Diff environments: versions, env vars, network, time, parallelism.','Quarantine flaky tests; fix shared state and ordering.'],l:[['cicd',25],['sre_devops_scenarios',83]]},
  h:{t:'Stuck pipeline',s:['Runner capacity, waiting for approval, lock, or a command waiting on stdin.','Deployment waiting on rollout: inspect the cluster, not the pipeline.'],l:[['sre_devops_scenarios',84]]},
  g:{t:'Passed but wrong',s:['Missing smoke tests/health gates; config drift; wrong artifact promoted.','Roll back via the pipeline; add post-deploy verification.'],l:[['sre_devops_scenarios',9],['cicd',16],['sre_devops_scenarios',91]]}
 }},
 { id:'err5xx', title:'5xx spike', icon:'🚨', start:'a', n:{
  a:{q:'Did anything change in the last hour?',o:[['Yes, a deploy/config change','r'],['No change','n']]},
  r:{t:'Mitigate by rolling back',s:['Roll back or flip the flag first; confirm recovery on the dashboard.','Then investigate. Declare an incident if user impact is sustained.'],l:[['sre_devops_scenarios',1],['sre_devops_scenarios',5]]},
  n:{q:'Which layer produces the errors?',o:[['Load balancer itself','lb'],['App returns 500','app'],['Dependency timeouts','dep']]},
  lb:{t:'LB vs targets',s:['Compare ELB 5xx vs target 5xx; check target health and capacity/surge queue.','502/503/504 differ in meaning.'],l:[['sre_devops_scenarios',44],['networking',79]]},
  app:{t:'Application errors',s:['Group by endpoint/version/host; read exception logs; check resource saturation and recent traffic shape.'],l:[['sre_devops_scenarios',1],['sre_devops_scenarios',15]]},
  dep:{t:'Dependency or cascading failure',s:['Check timeouts, retries, circuit breakers and pool limits.','Shed load / disable non-critical features to stop the cascade.'],l:[['sre_devops_scenarios',12],['sre_devops_scenarios',116],['sre_devops_scenarios',96]]}
 }},
 { id:'tf', title:'Terraform trouble', icon:'🧱', start:'a', n:{
  a:{q:'What are you seeing?',o:[['State lock error','l'],['Plan shows unexpected changes','p'],['Wants to destroy/recreate a prod resource','d'],['Works locally, fails in CI','c']]},
  l:{t:'State lock',s:['Find out who holds it; is an apply really running?','Only if the holder is dead: `terraform force-unlock <ID>`. Never delete the lock blindly.'],l:[['terraform',8],['terraform',37],['terraform',83]]},
  p:{q:'Why would the plan differ?',o:[['Someone changed it in the console','dr'],['Provider/module version changed','pv'],['I don’t know','pd']]},
  dr:{t:'Drift',s:['`terraform plan -refresh-only` to see drift.','Either revert the console change or update code; import resources created outside.'],l:[['terraform',5],['terraform',21],['terraform',88],['terraform',79]]},
  pv:{t:'Version change',s:['Check `.terraform.lock.hcl` and provider constraints; pin versions.'],l:[['terraform',57],['terraform',6]]},
  pd:{t:'Debug the plan',s:['Read the diff attribute by attribute; look for computed values and `ignore_changes` candidates.','`TF_LOG=DEBUG` as last resort.'],l:[['terraform',6],['terraform',117]]},
  d:{t:'Avoid destroy/recreate',s:['Identify the ForceNew attribute causing replacement.','Use `moved {}` for renames, `lifecycle { prevent_destroy }`, or change in a supported way.'],l:[['terraform',85],['terraform',87],['terraform',32],['sre_devops_scenarios',54]]},
  c:{t:'CI differences',s:['Credentials/role, backend config, Terraform and provider versions, working directory.','Apply a saved plan to avoid plan/apply skew.'],l:[['terraform',20],['terraform',68],['terraform',67]]}
 }},
 { id:'db', title:'Database slow', icon:'🗄', start:'a', n:{
  a:{q:'Is it one query or everything?',o:[['One query got slow','q'],['Everything / connections failing','c'],['Intermittent errors under concurrency','k']]},
  q:{t:'Query regression',s:['`EXPLAIN (ANALYZE, BUFFERS)`: seq scan? bad estimates? stale statistics?','What changed: data volume, plan flip, missing index, parameter sniffing.'],l:[['database_performance',8],['database_performance',6],['database_performance',10],['sre_devops_scenarios',97]]},
  c:{t:'Connections and resources',s:['Pool exhaustion? Max connections? Long transactions or idle-in-transaction?','Check CPU, I/O and replication lag.'],l:[['database_performance',18],['database_performance',35],['sre_devops_scenarios',96],['sre_devops_scenarios',48]]},
  k:{t:'Locking',s:['Look at blocking queries and lock waits; keep transactions short with a consistent lock order.','Retry on deadlock.'],l:[['database_performance',20],['database_performance',43],['sre_devops_scenarios',98],['sre_devops_scenarios',102]]}
 }},
 { id:'dns', title:'DNS failures', icon:'🌐', start:'a', n:{
  a:{q:'Does `dig @8.8.8.8 name` work?',o:[['Yes, but local resolver fails','l'],['No, fails everywhere','z'],['Works for some names only','s']]},
  l:{t:'Resolver issue',s:['Check /etc/resolv.conf, nsswitch order, resolver health and caching.','In Kubernetes: CoreDNS pods, ndots, NetworkPolicy to port 53.'],l:[['networking',7],['linux',17],['kubernetes',8],['sre_devops_scenarios',64]]},
  z:{t:'Authoritative issue',s:['`dig +trace`: delegation, NS records, DNSSEC validation (SERVFAIL).','Registrar/NS mismatch or expired zone.'],l:[['networking',53],['networking',59]]},
  s:{t:'Record- or cache-specific',s:['Negative caching, TTLs, split-horizon views, CNAME at apex.'],l:[['networking',58],['networking',39],['networking',57],['networking',8]]}
 }}
];
