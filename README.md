# ref.sylvain.dev

Liens et codes de parrainage, site statique [Eleventy](https://www.11ty.dev/) édité via [Sveltia CMS](https://github.com/sveltia/sveltia-cms).

## Développement

```bash
mise run dev      # http://localhost:8080, rechargement auto (sans les Functions : /go/ en 404)
mise run preview  # http://localhost:8788, émulateur Cloudflare Pages (Functions /go/ et /api/event)
mise run build    # génère _site/
mise tasks        # liste des tâches
```

Node 24 est installé par mise (`mise install`) ; les dépendances npm sont installées automatiquement par les tâches si `package.json` a changé.

## Contenu

Un fichier par service dans `src/referrals/<slug>.md` :

```yaml
---
title: "Hetzner"                         # nom du service
link: "https://hetzner.cloud/?ref=…"     # lien de parrainage (cible de /go/<slug>)
code: ""                                 # code à copier (optionnel)
category: "Cloud"                        # filtres de l'accueil
kind: "Parrainage"                       # Parrainage | Promo
gain: "20 €"                             # mis en avant, court
gainLabel: "de crédit"                   # précision sous le gain
advantage: "20 € de crédit offerts…"     # phrase complète, description SEO
tint: ""                                 # couleur de fond, vide = automatique
logo: ""                                 # /assets/logos/… (sinon initiale)
isNew: false                             # badge NOUVEAU
steps: []                                # étapes, vide = génériques
conditions: []                           # « Bon à savoir »
validUntil: 2026-12-31                   # optionnel
draft: false                             # true = non publié
---
Texte libre de la page (SEO), optionnel.
```

Le nom du fichier donne les URLs :

| URL | Rôle |
| --- | --- |
| `/<slug>/` | Page du service (SEO, partage) |
| `/go/<slug>` | Redirection 302 vers le lien de parrainage (Pages Function, compte le clic) |

`metaTitle` / `metaDesc` peuvent être ajoutés dans le frontmatter pour surcharger les valeurs générées.

## Édition (Sveltia CMS)

Interface sur `https://ref.sylvain.dev/admin/`, chaque modification est un commit sur `main`.

Connexion par token : créer un [fine-grained PAT GitHub](https://github.com/settings/personal-access-tokens/new) limité au dépôt `sylvainmetayer/ref`, permission **Contents : Read and write**, puis « Sign in with Token ».

## Analytics

Sans cookie ni identifiant. Deux sources :

- **Pages vues** : Cloudflare Web Analytics, à activer dans le projet Pages (*Metrics → Web Analytics*), le script est injecté automatiquement.
- **Événements** : [Workers Analytics Engine](https://developers.cloudflare.com/analytics/analytics-engine/), dataset `ref_events` (binding `EVENTS` dans `wrangler.toml`, créé à la première écriture).

| Événement | Déclencheur | Source |
| --- | --- | --- |
| `go` | Clic sur un lien de parrainage, ou lien `/go/<slug>` partagé | Pages Function `functions/go/[[path]].js` (côté serveur, insensible aux bloqueurs) |
| `copy` | Bouton « Copier » | `assets/main.js` → `POST /api/event` |
| `filter` | Filtre de catégorie sur l'accueil | idem |
| `other` | Carte « D'autres bonus » | idem |

Colonnes : `blob1` événement, `blob2` service, `blob3` page d'origine (`direct` si lien partagé), `blob4` filtre actif, `blob5` domaine référent externe (mémorisé pour la session), `blob6` pays, `blob7` appareil (`mobile`/`desktop`).

```bash
export CF_ACCOUNT_ID=… CF_API_TOKEN=…   # token avec la permission Account Analytics: Read
mise run stats                          # totaux par service et événement sur 30 jours
```

Exemple : d'où viennent les clics sortants ?

```sql
SELECT blob3 AS page, blob5 AS referent, SUM(_sample_interval) AS clics
FROM ref_events WHERE blob1 = 'go' AND timestamp > NOW() - INTERVAL '30' DAY
GROUP BY page, referent ORDER BY clics DESC
```

## Déploiement (Cloudflare Pages)

- Build command : `npm run build`
- Output directory : `_site` (lu aussi depuis `wrangler.toml`, avec le binding Analytics Engine)
- Functions : dossier `functions/` détecté automatiquement
- Version de Node : lue depuis `.node-version`
- Domaine personnalisé : `ref.sylvain.dev`

Sur sylvain.dev (Netlify), rediriger l'ancienne page dans `_redirects` :

```
/parrainage   https://ref.sylvain.dev/  301
/parrainage/* https://ref.sylvain.dev/  301
```
