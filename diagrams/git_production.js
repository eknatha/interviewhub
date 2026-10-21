window.DIAGRAMS = window.DIAGRAMS || {};
window.DIAGRAMS.git_production = {
 1:{t:'tiers',title:'Git object model',rows:[['Commit'],['Tree'],['Blob','Blob','Tree']],lab:['points to','contains']},
 5:{t:'flow',title:'Stash',n:['Dirty working tree','git stash','Switch branch / pull','git stash pop'],e:['','','']},
 25:{t:'flow',title:'Reflog recovery',n:['Bad reset','git reflog','Find old HEAD','git reset --hard <sha>'],e:['','','']},
 65:{t:'cmp',title:'Trunk vs GitFlow',a:['Trunk-based','Short branches, flags','Continuous delivery'],b:['GitFlow','develop, release, hotfix','Scheduled releases']},
 69:{t:'flow',title:'Hotfix workflow',n:['Branch from prod tag','Fix + test','Deploy','Merge back to main'],e:['','','']},
 93:{t:'fan',title:'Three-way merge',src:'Common ancestor',mid:['Ours','Theirs'],dst:'Merged result',l1:'diff both',l2:'combine'},
 109:{t:'flow',title:'Three areas',n:['Working tree','git add','Index (staging)','git commit','Repository'],e:['','','']},
 117:{t:'flow',title:'Making a commit',n:['Write blobs','Build tree','Create commit object','Move branch ref'],e:['','','']},
 121:{t:'cmp',title:'restore vs reset vs revert',a:['restore / reset','Change working tree or move HEAD','Local, rewrites'],b:['revert','New commit that undoes','Safe on shared branches']},
 153:{t:'cmp',title:'Force push',a:['--force','Overwrites remote blindly','Can destroy teammates work'],b:['--force-with-lease','Fails if remote moved','Safer']}
};
