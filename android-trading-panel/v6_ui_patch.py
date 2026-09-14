#!/usr/bin/env python3
from pathlib import Path

p=Path(__file__).resolve().parent/"app/src/main/assets/index.html"
s=p.read_text(encoding="utf-8")

old_0='#chart{position:absolute;inset:0;width:100%;height:100%}\n'
new_0='#chart{position:absolute;inset:0;width:100%;height:100%;touch-action:none;cursor:grab}\n'
if old_0 not in s:
    raise SystemExit("V6 patch anchor 0 not found")
s=s.replace(old_0,new_0,1)

old_1='#aiPanel{position:absolute;z-index:15;left:7.1%;top:14.2%;min-width:260px;max-width:41%;background:rgba(15,18,20,.88);border:1px solid rgba(255,255,255,.18);border-radius:10px;padding:8px 10px;backdrop-filter:blur(4px)}\n#aiHead{display:flex;align-items:center;gap:8px;font-size:12px;font-weight:800}\n'
new_1='#aiPanel{position:absolute;z-index:15;left:7.1%;top:14.2%;min-width:260px;max-width:41%;background:rgba(15,18,20,.90);border:1px solid rgba(255,255,255,.18);border-radius:10px;padding:8px 10px;backdrop-filter:blur(4px);touch-action:none;box-shadow:0 10px 28px rgba(0,0,0,.26)}\n#aiHead{display:flex;align-items:center;gap:8px;font-size:12px;font-weight:800;cursor:move;touch-action:none}\n'
if old_1 not in s:
    raise SystemExit("V6 patch anchor 1 not found")
s=s.replace(old_1,new_1,1)

old_2='#aiReason{margin-top:5px;font-size:9px;color:#aeb5bd;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n'
new_2='#aiReason{margin-top:5px;font-size:9px;color:#aeb5bd;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n#aiGrip{margin-left:auto;color:#aeb5bd;font-size:15px;letter-spacing:-2px;padding:1px 4px;opacity:.9}\n'
if old_2 not in s:
    raise SystemExit("V6 patch anchor 2 not found")
s=s.replace(old_2,new_2,1)

old_3='#pairBlock{height:100%;width:18.6%;padding-left:7.1%;display:flex;align-items:center;gap:20px;flex:none}\n#pairCurrent{font-weight:800;font-size:26px;white-space:nowrap;cursor:pointer}\n#tfCurrent{font-weight:800;font-size:26px;cursor:pointer}\n.tools{display:flex;align-items:center;justify-content:space-between;flex:1;height:100%;padding-right:1.4%;gap:8px}\n.tool{height:100%;min-width:42px;flex:1;display:flex;align-items:center;justify-content:center;font-size:30px;color:#fff;cursor:pointer;position:relative}\n'
new_3='#pairBlock{height:100%;width:26%;padding-left:7.1%;padding-right:1.2%;display:flex;align-items:center;gap:14px;flex:none;border-right:1px solid #242424;overflow:hidden}\n#pairCurrent{font-weight:800;font-size:24px;white-space:nowrap;cursor:ns-resize;min-width:0;max-width:72%;overflow:hidden;text-overflow:ellipsis;padding:12px 4px;touch-action:none}\n#tfCurrent{font-weight:800;font-size:23px;cursor:pointer;flex:none;padding:10px 7px;border-radius:7px}\n#tfCurrent:active,#pairCurrent:active{background:#181818}\n.tools{display:flex;align-items:center;justify-content:space-between;flex:1;height:100%;padding:0 1.4% 0 .8%;gap:4px;min-width:0}\n.tool{height:100%;min-width:46px;flex:1 1 0;display:flex;align-items:center;justify-content:center;font-size:27px;color:#fff;cursor:pointer;position:relative}\n#drawBtn{margin-left:8px;border-left:1px solid #303030}\n'
if old_3 not in s:
    raise SystemExit("V6 patch anchor 3 not found")
s=s.replace(old_3,new_3,1)

old_4='@media(max-width:900px){#pairCurrent,#tfCurrent{font-size:20px}.tool{font-size:24px}.navItem{font-size:14px}.navIcon{font-size:22px}#aiPanel{max-width:52%}}\n'
new_4='@media(max-width:900px){#pairBlock{width:29%;gap:9px}#pairCurrent{font-size:18px;max-width:70%}#tfCurrent{font-size:18px}.tool{font-size:21px;min-width:36px}.navItem{font-size:14px}.navIcon{font-size:22px}#aiPanel{max-width:58%}}\n'
if old_4 not in s:
    raise SystemExit("V6 patch anchor 4 not found")
