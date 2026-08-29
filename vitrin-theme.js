(()=>{
  const GOLD='#d5a23a', GOLD2='#f3d477', GOLD3='#8a5a16', INK='#090909', PANEL='#121212', PANEL2='#191919', TEXT='#f4ead0', MUTED='#b8a98a', LINE='#5c451c';
  document.title=document.title.replace(/BULUT/gi,'VİTRİN').replace(/Bulut/g,'VİTRİN');
  const meta=document.querySelector('meta[name="theme-color"]'); if(meta)meta.content=INK;
  const st=document.createElement('style'); st.id='vitrinGoldTheme'; st.textContent=`
  :root{--b:${GOLD}!important;--c:${GOLD2}!important;--n:${TEXT}!important;--m:${MUTED}!important;--l:${LINE}!important;--bg:${INK}!important;--card:${PANEL}!important}
  html,body{background:radial-gradient(circle at 50% -10%,#2a2113 0,#12100c 28%,#090909 68%,#050505 100%)!important;color:${TEXT}!important}
  body{min-height:100vh}.wrap,.page{background:transparent!important}
  .top{background:linear-gradient(180deg,#11110f,#090909)!important;border-bottom:1px solid #76581f!important;box-shadow:0 8px 26px #0009!important}
  .brand{color:${TEXT}!important;gap:7px!important}.cloudLogo{display:none!important}.vitrinLogoMark{width:74px;height:52px;object-fit:contain;display:block;flex:0 0 auto;filter:drop-shadow(0 0 6px #d5a23a55)}
  .brandName{font-family:Georgia,'Times New Roman',serif!important;font-size:28px!important;font-weight:800!important;letter-spacing:1.4px!important;background:linear-gradient(180deg,#fff0b1 0%,#d5a23a 42%,#8a5a16 100%)!important;-webkit-background-clip:text!important;background-clip:text!important;color:transparent!important;-webkit-text-stroke:.2px #f0c767!important;text-shadow:0 2px 12px #c58a2c33!important}
  .brandTr{color:#e30a17!important;text-shadow:none!important}.brandFlag{filter:none!important}
  .ib,.action{background:#17140e!important;color:${GOLD2}!important;border:1px solid #6f521d!important;box-shadow:inset 0 0 0 1px #000,0 4px 12px #0008!important}
  .ib:hover,.action:hover{background:#241b0d!important}.card,.auth,.profile,.reelWrap,.composer,.empty,.commentItem,.room,.modeBox,.mediaChoice{background:linear-gradient(145deg,#171717,#0f0f0f)!important;border-color:#5e471e!important;color:${TEXT}!important;box-shadow:0 10px 30px #0008!important}
  .card h1,.card h2,.card h3,.auth h1,.headrow h1,.user,.caption{color:${TEXT}!important}
  .muted,.hint,.tiny,.status,.gMeta,.gCatNote,.modeHelp,.reelStats,.nav{color:${MUTED}!important}
  .ring{border-color:${GOLD}!important;background:#16120b!important;color:${GOLD2}!important;box-shadow:0 0 0 2px #2a1f0c,0 0 16px #d5a23a22!important}
  .ask,.searchBox input,.edit input,.edit textarea,.auth input,.box input,.box textarea,.commentComposer input,.chatComposer textarea{background:#111!important;color:${TEXT}!important;border-color:#5e471e!important}
  input::placeholder,textarea::placeholder{color:#8e8067!important}
  .primary,.upload,.commentComposer button{background:linear-gradient(135deg,#8a5a16,#d5a23a 55%,#f3d477)!important;color:#161006!important;border:1px solid #f0c767!important;box-shadow:0 5px 18px #d5a23a2e!important}
  .outline,.secondary,.pa button,.reelAction,.modeBtn{background:#17140e!important;color:${TEXT}!important;border:1px solid #5e471e!important}.pa button.liked,.reelAction.liked{color:#ff5a6f!important}
  .bottom{background:linear-gradient(180deg,#12100c,#080808)!important;border-top:1px solid #76581f!important;box-shadow:0 -8px 24px #0009!important}.bottom button,.nav{color:#b9a885!important}.bottom button.on,.nav.active{color:${GOLD2}!important}
  .toast{background:#17120a!important;color:${GOLD2}!important;border:1px solid #6f521d!important}
  .box{background:linear-gradient(145deg,#181818,#0c0c0c)!important;color:${TEXT}!important;border:1px solid #70531f!important}.back{background:#000b!important}
  .notice{background:linear-gradient(135deg,#2a1d09,#171006)!important;border-color:#8a641f!important;color:#f6dea0!important}.notifUnread{background:#1b160d!important}
  .chatHead,.chatComposer,.bulut-chat-tools{background:#111!important;border-color:#5e471e!important}.chatMessages,#chatMessages{background:linear-gradient(180deg,#0b0b0b,#151007)!important}.bubble{background:#1b1b1b!important;border-color:#5e471e!important;color:${TEXT}!important}.bubble.mine{background:linear-gradient(135deg,#7b5018,#d5a23a)!important;color:#0f0b05!important}
  #notifBtn.hasNotification{color:${GOLD2}!important;background:linear-gradient(135deg,#2a1d08,#5b3e0f)!important;box-shadow:0 0 0 2px #d5a23a44,0 0 20px #d5a23a55!important}
  #notifBtn.hasNotification svg{color:${GOLD2}!important;stroke:${GOLD2}!important}
  #agenda .gHero{background:radial-gradient(circle at 78% 42%,#4d320b 0,#251808 32%,#0a0a0a 76%)!important;border:1px solid #bd892e!important;color:${TEXT}!important;box-shadow:inset 0 0 35px #d5a23a18,0 10px 30px #0009!important}
  #agenda .gTabs button,#agenda .gCats button{background:#12100c!important;border-color:#6a4e1c!important;color:${TEXT}!important}#agenda .gTabs button.on,#agenda .gCats button.on{background:linear-gradient(135deg,#8a5a16,#d5a23a)!important;color:#120d05!important;border-color:#f0c767!important}
  #agenda .gCard,#agenda .gWeather{background:linear-gradient(145deg,#171717,#0e0e0e)!important;border-color:#5e471e!important;color:${TEXT}!important}#agenda .gCard a{color:${TEXT}!important}#agenda .gMoreHint{background:linear-gradient(90deg,#0000,#12100c 45%)!important;color:${GOLD2}!important}#agenda .gMoreHint .arr{background:${GOLD}!important;color:#120d05!important;box-shadow:0 4px 12px #d5a23a55!important}#agenda .gCatNote b{color:${GOLD2}!important}
  .reel{background:#070707!important}.reelWrap{border-color:#6b501d!important}.reelStats{border-color:#5e471e!important}.mediaChoices .mediaChoice,.modeBtn{background:#15120d!important}.modeBtn.active{background:linear-gradient(135deg,#8a5a16,#d5a23a)!important;color:#110c04!important;border-color:#f0c767!important}
  #bulutUserCounter{left:118px!important}#bulutUserCounter *{color:inherit}
  @media(max-width:420px){.vitrinLogoMark{width:58px;height:43px}.brandName{font-size:23px!important;letter-spacing:.6px!important}.top{padding-left:8px!important;padding-right:8px!important}#bulutUserCounter{left:92px!important}}
  @media(max-width:365px){.vitrinLogoMark{width:50px;height:38px}.brandName{font-size:20px!important}.brandTr{font-size:17px!important}.brandFlag{font-size:16px!important}}
  `; document.head.appendChild(st);

  function brand(){
    document.querySelectorAll('.brand').forEach(b=>{
      const old=b.querySelector('.cloudLogo');
      if(old&&!b.querySelector('.vitrinLogoMark')){const im=document.createElement('img');im.className='vitrinLogoMark';im.src='./vitrin-logo.svg';im.alt='VİTRİN';old.insertAdjacentElement('beforebegin',im)}
      const n=b.querySelector('.brandName'); if(n)n.textContent='VİTRİN';
    });
    const legacy=document.getElementById('legacyNotice'); if(legacy)legacy.innerHTML='✨ VİTRİN artık ortak üyelik sistemine geçti. Eski test hesabınız bu telefonda kalır; gerçek sistem için bir kez yeniden kayıt olun.';
    const reg=document.querySelector('#register h1'); if(reg)reg.textContent="VİTRİN'e katıl";
    const search=document.querySelector('#sm .mh h2'); if(search)search.textContent="VİTRİN'de Kişi Ara";
    const gh=document.querySelector('#agenda .gHero h2'); if(gh)gh.textContent='🔥 VİTRİN Gündem';
  }
  brand();
  const mo=new MutationObserver(()=>brand()); mo.observe(document.documentElement,{subtree:true,childList:true});
  window.addEventListener('hashchange',()=>setTimeout(brand,0));
})();