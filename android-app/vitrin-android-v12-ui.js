(function(){
  const ID='vitrinAndroidV12SettingsFollowBrand';
  if(document.getElementById(ID)) return;

  const style=document.createElement('style');
  style.id=ID;
  style.textContent=`
    .v12SettingsPage{position:fixed;inset:0;z-index:2147483600;background:var(--vt-bg,#090909);color:var(--vt-text,#fff);display:none;overflow:auto;padding-bottom:24px}
    .v12SettingsPage.on{display:block}
    .v12SettingsHead{position:sticky;top:0;z-index:3;display:flex;align-items:center;gap:12px;height:72px;padding:0 18px;background:color-mix(in srgb,var(--vt-bg,#090909) 94%,transparent);border-bottom:1px solid var(--vt-line,#2a2a2a);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px)}
    .v12SettingsBack{width:44px;height:44px;border:0;background:transparent;color:var(--vt-text,#fff);font-size:30px;display:grid;place-items:center;border-radius:50%}
    .v12SettingsHead h1{margin:0;font:800 24px/1 system-ui,-apple-system,Segoe UI,sans-serif;color:var(--vt-text,#fff)}
    .v12SettingsBody{padding:22px 18px}
    .v12SettingsIntro{border:1px solid var(--vt-line,#2a2a2a);background:var(--vt-surface,#111);border-radius:22px;padding:22px 18px}
    .v12SettingsIntro h2{margin:0 0 8px;color:var(--vt-accent,#d4a72c);font:850 21px/1.2 system-ui,-apple-system,Segoe UI,sans-serif}
    .v12SettingsIntro p{margin:0;color:var(--vt-muted,#aaa);font:15px/1.5 system-ui,-apple-system,Segoe UI,sans-serif}
    .v12SettingsEmpty{margin-top:16px;border:1px dashed var(--vt-line,#333);border-radius:18px;padding:18px;color:var(--vt-muted,#aaa);font:14px/1.45 system-ui,-apple-system,Segoe UI,sans-serif;text-align:center}

    .v12FollowBtn{position:absolute!important;top:18px!important;right:18px!important;z-index:18!important;min-width:84px!important;height:36px!important;padding:0 14px!important;border:1px solid rgba(255,255,255,.72)!important;border-radius:18px!important;background:rgba(0,0,0,.18)!important;color:#fff!important;backdrop-filter:blur(8px)!important;-webkit-backdrop-filter:blur(8px)!important;font:800 13px/1 system-ui,-apple-system,Segoe UI,sans-serif!important;box-shadow:none!important;text-shadow:0 1px 6px rgba(0,0,0,.85)!important}
    .v12FollowBtn:active{transform:scale(.96)!important}
    .v12FollowBtn.isFollowing{background:rgba(0,0,0,.38)!important;color:#f3c95b!important;border-color:rgba(243,201,91,.75)!important}

    .v8ReelOverlay{right:120px!important}
    .v8ReelOverlay .v8Brand{color:#D4AF37!important;font:900 14px/1.05 system-ui,-apple-system,Segoe UI,sans-serif!important;letter-spacing:.35px!important;text-shadow:0 1px 0 rgba(255,255,255,.2),0 2px 8px rgba(0,0,0,.85)!important}
    .v8ReelOverlay .v8Brand .v12BrandV{display:inline-block!important;color:#D4AF37!important;font:900 22px/1 Georgia,'Times New Roman',serif!important;margin-right:1px!important;vertical-align:-2px!important;text-shadow:0 1px 0 rgba(255,255,255,.25),0 2px 0 #8b6914,0 3px 7px rgba(0,0,0,.8)!important}
    .vitrinBrand .vitrinV{color:#D4AF37!important;-webkit-text-fill-color:#D4AF37!important}
  `;
  document.head.appendChild(style);

  const page=document.createElement('section');
  page.className='v12SettingsPage';
  page.setAttribute('aria-label','Ayarlar');
  page.innerHTML=`
    <div class="v12SettingsHead">
      <button type="button" class="v12SettingsBack" aria-label="Geri">‹</button>
      <h1>Ayarlar</h1>
    </div>
    <div class="v12SettingsBody">
      <div class="v12SettingsIntro">
        <h2>VİTRİN Ayarları</h2>
        <p>Ayarlar artık uygulama içinde ayrı bir sayfada açılır. Buraya seçenekleri tek tek ekleyeceğiz.</p>
      </div>
      <div class="v12SettingsEmpty">Henüz ayar seçeneği eklenmedi.</div>
    </div>`;
  document.body.appendChild(page);

  function openSettings(){
    document.querySelectorAll('.v10Panel.on').forEach(x=>x.classList.remove('on'));
    document.querySelectorAll('.v10MenuBackdrop.on').forEach(x=>x.classList.remove('on'));
    page.classList.add('on');
    page.scrollTop=0;
  }
  function closeSettings(){page.classList.remove('on')}
  page.querySelector('.v12SettingsBack').addEventListener('click',closeSettings);

  document.addEventListener('click',function(e){
    const settings=e.target.closest('[data-v10="settings"]');
    if(!settings) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    openSettings();
  },true);

  function decorateBrand(stage){
    const brand=stage.querySelector('.v8ReelOverlay .v8Brand');
    if(brand && !brand.querySelector('.v12BrandV')) brand.innerHTML='<span class="v12BrandV">V</span><span>İTRİN</span>';
  }

  function addFollow(stage,card){
    if(stage.querySelector('.v12FollowBtn')) return;
    const btn=document.createElement('button');
    btn.type='button';
    btn.className='v12FollowBtn';
    btn.textContent='Takip Et';
    btn.setAttribute('aria-label','Takip Et');
    btn.addEventListener('click',function(ev){
      ev.preventDefault();ev.stopPropagation();
      const possible=[...card.querySelectorAll('button,a')].find(x=>/takip/i.test((x.textContent||'').trim()) && x!==btn);
      if(possible){possible.click();return;}
      btn.classList.toggle('isFollowing');
      btn.textContent=btn.classList.contains('isFollowing')?'Takipte':'Takip Et';
    });
    stage.appendChild(btn);
  }

  function scan(){
    document.querySelectorAll('.reelFeedCard').forEach(card=>{
      const stage=card.querySelector('.v8ReelStage');
      if(!stage) return;
      decorateBrand(stage);
      addFollow(stage,card);
    });
  }
  scan();
  new MutationObserver(()=>requestAnimationFrame(scan)).observe(document.body,{childList:true,subtree:true});
})();
