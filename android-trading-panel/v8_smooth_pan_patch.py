#!/usr/bin/env python3
from pathlib import Path

p=Path(__file__).resolve().parent/"app/src/main/assets/index.html"
s=p.read_text(encoding="utf-8")

old_0="function priceScale(cs,h){let max=Math.max(...cs.map(x=>x.h)),min=Math.min(...cs.map(x=>x.l)),pad=(max-min||max*.02)*.10;max+=pad;min-=pad;let mid=(max+min)/2,range=(max-min)/state.zoomY;return{min:mid-range/2,max:mid+range/2}}\nfunction draw(){"
new_0="function priceScale(cs,h){let max=Math.max(...cs.map(x=>x.h)),min=Math.min(...cs.map(x=>x.l)),pad=(max-min||max*.02)*.10;max+=pad;min-=pad;let mid=(max+min)/2,range=(max-min)/state.zoomY;return{min:mid-range/2,max:mid+range/2}}\nlet smoothDrawFrame=0,panScaleLock=null;\nfunction scheduleChartDraw(){if(smoothDrawFrame)return;smoothDrawFrame=requestAnimationFrame(()=>{smoothDrawFrame=0;draw()})}\nfunction capturePanScale(){let r=canvas.getBoundingClientRect(),w=r.width,h=r.height;if(!w||!h||!state.candles.length)return;let vr=chartView(w),cs=state.candles.slice(vr.first,vr.last+1);if(cs.length)panScaleLock=priceScale(cs,h-34)}\nfunction releasePanScale(){panScaleLock=null;scheduleChartDraw()}\nfunction draw(){"
if old_0 not in s:
    raise SystemExit("V8 helper anchor not found")
s=s.replace(old_0,new_0,1)

old_1=" let bottom=h-34,ps=priceScale(cs,bottom),plotW=vr.plotW,py=p=>((ps.max-p)/(ps.max-ps.min))*bottom+state.panY;"
new_1=" let bottom=h-34,ps=panScaleLock||priceScale(cs,bottom),plotW=vr.plotW,py=p=>((ps.max-p)/(ps.max-ps.min))*bottom+state.panY;"
if old_1 not in s:
    raise SystemExit("V8 scale anchor not found")
s=s.replace(old_1,new_1,1)

old_2="function panChartPoint(x,y,holder){let dx=x-holder.x,dy=y-holder.y;if(holder.priceAxis)state.zoomY=Math.max(.45,Math.min(4,state.zoomY-dy*.008));else if(holder.timeAxis)state.zoomX=Math.max(.45,Math.min(7,state.zoomX+dx*.006));else{state.panX+=dx;state.panY+=dy}holder.x=x;holder.y=y;draw()}"
new_2="function panChartPoint(x,y,holder){let rawDx=x-holder.x,rawDy=y-holder.y,dx=Math.max(-52,Math.min(52,rawDx)),dy=Math.max(-52,Math.min(52,rawDy));holder.x=x;holder.y=y;if(Math.abs(rawDx)>120||Math.abs(rawDy)>120)return;if(holder.priceAxis){state.zoomY=Math.max(.45,Math.min(4,state.zoomY-dy*.008));scheduleChartDraw();return}if(holder.timeAxis){state.zoomX=Math.max(.45,Math.min(7,state.zoomX+dx*.006));scheduleChartDraw();return}holder.totalX=(holder.totalX||0)+dx;holder.totalY=(holder.totalY||0)+dy;if(!holder.axisLock&&Math.hypot(holder.totalX,holder.totalY)>=7){holder.axisLock=Math.abs(holder.totalX)>=Math.abs(holder.totalY)*1.08?'x':'y';if(holder.axisLock==='x')capturePanScale()}if(!holder.axisLock)return;if(holder.axisLock==='x')state.panX+=dx;else state.panY+=dy;scheduleChartDraw()}"
if old_2 not in s:
    raise SystemExit("V8 pan anchor not found")
s=s.replace(old_2,new_2,1)

# Extra end/cancel listeners release the temporary Y-scale lock after a horizontal drag.
insert_anchor="canvas.addEventListener('touchend',e=>{if(e.touches.length===0){touchDrag=null;pinchStart=null}else if(e.touches.length===1){let r=canvas.getBoundingClientRect(),t=e.touches[0];touchDrag={x:t.clientX-r.left,y:t.clientY-r.top,priceAxis:false,timeAxis:false};pinchStart=null}},{passive:false});"
insert_new=insert_anchor+"\ncanvas.addEventListener('touchend',e=>{if(e.touches.length===0)releasePanScale()},{passive:false});\ncanvas.addEventListener('touchcancel',()=>releasePanScale(),{passive:false});\ncanvas.addEventListener('pointerup',()=>releasePanScale());\ncanvas.addEventListener('pointercancel',()=>releasePanScale());"
if insert_anchor not in s:
    raise SystemExit("V8 touch end anchor not found")
s=s.replace(insert_anchor,insert_new,1)

old_css="#chart{position:absolute;inset:0;width:100%;height:100%;touch-action:none;cursor:grab;-webkit-user-select:none;user-select:none;overscroll-behavior:none}"
new_css="#chart{position:absolute;inset:0;width:100%;height:100%;touch-action:none;cursor:grab;-webkit-user-select:none;user-select:none;overscroll-behavior:none;-webkit-touch-callout:none}"
if old_css not in s:
    raise SystemExit("V8 css anchor not found")
s=s.replace(old_css,new_css,1)

p.write_text(s,encoding="utf-8")
print("V8 smooth pan stabilization applied",p)
