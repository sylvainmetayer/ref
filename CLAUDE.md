# ref.sylvain.dev

Site de parrainage (Eleventy + Sveltia CMS, Cloudflare Pages). Voir README.md pour le modèle de données, les commandes `mise` et le déploiement.

## Rédaction

- Tout texte visible (avis par service, accueil, descriptions SEO) passe par le skill **humanizer** (plugin activé dans `.claude/settings.json`) : pas de tirets cadratins, pas de « pas X mais Y », pas de langage commercial.
- Tutoiement partout.
- Les avis reprennent l'usage réel de Sylvain : ne jamais inventer d'usage, de motivation ou de détail. Les conditions d'offre viennent de sources vérifiables (page officielle de préférence).
- Un service sans lien de parrainage reste en `draft: true`.

## Actions GitHub

- Les actions sont épinglées par SHA en ligne **et** verrouillées dans `.github/workflows/actions.lock` (`github/gh-actions-lock`, contrôlé par `verify-lockfile.yml`). Après tout ajout ou changement de `uses:`, lancer `gh actions-lock --no-narrow` (sans `--no-narrow`, l'outil réécrit les SHA en tags). Ne jamais éditer ni supprimer le verrou à la main : Renovate le régénère.
