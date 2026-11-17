# Tutoriel Cap.SO — sujet 7, environ 4 minutes

À tourner après configuration et test de Gemini et Discord. Ne pas filmer les propriétés privées, les jetons ou les URL des webhooks. Préparer un post récent et pertinent réellement lu, un salon de test privé, le tableur et le portail. Si la clé Gemini ne fonctionne pas, dire explicitement que la démonstration est partielle ; ne pas utiliser un résultat de test local comme preuve d’appel IA.

| Temps | Ce que je montre | Ce que je dis |
|---|---|---|
| 0:00–0:25 | Tableau, onglet DASHBOARD | « Voici mon agent de recommandation pour LinkedIn. J’ai choisi l’ESIEA comme acteur recommandé, depuis ma position réelle d’étudiant. L’outil propose un commentaire ; je garde la décision finale. » |
| 0:25–1:05 | Post public LinkedIn, puis extension | « Je sélectionne le texte du post et je copie son lien. Je vérifie la date et que le texte est complet, puis je l’envoie au tableau. L’extension ne publie rien sur mon compte. » |
| 1:05–1:45 | VEILLE_POSTS, ligne du nouveau post, puis JSON_Analyse | « Le système pseudonymise l’auteur et calcule une empreinte pour éviter les doublons. Gemini recherche un besoin compatible avec les formations de l’ESIEA. Les textes incomplets ou ambigus restent à relire. Ici, je montre le résultat réel de l’analyse. » |
| 1:45–2:20 | Commentaire_Généré, puis salon Discord privé | « Pour une opportunité retenue, l’agent propose d’abord un conseil utile, puis une recommandation. Le commentaire précise que je suis étudiant à l’ESIEA. Il n’invente pas de témoignage client. Je reçois la proposition dans Discord. » |
| 2:20–3:15 | Lien du portail, commentaire, boutons | « Le lien ouvre une page de vérification. Un simple clic dans Discord ne publie rien. Je peux rejeter la proposition ou approuver sa préparation. Après approbation, je copie le texte et j’ouvre le post. » |
| 3:15–3:40 | Validation du portail ; ou vraie publication manuelle si pertinente et souhaitée | « Ici, je valide la proposition. Pour une publication réelle, je colle le texte et je clique moi-même sur Publier dans LinkedIn. Je confirme ensuite seulement si le commentaire est effectivement visible. » |
| 3:40–4:05 | JOURNAL_LOGS, puis CONFIG.ACTIF=false | « Le journal garde les étapes. Le tableau de bord distingue les commentaires générés des publications déclarées. Le switch global coupe les nouvelles actions. Le quota limite les préparations à dix par jour. » |

La consigne autorise une démonstration jusqu’à la **publication/validation** : la validation humaine peut être montrée sans envoyer un commentaire inutile à un tiers. Dire alors « proposition validée, publication non effectuée ».

Pour gagner du temps, laisser un passage du déclencheur terminer avant de filmer la partie Discord, ou couper l’attente dans Cap.SO en l’indiquant. Ne pas présenter cette coupe comme un traitement instantané.
