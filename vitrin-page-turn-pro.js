(function(){
  if(window.__vitrinStableNavigationV6)return;window.__vitrinStableNavigationV6=true;
  const routes=['home','reels','agenda','rooms','profile'];
  const isReelsDoc=()=>/reels\.html$/i.test(location.pathname);
  if('scrollRestoration' in history)history.scrollRestoration='manual';

  const style=document.createElement('style');
  style.id='vitrinStableNavigationStyleV6';
  style.textContent=`
    :root{--vitrin-header-h:78px;--vitrin-bottom-h:68px}
    html{background:var(--vt-bg,#090909)!important;scroll-behavior:auto!important;overscroll-behavior:none}
    body{background:var(--vt-bg,#090909)!important;padding-top:var(--vitrin-header-h)!important;padding-bottom:calc(var(--vitrin-bottom-h) + env(safe-area-inset-bottom,0px))!important;overflow-x:hidden!important;scroll-behavior:auto!important}
    .top{position:fixed!important;top:0!important;left:0!important;right:0!important;height:auto!important;min-height:78px!important;z-index:10000!important;transform:none!important;translate:none!important;animation:none!important;transition:none!important;will-change:auto!important;backface-visibility:hidden!important;overflow:visible!important}
    .bottom{position:fixed!important;left:0!important;right:0!important;bottom:0!important;min-height:var(--vitrin-bottom-h)!important;z-index:9999!important;transform:none!important;translate:none!important;animation:none!important;transition:none!important;will-change:auto!important;backface-visibility:hidden!important}
    .wrap,main,.page,.page.on{transform:none!important;translate:none!important;animation:none!important;transition:none!important;perspective:none!important;will-change:auto!important}
    body.vtp-dragging .page.on,body.vtp-snap .page.on,body.vtp-out-left .page.on,body.vtp-out-right .page.on,body.vtp-in-left .page.on,body.vtp-in-right .page.on{transform:none!important;animation:none!important;transition:none!important;box-shadow:none!important}
    .vtp-preview,.vtp-shade{display:none!important}
    .page.on,.wrap,main{scroll-margin-top:calc(var(--vitrin-header-h) + 8px)!important}

    body:has(#vlModal.on){padding-top:0!important;padding-bottom:0!important;overflow:hidden!important}
    body:has(#vlModal.on)>.top,body:has(#vlModal.on)>.bottom{visibility:hidden!important;pointer-events:none!important}
    body:has(#vlModal.on) #vlModal{inset:0!important;top:0!important;bottom:0!important;z-index:15000!important;padding:0!important;margin:0!important}
    body:has(#vlModal.on) #vlModal .vlTop{position:sticky!important;top:0!important;z-index:15010!important}
    body:has(#vlModal.on) #vlModal .vlWrap{padding-top:12px!important;padding-bottom:calc(24px + env(safe-area-inset-bottom,0px))!important}
    body:has(#vlModal.on) .vlModerate{z-index:15030!important}
    body:has(#vlModal.on) .vlToast{z-index:15050!important}

    /* Profil / takipçi penceresi mobilde sabit ve tam görünür */
    #fm.modal.on{z-index:12000!important;inset:0!important;pointer-events:auto!important}
    #fm .back{position:fixed!important;inset:0!important;background:rgba(0,0,0,.72)!important;backdrop-filter:blur(8px)!important}
    #fm .box{position:fixed!important;left:12px!important;right:12px!important;top:calc(var(--vitrin-header-h) + 12px)!important;bottom:calc(var(--vitrin-bottom-h) + env(safe-area-inset-bottom,0px) + 12px)!important;transform:none!important;width:auto!important;max-width:696px!important;max-height:none!important;margin:0 auto!important;padding:16px!important;overflow:hidden!important;border-radius:22px!important;display:flex!important;flex-direction:column!important;background:#101010!important;border:1px solid #70561f!important;color:#fff!important;box-shadow:0 18px 60px rgba(0,0,0,.55)!important}
    #fm .mh{flex:0 0 auto!important;padding-bottom:10px!important;border-bottom:1px solid #4f3e19!important;background:#101010!important;position:relative!important;z-index:2!important}
    #fm .mh h2{font-size:clamp(20px,5vw,30px)!important;line-height:1.15!important;margin:0!important;min-width:0!important;overflow:hidden!important;text-overflow:ellipsis!important;white-space:nowrap!important}
    #fm .mh .ib{flex:0 0 46px!important;width:46px!important;height:46px!important;background:#181818!important;border:1px solid #70561f!important;color:#fff!important}
    #fmList{flex:1 1 auto!important;min-height:0!important;overflow-y:auto!important;overscroll-behavior:contain!important;padding:4px 0 8px!important}
    #fm .peopleRow{grid-template-columns:48px minmax(0,1fr) auto!important;gap:10px!important;padding:12px 2px!important;border-bottom:1px solid #332913!important;color:#fff!important}
    #fm .peopleRow .muted{color:#bbaa78!important;overflow:hidden!important;text-overflow:ellipsis!important;white-space:nowrap!important}
    #fm .peopleRow .outline{background:#171717!important;border:1px solid #70561f!important;color:#f0d26d!important}

    /* Mesaj ekranı: üst/alt çubukların arasında düzenli, otomatik klavye yok */
    #messages.page.on{min-height:calc(100dvh - var(--vitrin-header-h) - var(--vitrin-bottom-h) - env(safe-area-inset-bottom,0px))!important;padding-bottom:8px!important}
    #messages .msgCard,#messages #chatPanel{margin-top:0!important}
    #messages #chatPanel{border-radius:20px!important;overflow:hidden!important;min-height:calc(100dvh - var(--vitrin-header-h) - var(--vitrin-bottom-h) - 24px)!important;display:flex!important;flex-direction:column!important;background:#0b0b0b!important;border:1px solid #70561f!important}
    #messages #chatPanel[hidden]{display:none!important}
    #messages .chatHead{flex:0 0 auto!important;position:sticky!important;top:0!important;z-index:5!important;background:#101010!important;border-bottom:1px solid #70561f!important;color:#fff!important}
    #messages .chatHead .muted{color:#bbaa78!important}
    #messages .chatMessages{flex:1 1 auto!important;height:auto!important;min-height:260px!important;max-height:none!important;background:linear-gradient(#101010,#080808)!important;padding:12px!important}
    #messages .bubble{background:#181818!important;border:1px solid #4f3e19!important;color:#fff!important;box-shadow:none!important}
    #messages .bubble.mine{background:linear-gradient(135deg,#8c6b20,#d4af37)!important;color:#111!important;border-color:#d4af37!important}
    #messages .chatComposer{flex:0 0 auto!important;position:sticky!important;bottom:0!important;z-index:5!important;background:#101010!important;border-top:1px solid #70561f!important;padding:10px!important}
    #messages .chatComposer textarea{background:#171717!important;border:1px solid #70561f!important;color:#fff!important;min-height:46px!important;max-height:110px!important}
    #messages .chatComposer textarea::placeholder{color:#8d8778!important}
    #messages .chatComposer button{background:#d4af37!important;color:#111!important}
    body:has(#chatInput:focus)>.bottom{display:none!important}
    body:has(#chatInput:focus){padding-bottom:env(safe-area-inset-bottom,0px)!important}
    body:has(#chatInput:focus) #messages #chatPanel{min-height:calc(100dvh - var(--vitrin-header-h) - 8px)!important}

    @media(max-width:600px){
      .top{min-height:78px!important}
      #fm .box{left:8px!important;right:8px!important;top:calc(var(--vitrin-header-h) + 8px)!important;bottom:calc(var(--vitrin-bottom-h) + env(safe-area-inset-bottom,0px) + 8px)!important;padding:13px!important;border-radius:18px!important}
      #fm .mh h2{font-size:22px!important}
      #messages #chatPanel{border-radius:16px!important}
    }
  `;
  document.head.appendChild(style);

  function syncHeaderHeight(){
    const top=document.querySelector('.top');if(!top)return;
    const tr=top.getBoundingClientRect();
    let bottom=tr.bottom;
    top.querySelectorAll('*').forEach(el=>{const r=el.getBoundingClientRect();if(r.width||r.height)bottom=Math.max(bottom,r.bottom)});
    const visual=Math.max(top.scrollHeight||0,Math.ceil(bottom-tr.top));
    const h=Math.max(78,Math.min(Math.ceil(visual+1),320));
    document.documentElement.style.setProperty('--vitrin-header-h',h+'px');
  }
  function scheduleHeaderSync(){syncHeaderHeight();requestAnimationFrame(syncHeaderHeight);setTimeout(syncHeaderHeight,60);setTimeout(syncHeaderHeight,220)}

  function currentIndex(){
    if(isReelsDoc())return 1;
    const on=document.querySelector('.page.on');
    const id=on?.id||location.hash.slice(1)||'home';
    const i=routes.indexOf(id);return i<0?0:i;
  }
  function markBottom(i){document.querySelectorAll('.bottom button').forEach((b,n)=>b.classList.toggle('on',n===i))}
  function key(i){return 'vitrin_scroll_'+routes[i]}
  function saveScroll(i=currentIndex()){try{sessionStorage.setItem(key(i),String(Math.max(0,window.scrollY||0)))}catch{}}
  function getSavedScroll(i){try{return Math.max(0,Number(sessionStorage.getItem(key(i))||0))}catch{return 0}}
  function restoreScroll(i){
    const y=getSavedScroll(i);
    const apply=()=>window.scrollTo(0,Math.min(y,Math.max(0,document.documentElement.scrollHeight-innerHeight)));
    apply();requestAnimationFrame(apply);setTimeout(apply,50);setTimeout(apply,170);
  }
  function cleanupLegacy(){
    document.querySelectorAll('.vtp-preview,.vtp-shade').forEach(x=>x.remove());
    document.body.classList.remove('vt-dragging','vt-snapback','vt-turn-left','vt-turn-right','vt-leave-left','vt-leave-right','vtp-dragging','vtp-snap','vtp-out-left','vtp-out-right','vtp-in-left','vtp-in-right');
    ['--vt-drag-x','--vt-drag-rot','--vt-origin','--vt-shadow-x','--vtp-x','--vtp-shadow'].forEach(p=>document.body.style.removeProperty(p));
  }
  cleanupLegacy();

  function go(targetIndex){
    const from=currentIndex();
    if(targetIndex<0||targetIndex>=routes.length||targetIndex===from)return;
    saveScroll(from);cleanupLegacy();
    if(targetIndex===1&&!isReelsDoc()){
      try{sessionStorage.setItem('vitrin_target_scroll',String(getSavedScroll(1)))}catch{}
      location.href='reels.html';return;
    }
    if(isReelsDoc()&&targetIndex!==1){
      try{sessionStorage.setItem('vitrin_target_scroll',String(getSavedScroll(targetIndex)))}catch{}
      location.href='index.html#'+routes[targetIndex];return;
    }
    if(typeof window.route==='function')window.route(routes[targetIndex]);else location.hash=routes[targetIndex];
    markBottom(targetIndex);scheduleHeaderSync();restoreScroll(targetIndex);
  }

  document.addEventListener('click',e=>{
    const b=e.target.closest('.bottom button');if(!b)return;
    const buttons=[...document.querySelectorAll('.bottom button')],i=buttons.indexOf(b);
    if(i<0||i>4)return;
    e.preventDefault();e.stopImmediatePropagation();go(i);
  },true);

  /* openChat() içindeki eski otomatik focus çağrısını güvenli şekilde bastırır.
     Kullanıcı kutuya kendisi dokunduğunda normal focus çalışır. */
  let suppressChatFocusUntil=0;
  function suppressInitialChatKeyboard(){
    suppressChatFocusUntil=Date.now()+650;
    const input=document.getElementById('chatInput');
    const blur=()=>{if(Date.now()<=suppressChatFocusUntil&&document.activeElement===input)input.blur()};
    blur();requestAnimationFrame(blur);setTimeout(blur,120);setTimeout(blur,260);setTimeout(blur,520);
  }
  document.addEventListener('focusin',e=>{
    if(e.target?.id==='chatInput'&&Date.now()<=suppressChatFocusUntil){e.target.blur()}
  },true);
  const chatPanel=document.getElementById('chatPanel');
  if(chatPanel){
    new MutationObserver(()=>{if(!chatPanel.hidden)suppressInitialChatKeyboard()}).observe(chatPanel,{attributes:true,attributeFilter:['hidden']});
  }
  document.addEventListener('click',e=>{
    const trigger=e.target.closest('[data-chat],[data-quick-chat],[data-request-chat],#chatBtn,.chatRow button');
    if(trigger)setTimeout(suppressInitialChatKeyboard,0);
  },true);

  window.addEventListener('resize',scheduleHeaderSync,{passive:true});
  window.addEventListener('orientationchange',scheduleHeaderSync,{passive:true});
  window.addEventListener('pagehide',()=>saveScroll());
  window.addEventListener('beforeunload',()=>saveScroll());
  window.addEventListener('hashchange',()=>{cleanupLegacy();markBottom(currentIndex());scheduleHeaderSync();restoreScroll(currentIndex())});

  const top=document.querySelector('.top');
  if(top&&'ResizeObserver' in window)new ResizeObserver(scheduleHeaderSync).observe(top);
  if(top)new MutationObserver(scheduleHeaderSync).observe(top,{childList:true,subtree:true,attributes:true});

  const pending=sessionStorage.getItem('vitrin_target_scroll');
  if(pending!==null){
    sessionStorage.removeItem('vitrin_target_scroll');
    try{sessionStorage.setItem(key(currentIndex()),String(Math.max(0,Number(pending)||0)))}catch{}
  }
  markBottom(currentIndex());
  scheduleHeaderSync();
  restoreScroll(currentIndex());
})();
