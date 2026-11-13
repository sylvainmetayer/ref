# ref.sylvain.dev

Liens et codes de parrainage, site statique [Eleventy](https://www.11ty.dev/) édité via [Sveltia CMS](https://github.com/sveltia/sveltia-cms).

## Développement

```bash
mise run dev      # http://localhost:8080, rechargement auto (sans les Functions : /go/ en 404)
mise run preview  # http://localhost:8788, émulateur Cloudflare Pages (Function /go/)
mise run build    # génère _site/
mise tasks        # liste des tâches
```

Node 26 est installé par mise (`mise install`) ; les dépendances npm sont installées automatiquement par les tâches si `package.json` a changé.

## Contenu

Un fichier par service dans `src/referrals/<slug>.md` :

```yaml
---
title: "Hetzner"                         # nom du service
link: "https://hetzner.cloud/?ref=…"     # lien de parrainage (cible de /go/<slug>)
code: ""                                 # code à copier (optionnel)
category: "Cloud et tech"                # filtres de l'accueil, page catégorie
kind: "Parrainage"                       # Parrainage | Promo
gain: "20 €"                             # mis en avant, court
gainLabel: "de crédit"                   # précision sous le gain
advantage: "20 € de crédit offerts…"     # phrase complète, description SEO
tint: ""                                 # couleur de fond, vide = automatique
logo: ""                                 # /assets/logos/… (sinon initiale)
date: 2026-10-15                         # date d'ajout : badge Nouveau 60 jours (vide = jamais)
steps: []                                # étapes, vide = génériques
conditions: []                           # « Bon à savoir »
validUntil: 2026-12-31                   # optionnel
faq: []                                  # questions fréquentes : { q, a }, réponses sourcées
sources: []                              # sources officielles : { label, url }
verifiedOn: 2026-11-13                   # date du relevé des conditions
draft: false                             # true = non publié
---
Texte libre de la page (SEO), optionnel.
```

Le nom du fichier donne les URLs :

| URL | Rôle |
| --- | --- |
| `/<slug>/` | Page du service (SEO, partage) |
| `/parrainage-<catégorie>/` | Page d'une catégorie, générée dès 3 fiches publiées |
| `/go/<slug>` | Redirection 302 vers le lien de parrainage (Pages Function) |

`metaTitle` / `metaDesc` peuvent être ajoutés dans le frontmatter pour surcharger les valeurs générées.

## Édition (Sveltia CMS)

Interface sur `https://ref.sylvain.dev/admin/`, chaque modification est un commit sur `main`.

Connexion par token : créer un [fine-grained PAT GitHub](https://github.com/settings/personal-access-tokens/new) limité au dépôt `sylvainmetayer/ref`, permission **Contents : Read and write**, puis « Sign in with Token ».

## Analytics

Pages vues uniquement, sans cookie ni identifiant : Cloudflare Web Analytics, beacon inclus par `base.njk` avec le jeton `cfBeaconToken` de `src/_data/site.json`.

## Déploiement (Cloudflare Pages)

- Build command : `npm run build`
- Output directory : `_site` (lu aussi depuis `wrangler.toml`)
- Functions : dossier `functions/` détecté automatiquement
- Version de Node : lue depuis `.node-version`
- Domaine personnalisé : `ref.sylvain.dev`

Sur sylvain.dev (Netlify), rediriger l'ancienne page dans `_redirects` :

```
/parrainage   https://ref.sylvain.dev/  301
/parrainage/* https://ref.sylvain.dev/  301
```
