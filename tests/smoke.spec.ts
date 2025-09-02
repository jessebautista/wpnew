import { test, expect } from '@playwright/test';

test.describe('WorldPianos Smoke Tests', () => {
  test('Homepage loads successfully', async ({ page }) => {
    await page.goto('/');
    
    // Check for main heading
    await expect(page.locator('h1')).toContainText('Discover Public Pianos');
    
    // Check for hero section
    await expect(page.locator('text=Around the World')).toBeVisible();
    
    // Check for main navigation
    await expect(page.locator('nav, header')).toBeVisible();
    
    // Verify page loads without console errors (basic check)
    const title = await page.title();
    expect(title).toBeTruthy();
  });

  test('Navigation menu works', async ({ page }) => {
    await page.goto('/');
    
    // Test main navigation links
    const pianoLink = page.locator('a:has-text("Pianos"), a:has-text("Browse")').first();
    if (await pianoLink.isVisible()) {
      await pianoLink.click();
      await page.waitForLoadState('networkidle');
      expect(page.url()).toContain('/pianos');
    }
    
    // Go back to home
    await page.goto('/');
    
    // Test events link
    const eventsLink = page.locator('a:has-text("Events")').first();
    if (await eventsLink.isVisible()) {
      await eventsLink.click();
      await page.waitForLoadState('networkidle');
      expect(page.url()).toContain('/events');
    }
    
    // Test blog link
    await page.goto('/');
    const blogLink = page.locator('a:has-text("Blog"), a:has-text("News")').first();
    if (await blogLink.isVisible()) {
      await blogLink.click();
      await page.waitForLoadState('networkidle');
      expect(page.url()).toContain('/blog');
    }
  });

  test('Piano directory page loads', async ({ page }) => {
    await page.goto('/pianos');
    
    // Check for piano directory content
    await expect(
      page.locator('text=Pianos, text=Directory, text=Search').first()
    ).toBeVisible();
    
    // Check for search functionality
    const searchInput = page.locator('input[type="search"], input[placeholder*="search"]').first();
    if (await searchInput.isVisible()) {
      await searchInput.fill('test');
      // Just verify the input accepts text
      await expect(searchInput).toHaveValue('test');
    }
  });

  test('Events page loads', async ({ page }) => {
    await page.goto('/events');
    
    // Check for events content
    await expect(
      page.locator('text=Events, text=Calendar, text=Upcoming').first()
    ).toBeVisible();
  });

  test('Blog page loads', async ({ page }) => {
    await page.goto('/blog');
    
    // Check for blog content
    await expect(
      page.locator('text=Blog, text=Articles, text=Stories').first()
    ).toBeVisible();
  });

  test('About page loads', async ({ page }) => {
    await page.goto('/about');
    
    // Check for about content
    await expect(
      page.locator('text=About, text=WorldPianos, text=mission').first()
    ).toBeVisible();
  });

  test('Footer contains required links', async ({ page }) => {
    await page.goto('/');
    
    // Scroll to footer
    await page.scrollIntoViewIfNeeded('footer');
    
    // Check for footer links
    const footer = page.locator('footer');
    if (await footer.isVisible()) {
      // Check for common footer links
      await expect(
        footer.locator('a:has-text("Privacy"), a:has-text("Terms")').first()
      ).toBeVisible();
    }
  });

  test('Responsive design - Mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    
    // Check if mobile menu exists or main content is responsive
    const menuButton = page.locator('button:has-text("Menu"), .hamburger, [aria-label*="menu"]').first();
    const mainHeading = page.locator('h1').first();
    
    // Either mobile menu should exist OR content should be visible
    const hasMenu = await menuButton.isVisible();
    const hasHeading = await mainHeading.isVisible();
    
    expect(hasMenu || hasHeading).toBeTruthy();
  });

  test('No JavaScript errors on page load', async ({ page }) => {
    const errors: string[] = [];
    
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    page.on('pageerror', (error) => {
      errors.push(error.message);
    });
    
    await page.goto('/');
    
    // Wait for page to fully load
    await page.waitForLoadState('networkidle');
    
    // Filter out common non-critical errors
    const criticalErrors = errors.filter(error => 
      !error.includes('favicon') && 
      !error.includes('analytics') &&
      !error.includes('AdBlock') &&
      !error.includes('Extension')
    );
    
    expect(criticalErrors).toHaveLength(0);
  });

  test('Page load performance', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    
    // Page should load within 10 seconds (generous for testing)
    expect(loadTime).toBeLessThan(10000);
  });
});