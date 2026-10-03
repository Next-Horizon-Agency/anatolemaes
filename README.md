# Anatole Maes, CV en ligne

One page Next.js 15 + Tailwind v4 + Motion (`motion/react`) + Lenis.

```bash
npm install
npm run dev
```

## Médias

Déposer les fichiers dans :

- `public/media/photos/` : `.jpg`, `.png`, `.webp`, `.avif`
- `public/media/videos/` : `.mp4` (H.264) ou `.webm`
- `public/media/posters/` : image de couverture d'une vidéo, même nom de base (`showreel.mp4` → `showreel.jpg`)

`npm run media` régénère `src/data/media.json` (fait automatiquement avant `dev` et `build`).
L'ordre suit le nom de fichier : préfixer par `01-`, `02-`… pour ordonner. Le préfixe est retiré du titre.
La première vidéo paysage sert de fond au hero.

## Structure

- `src/data/content.ts` : textes (profil, parcours, compétences, contact)
- `src/components/` : une section par fichier (Hero, About, Timeline, Skills, Projects, Contact)
