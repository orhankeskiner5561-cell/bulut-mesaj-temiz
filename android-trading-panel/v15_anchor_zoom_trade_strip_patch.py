#!/usr/bin/env python3
from pathlib import Path
import re

p=Path(__file__).resolve().parent/'app/src/main/assets/index.html'
s=p.read_text(encoding='utf-8')

# V15 builds only on the verified V14.1 output.
for marker in [
    'function chartView(w){',
    'function panChartPoint(x,y,holder){',
    'function capturePanScale(){',
    'function releasePanScale(){',
    "canvas.addEventListener('touchstart'",
    'function updateAnalysis(redraw=true){',
    'id="aiPanel"',
    'function fetchOlderCandles(){'
]:
    if marker not in s:
        raise SystemExit('V15 required marker missing: '+marker)

# 1) A permanent compact trade plan strip at the bottom of the chart.
css=r'''
#tradeStrip{position:absolute;z-index:14;left:7px;right:88px;bottom:38px;height:31px;display:flex;align-items:center;gap:5px;padding:4px 6px;border:1px solid rgba(25,28,31,.18);border-radius:7px;background:rgba(250,250,250,.90);backdrop-filter:blur(3px);pointer-events:none;overflow:hidden;white-space:nowrap;color:#1d2228;font-size:10px;box-shadow:0 2px 10px rgba(0,0,0,.08)}
#tradeStrip .tsDir{font-weight:900;min-width:48px;text-align:center;padding:4px 6px;border-radius:5px;background:#eceff2;color:#8c6b18}
#tradeStrip .tsCell{display:flex;align-items:center;gap:3px;min-width:0;padding:3px 5px;border-radius:5px;background:rgba(236,239,242,.82)}
#tradeStrip .tsCell b{font-size:8px;color:#6e757d}.tsVal{font-weight:800;color:#15191d;overflow:hidden;text-overflow:ellipsis}
#tradeStrip.long .tsDir{background:#dff4ee;color:#147b62}#tradeStrip.short .tsDir{background:#fde5e9;color:#bb334b}
#tradeStrip .entry b{color:#316fd0}#tradeStrip .stop b{color:#c9364d}#tradeStrip .tp b{color:#17866b}
@media(max-width:900px){#tradeStrip{right:83px;left:4px;gap:3px;padding:3px 4px;font-size:9px;height:29px}#tradeStrip .tsCell{padding:3px 4px}#tradeStrip .tsCell b{font-size:7px}#tradeStrip .tsDir{min-width:42px;padding:4px}}
'''
if '#tradeStrip{' not in s:
    if '</style>' not in s:
        raise SystemExit('V15 style end not found')
    s=s.replace('</style>',css+'</style>',1)

trade_markup='''<div id="tradeStrip"><span id="tsDir" class="tsDir">BEKLE</span><span class="tsCell entry"><b>GİRİŞ</b><span id="tsEntry" class="tsVal">—</span></span><span class="tsCell stop"><b>STOP</b><span id="tsStop" class="tsVal">—</span></span><span class="tsCell tp"><b>TP1</b><span id="tsTp1" class="tsVal">—</span></span><span class="tsCell tp"><b>TP2</b><span id="tsTp2" class="tsVal">—</span></span><span class="tsCell tp"><b>TP3</b><span id="tsTp3" class="tsVal">—</span></span></div>'''
if 'id="tradeStrip"' not in s:
    anchor='<canvas id="chart"></canvas>'
    if anchor not in s:
        raise SystemExit('V15 chart canvas markup anchor not found')
    s=s.replace(anchor,anchor+trade_markup,1)

helper=r'''function updateTradeStrip(a){
 let box=$('tradeStrip');if(!box)return;
 let dir=a?.dir||'BEKLE',active=dir==='LONG'||dir==='SHORT';box.classList.toggle('long',dir==='LONG');box.classList.toggle('short',dir==='SHORT');$('tsDir').textContent=dir;
 $('tsEntry').textContent=active?fmt(a.entry):'—';$('tsStop').textContent=active?fmt(a.stop):'—';$('tsTp1').textContent=active?fmt(a.tp1):'—';$('tsTp2').textContent=active?fmt(a.tp2):'—';$('tsTp3').textContent=active?fmt(a.tp3):'—'
}
'''
if 'function updateTradeStrip(a){' not in s:
    anchor='function updateAnalysis(redraw=true){'
    if anchor not in s:
        raise SystemExit('V15 updateAnalysis anchor not found')
    s=s.replace(anchor,helper+anchor,1)

