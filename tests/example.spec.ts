import { test, expect } from '@playwright/test';

test('WorldPianos basic functionality', async ({ page }) => {
  await page.goto('/');
  
  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/WorldPianos/);
  
  // Check that the main heading is visible
  const heading = page.locator('h1');
  await expect(heading).toBeVisible();
  
  // Verify some expected content exists
  await expect(page.getByText('Discover Public Pianos')).toBeVisible();
});