(function(){
  const isReels=/reels\.html$/i.test(location.pathname);
  document.documentElement.classList.toggle('vitrin-reels-doc',isReels);

  try{history.scrollRestoration='manual';}catch{}

  // Bu dosya artık videoya ikinci kez dokunmaz. Video hazırlığı yalnızca runtime'da yapılır.
  // Böylece Android WebView'de aynı medya öğesinin iki kez yeniden çizilmesi engellenir.
  function settle(){
    document.documentElement.style.scrollBehavior='auto';
    document.body&&document.body.style.setProperty('scroll-behavior','auto','important');
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',settle,{once:true});
  else settle();

  window.addEventListener('pageshow',()=>{
    requestAnimationFrame(()=>requestAnimationFrame(settle));
  });
})();