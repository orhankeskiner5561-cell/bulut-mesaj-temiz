from pathlib import Path

p=Path('index.html')
s=p.read_text(encoding='utf-8')

old_route="function route(r){if(!['home','reels','agenda','rooms','messages','profile','register','login'].includes(r))r='home';$$('.page').forEach(x=>x.classList.remove('on'));$('#'+r).classList.add('on');$$('[data-r]').forEach(x=>x.classList.toggle('on',x.dataset.r===r));location.hash=r;if(r==='profile')renderProfile();if(r==='messages')loadRequests();scrollTo(0,0)}"
new_route="function route(r){if(!['home','reels','agenda','rooms','messages','profile','register','login'].includes(r))r='home';$$('.page').forEach(x=>x.classList.remove('on'));$('#'+r).classList.add('on');$$('[data-r]').forEach(x=>x.classList.toggle('on',x.dataset.r===r));location.hash=r;if(r==='profile')renderProfile();if(r==='messages'){loadRequests();markAllMessagesRead()}scrollTo(0,0)}"
if old_route not in s:
    raise SystemExit('route kalibi bulunamadi')
s=s.replace(old_route,new_route,1)

anchor="$('#notifBtn').onclick=async()=>{if(!session)return requireLogin('Bildirimleri görmek için giriş yapmalısınız.');$('#nm').classList.add('on');await loadNotifications()};"
helper="""async function markAllMessagesRead(){
  if(!session)return;
  const uid=session.user.id;
  const q=await sb.from('chat_requests').select('id').eq('status','accepted').or(`sender_id.eq.${uid},receiver_id.eq.${uid}`);
  if(q.error||!q.data?.length){await loadNotificationBadge();return}
  const ids=q.data.map(x=>x.id);
  const now=new Date().toISOString();
  await sb.from('messages').update({read_at:now}).in('chat_request_id',ids).neq('sender_id',uid).is('read_at',null);
  await loadNotificationBadge();
}
"""
if anchor not in s:
    raise SystemExit('bildirim butonu kalibi bulunamadi')
s=s.replace(anchor,helper+anchor,1)

old_load="async function loadNotifications(){const root=$('#notifList');root.innerHTML='<div class=\"loading\">Yükleniyor…</div>';const {data,error}=await sb.from('notifications').select('*').order('created_at',{ascending:false}).limit(100);if(error){root.innerHTML='<div class=\"empty\">Bildirimler yüklenemedi.</div>';return}if(!data?.length){root.innerHTML='<div class=\"empty\">Henüz bildiriminiz yok.</div>';await loadNotificationBadge();return}const actorIds=[...new Set(data.map(n=>n.actor_id))];const {data:actors}=await sb.from('profiles').select('id,full_name,username,avatar_url').in('id',actorIds);const map=Object.fromEntries((actors||[]).map(x=>[x.id,x]));root.innerHTML=data.map(n=>{const a=map[n.actor_id]||{full_name:'Bir kullanıcı',username:'uye'};const text=n.type==='follow'?'sizi takip etti.':'bildirim gönderdi.';return `<div class=\"notifRow ${n.read_at?'':'notifUnread'}\"><div class=\"av\">${avatarHtml(a)}</div><div><b>${esc(a.full_name)}</b> ${text}<div class=\"tiny\">@${esc(a.username)}</div></div><button class=\"outline\" data-notif-profile=\"${a.id}\">Profil</button></div>`}).join('');$$('[data-notif-profile]').forEach(b=>b.onclick=()=>{viewedProfileId=b.dataset.notifProfile;$('#nm').classList.remove('on');route('profile')});const unread=data.filter(n=>!n.read_at).map(n=>n.id);if(unread.length){await sb.from('notifications').update({read_at:new Date().toISOString()}).in('id',unread);await loadNotificationBadge()}}"

