window.DIAGRAMS = window.DIAGRAMS || {};
window.DIAGRAMS.linux = {
 1:{t:'flow',title:'Runaway process',n:['top / ps','Identify PID','strace / perf','Nice, restart or kill'],e:['','','']},
 7:{t:'cmp',title:'df vs du',a:['Blocks full','Large files, deleted but open','Check lsof +L1'],b:['Inodes full','Millions of small files','Check df -i']},
 10:{t:'tiers',title:'VFS',rows:[['Applications (syscalls)'],['VFS layer'],['ext4','xfs','tmpfs'],['Block device']]},
 13:{t:'flow',title:'Network debug',n:['ip link / addr','ip route','ping gateway','dig / curl'],e:['','','']},
 19:{t:'flow',title:'OOM killer',n:['Memory exhausted','Kernel scores processes','Kills highest oom_score','dmesg log'],e:['','','']},
 28:{t:'cmp',title:'RAID levels',a:['RAID 1 / 10','Mirroring','Good for databases'],b:['RAID 5 / 6','Parity','Capacity efficient, slow rebuild']},
 31:{t:'flow',title:'systemd',n:['Unit file','systemctl enable','Target reached','Service running'],e:['','','']},
 46:{t:'tiers',title:'cgroups',rows:[['Container / service'],['cgroup: cpu, memory, io limits'],['Kernel enforces']]},
 52:{t:'flow',title:'Zombie process',n:['Child exits','Parent has not wait()ed','Zombie entry','Fix parent or kill parent'],e:['','','']},
 58:{t:'flow',title:'OOM decision',n:['Free memory low','Page cache reclaimed','Swap used','OOM kill'],e:['','','']},
 61:{t:'flow',title:'Deleted file still holds space',n:['rm file','Process keeps fd open','Space not freed','Restart process or truncate'],e:['','','']},
 76:{t:'tiers',title:'SSH hardening',rows:[['Keys only, no passwords'],['No root login, AllowUsers'],['Fail2ban + firewall'],['MFA / bastion']]},
 85:{t:'flow',title:'USE method',n:['Utilization','Saturation','Errors','Per resource: CPU, mem, disk, net'],e:['','','']},
 94:{t:'tiers',title:'LVM',rows:[['Logical volumes'],['Volume group'],['Physical volumes'],['Disks']]},
 106:{t:'flow',title:'Boot recovery',n:['BIOS / UEFI','GRUB','Kernel + initramfs','systemd','Rescue mode on failure'],e:['','','']},
 124:{t:'flow',title:'Triage method',n:['Define symptom','Check load, CPU, mem, disk, net','Find owner process','Fix and verify'],e:['','','']},
 154:{t:'cmp',title:'High load, low CPU',a:['Likely cause','Processes in D state (I/O wait)','Check iostat, vmstat'],b:['Also check','NFS or disk stalls','Blocked on locks']}
};
