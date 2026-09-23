window.Team = {
  submit(taskId,data){const s=SanaAPI.all();s.proposals.unshift({id:'p'+Date.now(),taskId,team:s.team.name||'Новая команда',idea:data.idea,plan:data.plan,timeline:data.timeline,url:data.url,status:'На рассмотрении'});const t=s.tasks.find(x=>x.id===taskId);if(t)t.proposals=(t.proposals||0)+1;SanaAPI.save();},
  decide(id,status){const p=SanaAPI.all().proposals.find(x=>x.id===id);if(p){p.status=status;SanaAPI.save();}}
};
