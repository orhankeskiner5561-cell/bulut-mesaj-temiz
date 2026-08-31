(function(){
  const ID='vitrinAndroidV7BottomShell';
  if(document.getElementById(ID)) return;

  const style=document.createElement('style');
  style.id=ID;
  style.textContent=`
    html body .bottom{display:none!important}
    html body{padding-bottom:76px!important}
    .v7BottomShell{
      position:fixed!important;left:0!important;right:0!important;bottom:0!important;z-index:2147483000!important;
      height:68px!important;display:grid!important;grid-template-columns:repeat(5,1fr)!important;
      align-items:center!important;background:rgba(5,5,5,.96)!important;border-top:1px solid rgba(255,255,255,.10)!important;
      backdrop-filter:blur(16px)!important;-webkit-backdrop-filter:blur(16px)!important;
      padding:3px 12px 7px!important;box-sizing:border-box!important
    }
    .v7BottomShell button{
      appearance:none!important;-webkit-appearance:none!important;border:0!important;background:transparent!important;
      color:rgba(255,255,255,.92)!important;width:100%!important;height:56px!important;padding:0!important;margin:0!important;
      display:grid!important;place-items:center!important;box-shadow:none!important;outline:none!important;border-radius:0!important
    }
    .v7BottomShell button svg{width:29px!important;height:29px!important;display:block!important;stroke:currentColor!important;fill:none!important;stroke-width:2!important;stroke-linecap:round!important;stroke-linejoin:round!important}
    .v7BottomShell .v7PlusIcon{width:34px!important;height:34px!important;border:1.8px solid rgba(255,255,255,.92)!important;border-radius:50%!important;display:grid!important;place-items:center!important;color:#fff!important;font:300 33px/1 system-ui,sans-serif!important}
    .v7BottomShell .v7GoldV{color:#e2ad35!important;font:900 31px/1 Georgia,serif!important;letter-spacing:-2px!important;text-shadow:0 0 10px rgba(226,173,53,.14)!important}
    .v7BottomShell .v7ProfileCircle{width:30px!important;height:30px!important;border:1.7px solid rgba(255,255,255,.92)!important;border-radius:50%!important;display:grid!important;place-items:center!important;box-sizing:border-box!important}
    .v7BottomShell .v7ProfileCircle svg{width:21px!important;height:21px!important;stroke-width:1.7!important}
    .v7BottomShell button:active{transform:scale(.93)!important}
    @supports(padding:max(0px)){
      .v7BottomShell{height:calc(64px + max(4px,env(safe-area-inset-bottom)))!important;padding-bottom:max(7px,env(safe-area-inset-bottom))!important}
      html body{padding-bottom:calc(72px + max(4px,env(safe-area-inset-bottom)))!important}
    }
  `;
  document.head.appendChild(style);

  const shell=document.createElement('nav');
  shell.className='v7BottomShell';
  shell.setAttribute('aria-label','Alt menü');
  shell.innerHTML=`
    <button type="button" aria-label="Ana Akış" data-v7="home">
      <svg viewBox="0 0 24 24"><path d="M3 10.5 12 3l9 7.5"></path><path d="M5.5 9.5V21h13V9.5"></path><path d="M9.5 21v-6h5v6"></path></svg>
    </button>
    <button type="button" aria-label="Gündem" data-v7="trend">
      <svg viewBox="0 0 24 24"><path d="M13.2 2.6c.7 3-1.6 4.4-2.8 6.2-1.2 1.8-.5 3.2.7 4.1-.2-2.2 1.2-3.4 2.8-4.8 3 2.1 4.8 4.8 4.3 8-.5 3.2-3.2 5.3-6.5 5.3-3.8 0-6.8-2.4-6.8-6.2 0-2.8 1.6-5 4.1-7.4-.2 2 .6 3.2 1.5 3.8.2-3.9 2.8-5.5 2.7-9Z"></path></svg>
    </button>
    <button type="button" aria-label="Ekle" data-v7="plus"><span class="v7PlusIcon">+</span></button>
    <button type="button" aria-label="V Sosyal" data-v7="social"><span class="v7GoldV">V</span></button>
    <button type="button" aria-label="Profil" data-v7="profile"><span class="v7ProfileCircle"><svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="3.2"></circle><path d="M5.5 20c.8-4 3.1-6 6.5-6s5.7 2 6.5 6"></path></svg></span></button>
  `;
  document.body.appendChild(shell);

  function invokeRoute(kind){
    try{
      if(kind==='plus') return;
      const selectors={
        home:['.bottom [data-r="home"]','.bottom button[onclick*="home"]','.bottom a[href*="index"]'],
        trend:['.bottom [data-r="trend"]','.bottom [data-r="gundem"]','.bottom button[onclick*="gundem"]'],
        social:['.bottom [data-r="rooms"]','.bottom button[onclick*="rooms"]'],
        profile:['.bottom [data-r="profile"]','.bottom a[href*="profile"]','.bottom button[onclick*="profile"]']
      };
      const target=(selectors[kind]||[]).map(s=>document.querySelector(s)).find(Boolean);
      if(target){target.click();return;}
      if(typeof window.go==='function'){
        const map={home:'home',trend:'trend',social:'rooms',profile:'profile'};
        if(map[kind]) window.go(map[kind]);
      }
    }catch(_e){}
  }
  shell.addEventListener('click',e=>{
    const b=e.target.closest('button[data-v7]');
    if(!b) return;
    invokeRoute(b.dataset.v7);
  });
})();