old='state.analysis=localAnalysis(state.candles,state.mtfBias);let a=state.analysis;if(!a){'
new='state.analysis=localAnalysis(state.candles,state.mtfBias);let a=state.analysis;updateTradeStrip(a);if(!a){'
if old not in s:
    raise SystemExit('V15 analysis update insertion anchor not found')
s=s.replace(old,new,1)

# 2) Commit the temporary price-scale lock into zoomY/panY when a gesture ends.
# This keeps the final frame exactly where the fingers left it instead of snapping to a fresh autoscale.
pat=r"function releasePanScale\(\)\{[^\n]*\}"
m=re.search(pat,s)
if not m:
    raise SystemExit('V15 releasePanScale function not found')
commit=r'''function releasePanScale(){
 if(!panScaleLock){scheduleChartDraw();return}
 let locked=panScaleLock;panScaleLock=null;let r=canvas.getBoundingClientRect(),w=r.width,h=r.height;if(!w||!h||!state.candles.length){scheduleChartDraw();return}
 let vr=chartView(w),cs=state.candles.slice(vr.first,vr.last+1),bottom=h-34;if(!cs.length){scheduleChartDraw();return}
 let rawMax=Math.max(...cs.map(x=>x.h)),rawMin=Math.min(...cs.map(x=>x.l)),pad=(rawMax-rawMin||rawMax*.02)*.10;rawMax+=pad;rawMin-=pad;
 let rawMid=(rawMax+rawMin)/2,rawRange=Math.max(1e-12,rawMax-rawMin),wantMid=(locked.max+locked.min)/2,wantRange=Math.max(1e-12,locked.max-locked.min),oldPan=state.panY;
 state.zoomY=Math.max(.30,Math.min(7,rawRange/wantRange));let actualRange=rawRange/state.zoomY;state.panY=oldPan-(rawMid-wantMid)/actualRange*bottom;scheduleChartDraw()
}'''
s=s[:m.start()]+commit+s[m.end():]

# Price-axis drag must work even if a scale lock exists from a prior pan.
old="if(holder.priceAxis){state.zoomY=Math.max(.45,Math.min(4,state.zoomY-dy*.008));scheduleChartDraw();return}"
new="if(holder.priceAxis){panScaleLock=null;state.zoomY=Math.max(.30,Math.min(7,state.zoomY-dy*.008));scheduleChartDraw();return}"
if old not in s:
    raise SystemExit('V15 price-axis branch anchor not found')
s=s.replace(old,new,1)

# Allow very deep compression: enough to fit full daily crypto history on screen.
s,n=re.subn(r"Math\.max\(\.04,Math\.min\(12,", "Math.max(.02,Math.min(12,", s)
if n < 1:
    raise SystemExit('V15 deep zoom clamp anchor not found')
s=s.replace('let body=Math.max(.65,Math.min(vr.spacing*.62,12));','let body=Math.max(.38,Math.min(vr.spacing*.62,12));',1)

# 3) For 1D and higher, start with up to 1000 candles instead of only 500.
old='state.candles=await fetchCandles(state.interval,500);'
new="state.candles=await fetchCandles(state.interval,['1d','3d','1w','1M','1Y'].includes(state.interval)?1000:500);"
if old not in s:
    raise SystemExit('V15 switchChart history anchor not found')
s=s.replace(old,new,1)

# Clear any old scale lock when changing symbol/timeframe/resetting the chart.
old='if(reset){state.zoomX=1;state.panX=0;state.panY=0;state.zoomY=1}'
new='if(reset){panScaleLock=null;state.zoomX=1;state.panX=0;state.panY=0;state.zoomY=1}'
if old not in s:
    raise SystemExit('V15 reset state anchor not found')
s=s.replace(old,new,1)

