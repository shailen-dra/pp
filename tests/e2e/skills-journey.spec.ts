import { test, expect } from '@playwright/test';
import { journey, skillGroups } from '../../src/data/profile';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('skills shows stat and six cards in order', async ({ page }) => {
  const skills = page.locator('section#skills');
  await expect(skills).toContainText('10+ years');
  const cards = skills.locator('[data-testid="skill-card"]');
  await expect(cards).toHaveCount(6);
  await expect(cards.locator('h3')).toHaveText(skillGroups.map((g) => g.title));
});

test('journey is a numbered ordered list', async ({ page }) => {
  const items = page.locator('section#journey ol > li[data-testid="journey-item"]');
  await expect(items).toHaveCount(journey.length);
  await expect(items.first()).toContainText('Matat');
  for (let i = 0; i < journey.length; i++) {
    const item = items.nth(i);
    await expect(item.locator('[data-testid="journey-tag"]')).toHaveText(/^(Work|Education)$/);
    await expect(item.locator('[data-testid="journey-tag"]')).toBeVisible();
    await expect(item.getByText(journey[i].period)).toBeVisible();
  }
});
