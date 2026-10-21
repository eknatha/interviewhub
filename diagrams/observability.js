window.DIAGRAMS = window.DIAGRAMS || {};
window.DIAGRAMS.observability = {
 1:{t:'fan',title:'Three signals',src:'Application',mid:['Metrics','Logs','Traces'],dst:'Correlated by trace id',l1:'emit',l2:''},
 4:{t:'flow',title:'PromQL pipeline',n:['Counter','rate([5m])','sum by (job)','Alert / graph'],e:['','','']},
 7:{t:'flow',title:'Log pipeline',n:['App stdout','Agent','Buffer / queue','Store (Loki / ELK)'],e:['','','']},
 10:{t:'flow',title:'OpenTelemetry',n:['SDK in app','OTLP','Collector','Backend'],e:['','','']},
 13:{t:'flow',title:'SLI, SLO, SLA',n:['SLI: measurement','SLO: internal target','SLA: contract with penalty'],e:['','']},
 31:{t:'cmp',title:'Metric types',a:['Counter, Gauge','Only goes up / up and down','Use rate() on counters'],b:['Histogram, Summary','Distribution buckets','Percentiles with quantile']},
 34:{t:'cmp',title:'USE vs RED',a:['USE (resources)','Utilization, Saturation, Errors','Infra and hosts'],b:['RED (services)','Rate, Errors, Duration','Request-driven services']},
 46:{t:'flow',title:'Multi-window burn rate',n:['Error budget','Fast burn: 1h and 5m','Slow burn: 6h and 30m','Page or ticket'],e:['','','']},
 49:{t:'cmp',title:'What to alert on',a:['Symptoms','User-visible impact','Page on these'],b:['Causes','CPU, disk, queue','Dashboards, not pages']}
};
