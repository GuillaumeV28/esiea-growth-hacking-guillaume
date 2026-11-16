export function validate(c) {
  if (!Array.isArray(c.keywords) || !c.keywords.length || c.keywords.some(x => typeof x !== 'string' || !x.trim())) throw Error('Mots-clés manquants');
  for (const [k,min,max] of [['batch',1,4],['daily',1,20],['intervalMinutes',30,1440],['jitterMinutes',0,20],['startHour',0,23],['endHour',1,24]]) {
    if (!Number.isFinite(c[k]) || c[k]<min || c[k]>max) throw Error('Paramètre invalide : '+k);
  }
  if (c.startHour>=c.endHour || c.jitterMinutes>=c.intervalMinutes) throw Error('Fenêtre ou intervalle invalide');
  if (![c.batch,c.daily,c.startHour,c.endHour].every(Number.isInteger)) throw Error('Les volumes et heures doivent être entiers');
  if (!Number.isFinite(Date.parse(c.sessionEnd))) throw Error('Fin de séance requise');
  if (c.filterSuffix && !/^(&[a-zA-Z][a-zA-Z0-9]*=[^&#]*)+$/.test(c.filterSuffix)) throw Error('Suffixe de filtres invalide');
  if (/&keywords=/i.test(c.filterSuffix || '')) throw Error('Ne pas inclure keywords dans les filtres');
  return c;
}
export const searchUrl = (keywords, suffix='') => 'https://www.linkedin.com/search/results/content/?keywords='+encodeURIComponent(keywords)+suffix;
export function dayKey(date=new Date()) { return new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Paris',year:'numeric',month:'2-digit',day:'2-digit'}).format(date); }
export function inWindow(c, time=Date.now()) {
  const hour=Number(new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Paris',hour:'numeric',hourCycle:'h23'}).format(new Date(time)));
  return hour>=c.startHour && hour<c.endHour && time<Date.parse(c.sessionEnd);
}
export function nextDue(c, now=Date.now(), random=Math.random) {
  const t=now+Math.max(1,c.intervalMinutes+(random()*2-1)*c.jitterMinutes)*60000;
  // Si l'échéance sort de la fenêtre, ne pas reporter au lendemain : cette séance s'arrête.
  return inWindow(c,t)?t:null;
}
export function canonicalId(raw) {
  const s=String(raw || '');
  const m=s.match(/(?:urn:li:activity:|activity-|\/activities\/)(\d{10,})/);
  return m ? 'urn:li:activity:'+m[1] : null;
}
export function detectStop(url, text, challenge=false) {
  if (/\/checkpoint|\/challenge|\/authwall|\/login|\/uas\//i.test(url)) return 'SESSION_OU_VERIFICATION';
  if (challenge) return 'CAPTCHA';
  if (/security verification|vérification de sécurité|verify your identity|vérifiez votre identité|account.{0,20}restricted|compte.{0,20}restreint|unusual activity|activité inhabituelle|automated activity|activité automatisée|temporarily blocked|temporairement bloqué|prove you.re human|confirmez que vous êtes humain/i.test(text)) return 'AVERTISSEMENT_OU_BLOCAGE';
  return null;
}
