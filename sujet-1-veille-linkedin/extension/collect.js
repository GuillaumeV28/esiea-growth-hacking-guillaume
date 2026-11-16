// Fonction sérialisée et injectée uniquement sur la page de résultats ouverte par l'extension.
async function collectVisible({salt, known, limit}) {
  const wait=ms=>new Promise(r=>setTimeout(r,ms));
  const gate=()=> {
    if (/\/checkpoint|\/challenge|\/authwall|\/login|\/uas\//i.test(location.href)) return 'SESSION_OU_VERIFICATION';
    if (document.querySelector('iframe[src*="captcha"],iframe[src*="challenge"],#captcha-internal,.g-recaptcha')) return 'CAPTCHA';
    const top=[document.title,...Array.from(document.querySelectorAll('[role="alert"],[role="dialog"],.artdeco-inline-feedback,h1,h2')).map(x=>x.innerText)].join(' ');
    return /security verification|vérification de sécurité|verify your identity|vérifiez votre identité|account.{0,20}restricted|compte.{0,20}restreint|unusual activity|activité inhabituelle|automated activity|activité automatisée|temporarily blocked|temporairement bloqué|prove you.re human|confirmez que vous êtes humain/i.test(top)?'AVERTISSEMENT_OU_BLOCAGE':null;
  };
  if (!location.href.startsWith('https://www.linkedin.com/search/results/content/')) return {stop:gate() || 'PAGE_INATTENDUE',posts:[]};
  const first=gate(); if(first) return {stop:first,posts:[]};
  const hash=async value=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(salt+'|'+value)))).map(x=>x.toString(16).padStart(2,'0')).join('');
  // Pas de clic, de défilement, d'appel réseau ni d'ouverture de profil.
  const cards=[...document.querySelectorAll('[data-urn*="urn:li:activity:"],.feed-shared-update-v2')];
  const seen=new Set(known), posts=[];
  for(const card of cards) {
    if(posts.length>=limit) break;
    const warning=gate(); if(warning) return {stop:warning,posts:[]};
    const raw=card.getAttribute('data-urn') || card.querySelector('a[href*="activity-"]')?.href || '';
    const m=raw.match(/(?:urn:li:activity:|activity-)(\d{10,})/); if(!m) continue;
    const id='urn:li:activity:'+m[1]; if(seen.has(id)) continue; seen.add(id);
    const textNode=card.querySelector('.update-components-text,.feed-shared-update-v2__description,.feed-shared-text');
    if(!textNode?.innerText.trim()) continue;
    const actor=card.querySelector('.update-components-actor__meta-link,.feed-shared-actor__meta-link,a[href*="/in/"],a[href*="/company/"]');
    const actorKey=actor?.href?.split('?')[0] || actor?.innerText || '';
    const date=card.querySelector('.update-components-actor__sub-description,.feed-shared-actor__sub-description,time');
    // Retire le nom présent dans les métadonnées et conserve la ligne de date affichée.
    const relative=date?.innerText?.trim().split('\n').find(x=>/\d|maintenant|now/i.test(x)) || 'non disponible';
    const metric=selector=>card.querySelector(selector)?.innerText?.trim() || null;
    const truncated=!!card.querySelector('.feed-shared-inline-show-more-text__see-more-less-toggle,.inline-show-more-text__button') || /…\s*(plus|more)/i.test(textNode.innerText);
    posts.push({id,url:'https://www.linkedin.com/feed/update/'+id+'/',authorHash:actorKey?await hash(actorKey):null,text:textNode.innerText.trim(),relativeDate:relative,collectedAt:new Date().toISOString(),truncated,reactions:metric('.social-details-social-counts__reactions-count'),comments:metric('button[aria-label*="comment"]'),reposts:metric('button[aria-label*="repost"],button[aria-label*="republication"]')});
    await wait(350+Math.random()*650);
  }
  return {posts,stop:gate(),status:posts.length?'OK':cards.length?'AUCUN_NOUVEAU_POST':'VIDE_OU_SELECTEURS_A_ADAPTER'};
}
