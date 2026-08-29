(()=>{
'use strict';
const GOLD='#D4AF37';
function replaceText(root=document.body){
  if(!root)return;
  const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
  const nodes=[];
  while(walker.nextNode())nodes.push(walker.currentNode);
  for(const n of nodes){
    const p=n.parentElement;
    if(!p||p.closest('script,style,textarea,input'))continue;
    let t=n.nodeValue||'';
    const nt=t
      .replace(/BULUT\s+Gündem/gi,'VİTRİN Gündem')
      .replace(/BULUT\s+Reels/gi,'VİTRİN Reels')
      .replace(/Gerçek\s+BULUT\s+hesabı/gi,'Gerçek VİTRİN hesabı')
      .replace(/\bBULUT\b/gi,'VİTRİN')
      .replace(/☁️|☁/g,'V');
    if(nt!==t)n.nodeValue=nt;
  }
}
function styleLegacyV(root=document){
  root.querySelectorAll('*').forEach(el=>{
    if(el.children.length===0 && (el.textContent||'').trim()==='V'){
      el.style.color=GOLD;
      el.style.fontWeight='900';
      el.style.textShadow='0 1px 0 #7d5b00,0 2px 5px rgba(212,175,55,.45)';
    }
  });
}
function sweep(root=document.body){replaceText(root);styleLegacyV(document);document.title=document.title.replace(/BULUT/gi,'VİTRİN')}
function init(){sweep();const mo=new MutationObserver(ms=>{for(const m of ms){for(const n of m.addedNodes){if(n.nodeType===1)sweep(n);else if(n.nodeType===3)replaceText(n.parentElement)}}});mo.observe(document.body,{childList:true,subtree:true,characterData:true})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