s=s.replace(old_4,new_4,1)

old_5='    <div id="aiHead"><span id="aiBadge">HİBRİT BEYİN</span><span id="aiDir">BEKLE</span><span id="aiConf">—</span></div>\n'
new_5='    <div id="aiHead"><span id="aiBadge">HİBRİT BEYİN</span><span id="aiDir">BEKLE</span><span id="aiConf">—</span><span id="aiGrip">⋮⋮</span></div>\n'
if old_5 not in s:
    raise SystemExit("V6 patch anchor 5 not found")
s=s.replace(old_5,new_5,1)

old_6="let dpr=Math.min(devicePixelRatio||1,2), canvas=$('chart'),ctx=canvas.getContext('2d'),drag=null,pinchStart=null,resizeTimer=null,reelTimer=null,mtfTimer=null;\n"
new_6="let dpr=Math.min(devicePixelRatio||1,2), canvas=$('chart'),ctx=canvas.getContext('2d'),drag=null,pinchStart=null,touchDrag=null,resizeTimer=null,reelTimer=null,mtfTimer=null,aiDrag=null,pairSwipe=null,pairSuppressClick=false;\n"
if old_6 not in s:
    raise SystemExit("V6 patch anchor 6 not found")
s=s.replace(old_6,new_6,1)

old_7="canvas.addEventListener('pointerdown',e=>{canvas.setPointerCapture?.(e.pointerId);let r=canvas.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;drag={x,y,priceAxis:x>r.width-88,timeAxis:y>r.height-38}});\ncanvas.addEventListener('pointermove',e=>{if(!drag)return;let r=canvas.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top,dx=x-drag.x,dy=y-drag.y;if(drag.priceAxis)state.zoomY=Math.max(.45,Math.min(4,state.zoomY-dy*.008));else if(drag.timeAxis)state.zoomX=Math.max(.45,Math.min(7,state.zoomX+dx*.006));else{state.panX+=dx;state.panY+=dy}drag.x=x;drag.y=y;draw()});\n"
new_7="function panChartPoint(x,y,holder){let r=canvas.getBoundingClientRect(),dx=x-holder.x,dy=y-holder.y;if(holder.priceAxis)state.zoomY=Math.max(.45,Math.min(4,state.zoomY-dy*.008));else if(holder.timeAxis)state.zoomX=Math.max(.45,Math.min(7,state.zoomX+dx*.006));else{state.panX+=dx;state.panY+=dy}holder.x=x;holder.y=y;draw()}\ncanvas.addEventListener('pointerdown',e=>{if(e.pointerType==='touch')return;e.preventDefault();canvas.setPointerCapture?.(e.pointerId);let r=canvas.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;drag={x,y,priceAxis:x>r.width-88,timeAxis:y>r.height-38}});\ncanvas.addEventListener('pointermove',e=>{if(!drag||e.pointerType==='touch')return;let r=canvas.getBoundingClientRect();panChartPoint(e.clientX-r.left,e.clientY-r.top,drag)});\n"
if old_7 not in s:
    raise SystemExit("V6 patch anchor 7 not found")
s=s.replace(old_7,new_7,1)

