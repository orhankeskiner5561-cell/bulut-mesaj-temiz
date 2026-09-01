(function(){
  const ID='vitrinAndroidV15LoginFix';
  if(document.getElementById(ID)) return;
  const style=document.createElement('style');style.id=ID;style.textContent=`
    .v14NameRow[hidden]{display:none!important}
  `;document.head.appendChild(style);

  const SUPABASE_URL='https://wtkiozzylhvphxenrpwq.supabase.co';
  const SUPABASE_KEY='sb_publishable_pDW5FSXya-HqQDl4pI4lAQ_Hdm7yptb';
  let authClient=null;

  function ensureClient(){
    if(window.sb?.auth) return window.sb;
    if(window.supabase?.auth) return window.supabase;
    if(authClient?.auth) return authClient;
    try{
      if(window.supabase?.createClient){
        authClient=window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
        window.sb=authClient;
        return authClient;
      }
    }catch(e){}
    return null;
  }

  function setLoginFields(gate){
    const login=gate.querySelector('.v14Tabs [data-mode="login"]');
    const signup=gate.querySelector('.v14Tabs [data-mode="signup"]');
    const row=gate.querySelector('.v14NameRow');
    const sw=gate.querySelector('.v14StrengthWrap');
    if(!row||!login||!signup)return;
    const sync=()=>{
      const isSignup=signup.classList.contains('on');
      row.hidden=!isSignup;
      row.style.display=isSignup?'grid':'none';
      if(sw) sw.style.display=isSignup?'block':'none';
    };
    login.addEventListener('click',()=>setTimeout(sync,0));
    signup.addEventListener('click',()=>setTimeout(sync,0));
    sync();
  }

  function patchSubmit(gate){
    if(gate.dataset.v15Patched==='1')return;
    gate.dataset.v15Patched='1';
    setLoginFields(gate);
    const submit=gate.querySelector('.v14Main .v14Submit');
    const email=gate.querySelector('.v14Email');
    const pass=gate.querySelector('.v14Pass');
    const msg=gate.querySelector('.v14Main .v14Msg');
    const signup=gate.querySelector('.v14Tabs [data-mode="signup"]');
    if(!submit||!email||!pass||!msg)return;
    const oldSignupHandler=submit.onclick;
    submit.onclick=async function(ev){
      const isSignup=signup?.classList.contains('on');
      if(isSignup){
        if(typeof oldSignupHandler==='function') return oldSignupHandler.call(this,ev);
        return;
      }
      const em=email.value.trim();
      if(!em||!pass.value){msg.textContent='E-posta ve şifre girin.';return}
      const c=ensureClient();
      if(!c?.auth?.signInWithPassword){msg.textContent='Bağlantı hazırlanıyor, birkaç saniye sonra tekrar deneyin.';return}
      submit.disabled=true;msg.textContent='Giriş yapılıyor...';
      try{
        const r=await c.auth.signInWithPassword({email:em,password:pass.value});
        if(r?.error)throw r.error;
        if(!r?.data?.session)throw new Error('Oturum açılamadı.');
        document.querySelectorAll('.v13Gate,.v14Gate').forEach(x=>x.remove());
        location.reload();
      }catch(e){
        const t=(e?.message||'Giriş başarısız.').toLowerCase();
        msg.textContent=t.includes('invalid login')||t.includes('invalid credentials')?'E-posta veya şifre hatalı.':(e?.message||'Giriş başarısız.');
      }finally{submit.disabled=false}
    };
  }

  function patch(){
    ensureClient();
    document.querySelectorAll('.v14Gate').forEach(patchSubmit);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(patch,80),{once:true});else setTimeout(patch,80);
  const mo=new MutationObserver(()=>patch());
  mo.observe(document.documentElement,{childList:true,subtree:true});
  [300,800,1500,3000].forEach(ms=>setTimeout(patch,ms));
})();
