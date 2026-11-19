"""Rendu local privé, voix Windows générique, dépôt Drive automatique.
Lancer une fois, puis déclencher depuis la Sheet. Aucun service payant.
"""
from __future__ import annotations
import argparse,base64,io,json,math,re,subprocess,time,wave,hashlib
from pathlib import Path
from urllib.parse import urlsplit
import requests
from pypdf import PdfReader
from PIL import Image,ImageDraw,ImageFont
import imageio_ffmpeg

BASE=Path(__file__).resolve().parent
FFMPEG=imageio_ffmpeg.get_ffmpeg_exe()
BLEU='#2563eb';FOND='#f7f9fc';NOIR='#162033';GRIS='#526079'

def commande(args):
    p=subprocess.run([str(x) for x in args],capture_output=True,text=True,encoding='utf-8',errors='replace')
    if p.returncode: raise RuntimeError('Échec du rendu : '+p.stderr[-900:])
    return p

class Serveur:
    def __init__(self,fichier):
        c=json.loads(Path(fichier).read_text(encoding='utf-8-sig'));self.url=c['url'];self.token=c['token']
        if not re.fullmatch(r'https://script\.google\.com/macros/s/[A-Za-z0-9_-]+/exec',self.url) or len(self.token)<40:
            raise ValueError('Connexion privée invalide. Exporter le fichier depuis le menu Vidéos IA.')
        self.session=requests.Session()
    def appel(self,action,**v):
        # Aucun secret dans les URL ni dans les messages de diagnostic.
        try:
            r=self.session.post(self.url,json={'token':self.token,'action':action,**v},timeout=240)
            r.raise_for_status();a=r.json()
        except requests.RequestException as e: raise RuntimeError('Connexion au point de réception impossible. Vérifier le déploiement et la connexion Internet.') from None
        except ValueError: raise RuntimeError('Le serveur ne retourne pas du JSON. Vérifier le déploiement /exec et son accès au moteur.') from None
        if not a.get('ok'):raise RuntimeError(a.get('error','Erreur du serveur'))
        return a

def extraire(data):
    reader=PdfReader(io.BytesIO(data))
    return '\n'.join(p.extract_text() or '' for p in reader.pages).strip()

def professionnel(texte):
    lignes=[]
    for ligne in texte.splitlines():
        if re.search(r'[\w.+-]+@[\w.-]+\.[a-z]{2,}|(?:\+33|0)[1-9](?:[ .-]?\d{2}){4}|linkedin\.com|https?://',ligne,re.I):continue
        lignes.append(ligne)
    return '\n'.join(lignes)[:30000]

def police(taille,gras=False):
    candidates=[Path('C:/Windows/Fonts')/('arialbd.ttf' if gras else 'arial.ttf'),Path('/usr/share/fonts/truetype/dejavu')/('DejaVuSans-Bold.ttf' if gras else 'DejaVuSans.ttf')]
    for p in candidates:
        if p.exists():return ImageFont.truetype(str(p),taille)
    raise RuntimeError('Police Arial ou DejaVu Sans introuvable.')

def lignes(texte,font,largeur):
    mots=texte.split();out=[];current=''
    for mot in mots:
        test=(current+' '+mot).strip()
        if font.getlength(test)>largeur and current:out.append(current);current=mot
        else:current=test
    if current:out.append(current)
    return out

def ecrire(draw,xy,texte,font,couleur,largeur,interligne=1.25,max_lignes=None):
    ls=lignes(texte,font,largeur)
    if max_lignes and len(ls)>max_lignes:raise ValueError('Texte trop long pour la vidéo : '+texte[:70])
    x,y=xy
    for ligne in ls:draw.text((x,y),ligne,font=font,fill=couleur);y+=round(font.size*interligne)
    return y

def illustration(path):
    im=Image.new('RGB',(700,700),FOND);d=ImageDraw.Draw(im)
    for r in [290,230,170]:d.ellipse((350-r,350-r,350+r,350+r),outline='#dbe6ff',width=3)
    d.polygon([(350,140),(510,205),(485,395),(350,520),(215,395),(190,205)],fill=BLEU)
    d.line([(270,320),(330,380),(435,265)],fill='white',width=25)
    d.rounded_rectangle((140,560,560,625),radius=20,fill='white',outline='#dce4f2',width=2)
    d.text((350,590),'PARCOURS • PREUVES • PROJET',font=police(18,True),fill=NOIR,anchor='mm')
    im.save(path)

