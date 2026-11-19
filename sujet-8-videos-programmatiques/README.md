# Sujet 8 — Vidéos de candidature programmatiques

**Option B, Windows.** Trois PDF privés → extraction/OCR → Gemini → scénario sourcé → Google Slides + voix synthétique Windows → MP4 sous-titré de 54 secondes et GIF animé → dépôt automatique dans Drive et liens dans Sheets. Aucun réupload manuel après le déclenchement, aucun Make/n8n ni abonnement vidéo.

## Installation

1. Télécharger le dossier et installer Python 3.11+ si nécessaire.
2. Importer `Sujet8_Videos_Programmatiques_Guillaume.xlsx` dans Drive, puis **Fichier → Enregistrer au format Google Sheets**. Conserver les trois onglets PRODUCTION, PROMPTS et CONFIG_LOG.
3. **Extensions → Apps Script** : copier `Code.gs`, créer le fichier HTML `Connexions` avec `Connexions.html`, afficher puis remplacer `appsscript.json`. Exécuter `installerSujet8`, autoriser les accès Google demandés et recharger le tableau.
4. **Déployer → Application Web** : exécution en tant que propriétaire, accès au moteur sans connexion Google. Chaque action de travail exige un jeton privé dans le corps POST ; l’adresse publique seule ne donne accès à aucune donnée. Dans **Vidéos IA → Connexions privées**, enregistrer l’adresse `/exec` et une clé Gemini d’un projet gratuit sans facturation. Télécharger `configuration_privee.json` à côté de `moteur.py`.
5. Déposer les trois PDF dans Drive. En PRODUCTION : option `B`, puis liens du CV, du portfolio/lettre et de l’offre en C/D/E. Un angle éditorial peut être indiqué en M. La fiche d’offre peut préciser `Employeur : …` et `Poste : …` pour une reprise exacte.
6. Double-cliquer `LANCER.cmd`. La première ouverture installe les composants. Laisser cette fenêtre ouverte, sélectionner la ligne et cliquer **Vidéos IA → Générer la ligne sélectionnée**.

## Utilisation

Le tableau affiche les étapes, la durée mesurée, les liens vidéo/Slides/GIF et les erreurs. Une ligne terminée reste conservée : utiliser une nouvelle ligne pour une autre génération. La reprise après erreur réutilise le scénario validé lorsque les entrées n’ont pas changé.

L’ordinateur doit rester allumé, connecté et le moteur ouvert ; sa session dure 60 minutes. Le MP4 et le GIF restent privés : accorder séparément l’accès au professeur ou recruteur. Pas d’envoi Gmail, pas de relance ni de calendrier automatique.

## Coût et risques

**0 € de services facturés dans le quota gratuit, sans facturation activée.** Au-delà, le traitement s’arrête. Maximum trois appels IA par génération et trente par jour ; la voix et le rendu sont locaux. Exemple hors offre gratuite : 3 000 tokens d’entrée et 1 000 de sortie sur Gemini 3.1 Flash-Lite coûteraient `3000/1e6 × 0,25 + 1000/1e6 × 1,50 = 0,00225 $` par réponse. [Tarifs Google consultés le 19/11/2026](https://aistudio.google.com/docs/pricing#gemini-3.1-flash-lite). Restent Internet, électricité et espace Drive.

Le moteur retire les lignes de coordonnées avant Gemini. Le texte professionnel est transmis à Google : tenir compte des conditions des quotas gratuits avant tout document confidentiel. Les citations sont choisies dans les sources et leur provenance est calculée. Un contrôle humain reste nécessaire pour les affirmations et leur contexte. Le calibrage retire seulement des phrases complètes ; la voix générique n’imite aucune personne. Les sous-titres suivent les scènes, avec une répartition interne estimée. L’OCR Drive est un recours pour les scans ; un échec reste visible.

**Ne jamais publier** la connexion privée, la clé, les CV ou les vidéos de candidature dans GitHub. La présentation reprend le modèle pédagogique Option B, avec illustrations abstraites et jauges fictives supprimées. Les deux tutos sont dans `TUTOS.md`. Tests techniques : `node --test tests/test.mjs`.
