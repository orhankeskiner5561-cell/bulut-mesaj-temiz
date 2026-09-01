(function(){
  const ID='vitrinAndroidV24BrandLanguageLock';
  if(document.getElementById(ID)) return;

  const style=document.createElement('style');
  style.id=ID;
  style.textContent=`
    .vitrinBrandLock,.vitrinBrandLock *{translate:no!important}
  `;
  document.head.appendChild(style);

  const BRAND_SELECTORS=[
    '.v8Brand','.v8Brand *','.v8Logo','.v8Logo *','.v8BrandMark','.v8BrandMark *',
    '.v8LogoText','.v8LogoText *','.v20Brand','.v20Brand *','.brand','.brand *',
    '.logo','.logo *','[data-vitrin-brand]','[data-vitrin-brand] *'
  ].join(',');

  function lockElement(el){
    if(!el || el.nodeType!==1) return;
    el.classList.add('notranslate','vitrinBrandLock');
    el.setAttribute('translate','no');
    el.setAttribute('data-vitrin-brand-lock','1');
  }

  function protectKnownBrandElements(root=document){
    try{root.querySelectorAll?.(BRAND_SELECTORS).forEach(lockElement)}catch(e){}
  }

  function isProtected(node){
    const p=node.parentElement;
    return !!(p && p.closest('.notranslate,[translate="no"],[data-vitrin-brand-lock="1"]'));
  }

  function protectTextNode(node){
    if(!node || node.nodeType!==3 || isProtected(node)) return;
    const text=node.nodeValue||'';
    if(!text.trim()) return;

    // Keep the VİTRİN trademark unchanged everywhere, including inside sentences.
    // Also keep a standalone single "V" unchanged for compact VİTRİN logo marks.
    const re=/(VİTRİN|VITRIN|Vitrin|vitrin|(?<![\p{L}\p{N}])V(?![\p{L}\p{N}]))/gu;
    if(!re.test(text)) return;
    re.lastIndex=0;

    const frag=document.createDocumentFragment();
    let last=0, m;
    while((m=re.exec(text))){
      if(m.index>last) frag.appendChild(document.createTextNode(text.slice(last,m.index)));
      const span=document.createElement('span');
      span.className='notranslate vitrinBrandLock';
      span.setAttribute('translate','no');
      span.setAttribute('data-vitrin-brand-lock','1');
      span.textContent=(m[0].toUpperCase()==='VITRIN' || m[0].toUpperCase()==='VİTRİN') ? 'VİTRİN' : 'V';
      frag.appendChild(span);
      last=m.index+m[0].length;
    }
    if(last<text.length) frag.appendChild(document.createTextNode(text.slice(last)));
    node.parentNode?.replaceChild(frag,node);
  }

  function walk(root=document.body){
    if(!root) return;
    protectKnownBrandElements(root===document.body?document:root);
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode(n){
      const p=n.parentElement;
      if(!p || /^(SCRIPT|STYLE|TEXTAREA|INPUT|OPTION)$/i.test(p.tagName)) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    }});
    const nodes=[]; let n;
    while((n=walker.nextNode())) nodes.push(n);
    nodes.forEach(protectTextNode);
  }

  function protectBeforeLanguageChange(){
    walk(document.body);
    // Google Translate honors notranslate + translate=no; re-assert immediately.
    protectKnownBrandElements(document);
  }

  document.addEventListener('click',e=>{
    if(e.target?.closest?.('.v21Lang,.v20Globe,[data-language],[data-lang]')) protectBeforeLanguageChange();
  },true);

  const obs=new MutationObserver(records=>{
    for(const r of records){
      if(r.type==='characterData') protectTextNode(r.target);
      r.addedNodes?.forEach(n=>{
        if(n.nodeType===1) walk(n);
        else if(n.nodeType===3) protectTextNode(n);
      });
    }
    protectKnownBrandElements(document);
  });

  function start(){
    walk(document.body);
    if(document.body) obs.observe(document.body,{subtree:true,childList:true,characterData:true});
    try{document.title=document.title.replace(/VITRIN|Vitrin|vitrin/g,'VİTRİN')}catch(e){}
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();

  window.addEventListener('storage',e=>{
    if(e.key==='vitrin_lang_v21') setTimeout(protectBeforeLanguageChange,0);
  });
})();
