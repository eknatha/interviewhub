window.DIAGRAMS = window.DIAGRAMS || {};
window.DIAGRAMS.aws = {
 1:{t:'flow',title:'IAM model',n:['Principal (user / role)','Policy','Action on Resource','Allow or Deny'],e:['assumes','grants','']},
 3:{t:'tiers',title:'Production VPC',rows:[['Internet gateway'],['Public subnets: ALB, NAT'],['Private subnets: app'],['Data subnets: RDS']]},
 15:{t:'cmp',title:'Connectivity options',a:['PrivateLink','One service, one direction','No CIDR overlap issue'],b:['Peering / Transit Gateway','Full network reach','Needs non-overlapping CIDRs']},
 17:{t:'fan',title:'Route 53 policies',src:'DNS query',mid:['Weighted','Latency','Failover'],dst:'Healthy endpoint',l1:'policy',l2:'health check'},
 31:{t:'flow',title:'IAM evaluation',n:['Explicit Deny?','SCP allows?','Boundary allows?','Identity or resource Allow','Allowed'],e:['no','','','']},
 33:{t:'flow',title:'Envelope encryption',n:['KMS CMK','Generate data key','Encrypt data','Store encrypted key with data'],e:['','','']},
 35:{t:'tiers',title:'Organizations and SCPs',rows:[['Management account'],['Org units + SCP guardrails'],['Prod account','Dev account','Security account']]},
 41:{t:'loop',title:'Auto Scaling',n:['CloudWatch metric','Scaling policy','Launch / terminate','Health check'],c:'target tracking'},
 43:{t:'cmp',title:'ECS / EKS / Fargate',a:['ECS and EKS on EC2','You manage nodes','More control, lower unit cost'],b:['Fargate','Serverless tasks or pods','No node ops']},
 47:{t:'tiers',title:'Multi-AZ design',rows:[['Route 53'],['ALB across AZs'],['ASG AZ-a','ASG AZ-b'],['RDS Multi-AZ']]},
 49:{t:'cmp',title:'IMDS versions',a:['IMDSv1','Plain GET, SSRF-prone','Credentials can leak'],b:['IMDSv2','Session token via PUT','Blocks simple SSRF']},
 55:{t:'cmp',title:'Load balancers',a:['ALB (L7) / NLB (L4)','HTTP routing / static IP, TCP','Gateway LB: appliances'],b:['Choose by','Protocol and features','Latency, source IP, inspection']},
 61:{t:'flow',title:'S3 lifecycle',n:['Standard','Infrequent Access','Glacier','Expire'],e:['30d','90d','365d']},
 71:{t:'tiers',title:'Aurora storage',rows:[['Writer instance','Reader instances'],['Shared cluster volume'],['6 copies across 3 AZs']]},
 73:{t:'flow',title:'DynamoDB access',n:['Partition key','Hash to partition','Sort key range','GSI for other queries'],e:['','','']},
 85:{t:'fan',title:'EventBridge',src:'Event source',mid:['Rule 1','Rule 2','Rule 3'],dst:'Targets',l1:'event bus',l2:'match'},
 99:{t:'cmp',title:'Data transfer cost',a:['Cheap or free','Same AZ private IP','Inbound, VPC endpoints for S3'],b:['Expensive','Cross-AZ and cross-region','NAT gateway processing, internet egress']},
 107:{t:'flow',title:'Terraform state on AWS',n:['Terraform','S3 backend','DynamoDB lock','Versioning + KMS'],e:['','','']},
 131:{t:'flow',title:'Pod to AWS IAM',n:['Pod SA token','STS AssumeRoleWithWebIdentity','Role credentials','Call AWS API'],e:['','','']},
 145:{t:'flow',title:'OIDC from CI',n:['CI job OIDC token','IAM trust policy','Short-lived credentials','Deploy'],e:['','','']},
 157:{t:'flow',title:'S3 recovery',n:['Versioning on','Delete marker added','Remove marker','Object restored'],e:['','','']}
};
