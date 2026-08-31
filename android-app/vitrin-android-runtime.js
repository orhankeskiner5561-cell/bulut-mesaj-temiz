(function(){
  document.documentElement.classList.add('vitrin-android-app');
  document.documentElement.dataset.vitrinAndroidBuild='calm-nav-video-fix-2026-08-31';

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
      const sr=await sb.auth.getSession();
      const session=sr?.data?.session;
      if(!session?.user?.id)return;
      const pr=await sb.from('profiles').select('avatar_url').eq('id',session.user.id).maybeSingle();
      const url=pr?.data?.avatar_url;
      if(!url)return;
      document.querySelectorAll('.compose .av').forEach(el=>setAvatar(el,url,'Profil fotoğrafı'));
      document.querySelectorAll('.topActions a[href*="profile"],.topActions .reelsProfileTop,#profileBtn').forEach(el=>setAvatar(el,url,'Profil fotoğrafı'));
      document.querySelectorAll('.profile .big,.profile .av.big').forEach(el=>{if(!el.querySelector('img'))setAvatar(el,url,'Profil fotoğrafı');});
    }catch(e){console.warn('Android profil resmi düzeltmesi uygulanamadı',e);}
  }

  function revealVideo(video){
    if(!video)return;
    video.classList.remove('vitrin-video-pending');
    video.classList.add('vitrin-video-ready');
    video.style.visibility='visible';
    video.style.opacity='1';
  }

  function prepareVideo(video){
    if(!video||video.dataset.vitrinPrepared==='1')return;
    video.dataset.vitrinPrepared='1';
    video.removeAttribute('poster');
    video.removeAttribute('controls');
    video.controls=false;
    video.playsInline=true;
    video.setAttribute('playsinline','');
    video.setAttribute('webkit-playsinline','');
    video.preload='auto';
    video.disablePictureInPicture=true;
    video.classList.add('vitrin-video-pending');

    let revealed=false;
    const ready=()=>{
      if(revealed)return;
      revealed=true;
      requestAnimationFrame(()=>requestAnimationFrame(()=>revealVideo(video)));
    };

    const primeFirstFrame=()=>{
      try{
        if(video.readyState>=1 && isFinite(video.duration) && video.duration>0 && video.currentTime===0){
          video.currentTime=Math.min(0.035,Math.max(0.01,video.duration/2000));
        }
      }catch(_e){}
    };

    if(video.readyState>=2) ready();
    else {
      video.addEventListener('loadedmetadata',primeFirstFrame,{once:true});
      video.addEventListener('loadeddata',ready,{once:true});
      video.addEventListener('canplay',ready,{once:true});
    }
    video.addEventListener('error',ready,{once:true});
    setTimeout(ready,2200);
  }

  function prep(root=document){root.querySelectorAll?.('video').forEach(prepareVideo);}

  function init(){
    repairCurrentAvatar();
    prep();
    setTimeout(repairCurrentAvatar,700);
    setTimeout(repairCurrentAvatar,1800);
    const mo=new MutationObserver(ms=>{
      for(const m of ms)for(const n of m.addedNodes){
        if(n.nodeType===1){if(n.matches?.('video'))prepareVideo(n);prep(n);}
      }
    });
    mo.observe(document.body,{childList:true,subtree:true});
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
