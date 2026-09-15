#!/usr/bin/env python3
from pathlib import Path
import re

p=Path(__file__).resolve().parent/'app/src/main/assets/index.html'
s=p.read_text(encoding='utf-8')

# V14 is deliberately layered on top of the known-good V10 + V13 terminal.
for marker in [
    'id="aiPanel"',
    'function paSnapshot(cs)',
    'function localAnalysis(cs,mtfBias=0)',
    'function updateAnalysis(redraw=true)',
    'async function runMTF(show=true)',
    'function remainingText(c)',
    'function panChartPoint(x,y,holder)'
]:
    if marker not in s:
        raise SystemExit('V14 safety: required base marker missing: '+marker)

start=s.find('function paSnapshot(cs){')
end=s.find('\nfunction chartView(w){', start)
if start < 0 or end < 0:
    raise SystemExit('V14 analysis block anchors not found')

engine=r'''function emaValue(cs,len,offset=0){
 let end=Math.max(0,cs.length-offset),start=Math.max(0,end-Math.max(len*4,len+5));if(end-start<2)return NaN;
 let k=2/(len+1),v=cs[start].c;for(let i=start+1;i<end;i++)v=cs[i].c*k+v*(1-k);return v
}
function avgVolume(cs,len=20,offset=0){let end=Math.max(0,cs.length-offset),start=Math.max(0,end-len),a=cs.slice(start,end);return a.length?a.reduce((z,x)=>z+(+x.v||0),0)/a.length:0}
function overlap(last,z,tol=0){return !!z&&last.h>=z.lo-tol&&last.l<=z.hi+tol}
function scanFvgs(cs,A){
 let out=[];for(let i=Math.max(2,cs.length-90);i<cs.length;i++){
  let a=cs[i-2],c=cs[i];
  if(a.h<c.l){let z={dir:1,lo:a.h,hi:c.l,i};let later=cs.slice(i+1),invalid=later.some(x=>x.c<z.lo),filled=later.some(x=>x.l<=z.lo);z.invalid=invalid;z.filled=filled;out.push(z)}
  if(a.l>c.h){let z={dir:-1,lo:c.h,hi:a.l,i};let later=cs.slice(i+1),invalid=later.some(x=>x.c>z.hi),filled=later.some(x=>x.h>=z.hi);z.invalid=invalid;z.filled=filled;out.push(z)}
 }
 let last=cs[cs.length-1],bull=out.filter(z=>z.dir>0&&!z.filled&&!z.invalid).pop()||null,bear=out.filter(z=>z.dir<0&&!z.filled&&!z.invalid).pop()||null;
 let brokenBull=out.filter(z=>z.dir>0&&z.invalid).pop()||null,brokenBear=out.filter(z=>z.dir<0&&z.invalid).pop()||null;
 let bullIFVG=!!brokenBear&&last.l<=brokenBear.hi+A*.12&&last.c>brokenBear.hi;
 let bearIFVG=!!brokenBull&&last.h>=brokenBull.lo-A*.12&&last.c<brokenBull.lo;
 return{bull,bear,bullIFVG,bearIFVG,all:out}
}
function findEqualLiquidity(his,lows,A,last){
 let tol=Math.max(A*.18,last.c*.0007),eqh=null,eql=null;
 for(let i=his.length-1;i>0;i--){if(Math.abs(his[i].p-his[i-1].p)<=tol){eqh=(his[i].p+his[i-1].p)/2;break}}
 for(let i=lows.length-1;i>0;i--){if(Math.abs(lows[i].p-lows[i-1].p)<=tol){eql=(lows[i].p+lows[i-1].p)/2;break}}
 return{eqh,eql,eqhSweep:eqh!=null&&last.h>eqh&&last.c<eqh,eqlSweep:eql!=null&&last.l<eql&&last.c>eql}
}
function findOrderBlocks(cs,A,his,lows){
 let n=cs.length,bull=null,bear=null,avgB=cs.slice(-30).reduce((z,x)=>z+Math.abs(x.c-x.o),0)/Math.max(1,Math.min(30,cs.length));
 for(let i=n-2;i>=Math.max(6,n-80)&&(!bull||!bear);i--){
  let x=cs[i],body=Math.abs(x.c-x.o),disp=body>avgB*1.45&&x.h-x.l>A*.75;
  if(!disp)continue;
  let pre=cs.slice(Math.max(0,i-12),i),preH=pre.length?Math.max(...pre.map(q=>q.h)):x.h,preL=pre.length?Math.min(...pre.map(q=>q.l)):x.l;
  if(!bull&&x.c>x.o&&x.c>preH-A*.08){for(let j=i-1;j>=Math.max(0,i-6);j--){let q=cs[j];if(q.c<q.o){bull={dir:1,lo:q.l,hi:Math.max(q.o,q.c),mid:(q.l+Math.max(q.o,q.c))/2,i:j,impulse:i};break}}}
  if(!bear&&x.c<x.o&&x.c<preL+A*.08){for(let j=i-1;j>=Math.max(0,i-6);j--){let q=cs[j];if(q.c>q.o){bear={dir:-1,lo:Math.min(q.o,q.c),hi:q.h,mid:(Math.min(q.o,q.c)+q.h)/2,i:j,impulse:i};break}}}
 }
 return{bull,bear}
}
function zoneBrokenAfter(cs,z,dir){if(!z)return false;let a=cs.slice(z.i+1);return dir>0?a.some(x=>x.c<z.lo):a.some(x=>x.c>z.hi)}
function paSnapshot(cs){
 if(!cs||cs.length<25)return null;
 let n=cs.length,last=cs[n-1],window=cs.slice(-160),pv=pivots(window,2,2),his=pv.hi,lows=pv.lo;
 let fallbackH=Math.max(...window.slice(0,-1).map(x=>x.h)),fallbackL=Math.min(...window.slice(0,-1).map(x=>x.l));
 let lastH=his.length?his[his.length-1].p:fallbackH,prevH=his.length>1?his[his.length-2].p:lastH,lastL=lows.length?lows[lows.length-1].p:fallbackL,prevL=lows.length>1?lows[lows.length-2].p:lastL;
 let bullStruct=his.length>1&&lows.length>1&&lastH>prevH&&lastL>prevL,bearStruct=his.length>1&&lows.length>1&&lastH<prevH&&lastL<prevL;
 let bias=bullStruct?1:bearStruct?-1:0,structure=bullStruct?'HH/HL':bearStruct?'LH/LL':'RANGE';
 let bosUp=last.c>lastH,bosDn=last.c<lastL,chochUp=bias<0&&bosUp,chochDn=bias>0&&bosDn;
 let sweepLow=last.l<lastL&&last.c>lastL,sweepHigh=last.h>lastH&&last.c<lastH;
 let A=atr(cs,14);A=Number.isFinite(A)&&A>0?A:Math.max(last.c*.006,1e-8);
 let eq=findEqualLiquidity(his,lows,A,last),fv=scanFvgs(cs,A),obs=findOrderBlocks(cs,A,his,lows),bullOB=obs.bull,bearOB=obs.bear;
 let bullObTouch=overlap(last,bullOB,A*.08)&&last.c>(bullOB?.mid??-Infinity),bearObTouch=overlap(last,bearOB,A*.08)&&last.c<(bearOB?.mid??Infinity);
 let bullObBroken=zoneBrokenAfter(cs,bullOB,1),bearObBroken=zoneBrokenAfter(cs,bearOB,-1);
 // Breaker: failed opposite OB is reclaimed and retested from the other side.
 let bullBreaker=!!bearOB&&bearObBroken&&last.l<=bearOB.hi+A*.12&&last.c>bearOB.hi;
 let bearBreaker=!!bullOB&&bullObBroken&&last.h>=bullOB.lo-A*.12&&last.c<bullOB.lo;
 // Mitigation: active OB is revisited deeply and price closes back through its midpoint.
 let bullMitigation=!!bullOB&&!bullObBroken&&last.l<=bullOB.mid&&last.c>bullOB.mid;
 let bearMitigation=!!bearOB&&!bearObBroken&&last.h>=bearOB.mid&&last.c<bearOB.mid;
 let range=cs.slice(-100),rangeH=Math.max(...range.map(x=>x.h)),rangeL=Math.min(...range.map(x=>x.l)),mid=(rangeH+rangeL)/2,discount=last.c<=mid;
 let bodies=cs.slice(-24,-1).map(x=>Math.abs(x.c-x.o)),avgBody=bodies.reduce((a,b)=>a+b,0)/Math.max(1,bodies.length),body=Math.abs(last.c-last.o),displacement=body>avgBody*1.6&&(last.h-last.l)>A*.9;
 let e50=emaValue(cs,50),e200=emaValue(cs,200),e50prev=emaValue(cs,50,5),emaBull=Number.isFinite(e50)&&Number.isFinite(e200)?e50>e200&&last.c>e50:Number.isFinite(e50)&&last.c>e50,emaBear=Number.isFinite(e50)&&Number.isFinite(e200)?e50<e200&&last.c<e50:Number.isFinite(e50)&&last.c<e50;
 let emaSlope=Number.isFinite(e50)&&Number.isFinite(e50prev)?Math.sign(e50-e50prev):0;
 let vavg=avgVolume(cs.slice(0,-1),20),vref=Math.max(+last.v||0,+(cs[n-2]?.v||0)),volRatio=vavg>0?vref/vavg:1,volumeHigh=volRatio>=1.25;
 let bullFvg=!!fv.bull&&overlap(last,fv.bull,A*.08),bearFvg=!!fv.bear&&overlap(last,fv.bear,A*.08);
 return{bias,structure,lastH,lastL,prevH,prevL,bosUp,bosDn,chochUp,chochDn,sweepLow,sweepHigh,eqh:eq.eqh,eql:eq.eql,eqhSweep:eq.eqhSweep,eqlSweep:eq.eqlSweep,bullFvg,bearFvg,bullFvgZone:fv.bull,bearFvgZone:fv.bear,bullIFVG:fv.bullIFVG,bearIFVG:fv.bearIFVG,bullOB,bearOB,bullObTouch,bearObTouch,bullBreaker,bearBreaker,bullMitigation,bearMitigation,rangeH,rangeL,mid,discount,A,displacement,e50,e200,emaBull,emaBear,emaSlope,volumeHigh,volRatio}
}
function localAnalysis(cs,mtfBias=0){
 if(cs.length<60)return null;
 let last=cs[cs.length-1],pa=paSnapshot(cs);if(!pa)return null,long=0,short=0,reasons=[],coreL=0,coreS=0;
 if(pa.bias>0){long+=3;reasons.push('HH/HL yapı')}else if(pa.bias<0){short+=3;reasons.push('LH/LL yapı')}else reasons.push('Range yapı');
 if(pa.bosUp){long+=4;coreL++;reasons.push('BOS↑')}if(pa.bosDn){short+=4;coreS++;reasons.push('BOS↓')}
 if(pa.chochUp){long+=4;coreL++;reasons.push('CHoCH↑')}if(pa.chochDn){short+=4;coreS++;reasons.push('CHoCH↓')}
 if(pa.sweepLow||pa.eqlSweep){long+=4;coreL++;reasons.push(pa.eqlSweep?'EQL sweep':'Dip likidite sweep')}if(pa.sweepHigh||pa.eqhSweep){short+=4;coreS++;reasons.push(pa.eqhSweep?'EQH sweep':'Tepe likidite sweep')}
 if(pa.bullFvg){long+=2;coreL++;reasons.push('Bull FVG retest')}if(pa.bearFvg){short+=2;coreS++;reasons.push('Bear FVG retest')}
 if(pa.bullIFVG){long+=3;coreL++;reasons.push('Bull IFVG')}if(pa.bearIFVG){short+=3;coreS++;reasons.push('Bear IFVG')}
 if(pa.bullObTouch){long+=2;coreL++;reasons.push('Bull OB temas')}if(pa.bearObTouch){short+=2;coreS++;reasons.push('Bear OB temas')}
 if(pa.bullMitigation){long+=4;coreL++;reasons.push('Bull Mitigation')}if(pa.bearMitigation){short+=4;coreS++;reasons.push('Bear Mitigation')}
 if(pa.bullBreaker){long+=5;coreL++;reasons.push('Bull Breaker Block')}if(pa.bearBreaker){short+=5;coreS++;reasons.push('Bear Breaker Block')}
 if(pa.discount)long+=1;else short+=1;
 if(pa.displacement){if(last.c>last.o){long+=2;reasons.push('Bull displacement')}else{short+=2;reasons.push('Bear displacement')}}
 // EMA and volume are filters/confirmations, never the primary trigger.
 if(pa.emaBull){long+=1;reasons.push('EMA50/200 filtre ↑')}if(pa.emaBear){short+=1;reasons.push('EMA50/200 filtre ↓')}
 if(pa.volumeHigh){if(last.c>=last.o)long+=1;else short+=1;reasons.push('Hacim x'+pa.volRatio.toFixed(1))}
 if(mtfBias>0){long+=Math.min(4,Math.abs(mtfBias));reasons.push('MTF +'+mtfBias)}if(mtfBias<0){short+=Math.min(4,Math.abs(mtfBias));reasons.push('MTF '+mtfBias)}
 let diff=long-short,dir='BEKLE';
 if(diff>=5&&coreL>=2&&mtfBias>=-1)dir='LONG';else if(diff<=-5&&coreS>=2&&mtfBias<=1)dir='SHORT';
 let strength=Math.abs(diff)+Math.max(coreL,coreS)*2,conf=Math.min(94,Math.max(50,50+strength*2));if(dir==='BEKLE')conf=Math.min(68,conf);
 let entry=last.c,stop=NaN,tp1=NaN,tp2=NaN,tp3=NaN,A=pa.A,zone=null;
 if(dir==='LONG'){
  zone=pa.bullBreaker?pa.bearOB:pa.bullMitigation||pa.bullObTouch?pa.bullOB:pa.bullFvgZone;
  if(zone)entry=Math.min(last.c,Math.max(zone.lo,(zone.lo+zone.hi)/2));
  let structural=Math.min(pa.lastL,zone?zone.lo:pa.lastL);stop=structural-A*.22;if(stop>=entry)stop=entry-A*1.15;let r=Math.max(entry-stop,A*.7);tp1=Math.max(entry+r,pa.lastH);tp2=entry+r*2;tp3=entry+r*3
 }else if(dir==='SHORT'){
  zone=pa.bearBreaker?pa.bullOB:pa.bearMitigation||pa.bearObTouch?pa.bearOB:pa.bearFvgZone;
  if(zone)entry=Math.max(last.c,Math.min(zone.hi,(zone.lo+zone.hi)/2));
  let structural=Math.max(pa.lastH,zone?zone.hi:pa.lastH);stop=structural+A*.22;if(stop<=entry)stop=entry+A*1.15;let r=Math.max(stop-entry,A*.7);tp1=Math.min(entry-r,pa.lastL);tp2=entry-r*2;tp3=entry-r*3
 }
 let quality=conf>=86?'A+':conf>=78?'A':conf>=68?'B':'C';
 return{dir,conf,entry,stop,tp1,tp2,tp3,quality,reasons,long,short,coreL,coreS,mtfBias,...pa}
}
function paChip(text,kind='neutral'){return`<span class="paChip ${kind}">${text}</span>`}
function updateAnalysis(redraw=true){
 state.analysis=localAnalysis(state.candles,state.mtfBias);let a=state.analysis;if(!a){$('aiDir').textContent='VERİ BEKLENİYOR';$('aiChecks').innerHTML='';return}
 let col=a.dir==='LONG'?'#20b58f':a.dir==='SHORT'?'#e64f62':'#e9aa31';$('aiDir').textContent=a.dir;$('aiDir').style.color=col;$('aiConf').textContent=`%${a.conf} • ${a.quality}`;$('aEntry').textContent=a.dir==='BEKLE'?'—':fmt(a.entry);$('aSl').textContent=a.dir==='BEKLE'?'—':fmt(a.stop);$('aTp1').textContent=a.dir==='BEKLE'?'—':fmt(a.tp1);$('aRr').textContent=a.dir==='BEKLE'?'—':'1:3';
 let bos=a.bosUp?'BOS ↑':a.bosDn?'BOS ↓':'BOS —',choch=a.chochUp?'CHoCH ↑':a.chochDn?'CHoCH ↓':'CHoCH —',liq=a.eqlSweep?'EQL SWEEP':a.eqhSweep?'EQH SWEEP':a.sweepLow?'SWEEP LOW':a.sweepHigh?'SWEEP HIGH':'LIQ —';
 let fvg=a.bullIFVG?'IFVG ↑':a.bearIFVG?'IFVG ↓':a.bullFvg?'FVG ↑':a.bearFvg?'FVG ↓':'FVG —';
 let ob=a.bullMitigation?'MB ↑':a.bearMitigation?'MB ↓':a.bullObTouch?'OB ↑':a.bearObTouch?'OB ↓':'OB —';
 let br=a.bullBreaker?'BREAKER ↑':a.bearBreaker?'BREAKER ↓':'BREAKER —',ema=a.emaBull?'EMA ↑':a.emaBear?'EMA ↓':'EMA —',vol=a.volumeHigh?'VOL x'+a.volRatio.toFixed(1):'VOL normal';
 $('aiReason').textContent='PA ANA BEYİN: Yapı • BOS/CHoCH • Likidite • OB/Breaker/Mitigation • FVG/IFVG • MTF | EMA+Hacim filtre';
 $('aiChecks').innerHTML=paChip('YAPI '+a.structure,a.bias>0?'long':a.bias<0?'short':'neutral')+paChip(bos,a.bosUp?'long':a.bosDn?'short':'neutral')+paChip(choch,a.chochUp?'long':a.chochDn?'short':'neutral')+paChip(liq,a.eqlSweep||a.sweepLow?'long':a.eqhSweep||a.sweepHigh?'short':'neutral')+paChip(fvg,a.bullIFVG||a.bullFvg?'long':a.bearIFVG||a.bearFvg?'short':'neutral')+paChip(ob,a.bullMitigation||a.bullObTouch?'long':a.bearMitigation||a.bearObTouch?'short':'neutral')+paChip(br,a.bullBreaker?'long':a.bearBreaker?'short':'neutral')+paChip(a.discount?'DISCOUNT':'PREMIUM',a.discount?'long':'short')+paChip(ema,a.emaBull?'long':a.emaBear?'short':'neutral')+paChip(vol,a.volumeHigh?(a.dir==='SHORT'?'short':'long'):'neutral')+paChip(state.mtfText||'MTF…',state.mtfBias>0?'long':state.mtfBias<0?'short':'neutral');
 if(redraw)scheduleChartDraw()
}
const ALL_PA_TFS=['1m','3m','5m','15m','30m','1h','2h','4h','6h','8h','12h','1d','3d','1w','1M','1Y'];
function tfWeight(tf){let a=ALL_PA_TFS.indexOf(state.interval),b=ALL_PA_TFS.indexOf(tf);if(a<0||b<0)return 1;let d=Math.abs(a-b);return d===0?3:d===1?2.25:d===2?1.6:1}
async function runMTF(show=true){
 clearTimeout(mtfTimer);if(state._mtfBusy){mtfTimer=setTimeout(()=>runMTF(false),45000);return}state._mtfBusy=true;
 try{
  let details=await Promise.all(ALL_PA_TFS.map(async tf=>{try{let cs=await fetchCandles(tf,240),pa=paSnapshot(cs);return{tf,bias:pa?.bias||0,structure:pa?.structure||'RANGE',bos:pa?.bosUp?1:pa?.bosDn?-1:0,breaker:pa?.bullBreaker?1:pa?.bearBreaker?-1:0,weight:tfWeight(tf)}}catch(e){return{tf,bias:0,structure:'—',bos:0,breaker:0,weight:tfWeight(tf),err:true}}}));
  state.mtfRows=details;let bull=0,bear=0,total=0,up=0,dn=0,ok=0;
  for(let x of details){if(x.err)continue;ok++;let raw=x.bias+x.bos*.7+x.breaker;let v=Math.max(-2,Math.min(2,raw))*x.weight;if(v>0){bull+=v;up++}else if(v<0){bear+=-v;dn++}total+=2*x.weight}
  let norm=total?Math.round((bull-bear)/total*8):0;state.mtfBias=Math.max(-4,Math.min(4,norm));state.mtfText=`MTF ${state.mtfBias>0?'LONG':state.mtfBias<0?'SHORT':'NÖTR'} ${up}/${dn} • ${ok}/${ALL_PA_TFS.length}`;updateAnalysis()
 }catch(e){state.mtfText='MTF bağlantı yok';state.mtfRows=[];state.mtfBias=0;updateAnalysis()}finally{state._mtfBusy=false;mtfTimer=setTimeout(()=>runMTF(false),60000)}
}
'''

