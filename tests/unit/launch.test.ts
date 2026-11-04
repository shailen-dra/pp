import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { assetBlockers, siteBlockers } from '../../src/lib/launch';

const realRobots = 'User-agent: *\nAllow: /\n\nSitemap: https://shailendra.dev/sitemap-index.xml\n';

describe('siteBlockers', () => {
  it('flags the placeholder site in astro.config', () => {
    expect(siteBlockers('https://example.com', realRobots)).toHaveLength(1);
  });

  it('flags the placeholder domain in robots.txt', () => {
    const robots = 'Sitemap: https://example.com/sitemap-index.xml\n';
    expect(siteBlockers('https://shailendra.dev', robots)).toHaveLength(1);
  });

  it('passes a real domain', () => {
    expect(siteBlockers('https://shailendra.dev', realRobots)).toEqual([]);
  });
});

describe('assetBlockers', () => {
  it('flags the stub CV and photo shipped with the scaffold', () => {
    const blockers = assetBlockers({
      'public/cv.pdf': readFileSync('public/cv.pdf'),
      'public/photo.jpg': readFileSync('public/photo.jpg'),
    });
    expect(blockers).toHaveLength(2);
  });

  it('passes replaced files', () => {
    expect(assetBlockers({ 'public/cv.pdf': Buffer.from('real cv'), 'public/photo.jpg': Buffer.from('real photo') })).toEqual([]);
  });
});

describe('assetBlockers og image', () => {
  it('flags the og.png generated without a full name', () => {
    expect(assetBlockers({ 'public/og.png': readFileSync('public/og.png') })).toHaveLength(1);
  });
});
