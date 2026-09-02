// V35 day/night display mode controller, based on protected V34
(function(){
'use strict';
if(window.__vitrinV35DayNightTheme)return;
window.__vitrinV35DayNightTheme=true;

const KEY='vitrin_display_mode_v35';
const root=document.documentElement;

const st=document.createElement('style');
st.id='vitrinAndroidV35DayNightTheme';
st.textContent=`
.v35ModeSection{margin:0 0 16px;padding:14px;border:1px solid var(--vt-line,#333);border-radius:18px;background:var(--vt-surface,#111)}
.v35ModeTitle{margin:0 0 10px;color:#d4af37;font:850 14px system-ui}
.v35ModeGrid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.v35ModeBtn{min-height:58px;border:1px solid var(--vt-line,#333);border-radius:16px;background:var(--vt-surface2,#181818);color:var(--vt-text,#fff);font:800 15px system-ui;display:flex;align-items:center;justify-content:center;gap:9px}
.v35ModeBtn span{font-size:24px}.v35ModeBtn.on{border-color:#d4af37;box-shadow:0 0 0 1px #d4af37 inset;color:#d4af37}
html[data-vitrin-mode="day"] body{background:#f4f4ef!important;color:#151515!important}
html[data-vitrin-mode="day"] .top,html[data-vitrin-mode="day"] .bottom{background:#fff!important;color:#151515!important;border-color:#d8d2bf!important}
html[data-vitrin-mode="day"] .card,html[data-vitrin-mode="day"] .post,html[data-vitrin-mode="day"] .v21Panel,html[data-vitrin-mode="day"] .v21ThemeSection,html[data-vitrin-mode="day"] .v22Sheet,html[data-vitrin-mode="day"] .v22Top,html[data-vitrin-mode="day"] .v22Body,html[data-vitrin-mode="day"] .v10SideMenu,html[data-vitrin-mode="day"] .v12SettingsPage{background:#fff!important;color:#151515!important}
html[data-vitrin-mode="day"] .v22Search,html[data-vitrin-mode="day"] .v22Theme,html[data-vitrin-mode="day"] .v21SearchBox,html[data-vitrin-mode="day"] .v21Theme,html[data-vitrin-mode="day"] .v21Member,html[data-vitrin-mode="day"] .v35ModeBtn{background:#f3f3ee!important;color:#151515!important;border-color:#d8d2bf!important}
html[data-vitrin-mode="day"] .muted,html[data-vitrin-mode="day"] small{color:#676767!important}
html[data-vitrin-mode="night"] body{background:#000!important;color:#fff!important}
html[data-vitrin-mode="night"] .top,html[data-vitrin-mode="night"] .bottom,html[data-vitrin-mode="night"] .card,html[data-vitrin-mode="night"] .post,html[data-vitrin-mode="night"] .v21Panel,html[data-vitrin-mode="night"] .v21ThemeSection,html[data-vitrin-mode="night"] .v22Sheet,html[data-vitrin-mode="night"] .v22Top,html[data-vitrin-mode="night"] .v22Body,html[data-vitrin-mode="night"] .v10SideMenu,html[data-vitrin-mode="night"] .v12SettingsPage{background:#050505!important;color:#fff!important}
html[data-vitrin-mode="night"] .v22Search,html[data-vitrin-mode="night"] .v22Theme,html[data-vitrin-mode="night"] .v21SearchBox,html[data-vitrin-mode="night"] .v21Theme,html[data-vitrin-mode="night"] .v21Member,html[data-vitrin-mode="night"] .v35ModeBtn{background:#141414!important;color:#fff!important;border-color:#303030!important}
`;
document.head.appendChild(st);

function savedMode(){try{return localStorage.getItem(KEY)||'night'}catch(_e){return 'night'}}
function applyMode(mode){
  mode=mode==='day'?'day':'night';
  root.dataset.vitrinMode=mode;
  const day=mode==='day';
  root.style.setProperty('--vt-bg',day?'#f4f4ef':'#000000','important');
  root.style.setProperty('--vt-surface',day?'#ffffff':'#050505','important');
  root.style.setProperty('--vt-surface2',day?'#f3f3ee':'#141414','important');
  root.style.setProperty('--vt-line',day?'#d8d2bf':'#303030','important');
  root.style.setProperty('--vt-text',day?'#151515':'#ffffff','important');
  root.style.setProperty('--vt-muted',day?'#676767':'#b9b9b9','important');
  try{localStorage.setItem(KEY,mode)}catch(_e){}
  document.querySelectorAll('.v35ModeBtn').forEach(b=>b.classList.toggle('on',b.dataset.mode===mode));
}
function installModeButtons(){
  document.querySelectorAll('.v22Body').forEach(body=>{
    if(body.querySelector('.v35ModeSection'))return;
    const themeGrid=body.querySelector('.v22ThemeGrid');
    if(!themeGrid)return;
    const sec=document.createElement('section');sec.className='v35ModeSection';
    sec.innerHTML='<div class="v35ModeTitle">Ekran Modu</div><div class="v35ModeGrid"><button type="button" class="v35ModeBtn" data-mode="day"><span>☀️</span>Gündüz</button><button type="button" class="v35ModeBtn" data-mode="night"><span>🌙</span>Gece</button></div>';
    body.insertBefore(sec,body.firstChild);
    sec.querySelectorAll('.v35ModeBtn').forEach(b=>b.onclick=()=>applyMode(b.dataset.mode));
    applyMode(savedMode());
  });
}

document.addEventListener('click',e=>{
  if(e.target.closest('.v22Theme,.v21Theme'))setTimeout(()=>applyMode(savedMode()),140);
},true);

const mo=new MutationObserver(()=>installModeButtons());
mo.observe(document.documentElement,{subtree:true,childList:true});
applyMode(savedMode());
installModeButtons();
[250,700,1400,2400].forEach(t=>setTimeout(installModeButtons,t));
})();
