(()=>{if(!document.querySelector('script[data-vitrin-theme]')){const s=document.createElement('script');s.src='./vitrin-theme.js';s.dataset.vitrinTheme='1';document.head.appendChild(s)}})();

(()=>{
 const SUPA='https://wtkiozzylhvphxenrpwq.supabase.co';
 const KEY='sb_publishable_pDW5FSXya-HqQDl4pI4lAQ_Hdm7yptb';
 const fmt=n=>new Intl.NumberFormat('tr-TR').format(Number(n)||0);
 const host=document.createElement('div');host.id='bulutUserCounter';
 const brand=document.querySelector('.brand');
 if(brand){brand.style.position='relative';host.style.position='absolute';host.style.left='112px';host.style.top='-16px';host.style.zIndex='2';brand.appendChild(host)}else{host.style.position='fixed';host.style.top='4px';host.style.left='120px';host.style.zIndex='31';document.body.appendChild(host)}
 const sh=host.attachShadow({mode:'open'});
 sh.innerHTML=`<style>:host{all:initial;display:block;pointer-events:none}.wrap{font-family:Arial,sans-serif;display:flex;align-items:center;background:rgba(255,255,255,.86);border:1px solid rgba(207,224,240,.85);border-radius:999px;box-shadow:0 2px 6px rgba(25,70,120,.06);overflow:hidden;backdrop-filter:blur(9px);height:20px;padding:0 2px;white-space:nowrap}.cell{display:flex;align-items:center;gap:2px;padding:0 4px;height:14px;border-left:1px solid #edf2f7}.cell:first-child{border-left:0}.ico{font-size:9px}.num{font-size:9px;font-weight:950;color:#10233f;line-height:1;font-variant-numeric:tabular-nums}.total .num{color:#2d8cff}.dot{display:inline-block;width:4px;height:4px;border-radius:50%;background:#22c55e;margin-right:1px;animation:pulse 1.6s ease-in-out infinite}@keyframes pulse{50%{opacity:.35;transform:scale(.8)}}@media(max-width:520px){.wrap{height:18px}.cell{padding:0 3px;gap:1px;height:13px}.ico{font-size:8px}.num{font-size:8.5px}}@media(prefers-reduced-motion:reduce){.dot{animation:none}}</style><div class="wrap"><div class="cell"><span class="ico">🇹🇷</span><span class="num" id="tr">0</span></div><div class="cell"><span class="ico">🌍</span><span class="num" id="gl">0</span></div><div class="cell total"><span class="dot"></span><span class="ico">👥</span><span class="num" id="tt">0</span></div></div>`;
 const $=id=>sh.getElementById(id);let shown={turkey:0,global:0,total:0},raf={turkey:0,global:0,total:0};
 function animate(key,to){to=Number(to)||0;const el=key==='turkey'?$('tr'):key==='global'?$('gl'):$('tt'),from=shown[key]||0,start=performance.now(),dur=520;cancelAnimationFrame(raf[key]);const step=t=>{const p=Math.min(1,(t-start)/dur),e=1-Math.pow(1-p,3),v=Math.round(from+(to-from)*e);el.textContent=fmt(v);if(p<1)raf[key]=requestAnimationFrame(step);else{shown[key]=to;el.textContent=fmt(to)}};raf[key]=requestAnimationFrame(step)}
 async function counts(){try{const r=await fetch(`${SUPA}/rest/v1/rpc/get_bulut_user_counts`,{method:'POST',headers:{apikey:KEY,Authorization:`Bearer ${KEY}`,'Content-Type':'application/json'},body:'{}'});if(!r.ok)throw 0;const j=await r.json(),x=Array.isArray(j)?j[0]:j;if(!x)return;animate('turkey',x.turkey);animate('global',x.global);animate('total',x.total)}catch{}}
 async function region(){try{const rr=await fetch('/api/region',{cache:'no-store'}),g=await rr.json();if(!g.country)return;const c=window.supabase?.createClient?.(SUPA,KEY);if(!c)return;const {data:{session}}=await c.auth.getSession();if(!session)return;const q=await c.from('profiles').select('country_code').eq('id',session.user.id).maybeSingle();if(q.data?.country_code!==g.country){await c.from('profiles').update({country_code:g.country}).eq('id',session.user.id);setTimeout(counts,400)}}catch{}}
 counts();region();setInterval(counts,60000);document.addEventListener('visibilitychange',()=>{if(!document.hidden)counts()});window.BulutUserCounter={reload:counts};
})();