old_8="canvas.addEventListener('touchstart',e=>{if(e.touches.length===2){let a=e.touches[0],b=e.touches[1];pinchStart={dist:Math.hypot(a.clientX-b.clientX,a.clientY-b.clientY),sx:state.zoomX,sy:state.zoomY}}},{passive:false});\ncanvas.addEventListener('touchmove',e=>{if(e.touches.length===2&&pinchStart){e.preventDefault();let a=e.touches[0],b=e.touches[1],d=Math.hypot(a.clientX-b.clientX,a.clientY-b.clientY),f=d/pinchStart.dist;state.zoomX=Math.max(.45,Math.min(7,pinchStart.sx*f));state.zoomY=Math.max(.45,Math.min(4,pinchStart.sy*Math.sqrt(f)));draw()}},{passive:false});\ncanvas.addEventListener('touchend',()=>pinchStart=null);\n"
new_8="canvas.addEventListener('touchstart',e=>{e.preventDefault();let r=canvas.getBoundingClientRect();if(e.touches.length===2){let a=e.touches[0],b=e.touches[1];pinchStart={dist:Math.hypot(a.clientX-b.clientX,a.clientY-b.clientY),sx:state.zoomX,sy:state.zoomY};touchDrag=null}else if(e.touches.length===1){let t=e.touches[0],x=t.clientX-r.left,y=t.clientY-r.top;touchDrag={x,y,priceAxis:x>r.width-88,timeAxis:y>r.height-38};pinchStart=null}},{passive:false});\ncanvas.addEventListener('touchmove',e=>{e.preventDefault();let r=canvas.getBoundingClientRect();if(e.touches.length===2){let a=e.touches[0],b=e.touches[1];if(!pinchStart)pinchStart={dist:Math.hypot(a.clientX-b.clientX,a.clientY-b.clientY),sx:state.zoomX,sy:state.zoomY};let d=Math.hypot(a.clientX-b.clientX,a.clientY-b.clientY),f=d/pinchStart.dist;state.zoomX=Math.max(.45,Math.min(7,pinchStart.sx*f));state.zoomY=Math.max(.45,Math.min(4,pinchStart.sy*Math.sqrt(f)));draw()}else if(e.touches.length===1&&touchDrag){let t=e.touches[0];panChartPoint(t.clientX-r.left,t.clientY-r.top,touchDrag)}},{passive:false});\ncanvas.addEventListener('touchend',e=>{if(e.touches.length===0){touchDrag=null;pinchStart=null}else if(e.touches.length===1){let r=canvas.getBoundingClientRect(),t=e.touches[0];touchDrag={x:t.clientX-r.left,y:t.clientY-r.top,priceAxis:false,timeAxis:false};pinchStart=null}},{passive:false});\n"
if old_8 not in s:
    raise SystemExit("V6 patch anchor 8 not found")
s=s.replace(old_8,new_8,1)

old_9="$('pairCurrent').onclick=()=>{$('pairReel').classList.toggle('open');if($('pairReel').classList.contains('open'))scrollReelToSymbol(false)};\n$('pairCurrent').ondblclick=()=>openSearch();\n"
new_9="function cycleSymbol(step){if(!state.symbols.length)return;let i=state.symbols.indexOf(state.symbol);if(i<0)i=0;i=(i+step+state.symbols.length)%state.symbols.length;state.symbol=state.symbols[i];$('pairCurrent').textContent=state.symbol;toast(`${state.market} • ${state.symbol}`);switchChart(true)}\n$('pairCurrent').addEventListener('click',e=>{if(pairSuppressClick){pairSuppressClick=false;return}openSearch()});\n$('pairCurrent').addEventListener('touchstart',e=>{if(e.touches.length!==1)return;let t=e.touches[0];pairSwipe={x:t.clientX,y:t.clientY};pairSuppressClick=false},{passive:true});\n$('pairCurrent').addEventListener('touchend',e=>{if(!pairSwipe)return;let t=e.changedTouches[0],dx=t.clientX-pairSwipe.x,dy=t.clientY-pairSwipe.y;pairSwipe=null;if(Math.abs(dy)>28&&Math.abs(dy)>Math.abs(dx)){pairSuppressClick=true;cycleSymbol(dy<0?1:-1);setTimeout(()=>pairSuppressClick=false,450)}},{passive:true});\n$('pairCurrent').addEventListener('wheel',e=>{e.preventDefault();cycleSymbol(e.deltaY>0?1:-1)},{passive:false});\n"
if old_9 not in s:
    raise SystemExit("V6 patch anchor 9 not found")
s=s.replace(old_9,new_9,1)

