const decode=s=>String(s||'').replace(/<!\[CDATA\[|\]\]>/g,'').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;|&apos;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>');
const strip=s=>decode(s).replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();
function parse(xml){
  return [...String(xml||'').matchAll(/<item(?:\s[^>]*)?>([\s\S]*?)<\/item>/gi)].slice(0,30).map(m=>{
    const x=m[1];
    const pick=t=>decode((x.match(new RegExp(`<${t}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${t}>`,'i'))||[])[1]||'');
    const title=strip(pick('title'));
    const link=strip(pick('link')) || strip((x.match(/<guid[^>]*>([\s\S]*?)<\/guid>/i)||[])[1]||'');
    const pubDate=strip(pick('pubDate')||pick('date'));
    const src=(x.match(/<source[^>]*>([\s\S]*?)<\/source>/i)||[])[1];
    const source=strip(src||'Haber');
    return {title,link,pubDate,source};
  }).filter(x=>x.title&&x.link);
}
async function get(url,ms=4500){
  const c=new AbortController(); const t=setTimeout(()=>c.abort(),ms);
  try{const r=await fetch(url,{headers:{'user-agent':'Mozilla/5.0 VITRIN/1.0','accept':'application/rss+xml,application/xml,text/xml,*/*'},signal:c.signal});if(!r.ok)throw new Error(String(r.status));return await r.text()}finally{clearTimeout(t)}
}
export default async function handler(req,res){
  const scope=String(req.query.scope||'turkiye');
  const cat=String(req.query.cat||'manset');
  const city=String(req.query.city||'Samsun').replace(/[^\p{L}\p{N} .-]/gu,'').slice(0,60);
  const map={manset:'son dakika önemli haberler',sondakika:'son dakika',spor:'spor futbol basketbol',magazin:'magazin sanat ünlüler',muzik:'müzik konser şarkıcı',ekonomi:'ekonomi finans piyasalar',teknoloji:'teknoloji yapay zeka bilim'};
  let q=map[cat]||map.manset;
  q=scope==='local'?`${city} ${q}`:scope==='world'?`dünya ${q}`:`Türkiye ${q}`;
  const urls=[
    `https://news.google.com/rss/search?q=${encodeURIComponent(q)}&hl=tr&gl=TR&ceid=TR:tr`,
    `https://www.bing.com/news/search?q=${encodeURIComponent(q)}&format=rss&setlang=tr-tr`
  ];
  let items=[];
  for(const u of urls){
    try{items=parse(await get(u));if(items.length)break}catch(e){}
  }
  if(!items.length){
    items=[
      {title:'VİTRİN haber servisi bağlantı yeniliyor',link:'https://news.google.com/?hl=tr&gl=TR&ceid=TR:tr',pubDate:new Date().toUTCString(),source:'VİTRİN'},
      {title:'Türkiye ve dünya gündemi için tekrar deneyin',link:'https://news.google.com/?hl=tr&gl=TR&ceid=TR:tr',pubDate:new Date().toUTCString(),source:'VİTRİN'}
    ];
  }
  res.setHeader('Cache-Control','s-maxage=60, stale-while-revalidate=120');
  res.status(200).json({scope,cat,city,items});
}
