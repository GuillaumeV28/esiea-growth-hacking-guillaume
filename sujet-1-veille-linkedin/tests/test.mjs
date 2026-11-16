import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {validate,searchUrl,dayKey,inWindow,nextDue,canonicalId,detectStop} from '../extension/core.mjs';
const c={keywords:['NIS2 AND compétences'],batch:4,daily:20,intervalMinutes:120,jitterMinutes:20,startHour:9,endHour:18,sessionEnd:'2027-02-08T18:00:00+01:00',filterSuffix:''};
test('guillemets, espaces et accents sont encodés sans altérer la requête',()=>{
 const u=searchUrl('"mission de conseil" AND sécurité');assert.match(u,/%22mission%20de%20conseil%22/);assert.equal(new URL(u).searchParams.get('keywords'),'"mission de conseil" AND sécurité');
});
test('plafonds stricts et configuration invalide refusés',()=>{
 assert.equal(validate(c),c);
 for(const bad of [{daily:21},{batch:5},{batch:2.5},{intervalMinutes:5},{keywords:[]},{sessionEnd:''},{startHour:18,endHour:9},{filterSuffix:'&keywords=autre'}])assert.throws(()=>validate({...c,...bad}));
});
test('fuseau Paris, fenêtre et fin de séance',()=>{
 assert.equal(dayKey(new Date('2027-02-08T23:30:00Z')),'2027-02-09');
 assert.equal(inWindow(c,Date.parse('2027-02-08T08:00:00Z')),true);
 assert.equal(inWindow(c,Date.parse('2027-02-08T07:59:00Z')),false);
 assert.equal(inWindow(c,Date.parse('2027-02-08T17:00:00Z')),false);
 assert.equal(inWindow({...c,sessionEnd:'2027-02-08T10:00:00+01:00'},Date.parse('2027-02-08T09:00:00Z')),false);
});
test('variation de cadence bornée et aucune échéance après fin',()=>{
 const now=Date.parse('2027-02-08T09:00:00Z');
 assert.equal(nextDue(c,now,()=>0)-now,100*60000);
 assert.equal(nextDue(c,now,()=>1)-now,140*60000);
 assert.equal(nextDue(c,Date.parse('2027-02-08T16:00:00Z'),()=>0),null);
});
test('identifiants canoniques et garde de blocage',()=>{
 assert.equal(canonicalId('https://www.linkedin.com/posts/example-activity-1234567890123-abcd'),'urn:li:activity:1234567890123');
 assert.equal(canonicalId('profil'),null);
 assert.equal(detectStop('https://www.linkedin.com/checkpoint/challenge',''),'SESSION_OU_VERIFICATION');
 assert.equal(detectStop('https://www.linkedin.com/search/results/content/','Activité inhabituelle'),'AVERTISSEMENT_OU_BLOCAGE');
 assert.equal(detectStop('https://www.linkedin.com/search/results/content/','',true),'CAPTCHA');
});
function collectorContext(cards=[],opts={}) {
 const ctx={crypto:globalThis.crypto,TextEncoder,Uint8Array,setTimeout:fn=>fn(),location:{href:opts.url||'https://www.linkedin.com/search/results/content/?keywords=cyber'},document:{title:opts.title||'Recherche',querySelector:()=>opts.captcha?{}:null,querySelectorAll:sel=>sel.includes('[data-urn')?cards:[]}};
 vm.createContext(ctx);vm.runInContext(fs.readFileSync(new URL('../extension/collect.js',import.meta.url),'utf8'),ctx);return ctx;
}
const card=(id='1234567890123')=>({getAttribute:()=>`urn:li:activity:${id}`,querySelector:sel=>sel.startsWith('.update-components-text')?{innerText:'Nous cherchons une formation cybersécurité'}:sel.startsWith('.update-components-actor__meta')?{href:'https://www.linkedin.com/in/nom-prive?x=1'}:sel.startsWith('.update-components-actor__sub')?{innerText:'2 j •'}:null});
test('collecte simulée : hachage avant retour, date, métriques inconnues et déduplication',async()=>{
 const ctx=collectorContext([card(),card(),card('1234567890124')]);
 const r=await ctx.collectVisible({salt:'sel-test',known:['urn:li:activity:1234567890124'],limit:4});
 assert.equal(r.posts.length,1);assert.match(r.posts[0].authorHash,/^[a-f0-9]{64}$/);assert.equal(JSON.stringify(r).includes('nom-prive'),false);assert.equal(r.posts[0].reactions,null);assert.equal(r.posts[0].relativeDate,'2 j •');
 const again=await ctx.collectVisible({salt:'sel-test',known:[r.posts[0].id,'urn:li:activity:1234567890124'],limit:4});assert.equal(again.posts.length,0);
});
test('collecte simulée : plafond de lot et arrêt CAPTCHA avant lecture',async()=>{
 const ctx=collectorContext([card(),card('1234567890124')]);assert.equal((await ctx.collectVisible({salt:'x',known:[],limit:1})).posts.length,1);
 const blocked=collectorContext([card()],{captcha:true});const r=await blocked.collectVisible({salt:'x',known:[],limit:4});assert.equal(r.stop,'CAPTCHA');assert.equal(r.posts.length,0);
});
test('collecte simulée : texte tronqué marqué et aucun clic disponible',async()=>{
 const a=card(),old=a.querySelector;a.querySelector=sel=>sel.startsWith('.feed-shared-inline')?{}:old(sel);
 const r=await collectorContext([a]).collectVisible({salt:'x',known:[],limit:4});assert.equal(r.posts[0].truncated,true);
});
function appsContext() {
 const store={TOKEN:'secret-test'},data={Posts:[['id']],Journal:[['date','event','detail']]};
 const sheet=name=>({getLastRow:()=>data[name].length,getRange:(row,col,n=1,w=1)=>({getValues:()=>data[name].slice(row-1,row-1+n).map(x=>x.slice(col-1,col-1+w)),setNumberFormat(){return this;},setValues(values){values.forEach((v,i)=>{data[name][row-1+i] ||= [];v.forEach((x,j)=>data[name][row-1+i][col-1+j]=x);});return this;},setValue(v){return this.setValues([[v]]);}}),appendRow:r=>data[name].push(r),getDataRange:()=>({getValues:()=>data[name]})});
 const ctx={PropertiesService:{getScriptProperties:()=>({getProperty:k=>store[k]||null})},ContentService:{MimeType:{JSON:'json'},createTextOutput:t=>({setMimeType:()=>JSON.parse(t)})},SpreadsheetApp:{openById:()=>({getSheetByName:sheet}),flush(){}},LockService:{getScriptLock:()=>({waitLock(){},tryLock:()=>true,releaseLock(){}})}};
 store.SHEET_ID='fake';vm.createContext(ctx);vm.runInContext(fs.readFileSync(new URL('../google-apps-script/Code.gs',import.meta.url),'utf8'),ctx);return {ctx,data,store};
}
const post={id:'urn:li:activity:1234567890123',text:'=IMPORTXML("url")',authorHash:'a'.repeat(64),collectedAt:'2027-02-08T10:00:00Z',relativeDate:'2 j',truncated:false};
test('réception Apps Script : jeton, idempotence, injection de formule et absence de clé IA',()=>{
 const {ctx,data}=appsContext(),send=b=>ctx.doPost({postData:{contents:JSON.stringify(b)}});
 assert.equal(send({token:'wrong',action:'append',posts:[post]}).ok,false);assert.equal(data.Posts.length,1);
 assert.equal(send({token:'secret-test',action:'append',posts:[post]}).inserted,1);
 assert.equal(send({token:'secret-test',action:'append',posts:[post]}).inserted,0);
 assert.equal(data.Posts.length,2);assert.equal(data.Posts[1][5].startsWith("'="),true);assert.equal(data.Posts[1][16],'EN_ATTENTE');
});
test('réception Apps Script : auteur en clair refusé sans enregistrement',()=>{
 const {ctx,data}=appsContext();const r=ctx.doPost({postData:{contents:JSON.stringify({token:'secret-test',action:'append',posts:[{...post,authorHash:'Jean Dupont'}]})}});assert.equal(r.ok,false);assert.equal(data.Posts.length,1);
});
test('IA : une ligne OK est ignorée et une sortie invalide passe en erreur',()=>{
 const {ctx,data,store}=appsContext();store.GEMINI_API_KEY='fake';store.GEMINI_MODEL='test-model';
 const row=Array(17).fill('');row[0]=post.id;row[5]='Formation recherchée';row[16]='OK';data.Posts.push([...row]);
 let calls=0;ctx.analyse_=()=>{calls++;return ['formation','demander_aide',3,'besoin explicite','Recherche de formation','OK'];};ctx.classerNouveaux();assert.equal(calls,0);
 row[16]='EN_ATTENTE';data.Posts.push([...row]);ctx.classerNouveaux();assert.equal(calls,1);assert.equal(data.Posts[2][16],'OK');ctx.classerNouveaux();assert.equal(calls,1);
 row[16]='EN_ATTENTE';data.Posts.push([...row]);ctx.analyse_=()=>{throw Error('JSON invalide');};ctx.classerNouveaux();assert.equal(data.Posts[3][16],'ERREUR');
});
function backgroundContext(overrides={}) {
 const state={config:c,endpoint:'https://script.google.com/macros/s/test/exec',token:'test',salt:'test',seen:[],pending:[],logs:[],enabled:true,cursor:0,...overrides};
 const alarms=new Map(),requests=[];let tabLoads=0,limit;
 const chrome={storage:{local:{get:async()=>structuredClone(state),set:async v=>Object.assign(state,structuredClone(v)),remove:async k=>{delete state[k];}}},alarms:{clearAll:async()=>alarms.clear(),create:async(k,v)=>alarms.set(k,v),getAll:async()=>[...alarms],onAlarm:{addListener(){}}},runtime:{id:'fake',getURL:p=>'chrome-extension://fake/'+p,onInstalled:{addListener(){}},onStartup:{addListener(){}},onMessage:{addListener(){}}},tabs:{create:async()=>{tabLoads++;return{id:1};},get:async()=>({status:'complete',url:'https://www.linkedin.com/search/results/content/'}),remove:async()=>{}},scripting:{executeScript:async o=>{if(o.files)return [];limit=o.args[0].limit;return [{result:{posts:[{...post,text:'formation',url:'https://www.linkedin.com/feed/update/'+post.id+'/'}],status:'OK'}}];}}};
 const ctx={chrome,console,crypto:globalThis.crypto,setTimeout:fn=>fn(),AbortSignal,Date,validate,searchUrl,dayKey,inWindow:()=>true,nextDue:()=>Date.now()+120000,detectStop,fetch:async(url,options)=>{const b=JSON.parse(options.body);requests.push(b);return {ok:true,json:async()=>b.action==='config'?{ok:true,config:c}:{ok:true}};}};
 vm.createContext(ctx);let code=fs.readFileSync(new URL('../extension/background.js',import.meta.url),'utf8').replace(/^import .*\n/,'');vm.runInContext(code,ctx);
 return {ctx,state,alarms,requests,loads:()=>tabLoads,limit:()=>limit};
}
test('planification : arrêt verrouillé persistant et suppression de toutes les alarmes',async()=>{
 const {ctx,state,alarms}=backgroundContext();alarms.set('collect',{});alarms.set('end',{});
 await ctx.stop('CAPTCHA',true);assert.equal(state.enabled,false);assert.equal(state.blocked,true);assert.equal(alarms.size,0);
 await ctx.stop('FIN_DE_SEANCE');assert.equal(state.blocked,true);
 await ctx.schedule();assert.equal(alarms.size,0);await assert.rejects(()=>ctx.run(true),/ARRET_VERROUILLE/);
});
test('orchestration : un chargement, plafond restant, stockage et synchronisation',async()=>{
 const b=backgroundContext({day:dayKey(),used:19});await b.ctx.run(true);
 assert.equal(b.loads(),1);assert.equal(b.limit(),1);assert.equal(b.state.used,20);assert.equal(b.state.seen.length,1);assert.equal(b.state.pending.length,0);
 assert.equal(b.requests.filter(x=>x.action==='append').length,1);assert.equal(b.alarms.has('collect'),true);
 await b.ctx.run(true);assert.equal(b.loads(),1);assert.equal(b.state.enabled,false);assert.equal(b.alarms.size,0);
});
test('reprise réseau : file conservée, arrêt puis renvoi sans visiter LinkedIn',async()=>{
 const b=backgroundContext();b.ctx.fetch=async(url,options)=>{
   if(JSON.parse(options.body).action==='config')return {ok:true,json:async()=>({ok:true,config:c})};throw Error('Réseau coupé');
 };
 await assert.rejects(()=>b.ctx.run(true),/Réseau coupé/);assert.equal(b.state.pending.length,1);assert.equal(b.state.seen.length,1);assert.equal(b.state.enabled,false);assert.equal(b.alarms.size,0);
 b.ctx.fetch=async()=>({ok:true,json:async()=>({ok:true})});await b.ctx.flush();assert.equal(b.state.pending.length,0);assert.equal(b.loads(),1);
});
