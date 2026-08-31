(function(){
  const STYLE_ID='vitrinAndroidInstagramFlowV3';
  const isReels=/reels\.html$/i.test(location.pathname);
  document.documentElement.classList.toggle('vitrin-reels-doc',isReels);

  function install(){
    if(document.getElementById(STYLE_ID))return;
    const s=document.createElement('style');
    s.id=STYLE_ID;
    s.textContent=`
      :root{--va-top:156px;--va-bottom:92px}
      html,body{width:100%!important;max-width:100%!important;overflow-x:hidden!important;background:#090909!important;scroll-behavior:auto!important}
      html{overflow-y:auto!important;overscroll-behavior-y:auto!important}
      body{overflow-y:visible!important;min-height:100dvh!important;padding-top:0!important;padding-bottom:var(--va-bottom)!important}
      .top{height:var(--va-top)!important;min-height:var(--va-top)!important;max-height:var(--va-top)!important;box-sizing:border-box!important;overflow:hidden!important;position:sticky!important;top:0!important;z-index:10000!important;margin:0!important;transform:none!important;animation:none!important;transition:none!important}
      .bottom{height:var(--va-bottom)!important;min-height:var(--va-bottom)!important;max-height:var(--va-bottom)!important;box-sizing:border-box!important;position:fixed!important;left:0!important;right:0!important;bottom:0!important;z-index:10000!important;transform:none!important;animation:none!important;transition:none!important}
      main,.wrap,.page,.page.on{transform:none!important;animation:none!important;transition:none!important}
      .top,.top *,.bottom,.bottom *{transition:none!important;animation:none!important}
      video{background:#090909!important}
      video::-webkit-media-controls-start-playback-button{display:none!important;-webkit-appearance:none!important}
      video::-webkit-media-controls-overlay-play-button{display:none!important;-webkit-appearance:none!important}
      .vitrin-media-wait{visibility:hidden!important}
      .vitrin-media-ready{visibility:visible!important}
      @supports(padding:max(0px)){
        :root{--va-top:calc(124px + max(32px,env(safe-area-inset-top)));--va-bottom:calc(74px + max(18px,env(safe-area-inset-bottom)))}
        .top{padding-top:max(32px,env(safe-area-inset-top))!important}
        .bottom{padding-bottom:max(18px,env(safe-area-inset-bottom))!important}
      }
      html.vitrin-reels-doc body{padding-bottom:var(--va-bottom)!important}
      html.vitrin-reels-doc main.page{width:100%!important;max-width:none!important;margin:0!important;padding:10px 0 0!important}
      html.vitrin-reels-doc .headrow{padding:0 14px!important;margin-bottom:10px!important}
      html.vitrin-reels-doc .reelWrap{width:100%!important;max-width:none!important;margin:0 0 10px!important;border-left:0!important;border-right:0!important;border-radius:0!important;box-shadow:none!important;padding-bottom:0!important}
      html.vitrin-reels-doc .reel{width:100%!important;height:calc(100dvh - var(--va-top) - var(--va-bottom) - 58px)!important;min-height:520px!important;max-height:none!important;border-radius:0!important}
      html.vitrin-reels-doc .reel video,html.vitrin-reels-doc .reel img{width:100%!important;height:100%!important;object-fit:cover!important;border-radius:0!important}
      html.vitrin-reels-doc .reelStats,html.vitrin-reels-doc .reelActions{margin-left:12px!important;margin-right:12px!important}
    `;
    document.head.appendChild(s);
  }

  function prepVideo(v){
    if(!v||v.dataset.vaStable==='1')return;
    v.dataset.vaStable='1';
    v.controls=false;
    v.removeAttribute('poster');
    v.preload='metadata';
    v.playsInline=true;
    v.classList.add('vitrin-media-wait');
    const ready=()=>{v.classList.remove('vitrin-media-wait');v.classList.add('vitrin-media-ready')};
    if(v.readyState>=2)ready();
    else{v.addEventListener('loadeddata',ready,{once:true});v.addEventListener('canplay',ready,{once:true});}
  }
  function prep(root=document){root.querySelectorAll?.('video').forEach(prepVideo)}

  function init(){
    install();
    prep();
    const mo=new MutationObserver(ms=>{for(const m of ms)for(const n of m.addedNodes){if(n.nodeType===1){if(n.matches?.('video'))prepVideo(n);prep(n)}}});
    mo.observe(document.body,{subtree:true,childList:true});
    setTimeout(()=>mo.disconnect(),30000);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();