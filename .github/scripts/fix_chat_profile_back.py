from pathlib import Path

p=Path('index.html')
s=p.read_text(encoding='utf-8')
changed=False

# 1) Mesaj bildirimi, etkileşim bildirimi olarak ikinci kez görünmesin.
old="const otherUnread=unreadNotifs.filter(n=>n.type!=='follow');"
new="const otherUnread=unreadNotifs.filter(n=>n.type!=='follow'&&n.type!=='message');"
if old in s:
    s=s.replace(old,new,1); changed=True

# Bildirim listesindeki message tipini de ayrıca profil bildirimi olarak göstermeyelim.
old="if(unreadNotifs.length){\n    html+='<div class=\"chatListTitle\">Takip ve etkileşimler</div>';"
new="const visibleNotifs=unreadNotifs.filter(n=>n.type!=='message');\n  if(visibleNotifs.length){\n    html+='<div class=\"chatListTitle\">Takip ve etkileşimler</div>';"
if old in s:
    s=s.replace(old,new,1); changed=True

old="html+=unreadNotifs.map(n=>{const a=map[n.actor_id]||{full_name:'Bir kullanıcı',username:'uye'};return `<div class=\"notifRow notifUnread\"><div class=\"av\">${avatarHtml(a)}</div><div><b>${esc(a.full_name)}</b> ${notifText(n)}<div class=\"tiny\">@${esc(a.username||'uye')}</div></div><button class=\"outline\" data-notif-profile=\"${a.id}\">Profil</button></div>`}).join('');"
new="html+=visibleNotifs.map(n=>{const a=map[n.actor_id]||{full_name:'Bir kullanıcı',username:'uye'};return `<div class=\"notifRow notifUnread\"><button type=\"button\" class=\"notifPerson\" data-notif-profile=\"${a.id}\"><div class=\"av\">${avatarHtml(a)}</div><div><b>${esc(a.full_name)}</b> ${notifText(n)}<div class=\"tiny\">@${esc(a.username||'uye')}</div></div></button></div>`}).join('');"
if old in s:
    s=s.replace(old,new,1); changed=True

# 2) Yeni mesaj satırında fotoğraf+isim profile, Mesajlar düğmesi doğrudan o kişinin sohbetine gitsin.
old="return `<div class=\"notifRow notifUnread\"><div class=\"av\">${avatarHtml(a)}</div><div><b>${esc(a.full_name)}</b><div class=\"tiny\">${count} yeni mesaj · @${esc(a.username||'uye')}</div></div><button class=\"outline\" data-go-messages=\"1\">Mesajlar</button></div>`"
new="return `<div class=\"notifRow notifUnread\"><button type=\"button\" class=\"notifPerson\" data-message-profile=\"${senderId}\"><div class=\"av\">${avatarHtml(a)}</div><div><b>${esc(a.full_name)}</b><div class=\"tiny\">${count} yeni mesaj · @${esc(a.username||'uye')}</div></div></button><button class=\"outline\" data-go-chat=\"${senderId}\">Mesajlar</button></div>`"
if old in s:
    s=s.replace(old,new,1); changed=True

old="$$('[data-go-messages]').forEach(b=>b.onclick=()=>{$('#nm').classList.remove('on');route('messages')});"
new="""$$('[data-message-profile]').forEach(b=>b.onclick=()=>{viewedProfileId=b.dataset.messageProfile;$('#nm').classList.remove('on');route('profile')});
  $$('[data-go-chat]').forEach(b=>b.onclick=async()=>{const otherId=b.dataset.goChat;$('#nm').classList.remove('on');route('messages');const q=await sb.from('chat_requests').select('*').eq('status','accepted').or(`and(sender_id.eq.${session.user.id},receiver_id.eq.${otherId}),and(sender_id.eq.${otherId},receiver_id.eq.${session.user.id})`).order('created_at',{ascending:true}).limit(1).maybeSingle();if(q.data)setTimeout(()=>openChat(q.data.id),120)});"""
if old in s:
    s=s.replace(old,new,1); changed=True

# 3) Sohbet başlığındaki fotoğraf/isim tıklanınca profile git.
old="$('#chatAvatar').innerHTML=avatarHtml(u); $('#chatName').textContent=u.full_name||'Üye'; $('#chatUser').textContent='@'+(u.username||'uye');"
new="$('#chatAvatar').innerHTML=avatarHtml(u); $('#chatName').textContent=u.full_name||'Üye'; $('#chatUser').textContent='@'+(u.username||'uye'); $('#chatAvatar').dataset.profileId=otherId; $('#chatName').dataset.profileId=otherId; $('#chatUser').dataset.profileId=otherId;"
if old in s:
    s=s.replace(old,new,1); changed=True

# Sohbet açılırken tarayıcı geri tuşu için bir history adımı oluştur.
old="currentChat=r; const otherId=r.sender_id===session.user.id?r.receiver_id:r.sender_id,u=profilesMap[otherId]||await fetchProfile(otherId)||{full_name:'Üye',username:'uye'};"
new="currentChat=r; if(!history.state?.bulutChat)history.pushState({bulutChat:r.id},'',location.href); const otherId=r.sender_id===session.user.id?r.receiver_id:r.sender_id,u=profilesMap[otherId]||await fetchProfile(otherId)||{full_name:'Üye',username:'uye'};"
if old in s:
    s=s.replace(old,new,1); changed=True

# Görsel geri düğmesi de tarayıcı geri ile aynı davranışı kullansın.
old="$('#chatBack').onclick=async()=>{if(msgChannel){await sb.removeChannel(msgChannel);msgChannel=null}$('#chatPanel').hidden=true;$('.msgCard').hidden=false;await loadRequests()};"
new="""async function closeChatToList(){if(msgChannel){await sb.removeChannel(msgChannel);msgChannel=null}currentChat=null;$('#chatPanel').hidden=true;$('.msgCard').hidden=false;await loadRequests()}
$('#chatBack').onclick=async()=>{if(history.state?.bulutChat)history.back();else await closeChatToList()};
window.addEventListener('popstate',()=>{if(currentChat)closeChatToList()});
['chatAvatar','chatName','chatUser'].forEach(id=>{const el=$('#'+id);if(el){el.style.cursor='pointer';el.onclick=()=>{const pid=el.dataset.profileId;if(!pid)return;viewedProfileId=pid;currentChat=null;route('profile')}}});"""
if old in s:
    s=s.replace(old,new,1); changed=True

# Bildirim kişi alanının buton gibi ama sade görünmesi.
css="""
.notifPerson{display:grid;grid-template-columns:48px 1fr;gap:10px;align-items:center;text-align:left;border:0;background:transparent;padding:0;color:inherit;min-width:0;cursor:pointer}.notifPerson .av{width:48px;height:48px}.notifRow:has(.notifPerson){grid-template-columns:1fr auto}.chatHead #chatAvatar,.chatHead #chatName,.chatHead #chatUser{cursor:pointer}
"""
if '.notifPerson{' not in s:
    s=s.replace('</style>',css+'</style>',1); changed=True

if not changed:
    raise SystemExit('Beklenen kaliplar bulunamadi; dosyaya dokunulmadi.')
p.write_text(s,encoding='utf-8')
