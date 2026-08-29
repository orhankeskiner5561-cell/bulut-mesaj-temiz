(function(){
  const THEMES=[
    ['gold','Altın Siyah','#d4a72c'],['blue','Mavi','#2d8cff'],['night','Gece','#6d7cff'],
    ['emerald','Zümrüt','#19a463'],['purple','Mor','#8b5cf6'],['light','Açık','#e4bd4e']
  ];
  const KEY='vitrin_theme_v1';
  function current(){return localStorage.getItem(KEY)||'gold'}
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
  function buildPicker(){
    if(document.getElementById('vitrinThemePanel')) return;
    const panel=document.createElement('div'); panel.id='vitrinThemePanel'; panel.className='vitrinThemePanel';
    panel.innerHTML='<div class="vitrinThemeSheet" role="dialog" aria-modal="true" aria-label="Tema seç"><div class="vitrinThemeHead"><b>🎨 Görünüm Teması</b><button class="vitrinThemeClose" aria-label="Kapat">✕</button></div><div class="vitrinThemeGrid">'+THEMES.map(t=>'<button class="vitrinThemeChoice" data-theme="'+t[0]+'"><span style="background:'+t[2]+'"></span>'+t[1]+'</button>').join('')+'</div></div>';
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
