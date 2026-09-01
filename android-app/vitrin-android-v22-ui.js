(function(){
 const ID='vitrinAndroidV22MenuLanguageBack'; if(document.getElementById(ID))return;
 const st=document.createElement('style');st.id=ID;st.textContent=`
 .v20QuickActions .v20Globe{font-size:18px!important;width:25px!important;min-width:25px!important;height:32px!important}
 .v12SettingsPage .v21ThemeSection{display:none!important}
 .v22BackBtn{display:flex;align-items:center;gap:8px;width:max-content;min-width:92px;height:42px;padding:0 14px;border:1px solid #d4af37;border-radius:14px;background:#17130a;color:#f6d56f;font:800 15px system-ui;box-shadow:0 4px 16px #0007}
 .v22MenuBack{margin:0 0 12px!important;background:#17130a!important;border:1px solid #5c4700!important;color:#f6d56f!important}
 .v22Sheet{position:fixed;inset:0;z-index:2147483646;background:#000;display:none;flex-direction:column;color:#fff}.v22Sheet.on{display:flex}
 .v22Top{position:sticky;top:0;z-index:2;display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:10px;padding:calc(12px + env(safe-area-inset-top)) 14px 12px;background:rgba(8,8,8,.96);border-bottom:1px solid #2f2a1b;backdrop-filter:blur(14px)}
 .v22Top h2{margin:0;text-align:center;color:#f0c95a;font:900 20px system-ui}.v22Top small{grid-column:1/-1;text-align:center;color:#9d9d9d;font:12px system-ui;margin-top:-4px}
 .v22Close{width:42px;height:42px;border:0;border-radius:50%;background:#171717;color:#fff;font-size:24px}
 .v22Body{padding:14px 14px calc(28px + env(safe-area-inset-bottom));overflow:auto;flex:1}
 .v22Search{position:sticky;top:0;z-index:1;width:100%;box-sizing:border-box;padding:14px 15px;border-radius:15px;border:1px solid #393939;background:#151515;color:#fff;font-size:16px;outline:none;margin-bottom:14px}.v22Search:focus{border-color:#d4af37;box-shadow:0 0 0 1px #d4af37}
 .v22SectionTitle{margin:8px 2px 10px;color:#d4af37;font:850 14px system-ui;letter-spacing:.2px}.v22LangGrid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}
 .v22Lang{position:relative;min-height:52px;padding:9px 34px 9px 12px;border:1px solid #303030;border-radius:15px;background:linear-gradient(180deg,#171717,#111);color:#f5f5f5;text-align:left;font:750 13px system-ui}.v22Lang:active{transform:scale(.985)}.v22Lang.on{border-color:#d4af37;color:#f3cf65;background:linear-gradient(180deg,#221c0a,#15120a)}.v22Lang.on:after{content:'✓';position:absolute;right:12px;top:50%;transform:translateY(-50%);color:#d4af37;font-weight:900}
 .v22ThemeGrid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}.v22Theme{display:flex;align-items:center;gap:10px;min-height:52px;padding:9px 11px;border:1px solid #303030;border-radius:15px;background:#141414;color:#fff;text-align:left;font:750 13px system-ui}.v22Theme.on{border-color:#d4af37;color:#f3cf65}.v22Swatch{width:30px;height:30px;border-radius:50%;border:1px solid #ffffff55;flex:none}
 .goog-logo-link,.goog-te-gadget,.goog-te-banner-frame,.skiptranslate iframe,[href*='translate.google'],[href*='google.com/translate']{display:none!important;visibility:hidden!important}body{top:0!important}
 `;document.head.appendChild(st);

 function mkSheet(title,sub){const s=document.createElement('section');s.className='v22Sheet';s.innerHTML=`<div class="v22Top"><button class="v22BackBtn">← Geri</button><h2>${title}</h2><button class="v22Close">×</button><small>${sub||''}</small></div><div class="v22Body"></div>`;document.body.appendChild(s);const close=()=>s.classList.remove('on');s.querySelector('.v22BackBtn').onclick=close;s.querySelector('.v22Close').onclick=close;return s}
 const langSheet=mkSheet('Dil ve Bölge','VİTRİN arayüz dilini seçin');
 const themeSheet=mkSheet('Renk Temaları','VİTRİN markası altın kalır, arayüz seçiminize göre değişir');

 function sourceLangs(){return [...document.querySelectorAll('.v21LangGrid .v21Lang')].filter(b=>b.offsetParent!==null||b.closest('.v21Sheet'))}
 function renderLangs(q=''){
   const body=langSheet.querySelector('.v22Body');const old=body.querySelector('.v22Search')?.value||q;body.innerHTML='<input class="v22Search" placeholder="Dil ara..." autocomplete="off"><div class="v22SectionTitle">Tüm diller</div><div class="v22LangGrid"></div>';const input=body.querySelector('.v22Search');input.value=old;const host=body.querySelector('.v22LangGrid');const x=old.trim().toLocaleLowerCase('tr');const src=sourceLangs();src.filter(b=>!x||(b.textContent||'').toLocaleLowerCase('tr').includes(x)).forEach(orig=>{const b=document.createElement('button');b.className='v22Lang'+(orig.classList.contains('on')?' on':'');b.textContent=(orig.textContent||'').trim();b.onclick=()=>{orig.click();setTimeout(()=>{renderLangs(input.value);langSheet.classList.remove('on')},120)};host.appendChild(b)});if(!host.children.length)host.innerHTML='<div style="grid-column:1/-1;padding:18px;text-align:center;color:#999">Dil bulunamadı.</div>';input.oninput=()=>renderLangs(input.value)
 }
 function openLang(){document.querySelectorAll('.v21Sheet.on').forEach(x=>x.classList.remove('on'));renderLangs('');langSheet.classList.add('on')}
 document.addEventListener('click',e=>{const g=e.target.closest('.v20Globe');if(!g)return;e.preventDefault();e.stopImmediatePropagation();openLang()},true);

 function themeSources(){return [...document.querySelectorAll('.v21ThemeSection .v21Theme')]}
 function renderThemes(){const body=themeSheet.querySelector('.v22Body');body.innerHTML='<div class="v22SectionTitle">Renkler ve Türkiye Futbol Takımları</div><div class="v22ThemeGrid"></div>';const host=body.querySelector('.v22ThemeGrid');themeSources().forEach(orig=>{const b=document.createElement('button');b.className='v22Theme'+(orig.classList.contains('on')?' on':'');const sw=orig.querySelector('.v21Swatch');const label=(orig.textContent||'').trim();b.innerHTML=`<span class="v22Swatch" style="${sw?.getAttribute('style')||''}"></span><span>${label}</span>`;b.onclick=()=>{orig.click();setTimeout(renderThemes,80)};host.appendChild(b)});if(!host.children.length)host.innerHTML='<div style="grid-column:1/-1;padding:18px;text-align:center;color:#999">Temalar hazırlanıyor...</div>'}
 function openThemes(){renderThemes();themeSheet.classList.add('on');if(!themeSources().length)setTimeout(()=>{renderThemes()},500)}

 function installMenu(){const menu=document.querySelector('.v10SideMenu');if(!menu)return;
   if(!menu.querySelector('.v22MenuBack')){const back=document.createElement('button');back.className='v10MenuItem v22MenuBack';back.innerHTML='<span class="v10MenuIcon">←</span><span>Geri</span>';back.onclick=()=>document.querySelector('.v10MenuBackdrop')?.classList.remove('on');menu.insertBefore(back,menu.querySelector('.v10MenuTitle')?.nextSibling||menu.firstChild)}
   if(!menu.querySelector('[data-v22="themes"]')){const btn=document.createElement('button');btn.className='v10MenuItem';btn.dataset.v22='themes';btn.innerHTML='<span class="v10MenuIcon">🎨</span><span>Renk Temaları</span>';const saved=menu.querySelector('[data-v10="saved"]');menu.insertBefore(btn,saved||menu.querySelector('[data-v10="logout"]'));btn.onclick=()=>{document.querySelector('.v10MenuBackdrop')?.classList.remove('on');openThemes()}}
 }
 function enhanceSettingsBack(){const head=document.querySelector('.v12SettingsHead');if(!head||head.querySelector('.v22BackBtn'))return;const old=head.querySelector('.v12SettingsBack');if(old)old.style.display='none';const b=document.createElement('button');b.className='v22BackBtn';b.textContent='← Geri';b.onclick=()=>document.querySelector('.v12SettingsPage')?.classList.remove('on');head.insertBefore(b,head.firstChild)}
 function sync(){installMenu();enhanceSettingsBack();document.querySelectorAll('.v12SettingsPage .v21ThemeSection').forEach(x=>x.style.setProperty('display','none','important'))}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',sync,{once:true});else sync();new MutationObserver(sync).observe(document.documentElement,{subtree:true,childList:true});[250,800,1600,2600].forEach(t=>setTimeout(sync,t));
})();