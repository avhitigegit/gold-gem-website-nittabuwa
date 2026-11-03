# Mr.Sapphire website — mrsapphire.com

Static site: `index.html`, `css/`, `js/`, `images/`. No build step.

## Deploy
Commit and push to `main` → Cloudflare Worker **mrsapphire** deploys it to https://mrsapphire.com.
Manual fallback: `npx wrangler deploy`.

## Prices
Gem and jewelry prices, notes and show/hide come from the client's Google Sheet
(published as CSV, link in `CONFIG.pricesUrl` in `js/main.js`). Edits appear on the site
within ~5 minutes — no deploy needed. Built-in prices in `js/main.js` are only a fallback.

New rings need a photo in `images/products/<id>.webp` plus an entry in `PRODUCTS` in `js/main.js`.
