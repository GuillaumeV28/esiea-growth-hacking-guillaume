# Sujet 6 — deux vidéos courtes

## Installation — environ trois minutes

| Temps | À montrer | À dire |
|---|---|---|
| 0:00–0:25 | Dossier du sujet 6 sur GitHub | « Cet outil utilise Google Sheets comme un canevas de blocs. Les formules relient les étapes et Apps Script exécute les tâches prêtes. Notre exemple transforme un brief en programme de formation, puis en graphique PNG. » |
| 0:25–0:55 | Import du XLSX, puis Fichier → Enregistrer au format Google Sheets | « J’importe le modèle Sujet6_Cascade_Prompts_Guillaume.xlsx sur mon compte, puis je le convertis au format Google Sheets. Le canevas contient quatre blocs de deux colonnes et cinq lignes. » |
| 0:55–1:30 | Extensions → Apps Script, Code.gs et appsscript.json | « Je colle le fichier Code.gs dans l’éditeur. Dans les paramètres, j’affiche le manifeste appsscript.json et je remplace son contenu par celui fourni. J’enregistre, puis j’exécute installer en autorisant les accès Google nécessaires. Aucun déploiement Web ou extension n’est nécessaire. » |
| 1:30–2:05 | Propriétés privées, puis projet sans frais dans AI Studio | « Je conserve la clé Gemini uniquement dans les propriétés privées du script, sous GEMINI_API_KEY. Je vérifie que le projet possède un quota gratuit disponible, puis je l’indique dans CONFIG. Aucune facturation n’est activée pour l’exercice. » |
| 2:05–2:35 | CONFIG, champs GEMINI_MODEL et PARTAGER_IMAGES | « Le modèle de texte est renseigné ici. Le visuel est produit gratuitement par Google Charts à partir des données préparées par l’IA. Ce n’est pas une image Nano Banana. J’autorise uniquement les PNG pédagogiques à être accessibles par lien si je souhaite leur affichage avec IMAGE. Le tableau reste privé. » |
| 2:35–3:00 | Fonction testerGemini, puis menu Cascade IA | « Je lance testerGemini pour vérifier un vrai appel. Après actualisation du tableau, le menu Cascade IA permet de lancer, reprendre ou arrêter le traitement. L’installation est terminée. » |

## Utilisation — environ trois minutes

| Temps | À montrer | À dire |
|---|---|---|
| 0:00–0:30 | CANEVAS, quatre blocs | « Chaque bloc possède un nom, un statut, un modèle, une entrée et une sortie. Ici, le brief alimente le programme, le programme alimente les données du visuel et le dernier bloc produit le PNG. » |
| 0:30–0:55 | B6 puis E6 et E4 dans la barre de formule | « Je peux modifier le brief jaune. L’entrée du bloc suivant référence la sortie précédente. Son statut attend que l’étape précédente soit terminée : les formules du tableau font donc le câblage et l’ordonnancement. » |
| 0:55–1:20 | Cascade IA → Exécuter la cascade | « Je lance la cascade. Le worker recherche les ancres NODE et exécute seulement les blocs prêts. Il ne parcourt pas lui-même un arbre de dépendances. Je coupe le temps d’attente dans cette vidéo. » |
| 1:20–1:55 | E7 puis E15 | « Gemini a rédigé le programme, puis un second appel l’a converti en JSON. Les trois durées doivent totaliser soixante minutes. Le script contrôle ce format avant de créer le graphique. » |
| 1:55–2:25 | H15 puis fichier PNG dans Drive | « Le dernier bloc transforme ces données en PNG avec Google Charts. Le fichier est enregistré dans le dossier Drive indiqué dans CONFIG. Les durées sont une proposition de programme, pas des statistiques sur des salariés. » |
| 2:25–3:00 | ETATS, JOURNAL et menu d’arrêt | « Le journal garde les étapes et les erreurs. Une étape terminée n’est pas relancée à chaque clic. Pour changer le brief, je réinitialise les résultats avant de relancer. En cas de saturation Gemini, le tableau indique une attente et la date de reprise. Je peux arrêter les nouvelles actions depuis le menu. » |

Ne pas montrer la clé API. Ne pas présenter un ancien résultat comme celui d’une nouvelle exécution. Ne pas dire que des vidéos, des photos Nano Banana ou des appels payants ont été générés : cette version produit du texte et un graphique PNG.
