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
      .bottom{height:92px!important;padding-bottom:18px!important;box-sizing:border-box!important;}
      .bottom.vitrinAndroidFourTabs{grid-template-columns:repeat(4,minmax(0,1fr))!important;}
      .vitrinAndroidHide{display:none!important;}
      .vitrinAndroidReelsPlus{border:0!important;background:#eef7ff!important;border-radius:14px!important;width:42px!important;height:42px!important;display:grid!important;place-items:center!important;padding:0!important;color:#10233f!important;text-decoration:none!important;font-size:30px!important;font-weight:500!important;line-height:1!important;}
      .vitrinAndroidReelsBack{border:0!important;background:#eef7ff!important;border-radius:14px!important;width:42px!important;height:42px!important;display:grid!important;place-items:center!important;padding:0!important;color:#10233f!important;text-decoration:none!important;font-size:22px!important;font-weight:800!important;line-height:1!important;}
      html.vitrinAndroidReelsPage body{padding-bottom:24px!important;}
      html.vitrinAndroidReelsPage .bottom{display:none!important;}
      .wrap{padding-bottom:18px!important;}
      .modal,.vitrinThemePanel,.vLangPanel{padding-top:32px!important;padding-bottom:18px!important;box-sizing:border-box!important;}
      .box,.vitrinThemeSheet,.vLangSheet{max-height:calc(100vh - 64px)!important;}
      @supports(padding:max(0px)){
        .top{padding-top:max(32px,env(safe-area-inset-top))!important;}
        .bottom{padding-bottom:max(18px,env(safe-area-inset-bottom))!important;height:calc(74px + max(18px,env(safe-area-inset-bottom)))!important;}
        body{padding-bottom:calc(86px + max(18px,env(safe-area-inset-bottom)))!important;}
        html.vitrinAndroidReelsPage body{padding-bottom:max(24px,env(safe-area-inset-bottom))!important;}
      }
      .compose .av img,.topActions a[href*="profile"] img,.topActions .reelsProfileTop img,#profileBtn img{width:100%!important;height:100%!important;object-fit:cover!important;border-radius:inherit!important;display:block!important;}
    `;
    document.head.appendChild(style);
  }

  function isReelsPage(){return /\/reels\.html$/i.test(location.pathname);}

  function removeReelsBottomTab(){
    document.querySelectorAll('.bottom').forEach(bottom=>{
      let removed=false;
      Array.from(bottom.children).forEach(el=>{
        const text=(el.textContent||'').replace(/\s+/g,' ').trim().toLocaleLowerCase('tr-TR');
        const href=(el.getAttribute?.('href')||'').toLocaleLowerCase('tr-TR');
        if(text.includes('reels')||href.includes('reels.html')){
          el.remove();
          removed=true;
        }
      });
      if(removed||bottom.children.length===4)bottom.classList.add('vitrinAndroidFourTabs');
    });
  }

  function addHomeReelsPlus(){
    if(isReelsPage())return;
    const path=(location.pathname||'').toLowerCase();
    const isHome=path.endsWith('/index.html')||path==='/'||path==='';
    if(!isHome)return;
    if(document.getElementById('vitrinAndroidReelsPlus'))return;
    const host=document.querySelector('.topActions,.actions');
    if(!host)return;
    const a=document.createElement('a');
    a.id='vitrinAndroidReelsPlus';
    a.className='vitrinAndroidReelsPlus';
    a.href='reels.html';
    a.setAttribute('aria-label','Reels yükle');
    a.setAttribute('title','Reels yükle');
    a.textContent='+';
    host.prepend(a);
  }

  function prepareReelsUploadPage(){
    if(!isReelsPage())return;
    document.documentElement.classList.add('vitrinAndroidReelsPage');
    document.querySelectorAll('.bottom').forEach(el=>el.remove());
    const host=document.querySelector('.topActions,.actions');
    if(host&&!document.getElementById('vitrinAndroidReelsBack')){
      const a=document.createElement('a');
      a.id='vitrinAndroidReelsBack';
      a.className='vitrinAndroidReelsBack';
      a.href='index.html#home';
      a.setAttribute('aria-label','Ana Akışa dön');
      a.setAttribute('title','Ana Akışa dön');
      a.textContent='←';
      host.prepend(a);
    }
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

  function applyAndroidNavigation(){
    if(isReelsPage())prepareReelsUploadPage();
    else{
      removeReelsBottomTab();
      addHomeReelsPlus();
    }
  }

  function init(){
    installSafeArea();
    applyAndroidNavigation();
    repairCurrentAvatar();
    setTimeout(()=>{applyAndroidNavigation();repairCurrentAvatar();},700);
    setTimeout(()=>{applyAndroidNavigation();repairCurrentAvatar();},1800);
    const mo=new MutationObserver(()=>{applyAndroidNavigation();repairCurrentAvatar();});
    mo.observe(document.body,{childList:true,subtree:true});
    setTimeout(()=>mo.disconnect(),12000);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
