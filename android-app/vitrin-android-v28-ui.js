(function(){
  const STYLE_ID='vitrinAndroidV28BackStack';
  if(document.getElementById(STYLE_ID)) return;

  const style=document.createElement('style');
  style.id=STYLE_ID;
  style.textContent=`
    #v28StoryBack{
      display:grid!important;place-items:center!important;
      position:absolute!important;left:12px!important;top:14px!important;
      width:46px!important;height:46px!important;min-width:46px!important;min-height:46px!important;
      border:0!important;border-radius:50%!important;background:rgba(255,255,255,.98)!important;
      color:#17243a!important;font-size:38px!important;line-height:1!important;
      box-shadow:0 1px 5px rgba(0,0,0,.08)!important;z-index:100000!important;
      padding:0!important;margin:0!important;pointer-events:auto!important;
    }
    #bulutStoryCreate .storyCreateBox{position:relative!important;padding-top:72px!important}
  `;
  document.head.appendChild(style);

  function visible(el){
    if(!el) return false;
    const s=getComputedStyle(el);
    return s.display!=='none' && s.visibility!=='hidden' && Number(s.opacity||1)!==0;
  }

  function pauseVideosInside(root){
    (root||document).querySelectorAll('video').forEach(v=>{try{v.pause();v.muted=true;}catch(e){}});
  }

  function storyCreateOpen(){
    const el=document.getElementById('bulutStoryCreate');
    return !!(el && (el.classList.contains('on') || visible(el)));
  }

  function closeStoryCreate(){
    const el=document.getElementById('bulutStoryCreate');
    if(!el) return false;
    pauseVideosInside(el);
    const real=document.getElementById('bulutStoryCreateClose');
    if(real){ try{real.click();return true;}catch(e){} }
    ['on','open','active','show','visible'].forEach(c=>el.classList.remove(c));
    if(el.style) el.style.display='none';
    return true;
  }

  function closeEl(el){
    if(!el) return false;
    pauseVideosInside(el);
    const close=el.querySelector('[data-close],.close,.modalClose,.sheetClose,.storyClose,.dialogClose');
    if(close){ try{close.click();return true;}catch(e){} }
    ['on','open','active','show','visible'].forEach(c=>el.classList.remove(c));
    if(el.style) el.style.display='none';
    return true;
  }

  function closeTopOverlay(){
    const selectors=[
      '#bulutStoryViewer.on','.storyViewer.on','.story-modal.on','[data-story-viewer].on',
      '.modal.on','.modal.open','.sheet.on','.sheet.open','.drawer.on','.drawer.open',
      '.overlay.on','.overlay.open','.popup.on','.popup.open','.dialog.on','.dialog.open',
      '[role="dialog"]'
    ];
    for(const sel of selectors){
      const els=Array.from(document.querySelectorAll(sel)).filter(visible).reverse();
      if(els.length) return closeEl(els[0]);
    }
    return false;
  }

  function clickKnownBack(){
    const candidates=[
      '[data-back]:not(#v28StoryBack)', '.backBtn', '.back-button', '.pageBack', '.headerBack',
      '#messageBack','#profileBack','#settingsBack','#searchBack','#reelsBack'
    ];
    for(const sel of candidates){
      const el=Array.from(document.querySelectorAll(sel)).find(visible);
      if(el){ try{el.click();return true;}catch(e){} }
    }
    return false;
  }

  function androidBack(){
    if(storyCreateOpen()) return closeStoryCreate();
    if(closeTopOverlay()) return true;
    if(clickKnownBack()) return true;
    if(history.length>1){ try{history.back();return true;}catch(e){} }
    return false;
  }
  window.__vitrinAndroidBack=androidBack;

  function ensureStoryBack(){
    const box=document.querySelector('#bulutStoryCreate .storyCreateBox');
    if(!box) return;
    let b=document.getElementById('v28StoryBack');
    if(!b){
      b=document.createElement('button');
      b.id='v28StoryBack'; b.type='button'; b.textContent='‹';
      b.setAttribute('aria-label','Geri'); b.title='Geri';
      b.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();androidBack();},true);
      box.prepend(b);
    }
  }

  document.addEventListener('click',e=>{
    const t=e.target;
    if(!t?.closest) return;
    if(t.closest('#bulutOwnStory,#bulutStoryPhoto,#bulutStoryVideo,.story,[data-story-user]')){
      setTimeout(ensureStoryBack,20);setTimeout(ensureStoryBack,150);setTimeout(ensureStoryBack,500);
    }
  },true);

  const obs=new MutationObserver(()=>ensureStoryBack());
  function start(){
    ensureStoryBack();
    if(document.body) obs.observe(document.body,{childList:true,subtree:true});
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();
