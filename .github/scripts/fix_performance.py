from pathlib import Path
import re

p=Path('index.html')
s=p.read_text(encoding='utf-8')

# Eski performans yamasi varsa kaldir.
s=re.sub(r'\n?<style id="bulut-performance-v1">.*?</style>\s*', '\n', s, flags=re.S)
s=re.sub(r'\n?<script id="bulut-performance-v1">.*?</script>\s*', '\n', s, flags=re.S)

# Tum DOM degisimlerinde tum sayfayi tarayan eski observer'i hafiflet.
old="""const run=()=>requestAnimationFrame(cleanDuplicateReelDeleteButtons);\n  document.addEventListener('DOMContentLoaded',run);\n  const mo=new MutationObserver(run);\n  mo.observe(document.documentElement,{subtree:true,childList:true});\n  window.addEventListener('hashchange',run);"""
new="""let cleanScheduled=false;\n  const run=()=>{\n    if(cleanScheduled)return;\n    cleanScheduled=true;\n    requestAnimationFrame(()=>{cleanScheduled=false;cleanDuplicateReelDeleteButtons()});\n  };\n  document.addEventListener('DOMContentLoaded',run,{once:true});\n  const mo=new MutationObserver(run);\n  const watchRoot=document.querySelector('#profile')||document.body;\n  mo.observe(watchRoot,{subtree:true,childList:true});\n  window.addEventListener('hashchange',run);"""
if old in s:
    s=s.replace(old,new,1)

css='''<style id="bulut-performance-v1">
/* BULUT performans V1: ekran disi kartlari tarayici cizmez */
#feed>.card,#pp>.card,.reelFeedCard{content-visibility:auto;contain-intrinsic-size:1px 640px}
.media,.reelMedia{background:#eef5fb}
@media(max-width:420px){.card{box-shadow:0 5px 16px #2a65a010}.back{backdrop-filter:blur(2px)}}
</style>'''

js='''<script id="bulut-performance-v1">
(()=>{
  // Ayni anda gelen cok sayida zil sorgusunu tek sorguda birlestir.
  if(typeof loadNotificationBadge==='function'){
    const originalBadge=loadNotificationBadge;
    let badgePromise=null,lastBadgeRun=0,badgeTimer=null;
    window.loadNotificationBadge=function(force=false){
      const now=Date.now();
      if(!force && badgePromise)return badgePromise;
      if(!force && now-lastBadgeRun<900){
        if(!badgeTimer){
          badgeTimer=setTimeout(()=>{badgeTimer=null;window.loadNotificationBadge(true)},950-(now-lastBadgeRun));
        }
        return Promise.resolve();
      }
      lastBadgeRun=now;
      badgePromise=Promise.resolve(originalBadge()).finally(()=>{badgePromise=null});
      return badgePromise;
    };
  }

  // Resim ve videolari ihtiyac oldugunda yukle; ayni anda gereksiz videolari durdur.
  const tuneMedia=(root=document)=>{
    root.querySelectorAll?.('img').forEach(img=>{if(!img.hasAttribute('loading'))img.loading='lazy';img.decoding='async'});
    root.querySelectorAll?.('video').forEach(v=>{
      if(!v.dataset.bulutPerf){
        v.dataset.bulutPerf='1';
        v.preload='metadata';
        v.playsInline=true;
      }
    });
  };
  tuneMedia();
  let mediaScheduled=false;
  const mediaObserver=new MutationObserver(muts=>{
    if(mediaScheduled)return;
    if(!muts.some(m=>m.addedNodes&&m.addedNodes.length))return;
    mediaScheduled=true;
    requestAnimationFrame(()=>{mediaScheduled=false;tuneMedia()});
  });
  const main=document.querySelector('main')||document.body;
  mediaObserver.observe(main,{subtree:true,childList:true});

  document.addEventListener('visibilitychange',()=>{
    if(document.hidden)document.querySelectorAll('video').forEach(v=>{try{v.pause()}catch(e){}});
  });
})();
</script>'''

s=s.replace('</head>',css+'\n</head>',1)
s=s.replace('</body>',js+'\n</body>',1)
p.write_text(s,encoding='utf-8')
