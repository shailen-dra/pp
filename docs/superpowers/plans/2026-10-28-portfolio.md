# Personal Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Shailendra's single-page portfolio, which gets recruiters and clients to get in touch, as a fast, static Astro site deployable to Vercel.

**Architecture:** A static Astro site. All copy lives in one typed data file (`src/data/profile.ts`), and each page section is its own Astro component that reads from it. The only client JS is the theme toggle, the mobile menu, scroll reveal and the contact form submit. The contact form posts to Web3Forms and still works without JS.

**Tech Stack:** Astro 5, Tailwind CSS 4 (`@tailwindcss/vite`), TypeScript, Vitest (unit), Playwright + `@axe-core/playwright` (e2e/a11y), `@lhci/cli` (Lighthouse), `@astrojs/sitemap`.

**Spec:** `docs/superpowers/specs/2026-10-28-portfolio-design.md`

## Global Constraints

- Project root: `/Users/shailendra/Desktop/matat/personall-project`. The Astro app lives at the root.
- Single page with anchors `#about`, `#skills`, `#journey`, `#contact`; nav order is About · Skills · Journey · Contact.
- No project gallery, no client work, no screenshots, no blog/CMS.
- Neutral contact tone: primary CTA text is exactly **"Get in touch"**. The words "hire", "available for", "open to work" and "freelance" must not appear anywhere in rendered copy.
- Headline copy: "Front-end developer with 10+ years of experience, now shipping full-stack apps faster with AI-assisted development."
- Phone `+977 9843679155` → `tel:+9779843679155` and `https://wa.me/9779843679155`. Email `shailendra.matat@gmail.com` → `mailto:`.
- Experience: Matat Nepal Web Applications Pvt. Ltd. (current); Rapid Web Solutions Pvt. Ltd., Kathmandu (2014–2024).
- Interests: music and sports, shown only as an "Off the clock" line in About.
- Professional tone: no cartoon illustration, no playful metaphors.
- Light and dark mode: defaults to the system preference; the toggle persists to `localStorage` key `theme`.
- Motion: subtle fade-ins only; none when `prefers-reduced-motion: reduce`.
- Quality bar: Lighthouse ≥ 95 in all four categories (mobile); no horizontal scroll at 360px; WCAG AA; keyboard navigable; zero axe violations.
- Missing owner content uses `TBC_` placeholders (see Task 2). Production builds fail while any remain.
- Web3Forms key comes from env var `PUBLIC_WEB3FORMS_KEY`.

## Review Focus

1. **Contact form failure:** with a network error, a non-200 response or a missing key, the visitor sees a clear error that includes the email address as a fallback, and their typed message is kept. (Task 6 tests.)
2. **Phone-width menu:** at 360px, tapping a menu link scrolls to the section and closes the menu, and the page never scrolls sideways. (Task 3 and Task 8 tests.)
3. **Theme flash:** a visitor who chose dark mode doesn't see a light flash on reload. The theme is applied before first paint. (Task 3 test.)
4. **No JavaScript:** nav anchors work and the form still submits natively to Web3Forms. (Task 6 test.)
5. **Placeholders leaking to production:** a `TBC_` value must never reach the live site. (Task 2 test and `check:content` script.)

---

### Task 1: Scaffold, layout shell, SEO head and tooling

**Files:**
- Create: Astro project at root (`package.json`, `astro.config.mjs`, `tsconfig.json`), `src/styles/global.css`, `src/layouts/Base.astro`, `src/pages/index.astro`, `public/favicon.svg`, `public/robots.txt`, `.gitignore`, `playwright.config.ts`, `vitest.config.ts`, `tests/e2e/head.spec.ts`

**Interfaces:**
- Produces: `Base.astro` props `{ title: string; description: string }` with a default slot. CSS colour tokens in `global.css`: `--bg`, `--fg`, `--muted`, `--border`, `--accent`, `--accent-fg`, `--card`, defined for `:root` and `:root.dark`. Tailwind is configured with `@custom-variant dark (&:where(.dark, .dark *));`.
- npm scripts: `dev`, `build`, `preview`, `test` (vitest run), `test:e2e` (playwright test against `astro preview` on port 4321).

