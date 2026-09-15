#!/usr/bin/env python3
from pathlib import Path
import re

p=Path(__file__).resolve().parent/'app/src/main/assets/index.html'
s=p.read_text(encoding='utf-8')

for marker in ['id="aiPanel"','function updateAnalysis(redraw=true)','function localAnalysis(cs,mtfBias=0)','function paSnapshot(cs)','function panChartPoint(x,y,holder)']:
    if marker not in s:
        raise SystemExit('V13 safety: V10 base marker missing: '+marker)

pat=r"function closeWS\(\)\{.*?\nfunction updateYearFromMonth\(m\)\{"
m=re.search(pat,s,re.S)
if not m:
    raise SystemExit('V13 websocket block anchor not found')

new=r'''function closeWS(){
 state._liveToken=(state._liveToken||0)+1;
 if(state._livePoll){clearInterval(state._livePoll);state._livePoll=null}
 if(state._wsReconnect){clearTimeout(state._wsReconnect);state._wsReconnect=null}
 if(state.ws){try{state.ws.onopen=state.ws.onmessage=state.ws.onerror=state.ws.onclose=null;state.ws.close()}catch(e){}state.ws=null}
}
function mergeLiveKline(c,closed=false){
 if(!c||!Number.isFinite(c.t)||!Number.isFinite(c.c))return;
 if(state.interval==='1Y'){updateYearFromMonth(c);scheduleChartDraw();return}
 let a=state.candles,last=a[a.length-1];
 if(!last||c.t>last.t){a.push(c);if(a.length>2600)a.splice(0,a.length-2600)}
 else if(c.t===last.t){a[a.length-1]=c}
 else{let i=a.findIndex(x=>x.t===c.t);if(i>=0)a[i]=c}
 let now=performance.now();if(now-(state._lastLiveAi||0)>1000){state._lastLiveAi=now;updateAnalysis(false)}
 scheduleChartDraw();
 if(closed&&state.lastClosedTime!==c.t){state.lastClosedTime=c.t;updateAnalysis();runMTF(false)}
}
async function pollLiveKline(token){
 if(token!==state._liveToken||state.loading)return;
 try{
  let real=state.interval==='1Y'?'1M':state.interval;
  let url=`${baseRest()}${klinePath()}?symbol=${encodeURIComponent(state.symbol)}&interval=${real}&limit=2&_=${Date.now()}`;
  let arr=await getJSON(url);
  if(token!==state._liveToken||!Array.isArray(arr)||!arr.length)return;
  for(let row of arr){let c=parseKline(row);if(state.interval==='1Y')updateYearFromMonth(c);else mergeLiveKline(c,false)}
  state._lastLiveFeed=Date.now();
  setStatus(`CANLI • ${state.market} • ${state.symbol} • ${tfLabel(state.interval)}`,'live')
 }catch(e){console.warn('Live poll',e)}
}
function startLivePoll(token){
 if(state._livePoll)clearInterval(state._livePoll);
 pollLiveKline(token);
 state._livePoll=setInterval(()=>pollLiveKline(token),500)
}
function openWS(){
 closeWS();let token=state._liveToken,real=state.interval==='1Y'?'1M':state.interval,stream=`${state.symbol.toLowerCase()}@kline_${real}`;
 startLivePoll(token);
 try{
  let w=new WebSocket(wsBase()+stream);state.ws=w;
  w.onopen=()=>{if(token===state._liveToken)setStatus(`TICK CANLI • ${state.market} • ${state.symbol} • ${tfLabel(state.interval)}`,'live')};
  w.onmessage=ev=>{
   if(token!==state._liveToken)return;
   let j=JSON.parse(ev.data),k=j.k;if(!k)return;
   let c={t:+k.t,o:+k.o,h:+k.h,l:+k.l,c:+k.c,v:+k.v,T:+k.T};
   state._lastLiveFeed=Date.now();mergeLiveKline(c,!!k.x)
  };
  w.onerror=()=>{if(token===state._liveToken)setStatus('Canlı akış REST yedeğiyle devam ediyor','live')};
  w.onclose=()=>{if(token===state._liveToken){state._wsReconnect=setTimeout(()=>{if(token===state._liveToken)openWS()},1800)}}
 }catch(e){console.warn('WS',e);setStatus('Canlı akış REST yedeğiyle devam ediyor','live')}
}
function updateLiveCandle(c){mergeLiveKline(c,false)}
function remainingText(c){
 if(!c)return '—';let end=Number(c.T);if(!Number.isFinite(end)||end<=c.t){
  let d=new Date(c.t),tf=state.interval;
  if(tf==='1Y')end=Date.UTC(d.getUTCFullYear()+1,0,1)-1;
  else if(tf==='1M')end=Date.UTC(d.getUTCFullYear(),d.getUTCMonth()+1,1)-1;
  else if(tf==='1w')end=c.t+7*86400000-1;
  else{let ms={'1m':60000,'3m':180000,'5m':300000,'15m':900000,'30m':1800000,'1h':3600000,'2h':7200000,'4h':14400000,'6h':21600000,'8h':28800000,'12h':43200000,'1d':86400000,'3d':259200000}[tf]||60000;end=c.t+ms-1}
 }
 let sec=Math.max(0,Math.ceil((end-Date.now())/1000)),days=Math.floor(sec/86400);sec%=86400;let hr=Math.floor(sec/3600);sec%=3600;let mn=Math.floor(sec/60),ss=sec%60;
 return (days?days+'g ':'')+hr+'sa '+mn+'dk '+String(ss).padStart(2,'0')+'sn'
}
function updateYearFromMonth(m){'''

