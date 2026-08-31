(function(){
  const STYLE_ID='vitrinAndroidSafeAreaV1';
  function installSafeArea(){
    if(document.getElementById(STYLE_ID))return;
    const style=document.createElement('style');
    style.id=STYLE_ID;
    style.textContent=`
      html,body{width:100%!important;max-width:100%!important;overflow-x:hidden!important;}
      body{padding-top:0!important;padding-bottom:104px!important;}
      .top{padding-top:32px!important;box-sizing:border-box!important;min-height:146px!important;height:auto!important;}
      .bottom{height:92px!important;padding:0 0 18px!important;box-sizing:border-box!important;display:flex!important;align-items:center!important;justify-content:space-around!important;}
      .wrap{padding-bottom:18px!important;}
      .modal,.vitrinThemePanel,.vLangPanel{padding-top:32px!important;padding-bottom:18px!important;box-sizing:border-box!important;}
      .box,.vitrinThemeSheet,.vLangSheet{max-height:calc(100vh - 64px)!important;}
      @supports(padding:max(0px)){
        .top{padding-top:max(32px,env(safe-area-inset-top))!important;}
        .bottom{padding-bottom:max(18px,env(safe-area-inset-bottom))!important;height:calc(74px + max(18px,env(safe-area-inset-bottom)))!important;}
        body{padding-bottom:calc(86px + max(18px,env(safe-area-inset-bottom)))!important;}
      }
      .compose .av img,.topActions a[href*="profile"] img,.topActions .reelsProfileTop img,#profileBtn img{width:100%!important;height:100%!important;object-fit:cover!important;border-radius:inherit!important;display:block!important;}
      .bottom .nav{
        flex:0 0 20%!important;
        width:20%!important;
        min-width:0!important;
        height:56px!important;
        margin:0!important;
        padding:0!important;
        display:flex!important;
        flex-direction:column!important;
        align-items:center!important;
        justify-content:center!important;
        gap:0!important;
        box-sizing:border-box!important;
        font-size:13px!important;
        line-height:16px!important;
        font-weight:400!important;
        transform:none!important;
        scale:1!important;
        animation:none!important;
        transition:color .12s linear!important;
      }
      .bottom .nav.active{font-weight:400!important;transform:none!important;scale:1!important;}
      .bottom .nav span{
        display:block!important;
        width:32px!important;
        min-width:32px!important;
        max-width:32px!important;
        height:32px!important;
        min-height:32px!important;
        max-height:32px!important;
        margin:0 0 2px!important;
        padding:0!important;
        font-size:27px!important;
        line-height:32px!important;
        text-align:center!important;
        transform:none!important;
        scale:1!important;
        animation:none!important;
        transition:none!important;
      }
      .bottom .nav.active span{font-size:27px!important;line-height:32px!important;transform:none!important;scale:1!important;}
      .vitrinAndroidPlayOverlayHidden{display:none!important;visibility:hidden!important;pointer-events:none!important;}
    `;
    document.head.appendChild(style);
  }

  function setAvatar(el,url,alt){
    if(!el||!url)return;
    const img=document.createElement('img');
    img.src=url;
    img.alt=alt||'Profil';
    img.referrerPolicy='no-referrer';
    img.onerror=()=>{img.remove(); if(!el.textContent.trim())el.textContent='👤';};
    el.replaceChildren(img);
  }

  async function repairCurrentAvatar(){
    document.querySelectorAll('.av').forEach(el=>{if(el.textContent.trim()==='?')el.textContent='👤';});
    try{
      if(typeof sb==='undefined'||!sb?.auth)return;
      const sessionRes=await sb.auth.getSession();
      const session=sessionRes?.data?.session;
      if(!session?.user?.id)return;
      const profileRes=await sb.from('profiles').select('avatar_url,full_name,username').eq('id',session.user.id).maybeSingle();
      const p=profileRes?.data;
      const url=p?.avatar_url;
      if(!url)return;
      document.querySelectorAll('.compose .av').forEach(el=>setAvatar(el,url,'Profil fotoğrafı'));
      document.querySelectorAll('.topActions a[href*="profile"],.topActions .reelsProfileTop,#profileBtn').forEach(el=>setAvatar(el,url,'Profil fotoğrafı'));
      document.querySelectorAll('.profile .big,.profile .av.big').forEach(el=>{if(!el.querySelector('img'))setAvatar(el,url,'Profil fotoğrafı');});
    }catch(e){console.warn('Android profil resmi düzeltmesi uygulanamadı',e);}
  }

  function normalizeBottomNav(root=document){
    root.querySelectorAll?.('.bottom .nav').forEach(a=>{
      const label=(a.textContent||'').replace(/\s+/g,' ').trim().toLocaleLowerCase('tr-TR');
      const span=a.querySelector('span');
      if(!span)return;
      if(label.includes('ana akış')||label.includes('ana akis'))span.textContent='🏠';
      else if(label.includes('reels'))span.textContent='🎬';
      else if(label.includes('gündem')||label.includes('gundem'))span.textContent='🔥';
      else if(label.includes('sosyal'))span.textContent='💬';
      else if(label.includes('profil'))span.textContent='👤';
    });
  }

  function hidePlayOverlays(root=document){
    root.querySelectorAll?.('button,a,div,span').forEach(el=>{
      if(el.closest?.('.bottom,.top,.topActions'))return;
      const t=(el.textContent||'').trim();
      if(t==='▶'||t==='▶️'||t==='▷'){
        const mediaHost=el.closest?.('.reel,.reelWrap,.post,.card,.feedCard,[class*="reel"],[class*="video"]');
        if(mediaHost?.querySelector?.('video'))el.classList.add('vitrinAndroidPlayOverlayHidden');
      }
    });
  }

  function prepareVideo(video){
    if(!video)return;
    video.playsInline=true;
    video.autoplay=true;
    video.muted=true;
    video.defaultMuted=true;
    video.controls=false;
    video.preload='auto';
    video.removeAttribute('poster');
    try{video.disablePictureInPicture=true;}catch{}
    const play=()=>{try{const p=video.play();if(p?.catch)p.catch(()=>{});}catch{}};
    if(video.readyState>=2)play();
    else video.addEventListener('loadeddata',play,{once:true});
    video.addEventListener('canplay',play,{once:true});
  }

  function prepareMedia(root=document){
    root.querySelectorAll?.('video').forEach(prepareVideo);
    hidePlayOverlays(root);
  }

  function init(){
    installSafeArea();
    normalizeBottomNav();
    prepareMedia();
    repairCurrentAvatar();
    setTimeout(()=>{normalizeBottomNav();prepareMedia();repairCurrentAvatar();},700);
    setTimeout(()=>{normalizeBottomNav();prepareMedia();repairCurrentAvatar();},1800);
    const mo=new MutationObserver(ms=>{
      for(const m of ms)for(const n of m.addedNodes){
        if(n.nodeType!==1)continue;
        if(n.matches?.('video'))prepareVideo(n);
        normalizeBottomNav(n);
        prepareMedia(n);
      }
    });
    mo.observe(document.body,{childList:true,subtree:true});
    setTimeout(()=>mo.disconnect(),30000);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
