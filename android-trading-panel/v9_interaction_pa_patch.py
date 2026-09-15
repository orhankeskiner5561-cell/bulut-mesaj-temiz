#!/usr/bin/env python3
from pathlib import Path

p=Path(__file__).resolve().parent/"app/src/main/assets/index.html"
s=p.read_text(encoding="utf-8")

anchor="#liveDot{position:absolute;z-index:11;right:12.7%;top:5.4%;width:5px;height:22px;background:#ed1737;border-radius:3px}\n"
if anchor not in s: raise SystemExit('V9 css top anchor not found')
s=s.replace(anchor,anchor+"#shareBtn,#liveDot{display:none!important}\n",1)

old="#aiReason{margin-top:5px;font-size:9px;color:#aeb5bd;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n#aiGrip{margin-left:auto;color:#aeb5bd;font-size:15px;letter-spacing:-2px;padding:1px 4px;opacity:.9}\n"
new="#aiReason{margin-top:5px;font-size:9px;color:#aeb5bd;white-space:normal;line-height:1.35}\n#aiChecks{margin-top:6px;display:flex;flex-wrap:wrap;gap:4px;max-width:520px}\n.paChip{font-size:8px;line-height:1;padding:4px 6px;border-radius:9px;border:1px solid #454b52;background:#272c31;color:#d9dee3;white-space:nowrap}\n.paChip.long{border-color:#247d69;color:#7fe0c7;background:#17352e}.paChip.short{border-color:#8d3947;color:#ff9aab;background:#3a1f25}.paChip.neutral{color:#c9cdd2}\n#aiGrip{margin-left:auto;color:#aeb5bd;font-size:15px;letter-spacing:-2px;padding:1px 4px;opacity:.9}\n"
if old not in s: raise SystemExit('V9 ai css anchor not found')
s=s.replace(old,new,1)

anchor="#toast{position:absolute;z-index:120;left:50%;bottom:11%;transform:translate(-50%,20px);background:rgba(20,22,24,.94);border:1px solid #3a3e44;border-radius:9px;padding:9px 14px;font-size:12px;opacity:0;transition:.2s;pointer-events:none}#toast.show{opacity:1;transform:translate(-50%,0)}\n"
fullcss=anchor+"#fullExit{display:none;position:absolute;z-index:180;right:10px;bottom:10px;width:48px;height:48px;border:1px solid #4b4f54;border-radius:10px;background:rgba(15,17,19,.88);color:#fff;font-size:25px;align-items:center;justify-content:center}\n#app.chartFull #chartWrap{left:0;right:0;top:0;height:100%}\n#app.chartFull #toolBar,#app.chartFull #nav,#app.chartFull .topBtn,#app.chartFull #statusPill,#app.chartFull #aiPanel,#app.chartFull #pairReel{display:none!important}\n#app.chartFull #fullExit{display:flex}\n"
if anchor not in s: raise SystemExit('V9 fullscreen css anchor not found')
s=s.replace(anchor,fullcss,1)

old='    <div id="aiReason">Price Action + MTF + EMA + ATR + RSI + hacim</div>\n'
new='    <div id="aiReason">Price Action • Yapı • BOS/CHoCH • Likidite • FVG • Order Block • MTF</div>\n    <div id="aiChecks"></div>\n'
if old not in s: raise SystemExit('V9 ai markup anchor not found')
s=s.replace(old,new,1)

old='<div class="tool">↶</div><div class="tool">↷</div><div class="tool">⛶</div>'
new='<div class="tool">↶</div><div class="tool">↷</div><div class="tool" id="fullBtn">⛶</div>'
if old not in s: raise SystemExit('V9 full button anchor not found')
s=s.replace(old,new,1)

anchor='  <div id="nav"><div class="navItem"><span class="navIcon">▤</span>İzleme Listesi</div><div class="navItem active"><span class="navIcon">⌁</span>Grafik</div><div class="navItem"><span class="navIcon">◉</span>Keşfet</div><div class="navItem"><span class="navIcon">♧</span>Topluluk</div><div class="navItem"><span class="navIcon">☰</span>Menü</div></div>\n'
if anchor not in s: raise SystemExit('V9 nav anchor not found')
s=s.replace(anchor,anchor+'  <button id="fullExit" aria-label="Tam ekrandan çık">⛶</button>\n',1)

