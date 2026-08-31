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
      .bottom{height:92px!important;padding:0 0 18px!important;box-sizing:border-box!important;display:grid!important;grid-template-columns:repeat(5,minmax(0,1fr))!important;align-items:stretch!important;justify-content:initial!important;}
      .wrap{padding-bottom:18px!important;}
      .modal,.vitrinThemePanel,.vLangPanel{padding-top:32px!important;padding-bottom:18px!important;box-sizing:border-box!important;}
      .box,.vitrinThemeSheet,.vLangSheet{max-height:calc(100vh - 64px)!important;}
      @supports(padding:max(0px)){
        .top{padding-top:max(32px,env(safe-area-inset-top))!important;}
        .bottom{padding-bottom:max(18px,env(safe-area-inset-bottom))!important;height:calc(74px + max(18px,env(safe-area-inset-bottom)))!important;}
        body{padding-bottom:calc(86px + max(18px,env(safe-area-inset-bottom)))!important;}
      }
      .compose .av img,.topActions a[href*="profile"] img,.topActions .reelsProfileTop img,#profileBtn img{width:100%!important;height:100%!important;object-fit:cover!important;border-radius:inherit!important;display:block!important;}
      .bottom>button,.bottom>.nav{appearance:none!important;-webkit-appearance:none!important;border:0!important;background:transparent!important;width:auto!important;min-width:0!important;max-width:none!important;height:74px!important;min-height:74px!important;max-height:74px!important;margin:0!important;padding:0!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;gap:0!important;box-sizing:border-box!important;text-align:center!important;text-decoration:none!important;font-family:system-ui,-apple-system,Segoe UI,sans-serif!important;font-size:11px!important;line-height:14px!important;font-weight:400!important;color:#7d8794!important;transform:none!important;translate:none!important;scale:1!important;animation:none!important;transition:color .12s linear!important;}
      .bottom>button.on,.bottom>.nav.active{color:#2d8cff!important;font-weight:800!important;transform:none!important;translate:none!important;scale:1!important;}
      .bottom>button span,.bottom>.nav span{display:block!important;width:24px!important;min-width:24px!important;max-width:24px!important;height:24px!important;min-height:24px!important;max-height:24px!important;margin:0 0 3px!important;padding:0!important;font-size:21px!important;line-height:24px!important;text-align:center!important;transform:none!important;translate:none!important;scale:1!important;animation:none!important;transition:none!important;}
      .bottom>button.on span,.bottom>.nav.active span{font-size:21px!important;line-height:24px!important;transform:none!important;translate:none!important;scale:1!important;}
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

  function navData(el){
    const raw=(el.textContent||'').replace(/\s+/g,' ').trim().toLocaleLowerCase('tr-TR');
    if(raw.includes('ana akış')||raw.includes('ana akis'))return ['🏠','Ana Akış'];
    if(raw.includes('reels'))return ['🎬','Reels'];
    if(raw.includes('gündem')||raw.includes('gundem'))return ['🔥','Gündem'];
    if(raw.includes('sosyal'))return ['💬','Sosyal'];
    if(raw.includes('profil'))return ['👤','Profil'];
    return null;
  }

  function normalizeBottomNav(root=document){
    root.querySelectorAll?.('.bottom>button,.bottom>.nav').forEach(el=>{
      const data=navData(el);
      if(!data)return;
      const html=`<span aria-hidden="true">${data[0]}</span>${data[1]}`;
      if(el.innerHTML!==html)el.innerHTML=html;
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
