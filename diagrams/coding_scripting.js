window.DIAGRAMS = window.DIAGRAMS || {};
window.DIAGRAMS.coding_scripting = {
 7:{t:'loop',title:'Retry with backoff',n:['Run command','Failed?','Sleep 2^n + jitter','Retry (max N)'],c:'give up at N'},
 43:{t:'flow',title:'Log frequency count',n:['Read log','Extract status','Count per key','Sort'],e:['','','']},
 49:{t:'flow',title:'Batching',n:['Large list','Slice into chunks','Process each chunk','Aggregate'],e:['','','']},
 61:{t:'flow',title:'Idempotent script',n:['Check exists','Create if missing','Update if different','Safe to re-run'],e:['','','']},
 127:{t:'flow',title:'Single-instance lock',n:['Try lock (flock / mkdir)','Acquired?','Run','Release in trap'],e:['','yes','']},
 145:{t:'flow',title:'Go graceful shutdown',n:['SIGTERM','Stop accepting','Server.Shutdown(ctx)','Drain and exit'],e:['','','']},
 175:{t:'cmp',title:'Two pointers',a:['Left pointer','Starts at index 0','Moves right'],b:['Right pointer','Starts at end','Moves left']},
 181:{t:'cmp',title:'BFS vs DFS',a:['BFS','Queue, level by level','Shortest path unweighted'],b:['DFS','Stack / recursion','Cycle detection, topo sort']},
 187:{t:'flow',title:'Drift detection script',n:['Desired config','Fetch live config','Diff','Report / alert'],e:['','','']}
};