- [ ] **Step 1:** `git init`. Scaffold with `npm create astro@latest . -- --template minimal --typescript strict --no-install --no-git`, then `npm i` and `npx astro add tailwind sitemap --yes`. Install dev deps: `vitest @playwright/test @axe-core/playwright @lhci/cli`, then `npx playwright install chromium`. Add `.superpowers/`, `node_modules/`, `dist/`, `.env` and `.lighthouseci/` to `.gitignore`. Set `site: 'https://example.com'` in `astro.config.mjs` (replaced at launch).
- [ ] **Step 2: Write the failing test** `tests/e2e/head.spec.ts`:
  - `has title, description and Open Graph tags`: `<title>` contains "Shailendra"; `meta[name=description]`, `meta[property="og:title"]`, `meta[property="og:image"]` and `meta[name="twitter:card"]` exist.
  - `has Person JSON-LD`: `script[type="application/ld+json"]` parses to an object with `@type === "Person"` and `email === "mailto:shailendra.matat@gmail.com"`.
  - `has skip link`: the first focusable element is `a[href="#main"]`.
- [ ] **Step 3:** Run `npm run build && npm run test:e2e -- head`. Expected: FAIL.
- [ ] **Step 4:** Implement `Base.astro`: `lang="en"`, meta, OG/Twitter tags (`og:image` = `/og.png`; Task 7 creates the image), Person JSON-LD, skip link, `<main id="main">`, and the global.css tokens. Use the system font stack or one self-hosted variable font such as Inter via `@fontsource-variable/inter`, without Google Fonts, to protect Lighthouse scores.
- [ ] **Step 5:** Run the tests. Expected: PASS.
- [ ] **Step 6:** Commit, including `docs/`: `git add -A && git commit -m "chore: scaffold Astro portfolio with SEO head and test tooling"`.

### Task 2: Content data and placeholder guard

**Files:**
- Create: `src/data/profile.ts`, `src/lib/contact.ts`, `scripts/check-content.mjs`, `tests/unit/contact.test.ts`, `tests/unit/profile.test.ts`

**Interfaces:**
- Produces from `src/data/profile.ts` (all `export const`):
  - `profile: { name: string; headline: string; roles: [string, string, string]; bio: string; offTheClock: string; photo: string; cvUrl: string }`. `roles` holds the three hero lines from spec §6.2. `photo` is `/photo.jpg`; `cvUrl` is `/cv.pdf`.
  - `contact: { phone: '+977 9843679155'; email: 'shailendra.matat@gmail.com'; linkedin: string; github: string }`
  - `skillGroups: { title: string; items: string[] }[]`, with the six groups from spec §5 in this order: Hand-coded, Platforms, Conversion / CRO, Full-stack + AI, Design to code, Tooling.
  - `experienceLabel = '10+ years'`
  - `journey: { period: string; tag: 'Work' | 'Education'; title: string; org: string; description: string }[]`, newest first: Matat (period `'TBC_START – Present'`), Rapid Web Solutions (`'2014 – 2024'`), then an Education entry with TBC values.
  - Unknown values use strings starting `TBC_` (e.g. `'TBC_SURNAME'`, `'TBC_LINKEDIN_URL'`, `'TBC_AI_TOOLS'`).
- Produces from `src/lib/contact.ts`: `telHref(phone: string): string`, `whatsappHref(phone: string): string`, `mailtoHref(email: string): string`, `findPlaceholders(value: unknown, path?: string): string[]` (returns dotted paths of every string starting with `TBC_`, recursing through objects and arrays).

- [ ] **Step 1: Write the failing tests** `tests/unit/contact.test.ts`:
  - `telHref('+977 9843679155') === 'tel:+9779843679155'`
  - `whatsappHref('+977 9843679155') === 'https://wa.me/9779843679155'`
  - `mailtoHref('shailendra.matat@gmail.com') === 'mailto:shailendra.matat@gmail.com'`
  - `findPlaceholders({a:'TBC_X', b:['ok',{c:'TBC_Y'}]})` deep-equals `['a','b.1.c']`
- [ ] **Step 2:** Write the failing tests in `tests/unit/profile.test.ts`:
  - `profile.headline` equals the exact headline in Global Constraints.
  - `skillGroups.map(g => g.title)` equals the six titles in order.
  - `journey[1]` has `org` containing "Rapid Web Solutions" and `period === '2014 – 2024'`.
  - `JSON.stringify({profile, skillGroups, journey})` does not match `/hire|available for|open to work|freelance/i`.
