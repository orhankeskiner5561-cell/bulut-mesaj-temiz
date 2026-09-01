(function(){
  const STYLE_ID='vitrinAndroidV26Stories';
  if(document.getElementById(STYLE_ID)) return;

  const style=document.createElement('style');
  style.id=STYLE_ID;
  style.textContent=`
    /* Android-only story cleanup. Keep existing site logic; only refine story UI. */
    #home .stories{padding:8px 8px 10px!important;gap:10px!important}
    #home .story{min-width:72px!important;max-width:72px!important}
    #home .story .ring{
      width:64px!important;height:64px!important;padding:2px!important;
      border-radius:50%!important;background:transparent!important;
      border:3px solid #aeb4bc!important;box-shadow:none!important;
      display:grid!important;place-items:center!important;position:relative!important;
    }
    #home .story[data-story-user] .ring,
    #home .story.v26HasStory .ring{
      border-color:#2f8cff!important;background:transparent!important;
    }
    #home .story.activeNow .ring{background:transparent!important}
    #home .story.seenStory .ring{background:transparent!important}
    #home .story .ringInner{
      width:54px!important;height:54px!important;border:0!important;
      border-radius:50%!important;background:#f2f3f5!important;
      overflow:hidden!important;display:grid!important;place-items:center!important;
      box-shadow:none!important;
    }
    #home .story .ringInner img{width:100%!important;height:100%!important;object-fit:cover!important}
    #home .story .onlineDot{
      width:13px!important;height:13px!important;border-radius:50%!important;
      background:#20c76f!important;border:2px solid #fff!important;
      right:-1px!important;bottom:4px!important;box-shadow:0 0 0 1px rgba(0,0,0,.05)!important;
    }
    #home .story .addDot{
      width:19px!important;height:19px!important;border-radius:50%!important;
      right:-2px!important;bottom:-1px!important;background:#2f8cff!important;
      color:#fff!important;border:2px solid #fff!important;font-size:15px!important;
      line-height:1!important;display:grid!important;place-items:center!important;
      font-weight:900!important;box-shadow:none!important;
    }
    #home .story small{margin-top:5px!important;font-size:11px!important;color:inherit!important}

    /* Story add screen: clean white full page with back arrow. */
    #bulutStoryCreate{
      position:fixed!important;inset:0!important;z-index:151!important;
      background:#fff!important;backdrop-filter:none!important;color:#17243a!important;
      overflow:auto!important;
    }
    #bulutStoryCreate.on{display:block!important}
    #bulutStoryCreate .storyCreateBox{
      position:relative!important;left:auto!important;top:auto!important;transform:none!important;
      width:100%!important;min-height:100%!important;max-width:none!important;
      background:#fff!important;border-radius:0!important;padding:72px 20px 28px!important;
      color:#17243a!important;box-sizing:border-box!important;box-shadow:none!important;
    }
    #bulutStoryCreate .storyCreateBox > div:first-child{
      justify-content:flex-start!important;gap:12px!important;border-bottom:1px solid #eceff3!important;
      padding-bottom:14px!important;margin-bottom:22px!important;
    }
    #bulutStoryCreate .storyCreateBox h2{font-size:28px!important;font-weight:800!important}
    #bulutStoryCreateClose{display:none!important}
    #v26StoryBack{
      position:absolute!important;left:14px!important;top:18px!important;
      width:44px!important;height:44px!important;border:0!important;background:transparent!important;
      color:#17243a!important;font-size:34px!important;line-height:44px!important;text-align:center!important;
      padding:0!important;border-radius:50%!important;z-index:2!important;
    }
    #bulutStoryCreate .muted{color:#7d8794!important;font-size:17px!important;line-height:1.45!important}
    #bulutStoryCreate .storyCreateBtns{grid-template-columns:1fr 1fr!important;gap:12px!important;margin:18px 0!important}
    #bulutStoryCreate .storyCreateBtns button{
      min-height:112px!important;border:1px solid #e6ebf1!important;border-radius:18px!important;
      background:#f7f9fc!important;color:#101723!important;font-size:17px!important;font-weight:800!important;
    }
    #bulutStoryCreate textarea{
      width:100%!important;min-height:130px!important;border:1px solid #dfe4ea!important;
      border-radius:16px!important;background:#fff!important;color:#111827!important;
      padding:14px!important;font-size:17px!important;box-sizing:border-box!important;
    }
  `;
  document.head.appendChild(style);

  function ensureBack(){
    const box=document.querySelector('#bulutStoryCreate .storyCreateBox');
    if(!box || document.getElementById('v26StoryBack')) return;
    const b=document.createElement('button');
    b.id='v26StoryBack';
    b.type='button';
    b.setAttribute('aria-label','Geri');
    b.textContent='‹';
    b.addEventListener('click',()=>document.getElementById('bulutStoryCreate')?.classList.remove('on'));
    box.prepend(b);
  }

  async function markOwnStory(){
    const own=document.getElementById('bulutOwnStory');
    if(!own) return;
    own.classList.remove('v26HasStory');
    try{
      if(typeof sb==='undefined' || typeof session==='undefined' || !session?.user?.id) return;
      const now=new Date().toISOString();
      const r=await sb.from('stories').select('id').eq('user_id',session.user.id).gt('expires_at',now).limit(1);
      if(!r?.error && (r?.data||[]).length) own.classList.add('v26HasStory');
    }catch(e){}
  }

  function refresh(){
    ensureBack();
    markOwnStory();
  }

  const obs=new MutationObserver(()=>refresh());
  function start(){
    refresh();
    if(document.body) obs.observe(document.body,{childList:true,subtree:true});
    document.addEventListener('click',e=>{
      if(e.target?.closest?.('#bulutOwnStory,.story,[data-story-user],#bulutStoryPhoto,#bulutStoryVideo')){
        setTimeout(refresh,40);setTimeout(refresh,300);setTimeout(refresh,1000);
      }
    },true);
    setInterval(refresh,6000);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();
