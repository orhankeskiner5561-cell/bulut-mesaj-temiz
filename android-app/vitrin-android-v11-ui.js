(function(){
  const ID='vitrinAndroidV11Themes';
  if(document.getElementById(ID)) return;

  const EXTRA_TEAMS=[
    ['basaksehir','Başakşehir','#f58220','#17365d'],
    ['bursaspor','Bursaspor','#0f8a3d','#ffffff'],
    ['konyaspor','Konyaspor','#1f9d55','#ffffff'],
    ['goztepe','Göztepe','#d71920','#f7c500'],
    ['adanademir','Adana Demirspor','#68b7e8','#103b66'],
    ['sivasspor','Sivasspor','#d71920','#ffffff'],
    ['kasimpasa','Kasımpaşa','#2c8ad8','#ffffff'],
    ['antalyaspor','Antalyaspor','#d71920','#ffffff'],
    ['kayserispor','Kayserispor','#d71920','#f3c300'],
    ['rizespor','Çaykur Rizespor','#2a78c8','#19a463']
  ];

  const style=document.createElement('style');
  style.id=ID;
  style.textContent=`
    html[data-vitrin-theme="basaksehir"]{--vt-accent:#f58220;--vt-accent2:#17365d;--vt-bg:#0d1622;--vt-surface:#132134;--vt-surface2:#1a2b42;--vt-text:#fff8f0;--vt-muted:#c6b7a7;--vt-line:#5b3b22;--vt-shadow:rgba(245,130,32,.19)}
    html[data-vitrin-theme="bursaspor"]{--vt-accent:#0f8a3d;--vt-accent2:#ffffff;--vt-bg:#07150d;--vt-surface:#0d2115;--vt-surface2:#14301f;--vt-text:#f4fff8;--vt-muted:#a6c5b2;--vt-line:#28583a;--vt-shadow:rgba(15,138,61,.18)}
    html[data-vitrin-theme="konyaspor"]{--vt-accent:#1f9d55;--vt-accent2:#ffffff;--vt-bg:#07140d;--vt-surface:#0d2015;--vt-surface2:#15301f;--vt-text:#f3fff7;--vt-muted:#a7c8b3;--vt-line:#2a5d3c;--vt-shadow:rgba(31,157,85,.18)}
    html[data-vitrin-theme="goztepe"]{--vt-accent:#f7c500;--vt-accent2:#d71920;--vt-bg:#22080a;--vt-surface:#321012;--vt-surface2:#461617;--vt-text:#fff9e9;--vt-muted:#d8b9a5;--vt-line:#7c2a2f;--vt-shadow:rgba(247,197,0,.18)}
    html[data-vitrin-theme="adanademir"]{--vt-accent:#68b7e8;--vt-accent2:#103b66;--vt-bg:#07121b;--vt-surface:#0d1e2b;--vt-surface2:#142b3d;--vt-text:#f3fbff;--vt-muted:#a9c0cf;--vt-line:#295273;--vt-shadow:rgba(104,183,232,.18)}
    html[data-vitrin-theme="sivasspor"]{--vt-accent:#d71920;--vt-accent2:#ffffff;--vt-bg:#120708;--vt-surface:#1d0d0e;--vt-surface2:#2b1416;--vt-text:#fff7f7;--vt-muted:#c8a8aa;--vt-line:#5d2a2d;--vt-shadow:rgba(215,25,32,.18)}
    html[data-vitrin-theme="kasimpasa"]{--vt-accent:#2c8ad8;--vt-accent2:#ffffff;--vt-bg:#07111a;--vt-surface:#0d1b28;--vt-surface2:#14283a;--vt-text:#f4fbff;--vt-muted:#acc0cf;--vt-line:#2b4f70;--vt-shadow:rgba(44,138,216,.18)}
    html[data-vitrin-theme="antalyaspor"]{--vt-accent:#d71920;--vt-accent2:#ffffff;--vt-bg:#110707;--vt-surface:#1c0d0e;--vt-surface2:#291416;--vt-text:#fff7f7;--vt-muted:#c7a7aa;--vt-line:#5b292c;--vt-shadow:rgba(215,25,32,.18)}
    html[data-vitrin-theme="kayserispor"]{--vt-accent:#f3c300;--vt-accent2:#d71920;--vt-bg:#21090a;--vt-surface:#301113;--vt-surface2:#44181a;--vt-text:#fff9e9;--vt-muted:#d6b8a3;--vt-line:#7a2c30;--vt-shadow:rgba(243,195,0,.18)}
    html[data-vitrin-theme="rizespor"]{--vt-accent:#2a78c8;--vt-accent2:#19a463;--vt-bg:#07131a;--vt-surface:#0d2028;--vt-surface2:#15303a;--vt-text:#f2fbff;--vt-muted:#a9c2c8;--vt-line:#2b5862;--vt-shadow:rgba(42,120,200,.18)}

    html body{background:var(--vt-bg)!important;color:var(--vt-text)!important}
    html body .top{background:color-mix(in srgb,var(--vt-surface) 94%,#000)!important;border-bottom-color:var(--vt-line)!important}
    html body .wrap,html body #home,html body #feed{background:var(--vt-bg)!important}
    html body #home>.card:first-of-type,html body .vAndroidStoriesCard{background:var(--vt-bg)!important;border-color:transparent!important}
    html body #home>.card:first-of-type .ring,html body .vAndroidStoriesCard .ring{border-color:var(--vt-accent)!important;background:var(--vt-surface2)!important}
    html body #feed>.card,html body #feed .post,html body #feed .reelFeedCard{background:linear-gradient(180deg,var(--vt-surface),var(--vt-surface2))!important;border-color:var(--vt-line)!important;color:var(--vt-text)!important}
    html body #feed .reelBadge{color:var(--vt-accent)!important;border-color:var(--vt-line)!important;background:var(--vt-surface2)!important}
    html body .v7BottomShell{background:color-mix(in srgb,var(--vt-surface) 94%,#000)!important;border-top-color:var(--vt-line)!important}
    html body .v7BottomShell button{color:var(--vt-text)!important}
    html body .v7BottomShell .v7PlusIcon,html body .v7BottomShell .v7ProfileCircle{border-color:var(--vt-text)!important;color:var(--vt-text)!important}
    html body .v7BottomShell .v7GoldV{color:#D4AF37!important}
    html body .v10SideMenu,html body .v10Panel{background:var(--vt-surface)!important;border-color:var(--vt-line)!important;color:var(--vt-text)!important}
    html body .v10MenuItem{color:var(--vt-text)!important}
    html body .v10MenuItem:active{background:var(--vt-surface2)!important}
    html body .v10MenuTitle,html body .v10Panel h3{color:#D4AF37!important}
    html body .vitrinThemeBtn,html body .vLangBtn{background:var(--vt-surface2)!important;border-color:var(--vt-accent)!important;color:var(--vt-text)!important}
    html body .vitrinThemeSheet,html body .vLangSheet{background:var(--vt-surface)!important;border-color:var(--vt-line)!important;color:var(--vt-text)!important}
    html body .vitrinThemeChoice,html body .vLangItem{background:var(--vt-surface2)!important;border-color:var(--vt-line)!important;color:var(--vt-text)!important}
    html body .vitrinThemeChoice.active,html body .vLangItem.on{outline-color:var(--vt-accent)!important;background:var(--vt-accent)!important;color:#111!important}
    html body .vitrinBrand,html body .vitrinName,html body .vitrinV,html body .v7GoldV{color:#D4AF37!important;-webkit-text-fill-color:#D4AF37!important}

    .goog-logo-link,.goog-te-gadget span,.goog-te-gadget-simple,.goog-te-banner-frame,.skiptranslate iframe,[href*="translate.google"],[href*="google.com"]{display:none!important;visibility:hidden!important}
    body{top:0!important}
  `;
  document.head.appendChild(style);

  function applyTheme(name){
    document.documentElement.setAttribute('data-vitrin-theme',name);
    try{localStorage.setItem('vitrin_theme_v2',name)}catch(_e){}
    document.querySelectorAll('.vitrinThemeChoice').forEach(b=>b.classList.toggle('active',b.dataset.theme===name));
  }

  function addTeams(){
    const scroll=document.querySelector('.vitrinThemeScroll');
    if(!scroll||scroll.querySelector('[data-v11-teams]')) return;
    const section=document.createElement('section');
    section.className='vitrinThemeGroup';
    section.dataset.v11Teams='1';
    section.innerHTML='<h3>Diğer Türkiye Takımları</h3><div class="vitrinThemeGrid">'+EXTRA_TEAMS.map(t=>`<button class="vitrinThemeChoice" data-theme="${t[0]}"><span style="background:linear-gradient(135deg,${t[2]} 50%,${t[3]} 50%)"></span>${t[1]}</button>`).join('')+'</div>';
    scroll.appendChild(section);
    section.querySelectorAll('.vitrinThemeChoice').forEach(b=>b.addEventListener('click',()=>applyTheme(b.dataset.theme)));
    const cur=document.documentElement.getAttribute('data-vitrin-theme');
    section.querySelectorAll('.vitrinThemeChoice').forEach(b=>b.classList.toggle('active',b.dataset.theme===cur));
  }

  function cleanGoogleUI(){
    document.querySelectorAll('a[href*="translate.google"],a[href*="google.com"],.goog-logo-link,.goog-te-gadget-simple').forEach(el=>{el.style.display='none';el.setAttribute('aria-hidden','true')});
    document.querySelectorAll('.goog-te-banner-frame,.skiptranslate iframe').forEach(el=>el.style.display='none');
    document.body.style.top='0px';
  }

  function init(){
    addTeams();cleanGoogleUI();
    const mo=new MutationObserver(()=>{addTeams();cleanGoogleUI()});
    mo.observe(document.body,{childList:true,subtree:true});
    setTimeout(()=>mo.disconnect(),20000);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
