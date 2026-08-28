(()=>{
  const escFile=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const fileInput=document.createElement('input');
  fileInput.type='file';
  fileInput.id='bulutChatFileInput';
  fileInput.hidden=true;
  document.body.appendChild(fileInput);

  const style=document.createElement('style');
  style.textContent=`
    .bulut-attachment{min-width:180px;max-width:260px}
    .bulut-attachment img{display:block;width:100%;max-height:220px;object-fit:cover;border-radius:14px;margin-bottom:7px;background:#dce9f6}
    .bulut-attachment video{display:block;width:100%;max-height:260px;border-radius:14px;margin-bottom:7px;background:#111}
    .bulut-attachment audio{display:block;width:240px;max-width:100%;margin:3px 0 8px}
    .bulut-attachment a{color:inherit;text-decoration:none;font-weight:800;word-break:break-word}
    .bulut-attachment .fileCard{display:flex;align-items:center;gap:9px;padding:10px;border-radius:13px;background:rgba(255,255,255,.22);border:1px solid rgba(255,255,255,.35)}
    #chatMessages .bubble:not(.mine) .bulut-attachment .fileCard{background:#f1f7fd;border-color:#dbe8f5}
    .bulut-file-size{font-size:11px;opacity:.76;margin-top:3px}
    #bulutFileBtn.uploading{opacity:.55;pointer-events:none}
  `;
  document.head.appendChild(style);

  const markerRe=/^\[\[BULUT_FILE\|([^|]*)\|([^|]*)\|([^|]*)\|(\d+)\]\]$/;
  const prettySize=n=>{n=Number(n||0);if(n<1024)return n+' B';if(n<1048576)return (n/1024).toFixed(1)+' KB';return (n/1048576).toFixed(1)+' MB'};

  try{
    const originalBubble=messageBubble;
    window.messageBubble=function(m){
      const hit=String(m?.body||'').match(markerRe);
      if(!hit)return originalBubble(m);
      const mine=m.sender_id===session.user.id;
      const dt=new Date(m.created_at);
      const time=dt.toLocaleTimeString('tr-TR',{hour:'2-digit',minute:'2-digit'});
      const state=mine?(m.read_at?' · Görüldü':m.delivered_at?' · İletildi':''):'';
      let name='Dosya';try{name=decodeURIComponent(hit[1])}catch{}
      const url=hit[2],mime=hit[3]||'application/octet-stream',size=Number(hit[4]||0);
      const safeUrl=escFile(url),safeName=escFile(name);
      let media='';
      if(mime.startsWith('image/'))media=`<a href="${safeUrl}" target="_blank" rel="noopener"><img src="${safeUrl}" alt="${safeName}" loading="lazy"></a>`;
      else if(mime.startsWith('video/'))media=`<video src="${safeUrl}" controls playsinline preload="metadata"></video>`;
      else if(mime.startsWith('audio/'))media=`<audio src="${safeUrl}" controls preload="metadata"></audio>`;
      const fileCard=`<a class="fileCard" href="${safeUrl}" target="_blank" rel="noopener"><span style="font-size:22px">📎</span><span><span>${safeName}</span><div class="bulut-file-size">${escFile(prettySize(size))} · Aç</div></span></a>`;
      return `<div class="bubble ${mine?'mine':''}"><div class="bulut-attachment">${media}${fileCard}</div><div class="bt">${time}${state}</div></div>`;
    };
  }catch(err){console.error('BULUT attachment renderer',err)}

  document.addEventListener('click',e=>{
    const btn=e.target.closest?.('#bulutFileBtn');
    if(!btn)return;
    e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
    if(!session){if(typeof toast==='function')toast('Dosya göndermek için giriş yapın.');return}
    if(!currentChat){if(typeof toast==='function')toast('Önce bir sohbet açın.');return}
    fileInput.click();
  },true);

  fileInput.addEventListener('change',async()=>{
    const file=fileInput.files?.[0];
    if(!file)return;
    fileInput.value='';
    if(!session||!currentChat)return;
    if(file.size>20*1024*1024){if(typeof toast==='function')toast('Dosya en fazla 20 MB olabilir.');else alert('Dosya en fazla 20 MB olabilir.');return}
    const btn=document.getElementById('bulutFileBtn');
    if(btn){btn.classList.add('uploading');btn.textContent='⏳'}
    try{
      const safe=(file.name||'dosya').replace(/[^a-zA-Z0-9._-]+/g,'_').slice(-90)||'dosya';
      const path=`${session.user.id}/${currentChat.id}/${Date.now()}-${crypto.randomUUID()}-${safe}`;
      const up=await sb.storage.from('chat-files').upload(path,file,{contentType:file.type||'application/octet-stream',upsert:false});
      if(up.error)throw up.error;
      const url=sb.storage.from('chat-files').getPublicUrl(path).data.publicUrl;
      const body=`[[BULUT_FILE|${encodeURIComponent(file.name||'Dosya')}|${url}|${file.type||'application/octet-stream'}|${file.size}]]`;
      const ins=await sb.from('messages').insert({chat_request_id:currentChat.id,sender_id:session.user.id,body});
      if(ins.error){await sb.storage.from('chat-files').remove([path]);throw ins.error}
      if(typeof loadChatMessages==='function')await loadChatMessages();
      if(typeof toast==='function')toast('Dosya gönderildi.');
    }catch(err){
      console.error('BULUT file upload',err);
      if(typeof toast==='function')toast('Dosya gönderilemedi.');else alert('Dosya gönderilemedi.');
    }finally{
      if(btn){btn.classList.remove('uploading');btn.textContent='📎'}
    }
  });
})();