- [ ] **Step 3:** Run `npm test`. Expected: FAIL (modules missing).
- [ ] **Step 4:** Implement both modules. Draft a professional bio of 2–3 sentences and an `offTheClock` line mentioning music and sports.
- [ ] **Step 5:** Implement `scripts/check-content.mjs`. It imports the data through `vite-node` or a `tsx` dev dependency, runs `findPlaceholders` over all exports, prints each path, and exits 1 if any exist. Add npm scripts `check:content` and `build:prod` (`npm run check:content && astro build`).
- [ ] **Step 6:** Run `npm test` (expected: PASS) and `npm run check:content` (expected: exit 1, listing the TBC paths). Exit 1 is correct at this stage.
- [ ] **Step 7:** Commit: `feat: add typed profile content and placeholder guard`.

### Task 3: Header, mobile menu and theme toggle

**Files:**
- Create: `src/components/Header.astro`, `src/components/ThemeToggle.astro`, `tests/e2e/header.spec.ts`
- Modify: `src/layouts/Base.astro` (inline theme script in `<head>`, render `Header`)

**Interfaces:**
- Consumes: `profile.name` and `contact` from Task 2; CSS tokens from Task 1.
- Produces: header element `header[data-testid="site-header"]` (sticky); menu button `button[aria-controls="mobile-menu"]` with `aria-expanded`; theme button `button[data-testid="theme-toggle"]` with an `aria-label`.

- [ ] **Step 1: Write the failing tests** `tests/e2e/header.spec.ts`:
  - `nav links in order`: the desktop nav link texts equal `['About','Skills','Journey','Contact']`; hrefs are `#about`, `#skills`, `#journey`, `#contact`; the Contact link is styled as a button (has `data-variant="cta"`).
  - `header stays visible after scroll`: scroll to the bottom; the header bounding box `y` equals 0.
  - `mobile menu opens and closes on link tap` (viewport 360×740): click the menu button, `aria-expanded="true"`, click "Skills", the menu is hidden and `aria-expanded="false"`, and the URL hash is `#skills`.
  - `Escape closes mobile menu`.
  - `theme follows system`: with `colorScheme: 'dark'`, `html` has class `dark`.
  - `theme toggle persists without flash`: with `colorScheme: 'light'`, click the toggle (to dark) and assert `localStorage.theme === 'dark'`. Register a `page.addInitScript` that records `document.documentElement.classList.contains('dark')` into `window.__darkAtDCL` on `DOMContentLoaded`, reload, and assert `__darkAtDCL === true`.
- [ ] **Step 2:** Run `npm run build && npm run test:e2e -- header`. Expected: FAIL.
- [ ] **Step 3:** Implement. The theme script goes inline (`is:inline`) in `<head>`: it reads `localStorage.theme` in a try/catch, falls back to `matchMedia('(prefers-color-scheme: dark)')`, and sets the class on `<html>`. The mobile menu uses a small script that toggles `hidden` and `aria-expanded`, closes on link click and Escape, and returns focus to the button. Sections need `scroll-margin-top` so the sticky header doesn't cover headings.
- [ ] **Step 4:** Run the tests. Expected: PASS.
- [ ] **Step 5:** Commit: `feat: add sticky header, mobile menu and theme toggle`.

### Task 4: Hero and About sections

**Files:**
- Create: `src/components/Hero.astro`, `src/components/About.astro`, `public/photo.jpg` (neutral placeholder), `public/cv.pdf` (one-page placeholder PDF reading "CV coming soon"), `tests/e2e/hero-about.spec.ts`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes: `profile`, `contact` (Task 2).
- Produces: `section#about`; hero CTAs `a[data-testid="cta-contact"]` (href `#contact`, text "Get in touch") and `a[data-testid="cta-cv"]` (href `/cv.pdf`, has the `download` attribute).

- [ ] **Step 1: Write the failing tests:**
  - `hero shows name, three roles and headline`: the `h1` contains `profile.name`; exactly 3 role list items; the headline text is visible.
  - `hero CTAs`: the attributes are as in Interfaces.
  - `photo has alt and dimensions`: `img` in the hero has non-empty `alt` and `width`/`height` attributes.
  - `about has Off the clock line mentioning music and sports`: `#about` text matches `/music/i` and `/sports/i`.
