(function(){
  if(window.__vitrinPwaReady)return;window.__vitrinPwaReady=true;
  function addHead(){
    if(!document.querySelector('link[rel="manifest"]')){const m=document.createElement('link');m.rel='manifest';m.href='/manifest.webmanifest';document.head.appendChild(m)}
    if(!document.querySelector('link[rel="apple-touch-icon"]')){const i=document.createElement('link');i.rel='apple-touch-icon';i.href='/vitrin-app-icon.svg';document.head.appendChild(i)}
    const meta=(name,content)=>{let x=document.querySelector('meta[name="'+name+'"]');if(!x){x=document.createElement('meta');x.name=name;document.head.appendChild(x)}x.content=content};
    meta('theme-color','#0b0b0b');meta('mobile-web-app-capable','yes');meta('apple-mobile-web-app-capable','yes');meta('apple-mobile-web-app-status-bar-style','black-translucent');meta('apple-mobile-web-app-title','VİTRİN');
  }
  function normalizeGoldBell(){
    const styleId='vitrinGoldBellStyle';
    if(!document.getElementById(styleId)){
      const st=document.createElement('style');st.id=styleId;
      st.textContent='.vitrinGoldBell{font-family:"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif!important;font-style:normal!important;font-weight:400!important}.vitrinGoldBell.hasNotification{transform-origin:50% 15%}';
      document.head.appendChild(st);
    }
    document.querySelectorAll('.topActions,.actions').forEach(box=>{
      box.querySelectorAll('button,a').forEach(el=>{
        const title=(el.getAttribute('title')||'').toLowerCase();
        const label=(el.getAttribute('aria-label')||'').toLowerCase();
        const txt=(el.textContent||'').trim();
        if(el.id==='notifBtn'||title.includes('bildirim')||label.includes('bildirim')||txt.includes('🔔')){
          if(txt!=='🔔️')el.textContent='🔔️';
          el.classList.add('vitrinGoldBell');
          el.setAttribute('aria-label','Bildirimler');
          el.setAttribute('title','Bildirimler');
        }
      });
    });
  }
  addHead();
  normalizeGoldBell();
  const bellObserver=new MutationObserver(()=>normalizeGoldBell());
  if(document.body)bellObserver.observe(document.body,{childList:true,subtree:true});
  else document.addEventListener('DOMContentLoaded',()=>{normalizeGoldBell();bellObserver.observe(document.body,{childList:true,subtree:true})},{once:true});
  if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('/vitrin-sw.js',{scope:'/'}).catch(()=>{}));}
  let promptEvent=null;
  window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();promptEvent=e;window.__vitrinInstallApp=async()=>{if(!promptEvent)return false;promptEvent.prompt();await promptEvent.userChoice;promptEvent=null;return true;};document.documentElement.classList.add('vitrin-installable');});
  window.addEventListener('appinstalled',()=>{promptEvent=null;document.documentElement.classList.remove('vitrin-installable');});
  if(window.matchMedia('(display-mode: standalone)').matches||navigator.standalone===true)document.documentElement.classList.add('vitrin-standalone');
})();