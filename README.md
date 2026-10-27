# news-JS

News portal on TypeScript, migrated from the original JavaScript app. Data comes from [News API](https://newsapi.org/).

## Run application

- Copy `.env.example` to `.env` and set variables with your data:
  - `API_URL` — News API base url (with trailing slash). For the deployed version and local development use the course proxy `https://rss-news-api.onrender.com/` (or `https://rss-news-api.onrender.com/mocks/` for static mock data)
  - `API_KEY` — your key from [newsapi.org](https://newsapi.org/)
- Install dependencies: `npm install`
- Start dev server: `npm start`

## Scripts

- `npm start` — dev server
- `npm run build` — production build to `dist`
- `npm run lint` — ESLint with `typescript-eslint`
- `npm run typecheck` — `tsc --noEmit` with `strict`
- `npm run deploy` — build and publish `dist` to `gh-pages`

## Caching

`Loader` caches API responses in memory and in `sessionStorage` to save the News API request limit: sources for 60 minutes, news for 10 minutes. Failed requests are not cached.
