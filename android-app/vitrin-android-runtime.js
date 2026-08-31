(function(){
  const STYLE_ID='vitrinAndroidVisualRedesignV1';

  function installStyles(){
    if(document.getElementById(STYLE_ID))return;
    const style=document.createElement('style');
    style.id=STYLE_ID;
    style.textContent=`
      :root{--va-bg:#080808;--va-card:#121212;--va-card2:#171717;--va-gold:#d7a62a;--va-gold2:#f0c552;--va-text:#f7f7f7;--va-muted:#aaa;--va-line:#272727;}
      html,body{width:100%!important;max-width:100%!important;overflow-x:hidden!important;background:var(--va-bg)!important;color:var(--va-text)!important;}
      body{padding-top:0!important;padding-bottom:112px!important;}

      /* ÜST BAR — referans görseldeki sade uygulama başlığı */
      .top{position:sticky!important;top:0!important;z-index:40!important;height:112px!important;min-height:112px!important;padding:30px 18px 12px!important;background:#090909f2!important;border-bottom:1px solid #272727!important;box-shadow:none!important;backdrop-filter:blur(16px)!important;display:flex!important;align-items:center!important;gap:10px!important;}
      .brand{flex:1 1 auto!important;justify-content:flex-start!important;gap:5px!important;min-width:0!important;}
      .brandName,.brandText,.vitrinBrandText{font-size:28px!important;line-height:1!important;font-weight:900!important;letter-spacing:.5px!important;color:var(--va-gold2)!important;background:none!important;-webkit-text-fill-color:var(--va-gold2)!important;text-shadow:none!important;}
      .brandTr,.trText{font-size:16px!important;color:#e83b3b!important;}
      .brandFlag,.trFlag{font-size:16px!important;}
      .cloudLogo,.brand .cloud,.brand svg{display:none!important;}
      .topActions{display:flex!important;align-items:center!important;gap:8px!important;flex:0 0 auto!important;}
      .topActions>*{display:none!important;}
      .topActions [data-android-keep],.topActions a[href*="search"],.topActions button[onclick*="search"],.topActions .searchBtn,.topActions #searchBtn,.topActions button[onclick*="notif"],.topActions .notifBtn,.topActions #notifBtn,.topActions .ibWrap:has(.badgeDot){display:grid!important;}
      .ib{width:42px!important;height:42px!important;border-radius:50%!important;background:transparent!important;color:#fff!important;border:0!important;font-size:23px!important;box-shadow:none!important;}
      .badgeDot{border-color:#090909!important;background:#ef5b2a!important;}
      .vAndroidMenuBtn{display:grid!important;place-items:center!important;width:42px!important;height:42px!important;border:0!important;background:transparent!important;color:#fff!important;font-size:29px!important;line-height:1!important;padding:0!important;flex:0 0 42px!important;}

      /* GENEL İÇERİK */
      .wrap{max-width:720px!important;width:100%!important;margin:0 auto!important;padding:12px 14px 42px!important;}
      .card{background:linear-gradient(180deg,#151515,#101010)!important;border:1px solid #242424!important;border-radius:24px!important;box-shadow:0 10px 28px #0008!important;color:var(--va-text)!important;padding:16px!important;margin-bottom:14px!important;}
      .muted,.post .head small,.tiny,.hint{color:var(--va-muted)!important;}

      /* KEŞFET -> HİKÂYELER ŞERİDİ */
      .vAndroidStoriesCard{background:transparent!important;border:0!important;border-radius:0!important;box-shadow:none!important;padding:4px 0 12px!important;margin:0 0 8px!important;height:auto!important;max-height:none!important;overflow:visible!important;}
      .vAndroidStoriesCard>h1,.vAndroidStoriesCard>h2,.vAndroidStoriesCard>h3,.vAndroidStoriesCard>h4,.vAndroidStoriesCard>.sectionTitle{display:none!important;}
      .vAndroidStoriesCard .stories{display:flex!important;gap:15px!important;overflow-x:auto!important;overflow-y:hidden!important;padding:4px 2px 8px!important;margin:0!important;scrollbar-width:none!important;align-items:flex-start!important;}
      .vAndroidStoriesCard .stories::-webkit-scrollbar{display:none!important;}
      .vAndroidStoriesCard .story{min-width:70px!important;width:70px!important;text-align:center!important;margin:0!important;padding:0!important;color:#eee!important;}
      .vAndroidStoriesCard .ring{width:64px!important;height:64px!important;border-radius:50%!important;border:2.5px solid var(--va-gold)!important;background:#171717!important;box-shadow:0 0 0 2px #080808!important;font-size:28px!important;overflow:hidden!important;}
      .vAndroidStoriesCard .ring img{width:100%!important;height:100%!important;object-fit:cover!important;border-radius:50%!important;}
      .vAndroidStoriesCard .story small{margin-top:7px!important;color:#eee!important;font-size:12px!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;}

      /* Görselde ayrı yazı kutusu yok */
      .vAndroidHideComposer{display:none!important;}

      /* GÖNDERİ / REEL KARTLARI */
      .post,.reelFeedCard{background:linear-gradient(180deg,#151515,#101010)!important;border:1px solid #242424!important;border-radius:24px!important;padding:16px!important;margin-bottom:14px!important;box-shadow:0 10px 28px #0008!important;overflow:hidden!important;}
      .post .head,.reelFeedCard .head{display:flex!important;align-items:center!important;gap:10px!important;margin-bottom:12px!important;}
      .post .av,.reelFeedCard .av{width:48px!important;height:48px!important;flex:0 0 48px!important;border-radius:50%!important;overflow:hidden!important;background:#222!important;}
      .post h3,.reelFeedCard h3{font-size:17px!important;font-weight:800!important;color:#fff!important;}
      .post p,.reelFeedCard>p{font-size:16px!important;line-height:1.5!important;color:#f1f1f1!important;margin:10px 0 14px!important;}
      .media,.reelMedia{width:100%!important;max-height:none!important;border-radius:18px!important;object-fit:cover!important;background:#080808!important;display:block!important;}
      .reelMedia{aspect-ratio:4/5!important;}
      .reelBadge{background:#1d1d1d!important;color:var(--va-gold2)!important;border:1px solid #333!important;border-radius:999px!important;padding:6px 10px!important;}
      .stats,.pa{border-top:0!important;margin-top:11px!important;padding-top:0!important;color:#e8e8e8!important;display:flex!important;align-items:center!important;gap:10px!important;}
      .stats{justify-content:flex-start!important;}
      .pa{justify-content:space-between!important;border-top:1px solid #242424!important;padding-top:10px!important;}
      .pa button{background:transparent!important;color:#eaeaea!important;border:0!important;border-radius:12px!important;padding:9px 10px!important;}
      .pa button.liked{color:var(--va-gold2)!important;background:#251f0c!important;}
      .reelOpen{display:none!important;}

      /* ALT NAVİGASYON */
      .bottom{position:fixed!important;left:0!important;right:0!important;bottom:0!important;z-index:55!important;height:88px!important;min-height:88px!important;background:#090909f5!important;border-top:1px solid #272727!important;grid-template-columns:repeat(4,1fr)!important;padding:6px 8px 14px!important;box-sizing:border-box!important;backdrop-filter:blur(16px)!important;transform:none!important;}
      .bottom button,.bottom a{border:0!important;background:transparent!important;color:#a9a9a9!important;font-size:11px!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;gap:4px!important;min-width:0!important;text-decoration:none!important;padding:3px!important;}
      .bottom button span,.bottom a span{font-size:24px!important;line-height:1!important;display:block!important;}
      .bottom button.on,.bottom a.on{color:var(--va-gold2)!important;font-weight:800!important;}
      .bottom button[onclick*="reels.html"],.bottom a[href*="reels.html"]{display:none!important;}

      /* FORM / MODAL uyumu */
      .modal,.vitrinThemePanel,.vLangPanel{padding-top:28px!important;padding-bottom:90px!important;box-sizing:border-box!important;}
      .box,.vitrinThemeSheet,.vLangSheet{background:#151515!important;color:#fff!important;border:1px solid #2a2a2a!important;max-height:calc(100vh - 130px)!important;}
      input,textarea{background:#111!important;color:#fff!important;border-color:#333!important;}

      @supports(padding:max(0px)){
        .top{padding-top:max(30px,env(safe-area-inset-top))!important;height:calc(82px + max(30px,env(safe-area-inset-top)))!important;min-height:calc(82px + max(30px,env(safe-area-inset-top)))!important;}
        .bottom{height:calc(74px + max(14px,env(safe-area-inset-bottom)))!important;padding-bottom:max(14px,env(safe-area-inset-bottom))!important;}
        body{padding-bottom:calc(92px + max(14px,env(safe-area-inset-bottom)))!important;}
      }
    `;
    document.head.appendChild(style);
  }

  function textNorm(el){return (el?.textContent||'').trim().toLocaleLowerCase('tr-TR');}

  function markHomeLayout(){
    const headings=[...document.querySelectorAll('h1,h2,h3,h4,strong')];
    const kesfet=headings.find(el=>{const t=textNorm(el);return t==='keşfet'||t==='kesfet';});
    const storiesCard=kesfet?.closest('.card') || [...document.querySelectorAll('.card')].find(c=>/keşfet|kesfet/i.test(c.textContent||'')&&c.querySelector('.stories,.story'));
    if(storiesCard)storiesCard.classList.add('vAndroidStoriesCard');

    document.querySelectorAll('.compose').forEach(el=>{
      const card=el.closest('.card');
      if(card)card.classList.add('vAndroidHideComposer');
      else el.classList.add('vAndroidHideComposer');
    });
  }

  function ensureHamburger(){
    const top=document.querySelector('.top');
    const brand=top?.querySelector('.brand');
    if(!top||!brand||top.querySelector('.vAndroidMenuBtn'))return;
    const btn=document.createElement('button');
    btn.className='vAndroidMenuBtn';
    btn.type='button';
    btn.setAttribute('aria-label','Menü');
    btn.textContent='☰';
    btn.addEventListener('click',()=>{
      const globe=[...document.querySelectorAll('.topActions button,.topActions a')].find(el=>(el.textContent||'').includes('🌐'));
      if(globe)globe.click();
    });
    top.insertBefore(btn,brand);
  }

  function simplifyTopActions(){
    const actions=document.querySelector('.topActions');
    if(!actions)return;
    [...actions.children].forEach(el=>{
      const txt=(el.textContent||'').trim();
      const onclick=(el.getAttribute('onclick')||'').toLowerCase();
      const href=(el.getAttribute('href')||'').toLowerCase();
      const keep=txt.includes('🔎')||txt.includes('🔍')||txt.includes('🔔')||onclick.includes('notif')||onclick.includes('search')||href.includes('search')||el.querySelector('.badgeDot');
      if(keep)el.setAttribute('data-android-keep','1');
    });
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
    document.querySelectorAll('.reelOpen').forEach(el=>el.style.setProperty('display','none','important'));
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
      const session=(await sb.auth.getSession())?.data?.session;
      if(!session?.user?.id)return;
      const p=(await sb.from('profiles').select('avatar_url').eq('id',session.user.id).maybeSingle())?.data;
      if(!p?.avatar_url)return;
      document.querySelectorAll('.compose .av,.topActions a[href*="profile"],.topActions .reelsProfileTop,#profileBtn,.profile .big,.profile .av.big').forEach(el=>{
        if(!el.querySelector('img'))setAvatar(el,p.avatar_url,'Profil fotoğrafı');
      });
    }catch(e){}
  }

  function apply(){
    markHomeLayout();ensureHamburger();simplifyTopActions();keepDedicatedReelsHidden();
  }

  function init(){
    installStyles();apply();repairCurrentAvatar();
    [200,600,1200,2400].forEach(ms=>setTimeout(()=>{apply();repairCurrentAvatar();},ms));
    const mo=new MutationObserver(apply);mo.observe(document.body,{childList:true,subtree:true});
    setTimeout(()=>mo.disconnect(),15000);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
