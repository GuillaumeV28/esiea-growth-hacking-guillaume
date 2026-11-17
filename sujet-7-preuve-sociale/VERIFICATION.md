# Vérification du 17 novembre 2026

## Réalisé localement

18 tests Node.js réussis, 0 échec. Services Google simulés, aucune requête IA ou Discord pendant ces tests.

Couverture : 15 sources uniques et extraits courts, déduplication SHA-256, pseudonymisation d’auteur, invalidation des révisions, URLs autorisées, refus de recommandation, ambiguïté, JSON strict, absence de faux témoignage, quasi-doublons de commentaires, secret d’import, arrêt global, signatures expirées et altérées, approbation idempotente, confirmation manuelle, quotas persistants, concurrence de tâches et effacement.

## Réalisé dans le compte Guillaume

- Classeur natif créé, six onglets installés et contrôlés visuellement.
- Import confirmé par le journal : 15 extraits ajoutés, 0 doublon, analyseGeminiEffectuee=false.
- Déploiement Web effectué avec l’autorisation explicite de Guillaume. Le tableur reste privé.
- Test HTTP réel `testerReception` réussi : mauvais jeton refusé, jeton privé accepté, doublon ignoré, aucun appel Gemini ou Discord.
- CONFIG.ACTIF=false ; les secrets sont uniquement dans les propriétés du script.

## Vérifications réelles encore nécessaires

1. Créer et configurer la clé du projet Gemini séparé, avec l’accord de Guillaume et un quota gratuit disponible.
2. Ajouter une clé Gemini avec un quota disponible et vérifier une génération JSON réelle.
3. Ajouter un webhook Discord privé et vérifier la notification.
4. Relire et compléter les textes et dates lorsque nécessaire. Un extrait incomplet ne doit pas déclencher une recommandation prête à publier.
5. Vérifier le portail : ouvrir un lien ne change pas l’état ; confirmer une approbation le change ; rejeter empêche la publication proposée.
6. Effectuer un parcours réel sur un post pertinent, jusqu’à validation ou publication manuelle souhaitée, puis filmer 3 à 5 minutes.

Les captures, résultats locaux et extraits sources ne remplacent pas ces preuves de fonctionnement dans les comptes utilisés.