- [ ] **Step 2:** Run. Expected: FAIL.
- [ ] **Step 3:** Implement. Render the hero image with Astro `<Image>` (from `src/assets/` if needed for optimisation) using `loading="eager"` and `fetchpriority="high"`, since it is the LCP element. The layout is two columns on desktop (photo, text) and stacked on mobile.
- [ ] **Step 4:** Run. Expected: PASS.
- [ ] **Step 5:** Commit: `feat: add hero and about sections`.

### Task 5: Skills and Journey sections

**Files:**
- Create: `src/components/Skills.astro`, `src/components/Journey.astro`, `tests/e2e/skills-journey.spec.ts`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes: `skillGroups`, `experienceLabel` and `journey` (Task 2).
- Produces: `section#skills` and `section#journey`; cards `[data-testid="skill-card"]`; timeline entries `ol > li[data-testid="journey-item"]`.

- [ ] **Step 1: Write the failing tests:**
  - `skills shows stat and six cards in order`: `#skills` contains "10+ years"; 6 skill cards; the card `h3` texts equal the six group titles.
  - `journey is a numbered ordered list`: `#journey ol` has `journey.length` items; the first contains "Matat"; each has a visible tag ("Work" or "Education") and period.
- [ ] **Step 2:** Run. Expected: FAIL.
- [ ] **Step 3:** Implement. Skills use a responsive grid (1 / 2 / 3 columns). Journey uses a vertical line with zero-padded numbers ("01", "02").
- [ ] **Step 4:** Run. Expected: PASS.
- [ ] **Step 5:** Commit: `feat: add skills grid and journey timeline`.

### Task 6: Contact section and form

**Files:**
- Create: `src/components/Contact.astro`, `src/scripts/contact-form.ts`, `src/pages/thanks.astro` (no-JS redirect target), `.env.example`, `tests/e2e/contact.spec.ts`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes: `contact`, `telHref`, `whatsappHref` and `mailtoHref` (Task 2).
- Produces: `section#contact`; `form#contact-form` with `action="https://api.web3forms.com/submit"` and `method="POST"`; hidden inputs `access_key` (from `import.meta.env.PUBLIC_WEB3FORMS_KEY ?? 'TBC_WEB3FORMS_KEY'`), `redirect` (`<site>/thanks`), `subject` ("New message from portfolio"), and honeypot `botcheck` (a visually hidden checkbox); fields `name`, `email`, `phone` (optional) and `message`, all with `<label>`s; status region `[data-testid="form-status"]` with `role="status"` and `aria-live="polite"`.
- `contact-form.ts` exports `submitContact(form: HTMLFormElement, fetchImpl?: typeof fetch): Promise<{ ok: boolean; message: string }>`.

- [ ] **Step 1: Write the failing tests** `tests/e2e/contact.spec.ts` (mock `https://api.web3forms.com/submit` with `page.route`):
  - `channels`: the links have hrefs `tel:+9779843679155`, `https://wa.me/9779843679155` (with `target="_blank"` and `rel="noopener"`) and `mailto:shailendra.matat@gmail.com`.
  - `success`: fill the fields and submit, mocked with `{status:200, body:'{"success":true}'}`. The status shows "Thanks — I'll get back to you soon." and the form is reset.
  - `server error keeps input`: mocked 500. The status contains "shailendra.matat@gmail.com", and the message textarea still holds the typed text.
  - `network failure keeps input`: `route.abort()`. Same assertions as the server error test.
  - `missing key`: build without `PUBLIC_WEB3FORMS_KEY` (the default test build). Submitting shows the error with the email address and makes **no** network request.
  - `double submit sends once`: click submit twice quickly, and the route handler is called once (the button is disabled while sending).
  - `validation`: submitting empty is blocked by native `required`; an invalid email is blocked.
  - `no-JS submit posts natively`: in a context with `javaScriptEnabled: false`, submitting hits the mocked route with a form-encoded body that contains `access_key`.
  - `/thanks page`: has a link back to `/`.
- [ ] **Step 2:** Run. Expected: FAIL.
- [ ] **Step 3:** Implement `submitContact`. If the key starts with `TBC_`, return an error without calling fetch. Otherwise POST JSON to the action URL and return `ok` only if the response is 2xx and `json.success === true`. The error message is "Sorry, that didn't send. Please email me at shailendra.matat@gmail.com." The script intercepts `submit`, calls `preventDefault()`, disables the button while sending ("Sending…"), and resets the form only on success.
- [ ] **Step 4:** Run. Expected: PASS.
- [ ] **Step 5:** Add `.env.example` with `PUBLIC_WEB3FORMS_KEY=`. Commit: `feat: add contact section with Web3Forms form`.

