(()=>{
 const root=document.getElementById('agenda'); if(!root)return;

 /* VİTRİN üst marka — mevcut işlevleri bozmadan sadece görünümü değiştir */
 const brand=document.querySelector('.top .brand');
 if(brand){
   brand.innerHTML=`<span class="vLogo" aria-hidden="true">V</span><span class="vWord">VİTRİN</span><span class="vTr">TR</span><span class="vFlag">🇹🇷</span>`;
 }

 const st=document.createElement('style'); st.textContent=`
 :root{--vgold:#d8a64a;--vgold2:#f0c96f;--vline:#76551f;--vblack:#060606;--vcard:#0d0c0a;--vtext:#f7f0e3;--vmuted:#b7a98e}
 body{background:linear-gradient(180deg,#050505,#090806 55%,#050505)!important;color:var(--vtext)!important}
 .top{height:82px!important;background:linear-gradient(180deg,#080808,#030303)!important;border-bottom:1px solid #76551f!important;padding:8px 14px!important;overflow:visible!important}
 .top .brand{display:flex!important;align-items:center!important;gap:7px!important;min-width:0!important;white-space:nowrap!important}
 .vLogo{font-family:Georgia,'Times New Roman',serif;font-size:55px;line-height:.8;font-weight:700;color:#d5a74e;text-shadow:0 1px 0 #fff1b0,0 2px 8px #000;letter-spacing:-7px;border-bottom:1px solid #b98531;padding:0 7px 5px 0}
 .vWord{font-family:Georgia,'Times New Roman',serif;font-size:31px;letter-spacing:2px;color:#dcb15c;text-shadow:0 1px 0 #f8dea0}
 .vTr{color:#e52828;font-size:22px;font-weight:900;margin-left:2px}.vFlag{font-size:21px}
 .topActions{gap:8px!important}.topActions .ib{width:43px!important;height:43px!important;border-radius:50%!important;background:#090909!important;border:1px solid #9a7131!important;color:#e7bb65!important;box-shadow:none!important}
 .topActions .ib img{border-radius:50%}
 .wrap{max-width:720px!important;padding:14px 18px 90px!important}
 .bottom{height:72px!important;background:linear-gradient(180deg,#0b0a08,#050505)!important;border-top:1px solid #76551f!important}
 .bottom button{color:#b6a98d!important}.bottom button.on{color:#e6bd68!important}.bottom span{filter:saturate(.85)}
 #agenda{overflow-x:hidden;max-width:100%;color:var(--vtext)}
 #agenda .gWrap{display:grid;gap:14px;min-width:0;max-width:100%}
 .gHero{position:relative;overflow:hidden;min-height:210px;border:1px solid #b88936;border-radius:28px;padding:30px 26px;background:radial-gradient(circle at 83% 50%,rgba(217,163,63,.24),transparent 35%),linear-gradient(135deg,#070707,#11100d 60%,#050505);box-shadow:inset 0 0 0 1px rgba(255,211,119,.06),0 12px 32px rgba(0,0,0,.35)}
 .gGlobe{position:absolute;right:-68px;top:15px;width:250px;height:250px;border-radius:50%;border:2px solid rgba(216,166,74,.5);opacity:.55;background:repeating-radial-gradient(circle at 50% 50%,transparent 0 25px,rgba(216,166,74,.18) 26px 28px),repeating-linear-gradient(90deg,transparent 0 28px,rgba(216,166,74,.16) 29px 31px);box-shadow:0 0 40px rgba(216,166,74,.12) inset}
 .gGlobe:before,.gGlobe:after{content:'';position:absolute;inset:20px 75px;border:2px solid rgba(216,166,74,.45);border-radius:50%}.gGlobe:after{inset:75px 20px}
 .gHero h2{position:relative;z-index:2;margin:0 0 16px;font-size:36px;line-height:1.05;color:#e5b95f;text-shadow:0 1px 12px rgba(231,189,105,.18)}
 .gHero p{position:relative;z-index:2;margin:0;max-width:410px;font-size:19px;line-height:1.5;color:#f0ece5}
 .gTabs,.gCats{display:flex;gap:11px;overflow:auto;scrollbar-width:none;max-width:100%;padding:2px 0 4px;-webkit-overflow-scrolling:touch;touch-action:pan-x}.gTabs::-webkit-scrollbar,.gCats::-webkit-scrollbar{display:none}
 .gTabs button,.gCats button{white-space:nowrap;flex:0 0 auto;border:1px solid #9b7433;background:linear-gradient(180deg,#12110f,#080808);color:#f5eee0;border-radius:999px;padding:12px 20px;font-weight:850;box-shadow:inset 0 1px rgba(255,255,255,.03);touch-action:manipulation}
 .gTabs button.on,.gCats button.on{background:linear-gradient(135deg,#f0c46a,#b67b27);color:#171009;border-color:#f1ca78;box-shadow:0 4px 18px rgba(206,151,51,.24)}
 .gCatWrap{position:relative;overflow:hidden;max-width:100%;padding-right:44px}.gCats{padding-right:55px;scroll-snap-type:x proximity}.gCats button{scroll-snap-align:start}
 .gMoreHint{position:absolute;right:0;top:50%;transform:translateY(-53%);z-index:4;width:42px;height:48px;display:grid;place-items:center;border-radius:16px;background:#0c0b09;border:1px solid #9b7433;color:#e9bd67;pointer-events:none}.gMoreHint .arr{font-size:30px;line-height:1}.gMoreHint.hide{opacity:0}
 .gCatNote{font-size:12px;color:#9f8c6a;padding-left:4px;margin-top:-5px}.gCatNote b{color:#d6a84e}
 .gList{display:grid;gap:11px}.gCard{display:grid;grid-template-columns:1fr 118px;min-height:118px;overflow:hidden;background:linear-gradient(135deg,#111,#080808);border:1px solid #815f28;border-radius:21px;box-shadow:0 8px 24px rgba(0,0,0,.28)}
 .gCardBody{padding:16px 16px 13px;min-width:0}.gCard a{display:block;color:#f7f3eb;text-decoration:none;font-size:18px;font-weight:850;line-height:1.3}.gMeta{font-size:12px;color:#bcae95;margin-top:10px;display:flex;gap:10px;flex-wrap:wrap}.gMeta .time{color:#d8a94f}
 .gThumb{display:grid;place-items:center;min-height:100%;border-left:1px solid #60481f;background:radial-gradient(circle at 50% 38%,rgba(236,189,87,.20),transparent 38%),linear-gradient(145deg,#21180c,#0b0b0b);font-size:44px;overflow:hidden}.gThumb span{filter:drop-shadow(0 4px 12px #000)}
 .gWeather{background:linear-gradient(135deg,#15120d,#070707);border:1px solid #9b7433;border-radius:22px;padding:18px;color:#f4ead8}.gWeather b{color:#e8bd67}.gEmpty{text-align:center;color:#aa9b82;padding:34px 10px}.gRetry{border:1px solid #9b7433;background:#111;color:#e5b95f;border-radius:999px;padding:10px 16px;font-weight:800;margin-top:12px}
 @media(max-width:520px){.top{height:76px!important;padding:7px 10px!important}.vLogo{font-size:46px}.vWord{font-size:27px;letter-spacing:1px}.vTr{font-size:19px}.vFlag{font-size:18px}.topActions{gap:5px!important}.topActions .ib{width:39px!important;height:39px!important}.wrap{padding:12px 20px 86px!important}.gHero{min-height:194px;padding:24px 20px}.gGlobe{width:210px;height:210px;right:-82px;top:28px}.gHero h2{font-size:31px}.gHero p{font-size:16px;max-width:300px}.gCard{grid-template-columns:1fr 96px}.gCard a{font-size:16px}.gThumb{font-size:38px}.gTabs button,.gCats button{padding:11px 16px}}
 @media(max-width:390px){.vLogo{font-size:40px}.vWord{font-size:23px}.vTr{font-size:17px}.vFlag{font-size:16px}.topActions .ib{width:36px!important;height:36px!important}.gHero h2{font-size:28px}}
 `; document.head.appendChild(st);

 let scope='turkiye',cat='manset',city='Samsun',lat=null,lon=null,loaded=false,loading=false;
 root.innerHTML=`<div class="gWrap">
 <div class="gHero"><div class="gGlobe" aria-hidden="true"></div><h2>🔥 VİTRİN Gündem</h2><p>Yakınınızdan Türkiye'ye,<br>Türkiye'den dünyaya tek ekranda.</p></div>
 <div class="gTabs"><button type="button" data-s="local">📍 Yakınında</button><button type="button" class="on" data-s="turkiye">🇹🇷 Türkiye</button><button type="button" data-s="world">🌐 Dünya</button></div>
 <div class="gCatWrap"><div class="gCats" id="gCats"><button type="button" class="on" data-c="manset">📰 Manşetler</button><button type="button" data-c="sondakika">🚨 Son Dakika</button><button type="button" data-c="spor">⚽ Spor</button><button type="button" data-c="magazin">🎬 Magazin</button><button type="button" data-c="muzik">🎵 Müzik</button><button type="button" data-c="ekonomi">💰 Ekonomi</button><button type="button" data-c="hava">🌦️ Hava</button><button type="button" data-c="teknoloji">💻 Teknoloji</button></div><div class="gMoreHint" id="gMoreHint"><span class="arr">›</span></div></div>
 <div class="gCatNote"><b>← Kategorileri kaydır →</b> · devamında daha fazla seçenek var</div>
 <div id="gBody"><div class="gEmpty">Gündem'e girdiğinizde haberler yüklenecek.</div></div></div>`;
 const esc=s=>String(s||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
 const ago=d=>{const n=new Date(d);if(isNaN(n))return '';const m=Math.max(1,Math.round((Date.now()-n)/60000));return m<60?`${m} dk önce`:m<1440?`${Math.round(m/60)} sa önce`:`${Math.round(m/1440)} gün önce`};
 const cats=document.getElementById('gCats'),hint=document.getElementById('gMoreHint');
 function updateHint(){if(!cats||!hint)return;hint.classList.toggle('hide',!(cats.scrollWidth>cats.clientWidth+8&&cats.scrollLeft+cats.clientWidth<cats.scrollWidth-10))}
 cats?.addEventListener('scroll',updateHint,{passive:true});window.addEventListener('resize',updateHint);setTimeout(updateHint,120);
 async function locate(){return new Promise(resolve=>{if(!navigator.geolocation)return resolve();navigator.geolocation.getCurrentPosition(async p=>{lat=p.coords.latitude;lon=p.coords.longitude;try{const c=new AbortController();const t=setTimeout(()=>c.abort(),4500);const r=await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`,{headers:{'Accept-Language':'tr'},signal:c.signal});clearTimeout(t);const j=await r.json();city=j.address?.city||j.address?.town||j.address?.province||j.address?.state||city}catch{}resolve()},()=>resolve(),{enableHighAccuracy:false,timeout:5000,maximumAge:600000})})}
 async function weather(){const b=document.getElementById('gBody');b.innerHTML='<div class="gEmpty">Hava durumu yükleniyor…</div>';if(lat==null||lon==null)await locate();if(lat==null||lon==null){b.innerHTML='<div class="gEmpty">Hava durumu için konum izni gerekiyor.</div>';return}try{const c=new AbortController();const t=setTimeout(()=>c.abort(),7000);const r=await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=auto`,{signal:c.signal});clearTimeout(t);const j=await r.json();const x=j.current||{};b.innerHTML=`<div class="gWeather"><b>🌦️ ${esc(city)} Hava Durumu</b><div style="font-size:38px;font-weight:900;margin:10px 0;color:#e8bd67">${Math.round(x.temperature_2m)}°C</div><div>Hissedilen ${Math.round(x.apparent_temperature)}°C · Rüzgâr ${Math.round(x.wind_speed_10m)} km/sa</div><div class="gMeta">Kaynak: Open-Meteo · Güncel ölçüm</div></div>`}catch{b.innerHTML='<div class="gEmpty">Hava durumu alınamadı.<br><button class="gRetry" data-retry="1">Tekrar dene</button></div>'}}
 const thumb=()=>cat==='spor'?'⚽':cat==='ekonomi'?'₺':cat==='teknoloji'?'💻':cat==='magazin'?'🎬':cat==='muzik'?'🎵':scope==='world'?'🌐':scope==='local'?'📍':'🇹🇷';
 async function load(){if(loading)return;loading=true;loaded=true;const b=document.getElementById('gBody');try{if(cat==='hava'){await weather();return}b.innerHTML='<div class="gEmpty">Haberler yükleniyor…</div>';if(scope==='local'&&lat==null)await locate();const c=new AbortController();const t=setTimeout(()=>c.abort(),8000);const r=await fetch(`/api/news?scope=${encodeURIComponent(scope)}&cat=${encodeURIComponent(cat)}&city=${encodeURIComponent(city)}&v=${Date.now()}`,{signal:c.signal,cache:'no-store'});clearTimeout(t);if(!r.ok)throw new Error('news '+r.status);const j=await r.json();const it=Array.isArray(j.items)?j.items:[];b.innerHTML=it.length?`<div class="gList">${it.slice(0,18).map(x=>`<article class="gCard"><div class="gCardBody"><a href="${esc(x.link)}" target="_blank" rel="noopener">${esc(x.title)}</a><div class="gMeta"><span>▣ ${esc(x.source)}</span><span class="time">◷ ${ago(x.pubDate)}</span>${scope==='local'?`<span>📍 ${esc(city)}</span>`:''}</div></div><div class="gThumb"><span>${thumb()}</span></div></article>`).join('')}</div>`:'<div class="gEmpty">Bu bölümde şu anda haber bulunamadı.<br><button class="gRetry" data-retry="1">Tekrar dene</button></div>'}catch(e){console.error('VITRIN agenda',e);b.innerHTML='<div class="gEmpty">Haber bağlantısı gecikti.<br><button class="gRetry" data-retry="1">Tekrar dene</button></div>'}finally{loading=false}}
 const ensureLoaded=()=>{if(!loaded)load()};
 root.addEventListener('click',e=>{const s=e.target.closest('[data-s]');if(s){scope=s.dataset.s;root.querySelectorAll('[data-s]').forEach(y=>y.classList.toggle('on',y===s));load();return}const c=e.target.closest('[data-c]');if(c){cat=c.dataset.c;root.querySelectorAll('[data-c]').forEach(y=>y.classList.toggle('on',y===c));c.scrollIntoView({behavior:'smooth',block:'nearest',inline:'center'});load();return}if(e.target.closest('[data-retry]'))load()});
 document.addEventListener('click',e=>{if(e.target.closest?.('[data-r="agenda"]'))setTimeout(ensureLoaded,30)},{passive:true});
 window.addEventListener('hashchange',()=>{if(location.hash==='#agenda')ensureLoaded()});
 if(location.hash==='#agenda'||root.classList.contains('on'))setTimeout(ensureLoaded,60);
 window.BulutGundem={reload:load};
})();