// Profile media: use the profile form's existing gallery buttons; only add compact delete controls.
(()=>{
 const SUPA='https://wtkiozzylhvphxenrpwq.supabase.co',KEY='sb_publishable_pDW5FSXya-HqQDl4pI4lAQ_Hdm7yptb';
 const client=()=>window.sb||window.supabase?.createClient?.(SUPA,KEY);const say=s=>typeof window.toast==='function'?window.toast(s):alert(s);
 const pathFromUrl=(url,bucket)=>{try{const m=`/storage/v1/object/public/${bucket}/`,i=String(url||'').indexOf(m);return i>=0?decodeURIComponent(String(url).slice(i+m.length)):''}catch{return ''}};
 async function own(){const c=client();if(!c)return null;const {data:{session}}=await c.auth.getSession();if(!session)return null;const viewed=window.viewedProfileId||null;if(viewed&&viewed!==session.user.id)return null;return{c,u:session.user}}
 function apply(kind,url){if(kind==='cover'){const el=document.querySelector('#profile .cover,.profile .cover');if(el)el.style.backgroundImage=url?`url("${url}")`:''}else{const el=document.querySelector('#profile .big,.profile .big');if(el)el.innerHTML=url?`<img src="${url}" alt="Profil fotoğrafı" style="width:100%;height:100%;object-fit:cover">`:''}}
 async function remove(kind){const x=await own();if(!x)return;const bucket=kind==='cover'?'covers':'avatars',column=kind==='cover'?'cover_url':'avatar_url';const old=(await x.c.from('profiles').select(column).eq('id',x.u.id).maybeSingle()).data?.[column]||'';if(!old)return say('Silinecek fotoğraf yok.');if(!confirm(kind==='cover'?'Kapak fotoğrafı silinsin mi?':'Profil fotoğrafı silinsin mi?'))return;const q=await x.c.from('profiles').update({[column]:null}).eq('id',x.u.id);if(q.error)return say('Fotoğraf silinemedi.');const p=pathFromUrl(old,bucket);if(p)await x.c.storage.from(bucket).remove([p]);apply(kind,'');say(kind==='cover'?'Kapak fotoğrafı silindi.':'Profil fotoğrafı silindi.')}
 async function install(){const profile=document.getElementById('profile'),old=document.getElementById('bulutProfileMediaTools');if(!profile||!profile.classList.contains('on')){old?.remove();return}const x=await own();if(!x){old?.remove();return}if(old)return;const edit=profile.querySelector('.editbox,.profile-edit,[class*="edit"]')||profile.querySelector('.pbody')||profile;const tools=document.createElement('div');tools.id='bulutProfileMediaTools';tools.style.cssText='display:flex;justify-content:flex-end;gap:8px;margin:-4px 0 8px;padding:0 2px;background:transparent;border:0';tools.innerHTML='<button type="button" data-pm="avatar" style="border:0;background:transparent;color:#e04b4b;font-size:13px;padding:5px 7px">Profil fotoğrafını sil</button><button type="button" data-pm="cover" style="border:0;background:transparent;color:#e04b4b;font-size:13px;padding:5px 7px">Kapak fotoğrafını sil</button>';edit.appendChild(tools);tools.onclick=e=>{const k=e.target.closest('[data-pm]')?.dataset.pm;if(k)remove(k)}}
 document.addEventListener('click',()=>setTimeout(install,80),true);window.addEventListener('hashchange',()=>setTimeout(install,80));setTimeout(install,500);
})();