old="const state={market:'FUTURES',symbol:'BTCUSDT',interval:'1h',candles:[],symbols:[],tickerMap:new Map(),ws:null,zoomX:1,panX:0,panY:0,zoomY:1,analysis:null,mtfBias:0,mtfText:'MTF bekleniyor',loading:false,lastClosedTime:0};"
new="const state={market:'FUTURES',symbol:'BTCUSDT',interval:'1h',candles:[],symbols:[],tickerMap:new Map(),ws:null,zoomX:1,panX:0,panY:0,zoomY:1,analysis:null,mtfBias:0,mtfText:'MTF PA bekleniyor',loading:false,loadingOlder:false,hasOlder:true,lastClosedTime:0};"
if old not in s: raise SystemExit('V9 state anchor not found')
s=s.replace(old,new,1)

anchor="async function fetchCandles(interval=state.interval,limit=500){let real=interval==='1Y'?'1M':interval;let lim=interval==='1Y'?1000:limit;let url=`${baseRest()}${klinePath()}?symbol=${encodeURIComponent(state.symbol)}&interval=${real}&limit=${lim}`;let arr=await getJSON(url);let c=arr.map(parseKline);return interval==='1Y'?aggregateYearly(c):c}\n"
if anchor not in s: raise SystemExit('V9 fetch anchor not found')
add=anchor+"async function fetchOlderCandles(){if(state.loadingOlder||!state.hasOlder||!state.candles.length||state.interval==='1Y')return;state.loadingOlder=true;try{let first=state.candles[0],real=state.interval,url=`${baseRest()}${klinePath()}?symbol=${encodeURIComponent(state.symbol)}&interval=${real}&limit=500&endTime=${first.t-1}`;let arr=await getJSON(url),older=arr.map(parseKline).filter(x=>x.t<first.t);if(!older.length){state.hasOlder=false;return}let seen=new Set(state.candles.map(x=>x.t));older=older.filter(x=>!seen.has(x.t));if(older.length){state.candles=older.concat(state.candles);updateAnalysis(false);scheduleChartDraw()}if(arr.length<500)state.hasOlder=false}catch(e){console.warn('Eski mumlar yüklenemedi',e)}finally{state.loadingOlder=false}}\nfunction maybeLoadOlder(){if(state.loadingOlder||!state.hasOlder||state.interval==='1Y'||!state.candles.length)return;let r=canvas.getBoundingClientRect();if(!r.width)return;let vr=chartView(r.width);if(vr.maxOlder>0&&state.panX>=vr.maxOlder-vr.plotW*.28)fetchOlderCandles()}\n"
s=s.replace(anchor,add,1)

old="async function switchChart(reset=true){if(state.loading)return;state.loading=true;closeWS();setStatus(`Binance • ${state.symbol} ${tfLabel(state.interval)} yükleniyor…`);try{state.candles=await fetchCandles(state.interval,500);if(reset){state.zoomX=1;state.panX=0;state.panY=0;state.zoomY=1}$('pairCurrent').textContent=state.symbol;$('tfCurrent').textContent=tfLabel(state.interval);updateAnalysis();draw();openWS();runMTF();setStatus(`CANLI • ${state.market} • ${state.symbol} • ${tfLabel(state.interval)}`,'live')}catch(e){console.error(e);setStatus('Binance verisi alınamadı: '+e.message,'err');toast('Bağlantı hatası')}finally{state.loading=false}}"
new="async function switchChart(reset=true){if(state.loading)return;state.loading=true;closeWS();setStatus(`Binance • ${state.symbol} ${tfLabel(state.interval)} yükleniyor…`);try{state.candles=await fetchCandles(state.interval,500);state.hasOlder=true;state.loadingOlder=false;if(reset){state.zoomX=1;state.panX=0;state.panY=0;state.zoomY=1}$('pairCurrent').textContent=state.symbol;$('tfCurrent').textContent=tfLabel(state.interval);updateAnalysis();draw();openWS();runMTF();setStatus(`CANLI • ${state.market} • ${state.symbol} • ${tfLabel(state.interval)}`,'live')}catch(e){console.error(e);setStatus('Binance verisi alınamadı: '+e.message,'err');toast('Bağlantı hatası')}finally{state.loading=false}}"
if old not in s: raise SystemExit('V9 switch anchor not found')
s=s.replace(old,new,1)

