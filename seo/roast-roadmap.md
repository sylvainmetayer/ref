# Feuille de route SEO : ref.sylvain.dev (2026-11-13)

Verdict : la technique est propre, mais personne ne pointe vers le site et les fiches sont courtes face aux agrégateurs.

| # | Niveau | Problème | Ce que ça bloque | Correctif | Qui | État |
|---|---|---|---|---|---|---|
| 1 | REVENU | « D'autres bonus » affichait toujours les 4 mêmes fiches (les premières de l'alphabet), les 14 autres n'avaient aucun lien depuis une fiche | Les fiches sans lien interne remontent moins | Filtre `related` : même catégorie d'abord, puis rotation. Chaque fiche reçoit 2 à 7 liens | agent | fait |
| 2 | REVENU | 10 titres sur 18 dépassaient 60 caractères à cause du suffixe « · Sylvain » et du préfixe « Lien de parrainage » | L'avantage chiffré était coupé dans Google, donc moins de clics | Préfixe « Parrainage », suffixe seulement si le titre fait 50 caractères ou moins | agent | fait |
| 3 | CUMULATIF | Aucun `llms.txt` | Les assistants IA doivent deviner la liste des offres | `/llms.txt` généré depuis les fiches | agent | fait |
| 4 | CUMULATIF | Aucun lien entrant visible : la page d'accueil de www.sylvain.dev ne pointe pas vers ref.sylvain.dev (seule la redirection 301 de `/parrainage` existe) | Sans autorité, les requêtes « parrainage X » restent aux agrégateurs | Lien dans la navigation ou le pied de page de www.sylvain.dev, puis profil GitHub et README des dépôts publics | Sylvain | à faire |
| 5 | REVENU | Indexation non vérifiée (pas d'accès à la Search Console) | Une fiche non indexée ne rapporte rien | Search Console : soumettre le sitemap, inspecter les 18 URL, relever les requêtes qui affichent déjà le site | Sylvain | à faire |
| 6 | REVENU | Avis de 31 à 94 mots par fiche | Pages jugées minces face à des pages concurrentes de 500 mots et plus | Étoffer les avis avec ton usage réel. Questions par fiche dans `seo/questionnaire-avis.md` : tu réponds, l'agent rédige | Sylvain, puis agent | à faire |
| 7 | REVENU | 2 fiches sans montant : Boursorama et Revolut. Philibert est réglé (5 €). Infomaniak est une affiliation sans avantage client, donc sans montant à afficher | Un titre sans chiffre attire moins de clics | Boursorama : la campagne change chaque semaine (180 € le 13 novembre, 260 € du 18 au 24 novembre 2026), un chiffre en titre serait faux au bout de quelques jours. Revolut : montant visible seulement dans l'app, à relever et à dater avec `validUntil` | Sylvain | à décider |
| 8 | REVENU | L'année n'apparaît dans aucun titre alors que la requête type est « code parrainage X 2026 » | Clics perdus sur les recherches datées | Année du build dans le `<title>` des fiches et des catégories (après le nom du service, y compris pour les `metaTitle` surchargés). Le H1 ne change pas | agent | fait (23 nov.) |
| 10 | REVENU | Absent de l'index Bing au 23 novembre (`site:ref.sylvain.dev` vide). Bing alimente ChatGPT Search et Copilot | Invisible pour les assistants IA qui cherchent en direct | Activer Crawler Hints (Cloudflare, Caching > Configuration) pour IndexNow, puis Bing Webmaster Tools importé depuis la Search Console, et y soumettre le sitemap | Sylvain | à faire |
| 11 | REVENU | Pages catégories sans texte ni données structurées | Rien à citer pour « parrainage banque », « meilleure prime » | Tableau comparatif (avantage, validité, date de relevé), fil d'Ariane et ItemList JSON-LD | agent | fait (23 nov.) |
| 12 | CUMULATIF | Les IA n'avaient que la liste courte | Codes, conditions et FAQ absents de llms.txt | `/llms-full.txt` (fiche complète par service) et codes ajoutés dans `llms.txt`. Fiches : fil d'Ariane avec catégorie, WebPage avec `dateModified` et auteur | agent | fait (23 nov.) |
| 9 | REVENU | 8 brouillons sans lien (Bouygues Telecom, Coinbase, Gaz de Bordeaux, Jow, Mutuelle de Poitiers, PikaPods, Uber Eats, Yves Rocher) et Backblaze ajouté aujourd'hui | 9 pages qui pourraient se positionner n'existent pas | Récupérer les liens dans chaque espace client | Sylvain | à faire |

## Vérifié, rien à corriger

- `robots.txt` ouvert par défaut, `/go/` et `/admin/` exclus, sitemap déclaré et valide (24 URL au 19 novembre).
- 404 réelle sur une URL inconnue, HTTP vers HTTPS, barre oblique finale en 308.
- GPTBot, OAI-SearchBot, PerplexityBot, ClaudeBot et Bingbot reçoivent 200, et l'avantage est en texte dans le HTML.
- Canonique, Open Graph et fil d'Ariane JSON-LD sur chaque fiche. Liens sortants en `rel="sponsored nofollow"`.

## Détails (à ignorer tant que les lignes du haut ne sont pas traitées)

- `lastmod` dans le sitemap (tiré de `verifiedOn`) et image Open Graph par fiche : faits.
- EDF et La Banque Postale expirent le 31 décembre 2026. Au 19 novembre, aucune des deux pages officielles n'annonce la suite : relever les conditions 2027 début janvier.
