// V37 Android system-bar day/night visibility, layered on protected V36
(function(){
'use strict';
if(window.__vitrinV37SystemBars)return;
window.__vitrinV37SystemBars=true;
async function syncBars(){
 const day=document.documentElement.dataset.vitrinMode==='day';
 const cap=window.Capacitor;
 try{
  const StatusBar=cap&&cap.Plugins&&cap.Plugins.StatusBar;
  if(StatusBar){
   await StatusBar.setOverlaysWebView({overlay:false});
   await StatusBar.setBackgroundColor({color:day?'#FFFFFF':'#050505'});
   await StatusBar.setStyle({style:day?'LIGHT':'DARK'});
  }
 }catch(_e){}
 try{
  const NavigationBar=cap&&cap.Plugins&&cap.Plugins.NavigationBar;
  if(NavigationBar){
   await NavigationBar.setColor({color:day?'#FFFFFF':'#050505',darkButtons:day});
  }
 }catch(_e){}
}
const mo=new MutationObserver(syncBars);
mo.observe(document.documentElement,{attributes:true,attributeFilter:['data-vitrin-mode']});
document.addEventListener('click',e=>{if(e.target.closest('.v35ModeBtn'))setTimeout(syncBars,50)},true);
document.addEventListener('DOMContentLoaded',syncBars,{once:true});
[0,300,900].forEach(t=>setTimeout(syncBars,t));
})();
