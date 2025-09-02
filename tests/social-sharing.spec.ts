import { test, expect } from '@playwright/test';

test.describe('Social Sharing Features', () => {
  test.beforeEach(async ({ page }) => {
    // Mock the clipboard API for testing
    await page.addInitScript(() => {
      Object.assign(navigator, {
        clipboard: {
          writeText: async (text: string) => {
            (window as any).clipboardText = text;
            return Promise.resolve();
          }
        }
      });
    });
  });

  test('Homepage social sharing widget', async ({ page }) => {
    await page.goto('/');
    
    // Wait for the page to load
    await expect(page.locator('h1')).toContainText('Discover Public Pianos');
    
    // Check if social sharing widget exists
    await expect(page.locator('text=Share the Music')).toBeVisible();
    
    // Check if social media buttons are present
    await expect(page.getByTitle(/Follow us on/)).toHaveCount(5); // Facebook, Twitter, LinkedIn, Instagram, YouTube
    
    // Test the main share button
    const shareButton = page.locator('text=Share WorldPianos').first();
    await expect(shareButton).toBeVisible();
    
    // Click share button and verify it doesn't error
    await shareButton.click();
    // Note: Native share API might not work in test environment, that's expected
  });

  test('Piano detail page social sharing', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to a piano detail page
    await page.click('text=Browse Pianos');
    await page.waitForLoadState('networkidle');
    
    // Find and click on a piano card
    const pianoCard = page.locator('.card').first();
    if (await pianoCard.isVisible()) {
      await pianoCard.click();
      await page.waitForLoadState('networkidle');
      
      // Check for share button on piano detail page
      const shareButton = page.locator('button:has-text("Share")').first();
      if (await shareButton.isVisible()) {
        await shareButton.click();
        
        // Check if share options appear (either modal or dropdown)
        await expect(
          page.locator('text=Facebook, text=Twitter, text=LinkedIn').first()
        ).toBeVisible({ timeout: 3000 });
      }
    }
  });

  test('Social sharing modal functionality', async ({ page }) => {
    // Go to homepage
    await page.goto('/');
    
    // Look for any "More Options" or modal trigger button
    const moreOptionsButton = page.locator('text=More Options').first();
    if (await moreOptionsButton.isVisible()) {
      await moreOptionsButton.click();
      
      // Check if modal opened
      await expect(page.locator('.modal')).toBeVisible();
      
      // Test copy link functionality
      const copyButton = page.locator('button:has-text("Copy")').first();
      if (await copyButton.isVisible()) {
        await copyButton.click();
        
        // Verify copy feedback appears
        await expect(page.locator('text=Copied!')).toBeVisible({ timeout: 3000 });
      }
      
      // Close modal
      const closeButton = page.locator('button:has-text("Done"), button:has-text("✕")').first();
      if (await closeButton.isVisible()) {
        await closeButton.click();
      }
    }
  });

  test('Newsletter subscription with social sharing', async ({ page }) => {
    await page.goto('/');
    
    // Find newsletter subscription section
    await page.scrollIntoViewIfNeeded('text=Stay Connected');
    
    // Check if newsletter form exists
    const emailInput = page.locator('input[type="email"]').first();
    if (await emailInput.isVisible()) {
      await emailInput.fill('test@example.com');
      
      // Look for subscribe button
      const subscribeButton = page.locator('button:has-text("Subscribe")').first();
      if (await subscribeButton.isVisible()) {
        await subscribeButton.click();
        
        // Check for success message or confirmation
        await expect(
          page.locator('text=subscribed, text=success, text=thank you').first()
        ).toBeVisible({ timeout: 5000 });
      }
    }
  });

  test('Social media links are valid', async ({ page }) => {
    await page.goto('/');
    
    // Find social media links
    const facebookLink = page.locator('a[href*="facebook.com"]').first();
    const twitterLink = page.locator('a[href*="twitter.com"]').first();
    const linkedinLink = page.locator('a[href*="linkedin.com"]').first();
    
    // Check if links exist and have correct attributes
    if (await facebookLink.isVisible()) {
      await expect(facebookLink).toHaveAttribute('target', '_blank');
      await expect(facebookLink).toHaveAttribute('rel', 'noopener noreferrer');
    }
    
    if (await twitterLink.isVisible()) {
      await expect(twitterLink).toHaveAttribute('target', '_blank');
      await expect(twitterLink).toHaveAttribute('rel', 'noopener noreferrer');
    }
    
    if (await linkedinLink.isVisible()) {
      await expect(linkedinLink).toHaveAttribute('target', '_blank');
      await expect(linkedinLink).toHaveAttribute('rel', 'noopener noreferrer');
    }
  });

  test('Mobile responsive social sharing', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    
    // Check if social sharing is still accessible on mobile
    const shareButton = page.locator('button:has-text("Share")').first();
    if (await shareButton.isVisible()) {
      await shareButton.click();
      
      // Verify mobile-friendly sharing options appear
      await expect(page.locator('.modal, .dropdown-content')).toBeVisible();
    }
    
    // Check if social media buttons are responsive
    const socialButtons = page.locator('[class*="btn-circle"]');
    const count = await socialButtons.count();
    if (count > 0) {
      // Verify buttons are still clickable and visible on mobile
      for (let i = 0; i < Math.min(count, 3); i++) {
        await expect(socialButtons.nth(i)).toBeVisible();
      }
    }
  });
});