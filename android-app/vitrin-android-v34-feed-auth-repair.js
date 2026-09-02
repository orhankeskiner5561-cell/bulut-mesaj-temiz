// V34 clean feed video + auth route repair, based only on protected V33
(function(){
'use strict';
if(window.__vitrinV34FeedAuthRepair)return;
window.__vitrinV34FeedAuthRepair=true;

const FEED_VIDEO='#feed video,#home video';
let unlocked=false;

function isFeedVideo(v){return !!(v&&v.matches&&v.matches(FEED_VIDEO)&&!v.closest('#bulutStoryViewer,.storyViewer,.story-modal,#reels,.reels'))}
function currentRoute(){return (location.hash||'#home').replace(/^#/,'').split('/')[0]||'home'}
function cleanVideo(v){
  if(!isFeedVideo(v))return;
  try{
    v.controls=false;
    v.removeAttribute('controls');
    v.removeAttribute('poster');
    v.playsInline=true;
    v.setAttribute('playsinline','');
    v.setAttribute('webkit-playsinline','');
    v.preload='auto';
    v.disablePictureInPicture=true;
    v.setAttribute('disablepictureinpicture','');
  }catch(_e){}
}
async function primeVideo(v){
  if(!isFeedVideo(v))return;
  cleanVideo(v);
  try{
    if(v.readyState>=2&&v.currentTime===0&&Number.isFinite(v.duration)&&v.duration>0.05){
      v.currentTime=Math.min(0.05,Math.max(0.01,v.duration/1000));
    }
  }catch(_e){}
  try{
    if(v.paused){
      const p=v.play();
      if(p&&typeof p.catch==='function'){
        await p.catch(async()=>{
          if(unlocked)return;
          const wasMuted=v.muted;
          try{v.muted=true;await v.play()}catch(_e){}
          try{v.muted=wasMuted}catch(_e){}
        });
      }
    }
  }catch(_e){}
}
function cleanAll(){document.querySelectorAll(FEED_VIDEO).forEach(cleanVideo)}
function installStyle(){
  if(document.getElementById('v34FeedCleanStyle'))return;
  const s=document.createElement('style');
  s.id='v34FeedCleanStyle';
  s.textContent=`
    #feed video,#home video{background:#000!important;outline:0!important}
    #feed video::-webkit-media-controls,#home video::-webkit-media-controls,
    #feed video::-webkit-media-controls-enclosure,#home video::-webkit-media-controls-enclosure,
    #feed video::-webkit-media-controls-panel,#home video::-webkit-media-controls-panel,
    #feed video::-webkit-media-controls-overlay-play-button,#home video::-webkit-media-controls-overlay-play-button,
    #feed video::-webkit-media-controls-start-playback-button,#home video::-webkit-media-controls-start-playback-button,
    #feed video::-webkit-media-controls-play-button,#home video::-webkit-media-controls-play-button{
      display:none!important;opacity:0!important;pointer-events:none!important
    }
  `;
  document.head.appendChild(s);
}
async function repairAuthRoute(){
  try{
    if(typeof sb==='undefined'||!sb?.auth?.getSession)return;
    const {data}=await sb.auth.getSession();
    const s=data?.session||null;
    const r=currentRoute();
    if(s&&(r==='login'||r==='register')){
      try{if(typeof route==='function')route('home');else location.hash='home'}catch(_e){location.hash='home'}
    }
  }catch(_e){}
}
function installAuthRepair(){
  repairAuthRoute();
  try{
    if(typeof sb!=='undefined'&&sb?.auth?.onAuthStateChange&&!window.__v34AuthRouteListener){
      window.__v34AuthRouteListener=true;
      sb.auth.onAuthStateChange((event,s)=>{
        if(s&&(event==='SIGNED_IN'||event==='INITIAL_SESSION'||event==='TOKEN_REFRESHED')){
          const r=currentRoute();
          if(r==='login'||r==='register')setTimeout(()=>{
            try{if(typeof route==='function')route('home');else location.hash='home'}catch(_e){location.hash='home'}
          },0);
        }
      });
    }
  }catch(_e){}
}

installStyle();
cleanAll();
installAuthRepair();

document.addEventListener('loadedmetadata',e=>{const v=e.target;if(isFeedVideo(v))primeVideo(v)},true);
document.addEventListener('canplay',e=>{const v=e.target;if(isFeedVideo(v))cleanVideo(v)},true);
document.addEventListener('pointerdown',()=>{unlocked=true;cleanAll()},{capture:true,passive:true});
document.addEventListener('touchstart',()=>{unlocked=true;cleanAll()},{capture:true,passive:true});
window.addEventListener('hashchange',()=>setTimeout(()=>{cleanAll();repairAuthRoute()},20));
new MutationObserver(()=>cleanAll()).observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['controls','poster']});
setTimeout(()=>{cleanAll();repairAuthRoute()},250);
setTimeout(()=>{cleanAll();repairAuthRoute()},1000);
})();
