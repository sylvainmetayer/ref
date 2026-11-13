# Feuille de route SEO : ref.sylvain.dev (2026-11-13)

Verdict : la technique est propre, mais personne ne pointe vers le site et les fiches sont courtes face aux agrégateurs.

| # | Niveau | Problème | Ce que ça bloque | Correctif | Qui | État |
|---|---|---|---|---|---|---|
| 1 | REVENU | « D'autres bonus » affichait toujours les 4 mêmes fiches (les premières de l'alphabet), les 14 autres n'avaient aucun lien depuis une fiche | Les fiches sans lien interne remontent moins | Filtre `related` : même catégorie d'abord, puis rotation. Chaque fiche reçoit 2 à 7 liens | agent | fait |
| 2 | REVENU | 10 titres sur 18 dépassaient 60 caractères à cause du suffixe « · Sylvain » et du préfixe « Lien de parrainage » | L'avantage chiffré était coupé dans Google, donc moins de clics | Préfixe « Parrainage », suffixe seulement si le titre fait 50 caractères ou moins | agent | fait |
| 3 | CUMULATIF | Aucun `llms.txt` | Les assistants IA doivent deviner la liste des offres | `/llms.txt` généré depuis les fiches | agent | fait |
| 4 | CUMULATIF | Aucun lien entrant visible : la page d'accueil de www.sylvain.dev ne pointe pas vers ref.sylvain.dev (seule la redirection 301 de `/parrainage` existe) | Sans autorité, les requêtes « parrainage X » restent aux agrégateurs | Lien dans la navigation ou le pied de page de www.sylvain.dev, puis profil GitHub et README des dépôts publics | Sylvain | à faire |
| 5 | REVENU | Indexation non vérifiée (pas d'accès à la Search Console) | Une fiche non indexée ne rapporte rien | Search Console : soumettre le sitemap, inspecter les 18 URL, relever les requêtes qui affichent déjà le site | Sylvain | à faire |
| 6 | REVENU | Avis de 31 à 94 mots par fiche | Pages jugées minces face à des pages concurrentes de 500 mots et plus | Étoffer les avis avec ton usage réel (depuis quand, quelle formule, ce qui t'a gêné) et les conditions officielles sourcées. Commencer par les banques, où la prime est la plus forte | Sylvain, puis agent pour la mise en forme | à faire |
| 7 | REVENU | 4 fiches sans montant (Boursorama, Revolut, Philibert, Infomaniak) | Un titre sans chiffre attire moins de clics | Relever le montant de la campagne en cours dans chaque espace client et le dater avec `validUntil` | Sylvain | à faire |
| 8 | REVENU | L'année n'apparaît dans aucun titre alors que la requête type est « code parrainage X 2026 » | Clics perdus sur les recherches datées | À décider : ajouter l'année de build au titre. Non fait, car je n'ai pas pu comparer avec les résultats Google | Sylvain | à décider |
| 9 | REVENU | 8 brouillons sans lien (Bouygues Telecom, Coinbase, Gaz de Bordeaux, Jow, Mutuelle de Poitiers, PikaPods, Uber Eats, Yves Rocher) et Backblaze ajouté aujourd'hui | 9 pages qui pourraient se positionner n'existent pas | Récupérer les liens dans chaque espace client | Sylvain | à faire |

## Vérifié, rien à corriger

- `robots.txt` ouvert par défaut, `/go/` et `/admin/` exclus, sitemap déclaré et valide (19 URL).
- 404 réelle sur une URL inconnue, HTTP vers HTTPS, barre oblique finale en 308.
- GPTBot, OAI-SearchBot, PerplexityBot, ClaudeBot et Bingbot reçoivent 200, et l'avantage est en texte dans le HTML.
- Canonique, Open Graph et fil d'Ariane JSON-LD sur chaque fiche. Liens sortants en `rel="sponsored nofollow"`.

## Détails (à ignorer tant que les lignes du haut ne sont pas traitées)

- Pas de `lastmod` dans le sitemap, image Open Graph identique sur toutes les pages.