s=s[:start]+engine+s[end:]

# Detailed analysis modal: expose exactly what produced the decision, including every timeframe.
pat=r"\$\('analyzeBtn'\)\.onclick=.*?(?=\n\$\('drawBtn'\))"
m=re.search(pat,s,re.S)
if not m:
    raise SystemExit('V14 analyze handler anchor not found')
handler=r'''$('analyzeBtn').onclick=()=>{let a=state.analysis;if(!a)return;let rows=(state.mtfRows||[]).map(x=>`${tfLabel(x.tf)}: ${x.err?'VERİ YOK':x.structure+(x.bos>0?' • BOS↑':x.bos<0?' • BOS↓':'')+(x.breaker>0?' • Breaker↑':x.breaker<0?' • Breaker↓':'')}`).join('\n');let text=`${a.dir==='BEKLE'?'NET SETUP YOK':a.dir+' • Güven %'+a.conf+' • Kalite '+a.quality}\n\nPRICE ACTION ANA KRİTERLER\n• Yapı: ${a.structure}\n• BOS: ${a.bosUp?'Yukarı':a.bosDn?'Aşağı':'Yok'}\n• CHoCH: ${a.chochUp?'Yukarı':a.chochDn?'Aşağı':'Yok'}\n• Likidite: ${a.eqlSweep?'EQL süpürüldü':a.eqhSweep?'EQH süpürüldü':a.sweepLow?'Dip sweep':a.sweepHigh?'Tepe sweep':'Aktif sweep yok'}\n• Order Block: ${a.bullObTouch?'Bull OB temas':a.bearObTouch?'Bear OB temas':'Aktif temas yok'}\n• Mitigation Block: ${a.bullMitigation?'Bullish':a.bearMitigation?'Bearish':'Yok'}\n• Breaker Block: ${a.bullBreaker?'Bullish':a.bearBreaker?'Bearish':'Yok'}\n• FVG / IFVG: ${a.bullIFVG?'Bull IFVG':a.bearIFVG?'Bear IFVG':a.bullFvg?'Bull FVG':a.bearFvg?'Bear FVG':'Aktif bölge yok'}\n• Konum: ${a.discount?'Discount':'Premium'}\n• Displacement: ${a.displacement?'VAR':'Yok'}\n\nFİLTRELER\n• EMA50/200: ${a.emaBull?'Bullish':a.emaBear?'Bearish':'Nötr'}\n• Hacim: ${a.volumeHigh?'Yüksek x'+a.volRatio.toFixed(2):'Normal x'+a.volRatio.toFixed(2)}\n• Skor: LONG ${a.long} / SHORT ${a.short}\n• Çekirdek teyit: L ${a.coreL} / S ${a.coreS}\n\nTÜM ZAMAN DİLİMLERİ\n${rows||'MTF bekleniyor'}\n\n${a.dir==='BEKLE'?'En az iki çekirdek Price Action teyidi ve yeterli skor farkı oluşmadı.':`Entry ${fmt(a.entry)}\nStop ${fmt(a.stop)}\nTP1 ${fmt(a.tp1)}\nTP2 ${fmt(a.tp2)}\nTP3 ${fmt(a.tp3)}\nHedef R/R yaklaşık 1:3`}\n\nTetikleyiciler: ${a.reasons.join(' • ')}`;$('analysisText').innerText=text;$('analysisModal').classList.add('open')};'''
s=s[:m.start()]+handler+s[m.end():]

# Safety checks: V14 must actually contain every requested concept and V13 live engine.
for marker in [
    'Breaker Block', 'Mitigation Block', 'bullIFVG', 'eqhSweep', 'emaValue(cs,50)', 'volumeHigh',
    "const ALL_PA_TFS=['1m','3m','5m','15m','30m','1h','2h','4h','6h','8h','12h','1d','3d','1w','1M','1Y']",
    'function remainingText(c)', 'setInterval(()=>pollLiveKline(token),500)'
]:
    if marker not in s:
        raise SystemExit('V14 safety after patch failed: '+marker)

p.write_text(s,encoding='utf-8')
print('V14 full Price Action + Breaker/Mitigation + all-timeframe MTF applied',p)
