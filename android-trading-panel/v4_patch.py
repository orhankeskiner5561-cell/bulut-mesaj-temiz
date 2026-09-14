from pathlib import Path

p = Path('app/src/main/java/com/orhan/grafikpano/MainActivity.java')
s = p.read_text(encoding='utf-8')

# Natural TradingView-style vertical panning: finger and chart move in the same direction.
s = s.replace('else if(drag&&e.getPointerCount()==1){ox+=dx;oy+=dy*.006f;}',
              'else if(drag&&e.getPointerCount()==1){ox+=dx;oy-=dy*.006f;}')

# Bring the initial candle composition a little closer to the reference screen.
s = s.replace('float anchor=84f, center=chart.left+(right-chart.left)*.58f+ox;',
              'float anchor=84f, center=chart.left+(right-chart.left)*.545f+ox;')

# Use vector-drawn logo rather than the text approximation.
s = s.replace('drawText(c,"Tᐁ",chart.left+3,bottom-h*.005f,textPx(h,.040f),BLACK,true);',
              'drawTVMark(c,chart.left+4,bottom-h*.028f,h);')

# Import Path for vector icons.
if 'import android.graphics.Path;' not in s:
    s = s.replace('import android.graphics.Paint;\n', 'import android.graphics.Paint;\nimport android.graphics.Path;\n')

