(function(){
  const id='vitrinAndroidV4Polish';
  if(document.getElementById(id)) return;
  const s=document.createElement('style');
  s.id=id;
  s.textContent=`
  :root{--v4-bg:#070707;--v4-card:#141414;--v4-card2:#101010;--v4-line:#252525;--v4-gold:#efbd4f;--v4-text:#f7f7f7;--v4-muted:#aaa}
  html body{background:var(--v4-bg)!important;color:var(--v4-text)!important;overflow-x:hidden!important;padding-bottom:92px!important}

  /* ÜST BAR */
  html body .top{height:86px!important;min-height:86px!important;padding:22px 18px 10px!important;background:#080808f7!important;border-bottom:1px solid #1e1e1e!important;box-shadow:none!important;display:flex!important;align-items:center!important;gap:8px!important}
  html body .vAndroidMenuBtn{width:36px!important;height:36px!important;flex:0 0 36px!important;font-size:28px!important;margin-right:3px!important}
  html body .top .brand{display:flex!important;align-items:center!important;gap:0!important;flex:1 1 auto!important;min-width:0!important;overflow:visible!important}
  html body .top .brand>*{display:none!important}
  html body .top .brand:before{content:'VİTRİN'!important;color:var(--v4-gold)!important;font:900 27px/1 system-ui,sans-serif!important;letter-spacing:.3px!important;display:block!important}
  html body .top .brand:after{content:'  TR 🇹🇷'!important;color:#e53c3c!important;font:800 13px/1 system-ui,sans-serif!important;margin-left:6px!important;display:block!important}
  html body .topActions{display:flex!important;align-items:center!important;gap:5px!important}
  html body .topActions>*{display:none!important}
  html body .topActions #searchBtn,html body .topActions .ibWrap:has(#notifBtn){display:block!important}
  html body #searchBtn,html body #notifBtn{width:36px!important;height:36px!important;background:transparent!important;border:0!important;color:#fff!important;padding:0!important;border-radius:50%!important}
  html body #searchBtn:before{font-size:29px!important}
  html body #notifBtn:before{font-size:25px!important}

  /* ANA GÖVDE */
  html body .wrap{width:100%!important;max-width:680px!important;padding:10px 12px 28px!important;margin:0 auto!important;box-sizing:border-box!important}

  /* KEŞFET / HİKÂYE ALANI */
  html body #home>.card:first-of-type,html body .vAndroidStoriesCard{background:transparent!important;border:0!important;border-radius:0!important;box-shadow:none!important;padding:2px 0 8px!important;margin:0 0 5px!important;min-height:0!important;height:auto!important;max-height:105px!important;overflow:hidden!important}
  html body #home>.card:first-of-type h1,html body #home>.card:first-of-type h2,html body #home>.card:first-of-type h3,html body #home>.card:first-of-type h4,html body .vAndroidStoriesCard>h1,html body .vAndroidStoriesCard>h2,html body .vAndroidStoriesCard>h3,html body .vAndroidStoriesCard>h4{display:none!important}
  html body #home>.card:first-of-type .stories,html body .vAndroidStoriesCard .stories{display:flex!important;gap:13px!important;overflow-x:auto!important;overflow-y:hidden!important;align-items:flex-start!important;padding:3px 2px 7px!important;margin:0!important;scrollbar-width:none!important}
  html body #home>.card:first-of-type .stories::-webkit-scrollbar,html body .vAndroidStoriesCard .stories::-webkit-scrollbar{display:none!important}
  html body #home>.card:first-of-type .story,html body .vAndroidStoriesCard .story{width:62px!important;min-width:62px!important;padding:0!important;margin:0!important;text-align:center!important}
  html body #home>.card:first-of-type .ring,html body .vAndroidStoriesCard .ring{width:58px!important;height:58px!important;border:2px solid var(--v4-gold)!important;border-radius:50%!important;background:#171717!important;box-shadow:0 0 0 2px #070707!important;overflow:hidden!important;display:grid!important;place-items:center!important}
  html body #home>.card:first-of-type .story small,html body .vAndroidStoriesCard .story small{font-size:11px!important;color:#ddd!important;margin-top:5px!important;display:block!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}

  /* yazı oluştur kutusunu ana akıştan kaldır */
  html body #home>.compose,html body .vAndroidHideComposer{display:none!important}

  /* GÖNDERİLER - referans görseldeki kompakt kart */
  html body #feed>.card,html body #feed .post,html body #feed .reelFeedCard{background:linear-gradient(180deg,#151515,#101010)!important;border:1px solid var(--v4-line)!important;border-radius:20px!important;box-shadow:0 7px 22px #0006!important;padding:12px!important;margin:0 0 12px!important;overflow:hidden!important}
  html body #feed .head{display:flex!important;align-items:center!important;gap:9px!important;margin:0 0 8px!important;min-height:42px!important}
  html body #feed .head .av{width:42px!important;height:42px!important;flex:0 0 42px!important;border-radius:50%!important;overflow:hidden!important}
  html body #feed .head h3{font-size:15px!important;line-height:1.2!important;margin:0!important;font-weight:800!important}
  html body #feed .head small{font-size:11px!important;color:var(--v4-muted)!important}
  html body #feed .post>p,html body #feed .reelFeedCard>p{font-size:14px!important;line-height:1.4!important;color:#eee!important;margin:7px 1px 10px!important}
  html body #feed .media,html body #feed img.media,html body #feed video.media{width:100%!important;max-width:100%!important;border-radius:14px!important;background:#050505!important;display:block!important;object-fit:cover!important;margin:0!important}
  html body #feed .reelMedia{width:100%!important;max-width:100%!important;aspect-ratio:9/12!important;max-height:610px!important;border-radius:14px!important;background:#050505!important;object-fit:cover!important;display:block!important;margin:0!important}
  html body #feed .reelBadge{font-size:10px!important;padding:4px 7px!important;border-radius:999px!important;background:#1a1a1a!important;color:var(--v4-gold)!important;border:1px solid #2d2d2d!important}

  /* ETKİLEŞİMİ TEK SADE ALANA TOPLA */
  html body #feed .stats{display:flex!important;align-items:center!important;gap:18px!important;justify-content:flex-start!important;margin:8px 2px 0!important;padding:0!important;border:0!important;color:#ddd!important;font-size:12px!important;min-height:24px!important}
  html body #feed .pa{display:flex!important;align-items:center!important;justify-content:space-between!important;gap:4px!important;margin:4px 0 0!important;padding:4px 0 0!important;border-top:1px solid #202020!important;background:transparent!important}
  html body #feed .pa button{flex:1 1 0!important;min-width:0!important;background:transparent!important;border:0!important;color:#ddd!important;border-radius:9px!important;padding:7px 4px!important;font-size:12px!important;box-shadow:none!important}
  html body #feed .pa button.liked{color:var(--v4-gold)!important;background:#211b0d!important}
  html body #feed .reelOpen{display:none!important}

  /* ALT NAVİGASYON */
  html body .bottom{height:78px!important;min-height:78px!important;left:0!important;right:0!important;bottom:0!important;position:fixed!important;z-index:80!important;background:#090909fa!important;border-top:1px solid #242424!important;grid-template-columns:repeat(4,1fr)!important;padding:5px 8px 10px!important;transform:none!important;box-sizing:border-box!important}
  html body .bottom button,html body .bottom a{display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;gap:3px!important;background:transparent!important;border:0!important;color:#9e9e9e!important;padding:2px!important;font-size:10px!important;min-width:0!important;text-decoration:none!important}
  html body .bottom button span,html body .bottom a span{font-size:21px!important;line-height:1!important}
  html body .bottom button.on,html body .bottom a.on{color:var(--v4-gold)!important;font-weight:800!important}
  html body .bottom button[onclick*='reels.html'],html body .bottom a[href*='reels.html']{display:none!important}
  html body .bottom button[data-r='rooms'] span{font-size:0!important}
  html body .bottom button[data-r='rooms'] span:after{content:'V'!important;font:900 25px/1 Georgia,serif!important;color:inherit!important}
  html body .bottom button[data-r='rooms']{font-size:0!important}
  html body .bottom button[data-r='rooms']:after{content:'V Sosyal'!important;font:10px/1.1 system-ui,sans-serif!important;color:inherit!important}

  /* profil / gündem / sosyal sayfalarının işlevlerini bozma, yalnız çerçeveyi sakinleştir */
  html body .modal .box,html body .vitrinThemeSheet,html body .vLangSheet{background:#141414!important;color:#fff!important;border:1px solid #2a2a2a!important;border-radius:20px!important}

  @supports(padding:max(0px)){
    html body .top{padding-top:max(22px,env(safe-area-inset-top))!important;height:calc(64px + max(22px,env(safe-area-inset-top)))!important;min-height:calc(64px + max(22px,env(safe-area-inset-top)))!important}
    html body .bottom{height:calc(66px + max(10px,env(safe-area-inset-bottom)))!important;padding-bottom:max(10px,env(safe-area-inset-bottom))!important}
    html body{padding-bottom:calc(78px + max(10px,env(safe-area-inset-bottom)))!important}
  }
  `;
  document.head.appendChild(s);
})();
