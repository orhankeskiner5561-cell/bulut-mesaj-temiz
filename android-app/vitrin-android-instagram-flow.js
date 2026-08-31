(function(){
  const path=location.pathname.toLowerCase();
  const isReels=/reels\.html$/i.test(path);
  document.documentElement.classList.toggle('vitrin-reels-doc',isReels);

  try{history.scrollRestoration='manual';}catch(_e){}

  function prepare(v){
    if(!v||v.dataset.vaStable==='1')return;
    v.dataset.vaStable='1';
    v.removeAttribute('poster');
    v.removeAttribute('controls');
    v.controls=false;
    v.playsInline=true;
    v.preload='auto';
  }

  function prep(root=document){root.querySelectorAll?.('video').forEach(prepare);}

  function calmRouteChange(){
    document.documentElement.classList.add('vitrin-route-lock');
    requestAnimationFrame(()=>document.documentElement.classList.add('vitrin-route-lock-ready'));
  }

  function bindCalmNavigation(){
    document.addEventListener('click',e=>{
      const a=e.target?.closest?.('a[href]');
      if(!a)return;
      let u;
      try{u=new URL(a.href,location.href);}catch(_e){return;}
      if(u.origin!==location.origin)return;
      const p=u.pathname.toLowerCase();
      if(/(?:\/|\/index\.html|\/reels\.html)$/.test(p)) calmRouteChange();
    },true);
  }

  function init(){
    prep();
    bindCalmNavigation();
    const mo=new MutationObserver(ms=>{
      for(const m of ms)for(const n of m.addedNodes){
        if(n.nodeType===1){if(n.matches?.('video'))prepare(n);prep(n);}
      }
    });
    mo.observe(document.body,{subtree:true,childList:true});
    window.addEventListener('pageshow',()=>{
      document.documentElement.classList.remove('vitrin-route-lock','vitrin-route-lock-ready');
    });
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
