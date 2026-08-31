(function(){
  const STYLE_ID='vitrinAndroidVisualRedesignV2';

  function installStyles(){
    if(document.getElementById(STYLE_ID)) return;
    const s=document.createElement('style');
    s.id=STYLE_ID;
    s.textContent=`
      :root{--va-bg:#070707;--va-card:#121212;--va-card2:#171717;--va-gold:#d7a62a;--va-gold2:#f3c653;--va-text:#f5f5f5;--va-muted:#a7a7a7;--va-line:#282828;}
      html,body{width:100%!important;max-width:100%!important;overflow-x:hidden!important;background:var(--va-bg)!important;color:var(--va-text)!important;}
      body{margin:0!important;padding:0 0 96px!important;font-family:system-ui,-apple-system,Segoe UI,sans-serif!important;}

      /* Gerçek Android üst kabuk */
      .top{position:sticky!important;top:0!important;z-index:60!important;height:92px!important;min-height:92px!important;padding:28px 16px 8px!important;background:#080808f6!important;border-bottom:1px solid #272727!important;backdrop-filter:blur(18px)!important;display:block!important;}
      .top>.brand,.top>.topActions{display:none!important;}
      .v2Top{height:56px;display:grid;grid-template-columns:44px 1fr auto auto;align-items:center;gap:10px;width:100%;}
      .v2Icon{width:42px;height:42px;border:0;background:transparent;color:#fff;display:grid;place-items:center;padding:0;font-size:29px;line-height:1;border-radius:50%;}
      .v2Logo{display:flex;align-items:baseline;gap:6px;min-width:0;white-space:nowrap;}
      .v2Logo b{font-size:26px;line-height:1;font-weight:950;letter-spacing:.6px;color:var(--va-gold2);}
      .v2Logo .tr{font-size:14px;font-weight:900;color:#e84141;}
      .v2Logo .flag{font-size:15px;}
      .v2Bell{position:relative;}
      .v2BellDot{position:absolute;right:3px;top:3px;width:9px;height:9px;background:#f06a2d;border-radius:50%;border:2px solid #080808;display:none;}
      .v2Bell.hasDot .v2BellDot{display:block;}

      /* Ana içerik */
      .wrap{width:100%!important;max-width:680px!important;margin:0 auto!important;padding:10px 14px 24px!important;}
      .card{background:linear-gradient(180deg,#151515,#101010)!important;border:1px solid #252525!important;border-radius:22px!important;box-shadow:0 8px 24px #0008!important;color:var(--va-text)!important;padding:15px!important;margin-bottom:13px!important;}
      .muted,.post .head small,.tiny,.hint{color:var(--va-muted)!important;}

      /* Referanstaki yatay hikaye şeridi */
      #home>.card:first-of-type,.v2StoriesCard{background:transparent!important;border:0!important;border-radius:0!important;box-shadow:none!important;padding:6px 0 10px!important;margin:0 0 4px!important;overflow:visible!important;}
      #home>.card:first-of-type>h2,.v2StoriesCard>h2{display:none!important;}
      #home>.card:first-of-type .stories,.v2StoriesCard .stories{display:flex!important;gap:14px!important;overflow-x:auto!important;overflow-y:hidden!important;padding:4px 2px 8px!important;margin:0!important;scrollbar-width:none!important;}
      #home>.card:first-of-type .stories::-webkit-scrollbar,.v2StoriesCard .stories::-webkit-scrollbar{display:none!important;}
      #home>.card:first-of-type .story,.v2StoriesCard .story{min-width:66px!important;width:66px!important;text-align:center!important;color:#eee!important;padding:0!important;}
      #home>.card:first-of-type .ring,.v2StoriesCard .ring{width:60px!important;height:60px!important;border-radius:50%!important;border:2.5px solid var(--va-gold)!important;background:#171717!important;box-shadow:0 0 0 2px #080808!important;font-size:25px!important;display:grid!important;place-items:center!important;overflow:hidden!important;}
      #home>.card:first-of-type .ring img,.v2StoriesCard .ring img{width:100%!important;height:100%!important;object-fit:cover!important;border-radius:50%!important;}
      #home>.card:first-of-type .story small,.v2StoriesCard .story small{display:block!important;margin-top:6px!important;color:#eee!important;font-size:11px!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;}

      /* Referansta ayrı 'Ne düşünüyorsun?' kartı yok */
      #home>.compose,.v2HideComposer{display:none!important;}

      /* Gönderi kartları */
      #feed{margin-top:2px!important;}
      .post,.reelFeedCard{background:linear-gradient(180deg,#151515,#101010)!important;border:1px solid #252525!important;border-radius:22px!important;padding:15px!important;margin-bottom:13px!important;box-shadow:0 8px 24px #0008!important;overflow:hidden!important;}
      .post .head,.reelFeedCard .head{display:flex!important;align-items:center!important;gap:10px!important;margin-bottom:10px!important;}
      .post .av,.reelFeedCard .av{width:46px!important;height:46px!important;flex:0 0 46px!important;border-radius:50%!important;background:#222!important;overflow:hidden!important;}
      .post h3,.reelFeedCard h3{font-size:16px!important;line-height:1.2!important;font-weight:850!important;color:#fff!important;}
      .post .head small,.reelFeedCard .head small{font-size:12px!important;color:#9d9d9d!important;}
      .post p,.reelFeedCard>p{font-size:15px!important;line-height:1.45!important;color:#f1f1f1!important;margin:9px 0 12px!important;}
      .media,.reelMedia{width:100%!important;border-radius:16px!important;background:#080808!important;display:block!important;object-fit:cover!important;}
      .media{max-height:520px!important;}
      .reelMedia{aspect-ratio:4/5!important;max-height:none!important;}
      .reelBadge{display:inline-flex!important;align-items:center!important;background:#1c1c1c!important;color:var(--va-gold2)!important;border:1px solid #333!important;border-radius:999px!important;padding:5px 9px!important;font-size:12px!important;font-weight:800!important;}
      .stats{display:none!important;}
      .pa{display:flex!important;align-items:center!important;justify-content:flex-start!important;gap:6px!important;border-top:0!important;padding:8px 0 0!important;margin-top:0!important;}
      .pa button{border:0!important;background:transparent!important;color:#ededed!important;border-radius:10px!important;padding:8px 10px!important;font-size:13px!important;}
      .pa button.liked{color:var(--va-gold2)!important;background:#251f0d!important;}
      .v2Bookmark{margin-left:auto!important;font-size:22px!important;padding-right:2px!important;}
      .reelOpen{display:none!important;}

      /* Dört bölümlü sabit alt menü */
      .bottom{position:fixed!important;left:0!important;right:0!important;bottom:0!important;z-index:70!important;height:78px!important;min-height:78px!important;background:#090909f7!important;border-top:1px solid #282828!important;display:grid!important;grid-template-columns:repeat(4,1fr)!important;padding:5px 6px 10px!important;backdrop-filter:blur(18px)!important;}
      .bottom .v2NavBtn{border:0!important;background:transparent!important;color:#a7a7a7!important;font-size:10px!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;gap:3px!important;min-width:0!important;padding:2px!important;}
      .bottom .v2NavBtn span{font-size:22px!important;line-height:1!important;display:block!important;}
      .bottom .v2NavBtn.on{color:var(--va-gold2)!important;font-weight:850!important;}

      /* Diğer sayfalar yeni temada kalsın */
      .rooms,.trend,.profile,.msgCard,.chatPanel{color:#fff!important;}
      .room,.trend button,.outline,.pa button{color:#eee!important;}
      .room{background:#151515!important;border-color:#303030!important;}
      .modal,.vitrinThemePanel,.vLangPanel{padding-top:28px!important;padding-bottom:86px!important;box-sizing:border-box!important;}
      .box,.vitrinThemeSheet,.vLangSheet{background:#151515!important;color:#fff!important;border:1px solid #2b2b2b!important;max-height:calc(100vh - 128px)!important;}
      input,textarea{background:#111!important;color:#fff!important;border-color:#333!important;}

      @supports(padding:max(0px)){
        .top{padding-top:max(28px,env(safe-area-inset-top))!important;height:calc(64px + max(28px,env(safe-area-inset-top)))!important;min-height:calc(64px + max(28px,env(safe-area-inset-top)))!important;}
        .bottom{height:calc(66px + max(12px,env(safe-area-inset-bottom)))!important;padding-bottom:max(12px,env(safe-area-inset-bottom))!important;}
        body{padding-bottom:calc(80px + max(12px,env(safe-area-inset-bottom)))!important;}
      }
    `;
    document.head.appendChild(s);
  }

  function buildTop(){
    const top=document.querySelector('.top');
    if(!top||top.querySelector('.v2Top')) return;
    const shell=document.createElement('div');
    shell.className='v2Top';
    shell.innerHTML=`<button class="v2Icon v2Menu" type="button" aria-label="Menü">☰</button><div class="v2Logo"><b>VİTRİN</b><span class="tr">TR</span><span class="flag">🇹🇷</span></div><button class="v2Icon v2Search" type="button" aria-label="Ara">⌕</button><button class="v2Icon v2Bell" type="button" aria-label="Bildirimler">♧<span class="v2BellDot"></span></button>`;
    top.appendChild(shell);
    shell.querySelector('.v2Search').onclick=()=>document.getElementById('searchBtn')?.click();
    shell.querySelector('.v2Bell').onclick=()=>document.getElementById('notifBtn')?.click();
    shell.querySelector('.v2Menu').onclick=()=>{
      const globe=[...document.querySelectorAll('button,a')].find(el=>(el.textContent||'').includes('🌐'));
      if(globe) globe.click();
    };
    syncBell();
  }

  function syncBell(){
    const old=document.getElementById('notifBadge');
    const bell=document.querySelector('.v2Bell');
    if(!old||!bell) return;
    const has=!old.hidden && String(old.textContent||'').trim()!=='0' && String(old.textContent||'').trim()!=='';
    bell.classList.toggle('hasDot',has);
  }

  function buildBottom(){
    const nav=document.querySelector('.bottom');
    if(!nav||nav.dataset.v2==='1') return;
    nav.dataset.v2='1';
    nav.innerHTML=`<button class="v2NavBtn on" data-r="home"><span>⌂</span>Ana Akış</button><button class="v2NavBtn" data-r="agenda"><span>♨</span>Gündem</button><button class="v2NavBtn" data-r="rooms"><span>V</span>V Sosyal</button><button class="v2NavBtn" data-r="profile"><span>♙</span>Profil</button>`;
    const active=location.hash.slice(1)||'home';
    nav.querySelectorAll('[data-r]').forEach(b=>b.classList.toggle('on',b.dataset.r===active));
  }

  function polishStories(){
    const card=document.querySelector('#home>.card:first-of-type');
    if(card) card.classList.add('v2StoriesCard');
    const compose=document.querySelector('#home>.compose');
    if(compose) compose.classList.add('v2HideComposer');
    const stories=card?.querySelector('.stories');
    if(stories){
      const items=[...stories.querySelectorAll('.story')];
      if(items[0]){
        const sm=items[0].querySelector('small');
        if(sm) sm.textContent='Sen';
      }
      if(items[1]){const sm=items[1].querySelector('small');if(sm)sm.textContent='Merve';}
      if(items[2]){const sm=items[2].querySelector('small');if(sm)sm.textContent='Ahmet';}
      if(items[3]){const sm=items[3].querySelector('small');if(sm)sm.textContent='Seda';}
      if(items[4]){const sm=items[4].querySelector('small');if(sm)sm.textContent='Ekle';const r=items[4].querySelector('.ring');if(r)r.textContent='＋';}
    }
  }

  function polishPosts(){
    document.querySelectorAll('.post,.reelFeedCard').forEach(card=>{
      const pa=card.querySelector('.pa');
      if(pa&&!pa.querySelector('.v2Bookmark')){
        const b=document.createElement('button');
        b.type='button';b.className='v2Bookmark';b.textContent='♡';b.title='Kaydet';
        b.onclick=()=>b.textContent=b.textContent==='♡'?'♥':'♡';
        pa.appendChild(b);
      }
    });
  }

  function repairAvatar(){
    document.querySelectorAll('.av').forEach(el=>{if(el.textContent.trim()==='?')el.textContent='👤';});
  }

  function apply(){buildTop();buildBottom();polishStories();polishPosts();repairAvatar();syncBell();}

  function init(){
    installStyles();apply();
    [180,500,1000,1800,3000].forEach(ms=>setTimeout(apply,ms));
    const mo=new MutationObserver(apply);mo.observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['hidden','class']});
    setTimeout(()=>mo.disconnect(),20000);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
