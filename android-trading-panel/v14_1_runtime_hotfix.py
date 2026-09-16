#!/usr/bin/env python3
from pathlib import Path

p=Path(__file__).resolve().parent/'app/src/main/assets/index.html'
s=p.read_text(encoding='utf-8')

# 1) V14 runtime bug: long/short declarations were accidentally attached to return expression.
old="let last=cs[cs.length-1],pa=paSnapshot(cs);if(!pa)return null,long=0,short=0,reasons=[],coreL=0,coreS=0;"
new="let last=cs[cs.length-1],pa=paSnapshot(cs);if(!pa)return null;let long=0,short=0,reasons=[],coreL=0,coreS=0;"
if old not in s:
    raise SystemExit('V14.1 long/short bug anchor not found')
s=s.replace(old,new,1)

# 2) Deeper two-finger compression and time-axis zoom-out.
s=s.replace("state.zoomX=Math.max(.10,Math.min(10,pinchStart.sx*f));","state.zoomX=Math.max(.04,Math.min(12,pinchStart.sx*f));")
s=s.replace("state.zoomX=Math.max(.10,Math.min(10,state.zoomX+dx*.006));","state.zoomX=Math.max(.04,Math.min(12,state.zoomX+dx*.006));")

# 3) Do not let a future analysis exception kill chart loading/live feed.
old2="updateAnalysis();draw();openWS();runMTF();setStatus(`CANLI • ${state.market} • ${state.symbol} • ${tfLabel(state.interval)}`,'live')"
new2="try{updateAnalysis()}catch(e){console.error('Analiz motoru',e);$('aiDir').textContent='ANALİZ HATASI'}draw();openWS();runMTF();setStatus(`CANLI • ${state.market} • ${state.symbol} • ${tfLabel(state.interval)}`,'live')"
if old2 in s:
    s=s.replace(old2,new2,1)

# Safety checks.
if "if(!pa)return null,long=0" in s:
    raise SystemExit('V14.1 safety: buggy declaration still present')
for marker in ["let long=0,short=0,reasons=[]","function openWS()","setInterval(()=>pollLiveKline(token),500)","id=\"aiPanel\""]:
    if marker not in s:
        raise SystemExit('V14.1 safety missing: '+marker)

p.write_text(s,encoding='utf-8')
print('V14.1 runtime + live-feed resilience + deeper pinch zoom applied',p)
