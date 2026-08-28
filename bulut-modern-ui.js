(()=>{
  // Site doğrudan açıldığında veri yüklemeleri tamamlanmadan önce Ana Akış'ı görünür yap.
  // init() ağ isteğinde takılsa bile kullanıcı boş ekran görmesin.
  const showInitialHome=()=>{
    const hasExplicitRoute=location.hash && location.hash!=='#' && location.hash!=='#home';
    if(hasExplicitRoute)return;
    document.querySelectorAll('.page').forEach(x=>x.classList.remove('on'));
    document.getElementById('home')?.classList.add('on');
    document.querySelectorAll('[data-r]').forEach(x=>x.classList.toggle('on',x.dataset.r==='home'));
    if(location.hash!=='#home')history.replaceState(history.state,'','#home');
  };
  showInitialHome();
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',showInitialHome,{once:true});
  setTimeout(showInitialHome,120);

  const style=document.createElement('style');
  style.textContent=`
  @keyframes bulutPop{from{opacity:0;transform:translateY(-8px) scale(.97)}to{opacity:1;transform:translateY(0) scale(1)}}
  @keyframes bulutSlide{from{opacity:0;transform:translateX(18px)}to{opacity:1;transform:translateX(0)}}
  #nm.on .box{animation:bulutPop .2s ease-out}
  #chatPanel:not([hidden]){animation:bulutSlide .22s ease-out}
  #nm .back{background:rgba(15,23,42,.45)!important;backdrop-filter:blur(10px)!important}
  #nm .box{width:min(520px,94vw)!important;border-radius:28px!important;background:rgba(255,255,255,.9)!important;backdrop-filter:blur(24px)!important;border:1px solid rgba(255,255,255,.7)!important;box-shadow:0 25px 80px rgba(15,23,42,.22)!important;padding:18px!important}
  #notifList .notice{border-radius:18px!important;background:linear-gradient(135deg,#fff7d7,#fffdf2)!important}
  #notifList .notifRow{border:1px solid #e7eef7!important;border-radius:18px!important;margin:8px 0!important;padding:11px!important;background:rgba(255,255,255,.9)!important}
  #notifList .notifUnread{background:linear-gradient(135deg,#eef8ff,#f8fbff)!important}
  #chatPanel{border-radius:28px!important;border:1px solid #e4edf6!important;box-shadow:0 22px 70px rgba(42,101,160,.16)!important;background:rgba(255,255,255,.92)!important}
  #chatMessages{background:linear-gradient(180deg,#f9fcff,#eef7ff)!important;scroll-behavior:smooth}
  #chatMessages .bubble{border-radius:20px!important;box-shadow:0 5px 18px rgba(42,101,160,.08)!important}
  #chatMessages .bubble.mine{background:linear-gradient(135deg,#2d8cff,#45c6ff)!important}
  .bulut-chat-tools{display:flex;gap:6px;padding:9px 11px 0;background:#fff}
  .bulut-tool-btn{width:38px;height:38px;border:0;border-radius:12px;background:#f2f7fc;font-size:18px;display:grid;place-items:center}
  #notifBtn{position:relative!important;color:#203047!important}
  #notifBadge{background:linear-gradient(135deg,#ef4444,#f97316)!important;min-width:21px!important;height:21px!important;font-size:11px!important;right:-5px!important;top:-6px!important}
  `;
  document.head.appendChild(style);

  const cutoffKey=()=>session?.user?.id?`bulut_read_cutoff_${session.user.id}`:'bulut_read_cutoff_guest';
  const getCutoffs=()=>{try{return JSON.parse(localStorage.getItem(cutoffKey())||'{}')||{}}catch{return {}}};
  const setCutoff=(otherId,ts=Date.now())=>{if(!otherId)return;const c=getCutoffs();c[otherId]=Math.max(Number(c[otherId]||0),Number(ts||0));localStorage.setItem(cutoffKey(),JSON.stringify(c));};
  const isFresh=(m)=>new Date(m.created_at).getTime()>Number(getCutoffs()[m.sender_id]||0);

  window.markAllMessagesRead=async()=>{if(typeof loadNotificationBadge==='function')await loadNotificationBadge()};

  const bell=document.getElementById('notifBtn');
  if(bell){bell.innerHTML=`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082A23.848 23.848 0 0 1 12 17.25c-.982 0-1.954-.057-2.857-.168m5.714 0a24.255 24.255 0 0 0 4.071-.817c-1.02-1.11-1.712-2.57-1.712-4.265v-1.5a5.216 5.216 0 0 0-10.432 0V12c0 1.695-.692 3.155-1.712 4.265 1.33.386 2.69.66 4.071.817m5.714 0a3 3 0 1 1-5.714 0"/></svg>`;bell.setAttribute('aria-label','Bildirimler')}

  const modernizeNotifications=()=>{const h=document.querySelector('#nm .mh h2');if(h&&!h.dataset.modernTitle){h.dataset.modernTitle='1';h.innerHTML='<span style="display:block;font-size:22px;font-weight:900">Bildirimler</span><span style="display:block;font-size:12px;color:#71829a;font-weight:500;margin-top:2px">Mesajlar ve son hareketler</span>'}};
  const autoGrow=el=>{if(!el)return;el.style.height='auto';el.style.height=Math.min(el.scrollHeight,128)+'px'};
  const addChatTools=()=>{const composer=document.querySelector('#chatPanel .chatComposer');if(!composer||composer.parentElement.querySelector('.bulut-chat-tools'))return;const tools=document.createElement('div');tools.className='bulut-chat-tools';tools.innerHTML='<button type="button" class="bulut-tool-btn" id="bulutEmojiBtn">😊</button><button type="button" class="bulut-tool-btn" id="bulutFileBtn">📎</button>';composer.parentElement.insertBefore(tools,composer);const input=document.getElementById('chatInput');document.getElementById('bulutEmojiBtn').onclick=()=>{if(input){input.value+=(input.value?' ':'')+'😊';input.focus();autoGrow(input)}};document.getElementById('bulutFileBtn').onclick=()=>{if(typeof toast==='function')toast('Dosya gönderme özelliği hazırlanıyor.')}};
  const chatInput=document.getElementById('chatInput');if(chatInput){chatInput.addEventListener('input',()=>autoGrow(chatInput));chatInput.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();document.getElementById('chatForm')?.requestSubmit?.()}})};
  modernizeNotifications();addChatTools();

  const originalBadge=window.loadNotificationBadge;
  window.loadNotificationBadge=async function(){
    const badge=document.getElementById('notifBadge'),bell=document.getElementById('notifBtn');
    if(!badge||!bell)return;
    if(!session){badge.hidden=true;badge.textContent='';bell.classList.remove('hasNotification');return}
    const uid=session.user.id;
    let messagePeople=0;
    const cr=await sb.from('chat_requests').select('id').eq('status','accepted').or(`sender_id.eq.${uid},receiver_id.eq.${uid}`);
    if(!cr.error&&cr.data?.length){const ids=[...new Set(cr.data.map(x=>x.id))];const mr=await sb.from('messages').select('sender_id,created_at').in('chat_request_id',ids).neq('sender_id',uid).is('read_at',null);if(!mr.error)messagePeople=new Set((mr.data||[]).filter(isFresh).map(m=>m.sender_id)).size}
    let otherCount=0;const nr=await sb.from('notifications').select('id,type').eq('user_id',uid).is('read_at',null);if(!nr.error)otherCount=(nr.data||[]).filter(n=>n.type!=='message').length;
    const total=messagePeople+otherCount;
    badge.hidden=total===0;badge.textContent=total?String(Math.min(total,99))+(total>99?'+':''):'';bell.classList.toggle('hasNotification',total>0);
  };

  window.loadNotifications=async function(){
    const root=document.getElementById('notifList');if(!root)return;root.innerHTML='<div class="loading">Yükleniyor…</div>';
    if(!session){root.innerHTML='<div class="empty">Bildirimler için giriş yapmalısınız.</div>';return}
    const uid=session.user.id;
    const nr=await sb.from('notifications').select('*').eq('user_id',uid).is('read_at',null).order('created_at',{ascending:false}).limit(100);const unreadNotifs=nr.data||[];
    const cr=await sb.from('chat_requests').select('id').eq('status','accepted').or(`sender_id.eq.${uid},receiver_id.eq.${uid}`);let unreadMessages=[];
    if(!cr.error&&cr.data?.length){const ids=[...new Set(cr.data.map(x=>x.id))];const mr=await sb.from('messages').select('id,sender_id,chat_request_id,created_at').in('chat_request_id',ids).neq('sender_id',uid).is('read_at',null).order('created_at',{ascending:false});if(!mr.error)unreadMessages=(mr.data||[]).filter(isFresh)}
    const actorIds=[...new Set([...unreadNotifs.map(n=>n.actor_id),...unreadMessages.map(m=>m.sender_id)].filter(Boolean))];let actors=[];if(actorIds.length){const ar=await sb.from('profiles').select('id,full_name,username,avatar_url').in('id',actorIds);actors=ar.data||[]};const map=Object.fromEntries(actors.map(x=>[x.id,x]));const msgBySender={};unreadMessages.forEach(m=>msgBySender[m.sender_id]=(msgBySender[m.sender_id]||0)+1);
    const followUnread=unreadNotifs.filter(n=>n.type==='follow');const visibleNotifs=unreadNotifs.filter(n=>n.type!=='message');let html=`<div class="notice"><b>Yeni bildirim özeti</b><div style="margin-top:7px">💬 <b>${unreadMessages.length}</b> yeni mesaj · <b>${Object.keys(msgBySender).length}</b> kişiden</div><div style="margin-top:5px">👤 <b>${followUnread.length}</b> takip bildirimi</div></div>`;
    if(unreadMessages.length){html+='<div class="chatListTitle">Yeni mesajlar</div>';html+=Object.entries(msgBySender).map(([id,count])=>{const a=map[id]||{full_name:'Bir kullanıcı',username:'uye'};return `<div class="notifRow notifUnread"><div class="av">${avatarHtml(a)}</div><div><b>${esc(a.full_name)}</b><div class="tiny">${count} yeni mesaj · @${esc(a.username||'uye')}</div></div><button class="outline" data-go-chat="${id}">Mesajlar</button></div>`}).join('')}
    if(visibleNotifs.length){html+='<div class="chatListTitle">Takip ve etkileşimler</div>';html+=visibleNotifs.map(n=>{const a=map[n.actor_id]||{full_name:'Bir kullanıcı',username:'uye'};const t=n.type==='follow'?'sizi takip etti.':'sizinle etkileşime geçti.';return `<div class="notifRow notifUnread"><div class="av">${avatarHtml(a)}</div><div><b>${esc(a.full_name)}</b> ${t}<div class="tiny">@${esc(a.username||'uye')}</div></div></div>`}).join('')}
    if(!unreadMessages.length&&!visibleNotifs.length)html+='<div class="empty">Yeni bildiriminiz yok.</div>';root.innerHTML=html;
    const ids=unreadNotifs.map(n=>n.id);if(ids.length)await sb.from('notifications').update({read_at:new Date().toISOString()}).in('id',ids);await window.loadNotificationBadge();
  };

  if(typeof window.openChat==='function'&&!window.openChat.__bulutCutoffWrapped){const original=window.openChat;const wrapped=async function(requestId){try{if(session){const q=await sb.from('chat_requests').select('*').eq('id',requestId).maybeSingle();if(q.data){const otherId=q.data.sender_id===session.user.id?q.data.receiver_id:q.data.sender_id;setCutoff(otherId,Date.now());const b=document.getElementById('notifBadge');if(b){b.hidden=true;b.textContent=''}}}}catch(e){console.error(e)}const r=await original(requestId);try{if(session&&currentChat){const otherId=currentChat.sender_id===session.user.id?currentChat.receiver_id:currentChat.sender_id;setCutoff(otherId,Date.now());await window.loadNotificationBadge()}}catch(e){console.error(e)}return r};wrapped.__bulutCutoffWrapped=true;window.openChat=wrapped}

  document.addEventListener('click',async e=>{const btn=e.target.closest?.('[data-go-chat]');if(!btn)return;e.preventDefault();e.stopImmediatePropagation();if(!session)return;const otherId=btn.dataset.goChat;setCutoff(otherId,Date.now());const q=await sb.from('chat_requests').select('*').eq('status','accepted').or(`and(sender_id.eq.${session.user.id},receiver_id.eq.${otherId}),and(sender_id.eq.${otherId},receiver_id.eq.${session.user.id})`).order('created_at',{ascending:false}).limit(1).maybeSingle();if(!q.data)return;document.getElementById('nm')?.classList.remove('on');document.querySelectorAll('.page').forEach(x=>x.classList.remove('on'));document.getElementById('messages')?.classList.add('on');history.replaceState(history.state,'','#messages');if(typeof loadRequests==='function')await loadRequests();await window.openChat(q.data.id);await window.loadNotificationBadge()},true);

  new MutationObserver(()=>{modernizeNotifications();addChatTools()}).observe(document.documentElement,{subtree:true,childList:true});
  window.addEventListener('focus',()=>window.loadNotificationBadge?.());
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)window.loadNotificationBadge?.()});
  window.addEventListener('online',()=>window.loadNotificationBadge?.());
})();