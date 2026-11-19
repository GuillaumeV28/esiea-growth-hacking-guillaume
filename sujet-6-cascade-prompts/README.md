# Sujet 6 — Cascade de prompts sur Google Sheets

Exemple pédagogique de Guillaume Voisine : un brief devient un programme de formation, puis des données structurées et un graphique PNG. Le canevas respecte les blocs **2 colonnes × 5 lignes** : `[NODE]`, Statut, Modèle, Entrée, Sortie.

## Choix simple et gratuit

Deux appels de texte Gemini par cascade, sous réserve d’un quota gratuit disponible. Aucun compte payant, facturation activée, API d’images payante, service d’orchestration, extension ou déploiement Web n’est nécessaire. Le projet ne promet pas la disponibilité du quota gratuit.

Le dernier bloc utilise **Google Charts**, fourni par Apps Script. L’IA conçoit le programme et ses données ; Charts rend le graphique en PNG. **Ce n’est pas une génération photographique Nano Banana.** Les nombres représentent des durées de modules proposées, pas des statistiques observées. Le classeur Nano Banana fourni a servi de référence pour le passage prompt → visuel et les liens Drive ; il n’est ni modifié, ni repris avec ses clés ou identifiants de démonstration.

La vidéo fournie explique une intégration Nano Banana et présente une configuration de facturation vers 2 min 29 puis 3 min 40. Cette étape n’a pas été suivie. Le projet retient une alternative sans API image payante, autorisée par la demande de Guillaume.

## État réel au 19 novembre 2026

Installé et testé sur le compte Guillaume : quatre blocs terminés, deux générations de texte/JSON réussies, PNG réellement créé dans Drive et affiché avec IMAGE dans Sheets. Projet Gemini vérifié au niveau sans frais ; aucune facturation activée. 15 tests locaux réussis, zéro échec. Une première réponse JSON a été refusée pour un intitulé trop long ; la reprise après correction a abouti sans refaire le programme. Le journal conserve cette erreur historique.

La vidéo reste à enregistrer. Aucun connecteur vidéo n’est revendiqué. L’image `EXEMPLE_REEL_Apercu.webp` est l’aperçu exporté de la visionneuse Drive ; le fichier source conservé dans Drive est bien un PNG.

## Fichiers

- `Sujet6_Cascade_Prompts_Guillaume.xlsx` : canevas initial à importer au format Google Sheets.
- `Code.gs` : worker, connecteurs Gemini et Charts, reprise, quota et menu.
- `appsscript.json` : permissions Google nécessaires.
- `TUTOS_3_MIN.md` : vidéos d’installation et d’utilisation.
- `VERIFICATION.md` : preuves et limites effectives.
- `tests/test.mjs` : tests locaux sans service externe.

## Installation

1. Importer le XLSX sur **le compte Google Guillaume**, puis Fichier → Enregistrer au format Google Sheets. Le tableau reste privé. Ne pas utiliser le compte Robin connecté à certaines applications de la conversation.
2. Extensions → Apps Script. Coller `Code.gs`. Dans les paramètres, afficher le manifeste, puis y coller `appsscript.json`. Aucun fichier HTML n’est à ajouter.
3. Exécuter `installer` et vérifier les accès accordés. Sur un canevas existant, cette commande ne supprime pas les données et ne reconstruit pas les blocs.
4. Propriétés privées du script : renseigner `GEMINI_API_KEY`. Ne jamais la coller dans une cellule, GitHub ou une vidéo.
5. Vérifier dans AI Studio que le projet de la clé est bien sans facturation, puis seulement cocher CONFIG → QUOTA_GRATUIT_VERIFIE. Le code n’active aucune facturation, mais cette case n’interroge pas Google Cloud : la vérification du compte reste nécessaire.
6. Le modèle initial est `gemini-3.5-flash-lite`. Cette version autorise aussi `gemini-3.1-flash-lite` si disponible avec quota gratuit dans le projet. Aucune bascule automatique vers un modèle payant.
7. Exécuter `testerGemini` : le journal doit indiquer TEST_GEMINI_REEL_OK. Une liste de modèles accessible ne suffit pas à prouver un quota de génération.

CONFIG → DOSSIER_ID peut rester vide : le premier PNG crée un dossier Drive dédié et reporte son identifiant. On peut aussi saisir l’ID d’un dossier existant appartenant au compte utilisé.

CONFIG → PARTAGER_IMAGES est désactivé par défaut. Dans ce mode, le PNG Drive reste privé, la sortie contient son lien et le script ajoute un aperçu depuis le blob sous le canevas. Pour suivre le rendu `IMAGE` prévu dans le sujet, l’activer seulement après avoir accepté que les PNG pédagogiques soient accessibles à toute personne possédant leur lien. Le tableau et les autres fichiers ne sont pas rendus publics.

## Utilisation

