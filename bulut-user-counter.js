(()=>{
 const SUPA='https://wtkiozzylhvphxenrpwq.supabase.co';
 const KEY='sb_publishable_pDW5FSXya-HqQDl4pI4lAQ_Hdm7yptb';
 const fmt=n=>new Intl.NumberFormat('tr-TR').format(Number(n)||0);
 const host=document.createElement('div');host.id='bulutUserCounter';document.body.appendChild(host);
 const sh=host.attachShadow({mode:'open'});
 sh.innerHTML=`<style>
 :host{all:initial}.wrap{position:fixed;top:78px;right:8px;z-index:26;font-family:Arial,sans-serif;display:flex;align-items:stretch;background:rgba(255,255,255,.96);border:1px solid #dbe9f6;border-radius:16px;box-shadow:0 8px 22px rgba(25,70,120,.15);overflow:hidden;backdrop-filter:blur(10px)}
 .cell{min-width:62px;padding:7px 8px;text-align:center;border-left:1px solid #e7eef6}.cell:first-child{border-left:0}.lab{font-size:10px;font-weight:800;color:#71829a;white-space:nowrap}.num{font-size:16px;font-weight:950;color:#10233f;line-height:1.15;font-variant-numeric:tabular-nums;letter-spacing:.3px}.total .num{color:#2d8cff}.dot{display:inline-block;width:6px;height:6px;border-radius:50%;background:#22c55e;margin-right:3px;vertical-align:1px;animation:pulse 1.6s ease-in-out infinite}@keyframes pulse{50%{opacity:.35;transform:scale(.8)}}
 @media(max-width:520px){.wrap{top:73px;right:6px;border-radius:14px}.cell{min-width:54px;padding:6px 6px}.lab{font-size:9px}.num{font-size:14px}}
 @media(prefers-reduced-motion:reduce){.dot{animation:none}}
 </style><div class="wrap" aria-label="BULUT kullanıcı sayacı"><div class="cell"><div class="lab">🇹🇷 Türkiye</div><div class="num" id="tr">0</div></div><div class="cell"><div class="lab">🌍 Global</div><div class="num" id="gl">0</div></div><div class="cell total"><div class="lab"><span class="dot"></span>Toplam</div><div class="num" id="tt">0</div></div></div>`;
 const $=id=>sh.getElementById(id);
 let shown={turkey:0,global:0,total:0}, raf=0;
 function animate(key,to){const el=key==='turkey'?$('tr'):key==='global'?$('gl'):$('tt');const from=shown[key]||0,start=performance.now(),dur=650;cancelAnimationFrame(raf);const step=t=>{const p=Math.min(1,(t-start)/dur),e=1-Math.pow(1-p,3),v=Math.round(from+(to-from)*e);el.textContent=fmt(v);if(p<1)raf=requestAnimationFrame(step);else shown[key]=to};raf=requestAnimationFrame(step)}
 async function counts(){try{const r=await fetch(`${SUPA}/rest/v1/rpc/get_bulut_user_counts`,{method:'POST',headers:{apikey:KEY,Authorization:`Bearer ${KEY}`,'Content-Type':'application/json'},body:'{}'});if(!r.ok)throw 0;const j=await r.json();const x=Array.isArray(j)?j[0]:j;if(!x)return;animate('turkey',x.turkey);animate('global',x.global);animate('total',x.total)}catch{}}
 async function region(){try{const rr=await fetch('/api/region',{cache:'no-store'}),g=await rr.json();if(!g.country)return;const c=window.supabase?.createClient?.(SUPA,KEY);if(!c)return;const {data:{session}}=await c.auth.getSession();if(!session)return;const q=await c.from('profiles').select('country_code').eq('id',session.user.id).maybeSingle();if(q.data?.country_code!==g.country){await c.from('profiles').update({country_code:g.country}).eq('id',session.user.id);setTimeout(counts,400)}}catch{}}
 counts();region();setInterval(counts,60000);document.addEventListener('visibilitychange',()=>{if(!document.hidden)counts()});window.BulutUserCounter={reload:counts};
})();
