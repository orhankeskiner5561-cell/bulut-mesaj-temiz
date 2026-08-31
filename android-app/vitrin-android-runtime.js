(function(){
  const STYLE_ID='vitrinAndroidSafeAreaV3NoReelsStableIndex';
  function installSafeArea(){
    if(document.getElementById(STYLE_ID))return;
    const style=document.createElement('style');
    style.id=STYLE_ID;
    style.textContent=`
      html,body{width:100%!important;max-width:100%!important;overflow-x:hidden!important;}
      body{padding-top:0!important;padding-bottom:104px!important;}
      .top{padding-top:32px!important;box-sizing:border-box!important;min-height:146px!important;height:auto!important;}
      .bottom{height:92px!important;padding-bottom:18px!important;box-sizing:border-box!important;grid-template-columns:repeat(4,1fr)!important;}
      .bottom button[onclick*="reels.html"],.bottom a[href*="reels.html"]{display:none!important;}
      .reelOpen{display:none!important;}
      .wrap{padding-bottom:18px!important;}
      .modal,.vitrinThemePanel,.vLangPanel{padding-top:32px!important;padding-bottom:18px!important;box-sizing:border-box!important;}
      .box,.vitrinThemeSheet,.vLangSheet{max-height:calc(100vh - 64px)!important;}
      @supports(padding:max(0px)){
        .top{padding-top:max(32px,env(safe-area-inset-top))!important;}
        .bottom{padding-bottom:max(18px,env(safe-area-inset-bottom))!important;height:calc(74px + max(18px,env(safe-area-inset-bottom)))!important;}
        body{padding-bottom:calc(86px + max(18px,env(safe-area-inset-bottom)))!important;}
      }
      .compose .av img,.topActions a[href*="profile"] img,.topActions .reelsProfileTop img,#profileBtn img{width:100%!important;height:100%!important;object-fit:cover!important;border-radius:inherit!important;display:block!important;}
    `;
    document.head.appendChild(style);
  }

  function keepDedicatedReelsHidden(){
    /* Reels düğmesini DOM'dan SİLMİYORUZ. Sadece gizli tutuyoruz; böylece
       mevcut Android/nav scriptlerinin düğme indeksleri değişmiyor ve
       Gündem kendi gerçek görevini koruyor. */
    document.querySelectorAll('.bottom button,.bottom a').forEach(el=>{
      const onclick=(el.getAttribute('onclick')||'').toLowerCase();
      const href=(el.getAttribute('href')||'').toLowerCase();
      if(onclick.includes('reels.html')||href.includes('reels.html')){
        el.style.setProperty('display','none','important');
        el.setAttribute('aria-hidden','true');
        el.setAttribute('tabindex','-1');
      }
    });
    document.querySelectorAll('.reelOpen').forEach(el=>{
      el.style.setProperty('display','none','important');
      el.setAttribute('aria-hidden','true');
      el.setAttribute('tabindex','-1');
    });
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

  function init(){
    installSafeArea();
    keepDedicatedReelsHidden();
    repairCurrentAvatar();
    setTimeout(()=>{keepDedicatedReelsHidden();repairCurrentAvatar();},700);
    setTimeout(()=>{keepDedicatedReelsHidden();repairCurrentAvatar();},1800);
    const mo=new MutationObserver(()=>{keepDedicatedReelsHidden();repairCurrentAvatar();});
    mo.observe(document.body,{childList:true,subtree:true});
    setTimeout(()=>mo.disconnect(),12000);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
