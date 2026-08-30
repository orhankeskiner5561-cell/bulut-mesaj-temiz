(function(){
  if(window.__vitrinStableNavigationV8)return;window.__vitrinStableNavigationV8=true;
  const routes=['home','reels','agenda','rooms','profile'];
  const isReelsDoc=()=>/reels\.html$/i.test(location.pathname);
  if('scrollRestoration' in history)history.scrollRestoration='manual';

  const style=document.createElement('style');
  style.id='vitrinStableNavigationStyleV8';
  style.textContent=`
    :root{--vitrin-header-h:78px;--vitrin-bottom-h:68px}
    html{background:var(--vt-bg,#090909)!important;scroll-behavior:auto!important;overscroll-behavior:none}
    body{background:var(--vt-bg,#090909)!important;padding-top:var(--vitrin-header-h)!important;padding-bottom:calc(var(--vitrin-bottom-h) + env(safe-area-inset-bottom,0px))!important;overflow-x:hidden!important;scroll-behavior:auto!important}
    .top{position:fixed!important;top:0!important;left:0!important;right:0!important;height:auto!important;min-height:78px!important;z-index:10000!important;transform:none!important;animation:none!important;transition:none!important;overflow:visible!important}
    .bottom{position:fixed!important;left:0!important;right:0!important;bottom:0!important;min-height:var(--vitrin-bottom-h)!important;z-index:9999!important;transform:none!important;animation:none!important;transition:none!important}
    .wrap,main,.page,.page.on{transform:none!important;animation:none!important;transition:none!important;perspective:none!important}
    .vtp-preview,.vtp-shade{display:none!important}
    .page.on,.wrap,main{scroll-margin-top:calc(var(--vitrin-header-h) + 8px)!important}

    body:has(#vlModal.on){padding-top:0!important;padding-bottom:0!important;overflow:hidden!important}
    body:has(#vlModal.on)>.top,body:has(#vlModal.on)>.bottom{visibility:hidden!important;pointer-events:none!important}
    body:has(#vlModal.on) #vlModal{inset:0!important;z-index:15000!important}
    body:has(#vlModal.on) #vlModal .vlTop{position:sticky!important;top:0!important;z-index:15010!important}

    #fm.modal.on,#nm.modal.on{z-index:12000!important;inset:0!important;pointer-events:auto!important}
    #fm .back,#nm .back{position:fixed!important;inset:0!important;background:rgba(0,0,0,.72)!important;backdrop-filter:blur(8px)!important}
    #fm .box,#nm .box{position:fixed!important;left:12px!important;right:12px!important;top:calc(var(--vitrin-header-h) + 12px)!important;bottom:calc(var(--vitrin-bottom-h) + env(safe-area-inset-bottom,0px) + 12px)!important;transform:none!important;width:auto!important;max-width:696px!important;max-height:none!important;margin:0 auto!important;padding:16px!important;overflow:hidden!important;border-radius:22px!important;display:flex!important;flex-direction:column!important;background:#101010!important;border:1px solid #70561f!important;color:#fff!important;box-shadow:0 18px 60px rgba(0,0,0,.55)!important}
    #fm .mh,#nm .mh{flex:0 0 auto!important;padding-bottom:10px!important;border-bottom:1px solid #4f3e19!important;background:#101010!important;position:relative!important;z-index:2!important}
    #fm .mh h2,#nm .mh h2{color:#fff!important;margin:0!important}
    #fmList,#notifList{flex:1 1 auto!important;min-height:0!important;overflow-y:auto!important;overscroll-behavior:contain!important;padding:8px 0!important;color:#fff!important}
    #nm .notice{background:#17130a!important;border:1px solid #9a7728!important;color:#fff!important}
    #nm .chatListTitle{color:#d4af37!important}
    #nm .notifRow{background:#141414!important;border:1px solid #4d3b17!important;border-radius:14px!important;margin:8px 0!important;padding:10px!important;color:#fff!important}
    #nm .notifRow .notifPerson{color:#fff!important;width:100%!important}
    #nm .notifRow .tiny,#nm .notifRow .muted{color:#c8b982!important}
    #nm .outline{background:#1b1b1b!important;border:1px solid #8a6a21!important;color:#f0d26d!important;min-height:42px!important}
    #nm .empty{color:#bbaa78!important}

    #messages.page.on{min-height:calc(100dvh - var(--vitrin-header-h) - var(--vitrin-bottom-h) - env(safe-area-inset-bottom,0px))!important;padding-bottom:8px!important}
    #messages #chatPanel{border-radius:20px!important;overflow:hidden!important;min-height:calc(100dvh - var(--vitrin-header-h) - var(--vitrin-bottom-h) - 24px)!important;display:flex!important;flex-direction:column!important;background:#0b0b0b!important;border:1px solid #70561f!important}
    #messages #chatPanel[hidden]{display:none!important}
    #messages .chatHead{flex:0 0 auto!important;background:#101010!important;border-bottom:1px solid #70561f!important;color:#fff!important}
    #messages .chatMessages{flex:1 1 auto!important;height:auto!important;min-height:260px!important;max-height:none!important;background:linear-gradient(#101010,#080808)!important;padding:12px!important}
    #messages .bubble{background:#181818!important;border:1px solid #4f3e19!important;color:#fff!important;box-shadow:none!important}
    #messages .bubble.mine{background:linear-gradient(135deg,#8c6b20,#d4af37)!important;color:#111!important;border-color:#d4af37!important}
    #messages .chatComposer{flex:0 0 auto!important;background:#101010!important;border-top:1px solid #70561f!important;padding:10px!important}
    #messages .chatComposer textarea{background:#171717!important;border:1px solid #70561f!important;color:#fff!important;min-height:46px!important;max-height:110px!important}
    #messages .chatComposer button{background:#d4af37!important;color:#111!important}
    body:has(#chatInput:focus)>.bottom{display:none!important}
    body:has(#chatInput:focus){padding-bottom:env(safe-area-inset-bottom,0px)!important}

    @media(max-width:600px){
      #fm .box,#nm .box{left:8px!important;right:8px!important;top:calc(var(--vitrin-header-h) + 8px)!important;bottom:calc(var(--vitrin-bottom-h) + env(safe-area-inset-bottom,0px) + 8px)!important;padding:13px!important;border-radius:18px!important}
      #nm .notifRow{grid-template-columns:minmax(0,1fr) auto!important}
    }
  `;
  document.head.appendChild(style);

  function syncHeaderHeight(){const top=document.querySelector('.top');if(!top)return;const tr=top.getBoundingClientRect();let bottom=tr.bottom;top.querySelectorAll('*').forEach(el=>{const r=el.getBoundingClientRect();if(r.width||r.height)bottom=Math.max(bottom,r.bottom)});document.documentElement.style.setProperty('--vitrin-header-h',Math.max(78,Math.min(Math.ceil(Math.max(top.scrollHeight||0,bottom-tr.top)+1),320))+'px')}
  function scheduleHeaderSync(){syncHeaderHeight();requestAnimationFrame(syncHeaderHeight);setTimeout(syncHeaderHeight,80)}
  function currentIndex(){if(isReelsDoc())return 1;const on=document.querySelector('.page.on');const id=on?.id||location.hash.slice(1)||'home';const i=routes.indexOf(id);return i<0?0:i}
  function markBottom(i){document.querySelectorAll('.bottom button').forEach((b,n)=>b.classList.toggle('on',n===i))}
  function key(i){return 'vitrin_scroll_'+routes[i]}
  function saveScroll(i=currentIndex()){try{sessionStorage.setItem(key(i),String(Math.max(0,window.scrollY||0)))}catch{}}
  function getSavedScroll(i){try{return Math.max(0,Number(sessionStorage.getItem(key(i))||0))}catch{return 0}}
  function restoreScroll(i){const y=getSavedScroll(i);const apply=()=>window.scrollTo(0,Math.min(y,Math.max(0,document.documentElement.scrollHeight-innerHeight)));apply();requestAnimationFrame(apply);setTimeout(apply,100)}
  function go(targetIndex){const from=currentIndex();if(targetIndex<0||targetIndex>=routes.length||targetIndex===from)return;saveScroll(from);if(targetIndex===1&&!isReelsDoc()){location.href='reels.html';return}if(isReelsDoc()&&targetIndex!==1){location.href='index.html#'+routes[targetIndex];return}if(typeof window.route==='function')window.route(routes[targetIndex]);else location.hash=routes[targetIndex];markBottom(targetIndex);scheduleHeaderSync();restoreScroll(targetIndex)}
  document.addEventListener('click',e=>{const b=e.target.closest('.bottom button');if(!b)return;const buttons=[...document.querySelectorAll('.bottom button')],i=buttons.indexOf(b);if(i<0||i>4)return;e.preventDefault();e.stopImmediatePropagation();go(i)},true);

  /* Chat input: JS ile yapilan focus() tamamen engellenir. Klavye yalnizca kullanici kutuya dokununca acilir. */
  const nativeFocus=HTMLElement.prototype.focus;
  HTMLElement.prototype.focus=function(options){
    if(this&&this.id==='chatInput')return;
    return nativeFocus.call(this,options);
  };
  document.addEventListener('pointerdown',e=>{
    if(e.target?.id!=='chatInput')return;
    try{Object.getOwnPropertyDescriptor(HTMLElement.prototype,'focus');}catch{}
  },true);

  async function markSenderMessagesRead(otherId){
    try{
      if(typeof sb==='undefined'||typeof session==='undefined'||!session?.user?.id)return;
      const uid=session.user.id;
      const q=await sb.from('chat_requests').select('id').eq('status','accepted').or(`and(sender_id.eq.${uid},receiver_id.eq.${otherId}),and(sender_id.eq.${otherId},receiver_id.eq.${uid})`);
      const ids=(q.data||[]).map(x=>x.id);
      if(ids.length)await sb.from('messages').update({read_at:new Date().toISOString(),delivered_at:new Date().toISOString()}).in('chat_request_id',ids).eq('sender_id',otherId).is('read_at',null);
      if(typeof loadNotificationBadge==='function')await loadNotificationBadge();
    }catch(err){console.warn('Vitrin read-state fix',err)}
  }

  async function openChatFromNotification(otherId){
    try{
      await markSenderMessagesRead(otherId);
      const nm=document.getElementById('nm');if(nm)nm.classList.remove('on');
      if(typeof route==='function')route('messages');
      const uid=session?.user?.id;if(!uid)return;
      const q=await sb.from('chat_requests').select('*').eq('status','accepted').or(`and(sender_id.eq.${uid},receiver_id.eq.${otherId}),and(sender_id.eq.${otherId},receiver_id.eq.${uid})`).order('created_at',{ascending:true}).limit(1).maybeSingle();
      if(q.data&&typeof openChat==='function')setTimeout(()=>openChat(q.data.id),80);
    }catch(err){console.warn('Vitrin notification chat fix',err)}
  }

  document.addEventListener('click',e=>{
    const chat=e.target.closest('#nm [data-go-chat]');
    if(chat){e.preventDefault();e.stopImmediatePropagation();openChatFromNotification(chat.dataset.goChat);return}
    const msgPerson=e.target.closest('#nm [data-message-profile]');
    if(msgPerson){e.preventDefault();e.stopImmediatePropagation();openChatFromNotification(msgPerson.dataset.messageProfile);return}
    const notifPerson=e.target.closest('#nm [data-notif-profile]');
    if(notifPerson){e.preventDefault();e.stopImmediatePropagation();const id=notifPerson.dataset.notifProfile;const nm=document.getElementById('nm');if(nm)nm.classList.remove('on');try{viewedProfileId=id;if(typeof route==='function')route('profile')}catch{}}
  },true);

  const nm=document.getElementById('nm');
  if(nm)new MutationObserver(()=>{if(nm.classList.contains('on')){setTimeout(()=>{nm.querySelectorAll('[data-go-chat],[data-message-profile],[data-notif-profile]').forEach(el=>{el.style.pointerEvents='auto';el.removeAttribute('disabled')})},120)}}).observe(nm,{attributes:true,attributeFilter:['class']});

  window.addEventListener('resize',scheduleHeaderSync,{passive:true});window.addEventListener('orientationchange',scheduleHeaderSync,{passive:true});window.addEventListener('pagehide',()=>saveScroll());
  const top=document.querySelector('.top');if(top&&'ResizeObserver' in window)new ResizeObserver(scheduleHeaderSync).observe(top);
  markBottom(currentIndex());scheduleHeaderSync();restoreScroll(currentIndex());
})();
