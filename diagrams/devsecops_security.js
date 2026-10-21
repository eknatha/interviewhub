window.DIAGRAMS = window.DIAGRAMS || {};
window.DIAGRAMS.devsecops_security = {
 5:{t:'flow',title:'External Secrets Operator',n:['Secrets manager','ESO controller','Kubernetes Secret','Pod'],e:['sync','creates','']},
 13:{t:'flow',title:'Secrets in CI',n:['CI job','OIDC to vault','Short-lived secret','Masked in logs'],e:['','','']},
 17:{t:'flow',title:'Cosign signing',n:['Build image','cosign sign','Registry stores signature','Admission verifies'],e:['','','']},
 37:{t:'tiers',title:'Container escape defenses',rows:[['Non-root, read-only rootfs'],['Drop capabilities, seccomp'],['AppArmor / SELinux'],['Sandboxed runtime']]},
 53:{t:'flow',title:'Policy as code',n:['Policy in Git','CI test','Admission controller','Enforce or audit'],e:['','','']},
 73:{t:'cmp',title:'Access keys',a:['Long-lived keys','Leak and stay valid','Hard to rotate'],b:['Short-lived credentials','OIDC / roles, auto-expire','Smaller blast radius']},
 77:{t:'flow',title:'SSRF to metadata',n:['Attacker URL param','Server fetches','169.254.169.254','Cloud credentials stolen'],e:['','','']},
 93:{t:'flow',title:'Incident response phases',n:['Prepare','Detect','Contain','Eradicate','Recover','Review'],e:['','','','','']},
 97:{t:'tiers',title:'Zero trust',rows:[['Verify identity every request'],['Least privilege, per-request'],['Assume breach: segment, log']]},
 101:{t:'flow',title:'OIDC in CI',n:['CI job','Signed OIDC token','Cloud trust policy','Temp credentials'],e:['','','']},
 109:{t:'flow',title:'SBOM',n:['Build','Generate SBOM','Store with image','Scan on new CVEs'],e:['','','']},
 141:{t:'flow',title:'STRIDE',n:['Spoofing','Tampering','Repudiation','Info disclosure','DoS','Elevation'],e:['','','','','']}
};
