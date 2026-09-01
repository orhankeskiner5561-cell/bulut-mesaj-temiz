(function(){
  'use strict';
  const ID='vitrinAndroidV21LanguageSearchThemes';
  if(document.getElementById(ID)) return;

  const LANGS=[
    ['tr','Türkçe'],['en','English'],['de','Deutsch'],['fr','Français'],['es','Español'],['it','Italiano'],['pt','Português'],['nl','Nederlands'],['sv','Svenska'],['no','Norsk'],['da','Dansk'],['fi','Suomi'],['is','Íslenska'],['pl','Polski'],['cs','Čeština'],['sk','Slovenčina'],['sl','Slovenščina'],['hr','Hrvatski'],['sr','Srpski'],['bs','Bosanski'],['sq','Shqip'],['mk','Македонски'],['bg','Български'],['ro','Română'],['hu','Magyar'],['el','Ελληνικά'],['ru','Русский'],['uk','Українська'],['be','Беларуская'],['lt','Lietuvių'],['lv','Latviešu'],['et','Eesti'],['ga','Gaeilge'],['cy','Cymraeg'],['mt','Malti'],['eu','Euskara'],['ca','Català'],['gl','Galego'],
    ['ar','العربية'],['fa','فارسی'],['he','עברית'],['ur','اردو'],['ps','پښتو'],['ku','Kurdî'],['az','Azərbaycan'],['ka','ქართული'],['hy','Հայերեն'],['kk','Қазақша'],['ky','Кыргызча'],['uz','O‘zbek'],['tk','Türkmen'],['tg','Тоҷикӣ'],['mn','Монгол'],
    ['hi','हिन्दी'],['bn','বাংলা'],['pa','ਪੰਜਾਬੀ'],['gu','ગુજરાતી'],['mr','मराठी'],['ne','नेपाली'],['si','සිංහල'],['ta','தமிழ்'],['te','తెలుగు'],['kn','ಕನ್ನಡ'],['ml','മലയാളം'],['or','ଓଡ଼ିଆ'],['as','অসমীয়া'],
    ['zh-CN','简体中文'],['zh-TW','繁體中文'],['ja','日本語'],['ko','한국어'],['vi','Tiếng Việt'],['th','ไทย'],['id','Bahasa Indonesia'],['ms','Bahasa Melayu'],['tl','Filipino'],['my','မြန်မာ'],['km','ខ្មែរ'],['lo','ລາວ'],['jv','Basa Jawa'],['su','Basa Sunda'],
    ['sw','Kiswahili'],['af','Afrikaans'],['zu','isiZulu'],['xh','isiXhosa'],['am','አማርኛ'],['so','Soomaali'],['ha','Hausa'],['ig','Igbo'],['yo','Yorùbá'],['rw','Kinyarwanda'],['mg','Malagasy'],['st','Sesotho'],
    ['ht','Kreyòl Ayisyen'],['mi','Māori'],['sm','Gagana Samoa'],['haw','ʻŌlelo Hawaiʻi'],['co','Corsu'],['lb','Lëtzebuergesch'],['la','Latina'],['eo','Esperanto'],['yi','ייִדיש'],['ceb','Cebuano'],['hmn','Hmong']
  ];
  const THEMES=[
    ['gold','Altın','#D4AF37','#111111'],['red','Kırmızı','#e53935','#2a0909'],['blue','Mavi','#2196f3','#071c2d'],['green','Yeşil','#22a65a','#071b10'],['purple','Mor','#8e5ce6','#170b29'],['orange','Turuncu','#ff8a00','#2b1600'],['pink','Pembe','#e75480','#2a0c17'],['cyan','Turkuaz','#00bcd4','#062127'],['white','Beyaz','#f5f5f5','#202020'],['gray','Gri','#9e9e9e','#151515'],['black','Siyah','#555555','#050505'],
    ['galatasaray','Galatasaray','#f7c500','#a71930'],['fenerbahce','Fenerbahçe','#f7df00','#173b72'],['besiktas','Beşiktaş','#f5f5f5','#111111'],['trabzonspor','Trabzonspor','#7a263a','#5bbbe7'],['samsunspor','Samsunspor','#d71920','#ffffff'],['basaksehir','Başakşehir','#f58220','#17365d'],['bursaspor','Bursaspor','#0f8a3d','#ffffff'],['konyaspor','Konyaspor','#1f9d55','#ffffff'],['goztepe','Göztepe','#d71920','#f7c500'],['adanademir','Adana Demirspor','#68b7e8','#103b66'],['sivasspor','Sivasspor','#d71920','#ffffff'],['kasimpasa','Kasımpaşa','#2c8ad8','#ffffff'],['antalyaspor','Antalyaspor','#d71920','#ffffff'],['kayserispor','Kayserispor','#d71920','#f3c300'],['rizespor','Çaykur Rizespor','#2a78c8','#19a463']
  ];

  const st=document.createElement('style');
  st.id=ID;
  st.textContent=`
    .v20QuickActions .v20Globe{font-size:21px!important;width:27px!important;min-width:27px!important;height:34px!important}.v20QuickActions .v20Search{font-size:29px!important}
    .v21Sheet{position:fixed;inset:0;z-index:2147483644;background:#000b;display:none;align-items:flex-end}.v21Sheet.on{display:flex}.v21Panel{width:100%;max-height:82vh;overflow:auto;background:var(--vt-surface,#111);color:var(--vt-text,#fff);border:1px solid var(--vt-line,#333);border-radius:26px 26px 0 0;padding:16px 14px 28px;box-sizing:border-box}.v21Head{display:flex;align-items:center;justify-content:space-between;position:sticky;top:-16px;background:var(--vt-surface,#111);padding:10px 2px 14px;z-index:2}.v21Head h2{margin:0;color:#D4AF37;font:850 21px system-ui}.v21Close{border:0;background:#222;color:#fff;width:38px;height:38px;border-radius:50%;font-size:24px}.v21SearchBox{width:100%;box-sizing:border-box;padding:13px 14px;border-radius:15px;border:1px solid var(--vt-line,#333);background:var(--vt-surface2,#181818);color:var(--vt-text,#fff);font-size:16px;margin-bottom:12px}.v21LangGrid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.v21Lang{min-height:46px;padding:8px 10px;border-radius:13px;border:1px solid var(--vt-line,#333);background:var(--vt-surface2,#181818);color:var(--vt-text,#fff);text-align:left;font:700 13px system-ui}.v21Lang.on{border-color:#D4AF37;box-shadow:0 0 0 1px #D4AF37 inset;color:#D4AF37}.v21Members{display:grid;gap:8px}.v21Member{display:flex;align-items:center;gap:11px;padding:10px;border:1px solid var(--vt-line,#333);border-radius:15px;background:var(--vt-surface2,#181818);color:var(--vt-text,#fff);text-align:left}.v21Avatar{width:46px;height:46px;border-radius:50%;object-fit:cover;background:#333;flex:none}.v21Member b{display:block;font:800 15px system-ui}.v21Member small{color:var(--vt-muted,#aaa)}.v21Status{padding:16px;text-align:center;color:var(--vt-muted,#aaa)}
    .v21ThemeSection{margin-top:18px;border:1px solid var(--vt-line,#333);border-radius:20px;background:var(--vt-surface,#111);padding:16px}.v21ThemeSection h2{margin:0 0 5px;color:#D4AF37;font:850 19px system-ui}.v21ThemeSection p{margin:0 0 14px;color:var(--vt-muted,#aaa);font:13px/1.4 system-ui}.v21ThemeGrid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.v21Theme{display:flex;align-items:center;gap:9px;min-height:44px;border:1px solid var(--vt-line,#333);border-radius:13px;background:var(--vt-surface2,#181818);color:var(--vt-text,#fff);padding:7px 9px;text-align:left;font:750 12px system-ui}.v21Swatch{width:27px;height:27px;border-radius:50%;border:1px solid #ffffff55;flex:none}.v21Theme.on{outline:1px solid #D4AF37;color:#D4AF37}
    .goog-logo-link,.goog-te-gadget,.goog-te-banner-frame,.skiptranslate iframe,[href*='translate.google'],[href*='google.com/translate']{display:none!important;visibility:hidden!important}body{top:0!important}
  `;
  document.head.appendChild(st);

  function sheet(title){
    const s=document.createElement('div');
    s.className='v21Sheet';
    s.innerHTML=`<div class="v21Panel"><div class="v21Head"><h2>${title}</h2><button class="v21Close" type="button">×</button></div><div class="v21Body"></div></div>`;
    document.body.appendChild(s);
    s.querySelector('.v21Close').onclick=()=>s.classList.remove('on');
    s.onclick=e=>{if(e.target===s)s.classList.remove('on')};
    return s;
  }

  const langSheet=sheet('🌐 Dil Seçimi');
  const memberSheet=sheet('🔍 Üye Ara');

  const langBody=langSheet.querySelector('.v21Body');
  langBody.innerHTML='<input class="v21SearchBox" placeholder="Dil ara..." autocomplete="off"><div class="v21LangGrid"></div>';
  const langGrid=langBody.querySelector('.v21LangGrid');
  function currentLang(){try{return localStorage.getItem('vitrin_lang_v21')||'tr'}catch(_e){return 'tr'}}
  function renderLang(q=''){
    const x=q.trim().toLocaleLowerCase('tr');
    langGrid.replaceChildren();
    LANGS.filter(l=>!x||l[1].toLocaleLowerCase('tr').includes(x)||l[0].toLowerCase().includes(x)).forEach(l=>{
      const b=document.createElement('button');b.type='button';b.className='v21Lang'+(currentLang()===l[0]?' on':'');b.dataset.lang=l[0];b.textContent=l[1];b.onclick=()=>setLanguage(l[0]);langGrid.appendChild(b);
    });
  }
  langBody.querySelector('input').oninput=e=>renderLang(e.target.value);
  renderLang();

  function setLanguage(code){
    try{localStorage.setItem('vitrin_lang_v21',code)}catch(_e){}
    document.documentElement.lang=code;
    let done=false,attempt=0;
    const apply=()=>{
      const combo=document.querySelector('.goog-te-combo');
      if(combo){combo.value=code;combo.dispatchEvent(new Event('change',{bubbles:true}));done=true}
      else if(typeof window.doGTranslate==='function'){try{window.doGTranslate('tr|'+code);done=true}catch(_e){}}
      document.querySelectorAll('.v21Lang').forEach(b=>b.classList.toggle('on',b.dataset.lang===code));
      if(done){langSheet.classList.remove('on');return}
      if(++attempt<10)setTimeout(apply,300);
    };
    apply();
  }

  function dbClient(){
    try{if(typeof sb!=='undefined'&&sb?.from)return sb}catch(_e){}
    if(window.sb?.from)return window.sb;
    return null;
  }
  function escText(v){return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
  let searchSeq=0,searchTimer=0;
  function buildMemberSearch(){
    const body=memberSheet.querySelector('.v21Body');
    body.innerHTML='<input class="v21SearchBox" placeholder="Ad, soyad veya kullanıcı adı ara..." autocomplete="off"><div class="v21Members"></div>';
    const input=body.querySelector('input'),host=body.querySelector('.v21Members');
    input.addEventListener('input',()=>{
      clearTimeout(searchTimer);
      const q=input.value.trim().replace(/^@/,'').replace(/[,%()]/g,' ');
      if(q.length<2){host.replaceChildren();return}
      searchTimer=setTimeout(()=>searchMembers(q,input,host),250);
    });
    setTimeout(()=>input.focus(),50);
  }
  async function searchMembers(q,input,host){
    const seq=++searchSeq;
    const c=dbClient();
    if(!c){host.innerHTML='<div class="v21Status">Üye arama bağlantısı hazırlanamadı.</div>';return}
    host.innerHTML='<div class="v21Status">Aranıyor…</div>';
    try{
      const {data,error}=await c.from('profiles').select('id,full_name,username,avatar_url,city,bio,show_followers,show_following').or(`full_name.ilike.%${q}%,username.ilike.%${q}%`).limit(30);
      if(seq!==searchSeq || input.value.trim().replace(/^@/,'').replace(/[,%()]/g,' ')!==q)return;
      if(error)throw error;
      host.replaceChildren();
      if(!data?.length){host.innerHTML='<div class="v21Status">Üye bulunamadı.</div>';return}
      for(const p of data){
        const b=document.createElement('button');b.type='button';b.className='v21Member';b.dataset.profileId=p.id||'';b.dataset.username=p.username||'';
        b.innerHTML=`${p.avatar_url?`<img class="v21Avatar" src="${escText(p.avatar_url)}" alt="">`:'<span class="v21Avatar"></span>'}<span><b>${escText(p.full_name||p.username||'Üye')}</b><small>@${escText(p.username||'uye')}${p.city?' · '+escText(p.city):''}</small></span>`;
        b.onclick=()=>openMemberProfile(p);
        host.appendChild(b);
      }
    }catch(_e){if(seq===searchSeq)host.innerHTML='<div class="v21Status">Arama yapılamadı.</div>'}
  }
  function openMemberProfile(p){
    try{
      if(typeof profilesMap==='object'&&profilesMap&&p?.id)profilesMap[p.id]=p;
      if(typeof viewedProfileId!=='undefined'&&p?.id)viewedProfileId=p.id;
      memberSheet.classList.remove('on');
      if(typeof route==='function'){route('profile');return}
    }catch(_e){}
    memberSheet.classList.remove('on');
    if(p?.username)location.hash='profile/'+encodeURIComponent(p.username);
  }

  function colorsFor(a,b){return{accent:a,accent2:b,bg:`color-mix(in srgb, ${b} 18%, #050505)`,surface:`color-mix(in srgb, ${a} 7%, #111)`,surface2:`color-mix(in srgb, ${a} 12%, #181818)`,line:`color-mix(in srgb, ${a} 35%, #333)`,text:'#ffffff',muted:'#b9b9b9'}}
  function applyTheme(t){
    const c=colorsFor(t[2],t[3]),root=document.documentElement;
    root.style.setProperty('--vt-accent',c.accent);root.style.setProperty('--vt-accent2',c.accent2);root.style.setProperty('--vt-bg',c.bg);root.style.setProperty('--vt-surface',c.surface);root.style.setProperty('--vt-surface2',c.surface2);root.style.setProperty('--vt-line',c.line);root.style.setProperty('--vt-text',c.text);root.style.setProperty('--vt-muted',c.muted);root.dataset.vitrinTheme=t[0];
    try{localStorage.setItem('vitrin_theme_v21',t[0])}catch(_e){}
    document.querySelectorAll('.v21Theme').forEach(b=>b.classList.toggle('on',b.dataset.theme===t[0]));
  }
  function installSettings(){
    const body=document.querySelector('.v12SettingsBody');
    if(!body||body.querySelector('.v21ThemeSection'))return false;
    body.querySelector('.v12SettingsEmpty')?.remove();
    const sec=document.createElement('section');sec.className='v21ThemeSection';sec.innerHTML='<h2>🎨 Görünüm ve Renk Teması</h2><p>VİTRİN markası altın kalır; uygulama arayüzü seçtiğiniz renge veya takım temasına dönüşür.</p><div class="v21ThemeGrid"></div>';
    const grid=sec.querySelector('.v21ThemeGrid');
    THEMES.forEach(t=>{const b=document.createElement('button');b.type='button';b.className='v21Theme';b.dataset.theme=t[0];b.innerHTML=`<span class="v21Swatch" style="background:linear-gradient(135deg,${t[2]} 50%,${t[3]} 50%)"></span>${t[1]}`;b.onclick=()=>applyTheme(t);grid.appendChild(b)});
    body.appendChild(sec);
    let k='gold';try{k=localStorage.getItem('vitrin_theme_v21')||'gold'}catch(_e){}
    applyTheme(THEMES.find(t=>t[0]===k)||THEMES[0]);
    return true;
  }

  let wired=false,wireObserver=null;
  function wire(){
    const globe=document.querySelector('.v20Globe'),search=document.querySelector('.v20Search');
    if(globe&&!globe.dataset.v21){globe.dataset.v21='1';globe.onclick=e=>{e.preventDefault();e.stopImmediatePropagation();langSheet.classList.add('on')}}
    if(search&&!search.dataset.v21){search.dataset.v21='1';search.onclick=e=>{e.preventDefault();e.stopImmediatePropagation();buildMemberSearch();memberSheet.classList.add('on')}}
    installSettings();
    wired=!!(globe&&search&&document.querySelector('.v12SettingsBody'));
    if(wired&&wireObserver){wireObserver.disconnect();wireObserver=null}
  }
  function start(){
    wire();
    if(!wired){wireObserver=new MutationObserver(wire);wireObserver.observe(document.body,{childList:true,subtree:true});setTimeout(()=>{wireObserver?.disconnect();wireObserver=null},12000)}
    [250,800,1800].forEach(ms=>setTimeout(wire,ms));
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
