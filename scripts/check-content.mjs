// Fails the build while any placeholder remains: TBC_ values in the site content,
// the example.com site URL, or the stub CV and photo.
// Run with tsx so the TypeScript modules can be imported directly.
import { readFileSync } from 'node:fs';
import config from '../astro.config.mjs';
import * as content from '../src/data/profile.ts';
import { findPlaceholders } from '../src/lib/contact.ts';
import { assetBlockers, siteBlockers } from '../src/lib/launch.ts';

const problems = [
  ...findPlaceholders(content).map((path) => `src/data/profile.ts: ${path}`),
  ...siteBlockers(String(config.site ?? ''), readFileSync('public/robots.txt', 'utf8')),
  ...assetBlockers({
    'public/cv.pdf': readFileSync('public/cv.pdf'),
    'public/photo.jpg': readFileSync('public/photo.jpg'),
  }),
];

if (problems.length > 0) {
  console.error(`Found ${problems.length} placeholder(s) that must be replaced before launch:`);
  for (const problem of problems) console.error(`  - ${problem}`);
  process.exit(1);
}

console.log('No placeholders found.');
