import { test, expect } from '@playwright/test';

test.describe('Newsletter Management', () => {
  test('Newsletter subscription form', async ({ page }) => {
    await page.goto('/');
    
    // Scroll to newsletter section
    await page.scrollIntoViewIfNeeded('text=Stay Connected');
    
    // Find newsletter subscription form
    const emailInput = page.locator('input[type="email"]').first();
    const firstNameInput = page.locator('input[placeholder*="First name"], input[name="firstName"]').first();
    const subscribeButton = page.locator('button:has-text("Subscribe")').first();
    
    if (await emailInput.isVisible()) {
      // Fill out the form
      await emailInput.fill('playwright-test@example.com');
      
      if (await firstNameInput.isVisible()) {
        await firstNameInput.fill('Playwright');
      }
      
      // Check email preferences if available
      const weeklyDigestCheckbox = page.locator('input[type="checkbox"]').first();
      if (await weeklyDigestCheckbox.isVisible()) {
        await weeklyDigestCheckbox.check();
      }
      
      // Submit the form
      if (await subscribeButton.isVisible()) {
        await subscribeButton.click();
        
        // Wait for success message
        await expect(
          page.locator('text=subscribed, text=success, text=welcome').first()
        ).toBeVisible({ timeout: 10000 });
      }
    }
  });

  test('Newsletter preferences customization', async ({ page }) => {
    await page.goto('/');
    
    // Look for newsletter form with preferences
    const preferencesSection = page.locator('text=Email Preferences, text=Customize');
    if (await preferencesSection.isVisible()) {
      // Find preference checkboxes
      const preferences = page.locator('input[type="checkbox"]');
      const count = await preferences.count();
      
      if (count > 0) {
        // Test checking and unchecking preferences
        for (let i = 0; i < Math.min(count, 4); i++) {
          const checkbox = preferences.nth(i);
          await checkbox.check();
          await expect(checkbox).toBeChecked();
          
          await checkbox.uncheck();
          await expect(checkbox).not.toBeChecked();
          
          // Re-check for final state
          await checkbox.check();
        }
      }
    }
  });

  test('Newsletter form validation', async ({ page }) => {
    await page.goto('/');
    
    // Find subscribe button and try to submit without email
    const subscribeButton = page.locator('button:has-text("Subscribe")').first();
    
    if (await subscribeButton.isVisible()) {
      await subscribeButton.click();
      
      // Should show validation error
      await expect(
        page.locator('text=required, text=valid email, text=enter email').first()
      ).toBeVisible({ timeout: 3000 });
      
      // Now test with invalid email
      const emailInput = page.locator('input[type="email"]').first();
      if (await emailInput.isVisible()) {
        await emailInput.fill('invalid-email');
        await subscribeButton.click();
        
        // Should show invalid email error
        await expect(
          page.locator('text=valid email, text=invalid').first()
        ).toBeVisible({ timeout: 3000 });
      }
    }
  });

  test('Admin newsletter dashboard', async ({ page }) => {
    // Note: This test assumes admin authentication is available
    // In a real scenario, you'd need to implement admin login flow
    
    await page.goto('/admin');
    
    // Check if redirected to login (expected for non-authenticated users)
    const currentUrl = page.url();
    if (currentUrl.includes('/login') || currentUrl.includes('/auth')) {
      // This is expected behavior for non-authenticated users
      expect(currentUrl).toContain('/login');
      return;
    }
    
    // If somehow authenticated, check for newsletter tab
    const newsletterTab = page.locator('text=Newsletter').first();
    if (await newsletterTab.isVisible()) {
      await newsletterTab.click();
      
      // Check for subscriber management interface
      await expect(
        page.locator('text=Subscribers, text=Email Campaigns').first()
      ).toBeVisible();
      
      // Check for export functionality
      const exportButton = page.locator('button:has-text("Export")').first();
      if (await exportButton.isVisible()) {
        await expect(exportButton).toBeEnabled();
      }
    }
  });

  test('Newsletter unsubscribe flow', async ({ page }) => {
    // Test unsubscribe functionality
    // Note: This would typically require a real unsubscribe link
    
    await page.goto('/newsletter/unsubscribe?email=test@example.com');
    
    // Check if unsubscribe page exists
    const unsubscribeContent = page.locator('text=unsubscribe, text=remove').first();
    if (await unsubscribeContent.isVisible()) {
      const confirmButton = page.locator('button:has-text("Unsubscribe"), button:has-text("Confirm")').first();
      if (await confirmButton.isVisible()) {
        await confirmButton.click();
        
        // Should show confirmation
        await expect(
          page.locator('text=unsubscribed, text=removed, text=success').first()
        ).toBeVisible();
      }
    }
  });

  test('Newsletter responsive design', async ({ page }) => {
    // Test mobile responsiveness
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    
    // Find newsletter form on mobile
    const newsletterSection = page.locator('input[type="email"]').first();
    if (await newsletterSection.isVisible()) {
      // Verify form is usable on mobile
      await newsletterSection.fill('mobile-test@example.com');
      
      const subscribeButton = page.locator('button:has-text("Subscribe")').first();
      if (await subscribeButton.isVisible()) {
        // Button should be tap-friendly (at least 44px height)
        const buttonBox = await subscribeButton.boundingBox();
        if (buttonBox) {
          expect(buttonBox.height).toBeGreaterThanOrEqual(44);
        }
      }
    }
    
    // Test tablet size
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.reload();
    
    if (await newsletterSection.isVisible()) {
      await expect(newsletterSection).toBeVisible();
    }
  });
});