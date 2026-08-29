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
          el.classList.add('vitrinGoldBell');el.setAttribute('aria-label','Bildirimler');el.setAttribute('title','Bildirimler');
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
    st.textContent='.vSocialGoldV{color:#D4AF37!important;-webkit-text-fill-color:#D4AF37!important;font-family:Georgia,"Times New Roman",serif!important;font-weight:900!important;text-shadow:0 1px 0 #fff6,0 2px 0 #8b6914,0 3px 6px #0008!important}.bottom .vSocialGoldV{font-size:1.08em!important}.vSocialSheet{position:fixed;inset:0;z-index:120;background:rgba(0,0,0,.62);backdrop-filter:blur(8px);display:none;align-items:flex-end}.vSocialSheet.on{display:flex}.vSocialPanel{width:min(720px,100%);max-height:86vh;overflow:auto;margin:0 auto;background:#0e0e0e;border:2px solid #6e5620;border-radius:26px 26px 0 0;padding:18px 18px 28px;color:#fff;box-shadow:0 -18px 55px #0009}.vSocialHead{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:14px}.vSocialHead h2{margin:0;font-size:26px}.vSocialClose{width:44px;height:44px;border-radius:50%;border:1px solid #6e5620;background:#171717;color:#fff;font-size:24px}.vSocialEntry,.vSocialResource{width:100%;text-align:left;border:2px solid #6e5620;background:#151515;color:#fff;border-radius:18px;padding:16px;margin:10px 0}.vSocialEntry b,.vSocialResource b{display:block;font-size:18px;margin-bottom:4px}.vSocialEntry small,.vSocialResource small{color:#c9b98b}.vLibraryView{display:none}.vLibraryView.on{display:block}.vLibraryCats{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin:12px 0}.vLibraryCat{border:1px solid #6e5620;border-radius:14px;padding:12px;background:#121212;color:#fff;text-align:left}.vLibrarySearch{display:flex;gap:8px;margin:14px 0}.vLibrarySearch input{flex:1;min-width:0;border:2px solid #6e5620;border-radius:14px;padding:12px;background:#0a0a0a;color:#fff;font-size:16px}.vLibrarySearch button{border:0;border-radius:14px;padding:0 16px;background:#D4AF37;color:#111;font-weight:800}.vResourceGrid{display:grid;gap:10px}.vResourceGrid a{text-decoration:none}.vBackBtn{border:1px solid #6e5620;background:#151515;color:#fff;border-radius:14px;padding:10px 14px;margin-bottom:10px}@media(max-width:420px){.vSocialPanel{padding:15px 14px 24px}.vSocialHead h2{font-size:23px}.vLibraryCats{grid-template-columns:1fr 1fr}}';
    document.head.appendChild(st);
  }
  function renameRoomsToVSocial(root=document.body){
    if(!root)return;ensureVSocialStyle();
    const scope=root.nodeType===1?root:document.body;
    const walker=document.createTreeWalker(scope,NodeFilter.SHOW_TEXT),nodes=[];let n;
    while((n=walker.nextNode()))nodes.push(n);
    nodes.forEach(t=>{
      const p=t.parentElement;if(!p||p.closest('script,style,textarea,input,.vSocialGoldV'))return;
      const v=t.nodeValue||'';if(!/(Altın V Sosyal|Odalar)/i.test(v))return;
      const replaced=v.replace(/Altın V Sosyal|Odalar/gi,'V Sosyal');
      const parts=replaced.split(/(V Sosyal)/);const frag=document.createDocumentFragment();
      parts.forEach(part=>{if(part==='V Sosyal'){const gold=document.createElement('span');gold.className='vSocialGoldV';gold.textContent='V';frag.appendChild(gold);frag.appendChild(document.createTextNode(' Sosyal'));}else if(part)frag.appendChild(document.createTextNode(part));});t.replaceWith(frag);
    });
    scope.querySelectorAll?.('[title],[aria-label]').forEach(el=>{if(el.title)el.title=el.title.replace(/Altın V Sosyal|Odalar/gi,'V Sosyal');const a=el.getAttribute('aria-label');if(a)el.setAttribute('aria-label',a.replace(/Altın V Sosyal|Odalar/gi,'V Sosyal'))});
  }
  function buildSocialLibrary(){
    if(document.getElementById('vSocialSheet'))return;
    ensureVSocialStyle();
    const wrap=document.createElement('div');wrap.id='vSocialSheet';wrap.className='vSocialSheet';
    wrap.innerHTML='<section class="vSocialPanel"><div class="vSocialHead"><h2><span class="vSocialGoldV">V</span> Sosyal Etkinlik</h2><button class="vSocialClose" type="button">✕</button></div><div class="vSocialHome"><button class="vSocialEntry vLibraryOpen" type="button"><b>📚 Kütüphane</b><small>Kitap, ansiklopedi, bilim, sanat, coğrafya, hikâye, tarih ve daha fazlası</small></button></div><div class="vLibraryView"><button class="vBackBtn" type="button">← Sosyal Etkinlik</button><h3>📚 VİTRİN Kütüphane</h3><div class="vLibrarySearch"><input id="vLibrarySearchInput" placeholder="Kitap, konu, yazar veya kaynak ara"><button id="vLibrarySearchBtn" type="button">Ara</button></div><div class="vLibraryCats"><button class="vLibraryCat" data-q="bilim kitapları çocuk genç">🔬 Bilim</button><button class="vLibraryCat" data-q="tarih kaynak kitapları">🏛️ Tarih</button><button class="vLibraryCat" data-q="coğrafya atlas kaynakları">🌍 Coğrafya</button><button class="vLibraryCat" data-q="sanat tarihi resim müzik kitapları">🎨 Sanat</button><button class="vLibraryCat" data-q="hikaye masal çocuk kitapları">📖 Hikâye</button><button class="vLibraryCat" data-q="ansiklopedi genel kültür">📚 Ansiklopedi</button></div><div class="vResourceGrid"><a class="vSocialResource" href="https://books.google.com/" target="_blank" rel="noopener"><b>Google Kitaplar</b><small>Kitap ve yazar araması</small></a><a class="vSocialResource" href="https://archive.org/" target="_blank" rel="noopener"><b>Internet Archive</b><small>Dijital kitap ve arşiv kaynakları</small></a><a class="vSocialResource" href="https://www.gutenberg.org/" target="_blank" rel="noopener"><b>Project Gutenberg</b><small>Ücretsiz klasik eserler</small></a><a class="vSocialResource" href="https://tr.wikisource.org/" target="_blank" rel="noopener"><b>Vikikaynak</b><small>Türkçe özgür metinler ve tarihî eserler</small></a><a class="vSocialResource" href="https://tr.wikipedia.org/" target="_blank" rel="noopener"><b>Vikipedi</b><small>Ansiklopedi ve genel bilgi</small></a><a class="vSocialResource" href="https://bilimgenc.tubitak.gov.tr/" target="_blank" rel="noopener"><b>TÜBİTAK Bilim Genç</b><small>Gençler için bilim ve teknoloji kaynakları</small></a></div></div></section>';
    document.body.appendChild(wrap);
    const home=wrap.querySelector('.vSocialHome'),lib=wrap.querySelector('.vLibraryView');
    const close=()=>{wrap.classList.remove('on');lib.classList.remove('on');home.style.display='block'};
    wrap.querySelector('.vSocialClose').addEventListener('click',close);wrap.addEventListener('click',e=>{if(e.target===wrap)close()});
    wrap.querySelector('.vLibraryOpen').addEventListener('click',()=>{home.style.display='none';lib.classList.add('on')});
    wrap.querySelector('.vBackBtn').addEventListener('click',()=>{lib.classList.remove('on');home.style.display='block'});
    const doSearch=q=>{q=(q||'').trim();if(!q)return;window.open('https://www.google.com/search?q='+encodeURIComponent(q),'_blank','noopener')};
    wrap.querySelector('#vLibrarySearchBtn').addEventListener('click',()=>doSearch(wrap.querySelector('#vLibrarySearchInput').value));
    wrap.querySelector('#vLibrarySearchInput').addEventListener('keydown',e=>{if(e.key==='Enter')doSearch(e.currentTarget.value)});
    wrap.querySelectorAll('.vLibraryCat').forEach(b=>b.addEventListener('click',()=>doSearch(b.dataset.q)));
  }
  function upgradeGeneralChat(root=document.body){
    if(!root)return;buildSocialLibrary();const scope=root.nodeType===1?root:document.body;
    const walker=document.createTreeWalker(scope,NodeFilter.SHOW_TEXT),nodes=[];let n;while((n=walker.nextNode()))nodes.push(n);
    nodes.forEach(t=>{if((t.nodeValue||'').trim()==='Genel Sohbet')t.nodeValue='Sosyal Etkinlik'});
    scope.querySelectorAll?.('button,.room,a,[role="button"],div').forEach(el=>{
      const txt=(el.textContent||'').replace(/\s+/g,' ').trim();
      if(!txt.includes('Sosyal Etkinlik')||el.dataset.vSocialBound==='1')return;
      if(txt.length>120)return;
      el.dataset.vSocialBound='1';el.style.cursor='pointer';
      el.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();document.getElementById('vSocialSheet')?.classList.add('on')},true);
    });
  }
  addHead();normalizeGoldBell();refineBrandSpacing();renameRoomsToVSocial();buildSocialLibrary();upgradeGeneralChat();
  const observer=new MutationObserver(muts=>{normalizeGoldBell();muts.forEach(m=>m.addedNodes.forEach(node=>{const r=node.nodeType===1?node:node.parentElement;renameRoomsToVSocial(r);upgradeGeneralChat(r)}))});
  if(document.body)observer.observe(document.body,{childList:true,subtree:true});
  else document.addEventListener('DOMContentLoaded',()=>{normalizeGoldBell();renameRoomsToVSocial();buildSocialLibrary();upgradeGeneralChat();observer.observe(document.body,{childList:true,subtree:true})},{once:true});
  if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('/vitrin-sw.js',{scope:'/'}).catch(()=>{}));}
  let promptEvent=null;window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();promptEvent=e;window.__vitrinInstallApp=async()=>{if(!promptEvent)return false;promptEvent.prompt();await promptEvent.userChoice;promptEvent=null;return true;};document.documentElement.classList.add('vitrin-installable')});
  window.addEventListener('appinstalled',()=>{promptEvent=null;document.documentElement.classList.remove('vitrin-installable')});
  if(window.matchMedia('(display-mode: standalone)').matches||navigator.standalone===true)document.documentElement.classList.add('vitrin-standalone');
})();