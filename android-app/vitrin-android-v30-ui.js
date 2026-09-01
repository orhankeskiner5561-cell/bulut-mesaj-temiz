(function(){
  const ID='vitrinAndroidV30StrictMemberSearch';
  if(document.getElementById(ID)) return;
  const style=document.createElement('style');
  style.id=ID;
  style.textContent=`
    #sm #sr[data-v30-empty="1"]>*{display:none!important}
    #sm #sr{min-height:0!important}
    #sm #sr .result{cursor:pointer!important}
    #sm #sr .result:active{transform:scale(.99)}
  `;
  document.head.appendChild(style);

  let timer=0, wasOpen=false, internal=false;
  const get=()=>({m:document.getElementById('sm'),q:document.getElementById('sq'),r:document.getElementById('sr')});
  const value=()=>((get().q?.value||'').trim().replace(/^@/,''));

  function hardEmpty(){
    const {r}=get(); if(!r)return;
    internal=true; r.innerHTML=''; r.dataset.v30Empty='1'; internal=false;
  }
  function sync(){
    const {r}=get(); if(!r)return;
    if(value().length<2){hardEmpty();return;}
    delete r.dataset.v30Empty;
  }
  function search(){
    const {r}=get();
    if(value().length<2){hardEmpty();return;}
    if(r) delete r.dataset.v30Empty;
    try{ if(typeof searchPeople==='function') searchPeople(); else document.getElementById('doSearch')?.click(); }
    catch(_e){ document.getElementById('doSearch')?.click(); }
  }
  function openFresh(){
    const {q}=get(); clearTimeout(timer); if(q)q.value=''; hardEmpty(); setTimeout(()=>q?.focus(),50);
  }
  function bind(){
    const {m,q,r}=get(); if(!m||!q||!r)return;
    const open=m.classList.contains('on');
    if(open&&!wasOpen) openFresh();
    wasOpen=open;

    if(q.dataset.v30!=='1'){
      q.dataset.v30='1';
      q.addEventListener('input',()=>{
        clearTimeout(timer);
        if(value().length<2){hardEmpty();return;}
        delete r.dataset.v30Empty;
        timer=setTimeout(search,250);
      },true);
    }
    if(r.dataset.v30Watch!=='1'){
      r.dataset.v30Watch='1';
      new MutationObserver(()=>{if(!internal)sync()}).observe(r,{childList:true,subtree:true});
    }
    if(m.dataset.v30Row!=='1'){
      m.dataset.v30Row='1';
      m.addEventListener('click',e=>{
        const row=e.target?.closest?.('#sr .result'); if(!row)return;
        const id=row.querySelector('[data-view-profile]')?.dataset.viewProfile;
        if(!id)return;
        e.preventDefault(); e.stopPropagation();
        const btn=row.querySelector('[data-view-profile]'); if(btn)btn.click();
      });
    }
    sync();
  }
  function start(){
    bind();
    const {m}=get();
    if(m)new MutationObserver(bind).observe(m,{attributes:true,attributeFilter:['class']});
    new MutationObserver(bind).observe(document.body,{childList:true,subtree:true});
    setTimeout(bind,250);setTimeout(bind,900);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
