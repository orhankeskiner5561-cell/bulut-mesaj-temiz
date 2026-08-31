(function(){
  const isReels=/reels\.html$/i.test(location.pathname);
  document.documentElement.classList.toggle('vitrin-reels-doc',isReels);
  function prepare(v){
    if(!v||v.dataset.vaStable==='1')return;
    v.dataset.vaStable='1';v.removeAttribute('poster');v.playsInline=true;v.preload='auto';v.style.visibility='visible';v.style.opacity='1';
  }
  function prep(root=document){root.querySelectorAll?.('video').forEach(prepare)}
  function init(){prep();const mo=new MutationObserver(ms=>{for(const m of ms)for(const n of m.addedNodes){if(n.nodeType===1){if(n.matches?.('video'))prepare(n);prep(n)}}});mo.observe(document.body,{subtree:true,childList:true});setTimeout(()=>mo.disconnect(),30000);}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();