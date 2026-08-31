(function(){
  const STYLE_ID='vitrinAndroidCalmV2';
  function installStyles(){
    if(document.getElementById(STYLE_ID))return;
    const style=document.createElement('style');
    style.id=STYLE_ID;
    style.textContent=`
      html,body{width:100%!important;max-width:100%!important;overflow-x:hidden!important;scroll-behavior:auto!important;overscroll-behavior:none!important;background:#090909!important;}
      body{padding-top:0!important;padding-bottom:104px!important;}
      *,*::before,*::after{scroll-behavior:auto!important;}
      .page,.page.on,.wrap,main,.card,.box,.top,.bottom,.reel,.reelWrap,.post,.room,.ib,.action,.nav{animation:none!important;transition:none!important;transform:none!important;}
      .top{padding-top:32px!important;box-sizing:border-box!important;min-height:146px!important;height:auto!important;}
      .bottom{height:92px!important;padding-bottom:18px!important;box-sizing:border-box!important;}
      .wrap{padding-bottom:18px!important;}
      .modal,.vitrinThemePanel,.vLangPanel{padding-top:32px!important;padding-bottom:18px!important;box-sizing:border-box!important;}
      .box,.vitrinThemeSheet,.vLangSheet{max-height:calc(100vh - 64px)!important;}
      @supports(padding:max(0px)){
        .top{padding-top:max(32px,env(safe-area-inset-top))!important;}
        .bottom{padding-bottom:max(18px,env(safe-area-inset-bottom))!important;height:calc(74px + max(18px,env(safe-area-inset-bottom)))!important;}
        body{padding-bottom:calc(86px + max(18px,env(safe-area-inset-bottom)))!important;}
      }
      .compose .av img,.topActions a[href*="profile"] img,.topActions .reelsProfileTop img,#profileBtn img{width:100%!important;height:100%!important;object-fit:cover!important;border-radius:inherit!important;display:block!important;}
      video{background:#090909!important;}
      video.vitrin-media-wait{opacity:0!important;}
      video.vitrin-media-ready{opacity:1!important;transition:opacity .08s linear!important;}
      .vitrin-media-shell{background:#090909!important;}
      @media(prefers-reduced-motion:no-preference){body{animation:none!important;}}
    `;
    document.head.appendChild(style);
  }

  function setAvatar(el,url,alt){
    if(!el||!url)return;
    const img=document.createElement('img');
    img.src=url;img.alt=alt||'Profil';img.referrerPolicy='no-referrer';
    img.onerror=()=>{img.remove();if(!el.textContent.trim())el.textContent='👤';};
    el.replaceChildren(img);
  }

  async function repairCurrentAvatar(){
    document.querySelectorAll('.av').forEach(el=>{if(el.textContent.trim()==='?')el.textContent='👤';});
    try{
      if(typeof sb==='undefined'||!sb?.auth)return;
      const sessionRes=await sb.auth.getSession();const session=sessionRes?.data?.session;if(!session?.user?.id)return;
      const profileRes=await sb.from('profiles').select('avatar_url,full_name,username').eq('id',session.user.id).maybeSingle();
      const url=profileRes?.data?.avatar_url;if(!url)return;
      document.querySelectorAll('.compose .av').forEach(el=>setAvatar(el,url,'Profil fotoğrafı'));
      document.querySelectorAll('.topActions a[href*="profile"],.topActions .reelsProfileTop,#profileBtn').forEach(el=>setAvatar(el,url,'Profil fotoğrafı'));
      document.querySelectorAll('.profile .big,.profile .av.big').forEach(el=>{if(!el.querySelector('img'))setAvatar(el,url,'Profil fotoğrafı');});
    }catch(e){console.warn('Android profil resmi düzeltmesi uygulanamadı',e);}
  }

  function calmVideo(video){
    if(!video||video.dataset.vitrinCalm==='1')return;
    video.dataset.vitrinCalm='1';
    video.removeAttribute('poster');
    video.controls=false;
    video.classList.add('vitrin-media-wait');
    const shell=video.closest('.reel,.reelWrap,.post,.media')||video.parentElement;
    if(shell)shell.classList.add('vitrin-media-shell');
    const ready=()=>{video.classList.remove('vitrin-media-wait');video.classList.add('vitrin-media-ready');};
    if(video.readyState>=2)ready();
    else {video.addEventListener('loadeddata',ready,{once:true});video.addEventListener('canplay',ready,{once:true});setTimeout(()=>{if(video.readyState>=1)ready();},1200);}
  }

  function calmAllMedia(root=document){
    root.querySelectorAll?.('video').forEach(calmVideo);
    root.querySelectorAll?.('img[alt*="play" i],img[title*="play" i]').forEach(img=>{img.style.display='none';});
  }

  function resetStoredRouteScroll(){
    try{['home','reels','agenda','rooms','profile'].forEach(r=>sessionStorage.setItem('vitrin_scroll_'+r,'0'));}catch{}
  }

  function stabilizeNavigation(){
    resetStoredRouteScroll();
    document.addEventListener('pointerdown',e=>{
      const b=e.target.closest('.bottom button,.bottom a,.nav');if(!b)return;
      resetStoredRouteScroll();
      document.documentElement.style.scrollBehavior='auto';
    },true);
    window.addEventListener('pageshow',()=>{requestAnimationFrame(()=>window.scrollTo(0,0));},{passive:true});
    window.addEventListener('hashchange',()=>{requestAnimationFrame(()=>window.scrollTo(0,0));},{passive:true});
  }

  function init(){
    installStyles();stabilizeNavigation();repairCurrentAvatar();calmAllMedia();
    setTimeout(repairCurrentAvatar,700);setTimeout(repairCurrentAvatar,1800);
    const mo=new MutationObserver(muts=>{repairCurrentAvatar();for(const m of muts)for(const n of m.addedNodes){if(n.nodeType===1){if(n.matches?.('video'))calmVideo(n);calmAllMedia(n);}}});
    mo.observe(document.body,{childList:true,subtree:true});
    setTimeout(()=>mo.disconnect(),20000);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
