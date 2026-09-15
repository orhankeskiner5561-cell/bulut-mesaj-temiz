#!/usr/bin/env python3
from pathlib import Path
import subprocess, sys

root=Path(__file__).resolve().parent
src_path=root/'v9_interaction_pa_patch.py'
src=src_path.read_text(encoding='utf-8')
src=src.replace('from pathlib import Path\n','from pathlib import Path\nimport re\n',1)
start=src.find('# 8)')
end=src.find('# 9)',start)
if start<0 or end<0:
    raise SystemExit('V9 runner: analysis section markers not found')
fixed=r'''# 8) Make full analysis modal show exactly what the PA engine used.
pat=r"\$\('analyzeBtn'\)\.onclick=.*?(?=\n\$\('drawBtn'\))"
m=re.search(pat,s,re.S)
if not m: raise SystemExit('V9 analyze handler regex anchor not found')
new_handler=r"""$('analyzeBtn').onclick=()=>{let a=state.analysis;if(!a)return;let setup=a.dir==='BEKLE'?'NET SETUP YOK':`${a.dir} • Güven %${a.conf} • Kalite ${a.quality}`,bos=a.bosUp?'Yukarı':a.bosDn?'Aşağı':'Yok',choch=a.chochUp?'Yukarı':a.chochDn?'Aşağı':'Yok',liq=a.sweepLow?'Dip likiditesi süpürüldü':a.sweepHigh?'Tepe likiditesi süpürüldü':'Sweep yok',fvg=a.fvgUp?'Bullish':a.fvgDn?'Bearish':'Yok',ob=a.bullObTouch?'Bullish OB reaksiyonu':a.bearObTouch?'Bearish OB reaksiyonu':'Aktif reaksiyon yok';let text=`${setup}\n\nPRICE ACTION KRİTERLERİ\n• Piyasa yapısı: ${a.structure}\n• BOS: ${bos}\n• CHoCH: ${choch}\n• Likidite: ${liq}\n• FVG: ${fvg}\n• Order Block: ${ob}\n• Konum: ${a.discount?'Discount (iskonto)':'Premium'}\n• ${state.mtfText}\n• Skor: LONG ${a.long} / SHORT ${a.short}\n\n${a.dir==='BEKLE'?'Teyitler aynı yönde yeterince birleşmedi.':`Entry ${fmt(a.entry)}\nStop ${fmt(a.stop)}\nTP1 ${fmt(a.tp1)}\nTP2 ${fmt(a.tp2)}\nTP3 ${fmt(a.tp3)}\nR/R hedefi yaklaşık 1:3`}\n\nTetikleyiciler: ${a.reasons.join(' • ')}`;$('analysisText').innerText=text;$('analysisModal').classList.add('open')};"""
s=s[:m.start()]+new_handler+s[m.end():]

'''
src=src[:start]+fixed+src[end:]
runtime=root/'_v9_runtime.py'
runtime.write_text(src,encoding='utf-8')
try:
    subprocess.check_call([sys.executable,str(runtime)])
finally:
    runtime.unlink(missing_ok=True)