start = s.index('        void drawToolBar(')
end = s.index('        void drawNav(', start)
new_toolbar = r'''        void drawToolBar(Canvas c,float w,float h,float top,float navTop){
            p.setColor(BLACK);c.drawRect(0,top,w,navTop,p);stroke.setColor(Color.rgb(35,35,35));stroke.setStrokeWidth(1);c.drawLine(0,top,w,top,stroke);
            drawText(c,"SUIUSDT",w*.071f,top+h*.080f,textPx(h,.040f),WHITE,true);
            drawText(c,"1H",w*.170f,top+h*.080f,textPx(h,.040f),WHITE,true);
            float cy=top+h*.070f;
            drawPencilIcon(c,w*.305f,cy,h);
            drawIndicatorIcon(c,w*.361f,cy,h);
            drawGridIcon(c,w*.414f,cy,h);
            drawWaveIcon(c,w*.469f,cy,h);
            drawPlusIcon(c,w*.526f,cy,h);
            drawAlarmIcon(c,w*.583f,cy,h);
            drawCandleIcon(c,w*.641f,cy,h);
            drawRewindIcon(c,w*.696f,cy,h);
            drawLayersIcon(c,w*.753f,cy,h);
            drawDotsIcon(c,w*.809f,cy,h);
            stroke.setColor(Color.rgb(65,65,65));stroke.setStrokeWidth(Math.max(1f,h*.0015f));
            c.drawLine(w*.843f,top+h*.025f,w*.843f,navTop-h*.025f,stroke);
            drawUndoIcon(c,w*.875f,cy,h,false);
            drawUndoIcon(c,w*.932f,cy,h,true);
            drawFullscreenIcon(c,w*.985f,cy,h);
        }

        void setupStroke(float h){stroke.setColor(WHITE);stroke.setStrokeWidth(Math.max(2f,h*.004f));stroke.setStyle(Paint.Style.STROKE);stroke.setStrokeCap(Paint.Cap.ROUND);stroke.setStrokeJoin(Paint.Join.ROUND);}
        void drawPencilIcon(Canvas c,float x,float y,float h){setupStroke(h);float r=h*.024f;c.save();c.rotate(-42,x,y);c.drawRoundRect(x-r*.22f,y-r,x+r*.22f,y+r*.70f,r*.12f,r*.12f,stroke);c.drawLine(x-r*.22f,y+r*.70f,x,y+r,stroke);c.drawLine(x+r*.22f,y+r*.70f,x,y+r,stroke);c.restore();Path q=new Path();q.moveTo(x-r*.75f,y+r*.80f);q.quadTo(x-r*.10f,y+r*1.12f,x+r*.68f,y+r*.78f);c.drawPath(q,stroke);}
        void drawIndicatorIcon(Canvas c,float x,float y,float h){setupStroke(h);float r=h*.023f;c.drawLine(x-r,y+r*.55f,x-r*.35f,y,stroke);c.drawLine(x-r*.35f,y,x+r*.10f,y+r*.28f,stroke);c.drawLine(x+r*.10f,y+r*.28f,x+r*.76f,y-r*.55f,stroke);float bw=r*.22f;c.drawRect(x-r*.80f,y+r*.66f,x-r*.80f+bw,y+r*.95f,stroke);c.drawRect(x-r*.22f,y+r*.45f,x-r*.22f+bw,y+r*.95f,stroke);c.drawRect(x+r*.36f,y+r*.15f,x+r*.36f+bw,y+r*.95f,stroke);}
        void drawGridIcon(Canvas c,float x,float y,float h){setupStroke(h);float r=h*.022f;for(int i=-1;i<=1;i++)for(int j=-1;j<=1;j++)c.drawRoundRect(x+i*r*.72f-r*.22f,y+j*r*.72f-r*.22f,x+i*r*.72f+r*.22f,y+j*r*.72f+r*.22f,r*.05f,r*.05f,stroke);}
        void drawWaveIcon(Canvas c,float x,float y,float h){setupStroke(h);float r=h*.026f;Path q=new Path();q.moveTo(x-r,y);q.cubicTo(x-r*.65f,y+r*.65f,x-r*.25f,y+r*.65f,x,y);q.cubicTo(x+r*.25f,y-r*.65f,x+r*.65f,y-r*.65f,x+r,y);c.drawPath(q,stroke);}
        void drawPlusIcon(Canvas c,float x,float y,float h){setupStroke(h);float r=h*.027f;c.drawCircle(x,y,r,stroke);c.drawLine(x-r*.45f,y,x+r*.45f,y,stroke);c.drawLine(x,y-r*.45f,x,y+r*.45f,stroke);}
        void drawAlarmIcon(Canvas c,float x,float y,float h){setupStroke(h);float r=h*.025f;c.drawCircle(x,y,r*.72f,stroke);c.drawLine(x,y-r*.38f,x,y+r*.10f,stroke);c.drawLine(x,y+r*.10f,x+r*.30f,y+r*.26f,stroke);c.drawLine(x-r*.76f,y-r*.70f,x-r*.43f,y-r*.94f,stroke);c.drawLine(x+r*.76f,y-r*.70f,x+r*.43f,y-r*.94f,stroke);c.drawLine(x-r*.46f,y+r*.68f,x-r*.68f,y+r*.95f,stroke);c.drawLine(x+r*.46f,y+r*.68f,x+r*.68f,y+r*.95f,stroke);}
        void drawCandleIcon(Canvas c,float x,float y,float h){setupStroke(h);float r=h*.025f;float d=r*.55f;c.drawLine(x-d,y-r,x-d,y+r,stroke);c.drawRect(x-d-r*.16f,y-r*.40f,x-d+r*.16f,y+r*.30f,stroke);c.drawLine(x+d,y-r*.85f,x+d,y+r*.95f,stroke);c.drawRect(x+d-r*.16f,y-r*.12f,x+d+r*.16f,y+r*.52f,stroke);}
        void drawRewindIcon(Canvas c,float x,float y,float h){setupStroke(h);float r=h*.025f;Path a=new Path();a.moveTo(x-r*.90f,y);a.lineTo(x-r*.10f,y-r*.70f);a.lineTo(x-r*.10f,y+r*.70f);a.close();c.drawPath(a,stroke);Path b=new Path();b.moveTo(x-r*.15f,y);b.lineTo(x+r*.65f,y-r*.70f);b.lineTo(x+r*.65f,y+r*.70f);b.close();c.drawPath(b,stroke);}
        void drawLayersIcon(Canvas c,float x,float y,float h){setupStroke(h);float r=h*.027f;Path q=new Path();q.moveTo(x,y-r);q.lineTo(x+r,y-r*.18f);q.lineTo(x,y+r*.62f);q.lineTo(x-r,y-r*.18f);q.close();c.drawPath(q,stroke);c.drawLine(x-r*.78f,y+r*.30f,x,y+r*.92f,stroke);c.drawLine(x,y+r*.92f,x+r*.78f,y+r*.30f,stroke);}
        void drawDotsIcon(Canvas c,float x,float y,float h){p.setColor(WHITE);float r=Math.max(2.5f,h*.005f);c.drawCircle(x-h*.020f,y,r,p);c.drawCircle(x,y,r,p);c.drawCircle(x+h*.020f,y,r,p);}
        void drawUndoIcon(Canvas c,float x,float y,float h,boolean redo){setupStroke(h);float r=h*.026f;RectF a=new RectF(x-r*.65f,y-r*.60f,x+r*.75f,y+r*.72f);c.drawArc(a,redo?210:-30,redo?235:-235,false,stroke);float s=redo?1:-1;Path q=new Path();q.moveTo(x+s*r*.72f,y-r*.10f);q.lineTo(x+s*r*.98f,y-r*.58f);q.lineTo(x+s*r*.40f,y-r*.52f);c.drawPath(q,stroke);}
        void drawFullscreenIcon(Canvas c,float x,float y,float h){setupStroke(h);float r=h*.025f, d=r*.40f;c.drawLine(x-r,y-r,x-d,y-r,stroke);c.drawLine(x-r,y-r,x-r,y-d,stroke);c.drawLine(x+r,y-r,x+d,y-r,stroke);c.drawLine(x+r,y-r,x+r,y-d,stroke);c.drawLine(x-r,y+r,x-d,y+r,stroke);c.drawLine(x-r,y+r,x-r,y+d,stroke);c.drawLine(x+r,y+r,x+d,y+r,stroke);c.drawLine(x+r,y+r,x+r,y+d,stroke);}

'''
s = s[:start] + new_toolbar + s[end:]

