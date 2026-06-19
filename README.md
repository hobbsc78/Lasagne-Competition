# Lasagne Competition

A Progressive Web App for judging a home lasagne cooking competition between two anonymous contestants.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The service worker is disabled during local development so browser refreshes always load the latest code. It is enabled automatically in production builds (for example on Vercel) to support PWA installability.

## Deploy to Vercel

Push this folder to a Git repository and import it in Vercel, or use the Vercel CLI.

Scores are submitted via the device email app to the organiser address configured in `src/lib/scoring.ts`.

## Assets

- Place the competition hero image in the landing page component when ready.
- Audio file: `public/audio/thats-amore-1.mp3`
