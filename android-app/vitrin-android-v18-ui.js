(function(){
 const ID='vitrinAndroidV18SpinIconFit'; if(document.getElementById(ID))return;
 const st=document.createElement('style');st.id=ID;st.textContent=`
 @keyframes v18ClockwiseSpin{0%{transform:rotate(0deg) scale(1)}25%{transform:rotate(90deg) scale(1.03)}50%{transform:rotate(180deg) scale(1)}75%{transform:rotate(270deg) scale(1.03)}100%{transform:rotate(360deg) scale(1)}}
 @keyframes v18GoldPulse{0%,100%{background-position:0% 50%;filter:drop-shadow(0 2px 1px #000) drop-shadow(0 0 5px rgba(255,210,45,.45))}50%{background-position:100% 50%;filter:drop-shadow(0 3px 2px #000) drop-shadow(0 0 14px rgba(255,223,88,.95))}}
 html body .top{width:100%!important;max-width:100vw!important;box-sizing:border-box!important;display:grid!important;grid-template-columns:42px minmax(0,1fr) auto!important;align-items:center!important;gap:5px!important;padding-left:10px!important;padding-right:9px!important;overflow:hidden!important}
 html body .top>.brand{grid-column:2!important;min-width:0!important;max-width:100%!important;width:auto!important;overflow:visible!important;margin:0!important}
 html body .top>.v18Actions{grid-column:3!important;display:flex!important;align-items:center!important;justify-content:flex-end!important;gap:3px!important;min-width:0!important;max-width:142px!important;overflow:visible!important;white-space:nowrap!important}
 html body .top>.v18Actions>*{flex:0 0 32px!important;width:32px!important;min-width:32px!important;max-width:32px!important;height:38px!important;min-height:38px!important;box-sizing:border-box!important;margin:0!important;padding:2px!important;font-size:23px!important}
 html body .top>.v18Actions img,html body .top>.v18Actions svg{max-width:27px!important;max-height:27px!important}
 html body .v17Logo{width:100%!important;max-width:156px!important;height:54px!important;display:flex!important;align-items:center!important;overflow:visible!important;white-space:nowrap!important}
 html body .v17LogoV{font-size:48px!important;line-height:.82!important;letter-spacing:-5px!important;margin:0 5px 0 0!important;transform-origin:50% 50%!important;transform-box:border-box!important;will-change:transform!important;animation:v18ClockwiseSpin 5.2s linear infinite,v18GoldPulse 2.1s ease-in-out infinite!important;background:linear-gradient(105deg,#5c3900 0%,#a66b00 8%,#f5bf20 18%,#fff7ad 28%,#d59600 39%,#7a4b00 49%,#ffd84d 59%,#fff9c9 70%,#b97a00 82%,#6c4200 92%,#edb522 100%)!important;background-size:250% 100%!important;-webkit-background-clip:text!important;background-clip:text!important;-webkit-text-fill-color:transparent!important;color:transparent!important;text-shadow:0 1px 0 #fff4a8,0 2px 0 #cf9200,0 4px 0 #805000,0 6px 8px rgba(0,0,0,.72),0 0 13px rgba(255,214,48,.58)!important}
 html body .v17LogoRest{font-size:22px!important;letter-spacing:0!important;min-width:0!important}
 html body .v17LogoTR{font-size:9px!important;margin-left:4px!important;white-space:nowrap!important}
 @media(max-width:380px){html body .top{grid-template-columns:38px minmax(0,1fr) auto!important;padding-left:7px!important;padding-right:6px!important;gap:3px!important}html body .top>.v18Actions{gap:1px!important;max-width:124px!important}html body .top>.v18Actions>*{flex-basis:29px!important;width:29px!important;min-width:29px!important;max-width:29px!important;font-size:21px!important}.v17Logo{max-width:145px!important}.v17LogoV{font-size:44px!important}.v17LogoRest{font-size:20px!important}.v17LogoTR{font-size:8px!important}}
 `;document.head.appendChild(st);
 function fitTop(){
  const top=document.querySelector('.top');const brand=top&&top.querySelector(':scope > .brand');if(!top||!brand)return;
  let wrap=top.querySelector(':scope > .v18Actions');
  if(!wrap){wrap=document.createElement('div');wrap.className='v18Actions';let n=brand.nextSibling;const move=[];while(n){const next=n.nextSibling;if(n.nodeType===1)move.push(n);n=next}move.forEach(x=>wrap.appendChild(x));top.appendChild(wrap)}
 }
 function sync(){fitTop()}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',sync,{once:true});else sync();
 new MutationObserver(sync).observe(document.documentElement,{subtree:true,childList:true});
 [200,600,1200,2200].forEach(t=>setTimeout(sync,t));
})();