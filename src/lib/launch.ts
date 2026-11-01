import { createHash } from 'node:crypto';

const PLACEHOLDER_DOMAIN = 'example.com';

// SHA-256 of the stub files committed with the scaffold. Replace the files, not these hashes.
const STUB_ASSETS: Record<string, string> = {
  'public/cv.pdf': 'e754e7fe1ef8e21fa63857ac0669fab1ad19e3ded6965b79b4f1f0568ab038e8',
  'public/photo.jpg': 'fb1f4258c4addbfd9aea035c837dbb3c6a6efe9fb07c626c907384707bc1882b',
};

/** Problems if the site URL or robots.txt still use the placeholder domain. */
export function siteBlockers(site: string, robots: string): string[] {
  const blockers: string[] = [];
  if (site.includes(PLACEHOLDER_DOMAIN)) blockers.push(`astro.config.mjs: site is still ${site}`);
  if (robots.includes(PLACEHOLDER_DOMAIN)) blockers.push(`public/robots.txt: Sitemap line still uses ${PLACEHOLDER_DOMAIN}`);
  return blockers;
}

/** Problems for every file that is still the scaffold's stub. */
export function assetBlockers(files: Record<string, Uint8Array>): string[] {
  return Object.entries(files)
    .filter(([path, data]) => STUB_ASSETS[path] === createHash('sha256').update(data).digest('hex'))
    .map(([path]) => `${path}: still the placeholder file`);
}
