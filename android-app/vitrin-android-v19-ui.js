(function(){
 const ID='vitrinAndroidV19HeaderFit'; if(document.getElementById(ID))return;
 const st=document.createElement('style');st.id=ID;st.textContent=`
 html body .top{grid-template-columns:42px minmax(0,1fr) auto!important;column-gap:8px!important;padding-left:10px!important;padding-right:10px!important;overflow:hidden!important}
 html body .top>.brand{min-width:0!important;max-width:100%!important;overflow:hidden!important}
 html body .v17Logo{max-width:132px!important;width:132px!important;height:52px!important;gap:0!important;overflow:visible!important;transform:scale(.9)!important;transform-origin:left center!important}
 html body .v17LogoV{font-size:45px!important;margin-right:7px!important;letter-spacing:-4px!important;flex:0 0 auto!important}
 html body .v17LogoRest{font-size:20px!important;letter-spacing:.2px!important;flex:0 0 auto!important}
 html body .v17LogoTR{font-size:8px!important;margin-left:5px!important;flex:0 0 auto!important}
 html body .top>.v18Actions{gap:8px!important;max-width:none!important;overflow:visible!important;padding-right:0!important}
 html body .top>.v18Actions>*{flex:0 0 30px!important;width:30px!important;min-width:30px!important;max-width:30px!important;height:38px!important;margin:0!important;padding:1px!important;font-size:22px!important}
 html body .top>.v18Actions>*:last-child{display:none!important}
 html body .top>.v18Actions img,html body .top>.v18Actions svg{max-width:25px!important;max-height:25px!important}
 @media(max-width:390px){html body .top{grid-template-columns:38px minmax(0,1fr) auto!important;column-gap:5px!important;padding-left:7px!important;padding-right:7px!important}html body .v17Logo{width:118px!important;max-width:118px!important;transform:scale(.86)!important}.v17LogoV{font-size:42px!important}.v17LogoRest{font-size:18px!important}.v17LogoTR{font-size:7px!important}.top>.v18Actions{gap:5px!important}.top>.v18Actions>*{flex-basis:28px!important;width:28px!important;min-width:28px!important;max-width:28px!important;font-size:20px!important}}
 `;document.head.appendChild(st);
 function clean(){const top=document.querySelector('.top');if(!top)return;const a=top.querySelector(':scope > .v18Actions');if(!a)return;const kids=[...a.children];if(kids.length>4){for(let i=4;i<kids.length;i++)kids[i].style.setProperty('display','none','important')}}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',clean,{once:true});else clean();new MutationObserver(clean).observe(document.documentElement,{subtree:true,childList:true});[200,700,1500].forEach(t=>setTimeout(clean,t));
})();