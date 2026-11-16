/* Sujet 2 ESIEA — support étudiant entrant, prototype pédagogique.
 * Coller tout ce fichier dans le script LIÉ à un nouveau tableur appartenant
 * à voisine.guillaume@gmail.com. Ne pas utiliser le projet CyberCap du sujet 1.
 * Installer les onglets puis configurer les propriétés privées du script.
 * Aucun email, appel sortant ou enregistrement audio n'est déclenché par ce code.
 */
const CALL_HEADERS=['call_id','date_collecte','direction','prenom','nom','entreprise','resume_besoin','niveau_autorite','delai','budget_confirme','statut_lead','duree_secondes','resume_complet','transparence_ia_acceptee','score_100','theme','statut_demande','suivi_humain','resume_confirme','source'];
const JOB_HEADERS=['call_id','recu_utc','donnees_minimales_json','tentatives','etat','prochain_essai_utc','erreur'];
const TOPICS=['sujet_1','sujet_2','hors_perimetre','inconnu'];
function onOpen(){SpreadsheetApp.getUi().createMenu('Support ESIEA').addItem('Installer les onglets','installer').addItem('Activer la synchronisation','activerSynchronisation').addItem('Désactiver la synchronisation','desactiverSynchronisation').addItem('Traiter la file maintenant','traiterFile').addItem('Insérer un exemple fictif','insererExempleFictif').addToUi();}
function installer(){
  const ss=SpreadsheetApp.getActive(),p=PropertiesService.getScriptProperties();p.setProperty('SHEET_ID',ss.getId());
  if(!p.getProperty('WEBHOOK_TOKEN'))p.setProperty('WEBHOOK_TOKEN',Utilities.getUuid()+Utilities.getUuid());
  const defs={Appels:CALL_HEADERS,File:JOB_HEADERS,Journal:['date_utc','evenement','call_id','detail']};
  Object.entries(defs).forEach(([name,h])=>{let s=ss.getSheetByName(name);if(!s)s=ss.insertSheet(name);if(!s.getLastRow())s.appendRow(h);s.setFrozenRows(1);s.getRange(1,1,1,h.length).setBackground('#173B54').setFontColor('#FFFFFF').setFontWeight('bold');});
  let d=ss.getSheetByName('Dashboard');if(!d)d=ss.insertSheet('Dashboard');
  d.getRange('A1:B7').setValues([['Support étudiant ESIEA','Prototype pédagogique'],['Indicateur','Valeur'],['Appels consignés',''],['Réponses confirmées résolues',''],['Demandes de suivi humain',''],['Refus ou accord IA absent',''],['Synchronisations en erreur','']]);
  const formulas=[['=COUNTA(Appels!A2:A)'],['=COUNTIF(Appels!Q2:Q,"RESOLU")'],['=COUNTIF(Appels!R2:R,TRUE)'],['=COUNTIF(Appels!N2:N,FALSE)'],['=COUNTIF(File!E2:E,"ERREUR")']];
  d.getRange('B3:B7').setFormulas(formulas.map(([f])=>[ss.getSpreadsheetLocale().startsWith('fr')?f.replace(/,/g,';'):f]));
  d.getRange('A1:B2').setBackground('#173B54').setFontColor('white').setFontWeight('bold');d.setColumnWidth(1,310);d.setColumnWidth(2,220);ss.setActiveSheet(d);
}
function ss_(){const id=PropertiesService.getScriptProperties().getProperty('SHEET_ID');if(!id)throw Error('INSTALLER_D_ABORD');return SpreadsheetApp.openById(id);}
function sh_(name){const s=ss_().getSheetByName(name);if(!s)throw Error('ONGLET_MANQUANT');return s;}
function safe_(v){if(typeof v==='number'||typeof v==='boolean')return v;if(v===null||v===undefined)return '';const t=String(v).slice(0,40000);return /^[=+@\-\t\r]/.test(t)?"'"+t:t;}
function json_(x){return ContentService.createTextOutput(JSON.stringify(x)).setMimeType(ContentService.MimeType.JSON);}
function journal_(event,id,detail){sh_('Journal').appendRow([new Date().toISOString(),event,safe_(id),safe_(detail)]);}
function equalSecret_(a,b){if(typeof a!=='string'||typeof b!=='string'||!b.length)return false;let diff=a.length^b.length;for(let i=0;i<Math.max(a.length,b.length);i++)diff|=(a.charCodeAt(i)||0)^(b.charCodeAt(i)||0);return diff===0;}
function rowForId_(s,id){if(s.getLastRow()<2)return 0;const rows=s.getRange(2,1,s.getLastRow()-1,1).getValues();const n=rows.findIndex(r=>r[0]===id);return n<0?0:n+2;}
function id_(v){if(typeof v!=='string'||!/^[a-zA-Z0-9_-]{6,120}$/.test(v))throw Error('CALL_ID_INVALIDE');return v;}
function text_(x,max=1500){if(x===null||x===undefined)return '';if(typeof x!=='string')throw Error('TEXTE_INVALIDE');return x.trim().slice(0,max);}
function extraction_(artifact){
  const out=artifact?.structuredOutputs;if(!out||typeof out!=='object')return null;
  const target=PropertiesService.getScriptProperties().getProperty('STRUCTURED_OUTPUT_ID');
  if(!target)throw Error('STRUCTURED_OUTPUT_ID_MANQUANT');
  const entry=out[target];if(!entry||!entry.result)return null;return typeof entry.result.payload_json==='string'?JSON.parse(entry.result.payload_json):entry.result;
}
function minimalEvent_(m){
  const c=m.call||{},p=PropertiesService.getScriptProperties(),expected=p.getProperty('VAPI_ASSISTANT_ID');
  if(!expected)throw Error('VAPI_ASSISTANT_ID_MANQUANT');
  if((c.assistantId||m.assistant?.id)!==expected)throw Error('ASSISTANT_INATTENDU');
  const a=m.artifact||c.artifact||{};
  // Les enregistrements, transcriptions, numéros et messages bruts ne sont pas stockés.
  return {call_id:id_(c.id),started_at:c.startedAt||m.startedAt||null,ended_at:c.endedAt||m.endedAt||null,duration_seconds:m.durationSeconds??c.durationSeconds??null,result:extraction_(a),source:'VAPI'};
}
function doGet(){return json_({ok:true,service:'ESIEA support pédagogique',version:'1.0'});}
function doPost(e){
  try{
    const p=PropertiesService.getScriptProperties();
    // Apps Script ne fournit pas les en-têtes HTTP arbitraires dans e.
    // Pour la démo directe Vapi : secret dans ?token=, jamais dans le prompt.
    if(!e?.postData?.contents||e.postData.contents.length>250000)throw Error('CORPS_INVALIDE');
    const b=JSON.parse(e.postData.contents),token=e.parameter?.token||b.token;
    if(!equalSecret_(token,p.getProperty('WEBHOOK_TOKEN')))return json_({ok:false,error:'NON_AUTORISE'});
    if(b.message&&b.message.type!=='end-of-call-report')return json_({ok:true,ignored:true});
    let item;
    if(b.message)item=minimalEvent_(b.message);
    else{ id_(b.call_id); item={call_id:b.call_id,duration_seconds:b.call_metadata?.duration_seconds,result:fromExpectedJson_(b),source:'WEBHOOK_JSON'}; }
    const lock=LockService.getScriptLock();if(!lock.tryLock(5000))throw Error('OCCUPE_REESSAYER');
    try{
      if(rowForId_(sh_('Appels'),item.call_id)||rowForId_(sh_('File'),item.call_id))return json_({ok:true,duplicate:true});
      const serialized=JSON.stringify(item);if(serialized.length>40000)throw Error('EVENEMENT_TROP_LONG');
      sh_('File').appendRow([item.call_id,new Date().toISOString(),serialized,0,'EN_ATTENTE',new Date().toISOString(),'']);
      journal_('WEBHOOK_RECU',item.call_id,'En attente de traitement');
    }finally{lock.releaseLock();}
    return json_({ok:true,queued:true,call_id:item.call_id});
  }catch(err){return json_({ok:false,error:String(err.message||err)});}
}
function fromExpectedJson_(b){
  const c=b.contact||{},q=b.qualification||{},meta=b.call_metadata||{},s=b.support||{};
  return {contact:{first_name:c.first_name??null,last_name:c.last_name??null,company_name:c.company_name??null},qualification:{need_summary:q.need_summary??null,authority_level:q.authority_level??null,timeline:q.timeline??null,budget_confirmed:q.budget_confirmed??null},call_metadata:{full_summary:meta.full_summary??null,ai_transparency_accepted:meta.ai_transparency_accepted??null},support:{topic:s.topic||'inconnu',resolved:s.resolved===true,human_followup_requested:s.human_followup_requested===true,summary_confirmed:s.summary_confirmed===true}};
}
function normalise_(item){
  id_(item.call_id);const a=item.result;if(!a||typeof a!=='object')throw Error('EXTRACTION_EN_ATTENTE');
  const c=a.contact||{},q=a.qualification||{},m=a.call_metadata||{},s=a.support||{};
  if(![true,false,null].includes(m.ai_transparency_accepted))throw Error('ACCORD_IA_INVALIDE');
  let duration=item.duration_seconds;
  if(duration===null||duration===undefined){const start=Date.parse(item.started_at),end=Date.parse(item.ended_at);duration=Number.isFinite(start)&&Number.isFinite(end)?Math.round((end-start)/1000):null;}
  if(duration!==null&&(!Number.isFinite(duration)||duration<0||duration>86400))throw Error('DUREE_INVALIDE');
  if(m.ai_transparency_accepted!==true)return {call_id:item.call_id,first:'',last:'',company:'',need:'',authority:'',timeline:'',budget:null,lead:'Nurturing',duration,summary:'Interaction IA refusée ou accord explicite absent.',accepted:false,score:0,topic:'inconnu',state:'REFUS_OU_ACCORD_ABSENT',human:false,confirmed:false,source:item.source};
  if(!TOPICS.includes(s.topic))throw Error('THEME_INVALIDE');
  for(const k of ['resolved','human_followup_requested','summary_confirmed'])if(typeof s[k]!=='boolean')throw Error('CHAMP_SUPPORT_INVALIDE');
  if(q.budget_confirmed!==null&&q.budget_confirmed!==undefined&&typeof q.budget_confirmed!=='boolean')throw Error('BUDGET_INVALIDE');
  const first=text_(c.first_name,80),last=text_(c.last_name,80),company=text_(c.company_name,100),need=text_(q.need_summary,1500),timeline=text_(q.timeline,150),summary=text_(m.full_summary,3500);
  // Score de complétude du suivi, jamais une note ou un score de valeur de l'étudiant.
  const score=(need.length>=15?40:0)+(s.topic!=='inconnu'?20:0)+(s.summary_confirmed?20:0)+(first||last?10:0)+(timeline?10:0);
  const human=s.human_followup_requested||s.topic==='hors_perimetre'||!s.resolved;
  const state=human?'SUIVI_HUMAIN':s.resolved?'RESOLU':'A_PRECISER';
  return {call_id:item.call_id,first,last,company,need,authority:text_(q.authority_level,120),timeline,budget:q.budget_confirmed??null,lead:human&&score>=70?'SQL':'Nurturing',duration,summary,accepted:true,score,topic:s.topic,state,human,confirmed:s.summary_confirmed,source:item.source};
}
function toRow_(a){return [a.call_id,new Date().toISOString(),'ENTRANT',a.first,a.last,a.company,a.need,a.authority,a.timeline,a.budget,a.lead,a.duration,a.summary,a.accepted,a.score,a.topic,a.state,a.human,a.confirmed,a.source].map(safe_);}
function fetchCall_(id){
  const key=PropertiesService.getScriptProperties().getProperty('VAPI_API_KEY');if(!key)throw Error('VAPI_API_KEY_MANQUANTE');
  const r=UrlFetchApp.fetch('https://api.vapi.ai/call/'+encodeURIComponent(id),{headers:{Authorization:'Bearer '+key},muteHttpExceptions:true});
  if(r.getResponseCode()!==200)throw Error('API_VAPI_HTTP_'+r.getResponseCode());
  const call=JSON.parse(r.getContentText());return minimalEvent_({call,artifact:call.artifact,durationSeconds:call.durationSeconds});
}
function traiterFile(){
  const jobs=sh_('File'),snapshot=jobs.getDataRange().getValues(),now=Date.now();let count=0;
  for(let i=1;i<snapshot.length&&count<5;i++){
    const row=snapshot[i],stale=row[4]==='EN_COURS'&&now-Date.parse(row[5])>600000;
    if(!(row[4]==='EN_ATTENTE'||stale)||(!stale&&Date.parse(row[5])>now))continue;
    const lock=LockService.getScriptLock();if(!lock.tryLock(1000))return;
    let item;
    try{
      const current=jobs.getRange(i+1,1,1,7).getValues()[0];
      if(current[4]!=='EN_ATTENTE'&&!(current[4]==='EN_COURS'&&now-Date.parse(current[5])>600000))continue;
      if(rowForId_(sh_('Appels'),row[0])){jobs.getRange(i+1,5).setValue('TERMINE');continue;}
      item=JSON.parse(current[2]);jobs.getRange(i+1,4,1,3).setValues([[Number(current[3])+1,'EN_COURS',new Date().toISOString()]]);count++;
    }finally{lock.releaseLock();}
    try{
      if(!item.result&&item.source==='VAPI')item=fetchCall_(item.call_id);
      const result=normalise_(item),finish=LockService.getScriptLock();finish.waitLock(5000);
      try{if(!rowForId_(sh_('Appels'),item.call_id))sh_('Appels').appendRow(toRow_(result));jobs.getRange(i+1,5,1,3).setValues([['TERMINE','','']]);jobs.getRange(i+1,3).setValue('');journal_('APPEL_CONSIGNE',item.call_id,result.state);}finally{finish.releaseLock();}
    }catch(err){
      const tries=Number(jobs.getRange(i+1,4).getValue()),next=new Date(Date.now()+Math.min(tries*60000,300000)).toISOString();
      jobs.getRange(i+1,5,1,3).setValues([[tries>=5?'ERREUR':'EN_ATTENTE',next,String(err.message||err).slice(0,200)]]);journal_('ERREUR_TRAITEMENT',row[0],String(err.message||err).slice(0,200));
    }
  }
}
function activerSynchronisation(){desactiverSynchronisation();ScriptApp.newTrigger('traiterFile').timeBased().everyMinutes(1).create();journal_('SYNCHRONISATION_ACTIVE','','Cadence approximative une minute');}
function desactiverSynchronisation(){ScriptApp.getProjectTriggers().filter(t=>t.getHandlerFunction()==='traiterFile').forEach(t=>ScriptApp.deleteTrigger(t));}
function exemple_(){return {call_id:'demo_'+Utilities.getUuid(),contact:{first_name:'Camille',last_name:'Exemple',company_name:'ESIEA — démonstration'},qualification:{need_summary:'Comprendre les champs du webhook dans le sujet 2.',authority_level:'Étudiant',timeline:'Pendant la séance',budget_confirmed:null,lead_status:'Nurturing'},call_metadata:{duration_seconds:90,full_summary:'EXEMPLE FICTIF. Explication de call_id, contact, qualification et call_metadata. L’étudiant confirme que sa question est résolue.',ai_transparency_accepted:true},support:{topic:'sujet_2',resolved:true,human_followup_requested:false,summary_confirmed:true}};}
function insererExempleFictif(){const b=exemple_(),a=normalise_({call_id:b.call_id,duration_seconds:b.call_metadata.duration_seconds,result:fromExpectedJson_(b),source:'TEST_FICTIF'});sh_('Appels').appendRow(toRow_(a));journal_('TEST_FICTIF',b.call_id,'Ne constitue pas une preuve d’appel vocal');}
