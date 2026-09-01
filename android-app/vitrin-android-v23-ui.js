(function(){
 const ID='vitrinAndroidV23ActiveThemes'; if(document.getElementById(ID))return;
 const THEMES={
 gold:['#D4AF37','#8a6500','#070707','#11100c'],red:['#e53935','#8b1010','#160606','#220909'],blue:['#2196f3','#0d4f8b','#061525','#0b1d31'],green:['#22a65a','#0c6b35','#06170d','#0a2313'],purple:['#8e5ce6','#4a238c','#130a22','#1b102d'],orange:['#ff8a00','#a45100','#241200','#2f1803'],pink:['#e75480','#9f2f55','#250a14','#30101b'],cyan:['#00bcd4','#087687','#051c21','#09262c'],white:['#f5f5f5','#bdbdbd','#171717','#202020'],gray:['#9e9e9e','#616161','#101010','#191919'],black:['#555555','#222222','#030303','#0b0b0b'],
 galatasaray:['#f7c500','#a71930','#190609','#2b0b10'],fenerbahce:['#f7df00','#173b72','#071326','#0b1e38'],besiktas:['#f5f5f5','#111111','#050505','#111111'],trabzonspor:['#7a263a','#5bbbe7','#10070a','#17232a'],samsunspor:['#d71920','#ffffff','#170506','#230a0b'],basaksehir:['#f58220','#17365d','#0d1420','#171d29'],bursaspor:['#0f8a3d','#ffffff','#06150c','#0b2012'],konyaspor:['#1f9d55','#ffffff','#06170e','#0b2214'],goztepe:['#d71920','#f7c500','#1b0903','#28110a'],adanademir:['#68b7e8','#103b66','#07121d','#0b1b2b'],sivasspor:['#d71920','#ffffff','#170506','#230a0b'],kasimpasa:['#2c8ad8','#ffffff','#071522','#0c2030'],antalyaspor:['#d71920','#ffffff','#170506','#230a0b'],kayserispor:['#d71920','#f3c300','#1b0903','#28110a'],rizespor:['#2a78c8','#19a463','#06151a','#0b2224']
 };
 const st=document.createElement('style');st.id=ID;st.textContent=`
 :root{--v23-accent:#D4AF37;--v23-accent2:#8a6500;--v23-bg:#070707;--v23-surface:#11100c;--v23-line:#5b4716;--v23-soft:#1b170d}
 html,body{background:var(--v23-bg)!important;color:#fff!important;transition:background-color .22s ease!important}
 html body .top,html body .v10SideMenu,html body .v22Top,html body .v22Sheet,html body .v12SettingsPage{background:var(--v23-bg)!important;border-color:var(--v23-line)!important}
 html body .vAndroidStoriesCard,html body #home>.card:first-of-type{background:var(--v23-surface)!important;border-color:var(--v23-line)!important}
 html body .vAndroidStoriesCard .ring,html body #home>.card:first-of-type .ring{border-color:var(--v23-accent)!important;box-shadow:0 0 0 1px var(--v23-accent2)!important}
 html body #feed>.card,html body #feed .post,html body #feed .reelFeedCard{background:var(--v23-surface)!important;border-top-color:var(--v23-line)!important;border-bottom-color:var(--v23-line)!important}
 html body .v10MenuItem:active,html body .v10MenuItem:hover,html body .v22Lang.on,html body .v22Theme.on,html body .v21Member,html body .v12SettingsBody>*{background:var(--v23-soft)!important;border-color:var(--v23-line)!important}
 html body .v22BackBtn,html body .v22MenuBack,html body .v10MenuTitle,html body .v22Top h2,html body .v22SectionTitle{color:var(--v23-accent)!important;border-color:var(--v23-accent)!important}
 html body .v22Theme.on,html body .v22Lang.on{color:var(--v23-accent)!important;border-color:var(--v23-accent)!important;box-shadow:0 0 0 1px var(--v23-accent) inset!important}
 html body .v22Search:focus{border-color:var(--v23-accent)!important;box-shadow:0 0 0 1px var(--v23-accent)!important}
 html body .v7BottomShell,html body .bottom{background:var(--v23-bg)!important;border-top-color:var(--v23-line)!important}
 html body .v7BottomShell button,html body .bottom button,html body .bottom a{color:#f5f5f5!important}
 html body .v7BottomShell button.on,html body .bottom .on{color:var(--v23-accent)!important}
 html body .v8ReelOverlay .v8Avatar{border-color:var(--v23-accent)!important}
 html body .v8ReelOverlay .v8Brand{color:#D4AF37!important}
 html body .v12FollowBtn,html body [class*='follow' i]{border-color:var(--v23-accent)!important}
 html body .v10Panel,html body .v21Panel,html body .v22Body .v22Theme,html body .v22Body .v22Lang{border-color:var(--v23-line)!important}
 html body button:focus-visible,html body a:focus-visible{outline:2px solid var(--v23-accent)!important;outline-offset:2px!important}
 `;document.head.appendChild(st);
 function key(){try{return localStorage.getItem('vitrin_theme_v21')||document.documentElement.dataset.vitrinTheme||'gold'}catch(e){return document.documentElement.dataset.vitrinTheme||'gold'}}
 function apply(k){const t=THEMES[k]||THEMES.gold;const r=document.documentElement;r.dataset.vitrinTheme=k;r.style.setProperty('--v23-accent',t[0]);r.style.setProperty('--v23-accent2',t[1]);r.style.setProperty('--v23-bg',t[2]);r.style.setProperty('--v23-surface',t[3]);r.style.setProperty('--v23-line',`color-mix(in srgb, ${t[0]} 42%, #2b2b2b)`);r.style.setProperty('--v23-soft',`color-mix(in srgb, ${t[0]} 13%, ${t[3]})`);try{localStorage.setItem('vitrin_theme_v21',k)}catch(e){}document.querySelectorAll('.v22Theme,.v21Theme').forEach(b=>{const raw=(b.dataset.theme||'').trim();if(raw)b.classList.toggle('on',raw===k)})}
 function infer(btn){const raw=(btn.dataset.theme||btn.closest('[data-theme]')?.dataset.theme||'').trim();if(raw&&THEMES[raw])return raw;const txt=(btn.textContent||'').trim().toLocaleLowerCase('tr');const map={altın:'gold',kırmızı:'red',mavi:'blue',yeşil:'green',mor:'purple',turuncu:'orange',pembe:'pink',turkuaz:'cyan',beyaz:'white',gri:'gray',siyah:'black',galatasaray:'galatasaray',fenerbahçe:'fenerbahce',beşiktaş:'besiktas',trabzonspor:'trabzonspor',samsunspor:'samsunspor',başakşehir:'basaksehir',bursaspor:'bursaspor',konyaspor:'konyaspor',göztepe:'goztepe','adana demirspor':'adanademir',sivasspor:'sivasspor',kasımpaşa:'kasimpasa',antalyaspor:'antalyaspor',kayserispor:'kayserispor','çaykur rizespor':'rizespor'};for(const [n,k] of Object.entries(map))if(txt.includes(n))return k;return null}
 document.addEventListener('click',e=>{const b=e.target.closest('.v22Theme,.v21Theme');if(!b)return;const k=infer(b);if(k)setTimeout(()=>apply(k),0)},true);
 let last='';function sync(){const k=key();if(k!==last){last=k;apply(k)}}
 sync();setInterval(sync,500);new MutationObserver(sync).observe(document.documentElement,{attributes:true,attributeFilter:['data-vitrin-theme']});
})();