(()=>{
  const $=s=>document.querySelector(s);
  const escStory=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  let storyGroups=[];
  let viewerGroup=0;
  let viewerStory=0;
  let storyTimer=null;

  const css=document.createElement('style');
  css.textContent=`
  .stories{align-items:flex-start!important;padding:4px 2px 8px;scrollbar-width:none}.stories::-webkit-scrollbar{display:none}
  .story{min-width:72px!important;max-width:72px;cursor:pointer}.story .ring{width:62px!important;height:62px!important;border-radius:50%!important;padding:3px;background:linear-gradient(135deg,#ff3d77,#ffb000,#8a5cff);border:0!important;position:relative;display:grid!important;place-items:center!important}
  .story.activeNow .ring{background:#20c76f!important}.story.seenStory .ring{background:#cbd5e1!important}.story.mineStory .ring{background:linear-gradient(135deg,#2d8cff,#45c6ff)!important}
  .story .ringInner{width:56px;height:56px;border:3px solid #fff;border-radius:50%;background:#edf5ff;overflow:hidden;display:grid;place-items:center;font-size:21px;font-weight:900;color:#24364d}
  .story .ringInner img{width:100%;height:100%;object-fit:cover}.story .onlineDot{position:absolute;width:15px;height:15px;border-radius:50%;background:#20c76f;border:3px solid white;right:1px;bottom:2px}.story .addDot{position:absolute;width:20px;height:20px;border-radius:50%;background:#2d8cff;color:white;border:2px solid white;right:-1px;bottom:0;font-size:15px;line-height:15px;display:grid;place-items:center;font-weight:900}.story small{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:11px}
  #bulutStoryViewer{display:none;position:fixed;inset:0;z-index:150;background:#090d15;color:white}#bulutStoryViewer.on{display:block}#bulutStoryViewer .storyStage{height:100%;display:flex;align-items:center;justify-content:center;position:relative;background:#000}#bulutStoryViewer img,#bulutStoryViewer video{width:100%;height:100%;object-fit:contain;max-width:760px;background:#000}#bulutStoryViewer .storyTop{position:absolute;top:0;left:0;right:0;z-index:3;padding:12px 14px 18px;background:linear-gradient(#000b,transparent)}#bulutStoryViewer .storyBars{display:flex;gap:4px;margin-bottom:10px}.storyBar{height:3px;flex:1;background:#ffffff55;border-radius:999px;overflow:hidden}.storyBar i{display:block;height:100%;background:white;width:0}.storyBar.done i{width:100%}.storyBar.current i{animation:storyProgress 5s linear forwards}@keyframes storyProgress{to{width:100%}}#bulutStoryViewer .storyWho{display:flex;align-items:center;gap:9px}.storyWho .miniAv{width:36px;height:36px;border-radius:50%;overflow:hidden;background:#2d8cff;display:grid;place-items:center;font-weight:900}.storyWho .miniAv img{width:100%;height:100%;object-fit:cover}.storyClose{margin-left:auto;border:0;background:#ffffff22;color:#fff;width:38px;height:38px;border-radius:50%;font-size:24px}.storyTap{position:absolute;top:64px;bottom:0;width:42%;z-index:2}.storyTap.prev{left:0}.storyTap.next{right:0}.storyCaption{position:absolute;bottom:36px;left:16px;right:16px;text-align:center;z-index:3;font-size:16px;text-shadow:0 2px 6px #000}
  #bulutStoryCreate{display:none;position:fixed;inset:0;z-index:151;background:#0b223b77;backdrop-filter:blur(6px)}#bulutStoryCreate.on{display:block}#bulutStoryCreate .storyCreateBox{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:min(520px,94vw);background:white;border-radius:24px;padding:18px;color:#10233f}.storyCreateBtns{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:12px 0}.storyCreateBtns button{border:0;border-radius:16px;background:#f2f7fc;padding:16px;font-weight:800}.storyCreateBox textarea{width:100%;border:1px solid #dfeaf6;border-radius:14px;padding:12px;min-height:80px;resize:none}.storyUploadStatus{font-size:12px;color:#71829a;margin-top:8px}
  `;
  document.head.appendChild(css);

  function ensureUi(){
    if(!$('#bulutStoryViewer')){
      const v=document.createElement('div');v.id='bulutStoryViewer';v.innerHTML='<div class="storyStage"><div class="storyTop"><div class="storyBars" id="bulutStoryBars"></div><div class="storyWho"><div class="miniAv" id="bulutStoryAv">?</div><div><b id="bulutStoryName">Hikâye</b><div style="font-size:11px;opacity:.8" id="bulutStoryTime"></div></div><button class="storyClose" id="bulutStoryClose">×</button></div></div><div class="storyTap prev" id="bulutStoryPrev"></div><div class="storyTap next" id="bulutStoryNext"></div><div id="bulutStoryMedia"></div><div class="storyCaption" id="bulutStoryCaption"></div></div>';
      document.body.appendChild(v);
      $('#bulutStoryClose').onclick=closeViewer;$('#bulutStoryPrev').onclick=prevStory;$('#bulutStoryNext').onclick=nextStory;
    }
    if(!$('#bulutStoryCreate')){
      const c=document.createElement('div');c.id='bulutStoryCreate';c.innerHTML='<div class="storyCreateBox"><div style="display:flex;align-items:center;justify-content:space-between"><h2 style="margin:0">Hikâye Ekle</h2><button class="ib" id="bulutStoryCreateClose">✕</button></div><p class="muted">Fotoğraf veya video seçin. Hikâye 24 saat görünür.</p><div class="storyCreateBtns"><button id="bulutStoryPhoto">🖼️ Fotoğraf Hikâyesi</button><button id="bulutStoryVideo">🎥 Video Hikâyesi</button></div><textarea id="bulutStoryCaptionInput" maxlength="180" placeholder="Bir şey yaz... (isteğe bağlı)"></textarea><div class="storyUploadStatus" id="bulutStoryUploadStatus"></div><input id="bulutStoryPhotoInput" type="file" accept="image/*" hidden><input id="bulutStoryVideoInput" type="file" accept="video/*" hidden></div>';
      document.body.appendChild(c);
      $('#bulutStoryCreateClose').onclick=()=>c.classList.remove('on');
      $('#bulutStoryPhoto').onclick=()=>$('#bulutStoryPhotoInput').click();
      $('#bulutStoryVideo').onclick=()=>$('#bulutStoryVideoInput').click();
      $('#bulutStoryPhotoInput').onchange=e=>uploadStory(e.target.files?.[0],'image');
      $('#bulutStoryVideoInput').onchange=e=>uploadStory(e.target.files?.[0],'video');
    }
  }

  function avatar(p){return p?.avatar_url?`<img src="${escStory(p.avatar_url)}" alt="">`:escStory((p?.full_name||p?.username||'?').slice(0,1).toUpperCase())}
  const isOnline=p=>p?.last_seen_at && Date.now()-new Date(p.last_seen_at).getTime()<5*60*1000;
  const ago=t=>{const s=Math.max(0,Math.floor((Date.now()-new Date(t).getTime())/1000));if(s<60)return 'şimdi';if(s<3600)return Math.floor(s/60)+' dk';return Math.floor(s/3600)+' sa'};

  async function touchPresence(){
    try{if(session?.user?.id)await sb.from('profiles').update({last_seen_at:new Date().toISOString()}).eq('id',session.user.id)}catch(e){}
  }

  async function loadStories(){
    const strip=document.querySelector('#home .stories');if(!strip)return;
    ensureUi();
    if(!session?.user){strip.innerHTML='<div class="story mineStory" id="bulutOwnStory"><div class="ring"><div class="ringInner">＋</div></div><small>Hikâye</small></div>';return}
    try{
      await touchPresence();
      const uid=session.user.id;
      const [sr,pr,fr,vr]=await Promise.all([
        sb.from('stories').select('*').gt('expires_at',new Date().toISOString()).order('created_at',{ascending:true}),
        sb.from('profiles').select('id,full_name,username,avatar_url,last_seen_at'),
        sb.from('follows').select('following_id').eq('follower_id',uid),
        sb.from('story_views').select('story_id').eq('viewer_id',uid)
      ]);
      if(sr.error)throw sr.error;
      const profiles=Object.fromEntries((pr.data||[]).map(p=>[p.id,p]));
      const following=new Set((fr.data||[]).map(x=>x.following_id));
      const seen=new Set((vr.data||[]).map(x=>x.story_id));
      const grouped={};(sr.data||[]).forEach(s=>(grouped[s.user_id]??=[]).push(s));
      const groups=Object.entries(grouped).map(([userId,stories])=>({userId,profile:profiles[userId]||{},stories,followed:following.has(userId),seenAll:stories.every(s=>seen.has(s.id))}));
      groups.sort((a,b)=>{if(a.userId===uid)return -1;if(b.userId===uid)return 1;if(a.followed!==b.followed)return a.followed?-1:1;if(isOnline(a.profile)!==isOnline(b.profile))return isOnline(a.profile)?-1:1;return new Date(b.stories.at(-1)?.created_at)-new Date(a.stories.at(-1)?.created_at)});
      storyGroups=groups;
      let html=`<div class="story mineStory" id="bulutOwnStory"><div class="ring"><div class="ringInner">${avatar(profiles[uid]||currentProfile)}</div><span class="addDot">＋</span></div><small>Hikâyen</small></div>`;
      html+=groups.filter(g=>g.userId!==uid).map((g,i)=>`<div class="story ${isOnline(g.profile)?'activeNow':''} ${g.seenAll?'seenStory':''}" data-story-user="${g.userId}"><div class="ring"><div class="ringInner">${avatar(g.profile)}</div>${isOnline(g.profile)?'<span class="onlineDot"></span>':''}</div><small>${escStory((g.profile.full_name||g.profile.username||'Üye').split(' ')[0])}</small></div>`).join('');
      strip.innerHTML=html;
      const ownIdx=storyGroups.findIndex(g=>g.userId===uid);
      const ownEl=$('#bulutOwnStory');
      ownEl.onclick=e=>{
        if(e.target.closest('.addDot'))return;
        if(ownIdx>=0)openViewer(ownIdx,0);
        else $('#bulutStoryCreate').classList.add('on');
      };
      const addEl=ownEl.querySelector('.addDot');
      if(addEl)addEl.onclick=e=>{e.stopPropagation();$('#bulutStoryCreate').classList.add('on')};
      strip.querySelectorAll('[data-story-user]').forEach(el=>el.onclick=()=>{const idx=storyGroups.findIndex(g=>g.userId===el.dataset.storyUser);if(idx>=0)openViewer(idx,0)});
    }catch(err){console.error('BULUT stories',err);strip.innerHTML='<div class="story mineStory" id="bulutOwnStory"><div class="ring"><div class="ringInner">＋</div></div><small>Hikâye</small></div>';$('#bulutOwnStory').onclick=()=>$('#bulutStoryCreate').classList.add('on')}
  }

  async function uploadStory(file,type){
    if(!file||!session?.user)return;
    const status=$('#bulutStoryUploadStatus');status.textContent='Yükleniyor…';
    try{
      if(file.size>50*1024*1024)throw new Error('Dosya en fazla 50 MB olabilir.');
      const ext=(file.name.split('.').pop()|| (type==='image'?'jpg':'mp4')).toLowerCase();
      const path=`${session.user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const up=await sb.storage.from('stories').upload(path,file,{cacheControl:'3600',upsert:false,contentType:file.type});if(up.error)throw up.error;
      const pub=sb.storage.from('stories').getPublicUrl(path).data.publicUrl;
      const caption=$('#bulutStoryCaptionInput').value.trim();
      const ins=await sb.from('stories').insert({user_id:session.user.id,media_url:pub,media_type:type,caption}).select().single();if(ins.error)throw ins.error;
      $('#bulutStoryCreate').classList.remove('on');$('#bulutStoryCaptionInput').value='';status.textContent='';
      if(typeof toast==='function')toast('Hikâyen yayınlandı.');
      await loadStories();
    }catch(err){console.error(err);status.textContent=err.message||'Hikâye yüklenemedi.'}
  }

  async function markViewed(story){
    try{if(session?.user?.id)await sb.from('story_views').upsert({story_id:story.id,viewer_id:session.user.id,viewed_at:new Date().toISOString()},{onConflict:'story_id,viewer_id'})}catch(e){}
  }
  function openViewer(g,s){viewerGroup=g;viewerStory=s;renderViewer()}
  function renderViewer(){
    clearTimeout(storyTimer);const group=storyGroups[viewerGroup];if(!group)return closeViewer();const story=group.stories[viewerStory];if(!story)return closeViewer();ensureUi();
    $('#bulutStoryViewer').classList.add('on');$('#bulutStoryName').textContent=group.profile.full_name||group.profile.username||'Üye';$('#bulutStoryTime').textContent=ago(story.created_at);$('#bulutStoryAv').innerHTML=avatar(group.profile);$('#bulutStoryCaption').textContent=story.caption||'';
    $('#bulutStoryBars').innerHTML=group.stories.map((_,i)=>`<span class="storyBar ${i<viewerStory?'done':i===viewerStory?'current':''}"><i></i></span>`).join('');
    $('#bulutStoryMedia').innerHTML=story.media_type==='video'?`<video id="bulutStoryVideoEl" src="${escStory(story.media_url)}" autoplay playsinline></video>`:`<img src="${escStory(story.media_url)}" alt="Hikâye">`;
    markViewed(story);
    if(story.media_type==='video'){const v=$('#bulutStoryVideoEl');v.onended=nextStory;storyTimer=setTimeout(nextStory,15000)}else storyTimer=setTimeout(nextStory,5000);
  }
  function nextStory(){clearTimeout(storyTimer);const g=storyGroups[viewerGroup];if(g&&viewerStory<g.stories.length-1){viewerStory++;renderViewer();return}if(viewerGroup<storyGroups.length-1){viewerGroup++;viewerStory=0;renderViewer();return}closeViewer()}
  function prevStory(){clearTimeout(storyTimer);if(viewerStory>0){viewerStory--;renderViewer();return}if(viewerGroup>0){viewerGroup--;viewerStory=Math.max(0,storyGroups[viewerGroup].stories.length-1);renderViewer()}}
  function closeViewer(){clearTimeout(storyTimer);$('#bulutStoryViewer')?.classList.remove('on');loadStories()}

  const boot=()=>{ensureUi();loadStories();setInterval(touchPresence,60000);setInterval(loadStories,90000)};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else setTimeout(boot,0);
  window.addEventListener('focus',()=>{touchPresence();loadStories()});
  document.addEventListener('visibilitychange',()=>{if(!document.hidden){touchPresence();loadStories()}});
  window.BulutStories={reload:loadStories};
})();