# 4) When user pinches daily+ all the way out, page older Binance history in the background.
# Guarded by symbol/market/timeframe key so stale requests can never contaminate a new chart.
history_helper=r'''
let fullHistoryBusy=false,fullHistoryTimer=null;
function higherHistoryTf(){return['1d','3d','1w','1M'].includes(state.interval)}
async function loadFullHigherHistory(){
 if(fullHistoryBusy||!higherHistoryTf()||!state.candles.length||state.zoomX>.065)return;fullHistoryBusy=true;
 let key=`${state.market}|${state.symbol}|${state.interval}`;
 try{
  for(let batch=0;batch<7&&state.candles.length<6000;batch++){
   if(key!==`${state.market}|${state.symbol}|${state.interval}`)break;
   let first=state.candles[0],url=`${baseRest()}${klinePath()}?symbol=${encodeURIComponent(state.symbol)}&interval=${state.interval}&limit=1000&endTime=${first.t-1}`;
   let arr=await getJSON(url);if(key!==`${state.market}|${state.symbol}|${state.interval}`)break;
   let older=arr.map(parseKline).filter(x=>x.t<first.t);if(!older.length){state.hasOlder=false;break}
   let seen=new Set(state.candles.map(x=>x.t));older=older.filter(x=>!seen.has(x.t));if(!older.length){state.hasOlder=false;break}
   state.candles=older.concat(state.candles);if(arr.length<1000){state.hasOlder=false;break}
  }
  try{updateAnalysis(false)}catch(e){console.warn('V15 history analysis',e)}scheduleChartDraw()
 }catch(e){console.warn('Tam geçmiş yüklenemedi',e)}finally{fullHistoryBusy=false}
}
function queueFullHigherHistory(){if(!higherHistoryTf()||state.zoomX>.065)return;clearTimeout(fullHistoryTimer);fullHistoryTimer=setTimeout(loadFullHigherHistory,260)}
'''
anchor='async function fetchOlderCandles(){'
if 'function loadFullHigherHistory(){' not in s:
    if anchor not in s:
        raise SystemExit('V15 history helper insertion anchor not found')
    s=s.replace(anchor,history_helper+anchor,1)

# 5) Replace touch gesture handlers with anchored, no-jump behavior.
# Horizontal zoom is anchored to the candle under the two-finger midpoint; Y scale is locked during the gesture.
stable_helpers=r'''
function pinchChartIndexAt(x,w){let vr=chartView(w);return vr.latest+.5-(vr.plotW+state.panX-x)/Math.max(1e-9,vr.spacing)}
function setPanForPinchAnchor(idx,x,w){let axis=82,plotW=Math.max(1,w-axis),visible=Math.max(20,Math.min(state.candles.length,Math.round(120/state.zoomX))),spacing=plotW/Math.max(1,visible),latest=state.candles.length-1,target=x-plotW+(latest-idx+.5)*spacing,maxOlder=Math.max(0,(state.candles.length-visible-4)*spacing),maxFuture=plotW*.55;state.panX=Math.max(-maxFuture,Math.min(maxOlder,target))}
function beginStablePinch(e,r){let a=e.touches[0],b=e.touches[1],mx=(a.clientX+b.clientX)/2-r.left,my=(a.clientY+b.clientY)/2-r.top;capturePanScale();pinchStart={dist:Math.max(8,Math.hypot(a.clientX-b.clientX,a.clientY-b.clientY)),sx:state.zoomX,sy:state.zoomY,idx:pinchChartIndexAt(mx,r.width),midX:mx,midY:my,panY:state.panY};touchDrag=null}
'''
anchor="canvas.addEventListener('touchstart'"
if 'function beginStablePinch(e,r){' not in s:
    pos=s.find(anchor)
    if pos<0: raise SystemExit('V15 touchstart insertion point missing')
    s=s[:pos]+stable_helpers+s[pos:]

pat_start=r"canvas\.addEventListener\('touchstart',e=>\{e\.preventDefault\(\);let r=canvas\.getBoundingClientRect\(\);.*?\},\{passive:false\}\);"
m=re.search(pat_start,s)
if not m:
    raise SystemExit('V15 touchstart handler not matched')
