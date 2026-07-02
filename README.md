# GoCRM — Site vitrine

Site vitrine statique (HTML/CSS/JS vanilla, sans framework ni étape de build)
pour GoCRM, plateforme SaaS CRM/ERP tout-en-un. Une seule page (`index.html`)
avec navigation par ancres, plus deux pages légales séparées.

## Structure du projet

```
gocrm-site/
├── index.html                          # Page unique : hero, modules, contact...
├── sitemap.xml
├── robots.txt
├── css/
│   └── styles.css                      # Variables de marque, layout, animations
├── js/
│   └── main.js                         # Nav mobile, reveal au scroll, formulaire
├── assets/
│   ├── gocrm-logo.png                  # Logo fourni
│   └── favicon.svg                     # Favicon dérivé du logo (marque "O" + flèche)
└── pages/
    ├── mentions-legales.html
    └── politique-confidentialite.html
```

## Design

- **Palette stricte** : orange `#FD5320`, bleu marine `#011134`, noir `#020202`,
  blanc cassé `#F5F5F5` — définie en variables CSS dans `:root` (`css/styles.css`).
- **Typographies** : *General Sans* (titres, via Fontshare CDN) et *IBM Plex Sans*
  (texte courant, via Google Fonts CDN).
- **Élément signature** : la flèche orange du logo est reprise comme "ligne de
  croissance" SVG animée dans le hero, et comme barre de progression de lecture
  fixée en haut de la page.
- Toutes les animations respectent `prefers-reduced-motion`.

## Formulaire de contact

Le formulaire (`#contactForm` dans `index.html`, logique dans `js/main.js`)
valide les champs côté front et **simule** l'envoi (pas de backend). Pour un
envoi réel en production, brancher un service statique comme
[Formspree](https://formspree.io) : changer l'`action`/`method` du `<form>`
et remplacer le `setTimeout` de simulation dans `js/main.js` par un `fetch()`
vers le point de terminaison Formspree.

## Pages légales

`pages/mentions-legales.html` et `pages/politique-confidentialite.html`
contiennent une structure standard avec des champs entre crochets
(`[Raison sociale à compléter]`, etc.) — **à compléter avec les informations
juridiques réelles de l'entité exploitant GoCRM avant mise en ligne.**

## Domaine

`sitemap.xml`, `robots.txt` et les balises `og:` de `index.html` utilisent le
domaine provisoire `https://gocrm.example/` — à remplacer par le nom de
domaine réel avant déploiement (rechercher/remplacer `gocrm.example`).

## Tester en local

Aucune dépendance à installer. Ouvrir `index.html` directement dans un
navigateur, ou servir le dossier avec un serveur statique simple :

```bash
# Python
python -m http.server 8080

# Node (si npx est disponible)
npx serve .
```

Puis ouvrir `http://localhost:8080`.

## Déploiement sur GitHub Pages

1. Pousser le contenu de ce dossier à la racine d'un dépôt GitHub (ou dans
   `/docs` si vous préférez cette convention).
2. Dans **Settings → Pages** du dépôt, choisir la branche et le dossier
   racine (`/` ou `/docs`) comme source.
3. Le site est servi avec des chemins relatifs (`css/`, `js/`, `assets/`,
   `pages/`) — aucune configuration supplémentaire n'est nécessaire.
4. Mettre à jour `sitemap.xml`, `robots.txt` et les balises `og:url`/`canonical`
   de `index.html` avec l'URL GitHub Pages ou le domaine personnalisé final.

## Modifier le contenu

- Copie et modules : directement dans `index.html`, sections commentées par
  bloc (`<!-- HERO -->`, `<!-- MODULES -->`, etc.).
- Couleurs et typographies : variables en haut de `css/styles.css`.
- Comportements (menu mobile, reveal au scroll, formulaire) : `js/main.js`.
