#!/usr/bin/env python3
from pathlib import Path
import re

p=Path(__file__).resolve().parent/"app/src/main/assets/index.html"
s=p.read_text(encoding='utf-8')

# V12 MUST be applied on the known-good V10 UI/PA engine.
for marker in ['id="aiPanel"','function updateAnalysis(redraw=true)','function localAnalysis(cs,mtfBias=0)','function paSnapshot(cs)']:
    if marker not in s:
        raise SystemExit('V12 safety: V10 Price Action/analysis panel missing: '+marker)

pat=r"function closeWS\(\)\{.*?\nfunction updateYearFromMonth\(m\)\{"
m=re.search(pat,s,re.S)
if not m:
    raise SystemExit('V12 websocket anchor not found')

new=r'''function closeWS(){
 state._wsToken=(state._wsToken||0)+1;
 if(state._wsTimer){clearTimeout(state._wsTimer);state._wsTimer=null}
 for(const key of ['ws','wsTrade']){
  let w=state[key];
  if(w){try{w.onopen=w.onmessage=w.onerror=w.onclose=null;w.close()}catch(e){}state[key]=null}
 }
}
function intervalBucketStart(ts,interval){
 let d=new Date(ts);
 if(interval==='1Y')return Date.UTC(d.getUTCFullYear(),0,1);
 if(interval==='1M')return Date.UTC(d.getUTCFullYear(),d.getUTCMonth(),1);
 if(interval==='1w'){let day=(d.getUTCDay()+6)%7,mid=Date.UTC(d.getUTCFullYear(),d.getUTCMonth(),d.getUTCDate());return mid-day*86400000}
 let map={'1m':60000,'3m':180000,'5m':300000,'15m':900000,'30m':1800000,'1h':3600000,'2h':7200000,'4h':14400000,'6h':21600000,'8h':28800000,'12h':43200000,'1d':86400000,'3d':259200000};
 let ms=map[interval]||60000;return Math.floor(ts/ms)*ms
}
function intervalBucketEnd(t,interval){
 if(interval==='1Y'){let d=new Date(t);return Date.UTC(d.getUTCFullYear()+1,0,1)-1}
 if(interval==='1M'){let d=new Date(t);return Date.UTC(d.getUTCFullYear(),d.getUTCMonth()+1,1)-1}
 if(interval==='1w')return t+7*86400000-1;
 let map={'1m':60000,'3m':180000,'5m':300000,'15m':900000,'30m':1800000,'1h':3600000,'2h':7200000,'4h':14400000,'6h':21600000,'8h':28800000,'12h':43200000,'1d':86400000,'3d':259200000};
 return t+(map[interval]||60000)-1
}
function trimLiveCandles(){if(state.candles.length>2600)state.candles.splice(0,state.candles.length-2600)}
function refreshLiveAnalysis(){let now=performance.now();if(now-(state._lastAiTick||0)>800){state._lastAiTick=now;updateAnalysis(false)}}
function mergeOfficialKline(c,closed=false,eventStamp=Date.now()){
 let a=state.candles,last=a[a.length-1];
 if(state.interval==='1Y'){updateYearFromMonth(c);refreshLiveAnalysis();scheduleChartDraw();return}
 if(last&&last.t===c.t){
  let tradeStamp=last._tradeStamp||0;
  a[a.length-1]={...c,c:tradeStamp>eventStamp?last.c:c.c,_tradeStamp:tradeStamp,_closed:closed};
 }else if(!last||c.t>last.t){
  a.push({...c,_closed:closed});trimLiveCandles();
 }else{
  let idx=a.findIndex(x=>x.t===c.t);if(idx>=0)a[idx]={...c,_closed:closed}
 }
 refreshLiveAnalysis();scheduleChartDraw()
}
function applyTradeToCandle(price,qty,tradeTime,eventTime){
 if(!Number.isFinite(price)||!Number.isFinite(tradeTime))return;
 let t=intervalBucketStart(tradeTime,state.interval),a=state.candles,last=a[a.length-1];
 if(state.interval==='1Y'){
  let y=new Date(t).getUTCFullYear();
  if(!last||last.y!==y){a.push({y,t,o:price,h:price,l:price,c:price,v:qty||0,T:intervalBucketEnd(t,'1Y'),_tradeStamp:eventTime});trimLiveCandles()}
  else{last.h=Math.max(last.h,price);last.l=Math.min(last.l,price);last.c=price;last._tradeStamp=eventTime}
  refreshLiveAnalysis();scheduleChartDraw();return
 }
 if(!last||t>last.t){
  // First real Binance trade of the new period -> new candle is born here.
  a.push({t,o:price,h:price,l:price,c:price,v:Math.max(0,qty||0),T:intervalBucketEnd(t,state.interval),_tradeStamp:eventTime,_closed:false});
  trimLiveCandles();refreshLiveAnalysis();scheduleChartDraw();return
 }
 if(t<last.t)return;
 last.h=Math.max(last.h,price);last.l=Math.min(last.l,price);last.c=price;last._tradeStamp=eventTime;last._closed=false;
 if(Number.isFinite(qty)&&qty>0)last.v=(last.v||0)+qty;
 refreshLiveAnalysis();scheduleChartDraw()
}
function scheduleWsReconnect(token){
 if(state._wsToken!==token)return;
 if(state._wsTimer)clearTimeout(state._wsTimer);
 state._wsTimer=setTimeout(()=>{if(state._wsToken===token)openWS()},1500)
}
function openWS(){
 closeWS();let token=state._wsToken,real=state.interval==='1Y'?'1M':state.interval,sym=state.symbol.toLowerCase();
 try{
  let w=new WebSocket(wsBase()+`${sym}@kline_${real}`);state.ws=w;
  w.onopen=()=>{if(state._wsToken===token)setStatus(`CANLI • ${state.market} • ${state.symbol} • ${tfLabel(state.interval)}`,'live')};
  w.onmessage=ev=>{
   if(state._wsToken!==token)return;
   let j=JSON.parse(ev.data),k=j.k;if(!k)return;
   let c={t:+k.t,o:+k.o,h:+k.h,l:+k.l,c:+k.c,v:+k.v,T:+k.T};
   mergeOfficialKline(c,!!k.x,+j.E||Date.now());
   if(k.x&&state.lastClosedTime!==c.t){state.lastClosedTime=c.t;updateAnalysis();runMTF(false)}
  };
  w.onerror=()=>{if(state._wsToken===token)setStatus('Kline akışı yeniden bağlanıyor…','err')};
  w.onclose=()=>scheduleWsReconnect(token);

  let tw=new WebSocket(wsBase()+`${sym}@aggTrade`);state.wsTrade=tw;
  tw.onopen=()=>{if(state._wsToken===token)setStatus(`TICK CANLI • ${state.market} • ${state.symbol} • ${tfLabel(state.interval)}`,'live')};
  tw.onmessage=ev=>{
   if(state._wsToken!==token)return;
   let j=JSON.parse(ev.data);
   applyTradeToCandle(+j.p,+j.q,+(j.T||j.E||Date.now()),+(j.E||j.T||Date.now()))
  };
  tw.onerror=()=>{if(state._wsToken===token)setStatus('Anlık işlem akışı yeniden bağlanıyor…','err')};
  tw.onclose=()=>scheduleWsReconnect(token);
 }catch(e){console.error(e);scheduleWsReconnect(token)}
}
function updateLiveCandle(c){mergeOfficialKline(c,false,Date.now())}
function updateYearFromMonth(m){'''

s=s[:m.start()]+new+s[m.end():]

# Final safety: analysis panel and PA logic must still be present after replacement.
for marker in ['id="aiPanel"','function updateAnalysis(redraw=true)','PRICE ACTION KRİTERLERİ']:
    if marker not in s:
        raise SystemExit('V12 safety after patch failed: '+marker)

p.write_text(s,encoding='utf-8')
print('V12: V10 base preserved + live Binance candles applied',p)
