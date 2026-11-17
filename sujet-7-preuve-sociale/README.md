# Sujet 7 — Agent de recommandation LinkedIn

Projet pédagogique de Guillaume Voisine. **Option A**, acteur recommandé : **ESIEA**. Mode B : notification Discord, décision humaine, publication manuelle sur LinkedIn. Aucun compte fictif, cookie exporté, message privé ou robot de publication.

## État réel du rendu

- Tableau privé à six onglets installé sur le compte Guillaume ; réception protégée déployée en version 3 et testée.
- Gemini gratuit configuré et testé réellement avec `gemini-3.5-flash-lite`, sans activation de facturation.
- 15 publications uniques analysées par Gemini : 17 captures, dont deux versions remplacées après relecture complète. Les 13 autres restent des extraits incomplets, donc en revue humaine ; ce ne sont pas 15 textes complets.
- Une recommandation générée, reçue dans le serveur Discord privé. Son portail signé s’ouvre avec l’état A_VALIDER ; aucune approbation réelle ni publication LinkedIn n’a été effectuée.
- 22 tests locaux réussis, 0 échec, sur services simulés. Ils complètent les tests réels, sans les remplacer.
- Traitement activé avec limites quotidiennes et attente persistante en cas de limitation Discord. Les anciennes erreurs de configuration et indisponibilités restent visibles dans le journal (7 erreurs historiques sur 24 h au contrôle).
- Restent : décision humaine sur la proposition, test de l’extension dans Chrome et vidéo de 3 à 5 minutes. Aucune publication automatique LinkedIn.

## Fichiers

| Fichier | Usage |
|---|---|
| `Code.gs` | Six onglets, déduplication, qualification, génération, décisions, quotas et tableau de bord |
| `Sources.gs` | Import idempotent de 15 extraits réels, tous marqués incomplets |
| `extension/` | Extension Chrome : sélection de texte, lien du post, envoi au tableau |
| `SCHEMA_FONCTIONNEL.svg` | Schéma du flux de données |
| `TUTO_VIDEO_4_MIN.md` | Texte à dire et gestes à l’écran |
| `tests/test.mjs` | Vérifications locales sans réseau ni secret |
| `VERIFICATION.md` | Résultats observés et étapes restant à tester |

## Installation pas à pas

