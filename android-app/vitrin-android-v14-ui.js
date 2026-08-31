(function(){
  const ID='vitrinAndroidV14AuthComplete';
  if(document.getElementById(ID)) return;
  const style=document.createElement('style');style.id=ID;style.textContent=`
    .v14Gate{position:fixed;inset:0;z-index:100800;background:radial-gradient(circle at 50% 18%,#241a00 0,#090909 32%,#000 70%);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px 28px calc(112px + env(safe-area-inset-bottom));color:#fff;overflow:auto}
    .v14LogoV{font:900 112px/.82 Georgia,serif;background:linear-gradient(180deg,#fff8c8 0%,#FFD700 28%,#d89900 70%,#fff1a5 100%);-webkit-background-clip:text;background-clip:text;color:transparent;-webkit-text-fill-color:transparent;text-shadow:0 8px 30px #000,0 0 22px #ffd70055;margin-bottom:18px}
    .v14LogoWord{font:900 34px/1 Georgia,serif;letter-spacing:3px;color:#FFD700;margin-bottom:34px}
    .v14Box{width:min(100%,390px);background:#111d;border:1px solid #3a2b00;border-radius:24px;padding:20px;box-shadow:0 18px 60px #000c}
    .v14Tabs{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px}.v14Tabs button{padding:13px;border-radius:13px;border:1px solid #4b3900;background:#171717;color:#ddd;font-weight:800}.v14Tabs button.on{background:#FFD700;color:#111}
    .v14Fields{display:grid;gap:8px}.v14Fields input{width:100%;box-sizing:border-box;padding:14px 13px;border-radius:12px;border:2px solid #2d2d2d;background:#0a0a0a;color:#fff;font-size:16px;outline:none}.v14Fields input:focus{border-color:#8a6b00}
    .v14NameRow{display:grid;grid-template-columns:1fr 1fr;gap:8px}
    .v14StrengthWrap{display:none;margin-top:2px}.v14StrengthBar{height:6px;background:#262626;border-radius:999px;overflow:hidden}.v14StrengthFill{height:100%;width:0;background:#d33;transition:.18s}.v14StrengthText{font-size:12px;margin-top:5px;color:#aaa}
    .v14Submit{width:100%;padding:14px;margin-top:10px;border:0;border-radius:13px;background:linear-gradient(180deg,#ffe36a,#d5a500);color:#111;font-weight:900;font-size:16px}.v14Submit:disabled{opacity:.6}
    .v14Forgot{display:block;margin:13px auto 0;border:0;background:transparent;color:#58a8ff;font-size:13px;text-decoration:none;padding:4px 8px}.v14Msg{min-height:22px;color:#e7ca6c;font-size:13px;margin-top:8px;text-align:center;line-height:1.35}
    .v14Recovery{display:none}.v14Recovery.on{display:block}.v14Recovery .v14RecoveryTitle{color:#FFD700;font-weight:900;font-size:20px;margin-bottom:8px}.v14Recovery p{color:#bbb;font-size:13px;line-height:1.45;margin:0 0 12px}
  `;document.head.appendChild(style);

  function client(){return window.sb||window.supabase||null}
  async function session(){try{const c=client();if(!c?.auth?.getSession)return null;return (await c.auth.getSession())?.data?.session||null}catch(e){return null}}
  function killOld(){document.querySelectorAll('.v13Gate,.v14Gate').forEach(x=>x.remove())}
  function strength(p){let n=0;if(p.length>=8)n++;if(/[A-ZÇĞİÖŞÜ]/.test(p))n++;if(/[a-zçğıöşü]/.test(p))n++;if(/[0-9]/.test(p))n++;if(/[^A-Za-z0-9ÇĞİÖŞÜçğıöşü]/.test(p))n++;return n}
  function strengthMeta(n){return n<=1?['Çok zayıf','#d33',20]:n===2?['Zayıf','#e66a2c',40]:n===3?['Orta','#e3b12d',60]:n===4?['Güçlü','#64b96b',82]:['Çok güçlü','#22c55e',100]}
  function gate(){
    if(document.querySelector('.v14Gate'))return; document.querySelector('.v13Gate')?.remove();
    const el=document.createElement('div');el.className='v14Gate';el.innerHTML=`
      <div class="v14LogoV">V</div><div class="v14LogoWord">VİTRİN</div>
      <div class="v14Box">
        <div class="v14Main">
          <div class="v14Tabs"><button class="on" data-mode="login">Giriş Yap</button><button data-mode="signup">Üye Ol</button></div>
          <div class="v14Fields">
            <div class="v14NameRow" hidden><input class="v14First" autocomplete="given-name" placeholder="Ad"><input class="v14Last" autocomplete="family-name" placeholder="Soyad"></div>
            <input class="v14Email" type="email" autocomplete="email" placeholder="E-posta">
            <input class="v14Pass" type="password" autocomplete="current-password" placeholder="Şifre">
            <div class="v14StrengthWrap"><div class="v14StrengthBar"><div class="v14StrengthFill"></div></div><div class="v14StrengthText">Şifre gücü</div></div>
          </div>
          <button class="v14Submit">Giriş Yap</button>
          <button class="v14Forgot" type="button">Şifremi unuttum</button>
          <div class="v14Msg"></div>
        </div>
        <div class="v14Recovery">
          <div class="v14RecoveryTitle">Şifre Kurtarma</div>
          <p>Üyelik e-posta adresinizi yazın. VİTRİN hesabınıza bağlı e-posta adresine şifre kurtarma iletisi gönderilecek.</p>
          <div class="v14Fields"><input class="v14RecoveryEmail" type="email" autocomplete="email" placeholder="E-posta"></div>
          <button class="v14Submit v14RecoverySend">Kurtarma Gönder</button>
          <button class="v14Forgot v14RecoveryBack" type="button">Giriş ekranına dön</button>
          <div class="v14Msg v14RecoveryMsg"></div>
        </div>
      </div>`;
    document.body.appendChild(el);
    let mode='login';
    const main=el.querySelector('.v14Main'), recovery=el.querySelector('.v14Recovery'), nameRow=el.querySelector('.v14NameRow'), first=el.querySelector('.v14First'), last=el.querySelector('.v14Last'), email=el.querySelector('.v14Email'), pass=el.querySelector('.v14Pass'), submit=el.querySelector('.v14Submit'), forgot=el.querySelector('.v14Forgot'), msg=el.querySelector('.v14Msg'), sw=el.querySelector('.v14StrengthWrap'), sf=el.querySelector('.v14StrengthFill'), st=el.querySelector('.v14StrengthText');
    function setMode(m){mode=m;el.querySelectorAll('.v14Tabs [data-mode]').forEach(b=>b.classList.toggle('on',b.dataset.mode===m));nameRow.hidden=m!=='signup';sw.style.display=m==='signup'?'block':'none';submit.textContent=m==='login'?'Giriş Yap':'Üye Ol';pass.autocomplete=m==='login'?'current-password':'new-password';msg.textContent='';}
    el.querySelectorAll('.v14Tabs [data-mode]').forEach(b=>b.onclick=()=>setMode(b.dataset.mode));
    pass.addEventListener('input',()=>{if(mode!=='signup')return;const meta=strengthMeta(strength(pass.value));sf.style.width=meta[2]+'%';sf.style.background=meta[1];st.textContent='Şifre gücü: '+meta[0];st.style.color=meta[1];pass.style.borderColor=meta[1]});
    submit.onclick=async()=>{
      const c=client();if(!c?.auth){msg.textContent='Bağlantı hazırlanıyor, birkaç saniye sonra tekrar deneyin.';return}
      const em=email.value.trim(); if(!em||!pass.value){msg.textContent='E-posta ve şifre girin.';return}
      if(mode==='signup'){
        if(!first.value.trim()||!last.value.trim()){msg.textContent='Ad ve soyad girin.';return}
        if(strength(pass.value)<4){msg.textContent='Daha güçlü bir şifre belirleyin: en az 8 karakter, büyük/küçük harf, rakam ve mümkünse özel karakter.';return}
      }
      submit.disabled=true;msg.textContent='İşlem yapılıyor...';
      try{
        let r;
        if(mode==='login') r=await c.auth.signInWithPassword({email:em,password:pass.value});
        else r=await c.auth.signUp({email:em,password:pass.value,options:{data:{first_name:first.value.trim(),last_name:last.value.trim(),full_name:(first.value.trim()+' '+last.value.trim()).trim()}}});
        if(r?.error)throw r.error;
        if(mode==='signup'&&!r?.data?.session){msg.textContent='Üyelik oluşturuldu. E-posta doğrulaması gerekiyorsa e-postanızı kontrol edin.';setMode('login');}
        else{killOld();location.reload()}
      }catch(e){msg.textContent=e?.message||'İşlem başarısız.'}finally{submit.disabled=false}
    };
    forgot.onclick=()=>{main.style.display='none';recovery.classList.add('on');el.querySelector('.v14RecoveryEmail').value=email.value.trim();};
    el.querySelector('.v14RecoveryBack').onclick=()=>{recovery.classList.remove('on');main.style.display='block'};
    el.querySelector('.v14RecoverySend').onclick=async()=>{
      const c=client(), rem=el.querySelector('.v14RecoveryEmail').value.trim(), rm=el.querySelector('.v14RecoveryMsg'), btn=el.querySelector('.v14RecoverySend');
      if(!rem){rm.textContent='E-posta adresinizi girin.';return} if(!c?.auth?.resetPasswordForEmail){rm.textContent='Bağlantı hazırlanıyor, tekrar deneyin.';return}
      btn.disabled=true;rm.textContent='Gönderiliyor...';
      try{const redirectTo=location.origin+location.pathname;const r=await c.auth.resetPasswordForEmail(rem,{redirectTo});if(r?.error)throw r.error;rm.textContent='Şifre kurtarma iletisi e-posta adresinize gönderildi. Gelen kutusu ve spam klasörünü kontrol edin.'}catch(e){rm.textContent=e?.message||'Kurtarma iletisi gönderilemedi.'}finally{btn.disabled=false}
    };
  }
  async function boot(){const s=await session();if(!s)gate();else killOld()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(boot,60),{once:true});else setTimeout(boot,60);
  [500,1400].forEach(ms=>setTimeout(boot,ms));
})();
