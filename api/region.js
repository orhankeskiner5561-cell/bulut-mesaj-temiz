module.exports = (req,res)=>{
  const h=req.headers||{};
  let country=(h['x-vercel-ip-country']||h['cf-ipcountry']||h['x-country-code']||'').toString().trim().toUpperCase();
  if(!/^[A-Z]{2}$/.test(country)) country='';
  res.setHeader('Cache-Control','no-store');
  res.status(200).json({country});
};
