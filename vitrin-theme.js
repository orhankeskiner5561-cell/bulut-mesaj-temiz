(function(){
  const GROUPS=[
    {title:'Ana Renkler',themes:[['blue','Mavi','#2d8cff'],['red','Kırmızı','#ef3340'],['green','Yeşil','#19a463'],['orange','Turuncu','#ff8a1f'],['purple','Mor','#8b5cf6'],['light','Açık','#e4bd4e']]},
    {title:'Çift Renkler',themes:[['gold','Siyah - Altın','linear-gradient(135deg,#090909 50%,#d4a72c 50%)'],['blackred','Siyah - Kırmızı','linear-gradient(135deg,#090909 50%,#e11937 50%)'],['blackblue','Siyah - Mavi','linear-gradient(135deg,#090909 50%,#2d8cff 50%)'],['navygold','Lacivert - Altın','linear-gradient(135deg,#071b3b 50%,#e6b72f 50%)']]},
    {title:'Futbol Takım Renkleri',themes:[['galatasaray','Galatasaray','linear-gradient(135deg,#a90432 50%,#fdb912 50%)'],['fenerbahce','Fenerbahçe','linear-gradient(135deg,#082567 50%,#f5d90a 50%)'],['besiktas','Beşiktaş','linear-gradient(135deg,#111 50%,#fff 50%)'],['trabzonspor','Trabzonspor','linear-gradient(135deg,#7a263a 50%,#56a0d3 50%)'],['samsunspor','Samsunspor','linear-gradient(135deg,#d71920 50%,#fff 50%)']]}
  ];
  const THEMES=GROUPS.flatMap(g=>g.themes),KEY='vitrin_theme_v2';
  function current(){return localStorage.getItem(KEY)||localStorage.getItem('vitrin_theme_v1')||'gold'}
  function apply(name){if(!THEMES.some(t=>t[0]===name))name='gold';document.documentElement.setAttribute('data-vitrin-theme',name);localStorage.setItem(KEY,name);document.querySelectorAll('.vitrinThemeChoice').forEach(b=>b.classList.toggle('active',b.dataset.theme===name))}
  function convertBrand(){document.querySelectorAll('.brand').forEach(brand=>{if(brand.querySelector('.vitrinBrand'))return;brand.innerHTML='<span class="vitrinBrand" aria-label="VİTRİN TR"><span class="vitrinV">V</span><span class="vitrinName">VİTRİN</span><span class="vitrinTr">TR</span><span class="vitrinFlag">🇹🇷</span></span>'})}
  function cleanLegacyBrand(root=document.body){
    if(!root)return;
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
    const nodes=[];let n;
    while((n=walker.nextNode()))nodes.push(n);
    nodes.forEach(t=>{
      const p=t.parentElement;
      if(!p||p.closest('script,style,textarea,input'))return;
      let v=t.nodeValue||'';
      v=v.replace(/BULUT\s+Gündem/gi,'VİTRİN Gündem')
           .replace(/BULUT\s+Reels/gi,'VİTRİN Reels')
           .replace(/Gerçek\s+BULUT\s+hesabı/gi,'Gerçek VİTRİN hesabı')
           .replace(/\bBULUT\b/gi,'VİTRİN');
      t.nodeValue=v;
    });
    document.querySelectorAll('[title],[aria-label]').forEach(el=>{
      if(el.title)el.title=el.title.replace(/\bBULUT\b/gi,'VİTRİN');
      const a=el.getAttribute('aria-label');if(a)el.setAttribute('aria-label',a.replace(/\bBULUT\b/gi,'VİTRİN'));
    });
  }
  function goldV(){const s=document.createElement('span');s.className='vitrinMiniV';s.textContent='V';return s}
  function replaceCloudMarks(root=document.body){
    if(!root)return;
    const scope=root.nodeType===1?root:document.body;
    if(scope.matches&&scope.matches('svg.miniBulutLogo'))scope.replaceWith(goldV());
    if(scope.querySelectorAll)scope.querySelectorAll('svg.miniBulutLogo,.miniBulutLogo').forEach(el=>el.replaceWith(goldV()));
    const walker=document.createTreeWalker(scope,NodeFilter.SHOW_TEXT);
    const nodes=[];let n;
    while((n=walker.nextNode()))nodes.push(n);
    nodes.forEach(t=>{
      const p=t.parentElement,txt=t.nodeValue||'';
      if(!p||p.closest('script,style,textarea,input,.vitrinMiniV')||!/[☁🌥🌤🌦🌧🌨⛅]/u.test(txt))return;
      const frag=document.createDocumentFragment();
      txt.split(/([☁🌥🌤🌦🌧🌨⛅]\uFE0F?)/u).forEach(part=>{
        if(!part)return;
        if(/[☁🌥🌤🌦🌧🌨⛅]/u.test(part))frag.appendChild(goldV());
        else frag.appendChild(document.createTextNode(part));
      });
      t.replaceWith(frag);
    });
  }
  function groupHtml(g){return '<section class="vitrinThemeGroup"><h3>'+g.title+'</h3><div class="vitrinThemeGrid">'+g.themes.map(t=>'<button class="vitrinThemeChoice" data-theme="'+t[0]+'"><span style="background:'+t[2]+'"></span>'+t[1]+'</button>').join('')+'</div></section>'}
  function buildPicker(){if(document.getElementById('vitrinThemePanel'))return;const panel=document.createElement('div');panel.id='vitrinThemePanel';panel.className='vitrinThemePanel';panel.innerHTML='<div class="vitrinThemeSheet" role="dialog" aria-modal="true"><div class="vitrinThemeHead"><div><b>🎨 Görünüm Teması</b><small>Renkleri anında değiştir</small></div><button class="vitrinThemeClose">✕</button></div><div class="vitrinThemeScroll">'+GROUPS.map(groupHtml).join('')+'</div></div>';document.body.appendChild(panel);panel.addEventListener('click',e=>{if(e.target===panel||e.target.closest('.vitrinThemeClose'))panel.classList.remove('on')});panel.querySelectorAll('.vitrinThemeChoice').forEach(b=>b.addEventListener('click',()=>apply(b.dataset.theme)))}
  function addButton(){const actions=document.querySelector('.topActions');if(!actions||actions.querySelector('.vitrinThemeBtn'))return;const btn=document.createElement('button');btn.type='button';btn.className='vitrinThemeBtn';btn.title='Tema seç';btn.textContent='🎨';btn.addEventListener('click',()=>document.getElementById('vitrinThemePanel')?.classList.add('on'));actions.prepend(btn)}
  function enhanceVisuals(){if(document.getElementById('vitrinFineTuneStyle'))return;const s=document.createElement('style');s.id='vitrinFineTuneStyle';s.textContent='.top,.bottom,.card,.box,.chatComposer,.chatHead,.searchBox,.ib,.ask,.room,.up label,.up button,.pa button,.commentItem,.file,.privacyBox,.notifUnread,.outline,input,textarea,.edit input,.edit textarea,.auth input,.searchBox input,.box input,.box textarea,.commentComposer input,.chatComposer textarea,.vitrinThemeBtn,.vitrinThemeSheet,.vitrinThemeChoice{border-width:2px!important}.card,.box{box-shadow:0 10px 30px var(--vt-shadow),0 0 0 1px color-mix(in srgb,var(--vt-accent2) 34%,transparent)!important}.vitrinV{color:#D4AF37!important;background:none!important;-webkit-text-fill-color:#D4AF37!important;font-size:72px!important;line-height:.72!important;font-weight:900!important;margin-right:4px!important;text-shadow:0 1px 0 #fff7,0 2px 0 #b8891e,0 4px 0 #8b6914,0 7px 13px rgba(0,0,0,.72),0 0 12px rgba(212,175,55,.30)!important}.vitrinMiniV{display:inline-block!important;margin-left:6px!important;color:#D4AF37!important;-webkit-text-fill-color:#D4AF37!important;font-family:Georgia,\'Times New Roman\',serif!important;font-weight:900!important;font-size:1.42em!important;line-height:1!important;vertical-align:-.08em!important;text-shadow:0 1px 0 #fff6,0 2px 0 #8b6914,0 3px 6px #0008!important}.miniBulutLogo{display:none!important}@media(max-width:420px){.vitrinV{font-size:66px!important}.vitrinName{font-size:25px!important}}';document.head.appendChild(s)}
  function loadReelsStudio(){if(!/reels\.html$/i.test(location.pathname))return;if(!document.querySelector('link[data-vrs-pro]')){const l=document.createElement('link');l.rel='stylesheet';l.href='vitrin-reels-studio-pro.css?v=5';l.dataset.vrsPro='1';document.head.appendChild(l)}if(!document.querySelector('script[data-vrs-pro]')){const s=document.createElement('script');s.src='vitrin-reels-studio-pro.js?v=5';s.defer=true;s.dataset.vrsPro='1';document.head.appendChild(s)}}
  function setupPageTurnNavigation(){
    if(window.__vitrinPageTurnReady)return;window.__vitrinPageTurnReady=true;
    const routes=['home','reels','agenda','rooms','profile'];
    const labels=['Ana Akış','Reels','Gündem','Odalar','Profil'];
    const style=document.createElement('style');style.id='vitrinPageTurnStyle';style.textContent=`
      html{overscroll-behavior-x:none}body{overflow-x:hidden}.wrap,main{perspective:1400px;transform-style:preserve-3d}
      .page.on{transform-origin:center left;backface-visibility:hidden;will-change:transform,opacity,filter}
      body.vt-turn-right .page.on,body.vt-turn-right main{animation:vtPageInRight .38s cubic-bezier(.22,.7,.18,1)}
      body.vt-turn-left .page.on,body.vt-turn-left main{animation:vtPageInLeft .38s cubic-bezier(.22,.7,.18,1)}
      body.vt-leave-right .page.on,body.vt-leave-right main{animation:vtPageOutRight .22s cubic-bezier(.4,0,.7,.2) forwards}
      body.vt-leave-left .page.on,body.vt-leave-left main{animation:vtPageOutLeft .22s cubic-bezier(.4,0,.7,.2) forwards}
      body.vt-dragging .page.on,body.vt-dragging main{transition:none!important;transform:translate3d(var(--vt-drag-x,0),0,0) rotateY(var(--vt-drag-rot,0deg));transform-origin:var(--vt-origin,left center);filter:drop-shadow(var(--vt-shadow-x,0) 10px 24px rgba(0,0,0,.26));will-change:transform}
      body.vt-snapback .page.on,body.vt-snapback main{transition:transform .24s cubic-bezier(.2,.8,.2,1)!important;transform:none!important}
      .bottom button{touch-action:manipulation}.vitrinSwipeHint{position:fixed;left:50%;bottom:78px;z-index:70;transform:translate(-50%,12px);padding:7px 11px;border-radius:999px;background:rgba(10,10,10,.78);border:1px solid var(--vt-line);color:var(--vt-muted);font-size:11px;opacity:0;pointer-events:none;transition:.2s}.vitrinSwipeHint.on{opacity:1;transform:translate(-50%,0)}
      @keyframes vtPageInRight{from{opacity:.25;transform:translateX(34%) rotateY(-10deg);filter:blur(1px)}to{opacity:1;transform:none;filter:none}}
      @keyframes vtPageInLeft{from{opacity:.25;transform:translateX(-34%) rotateY(10deg);filter:blur(1px)}to{opacity:1;transform:none;filter:none}}
      @keyframes vtPageOutRight{to{opacity:.15;transform:translateX(36%) rotateY(-12deg)}}
      @keyframes vtPageOutLeft{to{opacity:.15;transform:translateX(-36%) rotateY(12deg)}}
      @media(prefers-reduced-motion:reduce){body.vt-turn-right .page.on,body.vt-turn-left .page.on,body.vt-turn-right main,body.vt-turn-left main,body.vt-leave-right .page.on,body.vt-leave-left .page.on,body.vt-leave-right main,body.vt-leave-left main{animation:none!important}}
    `;document.head.appendChild(style);
    const hint=document.createElement('div');hint.className='vitrinSwipeHint';hint.textContent='← Parmağınla sayfaları çevir →';document.body.appendChild(hint);setTimeout(()=>{hint.classList.add('on');setTimeout(()=>hint.classList.remove('on'),2600)},700);
    const isReelsDoc=()=>/reels\.html$/i.test(location.pathname);
    function currentIndex(){if(isReelsDoc())return 1;const on=document.querySelector('.page.on');const id=on?.id||location.hash.slice(1)||'home';const i=routes.indexOf(id);return i<0?0:i}
    function markBottom(i){document.querySelectorAll('.bottom button').forEach((b,n)=>b.classList.toggle('on',n===i))}
    function arrive(dir){document.body.classList.remove('vt-turn-left','vt-turn-right');void document.body.offsetWidth;document.body.classList.add(dir>0?'vt-turn-right':'vt-turn-left');setTimeout(()=>document.body.classList.remove('vt-turn-left','vt-turn-right'),430)}
    const saved=Number(sessionStorage.getItem('vitrin_nav_dir')||0);if(saved){sessionStorage.removeItem('vitrin_nav_dir');requestAnimationFrame(()=>arrive(saved))}markBottom(currentIndex());
    function navigateTo(targetIndex,fromSwipe=false){
      if(targetIndex<0||targetIndex>=routes.length)return;
      const from=currentIndex();if(targetIndex===from)return;
      const dir=targetIndex>from?1:-1;
      document.body.classList.remove('vt-snapback','vt-dragging');document.body.style.removeProperty('--vt-drag-x');document.body.style.removeProperty('--vt-drag-rot');
      document.body.classList.add(dir>0?'vt-leave-left':'vt-leave-right');
      const complete=()=>{
        document.body.classList.remove('vt-leave-left','vt-leave-right');
        if(targetIndex===1&&!isReelsDoc()){
          sessionStorage.setItem('vitrin_nav_dir',String(dir));location.href='reels.html';return;
        }
        if(isReelsDoc()&&targetIndex!==1){
          sessionStorage.setItem('vitrin_nav_dir',String(dir));location.href='index.html#'+routes[targetIndex];return;
        }
        if(typeof window.route==='function'){
          window.route(routes[targetIndex]);markBottom(targetIndex);arrive(dir);
        }else location.hash=routes[targetIndex];
      };
      setTimeout(complete,fromSwipe?150:190);
    }
    document.addEventListener('click',e=>{
      const b=e.target.closest('.bottom button');if(!b)return;
      const buttons=[...document.querySelectorAll('.bottom button')],i=buttons.indexOf(b);if(i<0||i>4)return;
      e.preventDefault();e.stopImmediatePropagation();navigateTo(i,false);
    },true);
    let sx=0,sy=0,dx=0,dy=0,tracking=false,eligible=false;
    const blocked=t=>!!t.closest('input,textarea,select,button,a,video,audio,.stories,.vitrinThemeSheet,.vitrinThemeScroll,.modal,.box,[contenteditable="true"]');
    document.addEventListener('touchstart',e=>{
      if(e.touches.length!==1||blocked(e.target))return;const t=e.touches[0];sx=t.clientX;sy=t.clientY;dx=dy=0;tracking=true;eligible=false;
    },{passive:true});
    document.addEventListener('touchmove',e=>{
      if(!tracking||e.touches.length!==1)return;const t=e.touches[0];dx=t.clientX-sx;dy=t.clientY-sy;
      if(!eligible){if(Math.abs(dx)<10)return;if(Math.abs(dy)>Math.abs(dx)*.8){tracking=false;return}eligible=true;document.body.classList.add('vt-dragging')}
      const from=currentIndex();if((from===0&&dx>0)||(from===4&&dx<0))dx*=.26;
      const capped=Math.max(-window.innerWidth*.72,Math.min(window.innerWidth*.72,dx));const rot=(-capped/window.innerWidth)*12;
      document.body.style.setProperty('--vt-drag-x',capped+'px');document.body.style.setProperty('--vt-drag-rot',rot+'deg');document.body.style.setProperty('--vt-origin',capped<0?'left center':'right center');document.body.style.setProperty('--vt-shadow-x',capped<0?'12px':'-12px');
      if(Math.abs(dx)>18)e.preventDefault();
    },{passive:false});
    document.addEventListener('touchend',()=>{
      if(!tracking&&!eligible)return;const from=currentIndex();const threshold=Math.max(58,window.innerWidth*.16);const valid=eligible&&Math.abs(dx)>threshold&&Math.abs(dx)>Math.abs(dy)*1.25;
      document.body.classList.remove('vt-dragging');
      if(valid){const target=dx<0?from+1:from-1;if(target>=0&&target<routes.length){navigateTo(target,true);tracking=eligible=false;return}}
      document.body.classList.add('vt-snapback');setTimeout(()=>document.body.classList.remove('vt-snapback'),260);document.body.style.removeProperty('--vt-drag-x');document.body.style.removeProperty('--vt-drag-rot');tracking=eligible=false;
    },{passive:true});
    window.addEventListener('hashchange',()=>{markBottom(currentIndex())});
  }
  function refreshBrand(root=document.body){cleanLegacyBrand(root);replaceCloudMarks(root)}
  function init(){apply(current());convertBrand();refreshBrand();buildPicker();addButton();enhanceVisuals();loadReelsStudio();setupPageTurnNavigation();document.title=document.title.replace(/BULUT/gi,'VİTRİN');const mo=new MutationObserver(muts=>{convertBrand();addButton();muts.forEach(m=>m.addedNodes.forEach(node=>{if(node.nodeType===1)refreshBrand(node);else if(node.nodeType===3)refreshBrand(node.parentElement)}))});mo.observe(document.body,{childList:true,subtree:true})}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