1. Ouvrir Google Sheets avec **voisine.guillaume@gmail.com**. Créer un nouveau tableur, puis Extensions → Apps Script. Conserver ce projet séparé des sujets 1 et 2.
2. Coller `Code.gs` dans Code.gs. Ajouter un fichier `Sources.gs` et y coller le second fichier. Enregistrer. Exécuter `installer`, examiner les autorisations Google et vérifier le compte du développeur. Le script crée exactement CONFIG, PROFIL_AMBASSADEUR, PROMPTS, VEILLE_POSTS, JOURNAL_LOGS et DASHBOARD.
3. Exécuter `importerSourcesReelles`. Vérifier les 15 liens et les mentions `Texte_Tronque=true`, `A_QUALIFIER`. Cet import ne lance pas Gemini et ne publie rien.
4. Dans Paramètres du projet → Propriétés du script, renseigner **GEMINI_API_KEY**, **DISCORD_WEBHOOK** et, après déploiement, **WEBAPP_URL**. Les valeurs réelles ne doivent jamais aller dans CONFIG, le dépôt, les vidéos ou le prompt. `installer` génère SHEET_ID, INGEST_TOKEN, AUTHOR_SALT et SIGNING_SECRET.
5. Dans [Google AI Studio](https://aistudio.google.com/api-keys), utiliser un projet éligible au quota gratuit. Une clé valide ne garantit pas un quota de génération disponible. Le prototype propose `gemini-3.5-flash-lite` ; ajuster GEMINI_MODEL dans CONFIG à un modèle effectivement disponible. Le sujet mentionne Gemini 1.5 Flash : sa disponibilité n’est pas présumée. Ne pas activer de facturation pour simplement contourner un échec. HTTP 402/403/429 provoque l’arrêt.
6. Dans Discord, utiliser un serveur et un salon de test privés dont vous avez la gestion. Paramètres du salon → Intégrations → Webhooks → Nouveau webhook → Copier l’URL. La création du compte, si nécessaire, reste à faire par son titulaire. Ajouter l’URL privée à DISCORD_WEBHOOK. Pas de Make, Zapier ou n8n.
7. Déployer → Nouveau déploiement → Application Web, exécution en tant que propriétaire. L’accès doit permettre à l’extension et aux liens Discord de fonctionner sans connexion Google. Le backend protège l’import par jeton et les décisions par signature à durée limitée. Ajouter l’URL `/exec` à WEBAPP_URL. Les changements de code exigent une nouvelle version du déploiement ; les propriétés privées n’exigent pas de redéploiement.
8. Dans Chrome, ouvrir `chrome://extensions`, activer le mode développeur et Charger l’extension non empaquetée → dossier `extension`. Dans sa section Connexion privée : URL `/exec` et INGEST_TOKEN. Ce jeton est stocké dans le profil Chrome local, pas chiffré par l’extension ; ne pas utiliser un ordinateur partagé. Aucun mot de passe LinkedIn demandé.
9. Ouvrir un **post public récent**, copier son lien via le menu du post et sélectionner son texte complet. Dans l’extension, Extraire le texte sélectionné, vérifier le lien et la date. Cocher la confirmation de texte complet seulement après vérification. Envoyer. Aucun profil n’est ouvert automatiquement, aucune navigation ou publication répétitive n’est effectuée.
10. Vérifier le profil ESIEA. Le lien déclaré est : « je suis étudiant à l’ESIEA, sans mandat commercial ni témoignage client ». Les compétences s’appuient sur la [page officielle des formations spécialisées](https://www.esiea.fr/formations-specialisees/). Aucune mission de formateur freelance, disponibilité, prestation cloud, éligibilité financière ou certification supplémentaire n’est déduite de cette page.
11. Exécuter `activer`. Un déclencheur traite au maximum trois posts par lot, avec budget de 230 secondes, verrou et bail de tâche. Pour 15 extraits, compter plusieurs passages. La clé et le quota Gemini doivent fonctionner. Les extraits incomplets sont analysables mais restent en REVUE_HUMAINE et ne déclenchent pas de génération/publication.
12. Pour les contenus complets compatibles, score >=70 et sans refus ni ambiguïté : génération, notification Discord puis décision. Sur le portail, **Approuver & préparer la publication** change l’état en APPROUVE. Copier le commentaire, ouvrir le post, relire, puis publier soi-même sur LinkedIn. Après vérification, cliquer sur la confirmation manuelle. `PUBLIE_DECLARE` est une déclaration de l’opérateur, pas une confirmation fournie par l’API LinkedIn.

Pour revenir sur une erreur après correction de la clé ou du modèle : exécuter `reprendreErreurs`, puis `activer`. Un refus humain ou une recommandation remplacée n’est pas automatiquement repris. Pour relire un extrait complet, le renvoyer avec le même lien et le texte complet : une nouvelle révision est créée, l’ancienne est invalidée.

## Architecture et réponses aux cinq questions

### 1. Anti-spam et variation de style

Le prompt demande un conseil utile au besoin concret, puis une invitation mesurée à examiner l’offre vérifiée. Les trois derniers commentaires sont fournis au modèle. Une similarité de Jaccard >=0,82 entre mots significatifs bloque les quasi-doublons. La variation ne sert pas à contourner une détection : aucun procédé ne garantit l’absence de classement comme spam ou le respect des règles de LinkedIn. Le mode retenu repose sur une collecte sélectionnée et la décision humaine. Les affirmations d’expérience vécue, liens, tags, promesses et termes interdits sont filtrés. La relation avec l’ESIEA est ajoutée par le serveur, en dehors du texte généré.

### 2. Kill switch et limitation du volume

CONFIG.ACTIF est relu avant les appels IA et les réservations d’actions. `arreter` met ce champ à false sous verrou et supprime les déclencheurs de traitement. Trois erreurs consécutives ou une erreur Gemini HTTP 402/403/429 déclenchent l’arrêt. Un appel HTTP déjà parti ne peut pas être annulé ; son résultat ne déclenche pas de nouvelle notification après arrêt. Une publication manuelle déjà faite sur LinkedIn ne peut pas être annulée par ce switch.

Les compteurs privés sont persistants, datés en Europe/Paris et réservés sous verrou avant effet externe : au plus **10 préparations de publication par jour** et 10 notifications par jour, sans robot de publication. Le plafond effectif ne peut pas dépasser 10 même si CONFIG est modifiée. Chaque approbation réserve une seule unité, les répétitions sont idempotentes. Les notifications et approbations ont des échéances espacées de 45 à 180 secondes ; le déclencheur attend le passage suivant plutôt que de bloquer un script avec `sleep`. Budget IA : 40 requêtes/jour par défaut. Aucun de ces plafonds n’est présenté comme une autorisation de la plateforme.

### 3. Faux positifs, sarcasme et refus

Qualification structurée avec validation stricte des types, score entier 0..100, urgence et champs de refus/incertitude. Une détection déterministe de « pas d’agence », « ne pas recommander », « déjà trouvé » prime sur le score du modèle. L’ironie signalée par le LLM, les extraits tronqués, dates inconnues et besoins manifestement périmés conduisent à une revue humaine. Une recherche d’emploi ou un poste salarié ne suffit pas à constituer une demande de prestation. Le modèle doit considérer l’offre réellement vérifiée ; l’ESIEA n’est pas automatiquement présentée comme le formateur freelance recherché. Aucun score élevé ne supprime l’étape d’approbation.

### 4. Coût et passage à 10 000 posts/jour

À 10 000 qualifications et 100 % de génération, le pipeline peut atteindre **20 000 appels Gemini**, auxquels s’ajoutent les notifications et reprises. Avec une proportion p de posts générant une recommandation : 10 000 × (1+p) appels Gemini avant reprises. Les tokens et tarifs dépendent du modèle et de la longueur des textes, pas seulement du nombre de requêtes ; le quota gratuit ne permet pas de présumer ce volume gratuit. Vérifier les [quotas Apps Script](https://developers.google.com/apps-script/guides/services/quotas) et les [limites Gemini](https://ai.google.dev/gemini-api/docs/rate-limits) au déploiement.

Google indique 20 000 UrlFetch/jour pour les comptes grand public et 100 000 pour Workspace, avec d’autres limites d’exécution et de temps des déclencheurs. On ne contourne pas ces limites en multipliant des comptes : on met en file, réduit le périmètre, déduplique avant l’IA, échantillonne, diffère le travail ou demande un quota adapté si le contexte le permet. Au-delà du prototype, un traitement autorisé sur infrastructure dédiée serait à étudier avec budget et protection des données. Cela ne relève pas du rendu imposant Sheets/Apps Script. Le code fourni reste volontairement borné : 40 appels IA/jour, trois posts par lot et aucun objectif de 10 000 commentaires.

### 5. Minimisation, effacement et transparence

Seuls le texte nécessaire, le lien, la date disponible et un pseudonyme d’auteur salé sont stockés. L’extension ne collecte pas le nom : `NON_COLLECTE`. Le hash de déduplication URL+texte n’anonymise pas le texte ni les liens et ne remplace pas la pseudonymisation séparée de l’auteur. Pas de bio, coordonnées, messages privés, audio ou cookies de session. IP_Execution indique NON_COLLECTEE ; Apps Script ne donne pas ici une IP client fiable.

La fonction authentifiée `forget` supprime la ligne et ses logs de traitement associés. `purgerDonneesExpirees` applique une rétention de 30 jours par défaut, plafonnée à 90. **La purge est manuelle dans cette version**, à exécuter régulièrement ou à planifier avec un déclencheur quotidien. Pour un effacement complet, traiter aussi les copies/exportations, l’historique Google éventuel et les notifications Discord, ainsi que tout commentaire publié manuellement. L’application ne promet pas de supprimer ces copies externes à distance. Garder Discord privé et révoquer les liens qui y auraient été exposés.

Le projet suit les principes de minimisation et de durée de conservation du [RGPD, article 5](https://eur-lex.europa.eu/eli/reg/2016/679/oj/fra) ; sa base légale et l’information des personnes doivent être appréciées avant une exploitation réelle. La provenance publique ne supprime pas ces obligations. L’outil interdit les faux comptes et ne prétend pas certifier sa conformité juridique complète. La transparence de la recommandation est conservée, aucune qualité de client ou de partenaire n’est inventée. Les règles du [contrat utilisateur LinkedIn](https://www.linkedin.com/legal/user-agreement) restent à respecter.

## Lecture des états

| État | Signification |
|---|---|
| A_QUALIFIER | Capturé, aucun résultat IA à ce stade |
| EN_COURS | Une tâche possède un bail temporaire |
| ERREUR_IA | Échec réel de l’API ou de validation JSON |
| REVUE_HUMAINE | Ambiguïté, date inconnue ou texte incomplet |
| REFUS_RECOMMANDATION / HORS_CIBLE | Aucun commentaire préparé |
| A_VALIDER | Commentaire généré, décision non prise |
| APPROUVE | Préparation approuvée, rien publié automatiquement |
| PUBLIE_DECLARE | L’opérateur déclare avoir publié et vérifié |
| REJETE / REMPLACE | Ne pas publier cette version |

## Tests et remise

Depuis ce dossier : `node --test tests/test.mjs`. Aucune clé nécessaire. La vidéo doit montrer un appel Gemini réel, la notification dans un salon privé et la validation d’une proposition ou une publication manuelle assumée. Ne pas publier une recommandation fictive pour fabriquer une preuve. La remise n’est complète qu’avec 15 posts réels effectivement analysés, la configuration des notifications, le test du dernier kilomètre et la vidéo.
