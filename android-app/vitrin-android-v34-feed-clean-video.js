// V34 feed video surface cleanup, based on protected V33
(function(){
'use strict';
if(window.__vitrinV34FeedCleanVideo)return;
window.__vitrinV34FeedCleanVideo=true;
const FEED='#feed video,#home video';
let unlocked=false;
function isFeed(v){return !!v?.matches?.(FEED)&&!v.closest('#reels,.reels,#bulutStoryViewer,.storyViewer,.story-modal')}
function clean(v){
  if(!isFeed(v))return;
  try{
    v.removeAttribute('poster');
    v.poster='';
    v.controls=false;
    v.removeAttribute('controls');
    v.playsInline=true;
    v.setAttribute('playsinline','');
    v.setAttribute('webkit-playsinline','');
    v.preload='auto';
    v.style.background='#000';
  }catch(_e){}
}
async function keepMoving(v){
  clean(v);
  if(!isFeed(v))return;
  try{await v.play();return}catch(_e){}
  // Android autoplay can reject sound before the first user gesture.
  // Fall back to muted motion so the large native play picture never covers the video.
  if(!unlocked){
    try{v.muted=true;await v.play()}catch(_e){}
  }
}
function cleanAll(){document.querySelectorAll(FEED).forEach(clean)}
document.addEventListener('loadedmetadata',e=>{const v=e.target;if(isFeed(v)){clean(v);keepMoving(v)}},true);
document.addEventListener('canplay',e=>{const v=e.target;if(isFeed(v)){clean(v);if(v.paused)keepMoving(v)}},true);
document.addEventListener('pause',e=>{const v=e.target;if(isFeed(v)&&document.visibilityState==='visible'){setTimeout(()=>{if(isFeed(v)&&v.getBoundingClientRect().bottom>0&&v.getBoundingClientRect().top<innerHeight)keepMoving(v)},40)}},true);
function unlock(){unlocked=true;const list=[...document.querySelectorAll(FEED)].filter(isFeed);for(const v of list){clean(v);try{v.muted=false;if(v.volume===0)v.volume=1}catch(_e){}}}
document.addEventListener('pointerdown',unlock,{capture:true,passive:true});
document.addEventListener('touchstart',unlock,{capture:true,passive:true});
const mo=new MutationObserver(cleanAll);mo.observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['poster','controls']});
cleanAll();setTimeout(cleanAll,250);setTimeout(cleanAll,1000);
})();
