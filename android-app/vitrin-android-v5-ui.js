(function(){
  const ID='vitrinAndroidV5UiFix';
  if(document.getElementById(ID)) return;
  const style=document.createElement('style');
  style.id=ID;
  style.textContent=`
  :root{--v5-bg:#070707;--v5-card:#101010;--v5-line:#242424;--v5-gold:#efbd4f;--v5-text:#f7f7f7;--v5-muted:#9d9d9d}
  html,body{background:var(--v5-bg)!important;color:var(--v5-text)!important;overflow-x:hidden!important}

  /* ÜST BAR: solda menü + VİTRİN, sağda dil/arama/bildirim */
  html body .top{height:82px!important;min-height:82px!important;padding:20px 14px 9px!important;background:#080808f8!important;border-bottom:1px solid #202020!important;display:flex!important;align-items:center!important;gap:8px!important;overflow:visible!important}
  html body .vAndroidMenuBtn{display:grid!important;width:34px!important;height:34px!important;flex:0 0 34px!important;place-items:center!important;margin:0 2px 0 0!important;font-size:27px!important}
  html body .top .brand{display:flex!important;align-items:center!important;flex:0 1 auto!important;min-width:0!important;max-width:150px!important;margin-right:auto!important;overflow:visible!important}
  html body .top .brand>*{display:none!important}
  html body .top .brand:before{content:'VİTRİN'!important;color:var(--v5-gold)!important;font:900 24px/1 system-ui,sans-serif!important;letter-spacing:.2px!important;white-space:nowrap!important}
  html body .top .brand:after{content:' TR 🇹🇷'!important;color:#e23a3a!important;font:800 11px/1 system-ui,sans-serif!important;margin-left:5px!important;white-space:nowrap!important}
  html body .topActions{display:flex!important;align-items:center!important;justify-content:flex-end!important;gap:5px!important;margin-left:auto!important;flex:0 0 auto!important}
  html body .topActions>*{display:none!important}
  html body .topActions .v5Lang,html body .topActions .v5Search,html body .topActions .v5Notif{display:grid!important}
  html body .topActions .v5Lang,html body .topActions .v5Search,html body .topActions .v5Notif{width:36px!important;height:36px!important;place-items:center!important;background:transparent!important;border:0!important;border-radius:50%!important;padding:0!important;color:#fff!important;box-shadow:none!important;overflow:visible!important}
  html body .topActions .v5Lang{font-size:23px!important}
  html body .topActions .v5Search{font-size:0!important}
  html body .topActions .v5Search:before{content:'⌕'!important;font-size:29px!important;line-height:1!important;color:#fff!important}
  html body .topActions .v5Notif{font-size:0!important;position:relative!important}
  html body .topActions .v5Notif:before{content:'🔔'!important;font-size:22px!important;line-height:1!important}
  html body .topActions .badgeDot{display:grid!important}
  html body .v5Gone{display:none!important}

  /* HİKÂYELER */
  html body .wrap{max-width:none!important;width:100%!important;padding:6px 0 28px!important;margin:0!important}
  html body .vAndroidStoriesCard,html body #home>.card:first-of-type{padding:8px 14px 10px!important;margin:0!important;max-height:102px!important;background:#080808!important;border:0!important;border-radius:0!important;box-shadow:none!important;overflow:hidden!important}
  html body .vAndroidStoriesCard .stories,html body #home>.card:first-of-type .stories{gap:12px!important;padding:0!important;overflow-x:auto!important;overflow-y:hidden!important}
  html body .vAndroidStoriesCard .story,html body #home>.card:first-of-type .story{width:61px!important;min-width:61px!important}
  html body .vAndroidStoriesCard .ring,html body #home>.card:first-of-type .ring{width:56px!important;height:56px!important;border:2px solid var(--v5-gold)!important}

  /* ANA AKIŞ: ekran genişliğini kullanan doğal dikey akış */
  html body #feed{width:100%!important;margin:0!important;padding:0!important}
  html body #feed>.card,html body #feed .post,html body #feed .reelFeedCard{width:100%!important;max-width:none!important;margin:0 0 10px!important;padding:0!important;border-left:0!important;border-right:0!important;border-radius:0!important;background:var(--v5-card)!important;box-shadow:none!important;border-top:1px solid var(--v5-line)!important;border-bottom:1px solid var(--v5-line)!important;overflow:hidden!important}
  html body #feed .head{padding:12px 14px 7px!important;margin:0!important;min-height:48px!important}
  html body #feed .head .av{width:43px!important;height:43px!important;flex:0 0 43px!important}
  html body #feed .head h3{font-size:16px!important}
  html body #feed .head small{font-size:12px!important}
  html body #feed .reelBadge{margin:4px 14px 6px!important}
  html body #feed .reelFeedCard>p,html body #feed .post>p{padding:0 14px!important;margin:7px 0 10px!important}
  html body #feed .media,html body #feed .reelMedia,html body #feed video,html body #feed img.media{width:100vw!important;max-width:100vw!important;margin:0!important;margin-left:calc(50% - 50vw)!important;border-radius:0!important;display:block!important;background:#000!important;object-fit:cover!important}
  html body #feed .reelMedia{aspect-ratio:9/16!important;max-height:none!important;min-height:calc(100dvh - 230px)!important}
  html body #feed .stats{padding:8px 14px 2px!important;margin:0!important;gap:18px!important}
  html body #feed .pa{padding:5px 10px 8px!important;margin:0!important;border-top:1px solid #202020!important}
  html body #feed .pa button{padding:8px 4px!important}

  /* ALT NAV: dört öğe, aynı boyut ve hizalama */
  html body .bottom{height:82px!important;min-height:82px!important;display:grid!important;grid-template-columns:repeat(4,1fr)!important;align-items:stretch!important;left:0!important;right:0!important;bottom:0!important;padding:4px 6px 12px!important;background:#080808fb!important;border-top:1px solid #242424!important;transform:none!important;box-sizing:border-box!important}
  html body .bottom .v5Nav{display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;gap:4px!important;color:#a5a5a5!important;background:transparent!important;border:0!important;font-size:0!important;padding:0!important;min-width:0!important;text-decoration:none!important}
  html body .bottom .v5Nav:before{display:block!important;font-size:24px!important;line-height:1!important;color:inherit!important}
  html body .bottom .v5Nav:after{display:block!important;font:11px/1.1 system-ui,sans-serif!important;color:inherit!important;white-space:nowrap!important}
  html body .bottom .v5Home:before{content:'⌂'!important} html body .bottom .v5Home:after{content:'Ana Akış'!important}
  html body .bottom .v5Trend:before{content:'🔥'!important} html body .bottom .v5Trend:after{content:'Gündem'!important}
  html body .bottom .v5Social:before{content:'V'!important;font:900 27px/1 Georgia,serif!important;color:inherit!important} html body .bottom .v5Social:after{content:'V Sosyal'!important}
  html body .bottom .v5Profile:before{content:'♙'!important} html body .bottom .v5Profile:after{content:'Profil'!important}
  html body .bottom .v5Nav.on{color:var(--v5-gold)!important;font-weight:800!important}
  html body .bottom .v5HideNav{display:none!important}

  @supports(padding:max(0px)){
    html body .top{padding-top:max(20px,env(safe-area-inset-top))!important;height:calc(62px + max(20px,env(safe-area-inset-top)))!important;min-height:calc(62px + max(20px,env(safe-area-inset-top)))!important}
    html body .bottom{height:calc(68px + max(12px,env(safe-area-inset-bottom)))!important;padding-bottom:max(12px,env(safe-area-inset-bottom))!important}
    html body{padding-bottom:calc(78px + max(12px,env(safe-area-inset-bottom)))!important}
  }
  `;
  document.head.appendChild(style);

  const txt=(el)=>(el?.textContent||'').trim().toLocaleLowerCase('tr-TR');
  function classifyTop(){
    const actions=document.querySelector('.topActions'); if(!actions) return;
    [...actions.children].forEach(el=>{
      el.classList.remove('v5Lang','v5Search','v5Notif','v5Gone');
      const t=txt(el), href=(el.getAttribute('href')||'').toLowerCase(), oc=(el.getAttribute('onclick')||'').toLowerCase();
      const hasImg=!!el.querySelector('img');
      if(t.includes('🌐')||t.includes('dil')||oc.includes('lang')||oc.includes('language')) el.classList.add('v5Lang');
      else if(t.includes('🔎')||t.includes('🔍')||el.id==='searchBtn'||oc.includes('search')||href.includes('search')) el.classList.add('v5Search');
      else if(t.includes('🔔')||el.querySelector('#notifBtn')||el.id==='notifBtn'||oc.includes('notif')||el.querySelector('.badgeDot')) el.classList.add('v5Notif');
      else if(t.includes('🎨')||t.includes('tema')||t.includes('renk')||hasImg||href.includes('profile')||oc.includes('profile')) el.classList.add('v5Gone');
      else el.classList.add('v5Gone');
    });
  }

  function classifyNav(){
    const all=[...document.querySelectorAll('.bottom button,.bottom a')];
    all.forEach(el=>{el.classList.remove('v5Nav','v5Home','v5Trend','v5Social','v5Profile','v5HideNav');
      const t=txt(el), dr=(el.getAttribute('data-r')||'').toLowerCase(), href=(el.getAttribute('href')||'').toLowerCase(), oc=(el.getAttribute('onclick')||'').toLowerCase();
      if(t.includes('reels')||href.includes('reels.html')||oc.includes('reels.html')){el.classList.add('v5HideNav');return;}
      el.classList.add('v5Nav');
      if(t.includes('ana akış')||t.includes('ana akis')||dr==='home'||oc.includes("go('home")||oc.includes('home')) el.classList.add('v5Home');
      else if(t.includes('gündem')||t.includes('gundem')||dr==='trend'||dr==='gundem'||oc.includes('gundem')) el.classList.add('v5Trend');
      else if(t.includes('sosyal')||dr==='rooms'||oc.includes('rooms')) el.classList.add('v5Social');
      else if(t.includes('profil')||dr==='profile'||href.includes('profile')||oc.includes('profile')) el.classList.add('v5Profile');
    });
  }
  function apply(){classifyTop();classifyNav();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true}); else apply();
  [200,600,1200,2500].forEach(ms=>setTimeout(apply,ms));
  const mo=new MutationObserver(apply); mo.observe(document.body,{childList:true,subtree:true}); setTimeout(()=>mo.disconnect(),15000);
})();
