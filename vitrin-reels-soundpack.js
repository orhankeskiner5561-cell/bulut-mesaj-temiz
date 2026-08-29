(()=>{
'use strict';
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
let audio=null, selected=null, requestNo=0;
const MAP={
 tr:{label:'Türkiye Popüler',term:'turkish pop hits',country:'tr'},
 world:{label:'Dünya Popüler',term:'global pop hits',country:'us'},
 mood:{label:'Ruh Hali',term:'chill romantic happy acoustic music',country:'us'},
 comedy:{label:'Komedi',term:'comedy funny soundtrack music',country:'us'},
 cinema:{label:'Sinema',term:'cinematic film soundtrack score',country:'us'},
 nature:{label:'Doğa',term:'nature ambient relaxing music',country:'us'},
 animals:{label:'Hayvan',term:'animals nature relaxing music',country:'us'},
 arabesk:{label:'Arabesk',term:'turkish arabesk fantezi',country:'tr'},
 rap:{label:'Rap',term:'turkish rap hip hop trap',country:'tr'},
 electro:{label:'Elektronik',term:'electronic dance house synthwave',country:'us'}
};
function key(){const b=$('.vrsChip.on'); if(!b)return''; const t=b.textContent.toLowerCase(); if(t.includes('türkiye'))return'tr'; if(t.includes('dünya'))return'world'; if(t.includes('ruh'))return'mood'; if(t.includes('komedi'))return'comedy'; if(t.includes('sinema'))return'cinema'; if(t.includes('doğa'))return'nature'; if(t.includes('hayvan'))return'animals'; if(t.includes('arabesk'))return'arabesk'; if(t.includes('rap'))return'rap'; if(t.includes('elektronik'))return'electro'; return''}
function stop(){if(audio){audio.pause();audio=null}$$('.vrsRealListen').forEach(b=>b.textContent='▶ Dinle')}
function esc(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
function jsonp(term,country){return new Promise((resolve,reject)=>{const id='vrs_cb_'+Date.now()+'_'+Math.floor(Math.random()*1e6), s=document.createElement('script'), timer=setTimeout(()=>{cleanup();reject(new Error('timeout'))},9000); function cleanup(){clearTimeout(timer); try{delete window[id]}catch{}; s.remove()} window[id]=d=>{cleanup();resolve((d&&d.results)||[])}; s.onerror=()=>{cleanup();reject(new Error('load'))}; s.src='https://itunes.apple.com/search?media=music&entity=song&limit=24&country='+encodeURIComponent(country)+'&term='+encodeURIComponent(term)+'&callback='+id; document.head.appendChild(s)})}
function selectedBox(item){let n=$('#vrsChosenMusic'); if(!n){n=document.createElement('div');n.id='vrsChosenMusic';n.className='vrsCard';$('#vrsSoundList')?.after(n)} n.innerHTML='<b>✓ Seçilen müzik:</b> '+esc(item.trackName)+'<div class="vrsTiny">'+esc(item.artistName)+'</div>'}
async function render(){const cat=key(), cfg=MAP[cat], box=$('#vrsSoundList'), st=$('#vrsSoundStatus'); if(!cfg||!box)return; const mine=++requestNo; stop(); box.innerHTML='<div class="vrsCard vrsTiny">🎵 '+esc(cfg.label)+' müzik listesi yükleniyor…</div>'; if(st)st.textContent='Kategoriye uygun şarkılar hazırlanıyor…'; try{const search=$('#vrsMusicSearch')?.value?.trim(); const results=await jsonp(search||cfg.term,cfg.country); if(mine!==requestNo)return; const items=results.filter(x=>x.trackName&&x.artistName).slice(0,24); if(!items.length)throw new Error('empty'); box.innerHTML='<div class="vrsSectionTitle">🎵 '+esc(cfg.label)+' Müzik Listesi <span>'+items.length+' şarkı</span></div>'+items.map((x,i)=>'<div class="vrsSound"><img class="vrsCover" src="'+esc(x.artworkUrl100||'')+'" alt=""><div class="vrsSoundText"><b>'+esc(x.trackName)+'</b><div class="vrsTiny">'+esc(x.artistName)+'</div></div>'+(x.previewUrl?'<button type="button" class="vrsBtn vrsRealListen" data-listen="'+i+'">▶ Dinle</button>':'')+'<button type="button" class="vrsBtn vrsRealPick" data-pick="'+i+'">Seç</button></div>').join(''); if(st)st.textContent=items.length+' şarkı bulundu · Dinle ve Seç'; $$('[data-listen]').forEach(b=>b.onclick=()=>{const x=items[+b.dataset.listen]; if(audio&&audio.src===x.previewUrl){stop();return} stop(); audio=new Audio(x.previewUrl); audio.volume=.85; audio.play().then(()=>b.textContent='■ Durdur').catch(()=>{b.textContent='Önizleme yok'}); audio.onended=stop}); $$('[data-pick]').forEach(b=>b.onclick=()=>{selected=items[+b.dataset.pick]; window.__vitrinSelectedReelsMusic=selected; $$('.vrsRealPick').forEach(x=>x.textContent='Seç'); b.textContent='✓ Seçildi'; selectedBox(selected)}); }catch(e){if(mine!==requestNo)return; box.innerHTML='<div class="vrsCard"><b>⚠️ Müzik listesi açılamadı</b><div class="vrsTiny">Bağlantıyı yenileyip tekrar deneyin.</div></div>'; if(st)st.textContent='Katalog bağlantısı kurulamadı.'}}
function bind(){document.addEventListener('click',e=>{if(e.target.closest('.vrsChip'))setTimeout(render,120); if(e.target.closest('[data-step="sound"]'))setTimeout(render,180)}); const input=$('#vrsMusicSearch'); if(input&&!input.dataset.realMusic){input.dataset.realMusic='1'; let t; input.addEventListener('input',()=>{clearTimeout(t);t=setTimeout(render,500)})}}
function boot(){if(!$('#vrsOverlay'))return; bind(); if($('.vrsPanel[data-panel="sound"].on'))render();}
const mo=new MutationObserver(()=>{if($('#vrsOverlay'))boot()}); mo.observe(document.documentElement,{childList:true,subtree:true}); if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
