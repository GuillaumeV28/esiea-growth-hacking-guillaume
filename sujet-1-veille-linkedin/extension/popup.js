const $=id=>document.getElementById(id);
let last;
async function act(action) {
  const r=await chrome.runtime.sendMessage({action,endpoint:$('endpoint').value,token:$('token').value});
  if(!r.ok) {$('status').textContent=r.error;return;}
  last=r.state;
  $('status').textContent=JSON.stringify({...last,next:last.next?new Date(last.next).toLocaleString('fr-FR'):null,logs:last.logs.slice(-6)},null,2);
}
chrome.storage.local.get(['endpoint','token']).then(s=>{$('endpoint').value=s.endpoint||'';$('token').value=s.token||'';act('status');});
for(const id of ['save','sync','run','start','stop','demoStop','rearm']) $(id).onclick=()=>act(id).catch(e=>{$('status').textContent=e.message;});
$('refresh').onclick=()=>act('status');
$('export').onclick=async()=>{await act('status');const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(last,null,2)],{type:'application/json'}));a.download='journal-cybercap.json';a.click();};
