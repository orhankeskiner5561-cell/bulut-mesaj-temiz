(function(){
  const ID='vitrinAndroidV29MemberSearch';
  if(document.getElementById(ID)) return;

  const style=document.createElement('style');
  style.id=ID;
  style.textContent=`
    #sm #sr:empty{min-height:8px!important}
    #sm #sr .result{cursor:pointer!important}
    #sm #sr .result:active{transform:scale(.995)}
  `;
  document.head.appendChild(style);

  let timer=null;
  let mutating=false;

  function els(){
    return {
      modal:document.getElementById('sm'),
      input:document.getElementById('sq'),
      results:document.getElementById('sr'),
      open:document.getElementById('searchBtn')
    };
  }

  function queryValue(){
    const {input}=els();
    return (input?.value||'').trim().replace(/^@/,'');
  }

  function clearWhenEmpty(){
    const {results}=els();
    if(!results || queryValue().length>=2) return;
    if(results.innerHTML){
      mutating=true;
      results.innerHTML='';
      mutating=false;
    }
  }

  function runSearch(){
    const q=queryValue();
    const {results}=els();
    if(q.length<2){
      if(results) results.innerHTML='';
      return;
    }
    try{
      if(typeof searchPeople==='function') searchPeople();
      else document.getElementById('doSearch')?.click();
    }catch(_e){
      document.getElementById('doSearch')?.click();
    }
  }

  function bind(){
    const {modal,input,results,open}=els();
    if(!modal||!input||!results) return;

    if(input.dataset.v29MemberSearch!=='1'){
      input.dataset.v29MemberSearch='1';
      input.addEventListener('input',()=>{
        clearTimeout(timer);
        const q=queryValue();
        if(q.length<2){results.innerHTML='';return;}
        timer=setTimeout(runSearch,300);
      });
    }

    if(open && open.dataset.v29MemberSearch!=='1'){
      open.dataset.v29MemberSearch='1';
      open.addEventListener('click',()=>{
        clearTimeout(timer);
        setTimeout(()=>{
          input.value='';
          results.innerHTML='';
          input.focus();
        },0);
        setTimeout(clearWhenEmpty,100);
        setTimeout(clearWhenEmpty,350);
      },true);
    }

    if(results.dataset.v29MemberSearch!=='1'){
      results.dataset.v29MemberSearch='1';
      const ro=new MutationObserver(()=>{
        if(mutating) return;
        clearWhenEmpty();
      });
      ro.observe(results,{childList:true,subtree:true});
    }

    if(modal.dataset.v29RowOpen!=='1'){
      modal.dataset.v29RowOpen='1';
      modal.addEventListener('click',e=>{
        const t=e.target;
        if(!t?.closest) return;
        if(t.closest('button,a,input,textarea,label')) return;
        const row=t.closest('#sr .result');
        if(!row) return;
        const profileButton=row.querySelector('[data-view-profile]');
        if(profileButton){
          e.preventDefault();
          profileButton.click();
        }
      });
    }

    clearWhenEmpty();
  }

  const mo=new MutationObserver(()=>bind());
  function start(){
    bind();
    if(document.body) mo.observe(document.body,{childList:true,subtree:true});
    setTimeout(bind,300);
    setTimeout(bind,1200);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();
