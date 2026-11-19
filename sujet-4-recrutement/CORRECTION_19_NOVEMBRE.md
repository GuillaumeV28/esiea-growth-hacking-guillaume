# Correction vérifiée le 19 novembre 2026

Le test réel a atteint `DOCUMENTS_A_RELIRE` sur le compte Guillaume. Le CV PDF et le courrier Google Docs sont créés dans Drive ; les liens sont écrits dans OFFRES, colonnes J et K.

L’erreur `REFERENCES_CV_INVALIDES` venait de références non conformes dans la sortie de Gemini. Le schéma de réponse limite désormais les références aux IDs existants du profil, limite la lettre à quatre faits et élimine les doublons strictement identiques. Une seconde génération est tentée en cas de réponse invalide. Les qualifications et références inconnues restent refusées.

Une autre vérification a révélé les espaces HTML `&#xa0;` provenant de SmartRecruiters. Ils sont désormais décodés pour comparer correctement les citations, avec normalisation des apostrophes typographiques. Les mots différents restent refusés.

À la demande de Guillaume, la création du brouillon Gmail est désactivée par défaut. La permission `gmail.compose` a été retirée du manifeste. Le courrier et le CV ne dépendent plus d’un visuel de signature Gmail. Aucun email n’est envoyé. Un brouillon ne sera réactivé que sur demande explicite, après ajout de l’autorisation nécessaire et contrôle des brouillons existants.

19 tests locaux réussis sur la validation, les références, les citations et la sécurité. Un test réel Gemini → Google Docs → PDF Drive a réussi. Les documents de démonstration et leurs liens privés ne sont pas publiés dans le dépôt.
