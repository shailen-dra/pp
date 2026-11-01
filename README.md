# Shailendra — Portfolio

A single-page portfolio built with Astro 5 and Tailwind CSS 4, deployed as a static site on Vercel.
All copy lives in [`src/data/profile.ts`](src/data/profile.ts).

## Local development

Requires Node 22.

```sh
npm install
npx playwright install chromium   # once, for e2e tests
npm run dev                       # http://localhost:4321
```

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Build to `dist/` |
| `npm run build:prod` | Fail if any placeholder remains, then build (used by Vercel) |
| `npm run preview` | Serve the built site |
| `npm test` | Unit tests (Vitest) |
| `npm run test:e2e` | End-to-end and accessibility tests (Playwright, against `astro preview`) |
| `npm run test:all` | Unit tests, build, then e2e tests |
| `npm run check:content` | List every remaining placeholder (`TBC_` values, `example.com`, stub CV/photo) |
| `npm run lhci` | Lighthouse CI on `dist/` (mobile, every category ≥ 95) |

## Owner setup

### 1. Contact form key (Web3Forms)

1. Go to <https://web3forms.com>, enter **shailendra.matat@gmail.com** and create an access key. It arrives by email.
2. Copy `.env.example` to `.env` and set `PUBLIC_WEB3FORMS_KEY=<your key>`.
3. Add the same variable in Vercel: **Project → Settings → Environment Variables**.

Without a key the form shows a friendly error with the email address instead of sending.

### 2. Replace placeholders

Production builds stop while any placeholder remains: a `TBC_` value, the `example.com` site URL,
or the stub `public/cv.pdf` / `public/photo.jpg`. List them with:

```sh
npm run check:content
```

At the time of writing these are:

- `profile.name`: full name as it should appear
- `contact.linkedin`, `contact.github`: profile URLs
- `journey.0.period`, `journey.0.title`: Matat start year and job title
- `journey.1.title`: job title at Rapid Web Solutions
- `journey.2.*`: education entry (or delete the entry)
- `skillGroups.3.items.1`, `skillGroups.3.items.2`: AI tools and full-stack tech
- `skillGroups.5.items.1`: other tooling

Also replace:

- `public/photo.jpg`: a square professional photo (800×800 or larger)
- `public/cv.pdf`: your CV
- `public/og.png`: the link preview image. Regenerate it once your full name is set:
  `python3 scripts/generate-og.py "Full Name"` (requires Pillow)

### 3. Publish to GitHub and Vercel

```sh
gh repo create shailendra-portfolio --private --source . --push
```

Then in Vercel: **Add New → Project → Import** the repository. `vercel.json` already sets the build command to
`npm run build:prod` and the output directory to `dist`, so placeholders block any deploy.

### 4. Domain

- **`.com.np`**: free for Nepali citizens via <https://register.com.np> (needs a citizenship copy and a cover letter).
  Point it at Vercel's nameservers or add the records Vercel shows under **Settings → Domains**.
- **`.dev` / `.com`**: buy from any registrar (or directly in Vercel) and add it under **Settings → Domains**.

After choosing a domain, update `site` in [`astro.config.mjs`](astro.config.mjs) and the `Sitemap:` line in
[`public/robots.txt`](public/robots.txt). Canonical URLs, Open Graph tags and the sitemap use it.