// Save gallery-selected profile/cover images immediately and remove the previous file.
(()=>{
 const say=s=>typeof window.toast==='function'?window.toast(s):alert(s);
 const pathFromUrl=(url,bucket)=>{try{const m=`/storage/v1/object/public/${bucket}/`,i=String(url||'').indexOf(m);return i>=0?decodeURIComponent(String(url).slice(i+m.length)):''}catch{return ''}};
 const apply=(kind,url)=>{if(kind==='cover'){const e=document.querySelector('#profile .cover');if(e)e.style.backgroundImage=`url("${url}")`}else{const e=document.querySelector('#profile .big');if(e)e.innerHTML=`<img src="${url}" alt="Profil fotoğrafı" style="width:100%;height:100%;object-fit:cover">`;const top=document.querySelector('.topActions img');if(top)top.src=url}};
 async function save(input,file){
   const c=window.sb;if(!c||!file)return;
   const {data:{session}}=await c.auth.getSession();if(!session)return;
   const profile=document.getElementById('profile');if(!profile?.classList.contains('on'))return;
   const inputs=[...profile.querySelectorAll('.photoRow input[type="file"], .edit input[type="file"]')];
   const index=inputs.indexOf(input);if(index<0)return;
   const kind=index===0?'avatar':'cover',bucket=kind==='avatar'?'avatars':'covers',column=kind==='avatar'?'avatar_url':'cover_url';
   if(!file.type?.startsWith('image/'))return say('Lütfen bir fotoğraf seçin.');
   if(file.size>10*1024*1024)return say('Fotoğraf en fazla 10 MB olabilir.');
   input.disabled=true;
   try{
     const oldQ=await c.from('profiles').select(column).eq('id',session.user.id).maybeSingle();
     const old=oldQ.data?.[column]||'';
     const ext=(file.name.split('.').pop()||'jpg').replace(/[^a-z0-9]/gi,'').toLowerCase()||'jpg';
     const path=`${session.user.id}/${crypto.randomUUID()}.${ext}`;
     const up=await c.storage.from(bucket).upload(path,file,{cacheControl:'3600',upsert:false,contentType:file.type});
     if(up.error)throw up.error;
     const url=c.storage.from(bucket).getPublicUrl(path).data.publicUrl;
     const q=await c.from('profiles').update({[column]:url}).eq('id',session.user.id);
     if(q.error){await c.storage.from(bucket).remove([path]);throw q.error}
     const oldPath=pathFromUrl(old,bucket);if(oldPath&&oldPath!==path)await c.storage.from(bucket).remove([oldPath]);
     apply(kind,url);
     say(kind==='avatar'?'Profil fotoğrafı kaydedildi.':'Kapak fotoğrafı kaydedildi.');
   }catch(err){console.error('BULUT profile media save',err);say('Fotoğraf kaydedilemedi.');}
   finally{input.disabled=false;input.value=''}
 }
 document.addEventListener('change',e=>{
   const input=e.target;if(!(input instanceof HTMLInputElement)||input.type!=='file')return;
   if(!input.closest('#profile'))return;
   const file=input.files?.[0];if(!file)return;
   e.stopImmediatePropagation();save(input,file);
 },true);
})();

// BULUT REALTIME BELL V1 — refresh the bell immediately when a new message/notification arrives.
(()=>{
 let channel=null,retryTimer=null,lastUid='';
 const getClient=()=>window.sb||null;
 const refresh=()=>{clearTimeout(window.__bulutBellRT);window.__bulutBellRT=setTimeout(()=>window.loadNotificationBadge?.(),120)};
 async function connect(){
   try{
     const c=getClient();if(!c||typeof c.channel!=='function')return retry();
     const {data:{session}}=await c.auth.getSession();const uid=session?.user?.id;if(!uid)return retry();
     if(channel&&lastUid===uid)return;
     if(channel){try{await c.removeChannel(channel)}catch{}}
     lastUid=uid;
     channel=c.channel(`bulut-bell-${uid}`)
       .on('postgres_changes',{event:'INSERT',schema:'public',table:'notifications',filter:`user_id=eq.${uid}`},refresh)
       .on('postgres_changes',{event:'INSERT',schema:'public',table:'messages'},payload=>{if(payload?.new?.sender_id!==uid)refresh()})
       .subscribe(status=>{if(status==='SUBSCRIBED')refresh();if(status==='CHANNEL_ERROR'||status==='TIMED_OUT')retry()});
   }catch{retry()}
 }
 function retry(){clearTimeout(retryTimer);retryTimer=setTimeout(connect,2500)}
 setTimeout(connect,600);
 window.addEventListener('online',connect);
 document.addEventListener('visibilitychange',()=>{if(!document.hidden){connect();refresh()}});
})();