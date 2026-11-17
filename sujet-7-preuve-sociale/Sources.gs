/* Extraits publics courts vérifiés le 17 novembre 2026 via recherche web.
 * Chaque extrait est INCOMPLET. Aucun auteur nominatif ajouté à la base.
 * Les dates relatives des moteurs ne sont pas une date de publication vérifiée.
 * Aucun de ces extraits n'est marqué comme analysé par Gemini avant appel réussi.
 */
const SOURCES_REELLES=[
 ['https://fr.linkedin.com/posts/sandra-bocciolini_urgent-digit-recherche-un-formateur-activity-7527308626122944512-C1Ff','DIGIT RECHERCHE UN FORMATEUR FREELANCE – COMPTIA CySA+ Nous recherchons un formateur ispécialisé dans la certification CompTIA Cybersecurity Analyst+'],
 ['https://fr.linkedin.com/posts/matthieu-gougne_je-recherche-un-formateur-sp%C3%A9cialis%C3%A9-en-activity-7503001952545570816-zVFf','Je recherche un formateur spécialisé en cybersécurité pour un de nos client. Besoin : accompagner une ingénieure cybersécurité'],
 ['https://fr.linkedin.com/posts/ifapmecharleroi_recherche-formateurformatrice-nous-activity-7452023355576205312-vUHd','Nous recherchons des formateurs/formatrices en cybersécurité pour dispenser au choix un ou plusieurs des modules suivants'],
 ['https://fr.linkedin.com/posts/oumaima-02a47a173_recrutement-formation-ia-activity-7525959429628895232-Ebo5','Nous recherchons un(e) formateur(trice) en Intelligence Artificielle confirmé(e) (4 - 5 ans ) pour intervenir sur des missions de formation'],
 ['https://fr.linkedin.com/posts/sonia-tahiat-26021986_intelligenceartificielle-formationprofessionnelle-activity-7518995578589126656-e6V1','Recherche d’un organisme de formation en intelligence artificielle (IA) Bonjour à tous, En tant que formatrice indépendante'],
 ['https://fr.linkedin.com/posts/mouhamad-omar-83b00884_cybersecurity-dfir-digitalforensics-activity-7513252533344112640-bGDq','Recherche de profils Cybersecurity / DFIR – Missions à Paris Dans le cadre de plusieurs besoins à court terme'],
 ['https://fr.linkedin.com/posts/romain-decouflet-capital-crypto_recherche-formateur-formatrice-en-intelligence-activity-7437735801377030144-3kKm','Recherche formateur / formatrice en Intelligence Artificielle (ChatGPT – niveau débutant) Dans le cadre de nos formations'],
 ['https://fr.linkedin.com/posts/tiffanylestroubac_cybers%C3%A9curit%C3%A9-cybersecurity-pentest-activity-7490793766811811840-B821','Nous recherchons un formateur en Cybersécurité – Vue Attaquant'],
 ['https://fr.linkedin.com/posts/adriensergent_je-recherche-une-formateurtrice-en-cybers%C3%A9curit%C3%A9-activity-7209231765125656576-HZbJ','Je recherche un(e) Formateur(trice) en Cybersécurité. TJM : 400-450 €/jour Mission du 27 Juin au 19 Juillet'],
 ['https://fr.linkedin.com/posts/coralie-balme-5b248052_cybers%C3%A9curit%C3%A9-formation-recrutement-activity-7231308151248044032-Hb8Q','À la recherche de formateurs en cybersécurité !'],
 ['https://fr.linkedin.com/posts/nesrine-r-ziad-2a339313a_nous-recrutons-une-formateurrice-d%C3%A9veloppement-activity-7513277959412035584-dLE2','Nous recrutons un·e Formateur·rice Développement en Intelligence Artificielle (H/F) Vous êtes Développeur·se IA, AI Engineer'],
 ['https://fr.linkedin.com/posts/julie-potier-b74094a5_microsoft-az400-ab730-activity-7511688318116478976-ffFe','Recherche formateur ou formatrice certifié sur les cours et/ou MCT Cours AB-730 Transform business workflows with generative AI'],
 ['https://fr.linkedin.com/posts/formation-secourisme-incendie-habilitationelectrique_je-recherche-un-formateur-ind%C3%A9pendant-sp%C3%A9cialis%C3%A9-activity-7516150668127281152-vrDY','Je recherche un formateur indépendant spécialisé en intelligence artificielle pour m’accompagner dans une montée en compétences avant la fin de l’année.'],
 ['https://fr.linkedin.com/posts/epr-consulting-sas_microsoft-azure-dp600-activity-7485234362930749441-fH7w','EPR Consulting recherche un(e) Formateur(trice) Microsoft DP-600 afin d’accompagner des participants dans leur préparation à la certification'],
 ['https://fr.linkedin.com/posts/steven-esteve-917852131_azure-ia-mct-activity-7369724439749365761-24SZ','Recherche Formateur Microsoft Azure IA Je recherche un formateur basé en France pour animer des sessions de formation']
];
function importerSourcesReelles(){const results=SOURCES_REELLES.map(([url,text])=>ingest_({url,text,author:'NON_COLLECTE',date:'INCONNUE — vérifier sur le post original',origin:'EXTRAIT_WEB_SOURCE_2026-11-17',truncated:true}));actualiserDashboard();console.log(JSON.stringify({importes:results.filter(x=>!x.duplicate).length,doublons:results.filter(x=>x.duplicate).length,analyseGeminiEffectuee:false}));}
