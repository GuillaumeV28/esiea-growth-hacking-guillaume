# Agent vocal de support étudiant ESIEA

Projet de Guillaume Voisine — option 1 — prototype pédagogique non officiel.

L'agent répond en français aux questions sur les deux exercices de growth hacking fournis. Il annonce sa nature virtuelle, attend un accord explicite et répond uniquement depuis les consignes. Une demande inconnue ou nécessitant un enseignant est orientée vers un suivi humain. Le tableau de bord conserve les résultats sans les confondre avec une correction scolaire ou une décision de l'école.

## État réel au 16 novembre 2026

- Agent créé dans le compte Vapi de `voisine.guillaume@gmail.com` : **ESIEA Support Étudiant Guillaume**.
- Assistant : https://dashboard.vapi.ai/assistants/0f39a24c-1929-4864-a081-99326619d2fc
- Identifiant : `0f39a24c-1929-4864-a081-99326619d2fc`.
- La version v1 apparaît publiée dans Vapi. Message d'accueil, prompt français et outil natif de fin d'appel sont présents.
- Moteurs affichés : Soniox STT RT v5 en automatique, OpenAI GPT-4.1 Mini et voix Vapi Elliot v2. La qualité effective du français et des interruptions reste à vérifier au micro.
- Aucun numéro acheté, aucun appel sortant, aucun email, SMS ou transfert configuré.
- Le code de synchronisation et son schéma sont fournis et testés localement. Ils ne sont pas encore déployés dans Google ni connectés à l'agent.
- La sortie structurée `esiea_support_resultat` reste à créer et à attacher à l'agent.
- Guillaume indique avoir effectué et filmé un test vocal. Lien renseigné dans le tableau de rendu : https://cap.so/s/efg2wk4nm6wcqtz . Cette vidéo n'a pas été examinée dans cette préparation ; la synchronisation réelle Vapi → Sheets reste à démontrer.

## Les livrables

| Fichier | Utilité |
|---|---|
| `PROMPT_AGENT.txt` | Prompt reproductible et base de connaissances limitée aux consignes |
| `EXTRACTION_VAPI.json` | Définition de la sortie structurée post-appel |
| `EXEMPLE_WEBHOOK.json` | JSON attendu par le sujet, exemple entièrement fictif |
| `Code.gs` | Installation, webhook, file persistante, validation, score, tableau de bord et reprise |
| `INFOGRAPHIE_16_9.png` | Infographie prête à insérer dans le rendu |
| `INFOGRAPHIE_16_9.svg` | Version vectorielle de l'infographie |
| `TESTS_ET_DEMONSTRATION.md` | Questions à tester et scénarios de démonstration |
| `VERIFICATIONS_LOCALES.txt` | Résultat des tests simulés |
| `tests/test.mjs` | Tests reproductibles sans accès à tes comptes |

## Architecture

```text
Étudiant
   │ appel entrant ou test vocal dans le navigateur
   ▼
Vapi : STT → modèle de dialogue → TTS
   │ premier message IA et accord explicite
   │ réponses cadrées, limites et reformulation
   ▼
Analyse post-appel Vapi avec schéma structuré
   │ événement end-of-call-report
   ▼
Application Web Google Apps Script doPost
   │ contrôle du jeton + assistant attendu + call_id
   ▼
Onglet File : réception persistante et déduplication
   │ traitement toutes les minutes, ou commande manuelle
   │ si extraction absente : récupération via l'API Vapi
   ▼
Validation → score de complétude → statut de suivi
   ▼
Google Sheets : Appels + Dashboard + Journal
   │
   └─ demandes de suivi visibles par une équipe humaine autorisée
```

Il n'y a ni Make, ni n8n, ni Zapier, ni IFTTT, ni Gumloop. Vapi est la plateforme vocale ; le traitement du webhook et l'automatisation de synchronisation sont codés en Apps Script.

Le webhook natif de Vapi n'a pas exactement la forme du JSON illustré dans le sujet : il contient un objet `message`. `minimalEvent_` récupère les métadonnées techniques et l'extraction ; `normalise_` produit les données du suivi. `fromExpectedJson_` accepte aussi le JSON illustré dans le sujet, pour tester l'intégration sans simuler un appel vocal réel.

## Installation étape par étape

### 1. Faire un premier test de l'agent déjà créé

1. Ouvrir le lien de l'assistant ci-dessus dans Vapi.
2. Vérifier les crédits et les coûts affichés. Le test vocal peut consommer des crédits ; ce n'est pas une promesse de gratuité.
3. Cliquer sur **Talk** et autoriser le microphone si tu souhaites faire le test.
4. Répondre à la question d'accord IA, puis poser une question simple du document de tests.
5. Terminer l'appel et ouvrir ses journaux. Ne pas utiliser de vraies informations sensibles pour la démonstration.

