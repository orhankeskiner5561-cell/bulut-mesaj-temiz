// V36 day-mode visibility fixes layered on protected V35
(function(){
'use strict';
if(window.__vitrinV36DayVisibility)return;
window.__vitrinV36DayVisibility=true;
const st=document.createElement('style');
st.id='vitrinAndroidV36DayVisibility';
st.textContent=`
html[data-vitrin-mode="day"]{color-scheme:light;background:#f4f4ef!important}
html[data-vitrin-mode="day"] body,html[data-vitrin-mode="day"] .app,html[data-vitrin-mode="day"] main,html[data-vitrin-mode="day"] .page{background:#f4f4ef!important;color:#151515!important}
html[data-vitrin-mode="day"] .top,html[data-vitrin-mode="day"] header,html[data-vitrin-mode="day"] .bottom{background:#fff!important;color:#111!important;border-color:#c9c2aa!important}
html[data-vitrin-mode="day"] .top button,html[data-vitrin-mode="day"] .top .menu,html[data-vitrin-mode="day"] .top .hamburger,html[data-vitrin-mode="day"] [aria-label*="menü" i],html[data-vitrin-mode="day"] [aria-label*="menu" i]{color:#111!important;opacity:1!important;filter:none!important}
html[data-vitrin-mode="day"] .top svg:not(.vitrinBrandLogo *),html[data-vitrin-mode="day"] .top svg:not(.vitrinBrandLogo *) *{stroke:#111!important}
html[data-vitrin-mode="day"] .v10SideMenu,html[data-vitrin-mode="day"] .v10SideMenu *,html[data-vitrin-mode="day"] .v12SettingsPage,html[data-vitrin-mode="day"] .v12SettingsPage *{color:#171717!important;opacity:1!important}
html[data-vitrin-mode="day"] .v10SideMenu,html[data-vitrin-mode="day"] .v12SettingsPage{background:#fff!important}
html[data-vitrin-mode="day"] .v10SideMenu button,html[data-vitrin-mode="day"] .v10SideMenu a,html[data-vitrin-mode="day"] .v10SideMenu [role="button"]{color:#171717!important;background:transparent!important}
html[data-vitrin-mode="day"] .v10SideMenu hr{border-color:#aaa!important}
html[data-vitrin-mode="day"] .v10SideMenu .danger,html[data-vitrin-mode="day"] .v10SideMenu [class*="logout" i]{color:#d93636!important}
html[data-vitrin-mode="day"] .card,html[data-vitrin-mode="day"] .post,html[data-vitrin-mode="day"] .feed,html[data-vitrin-mode="day"] #feed,html[data-vitrin-mode="day"] #home{background:#f4f4ef!important;color:#151515!important}
html[data-vitrin-mode="day"] input,html[data-vitrin-mode="day"] textarea,html[data-vitrin-mode="day"] select{background:#fff!important;color:#111!important;border-color:#aaa!important}
html[data-vitrin-mode="day"] ::placeholder{color:#666!important;opacity:1!important}
html[data-vitrin-mode="night"]{color-scheme:dark}
`;
document.head.appendChild(st);
function syncSystemBars(){
 const day=document.documentElement.dataset.vitrinMode==='day';
 let meta=document.querySelector('meta[name="theme-color"]');
 if(!meta){meta=document.createElement('meta');meta.name='theme-color';document.head.appendChild(meta)}
 meta.content=day?'#ffffff':'#050505';
 document.documentElement.style.backgroundColor=day?'#f4f4ef':'#000';
 document.body&& (document.body.style.backgroundColor=day?'#f4f4ef':'#000');
}
const mo=new MutationObserver(syncSystemBars);mo.observe(document.documentElement,{attributes:true,attributeFilter:['data-vitrin-mode']});
document.addEventListener('click',e=>{if(e.target.closest('.v35ModeBtn'))setTimeout(syncSystemBars,20)},true);
syncSystemBars();
})();
