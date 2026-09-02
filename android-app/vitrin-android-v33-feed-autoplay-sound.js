// V33 main feed autoplay + sound controller, based on protected V32
(function(){
'use strict';
if(window.__vitrinV33FeedAutoplaySound)return;
window.__vitrinV33FeedAutoplaySound=true;

const FEED_VIDEO='#feed video,#home video';
let active=null;
let raf=0;
let unlocked=false;

function onHome(){
  const r=(location.hash||'#home').replace(/^#/,'').split('/')[0]||'home';
  return r==='home';
}
function videos(){
  return [...document.querySelectorAll(FEED_VIDEO)].filter(v=>!v.closest('#bulutStoryViewer,.storyViewer,.story-modal,#reels,.reels'));
}
function visibleScore(v){
  try{
    const r=v.getBoundingClientRect();
    const top=Math.max(0,r.top), bottom=Math.min(innerHeight,r.bottom);
    const visible=Math.max(0,bottom-top);
    if(!visible||r.width<=0||r.height<=0)return -1;
    const ratio=visible/Math.max(1,r.height);
    const center=Math.abs((r.top+r.bottom)/2-innerHeight/2);
    return ratio*1000-center;
  }catch(_e){return -1}
}
function bestVideo(){
  if(!onHome())return null;
  let best=null,score=-1;
  for(const v of videos()){
    const s=visibleScore(v);
    if(s>score){score=s;best=v}
  }
  return score>120?best:null;
}
function pauseOthers(except){
  document.querySelectorAll('audio,video').forEach(m=>{
    if(m===except)return;
    try{if(!m.paused)m.pause()}catch(_e){}
  });
}
function prepare(v){
  if(!v)return;
  try{
    v.playsInline=true;
    v.setAttribute('playsinline','');
    v.setAttribute('webkit-playsinline','');
    v.preload='metadata';
    v.muted=false;
    if(v.volume===0)v.volume=1;
  }catch(_e){}
}
async function playBest(){
  const v=bestVideo();
  if(!v){
    if(active){try{active.pause()}catch(_e){};active=null}
    return;
  }
  if(active&&active!==v){try{active.pause()}catch(_e){}}
  active=v;
  prepare(v);
  pauseOthers(v);
  try{await v.play()}catch(_e){
    // Do not force mute: V33 keeps feed sound open as requested.
  }
}
function schedule(){
  cancelAnimationFrame(raf);
  raf=requestAnimationFrame(()=>playBest());
}
function unlock(){
  unlocked=true;
  schedule();
}

// Feed videos are kept ready and sound-on. V32 still guarantees only one media source plays.
document.addEventListener('loadedmetadata',e=>{const v=e.target;if(v?.matches?.(FEED_VIDEO)){prepare(v);schedule()}},true);
document.addEventListener('play',e=>{const v=e.target;if(v?.matches?.(FEED_VIDEO)){prepare(v);active=v;pauseOthers(v)}},true);
document.addEventListener('volumechange',e=>{const v=e.target;if(v?.matches?.(FEED_VIDEO)&&onHome()&&v===active&&v.muted){try{v.muted=false;if(v.volume===0)v.volume=1}catch(_e){}}},true);

window.addEventListener('scroll',schedule,{passive:true});
window.addEventListener('resize',schedule,{passive:true});
window.addEventListener('hashchange',()=>setTimeout(schedule,30));
window.addEventListener('popstate',()=>setTimeout(schedule,30));
document.addEventListener('pointerdown',unlock,{passive:true,capture:true});
document.addEventListener('touchstart',unlock,{passive:true,capture:true});
document.addEventListener('click',()=>{if(onHome())schedule()},true);
document.addEventListener('visibilitychange',()=>{if(document.hidden){if(active){try{active.pause()}catch(_e){}}}else schedule()});

const io=new IntersectionObserver(()=>schedule(),{threshold:[0,.2,.4,.6,.8,1]});
function bind(){videos().forEach(v=>{if(v.dataset.v33FeedBound==='1')return;v.dataset.v33FeedBound='1';prepare(v);io.observe(v)});schedule()}
new MutationObserver(bind).observe(document.documentElement,{childList:true,subtree:true});

bind();
setTimeout(bind,300);
setTimeout(bind,1200);
})();