start=s.find('function localAnalysis(cs,mtfBias=0){')
end=s.find('\nfunction chartView(w){',start)
if start<0 or end<0: raise SystemExit('V9 analysis block anchor not found')
new_analysis=r'''function paSnapshot(cs){
 if(!cs||cs.length<25)return null;
 let n=cs.length,last=cs[n-1],window=cs.slice(-120),pv=pivots(window,2,2),his=pv.hi,lows=pv.lo;
 let lastH=his.length?his[his.length-1].p:Math.max(...window.slice(0,-1).map(x=>x.h)),prevH=his.length>1?his[his.length-2].p:lastH;
 let lastL=lows.length?lows[lows.length-1].p:Math.min(...window.slice(0,-1).map(x=>x.l)),prevL=lows.length>1?lows[lows.length-2].p:lastL;
 let bullStruct=his.length>1&&lows.length>1&&lastH>prevH&&lastL>prevL,bearStruct=his.length>1&&lows.length>1&&lastH<prevH&&lastL<prevL;
 let bias=bullStruct?1:bearStruct?-1:0,structure=bullStruct?'HH/HL':bearStruct?'LH/LL':'RANGE';
 let bosUp=last.c>lastH,bosDn=last.c<lastL,chochUp=bias<0&&bosUp,chochDn=bias>0&&bosDn;
 let sweepLow=last.l<lastL&&last.c>lastL,sweepHigh=last.h>lastH&&last.c<lastH;
 let a=cs[n-3],d=cs[n-1],fvgUp=!!a&&a.h<d.l,fvgDn=!!a&&a.l>d.h;
 let fvgZone=fvgUp?{lo:a.h,hi:d.l,dir:1}:fvgDn?{lo:d.h,hi:a.l,dir:-1}:null;
 let range=cs.slice(-80),rangeH=Math.max(...range.map(x=>x.h)),rangeL=Math.min(...range.map(x=>x.l)),mid=(rangeH+rangeL)/2,discount=last.c<=mid;
 let A=atr(cs,14);A=Number.isFinite(A)&&A>0?A:last.c*.01;
 function findOB(dir){for(let i=n-3;i>=Math.max(1,n-20);i--){let c=cs[i],after=cs.slice(i+1,Math.min(n,i+7));if(!after.length)continue;if(dir>0&&c.c<c.o&&Math.max(...after.map(x=>x.h))>c.h+A*.35)return{lo:c.l,hi:Math.max(c.o,c.c),dir:1};if(dir<0&&c.c>c.o&&Math.min(...after.map(x=>x.l))<c.l-A*.35)return{lo:Math.min(c.o,c.c),hi:c.h,dir:-1}}return null}
 let bullOB=findOB(1),bearOB=findOB(-1);
 let bullObTouch=!!bullOB&&last.l<=bullOB.hi+A*.15&&last.c>bullOB.hi,bearObTouch=!!bearOB&&last.h>=bearOB.lo-A*.15&&last.c<bearOB.lo;
 let body=Math.abs(last.c-last.o),avgBody=cs.slice(-20).reduce((z,x)=>z+Math.abs(x.c-x.o),0)/Math.min(20,cs.length),displacement=body>avgBody*1.55;
 return{bias,structure,lastH,lastL,prevH,prevL,bosUp,bosDn,chochUp,chochDn,sweepLow,sweepHigh,fvgUp,fvgDn,fvgZone,rangeH,rangeL,mid,discount,A,bullOB,bearOB,bullObTouch,bearObTouch,displacement}
}
function localAnalysis(cs,mtfBias=0){
 if(cs.length<60)return null;
 let n=cs.length,last=cs[n-1],pa=paSnapshot(cs);if(!pa)return null;
 let long=0,short=0,reasons=[];
 if(pa.bias>0){long+=3;reasons.push('Yapı HH/HL')}else if(pa.bias<0){short+=3;reasons.push('Yapı LH/LL')}else reasons.push('Yapı RANGE');
 if(pa.bosUp){long+=3;reasons.push('BOS↑')}if(pa.bosDn){short+=3;reasons.push('BOS↓')}
 if(pa.chochUp){long+=2;reasons.push('CHoCH↑')}if(pa.chochDn){short+=2;reasons.push('CHoCH↓')}
 if(pa.sweepLow){long+=3;reasons.push('Likidite sweep low')}if(pa.sweepHigh){short+=3;reasons.push('Likidite sweep high')}
 if(pa.fvgUp){long+=1;reasons.push('Bull FVG')}if(pa.fvgDn){short+=1;reasons.push('Bear FVG')}
 if(pa.bullObTouch){long+=2;reasons.push('Bull OB reaksiyon')}if(pa.bearObTouch){short+=2;reasons.push('Bear OB reaksiyon')}
 if(pa.discount){long+=1;reasons.push('Discount bölgesi')}else{short+=1;reasons.push('Premium bölgesi')}
 if(pa.displacement){if(last.c>last.o)long+=1;else short+=1;reasons.push('Displacement')}
 if(mtfBias>0){long+=Math.min(3,mtfBias);reasons.push('MTF PA +'+mtfBias)}if(mtfBias<0){short+=Math.min(3,-mtfBias);reasons.push('MTF PA '+mtfBias)}
 let diff=long-short,dir=Math.abs(diff)<3?'BEKLE':diff>0?'LONG':'SHORT',conf=Math.min(93,Math.max(50,52+Math.abs(diff)*4));if(dir==='BEKLE')conf=Math.min(64,50+Math.abs(diff)*4);
 let A=pa.A,entry=last.c,stop,tp1,tp2,tp3,rr=0;
 if(dir==='LONG'){let ob=pa.bullOB,zoneEntry=ob&&last.c-ob.hi<2*A?(ob.lo+ob.hi)/2:last.c;entry=Math.min(last.c,Math.max(zoneEntry,pa.lastL+A*.08));let structuralLow=Math.min(pa.lastL,ob?ob.lo:pa.lastL);stop=structuralLow-A*.18;if(stop>=entry)stop=entry-A*1.15;let risk=Math.max(entry-stop,A*.7);tp1=Math.max(entry+risk,pa.lastH);tp2=entry+risk*2;tp3=entry+risk*3;rr=(tp3-entry)/risk}
 else if(dir==='SHORT'){let ob=pa.bearOB,zoneEntry=ob&&ob.lo-last.c<2*A?(ob.lo+ob.hi)/2:last.c;entry=Math.max(last.c,Math.min(zoneEntry,pa.lastH-A*.08));let structuralHigh=Math.max(pa.lastH,ob?ob.hi:pa.lastH);stop=structuralHigh+A*.18;if(stop<=entry)stop=entry+A*1.15;let risk=Math.max(stop-entry,A*.7);tp1=Math.min(entry-risk,pa.lastL);tp2=entry-risk*2;tp3=entry-risk*3;rr=(entry-tp3)/risk}
 let quality=conf>=82?'A+':conf>=74?'A':conf>=65?'B':'C';
 return{dir,conf,entry,stop,tp1,tp2,tp3,rr,quality,reasons,long,short,mtfBias,...pa}
}
function paChip(text,kind='neutral'){return`<span class="paChip ${kind}">${text}</span>`}
function updateAnalysis(redraw=true){
 state.analysis=localAnalysis(state.candles,state.mtfBias);let a=state.analysis;if(!a){$('aiDir').textContent='VERİ BEKLENİYOR';$('aiChecks').innerHTML='';return}
 let col=a.dir==='LONG'?'#20b58f':a.dir==='SHORT'?'#e64f62':'#e9aa31';$('aiDir').textContent=a.dir;$('aiDir').style.color=col;$('aiConf').textContent=`%${a.conf} • ${a.quality}`;$('aEntry').textContent=a.dir==='BEKLE'?'—':fmt(a.entry);$('aSl').textContent=a.dir==='BEKLE'?'—':fmt(a.stop);$('aTp1').textContent=a.dir==='BEKLE'?'—':fmt(a.tp1);$('aRr').textContent=a.dir==='BEKLE'?'—':'1:3';
 let bos=a.bosUp?'BOS ↑':a.bosDn?'BOS ↓':'BOS —',choch=a.chochUp?'CHoCH ↑':a.chochDn?'CHoCH ↓':'CHoCH —',liq=a.sweepLow?'SWEEP LOW':a.sweepHigh?'SWEEP HIGH':'SWEEP —',fvg=a.fvgUp?'FVG ↑':a.fvgDn?'FVG ↓':'FVG —',ob=a.bullObTouch?'OB ↑':a.bearObTouch?'OB ↓':'OB —';
 $('aiReason').textContent='PA: Yapı + BOS/CHoCH + Likidite + FVG + Order Block + Premium/Discount + MTF';
 $('aiChecks').innerHTML=paChip('YAPI '+a.structure,a.bias>0?'long':a.bias<0?'short':'neutral')+paChip(bos,a.bosUp?'long':a.bosDn?'short':'neutral')+paChip(choch,a.chochUp?'long':a.chochDn?'short':'neutral')+paChip(liq,a.sweepLow?'long':a.sweepHigh?'short':'neutral')+paChip(fvg,a.fvgUp?'long':a.fvgDn?'short':'neutral')+paChip(ob,a.bullObTouch?'long':a.bearObTouch?'short':'neutral')+paChip(a.discount?'DISCOUNT':'PREMIUM',a.discount?'long':'short')+paChip(state.mtfText,state.mtfBias>0?'long':state.mtfBias<0?'short':'neutral');
 if(redraw)scheduleChartDraw()
}
async function runMTF(show=true){
 clearTimeout(mtfTimer);try{let frames=['5m','15m','1h','4h'];let details=await Promise.all(frames.map(async tf=>{let u=`${baseRest()}${klinePath()}?symbol=${state.symbol}&interval=${tf}&limit=180`,arr=await getJSON(u),cs=arr.map(parseKline),pa=paSnapshot(cs);return{tf,bias:pa?.bias||0,structure:pa?.structure||'RANGE'}}));let res=details.map(x=>x.bias),up=res.filter(x=>x>0).length,dn=res.filter(x=>x<0).length;state.mtfBias=res.reduce((a,b)=>a+b,0);state.mtfText=`MTF PA ${up>dn?'LONG':dn>up?'SHORT':'NÖTR'} ${up}/${details.length}`;updateAnalysis()}catch(e){state.mtfText='MTF PA bağlantı yok';updateAnalysis()}mtfTimer=setTimeout(()=>runMTF(false),30000)
}
'''
s=s[:start]+new_analysis+s[end:]