s=s[:m.start()]+new+s[m.end():]

old="priceTag(plotW+1,Math.max(0,Math.min(bottom-30,cy-15)),80,30,'#1c9e8b',fmt(live.c),'CANLI',true,w,h);"
newcall="priceTag(plotW+1,Math.max(0,Math.min(bottom-34,cy-17)),80,34,'#1c9e8b',fmt(live.c),remainingText(live),true,w,h);"
if old not in s:
    raise SystemExit('V13 live price tag anchor not found')
s=s.replace(old,newcall,1)

oldfn="function priceTag(x,y,wid,hei,col,a,b,two,W,H){ctx.fillStyle=col;ctx.fillRect(x,y,wid,hei);ctx.fillStyle='#fff';ctx.textAlign='left';ctx.font='13px Arial';ctx.fillText(a,x+7,y+13);if(two){ctx.font='9px Arial';ctx.fillText(b,x+7,y+25)}}"
newfn="function priceTag(x,y,wid,hei,col,a,b,two,W,H){ctx.fillStyle=col;ctx.fillRect(x,y,wid,hei);ctx.fillStyle='#fff';ctx.textAlign='left';ctx.font='13px Arial';ctx.fillText(a,x+7,y+13);if(two){ctx.font='7.5px Arial';ctx.fillText(b,x+5,y+27)}}"
if oldfn not in s:
    raise SystemExit('V13 priceTag function anchor not found')
s=s.replace(oldfn,newfn,1)

anchor="addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(fitCanvas,80)});"
if anchor not in s:
    raise SystemExit('V13 resize anchor missing')
s=s.replace(anchor,anchor+"\nsetInterval(()=>{if(state.candles.length)scheduleChartDraw()},500);",1)

for marker in ['id="aiPanel"','function updateAnalysis(redraw=true)','PRICE ACTION KRİTERLERİ','remainingText(live)','setInterval(()=>pollLiveKline(token),500)']:
    if marker not in s:
        raise SystemExit('V13 safety after patch failed: '+marker)

p.write_text(s,encoding='utf-8')
print('V13 live kline WS + REST fallback + timeframe countdown applied',p)
