(function(){
 const ID='vitrinAndroidV20GlobeSearch'; if(document.getElementById(ID))return;
 const st=document.createElement('style');st.id=ID;st.textContent=`
 html body .top{grid-template-columns:42px minmax(0,1fr) auto!important;column-gap:8px!important;padding-right:12px!important;overflow:hidden!important}
 html body .top>.brand{overflow:hidden!important}
 html body .top>.v18Actions{display:none!important}
 html body .top>.v20QuickActions{grid-column:3!important;display:flex!important;align-items:center!important;justify-content:flex-end!important;gap:14px!important;min-width:82px!important;margin-left:6px!important}
 html body .v20QuickActions button{appearance:none!important;-webkit-appearance:none!important;border:0!important;background:transparent!important;color:#fff!important;width:34px!important;height:40px!important;display:grid!important;place-items:center!important;padding:0!important;margin:0!important;font-size:27px!important;line-height:1!important;box-shadow:none!important}
 html body .v20QuickActions .v20Globe{color:#23a9ff!important;font-size:29px!important}
 html body .v20QuickActions .v20Search{color:#fff!important;font-size:31px!important;font-family:Arial,sans-serif!important;font-weight:300!important;transform:rotate(-12deg)!important}
 @media(max-width:390px){html body .top{grid-template-columns:38px minmax(0,1fr) auto!important;column-gap:5px!important;padding-right:8px!important}.top>.v20QuickActions{gap:10px!important;min-width:72px!important;margin-left:3px!important}.v20QuickActions button{width:31px!important;height:38px!important}.v20QuickActions .v20Globe{font-size:26px!important}.v20QuickActions .v20Search{font-size:28px!important}}
 `;document.head.appendChild(st);
 function setup(){
  const top=document.querySelector('.top'); if(!top)return;
  const old=top.querySelector(':scope > .v18Actions');
  let q=top.querySelector(':scope > .v20QuickActions');
  if(!q){
   q=document.createElement('div');q.className='v20QuickActions';
   const globe=document.createElement('button');globe.type='button';globe.className='v20Globe';globe.setAttribute('aria-label','Dil seçimi');globe.textContent='🌐';
   const search=document.createElement('button');search.type='button';search.className='v20Search';search.setAttribute('aria-label','Ara');search.textContent='⌕';
   globe.addEventListener('click',()=>{const src=old&&old.children&&old.children[0];if(src)src.click();});
   search.addEventListener('click',()=>{const src=old&&old.children&&old.children[2];if(src)src.click();});
   q.append(globe,search);top.appendChild(q);
  }
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup,{once:true});else setup();
 new MutationObserver(setup).observe(document.documentElement,{subtree:true,childList:true});
 [200,700,1500,2500].forEach(t=>setTimeout(setup,t));
})();