start = s.index('        void drawNav(')
end = s.index('        void drawRangePopup(', start)
new_nav = r'''        void drawNav(Canvas c,float w,float h,float top){
            p.setColor(BLACK);c.drawRect(0,top,w,h,p);stroke.setColor(Color.rgb(35,35,35));stroke.setStrokeWidth(1);c.drawLine(0,top,w,top,stroke);
            float[] centers={.085f,.285f,.485f,.685f,.885f};
            String[] names={"İzleme Listesi","Grafik","Keşfet","Topluluk","Menü"};
            for(int i=0;i<5;i++){
                float cx=w*centers[i], iy=top+h*.047f, tx=cx+h*.022f;
                if(i==0)drawBookmarkIcon(c,cx-h*.018f,iy,h);
                else if(i==1)drawActiveChartIcon(c,cx-h*.018f,iy,h);
                else if(i==2)drawExploreIcon(c,cx-h*.018f,iy,h);
                else if(i==3)drawCommunityIcon(c,cx-h*.018f,iy,h);
                else drawMenuIcon(c,cx-h*.018f,iy,h);
                drawText(c,names[i],tx,top+h*.058f,textPx(h,.027f),WHITE,i==1);
            }
        }
        void drawBookmarkIcon(Canvas c,float x,float y,float h){setupStroke(h);float rw=h*.018f,rh=h*.029f;RectF r=new RectF(x-rw,y-rh,x+rw,y+rh);c.drawRect(r,stroke);Path q=new Path();q.moveTo(x-rw,y+rh);q.lineTo(x,y+rh*.55f);q.lineTo(x+rw,y+rh);c.drawPath(q,stroke);c.drawLine(x-rw*.55f,y-rh*.35f,x+rw*.55f,y-rh*.35f,stroke);}
        void drawActiveChartIcon(Canvas c,float x,float y,float h){p.setColor(Color.rgb(226,226,226));float r=h*.025f;c.drawRoundRect(x-r,y-r,x+r,y+r,h*.008f,h*.008f,p);stroke.setColor(BLACK);stroke.setStrokeWidth(Math.max(1.8f,h*.0035f));Path q=new Path();q.moveTo(x-r*.58f,y+r*.05f);q.lineTo(x-r*.18f,y-r*.28f);q.lineTo(x+r*.10f,y+r*.18f);q.lineTo(x+r*.58f,y-r*.20f);c.drawPath(q,stroke);}
        void drawExploreIcon(Canvas c,float x,float y,float h){setupStroke(h);float r=h*.025f;c.drawCircle(x,y,r,stroke);Path q=new Path();q.moveTo(x-r*.18f,y+r*.42f);q.lineTo(x+r*.42f,y-r*.48f);q.lineTo(x+r*.12f,y+r*.12f);q.close();c.drawPath(q,stroke);}
        void drawCommunityIcon(Canvas c,float x,float y,float h){setupStroke(h);float r=h*.013f;c.drawCircle(x,y-r*.42f,r,stroke);c.drawCircle(x-r*1.25f,y-r*.18f,r*.82f,stroke);c.drawCircle(x+r*1.25f,y-r*.18f,r*.82f,stroke);c.drawArc(new RectF(x-r*1.05f,y-r*.02f,x+r*1.05f,y+r*1.65f),195,150,false,stroke);c.drawArc(new RectF(x-r*2f,y+r*.05f,x-r*.20f,y+r*1.55f),195,125,false,stroke);c.drawArc(new RectF(x+r*.20f,y+r*.05f,x+r*2f,y+r*1.55f),220,125,false,stroke);}
        void drawMenuIcon(Canvas c,float x,float y,float h){setupStroke(h);float r=h*.022f;c.drawLine(x-r,y-r*.60f,x+r,y-r*.60f,stroke);c.drawLine(x-r,y,x+r,y,stroke);c.drawLine(x-r,y+r*.60f,x+r,y+r*.60f,stroke);}
        void drawTVMark(Canvas c,float x,float y,float h){p.setColor(BLACK);float s=h*.050f;Path a=new Path();a.moveTo(x,y);a.lineTo(x+s*.52f,y);a.lineTo(x+s*.52f,y+s*.18f);a.lineTo(x+s*.34f,y+s*.18f);a.lineTo(x+s*.34f,y+s*.70f);a.lineTo(x+s*.18f,y+s*.70f);a.lineTo(x+s*.18f,y+s*.18f);a.lineTo(x,y+s*.18f);a.close();c.drawPath(a,p);Path v=new Path();v.moveTo(x+s*.62f,y);v.lineTo(x+s*.82f,y+s*.46f);v.lineTo(x+s*1.03f,y);v.lineTo(x+s*1.22f,y);v.lineTo(x+s*.90f,y+s*.70f);v.lineTo(x+s*.75f,y+s*.70f);v.lineTo(x+s*.43f,y);v.close();c.drawPath(v,p);}

'''
s = s[:start] + new_nav + s[end:]

p.write_text(s, encoding='utf-8')
print('V4 patch applied')
