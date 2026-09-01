(function(){
  const ID='vitrinAndroidV24GooglePopupBlock';
  if(document.getElementById(ID)) return;

  const style=document.createElement('style');
  style.id=ID;
  style.textContent=`
    #goog-gt-tt,
    .goog-te-balloon-frame,
    .goog-te-banner-frame,
    iframe.goog-te-banner-frame,
    .VIpgJd-ZVi9od-ORHb-OEVmcd,
    .VIpgJd-yAWNEb-L7lbkb,
    .VIpgJd-yAWNEb-VIpgJd-fmcmS-sn54Q,
    .VIpgJd-suEOdc,
    .goog-text-highlight,
    body > iframe[src*="translate.google"],
    body > iframe[src*="translate.googleapis"],
    body > div[id^="goog-gt-"]{
      display:none!important;
      visibility:hidden!important;
      opacity:0!important;
      pointer-events:none!important;
      width:0!important;
      height:0!important;
      max-width:0!important;
      max-height:0!important;
      overflow:hidden!important;
    }
    html,body{top:0!important;margin-top:0!important}
    .goog-text-highlight{background:transparent!important;box-shadow:none!important}
  `;
  document.head.appendChild(style);

  const badSelectors=[
    '#goog-gt-tt','.goog-te-balloon-frame','.goog-te-banner-frame',
    '.VIpgJd-ZVi9od-ORHb-OEVmcd','.VIpgJd-yAWNEb-L7lbkb',
    '.VIpgJd-yAWNEb-VIpgJd-fmcmS-sn54Q','.VIpgJd-suEOdc'
  ];

  function hideNode(el){
    if(!el || el.nodeType!==1) return;
    try{
      el.style.setProperty('display','none','important');
      el.style.setProperty('visibility','hidden','important');
      el.style.setProperty('opacity','0','important');
      el.style.setProperty('pointer-events','none','important');
      el.setAttribute('aria-hidden','true');
    }catch(e){}
  }

  function cleanTranslateUi(root=document){
    try{badSelectors.forEach(s=>root.querySelectorAll?.(s).forEach(hideNode))}catch(e){}
    try{
      document.querySelectorAll('body > iframe').forEach(f=>{
        const src=(f.getAttribute('src')||'').toLowerCase();
        if(src.includes('translate.google')||src.includes('translate.googleapis')) hideNode(f);
      });
    }catch(e){}
    try{document.body.style.top='0px'}catch(e){}
  }

  function blockGoogleBubble(e){
    const t=e.target;
    if(!t?.closest) return;
    if(t.closest('#goog-gt-tt,.goog-text-highlight,.VIpgJd-yAWNEb-L7lbkb,.VIpgJd-ZVi9od-ORHb-OEVmcd')){
      e.preventDefault();
      e.stopImmediatePropagation();
      cleanTranslateUi();
    }
  }

  document.addEventListener('click',blockGoogleBubble,true);
  document.addEventListener('touchstart',blockGoogleBubble,{capture:true,passive:false});

  const obs=new MutationObserver(records=>{
    for(const r of records){
      r.addedNodes?.forEach(n=>{
        if(n.nodeType!==1) return;
        cleanTranslateUi(n);
        if(n.matches?.(badSelectors.join(','))) hideNode(n);
      });
    }
    cleanTranslateUi();
  });

  function sweepAfterUserAction(){
    [0,80,180,350,600,900,1400].forEach(ms=>setTimeout(cleanTranslateUi,ms));
  }

  document.addEventListener('click',e=>{
    const t=e.target;
    if(!t?.closest) return;
    if(t.closest('.v21Lang,.v20Globe,[data-language],[data-lang],.v12SettingsBody,.v8SettingsCard,.v21Theme,.v21ThemeBtn,[data-theme],button,[role="button"]')){
      sweepAfterUserAction();
    }
  },true);

  function start(){
    cleanTranslateUi();
    if(document.body) obs.observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['style','class']});
    let n=0;const timer=setInterval(()=>{cleanTranslateUi();if(++n>60)clearInterval(timer)},250);
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();
