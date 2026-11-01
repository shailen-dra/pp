import { describe, expect, it } from 'vitest';
import { journey, profile, skillGroups } from '../../src/data/profile';

describe('profile content', () => {
  it('uses the agreed headline', () => {
    expect(profile.headline).toBe(
      'Front-end developer with 10+ years of experience, now shipping full-stack apps faster with AI-assisted development.',
    );
  });

  it('lists the six skill groups in order', () => {
    expect(skillGroups.map((g) => g.title)).toEqual([
      'Hand-coded',
      'Platforms',
      'Conversion / CRO',
      'Full-stack + AI',
      'Design to code',
      'Tooling',
    ]);
  });

  it('includes Rapid Web Solutions from 2014 to 2024', () => {
    expect(journey[1].org).toContain('Rapid Web Solutions');
    expect(journey[1].period).toBe('2014 – 2024');
  });

  it('never uses availability wording', () => {
    expect(JSON.stringify({ profile, skillGroups, journey })).not.toMatch(
      /hire|available for|open to work|freelance/i,
    );
  });
});
