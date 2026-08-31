(function(){
  const ID='vitrinAndroidV10Menu';
  if(document.getElementById(ID)) return;
  const style=document.createElement('style');
  style.id=ID;
  style.textContent=`
    .v10MenuBackdrop{position:fixed;inset:0;z-index:99990;background:rgba(0,0,0,.55);backdrop-filter:blur(3px);display:none}
    .v10MenuBackdrop.on{display:block}
    .v10SideMenu{position:absolute;left:0;top:0;bottom:0;width:min(82vw,330px);background:#0b0b0b;border-right:1px solid #2a2a2a;box-shadow:12px 0 36px #000a;padding:calc(26px + env(safe-area-inset-top)) 18px 24px;color:#fff;transform:translateX(-102%);transition:transform .18s ease}
    .v10MenuBackdrop.on .v10SideMenu{transform:translateX(0)}
    .v10MenuTitle{font:900 25px/1 system-ui,sans-serif;color:#efbd4f;margin:4px 4px 26px}
    .v10MenuItem{width:100%;display:flex;align-items:center;gap:14px;padding:15px 12px;margin:5px 0;border:0;border-radius:14px;background:transparent;color:#f4f4f4;font:700 16px/1.2 system-ui,sans-serif;text-align:left}
    .v10MenuItem:active{background:#1b1b1b}
    .v10MenuIcon{width:28px;text-align:center;font-size:22px}
    .v10MenuItem.logout{color:#ff6868;margin-top:18px;border-top:1px solid #242424;border-radius:0;padding-top:20px}
    .v10Panel{position:fixed;left:14px;right:14px;bottom:20px;z-index:99995;background:#111;border:1px solid #2b2b2b;border-radius:22px;padding:18px;color:#fff;box-shadow:0 16px 50px #000c;display:none}
    .v10Panel.on{display:block}
    .v10Panel h3{margin:0 0 14px;font:900 21px/1.2 system-ui,sans-serif;color:#efbd4f}
    .v10Panel p{margin:0 0 14px;color:#bbb;font:14px/1.45 system-ui,sans-serif}
    .v10PanelRow{display:flex;align-items:center;justify-content:space-between;padding:13px 0;border-top:1px solid #252525}
    .v10Close{width:100%;margin-top:12px;padding:12px;border-radius:12px;border:1px solid #3a3a3a;background:#181818;color:#fff;font-weight:800}
  `;
  document.head.appendChild(style);

  const backdrop=document.createElement('div');
  backdrop.className='v10MenuBackdrop';
  backdrop.innerHTML=`<div class="v10SideMenu" role="dialog" aria-label="VİTRİN menüsü">
    <div class="v10MenuTitle">VİTRİN</div>
    <button class="v10MenuItem" data-v10="settings"><span class="v10MenuIcon">⚙️</span><span>Ayarlar</span></button>
    <button class="v10MenuItem" data-v10="saved"><span class="v10MenuIcon">🔖</span><span>Kaydedilenler</span></button>
    <button class="v10MenuItem logout" data-v10="logout"><span class="v10MenuIcon">↪️</span><span>VİTRİN'den Çıkış</span></button>
  </div>`;
  document.body.appendChild(backdrop);

  function closeMenu(){backdrop.classList.remove('on')}
  backdrop.addEventListener('click',e=>{if(e.target===backdrop)closeMenu()});

  function showPanel(title,body){
    let panel=document.querySelector('.v10Panel');
    if(!panel){panel=document.createElement('div');panel.className='v10Panel';document.body.appendChild(panel)}
    panel.innerHTML=`<h3>${title}</h3><p>${body}</p><button class="v10Close">Kapat</button>`;
    panel.classList.add('on');
    panel.querySelector('.v10Close').onclick=()=>panel.classList.remove('on');
  }

  async function logout(){
    try{
      if(window.sb?.auth?.signOut) await window.sb.auth.signOut();
      else if(window.supabase?.auth?.signOut) await window.supabase.auth.signOut();
      localStorage.removeItem('vitrin_user');
      sessionStorage.clear();
      location.reload();
    }catch(e){showPanel('Çıkış','Oturum kapatılamadı. Lütfen tekrar deneyin.');}
  }

  backdrop.querySelector('[data-v10="settings"]').onclick=()=>{closeMenu();showPanel('Ayarlar','VİTRİN uygulama ayarları bu bölümde toplanacak. Bildirim, görünüm ve hesap seçeneklerini buradan yöneteceğiz.')};
  backdrop.querySelector('[data-v10="saved"]').onclick=()=>{closeMenu();showPanel('Kaydedilenler','Kaydettiğiniz gönderiler ve Reeller bu bölümde listelenecek.')};
  backdrop.querySelector('[data-v10="logout"]').onclick=()=>{closeMenu();logout()};

  function wireMenu(){
    const old=document.querySelector('.vAndroidMenuBtn');
    if(!old || old.dataset.v10==='1') return;
    const fresh=old.cloneNode(true);
    fresh.dataset.v10='1';
    old.replaceWith(fresh);
    fresh.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();backdrop.classList.add('on')});
  }
  wireMenu();
  const mo=new MutationObserver(()=>wireMenu());
  mo.observe(document.body,{childList:true,subtree:true});
  setTimeout(()=>mo.disconnect(),15000);
})();