old="if(holder.axisLock==='x')state.panX+=dx;else state.panY+=dy;scheduleChartDraw()}"
new="if(holder.axisLock==='x'){state.panX+=dx;maybeLoadOlder()}else state.panY+=dy;scheduleChartDraw()}"
if old not in s: raise SystemExit('V9 pan direction anchor not found')
s=s.replace(old,new,1)

start=s.find("canvas.addEventListener('touchstart',e=>")
end=s.find("\ncanvas.addEventListener('touchend',e=>{if(e.touches.length===0)releasePanScale()",start)
if start<0 or end<0: raise SystemExit('V9 touch block anchor not found')
new_touch=r'''function candleIndexAtX(x,w){let vr=chartView(w);return vr.latest+.5-(vr.plotW+state.panX-x)/vr.spacing}
function keepPinchAnchor(anchorIndex,centerX,w){let axis=82,plotW=w-axis,baseCount=120,visible=Math.max(20,Math.min(state.candles.length,Math.round(baseCount/state.zoomX))),spacing=plotW/Math.max(1,visible),latest=state.candles.length-1;state.panX=centerX-plotW+(latest-anchorIndex+.5)*spacing}
canvas.addEventListener('touchstart',e=>{e.preventDefault();let r=canvas.getBoundingClientRect();if(e.touches.length===2){releasePanScale();let a=e.touches[0],b=e.touches[1],cx=(a.clientX+b.clientX)/2-r.left;pinchStart={dist:Math.hypot(a.clientX-b.clientX,a.clientY-b.clientY),sx:state.zoomX,anchorIndex:candleIndexAtX(cx,r.width),cx};touchDrag=null}else if(e.touches.length===1){let t=e.touches[0],x=t.clientX-r.left,y=t.clientY-r.top;touchDrag={x,y,priceAxis:x>r.width-88,timeAxis:y>r.height-38};pinchStart=null}},{passive:false});
canvas.addEventListener('touchmove',e=>{e.preventDefault();let r=canvas.getBoundingClientRect();if(e.touches.length===2){let a=e.touches[0],b=e.touches[1],cx=(a.clientX+b.clientX)/2-r.left,d=Math.hypot(a.clientX-b.clientX,a.clientY-b.clientY);if(!pinchStart)pinchStart={dist:d,sx:state.zoomX,anchorIndex:candleIndexAtX(cx,r.width),cx};let f=d/Math.max(20,pinchStart.dist);state.zoomX=Math.max(.45,Math.min(7,pinchStart.sx*f));keepPinchAnchor(pinchStart.anchorIndex,cx,r.width);maybeLoadOlder();scheduleChartDraw()}else if(e.touches.length===1&&touchDrag){let t=e.touches[0];panChartPoint(t.clientX-r.left,t.clientY-r.top,touchDrag)}},{passive:false});
canvas.addEventListener('touchend',e=>{if(e.touches.length===0){touchDrag=null;pinchStart=null;releasePanScale()}else if(e.touches.length===1){let r=canvas.getBoundingClientRect(),t=e.touches[0];touchDrag={x:t.clientX-r.left,y:t.clientY-r.top,priceAxis:false,timeAxis:false,totalX:0,totalY:0};pinchStart=null}},{passive:false});
canvas.addEventListener('touchcancel',()=>{touchDrag=null;pinchStart=null;releasePanScale()},{passive:false});'''
s=s[:start]+new_touch+s[end:]
s=s.replace("\ncanvas.addEventListener('touchend',e=>{if(e.touches.length===0)releasePanScale()},{passive:false});\ncanvas.addEventListener('touchcancel',()=>releasePanScale(),{passive:false});",'',1)

