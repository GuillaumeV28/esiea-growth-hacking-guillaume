# Vérification du sujet 6

19 novembre 2026.

## Fonctionnement réel vérifié

- Tableau natif installé sur le compte Google Guillaume : CANEVAS, CONFIG, ETATS et JOURNAL.
- Projet Gemini ESIEA Sujet7 Guillaume vérifié au niveau sans frais. Clé existante copiée, avec autorisation, uniquement dans les propriétés privées du nouveau script. Aucune facturation activée.
- `testerGemini` : réponse réelle OK.
- Bloc 01 : brief copié en sortie.
- Bloc 02 : programme français généré réellement par Gemini.
- Bloc 03 : JSON généré réellement, trois modules de vingt minutes validés.
- Bloc 04 : PNG généré par Google Charts, enregistré dans Drive, puis affiché dans H15 avec IMAGE après autorisation d’accès aux URL externes.
- Les quatre états sont Terminé. Aucune réponse de test simulée n’a été insérée dans le tableau réel.
- PNG accessible par lien avec l’accord de Guillaume ; le tableau reste privé. Aperçu visuel inspecté dans la visionneuse et dans la cellule.

Le journal conserve le premier échec MODULE_INVALIDE : un intitulé était trop long. Le correctif raccourcit les noms pour le graphique, préserve les durées et reprend uniquement le bloc en erreur. Une formule de lien privé a également nécessité l’adaptation des séparateurs à la locale française ; le rendu final utilise IMAGE et a été vérifié.

## Vérifications locales

15 tests réussis, zéro échec. Services simulés : blocs distincts 2×5, références, format du JSON, durée totale, quota, arrêt, identité, sorties textuelles neutralisées, reprise différée après 503, erreur permanente, conservation des formules, locale française et non-réexécution des étapes terminées.

Le classeur initial a été recalculé, exporté et rendu. Une modification temporaire de l’état amont a débloqué le statut aval et propagé le texte par formule ; les valeurs de test ont été retirées avant export.

## Périmètre

Cette version réalise une cascade de texte IA avec rendu graphique PNG. Elle ne génère ni photographie Nano Banana, ni vidéo. L’export WEBP fourni est l’aperçu de la visionneuse du véritable PNG Drive. La vidéo de démonstration reste à enregistrer par Guillaume.

Fichier PNG réel : https://drive.google.com/file/d/11rrUxv4uFd_5gV_NqXFRYlio5_T_7T_6/view