### Task 7: Footer, scroll reveal and SEO extras

**Files:**
- Create: `src/components/Footer.astro`, `src/scripts/reveal.ts`, `public/og.png` (1200×630, with name and headline on the brand background), `tests/e2e/footer-motion.spec.ts`
- Modify: `src/pages/index.astro`, `src/styles/global.css`, `public/robots.txt` (sitemap line)

**Interfaces:**
- Consumes: `profile.name` and the CSS tokens.
- Produces: elements with `data-reveal` fade in once when they enter the viewport (IntersectionObserver adds the class `is-visible`).

- [ ] **Step 1: Write the failing tests:**
  - `footer has copyright year and back to top`: the footer text contains the current year, and `a[href="#top"]` exists (the header has `id="top"`).
  - `reduced motion shows content immediately`: with `reducedMotion: 'reduce'`, every `[data-reveal]` element has computed `opacity` "1" on load.
  - `content visible without JS`: with JS disabled, `[data-reveal]` elements have opacity "1". The hidden state applies only under an `html.js` class that the inline script sets.
  - `sitemap and og image exist`: `GET /sitemap-index.xml` and `GET /og.png` both return 200.
- [ ] **Step 2:** Run. Expected: FAIL.
- [ ] **Step 3:** Implement. The reveal animates opacity and a 12px translateY over 400ms, only inside `@media (prefers-reduced-motion: no-preference)` and under `html.js`. Apply `data-reveal` to section headings and cards.
- [ ] **Step 4:** Run. Expected: PASS.
- [ ] **Step 5:** Commit: `feat: add footer, subtle scroll reveal and SEO assets`.

### Task 8: Quality gate, copy rules and launch docs

**Files:**
- Create: `tests/e2e/quality.spec.ts`, `lighthouserc.json`, `vercel.json` (security headers and caching), `README.md`
- Modify: `package.json` (scripts `lhci`, `test:all`)

**Interfaces:**
- Consumes: the whole page.

- [ ] **Step 1: Write the failing or guard tests** `tests/e2e/quality.spec.ts`:
  - `no axe violations` in both light and dark themes (`AxeBuilder` with `wcag2a`, `wcag2aa`).
  - `no horizontal scroll at 360px`: `document.documentElement.scrollWidth <= 360`.
  - `copy rules`: `document.body.innerText` does not match `/hire|available for|open to work|freelance/i`, and the CTA text "Get in touch" appears at least once.
  - `no project gallery`: there is no element with an id or heading matching `/projects|portfolio|work samples/i`.
  - `keyboard reaches form`: tabbing from the top reaches `#contact-form [name=name]` and every focused element has a visible outline (computed `outline-style` is not "none" or `box-shadow` is set).
- [ ] **Step 2:** Run. Fix any failures in the owning component (not in the test).
- [ ] **Step 3:** Add `lighthouserc.json` (collect from `dist` via `staticDistDir`, mobile preset, assert `categories:performance|accessibility|best-practices|seo` `minScore: 0.95`). Run `npm run build && npx lhci autorun`. Expected: all assertions pass.
- [ ] **Step 4:** Add `vercel.json` with headers `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, and long-cache for `/_astro/*`.
- [ ] **Step 5:** Write `README.md` with:
  - Local dev and test commands.
  - **Owner setup:** create a Web3Forms key at web3forms.com with shailendra.matat@gmail.com, then put it in `.env` and in the Vercel env vars.
  - Pushing to GitHub and importing into Vercel.
  - Domain options (`.com.np` via register.com.np, or `.dev`/`.com`), and updating `site` in `astro.config.mjs`.
  - Replacing every `TBC_` value (list them from `npm run check:content`), `public/photo.jpg` and `public/cv.pdf`.
  - Vercel's build command is `npm run build:prod`, so placeholders block deploys.
- [ ] **Step 6:** Run `npm run test:all` (unit + e2e). Expected: PASS.
- [ ] **Step 7:** Commit: `chore: add quality gate, Vercel config and launch README`.
