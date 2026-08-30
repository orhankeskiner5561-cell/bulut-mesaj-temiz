(function(){
  if(window.__vitrinStableNavigationV4)return;window.__vitrinStableNavigationV4=true;
  const routes=['home','reels','agenda','rooms','profile'];
  const isReelsDoc=()=>/reels\.html$/i.test(location.pathname);
  if('scrollRestoration' in history)history.scrollRestoration='manual';

  const style=document.createElement('style');
  style.id='vitrinStableNavigationStyleV4';
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
    @media(max-width:600px){.top{min-height:78px!important}}
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
