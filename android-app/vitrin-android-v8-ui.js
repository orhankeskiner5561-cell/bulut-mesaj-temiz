(function(){
  const ID='vitrinAndroidV8FullscreenReels';
  if(document.getElementById(ID)) return;
  const style=document.createElement('style');
  style.id=ID;
  style.textContent=`
    html body{background:#000!important}
    .reelFeedCard{
      position:relative!important;margin:0!important;padding:0!important;border:0!important;border-radius:0!important;
      background:#000!important;box-shadow:none!important;overflow:hidden!important;width:100vw!important;max-width:none!important;
      min-height:calc(100dvh - 136px)!important
    }
    .reelFeedCard>.head,.reelFeedCard>.reelBadge,.reelFeedCard>p,.reelFeedCard>.stats,.reelFeedCard>.pa,.reelFeedCard>.reelOpen,
    .reelFeedCard>.comments,.reelFeedCard>.commentComposer{display:none!important}
    .v8ReelStage{position:relative!important;width:100vw!important;height:calc(100dvh - 136px)!important;min-height:560px!important;background:#000!important;overflow:hidden!important}
    .v8ReelStage>.reelMedia,.v8ReelStage>video,.v8ReelStage>img{
      position:absolute!important;inset:0!important;width:100%!important;height:100%!important;max-height:none!important;
      object-fit:cover!important;border-radius:0!important;background:#000!important;display:block!important
    }
    .v8ReelOverlay{position:absolute!important;left:18px!important;right:74px!important;top:18px!important;z-index:12!important;display:flex!important;align-items:center!important;gap:10px!important;pointer-events:none!important;text-shadow:0 2px 10px rgba(0,0,0,.8)!important}
    .v8ReelOverlay .v8Avatar{width:42px!important;height:42px!important;border-radius:50%!important;overflow:hidden!important;border:2px solid rgba(255,255,255,.94)!important;background:#222!important;flex:0 0 42px!important}
    .v8ReelOverlay .v8Avatar img{width:100%!important;height:100%!important;object-fit:cover!important;display:block!important}
    .v8ReelOverlay .v8Meta{min-width:0!important;display:flex!important;flex-direction:column!important;gap:1px!important}
    .v8ReelOverlay .v8Name{color:#fff!important;font:800 17px/1.18 system-ui,-apple-system,Segoe UI,sans-serif!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}
    .v8ReelOverlay .v8Brand{color:#e2ad35!important;font:900 13px/1.2 system-ui,-apple-system,Segoe UI,sans-serif!important;letter-spacing:.45px!important}
    .reelFeedCard .reelPlay,.reelFeedCard [class*="play"],.reelFeedCard button[aria-label*="Oynat" i]{z-index:14!important}
    .v7BottomShell button[data-v7="trend"]{background:transparent!important;border:0!important;border-radius:0!important;box-shadow:none!important}
    .v7BottomShell button[data-v7="trend"] svg{fill:none!important;stroke:rgba(255,255,255,.92)!important;background:transparent!important;border:0!important;border-radius:0!important}
    .v7BottomShell{background:rgba(0,0,0,.96)!important}
  `;
  document.head.appendChild(style);

  function textOf(el,sel){const n=el.querySelector(sel);return n?(n.textContent||'').trim():''}
  function enhance(card){
    if(!card || card.dataset.v8==='1') return;
    const media=card.querySelector('.reelMedia,video,img.media');
    if(!media) return;
    const head=card.querySelector('.head');
    const name=(head&&head.querySelector('h3')?.textContent||'').trim() || 'VİTRİN';
    const avatar=head&&head.querySelector('.av img,img');
    let stage=media.parentElement;
    if(!stage.classList.contains('v8ReelStage')){
      stage=document.createElement('div');stage.className='v8ReelStage';
      media.parentNode.insertBefore(stage,media);stage.appendChild(media);
    }
    if(!stage.querySelector('.v8ReelOverlay')){
      const ov=document.createElement('div');ov.className='v8ReelOverlay';
      const av=document.createElement('div');av.className='v8Avatar';
      if(avatar&&avatar.src){const im=document.createElement('img');im.src=avatar.src;im.alt='';av.appendChild(im)}
      const meta=document.createElement('div');meta.className='v8Meta';
      const nm=document.createElement('div');nm.className='v8Name';nm.textContent=name;
      const br=document.createElement('div');br.className='v8Brand';br.textContent='VİTRİN';
      meta.append(nm,br);ov.append(av,meta);stage.appendChild(ov);
    }
    card.dataset.v8='1';
  }
  function scan(){document.querySelectorAll('.reelFeedCard').forEach(enhance)}
  scan();
  new MutationObserver(()=>requestAnimationFrame(scan)).observe(document.body,{childList:true,subtree:true});
})();
