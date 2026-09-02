// V32 protected media/back controller build 2026-09-02
(function(){
'use strict';
if(window.__vitrinV32GlobalMediaBack)return;window.__vitrinV32GlobalMediaBack=true;

const MEDIA='audio,video';
const ROUTE_CLICKS='[data-r],[data-nav],.v7BottomShell button,#homeBtn,#reelsBtn,#profileBtn,#searchBtn,.v10MenuItem,.v21MenuItem,.v22MenuItem';
const LAYERS=[
  '#bulutStoryViewer.on','#bulutStoryCreate.on','.storyViewer.on','.story-modal.on',
  '#sm.on','#vlModal.on','.v22Sheet.on','.v21Sheet.on','.v12SettingsPage.on',
  '.v10Panel.on','.v10MenuBackdrop.on','.modal.on','.modal.show','dialog[open]'
];
let routeStack=[];
let backLock=false;
let installed=false;

function mediaNodes(){return [...document.querySelectorAll(MEDIA)]}
function stopMedia(except=null){
  mediaNodes().forEach(m=>{if(m===except)return;try{if(!m.paused)m.pause()}catch(_e){}});
}
function stopHiddenMedia(){
  mediaNodes().forEach(m=>{try{const r=m.getBoundingClientRect();const visible=r.width>0&&r.height>0&&r.bottom>0&&r.top<innerHeight&&!m.closest('[hidden],.hidden');if(!visible&&!m.paused)m.pause()}catch(_e){}});
}
function currentRoute(){return (location.hash||'#home').replace(/^#/,'').split('/')[0]||'home'}
function rememberRoute(){
  const r=currentRoute();
  if(routeStack[routeStack.length-1]!==r)routeStack.push(r);
  if(routeStack.length>40)routeStack=routeStack.slice(-40);
}
function topLayer(){
  for(const sel of LAYERS){
    const list=[...document.querySelectorAll(sel)].filter(el=>{const s=getComputedStyle(el);return s.display!=='none'&&s.visibility!=='hidden'});
    if(list.length)return list[list.length-1];
  }
  return null;
}
function closeLayer(el){
  if(!el)return false;
  try{
    if(el.tagName==='DIALOG'&&el.open){el.close();stopMedia();return true}
    const close=el.querySelector('[data-close],.close,.modalClose,.sheetClose,.v21Back,.v22Back,#bulutStoryCreateClose,.storyClose,[data-story-close]');
    if(close){close.click();stopMedia();return true}
    el.classList.remove('on','show','open');
    el.hidden=true;
    stopMedia();
    return true;
  }catch(_e){return false}
}
function closeChat(){
  const chat=document.getElementById('chatPanel');
  if(chat&&chat.hidden===false){chat.hidden=true;const list=document.querySelector('.msgCard');if(list)list.hidden=false;try{if(typeof currentChat!=='undefined')currentChat=null}catch(_e){};stopMedia();return true}
  return false;
}
function routeTo(name){
  try{if(typeof route==='function')route(name);else location.hash=name}catch(_e){location.hash=name}
}
function goBack(){
  if(backLock)return true;backLock=true;
  try{
    const layer=topLayer();if(layer&&closeLayer(layer))return true;
    if(closeChat())return true;
    stopMedia();
    const now=currentRoute();
    while(routeStack.length&&routeStack[routeStack.length-1]===now)routeStack.pop();
    const prev=routeStack.pop();
    if(prev){routeTo(prev);setTimeout(rememberRoute,0);return true}
    if(now!=='home'){routeTo('home');setTimeout(rememberRoute,0);return true}
    return true;
  }finally{setTimeout(()=>{backLock=false},120)}
}
function installBack(){
  if(installed)return;
  try{
    const app=window.Capacitor?.Plugins?.App;
    if(app?.addListener){installed=true;app.addListener('backButton',()=>goBack())}
  }catch(_e){}
}

document.addEventListener('play',e=>{const m=e.target;if(m?.matches?.(MEDIA))stopMedia(m)},true);
document.addEventListener('playing',e=>{const m=e.target;if(m?.matches?.(MEDIA))stopMedia(m)},true);
document.addEventListener('click',e=>{
  const t=e.target;if(!t?.closest)return;
  if(t.closest(ROUTE_CLICKS))setTimeout(()=>{stopMedia();stopHiddenMedia();rememberRoute()},0);
  if(t.closest('#bulutStoryCreateClose,.storyClose,[data-story-close],.v21Back,.v22Back'))setTimeout(stopMedia,0);
},true);
window.addEventListener('hashchange',()=>{stopMedia();rememberRoute()});
window.addEventListener('popstate',()=>{stopMedia();rememberRoute()});
document.addEventListener('visibilitychange',()=>{if(document.hidden)stopMedia()});
window.addEventListener('pagehide',()=>stopMedia());

window.__vitrinAndroidBack=goBack;
rememberRoute();installBack();

const mo=new MutationObserver(()=>{installBack();stopHiddenMedia()});
mo.observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['class','hidden','style']});
setTimeout(installBack,250);
setTimeout(installBack,1000);
})();
