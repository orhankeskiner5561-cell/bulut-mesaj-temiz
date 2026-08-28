(()=>{
  const style=document.createElement('style');
  style.textContent=`
  @keyframes bulutPop{from{opacity:0;transform:translateY(-8px) scale(.97)}to{opacity:1;transform:translateY(0) scale(1)}}
  @keyframes bulutSlide{from{opacity:0;transform:translateX(18px)}to{opacity:1;transform:translateX(0)}}
  #nm.on .box{animation:bulutPop .2s ease-out}
  #chatPanel:not([hidden]){animation:bulutSlide .22s ease-out}
  #nm .back{background:rgba(15,23,42,.45)!important;backdrop-filter:blur(10px)!important}
  #nm .box{width:min(520px,94vw)!important;border-radius:28px!important;background:rgba(255,255,255,.88)!important;backdrop-filter:blur(24px)!important;border:1px solid rgba(255,255,255,.7)!important;box-shadow:0 25px 80px rgba(15,23,42,.22)!important;padding:18px!important}
  #notifList .notice{border-radius:18px!important;background:linear-gradient(135deg,#fff7d7,#fffdf2)!important}
  #notifList .notifRow{border:1px solid #e7eef7!important;border-radius:18px!important;margin:8px 0!important;padding:11px!important;background:rgba(255,255,255,.88)!important}
  #notifList .notifUnread{background:linear-gradient(135deg,#eef8ff,#f8fbff)!important}
  #notifList .outline{border-radius:14px!important;background:#fff!important}
  #chatPanel{border-radius:28px!important;border:1px solid #e4edf6!important;box-shadow:0 22px 70px rgba(42,101,160,.16)!important;background:rgba(255,255,255,.9)!important;backdrop-filter:blur(20px)!important}
  #chatPanel .chatHead{background:rgba(255,255,255,.92)!important;backdrop-filter:blur(18px)!important;padding:14px!important}
  #chatMessages{background:linear-gradient(180deg,#f9fcff,#eef7ff)!important;padding:16px!important;scroll-behavior:smooth}
  #chatMessages .bubble{border-radius:20px!important;padding:11px 14px!important;box-shadow:0 5px 18px rgba(42,101,160,.08)!important}
  #chatMessages .bubble.mine{background:linear-gradient(135deg,#2d8cff,#45c6ff)!important}
  .bulut-chat-tools{display:flex;gap:6px;padding:9px 11px 0;background:rgba(255,255,255,.96)}
  .bulut-tool-btn{width:38px;height:38px;border:0;border-radius:12px;background:#f2f7fc;font-size:18px;display:grid;place-items:center}
  #chatPanel .chatComposer{background:rgba(255,255,255,.96)!important;padding:9px 11px 12px!important}
  #chatInput{border-radius:18px!important;background:#f8fbff!important;min-height:48px!important;transition:.18s}
  #chatInput:focus{border-color:#57bfff!important;box-shadow:0 0 0 4px rgba(87,191,255,.15)!important;background:#fff!important}
  #chatPanel .chatComposer .primary{border-radius:16px!important;background:linear-gradient(135deg,#2d8cff,#45c6ff)!important;box-shadow:0 8px 22px rgba(45,140,255,.22)!important}
  #notifBtn{position:relative!important;color:#203047!important}
  #notifBtn svg{width:25px;height:25px;pointer-events:none}
  #notifBadge{background:linear-gradient(135deg,#ef4444,#f97316)!important;box-shadow:0 5px 15px rgba(239,68,68,.3)!important;min-width:21px!important;height:21px!important;font-size:11px!important;right:-5px!important;top:-6px!important}
  `;
  document.head.appendChild(style);

  // Ana kodda route('messages') bu ismi çağırıyor. Eski toplu-okundu
  // davranışını geri getirmeden ReferenceError oluşmasını engelle.
  // Okundu bilgisi yalnızca gerçekten açılan sohbet içinde güncellenir.
  window.markAllMessagesRead=async function(){
    try{
      if(typeof loadNotificationBadge==='function') await loadNotificationBadge();
    }catch(err){console.error('BULUT badge refresh',err)}
  };

  const bell=document.getElementById('notifBtn');
  if(bell){
    bell.innerHTML=`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082A23.848 23.848 0 0 1 12 17.25c-.982 0-1.954-.057-2.857-.168m5.714 0a24.255 24.255 0 0 0 4.071-.817c-1.02-1.11-1.712-2.57-1.712-4.265v-1.5a5.216 5.216 0 0 0-10.432 0V12c0 1.695-.692 3.155-1.712 4.265 1.33.386 2.69.66 4.071.817m5.714 0a3 3 0 1 1-5.714 0"/></svg>`;
    bell.setAttribute('aria-label','Bildirimler');
  }

  const modernizeNotifications=()=>{
    const modal=document.getElementById('nm');
    if(!modal) return;
    const head=modal.querySelector('.mh');
    if(head && !head.querySelector('[data-modern-title]')){
      const h=head.querySelector('h2');
      if(h){h.dataset.modernTitle='1';h.innerHTML='<span style="display:block;font-size:22px;font-weight:900">Bildirimler</span><span style="display:block;font-size:12px;color:#71829a;font-weight:500;margin-top:2px">Mesajlar ve son hareketler</span>';}
    }
  };

  const autoGrow=el=>{if(!el)return;el.style.height='auto';el.style.height=Math.min(el.scrollHeight,128)+'px'};

  const addChatTools=()=>{
    const composer=document.querySelector('#chatPanel .chatComposer');
    if(!composer || composer.parentElement.querySelector('.bulut-chat-tools')) return;
    const tools=document.createElement('div');
    tools.className='bulut-chat-tools';
    tools.innerHTML=`<button type="button" class="bulut-tool-btn" id="bulutEmojiBtn" title="Emoji" aria-label="Emoji ekle">😊</button><button type="button" class="bulut-tool-btn" id="bulutFileBtn" title="Dosya gönderme yakında" aria-label="Dosya gönderme yakında">📎</button>`;
    composer.parentElement.insertBefore(tools,composer);
    const input=document.getElementById('chatInput');
    const emoji=document.getElementById('bulutEmojiBtn');
    const file=document.getElementById('bulutFileBtn');
    if(emoji)emoji.onclick=()=>{if(input){input.value+=(input.value?' ':'')+'😊';input.focus();autoGrow(input)}};
    if(file)file.onclick=()=>{
      if(typeof toast==='function') toast('Dosya gönderme özelliği hazırlanıyor. Şimdilik metin ve emoji gönderebilirsiniz.');
    };
  };

  const chatInput=document.getElementById('chatInput');
  if(chatInput){
    chatInput.addEventListener('input',()=>autoGrow(chatInput));
    chatInput.addEventListener('keydown',e=>{
      if(e.key==='Enter'&&!e.shiftKey){
        e.preventDefault();
        const form=document.getElementById('chatForm');
        if(form?.requestSubmit)form.requestSubmit();
      }
    });
  }

  modernizeNotifications();
  addChatTools();

  const notifRoot=document.getElementById('notifList');
  if(notifRoot)new MutationObserver(modernizeNotifications).observe(notifRoot,{childList:true,subtree:true});
  const chatPanel=document.getElementById('chatPanel');
  if(chatPanel)new MutationObserver(addChatTools).observe(chatPanel,{childList:true,subtree:true,attributes:true});

  // Mesaj okunma durumu için tek kaynak messages.read_at olsun.
  // Yalnızca kullanıcının gerçekten açtığı kişiyle olan konuşmayı okundu yap.
  if(typeof window.openChat==='function' && !window.openChat.__bulutModernWrapped){
    const originalOpenChat=window.openChat;
    const wrapped=async function(requestId){
      const result=await originalOpenChat(requestId);
      try{
        if(!session||!currentChat)return result;
        const otherId=currentChat.sender_id===session.user.id?currentChat.receiver_id:currentChat.sender_id;
        const q=await sb.from('chat_requests').select('id').eq('status','accepted').or(`and(sender_id.eq.${session.user.id},receiver_id.eq.${otherId}),and(sender_id.eq.${otherId},receiver_id.eq.${session.user.id})`);
        if(!q.error&&q.data?.length){
          const ids=[...new Set(q.data.map(x=>x.id))];
          const now=new Date().toISOString();
          await sb.from('messages').update({read_at:now,delivered_at:now}).in('chat_request_id',ids).eq('sender_id',otherId).is('read_at',null);
        }
        await sb.from('notifications').update({read_at:new Date().toISOString()}).eq('user_id',session.user.id).eq('actor_id',otherId).eq('type','message').is('read_at',null);
        if(typeof loadNotificationBadge==='function')await loadNotificationBadge();
        if(typeof loadNotifications==='function'&&document.getElementById('nm')?.classList.contains('on'))await loadNotifications();
      }catch(err){console.error('BULUT read sync',err)}
      return result;
    };
    wrapped.__bulutModernWrapped=true;
    window.openChat=wrapped;
  }

  // Bildirim kartındaki "Mesajlar" düğmesi doğrudan doğru kişiyi açsın.
  // Ana route() içindeki eşzamanlı loadRequests çağrısıyla yarışmamak için
  // mesaj sayfasını burada kontrollü şekilde açıp listeyi bekliyoruz.
  document.addEventListener('click',async e=>{
    const btn=e.target.closest?.('[data-go-chat]');
    if(!btn)return;
    e.preventDefault();
    e.stopImmediatePropagation();
    if(!session)return;
    const otherId=btn.dataset.goChat;
    if(!otherId)return;
    btn.disabled=true;
    try{
      const q=await sb.from('chat_requests').select('*').eq('status','accepted').or(`and(sender_id.eq.${session.user.id},receiver_id.eq.${otherId}),and(sender_id.eq.${otherId},receiver_id.eq.${session.user.id})`).order('created_at',{ascending:false}).limit(1).maybeSingle();
      if(q.error||!q.data){
        if(typeof toast==='function')toast('Sohbet bulunamadı.');
        return;
      }
      const modal=document.getElementById('nm');
      if(modal)modal.classList.remove('on');
      document.querySelectorAll('.page').forEach(x=>x.classList.remove('on'));
      const messagesPage=document.getElementById('messages');
      if(messagesPage)messagesPage.classList.add('on');
      document.querySelectorAll('[data-r]').forEach(x=>x.classList.toggle('on',x.dataset.r==='messages'));
      if(location.hash!=='#messages')history.replaceState(history.state,'','#messages');
      window.scrollTo(0,0);
      if(typeof loadRequests==='function')await loadRequests();
      if(typeof window.openChat==='function')await window.openChat(q.data.id);
      if(typeof loadNotificationBadge==='function')await loadNotificationBadge();
    }catch(err){
      console.error('BULUT direct notification chat',err);
      if(typeof toast==='function')toast('Sohbet açılamadı. Tekrar deneyin.');
    }finally{
      btn.disabled=false;
    }
  },true);

  // Oturum değiştiğinde bildirim/zil görünümünü de hemen senkronla.
  try{
    sb.auth.onAuthStateChange(()=>{
      setTimeout(()=>{
        if(typeof loadNotificationBadge==='function')loadNotificationBadge();
      },0);
    });
  }catch(err){console.error('BULUT auth sync',err)}

  window.addEventListener('online',()=>{
    if(typeof loadNotificationBadge==='function')loadNotificationBadge();
  });

  document.addEventListener('click',e=>{
    const close=e.target.closest?.('[data-close="nm"]');
    if(close){const m=document.getElementById('nm');if(m)m.classList.remove('on')}
  });
})();