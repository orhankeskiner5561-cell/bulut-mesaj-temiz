(()=>{
 const root=document.getElementById('agenda'); if(!root)return;
 const st=document.createElement('style'); st.textContent=`
 #agenda{overflow-x:hidden;max-width:100%;color:#f7ecd4}
 #agenda .gWrap{display:grid;gap:14px;min-width:0;max-width:100%}
 .gHero{position:relative;overflow:hidden;min-height:196px;border:1px solid #b88936;border-radius:26px;padding:28px 24px;background:radial-gradient(circle at 82% 50%,rgba(229,178,72,.28),transparent 33%),linear-gradient(135deg,#070707,#15110b 58%,#050505);box-shadow:inset 0 0 0 1px rgba(255,211,119,.08),0 12px 32px rgba(0,0,0,.35)}
 .gHero:after{content:'🌐';position:absolute;right:-6px;bottom:-24px;font-size:150px;filter:sepia(1) saturate(1.7) brightness(.9);opacity:.42;transform:rotate(-8deg)}
 .gHero h2{position:relative;z-index:2;margin:0 0 12px;font-size:34px;line-height:1.05;color:#e7bd69;text-shadow:0 1px 12px rgba(231,189,105,.22)}
 .gHero p{position:relative;z-index:2;margin:0;max-width:420px;font-size:18px;line-height:1.45;color:#f2ede4}
 .gTabs,.gCats{display:flex;gap:10px;overflow:auto;scrollbar-width:none;max-width:100%;padding:2px 0 4px}.gTabs::-webkit-scrollbar,.gCats::-webkit-scrollbar{display:none}
 .gTabs button,.gCats button{white-space:nowrap;flex:0 0 auto;border:1px solid #9b7433;background:linear-gradient(180deg,#12110f,#090909);color:#f5eee0;border-radius:999px;padding:12px 18px;font-weight:850;box-shadow:inset 0 1px rgba(255,255,255,.03)}
 .gTabs button.on,.gCats button.on{background:linear-gradient(135deg,#f0c46a,#b67b27);color:#171009;border-color:#f1ca78;box-shadow:0 4px 18px rgba(206,151,51,.24)}
 .gCatWrap{position:relative;overflow:hidden;max-width:100%;padding-right:42px}.gCats{padding-right:52px;scroll-snap-type:x proximity}.gCats button{scroll-snap-align:start}
 .gMoreHint{position:absolute;right:0;top:50%;transform:translateY(-53%);z-index:4;width:42px;height:48px;display:grid;place-items:center;border-radius:16px;background:#0c0b09;border:1px solid #9b7433;color:#e9bd67;pointer-events:none}.gMoreHint .arr{font-size:30px;line-height:1}.gMoreHint.hide{opacity:0}
 .gCatNote{font-size:12px;color:#9f8c6a;padding-left:4px;margin-top:-5px}.gCatNote b{color:#d6a84e}
 .gList{display:grid;gap:10px}.gCard{display:grid;grid-template-columns:1fr 116px;min-height:112px;overflow:hidden;background:linear-gradient(135deg,#111,#090909);border:1px solid #815f28;border-radius:20px;box-shadow:0 8px 24px rgba(0,0,0,.28)}
 .gCardBody{padding:16px 16px 13px;min-width:0}.gCard a{display:block;color:#f7f3eb;text-decoration:none;font-size:18px;font-weight:850;line-height:1.28}.gMeta{font-size:12px;color:#bcae95;margin-top:10px;display:flex;gap:10px;flex-wrap:wrap}.gMeta .time{color:#d8a94f}
 .gThumb{display:grid;place-items:center;min-height:100%;border-left:1px solid #60481f;background:radial-gradient(circle at 50% 38%,rgba(236,189,87,.28),transparent 38%),linear-gradient(145deg,#20180c,#0b0b0b);font-size:48px;filter:saturate(.9)}
 .gWeather{background:linear-gradient(135deg,#15120d,#070707);border:1px solid #9b7433;border-radius:22px;padding:18px;color:#f4ead8}.gWeather b{color:#e8bd67}.gEmpty{text-align:center;color:#aa9b82;padding:32px 10px}
 @media(max-width:480px){.gHero{min-height:172px;padding:23px 20px}.gHero:after{font-size:120px;right:-20px}.gHero h2{font-size:30px}.gHero p{font-size:16px;max-width:300px}.gCard{grid-template-columns:1fr 96px}.gCard a{font-size:16px}.gThumb{font-size:40px}.gTabs button,.gCats button{padding:11px 15px}}
 `; document.head.appendChild(st);
 let scope='turkiye',cat='manset',city='Samsun',lat=null,lon=null,loaded=false,loading=false;
 root.innerHTML=`<div class="gWrap">
 <div class="gHero"><h2>🔥 VİTRİN Gündem</h2><p>Yakınınızdan Türkiye'ye,<br>Türkiye'den dünyaya tek ekranda.</p></div>
 <div class="gTabs"><button data-s="local">📍 Yakınında</button><button class="on" data-s="turkiye">🇹🇷 Türkiye</button><button data-s="world">🌐 Dünya</button></div>
 <div class="gCatWrap"><div class="gCats" id="gCats"><button class="on" data-c="manset">📰 Manşetler</button><button data-c="sondakika">🚨 Son Dakika</button><button data-c="spor">⚽ Spor</button><button data-c="magazin">🎬 Magazin</button><button data-c="muzik">🎵 Müzik</button><button data-c="ekonomi">💰 Ekonomi</button><button data-c="hava">🌦️ Hava</button><button data-c="teknoloji">💻 Teknoloji</button></div><div class="gMoreHint" id="gMoreHint"><span class="arr">›</span></div></div>
 <div class="gCatNote"><b>← Kategorileri kaydır →</b> · devamında daha fazla seçenek var</div>
 <div id="gBody"><div class="gEmpty">Gündem'e girdiğinizde haberler yüklenecek.</div></div></div>`;
 const esc=s=>String(s||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
 const ago=d=>{const n=new Date(d);if(isNaN(n))return '';const m=Math.max(1,Math.round((Date.now()-n)/60000));return m<60?`${m} dk önce`:m<1440?`${Math.round(m/60)} sa önce`:`${Math.round(m/1440)} gün önce`};
 const cats=document.getElementById('gCats'),hint=document.getElementById('gMoreHint');
 function updateHint(){if(!cats||!hint)return;hint.classList.toggle('hide',!(cats.scrollWidth>cats.clientWidth+8&&cats.scrollLeft+cats.clientWidth<cats.scrollWidth-10))}
 cats?.addEventListener('scroll',updateHint,{passive:true});window.addEventListener('resize',updateHint);setTimeout(updateHint,120);
 async function locate(){return new Promise(resolve=>{if(!navigator.geolocation)return resolve();navigator.geolocation.getCurrentPosition(async p=>{lat=p.coords.latitude;lon=p.coords.longitude;try{const r=await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`,{headers:{'Accept-Language':'tr'}});const j=await r.json();city=j.address?.city||j.address?.town||j.address?.province||j.address?.state||city}catch{}resolve()},()=>resolve(),{enableHighAccuracy:false,timeout:5000,maximumAge:600000})})}
 async function weather(){const b=document.getElementById('gBody');b.innerHTML='<div class="gEmpty">Hava durumu yükleniyor…</div>';if(lat==null||lon==null)await locate();if(lat==null||lon==null){b.innerHTML='<div class="gEmpty">Hava durumu için konum izni gerekiyor.</div>';return}try{const r=await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=auto`);const j=await r.json();const c=j.current||{};b.innerHTML=`<div class="gWeather"><b>🌦️ ${esc(city)} Hava Durumu</b><div style="font-size:38px;font-weight:900;margin:10px 0;color:#e8bd67">${Math.round(c.temperature_2m)}°C</div><div>Hissedilen ${Math.round(c.apparent_temperature)}°C · Rüzgâr ${Math.round(c.wind_speed_10m)} km/sa</div><div class="gMeta">Kaynak: Open-Meteo · Güncel ölçüm</div></div>`}catch{b.innerHTML='<div class="gEmpty">Hava durumu alınamadı.</div>'}}
 const thumb=()=>cat==='spor'?'⚽':cat==='ekonomi'?'₺':cat==='teknoloji'?'💻':cat==='magazin'?'🎬':cat==='muzik'?'🎵':scope==='world'?'🌐':scope==='local'?'📍':'🇹🇷';
 async function load(){if(loading)return;loading=true;loaded=true;try{if(cat==='hava')return await weather();const b=document.getElementById('gBody');b.innerHTML='<div class="gEmpty">Haberler yükleniyor…</div>';if(scope==='local'&&!lat)await locate();try{const r=await fetch(`/api/news?scope=${encodeURIComponent(scope)}&cat=${encodeURIComponent(cat)}&city=${encodeURIComponent(city)}`);const j=await r.json();const it=j.items||[];b.innerHTML=it.length?`<div class="gList">${it.map(x=>`<article class="gCard"><div class="gCardBody"><a href="${esc(x.link)}" target="_blank" rel="noopener">${esc(x.title)}</a><div class="gMeta"><span>📰 ${esc(x.source)}</span><span class="time">◷ ${ago(x.pubDate)}</span>${scope==='local'?`<span>📍 ${esc(city)}</span>`:''}</div></div><div class="gThumb">${thumb()}</div></article>`).join('')}</div>`:'<div class="gEmpty">Bu bölümde şu anda haber bulunamadı.</div>'}catch{b.innerHTML='<div class="gEmpty">Haberler şu anda alınamıyor.</div>'}}finally{loading=false}}
 const ensureLoaded=()=>{if(!loaded)load()};
 root.querySelectorAll('[data-s]').forEach(x=>x.onclick=()=>{scope=x.dataset.s;root.querySelectorAll('[data-s]').forEach(y=>y.classList.toggle('on',y===x));load()});
 root.querySelectorAll('[data-c]').forEach(x=>x.onclick=()=>{cat=x.dataset.c;root.querySelectorAll('[data-c]').forEach(y=>y.classList.toggle('on',y===x));x.scrollIntoView({behavior:'smooth',block:'nearest',inline:'center'});load()});
 document.addEventListener('click',e=>{if(e.target.closest?.('[data-r="agenda"]'))setTimeout(ensureLoaded,0)},{passive:true});
 window.addEventListener('hashchange',()=>{if(location.hash==='#agenda')ensureLoaded()});
 if(location.hash==='#agenda'||root.classList.contains('on'))ensureLoaded();
 window.BulutGundem={reload:load};
})();