Modifier le brief jaune **CANEVAS!B6**, puis menu **Cascade IA → Exécuter la cascade**. Le programme apparaît en E7, le JSON en E15 et le résultat graphique en H15. Après une modification du brief, utiliser **Réinitialiser les résultats**, puis relancer ; les étapes terminées ne sont pas réexécutées spontanément.

Les intitulés trop longs sont raccourcis pour le rendu, sans modifier leurs durées. Les libellés complets restent dans le programme texte. Les formules écrites par le script utilisent les séparateurs adaptés à la locale française.

Le worker fait plusieurs scans simples pendant au maximum environ 230 secondes. Il lit uniquement les blocs prêts et le connecteur demandé. Il n’utilise ni DFS, ni BFS, ni tri topologique. Aucun déclencheur permanent n’est installé ; si la cascade n’est pas finie, une nouvelle exécution reprend les états disponibles.

## Les formules sont les câbles

Exemples du canevas natif, avec séparateurs adaptés à la langue du tableur :

```text
Entrée du programme : ="Rédige… Brief : "&B7
Statut du programme : =IF(ETATS!B3<>"";ETATS!B3;IF(B4="Terminé";"Prêt";"En attente"))
Entrée du graphique : =IF(E15="";"";E15)
```

**Correction de l’ambiguïté du sujet :** on teste le **Statut** amont égal à Terminé ; sa Sortie contient un texte ou un résultat, pas le mot Terminé.

Le sujet illustre une écriture directe du statut par le worker. Cette version conserve au contraire la formule de Statut : l’état d’exécution est écrit dans ETATS, que la formule affiche. Le passage En cours…, Terminé ou Erreur reste visible, sans écraser le fil d’exécution. ETATS est une mémoire d’état, pas un graphe ni un tableau de dépendances.

Les blocs peuvent être déplacés par **couper-coller dans Sheets**, qui adapte ses références. Ne pas trier le canevas. Pour ajouter un bloc : copier sa structure 2×5 dans une zone libre, choisir un nom unique, ajouter une ligne ETATS correspondante et relier sa formule de statut à cette ligne et au statut amont. Le script scanne les ancres dans toute la feuille ; les positions du canevas initial ne servent qu’à l’installation et à sa présentation.

L’utilisateur doit construire un DAG sans référence circulaire. La vérification des cycles appartient au moteur de calcul de Sheets ; le worker ne recalcule pas les dépendances.

## Erreurs et reprise

- Les résultats terminés sont ignorés à la relance. Les sorties d’IA sont stockées comme texte, jamais exécutées comme formule.
- Sur HTTP 500/502/503/504 : état En attente_API, prochaine tentative après 60 puis 120 secondes, au plus trois tentatives. Il faut relancer le menu après le délai ; il n’y a aucun service exécuté ordinateur éteint.
- Les erreurs permanentes, réponses JSON invalides, clés manquantes et quotas épuisés passent en Erreur et bloquent la suite. Voir ETATS et JOURNAL. Corriger, puis Reprendre les erreurs et Exécuter la cascade.
- Une interruption peut laisser En cours… : vérifier qu’aucune exécution n’est encore active avant d’effacer manuellement l’état dans ETATS. Un appel IA déjà accepté peut être facturé/décompté même si sa réponse a été perdue. Le projet ne promet pas une idempotence absolue du fournisseur.
- Verrou global contre les doubles lancements. Après un arrêt, aucune nouvelle action n’est lancée ; une requête déjà partie ne peut pas être annulée.
- Les PNG sont réutilisés lorsque leurs données structurées sont identiques. La réinitialisation ne supprime pas les fichiers Drive existants.
- En mode public, le rendu IMAGE dépend du comportement de Sheets et Drive. Si la miniature ne s’affiche pas, le PNG reste consultable depuis le lien consigné dans JOURNAL. Ne pas affirmer qu’un aperçu s’affiche avant de l’avoir vérifié.

## Périmètre multimédia

Le prototype implémente texte et PNG. **La génération vidéo n’est pas implémentée** : elle nécessiterait un fournisseur et un quota compatibles avec le budget gratuit. Aucun MP4, Task ID ou résultat vidéo fictif n’est présenté comme réel. Pour une V2 : connecteur vidéo autorisé, stockage de l’ID de tâche dans ETATS et contrôle périodique sans boucle bloquante ; parser dynamique des labels pour plusieurs entrées.

## Sources

- Sujet 6 Word fourni : structure des blocs, DAG natif et worker spatial.
- [Tarifs Gemini](https://aistudio.google.com/docs/pricing) : vérifier le modèle et le niveau de projet avant usage.
- [Charts ColumnChartBuilder](https://developers.google.com/apps-script/reference/charts/column-chart-builder) et [Chart.getAs](https://developers.google.com/apps-script/reference/charts/chart) : rendu PNG natif.
- [Vidéo de référence Nano Banana](https://www.youtube.com/watch?v=pMqfzTa3Wlw) : modèle d’intégration fourni, non requis pour l’alternative retenue.
