window.DIAGRAMS = window.DIAGRAMS || {};
window.DIAGRAMS.database_performance = {
 1:{t:'tiers',title:'B-tree index',rows:[['Root page'],['Branch pages'],['Leaf pages (sorted, linked)'],['Heap rows']]},
 4:{t:'cmp',title:'Covering index',a:['Regular index','Index lookup then heap fetch','Extra I/O'],b:['Covering index','All columns in index','Index-only scan']},
 7:{t:'cmp',title:'N+1 queries',a:['N+1','1 query for list + N per row','Slow under load'],b:['Fixed','JOIN or batched IN query','Constant query count']},
 13:{t:'flow',title:'Finding slow queries',n:['pg_stat_statements','Top by total time','EXPLAIN ANALYZE','Index or rewrite'],e:['','','']},
 19:{t:'flow',title:'Connection exhaustion',n:['Many app instances','Each opens many conns','max_connections hit','Add pooler (PgBouncer)'],e:['','','']},
 22:{t:'cmp',title:'Replication',a:['Synchronous','Waits for replica','No loss, slower writes'],b:['Asynchronous','Returns immediately','Lag, possible loss']},
 25:{t:'tiers',title:'Partitioning',rows:[['Parent table'],['Jan','Feb','Mar'],['Pruned by partition key']]},
 43:{t:'cmp',title:'Locking styles',a:['Pessimistic','Lock rows up front','Safe for high contention'],b:['Optimistic','Version check at commit','Best for low contention']},
 46:{t:'cmp',title:'Clustered index',a:['Clustered','Rows stored in index order','One per table'],b:['Non-clustered','Separate structure + pointer','Many per table']},
 67:{t:'flow',title:'Pool sizing',n:['App threads','Pool (small, fixed)','Database','CPU cores bound throughput'],e:['','','']},
 73:{t:'flow',title:'Zero-downtime failover',n:['Detect primary failure','Promote replica','Update endpoint','Reattach old primary'],e:['','','']},
 76:{t:'flow',title:'Change data capture',n:['Database WAL','Logical decoding','Kafka','Consumers / search / cache'],e:['','','']}
};
