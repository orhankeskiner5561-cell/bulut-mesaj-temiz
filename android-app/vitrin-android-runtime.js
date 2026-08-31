(function(){
  const STYLE_ID='vitrinAndroidDiscoverNavUpFix2V5';

  function installSafeArea(){
    if(document.getElementById(STYLE_ID))return;
    const style=document.createElement('style');
    style.id=STYLE_ID;
    style.textContent=`
      html,body{width:100%!important;max-width:100%!important;overflow-x:hidden!important;}
      body{padding-top:0!important;padding-bottom:150px!important;}
      .top{padding-top:32px!important;box-sizing:border-box!important;min-height:146px!important;height:auto!important;}

      /* Android alt menüyü belirgin şekilde yukarı al. */
      .bottom{
        height:76px!important;
        min-height:76px!important;
        padding:0 0 8px!important;
        box-sizing:border-box!important;
        grid-template-columns:repeat(4,1fr)!important;
        bottom:42px!important;
        transform:none!important;
      }
      .bottom button,.bottom a{align-self:center!important;}
      .bottom button[onclick*="reels.html"],.bottom a[href*="reels.html"]{display:none!important;}
      .reelOpen{display:none!important;}
      .wrap{padding-bottom:72px!important;}

      /* Keşfet kartı JS ile işaretlenince gerçekten daralt. */
      .vitrinAndroidCompactDiscover{
        min-height:0!important;
        height:210px!important;
        max-height:210px!important;
        padding:12px 16px 10px!important;
        margin-bottom:10px!important;
        overflow:hidden!important;
      }
      .vitrinAndroidCompactDiscover h1,
      .vitrinAndroidCompactDiscover h2,
      .vitrinAndroidCompactDiscover h3{
        margin:0 0 8px!important;
        line-height:1.05!important;
      }
      .vitrinAndroidCompactDiscover .stories{
        min-height:0!important;
        height:135px!important;
        max-height:135px!important;
        padding:0!important;
        margin:0!important;
        align-items:flex-start!important;
        overflow-y:hidden!important;
      }
      .vitrinAndroidCompactDiscover .story{
        min-height:0!important;
        margin:0!important;
        padding:0!important;
      }
      .vitrinAndroidCompactDiscover .ring{
        width:82px!important;
        height:82px!important;
      }
      .vitrinAndroidCompactDiscover .story small{
        margin-top:4px!important;
      }

      .modal,.vitrinThemePanel,.vLangPanel{padding-top:32px!important;padding-bottom:18px!important;box-sizing:border-box!important;}
      .box,.vitrinThemeSheet,.vLangSheet{max-height:calc(100vh - 64px)!important;}
      .compose .av img,.topActions a[href*="profile"] img,.topActions .reelsProfileTop img,#profileBtn img{width:100%!important;height:100%!important;object-fit:cover!important;border-radius:inherit!important;display:block!important;}

      @supports(padding:max(0px)){
        .top{padding-top:max(32px,env(safe-area-inset-top))!important;}
        .bottom{
          bottom:calc(28px + max(14px,env(safe-area-inset-bottom)))!important;
          padding-bottom:8px!important;
          height:76px!important;
        }
        body{padding-bottom:calc(138px + max(14px,env(safe-area-inset-bottom)))!important;}
      }
    `;
    document.head.appendChild(style);
  }

  function compactDiscover(){
    let target=null;
    const headings=[...document.querySelectorAll('h1,h2,h3,h4,strong')];
    for(const el of headings){
      const txt=(el.textContent||'').trim().toLocaleLowerCase('tr-TR');
      if(txt==='keşfet' || txt==='kesfet'){
        target=el.closest('.card') || el.parentElement;
        break;
      }
    }
    if(!target){
      const cards=[...document.querySelectorAll('.card')];
      target=cards.find(card=>/keşfet|kesfet/i.test(card.textContent||'') && card.querySelector('.stories,.story')) || null;
    }
    if(target){
      target.classList.add('vitrinAndroidCompactDiscover');
      target.style.setProperty('height','210px','important');
      target.style.setProperty('max-height','210px','important');
      target.style.setProperty('min-height','0','important');
      target.style.setProperty('padding','12px 16px 10px','important');
      target.style.setProperty('overflow','hidden','important');
    }
  }

  function keepDedicatedReelsHidden(){
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

  function applyLayoutFix(){
    compactDiscover();
    keepDedicatedReelsHidden();
  }

  function init(){
    installSafeArea();
    applyLayoutFix();
    repairCurrentAvatar();
    [250,700,1400,2600].forEach(ms=>setTimeout(()=>{applyLayoutFix();repairCurrentAvatar();},ms));
    const mo=new MutationObserver(()=>applyLayoutFix());
    mo.observe(document.body,{childList:true,subtree:true});
    setTimeout(()=>mo.disconnect(),15000);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
