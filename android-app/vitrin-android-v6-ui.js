(function(){
  const ID='vitrinAndroidV6Clean';
  if(document.getElementById(ID)) return;
  const s=document.createElement('style');
  s.id=ID;
  s.textContent=`
  /* V6: çalışan V5 bağlantı/yayın altyapısına dokunmadan yalnız görünüm temizliği */
  html body .topActions .v5Notif{background:transparent!important;box-shadow:none!important;border:0!important;overflow:visible!important}
  html body .topActions .v5Notif>*{display:none!important;background:transparent!important;box-shadow:none!important;border:0!important}
  html body .topActions .v5Notif #notifBtn,
  html body .topActions .v5Notif .ib,
  html body .topActions .v5Notif .ibWrap{display:none!important;background:transparent!important;box-shadow:none!important;border:0!important;width:0!important;height:0!important;min-width:0!important;min-height:0!important;padding:0!important;margin:0!important;overflow:hidden!important}
  html body .topActions .v5Notif:before{content:'🔔'!important;display:block!important;font-size:23px!important;line-height:36px!important;width:36px!important;height:36px!important;text-align:center!important;background:transparent!important}
  html body .topActions .v5Notif .badgeDot{display:grid!important;position:absolute!important;right:-2px!important;top:-2px!important;width:auto!important;height:18px!important;min-width:18px!important;overflow:visible!important}

  /* Alt navigasyon tamamen kaldırıldı; yeni navigasyon daha sonra eklenecek */
  html body .bottom{display:none!important;height:0!important;min-height:0!important;padding:0!important;margin:0!important;border:0!important;overflow:hidden!important}
  html body{padding-bottom:max(10px,env(safe-area-inset-bottom))!important}

  /* Ana akışın ekranı doğal kullanmasına izin ver */
  html body #feed{padding-bottom:14px!important}
  `;
  document.head.appendChild(s);
})();
