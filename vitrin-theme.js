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
      if(el.title)el.title=el.title.replace(/\bBULUT\b/gi,'VİTRİN').replace(/[☁🌥🌤🌦🌧🌨⛅]\uFE0F?/gu,'V');
      const a=el.getAttribute('aria-label');if(a)el.setAttribute('aria-label',a.replace(/\bBULUT\b/gi,'VİTRİN').replace(/[☁🌥🌤🌦🌧🌨⛅]\uFE0F?/gu,'V'));
    });
  }
  function replaceCloudMarks(root=document.body){
    if(!root)return;
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
    const nodes=[];let n;
    while((n=walker.nextNode()))nodes.push(n);
    nodes.forEach(t=>{
      const p=t.parentElement,txt=t.nodeValue||'';
      if(!p||p.closest('script,style,textarea,input,.vitrinMiniV')||!/[☁🌥🌤🌦🌧🌨⛅]/u.test(txt))return;
      const frag=document.createDocumentFragment();
      txt.split(/([☁🌥🌤🌦🌧🌨⛅]\uFE0F?)/u).forEach(part=>{
        if(!part)return;
        if(/[☁🌥🌤🌦🌧🌨⛅]/u.test(part)){
          const s=document.createElement('span');s.className='vitrinMiniV';s.textContent='V';frag.appendChild(s);
        }else frag.appendChild(document.createTextNode(part));
      });
      t.replaceWith(frag);
    });
  }
  function groupHtml(g){return '<section class="vitrinThemeGroup"><h3>'+g.title+'</h3><div class="vitrinThemeGrid">'+g.themes.map(t=>'<button class="vitrinThemeChoice" data-theme="'+t[0]+'"><span style="background:'+t[2]+'"></span>'+t[1]+'</button>').join('')+'</div></section>'}
  function buildPicker(){if(document.getElementById('vitrinThemePanel'))return;const panel=document.createElement('div');panel.id='vitrinThemePanel';panel.className='vitrinThemePanel';panel.innerHTML='<div class="vitrinThemeSheet" role="dialog" aria-modal="true"><div class="vitrinThemeHead"><div><b>🎨 Görünüm Teması</b><small>Renkleri anında değiştir</small></div><button class="vitrinThemeClose">✕</button></div><div class="vitrinThemeScroll">'+GROUPS.map(groupHtml).join('')+'</div></div>';document.body.appendChild(panel);panel.addEventListener('click',e=>{if(e.target===panel||e.target.closest('.vitrinThemeClose'))panel.classList.remove('on')});panel.querySelectorAll('.vitrinThemeChoice').forEach(b=>b.addEventListener('click',()=>apply(b.dataset.theme)))}
  function addButton(){const actions=document.querySelector('.topActions');if(!actions||actions.querySelector('.vitrinThemeBtn'))return;const btn=document.createElement('button');btn.type='button';btn.className='vitrinThemeBtn';btn.title='Tema seç';btn.textContent='🎨';btn.addEventListener('click',()=>document.getElementById('vitrinThemePanel')?.classList.add('on'));actions.prepend(btn)}
  function enhanceVisuals(){if(document.getElementById('vitrinFineTuneStyle'))return;const s=document.createElement('style');s.id='vitrinFineTuneStyle';s.textContent='.top,.bottom,.card,.box,.chatComposer,.chatHead,.searchBox,.ib,.ask,.room,.up label,.up button,.pa button,.commentItem,.file,.privacyBox,.notifUnread,.outline,input,textarea,.edit input,.edit textarea,.auth input,.searchBox input,.box input,.box textarea,.commentComposer input,.chatComposer textarea,.vitrinThemeBtn,.vitrinThemeSheet,.vitrinThemeChoice{border-width:2px!important}.card,.box{box-shadow:0 10px 30px var(--vt-shadow),0 0 0 1px color-mix(in srgb,var(--vt-accent2) 34%,transparent)!important}.vitrinV{color:#D4AF37!important;background:none!important;-webkit-text-fill-color:#D4AF37!important;font-size:68px!important;line-height:.72!important;font-weight:900!important;margin-right:2px!important;text-shadow:0 1px 0 #fff7,0 2px 0 #b8891e,0 4px 0 #8b6914,0 7px 13px rgba(0,0,0,.72),0 0 12px rgba(212,175,55,.30)!important}.vitrinMiniV{display:inline-block!important;margin-left:5px!important;color:#D4AF37!important;-webkit-text-fill-color:#D4AF37!important;font-family:Georgia,\'Times New Roman\',serif!important;font-weight:900!important;font-size:1.25em!important;line-height:1!important;vertical-align:-.05em!important;text-shadow:0 1px 0 #fff6,0 2px 0 #8b6914,0 3px 6px #0008!important}@media(max-width:420px){.vitrinV{font-size:62px!important}.vitrinName{font-size:25px!important}}';document.head.appendChild(s)}
  function loadReelsStudio(){if(!/reels\.html$/i.test(location.pathname))return;if(!document.querySelector('link[data-vrs-pro]')){const l=document.createElement('link');l.rel='stylesheet';l.href='vitrin-reels-studio-pro.css?v=5';l.dataset.vrsPro='1';document.head.appendChild(l)}if(!document.querySelector('script[data-vrs-pro]')){const s=document.createElement('script');s.src='vitrin-reels-studio-pro.js?v=5';s.defer=true;s.dataset.vrsPro='1';document.head.appendChild(s)}}
  function refreshBrand(root=document.body){cleanLegacyBrand(root);replaceCloudMarks(root)}
  function init(){apply(current());convertBrand();refreshBrand();buildPicker();addButton();enhanceVisuals();loadReelsStudio();document.title=document.title.replace(/BULUT/gi,'VİTRİN');const mo=new MutationObserver(muts=>{convertBrand();addButton();muts.forEach(m=>m.addedNodes.forEach(node=>{if(node.nodeType===1)refreshBrand(node);else if(node.nodeType===3)refreshBrand(node.parentElement)}))});mo.observe(document.body,{childList:true,subtree:true})}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
