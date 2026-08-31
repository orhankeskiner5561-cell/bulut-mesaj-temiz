(function(){
  const STYLE_ID='vitrinAndroidCalmV3';
  function installStyles(){
    if(document.getElementById(STYLE_ID))return;
    const style=document.createElement('style');
    style.id=STYLE_ID;
    style.textContent=`
      html,body{width:100%!important;max-width:100%!important;overflow-x:hidden!important;scroll-behavior:auto!important;background:#090909!important;}
      html{overflow-y:auto!important;overscroll-behavior-y:auto!important;}
      body{overflow-y:visible!important;padding-top:0!important;padding-bottom:104px!important;}
      *,*::before,*::after{scroll-behavior:auto!important;}
      .page,.page.on,.wrap,main,.card,.box,.top,.bottom,.reel,.reelWrap,.post,.room,.ib,.action,.nav{animation:none!important;transition:none!important;transform:none!important;}
      .compose .av img,.topActions a[href*="profile"] img,.topActions .reelsProfileTop img,#profileBtn img{width:100%!important;height:100%!important;object-fit:cover!important;border-radius:inherit!important;display:block!important;}
      video{background:#090909!important;}
      video.vitrin-media-wait{visibility:hidden!important;}
      video.vitrin-media-ready{visibility:visible!important;}
    `;
    document.head.appendChild(style);
  }
  function setAvatar(el,url,alt){if(!el||!url)return;const img=document.createElement('img');img.src=url;img.alt=alt||'Profil';img.referrerPolicy='no-referrer';img.onerror=()=>{img.remove();if(!el.textContent.trim())el.textContent='👤';};el.replaceChildren(img);}
  async function repairCurrentAvatar(){
    document.querySelectorAll('.av').forEach(el=>{if(el.textContent.trim()==='?')el.textContent='👤';});
    try{if(typeof sb==='undefined'||!sb?.auth)return;const sr=await sb.auth.getSession();const session=sr?.data?.session;if(!session?.user?.id)return;const pr=await sb.from('profiles').select('avatar_url').eq('id',session.user.id).maybeSingle();const url=pr?.data?.avatar_url;if(!url)return;document.querySelectorAll('.compose .av').forEach(el=>setAvatar(el,url,'Profil fotoğrafı'));document.querySelectorAll('.topActions a[href*="profile"],.topActions .reelsProfileTop,#profileBtn').forEach(el=>setAvatar(el,url,'Profil fotoğrafı'));document.querySelectorAll('.profile .big,.profile .av.big').forEach(el=>{if(!el.querySelector('img'))setAvatar(el,url,'Profil fotoğrafı');});}catch(e){console.warn('Android profil resmi düzeltmesi uygulanamadı',e);}
  }
  function calmVideo(video){if(!video||video.dataset.vitrinCalm==='1')return;video.dataset.vitrinCalm='1';video.removeAttribute('poster');video.controls=false;video.playsInline=true;video.classList.add('vitrin-media-wait');const ready=()=>{video.classList.remove('vitrin-media-wait');video.classList.add('vitrin-media-ready');};if(video.readyState>=2)ready();else{video.addEventListener('loadeddata',ready,{once:true});video.addEventListener('canplay',ready,{once:true});}}
  function calmAllMedia(root=document){root.querySelectorAll?.('video').forEach(calmVideo);}
  function init(){installStyles();repairCurrentAvatar();calmAllMedia();setTimeout(repairCurrentAvatar,700);setTimeout(repairCurrentAvatar,1800);const mo=new MutationObserver(ms=>{for(const m of ms)for(const n of m.addedNodes){if(n.nodeType===1){if(n.matches?.('video'))calmVideo(n);calmAllMedia(n);}}});mo.observe(document.body,{childList:true,subtree:true});setTimeout(()=>mo.disconnect(),30000);}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();