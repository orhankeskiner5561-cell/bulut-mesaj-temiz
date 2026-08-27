(function(){
  function loginMarkup(){return `<div class="authShell"><div class="authTabs"><button id="authTabLogin" class="on" type="button">Giriş Yap</button><button id="authTabRegister" type="button">Kayıt Ol</button></div><form id="authLogin" class="authForm on"><label>E-posta</label><input id="authEmail" type="email" autocomplete="email" required><label>Şifre</label><input id="authPassword" type="password" autocomplete="current-password" required><button class="primary" type="submit">Giriş Yap</button><div class="authHint">Eski BULUT hesabınızdaki aynı e-posta ve şifreyi kullanabilirsiniz.</div></form><form id="authRegister" class="authForm"><label>Ad Soyad</label><input id="authFullName" required><label>Kullanıcı adı</label><input id="authUsername" required maxlength="20"><label>E-posta</label><input id="authRegEmail" type="email" required><label>Şifre</label><input id="authRegPassword" type="password" minlength="6" required><button class="primary" type="submit">Hesap Oluştur</button></form></div>`}
  const oldRenderProfile=window.renderProfile;
  window.renderProfile=async function(id,push=true){
    const root=document.querySelector('#profileBox');
    if(!window.session&&!id){if(push&&window.showPage)window.showPage('profile');root.classList.add('authMode');root.innerHTML=loginMarkup();bindAuth();return}
    root.classList.remove('authMode');
    return oldRenderProfile(id,push);
  };
  function bindAuth(){
    const l=document.querySelector('#authTabLogin'),r=document.querySelector('#authTabRegister'),lf=document.querySelector('#authLogin'),rf=document.querySelector('#authRegister');
    const tab=which=>{const isLogin=which==='login';l.classList.toggle('on',isLogin);r.classList.toggle('on',!isLogin);lf.classList.toggle('on',isLogin);rf.classList.toggle('on',!isLogin)};
    l.onclick=()=>tab('login');r.onclick=()=>tab('register');
    lf.onsubmit=async e=>{e.preventDefault();const email=document.querySelector('#authEmail').value.trim().toLowerCase(),password=document.querySelector('#authPassword').value;const {error}=await sb.auth.signInWithPassword({email,password});if(error)return toast('E-posta veya şifre hatalı.');toast('Giriş yapıldı ☁️');setTimeout(()=>location.replace('./bulut-clean.html#home'),250)};
    rf.onsubmit=async e=>{e.preventDefault();const full_name=document.querySelector('#authFullName').value.trim(),username=document.querySelector('#authUsername').value.trim().toLowerCase(),email=document.querySelector('#authRegEmail').value.trim().toLowerCase(),password=document.querySelector('#authRegPassword').value;if(!/^[a-zA-Z0-9_]{3,20}$/.test(username))return toast('Kullanıcı adı 3-20 karakter olmalı.');const {data:existing}=await sb.from('profiles').select('id').eq('username',username).maybeSingle();if(existing)return toast('Bu kullanıcı adı kullanılıyor.');const {data,error}=await sb.auth.signUp({email,password,options:{data:{full_name,username}}});if(error)return toast('Kayıt oluşturulamadı.');toast(data.session?'Hesabınız oluşturuldu ☁️':'Hesap oluşturuldu. E-posta doğrulamasını tamamlayın.');if(data.session)setTimeout(()=>location.replace('./bulut-clean.html#home'),250)};
  }
  const oldShowPage=window.showPage;
  window.showPage=function(name,push=true){oldShowPage(name,push);if(name==='profile'&&!window.session&&!window.viewedProfileId)setTimeout(()=>window.renderProfile(null,false),0)};
  sb.auth.onAuthStateChange(async(_e,s)=>{window.session=s;if(s){window.me=await loadProfile(s.user.id)}else{window.me=null;const b=document.querySelector('#badge');if(b)b.hidden=true}if(location.hash.startsWith('#profile'))window.renderProfile(window.viewedProfileId||window.me?.id,false)});
  setTimeout(()=>{if(!window.session&&location.hash.startsWith('#profile'))window.renderProfile(null,false);const b=document.querySelector('#badge');if(!window.session&&b)b.hidden=true},350);
})();