def cadre(scene,scenario,sous_titre,index,dest,art):
    im=Image.new('RGB',(1280,720),FOND);d=ImageDraw.Draw(im)
    d.rectangle((0,0,1280,8),fill='#dce5f6');d.rectangle((0,0,256*(index+1),8),fill=BLEU)
    d.text((66,48),'CANDIDATURE PERSONNALISÉE',font=police(18,True),fill=BLEU)
    d.text((1208,48),f'{index+1:02d} / 05',font=police(18),fill=GRIS,anchor='ra')
    title=scenario['nom'] if index==0 else scene['titre_ecran']
    y=ecrire(d,(64,113),title,police(49,True),NOIR,760,1.15,3)
    if index==0:
        cible=scenario['poste']+(' — '+scenario['entreprise'] if scenario.get('entreprise') else '')
        y=ecrire(d,(64,y+20),cible,police(25),BLEU,750,1.2,4)
    else:y=ecrire(d,(64,y+25),scene['resume_ecran'],police(27),GRIS,750,1.3,4)
    for k,mot in enumerate(scene['mots_cles_ecran']):
        yy=385+k*48
        d.rounded_rectangle((64,yy,750,yy+39),radius=8,fill='white',outline='#dce4f2')
        d.ellipse((79,yy+13,91,yy+25),fill=BLEU)
        ecrire(d,(106,yy+6),mot,police(22,True),NOIR,625,1.1,1)
    pict=Image.open(art).resize((360,360));im.paste(pict,(865,170))
    # Bandeau synchronisé par scène ; changements internes estimés par longueur.
    d.rounded_rectangle((40,568,1240,680),radius=13,fill=NOIR)
    ls=lignes(sous_titre,police(29),1120)
    if len(ls)>2:raise ValueError('Sous-titre trop long : réduire les groupes de mots.')
    for k,ligne in enumerate(ls):d.text((640,595+k*35),ligne,font=police(29),fill='white',anchor='ma')
    d.text((64,694),'Voix synthétique générique • Faits issus des documents fournis',font=police(14),fill=GRIS)
    im.save(dest)

def segments_sous_titres(texte):
    mots=texte.split();chunks=[];cur=[]
    for mot in mots:
        if len(' '.join(cur+[mot]))>100 and cur:chunks.append(' '.join(cur));cur=[]
        cur.append(mot)
    if cur:chunks.append(' '.join(cur))
    return chunks

def format_srt(t):
    millis=round(t*1000);h,millis=divmod(millis,3600000);m,millis=divmod(millis,60000);s,millis=divmod(millis,1000)
    return f'{h:02}:{m:02}:{s:02},{millis:03}'

