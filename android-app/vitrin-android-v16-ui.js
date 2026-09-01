(function(){
 const ID='vitrinAndroidV16GoldSilent'; if(document.getElementById(ID))return;
 const st=document.createElement('style');st.id=ID;st.textContent=`
 @keyframes v16GoldSpin{0%{transform:perspective(700px) rotateY(0deg) scale(1)}50%{transform:perspective(700px) rotateY(180deg) scale(1.06)}100%{transform:perspective(700px) rotateY(360deg) scale(1)}}
 @keyframes v16GoldShine{0%,100%{filter:drop-shadow(0 2px 2px #000) drop-shadow(0 0 7px #8b6500)}50%{filter:drop-shadow(0 3px 3px #000) drop-shadow(0 0 18px #ffd700)}}
 .vAndroidBrandV,.brandName::first-letter,.brandText::first-letter,.vitrinBrandText::first-letter{font-size:2.15em!important;font-weight:1000!important;display:inline-block!important;transform-origin:50% 50%!important;transform-style:preserve-3d!important;background:linear-gradient(110deg,#6f4800 0%,#b98200 10%,#fff7b0 23%,#ffd84a 34%,#8f5a00 47%,#fff4a0 60%,#d59a00 75%,#fff8c8 88%,#9c6800 100%)!important;background-size:220% 100%!important;-webkit-background-clip:text!important;background-clip:text!important;color:transparent!important;-webkit-text-fill-color:transparent!important;text-shadow:0 1px 0 #fff1a0,0 3px 0 #9b6900,0 5px 7px #000,0 0 16px #ffd70077!important;animation:v16GoldSpin 5.5s linear infinite,v16GoldShine 2.4s ease-in-out infinite!important}
 `;document.head.appendChild(st);
 let saved=new WeakMap();
 function gateOpen(){return !!document.querySelector('.v14Gate,.v13Gate')}
 function silence(){document.querySelectorAll('video,audio').forEach(m=>{if(!saved.has(m))saved.set(m,{muted:m.muted,volume:m.volume});m.muted=true;try{m.volume=0}catch(e){}})}
 function restore(){document.querySelectorAll('video,audio').forEach(m=>{const s=saved.get(m);if(!s)return;m.muted=s.muted;try{m.volume=s.volume}catch(e){}saved.delete(m)})}
 function makeGoldV(){document.querySelectorAll('.brandName,.brandText,.vitrinBrandText').forEach(el=>{const t=(el.textContent||'').trim();if(!/^VİTRİN/i.test(t)||el.dataset.v16==='1')return;el.dataset.v16='1';const rest=t.slice(1);el.textContent='';const v=document.createElement('span');v.className='vAndroidBrandV';v.textContent='V';el.append(v,document.createTextNode(rest))})}
 function sync(){makeGoldV();if(gateOpen())silence();else restore()}
 const mo=new MutationObserver(sync);mo.observe(document.documentElement,{subtree:true,childList:true});
 document.addEventListener('play',()=>{if(gateOpen())silence()},true);
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',sync,{once:true});else sync();
 setInterval(sync,700);
})();