new_load="""async function loadNotifications(){
  const root=$('#notifList');
  root.innerHTML='<div class=\"loading\">Yükleniyor…</div>';
  if(!session){root.innerHTML='<div class=\"empty\">Bildirimler için giriş yapmalısınız.</div>';return}
  const uid=session.user.id;
  const nr=await sb.from('notifications').select('*').eq('user_id',uid).order('created_at',{ascending:false}).limit(100);
  if(nr.error){root.innerHTML='<div class=\"empty\">Bildirimler yüklenemedi.</div>';return}
  const data=nr.data||[];
  const unreadNotifs=data.filter(n=>!n.read_at);
  const followUnread=unreadNotifs.filter(n=>n.type==='follow');
  const cr=await sb.from('chat_requests').select('id').eq('status','accepted').or(`sender_id.eq.${uid},receiver_id.eq.${uid}`);
  let unreadMessages=[];
  if(!cr.error&&cr.data?.length){
    const ids=cr.data.map(x=>x.id);
    const mr=await sb.from('messages').select('id,sender_id,chat_request_id,created_at').in('chat_request_id',ids).neq('sender_id',uid).is('read_at',null).order('created_at',{ascending:false});
    if(!mr.error)unreadMessages=mr.data||[];
  }
  const actorIds=[...new Set([...data.map(n=>n.actor_id),...unreadMessages.map(m=>m.sender_id)].filter(Boolean))];
  let actors=[];
  if(actorIds.length){const ar=await sb.from('profiles').select('id,full_name,username,avatar_url').in('id',actorIds);actors=ar.data||[]}
  const map=Object.fromEntries(actors.map(x=>[x.id,x]));
  const msgBySender={};
  unreadMessages.forEach(m=>{msgBySender[m.sender_id]=(msgBySender[m.sender_id]||0)+1});
  const messagePeople=Object.keys(msgBySender).length;
  const followPeople=new Set(followUnread.map(n=>n.actor_id)).size;
  const otherUnread=unreadNotifs.filter(n=>n.type!=='follow');
  const otherPeople=new Set(otherUnread.map(n=>n.actor_id)).size;
  let html=`<div class=\"notice\" style=\"margin-bottom:12px\"><b>Yeni bildirim özeti</b><div style=\"margin-top:7px\">💬 <b>${unreadMessages.length}</b> yeni mesaj · <b>${messagePeople}</b> kişiden</div><div style=\"margin-top:5px\">👤 <b>${followUnread.length}</b> takip bildirimi · <b>${followPeople}</b> kişiden</div>${otherUnread.length?`<div style=\"margin-top:5px\">🔔 <b>${otherUnread.length}</b> diğer bildirim · <b>${otherPeople}</b> kişiden</div>`:''}</div>`;
  if(unreadMessages.length){
    html+='<div class=\"chatListTitle\">Yeni mesajlar</div>';
    html+=Object.entries(msgBySender).map(([senderId,count])=>{const a=map[senderId]||{full_name:'Bir kullanıcı',username:'uye'};return `<div class=\"notifRow notifUnread\"><div class=\"av\">${avatarHtml(a)}</div><div><b>${esc(a.full_name)}</b><div class=\"tiny\">${count} yeni mesaj · @${esc(a.username||'uye')}</div></div><button class=\"outline\" data-go-messages=\"1\">Mesajlar</button></div>`}).join('');
  }
  html+='<div class=\"chatListTitle\">Takip ve bildirimler</div>';
  if(data.length){
    html+=data.map(n=>{const a=map[n.actor_id]||{full_name:'Bir kullanıcı',username:'uye'};const text=n.type==='follow'?'sizi takip etti.':'bildirim gönderdi.';return `<div class=\"notifRow ${n.read_at?'':'notifUnread'}\"><div class=\"av\">${avatarHtml(a)}</div><div><b>${esc(a.full_name)}</b> ${text}<div class=\"tiny\">@${esc(a.username)}</div></div><button class=\"outline\" data-notif-profile=\"${a.id}\">Profil</button></div>`}).join('');
  }else html+='<div class=\"empty\">Takip veya diğer bildiriminiz yok.</div>';
  root.innerHTML=html;
  $$('[data-notif-profile]').forEach(b=>b.onclick=()=>{viewedProfileId=b.dataset.notifProfile;$('#nm').classList.remove('on');route('profile')});
  $$('[data-go-messages]').forEach(b=>b.onclick=()=>{$('#nm').classList.remove('on');route('messages')});
  const now=new Date().toISOString();
  const unreadIds=unreadNotifs.map(n=>n.id);
  if(unreadIds.length)await sb.from('notifications').update({read_at:now}).in('id',unreadIds);
  if(unreadMessages.length){const msgIds=unreadMessages.map(m=>m.id);await sb.from('messages').update({read_at:now}).in('id',msgIds)}
  await loadNotificationBadge();
}"""
if old_load not in s:
    raise SystemExit('loadNotifications kalibi bulunamadi')
s=s.replace(old_load,new_load,1)
p.write_text(s,encoding='utf-8')
