package com.orhan.grafikpano;

import android.app.Activity;
import android.content.Context;
import android.content.pm.ActivityInfo;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.Path;
import android.graphics.RectF;
import android.os.Bundle;
import android.view.MotionEvent;
import android.view.ScaleGestureDetector;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Random;

public class MainActivity extends Activity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE);
        getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN, WindowManager.LayoutParams.FLAG_FULLSCREEN);
        getWindow().getDecorView().setSystemUiVisibility(
                View.SYSTEM_UI_FLAG_FULLSCREEN |
                View.SYSTEM_UI_FLAG_HIDE_NAVIGATION |
                View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY |
                View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN |
                View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION |
                View.SYSTEM_UI_FLAG_LAYOUT_STABLE
        );
        setContentView(new TradingPanelView(this));
    }

    static class Candle {
        float open, high, low, close, volume;
        Candle(float o, float h, float l, float c, float v) {
            open = o; high = h; low = l; close = c; volume = v;
        }
    }

    static class TradingPanelView extends View {
        private final Paint p = new Paint(Paint.ANTI_ALIAS_FLAG);
        private final Paint text = new Paint(Paint.ANTI_ALIAS_FLAG);
        private final RectF chart = new RectF();
        private final List<Candle> candles = new ArrayList<>();
        private final ScaleGestureDetector scaleDetector;
        private final float density;

        private float chartScaleX = 1f;
        private float chartScaleY = 1f;
        private float offsetX = 0f;
        private float offsetY = 0f;
        private float lastX, lastY;
        private boolean dragging;
        private boolean axisDrag;
        private boolean timeScaleDrag;
        private float basePrice = 196.24f;

        private final int bg = Color.rgb(10, 16, 25);
        private final int panel = Color.rgb(15, 23, 34);
        private final int panel2 = Color.rgb(18, 28, 41);
        private final int grid = Color.rgb(35, 48, 64);
        private final int border = Color.rgb(49, 64, 82);
        private final int white = Color.rgb(228, 234, 242);
        private final int muted = Color.rgb(135, 149, 166);
        private final int teal = Color.rgb(18, 184, 166);
        private final int red = Color.rgb(239, 83, 80);
        private final int blue = Color.rgb(41, 121, 255);

        TradingPanelView(Context context) {
            super(context);
            density = getResources().getDisplayMetrics().density;
            text.setTypeface(android.graphics.Typeface.create("sans", android.graphics.Typeface.NORMAL));
            generateCandles();
            scaleDetector = new ScaleGestureDetector(context, new ScaleGestureDetector.SimpleOnScaleGestureListener() {
                @Override
                public boolean onScale(ScaleGestureDetector detector) {
                    if (!chart.contains(detector.getFocusX(), detector.getFocusY())) return false;
                    float f = detector.getScaleFactor();
                    chartScaleX = clamp(chartScaleX * f, 0.45f, 5.2f);
                    chartScaleY = clamp(chartScaleY * f, 0.45f, 5.2f);
                    invalidate();
                    return true;
                }
            });
            setBackgroundColor(bg);
        }

        private float dp(float v) { return v * density; }
        private float clamp(float v, float min, float max) { return Math.max(min, Math.min(max, v)); }

        private void generateCandles() {
            Random r = new Random(55);
            float price = 172f;
            for (int i = 0; i < 180; i++) {
                float drift = (i < 55 ? -0.10f : i < 115 ? 0.24f : -0.02f);
                float o = price;
                float c = o + drift + (r.nextFloat() - 0.5f) * 3.4f;
                float h = Math.max(o, c) + r.nextFloat() * 2.2f;
                float l = Math.min(o, c) - r.nextFloat() * 2.2f;
                float v = 0.25f + r.nextFloat() * 0.75f;
                candles.add(new Candle(o, h, l, c, v));
                price = c;
            }
            basePrice = candles.get(candles.size() - 1).close;
        }

        @Override
        protected void onDraw(Canvas c) {
            super.onDraw(c);
            float w = getWidth();
            float h = getHeight();
            float top1 = dp(48);
            float top2 = dp(42);
            float leftW = dp(48);
            float rightW = Math.min(dp(250), Math.max(dp(185), w * 0.255f));
            float bottomH = dp(46);

            p.setStyle(Paint.Style.FILL);
            p.setColor(bg);
            c.drawRect(0, 0, w, h, p);

            drawTopHeader(c, w, top1);
            drawChartToolbar(c, w, top1, top2, rightW);
            drawLeftToolbar(c, leftW, top1 + top2, h - bottomH);
            drawRightPanel(c, w - rightW, top1, rightW, h - top1);
            drawBottomPanel(c, leftW, h - bottomH, w - rightW - leftW, bottomH);

            chart.set(leftW, top1 + top2, w - rightW, h - bottomH);
            drawChart(c);
        }

        private void drawTopHeader(Canvas c, float w, float hh) {
            p.setColor(panel); p.setStyle(Paint.Style.FILL); c.drawRect(0, 0, w, hh, p);
            p.setColor(border); c.drawRect(0, hh - 1, w, hh, p);

            drawText(c, "TV", dp(18), hh * 0.63f, dp(22), white, true);
            drawText(c, "Grafik Pano", dp(55), hh * 0.63f, dp(16), white, true);

            float searchX = Math.max(dp(190), w * 0.28f);
            float searchW = Math.min(dp(360), w * 0.34f);
            p.setColor(panel2); c.drawRoundRect(searchX, dp(8), searchX + searchW, hh - dp(8), dp(8), dp(8), p);
            p.setStyle(Paint.Style.STROKE); p.setStrokeWidth(dp(1)); p.setColor(border);
            c.drawRoundRect(searchX, dp(8), searchX + searchW, hh - dp(8), dp(8), dp(8), p);
            p.setStyle(Paint.Style.FILL);
            drawText(c, "⌕  Sembol, gösterge veya fikir ara…", searchX + dp(14), hh * 0.62f, dp(13), muted, false);

            String[] menus = {"İzleme", "Grafikler", "Tarayıcı", "Menü"};
            float x = searchX + searchW + dp(24);
            for (String m : menus) {
                if (x > w - dp(58)) break;
                drawText(c, m, x, hh * 0.62f, dp(12), white, false);
                x += dp(74);
            }
        }

        private void drawChartToolbar(Canvas c, float w, float y, float hh, float rightW) {
            p.setColor(panel2); p.setStyle(Paint.Style.FILL); c.drawRect(0, y, w - rightW, y + hh, p);
            p.setColor(border); c.drawRect(0, y + hh - 1, w - rightW, y + hh, p);
            String[] items = {"BTCUSDT", "15m", "1s", "5s", "1d", "Göstergeler", "Alarm", "↶", "↷"};
            float[] widths = {92, 54, 42, 42, 42, 112, 76, 42, 42};
            float x = dp(10);
            for (int i = 0; i < items.length; i++) {
                float ww = dp(widths[i]);
                if (x + ww > w - rightW - dp(8)) break;
                p.setColor(i == 0 ? Color.rgb(23, 40, 56) : panel2);
                c.drawRoundRect(x, y + dp(6), x + ww - dp(4), y + hh - dp(6), dp(6), dp(6), p);
                drawText(c, items[i], x + dp(10), y + hh * 0.62f, dp(12), i == 1 ? blue : white, i == 0);
                x += ww;
            }
        }

        private void drawLeftToolbar(Canvas c, float ww, float top, float bottom) {
            p.setColor(panel); p.setStyle(Paint.Style.FILL); c.drawRect(0, top, ww, bottom, p);
            p.setColor(border); c.drawRect(ww - 1, top, ww, bottom, p);
            String[] tools = {"+", "╱", "⌁", "T", "□", "↗", "◉", "⌖", "◇", "⌫"};
            float y = top + dp(30);
            for (String tool : tools) {
                p.setColor(Color.rgb(21, 31, 45));
                c.drawCircle(ww / 2f, y - dp(5), dp(17), p);
                drawTextCentered(c, tool, ww / 2f, y, dp(17), white, false);
                y += dp(42);
                if (y > bottom - dp(10)) break;
            }
        }

        private void drawRightPanel(Canvas c, float left, float top, float ww, float hh) {
            p.setColor(panel); p.setStyle(Paint.Style.FILL); c.drawRect(left, top, left + ww, top + hh, p);
            p.setColor(border); c.drawRect(left, top, left + 1, top + hh, p);
            drawText(c, "İzleme Listesi", left + dp(14), top + dp(29), dp(14), white, true);
            drawText(c, "+   ⋯", left + ww - dp(58), top + dp(29), dp(17), muted, false);

            float y = top + dp(58);
            drawText(c, "Sembol", left + dp(14), y, dp(11), muted, false);
            drawText(c, "Son", left + ww * .55f, y, dp(11), muted, false);
            drawText(c, "Değ%", left + ww * .79f, y, dp(11), muted, false);
            y += dp(18);
            p.setColor(border); c.drawRect(left + dp(10), y, left + ww - dp(10), y + 1, p);
            y += dp(25);

            String[] syms = {"BTCUSDT", "ETHUSDT", "XRPUSDT", "SOLUSDT", "BNBUSDT", "AAPL", "NVDA", "EURUSD"};
            String[] vals = {"61.842", "2.348", "0,574", "136,22", "586,8", "196,24", "118,76", "1,0942"};
            float[] chg = {1.26f, 1.73f, -0.82f, 0.65f, 0.41f, 0.70f, 2.01f, -0.10f};
            for (int i = 0; i < syms.length; i++) {
                if (i == 0) {
                    p.setColor(Color.rgb(24, 37, 51));
                    c.drawRoundRect(left + dp(7), y - dp(18), left + ww - dp(7), y + dp(12), dp(5), dp(5), p);
                }
                drawText(c, syms[i], left + dp(14), y, dp(11.5f), white, i == 0);
                drawText(c, vals[i], left + ww * .55f, y, dp(11.5f), white, false);
                int col = chg[i] >= 0 ? teal : red;
                drawText(c, String.format(Locale.US, "%+.2f%%", chg[i]), left + ww * .79f, y, dp(11.5f), col, false);
                y += dp(34);
            }

            y += dp(8);
            p.setColor(border); c.drawRect(left + dp(10), y, left + ww - dp(10), y + 1, p);
            y += dp(31);
            drawText(c, "BTCUSDT", left + dp(14), y, dp(15), white, true);
            y += dp(28);
            drawText(c, "61.842,30 USDT", left + dp(14), y, dp(24), white, true);
            drawText(c, "+1,26%", left + ww - dp(78), y, dp(13), teal, true);
            y += dp(29);
            drawText(c, "Piyasa açık  •  Canlı görünüm", left + dp(14), y, dp(11), teal, false);
            y += dp(34);
            drawText(c, "Anahtar istatistikler", left + dp(14), y, dp(12), white, true);
            y += dp(26);
            drawText(c, "24s Hacim", left + dp(14), y, dp(11), muted, false);
            drawText(c, "31,8B", left + ww - dp(54), y, dp(11), white, false);
            y += dp(23);
            drawText(c, "24s Yüksek", left + dp(14), y, dp(11), muted, false);
            drawText(c, "62.905", left + ww - dp(65), y, dp(11), white, false);
        }

        private void drawBottomPanel(Canvas c, float left, float top, float ww, float hh) {
            p.setColor(panel); p.setStyle(Paint.Style.FILL); c.drawRect(left, top, left + ww, top + hh, p);
            p.setColor(border); c.drawRect(left, top, left + ww, top + 1, p);
            String[] tabs = {"Takipçi", "Pine Editör", "Strateji Testi", "İşlem Paneli"};
            float x = left + dp(12);
            for (String tab : tabs) {
                drawText(c, tab, x, top + hh * .62f, dp(11.5f), white, false);
                x += dp(96);
            }
            drawText(c, "Grafik: sürükle  •  İki parmak: zoom  •  Sağ ölçek: dikey zoom", left + ww - dp(440), top + hh * .62f, dp(10.5f), muted, false);
        }

        private void drawChart(Canvas c) {
            p.setStyle(Paint.Style.FILL); p.setColor(Color.rgb(9, 16, 25)); c.drawRect(chart, p);
            drawGrid(c);

            c.save();
            c.clipRect(chart.left, chart.top, chart.right, chart.bottom);

            float spacing = dp(8.2f) * chartScaleX;
            float midIndex = candles.size() - 42f;
            float bodyW = Math.max(dp(2), dp(4.5f) * chartScaleX);
            float pixelsPerDollar = dp(5.0f) * chartScaleY;
            float centerPrice = basePrice;

            float volBase = chart.bottom - dp(22);
            float volH = dp(55);
            for (int i = 0; i < candles.size(); i++) {
                Candle cd = candles.get(i);
                float x = chart.centerX() + (i - midIndex) * spacing + offsetX;
                if (x < chart.left - dp(15) || x > chart.right + dp(15)) continue;
                float yo = chart.centerY() - (cd.open - centerPrice) * pixelsPerDollar + offsetY;
                float yc = chart.centerY() - (cd.close - centerPrice) * pixelsPerDollar + offsetY;
                float yh = chart.centerY() - (cd.high - centerPrice) * pixelsPerDollar + offsetY;
                float yl = chart.centerY() - (cd.low - centerPrice) * pixelsPerDollar + offsetY;
                int col = cd.close >= cd.open ? teal : red;
                p.setColor(col); p.setStrokeWidth(Math.max(dp(1), bodyW * .18f));
                c.drawLine(x, yh, x, yl, p);
                float t = Math.min(yo, yc), b = Math.max(yo, yc);
                if (b - t < dp(1.5f)) b = t + dp(1.5f);
                c.drawRect(x - bodyW / 2f, t, x + bodyW / 2f, b, p);

                p.setColor(Color.argb(95, Color.red(col), Color.green(col), Color.blue(col)));
                c.drawRect(x - bodyW / 2f, volBase - cd.volume * volH, x + bodyW / 2f, volBase, p);
            }

            float currentY = chart.centerY() + offsetY;
            p.setColor(teal); p.setStrokeWidth(dp(1));
            Path dash = new Path();
            float sx = chart.left;
            while (sx < chart.right) {
                dash.moveTo(sx, currentY); dash.lineTo(Math.min(sx + dp(6), chart.right), currentY); sx += dp(11);
            }
            c.drawPath(dash, p);
            c.restore();

            drawChartLabels(c, pixelsPerDollar, centerPrice);
            drawChartTitle(c);
        }

        private void drawGrid(Canvas c) {
            p.setStyle(Paint.Style.STROKE); p.setStrokeWidth(dp(.7f)); p.setColor(grid);
            int vLines = 10;
            int hLines = 8;
            for (int i = 1; i < vLines; i++) {
                float x = chart.left + chart.width() * i / vLines;
                c.drawLine(x, chart.top, x, chart.bottom, p);
            }
            for (int i = 1; i < hLines; i++) {
                float y = chart.top + chart.height() * i / hLines;
                c.drawLine(chart.left, y, chart.right, y, p);
            }
            p.setStyle(Paint.Style.FILL);
        }

        private void drawChartLabels(Canvas c, float pixelsPerDollar, float centerPrice) {
            for (int i = 1; i < 8; i++) {
                float y = chart.top + chart.height() * i / 8f;
                float price = centerPrice + (chart.centerY() + offsetY - y) / pixelsPerDollar;
                drawText(c, String.format(Locale.US, "%.2f", price), chart.right - dp(47), y - dp(4), dp(9.5f), muted, false);
            }
            String[] times = {"09:30", "10:15", "11:00", "11:45", "12:30", "13:15", "14:00"};
            for (int i = 0; i < times.length; i++) {
                float x = chart.left + chart.width() * (i + 0.5f) / times.length;
                drawTextCentered(c, times[i], x, chart.bottom - dp(7), dp(9.5f), muted, false);
            }
            float y = chart.centerY() + offsetY;
            p.setColor(teal);
            c.drawRoundRect(chart.right - dp(57), y - dp(12), chart.right - dp(4), y + dp(8), dp(4), dp(4), p);
            drawTextCentered(c, String.format(Locale.US, "%.2f", basePrice), chart.right - dp(30), y + dp(3), dp(9.5f), Color.WHITE, true);
        }

        private void drawChartTitle(Canvas c) {
            float x = chart.left + dp(12), y = chart.top + dp(25);
            drawText(c, "Bitcoin / TetherUS  ·  15", x, y, dp(14), white, true);
            y += dp(22);
            drawText(c, String.format(Locale.US, "O %.2f   H %.2f   L %.2f   C %.2f", basePrice - .8f, basePrice + 1.7f, basePrice - 1.2f, basePrice), x, y, dp(10.5f), teal, false);
            p.setColor(Color.argb(190, 24, 37, 51));
            c.drawRoundRect(chart.left + dp(10), chart.bottom - dp(77), chart.left + dp(345), chart.bottom - dp(49), dp(5), dp(5), p);
            drawText(c, "Mumları yukarı/aşağı ve sağa/sola sürükleyebilirsin", chart.left + dp(20), chart.bottom - dp(59), dp(10.5f), white, false);
        }

        private void drawText(Canvas c, String s, float x, float y, float size, int color, boolean bold) {
            text.setTextSize(size); text.setColor(color);
            text.setTypeface(android.graphics.Typeface.create("sans", bold ? android.graphics.Typeface.BOLD : android.graphics.Typeface.NORMAL));
            c.drawText(s, x, y, text);
        }

        private void drawTextCentered(Canvas c, String s, float x, float y, float size, int color, boolean bold) {
            text.setTextSize(size); text.setColor(color);
            text.setTypeface(android.graphics.Typeface.create("sans", bold ? android.graphics.Typeface.BOLD : android.graphics.Typeface.NORMAL));
            c.drawText(s, x - text.measureText(s) / 2f, y, text);
        }

        @Override
        public boolean onTouchEvent(MotionEvent e) {
            scaleDetector.onTouchEvent(e);
            float x = e.getX(), y = e.getY();
            switch (e.getActionMasked()) {
                case MotionEvent.ACTION_DOWN:
                    lastX = x; lastY = y;
                    dragging = chart.contains(x, y);
                    axisDrag = dragging && x > chart.right - dp(58);
                    timeScaleDrag = dragging && y > chart.bottom - dp(40) && !axisDrag;
                    getParent().requestDisallowInterceptTouchEvent(dragging);
                    return true;
                case MotionEvent.ACTION_POINTER_DOWN:
                    return true;
                case MotionEvent.ACTION_MOVE:
                    if (scaleDetector.isInProgress()) {
                        lastX = x; lastY = y;
                        return true;
                    }
                    if (dragging) {
                        float dx = x - lastX;
                        float dy = y - lastY;
                        if (axisDrag) {
                            chartScaleY = clamp(chartScaleY * (float)Math.exp(-dy / dp(180)), 0.45f, 5.2f);
                        } else if (timeScaleDrag) {
                            chartScaleX = clamp(chartScaleX * (float)Math.exp(dx / dp(220)), 0.45f, 5.2f);
                        } else {
                            offsetX += dx;
                            offsetY += dy;
                        }
                        lastX = x; lastY = y;
                        invalidate();
                    }
                    return true;
                case MotionEvent.ACTION_UP:
                case MotionEvent.ACTION_CANCEL:
                    dragging = false; axisDrag = false; timeScaleDrag = false;
                    getParent().requestDisallowInterceptTouchEvent(false);
                    return true;
            }
            return true;
        }
    }
}
