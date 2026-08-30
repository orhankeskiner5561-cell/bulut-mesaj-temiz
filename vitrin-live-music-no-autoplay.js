(function(){
  if(window.__vitrinLiveMusicNoAutoplay)return;
  window.__vitrinLiveMusicNoAutoplay=true;

  function isMusicAudio(el){
    if(!(el instanceof HTMLMediaElement))return false;
    const src=String(el.currentSrc||el.src||'');
    return !!src && (src.includes('itunes.apple.com')||src.includes('mzstatic.com')||src.includes('soundhelix.com')||el.dataset?.vitrinMusic==='1');
  }

  function stopMusic(reset){
    document.querySelectorAll('audio').forEach(a=>{
      if(!isMusicAudio(a))return;
      try{a.pause();if(reset)a.currentTime=0}catch{}
    });
  }

  function renderPlayingState(){
    document.querySelectorAll('.vlMusic').forEach(root=>{
      const top=root.querySelector('[data-listen]');
      if(top){
        top.type='button';
        top.disabled=true;
        top.setAttribute('aria-label','Seçili şarkı');
        top.textContent='🎶 Çalıyor';
        top.style.cursor='default';
      }
    });
  }

  // Sayfa/canlı yayın ekranı ilk açıldığında önceki oturumdan otomatik ses başlamasın.
  stopMusic(true);
  window.addEventListener('pageshow',()=>stopMusic(true));
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')stopMusic(false)});

  // Üstteki seçili parça alanında Dinle yerine durum simgesi göster.
  const mo=new MutationObserver(()=>renderPlayingState());
  mo.observe(document.documentElement,{childList:true,subtree:true});
  renderPlayingState();

  // Kullanıcı açıkça Oynat veya listedeki DİNLE düğmesine basmadıkça müzik başlamasın.
  let userPlayUntil=0;
  document.addEventListener('pointerdown',e=>{
    const b=e.target.closest?.('button');
    if(!b)return;
    const txt=(b.textContent||'').trim().toLocaleUpperCase('tr-TR');
    if(b.matches('[data-act="play"],[data-song],[data-demo]')||txt.includes('OYNAT')||txt==='DİNLE') userPlayUntil=Date.now()+2500;
  },true);
  const originalPlay=HTMLMediaElement.prototype.play;
  HTMLMediaElement.prototype.play=function(){
    if(isMusicAudio(this)&&Date.now()>userPlayUntil){
      try{this.pause()}catch{}
      return Promise.resolve();
    }
    return originalPlay.apply(this,arguments);
  };
})();