old_10='function renderSearch(){let q=$(\'searchInput\').value.trim().toUpperCase(),arr=state.symbols.filter(s=>!q||s.includes(q)).slice(0,250);$(\'searchResults\').innerHTML=arr.map(s=>{let t=state.tickerMap.get(s);return`<div class="srow" data-pick="${s}"><div><div class="sym">${s}</div><div class="muted">${state.market===\'FUTURES\'?\'USDⓈ-M Perpetual\':\'Spot\'}</div></div><div>${t?fmt(t.p):\'—\'}<div class="muted">${t?(t.c>=0?\'+\':\'\')+t.c.toFixed(2)+\'%\':\'\'}</div></div><div class="marketTag">${state.market}</div></div>`}).join(\'\');$(\'searchResults\').querySelectorAll(\'[data-pick]\').forEach(el=>el.onclick=()=>{state.symbol=el.dataset.pick;$(\'searchModal\').classList.remove(\'open\');renderReel();switchChart(true)})}\n'
new_10='function renderSearch(){let q=$(\'searchInput\').value.trim().toUpperCase(),arr=state.symbols.filter(s=>!q||s.includes(q));$(\'searchResults\').innerHTML=arr.map(s=>{let t=state.tickerMap.get(s);return`<div class="srow" data-pick="${s}"><div><div class="sym">${s}</div><div class="muted">${state.market===\'FUTURES\'?\'USDⓈ-M Perpetual\':\'Spot\'}</div></div><div>${t?fmt(t.p):\'—\'}<div class="muted">${t?(t.c>=0?\'+\':\'\')+t.c.toFixed(2)+\'%\':\'\'}</div></div><div class="marketTag">${state.market}</div></div>`}).join(\'\');$(\'searchResults\').querySelectorAll(\'[data-pick]\').forEach(el=>el.onclick=()=>{state.symbol=el.dataset.pick;$(\'searchModal\').classList.remove(\'open\');renderReel();switchChart(true)})}\n'
if old_10 not in s:
    raise SystemExit("V6 patch anchor 10 not found")
s=s.replace(old_10,new_10,1)

old_11="$('drawBtn').onclick=openSearch;\n"
new_11="$('drawBtn').onclick=()=>toast('Çizim araçları menüsü yakında burada açılacak');\n"
if old_11 not in s:
    raise SystemExit("V6 patch anchor 11 not found")
s=s.replace(old_11,new_11,1)

old_12="$('collapse').onclick=()=>{$('aiPanel').style.display=$('aiPanel').style.display==='none'?'block':'none'};\n"
new_12="function setAiVisible(show){$('aiPanel').style.display=show?'block':'none';$('collapse').textContent=show?'⌃':'⌄';try{localStorage.setItem('aiVisible',show?'1':'0')}catch(_){}}\n$('collapse').onclick=()=>setAiVisible($('aiPanel').style.display==='none');\n$('aiHead').addEventListener('pointerdown',e=>{e.preventDefault();let p=$('aiPanel'),r=p.getBoundingClientRect();aiDrag={dx:e.clientX-r.left,dy:e.clientY-r.top,id:e.pointerId};$('aiHead').setPointerCapture?.(e.pointerId)});\n$('aiHead').addEventListener('pointermove',e=>{if(!aiDrag||e.pointerId!==aiDrag.id)return;let p=$('aiPanel'),pr=p.getBoundingClientRect(),bar=$('toolBar').getBoundingClientRect(),x=e.clientX-aiDrag.dx,y=e.clientY-aiDrag.dy,maxX=window.innerWidth-pr.width-4,maxY=bar.top-pr.height-4;p.style.left=Math.max(4,Math.min(maxX,x))+'px';p.style.top=Math.max(4,Math.min(maxY,y))+'px';p.style.right='auto'});\n$('aiHead').addEventListener('pointerup',e=>{if(!aiDrag)return;let p=$('aiPanel');aiDrag=null;try{localStorage.setItem('aiPos',JSON.stringify({left:p.style.left,top:p.style.top}))}catch(_){}});\n$('aiHead').addEventListener('pointercancel',()=>aiDrag=null);\nfunction restoreAiPanel(){try{let pos=JSON.parse(localStorage.getItem('aiPos')||'null');if(pos?.left&&pos?.top){$('aiPanel').style.left=pos.left;$('aiPanel').style.top=pos.top;$('aiPanel').style.right='auto'}let v=localStorage.getItem('aiVisible');if(v==='0')setAiVisible(false);else setAiVisible(true)}catch(_){setAiVisible(true)}}\n"
if old_12 not in s:
    raise SystemExit("V6 patch anchor 12 not found")
s=s.replace(old_12,new_12,1)

old_13="async function boot(){fitCanvas();renderTf();try{await loadSymbols();await loadTickerMap();await switchChart(true);setInterval(loadTickerMap,30000)}catch(e){console.error(e);setStatus('Başlatma hatası: '+e.message,'err')}}\n"
new_13="async function boot(){fitCanvas();restoreAiPanel();renderTf();try{await loadSymbols();await loadTickerMap();await switchChart(true);setInterval(loadTickerMap,30000)}catch(e){console.error(e);setStatus('Başlatma hatası: '+e.message,'err')}}\n"
if old_13 not in s:
    raise SystemExit("V6 patch anchor 13 not found")
s=s.replace(old_13,new_13,1)

p.write_text(s,encoding="utf-8")
print("V6 UI patched 14 blocks ->",p)