Le bouton Talk teste un canal vocal dans le navigateur. Il ne prouve pas qu'un numéro téléphonique répond. Pour démontrer un vrai appel entrant, il faut ensuite attribuer à l'assistant un numéro disponible dans le compte ou importer un numéro autorisé. Le sujet présente la création de numéros comme optionnelle ; déclarer le canal réellement testé dans le rendu. Aucun achat n'est effectué automatiquement.

### 2. Préparer un nouveau tableur à ton nom

1. Dans Google Sheets, vérifier le compte **voisine.guillaume@gmail.com** en haut à droite.
2. Créer manuellement une feuille vierge intitulée **Sujet 2 ESIEA Agent vocal Guillaume**. Ne pas réutiliser le tableau de classe ni le tableur CyberCap du sujet 1.
3. Ouvrir **Extensions → Apps Script**, remplacer le code par le contenu intégral de `Code.gs`, puis enregistrer.
4. Sélectionner **installer**, pas `onOpen`, dans la liste des fonctions. Exécuter.
5. Examiner l'autorisation Google : le projet doit correspondre à ton compte et au script que tu viens de créer. Un script personnel peut afficher « application non validée » ; cela n'est pas supprimé par la création d'un nouveau tableur. Ne pas autoriser un projet dont le développeur ou les accès sont inattendus. Cette étape doit être examinée par le titulaire du compte.
6. Revenir au tableur : `Appels`, `File`, `Journal` et `Dashboard` doivent apparaître. L'éventuelle feuille vierge d'origine peut rester sans effet.

Ne pas utiliser les anciens projets créés sous `voisinerobin@macomperso.com`. Un partage en modification ne change pas le propriétaire du fichier ni le projet OAuth qui l'accompagne.

### 3. Définir l'extraction après l'appel dans Vapi

1. Dans Vapi, ouvrir **Structured Outputs → Create Structured Output**.
2. Donner le nom `esiea_support_resultat` et choisir une extraction IA d'objet.
3. Dans `EXTRACTION_VAPI.json`, copier le champ `description` dans la description ou les instructions d'extraction.
4. Copier seulement l'objet du champ `schema` dans l'éditeur de schéma JSON. Le fichier entier constitue une définition API ; un éditeur demandant uniquement un schéma ne doit pas recevoir l'enveloppe `name`, `type`, `description`, `schema`.
5. Enregistrer et noter l'identifiant de cette sortie. Dans l'assistant, onglet **Tools**, attacher cette sortie structurée dans la section correspondante. Publier la modification si nécessaire.
6. Après un test, vérifier que le résultat se trouve dans les détails de l'appel. Le script attend `call.artifact.structuredOutputs[IDENTIFIANT].result` ou l'équivalent dans l'événement de fin d'appel.

Si l'interface refuse les unions de types telles que `["string","null"]`, consulter le mode de schéma proposé par cette interface et adapter explicitement les champs optionnels, sans convertir les valeurs inconnues en fausses informations.

### 4. Configurer les propriétés privées Apps Script

Dans **Paramètres du projet → Propriétés du script**, renseigner :

| Propriété | Valeur |
|---|---|
| `SHEET_ID` | Définie automatiquement par `installer` |
| `WEBHOOK_TOKEN` | Secret aléatoire créé par `installer` ; ne pas l'afficher dans le rendu |
| `VAPI_ASSISTANT_ID` | `0f39a24c-1929-4864-a081-99326619d2fc` pour l'agent créé dans ce compte |
| `STRUCTURED_OUTPUT_ID` | Identifiant réel de `esiea_support_resultat` créé à l'étape précédente |
| `VAPI_API_KEY` | Clé API privée Vapi autorisée à lire les appels, pour récupérer une extraction retardée |

La clé ne doit pas être envoyée dans ce chat, collée dans le prompt, mise dans une cellule, filmée ni incluse dans le dossier rendu. Elle sert ici à `GET /call/{id}`, jamais à déclencher des appels sortants.

### 5. Déployer et connecter le webhook

1. Dans Apps Script, **Déployer → Nouveau déploiement → Application Web**.
2. Exécution en tant que propriétaire du script. Le point d'entrée doit accepter le POST de Vapi sans connexion Google interactive. Si les règles de ton compte interdisent les applications Web accessibles à des clients externes, cette architecture directe ne fonctionnera pas : il faudra une architecture autorisée avec relais ou OAuth.
3. Copier l'URL `/exec`. Pour cette démonstration, l'URL du serveur Vapi prend la forme :

