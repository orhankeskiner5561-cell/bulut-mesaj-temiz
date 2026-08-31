(function(){
  const ID='vitrinAndroidV9CleanOverlay';
  if(document.getElementById(ID)) return;
  const style=document.createElement('style');
  style.id=ID;
  style.textContent=`
    .reelFeedCard .head,
    .reelFeedCard .reelBadge,
    .reelFeedCard>p,
    .reelFeedCard .stats,
    .reelFeedCard .pa,
    .reelFeedCard .reelOpen,
    .reelFeedCard .comments,
    .reelFeedCard .commentComposer{display:none!important}
    .reelFeedCard{padding:0!important;margin:0!important;border:0!important;background:#000!important;box-shadow:none!important;border-radius:0!important;overflow:hidden!important}
    .v8ReelStage{margin:0!important;position:relative!important;width:100vw!important;height:calc(100dvh - 132px)!important;min-height:560px!important;background:#000!important;overflow:hidden!important}
    .v8ReelStage>.reelMedia,.v8ReelStage>video,.v8ReelStage>img{width:100%!important;height:100%!important;object-fit:cover!important;border-radius:0!important;max-height:none!important}
    .v8ReelOverlay{top:18px!important;left:18px!important;right:86px!important;background:transparent!important;padding:0!important;border:0!important;box-shadow:none!important}
    .v8ReelOverlay .v8Name{font-size:18px!important;font-weight:800!important;color:#fff!important}
    .v8ReelOverlay .v8Brand{font-size:14px!important;font-weight:900!important;color:#e2ad35!important}
    .v7BottomShell button[data-v7="trend"] svg{display:none!important}
    .v7BottomShell button[data-v7="trend"]::before{content:'🔥';font-size:30px!important;line-height:1!important;filter:none!important}
    .v7BottomShell button[data-v7="trend"]{background:transparent!important;border:0!important;box-shadow:none!important}
  `;
  document.head.appendChild(style);

  function clean(card){
    if(!card) return;
    const stage=card.querySelector('.v8ReelStage');
    if(!stage) return;
    Array.from(card.children).forEach(ch=>{ if(ch!==stage) ch.style.setProperty('display','none','important'); });
  }
  function scan(){document.querySelectorAll('.reelFeedCard').forEach(clean)}
  scan();
  new MutationObserver(()=>requestAnimationFrame(scan)).observe(document.body,{childList:true,subtree:true});
})();
