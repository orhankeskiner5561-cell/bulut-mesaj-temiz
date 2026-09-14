package com.orhan.grafikpano;

import android.app.Activity;
import android.content.Context;
import android.content.pm.ActivityInfo;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.RectF;
import android.os.Bundle;
import android.view.MotionEvent;
import android.view.ScaleGestureDetector;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

public class MainActivity extends Activity {
    @Override protected void onCreate(Bundle b) {
        super.onCreate(b);
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE);
        getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN, WindowManager.LayoutParams.FLAG_FULLSCREEN);
        getWindow().getDecorView().setSystemUiVisibility(
                View.SYSTEM_UI_FLAG_FULLSCREEN | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION |
                View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN |
                View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION | View.SYSTEM_UI_FLAG_LAYOUT_STABLE);
        setContentView(new ChartView(this));
    }

    static class Candle {
        float o,h,l,c;
        Candle(float o,float h,float l,float c){this.o=o;this.h=h;this.l=l;this.c=c;}
    }

    static class ChartView extends View {
        final Paint p=new Paint(Paint.ANTI_ALIAS_FLAG), t=new Paint(Paint.ANTI_ALIAS_FLAG), stroke=new Paint(Paint.ANTI_ALIAS_FLAG);
        final RectF chart=new RectF();
        final List<Candle> data=new ArrayList<>();
        final ScaleGestureDetector pinch;
        float sx=1f, sy=1f, ox=0f, oy=0f, lx,ly;
        boolean drag, priceDrag, timeDrag, rangePopup=false, drawPopup=false;
        final int BLACK=Color.BLACK, WHITE=Color.WHITE, GRID=Color.rgb(232,232,232), TXT=Color.rgb(165,165,165);
        final int GREEN=Color.rgb(28,158,139), RED=Color.rgb(234,77,91), ORANGE=Color.rgb(242,160,15), PURPLE=Color.rgb(164,65,185);

        ChartView(Context c){
            super(c);
            stroke.setStyle(Paint.Style.STROKE); stroke.setStrokeCap(Paint.Cap.ROUND);
            t.setTypeface(android.graphics.Typeface.create("sans-serif", android.graphics.Typeface.NORMAL));
            makeData();
            pinch=new ScaleGestureDetector(c,new ScaleGestureDetector.SimpleOnScaleGestureListener(){
                @Override public boolean onScale(ScaleGestureDetector d){
                    float f=d.getScaleFactor();
                    if(inPriceAxis(d.getFocusX(),d.getFocusY())) sy=clamp(sy*f,.65f,2.8f);
                    else { sx=clamp(sx*f,.55f,3.8f); sy=clamp(sy*(1f+(f-1f)*.35f),.65f,2.8f); }
                    invalidate(); return true;
                }
            });
        }

        void makeData(){
            float[][] a={{0,.42f},{11,1.82f},{20,1.05f},{29,1.10f},{36,2.25f},{42,3.95f},{48,3.05f},{55,2.05f},{62,3.82f},{70,3.05f},{76,3.92f},{82,1.48f},{88,1.78f},{96,1.02f},{104,.91f},{112,1.30f},{118,.79f},{130,.72f}};
            Random r=new Random(26); float prev=.42f;
            for(int i=0;i<=130;i++){
                int k=0; while(k<a.length-2 && i>a[k+1][0]) k++;
                float x0=a[k][0], x1=a[k+1][0], y0=a[k][1], y1=a[k+1][1];
                float u=(i-x0)/(x1-x0); float target=y0+(y1-y0)*u;
                float noise=(float)Math.sin(i*.78)*.06f+(r.nextFloat()-.5f)*.08f;
                float close=Math.max(.60f,target+noise); float open=i==0?close:prev;
                float wick=.05f+r.nextFloat()*.10f;
                if(i>36&&i<79) wick+=.15f+r.nextFloat()*.20f;
                float high=Math.max(open,close)+wick, low=Math.max(.55f,Math.min(open,close)-wick);
                data.add(new Candle(open,high,low,close)); prev=close;
            }
            data.set(76,new Candle(1.92f,2.74f,.60f,2.70f));
        }

        float clamp(float v,float a,float b){return Math.max(a,Math.min(b,v));}
        float f(float w,float k){return w*k;}
        float textPx(float h,float k){return Math.max(14f,h*k);}

        @Override protected void onDraw(Canvas c){
            super.onDraw(c); float w=getWidth(), h=getHeight();
            float toolTop=h*.766f, navTop=h*.910f;
            p.setColor(BLACK); p.setStyle(Paint.Style.FILL); c.drawRect(0,0,w,h,p);
            chart.set(w*.055f,2,w*.998f,toolTop);
            drawChart(c,w,h); drawToolBar(c,w,h,toolTop,navTop); drawNav(c,w,h,navTop);
            if(rangePopup) drawRangePopup(c,w,h); if(drawPopup) drawDrawPopup(c,w,h);
        }

        void drawChart(Canvas c,float w,float h){
            p.setColor(Color.rgb(250,250,250)); c.drawRect(chart,p);
            float axisW=w*.061f, right=chart.right-axisW, bottom=chart.bottom-h*.047f;
            stroke.setStrokeWidth(1f); stroke.setColor(GRID);
            for(int i=0;i<7;i++){float x=chart.left+(right-chart.left)*i/6f;c.drawLine(x,chart.top,x,bottom,stroke);}
            for(int i=0;i<6;i++){float y=chart.top+(bottom-chart.top)*i/5f;c.drawLine(chart.left,y,right,y,stroke);}

            p.setColor(Color.argb(60,230,116,135)); c.drawRect(chart.left+w*.255f,chart.top+2,right-w*.10f,chart.top+h*.014f,p);
            stroke.setColor(Color.rgb(110,110,110)); c.drawRect(chart.left+w*.255f,chart.top+2,right-w*.10f,chart.top+h*.014f,stroke);

            float vMin=2.05f-(3.45f/sy)/2f-oy, vMax=2.05f+(3.45f/sy)/2f-oy;
            float spacing=(right-chart.left)/(109f)*sx, body=Math.max(3f,spacing*.58f);
            float anchor=84f, center=chart.left+(right-chart.left)*.58f+ox;
            c.save(); c.clipRect(chart.left,chart.top,right,bottom);
            for(int i=0;i<data.size();i++){
                Candle d=data.get(i); float x=center+(i-anchor)*spacing;
                if(x<chart.left-20||x>right+20) continue;
                float yo=py(d.o,vMin,vMax,chart.top,bottom), yc=py(d.c,vMin,vMax,chart.top,bottom), yh=py(d.h,vMin,vMax,chart.top,bottom), yl=py(d.l,vMin,vMax,chart.top,bottom);
                int col=d.c>=d.o?GREEN:RED; stroke.setColor(col); stroke.setStrokeWidth(Math.max(1f,w*.0008f)); c.drawLine(x,yh,x,yl,stroke);
                p.setColor(col); float top=Math.min(yo,yc), bot=Math.max(yo,yc); if(bot-top<2)bot=top+2; c.drawRect(x-body/2,top,x+body/2,bot,p);
            }
            c.restore();

            float current=.7258f, support=.6047f, cy=py(current,vMin,vMax,chart.top,bottom), syy=py(support,vMin,vMax,chart.top,bottom);
            stroke.setColor(Color.rgb(61,155,147)); stroke.setStrokeWidth(2.2f);
            for(float x=chart.left+8;x<right;x+=13)c.drawLine(x,cy,x+4,cy,stroke);
            p.setColor(Color.argb(75,235,197,80)); RectF z=new RectF(chart.left+3,syy-5,right-w*.10f,syy+17); c.drawRect(z,p);
            stroke.setColor(Color.rgb(96,76,65)); c.drawRect(z,stroke); stroke.setColor(ORANGE); c.drawLine(chart.left,syy,right,syy,stroke);
            stroke.setColor(PURPLE); for(float x=chart.left+8;x<right-w*.10f;x+=17)c.drawLine(x,syy+10,x+9,syy+10,stroke);

            String[] prices={"3,5000","3,0000","2,5000","2,0000","1,5000","1,0000"};
            float[] vals={3.5f,3f,2.5f,2f,1.5f,1f};
            for(int i=0;i<prices.length;i++) rightText(c,prices[i],chart.right-w*.012f,py(vals[i],vMin,vMax,chart.top,bottom),textPx(h,.028f),TXT,false);
            priceBox(c,right+w*.001f,cy-h*.021f,w*.057f,h*.078f,GREEN,"0,7258","6d 12h",true,h);
            priceBox(c,right+w*.001f,syy+h*.010f,w*.057f,h*.045f,ORANGE,"0,6047","",false,h);

            String[] dates={"2024","Tem","2025","Tem","2026","Tem"}; float[] xp={.08f,.19f,.30f,.41f,.52f,.63f};
            for(int i=0;i<dates.length;i++) centerText(c,dates[i],chart.left+(right-chart.left)*xp[i],chart.bottom-h*.020f,textPx(h,.030f),TXT,false);

            // TradingView-like mark + event icon
            drawText(c,"Tᐁ",chart.left+3,bottom-h*.005f,textPx(h,.040f),BLACK,true);
            float ex=chart.left+(right-chart.left)*.72f, ey=syy+h*.055f; p.setColor(WHITE);c.drawCircle(ex,ey,h*.026f,p);stroke.setColor(PURPLE);stroke.setStrokeWidth(3);c.drawCircle(ex,ey,h*.026f,stroke);centerText(c,"⚡",ex,ey+h*.010f,textPx(h,.028f),PURPLE,false);

            // floating controls
            float bx=chart.left+w*.011f, by=chart.top+h*.020f; p.setColor(Color.rgb(247,247,247));c.drawRoundRect(bx,by,bx+w*.037f,by+h*.066f,7,7,p);stroke.setColor(Color.rgb(210,210,210));c.drawRoundRect(bx,by,bx+w*.037f,by+h*.066f,7,7,stroke);centerText(c,"⌄",bx+w*.0185f,by+h*.045f,textPx(h,.040f),BLACK,true);
            float rx=chart.right-w*.130f, ry=chart.top+h*.010f; p.setColor(Color.rgb(248,248,248));c.drawRoundRect(rx,ry,rx+w*.028f,ry+h*.061f,7,7,p);centerText(c,"↑",rx+w*.014f,ry+h*.041f,textPx(h,.040f),BLACK,false);
            p.setColor(Color.rgb(48,48,48));c.drawRoundRect(rx+w*.033f,ry,rx+w*.061f,ry+h*.061f,7,7,p);centerText(c,"▢",rx+w*.047f,ry+h*.041f,textPx(h,.039f),WHITE,false);
            p.setColor(Color.rgb(235,12,38));c.drawRoundRect(rx+w*.001f,ry+h*.044f,rx+w*.005f,ry+h*.072f,4,4,p);

            stroke.setColor(Color.rgb(224,224,224));stroke.setStrokeWidth(2);c.drawCircle(chart.right-w*.026f,chart.centerY()+h*.02f,h*.028f,stroke);c.drawCircle(chart.right-w*.026f,chart.centerY()+h*.02f,h*.017f,stroke);
        }

        float py(float price,float mn,float mx,float top,float bottom){return top+(mx-price)/(mx-mn)*(bottom-top);}

        void drawToolBar(Canvas c,float w,float h,float top,float navTop){
            p.setColor(BLACK);c.drawRect(0,top,w,navTop,p);stroke.setColor(Color.rgb(35,35,35));stroke.setStrokeWidth(1);c.drawLine(0,top,w,top,stroke);
            drawText(c,"SUIUSDT",w*.071f,top+h*.080f,textPx(h,.040f),WHITE,true); drawText(c,"1H",w*.170f,top+h*.080f,textPx(h,.040f),WHITE,true);
            String[] icons={"✎","▁▃","▦","〰","⊕","◔","║","≪","◇","•••","↶","↷","⛶"};
            float[] xs={.305f,.361f,.414f,.469f,.526f,.583f,.641f,.696f,.753f,.809f,.875f,.932f,.985f};
            for(int i=0;i<icons.length;i++) centerText(c,icons[i],w*xs[i],top+h*.078f,textPx(h,i==9?.042f:.050f),WHITE,false);
            stroke.setColor(Color.rgb(70,70,70));c.drawLine(w*.843f,top+h*.025f,w*.843f,navTop-h*.025f,stroke);
        }

        void drawNav(Canvas c,float w,float h,float top){
            p.setColor(BLACK);c.drawRect(0,top,w,h,p);stroke.setColor(Color.rgb(35,35,35));c.drawLine(0,top,w,top,stroke);
            String[] names={"İzleme Listesi","Grafik","Keşfet","Topluluk","Menü"}; String[] icons={"▤","⌁","◉","♧","☰"};
            for(int i=0;i<5;i++){float cx=w*(.06f+i*.235f); if(i==1){p.setColor(Color.rgb(225,225,225));c.drawRoundRect(cx-h*.021f,top+h*.024f,cx+h*.005f,top+h*.063f,8,8,p);centerText(c,"⌁",cx-h*.008f,top+h*.054f,textPx(h,.030f),BLACK,true);} else centerText(c,icons[i],cx-h*.008f,top+h*.056f,textPx(h,.039f),WHITE,false); drawText(c,names[i],cx+h*.020f,top+h*.056f,textPx(h,.027f),WHITE,i==1);}
        }

        void drawRangePopup(Canvas c,float w,float h){
            p.setColor(Color.argb(130,0,0,0));c.drawRect(0,0,w,h,p);float l=w*.16f, top=h*.33f, rw=w*.23f, rh=h*.48f;p.setColor(Color.rgb(31,31,31));c.drawRoundRect(l,top,l+rw,top+rh,18,18,p);drawText(c,"Aralık",l+w*.015f,top+h*.055f,textPx(h,.034f),WHITE,true);String[] a={"1 dakika","15 dakika","1 saat","4 saat","1 gün","1 hafta"};for(int i=0;i<a.length;i++){float y=top+h*(.115f+i*.058f);if(i==2){p.setColor(Color.rgb(58,58,58));c.drawRoundRect(l+w*.010f,y-h*.035f,l+rw-w*.010f,y+h*.018f,10,10,p);}drawText(c,a[i],l+w*.018f,y,textPx(h,.029f),WHITE,i==2);}}
        void drawDrawPopup(Canvas c,float w,float h){
            p.setColor(Color.argb(130,0,0,0));c.drawRect(0,0,w,h,p);float l=w*.27f, top=h*.31f, rw=w*.26f, rh=h*.50f;p.setColor(Color.rgb(31,31,31));c.drawRoundRect(l,top,l+rw,top+rh,18,18,p);drawText(c,"Çizimler",l+w*.015f,top+h*.055f,textPx(h,.034f),WHITE,true);String[] a={"Trend Çizgisi","Yatay Çizgi","Dikdörtgen","Fırça","Fibonacci","Silgi"};for(int i=0;i<a.length;i++)drawText(c,a[i],l+w*.020f,top+h*(.12f+i*.058f),textPx(h,.029f),WHITE,false);}

        void priceBox(Canvas c,float l,float top,float ww,float hh,int col,String a,String b,boolean two,float h){p.setColor(col);c.drawRoundRect(l,top,l+ww,top+hh,4,4,p);drawText(c,a,l+ww*.12f,top+hh*.43f,textPx(h,.027f),two?WHITE:BLACK,false);if(two)drawText(c,b,l+ww*.12f,top+hh*.78f,textPx(h,.021f),Color.rgb(225,245,239),false);}
        boolean inPriceAxis(float x,float y){return x>=chart.right-getWidth()*.065f&&x<=chart.right&&y<chart.bottom-getHeight()*.04f;}

        @Override public boolean onTouchEvent(MotionEvent e){
            pinch.onTouchEvent(e);float x=e.getX(),y=e.getY(),h=getHeight(),w=getWidth(),toolTop=h*.766f,navTop=h*.910f;
            if(e.getActionMasked()==MotionEvent.ACTION_DOWN){lx=x;ly=y;if(rangePopup||drawPopup){rangePopup=false;drawPopup=false;invalidate();return true;}if(y>=toolTop&&y<navTop&&x>w*.145f&&x<w*.205f){rangePopup=true;invalidate();return true;}if(y>=toolTop&&y<navTop&&x>w*.28f&&x<w*.335f){drawPopup=true;invalidate();return true;}priceDrag=inPriceAxis(x,y);timeDrag=y>chart.bottom-h*.05f&&y<chart.bottom;drag=chart.contains(x,y)&&!priceDrag&&!timeDrag;return true;}
            if(e.getActionMasked()==MotionEvent.ACTION_MOVE){float dx=x-lx,dy=y-ly;if(priceDrag)sy=clamp(sy-dy*.005f,.65f,2.8f);else if(timeDrag)sx=clamp(sx+dx*.004f,.55f,3.8f);else if(drag&&e.getPointerCount()==1){ox+=dx;oy+=dy*.006f;}lx=x;ly=y;invalidate();return true;}
            if(e.getActionMasked()==MotionEvent.ACTION_UP||e.getActionMasked()==MotionEvent.ACTION_CANCEL){drag=priceDrag=timeDrag=false;return true;}return true;
        }

        void drawText(Canvas c,String s,float x,float y,float size,int col,boolean bold){t.setColor(col);t.setTextSize(size);t.setTypeface(android.graphics.Typeface.create("sans-serif",bold?android.graphics.Typeface.BOLD:android.graphics.Typeface.NORMAL));t.setTextAlign(Paint.Align.LEFT);c.drawText(s,x,y,t);}
        void centerText(Canvas c,String s,float x,float y,float size,int col,boolean bold){t.setColor(col);t.setTextSize(size);t.setTypeface(android.graphics.Typeface.create("sans-serif",bold?android.graphics.Typeface.BOLD:android.graphics.Typeface.NORMAL));t.setTextAlign(Paint.Align.CENTER);c.drawText(s,x,y,t);t.setTextAlign(Paint.Align.LEFT);}
        void rightText(Canvas c,String s,float x,float y,float size,int col,boolean bold){t.setColor(col);t.setTextSize(size);t.setTypeface(android.graphics.Typeface.create("sans-serif",bold?android.graphics.Typeface.BOLD:android.graphics.Typeface.NORMAL));t.setTextAlign(Paint.Align.RIGHT);c.drawText(s,x,y,t);t.setTextAlign(Paint.Align.LEFT);}
    }
}
