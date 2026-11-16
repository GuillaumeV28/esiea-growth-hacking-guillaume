import {validate,searchUrl,dayKey,inWindow,nextDue,detectStop} from './core.mjs';
const defaults={keywords:['"besoin de formation" AND cybersécurité','NIS2 AND compétences','"ISO 27001" AND formation','"recrutement" AND RSSI'],batch:4,daily:20,intervalMinutes:120,jitterMinutes:20,startHour:9,endHour:18,sessionEnd:'',filterSuffix:''};
let busy=false;
const read=async()=>({config:defaults,seen:[],pending:[],logs:[],enabled:false,blocked:false,cursor:0,...await chrome.storage.local.get(null)});
async function log(event,detail={}) { const s=await read(); await chrome.storage.local.set({logs:[...s.logs,{time:new Date().toISOString(),event,...detail}].slice(-500)}); }
async function stop(reason,blocked=false) {
  const s=await read(); blocked=blocked || s.blocked;
  await chrome.alarms.clearAll(); await chrome.storage.local.set({enabled:false,blocked,cancelled:true,next:null,stopReason:reason});
  await log('ARRET',{reason,blocked});
}
async function api(action,data={}) {
  const s=await read();
  if(!/^https:\/\/script\.google\.com\/macros\/s\/[\w-]+\/exec$/.test(s.endpoint||'')) throw Error('URL Apps Script /exec requise');
  if(!s.token) throw Error('Jeton privé requis');
  const res=await fetch(s.endpoint,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify({token:s.token,action,...data}),redirect:'follow',signal:AbortSignal.timeout(25000)});
  if(!res.ok) throw Error('HTTP '+res.status);
  const out=await res.json(); if(!out.ok) throw Error(out.error || 'Erreur serveur'); return out;
}
async function syncConfig() {
  const r=await api('config'); validate(r.config); await chrome.storage.local.set({config:r.config}); return r.config;
}
async function flush() {
  const s=await read(); if(!s.pending.length) return;
  await api('append',{posts:s.pending});
  await chrome.storage.local.set({pending:[]}); await log('SYNCHRONISE',{count:s.pending.length});
}
async function schedule() {
  const s=await read(); if(!s.enabled || s.blocked) return;
  const t=nextDue(s.config); if(!t) return stop('FIN_DE_FENETRE_OU_SEANCE');
  await chrome.alarms.create('collect',{when:t}); await chrome.storage.local.set({next:t}); await log('PROCHAINE_ECHEANCE',{when:new Date(t).toISOString()});
}
async function loadOnce(url) {
  const tab=await chrome.tabs.create({url,active:true}); await chrome.storage.local.set({runningTab:tab.id});
  for(let i=0;i<30;i++) {
    const current=await chrome.tabs.get(tab.id);
    const warning=detectStop(current.url || '', ''); if(warning) throw Error(warning);
    if(current.status==='complete') return tab.id;
    await new Promise(r=>setTimeout(r,600));
  }
  throw Error('PAGE_INDISPONIBLE');
}
async function run(manual=false) {
  if(busy) throw Error('Une exécution est en cours'); busy=true;
  try {
    let s=await read(); if(s.blocked) throw Error('ARRET_VERROUILLE : réarmement manuel nécessaire');
    if(!manual && !s.enabled) return;
    const c=await syncConfig();
    if(!inWindow(c)) { await stop('HORS_FENETRE_OU_FIN_SEANCE'); return; }
    // Reprise d'envoi sans rechargement de LinkedIn ni nouvelle analyse.
    await flush(); s=await read();
    const day=dayKey(), used=s.day===day ? s.used || 0 : 0;
    const limit=Math.min(c.batch,c.daily-used); if(limit<=0) {await stop('PLAFOND_QUOTIDIEN');return;}
    const keyword=c.keywords[s.cursor%c.keywords.length];
    await log('DEBUT',{keyword,limit});
    const tabId=await loadOnce(searchUrl(keyword,c.filterSuffix));
    await new Promise(r=>setTimeout(r,1800+Math.random()*1200));
    // Fin de séance ou arrêt manuel survenu pendant le chargement.
    s=await read(); if(s.cancelled || !inWindow(c)) return;
    await chrome.scripting.executeScript({target:{tabId},files:['collect.js']});
    const result=await chrome.scripting.executeScript({target:{tabId},func:async args=>collectVisible(args),args:[{salt:s.salt,known:s.seen,limit}]});
    const r=result[0]?.result; if(!r) throw Error('COLLECTE_SANS_REPONSE');
    if(r.stop) {await stop(r.stop,true);return;}
    const fresh=r.posts.filter(p=>!s.seen.includes(p.id)).map(p=>({...p,keyword}));
    // Enregistrer en local avant le réseau : limite quotidienne incluant les envois en attente.
    await chrome.storage.local.set({seen:[...new Set([...s.seen,...fresh.map(p=>p.id)])],pending:[...s.pending,...fresh],day,used:used+fresh.length,cursor:s.cursor+1});
    await log('COLLECTE',{keyword,count:fresh.length,status:r.status}); await flush();
  } catch(e) {
    await log('ERREUR',{message:e.message});
    if(/SESSION_OU_VERIFICATION|CAPTCHA|BLOCAGE|AVERTISSEMENT/.test(e.message)) await stop(e.message,true);
    else await stop('ERREUR_REPRISE_MANUELLE : '+e.message);
    throw e;
  } finally {
    const s=await read();
    if(s.runningTab) {await chrome.tabs.remove(s.runningTab).catch(()=>{});await chrome.storage.local.remove('runningTab');}
    busy=false; await schedule();
  }
}
chrome.alarms.onAlarm.addListener(a=>{
  if(a.name==='end') stop('FIN_DE_SEANCE').catch(console.error);
  if(a.name==='collect') run().catch(console.error);
});
chrome.runtime.onStartup.addListener(()=>stop('NAVIGATEUR_REDEMARRE').catch(console.error));
chrome.runtime.onInstalled.addListener(async()=>{
  await stop('INSTALLATION_OU_MISE_A_JOUR'); const s=await read();
  if(!s.salt) await chrome.storage.local.set({salt:crypto.randomUUID()+crypto.randomUUID(),config:defaults});
});
chrome.runtime.onMessage.addListener((m,sender,respond)=>{
  // Aucun content script ne peut utiliser le pont : seules les pages de l'extension.
  if(sender.id!==chrome.runtime.id || !sender.url?.startsWith(chrome.runtime.getURL(''))) return;
  (async()=>{
    if(m.action==='save') {await chrome.storage.local.set({endpoint:m.endpoint.trim(),token:m.token.trim()});await syncConfig();}
    if(m.action==='sync') {await syncConfig();await flush();}
    if(m.action==='run') {await chrome.storage.local.set({cancelled:false});await run(true);}
    if(m.action==='start') {
      const s=await read(); if(s.blocked) throw Error('Réarmer après vérification manuelle');
      const c=await syncConfig();if(!inWindow(c)) throw Error('Hors fenêtre ou fin de séance');
      await chrome.storage.local.set({enabled:true,cancelled:false});
      await chrome.alarms.create('end',{when:Date.parse(c.sessionEnd)});await run();
    }
    if(m.action==='stop') {await chrome.storage.local.set({cancelled:true});await stop('ARRET_MANUEL');}
    if(m.action==='rearm') {await chrome.storage.local.set({blocked:false});await log('REARMEMENT_MANUEL');}
    if(m.action==='demoStop') await stop('DEMONSTRATION_CAPTCHA_SIMULE',true);
    const s=await read();
    return {enabled:s.enabled,blocked:s.blocked,next:s.next,reason:s.stopReason,used:s.used||0,pending:s.pending.length,logs:s.logs,alarms:await chrome.alarms.getAll(),busy};
  })().then(x=>respond({ok:true,state:x})).catch(e=>respond({ok:false,error:e.message}));return true;
});
