(function(){
  function bellMarkup(){return '<span class="vitrinBellEmoji" aria-hidden="true">🔔️</span>'}
  function normalize(){
    const actions=document.querySelector('.topActions,.actions');
    if(!actions)return;
    actions.classList.add('topActions','vitrinTopActionsUniform');
    actions.querySelectorAll('button,a').forEach(el=>el.classList.add('vitrinTopIconUniform'));
    const notif=document.querySelector('#notifBtn') || [...actions.querySelectorAll('button,a')].find(el=>(el.title||'').toLocaleLowerCase('tr-TR').includes('bildirim') || (el.textContent||'').includes('🔔'));
    if(notif){notif.classList.add('vitrinBellUniform');notif.innerHTML=bellMarkup()}
  }
  function addStyle(){
    if(document.getElementById('vitrinTopbarUniformStyle'))return;
    const s=document.createElement('style');s.id='vitrinTopbarUniformStyle';
    s.textContent=`
      .vitrinTopActionsUniform{gap:5px!important;align-items:center!important;flex-wrap:nowrap!important}
      .vitrinTopActionsUniform .vitrinTopIconUniform{width:39px!important;height:39px!important;min-width:39px!important;min-height:39px!important;border-radius:12px!important;font-size:19px!important;padding:0!important;display:grid!important;place-items:center!important;line-height:1!important}
      .vitrinTopActionsUniform .vitrinThemeBtn{font-size:19px!important}
      .vitrinTopActionsUniform .vitrinBellUniform{background:#fff!important;border:1px solid rgba(255,255,255,.38)!important;box-shadow:0 2px 7px rgba(0,0,0,.12)!important;overflow:visible!important}
      .vitrinBellEmoji{font-family:"Noto Color Emoji","Apple Color Emoji","Segoe UI Emoji",sans-serif!important;font-size:20px!important;line-height:1!important;display:block!important;transform:translateY(-1px)}
      .vitrinTopActionsUniform .reelsProfileTop{overflow:hidden!important}
      .vitrinTopActionsUniform .reelsProfileTop img,.vitrinTopActionsUniform #topA img{width:100%!important;height:100%!important;object-fit:cover!important;border-radius:inherit!important}
      @media(max-width:420px){
        .vitrinTopActionsUniform{gap:4px!important}
        .vitrinTopActionsUniform .vitrinTopIconUniform{width:37px!important;height:37px!important;min-width:37px!important;min-height:37px!important;border-radius:11px!important;font-size:18px!important}
        .vitrinBellEmoji{font-size:19px!important}
      }
    `;document.head.appendChild(s)
  }
  function init(){addStyle();normalize();new MutationObserver(normalize).observe(document.body,{childList:true,subtree:true})}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
