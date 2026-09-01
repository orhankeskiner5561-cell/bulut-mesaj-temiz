(function(){
  'use strict';
  const ID='vitrinAndroidV31CleanSocialCore';
  if(document.getElementById(ID)) return;

  const THEMES={
    gold:['#D4AF37','#8a6500','#070707','#11100c'],red:['#e53935','#8b1010','#160606','#220909'],blue:['#2196f3','#0d4f8b','#061525','#0b1d31'],green:['#22a65a','#0c6b35','#06170d','#0a2313'],purple:['#8e5ce6','#4a238c','#130a22','#1b102d'],orange:['#ff8a00','#a45100','#241200','#2f1803'],pink:['#e75480','#9f2f55','#250a14','#30101b'],cyan:['#00bcd4','#087687','#051c21','#09262c'],white:['#f5f5f5','#bdbdbd','#171717','#202020'],gray:['#9e9e9e','#616161','#101010','#191919'],black:['#555555','#222222','#030303','#0b0b0b'],
    galatasaray:['#f7c500','#a71930','#190609','#2b0b10'],fenerbahce:['#f7df00','#173b72','#071326','#0b1e38'],besiktas:['#f5f5f5','#111111','#050505','#111111'],trabzonspor:['#7a263a','#5bbbe7','#10070a','#17232a'],samsunspor:['#d71920','#ffffff','#170506','#230a0b'],basaksehir:['#f58220','#17365d','#0d1420','#171d29'],bursaspor:['#0f8a3d','#ffffff','#06150c','#0b2012'],konyaspor:['#1f9d55','#ffffff','#06170e','#0b2214'],goztepe:['#d71920','#f7c500','#1b0903','#28110a'],adanademir:['#68b7e8','#103b66','#07121d','#0b1b2b'],sivasspor:['#d71920','#ffffff','#170506','#230a0b'],kasimpasa:['#2c8ad8','#ffffff','#071522','#0c2030'],antalyaspor:['#d71920','#ffffff','#170506','#230a0b'],kayserispor:['#d71920','#f3c300','#1b0903','#28110a'],rizespor:['#2a78c8','#19a463','#06151a','#0b2224']
  };

  const style=document.createElement('style');
  style.id=ID;
  style.textContent=`
    :root{--v31-accent:#D4AF37;--v31-accent2:#8a6500;--v31-bg:#070707;--v31-surface:#11100c;--v31-soft:#1b170d;--v31-line:#5b4716}
    html,body{background:var(--v31-bg)!important;color:#fff!important}
    html body .top,html body .v10SideMenu,html body .v12SettingsPage,html body .v21Panel,html body .v22Sheet,html body .v22Top{background:var(--v31-bg)!important;border-color:var(--v31-line)!important}
    html body #feed>.card,html body #feed .post,html body #feed .reelFeedCard,html body .vAndroidStoriesCard,html body #home>.card:first-of-type{background:var(--v31-surface)!important;border-color:var(--v31-line)!important}
    html body .v7BottomShell{background:var(--v31-bg)!important;border-top-color:var(--v31-line)!important}
    html body .v21Member,html body .v21Lang,html body .v21Theme,html body .v22Lang,html body .v22Theme,html body .v10MenuItem:active{background:var(--v31-soft)!important;border-color:var(--v31-line)!important}
    html body .v21Theme.on,html body .v22Theme.on,html body .v21Lang.on,html body .v22Lang.on{border-color:var(--v31-accent)!important;color:var(--v31-accent)!important;outline-color:var(--v31-accent)!important}
    html body .v10MenuTitle,html body .v22Top h2,html body .v22SectionTitle{color:var(--v31-accent)!important}
    html body .v8ReelOverlay .v8Brand,html body .v7GoldV,html body .vitrinBrand,html body .vitrinName,html body .vitrinV{color:#D4AF37!important;-webkit-text-fill-color:#D4AF37!important}
    .v21Sheet[data-v31-member-sheet="1"] .v21Members:empty{min-height:0!important}
    .v21Sheet[data-v31-member-sheet="1"] .v21Member{width:100%!important;text-align:left!important;cursor:pointer!important}
    #sm #sr:empty{min-height:0!important}
    #home .stories{padding:8px 8px 10px!important;gap:10px!important}
    #home .story{min-width:72px!important;max-width:72px!important}
    #home .story .ring{width:64px!important;height:64px!important;padding:2px!important;border-radius:50%!important;background:transparent!important;border:3px solid #aeb4bc!important;box-shadow:none!important;display:grid!important;place-items:center!important;position:relative!important}
    #home .story[data-story-user] .ring,#home .story.v31HasStory .ring{border-color:#2f8cff!important}
    #home .story .ringInner{width:54px!important;height:54px!important;border:0!important;border-radius:50%!important;background:#f2f3f5!important;overflow:hidden!important;display:grid!important;place-items:center!important}
    #home .story .ringInner img{width:100%!important;height:100%!important;object-fit:cover!important}
    #home .story .onlineDot{width:13px!important;height:13px!important;border-radius:50%!important;background:#20c76f!important;border:2px solid #fff!important;right:-1px!important;bottom:4px!important}
    #home .story .addDot{width:19px!important;height:19px!important;border-radius:50%!important;right:-2px!important;bottom:-1px!important;background:#2f8cff!important;color:#fff!important;border:2px solid #fff!important;font-size:15px!important;line-height:1!important;display:grid!important;place-items:center!important;font-weight:900!important}
    #bulutStoryCreate{position:fixed!important;inset:0!important;z-index:2147483500!important;background:#fff!important;color:#17243a!important;overflow:auto!important;backdrop-filter:none!important}
    #bulutStoryCreate.on{display:block!important}
    #bulutStoryCreate .storyCreateBox{position:relative!important;left:auto!important;top:auto!important;transform:none!important;width:100%!important;min-height:100%!important;max-width:none!important;background:#fff!important;border-radius:0!important;padding:72px 20px 28px!important;color:#17243a!important;box-shadow:none!important;box-sizing:border-box!important}
    #bulutStoryCreateClose{display:grid!important;place-items:center!important;position:absolute!important;left:12px!important;top:14px!important;right:auto!important;width:46px!important;height:46px!important;min-width:46px!important;min-height:46px!important;padding:0!important;margin:0!important;border:0!important;border-radius:50%!important;background:rgba(255,255,255,.98)!important;color:#17243a!important;font-size:38px!important;font-weight:500!important;line-height:1!important;box-shadow:0 1px 5px rgba(0,0,0,.08)!important;opacity:1!important;visibility:visible!important;pointer-events:auto!important;z-index:2147483600!important}
    #bulutStoryCreate .storyCreateBtns{grid-template-columns:1fr 1fr!important;gap:12px!important;margin:18px 0!important}
    #bulutStoryCreate .storyCreateBtns button{min-height:112px!important;border:1px solid #e6ebf1!important;border-radius:18px!important;background:#f7f9fc!important;color:#101723!important;font-size:17px!important;font-weight:800!important}
    #bulutStoryCreate textarea{width:100%!important;min-height:130px!important;border:1px solid #dfe4ea!important;border-radius:16px!important;background:#fff!important;color:#111827!important;padding:14px!important;font-size:17px!important;box-sizing:border-box!important}
    #goog-gt-tt,.goog-te-balloon-frame,.goog-te-banner-frame,iframe.goog-te-banner-frame,.VIpgJd-ZVi9od-ORHb-OEVmcd,.VIpgJd-yAWNEb-L7lbkb,.VIpgJd-yAWNEb-VIpgJd-fmcmS-sn54Q,.VIpgJd-suEOdc,.goog-text-highlight,body>iframe[src*="translate.google"],body>iframe[src*="translate.googleapis"],body>div[id^="goog-gt-"]{display:none!important;visibility:hidden!important;opacity:0!important;pointer-events:none!important;width:0!important;height:0!important;max-width:0!important;max-height:0!important;overflow:hidden!important}
    html,body{top:0!important;margin-top:0!important}.goog-text-highlight{background:transparent!important;box-shadow:none!important}
  `;
  document.head.appendChild(style);

  function themeKey(){try{return localStorage.getItem('vitrin_theme_v21')||document.documentElement.dataset.vitrinTheme||'gold'}catch(_e){return 'gold'}}
  function applyTheme(key){
    const t=THEMES[key]||THEMES.gold,r=document.documentElement;
    r.dataset.vitrinTheme=key;
    r.style.setProperty('--v31-accent',t[0]);r.style.setProperty('--v31-accent2',t[1]);r.style.setProperty('--v31-bg',t[2]);r.style.setProperty('--v31-surface',t[3]);
    r.style.setProperty('--v31-line',`color-mix(in srgb, ${t[0]} 42%, #2b2b2b)`);r.style.setProperty('--v31-soft',`color-mix(in srgb, ${t[0]} 13%, ${t[3]})`);
    r.style.setProperty('--vt-accent',t[0]);r.style.setProperty('--vt-accent2',t[1]);r.style.setProperty('--vt-bg',t[2]);r.style.setProperty('--vt-surface',t[3]);r.style.setProperty('--vt-surface2',`color-mix(in srgb, ${t[0]} 12%, ${t[3]})`);r.style.setProperty('--vt-line',`color-mix(in srgb, ${t[0]} 42%, #2b2b2b)`);r.style.setProperty('--vt-text','#fff');r.style.setProperty('--vt-muted','#b9b9b9');
    try{localStorage.setItem('vitrin_theme_v21',key)}catch(_e){}
    document.querySelectorAll('.v21Theme,.v22Theme').forEach(b=>b.classList.toggle('on',(b.dataset.theme||'')===key));
  }

  function cleanGoogleUI(root=document){
    const sels=['#goog-gt-tt','.goog-te-balloon-frame','.goog-te-banner-frame','.VIpgJd-ZVi9od-ORHb-OEVmcd','.VIpgJd-yAWNEb-L7lbkb','.VIpgJd-yAWNEb-VIpgJd-fmcmS-sn54Q','.VIpgJd-suEOdc'];
    try{sels.forEach(s=>root.querySelectorAll?.(s).forEach(el=>{el.style.setProperty('display','none','important');el.setAttribute('aria-hidden','true')}))}catch(_e){}
    try{document.querySelectorAll('body>iframe').forEach(f=>{const src=(f.getAttribute('src')||'').toLowerCase();if(src.includes('translate.google')||src.includes('translate.googleapis')){f.style.setProperty('display','none','important');f.setAttribute('aria-hidden','true')}})}catch(_e){}
    if(document.body) document.body.style.top='0px';
  }

  function memberSheet(){
    return [...document.querySelectorAll('.v21Sheet')].find(s=>(s.querySelector('.v21Head h2')?.textContent||'').includes('Üye Ara'))||null;
  }
  function strictMemberSheet(){
    const s=memberSheet(); if(!s)return;
    s.dataset.v31MemberSheet='1';
    const input=s.querySelector('.v21SearchBox'),host=s.querySelector('.v21Members');
    if(!input||!host)return;
    const q=(input.value||'').trim().replace(/^@/,'');
    if(q.length<2 && host.childNodes.length) host.replaceChildren();
    if(input.dataset.v31Strict!=='1'){
      input.dataset.v31Strict='1';
      input.setAttribute('autocomplete','off');
      input.addEventListener('input',()=>{if((input.value||'').trim().replace(/^@/,'').length<2) host.replaceChildren()},true);
    }
  }
  function strictLegacySearch(){
    const modal=document.getElementById('sm'),input=document.getElementById('sq'),host=document.getElementById('sr');
    if(!modal||!input||!host)return;
    const q=(input.value||'').trim().replace(/^@/,'');
    if(q.length<2 && host.childNodes.length) host.replaceChildren();
    if(input.dataset.v31Strict!=='1'){
      input.dataset.v31Strict='1';let timer=0;
      input.addEventListener('input',()=>{clearTimeout(timer);const v=(input.value||'').trim().replace(/^@/,'');if(v.length<2){host.replaceChildren();return}timer=setTimeout(()=>{try{if(typeof searchPeople==='function')searchPeople();else document.getElementById('doSearch')?.click()}catch(_e){document.getElementById('doSearch')?.click()}},250)},true);
    }
  }
  async function openProfileFromMemberButton(btn){
    const small=btn.querySelector('small');
    const username=(small?.textContent||'').trim().replace(/^@/,'');
    if(!username)return false;
    try{
      let p=null;
      if(typeof profilesMap==='object'&&profilesMap)p=Object.values(profilesMap).find(x=>(x?.username||'').toLocaleLowerCase('tr')===username.toLocaleLowerCase('tr'))||null;
      if(!p && typeof sb!=='undefined' && sb?.from){const r=await sb.from('profiles').select('id,full_name,username,avatar_url,city,bio,show_followers,show_following').eq('username',username).maybeSingle();p=r?.data||null;if(p&&typeof profilesMap==='object')profilesMap[p.id]=p}
      if(p?.id && typeof route==='function'){
        if(typeof viewedProfileId!=='undefined') viewedProfileId=p.id;
        memberSheet()?.classList.remove('on');
        route('profile');
        return true;
      }
    }catch(_e){}
    return false;
  }

  function prepareStoryBack(){
    const close=document.getElementById('bulutStoryCreateClose');
    if(close){close.textContent='‹';close.setAttribute('aria-label','Geri');close.title='Geri'}
  }
  let storyCheckBusy=false;
  async function refreshOwnStory(){
    if(storyCheckBusy)return;const own=document.getElementById('bulutOwnStory');if(!own)return;
    storyCheckBusy=true;own.classList.remove('v31HasStory');
    try{
      if(typeof sb!=='undefined'&&typeof session!=='undefined'&&session?.user?.id){const now=new Date().toISOString();const r=await sb.from('stories').select('id').eq('user_id',session.user.id).gt('expires_at',now).limit(1);if(!r?.error&&(r?.data||[]).length)own.classList.add('v31HasStory')}
    }catch(_e){}finally{storyCheckBusy=false}
  }

  function pauseAllVideos(except=null){
    document.querySelectorAll('video').forEach(v=>{if(v!==except){try{v.pause()}catch(_e){}}});
  }

  const routeStack=[];let backRouting=false;
  function currentRoute(){return (location.hash||'#home').replace(/^#/,'').split('/')[0]||'home'}
  function rememberRoute(){const r=currentRoute();if(backRouting){backRouting=false;return}if(routeStack[routeStack.length-1]!==r)routeStack.push(r);if(routeStack.length>30)routeStack.shift()}
  function closeTopLayer(){
    const selectors=['.v22Sheet.on','.v21Sheet.on','.v12SettingsPage.on','#bulutStoryCreate.on','#bulutStoryViewer.on','.storyViewer.on','.story-modal.on','#sm.on','#vlModal.on','.v10Panel.on','.v10MenuBackdrop.on','.modal.on'];
    for(const sel of selectors){const nodes=[...document.querySelectorAll(sel)];const el=nodes[nodes.length-1];if(!el)continue;el.classList.remove('on');if(el.id==='bulutStoryCreate'||el.id==='bulutStoryViewer'||el.classList.contains('storyViewer')||el.classList.contains('story-modal'))pauseAllVideos();return true}
    const chat=document.getElementById('chatPanel');
    if(chat && chat.hidden===false){chat.hidden=true;const list=document.querySelector('.msgCard');if(list)list.hidden=false;try{if(typeof currentChat!=='undefined')currentChat=null}catch(_e){}return true}
    return false;
  }
  function goBackInApp(){
    if(closeTopLayer())return;
    pauseAllVideos();
    if(routeStack.length>1){routeStack.pop();const prev=routeStack[routeStack.length-1]||'home';backRouting=true;try{if(typeof route==='function')route(prev);else location.hash=prev}catch(_e){location.hash=prev}return}
    const r=currentRoute();
    if(r!=='home'){backRouting=true;try{if(typeof route==='function')route('home');else location.hash='home'}catch(_e){location.hash='home'}}
  }
  function installNativeBack(){
    try{
      const app=window.Capacitor?.Plugins?.App;
      if(app?.addListener && !window.__v31BackInstalled){window.__v31BackInstalled=true;app.addListener('backButton',()=>goBackInApp())}
    }catch(_e){}
  }

  let raf=0;
  function sync(){
    raf=0;strictMemberSheet();strictLegacySearch();prepareStoryBack();cleanGoogleUI();installNativeBack();
  }
  function scheduleSync(){if(!raf)raf=requestAnimationFrame(sync)}

  document.addEventListener('play',e=>{const v=e.target;if(v?.tagName==='VIDEO')pauseAllVideos(v)},true);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)pauseAllVideos()});
  window.addEventListener('hashchange',()=>{pauseAllVideos();rememberRoute()});
  window.addEventListener('storage',e=>{if(e.key==='vitrin_theme_v21')applyTheme(e.newValue||'gold')});

  document.addEventListener('click',async e=>{
    const t=e.target;
    if(!t?.closest)return;
    const theme=t.closest('.v21Theme,.v22Theme');if(theme){const key=(theme.dataset.theme||'').trim();if(key&&THEMES[key])setTimeout(()=>applyTheme(key),0)}
    const member=t.closest('.v21Sheet[data-v31-member-sheet="1"] .v21Member');if(member){e.preventDefault();e.stopImmediatePropagation();await openProfileFromMemberButton(member);return}
    const legacy=t.closest('#sr .result');if(legacy&&!t.closest('button,a,input,textarea,label')){const b=legacy.querySelector('[data-view-profile]');if(b){e.preventDefault();b.click();return}}
    if(t.closest('.v20Search,#searchBtn'))setTimeout(()=>{const s=memberSheet();const i=s?.querySelector('.v21SearchBox'),h=s?.querySelector('.v21Members');if(i&&h){i.value='';h.replaceChildren();i.focus()}const li=document.getElementById('sq'),lh=document.getElementById('sr');if(li&&lh){li.value='';lh.replaceChildren()}},0);
    if(t.closest('#bulutOwnStory,.story,[data-story-user],#bulutStoryPhoto,#bulutStoryVideo')){pauseAllVideos();setTimeout(()=>{prepareStoryBack();refreshOwnStory()},40)}
    if(t.closest('#bulutStoryCreateClose,.storyClose,[data-story-close]'))pauseAllVideos();
    if(t.closest('[data-r],.v7BottomShell button,[data-nav],#homeBtn,#reelsBtn,#profileBtn'))setTimeout(()=>pauseAllVideos(),0);
    if(t.closest('#goog-gt-tt,.goog-text-highlight,.VIpgJd-yAWNEb-L7lbkb,.VIpgJd-ZVi9od-ORHb-OEVmcd')){e.preventDefault();e.stopImmediatePropagation();cleanGoogleUI()}
  },true);
  document.addEventListener('touchstart',e=>{const t=e.target;if(t?.closest?.('#goog-gt-tt,.goog-text-highlight,.VIpgJd-yAWNEb-L7lbkb,.VIpgJd-ZVi9od-ORHb-OEVmcd')){e.preventDefault();e.stopImmediatePropagation();cleanGoogleUI()}},{capture:true,passive:false});

  const observer=new MutationObserver(records=>{
    let storyRelevant=false;
    for(const r of records){for(const n of r.addedNodes||[]){if(n.nodeType===1){if(n.matches?.('#bulutOwnStory,.story,[data-story-user],#bulutStoryCreate')||n.querySelector?.('#bulutOwnStory,.story,[data-story-user],#bulutStoryCreate'))storyRelevant=true}}}
    if(storyRelevant)refreshOwnStory();scheduleSync();
  });

  function start(){
    routeStack.push(currentRoute());applyTheme(themeKey());sync();refreshOwnStory();if(document.body)observer.observe(document.body,{childList:true,subtree:true});installNativeBack();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
