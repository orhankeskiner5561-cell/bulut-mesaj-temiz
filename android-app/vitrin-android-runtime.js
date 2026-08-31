(function(){
  const STYLE_ID='vitrinAndroidSafeAreaV1';
  function isReelsPage(){return /\/reels\.html$/i.test(location.pathname)}
  function isHomePage(){return /\/(index\.html)?$/i.test(location.pathname)}
  function installSafeArea(){
    if(document.getElementById(STYLE_ID))return;
    const style=document.createElement('style');
    style.id=STYLE_ID;
    style.textContent=`
      html,body{width:100%!important;max-width:100%!important;overflow-x:hidden!important;}
      body{padding-top:0!important;padding-bottom:104px!important;}
      .top{padding-top:32px!important;box-sizing:border-box!important;min-height:146px!important;height:auto!important;}
      .bottom{height:92px!important;padding-bottom:18px!important;box-sizing:border-box!important;}
      .bottom.vitrinFourNav{grid-template-columns:repeat(4,minmax(0,1fr))!important;}
      .bottom.vitrinFourNav>a,.bottom.vitrinFourNav>button{width:100%!important;min-width:0!important;}
      html.vitrinReelsUploadOnly .bottom{display:none!important;}
      html.vitrinReelsUploadOnly body{padding-bottom:24px!important;}
      .vitrinHomeReelsPlus{font-size:30px!important;font-weight:500!important;line-height:1!important;}
      .wrap{padding-bottom:18px!important;}
      .modal,.vitrinThemePanel,.vLangPanel{padding-top:32px!important;padding-bottom:18px!important;box-sizing:border-box!important;}
      .box,.vitrinThemeSheet,.vLangSheet{max-height:calc(100vh - 64px)!important;}
      @supports(padding:max(0px)){
        .top{padding-top:max(32px,env(safe-area-inset-top))!important;}
        .bottom{padding-bottom:max(18px,env(safe-area-inset-bottom))!important;height:calc(74px + max(18px,env(safe-area-inset-bottom)))!important;}
        body{padding-bottom:calc(86px + max(18px,env(safe-area-inset-bottom)))!important;}
        html.vitrinReelsUploadOnly body{padding-bottom:max(24px,env(safe-area-inset-bottom))!important;}
      }
      .compose .av img,.topActions a[href*="profile"] img,.topActions .reelsProfileTop img,#profileBtn img{width:100%!important;height:100%!important;object-fit:cover!important;border-radius:inherit!important;display:block!important;}
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

  function removeOnlyReelsBottomTab(){
    document.querySelectorAll('.bottom').forEach(bottom=>{
      Array.from(bottom.children).forEach(el=>{
        const href=(el.getAttribute?.('href')||'').toLowerCase();
        const txt=(el.textContent||'').replace(/\s+/g,' ').trim().toLocaleLowerCase('tr-TR');
        const onclick=(el.getAttribute?.('onclick')||'').toLowerCase();
        const isReels=href.includes('reels.html') || onclick.includes('reels') || txt==='reels' || txt.endsWith(' reels');
        if(isReels) el.remove();
      });
      bottom.classList.add('vitrinFourNav');
    });
  }

  function addHomePlus(){
    if(!isHomePage()||document.getElementById('vitrinHomeReelsPlus'))return;
    const host=document.querySelector('.topActions,.actions');
    if(!host)return;
    const plus=document.createElement('button');
    plus.id='vitrinHomeReelsPlus';
    plus.className=(host.querySelector('.ib')?'ib ':'action ')+'vitrinHomeReelsPlus';
    plus.type='button';
    plus.setAttribute('aria-label','Reels yükle');
    plus.textContent='＋';
    plus.addEventListener('click',()=>{location.href='reels.html?upload=1';});
    const first=host.firstElementChild;
    if(first) first.insertAdjacentElement('afterend',plus); else host.appendChild(plus);
  }

  function setupReelsUploadEntry(){
    if(!isReelsPage())return;
    document.documentElement.classList.add('vitrinReelsUploadOnly');
    const q=new URLSearchParams(location.search);
    if(q.get('upload')!=='1')return;
    const open=()=>{
      const pick=document.getElementById('pickBtn');
      if(pick){pick.click();return true;}
      return false;
    };
    if(!open()){
      let tries=0;
      const t=setInterval(()=>{tries++;if(open()||tries>20)clearInterval(t);},150);
    }
  }

  function init(){
    installSafeArea();
    removeOnlyReelsBottomTab();
    addHomePlus();
    setupReelsUploadEntry();
    repairCurrentAvatar();
    setTimeout(()=>{removeOnlyReelsBottomTab();addHomePlus();repairCurrentAvatar();},700);
    setTimeout(()=>{removeOnlyReelsBottomTab();addHomePlus();repairCurrentAvatar();},1800);
    const mo=new MutationObserver(()=>{removeOnlyReelsBottomTab();addHomePlus();repairCurrentAvatar();});
    mo.observe(document.body,{childList:true,subtree:true});
    setTimeout(()=>mo.disconnect(),12000);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