def rendre(scenario,dossier):
    dossier=Path(dossier);dossier.mkdir(parents=True,exist_ok=True);art=dossier/'illustration.png';illustration(art)
    (dossier/'scenario.json').write_text(json.dumps(scenario,ensure_ascii=False,indent=2),encoding='utf-8')
    scenes=scenario['scenes'];mots=sum(len(s['texte_voix_off'].split()) for s in scenes)
    if len(scenes)!=5 or not 120<=mots<=145:raise ValueError('Le scénario doit compter 5 scènes et 120 à 145 mots.')
    durations=[];wavs=[]
    for i,s in enumerate(scenes):
        txt=dossier/f'voix_{i}.txt';wav=dossier/f'voix_{i}.wav';txt.write_text(s['texte_voix_off'],encoding='utf-8')
        commande(['powershell.exe','-NoProfile','-ExecutionPolicy','Bypass','-File',BASE/'parler.ps1','-Texte',txt.resolve(),'-Sortie',wav.resolve()])
        with wave.open(str(wav),'rb') as w:durations.append(w.getnframes()/w.getframerate())
        wavs.append(wav)
    raw=sum(durations);target=54.0;tempo=raw/target
    if not .5<=tempo<=2:raise ValueError('Vitesse vocale anormale. Choisir une voix française Windows standard.')
    (dossier/'audio_concat.txt').write_text('\n'.join("file '"+p.name+"'" for p in wavs),encoding='utf-8')
    audio=dossier/'voix.wav'
    commande([FFMPEG,'-y','-f','concat','-safe','0','-i',dossier/'audio_concat.txt','-af',f'atempo={tempo:.8f}','-ar','44100','-ac','1',audio])
    entries=[];srt=[];cursor=0;counter=0
    for i,s in enumerate(scenes):
        scene_duration=durations[i]/tempo;chunks=segments_sous_titres(s['texte_voix_off']);weight=sum(len(t) for t in chunks)
        for j,chunk in enumerate(chunks):
            duration=scene_duration*len(chunk)/weight;png=dossier/f'image_{i}_{j}.png'
            cadre(s,scenario,chunk,i,png,art);entries.extend(["file '"+png.name+"'",f'duration {duration:.8f}'])
            counter+=1;srt.append(f'{counter}\n{format_srt(cursor)} --> {format_srt(cursor+duration)}\n{chunk}\n');cursor+=duration
    entries.append(entries[-2]);(dossier/'images.txt').write_text('\n'.join(entries),encoding='utf-8');(dossier/'sous_titres.srt').write_text('\n'.join(srt),encoding='utf-8')
    video=dossier/'pitch.mp4'
    commande([FFMPEG,'-y','-f','concat','-safe','0','-i',dossier/'images.txt','-i',audio,'-t',str(target),'-vf','fps=24,format=yuv420p','-c:v','libx264','-preset','fast','-crf','24','-c:a','aac','-b:a','96k','-movflags','+faststart',video])
    gif=dossier/'apercu.gif'
    commande([FFMPEG,'-y','-i',video,'-vf',"select='not(mod(n,240))',setpts=N/(2*TB),scale=480:-1:flags=lanczos",'-r','2','-loop','0',gif])
    # Lecture de l'audio réellement rendu, pas une estimation du nombre de mots.
    with wave.open(str(audio),'rb')as w:actual=w.getnframes()/w.getframerate()
    if not 45<=actual<=60:raise RuntimeError('Durée audio hors consigne.')
    if video.stat().st_size>13500000:raise RuntimeError('Vidéo trop volumineuse pour Apps Script.')
    report={'mots':mots,'duree_audio_sec':round(actual,3),'duree_video_sec':target,'audio_original_sec':round(raw,3),'facteur_tempo':tempo,'mp4_octets':video.stat().st_size,'sha256':hashlib.sha256(video.read_bytes()).hexdigest(),'voix':'Synthèse Windows française locale, générique, non clonée','sous_titres':'Synchronisés par scène, répartition interne estimée'}
    (dossier/'verification.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
    return video,gif,report

def traiter(serveur,job,racine):
    d=racine/job['id'];d.mkdir(parents=True,exist_ok=True);identite={'id':job['id'],'lease':job['lease']}
    try:
        textes=[]
        for i,pdf in enumerate(job['pdfs'],1):
            data=base64.b64decode(pdf['data'],validate=True);(d/f'source_{i}.pdf').write_bytes(data);txt=extraire(data)
            if len(txt)<100:
                print('PDF scanné : tentative OCR Google Drive.')
                txt=serveur.appel('ocr',**identite,source=i)['text']
            txt=professionnel(txt)
            if len(txt)<100:raise ValueError(f'Source {i} illisible, fournir un PDF texte ou un scan net.')
            textes.append(txt)
        art=d/'illustration.png';illustration(art)
        print('Extraction terminée. Génération IA et présentation…')
        a=serveur.appel('script',**identite,sources=textes,asset=base64.b64encode(art.read_bytes()).decode('ascii'))
        (d/'presentation.pdf').write_bytes(base64.b64decode(a['pdf']))
        if a.get('presentation'):
            (d/'presentation.json').write_text(json.dumps(a['presentation'],ensure_ascii=False),encoding='utf-8')
        print('Voix locale et rendu vidéo…')
        video,gif,rapport=rendre(a['scenario'],d)
        print('Dépôt automatique dans Drive…')
        payload={**identite,'duration':rapport['duree_audio_sec'],'video':base64.b64encode(video.read_bytes()).decode('ascii'),'gif':base64.b64encode(gif.read_bytes()).decode('ascii')}
        # Le dépôt est idempotent : reprise réseau sans créer une seconde vidéo.
        try:final=serveur.appel('finish',**payload)
        except RuntimeError:final=serveur.appel('finish',**payload)
        (d/'liens_prives.json').write_text(json.dumps(final,ensure_ascii=False,indent=2),encoding='utf-8')
        print('TERMINÉ : lien écrit dans le tableau. Durée :',rapport['duree_audio_sec'],'secondes.')
        return True
    except Exception as e:
        msg=str(e).replace(serveur.token,'[JETON_MASQUÉ]')[:250]
        try:serveur.appel('fail',**identite,message=msg)
        except Exception:pass
        print('ERREUR :',msg);return False

def main():
    p=argparse.ArgumentParser();p.add_argument('--connexion',default=str(BASE/'configuration_privee.json'));p.add_argument('--minutes',type=int,default=60);p.add_argument('--une-fois',action='store_true');p.add_argument('--scenario-local');p.add_argument('--sortie',default=str(BASE/'rendus'));args=p.parse_args();racine=Path(args.sortie)
    if args.scenario_local:
        a=json.loads(Path(args.scenario_local).read_text(encoding='utf-8'));v,g,r=rendre(a,racine);print(json.dumps(r,ensure_ascii=False));return
    serveur=Serveur(args.connexion);fin=time.monotonic()+max(1,min(180,args.minutes))*60
    print('Moteur prêt. Laisser cette fenêtre ouverte puis utiliser Vidéos IA > Générer la ligne sélectionnée dans le tableau.')
    while time.monotonic()<fin:
        try:job=serveur.appel('claim')['job']
        except RuntimeError as e:print(str(e));return
        if job:traiter(serveur,job,racine)
        if args.une_fois:return
        time.sleep(5)
    print('Session terminée. Relancer le moteur pour de nouvelles vidéos.')

if __name__=='__main__':main()