```text
https://script.google.com/macros/s/IDENTIFIANT_DEPLOIEMENT/exec?token=SECRET_PRIVE
```

4. Coller cette URL seulement dans les paramètres serveur de l'assistant Vapi, pas dans un outil dont les paramètres seraient rédigés par le modèle. Sélectionner uniquement l'événement **end-of-call-report** pour ce webhook.
5. Sauvegarder et publier la nouvelle version de l'assistant si demandé. Après un changement de code Apps Script, mettre à jour le déploiement avec une nouvelle version.

Ce choix du jeton dans l'URL est un compromis pour un prototype direct : l'événement `doPost(e)` d'Apps Script n'expose pas les en-têtes HTTP arbitraires. Le jeton peut apparaître dans les paramètres et journaux de service ; ne jamais publier cette URL complète. Il prouve la possession du secret, pas une signature cryptographique de Vapi. Pour un service réel, un relais HTTPS codé vérifiant l'authentification Vapi avant de transmettre à Sheets est préférable. Vapi propose des credentials serveur, mais ajouter un header Bearer que `doPost` ne lit pas n'authentifierait pas ce script.

Apps Script renvoie ici des réponses JSON. Il ne fournit pas via ContentService un contrôle fin des statuts HTTP : `ok:false` doit être détecté dans le corps de la réponse, même si le statut HTTP est 200. Vérifier les **Webhook logs** de Vapi. La redirection Google ContentService doit être suivie par le client ; cette compatibilité reste à vérifier avec un vrai appel dans ton environnement.

### 6. Activer la synchronisation

1. Dans Apps Script, exécuter **activerSynchronisation** ou utiliser le menu Support ESIEA dans le tableur.
2. Un seul déclencheur `traiterFile` est créé, avec cadence approximative d'une minute. Relancer l'activation remplace uniquement les déclencheurs de cette fonction.
3. Le webhook enregistre rapidement une tâche dans `File`, puis répond. La synchronisation peut donc prendre une ou plusieurs minutes ; elle n'est pas annoncée comme instantanée.
4. Si l'extraction n'est pas disponible au moment du webhook, la tâche récupère les résultats via l'API Vapi.
5. Les tentatives sont espacées, limitées à cinq. Après échec persistant, la ligne reste `ERREUR` pour examen humain. Le journal conserve un code d'erreur sans clé API ni transcription.
6. Pour arrêter cette automatisation, exécuter **desactiverSynchronisation**. Arrêter aussi l'agent ou retirer le webhook si la démonstration est terminée.

## Données du tableau de bord

Une ligne par `call_id` dans `Appels`. Les colonnes sont : identifiant, date de collecte UTC, direction, prénom, nom, entreprise ou établissement déclaré, résumé du besoin, rôle déclaré, délai souhaité, budget confirmé si applicable, statut lead, durée technique en secondes, résumé complet, accord IA, score sur 100, thème, statut de la demande, suivi humain demandé, résumé confirmé et source.

La durée vient des métadonnées techniques Vapi, ou de la différence entre début et fin. Le modèle n'est pas invité à l'inventer. Une durée absente reste vide, jamais remplacée par zéro. Le budget reste inconnu ou non applicable pour le support étudiant ; aucune question commerciale n'est posée à l'étudiant.

Le Dashboard affiche le total consigné, les réponses résolues, les demandes de suivi humain, les refus ou accords absents et les synchronisations en erreur. Les appels manqués n'y sont pas comptés : le webhook est limité aux rapports de fin reçus. Ne pas présenter ce total comme un taux de décroché.

## Score et routage adaptés à l'option ESIEA

Le sujet demande un score sur 100 et les termes SQL ou Nurturing. Pour du support étudiant, ils sont conservés comme compatibilité technique avec le barème ; ils n'expriment aucune intention d'achat.

| Critère de complétude | Points |
|---|---:|
| Résumé du besoin d'au moins 15 caractères | 40 |
| Thème identifié | 20 |
| Reformulation confirmée par l'appelant | 20 |
| Prénom ou nom volontairement communiqué | 10 |
| Délai souhaité volontairement communiqué | 10 |

Le score ne mesure pas la qualité scolaire, la gravité d'une situation, ni le droit d'accéder au support. Le nom et le délai restent facultatifs. Une demande anonyme peut atteindre 80 et obtenir un suivi.

- Si suivi humain nécessaire et score ≥70 : statut technique `SQL`, c'est-à-dire demande suffisamment précisée pour être examinée.
- Sinon : `Nurturing`, c'est-à-dire aucune qualification de suivi complète ; cela comprend les réponses déjà résolues. Le champ `statut_demande` permet de ne pas confondre ces cas.
- `RESOLU` : l'appelant confirme que la réponse suffit et ne demande pas de suivi.
- `SUIVI_HUMAIN` : souhait d'un humain, réponse non résolue ou question hors périmètre. Le tableau conserve cette indication ; aucun email n'est envoyé automatiquement.
- `REFUS_OU_ACCORD_ABSENT` : ne conserver que les métadonnées minimales et le refus ou l'absence d'accord, sans contact ni contenu de la demande.

