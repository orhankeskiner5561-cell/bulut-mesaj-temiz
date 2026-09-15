#!/usr/bin/env python3
from pathlib import Path
import re

p=Path(__file__).resolve().parent/"app/src/main/assets/index.html"
s=p.read_text(encoding="utf-8")

pattern=r"function visibleRange\(w\)\{.*?\nfunction priceTag\(x,y,wid,hei,col,a,b,two,W,H\)\{"
m=re.search(pattern,s,re.S)
if not m:
    raise SystemExit("V7 chart draw anchor not found")

new=r'''function chartView(w){
 let axis=82,plotW=w-axis,baseCount=120,visible=Math.max(20,Math.min(state.candles.length,Math.round(baseCount/state.zoomX))),spacing=plotW/Math.max(1,visible),latest=state.candles.length-1;
 let maxOlder=Math.max(0,(state.candles.length-visible-4)*spacing),maxFuture=plotW*.55;
 state.panX=Math.max(-maxFuture,Math.min(maxOlder,state.panX));
 let xFor=i=>plotW-(latest-i+.5)*spacing+state.panX;
 let first=Math.max(0,Math.floor(latest-visible-state.panX/spacing-4));
 let last=Math.min(latest,Math.ceil(latest+3-state.panX/spacing));
 if(last<first)last=first;
 return{first,last,visible,plotW,axis,spacing,latest,xFor,maxOlder,maxFuture}
}
function priceScale(cs,h){let max=Math.max(...cs.map(x=>x.h)),min=Math.min(...cs.map(x=>x.l)),pad=(max-min||max*.02)*.10;max+=pad;min-=pad;let mid=(max+min)/2,range=(max-min)/state.zoomY;return{min:mid-range/2,max:mid+range/2}}
function draw(){
 let r=canvas.getBoundingClientRect(),w=r.width,h=r.height;if(!w||!h)return;
 ctx.clearRect(0,0,w,h);ctx.fillStyle='#fafafa';ctx.fillRect(0,0,w,h);
 let vr=chartView(w),cs=state.candles.slice(vr.first,vr.last+1);
 if(!cs.length){ctx.fillStyle='#888';ctx.font='16px Arial';ctx.fillText('Binance verisi bekleniyor…',30,50);return}
 let bottom=h-34,ps=priceScale(cs,bottom),plotW=vr.plotW,py=p=>((ps.max-p)/(ps.max-ps.min))*bottom+state.panY;
 ctx.strokeStyle='#ededed';ctx.lineWidth=1;
 for(let i=0;i<7;i++){let x=i*plotW/6;ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,bottom);ctx.stroke()}
 for(let i=0;i<6;i++){let y=i*bottom/5;ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(plotW,y);ctx.stroke()}
 let body=Math.max(2,vr.spacing*.58);
 for(let i=vr.first;i<=vr.last;i++){
  let d=state.candles[i],x=vr.xFor(i);if(x<-vr.spacing||x>plotW+vr.spacing)continue;
  let o=py(d.o),cl=py(d.c),hi=py(d.h),lo=py(d.l),up=d.c>=d.o,col=up?'#1c9e8b':'#ea4d5b';
  ctx.strokeStyle=col;ctx.lineWidth=Math.max(1,body*.18);ctx.beginPath();ctx.moveTo(x,hi);ctx.lineTo(x,lo);ctx.stroke();ctx.fillStyle=col;ctx.fillRect(x-body/2,Math.min(o,cl),body,Math.max(1,Math.abs(cl-o)));
 }
 let live=state.candles[state.candles.length-1],cy=py(live.c);
 if(cy>=0&&cy<=bottom){ctx.setLineDash([3,7]);ctx.strokeStyle='#3d9b93';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(0,cy);ctx.lineTo(plotW,cy);ctx.stroke();ctx.setLineDash([])}
 priceTag(plotW+1,Math.max(0,Math.min(bottom-30,cy-15)),80,30,'#1c9e8b',fmt(live.c),'CANLI',true,w,h);
 ctx.fillStyle='#999';ctx.textAlign='right';ctx.font='14px Arial';for(let i=0;i<6;i++){let val=ps.max-(ps.max-ps.min)*i/5,y=i*bottom/5+5;ctx.fillText(fmt(val),w-8,y)}
 let a=state.analysis;if(a&&a.dir!=='BEKLE'){signalLine(a.entry,'ENTRY','#4688ff');signalLine(a.stop,'SL','#e74b5e');signalLine(a.tp1,'TP1','#22b58d');signalLine(a.tp2,'TP2','#22b58d');signalLine(a.tp3,'TP3','#22b58d')}
 function signalLine(v,label,col){let y=py(v);if(y<-20||y>bottom+20)return;ctx.strokeStyle=col;ctx.lineWidth=1.4;ctx.setLineDash(label==='ENTRY'?[7,4]:[4,4]);ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(plotW,y);ctx.stroke();ctx.setLineDash([]);ctx.fillStyle=col;ctx.font='bold 10px Arial';ctx.textAlign='left';ctx.fillText(label+' '+fmt(v),8,y-4)}
 ctx.save();ctx.beginPath();ctx.rect(0,bottom,plotW,34);ctx.clip();ctx.fillStyle='#999';ctx.font='13px Arial';ctx.textAlign='center';
 let labelStep=Math.max(1,Math.round(vr.visible/5)),firstLabel=Math.ceil(vr.first/labelStep)*labelStep;
 for(let i=firstLabel;i<=vr.last;i+=labelStep){let x=vr.xFor(i);if(x<20||x>plotW-20)continue;let d=new Date(state.candles[i].t),lab=state.interval==='1Y'?d.getUTCFullYear():state.interval==='1M'||state.interval==='1w'?`${String(d.getUTCMonth()+1).padStart(2,'0')}/${d.getUTCFullYear()}`:`${String(d.getUTCDate()).padStart(2,'0')}.${String(d.getUTCMonth()+1).padStart(2,'0')}`;ctx.fillText(lab,x,h-9)}
 ctx.restore();ctx.textAlign='left';ctx.fillStyle='#111';ctx.font='bold 22px Arial';ctx.fillText('Tᐁ',4,bottom-6)
}
function priceTag(x,y,wid,hei,col,a,b,two,W,H){'''

