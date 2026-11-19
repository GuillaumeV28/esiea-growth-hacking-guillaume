# Exercices ESIEA de Guillaume Voisine

Ce dépôt réunit les fichiers d'installation et la documentation des exercices 1, 2, 4, 6 et 7 de growth hacking. Il s'agit de prototypes pédagogiques, pas de services officiels de l'ESIEA.

| Exercice | Fichiers et installation | État |
|---|---|---|
| Sujet 1 — Veille de publications LinkedIn | [Ouvrir le dossier](sujet-1-veille-linkedin/) · [Guide d'installation](sujet-1-veille-linkedin/04_GUIDES_ET_VIDEOS.md) | Extension créée et chargée dans Chrome ; intégration complète encore à valider |
| Sujet 2 — Agent vocal entrant de support étudiant | [Ouvrir le dossier](sujet-2-agent-vocal/) · [Guide d'installation](sujet-2-agent-vocal/GUIDE_ET_RENDU.md) | Agent créé dans Vapi ; test vocal filmé par Guillaume ; connexion Sheets configurée ; réception fictive et extraction testées ; nouvel appel automatique à vérifier |
| Sujet 4 — Candidatures personnalisées | [Ouvrir le dossier](sujet-4-recrutement/) | Code et fichiers locaux prêts ; connexion Google Guillaume et test Gemini/Gmail à terminer |
| Sujet 6 — Cascade de prompts | [Ouvrir le dossier](sujet-6-cascade-prompts/) | Installé et testé : programme IA, JSON et graphique PNG, projet sans frais |
| Sujet 7 — Recommandation LinkedIn | [Ouvrir le dossier](sujet-7-preuve-sociale/) | Gemini et Discord connectés ; 15 analyses réelles ; une proposition à valider |

## Sujet 7

L’agent recommande l’ESIEA avec transparence depuis un profil étudiant. Gemini gratuit a analysé 15 publications uniques (13 extraits incomplets et deux textes relus intégralement). Une recommandation a été reçue dans Discord privé et son portail signé vérifié. Aucune publication LinkedIn n’a été effectuée.

- [Fichiers et réponses aux cinq questions](sujet-7-preuve-sociale/README.md)
- [Schéma fonctionnel](sujet-7-preuve-sociale/SCHEMA_FONCTIONNEL.svg)
- [Tutoriel vidéo de quatre minutes](sujet-7-preuve-sociale/TUTO_VIDEO_4_MIN.md)
- [Tests réels et limites restantes](sujet-7-preuve-sociale/VERIFICATION.md)

22 tests locaux réussis. Décision humaine, test de l’extension Chrome et vidéo restent à terminer.

## Sujet 1

L'entreprise fictive CyberCap Formation sert de cas d'étude. Le dossier contient les réponses aux deux prompts, une extension Chrome, le script Google Apps Script, les consignes de réglage et les tests locaux.

- [Réponses aux deux prompts](sujet-1-veille-linkedin/01_REPONSES_AUX_DEUX_PROMPTS.md)
- [Extension Chrome à charger](sujet-1-veille-linkedin/extension/)
- [Script du tableur de veille](sujet-1-veille-linkedin/google-apps-script/Code.gs)
- [Installation et utilisation](sujet-1-veille-linkedin/04_GUIDES_ET_VIDEOS.md)

L'outil ne contourne aucun CAPTCHA, n'ouvre pas les profils et ne clique pas sur « Plus ». La consigne sur le texte complet est ambiguë ; la documentation explique la limite. Les tests utilisent des données simulées et ne prouvent pas la compatibilité des sélecteurs avec toutes les interfaces LinkedIn.

## Sujet 2

L'agent Vapi répond en français à partir des consignes des deux sujets et propose un suivi humain lorsque la question dépasse son périmètre.

- [Prompt et base de connaissances](sujet-2-agent-vocal/PROMPT_AGENT.txt)
- [Script Apps Script](sujet-2-agent-vocal/Code.gs)
- [Sortie structurée à configurer dans Vapi](sujet-2-agent-vocal/EXTRACTION_VAPI.json)
- [Installation et architecture](sujet-2-agent-vocal/GUIDE_ET_RENDU.md)
- [Questions de test et démonstrations](sujet-2-agent-vocal/TESTS_ET_DEMONSTRATION.md)
- [Vidéo du test vocal communiquée dans le tableau de rendu](https://cap.so/s/efg2wk4nm6wcqtz)

La vidéo du test ne démontre pas à elle seule le trajet Vapi → Google Sheets. L'extraction, le webhook et le tableau de bord sont configurés. La réception HTTP a été vérifiée avec un exemple fictif et l’extraction avec un aperçu sur un appel réel. Un nouvel appel après activation reste nécessaire pour valider l’envoi automatique depuis Vapi. Aucun numéro n'a été acheté par cet outil, aucun appel sortant ni notification automatique n'est configuré.

![Architecture du sujet 2](sujet-2-agent-vocal/INFOGRAPHIE_16_9.png)

## Télécharger et installer

Dans GitHub, choisir **Code → Download ZIP**, puis décompresser l'archive. Suivre le guide du sujet concerné. Les sous-dossiers contiennent les fichiers à copier dans Google Apps Script ou à charger dans Chrome.

Créer les tableurs et leurs projets Apps Script avec son propre compte Google. Un accès en modification à un fichier d'un autre compte n'en change pas le propriétaire. Les autorisations, secrets et déploiements ne sont pas transférés par le téléchargement de ce dépôt.

## Vérifications locales

Avec Node.js récent, depuis le dossier du sujet choisi :

```sh
node --test tests/test.mjs
```

Sujet 1 : 14 tests locaux réussis. Sujet 2 : 14 tests locaux réussis. Les rapports dans chaque dossier distinguent ces tests simulés des preuves à obtenir dans les comptes réellement utilisés.

## Configuration privée

Aucun mot de passe, cookie, jeton actif ou clé API n'est inclus. Ne pas ajouter de secrets au dépôt. Les exemples contiennent des valeurs factices. Les valeurs privées se configurent uniquement dans les propriétés du script ou les paramètres locaux de l'application.

Ce dépôt ne contient ni notes d'étudiants, ni transcriptions réelles, ni base de prospects ou d'appels.


## Sujet 4

[Outil et installation](sujet-4-recrutement/README.md) · [Tutoriel de quatre minutes](sujet-4-recrutement/TUTO_VIDEO_4_MIN.md) · [Vérification et limites](sujet-4-recrutement/VERIFICATION.md).

14 tests locaux réussis. Le CV, le courrier, le suivi personnel et le message EML restent hors du dépôt public. Aucun email envoyé ; aucun brouillon Gmail réel revendiqué avant test dans le compte Guillaume.

## Sujet 6

[Code et installation](sujet-6-cascade-prompts/README.md) · [Deux tutos de trois minutes](sujet-6-cascade-prompts/TUTOS_3_MIN.md) · [Vérifications](sujet-6-cascade-prompts/VERIFICATION.md).

Quatre blocs 2×5 reliés par formules natives ; deux appels texte Gemini par cascade, puis rendu PNG Google Charts. Cascade réelle terminée et image affichée dans Sheets, projet sans frais vérifié. 15 tests locaux réussis. Cette alternative gratuite ne génère pas de photos Nano Banana ni de vidéos. Aucune clé API dans le dépôt.