Le serveur calcule le score et le statut lead. Il n'accepte pas un score inventé par le modèle. Le routage n'empêche jamais l'étudiant de contacter directement un humain.

## Robustesse et limites

- Déduplication avant ajout dans la file, puis avant ajout dans Appels, avec verrou serveur pour protéger les écritures concurrentes.
- Une tâche est enregistrée avant le traitement. Le traitement ne recharge pas une transcription entière : il récupère uniquement le résultat structuré attendu.
- En cas d'interruption, une tâche `EN_COURS` devenue ancienne peut être reprise après dix minutes. Le compteur et les délais évitent une boucle de relances infinie.
- Une réémission du même call_id ne crée pas un deuxième appel dans le tableau. L'idempotence n'est pas une garantie de livraison : vérifier les journaux des deux services.
- Les valeurs textuelles commençant par des caractères de formule sont neutralisées avant écriture dans Sheets.
- Les exemples portent explicitement la source `TEST_FICTIF`. Ils ne constituent pas des preuves d'appels vocaux.
- Le script ne stocke pas de fichier audio ni de transcription brute. Cela ne garantit pas que Vapi et ses fournisseurs ne les conservent pas : contrôler les paramètres de stockage et de rétention du compte et les régler avant un usage réel.
- Les sorties de modèle peuvent être erronées. Vérifier les réponses, le français, les accords, les refus et les exemples hors périmètre avant toute utilisation autre qu'une démonstration.
- Le sujet demande une réception 24 h/24 comme objectif de service. Le prototype ne démontre ni disponibilité contractuelle, ni capacité de production, ni validation officielle par l'ESIEA.

## Correspondance avec le workflow entrant fourni

| Étapes du tableur de cours | Traitement dans ce projet |
|---|---|
| 1–2 : numéro et téléphonie | À configurer seulement pour une démonstration téléphonique réelle ; premier test sur navigateur |
| 3–6 : objectifs, scénario, prompt, sources | Prompt et base de connaissances fournis, périmètre pédagogique limité |
| 7 : moteurs STT, LLM, TTS | Paramètres Vapi présents, qualité à tester |
| 8–13 : arrivée, session, identification et prise d'appel | Fournis par Vapi pour le canal utilisé ; aucune preuve d'identité déduite du numéro |
| 14 : accueil | Nature IA, prototype non officiel, accord explicite |
| 15–18 : audio, VAD, STT et intention | Fournis par la plateforme vocale ; à observer dans un vrai test |
| 19–21 : connaissance, réponse et tours | Consignes dans le prompt, réponses courtes et reformulations |
| 22 : exceptions | Hors périmètre, refus, silences, souhait d'un humain et erreurs de webhook |
| 23 : clôture | Reformulation, confirmation et fin d'appel native |
| 24 : résultat | Extraction structurée, POST, file Apps Script, tableau de bord et suivi |

Le tableur d'exemple mentionne des outils d'automatisation tiers dans les étapes sortantes. Ils ne sont pas utilisés ici : la consigne du sujet interdit ces outils et le projet retenu porte sur les appels entrants.

## Démonstrations à fournir plus tard

Un test vocal a été filmé par Guillaume. Les scénarios sont dans `TESTS_ET_DEMONSTRATION.md` pour compléter les tutoriels après validation réelle du trajet Vapi → Sheets. L'infographie 16:9 décrit l'architecture prévue ; elle ne constitue pas une preuve de synchronisation.

## Sources techniques

Vérification documentaire du 16 novembre 2026. Les menus, tarifs, modèles et paramètres peuvent évoluer.

- Vapi, création et test vocal navigateur : https://docs.vapi.ai/quickstart/phone
- Vapi, événements serveur : https://docs.vapi.ai/server-url/events
- Vapi, sorties structurées et emplacement du résultat : https://docs.vapi.ai/assistants/structured-outputs-quickstart
- Vapi, authentification serveur : https://docs.vapi.ai/server-url/server-authentication
- Google, applications Web et paramètres doPost : https://developers.google.com/apps-script/guides/web
- Google, déclencheurs installables : https://developers.google.com/apps-script/guides/triggers/installable

Le sujet Word et son tableur de workflow sont les sources pédagogiques du périmètre. Aucune règle commerciale de démarchage sortant n'est présentée ici comme applicable à ce support entrant.
