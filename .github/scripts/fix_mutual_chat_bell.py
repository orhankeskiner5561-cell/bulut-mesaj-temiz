from pathlib import Path
import re

p=Path('index.html')
s=p.read_text(encoding='utf-8')

old = "else if(session){const {data:f}=await sb.from('follows').select('follower_id').eq('follower_id',session.user.id).eq('following_id',p.id).maybeSingle();actions=`<div class=\"profileActions\"><button class=\"${f?'outline':'primary'}\" id=\"followBtn\">${f?'Takibi Bırak':'Takip Et'}</button><button class=\"outline\" id=\"chatBtn\">💬 Sohbet İsteği</button></div>`}else actions='<button class=\"primary full\" data-r=\"login\">Takip ve sohbet için giriş yap</button>';"
new = "else if(session){const {data:f}=await sb.from('follows').select('follower_id').eq('follower_id',session.user.id).eq('following_id',p.id).maybeSingle();const {data:back}=await sb.from('follows').select('follower_id').eq('follower_id',p.id).eq('following_id',session.user.id).maybeSingle();const mutual=!!f&&!!back;actions=`<div class=\"profileActions\"><button class=\"${f?'outline':'primary'}\" id=\"followBtn\">${f?'Takibi Bırak':'Takip Et'}</button><button class=\"outline\" id=\"chatBtn\">${mutual?'💬 Mesajlara Git':'💬 Sohbet İsteği'}</button></div>`;window.__bulutProfileMutual=mutual}else actions='<button class=\"primary full\" data-r=\"login\">Takip ve sohbet için giriş yap</button>';"
if old not in s:
    raise SystemExit('Profil sohbet butonu kalibi bulunamadi; dosyaya dokunulmadi.')
s=s.replace(old,new,1)

old_bind="}else if(session){$('#followBtn').onclick=()=>toggleFollow(p.id);$('#chatBtn').onclick=()=>sendChatRequest(p.id)}}"
new_bind="}else if(session){$('#followBtn').onclick=()=>toggleFollow(p.id);$('#chatBtn').onclick=()=>window.__bulutProfileMutual?openOrCreateMutualChat(p.id):sendChatRequest(p.id)}}"
if old_bind not in s:
    raise SystemExit('Profil sohbet tiklama kalibi bulunamadi; dosyaya dokunulmadi.')
s=s.replace(old_bind,new_bind,1)

anchor="async function sendChatRequest(target){if(!session)return requireLogin('Sohbet isteği için giriş yapmalısınız.');const {error}=await sb.from('chat_requests').upsert({sender_id:session.user.id,receiver_id:target,status:'pending'},{onConflict:'sender_id,receiver_id'});if(error)return toast('Sohbet isteği gönderilemedi.');toast('Sohbet isteği gönderildi ☁️')}"
extra="""
async function openOrCreateMutualChat(target){
  if(!session)return requireLogin('Mesajlaşmak için giriş yapmalısınız.');
  const uid=session.user.id;
  const {data:mine}=await sb.from('follows').select('follower_id').eq('follower_id',uid).eq('following_id',target).maybeSingle();
  const {data:back}=await sb.from('follows').select('follower_id').eq('follower_id',target).eq('following_id',uid).maybeSingle();
  if(!mine||!back)return sendChatRequest(target);
  let {data:req,error}=await sb.from('chat_requests').select('*').or(`and(sender_id.eq.${uid},receiver_id.eq.${target}),and(sender_id.eq.${target},receiver_id.eq.${uid})`).order('created_at',{ascending:true}).limit(1).maybeSingle();
  if(error){console.error(error);return toast('Sohbet açılamadı.');}
  if(req&&req.status!=='accepted'){
    const u=await sb.from('chat_requests').update({status:'accepted'}).eq('id',req.id).select('*').maybeSingle();
    if(u.error){console.error(u.error);return toast('Sohbet açılamadı.');}
    req=u.data;
  }
  if(!req){
    const ins=await sb.from('chat_requests').insert({sender_id:uid,receiver_id:target,status:'accepted'}).select('*').single();
    if(ins.error){console.error(ins.error);return toast('Sohbet açılamadı.');}
    req=ins.data;
  }
  route('messages');
  setTimeout(()=>openChat(req.id),350);
}
"""
if anchor not in s:
    raise SystemExit('sendChatRequest fonksiyonu bulunamadi; dosyaya dokunulmadi.')
s=s.replace(anchor,anchor+'\n'+extra,1)

pat=r"async function loadNotificationBadge\(\)\{.*?\}\nasync function setupNotifications\(\)\{.*?\.subscribe\(\)\}"
m=re.search(pat,s,flags=re.S)
if not m:
    raise SystemExit('Bildirim fonksiyonlari bulunamadi; dosyaya dokunulmadi.')
repl="""async function loadNotificationBadge(){
  const badge=$('#notifBadge'),bell=$('#notifBtn');if(!badge||!bell)return;
  if(!session){badge.hidden=true;badge.textContent='';bell.classList.remove('hasNotification');return}
  const uid=session.user.id;
  let total=0;
  const nres=await sb.from('notifications').select('*',{count:'exact',head:true}).eq('user_id',uid).is('read_at',null);
  if(!nres.error)total+=Number(nres.count||0);
  const q=await sb.from('chat_requests').select('id').eq('status','accepted').or(`sender_id.eq.${uid},receiver_id.eq.${uid}`);
  if(!q.error&&q.data?.length){
    const ids=q.data.map(x=>x.id);
    const mr=await sb.from('messages').select('*',{count:'exact',head:true}).in('chat_request_id',ids).neq('sender_id',uid).is('read_at',null);
    if(!mr.error)total+=Number(mr.count||0);
  }
  badge.hidden=total===0;badge.textContent=total>99?'99+':(total?String(total):'');bell.classList.toggle('hasNotification',total>0);
}
async function setupNotifications(){
  if(notifChannel){await sb.removeChannel(notifChannel);notifChannel=null}
  await loadNotificationBadge();if(!session)return;
  notifChannel=sb.channel('bulut-alerts-'+session.user.id)
    .on('postgres_changes',{event:'INSERT',schema:'public',table:'notifications',filter:`user_id=eq.${session.user.id}`},async payload=>{await loadNotificationBadge();const actor=profilesMap[payload.new.actor_id]||await fetchProfile(payload.new.actor_id);if(payload.new.type==='follow')toast(`${actor?.full_name||'Bir kullanıcı'} sizi takip etti ☁️`)})
    .on('postgres_changes',{event:'INSERT',schema:'public',table:'messages'},async()=>{await loadNotificationBadge()})
    .subscribe();
}"""
s=s[:m.start()]+repl+s[m.end():]

if 'BULUT UNREAD REFRESH V1' not in s:
    refresh_js="""
<script id="bulut-unread-refresh">
/* BULUT UNREAD REFRESH V1 */
window.addEventListener('focus',()=>{if(typeof loadNotificationBadge==='function')loadNotificationBadge()});
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&typeof loadNotificationBadge==='function')loadNotificationBadge()});
/* /BULUT UNREAD REFRESH V1 */
</script>
"""
    s=s.replace('</body>',refresh_js+'\n</body>',1)

p.write_text(s,encoding='utf-8')