new_start="""canvas.addEventListener('touchstart',e=>{e.preventDefault();let r=canvas.getBoundingClientRect();if(e.touches.length===2){beginStablePinch(e,r)}else if(e.touches.length===1){let t=e.touches[0],x=t.clientX-r.left,y=t.clientY-r.top;touchDrag={x,y,priceAxis:x>r.width-88,timeAxis:y>r.height-38,totalX:0,totalY:0};if(!touchDrag.priceAxis)capturePanScale();pinchStart=null}},{passive:false});"""
s=s[:m.start()]+new_start+s[m.end():]

pat_move=r"canvas\.addEventListener\('touchmove',e=>\{e\.preventDefault\(\);let r=canvas\.getBoundingClientRect\(\);.*?\},\{passive:false\}\);"
m=re.search(pat_move,s)
if not m:
    raise SystemExit('V15 touchmove handler not matched')
new_move="""canvas.addEventListener('touchmove',e=>{e.preventDefault();let r=canvas.getBoundingClientRect();if(e.touches.length===2){if(!pinchStart)beginStablePinch(e,r);let a=e.touches[0],b=e.touches[1],d=Math.max(8,Math.hypot(a.clientX-b.clientX,a.clientY-b.clientY)),f=d/pinchStart.dist,mx=(a.clientX+b.clientX)/2-r.left;state.zoomX=Math.max(.02,Math.min(12,pinchStart.sx*f));state.zoomY=pinchStart.sy;state.panY=pinchStart.panY;setPanForPinchAnchor(pinchStart.idx,mx,r.width);scheduleChartDraw()}else if(e.touches.length===1&&touchDrag){let t=e.touches[0];panChartPoint(t.clientX-r.left,t.clientY-r.top,touchDrag)}},{passive:false});"""
s=s[:m.start()]+new_move+s[m.end():]

pat_end=r"canvas\.addEventListener\('touchend',e=>\{if\(e\.touches\.length===0\).*?\},\{passive:false\}\);"
m=re.search(pat_end,s)
if not m:
    raise SystemExit('V15 primary touchend handler not matched')
new_end="""canvas.addEventListener('touchend',e=>{let wasPinch=!!pinchStart;if(e.touches.length===0){touchDrag=null;pinchStart=null;releasePanScale();if(wasPinch)queueFullHigherHistory()}else if(e.touches.length===1){let r=canvas.getBoundingClientRect(),t=e.touches[0];releasePanScale();touchDrag={x:t.clientX-r.left,y:t.clientY-r.top,priceAxis:false,timeAxis:false,totalX:0,totalY:0};capturePanScale();pinchStart=null;if(wasPinch)queueFullHigherHistory()}},{passive:false});"""
s=s[:m.start()]+new_end+s[m.end():]

# Mouse/stylus panning gets the same scale stability.
old="drag={x,y,priceAxis:x>r.width-88,timeAxis:y>r.height-38}});"
new="drag={x,y,priceAxis:x>r.width-88,timeAxis:y>r.height-38};if(!drag.priceAxis)capturePanScale()});"
if old in s:
    s=s.replace(old,new,1)

# 6) Turkish trade labels on the chart itself.
s=s.replace("signalLine(a.entry,'ENTRY','#4688ff');signalLine(a.stop,'SL','#e74b5e');","signalLine(a.entry,'GİRİŞ','#4688ff');signalLine(a.stop,'STOP','#e74b5e');",1)
s=s.replace("ctx.setLineDash(label==='ENTRY'?[7,4]:[4,4]);","ctx.setLineDash(label==='GİRİŞ'?[7,4]:[4,4]);",1)

# Final safety: all requested behavior must exist in the generated HTML.
for marker in [
    'id="tradeStrip"','id="tsEntry"','id="tsStop"','id="tsTp1"','id="tsTp2"','id="tsTp3"',
    'function beginStablePinch(e,r){','function setPanForPinchAnchor(idx,x,w){','Math.max(.02,Math.min(12',
    'function loadFullHigherHistory(){',"['1d','3d','1w','1M','1Y'].includes(state.interval)?1000:500",
    "signalLine(a.entry,'GİRİŞ'","signalLine(a.stop,'STOP'"
]:
    if marker not in s:
        raise SystemExit('V15 safety missing: '+marker)

p.write_text(s,encoding='utf-8')
print('V15 anchored no-jump gestures + full higher-TF history + trade strip applied',p)
