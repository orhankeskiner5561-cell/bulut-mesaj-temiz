(function(){
  const GROUPS=[
    {
      title:'Ana Renkler',
      themes:[
        ['blue','Mavi','#2d8cff'],['red','Kırmızı','#ef3340'],['green','Yeşil','#19a463'],
        ['orange','Turuncu','#ff8a1f'],['purple','Mor','#8b5cf6'],['light','Açık','#e4bd4e']
      ]
    },
    {
      title:'Çift Renkler',
      themes:[
        ['gold','Siyah - Altın','linear-gradient(135deg,#090909 50%,#d4a72c 50%)'],
        ['blackred','Siyah - Kırmızı','linear-gradient(135deg,#090909 50%,#e11937 50%)'],
        ['blackblue','Siyah - Mavi','linear-gradient(135deg,#090909 50%,#2d8cff 50%)'],
        ['navygold','Lacivert - Altın','linear-gradient(135deg,#071b3b 50%,#e6b72f 50%)']
      ]
    },
    {
      title:'Futbol Takım Renkleri',
      themes:[
        ['galatasaray','Galatasaray','linear-gradient(135deg,#a90432 50%,#fdb912 50%)'],
        ['fenerbahce','Fenerbahçe','linear-gradient(135deg,#082567 50%,#f5d90a 50%)'],
        ['besiktas','Beşiktaş','linear-gradient(135deg,#111 50%,#fff 50%)'],
        ['trabzonspor','Trabzonspor','linear-gradient(135deg,#7a263a 50%,#56a0d3 50%)'],
        ['samsunspor','Samsunspor','linear-gradient(135deg,#d71920 50%,#fff 50%)']
      ]
    }
  ];
  const THEMES=GROUPS.flatMap(g=>g.themes);
  const KEY='vitrin_theme_v2';
  function current(){return localStorage.getItem(KEY)||localStorage.getItem('vitrin_theme_v1')||'gold'}
  function apply(name){
    if(!THEMES.some(t=>t[0]===name)) name='gold';
    document.documentElement.setAttribute('data-vitrin-theme',name);
    localStorage.setItem(KEY,name);
    document.querySelectorAll('.vitrinThemeChoice').forEach(b=>b.classList.toggle('active',b.dataset.theme===name));
  }
  function convertBrand(){
    document.querySelectorAll('.brand').forEach(brand=>{
      if(brand.querySelector('.vitrinBrand')) return;
      brand.innerHTML='<span class="vitrinBrand" aria-label="VİTRİN TR"><span class="vitrinV">V</span><span class="vitrinName">VİTRİN</span><span class="vitrinTr">TR</span><span class="vitrinFlag">🇹🇷</span></span>';
    });
  }
  function swatchStyle(value){return value.startsWith('linear-gradient')?'background:'+value:'background:'+value}
  function groupHtml(g){
    return '<section class="vitrinThemeGroup"><h3>'+g.title+'</h3><div class="vitrinThemeGrid">'+g.themes.map(t=>'<button class="vitrinThemeChoice" data-theme="'+t[0]+'"><span style="'+swatchStyle(t[2])+'"></span>'+t[1]+'</button>').join('')+'</div></section>';
  }
  function buildPicker(){
    if(document.getElementById('vitrinThemePanel')) return;
    const panel=document.createElement('div'); panel.id='vitrinThemePanel'; panel.className='vitrinThemePanel';
    panel.innerHTML='<div class="vitrinThemeSheet" role="dialog" aria-modal="true" aria-label="Tema seç"><div class="vitrinThemeHead"><div><b>🎨 Görünüm Teması</b><small>Renkleri anında değiştir</small></div><button class="vitrinThemeClose" aria-label="Kapat">✕</button></div><div class="vitrinThemeScroll">'+GROUPS.map(groupHtml).join('')+'</div></div>';
    document.body.appendChild(panel);
    panel.addEventListener('click',e=>{if(e.target===panel||e.target.closest('.vitrinThemeClose')) panel.classList.remove('on')});
    panel.querySelectorAll('.vitrinThemeChoice').forEach(b=>b.addEventListener('click',()=>apply(b.dataset.theme)));
  }
  function addButton(){
    const actions=document.querySelector('.topActions'); if(!actions||actions.querySelector('.vitrinThemeBtn')) return;
    const btn=document.createElement('button'); btn.type='button'; btn.className='vitrinThemeBtn'; btn.title='Tema seç'; btn.setAttribute('aria-label','Tema seç'); btn.textContent='🎨';
    btn.addEventListener('click',()=>document.getElementById('vitrinThemePanel')?.classList.add('on'));
    actions.prepend(btn);
  }
  function init(){
    apply(current()); convertBrand(); buildPicker(); addButton();
    document.title=document.title.replace(/BULUT/gi,'VİTRİN');
    const mo=new MutationObserver(()=>{convertBrand();addButton()}); mo.observe(document.body,{childList:true,subtree:true});
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();
})();
