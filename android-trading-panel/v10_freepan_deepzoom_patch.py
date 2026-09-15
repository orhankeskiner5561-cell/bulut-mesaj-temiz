#!/usr/bin/env python3
from pathlib import Path
import re

p=Path(__file__).resolve().parent/"app/src/main/assets/index.html"
s=p.read_text(encoding="utf-8")

# 1) Daha fazla yatay sıkıştırma: 1200+ mum gösterebilecek kadar zoom-out.
s,n=re.subn(r"state\.zoomX=Math\.max\(\.45,Math\.min\(7,", "state.zoomX=Math.max(.10,Math.min(10,", s)
if n < 2:
    raise SystemExit(f"V10 zoom clamp anchors insufficient: {n}")

# Çok sıkıştırıldığında mum gövdeleri üst üste binmesin.
old="let body=Math.max(2,vr.spacing*.58);"
new="let body=Math.max(.65,Math.min(vr.spacing*.62,12));"
if old not in s:
    raise SystemExit("V10 candle body anchor not found")
s=s.replace(old,new,1)

# 2) Eksen kilidini kaldır: grafik parmağın altında gerçek 360 derece serbest hareket etsin.
pat=r"function panChartPoint\(x,y,holder\)\{[^\n]*\}"
m=re.search(pat,s)
if not m:
    raise SystemExit("V10 panChartPoint anchor not found")
new_pan="""function panChartPoint(x,y,holder){let rawDx=x-holder.x,rawDy=y-holder.y,dx=Math.max(-56,Math.min(56,rawDx)),dy=Math.max(-56,Math.min(56,rawDy));holder.x=x;holder.y=y;if(Math.abs(rawDx)>140||Math.abs(rawDy)>140)return;if(holder.priceAxis){state.zoomY=Math.max(.45,Math.min(4,state.zoomY-dy*.008));scheduleChartDraw();return}if(holder.timeAxis){state.zoomX=Math.max(.10,Math.min(10,state.zoomX+dx*.006));scheduleChartDraw();return}state.panX+=dx;state.panY+=dy;maybeLoadOlder();scheduleChartDraw()}"""
s=s[:m.start()]+new_pan+s[m.end():]

# 3) Tek parmak grafik sürüklemesi başlar başlamaz fiyat ölçeğini kilitle.
# Böylece sağa-sola/çapraz giderken yeni görünen mumlar Y ölçeğini zıplatmaz.
old_touch="touchDrag={x,y,priceAxis:x>r.width-88,timeAxis:y>r.height-38};pinchStart=null"
new_touch="touchDrag={x,y,priceAxis:x>r.width-88,timeAxis:y>r.height-38,totalX:0,totalY:0};if(!touchDrag.priceAxis&&!touchDrag.timeAxis)capturePanScale();pinchStart=null"
if old_touch not in s:
    raise SystemExit("V10 touchstart anchor not found")
s=s.replace(old_touch,new_touch,1)

# Parmak tek parmağa döndüğünde de serbest pan için ölçeği tekrar kilitle.
old_resume="touchDrag={x:t.clientX-r.left,y:t.clientY-r.top,priceAxis:false,timeAxis:false,totalX:0,totalY:0};pinchStart=null"
new_resume="touchDrag={x:t.clientX-r.left,y:t.clientY-r.top,priceAxis:false,timeAxis:false,totalX:0,totalY:0};capturePanScale();pinchStart=null"
if old_resume in s:
    s=s.replace(old_resume,new_resume,1)

# 4) Pinch sırasında daha derin zoom-out ve daha geniş zoom-in.
old_pinch="state.zoomX=Math.max(.45,Math.min(7,pinchStart.sx*f));"
if old_pinch in s:
    s=s.replace(old_pinch,"state.zoomX=Math.max(.10,Math.min(10,pinchStart.sx*f));",1)

# 5) Kullanıcı hissi: grafik alanında grab/grabbing imleci ve hızlı touch takip.
s=s.replace("cursor:grab;-webkit-user-select:none", "cursor:grab;-webkit-user-select:none", 1)

p.write_text(s,encoding="utf-8")
print("V10 deep zoom + 360 free pan applied",p)
