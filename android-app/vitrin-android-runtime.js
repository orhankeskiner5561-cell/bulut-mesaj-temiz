(function(){
  try{if('scrollRestoration' in history)history.scrollRestoration='manual';}catch{}

  function setAvatar(el,url,alt){if(!el||!url)return;const img=document.createElement('img');img.src=url;img.alt=alt||'Profil';img.referrerPolicy='no-referrer';img.onerror=()=>{img.remove();if(!el.textContent.trim())el.textContent='👤';};el.replaceChildren(img);}

  async function repairCurrentAvatar(){
    document.querySelectorAll('.av').forEach(el=>{if(el.textContent.trim()==='?')el.textContent='👤';});
    try{if(typeof sb==='undefined'||!sb?.auth)return;const sr=await sb.auth.getSession();const session=sr?.data?.session;if(!session?.user?.id)return;const pr=await sb.from('profiles').select('avatar_url').eq('id',session.user.id).maybeSingle();const url=pr?.data?.avatar_url;if(!url)return;document.querySelectorAll('.compose .av').forEach(el=>setAvatar(el,url,'Profil fotoğrafı'));document.querySelectorAll('.topActions a[href*="profile"],.topActions .reelsProfileTop,#profileBtn').forEach(el=>setAvatar(el,url,'Profil fotoğrafı'));document.querySelectorAll('.profile .big,.profile .av.big').forEach(el=>{if(!el.querySelector('img'))setAvatar(el,url,'Profil fotoğrafı');});}catch(e){console.warn('Android profil resmi düzeltmesi uygulanamadı',e);}
  }

  function prepareVideo(video){
    if(!video||video.dataset.vitrinPrepared==='1')return;
    video.dataset.vitrinPrepared='1';
    video.removeAttribute('poster');
    video.playsInline=true;
    video.preload='auto';
    try{video.disablePictureInPicture=true;}catch{}
    try{video.controls=false;}catch{}
    const showFirstFrame=()=>{
      try{if(video.duration&&isFinite(video.duration)&&video.currentTime===0)video.currentTime=Math.min(.05,Math.max(.01,video.duration/1500));}catch{}
    };
    if(video.readyState>=1)showFirstFrame();
    else video.addEventListener('loadedmetadata',showFirstFrame,{once:true});
    video.addEventListener('loadeddata',showFirstFrame,{once:true});
    try{video.load();}catch{}
  }

  function prep(root=document){root.querySelectorAll?.('video').forEach(prepareVideo)}

  function cleanNavTarget(href){
    try{const u=new URL(href,location.href);const p=u.pathname.toLowerCase();if(p.endsWith('/index.html')||p.endsWith('/reels.html')||p==='/'||p.endsWith('/'))return u.href;}catch{}
    return null;
  }

  function installStableNav(){
    document.addEventListener('click',e=>{
      const a=e.target.closest?.('a[href]');if(!a)return;
      const target=cleanNavTarget(a.getAttribute('href'));if(!target)return;
      let dest;try{dest=new URL(target).pathname.toLowerCase();}catch{return;}
      const here=location.pathname.toLowerCase();
      const same=(dest===here)||((dest==='/'||dest.endsWith('/'))&&(here==='/'||here.endsWith('/index.html')));
      if(same)return;
      e.preventDefault();
      try{sessionStorage.setItem('vitrinAndroidNavTop','1');}catch{}
      document.querySelectorAll('video').forEach(v=>{try{v.pause();}catch{}});
      requestAnimationFrame(()=>{location.href=target;});
    },true);
  }

  function settleTopIfNeeded(){
    let go=false;try{go=sessionStorage.getItem('vitrinAndroidNavTop')==='1';if(go)sessionStorage.removeItem('vitrinAndroidNavTop');}catch{}
    if(!go)return;
    const top=()=>{try{window.scrollTo(0,0);}catch{}};
    top();requestAnimationFrame(()=>{top();requestAnimationFrame(top);});
  }

  function init(){
    repairCurrentAvatar();prep();installStableNav();settleTopIfNeeded();
    setTimeout(repairCurrentAvatar,700);setTimeout(repairCurrentAvatar,1800);
    const mo=new MutationObserver(ms=>{for(const m of ms)for(const n of m.addedNodes){if(n.nodeType===1){if(n.matches?.('video'))prepareVideo(n);prep(n)}}});
    mo.observe(document.body,{childList:true,subtree:true});setTimeout(()=>mo.disconnect(),30000);
  }

  window.addEventListener('pageshow',()=>{settleTopIfNeeded();prep();});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
// VITRIN Android minimal-fix build 2026-08-31
