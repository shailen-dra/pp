// Fails the build while any TBC_ placeholder remains in the site content.
// Run with tsx so the TypeScript data module can be imported directly.
import * as content from '../src/data/profile.ts';
import { findPlaceholders } from '../src/lib/contact.ts';

const paths = findPlaceholders(content);

if (paths.length > 0) {
  console.error(`Found ${paths.length} TBC_ placeholder(s) in src/data/profile.ts:`);
  for (const path of paths) console.error(`  - ${path}`);
  process.exit(1);
}

console.log('No placeholders found.');
