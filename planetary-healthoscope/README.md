# Planetary Healthoscope

An AI-powered planetary health intelligence dashboard — "the stethoscope for Earth" — built by Planetary Health Pakistan.

## Local development

```bash
npm install
npm run dev
```

## Build for production

```bash
npm run build
```

Output goes to `dist/`.

## Deploy

### Vercel / Netlify
Import this repo directly — both auto-detect Vite. Build command: `npm run build`, output directory: `dist`.

### GitHub Pages
A ready-to-use workflow is included at `.github/workflows/deploy.yml`. Push to `main` and enable
GitHub Pages (Settings → Pages → Source: GitHub Actions) — it will build and deploy automatically.
