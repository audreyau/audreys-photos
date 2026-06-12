# Audrey's Photos

A personal photography website built with React, TypeScript, and Tailwind CSS. Features a masonry gallery, collection grouping, interactive map, and a full image optimization pipeline.

## Features

- **Masonry gallery** with blur-up loading placeholders and responsive srcset
- **Collections** — group photos by shoot/trip/theme
- **Configurable highlights** — choose which photos appear on the home page and in what order
- **Interactive map** — pins for each collection location (Leaflet + OpenStreetMap)
- **Dark/light/system mode** — toggle with localStorage persistence
- **Page transitions** — smooth fade animations between pages
- **Scroll reveal** — photos fade in as you scroll
- **Lightbox** — fullscreen viewer with keyboard nav and mobile swipe gestures
- **PWA** — installable, works offline via service worker
- **SEO** — dynamic Open Graph meta tags per page
- **Accessibility** — ARIA labels, keyboard navigation, reduced motion support
- **CI/CD** — GitHub Actions with Lighthouse audit
- **Testing** — Vitest unit tests + Playwright E2E tests

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Adding Photos

1. Drop images into `public/photos/` — subfolders become collections:

```
public/photos/
  trip-to-portland/
    bridge.jpg
    coffee-shop.jpg
  golden-hour/
    sunset.jpg
  random-pic.jpg          ← no collection, gallery only
```

2. Edit `public/photos/config.json` to control the gallery and collections:

```json
{
  "gallery": [
    "trip-to-portland/bridge.jpg",
    "golden-hour/sunset.jpg"
  ],
  "collections": {
    "trip-to-portland": {
      "cover": "bridge.jpg",
      "description": "Weekend in Portland",
      "category": "Moments"
    },
    "golden-hour": {
      "cover": "sunset.jpg",
      "description": "Chasing light",
      "description": "Landscapes"
    }
  }
}
```

3. Run the build scripts:

```bash
npm run photos      # regenerate photo data from folders + config
npm run optimize    # generate WebP images + blur placeholders
```

### config.json reference

| Field | Description |
|-------|-------------|
| `gallery` | Array of photo IDs (e.g. `"folder/file.jpg"`) to show on the home page, in order. If empty, all photos are shown. |
| `collections.[id].cover` | Filename to use as the collection cover image |
| `collections.[id].description` | Subtitle text for the collection |
| `collections.[id].location` | `{ lat, lng, label? }` — adds a pin on the map page |

**Note:** A collection only appears if a matching folder with images exists in `public/photos/`. Config entries without a corresponding folder are ignored.

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build (runs optimize + photos automatically) |
| `npm run photos` | Regenerate `src/data/photos.ts` from folders + config |
| `npm run optimize` | Generate WebP at 4 sizes + blur placeholders |
| `npm test` | Run unit tests (Vitest) |
| `npm run test:e2e` | Run E2E tests (Playwright, requires build first) |
| `npm run preview` | Preview production build locally |

## Deploying

### Vercel

Connect your repo — Vercel auto-detects Vite. The `vercel.json` handles SPA routing.

### GitHub Pages

Run `npm run build` and deploy the `dist/` folder. The `public/404.html` handles client-side routing for SPAs.

## Tech Stack

- **Vite** — build tool
- **React 19** + TypeScript
- **Tailwind CSS v4**
- **Framer Motion** — page transitions and scroll animations
- **Leaflet** + React Leaflet — map view
- **Sharp** — image optimization (WebP generation, blur placeholders)
- **Vitest** — unit testing
- **Playwright** — E2E testing
- **GitHub Actions** — CI with Lighthouse audits

## Project Structure

```
src/
  components/       UI components (gallery, lightbox, nav, etc.)
  pages/            Route pages (Gallery, Collections, Map, About)
  data/             Generated photo data + image optimization data
  test/             Unit tests
scripts/
  generate-photo-data.ts    Scans photo folders + config → photos.ts
  optimize-images.ts        Generates WebP + blur placeholders
public/
  photos/           Your original images (organized in folders)
  photos-optimized/ Generated WebP images (gitignored)
  sw.js             Service worker for offline support
e2e/                Playwright E2E tests
.github/workflows/  CI pipeline
```
