# Sujet 2 ESIEA — état de l’installation

L’agent **ESIEA Support Étudiant Guillaume** est publié dans Vapi avec l’envoi du rapport de fin d’appel vers le Google Sheet personnel de Guillaume. La sortie structurée `esiea_support_resultat`, la réception protégée par jeton et le traitement automatique approximativement chaque minute sont configurés.

Vérifications du 16 novembre 2026 :
- Conversation vocale : test réel réalisé et filmé par Guillaume.
- Extraction : aperçu Vapi réussi sur l’appel réel de 11 h 47.
- Réception HTTP et traitement : test avec un exemple explicitement fictif, ajouté dans Appels.
- Tableau de bord : compteurs vérifiés, formules adaptées au français.
- 14 tests locaux réussis.

Il reste à vérifier un nouvel appel terminé après activation de la connexion. Les anciens appels ne sont pas envoyés rétroactivement. Un aperçu d’extraction et un exemple fictif ne constituent pas la preuve de ce nouvel envoi automatique.

## Installation reproductible

Suivre GUIDE_ET_RENDU.md. Dans le tableau de bord Vapi, on peut utiliser un objet à un champ String nommé `payload_json`, avec la consigne de retourner le JSON décrit par EXTRACTION_VAPI.json. Le script accepte ce format ainsi que l’objet imbriqué direct.

Propriétés privées : SHEET_ID et WEBHOOK_TOKEN sont générées par installer ; renseigner VAPI_ASSISTANT_ID, STRUCTURED_OUTPUT_ID et VAPI_API_KEY. Aucun secret ne doit être ajouté au dépôt.

Dans Vapi : Server URL = adresse Apps Script suivie de ?token=JETON_PRIVE ; Server Messages = end-of-call-report uniquement. Publier la nouvelle version. Exécuter activerSynchronisation dans Apps Script.

Après un court appel de test, attendre environ une minute et contrôler Appels, File et Journal. Une ligne FICTIVE est identifiée dans son résumé et son identifiant commence par demo_.
