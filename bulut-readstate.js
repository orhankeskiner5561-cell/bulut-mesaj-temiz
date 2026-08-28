/* BULUT mesaj okunma durumu: aynı kişiyle oluşmuş eski/çift sohbetler dahil tek yerde temizlenir. */
async function markAllUnreadFromPerson(otherId){
  if(!session||!otherId)return;
  const rows=await chatRowsWith(otherId);
  const chatIds=rows.filter(r=>r.status==='accepted').map(r=>r.id);
  const now=new Date().toISOString();
  if(chatIds.length){
    await sb.from('messages')
      .update({read_at:now,delivered_at:now})
      .eq('sender_id',otherId)
      .in('chat_request_id',chatIds)
      .is('read_at',null);
  }
  await sb.from('notifications')
    .update({read_at:now})
    .eq('user_id',session.user.id)
    .eq('actor_id',otherId)
    .eq('type','message')
    .is('read_at',null);
}

loadMessages=async function(markRead){
  if(!currentChat)return;
  if(markRead&&currentOther?.id)await markAllUnreadFromPerson(currentOther.id);
  const {data,error}=await sb.from('messages')
    .select('*')
    .eq('chat_request_id',currentChat.id)
    .order('created_at',{ascending:true})
    .limit(500);
  if(error)return;
  const rows=data||[];
  $('#chatMessages').innerHTML=rows.map(m=>{
    const mine=m.sender_id===session.user.id;
    const t=new Date(m.created_at).toLocaleTimeString('tr-TR',{hour:'2-digit',minute:'2-digit'});
    return `<div class="bubble ${mine?'mine':''}">${esc(m.body)}<div class="bt">${t}${mine&&m.read_at?' · Görüldü':''}</div></div>`;
  }).join('')||'<div class="empty">İlk mesajı siz gönderin.</div>';
  $('#chatMessages').scrollTop=$('#chatMessages').scrollHeight;
  if(markRead)await refreshBell();
};
