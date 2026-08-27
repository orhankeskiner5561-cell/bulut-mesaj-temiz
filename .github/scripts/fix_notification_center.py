from pathlib import Path

p=Path('index.html')
s=p.read_text(encoding='utf-8')

old="""  const rows=data||[], accepted=rows.filter(r=>r.status==='accepted'), pending=rows.filter(r=>r.status==='pending');
  let html='';
  if(accepted.length){html+='<div class=\"chatListTitle\">Sohbetler</div>'+accepted.map(r=>chatRequestRow(r,true)).join('')}
  if(pending.length){html+='<div class=\"chatListTitle\">Sohbet İstekleri</div>'+pending.map(r=>chatRequestRow(r,false)).join('')}
"""
new="""  const rows=data||[];
  const acceptedRaw=rows.filter(r=>r.status==='accepted');
  const acceptedMap=new Map();
  acceptedRaw.forEach(r=>{const otherId=r.sender_id===session.user.id?r.receiver_id:r.sender_id;if(!acceptedMap.has(otherId))acceptedMap.set(otherId,r)});
  const accepted=[...acceptedMap.values()];
  const acceptedPeople=new Set(acceptedMap.keys());
  const pendingMap=new Map();
  rows.filter(r=>r.status==='pending').forEach(r=>{const otherId=r.sender_id===session.user.id?r.receiver_id:r.sender_id;if(!acceptedPeople.has(otherId)&&!pendingMap.has(otherId))pendingMap.set(otherId,r)});
  const pending=[...pendingMap.values()];
  let html='';
  if(accepted.length){html+='<div class=\"chatListTitle\">Sohbetler</div>'+accepted.map(r=>chatRequestRow(r,true)).join('')}
  if(pending.length){html+='<div class=\"chatListTitle\">Sohbet İstekleri</div>'+pending.map(r=>chatRequestRow(r,false)).join('')}
"""
if old in s:
    s=s.replace(old,new,1)
elif 'const acceptedMap=new Map();' not in s:
    raise SystemExit('Mesaj listesi kalibi bulunamadi; dosyaya dokunulmadi.')

start=s.find('async function loadNotifications(){')
end=s.find('\nlet t=',start)
if start<0 or end<0:
    raise SystemExit('loadNotifications sinirlari bulunamadi; dosyaya dokunulmadi.')

new_load="""async function loadNotifications(){
  const root=$('#notifList');
  root.innerHTML='<div class=\"loading\">Yükleniyor…</div>';
  if(!session){root.innerHTML='<div class=\"empty\">Bildirimler için giriş yapmalısınız.</div>';return}
  const uid=session.user.id;
  const nr=await sb.from('notifications').select('*').eq('user_id',uid).is('read_at',null).order('created_at',{ascending:false}).limit(100);
  if(nr.error){root.innerHTML='<div class=\"empty\">Bildirimler yüklenemedi.</div>';return}
  const unreadNotifs=nr.data||[];
  const followUnread=unreadNotifs.filter(n=>n.type==='follow');
  const cr=await sb.from('chat_requests').select('id').eq('status','accepted').or(`sender_id.eq.${uid},receiver_id.eq.${uid}`);
  let unreadMessages=[];
  if(!cr.error&&cr.data?.length){
    const ids=[...new Set(cr.data.map(x=>x.id))];
    const mr=await sb.from('messages').select('id,sender_id,chat_request_id,created_at').in('chat_request_id',ids).neq('sender_id',uid).is('read_at',null).order('created_at',{ascending:false});
    if(!mr.error)unreadMessages=mr.data||[];
  }
  const actorIds=[...new Set([...unreadNotifs.map(n=>n.actor_id),...unreadMessages.map(m=>m.sender_id)].filter(Boolean))];
  let actors=[];
  if(actorIds.length){const ar=await sb.from('profiles').select('id,full_name,username,avatar_url').in('id',actorIds);actors=ar.data||[]}
  const map=Object.fromEntries(actors.map(x=>[x.id,x]));
  const msgBySender={};
  unreadMessages.forEach(m=>{msgBySender[m.sender_id]=(msgBySender[m.sender_id]||0)+1});
  const messagePeople=Object.keys(msgBySender).length;
  const followPeople=new Set(followUnread.map(n=>n.actor_id)).size;
  const otherUnread=unreadNotifs.filter(n=>n.type!=='follow');
  const otherPeople=new Set(otherUnread.map(n=>n.actor_id)).size;
  let html=`<div class=\"notice\" style=\"margin-bottom:12px\"><b>Yeni bildirim özeti</b><div style=\"margin-top:7px\">💬 <b>${unreadMessages.length}</b> yeni mesaj · <b>${messagePeople}</b> kişiden</div><div style=\"margin-top:5px\">👤 <b>${followUnread.length}</b> takip bildirimi · <b>${followPeople}</b> kişiden</div>${otherUnread.length?`<div style=\"margin-top:5px\">🔔 <b>${otherUnread.length}</b> etkileşim bildirimi · <b>${otherPeople}</b> kişiden</div>`:''}</div>`;
  if(unreadMessages.length){
    html+='<div class=\"chatListTitle\">Yeni mesajlar</div>';
    html+=Object.entries(msgBySender).map(([senderId,count])=>{const a=map[senderId]||{full_name:'Bir kullanıcı',username:'uye'};return `<div class=\"notifRow notifUnread\"><div class=\"av\">${avatarHtml(a)}</div><div><b>${esc(a.full_name)}</b><div class=\"tiny\">${count} yeni mesaj · @${esc(a.username||'uye')}</div></div><button class=\"outline\" data-go-messages=\"1\">Mesajlar</button></div>`}).join('');
  }
  if(unreadNotifs.length){
    html+='<div class=\"chatListTitle\">Takip ve etkileşimler</div>';
    const notifText=n=>{
      if(n.type==='follow')return 'sizi takip etti.';
      if(n.type==='like')return 'gönderinizi beğendi.';
      if(n.type==='comment')return 'gönderinize yorum yaptı.';
      if(n.type==='reel_like')return 'Reel videonuzu beğendi.';
      if(n.type==='reel_comment')return 'Reel videonuza yorum yaptı.';
      if(n.type==='message')return 'size mesaj gönderdi.';
      return 'sizinle etkileşime geçti.';
    };
    html+=unreadNotifs.map(n=>{const a=map[n.actor_id]||{full_name:'Bir kullanıcı',username:'uye'};return `<div class=\"notifRow notifUnread\"><div class=\"av\">${avatarHtml(a)}</div><div><b>${esc(a.full_name)}</b> ${notifText(n)}<div class=\"tiny\">@${esc(a.username||'uye')}</div></div><button class=\"outline\" data-notif-profile=\"${a.id}\">Profil</button></div>`}).join('');
  }
  if(!unreadMessages.length&&!unreadNotifs.length)html+='<div class=\"empty\">Yeni bildiriminiz yok.</div>';
  root.innerHTML=html;
  $$('[data-notif-profile]').forEach(b=>b.onclick=()=>{viewedProfileId=b.dataset.notifProfile;$('#nm').classList.remove('on');route('profile')});
  $$('[data-go-messages]').forEach(b=>b.onclick=()=>{$('#nm').classList.remove('on');route('messages')});
  const unreadIds=unreadNotifs.map(n=>n.id);
  if(unreadIds.length)await sb.from('notifications').update({read_at:new Date().toISOString()}).in('id',unreadIds);
  await loadNotificationBadge();
}"""

s=s[:start]+new_load+s[end:]
p.write_text(s,encoding='utf-8')