s=s[:m.start()]+new+s[m.end():]

old="function panChartPoint(x,y,holder){let r=canvas.getBoundingClientRect(),dx=x-holder.x,dy=y-holder.y;if(holder.priceAxis)state.zoomY=Math.max(.45,Math.min(4,state.zoomY-dy*.008));else if(holder.timeAxis)state.zoomX=Math.max(.45,Math.min(7,state.zoomX+dx*.006));else{state.panX+=dx;state.panY+=dy}holder.x=x;holder.y=y;draw()}"
new2="function panChartPoint(x,y,holder){let dx=x-holder.x,dy=y-holder.y;if(holder.priceAxis)state.zoomY=Math.max(.45,Math.min(4,state.zoomY-dy*.008));else if(holder.timeAxis)state.zoomX=Math.max(.45,Math.min(7,state.zoomX+dx*.006));else{state.panX+=dx;state.panY+=dy}holder.x=x;holder.y=y;draw()}"
if old not in s:
    raise SystemExit("V7 pan anchor not found")
s=s.replace(old,new2,1)

old_css="#chart{position:absolute;inset:0;width:100%;height:100%;touch-action:none;cursor:grab}"
new_css="#chart{position:absolute;inset:0;width:100%;height:100%;touch-action:none;cursor:grab;-webkit-user-select:none;user-select:none;overscroll-behavior:none}"
if old_css not in s:
    raise SystemExit("V7 css anchor not found")
s=s.replace(old_css,new_css,1)

p.write_text(s,encoding="utf-8")
print("V7 continuous horizontal chart pan applied",p)
