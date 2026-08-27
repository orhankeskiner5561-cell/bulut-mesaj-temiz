from pathlib import Path

p=Path('index.html')
s=p.read_text(encoding='utf-8')
start=s.find('async function loadNotificationBadge(){')
end=s.find('\nasync function loadNotifications', start)
if start<0 or end<0:
    raise SystemExit('loadNotificationBadge sinirlari bulunamadi; dosyaya dokunulmadi')
new=r'''async function loadNotificationBadge(){
  const badge=$('#notifBadge'),bell=$('#notifBtn');
  if(!badge||!bell)return;
  if(!session){badge.hidden=true;badge.textContent='';bell.classList.remove('hasNotification');return}
  const uid=session.user.id;

  // Mesaj sayisini mesaj adediyle degil, okunmamis mesaj gonderen kisi sayisiyla hesapla.
  let messagePeople=0;
  const cr=await sb.from('chat_requests').select('id').eq('status','accepted').or(`sender_id.eq.${uid},receiver_id.eq.${uid}`);
  if(!cr.error&&cr.data?.length){
    const ids=[...new Set(cr.data.map(x=>x.id))];
    const mr=await sb.from('messages').select('sender_id').in('chat_request_id',ids).neq('sender_id',uid).is('read_at',null);
    if(!mr.error)messagePeople=new Set((mr.data||[]).map(m=>m.sender_id).filter(Boolean)).size;
  }

  // Mesajlar notifications tablosunda da tutuluyorsa ikinci kez sayma.
  let otherCount=0;
  const nr=await sb.from('notifications').select('id,type').eq('user_id',uid).is('read_at',null);
  if(!nr.error)otherCount=(nr.data||[]).filter(n=>n.type!=='message').length;

  const total=messagePeople+otherCount;
  if(total>0){
    badge.hidden=false;
    badge.textContent=total>99?'99+':String(total);
    bell.classList.add('hasNotification');
  }else{
    badge.hidden=true;
    badge.textContent='';
    bell.classList.remove('hasNotification');
  }
}
'''
s=s[:start]+new+s[end:]
p.write_text(s,encoding='utf-8')
