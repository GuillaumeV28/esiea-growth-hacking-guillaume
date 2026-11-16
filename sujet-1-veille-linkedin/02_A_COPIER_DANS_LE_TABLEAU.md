# Contenu à mettre dans les colonnes de la capture

La capture ne montre pas les numéros de lignes. Les indications ci-dessous désignent les cellules vides sous les consignes, sans inventer de coordonnées.

## Colonne F — PROMPTS À UTILISER

Dans la première cellule libre, coller :

```text
Entreprise choisie : CyberCap Formation, entreprise fictive de formation professionnelle en cybersécurité B2B. Cible : entreprises de plus de 200 salariés en France ; priorité santé, énergie, finance, transport, défense, eau et numérique. Décideurs : DSI, RSSI, direction générale et responsables formation. Offre : formation collective pratique, budget hypothétique de 15 000 € par groupe.
```

Puis coller le bloc ci-dessous dans les cellules suivantes : **une ligne du bloc par cellule de F**. Ce sont des recherches de PUBLICATIONS, conformément au sujet Word.

```text
"besoin de formation" AND cybersécurité
"recherche formation" AND cybersécurité
NIS2 AND compétences
DORA AND formation
"ISO 27001" AND formation
"recrutement" AND RSSI
"exercice de crise" AND cyber
"sensibilisation" AND cybersécurité
```

Si une seule cellule est disponible pour les termes, coller les huit lignes dans cette cellule en mode édition. Les requêtes sont indépendantes et ne doivent pas être fusionnées en une seule longue recherche.

Ces mots-clés sont des hypothèses à tester ; aucun volume de résultats n'est garanti. Les requêtes Emplois du deuxième prompt se trouvent dans le document des réponses et ne doivent pas remplacer ces recherches de posts.

Ajouter dans la cellule destinée aux résultats des prompts, ou dans une note si la place manque :

```text
Réponses aux deux prompts : voir le document « 01_REPONSES_AUX_DEUX_PROMPTS », contenant les signaux firmographiques, les formules Gemini et 18 requêtes LinkedIn Emplois. Les signaux sont des indices à qualifier, pas des preuves d'intention d'achat.
```

Si le rendu doit être consultable par lien, déposer ce document dans Drive et remplacer cette dernière phrase par son lien de partage.

## Colonne G — TUTORIEL D'INSTALLATION

Cette colonne attend un **lien de vidéo Cap.so**, pas uniquement un texte explicatif. Après enregistrement, coller ce texte en remplaçant le crochet :

```text
Tutoriel d'installation CyberCap Veille : création du Google Sheet de veille, installation du script, paramétrage privé de Gemini, déploiement et chargement de l'extension Chrome. Vidéo Cap.so : [COLLER LE LIEN DE LA VIDÉO D'INSTALLATION].
```

Le déroulé complet à filmer est dans `04_GUIDES_ET_VIDEOS.md`. Une vidéo n'a pas encore été enregistrée.

## Colonne H — TUTORIEL D'UTILISATION

Après la démonstration dans ton navigateur, coller :

```text
Tutoriel d'utilisation CyberCap Veille : réglage des mots-clés dans le tableur, collecte d'un lot, synchronisation, classification, déduplication, prochaine échéance, arrêt simulé sur CAPTCHA et arrêt final de la séance. Vidéo Cap.so : [COLLER LE LIEN DE LA VIDÉO D'UTILISATION].
```

Il faut filmer les résultats réellement obtenus. Ne pas présenter une simulation comme un blocage réel de LinkedIn.

## Colonne I — VOTRE OUTIL Tous les fichiers

Déposer `CyberCap_veille.zip` dans Drive, donner l'accès en lecture à l'enseignant puis coller :

```text
CyberCap Veille — fichiers d'installation, extension Chrome, Google Apps Script, réponses aux prompts, guides d'installation et d'utilisation et tests locaux. Dossier de l'outil : [COLLER LE LIEN DRIVE DU ZIP OU DU DOSSIER PARTAGÉ].
```

Le chemin d'un fichier sur ton ordinateur ne fonctionne pas pour l'enseignant : il faut un lien accessible depuis son compte. Ne pas inclure de jeton, de clé API, de mot de passe ou de cookie dans le dossier partagé.