old="$('analyzeBtn').onclick=()=>{let a=state.analysis;if(!a)return;let s=a.dir==='BEKLE'?`Şu anda net setup yok. LONG puan ${a.long}, SHORT puan ${a.short}. RSI ${a.R.toFixed(1)}. ${state.mtfText}.`:`${a.dir} setup • Güven %${a.conf} • Kalite ${a.quality}\nEntry ${fmt(a.entry)}\nStop ${fmt(a.stop)}\nTP1 ${fmt(a.tp1)}\nTP2 ${fmt(a.tp2)}\nTP3 ${fmt(a.tp3)}\nR/R 1:3\n\nTetikleyiciler: ${a.reasons.join(', ')}\n${state.mtfText}`;$('analysisText').innerText=s;$('analysisModal').classList.add('open')};"
new="$('analyzeBtn').onclick=()=>{let a=state.analysis;if(!a)return;let setup=a.dir==='BEKLE'?'NET SETUP YOK':`${a.dir} • Güven %${a.conf} • Kalite ${a.quality}`,bos=a.bosUp?'Yukarı':a.bosDn?'Aşağı':'Yok',choch=a.chochUp?'Yukarı':a.chochDn?'Aşağı':'Yok',liq=a.sweepLow?'Dip likiditesi süpürüldü':a.sweepHigh?'Tepe likiditesi süpürüldü':'Sweep yok',fvg=a.fvgUp?'Bullish':a.fvgDn?'Bearish':'Yok',ob=a.bullObTouch?'Bullish OB reaksiyonu':a.bearObTouch?'Bearish OB reaksiyonu':'Aktif reaksiyon yok';let s=`${setup}\n\nPRICE ACTION KRİTERLERİ\n• Piyasa yapısı: ${a.structure}\n• BOS: ${bos}\n• CHoCH: ${choch}\n• Likidite: ${liq}\n• FVG: ${fvg}\n• Order Block: ${ob}\n• Konum: ${a.discount?'Discount (iskonto)':'Premium'}\n• ${state.mtfText}\n• Skor: LONG ${a.long} / SHORT ${a.short}\n\n${a.dir==='BEKLE'?'Teyitler aynı yönde yeterince birleşmedi.':`Entry ${fmt(a.entry)}\nStop ${fmt(a.stop)}\nTP1 ${fmt(a.tp1)}\nTP2 ${fmt(a.tp2)}\nTP3 ${fmt(a.tp3)}\nR/R hedefi yaklaşık 1:3`}\n\nTetikleyiciler: ${a.reasons.join(' • ')}`;$('analysisText').innerText=s;$('analysisModal').classList.add('open')};"
if old not in s: raise SystemExit('V9 analyze modal anchor not found')
s=s.replace(old,new,1)

oldline="$('shareBtn').onclick=()=>toast('Sinyal paylaşımı sonraki aşamada Telegram’a bağlanacak');$('screenBtn').onclick=()=>{if(document.documentElement.requestFullscreen)document.documentElement.requestFullscreen().catch(()=>{})};"
newline="function setChartFull(on){$('app').classList.toggle('chartFull',!!on);setTimeout(fitCanvas,40)}$('fullBtn').onclick=()=>setChartFull(true);$('fullExit').onclick=()=>setChartFull(false);$('screenBtn').onclick=()=>setChartFull(!$('app').classList.contains('chartFull'));$('shareBtn').onclick=()=>{};"
if oldline not in s: raise SystemExit('V9 fullscreen js anchor not found')
s=s.replace(oldline,newline,1)

p.write_text(s,encoding='utf-8')
print('V9 pinch/history/fullscreen/price-action patch applied',p)
