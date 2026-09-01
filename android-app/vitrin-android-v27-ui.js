(function(){
  const STYLE_ID='vitrinAndroidV27StoryBackAudio';
  if(document.getElementById(STYLE_ID)) return;

  const style=document.createElement('style');
  style.id=STYLE_ID;
  style.textContent=`
    /* V27: make the real story close control a visible back button. */
    #bulutStoryCreateClose{
      display:grid!important;
      place-items:center!important;
      position:absolute!important;
      left:12px!important;
      top:14px!important;
      right:auto!important;
      width:46px!important;
      height:46px!important;
      min-width:46px!important;
      min-height:46px!important;
      padding:0!important;
      margin:0!important;
      border:0!important;
      border-radius:50%!important;
      background:rgba(255,255,255,.96)!important;
      color:#17243a!important;
      font-size:38px!important;
      font-weight:500!important;
      line-height:1!important;
      box-shadow:0 1px 5px rgba(0,0,0,.08)!important;
      opacity:1!important;
      visibility:visible!important;
      pointer-events:auto!important;
      z-index:99999!important;
    }
    #v26StoryBack{display:none!important}
    #bulutStoryCreate .storyCreateBox{padding-top:72px!important}
  `;
  document.head.appendChild(style);

  function prepareBack(){
    const close=document.getElementById('bulutStoryCreateClose');
    if(!close) return;
    if(close.dataset.v27BackReady==='1') return;
    close.dataset.v27BackReady='1';
    close.setAttribute('aria-label','Geri');
    close.title='Geri';
    close.textContent='‹';
  }

  function allVideos(){
    return Array.from(document.querySelectorAll('video'));
  }

  function silenceOthers(active){
    for(const v of allVideos()){
      if(v===active) continue;
      try{
        v.pause();
        v.muted=true;
      }catch(e){}
    }
    if(active){
      try{ active.muted=false; }catch(e){}
    }
  }

  function pauseStoryVideos(){
    const selectors=[
      '#bulutStoryCreate video',
      '#bulutStoryViewer video',
      '.storyViewer video',
      '.story-modal video',
      '[data-story-viewer] video'
    ];
    for(const sel of selectors){
      document.querySelectorAll(sel).forEach(v=>{
        try{v.pause();v.muted=true;}catch(e){}
      });
    }
  }

  function pauseFeedVideos(){
    const selectors=[
      '#home video',
      '#feed video',
      '.feed video',
      '.post video',
      '.reel video'
    ];
    for(const sel of selectors){
      document.querySelectorAll(sel).forEach(v=>{
        try{v.pause();v.muted=true;}catch(e){}
      });
    }
  }

  function bindVideo(v){
    if(!v || v.dataset.v27AudioBound==='1') return;
    v.dataset.v27AudioBound='1';
    v.addEventListener('play',()=>silenceOthers(v),true);
    v.addEventListener('playing',()=>silenceOthers(v),true);
    v.addEventListener('volumechange',()=>{
      if(!v.paused && !v.muted) silenceOthers(v);
    },true);
  }

  function bindAll(){
    prepareBack();
    allVideos().forEach(bindVideo);
  }

  document.addEventListener('click',e=>{
    const t=e.target;
    if(!t?.closest) return;

    if(t.closest('#bulutOwnStory,.story,[data-story-user],#bulutStoryPhoto,#bulutStoryVideo')){
      pauseFeedVideos();
      setTimeout(bindAll,30);
      setTimeout(bindAll,250);
    }

    if(t.closest('#bulutStoryCreateClose,#v26StoryBack,.storyClose,[data-story-close]')){
      pauseStoryVideos();
    }

    if(t.closest('[data-nav],.bottomNav,.navItem,#homeBtn,#reelsBtn,#profileBtn')){
      const storyOpen=document.querySelector('#bulutStoryCreate.on,#bulutStoryViewer.on,.storyViewer.on,.story-modal.on');
      if(!storyOpen) pauseStoryVideos();
    }
  },true);

  document.addEventListener('visibilitychange',()=>{
    if(document.hidden){
      allVideos().forEach(v=>{try{v.pause();v.muted=true;}catch(e){}});
    }
  });

  const obs=new MutationObserver(()=>bindAll());
  function start(){
    bindAll();
    if(document.body) obs.observe(document.body,{childList:true,subtree:true});
    setTimeout(bindAll,300);
    setTimeout(bindAll,1200);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();
