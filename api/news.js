export default async function handler(req,res){
  try{
    const scope=String(req.query.scope||'turkiye');
    const cat=String(req.query.cat||'manset');
    const city=String(req.query.city||'Samsun').replace(/[^\p{L}\p{N} .-]/gu,'').slice(0,60);
    const map={
      manset:'son dakika önemli haberler',
      sondakika:'son dakika',
      spor:'spor futbol basketbol',
      magazin:'magazin sanat ünlüler',
      ekonomi:'ekonomi finans piyasalar',
      teknoloji:'teknoloji yapay zeka bilim'
    };
    let q=map[cat]||map.manset;
    if(scope==='local')q=`${city} ${q}`;
    else if(scope==='world')q=`dünya ${q}`;
    else q=`Türkiye ${q}`;
    const rss=`https://news.google.com/rss/search?q=${encodeURIComponent(q)}&hl=tr&gl=TR&ceid=TR:tr`;
    const r=await fetch(rss,{headers:{'user-agent':'Mozilla/5.0 BULUT/1.0'}});
    if(!r.ok)throw new Error('news fetch failed');
    const xml=await r.text();
    const items=[...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].slice(0,24).map(m=>{
      const x=m[1];
      const pick=t=>((x.match(new RegExp(`<${t}>([\\s\\S]*?)<\\/${t}>`))||[])[1]||'').replace(/<!\[CDATA\[|\]\]>/g,'').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>');
      const title=pick('title'); const link=pick('link'); const pubDate=pick('pubDate');
      const srcMatch=x.match(/<source[^>]*>([\s\S]*?)<\/source>/); const source=(srcMatch?.[1]||'Haber Kaynağı').replace(/<!\[CDATA\[|\]\]>/g,'').replace(/&amp;/g,'&');
      return {title,link,pubDate,source};
    }).filter(x=>x.title&&x.link);
    res.setHeader('Cache-Control','s-maxage=180, stale-while-revalidate=300');
    res.status(200).json({scope,cat,city,items});
  }catch(e){res.status(500).json({error:'Haberler alınamadı',items:[]})}
}
