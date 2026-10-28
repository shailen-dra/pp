# Personal Portfolio Website — Design

**Owner:** Shailendra (Kathmandu, Nepal)
**Date:** 2026-10-28
**Status:** Ready for owner review

## 1. Intent

A personal portfolio site whose single job is to get **recruiters** and **potential clients** to **contact Shailendra**.

Shailendra is a front-end developer with 10+ years of experience who is now building full-stack apps faster with AI tools. Shailendra does not want to show client work. The site presents their **experience and skills** instead, and the site itself is the work sample: its quality, speed and polish are the proof.

## 2. Goals

- A visitor understands within a few seconds who Shailendra is, what they do and how long they have done it.
- A visitor can reach a contact action (call/WhatsApp, email, form) from anywhere on the page with minimal effort.
- The design looks clean and professional.
- The site is technically excellent: fast, responsive, accessible and well built. (Owner's intent is "clean and professional"; the performance bar is the builder's interpretation of "the site is the sample.")

## 3. Non-goals

- **No project gallery or case studies.** Do not show client work, screenshots, client names beyond their employers, or live client links. (Owner decision.)
- No blog, CMS or admin panel.
- No hobby sub-sections like the reference site's Games, Gym, Garage and Journal.

## 4. Anti-goals (failure even if it "works")

- Looking playful, gimmicky or template-like. Keep it professional. (Owner decision.)
- Heavy animations or effects that slow the page or distract from the content.
- Contact info that is hard to find.
- Poor scores on mobile or on Lighthouse. This would undermine the "site is the sample" message.

## 5. Content

### Positioning / headline
> Front-end developer with 10+ years of experience, now shipping full-stack apps faster with AI-assisted development.

"AI" means **using AI tools to build full-stack apps faster** (owner confirmed), not building AI features. Name the specific tools Shailendra uses (see §9).

### Experience
| Period | Company | Summary |
|---|---|---|
| Current (start date TBC) | Matat Nepal Web Applications Pvt. Ltd. | E-commerce sites on WordPress and Shopify; web app integrations for CRO (conversion rate optimisation) on Shopify. |
| 2014 – 2024 | Rapid Web Solutions Pvt. Ltd., Kathmandu | Front-end development: mostly designing sites and converting designs into working websites. |

### Skills (grouped as cards)
Proposed groups (builder's call; owner can rename):
- **Hand-coded:** HTML, CSS, JavaScript, responsive builds
- **Platforms:** Shopify (themes, apps/integrations), WordPress
- **Conversion / CRO:** Shopify CRO integrations
- **Full-stack + AI:** AI-assisted full-stack development (tools TBC)
- **Design to code:** turning designs into pixel-accurate sites
- **Tooling:** Git, build tools, etc. (TBC)

### Personal
Interests: **music and sports**. Show these as a short "Off the clock" line in the About section, not as a separate section.

### Contact
- Phone / WhatsApp: **+977 9843679155** (click-to-call `tel:` link and a `wa.me` link)
- Email: **shailendra.matat@gmail.com**
- Contact form that delivers to that email
- LinkedIn / GitHub links (URLs TBC)

**Tone of availability (owner decision):** use a neutral **"Get in touch"**. Do not use "available for hire", "open to work" or "taking freelance projects" badges or wording, because Shailendra is currently employed at Matat. Buttons and headings say "Get in touch" rather than "Hire me".

## 6. Structure

A single page with anchor-linked sections. The structure is modelled on https://prajalbariya.com.np/ (owner's reference), with a professional tone instead of a playful one.

1. **Sticky top navigation:** name/logo on the left; About · Skills · Journey · Contact on the right, with Contact highlighted. On mobile, a hamburger menu. Include a skip-to-content link.
2. **Hero:** professional photo, name, three short role lines (front-end 10+ yrs · Shopify/WordPress e-commerce + CRO · full-stack with AI), and two buttons: **Get in touch** and **Download CV**.
3. **About:** short bio with a confident headline, ending with an "Off the clock" line for music and sports.
4. **Skills:** a large stat headline (e.g. "10+ years"), then a grid of grouped skill cards (§5).
5. **Journey:** a numbered vertical timeline. Each entry has a date, a tag (Work / Education), a title and a one- or two-line description.
6. **Contact:** contact channels on one side and the form (name, email, message, optional phone) on the other.
7. **Footer:** copyright line and a "Back to top" link.

Leave out the reference site's cartoon illustration, its car metaphor and its playful headlines.

## 7. Design direction

- Clean and professional: restrained palette (neutral base plus one accent colour), strong typography, generous whitespace.
- Light and dark mode, following the system preference, with a toggle.
- Subtle motion only, such as gentle fade-ins on scroll. Respect `prefers-reduced-motion`.
- Exact colours, fonts and visual details are the builder's call within this direction.

## 8. Technical decisions (Claude's defaults, accepted by the owner)

The owner asked Claude to pick sensible defaults:
- **Framework:** Astro (static output, minimal JS)
- **Styling:** Tailwind CSS
- **Hosting:** Vercel free tier, auto-deploying from a GitHub repo
- **Contact form:** Web3Forms (free, sends to email, spam protection). No custom backend.
- **Domain:** `.com.np` (free for Nepali citizens) or `.dev`/`.com`. Decide at launch.
- **SEO:** meta tags, Open Graph/Twitter cards (good LinkedIn previews), sitemap, `Person` JSON-LD
- **CV:** a static PDF in the site's assets

### Accounts and setup (Claude's call)
- The builder's plan includes creating the Astro project, the GitHub repo and the Vercel deploy config, plus step-by-step instructions for anything only the owner can do.
- **Owner action:** create a free Web3Forms access key from shailendra.matat@gmail.com and supply it as an environment variable. Until then, the form uses a placeholder key and shows a graceful error.
- The GitHub and Vercel accounts are the owner's own.

### Quality bar
- Lighthouse ≥ 95 on Performance, Accessibility, Best Practices and SEO (mobile)
- Fully responsive from 360px up
- WCAG AA contrast; keyboard-navigable; semantic HTML

## 9. Content still needed from the owner

The builder should use clearly marked placeholders for these until they are provided:
- Full name / surname as it should appear
- Professional photo
- Start date at Matat; job titles at both companies
- Education entry (if any) for the timeline
- Specific AI tools used (e.g. Claude Code, Cursor, Copilot)
- Exact full-stack tech (backend, database) Shailendra works with
- LinkedIn and GitHub URLs
- CV PDF
- Short bio text (the builder can draft one for owner review)

## 10. Left to the builder

- Exact visual design, colours, fonts, spacing and component styling
- Code structure, component breakdown and content data format (e.g. a single content file)
- Wording of section headlines and bio drafts (owner reviews them)
- Analytics (optional; prefer privacy-friendly, e.g. Vercel Analytics)
