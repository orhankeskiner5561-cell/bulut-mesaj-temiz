(function(){
  if(window.__vitrinPwaReady)return;window.__vitrinPwaReady=true;
  function addHead(){
    if(!document.querySelector('link[rel="manifest"]')){const m=document.createElement('link');m.rel='manifest';m.href='/manifest.webmanifest';document.head.appendChild(m)}
    if(!document.querySelector('link[rel="apple-touch-icon"]')){const i=document.createElement('link');i.rel='apple-touch-icon';i.href='/vitrin-app-icon.svg';document.head.appendChild(i)}
    const meta=(name,content)=>{let x=document.querySelector('meta[name="'+name+'"]');if(!x){x=document.createElement('meta');x.name=name;document.head.appendChild(x)}x.content=content};
    meta('theme-color','#0b0b0b');meta('mobile-web-app-capable','yes');meta('apple-mobile-web-app-capable','yes');meta('apple-mobile-web-app-status-bar-style','black-translucent');meta('apple-mobile-web-app-title','VİTRİN');
  }
  addHead();
  if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('/vitrin-sw.js',{scope:'/'}).catch(()=>{}));}
  let promptEvent=null;
  window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();promptEvent=e;window.__vitrinInstallApp=async()=>{if(!promptEvent)return false;promptEvent.prompt();await promptEvent.userChoice;promptEvent=null;return true;};document.documentElement.classList.add('vitrin-installable');});
  window.addEventListener('appinstalled',()=>{promptEvent=null;document.documentElement.classList.remove('vitrin-installable');});
  if(window.matchMedia('(display-mode: standalone)').matches||navigator.standalone===true)document.documentElement.classList.add('vitrin-standalone');
})();