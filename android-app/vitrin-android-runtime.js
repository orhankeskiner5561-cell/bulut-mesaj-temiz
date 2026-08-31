(function(){
  function setAvatar(el,url,alt){if(!el||!url)return;const img=document.createElement('img');img.src=url;img.alt=alt||'Profil';img.referrerPolicy='no-referrer';img.onerror=()=>{img.remove();if(!el.textContent.trim())el.textContent='👤';};el.replaceChildren(img);}
  async function repairCurrentAvatar(){
    document.querySelectorAll('.av').forEach(el=>{if(el.textContent.trim()==='?')el.textContent='👤';});
    try{if(typeof sb==='undefined'||!sb?.auth)return;const sr=await sb.auth.getSession();const session=sr?.data?.session;if(!session?.user?.id)return;const pr=await sb.from('profiles').select('avatar_url').eq('id',session.user.id).maybeSingle();const url=pr?.data?.avatar_url;if(!url)return;document.querySelectorAll('.compose .av').forEach(el=>setAvatar(el,url,'Profil fotoğrafı'));document.querySelectorAll('.topActions a[href*="profile"],.topActions .reelsProfileTop,#profileBtn').forEach(el=>setAvatar(el,url,'Profil fotoğrafı'));document.querySelectorAll('.profile .big,.profile .av.big').forEach(el=>{if(!el.querySelector('img'))setAvatar(el,url,'Profil fotoğrafı');});}catch(e){console.warn('Android profil resmi düzeltmesi uygulanamadı',e);}
  }
  function prepareVideo(video){
    if(!video||video.dataset.vitrinPrepared==='1')return;
    video.dataset.vitrinPrepared='1';video.removeAttribute('poster');video.playsInline=true;video.preload='auto';video.style.visibility='visible';video.style.opacity='1';
    const showFirstFrame=()=>{try{if(video.duration&&isFinite(video.duration)&&video.currentTime===0)video.currentTime=Math.min(.08,Math.max(.01,video.duration/1000));}catch{}video.style.visibility='visible';video.style.opacity='1';};
    if(video.readyState>=1)showFirstFrame();
    else video.addEventListener('loadedmetadata',showFirstFrame,{once:true});
    video.addEventListener('loadeddata',showFirstFrame,{once:true});
    try{video.load();}catch{}
  }
  function prep(root=document){root.querySelectorAll?.('video').forEach(prepareVideo)}
  function init(){repairCurrentAvatar();prep();setTimeout(repairCurrentAvatar,700);setTimeout(repairCurrentAvatar,1800);const mo=new MutationObserver(ms=>{for(const m of ms)for(const n of m.addedNodes){if(n.nodeType===1){if(n.matches?.('video'))prepareVideo(n);prep(n)}}});mo.observe(document.body,{childList:true,subtree:true});setTimeout(()=>mo.disconnect(),30000);}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();