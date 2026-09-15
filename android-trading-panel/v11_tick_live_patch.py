#!/usr/bin/env python3
from pathlib import Path
import re

p=Path(__file__).resolve().parent/"app/src/main/assets/index.html"
s=p.read_text(encoding='utf-8')

pat=r"function closeWS\(\)\{.*?\nfunction updateYearFromMonth\(m\)\{"
m=re.search(pat,s,re.S)
if not m:
    raise SystemExit('V11 websocket block anchor not found')

new=r'''function closeWS(){
 state.wsSession=(state.wsSession||0)+1;clearTimeout(state.wsReconnectTimer);state.wsReconnectTimer=null;
 for(const key of ['ws','wsTrade']){let w=state[key];if(w){try{w.onopen=w.onmessage=w.onerror=w.onclose=null;w.close()}catch(e){}state[key]=null}}
}
function candleBucketStart(ts,interval){
 let d=new Date(ts);
 if(interval==='1Y')return Date.UTC(d.getUTCFullYear(),0,1);
 if(interval==='1M')return Date.UTC(d.getUTCFullYear(),d.getUTCMonth(),1);
 if(interval==='1w'){let midnight=Date.UTC(d.getUTCFullYear(),d.getUTCMonth(),d.getUTCDate()),day=(d.getUTCDay()+6)%7;return midnight-day*86400000}
 const msMap={'1m':60000,'3m':180000,'5m':300000,'15m':900000,'30m':1800000,'1h':3600000,'2h':7200000,'4h':14400000,'6h':21600000,'8h':28800000,'12h':43200000,'1d':86400000,'3d':259200000};
 let ms=msMap[interval]||60000;return Math.floor(ts/ms)*ms
}
function candleBucketEnd(t,interval){
 if(interval==='1Y'){let d=new Date(t);return Date.UTC(d.getUTCFullYear()+1,0,1)-1}
 if(interval==='1M'){let d=new Date(t);return Date.UTC(d.getUTCFullYear(),d.getUTCMonth()+1,1)-1}
 if(interval==='1w')return t+7*86400000-1;
 const msMap={'1m':60000,'3m':180000,'5m':300000,'15m':900000,'30m':1800000,'1h':3600000,'2h':7200000,'4h':14400000,'6h':21600000,'8h':28800000,'12h':43200000,'1d':86400000,'3d':259200000};return t+(msMap[interval]||60000)-1
}
function trimLiveCandles(){if(state.candles.length>2400)state.candles.splice(0,state.candles.length-2400)}
function findCandleIndex(t){let a=state.candles;for(let i=a.length-1;i>=Math.max(0,a.length-8);i--)if(a[i].t===t)return i;return -1}
function maybeTickAnalysis(){let now=performance.now();if(now-(state.lastTickAnalysisAt||0)>700){state.lastTickAnalysisAt=now;updateAnalysis(false)}}
function updateLiveCandle(c,closed=false,eventTime=Date.now()){
 let a=state.candles,idx=findCandleIndex(c.t);c._e=eventTime;c._closed=!!closed;
 if(idx>=0){
  let old=a[idx];
  if(closed)a[idx]=c;
  else{let newerTrade=(old._e||0)>eventTime;a[idx]={...c,h:Math.max(c.h,old.h),l:Math.min(c.l,old.l),c:newerTrade?old.c:c.c,_e:Math.max(eventTime,old._e||0),_closed:false}}
 }else{
  let last=a[a.length-1];
  if(!last||c.t>last.t)a.push(c);else{let pos=a.findIndex(x=>x.t>c.t);if(pos<0)a.push(c);else a.splice(pos,0,c)}
 }
 trimLiveCandles();maybeTickAnalysis();scheduleChartDraw()
}
function applyTradeTick(price,qty,tradeTime,eventTime){
 if(!Number.isFinite(price)||!Number.isFinite(tradeTime))return;
 let t=candleBucketStart(tradeTime,state.interval),a=state.candles,last=a[a.length-1];
 if(!last||t>last.t){
  let c={t,o:price,h:price,l:price,c:price,v:Math.max(0,qty||0),T:candleBucketEnd(t,state.interval),_e:eventTime,_closed:false};
  if(state.interval==='1Y')c.y=new Date(t).getUTCFullYear();a.push(c);trimLiveCandles();maybeTickAnalysis();scheduleChartDraw();return
 }
 if(t<last.t)return;
 last.h=Math.max(last.h,price);last.l=Math.min(last.l,price);last.c=price;last._e=eventTime;last._closed=false;
 if(Number.isFinite(qty)&&qty>0)last._liveQty=(last._liveQty||0)+qty;
 maybeTickAnalysis();scheduleChartDraw()
}
function scheduleWSReconnect(token){if(state.wsSession!==token)return;clearTimeout(state.wsReconnectTimer);state.wsReconnectTimer=setTimeout(()=>{if(state.wsSession===token)openWS()},1200)}
function openWS(){
 closeWS();let token=state.wsSession,real=state.interval==='1Y'?'1M':state.interval,sym=state.symbol.toLowerCase();
 try{
  let w=new WebSocket(wsBase()+`${sym}@kline_${real}`);state.ws=w;
  w.onopen=()=>{if(state.wsSession===token)setStatus(`CANLI TICK • ${state.market} • ${state.symbol} • ${tfLabel(state.interval)}`,'live')};
  w.onmessage=ev=>{if(state.wsSession!==token)return;let j=JSON.parse(ev.data),k=j.k;if(!k)return;let c={t:+k.t,o:+k.o,h:+k.h,l:+k.l,c:+k.c,v:+k.v,T:+k.T};if(state.interval==='1Y'){updateYearFromMonth(c);scheduleChartDraw()}else updateLiveCandle(c,!!k.x,+j.E||Date.now());if(k.x&&state.lastClosedTime!==c.t){state.lastClosedTime=c.t;updateAnalysis();runMTF(false)}};
  w.onerror=()=>{if(state.wsSession===token)setStatus('Kline akışı yeniden bağlanıyor…','err')};
  w.onclose=()=>scheduleWSReconnect(token);

  let tw=new WebSocket(wsBase()+`${sym}@aggTrade`);state.wsTrade=tw;
  tw.onopen=()=>{if(state.wsSession===token)setStatus(`TICK CANLI • ${state.market} • ${state.symbol} • ${tfLabel(state.interval)}`,'live')};
  tw.onmessage=ev=>{if(state.wsSession!==token)return;let j=JSON.parse(ev.data),price=+j.p,qty=+j.q,t=+(j.T||j.E||Date.now()),e=+(j.E||j.T||Date.now());applyTradeTick(price,qty,t,e)};
  tw.onerror=()=>{if(state.wsSession===token)setStatus('Anlık işlem akışı yeniden bağlanıyor…','err')};
  tw.onclose=()=>scheduleWSReconnect(token);
 }catch(e){console.error(e);scheduleWSReconnect(token)}
}
function updateYearFromMonth(m){'''

s=s[:m.start()]+new+s[m.end():]
p.write_text(s,encoding='utf-8')
print('V11 Binance tick-live candle stream patch applied',p)
