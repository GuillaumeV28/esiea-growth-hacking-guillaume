# Connexions privées du sujet 7

## Déjà installé sur le compte Guillaume

- [Tour de contrôle Google Sheets](https://docs.google.com/spreadsheets/d/1DAltRcnqPnq-buF3auCJAVSPyHEKWT32THhNlRw__qs/edit)
- [Projet Apps Script du sujet 7](https://script.google.com/u/0/home/projects/1BACo_7zkDiaHhHV5fkRTOjt5XDKErLBHe-dT_mdL_zE9RXQZ6WRNaOqN/edit)
- Point de réception déployé, protégé par INGEST_TOKEN et signatures de décision.
- WEBAPP_URL déjà renseignée dans les propriétés privées. AUTHOR_SALT et SIGNING_SECRET générés automatiquement.
- CONFIG.ACTIF=false. Le traitement automatique reste désactivé tant que Gemini n’est pas prêt.

Les fichiers Code.gs et Sources.gs sont réunis dans un seul Code.gs dans le projet installé ; le dépôt les sépare pour faciliter leur lecture. Les deux organisations sont équivalentes.

## Gemini

Un projet séparé **ESIEA Sujet7 Guillaume** a été créé dans AI Studio, sans activation de facturation. L’ancien Default Gemini Project est au niveau 1 sans crédits et n’est pas utilisé pour ce sujet.

La création d’une nouvelle clé et son enregistrement privé nécessitent encore l’accord demandé dans la conversation. Une fois créée : dans Apps Script → Paramètres du projet → Propriétés du script → GEMINI_API_KEY. Ne jamais coller la clé dans ce fichier, CONFIG, GitHub ou une vidéo. Vérifier le quota du projet et le modèle disponible avant l’activation.

## Discord

Discord affiche l’écran de connexion. Se connecter personnellement, puis utiliser un serveur de test privé. Paramètres du salon → Intégrations → Webhooks. Le webhook doit être créé dans un salon autorisé ; renseigner son URL uniquement dans la propriété privée DISCORD_WEBHOOK du script.

Pour la validation finale : tester Gemini, compléter un post récent compatible, activer le traitement, recevoir la notification et vérifier le portail. La vidéo reste à enregistrer après ce test.
