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
  function refineBrandSpacing(){
    if(document.getElementById('vitrinBrandSpacingStyle'))return;
    const st=document.createElement('style');st.id='vitrinBrandSpacingStyle';
    st.textContent='.vitrinBrand{display:inline-flex!important;align-items:center!important;white-space:nowrap!important;gap:0!important}.vitrinV{margin-right:1px!important}.vitrinName{font-size:30px!important;line-height:1!important;margin-left:0!important;letter-spacing:.2px!important}.vitrinTr{margin-left:10px!important;margin-right:5px!important;line-height:1!important}.vitrinFlag{margin-left:0!important;line-height:1!important;display:inline-block!important}@media(max-width:420px){.vitrinV{margin-right:0!important}.vitrinName{font-size:28px!important}.vitrinTr{margin-left:8px!important;margin-right:4px!important}.vitrinFlag{font-size:18px!important}}';
    document.head.appendChild(st);
  }
  function ensureVSocialStyle(){
    if(document.getElementById('vitrinVSocialStyle'))return;
    const st=document.createElement('style');st.id='vitrinVSocialStyle';
    st.textContent='.vSocialGoldV{color:#D4AF37!important;-webkit-text-fill-color:#D4AF37!important;font-family:Georgia,"Times New Roman",serif!important;font-weight:900!important;text-shadow:0 1px 0 #fff6,0 2px 0 #8b6914,0 3px 6px #0008!important}.bottom .vSocialGoldV{font-size:1.08em!important}';
    document.head.appendChild(st);
  }
  function renameRoomsToVSocial(root=document.body){
    if(!root)return;
    ensureVSocialStyle();
    const scope=root.nodeType===1?root:document.body;
    const walker=document.createTreeWalker(scope,NodeFilter.SHOW_TEXT),nodes=[];let n;
    while((n=walker.nextNode()))nodes.push(n);
    nodes.forEach(t=>{
      const p=t.parentElement;if(!p||p.closest('script,style,textarea,input,.vSocialGoldV'))return;
      const v=t.nodeValue||'';
      if(!/(Altın V Sosyal|Odalar)/i.test(v))return;
      const replaced=v.replace(/Altın V Sosyal|Odalar/gi,'V Sosyal');
      if(!/V Sosyal/.test(replaced)){t.nodeValue=replaced;return;}
      const parts=replaced.split(/(V Sosyal)/);
      const frag=document.createDocumentFragment();
      parts.forEach(part=>{
        if(part==='V Sosyal'){
          const gold=document.createElement('span');gold.className='vSocialGoldV';gold.textContent='V';frag.appendChild(gold);frag.appendChild(document.createTextNode(' Sosyal'));
        }else if(part)frag.appendChild(document.createTextNode(part));
      });
      t.replaceWith(frag);
    });
    scope.querySelectorAll?.('[title],[aria-label]').forEach(el=>{if(el.title)el.title=el.title.replace(/Altın V Sosyal|Odalar/gi,'V Sosyal');const a=el.getAttribute('aria-label');if(a)el.setAttribute('aria-label',a.replace(/Altın V Sosyal|Odalar/gi,'V Sosyal'))});
  }
  addHead();
  normalizeGoldBell();
  refineBrandSpacing();
  renameRoomsToVSocial();
  const observer=new MutationObserver(muts=>{normalizeGoldBell();muts.forEach(m=>m.addedNodes.forEach(node=>renameRoomsToVSocial(node.nodeType===1?node:node.parentElement)))});
  if(document.body)observer.observe(document.body,{childList:true,subtree:true});
  else document.addEventListener('DOMContentLoaded',()=>{normalizeGoldBell();renameRoomsToVSocial();observer.observe(document.body,{childList:true,subtree:true})},{once:true});
  if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('/vitrin-sw.js',{scope:'/'}).catch(()=>{}));}
  let promptEvent=null;
  window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();promptEvent=e;window.__vitrinInstallApp=async()=>{if(!promptEvent)return false;promptEvent.prompt();await promptEvent.userChoice;promptEvent=null;return true;};document.documentElement.classList.add('vitrin-installable');});
  window.addEventListener('appinstalled',()=>{promptEvent=null;document.documentElement.classList.remove('vitrin-installable');});
  if(window.matchMedia('(display-mode: standalone)').matches||navigator.standalone===true)document.documentElement.classList.add('vitrin-standalone');
})();